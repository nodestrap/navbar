// react:
import { default as React, useState, useRef, } from 'react'; // base technology of our nodestrap components
import { 
// compositions:
composition, mainComposition, imports, 
// layouts:
layout, vars, children, 
// rules:
rules, states, rule, } from '@cssfn/cssfn'; // cssfn core
import { 
// hooks:
createUseSheet, } from '@cssfn/react-cssfn'; // cssfn for react
import { createCssVar, } from '@cssfn/css-var'; // Declares & retrieves *css variables* (css custom properties).
import { createCssConfig, 
// utilities:
usesGeneralProps, usesPrefixedProps, usesSuffixedProps, overwriteProps, } from '@cssfn/css-config'; // Stores & retrieves configuration using *css custom properties* (css variables)
// nodestrap utilities:
import { useIsomorphicLayoutEffect, } from '@nodestrap/hooks';
import { 
// utilities:
isTypeOf, setRef, } from '@nodestrap/utilities';
// nodestrap components:
import { 
// react components:
Element, } from '@nodestrap/element';
import { 
// hooks:
usesSizeVariant, outlinedOf, mildOf, usesBorderStroke, usesBorderRadius, expandBorderRadius, usesPadding, expandPadding, usesAnim, 
// configs:
cssProps as bcssProps, } from '@nodestrap/basic';
import { 
// hooks:
isActivating, isPassivating, isPassived, isActive, useTogglerActive, Indicator, } from '@nodestrap/indicator';
import { 
// hooks:
markActive as controlMarkActive, usesThemeDefault as controlUsesThemeDefault, usesThemeActive as controlUsesThemeActive, isFocus, isArrive, } from '@nodestrap/control';
import { 
// hooks:
isPress, 
// styles:
usesActionControlLayout, usesActionControlVariants, usesActionControlStates, } from '@nodestrap/action-control';
import { 
// styles:
usesContainerLayout, usesContainerVariants, 
// configs:
cssProps as ccssProps, } from '@nodestrap/container';
import { useCurrentActive, NavButton, } from '@nodestrap/nav-button';
import { Check, } from '@nodestrap/check';
import TogglerMenuButton from '@nodestrap/toggler-menu-button';
export { useCurrentActive };
// hooks:
// states:
//#region activePassive
export const markActive = () => composition([
    imports([
        controlMarkActive(),
        mildOf(null),
        usesThemeActive(), // switch to active theme
    ]),
]);
export const dontMarkActive = () => composition([
    imports([
        outlinedOf(null),
        mildOf(null),
        usesThemeActive(null), // keeps current theme
    ]),
]);
// change default parameter from 'secondary' to `null`:
export const usesThemeDefault = (themeName = null) => controlUsesThemeDefault(themeName);
// change default parameter from 'primary' to 'secondary':
export const usesThemeActive = (themeName = 'secondary') => controlUsesThemeActive(themeName);
export const useCompactState = (props, navbarRef) => {
    // states:
    const [compactDn, setCompactDn] = useState(false); // uncontrollable (dynamic) state: true => compact mode, false => full mode
    /*
     * state is compact/full based on [controllable compact] (if set) and fallback to [uncontrollable compact]
     */
    const compactFn = props.compact /*controllable*/ ?? compactDn /*uncontrollable*/;
    useIsomorphicLayoutEffect(() => {
        const navbar = navbarRef.current;
        if (!navbar)
            return; // navbar was unloaded => nothing to do
        if (props.compact !== undefined)
            return; // controllable [compact] is set => no uncontrollable required
        // functions:
        const handleUpdate = async () => {
            // prepare the condition for dom measurement:
            const classList = navbar.classList;
            const hasCompact = classList.contains('compact');
            if (hasCompact) {
                // turn off ResizeObserver (to avoid triggering `ResizeObserver event` => firing `handleUpdate()`):
                turnOffResizeObserver();
                classList.remove('compact'); // kill compact mode, so we can measure the menu's overflows
            } // if
            // measuring the menu's overflows:
            const { scrollWidth, clientWidth, scrollHeight, clientHeight, } = navbar;
            // restore to original condition as before measurement:
            if (hasCompact) {
                classList.add('compact'); // <== warning: causing to trigger `ResizeObserver event` at the next event loop
                // turn on ResizeObserver soon (to avoid triggering `ResizeObserver event` => firing `handleUpdate()`):
                setTimeout(() => {
                    turnOnResizeObserver();
                }, 0);
            } // if
            // update the dynamic compact mode based on the measured menu's overflows:
            setCompactDn((scrollWidth > clientWidth)
                ||
                    (scrollHeight > clientHeight));
        };
        // setups:
        // update for the first time:
        handleUpdate();
        //#region update in the future
        //#region when navbar / navbar's items resized
        let initialResizeEvent = null;
        const resizeObserver = ResizeObserver ? new ResizeObserver(async (entries) => {
            // ignores the insertion dom event:
            if (initialResizeEvent) {
                initialResizeEvent = false;
                return;
            } // if
            // ignores the removal dom event:
            let items = entries.map((e) => e.target).filter((item) => {
                if (navbar.parentElement) { // navbar is still exist on the document
                    // check if the item is navbar itself or the child of navbar
                    if ((item === navbar) || (item.parentElement === navbar))
                        return true; // confirmed
                } // if
                resizeObserver?.unobserve(item); // no longer exist => remove from observer
                return false; // not the child of navbar
            });
            if (!items.length)
                return; // no existing items => nothing to do
            // ignores resizing by animations:
            items = items.filter((item) => (item.getAnimations().length === 0));
            if (!items.length)
                return; // no non_animating items => nothing to do
            // update after being resized:
            await handleUpdate();
        }) : null;
        const resizeObserverItems = [navbar, ...Array.from(navbar.children)];
        const turnOnResizeObserver = () => {
            if (resizeObserver && (initialResizeEvent === null)) {
                resizeObserverItems.forEach((item) => {
                    // update in the future:
                    initialResizeEvent = true; // prevent the insertion dom event
                    resizeObserver.observe(item, { box: 'border-box' });
                });
            } // if
        };
        const turnOffResizeObserver = () => {
            initialResizeEvent = null;
            resizeObserver?.disconnect();
        };
        turnOnResizeObserver();
        //#endregion when navbar / navbar's items resized
        //#endregion update in the future
        // cleanups:
        return () => {
            resizeObserver?.disconnect();
        };
    }, [props.compact, navbarRef]); // (re)run the setups & cleanups on every time the `props.compact` changes
    return {
        compact: compactFn,
        class: compactFn ? 'compact' : null,
    };
};
const [menusAnimRefs, menusAnimDecls] = createCssVar();
export const usesMenusAnim = () => {
    // dependencies:
    // animations:
    const [anim, animRefs] = usesAnim();
    return [
        () => composition([
            imports([
                // animations:
                anim(),
            ]),
            vars({
                [menusAnimDecls.anim]: animRefs.animNone,
            }),
            states([
                isActivating([
                    vars({
                        [menusAnimDecls.anim]: cssProps.menusAnimActive,
                    }),
                ]),
                isPassivating([
                    vars({
                        [menusAnimDecls.anim]: cssProps.menusAnimPassive,
                    }),
                ]),
            ]),
        ]),
        menusAnimRefs,
        menusAnimDecls,
    ];
};
//#endregion menus animations
// styles:
const wrapperElm = '.wrapper';
const logoElm = '.logo';
const togglerElm = '.toggler';
const menusElm = '.menus';
export const usesWrapperLayout = () => {
    // dependencies:
    // spacings:
    const [paddings] = usesPadding();
    return composition([
        imports([
            // spacings:
            paddings(),
        ]),
        layout({
            // layouts:
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            // spacings:
            ...expandPadding(), // expand padding css vars
        }),
    ]);
};
export const usesItemLayout = () => {
    return composition([
        layout({
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'item')), // apply general cssProps starting with item***
        }),
    ]);
};
export const usesSecondaryLayout = () => {
    // dependencies:
    // spacings:
    const [, , paddingDecls] = usesPadding();
    return composition([
        layout({
            // layouts:
            justifySelf: 'center',
            alignSelf: 'center',
            // spacings:
            [paddingDecls.paddingInline]: '0px',
            [paddingDecls.paddingBlock]: '0px', // discard padding
        }),
    ]);
};
export const usesLogoLayout = () => {
    return composition([
        layout({
            // layouts:
            gridArea: '1 / -3',
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'logo')), // apply general cssProps starting with logo***
        }),
    ]);
};
export const usesTogglerLayout = () => {
    return composition([
        layout({
            // layouts:
            gridArea: '1 / 2',
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'toggler')), // apply general cssProps starting with toggler***
        }),
    ]);
};
export const usesMenusLayout = () => {
    // dependencies:
    // animations:
    const [, menusAnimRefs] = usesMenusAnim();
    return composition([
        layout({
            // layouts:
            gridArea: 'menus',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            alignItems: 'stretch',
            flexWrap: 'nowrap',
            // animations:
            anim: menusAnimRefs.anim,
            // children:
            ...children('*', [
                imports([
                    usesMenuLayout(),
                    usesMenuVariants(),
                    usesMenuStates(),
                ]),
            ]),
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'menus')), // apply general cssProps starting with menus***
        }),
    ]);
};
export const usesMenusCompactLayout = () => {
    return composition([
        layout({
            // layouts:
            gridArea: '-1 / -3 / -1 / 3',
            flexDirection: 'column',
            // backgrounds:
            backg: 'inherit',
            // borders:
            borderBlock: 'inherit',
            // sizes:
            // supports for floating menus, fills the entire page's width
            inlineSize: 'fill-available',
            fallbacks: {
                inlineSize: '-moz-available',
            },
        }),
    ]);
};
export const usesMenuLayout = () => {
    // dependencies:
    // borders:
    const [, , borderStrokeDecls] = usesBorderStroke();
    const [, , borderRadiusDecls] = usesBorderRadius();
    return composition([
        imports([
            // layouts:
            usesActionControlLayout(),
            usesWrapperLayout(),
            // colors:
            usesThemeDefault(),
        ]),
        layout({
            // borders:
            [borderStrokeDecls.borderWidth]: '0px',
            // remove rounded corners on top:
            [borderRadiusDecls.borderStartStartRadius]: '0px',
            [borderRadiusDecls.borderStartEndRadius]: '0px',
            // remove rounded corners on bottom:
            [borderRadiusDecls.borderEndStartRadius]: '0px',
            [borderRadiusDecls.borderEndEndRadius]: '0px',
            // sizes:
            flex: [[0, 1, 'auto']],
            // customize:
            ...usesGeneralProps(usesPrefixedProps(cssProps, 'menu')), // apply general cssProps starting with menu***
        }),
    ]);
};
export const usesMenuVariants = () => {
    return composition([
        imports([
            // variants:
            usesActionControlVariants(),
        ]),
    ]);
};
export const usesMenuStates = () => {
    return composition([
        imports([
            // states:
            usesActionControlStates(),
        ]),
        states([
            isActive([
                imports([
                    markActive(),
                ]),
            ]),
            isFocus([
                imports([
                    dontMarkActive(),
                ]),
            ]),
            isArrive([
                imports([
                    dontMarkActive(),
                ]),
            ]),
            isPress([
                imports([
                    dontMarkActive(),
                ]),
            ]),
        ]),
    ]);
};
export const usesNavbarLayout = () => {
    return composition([
        imports([
            // layouts:
            usesContainerLayout(),
        ]),
        layout({
            // layouts:
            display: 'grid',
            // explicit areas:
            /*
                just one explicit area: `menus`
                logo & toggler rely on implicit area
            */
            gridTemplateRows: [['auto' /*fluid height*/]],
            gridTemplateColumns: [['auto' /*fluid width, menus' width = maximum width - logo's width - toggler's width*/]],
            gridTemplateAreas: [[
                    '"menus"',
                ]],
            // implicit areas:
            gridAutoFlow: 'column',
            gridAutoRows: 'min-content',
            gridAutoColumns: 'min-content',
            // the gridArea's size configured as *minimum* content's size required => no free space left to distribute => so (justify|algin)Content is *not required*
            // child default sizes:
            justifyItems: 'stretch',
            alignItems: 'stretch',
            // children:
            ...children(wrapperElm, [
                imports([
                    usesWrapperLayout(),
                ]),
            ]),
            ...children([logoElm, togglerElm, menusElm], [
                imports([
                    usesItemLayout(),
                ]),
            ]),
            ...children([logoElm, togglerElm], [
                imports([
                    usesSecondaryLayout(),
                ]),
            ]),
            ...children(logoElm, [
                imports([
                    usesLogoLayout(),
                ]),
            ]),
            ...children(togglerElm, [
                imports([
                    usesTogglerLayout(),
                ]),
            ]),
            ...children(menusElm, [
                imports([
                    usesMenusLayout(),
                ]),
            ]),
            // customize:
            ...usesGeneralProps(cssProps),
            // borders:
            ...expandBorderRadius(cssProps),
            // spacings:
            ...expandPadding(cssProps), // expand padding css vars
        }),
    ]);
};
export const usesNavbarVariants = () => {
    // dependencies:
    // layouts:
    const [sizes] = usesSizeVariant((sizeName) => composition([
        layout({
            // overwrites propName = propName{SizeName}:
            ...overwriteProps(cssDecls, usesSuffixedProps(cssProps, sizeName)),
        }),
    ]));
    return composition([
        imports([
            // variants:
            usesContainerVariants(),
            // layouts:
            sizes(),
        ]),
    ]);
};
export const usesNavbarStates = () => {
    // dependencies:
    // animations:
    const [menusAnim] = usesMenusAnim();
    return composition([
        imports([
            // animations:
            menusAnim(),
        ]),
        states([
            rule(':not(.compact)', [
                layout({
                    // children:
                    ...children([logoElm, togglerElm, menusElm], [
                        layout({
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'item'), 'full')), // apply general cssProps starting with item*** and ending with ***Full
                        }),
                    ]),
                    ...children(logoElm, [
                        layout({
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'logo'), 'full')), // apply general cssProps starting with logo*** and ending with ***Full
                        }),
                    ]),
                    ...children(togglerElm, [
                        layout({
                            // appearances:
                            display: 'none',
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'toggler'), 'full')), // apply general cssProps starting with toggler*** and ending with ***Full
                        }),
                    ]),
                    ...children(menusElm, [
                        layout({
                            // children:
                            ...children('*', [
                                layout({
                                    // customize:
                                    ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'menu'), 'full')), // apply general cssProps starting with menu*** and ending with ***Full
                                }),
                            ]),
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'menus'), 'full')), // apply general cssProps starting with menus*** and ending with ***Full
                        }),
                    ]),
                    // customize:
                    ...usesGeneralProps(usesSuffixedProps(cssProps, 'full')), // apply general cssProps ending with ***Full
                }),
            ]),
            rule('.compact', [
                layout({
                    // children:
                    ...children([logoElm, togglerElm, menusElm], [
                        layout({
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'item'), 'compact')), // apply general cssProps starting with item*** and ending with ***Compact
                        }),
                    ]),
                    ...children(logoElm, [
                        layout({
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'logo'), 'compact')), // apply general cssProps starting with logo*** and ending with ***Compact
                        }),
                    ]),
                    ...children(togglerElm, [
                        layout({
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'toggler'), 'compact')), // apply general cssProps starting with toggler*** and ending with ***Compact
                        }),
                    ]),
                    ...children(menusElm, [
                        imports([
                            usesMenusCompactLayout(),
                        ]),
                        layout({
                            // children:
                            ...children('*', [
                                layout({
                                    // customize:
                                    ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'menu'), 'compact')), // apply general cssProps starting with menu*** and ending with ***Compact
                                }),
                            ]),
                            // customize:
                            ...usesGeneralProps(usesSuffixedProps(usesPrefixedProps(cssProps, 'menus'), 'compact')), // apply general cssProps starting with menus*** and ending with ***Compact
                        }),
                    ]),
                    // customize:
                    ...usesGeneralProps(usesSuffixedProps(cssProps, 'compact')), // apply general cssProps ending with ***Compact
                }),
                rules([
                    isPassived([
                        layout({
                            // children:
                            ...children(menusElm, [
                                layout({
                                    // layouts:
                                    display: 'none', // hide the menus when on compact mode
                                }),
                            ]),
                        }),
                    ]),
                ]),
            ]),
        ]),
    ]);
};
export const useNavbarSheet = createUseSheet(() => [
    mainComposition([
        imports([
            // layouts:
            usesNavbarLayout(),
            // variants:
            usesNavbarVariants(),
            // states:
            usesNavbarStates(),
        ]),
    ]),
]);
// configs:
export const [cssProps, cssDecls, cssVals, cssConfig] = createCssConfig(() => {
    //#region keyframes
    const keyframesMenusActive = {
        from: {
            overflowY: 'hidden',
            maxBlockSize: 0,
        },
        '99%': {
            overflowY: 'hidden',
            maxBlockSize: '100vh',
        },
        to: {
            overflowY: 'unset',
            maxBlockSize: 'unset',
        },
    };
    const keyframesMenusPassive = {
        from: keyframesMenusActive.to,
        '1%': keyframesMenusActive['99%'],
        to: keyframesMenusActive.from,
    };
    //#endregion keyframes
    return {
        //#region positions
        zIndex: 1020,
        position: 'sticky',
        //#endregion positions
        //#region borders
        borderInline: 'none',
        borderBlockStart: 'none',
        borderRadius: 0,
        //#endregion borders
        //#region spacings
        paddingInline: ccssProps.paddingInline,
        paddingBlock: bcssProps.paddingBlock,
        gapInline: bcssProps.paddingInline,
        gapBlock: bcssProps.paddingBlock,
        //#endregion spacings
        //#region animations
        '@keyframes menusActive': keyframesMenusActive,
        '@keyframes menusPassive': keyframesMenusPassive,
        menusAnimActive: [['300ms', 'ease-out', 'both', keyframesMenusActive]],
        menusAnimPassive: [['300ms', 'ease-out', 'both', keyframesMenusPassive]],
        //#endregion animations
        // menus:
        // at full mode, cancel-out Navbar's paddingBlock with negative margin:
        menusMarginBlockFull: [['calc(0px -', bcssProps.paddingBlock, ')']],
        // at compact mode, cancel-out Navbar's paddingInline with negative margin:
        menusMarginInlineCompact: [['calc(0px -', ccssProps.paddingInline, ')']],
        // menu:
        menuWhiteSpace: 'nowrap',
        menuTextAlign: 'center',
        //#region making menus floating (on mobile), not shifting the content
        ...{
            // do not make row spacing when the menus shown (we'll make the menus as ghost element, floating in front of the contents below the navbar)
            gapBlock: 0,
            // menus:
            menusPositionCompact: 'absolute',
            menusMarginBlockStartCompact: bcssProps.paddingBlock,
            menusPaddingBlockEndCompact: bcssProps.paddingBlock,
        },
        //#endregion making menus floating (on mobile), not shifting the content
    };
}, { prefix: 'navb' });
export function NavbarMenu(props) {
    // jsx:
    return (React.createElement(NavButton
    // other props:
    , { ...props, 
        // variants:
        mild: props.mild ?? false, 
        // classes:
        mainClass: props.mainClass ?? '' }));
}
export { NavbarMenu as Menu };
export function Navbar(props) {
    // styles:
    const sheet = useNavbarSheet();
    // states:
    const navbarRef = useRef(null);
    const compactState = useCompactState(props, navbarRef);
    const [isActive, setActive] = useTogglerActive(props);
    // rest props:
    const { 
    // accessibilities:
    defaultActive, // delete, already handled by `useTogglerActive`
    active, // delete, already handled by `useTogglerActive`
    onActiveChange, // delete, already handled by `useTogglerActive`
    // children:
    logo, toggler, children, ...restProps } = props;
    // fn props:
    const mildFn = props.mild ?? false;
    // jsx fn props:
    const logoFn = (() => {
        // nodestrap's component:
        if (isTypeOf(logo, Element))
            return (React.createElement(logo.type
            // other props:
            , { ...logo.props, 
                // classes:
                classes: [...(logo.props.classes ?? []),
                    'logo', // inject logo class
                ] }));
        // other component:
        return logo && (React.createElement("div", { 
            // classes:
            className: 'logo wrapper' }, logo));
    })();
    const togglerFn = (() => {
        // default (unset):
        if (toggler === undefined)
            return (React.createElement(TogglerMenuButton
            // accessibilities:
            , { 
                // accessibilities:
                active: isActive, onActiveChange: (newActive) => {
                    setActive(newActive);
                }, 
                // variants:
                mild: mildFn, 
                // classes:
                classes: [
                    'toggler', // inject toggler class
                ] }));
        // nodestrap's component:
        if (isTypeOf(toggler, Element))
            return (React.createElement(toggler.type
            // other props:
            , { ...toggler.props, 
                // classes:
                classes: [...(toggler.props.classes ?? []),
                    'toggler', // inject toggler class
                ], ...(isTypeOf(toggler, Indicator) ? {
                    // accessibilities:
                    active: toggler.props.active ?? isActive,
                } : {}), ...(isTypeOf(toggler, Check) ? {
                    // accessibilities:
                    onActiveChange: toggler.props.onActiveChange ?? ((newActive) => {
                        setActive(newActive);
                    }),
                } : {}) }));
        // other component:
        return toggler && (React.createElement("div", { 
            // classes:
            className: 'toggler wrapper' }, toggler));
    })();
    // jsx:
    return (React.createElement(Indicator, { ...restProps, 
        // semantics:
        semanticTag: props.semanticTag ?? 'nav', semanticRole: props.semanticRole ?? 'navigation', 
        // essentials:
        elmRef: (elm) => {
            setRef(props.elmRef, elm);
            setRef(navbarRef, elm);
        }, 
        // accessibilities:
        active: isActive, 
        // variants:
        mild: mildFn, 
        // classes:
        mainClass: props.mainClass ?? sheet.main, stateClasses: [...(props.stateClasses ?? []),
            compactState.class,
        ], 
        // events:
        // watch [escape key] on the whole navbar, including menus & toggler:
        onKeyUp: (e) => {
            props.onKeyUp?.(e);
            if (!e.defaultPrevented) {
                if (isActive && ((e.key === 'Escape') || (e.code === 'Escape'))) {
                    setActive(false);
                    e.preventDefault();
                } // if
            } // if
        } },
        logoFn,
        togglerFn,
        children && React.createElement("div", { 
            // classes:
            className: 'menus', 
            // events:
            onAnimationEnd: (e) => {
                /*
                    active/passive rely on `.menus`' active/passive
                    
                    // todo will be perfected soon:
                    enable/disable rely on `NavbarMenu` enable/disable
                    if the `Navbar` doesn't have any `NavbarMenu` it wouldn't work
                */
                // triggers `Navbar`'s onAnimationEnd event
                e.currentTarget.parentElement?.dispatchEvent(new AnimationEvent('animationend', { animationName: e.animationName, bubbles: true }));
            } }, React.Children.map(children, (child, index) => (isTypeOf(child, NavbarMenu)
            ?
                React.createElement(child.type
                // other props:
                , { ...child.props, 
                    // essentials:
                    key: child.key ?? index })
            :
                React.createElement(NavbarMenu
                // essentials:
                , { 
                    // essentials:
                    key: index }, child))))));
}
export { Navbar as default };

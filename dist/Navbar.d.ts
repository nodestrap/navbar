import { default as React } from 'react';
import type { PropEx } from '@cssfn/css-types';
import { ThemeName } from '@nodestrap/basic';
import { TogglerActiveProps, IndicatorProps } from '@nodestrap/indicator';
import { CurrentActiveProps, useCurrentActive, NavButtonProps } from '@nodestrap/nav-button';
export type { CurrentActiveProps };
export { useCurrentActive };
export declare const markActive: () => import("@cssfn/cssfn").StyleCollection;
export declare const dontMarkActive: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesThemeDefault: (themeName?: ThemeName | null) => import("@cssfn/cssfn").StyleCollection;
export declare const usesThemeActive: (themeName?: ThemeName | null) => import("@cssfn/cssfn").StyleCollection;
export interface CompactState {
    compact?: boolean;
}
export declare const useCompactState: <TElement extends HTMLElement = HTMLElement>(props: CompactState, navbarRef: React.RefObject<TElement>) => {
    compact: boolean;
    class: string | null;
};
export interface MenusAnimVars {
    /**
     * final animation for the menus.
     */
    anim: any;
}
export declare const usesMenusAnim: () => readonly [() => import("@cssfn/cssfn").StyleCollection, import("@cssfn/css-var").ReadonlyRefs<MenusAnimVars>, import("@cssfn/css-var").ReadonlyDecls<MenusAnimVars>];
export declare const usesWrapperLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesItemLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesSecondaryLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesLogoLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesTogglerLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesMenusLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesMenusCompactLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesMenuLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesMenuVariants: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesMenuStates: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesNavbarLayout: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesNavbarVariants: () => import("@cssfn/cssfn").StyleCollection;
export declare const usesNavbarStates: () => import("@cssfn/cssfn").StyleCollection;
export declare const useNavbarSheet: import("@cssfn/types").Factory<import("jss").Classes<"main">>;
export declare const cssProps: import("@cssfn/css-config").Refs<{
    zIndex: number;
    position: string;
    insetBlockStart: string;
    borderInline: string;
    borderBlockStart: string;
    borderRadius: number;
    paddingInline: import("@cssfn/css-types").Cust.Ref;
    paddingBlock: import("@cssfn/css-types").Cust.Ref;
    gapInline: import("@cssfn/css-types").Cust.Ref;
    gapBlock: import("@cssfn/css-types").Cust.Ref;
    '@keyframes menusActive': PropEx.Keyframes;
    '@keyframes menusPassive': PropEx.Keyframes;
    menusAnimActive: (string | PropEx.Keyframes)[][];
    menusAnimPassive: (string | PropEx.Keyframes)[][];
    menusMarginBlockFull: string[][];
    menusMarginInlineCompact: string[][];
    menuWhiteSpace: string;
    menuTextAlign: string;
}>, cssDecls: import("@cssfn/css-config").Decls<{
    zIndex: number;
    position: string;
    insetBlockStart: string;
    borderInline: string;
    borderBlockStart: string;
    borderRadius: number;
    paddingInline: import("@cssfn/css-types").Cust.Ref;
    paddingBlock: import("@cssfn/css-types").Cust.Ref;
    gapInline: import("@cssfn/css-types").Cust.Ref;
    gapBlock: import("@cssfn/css-types").Cust.Ref;
    '@keyframes menusActive': PropEx.Keyframes;
    '@keyframes menusPassive': PropEx.Keyframes;
    menusAnimActive: (string | PropEx.Keyframes)[][];
    menusAnimPassive: (string | PropEx.Keyframes)[][];
    menusMarginBlockFull: string[][];
    menusMarginInlineCompact: string[][];
    menuWhiteSpace: string;
    menuTextAlign: string;
}>, cssVals: import("@cssfn/css-config").Vals<{
    zIndex: number;
    position: string;
    insetBlockStart: string;
    borderInline: string;
    borderBlockStart: string;
    borderRadius: number;
    paddingInline: import("@cssfn/css-types").Cust.Ref;
    paddingBlock: import("@cssfn/css-types").Cust.Ref;
    gapInline: import("@cssfn/css-types").Cust.Ref;
    gapBlock: import("@cssfn/css-types").Cust.Ref;
    '@keyframes menusActive': PropEx.Keyframes;
    '@keyframes menusPassive': PropEx.Keyframes;
    menusAnimActive: (string | PropEx.Keyframes)[][];
    menusAnimPassive: (string | PropEx.Keyframes)[][];
    menusMarginBlockFull: string[][];
    menusMarginInlineCompact: string[][];
    menuWhiteSpace: string;
    menuTextAlign: string;
}>, cssConfig: import("@cssfn/css-config").CssConfigSettings;
export interface NavbarMenuProps extends NavButtonProps {
}
export declare function NavbarMenu(props: NavbarMenuProps): JSX.Element;
export type { NavbarMenuProps as MenuProps };
export { NavbarMenu as Menu };
export interface NavbarProps<TElement extends HTMLElement = HTMLElement> extends IndicatorProps<TElement>, TogglerActiveProps, CompactState {
    logo?: React.ReactChild | boolean | null;
    toggler?: React.ReactChild | boolean | null;
    children?: React.ReactNode;
}
export declare function Navbar<TElement extends HTMLElement = HTMLElement>(props: NavbarProps<TElement>): JSX.Element;
export { Navbar as default };

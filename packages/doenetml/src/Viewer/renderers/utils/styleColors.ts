import type { ResolvedStyleDefinition } from "@doenet/utils";

export type DarkMode = "dark" | "light" | undefined;

/**
 * Resolve a `selectedStyle` color in light vs dark mode.
 *
 * The worker emits both a `<thing>Color` and `<thing>ColorDarkMode` value for
 * every color attribute. Renderers pick between them based on the current
 * doc-level dark mode. These helpers centralize that ternary so that any
 * future change to dark-mode color resolution (default fallbacks, themed
 * palettes, etc.) lives in one place.
 */
export function resolveLineColor(
    style: Pick<ResolvedStyleDefinition, "lineColor" | "lineColorDarkMode">,
    darkMode: DarkMode,
): string {
    return darkMode === "dark" ? style.lineColorDarkMode : style.lineColor;
}

export function resolveFillColor(
    style: Pick<ResolvedStyleDefinition, "fillColor" | "fillColorDarkMode">,
    darkMode: DarkMode,
): string {
    return darkMode === "dark" ? style.fillColorDarkMode : style.fillColor;
}

export function resolveMarkerColor(
    style: Pick<ResolvedStyleDefinition, "markerColor" | "markerColorDarkMode">,
    darkMode: DarkMode,
): string {
    return darkMode === "dark" ? style.markerColorDarkMode : style.markerColor;
}

/**
 * The color used for draggable handles on graph elements (polygon vertices,
 * polyline vertices, vector/line-segment endpoints, curve control points,
 * etc.). Mirrors the `--graphHandle` CSS variable so all graph element
 * renderers stay in sync.
 *
 * Note: JSXGraph receives resolved hex values, not CSS variable strings,
 * because `data-theme` is applied to an inner wrapper div rather than
 * `<html>`, so `getComputedStyle(document.documentElement)` always reads
 * the light-mode value regardless of the current theme.
 */
export function resolveHandleColor(darkMode: DarkMode): string {
    return darkMode === "dark" ? "#b0b0b0" : "#404040";
}

/**
 * The graph canvas background color. Mirrors the `--canvas` CSS variable
 * (white in light mode, `#121212` in dark mode). Used as the background layer
 * behind fill patterns so a patterned shape reads as a translucent solid fill
 * with the pattern drawn on top.
 *
 * Returns a resolved value rather than `var(--canvas)` for the same reason as
 * `resolveHandleColor`: patterns are injected into the board SVG whose theme is
 * driven by an inner wrapper's `data-theme`, so we resolve against `darkMode`
 * directly instead of relying on CSS-variable inheritance.
 */
export function resolveCanvasColor(darkMode: DarkMode): string {
    return darkMode === "dark" ? "#121212" : "white";
}

/**
 * The authored background color of a style definition, or `""` when none was
 * authored. Callers treat the empty string as "no explicit color" and fall
 * back to whatever surface they sit on — usually {@link resolveCanvasColor}.
 */
export function resolveBackgroundColor(
    style: Pick<
        ResolvedStyleDefinition,
        "backgroundColor" | "backgroundColorDarkMode"
    >,
    darkMode: DarkMode,
): string {
    return darkMode === "dark"
        ? style.backgroundColorDarkMode
        : style.backgroundColor;
}

/**
 * The border color for a panel drawn in the canvas color, which has no fill of
 * its own to set it apart from the graph behind it. Mirrors the `--panelBorder`
 * CSS variable, which meets WCAG's 3:1 non-text contrast against the canvas in
 * both themes, and is resolved rather than passed through as `var(--panelBorder)`
 * for the same reason as {@link resolveHandleColor}.
 */
export function resolvePanelBorderColor(darkMode: DarkMode): string {
    return darkMode === "dark" ? "#6b6b6b" : "#949494";
}

/**
 * The text color of a style definition, resolved for the current theme.
 * Unlike the background, this always has a value: `DEFAULT_STYLE_VALUES`
 * pairs `textColor: black` with `textColorDarkMode: white`, so a component
 * that has authored no text color of its own still reads against the canvas
 * in both themes.
 */
export function resolveTextColor(
    style: Pick<ResolvedStyleDefinition, "textColor" | "textColorDarkMode">,
    darkMode: DarkMode,
): string {
    return darkMode === "dark" ? style.textColorDarkMode : style.textColor;
}

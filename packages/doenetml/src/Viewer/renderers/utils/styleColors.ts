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

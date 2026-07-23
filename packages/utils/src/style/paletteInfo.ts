import { STYLE_PALETTES, STYLE_PALETTE_NAMES } from "./palettes";
import { returnPaletteStyleDefinitions } from "./style";
import {
    resolveStyleDefinition,
    unwrapStyleDefinition,
    type ResolvedStyleDefinition,
} from "./styleDefinitionHelpers";

/**
 * A built-in style palette described for host applications: enough to list
 * the palettes in a picker and render a swatch per style.
 *
 * `styles` is keyed by style number (`"1"`, `"2"`, ...), contiguous from 1,
 * and every palette has at least four styles. Each entry is a fully-resolved
 * style definition — the same shape renderers receive in `selectedStyle` —
 * so a host can read `lineColor`/`markerColor`/`fillColor`/`textColor` (and
 * their `*DarkMode` variants) to draw swatches for either theme, plus
 * `lineWidth`, `lineStyle`, `markerStyle`, and `markerSize` to reproduce the
 * non-color distinctions palettes also carry. The `*Word` fields give the
 * human-readable color names Doenet uses in style descriptions, suitable for
 * labelling swatches accessibly.
 */
export interface StylePaletteInfo {
    /**
     * Canonical palette name in camelCase — the spelling to show in a picker
     * and feed back to `<stylePalette palette="...">` (which matches it
     * case-insensitively).
     */
    name: string;
    /** One-line human-readable summary of the palette. */
    description: string;
    /** Resolved style definitions, keyed by style number. */
    styles: Record<string, ResolvedStyleDefinition>;
}

/**
 * Returns a description of one built-in style palette, or `null` when the
 * name is not registered. Names match case-insensitively, like the
 * `<stylePalette palette>` attribute and reader style overrides.
 */
export function getStylePalette(name: string): StylePaletteInfo | null {
    if (typeof name !== "string") {
        return null;
    }
    const paletteName = name.trim().toLowerCase();
    const palette = STYLE_PALETTES[paletteName];
    if (!palette) {
        return null;
    }

    const expanded = returnPaletteStyleDefinitions(paletteName);
    const styles: Record<string, ResolvedStyleDefinition> = {};
    for (const styleNumber of Object.keys(expanded)) {
        styles[styleNumber] = resolveStyleDefinition(
            unwrapStyleDefinition(expanded[styleNumber]),
        );
    }

    return {
        name: palette.name,
        description: palette.description,
        styles,
    };
}

/**
 * Returns all built-in style palettes, in registration order, described for
 * host applications — e.g. to render a palette picker with swatches that a
 * reader can choose from, feeding the chosen name back in as the `palette`
 * field of the viewer's `styleOverrides` prop.
 *
 * The result is plain JSON (no functions, no shared mutable state): it can
 * be serialized across a worker or iframe boundary, and callers may freely
 * mutate the returned objects.
 */
export function getStylePalettes(): StylePaletteInfo[] {
    return STYLE_PALETTE_NAMES.map((name) => getStylePalette(name)!);
}

import type { RawStyleDefinitions } from "../styleDefinitionHelpers";

/**
 * A named, built-in set of coordinated style definitions that an author can
 * select for a document or section (the base layer that `<styleDefinition>`
 * blocks then override).
 *
 * Palette styles are authored as raw style definitions, and anything left out
 * is filled in at expansion time (see `expandStylePalette` in `../style.ts`):
 * a missing `*ColorDarkMode` is derived from its light-mode color, and a
 * missing `*Word` descriptor is derived from the resulting color value. So a
 * palette need only supply what the derivation would get wrong. In practice
 * the built-in palettes supply a lot: dark-mode colors, because most of them
 * pin their source's published colors rather than a derived approximation,
 * and `*Word` descriptors, because the nearest-anchor hex-to-word matcher
 * misnames several hues (issue #1527). Note that pinning is per key — the
 * matcher runs on each color key independently, so a hue that needs pinning
 * must be pinned on *every* key that carries it (`lineColorWord`,
 * `markerColorWord`, `fillColorWord`, ...), or one style will describe its
 * lines and its markers differently. `paletteColorDistinctness.test.ts`
 * guards that.
 *
 * Do not author `textColor` / `textColorWord` (or their dark-mode partners)
 * on style number 1: expansion overwrites them with the canvas text color so
 * that selecting a palette never recolors unstyled prose (see
 * `applyNeutralTextColor`). Style 1's own color still belongs on its other
 * keys, `highContrastColor` included.
 *
 * Every style of every registered palette must meet the WCAG contrast
 * thresholds in both light and dark mode; `presetPaletteAccessibility.test.ts`
 * enforces this for the whole registry.
 *
 * Every palette must define at least four styles (contiguous from 1) — the
 * documented author contract is that style numbers 1-4 always land on
 * distinct styles, so authors reserve them for their most important
 * distinctions. A guard test enforces the minimum for registered palettes.
 */
export interface StylePalette {
    /**
     * Registry key and the author-facing value of `<stylePalette palette="..."/>`.
     * Must match the key in `STYLE_PALETTES`, and must be all lowercase: the
     * `palette` attribute sets `toLowerCase: true`, so a name with any
     * uppercase letter could never be selected.
     */
    name: string;
    /**
     * Author-facing summary surfaced in schema autocomplete. Required and
     * non-empty: the schema generator hard-fails on enum values without
     * descriptions.
     */
    description: string;
    /**
     * Raw style definitions keyed by style number `1..N` (numbering must be
     * contiguous from 1 so style-number cycling is well defined).
     */
    styles: RawStyleDefinitions;
}

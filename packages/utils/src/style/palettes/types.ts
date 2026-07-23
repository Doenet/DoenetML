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
 * the built-in palettes still supply a fair amount: dark-mode colors, because
 * most of them pin their source's published colors rather than a derived
 * approximation, and some `*Word` descriptors. The perceptual hex-to-word
 * matcher (issue #1527) now names most hues correctly, so a palette pins a
 * word only where the canonical twelve-word vocabulary is too coarse for the
 * distinction it wants (e.g. "olive", "teal", "gold", "indigo", "magenta")
 * or where the matcher rounds a borderline hue to the neighbouring family.
 * Note that pinning is per key — the matcher runs on each color key
 * independently, so a hue that needs pinning must be pinned on *every* key
 * that carries it (`lineColorWord`, `markerColorWord`, `fillColorWord`, ...),
 * or one style will describe its lines and its markers differently.
 * `paletteColorDistinctness.test.ts` guards that.
 *
 * Do not author `textColor` / `textColorWord` (or their dark-mode partners)
 * on style number 1: expansion overwrites them with the canvas text color so
 * that selecting a palette never recolors unstyled prose (see
 * `applyNeutralTextColor`). Style 1's own color still belongs on its other
 * keys, `highContrastColor` included.
 *
 * Two further expansion rules shape what a palette needs to say:
 * - Lines and markers render fully opaque unless the style states
 *   `lineOpacity` / `markerOpacity` (see `applyFullGraphicOpacity`). A
 *   palette that wants a softer stroke states the opacity, and its colors
 *   are then contrast-checked at that opacity.
 * - A style that gives `textColor` and `highContrastColor` one light-mode
 *   value gets its authored `textColorDarkMode` for
 *   `highContrastColorDarkMode` too, unless it states one (see
 *   `pairDarkModeHighContrastWithText`), so the pair cannot split apart in
 *   dark mode.
 *
 * Every style of every registered palette must meet the WCAG contrast
 * thresholds in both light and dark mode — composited onto the canvas at the
 * style's own opacity, which is how readers see it;
 * `presetPaletteAccessibility.test.ts` enforces this for the whole registry.
 *
 * Every palette must define at least four styles (contiguous from 1) — the
 * documented author contract is that style numbers 1-4 always land on
 * distinct styles, so authors reserve them for their most important
 * distinctions. A guard test enforces the minimum for registered palettes.
 */
export interface StylePalette {
    /**
     * Canonical, author-facing name of the palette, written in the repo's
     * conventional camelCase (e.g. `grumpyNarwhal`). This is the value surfaced
     * in schema autocomplete and context-help. The registry (`STYLE_PALETTES`)
     * keys each palette by the *lower-cased* form of this name, and the
     * `palette` attribute sets `toLowerCase: true`, so an authored value is
     * lower-cased before it is matched — matching is therefore case-insensitive
     * and `name` is the single source of truth for both the display value and
     * (once lower-cased) the internal key.
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

import type { RawStyleDefinitions } from "../styleDefinitionHelpers";

/**
 * A named, built-in set of coordinated style definitions that an author can
 * select for a document or section (the base layer that `<styleDefinition>`
 * blocks then override).
 *
 * Palette styles are authored compactly as raw style definitions: missing
 * `*ColorDarkMode` values and `*Word` descriptors are derived at expansion
 * time (see `expandStylePalette` in `../style.ts`), so palette authors supply
 * only light-mode colors plus any values where the derivation isn't good
 * enough. Never hand-author `*Word` fields in new palettes — derived words are
 * what keeps text style descriptions truthful.
 *
 * Every style of every registered palette must meet the WCAG contrast
 * thresholds in both light and dark mode; `presetPaletteAccessibility.test.ts`
 * enforces this for the whole registry.
 */
export interface StylePalette {
    /**
     * Registry key and the author-facing value of `<stylePalette palette="..."/>`.
     * Lower-camel-case, must match the key in `STYLE_PALETTES`.
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

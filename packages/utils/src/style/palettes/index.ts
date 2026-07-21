import { defaultPalette } from "./default";
import type { StylePalette } from "./types";

/**
 * Deep-freezes a palette (the palette object, its styles map, each style
 * definition, and any wrapped values). Palette data is shared module state
 * whose immutability is load-bearing: `returnDefaultStyleDefinitions()` is
 * lazily cached on the LSP side, so a mutation of registry data would
 * silently desync the LSP from the runtime. Freezing turns that class of bug
 * into a loud `TypeError` at the mutation site instead. Expansion
 * (`expandStylePalette`) copies before deriving, so freezing never bites
 * legitimate callers.
 */
function deepFreezePalette(palette: StylePalette): StylePalette {
    for (const styleDef of Object.values(palette.styles)) {
        for (const value of Object.values(styleDef)) {
            if (typeof value === "object" && value !== null) {
                Object.freeze(value);
            }
        }
        Object.freeze(styleDef);
    }
    Object.freeze(palette.styles);
    return Object.freeze(palette);
}

/**
 * Registry of built-in style palettes, keyed by palette name (the value
 * authors write in `<stylePalette palette="..."/>`). All entries are deeply
 * frozen at registration (see {@link deepFreezePalette}).
 *
 * This module holds palette *data* only; the expansion pipeline
 * (`expandStylePalette` / `returnPaletteStyleDefinitions`) lives in
 * `../style.ts` beside the derivation helpers it uses, which also keeps this
 * module import-cycle-free (style.ts imports the registry, not vice versa).
 *
 * To add a palette: create `./<name>.ts` exporting a `StylePalette`, register
 * it here, and make sure it passes `presetPaletteAccessibility.test.ts` (which
 * iterates this registry and enforces WCAG contrast in both modes).
 *
 * The registry has a null prototype: palette names are author-supplied
 * strings, so without it an `Object.prototype` key (e.g. `"constructor"`)
 * would pass `in`/truthiness checks and shadow the not-registered fallback
 * with a garbage "palette".
 */
export const STYLE_PALETTES: Record<string, StylePalette> = Object.assign(
    Object.create(null),
    {
        [defaultPalette.name]: deepFreezePalette(defaultPalette),
    },
);
Object.freeze(STYLE_PALETTES);

/** Name of the palette used when no `<stylePalette>` is selected. */
export const DEFAULT_PALETTE_NAME = defaultPalette.name;

/** All registered palette names, e.g. for schema `validValues` generation. */
export const STYLE_PALETTE_NAMES = Object.keys(STYLE_PALETTES);

export { defaultPalette } from "./default";
export type { StylePalette } from "./types";

import { defaultPalette } from "./default";
import { okabeItoPalette } from "./okabeIto";
import { tolBrightPalette } from "./tolBright";
import { tolMutedPalette } from "./tolMuted";
import { tolHighContrastPalette } from "./tolHighContrast";
import { ibmPalette } from "./ibm";
import { grayscalePalette } from "./grayscale";
import { categoricalPalette } from "./categorical";
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
        [okabeItoPalette.name]: deepFreezePalette(okabeItoPalette),
        [tolBrightPalette.name]: deepFreezePalette(tolBrightPalette),
        [tolMutedPalette.name]: deepFreezePalette(tolMutedPalette),
        [tolHighContrastPalette.name]: deepFreezePalette(
            tolHighContrastPalette,
        ),
        [ibmPalette.name]: deepFreezePalette(ibmPalette),
        [grayscalePalette.name]: deepFreezePalette(grayscalePalette),
        [categoricalPalette.name]: deepFreezePalette(categoricalPalette),
    },
);
Object.freeze(STYLE_PALETTES);

/** Name of the palette used when no `<stylePalette>` is selected. */
export const DEFAULT_PALETTE_NAME = defaultPalette.name;

/**
 * All registered palette names, e.g. for schema `validValues` generation.
 * Frozen for the same reason as the registry: an in-place mutation (e.g. a
 * consumer sorting it for display) would silently desync it from
 * `STYLE_PALETTES`.
 */
export const STYLE_PALETTE_NAMES: readonly string[] = Object.freeze(
    Object.keys(STYLE_PALETTES),
);

/**
 * Maps a style number onto a palette's range by cycling: with a palette of
 * size N, style number n > N resolves to `((n − 1) mod N) + 1`, so every
 * style number stays on-palette (and inherits the palette's accessibility
 * guarantees). Numbers within range — and anything unexpected (unknown
 * palette, non-integer, n < 1) — are returned unchanged.
 *
 * Cycling applies only when a palette is explicitly selected via
 * `<stylePalette>`; documents without one keep the historical
 * fall-back-to-default behavior for out-of-range style numbers.
 */
export function cycleStyleNumberForPalette(
    styleNumber: number,
    paletteName: string,
): number {
    const palette = STYLE_PALETTES[paletteName];
    if (!palette || !Number.isInteger(styleNumber) || styleNumber < 1) {
        return styleNumber;
    }

    const size = Object.keys(palette.styles).length;
    if (size < 1 || styleNumber <= size) {
        return styleNumber;
    }

    return ((styleNumber - 1) % size) + 1;
}

export { defaultPalette } from "./default";
export { okabeItoPalette } from "./okabeIto";
export { tolBrightPalette } from "./tolBright";
export { tolMutedPalette } from "./tolMuted";
export { tolHighContrastPalette } from "./tolHighContrast";
export { ibmPalette } from "./ibm";
export { grayscalePalette } from "./grayscale";
export { categoricalPalette } from "./categorical";
export type { StylePalette } from "./types";

import { defaultPalette } from "./default";
import type { StylePalette } from "./types";

/**
 * Registry of built-in style palettes, keyed by palette name (the value
 * authors write in `<stylePalette name="..."/>`).
 *
 * This module holds palette *data* only; the expansion pipeline
 * (`expandStylePalette` / `returnPaletteStyleDefinitions`) lives in
 * `../style.ts` beside the derivation helpers it uses, which also keeps this
 * module import-cycle-free (style.ts imports the registry, not vice versa).
 *
 * To add a palette: create `./<name>.ts` exporting a `StylePalette`, register
 * it here, and make sure it passes `presetPaletteAccessibility.test.ts` (which
 * iterates this registry and enforces WCAG contrast in both modes).
 */
export const STYLE_PALETTES: Record<string, StylePalette> = {
    [defaultPalette.name]: defaultPalette,
};

/** Name of the palette used when no `<stylePalette>` is selected. */
export const DEFAULT_PALETTE_NAME = defaultPalette.name;

/** All registered palette names, e.g. for schema `validValues` generation. */
export const STYLE_PALETTE_NAMES = Object.keys(STYLE_PALETTES);

export { defaultPalette } from "./default";
export type { StylePalette } from "./types";

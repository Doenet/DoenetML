import colorName from "color-name";
import nearestColor from "nearest-color";

/**
 * Color word resolution for style descriptions.
 *
 * Objectives:
 * 1) Keep backward compatibility for authored CSS named colors
 *    (e.g. "rebeccapurple", "LightBlue"): preserve the exact supplied word.
 * 2) Convert non-named color strings (hex/rgb) into a stable canonical color key
 *    suitable for consistent descriptions.
 * 3) Be localization-ready by producing stable translation keys
 *    (`color.*` and `cssColor.*`) and optional translated output.
 *
 * High-level flow:
 * - If input is a CSS named color and preservation is enabled:
 *   return it directly as the English/localized word (`named-css`).
 * - Otherwise:
 *   find nearest matching anchor color and map that anchor to canonical family
 *   (`nearest-palette`).
 * - If parsing/matching fails:
 *   return fallback behavior (`invalid`).
 */

export type ColorWordSource = "named-css" | "nearest-palette" | "invalid";

export type ColorWordTranslator = (key: string, englishWord: string) => string;

export interface ResolveColorWordOptions {
    preserveCssNamedColor?: boolean;
    translate?: ColorWordTranslator;
    invalidFallback?: "original" | "empty";
}

export interface ResolvedColorWord {
    key?: string;
    englishWord: string;
    localizedWord: string;
    source: ColorWordSource;
}

// Translation key strategy for future repo-wide i18n:
// - `color.<canonicalName>` for nearest-palette matches
// - `cssColor.<cssNamedKeyword>` for preserved CSS named colors
// This keeps backward-compatible English words while enabling localized lookup.

/**
 * Canonical color families used by style descriptions.
 *
 * These keys are the stable "public" families for descriptions and translation keys.
 * Example: `color.blue`, `color.red`.
 */
const canonicalColorHexByKey: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    gray: "#808080",
    red: "#ff0000",
    orange: "#ffa500",
    yellow: "#ffff00",
    green: "#008000",
    cyan: "#00ffff",
    blue: "#0000ff",
    purple: "#800080",
    pink: "#ffc0cb",
    brown: "#a52a2a",
};

/**
 * Matching anchors used by nearest-color.
 *
 * We include additional anchors (e.g. `blueCustom`, `purpleCustom`, `*Light`, `*Dark`)
 * to improve classification behavior while keeping output canonicalized.
 */
const matchColorHexByName: Record<string, string> = {
    black: canonicalColorHexByKey.black,
    white: canonicalColorHexByKey.white,
    silver: "#c0c0c0",
    grayDark: "#4d4d4d",
    gray: canonicalColorHexByKey.gray,
    grayCustom: "#757575",
    grayLight: "#c8c8c8",
    grayLighter: "#dcdcdc",
    maroon: "#800000",
    redLight: "#f08080",
    red: canonicalColorHexByKey.red,
    redCustom: "#D4042D",
    redDark: "#8b0000",
    orangeLight: "#ffa07a",
    orange: canonicalColorHexByKey.orange,
    orangeCustom: "#F19143",
    orangeDark: "#ff8c00",
    yellowLight: "#ffffe0",
    yellow: canonicalColorHexByKey.yellow,
    yellowDark: "#bdb76b",
    yellowgreen: "#9acd32",
    olive: "#808000",
    lime: "#00ff00",
    greenLight: "#90ee90",
    green: canonicalColorHexByKey.green,
    greenCustom: "#2ca02c",
    greenDark: "#006400",
    teal: "#008080",
    aqua: "#00ffff",
    cyanLight: "#e0ffff",
    cyan: canonicalColorHexByKey.cyan,
    cyanDark: "#008b8b",
    navy: "#000080",
    blueCustom: "#648FFF",
    blueLight: "#add8e6",
    blue: canonicalColorHexByKey.blue,
    blueDark: "#00008b",
    fuchsia: "#ff00ff",
    purpleCustom: "#644CD6",
    purpleLight: "#dda0dd",
    purple: canonicalColorHexByKey.purple,
    purpleDark: "#8b008b",
    hotpink: "#ff69b4",
    pink: canonicalColorHexByKey.pink,
    pinkDark: "#ff1493",
    brownLight: "#deb887",
    brown: canonicalColorHexByKey.brown,
    brownDark: "#8b4513",
};

/**
 * Maps each matching anchor name to the canonical output family.
 *
 * This decouples matching accuracy from output vocabulary.
 */
const canonicalKeyByMatchName: Record<string, string> = {
    black: "black",
    white: "white",
    silver: "gray",
    grayDark: "gray",
    gray: "gray",
    grayCustom: "gray",
    grayLight: "gray",
    grayLighter: "gray",
    maroon: "red",
    redLight: "red",
    red: "red",
    redCustom: "red",
    redDark: "red",
    orangeLight: "orange",
    orange: "orange",
    orangeCustom: "orange",
    orangeDark: "orange",
    yellowLight: "yellow",
    yellow: "yellow",
    yellowDark: "yellow",
    yellowgreen: "green",
    olive: "green",
    lime: "green",
    greenLight: "green",
    green: "green",
    greenCustom: "green",
    greenDark: "green",
    teal: "green",
    aqua: "cyan",
    cyanLight: "cyan",
    cyan: "cyan",
    cyanDark: "cyan",
    navy: "blue",
    blueCustom: "blue",
    blueLight: "blue",
    blue: "blue",
    blueDark: "blue",
    fuchsia: "purple",
    purpleCustom: "purple",
    purpleLight: "purple",
    purple: "purple",
    purpleDark: "purple",
    hotpink: "pink",
    pink: "pink",
    pinkDark: "pink",
    brownLight: "brown",
    brown: "brown",
    brownDark: "brown",
};

const nearestCanonicalColor = nearestColor.from(matchColorHexByName);

/**
 * Recognized CSS named colors for "preserve authored word" behavior.
 *
 * Includes full `color-name` keyword set plus `transparent` and `currentcolor`.
 */
const cssNamedColorSet = new Set<string>([
    ...Object.keys(colorName),
    "transparent",
    "currentcolor",
]);

function hasOwn(object: object, property: string) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

function isCssNamedColorKeyword(colorValue: string): boolean {
    return cssNamedColorSet.has(colorValue.trim().toLowerCase());
}

/**
 * Resolve a raw CSS color string into an English/localized word and metadata.
 *
 * Design decisions:
 * - Preserve authored CSS named words when possible to avoid surprising rewrites.
 * - Use nearest-color against curated anchors for numeric formats.
 * - Return stable keys for i18n integration without coupling this module to a
 *   specific i18n framework.
 */
export function resolveColorWord(
    colorValue: string,
    options: ResolveColorWordOptions = {},
): ResolvedColorWord {
    const preserveCssNamedColor = options.preserveCssNamedColor ?? true;
    const invalidFallback = options.invalidFallback ?? "original";

    const trimmedColorValue = colorValue.trim();

    if (trimmedColorValue.length === 0) {
        return {
            englishWord: "",
            localizedWord: "",
            source: "invalid",
        };
    }

    if (preserveCssNamedColor && isCssNamedColorKeyword(trimmedColorValue)) {
        const lowerName = trimmedColorValue.toLowerCase();
        const key = `cssColor.${lowerName}`;
        const englishWord = trimmedColorValue;
        const localizedWord = options.translate
            ? options.translate(key, englishWord)
            : englishWord;

        return {
            key,
            englishWord,
            localizedWord,
            source: "named-css",
        };
    }

    try {
        const nearest = nearestCanonicalColor(trimmedColorValue);

        const canonicalName = nearest
            ? canonicalKeyByMatchName[nearest.name]
            : undefined;

        if (!canonicalName || !hasOwn(canonicalColorHexByKey, canonicalName)) {
            throw Error("No nearest canonical color resolved");
        }

        const key = `color.${canonicalName}`;
        const englishWord = canonicalName;
        const localizedWord = options.translate
            ? options.translate(key, englishWord)
            : englishWord;

        return {
            key,
            englishWord,
            localizedWord,
            source: "nearest-palette",
        };
    } catch (e) {
        const englishWord =
            invalidFallback === "empty" ? "" : trimmedColorValue;

        return {
            englishWord,
            localizedWord: englishWord,
            source: "invalid",
        };
    }
}

/**
 * Convenience wrapper returning only the localized word.
 */
export function colorValueToWord(
    colorValue: string,
    options: ResolveColorWordOptions = {},
): string {
    return resolveColorWord(colorValue, options).localizedWord;
}

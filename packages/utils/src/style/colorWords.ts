import colorName from "color-name";
import nearestColor from "nearest-color";

/**
 * Color word resolution for style descriptions.
 *
 * Objectives:
 * 1) Keep backward compatibility for authored CSS named colors
 *    (e.g. "rebeccapurple", "LightBlue"): preserve the (trimmed) supplied word.
 * 2) Convert non-named color strings (hex/rgb) into a stable canonical color key
 *    suitable for consistent descriptions.
 * 3) Be localization-ready by producing stable translation keys
 *    (`color.*` and `cssColor.*`) and optional translated output.
 *
 * Translation key strategy:
 * - Nearest-palette result => `color.<canonicalName>`
 * - Preserved CSS named color => `cssColor.<cssNamedKeyword>`
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
    // Translation key for i18n lookup (for example `color.blue` or `cssColor.rebeccapurple`).
    key?: string;
    englishWord: string;
    localizedWord: string;
    source: ColorWordSource;
}

/**
 * Canonical color families used by style descriptions.
 *
 * These keys are the stable "public" families for descriptions and translation keys.
 * Example: `color.blue`, `color.red`.
 */
const canonicalColorHexByKey = {
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
} as const;

export type CanonicalColorKey = keyof typeof canonicalColorHexByKey;

type AnchorDefinition = {
    hex: string;
    canonical: CanonicalColorKey;
};

/**
 * Canonical family anchors derived directly from `canonicalColorHexByKey`.
 *
 * This keeps canonical family definitions in one place and avoids duplication.
 */
const canonicalAnchorDefinitions = Object.fromEntries(
    Object.entries(canonicalColorHexByKey).map(([canonical, hex]) => [
        canonical,
        { hex, canonical },
    ]),
) as Record<CanonicalColorKey, AnchorDefinition>;

/**
 * Additional non-canonical anchors used by nearest-color.
 *
 * Together with `canonicalAnchorDefinitions`, this forms the full matching set.
 *
 * Each anchor has:
 * - `hex`: comparison point used by nearest-color
 * - `canonical`: the output family key (`color.<canonical>`)
 *
 * Includes:
 * - custom project palette anchors (`*Custom`)
 * - light/dark anchors (`*Light`, `*Dark`)
 * - selected HTML named-color anchors (e.g. `silver`, `maroon`, `fuchsia`)
 */
const extraAnchorDefinitions: Record<string, AnchorDefinition> = {
    silver: { hex: "#c0c0c0", canonical: "gray" },
    grayDark: { hex: "#4d4d4d", canonical: "gray" },
    grayCustom: { hex: "#757575", canonical: "gray" },
    grayLight: { hex: "#c8c8c8", canonical: "gray" },
    grayLighter: { hex: "#dcdcdc", canonical: "gray" },
    maroon: { hex: "#800000", canonical: "red" },
    redLight: { hex: "#f08080", canonical: "red" },
    redCustom: { hex: "#D4042D", canonical: "red" },
    redDark: { hex: "#8b0000", canonical: "red" },
    orangeLight: { hex: "#ffa07a", canonical: "orange" },
    orangeCustom: { hex: "#F19143", canonical: "orange" },
    orangeDark: { hex: "#ff8c00", canonical: "orange" },
    yellowLight: { hex: "#ffffe0", canonical: "yellow" },
    yellowDark: { hex: "#bdb76b", canonical: "yellow" },
    yellowgreen: { hex: "#9acd32", canonical: "green" },
    olive: { hex: "#808000", canonical: "green" },
    lime: { hex: "#00ff00", canonical: "green" },
    greenLight: { hex: "#90ee90", canonical: "green" },
    greenCustom: { hex: "#2ca02c", canonical: "green" },
    greenDark: { hex: "#006400", canonical: "green" },
    teal: { hex: "#008080", canonical: "green" },
    aqua: { hex: "#00ffff", canonical: "cyan" },
    cyanLight: { hex: "#e0ffff", canonical: "cyan" },
    cyanDark: { hex: "#008b8b", canonical: "cyan" },
    navy: { hex: "#000080", canonical: "blue" },
    blueCustom: { hex: "#648FFF", canonical: "blue" },
    blueLight: { hex: "#add8e6", canonical: "blue" },
    blueDark: { hex: "#00008b", canonical: "blue" },
    fuchsia: { hex: "#ff00ff", canonical: "purple" },
    purpleCustom: { hex: "#644CD6", canonical: "purple" },
    purpleLight: { hex: "#dda0dd", canonical: "purple" },
    purpleDark: { hex: "#8b008b", canonical: "purple" },
    hotpink: { hex: "#ff69b4", canonical: "pink" },
    pinkDark: { hex: "#ff1493", canonical: "pink" },
    brownLight: { hex: "#deb887", canonical: "brown" },
    brownDark: { hex: "#8b4513", canonical: "brown" },
};

/**
 * Full numeric matching anchor set (canonical + extra anchors).
 */
const anchorDefinitions: Record<string, AnchorDefinition> = {
    ...canonicalAnchorDefinitions,
    ...extraAnchorDefinitions,
};

/**
 * Derived map for nearest-color: anchor name -> hex value.
 */
const matchColorHexByName = Object.fromEntries(
    Object.entries(anchorDefinitions).map(([name, definition]) => [
        name,
        definition.hex,
    ]),
) as Record<string, string>;

/**
 * Derived map for canonicalization: anchor name -> canonical family key.
 */
const canonicalKeyByMatchName = Object.fromEntries(
    Object.entries(anchorDefinitions).map(([name, definition]) => [
        name,
        definition.canonical,
    ]),
) as Record<string, CanonicalColorKey>;

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

        if (!canonicalName) {
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

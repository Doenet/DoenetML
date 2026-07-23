import colorName from "color-name";
import { colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";
import lchPlugin from "colord/plugins/lch";

extend([labPlugin, lchPlugin]);

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
 *   - if the color is (near-)neutral (very low chroma), classify it as
 *     black/gray/white by lightness before any hue matching;
 *   - otherwise find the nearest matching anchor color using a perceptual
 *     color-difference metric (CIEDE2000) and map that anchor to a canonical
 *     family (`nearest-palette`).
 * - If parsing/matching fails:
 *   return fallback behavior (`invalid`).
 *
 * Matching in a perceptual space (rather than raw RGB Euclidean distance) is
 * important for dark and desaturated colors, where RGB distance badly misnames
 * hues (e.g. a strong blue landing on "cyan", a crimson landing on "brown").
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
 * Additional non-canonical anchors used by the perceptual nearest-anchor match.
 *
 * Together with `canonicalAnchorDefinitions`, this forms the full matching set.
 *
 * Each anchor has:
 * - `hex`: comparison point used by the perceptual (CIEDE2000) match
 * - `canonical`: the output family key (`color.<canonical>`)
 *
 * Includes:
 * - custom project palette anchors (`*Custom`)
 * - light/dark anchors (`*Light`, `*Dark`)
 * - selected HTML named-color anchors (e.g. `silver`, `maroon`, `fuchsia`)
 * - gap-filling anchors for regions that were previously misnamed
 *   (`crimson`, `wine`, `blueMid`, `blueSky`, `cyanMid`, `purpleMuted`)
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
    crimson: { hex: "#dc143c", canonical: "red" },
    wine: { hex: "#993355", canonical: "red" },
    orangeLight: { hex: "#ffa07a", canonical: "orange" },
    orangeCustom: { hex: "#F19143", canonical: "orange" },
    orangePresetAccessible: { hex: "#a6510c", canonical: "orange" },
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
    cyanMid: { hex: "#25b0c0", canonical: "cyan" },
    cyanDark: { hex: "#008b8b", canonical: "cyan" },
    navy: { hex: "#000080", canonical: "blue" },
    blueMid: { hex: "#4477aa", canonical: "blue" },
    blueSky: { hex: "#56b4e9", canonical: "blue" },
    blueCustom: { hex: "#648FFF", canonical: "blue" },
    bluePresetAccessible: { hex: "#1f5dff", canonical: "blue" },
    blueLight: { hex: "#add8e6", canonical: "blue" },
    blueDark: { hex: "#00008b", canonical: "blue" },
    fuchsia: { hex: "#ff00ff", canonical: "purple" },
    purpleCustom: { hex: "#644CD6", canonical: "purple" },
    purpleMuted: { hex: "#9c5686", canonical: "purple" },
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
 * Precomputed list of anchors as `colord` instances paired with their canonical
 * family, used for perceptual nearest-anchor matching.
 */
const anchorColordList: Array<{
    color: ReturnType<typeof colord>;
    canonical: CanonicalColorKey;
}> = Object.values(anchorDefinitions).map((definition) => ({
    color: colord(definition.hex),
    canonical: definition.canonical,
}));

/**
 * Chroma below which a color is treated as (near-)neutral and classified as
 * black/gray/white by lightness alone, before any hue matching.
 *
 * Measured in CIELCH chroma. Kept low so that pale-but-clearly-tinted colors
 * (e.g. light cyan `#e0ffff`, C ~ 11) are still matched to their hue family,
 * while genuinely desaturated colors (e.g. warm gray `#a99d96`, C ~ 6.5) are
 * classified as gray.
 */
const NEUTRAL_CHROMA_THRESHOLD = 8;

/**
 * CIELAB lightness cutoffs (L in [0, 100]) for classifying near-neutral colors.
 */
const NEUTRAL_BLACK_MAX_LIGHTNESS = 14;
const NEUTRAL_WHITE_MIN_LIGHTNESS = 92;

/**
 * Classify a near-neutral (very low chroma) color as black/gray/white by
 * lightness. Returns `undefined` if the color has enough chroma to be treated
 * as a hue.
 */
function classifyNeutral(
    color: ReturnType<typeof colord>,
): CanonicalColorKey | undefined {
    const { c, l } = color.toLch();
    if (c >= NEUTRAL_CHROMA_THRESHOLD) {
        return undefined;
    }
    if (l <= NEUTRAL_BLACK_MAX_LIGHTNESS) {
        return "black";
    }
    if (l >= NEUTRAL_WHITE_MIN_LIGHTNESS) {
        return "white";
    }
    return "gray";
}

/**
 * Find the canonical family whose anchor is perceptually closest to `color`,
 * using the CIEDE2000 color-difference metric.
 */
function nearestCanonicalFamily(
    color: ReturnType<typeof colord>,
): CanonicalColorKey | undefined {
    let bestCanonical: CanonicalColorKey | undefined;
    let bestDelta = Infinity;
    for (const anchor of anchorColordList) {
        const delta = color.delta(anchor.color);
        if (delta < bestDelta) {
            bestDelta = delta;
            bestCanonical = anchor.canonical;
        }
    }
    return bestCanonical;
}

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
 * - Classify near-neutral colors by lightness, then perceptually match the rest
 *   against curated anchors (CIEDE2000) for numeric formats.
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
        const parsedColor = colord(trimmedColorValue);

        if (!parsedColor.isValid()) {
            throw Error("Unparseable color value");
        }

        const canonicalName =
            classifyNeutral(parsedColor) ?? nearestCanonicalFamily(parsedColor);

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

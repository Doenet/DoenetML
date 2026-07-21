import { colorValueToWord } from "./colorWords";
import {
    DEFAULT_STYLE_VALUES,
    getStyleValueNumber,
    getStyleValueString,
    normalizeStyleDefinitionValues,
    normalizeStyleDefinitionsValues,
    resolveStyleDefinition,
    setStyleValue,
    unwrapStyleDefinition,
    type RawStyleDefinition,
    type StyleAttributes,
    type StyleDefinition,
    type StyleDefinitionKey,
    type StyleDefinitions,
} from "./styleDefinitionHelpers";
import { contrastAccessibilityDiagnosticsForStyleDefinitions } from "./styleContrastAccessibility";
import {
    cycleStyleNumberForPalette,
    DEFAULT_PALETTE_NAME,
    STYLE_PALETTES,
    type StylePalette,
} from "./palettes";
import {
    deriveAccessibleDarkModeColor,
    deriveAccessibleDarkModeBackground,
    invertLightness,
    GRAPHIC_CONTRAST_THRESHOLD,
    TEXT_CONTRAST_THRESHOLD,
    CANVAS_TEXT_LIGHT_MODE_COLOR,
    CANVAS_TEXT_DARK_MODE_COLOR,
} from "./colorAccessibility";

/**
 * Style helpers and state-variable definitions shared by renderable components.
 *
 * This module maintains default style presets, merges style definitions from
 * setup children, and provides text-friendly style descriptions.
 */

type StateVariableDefinitions = Record<string, any>;

/** Public style attributes that can be applied to components. */
export let styleAttributes: StyleAttributes = {
    lineColor: {
        componentType: "text",
        description: "Color used for line strokes (light mode).",
    },
    lineColorWord: {
        componentType: "text",
        description: "Human-readable name of the line color (light mode).",
    },
    lineColorDarkMode: {
        componentType: "text",
        description: "Color used for line strokes (dark mode).",
    },
    lineColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the line color (dark mode).",
    },
    lineOpacity: {
        componentType: "number",
        description: "Opacity of line strokes, 0 to 1.",
    },
    lineWidth: {
        componentType: "number",
        description: "Stroke width for lines, in pixels.",
    },
    lineWidthWord: {
        componentType: "text",
        description: "Human-readable name of the line width.",
    },
    lineStyle: {
        componentType: "text",
        description: "Stroke style for lines.",
        toLowerCase: true,
        validValues: [
            { value: "solid", description: "Continuous, unbroken stroke." },
            {
                value: "dashed",
                description: "Stroke composed of evenly-spaced dashes.",
            },
            {
                value: "dotted",
                description: "Stroke composed of evenly-spaced dots.",
            },
        ],
    },
    lineStyleWord: {
        componentType: "text",
        description: "Human-readable name of the line style.",
    },
    markerColor: {
        componentType: "text",
        description: "Color used for markers/points (light mode).",
    },
    markerColorWord: {
        componentType: "text",
        description: "Human-readable name of the marker color (light mode).",
    },
    markerColorDarkMode: {
        componentType: "text",
        description: "Color used for markers/points (dark mode).",
    },
    markerColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the marker color (dark mode).",
    },
    markerOpacity: {
        componentType: "number",
        description: "Opacity of markers/points, 0 to 1.",
    },
    markerStyle: {
        componentType: "text",
        description: "Marker shape.",
        toLowerCase: true,
        validValues: [
            { value: "circle", description: "Circular marker." },
            { value: "square", description: "Square marker." },
            {
                value: "triangle",
                description:
                    'Triangular marker pointing up (alias for "triangleUp").',
            },
            {
                value: "triangleUp",
                description: "Triangular marker pointing up.",
            },
            {
                value: "triangleDown",
                description: "Triangular marker pointing down.",
            },
            {
                value: "triangleLeft",
                description: "Triangular marker pointing left.",
            },
            {
                value: "triangleRight",
                description: "Triangular marker pointing right.",
            },
            { value: "diamond", description: "Diamond-shaped marker." },
            { value: "cross", description: "Cross-shaped marker (×)." },
            { value: "plus", description: "Plus-shaped marker (+)." },
        ],
    },
    markerStyleWord: {
        componentType: "text",
        description: "Human-readable name of the marker style.",
    },
    markerSize: {
        componentType: "number",
        description: "Marker size in pixels.",
    },
    markerFilled: {
        componentType: "boolean",
        description:
            "Whether the marker is rendered filled (true) or open (false). Has no effect when markerStyle is cross or plus, which have no interior.",
    },
    fillColor: {
        componentType: "text",
        description: "Fill color used inside closed shapes (light mode).",
    },
    fillColorWord: {
        componentType: "text",
        description: "Human-readable name of the fill color (light mode).",
    },
    fillColorDarkMode: {
        componentType: "text",
        description: "Fill color used inside closed shapes (dark mode).",
    },
    fillColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the fill color (dark mode).",
    },
    fillOpacity: {
        componentType: "number",
        description: "Opacity of solid fills, 0 to 1.",
    },
    fillPatternOpacity: {
        componentType: "number",
        description: "Opacity of pattern fills (non-solid fillStyle), 0 to 1.",
    },
    fillStyle: {
        componentType: "text",
        description: "Fill pattern used inside closed shapes.",
        toLowerCase: true,
        validValues: [
            { value: "solid", description: "Solid fill." },
            {
                value: "horizontal",
                description: "Horizontal line pattern.",
            },
            {
                value: "vertical",
                description: "Vertical line pattern.",
            },
            {
                value: "diagonal",
                description: "Diagonal line pattern (/).",
            },
            {
                value: "backDiagonal",
                description: "Back-diagonal line pattern (\\).",
            },
            {
                value: "dots",
                description: "Dots pattern.",
            },
            {
                value: "diamonds",
                description: "Filled diamonds pattern.",
            },
        ],
    },
    fillStyleWord: {
        componentType: "text",
        description: "Human-readable name of the fill style.",
    },
    textColor: {
        componentType: "text",
        description: "Text color (light mode).",
    },
    textColorWord: {
        componentType: "text",
        description: "Human-readable name of the text color (light mode).",
    },
    textColorDarkMode: {
        componentType: "text",
        description: "Text color (dark mode).",
    },
    textColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the text color (dark mode).",
    },
    highContrastColor: {
        componentType: "text",
        description: "High-contrast accent color (light mode).",
    },
    highContrastColorWord: {
        componentType: "text",
        description:
            "Human-readable name of the high-contrast accent color (light mode).",
    },
    highContrastColorDarkMode: {
        componentType: "text",
        description: "High-contrast accent color (dark mode).",
    },
    highContrastColorWordDarkMode: {
        componentType: "text",
        description:
            "Human-readable name of the high-contrast accent color (dark mode).",
    },
    backgroundColor: {
        componentType: "text",
        description: "Background color (light mode).",
    },
    backgroundColorWord: {
        componentType: "text",
        description:
            "Human-readable name of the background color (light mode).",
    },
    backgroundColorDarkMode: {
        componentType: "text",
        description: "Background color (dark mode).",
    },
    backgroundColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the background color (dark mode).",
    },
};

/**
 * Subset of {@link styleAttributes}.markerStyle.validValues whose shapes have
 * a meaningful filled-vs-unfilled distinction. Components like `<endpoint>`
 * and `<equilibriumPoint>` render the marker open or closed based on their
 * own semantic state (`open` / `stable`), so they should restrict
 * `markerStyle` to shapes that visually express both variants. `cross` and
 * `plus` have no interior to fill, so their open/closed semantic would be
 * invisible — those values are excluded here.
 */
export const markerStyleValuesWithFillVariants =
    styleAttributes.markerStyle.validValues!.filter(
        (entry) => entry.value !== "cross" && entry.value !== "plus",
    );

/**
 * Per-category groupings of overridable style attributes. Each graphical
 * component opts into the categories its renderer actually uses (via
 * `static styleOverrideCategories` on the class — see GraphicalComponent),
 * keeping the per-component attribute schema honest.
 *
 * Intentional exclusions:
 * - **Color keys** (`*Color`, `*ColorDarkMode`, etc.) stay `<styleDefinition>`-
 *   only so the per-styleNumber WCAG contrast diagnostics remain authoritative.
 * - **`lineOpacity` and `markerOpacity`** stay `<styleDefinition>`-only for the
 *   same reason — `styleContrastAccessibility.ts` feeds them in as an
 *   `opacityMultiplier` on the foreground alpha, so they participate in the
 *   effective-color contrast check just like the color itself. (`fillOpacity`
 *   is decorative and not part of the contrast check, so it stays overridable.)
 * - **`*Word` descriptors** are derived from the underlying value (e.g.
 *   `markerStyle` "circle" → `markerStyleWord` "point") and authors with niche
 *   vocabulary needs can override them inside a `<styleDefinition>`.
 */
const MARKER_OVERRIDE_KEYS = [
    "markerStyle",
    "markerSize",
    "markerFilled",
] as const satisfies readonly StyleDefinitionKey[];

const LINE_OVERRIDE_KEYS = [
    "lineStyle",
    "lineWidth",
] as const satisfies readonly StyleDefinitionKey[];

const FILL_OVERRIDE_KEYS = [
    "fillOpacity",
    "fillPatternOpacity",
    "fillStyle",
] as const satisfies readonly StyleDefinitionKey[];

/**
 * Marker shape / size / filled-vs-open toggles for point-like components.
 * `markerOpacity` is intentionally NOT here — it feeds the WCAG contrast
 * diagnostic (see the module-load guard below) and stays `<styleDefinition>`-only.
 */
export const markerOverrideAttributes: StyleAttributes = Object.fromEntries(
    MARKER_OVERRIDE_KEYS.map((key) => [key, styleAttributes[key]]),
);

/**
 * Stroke style / width for any component that renders an outline.
 * `lineOpacity` is intentionally NOT here — it feeds the WCAG contrast
 * diagnostic (see the module-load guard below) and stays `<styleDefinition>`-only.
 */
export const lineOverrideAttributes: StyleAttributes = Object.fromEntries(
    LINE_OVERRIDE_KEYS.map((key) => [key, styleAttributes[key]]),
);

/**
 * Fill toggles for closed-shape components. `fillOpacity`, `fillPatternOpacity`,
 * and `fillStyle` are both decorative and not part of the contrast check, unlike
 * `lineOpacity` / `markerOpacity`.
 */
export const fillOverrideAttributes: StyleAttributes = Object.fromEntries(
    FILL_OVERRIDE_KEYS.map((key) => [key, styleAttributes[key]]),
);

/**
 * Union of every per-component override attribute (marker + line + fill).
 * Retained as the single iterable used by callers (e.g. tests) that need to
 * know "what's overridable in principle" without caring which category each
 * key belongs to. Per-component dispatch goes through the category-specific
 * exports above.
 */
export const styleOverrideAttributes: StyleAttributes = {
    ...markerOverrideAttributes,
    ...lineOverrideAttributes,
    ...fillOverrideAttributes,
};

/** Registry consumed by GraphicalComponent's per-category dispatch. */
export const STYLE_OVERRIDE_CATEGORIES = {
    marker: markerOverrideAttributes,
    line: lineOverrideAttributes,
    fill: fillOverrideAttributes,
} as const;

export type StyleOverrideCategory = keyof typeof STYLE_OVERRIDE_CATEGORIES;

/**
 * Module-load guard against future drift. Three constraints are enforced:
 *
 * 1. **No color keys.** Color authoring stays `<styleDefinition>`-only so
 *    per-styleNumber WCAG contrast diagnostics remain authoritative.
 * 2. **No contrast-feeding opacity keys.** `lineOpacity` and `markerOpacity`
 *    are fed into the contrast diagnostic as `opacityMultiplier` on the
 *    foreground alpha (see `styleContrastAccessibility.ts`), so they
 *    participate in the effective-color check just like the color itself.
 *    Only `fillOpacity` and `fillPatternOpacity` are contrast-irrelevant and
 *    overridable.
 * 3. **Text-typed keys must opt in to lowercase.** The override path in
 *    `returnSelectedStyleStateVariableDefinition` only lowercases string
 *    values when the attribute spec sets `toLowerCase: true`, but the
 *    parallel `<styleDefinition>` path lowercases unconditionally. Today's
 *    text-typed override keys (`markerStyle`, `lineStyle`, `fillStyle`) all
 *    opt in; the guard fails loudly if a new one slips in without opting in.
 */
for (const [category, group] of Object.entries(STYLE_OVERRIDE_CATEGORIES)) {
    for (const [key, spec] of Object.entries(group)) {
        if (key.toLowerCase().includes("color")) {
            throw new Error(
                `Style override category "${category}" contains color-related key "${key}"; ` +
                    `colors stay <styleDefinition>-only so per-styleNumber WCAG contrast diagnostics remain authoritative. ` +
                    `If this is intentional, also reconcile the lowercase asymmetry in returnSelectedStyleStateVariableDefinition.`,
            );
        }
        if (
            key.endsWith("Opacity") &&
            key !== "fillOpacity" &&
            key !== "fillPatternOpacity"
        ) {
            throw new Error(
                `Style override category "${category}" contains contrast-feeding opacity key "${key}"; ` +
                    `lineOpacity and markerOpacity feed the WCAG contrast diagnostic as an opacityMultiplier on the foreground alpha, ` +
                    `so they stay <styleDefinition>-only alongside colors. Only fillOpacity and fillPatternOpacity are contrast-irrelevant and overridable.`,
            );
        }
        if (spec.componentType === "text" && !spec.toLowerCase) {
            throw new Error(
                `Style override key "${key}" in category "${category}" is text-typed but missing toLowerCase: true. ` +
                    `Add toLowerCase: true to its styleAttributes entry, or move it out of the override surface.`,
            );
        }
    }
}

/**
 * Translates a {@link styleAttributes} entry into the attribute-spec shape
 * consumed by `createAttributesObject` on components. Forwards optional
 * `validValues` / `toLowerCase` so the schema generator can surface
 * `type: "keyword"` enums with autocomplete entries.
 *
 * Single source of truth for both `<styleDefinition>` (in `StyleDefinitions.js`)
 * and the per-component override path (in `GraphicalComponent.js`) so the two
 * can't drift when a new metadata field is added.
 */
export function attributeSpecFromStyleAttribute(
    spec: StyleAttributes[string],
): Record<string, unknown> {
    const attr: Record<string, unknown> = {
        createComponentOfType: spec.componentType,
        description: spec.description,
    };
    if (spec.validValues) {
        attr.validValues = spec.validValues;
    }
    if (spec.toLowerCase) {
        attr.toLowerCase = spec.toLowerCase;
    }
    return attr;
}

/**
 * Baseline style used when a style number references no explicit definition.
 *
 * Color words are intentionally omitted here and injected on demand so there is
 * one source of truth for color values.
 */
let defaultStyle: RawStyleDefinition = { ...DEFAULT_STYLE_VALUES };

/**
 * The "item" prefixes used to build every color-bearing styleAttribute key:
 * `${item}Color`, `${item}ColorDarkMode`, `${item}ColorWord`,
 * `${item}ColorWordDarkMode`. Exported so the LSP-side active-default hint
 * (#1198) can identify color attributes by canonical key rather than a
 * name-shape regex — the schema's `componentType` is "text" for everything
 * (colors included), so this list is the only place that knows which keys
 * carry hex/color-word data.
 */
export const coloredItemsForWords = [
    "line",
    "marker",
    "fill",
    "text",
    "highContrast",
    "background",
] as const;

/**
 * Adds missing color-word fields (light and dark mode) derived from color values.
 * Existing word values are preserved.
 */
function addMissingColorWordsToStyleDefinition(
    styleDef: StyleDefinition,
): StyleDefinition {
    for (const item of coloredItemsForWords) {
        const colorKey = `${item}Color` as StyleDefinitionKey;
        const colorWordKey = `${colorKey}Word` as StyleDefinitionKey;
        const darkKey = `${colorKey}DarkMode` as StyleDefinitionKey;
        const darkWordKey = `${colorWordKey}DarkMode` as StyleDefinitionKey;

        const colorValue = getStyleValueString(styleDef, colorKey);
        if (!(colorWordKey in styleDef) && colorValue) {
            setStyleValue(styleDef, colorWordKey, colorValueToWord(colorValue));
        }

        const darkColorValue = getStyleValueString(styleDef, darkKey);
        if (!(darkWordKey in styleDef) && darkColorValue) {
            setStyleValue(
                styleDef,
                darkWordKey,
                colorValueToWord(darkColorValue),
            );
        }
    }

    return styleDef;
}

/**
 * Clones the baseline default style and enriches it with any missing color words.
 */
function cloneDefaultStyleWithMissingColorWords(): StyleDefinition {
    return addMissingColorWordsToStyleDefinition(
        normalizeStyleDefinitionValues(Object.assign({}, defaultStyle)),
    );
}

/**
 * Derives a dark-mode color for one color item from its light-mode value.
 *
 * Two strategies are used, and the choice between them is deliberate — it tracks
 * **what the color is contrasted against**, not the kind of item:
 *
 *  - **Contrasted against the *fixed* canvas** (`line`, `marker`, `fill`,
 *    `highContrast`): visibility on the dark canvas is *monotonic in lightness*
 *    (lighter = more visible), so we lighten the color just until it clears its
 *    threshold against the dark canvas. Because the other side of the contrast
 *    is a known constant, this **guarantees** an accessible result by
 *    construction (no diagnostic needed) with zero author effort. Note that
 *    lightness *inversion* would be wrong here: a light-mode-accessible graphic
 *    color may already sit on the lighter half of the scale, and inverting its
 *    lightness would push it *darker* and below threshold.
 *
 *  - **Contrasted against an *author-variable* partner** (`text` vs
 *    `background`): the goal is to flip the figure/ground relationship
 *    (white-on-black → black-on-white), so we invert each color's lightness
 *    independently of the other. Text uses this same inversion even when no
 *    background is authored, so its behavior stays stable if a background later
 *    comes from a parent/child style block. Independence keeps the result
 *    order/locality-invariant but means the derived dark value is not accessible
 *    by construction, so contrast is checked after the fact by the diagnostics
 *    (which also suggest a concrete `*ColorDarkMode` fix).
 *
 * The unifying rule: derive each color to be accessible against its fixed
 * reference when it has one; only fall back to independent inversion + diagnostic
 * when two author-variable colors form a pair. If graphic items ever gain an
 * author-specified background, that graphic/background pairing should move to
 * the second strategy (invert + diagnose), the same way text/background does.
 *
 * Per-item thresholds and opacity handling:
 *  - `highContrast`: text threshold (4.5:1) against the canvas, opaque.
 *  - `line` / `marker`: graphic threshold (3:1), composited with the item's
 *    stroke/marker opacity so the derived color reads at its rendered opacity.
 *  - `fill`: graphic threshold (3:1) treated as opaque — fills paint at a low
 *    `fillOpacity` and are decorative, so we derive a readable tint and let the
 *    opacity apply at render time rather than forcing the (unreachable) 3:1 on
 *    the translucent fill.
 */
function deriveDarkModeColorForItem(
    item: (typeof coloredItemsForWords)[number],
    lightColor: string,
    styleDef: StyleDefinition,
): string {
    if (item === "background") {
        return deriveAccessibleDarkModeBackground(lightColor);
    }

    if (item === "text") {
        // Invert independently of the background (a fixed canvas is not the
        // reference here — the partner background is author-variable), so the
        // pair's accessibility is verified by the diagnostics rather than
        // guaranteed by construction. See deriveDarkModeColorForItem docs.
        return invertLightness(lightColor);
    }

    if (item === "highContrast") {
        return deriveAccessibleDarkModeColor({
            lightColor,
            threshold: TEXT_CONTRAST_THRESHOLD,
        });
    }

    if (item === "line" || item === "marker") {
        const opacityKey = `${item}Opacity` as StyleDefinitionKey;
        const opacityDefault = DEFAULT_STYLE_VALUES[
            opacityKey as keyof typeof DEFAULT_STYLE_VALUES
        ] as number | undefined;
        const opacity =
            getStyleValueNumber(styleDef, opacityKey) ?? opacityDefault ?? 1;
        return deriveAccessibleDarkModeColor({
            lightColor,
            threshold: GRAPHIC_CONTRAST_THRESHOLD,
            opacityMultiplier: opacity,
        });
    }

    // fill (and any future graphic item): readable opaque tint.
    return deriveAccessibleDarkModeColor({
        lightColor,
        threshold: GRAPHIC_CONTRAST_THRESHOLD,
    });
}

/**
 * For each color item where the author supplied a light-mode color but no
 * dark-mode color, derives an accessible dark-mode color (see
 * {@link deriveDarkModeColorForItem}). Authored dark-mode colors are left
 * untouched. Missing `*Word` descriptors (light and dark) are then derived from
 * the resulting color values, so the dark-mode word reflects the derived
 * dark-mode color rather than the light-mode one.
 *
 * Exported so the LSP-side static styleDefinition resolver (issue #1198) can
 * apply the same per-block normalization the worker runs before merging an
 * authored `<styleDefinition>` into the inherited map. Without it, the active
 * default for derived fields (e.g. `markerColorWord` when the block sets
 * `markerColor` but not the word) would lag behind the runtime by reflecting
 * the previously-resolved word instead of the freshly-derived one.
 */
export function addMissingChildStyleColorFields(
    styleDef: StyleDefinition,
): StyleDefinition {
    // Each color item's dark-mode value is derived independently of the others,
    // so the order here doesn't affect the result.
    for (const item of coloredItemsForWords) {
        deriveMissingDarkModeColor(styleDef, item);
    }

    return addMissingColorWordsToStyleDefinition(styleDef);
}

/**
 * Derives the missing `${item}ColorDarkMode` value for one color item from its
 * light-mode `${item}Color`, if the light color is present and the dark color is
 * not. The derived value carries no source position: the per-channel contrast
 * diagnostics only flag values that have a position, which keeps those
 * diagnostics scoped to author-supplied `*ColorDarkMode` values. (A derived
 * text/background *combination* that ends up inaccessible is reported separately
 * by the contrast diagnostics, anchored to the authored light colors.)
 */
function deriveMissingDarkModeColor(
    styleDef: StyleDefinition,
    item: (typeof coloredItemsForWords)[number],
): void {
    const colorKey = `${item}Color` as StyleDefinitionKey;
    const darkKey = `${colorKey}DarkMode` as StyleDefinitionKey;

    if (!(colorKey in styleDef) || darkKey in styleDef) {
        return;
    }

    const colorValue = getStyleValueString(styleDef, colorKey);
    if (colorValue === undefined) {
        return;
    }

    const darkColor = deriveDarkModeColorForItem(item, colorValue, styleDef);
    setStyleValue(styleDef, darkKey, darkColor);
}

/**
 * Fills any missing `*Word` descriptor fields derivable from the corresponding
 * underlying values on `styleDef`. Authored words are preserved.
 *
 * Derivations:
 * - `lineWidth` (number) → `lineWidthWord`: `"thick"` (>=4), `"thin"` (<=1),
 *   else `""`.
 * - `lineStyle` (text) → `lineStyleWord`: `"dashed"`, `"dotted"`, else `""`.
 * - `markerStyle` (text) → `markerStyleWord`: copies the value, then normalizes
 *   `"circle"` → `"point"` and any `"triangle*"` → `"triangle"`.
 * - `fillStyle` (text) → `fillStyleWord`: human-readable description of the
 *   fill pattern (e.g. `"horizontal lines"`, `"diamonds"`), or `""` for
 *   `"solid"`.
 *
 * Used both by the styleDefinitions-merge path and by the per-component
 * override path so the two share identical word-derivation rules.
 *
 * Exported so the LSP-side static styleDefinition resolver (issue #1198)
 * can run the same per-block derivation the worker uses; otherwise the
 * active default for e.g. `lineWidthWord` would surface the preset's
 * `"thick"` even after the same block sets `lineWidth=2` (which the
 * runtime derives back to `""`).
 */
export function deriveMissingStyleWords(styleDef: StyleDefinition): void {
    if ("lineWidth" in styleDef && !("lineWidthWord" in styleDef)) {
        const widthValue = getStyleValueNumber(styleDef, "lineWidth");
        if (widthValue !== undefined) {
            const widthPosition = styleDef.lineWidth?.position;
            const word =
                widthValue >= 4 ? "thick" : widthValue <= 1 ? "thin" : "";
            setStyleValue(styleDef, "lineWidthWord", word, widthPosition);
        }
    }

    if ("lineStyle" in styleDef && !("lineStyleWord" in styleDef)) {
        const lineStyle = getStyleValueString(styleDef, "lineStyle");
        if (lineStyle) {
            const lineStylePosition = styleDef.lineStyle?.position;
            const word =
                lineStyle === "dashed"
                    ? "dashed"
                    : lineStyle === "dotted"
                      ? "dotted"
                      : "";
            setStyleValue(styleDef, "lineStyleWord", word, lineStylePosition);
        }
    }

    if ("markerStyle" in styleDef && !("markerStyleWord" in styleDef)) {
        const markerStyle = getStyleValueString(styleDef, "markerStyle");
        const markerStylePosition = styleDef.markerStyle?.position;

        if (markerStyle) {
            setStyleValue(
                styleDef,
                "markerStyleWord",
                markerStyle,
                markerStylePosition,
            );
        }

        const markerStyleWord = getStyleValueString(
            styleDef,
            "markerStyleWord",
        );

        if (markerStyleWord === "circle") {
            setStyleValue(
                styleDef,
                "markerStyleWord",
                "point",
                markerStylePosition,
            );
        } else if (
            markerStyleWord &&
            markerStyleWord.slice(0, 8) === "triangle"
        ) {
            setStyleValue(
                styleDef,
                "markerStyleWord",
                "triangle",
                markerStylePosition,
            );
        }
    }

    if ("fillStyle" in styleDef && !("fillStyleWord" in styleDef)) {
        const fillStyle = getStyleValueString(styleDef, "fillStyle");
        if (fillStyle) {
            const fillStylePosition = styleDef.fillStyle?.position;
            const fillStyleWordMap: Record<string, string> = {
                solid: "",
                horizontal: "horizontal lines",
                vertical: "vertical lines",
                diagonal: "diagonal lines",
                backdiagonal: "reverse diagonal lines",
                dots: "dots",
                diamonds: "diamonds",
            };
            const word = fillStyleWordMap[fillStyle] ?? "";
            setStyleValue(styleDef, "fillStyleWord", word, fillStylePosition);
        }
    }
}

/**
 * Expands a palette's raw style definitions into the full wrapped form. Per
 * style, in order:
 *
 *   1. values are normalized to `{ style, position? }`;
 *   2. enum-valued keys are lowercased (see {@link lowercaseEnumStyleValues});
 *   3. style number 1's text color is forced neutral (see
 *      {@link applyNeutralTextColor});
 *   4. unstated line/marker opacities become fully opaque (see
 *      {@link applyFullGraphicOpacity});
 *   5. an unstated dark-mode high-contrast color follows the style's dark-mode
 *      text color (see {@link pairDarkModeHighContrastWithText});
 *   6. missing `*ColorDarkMode` values are derived from their light-mode
 *      colors;
 *   7. missing `*Word` descriptors are derived from the resulting values.
 *
 * Steps 4-7 never overwrite an authored value, and steps 2 and 3 are
 * value-preserving for the `"default"` palette (its enum values are already
 * lowercase and its style 1 already carries the canvas text color), so its
 * expansion reproduces the historical six-preset output.
 *
 * Returns a fresh map on every call; the input palette data is not mutated.
 */
export function expandStylePalette(palette: StylePalette): StyleDefinitions {
    const styleDefinitions = normalizeStyleDefinitionsValues(palette.styles);

    for (const [styleNumber, styleDef] of Object.entries(styleDefinitions)) {
        lowercaseEnumStyleValues(styleDef);
        if (styleNumber === NEUTRAL_TEXT_STYLE_NUMBER) {
            applyNeutralTextColor(styleDef);
        }
        applyFullGraphicOpacity(styleDef);
        pairDarkModeHighContrastWithText(styleDef);
        addMissingChildStyleColorFields(styleDef);
        deriveMissingStyleWords(styleDef);
    }

    return styleDefinitions;
}

/**
 * The style number that content lands on when its author specified none.
 * Its text color is neutral in every palette — see
 * {@link applyNeutralTextColor}.
 */
const NEUTRAL_TEXT_STYLE_NUMBER = "1";

/**
 * Forces style number 1's text color to the canvas text color, in place.
 *
 * Text and math outside a graph render with `selectedStyle.textColor`
 * (see `textRendererStyle`), and content that specifies no style number
 * falls on style 1 — so whatever style 1 says its text color is becomes the
 * color of ordinary prose. A palette must therefore not paint style 1's
 * text, or selecting it would recolor every unstyled `<text>` and `<m>` in
 * the document.
 *
 * The `"default"` palette has always encoded this (its style 1 pairs
 * `textColor: black` with `highContrastColor: #2963FF`); applying it here
 * makes the rule uniform and unforgettable rather than something each
 * palette must remember. A style's own color remains available for text
 * through `highContrastColor`, which is exactly that color at text-contrast
 * strength, and styles 2 and up are unaffected.
 *
 * Style numbers that cycle onto style 1 resolve to this definition, so they
 * inherit the neutral text too — matching what out-of-range style numbers
 * already do without a palette, where the fallback is `DEFAULT_STYLE_VALUES`
 * (also black). Authored `*Word` entries for these keys are dropped so the
 * descriptions re-derive from the neutral colors and stay truthful; palettes
 * should not author any of the four keys in the first place (see the
 * {@link StylePalette} doc).
 */
function applyNeutralTextColor(styleDef: StyleDefinition): void {
    setStyleValue(styleDef, "textColor", CANVAS_TEXT_LIGHT_MODE_COLOR);
    setStyleValue(styleDef, "textColorDarkMode", CANVAS_TEXT_DARK_MODE_COLOR);
    delete styleDef.textColorWord;
    delete styleDef.textColorWordDarkMode;
}

/**
 * The style keys whose values renderers require lowercased, i.e. those whose
 * attribute spec sets `toLowerCase: true` (today `lineStyle`, `markerStyle`,
 * and `fillStyle`). Computed once rather than per style definition.
 */
const LOWERCASED_STYLE_KEYS = Object.entries(styleAttributes)
    .filter(([, spec]) => spec.toLowerCase)
    .map(([key]) => key as StyleDefinitionKey);

/**
 * Lowercases the values of the {@link LOWERCASED_STYLE_KEYS}, in place.
 *
 * Authored values reach renderers already lowercased — the
 * `<styleDefinition>` path lowercases unconditionally, and the
 * per-component override path honours the same flag — and renderers hand
 * these straight to JSXGraph, whose face and dash names are all lowercase.
 * Palette data never travels the attribute path, so without this a palette
 * written with the schema's camelCase spelling (`markerStyle:
 * "triangleDown"`, which is exactly how `validValues` presents it) would
 * reach JSXGraph as an unknown face name and its objects would render
 * INVISIBLE rather than fall back to a default shape. Normalizing here lets
 * palette modules use the documented spelling and still be renderer-correct.
 */
function lowercaseEnumStyleValues(styleDef: StyleDefinition): void {
    for (const key of LOWERCASED_STYLE_KEYS) {
        const value = getStyleValueString(styleDef, key);
        if (value !== undefined && value !== value.toLowerCase()) {
            setStyleValue(styleDef, key, value.toLowerCase());
        }
    }
}

/**
 * Makes a palette style's lines and markers fully opaque unless the palette
 * says otherwise, in place.
 *
 * A palette's colors are chosen against the WCAG graphic threshold (3:1) as
 * they will be *composited onto the canvas*, which means at the opacity they
 * render with — `presetPaletteAccessibility.test.ts` checks them that way.
 * Without this rule a palette that states no opacity inherits
 * `DEFAULT_STYLE_VALUES.lineOpacity` / `.markerOpacity` of `0.7`, which drops
 * a color verified at full strength well below 3:1 (a published palette
 * anchor sitting at 3.0-4.5 lands near 2.1-2.9 once it is 70% blended into
 * the canvas). Full opacity is therefore the palette default, and a palette
 * that wants the softer look states `lineOpacity` / `markerOpacity`
 * explicitly and gets checked at that value.
 *
 * The `"default"` palette states both on every style (`0.7`, and `1` on style
 * 5), so it is unaffected — the historical look is preserved. This runs
 * before dark-mode derivation on purpose: `deriveDarkModeColorForItem` reads
 * the style's line/marker opacity when choosing how far to lighten a color
 * for the dark canvas, so it must see the opacity the style will render with.
 */
function applyFullGraphicOpacity(styleDef: StyleDefinition): void {
    for (const key of ["lineOpacity", "markerOpacity"] as const) {
        if (!(key in styleDef)) {
            setStyleValue(styleDef, key, 1);
        }
    }
}

/**
 * Gives an unstated `highContrastColorDarkMode` the style's authored
 * `textColorDarkMode`, in place, when the two keys carry the same color in
 * light mode.
 *
 * `highContrastColor` is a style's own color at text-contrast strength, which
 * is the same thing `textColor` is for styles 2 and up — every built-in
 * palette gives them one shared light-mode value. Deriving the dark-mode
 * high-contrast color independently breaks that pairing, because derivation
 * only lightens the *light-mode* color as far as 4.5:1 on the dark canvas
 * requires and knows nothing about the brighter dark-mode anchor the palette
 * pinned for its text. A style whose dark mode is white would report a
 * mid-gray `highContrastColorDarkMode` (the derivation's floor), and a style
 * whose dark mode is bright yellow would report a dark olive — each
 * contradicting the style's own dark-mode description.
 *
 * Only an authored `textColorDarkMode` counts: with none, both keys derive
 * from the same light-mode color and stay consistent on their own. Style
 * number 1 drops out on the same light-mode test, because
 * {@link applyNeutralTextColor} has already replaced its text color with the
 * canvas text color — and in the one case where it still matches (a style 1
 * whose own color *is* that neutral), pairing gives the right answer anyway.
 */
function pairDarkModeHighContrastWithText(styleDef: StyleDefinition): void {
    if ("highContrastColorDarkMode" in styleDef) {
        return;
    }
    const textColorDarkMode = getStyleValueString(
        styleDef,
        "textColorDarkMode",
    );
    if (textColorDarkMode === undefined) {
        return;
    }
    const textColor = getStyleValueString(styleDef, "textColor");
    const highContrastColor = getStyleValueString(
        styleDef,
        "highContrastColor",
    );
    if (
        textColor === undefined ||
        highContrastColor === undefined ||
        textColor.toLowerCase() !== highContrastColor.toLowerCase()
    ) {
        return;
    }
    setStyleValue(styleDef, "highContrastColorDarkMode", textColorDarkMode);
}

/**
 * Returns the expanded style definitions of the named built-in palette,
 * falling back to the `"default"` palette when the name is not registered
 * (callers surface their own unknown-name warning).
 *
 * Returns a fresh map on every call, so callers may mutate the result.
 */
export function returnPaletteStyleDefinitions(
    paletteName: string,
): StyleDefinitions {
    const palette =
        STYLE_PALETTES[paletteName] ?? STYLE_PALETTES[DEFAULT_PALETTE_NAME];
    return expandStylePalette(palette);
}

/**
 * Returns built-in style presets used when no ancestor style definitions exist
 * — the expansion of the `"default"` palette (see `palettes/default.ts`).
 *
 * Exported so the LSP-side static styleDefinition resolver (issue #1198) can
 * seed its inheritance walk with the same 6 numbered presets the runtime uses
 * before merging author-defined `<styleDefinition>` blocks. Keeping the LSP in
 * lockstep with the runtime here means an authored override falls back to the
 * same preset the runtime would.
 *
 * IMPORTANT: this function is lazily cached on the LSP side (see
 * `resolve-active-style.ts`'s `_palettePresetsCache`), so its output must
 * stay pure w.r.t. mutable module state. Palette expansion reads only the
 * palette registry, which is deeply frozen at registration precisely to
 * protect this invariant; do not switch it to read from the mutable
 * `defaultStyle` variable without first dropping that cache or the LSP will
 * silently desync from runtime mutations.
 */
export function returnDefaultStyleDefinitions(): StyleDefinitions {
    return returnPaletteStyleDefinitions(DEFAULT_PALETTE_NAME);
}

/**
 * Flatten a mixed child list (target children interleaved with `<setup>`
 * children, in document order) into just the target children: each `<setup>`
 * child is replaced by the target children the caller registered for it under
 * the dependency key `` `${perSetupPrefix}${componentIdx}` ``. Preserves
 * document order, which "last wins" semantics rely on.
 */
function childrenExpandingSetups(
    dependencyValues: any,
    mixedChildren: any[],
    perSetupPrefix: string,
): any[] {
    const out: any[] = [];
    for (const child of mixedChildren) {
        if (child.componentType === "setup") {
            out.push(
                ...dependencyValues[`${perSetupPrefix}${child.componentIdx}`],
            );
        } else {
            out.push(child);
        }
    }
    return out;
}

/**
 * State-variable definitions that construct merged `styleDefinitions` from:
 * - a local stylePalette selection (which resets the base for the subtree),
 * - otherwise ancestor defaults,
 * - local styleDefinition children,
 * - setup descendants.
 */
export function returnStyleDefinitionStateVariables(): StateVariableDefinitions {
    let stateVariableDefinitions: StateVariableDefinitions = {};

    stateVariableDefinitions.setupChildren = {
        returnDependencies: () => ({
            setupChildren: {
                dependencyType: "child",
                childGroups: ["setups"],
                proceedIfAllChildrenNotMatched: true,
            },
        }),
        definition({ dependencyValues }: { dependencyValues: any }) {
            return {
                setValue: { setupChildren: dependencyValues.setupChildren },
            };
        },
    };

    stateVariableDefinitions.localStylePaletteName = {
        stateVariablesDeterminingDependencies: ["setupChildren"],
        returnDependencies({ stateValues }: { stateValues: any }) {
            let dependencies: Record<string, any> = {
                stylePaletteSetupChildren: {
                    dependencyType: "child",
                    childGroups: ["stylePalettes", "setups"],
                    variableNames: ["palette"],
                    variablesOptional: true,
                    proceedIfAllChildrenNotMatched: true,
                },
            };

            for (let setupChild of stateValues.setupChildren) {
                dependencies[`stylePalettesOf${setupChild.componentIdx}`] = {
                    dependencyType: "child",
                    parentIdx: setupChild.componentIdx,
                    childGroups: ["stylePalettes"],
                    variableNames: ["palette"],
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }: { dependencyValues: any }) {
            const stylePaletteChildren = childrenExpandingSetups(
                dependencyValues,
                dependencyValues.stylePaletteSetupChildren,
                "stylePalettesOf",
            );

            if (stylePaletteChildren.length === 0) {
                return { setValue: { localStylePaletteName: null } };
            }

            const diagnostics = [];
            if (stylePaletteChildren.length > 1) {
                for (const child of stylePaletteChildren.slice(0, -1)) {
                    diagnostics.push({
                        type: "warning",
                        message:
                            "A section can select only one <stylePalette>; using the last one.",
                        position: child.position,
                    });
                }
            }

            const localStylePaletteName =
                stylePaletteChildren[stylePaletteChildren.length - 1]
                    .stateValues.palette;

            return {
                setValue: { localStylePaletteName },
                sendDiagnostics: diagnostics,
            };
        },
    };

    stateVariableDefinitions.activeStylePaletteName = {
        returnDependencies: () => ({
            localStylePaletteName: {
                dependencyType: "stateVariable",
                variableName: "localStylePaletteName",
            },
            ancestorWithStyle: {
                dependencyType: "ancestor",
                variableNames: ["activeStylePaletteName"],
            },
        }),
        definition({ dependencyValues }: { dependencyValues: any }) {
            const activeStylePaletteName =
                dependencyValues.localStylePaletteName ??
                dependencyValues.ancestorWithStyle?.stateValues
                    .activeStylePaletteName ??
                null;

            return { setValue: { activeStylePaletteName } };
        },
    };

    stateVariableDefinitions.styleDefinitions = {
        mustEvaluate: true,
        stateVariablesDeterminingDependencies: ["setupChildren"],
        returnDependencies({ stateValues }: { stateValues: any }) {
            let dependencies: Record<string, any> = {
                ancestorWithStyle: {
                    dependencyType: "ancestor",
                    variableNames: ["styleDefinitions"],
                },
                localStylePaletteName: {
                    dependencyType: "stateVariable",
                    variableName: "localStylePaletteName",
                },
                activeStylePaletteName: {
                    dependencyType: "stateVariable",
                    variableName: "activeStylePaletteName",
                },
                styleDefinitionSetupChildren: {
                    dependencyType: "child",
                    childGroups: ["styleDefinitions", "setups"],
                    variableNames: ["styleNumber", "styleDefinition"],
                    variablesOptional: true,
                    proceedIfAllChildrenNotMatched: true,
                },
            };

            for (let setupChild of stateValues.setupChildren) {
                dependencies[`styleDefinitionsOf${setupChild.componentIdx}`] = {
                    dependencyType: "child",
                    parentIdx: setupChild.componentIdx,
                    childGroups: ["styleDefinitions"],
                    variableNames: ["styleNumber", "styleDefinition"],
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }: { dependencyValues: any }) {
            const styleDefinitions: StyleDefinitions = {};

            let startingStateVariableDefinitions: StyleDefinitions | undefined;

            // A local <stylePalette> resets the base for this subtree: the
            // palette replaces the ancestor's merged map, so ancestor
            // <styleDefinition> overrides (tuned against a different
            // palette's colors) are deliberately discarded. Local and
            // descendant <styleDefinition>s apply on top of the palette.
            if (dependencyValues.localStylePaletteName != null) {
                startingStateVariableDefinitions =
                    returnPaletteStyleDefinitions(
                        dependencyValues.localStylePaletteName,
                    );
            } else if (dependencyValues.ancestorWithStyle) {
                startingStateVariableDefinitions =
                    dependencyValues.ancestorWithStyle.stateValues
                        .styleDefinitions;
            }

            if (!startingStateVariableDefinitions) {
                startingStateVariableDefinitions =
                    returnDefaultStyleDefinitions();
            }

            for (const styleNumber in startingStateVariableDefinitions) {
                styleDefinitions[styleNumber] = normalizeStyleDefinitionValues(
                    Object.assign(
                        {},
                        startingStateVariableDefinitions[styleNumber],
                    ),
                );
            }

            const styleDefinitionChildren = childrenExpandingSetups(
                dependencyValues,
                dependencyValues.styleDefinitionSetupChildren,
                "styleDefinitionsOf",
            );

            for (const child of styleDefinitionChildren) {
                const styleNumber = child.stateValues.styleNumber;
                let styleDef = styleDefinitions[styleNumber];

                if (!styleDef) {
                    // With a palette active, an out-of-range style number
                    // seeds from its cycled on-palette entry; otherwise keep
                    // the historical default-style seed.
                    let seed: StyleDefinition | undefined;
                    if (dependencyValues.activeStylePaletteName != null) {
                        const cycledNumber = cycleStyleNumberForPalette(
                            styleNumber,
                            dependencyValues.activeStylePaletteName,
                        );
                        const cycledDef = styleDefinitions[cycledNumber];
                        if (cycledDef) {
                            seed = normalizeStyleDefinitionValues(
                                Object.assign({}, cycledDef),
                            );
                        }
                    }

                    styleDef = styleDefinitions[styleNumber] =
                        seed ?? cloneDefaultStyleWithMissingColorWords();
                }

                const theNewDef = normalizeStyleDefinitionValues(
                    Object.assign({}, child.stateValues.styleDefinition),
                );

                if (child.position) {
                    for (const key in theNewDef) {
                        const typedKey = key as StyleDefinitionKey;
                        const value = theNewDef[typedKey];
                        if (!value) {
                            continue;
                        }

                        if (value.position === undefined) {
                            value.position = child.position;
                        }
                    }
                }

                addMissingChildStyleColorFields(theNewDef);
                deriveMissingStyleWords(theNewDef);

                Object.assign(styleDef, theNewDef);
            }

            const diagnostics =
                contrastAccessibilityDiagnosticsForStyleDefinitions(
                    styleDefinitions,
                );

            return {
                setValue: { styleDefinitions },
                sendDiagnostics: diagnostics,
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * State-variable definition that resolves the currently selected style object.
 *
 * When `overrideAttributeNames` is supplied, the returned `selectedStyle` also
 * depends on those attribute components on the host component and merges any
 * authored values on top of the styleNumber-based definition. The override
 * layer mirrors how `<styleDefinition>` attributes are read in
 * `StyleDefinitions.js`, with one deliberate divergence: string values here
 * are lowercased only when the spec opts in via `toLowerCase: true` (the
 * enum-typed keys — see {@link LOWERCASED_STYLE_KEYS}), whereas the
 * `<styleDefinition>` path lowercases unconditionally to keep color-name
 * lookups case-insensitive. Source positions are preserved, and missing
 * `*Word` descriptors get re-derived from the underlying value via
 * {@link deriveMissingStyleWords}.
 *
 * Callers that don't opt in (the default) preserve today's behavior exactly —
 * `selectedStyle` is the unwrapped/resolved styleNumber lookup.
 */
export function returnSelectedStyleStateVariableDefinition(
    options: {
        overrideAttributeNames?: readonly StyleDefinitionKey[];
    } = {},
): StateVariableDefinitions {
    const overrideAttributeNames = options.overrideAttributeNames ?? [];

    return {
        selectedStyle: {
            forRenderer: true,
            willNeverBeEssential: true,
            returnDependencies: () => {
                const dependencies: Record<string, any> = {
                    styleNumber: {
                        dependencyType: "stateVariable",
                        variableName: "styleNumber",
                    },
                    ancestorWithStyle: {
                        dependencyType: "ancestor",
                        variableNames: [
                            "styleDefinitions",
                            "activeStylePaletteName",
                        ],
                    },
                };

                for (const name of overrideAttributeNames) {
                    dependencies[name] = {
                        dependencyType: "attributeComponent",
                        attributeName: name,
                        variableNames: ["value"],
                    };
                }

                return dependencies;
            },
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let styleDefinitions =
                    dependencyValues.ancestorWithStyle.stateValues
                        .styleDefinitions;
                if (!styleDefinitions) {
                    styleDefinitions = returnDefaultStyleDefinitions();
                }

                let selectedStyle =
                    styleDefinitions[dependencyValues.styleNumber];

                if (selectedStyle === undefined) {
                    // With a palette active, out-of-range style numbers cycle
                    // through the palette instead of falling back to the
                    // generic default style.
                    const activeStylePaletteName =
                        dependencyValues.ancestorWithStyle?.stateValues
                            .activeStylePaletteName;
                    if (activeStylePaletteName != null) {
                        selectedStyle =
                            styleDefinitions[
                                cycleStyleNumberForPalette(
                                    dependencyValues.styleNumber,
                                    activeStylePaletteName,
                                )
                            ];
                    }
                }

                if (selectedStyle === undefined) {
                    selectedStyle = cloneDefaultStyleWithMissingColorWords();
                }

                if (overrideAttributeNames.length > 0) {
                    const overrideStyleDef: StyleDefinition = {};
                    for (const name of overrideAttributeNames) {
                        const dep = dependencyValues[name];
                        if (dep == null) {
                            continue;
                        }

                        let value = dep.stateValues.value;
                        if (value === undefined || value === null) {
                            continue;
                        }
                        // Mirror the `<styleDefinition>` normalization in
                        // `StyleDefinitions.js`: only lowercase when the
                        // attribute spec opts in (e.g. enum-typed `markerStyle`
                        // / `lineStyle`). Free-form text attributes wouldn't
                        // want their casing flattened.
                        if (
                            typeof value === "string" &&
                            styleAttributes[name]?.toLowerCase
                        ) {
                            value = value.toLowerCase();
                        }

                        setStyleValue(
                            overrideStyleDef,
                            name,
                            value,
                            dep.position,
                        );
                    }

                    if (Object.keys(overrideStyleDef).length > 0) {
                        // Derive `*Word` descriptors from override values
                        // before merging, so authored values flow through the
                        // same thresholds as `<styleDefinition>` (e.g.
                        // `lineWidth=1` → `lineWidthWord="thin"`,
                        // `lineWidth=4` → `"thick"`, `lineWidth=2` → `""`)
                        // and replace any custom word the inherited
                        // styleDefinition shipped.
                        deriveMissingStyleWords(overrideStyleDef);
                        // Clone so we don't mutate the ancestor's styleDefinitions map.
                        selectedStyle = Object.assign(
                            {},
                            selectedStyle,
                            overrideStyleDef,
                        );
                    }
                }

                return {
                    setValue: {
                        selectedStyle: resolveStyleDefinition(
                            unwrapStyleDefinition(selectedStyle),
                        ),
                    },
                };
            },
        },
    };
}

/**
 * State-variable definitions used to produce human-readable text style strings
 * (e.g. text color and optional background color description).
 */
export function returnTextStyleDescriptionDefinitions(): StateVariableDefinitions {
    return {
        textColor: {
            description:
                "Human-readable name for this component's text color, derived from the active style and theme.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let selectedStyle = dependencyValues.selectedStyle;

                let textColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    textColorWord = selectedStyle.textColorWordDarkMode;
                } else {
                    textColorWord = selectedStyle.textColorWord;
                }

                return { setValue: { textColor: textColorWord } };
            },
        },

        backgroundColor: {
            description:
                "Human-readable name for this component's background color, derived from the active style and theme.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let selectedStyle = dependencyValues.selectedStyle;

                let backgroundColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    backgroundColorWord =
                        selectedStyle.backgroundColorWordDarkMode;
                } else {
                    backgroundColorWord = selectedStyle.backgroundColorWord;
                }

                if (!backgroundColorWord) {
                    backgroundColorWord = "none";
                }

                return { setValue: { backgroundColor: backgroundColorWord } };
            },
        },

        textStyleDescription: {
            description:
                "Human-readable description of this component's text styling (color and any background color).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                textColor: {
                    dependencyType: "stateVariable",
                    variableName: "textColor",
                },
                backgroundColor: {
                    dependencyType: "stateVariable",
                    variableName: "backgroundColor",
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let textStyleDescription = dependencyValues.textColor;

                if (dependencyValues.backgroundColor !== "none") {
                    textStyleDescription += ` with a ${dependencyValues.backgroundColor} background`;
                }

                return { setValue: { textStyleDescription } };
            },
        },
    };
}

/**
 * Produces renderer-ready text style CSS properties based on active theme mode.
 */
export function textRendererStyle(
    darkMode: "dark" | "light",
    selectedStyle: any,
): { color: string; backgroundColor?: string } {
    let textColor =
        darkMode === "dark"
            ? selectedStyle.textColorDarkMode
            : selectedStyle.textColor;
    let backgroundColor =
        darkMode === "dark"
            ? selectedStyle.backgroundColorDarkMode
            : selectedStyle.backgroundColor;
    let style: { color: string; backgroundColor?: string } = {
        color: textColor,
    };
    if (backgroundColor) {
        style.backgroundColor = backgroundColor;
    }
    return style;
}

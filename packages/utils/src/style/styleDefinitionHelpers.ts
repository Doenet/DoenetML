import type { Position } from "@doenet/parser";

export type StyleAttributes = Record<string, { componentType: string }>;

export type StyleDefinitionPrimitive = string | number;

export type StyleValueWithPosition = {
    style: StyleDefinitionPrimitive;
    position?: Position;
};

export type StyleDefinitionValue = StyleValueWithPosition;

export type StyleDefinitionKey =
    | "lineColor"
    | "lineColorWord"
    | "lineColorDarkMode"
    | "lineColorWordDarkMode"
    | "lineOpacity"
    | "lineWidth"
    | "lineWidthWord"
    | "lineStyle"
    | "lineStyleWord"
    | "markerColor"
    | "markerColorWord"
    | "markerColorDarkMode"
    | "markerColorWordDarkMode"
    | "markerOpacity"
    | "markerStyle"
    | "markerStyleWord"
    | "markerSize"
    | "fillColor"
    | "fillColorWord"
    | "fillColorDarkMode"
    | "fillColorWordDarkMode"
    | "fillOpacity"
    | "textColor"
    | "textColorWord"
    | "textColorDarkMode"
    | "textColorWordDarkMode"
    | "highContrastColor"
    | "highContrastColorWord"
    | "highContrastColorDarkMode"
    | "highContrastColorWordDarkMode"
    | "backgroundColor"
    | "backgroundColorWord"
    | "backgroundColorDarkMode"
    | "backgroundColorWordDarkMode";

export type StyleDefinition = Partial<
    Record<StyleDefinitionKey, StyleDefinitionValue>
>;

export type RawStyleDefinition = Partial<
    Record<
        StyleDefinitionKey,
        StyleDefinitionPrimitive | StyleValueWithPosition
    >
>;

export type PrimitiveStyleDefinition = Partial<
    Record<StyleDefinitionKey, StyleDefinitionPrimitive>
>;

/**
 * Fully-resolved primitive style definition delivered via the `selectedStyle`
 * state variable. Every supported key is guaranteed present — unauthored color
 * and word keys default to `""` so consumers' truthy guards continue to mean
 * "no authored value". Includes every `*Word` variant because the derived
 * `textColor` / `backgroundColor` state-variable definitions in `style.ts`
 * read them off `selectedStyle` to build human-readable descriptions, even
 * though renderers themselves only consume the color values.
 */
export interface ResolvedStyleDefinition {
    lineColor: string;
    lineColorWord: string;
    lineColorDarkMode: string;
    lineColorWordDarkMode: string;
    lineOpacity: number;
    lineWidth: number;
    lineWidthWord: string;
    lineStyle: string;
    lineStyleWord: string;
    markerColor: string;
    markerColorWord: string;
    markerColorDarkMode: string;
    markerColorWordDarkMode: string;
    markerOpacity: number;
    markerStyle: string;
    markerStyleWord: string;
    markerSize: number;
    fillColor: string;
    fillColorWord: string;
    fillColorDarkMode: string;
    fillColorWordDarkMode: string;
    fillOpacity: number;
    textColor: string;
    textColorWord: string;
    textColorDarkMode: string;
    textColorWordDarkMode: string;
    highContrastColor: string;
    highContrastColorWord: string;
    highContrastColorDarkMode: string;
    highContrastColorWordDarkMode: string;
    backgroundColor: string;
    backgroundColorWord: string;
    backgroundColorDarkMode: string;
    backgroundColorWordDarkMode: string;
}

export type ResolvedStyleDefinitionKey = keyof ResolvedStyleDefinition;

export type StyleDefinitions = Record<string, StyleDefinition>;

export type RawStyleDefinitions = Record<string, RawStyleDefinition>;

/**
 * Type guard that checks whether a style value is wrapped in the
 * `{ style, position? }` object form.
 *
 * @param value - Candidate style value.
 * @returns True if the value is an object with a `style` property.
 */
export function isStyleValueWithPosition(
    value: StyleDefinitionPrimitive | StyleValueWithPosition | undefined,
): value is StyleValueWithPosition {
    return typeof value === "object" && value !== null && "style" in value;
}

/**
 * Reads a style value as a string from a style definition.
 *
 * @param styleDef - Style definition map.
 * @param key - Style key to read.
 * @returns String value when present and of string type, otherwise undefined.
 */
export function getStyleValueString(
    styleDef: StyleDefinition,
    key: StyleDefinitionKey,
): string | undefined {
    const value = styleDef[key]?.style;
    return typeof value === "string" ? value : undefined;
}

/**
 * Reads a style value as a number from a style definition.
 *
 * @param styleDef - Style definition map.
 * @param key - Style key to read.
 * @returns Number value when present and of number type, otherwise undefined.
 */
export function getStyleValueNumber(
    styleDef: StyleDefinition,
    key: StyleDefinitionKey,
): number | undefined {
    const value = styleDef[key]?.style;
    return typeof value === "number" ? value : undefined;
}

/**
 * Sets a style value on a style definition using wrapped object form.
 *
 * @param styleDef - Style definition object to mutate.
 * @param key - Style key to set.
 * @param style - Primitive style value.
 * @param position - Optional source position associated with the value.
 * @returns Nothing. Mutates `styleDef` in place.
 */
export function setStyleValue(
    styleDef: StyleDefinition,
    key: StyleDefinitionKey,
    style: StyleDefinitionPrimitive,
    position?: Position,
) {
    styleDef[key] = {
        style,
        position,
    };
}

/**
 * Normalizes one raw style definition into wrapped object form for all values.
 *
 * Here, "wrapped" means each defined style key is stored as
 * `{ style: <primitive>, position?: <source position> }`.
 *
 * @param styleDef - Raw style definition where values may be primitive or wrapped.
 * @returns Normalized style definition where each defined value is wrapped.
 */
export function normalizeStyleDefinitionValues(
    styleDef: RawStyleDefinition,
): StyleDefinition {
    const normalizedStyleDefinition: StyleDefinition = {};

    for (const key in styleDef) {
        const typedKey = key as StyleDefinitionKey;
        const value = styleDef[typedKey];
        if (value === undefined) {
            continue;
        }

        if (isStyleValueWithPosition(value)) {
            setStyleValue(
                normalizedStyleDefinition,
                typedKey,
                value.style,
                value.position,
            );
        } else {
            setStyleValue(normalizedStyleDefinition, typedKey, value);
        }
    }

    return normalizedStyleDefinition;
}

/**
 * Normalizes a map of raw style definitions into wrapped object form.
 *
 * Here, "wrapped" means each defined style key is stored as
 * `{ style: <primitive>, position?: <source position> }`.
 *
 * @param styleDefinitions - Map of style numbers to raw style definitions.
 * @returns Map with each style definition normalized to wrapped values.
 */
export function normalizeStyleDefinitionsValues(
    styleDefinitions: RawStyleDefinitions,
): StyleDefinitions {
    const normalizedStyleDefinitions: StyleDefinitions = {};

    for (const styleNumber in styleDefinitions) {
        normalizedStyleDefinitions[styleNumber] =
            normalizeStyleDefinitionValues(styleDefinitions[styleNumber]);
    }

    return normalizedStyleDefinitions;
}

/**
 * Unwraps a normalized style definition back to primitive values only.
 *
 * @param styleDef - Normalized style definition with wrapped values.
 * @returns Primitive-only style definition suitable for renderer/state consumers.
 */
export function unwrapStyleDefinition(
    styleDef: StyleDefinition,
): PrimitiveStyleDefinition {
    const unwrappedStyleDefinition: PrimitiveStyleDefinition = {};

    for (const key in styleDef) {
        const typedKey = key as StyleDefinitionKey;
        const value = styleDef[typedKey]?.style;
        if (value !== undefined) {
            unwrappedStyleDefinition[typedKey] = value;
        }
    }

    return unwrappedStyleDefinition;
}

/**
 * Default style values shared between the worker-side `defaultStyle` preset and
 * the renderer-facing `RESOLVED_STYLE_FALLBACKS`. Single source of truth so the
 * two cannot drift apart.
 *
 * `backgroundColor` is intentionally absent: its absence in `defaultStyle` is
 * load-bearing — `addMissingColorWordsToStyleDefinition` only emits a `*Word`
 * variant when the corresponding color is truthy, so leaving it out prevents a
 * background description from being derived for components with no authored
 * background. The renderer-facing fallbacks override it back to `""` for the
 * truthy-guard semantics renderers rely on.
 */
export const DEFAULT_STYLE_VALUES = {
    lineOpacity: 0.7,
    lineWidth: 4,
    lineWidthWord: "thick",
    lineStyle: "solid",
    lineStyleWord: "",
    markerOpacity: 0.7,
    markerStyle: "circle",
    markerStyleWord: "point",
    markerSize: 5,
    fillOpacity: 0.3,
    lineColor: "#648FFF",
    lineColorDarkMode: "#648FFF",
    markerColor: "#648FFF",
    markerColorDarkMode: "#648FFF",
    fillColor: "#648FFF",
    fillColorDarkMode: "#648FFF",
    textColor: "black",
    textColorDarkMode: "white",
    highContrastColor: "#2963FF",
    highContrastColorDarkMode: "#2963FF",
} as const satisfies Partial<
    Record<StyleDefinitionKey, StyleDefinitionPrimitive>
>;

/**
 * Final-stop fallbacks used when a key is genuinely absent at unwrap time.
 *
 * Color/word entries here are `""` — not a valid color or color-word — to
 * encode "no authored value" rather than fabricate a placeholder. Two consumer
 * patterns make this safe:
 *
 *   - **Truthy guards.** Renderers and the derived `backgroundColor`
 *     state-variable definition handle legitimately-optional keys with checks
 *     like `if (backgroundColor) { … }` (math.tsx, text.tsx, label.tsx,
 *     number.tsx; `style.ts:706` for `backgroundColorWord`). `""` is falsy, so
 *     the guard treats it as absent. The guarded color keys are
 *     `backgroundColor`/`backgroundColorDarkMode`, which are intentionally not
 *     in `DEFAULT_STYLE_VALUES` (its absence is what keeps
 *     `addMissingColorWordsToStyleDefinition` from synthesizing a derived
 *     background color word).
 *   - **Word variants are derived, not authored.** `lineColorWord`,
 *     `markerColorWord`, `fillColorWord`, `textColorWord`,
 *     `highContrastColorWord`, `backgroundColorWord` (and DarkMode pairs) are
 *     populated by `addMissingColorWordsToStyleDefinition` from their
 *     corresponding color values. The `""` fallback only surfaces when the
 *     paired color is itself missing from the authored definition — an edge
 *     case where neither the color nor its word is meaningful.
 */
const RESOLVED_STYLE_FALLBACKS: ResolvedStyleDefinition = {
    ...DEFAULT_STYLE_VALUES,
    lineColorWord: "",
    lineColorWordDarkMode: "",
    markerColorWord: "",
    markerColorWordDarkMode: "",
    fillColorWord: "",
    fillColorWordDarkMode: "",
    textColorWord: "",
    textColorWordDarkMode: "",
    highContrastColorWord: "",
    highContrastColorWordDarkMode: "",
    backgroundColor: "",
    backgroundColorWord: "",
    backgroundColorDarkMode: "",
    backgroundColorWordDarkMode: "",
};

/**
 * Fills any missing keys in a primitive style definition with renderer-facing
 * fallbacks, returning the fully-resolved shape used by the `selectedStyle`
 * state variable.
 *
 * @param styleDef - Primitive (partial) style definition.
 * @returns Resolved style definition with every supported key present.
 */
export function resolveStyleDefinition(
    styleDef: PrimitiveStyleDefinition,
): ResolvedStyleDefinition {
    const resolved: ResolvedStyleDefinition = { ...RESOLVED_STYLE_FALLBACKS };

    const writable = resolved as Record<
        ResolvedStyleDefinitionKey,
        StyleDefinitionPrimitive
    >;

    for (const key of Object.keys(
        RESOLVED_STYLE_FALLBACKS,
    ) as ResolvedStyleDefinitionKey[]) {
        const value = styleDef[key];
        if (value !== undefined) {
            writable[key] = value;
        }
    }

    return resolved;
}

/**
 * Produces a sortable numeric value from a source position.
 *
 * @param position - Source position object.
 * @returns Numeric value used for ordering positions from earlier to later.
 */
function positionSortValue(position: Position): number {
    if (typeof position.start?.offset === "number") {
        return position.start.offset;
    }

    const line = position.start?.line ?? 0;
    const column = position.start?.column ?? 0;
    return line * 1_000_000 + column;
}

/**
 * Chooses the latest (right-most/later) position from a list.
 *
 * @param positions - Candidate positions, possibly undefined.
 * @returns The latest defined position, or undefined if none are defined.
 */
export function latestPosition(
    ...positions: (Position | undefined)[]
): Position | undefined {
    let latest: Position | undefined;

    for (const position of positions) {
        if (!position) {
            continue;
        }

        if (
            !latest ||
            positionSortValue(position) >= positionSortValue(latest)
        ) {
            latest = position;
        }
    }

    return latest;
}

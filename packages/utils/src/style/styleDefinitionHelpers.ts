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

import me from "math-expressions";
import { roundForDisplay } from "@doenet/utils";

export type GraphControlsMode = "all" | "slidersonly" | "inputsonly" | "none";
export type PointControlsMode = "both" | "xonly" | "yonly" | "none";
export type GraphControlAxis = "x" | "y";

export type GraphControlPoint = {
    componentIdx: number;
    pointNumber: number;
    x: number;
    y: number;
    addControls: string;
    label: string;
    labelHasLatex: boolean;
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

/**
 * Normalize graph-level controls mode from core SVs.
 *
 * Invalid or missing values are treated as "none" so renderers do not show
 * controls unless explicitly requested by authored content/core state.
 */
export function normalizeGraphControlsMode(value: unknown): GraphControlsMode {
    if (typeof value !== "string") {
        return "none";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "all" ||
        normalized === "slidersonly" ||
        normalized === "inputsonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "none";
}

/**
 * Point-level controls mode parser.
 *
 * Invalid or missing values are treated as "both" so an individual point
 * keeps legacy behavior unless it explicitly opts out of an axis.
 */
export function normalizePointControlsMode(value: unknown): PointControlsMode {
    if (typeof value !== "string") {
        return "both";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "both" ||
        normalized === "xonly" ||
        normalized === "yonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "both";
}

/**
 * Parse a single numeric expression used by x/y text inputs.
 *
 * Returns null for invalid expressions or non-finite results.
 */
export function parseSingleMathNumber(input: string): number | null {
    try {
        const expression = me.fromText(input);
        const value = expression?.evaluate_to_constant?.();
        return Number.isFinite(value) ? value : null;
    } catch (_error) {
        return null;
    }
}

/**
 * Parse an ordered pair from text input.
 *
 * Accepts tuple/vector syntax and returns null unless both coordinates
 * evaluate to finite constants.
 */
export function parseOrderedPair(
    input: string,
): { x: number; y: number } | null {
    try {
        const expression = me.fromText(input);
        const tree = expression?.tree;
        if (!Array.isArray(tree) || tree.length !== 3) {
            return null;
        }

        const operator = tree[0];
        if (operator !== "tuple" && operator !== "vector") {
            return null;
        }

        const x = me.fromAst(tree[1])?.evaluate_to_constant?.();
        const y = me.fromAst(tree[2])?.evaluate_to_constant?.();

        if (x === null || y === null) {
            return null;
        }

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return null;
        }

        return { x, y };
    } catch (_error) {
        return null;
    }
}

/**
 * Remove stale entries from an input state record when points/modes change.
 *
 * Returns the original object when no keys were removed so React can avoid
 * unnecessary rerenders caused by identity changes.
 */
export function pruneRecordByActiveKeys(
    previousRecord: Record<string, string>,
    activeKeys: Set<string>,
): Record<string, string> {
    const nextRecord: Record<string, string> = {};
    let changed = false;

    for (const key of Object.keys(previousRecord)) {
        const value = previousRecord[key];
        if (activeKeys.has(key)) {
            nextRecord[key] = value;
        } else {
            changed = true;
        }
    }

    return changed ? nextRecord : previousRecord;
}

/**
 * Generate a unified input key for state tracking.
 * Supports different suffixes: x-axis, y-axis, or pair input.
 */
export function makeInputKey(
    componentIdx: number,
    suffix: GraphControlAxis | "pair",
): string {
    return `${componentIdx}|${suffix}`;
}

/**
 * Generate an error message ID for aria-describedby attributes.
 */
export function makeErrorId(
    elementId: string,
    componentIdx: number,
    suffix: string,
): string {
    return `${elementId}-error-point-${componentIdx}-${suffix}`;
}

/**
 * Normalize slider bounds for reversed graph axis ranges.
 */
export function normalizedSliderBounds(rawMin: number, rawMax: number) {
    const min = Math.min(rawMin, rawMax);
    const max = Math.max(rawMin, rawMax);
    return { min, max };
}

/**
 * Format coordinates using the same display/padding settings as point labels.
 */
export function formatCoordinateForControls(
    value: number,
    point: GraphControlPoint,
): string {
    const rounded = roundForDisplay({
        value,
        dependencyValues: {
            displayDigits: point.displayDigits,
            displayDecimals: point.displayDecimals,
            displaySmallAsZero: point.displaySmallAsZero,
        },
    });

    const params: any = {};
    if (point.padZeros) {
        if (Number.isFinite(point.displayDecimals)) {
            params.padToDecimals = point.displayDecimals;
        }
        if (point.displayDigits >= 1) {
            params.padToDigits = point.displayDigits;
        }
    }

    return rounded.toString(params);
}

/**
 * Build the active input key set for current graph- and point-level modes.
 */
export function deriveActiveInputKeys({
    includeInputs,
    coreControlPoints,
    graphControlsMode,
}: {
    includeInputs: boolean;
    coreControlPoints: GraphControlPoint[];
    graphControlsMode: GraphControlsMode;
}): Set<string> {
    const activeInputKeys = new Set<string>();

    if (!includeInputs) {
        return activeInputKeys;
    }

    for (const point of coreControlPoints) {
        const pointControlsMode = normalizePointControlsMode(point.addControls);

        if (pointControlsMode === "none") {
            continue;
        }

        if (graphControlsMode === "all") {
            if (pointControlsMode !== "yonly") {
                activeInputKeys.add(makeInputKey(point.componentIdx, "x"));
            }
            if (pointControlsMode !== "xonly") {
                activeInputKeys.add(makeInputKey(point.componentIdx, "y"));
            }
        } else if (graphControlsMode === "inputsonly") {
            if (pointControlsMode === "both") {
                activeInputKeys.add(makeInputKey(point.componentIdx, "pair"));
            } else if (pointControlsMode === "xonly") {
                activeInputKeys.add(makeInputKey(point.componentIdx, "x"));
            } else if (pointControlsMode === "yonly") {
                activeInputKeys.add(makeInputKey(point.componentIdx, "y"));
            }
        }
    }

    return activeInputKeys;
}

/**
 * Build the active transient-slider key set for current point mode filters.
 */
export function deriveActiveSliderAxisKeys({
    includeSliders,
    coreControlPoints,
}: {
    includeSliders: boolean;
    coreControlPoints: GraphControlPoint[];
}): Set<string> {
    const activeSliderAxisKeys = new Set<string>();

    if (!includeSliders) {
        return activeSliderAxisKeys;
    }

    for (const { componentIdx, addControls } of coreControlPoints) {
        const normalizedAddControls = normalizePointControlsMode(addControls);

        if (
            normalizedAddControls !== "yonly" &&
            normalizedAddControls !== "none"
        ) {
            activeSliderAxisKeys.add(makeInputKey(componentIdx, "x"));
        }

        if (
            normalizedAddControls !== "xonly" &&
            normalizedAddControls !== "none"
        ) {
            activeSliderAxisKeys.add(makeInputKey(componentIdx, "y"));
        }
    }

    return activeSliderAxisKeys;
}

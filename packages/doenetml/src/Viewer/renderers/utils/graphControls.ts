export type GraphControlsMode = "all" | "slidersonly" | "inputsonly" | "none";
export type PointControlsMode = "both" | "xonly" | "yonly" | "none";
export type CircleControlsMode =
    | "center"
    | "radius"
    | "centerandradius"
    | "none";
export type LineSegmentControlsMode = "endpoints" | "none";
export type VectorControlsMode =
    | "displacement"
    | "headandtail"
    | "headonly"
    | "tailonly"
    | "none";
export type GraphControlAxis = "x" | "y";

export type GraphControlDisplaySettings = {
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

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

export type GraphControlCircle = {
    componentIdx: number;
    circleNumber: number;
    center: { x: number; y: number };
    radius: number;
    addControls: string;
    label: string;
    labelHasLatex: boolean;
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

export type GraphControlLineSegment = {
    componentIdx: number;
    lineSegmentNumber: number;
    endpoint1: { x: number; y: number };
    endpoint2: { x: number; y: number };
    addControls: string;
    label: string;
    labelHasLatex: boolean;
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

export type GraphControlVector = {
    componentIdx: number;
    vectorNumber: number;
    head: { x: number; y: number };
    tail: { x: number; y: number };
    displacement: { x: number; y: number };
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

export function normalizeCircleControlsMode(
    value: unknown,
): CircleControlsMode {
    if (typeof value !== "string") {
        return "centerandradius";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "center" ||
        normalized === "radius" ||
        normalized === "centerandradius" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "centerandradius";
}

/**
 * Line-segment controls mode parser.
 *
 * Invalid or missing values are treated as "endpoints".
 */
export function normalizeLineSegmentControlsMode(
    value: unknown,
): LineSegmentControlsMode {
    if (typeof value !== "string") {
        return "endpoints";
    }

    const normalized = value.toLowerCase();
    if (normalized === "endpoints" || normalized === "none") {
        return normalized;
    }

    return "endpoints";
}

/**
 * Vector controls mode parser.
 *
 * Invalid or missing values are treated as "displacement".
 */
export function normalizeVectorControlsMode(
    value: unknown,
): VectorControlsMode {
    if (typeof value !== "string") {
        return "displacement";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "displacement" ||
        normalized === "headandtail" ||
        normalized === "headonly" ||
        normalized === "tailonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "displacement";
}

/**
 * Remove stale entries from an input state record when active controls change.
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
 * Generate an error message ID for input keys used across graph control families.
 */
export function makeInputErrorId(
    elementId: string,
    controlFamily: string,
    inputKey: string,
): string {
    return `${elementId}-error-${controlFamily}-${inputKey.replace(/\|/g, "-")}`;
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

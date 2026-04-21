export type GraphControlsMode = "all" | "slidersonly" | "inputsonly" | "none";
export type PointControlsMode = "both" | "xonly" | "yonly" | "none";
export type CircleControlsMode =
    | "center"
    | "radius"
    | "centerandradius"
    | "none";
export type RegularPolygonControlsMode =
    | "center"
    | "radius"
    | "centerandradius"
    | "none";
export type PolygonControlsMode = "center" | "none";
export type TriangleControlsMode = "center" | "none";
export type RectangleControlsMode =
    | "center"
    | "widthandheight"
    | "centerwidthandheight"
    | "none";
export type LineSegmentControlsMode = "endpoints" | "none";
export type VectorControlsMode =
    | "displacement"
    | "headandtail"
    | "headonly"
    | "tailonly"
    | "none";
export type GraphControlAxis = "x" | "y";

export type PointMoveRole =
    | "point"
    | "center"
    | "rectangle"
    | "polygon"
    | "triangle"
    | "regularPolygon"
    | "endpoint1"
    | "endpoint2"
    | "displacement"
    | "head"
    | "tail";

export type UnifiedPointMovePayload = {
    componentIdx: number;
    pointRole: PointMoveRole;
    x: number;
    y: number;
    transient: boolean;
    skippable: boolean;
    sourceDetails?: Record<string, any>;
    actionId?: string;
};

export type PointLikeInputSuffix = GraphControlAxis | "pair";
export type ScalarControlRole = string;

export type GraphControlDisplaySettings = {
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

export type GraphControlPoint = {
    controlType: "point";
    componentIdx: number;
    pointNumber: number;
    controlOrder: number;
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
    controlType: "circle";
    componentIdx: number;
    circleNumber: number;
    controlOrder: number;
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

export type GraphControlRegularPolygon = {
    controlType: "regularPolygon";
    componentIdx: number;
    regularPolygonNumber: number;
    controlOrder: number;
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

export type GraphControlPolygon = {
    controlType: "polygon";
    componentIdx: number;
    polygonNumber: number;
    controlOrder: number;
    center: { x: number; y: number };
    addControls: string;
    label: string;
    labelHasLatex: boolean;
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

export type GraphControlTriangle = {
    controlType: "triangle";
    componentIdx: number;
    triangleNumber: number;
    controlOrder: number;
    center: { x: number; y: number };
    addControls: string;
    label: string;
    labelHasLatex: boolean;
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

export type GraphControlRectangle = {
    controlType: "rectangle";
    componentIdx: number;
    rectangleNumber: number;
    controlOrder: number;
    center: { x: number; y: number };
    width: number;
    height: number;
    addControls: string;
    label: string;
    labelHasLatex: boolean;
    displayDigits: number;
    displayDecimals: number;
    displaySmallAsZero: number;
    padZeros: boolean;
};

export type GraphControlLineSegment = {
    controlType: "lineSegment";
    componentIdx: number;
    lineSegmentNumber: number;
    controlOrder: number;
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
    controlType: "vector";
    componentIdx: number;
    vectorNumber: number;
    controlOrder: number;
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

export type GraphControlItem =
    | GraphControlPoint
    | GraphControlCircle
    | GraphControlRegularPolygon
    | GraphControlPolygon
    | GraphControlTriangle
    | GraphControlRectangle
    | GraphControlLineSegment
    | GraphControlVector;

export const GRAPH_CONTROL_TYPES = [
    "point",
    "circle",
    "regularPolygon",
    "polygon",
    "triangle",
    "rectangle",
    "lineSegment",
    "vector",
] as const;

const GRAPH_CONTROL_TYPE_SET: ReadonlySet<string> = new Set(
    GRAPH_CONTROL_TYPES,
);

export type GraphControlsFamilySVs = {
    addControls: string;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    graphicalDescendantsForControls: GraphControlItem[];
};

export type GraphControlsFamilyProps = {
    id: string;
    SVs: GraphControlsFamilySVs;
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

/**
 * Select controls of a single discriminator from the unified controls list.
 */
export function selectGraphControlsByType<
    TControlType extends GraphControlItem["controlType"],
>(
    controls: GraphControlItem[],
    controlType: TControlType,
): Extract<GraphControlItem, { controlType: TControlType }>[] {
    return controls.filter(
        (
            item,
        ): item is Extract<GraphControlItem, { controlType: TControlType }> =>
            item.controlType === controlType,
    );
}

/**
 * Runtime guard for control payloads arriving from the worker.
 *
 * TypeScript already enforces known discriminators at compile time, but this
 * guard ensures malformed runtime payloads fail loudly instead of being routed
 * to an incorrect controls family.
 */
export function assertKnownGraphControlType(
    controlType: string,
): GraphControlItem["controlType"] {
    if (GRAPH_CONTROL_TYPE_SET.has(controlType)) {
        return controlType as GraphControlItem["controlType"];
    }

    throw new Error(
        `[graph-controls] Unsupported controlType "${controlType}" in graphicalDescendantsForControls.`,
    );
}

/**
 * Computes final control render order from authored controlOrder priorities.
 *
 * For slot n (1-indexed):
 * 1) Prefer remaining controls with order in [1..n], picking lowest order first.
 * 2) Else take next control with order 0.
 * 3) Else take the remaining control with the lowest order > n.
 *
 * Relative order within each controlOrder level always follows input order.
 *
 * Contract: All payloads in graphicalDescendantsForControls are guaranteed to
 * have finite non-negative integer controlOrder values. Non-finite values
 * (Infinity, NaN) are normalized to 0 by the worker's extractFiniteControlOrder
 * before payloads are created, so the renderer can assume safe finite values.
 */
export function sortGraphControlsForDisplay(
    controls: GraphControlItem[],
): GraphControlItem[] {
    if (controls.length <= 1) {
        return controls;
    }

    const controlsByOrder = new Map<number, GraphControlItem[]>();
    for (const control of controls) {
        const existingGroup = controlsByOrder.get(control.controlOrder);
        if (existingGroup) {
            existingGroup.push(control);
            continue;
        }

        controlsByOrder.set(control.controlOrder, [control]);
    }

    const positiveOrderKeys = Array.from(controlsByOrder.keys())
        .filter((order) => order > 0)
        .sort((a, b) => a - b);
    const nextIndexByOrder = new Map<number, number>();

    function hasRemaining(order: number): boolean {
        const group = controlsByOrder.get(order);
        if (!group) {
            return false;
        }
        return (nextIndexByOrder.get(order) ?? 0) < group.length;
    }

    function takeNext(order: number): GraphControlItem | null {
        const group = controlsByOrder.get(order);
        if (!group) {
            return null;
        }

        const nextIndex = nextIndexByOrder.get(order) ?? 0;
        if (nextIndex >= group.length) {
            return null;
        }

        nextIndexByOrder.set(order, nextIndex + 1);
        return group[nextIndex];
    }

    function selectOrderForSlot(slotNumber: number): number | null {
        // Fill slots 1,2,3,... in order. For each slot, prefer the lowest available
        // order in [1..slotNumber], then fallback to zero-order (default), then higher orders.
        for (const order of positiveOrderKeys) {
            if (order > slotNumber) {
                break;
            }
            if (hasRemaining(order)) {
                return order;
            }
        }

        if (hasRemaining(0)) {
            return 0;
        }

        for (const order of positiveOrderKeys) {
            if (order > slotNumber && hasRemaining(order)) {
                return order;
            }
        }

        return null;
    }

    const result: GraphControlItem[] = [];
    for (let slotNumber = 1; result.length < controls.length; slotNumber += 1) {
        const selectedOrder = selectOrderForSlot(slotNumber);
        if (selectedOrder === null) {
            break;
        }

        const nextControl = takeNext(selectedOrder);
        if (nextControl) {
            result.push(nextControl);
        }
    }

    return result;
}

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
    // Preserve existing circle behavior when authored mode is missing/invalid.
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

export function normalizeRegularPolygonControlsMode(
    value: unknown,
): RegularPolygonControlsMode {
    // Preserve existing regular-polygon behavior when authored mode is missing/invalid.
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

export function normalizePolygonControlsMode(
    value: unknown,
): PolygonControlsMode {
    // Preserve existing polygon behavior when authored mode is missing/invalid.
    if (typeof value !== "string") {
        return "center";
    }

    const normalized = value.toLowerCase();
    if (normalized === "center" || normalized === "none") {
        return normalized;
    }

    return "center";
}

export function normalizeTriangleControlsMode(
    value: unknown,
): TriangleControlsMode {
    // Preserve existing triangle behavior when authored mode is missing/invalid.
    if (typeof value !== "string") {
        return "center";
    }

    const normalized = value.toLowerCase();
    if (normalized === "center" || normalized === "none") {
        return normalized;
    }

    return "center";
}

export function normalizeRectangleControlsMode(
    value: unknown,
): RectangleControlsMode {
    // Preserve existing rectangle behavior when authored mode is missing/invalid.
    if (typeof value !== "string") {
        return "centerwidthandheight";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "center" ||
        normalized === "widthandheight" ||
        normalized === "centerwidthandheight" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "centerwidthandheight";
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
 * Generate an error message ID for input keys used across graph control families.
 */
export function makeInputErrorId(
    elementId: string,
    controlFamily: string,
    inputKey: string,
): string {
    return `${elementId}-error-${controlFamily}-${inputKey.replace(/[|:]/g, "-")}`;
}

/**
 * Build a role-aware input key for point-like control draft/error state.
 */
export function makePointLikeInputKey(
    componentIdx: number,
    pointRole: PointMoveRole,
    suffix: PointLikeInputSuffix,
    kind: "draft" | "error",
): string {
    return `${componentIdx}:${pointRole}:${suffix}:${kind}`;
}

/**
 * Build a role-aware key for point-like transient slider state.
 */
export function makePointLikeTransientAxisKey(
    componentIdx: number,
    pointRole: PointMoveRole,
    axis: GraphControlAxis,
): string {
    return `${componentIdx}:${pointRole}:${axis}:transient`;
}

export function makePointLikeDraftKey(
    componentIdx: number,
    pointRole: PointMoveRole,
    suffix: PointLikeInputSuffix,
): string {
    return makePointLikeInputKey(componentIdx, pointRole, suffix, "draft");
}

/**
 * Build a role-aware draft key for scalar control state.
 */
export function makeScalarDraftKey(
    componentIdx: number,
    scalarRole: ScalarControlRole,
): string {
    return `${componentIdx}:${scalarRole}:value:draft`;
}

/**
 * Build a role-aware transient key for scalar slider state.
 */
export function makeScalarTransientKey(
    componentIdx: number,
    scalarRole: ScalarControlRole,
): string {
    return `${componentIdx}:${scalarRole}:value:transient`;
}

/**
 * Normalize slider bounds for reversed graph axis ranges.
 */
export function normalizedSliderBounds(rawMin: number, rawMax: number) {
    const min = Math.min(rawMin, rawMax);
    const max = Math.max(rawMin, rawMax);
    return { min, max };
}

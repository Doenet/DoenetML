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
    if (
        (GRAPH_CONTROL_TYPES as readonly string[]).indexOf(controlType) !== -1
    ) {
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
 * Assumption: controlOrder values are non-negative integers. This constraint is
 * enforced in worker component attributes via `clamp: [0, Infinity]` and
 * integer-typed attributes, so an additional lower-bound guard is not needed
 * here.
 */
export function sortGraphControlsForDisplay(
    controls: GraphControlItem[],
): GraphControlItem[] {
    if (controls.length <= 1) {
        return controls;
    }

    const controlsByOrder = new Map<number, GraphControlItem[]>();
    for (const control of controls) {
        const order = control.controlOrder;
        const group = controlsByOrder.get(order);
        if (group) {
            group.push(control);
        } else {
            controlsByOrder.set(order, [control]);
        }
    }

    const orderKeys = Array.from(controlsByOrder.keys()).sort((a, b) => a - b);
    const nextIndexByOrder = new Map<number, number>();
    for (const order of orderKeys) {
        nextIndexByOrder.set(order, 0);
    }

    function hasRemaining(order: number) {
        const group = controlsByOrder.get(order);
        const index = nextIndexByOrder.get(order) ?? 0;
        return Array.isArray(group) && index < group.length;
    }

    function takeNext(order: number) {
        const group = controlsByOrder.get(order);
        const index = nextIndexByOrder.get(order) ?? 0;
        if (!group || index >= group.length) {
            return null;
        }
        nextIndexByOrder.set(order, index + 1);
        return group[index];
    }

    const result: GraphControlItem[] = [];
    for (let slotNumber = 1; result.length < controls.length; slotNumber += 1) {
        let selectedOrder: number | null = null;

        for (let order = 1; order <= slotNumber; order += 1) {
            if (hasRemaining(order)) {
                selectedOrder = order;
                break;
            }
        }

        if (selectedOrder === null && hasRemaining(0)) {
            selectedOrder = 0;
        }

        if (selectedOrder === null) {
            for (const order of orderKeys) {
                if (order > slotNumber && hasRemaining(order)) {
                    selectedOrder = order;
                    break;
                }
            }
        }

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

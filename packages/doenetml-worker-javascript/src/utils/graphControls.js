/**
 * Extracts display/rounding metadata shared by all graph control payloads.
 */
function extractControlDisplaySettings(stateValues) {
    return {
        label: typeof stateValues.label === "string" ? stateValues.label : "",
        labelHasLatex: Boolean(stateValues.labelHasLatex),
        displayDigits: stateValues.displayDigits,
        displayDecimals: stateValues.displayDecimals,
        displaySmallAsZero: stateValues.displaySmallAsZero,
        padZeros: stateValues.padZeros,
    };
}

/**
 * Returns true when vertices contain at least `minVertexCount` 2D finite points.
 */
function hasValid2DNumericalVertices(numericalVertices, minVertexCount) {
    return (
        Array.isArray(numericalVertices) &&
        numericalVertices.length >= minVertexCount &&
        numericalVertices.every(
            (vertex) =>
                Array.isArray(vertex) &&
                vertex.length >= 2 &&
                Number.isFinite(Number(vertex[0])) &&
                Number.isFinite(Number(vertex[1])),
        )
    );
}

/**
 * Computes the arithmetic center of 2D numerical vertices.
 * Returns null when the computed center is non-finite.
 */
function calculate2DVerticesCenter(numericalVertices) {
    const center = numericalVertices.reduce(
        (acc, vertex) => {
            acc[0] += Number(vertex[0]);
            acc[1] += Number(vertex[1]);
            return acc;
        },
        [0, 0],
    );

    center[0] /= numericalVertices.length;
    center[1] /= numericalVertices.length;

    if (!Number.isFinite(center[0]) || !Number.isFinite(center[1])) {
        return null;
    }

    return {
        x: center[0],
        y: center[1],
    };
}

/**
 * Resolves effective addControls mode for shapes with independent center and size draggability.
 *
 * Returns:
 * - `centerMode` when only center movement is allowed
 * - `sizeMode` when only size movement is allowed
 * - `compositeMode` when both are allowed
 * - `null` when neither is allowed
 */
function resolveCompositeControlsMode({
    requestedMode,
    draggable,
    verticesDraggable,
    centerMode,
    sizeMode,
    compositeMode,
}) {
    if (requestedMode === centerMode) {
        return draggable ? centerMode : null;
    }

    if (requestedMode === sizeMode) {
        return verticesDraggable ? sizeMode : null;
    }

    if (requestedMode !== compositeMode) {
        return requestedMode;
    }

    if (draggable && !verticesDraggable) {
        return centerMode;
    }
    if (verticesDraggable && !draggable) {
        return sizeMode;
    }
    if (!draggable && !verticesDraggable) {
        return null;
    }

    return compositeMode;
}

export const GRAPH_CONTROL_COMPONENT_TYPES = [
    "point",
    "circle",
    "triangle",
    "rectangle",
    "regularPolygon",
    "polygon",
    "lineSegment",
    "vector",
];

/**
 * Shared state variables requested for all control descendants.
 *
 * This list is intentionally broad so each control builder can read the fields
 * it needs without adding per-type dependency boilerplate in Graph.
 */
export const GRAPH_CONTROL_VARIABLE_NAMES = [
    "numericalXs",
    "numericalCenter",
    "numericalRadius",
    "numericalVertices",
    "numericalEndpoints",
    "width",
    "height",
    "draggable",
    "verticesDraggable",
    "endpointsDraggable",
    "headDraggable",
    "tailDraggable",
    "fixed",
    "fixLocation",
    "addControls",
    "label",
    "labelHasLatex",
    "displayDigits",
    "displayDecimals",
    "displaySmallAsZero",
    "padZeros",
];

/**
 * Build configuration for graph control payloads.
 *
 * Precedence contract:
 * - Graph walks this array in order and uses the first matching config.
 * - Matching uses inherited-type checks, not only exact type equality.
 * - Therefore, more specific component types must appear before broader
 *   ancestor types (for example triangle/rectangle/regularPolygon before
 *   polygon) so descendants are classified into the intended control family.
 *
 * `buildPayload` must return `null` to skip the descendant and an object with
 * the final renderer payload shape when controls should be shown.
 */
export const GRAPH_CONTROL_DESCENDANT_CONFIGS = [
    {
        componentType: "point",
        controlType: "point",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalXs = stateValues.numericalXs;
            if (!Array.isArray(numericalXs) || numericalXs.length < 2) {
                return null;
            }

            const x = Number(numericalXs[0]);
            const y = Number(numericalXs[1]);
            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                return null;
            }

            const draggable = stateValues.draggable !== false;
            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const addControls = stateValues.addControls;

            if (!draggable || fixed || fixLocation || addControls === "none") {
                return null;
            }

            return {
                controlType: "point",
                componentIdx,
                pointNumber: number,
                x,
                y,
                addControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "circle",
        controlType: "circle",
        buildPayload({ stateValues, componentIdx, number }) {
            const center = stateValues.numericalCenter;
            const radius = Number(stateValues.numericalRadius);

            if (
                !Array.isArray(center) ||
                center.length < 2 ||
                !Number.isFinite(center[0]) ||
                !Number.isFinite(center[1]) ||
                !Number.isFinite(radius) ||
                radius < 0
            ) {
                return null;
            }

            const draggable = stateValues.draggable !== false;
            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const addControls = stateValues.addControls;

            if (fixed || fixLocation || addControls === "none" || !draggable) {
                return null;
            }

            return {
                controlType: "circle",
                componentIdx,
                circleNumber: number,
                center: {
                    x: Number(center[0]),
                    y: Number(center[1]),
                },
                radius,
                addControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "triangle",
        controlType: "triangle",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalVertices = stateValues.numericalVertices;
            if (!hasValid2DNumericalVertices(numericalVertices, 3)) {
                return null;
            }

            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const draggable = stateValues.draggable !== false;
            const addControls = stateValues.addControls;

            if (fixed || fixLocation || addControls === "none" || !draggable) {
                return null;
            }

            const center = calculate2DVerticesCenter(numericalVertices);
            if (!center) {
                return null;
            }

            return {
                controlType: "triangle",
                componentIdx,
                triangleNumber: number,
                center,
                addControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "rectangle",
        controlType: "rectangle",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalVertices = stateValues.numericalVertices;
            const width = Number(stateValues.width);
            const height = Number(stateValues.height);
            const addControls = stateValues.addControls;

            if (!hasValid2DNumericalVertices(numericalVertices, 4)) {
                return null;
            }

            if (
                !Number.isFinite(width) ||
                !Number.isFinite(height) ||
                width < 0 ||
                height < 0
            ) {
                return null;
            }

            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const draggable = stateValues.draggable !== false;
            const verticesDraggable = stateValues.verticesDraggable !== false;

            if (fixed || fixLocation || addControls === "none") {
                return null;
            }

            const effectiveAddControls = resolveCompositeControlsMode({
                requestedMode: addControls,
                draggable,
                verticesDraggable,
                centerMode: "center",
                sizeMode: "widthandheight",
                compositeMode: "centerwidthandheight",
            });

            if (effectiveAddControls === null) {
                return null;
            }

            const center = calculate2DVerticesCenter(numericalVertices);
            if (!center) {
                return null;
            }

            return {
                controlType: "rectangle",
                componentIdx,
                rectangleNumber: number,
                center,
                width,
                height,
                addControls: effectiveAddControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "regularPolygon",
        controlType: "regularPolygon",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalVertices = stateValues.numericalVertices;
            const addControls = stateValues.addControls;

            if (!hasValid2DNumericalVertices(numericalVertices, 3)) {
                return null;
            }

            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const draggable = stateValues.draggable !== false;
            const verticesDraggable = stateValues.verticesDraggable !== false;

            if (fixed || fixLocation || addControls === "none") {
                return null;
            }

            const effectiveAddControls = resolveCompositeControlsMode({
                requestedMode: addControls,
                draggable,
                verticesDraggable,
                centerMode: "center",
                sizeMode: "radius",
                compositeMode: "centerandradius",
            });

            if (effectiveAddControls === null) {
                return null;
            }

            const center = calculate2DVerticesCenter(numericalVertices);
            if (!center) {
                return null;
            }

            const firstVertex = numericalVertices[0];
            const radius = Math.sqrt(
                (Number(firstVertex[0]) - center.x) ** 2 +
                    (Number(firstVertex[1]) - center.y) ** 2,
            );

            if (!Number.isFinite(radius) || radius < 0) {
                return null;
            }

            return {
                controlType: "regularPolygon",
                componentIdx,
                regularPolygonNumber: number,
                center,
                radius,
                addControls: effectiveAddControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "polygon",
        controlType: "polygon",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalVertices = stateValues.numericalVertices;
            const addControls = stateValues.addControls;
            if (!hasValid2DNumericalVertices(numericalVertices, 3)) {
                return null;
            }

            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const draggable = stateValues.draggable !== false;

            if (fixed || fixLocation || addControls === "none" || !draggable) {
                return null;
            }

            const center = calculate2DVerticesCenter(numericalVertices);
            if (!center) {
                return null;
            }

            return {
                controlType: "polygon",
                componentIdx,
                polygonNumber: number,
                center,
                addControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "lineSegment",
        controlType: "lineSegment",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalEndpoints = stateValues.numericalEndpoints;

            if (
                !Array.isArray(numericalEndpoints) ||
                numericalEndpoints.length < 2 ||
                !Array.isArray(numericalEndpoints[0]) ||
                !Array.isArray(numericalEndpoints[1]) ||
                numericalEndpoints[0].length < 2 ||
                numericalEndpoints[1].length < 2
            ) {
                return null;
            }

            const endpoint1x = Number(numericalEndpoints[0][0]);
            const endpoint1y = Number(numericalEndpoints[0][1]);
            const endpoint2x = Number(numericalEndpoints[1][0]);
            const endpoint2y = Number(numericalEndpoints[1][1]);

            if (
                !Number.isFinite(endpoint1x) ||
                !Number.isFinite(endpoint1y) ||
                !Number.isFinite(endpoint2x) ||
                !Number.isFinite(endpoint2y)
            ) {
                return null;
            }

            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const endpointsDraggable = stateValues.endpointsDraggable !== false;
            const addControls = stateValues.addControls;

            if (
                fixed ||
                fixLocation ||
                addControls === "none" ||
                !endpointsDraggable
            ) {
                return null;
            }

            return {
                controlType: "lineSegment",
                componentIdx,
                lineSegmentNumber: number,
                endpoint1: { x: endpoint1x, y: endpoint1y },
                endpoint2: { x: endpoint2x, y: endpoint2y },
                addControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
    {
        componentType: "vector",
        controlType: "vector",
        buildPayload({ stateValues, componentIdx, number }) {
            const numericalEndpoints = stateValues.numericalEndpoints;

            if (
                !Array.isArray(numericalEndpoints) ||
                numericalEndpoints.length < 2 ||
                !Array.isArray(numericalEndpoints[0]) ||
                !Array.isArray(numericalEndpoints[1]) ||
                numericalEndpoints[0].length < 2 ||
                numericalEndpoints[1].length < 2
            ) {
                return null;
            }

            const tailX = Number(numericalEndpoints[0][0]);
            const tailY = Number(numericalEndpoints[0][1]);
            const headX = Number(numericalEndpoints[1][0]);
            const headY = Number(numericalEndpoints[1][1]);

            if (
                !Number.isFinite(tailX) ||
                !Number.isFinite(tailY) ||
                !Number.isFinite(headX) ||
                !Number.isFinite(headY)
            ) {
                return null;
            }

            const fixed = stateValues.fixed === true;
            const fixLocation = stateValues.fixLocation === true;
            const headDraggable = stateValues.headDraggable !== false;
            const tailDraggable = stateValues.tailDraggable !== false;

            if (fixed || fixLocation || stateValues.addControls === "none") {
                return null;
            }

            let effectiveAddControls = stateValues.addControls;

            if (effectiveAddControls === "displacement") {
                if (!headDraggable) {
                    return null;
                }
            } else if (effectiveAddControls === "headandtail") {
                if (headDraggable && !tailDraggable) {
                    effectiveAddControls = "headonly";
                } else if (tailDraggable && !headDraggable) {
                    effectiveAddControls = "tailonly";
                } else if (!headDraggable && !tailDraggable) {
                    return null;
                }
            } else if (effectiveAddControls === "headonly") {
                if (!headDraggable) {
                    return null;
                }
            } else if (effectiveAddControls === "tailonly") {
                if (!tailDraggable) {
                    return null;
                }
            }

            return {
                controlType: "vector",
                componentIdx,
                vectorNumber: number,
                head: {
                    x: headX,
                    y: headY,
                },
                tail: {
                    x: tailX,
                    y: tailY,
                },
                displacement: {
                    x: headX - tailX,
                    y: headY - tailY,
                },
                addControls: effectiveAddControls,
                ...extractControlDisplaySettings(stateValues),
            };
        },
    },
];

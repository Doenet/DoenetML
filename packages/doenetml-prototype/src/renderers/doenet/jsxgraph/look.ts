import { LAYER_OFFSETS } from "../graph";

/**
 * The one look every graph element is drawn in. Doenet's styles
 * (`styleNumber`, palettes, `layer`) are not ported yet; see ADR 0020 in
 * `packages/cells-core`.
 *
 * Each is a function: JSXGraph writes into the attributes it is given (a
 * segment sets its straightness on them), so every element gets its own.
 */
const LINE_COLOR = "var(--mainGreen)";
const POINT_COLOR = "var(--mainPurple)";

function stroke(color: string) {
    return {
        strokeColor: color,
        strokeOpacity: 1,
        highlightStrokeColor: color,
        highlightStrokeOpacity: 0.5,
        strokeWidth: 2,
        highlightStrokeWidth: 2,
        dash: 0,
    };
}

export const look = {
    /** A line, a segment, a circle, a curve. */
    line: () => ({
        name: "",
        ...stroke(LINE_COLOR),
        layer: LAYER_OFFSETS.line,
        fillOpacity: 0,
        highlightFillOpacity: 0,
    }),

    /** A polygon: its sides as a line, its area tinted. */
    polygon: () => ({
        name: "",
        layer: LAYER_OFFSETS.line,
        fillColor: LINE_COLOR,
        fillOpacity: 0.1,
        highlightFillColor: LINE_COLOR,
        highlightFillOpacity: 0.05,
        borders: look.line(),
        vertices: { visible: false },
    }),

    /** A point that defines a shape, drawn as a small handle. */
    vertex: () => ({
        name: "",
        withLabel: false,
        layer: LAYER_OFFSETS.vertex,
        size: 3,
        fillColor: LINE_COLOR,
        strokeColor: LINE_COLOR,
        highlightFillColor: LINE_COLOR,
        highlightStrokeColor: LINE_COLOR,
        showInfobox: false,
    }),

    /** A point a shape needs but does not show. */
    hiddenPoint: () => ({
        visible: false,
        withLabel: false,
        showInfobox: false,
    }),

    /** A point of its own. */
    point: () => ({
        name: "test",
        ...stroke(POINT_COLOR),
        layer: LAYER_OFFSETS.line,
    }),
};

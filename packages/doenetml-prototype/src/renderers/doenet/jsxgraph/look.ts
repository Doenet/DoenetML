import { LAYER_OFFSETS } from "../graph";

/**
 * The default look of the graph elements the cells core draws (ADR 0020 in
 * `packages/cells-core`). Doenet's styles (`styleNumber`, palettes) are not
 * ported yet; like the point renderer, every element is drawn in one style.
 */
export const LINE_COLOR = "var(--mainBlue)";

export const CURVE_ATTRIBUTES = {
    strokeColor: LINE_COLOR,
    highlightStrokeColor: LINE_COLOR,
    strokeWidth: 2,
    highlightStrokeWidth: 2,
    strokeOpacity: 0.7,
    highlightStrokeOpacity: 0.35,
    fillOpacity: 0,
    highlightFillOpacity: 0,
    layer: LAYER_OFFSETS.line,
    withLabel: false,
};

/** A point that defines a shape, drawn as a small handle. */
export const VERTEX_ATTRIBUTES = {
    name: "",
    withLabel: false,
    size: 3,
    fillColor: LINE_COLOR,
    strokeColor: LINE_COLOR,
    highlightFillColor: LINE_COLOR,
    highlightStrokeColor: LINE_COLOR,
    layer: LAYER_OFFSETS.vertex,
    showInfobox: false,
};

/** A point a shape needs but does not show. */
export const HIDDEN_POINT_ATTRIBUTES = {
    visible: false,
    withLabel: false,
    showInfobox: false,
};

// Generated from the cells core's component tables by
// `crates/cells-core/tests/view_shapes.rs`; do not edit.
// `SHAPES_UPDATE=1 cargo test --test view_shapes` rewrites it.

/** Each primitive's slots, in the order a shape binds them. */
export const PRIM_SLOTS = {
    number: ["value"],
    range: ["min", "max", "step", "value"],
    point: ["x", "y", "hide"],
    coords: ["x", "y", "hide"],
    circle: ["cx", "cy", "radius"],
    board: ["xmin", "ymax", "xmax", "ymin"],
    polygon: ["count", "vertices[]"],
    mathField: ["expr"],
    submit: [],
    credit: ["credit", "submissions"],
    heading: ["label", "number", "includeParentNumber"],
    contents: [],
} as const;

export type Prim = keyof typeof PRIM_SLOTS;

/** A slot's position for the component's list: every coordinate of
 * every point it has. */
export const LIST = 254;

/** A primitive and the position, in its component's props, of the
 * prop each of its slots binds, or `LIST`. */
export type PrimUse = { prim: Prim; at: readonly number[] };
/** `tag`: the element that holds it in the page, when not a span
 * (or, for a block, a div). */
export type Shape = {
    name: string;
    nodes: readonly PrimUse[];
    tag?: string;
};

/** By component tag, the type's shapes: a component's shape column
 * indexes this list (255: none). */
export const SHAPES: Record<string, readonly Shape[]> = {
    graph: [
        {
            name: "graph",
            nodes: [
                { prim: "board", at: [0, 3, 1, 2] },
            ],
        },
    ],
    point: [
        {
            name: "point",
            nodes: [
                { prim: "point", at: [0, 1, 2] },
            ],
        },
        {
            name: "coords",
            nodes: [
                { prim: "coords", at: [0, 1, 2] },
            ],
        },
    ],
    number: [
        {
            name: "number",
            nodes: [
                { prim: "number", at: [0] },
            ],
        },
    ],
    slider: [
        {
            name: "slider",
            nodes: [
                { prim: "range", at: [0, 1, 2, 15] },
                { prim: "number", at: [15] },
            ],
        },
    ],
    mathInput: [
        {
            name: "mathInput",
            nodes: [
                { prim: "mathField", at: [1] },
            ],
        },
    ],
    circle: [
        {
            name: "circle",
            nodes: [
                { prim: "circle", at: [0, 1, 2] },
            ],
        },
    ],
    polygon: [
        {
            name: "polygon",
            nodes: [
                { prim: "polygon", at: [0, 254] },
            ],
        },
    ],
    answer: [
        {
            name: "answer",
            nodes: [
                { prim: "contents", at: [] },
                { prim: "submit", at: [] },
                { prim: "credit", at: [3, 5] },
            ],
        },
    ],
    section: [
        {
            name: "section",
            tag: "section",
            nodes: [
                { prim: "heading", at: [6, 4, 5] },
                { prim: "contents", at: [] },
            ],
        },
    ],
    title: [
        {
            name: "title",
            tag: "h2",
            nodes: [
                { prim: "contents", at: [] },
            ],
        },
    ],
};

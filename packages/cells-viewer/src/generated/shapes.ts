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
} as const;

export type Prim = keyof typeof PRIM_SLOTS;

/** A primitive and the position, in its component's props, of the
 * prop each of its slots binds. */
export type PrimUse = { prim: Prim; at: readonly number[] };
export type Shape = { name: string; nodes: readonly PrimUse[] };

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
    circle: [
        {
            name: "circle",
            nodes: [
                { prim: "circle", at: [0, 1, 2] },
            ],
        },
    ],
};

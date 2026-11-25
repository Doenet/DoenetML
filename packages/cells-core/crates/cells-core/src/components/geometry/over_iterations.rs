//! A `<polyline>` or `<polygon>` whose `vertices` name a structural
//! sequence of points (ADR 0075): a repeat whose iterations each hold one
//! point (`vertices="$r"`), or another such shape (`extend="$g1.pg"`, a
//! clone in a copied container). Outlining settles it once names resolve
//! (`settle_over_iterations`), and it is a repeat-like type (ADR 0041,
//! step 4): its count, `numVertices`, aliases the source's count, a
//! structural cell, and its item per iteration is a point aliasing the
//! point of that iteration of the source, so a drag of a vertex writes
//! the point it is. The machinery plans it (`plan_over_iterations`).

use crate::compile::api::*;
use crate::components::define::*;

/// A vertex, as the machinery wires it (`plan_over_iterations`), which
/// reaches the source this function is not given: never wired here.
fn vertex(_: &mut ItemCtx<'_>) -> crate::components::prop::point::Planned {
    crate::components::prop::point::Planned {
        x: Wire::absent(),
        y: Wire::absent(),
        hide: Wire::constant(1.0),
        // Unconstrained and draggable (ADR 0080, ADR 0070).
        constraintUsed: Wire::constant(0.0),
        draggable: Wire::constant(1.0),
    }
}

/// The table the two share: the count and the drag flags.
macro_rules! over_iterations {
    (
        $(#[$doc:meta])*
        $module:ident: $tag:literal
    ) => {
        pub(crate) mod $module {
            use super::*;

            component! {
                $(#[$doc])*
                tags: [$tag],
                flags: [internal, copyable, located],
                renders: InGraph,
                structure: Repeat { count: numVertices },
                // A point per iteration, aliasing the source's; the
                // machinery wires it.
                item: Point(vertex),
                props {
                    // How many vertices: the source's count.
                    numVertices: by_planner { rendered },
                    // Whether a whole drag, and a vertex's, may move it
                    // (ADR 0070): the source's, where it has them.
                    draggable: by_planner { rendered },
                    verticesDraggable: by_planner { rendered },
                }
                children: None,
                machinery: OverIterations,
            }

            /// The position of `numVertices`.
            pub(crate) const NUM_VERTICES: usize = Props::AT.numVertices;
            /// The position of `draggable`.
            pub(crate) const DRAGGABLE: usize = Props::AT.draggable;
            /// The position of `verticesDraggable`.
            pub(crate) const VERTICES_DRAGGABLE: usize = Props::AT.verticesDraggable;
        }
    };
}

over_iterations! {
    /// A `<polyline>` through the points of a repeat's iterations.
    polyline: "polyline"
}

over_iterations! {
    /// A `<polygon>` through the points of a repeat's iterations.
    polygon: "polygon"
}

// The two are planned alike, by position.
const _: () = assert!(
    polyline::NUM_VERTICES == polygon::NUM_VERTICES
        && polyline::DRAGGABLE == polygon::DRAGGABLE
        && polyline::VERTICES_DRAGGABLE == polygon::VERTICES_DRAGGABLE,
    "the two shapes over iterations share a table"
);

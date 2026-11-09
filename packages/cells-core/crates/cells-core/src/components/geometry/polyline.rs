//! `<polyline>`: its definition and its planner.

use crate::components::define::*;

component! {
    /// `<polyline vertices="$r">`: its children are copies of the points
    /// `vertices` names (a repeat's points, gathered as a `<collect>` does), so
    /// its length follows the repeat. `numVertices` counts them. Only drawn:
    /// dragging a polyline is not supported.
    tags: ["polyline"],
    flags: [copyable, located],
    renders: InGraph,
    settle: Collects(Point, vertices),
    props {
        numVertices: aggregate(Count, Gathered),
    }
    machinery: Collect,
}

/// The position of `numVertices`: how many points the polyline collects.
pub const NUM_VERTICES: usize = Props::AT.numVertices;

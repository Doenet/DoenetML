//! `<polyline>`: its definition and its planner.

use crate::components::ComponentType;
use crate::components::define::*;

component! {
    /// `<polyline vertices="$r">`: its children are copies of the points
    /// `vertices` names (a repeat's points, gathered as a `<collect>` does), so
    /// its length follows the repeat. `numVertices` counts them. Only drawn:
    /// dragging a polyline is not supported.
    tags: ["polyline"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        numVertices: aggregate(Count, Gathered),
    }
    machinery: Collect,
}

pub const NUM_VERTICES: usize = Props::AT.numVertices;

/// What a `<polyline>` collects.
pub(crate) const COLLECTED: ComponentType = ComponentType::Point;

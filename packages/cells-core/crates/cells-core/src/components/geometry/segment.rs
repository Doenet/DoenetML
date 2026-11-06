//! `<lineSegment>`: its definition and its planner. Its two endpoints are
//! its own state, or the points `endpoints` names; a missing endpoint is
//! essential state at its default.

use super::{DEFAULT_FIRST_POINT, DEFAULT_SECOND_POINT};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::tick::snap::Shape;

component! {
    /// `<lineSegment endpoints="$a $b">`.
    tags: ["lineSegment"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        x1: by_planner { rendered },
        y1: by_planner { rendered },
        x2: by_planner { rendered },
        y2: by_planner { rendered },
    }
    list {
        names: [points, endpoints],
        item: point,
        points: [[x1, y1], [x2, y2]],
        // An endpoint drag requests one, a whole-segment drag both.
        interactive: true,
    }
    sticky: Shape::Open,
    // A point constrained to a segment is projected onto its line (as
    // the current core's segment is not yet clamped here).
    constrain_target { ports: [x1, y1, x2, y2], op: ProjectLine }
    attributes {
        endpoints: Points,
    }
    params {
        // A missing endpoint's coordinates.
        ESS1X, ESS1Y, ESS2X, ESS2Y,
    }
    children: None,
    planner: Plan(plan),
}

/// The position of `x1`: the first endpoint's x-coordinate.
pub const X1: usize = Props::AT.x1;
/// The position of `y1`: the first endpoint's y-coordinate.
pub const Y1: usize = Props::AT.y1;
/// The position of `x2`: the second endpoint's x-coordinate.
pub const X2: usize = Props::AT.x2;
/// The position of `y2`: the second endpoint's y-coordinate.
pub const Y2: usize = Props::AT.y2;
// Read as (x, y) pairs by a sticky group, like a point's.
const _: () = assert!(
    Y1 == X1 + 1 && X2 == X1 + 2 && Y2 == X1 + 3,
    "a segment's endpoints must be x1 y1 x2 y2"
);

/// Plans a segment from its `endpoints`: the first two points it names,
/// each defaulted when missing.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ends = Attrs::of(ctx.record()).endpoints;
    let first = ([param::ESS1X, param::ESS1Y], DEFAULT_FIRST_POINT);
    let second = ([param::ESS2X, param::ESS2Y], DEFAULT_SECOND_POINT);
    let [x1, y1] = Wire::point_or_default(ends.first(), attr::endpoints, 0, first);
    let [x2, y2] = Wire::point_or_default(ends.get(1), attr::endpoints, 1, second);
    let mut wiring = ElemWiring::of(ComponentType::LineSegment);
    wiring.set_public(Props { x1, y1, x2, y2 });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "segment.spec.rs"]
mod spec;

//! `<lineSegment>`: its definition and its planner (ADR 0016). Its two
//! endpoints are its own state, or the points `endpoints` names; a
//! missing endpoint is essential state at the current core's default.

use super::{DEFAULT_FIRST_POINT, DEFAULT_SECOND_POINT};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::Result;
use crate::tick::snap::Shape;

component! {
    /// `<lineSegment endpoints="$a $b">`.
    tags: ["lineSegment"],
    flags: [copyable],
    props {
        x1: by_planner,
        y1: by_planner,
        x2: by_planner,
        y2: by_planner,
    }
    list {
        names: [points, endpoints],
        item: point,
        points: [[x1, y1], [x2, y2]],
    }
    sticky_points: (Shape::Open, X1, 2),
    shared_state {
        // A missing endpoint's coordinates.
        ESS1X, ESS1Y, ESS2X, ESS2Y,
    }
    planner: Geometric(plan),
}

pub const X1: usize = Props::AT.x1;
pub const Y1: usize = Props::AT.y1;
pub const X2: usize = Props::AT.x2;
pub const Y2: usize = Props::AT.y2;
// Read as (x, y) pairs by a sticky group, like a point's.
const _: () = assert!(
    Y1 == X1 + 1 && X2 == X1 + 2 && Y2 == X1 + 3,
    "a segment's endpoints must be x1 y1 x2 y2"
);

/// Plans a segment from its `endpoints`: the first two points it names,
/// each defaulted when missing.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ends = ctx.points("endpoints")?;
    let first = (
        [shared_state::ESS1X, shared_state::ESS1Y],
        DEFAULT_FIRST_POINT,
    );
    let second = (
        [shared_state::ESS2X, shared_state::ESS2Y],
        DEFAULT_SECOND_POINT,
    );
    let [x1, y1] = Wire::point_or_default(ends.first(), shared_point_state(0), "endpoints", first);
    let [x2, y2] = Wire::point_or_default(ends.get(1), shared_point_state(1), "endpoints", second);
    let mut wiring = ElemWiring::of(ComponentType::LineSegment);
    wiring.set_public(Props { x1, y1, x2, y2 });
    Ok(wiring)
}

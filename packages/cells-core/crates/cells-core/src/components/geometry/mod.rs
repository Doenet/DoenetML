//! Point, circle, line, line segment, polygon, polyline and point list.
//! Each type with a planner is in its own file, its definition and its
//! planner together (ADR 0016). This file holds what the family's members
//! share: the defaults of a line's and a segment's two points, the
//! limits on a polygon's vertices, and the point list, which only ever
//! exists as `extend="$shape.points"`.

use super::define::*;
use crate::compile::api::PlanCtx;
use crate::error::{Error, Result};

pub mod circle;
pub mod line;
pub mod point;
pub mod polygon;
pub mod polyline;
pub mod segment;

/// Largest polygon the fixed prop layout holds.
pub use crate::limits::{MAX_RIGID_VERTICES, MAX_VERTICES};

/// A line's or segment's default points, as the current core takes them:
/// a missing first point is (1, 0) and a missing second one (0, 0); a
/// direction-based line's first point is the latter. Each type gives
/// them its own shared state.
pub(crate) const DEFAULT_FIRST_POINT: [f64; 2] = [1.0, 0.0];
pub(crate) const DEFAULT_SECOND_POINT: [f64; 2] = [0.0, 0.0];

pub mod point_list {
    use super::*;

    component! {
        /// `<pointList extend="$l.points">`: its children are points aliasing
        /// the items of a list prop.
        tags: ["pointList"],
        planner: Whole(plan),
    }

    /// A `<pointList>` only exists as `extend="$shape.points"`, which the
    /// compile takes before asking for a planner.
    pub(crate) fn plan(_: &mut PlanCtx<'_, '_>) -> Result<()> {
        Err(Error::BadValue {
            attr: "extend".into(),
            text: "<pointList> needs extend=\"$shape.points\"".into(),
        })
    }
}

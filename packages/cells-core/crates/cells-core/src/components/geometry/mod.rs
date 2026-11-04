//! Point, circle, line, line segment, polygon, triangle, polyline and point list.
//! Each type with a planner is in its own file, its definition and its
//! planner together (ADR 0016). This file holds what the family's members
//! share: the defaults of a line's and a segment's two points, the
//! limits on a polygon's vertices, and the point list, which only ever
//! exists as `extend="$shape.points"`.

use super::define::*;

pub mod circle;
pub mod line;
pub mod point;
pub mod polygon;
pub mod polyline;
pub mod segment;
pub mod triangle;

/// The most vertices of a polygon, and of a rigid one.
pub use crate::limits::{MAX_RIGID_VERTICES, MAX_VERTICES};

/// A line's or segment's default points, as the current core takes them:
/// a missing first point is (1, 0) and a missing second one (0, 0); a
/// direction-based line's first point is the latter. Each type gives
/// them its own shared state.
pub(crate) const DEFAULT_FIRST_POINT: [f64; 2] = [1.0, 0.0];
pub(crate) const DEFAULT_SECOND_POINT: [f64; 2] = [0.0, 0.0];

pub mod constrain_to {
    use super::*;

    component! {
        /// `<constrainTo>$c</constrainTo>` among a point's constraints: the
        /// point is projected onto what the reference names. Only ever a
        /// member of a point's `constraints` group, read in the point's
        /// record (ADR 0034).
        tags: ["constrainTo"],
        flags: [owned],
        children: Value,
        owner: Point,
    }
}

pub mod constrain_to_grid {
    use super::*;

    component! {
        /// `<constrainToGrid dx dy xoffset yoffset>` among a point's
        /// constraints: the point snaps to the grid. Only ever a member of a
        /// point's `constraints` group, read in the point's record.
        tags: ["constrainToGrid"],
        flags: [owned],
        attributes {
            dx: Literal(1.0),
            dy: Literal(1.0),
            xoffset: Literal(0.0),
            yoffset: Literal(0.0),
        }
        owner: Point,
    }
}

pub mod point_list {
    use super::*;

    component! {
        /// `<pointList extend="$l.points">`: its children are points aliasing
        /// the items of a list prop.
        /// It only exists as `extend="$shape.points"`, which the compile
        /// takes before planning by type; one that does not is refused.
        tags: ["pointList"],
        flags: [owned],
    }
}

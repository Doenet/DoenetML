//! Point, circle, line, line segment, ray, vector, polygon, triangle,
//! rectangle, polyline and point list, and what is derived from them (a
//! best-fit line, an intersection, a parabola, an equilibrium point or
//! line, an endpoint), with what they share: the default
//! points of a line and a segment, a ray's and a vector's two points and
//! offset (`pair`), and the limits on a polygon's vertices.

use super::define::*;

pub(crate) mod angle;
pub mod circle;
pub mod line;
mod pair;
pub mod point;
pub(crate) mod point_list;
pub mod polygon;
pub mod polyline;
pub(crate) mod ray;
pub(crate) mod rectangle;
pub(crate) mod regular_polygon;
pub mod segment;
pub(crate) mod triangle;
pub(crate) mod vector;

pub(crate) mod best_fit_line;
pub(crate) mod curve;
pub(crate) mod endpoint;
pub(crate) mod equilibrium_curve;
pub(crate) mod equilibrium_line;
pub(crate) mod equilibrium_point;
pub(crate) mod intersection;
pub(crate) mod parabola;

/// The most vertices of a polygon, and of a rigid one.
pub use crate::limits::{MAX_RIGID_VERTICES, MAX_VERTICES};

/// A line's or segment's default points: a missing first point is (1, 0)
/// and a missing second one (0, 0); a direction-based line's first point
/// is the latter.
pub(crate) const DEFAULT_FIRST_POINT: [f64; 2] = [1.0, 0.0];
pub(crate) const DEFAULT_SECOND_POINT: [f64; 2] = [0.0, 0.0];

pub(crate) mod constrain_to {
    use super::*;

    component! {
        /// `<constrainTo>$c</constrainTo>` among a point's constraints: the
        /// point is projected onto what the reference names. Only ever a
        /// member of a point's `constraints` group.
        tags: ["constrainTo"],
        flags: [owned],
        children: Value,
        owner: Point,
    }
}

pub(crate) mod constrain_to_grid {
    use super::*;

    component! {
        /// `<constrainToGrid dx dy xoffset yoffset>` among a point's
        /// constraints: the point snaps to the grid. Only ever a member of a
        /// point's `constraints` group.
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

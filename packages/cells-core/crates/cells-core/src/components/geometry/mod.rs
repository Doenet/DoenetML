//! Point, circle, line, line segment, ray, vector, polygon, triangle,
//! rectangle, polyline and point list, and what is derived from them (a
//! best-fit line, an intersection, a parabola, an equilibrium point or
//! line, an endpoint), with what they share: the default
//! points of a line and a segment, a ray's and a vector's two points and
//! offset (`pair`), and the limits on a polygon's vertices.

use super::define::*;

pub(crate) mod angle;
pub mod circle;
mod drag;
pub mod line;
mod pair;
pub mod point;
pub(crate) mod point_list;
pub(crate) mod point_list_entry;
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
pub(crate) mod over_iterations;
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
        /// point is projected onto what the reference names, or onto the
        /// nearest of several (`<constrainTo>$l1 $l2</constrainTo>`). Only
        /// ever a member of a point's `constraints` group (ADR 0080).
        tags: ["constrainTo"],
        flags: [owned],
        attributes {
            relativeToGraphScales: Bool(false),
        }
        children: Value,
        owner: Point,
    }
}

pub(crate) mod attract_to {
    use super::*;

    component! {
        /// `<attractTo threshold="0.5">$c</attractTo>` among a point's
        /// constraints: the point is projected onto what the reference
        /// names (the nearest of several) when it is within `threshold` of
        /// it, else left where it is. Only ever a member of a point's
        /// `constraints` group (ADR 0080).
        tags: ["attractTo"],
        flags: [owned],
        attributes {
            threshold: Scalar,
            relativeToGraphScales: Bool(false),
        }
        children: Value,
        owner: Point,
    }
}

pub(crate) mod constrain_to_grid {
    use super::*;

    component! {
        /// `<constrainToGrid dx dy xoffset yoffset>` among a point's
        /// constraints: the point snaps to the grid. Only ever a member of a
        /// point's `constraints` group (ADR 0080).
        tags: ["constrainToGrid"],
        flags: [owned],
        attributes {
            dx: Scalar,
            dy: Scalar,
            xoffset: Scalar,
            yoffset: Scalar,
        }
        owner: Point,
    }
}

pub(crate) mod attract_to_grid {
    use super::*;

    component! {
        /// `<attractToGrid dx dy xoffset yoffset xThreshold yThreshold
        /// includeGridlines>` among a point's constraints: the point snaps
        /// to a grid point when both coordinates are within their
        /// thresholds of it, or each coordinate to a grid line with
        /// `includeGridlines`. Only ever a member of a point's
        /// `constraints` group (ADR 0080).
        tags: ["attractToGrid"],
        flags: [owned],
        attributes {
            dx: Scalar,
            dy: Scalar,
            xoffset: Scalar,
            yoffset: Scalar,
            xthreshold: Scalar,
            ythreshold: Scalar,
            includeGridlines: Flag(false),
        }
        owner: Point,
    }
}

pub(crate) mod constrain_to_graph {
    use super::*;

    component! {
        /// `<constrainToGraph buffer="0.01"/>` among a point's constraints:
        /// the point is held inside the graph it is in, `buffer` of the
        /// graph's width and height in from its edges. Only ever a member
        /// of a point's `constraints` group (ADR 0080).
        tags: ["constrainToGraph"],
        flags: [owned],
        attributes {
            buffer: Scalar,
        }
        owner: Point,
    }
}

pub(crate) mod constrain_to_interior {
    use super::*;

    component! {
        /// `<constrainToInterior>$c</constrainToInterior>` among a point's
        /// constraints: the point stays where it is inside what the
        /// reference names (a circle, a polygon), and is moved onto its
        /// edge from outside. Only ever a member of a point's
        /// `constraints` group (ADR 0080).
        tags: ["constrainToInterior"],
        flags: [owned],
        attributes {
            relativeToGraphScales: Bool(false),
        }
        children: Value,
        owner: Point,
    }
}

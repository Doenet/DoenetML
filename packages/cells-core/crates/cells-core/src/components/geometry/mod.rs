//! Point, circle, line, line segment, polygon and point list. All but the
//! point list have a geometric planner (`compile/planner.rs`) that
//! chooses each prop's source from the attributes the author gave. The
//! circle, the line and the line segment are each in their own file,
//! definition and planner together (ADR 0016); the others' planners are in
//! `compile/geometry/`.

use super::define::*;
use super::{ArrayProp, ComponentTypeInfo, ListProp, PropDef};
use crate::tick::snap::Shape;

pub mod circle;
pub mod line;
pub mod segment;

/// Largest polygon the fixed prop layout holds.
pub use crate::limits::{MAX_RIGID_VERTICES, MAX_VERTICES};

/// `<point>`. `coords` is a view over `x` and `y`.
pub(super) const POINT: ComponentTypeInfo = info(&["point"], POINT_PROPS)
    .copyable()
    .default_prop("coords")
    .views(&[("coords", &["x", "y"])])
    .sticky(Shape::Point, point::X, 1);

// `hide` is a boolean in the current core; here it is a 0/1 cell.
const POINT_PROPS: &[PropDef] = &props([planned("x"), planned("y"), planned("hide")]);

pub mod point {
    use super::*;
    pub const X: usize = at(POINT_PROPS, "x");
    pub const Y: usize = at(POINT_PROPS, "y");
    pub const HIDE: usize = at(POINT_PROPS, "hide");
    // A sticky group reads a member's points as (x, y) pairs from the
    // position its layout names (`sticky`, `document/sticky.rs`).
    const _: () = assert!(Y == X + 1, "a point's y must follow its x");
}

/// The two points of a line or line segment.
const LINE_POINTS: &[ArrayProp] = &[ArrayProp {
    names: &["points", "endpoints"],
    item: "point",
    items: &[["x1", "y1"], ["x2", "y2"]],
}];

/// A line's or segment's default points, as the current core takes them:
/// a missing first point is (1, 0) and a missing second one (0, 0); a
/// direction-based line's first point is the latter. Each type gives
/// them its own roles.
pub(crate) const DEFAULT_FIRST_POINT: [f64; 2] = [1.0, 0.0];
pub(crate) const DEFAULT_SECOND_POINT: [f64; 2] = [0.0, 0.0];

/// `<polygon vertices="...">`, optionally rigid: its vertices are its
/// list (ADR 0016), up to `MAX_VERTICES`, or `MAX_RIGID_VERTICES` when
/// rigid.
pub(super) const POLYGON: ComponentTypeInfo = info(&["polygon", "triangle"], POLYGON_PROPS)
    .copyable()
    .list(ListProp {
        names: &["vertices"],
        item: "vertex",
        coords: ["x", "y"],
        alias: Some("vertexX"),
    })
    .sticky_list(Shape::Closed);

/// `numVertices`; the vertices follow, as the list.
const POLYGON_PROPS: &[PropDef] = &props([planned("numVertices")]);

pub mod polygon {
    use super::*;
    pub const NUM_VERTICES: usize = at(POLYGON_PROPS, "numVertices");
}

/// `<pointList extend="$l.points">`: its children are points aliasing the
/// items of an array prop.
pub(super) const POINT_LIST: ComponentTypeInfo = info(&["pointList"], &[]);

/// `<polyline vertices="$r">`: its children are copies of the points
/// `vertices` names (a repeat's points, gathered as a `<collect>` does),
/// so its length follows the repeat. `numVertices` counts them. Only
/// drawn: dragging a polyline is not supported.
pub(super) const POLYLINE: ComponentTypeInfo = info(&["polyline"], POLYLINE_PROPS).copyable();

const POLYLINE_PROPS: &[PropDef] = &props([planned("numVertices")]);

pub mod polyline {
    use super::*;
    pub const NUM_VERTICES: usize = at(POLYLINE_PROPS, "numVertices");
}

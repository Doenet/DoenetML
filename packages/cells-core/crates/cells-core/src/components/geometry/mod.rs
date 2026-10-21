//! Point, circle, line, line segment, polygon and point list. All but the
//! point list have a geometric planner (`compile/planner.rs`) that
//! chooses each prop's source from the attributes the author gave. The
//! circle and the line segment are each in their own file, definition
//! and planner together (ADR 0016); the others' planners are in
//! `compile/geometry/`.

use super::define::*;
use super::{ArrayProp, ComponentTypeInfo, ListProp, PropDef};
use crate::compile::api::{DefaultPoint, roles};
use crate::tick::snap::Shape;

pub mod circle;
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
/// direction-based line's first point is the latter.
pub(crate) const ESS1: DefaultPoint = (roles::ESS1, [1.0, 0.0]);
pub(crate) const ESS2: DefaultPoint = (roles::ESS2, [0.0, 0.0]);

/// `<line>`: its own two points are derived cells (ADR 0006); slope,
/// intercepts and coefficients follow from them or from the equation.
pub(super) const LINE: ComponentTypeInfo =
    info(&["line"], LINE_PROPS).copyable().arrays(LINE_POINTS);

/// The first four props are the line's own points (ADR 0006).
/// `basedOnDirection` is 1 when the second point is derived from a slope or
/// direction, so a renderer drags only the first.
const LINE_PROPS: &[PropDef] = &props([
    planned("x1"),
    planned("y1"),
    planned("x2"),
    planned("y2"),
    planned("slope"),
    planned("xintercept"),
    planned("yintercept"),
    planned("coeffvar1"),
    planned("coeffvar2"),
    planned("coeff0"),
    planned("basedOnDirection"),
]);

pub mod line {
    use super::*;
    pub const X1: usize = at(LINE_PROPS, "x1");
    pub const Y1: usize = at(LINE_PROPS, "y1");
    pub const X2: usize = at(LINE_PROPS, "x2");
    pub const Y2: usize = at(LINE_PROPS, "y2");
    pub const SLOPE: usize = at(LINE_PROPS, "slope");
    pub const XINTERCEPT: usize = at(LINE_PROPS, "xintercept");
    pub const YINTERCEPT: usize = at(LINE_PROPS, "yintercept");
    pub const COEFFVAR1: usize = at(LINE_PROPS, "coeffvar1");
    pub const COEFFVAR2: usize = at(LINE_PROPS, "coeffvar2");
    pub const COEFF0: usize = at(LINE_PROPS, "coeff0");
    pub const BASED_ON_DIRECTION: usize = at(LINE_PROPS, "basedOnDirection");
}

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

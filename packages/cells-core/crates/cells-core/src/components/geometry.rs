//! Point, circle, line, line segment, polygon and point list. All but the
//! point list have a geometric planner (`build/compile/planner.rs`) that
//! chooses each prop's source from the attributes the author gave
//! (`build/compile/geometry/`).

use super::define::*;
use super::{ArrayProp, ComponentTypeInfo, PropDef};
use crate::tick::snap::Shape;

/// Largest polygon the fixed prop layout holds.
pub const MAX_VERTICES: usize = 16;

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
}

/// `<circle>`: center and radius are derived or essential depending on
/// how the circle is specified (ADR 0006). `cx`, `cy`, `radius` are the
/// numerical center and radius; how they are produced depends on which of
/// `center`, `radius` and `through` the author gave (see `plan_circle` in
/// `build/compile/geometry/circle.rs`).
pub(super) const CIRCLE: ComponentTypeInfo = info(&["circle"], CIRCLE_PROPS)
    .copyable()
    .views(&[
        ("center", &["centerX", "centerY"]),
        ("numericalCenter", &["cx", "cy"]),
    ])
    .arrays(&[ArrayProp {
        names: &["throughPoints"],
        item: "throughPoint",
        items: &[
            ["throughX1", "throughY1"],
            ["throughX2", "throughY2"],
            ["throughX3", "throughY3"],
        ],
    }])
    .aliases(&[
        ("centerX1", "centerX"),
        ("centerX2", "centerY"),
        ("throughPointX1_1", "throughX1"),
        ("throughPointX1_2", "throughY1"),
        ("throughPointX2_1", "throughX2"),
        ("throughPointX2_2", "throughY2"),
        ("throughPointX3_1", "throughX3"),
        ("throughPointX3_2", "throughY3"),
    ]);

const CIRCLE_PROPS: &[PropDef] = &props([
    planned("cx"),
    planned("cy"),
    planned("radius"),
    computed("diameter", OpSpec::Scale { k: 2.0 }, &["radius"]),
    computed(
        "circumference",
        OpSpec::Scale {
            k: std::f64::consts::TAU,
        },
        &["radius"],
    ),
    planned("area"),
    // The center as a *reference*: the prescribed center when there is one
    // (so a point extending `$c.center` drags that point alone, as in the
    // current core), else the derived center.
    planned("centerX"),
    planned("centerY"),
    planned("throughX1"),
    planned("throughY1"),
    planned("throughX2"),
    planned("throughY2"),
    planned("throughX3"),
    planned("throughY3"),
    planned("numThroughPoints"),
]);

pub mod circle {
    use super::*;
    pub const CX: usize = at(CIRCLE_PROPS, "cx");
    pub const CY: usize = at(CIRCLE_PROPS, "cy");
    pub const RADIUS: usize = at(CIRCLE_PROPS, "radius");
    pub const AREA: usize = at(CIRCLE_PROPS, "area");
    pub const CENTER_X: usize = at(CIRCLE_PROPS, "centerX");
    pub const CENTER_Y: usize = at(CIRCLE_PROPS, "centerY");
    /// The first of three through points' (x, y) pairs.
    pub const THROUGH_X1: usize = at(CIRCLE_PROPS, "throughX1");
    pub const NUM_THROUGH_POINTS: usize = at(CIRCLE_PROPS, "numThroughPoints");
}

/// The two points of a line or line segment.
const LINE_POINTS: &[ArrayProp] = &[ArrayProp {
    names: &["points", "endpoints"],
    item: "point",
    items: &[["x1", "y1"], ["x2", "y2"]],
}];

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

/// `<lineSegment endpoints="$a $b">`.
pub(super) const LINE_SEGMENT: ComponentTypeInfo = info(&["lineSegment"], LINE_SEGMENT_PROPS)
    .copyable()
    .arrays(LINE_POINTS)
    .sticky(Shape::Open, segment::X1, 2);

const LINE_SEGMENT_PROPS: &[PropDef] =
    &props([planned("x1"), planned("y1"), planned("x2"), planned("y2")]);

pub mod segment {
    use super::*;
    pub const X1: usize = at(LINE_SEGMENT_PROPS, "x1");
    pub const Y1: usize = at(LINE_SEGMENT_PROPS, "y1");
    pub const X2: usize = at(LINE_SEGMENT_PROPS, "x2");
    pub const Y2: usize = at(LINE_SEGMENT_PROPS, "y2");
}

/// `<polygon vertices="...">`, optionally rigid. Up to `MAX_VERTICES`.
pub(super) const POLYGON: ComponentTypeInfo = info(&["polygon", "triangle"], POLYGON_PROPS)
    .copyable()
    .arrays(&[ArrayProp {
        names: &["vertices"],
        item: "vertex",
        items: &VERTEX_PARTS,
    }])
    .sticky(Shape::Closed, polygon::X1, MAX_VERTICES);

/// `vertexN` of a polygon, as prop name pairs.
const VERTEX_PARTS: [[&str; 2]; MAX_VERTICES] = [
    ["x1", "y1"],
    ["x2", "y2"],
    ["x3", "y3"],
    ["x4", "y4"],
    ["x5", "y5"],
    ["x6", "y6"],
    ["x7", "y7"],
    ["x8", "y8"],
    ["x9", "y9"],
    ["x10", "y10"],
    ["x11", "y11"],
    ["x12", "y12"],
    ["x13", "y13"],
    ["x14", "y14"],
    ["x15", "y15"],
    ["x16", "y16"],
];

/// `numVertices` then `MAX_VERTICES` coordinate pairs (`x1`, `y1`, ...);
/// unused pairs hold the shared NaN.
const POLYGON_PROPS: &[PropDef] = &props({
    let mut out = [planned(""); 1 + 2 * MAX_VERTICES];
    out[0] = planned("numVertices");
    let mut i = 0;
    while i < MAX_VERTICES {
        out[1 + 2 * i] = planned(VERTEX_PARTS[i][0]);
        out[2 + 2 * i] = planned(VERTEX_PARTS[i][1]);
        i += 1;
    }
    out
});

pub mod polygon {
    use super::*;
    pub const NUM_VERTICES: usize = at(POLYGON_PROPS, "numVertices");
    /// The first vertex's x; vertex k's (x, y) are at `X1 + 2k`, `X1 + 2k + 1`.
    pub const X1: usize = at(POLYGON_PROPS, "x1");
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

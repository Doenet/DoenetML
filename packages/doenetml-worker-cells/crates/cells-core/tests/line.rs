//! `<line>` in its modes (two points, slope, direction, equation),
//! with point lists and constrained points.

mod common;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use cells_core::{PointRequest, Request};
use common::*;

#[test]
fn line_through_two_points_and_its_point_list() {
    let mut doc = load(r#"<graph name="g"><point name="a">(1,2)</point><point name="b">(4,7)</point><line name="l" through="$a $b"/><pointList extend="$l.points" name="Ps"/></graph>"#).unwrap();
    assert_close!(v(&doc, "l", "slope"), 5.0 / 3.0);
    assert_close!(v(&doc, "l", "yintercept"), 2.0 - 5.0 / 3.0);
    assert_close!(v(&doc, "l", "xintercept"), 1.0 - 2.0 * 3.0 / 5.0);
    // Dragging one of the line's own points moves that defining point only.
    let ps2 = doc.resolve_path("g.Ps[2]").unwrap();
    let cells = doc.prop_cells(ps2, "coords").unwrap();
    doc.request(&[
        Request {
            cell: cells[0],
            value: 0.0,
        },
        Request {
            cell: cells[1],
            value: 0.0,
        },
    ]);
    assert_eq!((v(&doc, "b", "x"), v(&doc, "b", "y")), (0.0, 0.0));
    assert_eq!((v(&doc, "a", "x"), v(&doc, "a", "y")), (1.0, 2.0));
    // moveLine: both points requested together, both move.
    move_points(
        &mut doc,
        "l",
        &[("x1", "y1"), ("x2", "y2")],
        &[(5.0, 5.0), (7.0, 9.0)],
    );
    assert_eq!((v(&doc, "a", "x"), v(&doc, "b", "y")), (5.0, 9.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn line_through_point_with_slope() {
    let mut doc = load(r#"<mathInput name="m" prefill="1"/><graph><point name="a">(1,2)</point><line name="l" through="$a" slope="$m"/></graph>"#).unwrap();
    let s = 1.0 / 2f64.sqrt();
    assert_close!(v(&doc, "l", "x2"), 1.0 + s);
    assert_close!(v(&doc, "l", "y2"), 2.0 + s);
    assert_eq!(v(&doc, "l", "basedOnDirection"), 1.0);
    // Dragging the second point rewrites the slope and the distance.
    doc.request(&[req(&doc, "l", "x2", 1.0), req(&doc, "l", "y2", 7.0)]);
    assert_eq!(v(&doc, "m", "value"), f64::INFINITY);
    assert_eq!(v(&doc, "l", "x2"), 1.0);
    assert_close!(v(&doc, "l", "y2"), 7.0);
    doc.request(&[req(&doc, "l", "x2", -4.0), req(&doc, "l", "y2", 2.0)]);
    assert_close!(v(&doc, "m", "value"), 0.0);
    assert_close!(v(&doc, "l", "x2"), -4.0);
    // Changing the slope keeps the distance and the sign of dx.
    doc.request(&[req(&doc, "m", "value", 1.0)]);
    let (dx, dy) = (v(&doc, "l", "x2") - 1.0, v(&doc, "l", "y2") - 2.0);
    assert_close!(dx.hypot(dy), 5.0);
    assert!(dx < 0.0);
    assert_close!(dy / dx, 1.0);
    // Moving the first point translates the line.
    move_point(&mut doc, "a", 3.0, 3.0);
    assert_close!(v(&doc, "l", "x2") - 3.0, dx);
    assert_close!(v(&doc, "l", "y2") - 3.0, dy);
}

#[test]
fn line_from_equation_lowers_to_coefficient_cells() {
    let mut doc = load(r#"<graph><line name="l">5x-2y=3</line></graph>"#).unwrap();
    assert_eq!(
        (
            v(&doc, "l", "coeffvar1"),
            v(&doc, "l", "coeffvar2"),
            v(&doc, "l", "coeff0")
        ),
        (5.0, -2.0, -3.0)
    );
    assert_close!(v(&doc, "l", "slope"), 2.5);
    assert_close!(v(&doc, "l", "xintercept"), 0.6);
    assert_close!(v(&doc, "l", "yintercept"), -1.5);
    let (x1, y1, x2, y2) = (
        v(&doc, "l", "x1"),
        v(&doc, "l", "y1"),
        v(&doc, "l", "x2"),
        v(&doc, "l", "y2"),
    );
    assert_close!(5.0 * x1 - 2.0 * y1, 3.0);
    assert_close!(5.0 * x2 - 2.0 * y2, 3.0);
    // Translating the line keeps a and b and moves c.
    doc.request(&[
        req(&doc, "l", "x1", x1 + 1.0),
        req(&doc, "l", "y1", y1 + 2.0),
        req(&doc, "l", "x2", x2 + 1.0),
        req(&doc, "l", "y2", y2 + 2.0),
    ]);
    assert_eq!(
        (v(&doc, "l", "coeffvar1"), v(&doc, "l", "coeffvar2")),
        (5.0, -2.0)
    );
    assert_close!(v(&doc, "l", "coeff0"), -3.0 - (5.0 * 1.0 - 2.0 * 2.0));
}

#[test]
fn line_from_dynamic_equation_inverts_into_the_inputs() {
    let mut doc = load(r#"<mathInput name="m" prefill="2"/><mathInput name="b" prefill="1"/><graph><line name="l">y = $m x + $b</line></graph>"#).unwrap();
    assert_close!(v(&doc, "l", "slope"), 2.0);
    assert_close!(v(&doc, "l", "yintercept"), 1.0);
    let (x1, y1, x2, y2) = (
        v(&doc, "l", "x1"),
        v(&doc, "l", "y1"),
        v(&doc, "l", "x2"),
        v(&doc, "l", "y2"),
    );
    doc.request(&[
        req(&doc, "l", "x1", x1),
        req(&doc, "l", "y1", y1 + 3.0),
        req(&doc, "l", "x2", x2),
        req(&doc, "l", "y2", y2 + 3.0),
    ]);
    assert_close!(v(&doc, "b", "value"), 4.0);
    assert_close!(v(&doc, "m", "value"), 2.0);
}

#[test]
fn line_through_two_points_one_constrained_translates_as_a_whole() {
    let mut doc = load(
        r#"<graph>
             <point name="a">(0,0)<constraints><constrainToGrid dx="2" dy="3"/></constraints></point>
             <point name="b">(5,5)</point>
             <line name="l" through="$a $b"/>
           </graph>"#,
    )
    .unwrap();
    // Request a translation by (0.7, 1.4): a snaps to (0, 0)... no, to the
    // nearest grid point of (0.7, 1.4), which is (0, 0); b then stays.
    move_points(
        &mut doc,
        "l",
        &[("x1", "y1"), ("x2", "y2")],
        &[(0.7, 1.4), (5.7, 6.4)],
    );
    assert_eq!((v(&doc, "a", "x"), v(&doc, "a", "y")), (0.0, 0.0));
    assert_close!(v(&doc, "b", "x"), 5.0);
    assert_close!(v(&doc, "b", "y"), 5.0);
    // A translation by (1.2, 1.9): a snaps to (2, 3), b follows by (2, 3).
    move_points(
        &mut doc,
        "l",
        &[("x1", "y1"), ("x2", "y2")],
        &[(1.2, 1.9), (6.2, 6.9)],
    );
    assert_eq!((v(&doc, "a", "x"), v(&doc, "a", "y")), (2.0, 3.0));
    assert_close!(v(&doc, "b", "x"), 7.0);
    assert_close!(v(&doc, "b", "y"), 8.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_whole_line_drag_against_a_grid_keeps_the_line_parallel() {
    // Same scenario as above but through the public entry point a renderer
    // uses: the two points requested as one group.
    let mut doc = load(
        r#"<graph>
             <point name="a">(0,0)<constraints><constrainToGrid dx="2" dy="3"/></constraints></point>
             <point name="b">(5,5)</point>
             <line name="l" through="$a $b"/>
           </graph>"#,
    )
    .unwrap();
    let pts = [
        PointRequest {
            cells: [doc.cell("a", "x").unwrap(), doc.cell("a", "y").unwrap()],
            values: [1.2, 1.9],
        },
        PointRequest {
            cells: [doc.cell("b", "x").unwrap(), doc.cell("b", "y").unwrap()],
            values: [6.2, 6.9],
        },
    ];
    doc.request_points(&pts);
    assert_eq!((v(&doc, "a", "x"), v(&doc, "a", "y")), (2.0, 3.0));
    assert_close!(v(&doc, "b", "x"), 7.0);
    assert_close!(v(&doc, "b", "y"), 8.0);
    // The same two requests as plain scalars move only what they name.
    doc.request(&[
        req(&doc, "a", "x", 3.1),
        req(&doc, "a", "y", 5.9),
        req(&doc, "b", "x", 8.1),
        req(&doc, "b", "y", 10.9),
    ]);
    assert_eq!((v(&doc, "a", "x"), v(&doc, "a", "y")), (4.0, 6.0));
    assert_close!(v(&doc, "b", "x"), 8.1);
}

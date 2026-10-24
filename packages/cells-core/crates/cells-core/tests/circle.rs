//! `<circle>` in its nine specifications, dragged as the current
//! core's tests drag it.

mod common;
use cells_core::Request;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

#[test]
fn circle_defaults_to_unit_circle_with_essential_center_and_radius() {
    let mut doc = load(r#"<graph><circle name="c"/></graph>"#).unwrap();
    assert_eq!(
        (
            v(&doc, "c", "cx"),
            v(&doc, "c", "cy"),
            v(&doc, "c", "radius")
        ),
        (0.0, 0.0, 1.0)
    );
    doc.request(&[req(&doc, "c", "cx", 2.0), req(&doc, "c", "cy", 3.0)]);
    assert_eq!((v(&doc, "c", "cx"), v(&doc, "c", "cy")), (2.0, 3.0));
    // A negative radius clamps to zero (projection, ADR 0003).
    doc.request(&[req(&doc, "c", "radius", -4.0)]);
    assert_eq!(v(&doc, "c", "radius"), 0.0);
    assert_eq!(v(&doc, "c", "diameter"), 0.0);
}

#[test]
fn circle_with_center_point_and_bound_radius() {
    let mut doc = load(
        r#"<mathInput name="r" prefill="3"/>
           <graph><point name="p">(-3,5)</point><circle name="c" center="$p" radius="$r"/></graph>
           <point name="cc" extend="$c.center"/>"#,
    )
    .unwrap();
    assert_eq!(
        (
            v(&doc, "c", "cx"),
            v(&doc, "c", "cy"),
            v(&doc, "c", "radius")
        ),
        (-3.0, 5.0, 3.0)
    );
    // Dragging the circle moves the defining point.
    doc.request(&[req(&doc, "c", "cx", 2.0), req(&doc, "c", "cy", 3.0)]);
    assert_eq!((v(&doc, "p", "x"), v(&doc, "p", "y")), (2.0, 3.0));
    // The radius request reaches the input; negative becomes zero there too.
    doc.request(&[req(&doc, "c", "radius", -4.0)]);
    assert_eq!(v(&doc, "r", "value"), 0.0);
    // A negative value typed into the input stays, the circle shows zero.
    doc.request(&[req(&doc, "r", "value", -3.0)]);
    assert_eq!(v(&doc, "r", "value"), -3.0);
    assert_eq!(v(&doc, "c", "radius"), 0.0);
    // Dragging the center copy moves the point.
    move_point(&mut doc, "cc", -6.0, -2.0);
    assert_eq!((v(&doc, "p", "x"), v(&doc, "p", "y")), (-6.0, -2.0));
}

#[test]
fn circle_center_and_through_point() {
    let mut doc = load(r#"<graph><point name="c">(0,0)</point><point name="p">(3,4)</point><circle name="circ" center="$c" through="$p"/></graph>"#).unwrap();
    assert_eq!(v(&doc, "circ", "radius"), 5.0);
    // Radius request moves the through point along its ray.
    doc.request(&[req(&doc, "circ", "radius", 10.0)]);
    assert_close!(v(&doc, "p", "x"), 6.0);
    assert_close!(v(&doc, "p", "y"), 8.0);
    // Center request translates both.
    doc.request(&[req(&doc, "circ", "cx", 1.0), req(&doc, "circ", "cy", 1.0)]);
    assert_close!(v(&doc, "c", "x"), 1.0);
    assert_close!(v(&doc, "p", "x"), 7.0);
    assert_close!(v(&doc, "p", "y"), 9.0);
    assert_close!(v(&doc, "circ", "radius"), 10.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn circle_through_three_points_drags_rigidly_and_scales_about_center() {
    let mut doc = load(
        r#"<graph>
             <point name="p1">(2,-3)</point><point name="p2">(3,4)</point><point name="p3">(-3,4)</point>
             <circle name="c" through="$p1 $p2 $p3"/>
           </graph>"#,
    )
    .unwrap();
    let (cx, cy, r) = (
        v(&doc, "c", "cx"),
        v(&doc, "c", "cy"),
        v(&doc, "c", "radius"),
    );
    for (x, y) in [(2.0, -3.0), (3.0, 4.0), (-3.0, 4.0)] {
        assert_close!((x - cx).hypot(y - cy), r);
    }
    doc.request(&[
        req(&doc, "c", "cx", cx + 3.0),
        req(&doc, "c", "cy", cy + 4.0),
    ]);
    assert_close!(v(&doc, "p1", "x"), 5.0);
    assert_close!(v(&doc, "p1", "y"), 1.0);
    assert_close!(v(&doc, "p3", "x"), 0.0);
    assert_close!(v(&doc, "c", "radius"), r);
    // Scaling the radius keeps every point on its ray from the center.
    doc.request(&[req(&doc, "c", "radius", 2.0 * r)]);
    assert_close!(v(&doc, "c", "radius"), 2.0 * r);
    assert_close!(v(&doc, "c", "cx"), cx + 3.0);
    assert_close!(v(&doc, "c", "cy"), cy + 4.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn circle_with_radius_and_two_points() {
    let mut doc = load(r#"<graph><point name="p1">(0,0)</point><point name="p2">(2,0)</point><circle name="c" radius="2" through="$p1 $p2"/></graph>"#).unwrap();
    // The current core's closed form puts the center on the left of p1 -> p2.
    assert_close!(v(&doc, "c", "cx"), 1.0);
    assert_close!(v(&doc, "c", "cy"), 3f64.sqrt());
    doc.request(&[
        req(&doc, "c", "cx", 11.0),
        req(&doc, "c", "cy", 10.0 + 3f64.sqrt()),
    ]);
    assert_close!(v(&doc, "p1", "x"), 10.0);
    assert_close!(v(&doc, "p1", "y"), 10.0);
    assert_close!(v(&doc, "p2", "x"), 12.0);
}

#[test]
fn circle_center_constrained_to_grid_carries_through_point() {
    // The current core corrects this after the update; here one inversion
    // with lookahead gives the same answer (ADR 0006).
    let mut doc = load(
        r#"<graph>
             <point name="c">(0,0)<constraints><constrainToGrid dx="3" dy="2"/></constraints></point>
             <point name="p">(1,0)</point>
             <circle name="circ" center="$c" through="$p"/>
           </graph>"#,
    )
    .unwrap();
    doc.request(&[req(&doc, "circ", "cx", 4.0), req(&doc, "circ", "cy", 2.7)]);
    assert_eq!((v(&doc, "c", "x"), v(&doc, "c", "y")), (3.0, 2.0));
    assert_close!(v(&doc, "p", "x"), 4.0);
    assert_close!(v(&doc, "p", "y"), 2.0);
    assert_close!(v(&doc, "circ", "radius"), 1.0);
}

#[test]
fn circle_through_three_points_one_constrained() {
    let mut doc = load(
        r#"<graph>
             <point name="p1">(0,0)<constraints><constrainToGrid dx="3" dy="2"/></constraints></point>
             <point name="p2">(4,0)</point><point name="p3">(0,4)</point>
             <circle name="c" through="$p1 $p2 $p3"/>
           </graph>"#,
    )
    .unwrap();
    let (cx, cy) = (v(&doc, "c", "cx"), v(&doc, "c", "cy"));
    doc.request(&[
        req(&doc, "c", "cx", cx + 1.0),
        req(&doc, "c", "cy", cy + 1.0),
    ]);
    // p1 snapped to (0,2): the shift (-1, +1) is applied to every point.
    assert_eq!((v(&doc, "p1", "x"), v(&doc, "p1", "y")), (0.0, 2.0));
    assert_close!(v(&doc, "p2", "x"), 4.0);
    assert_close!(v(&doc, "p2", "y"), 2.0);
    assert_close!(v(&doc, "p3", "x"), 0.0);
    assert_close!(v(&doc, "p3", "y"), 6.0);
}

#[test]
fn circle_through_triangle_vertices() {
    let doc = load(r#"<graph><triangle name="t" vertices="(1,2) (3,5) (-5,2)"/><circle name="c" through="$t.vertex1 $t.vertex2 $t.vertex3"/></graph>"#).unwrap();
    assert_eq!(
        (v(&doc, "t", "x1"), v(&doc, "t", "y2"), v(&doc, "t", "x3")),
        (1.0, 5.0, -5.0)
    );
    let (cx, cy, r) = (
        v(&doc, "c", "cx"),
        v(&doc, "c", "cy"),
        v(&doc, "c", "radius"),
    );
    assert!(r > 0.0, "radius {r}, center ({cx}, {cy})");
    assert_close!((1.0 - cx).hypot(2.0 - cy), r);
    assert_close!((-5.0 - cx).hypot(2.0 - cy), r);
}

#[test]
fn fixed_number_and_inscribed_triangle_drag() {
    let mut doc = load(
        r#"<number hide name="fixedZero" fixed>0</number>
           <graph>
             <triangle name="t" vertices="(1,2) (3,5) (-5,2)"/>
             <circle name="c" through="$t.vertex1 $t.vertex2 $t.vertex3"/>
             <point name="x">($c.center.x, $fixedZero)</point>
           </graph>"#,
    )
    .unwrap();
    let z = doc.cell("fixedZero", "value").unwrap();
    let tick = doc.request(&[Request {
        cell: z,
        value: 5.0,
    }]);
    assert_eq!(tick.dropped.len(), 1, "a fixed number must reject writes");
    let (cx, cy, r) = (
        v(&doc, "c", "cx"),
        v(&doc, "c", "cy"),
        v(&doc, "c", "radius"),
    );
    // The y request lands on the fixed zero and is dropped; x moves the circle.
    let tick = doc.request(&[req(&doc, "x", "x", -3.0), req(&doc, "x", "y", 0.0)]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(reference::check(&doc), None);
    assert_close!(v(&doc, "c", "cx"), -3.0);
    assert_close!(v(&doc, "c", "cy"), cy);
    assert_close!(v(&doc, "c", "radius"), r);
    assert_close!(v(&doc, "t", "x1"), 1.0 - 3.0 - cx);
}

//! A point's constraints (ADR 0080): several apply in document order, each
//! to the previous one's result; a drag comes to rest where they put it;
//! `constraintUsed` says whether any applied. The scenarios are the
//! current core's (`point.test.ts`, `vector.test.ts`, `circle.test.ts`).

mod common;
use cells_core::testing::test_utils::load_unpruned;
use common::*;

fn xy(doc: &cells_core::Document, name: &str) -> (f64, f64) {
    (v(doc, name, "x"), v(doc, name, "y"))
}

#[test]
fn two_contradictory_grids_apply_in_order_and_again_on_a_drag() {
    let mut doc = load_unpruned(
        r#"<graph><point name="P" xs="1 3.1">
             <constrainToGrid dx="2" dy="2"/>
             <constrainToGrid dx="2" dy="2" xoffset="1" yoffset="1"/>
           </point></graph>"#,
    )
    .unwrap();
    // The second wins, from where the first put the point.
    assert_eq!(xy(&doc, "P"), (3.0, 5.0));
    assert_eq!(v(&doc, "P", "constraintUsed"), 1.0);
    // A drag writes the constrained point, constrained again when read,
    // as in the current core.
    move_point(&mut doc, "P", 3.0, 2.9);
    assert_eq!(xy(&doc, "P"), (7.0, 5.0));
}

#[test]
fn a_grid_then_a_line() {
    let mut doc = load_unpruned(
        r#"<graph><line name="l" equation="y=0" fixed/>
           <point name="P" x="-1.5" y="7.9"><constrainToGrid/><constrainTo>$l</constrainTo></point>
           </graph>"#,
    )
    .unwrap();
    assert_eq!(xy(&doc, "P"), (-1.0, 0.0));
    move_point(&mut doc, "P", 8.5, -6.2);
    assert_eq!(xy(&doc, "P"), (9.0, 0.0));
    assert_eq!(v(&doc, "P", "constraintUsed"), 1.0);
}

#[test]
fn an_attraction_to_a_grid_is_used_only_when_near() {
    let mut doc =
        load_unpruned(r#"<graph><point name="P" xs="-7.1 8.9"><attractToGrid/></point></graph>"#)
            .unwrap();
    assert_eq!(xy(&doc, "P"), (-7.0, 9.0));
    assert_eq!(v(&doc, "P", "constraintUsed"), 1.0);
    move_point(&mut doc, "P", 1.5, 3.9);
    assert_eq!(xy(&doc, "P"), (1.5, 3.9));
    assert_eq!(v(&doc, "P", "constraintUsed"), 0.0);
    // With grid lines, each coordinate near its own line snaps.
    let mut doc = load_unpruned(
        r#"<graph><point name="P" xs="1.5 3.9"><attractToGrid includeGridlines/></point></graph>"#,
    )
    .unwrap();
    assert_eq!(xy(&doc, "P"), (1.5, 4.0));
    move_point(&mut doc, "P", 2.1, 0.5);
    assert_eq!(xy(&doc, "P"), (2.0, 0.5));
}

#[test]
fn grid_parameters_may_be_bound() {
    let doc = load_unpruned(
        r#"<mathInput name="dx" prefill="3"/>
           <graph><point name="P" xs="4 1.2"><constrainToGrid dx="$dx"/></point></graph>"#,
    )
    .unwrap();
    assert_eq!(xy(&doc, "P"), (3.0, 1.0));
}

#[test]
fn a_point_is_held_inside_its_graph() {
    let mut doc =
        load_unpruned(r#"<graph><point name="A" x="1" y="2"><constrainToGraph/></point></graph>"#)
            .unwrap();
    move_point(&mut doc, "A", 105.0, 3.0);
    assert_close!(v(&doc, "A", "x"), 10.0 - 0.2);
    assert_eq!(v(&doc, "A", "y"), 3.0);
    // Outside a graph nothing holds it.
    let mut doc =
        load_unpruned(r#"<point name="A" x="1" y="2"><constrainToGraph/></point>"#).unwrap();
    move_point(&mut doc, "A", 105.0, 3.0);
    assert_eq!(xy(&doc, "A"), (105.0, 3.0));
}

#[test]
fn the_nearest_of_several_targets() {
    let mut doc = load_unpruned(
        r#"<graph><line name="l1">y = x + 7</line><line name="l2">y = x - 3</line>
           <point name="P" xs="3 2"><constrainTo>$l1 $l2</constrainTo></point></graph>"#,
    )
    .unwrap();
    // Nearer y = x - 3.
    assert_close!(v(&doc, "P", "y") - v(&doc, "P", "x"), -3.0);
    move_point(&mut doc, "P", -5.0, 3.0);
    assert_close!(v(&doc, "P", "y") - v(&doc, "P", "x"), 7.0);
}

#[test]
fn a_vector_is_a_segment_and_a_ray_a_half_line() {
    let mut doc = load_unpruned(
        r#"<graph><vector name="v" tail="(1,1)" head="(3,1)"/>
           <ray name="r" endpoint="(0,5)" through="(1,5)"/>
           <point name="P" xs="5 4"><constrainTo>$v</constrainTo></point>
           <point name="Q" xs="-3 4"><constrainTo>$r</constrainTo></point></graph>"#,
    )
    .unwrap();
    assert_eq!(xy(&doc, "P"), (3.0, 1.0));
    assert_eq!(xy(&doc, "Q"), (0.0, 5.0));
    move_point(&mut doc, "P", 2.0, -4.0);
    assert_eq!(xy(&doc, "P"), (2.0, 1.0));
}

#[test]
fn an_interior_holds_the_point_inside() {
    let mut doc = load_unpruned(
        r#"<graph><circle name="c" center="(0,0)" radius="2"/>
           <point name="P" xs="1 0"><constrainToInterior>$c</constrainToInterior></point></graph>"#,
    )
    .unwrap();
    assert_eq!(xy(&doc, "P"), (1.0, 0.0));
    move_point(&mut doc, "P", 0.0, 5.0);
    assert_close!(v(&doc, "P", "x"), 0.0);
    assert_close!(v(&doc, "P", "y"), 2.0);
}

#[test]
fn a_polygons_edges_and_interior() {
    let mut doc = load_unpruned(
        r#"<graph><polygon name="s" vertices="(0,0) (4,0) (4,4) (0,4)"/>
           <polyline name="o" vertices="(0,10) (4,10) (4,14)"/>
           <point name="P" xs="1 1.5"><constrainTo>$s</constrainTo></point>
           <point name="Q" xs="1 1"><constrainToInterior>$s</constrainToInterior></point>
           <point name="R" xs="0 14"><constrainTo>$o</constrainTo></point></graph>"#,
    )
    .unwrap();
    assert_eq!(xy(&doc, "P"), (0.0, 1.5));
    assert_eq!(xy(&doc, "Q"), (1.0, 1.0));
    // A polyline does not close: its nearest point is on its first edge.
    assert_eq!(xy(&doc, "R"), (0.0, 10.0));
    move_point(&mut doc, "Q", 6.0, 2.0);
    assert_eq!(xy(&doc, "Q"), (4.0, 2.0));
}

#[test]
fn an_unconstrained_point_is_not_used_and_may_be_not_draggable() {
    let doc =
        load_unpruned(r#"<graph><point name="P" draggable="false">(1,2)</point></graph>"#).unwrap();
    assert_eq!(v(&doc, "P", "constraintUsed"), 0.0);
    assert_eq!(v(&doc, "P", "draggable"), 0.0);
}

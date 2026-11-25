//! A point written as arithmetic over pairs and points (ADR 0083):
//! `(3,4) + 2(1,-1)`, `2$m - 3$P`, each coordinate the same arithmetic over
//! the coordinates, as the current core evaluates the vector.

mod common;
use common::{move_point, v};

use cells_core::testing::test_utils::load;

#[test]
fn a_point_of_vector_arithmetic_has_its_value_and_drags() {
    let mut doc = load(
        r#"<math name="m" fixed>(6,3)</math>
           <graph>
             <point name="P">(3,4) + 2(1,-1)</point>
             <point name="Q">2$m - 3$P</point>
           </graph>"#,
    )
    .unwrap();
    let at = |doc: &cells_core::Document, n: &str| (v(doc, n, "x"), v(doc, n, "y"));
    assert_eq!(at(&doc, "P"), (5.0, 2.0));
    assert_eq!(at(&doc, "Q"), (-3.0, 0.0));
    move_point(&mut doc, "P", 1.0, 4.0);
    assert_eq!(at(&doc, "Q"), (9.0, -6.0));
    // A drag of Q writes P: the fixed math does not move.
    move_point(&mut doc, "Q", -9.0, 9.0);
    assert_eq!(at(&doc, "P"), (7.0, -1.0));
    assert_eq!(at(&doc, "Q"), (-9.0, 9.0));
}

/// A point list's items are the pieces between spaces outside brackets,
/// each a point of vector arithmetic or a reference.
#[test]
fn a_polygon_of_vector_arithmetic() {
    let doc = load(
        r#"<math name="m" fixed>(-3,2)</math>
           <graph>
             <point name="P">(2,1)</point>
             <polygon vertices="2(2,-3)+(3,4) 3$P $P+2$m" name="pg" />
             <polyline vertices="$P 3$P ( 1 , 2 )" name="pl" />
           </graph>"#,
    )
    .unwrap();
    let vertex = |n: &str, k: usize| (v(&doc, n, &format!("x{k}")), v(&doc, n, &format!("y{k}")));
    assert_eq!(vertex("pg", 1), (7.0, -2.0));
    assert_eq!(vertex("pg", 2), (6.0, 3.0));
    assert_eq!(vertex("pg", 3), (-4.0, 5.0));
    assert_eq!(vertex("pl", 1), (2.0, 1.0));
    assert_eq!(vertex("pl", 2), (6.0, 3.0));
    assert_eq!(vertex("pl", 3), (1.0, 2.0));
}

#[test]
fn a_midpoint_of_two_points() {
    let doc = load(
        r#"<graph><point name="P">(1,2)</point><point name="Q">(3,-4)</point>
           <point name="M">($P+$Q)/2</point></graph>"#,
    )
    .unwrap();
    assert_eq!((v(&doc, "M", "x"), v(&doc, "M", "y")), (2.0, -1.0));
}

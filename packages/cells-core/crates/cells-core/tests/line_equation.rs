//! A line whose equation is a math value (`<line>$equation</line>` of a
//! math input) reads its coefficients in the tick (ADR 0083,
//! `SymKind::LineCoeffs`).

mod common;
use common::{close, type_into, v};

use cells_core::testing::test_utils::load_unpruned as load;

#[test]
fn a_line_follows_an_equation_typed_into_a_math_input() {
    let mut doc = load(
        r#"<mathInput name="equation" prefill="y=2x+1" />
           <graph><line name="l">$equation</line></graph>"#,
    )
    .unwrap();
    assert!(close(v(&doc, "l", "slope"), 2.0));
    assert!(close(v(&doc, "l", "yintercept"), 1.0));
    type_into(&mut doc, "equation", "y=-1/2x+3");
    assert!(close(v(&doc, "l", "slope"), -0.5));
    assert!(close(v(&doc, "l", "yintercept"), 3.0));
    // Not linear: no line.
    type_into(&mut doc, "equation", "y=x^2");
    assert!(v(&doc, "l", "slope").is_nan());
    type_into(&mut doc, "equation", "5x - 2y = 3");
    assert!(close(v(&doc, "l", "coeffvar1"), 5.0));
    assert!(close(v(&doc, "l", "coeffvar2"), -2.0));
    assert!(close(v(&doc, "l", "coeff0"), -3.0));
}

#[test]
fn a_line_reads_an_equation_attribute_in_its_own_variables() {
    let mut doc = load(
        r#"<mathInput name="equation">5u-2v=3</mathInput>
           <graph><line name="l" variables="u v" equation="$equation"/></graph>"#,
    )
    .unwrap();
    assert!(close(v(&doc, "l", "coeffvar1"), 5.0));
    assert!(close(v(&doc, "l", "coeffvar2"), -2.0));
    assert!(close(v(&doc, "l", "coeff0"), -3.0));
    type_into(&mut doc, "equation", "u = 4");
    assert!(close(v(&doc, "l", "coeffvar1"), 1.0));
    assert!(close(v(&doc, "l", "coeffvar2"), 0.0));
    assert!(close(v(&doc, "l", "coeff0"), -4.0));
}

/// The coefficients have no inverse (ADR 0008): a drag of the line is
/// dropped, where the current core writes the equation back.
#[test]
fn a_drag_of_a_line_of_a_math_value_is_dropped() {
    use cells_core::tick::invert::PointRequest;
    let mut doc = load(
        r#"<mathInput name="equation">5x-2y=3</mathInput>
           <graph><line name="l" equation="$equation"/></graph>"#,
    )
    .unwrap();
    let (x1, y1, x2, y2) = (
        v(&doc, "l", "x1"),
        v(&doc, "l", "y1"),
        v(&doc, "l", "x2"),
        v(&doc, "l", "y2"),
    );
    let pts: Vec<PointRequest> = [("x1", "y1", x1 + 1.0, y1), ("x2", "y2", x2 + 1.0, y2)]
        .iter()
        .map(|&(px, py, x, y)| PointRequest {
            cells: [doc.cell("l", px).unwrap(), doc.cell("l", py).unwrap()],
            values: [x, y],
        })
        .collect();
    let t = doc.request_points(&pts);
    assert!(!t.dropped.is_empty());
    assert!(close(v(&doc, "l", "x1"), x1));
    assert!(close(v(&doc, "l", "coeff0"), -3.0));
}

/// An angle along one line has its vertex at the line's point nearest
/// the origin, from its coefficients, as the current core computes it.
#[test]
fn an_angle_along_one_line_of_a_math_value() {
    let mut doc = load(
        r#"<mathInput name="equation" prefill="y=2x+1" />
           <graph><line name="l">$equation</line>
             <angle name="a" betweenLines="$l"/></graph>"#,
    )
    .unwrap();
    assert_eq!((v(&doc, "a", "x2"), v(&doc, "a", "y2")), (-0.4, 0.2));
    type_into(&mut doc, "equation", "y=-1/2x+3");
    assert!(close(v(&doc, "a", "x2"), 6.0 / 5.0));
    assert!(close(v(&doc, "a", "y2"), 12.0 / 5.0));
}

#[test]
fn a_line_of_an_equation_math_reads_it() {
    let doc = load(
        r#"<math name="eq">y = 3x - 2</math>
           <graph><line name="l">$eq</line></graph>"#,
    )
    .unwrap();
    assert!(close(v(&doc, "l", "slope"), 3.0));
    assert!(close(v(&doc, "l", "yintercept"), -2.0));
}

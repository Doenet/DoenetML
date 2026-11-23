//! Functions of one variable read at any `x` (ADR 0049): a `<function>`
//! on its domain and a `<piecewiseFunction>` of its pieces, as a reader
//! that samples a function itself asks for them (`Document::function_value`).

use cells_core::Document;
use cells_core::testing::test_utils::{load, load_error};

fn at(doc: &mut Document, name: &str, x: f64) -> Option<f64> {
    let c = doc.resolve_path(name).unwrap();
    doc.function_value(c, x)
}

#[test]
fn a_function_is_missing_outside_its_domain() {
    let mut doc =
        load(r#"<graph><function name="f" domain="(-4, 7]" variables="t">t^2</function></graph>"#)
            .unwrap();
    assert_eq!(at(&mut doc, "f", 2.0), Some(4.0));
    assert_eq!(at(&mut doc, "f", 7.0), Some(49.0));
    assert!(at(&mut doc, "f", -4.0).unwrap().is_nan());
    assert!(at(&mut doc, "f", 8.0).unwrap().is_nan());
}

#[test]
fn a_piecewise_function_is_its_first_piece_there() {
    let mut doc = load(
        r#"<graph><piecewiseFunction name="h">
             <function domain="[0,0]">1/2</function>
             <function domain="(0,Infinity)">1</function>
             <function domain="(s,t)">7</function>
             <function>0</function>
           </piecewiseFunction></graph>"#,
    )
    .unwrap();
    for (x, y) in [(-1.0, 0.0), (0.0, 0.5), (1e-6, 1.0), (3.0, 1.0)] {
        assert_eq!(at(&mut doc, "h", x), Some(y), "h({x})");
    }
}

#[test]
fn a_piecewise_functions_own_domain_cuts_it() {
    let mut doc = load(
        r#"<graph><piecewiseFunction name="f" domain="[1, 3)">
             <function>x</function>
           </piecewiseFunction></graph>"#,
    )
    .unwrap();
    assert_eq!(at(&mut doc, "f", 1.0), Some(1.0));
    assert!(at(&mut doc, "f", 3.0).unwrap().is_nan());
}

#[test]
fn what_is_no_function_of_one_variable_has_no_value() {
    let mut doc =
        load(r#"<function name="g" variables="x y">x+y</function><math name="m">x</math>"#)
            .unwrap();
    assert_eq!(at(&mut doc, "g", 1.0), None);
    assert_eq!(at(&mut doc, "m", 1.0), None);
}

#[test]
fn math_cannot_read_a_piecewise_function() {
    // Like the current core's, it has no formula: refused, not read as
    // blank.
    let (code, message) = load_error(
        r#"<graph><piecewiseFunction name="f"><function>x</function></piecewiseFunction></graph>
           <math name="m">$f + 1</math>"#,
    );
    assert_eq!(code, "cells-no-default-prop", "{message}");
}

/// A spline's segment is the cubic Bezier from each point to the next
/// whose control points are each point plus its control vector toward the
/// other (`<bezierControls>`, symmetric: the one toward the next point is
/// the opposite of the one written).
#[test]
fn a_spline_segment_is_the_bezier_cubic_of_its_control_points() {
    let doc = load(
        r#"<graph><curve name="c" through="(1, 2) (3, 4)">
             <bezierControls>(3,1) (-1,5)</bezierControls>
           </curve></graph>"#,
    )
    .unwrap();
    let [p1, c1, c2, p2] = [[1.0, 2.0], [-2.0, 1.0], [2.0, 9.0], [3.0, 4.0]];
    let n = cells_core::program::SAMPLES;
    let xs = doc.cell("c", "samplesX").unwrap().index();
    let ys = doc.cell("c", "samples").unwrap().index();
    for k in [0, 37, 120, n - 1] {
        let s = k as f64 / (n - 1) as f64;
        let b = |d: usize| {
            let r = 1.0 - s;
            r * r * r * p1[d]
                + 3.0 * r * r * s * c1[d]
                + 3.0 * r * s * s * c2[d]
                + s * s * s * p2[d]
        };
        assert!((doc.cells[xs + k] - b(0)).abs() < 1e-12, "x at {k}");
        assert!((doc.cells[ys + k] - b(1)).abs() < 1e-12, "y at {k}");
    }
}

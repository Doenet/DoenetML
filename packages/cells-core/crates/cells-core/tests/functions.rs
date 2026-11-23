//! Functions of one variable read at any `x` (ADR 0046): a `<function>`
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

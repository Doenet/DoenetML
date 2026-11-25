//! Math text that calls a function or names a constant is a number where
//! math is numeric (ADR 0083): a `<number>`'s text, a point's coordinate,
//! a numeric attribute, over literals and over number cells, as the current
//! core evaluates it (`evaluate_to_constant`). A `<math>` keeps such a call
//! as written.

mod common;
use common::{close, move_point, set, type_into, v};

use cells_core::testing::test_utils::load;

#[test]
fn a_number_of_a_function_of_a_literal_is_its_value() {
    let doc = load(
        r#"<number name="s">sin(1)</number>
           <number name="c">5cos(2)</number>
           <number name="r">sqrt(2)</number>
           <number name="l">log(e^2)</number>
           <number name="l10">log10(1000)</number>
           <number name="x">exp(1)</number>
           <number name="e">e</number>
           <number name="t">arctan(1)</number>
           <number name="sec">sec(0)</number>
           <number name="acot">arccot(1)</number>
           <number name="ab">abs(-3)</number>
           <number name="ce">ceil(2.1)</number>
           <number name="sh">cosh(0)</number>"#,
    )
    .unwrap();
    let want = [
        ("s", 1f64.sin()),
        ("c", 5.0 * 2f64.cos()),
        ("r", 2f64.sqrt()),
        ("l", 2.0),
        ("l10", 3.0),
        ("x", std::f64::consts::E),
        ("e", std::f64::consts::E),
        ("t", std::f64::consts::FRAC_PI_4),
        ("sec", 1.0),
        ("acot", std::f64::consts::FRAC_PI_4),
        ("ab", 3.0),
        ("ce", 3.0),
        ("sh", 1.0),
    ];
    for (name, value) in want {
        assert!(
            close(v(&doc, name, "value"), value),
            "{name}: {}",
            v(&doc, name, "value")
        );
    }
}

#[test]
fn a_function_of_a_number_cell_follows_it() {
    let mut doc = load(
        r#"<number name="t">1</number>
           <mathInput name="mi" bindValueTo="$t"/>
           <number name="s">5sin($t)</number>
           <graph><point name="P" x="cos($t)" y="sin($t)"/></graph>"#,
    )
    .unwrap();
    assert!(close(v(&doc, "s", "value"), 5.0 * 1f64.sin()));
    assert!(close(v(&doc, "P", "x"), 1f64.cos()));
    set(&mut doc, "t", "value", 2.0);
    assert!(close(v(&doc, "s", "value"), 5.0 * 2f64.sin()));
    assert!(close(v(&doc, "P", "y"), 2f64.sin()));
}

#[test]
fn a_point_with_a_function_in_a_coordinate_has_its_value_and_drags() {
    let mut doc = load(r#"<graph><point name="P">(1, 5sin(1))</point></graph>"#).unwrap();
    assert!(close(v(&doc, "P", "y"), 5.0 * 1f64.sin()));
    move_point(&mut doc, "P", 3.0, 4.0);
    assert_eq!(v(&doc, "P", "x"), 3.0);
    assert_eq!(v(&doc, "P", "y"), 4.0);
}

#[test]
fn a_function_of_a_math_input_is_its_value() {
    let mut doc = load(
        r#"<mathInput name="theta" prefill="0"/>
           <graph><point name="P" x="8cos($theta)" y="8sin($theta)"/></graph>"#,
    )
    .unwrap();
    assert!(close(v(&doc, "P", "x"), 8.0));
    type_into(&mut doc, "theta", "pi/2");
    assert!(v(&doc, "P", "x").abs() < 1e-12, "{}", v(&doc, "P", "x"));
    assert!(close(v(&doc, "P", "y"), 8.0));
}

#[test]
fn a_request_through_a_function_is_dropped() {
    let mut doc = load(
        r#"<number name="t">1</number>
           <graph><point name="P" x="$t" y="sin($t)"/></graph>"#,
    )
    .unwrap();
    let out = set(&mut doc, "P", "y", 0.5);
    assert!(!out.dropped.is_empty());
    assert_eq!(v(&doc, "t", "value"), 1.0);
}

#[test]
fn a_math_keeps_a_call_as_written_and_evaluates_it() {
    let doc = load(
        r#"<number name="t">1</number>
           <math name="m">sin($t)</math>
           <math name="c">sqrt(2)</math>"#,
    )
    .unwrap();
    assert_eq!(doc.math_text(doc.cell("m", "expr").unwrap()), "sin(1)");
    assert!(close(v(&doc, "m", "value"), 1f64.sin()));
    assert_eq!(doc.math_text(doc.cell("c", "expr").unwrap()), "sqrt(2)");
}

/// A condition reads a call to one of the engine's functions as the
/// engine does, symbolically, so it compares as written.
#[test]
fn a_condition_over_a_function_compares_its_value() {
    let doc = load(
        r#"<number name="t">1</number>
           <boolean name="b">sin($t) > 0.5</boolean>
           <boolean name="c">cos(pi) < -0.5</boolean>
           <boolean name="s" symbolicEquality>log10(10^3) = 3</boolean>
           <boolean name="n">log10(10^3) = 3</boolean>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "b", "value"), 1.0);
    assert_eq!(v(&doc, "c", "value"), 1.0);
    assert_eq!(v(&doc, "s", "value"), 0.0, "compared as written");
    assert_eq!(v(&doc, "n", "value"), 1.0);
}

/// `e` and infinity are numbers where math is numeric; `1/0` is a signed
/// infinity, as the current core's `<number>` gives.
#[test]
fn named_constants_and_division_by_zero_are_numbers() {
    let doc = load(
        r#"<number name="inf">Infinity</number>
           <number name="inf2">∞ + 1</number>
           <number name="pos">1/0</number>
           <number name="neg">4/-0</number>
           <number name="ee">e^2</number>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "inf", "value"), f64::INFINITY);
    assert_eq!(v(&doc, "inf2", "value"), f64::INFINITY);
    assert_eq!(v(&doc, "pos", "value"), f64::INFINITY);
    assert_eq!(v(&doc, "neg", "value"), f64::NEG_INFINITY);
    assert!(close(v(&doc, "ee", "value"), std::f64::consts::E.powi(2)));
}

/// An indeterminate form is NaN, as the current core evaluates it.
#[test]
fn indeterminate_forms_are_nan() {
    let doc = load(
        r#"<number name="a">0^0</number>
           <number name="b">Infinity^0</number>
           <number name="c">1^Infinity</number>
           <number name="z">0</number>
           <number name="d">$z^$z</number>
           <number name="e">2^3</number>"#,
    )
    .unwrap();
    for n in ["a", "b", "c", "d"] {
        assert!(v(&doc, n, "value").is_nan(), "{n}");
    }
    assert_eq!(v(&doc, "e", "value"), 8.0);
}

/// A condition comparing calls over a math input stays the engine's, as
/// it was before the lowering read them.
#[test]
fn a_condition_comparing_calls_over_a_math_input_loads() {
    let doc = load(
        r#"<mathInput prefill="1" name="i" />
           <boolean name="b">floor(($i+1)/2) = ceil(($i-1)/2)</boolean>
           <boolean name="c">abs(cos(pi*$i/2)) < 10^(-12)</boolean>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "b", "value"), 0.0);
    assert_eq!(v(&doc, "c", "value"), 1.0);
}

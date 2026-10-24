//! Inversion through operators, the request engine's machinery: requests
//! on `<number>`s no input reaches are unchecked (ADR 0018).

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::{RequestUnchecked, req};

/// Request `value` on `name.prop` and assert the forward pass reproduces it.
fn round_trip(doc: &mut Document, name: &str, prop: &str, value: f64) {
    let tick = doc.request_unchecked(&[req(doc, name, prop, value)]);
    assert!(tick.dropped.is_empty(), "request dropped");
    assert_eq!(
        doc.value(name, prop),
        Some(value),
        "{name}.{prop} after request"
    );
    assert_eq!(reference::check(doc), None);
}

#[test]
fn dragging_an_aliased_copy_moves_the_original() {
    let mut doc =
        load(r#"<point name="p1" x="1" y="2"/><point name="p2" extend="$p1" y="3"/>"#).unwrap();
    let tick = doc.request_unchecked(&[req(&doc, "p2", "x", 9.0), req(&doc, "p2", "y", 8.0)]);
    assert_eq!(doc.value("p1", "x"), Some(9.0));
    assert_eq!(doc.value("p1", "y"), Some(2.0));
    assert_eq!(doc.value("p2", "y"), Some(8.0));
    assert_eq!(tick.changed.len(), 2);
}

/// A copy's own children are its coordinates: `(3,4)` is not the
/// original's `(1,2)`, and moving one leaves the other. A copy that gives
/// none shares the original's.
#[test]
fn a_copy_with_its_own_children_keeps_them() {
    let mut doc = load(
        r#"<graph><point name="p1">(1,2)</point>
           <point name="p2" extend="$p1">(3,4)</point>
           <point name="p3" extend="$p1" hide="false"/></graph>"#,
    )
    .unwrap();
    assert_eq!(
        (doc.value("p2", "x"), doc.value("p2", "y")),
        (Some(3.0), Some(4.0))
    );
    doc.request_unchecked(&[req(&doc, "p2", "x", 5.0)]);
    assert_eq!(
        (doc.value("p1", "x"), doc.value("p2", "x")),
        (Some(1.0), Some(5.0))
    );
    doc.request_unchecked(&[req(&doc, "p3", "x", 6.0)]);
    assert_eq!(doc.value("p1", "x"), Some(6.0));
}

#[test]
fn unary_inverses_round_trip() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/>
           <number name="neg">-$n</number>
           <number name="sc">4 * $n</number>
           <number name="off">$n + 1.5</number>
           <number name="cl">clamp($n, -1, 1)</number>"#,
    )
    .unwrap();
    round_trip(&mut doc, "neg", "value", 7.0);
    assert_eq!(doc.value("n", "value"), Some(-7.0));
    round_trip(&mut doc, "sc", "value", 10.0);
    assert_eq!(doc.value("n", "value"), Some(2.5));
    round_trip(&mut doc, "off", "value", 0.0);
    assert_eq!(doc.value("n", "value"), Some(-1.5));
    round_trip(&mut doc, "cl", "value", 0.25);
    assert_eq!(doc.value("n", "value"), Some(0.25));
}

/// ADR 0003: idempotent operators invert by projection, so the essential
/// cell receives the clamped value, not the raw request.
#[test]
fn clamp_inverts_by_projection() {
    let mut doc =
        load(r#"<numberInput name="n" value="0"/><number name="cl">clamp($n, -1, 1)</number>"#)
            .unwrap();
    let tick = doc.request_unchecked(&[req(&doc, "cl", "value", 5.0)]);
    assert_eq!(doc.value("n", "value"), Some(1.0));
    assert_eq!(doc.value("cl", "value"), Some(1.0));
    assert_eq!(tick.changed.len(), 2);
}

#[test]
fn round_floor_min_max_div_inverses() {
    let mut doc = load(
        r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
           <number name="r">round($a)</number>
           <number name="f">floor($a)</number>
           <number name="mn">min($a, $b)</number>
           <number name="mx">max($a, $b)</number>
           <number name="d">$a / $b</number>"#,
    )
    .unwrap();
    doc.request_unchecked(&[req(&doc, "r", "value", 3.7)]);
    assert_eq!(doc.value("a", "value"), Some(4.0));
    doc.request_unchecked(&[req(&doc, "f", "value", 3.7)]);
    assert_eq!(doc.value("a", "value"), Some(3.0));
    doc.request_unchecked(&[req(&doc, "mn", "value", 9.0)]);
    assert_eq!(doc.value("a", "value"), Some(5.0));
    doc.request_unchecked(&[req(&doc, "mx", "value", -9.0)]);
    assert_eq!(doc.value("a", "value"), Some(5.0));
    round_trip(&mut doc, "d", "value", 2.0);
    assert_eq!(doc.value("a", "value"), Some(10.0));
    // A non-finite ask on Round is outside its domain and is dropped.
    let tick = doc.request_unchecked(&[req(&doc, "r", "value", f64::NAN)]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(doc.value("a", "value"), Some(10.0));
    // NaN propagates through min/max instead of being ignored.
    doc.request_unchecked(&[req(&doc, "b", "value", f64::NAN)]);
    assert!(doc.value("mn", "value").unwrap().is_nan());
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn binary_inverses_write_the_first_argument() {
    let mut doc = load(
        r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
           <number name="s">$a + $b</number>
           <number name="d">$a - $b</number>
           <number name="m">$a * $b</number>
           <number name="q">$a / $b</number>"#,
    )
    .unwrap();
    round_trip(&mut doc, "s", "value", 12.0);
    assert_eq!(
        (doc.value("a", "value"), doc.value("b", "value")),
        (Some(7.0), Some(5.0))
    );
    round_trip(&mut doc, "d", "value", 1.0);
    assert_eq!(doc.value("a", "value"), Some(6.0));
    round_trip(&mut doc, "m", "value", 20.0);
    assert_eq!(doc.value("a", "value"), Some(4.0));
    round_trip(&mut doc, "q", "value", 2.0);
    assert_eq!(doc.value("a", "value"), Some(10.0));
    assert_eq!(doc.value("b", "value"), Some(5.0));
}

#[test]
fn chained_inverse_reaches_the_essential_cell() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
           <number name="a">2 * $n</number>
           <number name="b">$a + 3</number>
           <number name="c">-$b</number>
           <point name="p" x="$c" y="$n"/>"#,
    )
    .unwrap();
    // drag p to x = -11: c=-11 -> b=11 -> a=8 -> n=4
    let tick = doc.request_unchecked(&[req(&doc, "p", "x", -11.0), req(&doc, "p", "y", 4.0)]);
    assert_eq!(doc.value("n", "value"), Some(4.0));
    assert_eq!(doc.value("p", "x"), Some(-11.0));
    // n, a, b, c all changed; y aliases n so there is no separate cell
    assert_eq!(tick.changed.len(), 4);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn undefined_inverse_drops_the_request() {
    let mut doc = load(r#"<numberInput name="a" value="2"/><numberInput name="z" value="0"/><number name="m">$a * $z</number>"#).unwrap();
    let before = doc.cells.clone();
    let r = req(&doc, "m", "value", 3.0);
    let tick = doc.request_unchecked(&[r]);
    assert_eq!(tick.dropped, vec![r]);
    assert!(tick.changed.is_empty());
    assert_eq!(doc.cells, before);
}

#[test]
fn conflicting_requests_last_wins() {
    let mut doc =
        load(r#"<numberInput name="n" value="0"/><number name="neg">-$n</number>"#).unwrap();
    let tick =
        doc.request_unchecked(&[req(&doc, "n", "value", 1.0), req(&doc, "neg", "value", 5.0)]);
    assert_eq!(doc.value("n", "value"), Some(-5.0));
    let n = doc.cell("n", "value").unwrap();
    assert_eq!(tick.changed.iter().filter(|&&c| c == n).count(), 1);
}

#[test]
fn unchanged_values_are_not_reported() {
    let mut doc =
        load(r#"<numberInput name="n" value="3"/><number name="neg">-$n</number>"#).unwrap();
    let tick = doc.request_unchecked(&[req(&doc, "n", "value", 3.0)]);
    assert!(tick.changed.is_empty());
    // A change upstream that leaves a derived cell equal is also silent.
    let mut doc =
        load(r#"<numberInput name="n" value="3"/><number name="cl">clamp($n, 0, 1)</number>"#)
            .unwrap();
    let tick = doc.request_unchecked(&[req(&doc, "n", "value", 4.0)]);
    assert_eq!(tick.changed, vec![doc.cell("n", "value").unwrap()]);
}

#[test]
fn evaluators_agree() {
    let src = r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
        <number name="s">$a + $b</number><number name="t">3 * $s</number>
        <number name="u">-$b</number><number name="v">clamp($t, 0, 100)</number>
        <number name="w">max($u, $v)</number>
        <numberInput name="c" value="1"/><number name="x">$c + 1</number>"#;
    let base = load(src).unwrap();
    // A document ticks through the dirty closure unless told otherwise.
    assert_eq!(base.evaluator(), "dirty-closure");
    let reqs = [
        req(&base, "s", "value", 20.0),
        req(&base, "u", "value", -1.0),
    ];
    let mut results = Vec::new();
    for name in ["full", "dirty-closure"] {
        let mut doc = base.clone();
        assert!(doc.set_evaluator(name));
        let tick = doc.request_unchecked(&reqs);
        assert_eq!(reference::check(&doc), None, "{name}");
        let mut changed = tick.changed.clone();
        changed.sort();
        results.push((doc.cells.clone(), changed));
    }
    assert_eq!(results[0], results[1]);
    // x depends only on c, which did not change: it must not be reported.
    assert!(!results[0].1.contains(&base.cell("x", "value").unwrap()));
    assert!(!base.clone().set_evaluator("other"));
}

// A request must hold what its cell holds: a number asked of a math cell
// that is no handle in the engine is dropped rather than read as another
// expression (or, out of range, a panic). A whole number below the
// engine's size is a handle, so it cannot be told from one.
#[test]
fn a_number_requested_of_a_math_cell_is_dropped() {
    let mut doc =
        load(r#"<mathInput name="mi" prefill="3"/><math name="mm" simplify>$mi x</math>"#).unwrap();
    let cell = doc.cell("mi", "expr").unwrap();
    let before = doc.math_text(cell);
    for value in [2.7, 1e6, -1.0] {
        let t = doc.request_unchecked(&[req(&doc, "mi", "expr", value)]);
        assert_eq!(t.dropped.len(), 1, "{value}");
        assert!(t.changed.is_empty(), "{value}");
    }
    assert_eq!(doc.math_text(cell), before);
}

// The same for a text cell and a number that is not a string id.
#[test]
fn a_number_requested_of_a_text_cell_is_dropped() {
    let mut doc = load(r#"<textInput name="ti" prefill="hi"/>"#).unwrap();
    for value in [0.5, 1e6, -1.0] {
        let t = doc.request_unchecked(&[req(&doc, "ti", "value", value)]);
        assert_eq!(t.dropped.len(), 1, "{value}");
    }
    let cell = doc.cell("ti", "value").unwrap();
    assert_eq!(doc.text_value(cell), "hi");
}

mod common;

use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use cells_core::{Document, TickOutcome};
use common::req;

/// Request `value` on `name.prop` and assert the forward pass reproduces it.
fn round_trip(doc: &mut Document, name: &str, prop: &str, value: f64) {
    let tick = doc.request(&[req(doc, name, prop, value)]);
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
    let tick = doc.request(&[req(&doc, "p2", "x", 9.0), req(&doc, "p2", "y", 8.0)]);
    assert_eq!(doc.value("p1", "x"), Some(9.0));
    assert_eq!(doc.value("p1", "y"), Some(2.0));
    assert_eq!(doc.value("p2", "y"), Some(8.0));
    assert_eq!(tick.changed.len(), 2);
}

#[test]
fn unary_inverses_round_trip() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/>
           <op name="neg" kind="negate" args="$n"/>
           <op name="sc" kind="scale" k="4" args="$n"/>
           <op name="off" kind="offset" k="1.5" args="$n"/>
           <op name="cl" kind="clamp" lo="-1" hi="1" args="$n"/>"#,
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
    let mut doc = load(
        r#"<numberInput name="n" value="0"/><op name="cl" kind="clamp" lo="-1" hi="1" args="$n"/>"#,
    )
    .unwrap();
    let tick = doc.request(&[req(&doc, "cl", "value", 5.0)]);
    assert_eq!(doc.value("n", "value"), Some(1.0));
    assert_eq!(doc.value("cl", "value"), Some(1.0));
    assert_eq!(tick.changed.len(), 2);
}

#[test]
fn round_floor_min_max_div_inverses() {
    let mut doc = load(
        r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
           <op name="r" kind="round" args="$a"/>
           <op name="f" kind="floor" args="$a"/>
           <op name="mn" kind="min" args="$a $b"/>
           <op name="mx" kind="max" args="$a $b"/>
           <op name="d" kind="div" args="$a $b"/>"#,
    )
    .unwrap();
    doc.request(&[req(&doc, "r", "value", 3.7)]);
    assert_eq!(doc.value("a", "value"), Some(4.0));
    doc.request(&[req(&doc, "f", "value", 3.7)]);
    assert_eq!(doc.value("a", "value"), Some(3.0));
    doc.request(&[req(&doc, "mn", "value", 9.0)]);
    assert_eq!(doc.value("a", "value"), Some(5.0));
    doc.request(&[req(&doc, "mx", "value", -9.0)]);
    assert_eq!(doc.value("a", "value"), Some(5.0));
    round_trip(&mut doc, "d", "value", 2.0);
    assert_eq!(doc.value("a", "value"), Some(10.0));
    // A non-finite ask on Round is outside its domain and is dropped.
    let tick = doc.request(&[req(&doc, "r", "value", f64::NAN)]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(doc.value("a", "value"), Some(10.0));
    // NaN propagates through min/max instead of being ignored.
    doc.request(&[req(&doc, "b", "value", f64::NAN)]);
    assert!(doc.value("mn", "value").unwrap().is_nan());
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn binary_inverses_write_the_first_argument() {
    let mut doc = load(
        r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
           <op name="s" kind="add" args="$a $b"/>
           <op name="d" kind="sub" args="$a $b"/>
           <op name="m" kind="mul" args="$a $b"/>
           <op name="l" kind="lerp" t="0.25" args="$a $b"/>"#,
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
    round_trip(&mut doc, "l", "value", 5.0);
    assert_eq!(doc.value("a", "value"), Some(5.0));
    assert_eq!(doc.value("b", "value"), Some(5.0));
}

#[test]
fn chained_inverse_reaches_the_essential_cell() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
           <op name="a" kind="scale" k="2" args="$n"/>
           <op name="b" kind="offset" k="3" args="$a"/>
           <op name="c" kind="negate" args="$b"/>
           <point name="p" x="$c" y="$n"/>"#,
    )
    .unwrap();
    // drag p to x = -11: c=-11 -> b=11 -> a=8 -> n=4
    let tick = doc.request(&[req(&doc, "p", "x", -11.0), req(&doc, "p", "y", 4.0)]);
    assert_eq!(doc.value("n", "value"), Some(4.0));
    assert_eq!(doc.value("p", "x"), Some(-11.0));
    // n, a, b, c all changed; y aliases n so there is no separate cell
    assert_eq!(tick.changed.len(), 4);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn undefined_inverse_drops_the_request() {
    let mut doc = load(r#"<numberInput name="a" value="2"/><numberInput name="z" value="0"/><op name="m" kind="mul" args="$a $z"/>"#).unwrap();
    let before = doc.cells.clone();
    let r = req(&doc, "m", "value", 3.0);
    let tick = doc.request(&[r]);
    assert_eq!(tick.dropped, vec![r]);
    assert!(tick.changed.is_empty());
    assert_eq!(doc.cells, before);
}

#[test]
fn conflicting_requests_last_wins() {
    let mut doc =
        load(r#"<numberInput name="n" value="0"/><op name="neg" kind="negate" args="$n"/>"#)
            .unwrap();
    let tick = doc.request(&[req(&doc, "n", "value", 1.0), req(&doc, "neg", "value", 5.0)]);
    assert_eq!(doc.value("n", "value"), Some(-5.0));
    let n = doc.cell("n", "value").unwrap();
    assert_eq!(tick.changed.iter().filter(|&&c| c == n).count(), 1);
}

#[test]
fn unchanged_values_are_not_reported() {
    let mut doc =
        load(r#"<numberInput name="n" value="3"/><op name="neg" kind="negate" args="$n"/>"#)
            .unwrap();
    let tick = doc.request(&[req(&doc, "n", "value", 3.0)]);
    assert!(tick.changed.is_empty());
    // A change upstream that leaves a derived cell equal is also silent.
    let mut doc = load(
        r#"<numberInput name="n" value="3"/><op name="cl" kind="clamp" lo="0" hi="1" args="$n"/>"#,
    )
    .unwrap();
    let tick = doc.request(&[req(&doc, "n", "value", 4.0)]);
    assert_eq!(tick.changed, vec![doc.cell("n", "value").unwrap()]);
}

#[test]
fn evaluators_agree() {
    use cells_core::{DirtyClosure, Evaluator, FullRecompute};
    let src = r#"<numberInput name="a" value="2"/><numberInput name="b" value="5"/>
        <op name="s" kind="add" args="$a $b"/><op name="t" kind="scale" k="3" args="$s"/>
        <op name="u" kind="negate" args="$b"/><op name="v" kind="clamp" lo="0" hi="100" args="$t"/>
        <op name="w" kind="lerp" t="0.5" args="$u $v"/>
        <numberInput name="c" value="1"/><op name="x" kind="offset" k="1" args="$c"/>"#;
    let base = load(src).unwrap();
    let reqs = [
        req(&base, "s", "value", 20.0),
        req(&base, "u", "value", -1.0),
    ];
    let mut evs: Vec<Box<dyn Evaluator>> = vec![
        Box::new(FullRecompute),
        Box::new(DirtyClosure::new(&base.program, base.cells.len())),
    ];
    let mut results = Vec::new();
    for ev in evs.iter_mut() {
        let mut doc = base.clone();
        let mut tick = TickOutcome::default();
        for &r in &reqs {
            let inv = cells_core::tick::invert::invert_requests(
                &doc.program,
                &doc.cells,
                doc.n_essential,
                &[r],
                &[],
            );
            let (cell, value) = inv.writes[0];
            doc.cells[cell as usize] = value;
            tick.changed.push(cell);
        }
        ev.recompute(&doc.program, &mut doc.cells, &mut tick.changed);
        assert_eq!(reference::check(&doc), None, "{}", ev.name());
        let mut changed = tick.changed.clone();
        changed.sort();
        results.push((doc.cells.clone(), changed));
    }
    assert_eq!(results[0], results[1]);
    // x depends only on c, which did not change: it must not be reported.
    assert!(!results[0].1.contains(&base.cell("x", "value").unwrap()));
}

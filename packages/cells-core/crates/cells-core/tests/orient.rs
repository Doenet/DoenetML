//! Orientation (ADR 0024, `build/orient.rs`): a binary operator writes the
//! input that leads to state, wherever it stands. Each of these requests
//! dropped while every binary operator wrote its first input, because the
//! first was a fixed value; now it lands, exactly.

mod common;

use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::set_unchecked;

fn v(doc: &Document, name: &str) -> f64 {
    doc.value(name, "value").unwrap()
}

#[test]
fn a_literal_numerator_writes_the_divisor() {
    // `10 / $n` lowers to a division of a fixed 10: `RDiv(n, 10)`.
    let mut doc =
        load(r#"<numberInput name="n" value="2"/><number name="q">10 / $n</number>"#).unwrap();
    let tick = set_unchecked(&mut doc, "q", "value", 4.0);
    assert!(tick.dropped.is_empty());
    assert_eq!(v(&doc, "n"), 2.5);
    assert_eq!(v(&doc, "q"), 4.0);
    // A quotient of 0 has no divisor; the request is dropped.
    let tick = set_unchecked(&mut doc, "q", "value", 0.0);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(v(&doc, "n"), 2.5);
}

#[test]
fn a_fixed_first_operand_gives_way_to_the_second() {
    for (op, ask, n) in [
        ("-", 1.0, 4.0),
        ("+", 9.0, 4.0),
        ("*", 12.0, 2.4),
        ("/", 0.5, 10.0),
    ] {
        let mut doc = load(&format!(
            r#"<number name="k" fixed>5</number><numberInput name="n" value="1"/><number name="r">$k {op} $n</number>"#
        ))
        .unwrap();
        let tick = set_unchecked(&mut doc, "r", "value", ask);
        assert!(tick.dropped.is_empty(), "$k {op} $n: dropped");
        assert_eq!(v(&doc, "n"), n, "$k {op} $n");
        assert_eq!(v(&doc, "r"), ask, "$k {op} $n");
    }
}

#[test]
fn min_and_max_project_onto_the_free_operand() {
    let mut doc = load(
        r#"<number name="k" fixed>5</number><numberInput name="n" value="1"/><number name="m">min($k, $n)</number>"#,
    )
    .unwrap();
    set_unchecked(&mut doc, "m", "value", 3.0);
    assert_eq!(v(&doc, "n"), 3.0);
    // Above the fixed bound, the projection writes the bound itself.
    set_unchecked(&mut doc, "m", "value", 9.0);
    assert_eq!(v(&doc, "m"), 5.0);
}

#[test]
fn where_both_operands_lead_to_state_the_first_is_written() {
    // ADR 0018: a drag of `<point x="$k $n"/>` writes `k`.
    let mut doc = load(
        r#"<number name="k">2</number><numberInput name="n" value="3"/><graph><point name="p" x="$k $n" y="0"/></graph>"#,
    )
    .unwrap();
    set_unchecked(&mut doc, "p", "x", 12.0);
    assert_eq!(v(&doc, "k"), 4.0);
    assert_eq!(v(&doc, "n"), 3.0);
}

#[test]
fn an_operator_is_turned_round_only_when_its_first_operand_leads_nowhere() {
    // Each of these is built as written: the first operand leads to state.
    let doc = load(
        r#"<numberInput name="n" value="2"/><number name="k" fixed>5</number>
           <number name="a">$n - $k</number><number name="b">$n / $k</number>"#,
    )
    .unwrap();
    let kinds: Vec<String> = doc
        .program
        .instrs
        .iter()
        .map(|i| format!("{:?}", i.op).split('(').next().unwrap().to_string())
        .collect();
    assert!(kinds.iter().any(|k| k == "Sub"), "{kinds:?}");
    assert!(kinds.iter().any(|k| k == "Div"), "{kinds:?}");
    assert!(
        !kinds.iter().any(|k| k == "RSub" || k == "RDiv"),
        "{kinds:?}"
    );
}

#[test]
fn a_components_own_table_keeps_its_order() {
    // A sequence's value is `from + (k − 1)·step` in its own table. Turned
    // round, a drag of a point at a sequence value would write `from` and
    // move every point; the table's order keeps it dropped, as the current
    // core does.
    let mut doc = load(
        r#"<numberInput name="n" value="3"/><graph><repeatForSequence name="r" length="$n" valueName="v">
             <point name="p" x="$v" y="1"/></repeatForSequence></graph>"#,
    )
    .unwrap();
    let before = doc.cells.clone();
    let p = doc.cell("r[2].p", "x").or_else(|| {
        // Address the second iteration's point by its children.
        let r = doc.component("r")?;
        let second = doc.children(r).nth(1)?;
        let cells_core::Child::Component(it) = second else {
            return None;
        };
        let point = doc.children(it).find_map(|c| match c {
            cells_core::Child::Component(k) => Some(k),
            _ => None,
        })?;
        doc.prop_cells(point, "x").map(|v| v[0])
    });
    let p = p.expect("the second point");
    let tick = cells_core::testing::request_unchecked(
        &mut doc,
        &[cells_core::Request {
            cell: p,
            value: 5.0,
        }],
    );
    assert_eq!(tick.dropped.len(), 1);
    let bits = |c: &[f64]| c.iter().map(|v| v.to_bits()).collect::<Vec<_>>();
    assert_eq!(bits(&doc.cells), bits(&before));
}

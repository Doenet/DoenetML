//! Refusal (ADR 0024, `program::refuse`): a request whose inverse would
//! write a value that reaches the requested cell along more than one path
//! is refused, and the build warns of the prop. Each refused request here
//! once landed on a wrong value that asking again moved.

use cells_core::testing::test_utils::load;
use cells_core::{Document, PointRequest, Request};

fn codes(doc: &Document) -> Vec<&'static str> {
    doc.diagnostics().iter().map(|d| d.code).collect()
}

fn drag(doc: &mut Document, name: &str, x: f64, y: f64) -> usize {
    let cells = [doc.cell(name, "x").unwrap(), doc.cell(name, "y").unwrap()];
    doc.request_points(&[PointRequest {
        cells,
        values: [x, y],
    }])
    .dropped
    .len()
}

#[test]
fn a_value_that_feeds_both_operands_is_refused_and_warned() {
    // `n * n`: the inverse would write `n` holding the other `n` still.
    let mut doc = load(
        r#"<numberInput name="n" value="2"/><graph><point name="p" x="$n * $n" y="0"/></graph>"#,
    )
    .unwrap();
    assert!(
        codes(&doc).contains(&"cells-request-reaches-its-source-twice"),
        "{:?}",
        doc.diagnostics()
    );
    let before = doc.cells.clone();
    assert_eq!(drag(&mut doc, "p", 9.0, 1.0), 1);
    assert_eq!(doc.value("n", "value"), Some(2.0));
    let bits = |c: &[f64]| c.iter().map(|v| v.to_bits()).collect::<Vec<_>>();
    assert_eq!(bits(&doc.cells), bits(&before));
}

#[test]
fn a_value_reaching_its_cell_through_another_cell_is_refused() {
    // As the golden `ops` document: `i = a + n`, with `a` computed from `n`.
    let mut doc = load(
        r#"<numberInput name="n" value="1"/><number name="a">$n + 1</number>
           <graph><point name="p" x="$a + $n" y="0"/></graph>"#,
    )
    .unwrap();
    let cell = doc.cell("p", "x").unwrap();
    let tick = doc.request(&[Request { cell, value: 7.0 }]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(doc.value("n", "value"), Some(1.0));
}

#[test]
fn values_from_different_sources_are_not_refused() {
    // ADR 0018: `<point x="$k $n"/>` writes `k`, and lands.
    let mut doc = load(
        r#"<number name="k">2</number><numberInput name="n" value="3"/><graph><point name="p" x="$k $n" y="0"/></graph>"#,
    )
    .unwrap();
    assert!(
        !codes(&doc).contains(&"cells-request-reaches-its-source-twice"),
        "{:?}",
        doc.diagnostics()
    );
    assert_eq!(drag(&mut doc, "p", 12.0, 0.0), 0);
    assert_eq!(doc.value("k", "value"), Some(4.0));
}

#[test]
fn a_chain_through_one_path_is_not_refused() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/><number name="a">$n + 1</number>
           <graph><point name="p" x="2 * $a" y="0"/></graph>"#,
    )
    .unwrap();
    assert_eq!(drag(&mut doc, "p", 10.0, 0.0), 0);
    assert_eq!(doc.value("n", "value"), Some(4.0));
}

#[test]
fn a_point_is_refused_whole_when_one_coordinate_is() {
    // The point's y alone would land; a drag moves the point together, as
    // the current core fails the whole update when one coordinate fails.
    let mut doc = load(
        r#"<numberInput name="n" value="2"/><numberInput name="m" value="0"/>
           <graph><point name="p" x="$n * $n" y="$m"/></graph>"#,
    )
    .unwrap();
    assert_eq!(drag(&mut doc, "p", 9.0, 5.0), 1);
    assert_eq!(doc.value("m", "value"), Some(0.0));
}

#[test]
fn an_operator_with_no_inverse_is_listed() {
    // ADR 0016's listing: a request reaching `pow` is dropped, and the
    // build says so.
    let mut doc =
        load(r#"<numberInput name="n" value="2"/><graph><point name="p" x="$n^2" y="0"/></graph>"#)
            .unwrap();
    assert!(
        codes(&doc).contains(&"cells-request-meets-no-inverse"),
        "{:?}",
        doc.diagnostics()
    );
    assert_eq!(drag(&mut doc, "p", 9.0, 0.0), 1);
}

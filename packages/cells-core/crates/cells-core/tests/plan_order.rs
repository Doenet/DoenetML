//! Elements are planned in the order of what reads whose plan, not the
//! document's (ADR 0027): siblings whose order cannot change their
//! meaning load to the same values in any order.

mod common;

use cells_core::testing::test_utils::load;
use cells_core::{Diagnostic, DiagnosticKind};

/// Every rotation and the reversal of `siblings`.
fn orders(siblings: &[&str]) -> Vec<String> {
    let n = siblings.len();
    let mut out: Vec<String> = (0..n)
        .map(|k| (0..n).map(|i| siblings[(i + k) % n]).collect())
        .collect();
    out.push(siblings.iter().rev().copied().collect());
    out
}

fn codes(list: &[Diagnostic]) -> Vec<(DiagnosticKind, &'static str)> {
    let mut c: Vec<_> = list.iter().map(|d| (d.kind, d.code)).collect();
    c.sort();
    c
}

/// Load `siblings` in every order of `orders`, each with the same values
/// at `probes` and the same diagnostics.
fn same_in_any_order(siblings: &[&str], probes: &[(&str, &str)]) {
    let mut first: Option<(Vec<f64>, Vec<_>)> = None;
    for source in orders(siblings) {
        let doc = load(&source).unwrap_or_else(|e| panic!("{source}: {e}"));
        let values: Vec<f64> = probes
            .iter()
            .map(|(n, p)| {
                doc.value(n, p)
                    .unwrap_or_else(|| panic!("{source}: no {n}.{p}"))
            })
            .collect();
        let found = (values, codes(doc.diagnostics()));
        match &first {
            None => first = Some(found),
            Some(f) => assert_eq!(
                (&f.0, &f.1),
                (&found.0, &found.1),
                "{source}: {:?}",
                doc.diagnostics()
            ),
        }
    }
}

#[test]
fn extends_and_copies_plan_in_any_order() {
    same_in_any_order(
        &[
            r#"<graph name="g"><point name="A" x="3" y="1"/></graph>"#,
            r#"<graph name="g2" extend="$g"/>"#,
            r#"<graph name="g3" extend="$g2"/>"#,
            r#"<graph><point name="P" x="1" y="2"/></graph>"#,
            r#"<graph><point name="Q" extend="$P" y="5"/></graph>"#,
            r#"<graph><point name="R" extend="$Q"/></graph>"#,
        ],
        &[
            ("g3.A", "x"),
            ("g2.A", "y"),
            ("Q", "x"),
            ("Q", "y"),
            ("R", "y"),
        ],
    );
}

#[test]
fn collects_and_maths_plan_in_any_order() {
    same_in_any_order(
        &[
            r#"<repeatForSequence name="r" length="2"><number>3</number></repeatForSequence>"#,
            r#"<collect name="c" from="$r" componentType="number"/>"#,
            r#"<math name="m">(3, 4)</math>"#,
            r#"<number name="n">$c[2] + 1</number>"#,
            r#"<graph><point name="P" x="$m.x" y="$c[1]"/></graph>"#,
            r#"<graph><point name="Q" extend="$m"/></graph>"#,
        ],
        &[("n", "value"), ("P", "x"), ("P", "y"), ("Q", "y")],
    );
}

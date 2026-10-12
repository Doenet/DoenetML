//! The core with engine R (math-expressions-rs) behind it: the same
//! observable behavior as engine A in `cells-core/tests/symbolic.rs`, and the
//! one difference Plan 5 measures, that R gives every recomputed expression
//! a new handle so nothing downstream is cut off.

use cells_core::testing::test_utils::dast_json;
use cells_core::{Document, LoadOptions, Request};
use cells_sym_mer::Mer;

fn load(source: &str) -> Document {
    Document::load(
        dast_json(source).as_bytes(),
        LoadOptions {
            engine: Some(Box::new(Mer::new())),
            ..Default::default()
        },
    )
    .unwrap()
    .0
}

fn req(doc: &Document, name: &str, prop: &str, value: f64) -> Request {
    Request {
        cell: doc.cell(name, prop).unwrap(),
        value,
    }
}

/// Whether the math cell `name.expr` equals `expected` under R's `equals`.
fn expr_is(doc: &Document, name: &str, expected: &str) -> bool {
    let h = doc.cells[doc.cell(name, "expr").unwrap() as usize] as u32;
    let e = doc.parse_math(expected).unwrap() as u32;
    doc.program.sym.engine.borrow_mut().equals(h, e)
}

fn runs(doc: &Document) -> u64 {
    doc.program.sym.stats.get().runs
}

#[test]
fn simplify_and_math_inputs() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/><math name="m" simplify>$n x + 2x</math><mathInput name="mi" prefill="x+1"/><math name="d" simplify>$mi + $mi</math>"#,
    );
    assert_eq!(doc.engine_name(), "R");
    assert!(expr_is(&doc, "m", "4x"));
    assert!(expr_is(&doc, "d", "2x+2"));
    doc.request(&[req(&doc, "n", "value", 3.0)]);
    assert!(expr_is(&doc, "m", "5x"));
    let h = doc.parse_math("y").unwrap();
    doc.request(&[req(&doc, "mi", "expr", h)]);
    assert!(expr_is(&doc, "d", "2y"));
    assert_eq!(cells_core::testing::reference::check(&doc), None);
}

#[test]
fn answers_and_curves() {
    let mut doc = load(
        r#"<mathInput name="mi"/><answer name="a" response="$mi">x^2+1</answer>
           <numberInput name="k" value="3"/>
           <graph xmin="-2" xmax="2"><function name="f">$k x^2</function><derivative name="df">$f</derivative></graph>"#,
    );
    let h = doc.parse_math("1+x^2").unwrap();
    doc.request(&[req(&doc, "mi", "expr", h)]);
    let a = doc.resolve_path("a").unwrap();
    doc.submit(a);
    assert_eq!(doc.value("a", "credit"), Some(1.0));
    let first = |doc: &Document, name: &str| doc.cells[doc.cell(name, "samples").unwrap() as usize];
    assert_eq!((first(&doc, "f"), first(&doc, "df")), (12.0, -12.0));
    doc.request(&[req(&doc, "k", "value", 1.0)]);
    assert_eq!((first(&doc, "f"), first(&doc, "df")), (4.0, -4.0));
}

#[test]
fn no_cutoff_without_hash_consing() {
    // A sees m's simplified expression unchanged and stops; R makes a new
    // handle, so m2 and both evaluates rerun.
    let mut doc = load(
        r#"<numberInput name="n" value="2"/><math name="m" simplify>0 $n + x</math><math name="m2" simplify>$m + 1</math>"#,
    );
    let before = runs(&doc);
    doc.request(&[req(&doc, "n", "value", 3.0)]);
    assert_eq!(runs(&doc) - before, 4);
}

/// The state the current core reached in `web/baseline/symbolic.mjs` on
/// `symchain-10` after its last keystroke and drag: mi = x^2+20, t = 1.002,
/// where it computed e2 = 20.002004 and m9 = x^2 + 2x + 20.057059036014.
#[test]
fn symchain_matches_the_current_core() {
    let src = cells_docgen::symchain(10);
    for engine in ["A", "R"] {
        let e: Box<dyn cells_sym::SymEngine> = if engine == "A" {
            Box::new(cells_sym::flat::Flat::new())
        } else {
            Box::new(Mer::new())
        };
        let mut doc = Document::load(
            dast_json(&src).as_bytes(),
            LoadOptions {
                engine: Some(e),
                ..Default::default()
            },
        )
        .unwrap()
        .0;
        let h = doc.parse_math("x^2+20").unwrap();
        doc.request(&[req(&doc, "mi", "expr", h), req(&doc, "t", "value", 1.002)]);
        assert!(
            (doc.value("e2", "value").unwrap() - 20.002004).abs() < 1e-9,
            "{engine}"
        );
        assert!(
            expr_is(&doc, "m9", "x^2 + 2x + 20.057059036014"),
            "{engine}: {}",
            doc.math_text(doc.cell("m9", "expr").unwrap())
        );
    }
}

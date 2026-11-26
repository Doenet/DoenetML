//! Function macros, `$$f(x)` (ADR 0075): the loader reads one as the
//! `<evaluate function="$f" input="x"/>` it stands for, so it evaluates
//! wherever an `<evaluate>` may stand. Inside math text (a `<math>`, an
//! attribute read as math) it is inlined when its function is a plain
//! formula, else refused where it is written, never dropped (ADR 0088,
//! `tests/inlined_evaluations.rs`).

mod common;
use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

fn codes(doc: &Document) -> Vec<&'static str> {
    doc.diagnostics().iter().map(|d| d.code).collect()
}

#[test]
fn a_function_macro_in_text_is_an_evaluation() {
    let mut doc = load(
        r#"<numberInput name="n" value="3"><label>n</label></numberInput>
           <function name="f">x^2 + 1</function>
           <p name="p">f(3) = $$f(3), f(n) = $$f($n)</p>"#,
    )
    .unwrap();
    assert!(codes(&doc).is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(text(&doc, "p"), "f(3) = 10, f(n) = 10");
    doc.request(&[req(&doc, "n", "value", 2.0)]);
    assert_eq!(text(&doc, "p"), "f(3) = 10, f(n) = 5");
}

#[test]
fn a_function_macro_inside_math_of_no_plain_formula_is_refused_where_it_is_written() {
    let doc = load(
        r#"<function name="f" domain="[0, 1]">x^2</function>
           <math name="m">$$f(2) + 1</math>"#,
    )
    .unwrap();
    let d = doc
        .diagnostics()
        .iter()
        .find(|d| d.message.contains("an evaluation inside math"))
        .expect("refused");
    assert_eq!(d.code, "cells-unsupported");
    assert!(d.node.is_some());
}

#[test]
fn a_function_macro_in_an_attributes_math_is_inlined() {
    // An attribute read as math text inlines it as a `<math>` does (ADR
    // 0088).
    let doc = load(
        r#"<function name="f">x^2</function>
           <graph><shortDescription>g</shortDescription><point name="P" x="$$f(2)" y="1"/></graph>"#,
    )
    .unwrap();
    assert!(codes(&doc).is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(v(&doc, "P", "x"), 4.0);
}

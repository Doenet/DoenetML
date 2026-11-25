//! Function macros, `$$f(x)` (ADR 0075): the loader reads one as the
//! `<evaluate function="$f" input="x"/>` it stands for, so it evaluates
//! wherever an `<evaluate>` may stand, and where an element may not (math,
//! an attribute) it is refused where it is written, never dropped.

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
fn a_function_macro_inside_math_is_refused_where_it_is_written() {
    let doc = load(
        r#"<function name="f">x^2</function>
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
fn a_function_macro_in_an_attribute_is_refused_where_it_is_written() {
    let doc = load(
        r#"<function name="f">x^2</function>
           <graph><point name="P" x="$$f(2)" y="1"/></graph>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .any(|d| d.node.is_some() && matches!(d.kind, cells_core::DiagnosticKind::Error)),
        "{:?}",
        doc.diagnostics()
    );
}

//! `<fractionInput>`: the inputs it owns (ADR 0045), typing into them, the
//! fraction they make, and the fraction input as an answer's input, as the
//! current core's `fractioninput.test.ts`.

mod common;

use cells_core::components::ComponentType;

use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_error, load_unpruned};
use cells_core::{Child, CompIdx, Document, Request};

/// The fraction input's owned inputs, numerator first.
fn boxes(doc: &Document, name: &str) -> Vec<CompIdx> {
    let fi = doc.resolve_path(name).unwrap();
    doc.children(fi)
        .filter_map(|c| match c {
            Child::Component(k) => Some(k),
            Child::Text(_) => None,
        })
        .filter(|&k| doc.component_type(k) == ComponentType::FractionInputPart)
        .collect()
}

/// Type `s` into owned input `k` of `name`, as a renderer would.
fn type_into_box(doc: &mut Document, name: &str, k: usize, s: &str) {
    let b = boxes(doc, name)[k];
    let h = doc.parse_math(s).unwrap();
    doc.request(&[Request {
        cell: doc.prop_cells(b, "expr").unwrap()[0],
        value: h,
    }]);
}

/// The expression a prop of `name` holds, as text; "" for a blank one.
fn text(doc: &Document, name: &str, prop: &str) -> String {
    let c = doc.resolve_path(name).unwrap();
    let cell = doc.prop_cells(c, prop).unwrap()[0];
    if doc.cells[cell.index()].is_nan() {
        String::new()
    } else {
        doc.math_text(cell)
    }
}

#[test]
fn it_owns_a_numerator_and_a_denominator_input() {
    // Unpruned: no renderer reads the fraction input's own props.
    let mut doc = load_unpruned(
        r#"<fractionInput name="fi"/>
<p><math extend="$fi.numerator" name="num"/> <math extend="$fi.denominator" name="den"/></p>"#,
    )
    .unwrap();
    let bs = boxes(&doc, "fi");
    assert_eq!(bs.len(), 2);
    for &b in &bs {
        assert_eq!(doc.name(b), None, "made for it, unnamed");
        assert!(doc.is_essential(doc.prop_cells(b, "expr").unwrap()[0]));
    }
    assert_eq!(text(&doc, "fi", "numerator"), "");
    type_into_box(&mut doc, "fi", 0, "2");
    type_into_box(&mut doc, "fi", 1, "3");
    assert_eq!(text(&doc, "fi", "numerator"), "2");
    assert_eq!(text(&doc, "fi", "denominator"), "3");
    assert_eq!(text(&doc, "fi", "expr"), "2/3");
    assert!((doc.value("fi", "value").unwrap() - 2.0 / 3.0).abs() < 1e-12);
    assert_eq!(text(&doc, "num", "expr"), "2");
    assert_eq!(text(&doc, "den", "expr"), "3");
    type_into_box(&mut doc, "fi", 0, "x+1");
    assert_eq!(text(&doc, "fi", "expr"), "(x + 1)/3");
    assert!(doc.value("fi", "value").unwrap().is_nan());
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn the_prefills_start_each_box() {
    let doc =
        load_unpruned(r#"<fractionInput name="fi" prefillNumerator="5" prefillDenominator="x"/>"#)
            .unwrap();
    assert_eq!(text(&doc, "fi", "numerator"), "5");
    assert_eq!(text(&doc, "fi", "denominator"), "x");
    assert_eq!(text(&doc, "fi", "expr"), "5/x");
}

#[test]
fn it_is_an_answers_input() {
    let mut doc = load(
        r#"<answer name="ans"><fractionInput name="fi"/><award><math>2/3</math></award></answer>"#,
    )
    .unwrap();
    let ans = doc.resolve_path("ans").unwrap();
    assert_eq!(
        doc.answer_inputs(ans),
        vec![doc.resolve_path("fi").unwrap()]
    );
    type_into_box(&mut doc, "fi", 0, "2");
    type_into_box(&mut doc, "fi", 1, "3");
    doc.submit(ans);
    assert_eq!(doc.value("ans", "credit"), Some(1.0));
    type_into_box(&mut doc, "fi", 0, "1");
    doc.submit(ans);
    assert_eq!(doc.value("ans", "credit"), Some(0.0));
}

/// A value bound to it is refused: a bound math input is a number here.
#[test]
fn a_bound_value_is_refused() {
    let (_, m) = load_error(r#"<fractionInput name="fi"><math>a/b</math></fractionInput>"#);
    assert!(m.contains("<fractionInput> with a value"), "{m}");
    let (code, m) =
        load_error(r#"<math name="src">2/3</math><fractionInput name="fi" bindValueTo="$src"/>"#);
    assert_eq!(code, "cells-unsupported-attribute", "{m}");
}

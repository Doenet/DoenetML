//! Symbolic instructions in the tick (ADR 0008): simplify on leaf
//! changes, mathInputs as essential math cells, answers, function curves,
//! gating, and the equal-handle cutoff of engine A.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::{req, type_into};

fn text(doc: &Document, name: &str) -> String {
    doc.math_text(doc.cell(name, "expr").unwrap())
}

/// Type `s` into a mathInput.
fn runs(doc: &Document) -> u64 {
    doc.program.sym.stats.get().runs
}

#[test]
fn simplify_reruns_when_a_numeric_leaf_changes() {
    let mut doc =
        load(r#"<numberInput name="n" value="2"/><math name="m" simplify>$n x + 2x</math>"#)
            .unwrap();
    assert_eq!(text(&doc, "m"), "4 x");
    doc.request(&[req(&doc, "n", "value", 3.0)]);
    assert_eq!(text(&doc, "m"), "5 x");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn expand_multiplies_out() {
    let doc = load(r#"<numberInput name="n" value="3"/><math name="m" expand>(x + $n)^2</math>"#)
        .unwrap();
    assert_eq!(text(&doc, "m"), "x^2 + 6 x + 9");
}

#[test]
fn unbound_math_input_is_an_essential_math_cell() {
    let mut doc =
        load(r#"<mathInput name="mi" prefill="x+1"/><math name="m" simplify>$mi + $mi</math>"#)
            .unwrap();
    assert_eq!(text(&doc, "m"), "2 x + 2");
    assert!(doc.is_essential(doc.cell("mi", "expr").unwrap()));
    type_into(&mut doc, "mi", "y");
    assert_eq!(text(&doc, "m"), "2 y");
    assert!(doc.value("mi", "value").unwrap().is_nan());
    // A number typed as a request on `value` becomes a constant expression.
    doc.request(&[req(&doc, "mi", "value", 5.0)]);
    assert_eq!(text(&doc, "mi"), "5");
    assert_eq!(doc.value("m", "value"), Some(10.0));
    // Emptied: a blank expression.
    doc.request(&[req(&doc, "mi", "value", f64::NAN)]);
    assert!(doc.value("mi", "expr").unwrap().is_nan());
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_bound_math_input_stays_numeric() {
    let mut doc =
        load(r#"<numberInput name="a" value="2"/><mathInput name="mi" bindValueTo="$a"/>"#)
            .unwrap();
    assert!(doc.value("mi", "expr").unwrap().is_nan());
    doc.request(&[req(&doc, "mi", "value", 7.0)]);
    assert_eq!(doc.value("a", "value"), Some(7.0));
}

#[test]
fn answers_check_only_on_submit() {
    let mut doc = load(
        r#"<mathInput name="mi"/><answer name="a" response="$mi">x^2+1</answer>
           <mathInput name="mi2"/><answer name="b" response="$mi2" symbolicEquality>x^2+1</answer>"#,
    )
    .unwrap();
    assert_eq!(doc.value("a", "credit"), Some(0.0));
    type_into(&mut doc, "mi", "1+x^2");
    type_into(&mut doc, "mi2", "1+x^2");
    assert_eq!(doc.value("a", "credit"), Some(0.0), "typing does not check");
    let before = runs(&doc);
    let a = doc.resolve_path("a").unwrap();
    doc.submit(a);
    assert_eq!(doc.value("a", "credit"), Some(1.0));
    assert_eq!(runs(&doc) - before, 1, "one check, nothing else reruns");
    let b = doc.resolve_path("b").unwrap();
    doc.submit(b);
    assert_eq!(
        doc.value("b", "credit"),
        Some(0.0),
        "as written, 1+x^2 is not x^2+1"
    );
    type_into(&mut doc, "mi2", "x^2+1");
    doc.submit(b);
    assert_eq!(doc.value("b", "credit"), Some(1.0));
}

#[test]
fn function_and_derivative_curves_resample_on_a_drag() {
    let mut doc = load(
        r#"<numberInput name="a" value="3"/>
           <graph xmin="-2" xmax="2"><function name="f">$a x^2</function><derivative name="df">$f</derivative></graph>"#,
    )
    .unwrap();
    let ys = |doc: &Document, name: &str| {
        let c = doc.cell(name, "samples").unwrap() as usize;
        doc.cells[c..c + cells_core::program::SAMPLES].to_vec()
    };
    let (f, df) = (ys(&doc, "f"), ys(&doc, "df"));
    assert_eq!((f[0], *f.last().unwrap()), (12.0, 12.0));
    assert_eq!((df[0], *df.last().unwrap()), (-12.0, 12.0));
    doc.request(&[req(&doc, "a", "value", 1.0)]);
    assert_eq!(ys(&doc, "f")[0], 4.0);
    assert_eq!(ys(&doc, "df")[0], -4.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn symbolic_instructions_are_gated_on_their_inputs() {
    let mut doc = load(r#"<numberInput name="a" value="1"/><numberInput name="b" value="1"/><math name="m" simplify>$a x + x</math>"#).unwrap();
    let before = runs(&doc);
    doc.request(&[req(&doc, "b", "value", 2.0)]);
    assert_eq!(
        runs(&doc),
        before,
        "an unrelated drag runs no symbolic work"
    );
    doc.request(&[req(&doc, "a", "value", 2.0)]);
    assert_eq!(runs(&doc) - before, 2, "instantiate and evaluate");
}

#[test]
fn equal_handles_stop_downstream_reruns() {
    // `0 $n` vanishes under simplify, so m's expression does not change.
    let mut doc = load(r#"<numberInput name="n" value="2"/><math name="m" simplify>0 $n + x</math><math name="m2" simplify>$m + 1</math>"#).unwrap();
    let before = runs(&doc);
    let tick = doc.request(&[req(&doc, "n", "value", 3.0)]);
    assert_eq!(
        runs(&doc) - before,
        1,
        "only m reruns; its handle is unchanged"
    );
    assert_eq!(tick.changed, vec![doc.cell("n", "value").unwrap()]);
}

#[test]
fn math_to_number_to_math() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="x^2"/>
           <numberInput name="t" value="2"/>
           <evaluate name="e" function="$mi" input="$t"/>
           <math name="m" simplify>$e x + $mi</math>"#,
    )
    .unwrap();
    assert_eq!(doc.value("e", "value"), Some(4.0));
    assert_eq!(text(&doc, "m"), "x^2 + 4 x");
    type_into(&mut doc, "mi", "x^3");
    assert_eq!(text(&doc, "m"), "x^3 + 8 x");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_copy_of_a_symbolic_math_shares_its_cell() {
    let doc = load(
        r#"<numberInput name="n" value="2"/><math name="m">$n x</math><math name="c">$m</math>"#,
    )
    .unwrap();
    assert_eq!(doc.cell("c", "expr"), doc.cell("m", "expr"));
}

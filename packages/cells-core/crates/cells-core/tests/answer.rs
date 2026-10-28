//! The forms of `<answer>` (`compile/answer.rs`): which input is the
//! response, what a submit does, how awards combine, and what is refused.

mod common;

use cells_core::CompIdx;
use cells_core::Document;
use cells_core::components::{ComponentType, prop};
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_error};
use common::{set, type_into};

fn submit(doc: &mut Document, answer: &str) {
    let a = doc.resolve_path(answer).unwrap();
    doc.submit(a);
}

fn credit(doc: &Document, answer: &str) -> f64 {
    doc.value(answer, "credit").unwrap()
}

/// The inputs an answer reads, by component index.
fn inputs(doc: &Document, answer: &str) -> Vec<CompIdx> {
    doc.answer_inputs(doc.resolve_path(answer).unwrap())
}

#[test]
fn response_attribute_names_the_input() {
    let mut doc =
        load(r#"<mathInput name="mi"/><answer name="a" response="$mi">x+1</answer>"#).unwrap();
    assert_eq!(credit(&doc, "a"), 0.0);
    assert_eq!(inputs(&doc, "a"), vec![doc.resolve_path("mi").unwrap()]);
    type_into(&mut doc, "mi", "1+x");
    assert_eq!(credit(&doc, "a"), 0.0, "typing does not check");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 1.0);
    assert_eq!(doc.value("a", "numSubmissions"), Some(1.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_bare_answer_owns_an_implicit_math_input() {
    let mut doc = load(r#"<answer name="a">2x</answer>"#).unwrap();
    let a = doc.resolve_path("a").unwrap();
    let ins = doc.answer_inputs(a);
    assert_eq!(ins.len(), 1);
    let mi = ins[0];
    assert_eq!(doc.component_type(mi), ComponentType::MathInput);
    assert_eq!(
        doc.parent(mi),
        Some(a),
        "the input renders inside the answer"
    );
    assert_eq!(doc.name(mi), None);
    assert!(
        doc.is_essential(doc.comp_cells(mi)[prop::math_input::EXPR]),
        "an unbound input"
    );
    // Type into it by cell, as a renderer would.
    let h = doc.parse_math("x*2").unwrap();
    doc.request(&[cells_core::Request {
        cell: doc.comp_cells(mi)[prop::math_input::EXPR],
        value: h,
    }]);
    assert_eq!(credit(&doc, "a"), 0.0);
    doc.submit(a);
    assert_eq!(credit(&doc, "a"), 1.0);
    assert_eq!(
        doc.math_text(doc.comp_cells(a)[prop::answer::SUBMITTED]),
        "x * 2"
    );
    assert_eq!(doc.value("a", "numSubmissions"), Some(1.0));
    doc.submit(a);
    assert_eq!(doc.value("a", "numSubmissions"), Some(2.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_explicit_input_child_is_the_response() {
    let mut doc = load(r#"<answer name="a"><mathInput name="mi"/>x^2</answer>"#).unwrap();
    let mi = doc.resolve_path("mi").unwrap();
    assert_eq!(inputs(&doc, "a"), vec![mi]);
    assert_eq!(doc.parent(mi), Some(doc.resolve_path("a").unwrap()));
    type_into(&mut doc, "mi", "x^2");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 1.0);
    type_into(&mut doc, "mi", "x^3");
    assert_eq!(credit(&doc, "a"), 1.0, "credit waits for the next submit");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 0.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn awards_with_content_take_the_most_credited() {
    let mut doc = load(
        r#"<answer name="a"><award>x+y</award><award credit="0.5">x</award><award credit="0.25" symbolicEquality>y+x</award></answer>"#,
    )
    .unwrap();
    let a = doc.resolve_path("a").unwrap();
    let mi = doc.answer_inputs(a)[0];
    assert_eq!(doc.component_type(mi), ComponentType::MathInput);
    let typed = |doc: &mut Document, s: &str| {
        let h = doc.parse_math(s).unwrap();
        let cell = doc.comp_cells(mi)[prop::math_input::EXPR];
        doc.request(&[cells_core::Request { cell, value: h }]);
        doc.submit(a);
        credit(doc, "a")
    };
    assert_eq!(typed(&mut doc, "x"), 0.5);
    assert_eq!(typed(&mut doc, "y+x"), 1.0);
    assert_eq!(typed(&mut doc, "z"), 0.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_when_award_reads_the_submitted_response() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
           <answer name="a"><award><when>$mi = x^2+1</when></award><award credit="0.5"><when>$mi = x^2</when></award></answer>"#,
    )
    .unwrap();
    let a = doc.resolve_path("a").unwrap();
    let mi = doc.resolve_path("mi").unwrap();
    assert_eq!(doc.answer_inputs(a), vec![mi]);
    // No implicit input: the awards name theirs.
    assert!(
        doc.children(a)
            .all(|c| !matches!(c, cells_core::Child::Component(k) if doc.component_type(k) == ComponentType::MathInput))
    );
    assert_eq!(credit(&doc, "a"), 0.0);
    type_into(&mut doc, "mi", "1+x^2");
    assert_eq!(credit(&doc, "a"), 0.0, "typing does not check");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 1.0);
    type_into(&mut doc, "mi", "x^2");
    assert_eq!(credit(&doc, "a"), 1.0, "credit waits for the next submit");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 0.5);
    type_into(&mut doc, "mi", "x");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 0.0);
    assert_eq!(doc.value("a", "numSubmissions"), Some(3.0));
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_when_award_compares_as_written_under_symbolic_equality() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
           <answer name="a"><award symbolicEquality><when>$mi = x^2+1</when></award></answer>
           <answer name="b" symbolicEquality simplifyOnCompare><award><when>$mi = x^2+1</when></award></answer>"#,
    )
    .unwrap();
    type_into(&mut doc, "mi", "1+x^2");
    submit(&mut doc, "a");
    submit(&mut doc, "b");
    assert_eq!(credit(&doc, "a"), 0.0, "as written, 1+x^2 is not x^2+1");
    assert_eq!(credit(&doc, "b"), 1.0, "simplified first, they agree");
}

#[test]
fn a_numeric_when_compares_the_submitted_value() {
    let mut doc = load(
        r#"<mathInput name="mi"/><numberInput name="n" value="3"/>
           <answer name="a"><award><when>$mi > $n</when></award></answer>"#,
    )
    .unwrap();
    type_into(&mut doc, "mi", "5");
    assert_eq!(credit(&doc, "a"), 0.0);
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 1.0);
    // The other side of the comparison is live.
    set(&mut doc, "n", "value", 7.0);
    assert_eq!(credit(&doc, "a"), 0.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_when_over_two_inputs_submits_both() {
    let mut doc = load(
        r#"<mathInput name="x"/><mathInput name="y"/>
           <answer name="a"><award><when>$x + $y = 3</when></award></answer>"#,
    )
    .unwrap();
    let a = doc.resolve_path("a").unwrap();
    assert_eq!(
        doc.answer_inputs(a),
        vec![
            doc.resolve_path("x").unwrap(),
            doc.resolve_path("y").unwrap()
        ]
    );
    assert_eq!(doc.answer_responses(a).len(), 2);
    type_into(&mut doc, "x", "1");
    type_into(&mut doc, "y", "2");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 1.0);
    type_into(&mut doc, "y", "5");
    assert_eq!(credit(&doc, "a"), 1.0);
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 0.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_explicit_input_child_can_be_named_by_a_when() {
    let mut doc = load(
        r#"<answer name="a"><mathInput name="mi"/><award><when>$mi = 4</when></award></answer>"#,
    )
    .unwrap();
    let a = doc.resolve_path("a").unwrap();
    let mi = doc.resolve_path("mi").unwrap();
    assert_eq!(doc.answer_inputs(a), vec![mi]);
    type_into(&mut doc, "mi", "4");
    submit(&mut doc, "a");
    assert_eq!(credit(&doc, "a"), 1.0);
}

#[test]
fn answers_with_awards_count_in_the_document_credit() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
           <answer name="a"><award credit="0.5"><when>$mi = 1</when></award></answer>
           <answer name="b">2</answer>"#,
    )
    .unwrap();
    let total = |doc: &Document| doc.cells[doc.comp_cells(doc.root)[0].index()];
    assert_eq!(total(&doc), 0.0);
    type_into(&mut doc, "mi", "1");
    submit(&mut doc, "a");
    assert_eq!(total(&doc), 0.25);
}

#[test]
fn unsupported_answer_forms_are_refused() {
    let refused = |src: &str, what: &str| {
        let (code, m) = load_error(src);
        assert!(
            matches!(code, "cells-unsupported" | "doenet-e0002") && m.contains(what),
            "{src}: {code} {m}"
        );
    };
    refused(
        r#"<answer name="a" type="text">hello</answer>"#,
        "type=\"text\"",
    );
    refused(
        r#"<answer name="a" type="boolean">true</answer>"#,
        "type=\"boolean\"",
    );
    refused(
        r#"<answer name="a" matchPartial>x</answer>"#,
        "matchPartial",
    );
    refused(
        r#"<answer name="a"><award feedback="good">x</award></answer>"#,
        "feedback",
    );
    refused(r#"<answer name="a"><choice>x</choice></answer>"#, "choice");
    refused(r#"<answer name="a"><textInput/>x</answer>"#, "textInput");
    refused(
        r#"<mathInput name="mi"/><answer name="a"><award><when><math>$mi</math> = x</when></award></answer>"#,
        "math",
    );
    refused(r#"<answer name="a"/>"#, "nothing to check");
    refused(r#"<award>x</award>"#, "outside an <answer>");
    refused(
        r#"<answer name="a"><award><when>1=1</when>x</award></answer>"#,
        "both",
    );
}

// The value type of an answer's props follows its form: a choice answer's
// `submitted` is an index, not an expression, so a math reading it is
// numeric rather than an `Evaluate` of handle 0 (a panic, once).
#[test]
fn a_math_of_a_choice_answers_submitted_is_a_number() {
    let mut doc = load(
        r#"<answer name="a"><choiceInput name="ci">
  <choice credit="1">cat</choice><choice>dog</choice>
</choiceInput></answer>
<math name="mm">$a.submitted</math>"#,
    )
    .unwrap();
    set(&mut doc, "ci", "selectedIndex", 2.0);
    submit(&mut doc, "a");
    assert_eq!(doc.value("mm", "value"), Some(2.0));
}

// A text answer's response is a string id: refused inside math and as an
// operator's input, as `$t` of a `<text>` is, never computed with.
#[test]
fn a_text_answers_response_is_not_a_number() {
    let doc = load(
        r#"<answer name="a" type="text"><textInput name="ti" prefill="hello"/><award>yes</award></answer>
<number name="n">$a.response + 1</number>
<boolean name="b">$a.response > 3</boolean>"#,
    )
    .unwrap();
    let errors: Vec<&str> = doc
        .diagnostics()
        .iter()
        .filter(|d| d.kind == cells_core::DiagnosticKind::Error)
        .map(|d| d.message.as_str())
        .collect();
    assert_eq!(
        errors,
        ["unsupported: a text value ($a.response) inside math"; 2]
    );
}

// Placed in a paragraph, a text answer's response shows as its text.
#[test]
fn a_placed_text_response_renders_its_text() {
    let doc = load(
        r#"<answer name="a" type="text"><textInput name="ti" prefill="hello"/><award>yes</award></answer>
<p name="p1">$a.response</p>"#,
    )
    .unwrap();
    assert_eq!(doc.rendered_text(doc.component("p1").unwrap()), "hello");
}

// Every form of answer reads a referenced `weight` the same way.
#[test]
fn a_referenced_weight_reaches_choice_and_text_answers() {
    let doc = load(
        r#"<number name="w">3</number>
<answer name="c" weight="$w"><choiceInput><choice credit="1">cat</choice><choice>dog</choice></choiceInput></answer>
<answer name="t" type="text" weight="$w"><textInput/><award>yes</award></answer>"#,
    )
    .unwrap();
    assert_eq!(doc.value("c", "weight"), Some(3.0));
    assert_eq!(doc.value("t", "weight"), Some(3.0));
}

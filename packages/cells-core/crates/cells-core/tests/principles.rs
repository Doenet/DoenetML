//! Cases that pin a DoenetML principle (Doenet/DoenetML,
//! `docs/principles/`), each named by the principle's id. A construction
//! the core cannot honor is a diagnostic, never a wrong value.

mod common;
use common::*;

use cells_core::testing::test_utils::{load, load_error};
use cells_core::{DiagnosticKind, Document};

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

/// COMP-1: content inside math is read as written there, so an element
/// child math cannot read is refused rather than dropped.
#[test]
fn comp_1_an_element_inside_math_is_refused_not_dropped() {
    for src in [
        r#"<math name="m">2 <group>3</group></math>"#,
        r#"<math name="m">2<number>3</number></math>"#,
        r#"<number name="m">2 <group>3</group></number>"#,
    ] {
        let (code, message) = load_error(src);
        assert_eq!(code, "cells-unsupported", "{src}");
        assert!(message.contains("inside math"), "{src}: {message}");
    }
    // A label is presentation, not content.
    let doc = load(r#"<graph><point name="P">(1,2)<label>A</label></point></graph>"#).unwrap();
    assert_eq!(v(&doc, "P", "x"), 1.0);
}

/// COMP-5: an iteration's value and index cannot share a name; the load
/// says so instead of failing.
#[test]
fn comp_5_value_name_and_index_name_must_differ() {
    let (code, message) = load_error(
        r#"<repeatForSequence from="1" to="2" valueName="v" indexName="v">$v</repeatForSequence>"#,
    );
    assert_eq!(code, "cells-bad-attribute-value");
    assert!(message.contains("valueName"), "{message}");
}

/// REF-7: an extend is the same component again. An extend of a repeat or
/// of an answer is not built that way yet, so it is refused, not built
/// empty or as a second answer.
#[test]
fn ref_7_extends_of_a_repeat_or_an_answer_are_refused() {
    let (code, _) = load_error(
        r#"<repeatForSequence name="r" from="1" to="3" valueName="v"><number>$v</number></repeatForSequence>
           <repeatForSequence name="b" extend="$r"/>"#,
    );
    assert_eq!(code, "cells-banned");
    for extend in [
        r#"<answer name="b" extend="$a"/>"#,
        r#"<answer name="b" extend="$a"><award><when>$mi = y</when></award></answer>"#,
    ] {
        let (code, message) = load_error(&format!(
            r#"<mathInput name="mi"/><answer name="a"><award><when>$mi = x</when></award></answer>{extend}"#
        ));
        assert_eq!(code, "cells-banned", "{extend}");
        assert!(message.contains("<answer>"), "{message}");
    }
}

/// REF-5: a boolean extends only a boolean value; of a number or a text it
/// is refused, where it read the cell as a boolean.
#[test]
fn ref_5_a_boolean_extends_only_a_boolean() {
    for src in [
        r#"<number name="n">3</number><boolean name="b" extend="$n"/>"#,
        r#"<text name="s">true</text><boolean name="b" extend="$s"/>"#,
    ] {
        assert_eq!(load_error(src).0, "cells-extend-type-mismatch", "{src}");
    }
    let mut doc =
        load(r#"<booleanInput name="bi"/><boolean name="b" extend="$bi"/><p name="p">$b</p>"#)
            .unwrap();
    assert_eq!(text(&doc, "p"), "false");
    set(&mut doc, "bi", "value", 1.0);
    assert_eq!(text(&doc, "p"), "true");
}

/// REF-3, REF-6: an attribute written on an extend of a math replaces the
/// referent's and inherits the rest, its expression among them, planned
/// where the referent sits.
#[test]
fn ref_3_an_attribute_on_a_math_extend_keeps_the_referents_expression() {
    let doc = load(
        r#"<section name="A"><number name="n">1</number><math name="m">x+$n</math></section>
           <section name="T"><number name="n">2</number>
             <math name="e" extend="$A.m" displayDecimals="3"/>
             <p name="p">$e</p>
           </section>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "T.p"), "x + 1");
}

/// REF-10: settings that control how content is read apply to an
/// extend's reading of the referent's text.
#[test]
fn ref_10_a_math_extend_reads_the_referents_text_with_its_own_settings() {
    let doc = load(
        r#"<math name="m" simplify>x+x</math><math name="e" extend="$m" simplify="none"/>
           <p name="p">$m; $e</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "2 x; x + x");
}

/// CTX-1, CTX-7: a fixed extend of a math follows its referent and takes
/// no write.
#[test]
fn ctx_1_a_fixed_math_extend_follows_its_referent() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
           <math name="m">$n+1</math>
           <math name="f" extend="$m" fixed/>
           <p name="p">$f</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "2");
    set(&mut doc, "n", "value", 4.0);
    assert_eq!(text(&doc, "p"), "5");
    assert_eq!(set(&mut doc, "f", "value", 9.0).dropped.len(), 1);
    assert_eq!(v(&doc, "n", "value"), 4.0);
}

/// VAL-7, TYPE-5: an attribute read as written takes no reference; one
/// written with a reference is refused, where it was read as absent.
#[test]
fn val_7_a_literal_only_attribute_refuses_a_reference() {
    for src in [
        r#"<booleanInput name="b"/><math simplify="$b">x+x</math>"#,
        r#"<text name="t">hi</text><textInput prefill="$t"/>"#,
        r#"<text name="t">number</text><selectFromSequence type="$t" from="1" to="3"/>"#,
    ] {
        let (code, message) = load_error(src);
        assert_eq!(code, "cells-banned", "{src}");
        assert!(message.contains("literal"), "{src}: {message}");
    }
}

/// VAL-8: a flag given as an expression is not read as a bare (true)
/// attribute; it is refused until the core recomputes one.
#[test]
fn val_8_a_flag_written_as_an_expression_is_refused() {
    let (code, message) = load_error(
        r#"<numberInput name="a" value="3"/><graph><point name="P" hide="$a - 3">(1,2)</point></graph>"#,
    );
    assert_eq!(code, "cells-banned");
    assert!(message.contains("hide"), "{message}");
    // One reference is still bound.
    let mut doc =
        load(r#"<booleanInput name="b"/><graph><point name="P" hide="$b">(1,2)</point></graph>"#)
            .unwrap();
    assert_eq!(v(&doc, "P", "hide"), 0.0);
    set(&mut doc, "b", "value", 1.0);
    assert_eq!(v(&doc, "P", "hide"), 1.0);
}

/// NAME-0: a keyword in an attribute's value can be written in any case.
#[test]
fn name_0_a_keyword_value_is_matched_in_any_case() {
    let doc =
        load(r#"<booleanInput name="b" value="TRUE"/><booleanInput name="c" value="False"/>"#)
            .unwrap();
    assert_eq!(v(&doc, "b", "value"), 1.0);
    assert_eq!(v(&doc, "c", "value"), 0.0);
}

/// INT-2: what a reader writes into one math stays there. Two equal
/// literal maths are two values, not one shared cell.
#[test]
fn int_2_equal_literal_maths_are_written_apart() {
    let mut doc = load(
        r#"<math name="a">1</math><math name="b">1</math>
           <mathInput name="ia" bindValueTo="$a"/><mathInput name="ib" bindValueTo="$b"/>
           <p name="pa">$a</p><p name="pb">$b</p>"#,
    )
    .unwrap();
    set(&mut doc, "ia", "value", 5.0);
    assert_eq!(
        (text(&doc, "pa"), text(&doc, "pb")),
        ("5".into(), "1".into())
    );
}

/// DIAG-5: an error does not stop the rest of the document. An attribute
/// nothing reads on the root cannot box it, so it is a warning.
#[test]
fn diag_5_an_unread_attribute_on_the_document_is_a_warning() {
    let doc = load(r#"<document foo="1"><p name="p">hi</p></document>"#).unwrap();
    assert_eq!(text(&doc, "p"), "hi");
    let d = doc
        .diagnostics()
        .iter()
        .find(|d| d.code == "cells-unsupported-attribute")
        .expect("a diagnostic for foo");
    assert_eq!(d.kind, DiagnosticKind::Warning);
}

/// DIAG-5, NAME-7 (D14): a cycle is an error on a component it runs
/// through, which is boxed; the rest of the document renders.
#[test]
fn diag_5_a_cycle_boxes_its_component_and_the_rest_renders() {
    let doc = load(
        r#"<number name="a">$b</number><number name="b">$a</number>
           <p name="p">still here</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "still here");
    let cycle = doc
        .diagnostics()
        .iter()
        .find(|d| d.code == "doenet-e0005")
        .expect("the cycle is reported");
    assert_eq!(cycle.kind, DiagnosticKind::Error);
    assert!(cycle.node.is_some(), "located where the author wrote it");
}

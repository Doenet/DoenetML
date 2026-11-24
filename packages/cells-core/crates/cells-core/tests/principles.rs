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

/// VAL-5, NAME-1 (D37): a reference that names nothing (an unknown name,
/// an ambiguous one, a property the type does not have) is a warning, and
/// the element it is in still builds, holding the missing value.
#[test]
fn val_5_a_reference_that_names_nothing_is_a_warning_and_a_blank() {
    let doc = load(
        r#"<section><number name="n">1</number></section><section><number name="n">2</number></section>
           <graph><point name="P" x="$typo" y="2"/></graph>
           <p name="unknown">[$typo]</p><p name="ambiguous">[$n]</p><p name="prop">[$P.nothere]</p>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.kind != DiagnosticKind::Error),
        "{:?}",
        doc.diagnostics()
    );
    for (code, n) in [("doenet-w0104", 2), ("doenet-w0105", 1)] {
        assert_eq!(
            doc.diagnostics().iter().filter(|d| d.code == code).count(),
            n,
            "{code}"
        );
    }
    for name in ["unknown", "ambiguous", "prop"] {
        assert_eq!(text(&doc, name), "[＿]", "{name}");
    }
    // The point is there, its x missing and its y its own.
    assert!(cells_core::program::is_missing(v(&doc, "P", "x")));
    assert_eq!(v(&doc, "P", "y"), 2.0);
}

/// VAL-5, D40: missing is not NaN. A number or a boolean made from a
/// missing value is missing; a math holds the blank; a comparison with one
/// is false; NaN stays for a computation that has no value.
#[test]
fn val_5_missing_propagates_and_is_not_nan() {
    use cells_core::program::is_missing;
    let doc = load(
        r#"<numberList name="l">1 2</numberList><booleanList name="bl">true</booleanList>
           <number name="sum">$l[5] + 3</number>
           <number name="nan">0/0</number>
           <boolean name="and">$bl[3] and true</boolean>
           <boolean name="eq">$l[5] = $l[5]</boolean>
           <p name="math"><math>x + $l[5]</math></p>
           <p name="texts"><number>$l[5]</number> <number>0/0</number></p>"#,
    )
    .unwrap();
    assert!(is_missing(v(&doc, "sum", "value")));
    let nan = v(&doc, "nan", "value");
    assert!(nan.is_nan() && !is_missing(nan));
    assert!(is_missing(v(&doc, "and", "value")));
    assert_eq!(v(&doc, "eq", "value"), 0.0);
    assert_eq!(text(&doc, "math"), "x + ＿");
    assert_eq!(text(&doc, "texts"), "＿ NaN");
}

/// VAL-5: a missing value never equals anything, so an award comparing
/// one earns no credit.
#[test]
fn val_5_a_missing_value_earns_no_credit() {
    let mut doc = load(
        r#"<numberList name="l">1</numberList>
           <answer name="a"><award><when>$l[5] = $l[5]</when></award></answer>"#,
    )
    .unwrap();
    doc.submit(doc.resolve_path("a").unwrap());
    assert_eq!(v(&doc, "a", "creditAchieved"), 0.0);
}

/// VAL-5, D40: a math holds the blank, a lowered one too (ADR 0005): its
/// expression is made, in the order written, while its value is missing,
/// and goes when the value comes back.
#[test]
fn val_5_a_lowered_math_shows_the_blank_in_its_expression() {
    let mut doc = load(
        r#"<numberList name="l">1 2</numberList><numberInput name="k" value="7"/>
           <p name="a"><math>$l[5]+1</math></p>
           <p name="b"><math>1 + $l[5]</math></p>
           <p name="c"><math>2 $l[$k] - 3</math></p>
           <p name="calls"><math>round($l[5]) + 1</math>; <math>floor($l[5] + 1)</math>;
             <math>min($l[5], 3)</math>; <math>max(1, $l[5], 4)</math></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "a"), "＿ + 1");
    assert_eq!(text(&doc, "b"), "1 + ＿");
    assert_eq!(text(&doc, "c"), "2 ＿ - 3");
    // The functions numeric math calls show the blank too.
    assert_eq!(
        text(&doc, "calls")
            .split_whitespace()
            .collect::<Vec<_>>()
            .join(" "),
        "round(＿) + 1; floor(＿ + 1); min(＿, 3); max(1, ＿, 4)"
    );
    set(&mut doc, "k", "value", 2.0);
    assert_eq!(text(&doc, "c"), "1");
}

/// TYPE, VAL-3: a text read where a number or a boolean is wanted never
/// reads its string id as the number; until the tick can convert text, it
/// is refused.
#[test]
fn type_a_text_is_never_read_as_its_string_id() {
    for src in [
        r#"<text name="t">hi</text><number name="n">$t</number>"#,
        r#"<text name="t">3</text><number name="n">$t</number>"#,
    ] {
        let (code, message) = load_error(src);
        assert_eq!(code, "cells-unsupported", "{src}");
        assert!(message.contains("text value"), "{src}: {message}");
    }
}

/// D36, TYPE: a tuple with a free symbol is a math, not a point whose
/// coordinate is a NaN.
#[test]
fn type_a_tuple_with_a_symbol_is_a_math() {
    let doc = load(r#"<math name="m">(x, 1)</math><math name="m3">(x, 1, 2)</math>"#).unwrap();
    assert_eq!(text(&doc, "m"), "(x, 1)");
    assert_eq!(text(&doc, "m3"), "(x, 1, 2)");
}

/// DIAG-1: a reference to a point compared in a condition is checked at
/// load like any reference inside math, so the document loads with a
/// located diagnostic instead of a build finding an error the load missed.
/// (VAL-3 asks that it compare the coordinates: ADR 0064.)
#[test]
fn diag_1_a_point_in_a_condition_is_checked_at_load() {
    for src in [
        r#"<point name="P">(1,2)</point><boolean name="b">$P = (1,2)</boolean>"#,
        r#"<math name="m">(1,2)</math><boolean name="b">$m = (1,2)</boolean>"#,
    ] {
        let (code, _) = load_error(src);
        assert_eq!(code, "cells-bad-math", "{src}");
    }
}

/// The warnings a document's load gave with `code`.
fn warned(doc: &Document, code: &str) -> usize {
    doc.diagnostics().iter().filter(|d| d.code == code).count()
}

/// Whether `name.prop` holds the missing value (VAL-5, ADR 0046).
fn missing(doc: &Document, name: &str, prop: &str) -> bool {
    cells_core::program::is_missing(v(doc, name, prop))
}

/// D47 decision 3: a boolean is 1 or 0 only where the author asks
/// (`convertBoolean`); read as a number anywhere else it is a type mix, a
/// blank in its place and a warning at load.
#[test]
fn d47_a_boolean_is_not_a_number() {
    let doc = load(
        r#"<boolean name="b">true</boolean><booleanInput name="bi"/>
           <math name="m">$b + 1</math><number name="n">$b</number><math name="mb">$bi + 1</math>
           <number name="c" convertBoolean>$b</number><number name="c2" convertBoolean>$b + 1</number>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "m"), "＿ + 1");
    assert!(missing(&doc, "n", "value"));
    assert_eq!(text(&doc, "mb"), "＿ + 1");
    assert_eq!(v(&doc, "c", "value"), 1.0);
    assert_eq!(v(&doc, "c2", "value"), 2.0);
    assert_eq!(warned(&doc, "cells-type-mix"), 3);
}

/// D47 decision 4, D68: a number, a math or a text is not true or false;
/// read as one it is a type mix. A comparison decides a boolean.
#[test]
fn d47_d68_a_number_or_a_text_is_not_a_boolean() {
    let doc = load(
        r#"<number name="n">2</number><text name="t">true</text><boolean name="b">true</boolean>
           <boolean name="bn">$n</boolean><boolean name="lit">1</boolean><boolean name="bt">$t</boolean>
           <boolean name="b1">$b = 1</boolean><boolean name="arith">$b + 1 = 2</boolean>
           <boolean name="and">$b and $n</boolean>
           <boolean name="cmp">$n != 0</boolean><boolean name="tcmp">$t = true</boolean>
           <boolean name="bb">$b = true</boolean><boolean name="nb">not $b</boolean>"#,
    )
    .unwrap();
    for name in ["bn", "lit", "bt", "b1", "arith", "and"] {
        assert!(missing(&doc, name, "value"), "{name}");
    }
    assert_eq!(warned(&doc, "cells-type-mix"), 6);
    assert_eq!(v(&doc, "cmp", "value"), 1.0);
    assert_eq!(v(&doc, "tcmp", "value"), 1.0);
    assert_eq!(v(&doc, "bb", "value"), 1.0);
    assert_eq!(v(&doc, "nb", "value"), 0.0);
}

/// D58: a text ordered against a number can never hold: missing, with a
/// warning of its own. `=` compares texts as before.
#[test]
fn d58_a_text_ordered_against_a_number_is_a_type_mix() {
    let doc = load(
        r#"<text name="t">10</text><number name="n">2</number>
           <boolean name="gt">$t > $n</boolean><boolean name="eq">$t = 10</boolean>"#,
    )
    .unwrap();
    assert!(missing(&doc, "gt", "value"));
    assert_eq!(warned(&doc, "cells-type-mix-order"), 1);
    assert_eq!(v(&doc, "eq", "value"), 1.0);
}

/// REF-5, D26: an input is not the value it holds, so one made from a value
/// is refused, suggesting `bindValueTo` or `prefill`. A value made from an
/// input is its value (REF-1a).
#[test]
fn ref_5_an_input_is_not_made_from_a_value() {
    for src in [
        r#"<math name="m">3</math><mathInput name="mi" extend="$m"/>"#,
        r#"<number name="n">3</number><mathInput name="mi" extend="$n"/>"#,
        r#"<text name="t">a</text><textInput name="ti" extend="$t"/>"#,
    ] {
        let (code, message) = load_error(src);
        assert_eq!(code, "cells-input-from-value", "{src}");
        assert!(
            message.contains("bindValueTo") && message.contains("prefill"),
            "{message}"
        );
    }
    let doc = load(r#"<mathInput name="mi" prefill="2"/><math name="m" extend="$mi"/>"#).unwrap();
    assert_eq!(text(&doc, "m"), "2");
}

//! More of `<answer>`'s forms (ADR 0077): numbers matched within an
//! allowed error, an award that extends another, several awards credited,
//! a boolean answer, a label for the input an answer makes, which
//! references are responses, credits held from 0 to 1, and what a choice
//! input says of the choice chosen.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_error, load_unpruned};
use common::{set, type_into};

fn credit_for(doc: &mut Document, input: &str, answer: &str, response: &str) -> f64 {
    type_into(doc, input, response);
    let a = doc.resolve_path(answer).unwrap();
    doc.submit(a);
    doc.value(answer, "credit").unwrap()
}

#[test]
fn numbers_match_within_the_allowed_error() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
    <answer name="rel" response="$mi" allowedErrorInNumbers="0.001">log(32x+c)</answer>
    <answer name="abs" response="$mi" allowedErrorInNumbers="0.001" allowedErrorIsAbsolute>log(32x+c)</answer>
    <answer name="when"><award allowedErrorInNumbers="0.001"><when>$mi = log(32x+c)</when></award></answer>"#,
    )
    .unwrap();
    let all =
        |doc: &mut Document, r: &str| ["rel", "abs", "when"].map(|a| credit_for(doc, "mi", a, r));
    assert_eq!(all(&mut doc, "log(32x+c)"), [1.0; 3]);
    // Relative 0.0003: within 0.001 relative, not absolute.
    assert_eq!(all(&mut doc, "log(32.01x+c)"), [1.0, 0.0, 1.0]);
    assert_eq!(all(&mut doc, "log(32.0005x+c)"), [1.0; 3]);
    assert_eq!(all(&mut doc, "log(32.1x+c)"), [0.0; 3]);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn as_written_a_constant_is_its_float() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
    <answer name="a" response="$mi" symbolicEquality allowedErrorInNumbers="0.001">
        2.15234262pi+e*25.602348230
    </answer>"#,
    )
    .unwrap();
    assert_eq!(
        credit_for(&mut doc, "mi", "a", "2.15234262pi+e*25.602348230"),
        1.0
    );
    assert_eq!(
        credit_for(&mut doc, "mi", "a", "2.152*3.142+2.718*25.6"),
        1.0
    );
    // Reordering is no match as written.
    assert_eq!(
        credit_for(&mut doc, "mi", "a", "pi*2.15234262+e*25.602348230"),
        0.0
    );
}

#[test]
fn an_award_extends_another_with_its_own_attributes() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
    <answer name="ans" response="$mi">
      <award allowedErrorInNumbers="0.00001" name="aw">log(32x+c)</award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.0001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.001" />
    </answer>"#,
    )
    .unwrap();
    for (r, c) in [
        ("log(32x+c)", 1.0),
        ("log(32.04x+c)", 0.0),
        ("log(32.01x+c)", 0.6),
        ("log(32.001x+c)", 0.8),
        ("log(32.0001x+c)", 1.0),
    ] {
        assert_eq!(credit_for(&mut doc, "mi", "ans", r), c, "{r}");
    }
}

#[test]
fn an_award_extends_only_what_it_can() {
    let refused = |src: &str, what: &str| {
        let (code, m) = load_error(src);
        assert!(
            code == "cells-unsupported" && m.contains(what),
            "{src}: {code} {m}"
        );
    };
    refused(
        r#"<mathInput name="mi"/><answer><award name="aw"><when>$mi=x</when></award><award extend="$aw" credit="0.5"/></answer>"#,
        "with a <when>",
    );
    refused(
        r#"<answer><award name="aw">x</award><award extend="$aw">y</award></answer>"#,
        "content of its own",
    );
}

#[test]
fn several_awards_credited_add_up() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
    <answer name="ans" numAwardsCredited="2">
      <award credit="0.5"><when>$mi > 1</when></award>
      <award credit="0.3"><when>$mi > 2</when></award>
      <award credit="0.4"><when>$mi > 3</when></award>
    </answer>
    <answer name="sixths" numAwardsCredited="6">
      <award credit="1/6"><when>$mi > 0</when></award>
      <award credit="1/6"><when>$mi > 0</when></award>
      <award credit="1/6"><when>$mi > 0</when></award>
      <award credit="1/6"><when>$mi > 0</when></award>
      <award credit="1/6"><when>$mi > 0</when></award>
      <award credit="1/6"><when>$mi > 0</when></award>
    </answer>"#,
    )
    .unwrap();
    for (r, c) in [("0", 0.0), ("1.5", 0.5), ("2.5", 0.8), ("3.5", 0.9)] {
        let got = credit_for(&mut doc, "mi", "ans", r);
        assert!((got - c).abs() < 1e-12, "{r}: {got}");
    }
    // Six of `1/6` (literal math, evaluated) come to 1 within round-off.
    assert_eq!(credit_for(&mut doc, "mi", "sixths", "1"), 1.0);
    let (code, m) = load_error(r#"<answer numAwardsCredited="$n">x</answer>"#);
    assert!(
        code == "cells-unsupported" && m.contains("numAwardsCredited"),
        "{m}"
    );
}

/// Checks the boolean input `answer1` reads and submits it at each value.
fn boolean_credits(src: &str) -> Vec<f64> {
    let mut doc = load(src).unwrap();
    let a = doc.resolve_path("answer1").unwrap();
    let inputs = doc.answer_inputs(a);
    assert_eq!(inputs.len(), 1, "{src}");
    let cell = doc.comp_cells(inputs[0])[0];
    let mut out = vec![doc.value("answer1", "credit").unwrap_or(f64::NAN)];
    for v in [1.0, 0.0] {
        doc.request(&[cells_core::Request { cell, value: v }]);
        doc.submit(a);
        out.push(doc.value("answer1", "credit").unwrap());
    }
    out
}

#[test]
fn a_boolean_answer_compares_a_checkbox() {
    for src in [
        r#"<answer name="answer1" type="boolean">true</answer>"#,
        r#"<answer name="answer1" type="boolean">not false</answer>"#,
        r#"<answer name="answer1"><boolean>true</boolean></answer>"#,
        r#"<boolean hide name="b">false</boolean><answer name="answer1" type="boolean">not $b</answer>"#,
        r#"<answer name="answer1"><award><boolean>true</boolean></award></answer>"#,
        r#"<answer name="answer1" type="boolean"><award>not false</award></answer>"#,
        r#"<booleanInput name="bi"/><answer name="answer1" type="boolean"><booleanInput name="bi2"/>true</answer>"#,
    ] {
        let got = boolean_credits(src);
        // Nothing submitted gives no credit (a missing value); then true,
        // then false.
        assert!(got[0].is_nan() || got[0] == 0.0, "{src}: {got:?}");
        assert_eq!(got[1..], [1.0, 0.0], "{src}");
    }
    assert_eq!(
        boolean_credits(r#"<answer name="answer1" type="boolean">false</answer>"#)[1..],
        [0.0, 1.0]
    );
}

#[test]
fn a_label_is_the_answers_and_shows_on_the_input_it_makes() {
    let mut doc = load(
        r#"<answer name="a"><label>Enter x:</label><award>x</award></answer>
           <answer name="b"><label>Enter y:</label><mathInput name="mi"/>y</answer>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.code != "cells-unsupported")
    );
    let a = doc.resolve_path("a").unwrap();
    assert_eq!(doc.answer_inputs(a).len(), 1);
    let mi = doc.answer_inputs(a)[0];
    let cell = doc.comp_cells(mi)[1];
    let h = doc.parse_math("x").unwrap();
    doc.request(&[cells_core::Request { cell, value: h }]);
    doc.submit(a);
    assert_eq!(doc.value("a", "credit"), Some(1.0));
    assert_eq!(
        doc.answer_inputs(doc.resolve_path("b").unwrap()),
        vec![doc.resolve_path("mi").unwrap()]
    );
}

#[test]
fn references_are_responses_when_they_name_the_inputs_read() {
    let mut doc = load(
        r#"<mathInput name="mi1"/><mathInput name="mi2"/>
    <answer name="a"><award referencesAreResponses="$mi1 $mi2"><when>$mi1+$mi2 = 3x</when></award></answer>"#,
    )
    .unwrap();
    type_into(&mut doc, "mi1", "x");
    assert_eq!(credit_for(&mut doc, "mi2", "a", "2x"), 1.0);
    let (code, m) = load_error(
        r#"<point name="P"/><mathInput name="mi"/>
    <answer><award referencesAreResponses="$P"><when>$mi = $P.x</when></award></answer>"#,
    );
    assert!(
        code == "cells-unsupported" && m.contains("referencesAreResponses"),
        "{m}"
    );
}

#[test]
fn credits_are_held_from_zero_to_one() {
    let mut doc = load(
        r#"<mathInput name="mi"/>
    <answer name="a" response="$mi"><award credit="2">x</award><award credit="-1">y</award></answer>
    <answer name="c"><choiceInput name="ci"><choice credit="3">cat</choice><choice credit="-2">dog</choice></choiceInput></answer>"#,
    )
    .unwrap();
    assert_eq!(credit_for(&mut doc, "mi", "a", "x"), 1.0);
    assert_eq!(credit_for(&mut doc, "mi", "a", "y"), 0.0);
    set(&mut doc, "ci", "selectedIndex", 1.0);
    let c = doc.resolve_path("c").unwrap();
    doc.submit(c);
    assert_eq!(doc.value("c", "credit"), Some(1.0));
    set(&mut doc, "ci", "selectedIndex", 2.0);
    doc.submit(c);
    assert_eq!(doc.value("c", "credit"), Some(0.0));
}

#[test]
fn a_bare_reference_to_an_answer_is_its_submitted_response() {
    let mut doc = load(
        r#"<answer name="ans"><mathInput name="mi"/>x+y</answer>
           <boolean name="right">$ans = x+y</boolean>"#,
    )
    .unwrap();
    type_into(&mut doc, "mi", "x+y");
    assert_eq!(doc.value("right", "value"), Some(0.0), "not yet submitted");
    let a = doc.resolve_path("ans").unwrap();
    doc.submit(a);
    assert_eq!(doc.value("right", "value"), Some(1.0));
}

#[test]
fn a_choice_input_says_which_choice_is_chosen() {
    for src in [
        r#"<choiceInput name="ci"><choice name="c1">cat</choice><choice name="c2">dog</choice><choice name="c3">mouse</choice></choiceInput>"#,
        r#"<choiceInput name="ci" shuffleOrder><choice name="c1">cat</choice><choice name="c2">dog</choice><choice name="c3">mouse</choice></choiceInput>"#,
    ] {
        let mut doc = load_unpruned(src).unwrap();
        let ci = doc.resolve_path("ci").unwrap();
        let order: Vec<f64> = doc
            .prop_cells(ci, "choiceOrder")
            .unwrap()
            .iter()
            .map(|cell| doc.cells[cell.index()])
            .collect();
        let names = ["cat", "dog", "mouse"];
        let value = |doc: &Document| doc.text_value(doc.cell("ci", "selectedValue").unwrap());
        assert_eq!(value(&doc), "", "{src}");
        assert_eq!(doc.value("ci", "selectedChoice"), Some(0.0));
        for place in 1..=3 {
            set(&mut doc, "ci", "selectedIndex", place as f64);
            let k = order[place - 1] as usize;
            assert_eq!(doc.value("ci", "selectedChoice"), Some(k as f64), "{src}");
            assert_eq!(value(&doc), names[k - 1], "{src}");
            for (j, c) in ["c1", "c2", "c3"].into_iter().enumerate() {
                assert_eq!(
                    doc.value(c, "selected"),
                    Some(f64::from(j + 1 == k)),
                    "{src}"
                );
            }
        }
        assert_eq!(reference::check(&doc), None);
    }
}

#[test]
fn a_choices_selected_inside_it_is_no_cycle() {
    let mut doc = load_unpruned(
        r#"<choiceInput name="ci"><choice name="c1">cat $c1.selected</choice><choice>dog</choice></choiceInput>"#,
    )
    .unwrap();
    set(&mut doc, "ci", "selectedIndex", 1.0);
    assert_eq!(doc.value("c1", "selected"), Some(1.0));
    let value = doc.text_value(doc.cell("ci", "selectedValue").unwrap());
    assert!(value.starts_with("cat "), "{value}");
    // Shown in text as a boolean.
    let p = load_unpruned(
        r#"<choiceInput name="ci"><choice name="c1">cat</choice><choice>dog</choice></choiceInput><p name="p">$c1.selected</p>"#,
    )
    .unwrap();
    assert_eq!(
        p.rendered_text(p.resolve_path("p").unwrap()).trim(),
        "false"
    );
    assert_eq!(reference::check(&doc), None);
}

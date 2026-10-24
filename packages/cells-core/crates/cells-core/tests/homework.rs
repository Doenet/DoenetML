//! The tags a homework page uses beyond answers themselves: `<feedback>`,
//! `<hint>`, `<selectFromSequence>`, `<choiceInput>`, text answers, and the
//! current core's `creditAchieved` spelling.

mod common;

use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::{set, type_into, v};

fn submit(doc: &mut Document, answer: &str) {
    let a = doc.resolve_path(answer).unwrap();
    doc.submit(a);
}

#[test]
fn feedback_shows_while_its_condition_holds() {
    let mut doc = load(
        r#"<mathInput name="n" prefill="1"/>
<feedback name="f" condition="$n > 2"><p>big</p></feedback>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "f", "choice"), 0.0);
    set(&mut doc, "n", "value", 5.0);
    assert_eq!(v(&doc, "f", "choice"), 1.0);
}

#[test]
fn a_hint_is_closed_until_opened() {
    let mut doc = load(r#"<hint name="h"><p>try the chain rule</p></hint>"#).unwrap();
    assert_eq!(v(&doc, "h", "open"), 0.0);
    set(&mut doc, "h", "open", 1.0);
    assert_eq!(v(&doc, "h", "open"), 1.0);
}

#[test]
fn credit_achieved_is_the_current_cores_name_for_credit() {
    let mut doc = load(
        r#"<answer name="a"><mathInput name="mi"/><award>2x</award></answer>
<number name="c">$a.creditAchieved</number>
<feedback name="f" condition="$a.creditAchieved = 0 and $a.numSubmissions > 0"><p>no</p></feedback>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "f", "choice"), 0.0);
    type_into(&mut doc, "mi", "x");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "c", "value"), 0.0);
    assert_eq!(v(&doc, "f", "choice"), 1.0);
    type_into(&mut doc, "mi", "2x");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "c", "value"), 1.0);
    assert_eq!(v(&doc, "f", "choice"), 0.0);
}

#[test]
fn select_from_sequence_picks_one_number_per_seed() {
    let src = r#"<selectFromSequence name="a" from="2" to="5"/><math name="m">$a x + $a^2</math><number name="n">$a</number>"#;
    let mut seen = std::collections::HashSet::new();
    for seed in 0..40u64 {
        let doc = cells_core::testing::test_utils::load_with_seed(src, seed).unwrap();
        let a = v(&doc, "a", "value");
        assert!([2.0, 3.0, 4.0, 5.0].contains(&a), "seed {seed} picked {a}");
        assert_eq!(v(&doc, "n", "value"), a);
        seen.insert(a as i64);
    }
    assert!(seen.len() >= 3, "40 seeds picked only {seen:?}");
    // The same seed picks the same number.
    let a = cells_core::testing::test_utils::load_with_seed(src, 7).unwrap();
    let b = cells_core::testing::test_utils::load_with_seed(src, 7).unwrap();
    assert_eq!(v(&a, "a", "value"), v(&b, "a", "value"));
}

#[test]
fn a_choice_input_answer_earns_the_submitted_choices_credit() {
    let mut doc = load(
        r#"<answer name="a"><choiceInput name="ci"><choice>increasing</choice><choice credit="1">decreasing</choice><choice credit="0.5">neither</choice></choiceInput></answer>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "ci", "selectedIndex"), 0.0);
    assert_eq!(v(&doc, "a", "credit"), 0.0);
    set(&mut doc, "ci", "selectedIndex", 2.0);
    assert_eq!(v(&doc, "a", "credit"), 0.0, "credit changes only on submit");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 1.0);
    assert_eq!(v(&doc, "a", "numSubmissions"), 1.0);
    set(&mut doc, "ci", "selectedIndex", 3.0);
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.5);
    set(&mut doc, "ci", "selectedIndex", 1.0);
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.0);
    assert_eq!(
        doc.answer_inputs(doc.resolve_path("a").unwrap()),
        vec![doc.resolve_path("ci").unwrap()]
    );
}

#[test]
fn a_text_answer_compares_the_submitted_text_with_each_award() {
    let mut doc = load(
        r#"<answer name="a" type="text"><textInput name="ti"/><award>concave</award><award credit="0.5">curved</award></answer>"#,
    )
    .unwrap();
    let type_text = |doc: &mut Document, s: &str| {
        let id = doc.intern(s);
        let cell = doc.cell("ti", "value").unwrap();
        doc.request(&[cells_core::Request { cell, value: id }]);
    };
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.0);
    type_text(&mut doc, "concave");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 1.0);
    type_text(&mut doc, "curved");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.5);
    type_text(&mut doc, "convex");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.0);
}

#[test]
fn a_point_constrained_to_a_function_rides_its_curve() {
    let mut doc = load(
        r#"<graph><function name="h">x^2 - 2x</function><point name="P" x="2" y="5"><constrainTo>$h</constrainTo></point></graph>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "P", "x"), 2.0);
    assert_eq!(v(&doc, "P", "y"), 0.0);
    set(&mut doc, "P", "x", 1.0);
    assert_eq!(v(&doc, "P", "x"), 1.0);
    assert_eq!(v(&doc, "P", "y"), -1.0);
    // Asking for a y off the curve changes nothing: the curve decides y.
    set(&mut doc, "P", "y", 7.0);
    assert_eq!(v(&doc, "P", "y"), -1.0);
}

#[test]
fn an_award_may_hold_its_expression_in_a_math_element() {
    let mut doc = load(
        r#"<selectFromSequence name="k" from="3" to="3"/>
<answer name="a"><mathInput name="mi"/><award><math>2 + $k</math></award></answer>"#,
    )
    .unwrap();
    type_into(&mut doc, "mi", "5");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 1.0);
    type_into(&mut doc, "mi", "4");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.0);
}

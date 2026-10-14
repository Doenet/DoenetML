//! Credit and section numbers (`build/expand/scoring.rs`). The scenarios follow
//! the current core's `document.test.ts`, `sectioning.test.ts` and the
//! paginator Cypress test, whose answers sit in conditional content.

mod common;

use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use cells_core::{CompIdx, Document};
use common::{close, set, type_into};

/// Type into `input` and submit `answer`.
fn answer(doc: &mut Document, input: &str, answer: &str, s: &str) {
    type_into(doc, input, s);
    let a = doc.resolve_path(answer).unwrap();
    doc.submit(a);
}

fn doc_credit(doc: &Document) -> f64 {
    doc.cells[doc.comp_cells(doc.root)[0] as usize]
}

fn credit(doc: &Document, name: &str) -> f64 {
    doc.value(name, "creditAchieved").unwrap()
}

fn number(doc: &Document, name: &str) -> String {
    doc.section_number(doc.component(name).unwrap()).unwrap()
}

macro_rules! assert_credit {
    ($a:expr, $b:expr) => {
        let (a, b): (f64, f64) = ($a, $b);
        assert!(close(a, b), "expected credit {b}, got {a}");
    };
}

#[test]
fn a_document_with_nothing_scored_has_full_credit() {
    // document.test.ts:10
    let doc = load("<p>Hello</p>").unwrap();
    assert_eq!(doc_credit(&doc), 1.0);
    let pct = doc.comp_cells(doc.root)[1];
    assert_eq!(doc.cells[pct as usize], 100.0);
}

#[test]
fn an_empty_problem_counts_as_one_full_credit_item() {
    // document.test.ts:25
    let mut doc = load(r#"<mathInput name="mi"/><p><answer name="a" response="$mi">x</answer></p><problem name="pr"/>"#).unwrap();
    assert_credit!(doc_credit(&doc), 0.5);
    assert_eq!(credit(&doc, "pr"), 1.0);
    answer(&mut doc, "mi", "a", "x");
    assert_credit!(doc_credit(&doc), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn weights_of_answers_and_problems() {
    // document.test.ts:106: weight-0 items count for nothing.
    let mut doc = load(
        r#"
<mathInput name="m1"/><answer name="x" response="$m1">x</answer>
<mathInput name="m2"/><answer name="a" response="$m2" weight="0">a</answer>
<problem name="p1"><mathInput name="m3"/><answer name="y" response="$m3">y</answer></problem>
<problem name="p2" weight="0"><mathInput name="m4"/><answer name="b" response="$m4">b</answer></problem>
<problem name="p3"><mathInput name="m5"/><answer name="z" response="$m5">z</answer></problem>
"#,
    )
    .unwrap();
    assert_credit!(doc_credit(&doc), 0.0);
    answer(&mut doc, "m1", "x", "x");
    assert_credit!(doc_credit(&doc), 1.0 / 3.0);
    answer(&mut doc, "m2", "a", "a");
    assert_credit!(doc_credit(&doc), 1.0 / 3.0);
    answer(&mut doc, "m4", "b", "b");
    assert_eq!(credit(&doc, "p2"), 1.0);
    assert_credit!(doc_credit(&doc), 1.0 / 3.0);
    answer(&mut doc, "m3", "y", "y");
    assert_credit!(doc_credit(&doc), 2.0 / 3.0);
    assert_eq!(doc.value("p1", "percentCreditAchieved"), Some(100.0));
}

#[test]
fn sections_aggregate_only_when_asked_and_are_transparent_otherwise() {
    // sectioning.test.ts:289 (shape): sec2 aggregates; sec22 does not, so
    // its answer and aggregating subsection count directly in sec2.
    let mut doc = load(
        r#"
<mathInput name="m1"/><answer name="a1" response="$m1">1</answer>
<section name="sec1" aggregateScores>
  <mathInput name="m2"/><answer name="a2" response="$m2">2</answer>
  <mathInput name="m3"/><answer name="a3" response="$m3" weight="2">3</answer>
</section>
<section name="sec2" aggregateScores>
  <mathInput name="m4"/><answer name="a4" response="$m4">4</answer>
  <section name="sec21" aggregateScores weight="3">
    <mathInput name="m5"/><answer name="a5" response="$m5">5</answer>
  </section>
  <section name="sec22">
    <mathInput name="m6"/><answer name="a6" response="$m6">6</answer>
    <subsection name="sec221" aggregateScores><mathInput name="m7"/><answer name="a7" response="$m7">7</answer></subsection>
  </section>
</section>
"#,
    )
    .unwrap();
    assert_eq!(
        credit(&doc, "sec22"),
        0.0,
        "a section that does not aggregate has no credit"
    );
    answer(&mut doc, "m3", "a3", "3");
    assert_credit!(credit(&doc, "sec1"), 2.0 / 3.0);
    answer(&mut doc, "m5", "a5", "5");
    // sec2 = (a4 + 3 sec21 + a6 + sec221) / 6
    assert_credit!(credit(&doc, "sec2"), 3.0 / 6.0);
    answer(&mut doc, "m6", "a6", "6");
    assert_credit!(credit(&doc, "sec2"), 4.0 / 6.0);
    assert_eq!(credit(&doc, "sec22"), 0.0);
    // document = (a1 + sec1 + sec2) / 3
    assert_credit!(doc_credit(&doc), (0.0 + 2.0 / 3.0 + 4.0 / 6.0) / 3.0);
}

/// The paginator test's problem 1: one answer in a two-case choice, and
/// two single-case choices, so two answers are active at a time.
const SWITCHING: &str = r#"
<numberInput name="n" value="1"/>
<problem name="pr">
  <conditionalContent name="cc">
    <case condition="$n = 1"><mathInput name="mx"/><answer name="ax" response="$mx">x</answer></case>
    <case condition="$n = 2"><mathInput name="my"/><answer name="ay" response="$my">y</answer></case>
  </conditionalContent>
  <conditionalContent condition="$n = 1"><mathInput name="m2x"/><answer name="a2x" response="$m2x">2x</answer></conditionalContent>
  <conditionalContent condition="$n = 2"><mathInput name="m2y"/><answer name="a2y" response="$m2y">2y</answer></conditionalContent>
</problem>
"#;

#[test]
fn inactive_answers_do_not_count() {
    let mut doc = load(SWITCHING).unwrap();
    assert_credit!(credit(&doc, "pr"), 0.0);
    answer(&mut doc, "mx", "pr.cc.ax", "x");
    assert_credit!(credit(&doc, "pr"), 0.5);
    let tick = set(&mut doc, "n", "value", 2.0);
    assert!(!tick.rebuilt, "a flip changes credit on an ordinary tick");
    assert_credit!(credit(&doc, "pr"), 0.0);
    answer(&mut doc, "my", "pr.cc.ay", "y");
    assert_credit!(credit(&doc, "pr"), 0.5);
    // Nothing active: no weight, so full credit, as for an empty problem.
    set(&mut doc, "n", "value", 3.0);
    assert_credit!(credit(&doc, "pr"), 1.0);
    // Deviation from the current core, which recreates a case's answers:
    // a case that returns keeps what was submitted (ADR 0009).
    set(&mut doc, "n", "value", 1.0);
    assert_credit!(credit(&doc, "pr"), 0.5);
    assert_credit!(doc_credit(&doc), 0.5);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn nested_cases_gate_by_every_enclosing_case() {
    let mut doc = load(
        r#"
<booleanInput name="b1" value="true"/><booleanInput name="b2" value="true"/>
<mathInput name="m0"/><answer name="a0" response="$m0">0</answer>
<conditionalContent condition="$b1">
  <conditionalContent condition="$b2"><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></conditionalContent>
</conditionalContent>
"#,
    )
    .unwrap();
    answer(&mut doc, "m0", "a0", "0");
    assert_credit!(doc_credit(&doc), 0.5);
    set(&mut doc, "b2", "value", 0.0);
    assert_credit!(doc_credit(&doc), 1.0);
    set(&mut doc, "b2", "value", 1.0);
    set(&mut doc, "b1", "value", 0.0);
    assert_credit!(doc_credit(&doc), 1.0);
}

#[test]
fn hidden_answers_still_count() {
    // The current core's `scoredDescendants` ignores `hidden`.
    let doc = load(
        r#"<booleanInput name="h" value="true"/><mathInput name="m1"/><answer name="a1" response="$m1">1</answer>
<conditionalContent name="cc" hide="$h"><case condition="true"><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></case></conditionalContent>"#,
    )
    .unwrap();
    let a1 = doc.resolve_path("a1").unwrap();
    let _: CompIdx = a1;
    assert_credit!(doc_credit(&doc), 0.0);
    let mut doc = doc;
    answer(&mut doc, "m1", "a1", "1");
    assert_credit!(doc_credit(&doc), 0.5);
}

#[test]
fn only_picked_options_of_a_select_are_scored() {
    let mut doc = load(
        r#"<select name="s"><option><mathInput name="m"/><answer name="a" response="$m">1</answer></option><option><mathInput name="m"/><answer name="a" response="$m">1</answer></option></select>"#,
    )
    .unwrap();
    assert_credit!(doc_credit(&doc), 0.0);
    answer(&mut doc, "s[1].m", "s[1].a", "1");
    assert_credit!(doc_credit(&doc), 1.0);
}

#[test]
fn many_answers_combine_through_a_tree_of_means() {
    // More than one `WeightedMean` holds: 70 answers, the last 7 of weight 2.
    let mut src = String::from(r#"<numberInput name="k" value="0"/>"#);
    for i in 1..=70 {
        let w = if i > 63 { r#" weight="2""# } else { "" };
        src.push_str(&format!(
            r#"<mathInput name="m{i}"/><answer name="a{i}" response="$m{i}"{w}>{i}</answer>"#
        ));
    }
    let mut doc = load(&src).unwrap();
    assert_credit!(doc_credit(&doc), 0.0);
    answer(&mut doc, "m1", "a1", "1");
    answer(&mut doc, "m70", "a70", "70");
    assert_credit!(doc_credit(&doc), 3.0 / 77.0);
}

#[test]
fn nested_sections_number_through_their_parents() {
    // sectioning.test.ts `test_auto_naming` (shape).
    let doc = load(
        r#"
<section name="s1"/>
<section name="s2">
  <section name="s21"><section name="s211"/></section>
  <section name="s22" includeParentNumber="false"/>
  <subsection name="s23"/>
</section>
"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "s1"), "1");
    assert_eq!(number(&doc, "s2"), "2");
    assert_eq!(number(&doc, "s21"), "2.1");
    assert_eq!(number(&doc, "s211"), "2.1.1");
    assert_eq!(number(&doc, "s22"), "2");
    assert_eq!(number(&doc, "s23"), "2.3");
    assert_eq!(
        doc.section_title(doc.component("s21").unwrap()).unwrap(),
        "Section 2.1"
    );
}

#[test]
fn problems_exercises_and_examples_share_one_counter() {
    // sectioning.test.ts:911
    let doc = load(
        r#"<section name="s1"><problem name="a"/><exercise name="b"/><example name="c"/><problem name="d"/><exercise name="e"/><example name="f"/></section>"#,
    )
    .unwrap();
    let titles: Vec<String> = ["a", "b", "c", "d", "e", "f"]
        .iter()
        .map(|n| doc.section_title(doc.component(n).unwrap()).unwrap())
        .collect();
    assert_eq!(
        titles,
        [
            "Problem 1",
            "Exercise 2",
            "Example 3",
            "Problem 4",
            "Exercise 5",
            "Example 6"
        ]
    );
}

#[test]
fn sections_in_inactive_cases_take_no_number() {
    let mut doc = load(
        r#"
<numberInput name="n" value="1"/>
<section name="intro"/>
<conditionalContent name="cc">
  <case condition="$n = 1"><section name="one"/></case>
  <case condition="$n = 2"><section name="two"/><section name="three"/></case>
</conditionalContent>
<group><section name="last"><subsection name="sub"/></section></group>
"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "intro"), "1");
    assert_eq!(number(&doc, "cc.one"), "2");
    assert_eq!(number(&doc, "last"), "3");
    assert_eq!(number(&doc, "sub"), "3.1");
    let tick = set(&mut doc, "n", "value", 2.0);
    assert!(!tick.rebuilt);
    assert_eq!(number(&doc, "cc.two"), "2");
    assert_eq!(number(&doc, "cc.three"), "3");
    assert_eq!(number(&doc, "last"), "4");
    assert_eq!(number(&doc, "sub"), "4.1");
    set(&mut doc, "n", "value", 0.0);
    assert_eq!(number(&doc, "last"), "2", "no case active: no jump");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn hidden_sections_keep_their_number() {
    let doc = load(r#"<section name="a"/><conditionalContent hide="true"><case condition="true"><section name="b"/></case></conditionalContent><section name="c"/>"#).unwrap();
    assert_eq!(number(&doc, "c"), "3");
}

#[test]
fn repeated_sections_number_in_order() {
    let doc = load(r#"<section name="a"/><repeatForSequence name="r" length="3"><section name="s"/></repeatForSequence>"#).unwrap();
    assert_eq!(number(&doc, "r[3].s"), "4");
}

#[test]
fn section_flags_must_be_literals() {
    let e = load(r#"<booleanInput name="b"/><section aggregateScores="$b"/>"#)
        .err()
        .unwrap();
    assert!(
        matches!(e, cells_core::Error::Unsupported(ref m) if m.contains("aggregateScores")),
        "{e}"
    );
}

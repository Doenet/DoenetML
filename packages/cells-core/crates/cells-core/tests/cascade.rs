//! `<cascade>` and `<cascadeMessage>` (ADR 0062), in the scenarios of the
//! current core's `cascade.test.ts`: a gate per step, read as cells for
//! scoring and when asked for what is shown.

mod common;

use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use cells_core::{Document, Revealed};
use common::{close, set, type_into};

/// Type `s` into `input` and submit `answer`.
fn answer(doc: &mut Document, input: &str, answer: &str, s: &str) {
    type_into(doc, input, s);
    let a = doc.resolve_path(answer).unwrap();
    doc.submit(a);
    assert_eq!(reference::check(doc), None);
}

fn completed(doc: &Document, name: &str) -> f64 {
    doc.value(name, "numCompleted").unwrap()
}

fn revealed(doc: &Document, name: &str) -> Revealed {
    doc.revealed(doc.resolve_path(name).unwrap())
}

/// Whether `name` is shown at all: no cascade above it hides it, and no
/// step it is in only shows its heading.
fn hidden(doc: &Document, name: &str) -> bool {
    let mut c = doc.resolve_path(name).unwrap();
    loop {
        match doc.revealed(c) {
            Revealed::Hidden => return true,
            Revealed::Heading | Revealed::Shown => {}
        }
        let Some(p) = doc.parent(c) else { return false };
        // What a held-back step holds is hidden, but its chosen message.
        let is_message = doc.component_type(c).tag() == "cascadeMessage";
        if doc.revealed(p) == Revealed::Heading && !is_message {
            return true;
        }
        c = p;
    }
}

fn credit(doc: &Document, name: &str) -> f64 {
    doc.value(name, "creditAchieved").unwrap()
}

const BASIC: &str = r#"
<cascade name="w">
  <section name="s1">
    <p name="p1">1+1: <mathInput name="m11"/><answer name="a11" response="$m11">2</answer></p>
    <p name="p2">1-1: <mathInput name="m12"/><answer name="a12" response="$m12">0</answer></p>
  </section>
  <section name="s2">
    <p name="p">3+4: <mathInput name="m2"/><answer name="a2" response="$m2">7</answer></p>
  </section>
  <section name="s3">
    <p name="p">3-4: <mathInput name="m3"/><answer name="a3" response="$m3">-1</answer></p>
  </section>
</cascade>
<p name="count">numCompleted: $w.numCompleted</p>
"#;

/// The steps of the basic cascade as `numCompleted` reaches `n`.
fn check_basic(doc: &Document, n: usize) {
    assert_eq!(completed(doc, "w"), n as f64);
    assert_eq!(
        doc.rendered_text(doc.resolve_path("count").unwrap()),
        format!("numCompleted: {n}")
    );
    assert_eq!(revealed(doc, "s1"), Revealed::Shown);
    assert!(!hidden(doc, "s1.p1") && !hidden(doc, "s1.p2"));
    for (k, (s, p)) in [("s2", "s2.p"), ("s3", "s3.p")].into_iter().enumerate() {
        let held = n < k + 1;
        assert_eq!(
            revealed(doc, s),
            if held {
                Revealed::Heading
            } else {
                Revealed::Shown
            },
            "{s} at {n}"
        );
        assert!(!hidden(doc, s));
        assert_eq!(hidden(doc, p), held, "{p} at {n}");
    }
}

#[test]
fn steps_are_revealed_as_the_ones_before_are_complete() {
    let mut doc = load(BASIC).unwrap();
    check_basic(&doc, 0);
    for (input, ans, typed, n) in [
        ("m11", "a11", "2", 0),
        ("m12", "a12", "0", 1),
        ("m11", "a11", "3", 0),
        ("m11", "a11", "2", 1),
        ("m2", "a2", "7", 2),
        ("m12", "a12", "-1", 0),
        ("m12", "a12", "0", 2),
        ("m3", "a3", "-1", 3),
        ("m2", "a2", "11", 1),
        ("m2", "a2", "7", 3),
    ] {
        answer(&mut doc, input, ans, typed);
        check_basic(&doc, n);
    }
}

#[test]
fn hide_future_sections_hides_the_steps_held_back() {
    let mut doc = load(&BASIC.replace(r#"name="w""#, r#"name="w" hideFutureSections"#)).unwrap();
    assert_eq!(revealed(&doc, "s2"), Revealed::Hidden);
    assert_eq!(revealed(&doc, "s3"), Revealed::Hidden);
    answer(&mut doc, "m11", "a11", "2");
    answer(&mut doc, "m12", "a12", "0");
    assert_eq!(revealed(&doc, "s2"), Revealed::Shown);
    assert_eq!(revealed(&doc, "s3"), Revealed::Hidden);
}

#[test]
fn a_step_held_back_is_not_scored() {
    // What the current core differs on: it scores a held-back step.
    let mut doc = load(
        r#"
<section name="outer" aggregateScores>
  <cascade name="c">
    <section name="s1">
      <p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p>
      <p><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p>
    </section>
    <section name="s2"><p><mathInput name="m3"/><answer name="a3" response="$m3">3</answer></p></section>
  </cascade>
  <p><mathInput name="m4"/><answer name="a4" response="$m4">4</answer></p>
</section>"#,
    )
    .unwrap();
    assert!(close(credit(&doc, "outer"), 0.0));
    answer(&mut doc, "m1", "a1", "1");
    // s2 is held back: s1 and the answer after the cascade are scored.
    assert!(close(credit(&doc, "outer"), 0.25));
    assert_eq!(credit(&doc, "s1"), 0.5);
    answer(&mut doc, "m2", "a2", "2");
    assert!(close(credit(&doc, "outer"), 1.0 / 3.0));
    answer(&mut doc, "m3", "a3", "3");
    assert!(close(credit(&doc, "outer"), 2.0 / 3.0));
    assert_eq!(completed(&doc, "c"), 2.0);
    answer(&mut doc, "m4", "a4", "4");
    assert!(close(credit(&doc, "outer"), 1.0));
}

#[test]
fn a_cascade_in_a_cascade_is_held_back_as_a_step() {
    let mut doc = load(
        r#"
<section name="s" aggregateScores>
  <cascade name="c">
    <p name="first"><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p>
    <cascade name="inner">
      <section name="x"><p name="xp"><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p></section>
      <section name="y"><p name="yp"><mathInput name="m3"/><answer name="a3" response="$m3">3</answer></p></section>
    </cascade>
  </cascade>
</section>"#,
    )
    .unwrap();
    assert_eq!(completed(&doc, "c"), 0.0);
    assert_eq!(revealed(&doc, "inner"), Revealed::Heading);
    // Every step of a held-back cascade is hidden.
    assert_eq!(revealed(&doc, "x"), Revealed::Hidden);
    assert_eq!(revealed(&doc, "y"), Revealed::Hidden);
    answer(&mut doc, "m1", "a1", "1");
    assert_eq!(completed(&doc, "c"), 1.0);
    assert_eq!(revealed(&doc, "inner"), Revealed::Shown);
    assert_eq!(revealed(&doc, "x"), Revealed::Shown);
    assert_eq!(revealed(&doc, "y"), Revealed::Heading);
    assert!(hidden(&doc, "yp"));
    // The first answer and the inner cascade's first step are scored.
    assert!(close(credit(&doc, "s"), 0.5));
    answer(&mut doc, "m2", "a2", "2");
    assert_eq!(completed(&doc, "inner"), 1.0);
    assert!(close(credit(&doc, "s"), 2.0 / 3.0));
    answer(&mut doc, "m3", "a3", "3");
    assert_eq!(completed(&doc, "c"), 2.0);
    assert!(close(credit(&doc, "s"), 1.0));
}

#[test]
fn reveal_all_shows_every_step_and_no_message() {
    let doc = load(
        r#"
<cascade name="c" revealAll>
  <section name="a"><p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p></section>
  <cascadeMessage name="cm">Finish the one above.</cascadeMessage>
  <section name="b"/>
  <cascade name="inner"><section name="x"><p><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p></section><section name="y"/></cascade>
</cascade>"#,
    )
    .unwrap();
    assert_eq!(doc.value("inner", "revealAll"), Some(1.0));
    for name in ["a", "b", "inner", "x", "y"] {
        assert_eq!(revealed(&doc, name), Revealed::Shown, "{name}");
    }
    assert_eq!(revealed(&doc, "cm"), Revealed::Hidden);
}

#[test]
fn one_message_shows_for_the_gap() {
    let mut doc = load(
        r#"
<cascade name="w">
  <section name="s1">
    <p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p>
    <cascadeMessage name="cm">Never shown</cascadeMessage>
  </section>
  <section name="s2">
    <p><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p>
    <cascadeMessage name="cm">Complete the first part.</cascadeMessage>
  </section>
  <section name="s3">
    <cascadeMessage name="cm">Complete the second part.</cascadeMessage>
    <p><mathInput name="m3"/><answer name="a3" response="$m3">3</answer></p>
  </section>
</cascade>"#,
    )
    .unwrap();
    let shown = |doc: &Document| -> Vec<bool> {
        ["s1.cm", "s2.cm", "s3.cm"]
            .iter()
            .map(|n| !hidden(doc, n))
            .collect()
    };
    assert_eq!(shown(&doc), [false, true, false]);
    answer(&mut doc, "m1", "a1", "1");
    assert_eq!(shown(&doc), [false, false, true]);
    answer(&mut doc, "m2", "a2", "2");
    assert_eq!(shown(&doc), [false, false, false]);
}

#[test]
fn a_cascades_own_message_is_the_next_after_the_last_step_shown() {
    let mut doc = load(
        r#"
<cascade name="w">
  <section name="s1"><p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p></section>
  <cascadeMessage name="c1">first</cascadeMessage>
  <section name="s2"><p><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p></section>
  <cascadeMessage name="c2">second</cascadeMessage>
  <section name="s3"><p><mathInput name="m3"/><answer name="a3" response="$m3">3</answer></p></section>
  <cascadeMessage name="c3">third</cascadeMessage>
</cascade>
<p name="t">$w</p>"#,
    )
    .unwrap();
    let shown = |doc: &Document| -> Vec<bool> {
        ["c1", "c2", "c3"]
            .iter()
            .map(|n| revealed(doc, n) == Revealed::Shown)
            .collect()
    };
    assert_eq!(shown(&doc), [true, false, false]);
    // What is held back is not in the text, nor a message not shown.
    let text = doc.rendered_text(doc.resolve_path("w").unwrap());
    assert!(text.contains("first") && !text.contains("second"), "{text}");
    answer(&mut doc, "m1", "a1", "1");
    assert_eq!(shown(&doc), [false, true, false]);
    answer(&mut doc, "m2", "a2", "2");
    // The last step is shown: no gap.
    assert_eq!(shown(&doc), [false, false, false]);
}

#[test]
fn a_step_with_a_message_of_its_own_speaks_for_the_gap() {
    let doc = load(
        r#"
<cascade name="w">
  <section name="s1"><p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p></section>
  <cascadeMessage name="own">the cascade's</cascadeMessage>
  <section name="s2"><cascadeMessage name="cm">the step's</cascadeMessage><p>two</p></section>
</cascade>"#,
    )
    .unwrap();
    assert_eq!(revealed(&doc, "own"), Revealed::Hidden);
    assert!(!hidden(&doc, "s2.cm"));
}

#[test]
fn numbers_stay_put_as_steps_reveal() {
    let mut doc = load(
        r#"
<section name="s"><title>S</title>
  <subsection name="a"><p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p></subsection>
  <cascade name="c">
    <subsection name="b"><p><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p></subsection>
    <cascadeMessage>Finish the subsection above.</cascadeMessage>
    <subsection name="d"><p><mathInput name="m3"/><answer name="a3" response="$m3">3</answer></p></subsection>
    <example name="x"><p>An example</p></example>
  </cascade>
  <subsection name="e"><p>5</p></subsection>
</section>
<p name="copied">$d.sectionNumber</p>"#,
    )
    .unwrap();
    let numbers = |doc: &Document| -> Vec<String> {
        ["a", "b", "d", "x", "e"]
            .iter()
            .map(|n| doc.section_number(doc.resolve_path(n).unwrap()).unwrap())
            .collect()
    };
    let copied = |doc: &Document| doc.rendered_text(doc.resolve_path("copied").unwrap());
    for (input, ans, typed, n) in [
        (None, None, None, 0.0),
        (Some("m2"), Some("a2"), Some("2"), 1.0),
        (Some("m3"), Some("a3"), Some("3"), 3.0),
    ] {
        if let (Some(i), Some(a), Some(t)) = (input, ans, typed) {
            answer(&mut doc, i, a, t);
        }
        assert_eq!(numbers(&doc), ["1.1", "1.2", "1.3", "4", "1.5"]);
        assert_eq!(completed(&doc, "c"), n);
        assert_eq!(revealed(&doc, "d") == Revealed::Heading, n < 1.0);
        assert_eq!(copied(&doc), "1.3");
    }
}

#[test]
fn steps_in_a_repeat_follow_its_count() {
    let mut doc = load(
        r#"
<mathInput name="n" prefill="2"/>
<section name="a"/>
<cascade name="c">
  <section name="b"/>
  <repeatForSequence name="r" length="$n"><section name="p"><mathInput name="m"/><answer name="ans" response="$m">1</answer></section></repeatForSequence>
  <cascade><section name="last"/></cascade>
</cascade>
<section name="d"/>"#,
    )
    .unwrap();
    let number =
        |doc: &Document, name: &str| doc.section_number(doc.resolve_path(name).unwrap()).unwrap();
    assert_eq!(completed(&doc, "c"), 1.0);
    assert_eq!(revealed(&doc, "r[1].p"), Revealed::Shown);
    assert_eq!(revealed(&doc, "r[2].p"), Revealed::Heading);
    for k in [4, 0, 1] {
        type_into(&mut doc, "n", &k.to_string());
        assert_eq!(number(&doc, "b"), "2");
        assert_eq!(number(&doc, "last"), (3 + k).to_string());
        assert_eq!(number(&doc, "d"), (4 + k).to_string());
        // The step after the repeat is reached once every step in it is.
        let expected = if k == 0 { 2.0 } else { 1.0 };
        assert_eq!(completed(&doc, "c"), expected, "at {k}");
        assert_eq!(reference::check(&doc), None);
    }
    answer(&mut doc, "r[1].p.m", "r[1].p.ans", "1");
    assert_eq!(completed(&doc, "c"), 3.0);
    assert_eq!(revealed(&doc, "last"), Revealed::Shown);
}

#[test]
fn a_step_in_an_inactive_case_is_no_step() {
    let mut doc = load(
        r#"
<booleanInput name="on"/>
<cascade name="c">
  <section name="a"><p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p></section>
  <conditionalContent condition="$on"><section name="b"><p><mathInput name="m2"/><answer name="a2" response="$m2">2</answer></p></section></conditionalContent>
  <section name="z"/>
</cascade>"#,
    )
    .unwrap();
    answer(&mut doc, "m1", "a1", "1");
    // Without b, z is the step after a.
    assert_eq!(completed(&doc, "c"), 2.0);
    assert_eq!(revealed(&doc, "z"), Revealed::Shown);
    set(&mut doc, "on", "value", 1.0);
    assert_eq!(completed(&doc, "c"), 1.0);
    assert_eq!(revealed(&doc, "z"), Revealed::Heading);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_title_in_a_cascade_is_warned_of_and_is_no_step() {
    let doc = load(
        r#"<cascade name="c">
  <title>Steps</title>
  <section name="s1"><p>a</p></section>
  <section name="s2"><p>b</p></section>
</cascade>"#,
    )
    .unwrap();
    assert_eq!(completed(&doc, "c"), 2.0);
    let codes: Vec<_> = doc.diagnostics().iter().map(|d| d.code).collect();
    assert_eq!(codes, ["cells-cascade-title"]);
}

#[test]
fn a_copy_of_a_cascade_shares_its_count() {
    let doc = load(
        r#"<cascade name="c"><section name="a"><p><mathInput name="m1"/><answer name="a1" response="$m1">1</answer></p></section><section name="b"/></cascade>
<p name="p">$c</p><cascade name="d" extend="$c"/>"#,
    )
    .unwrap();
    assert_eq!(completed(&doc, "c"), 0.0);
    assert_eq!(completed(&doc, "d"), 0.0);
    assert_eq!(reference::check(&doc), None);
}

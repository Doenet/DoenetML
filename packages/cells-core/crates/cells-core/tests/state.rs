//! Saved state (`document/state.rs`): what a session changed comes back
//! after a reload, including text, expressions and iterations that exist
//! only because a count changed.

mod common;

use cells_core::testing::test_utils::{load, load_with_seed};
use cells_core::{Document, Request};
use common::{set, type_into, v};

fn type_text(doc: &mut Document, name: &str, s: &str) {
    let id = doc.intern(s);
    let cell = doc.cell(name, "value").unwrap();
    doc.request(&[Request { cell, value: id }]);
}

const DOC: &str = r#"<mathInput name="mi" prefill="x"/><textInput name="ti" prefill="hi"/>
<mathInput name="k" prefill="2"/><number name="twice">2 $k</number>
<graph><point name="p" x="1" y="2"/></graph>"#;

#[test]
fn an_untouched_document_saves_nothing() {
    let doc = load(DOC).unwrap();
    assert_eq!(doc.save_state(), r#"{"state":[],"v":2}"#);
}

#[test]
fn changed_values_come_back_after_a_reload() {
    let mut doc = load(DOC).unwrap();
    type_into(&mut doc, "mi", "x^2+1");
    type_text(&mut doc, "ti", "hello there");
    set(&mut doc, "k", "value", 5.0);
    set(&mut doc, "p", "x", 3.5);
    let saved = doc.save_state();
    assert!(
        saved.contains(r#""m","#) && saved.contains("hello there"),
        "{saved}"
    );

    let mut fresh = load(DOC).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(
        fresh.math_text(fresh.cell("mi", "expr").unwrap()),
        doc.math_text(doc.cell("mi", "expr").unwrap())
    );
    assert_eq!(
        fresh.text_value(fresh.cell("ti", "value").unwrap()),
        "hello there"
    );
    assert_eq!(v(&fresh, "twice", "value"), 10.0);
    assert_eq!(v(&fresh, "p", "x"), 3.5);
    // A value put back to its default drops out of the saved state.
    set(&mut fresh, "p", "x", 1.0);
    assert!(!fresh.save_state().contains(r#""n",3.5"#));
}

#[test]
fn an_emptied_input_saves_as_null() {
    let mut doc = load(DOC).unwrap();
    set(&mut doc, "k", "value", f64::NAN);
    let saved = doc.save_state();
    assert!(saved.contains("null"), "{saved}");
    let mut fresh = load(DOC).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert!(v(&fresh, "k", "value").is_nan());
}

const REPEAT: &str = r#"<mathInput name="n" prefill="2"/>
<graph><repeatForSequence name="r" from="1" length="$n"><point name="q" x="0" y="0"/></repeatForSequence></graph>"#;

#[test]
fn iterations_that_exist_only_after_a_count_change_come_back() {
    let mut doc = load(REPEAT).unwrap();
    set(&mut doc, "n", "value", 4.0);
    set(&mut doc, "r[4].q", "x", 5.0);
    let saved = doc.save_state();

    let mut fresh = load(REPEAT).unwrap();
    assert!(fresh.cell("r[4].q", "x").is_none());
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "n", "value"), 4.0);
    assert_eq!(v(&fresh, "r[4].q", "x"), 5.0);
    assert_eq!(v(&fresh, "r[1].q", "x"), 0.0);
}

// A cell's type is its definer's: text a `<text>` defines and a
// `<textInput>` binds to is saved as text, not as its string id.
#[test]
fn text_bound_to_a_text_input_is_saved_as_text() {
    let src = r#"<text name="t1">hello</text><textInput name="ti" bindValueTo="$t1"/>"#;
    let mut doc = load(src).unwrap();
    type_text(&mut doc, "ti", "bye there");
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(
        fresh.text_value(fresh.cell("ti", "value").unwrap()),
        "bye there"
    );
}

// A text answer's submitted response is text too, so it restores whatever
// order strings were interned in.
#[test]
fn a_submitted_text_response_is_saved_as_text() {
    let src = r#"<answer name="a" type="text"><textInput name="ti"/><award>yes</award></answer>"#;
    let mut doc = load(src).unwrap();
    type_text(&mut doc, "ti", "first");
    type_text(&mut doc, "ti", "nope");
    doc.submit(doc.component("a").unwrap());
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(
        fresh.text_value(fresh.cell("a", "submitted").unwrap()),
        "nope"
    );
}

/// A repeat of a select whose second option makes `$r[2].s[1]` ambiguous:
/// for some seeds, growing `n` to 2 boxes `y` inside the tick (the probe
/// resolves the reference to option 1; the real build to the pick).
const BOXES_ON_GROWTH: &str = r#"<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n">
  <select name="s">
    <option><number name="a">1</number></option>
    <option><number name="a">2</number><number name="b">3</number></option>
  </select>
</repeatForSequence>
<number name="y">$r[2].s[1]</number>
<numberInput name="m" value="5"/>
<answer name="ans">x</answer>"#;

/// Seeds at which growing `n` boxes `y`.
fn boxing_seeds() -> Vec<u64> {
    (0..12)
        .filter(|&seed| {
            let mut doc = load_with_seed(BOXES_ON_GROWTH, seed).unwrap();
            set(&mut doc, "n", "value", 2.0);
            doc.diagnostics()
                .iter()
                .any(|d| d.kind == cells_core::DiagnosticKind::Error)
        })
        .collect()
}

// An element keeps its essential slots when an element before it is boxed
// on a rebuild (`build/layout.rs`): `m` and the answer's implicit input,
// which the build makes, keep what the student entered.
#[test]
fn an_element_boxed_on_a_rebuild_keeps_later_values() {
    let seeds = boxing_seeds();
    assert!(!seeds.is_empty());
    for seed in seeds {
        let mut doc = load_with_seed(BOXES_ON_GROWTH, seed).unwrap();
        set(&mut doc, "m", "value", 7.0);
        let h = doc.parse_math("x+1").unwrap();
        set(&mut doc, "ans", "response", h);
        let t = set(&mut doc, "n", "value", 2.0);
        assert!(t.rebuilt && t.rebuild_error.is_none(), "seed {seed}");
        assert_eq!(v(&doc, "m", "value"), 7.0, "seed {seed}");
        let response = doc.cell("ans", "response").unwrap();
        assert_eq!(doc.math_text(response), "x + 1", "seed {seed}");
    }
}

// Saved after the box, the state comes back on a fresh load, which finds
// the box again only once the restored count grows the repeat.
#[test]
fn state_saved_after_a_box_comes_back() {
    for seed in boxing_seeds() {
        let mut doc = load_with_seed(BOXES_ON_GROWTH, seed).unwrap();
        set(&mut doc, "n", "value", 2.0);
        set(&mut doc, "m", "value", 7.0);
        let saved = doc.save_state();
        let mut fresh = load_with_seed(BOXES_ON_GROWTH, seed).unwrap();
        fresh.restore_state(&saved).unwrap();
        assert_eq!(v(&fresh, "n", "value"), 2.0, "seed {seed}");
        assert_eq!(v(&fresh, "m", "value"), 7.0, "seed {seed}");
    }
}

// Saved state names an iteration by its path, not by the id a session gave
// its scope, so repeats grown in another order restore to their own
// iterations.
#[test]
fn saved_iterations_restore_whatever_order_they_grew_in() {
    let src = r#"<numberInput name="na" value="1"/><numberInput name="nb" value="1"/>
<repeatForSequence name="ra" length="$na"><numberInput name="xa" value="0"/></repeatForSequence>
<repeatForSequence name="rb" length="$nb"><numberInput name="xb" value="0"/></repeatForSequence>
<number name="a2">$ra[2].xa</number><number name="b2">$rb[2].xb</number>"#;
    let mut doc = load(src).unwrap();
    set(&mut doc, "nb", "value", 2.0);
    set(&mut doc, "b2", "value", 22.0);
    set(&mut doc, "na", "value", 2.0);
    set(&mut doc, "a2", "value", 11.0);
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "a2", "value"), 11.0);
    assert_eq!(v(&fresh, "b2", "value"), 22.0);
}

// The same for nested repeats, whose inner iterations are made in the
// order the session grew them.
#[test]
fn nested_iterations_restore_by_path() {
    let src = r#"<numberInput name="na" value="1"/>
<repeatForSequence name="ra" length="$na">
  <numberInput name="nb" value="1"/>
  <repeatForSequence name="rb" length="$nb"><numberInput name="x" value="0"/></repeatForSequence>
</repeatForSequence>
<number name="x12">$ra[1].rb[2].x</number><number name="x22">$ra[2].rb[2].x</number>"#;
    let mut doc = load(src).unwrap();
    set(&mut doc, "na", "value", 2.0);
    let nb2 = doc.cell("ra[2].nb", "value").unwrap();
    doc.request(&[Request {
        cell: nb2,
        value: 2.0,
    }]);
    set(&mut doc, "x22", "value", 22.0);
    let nb1 = doc.cell("ra[1].nb", "value").unwrap();
    doc.request(&[Request {
        cell: nb1,
        value: 2.0,
    }]);
    set(&mut doc, "x12", "value", 12.0);
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "x12", "value"), 12.0);
    assert_eq!(v(&fresh, "x22", "value"), 22.0);
}

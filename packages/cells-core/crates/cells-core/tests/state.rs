//! Saved state (`document/state.rs`): what a session changed comes back
//! after a reload, including text, expressions and iterations that exist
//! only because a count changed.

mod common;

use cells_core::testing::test_utils::load;
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
    assert_eq!(doc.save_state(), r#"{"state":[],"v":1}"#);
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

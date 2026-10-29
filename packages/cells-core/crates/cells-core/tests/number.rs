//! A literal `<number>` is a value an input or an action can reach, as
//! DoenetML's authors rely on (INT-1, INT-3 and ACT-2 of the principles,
//! `docs/principles-alignment.md` §3.4): it is a value slot the classing
//! (ADR 0018) makes essential when something a student does can write it,
//! and a fixed cell otherwise.

mod common;
use common::{set, v};

use cells_core::testing::test_utils::{dast_json, load};
use cells_core::{Document, LoadOptions};

fn type_into(doc: &mut Document, name: &str, value: f64) -> usize {
    set(doc, name, "value", value).dropped.len()
}

#[test]
fn an_input_bound_to_a_literal_number_writes_it() {
    let mut doc = load(
        r#"<number name="n">3</number><mathInput name="mi" bindValueTo="$n"/>
           <number name="twice">2 $n</number>"#,
    )
    .unwrap();
    assert_eq!(type_into(&mut doc, "mi", 5.0), 0);
    assert_eq!(v(&doc, "n", "value"), 5.0);
    assert_eq!(v(&doc, "mi", "value"), 5.0);
    assert_eq!(v(&doc, "twice", "value"), 10.0);
}

#[test]
fn an_update_value_targeting_a_literal_number_sets_it() {
    let mut doc = load(
        r#"<number name="n">3</number>
           <triggerSet name="t"><label>Go</label><updateValue target="$n" newValue="7"/></triggerSet>"#,
    )
    .unwrap();
    let t = doc.resolve_path("t").unwrap();
    assert!(doc.trigger(t).dropped.is_empty());
    assert_eq!(v(&doc, "n", "value"), 7.0);
}

#[test]
fn dragging_a_point_whose_coordinate_is_a_literal_number_writes_it() {
    let mut doc = load(
        r#"<number name="n">3</number>
           <graph><point name="p">($n, 0)</point></graph>"#,
    )
    .unwrap();
    assert!(set(&mut doc, "p", "x", 8.0).dropped.is_empty());
    assert_eq!(v(&doc, "n", "value"), 8.0);
}

/// Which literal numbers are essential is the walk's decision (ADR 0018):
/// one nothing a student does can reach stays a fixed cell.
#[test]
fn a_literal_number_nothing_reaches_is_a_fixed_cell() {
    let src = r#"<number name="a">1</number>
        <number name="b">2</number><mathInput name="mi" bindValueTo="$b"/>
        <p>$a $b</p>"#;
    let (doc, _) = Document::load(dast_json(src).as_bytes(), LoadOptions::default()).unwrap();
    assert!(doc.is_fixed(doc.cell("a", "value").unwrap()));
    assert!(doc.is_essential(doc.cell("b", "value").unwrap()));
}

/// A written number is a student's state: saved by its name, restored
/// into a fresh load, and left at the author's value when untouched.
#[test]
fn a_written_literal_number_is_saved_and_restored() {
    let src = r#"<number name="n">3</number><mathInput name="mi" bindValueTo="$n"/>"#;
    let mut doc = load(src).unwrap();
    assert!(
        doc.save_state().contains(r#""state":[]"#),
        "{}",
        doc.save_state()
    );
    type_into(&mut doc, "mi", 5.0);
    let saved = doc.save_state();
    assert!(saved.contains(r#""n","value""#), "{saved}");
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "n", "value"), 5.0);
    assert_eq!(v(&fresh, "mi", "value"), 5.0);
}

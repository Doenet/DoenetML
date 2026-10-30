//! `<choiceInput>`: a request on `selectedIndex` lands only when it names
//! a choice. The current core's `selectedIndices` inverse keeps a requested
//! index only when it is an integer from 1 to `numChoices`, and a
//! single-select input given none clears its selection; here the
//! `ChoiceIndex` projection does the same, so any other request chooses
//! none (0).

mod common;

use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::{req, v};

const THREE: &str = r#"<choiceInput name="ci"><choice>a</choice><choice>b</choice><choice>c</choice></choiceInput>"#;

#[test]
fn a_request_naming_a_choice_lands() {
    let mut doc = load(THREE).unwrap();
    assert_eq!(v(&doc, "ci", "selectedIndex"), 0.0);
    for i in [2.0, 3.0, 1.0] {
        doc.request(&[req(&doc, "ci", "selectedIndex", i)]);
        assert_eq!(v(&doc, "ci", "selectedIndex"), i);
        assert_eq!(v(&doc, "ci", "preliminaryIndex"), i);
    }
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_request_naming_no_choice_chooses_none() {
    for asked in [2.5, 7.0, -1.0, f64::NAN, 0.0] {
        let mut doc = load(THREE).unwrap();
        doc.request(&[req(&doc, "ci", "selectedIndex", 2.0)]);
        doc.request(&[req(&doc, "ci", "selectedIndex", asked)]);
        assert_eq!(v(&doc, "ci", "selectedIndex"), 0.0, "asked {asked}");
        // The projection stores what it shows, not the request.
        assert_eq!(v(&doc, "ci", "preliminaryIndex"), 0.0, "asked {asked}");
        assert_eq!(reference::check(&doc), None);
    }
}

/// An infinite ask is dropped before inverting, as for every cell
/// (`Document::request`), so the selection stays.
#[test]
fn an_infinite_request_is_dropped() {
    let mut doc = load(THREE).unwrap();
    doc.request(&[req(&doc, "ci", "selectedIndex", 2.0)]);
    let tick = doc.request(&[req(&doc, "ci", "selectedIndex", f64::INFINITY)]);
    assert_eq!(tick.dropped.len(), 1);
    assert_eq!(v(&doc, "ci", "selectedIndex"), 2.0);
}

#[test]
fn an_input_bound_to_the_index_is_projected_too() {
    let mut doc = load(&format!(
        r#"{THREE}<mathInput name="i" bindValueTo="$ci.selectedIndex"/>"#
    ))
    .unwrap();
    doc.request(&[req(&doc, "i", "value", 3.0)]);
    assert_eq!(v(&doc, "ci", "selectedIndex"), 3.0);
    doc.request(&[req(&doc, "i", "value", 2.5)]);
    assert_eq!(v(&doc, "ci", "selectedIndex"), 0.0);
    assert_eq!(v(&doc, "i", "value"), 0.0);
}

#[test]
fn an_initial_index_naming_no_choice_shows_none() {
    let doc = load(
        r#"<choiceInput name="ci" selectedIndex="7"><choice>a</choice><choice>b</choice></choiceInput>
           <choiceInput name="cj" selectedIndex="2"><choice>a</choice><choice>b</choice></choiceInput>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "ci", "selectedIndex"), 0.0);
    assert_eq!(v(&doc, "cj", "selectedIndex"), 2.0);
}

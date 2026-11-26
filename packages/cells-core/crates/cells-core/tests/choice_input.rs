//! `<choiceInput>`: a request on `selectedIndex` lands only when it is an
//! integer from 1 to `numChoices`; any other request chooses none, the
//! missing value (ADR 0088).

mod common;

use cells_core::program::is_missing;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_with_seed};
use common::{req, set, v};

const THREE: &str = r#"<choiceInput name="ci"><choice>a</choice><choice>b</choice><choice>c</choice></choiceInput>"#;

#[test]
fn a_request_naming_a_choice_lands() {
    let mut doc = load(THREE).unwrap();
    assert!(is_missing(v(&doc, "ci", "selectedIndex")));
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
        assert!(is_missing(v(&doc, "ci", "selectedIndex")), "asked {asked}");
        // The projection stores what it shows, not the request.
        assert!(
            is_missing(v(&doc, "ci", "preliminaryIndex")),
            "asked {asked}"
        );
        assert_eq!(reference::check(&doc), None);
    }
}

/// An infinite ask is dropped before inverting, so the selection stays.
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
    assert!(is_missing(v(&doc, "ci", "selectedIndex")));
    assert!(is_missing(v(&doc, "i", "value")));
}

#[test]
fn an_initial_index_naming_no_choice_shows_none() {
    let doc = load(
        r#"<choiceInput name="ci" selectedIndex="7"><choice>a</choice><choice>b</choice></choiceInput>
           <choiceInput name="cj" selectedIndex="2"><choice>a</choice><choice>b</choice></choiceInput>"#,
    )
    .unwrap();
    assert!(is_missing(v(&doc, "ci", "selectedIndex")));
    assert_eq!(v(&doc, "cj", "selectedIndex"), 2.0);
}

const ANIMALS: &str =
    r#"<choice>cat</choice><choice>dog</choice><choice>monkey</choice><choice>mouse</choice>"#;

/// `choiceOrder`, the choices' positions as shown (ADR 0053).
fn choice_order(doc: &cells_core::Document, name: &str) -> Vec<f64> {
    let c = doc.resolve_path(name).unwrap();
    doc.prop_cells(c, "choiceOrder")
        .unwrap()
        .iter()
        .map(|cell| doc.cells[cell.index()])
        .collect()
}

#[test]
fn choices_are_shown_in_document_order_unless_shuffled() {
    let doc = load(&format!(
        r#"<choiceInput name="ci">{ANIMALS}</choiceInput>"#
    ))
    .unwrap();
    assert_eq!(choice_order(&doc, "ci"), [1.0, 2.0, 3.0, 4.0]);
    // A second sequence over its own ports: no rows, and no text.
    let ci = doc.resolve_path("ci").unwrap();
    assert_eq!(doc.rendered_text(ci), "catdogmonkeymouse");
}

#[test]
fn a_shuffled_order_is_drawn_from_the_seed_and_keeps_the_last_when_asked() {
    let mut orders = std::collections::BTreeSet::new();
    for seed in 0..12 {
        let src = format!(
            r#"<choiceInput name="ci" shuffleOrder>{ANIMALS}</choiceInput>
               <choiceInput name="cl" shuffleOrder preserveLastChoice>{ANIMALS}</choiceInput>"#
        );
        let doc = load_with_seed(&src, seed).unwrap();
        let order = choice_order(&doc, "ci");
        let mut sorted = order.clone();
        sorted.sort_by(f64::total_cmp);
        assert_eq!(sorted, [1.0, 2.0, 3.0, 4.0], "seed {seed}");
        orders.insert(order.iter().map(|&x| x as u8).collect::<Vec<_>>());
        assert_eq!(choice_order(&doc, "cl")[3], 4.0, "seed {seed}");
        // The same seed draws the same order.
        let again = load_with_seed(&src, seed).unwrap();
        assert_eq!(choice_order(&again, "ci"), order);
    }
    assert!(orders.len() > 1, "the order follows the seed: {orders:?}");
}

#[test]
fn a_shuffled_choice_earns_the_credit_of_the_choice_shown_there() {
    for seed in 0..6 {
        let mut doc = load_with_seed(
            r#"<answer name="a"><choiceInput name="ci" shuffleOrder>
                 <choice>cat</choice><choice credit="1">dog</choice><choice credit="0.5">monkey</choice>
               </choiceInput></answer>"#,
            seed,
        )
        .unwrap();
        let order = choice_order(&doc, "ci");
        let a = doc.resolve_path("a").unwrap();
        for (shown, &child) in order.iter().enumerate() {
            set(&mut doc, "ci", "selectedIndex", (shown + 1) as f64);
            doc.submit(a);
            let want = [0.0, 1.0, 0.5][child as usize - 1];
            assert_eq!(v(&doc, "a", "credit"), want, "seed {seed}, shown {shown}");
        }
        assert_eq!(reference::check(&doc), None);
    }
}

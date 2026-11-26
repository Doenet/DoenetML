//! `<choice>`s written in an `<answer>` are sugar for the `<choiceInput>`
//! the answer makes of them, which outlining makes and the answer plans
//! from its own attributes (ADR 0088).

mod common;

use cells_core::program::is_missing;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_with_seed};
use cells_core::components::ComponentType;
use cells_core::{CellIdx, CompIdx, Document, Request};
use common::v;

/// The one input answer `a` reads: the choice input it made.
fn input_of(doc: &Document, a: &str) -> CompIdx {
    let inputs = doc.answer_inputs(doc.resolve_path(a).unwrap());
    assert_eq!(inputs.len(), 1, "one input");
    inputs[0]
}

fn cell_of(doc: &Document, c: CompIdx, prop: &str) -> CellIdx {
    doc.prop_cells(c, prop).unwrap()[0]
}

fn choose(doc: &mut Document, a: &str, shown: f64) {
    let ci = input_of(doc, a);
    let cell = cell_of(doc, ci, "selectedIndex");
    doc.request(&[Request { cell, value: shown }]);
}

fn submit(doc: &mut Document, a: &str) {
    let a = doc.resolve_path(a).unwrap();
    doc.submit(a);
}

fn order_of(doc: &Document, a: &str) -> Vec<f64> {
    let ci = input_of(doc, a);
    doc.prop_cells(ci, "choiceOrder")
        .unwrap()
        .iter()
        .map(|c| doc.cells[c.index()])
        .collect()
}

const CHOICES: &str = r#"<choice>cat</choice><choice credit="1">dog</choice><choice credit="0.5">monkey</choice>"#;

#[test]
fn the_choices_are_an_input_the_answer_makes_and_credits() {
    let mut doc = load(&format!(
        r#"<answer name="a"><label>Pick</label>{CHOICES}</answer>"#
    ))
    .unwrap();
    let ci = input_of(&doc, "a");
    assert_eq!(doc.component_type(ci), ComponentType::ChoiceInput);
    assert!(is_missing(doc.cells[cell_of(&doc, ci, "selectedIndex").index()]));
    assert_eq!(v(&doc, "a", "credit"), 0.0);
    choose(&mut doc, "a", 2.0);
    assert_eq!(v(&doc, "a", "credit"), 0.0, "credit changes only on submit");
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 1.0);
    choose(&mut doc, "a", 3.0);
    submit(&mut doc, "a");
    assert_eq!(v(&doc, "a", "credit"), 0.5);
    assert_eq!(order_of(&doc, "a"), [1.0, 2.0, 3.0]);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_choice_named_in_the_answer_says_whether_it_is_chosen() {
    let mut doc = load(
        r#"<answer name="a"><choice name="c1">cat</choice><choice name="c2" credit="1">dog</choice></answer>
           <boolean name="b">$c2.selected</boolean><boolean name="b1">$c1.selected</boolean>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "b", "value"), 0.0);
    choose(&mut doc, "a", 2.0);
    assert_eq!(v(&doc, "b", "value"), 1.0);
    assert_eq!(v(&doc, "b1", "value"), 0.0);
}

#[test]
fn the_answer_shuffles_its_choices_as_asked() {
    let mut orders = std::collections::BTreeSet::new();
    for seed in 0..12 {
        let src = format!(
            r#"<answer name="a" shuffleOrder>{CHOICES}<choice>none</choice></answer>
               <answer name="b" shuffleOrder preserveLastChoice>{CHOICES}<choice>none</choice></answer>"#
        );
        let mut doc = load_with_seed(&src, seed).unwrap();
        let order = order_of(&doc, "a");
        let mut sorted = order.clone();
        sorted.sort_by(f64::total_cmp);
        assert_eq!(sorted, [1.0, 2.0, 3.0, 4.0], "seed {seed}");
        orders.insert(order.iter().map(|&x| x as u8).collect::<Vec<_>>());
        assert_eq!(order_of(&doc, "b")[3], 4.0, "seed {seed}");
        // The credit is the one of the choice shown at the place chosen.
        for (shown, &child) in order.iter().enumerate() {
            choose(&mut doc, "a", (shown + 1) as f64);
            submit(&mut doc, "a");
            let want = [0.0, 1.0, 0.5, 0.0][child as usize - 1];
            assert_eq!(v(&doc, "a", "credit"), want, "seed {seed}, shown {shown}");
        }
        assert_eq!(reference::check(&doc), None);
    }
    assert!(orders.len() > 1, "the order follows the seed: {orders:?}");
}

#[test]
fn choices_beside_other_content_stay_refused() {
    let doc = load(r#"<answer name="a"><choice>cat</choice>x</answer>"#).unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .any(|d| d.message.contains("<choice> inside an <answer>")),
        "{:?}",
        doc.diagnostics()
    );
}

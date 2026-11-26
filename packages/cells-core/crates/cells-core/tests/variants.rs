//! A document's variants (ADR 0085): a load names a variant index, which
//! picks the variant's name and seed, and, with unique variants, the
//! combination of picks of every load-time choice.

use std::collections::HashSet;

use cells_core::testing::test_utils::dast_json;
use cells_core::{Document, LoadOptions};

fn load_variant(source: &str, index: f64) -> Document {
    let json = dast_json(source);
    Document::load(
        json.as_bytes(),
        LoadOptions {
            variant: Some(index),
            prune: false,
            ..Default::default()
        },
    )
    .unwrap_or_else(|e| panic!("{source}: {e}"))
    .0
}

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

fn value(doc: &Document, name: &str) -> f64 {
    doc.value(name, "value").unwrap()
}

#[test]
fn a_document_without_a_control_has_a_variant_per_combination() {
    let doc = load_variant("hello", 1.0);
    let v = doc.session.variant.as_ref().unwrap();
    assert_eq!(v.all_possible, vec!["a"]);
    assert_eq!((v.index, v.name.as_str(), v.seed.as_str()), (1, "a", "1"));

    let src = r#"<select name="x">u v w x y z</select>"#;
    let picks: Vec<String> = (1..=12)
        .map(|i| text(&load_variant(src, i as f64), "x"))
        .collect();
    let mut first: Vec<String> = picks[..6].to_vec();
    first.sort();
    assert_eq!(first, ["u", "v", "w", "x", "y", "z"]);
    assert_eq!(picks[6..], picks[..6]);
    let doc = load_variant(src, 3.0);
    assert_eq!(doc.session.variant.as_ref().unwrap().all_possible.len(), 6);
}

#[test]
fn every_variant_is_a_combination_of_its_choices() {
    let src = r#"<selectFromSequence type="letters" name="w" from="m" to="n" />
        <select name="x">x y z</select>
        <selectFromSequence name="y" from="2" to="4" />
        <select name="z">3 7</select>"#;
    let mut seen = HashSet::new();
    for i in 1..=36 {
        let doc = load_variant(src, i as f64);
        let combo = format!(
            "{} {} {} {}",
            text(&doc, "w"),
            text(&doc, "x"),
            value(&doc, "y"),
            text(&doc, "z")
        );
        assert!(seen.insert(combo.clone()), "variant {i} repeats {combo}");
    }
}

#[test]
fn selections_without_replacement_and_with_excludes_are_unique() {
    let src =
        r#"<selectFromSequence name="x" type="letters" from="c" to="m" step="2" exclude="g k" />"#;
    let mut picks: Vec<String> = (1..=4)
        .map(|i| text(&load_variant(src, i as f64), "x"))
        .collect();
    picks.sort();
    assert_eq!(picks, ["c", "e", "i", "m"]);

    let src = r#"<select name="xs" numToSelect="3">w x y z</select>"#;
    let mut seen = HashSet::new();
    for i in 1..=24 {
        let t = text(&load_variant(src, i as f64), "xs");
        assert!(seen.insert(t.clone()), "variant {i} repeats {t}");
    }
}

#[test]
fn a_control_names_seeds_and_limits_variants() {
    let src = r#"<variantControl numVariants="5" seeds="50283 25018 52018 2917392 603962" />
        <selectFromSequence name="n" length="10000000000" />"#;
    let one = load_variant(src, 1.0);
    let v = one.session.variant.as_ref().unwrap();
    assert_eq!(v.all_possible, ["a", "b", "c", "d", "e"]);
    assert_eq!(v.seed, "50283");
    // Indices wrap, round, and a NaN is the first.
    let again = load_variant(src, 1.0 + 5.0 * 7.0);
    assert_eq!(value(&again, "n"), value(&one, "n"));
    assert_eq!(value(&load_variant(src, f64::NAN), "n"), value(&one, "n"));
    let two = load_variant(src, 2.48 - 5.0);
    assert_eq!(two.session.variant.as_ref().unwrap().index, 2);
    assert_ne!(value(&two, "n"), value(&one, "n"));
}

#[test]
fn an_option_is_picked_for_its_variant() {
    let src = r#"<variantControl numVariants="5" variantNames="avocado broccoli cArrot dill Eggplant"/>
        <select name="s">
          <option selectForVariants="Dill"><math name="x">d</math></option>
          <option selectForVariants="carrot"><math name="x">c</math></option>
          <option selectForVariants="eggplant"><math name="x">e</math></option>
          <option selectForVariants="avocado"><math name="x">a</math></option>
          <option selectForVariants="broccoli"><math name="x">b</math></option>
        </select>"#;
    for (i, want) in [(1, "a"), (3, "c"), (5, "e"), (2, "b")] {
        let doc = load_variant(src, i as f64);
        assert_eq!(text(&doc, "s"), want, "variant {i}");
    }
}

#[test]
fn a_document_takes_the_variants_of_its_one_problem() {
    let src = r#"<problem>
          <variantControl numVariants="2" variantNames="apple orange" />
          <select name="fruit">
            <option selectForVariants="apple"><text>apple</text></option>
            <option selectForVariants="orange"><text>orange</text></option>
          </select>
        </problem>"#;
    for i in 1..=3 {
        let doc = load_variant(src, i as f64);
        let want = ["apple", "orange"][(i - 1) % 2];
        assert_eq!(doc.session.variant.as_ref().unwrap().name, want);
        assert_eq!(text(&doc, "fruit"), want);
    }
}

#[test]
fn problems_with_unique_variants_combine() {
    let src = r#"<problem><selectFromSequence from="1" to="2" name="m" /></problem>
        <problem><selectFromSequence from="3" to="5" name="n" /></problem>"#;
    let mut seen = HashSet::new();
    for i in 1..=6 {
        let doc = load_variant(src, i as f64);
        assert!(seen.insert((value(&doc, "m") as i64, value(&doc, "n") as i64)));
    }
}

#[test]
fn a_shuffle_takes_each_order_once() {
    let src = r#"<shuffle name="sh"><text>a</text><text>b</text><text>c</text></shuffle>"#;
    let mut seen = HashSet::new();
    for i in 1..=6 {
        let t = text(&load_variant(src, i as f64), "sh");
        assert!(seen.insert(t.clone()), "variant {i} repeats {t}");
    }
}

#[test]
fn what_the_compile_makes_is_no_variant_component() {
    // An answer's input, which the compile makes, has no source node.
    let src = r#"<problem>
      <p>Enter <selectFromSequence from="1" to="2" name="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>"#;
    let mut seen = HashSet::new();
    for i in 1..=2 {
        let doc = load_variant(src, i as f64);
        assert_eq!(doc.session.variant.as_ref().unwrap().all_possible.len(), 2);
        seen.insert(value(&doc, "m") as i64);
    }
    assert_eq!(seen.len(), 2);
}

#[test]
fn an_answers_shuffled_choices_take_each_order_once() {
    // The choice input an answer makes of its choices shuffles as the
    // answer says (ADR 0088): one variant per order.
    let src = r#"<answer name="a" shuffleOrder><choice>a</choice><choice>b</choice><choice>c</choice></answer>"#;
    let mut seen = HashSet::new();
    for i in 1..=6 {
        let doc = load_variant(src, i as f64);
        assert_eq!(doc.session.variant.as_ref().unwrap().all_possible.len(), 6);
        let a = doc.resolve_path("a").unwrap();
        let ci = doc.answer_inputs(a)[0];
        let order: Vec<u64> = doc
            .prop_cells(ci, "choiceOrder")
            .unwrap()
            .iter()
            .map(|c| doc.cells[c.index()] as u64)
            .collect();
        assert!(seen.insert(order.clone()), "variant {i} repeats {order:?}");
    }
}

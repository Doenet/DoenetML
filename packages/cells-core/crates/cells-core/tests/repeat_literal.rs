//! `<repeat for="1 2 3">`: a repeat over a literal list, an anonymous
//! static list (ADR 0074), one iteration per piece, the item a value of
//! the repeat's `type`.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn one_iteration_per_piece_of_its_type() {
    let doc = load(
        r#"<p name="m"><repeat for="x^2 y^2" valueName="v"><math>$v + 1</math></repeat></p>
           <p name="n"><repeat for="5 6" type="number" valueName="v"><number>$v * 2</number></repeat></p>
           <p name="t"><repeat for="hello there" type="text" valueName="w"><text>$w</text></repeat></p>
           <p name="b"><repeat for="true false" type="boolean" valueName="b"><boolean>not $b</boolean></repeat></p>
           <p name="d"><repeat for="1 2 3" valueName="v" indexName="i"><number>$v + $i</number></repeat></p>
           <p name="c"><repeat for="1 2"><text>hi</text></repeat></p>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(text(&doc, "m"), "x^2 + 1, y^2 + 1");
    assert_eq!(text(&doc, "n"), "10, 12");
    assert_eq!(text(&doc, "t"), "hello, there");
    assert_eq!(text(&doc, "b"), "false, true");
    assert_eq!(text(&doc, "d"), "2, 4, 6");
    assert_eq!(text(&doc, "c"), "hi, hi");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_piece_may_be_a_reference() {
    let mut doc = load(
        r#"<mathInput name="a" prefill="3"><label>a</label></mathInput>
           <p name="p"><repeat for="$a 7" type="number" valueName="v"><number>$v + 1</number></repeat></p>
           <number name="n">$a</number>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "4, 8");
    type_into(&mut doc, "a", "10");
    assert_eq!(text(&doc, "p"), "11, 8");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_reference_to_a_list_is_its_entries() {
    let doc = load(
        r#"<mathList name="ml">1 2</mathList>
           <sequence name="s" from="5" to="6"/>
           <number name="n7">7</number>
           <p name="p"><repeat for="$ml $s $n7 x" valueName="n"><math>$n^2</math></repeat></p>
           <p name="q"><repeat for="$s 9" type="number" valueName="n"><number>$n^2</number></repeat></p>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(text(&doc, "p"), "1^2, 2^2, 5^2, 6^2, 7^2, x^2");
    assert_eq!(text(&doc, "q"), "25, 36, 81");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn its_iterations_are_addressed_by_index() {
    let doc = load(
        r#"<repeat name="r" for="4 9" type="number" valueName="v"><number name="sq">$v^2</number></repeat>
           <number name="second">$r[2].sq</number>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "second", "value"), 81.0);
}

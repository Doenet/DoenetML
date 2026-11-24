//! Structural sequences (ADR 0041, step 4): a sequence whose count follows
//! a value counts its entries when the document is built, a change of the
//! count is a rebuild that keeps essential values by (scope, position,
//! slot) (ADR 0004, ADR 0017), and a `<repeat for>` iterates over any
//! sequence, its item of the type of the sequence's entries (ADR 0040).

mod common;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &cells_core::Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

/// The value of `prop` of what `path` resolves to.
fn at(doc: &cells_core::Document, path: &str, prop: &str) -> f64 {
    let c = doc.resolve_path(path).unwrap();
    doc.cells[doc.prop_cells(c, prop).unwrap()[0].index()]
}

/// A sequence whose `to` follows an input: its numbers are counted again
/// as it changes, each change a rebuild, and what a student wrote in an
/// iteration of a repeat over it comes back with the iteration.
#[test]
fn a_count_that_follows_an_input_rebuilds_and_keeps_what_was_written() {
    let mut doc = load(
        r#"<numberInput name="n" value="3"/>
           <p name="p"><sequence name="s" from="2" to="$n"/></p>
           <repeat name="r" for="$s" valueName="v">
             <number name="w">$v</number><numberInput name="x"/>
           </repeat>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "2, 3");
    assert_eq!(at(&doc, "r[2].w", "value"), 3.0);
    let x = doc.resolve_path("r[2].x").unwrap();
    let cell = doc.prop_cells(x, "value").unwrap()[0];
    doc.request(&[cells_core::Request { cell, value: 10.0 }]);
    assert_eq!(at(&doc, "r[2].x", "value"), 10.0);

    let t = set(&mut doc, "n", "value", 2.0);
    assert!(t.rebuilt, "a change of the count is a rebuild");
    assert_eq!(text(&doc, "p"), "2");
    assert!(doc.resolve_path("r[2].x").is_none());

    let t = set(&mut doc, "n", "value", 5.0);
    assert!(t.rebuilt);
    assert_eq!(text(&doc, "p"), "2, 3, 4, 5");
    assert_eq!(
        at(&doc, "r[2].x", "value"),
        10.0,
        "iteration 2's input came back as the student left it"
    );
    assert_eq!(at(&doc, "r[4].w", "value"), 5.0);
    assert_eq!(reference::check(&doc), None);
}

/// A `<repeat for>` over a value list, a static sequence and a structural
/// one: as many iterations as entries, the item the entry.
#[test]
fn a_repeat_iterates_over_any_sequence() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/>
           <numberList name="l">3 $n 7</numberList>
           <sequence name="st" from="5" to="7"/>
           <sequence name="sn" length="$n" step="10"/>
           <p name="pl"><repeat for="$l" valueName="v" indexName="i"><number>$v + $i</number></repeat></p>
           <p name="pst"><repeat for="$st" valueName="v"><number>2$v</number></repeat></p>
           <p name="psn"><repeat for="$sn" valueName="v"><number>$v + 1</number></repeat></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "pl"), "4, 4, 10");
    assert_eq!(text(&doc, "pst"), "10, 12, 14");
    assert_eq!(text(&doc, "psn"), "2, 12");
    set(&mut doc, "n", "value", 3.0);
    assert_eq!(text(&doc, "pl"), "4, 5, 10");
    assert_eq!(text(&doc, "psn"), "2, 12, 22");
    assert_eq!(reference::check(&doc), None);
}

/// An item reads its entry where the entry comes from: a write through an
/// input bound to it lands on the list's piece.
#[test]
fn a_write_through_an_item_lands_on_the_entry() {
    let mut doc = load(
        r#"<numberList name="l">1 2 3</numberList>
           <repeat name="r" for="$l" valueName="v">
             <mathInput name="x" bindValueTo="$v"/>
           </repeat>
           <p name="p">$l</p>"#,
    )
    .unwrap();
    for d in doc.diagnostics() {
        assert!(!d.code.starts_with("cells-"), "{}", d.message);
    }
    let x = doc.resolve_path("r[2].x").unwrap();
    let cell = doc.prop_cells(x, "value").unwrap()[0];
    doc.request(&[cells_core::Request { cell, value: 9.0 }]);
    assert_eq!(text(&doc, "p"), "1, 9, 3");
    assert_eq!(reference::check(&doc), None);
}

/// A structural sequence's excludes may be references, math, and a static
/// sequence's entries spliced; a hidden one shows nothing.
#[test]
fn excludes_and_hide() {
    let mut doc = load(
        r#"<number name="n1">2</number><number name="n2">6</number>
           <booleanInput name="h"/>
           <sequence name="every3" hide from="2" to="10" step="3"/>
           <p name="p1"><sequence from="0" to="8" exclude="$n1 $n2-$n1 $n2/$n1 $n2+1"/></p>
           <p name="p2"><sequence from="1" to="10" exclude="$every3 9"/></p>
           <p name="p3"><sequence hide="$h" length="$n1"/></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p1"), "0, 1, 5, 6, 8");
    assert_eq!(text(&doc, "p2"), "1, 3, 4, 6, 7, 10");
    assert_eq!(text(&doc, "p3"), "1, 2");
    set(&mut doc, "h", "value", 1.0);
    assert_eq!(text(&doc, "p3"), "");
}

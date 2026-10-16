//! The count-independent cycle check (ADR 0012): a loop that closes at a
//! count the document can reach is rejected at load, whatever the count
//! at load; a loop that only marches through the iterations is not.

use cells_core::testing::test_utils::{dast_json, load};
use cells_core::{Document, Error, LoadOptions};

fn load_unchecked(src: &str) -> cells_core::Result<Document> {
    Document::load(
        dast_json(src).as_bytes(),
        LoadOptions {
            check_cycles: false,
            ..Default::default()
        },
    )
    .map(|(d, _)| d)
}

/// The document loads with the check off and fails with it on.
fn rejected(src: &str, naming: &str) {
    load_unchecked(src).unwrap_or_else(|e| panic!("loads without the check: {e}"));
    let err = load(src).unwrap_err();
    match err {
        Error::Cycle(at) => assert!(at.contains(naming), "cycle names '{at}', not '{naming}'"),
        other => panic!("expected a cycle, got {other}"),
    }
}

#[test]
fn a_literal_index_past_the_count_at_load_closes_a_loop() {
    rejected(
        r#"<numberInput name="n" value="1"/>
           <repeatForSequence name="r" length="$n"><number name="x">$y</number></repeatForSequence>
           <number name="y">$r[2].x</number>"#,
        "",
    );
}

#[test]
fn a_two_sided_neighbor_recurrence_is_a_cycle_at_every_count() {
    rejected(
        r#"<numberInput name="n" value="1"/>
           <repeatForSequence name="r" length="$n" indexName="i">
             <number name="x">$r[$i-1].x + $r[$i+1].x</number>
           </repeatForSequence>"#,
        "x",
    );
}

#[test]
fn a_count_reading_its_own_iterations_is_a_cycle() {
    rejected(
        r#"<graph><repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence></graph>
           <boolean name="b">$r[2].p.x > 0</boolean><number name="k">2 - $b</number>"#,
        "r",
    );
}

#[test]
fn recurrences_through_a_sibling_repeat_follow_the_same_rule() {
    // s[j] reads r[j-1], r[i] reads s[i-1]: a march, never a loop.
    load(
        r#"<repeatForSequence name="r" length="3" indexName="i"><number name="x">$s[$i-1].x</number></repeatForSequence>
           <repeatForSequence name="s" length="3" indexName="j"><number name="x">$r[$j-1].x</number></repeatForSequence>"#,
    )
    .unwrap();
    // r[i] reads s[i+1], s[j] reads r[j-1]: closes at every count above one.
    rejected(
        r#"<repeatForSequence name="r" length="1" indexName="i"><number name="x">$s[$i+1].x</number></repeatForSequence>
           <repeatForSequence name="s" length="1" indexName="j"><number name="x">$r[$j-1].x</number></repeatForSequence>"#,
        "x",
    );
}

#[test]
fn a_recurrence_inside_a_nested_repeat_is_legal() {
    let doc = load(
        r#"<repeatForSequence name="o" length="2" indexName="i">
             <repeatForSequence name="r" length="$i" indexName="j">
               <op name="x" kind="default" args="$r[$j-1].x $i"/>
             </repeatForSequence>
           </repeatForSequence>"#,
    )
    .unwrap();
    assert!(doc.structure_settled());
}

#[test]
fn an_inner_count_reading_its_outer_iteration_is_legal() {
    let doc = load(
        r#"<repeatForSequence name="o" length="2" indexName="i">
             <number name="m">$i</number>
             <repeatForSequence name="r" length="$m"><number name="x">1</number></repeatForSequence>
           </repeatForSequence>"#,
    )
    .unwrap();
    assert!(doc.structure_settled());
}

// The probe clamps an index into a collect only when the collect gathers
// from a repeat; an index past a fixed gathered set is missing at every
// count and closes no loop.
#[test]
fn a_collect_over_fixed_items_is_not_clamped() {
    let doc = load(
        r#"<repeatForSequence name="r" length="2"><number name="x">1</number></repeatForSequence>
           <graph name="g"><point name="p1">($y,0)</point><point name="p2">(1,1)</point></graph>
           <collect name="c" from="$g" componentType="point"/>
           <number name="y">$c[5].x</number>"#,
    )
    .unwrap();
    assert!(doc.structure_settled());
}

#[test]
fn a_document_without_repeats_is_not_probed() {
    let (_, t) = Document::load(
        dast_json(r#"<point name="p"/><number>$p.x</number>"#).as_bytes(),
        Default::default(),
    )
    .unwrap();
    assert_eq!(t.cycle_check.as_nanos(), 0);
    let (_, t) = Document::load(
        dast_json(r#"<repeatForSequence name="r" length="2"><point/></repeatForSequence>"#)
            .as_bytes(),
        Default::default(),
    )
    .unwrap();
    assert!(t.cycle_check.as_nanos() > 0);
}

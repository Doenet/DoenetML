//! Document-wide counters (ADR 0044): figures and tables share one,
//! footnotes have their own, each counted in document order through the
//! active cases only, as the current core's `Figure.js`, `Table.js` and
//! `Footnote.js` count (`sectioning.test.ts`, "figures and tables are
//! numbered in their own sequence").

mod common;

use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::set;

fn number(doc: &Document, name: &str) -> Option<usize> {
    doc.counter_number(doc.resolve_path(name).unwrap())
}

#[test]
fn figures_and_tables_share_a_counter_apart_from_the_sections() {
    let doc = load(
        r#"<section name="a"/>
<figure name="f1"><caption>a</caption></figure>
<p><figure name="f2"><caption>b</caption></figure></p>
<section name="b"><table name="t3"><title>t</title><tabular><row><cell>1</cell></row></tabular></table></section>
<figure name="f4"/>"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "f1"), Some(1));
    assert_eq!(number(&doc, "f2"), Some(2));
    assert_eq!(number(&doc, "t3"), Some(3));
    assert_eq!(number(&doc, "f4"), Some(4));
    assert_eq!(
        doc.value("b", "number"),
        Some(2.0),
        "no division counts them"
    );
    assert_eq!(number(&doc, "a"), None, "a section takes no counter");
}

#[test]
fn footnotes_have_their_own_counter() {
    let doc = load(
        r#"<figure name="f"/>
<p>a<footnote name="n1">one</footnote> b<footnote name="n2">two</footnote></p>
<table name="t"/>
<p><footnote name="n3">three</footnote></p>"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "n1"), Some(1));
    assert_eq!(number(&doc, "n2"), Some(2));
    assert_eq!(number(&doc, "n3"), Some(3));
    assert_eq!(number(&doc, "t"), Some(2));
}

#[test]
fn number_false_takes_no_number_and_leaves_no_gap() {
    let doc = load(
        r#"<booleanInput name="on"/>
<figure name="f1" number="false"/>
<figure name="f2"/>
<table name="t3" number="$on"/>
<figure name="f4"/>"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "f1"), None);
    assert_eq!(number(&doc, "f2"), Some(1));
    assert_eq!(number(&doc, "t3"), None);
    assert_eq!(number(&doc, "f4"), Some(2));
    let mut doc = doc;
    set(&mut doc, "on", "value", 1.0);
    assert_eq!(number(&doc, "t3"), Some(2));
    assert_eq!(number(&doc, "f4"), Some(3));
    let t3 = doc.resolve_path("t3").unwrap();
    let flag = doc.comp_cells(t3)[0];
    assert!(doc.counter_reads(t3).contains(&flag));
}

/// Only an active case counts, and the number follows the case that is.
#[test]
fn counted_through_the_active_cases_only() {
    let mut doc = load(
        r#"<booleanInput name="b"/>
<figure name="f1"/>
<conditionalContent>
  <case condition="$b"><figure name="inCase"/><footnote name="fn">x</footnote></case>
  <else><table name="inElse"/></else>
</conditionalContent>
<figure name="f3"/>"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "f1"), Some(1));
    assert_eq!(number(&doc, "inElse"), Some(2));
    assert_eq!(number(&doc, "f3"), Some(3));
    // What a reader of f3's number watches: the two cases' `active`
    // cells, and the `number` flags of f1, inElse and f3.
    let f3 = doc.resolve_path("f3").unwrap();
    assert_eq!(doc.counter_reads(f3).len(), 5);
    set(&mut doc, "b", "value", 1.0);
    assert_eq!(number(&doc, "inCase"), Some(2));
    assert_eq!(number(&doc, "fn"), Some(1));
    assert_eq!(number(&doc, "f3"), Some(3));
}

/// A repeat's figures are counted in each iteration, in order.
#[test]
fn counted_through_a_repeat() {
    let doc = load(
        r#"<repeatForSequence name="r" from="1" to="3"><figure name="f"/></repeatForSequence>
<figure name="after"/>"#,
    )
    .unwrap();
    assert_eq!(number(&doc, "r[1].f"), Some(1));
    assert_eq!(number(&doc, "r[3].f"), Some(3));
    assert_eq!(number(&doc, "after"), Some(4));
}

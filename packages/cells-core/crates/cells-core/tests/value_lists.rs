//! Value lists as static sequences (ADR 0041, step 2): what their entries
//! show, how a nested list, an element child and math text contribute
//! entries, and how a parent that reads one value reads a list
//! (decision 5).

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn a_math_list_shows_its_expressions() {
    let doc = load(
        r#"<math name="m">2z</math>
           <number name="n">5</number>
           <mathList name="a">a b</mathList>
           <mathList name="l">x y+1 $m $n <math>q</math> $a</mathList>
           <p name="p">$l</p>
           <p name="e">$l[1] $l[5] $a[2]</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "x, y + 1, 2 z, 5, q, a, b");
    assert_eq!(text(&doc, "e"), "x q b");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_entry_of_a_math_list_is_math_inside_math() {
    let doc = load(
        r#"<mathList name="l">x y</mathList>
           <math name="m">$l[1] + $l[2]</math>
           <p name="p">$m</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "x + y");
}

/// A piece is given state: a write through its entry lands on it, and a
/// list reading it follows.
#[test]
fn a_write_through_a_math_entry_lands_on_its_piece() {
    let options = cells_core::LoadOptions {
        classify: false,
        prune: false,
        ..Default::default()
    };
    let src = r#"<mathList name="l">x y</mathList>
           <mathList name="c">$l z</mathList>
           <p name="p">$c</p>"#;
    let json = cells_core::testing::test_utils::dast_json(src);
    let (mut doc, _) = Document::load(json.as_bytes(), options).unwrap();
    assert_eq!(text(&doc, "p"), "x, y, z");
    let h = doc.parse_math("w^2").unwrap();
    set_unchecked(&mut doc, "c", "math2", h);
    assert_eq!(text(&doc, "p"), "x, w^2, z");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_number_list_reads_math_and_element_children() {
    let doc = load(
        r#"<p name="p"><numberList name="l">-1 8/2 <number>5</number> 9 <math>1+1</math></numberList></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "-1, 4, 5, 9, 2");
}

#[test]
fn nested_lists_contribute_their_entries() {
    let doc = load(
        r#"<textList name="a">b c</textList>
           <p name="p"><textList name="l">a $a <text>d</text> <textList>e f</textList></textList></p>
           <p name="n">$l.numComponents</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "a, b, c, d, e, f");
    assert_eq!(text(&doc, "n"), "6");
}

/// A `<math>` child that is a list gives its items as entries when it is
/// the list's one child, or when `mergeMathLists` says so; not when it
/// says not to.
#[test]
fn a_math_child_that_is_a_list_is_merged() {
    let doc = load(
        r#"<p name="one"><numberList maxNumber="3"><math>1,2,3,4,5</math></numberList></p>
           <p name="two"><mathList mergeMathLists="true"><math>a</math><math>b,c</math></mathList></p>
           <p name="no"><mathList mergeMathLists="false"><math>b</math></mathList></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "one"), "1, 2, 3");
    assert_eq!(text(&doc, "two"), "a, b, c");
    assert_eq!(text(&doc, "no"), "b");
}

/// A list of no entries is the missing value where one value is read.
#[test]
fn an_empty_list_is_the_missing_value() {
    let doc = load(
        r#"<numberList name="l"/>
           <number name="n">$l</number>
           <sum name="s">$l 2</sum>"#,
    )
    .unwrap();
    assert!(v(&doc, "n", "value").is_nan());
    assert_eq!(v(&doc, "s", "value"), 2.0);
}

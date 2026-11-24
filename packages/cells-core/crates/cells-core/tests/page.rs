//! `<page>`: both numbering sequences pass through it (ADR 0058), in the
//! scenarios of the current core's `page.test.ts`.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::type_into;

fn number(doc: &Document, name: &str) -> String {
    doc.section_number(doc.resolve_path(name).unwrap()).unwrap()
}

fn list_item(doc: &Document, name: &str) -> bool {
    doc.is_list_item(doc.resolve_path(name).unwrap())
}

fn numbers(src: &str, names: &[&str]) -> Vec<String> {
    let doc = load(src).unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(reference::check(&doc), None);
    names.iter().map(|n| number(&doc, n)).collect()
}

#[test]
fn problems_each_on_a_page_in_a_problems_list_are_its_items() {
    let doc = load(
        r#"<problems name="ps">
  <page name="p1"><problem name="a"><p>a</p></problem></page>
  <page name="p2"><problem name="b"><p>b</p></problem></page>
  <page name="p3"><problem name="c"><p>c</p></problem></page>
</problems>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    for (name, n) in [("a", "1"), ("b", "2"), ("c", "3")] {
        assert!(list_item(&doc, name), "{name}");
        assert_eq!(number(&doc, name), n);
    }
}

#[test]
fn problems_beside_a_page_continue_its_numbering() {
    assert_eq!(
        numbers(
            r#"<problems>
  <problem name="a"><p>a</p></problem>
  <page>
    <problem name="b"><p>b</p></problem>
    <problem name="c"><p>c</p></problem>
  </page>
  <problem name="d"><p>d</p></problem>
</problems>"#,
            &["a", "b", "c", "d"]
        ),
        ["1", "2", "3", "4"]
    );
}

#[test]
fn sections_on_pages_are_numbered_as_if_written_beside_each_other() {
    assert_eq!(
        numbers(
            r#"<page><section name="a"><p>a</p></section></page>
<page><section name="b"><p>b</p></section></page>
<section name="c"><subsection name="d"/><page><subsection name="e"/></page></section>"#,
            &["a", "b", "c", "d", "e"]
        ),
        ["1", "2", "3", "3.1", "3.2"]
    );
}

#[test]
fn a_page_outside_a_list_does_not_make_its_sections_list_items() {
    let doc = load(
        r#"<section name="s"><page name="p"><problem name="a"><p>a</p></problem></page></section>"#,
    )
    .unwrap();
    assert!(!list_item(&doc, "a"));
    assert_eq!(number(&doc, "a"), "1");
}

#[test]
fn parts_of_a_problem_are_numbered_through_a_page() {
    let doc = load(
        r#"<problem name="p"><part name="a"/><page><part name="b"/></page><part name="c"/></problem>
<p name="t">$b.title; $c.sectionNumber</p>"#,
    )
    .unwrap();
    assert_eq!(
        ["a", "b", "c"].map(|n| number(&doc, n)),
        ["1", "2", "3"].map(String::from)
    );
    assert_eq!(
        doc.rendered_text(doc.resolve_path("t").unwrap()),
        "Part 2; 3"
    );
}

#[test]
fn a_section_is_scored_on_the_answers_inside_a_page() {
    let mut doc = load(
        r#"<mathInput name="m1"/><mathInput name="m2"/>
<problems name="ps" aggregateScores>
  <page><problem name="a"><p><answer name="ans1" response="$m1">1</answer></p></problem></page>
  <page><problem name="b"><p><answer name="ans2" response="$m2">2</answer></p></problem></page>
</problems>"#,
    )
    .unwrap();
    type_into(&mut doc, "m1", "1");
    doc.submit(doc.resolve_path("ans1").unwrap());
    assert_eq!(doc.value("ps", "creditAchieved"), Some(0.5));
}

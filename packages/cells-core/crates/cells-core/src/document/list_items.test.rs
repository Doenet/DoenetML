//! Where a list item's number lines up (ADR 0084), as `lists.test.ts`
//! reads it.

use crate::document::CompIdx;
use crate::testing::test_utils::load;

fn find(doc: &crate::Document, name: &str) -> CompIdx {
    doc.resolve_path(name)
        .unwrap_or_else(|| panic!("no {name}"))
}

#[test]
fn an_item_is_led_by_its_first_child_that_renders() {
    let doc = load(
        r#"<ol><li name="a"><p name="h" hide>setup</p><div name="d"><graph name="g" /></div></li>
<li name="b">Some text <graph name="g2" /></li><li name="c"><p name="p">text</p></li></ol>"#,
    )
    .unwrap();
    let (a, d, g) = (find(&doc, "a"), find(&doc, "d"), find(&doc, "g"));
    assert_eq!(doc.list_item_targets(a), vec![d]);
    assert_eq!(doc.list_item_targets(d), vec![g]);
    assert!(doc.renders_inline_for_list_item(g));
    assert!(!doc.renders_inline_for_list_item(find(&doc, "h")));
    assert_eq!(doc.list_item_inline_alignment(d), "flex-start");
    assert_eq!(doc.first_child_list_item_alignment(a), "flex-start");
    // Text leads: no component does.
    let b = find(&doc, "b");
    assert!(doc.list_item_targets(b).is_empty());
    assert_eq!(doc.first_child_list_item_alignment(b), "none");
    assert!(!doc.renders_inline_for_list_item(find(&doc, "g2")));
    // A paragraph asks for its first line.
    assert_eq!(doc.list_item_inline_alignment(find(&doc, "p")), "baseline");
    assert_eq!(
        doc.first_child_list_item_alignment(find(&doc, "c")),
        "baseline"
    );
}

#[test]
fn an_answer_forwards_to_its_block_choice_input() {
    let doc = load(
        r#"<ol><li name="a"><answer name="ans"><choiceInput name="ci"><label>Pick</label>
<choice credit="1">A</choice><choice>B</choice></choiceInput></answer></li></ol>"#,
    )
    .unwrap();
    let (ans, ci) = (find(&doc, "ans"), find(&doc, "ci"));
    assert_eq!(doc.list_item_targets(find(&doc, "a")), vec![ans]);
    assert_eq!(doc.list_item_inline_alignment(ans), "flex-start");
    assert!(!doc.renders_inline_for_list_item(ans));
    assert!(doc.renders_inline_for_list_item(ci));
}

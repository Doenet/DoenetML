//! Dynamic sequences (ADR 0041, decision 2 and step 5): a capped list,
//! `cap` entries padded with the missing value and a live length, whose
//! rows hide past it, whose text and paths stop at it.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn an_intersection_shows_its_points_up_to_its_live_length() {
    let mut doc = load(
        r#"<graph>
             <point name="P">(3,4)</point>
             <circle name="c" center="$P" radius="1"/>
             <line name="l" through="(4,1) (4,-4)"/>
             <intersection name="int">$l $c</intersection>
           </graph>
           <booleanInput name="h"/>
           <p name="p">At: <intersection name="int2" hide="$h">$l $c</intersection></p>
           <p name="q"><intersection asList="false" extend="$int"/></p>"#,
    )
    .unwrap();
    // Tangent: one point; the path to the second names nothing.
    assert_eq!(text(&doc, "p"), "At: (4, 4)");
    assert!(doc.resolve_path("int[1]").is_some());
    assert!(doc.resolve_path("int[2]").is_none());
    move_point(&mut doc, "P", 4.0, 5.0);
    assert_eq!(text(&doc, "p"), "At: (4, 6), (4, 4)");
    assert_eq!(text(&doc, "q"), "(4, 6)(4, 4)");
    assert!(doc.resolve_path("int[2]").is_some());
    // Hidden by the author: no text, though it has its points.
    set(&mut doc, "h", "value", 1.0);
    assert_eq!(text(&doc, "p"), "At: ");
    assert!(doc.resolve_path("int2[2]").is_some());
    move_point(&mut doc, "P", 9.0, 5.0);
    assert!(doc.resolve_path("int[1]").is_none());
    assert_eq!(reference::check(&doc), None);
}

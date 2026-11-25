//! `$P.label` (ADR 0075): a reference to a component's `<label>` child,
//! which ADR 0024 makes a component of it, read as any reference to that
//! label is: in text, its text.

mod common;
use cells_core::Document;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn a_label_reference_reads_the_label_child() {
    let mut doc = load(
        r#"<numberInput name="n" value="3"><label>count</label></numberInput>
           <graph><shortDescription>points</shortDescription>
             <point name="P1"><label>P</label>(5,6)</point>
             <point name="P2">(1,3)<label>$P1.label'</label></point>
             <point name="Q"><label>Q is $n</label>(1,1)</point>
           </graph>
           <p name="p1">Label: $P1.label</p>
           <p name="p2">Label: $P2.label</p>
           <p name="q">$Q.label</p>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(text(&doc, "p1"), "Label: P");
    assert_eq!(text(&doc, "p2"), "Label: P'");
    assert_eq!(text(&doc, "q"), "Q is 3");
    doc.request(&[req(&doc, "n", "value", 4.0)]);
    assert_eq!(text(&doc, "q"), "Q is 4");
}

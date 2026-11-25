//! `<image>` and `<video>` (ADR 0078): their layout settings, texts
//! settled from their literal attributes.

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load_unpruned as load;

/// The text of `name`'s prop `prop`.
fn text(doc: &Document, name: &str, prop: &str) -> String {
    let c = doc.resolve_path(name).unwrap();
    let cells = doc.prop_cells(c, prop).unwrap();
    doc.text_value(cells[0])
}

#[test]
fn a_size_is_its_preset_or_the_nearest_to_its_width() {
    let doc = load(
        r#"<image name="i" decorative />
           <image name="tiny" size="Tiny" decorative />
           <image name="invalid" size="invalid" decorative />
           <image name="w600" width="600" decorative />
           <image name="p90" width="90%" decorative />
           <image name="bad" width="bad" decorative />
           <video name="v"><shortDescription>v</shortDescription></video>
           <video name="w100" width="100px"><shortDescription>v</shortDescription></video>"#,
    )
    .unwrap();
    for (name, size) in [
        ("i", "medium"),
        ("tiny", "tiny"),
        ("invalid", "medium"),
        ("w600", "large"),
        ("p90", "full"),
        ("bad", "medium"),
        ("v", "full"),
        ("w100", "tiny"),
    ] {
        assert_eq!(text(&doc, name, "size"), size, "{name}");
    }
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn alignment_and_display_take_their_defaults_when_invalid() {
    let doc = load(
        r#"<image name="i" decorative />
           <image name="left" horizontalAlign="left" displayMode="inline" decorative />
           <image name="invalid" horizontalAlign="up" displayMode="sideways" decorative />"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "i", "horizontalAlign"), "center");
    assert_eq!(text(&doc, "i", "displayMode"), "block");
    assert_eq!(text(&doc, "left", "horizontalAlign"), "left");
    assert_eq!(text(&doc, "left", "displayMode"), "inline");
    assert_eq!(text(&doc, "invalid", "horizontalAlign"), "center");
    assert_eq!(text(&doc, "invalid", "displayMode"), "block");
}

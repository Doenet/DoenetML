//! Styles settled at load (ADR 0084), as a reader reads them.

use crate::document::CompIdx;
use crate::testing::test_utils::load;

fn find(doc: &crate::Document, name: &str) -> CompIdx {
    doc.resolve_path(name)
        .unwrap_or_else(|| panic!("no {name}"))
}

fn style(src: &str, name: &str) -> serde_json::Value {
    let doc = load(src).unwrap();
    serde_json::from_str(&doc.selected_style(find(&doc, name)).0).unwrap()
}

fn number(src: &str, name: &str) -> f64 {
    let doc = load(src).unwrap();
    doc.style_number(find(&doc, name)).0
}

#[test]
fn a_component_takes_the_default_table_s_style() {
    let s = style(r#"<graph><point name="P" styleNumber="2" /></graph>"#, "P");
    assert_eq!(s["markerColor"], "#D4042D");
    assert_eq!(s["markerStyle"], "square");
    assert_eq!(s["markerColorWord"], "red");
    assert_eq!(s["backgroundColor"], "");
    // A number no table names is the default style.
    let s = style(r#"<graph><point name="P" styleNumber="9" /></graph>"#, "P");
    assert_eq!(s["markerColor"], "#1f5dff");
    assert_eq!(s["markerFilled"], true);
}

#[test]
fn a_definition_applies_over_its_scope_s_table() {
    let src = r#"<setup><styleDefinition styleNumber="2" markerColor="Green" /></setup>
<section><styleDefinition styleNumber="2" markerStyle="diamond" />
  <graph><point name="Q" styleNumber="2" /></graph>
</section>
<graph><point name="P" styleNumber="2" /></graph>"#;
    let p = style(src, "P");
    assert_eq!(p["markerColor"], "green");
    assert_eq!(p["markerColorWord"], "green");
    assert_eq!(p["markerStyle"], "square");
    let q = style(src, "Q");
    assert_eq!(q["markerColor"], "green");
    assert_eq!(q["markerStyle"], "diamond");
    assert_eq!(q["markerStyleWord"], "diamond");
}

#[test]
fn a_component_s_override_attributes_apply_over_its_style() {
    let s = style(
        r#"<graph><point name="P" markerStyle="triangleUp" markerFilled="false" /></graph>"#,
        "P",
    );
    assert_eq!(s["markerStyle"], "triangleup");
    assert_eq!(s["markerStyleWord"], "triangle");
    assert_eq!(s["markerFilled"], false);
    let s = style(r#"<graph><line name="l" lineWidth="1" /></graph>"#, "l");
    assert_eq!(s["lineWidth"], 1.0);
    assert_eq!(s["lineWidthWord"], "thin");
}

#[test]
fn the_style_number_is_the_nearest_written() {
    let src = r#"<graph styleNumber="2">
  <group styleNumber="4"><point name="P" /><point name="R" styleNumber="3" /></group>
  <point name="Q" />
</graph>
<graph extend="$g0" name="g1" styleNumber="5" />
<graph name="g0"><point name="S" /></graph>"#;
    assert_eq!(number(src, "P"), 4.0);
    assert_eq!(number(src, "R"), 3.0);
    assert_eq!(number(src, "Q"), 2.0);
    assert_eq!(number(src, "S"), 1.0);
    assert_eq!(number(src, "g1.S"), 5.0);
}

#[test]
fn a_palette_restarts_the_table_and_cycles() {
    let src = r#"<styleDefinition styleNumber="1" markerColor="green" />
<section><stylePalette palette="OkabeIto" />
  <graph><point name="P" /><point name="Q" styleNumber="9" /></graph>
</section>"#;
    let p = style(src, "P");
    let q = style(src, "Q");
    assert_ne!(p["markerColor"], "green");
    assert_eq!(p["markerColor"], q["markerColor"].clone());
}

#[test]
fn a_definition_with_too_little_contrast_is_reported_at_the_latest_writer() {
    let doc = load(
        r##"<styleDefinition styleNumber="9" lineColor="#000000" />
<styleDefinition styleNumber="9" lineOpacity="0.2" />"##,
    )
    .unwrap();
    let found: Vec<_> = doc
        .diagnostics()
        .iter()
        .filter(|d| d.code == "doenet-a0007")
        .collect();
    assert_eq!(found.len(), 2, "{found:?}");
    assert!(found[0].message.starts_with(
        "Style definition 9 has insufficient contrast for line color against the canvas"
    ));
    assert!(found[1].message.contains("(dark mode)"));
}

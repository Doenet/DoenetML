//! Which cells leave the core (`Document::output_cells`, ADR 0019): the
//! props each definition marks `rendered`, of the components that are
//! rendered, and the props it marks `score`. The viewer's test checks its
//! renderers' reads against these; this checks the marks and the rule for
//! which components are rendered.

mod common;

use cells_core::Document;
use cells_core::components::ComponentType;
use cells_core::testing::test_utils::load;

fn cells(doc: &Document, name: &str, prop: &str) -> Vec<u32> {
    let c = doc
        .resolve_path(name)
        .unwrap_or_else(|| panic!("no {name}"));
    doc.prop_cells(c, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"))
}

fn is_output(doc: &Document, cell: u32) -> bool {
    doc.output_cells().binary_search(&cell).is_ok()
}

/// What the viewer's renderers read: each one's cells are outputs.
#[test]
fn what_a_renderer_reads_is_an_output() {
    let doc = load(
        r#"
<graph name="g">
  <point name="p">(1,2)</point>
  <line name="l" through="(0,0) (1,1)"/>
  <lineSegment name="s" endpoints="(0,0) (1,0)"/>
  <circle name="c" through="(0,0) (2,0) (0,2)"/>
  <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
</graph>
<number name="n">3</number>
<clampNumber name="cn">5</clampNumber>
<math name="m">x+1</math>
<boolean name="bo">true</boolean>
<text name="tx">hi</text>
<math name="tu">(1,2,3)</math>
<numberInput name="ni"/>
<booleanInput name="b"/>
<mathInput name="mi"/>
<textInput name="ti"/>
<slider name="sl" from="0" to="10"/>
<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>
<hint name="h"><p>help</p></hint>
<section name="sec"><answer name="a">2x</answer></section>
<conditionalContent name="cc"><case condition="$n > 1"><p>big</p></case></conditionalContent>
"#,
    )
    .unwrap();
    for (name, props) in [
        ("g", &["xmin", "xmax", "ymin", "ymax"][..]),
        ("p", &["x", "y", "hide"]),
        ("l", &["x1", "y1", "x2", "y2", "basedOnDirection"]),
        ("s", &["x1", "y1", "x2", "y2"]),
        ("c", &["cx", "cy", "radius"]),
        ("pg", &["numVertices", "vertices"]),
        ("n", &["value"]),
        ("cn", &["value"]),
        ("m", &["value", "expr"]),
        ("bo", &["value"]),
        ("tx", &["value"]),
        ("tu", &["n", "x1", "x8"]),
        ("ni", &["value"]),
        ("b", &["value"]),
        ("mi", &["value", "expr"]),
        ("ti", &["value"]),
        ("sl", &["from", "to", "step", "value"]),
        ("ci", &["selectedIndex"]),
        ("h", &["open"]),
        ("sec", &["number", "includeParentNumber", "label"]),
        ("a", &["credit", "numSubmissions"]),
        ("cc", &["hide"]),
    ] {
        for prop in props {
            for cell in cells(&doc, name, prop) {
                assert!(is_output(&doc, cell), "{name}.{prop} (cell {cell})");
            }
        }
    }
}

/// What no renderer reads, and what is not rendered: a prop no renderer
/// draws, a shape outside a graph, a `<setup>`'s content, an award, a
/// function no renderer draws yet.
#[test]
fn what_nothing_reads_is_not_an_output() {
    let doc = load(
        r#"
<graph>
  <circle name="c" center="(0,0)" radius="2"/>
  <function name="f">x^2</function>
</graph>
<line name="outside" through="(0,0) (1,1)"/>
<setup><number name="hidden">$sl + 1</number></setup>
<slider name="sl" from="0" to="10"/>
<answer name="a"><award name="aw">2x</award></answer>
"#,
    )
    .unwrap();
    for (name, prop) in [
        ("c", "area"),
        ("c", "diameter"),
        ("outside", "x1"),
        ("outside", "slope"),
        ("hidden", "value"),
        ("sl", "index"),
        ("f", "samples"),
    ] {
        for cell in cells(&doc, name, prop) {
            assert!(!is_output(&doc, cell), "{name}.{prop} (cell {cell})");
        }
    }
    let rendered = doc.rendered_components();
    for (name, is) in [
        ("c", true),
        ("outside", false),
        ("hidden", false),
        ("sl", true),
        ("a", true),
        ("aw", false),
        ("f", false),
    ] {
        let c = doc.resolve_path(name).unwrap();
        assert_eq!(rendered[c as usize], is, "{name} rendered");
    }
}

/// A score is an output wherever it is: the document's credit, a
/// section's and an answer's, even with no renderer to draw it.
#[test]
fn scores_are_outputs() {
    let doc = load(
        r#"<problem name="pr"><answer name="a">2x</answer></problem>
<setup><answer name="unseen">x</answer></setup>"#,
    )
    .unwrap();
    for (name, prop) in [
        ("pr", "creditAchieved"),
        ("a", "credit"),
        ("unseen", "credit"),
    ] {
        for cell in cells(&doc, name, prop) {
            assert!(is_output(&doc, cell), "{name}.{prop} (cell {cell})");
        }
    }
    let credit = doc.comp_cells(doc.root)[ComponentType::Document
        .prop_index("creditAchieved")
        .unwrap()];
    assert!(is_output(&doc, credit), "document.creditAchieved");
}

/// Whether some component's prop marked `read_by_action` is `cell`.
fn read_by_action(doc: &Document, cell: u32) -> bool {
    (0..doc.components.len() as u32).any(|c| {
        let ty = doc.component_type(c);
        doc.comp_cells(c)
            .iter()
            .enumerate()
            .any(|(pi, &k)| k == cell && ty.is_read_by_action_prop(pi))
    })
}

/// What an action reads is marked: every cell a submit copies from, and
/// every `<updateValue>`'s new value a press requests.
#[test]
fn what_an_action_reads_is_marked() {
    let doc = load(
        r#"<mathInput name="x"/><mathInput name="y"/>
<answer name="a"><award><when>$x + $y = 3</when></award></answer>
<answer name="b">2x</answer>
<boolean name="k"/>
<triggerSet name="t"><label>Go</label><updateValue target="$k" newValue="true"/></triggerSet>"#,
    )
    .unwrap();
    let mut read = 0;
    for c in 0..doc.components.len() as u32 {
        match doc.component_type(c) {
            ComponentType::Answer => {
                for (response, _) in doc.answer_responses(c) {
                    assert!(read_by_action(&doc, response), "a response of {c}");
                    read += 1;
                }
            }
            ComponentType::UpdateValue => {
                let cell =
                    doc.comp_cells(c)[ComponentType::UpdateValue.prop_index("newValue").unwrap()];
                assert!(read_by_action(&doc, cell), "newValue of {c}");
                read += 1;
            }
            _ => {}
        }
    }
    // a's two responses, b's one, the one newValue.
    assert_eq!(read, 4);
}

//! Which cells a renderer may request (`Document::interactive_cells`, ADR
//! 0017): the props each definition marks `interactive`, and the points of
//! a list marked so. The viewer's test checks its renderers against these.

mod common;

use cells_core::Document;
use cells_core::testing::test_utils::load;

const DOC: &str = r#"
<graph name="g">
  <point name="p">(1,2)</point>
  <line name="l" through="(0,0) (1,1)"/>
  <line name="ls" through="(0,0)" slope="2"/>
  <lineSegment name="s" endpoints="(0,0) (1,0)"/>
  <circle name="c" through="(0,0) (2,0) (0,2)"/>
  <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
</graph>
<numberInput name="n"/>
<booleanInput name="b"/>
<mathInput name="mi"/>
<textInput name="ti"/>
<slider name="sl" from="0" to="10"/>
<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>
<hint name="h"><p>help</p></hint>
<number name="k">3</number>
<triggerSet name="t"><label>Go</label><updateValue target="$k" newValue="5"/></triggerSet>
<answer name="a">2x</answer>
"#;

fn cells(doc: &Document, name: &str, prop: &str) -> Vec<u32> {
    let c = doc
        .resolve_path(name)
        .unwrap_or_else(|| panic!("no {name}"));
    doc.prop_cells(c, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"))
}

/// What the viewer's renderers request: each one's cells are interactive.
#[test]
fn what_a_renderer_requests_is_interactive() {
    let doc = load(DOC).unwrap();
    for (name, props) in [
        ("g", &["xmin", "xmax", "ymin", "ymax"][..]),
        ("p", &["x", "y"]),
        ("l", &["points"]),
        ("ls", &["points"]),
        ("s", &["points"]),
        ("c", &["cx", "cy", "throughPoints"]),
        ("pg", &["vertices"]),
        ("n", &["value"]),
        ("b", &["value"]),
        ("mi", &["value", "expr"]),
        ("ti", &["value"]),
        ("sl", &["value"]),
        ("ci", &["selectedIndex"]),
        ("h", &["open"]),
        ("k", &["value"]),
        ("a", &["submitted", "numSubmissions"]),
    ] {
        for prop in props {
            let cs = cells(&doc, name, prop);
            assert!(!cs.is_empty(), "{name}.{prop} has cells");
            for cell in cs {
                assert!(doc.is_interactive(cell), "{name}.{prop} is interactive");
            }
        }
    }
    assert_eq!(cells(&doc, "c", "throughPoints").len(), 6);
    assert_eq!(cells(&doc, "pg", "vertices").len(), 6);
}

/// What only follows from the student's work is not interactive.
#[test]
fn derived_props_are_not_interactive() {
    let doc = load(DOC).unwrap();
    for (name, prop) in [
        ("l", "slope"),
        ("l", "basedOnDirection"),
        ("c", "radius"),
        ("c", "area"),
        ("pg", "numVertices"),
        ("sl", "index"),
        ("sl", "from"),
        ("a", "credit"),
        ("a", "weight"),
    ] {
        for cell in cells(&doc, name, prop) {
            assert!(
                !doc.is_interactive(cell),
                "{name}.{prop} is not interactive"
            );
        }
    }
}

/// `interactive_cells` lists exactly the cells `is_interactive` accepts.
#[test]
fn interactive_cells_is_is_interactive() {
    let doc = load(DOC).unwrap();
    let listed = doc.interactive_cells();
    let every: Vec<u32> = (0..doc.cells.len() as u32)
        .filter(|&c| doc.is_interactive(c))
        .collect();
    assert_eq!(listed, every);
}

/// A submit and a trigger, which the core makes on a student's behalf,
/// write only interactive cells: every answer is an input (ADR 0017).
#[test]
fn a_submit_and_a_trigger_write_interactive_cells() {
    let doc = load(
        r#"<mathInput name="mi"/><answer name="a" response="$mi">x+1</answer>
           <answer name="b"><award><when>$mi = 2</when></award></answer>
           <answer name="c">2x</answer>
           <number name="k">3</number>
           <triggerSet name="t"><label>Go</label><updateValue target="$k" newValue="5"/></triggerSet>"#,
    )
    .unwrap();
    for answer in ["a", "b", "c"] {
        let a = doc.resolve_path(answer).unwrap();
        for r in doc.submit_requests(a) {
            assert!(doc.is_interactive(r.cell), "{answer}'s submit");
        }
    }
    let k = cells(&doc, "k", "value")[0];
    assert!(doc.is_interactive(k), "the trigger's target");
}

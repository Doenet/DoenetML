//! Which cells a renderer may request (`Document::interactive_cells`, ADR
//! 0017): the props each definition marks `interactive`, and the points of
//! a list marked so. The core refuses a request on any other cell (ADR
//! 0018); the viewer's test checks its renderers against these.

mod common;

use cells_core::CellIdx;
use cells_core::testing::test_utils::load;
use cells_core::{Document, PointRequest, Request};

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

fn cells(doc: &Document, name: &str, prop: &str) -> Vec<CellIdx> {
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
        // An action writes these, not a renderer.
        ("a", "submitted"),
        ("a", "numSubmissions"),
        ("k", "value"),
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
    let every: Vec<CellIdx> = CellIdx::below(doc.cells.len())
        .filter(|&c| doc.is_interactive(c))
        .collect();
    assert_eq!(listed, every);
}

/// A submit and a trigger are actions (ADR 0018): each writes what a
/// renderer's request on the same cells is refused.
#[test]
fn a_submit_and_a_trigger_write_what_a_request_cannot() {
    let mut doc = load(
        r#"<mathInput name="mi"/><answer name="a" response="$mi">x+1</answer>
           <boolean name="k"/>
           <triggerSet name="t"><label>Go</label><updateValue target="$k" newValue="true"/></triggerSet>"#,
    )
    .unwrap();
    let count = cells(&doc, "a", "numSubmissions")[0];
    let k = cells(&doc, "k", "value")[0];
    let tick = doc.request(&[Request {
        cell: count,
        value: 7.0,
    }]);
    assert_eq!(tick.dropped.len(), 1, "a request on the count is refused");
    let tick = doc.request(&[Request {
        cell: k,
        value: 1.0,
    }]);
    assert_eq!(tick.dropped.len(), 1, "a request on the target is refused");
    assert_eq!((doc.cells[count.index()], doc.cells[k.index()]), (0.0, 0.0));

    let a = doc.resolve_path("a").unwrap();
    assert!(doc.submit(a).dropped.is_empty());
    assert_eq!(doc.cells[count.index()], 1.0);
    let t = doc.resolve_path("t").unwrap();
    assert!(doc.trigger(t).dropped.is_empty());
    assert_eq!(doc.cells[k.index()], 1.0);
}

/// A point group with a point that is not an input's is refused whole.
#[test]
fn a_point_group_on_a_cell_that_is_not_an_inputs_is_refused() {
    let mut doc = load(
        r#"<graph><point name="p">(1,2)</point></graph>
           <numberInput name="n" value="3"/><number name="m">2 $n</number>"#,
    )
    .unwrap();
    let (px, py) = (cells(&doc, "p", "x")[0], cells(&doc, "p", "y")[0]);
    let m = cells(&doc, "m", "value")[0];
    assert!(!doc.is_interactive(m));
    let tick = doc.request_points(&[
        PointRequest {
            cells: [px, py],
            values: [5.0, 5.0],
        },
        PointRequest {
            cells: [m, m],
            values: [8.0, 8.0],
        },
    ]);
    assert_eq!(tick.dropped.len(), 2);
    assert_eq!(doc.cells[px.index()], 1.0);
    assert_eq!(doc.value("n", "value"), Some(3.0));
}

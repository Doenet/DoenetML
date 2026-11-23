//! Where a value is drawn in a graph, its anchor (`anchorX`, `anchorY`):
//! given by `anchor`, the origin without it, written by a drag, and an
//! input and an output only with a graph above it. And an angle's first
//! point and vertex, which a graph draws its arc from.

mod common;

use cells_core::testing::test_utils::load;
use cells_core::testing::{prop_value as value, request_prop as request};
use cells_core::{CellIdx, Document, PointRequest};

fn cells(doc: &Document, name: &str, prop: &str) -> Vec<CellIdx> {
    let c = doc
        .resolve_path(name)
        .unwrap_or_else(|| panic!("no {name}"));
    doc.prop_cells(c, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"))
}

fn cell(doc: &Document, name: &str, prop: &str) -> CellIdx {
    cells(doc, name, prop)[0]
}

fn is_output(doc: &Document, cell: CellIdx) -> bool {
    doc.output_cells().binary_search(&cell).is_ok()
}

const VALUES: &str = r#"
<graph>
  <shortDescription>values</shortDescription>
  <number name="n">3</number>
  <math name="m" anchor="(2,-1)" positionFromAnchor="upperRight" draggable="false">x+1</math>
  <text name="t">hi</text>
  <point name="P">(4,5)</point>
  <abs name="a" anchor="$P">-2</abs>
  <m name="mm">y</m>
</graph>
<number name="outside" anchor="(7,7)">3</number>
"#;

#[test]
fn an_anchor_is_given_by_its_attribute_or_is_the_origin() {
    let doc = load(VALUES).unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    for (name, x, y) in [
        ("n", 0.0, 0.0),
        ("m", 2.0, -1.0),
        ("t", 0.0, 0.0),
        ("a", 4.0, 5.0),
        ("mm", 0.0, 0.0),
    ] {
        assert_eq!(value(&doc, &format!("{name}.anchorX")), x, "{name}.anchorX");
        assert_eq!(value(&doc, &format!("{name}.anchorY")), y, "{name}.anchorY");
    }
}

#[test]
fn in_a_graph_an_anchor_is_drawn_and_dragged() {
    let doc = load(VALUES).unwrap();
    for name in ["n", "m", "t", "a", "mm"] {
        for prop in ["anchorX", "anchorY"] {
            let c = cell(&doc, name, prop);
            assert!(is_output(&doc, c), "{name}.{prop} is an output");
            assert!(doc.is_interactive(c), "{name}.{prop} is interactive");
        }
    }
}

/// Outside a graph nothing draws or drags a value at its anchor: it is
/// not given, no state, though its `anchor` is accepted.
#[test]
fn outside_a_graph_an_anchor_costs_no_state() {
    let doc = load(VALUES).unwrap();
    for prop in ["anchorX", "anchorY"] {
        let c = cell(&doc, "outside", prop);
        assert!(!doc.is_essential(c), "outside.{prop} is not essential");
        assert!(
            value(&doc, &format!("outside.{prop}")).is_nan(),
            "outside.{prop}"
        );
    }
    assert_eq!(value(&doc, "outside.value"), 3.0);
}

#[test]
fn a_drag_moves_the_anchor_or_the_point_it_names() {
    let mut doc = load(VALUES).unwrap();
    let drag = |doc: &mut Document, name: &str, x: f64, y: f64| {
        let cells = [cell(doc, name, "anchorX"), cell(doc, name, "anchorY")];
        let outcome = doc.request_points(&[PointRequest {
            cells,
            values: [x, y],
        }]);
        assert!(outcome.dropped.is_empty(), "{name}: {:?}", outcome.dropped);
    };
    drag(&mut doc, "m", 3.0, 4.0);
    assert_eq!(
        (value(&doc, "m.anchorX"), value(&doc, "m.anchorY")),
        (3.0, 4.0)
    );
    drag(&mut doc, "n", -1.0, 2.0);
    assert_eq!(
        (value(&doc, "n.anchorX"), value(&doc, "n.anchorY")),
        (-1.0, 2.0)
    );
    // Anchored at a point, a drag moves the point.
    drag(&mut doc, "a", 1.0, 1.0);
    assert_eq!((value(&doc, "P.x"), value(&doc, "P.y")), (1.0, 1.0));
    request(&mut doc, "P.x", 6.0);
    assert_eq!(value(&doc, "a.anchorX"), 6.0);
}

#[test]
fn a_copy_shares_its_referents_anchor_unless_it_gives_its_own() {
    let mut doc = load(
        r#"<graph>
  <number name="n" anchor="(1,2)">3</number>
  <number name="same" extend="$n" />
  <number name="own" extend="$n" anchor="(5,6)" />
</graph>"#,
    )
    .unwrap();
    assert_eq!(value(&doc, "same.anchorX"), 1.0);
    assert_eq!(value(&doc, "own.anchorX"), 5.0);
    request(&mut doc, "n.anchorX", 4.0);
    assert_eq!(value(&doc, "same.anchorX"), 4.0);
    assert_eq!(value(&doc, "own.anchorX"), 5.0);
}

#[test]
fn an_anchor_on_a_type_with_none_is_refused() {
    let doc = load(r#"<graph><boolean name="b" anchor="(1,2)">true</boolean></graph>"#).unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .any(|d| d.message.contains("anchor")),
        "{:?}",
        doc.diagnostics()
    );
}

/// An angle's arc is drawn from its first point and vertex: the `through`
/// points, or `(1, 0)` and the origin for a measure alone.
#[test]
fn an_angle_draws_from_its_first_point_and_vertex() {
    let mut doc = load(
        r#"<graph>
  <point name="A">(3,1)</point><point name="B">(1,1)</point><point name="C">(1,4)</point>
  <angle name="abc" through="$A $B $C"/>
  <angle name="r" radians="1"/>
</graph>"#,
    )
    .unwrap();
    for (name, p) in [("abc", [3.0, 1.0, 1.0, 1.0]), ("r", [1.0, 0.0, 0.0, 0.0])] {
        for (prop, v) in ["x1", "y1", "x2", "y2"].into_iter().zip(p) {
            assert_eq!(value(&doc, &format!("{name}.{prop}")), v, "{name}.{prop}");
            assert!(is_output(&doc, cell(&doc, name, prop)), "{name}.{prop}");
        }
    }
    request(&mut doc, "B.x", 2.0);
    assert_eq!(value(&doc, "abc.x2"), 2.0);
}

/// A line is drawn in text as its equation, which a renderer writes from
/// its two points: they are outputs there too.
#[test]
fn a_line_in_text_reads_its_points() {
    let doc = load(r#"<p><line name="l" through="(1,2) (3,5)"/></p>"#).unwrap();
    for prop in ["x1", "y1", "x2", "y2"] {
        assert!(is_output(&doc, cell(&doc, "l", prop)), "l.{prop}");
    }
}

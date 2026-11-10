//! Sequences (ADR 0041): one index rule on every ordered collection. An
//! index names an entry when it is an integer from 1 to the count, and
//! otherwise the missing value; a cell may be the index wherever a
//! literal may.

mod common;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_unpruned};
use common::*;

fn nan(doc: &cells_core::Document, name: &str) -> bool {
    v(doc, name, "value").is_nan()
}

/// Step 1's document: `$P[3]`, `$P[0]`, `$P[2.5]` and `$P[$k]` on a
/// two-dimensional point load, and read the missing value or the chosen
/// coordinate.
#[test]
fn a_point_is_a_sequence_of_its_coordinates() {
    let mut doc = load(
        r#"<numberInput name="k" value="1"/>
           <point name="P" x="3" y="4"/>
           <number name="one">$P[1]</number>
           <number name="three">$P[3]</number>
           <number name="zero">$P[0]</number>
           <number name="neg">$P[-1]</number>
           <number name="half">$P[2.5]</number>
           <number name="byk">$P[$k]</number>
           <p name="shown">$P[3]</p>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "one", "value"), 3.0);
    for name in ["three", "zero", "neg", "half"] {
        assert!(nan(&doc, name), "{name}");
    }
    assert_eq!(v(&doc, "byk", "value"), 3.0);
    for (k, want) in [(2.0, Some(4.0)), (2.5, None), (3.0, None), (0.0, None)] {
        doc.request(&[req(&doc, "k", "value", k)]);
        match want {
            Some(want) => assert_eq!(v(&doc, "byk", "value"), want, "k = {k}"),
            None => assert!(nan(&doc, "byk"), "k = {k}"),
        }
    }
    doc.request(&[req(&doc, "k", "value", 1.0)]);
    assert_eq!(v(&doc, "byk", "value"), 3.0);
    assert_eq!(reference::check(&doc), None);
}

/// An index that reads a cell selects among the coordinates, and so does
/// one that is an iteration's index name.
#[test]
fn an_iteration_index_picks_a_coordinate() {
    let doc = load(
        r#"<point name="P" x="3" y="4"/>
           <repeatForSequence name="r" length="3" indexName="i">
             <number name="c">$P[$i]</number>
           </repeatForSequence>"#,
    )
    .unwrap();
    let c = |k: usize| {
        let comp = doc.resolve_path(&format!("r[{k}].c")).unwrap();
        doc.cells[doc.prop_cells(comp, "value").unwrap()[0].index()]
    };
    assert_eq!(c(1), 3.0);
    assert_eq!(c(2), 4.0);
    assert!(c(3).is_nan());
}

/// A list's points are a sequence of points, and each point one of its
/// coordinates: `$pg.vertices[$k]`, `$pg.vertices[$k].y`,
/// `$pg.vertices[2][$j]`, and an index past the points, below them or
/// between them reads the missing value.
#[test]
fn a_list_of_points_is_a_sequence_of_points() {
    let mut doc = load_unpruned(
        r#"<numberInput name="k" value="2"/><numberInput name="j" value="1"/>
           <graph><polygon name="pg" vertices="(1,2) (3,4) (5,6)"/></graph>
           <number name="ky">$pg.vertices[$k].y</number>
           <number name="kx">$pg.vertices[$k][1]</number>
           <number name="jth">$pg.vertices[2][$j]</number>
           <number name="past">$pg.vertices[9][1]</number>
           <number name="below">$pg.vertices[0].x</number>
           <number name="between">$pg.vertices[1.5].x</number>
           <number name="third">$pg.vertices[2][3]</number>
           <point name="Q" coords="$pg.vertices[$k]"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "ky", "value"), 4.0);
    assert_eq!(v(&doc, "kx", "value"), 3.0);
    assert_eq!(v(&doc, "jth", "value"), 3.0);
    for name in ["past", "below", "between", "third"] {
        assert!(nan(&doc, name), "{name}");
    }
    assert_eq!(v(&doc, "Q", "x"), 3.0);
    assert_eq!(v(&doc, "Q", "y"), 4.0);
    doc.request(&[req(&doc, "k", "value", 3.0), req(&doc, "j", "value", 2.0)]);
    assert_eq!(v(&doc, "ky", "value"), 6.0);
    assert_eq!(v(&doc, "jth", "value"), 4.0);
    assert_eq!(v(&doc, "Q", "x"), 5.0);
    doc.request(&[req(&doc, "k", "value", 4.0)]);
    assert!(nan(&doc, "ky"));
    assert!(v(&doc, "Q", "x").is_nan());
    assert_eq!(reference::check(&doc), None);
}

/// A table's points (a line's two) and a combined prop (a circle's
/// center) are sequences too.
#[test]
fn a_table_list_and_a_combined_prop_take_any_index() {
    let mut doc = load_unpruned(
        r#"<numberInput name="k" value="2"/>
           <graph>
             <line name="l" through="(1,2) (3,4)"/>
             <circle name="c" center="(7,8)" radius="1"/>
           </graph>
           <number name="lk">$l.points[$k].x</number>
           <number name="l3">$l.points[3].x</number>
           <number name="ck">$c.center[$k]</number>
           <number name="c3">$c.center[3]</number>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "lk", "value"), 3.0);
    assert_eq!(v(&doc, "ck", "value"), 8.0);
    assert!(nan(&doc, "l3"));
    assert!(nan(&doc, "c3"));
    doc.request(&[req(&doc, "k", "value", 1.0)]);
    assert_eq!(v(&doc, "lk", "value"), 1.0);
    assert_eq!(v(&doc, "ck", "value"), 7.0);
    assert_eq!(reference::check(&doc), None);
}

/// An index into a repeat is never rounded: `$r[2.5]` names nothing, and
/// so does a cell index between two iterations.
#[test]
fn an_index_between_iterations_names_nothing() {
    let mut doc = load(
        r#"<numberInput name="k" value="2"/>
           <repeatForSequence name="r" length="3" valueName="v">
             <number name="x">$v</number>
           </repeatForSequence>
           <number name="half">$r[2.5].x</number>
           <number name="byk">$r[$k].x</number>"#,
    )
    .unwrap();
    assert!(nan(&doc, "half"));
    assert_eq!(v(&doc, "byk", "value"), 2.0);
    doc.request(&[req(&doc, "k", "value", 2.5)]);
    assert!(nan(&doc, "byk"));
    doc.request(&[req(&doc, "k", "value", 3.0)]);
    assert_eq!(v(&doc, "byk", "value"), 3.0);
}

/// Entries inside a repeat whose iterations a cell index also chooses
/// among: `every_count.rs` holds every build of this document to the
/// template graph.
#[test]
fn entries_inside_a_repeat_follow_the_count() {
    let mut doc = load(
        r#"<numberInput name="k" value="1"/>
        <graph>
          <point name="p">(1,2)</point>
          <polygon name="pg" vertices="(1,2) (3,4) (5,6)"/>
          <point name="q" coords="$pg.vertices[$k]"/>
        </graph>
        <number name="a">$p[$k] + $p[3] + $p[2.5]</number>
        <repeatForSequence name="r" length="$k" indexName="i">
          <point name="s" x="$i" y="$pg.vertices[$i].y"/>
          <number name="b">$p[$i] + $s[$k]</number>
        </repeatForSequence>
        <number name="c">$r[$k].s[$k] + $pg.vertices[$k][2]</number>"#,
    )
    .unwrap();
    // A sum with a missing term is missing.
    assert!(nan(&doc, "a"));
    assert_eq!(v(&doc, "c", "value"), 1.0 + 2.0);
    doc.request(&[req(&doc, "k", "value", 2.0)]);
    let b = |doc: &cells_core::Document, k: usize| {
        let comp = doc.resolve_path(&format!("r[{k}].b")).unwrap();
        doc.cells[doc.prop_cells(comp, "value").unwrap()[0].index()]
    };
    // Iteration 2's point is (2, 4): `$p[2] + $s[2]`.
    assert_eq!(b(&doc, 2), 2.0 + 4.0);
    assert_eq!(b(&doc, 1), 1.0 + 2.0);
    assert_eq!(v(&doc, "c", "value"), 4.0 + 4.0);
    assert_eq!(v(&doc, "q", "x"), 3.0);
    assert_eq!(reference::check(&doc), None);
}

fn text(doc: &cells_core::Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

/// Step 2's value lists: a paragraph shows a list's entries separated by
/// commas, each as its kind reads; an index reads one, as a number, a
/// text or a boolean.
#[test]
fn a_value_list_shows_its_entries() {
    let mut doc = load(
        r#"<numberInput name="k" value="2"/>
           <numberList name="nl">1 2.5 3</numberList>
           <textList name="tl">a b c</textList>
           <booleanList name="bl">true false true</booleanList>
           <p name="pnl">$nl</p>
           <p name="ptl">$tl</p>
           <p name="pbl">$bl</p>
           <p name="index">$nl[2] $tl[1] $bl[2]</p>
           <p name="byK">$tl[$k] $bl[$k]</p>
           <numberList name="nl2">$nl[3] 4</numberList>
           <p name="pnl2">$nl2</p>
           <p name="empty">[$nl[4]]</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "pnl"), "1, 2.5, 3");
    assert_eq!(text(&doc, "ptl"), "a, b, c");
    assert_eq!(text(&doc, "pbl"), "true, false, true");
    assert_eq!(text(&doc, "index"), "2.5 a false");
    assert_eq!(text(&doc, "byK"), "b false");
    assert_eq!(text(&doc, "pnl2"), "3, 4");
    assert_eq!(text(&doc, "empty"), "[NaN]");
    doc.request(&[req(&doc, "k", "value", 3.0)]);
    assert_eq!(text(&doc, "byK"), "c true");
    assert_eq!(reference::check(&doc), None);
}

/// A choose holds what its branches hold: a text read through a cell index
/// into a repeat shows as text.
#[test]
fn a_text_chosen_by_a_cell_is_text() {
    let doc = load(
        r#"<numberInput name="k" value="2"/>
           <textList name="l">a b c</textList>
           <repeatForSequence name="r" length="3" indexName="i">
             <text name="t">$l[$i]</text>
           </repeatForSequence>
           <p name="p">$r[$k].t.value</p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "b");
}

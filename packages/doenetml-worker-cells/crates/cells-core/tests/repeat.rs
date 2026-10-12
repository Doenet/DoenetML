//! `<repeatForSequence>`, `<collect>`, indexed references and rebuilds.

use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_via_binary};
use cells_core::{Child, Document, Request};

fn req(_doc: &Document, cell: u32, value: f64) -> Request {
    Request { cell, value }
}

/// Cell of `$path.prop` where `path` alternates names and 1-based positions,
/// e.g. `["r", "3", "p"]`.
fn cell(doc: &Document, path: &[&str], prop: &str) -> u32 {
    // ["r", "3", "p"] is the path `r[3].p`.
    let mut text = String::new();
    for (i, part) in path.iter().enumerate() {
        if part.parse::<usize>().is_ok() {
            text.push_str(&format!("[{part}]"));
        } else {
            if i > 0 {
                text.push('.');
            }
            text.push_str(part);
        }
    }
    let c = doc
        .resolve_path(&text)
        .unwrap_or_else(|| panic!("no component at {path:?}"));
    doc.prop_cells(c, prop).unwrap()[0]
}

fn val(doc: &Document, path: &[&str], prop: &str) -> f64 {
    doc.cells[cell(doc, path, prop) as usize]
}

const POINTS: &str = r#"
<numberInput name="n" value="3"/>
<graph name="g">
  <repeatForSequence name="r" length="$n" valueName="v" indexName="i">
    <point name="p" x="$v" y="1"/>
  </repeatForSequence>
</graph>"#;

#[test]
fn repeat_expands_to_its_count_and_names_are_scoped() {
    let doc = load(POINTS).unwrap();
    assert_eq!(reference::check(&doc), None);
    let r = doc.component("r").unwrap();
    let kids: Vec<_> = doc.children(r).collect();
    assert_eq!(kids.len(), 3);
    assert_eq!(val(&doc, &["r", "1", "p"], "x"), 1.0);
    assert_eq!(val(&doc, &["r", "3", "p"], "x"), 3.0);
    assert_eq!(val(&doc, &["r", "2", "p"], "y"), 1.0);
    // Dragging a coordinate bound to the fixed sequence value is dropped,
    // as it is in the current core.
    let mut doc = doc;
    let tick = doc.request(&[req(&doc, cell(&doc, &["r", "2", "p"], "x"), 5.0)]);
    assert_eq!(tick.dropped.len(), 1);
    // The same document from the binary wire format.
    let bin = load_via_binary(POINTS).unwrap();
    assert_eq!(bin.cells.len(), doc.cells.len());
}

#[test]
fn sequence_from_to_step_defines_the_count_and_values() {
    let doc = load(r#"<repeatForSequence name="r" from="0" to="1" step="0.25" valueName="v"><number name="m">$v</number></repeatForSequence>"#).unwrap();
    assert_eq!(doc.value("r", "count"), Some(5.0));
    assert_eq!(val(&doc, &["r", "5", "m"], "value"), 1.0);
    assert_eq!(val(&doc, &["r", "2", "m"], "value"), 0.25);
}

#[test]
fn changing_the_count_rebuilds_within_the_tick_and_keeps_moved_points() {
    let mut doc = load(POINTS).unwrap();
    // Move iteration 2's point, then shrink past it, then grow back.
    let p2y = cell(&doc, &["r", "2", "p"], "y");
    let tick = doc.request(&[req(&doc, p2y, 7.5)]);
    assert!(!tick.rebuilt);
    assert_eq!(val(&doc, &["r", "2", "p"], "y"), 7.5);

    let n = doc.cell("n", "value").unwrap();
    let tick = doc.request(&[req(&doc, n, 1.0)]);
    assert!(tick.rebuilt, "a structural change rebuilds");
    assert!(tick.changed.is_empty());
    assert_eq!(doc.children(doc.component("r").unwrap()).count(), 1);
    assert_eq!(
        doc.value("n", "value"),
        Some(1.0),
        "the input's value survived the rebuild"
    );

    let n = doc.cell("n", "value").unwrap();
    let tick = doc.request(&[req(&doc, n, 5.0)]);
    assert!(tick.rebuilt);
    assert_eq!(doc.children(doc.component("r").unwrap()).count(), 5);
    assert_eq!(
        val(&doc, &["r", "2", "p"], "y"),
        7.5,
        "iteration 2 came back where it was left"
    );
    assert_eq!(
        val(&doc, &["r", "5", "p"], "y"),
        1.0,
        "new iterations start from the template"
    );
    assert_eq!(val(&doc, &["r", "5", "p"], "x"), 5.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn bad_counts_are_floored_clamped_and_capped() {
    let mut doc = load(r#"<numberInput name="n" value="2.9"/><repeatForSequence name="r" length="$n" maxNumber="4"><point/></repeatForSequence>"#).unwrap();
    let r = doc.component("r").unwrap();
    assert_eq!(doc.children(r).count(), 2);
    for (ask, expect) in [(-3.0, 0), (f64::NAN, 0), (1e9, 4), (3.2, 3)] {
        let n = doc.cell("n", "value").unwrap();
        doc.request(&[req(&doc, n, ask)]);
        let r = doc.component("r").unwrap();
        assert_eq!(doc.children(r).count(), expect, "length {ask}");
    }
}

#[test]
fn indexed_references_from_outside_and_a_missing_referent() {
    let mut doc = load(&format!("{POINTS}<number name=\"third\">$r[3].p.x</number><number name=\"tenth\">$r[10].p.y</number><point name=\"q\" coords=\"$r[2].p\"/>")).unwrap();
    assert_eq!(doc.value("third", "value"), Some(3.0));
    assert!(
        doc.value("tenth", "value").unwrap().is_nan(),
        "no referent is NaN"
    );
    assert_eq!(doc.value("q", "x"), Some(2.0));
    // A request on the missing cell is dropped, not stored.
    let tick = doc.request(&[req(&doc, doc.cell("tenth", "value").unwrap(), 4.0)]);
    assert_eq!(tick.dropped.len(), 1);
    // Growing past 10 gives the reference a referent after the rebuild.
    let n = doc.cell("n", "value").unwrap();
    doc.request(&[req(&doc, n, 12.0)]);
    assert_eq!(doc.value("tenth", "value"), Some(1.0));
    // And dragging the tenth point through the reference works.
    doc.request(&[req(&doc, doc.cell("tenth", "value").unwrap(), 4.5)]);
    assert_eq!(val(&doc, &["r", "10", "p"], "y"), 4.5);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn lagged_recurrence_with_a_seed() {
    // x_k = 2 * x_{k-2}, seeded at 1 where the lag has no referent.
    let doc = load(
        r#"<numberInput name="n" value="6"/><numberInput name="seed" value="1"/>
           <repeatForSequence name="r" length="$n" indexName="i">
             <op name="prev" kind="default" args="$r[$i-2].x $seed"/>
             <op name="x" kind="scale" k="2" args="$prev"/>
           </repeatForSequence>"#,
    )
    .unwrap();
    let xs: Vec<f64> = (1..=6)
        .map(|k| val(&doc, &["r", &k.to_string(), "x"], "value"))
        .collect();
    assert_eq!(xs, vec![2.0, 2.0, 4.0, 4.0, 8.0, 8.0]);
    // Dragging the last term inverts down the chain into the seed.
    let mut doc = doc;
    let last = cell(&doc, &["r", "6", "x"], "value");
    doc.request(&[req(&doc, last, 24.0)]);
    assert_eq!(doc.value("seed", "value"), Some(3.0));
    assert_eq!(val(&doc, &["r", "5", "x"], "value"), 24.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_forward_lag_is_a_cycle_and_a_dynamic_index_is_rejected() {
    let err = load(r#"<repeatForSequence name="r" length="2" indexName="i"><op name="x" kind="negate" args="$r[$i+1].x"/><op name="y" kind="negate" args="$r[$i-1].x"/></repeatForSequence>"#).err();
    assert!(
        err.is_none(),
        "a lag that only goes one way is fine: {err:?}"
    );
    let err = load(r#"<repeatForSequence name="r" length="2" indexName="i"><op name="x" kind="negate" args="$r[$i+1].y"/><op name="y" kind="negate" args="$r[$i-1].x"/></repeatForSequence>"#).unwrap_err();
    assert!(matches!(err, cells_core::Error::Cycle(_)), "{err}");
    let err = load(r#"<numberInput name="k" value="1"/><repeatForSequence name="r" length="3"><point name="p"/></repeatForSequence><number>$r[$k].p.x</number>"#).unwrap_err();
    assert!(matches!(err, cells_core::Error::DynamicIndex(_)), "{err}");
}

#[test]
fn single_component_iteration_can_be_referenced_bare() {
    let doc = load(r#"<repeatForSequence name="r" length="3" valueName="v"><point x="$v" y="0"/></repeatForSequence><graph>$r[2]</graph><point name="q" coords="$r[3]"/>"#).unwrap();
    assert_eq!(doc.value("q", "x"), Some(3.0));
    let g = doc
        .children(doc.root)
        .filter_map(|c| {
            if let Child::Component(c) = c {
                Some(c)
            } else {
                None
            }
        })
        .nth(1)
        .unwrap();
    let copy = doc.children(g).next().unwrap();
    let Child::Component(copy) = copy else {
        panic!()
    };
    assert_eq!(
        doc.prop_cells(copy, "x").unwrap()[0],
        cell(&doc, &["r", "2"], "x")
    );
}

#[test]
fn collect_gathers_through_a_repeat_and_follows_its_growth() {
    let mut doc = load(&format!(
        "{POINTS}<graph name=\"g2\"><collect name=\"c\" componentType=\"point\" from=\"$g\"/></graph><number name=\"second\">$c[2].y</number><number name=\"cnt\">$c.count</number>"
    ))
    .unwrap();
    assert_eq!(doc.value("cnt", "value"), Some(3.0));
    assert_eq!(doc.value("second", "value"), Some(1.0));
    let c = doc.component("c").unwrap();
    assert_eq!(doc.children(c).count(), 3);
    // The copies share cells with the originals.
    let Child::Component(copy1) = doc.children(c).next().unwrap() else {
        panic!()
    };
    assert_eq!(
        doc.prop_cells(copy1, "x"),
        Some(vec![cell(&doc, &["r", "1", "p"], "x")])
    );
    // Growing the repeat grows the collect in the same rebuild.
    let n = doc.cell("n", "value").unwrap();
    doc.request(&[req(&doc, n, 5.0)]);
    assert_eq!(doc.value("cnt", "value"), Some(5.0));
    assert_eq!(doc.children(doc.component("c").unwrap()).count(), 5);
    // A request on the collect count is dropped: it is fixed, not state.
    let tick = doc.request(&[req(&doc, doc.cell("cnt", "value").unwrap(), 9.0)]);
    assert_eq!(tick.dropped.len(), 1);
}

#[test]
fn nested_repeats_scope_names_per_iteration_and_survive_rebuilds() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/>
           <repeatForSequence name="outer" length="$n" indexName="i">
             <repeatForSequence name="inner" length="3" indexName="j">
               <point name="p" x="$i" y="$j"/>
               <point name="q" x="0" y="0"/>
             </repeatForSequence>
           </repeatForSequence>"#,
    )
    .unwrap();
    assert_eq!(val(&doc, &["outer", "2", "inner", "3", "p"], "x"), 2.0);
    assert_eq!(val(&doc, &["outer", "2", "inner", "3", "p"], "y"), 3.0);
    let c = cell(&doc, &["outer", "1", "inner", "2", "q"], "x");
    doc.request(&[req(&doc, c, 9.0)]);
    let n = doc.cell("n", "value").unwrap();
    doc.request(&[req(&doc, n, 3.0)]);
    assert_eq!(val(&doc, &["outer", "1", "inner", "2", "q"], "x"), 9.0);
    assert_eq!(val(&doc, &["outer", "2", "inner", "2", "q"], "x"), 0.0);
    assert_eq!(val(&doc, &["outer", "3", "inner", "1", "p"], "x"), 3.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn load_settles_in_two_passes_and_reports_it() {
    let (doc, t) = Document::load(
        cells_core::testing::test_utils::dast_json(POINTS).as_bytes(),
        Default::default(),
    )
    .unwrap();
    assert_eq!(t.passes, 2);
    assert!(doc.structure_settled());
    let (_, t) = Document::load(
        cells_core::testing::test_utils::dast_json(r#"<point name="p"/>"#).as_bytes(),
        Default::default(),
    )
    .unwrap();
    assert_eq!(t.passes, 1);
}

#[test]
fn structural_depth_counts_cross_iteration_count_dependencies() {
    // Counts from inputs or from another repeat's count are depth 1 and
    // settle in the second pass. A nested repeat is one deeper, because its
    // count cannot exist until the enclosing iteration does, but that is
    // not a warning: nesting is ordinary authoring.
    let (doc, t) = Document::load(
        cells_core::testing::test_utils::dast_json(
            r#"<numberInput name="n" value="2"/>
           <repeatForSequence name="a" length="$n"><point/></repeatForSequence>
           <repeatForSequence name="b" length="$a.count" indexName="i">
             <repeatForSequence name="c" length="$i"><point/></repeatForSequence>
           </repeatForSequence>"#,
        )
        .as_bytes(),
        Default::default(),
    )
    .unwrap();
    assert_eq!(
        doc.structure.repeat_depths,
        vec![1, 2, 2, 1],
        "a, then c in each of b's iterations (recorded before b), then b"
    );
    assert_eq!(t.passes, 3);
    assert!(doc.warnings().is_empty());

    // A count that reads a cell inside another repeat's iterations is one
    // link deeper, costs one more pass, and is reported.
    let (doc, t) = Document::load(cells_core::testing::test_utils::dast_json(
        r#"<numberInput name="n" value="3"/>
           <repeatForSequence name="a" length="$n" indexName="i"><number name="k">$i</number></repeatForSequence>
           <repeatForSequence name="b" length="$a[3].k"><point name="q" x="2"/></repeatForSequence>
           <repeatForSequence name="c" length="$b[1].q.x"><point/></repeatForSequence>"#,
    ).as_bytes(), Default::default()).unwrap();
    // b reads inside a, c reads inside b: a chain of two links, so depth 3
    // and one pass per link beyond the two every repeat needs.
    assert_eq!(doc.structure.structural_depth, 3);
    assert_eq!(doc.structure.repeat_depths, vec![1, 2, 3]);
    assert_eq!(t.passes, 4);
    let w = doc.warnings();
    assert_eq!(w.len(), 2, "{w:?}");
    assert!(w[0].contains("'b'") && w[1].contains("'c'"), "{w:?}");
}

#[test]
fn sibling_repeats_do_not_share_scopes() {
    let mut doc = load(
        r#"<numberInput name="n" value="2"/>
           <repeatForSequence name="a" length="$n" valueName="v"><point name="p" x="$v" y="1"/></repeatForSequence>
           <repeatForSequence name="b" length="$n" valueName="v"><point name="p" x="$v" y="2"/></repeatForSequence>
           <number name="ay">$a[2].p.y</number><number name="by">$b[2].p.y</number>"#,
    )
    .unwrap();
    assert_eq!(doc.value("ay", "value"), Some(1.0));
    assert_eq!(doc.value("by", "value"), Some(2.0));
    // Values survive a rebuild per repeat, not per position.
    let c = cell(&doc, &["b", "2", "p"], "y");
    doc.request(&[req(&doc, c, 7.0)]);
    let n = doc.cell("n", "value").unwrap();
    doc.request(&[req(&doc, n, 3.0)]);
    assert_eq!(val(&doc, &["a", "2", "p"], "y"), 1.0);
    assert_eq!(val(&doc, &["b", "2", "p"], "y"), 7.0);
}

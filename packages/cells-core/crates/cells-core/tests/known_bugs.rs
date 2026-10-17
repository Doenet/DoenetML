//! Bugs found by a design review of the core, each kept as an ignored
//! test asserting the behaviour a fix should give (the convention of the
//! rebuild-cycle survey). Run them with `cargo test --test known_bugs --
//! --ignored`; a fix moves its test to the file for its topic.
//!
//! They fall into two groups by structural cause: math handles have no
//! identity, so equal values get new handles; and the rebuild loop and the
//! probe view share state with the real build.

mod common;
use common::{set, v};

use cells_core::Document;
use cells_core::testing::test_utils::{dast_json, load};

fn engine_len(doc: &Document) -> usize {
    doc.program.sym.engine.borrow().len()
}

// ---------------------------------------------------------------------
// Math handles have no identity.
// ---------------------------------------------------------------------

// The `Evaluate` inverse (`tick/invert.rs`) makes a new expression for
// every request, even one equal to the current value. Change detection
// compares handles, so a drag to where the point already is reports the
// input and everything symbolic downstream as changed.
#[test]
#[ignore = "known bug: requesting a math input's current value makes a new handle"]
fn a_drag_to_the_same_place_changes_nothing() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="3"/><math name="mm" simplify>$mi x</math>
<graph><point name="p" x="$mi" y="0"/></graph>"#,
    )
    .unwrap();
    set(&mut doc, "p", "x", 5.0);
    let len = engine_len(&doc);
    let t = set(&mut doc, "p", "x", 5.0);
    assert!(t.changed.is_empty(), "changed {:?}", t.changed);
    assert_eq!(engine_len(&doc), len);
}

// A rebuild keeps the engine, so handles carried over stay valid, but the
// build imports every math template again and nothing is reclaimed.
// Toggling a count back and forth grows the engine without bound.
#[test]
#[ignore = "known bug: every rebuild leaks the document's math into the engine"]
fn rebuilding_back_and_forth_does_not_grow_the_engine() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><math name="m" simplify>x + x</math></repeatForSequence>"#,
    )
    .unwrap();
    set(&mut doc, "n", "value", 2.0);
    set(&mut doc, "n", "value", 1.0);
    let len = engine_len(&doc);
    for _ in 0..10 {
        set(&mut doc, "n", "value", 2.0);
        set(&mut doc, "n", "value", 1.0);
    }
    assert_eq!(engine_len(&doc), len);
}

// ---------------------------------------------------------------------
// The rebuild loop and the probe view.
// ---------------------------------------------------------------------

// `Document::rebuild` reassigns its carryover on every pass, so a rebuild
// that fails after its first pass restores an intermediate build's
// structure onto the old cells. The document is then unsettled and the
// next unrelated tick rebuilds. With the cycle check off, the only case
// the rollback exists for.
#[test]
#[ignore = "known bug: a rebuild failing after its first pass restores the wrong structure"]
fn a_rebuild_failing_late_leaves_the_document_settled() {
    let src = r#"<numberInput name="n" value="1"/><numberInput name="m" value="4"/>
<repeatForSequence name="a" length="$n"><numberInput name="one" value="1"/></repeatForSequence>
<number name="k">3*$a[2].one</number>
<repeatForSequence name="b" length="$k"><number name="x">$y</number></repeatForSequence>
<number name="y">$b[3].x</number>"#;
    let (mut doc, _) = Document::load(
        dast_json(src).as_bytes(),
        cells_core::LoadOptions {
            check_cycles: false,
            ..Default::default()
        },
    )
    .unwrap();
    let t = set(&mut doc, "n", "value", 2.0);
    assert!(t.rebuild_error.is_some());
    assert!(doc.structure_settled());
    assert_eq!(doc.structure.essential_slots.len(), doc.n_essential);
    let t = set(&mut doc, "m", "value", 9.0);
    assert!(!t.rebuilt);
    assert_eq!(v(&doc, "m", "value"), 9.0);
}

// A select's rules on how many it picks run only in `pick()`, which
// neither the probe nor `diagnose` calls, so `diagnose` misses an error
// it claims to find at any count, and the select is boxed inside a tick.
#[test]
#[ignore = "known bug: diagnose misses select rules checked only when picking"]
fn diagnose_reports_a_select_picking_more_than_its_options() {
    let src = r#"<numberInput name="n" value="0"/>
<repeatForSequence name="r" length="$n">
  <select name="s" numToSelect="3"><option><number>1</number></option><option><number>2</number></option></select>
</repeatForSequence>"#;
    let dast = cells_core::dast::Dast::from_json(&dast_json(src)).unwrap();
    let diagnostics = cells_core::diagnose(&dast);
    assert!(
        diagnostics
            .iter()
            .any(|d| d.kind == cells_core::DiagnosticKind::Error),
        "{diagnostics:?}"
    );
}

// The probe gives a collect's count an operator over the repeat counts,
// and the prefill rule, checked on the probe's build, rejects it as
// computed. In the real build the count is a fixed value a prefill may
// name.
#[test]
#[ignore = "known bug: the probe rejects a prefill naming a collect's count"]
fn a_prefill_may_name_a_collects_count() {
    let doc = load(
        r#"<numberInput name="n" value="3"/>
<repeatForSequence name="r" length="$n"><point name="p">(1,2)</point></repeatForSequence>
<collect name="c" from="$r" componentType="point"/>
<mathInput name="mi" prefill="$c.count"/>"#,
    )
    .unwrap();
    assert_eq!(doc.math_text(doc.cell("mi", "expr").unwrap()), "3");
}

//! The holes the rebuild-cycle survey found
//! (`docs/rebuild-cycles-survey.md`): documents that loaded without a cycle
//! error and hit one on a rebuild. The probe (ADR 0012) now models each one
//! and rejects the document at load, which each test asserts; the rebuild
//! failure path is tested with the check switched off, since no document
//! that passes it is known to fail on rebuild.

mod common;
use common::{set, type_into, v};

use cells_core::testing::test_utils::{dast_json, load, load_with_seed};
use cells_core::{Document, Error, LoadOptions};

/// Load with the cycle check off, so a document the probe rejects reaches
/// its rebuild and fails there.
fn load_unchecked(src: &str) -> Document {
    Document::load(
        dast_json(src).as_bytes(),
        LoadOptions {
            check_cycles: false,
            ..Default::default()
        },
    )
    .map(|(d, _)| d)
    .unwrap()
}

fn expect_cycle(doc: cells_core::Result<Document>) {
    match doc {
        Err(Error::Cycle(_)) => {}
        Err(other) => panic!("expected a cycle at load, got {other}"),
        Ok(_) => panic!("loaded without a cycle error"),
    }
}

// Hole 1: a collect's `count` is a fixed constant in the build, not an
// edge into the gathered iterations, so a count reading the count of a
// collect over its own iterations passes `check_counts`. Settles at load
// while `g` is 0; with `g` set, oscillates and fails after eight rebuilds.
#[test]
fn a_count_reading_a_collect_over_its_own_iterations_is_a_cycle() {
    expect_cycle(load(
        r#"<booleanInput name="g"/>
           <repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
           <collect name="c" from="$r" componentType="point"/>
           <boolean name="two">$c.count = 2</boolean>
           <number name="k">2 - $g*$two</number>"#,
    ));
    // The same through a polyline's `numVertices`, set the same way.
    expect_cycle(load(
        r#"<booleanInput name="g"/>
           <graph><repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
           <polyline name="pl" vertices="$r"/></graph>
           <boolean name="two">$pl.numVertices = 2</boolean>
           <number name="k">2 - $g*$two</number>"#,
    ));
}

// Hole 2: two repeats whose counts read each other's iterations. Neither
// count reaches its own iterations, so `check_counts` passes, and the
// existence of an iteration is not an edge, so `check_loops` sees no loop.
#[test]
fn counts_reading_each_others_iterations_are_a_cycle() {
    expect_cycle(load(
        r#"<booleanInput name="g"/>
           <repeatForSequence name="r" length="$a"><number name="x">1</number></repeatForSequence>
           <repeatForSequence name="s" length="$b"><number name="y">1</number></repeatForSequence>
           <boolean name="bs">$s[2].y > 0</boolean>
           <boolean name="br">$r[2].x > 0</boolean>
           <number name="a">2 - $g*$bs</number>
           <number name="b">2 - $g*$br</number>"#,
    ));
}

// Hole 3: a select inside a repeat draws per iteration, and the probe
// expands only iteration 1, so an option that is cyclic (alone, or
// through a document-level reference) is checked only when iteration 1
// draws it. With seed 1 iteration 1 draws the acyclic option.
#[test]
fn a_cyclic_option_drawn_by_a_later_iteration_is_a_cycle() {
    expect_cycle(load_with_seed(
        r#"<numberInput name="n" value="1"/>
           <repeatForSequence name="r" length="$n">
             <select name="s">
               <option><number name="a">1</number><number name="b">2</number></option>
               <option><number name="a">$b</number><number name="b">$a</number></option>
             </select>
           </repeatForSequence>"#,
        1,
    ));
    // The same hole lets a collect be empty in the probe: the point exists
    // only in the option iteration 1 does not draw, so `$c[1]` has no edge.
    expect_cycle(load_with_seed(
        r#"<numberInput name="n" value="1"/>
           <repeatForSequence name="r" length="$n">
             <select name="s">
               <option><number name="a">1</number></option>
               <option><point name="p">($y,0)</point></option>
             </select>
           </repeatForSequence>
           <collect name="c" from="$r" componentType="point"/>
           <number name="y">$c[1].x</number>"#,
        1,
    ));
}

// Hole 4: the prefill rule (a seed must name a value that is not
// computed) runs at emit, which the probe does not reach, so a prefill
// naming a computed cell past the count at load is accepted and rejected
// on the rebuild that makes it exist. The probe reaches emit now, and the
// rule boxes the input at load (ADR 0013, ADR 0014).
#[test]
fn a_prefill_naming_a_computed_cell_past_the_count_is_rejected_at_load() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
           <repeatForSequence name="r" length="$n"><number name="x">$mi</number></repeatForSequence>
           <mathInput name="mi" prefill="$r[2].x"/>"#,
    )
    .unwrap();
    let errors = |doc: &Document| -> Vec<String> {
        doc.diagnostics()
            .iter()
            .filter(|d| d.kind == cells_core::DiagnosticKind::Error)
            .map(|d| d.message.clone())
            .collect()
    };
    // `x` reads the boxed input, so it is reported too.
    let at_load = errors(&doc);
    assert!(at_load.iter().any(|e| e.contains("prefill")), "{at_load:?}");
    let t = set(&mut doc, "n", "value", 2.0);
    assert!(t.rebuild_error.is_none(), "{:?}", t.rebuild_error);
    assert_eq!(errors(&doc), at_load);
}

// Not a cycle: a failed rebuild once put a fresh `Sym` (empty memo) back
// and recomputed, which indexed past the memo in `step_sym` and panicked,
// so every hole above was a crash beside a `<mathInput>` or symbolic
// `<math>`. The engine now goes back into the old `Sym`, memo and all.
#[test]
fn a_failed_rebuild_beside_a_symbolic_instruction_reports_instead_of_panicking() {
    let mut doc = load_unchecked(
        r#"<booleanInput name="g"/>
           <mathInput name="mi" prefill="x"/><math name="m2">$mi + 1</math>
           <repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
           <collect name="c" from="$r" componentType="point"/>
           <boolean name="two">$c.count = 2</boolean>
           <number name="k">2 - $g*$two</number>"#,
    );
    let t = set(&mut doc, "g", "value", 1.0);
    assert!(t.rebuild_error.is_some());
    // The symbolic instruction still runs after the recovery.
    let t = type_into(&mut doc, "mi", "y");
    assert!(t.rebuild_error.is_none());
    let m2 = doc.cell("m2", "expr").unwrap();
    assert_eq!(doc.math_text(m2), "y + 1");
}

// A failed rebuild undoes the tick: the essential writes are rolled back
// and recomputed, so an input never shows a count its iterations do not
// match, every request of the tick is reported dropped, and the document
// takes later ticks, structural ones included. Uses the collect-count
// document with the check off, so it fails on rebuild, with a second way
// to grow the repeat that settles.
#[test]
fn a_failed_rebuild_rolls_the_tick_back() {
    let mut doc = load_unchecked(
        r#"<booleanInput name="g"/>
           <numberInput name="extra" value="0"/>
           <repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
           <collect name="c" from="$r" componentType="point"/>
           <boolean name="two">$c.count = 2</boolean>
           <number name="k">2 - $g*$two + $extra</number>"#,
    );
    assert_eq!(v(&doc, "k", "value"), 2.0);
    let g = doc.cell("g", "value").unwrap();

    let t = set(&mut doc, "g", "value", 1.0);
    assert!(t.rebuild_error.is_some());
    assert!(!t.rebuilt);
    assert!(t.changed.is_empty(), "changed {:?}", t.changed);
    assert_eq!(t.dropped.len(), 1);
    assert_eq!(t.dropped[0].cell, g);
    assert_eq!(t.dropped[0].value, 1.0);
    assert_eq!(v(&doc, "g", "value"), 0.0);
    assert_eq!(v(&doc, "k", "value"), 2.0);
    assert_eq!(v(&doc, "two", "value"), 1.0);
    assert!(doc.structure_settled());

    // Asking again fails the same way and leaves the same document.
    let t = set(&mut doc, "g", "value", 1.0);
    assert!(t.rebuild_error.is_some());
    assert_eq!(v(&doc, "g", "value"), 0.0);
    assert_eq!(v(&doc, "k", "value"), 2.0);

    // A later structural tick that settles still rebuilds.
    let t = set(&mut doc, "extra", "value", 1.0);
    assert!(t.rebuild_error.is_none(), "{:?}", t.rebuild_error);
    assert!(t.rebuilt);
    assert_eq!(v(&doc, "k", "value"), 3.0);
    assert_eq!(v(&doc, "two", "value"), 0.0);
    assert_eq!(v(&doc, "extra", "value"), 1.0);
    assert!(doc.cell("r[3].p", "x").is_some());
}

// A rebuild that fails after its first pass leaves the document as it was:
// a build reads the session and moves nothing out of the document (ADR
// 0015), where a rebuild once moved its carryover out, reassigned it every
// pass, and restored an intermediate build's structure onto the old cells.
// With the cycle check off, the only case the rollback exists for.
#[test]
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

//! Open holes from the rebuild-cycle survey
//! (`docs/rebuild-cycles-survey.md`): documents that load without a cycle
//! error and hit one on a rebuild, which ADR 0012 does not close. Each test
//! states the behaviour the survey proposes and is ignored until a rule
//! closes the hole; today each document loads and the first structural
//! request fails inside the tick.

mod common;
use common::set;

use cells_core::testing::test_utils::{load, load_with_seed};
use cells_core::{Document, Error};

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
#[ignore = "open hole: a collect count over a repeat's own iterations is not an edge"]
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
#[ignore = "open hole: counts reading each other's iterations oscillate"]
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
#[ignore = "open hole: a select in a repeat is probed at iteration 1's pick only"]
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
// on the rebuild that makes it exist.
#[test]
#[ignore = "open hole: the prefill rule is not checked by the probe"]
fn a_prefill_naming_a_computed_cell_past_the_count_is_rejected_at_load() {
    let doc = load(
        r#"<numberInput name="n" value="1"/>
           <repeatForSequence name="r" length="$n"><number name="x">$mi</number></repeatForSequence>
           <mathInput name="mi" prefill="$r[2].x"/>"#,
    );
    assert!(
        matches!(doc, Err(Error::Unsupported(_))),
        "expected the prefill rule at load, got {:?}",
        doc.map(|_| ())
    );
}

// Follow-up, not a cycle: when a rebuild fails in a document with a
// symbolic instruction, `Document::rebuild`'s recovery path puts a fresh
// `Sym` (empty memo) back and recomputes, which indexes past the memo and
// panics (`program/mod.rs`, `step_sym`). Every hole above becomes a crash
// beside a `<mathInput>` or symbolic `<math>`.
#[test]
#[ignore = "open: a failed rebuild panics beside a symbolic instruction"]
fn a_failed_rebuild_beside_a_symbolic_instruction_reports_instead_of_panicking() {
    let mut doc = load(
        r#"<booleanInput name="g"/>
           <mathInput name="mi" prefill="x"/><math name="m2">$mi + 1</math>
           <repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence>
           <collect name="c" from="$r" componentType="point"/>
           <boolean name="two">$c.count = 2</boolean>
           <number name="k">2 - $g*$two</number>"#,
    )
    .unwrap();
    let t = set(&mut doc, "g", "value", 1.0);
    assert!(t.rebuild_error.is_some());
}

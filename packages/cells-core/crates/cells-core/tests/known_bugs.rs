//! Bugs found by a design review of the core, each kept as an ignored
//! test asserting the behaviour a fix should give (the convention of the
//! rebuild-cycle survey). Run them with `cargo test --test known_bugs --
//! --ignored`; a fix un-ignores its test.
//!
//! They fall into four groups by structural cause: a cell's value type is
//! not recorded, so readers guess it from the component type and prop
//! name; math handles have no identity, so equal values get new handles;
//! essential values are keyed by layout (scope id, slot offset) rather
//! than by element; and the rebuild loop and the probe view share state
//! with the real build.

mod common;
use common::{set, v};

use cells_core::Document;
use cells_core::testing::test_utils::{dast_json, load, load_with_seed};

fn engine_len(doc: &Document) -> usize {
    doc.program.sym.engine.borrow().len()
}

// ---------------------------------------------------------------------
// A cell's value type is guessed from (component type, prop name).
// ---------------------------------------------------------------------

// `math_target` (`build/expand/math.rs`) takes an answer's `submitted` to
// be a math cell in every answer form. For a choice answer it holds a
// choice index, which the math reads as handle 0: the load panics in
// `Engine::evaluate`.
#[test]
#[ignore = "known bug: a choice answer's submitted index is read as a math handle"]
fn a_math_of_a_choice_answers_submitted_loads() {
    let doc = load(
        r#"<answer name="a"><choiceInput name="ci">
  <choice credit="1">cat</choice><choice>dog</choice>
</choiceInput></answer>
<math name="mm">$a.submitted</math>"#,
    );
    assert!(doc.is_ok(), "{:?}", doc.err());
}

// A text answer's `response` is a string id. `values.rs` says a text value
// never reaches a numeric one, but arithmetic and comparison read the id
// as a number.
#[test]
#[ignore = "known bug: a text answer's response is computed with as a number"]
fn a_text_response_is_not_a_number() {
    let doc = load(
        r#"<answer name="a" type="text"><textInput name="ti" prefill="hello"/><award>yes</award></answer>
<number name="n">$a.response + 1</number>
<boolean name="b">$a.response > 3</boolean>"#,
    )
    .unwrap();
    assert!(
        v(&doc, "n", "value").is_nan(),
        "n = {}",
        v(&doc, "n", "value")
    );
    assert_eq!(v(&doc, "b", "value"), 0.0);
}

// The same id placed in a paragraph renders as its number.
#[test]
#[ignore = "known bug: a text answer's response renders as its string id"]
fn a_placed_text_response_renders_its_text() {
    let doc = load(
        r#"<answer name="a" type="text"><textInput name="ti" prefill="hello"/><award>yes</award></answer>
<p name="p1">$a.response</p>"#,
    )
    .unwrap();
    assert_eq!(doc.rendered_text(doc.component("p1").unwrap()), "hello");
}

// `emit.rs` decides an essential value is text only when a `textInput`
// owns the defining slot of its alias class. Here the `<text>` defines
// it, so the typed text is saved as a raw string id and restores empty.
#[test]
#[ignore = "known bug: text bound to a textInput is saved as a number"]
fn text_bound_to_a_text_input_survives_save_and_restore() {
    let src = r#"<text name="t1">hello</text><textInput name="ti" bindValueTo="$t1"/>"#;
    let mut doc = load(src).unwrap();
    let id = doc.intern("bye there");
    set(&mut doc, "ti", "value", id);
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    let cell = fresh.cell("ti", "value").unwrap();
    assert_eq!(fresh.text_value(cell), "bye there");
}

// A text answer's `submitted` is saved as a number too. It restores only
// while strings are interned in the same order; typing twice before
// submitting breaks that.
#[test]
#[ignore = "known bug: a text answer's submitted value is saved as a number"]
fn a_submitted_text_response_survives_save_and_restore() {
    let src = r#"<answer name="a" type="text"><textInput name="ti"/><award>yes</award></answer>"#;
    let mut doc = load(src).unwrap();
    for s in ["first", "nope"] {
        let id = doc.intern(s);
        set(&mut doc, "ti", "value", id);
    }
    doc.submit(doc.component("a").unwrap());
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    let cell = fresh.cell("a", "submitted").unwrap();
    assert_eq!(fresh.text_value(cell), "nope");
}

// A request is not checked against its cell's kind: a number requested of
// a math cell is taken as a handle, so it shows another expression of the
// engine, or panics when out of range.
#[test]
#[ignore = "known bug: a number requested of a math cell is taken as a handle"]
fn a_number_requested_of_a_math_cell_is_dropped() {
    let mut doc =
        load(r#"<mathInput name="mi" prefill="3"/><math name="mm" simplify>$mi x</math>"#).unwrap();
    let before = doc.math_text(doc.cell("mi", "expr").unwrap());
    let t = set(&mut doc, "mi", "expr", 2.7);
    assert_eq!(t.dropped.len(), 1);
    assert_eq!(doc.math_text(doc.cell("mi", "expr").unwrap()), before);
    let t = set(&mut doc, "mi", "expr", 1e6);
    assert_eq!(t.dropped.len(), 1);
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
// Essential values are keyed by layout.
// ---------------------------------------------------------------------

// An essential value's key is (scope, slot offset), and a slot offset is
// a running sum over the template's elements. An element first boxed on a
// rebuild has no props, so every later element's key shifts and its value
// is lost. Here the probe resolves `$r[2].s[1]` to option 1 and passes;
// the real build resolves it to iteration 2's pick, which for some seeds
// is the option of two components, an ambiguous reference.
#[test]
#[ignore = "known bug: an element boxed on a rebuild shifts later essential keys"]
fn an_element_boxed_on_a_rebuild_keeps_later_values() {
    let src = r#"<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n">
  <select name="s">
    <option><number name="a">1</number></option>
    <option><number name="a">2</number><number name="b">3</number></option>
  </select>
</repeatForSequence>
<number name="y">$r[2].s[1]</number>
<numberInput name="m" value="5"/>"#;
    for seed in 0..12 {
        let mut doc = load_with_seed(src, seed).unwrap();
        set(&mut doc, "m", "value", 7.0);
        let t = set(&mut doc, "n", "value", 2.0);
        assert!(
            t.rebuild_error.is_none(),
            "seed {seed}: {:?}",
            t.rebuild_error
        );
        assert_eq!(v(&doc, "m", "value"), 7.0, "seed {seed}");
    }
}

// Saved state names an iteration by its scope id, which is assigned in
// the order iterations are first stamped. Growing `rb` before `ra` gives
// the ids in the other order from a fresh load, so the values swap.
#[test]
#[ignore = "known bug: saved state keys iterations by growth-order scope ids"]
fn saved_iterations_restore_whatever_order_they_grew_in() {
    let src = r#"<numberInput name="na" value="1"/><numberInput name="nb" value="1"/>
<repeatForSequence name="ra" length="$na"><numberInput name="xa" value="0"/></repeatForSequence>
<repeatForSequence name="rb" length="$nb"><numberInput name="xb" value="0"/></repeatForSequence>
<number name="a2">$ra[2].xa</number><number name="b2">$rb[2].xb</number>"#;
    let mut doc = load(src).unwrap();
    set(&mut doc, "nb", "value", 2.0);
    set(&mut doc, "b2", "value", 22.0);
    set(&mut doc, "na", "value", 2.0);
    set(&mut doc, "a2", "value", 11.0);
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "a2", "value"), 11.0);
    assert_eq!(v(&fresh, "b2", "value"), 22.0);
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

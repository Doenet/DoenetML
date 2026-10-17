//! Bugs found by a design review of the core, each kept as an ignored
//! test asserting the behaviour a fix should give (the convention of the
//! rebuild-cycle survey). Run them with `cargo test --test known_bugs --
//! --ignored`; a fix moves its test to the file for its topic.
//!
//! What remains has one structural cause: math handles have no identity,
//! so equal values get new handles.

mod common;
use common::set;

use cells_core::Document;
use cells_core::testing::test_utils::load;

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

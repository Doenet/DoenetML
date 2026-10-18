//! `<slider>` in numeric mode: the value chain is composed from ordinary
//! operators (see `SLIDER_PROPS`), so snapping, clamping and binding are all
//! the generic inverse at work. These tests mirror the current core's
//! behavior described in `docs/history/instructions2.md`.

mod common;

use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::{req, v};

#[test]
fn slider_derives_value_from_its_essential_cell() {
    let doc = load(r#"<slider name="s" from="0" to="10" step="1" initialValue="3"/>"#).unwrap();
    assert_eq!(v(&doc, "s", "value"), 3.0);
    assert_eq!(v(&doc, "s", "index"), 3.0);
    assert_eq!(v(&doc, "s", "maxIndex"), 10.0);
    // One essential cell per attribute plus the stored value.
    assert_eq!(doc.n_essential, 4);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn requests_snap_to_the_nearest_step_and_clamp_to_the_range() {
    let mut doc = load(r#"<slider name="s" from="0" to="10" step="1"/>"#).unwrap();
    let tick = doc.request(&[req(&doc, "s", "value", 3.7)]);
    assert!(tick.dropped.is_empty());
    assert_eq!(v(&doc, "s", "value"), 4.0);
    // The stored value is the snapped value, as in the current core.
    assert_eq!(v(&doc, "s", "preliminaryValue"), 4.0);
    doc.request(&[req(&doc, "s", "value", 15.0)]);
    assert_eq!(v(&doc, "s", "value"), 10.0);
    doc.request(&[req(&doc, "s", "value", -3.0)]);
    assert_eq!(v(&doc, "s", "value"), 0.0);
    doc.request(&[req(&doc, "s", "value", 2.5)]);
    assert_eq!(
        v(&doc, "s", "value"),
        3.0,
        "half rounds away from zero as in Math.round"
    );
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn non_finite_requests_are_dropped() {
    // NaN reaches Round, whose domain excludes it; infinite asks are dropped
    // before inversion. Both match the current core.
    let mut doc = load(r#"<slider name="s" initialValue="2"/>"#).unwrap();
    for bad in [f64::NAN, f64::INFINITY, f64::NEG_INFINITY] {
        let tick = doc.request(&[req(&doc, "s", "value", bad)]);
        assert_eq!(tick.dropped.len(), 1);
        assert_eq!(v(&doc, "s", "value"), 2.0);
    }
}

#[test]
fn fractional_steps_count_items_like_the_current_core() {
    // (0.7 - 0) / 0.1 is 6.999999999999999 in floating point; the 1e-10
    // nudge before the floor makes it 7 items plus one, as Slider.js does.
    let doc = load(r#"<slider name="s" from="0" to="0.7" step="0.1"/>"#).unwrap();
    assert_eq!(v(&doc, "s", "maxIndex"), 7.0);
    let mut doc = doc;
    doc.request(&[req(&doc, "s", "value", 0.66)]);
    assert!((v(&doc, "s", "value") - 0.7).abs() < 1e-12);
}

#[test]
fn a_request_on_index_snaps_too() {
    // The current core rejects a non-integer index; here the same projection
    // rule that snaps value snaps index. Recorded as a benign deviation.
    let mut doc = load(r#"<slider name="s" from="0" to="10"/>"#).unwrap();
    doc.request(&[req(&doc, "s", "index", 3.4)]);
    assert_eq!(v(&doc, "s", "index"), 3.0);
    assert_eq!(v(&doc, "s", "value"), 3.0);
    doc.request(&[req(&doc, "s", "index", 40.0)]);
    assert_eq!(v(&doc, "s", "index"), 10.0);
}

#[test]
fn bind_value_to_aliases_the_bound_value_and_sends_the_snapped_value_down() {
    let mut doc = load(r#"<numberInput name="n" value="2"/><slider name="s" from="0" to="20" step="1" bindValueTo="$n"/>"#).unwrap();
    // The bound value is the slider's storage: no essential cell of its own.
    assert_eq!(doc.cell("s", "preliminaryValue"), doc.cell("n", "value"));
    assert_eq!(v(&doc, "s", "value"), 2.0);
    doc.request(&[req(&doc, "s", "value", 7.4)]);
    assert_eq!(
        v(&doc, "n", "value"),
        7.0,
        "bound component receives the snapped value"
    );
    assert_eq!(v(&doc, "s", "value"), 7.0);
    // Writing an off-grid value to the input shows snapped on the slider while
    // the input keeps the raw value; nothing writes back.
    doc.request(&[req(&doc, "n", "value", 7.4)]);
    assert_eq!(v(&doc, "n", "value"), 7.4);
    assert_eq!(v(&doc, "s", "value"), 7.0);
    // An emptied input puts the slider at `from`, as in the current core.
    doc.request(&[req(&doc, "n", "value", f64::NAN)]);
    assert_eq!(v(&doc, "s", "value"), 0.0);
    assert!(v(&doc, "n", "value").is_nan());
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn bind_value_to_a_derived_number_continues_the_inverse_chain() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
           <op name="d" kind="scale" k="2" args="$n"/>
           <slider name="s" from="0" to="20" step="1" bindValueTo="$d"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "s", "value"), 2.0);
    doc.request(&[req(&doc, "s", "value", 7.4)]);
    assert_eq!(v(&doc, "s", "value"), 7.0);
    assert_eq!(v(&doc, "d", "value"), 7.0);
    assert_eq!(
        v(&doc, "n", "value"),
        3.5,
        "the chain crosses the derived number into the input"
    );
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn slider_bound_to_a_slider_with_a_different_step() {
    let mut doc = load(
        r#"<slider name="fine" from="0" to="10" step="0.5" initialValue="3"/>
           <slider name="coarse" from="0" to="10" step="2" bindValueTo="$fine"/>"#,
    )
    .unwrap();
    assert_eq!(
        v(&doc, "coarse", "value"),
        4.0,
        "3 snaps up to 4 on the coarse grid"
    );
    // Dragging the coarse slider: coarse snaps to 6, fine stores 6 (on its grid).
    doc.request(&[req(&doc, "coarse", "value", 5.3)]);
    assert_eq!(v(&doc, "coarse", "value"), 6.0);
    assert_eq!(v(&doc, "fine", "value"), 6.0);
    assert_eq!(v(&doc, "fine", "preliminaryValue"), 6.0);
    // Dragging the fine slider: the lower projection wins for storage, the
    // upper one re-snaps for display.
    doc.request(&[req(&doc, "fine", "value", 3.6)]);
    assert_eq!(v(&doc, "fine", "value"), 3.5);
    assert_eq!(v(&doc, "coarse", "value"), 4.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn step_bound_to_another_slider() {
    let mut doc = load(
        r#"<slider name="st" from="1" to="4" step="1" initialValue="2"/>
           <slider name="s" from="0" to="10" step="$st" initialValue="7"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "s", "value"), 8.0, "7 on a step-2 grid snaps to 8");
    doc.request(&[req(&doc, "st", "value", 3.0)]);
    assert_eq!(v(&doc, "s", "maxIndex"), 3.0);
    // The stored value is still 7 (display snapped to 8 at step 2, storage
    // did not change); round(7/3) = 2, so value is 6 on the step-3 grid.
    assert_eq!(v(&doc, "s", "value"), 6.0);
}

#[test]
fn referencing_a_slider_value_from_a_point() {
    let mut doc = load(
        r#"<slider name="s" from="-5" to="5" step="1" initialValue="1"/>
           <graph><point name="p" x="$s" y="0"/></graph>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "p", "x"), 1.0);
    // Dragging the point writes through the slider's inverse.
    doc.request(&[req(&doc, "p", "x", 2.6)]);
    assert_eq!(v(&doc, "p", "x"), 3.0);
    assert_eq!(v(&doc, "s", "value"), 3.0);
}

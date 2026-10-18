//! `fixed` (and a graph's `fixAxes`) given by a reference: the element's
//! cells sit behind `Hold` instructions on the flag, so requests through the
//! element are dropped while the flag is set, and the element follows its
//! sources either way. A literal `fixed` still makes fixed cells.

mod common;
use common::*;

use cells_core::Document;
use cells_core::testing::test_utils::load;

fn set(doc: &mut Document, name: &str, prop: &str, value: f64) -> usize {
    let r = req(doc, name, prop, value);
    doc.request(&[r]).dropped.len()
}

#[test]
fn a_point_with_dynamic_fixed() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <point name="P" x="1" y="2" fixed="$b"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "P", "x", 5.0), 1);
    assert_eq!(v(&doc, "P", "x"), 1.0);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "P", "x", 5.0), 0);
    assert_eq!(v(&doc, "P", "x"), 5.0);
    // Fixing again holds the point where it was moved.
    set(&mut doc, "b", "value", 1.0);
    assert_eq!(set(&mut doc, "P", "y", 7.0), 1);
    assert_eq!((v(&doc, "P", "x"), v(&doc, "P", "y")), (5.0, 2.0));
}

/// A fixed element cannot be moved, but what it references can: the gate
/// sits between the element and its sources.
#[test]
fn a_fixed_point_follows_the_point_it_references() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <point name="A" x="1" y="2"/>
           <point name="P" x="$A.x" y="3" fixed="$b"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "P", "x", 9.0), 1);
    assert_eq!(v(&doc, "A", "x"), 1.0);
    assert_eq!(set(&mut doc, "A", "x", 4.0), 0);
    assert_eq!(v(&doc, "P", "x"), 4.0);
}

/// A copy shares the original's cells, so it shares the gate too.
#[test]
fn a_copy_of_a_dynamically_fixed_point_is_fixed() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <point name="P" x="1" y="2" fixed="$b"/>
           <point name="Q" extend="$P"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "Q", "x", 5.0), 1);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "Q", "x", 5.0), 0);
    assert_eq!(v(&doc, "P", "x"), 5.0);
}

/// Requests on a circle's center invert through `CircleCenterPoint` into its
/// own center and through-point slots, which are gated.
#[test]
fn a_circle_with_dynamic_fixed() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <point name="C" x="0" y="0"/>
           <circle name="c" center="$C" through="(3, 4)" fixed="$b"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "c", "radius"), 5.0);
    let t = doc.request(&[req(&doc, "c", "cx", 2.0), req(&doc, "c", "cy", 2.0)]);
    assert!(!t.dropped.is_empty());
    assert_eq!(v(&doc, "C", "x"), 0.0);
    // The radius fans out to both coordinates of the through point.
    assert_eq!(set(&mut doc, "c", "radius", 10.0), 2);
    assert_eq!(v(&doc, "c", "radius"), 5.0);
    // The referenced center still moves the circle.
    set(&mut doc, "C", "x", 1.0);
    assert_eq!(v(&doc, "c", "cx"), 1.0);

    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "c", "radius", 10.0), 0);
    assert_close!(v(&doc, "c", "radius"), 10.0);
}

#[test]
fn an_input_with_dynamic_fixed() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <numberInput name="n" value="3" fixed="$b"/>
           <op name="twice" kind="scale" k="2" args="$n"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "n", "value", 4.0), 1);
    assert_eq!(set(&mut doc, "twice", "value", 10.0), 1);
    assert_eq!(v(&doc, "n", "value"), 3.0);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "twice", "value", 10.0), 0);
    assert_eq!(v(&doc, "n", "value"), 5.0);
}

/// A copy with its own `fixed` gates only itself: the original stays free,
/// and the copy follows it.
#[test]
fn a_copy_fixed_on_its_own() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <numberInput name="n" value="3"/>
           <numberInput name="m" extend="$n" fixed="$b"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "m", "value", 4.0), 1);
    assert_eq!(set(&mut doc, "n", "value", 6.0), 0);
    assert_eq!(v(&doc, "m", "value"), 6.0);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "m", "value", 4.0), 0);
    assert_eq!(v(&doc, "n", "value"), 4.0);
}

/// `Graph.xMin` refuses requests while `fixAxes` (or `fixed`) is set.
#[test]
fn graph_axes_with_dynamic_fix_axes_and_fixed() {
    let mut doc = load(
        r#"<booleanInput name="fa" value="true"/>
           <booleanInput name="f" value="false"/>
           <graph name="g" xmin="-5" fixAxes="$fa" fixed="$f"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "g", "xmin", -3.0), 1);
    assert_eq!(set(&mut doc, "g", "ymax", 3.0), 1);
    set(&mut doc, "fa", "value", 0.0);
    assert_eq!(set(&mut doc, "g", "xmin", -3.0), 0);
    assert_eq!(v(&doc, "g", "xmin"), -3.0);
    // Either flag holds the axes.
    set(&mut doc, "f", "value", 1.0);
    assert_eq!(set(&mut doc, "g", "xmin", -1.0), 1);
    assert_eq!(v(&doc, "g", "xmin"), -3.0);
}

/// A literal `fixAxes` makes fixed cells, like a literal `fixed`.
#[test]
fn graph_with_literal_fix_axes() {
    let mut doc = load(r#"<graph name="g" fixAxes/>"#).unwrap();
    assert_eq!(set(&mut doc, "g", "xmin", -3.0), 1);
    assert_eq!(v(&doc, "g", "xmin"), -10.0);
}

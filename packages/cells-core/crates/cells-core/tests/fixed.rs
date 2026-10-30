//! `fixed` (and a graph's `fixAxes`) given by a reference: the element's
//! cells are held by the flag (`Program::holds`), so requests through the
//! element are dropped while the flag is set, and the element follows its
//! sources either way. A literal `fixed` holds them always, so the classing
//! makes its values constants. A prop no
//! renderer requests, a circle's radius, is requested through an input
//! bound to it, as in a document (ADR 0018).

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
/// own center and through-point slots, which are held.
#[test]
fn a_circle_with_dynamic_fixed() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <point name="C" x="0" y="0"/>
           <circle name="c" center="$C" through="(3, 4)" fixed="$b"/>
           <mathInput name="r" bindValueTo="$c.radius"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "c", "radius"), 5.0);
    let t = doc.request(&[req(&doc, "c", "cx", 2.0), req(&doc, "c", "cy", 2.0)]);
    assert!(!t.dropped.is_empty());
    assert_eq!(v(&doc, "C", "x"), 0.0);
    // The radius is the circle's own cell, held: the request stops there.
    assert_eq!(set(&mut doc, "r", "value", 10.0), 1);
    assert_eq!(v(&doc, "c", "radius"), 5.0);
    // The referenced center still moves the circle.
    set(&mut doc, "C", "x", 1.0);
    assert_eq!(v(&doc, "c", "cx"), 1.0);

    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "r", "value", 10.0), 0);
    assert_close!(v(&doc, "c", "radius"), 10.0);
}

#[test]
fn an_input_with_dynamic_fixed() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <numberInput name="n" value="3" fixed="$b"/>
           <number name="twice">2 * $n</number>
           <mathInput name="t" bindValueTo="$twice"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "n", "value", 4.0), 1);
    assert_eq!(set(&mut doc, "t", "value", 10.0), 1);
    assert_eq!(v(&doc, "n", "value"), 3.0);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "t", "value", 10.0), 0);
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

/// A literal `fixAxes` makes constants, like a literal `fixed`.
#[test]
fn graph_with_literal_fix_axes() {
    let mut doc = load(r#"<graph name="g" fixAxes/>"#).unwrap();
    assert_eq!(set(&mut doc, "g", "xmin", -3.0), 1);
    assert_eq!(v(&doc, "g", "xmin"), -10.0);
}

/// A copy with a literal `fixed` refuses requests, like `fixed="$b"` while
/// `$b` is true, and still follows its referent.
fn literal_fixed_copy(source: &str, prop: &str, from: f64) {
    literal_fixed_copy_through(source, prop, from, [("P", prop), ("Q", prop)]);
}

/// `literal_fixed_copy`, requesting `P`'s and `Q`'s prop on the cells
/// `through` names: the props themselves, or inputs bound to them.
fn literal_fixed_copy_through(source: &str, prop: &str, from: f64, through: [(&str, &str); 2]) {
    let [(p, p_prop), (q, q_prop)] = through;
    let mut doc = load(source).unwrap();
    assert_eq!(set(&mut doc, q, q_prop, 9.0), 1, "{source}");
    assert_eq!(v(&doc, "P", prop), from, "{source}");
    assert_eq!(v(&doc, "Q", prop), from, "{source}");
    assert_eq!(set(&mut doc, p, p_prop, 5.0), 0, "{source}");
    assert_eq!(v(&doc, "Q", prop), 5.0, "{source}");
    assert_eq!(set(&mut doc, q, q_prop, 9.0), 1, "{source}");
    assert_eq!(v(&doc, "P", prop), 5.0, "{source}");
}

#[test]
fn a_point_copy_with_literal_fixed() {
    for fixed in ["fixed", r#"fixed="true""#] {
        literal_fixed_copy(
            &format!(
                r#"<graph><point name="P">(1,2)</point><point name="Q" extend="$P" {fixed}/></graph>"#
            ),
            "x",
            1.0,
        );
    }
}

#[test]
fn a_circle_copy_with_literal_fixed() {
    literal_fixed_copy_through(
        r#"<graph><circle name="P" radius="2"/><circle name="Q" extend="$P" fixed="true"/></graph>
           <mathInput name="iP" bindValueTo="$P.radius"/><mathInput name="iQ" bindValueTo="$Q.radius"/>"#,
        "radius",
        2.0,
        [("iP", "value"), ("iQ", "value")],
    );
}

#[test]
fn a_number_input_copy_with_literal_fixed() {
    literal_fixed_copy(
        r#"<numberInput name="P" value="3"/><numberInput name="Q" extend="$P" fixed="true"/>"#,
        "value",
        3.0,
    );
}

/// A literal `fixed` holds references too: the point refuses a move rather
/// than moving the point it references, and still follows it.
#[test]
fn a_literal_fixed_point_follows_the_point_it_references() {
    let mut doc = load(
        r#"<point name="A" x="1" y="2"/>
           <point name="P" x="$A.x" y="3" fixed/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "P", "x", 5.0), 1);
    assert_eq!(v(&doc, "A", "x"), 1.0);
    set(&mut doc, "A", "x", 4.0);
    assert_eq!(v(&doc, "P", "x"), 4.0);
}

// `fixed` and `fixLocation` are inherited from the nearest element around
// that gives them (ADR 0022; CTX-5 of the principles): a container's
// content is fixed with the container unless it says otherwise.

#[test]
fn a_fixed_graph_fixes_the_points_inside_it() {
    for container in ["graph", "group", "section", "p"] {
        let mut doc = load(&format!(
            r#"<{container} fixed><point name="P" x="1" y="2"/></{container}>"#
        ))
        .unwrap();
        assert_eq!(set(&mut doc, "P", "x", 9.0), 1, "<{container} fixed>");
        assert_eq!(v(&doc, "P", "x"), 1.0);
    }
}

#[test]
fn an_items_own_fixed_false_wins_over_its_container() {
    let mut doc = load(
        r#"<graph fixed>
             <point name="P" x="1" y="2" fixed="false"/>
             <group fixed="false"><point name="Q" x="3" y="4"/></group>
             <point name="R" x="5" y="6"/>
           </graph>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "P", "x", 9.0), 0, "its own fixed=\"false\"");
    assert_eq!(
        set(&mut doc, "Q", "x", 9.0),
        0,
        "the nearer group says false"
    );
    assert_eq!(set(&mut doc, "R", "x", 9.0), 1, "the graph's fixed");
    assert_eq!(
        (v(&doc, "P", "x"), v(&doc, "Q", "x"), v(&doc, "R", "x")),
        (9.0, 9.0, 5.0)
    );
}

#[test]
fn a_dynamic_fixed_on_a_container_gates_its_content() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <graph fixed="$b"><point name="P" x="1" y="2"/></graph>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "P", "x", 9.0), 1);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "P", "x", 9.0), 0);
    assert_eq!(v(&doc, "P", "x"), 9.0);
}

/// Through a repeat: the container is in the template above, and a flag
/// it names resolves where the container sits, not where the point does.
#[test]
fn a_fixed_container_reaches_into_a_repeat() {
    let mut doc = load(
        r#"<booleanInput name="b" value="true"/>
           <graph fixed>
             <repeatForSequence name="r" from="1" to="2"><point name="P" x="1" y="2"/></repeatForSequence>
           </graph>
           <graph fixed="$b">
             <repeatForSequence name="s" from="1" to="2">
               <booleanInput name="b" value="false"/>
               <point name="Q" x="3" y="4"/>
             </repeatForSequence>
           </graph>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "r[2].P", "x", 9.0), 1);
    // The graph's `$b` is the document's `b`, not the iteration's.
    assert_eq!(set(&mut doc, "s[1].Q", "x", 9.0), 1);
    set(&mut doc, "b", "value", 0.0);
    assert_eq!(set(&mut doc, "s[1].Q", "x", 9.0), 0);
    assert_eq!(v(&doc, "s[1].Q", "x"), 9.0);
}

/// A copy sits where it is written: a fixed copy of a graph holds its
/// clones' aliases, and the original's points still move.
#[test]
fn a_fixed_container_copy_holds_its_clones() {
    let mut doc = load(
        r#"<graph name="g"><point name="p" x="1" y="2"/></graph>
           <graph name="h" extend="$g" fixed/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "h.p", "x", 9.0), 1);
    assert_eq!(set(&mut doc, "g.p", "x", 9.0), 0);
    assert_eq!(v(&doc, "h.p", "x"), 9.0);
}

#[test]
fn fix_location_holds_a_shape_and_is_inherited() {
    let mut doc = load(
        r#"<graph fixLocation>
             <point name="P" x="1" y="2"/>
             <circle name="c" center="(0,0)" radius="2"/>
             <mathInput name="r" bindValueTo="$c.radius"/>
           </graph>
           <point name="Q" x="3" y="4" fixLocation/>
           <point name="R" x="5" y="6" fixLocation="false"/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "P", "x", 9.0), 1);
    assert_eq!(
        set(&mut doc, "r", "value", 5.0),
        1,
        "a radius is a location"
    );
    assert_eq!(set(&mut doc, "Q", "x", 9.0), 1);
    assert_eq!(set(&mut doc, "R", "x", 9.0), 0);
}

/// A type without location state has nothing for `fixLocation` to hold:
/// its value still takes a write.
#[test]
fn fix_location_leaves_a_value_writable() {
    let mut doc = load(
        r#"<number name="n">3</number>
           <mathInput name="mi" bindValueTo="$n" fixLocation/>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "mi", "value", 5.0), 0);
    assert_eq!(v(&doc, "n", "value"), 5.0);
}

/// What holds an element is decided beside its plans, whatever planned it
/// (`Compiler::plan_hold`), and held in its cells, so it holds the
/// elements no planner of the prop table or `extend` handles: a type with a planner of its own (a
/// `<math>`, reached through an input bound to it), an `extend` of a
/// prop, and an essential math (an unbound `<mathInput>`'s expression).
/// Each once took the write.
#[test]
fn fixed_holds_however_an_element_is_planned() {
    let mut doc = load(
        r#"<group fixed>
             <math name="m">3</math>
             <mathInput name="typed"/>
           </group>
           <mathInput name="mi" bindValueTo="$m"/>
           <point name="C">(1,2)</point>
           <graph fixed><point name="Q" extend="$C.coords"/></graph>"#,
    )
    .unwrap();
    assert_eq!(set(&mut doc, "mi", "value", 7.0), 1);
    assert_eq!(v(&doc, "m", "value"), 3.0);
    assert_eq!(set(&mut doc, "typed", "value", 7.0), 1);
    assert_eq!(set(&mut doc, "Q", "x", 9.0), 1);
    assert_eq!(v(&doc, "C", "x"), 1.0);
}

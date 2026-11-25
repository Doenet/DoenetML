//! Dynamic sequences (ADR 0041, decision 2 and step 5): a capped list,
//! `cap` entries padded with the missing value and a live length, whose
//! rows hide past it, whose text and paths stop at it.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::*;

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn an_intersection_shows_its_points_up_to_its_live_length() {
    let mut doc = load(
        r#"<graph>
             <point name="P">(3,4)</point>
             <circle name="c" center="$P" radius="1"/>
             <line name="l" through="(4,1) (4,-4)"/>
             <intersection name="int">$l $c</intersection>
           </graph>
           <booleanInput name="h"/>
           <p name="p">At: <intersection name="int2" hide="$h">$l $c</intersection></p>
           <p name="q"><intersection asList="false" extend="$int"/></p>"#,
    )
    .unwrap();
    // Tangent: one point; the path to the second names nothing.
    assert_eq!(text(&doc, "p"), "At: (4, 4)");
    assert!(doc.resolve_path("int[1]").is_some());
    assert!(doc.resolve_path("int[2]").is_none());
    move_point(&mut doc, "P", 4.0, 5.0);
    assert_eq!(text(&doc, "p"), "At: (4, 6), (4, 4)");
    assert_eq!(text(&doc, "q"), "(4, 6)(4, 4)");
    assert!(doc.resolve_path("int[2]").is_some());
    // Hidden by the author: no text, though it has its points.
    set(&mut doc, "h", "value", 1.0);
    assert_eq!(text(&doc, "p"), "At: ");
    assert!(doc.resolve_path("int2[2]").is_some());
    move_point(&mut doc, "P", 9.0, 5.0);
    assert!(doc.resolve_path("int[1]").is_none());
    assert_eq!(reference::check(&doc), None);
}

/// The `hide` of each row of capped list `name`, in order.
fn row_hides(doc: &Document, name: &str) -> Vec<f64> {
    doc.children(doc.resolve_path(name).unwrap())
        .filter_map(|c| match c {
            cells_core::Child::Component(k) => Some(k),
            cells_core::Child::Text(_) => None,
        })
        .map(|k| {
            let pi = doc.component_type(k).prop_index("hide").unwrap();
            doc.cells[doc.comp_cells(k)[pi].index()]
        })
        .collect()
}

#[test]
fn a_capped_lists_rows_hide_by_its_hide_sequence() {
    // The hide sequence is no prop of the list (ADR 0086): its rows read it.
    let mut doc = load(
        r#"<graph>
             <point name="P">(3,4)</point>
             <circle name="c" center="$P" radius="1"/>
             <line name="l" through="(4,1) (4,-4)"/>
             <intersection name="int" hide="$h">$l $c</intersection>
           </graph>
           <booleanInput name="h"/>"#,
    )
    .unwrap();
    let int = doc.resolve_path("int").unwrap();
    assert!(doc.prop_cells(int, "hidden").is_none());
    assert_eq!(row_hides(&doc, "int"), [0.0, 1.0]);
    move_point(&mut doc, "P", 4.0, 5.0);
    assert_eq!(row_hides(&doc, "int"), [0.0, 0.0]);
    set(&mut doc, "h", "value", 1.0);
    assert_eq!(row_hides(&doc, "int"), [1.0, 1.0]);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_tally_with_no_categories_is_a_capped_list_of_numbers() {
    // ADR 0086: capped at its operands, its live length the number of
    // distinct values, its rows past it hidden, its text stopping at it.
    let mut doc = load(
        r#"<numberInput name="a" value="0"><label>a</label></numberInput>
           <textList name="w">apple fig apple pear fig apple</textList>
           <p name="words"><tally type="text">$w</tally></p>
           <p name="p"><tally name="t">$a 1 1</tally></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "words"), "3, 2, 1");
    assert_eq!(text(&doc, "p"), "1, 2");
    assert_eq!(row_hides(&doc, "t"), [0.0, 0.0, 1.0]);
    assert!(doc.resolve_path("t[2]").is_some());
    set(&mut doc, "a", "value", 1.0);
    assert_eq!(text(&doc, "p"), "3");
    assert_eq!(row_hides(&doc, "t"), [0.0, 1.0, 1.0]);
    assert!(doc.resolve_path("t[2]").is_none());
    set(&mut doc, "a", "value", -2.0);
    assert_eq!(text(&doc, "p"), "1, 2");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_index_into_a_capped_list_is_a_choose() {
    let mut doc = load(
        r#"<graph>
             <point name="P">(4,5)</point>
             <circle name="c" center="$P" radius="1"/>
             <line name="l" through="(4,1) (4,-4)"/>
             <intersection name="int">$l $c</intersection>
           </graph>
           <mathInput name="k" prefill="2"/>
           <number name="y" extend="$int.points[$k].y"/>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "y", "value"), 4.0);
    set(&mut doc, "k", "value", 1.0);
    assert_eq!(v(&doc, "y", "value"), 6.0);
    // Past the live length, or no integer: the missing value.
    set(&mut doc, "k", "value", 1.5);
    assert!(v(&doc, "y", "value").is_nan());
    set(&mut doc, "k", "value", 2.0);
    move_point(&mut doc, "P", 3.0, 5.0);
    assert!(v(&doc, "y", "value").is_nan());
    assert_eq!(reference::check(&doc), None);
}

/// The expression `name.prop` holds, as the engine prints it.
fn expr(doc: &Document, name: &str, prop: &str) -> String {
    doc.math_text(doc.cell(name, prop).unwrap())
}

#[test]
fn a_math_inputs_entries_are_inside_its_handle() {
    let mut doc = load(
        r#"<mathInput name="m" prefill="(a,b,c)"/>
           <math name="m2">$m</math>
           <math name="x" extend="$m[1]"/>
           <math name="y" extend="$m2.y"/>
           <math name="x4" extend="$m.x4"/>
           <mathInput name="k" prefill="2"/>
           <math name="mk" extend="$m[$k]"/>
           <number name="n" extend="$m.numDimensions"/>
           <number name="n2" extend="$m2.numDimensions"/>
           <mathInput name="mx" bindValueTo="$x"/>
           <mathInput name="my" bindValueTo="$m2.y"/>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "x", "expr"), "a");
    assert_eq!(expr(&doc, "y", "expr"), "b");
    assert_eq!(expr(&doc, "mk", "expr"), "b");
    assert_eq!(v(&doc, "n", "value"), 3.0);
    assert_eq!(v(&doc, "n2", "value"), 3.0);
    // Past the count: the missing value.
    assert!(v(&doc, "x4", "expr").is_nan());
    // A write through an entry lands on the input, its head kept.
    type_into(&mut doc, "mx", "d");
    assert_eq!(expr(&doc, "m", "expr"), "(d, b, c)");
    type_into(&mut doc, "my", "e");
    assert_eq!(expr(&doc, "m", "expr"), "(d, e, c)");
    // A longer list: four entries.
    type_into(&mut doc, "m", "v, w, x, y");
    assert_eq!(v(&doc, "n", "value"), 4.0);
    assert_eq!(expr(&doc, "x4", "expr"), "y");
    set(&mut doc, "k", "value", 4.0);
    assert_eq!(expr(&doc, "mk", "expr"), "y");
    // An index that is no integer names nothing.
    set(&mut doc, "k", "value", 2.5);
    assert!(v(&doc, "mk", "expr").is_nan());
    // A scalar is a sequence of one.
    type_into(&mut doc, "m", "q");
    assert_eq!(expr(&doc, "x", "expr"), "q");
    assert_eq!(v(&doc, "n", "value"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_repeat_for_a_math_input_has_an_iteration_per_entry() {
    let mut doc = load(
        r#"<mathInput name="m" prefill="1, x, 3"/>
           <p name="p"><repeat name="r" for="$m" valueName="v"><math simplify>2$v</math></repeat></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "2, 2 x, 6");
    type_into(&mut doc, "m", "a, b");
    assert_eq!(text(&doc, "p"), "2 a, 2 b");
    type_into(&mut doc, "m", "y");
    assert_eq!(text(&doc, "p"), "2 y");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn an_index_into_a_props_value_is_inside_its_handle() {
    let doc = load(
        r#"<subsetOfReals name="S">{1, 3} or (4, 5)</subsetOfReals>
           <math name="p2" extend="$S.points[2]"/>
           <math name="p9" extend="$S.points[9]"/>"#,
    )
    .unwrap();
    assert_eq!(expr(&doc, "p2", "expr"), "3");
    assert!(v(&doc, "p9", "expr").is_nan());
    assert_eq!(reference::check(&doc), None);
}

/// A list whose content is one reference to a math value is a list over
/// it (ADR 0063): its count follows the value, a change of it a rebuild,
/// and a write through an entry writes the value.
#[test]
fn a_list_over_a_math_inputs_value_follows_it() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="1, x, 3"/>
           <p name="p"><mathList name="l">$mi</mathList></p>
           <p name="q"><numberList name="nl">$mi</numberList></p>
           <mathInput name="w" bindValueTo="$l[2]"/>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "1, x, 3");
    assert_eq!(text(&doc, "q"), "1, NaN, 3");
    assert!(doc.resolve_path("l[3]").is_some());
    type_into(&mut doc, "mi", "a, b");
    assert_eq!(text(&doc, "p"), "a, b");
    assert!(doc.resolve_path("l[3]").is_none());
    type_into(&mut doc, "w", "c");
    assert_eq!(expr(&doc, "mi", "expr"), "a, c");
    // A value that is no list is one entry: a tuple too.
    type_into(&mut doc, "mi", "(1, 2)");
    assert_eq!(text(&doc, "p"), "(1, 2)");
    assert_eq!(reference::check(&doc), None);
}

/// A point list over a function's extrema has a point per extremum, and
/// none for a global maximum there is not (ADR 0063).
#[test]
fn a_point_list_over_a_functions_extrema_has_a_point_each() {
    let doc = load(
        r#"<function name="f">x^4-8x^2+8</function>
           <p name="mn"><pointList name="l" extend="$f.minima"/></p>
           <p name="gmin"><pointList name="g" extend="$f.globalMinimum"/></p>
           <p name="gmax"><pointList name="h" extend="$f.globalMaximum"/></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "mn"), "(-2, -8), (2, -8)");
    assert_eq!(text(&doc, "gmin"), "(-2, -8)");
    assert_eq!(text(&doc, "gmax"), "");
    assert_eq!(v(&doc, "l[2]", "x"), 2.0);
    assert!(doc.resolve_path("h[1]").is_none());
    assert_eq!(reference::check(&doc), None);
}

/// A copied container's clone of a list over a math value is refused, as
/// a clone of a repeat is, and boxed alone (ADR 0063).
#[test]
fn a_clone_of_a_list_over_a_value_is_refused() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="1, 2"/>
           <section name="s"><p name="p"><mathList name="l">$mi</mathList>
             <mathList name="l2">$mi</mathList></p></section>
           <section name="s2" extend="$s"/>"#,
    )
    .unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .any(|d| d.message.contains("inside a copied container")),
        "{:?}",
        doc.diagnostics()
    );
    type_into(&mut doc, "mi", "a, b, c");
    assert_eq!(text(&doc, "s.p"), "a, b, ca, b, c");
    assert_eq!(reference::check(&doc), None);
}

/// An operator over one math value reduces its entries inside the value
/// (ADR 0063): no rebuild, and a number where they are numbers.
#[test]
fn an_operator_over_a_math_value_reduces_its_entries() {
    let mut doc = load(
        r#"<mathInput name="mi" prefill="1, 2, 3"/>
           <sum name="s">$mi</sum><mean name="m">$mi</mean><count name="c">$mi</count>
           <max name="mx">$mi</max><median name="md">$mi</median>
           <variance name="va" population>$mi</variance>
           <mathList name="l">$mi</mathList><count name="cl">$l</count>"#,
    )
    .unwrap();
    assert_eq!(v(&doc, "s", "value"), 6.0);
    assert_eq!(v(&doc, "m", "value"), 2.0);
    assert_eq!(v(&doc, "c", "value"), 3.0);
    assert_eq!(v(&doc, "mx", "value"), 3.0);
    assert_eq!(v(&doc, "md", "value"), 2.0);
    assert!(close(v(&doc, "va", "value"), 2.0 / 3.0));
    assert_eq!(v(&doc, "cl", "value"), 3.0);
    type_into(&mut doc, "mi", "x, y");
    assert_eq!(expr(&doc, "s", "expr"), "x + y");
    assert_eq!(v(&doc, "c", "value"), 2.0);
    type_into(&mut doc, "mi", "4");
    assert_eq!(v(&doc, "s", "value"), 4.0);
    assert_eq!(v(&doc, "c", "value"), 1.0);
    assert_eq!(reference::check(&doc), None);
}

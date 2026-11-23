//! Values with entries inside a math (ADR 0041, decision 8): a list,
//! tuple, vector, interval, set or matrix is one math cell, its head kept,
//! and two compare by the JavaScript core's lattice.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::{set, type_into};

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

fn truth(doc: &Document, name: &str) -> bool {
    doc.value(name, "value") == Some(1.0)
}

fn loads(src: &str) -> Document {
    let doc = load(src).unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .all(|d| d.code.starts_with("doenet-a")),
        "{:?}",
        doc.diagnostics()
    );
    doc
}

#[test]
fn a_math_keeps_its_head() {
    let doc = loads(
        r#"<math name="l">1, 2, x</math>
           <math name="s">{1, 2}</math>
           <math name="i">[1, 2)</math>
           <math name="j">(x, 3]</math>
           <math name="v">⟨1, 2⟩</math>
           <math name="a">[x, y]</math>"#,
    );
    assert_eq!(text(&doc, "l"), "1, 2, x");
    assert_eq!(text(&doc, "s"), "{1, 2}");
    assert_eq!(text(&doc, "i"), "[1, 2)");
    assert_eq!(text(&doc, "j"), "(x, 3]");
    assert_eq!(text(&doc, "v"), "⟨1, 2⟩");
    assert_eq!(text(&doc, "a"), "[x, y]");
}

/// A value with entries over references is a template: it follows them.
#[test]
fn entries_follow_their_references() {
    let mut doc = loads(
        r#"<numberInput name="a" value="3"/><mathInput name="mi" prefill="y"/>
           <math name="s">{x, $a}</math>
           <math name="i">[$a, $mi)</math>
           <math name="t">$mi + (1, 2)</math>"#,
    );
    assert_eq!(text(&doc, "s"), "{x, 3}");
    assert_eq!(text(&doc, "i"), "[3, y)");
    set(&mut doc, "a", "value", 5.0);
    type_into(&mut doc, "mi", "(a, b)");
    assert_eq!(text(&doc, "s"), "{x, 5}");
    assert_eq!(text(&doc, "i"), "[5, (a, b))");
    assert_eq!(text(&doc, "t"), "(a, b) + (1, 2)");
    assert_eq!(reference::check(&doc), None);
}

/// The lattice: a vector equals a tuple of the same entries; a list does
/// not equal a tuple; an interval compares by its ends and closedness; a
/// set is unordered and counts each entry once; a tuple is no array.
#[test]
fn values_with_entries_compare_by_the_lattice() {
    let cases = [
        ("{1, 2} = {2, 1, 1}", true),
        ("{1, 2} = {1, 3}", false),
        ("(1, 2) = (1, 2)", true),
        ("(1, 2) = (2, 1)", false),
        ("(1, 2) = [1, 2]", false),
        ("⟨1, 2⟩ = (1, 2)", true),
        ("⟨1, 2⟩ = [1, 2]", false),
        ("(1, 2] = (1, 2]", true),
        ("(1, 2] = [1, 2]", false),
        ("[1, 2) = [1, 2)", true),
        ("[x, 2) = [x, 2)", true),
        ("(x+x, y) = (2x, y)", true),
        ("{x, y} = {y, x}", true),
        ("{1} = 1", true),
        ("(1, 2) + (3, 4) = (4, 6)", true),
    ];
    for (k, (cond, want)) in cases.iter().enumerate() {
        let doc = loads(&format!(r#"<boolean name="b{k}">{cond}</boolean>"#));
        assert_eq!(truth(&doc, &format!("b{k}")), *want, "{cond}");
    }
}

#[test]
fn a_list_is_no_tuple() {
    let doc = loads(
        r#"<math name="l">1, 2</math><math name="t">(1, 2, 3)</math>
           <math name="u">1, 2, 3</math><math name="w">x, 2</math>
           <boolean name="b1">$l = $u</boolean>
           <boolean name="b2">$w = (x, 2)</boolean>
           <boolean name="b3">$w = x, 2</boolean>"#,
    );
    assert!(!truth(&doc, "b1"));
    assert!(!truth(&doc, "b2"));
    assert!(truth(&doc, "b3"));
}

/// An answer compares a response with entries by the lattice: a set in
/// any order, an interval only with its closedness.
#[test]
fn an_answer_compares_by_the_lattice() {
    let mut doc = loads(
        r#"<answer name="s"><mathInput name="ms"/><award><math>{1, x}</math></award></answer>
           <answer name="i"><mathInput name="mi"/><award><math>(0, 1]</math></award></answer>"#,
    );
    let submit = |doc: &mut Document, a: &str| {
        let a = doc.resolve_path(a).unwrap();
        doc.submit(a);
    };
    type_into(&mut doc, "ms", "{x, 1}");
    submit(&mut doc, "s");
    assert_eq!(doc.value("s", "credit"), Some(1.0));
    type_into(&mut doc, "ms", "(x, 1)");
    submit(&mut doc, "s");
    assert_eq!(doc.value("s", "credit"), Some(0.0));
    type_into(&mut doc, "mi", "(0, 1]");
    submit(&mut doc, "i");
    assert_eq!(doc.value("i", "credit"), Some(1.0));
    type_into(&mut doc, "mi", "[0, 1]");
    submit(&mut doc, "i");
    assert_eq!(doc.value("i", "credit"), Some(0.0));
}

/// The expression a component's first cell holds, as the JavaScript math
/// tree.
fn ast(doc: &Document, name: &str) -> String {
    doc.math_ast(doc.comp_cells(doc.resolve_path(name).unwrap())[0])
}

/// `createVectors` and `createIntervals` normalize what the math holds,
/// written or referenced, before the rest of its post (JavaScript's
/// `normalizeMathExpression`).
#[test]
fn create_vectors_and_intervals_normalize_the_value() {
    let src = "(1,2,3),(4,5),[6,7],(8,9],[10,11)";
    let mut doc = loads(&format!(
        r#"<math name="m1">{src}</math>
           <math name="m2" createVectors>{src}</math>
           <math name="m3" createIntervals>{src}</math>
           <math name="m4" createVectors createIntervals>{src}</math>
           <mathInput name="mi" prefill="(a,b)"/>
           <math name="v" createVectors>$mi</math>
           <math name="i" createIntervals>$mi</math>"#
    ));
    assert_eq!(
        ast(&doc, "m1"),
        r#"["list",["tuple",1,2,3],["tuple",4,5],["array",6,7],["interval",["tuple",8,9],["tuple",false,true]],["interval",["tuple",10,11],["tuple",true,false]]]"#
    );
    assert_eq!(
        ast(&doc, "m2"),
        r#"["list",["vector",1,2,3],["vector",4,5],["array",6,7],["interval",["tuple",8,9],["tuple",false,true]],["interval",["tuple",10,11],["tuple",true,false]]]"#
    );
    assert_eq!(
        ast(&doc, "m3"),
        r#"["list",["tuple",1,2,3],["interval",["tuple",4,5],["tuple",false,false]],["interval",["tuple",6,7],["tuple",true,true]],["interval",["tuple",8,9],["tuple",false,true]],["interval",["tuple",10,11],["tuple",true,false]]]"#
    );
    assert_eq!(
        ast(&doc, "m4"),
        r#"["list",["vector",1,2,3],["vector",4,5],["interval",["tuple",6,7],["tuple",true,true]],["interval",["tuple",8,9],["tuple",false,true]],["interval",["tuple",10,11],["tuple",true,false]]]"#
    );
    assert_eq!(ast(&doc, "v"), r#"["vector","a","b"]"#);
    assert_eq!(
        ast(&doc, "i"),
        r#"["interval",["tuple","a","b"],["tuple",false,false]]"#
    );
    type_into(&mut doc, "mi", "[c,d]");
    assert_eq!(ast(&doc, "v"), r#"["array","c","d"]"#);
    assert_eq!(
        ast(&doc, "i"),
        r#"["interval",["tuple","c","d"],["tuple",true,true]]"#
    );
}

/// `<interval>` is a math with `createIntervals` on, its text one
/// expression even when it is `(a, b)`.
#[test]
fn an_interval_is_a_math_of_intervals() {
    let mut doc = loads(
        r#"<interval name="o">(1, 2)</interval>
           <interval name="c">[1, 2]</interval>
           <numberInput name="a" value="0"/>
           <interval name="r">($a, 3]</interval>
           <boolean name="b1">$o = (1, 2)</boolean>
           <boolean name="b2">$c = [1, 2]</boolean>
           <boolean name="b3">$o = $c</boolean>
           <interval name="m" extend="$r"/>"#,
    );
    assert_eq!(
        ast(&doc, "o"),
        r#"["interval",["tuple",1,2],["tuple",false,false]]"#
    );
    assert_eq!(
        ast(&doc, "c"),
        r#"["interval",["tuple",1,2],["tuple",true,true]]"#
    );
    assert_eq!(text(&doc, "r"), "(0, 3]");
    assert!(truth(&doc, "b1"));
    assert!(truth(&doc, "b2"));
    assert!(!truth(&doc, "b3"));
    set(&mut doc, "a", "value", -1.0);
    assert_eq!(text(&doc, "r"), "(-1, 3]");
    assert_eq!(text(&doc, "m"), "(-1, 3]");
    assert_eq!(reference::check(&doc), None);
}

/// `<intervalList>` (ADR 0041, step 2): a math list whose pairs are
/// intervals, written in text, by reference or as children.
#[test]
fn an_interval_list_holds_intervals() {
    let doc = loads(
        r#"<interval name="i">[0, 1)</interval>
           <p name="p"><intervalList name="l">(1, 2) [3, 4] $i <interval>(5, 6]</interval></intervalList></p>"#,
    );
    assert_eq!(text(&doc, "p"), "(1, 2), [3, 4], [0, 1), (5, 6]");
    assert_eq!(doc.value("l", "numComponents"), Some(4.0));
    let entry = |k: usize| doc.math_ast(doc.comp_cells(doc.resolve_path("l").unwrap())[k]);
    assert_eq!(
        entry(1),
        r#"["interval",["tuple",1,2],["tuple",false,false]]"#
    );
    assert_eq!(
        entry(2),
        r#"["interval",["tuple",3,4],["tuple",true,true]]"#
    );
}

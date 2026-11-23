//! `<subsetOfReals>`: a subset of the reals read from intervals, points,
//! set operations and inequalities, and written back merged, as the
//! JavaScript core's `subsetofreals.test.ts` pins it.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::load;
use common::type_into;

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

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

/// The expression a component's first cell holds, as the JavaScript math
/// tree.
fn ast(doc: &Document, name: &str) -> String {
    doc.math_ast(doc.comp_cells(doc.resolve_path(name).unwrap())[0])
}

const BLANK: &str = "\"\u{ff3f}\"";

#[test]
fn single_intervals() {
    let doc = loads(
        r#"<subsetOfReals name="o1">(4,5)</subsetOfReals>
           <subsetOfReals name="o2">(5,4)</subsetOfReals>
           <subsetOfReals name="o3">(5,5)</subsetOfReals>
           <subsetOfReals name="c3">[5,5]</subsetOfReals>
           <subsetOfReals name="c4">[4,infinity]</subsetOfReals>
           <subsetOfReals name="c8">[-infinity,infinity]</subsetOfReals>
           <subsetOfReals name="oc9">(a,b]</subsetOfReals>"#,
    );
    assert_eq!(
        ast(&doc, "o1"),
        r#"["interval",["tuple",4,5],["tuple",false,false]]"#
    );
    assert_eq!(ast(&doc, "o2"), r#""emptyset""#);
    assert_eq!(ast(&doc, "o3"), r#""emptyset""#);
    assert_eq!(ast(&doc, "c3"), r#"["set",5]"#);
    assert_eq!(
        ast(&doc, "c4"),
        r#"["interval",["tuple",4,{"$":"Inf"}],["tuple",true,false]]"#
    );
    assert_eq!(ast(&doc, "c8"), r#""R""#);
    assert_eq!(ast(&doc, "oc9"), BLANK);
}

#[test]
fn inequalities_equations_and_memberships() {
    let doc = loads(
        r#"<subsetOfReals name="o1">4 < x < 5</subsetOfReals>
           <subsetOfReals name="c4a">infinity >= q >= 4</subsetOfReals>
           <subsetOfReals name="q4a" variable="q">infinity >= q >= 4</subsetOfReals>
           <subsetOfReals name="e1">x=5</subsetOfReals>
           <subsetOfReals name="e2">x=infinity</subsetOfReals>
           <subsetOfReals name="e4">x=a</subsetOfReals>
           <subsetOfReals name="ne">x != 6</subsetOfReals>
           <subsetOfReals name="sb">{q | q > 2}</subsetOfReals>
           <subsetOfReals name="in">x elementof (4,5) union (5,6]</subsetOfReals>"#,
    );
    assert_eq!(text(&doc, "o1"), "(4, 5)");
    assert_eq!(ast(&doc, "c4a"), BLANK);
    assert_eq!(text(&doc, "q4a"), "[4, ∞)");
    assert_eq!(ast(&doc, "e1"), r#"["set",5]"#);
    assert_eq!(ast(&doc, "e2"), r#""emptyset""#);
    assert_eq!(ast(&doc, "e4"), BLANK);
    assert_eq!(text(&doc, "ne"), "(-∞, 6) ∪ (6, ∞)");
    assert_eq!(text(&doc, "sb"), "(2, ∞)");
    assert_eq!(text(&doc, "in"), "(4, 5) ∪ (5, 6]");
}

#[test]
fn unions_intersections_and_complements_merge() {
    let cases = [
        ("(4,5] union [5,6]", "(4, 6]"),
        ("(4,6) union {4}", "[4, 6)"),
        ("(4,6) union {7}", "(4, 6) ∪ {7}"),
        ("(4,5) union (5,6) union {5}", "(4, 6)"),
        ("(-infinity,5) union (9,infinity) union (4,10)", "R"),
        ("(4,5] intersect [5,6]", "{5}"),
        ("(4,8) intersect (5,7)", "(5, 7)"),
        ("(-infinity,5] intersect [2,infinity)", "[2, 5]"),
        ("[-4,-2) intersect {-4}", "{-4}"),
        ("(4 < x <= 5) or (5 <= x <= 6)", "(4, 6]"),
        ("(x != 5) and (4 < x < 10)", "(4, 5) ∪ (5, 10)"),
        ("(4,5]^c", "(-∞, 4] ∪ (5, ∞)"),
        ("((4,5) union (5,6))^c", "(-∞, 4] ∪ {5} ∪ [6, ∞)"),
        ("(4,6)^c or (5,7)^c", "(-∞, 5] ∪ [6, ∞)"),
    ];
    for (k, (src, want)) in cases.iter().enumerate() {
        let doc = loads(&format!(
            r#"<subsetOfReals name="s{k}">{src}</subsetOfReals>"#
        ));
        assert_eq!(text(&doc, &format!("s{k}")), *want, "{src}");
    }
}

#[test]
fn displayed_as_inequalities_in_its_variable() {
    let doc = loads(
        r#"<subsetOfReals displayMode="inequalities" name="o1">(4,5)</subsetOfReals>
           <subsetOfReals displayMode="inequalities" variable="v" name="co4">[4,infinity)</subsetOfReals>
           <subsetOfReals displayMode="inequalities" variable="v" name="oc6">(-infinity,5]</subsetOfReals>
           <subsetOfReals displayMode="inequalities" name="c3">[5,5]</subsetOfReals>
           <subsetOfReals displayMode="inequalities" name="e">(5,4)</subsetOfReals>
           <subsetOfReals displayMode="inequalities" name="r">(-infinity,infinity)</subsetOfReals>
           <subsetOfReals displayMode="inequalities" name="u">(1,3) union (6,infinity)</subsetOfReals>"#,
    );
    assert_eq!(text(&doc, "o1"), "4 < x < 5");
    assert_eq!(text(&doc, "co4"), "v ≥ 4");
    assert_eq!(text(&doc, "oc6"), "v ≤ 5");
    assert_eq!(text(&doc, "c3"), "x = 5");
    assert_eq!(ast(&doc, "e"), r#"["in","x","emptyset"]"#);
    assert_eq!(ast(&doc, "r"), r#"["in","x","R"]"#);
    assert_eq!(text(&doc, "u"), "(1 < x < 3) or (x > 6)");
}

/// The JavaScript core's "dynamic subsets", with a literal display mode:
/// the subset and its variable follow inputs.
#[test]
fn a_subset_follows_its_math_and_its_variable() {
    let mut doc = loads(
        r#"<mathInput name="variable" prefill="x" />
           <mathInput name="input" prefill="x > 1" />
           <subsetOfReals name="result" variable="$variable">$input</subsetOfReals>
           <subsetOfReals name="ineq" variable="$variable" displayMode="inequalities">$input</subsetOfReals>"#,
    );
    assert_eq!(text(&doc, "result"), "(1, ∞)");
    assert_eq!(text(&doc, "ineq"), "x > 1");
    type_into(&mut doc, "variable", "y");
    assert_eq!(text(&doc, "result"), "\u{ff3f}");
    type_into(&mut doc, "input", "y>1");
    assert_eq!(text(&doc, "result"), "(1, ∞)");
    assert_eq!(text(&doc, "ineq"), "y > 1");
    type_into(&mut doc, "input", "y != 1");
    assert_eq!(text(&doc, "result"), "(-∞, 1) ∪ (1, ∞)");
    type_into(&mut doc, "input", "(y>1) and (y<3) or (y>6)");
    assert_eq!(text(&doc, "result"), "(1, 3) ∪ (6, ∞)");
    assert_eq!(text(&doc, "ineq"), "(1 < y < 3) or (y > 6)");
    assert_eq!(reference::check(&doc), None);
}

/// The JavaScript core's "modifying copies of subsets": a write to any
/// copy writes the subset, merged, to the math input every copy reads.
#[test]
fn a_write_to_any_copy_reaches_the_input() {
    let mut doc = loads(
        r#"<mathInput name="input0" prefill="(0,1)" />
           <subsetOfReals name="s1">$input0</subsetOfReals>
           <subsetOfReals extend="$s1" name="s2" />
           <subsetOfReals extend="$s1.value" name="s3"/>
           <subsetOfReals extend="$s3" name="s6" />
           <subsetOfReals name="s8">$s1</subsetOfReals>
           <mathInput name="input1" bindValueTo="$s1" />
           <mathInput name="input2" bindValueTo="$s2" />
           <mathInput name="input3" bindValueTo="$s3" />
           <mathInput name="input6" bindValueTo="$s6" />
           <mathInput name="input8" bindValueTo="$s8" />"#,
    );
    let all = ["s1", "s2", "s3", "s6", "s8", "input1", "input3", "input8"];
    let check = |doc: &Document, want: &str| {
        for name in all {
            assert_eq!(text(doc, name), want, "{name}");
        }
    };
    check(&doc, "(0, 1)");
    type_into(&mut doc, "input0", "x >= 3");
    check(&doc, "[3, ∞)");
    assert_eq!(text(&doc, "input0"), "x ≥ 3");
    type_into(&mut doc, "input1", "{q | q = 5}");
    check(&doc, "{5}");
    assert_eq!(text(&doc, "input0"), "{5}");
    type_into(&mut doc, "input2", "(-infinity, infinity)");
    check(&doc, "R");
    type_into(&mut doc, "input3", "x notelementof [9, infinity)");
    check(&doc, "(-∞, 9)");
    type_into(&mut doc, "input6", "{1}^c intersect {v | v >= 1}");
    check(&doc, "(1, ∞)");
    type_into(&mut doc, "input8", "x != -6");
    check(&doc, "(-∞, -6) ∪ (-6, ∞)");
    assert_eq!(text(&doc, "input0"), "(-∞, -6) ∪ (-6, ∞)");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_union_with_numbers_closes_the_ends() {
    let doc = loads(
        r#"<number name="x1">-9</number><number name="x2">-6</number>
           <number name="x3">-1</number><number name="x4">8</number>
           <subsetOfReals name="S">($x1,$x2) union ($x3,$x4)</subsetOfReals>
           <subsetOfReals name="Sclosed">$S union $x1 union $x2 union $x3 union $x4</subsetOfReals>"#,
    );
    assert_eq!(text(&doc, "S"), "(-9, -6) ∪ (-1, 8)");
    assert_eq!(text(&doc, "Sclosed"), "[-9, -6] ∪ [-1, 8]");
}

#[test]
fn points_and_intervals() {
    let doc = loads(
        r#"<subsetOfReals name="empty">emptyset</subsetOfReals>
           <subsetOfReals name="interval">[-1,2)</subsetOfReals>
           <subsetOfReals name="is">(-1,2] union {-5}</subsetOfReals>
           <subsetOfReals name="miss">(-infinity,3) union (3,infinity)</subsetOfReals>
           <subsetOfReals name="R">R</subsetOfReals>
           <p name="p1">$empty.points|$empty.intervals|$empty.isolatedPoints</p>
           <p name="p2">$interval.points|$interval.pointsClosed|$interval.intervals</p>
           <p name="p3">$is.points|$is.pointsClosed|$is.intervals|$is.isolatedPoints</p>
           <p name="p4">$miss.points|$miss.pointsClosed|$miss.intervals</p>
           <p name="p5">$R.points|$R.intervals</p>"#,
    );
    assert_eq!(text(&doc, "p1"), "||");
    assert_eq!(text(&doc, "p2"), "-1, 2|true, false|[-1, 2)");
    assert_eq!(text(&doc, "p3"), "-5, -1, 2|true, false, true|(-1, 2]|-5");
    assert_eq!(text(&doc, "p4"), "3|false|(-∞, 3), (3, ∞)");
    assert_eq!(text(&doc, "p5"), "|(-∞, ∞)");
}

//! Whether an edit is safe for every student (ADR 0017, steps 3 and 4):
//! `compare_versions` over the two sources, each row of step 4's table and
//! the edits the ADR says may change freely.

use cells_core::dast::Dast;
use cells_core::testing::test_utils::dast_json;
use cells_core::{EditReport, compare_versions};

fn dast(src: &str) -> Dast {
    Dast::from_json(&dast_json(src)).unwrap()
}

fn report(old: &str, new: &str) -> EditReport {
    compare_versions(&dast(old), &dast(new), &[]).unwrap()
}

/// The conditions that fail, by input key.
fn fails(old: &str, new: &str) -> Vec<(String, u8)> {
    report(old, new)
        .failures
        .into_iter()
        .map(|f| (f.key, f.condition))
        .collect()
}

fn safe(old: &str, new: &str) {
    let r = report(old, new);
    assert!(
        r.safe(),
        "expected safe:\n{old}\n->\n{new}\n{:#?}",
        r.failures
    );
}

fn fails_with(old: &str, new: &str, key: &str, condition: u8) {
    let f = fails(old, new);
    assert!(
        f.iter().any(|(k, c)| k == key && *c == condition),
        "expected {key} to fail condition {condition}:\n{old}\n->\n{new}\n{f:?}"
    );
}

const GRAPH: &str = r#"<graph name="g" xmin="-10" xmax="10"><point name="p" x="1" y="2"/></graph>"#;

#[test]
fn an_unchanged_document_is_safe() {
    safe(GRAPH, GRAPH);
}

// What may change freely: text, layout, hints, feedback, formulas that
// feed only what is displayed or credited, correct answers, awards, and
// the starting value of an input only it writes.
#[test]
fn text_layout_and_displayed_formulas_are_safe() {
    let old = r#"<p>Drag the point.</p><numberInput name="n"/><number name="twice">2 $n</number>
<graph name="g"><point name="p" x="1" y="2"/></graph>"#;
    let new = r#"<section><title>New</title><p>Drag the point <em>now</em>.</p><numberInput name="n"/><number name="twice">3 $n</number>
<p>Hint</p><graph name="g"><point name="p" x="1" y="2"/></graph></section>"#;
    safe(old, new);
}

#[test]
fn a_points_starting_position_is_safe() {
    safe(GRAPH, &GRAPH.replace(r#"x="1""#, r#"x="4""#));
}

#[test]
fn a_correct_answer_is_safe() {
    let old = r#"<answer name="a"><mathInput name="mi"/><award><math>x+1</math></award></answer>"#;
    safe(old, &old.replace("x+1", "x+2"));
}

#[test]
fn a_new_input_of_its_own_is_safe() {
    safe(
        GRAPH,
        &format!(r#"{GRAPH}<numberInput name="m"/><graph><point name="q"/></graph>"#),
    );
}

#[test]
fn widening_the_bounds_is_safe() {
    safe(GRAPH, &GRAPH.replace(r#"xmax="10""#, r#"xmax="20""#));
}

// Step 4's table: each failure found in drafting, and the condition that
// catches it.

#[test]
fn raising_xmin_fails_condition_1() {
    fails_with(
        GRAPH,
        &GRAPH.replace(r#"xmin="-10""#, r#"xmin="0""#),
        "g.p",
        1,
    );
}

#[test]
fn reordering_a_choice_input_fails_condition_1() {
    let old = r#"<choiceInput name="c"><choice>a</choice><choice>b</choice></choiceInput>"#;
    let new = r#"<choiceInput name="c"><choice>b</choice><choice>a</choice></choiceInput>"#;
    fails_with(old, new, "c", 1);
    // Appending is safe.
    safe(
        old,
        r#"<choiceInput name="c"><choice>a</choice><choice>b</choice><choice>c</choice></choiceInput>"#,
    );
}

#[test]
fn a_type_change_fails_condition_1() {
    fails_with(
        r#"<numberInput name="b"/>"#,
        r#"<textInput name="b"/>"#,
        "b",
        1,
    );
}

#[test]
fn removing_an_input_fails_condition_1() {
    fails_with(
        r#"<numberInput name="a"/><numberInput name="b"/>"#,
        r#"<numberInput name="b"/>"#,
        "a",
        1,
    );
}

#[test]
fn a_copy_given_an_override_fails_condition_2() {
    let old = r#"<graph><point name="p" x="1" y="2"/><point name="c" extend="$p"/></graph>"#;
    let new = r#"<graph><point name="p" x="1" y="2"/><point name="c" extend="$p" x="3"/></graph>"#;
    fails_with(old, new, "c", 2);
}

#[test]
fn an_operator_changed_between_an_input_and_a_point_fails_condition_3() {
    let old = r#"<numberInput name="n" value="1"/><graph><point name="q" x="2 $n" y="0"/></graph>"#;
    fails_with(old, &old.replace("2 $n", "3 $n"), "q", 3);
}

#[test]
fn a_default_changed_between_an_input_and_a_point_fails_condition_3() {
    let old = r#"<numberInput name="n" value="1"/><number name="k">2</number>
<graph><point name="q" x="$k $n" y="0"/></graph>"#;
    fails_with(old, &old.replace(">2<", ">3<"), "q", 3);
}

#[test]
fn a_repeat_count_changed_fails_condition_3() {
    let old = r#"<numberInput name="n" value="4"/><number name="half">$n/2</number>
<repeatForSequence name="r" length="$n"><numberInput name="x"/></repeatForSequence>"#;
    fails_with(
        old,
        &old.replace(r#"length="$n""#, r#"length="$half""#),
        "r[*].x",
        3,
    );
}

#[test]
fn a_fixed_or_hide_or_condition_added_around_an_input_fails_condition_3() {
    let old = r#"<booleanInput name="b"/><numberInput name="m"/>"#;
    fails_with(
        old,
        r#"<booleanInput name="b"/><numberInput name="m" fixed="$b"/>"#,
        "m",
        3,
    );
    let point = r#"<booleanInput name="b"/><graph name="g"><point name="p"/></graph>"#;
    fails_with(
        point,
        &point.replace("<point", r#"<point hide="$b""#),
        "g.p",
        3,
    );
    fails_with(
        old,
        r#"<booleanInput name="b"/><conditionalContent><case condition="$b"><numberInput name="m"/></case><else><numberInput name="m"/></else></conditionalContent>"#,
        "m",
        1,
    );
}

#[test]
fn a_new_point_reading_an_old_input_fails_condition_4() {
    let old = r#"<numberInput name="n"/><graph name="g"/>"#;
    let new = r#"<numberInput name="n"/><graph name="g"><point name="p" x="$n" y="0"/></graph>"#;
    fails_with(old, new, "g.p", 4);
}

// A select's options must be identical; content inside them may change.
#[test]
fn a_selects_options_must_be_identical() {
    let old = r#"<select name="s"><option><p>A</p></option><option><p>B</p></option></select>"#;
    safe(old, &old.replace("<p>A</p>", "<p>AA</p>"));
    fails_with(
        old,
        &old.replace("</select>", "<option><p>C</p></option></select>"),
        "s",
        1,
    );
}

// Renaming an input is a removal and an addition, unless the editor
// records the rename.
#[test]
fn a_recorded_rename_is_safe() {
    let old = r#"<section name="s"><numberInput name="a"/></section>"#;
    let new = r#"<section name="t"><numberInput name="a"/></section>"#;
    fails_with(old, new, "s.a", 1);
    let r = compare_versions(&dast(old), &dast(new), &[("s".into(), "t".into())]).unwrap();
    assert!(r.safe(), "{:#?}", r.failures);
}

// An unrelated insertion moves no hash: the signature names nothing by
// position in the tree.
#[test]
fn an_unrelated_insertion_moves_no_hash() {
    let old = r#"<numberInput name="n" value="1"/><number name="k">2</number>
<graph name="g" xmin="$k"><point name="q" x="$k $n" y="0"/></graph><mathInput name="mi" prefill="x"/>"#;
    let new = format!(
        "<p>One</p><number name=\"z\">5</number><graph><point/></graph>{}",
        old.replace("<graph name", "<text>between</text><graph name")
    );
    safe(old, &new);
}

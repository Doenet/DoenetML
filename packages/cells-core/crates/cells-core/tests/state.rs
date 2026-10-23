//! Saved state (`document/state.rs`): what a session changed comes back
//! after a reload, including text, expressions and iterations that exist
//! only because a count changed.

mod common;

use cells_core::testing::test_utils::{load, load_with_seed, repo_root};
use cells_core::testing::unsaved_essentials;
use cells_core::{Document, Error, RELEASE, Request};
use common::{set, type_into, v};

fn type_text(doc: &mut Document, name: &str, s: &str) {
    let id = doc.intern(s);
    let cell = doc.cell(name, "value").unwrap();
    doc.request(&[Request { cell, value: id }]);
}

const DOC: &str = r#"<mathInput name="mi" prefill="x"/><textInput name="ti" prefill="hi"/>
<mathInput name="k" prefill="2"/><number name="twice">2 $k</number>
<graph><point name="p" x="1" y="2"/></graph>"#;

#[test]
fn an_untouched_document_saves_nothing() {
    let doc = load(DOC).unwrap();
    let saved: serde_json::Value = serde_json::from_str(&doc.save_state()).unwrap();
    assert_eq!(
        saved,
        serde_json::json!({ "v": 3, "core": RELEASE, "doc": null, "state": [] })
    );
}

// State stays with the release that made it (ADR 0017, step 6): another
// release's is refused before any entry is read, as is another format's.
#[test]
fn state_from_another_release_or_format_is_refused() {
    let mut doc = load(DOC).unwrap();
    set(&mut doc, "p", "x", 3.5);
    let saved = doc.save_state();
    let other = saved.replace(RELEASE, "0.0.0+elsewhere");
    let mut fresh = load(DOC).unwrap();
    assert!(matches!(
        fresh.restore_state(&other),
        Err(Error::OtherRelease { .. })
    ));
    assert_eq!(v(&fresh, "p", "x"), 1.0);
    let v2 = r#"{"v":2,"state":[[[],[9,0],0,"n",3.5]]}"#;
    assert!(fresh.restore_state(v2).is_err());
    assert_eq!(v(&fresh, "p", "x"), 1.0);
}

#[test]
fn changed_values_come_back_after_a_reload() {
    let mut doc = load(DOC).unwrap();
    type_into(&mut doc, "mi", "x^2+1");
    type_text(&mut doc, "ti", "hello there");
    set(&mut doc, "k", "value", 5.0);
    set(&mut doc, "p", "x", 3.5);
    let saved = doc.save_state();
    assert!(
        saved.contains(r#""m","#) && saved.contains("hello there"),
        "{saved}"
    );

    let mut fresh = load(DOC).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(
        fresh.math_text(fresh.cell("mi", "expr").unwrap()),
        doc.math_text(doc.cell("mi", "expr").unwrap())
    );
    assert_eq!(
        fresh.text_value(fresh.cell("ti", "value").unwrap()),
        "hello there"
    );
    assert_eq!(v(&fresh, "twice", "value"), 10.0);
    assert_eq!(v(&fresh, "p", "x"), 3.5);
    // A value put back to its default stays in the saved state: the
    // student put it there (ADR 0017, step 2).
    set(&mut fresh, "p", "x", 1.0);
    assert!(fresh.save_state().contains(r#""p","x","n",1.0"#));
}

#[test]
fn an_emptied_input_saves_as_null() {
    let mut doc = load(DOC).unwrap();
    set(&mut doc, "k", "value", f64::NAN);
    let saved = doc.save_state();
    assert!(saved.contains("null"), "{saved}");
    let mut fresh = load(DOC).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert!(v(&fresh, "k", "value").is_nan());
}

const REPEAT: &str = r#"<mathInput name="n" prefill="2"/>
<graph><repeatForSequence name="r" from="1" length="$n"><point name="q" x="0" y="0"/></repeatForSequence></graph>"#;

#[test]
fn iterations_that_exist_only_after_a_count_change_come_back() {
    let mut doc = load(REPEAT).unwrap();
    set(&mut doc, "n", "value", 4.0);
    set(&mut doc, "r[4].q", "x", 5.0);
    let saved = doc.save_state();

    let mut fresh = load(REPEAT).unwrap();
    assert!(fresh.cell("r[4].q", "x").is_none());
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "n", "value"), 4.0);
    assert_eq!(v(&fresh, "r[4].q", "x"), 5.0);
    assert_eq!(v(&fresh, "r[1].q", "x"), 0.0);
}

// A cell's type is its definer's: text a `<text>` defines and a
// `<textInput>` binds to is saved as text, not as its string id.
#[test]
fn text_bound_to_a_text_input_is_saved_as_text() {
    let src = r#"<text name="t1">hello</text><textInput name="ti" bindValueTo="$t1"/>"#;
    let mut doc = load(src).unwrap();
    type_text(&mut doc, "ti", "bye there");
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(
        fresh.text_value(fresh.cell("ti", "value").unwrap()),
        "bye there"
    );
}

// A text answer's submitted response is text too, so it restores whatever
// order strings were interned in.
#[test]
fn a_submitted_text_response_is_saved_as_text() {
    let src = r#"<answer name="a" type="text"><textInput name="ti"/><award>yes</award></answer>"#;
    let mut doc = load(src).unwrap();
    type_text(&mut doc, "ti", "first");
    type_text(&mut doc, "ti", "nope");
    doc.submit(doc.component("a").unwrap());
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(
        fresh.text_value(fresh.cell("a", "submitted").unwrap()),
        "nope"
    );
}

// Saved state names an iteration by its path, not by the id a session gave
// its scope, so repeats grown in another order restore to their own
// iterations.
#[test]
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

// The same for nested repeats, whose inner iterations are made in the
// order the session grew them.
#[test]
fn nested_iterations_restore_by_path() {
    let src = r#"<numberInput name="na" value="1"/>
<repeatForSequence name="ra" length="$na">
  <numberInput name="nb" value="1"/>
  <repeatForSequence name="rb" length="$nb"><numberInput name="x" value="0"/></repeatForSequence>
</repeatForSequence>
<number name="x12">$ra[1].rb[2].x</number><number name="x22">$ra[2].rb[2].x</number>"#;
    let mut doc = load(src).unwrap();
    set(&mut doc, "na", "value", 2.0);
    let nb2 = doc.cell("ra[2].nb", "value").unwrap();
    doc.request(&[Request {
        cell: nb2,
        value: 2.0,
    }]);
    set(&mut doc, "x22", "value", 22.0);
    let nb1 = doc.cell("ra[1].nb", "value").unwrap();
    doc.request(&[Request {
        cell: nb1,
        value: 2.0,
    }]);
    set(&mut doc, "x12", "value", 12.0);
    let saved = doc.save_state();
    let mut fresh = load(src).unwrap();
    fresh.restore_state(&saved).unwrap();
    assert_eq!(v(&fresh, "x12", "value"), 12.0);
    assert_eq!(v(&fresh, "x22", "value"), 22.0);
}

// ADR 0017, step 1: an entry names its cell by keys an ordinary edit does
// not move. The rows of the ADR's Context table, against
// `<numberInput name="a"/><numberInput name="b"/>` with `b` set to 7.

const AB: &str = r#"<numberInput name="a"/><numberInput name="b"/>"#;

/// `before`'s state after `act`, restored into `after`.
fn carried(before: &str, act: impl Fn(&mut Document), after: &str) -> Document {
    let mut doc = load(before).unwrap();
    act(&mut doc);
    let saved = doc.save_state();
    let mut edited = load(after).unwrap();
    edited.restore_state(&saved).unwrap();
    edited
}

fn b_is_7(doc: &mut Document) {
    set(doc, "b", "value", 7.0);
}

#[test]
fn an_entry_names_its_element_and_prop_by_name() {
    let mut doc = load(AB).unwrap();
    b_is_7(&mut doc);
    let saved: serde_json::Value = serde_json::from_str(&doc.save_state()).unwrap();
    assert_eq!(
        saved["state"],
        serde_json::json!([[[], "b", "value", "n", 7.0]])
    );
}

#[test]
fn a_paragraph_inserted_first_moves_nothing() {
    let doc = carried(AB, b_is_7, &format!("<p>Intro</p>{AB}"));
    assert!(v(&doc, "a", "value").is_nan());
    assert_eq!(v(&doc, "b", "value"), 7.0);
}

#[test]
fn deleting_an_input_and_adding_another_moves_nothing() {
    let after = r#"<numberInput name="b"/><numberInput name="c"/>"#;
    let doc = carried(AB, b_is_7, after);
    assert_eq!(v(&doc, "b", "value"), 7.0);
    assert!(v(&doc, "c", "value").is_nan());
}

#[test]
fn a_value_is_never_restored_into_a_cell_of_another_type() {
    let after = r#"<numberInput name="a"/><textInput name="b"/>"#;
    let doc = carried(AB, b_is_7, after);
    assert_eq!(doc.text_value(doc.cell("b", "value").unwrap()), "");
}

// The same for a value parked for an iteration that is not built yet: the
// build that stamps it checks its type.
#[test]
fn a_parked_value_is_never_restored_into_a_cell_of_another_type() {
    let before = r#"<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><numberInput name="q"/></repeatForSequence>"#;
    let after = before.replace(r#"<numberInput name="q"/>"#, r#"<textInput name="q"/>"#);
    let doc = carried(
        before,
        |doc| {
            set(doc, "n", "value", 2.0);
            set(doc, "r[2].q", "value", 5.0);
        },
        &after,
    );
    assert_eq!(v(&doc, "n", "value"), 2.0);
    assert_eq!(doc.text_value(doc.cell("r[2].q", "value").unwrap()), "");
}

// A select's draw depends on its key, not its position in the tree, so a
// paragraph above it leaves every seed's draw, and the state in it, as it
// was.
#[test]
fn a_paragraph_above_a_select_keeps_its_draw() {
    let src = r#"<select name="s"><option><numberInput name="w" value="1"/></option><option><numberInput name="w" value="2"/></option><option><numberInput name="w" value="3"/></option></select>
<number name="sw">$s.w</number>"#;
    let edited = format!("<p>Intro</p>{src}");
    let mut draws = std::collections::HashSet::new();
    for seed in 0..20 {
        let mut doc = load_with_seed(src, seed).unwrap();
        let drawn = v(&doc, "sw", "value");
        draws.insert(drawn as i64);
        set(&mut doc, "sw", "value", 10.0 * drawn);
        let saved = doc.save_state();
        let mut after = load_with_seed(&edited, seed).unwrap();
        assert_eq!(v(&after, "sw", "value"), drawn, "seed {seed}");
        after.restore_state(&saved).unwrap();
        assert_eq!(v(&after, "sw", "value"), 10.0 * drawn, "seed {seed}");
    }
    assert!(draws.len() > 1, "every seed drew {draws:?}");
}

// A branch is named by its case's name, so a case added before it does not
// move the state in it.
#[test]
fn a_case_added_before_a_named_case_moves_nothing() {
    let before = r#"<numberInput name="n" value="5"/>
<conditionalContent name="cc">
  <case name="positive" condition="$n > 0"><numberInput name="w" value="1"/></case>
  <else><numberInput name="w" value="2"/></else>
</conditionalContent>
<number name="sw">$cc.w</number>"#;
    let after = before.replace(
        "<case name=\"positive\"",
        "<case condition=\"$n > 100\"><numberInput name=\"w\" value=\"0\"/></case>\n  <case name=\"positive\"",
    );
    let doc = carried(before, |doc| drop(set(doc, "sw", "value", 4.0)), &after);
    assert_eq!(v(&doc, "cc", "choice"), 2.0);
    assert_eq!(v(&doc, "sw", "value"), 4.0);
}

// Every essential cell of the golden set has a name to be saved by: a
// hidden slot without one would lose what a student did there.
#[test]
fn every_essential_cell_of_the_golden_set_is_saved_by_name() {
    let golden = repo_root().join("crates/cells-bench/golden");
    let mut checked = 0;
    for entry in std::fs::read_dir(golden).unwrap().flatten() {
        let src = std::fs::read_to_string(entry.path()).unwrap();
        let doc = load(&src).unwrap();
        assert_eq!(
            unsaved_essentials(&doc),
            Vec::<String>::new(),
            "{}",
            entry.path().display()
        );
        checked += 1;
    }
    assert!(checked >= 10, "the golden set is missing");
}

// ADR 0017, step 2: saved state holds every value a student touched,
// whether or not it equals the default, and nothing else.

const POINT: &str = r#"<graph><point name="p" x="1" y="2"/><point name="q" x="1" y="2"/></graph>"#;

#[test]
fn a_point_put_back_at_its_start_stays_there_when_the_author_moves_the_start() {
    let after = POINT.replace(r#"x="1""#, r#"x="3""#);
    let doc = carried(
        POINT,
        |doc| {
            set(doc, "p", "x", 5.0);
            set(doc, "p", "x", 1.0);
        },
        &after,
    );
    // The student put `p` at 1; nobody touched `q`, which moves.
    assert_eq!(v(&doc, "p", "x"), 1.0);
    assert_eq!(v(&doc, "q", "x"), 3.0);
}

#[test]
fn a_restored_value_stays_touched_through_the_next_save() {
    let mut doc = load(POINT).unwrap();
    set(&mut doc, "p", "x", 1.0);
    let saved = doc.save_state();
    let mut again = load(POINT).unwrap();
    again.restore_state(&saved).unwrap();
    assert_eq!(again.save_state(), saved);
}

#[test]
fn only_what_a_request_writes_is_touched() {
    // A request a fixed point drops writes nothing.
    let src = r#"<graph><point name="p" x="1" y="2" fixed/></graph>"#;
    let mut fixed = load(src).unwrap();
    set(&mut fixed, "p", "x", 4.0);
    assert!(
        !fixed.save_state().contains(r#""p""#),
        "{}",
        fixed.save_state()
    );
    // A request on `p` touches `p.y`, not `p.x` or `q`.
    let mut doc = load(POINT).unwrap();
    set(&mut doc, "p", "y", 2.0);
    let saved = doc.save_state();
    assert!(saved.contains(r#""p","y""#), "{saved}");
    assert!(
        !saved.contains(r#""p","x""#) && !saved.contains(r#""q""#),
        "{saved}"
    );
}

// A graph's own bounds are view state: restored while the author keeps
// their default, dropped when the author changes it.
#[test]
fn a_pan_is_kept_until_the_author_changes_the_bounds() {
    let before = r#"<graph name="g" xmin="-10"><point name="p" x="1" y="2"/></graph>"#;
    let pan = |doc: &mut Document| {
        set(doc, "g", "xmin", -4.0);
        set(doc, "p", "x", 5.0);
    };
    let same = carried(
        before,
        pan,
        &before.replace("<point", "<point name=\"r\"/><point"),
    );
    assert_eq!(v(&same, "g", "xmin"), -4.0);
    let changed = carried(
        before,
        pan,
        &before.replace(r#"xmin="-10""#, r#"xmin="-20""#),
    );
    assert_eq!(v(&changed, "g", "xmin"), -20.0);
    // The student's work is kept either way.
    assert_eq!(v(&changed, "p", "x"), 5.0);
}

// With `xmin="$n"` a pan inverts onto `n`, an input: the student's work,
// never dropped as view state.
#[test]
fn bounds_given_by_an_input_are_the_students_work() {
    let before = r#"<numberInput name="n" value="-10"/><graph name="g" xmin="$n"/>"#;
    let after = r#"<numberInput name="n" value="-20"/><graph name="g" xmin="$n"/>"#;
    let doc = carried(before, |doc| drop(set(doc, "g", "xmin", -4.0)), after);
    assert_eq!(v(&doc, "n", "value"), -4.0);
    assert_eq!(v(&doc, "g", "xmin"), -4.0);
}

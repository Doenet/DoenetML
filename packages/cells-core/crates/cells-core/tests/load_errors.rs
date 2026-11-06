//! Every error is a function of the document source: a load reports every
//! error the document has, and no count a student reaches, no pick a select
//! draws in a new iteration and no restored state finds another. These are
//! the constructs that once broke it.

mod common;
use common::{set, v};

use cells_core::testing::test_utils::{dast_json, load, load_with_seed};
use cells_core::{DiagnosticKind, Document, LoadOptions};

fn errors(doc: &Document) -> Vec<String> {
    doc.diagnostics()
        .iter()
        .filter(|d| d.kind == DiagnosticKind::Error)
        .map(|d| d.message.clone())
        .collect()
}

/// A repeat of a select whose second option holds two components, so
/// `$r[2].s[1]` names one component or two depending on the pick.
const WHOLE_PICK: &str = r#"<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n">
  <select name="s">
    <option><number name="a">1</number></option>
    <option><number name="a">2</number><number name="b">3</number></option>
  </select>
</repeatForSequence>
<number name="y">$r[2].s[1]</number>
<numberInput name="m" value="5"/>"#;

// A whole pick of a select in a repeat may be any option, so every option
// must hold one component of one type. The load reports it at every seed,
// though iteration 2 does not exist yet, and growing the repeat adds
// nothing.
#[test]
fn a_whole_pick_that_depends_on_the_option_is_reported_at_load() {
    for seed in 0..12 {
        let mut doc = load_with_seed(WHOLE_PICK, seed).unwrap();
        let at_load = errors(&doc);
        assert_eq!(at_load.len(), 1, "seed {seed}: {at_load:?}");
        assert!(at_load[0].contains("names a whole pick"), "{at_load:?}");
        set(&mut doc, "m", "value", 7.0);
        let t = set(&mut doc, "n", "value", 2.0);
        assert!(t.rebuilt && t.rebuild_error.is_none(), "seed {seed}");
        assert_eq!(errors(&doc), at_load, "seed {seed}");
        assert_eq!(v(&doc, "m", "value"), 7.0, "seed {seed}");
    }
}

// Whether a select can draw its picks is checked when it compiles, not when
// it draws: a select in a repeat that loads with no iterations is reported
// at load, and by `diagnose`.
#[test]
fn a_select_that_cannot_draw_is_reported_at_load() {
    let src = r#"<numberInput name="n" value="0"/>
<repeatForSequence name="r" length="$n">
  <select name="s" numToSelect="3"><option><number>1</number></option><option><number>2</number></option></select>
</repeatForSequence>"#;
    let mut doc = load(src).unwrap();
    let at_load = errors(&doc);
    assert_eq!(at_load.len(), 1, "{at_load:?}");
    assert!(at_load[0].contains("numToSelect=3"), "{at_load:?}");
    let t = set(&mut doc, "n", "value", 1.0);
    assert!(t.rebuild_error.is_none());
    assert_eq!(errors(&doc), at_load);

    let dast = cells_core::dast::Dast::from_json(&dast_json(src)).unwrap();
    let diagnosed = cells_core::diagnose(&dast);
    assert!(
        diagnosed.iter().any(|d| d.kind == DiagnosticKind::Error),
        "{diagnosed:?}"
    );

    let weightless =
        r#"<select name="s"><option selectWeight="0"><number>1</number></option></select>"#;
    let doc = load(weightless).unwrap();
    assert_eq!(
        errors(&doc),
        ["unsupported: a <select> whose remaining options all have weight 0"]
    );
}

// The load's check must not reject what a real build accepts either: a
// collect's count is a counted value, a copy of the number a build
// gathered (ADR 0028), which a prefill may name.
#[test]
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

// An index past the count names the missing referent wherever a reference
// may point: `extend` and a list prop's items hold the missing value, as
// `$r[3].x` does, and take the referent's once the repeat grows.
#[test]
fn a_referent_past_the_count_is_missing_not_an_error() {
    let src = r#"<numberInput name="n" value="1"/>
<graph>
  <repeatForSequence name="r" length="$n">
    <point name="p">(1,2)</point>
    <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
  </repeatForSequence>
  <point name="q" extend="$r[3].p"/>
  <pointList name="vs" extend="$r[3].pg.vertices"/>
</graph>"#;
    let mut doc = load(src).unwrap();
    assert_eq!(errors(&doc), Vec::<String>::new());
    assert!(v(&doc, "q", "x").is_nan());
    let t = set(&mut doc, "n", "value", 3.0);
    assert!(t.rebuild_error.is_none(), "{:?}", t.rebuild_error);
    assert_eq!(errors(&doc), Vec::<String>::new());
    assert_eq!(v(&doc, "q", "x"), 1.0);
    let corner = doc.resolve_path("vs[2]").unwrap();
    let x = doc.prop_cells(corner, "x").unwrap()[0];
    assert_eq!(doc.cells[x.index()], 1.0);
}

// The abstract build runs in every load, its loop checks aside
// (`check_cycles`), so an error a growth would otherwise find, the
// whole-pick rule, is reported at load at every seed, and no build after
// the load finds one (ADR 0014). A build that does roll the tick back with
// `Error::Unchecked`: `rebuild_cycles.rs` reaches that with a cycle, which
// only the loop checks find.
#[test]
fn an_error_a_growth_would_find_is_reported_at_load() {
    for seed in 0..12 {
        let options = LoadOptions {
            seed,
            check_cycles: false,
            ..Default::default()
        };
        let (mut doc, _) = Document::load(dast_json(WHOLE_PICK).as_bytes(), options).unwrap();
        let at_load = errors(&doc);
        assert_eq!(at_load.len(), 1, "seed {seed}: {at_load:?}");
        assert!(at_load[0].contains("names a whole pick"), "{at_load:?}");
        let t = set(&mut doc, "n", "value", 2.0);
        assert!(
            t.rebuilt && t.rebuild_error.is_none(),
            "seed {seed}: {:?}",
            t.rebuild_error
        );
        assert_eq!(errors(&doc), at_load, "seed {seed}");
    }
}

// A choice's interface name holds whatever its branch does, so each branch
// must hold the same kind of value: else whether `$cc.t` is text depends on
// the case a student's input selects.
#[test]
fn an_interface_name_holds_one_kind_of_value() {
    let doc = load(
        r#"<booleanInput name="g"/><numberInput name="n"/>
<conditionalContent name="cc">
  <case condition="$g"><text name="t">hi</text></case>
  <else><text name="t">$n</text></else>
</conditionalContent>
<p>$cc.t</p>"#,
    )
    .unwrap();
    // The choice is boxed, and `$cc.t` reads it as undefined: the one
    // error is the choice's (ADR 0027).
    let found = errors(&doc);
    assert_eq!(found.len(), 1, "{found:?}");
    assert!(
        found[0].contains("'t' holds a different kind of value"),
        "{found:?}"
    );
}

// What a reference to a whole pick needs of its referent holds of every
// option, as the abstract build stands for them all: a prefill names a
// value that is not computed in each, though iteration 2, whose pick could
// be the computed one, does not exist at load.
#[test]
fn a_rule_on_a_whole_picks_referent_holds_for_every_option() {
    let src = r#"<numberInput name="n" value="1"/><numberInput name="x" value="2"/>
<repeatForSequence name="r" length="$n">
  <select name="s">
    <option><number name="a">1</number></option>
    <option><number name="a">2$x</number></option>
  </select>
</repeatForSequence>
<mathInput name="mi" prefill="$r[2].s[1]"/>"#;
    for seed in 0..8 {
        let mut doc = load_with_seed(src, seed).unwrap();
        let at_load = errors(&doc);
        assert_eq!(at_load.len(), 1, "seed {seed}: {at_load:?}");
        assert!(at_load[0].contains("prefill"), "{at_load:?}");
        let t = set(&mut doc, "n", "value", 2.0);
        assert!(
            t.rebuild_error.is_none(),
            "seed {seed}: {:?}",
            t.rebuild_error
        );
        assert_eq!(errors(&doc), at_load, "seed {seed}");
    }
}

/// Ten repeats, each sized by the first item of the one before, behind a
/// count `n`: a structural depth of ten.
fn deep_chain(n: u32) -> String {
    let mut src = format!(
        r#"<numberInput name="n" value="{n}"/><repeatForSequence name="r1" length="$n"><number name="x">1</number></repeatForSequence>"#
    );
    for k in 2..=10 {
        src.push_str(&format!(
            r#"<repeatForSequence name="r{k}" length="$r{}[1].x"><number name="x">1</number></repeatForSequence>"#,
            k - 1
        ));
    }
    src
}

// A load or a rebuild takes as many passes as the structural depth needs,
// which the compile's check bounds; a fixed limit once failed a deep
// document mid-session when a count filled the chain.
#[test]
fn a_structure_deeper_than_eight_passes_settles() {
    let mut doc = load(&deep_chain(0)).unwrap();
    let t = set(&mut doc, "n", "value", 1.0);
    assert!(
        t.rebuilt && t.rebuild_error.is_none(),
        "{:?}",
        t.rebuild_error
    );
    assert_eq!(doc.structure.repeats.len(), 10);
    assert!(doc.structure.repeats.iter().all(|r| r.iterations == 1));
    let loaded = load(&deep_chain(1)).unwrap();
    assert_eq!(loaded.loaded.structural_depth, 10);
    assert!(loaded.structure.repeats.iter().all(|r| r.iterations == 1));
}

/// `n` numbers and a symbolic math referencing each of them once.
fn math_over(n: usize) -> String {
    let mut src = String::new();
    for i in 0..n {
        src.push_str(&format!(r#"<number name="a{i}">{}</number>"#, i + 1));
    }
    let refs: Vec<String> = (0..n).map(|i| format!("$a{i}")).collect();
    src.push_str(&format!(
        r#"<math name="m" simplify>x + {}</math>"#,
        refs.join(" + ")
    ));
    src
}

// A math template counts its references in a byte: 255 compute, and a
// 256th is reported at load, never wrapped.
#[test]
fn a_math_holds_at_most_255_references() {
    let doc = load(&math_over(255)).unwrap();
    assert_eq!(doc.math_text(doc.cell("m", "expr").unwrap()), "x + 32640");
    let doc = load(&math_over(256)).unwrap();
    assert!(doc.cell("m", "expr").is_none(), "the math is boxed");
    let errs = errors(&doc);
    assert!(
        errs.iter().any(|e| e.contains("more than 255 references")),
        "{errs:?}"
    );
}

// ---- ADR 0037: a load-time choice reads constants -------------------------

/// The error codes and messages of `src` at load, the same at every seed
/// and the same as `diagnose`'s (ADR 0013, ADR 0014).
fn choice_errors(src: &str) -> Vec<(&'static str, String)> {
    let list = |doc: &Document| -> Vec<(&'static str, String)> {
        doc.diagnostics()
            .iter()
            .filter(|d| d.kind == DiagnosticKind::Error)
            .map(|d| (d.code, d.message.clone()))
            .collect()
    };
    let first = list(&load_with_seed(src, 0).unwrap());
    for seed in 1..8 {
        assert_eq!(
            list(&load_with_seed(src, seed).unwrap()),
            first,
            "seed {seed}: {src}"
        );
    }
    let dast = cells_core::dast::Dast::from_json(&dast_json(src)).unwrap();
    let diagnosed: Vec<(&'static str, String)> = cells_core::diagnose(&dast)
        .into_iter()
        .filter(|d| d.kind == DiagnosticKind::Error)
        .map(|d| (d.code, d.message))
        .collect();
    assert_eq!(diagnosed, first, "{src}");
    first
}

/// `src` loads with no error.
fn accepted(src: &str) {
    let errs = choice_errors(src);
    assert!(errs.is_empty(), "{src}: {errs:?}");
}

/// `src` loads with one error, of `code`, whose message holds `says`.
fn refused(src: &str, code: &str, says: &str) {
    let errs = choice_errors(src);
    assert_eq!(errs.len(), 1, "{src}: {errs:?}");
    assert_eq!(errs[0].0, code, "{src}: {errs:?}");
    assert!(
        errs[0].1.contains(says),
        "{src}: {:?} lacks {says:?}",
        errs[0].1
    );
}

// The document of ADR 0037's context: two draws of `a` leave `b` nothing,
// which no seed an author previews may hide. Its `+ 3` form is fine at
// every draw, and `b` lies in its sequence.
#[test]
fn a_sequence_some_draw_empties_is_refused() {
    refused(
        r#"<selectFromSequence name="a" from="1" to="5"/>
<selectFromSequence name="b" from="1" to="$a - 3"/>"#,
        "cells-choice-domain",
        "its sequence can be empty",
    );
    let src = r#"<selectFromSequence name="a" from="1" to="5"/>
<selectFromSequence name="b" from="1" to="$a + 3"/><number>$a</number><number>$b</number>"#;
    accepted(src);
    let mut seen = std::collections::BTreeSet::new();
    for seed in 0..40 {
        let doc = load_with_seed(src, seed).unwrap();
        let (a, b) = (
            doc.value("a", "value").unwrap(),
            doc.value("b", "value").unwrap(),
        );
        assert!((1.0..=5.0).contains(&a) && a.fract() == 0.0, "a = {a}");
        assert!(
            b >= 1.0 && b <= a + 3.0 && b.fract() == 0.0,
            "a = {a}, b = {b}"
        );
        seen.insert(b as i64);
    }
    assert!(seen.len() > 3, "{seen:?}");
}

// An iteration index ranges over its repeat's count: iteration 10 of
// twenty empties `10 - $i`, as ADR 0012 reports a loop at any count that
// closes it; nine iterations do not.
#[test]
fn a_sequence_some_iteration_empties_is_refused() {
    refused(
        r#"<repeatForSequence name="r" length="20" indexName="i">
  <selectFromSequence name="s" from="1" to="10 - $i"/>
</repeatForSequence>"#,
        "cells-choice-domain",
        "can be empty",
    );
    let src = r#"<repeatForSequence name="r" length="9" indexName="i">
  <selectFromSequence name="s" from="1" to="10 - $i"/><number>$s</number>
</repeatForSequence>"#;
    accepted(src);
    for seed in 0..10 {
        let doc = load_with_seed(src, seed).unwrap();
        for i in 1..=9 {
            let c = doc.cell(&format!("r[{i}].s"), "value").unwrap();
            let x = doc.cells[c.index()];
            assert!(x >= 1.0 && x <= 10.0 - i as f64, "iteration {i}: {x}");
        }
    }
}

// Whether a `<number>` is constant depends on what inverts onto it
// elsewhere: dragged through a point, `k` is a student's, and the error
// says so; free, it is the author's.
#[test]
fn a_parameter_a_student_can_change_is_refused_naming_the_input() {
    refused(
        r#"<number name="k">5</number>
<graph><point name="p" x="$k" y="0"/></graph>
<selectFromSequence name="s" from="1" to="$k"/>"#,
        "cells-choice-not-constant",
        "'k.value' can be changed by a student through 'p'",
    );
    let src = r#"<number name="k">5</number>
<number name="j">$k * 2</number>
<selectFromSequence name="s" from="$k" to="$j"/><number>$s</number>"#;
    accepted(src);
    let doc = load_with_seed(src, 3).unwrap();
    let s = doc.value("s", "value").unwrap();
    assert!((5.0..=10.0).contains(&s), "{s}");
    // An input's value directly.
    refused(
        r#"<numberInput name="n" value="4"/><selectFromSequence to="$n"/>"#,
        "cells-choice-not-constant",
        "through 'n'",
    );
}

// What else makes a value one a student can change: a hold by a flag a
// student sets, a gate a student opens, a count that follows a repeat, and
// a read through an index the count of an input decides.
#[test]
fn holds_gates_counts_and_indexes_decide_whether_a_parameter_is_constant() {
    refused(
        r#"<booleanInput name="b"/><number name="k">5</number>
<number name="m" fixed="$b">$k</number>
<selectFromSequence to="$m"/>"#,
        "cells-choice-not-constant",
        "can be changed by a student",
    );
    accepted(
        r#"<number name="k">5</number>
<number name="m" fixed="true">$k</number>
<selectFromSequence to="$m"/>"#,
    );
    refused(
        r#"<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><number name="x">5</number></case>
  <else><number name="x">6</number></else>
</conditionalContent>
<selectFromSequence to="$cc.x"/>"#,
        "cells-choice-not-constant",
        "can be changed by a student",
    );
    refused(
        r#"<repeatForSequence name="r" length="3"><number name="x">1</number></repeatForSequence>
<collect name="c" from="$r" componentType="number"/>
<selectFromSequence to="$c.count"/>"#,
        "cells-choice-not-constant",
        "is a count",
    );
    refused(
        r#"<numberInput name="k" value="3"/>
<repeatForSequence name="r" length="$k"><number name="n">4</number></repeatForSequence>
<selectFromSequence to="$r[1].n"/>"#,
        "cells-choice-not-constant",
        "read through an index",
    );
    accepted(
        r#"<repeatForSequence name="r" length="3"><number name="n">4</number></repeatForSequence>
<selectFromSequence to="$r[1].n"/>"#,
    );
    // Past the count in every build: the missing value, which bounds
    // nothing.
    refused(
        r#"<repeatForSequence name="r" length="3"><number name="n">4</number></repeatForSequence>
<selectFromSequence to="$r[5].n"/>"#,
        "cells-choice-domain",
        "cannot be bounded",
    );
}

// An exclude is a parameter like any other: another pick may be excluded,
// and three excludes of three values can leave nothing.
#[test]
fn excludes_may_read_constants_and_must_leave_a_value() {
    let src = r#"<selectFromSequence name="a" from="1" to="5"/>
<selectFromSequence name="b" from="1" to="5" exclude="$a"/>
<selectFromSequence name="c" from="1" to="5" exclude="2, 4"/><number>$a</number><number>$b</number><number>$c</number>"#;
    accepted(src);
    for seed in 0..30 {
        let doc = load_with_seed(src, seed).unwrap();
        let (a, b, c) = (
            doc.value("a", "value").unwrap(),
            doc.value("b", "value").unwrap(),
            doc.value("c", "value").unwrap(),
        );
        assert!(a != b && (1.0..=5.0).contains(&b), "a {a}, b {b}");
        assert!([1.0, 3.0, 5.0].contains(&c), "c {c}");
    }
    refused(
        r#"<selectFromSequence name="a" from="1" to="3"/>
<selectFromSequence name="b" from="1" to="3"/>
<selectFromSequence name="c" from="1" to="3"/>
<selectFromSequence from="1" to="3" exclude="$a $b $c"/>"#,
        "cells-choice-domain",
        "exclude can leave nothing",
    );
    refused(
        r#"<selectFromSequence from="1" to="3" exclude="1 2 3"/>"#,
        "cells-choice-domain",
        "exclude can leave nothing",
    );
}

// A `<math>` constant is evaluated by the check's engine, as a build
// evaluates it: `pi` bounds a sequence of three.
#[test]
fn a_math_constant_bounds_a_sequence() {
    let src = r#"<math name="m">pi</math>
<selectFromSequence name="s" to="$m"/><number name="n">$s</number>"#;
    accepted(src);
    for seed in 0..20 {
        let doc = load_with_seed(src, seed).unwrap();
        let n = doc.value("n", "value").unwrap();
        assert!([1.0, 2.0, 3.0].contains(&n), "{n}");
    }
    refused(
        r#"<math name="m">x</math><selectFromSequence to="$m"/>"#,
        "cells-choice-domain",
        "cannot be bounded",
    );
}

// A step a pick may make 0 is refused.
#[test]
fn a_step_that_may_be_zero_is_refused() {
    refused(
        r#"<selectFromSequence name="s" from="-1" to="1"/>
<selectFromSequence from="1" to="10" step="$s"/>"#,
        "cells-choice-domain",
        "step can be 0",
    );
}

// `<select numToSelect>` is shape: a document constant the build reads as
// a number. An author's number may be read; an iteration index may not.
#[test]
fn a_selects_num_to_select_is_a_document_constant() {
    let src = r#"<number name="n">2</number>
<select name="s" numToSelect="$n">
  <option><number name="v">1</number></option>
  <option><number name="v">2</number></option>
  <option><number name="v">3</number></option>
</select>
<number name="a">$s[1].v</number><number name="b">$s[2].v</number>"#;
    accepted(src);
    for seed in 0..10 {
        let doc = load_with_seed(src, seed).unwrap();
        let (a, b) = (
            doc.value("a", "value").unwrap(),
            doc.value("b", "value").unwrap(),
        );
        assert!(a != b && (1.0..=3.0).contains(&a) && (1.0..=3.0).contains(&b));
    }
    refused(
        r#"<repeatForSequence length="3" indexName="i">
  <select numToSelect="$i"><option><number>1</number></option><option><number>2</number></option><option><number>3</number></option></select>
</repeatForSequence>"#,
        "cells-choice-domain",
        "must be the same in every scope",
    );
    // More than its options, through a reference: the drawability check
    // reads the number the check evaluated.
    refused(
        r#"<number name="n">3</number>
<select numToSelect="$n"><option><number>1</number></option><option><number>2</number></option></select>"#,
        "cells-unsupported",
        "numToSelect=3 is more than the 2 options",
    );
}

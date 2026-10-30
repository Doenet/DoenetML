//! ADR 0014: every error is a function of the document source. A load
//! reports every error the document has; no count a student reaches, no
//! pick a select draws in a new iteration and no restored state finds
//! another. `tests/every_count.rs` checks the promise over every golden
//! document and fixture; these are the constructs that once broke it.

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

// The probe runs in every load, its loop checks aside (`check_cycles`),
// so an error a growth would otherwise find, the whole-pick rule, is
// reported at load at every seed, and no build after the load finds one
// (ADR 0014). A build that does roll the tick back with `Error::Unchecked`:
// `rebuild_cycles.rs` reaches that with a cycle, which only the loop checks
// find.
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
    // The choice is boxed, so `$cc` is reported unknown too.
    let found = errors(&doc);
    assert!(
        found
            .iter()
            .any(|e| e.contains("'t' holds a different kind of value")),
        "{found:?}"
    );
}

// What a reference to a whole pick needs of its referent holds of every
// option, as the probe stands for them all: a prefill names a value that
// is not computed in each, though iteration 2, whose pick could be the
// computed one, does not exist at load.
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

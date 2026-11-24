//! The two sequences that number the divisions and the list items (ADR
//! 0054), in the scenarios of the current core's `sectioning.test.ts`
//! ("divisions are numbered through the containers that show no number")
//! and `cascade.test.ts` (the parts of a problem), without the
//! `<cascade>`s the cells core does not have.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_unpruned};
use common::{set, type_into};

fn number(doc: &Document, name: &str) -> String {
    doc.section_number(doc.resolve_path(name).unwrap()).unwrap()
}

fn numbers(src: &str, names: &[&str]) -> Vec<String> {
    let doc = load(src).unwrap();
    assert_eq!(reference::check(&doc), None);
    names.iter().map(|n| number(&doc, n)).collect()
}

#[test]
fn a_subsection_inside_a_div_continues_the_subsections_around_it() {
    assert_eq!(
        numbers(
            r#"<section name="s"><title>S</title>
  <subsection name="a"><title>A</title></subsection>
  <div><subsection name="b"><title>B</title></subsection></div>
  <subsection name="c"><title>C</title></subsection>
</section>"#,
            &["s", "a", "b", "c"]
        ),
        ["1", "1.1", "1.2", "1.3"]
    );
}

#[test]
fn nested_divs_and_divs_back_to_back_are_one_sequence() {
    assert_eq!(
        numbers(
            r#"<section name="a"/>
<div>
  <section name="b"/>
  <div><section name="c"/><div><section name="d"/></div></div>
  <section name="e"/>
</div>
<div><section name="f"/><section name="g"/></div>
<group><section name="h"/></group>
<section name="i"/>"#,
            &["a", "b", "c", "d", "e", "f", "g", "h", "i"]
        ),
        ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    );
}

#[test]
fn the_types_of_division_share_one_sequence_through_a_div() {
    assert_eq!(
        numbers(
            r#"<section name="a"/>
<div><example name="b"/><problem name="c"/><aside name="d"/></div>
<theorem name="e"/>"#,
            &["a", "b", "c", "d", "e"]
        ),
        ["1", "2", "3", "4", "5"]
    );
}

#[test]
fn a_division_inside_a_div_takes_the_enclosing_sections_number() {
    assert_eq!(
        numbers(
            r#"<section name="first"/>
<section name="second">
  <subsection name="a"/>
  <div><subsection name="b"/><div><subsection name="c" includeParentNumber="false"/></div></div>
  <subsection name="d"/>
</section>"#,
            &["second", "a", "b", "c", "d"]
        ),
        ["2", "2.1", "2.2", "3", "2.4"]
    );
}

#[test]
fn a_proof_inside_a_div_bounds_the_sequence() {
    assert_eq!(
        numbers(
            r#"<section name="s">
  <subsection name="a"/>
  <div>
    <proof startOpen><subsection name="inProof" includeParentNumber="false"/></proof>
    <subsection name="b"/>
  </div>
</section>"#,
            &["a", "inProof", "b"]
        ),
        ["1.1", "1", "1.2"]
    );
}

#[test]
fn a_statement_an_introduction_and_a_conclusion_pass_the_divisions_through() {
    assert_eq!(
        numbers(
            r#"<problem name="p">
  <statement><subsection name="a"/></statement>
  <subsection name="b"/>
</problem>
<section name="s">
  <introduction><subsection name="c"/></introduction>
  <subsection name="d"/>
  <conclusion><subsection name="e"/></conclusion>
</section>"#,
            &["p", "a", "b", "s", "c", "d", "e"]
        ),
        ["1", "1.1", "1.2", "2", "2.1", "2.2", "2.3"]
    );
}

#[test]
fn a_block_that_is_no_div_bounds_the_sequence() {
    assert_eq!(
        numbers(
            r#"<section name="s">
  <subsection name="a"/>
  <blockQuote><subsection name="x"/><div><subsection name="y"/></div></blockQuote>
  <subsection name="b"/>
</section>"#,
            &["a", "x", "y", "b"]
        ),
        ["1.1", "1.1", "1.2", "1.2"]
    );
}

#[test]
fn the_parts_of_a_problem_are_its_list_items() {
    // A proof and an aside take a place among the list items; the parts
    // take one among the divisions too, so the subsection after them is
    // the fourth division.
    assert_eq!(
        numbers(
            r#"<problem name="p">
  <part name="a"/>
  <proof><p>Clear.</p></proof>
  <part name="b"/>
  <aside name="c"/>
  <part name="d"/>
  <subsection name="e" includeParentNumber="false"/>
</problem>"#,
            &["a", "b", "c", "d", "e"]
        ),
        ["1", "3", "3", "5", "5"]
    );
}

#[test]
fn a_part_inside_a_div_is_counted_among_the_divs_children() {
    assert_eq!(
        numbers(
            r#"<problem name="p">
  <part name="a"/>
  <div><part name="b"/><part name="c"/></div>
  <part name="d"/>
</problem>"#,
            &["a", "b", "c", "d"]
        ),
        ["1", "1", "2", "2"]
    );
}

#[test]
fn a_part_shows_no_parent_number() {
    assert_eq!(
        numbers(
            r#"<section name="s"><part name="a" includeParentNumber/><subsection name="b"/></section>"#,
            &["a", "b"]
        ),
        ["1", "1.2"]
    );
}

#[test]
fn the_problems_of_a_problems_are_its_list_items() {
    assert_eq!(
        numbers(
            r#"<section name="s">
  <subsection name="s1"/>
  <problems name="ps">
    <problem name="p1"/>
    <proof><p>Clear.</p></proof>
    <group><problem name="p2"/></group>
    <subsection name="p3"/>
  </problems>
  <subsection name="s2"/>
</section>"#,
            &["s1", "ps", "p1", "p2", "p3", "s2"]
        ),
        ["1.1", "2", "1", "3", "4", "1.3"]
    );
}

#[test]
fn a_problems_not_as_a_list_numbers_its_problems_as_divisions() {
    assert_eq!(
        numbers(
            r#"<problems name="ps" asList="false">
  <problem name="p1"/>
  <proof><p>Clear.</p></proof>
  <problem name="p2"/>
</problems>"#,
            &["p1", "p2"]
        ),
        ["1", "2"]
    );
}

#[test]
fn numbers_follow_a_count_of_divisions_that_changes_at_runtime() {
    // sectioning.test.ts, "numbers follow a count of divisions that changes
    // at runtime", without its cascade.
    let mut doc = load_unpruned(
        r#"<mathInput name="n" prefill="2" />
<booleanInput name="show" prefill="true" />
<section name="a"/>
<div>
  <repeatForSequence name="r" length="$n"><section name="p"/></repeatForSequence>
</div>
<section name="b"/>
<div><conditionalContent name="cc" condition="$show"><section name="shown"/></conditionalContent></div>
<section name="c"/>
<repeatForSequence name="s" length="$n"><section name="q"/></repeatForSequence>
<div><section name="d"/></div>
"#,
    )
    .unwrap();
    for (n, show) in [(2, true), (3, true), (3, false), (0, false), (1, true)] {
        type_into(&mut doc, "n", &n.to_string());
        set(&mut doc, "show", "value", f64::from(show));
        let shown = usize::from(show);
        assert_eq!(number(&doc, "a"), "1");
        assert_eq!(number(&doc, "b"), (2 + n).to_string(), "n={n}");
        if show {
            assert_eq!(number(&doc, "cc.shown"), (3 + n).to_string());
        }
        assert_eq!(number(&doc, "c"), (3 + n + shown).to_string());
        assert_eq!(number(&doc, "d"), (4 + 2 * n + shown).to_string());
        if n > 0 {
            assert_eq!(number(&doc, &format!("r[{n}].p")), (1 + n).to_string());
            assert_eq!(
                number(&doc, &format!("s[{n}].q")),
                (3 + 2 * n + shown).to_string()
            );
        }
        assert_eq!(reference::check(&doc), None);
    }
}

#[test]
fn parts_follow_a_count_that_changes_at_runtime() {
    let mut doc = load_unpruned(
        r#"<mathInput name="n" prefill="2" />
<booleanInput name="show" prefill="true" />
<problem name="p">
  <conditionalContent condition="$show"><proof><p>Clear.</p></proof></conditionalContent>
  <repeatForSequence name="r" length="$n"><part name="q"/></repeatForSequence>
  <part name="last"/>
</problem>
"#,
    )
    .unwrap();
    for (n, show) in [(2, true), (3, false), (0, true), (1, false)] {
        type_into(&mut doc, "n", &n.to_string());
        set(&mut doc, "show", "value", f64::from(show));
        let shown = usize::from(show);
        assert_eq!(number(&doc, "last"), (1 + n + shown).to_string());
        if n > 0 {
            assert_eq!(number(&doc, &format!("r[{n}].q")), (n + shown).to_string());
        }
        assert_eq!(reference::check(&doc), None);
    }
}

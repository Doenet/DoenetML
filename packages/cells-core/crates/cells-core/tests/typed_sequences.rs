//! Sequences of letters and of math (ADR 0074): a `<sequence
//! type="letters|math">` lists values the compile counts, and a
//! `<selectFromSequence>` of that type draws among them; a `<select
//! type>`'s pieces are options the parser made.

mod common;
use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_with_seed};

fn text(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

#[test]
fn a_sequence_of_letters_counts_as_the_current_core_does() {
    let doc = load(
        r#"<p name="a"><sequence type="letters" from="c" to="Q" length="5"/></p>
           <p name="b"><sequence type="letters" from="Y" to="f" step="-4"/></p>
           <p name="c"><sequence type="letters" from="aZ" step="3" length="4"/></p>
           <p name="d"><sequence type="letters" to="q" step="3" length="10"/></p>
           <p name="e"><sequence type="letters"/></p>
           <p name="f"><sequence type="letters" length="6" exclude="b  f"/></p>
           <sequence name="s" type="letters" from="x" to="z"/>
           <text name="t">$s[2]</text>
           <number name="n">$s.numComponents</number>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "a"), "c, f, i, l, o");
    assert_eq!(text(&doc, "b"), "Y, U, Q, M, I");
    assert_eq!(text(&doc, "c"), "az, bc, bf, bi");
    assert_eq!(text(&doc, "d"), "b, e, h, k, n, q");
    assert_eq!(text(&doc, "e"), "a, b, c, d, e, f, g, h, i, j");
    assert_eq!(text(&doc, "f"), "a, c, d, e");
    assert_eq!(text(&doc, "t"), "y");
    assert_eq!(common::v(&doc, "n", "value"), 3.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_sequence_of_letters_whose_excludes_follow_a_text_is_structural() {
    let mut doc = load(
        r#"<p name="p"><sequence type="letters" length="10" exclude="$e  b f"/></p>
           <textInput name="e"><label>e</label></textInput>
           <p name="u"><sequence type="letters" from="C" to="F" exclude="$e"/></p>"#,
    )
    .unwrap();
    assert_eq!(text(&doc, "p"), "a, c, d, e, g, h, i, j");
    assert_eq!(text(&doc, "u"), "C, D, E, F");
    let i = doc.intern("i");
    common::set(&mut doc, "e", "value", i);
    assert_eq!(text(&doc, "p"), "a, c, d, e, g, h, j");
    let d = doc.intern("d");
    common::set(&mut doc, "e", "value", d);
    assert_eq!(text(&doc, "p"), "a, c, e, g, h, i, j");
    assert_eq!(text(&doc, "u"), "C, E, F");
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_sequence_of_math_steps_symbolically() {
    let doc = load(
        r#"<sequence name="s" type="math" from="3x" to="3y" length="4"/>
           <sequence name="r" type="math" from="1" to="(0.1+0.7)*10"/>
           <sequence name="q" type="math" from=".1" to=".8" step=".1" exclude=".3 .6 .7"/>"#,
    )
    .unwrap();
    let entry = |name: &str, k: usize| {
        let cell = doc.cell(name, &format!("number{k}")).unwrap();
        doc.math_text(cell)
    };
    assert_eq!(entry("s", 1), "3 x");
    assert_eq!(entry("s", 2), "2 x + y");
    assert_eq!(entry("s", 3), "x + 2 y");
    assert_eq!(entry("s", 4), "3 y");
    assert_eq!(common::v(&doc, "r", "numComponents"), 8.0);
    assert_eq!(entry("r", 8), "8");
    assert_eq!(common::v(&doc, "q", "numComponents"), 5.0);
    assert_eq!(reference::check(&doc), None);
}

#[test]
fn a_select_from_letters_draws_distinct_letters_of_the_sequence() {
    for seed in 0..8 {
        let doc = load_with_seed(
            r#"<selectFromSequence name="s" type="letters" from="c" to="h"/>
               <selectFromSequence name="all" type="letters" from="a" to="e" numToSelect="5"/>
               <p name="sorted"><selectFromSequence type="letters" numToSelect="20" sort="increasing" withReplacement from="a" to="bz"/></p>
               <p name="down"><selectFromSequence type="letters" numToSelect="3" sort from="e" to="a" step="-1"/></p>
               <text name="t">$s</text>"#,
            seed,
        )
        .unwrap();
        let s = text(&doc, "s");
        assert!(["c", "d", "e", "f", "g", "h"].contains(&s.as_str()), "{s}");
        assert_eq!(text(&doc, "t"), s);
        let mut all: Vec<String> = text(&doc, "all").split(", ").map(String::from).collect();
        all.sort();
        assert_eq!(all, ["a", "b", "c", "d", "e"]);
        let sorted: Vec<String> = text(&doc, "sorted").split(", ").map(String::from).collect();
        assert_eq!(sorted.len(), 20);
        let key = |s: &String| (s.len(), s.clone());
        assert!(
            sorted.windows(2).all(|w| key(&w[0]) <= key(&w[1])),
            "{sorted:?}"
        );
        let down: Vec<String> = text(&doc, "down").split(", ").map(String::from).collect();
        assert!(down.windows(2).all(|w| w[0] < w[1]), "{down:?}");
        assert_eq!(reference::check(&doc), None);
    }
}

#[test]
fn a_select_from_math_draws_expressions_of_the_sequence() {
    for seed in 0..4 {
        let doc = load_with_seed(
            r#"<selectFromSequence name="s" type="math" from="x" step="y" length="3" numToSelect="3"/>"#,
            seed,
        )
        .unwrap();
        let mut got: Vec<String> = (1..=3)
            .map(|k| doc.math_text(doc.cell("s", &format!("number{k}")).unwrap()))
            .collect();
        got.sort();
        assert_eq!(got, ["x", "x + 2 y", "x + y"]);
        assert_eq!(reference::check(&doc), None);
    }
}

#[test]
fn a_copy_draws_what_its_referent_drew() {
    for seed in 0..4 {
        let doc = load_with_seed(
            r#"<selectFromSequence name="s" type="letters" from="a" to="z" numToSelect="3"/>
               <p name="p">$s</p>"#,
            seed,
        )
        .unwrap();
        assert_eq!(text(&doc, "p"), text(&doc, "s"));
    }
}

#[test]
fn a_select_of_typed_pieces_reads_its_type() {
    // The parser made each piece an option holding a value of the type.
    for source in [
        r#"<select name="s" type="number" numToSelect="3">5 5 5</select>"#,
        r#"<select name="s" type="text" numToSelect="2">a a</select>"#,
        r#"<select name="s" type="boolean">true</select>"#,
        r#"<select name="s" type="nothing">x</select>"#,
    ] {
        let doc = load(source).unwrap();
        assert!(
            doc.diagnostics().is_empty(),
            "{source}: {:?}",
            doc.diagnostics()
        );
    }
    let doc = load(r#"<p name="p"><select type="text">ab</select></p>"#).unwrap();
    assert_eq!(text(&doc, "p"), "ab");
}

#[test]
fn more_draws_than_letters_is_refused() {
    let doc = load(r#"<selectFromSequence type="letters" from="a" to="b" numToSelect="3"/>"#);
    let doc = doc.unwrap();
    assert!(
        doc.diagnostics()
            .iter()
            .any(|d| d.code == "cells-choice-domain"),
        "{:?}",
        doc.diagnostics()
    );
}

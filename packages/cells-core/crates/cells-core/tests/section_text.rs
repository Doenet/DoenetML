//! A section's `title` and `sectionNumber` as values a reference reads
//! (ADR 0058), in the scenarios of the current core's `sectioning.test.ts`
//! ("copy and overwrite title", "Auto naming of section titles"): text made
//! from the section's number cells, so a count that changes in a tick
//! changes it, the same text `Document::section_number` composes.

mod common;

use cells_core::Document;
use cells_core::testing::reference;
use cells_core::testing::test_utils::{load, load_unpruned};
use common::{set, type_into};

/// Prop `prop` of `name`, a text cell, as its text.
fn text(doc: &Document, name: &str, prop: &str) -> String {
    let cell = doc
        .cell(name, prop)
        .unwrap_or_else(|| panic!("no {name}.{prop}"));
    doc.text_value(cell)
}

fn rendered(doc: &Document, name: &str) -> String {
    doc.rendered_text(doc.resolve_path(name).unwrap())
}

/// `sectionNumber` reads as the core composes it, everywhere.
fn agrees(doc: &Document, name: &str) -> String {
    let n = text(doc, name, "sectionNumber");
    assert_eq!(
        Some(n.clone()),
        doc.section_number(doc.resolve_path(name).unwrap()),
        "{name}"
    );
    n
}

#[test]
fn a_title_and_number_read_as_values() {
    let doc = load(
        r#"<section includeAutoName includeAutoNumber name="sec">
  <title>A title</title>
  <p>Hello</p>
</section>
<section includeAutoName includeAutoNumber name="revised" extend="$sec">
  <title>A better title</title>
  <p>Good day!</p>
</section>
<p name="p"><text extend="$sec.title"/>; <text extend="$revised.title"/>; <text extend="$sec.sectionNumber"/>; <text extend="$revised.sectionNumber"/></p>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    assert_eq!(rendered(&doc, "p"), "A title; A better title; 1; 2");
}

#[test]
fn an_automatic_title_is_the_word_and_the_full_number() {
    let doc = load_unpruned(
        r#"<section name="a">
  <section name="b">
    <section name="c"/>
    <section name="d" includeParentNumber="false"><section name="e"/></section>
  </section>
  <problem name="f"/>
  <section name="g" noAutoTitle/>
  <section name="h" includeAutoNumberIfNoTitle="false"/>
  <section name="i" includeAutoNameIfNoTitle="false"/>
</section>
<problems name="ps" renameTo="Tasks">
  <problem name="j"/>
  <problem name="k"><part name="l"/><part name="m"/></problem>
</problems>"#,
    )
    .unwrap();
    assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
    for (name, number, title) in [
        ("a", "1", "Section 1"),
        ("b", "1.1", "Section 1.1"),
        ("c", "1.1.1", "Section 1.1.1"),
        ("d", "2", "Section 2"),
        ("e", "2.1", "Section 2.1"),
        // A problem shows no parent's number.
        ("f", "2", "Problem 2"),
        ("g", "1.3", ""),
        ("h", "1.4", "Section"),
        ("i", "1.5", "1.5"),
        ("ps", "2", "Tasks 2"),
        // Items of the list, and parts, show no parent's number.
        ("j", "1", "Problem 1"),
        ("k", "2", "Problem 2"),
        ("m", "2", "Part 2"),
    ] {
        assert_eq!(agrees(&doc, name), number, "{name}");
        assert_eq!(text(&doc, name, "title"), title, "{name}");
    }
}

#[test]
fn a_title_and_number_follow_counts_that_change_at_runtime() {
    let mut doc = load_unpruned(
        r#"<mathInput name="n" prefill="2" />
<booleanInput name="show" value="true" />
<section name="a"/>
<conditionalContent name="cc" condition="$show"><section name="shown"/></conditionalContent>
<section name="s">
  <repeatForSequence name="r" length="$n">
    <section name="p"><p name="q">$p.title</p></section>
  </repeatForSequence>
  <section name="last"/>
</section>
<p name="out">$s.title; $last.sectionNumber</p>"#,
    )
    .unwrap();
    for (n, show) in [(2, true), (3, true), (3, false), (0, false), (1, true)] {
        type_into(&mut doc, "n", &n.to_string());
        set(&mut doc, "show", "value", f64::from(show));
        let s = 2 + usize::from(show);
        assert_eq!(agrees(&doc, "s"), s.to_string());
        assert_eq!(
            rendered(&doc, "out"),
            format!("Section {s}; {s}.{}", n + 1),
            "n={n} show={show}"
        );
        for k in 1..=n {
            let p = format!("r[{k}].p");
            assert_eq!(agrees(&doc, &p), format!("{s}.{k}"));
            assert_eq!(
                rendered(&doc, &format!("{p}.q")),
                format!("Section {s}.{k}")
            );
        }
        assert_eq!(reference::check(&doc), None);
    }
}

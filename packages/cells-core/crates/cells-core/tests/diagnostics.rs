//! Diagnostics are a product of one exhaustive build (ADR 0013): the list
//! `diagnose` returns is a function of the DAST alone, covers every
//! option of a select and every repeat body whatever the seed or the
//! counts, and a load whose check ran reports the same errors (ADR 0014).
//! A tick never adds one.

use cells_core::CompIdx;
use std::collections::BTreeSet;
use std::path::Path;

use cells_core::build::Repeat;
use cells_core::components::ComponentType;
use cells_core::testing::test_utils::{dast_json, load, load_with_seed, repo_root};
use cells_core::{Diagnostic, DiagnosticKind, Document, LoadOptions, Request, diagnose};

fn diagnose_src(src: &str) -> Vec<Diagnostic> {
    let dast = cells_core::dast::load(dast_json(src).as_bytes()).unwrap();
    diagnose(&dast)
}

fn errors(list: &[Diagnostic]) -> Vec<&Diagnostic> {
    list.iter()
        .filter(|d| d.kind == DiagnosticKind::Error)
        .collect()
}

/// (kind, code, node) of each entry: what two lists are compared on.
fn keys(list: &[Diagnostic]) -> BTreeSet<(DiagnosticKind, &'static str, Option<u32>)> {
    list.iter().map(|d| (d.kind, d.code, d.node)).collect()
}

#[test]
fn an_element_that_fails_becomes_an_error_component_and_the_rest_loads() {
    let doc =
        load(r#"<p name="p"><point name="q" x="$nope"/></p><number name="n">3</number>"#).unwrap();
    assert_eq!(doc.value("n", "value"), Some(3.0));
    let errs = errors(doc.diagnostics());
    assert_eq!(errs.len(), 1, "{:?}", doc.diagnostics());
    assert_eq!(errs[0].code, "doenet-w0104");
    // The box stands where the point was, carrying its diagnostic's index.
    let boxes: Vec<_> = CompIdx::below(doc.n_components())
        .filter(|&c| doc.component_type(c) == ComponentType::Error)
        .collect();
    assert_eq!(boxes.len(), 1);
    let b = boxes[0];
    assert_eq!(
        doc.components.parent[b.index()],
        doc.component("p").unwrap()
    );
    // Its node names its diagnostic; it has no cells of its own.
    assert_eq!(doc.components.dast_node[b.index()], errs[0].node.unwrap());
    assert!(doc.comp_cells(b).is_empty());
    assert!(doc.component("q").is_none(), "a boxed element has no name");
}

#[test]
fn a_reference_to_a_boxed_element_is_boxed_in_turn() {
    let doc = load(r#"<number name="a">$nope</number><number name="b">$a + 1</number><number name="c">2</number>"#).unwrap();
    assert_eq!(doc.value("c", "value"), Some(2.0));
    let errs = errors(doc.diagnostics());
    assert_eq!(errs.len(), 2, "{errs:?}");
    // In document order.
    assert!(errs[0].node < errs[1].node);
    assert!(errs[0].message.contains("nope"), "{}", errs[0].message);
    assert!(errs[1].message.contains("$a"), "{}", errs[1].message);
}

#[test]
fn an_unchosen_option_is_still_diagnosed() {
    // The bad reference resolves at expand, so only a build of the option
    // finds it: the load's check builds every option, whatever is drawn.
    let src = r#"<point name="p"/>
      <select name="s">
        <option><number name="a">1</number></option>
        <option><number name="a">$p</number></option>
      </select>"#;
    let list = diagnose_src(src);
    assert_eq!(errors(&list).len(), 1, "{list:?}");
    assert_eq!(errors(&list)[0].code, "cells-arity-mismatch");
    // Every seed reports it, whichever option it draws: the load's check
    // builds every option (ADR 0014), so its list is `diagnose`'s.
    for seed in 0..8 {
        let doc = load_with_seed(src, seed).unwrap();
        assert_eq!(keys(doc.diagnostics()), keys(&list), "seed {seed}");
    }
}

#[test]
fn a_repeat_body_at_count_zero_is_still_diagnosed() {
    // The cycle check's probe stamps the body once at load, so the load
    // boxes it too; `diagnose` reports the same.
    let src = r#"<point name="p"/><repeatForSequence name="r" length="0"><number name="x">$p</number></repeatForSequence>"#;
    let doc = load(src).unwrap();
    let list = diagnose_src(src);
    assert_eq!(errors(&list).len(), 1, "{list:?}");
    assert_eq!(keys(doc.diagnostics()), keys(&list));
    assert_eq!(doc.structure.repeats[0].iterations, 0);
}

#[test]
fn a_cycle_has_no_element_and_is_reported_on_the_document() {
    let src = r#"<point name="a" x="$b.x"/><point name="b" x="$a.x"/>"#;
    assert!(load(src).is_err());
    let list = diagnose_src(src);
    assert_eq!(list.len(), 1, "{list:?}");
    assert_eq!(list[0].code, "doenet-e0005");
    assert_eq!(list[0].node, None);
}

#[test]
fn accessibility_findings_are_structural() {
    let list = diagnose_src(
        r#"<graph name="g1"/>
           <graph name="g2"><shortDescription>A graph</shortDescription></graph>
           <graph name="g3" decorative/>
           <mathInput name="m1"/>
           <mathInput name="m2"><shortDescription>first</shortDescription></mathInput>
           <mathInput name="m3" labelIsName/>
           <numberInput name="n1"><label>n</label></numberInput>"#,
    );
    let a11y: Vec<_> = list
        .iter()
        .filter(|d| d.kind == DiagnosticKind::Accessibility)
        .collect();
    assert_eq!(a11y.len(), 2, "{list:?}");
    assert_eq!(a11y[0].code, "doenet-a0001");
    assert_eq!(a11y[0].level, Some(1));
    assert_eq!(
        a11y[0].args.get("component").map(String::as_str),
        Some("graph")
    );
    assert!(a11y[0].message.contains("`<graph>`"));
    assert_eq!(a11y[1].code, "doenet-a0003");
    assert!(
        a11y[1].message.contains("`<mathInput>`"),
        "{}",
        a11y[1].message
    );
    // The same list from a load: the elements all stamp.
    let doc = load(r#"<graph name="g1"/>"#).unwrap();
    assert_eq!(doc.diagnostics().len(), 1);
    assert_eq!(doc.diagnostics()[0].code, "doenet-a0001");
}

#[test]
fn a_rebuild_keeps_the_boxes_and_adds_nothing() {
    let mut doc = load(
        r#"<numberInput name="n" value="1"/>
           <point name="q" x="$nope"/>
           <repeatForSequence name="r" length="$n"><number name="x">1</number></repeatForSequence>"#,
    )
    .unwrap();
    let before = doc.diagnostics().to_vec();
    assert_eq!(errors(&before).len(), 1);
    let cell = doc.cell("n", "value").unwrap();
    let out = doc.request(&[Request { cell, value: 3.0 }]);
    assert!(out.rebuilt && out.rebuild_error.is_none(), "{out:?}");
    assert_eq!(doc.diagnostics(), &before[..]);
}

/// Every golden document and fixture: `diagnose` is the same list however
/// many times it runs, and what each load at any seed reports, before and
/// after its counts move, is within it.
#[test]
fn every_load_reports_within_the_exhaustive_list() {
    let docs = documents();
    assert!(docs.len() >= 10, "the golden set is missing");
    for (name, bytes) in &docs {
        let dast = cells_core::dast::load(bytes).unwrap();
        let list = diagnose(&dast);
        assert_eq!(list, diagnose(&dast), "{name}: diagnose is not stable");
        let all = keys(&list);
        for seed in 0..4u64 {
            let Ok((mut doc, _)) = Document::load(
                bytes,
                LoadOptions {
                    seed,
                    ..Default::default()
                },
            ) else {
                // A load fails only for what has no element to box (a
                // cycle), which the list carries without a node.
                assert!(list.iter().any(|d| d.node.is_none()), "{name} seed {seed}");
                continue;
            };
            let own = keys(doc.diagnostics());
            assert!(
                own.is_subset(&all),
                "{name} seed {seed}: {:?} not in {:?}",
                own.difference(&all),
                all
            );
            for count in [0.0, 3.0] {
                let requests: Vec<Request> = doc
                    .structure
                    .repeats
                    .clone()
                    .iter()
                    .map(|r| Request {
                        cell: count_cell(&doc, r),
                        value: count,
                    })
                    .collect();
                if requests.is_empty() {
                    break;
                }
                // A count is no input's prop: moving it is unchecked.
                let out = cells_core::testing::request_unchecked(&mut doc, &requests);
                assert!(
                    out.rebuild_error.is_none(),
                    "{name} seed {seed} count {count}: {out:?}"
                );
                let own = keys(doc.diagnostics());
                assert!(
                    own.is_subset(&all),
                    "{name} seed {seed} count {count}: {own:?}"
                );
            }
        }
    }
}

fn count_cell(doc: &Document, r: &Repeat) -> cells_core::CellIdx {
    let pi = doc.component_type(r.comp).count_prop().unwrap();
    doc.comp_cells(r.comp)[pi]
}

/// (name, DAST bytes) of every golden document, `sir`, and every
/// generated fixture present.
fn documents() -> Vec<(String, Vec<u8>)> {
    let root = repo_root();
    let mut sources: Vec<_> = std::fs::read_dir(root.join("crates/cells-bench/golden"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    sources.sort();
    sources.push(root.join("fixtures/sir.doenet"));
    let mut out: Vec<(String, Vec<u8>)> = sources
        .iter()
        .filter(|p| p.exists())
        .map(|p| {
            let src = std::fs::read_to_string(p).unwrap();
            (stem(p), dast_json(&src).into_bytes())
        })
        .collect();
    let mut generated: Vec<_> = std::fs::read_dir(root.join("fixtures"))
        .map(|d| d.flatten().map(|e| e.path()).collect())
        .unwrap_or_default();
    generated.retain(|p| p.extension().is_some_and(|x| x == "json"));
    generated.sort();
    for p in generated {
        out.push((stem(&p), std::fs::read(&p).unwrap()));
    }
    out
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

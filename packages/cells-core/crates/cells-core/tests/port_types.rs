//! The type pass agrees with every build: for every golden document,
//! `sir.doenet` and every generated fixture (skipped when absent), the type
//! the compile settled for a template port (`Compiled::port_type`) is the
//! value type its cell holds in the loaded document, in a build at every
//! count from 0 to 4 of every repeat, and in the abstract build.

use std::path::Path;
use std::sync::Arc;

use cells_core::build::{ScopeId, build};
use cells_core::session::{Counts, Session};
use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::{Compiled, Document, LoadOptions, ValueType};

const COUNTS: std::ops::RangeInclusive<u32> = 0..=4;

#[test]
fn every_port_holds_what_its_type_says_in_every_build() {
    let docs = documents();
    assert!(docs.len() >= 12, "the golden set is missing");
    let mut failures = Vec::new();
    let mut checked = 0usize;
    for (name, bytes) in &docs {
        let dast = Arc::new(cells_core::dast::load(bytes).unwrap());
        let Ok(compiled) = cells_core::testing::compile(&dast) else {
            continue; // the promise is about documents that load
        };
        let options = LoadOptions {
            prune: false,
            ..Default::default()
        };
        let Ok((doc, _)) = Document::load(bytes, options) else {
            continue;
        };
        checked += agree(
            name,
            "load",
            &compiled,
            &doc.structure.slot_types,
            &mut failures,
        );
        if doc.loaded.compiled.is_none() {
            continue; // no repeat: one build is every build
        }
        let mut session = Session::new(0);
        for c in COUNTS {
            let Some(built) = build_at(&compiled, &mut session, c) else {
                continue;
            };
            let what = format!("every repeat at {c}");
            checked += agree(
                name,
                &what,
                &compiled,
                &built.structure.slot_types,
                &mut failures,
            );
        }
    }
    assert!(checked > 0, "no port was checked");
    assert!(
        failures.is_empty(),
        "{} ports hold another kind of value than their type says:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

/// Every (scope, template, template slot) of `slot_types` holds what the
/// compile's port type says; returns how many were checked.
fn agree(
    name: &str,
    what: &str,
    compiled: &Compiled,
    slot_types: &[((ScopeId, u32, u32), ValueType)],
    failures: &mut Vec<String>,
) -> usize {
    for &((scope, template, slot), held) in slot_types {
        let typed = compiled.port_type(template as usize, slot).value_type();
        if typed != held {
            failures.push(format!(
                "{name}, {what}: scope {scope} template {template} slot {slot} is typed {typed:?} but holds {held:?}"
            ));
        }
    }
    slot_types.len()
}

/// A build with every repeat at `c` iterations, settled from there as a
/// load settles (the counts its cells give), scheduled; None when the
/// structure does not settle within a load's passes.
fn build_at(compiled: &Arc<Compiled>, session: &mut Session, c: u32) -> Option<Document> {
    let mut counts: std::collections::HashMap<(ScopeId, cells_core::dast::NodeId), u32> =
        Default::default();
    let mut forced = true;
    for _ in 0..9 {
        let mut stamped = Counts::default();
        for (&(scope, node), &n) in &counts {
            stamped.set(scope, node, n);
        }
        let s = Session::new(session.seed);
        let mut doc = build(compiled, &s, &stamped, false)
            .ok()?
            .schedule(compiled.clone())
            .ok()?;
        doc.recompute();
        let mut settled = true;
        for r in &doc.structure.repeats {
            let want = if forced { c } else { doc.repeat_count(r) };
            if r.iterations != want {
                counts.insert((r.scope, r.node), want);
                settled = false;
            }
        }
        if settled {
            return Some(doc);
        }
        forced = false;
    }
    None
}

/// (name, DAST bytes) of every document under test.
fn documents() -> Vec<(String, Vec<u8>)> {
    let root = repo_root();
    let mut sources = doenet_files(&root.join("crates/cells-bench/golden"));
    sources.push(root.join("fixtures/sir.doenet"));
    let mut out: Vec<(String, Vec<u8>)> = sources
        .iter()
        .map(|p| {
            let src = std::fs::read_to_string(p).unwrap();
            (stem(p), dast_json(&src).into_bytes())
        })
        .collect();
    let mut generated: Vec<_> = std::fs::read_dir(root.join("fixtures"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "json"))
        .filter(|p| !out.iter().any(|(n, _)| *n == stem(p)))
        .collect();
    generated.sort();
    for p in generated {
        out.push((stem(&p), std::fs::read(&p).unwrap()));
    }
    out
}

fn doenet_files(dir: &Path) -> Vec<std::path::PathBuf> {
    let mut v: Vec<_> = std::fs::read_dir(dir)
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    v.sort();
    v
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

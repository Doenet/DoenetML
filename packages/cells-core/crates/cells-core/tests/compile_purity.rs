//! The compile depends on the source alone (ADR 0014, ADR 0015): compiled
//! at any seed, a document gives the same templates, plans, boxes and
//! diagnostics. The check builds every option of every select, so no draw
//! decides what it finds. Every golden document, `fixtures/sir.doenet`, the
//! smaller generated fixtures with selects, repeats or choices, and a
//! document whose load once depended on the draw are compiled at several
//! seeds and compared.

use std::path::Path;

use cells_core::dast::{self, Dast};
use cells_core::testing::compile_fingerprint;
use cells_core::testing::test_utils::{dast_json, repo_root};

const SEEDS: [u64; 4] = [0, 1, 2, 7];

/// Generated fixtures small enough to compile several times in a test.
const FIXTURES: &[&str] = &[
    "select-100",
    "repeat-100",
    "wording-100",
    "answers-10",
    "adventure-1",
];

/// A select whose second option cannot build: a draw used to decide
/// whether the load reported it.
const DRAW_DEPENDENT: &str = r#"<point name="p"/>
  <select name="s">
    <option><number name="a">1</number></option>
    <option><number name="a">$p</number></option>
  </select>
  <select name="t" numToSelect="2">
    <option><number name="b">2</number></option>
    <option><math name="b">$p</math></option>
    <option><number name="b">3</number></option>
  </select>"#;

#[test]
fn a_compile_is_the_same_at_every_seed() {
    let docs = documents();
    assert!(docs.len() >= 15, "the golden set is missing");
    for (name, dast) in &docs {
        let at =
            |seed| compile_fingerprint(dast, seed).unwrap_or_else(|e| format!("load error: {e}"));
        let first = at(SEEDS[0]);
        for &seed in &SEEDS[1..] {
            assert!(
                at(seed) == first,
                "{name}: the compile at seed {seed} differs from seed {}",
                SEEDS[0]
            );
        }
    }
}

fn documents() -> Vec<(String, Dast)> {
    let root = repo_root();
    let mut sources: Vec<_> = std::fs::read_dir(root.join("crates/cells-bench/golden"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    sources.sort();
    sources.push(root.join("fixtures/sir.doenet"));
    let mut out: Vec<(String, Dast)> = sources
        .iter()
        .map(|p| (stem(p), parse(&std::fs::read_to_string(p).unwrap())))
        .collect();
    out.push(("draw-dependent".into(), parse(DRAW_DEPENDENT)));
    for f in FIXTURES {
        let p = root.join("fixtures").join(format!("{f}.json"));
        let bytes = std::fs::read(&p)
            .unwrap_or_else(|e| panic!("{}: {e}; run npm run fixtures", p.display()));
        out.push((f.to_string(), dast::load(&bytes).unwrap()));
    }
    out
}

fn parse(src: &str) -> Dast {
    dast::load(dast_json(src).as_bytes()).unwrap()
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

//! The compile depends on the source alone (ADR 0014, ADR 0015): compiled
//! at any seed, a document gives the same templates, plans, boxes and
//! diagnostics. The check builds every option of every select, so no draw
//! decides what it finds. Every golden document, `fixtures/sir.doenet`, the
//! smaller generated fixtures with selects, repeats or choices, and a
//! document whose load once depended on the draw are compiled at several
//! seeds and compared. The generated fixtures are used where `npm run
//! fixtures` has run and skipped where it has not (CI), as in
//! `every_count.rs`: they add volume, not kinds of document, which the
//! committed ones cover.

use std::path::Path;

use cells_core::dast::{self, Dast};
use cells_core::testing::compile_fingerprint;
use cells_core::testing::test_utils::{dast_json, repo_root};

const SEEDS: [u64; 4] = [0, 1, 2, 7];

/// Generated fixtures small enough to compile several times in a test,
/// where they exist.
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

/// A select in every iteration of a repeat: a draw per iteration, which the
/// check builds for every option of every iteration's select.
const SELECT_IN_REPEAT: &str = r#"<numberInput name="n" value="3"/>
  <repeatForSequence name="r" length="$n" valueName="v">
    <select name="s">
      <option><number name="a">$v</number></option>
      <option><number name="a">2 $v</number></option>
      <option><number name="a">$v + 10</number></option>
    </select>
    <number name="b">$s.a + 1</number>
  </repeatForSequence>"#;

#[test]
fn a_compile_is_the_same_at_every_seed() {
    let docs = documents();
    // The golden set, sir and the documents written here.
    assert!(docs.len() >= 14, "the golden set is missing");
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
    out.push(("select-in-repeat".into(), parse(SELECT_IN_REPEAT)));
    for f in FIXTURES {
        let p = root.join("fixtures").join(format!("{f}.json"));
        if let Ok(bytes) = std::fs::read(&p) {
            out.push((f.to_string(), dast::load(&bytes).unwrap()));
        }
    }
    out
}

fn parse(src: &str) -> Dast {
    dast::load(dast_json(src).as_bytes()).unwrap()
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

//! What a student can write (ADR 0018): the census of essential cells
//! against those a student's action can write, over the golden set and
//! `fixtures/sir.doenet`.

use std::path::Path;

use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::{Document, LoadOptions};

/// (name, source) of the golden set and `sir.doenet`.
fn documents() -> Vec<(String, String)> {
    let root = repo_root();
    let mut paths: Vec<_> = std::fs::read_dir(root.join("crates/cells-bench/golden"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    paths.sort();
    paths.push(root.join("fixtures/sir.doenet"));
    paths
        .iter()
        .map(|p: &std::path::PathBuf| {
            let name = Path::new(p).file_stem().unwrap().to_string_lossy();
            (name.into_owned(), std::fs::read_to_string(p).unwrap())
        })
        .collect()
}

fn load(src: &str, classify: bool) -> Document {
    let options = LoadOptions {
        classify,
        ..Default::default()
    };
    Document::load(dast_json(src).as_bytes(), options)
        .unwrap()
        .0
}

/// Every document's essential cells, as before ADR 0018 (every author's
/// value) and as now (what a student's action can write). Context's walk
/// through every input of every operator, an upper bound, counted 164
/// writable on the golden set and 16 on `sir.doenet`.
#[test]
fn census() {
    let (mut golden, mut sir) = ((0, 0), (0, 0));
    for (name, src) in documents() {
        let (before, now) = (load(&src, false).n_essential, load(&src, true).n_essential);
        eprintln!("{name:>12}: {before:>4} essential before, {now:>4} now");
        let total = if name == "sir" { &mut sir } else { &mut golden };
        total.0 += before;
        total.1 += now;
    }
    eprintln!("golden: {golden:?}, sir: {sir:?}");
    // Context counted 226 and 622 when a literal `<number>` was a fixed
    // cell; since one is a value slot (ADR 0018, amended 2026-10-29), the
    // golden set's ten and `sir.doenet`'s seven count among the values.
    assert_eq!(golden.0, 236, "the golden set as Context counted it");
    assert_eq!(sir.0, 629, "sir.doenet as Context counted it");
    assert!(golden.1 > 0 && golden.1 <= 164, "golden set: {golden:?}");
    assert!(sir.1 > 0 && sir.1 <= 16, "sir.doenet: {sir:?}");
}

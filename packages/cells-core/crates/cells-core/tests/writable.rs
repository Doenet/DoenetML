//! What a student can write (ADR 0018): the census of essential cells
//! against those a student's action can write, over the golden set and
//! `fixtures/sir.doenet`.

use std::path::Path;

use cells_core::Document;
use cells_core::testing::test_utils::{dast_json, repo_root};

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

/// Every document's essential and writable cells, beside the upper bound
/// ADR 0018's Context counted by a walk through every input of every
/// operator: 164 writable on the golden set, 16 on `sir.doenet`.
#[test]
fn census() {
    let (mut golden, mut sir) = ((0, 0), (0, 0));
    for (name, src) in documents() {
        let doc = Document::from_bytes(dast_json(&src).as_bytes()).unwrap();
        let (essential, writable) = (doc.n_essential, doc.structure.n_writable);
        eprintln!("{name:>12}: {essential:>4} essential, {writable:>4} writable");
        let total = if name == "sir" { &mut sir } else { &mut golden };
        total.0 += essential;
        total.1 += writable;
    }
    eprintln!("golden: {golden:?}, sir: {sir:?}");
    assert!(golden.1 > 0 && golden.1 <= 164, "golden set: {golden:?}");
    assert!(sir.1 > 0 && sir.1 <= 16, "sir.doenet: {sir:?}");
}

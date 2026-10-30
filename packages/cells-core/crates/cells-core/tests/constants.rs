//! The constants of the golden set and `fixtures/sir.doenet` (ADR 0026,
//! phase 4): per document, at load, how many constants it has, how many of
//! their template slots the compile's record makes document constants and
//! how many scope constants, and how many distinct values the document
//! constants hold, which is what one cell per value would keep. Whether
//! the record is right is `tests/every_count.rs`'s
//! `a_constant_is_the_same_in_every_build`.

use std::collections::HashSet;
use std::path::Path;

use cells_core::build::SlotClass;
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
        .map(|p| {
            let name = Path::new(p).file_stem().unwrap().to_string_lossy();
            (name.into_owned(), std::fs::read_to_string(p).unwrap())
        })
        .collect()
}

#[test]
fn census() {
    let mut total = [0usize; 4];
    for (name, src) in documents() {
        // Pruned, as a browser loads.
        let (doc, _) = Document::load(dast_json(&src).as_bytes(), LoadOptions::default()).unwrap();
        let (mut document, mut scope) = (0, 0);
        let mut values = HashSet::new();
        for &(_, class) in &doc.structure.slot_classes {
            match class {
                SlotClass::Constant {
                    value,
                    document: true,
                } => {
                    document += 1;
                    values.insert(value.to_bits());
                }
                SlotClass::Constant { .. } => scope += 1,
                _ => {}
            }
        }
        // Every constant slot defines a cell of its own; the rest of the
        // constants are no template slot's (an operator's constant, the
        // missing-referent and dead cells).
        assert!(document + scope <= doc.n_const, "{name}");
        eprintln!(
            "{name:>10}: constants {:>5}   document {document:>5} ({:>4} values)   scope {scope:>4}   other {:>4}",
            doc.n_const,
            values.len(),
            doc.n_const - document - scope,
        );
        if name != "sir" {
            total[0] += doc.n_const;
            total[1] += document;
            total[2] += values.len();
            total[3] += scope;
        }
    }
    eprintln!(
        "golden set: constants {}, document {} ({} values), scope {}",
        total[0], total[1], total[2], total[3]
    );
    assert!(total[1] > 0, "no document constant in the golden set");
}

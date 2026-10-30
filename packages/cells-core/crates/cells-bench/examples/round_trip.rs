//! What composed inverses do on real documents (ADR 0026): the round trip
//! of `cells_core::testing::round_trip` on every document of the golden
//! set, `fixtures/sir.doenet` and the smallest fixture of each shape
//! (`cells_bench::script::sources`), or on the documents named on the
//! command line. Every interactive number cell is requested at several
//! values on a fresh copy, an x/y pair as a point group, and each request
//! is classed (exact, projected, unchanged, dropped, rebuilt, unstable),
//! and marked multipath when the essential cell it wrote reaches a
//! requested cell along more than one path.
//!
//! The first table counts each class over everything; the second counts
//! them for each document's props, over every component of a type.
//! `ROUND_TRIP_SHOW=text` also prints every unstable request whose
//! `document: type prop` row contains `text`.
//!
//!   cargo run --release -p cells-bench --example round_trip [-- doc.doenet ...]

use std::collections::BTreeMap;

use cells_bench::script::sources;
use cells_core::testing::round_trip::{Class, sweep};
use cells_core::testing::test_utils::{load, repo_root};

/// Requests by class and whether they are multipath.
type Counts = BTreeMap<(Class, bool), usize>;

/// A class and whether it is multipath, as a column name.
fn column(class: Class, multipath: bool) -> String {
    if multipath {
        format!("{}, multipath", class.name())
    } else {
        class.name().to_string()
    }
}

fn main() {
    let show = std::env::var("ROUND_TRIP_SHOW").ok();
    let named: Vec<String> = std::env::args().skip(1).collect();
    let docs: Vec<(String, std::path::PathBuf)> = if named.is_empty() {
        sources(&repo_root())
    } else {
        named
            .iter()
            .map(|p| {
                let path = std::path::PathBuf::from(p);
                (
                    path.file_stem().unwrap().to_string_lossy().to_string(),
                    path,
                )
            })
            .collect()
    };
    let mut totals = Counts::new();
    // In order of first appearance.
    let mut rows: Vec<(String, Counts)> = Vec::new();
    let mut row_of: BTreeMap<String, usize> = BTreeMap::new();
    for (name, path) in docs {
        let base = match load(&std::fs::read_to_string(&path).unwrap()) {
            Ok(doc) => doc,
            Err(e) => {
                eprintln!("{name}: not loaded: {e}");
                continue;
            }
        };
        for o in sweep(&base) {
            let row = format!("{name}: {}", o.row);
            if o.class == Class::Unstable && show.as_deref().is_some_and(|s| row.contains(s)) {
                eprintln!("{row}: asked {:?}, got {:?}", o.asked, o.got);
            }
            let r = *row_of.entry(row.clone()).or_insert_with(|| {
                rows.push((row, Counts::new()));
                rows.len() - 1
            });
            *totals.entry((o.class, o.multipath)).or_default() += 1;
            *rows[r].1.entry((o.class, o.multipath)).or_default() += 1;
        }
    }
    let n: usize = totals.values().sum();
    println!("| class | requests |\n|---|---:|");
    for (&(class, multipath), k) in &totals {
        println!("| {} | {k} |", column(class, multipath));
    }
    println!("| all | {n} |\n");
    let used: Vec<(Class, bool)> = totals.keys().copied().collect();
    let heads: Vec<String> = used.iter().map(|&(c, m)| column(c, m)).collect();
    println!("| document: type prop | {} |", heads.join(" | "));
    println!("|---|{}", "---:|".repeat(used.len()));
    for (row, counts) in rows {
        let cols: Vec<String> = used
            .iter()
            .map(|c| counts.get(c).map_or(String::new(), |k| k.to_string()))
            .collect();
        println!("| {row} | {} |", cols.join(" | "));
    }
}

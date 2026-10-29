//! What composed inverses do on real documents (ADR 0024): every
//! interactive number cell of the golden documents, `fixtures/sir.doenet`
//! and the smallest fixture of each shape (`cells_bench::script::sources`),
//! or of the documents named on the command line, is requested at several
//! values on a fresh copy of the document. An x/y pair of one component
//! (`x` and `y`, `x1` and `y1`, ...) is requested together, as a point
//! group, as a renderer drags a point. Each request comes out:
//!
//! - **exact**: the cells hold what was asked;
//! - **projected**: they hold something else, and asking again for either
//!   that or the first value changes nothing;
//! - **dropped**: they hold what they held before, and the tick reports
//!   the request dropped (an inverse undefined there, a fixed cell);
//! - **unchanged**: they hold what they held before, and nothing was
//!   dropped: the inverse wrote values that give the same cells back (a
//!   projection onto where they are);
//! - **rebuilt**: the request changed the document's structure;
//! - **unstable**: anything else. Asking again moves the cells.
//!
//! Each class is marked **multipath** when the request wrote an essential
//! cell that reaches a requested cell along more than one path through
//! the program.
//!
//! The first table counts each class over everything; the second counts
//! them for each document's props, over every component of a type. `ROUND_TRIP_SHOW=text` also prints
//! every unstable request whose `document: type prop` row contains `text`.
//!
//!   cargo run --release -p cells-bench --example round_trip [-- doc.doenet ...]

use std::collections::BTreeMap;

use cells_bench::script::sources;
use cells_core::testing::test_utils::{load, repo_root};
use cells_core::{CellIdx, CompIdx, Document, PointRequest, Request, ValueType};

/// Values asked of a single cell.
const SCALARS: [f64; 5] = [-3.7, 0.5, 2.0, 7.25, 100.0];
/// Values asked of a point.
const POINTS: [[f64; 2]; 4] = [[-3.7, 0.5], [2.0, 7.25], [100.0, -2.0], [0.3, 0.3]];

fn close(a: f64, b: f64) -> bool {
    a == b || (a - b).abs() <= 1e-9 * a.abs().max(b.abs()).max(1.0) || (a.is_nan() && b.is_nan())
}

fn all_close(a: &[f64], b: &[f64]) -> bool {
    a.iter().zip(b).all(|(&x, &y)| close(x, y))
}

/// Request `want` of `cells` (one cell, or an x/y pair as a point group):
/// the cells' values after and whether the tick dropped a request, or None
/// when the tick rebuilt the document.
fn ask(doc: &mut Document, cells: &[CellIdx], want: &[f64]) -> Option<(Vec<f64>, bool)> {
    let tick = match *cells {
        [x, y] => doc.request_points(&[PointRequest {
            cells: [x, y],
            values: [want[0], want[1]],
        }]),
        _ => doc.request(&[Request {
            cell: cells[0],
            value: want[0],
        }]),
    };
    (!tick.rebuilt).then(|| {
        let values = cells.iter().map(|c| doc.cells[c.index()]).collect();
        (values, !tick.dropped.is_empty())
    })
}

/// For each cell, how many paths lead to it from `from` through the
/// program, saturating at 2.
fn paths(doc: &Document, from: CellIdx) -> Vec<u8> {
    let mut n = vec![0u8; doc.cells.len()];
    n[from.index()] = 1;
    for ins in &doc.program.instrs {
        let k: u32 = ins
            .op
            .inputs(&doc.program.operands)
            .map(|c| n[c.index()] as u32)
            .sum();
        for o in 0..ins.op.n_out() {
            let out = &mut n[ins.out.index() + o];
            *out = (*out).max(k.min(2) as u8);
        }
    }
    n
}

/// The class of one request on a fresh copy of `base`.
fn classify(base: &Document, target: &[CellIdx], want: &[f64]) -> (&'static str, Vec<f64>) {
    let before: Vec<f64> = target.iter().map(|c| base.cells[c.index()]).collect();
    let mut doc = base.clone();
    let Some((got, dropped)) = ask(&mut doc, target, want) else {
        return ("rebuilt", vec![]);
    };
    let class = if all_close(&got, want) {
        "exact"
    } else if all_close(&got, &before) {
        if dropped { "dropped" } else { "unchanged" }
    } else {
        let lands =
            |again: Option<(Vec<f64>, bool)>| again.is_some_and(|(x, _)| all_close(&x, &got));
        if lands(ask(&mut doc.clone(), target, &got)) && lands(ask(&mut doc.clone(), target, want))
        {
            "projected"
        } else {
            "unstable"
        }
    };
    // Did the request write an essential cell that reaches a requested
    // cell along more than one path?
    let multipath = (0..doc.n_essential).any(|e| {
        doc.cells[e].to_bits() != base.cells[e].to_bits() && {
            let p = paths(base, CellIdx::from_index(e));
            target.iter().any(|c| p[c.index()] > 1)
        }
    });
    let class = match (class, multipath) {
        ("exact", true) => "exact, multipath",
        ("projected", true) => "projected, multipath",
        ("unchanged", true) => "unchanged, multipath",
        ("dropped", true) => "dropped, multipath",
        ("unstable", true) => "unstable, multipath",
        (c, _) => c,
    };
    (class, got)
}

const CLASSES: [&str; 11] = [
    "exact",
    "exact, multipath",
    "projected",
    "projected, multipath",
    "unchanged",
    "unchanged, multipath",
    "dropped",
    "dropped, multipath",
    "rebuilt",
    "unstable",
    "unstable, multipath",
];

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
    let mut totals: BTreeMap<&str, usize> = BTreeMap::new();
    // In order of first appearance.
    let mut rows: Vec<(String, BTreeMap<&str, usize>)> = Vec::new();
    let mut row_of: BTreeMap<String, usize> = BTreeMap::new();
    for (name, path) in docs {
        let base = match load(&std::fs::read_to_string(&path).unwrap()) {
            Ok(doc) => doc,
            Err(e) => {
                eprintln!("{name}: not loaded: {e}");
                continue;
            }
        };
        for c in CompIdx::below(base.components.len()) {
            let ty = base.component_type(c);
            let cells = base.comp_cells(c).to_vec();
            let names: Vec<String> = (0..cells.len())
                .map(|pi| {
                    ty.prop_name(cells.len(), pi)
                        .map(|s| s.to_string())
                        .unwrap_or_default()
                })
                .collect();
            let asked = |pi: usize| {
                base.is_interactive(cells[pi])
                    && base.value_types[cells[pi].index()] == ValueType::Number
            };
            let mut done = vec![false; cells.len()];
            for pi in 0..cells.len() {
                if done[pi] || !asked(pi) {
                    continue;
                }
                done[pi] = true;
                // An x prop with an interactive y of the same suffix is a point.
                let pair = names[pi].strip_prefix('x').and_then(|suffix| {
                    (0..cells.len()).find(|&pj| asked(pj) && names[pj] == format!("y{suffix}"))
                });
                let (target, label) = match pair {
                    Some(pj) => {
                        done[pj] = true;
                        (
                            vec![cells[pi], cells[pj]],
                            format!("({}, {})", names[pi], names[pj]),
                        )
                    }
                    None => (vec![cells[pi]], names[pi].clone()),
                };
                let row = format!("{name}: {} {label}", ty.tag());
                let wants: Vec<Vec<f64>> = match target.len() {
                    2 => POINTS.iter().map(|p| p.to_vec()).collect(),
                    _ => SCALARS.iter().map(|&v| vec![v]).collect(),
                };
                let r = *row_of.entry(row.clone()).or_insert_with(|| {
                    rows.push((row.clone(), BTreeMap::new()));
                    rows.len() - 1
                });
                for want in wants {
                    let (class, got) = classify(&base, &target, &want);
                    if class.starts_with("unstable")
                        && show.as_deref().is_some_and(|s| row.contains(s))
                    {
                        eprintln!("{row}: asked {want:?}, got {got:?}");
                    }
                    *totals.entry(class).or_default() += 1;
                    *rows[r].1.entry(class).or_default() += 1;
                }
            }
        }
    }
    let n: usize = totals.values().sum();
    println!("| class | requests |\n|---|---:|");
    for class in CLASSES {
        if let Some(k) = totals.get(class) {
            println!("| {class} | {k} |");
        }
    }
    println!("| all | {n} |\n");
    let used: Vec<&str> = CLASSES
        .into_iter()
        .filter(|c| totals.contains_key(c))
        .collect();
    println!("| document: type prop | {} |", used.join(" | "));
    println!("|---|{}", "---:|".repeat(used.len()));
    for (row, counts) in rows {
        let cols: Vec<String> = used
            .iter()
            .map(|c| counts.get(c).map_or(String::new(), |k| k.to_string()))
            .collect();
        println!("| {row} | {} |", cols.join(" | "));
    }
}

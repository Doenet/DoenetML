//! Tick times on the synthetic shapes of `cells_bench::shapes`, under
//! several evaluators interleaved tick by tick, each on its own copy of the
//! document: the harness `docs/tick-design-decisions.md` measured each
//! decision with.
//!
//! For each shape and size: a drag to the shape's check value must give the
//! values it names under the first evaluator, and the same cells under
//! every other; then each evaluator's copy has its dragged coordinate
//! alternate between 2 and 3, 3 warm-up ticks and `CELLS_TICKS` (default
//! 41) timed ticks per evaluator, after which every cell must again agree.
//! The table gives the median ticks, and each evaluator's over the first's.
//! `CELLS_OUT=file` also appends one JSON record per row, with every sample
//! (`<evaluator>_ns`) and a fingerprint of the first evaluator's values
//! after the check drag, which `scripts/tick-diff.sh` compares across
//! commits.
//!
//! - `CELLS_SHAPES=depth,chain10`: shapes (default `shapes::SHAPES`).
//! - `CELLS_SIZES=1000,10000`: sizes (default 1,000, 10,000 and 100,000).
//! - `CELLS_EVALUATORS`: from `dirty` and `full` (the core's); default
//!   `dirty,full`. An evaluator to compare is added to `evaluator`.
//!
//!   cargo run --release -p cells-bench --example tick_cost

use std::io::Write as _;
use std::time::{Duration, Instant};

use cells_bench::shapes::{SHAPES, cell, fingerprint, load, shape};
use cells_core::{DirtyClosure, Document, Evaluator, FullRecompute, Request};

fn evaluator(name: &str, doc: &Document) -> Box<dyn Evaluator> {
    match name {
        "dirty" => Box::new(DirtyClosure::new(&doc.program, doc.cells.len())),
        "full" => Box::new(FullRecompute),
        _ => panic!("no evaluator {name}"),
    }
}

fn median(xs: &[Duration]) -> Duration {
    let mut xs = xs.to_vec();
    xs.sort();
    xs[xs.len() / 2]
}

fn us(d: Duration) -> String {
    format!("{:.1}", d.as_secs_f64() * 1e6)
}

fn list<T: std::str::FromStr>(var: &str, default: Vec<T>) -> Vec<T>
where
    T::Err: std::fmt::Debug,
{
    std::env::var(var).ok().map_or(default, |s| {
        s.split(',').map(|x| x.trim().parse().unwrap()).collect()
    })
}

/// Panics unless every copy holds the first's values.
fn agree(docs: &[Document], names: &[String], what: &str) {
    for (k, d) in docs.iter().enumerate().skip(1) {
        for (c, (&x, &y)) in docs[0].cells.iter().zip(&d.cells).enumerate() {
            assert!(
                x.to_bits() == y.to_bits(),
                "{what}: {} and {} disagree at cell {c}: {x} against {y}",
                names[0],
                names[k]
            );
        }
    }
}

fn main() {
    let shapes: Vec<String> = list(
        "CELLS_SHAPES",
        SHAPES.iter().map(|s| s.to_string()).collect(),
    );
    let sizes: Vec<usize> = list("CELLS_SIZES", vec![1000, 10000, 100000]);
    let names: Vec<String> = list("CELLS_EVALUATORS", vec!["dirty".into(), "full".into()]);
    let ticks: usize = std::env::var("CELLS_TICKS")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(41);
    let mut out = std::env::var("CELLS_OUT").ok().map(|p| {
        std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(p)
            .unwrap()
    });
    let mut head = "| shape | n | instructions |".to_string();
    let mut rule = "|---|---:|---:|".to_string();
    for e in &names {
        head += &format!(" {e} (µs) |");
        rule += "---:|";
    }
    for e in &names[1..] {
        head += &format!(" {e} / {} |", names[0]);
        rule += "---:|";
    }
    println!("{head}\n{rule}");
    for name in &shapes {
        for &n in &sizes {
            let s = shape(name, n).unwrap_or_else(|| panic!("no shape {name}"));
            let base = load(s.elements);
            let drag = cell(&base, s.drag);
            let what = format!("{name}-{n}");
            let m = names.len();
            let mut evs: Vec<Box<dyn Evaluator>> =
                names.iter().map(|e| evaluator(e, &base)).collect();
            let mut docs: Vec<Document> = (0..m).map(|_| base.clone()).collect();

            // The shape computes what it says, and every evaluator
            // reads the same values.
            let (check, values) = &s.check;
            let req = [Request {
                cell: drag,
                value: *check,
            }];
            for (d, ev) in docs.iter_mut().zip(&mut evs) {
                d.request_with(ev.as_mut(), &req, &[]);
            }
            for (path, v) in values {
                let got = docs[0].cells[cell(&docs[0], path).index()];
                assert_eq!(got, *v, "{what}: {path}");
            }
            agree(&docs, &names, &what);
            let print = fingerprint(&docs[0]);

            let mut times = vec![Vec::new(); m];
            let mut x = vec![2.0; m];
            for k in 0..m * (ticks + 3) {
                let j = k % m;
                let req = [Request {
                    cell: drag,
                    value: x[j],
                }];
                let t = Instant::now();
                let tick = docs[j].request_with(evs[j].as_mut(), &req, &[]);
                let dt = t.elapsed();
                assert!(!tick.changed.is_empty() && !tick.rebuilt);
                if k >= 3 * m {
                    times[j].push(dt);
                }
                x[j] = if x[j] == 2.0 { 3.0 } else { 2.0 };
            }
            agree(&docs, &names, &what);

            let meds: Vec<Duration> = times.iter().map(|t| median(t)).collect();
            let mut row = format!("| {name} | {n} | {} |", base.program.len());
            for d in &meds {
                row += &format!(" {} |", us(*d));
            }
            for d in &meds[1..] {
                row += &format!(" {:.2} |", d.as_secs_f64() / meds[0].as_secs_f64());
            }
            println!("{row}");
            if let Some(out) = &mut out {
                record(out, name, n, &base, print, &names, &times);
            }
        }
    }
}

fn record(
    out: &mut std::fs::File,
    name: &str,
    n: usize,
    doc: &Document,
    print: u64,
    names: &[String],
    times: &[Vec<Duration>],
) {
    let mut line = serde_json::json!({
        "shape": name,
        "n": n,
        "instructions": doc.program.len(),
        "cells": doc.cells.len(),
        "fingerprint": format!("{print:016x}"),
    });
    for (e, t) in names.iter().zip(times) {
        line[format!("{e}_ns")] = t.iter().map(|d| d.as_nanos() as u64).collect();
    }
    writeln!(out, "{line}").unwrap();
}

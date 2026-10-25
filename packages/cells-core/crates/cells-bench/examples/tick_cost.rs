//! Tick times on the synthetic shapes of `cells_bench::shapes`, under
//! several evaluators interleaved tick by tick on the same document: what
//! `docs/tick-design-decisions.md` measures each decision with.
//!
//! For each shape and size: the document is loaded; a drag to the shape's
//! check value must give the values it names, and the same cells under
//! every evaluator; then the dragged coordinate alternates between 2 and 3,
//! 3 warm-up ticks and `CELLS_TICKS` (default 41) timed ticks per
//! evaluator. The table gives the median ticks, and each evaluator's over
//! the first's. `CELLS_OUT=file` also appends one JSON record per row, with
//! every sample (`<evaluator>_ns`) and a fingerprint of the values after
//! the check drag, which `scripts/tick-diff.sh` compares across commits.
//!
//! `CELLS_SHAPES=depth,chain10` picks shapes (default `shapes::SHAPES`),
//! `CELLS_SIZES=1000,10000` sizes (default 1,000, 10,000 and 100,000),
//! `CELLS_EVALUATORS` evaluators from `dirty`, `full`, `pull` and
//! `pull_invalidated` (`cells_bench::pull`; default `dirty,full`).
//!
//!   cargo run --release -p cells-bench --example tick_cost

use std::io::Write as _;
use std::time::{Duration, Instant};

use cells_bench::pull::{Pull, PullInvalidated};
use cells_bench::shapes::{SHAPES, cell, fingerprint, load, shape};
use cells_core::{DirtyClosure, Document, Evaluator, FullRecompute, Request};

fn evaluator(name: &str, doc: &Document) -> Box<dyn Evaluator> {
    match name {
        "dirty" => Box::new(DirtyClosure::new(&doc.program, doc.cells.len())),
        "full" => Box::new(FullRecompute),
        "pull" => Box::new(Pull::default()),
        "pull_invalidated" => Box::new(PullInvalidated::default()),
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

fn main() {
    let shapes: Vec<String> = list(
        "CELLS_SHAPES",
        SHAPES.iter().map(|s| s.to_string()).collect(),
    );
    let sizes: Vec<usize> = list("CELLS_SIZES", vec![1000, 10000, 100000]);
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
    let names: Vec<String> = list("CELLS_EVALUATORS", vec!["dirty".into(), "full".into()]);
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
            let mut doc = load(s.elements);
            let drag = cell(&doc, s.drag);
            let mut evs: Vec<Box<dyn Evaluator>> =
                names.iter().map(|e| evaluator(e, &doc)).collect();

            // The shape computes what it says, the same under every evaluator.
            let (check, values) = &s.check;
            let req = [Request {
                cell: drag,
                value: *check,
            }];
            let mut first = doc.clone();
            first.request_with(evs[0].as_mut(), &req, &[]);
            for (k, ev) in evs.iter_mut().enumerate().skip(1) {
                let mut other = doc.clone();
                other.request_with(ev.as_mut(), &req, &[]);
                assert!(
                    first
                        .cells
                        .iter()
                        .zip(&other.cells)
                        .all(|(x, y)| x.to_bits() == y.to_bits()),
                    "{name}-{n}: {} and {} disagree",
                    names[0],
                    names[k]
                );
            }
            for (path, want) in values {
                let got = first.cells[cell(&first, path) as usize];
                assert_eq!(got, *want, "{name}-{n}: {path}");
            }
            let print = fingerprint(&first);
            drop(first);

            let m = evs.len();
            let mut times = vec![Vec::new(); m];
            let mut x = 2.0;
            for k in 0..m * (ticks + 3) {
                let which = k % m;
                let req = [Request {
                    cell: drag,
                    value: x,
                }];
                let t = Instant::now();
                let tick = doc.request_with(evs[which].as_mut(), &req, &[]);
                let dt = t.elapsed();
                assert!(!tick.changed.is_empty() && !tick.rebuilt);
                if k >= 3 * m {
                    times[which].push(dt);
                }
                x = if x == 2.0 { 3.0 } else { 2.0 };
            }
            let meds: Vec<Duration> = times.iter().map(|t| median(t)).collect();
            let mut row = format!("| {name} | {n} | {} |", doc.program.len());
            for d in &meds {
                row += &format!(" {} |", us(*d));
            }
            for d in &meds[1..] {
                row += &format!(" {:.2} |", d.as_secs_f64() / meds[0].as_secs_f64());
            }
            println!("{row}");
            if let Some(out) = &mut out {
                record(out, name, n, &doc, print, &names, &times);
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

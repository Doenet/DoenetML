//! Tick times on the synthetic shapes of `cells_bench::shapes`, under both
//! evaluators, the two interleaved tick by tick on the same document: what
//! `docs/tick-design-decisions.md` measures each decision with.
//!
//! For each shape and size: the document is loaded; a drag to the shape's
//! check value must give the values it names, and the same cells under
//! both evaluators; then the dragged coordinate alternates between 2 and 3,
//! 3 warm-up ticks and `CELLS_TICKS` (default 41) timed ticks per
//! evaluator. The table gives the median ticks. `CELLS_OUT=file` also
//! appends one JSON record per row, with every sample and a fingerprint of
//! the values after the check drag, which `scripts/tick-diff.sh` compares
//! across commits.
//!
//! `CELLS_SHAPES=depth,chain10` picks shapes (default `shapes::SHAPES`),
//! `CELLS_SIZES=1000,10000` sizes (default 1,000, 10,000 and 100,000).
//!
//!   cargo run --release -p cells-bench --example tick_cost

use std::io::Write as _;
use std::time::{Duration, Instant};

use cells_bench::shapes::{SHAPES, cell, fingerprint, load, shape};
use cells_core::{DirtyClosure, Document, Evaluator, FullRecompute, Request};

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
    println!(
        "| shape | n | instructions | dirty closure (µs) | full recompute (µs) | full / dirty |"
    );
    println!("|---|---:|---:|---:|---:|---:|");
    for name in &shapes {
        for &n in &sizes {
            let s = shape(name, n).unwrap_or_else(|| panic!("no shape {name}"));
            let mut doc = load(s.elements);
            let drag = cell(&doc, s.drag);
            let mut dirty: Box<dyn Evaluator> =
                Box::new(DirtyClosure::new(&doc.program, doc.cells.len()));
            let mut full: Box<dyn Evaluator> = Box::new(FullRecompute);

            // The shape computes what it says, the same under both.
            let (check, values) = &s.check;
            let req = [Request {
                cell: drag,
                value: *check,
            }];
            let mut a = doc.clone();
            let mut b = doc.clone();
            a.request_with(dirty.as_mut(), &req, &[]);
            b.request_with(full.as_mut(), &req, &[]);
            assert!(
                a.cells
                    .iter()
                    .zip(&b.cells)
                    .all(|(x, y)| x.to_bits() == y.to_bits()),
                "{name}-{n}: the evaluators disagree"
            );
            for (path, want) in values {
                let got = a.cells[cell(&a, path) as usize];
                assert_eq!(got, *want, "{name}-{n}: {path}");
            }
            let print = fingerprint(&a);
            drop((a, b));

            let mut times = [Vec::new(), Vec::new()];
            let mut x = 2.0;
            for k in 0..2 * (ticks + 3) {
                let which = k % 2;
                let ev = if which == 0 {
                    dirty.as_mut()
                } else {
                    full.as_mut()
                };
                let req = [Request {
                    cell: drag,
                    value: x,
                }];
                let t = Instant::now();
                let tick = doc.request_with(ev, &req, &[]);
                let dt = t.elapsed();
                assert!(!tick.changed.is_empty() && !tick.rebuilt);
                if k >= 6 {
                    times[which].push(dt);
                }
                x = if x == 2.0 { 3.0 } else { 2.0 };
            }
            let (d, f) = (median(&times[0]), median(&times[1]));
            println!(
                "| {name} | {n} | {} | {} | {} | {:.2} |",
                doc.program.len(),
                us(d),
                us(f),
                f.as_secs_f64() / d.as_secs_f64()
            );
            if let Some(out) = &mut out {
                record(out, name, n, &doc, print, &times);
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
    times: &[Vec<Duration>; 2],
) {
    let ns = |t: &Vec<Duration>| t.iter().map(|d| d.as_nanos() as u64).collect::<Vec<_>>();
    let line = serde_json::json!({
        "shape": name,
        "n": n,
        "instructions": doc.program.len(),
        "cells": doc.cells.len(),
        "fingerprint": format!("{print:016x}"),
        "dirty_ns": ns(&times[0]),
        "full_ns": ns(&times[1]),
    });
    writeln!(out, "{line}").unwrap();
}

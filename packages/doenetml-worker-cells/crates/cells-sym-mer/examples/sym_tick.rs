//! Plan 5: tick times of the symbolic fixtures with engine A and engine R,
//! natively. Per fixture and engine: load time, then each interaction
//! averaged over many ticks, with the symbolic instructions that actually
//! ran per tick (the cutoff measurement) and the engine's growth.
//!
//! Interactions:
//! - `answers-N`: a keystroke in the middle mathInput (parse + request on its
//!   `expr`), and a submit of that answer;
//! - `curves-N`: a drag of the shared coefficient `a`, and of `b0`;
//! - `symchain-N`: a keystroke in `mi`, and a drag of `t`.
//!
//! Every keystroke types a different expression, so neither engine can
//! reuse an earlier one: the honest worst case for growth.
//!
//!     cargo run --release -p cells-sym-mer --example sym_tick [-- spec ...]
//!
//! Fixtures come from `scripts/gen-fixtures.sh`. Set `SYM_TICK_OUT` to write
//! JSON (default `results/raw/plan5-tick-native.json`).

use std::time::Instant;

use cells_core::{DirtyClosure, Document, Evaluator, FullRecompute, LoadOptions, Request};
use cells_sym::SymEngine;
use cells_sym::flat::Flat;
use cells_sym_mer::Mer;
use serde_json::{Value, json};

const DEFAULT: &[&str] = &[
    "answers-10",
    "answers-100",
    "answers-1000",
    "answers-10000",
    "curves-10",
    "curves-100",
    "curves-1000",
    "symchain-10",
    "symchain-100",
    "symchain-1000",
    "symchain-10000",
];

fn engine(name: &str) -> Box<dyn SymEngine> {
    if name == "A" {
        Box::new(Flat::new())
    } else {
        Box::new(Mer::new())
    }
}

/// One kind of tick, run `reps` times: returns the request for tick `i`
/// (after any untimed setup it needs).
type Make = Box<dyn FnMut(&mut Document, usize) -> Vec<Request>>;

fn interactions(spec: &str, doc: &Document) -> Vec<(&'static str, Make, bool)> {
    let shape = spec.split('-').next().unwrap();
    let n: usize = spec.split('-').nth(1).unwrap().parse().unwrap();
    let cell = |name: String, prop: &str| doc.cell(&name, prop).unwrap();
    match shape {
        "answers" => {
            let k = n / 2;
            let expr = cell(format!("mi{k}"), "expr");
            let submitted = cell(format!("a{k}"), "submitted");
            let correct = cells_docgen::correct_answer(k);
            vec![
                // The parse is part of the keystroke's cost (timed: `true`).
                (
                    "keystroke",
                    Box::new(move |d: &mut Document, i: usize| {
                        vec![Request {
                            cell: expr,
                            value: d.parse_math(&format!("x^2+{i}x+1")).unwrap(),
                        }]
                    }) as Make,
                    true,
                ),
                (
                    "submit",
                    Box::new(move |d: &mut Document, i: usize| {
                        // Untimed: type a right or a wrong answer first.
                        let text = if i % 2 == 0 {
                            correct.clone()
                        } else {
                            format!("{correct}+{i}")
                        };
                        let h = d.parse_math(&text).unwrap();
                        d.request(&[Request {
                            cell: expr,
                            value: h,
                        }]);
                        vec![Request {
                            cell: submitted,
                            value: d.cells[expr as usize],
                        }]
                    }),
                    false,
                ),
            ]
        }
        "curves" => {
            let (a, b0) = (cell("a".into(), "value"), cell("b0".into(), "value"));
            vec![
                (
                    "drag a",
                    Box::new(move |_: &mut Document, i: usize| {
                        vec![Request {
                            cell: a,
                            value: 1.0 + (i % 100) as f64 * 0.01,
                        }]
                    }) as Make,
                    false,
                ),
                (
                    "drag b0",
                    Box::new(move |_: &mut Document, i: usize| {
                        vec![Request {
                            cell: b0,
                            value: (i % 100) as f64 * 0.01,
                        }]
                    }),
                    false,
                ),
            ]
        }
        "symchain" => {
            let (mi, t) = (cell("mi".into(), "expr"), cell("t".into(), "value"));
            vec![
                (
                    "keystroke",
                    Box::new(move |d: &mut Document, i: usize| {
                        vec![Request {
                            cell: mi,
                            value: d.parse_math(&format!("x^2+{i}")).unwrap(),
                        }]
                    }) as Make,
                    true,
                ),
                (
                    "drag t",
                    Box::new(move |_: &mut Document, i: usize| {
                        vec![Request {
                            cell: t,
                            value: 1.0 + i as f64 * 1e-4,
                        }]
                    }),
                    false,
                ),
            ]
        }
        _ => panic!("not a symbolic fixture: {spec}"),
    }
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let specs: Vec<String> = if args.is_empty() {
        DEFAULT.iter().map(|s| s.to_string()).collect()
    } else {
        args
    };
    let mut rows = Vec::new();
    for spec in &specs {
        let bytes = std::fs::read(cells_bench_dir().join(format!("{spec}.cdast")))
            .unwrap_or_else(|_| panic!("no fixture {spec}; run scripts/gen-fixtures.sh {spec}"));
        for name in ["A", "R"] {
            let t = Instant::now();
            let base = Document::load(
                &bytes,
                LoadOptions {
                    engine: Some(engine(name)),
                    ..Default::default()
                },
            )
            .unwrap()
            .0;
            let load = t.elapsed().as_secs_f64() * 1e3;
            let n_sym = base
                .program
                .instrs
                .iter()
                .filter(|i| matches!(i.op, cells_core::program::Op::Sym(..)))
                .count();
            let mut row = json!({ "spec": spec, "engine": name, "cells": base.cells.len(), "instrs": base.program.len(), "sym_instrs": n_sym, "load_ms": load });
            print!(
                "{spec:16} {name} cells {:7} instrs {:6} sym {:6} load {load:8.1} ms",
                base.cells.len(),
                base.program.len(),
                n_sym
            );
            for evaluator in ["full", "closure"] {
                let mut doc = base.clone();
                for (what, mut make, timed_setup) in interactions(spec, &doc) {
                    let mut ev: Box<dyn Evaluator> = if evaluator == "full" {
                        Box::new(FullRecompute)
                    } else {
                        Box::new(DirtyClosure::new(&doc.program, doc.cells.len()))
                    };
                    // Fewer reps where one tick is slow.
                    let reps = if spec.ends_with("-10000")
                        || spec.ends_with("-3400")
                        || spec.ends_with("-4300")
                        || spec == "curves-1000"
                    {
                        20
                    } else {
                        200
                    };
                    // Runs and growth are counted over what is timed only
                    // (an untimed setup request is not part of the tick).
                    // `len` is O(1) in both engines; R's `heap_bytes` walks
                    // every expression, so it is read outside the loop and
                    // the growth in bytes is scaled from nodes.
                    let size = |d: &Document| {
                        (
                            d.program.sym.engine.borrow().len() as f64,
                            d.program.sym.stats.get().runs as f64,
                        )
                    };
                    let (len0, bytes0) = {
                        let e = doc.program.sym.engine.borrow();
                        (e.len() as f64, e.heap_bytes() as f64)
                    };
                    let (mut total, mut changed, mut runs, mut grow) = (0.0, 0usize, 0.0, 0.0);
                    let mut first_half = 0.0;
                    for i in 0..reps {
                        let before = size(&doc);
                        let t = Instant::now();
                        let reqs = make(&mut doc, i);
                        let (start, before) = if timed_setup {
                            (t, before)
                        } else {
                            (Instant::now(), size(&doc))
                        };
                        let tick = doc.request_with_groups(ev.as_mut(), &reqs, &[]);
                        total += start.elapsed().as_secs_f64() * 1e3;
                        if i + 1 == reps / 2 {
                            first_half = total;
                        }
                        let after = size(&doc);
                        changed += tick.changed.len();
                        grow += after.0 - before.0;
                        runs += after.1 - before.1;
                    }
                    let (len1, bytes1) = {
                        let e = doc.program.sym.engine.borrow();
                        (e.len() as f64, e.heap_bytes() as f64)
                    };
                    let grow_bytes = if len1 > len0 {
                        (bytes1 - bytes0) / (len1 - len0) * grow
                    } else {
                        0.0
                    };
                    let reps_f = reps as f64;
                    let (ms, runs, grow) = (total / reps_f, runs / reps_f, grow / reps_f);
                    // A tick that slows as the engine grows shows here.
                    let drift = (total - first_half) / first_half.max(1e-9);
                    if evaluator == "full" {
                        print!(
                            " | {what}: {ms:8.3} ms, {runs:7.1} runs, +{grow:6.1} nodes, drift {drift:4.2}"
                        );
                    }
                    row[format!("{evaluator}:{what}")] = json!({ "ms": ms, "sym_runs": runs, "changed": changed as f64 / reps as f64, "nodes_per_tick": grow, "bytes_per_tick": grow_bytes / reps_f, "second_half_over_first": drift });
                }
            }
            println!();
            rows.push(row);
        }
    }
    let out = std::env::var("SYM_TICK_OUT")
        .unwrap_or_else(|_| "results/raw/plan5-tick-native.json".into());
    std::fs::write(
        &out,
        serde_json::to_string_pretty(&Value::Array(rows)).unwrap(),
    )
    .unwrap();
    eprintln!("wrote {out}");
}

fn cells_bench_dir() -> std::path::PathBuf {
    std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../fixtures")
}

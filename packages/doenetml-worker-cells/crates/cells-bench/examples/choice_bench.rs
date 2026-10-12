//! Plan 6 measurements: per fixture, load time and passes, heap estimate,
//! the median tick that flips every choice, and the median tick of a drag
//! no choice reads. JSON lines. Usage: `choice_bench <reps> <spec>...`.
//! (The plan 6 runs also forced the rebuild mechanism, since removed; their
//! numbers are in `results/NOTES.md`.)
use cells_core::{Document, Request};
use std::time::Instant;

/// The input that flips every choice, and the two values it alternates.
fn flip_input(spec: &str) -> Option<(&'static str, [f64; 2])> {
    match spec.split('-').next().unwrap() {
        "wording" | "wordingflat" => Some(("n", [1.0, -1.0])),
        "adventure" => Some(("path", [1.0, 2.0])),
        "choicesweep" | "choicecurves" => Some(("n", [1.0, 2.0])),
        _ => None,
    }
}

fn main() {
    let mut args = std::env::args().skip(1);
    let reps: usize = args.next().and_then(|s| s.parse().ok()).unwrap_or(20);
    for spec in args {
        let bytes = cells_bench::fixture_bytes(&spec);
        let mut loads = Vec::new();
        let mut passes = 0;
        for _ in 0..reps.clamp(3, 7) {
            let t = Instant::now();
            let (doc, timings) = Document::load(&bytes, Default::default()).unwrap();
            loads.push(t.elapsed().as_secs_f64() * 1e3);
            passes = timings.passes;
            std::hint::black_box(doc);
        }
        let mut doc = Document::from_bytes(&bytes).unwrap();
        let m_est = doc.memory_estimate();
        let (cells, instrs, comps) = (doc.cells.len(), doc.program.len(), doc.n_components());
        let mut flips = Vec::new();
        let mut rebuilt = false;
        if let Some((input, values)) = flip_input(&spec) {
            for i in 0..reps {
                let cell = doc.cell(input, "value").unwrap();
                let t = Instant::now();
                let tick = doc.request(&[Request {
                    cell,
                    value: values[(i + 1) % 2],
                }]);
                flips.push(t.elapsed().as_secs_f64() * 1e3);
                rebuilt |= tick.rebuilt;
                assert!(
                    tick.rebuild_error.is_none(),
                    "{spec}: {:?}",
                    tick.rebuild_error
                );
            }
        }
        let mut drags = Vec::new();
        if let Some(target) = doc.cell("p0", "x") {
            for i in 0..reps {
                let t = Instant::now();
                std::hint::black_box(doc.request(&[Request {
                    cell: target,
                    value: 3.0 + (i % 2) as f64,
                }]));
                drags.push(t.elapsed().as_secs_f64() * 1e3);
            }
        }
        println!(
            "{}",
            serde_json::json!({
                "spec": spec, "load_ms": cells_bench::median(loads), "passes": passes,
                "bytes": m_est.total(), "cells": cells, "instrs": instrs, "components": comps,
                "flip_ms": cells_bench::median(flips), "flip_rebuilt": rebuilt, "drag_ms": cells_bench::median(drags),
            })
        );
    }
}

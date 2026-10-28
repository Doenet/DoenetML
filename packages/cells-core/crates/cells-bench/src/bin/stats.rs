//! Print per-fixture structural stats as JSON lines: cells, essential,
//! instructions, components, and estimated resident bytes.
use cells_core::Document;

fn main() {
    for (spec, json) in cells_bench::fixtures() {
        let (doc, t) = Document::load(json.as_bytes(), Default::default()).unwrap();
        let m = doc.memory_estimate();
        let bin_bytes = cells_bench::fixture_binary(&spec).map_or(0, |b| b.len());
        println!(
            "{}",
            serde_json::json!({
                "spec": spec,
                "json_bytes": json.len(),
                "binary_bytes": bin_bytes,
                "cells": doc.cells.len(),
                "essential": doc.n_essential,
                "instrs": doc.program.len(),
                "components": doc.n_components(),
                "bytes_cells": m.cells,
                "bytes_program": m.program,
                "bytes_components": m.components,
                "bytes_strings": m.strings,
                "bytes_total": m.total(),
                "load_ms": {
                    "deserialize": t.deserialize.as_secs_f64() * 1e3,
                    "build": t.build.as_secs_f64() * 1e3,
                    "schedule": t.schedule.as_secs_f64() * 1e3,
                    "initial_compute": t.initial_compute.as_secs_f64() * 1e3,
                },
            })
        );
    }
}

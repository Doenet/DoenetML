//! Median load time, median drag tick and heap estimate per fixture, as JSON
//! lines, for comparing two commits on the same machine (plan 6's
//! no-regression check). Usage: `regress <reps> <spec>...`.
use cells_core::{Document, Request};
use std::time::Instant;

fn main() {
    let mut args = std::env::args().skip(1);
    let reps: usize = args.next().and_then(|s| s.parse().ok()).unwrap_or(20);
    for spec in args {
        let bytes = cells_bench::fixture_bytes(&spec);
        let mut loads = Vec::with_capacity(reps);
        for _ in 0..reps.min(10).max(3) {
            let t = Instant::now();
            std::hint::black_box(Document::from_bytes(&bytes).unwrap());
            loads.push(t.elapsed().as_secs_f64() * 1e3);
        }
        let mut doc = Document::from_bytes(&bytes).unwrap();
        let target = cells_bench::drag_target(&doc, &spec)
            .unwrap_or_else(|| panic!("{spec} has nothing to drag"));
        let mut ticks = Vec::with_capacity(reps);
        for i in 0..reps {
            let t = Instant::now();
            std::hint::black_box(doc.request(&[Request {
                cell: target,
                value: 3.0 + (i % 2) as f64,
            }]));
            ticks.push(t.elapsed().as_secs_f64() * 1e3);
        }
        let m = doc.memory_estimate();
        println!(
            "{}",
            serde_json::json!({ "spec": spec, "load_ms": cells_bench::median(loads), "tick_ms": cells_bench::median(ticks), "bytes": m.total() })
        );
    }
}

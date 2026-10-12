//! Rebuild a fixture many times, for profiling the build.
use cells_core::{Document, Request};
fn main() {
    let spec = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "repeat-10000".into());
    let iters: usize = std::env::args()
        .nth(2)
        .and_then(|s| s.parse().ok())
        .unwrap_or(50);
    let json = cells_bench::fixture_json(&spec);
    let mut doc = Document::from_bytes(json.as_bytes()).unwrap();
    let n = doc.value("n", "value").unwrap();
    let t = std::time::Instant::now();
    for i in 0..iters {
        let target = doc.cell("n", "value").unwrap();
        let tick = doc.request(&[Request {
            cell: target,
            value: if i % 2 == 0 { n - 1.0 } else { n },
        }]);
        assert!(tick.rebuilt);
    }
    println!(
        "{spec}: {iters} rebuilds, {:.2} ms each",
        t.elapsed().as_secs_f64() * 1e3 / iters as f64
    );
}

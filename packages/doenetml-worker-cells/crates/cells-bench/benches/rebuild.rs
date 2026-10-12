use cells_core::{DirtyClosure, Document, Request};
use criterion::{BenchmarkId, Criterion, Throughput, criterion_group, criterion_main};

/// A tick that changes a repeat's iteration count: the request, the
/// recompute, and the whole-document rebuild it triggers. Alternates between
/// N and N-1 iterations so every tick rebuilds.
fn rebuild(c: &mut Criterion) {
    for (spec, json) in cells_bench::fixtures() {
        if !spec.starts_with("repeat-") && !spec.starts_with("recur-") {
            continue;
        }
        let base = Document::from_bytes(json.as_bytes()).unwrap();
        let n = base.value("n", "value").unwrap();
        let mut g = c.benchmark_group("rebuild");
        g.sample_size(20)
            .throughput(Throughput::Elements(base.n_components() as u64));
        let mut doc = base.clone();
        let mut ev = DirtyClosure::new(&doc.program, doc.cells.len());
        let mut down = true;
        g.bench_function(BenchmarkId::new("count-change", &spec), |b| {
            b.iter(|| {
                let target = doc.cell("n", "value").unwrap();
                let value = if down { n - 1.0 } else { n };
                down = !down;
                let tick = doc.request_with_groups(
                    &mut ev,
                    &[Request {
                        cell: target,
                        value,
                    }],
                    &[],
                );
                assert!(tick.rebuilt, "{spec}: tick did not rebuild");
                // The evaluator's tables belong to the old program.
                ev = DirtyClosure::new(&doc.program, doc.cells.len());
            })
        });
        g.finish();
    }
}

criterion_group!(benches, rebuild);
criterion_main!(benches);

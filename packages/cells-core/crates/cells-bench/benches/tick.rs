use cells_core::{DirtyClosure, Document, Evaluator, FullRecompute, Request};
use criterion::{BenchmarkId, Criterion, Throughput, criterion_group, criterion_main};

/// One drag step: request a new value on the drag target, invert, recompute.
fn tick(c: &mut Criterion) {
    for (spec, json) in cells_bench::fixtures() {
        let base = Document::from_bytes(json.as_bytes()).unwrap();
        let Some(target) = cells_bench::drag_target(&base, &spec) else {
            continue;
        };
        let mut g = c.benchmark_group("tick");
        g.throughput(Throughput::Elements(base.program.len().max(1) as u64));

        let mut evaluators: Vec<Box<dyn Evaluator>> = vec![
            Box::new(FullRecompute),
            Box::new(DirtyClosure::new(&base.program, base.cells.len())),
        ];
        for ev in evaluators.iter_mut() {
            let mut doc = base.clone();
            let mut step = 0.0f64;
            g.bench_with_input(BenchmarkId::new(ev.name(), &spec), &target, |b, &target| {
                b.iter(|| {
                    // Alternate values so every tick changes the cell.
                    step = if step == 0.0 { 1.0 } else { 0.0 };
                    doc.request_with_groups(
                        ev.as_mut(),
                        &[Request {
                            cell: target,
                            value: 3.0 + step,
                        }],
                        &[],
                    )
                })
            });
        }
        g.finish();
    }
}

criterion_group!(benches, tick);
criterion_main!(benches);

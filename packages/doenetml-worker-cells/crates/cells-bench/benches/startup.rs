use cells_core::Document;
use criterion::{BatchSize, BenchmarkId, Criterion, Throughput, criterion_group, criterion_main};

fn startup(c: &mut Criterion) {
    for (spec, json) in cells_bench::fixtures() {
        let dast = std::sync::Arc::new(cells_core::dast::Dast::from_json(&json).unwrap());
        let doc =
            Document::load_dast(dast.clone(), Default::default(), &mut Default::default()).unwrap();
        let n_cells = doc.cells.len() as u64;
        let binary = cells_bench::fixture_binary(&spec).unwrap_or_else(|| dast.to_binary());

        let mut g = c.benchmark_group("startup");
        g.sample_size(20).throughput(Throughput::Elements(n_cells));
        g.bench_with_input(BenchmarkId::new("deserialize", &spec), &json, |b, json| {
            b.iter(|| cells_core::dast::Dast::from_json(json).unwrap())
        });
        g.bench_with_input(
            BenchmarkId::new("deserialize_binary", &spec),
            &binary,
            |b, bin| b.iter(|| cells_core::dast::Dast::from_binary(bin).unwrap()),
        );
        // One build pass from scratch (repeats at zero iterations); the
        // settled total is in `total_from_*`.
        g.bench_with_input(BenchmarkId::new("build", &spec), &dast, |b, dast| {
            b.iter(|| {
                cells_core::build::build(
                    dast,
                    &Default::default(),
                    &mut cells_sym::flat::Flat::new(),
                )
                .unwrap()
            })
        });
        g.bench_with_input(BenchmarkId::new("schedule", &spec), &dast, |b, dast| {
            b.iter_batched(
                || {
                    let mut e: Box<dyn cells_sym::SymEngine> =
                        Box::new(cells_sym::flat::Flat::new());
                    (
                        cells_core::build::build(dast, &Default::default(), &mut *e).unwrap(),
                        e,
                    )
                },
                |(u, mut e)| u.schedule(dast.clone(), &mut e).unwrap(),
                BatchSize::SmallInput,
            )
        });
        g.bench_with_input(
            BenchmarkId::new("initial_compute", &spec),
            &doc,
            |b, doc| {
                b.iter_batched(
                    || doc.clone(),
                    |mut d| {
                        d.recompute();
                        d
                    },
                    BatchSize::SmallInput,
                )
            },
        );
        g.bench_with_input(
            BenchmarkId::new("total_from_json", &spec),
            &json,
            |b, json| b.iter(|| Document::from_bytes(json.as_bytes()).unwrap()),
        );
        g.bench_with_input(
            BenchmarkId::new("total_from_binary", &spec),
            &binary,
            |b, bin| b.iter(|| Document::from_bytes(bin).unwrap()),
        );
        g.finish();
    }
}

criterion_group!(benches, startup);
criterion_main!(benches);

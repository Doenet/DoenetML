//! Native timings for the SIR simulation (`fixtures/sir.doenet`): load, a
//! drag of the initial-infectives point, typing a parameter, changing the
//! number of iterates (a rebuild), and the reset button.
//!
//! `cargo run --release -p cells-bench --example sir_perf [rounds]`
use cells_core::components::ComponentType;
use cells_core::{
    DirtyClosure, Document, Evaluator, FullRecompute, LoadOptions, PointRequest, Request,
};
use std::time::Instant;

fn ms(t: Instant) -> f64 {
    t.elapsed().as_secs_f64() * 1e3
}

fn stats(name: &str, mut xs: Vec<f64>) {
    xs.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let q = |p: f64| xs[((xs.len() as f64 * p) as usize).min(xs.len() - 1)];
    println!(
        "{name:<34} n={:<4} p50={:>8.3} ms  p90={:>8.3} ms  max={:>8.3} ms",
        xs.len(),
        q(0.5),
        q(0.9),
        xs[xs.len() - 1]
    );
}

fn main() {
    let rounds: usize = std::env::args()
        .nth(1)
        .and_then(|s| s.parse().ok())
        .unwrap_or(50);
    let bytes = cells_bench::fixture_bytes("sir");

    let mut loads = Vec::new();
    let mut doc = None;
    for _ in 0..rounds {
        let t = Instant::now();
        let (d, timings) = Document::load(&bytes, LoadOptions::default()).unwrap();
        loads.push(ms(t));
        if doc.is_none() {
            println!(
                "load stages (first): deserialize {:.2} ms, build {:.2} ms, schedule {:.2} ms, compute {:.2} ms, {} passes",
                timings.deserialize.as_secs_f64() * 1e3,
                timings.build.as_secs_f64() * 1e3,
                timings.schedule.as_secs_f64() * 1e3,
                timings.initial_compute.as_secs_f64() * 1e3,
                timings.passes
            );
        }
        doc = Some(d);
    }
    let mut doc = doc.unwrap();
    let count = |k: ComponentType| {
        (0..doc.n_components() as u32)
            .filter(|&c| doc.component_type(c) == k)
            .count()
    };
    println!(
        "size: {} cells ({} essential, {} fixed), {} instructions, {} components ({} points, {} tuples)",
        doc.cells.len(),
        doc.n_essential,
        doc.n_fixed,
        doc.program.len(),
        doc.n_components(),
        count(ComponentType::Point),
        count(ComponentType::Tuple)
    );
    stats("load (parse DAST to computed)", loads);

    // The infectives' point: the graph's point with styleNumber 2.
    let graph = doc.resolve_path("plot").unwrap();
    let point = doc
        .children(graph)
        .find_map(|k| match k {
            cells_core::Child::Component(c)
                if doc.component_type(c) == ComponentType::Point
                    && doc.attr_text(c, "styleNumber").as_deref() == Some("2") =>
            {
                Some(c)
            }
            _ => None,
        })
        .unwrap();
    let xy = doc.prop_cells(point, "coords").unwrap();
    for (label, mut ev) in [
        (
            "drag I0 point (dirty closure)",
            Box::new(DirtyClosure::new(&doc.program, doc.cells.len())) as Box<dyn Evaluator>,
        ),
        ("drag I0 point (full recompute)", Box::new(FullRecompute)),
    ] {
        let mut ticks = Vec::new();
        let mut changed = 0;
        for i in 0..rounds * 4 {
            let y = 10.0 + (i % 200) as f64 * 5.0;
            let t = Instant::now();
            let out = doc.request_with_groups(
                ev.as_mut(),
                &[],
                &[vec![PointRequest {
                    cells: [xy[0], xy[1]],
                    values: [0.3, y],
                }]],
            );
            ticks.push(ms(t));
            changed = changed.max(out.changed.len());
            assert!(!out.rebuilt);
        }
        stats(label, ticks);
        println!("{:<34} {changed} cells changed per tick", "");
    }

    let typed = |doc: &mut Document, name: &str, text: &str| {
        let h = doc.parse_math(text).unwrap();
        let cell = doc.cell(name, "expr").unwrap();
        doc.request(&[Request { cell, value: h }])
    };
    let mut ticks = Vec::new();
    for i in 0..rounds {
        let t = Instant::now();
        typed(&mut doc, "b", if i % 2 == 0 { "0.00005" } else { "0.0001" });
        ticks.push(ms(t));
    }
    stats("type b (all iterates recompute)", ticks);

    let mut ticks = Vec::new();
    for i in 0..rounds {
        let t = Instant::now();
        let out = typed(
            &mut doc,
            "nIterates",
            if i % 2 == 0 { "199" } else { "200" },
        );
        ticks.push(ms(t));
        assert!(out.rebuilt);
    }
    stats("type nIterates 200<->199 (rebuild)", ticks);

    let reset = (0..doc.n_components() as u32)
        .find(|&c| doc.component_type(c) == ComponentType::TriggerSet)
        .unwrap();
    let mut ticks = Vec::new();
    for _ in 0..rounds {
        typed(&mut doc, "nIterates", "100");
        let t = Instant::now();
        let out = doc.trigger(reset);
        ticks.push(ms(t));
        assert!(out.rebuilt);
    }
    stats("reset button (rebuild to 200)", ticks);
}

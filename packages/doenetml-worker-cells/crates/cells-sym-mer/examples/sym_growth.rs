//! Plan 5: engine growth over a long session. 10,000 keystrokes into `mi`
//! (each a different expression), then 10,000 drags of `t`, through a
//! symbolic chain fixture (default `symchain-100`), with engine A and engine
//! R. Nothing is reclaimed within a session; this measures what that costs.
//!
//!     cargo run --release -p cells-sym-mer --example sym_growth [-- spec]

use std::time::Instant;

use cells_core::{Document, LoadOptions, Request};
use cells_sym::SymEngine;
use cells_sym::flat::Flat;
use cells_sym_mer::Mer;

const STEPS: usize = 10_000;

fn main() {
    let spec = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "symchain-100".into());
    let bytes = std::fs::read(
        std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join(format!("../../fixtures/{spec}.cdast")),
    )
    .unwrap();
    for name in ["A", "R"] {
        let engine: Box<dyn SymEngine> = if name == "A" {
            Box::new(Flat::new())
        } else {
            Box::new(Mer::new())
        };
        let mut doc = Document::load(
            &bytes,
            LoadOptions {
                engine: Some(engine),
                ..Default::default()
            },
        )
        .unwrap()
        .0;
        let (mi, t) = (
            doc.cell("mi", "expr").unwrap(),
            doc.cell("t", "value").unwrap(),
        );
        let report = |doc: &Document, what: &str, ms: f64| {
            let e = doc.program.sym.engine.borrow();
            println!(
                "{spec} {name} {what:28} nodes {:9}  heap {:8.1} MB  mean tick {ms:7.3} ms",
                e.len(),
                e.heap_bytes() as f64 / 1e6
            );
        };
        report(&doc, "after load", 0.0);
        // Time the first and last thousand ticks of each phase separately.
        let phase =
            |doc: &mut Document, f: &dyn Fn(&mut Document, usize) -> Request| -> (f64, f64) {
                let (mut first, mut last) = (0.0, 0.0);
                for i in 0..STEPS {
                    let c = Instant::now();
                    let r = f(doc, i);
                    doc.request(&[r]);
                    let ms = c.elapsed().as_secs_f64() * 1e3;
                    if i < 1000 {
                        first += ms;
                    } else if i >= STEPS - 1000 {
                        last += ms;
                    }
                }
                (first / 1000.0, last / 1000.0)
            };
        let clock = Instant::now();
        let (a, b) = phase(&mut doc, &|d, i| Request {
            cell: mi,
            value: d.parse_math(&format!("x^2+{i}x+1")).unwrap(),
        });
        let typing = clock.elapsed().as_secs_f64();
        report(&doc, &format!("after {STEPS} keystrokes"), b);
        println!("    first 1000 ticks {a:.3} ms, last 1000 {b:.3} ms, phase {typing:.1} s");
        let clock = Instant::now();
        let (a, b) = phase(&mut doc, &|_, i| Request {
            cell: t,
            value: 1.0 + i as f64 * 1e-4,
        });
        let dragging = clock.elapsed().as_secs_f64();
        report(&doc, &format!("after {STEPS} drags"), b);
        println!("    first 1000 ticks {a:.3} ms, last 1000 {b:.3} ms, phase {dragging:.1} s");
    }
}

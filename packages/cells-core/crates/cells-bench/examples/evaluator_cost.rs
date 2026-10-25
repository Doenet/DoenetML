//! What decision 10 of `docs/tick-design-decisions.md` buys: ticks recomputed
//! by the dirty closure against full recompute, on the same document, the
//! two interleaved tick by tick. The shapes are built in Rust
//! (`testing::dast`), so neither the parser nor node is needed:
//!
//! - `depth`, `breadth`: as `packages/benchmark/src/generate.mjs` makes them;
//!   every derived cell is downstream of the dragged point.
//! - `isolated`: the dragged point feeds one number, and n other numbers
//!   are fed by a second point, so the closure is one instruction of n + 1.
//! - `chainK`: the dragged point feeds a chain of K% of the n numbers and
//!   a second point the rest, so the closure is K% of the program. Run with
//!   `CELLS_SHAPES=chain5,chain10,chain25,chain50`.
//!
//! Each tick drags `p` between x = 2 and x = 3. Before timing, the two
//! evaluators' values are checked equal after a drag.
//! `CELLS_SIZES=1000,10000` sets the sizes, `CELLS_TICKS` the timed ticks
//! per evaluator (default 41).
//!
//!   cargo run --release -p cells-bench --example evaluator_cost

use std::sync::Arc;
use std::time::{Duration, Instant};

use cells_core::testing::dast::{Element, Node, build, el, mac};
use cells_core::{
    CellIdx, DirtyClosure, Document, Evaluator, FullRecompute, LoadOptions, LoadTimings, Request,
};

fn point(name: &str, x: &str) -> Element {
    el("point").name(name).attr("x", x).attr("y", "0")
}

fn number(name: &str, of: &str, plus: &str) -> Element {
    el("number")
        .name(name)
        .child(mac(of))
        .text(&format!(" + {plus}"))
}

fn shape(name: &str, n: usize) -> Vec<Element> {
    match name {
        "depth" => {
            let mut v = vec![
                el("graph").name("g").child(point("p", "1")),
                number("c0", "p.x", "1"),
            ];
            for i in 1..n {
                v.push(number(&format!("c{i}"), &format!("c{}", i - 1), "1"));
            }
            v
        }
        "breadth" => {
            let mut v = vec![el("graph").name("g").child(point("p", "1"))];
            for i in 0..n {
                v.push(number(&format!("o{i}"), "p.x", &i.to_string()));
            }
            v
        }
        "isolated" => {
            let mut v = vec![
                el("graph")
                    .name("g")
                    .child(point("p", "1"))
                    .child(point("q", "1")),
                number("a", "p.x", "1"),
            ];
            for i in 0..n {
                v.push(number(&format!("o{i}"), "q.x", &i.to_string()));
            }
            v
        }
        // `chainK`: the dragged point feeds a chain of K% of the n numbers,
        // a second point the rest: the closure is K% of the program.
        _ => {
            let pct: usize = name.strip_prefix("chain").unwrap().parse().unwrap();
            let k = (n * pct / 100).max(1);
            let mut v = vec![
                el("graph")
                    .name("g")
                    .child(point("p", "1"))
                    .child(point("q", "1")),
                number("c0", "p.x", "1"),
            ];
            for i in 1..k {
                v.push(number(&format!("c{i}"), &format!("c{}", i - 1), "1"));
            }
            for i in k..n {
                v.push(number(&format!("o{i}"), "q.x", &i.to_string()));
            }
            v
        }
    }
}

fn load(elements: Vec<Element>) -> Document {
    let mut doc = el("document");
    for e in elements {
        doc = doc.child(e);
    }
    let dast = build([Node::from(doc)]);
    Document::load_dast(
        Arc::new(dast),
        LoadOptions::default(),
        &mut LoadTimings::default(),
    )
    .unwrap()
}

fn cell(doc: &Document, path: &str) -> CellIdx {
    let (comp, prop) = path.split_once('.').unwrap();
    let c = doc.resolve_path(comp).unwrap();
    doc.prop_cells(c, prop).unwrap()[0]
}

fn median(xs: &mut [Duration]) -> Duration {
    xs.sort();
    xs[xs.len() / 2]
}

fn us(d: Duration) -> String {
    format!("{:.1}", d.as_secs_f64() * 1e6)
}

fn main() {
    let sizes: Vec<usize> = std::env::var("CELLS_SIZES")
        .ok()
        .map(|s| s.split(',').map(|x| x.trim().parse().unwrap()).collect())
        .unwrap_or(vec![1000, 10000, 100000]);
    let ticks: usize = std::env::var("CELLS_TICKS")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(41);
    println!(
        "| shape | n | instructions | dirty closure (µs) | full recompute (µs) | full / dirty |"
    );
    println!("|---|---:|---:|---:|---:|---:|");
    let shapes: Vec<String> = std::env::var("CELLS_SHAPES")
        .ok()
        .map(|s| s.split(',').map(|x| x.trim().to_string()).collect())
        .unwrap_or(vec!["depth".into(), "breadth".into(), "isolated".into()]);
    for name in shapes.iter().map(String::as_str) {
        for &n in &sizes {
            let mut doc = load(shape(name, n));
            let px = cell(&doc, "p.x");
            let mut dirty: Box<dyn Evaluator> =
                Box::new(DirtyClosure::new(&doc.program, doc.cells.len()));
            let mut full: Box<dyn Evaluator> = Box::new(FullRecompute);

            // Same values either way, from the same start.
            let mut a = doc.clone();
            let mut b = doc.clone();
            let req = [Request {
                cell: px,
                value: 5.0,
            }];
            a.request_with(dirty.as_mut(), &req, &[]);
            b.request_with(full.as_mut(), &req, &[]);
            assert!(
                a.cells
                    .iter()
                    .zip(&b.cells)
                    .all(|(x, y)| x.to_bits() == y.to_bits()),
                "{name}-{n}: the evaluators disagree"
            );
            drop((a, b));

            let mut times = [Vec::new(), Vec::new()];
            let mut x = 2.0;
            // Three warm-up ticks per evaluator, then the timed ones.
            for k in 0..2 * (ticks + 3) {
                let which = k % 2;
                let ev = if which == 0 {
                    dirty.as_mut()
                } else {
                    full.as_mut()
                };
                let req = [Request { cell: px, value: x }];
                let t = Instant::now();
                let out = doc.request_with(ev, &req, &[]);
                let dt = t.elapsed();
                assert!(!out.changed.is_empty() && !out.rebuilt);
                if k >= 6 {
                    times[which].push(dt);
                }
                x = if x == 2.0 { 3.0 } else { 2.0 };
            }
            let d = median(&mut times[0]);
            let f = median(&mut times[1]);
            println!(
                "| {name} | {n} | {} | {} | {} | {:.2} |",
                doc.program.len(),
                us(d),
                us(f),
                f.as_secs_f64() / d.as_secs_f64()
            );
        }
    }
}

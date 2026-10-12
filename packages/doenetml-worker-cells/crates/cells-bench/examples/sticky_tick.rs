//! Plan 4: the cost of a sticky group. For each fixture, load time and the
//! time of two drags of polygon `p0`: the whole shape (a point group) and
//! one vertex (scalar requests), with full recompute and with the dirty
//! closure. Compare `sticky-N` with `stickyfree-N`, the same polygons with
//! no group.
use cells_core::{DirtyClosure, Document, FullRecompute, PointRequest, Request};
use std::time::{Duration, Instant};

fn main() {
    let specs: Vec<String> = std::env::args().skip(1).collect();
    let specs = if specs.is_empty() {
        vec![
            "stickyfree-100".into(),
            "sticky-100".into(),
            "stickyfree-1000".into(),
            "sticky-1000".into(),
        ]
    } else {
        specs
    };
    for spec in specs {
        let json = cells_bench::fixture_json(&spec);
        let t = Instant::now();
        let base = Document::from_bytes(json.as_bytes()).unwrap();
        let load = t.elapsed();
        let n = base.value("p0", "numVertices").unwrap() as usize;
        let cells: Vec<[u32; 2]> = (1..=n)
            .map(|k| {
                [
                    base.cell("p0", &format!("x{k}")).unwrap(),
                    base.cell("p0", &format!("y{k}")).unwrap(),
                ]
            })
            .collect();
        let at: Vec<[f64; 2]> = cells
            .iter()
            .map(|c| [base.cells[c[0] as usize], base.cells[c[1] as usize]])
            .collect();
        let reps = 300u32;
        let time = |f: &mut dyn FnMut(f64)| -> Duration {
            let t = Instant::now();
            for i in 0..reps {
                f(if i % 2 == 0 { 0.1 } else { 0.0 });
            }
            t.elapsed() / reps
        };
        let mut row = format!(
            "{spec:16} cells {:7} instrs {:6} load {:>9.2?}",
            base.cells.len(),
            base.program.len(),
            load
        );
        for closure in [false, true] {
            let mut doc = base.clone();
            let mut dc = DirtyClosure::new(&doc.program, doc.cells.len());
            let mut whole = |d: f64| {
                let g: Vec<PointRequest> = cells
                    .iter()
                    .zip(&at)
                    .map(|(c, p)| PointRequest {
                        cells: *c,
                        values: [p[0] + d, p[1] + d],
                    })
                    .collect();
                if closure {
                    doc.request_with_groups(&mut dc, &[], &[g])
                } else {
                    doc.request_with_groups(&mut FullRecompute, &[], &[g])
                };
            };
            let w = time(&mut whole);
            let mut doc = base.clone();
            let mut dc = DirtyClosure::new(&doc.program, doc.cells.len());
            let mut one = |d: f64| {
                let r = [
                    Request {
                        cell: cells[0][0],
                        value: at[0][0] + d,
                    },
                    Request {
                        cell: cells[0][1],
                        value: at[0][1] + d,
                    },
                ];
                if closure {
                    doc.request_with_groups(&mut dc, &r, &[])
                } else {
                    doc.request_with_groups(&mut FullRecompute, &r, &[])
                };
            };
            let o = time(&mut one);
            row += &format!(
                "  {}: shape {:>9.2?} vertex {:>9.2?}",
                if closure { "closure" } else { "full" },
                w,
                o
            );
        }
        println!("{row}");
    }
}

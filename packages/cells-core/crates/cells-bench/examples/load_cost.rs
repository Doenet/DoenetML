//! Load time of each `tick_cost` shape and of `fixtures/sir.doenet` (path in
//! `SIR`), as JSON lines: the median of `REPS` loads (default 7). For
//! comparing load across commits (ADR 0026, step 6); the sir source is
//! parsed once, outside the timing.
//!
//! - `CELLS_SHAPES`: which shapes (and `sir`) to run; default all.
//! - `CELLS_SIZES`: element counts; default `10000,100000`.
use cells_bench::shapes::{SHAPES, load, shape};
use std::time::Instant;
fn main() {
    let sizes: Vec<usize> = std::env::var("CELLS_SIZES")
        .unwrap_or("10000,100000".into())
        .split(',')
        .map(|s| s.parse().unwrap())
        .collect();
    let reps: usize = std::env::var("REPS").map_or(7, |r| r.parse().unwrap());
    let med = |mut v: Vec<f64>| {
        v.sort_by(f64::total_cmp);
        v[v.len() / 2]
    };
    let only: Option<Vec<String>> = std::env::var("CELLS_SHAPES")
        .ok()
        .map(|v| v.split(',').map(String::from).collect());
    let want = |s: &str| only.as_ref().is_none_or(|o| o.iter().any(|x| x == s));
    for &name in SHAPES.iter().filter(|s| want(s)) {
        for &n in &sizes {
            let s = shape(name, n).unwrap();
            let t: Vec<f64> = (0..reps)
                .map(|_| {
                    let e = s.elements.clone();
                    let t0 = Instant::now();
                    let d = load(e);
                    let ms = t0.elapsed().as_secs_f64() * 1e3;
                    drop(d);
                    ms
                })
                .collect();
            println!("{{\"shape\":\"{name}\",\"n\":{n},\"ms\":{}}}", med(t));
        }
    }
    if !want("sir") {
        return;
    }
    let src = std::fs::read_to_string(std::env::var("SIR").unwrap()).unwrap();
    let json = cells_core::testing::test_utils::dast_json(&src);
    let t: Vec<f64> = (0..reps)
        .map(|_| {
            let t0 = Instant::now();
            let d = cells_core::Document::from_bytes(json.as_bytes()).unwrap();
            let ms = t0.elapsed().as_secs_f64() * 1e3;
            drop(d);
            ms
        })
        .collect();
    println!("{{\"shape\":\"sir\",\"n\":0,\"ms\":{}}}", med(t));
}

//! Cost of one curve's samples: a compiled tape against engine A's
//! `evaluate_many`, on the shapes `curves` uses.
use cells_sym::flat::Flat;
use cells_sym::tape::Tape;
use cells_sym::{SymEngine, parse::parse};
use std::time::Instant;

fn main() {
    let xs: Vec<f64> = (0..200).map(|i| -5.0 + 10.0 * i as f64 / 199.0).collect();
    let mut out = vec![0.0; 200];
    for text in [
        "1.5 x^2 + 2 x + 3",
        "3 x + 2",
        "sin(1.5 x) e^(x/10) + sqrt(x)",
    ] {
        let tree = parse(text).unwrap();
        let tape = Tape::compile(&tree, "x").unwrap();
        let mut stack = Vec::new();
        let reps = 20000;
        let t = Instant::now();
        for _ in 0..reps {
            tape.eval_many(&[], &xs, &mut out, &mut stack);
            std::hint::black_box(&out);
        }
        let tape_ns = t.elapsed().as_nanos() as f64 / reps as f64;
        let mut a = Flat::new();
        let h = a.import(&tree);
        let t = Instant::now();
        for _ in 0..reps {
            a.evaluate_many(h, "x", &xs, &mut out);
            std::hint::black_box(&out);
        }
        let a_ns = t.elapsed().as_nanos() as f64 / reps as f64;
        println!(
            "{text:32} tape {:6.2} µs ({:4.1} ns/pt)   engine A {:6.2} µs ({:4.1} ns/pt)",
            tape_ns / 1e3,
            tape_ns / 200.0,
            a_ns / 1e3,
            a_ns / 200.0
        );
    }
}

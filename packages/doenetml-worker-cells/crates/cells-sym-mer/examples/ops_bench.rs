//! Per-operation timings for engines A and R, natively, on the corpus in
//! `bench/corpus.json` (Plan 5, "Per operation"). Every timed call runs on a
//! fresh engine with its inputs already parsed, so A's memo tables and
//! hash-consing never answer from an earlier call; the `A hit` column is the
//! same call repeated on a warm engine. Reports the median of many reps.
//!
//!     cargo run --release -p cells-sym-mer --example ops_bench [-- out.json]
//!
//! `bench/ops-node.mjs` times R through `@doenet/math` on the same corpus.

use std::time::{Duration, Instant};

use cells_sym::flat::Flat;
use cells_sym::{Handle, SymEngine};
use cells_sym_mer::Mer;
use serde_json::{Map, Value, json};

const BUDGET: Duration = Duration::from_millis(40);
const MAX_REPS: usize = 5000;

/// Median nanoseconds of `op`, each rep on fresh state from `setup`.
fn time<S>(mut setup: impl FnMut() -> S, mut op: impl FnMut(&mut S)) -> f64 {
    let mut samples = Vec::new();
    let start = Instant::now();
    while samples.len() < 20 || (start.elapsed() < BUDGET && samples.len() < MAX_REPS) {
        let mut s = setup();
        let t = Instant::now();
        op(&mut s);
        samples.push(t.elapsed().as_nanos() as f64);
        std::hint::black_box(&s);
    }
    samples.sort_by(f64::total_cmp);
    samples[samples.len() / 2]
}

fn engine(name: &str) -> Box<dyn SymEngine> {
    match name {
        "A" => Box::new(Flat::new()),
        _ => Box::new(Mer::new()),
    }
}

fn parsed(name: &str, srcs: &[&str]) -> (Box<dyn SymEngine>, Vec<Handle>) {
    let mut e = engine(name);
    let hs = srcs.iter().map(|s| e.parse(s).unwrap()).collect();
    (e, hs)
}

fn strs(v: &Value) -> Vec<String> {
    v.as_array()
        .unwrap()
        .iter()
        .map(|s| s.as_str().unwrap().to_string())
        .collect()
}

fn pairs(v: &Value) -> Vec<(String, String)> {
    v.as_array()
        .unwrap()
        .iter()
        .map(|p| {
            (
                p[0].as_str().unwrap().to_string(),
                p[1].as_str().unwrap().to_string(),
            )
        })
        .collect()
}

fn main() {
    let corpus: Value = serde_json::from_str(include_str!("../bench/corpus.json")).unwrap();
    let xs: Vec<f64> = (0..200).map(|i| 0.1 + 4.0 * i as f64 / 199.0).collect();
    let mut out = Map::new();

    for name in ["A", "R"] {
        let mut ops = Map::new();
        let put = |ops: &mut Map<String, Value>, op: &str, item: String, ns: f64| {
            ops.entry(op)
                .or_insert_with(|| json!({}))
                .as_object_mut()
                .unwrap()
                .insert(item, json!(ns));
        };

        for s in strs(&corpus["parse"]) {
            let ns = time(
                || engine(name),
                |e| {
                    std::hint::black_box(e.parse(&s).unwrap());
                },
            );
            put(&mut ops, "parse", s, ns);
        }
        for (op, key) in [
            ("simplify", "simplify"),
            ("expand", "expand"),
            ("derivative", "derivative"),
        ] {
            for s in strs(&corpus[key]) {
                let run = |e: &mut Box<dyn SymEngine>, h: Handle| match op {
                    "simplify" => e.simplify(h),
                    "expand" => e.expand(h),
                    _ => e.derivative(h, "x"),
                };
                let ns = time(
                    || parsed(name, &[&s]),
                    |(e, hs)| {
                        std::hint::black_box(run(e, hs[0]));
                    },
                );
                put(&mut ops, op, s.clone(), ns);
                if name == "A" && op != "derivative" {
                    // A memo hit: the same call again on a warm engine.
                    let (mut e, hs) = parsed(name, &[&s]);
                    run(&mut e, hs[0]);
                    let ns = time(
                        || (),
                        |_| {
                            std::hint::black_box(run(&mut e, hs[0]));
                        },
                    );
                    put(&mut ops, &format!("{op} (hit)"), s, ns);
                }
            }
        }
        for (op, key) in [("equals", "equals"), ("equals_syntax", "equals_syntax")] {
            for (a, b) in pairs(&corpus[key]) {
                let ns = time(
                    || parsed(name, &[&a, &b]),
                    |(e, hs)| {
                        let r = if op == "equals" {
                            e.equals(hs[0], hs[1])
                        } else {
                            e.equals_syntax(hs[0], hs[1])
                        };
                        std::hint::black_box(r);
                    },
                );
                put(&mut ops, op, format!("{a} = {b}"), ns);
            }
        }
        for s in strs(&corpus["evaluate"]) {
            let ns = time(
                || parsed(name, &[&s]),
                |(e, hs)| {
                    std::hint::black_box(e.evaluate(hs[0], Some(("x", 1.3))));
                },
            );
            put(&mut ops, "evaluate", s, ns);
        }
        for s in strs(&corpus["sample200"]) {
            let mut ys = vec![0.0; xs.len()];
            let ns = time(
                || parsed(name, &[&s]),
                |(e, hs)| {
                    e.evaluate_many(hs[0], "x", &xs, &mut ys);
                    std::hint::black_box(&ys);
                },
            );
            put(&mut ops, "sample200", s, ns);
        }
        out.insert(name.to_string(), Value::Object(ops));
    }

    print_table(&out);
    let path = std::env::args()
        .nth(1)
        .unwrap_or_else(|| "results/raw/plan5-ops-native.json".into());
    std::fs::write(
        &path,
        serde_json::to_string_pretty(&Value::Object(out)).unwrap(),
    )
    .unwrap();
    eprintln!("wrote {path}");
}

fn geomean(m: &Map<String, Value>) -> f64 {
    let logs: Vec<f64> = m.values().map(|v| v.as_f64().unwrap().ln()).collect();
    (logs.iter().sum::<f64>() / logs.len() as f64).exp()
}

fn print_table(out: &Map<String, Value>) {
    println!(
        "{:16} {:>12} {:>12} {:>8}",
        "op (geomean)", "A ns", "R ns", "R/A"
    );
    let a = out["A"].as_object().unwrap();
    let r = out["R"].as_object().unwrap();
    for (op, items) in a {
        let ga = geomean(items.as_object().unwrap());
        match r.get(op) {
            Some(ri) => {
                let gr = geomean(ri.as_object().unwrap());
                println!("{op:16} {ga:12.0} {gr:12.0} {:8.1}", gr / ga);
            }
            None => println!("{op:16} {ga:12.0} {:>12} {:>8}", "-", "-"),
        }
    }
}

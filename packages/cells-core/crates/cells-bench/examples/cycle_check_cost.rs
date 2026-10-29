//! What the probe (ADR 0012, ADR 0015) costs a load: every fixture loaded
//! with the probe's loop checks off and on, interleaved, with the medians
//! printed as a Markdown table; "check" is the whole probe
//! (`LoadTimings::cycle_check`), which every load runs. `CELLS_FIXTURES`
//! restricts the set, `CELLS_ROUNDS` sets the loads per side (default 7).
//!
//!   cargo run --release -p cells-bench --example cycle_check_cost

use std::time::{Duration, Instant};

use cells_core::{Document, LoadOptions};

fn median(xs: &mut [Duration]) -> Duration {
    xs.sort();
    xs[xs.len() / 2]
}

fn ms(d: Duration) -> String {
    format!("{:.2}", d.as_secs_f64() * 1e3)
}

fn main() {
    let rounds: usize = std::env::var("CELLS_ROUNDS")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(7);
    println!(
        "| fixture | load, check off (ms) | load, check on (ms) | check (ms) | check / load off | build, check off (ms) |"
    );
    println!("|---|---:|---:|---:|---:|---:|");
    for (spec, _) in cells_bench::fixtures() {
        let bytes = cells_bench::fixture_bytes(&spec);
        let mut off = Vec::new();
        let mut on = Vec::new();
        let mut check = Vec::new();
        let mut build_off = Vec::new();
        let mut failed = None;
        'rounds: for _ in 0..rounds {
            for check_cycles in [false, true] {
                let clock = Instant::now();
                let r = Document::load(
                    &bytes,
                    LoadOptions {
                        check_cycles,
                        ..Default::default()
                    },
                );
                let total = clock.elapsed();
                match r {
                    Ok((_, t)) => {
                        if check_cycles {
                            on.push(total);
                            check.push(t.cycle_check);
                        } else {
                            off.push(total);
                            build_off.push(t.build);
                        }
                    }
                    Err(e) => {
                        failed = Some(format!("{e}"));
                        break 'rounds;
                    }
                }
            }
        }
        if let Some(e) = failed {
            println!("| {spec} | error: {e} | | | | |");
            continue;
        }
        let (off, on, check, build_off) = (
            median(&mut off),
            median(&mut on),
            median(&mut check),
            median(&mut build_off),
        );
        println!(
            "| {spec} | {} | {} | {} | {:.1}% | {} |",
            ms(off),
            ms(on),
            ms(check),
            100.0 * check.as_secs_f64() / off.as_secs_f64(),
            ms(build_off)
        );
    }
}

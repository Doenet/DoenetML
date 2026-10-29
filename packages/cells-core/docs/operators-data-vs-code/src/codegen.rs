//! A program as Rust source (compiled ahead of time by rustc, the upper
//! bound for "native Rust code") or as JSON (for the node harness).

use std::fmt::Write as _;

use cells_core::program::Op;

use crate::prog::{Prog, inputs};

fn lit(x: f64) -> String {
    format!("f64::from_bits({:#x})", x.to_bits())
}

/// Programs as Rust: for each, `full` with the cutoff as a branch and
/// `full_bl` without branches (select the value to store, always write the
/// changed slot, advance by the comparison), and a table of them.
pub fn rust(progs: &[Prog]) -> String {
    let mut s = String::new();
    s += "#[inline(always)] fn differs(a: f64, b: f64) -> bool { a != b && !(a.is_nan() && b.is_nan()) }\n";
    s += "#[inline(always)] fn nan_min(a: f64, b: f64) -> f64 { if a.is_nan() || b.is_nan() { f64::NAN } else { a.min(b) } }\n";
    s += "#[inline(always)] fn nan_max(a: f64, b: f64) -> f64 { if a.is_nan() || b.is_nan() { f64::NAN } else { a.max(b) } }\n";
    s += "pub type Full = unsafe fn(*mut f64, *mut u32, usize) -> usize;\n";
    let mut table = String::from("pub const PROGS: &[(&str, Full, Full)] = &[\n");
    for (j, p) in progs.iter().enumerate() {
        for bl in [false, true] {
            writeln!(
                s,
                "#[inline(never)] pub unsafe fn p{j}{}(c: *mut f64, ch: *mut u32, mut n: usize) -> usize {{ unsafe {{",
                if bl { "_bl" } else { "" }
            )
            .unwrap();
            for ins in &p.instrs {
                let e = expr(ins);
                let o = ins.out.index();
                if bl {
                    writeln!(
                        s,
                        "let v = {e}; let o = *c.add({o}); let d = differs(v, o); *c.add({o}) = if d {{ v }} else {{ o }}; *ch.add(n) = {o}; n += d as usize;"
                    )
                    .unwrap();
                } else {
                    writeln!(
                        s,
                        "let v = {e}; if differs(v, *c.add({o})) {{ *c.add({o}) = v; *ch.add(n) = {o}; n += 1; }}"
                    )
                    .unwrap();
                }
            }
            s += "n }}\n";
        }
        writeln!(table, "    ({:?}, p{j}, p{j}_bl),", p.name).unwrap();
    }
    table += "];\n";
    s + &table
}

fn expr(ins: &cells_core::program::Instr) -> String {
    let (a, b) = inputs(ins);
    let x = format!("*c.add({a})");
    let y = b.map(|b| format!("*c.add({b})")).unwrap_or_default();
    match ins.op {
        Op::Add(..) => format!("{x} + {y}"),
        Op::Sub(..) => format!("{x} - {y}"),
        Op::Mul(..) => format!("{x} * {y}"),
        Op::Div(..) => format!("{x} / {y}"),
        Op::Min(..) => format!("nan_min({x}, {y})"),
        Op::Max(..) => format!("nan_max({x}, {y})"),
        Op::Negate(..) => format!("-{x}"),
        Op::Round(..) => format!("({x} + 0.5).floor()"),
        Op::Floor(..) => format!("({x}).floor()"),
        Op::Scale(_, k) => format!("{x} * {}", lit(k)),
        Op::Offset(_, k) => format!("{x} + {}", lit(k)),
        Op::Clamp(_, lo, hi) => format!("({x}).clamp({}, {})", lit(lo), lit(hi)),
        Op::NanTo(_, k) => format!(
            "{{ let a = {x}; if a.is_nan() {{ {} }} else {{ a }} }}",
            lit(k)
        ),
        op => panic!("no Rust for {op:?}"),
    }
}

/// `{"seed": k, "cells": [bits as hex], "instrs": [[kind, out, a, b, k, k2]]}`;
/// floats as the hex of their bits.
pub fn json(p: &Prog) -> String {
    let h = |x: f64| format!("\"{:016x}\"", x.to_bits());
    let mut s = format!("{{\"name\":{:?},\"seed\":{},\"cells\":[", p.name, p.seed);
    s += &p.cells.iter().map(|&x| h(x)).collect::<Vec<_>>().join(",");
    s += "],\"instrs\":[";
    let rows: Vec<String> = p
        .instrs
        .iter()
        .map(|ins| {
            let (a, b) = inputs(ins);
            let (kind, k, k2) = match ins.op {
                Op::Add(..) => ("add", 0.0, 0.0),
                Op::Sub(..) => ("sub", 0.0, 0.0),
                Op::Mul(..) => ("mul", 0.0, 0.0),
                Op::Div(..) => ("div", 0.0, 0.0),
                Op::Min(..) => ("min", 0.0, 0.0),
                Op::Max(..) => ("max", 0.0, 0.0),
                Op::Negate(..) => ("neg", 0.0, 0.0),
                Op::Round(..) => ("round", 0.0, 0.0),
                Op::Floor(..) => ("floor", 0.0, 0.0),
                Op::Scale(_, k) => ("scale", k, 0.0),
                Op::Offset(_, k) => ("offset", k, 0.0),
                Op::Clamp(_, lo, hi) => ("clamp", lo, hi),
                Op::NanTo(_, k) => ("nanto", k, 0.0),
                op => panic!("no JSON for {op:?}"),
            };
            format!(
                "[\"{kind}\",{},{a},{},{},{}]",
                ins.out.index(),
                b.unwrap_or(0),
                h(k),
                h(k2)
            )
        })
        .collect();
    s += &rows.join(",");
    s += "]}";
    s
}

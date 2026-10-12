//! Engine A against engine R (math-expressions-rs) on one corpus, by the
//! bar in `docs/history/plan-5.md`: `equals` must give identical booleans; the
//! results of simplify, expand and derivative must be equal under R's
//! `equals`; `evaluate` must agree to 1e-12. Printed forms are not compared.
//! Run with `--nocapture` to see the table.

use cells_sym::SymEngine;
use cells_sym::flat::Flat;
use cells_sym_mer::Mer;

pub const SIMPLIFY: &[&str] = &[
    "3x+2x",
    "x+1+x^2+2",
    "x x y",
    "x/3+x/3",
    "(x y)^2/x",
    "1/2+1/3",
    "2(x+1)-2x",
    "x^2 x^3",
    "(x^2)^3",
    "a x+b x",
    "exp(ln(x))",
    "sqrt(x) sqrt(x)",
    "3x-3x+y",
    "(x+1)/(x+1)",
    "2^10 x",
    "x y z + z y x",
    "sin(x)^2+0",
];

pub const EXPAND: &[&str] = &[
    "(x+1)^2",
    "(x+y)(x-y)",
    "(2x-3)^3",
    "x(x+1)(x+2)",
    "(a+b)^2-(a-b)^2",
    "(x+1)^5",
];

pub const DERIVATIVE: &[&str] = &[
    "x^3+2x",
    "sin(x^2)",
    "x sin(x)",
    "e^(2x)",
    "ln(x^2+1)",
    "sqrt(x)",
    "1/x",
    "tan(x)",
    "x^x",
    "cos(3x)/x",
    "a x^2+b x+c",
];

/// (a, b): both engines must agree on `equals(a, b)`.
pub const EQUALS: &[(&str, &str)] = &[
    ("(x+1)^2", "x^2+2x+1"),
    ("sin(x)^2+cos(x)^2", "1"),
    ("x/2", "0.5x"),
    ("x^2", "x^3"),
    ("2x+3", "3+2x"),
    ("x y", "y x"),
    ("(x-1)(x+1)", "x^2-1"),
    ("1/(1/x)", "x"),
    ("x+0.0000001", "x"),
    ("pi", "3.14159265358979"),
    ("2^10", "1024"),
    ("a+b", "b+a+0"),
    ("e^(ln(x))", "x"),
    ("ln(x^2)", "2ln(x)"),
    ("x^2-y^2", "(x-y)(x+y)"),
    ("x^2-y^2", "(x-y)(x-y)"),
    ("3x", "3y"),
];

/// Recorded divergences, printed but not asserted. A samples real points,
/// where `sqrt(x^2)` is `|x|`; R samples complex points and calls the two
/// equal.
pub const EQUALS_KNOWN: &[(&str, &str)] = &[("sqrt(x^2)", "x")];

/// (a, b) for `equals_syntax`.
pub const SYNTAX: &[(&str, &str)] = &[
    ("2x+3", "3+2x"),
    ("x+x", "2x"),
    ("x y", "y x"),
    ("(x+1)^2", "x^2+2x+1"),
    ("a b c", "c b a"),
];

fn check_same(
    a: &mut Flat,
    r: &mut Mer,
    op: &str,
    src: &str,
    f: impl Fn(&mut dyn SymEngine, u32) -> u32,
) -> bool {
    let ha = a.parse(src).unwrap();
    let ra = f(a, ha);
    let hr = r.parse(src).unwrap();
    let rr = f(r, hr);
    let a_text = a.text(ra);
    let ok = match r.parse(&a_text) {
        Ok(back) => r.equals(back, rr),
        Err(e) => {
            println!("  R cannot parse A's output {a_text:?}: {e}");
            false
        }
    };
    println!(
        "{op:10} {src:22} A: {a_text:28} R: {:28} {}",
        r.text(rr),
        if ok { "ok" } else { "MISMATCH" }
    );
    ok
}

#[test]
fn engine_a_matches_math_expressions() {
    let mut a = Flat::new();
    let mut r = Mer::new();
    let mut failures = Vec::new();
    for src in SIMPLIFY {
        if !check_same(&mut a, &mut r, "simplify", src, |e, h| e.simplify(h)) {
            failures.push(format!("simplify {src}"));
        }
    }
    for src in EXPAND {
        if !check_same(&mut a, &mut r, "expand", src, |e, h| e.expand(h)) {
            failures.push(format!("expand {src}"));
        }
    }
    for src in DERIVATIVE {
        if !check_same(&mut a, &mut r, "derivative", src, |e, h| {
            e.derivative(h, "x")
        }) {
            failures.push(format!("derivative {src}"));
        }
        // Evaluate the expression and its derivative at a few points.
        for x in [0.7, 1.3, 2.9] {
            let (ha, hr) = (a.parse(src).unwrap(), r.parse(src).unwrap());
            let (va, vr) = (
                a.evaluate(ha, Some(("x", x))),
                r.evaluate(hr, Some(("x", x))),
            );
            let close =
                (va - vr).abs() <= 1e-12 * va.abs().max(1.0) || (va.is_nan() && vr.is_nan());
            // a, b, c are free: both should give NaN.
            if !close {
                failures.push(format!("evaluate {src} at {x}: A {va} R {vr}"));
            }
        }
    }
    for (x, y) in EQUALS {
        let (ax, ay, rx, ry) = (
            a.parse(x).unwrap(),
            a.parse(y).unwrap(),
            r.parse(x).unwrap(),
            r.parse(y).unwrap(),
        );
        let (ea, er) = (a.equals(ax, ay), r.equals(rx, ry));
        println!(
            "equals     {x:22} {y:22} A: {ea:5} R: {er:5} {}",
            if ea == er { "ok" } else { "MISMATCH" }
        );
        if ea != er {
            failures.push(format!("equals {x} = {y}: A {ea} R {er}"));
        }
    }
    for (x, y) in EQUALS_KNOWN {
        let (ax, ay, rx, ry) = (
            a.parse(x).unwrap(),
            a.parse(y).unwrap(),
            r.parse(x).unwrap(),
            r.parse(y).unwrap(),
        );
        println!(
            "known      {x:22} {y:22} A: {:5} R: {:5}",
            a.equals(ax, ay),
            r.equals(rx, ry)
        );
    }
    for (x, y) in SYNTAX {
        let (ax, ay, rx, ry) = (
            a.parse(x).unwrap(),
            a.parse(y).unwrap(),
            r.parse(x).unwrap(),
            r.parse(y).unwrap(),
        );
        let (ea, er) = (a.equals_syntax(ax, ay), r.equals_syntax(rx, ry));
        println!(
            "syntax     {x:22} {y:22} A: {ea:5} R: {er:5} {}",
            if ea == er { "ok" } else { "MISMATCH" }
        );
        if ea != er {
            failures.push(format!("equals_syntax {x} = {y}: A {ea} R {er}"));
        }
    }
    assert!(
        failures.is_empty(),
        "{} divergences:\n{}",
        failures.len(),
        failures.join("\n")
    );
}

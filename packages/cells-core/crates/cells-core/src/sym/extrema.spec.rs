//! The extrema search against the JavaScript core's answers
//! (`functionTag.test.ts`, `utils/extrema.js`).

use super::*;

const INF: f64 = f64::INFINITY;

/// A function of `x` with domain `d` (ends, closedness), its minima or
/// maxima.
fn of(text: &str, d: [f64; 4], max: bool) -> Minima {
    let mut engine = Engine::new();
    let e = engine.parse(text).unwrap();
    let x = engine.parse("x").unwrap();
    let mut f = d.to_vec();
    f.extend([e.to_value(), x.to_value(), -INF, INF, 0.0, 0.0]);
    search(&engine, &f, 1.0, max, false)
}

const LINE: [f64; 4] = [-INF, INF, 0.0, 0.0];

fn close(a: Pt, b: Pt) {
    assert!(
        (a.0 - b.0).abs() < 1e-3 && (a.1 - b.1).abs() < 1e-3,
        "{a:?} is not {b:?}"
    );
}

#[test]
fn a_double_well_has_two_minima_and_a_maximum() {
    let min = of("x^4-8x^2+8", LINE, false);
    assert_eq!(min.local.len(), 2);
    close(min.local[0], (-2.0, -8.0));
    close(min.local[1], (2.0, -8.0));
    assert_eq!(min.global, Some((-2.0, -8.0)));
    assert_eq!(min.infimum, Some((-2.0, -8.0)));
    let max = of("x^4-8x^2+8", LINE, true);
    assert_eq!(max.local, vec![(0.0, 8.0)]);
    // Unbounded: no maximum, a supremum at the open end the line is cut to.
    assert_eq!(max.global, None);
    let f100 = 100f64.powi(4) - 8.0 * 100f64.powi(2) + 8.0;
    assert_eq!(max.infimum, Some((-100.0, f100)));
}

#[test]
fn a_sinusoids_extrema_fill_its_domain() {
    let max = of("sin(2 pi x / 10)", LINE, true);
    assert_eq!(max.local.len(), 20);
    close(max.local[0], (-97.5, 1.0));
    let min = of("sin(2 pi x / 10)", [0.0, 20.0, 1.0, 1.0], false);
    assert_eq!(min.local.len(), 2);
    close(min.local[0], (7.5, -1.0));
}

#[test]
fn a_pole_at_an_open_end_is_an_infinite_supremum() {
    let max = of("1/x", [0.0, INF, 0.0, 0.0], true);
    assert!(max.local.is_empty());
    assert_eq!(max.global, None);
    assert_eq!(max.infimum, Some((0.0, INF)));
    let min = of("1/x", [0.0, INF, 0.0, 0.0], false);
    assert_eq!(min.global, None);
    assert_eq!(min.infimum, Some((200.0, 1.0 / 200.0)));
}

#[test]
fn a_pole_between_grid_samples_is_no_extremum() {
    let max = of("(x-5)^2/(x-5.1)^2", LINE, true);
    assert!(max.local.iter().all(|p| p.1.abs() < 1e3), "{:?}", max.local);
}

#[test]
fn a_piecewise_functions_minima_are_its_pieces_and_its_corners() {
    let mut engine = Engine::new();
    let x = engine.parse("x").unwrap().to_value();
    let left = engine.parse("-x").unwrap().to_value();
    let right = engine.parse("x").unwrap().to_value();
    let mut f = LINE.to_vec();
    f.extend([left, x, -INF, 0.0, 0.0, 0.0]);
    f.extend([right, x, 0.0, INF, 1.0, 0.0]);
    let min = search(&engine, &f, 1.0, false, true);
    assert_eq!(min.local, vec![(0.0, 0.0)]);
    assert_eq!(min.global, Some((0.0, 0.0)));
}

#[test]
fn a_rational_functions_poles_are_no_extrema() {
    // `functionTag.test.ts`, "extrema of rational function": the Sage values.
    let t = "(x+8)(x-8)/((x-2)(x+4)(x-5)^2)";
    let min = of(t, LINE, false);
    assert_eq!(min.local.len(), 1);
    assert!((min.local[0].0 + 2.29152990292159).abs() < 1e-9);
    assert!(min.global.unwrap().1 < -1e5);
    let max = of(t, LINE, true);
    let at: Vec<f64> = max.local.iter().map(|p| p.0).collect();
    for (a, b) in at
        .iter()
        .zip([-11.6660173492088, 3.18454272065031, 9.77300453148004])
    {
        assert!((a - b).abs() < 1e-9, "{at:?}");
    }
}

#[test]
fn where_a_value_is_complex_no_extremum_is_found() {
    // "extrema of function with restricted domain, not explicit".
    let t = "log(x^2-1)*sqrt((x-5)^2-1)";
    assert!(of(t, LINE, false).local.is_empty());
    let max = of(t, LINE, true);
    assert_eq!(max.local.len(), 1);
    close(max.local[0], (2.614, 3.82));
    assert_eq!(max.infimum.unwrap().0, -100.0);
}

#[test]
fn a_decimal_coefficient_keeps_the_critical_points_exact() {
    // `piecewisefunction.test.ts`, "a piece's maxima are as exact as its
    // minima": `5.1` is `51/10`, and the pole at it no extremum.
    let mut engine = Engine::new();
    let x = engine.parse("x").unwrap();
    // The float a lowered math leaves, as the engine imports it.
    fn q_is_5_1(e: &Expr) -> Expr {
        let all = |xs: &[Expr]| xs.iter().map(q_is_5_1).collect();
        let one = |x: &Expr| Box::new(q_is_5_1(x));
        match e {
            Expr::Sym(s) if s.name() == "q" => Expr::Num(me::Number::from_f64(5.1)),
            Expr::Add(xs) => Expr::Add(all(xs)),
            Expr::Mul(xs) => Expr::Mul(all(xs)),
            Expr::Div(a, b) => Expr::Div(one(a), one(b)),
            Expr::Pow(a, b) => Expr::Pow(one(a), one(b)),
            Expr::Neg(a) => Expr::Neg(one(a)),
            _ => e.clone(),
        }
    }
    let e = engine.parse("(x+8)(x-8)/((x-2)(x+4)(x-q)^2)").unwrap();
    let e = q_is_5_1(&engine.expr(e).clone());
    let e = engine.store(e);
    let mut f = vec![-20.0, 20.0, 0.0, 0.0];
    f.extend([e.to_value(), x.to_value(), -INF, INF, 0.0, 0.0]);
    let min = search(&engine, &f, 1.0, false, false);
    assert_eq!(min.local.len(), 1);
    assert!(
        (min.local[0].0 + 2.28205595296559).abs() < 1e-12,
        "{:?}",
        min.local
    );
}

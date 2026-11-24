//! The spline through given points against the JavaScript core's values
//! (`functionTag.test.ts`).

use super::*;

const N: Option<f64> = None;

fn p(kind: Kind, x: Option<f64>, y: Option<f64>) -> Given {
    Given {
        kind,
        x,
        y,
        slope: None,
    }
}

/// The function through `given` (xscale and yscale 1 unless given), at
/// each of `xs`.
fn values(given: &[Given], scales: (f64, f64), xs: &[f64]) -> Vec<f64> {
    let mut engine = Engine::new();
    let mut all = vec![0.0; 1 + PIECE_OUT * max_pieces(given.len())];
    engine.interpolate(given, scales.0, scales.1, "x", &mut all);
    let out = &all[1..];
    let var = engine.parse("x").unwrap().to_value();
    let mut f = vec![f64::NEG_INFINITY, f64::INFINITY, 0.0, 0.0];
    for piece in out.chunks_exact(PIECE_OUT) {
        f.extend([piece[0], var, piece[1], piece[2], piece[3], piece[4]]);
    }
    let mut ys = vec![0.0; xs.len()];
    crate::program::eval_function(&mut engine, &f, xs, &mut ys);
    ys
}

fn close(got: &[f64], want: &[f64]) {
    for (g, w) in got.iter().zip(want) {
        assert!((g - w).abs() < 1e-12, "{got:?} is not {want:?}");
    }
}

#[test]
fn a_single_minimum_is_a_parabola() {
    // `minima="(2)"`: its value 2, at 0.
    let f = values(
        &[p(Kind::Minimum, N, Some(2.0))],
        (1.0, 1.0),
        &[0., 1., 2., -1., -2.],
    );
    close(&f, &[2., 3., 6., 3., 6.]);
    // `xscale="3" yscale="5"`.
    let f = values(
        &[p(Kind::Minimum, N, Some(2.0))],
        (3.0, 5.0),
        &[0., 3., -3., 6.],
    );
    close(&f, &[2., 7., 7., 22.]);
    // `minima="(2, )"`: at 2, its value 0.
    let f = values(&[p(Kind::Minimum, Some(2.0), N)], (1.0, 1.0), &[2., 3., 1.]);
    close(&f, &[0., 1., 1.]);
}

#[test]
fn a_minimum_and_a_maximum() {
    // `minima="(0,0)" maxima="(1,1)"`.
    let given = [
        p(Kind::Minimum, Some(0.0), Some(0.0)),
        p(Kind::Maximum, Some(1.0), Some(1.0)),
    ];
    let f = values(&given, (1.0, 1.0), &[0., 1., -1., 2., 0.5]);
    close(&f, &[0., 1., 1., 0., 0.5]);
}

#[test]
fn two_minima_get_a_maximum_between() {
    // `minima="(2,3)" maxima="(4,4)"` and `functionTag.test.ts`'s copy.
    let given = [
        p(Kind::Minimum, Some(2.0), Some(3.0)),
        p(Kind::Maximum, Some(4.0), Some(4.0)),
    ];
    let f = values(&given, (1.0, 1.0), &[2., 4., 1., 3., 5.]);
    close(&f, &[3., 4., 4., 3.5, 3.]);
}

#[test]
fn through_points_with_slopes() {
    // `through="(0,2) (2,1) (3,2)" throughSlopes="0.5 2 -1"`.
    let mut given = [
        p(Kind::Point, Some(0.0), Some(2.0)),
        p(Kind::Point, Some(2.0), Some(1.0)),
        p(Kind::Point, Some(3.0), Some(2.0)),
    ];
    for (g, s) in given.iter_mut().zip([0.5, 2.0, -1.0]) {
        g.slope = Some(s);
    }
    let f = values(&given, (1.0, 1.0), &[0., 2., 3., -1., 4.]);
    close(&f, &[2., 1., 2., 1.5, 1.]);
}

#[test]
fn two_points_at_one_x_are_no_function() {
    let given = [
        p(Kind::Point, Some(2.0), Some(1.0)),
        p(Kind::Point, Some(2.0), Some(2.0)),
    ];
    let f = values(&given, (1.0, 1.0), &[0.0]);
    assert!(f[0].is_nan());
    let _ = at;
}

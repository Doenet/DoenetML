//! Brent's root finder and minimizer of a function of one variable, as the
//! JavaScript core's `Numerics.js` (from JSXGraph; G. Forsythe, M.
//! Malcolm, C. Moler, *Computer methods for mathematical computations*)
//! runs them for a function's extrema (ADR 0061), with its tolerances.

/// The tolerance both use, the current core's `numerics.eps`.
pub(crate) const EPS: f64 = 1e-6;
/// The most steps [`fzero`] takes.
const MAX_ITER_ROOT: usize = 80;
/// The most steps [`fminbr`] takes.
const MAX_ITER_MINIMIZE: usize = 500;

/// A zero of `f` in `[a, b]`, as the current core's `fzero` with a
/// bracket: Brent's method once `f(a)` and `f(b)` differ in sign, else
/// where [`fminbr`] finds `f` least (NaN when it fails).
pub(crate) fn fzero(f: &mut impl FnMut(f64) -> f64, [a0, b0]: [f64; 2]) -> f64 {
    let (mut a, mut b) = (a0, b0);
    let mut fa = f(a);
    let mut fb = f(b);
    if fa * fb > 0.0 {
        // Not bracketed: where `f` is least, settled or not.
        return minimize(f, [a, b]).map_or(f64::NAN, |(m, _)| m.x);
    }
    let mut c = a;
    let mut fc = fa;
    let mut niter = 0;
    while niter < MAX_ITER_ROOT {
        let prev_step = b - a;
        if fc.abs() < fb.abs() {
            a = b;
            b = c;
            c = a;
            fa = fb;
            fb = fc;
            fc = fa;
        }
        let tol_act = 0.5 * EPS * (b.abs() + 1.0);
        let mut new_step = (c - b) * 0.5;
        if new_step.abs() <= tol_act && fb.abs() <= EPS {
            return b;
        }
        if prev_step.abs() >= tol_act && fa.abs() > fb.abs() {
            let cb = c - b;
            let (mut p, mut q);
            if a == c {
                let t1 = fb / fa;
                p = cb * t1;
                q = 1.0 - t1;
            } else {
                let qq = fa / fc;
                let t1 = fb / fc;
                let t2 = fb / fa;
                p = t2 * (cb * qq * (qq - t1) - (b - a) * (t1 - 1.0));
                q = (qq - 1.0) * (t1 - 1.0) * (t2 - 1.0);
            }
            if p > 0.0 {
                q = -q;
            } else {
                p = -p;
            }
            if p < 0.75 * cb * q - (tol_act * q).abs() * 0.5 && p < (prev_step * q * 0.5).abs() {
                new_step = p / q;
            }
        }
        if new_step.abs() < tol_act {
            new_step = if new_step > 0.0 { tol_act } else { -tol_act };
        }
        a = b;
        fa = fb;
        b += new_step;
        fb = f(b);
        if (fb > 0.0 && fc > 0.0) || (fb < 0.0 && fc < 0.0) {
            c = a;
            fc = fa;
        }
        niter += 1;
    }
    b
}

/// Where [`fminbr`] found a function least.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) struct Minimum {
    /// The point.
    pub(crate) x: f64,
    /// The function's value there.
    pub(crate) fx: f64,
    /// The tolerance it stopped at.
    pub(crate) tol: f64,
}

/// The least value of `f` in `[a, b]`, by golden sections and parabolic
/// steps, as the current core's `fminbr`: none when `f` is NaN at a point
/// it tries or it does not settle in its steps.
pub(crate) fn fminbr(f: &mut impl FnMut(f64) -> f64, x0: [f64; 2]) -> Option<Minimum> {
    minimize(f, x0).and_then(|(m, settled)| settled.then_some(m))
}

/// [`fminbr`]'s search: where it stopped and whether it settled there;
/// none when `f` is NaN at a point it tries.
fn minimize(f: &mut impl FnMut(f64) -> f64, [a0, b0]: [f64; 2]) -> Option<(Minimum, bool)> {
    let r = (3.0 - 5f64.sqrt()) * 0.5;
    let (tol, sqrteps) = (EPS, EPS);
    let (mut a, mut b) = (a0, b0);
    let mut v = a + r * (b - a);
    let mut fv = f(v);
    if fv.is_nan() {
        return None;
    }
    let mut x = v;
    let mut w = v;
    let mut fx = fv;
    let mut fw = fv;
    for _ in 0..MAX_ITER_MINIMIZE {
        let range = b - a;
        let middle_range = (a + b) * 0.5;
        let tol_act = sqrteps * x.abs() + tol / 3.0;
        if (x - middle_range).abs() + range * 0.5 <= 2.0 * tol_act {
            return Some((
                Minimum {
                    x,
                    fx,
                    tol: tol_act,
                },
                true,
            ));
        }
        let mut new_step = r * if x < middle_range { b - x } else { a - x };
        if (x - w).abs() >= tol_act {
            let t = (x - w) * (fx - fv);
            let mut q = (x - v) * (fx - fw);
            let mut p = (x - v) * q - (x - w) * t;
            q = 2.0 * (q - t);
            if q > 0.0 {
                p = -p;
            } else {
                q = -q;
            }
            if p.abs() < (new_step * q).abs()
                && p > q * (a - x + 2.0 * tol_act)
                && p < q * (b - x - 2.0 * tol_act)
            {
                new_step = p / q;
            }
        }
        if new_step.abs() < tol_act {
            new_step = if new_step > 0.0 { tol_act } else { -tol_act };
        }
        let t = x + new_step;
        let ft = f(t);
        if ft.is_nan() {
            return None;
        }
        if ft <= fx {
            if t < x {
                b = x;
            } else {
                a = x;
            }
            v = w;
            w = x;
            x = t;
            fv = fw;
            fw = fx;
            fx = ft;
        } else {
            if t < x {
                a = t;
            } else {
                b = t;
            }
            if ft <= fw || w == x {
                v = w;
                w = t;
                fv = fw;
                fw = ft;
            } else if ft <= fv || v == x || v == w {
                v = t;
                fv = ft;
            }
        }
    }
    let tol = sqrteps * x.abs() + tol / 3.0;
    Some((Minimum { x, fx, tol }, false))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_root_and_a_minimum_of_a_quadratic() {
        let x = fzero(&mut |x: f64| x * x - 2.0, [0.0, 2.0]);
        assert!((x - 2f64.sqrt()).abs() < 1e-6);
        let m = fminbr(&mut |x: f64| (x - 1.0) * (x - 1.0) + 3.0, [-4.0, 5.0]).unwrap();
        assert!((m.x - 1.0).abs() < 1e-5 && (m.fx - 3.0).abs() < 1e-9);
        assert!(fminbr(&mut |_| f64::NAN, [0.0, 1.0]).is_none());
    }
}

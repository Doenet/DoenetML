//! A function's local and global extrema (ADR 0061): the numerical search
//! of the JavaScript core's `utils/extrema.js`, over a function of one
//! variable given as its domain and pieces (ADR 0049), each piece an
//! expression in its variable.
//!
//! A function's minima are found on a grid of a thousand cells over its
//! domain (the whole line cut to 200 `xscale` around 0, an infinite end
//! to 200 `xscale` from the other): a cell where the derivative changes
//! sign holds a root of it (the exact critical point when the engine has
//! the derivative's every root, else Brent's root finder), and any other
//! cell is minimized by Brent's method, a cell with more structure than
//! that searched again on a finer grid. Its maxima are its negative's
//! minima. A piecewise function's are its pieces', each on what of its
//! domain no earlier piece takes, with the ends between pieces tried
//! alone. The values are the current core's: a pole is infinite.

use std::collections::HashMap;

use math_expressions as me;
use me::Expr;
use me::expr::SeqKind;
use num_complex::Complex64;

use super::brent::{EPS, fminbr, fzero};
use super::engine::{has_blank, number};
use super::subset::Subset;
use super::{Engine, Handle};
use crate::program::{DOMAIN_CELLS, PIECE_CELLS, in_domain};

/// Cells of the grid a function's domain is searched over.
const GRID: usize = 1000;
/// Cells of the grid a cell with more structure is searched over again.
const SUBGRID: usize = 4;
/// How deep a search goes again.
const MAX_RECURSIONS: u32 = 100;

/// What a function's pieces are, to the search.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Pieces {
    /// One, on the whole line: a `<function>`'s formula, searched on its
    /// domain.
    One,
    /// A piecewise function's, each on what of the domain is its own.
    Piecewise,
    /// A spline's (an interpolated function's): a piecewise function's
    /// whose first and last cubics run on to the infinite ends, where it
    /// falls without bound to an infinite infimum, as the current core
    /// reads its coefficients.
    Spline,
}

/// A point of a function's graph: its location and value.
pub(crate) type Pt = (f64, f64);

/// A function's minima: the local ones in order, the global minimum when
/// it attains one, and its infimum (where it is approached, or attained).
#[derive(Debug, Clone, Default, PartialEq)]
pub(crate) struct Minima {
    pub(crate) local: Vec<Pt>,
    pub(crate) global: Option<Pt>,
    pub(crate) infimum: Option<Pt>,
}

impl Minima {
    /// Of the negative of a function, its maxima.
    fn negated(self) -> Minima {
        let neg = |(x, y): Pt| (x, -y);
        Minima {
            local: self.local.into_iter().map(neg).collect(),
            global: self.global.map(neg),
            infimum: self.infimum.map(neg),
        }
    }
}

/// The value of `e` at `var = x`, as the current core's compiled function
/// gives it: in real arithmetic, so a pole of a quotient is infinite (`1/x`
/// at 0, where the engine's complex quotient gives NaN) and a value that is
/// no real number NaN. What real arithmetic does not reach (a negative base
/// under a root, a function it does not know) the engine's complex
/// evaluation decides, its real part when its imaginary part is negligible.
fn real_at(e: &Expr, env: &mut HashMap<String, Complex64>, var: &str, x: f64) -> f64 {
    if x.is_nan() {
        return f64::NAN;
    }
    if let Some(v) = env.get_mut(var) {
        *v = Complex64::new(x, 0.0);
    } else {
        env.insert(var.to_string(), Complex64::new(x, 0.0));
    }
    real(e, env, var, x)
}

/// [`real_at`] once `var` is bound in `env`.
fn real(e: &Expr, env: &HashMap<String, Complex64>, var: &str, x: f64) -> f64 {
    use me::MathConst;
    let r = |e: &Expr| real(e, env, var, x);
    match e {
        Expr::Num(n) => n.to_f64(),
        Expr::Const(MathConst::Pi) => std::f64::consts::PI,
        Expr::Const(MathConst::E) => std::f64::consts::E,
        Expr::Sym(s) if s.name() == var => x,
        Expr::Sym(s) if s.name() == "pi" => std::f64::consts::PI,
        Expr::Sym(s) if s.name() == "e" => std::f64::consts::E,
        Expr::Add(xs) => xs.iter().map(r).sum(),
        Expr::Mul(xs) => xs.iter().map(r).product(),
        Expr::Div(a, b) => r(a) / r(b),
        Expr::Neg(a) => -r(a),
        Expr::Pow(b, p) => {
            let (b, p) = (r(b), r(p));
            if p.fract() == 0.0 && p.abs() <= i32::MAX as f64 {
                b.powi(p as i32)
            } else if b >= 0.0 || b.is_nan() || p.is_nan() {
                b.powf(p)
            } else {
                complex(e, env)
            }
        }
        Expr::Apply(head, args) if args.len() == 1 => {
            let Expr::Sym(name) = &**head else {
                return complex(e, env);
            };
            let a = r(&args[0]);
            match name.name().as_str() {
                "sin" => a.sin(),
                "cos" => a.cos(),
                "tan" => a.tan(),
                "exp" => a.exp(),
                "abs" => a.abs(),
                "log" | "ln" if a >= 0.0 => a.ln(),
                "sqrt" if a >= 0.0 => a.sqrt(),
                _ => complex(e, env),
            }
        }
        _ => complex(e, env),
    }
}

/// `e` by the engine's complex evaluation: its real part when the
/// imaginary part is negligible, else NaN.
fn complex(e: &Expr, env: &HashMap<String, Complex64>) -> f64 {
    match me::eval_numeric::complex::eval_complex(e, env) {
        Some(v) if !v.re.is_nan() && v.im.abs() <= 1e-10 * v.re.abs().max(1.0) => v.re,
        _ => f64::NAN,
    }
}

/// One expression in its variable, read as the search reads a function
/// (`derivativeInfoFor`): its value and its derivative's anywhere, its
/// derivative sampled on a grid, and its derivative's every root when the
/// engine has them. `sign` -1 reads its negative.
struct Formula {
    var: String,
    f: Expr,
    /// The derivative, as written (for sampling) and canonical; none for
    /// a formula with a blank in it.
    d: Option<(Expr, Expr)>,
    /// The derivative's every real root, in order, when it is a rational
    /// function the engine factors; none when undecided.
    exact: Option<Vec<f64>>,
    sign: f64,
    env: HashMap<String, Complex64>,
}

impl Formula {
    fn new(e: &Expr, var: &str, sign: f64) -> Formula {
        let e = &exact_decimals(e);
        let (d, exact) = if has_blank(e) {
            (None, None)
        } else {
            let d = me::derivative(e, var);
            let canon = me::canonicalize(&d);
            (Some((d, canon)), exact_critical_points(e, var))
        };
        Formula {
            var: var.to_string(),
            f: me::canonicalize(e),
            d,
            exact,
            sign,
            env: HashMap::with_capacity(1),
        }
    }

    fn f(&mut self, x: f64) -> f64 {
        self.sign * real_at(&self.f, &mut self.env, &self.var, x)
    }

    /// Whether the formula's value at `x` is a complex number, which the
    /// current core's search reads as no number but does not skip as NaN
    /// (`sqrt(x)` below 0).
    fn complex_at(&mut self, x: f64) -> bool {
        if x.is_nan() {
            return false;
        }
        self.env.insert(self.var.clone(), Complex64::new(x, 0.0));
        me::eval_numeric::complex::eval_complex(&self.f, &self.env).is_some_and(|v| {
            v.re.is_finite() && v.im.is_finite() && v.im.abs() > 1e-10 * v.re.abs().max(1.0)
        })
    }

    fn df(&mut self, x: f64) -> f64 {
        match &self.d {
            Some((_, d)) => self.sign * real_at(d, &mut self.env, &self.var, x),
            None => f64::NAN,
        }
    }

    /// The derivative at every `xs`, a non-finite value NaN, as the
    /// current core samples it (`sampleGrid`).
    fn df_grid(&self, xs: &[f64]) -> Option<Vec<f64>> {
        let (d, _) = self.d.as_ref()?;
        let ys = me::evaluate_many(d, &self.var, xs);
        (ys.len() == xs.len()).then(|| ys.into_iter().map(|y| self.sign * y).collect())
    }
}

/// `e` with each float in it the decimal it is written as, an exact
/// rational (`5.1` is `51/10`), as the current core's engine holds the
/// numbers an author writes: a formula with a float in it has no exact
/// critical points (`critical_points` declines an inexact coefficient).
fn exact_decimals(e: &Expr) -> Expr {
    let all = |xs: &[Expr]| xs.iter().map(exact_decimals).collect::<Vec<_>>();
    let one = |x: &Expr| Box::new(exact_decimals(x));
    match e {
        Expr::Num(me::Number::Float(v)) => decimal(v.get()).map_or_else(|| e.clone(), Expr::Num),
        Expr::Add(xs) => Expr::Add(all(xs)),
        Expr::Mul(xs) => Expr::Mul(all(xs)),
        Expr::Div(a, b) => Expr::Div(one(a), one(b)),
        Expr::Pow(a, b) => Expr::Pow(one(a), one(b)),
        Expr::Neg(a) => Expr::Neg(one(a)),
        Expr::Apply(f, xs) => Expr::Apply(f.clone(), all(xs)),
        _ => e.clone(),
    }
}

/// `v` as the decimal its shortest spelling is, when it fits a rational of
/// 64-bit integers.
fn decimal(v: f64) -> Option<me::Number> {
    if !v.is_finite() {
        return None;
    }
    let text = format!("{}", v.abs());
    let (whole, frac) = text.split_once('.').unwrap_or((&text, ""));
    let den = 10i64.checked_pow(u32::try_from(frac.len()).ok()?)?;
    let num = format!("{whole}{frac}").parse::<i64>().ok()?;
    Some(me::Number::rat(if v < 0.0 { -num } else { num }, den))
}

/// The real roots of `e`'s derivative, each a number, when the engine has
/// every one (`exactCriticalPointsOf`); none when it is undecided or a root
/// is no real number.
fn exact_critical_points(e: &Expr, var: &str) -> Option<Vec<f64>> {
    me::critical_points(e, var)?
        .iter()
        .map(|p| {
            let v = me::evaluate_to_constant(p)?;
            (v.im.abs() <= 1e-12 * v.re.abs().max(1.0) && v.re.is_finite()).then_some(v.re)
        })
        .collect()
}

/// A domain as the search reads one (`find_effective_domain`): its ends
/// and whether each is open.
#[derive(Debug, Clone, Copy)]
struct Domain {
    minx: f64,
    maxx: f64,
    open_min: bool,
    open_max: bool,
}

impl Domain {
    /// The domain cells `d` (ends, closedness) give, an end that is no
    /// number no bound, cut to a finite length by `xscale` when `truncate`.
    fn of(d: &[f64], truncate: bool, xscale: f64) -> Domain {
        let (mut minx, mut open_min) = if d[0].is_nan() {
            (f64::NEG_INFINITY, true)
        } else {
            (d[0], d[2] == 0.0)
        };
        let (mut maxx, mut open_max) = if d[1].is_nan() {
            (f64::INFINITY, true)
        } else {
            (d[1], d[3] == 0.0)
        };
        if truncate {
            if minx == f64::NEG_INFINITY {
                if maxx == f64::INFINITY {
                    minx = -100.0 * xscale;
                    maxx = 100.0 * xscale;
                } else {
                    minx = maxx - 200.0 * xscale;
                }
            } else if maxx == f64::INFINITY {
                maxx = minx + 200.0 * xscale;
            }
        } else {
            if minx == f64::NEG_INFINITY {
                open_min = false;
            }
            if maxx == f64::INFINITY {
                open_max = false;
            }
        }
        Domain {
            minx,
            maxx,
            open_min,
            open_max,
        }
    }
}

/// `p` when its value is below `best`'s (`p?.[1] < best[1]`).
fn lower(best: &mut Pt, p: Option<Pt>) {
    if let Some(p) = p
        && p.1 < best.1
    {
        *best = p;
    }
}

/// The minima of one formula on `dom` (`find_local_global_minima`, a
/// function with no function child): a grid of `n` cells, searched again
/// where a cell has more structure, `depth` deep already.
fn formula_minima(f: &mut Formula, dom: Domain, n: usize, depth: u32) -> Minima {
    let Domain {
        minx,
        maxx,
        open_min,
        open_max,
    } = dom;
    let dx = (maxx - minx) / n as f64;
    let mut global = (f64::NEG_INFINITY, f64::INFINITY);
    let mut global_at_local = false;
    let mut infimum = (f64::NEG_INFINITY, f64::INFINITY);
    let mut infimum_at_local = false;
    let buffer = 1e-10 * minx.abs().max(maxx.abs());
    let mut local: Vec<Pt> = Vec::new();
    let mut minimum_at_previous_right = false;
    let mut added_at_previous_right_via_deriv = false;

    let have_derivative = f.d.is_some();
    let at = |i: i64| minx + i as f64 * dx;
    let grid_xs: Vec<f64> = (-1..=n as i64 + 1).map(at).collect();
    let grid = if have_derivative {
        f.df_grid(&grid_xs)
    } else {
        None
    };
    let derivative_at = |f: &mut Formula, i: i64| match &grid {
        Some(g) => g[(i + 1) as usize],
        None => f.df(at(i)),
    };
    let exact = f.exact.clone();

    // A point a local minimum is pushed at, with the global minimum and
    // infimum taken there when none was found at a local one before.
    let push_local = |local: &mut Vec<Pt>,
                      global: &mut Pt,
                      global_at_local: &mut bool,
                      infimum: &mut Pt,
                      infimum_at_local: &mut bool,
                      p: Pt| {
        local.push(p);
        if !*global_at_local && p.1 <= global.1 {
            *global = p;
            *global_at_local = true;
        }
        if !*infimum_at_local && p.1 <= infimum.1 {
            *infimum = p;
            *infimum_at_local = true;
        }
    };

    let mut fright = f.f(minx - dx);
    let mut dright = derivative_at(f, -1);
    for i in -1..n as i64 + 1 {
        let xleft = at(i);
        let xright = at(i + 1);
        let fleft = fright;
        fright = f.f(xright);
        let dleft = dright;
        dright = derivative_at(f, i + 1);

        if fleft.is_nan() || fright.is_nan() {
            // A complex value is no NaN to the current core: its cell is
            // searched, finds nothing, and ends a minimum at its left.
            if (fleft.is_nan() && f.complex_at(xleft)) || (fright.is_nan() && f.complex_at(xright))
            {
                minimum_at_previous_right = false;
                added_at_previous_right_via_deriv = false;
            }
            continue;
        }

        let mut found_from_deriv = false;

        let root_slack = 1e-9 * dx.max(xleft.abs()).max(xright.abs());
        let cell_roots: Vec<f64> = exact
            .as_deref()
            .unwrap_or_default()
            .iter()
            .copied()
            .filter(|&p| p >= xleft - root_slack && p <= xright + root_slack)
            .collect();
        let exact_root = cell_roots.first().copied();
        let cell_has_no_extremum = exact.is_some() && cell_roots.is_empty();
        let converged_to_a_known_root = |x: f64, tol: f64| {
            exact.is_none()
                || cell_roots
                    .iter()
                    .any(|p| (x - p).abs() <= 2.0 * tol + root_slack)
        };

        if have_derivative && dleft * dright <= 0.0 && !cell_has_no_extremum {
            let x = if let Some(r) = exact_root {
                r
            } else if dleft == 0.0 {
                xleft
            } else if dright == 0.0 {
                xright
            } else {
                fzero(&mut |x| f.df(x), [xleft, xright])
            };

            if x >= minx - buffer && x <= maxx + buffer {
                let at_open_boundary = (open_min && (x - minx).abs() < buffer)
                    || (open_max && (x - maxx).abs() < buffer);
                let fx = f.f(x);
                let tol_act = 0.5 * EPS * (x.abs() + 1.0);
                let at_closed_boundary = (!open_min && (x - minx).abs() < 2.0 * tol_act)
                    || (!open_max && (x - maxx).abs() < 2.0 * tol_act);
                let derivative_scale = dleft.abs().max(dright.abs());
                let root_is_real = !at_closed_boundary || f.df(x).abs() <= derivative_scale * 1e-8;

                if root_is_real && f.df(x - tol_act) < 0.0 && f.df(x + tol_act) > 0.0 {
                    found_from_deriv = true;
                    minimum_at_previous_right = false;
                    if !at_open_boundary
                        && !(added_at_previous_right_via_deriv && (x - xleft).abs() < buffer)
                    {
                        push_local(
                            &mut local,
                            &mut global,
                            &mut global_at_local,
                            &mut infimum,
                            &mut infimum_at_local,
                            (x, fx),
                        );
                        added_at_previous_right_via_deriv = (x - xright).abs() < buffer;
                    } else {
                        added_at_previous_right_via_deriv = false;
                    }
                }

                if !at_open_boundary && fx < global.1 {
                    global = (x, fx);
                    global_at_local = false;
                }
                if fx < infimum.1 {
                    infimum = (x, fx);
                    infimum_at_local = false;
                }
            }
        }

        if found_from_deriv {
            continue;
        }
        added_at_previous_right_via_deriv = false;

        let Some(result) = fminbr(&mut |x| f.f(x), [xleft, xright]) else {
            continue;
        };
        let (x, fx) = (result.x, result.fx);
        if !(x >= minx - buffer && x <= maxx + buffer) {
            continue;
        }
        let mindf = fx.abs().max(fleft.abs()).max(fright.abs()) * 1e-12;

        if ((fx > fleft + mindf && x - xleft > 2.0 * result.tol)
            || (fx > fright + mindf && xright - x > 2.0 * result.tol))
            && depth < MAX_RECURSIONS
        {
            // Structure in the cell the minimization did not resolve:
            // search it again on a finer grid, within the domain.
            let sub_left = xleft.max(minx);
            let sub_right = xright.min(maxx);
            let sub = Domain {
                minx: sub_left,
                maxx: sub_right,
                open_min: sub_left == minx && open_min,
                open_max: sub_right == maxx && open_max,
            };
            let mut found = formula_minima(f, sub, SUBGRID, depth + 1);
            if found.local.last().is_some_and(|p| p.0 == xright) {
                found.local.pop();
                minimum_at_previous_right = true;
            } else {
                minimum_at_previous_right = false;
            }
            local.extend(found.local);
            lower(&mut global, found.global);
            lower(&mut infimum, found.infimum);
            continue;
        }

        let at_open_boundary =
            (open_min && (x - minx).abs() < buffer) || (open_max && (x - maxx).abs() < buffer);

        if !at_open_boundary {
            if fleft < fx - mindf {
                if minimum_at_previous_right && fleft.is_finite() {
                    push_local(
                        &mut local,
                        &mut global,
                        &mut global_at_local,
                        &mut infimum,
                        &mut infimum_at_local,
                        (xleft, fleft),
                    );
                }
                minimum_at_previous_right = false;
            } else if fright < fx - mindf {
                minimum_at_previous_right = true;
            } else {
                minimum_at_previous_right = false;
                // A strict minimum, at a point that can hold one.
                if converged_to_a_known_root(x, result.tol)
                    && fx.is_finite()
                    && fx < fright - mindf
                    && fx < fleft - mindf
                    && fx < f.f(x + result.tol) - mindf
                    && fx < f.f(x - result.tol) - mindf
                {
                    push_local(
                        &mut local,
                        &mut global,
                        &mut global_at_local,
                        &mut infimum,
                        &mut infimum_at_local,
                        (x, fx),
                    );
                }
            }
        }

        if !at_open_boundary && fx < global.1 {
            global = (x, fx);
            global_at_local = false;
        }
        if fx < infimum.1 {
            infimum = (x, fx);
            infimum_at_local = false;
        }
    }

    let (global, infimum) = finalize(Some((f, dom)), global, infimum);
    Minima {
        local,
        global,
        infimum,
    }
}

/// The global minimum and infimum once the ends of the domain are tried
/// (`finalizeGlobalMinimum`): an end where the formula is infinite takes
/// its sign from beside it; none found is none, and a minimum above the
/// infimum is none.
fn finalize(
    ends: Option<(&mut Formula, Domain)>,
    mut global: Pt,
    mut infimum: Pt,
) -> (Option<Pt>, Option<Pt>) {
    if let Some((f, dom)) = ends {
        let Domain {
            minx,
            maxx,
            open_min,
            open_max,
        } = dom;
        let mut end = |x: f64, toward: f64, open: bool, global: &mut Pt, infimum: &mut Pt| {
            if !x.is_finite() {
                return;
            }
            let mut fx = f.f(x);
            if fx.is_infinite() {
                let near = f.f(x + toward * 1e-12);
                fx = if near > 0.0 {
                    f64::INFINITY
                } else if near < 0.0 {
                    f64::NEG_INFINITY
                } else {
                    f64::NAN
                };
            }
            if !open && fx < global.1 {
                *global = (x, fx);
            }
            if fx < infimum.1 {
                *infimum = (x, fx);
            }
        };
        end(minx, maxx - minx, open_min, &mut global, &mut infimum);
        end(maxx, minx - maxx, open_max, &mut global, &mut infimum);
    }
    let mut global = (global.1 != f64::INFINITY).then_some(global);
    let infimum = (infimum.1 != f64::INFINITY).then_some(infimum);
    if let (Some(inf), Some(min)) = (infimum, global) {
        if inf.1 == f64::NEG_INFINITY {
            global = None;
        } else {
            let buffer = inf.1.abs().max(min.1.abs()) * 1e-12;
            if inf.1 < min.1 - buffer {
                global = None;
            }
        }
    }
    (global, infimum)
}

/// A piece of a function: its formula and its own domain's cells.
struct Piece<'a> {
    formula: Formula,
    domain: &'a [f64],
}

/// A piecewise function's value at `x` (`returnPiecewiseNumericalFunction
/// FromChildren`): outside its domain `d` NaN unless `anywhere`, else the
/// first piece whose domain holds `x`.
fn piecewise_at(pieces: &mut [Piece<'_>], d: &[f64], x: f64, anywhere: bool) -> f64 {
    if x.is_nan() || (!anywhere && !in_domain(x, d, false)) {
        return f64::NAN;
    }
    pieces
        .iter_mut()
        .find(|p| in_domain(x, p.domain, true))
        .map_or(f64::NAN, |p| p.formula.f(x))
}

/// The minima of a piecewise function (`find_minima_of_piecewise`): each
/// piece's on what of the domain `d` no earlier piece takes, less those at
/// an end of it, and the ends tried alone.
fn piecewise_minima(pieces: &mut [Piece<'_>], d: &[f64], xscale: f64, spline: bool) -> Minima {
    let mut global = (f64::NEG_INFINITY, f64::INFINITY);
    let mut infimum = (f64::NEG_INFINITY, f64::INFINITY);
    let mut local: Vec<Pt> = Vec::new();
    let mut ends: Vec<f64> = Vec::new();

    let mut unused = if d[0].is_nan() || d[1].is_nan() {
        Subset::whole_line()
    } else {
        Subset::interval(d[0], d[1], d[2] != 0.0, d[3] != 0.0)
    };
    let mut effective = Vec::with_capacity(pieces.len());
    for p in pieces.iter() {
        let pd = p.domain;
        if pd[0].is_nan() || pd[1].is_nan() {
            effective.push(Vec::new());
            continue;
        }
        let own = Subset::interval(pd[0], pd[1], pd[2] != 0.0, pd[3] != 0.0);
        effective.push(own.clone().and(unused.clone()).intervals());
        unused = unused.minus(own);
    }

    for (p, intervals) in pieces.iter_mut().zip(effective) {
        for (lo, hi, lo_in, hi_in) in intervals {
            if lo == hi {
                ends.push(lo);
                continue;
            }
            let closed = |v: bool| if v { 1.0 } else { 0.0 };
            let dom = Domain::of(&[lo, hi, closed(lo_in), closed(hi_in)], true, xscale);
            let found = formula_minima(&mut p.formula, dom, GRID, 0);
            let mut minima = found.local;
            if lo.is_finite() {
                ends.push(lo);
                minima.retain(|m| m.0 > lo + EPS);
            }
            if hi.is_finite() {
                ends.push(hi);
                minima.retain(|m| m.0 < hi - EPS);
            }
            local.extend(minima);
            lower(&mut global, found.global);
            lower(&mut infimum, found.infimum);
        }
    }

    for x in ends {
        if !x.is_finite() {
            continue;
        }
        let fx = piecewise_at(pieces, d, x, false);
        if fx < piecewise_at(pieces, d, x - EPS, true)
            && fx < piecewise_at(pieces, d, x + EPS, true)
            && local.iter().all(|m| m.0 < x - EPS || m.0 > x + EPS)
        {
            local.push((x, fx));
        }
        if fx < global.1 {
            global = (x, fx);
        }
        if fx < infimum.1 {
            infimum = (x, fx);
        }
    }
    if spline {
        // A cubic that falls without bound toward an infinite end of the
        // domain: its slope far out says which way it goes.
        let far = 1e8 * xscale;
        let unbounded = |lo: bool| {
            if lo {
                d[0].is_nan() || d[0] == f64::NEG_INFINITY
            } else {
                d[1].is_nan() || d[1] == f64::INFINITY
            }
        };
        let falls_left = unbounded(true)
            && pieces
                .iter_mut()
                .find(|p| p.domain[0] == f64::NEG_INFINITY)
                .is_some_and(|p| p.formula.df(-far) > 0.0);
        let falls_right = unbounded(false)
            && pieces
                .iter_mut()
                .find(|p| p.domain[1] == f64::INFINITY)
                .is_some_and(|p| p.formula.df(far) < 0.0);
        if falls_right {
            infimum = (f64::INFINITY, f64::NEG_INFINITY);
        } else if falls_left {
            infimum = (f64::NEG_INFINITY, f64::NEG_INFINITY);
        }
    }
    local.sort_by(|a, b| a.0.total_cmp(&b.0));
    let (global, infimum) = finalize(None, global, infimum);
    Minima {
        local,
        global,
        infimum,
    }
}

/// The minima of the function `f` (its domain's [`DOMAIN_CELLS`], then
/// [`PIECE_CELLS`] per piece, as [`SymKind::EvalFunction`](crate::program::SymKind::EvalFunction)
/// reads one), or its maxima when `max`: a `<function>`'s one piece
/// searched on its domain, or, when `piecewise`, a piecewise function's
/// pieces. None for a piece with no expression or variable.
pub(crate) fn search(engine: &Engine, f: &[f64], xscale: f64, max: bool, of: Pieces) -> Minima {
    let piecewise = of != Pieces::One;
    let sign = if max { -1.0 } else { 1.0 };
    let xscale = if xscale.is_finite() && xscale > 0.0 {
        xscale
    } else {
        1.0
    };
    let (d, cells) = f.split_at(DOMAIN_CELLS);
    let mut pieces = Vec::new();
    for p in cells.chunks_exact(PIECE_CELLS) {
        let (Some(e), Some(var)) = (handle(p[0]), handle(p[1]).and_then(|v| engine.symbol(v)))
        else {
            if piecewise {
                continue;
            }
            return Minima::default();
        };
        pieces.push(Piece {
            formula: Formula::new(engine.expr(e), &var, sign),
            domain: &p[2..],
        });
    }
    let found = if piecewise {
        piecewise_minima(&mut pieces, d, xscale, of == Pieces::Spline)
    } else {
        let Some(p) = pieces.first_mut() else {
            return Minima::default();
        };
        formula_minima(&mut p.formula, Domain::of(d, true, xscale), GRID, 0)
    };
    if max { found.negated() } else { found }
}

fn handle(v: f64) -> Option<Handle> {
    (!v.is_nan()).then_some(Handle::from_value(v))
}

/// A point as a tuple.
fn point((x, y): Pt) -> Expr {
    Expr::Seq(SeqKind::Tuple, vec![number(x), number(y)])
}

impl Engine {
    /// What an extrema search found, as one value: the tuple of its local
    /// extrema (a list of points), its global one and its infimum or
    /// supremum (each a point, or the empty list for none).
    pub(crate) fn extrema_value(&mut self, m: &Minima) -> Handle {
        let none = || Expr::Seq(SeqKind::List, Vec::new());
        let e = Expr::Seq(
            SeqKind::Tuple,
            vec![
                Expr::Seq(SeqKind::List, m.local.iter().copied().map(point).collect()),
                m.global.map_or_else(none, point),
                m.infimum.map_or_else(none, point),
            ],
        );
        self.store(e)
    }

    /// The local extrema: the points of the lists `a` and `b` in order of
    /// their locations, as the current core sorts its minima and maxima
    /// together.
    pub(crate) fn merge_extrema(&mut self, a: Handle, b: Handle) -> Handle {
        let entries = |e: &Expr| match e {
            Expr::Seq(SeqKind::List, xs) => xs.clone(),
            _ => Vec::new(),
        };
        let mut all = entries(self.expr(a));
        all.extend(entries(self.expr(b)));
        let at = |p: &Expr| match p {
            Expr::Seq(_, xs) if !xs.is_empty() => me::evaluate_to_constant(&xs[0])
                .filter(|v| v.im == 0.0)
                .map_or(f64::NAN, |v| v.re),
            _ => f64::NAN,
        };
        all.sort_by(|p, q| at(p).total_cmp(&at(q)));
        self.store(Expr::Seq(SeqKind::List, all))
    }
}

#[cfg(test)]
#[path = "extrema.spec.rs"]
mod spec;

//! An interpolated function (ADR 0061): a `<function>` given by points it
//! passes through, maxima, minima and extrema, as the JavaScript core's
//! `Function.js` builds one (`calculateInterpolationPoints`,
//! `computeSplineParamCoeffs`): the points ordered and completed so each
//! extremum is one, with slopes, then a cubic between each two, the first
//! and last extended to the infinite ends. Its pieces are expressions in
//! the function's variable on domains (ADR 0049).

use math_expressions as me;
use me::Expr;
use me::expr::SeqKind;

use super::Engine;
#[cfg(test)]
use super::Handle;
use super::brent::EPS;
use super::engine::number;

/// What a prescribed point is: the current core's `type`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Kind {
    Maximum,
    Minimum,
    Extremum,
    Point,
}

impl Kind {
    /// The kind a cell holds (its code in an `Interpolate` instruction).
    pub(crate) fn of_code(v: f64) -> Kind {
        match v as i64 {
            0 => Kind::Maximum,
            1 => Kind::Minimum,
            2 => Kind::Extremum,
            _ => Kind::Point,
        }
    }

    /// Its code in an `Interpolate` instruction's inputs.
    pub(crate) const fn code(self) -> f64 {
        match self {
            Kind::Maximum => 0.0,
            Kind::Minimum => 1.0,
            Kind::Extremum => 2.0,
            Kind::Point => 3.0,
        }
    }
}

/// The code of a given point's kind and which of its `x`, `y` and slope
/// are given, a constant of an `Interpolate` instruction's inputs.
pub(crate) const fn code(kind: Kind, x: bool, y: bool, slope: bool) -> f64 {
    kind.code()
        + if x { 4.0 } else { 0.0 }
        + if y { 8.0 } else { 0.0 }
        + if slope { 16.0 } else { 0.0 }
}

/// What [`code`] encodes: the kind and whether `x`, `y` and the slope are
/// given.
pub(crate) fn given_by(code: f64) -> (Kind, bool, bool, bool) {
    let c = if code.is_finite() { code as i64 } else { 3 };
    (
        Kind::of_code((c & 3) as f64),
        c & 4 != 0,
        c & 8 != 0,
        c & 16 != 0,
    )
}

/// A point as an author gives it: a coordinate not given is `None`; one
/// given but not a number is NaN.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Given {
    pub(crate) kind: Kind,
    pub(crate) x: Option<f64>,
    pub(crate) y: Option<f64>,
    pub(crate) slope: Option<f64>,
}

/// A point the spline passes through. `y` none is the current core's
/// `null`, which arithmetic reads as 0.
#[derive(Debug, Clone, Copy)]
struct Pt {
    kind: Kind,
    x: f64,
    y: Option<f64>,
    slope: Option<f64>,
}

/// JavaScript's `null` in arithmetic.
fn num(y: Option<f64>) -> f64 {
    y.unwrap_or(0.0)
}

/// The points the spline passes through (`calculateInterpolationPoints`),
/// with slopes; none when two points share an `x`.
fn interpolation_points(given: &[Given], xscale: f64, yscale: f64) -> Option<Vec<Pt>> {
    let mut with_x: Vec<Pt> = Vec::new();
    let mut without_x: Vec<Pt> = Vec::new();
    // The current core reads the maxima, then the minima, the extrema and
    // the points through.
    for kind in [Kind::Maximum, Kind::Minimum, Kind::Extremum, Kind::Point] {
        for g in given.iter().filter(|g| g.kind == kind) {
            if g.x.is_some_and(|x| !x.is_finite()) || g.y.is_some_and(|y| !y.is_finite()) {
                continue;
            }
            let slope = g.slope.filter(|s| s.is_finite());
            match g.x {
                None if g.y.is_none() => continue,
                None => without_x.push(Pt {
                    kind,
                    x: f64::NAN,
                    y: g.y,
                    slope,
                }),
                Some(x) => with_x.push(Pt {
                    kind,
                    x,
                    y: g.y,
                    slope,
                }),
            }
        }
    }
    with_x.sort_by(|a, b| a.x.total_cmp(&b.x));
    without_x.sort_by(|a, b| num(a.y).total_cmp(&num(b.y)));

    let mut x_prev = f64::NEG_INFINITY;
    for p in &with_x {
        if p.x <= x_prev + EPS {
            return None;
        }
        x_prev = p.x;
    }

    let mut b = Builder {
        points: Vec::new(),
        without_x,
        yscale,
    };
    let (mut kind_prev, mut x_prev, mut y_prev) = (None, f64::NAN, f64::NAN);
    for (i, &p) in with_x.iter().enumerate() {
        let next = with_x.get(i + 1).copied();
        let added = b.add_with_x(p, next, kind_prev, x_prev, y_prev);
        (kind_prev, x_prev, y_prev) = (Some(added.kind), added.x, num(added.y));
    }

    let mut first_point = with_x.is_empty();
    while !b.without_x.is_empty() {
        let found = match kind_prev {
            None => b.without_x_find(
                &[Kind::Maximum, Kind::Minimum, Kind::Extremum],
                false,
                f64::NEG_INFINITY,
            ),
            Some(Kind::Maximum) => {
                b.without_x_find(&[Kind::Minimum, Kind::Extremum], true, y_prev - yscale)
            }
            Some(Kind::Minimum) => {
                b.without_x_find(&[Kind::Maximum, Kind::Extremum], false, y_prev + yscale)
            }
            Some(Kind::Point) => b
                .without_x_find(&[Kind::Maximum, Kind::Extremum], false, y_prev + yscale)
                .or_else(|| {
                    b.without_x_find(&[Kind::Minimum, Kind::Extremum], true, y_prev - yscale)
                }),
            // An added point is never an extremum.
            Some(Kind::Extremum) => None,
        };
        let mut p = match found {
            Some(i) => {
                let mut p = b.without_x.remove(i);
                p.x = if first_point { 0.0 } else { x_prev + xscale };
                p
            }
            None => {
                let mut p = b.without_x.pop().expect("a point remains");
                p.x = if first_point {
                    0.0
                } else {
                    x_prev + 2.0 * xscale
                };
                p
            }
        };
        first_point = false;
        if p.x.is_nan() {
            p.x = 0.0;
        }
        let added = b.add_with_x(p, None, kind_prev, x_prev, y_prev);
        (kind_prev, x_prev, y_prev) = (Some(added.kind), added.x, num(added.y));
    }

    let mut pts = b.points;
    if pts.is_empty() {
        pts.push(Pt {
            kind: Kind::Point,
            x: 0.0,
            y: Some(0.0),
            slope: Some(0.0),
        });
    }

    let first = pts[0];
    match first.kind {
        Kind::Maximum => pts.insert(
            0,
            Pt {
                kind: Kind::Point,
                x: first.x - xscale,
                y: Some(num(first.y) - yscale),
                slope: Some(2.0 * yscale / xscale),
            },
        ),
        Kind::Minimum => pts.insert(
            0,
            Pt {
                kind: Kind::Point,
                x: first.x - xscale,
                y: Some(num(first.y) + yscale),
                slope: Some(-2.0 * yscale / xscale),
            },
        ),
        Kind::Point if pts.len() == 1 => {
            if pts[0].slope.is_none() {
                pts[0].slope = Some(0.0);
            }
        }
        Kind::Point => {
            let next = pts[1];
            let secant = (num(next.y) - num(first.y)) / (next.x - first.x);
            if matches!(next.kind, Kind::Maximum | Kind::Minimum) {
                if pts[0].slope.is_none() {
                    pts[0].slope = Some(2.0 * secant);
                }
            } else {
                if pts.len() == 2 {
                    if pts[0].slope.is_none() {
                        pts[0].slope = Some(secant);
                    }
                } else {
                    if pts[1].slope.is_none() {
                        pts[1].slope = Some(monotonic_slope(&pts[1], &pts[0], &pts[2]));
                    }
                    if pts[0].slope.is_none() {
                        pts[0].slope = Some(
                            2.0 * (num(pts[0].y) - num(pts[1].y)) / (pts[0].x - pts[1].x)
                                - num(pts[1].slope),
                        );
                    }
                }
                let f = pts[0];
                pts.insert(
                    0,
                    Pt {
                        kind: Kind::Extremum,
                        x: f.x - xscale,
                        y: Some(num(f.y) - xscale * num(f.slope)),
                        slope: f.slope,
                    },
                );
            }
        }
        Kind::Extremum => {}
    }

    let n = pts.len();
    let last = pts[n - 1];
    match last.kind {
        Kind::Maximum => pts.push(Pt {
            kind: Kind::Point,
            x: last.x + xscale,
            y: Some(num(last.y) - yscale),
            slope: Some(-2.0 * yscale / xscale),
        }),
        Kind::Minimum => pts.push(Pt {
            kind: Kind::Point,
            x: last.x + xscale,
            y: Some(num(last.y) + yscale),
            slope: Some(2.0 * yscale / xscale),
        }),
        Kind::Point if n == 1 => {
            // Through one point: a line with its slope.
            let slope = num(pts[0].slope);
            pts.push(Pt {
                kind: Kind::Point,
                x: last.x + xscale,
                y: Some(num(last.y) + slope * xscale),
                slope: Some(slope),
            });
        }
        Kind::Point => {
            let prev = pts[n - 2];
            let secant = (num(prev.y) - num(last.y)) / (prev.x - last.x);
            if matches!(prev.kind, Kind::Maximum | Kind::Minimum) {
                if pts[n - 1].slope.is_none() {
                    pts[n - 1].slope = Some(2.0 * secant);
                }
            } else {
                if n == 2 {
                    if pts[n - 1].slope.is_none() {
                        pts[n - 1].slope = Some(secant);
                    }
                } else {
                    if pts[n - 2].slope.is_none() {
                        pts[n - 2].slope =
                            Some(monotonic_slope(&pts[n - 2], &pts[n - 3], &pts[n - 1]));
                    }
                    if pts[n - 1].slope.is_none() {
                        pts[n - 1].slope = Some(
                            2.0 * (num(pts[n - 2].y) - num(pts[n - 1].y))
                                / (pts[n - 2].x - pts[n - 1].x)
                                - num(pts[n - 2].slope),
                        );
                    }
                }
                let l = pts[n - 1];
                pts.push(Pt {
                    kind: Kind::Extremum,
                    x: l.x + xscale,
                    y: Some(num(l.y) + xscale * num(l.slope)),
                    slope: l.slope,
                });
            }
        }
        Kind::Extremum => {}
    }

    for i in 1..pts.len().saturating_sub(1) {
        if pts[i].slope.is_none() {
            pts[i].slope = Some(monotonic_slope(&pts[i], &pts[i - 1], &pts[i + 1]));
        }
    }
    Some(pts)
}

/// The slope at `p` of the monotonic cubic interpolation between its
/// neighbors (Steffen, Astron. Astrophys. 239:443, 1990).
fn monotonic_slope(p: &Pt, prev: &Pt, next: &Pt) -> f64 {
    let (dx1, dx2) = (p.x - prev.x, next.x - p.x);
    let (dy1, dy2) = (num(p.y) - num(prev.y), num(next.y) - num(p.y));
    let (s1, s2) = (dy1 / dx1, dy2 / dx2);
    let p1 = (s1 * dx2 + s2 * dx1) / (dx1 + dx2);
    (sign(s1) + sign(s2)) * s1.abs().min(s2.abs()).min(0.5 * p1.abs())
}

/// JavaScript's `Math.sign`.
fn sign(v: f64) -> f64 {
    if v > 0.0 {
        1.0
    } else if v < 0.0 {
        -1.0
    } else {
        v
    }
}

/// The points as they are added, and those still without an `x`.
struct Builder {
    points: Vec<Pt>,
    without_x: Vec<Pt>,
    yscale: f64,
}

impl Builder {
    /// The position of a point without `x` of one of `kinds` (in that
    /// order of preference) whose `y` is at most (`at_most`) or at least
    /// `value`, searched from the nearest (`getPointWithoutX`).
    fn without_x_find(&self, kinds: &[Kind], at_most: bool, value: f64) -> Option<usize> {
        let n = self.without_x.len();
        let order: Vec<usize> = if at_most {
            (0..n).rev().collect()
        } else {
            (0..n).collect()
        };
        for &kind in kinds {
            for &i in &order {
                let p = &self.without_x[i];
                if p.kind != kind {
                    continue;
                }
                let y = num(p.y);
                if (at_most && y <= value) || (!at_most && y >= value) {
                    return Some(i);
                }
            }
        }
        None
    }

    /// A point between two, the nearest point without `x` of `kinds`
    /// meeting the bound as an extremum of `as_kind`, else a point at the
    /// bound (`slope` none).
    fn between(&mut self, x: f64, kinds: &[Kind], as_kind: Kind, at_most: bool, value: f64) {
        let p = match self.without_x_find(kinds, at_most, value) {
            Some(i) => {
                let found = self.without_x.remove(i);
                Pt {
                    kind: as_kind,
                    x,
                    y: found.y,
                    slope: Some(0.0),
                }
            }
            None => Pt {
                kind: Kind::Point,
                x,
                y: Some(value),
                slope: None,
            },
        };
        self.points.push(p);
    }

    /// `addPointWithX`: the point `p`, an extremum decided a maximum or a
    /// minimum by its neighbors, with what it needs before it.
    fn add_with_x(
        &mut self,
        p: Pt,
        next: Option<Pt>,
        kind_prev: Option<Kind>,
        x_prev: f64,
        y_prev: f64,
    ) -> Pt {
        let ys = self.yscale;
        match p.kind {
            Kind::Maximum => self.add_extremum(true, p, next, kind_prev, x_prev, y_prev),
            Kind::Minimum => self.add_extremum(false, p, next, kind_prev, x_prev, y_prev),
            Kind::Point => self.add_point(p, kind_prev, x_prev, y_prev),
            Kind::Extremum => {
                let kind_next = if kind_prev.is_none() {
                    match next {
                        None => return self.add_extremum(true, p, next, kind_prev, x_prev, y_prev),
                        Some(n) => Some(n.kind),
                    }
                } else {
                    None
                };
                let y_next = next.map_or(f64::NAN, |n| num(n.y));
                let max = if kind_prev == Some(Kind::Maximum) || kind_next == Some(Kind::Maximum) {
                    if p.y.is_some_and(|y| y > y_prev - ys) {
                        true
                    } else {
                        kind_next.is_some() && p.y.is_some_and(|y| y > y_next - ys)
                    }
                } else if kind_prev == Some(Kind::Minimum) || kind_next == Some(Kind::Minimum) {
                    if p.y.is_some_and(|y| y < y_prev + ys) {
                        false
                    } else {
                        !(kind_next.is_some() && p.y.is_some_and(|y| y > y_next + ys))
                    }
                } else if kind_prev == Some(Kind::Point) || kind_next == Some(Kind::Point) {
                    let minimum = p.y.is_some_and(|y| y <= y_prev - ys)
                        || (kind_next.is_some() && p.y.is_some_and(|y| y >= y_next - ys));
                    !minimum
                } else {
                    // The first point, followed by an extremum.
                    !p.y.is_some_and(|y| y < y_next - ys)
                };
                self.add_extremum(max, p, next, kind_prev, x_prev, y_prev)
            }
        }
    }

    /// `addMaximum` (`max`) or `addMinimum`, written once with the sign
    /// `s` turning a maximum's comparisons into a minimum's.
    fn add_extremum(
        &mut self,
        max: bool,
        p: Pt,
        next: Option<Pt>,
        kind_prev: Option<Kind>,
        x_prev: f64,
        y_prev: f64,
    ) -> Pt {
        let ys = self.yscale;
        let (same, other) = if max {
            (Kind::Maximum, Kind::Minimum)
        } else {
            (Kind::Minimum, Kind::Maximum)
        };
        // Up is up for a maximum, down for a minimum.
        let s = if max { 1.0 } else { -1.0 };
        let hi = |a: f64, b: f64| if max { a.max(b) } else { a.min(b) };
        let lo = |a: f64, b: f64| if max { a.min(b) } else { a.max(b) };
        let y_next = next.map(|n| num(n.y));
        let next_same = next.is_some_and(|n| n.kind == same);
        let x = p.x;
        let mut y = p.y;
        match kind_prev {
            None => {
                if y.is_none() {
                    y = Some(match y_next {
                        None => 0.0,
                        Some(yn) if next_same => yn,
                        Some(yn) => yn + s * ys,
                    });
                }
            }
            Some(k) if k == same => {
                if y.is_none() {
                    y = Some(match y_next {
                        None => y_prev,
                        Some(yn) if next_same => hi(y_prev, yn),
                        Some(yn) => hi(y_prev, yn + s * ys),
                    });
                }
                // An extremum of the other kind between the two, `yscale`
                // beyond both.
                let bound = lo(y_prev, num(y)) - s * ys;
                self.between(
                    (x + x_prev) / 2.0,
                    &[other, Kind::Extremum],
                    other,
                    max,
                    bound,
                );
            }
            Some(k) if k == other => {
                if y.is_none() {
                    y = Some(match y_next {
                        None => y_prev + s * ys,
                        Some(yn) if next_same => hi(y_prev + s * ys, yn),
                        Some(yn) => hi(y_prev, yn) + s * ys,
                    });
                } else if s * num(y) < s * (y_prev + s * ys) {
                    // Too near the extremum before: two points between,
                    // the first making it plain, the second this one.
                    let xs = [(2.0 * x_prev + x) / 3.0, (x_prev + 2.0 * x) / 3.0];
                    let values = [y_prev + s * ys, num(y) - s * ys];
                    self.between(xs[0], &[same, Kind::Extremum], same, !max, values[0]);
                    self.between(xs[1], &[other, Kind::Extremum], other, max, values[1]);
                }
            }
            Some(_) => {
                // A point before.
                if y.is_none() {
                    y = Some(match y_next {
                        None => y_prev + s * ys,
                        Some(yn) if next_same => hi(y_prev + s * ys, yn),
                        Some(yn) => hi(y_prev, yn) + s * ys,
                    });
                } else if s * num(y) < s * (y_prev + s * ys) {
                    self.between(
                        (x + x_prev) / 2.0,
                        &[other, Kind::Extremum],
                        other,
                        max,
                        num(y) - s * ys,
                    );
                }
            }
        }
        let added = Pt {
            kind: same,
            x,
            y,
            slope: Some(0.0),
        };
        self.points.push(added);
        added
    }

    /// `addPoint`: a point through, with an extremum's neighbor before it
    /// when it is too near the extremum before.
    fn add_point(&mut self, p: Pt, kind_prev: Option<Kind>, x_prev: f64, y_prev: f64) -> Pt {
        let ys = self.yscale;
        let y = num(p.y);
        match kind_prev {
            Some(Kind::Maximum) if y > y_prev - ys => {
                let found =
                    self.without_x_find(&[Kind::Minimum, Kind::Extremum], true, y_prev.min(y) - ys);
                self.push_found(found, (p.x + x_prev) / 2.0, Kind::Minimum, y_prev - ys);
            }
            Some(Kind::Minimum) if y < y_prev + ys => {
                let found = self.without_x_find(
                    &[Kind::Maximum, Kind::Extremum],
                    false,
                    y_prev.max(y) + ys,
                );
                self.push_found(found, (p.x + x_prev) / 2.0, Kind::Maximum, y_prev + ys);
            }
            _ => {}
        }
        let added = Pt {
            kind: Kind::Point,
            ..p
        };
        self.points.push(added);
        added
    }

    /// The point without `x` found, made an extremum of `as_kind` at `x`,
    /// or a point at `y`.
    fn push_found(&mut self, found: Option<usize>, x: f64, as_kind: Kind, y: f64) {
        let p = match found {
            Some(i) => {
                let f = self.without_x.remove(i);
                Pt {
                    kind: as_kind,
                    x,
                    y: f.y,
                    slope: Some(0.0),
                }
            }
            None => Pt {
                kind: Kind::Point,
                x,
                y: Some(y),
                slope: None,
            },
        };
        self.points.push(p);
    }
}

/// The spline's pieces (`computeSplineParamCoeffs`): for each two points
/// in order, the first's `x` and the cubic `c0 + c1 t + c2 t^2 + c3 t^3`
/// in `t = x - x0`, with value and slope of each point at its ends.
fn spline(pts: &[Pt]) -> Vec<(f64, [f64; 4])> {
    pts.windows(2)
        .map(|w| {
            let (p0, p1) = (w[0], w[1]);
            let (x1, x2, t1, t2) = (num(p0.y), num(p1.y), num(p0.slope), num(p1.slope));
            let s2 = p1.x - p0.x;
            let mut c = [
                x1,
                t1,
                ((-3.0 * x1) / s2 + (3.0 * x2) / s2 - 2.0 * t1 - t2) / s2,
                ((2.0 * x1) / s2 - (2.0 * x2) / s2 + t1 + t2) / (s2 * s2),
            ];
            // Nearly quadratic or linear but for roundoff: exactly so.
            if c[3].abs() < 1e-14 * c[0].abs().max(c[1].abs()).max(c[2].abs()) {
                c[3] = 0.0;
                if c[2].abs() < 1e-14 * c[0].abs().max(c[1].abs()) {
                    c[2] = 0.0;
                }
            }
            (p0.x, c)
        })
        .collect()
}

/// How many cells a piece takes among an `Interpolate` instruction's
/// outputs: its expression and its domain's four.
pub(crate) const PIECE_OUT: usize = 5;

/// The most pieces a spline through `n` prescribed points has: each adds
/// itself and at most two points before it, and the ends one each.
pub(crate) const fn max_pieces(n: usize) -> usize {
    3 * n + 1
}

impl Engine {
    /// The pieces of the spline through `given` (ADR 0061), into `out`:
    /// first the pieces as one value, a list of tuples (expression, its
    /// domain's four), for a reader (`Document::function_value`); then
    /// [`PIECE_OUT`] cells each, its expression in the variable `var` and
    /// its domain (the first from -∞, the last to ∞, each closed on its
    /// left), the rest left out (a domain of NaN, ADR 0049).
    pub(crate) fn interpolate(
        &mut self,
        given: &[Given],
        xscale: f64,
        yscale: f64,
        var: &str,
        out: &mut [f64],
    ) {
        out.fill(f64::NAN);
        let (whole, out) = out.split_at_mut(1);
        let mut list = Vec::new();
        let xscale = if xscale.is_finite() && xscale > 0.0 {
            xscale
        } else {
            1.0
        };
        let yscale = if yscale.is_finite() && yscale > 0.0 {
            yscale
        } else {
            1.0
        };
        let Some(pts) = interpolation_points(given, xscale, yscale) else {
            whole[0] = self.store(Expr::Seq(SeqKind::List, list)).to_value();
            return;
        };
        let pieces = spline(&pts);
        let n = pieces.len();
        for (k, (x0, c)) in pieces.into_iter().enumerate() {
            let Some(cells) = out.chunks_exact_mut(PIECE_OUT).nth(k) else {
                break;
            };
            let t = Expr::Add(vec![Expr::sym(var), number(-x0)]);
            let mul = |a: Expr| Expr::Mul(vec![a, t.clone()]);
            let horner = Expr::Add(vec![
                mul(Expr::Add(vec![
                    mul(Expr::Add(vec![mul(number(c[3])), number(c[2])])),
                    number(c[1]),
                ])),
                number(c[0]),
            ]);
            cells[1] = if k == 0 { f64::NEG_INFINITY } else { x0 };
            cells[2] = if k + 1 == n {
                f64::INFINITY
            } else {
                pts[k + 1].x
            };
            cells[3] = if k == 0 { 0.0 } else { 1.0 };
            cells[4] = 0.0;
            let mut piece = vec![horner.clone()];
            piece.extend(cells[1..].iter().map(|&v| number(v)));
            list.push(Expr::Seq(SeqKind::Tuple, piece));
            cells[0] = self.store(horner).to_value();
        }
        whole[0] = self.store(Expr::Seq(SeqKind::List, list)).to_value();
    }
}

/// The value of piece `h` (`Handle`) at `x`, for a test.
#[cfg(test)]
fn at(engine: &mut Engine, h: f64, x: f64) -> f64 {
    engine.evaluate(Handle::from_value(h), Some(("x", x)))
}

#[cfg(test)]
#[path = "interpolate.spec.rs"]
mod spec;

//! A point's constraints as one operator, [`VecOp::Constrain`](crate::program::VecOp::Constrain) (ADR 0080):
//! the constraints apply in document order, each to the previous one's
//! result, as the current core applies a point's `<constraints>`; the
//! operator also says whether any of them applied (`constraintUsed`).
//!
//! The operator reads the point's coordinates as asked (its first two
//! inputs) and then a *program*: each constraint is a code followed by its
//! operands, all of them inputs, the codes constant ones. A request on the
//! point writes the constraints applied to what was asked, so a point
//! dragged comes to rest where its constraints put it, and is constrained
//! again when read, as in the current core (`constraints.js`, whose
//! inverse applies them too).
//!
//! | code           | operands                                              | applies                                                        |
//! |----------------|-------------------------------------------------------|----------------------------------------------------------------|
//! | `GRID`         | dx, dy, xoffset, yoffset                              | each coordinate to its grid line, where that is a number       |
//! | `ATTRACT_GRID` | dx, dy, xoffset, yoffset, xthreshold, ythreshold,     | each coordinate within its threshold of a grid line to it; both|
//! |                | gridlines                                             | must be, unless `gridlines` (0/1)                              |
//! | `BOUNDS`       | xmin, xmax, ymin, ymax, buffer                        | each coordinate held in the graph's bounds, `buffer` of the    |
//! |                |                                                       | width in from each                                             |
//! | `NEAREST`      | sx, sy, n, then n targets                             | the nearest point of the nearest target (`<constrainTo>`)      |
//! | `ATTRACT`      | sx, sy, threshold, n, then n targets                  | that, when within `threshold` in the scales (`<attractTo>`)    |
//! | `INTERIOR`     | sx, sy, n, then n targets                             | unchanged inside a target, else onto the nearest one's edge    |
//!
//! A target is a code and its points: `LINE`, `SEGMENT` and `RAY` (two
//! points, a ray from the first through the second), `POINT` (one),
//! `CIRCLE` (its center and radius), and `POLYGON` and `POLYLINE` (`n`,
//! then `n` points). `sx`, `sy` are the graph's scales when the constraint
//! is `relativeToGraphScales`, else 1: a line, a segment and a ray are
//! projected in them, and an attraction's distance is measured in them,
//! as in the current core.

use super::scalar::js_round;

/// The codes of a constraint program: a constraint's, then a target's.
pub mod code {
    /// `<constrainToGrid>`.
    pub const GRID: f64 = 1.0;
    /// `<attractToGrid>`.
    pub const ATTRACT_GRID: f64 = 2.0;
    /// `<constrainToGraph>`.
    pub const BOUNDS: f64 = 3.0;
    /// `<constrainTo>`.
    pub const NEAREST: f64 = 4.0;
    /// `<attractTo>`.
    pub const ATTRACT: f64 = 5.0;
    /// `<constrainToInterior>`.
    pub const INTERIOR: f64 = 6.0;

    /// A line through two points.
    pub const LINE: f64 = 16.0;
    /// A segment between two points.
    pub const SEGMENT: f64 = 17.0;
    /// A ray from a point through another.
    pub const RAY: f64 = 18.0;
    /// A point.
    pub const POINT: f64 = 19.0;
    /// A circle: its center and radius.
    pub const CIRCLE: f64 = 20.0;
    /// A closed polygon: how many vertices, then each.
    pub const POLYGON: f64 = 21.0;
    /// An open polyline: how many vertices, then each.
    pub const POLYLINE: f64 = 22.0;

    /// How many operands a target of `code` reads after its code, given
    /// the count that follows a polygon's; None for no target's code.
    pub fn target_operands(code: f64, count: f64) -> Option<usize> {
        Some(match code {
            LINE | SEGMENT | RAY => 4,
            POINT => 2,
            CIRCLE => 3,
            POLYGON | POLYLINE => 1 + 2 * count as usize,
            _ => return None,
        })
    }
}

/// What a component a point may be constrained to is, as its type
/// declares it (`constrain_target { ports: [x1, y1, x2, y2], shape: Line
/// }`): which target of a constraint program its props make, in order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Target {
    /// A line through its two points.
    Line,
    /// A segment between its two points.
    Segment,
    /// A ray from its first point through its second.
    Ray,
    /// A point.
    Point,
    /// A circle: its center and radius.
    Circle,
}

impl Target {
    /// Its code in a constraint program.
    pub fn code(self) -> f64 {
        match self {
            Target::Line => code::LINE,
            Target::Segment => code::SEGMENT,
            Target::Ray => code::RAY,
            Target::Point => code::POINT,
            Target::Circle => code::CIRCLE,
        }
    }
}

/// The inputs of a constraint program, read in order.
struct Reader<'a> {
    inp: &'a [f64],
    at: usize,
}

impl<'a> Reader<'a> {
    fn next(&mut self) -> Option<f64> {
        let v = *self.inp.get(self.at)?;
        self.at += 1;
        Some(v)
    }
    fn take(&mut self, n: usize) -> Option<&'a [f64]> {
        let s = self.inp.get(self.at..self.at + n)?;
        self.at += n;
        Some(s)
    }
}

/// The point `(x, y)` with the constraints of `program` applied in order,
/// and whether any applied. A program that ends early applies what it
/// holds.
pub fn apply(x: f64, y: f64, program: &[f64]) -> (f64, f64, bool) {
    let mut p = [x, y];
    let mut used = false;
    let mut r = Reader {
        inp: program,
        at: 0,
    };
    while let Some(c) = r.next() {
        let applied = match c {
            code::GRID => {
                let Some(&[dx, dy, xo, yo]) = r.take(4).map(|s| <&[f64; 4]>::try_from(s).unwrap())
                else {
                    break;
                };
                let mut any = false;
                for (v, (d, o)) in p.iter_mut().zip([(dx, xo), (dy, yo)]) {
                    if let Some(g) = grid(*v, d, o) {
                        *v = g;
                        any = true;
                    }
                }
                any
            }
            code::ATTRACT_GRID => {
                let Some(&[dx, dy, xo, yo, xt, yt, lines]) =
                    r.take(7).map(|s| <&[f64; 7]>::try_from(s).unwrap())
                else {
                    break;
                };
                let near =
                    |v: f64, d: f64, o: f64, t: f64| grid(v, d, o).filter(|g| (v - g).abs() < t);
                let (gx, gy) = (near(p[0], dx, xo, xt), near(p[1], dy, yo, yt));
                if lines != 0.0 && !lines.is_nan() {
                    // Each coordinate on its own, as the current core
                    // applies a constraint that holds them apart.
                    if let Some(g) = gx {
                        p[0] = g;
                    }
                    if let Some(g) = gy {
                        p[1] = g;
                    }
                    gx.is_some() || gy.is_some()
                } else if let (Some(gx), Some(gy)) = (gx, gy) {
                    p = [gx, gy];
                    true
                } else {
                    false
                }
            }
            code::BOUNDS => {
                let Some(&[xmin, xmax, ymin, ymax, buffer]) =
                    r.take(5).map(|s| <&[f64; 5]>::try_from(s).unwrap())
                else {
                    break;
                };
                let mut any = false;
                for (v, (lo, hi)) in p.iter_mut().zip([(xmin, xmax), (ymin, ymax)]) {
                    if !(v.is_finite() && lo.is_finite() && hi.is_finite()) {
                        continue;
                    }
                    let (mut lo, mut hi) = (lo, hi);
                    if buffer > 0.0 {
                        let adjust = buffer * (hi - lo);
                        lo += adjust;
                        hi -= adjust;
                    }
                    *v = hi.min(*v).max(lo);
                    any = true;
                }
                any
            }
            code::NEAREST | code::ATTRACT | code::INTERIOR => {
                let Some(&[sx, sy]) = r.take(2).map(|s| <&[f64; 2]>::try_from(s).unwrap()) else {
                    break;
                };
                let threshold = if c == code::ATTRACT { r.next() } else { None };
                let Some(n) = r.next() else { break };
                let scales = [positive_or_one(sx), positive_or_one(sy)];
                let mut best: Option<([f64; 2], f64)> = None;
                let mut inside = false;
                for _ in 0..n.max(0.0) as usize {
                    let Some(t) = r.next() else { break };
                    let count = r.inp.get(r.at).copied().unwrap_or(0.0);
                    let Some(k) = code::target_operands(t, count) else {
                        return (p[0], p[1], used);
                    };
                    let Some(ops) = r.take(k) else { break };
                    if !(p[0].is_finite() && p[1].is_finite()) {
                        continue;
                    }
                    if c == code::INTERIOR && contains(t, ops, p) {
                        inside = true;
                    }
                    let Some(q) = nearest(t, ops, p, scales) else {
                        continue;
                    };
                    // An attraction measures in the scales; a constraint
                    // does not, as in the current core.
                    let (wx, wy) = if c == code::ATTRACT {
                        (scales[0], scales[1])
                    } else {
                        (1.0, 1.0)
                    };
                    let d2 = ((p[0] - q[0]) / wx).powi(2) + ((p[1] - q[1]) / wy).powi(2);
                    if best.is_none_or(|(_, b)| d2 < b) {
                        best = Some((q, d2));
                    }
                }
                if inside {
                    true
                } else {
                    match (best, threshold) {
                        (Some((_, d2)), Some(t)) if d2 > t * t => false,
                        (Some((q, _)), _) => {
                            p = q;
                            true
                        }
                        (None, _) => false,
                    }
                }
            }
            _ => break,
        };
        used |= applied;
    }
    (p[0], p[1], used)
}

/// `v` on its grid line of spacing `d` offset by `o`, rounded as
/// `Math.round`; None when that is no number.
fn grid(v: f64, d: f64, o: f64) -> Option<f64> {
    if !v.is_finite() {
        return None;
    }
    let g = js_round((v - o) / d) * d + o;
    g.is_finite().then_some(g)
}

fn positive_or_one(s: f64) -> f64 {
    if s.is_finite() && s > 0.0 { s } else { 1.0 }
}

/// The point of target `t` (its operands `ops`) nearest `p`, lines
/// measured in `scales`; None when it has none (a coordinate that is no
/// number).
fn nearest(t: f64, ops: &[f64], p: [f64; 2], [sx, sy]: [f64; 2]) -> Option<[f64; 2]> {
    let q = match t {
        code::POINT => [ops[0], ops[1]],
        code::CIRCLE => {
            let [cx, cy, r] = [ops[0], ops[1], ops[2]];
            if !(cx.is_finite() && cy.is_finite() && r.is_finite()) {
                return None;
            }
            let theta = (p[1] - cy).atan2(p[0] - cx);
            [cx + r * theta.cos(), cy + r * theta.sin()]
        }
        code::LINE | code::SEGMENT | code::RAY => {
            let (a, b) = ([ops[0] / sx, ops[1] / sy], [ops[2] / sx, ops[3] / sy]);
            let lo = if t == code::LINE {
                f64::NEG_INFINITY
            } else {
                0.0
            };
            let hi = if t == code::SEGMENT {
                1.0
            } else {
                f64::INFINITY
            };
            let [x, y] = along(a, b, [p[0] / sx, p[1] / sy], lo, hi)?;
            [x * sx, y * sy]
        }
        code::POLYGON | code::POLYLINE => {
            let n = ops[0] as usize;
            let v = &ops[1..1 + 2 * n];
            let edges = if t == code::POLYGON {
                n
            } else {
                n.saturating_sub(1)
            };
            let mut best: Option<([f64; 2], f64)> = None;
            for i in 0..edges {
                let j = (i + 1) % n;
                let a = [v[2 * i] / sx, v[2 * i + 1] / sy];
                let b = [v[2 * j] / sx, v[2 * j + 1] / sy];
                let Some([x, y]) = along(a, b, [p[0] / sx, p[1] / sy], 0.0, 1.0) else {
                    continue;
                };
                let q = [x * sx, y * sy];
                let d2 = (p[0] - q[0]).powi(2) + (p[1] - q[1]).powi(2);
                if best.is_none_or(|(_, b)| d2 < b) {
                    best = Some((q, d2));
                }
            }
            best?.0
        }
        _ => return None,
    };
    (q[0].is_finite() && q[1].is_finite()).then_some(q)
}

/// The point of the line from `a` to `b` nearest `p`, its parameter held
/// between `lo` and `hi` (0 at `a`, 1 at `b`); `a` when they coincide.
fn along(a: [f64; 2], b: [f64; 2], p: [f64; 2], lo: f64, hi: f64) -> Option<[f64; 2]> {
    let (dx, dy) = (b[0] - a[0], b[1] - a[1]);
    let len2 = dx * dx + dy * dy;
    if !len2.is_finite() || !a[0].is_finite() || !a[1].is_finite() {
        return None;
    }
    if len2 == 0.0 {
        return Some(a);
    }
    let t = (((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2).clamp(lo, hi);
    Some([a[0] + t * dx, a[1] + t * dy])
}

/// Whether target `t` (its operands `ops`) holds `p` inside it: a circle
/// within its radius, a polygon by the even-odd rule, as the current
/// core's `containsPoint`.
fn contains(t: f64, ops: &[f64], p: [f64; 2]) -> bool {
    match t {
        code::CIRCLE => (p[0] - ops[0]).hypot(p[1] - ops[1]) <= ops[2],
        code::POLYGON => {
            let n = ops[0] as usize;
            let v = &ops[1..1 + 2 * n];
            let mut inside = false;
            for i in 0..n {
                let j = (i + n - 1) % n;
                let (xi, yi, xj, yj) = (v[2 * i], v[2 * i + 1], v[2 * j], v[2 * j + 1]);
                if (yi > p[1]) != (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi {
                    inside = !inside;
                }
            }
            inside
        }
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::code::*;
    use super::*;

    #[test]
    fn a_grid_snaps_each_coordinate() {
        assert_eq!(
            apply(1.2, 3.6, &[GRID, 1.0, 1.0, 0.0, 0.0]),
            (1.0, 4.0, true)
        );
        // An offset grid, and a spacing that is no number snaps nothing.
        assert_eq!(
            apply(1.2, 3.6, &[GRID, 2.0, f64::NAN, 1.0, 0.0]),
            (1.0, 3.6, true)
        );
        assert!(!apply(f64::NAN, f64::NAN, &[GRID, 1.0, 1.0, 0.0, 0.0]).2);
    }

    #[test]
    fn constraints_apply_in_order_each_to_the_last_result() {
        // Two grids, the second offset: the second wins, but the first
        // moves the point it starts from.
        let program = [GRID, 2.0, 2.0, 0.0, 0.0, GRID, 2.0, 2.0, 1.0, 1.0];
        assert_eq!(apply(1.0, 3.1, &program), (3.0, 5.0, true));
        // A grid, then the line y = 0.
        let program = [
            GRID, 1.0, 1.0, 0.0, 0.0, NEAREST, 1.0, 1.0, 1.0, LINE, 0.0, 0.0, 1.0, 0.0,
        ];
        assert_eq!(apply(-1.5, 7.9, &program), (-1.0, 0.0, true));
    }

    #[test]
    fn an_attraction_applies_within_its_threshold() {
        let program = [ATTRACT, 1.0, 1.0, 0.5, 1.0, POINT, 2.0, 2.0];
        assert_eq!(apply(2.3, 2.3, &program), (2.0, 2.0, true));
        assert_eq!(apply(3.0, 3.0, &program), (3.0, 3.0, false));
        // The grid's: both coordinates near, unless grid lines count.
        let grid = |lines| [ATTRACT_GRID, 1.0, 1.0, 0.0, 0.0, 0.2, 0.2, lines];
        assert_eq!(apply(1.1, 2.5, &grid(0.0)), (1.1, 2.5, false));
        assert_eq!(apply(1.1, 2.5, &grid(1.0)), (1.0, 2.5, true));
        assert_eq!(apply(1.1, 1.9, &grid(0.0)), (1.0, 2.0, true));
    }

    #[test]
    fn the_nearest_target_wins() {
        let program = [
            NEAREST, 1.0, 1.0, 2.0, LINE, 0.0, 0.0, 1.0, 0.0, SEGMENT, 0.0, 5.0, 1.0, 5.0,
        ];
        assert_eq!(apply(3.0, 4.0, &program), (1.0, 5.0, true));
        assert_eq!(apply(3.0, 1.0, &program), (3.0, 0.0, true));
    }

    #[test]
    fn an_interior_holds_inside_and_projects_outside() {
        let square = [
            INTERIOR, 1.0, 1.0, 1.0, POLYGON, 4.0, 0.0, 0.0, 2.0, 0.0, 2.0, 2.0, 0.0, 2.0,
        ];
        assert_eq!(apply(1.0, 1.0, &square), (1.0, 1.0, true));
        assert_eq!(apply(3.0, 1.0, &square), (2.0, 1.0, true));
        let circle = [INTERIOR, 1.0, 1.0, 1.0, CIRCLE, 0.0, 0.0, 1.0];
        assert_eq!(apply(0.5, 0.0, &circle), (0.5, 0.0, true));
        let (x, y, _) = apply(2.0, 0.0, &circle);
        assert!((x - 1.0).abs() < 1e-12 && y.abs() < 1e-12);
    }

    #[test]
    fn the_graphs_bounds_hold_inside_a_buffer() {
        let program = [BOUNDS, -10.0, 10.0, -5.0, 5.0, 0.01];
        let (x, y, used) = apply(105.0, -3.0, &program);
        assert!((x - 9.8).abs() < 1e-12 && y == -3.0 && used);
    }
}

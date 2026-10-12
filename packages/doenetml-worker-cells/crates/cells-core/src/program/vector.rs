//! Vector operators: instructions with several inputs and possibly several
//! outputs, used by the geometric components (ADR 0006), by choices (plan
//! 6) and by scoring. Each is a pure
//! function of its inputs with a hand-written inverse rule; none knows which
//! component it serves. Inputs are consecutive entries of `Program::operands`,
//! outputs are consecutive cells.
//!
//! Inverse rules, in one place so they can be judged together:
//!
//! | operator                 | forward                               | inverse (requested outputs → inputs)                                 |
//! |--------------------------|---------------------------------------|----------------------------------------------------------------------|
//! | `Shape` (rigid)          | identity on n points                  | one point requested: rotate (and dilate if allowed) all about the    |
//! |                          |                                       | pivot; several: translate all by the smallest requested shift        |
//! | `CircleCenterPoint`      | (C, P) → (C, |P−C|)                   | center: translate P with C; radius: move P along its ray from C      |
//! | `CirclePoints{n}`        | n points → (circumcenter or midpoint, | center: translate every point; radius: scale every point about the   |
//! |                          | radius)                               | center                                                               |
//! | `CircleTwoPointsRadius`  | (P1, P2, r) → center                  | center: translate both points                                        |
//! | `PolarSlope`             | (P1, m, d) → P1 + d·(cos θ, sin θ)    | P2: write m = dy/dx and the signed distance d                        |
//! | `PolarDirection`         | (P1, u, d) → P1 + d·unit(u) (or ⊥)    | P2: write u = unit(P2 − P1) (rotated back if ⊥) and d = |P2 − P1|   |
//! | `LinePointsFromCoeffs`   | (a, b, c) → two points on ax+by+c=0   | points: translation keeps a, b and rescales c; otherwise all three   |
//! | `ProjectCircle`          | (P, C, r) → nearest point on circle   | projection: the requested point is projected and written to P        |
//! | `ProjectLine`            | (P, A, B) → nearest point on line AB  | projection: the requested point is projected and written to P        |
//! | `First{n}`               | n conditions → position of the first  | none: a request cannot flip a branch                                 |
//! |                          | that holds, or 0                      |                                                                      |
//! | `Choose{n}`              | (choice, n branch cells) → the active | the active branch's cell only                                        |
//! |                          | branch's cell                         |                                                                      |
//! | `WeightedMean{n}`        | (n weights, n credits) → (mean,       | none: credit is not set by a request                                 |
//! |                          | total weight)                         |                                                                      |
//!
//! Inverses that move several points at once hand them to the request
//! engine as one *point group* ([`Produced::group`]); the engine, not the
//! operator, asks what each point would actually become and shifts the free
//! ones when a strict subset is held back (`tick/invert.rs`). A free line or
//! polygon has no instruction at all: its point cells alias the points.

use crate::document::CellIdx;
use crate::tick::invert::PointRequest;

/// The point a rigid shape rotates or dilates about.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Pivot {
    Centroid,
    /// A vertex, 0-based.
    Vertex(u8),
    /// The point held by the instruction's last two inputs.
    Point,
}

/// How a rigid shape may move. One dragged vertex rotates and, if `dilate`,
/// scales the shape about the pivot; several dragged vertices translate it.
/// `rotate` and `translate` switch those off; `min_shrink` bounds a pure
/// dilation.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct RigidOpts {
    pub dilate: bool,
    pub rotate: bool,
    pub translate: bool,
    pub min_shrink: f64,
    pub pivot: Pivot,
}

impl RigidOpts {
    pub const RIGID: RigidOpts = RigidOpts {
        dilate: false,
        rotate: true,
        translate: true,
        min_shrink: 0.1,
        pivot: Pivot::Centroid,
    };
}

/// What an inverse produces: scalar input requests, and point groups that
/// the engine moves together (see `tick::invert::invert_requests`).
#[derive(Debug, Default)]
pub struct Produced {
    pub writes: Vec<(CellIdx, f64)>,
    pub groups: Vec<Vec<PointRequest>>,
}

impl Produced {
    pub fn clear(&mut self) {
        self.writes.clear();
        self.groups.clear();
    }
    pub fn write(&mut self, cell: CellIdx, value: f64) {
        self.writes.push((cell, value));
    }
    pub fn group(&mut self, points: Vec<PointRequest>) {
        self.groups.push(points);
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum VecOp {
    /// Identity on `n` points (2n outputs) that move rigidly. Inputs are the
    /// 2n coordinates followed by a pivot point (NaN unless `Pivot::Point`).
    Shape { n: u8, opts: RigidOpts },
    /// Inputs (cx, cy, px, py); outputs (cx, cy, r).
    CircleCenterPoint,
    /// Inputs 2n point coordinates (n = 2 or 3); outputs (cx, cy, r).
    CirclePoints { n: u8 },
    /// Inputs (x1, y1, x2, y2, r); outputs (cx, cy).
    CircleTwoPointsRadius,
    /// Inputs (x1, y1, m, d); outputs (x2, y2).
    PolarSlope,
    /// Inputs (x1, y1, ux, uy, d); outputs (x2, y2).
    PolarDirection { perpendicular: bool },
    /// Inputs (a, b, c) of ax + by + c = 0; outputs (x1, y1, x2, y2).
    LinePointsFromCoeffs,
    /// Inputs (x, y, cx, cy, r); outputs (x', y').
    ProjectCircle,
    /// Inputs (x, y, x1, y1, x2, y2); outputs (x', y').
    ProjectLine,
    /// A reactive choice's choice cell (ADR 0009): inputs are its `n`
    /// condition cells; the output is the 1-based position of the first
    /// that holds (nonzero, not NaN), or 0. No inverse: a request cannot
    /// flip a branch.
    First { n: u8 },
    /// An interface name of a choice whose branches are all built: inputs
    /// are the choice cell and the name's cell in each of the `n` branches;
    /// the output is the active branch's cell (NaN when none is active).
    /// The inverse writes the active branch only.
    Choose { n: u8 },
    /// Credit over scored items: inputs are `n` weights then `n` credits;
    /// outputs are the weighted mean and the total weight. The mean is 1
    /// when the total weight is 0 (nothing scored), as in the current core.
    /// Means of chunks combine by their totals, so a large section is a
    /// tree of these. No inverse: credit is not set by a request.
    WeightedMean { n: u8 },
}

/// Most inputs a vector operator reads.
pub const MAX_VEC_IN: usize = 64;

/// The input position of the active branch of a `Choose` over `n`
/// branches, from its choice cell's value.
fn active_branch(choice: f64, n: u8) -> Option<usize> {
    (choice >= 1.0 && choice <= n as f64).then_some(choice as usize)
}

impl VecOp {
    pub fn n_in(&self) -> usize {
        match *self {
            VecOp::Shape { n, .. } => 2 * n as usize + 2,
            VecOp::CircleCenterPoint => 4,
            VecOp::CirclePoints { n } => 2 * n as usize,
            VecOp::CircleTwoPointsRadius => 5,
            VecOp::PolarSlope => 4,
            VecOp::PolarDirection { .. } => 5,
            VecOp::LinePointsFromCoeffs => 3,
            VecOp::ProjectCircle => 5,
            VecOp::ProjectLine => 6,
            VecOp::First { n } => n as usize,
            VecOp::Choose { n } => n as usize + 1,
            VecOp::WeightedMean { n } => 2 * n as usize,
        }
    }

    pub fn n_out(&self) -> usize {
        match *self {
            VecOp::Shape { n, .. } => 2 * n as usize,
            VecOp::CircleCenterPoint | VecOp::CirclePoints { .. } => 3,
            VecOp::CircleTwoPointsRadius => 2,
            VecOp::PolarSlope | VecOp::PolarDirection { .. } => 2,
            VecOp::LinePointsFromCoeffs => 4,
            VecOp::ProjectCircle | VecOp::ProjectLine => 2,
            VecOp::First { .. } | VecOp::Choose { .. } => 1,
            VecOp::WeightedMean { .. } => 2,
        }
    }

    /// Forward evaluation. `inp` holds the input values, `out` receives
    /// `n_out()` values.
    pub fn eval(&self, inp: &[f64], out: &mut [f64]) {
        match *self {
            VecOp::Shape { n, .. } => out.copy_from_slice(&inp[..2 * n as usize]),
            VecOp::CircleCenterPoint => {
                out[0] = inp[0];
                out[1] = inp[1];
                out[2] = (inp[2] - inp[0]).hypot(inp[3] - inp[1]);
            }
            VecOp::CirclePoints { n } => {
                let (cx, cy) = center_of_points(inp, n as usize);
                out[0] = cx;
                out[1] = cy;
                out[2] = (inp[0] - cx).hypot(inp[1] - cy);
            }
            VecOp::CircleTwoPointsRadius => {
                let (cx, cy) = circle_two_points_radius(inp[0], inp[1], inp[2], inp[3], inp[4]);
                out[0] = cx;
                out[1] = cy;
            }
            VecOp::PolarSlope => {
                // At distance zero the points coincide whatever the slope
                // (including an undefined one).
                let (cos, sin) = if inp[3] == 0.0 {
                    (0.0, 0.0)
                } else {
                    slope_direction(inp[2])
                };
                out[0] = inp[0] + inp[3] * cos;
                out[1] = inp[1] + inp[3] * sin;
            }
            VecOp::PolarDirection { perpendicular } => {
                let (ux, uy) = unit(inp[2], inp[3]);
                let (dx, dy) = if perpendicular { (uy, -ux) } else { (ux, uy) };
                out[0] = inp[0] + inp[4] * dx;
                out[1] = inp[1] + inp[4] * dy;
            }
            VecOp::LinePointsFromCoeffs => {
                let [x1, y1, x2, y2] = line_points_from_coeffs(inp[0], inp[1], inp[2]);
                out[0] = x1;
                out[1] = y1;
                out[2] = x2;
                out[3] = y2;
            }
            // Kept apart from ProjectLine (unlike `invert`, which shares
            // `project`): merging these arms slowed every vector op's eval,
            // wording-10000's tick by 8%.
            VecOp::ProjectCircle => {
                let (x, y) = project_circle(inp[0], inp[1], inp[2], inp[3], inp[4]);
                out[0] = x;
                out[1] = y;
            }
            VecOp::ProjectLine => {
                let (x, y) = project_line(inp[0], inp[1], inp[2], inp[3], inp[4], inp[5]);
                out[0] = x;
                out[1] = y;
            }
            VecOp::First { n } => {
                out[0] = inp[..n as usize]
                    .iter()
                    .position(|&c| c != 0.0 && !c.is_nan())
                    .map_or(0.0, |k| (k + 1) as f64);
            }
            VecOp::Choose { n } => {
                out[0] = active_branch(inp[0], n).map_or(f64::NAN, |k| inp[k]);
            }
            VecOp::WeightedMean { n } => {
                let (w, c) = inp[..2 * n as usize].split_at(n as usize);
                let total: f64 = w.iter().sum();
                out[0] = if total == 0.0 {
                    1.0
                } else {
                    w.iter().zip(c).map(|(w, c)| w * c).sum::<f64>() / total
                };
                out[1] = total;
            }
        }
    }

    /// Joint inverse. `inputs` are the input cells, `inp` their current
    /// values, `cur` the outputs' current values, `desired` the requested
    /// output values (None = not requested this tick). Appends scalar
    /// requests and point groups to `out`. Returns false to drop the request.
    pub fn invert(
        &self,
        inputs: &[CellIdx],
        inp: &[f64],
        cur: &[f64],
        desired: &[Option<f64>],
        out: &mut Produced,
    ) -> bool {
        let want = |k: usize| desired[k].unwrap_or(cur[k]);
        let point = |i: usize, x: f64, y: f64| PointRequest {
            cells: [inputs[2 * i], inputs[2 * i + 1]],
            values: [x, y],
        };
        match *self {
            VecOp::Shape { n, opts } => invert_rigid(n as usize, opts, inputs, inp, desired, out),
            VecOp::CircleCenterPoint => {
                // A negative radius puts the point on the other side of the
                // center, as the current core does.
                let (cx, cy) = (cur[0], cur[1]);
                let (ncx, ncy, nr) = (want(0), want(1), want(2));
                let (ux, uy) = direction_or_up(inp[2] - cx, inp[3] - cy);
                let p = point(1, ncx + nr * ux, ncy + nr * uy);
                if desired[0].is_some() || desired[1].is_some() {
                    // Center and point travel together; the engine keeps them
                    // together if one of them is held back.
                    out.group(vec![point(0, ncx, ncy), p]);
                } else {
                    out.group(vec![p]);
                }
                true
            }
            VecOp::CirclePoints { n } => {
                let n = n as usize;
                let (cx, cy, r) = (cur[0], cur[1], cur[2]);
                let (ncx, ncy) = (want(0), want(1));
                let scale = if let Some(nr) = desired[2] {
                    if r == 0.0 || !r.is_finite() {
                        1.0
                    } else {
                        nr / r
                    }
                } else {
                    1.0
                };
                let pts = (0..n)
                    .map(|i| {
                        point(
                            i,
                            ncx + (inp[2 * i] - cx) * scale,
                            ncy + (inp[2 * i + 1] - cy) * scale,
                        )
                    })
                    .collect();
                out.group(pts);
                true
            }
            VecOp::CircleTwoPointsRadius => {
                let (dx, dy) = (want(0) - cur[0], want(1) - cur[1]);
                if !dx.is_finite() || !dy.is_finite() {
                    return false;
                }
                out.group(vec![
                    point(0, inp[0] + dx, inp[1] + dy),
                    point(1, inp[2] + dx, inp[3] + dy),
                ]);
                true
            }
            VecOp::PolarSlope => {
                let (dx, dy) = (want(0) - inp[0], want(1) - inp[1]);
                let d = dx.hypot(dy);
                // The distance carries the sign of dx, as in the current core.
                let d = if dx < 0.0 { -d } else { d };
                out.write(inputs[2], dy / dx);
                out.write(inputs[3], d);
                true
            }
            VecOp::PolarDirection { perpendicular } => {
                let (dx, dy) = (want(0) - inp[0], want(1) - inp[1]);
                let d = dx.hypot(dy);
                // A zero displacement has no direction: keep the current one.
                if d > 0.0 {
                    let (ux, uy) = unit(dx, dy);
                    let (ux, uy) = if perpendicular { (-uy, ux) } else { (ux, uy) };
                    out.write(inputs[2], ux);
                    out.write(inputs[3], uy);
                }
                out.write(inputs[4], d);
                true
            }
            VecOp::LinePointsFromCoeffs => {
                let (a, b) = (inp[0], inp[1]);
                let (x1, y1, x2, y2) = (want(0), want(1), want(2), want(3));
                if ![x1, y1, x2, y2].iter().all(|v| v.is_finite()) {
                    return false;
                }
                let (na, nb) = (y2 - y1, x1 - x2);
                if na == 0.0 && nb == 0.0 {
                    return false;
                }
                // Same direction as before: a translation. Keep a and b as the
                // author wrote them and move the constant.
                let same_slope = close_rel(na * b, nb * a);
                if same_slope && a.is_finite() && b.is_finite() {
                    out.write(inputs[2], -(a * x1 + b * y1));
                } else {
                    out.write(inputs[0], na);
                    out.write(inputs[1], nb);
                    out.write(inputs[2], -(na * x1 + nb * y1));
                }
                true
            }
            VecOp::ProjectCircle | VecOp::ProjectLine => {
                let (x, y) = self.project(want(0), want(1), &inp[2..]);
                out.write(inputs[0], x);
                out.write(inputs[1], y);
                true
            }
            VecOp::First { .. } | VecOp::WeightedMean { .. } => false,
            VecOp::Choose { n } => match (active_branch(inp[0], n), desired[0]) {
                (Some(k), Some(d)) => {
                    out.write(inputs[k], d);
                    true
                }
                _ => false,
            },
        }
    }
}

// ---------------------------------------------------------------------------
// Rigid shape inverse
// ---------------------------------------------------------------------------

fn invert_rigid(
    n: usize,
    opts: RigidOpts,
    inputs: &[CellIdx],
    inp: &[f64],
    desired: &[Option<f64>],
    out: &mut Produced,
) -> bool {
    let specified: Vec<usize> = (0..n)
        .filter(|&i| desired[2 * i].is_some() || desired[2 * i + 1].is_some())
        .collect();
    if specified.is_empty() {
        return false;
    }
    let requested: Vec<f64> = (0..2 * n).map(|k| desired[k].unwrap_or(inp[k])).collect();
    if requested.iter().any(|v| !v.is_finite()) {
        return false;
    }
    {
        let RigidOpts {
            dilate,
            rotate,
            translate,
            min_shrink,
            pivot,
        } = opts;
        let one = specified.len() == 1;
        let (rotate, dilate) = (one && rotate, one && dilate);
        if !(rotate || dilate || translate) {
            return false;
        }
        let (px, py) = match pivot {
            Pivot::Centroid => centroid(inp, n),
            Pivot::Vertex(k) if (k as usize) < n => (inp[2 * k as usize], inp[2 * k as usize + 1]),
            Pivot::Vertex(_) => centroid(inp, n),
            Pivot::Point => {
                let (x, y) = (inp[2 * n], inp[2 * n + 1]);
                if x.is_finite() && y.is_finite() {
                    (x, y)
                } else {
                    centroid(inp, n)
                }
            }
        };
        let target: Vec<f64> = if rotate || dilate {
            let i = specified[0];
            let (ox, oy) = (inp[2 * i] - px, inp[2 * i + 1] - py);
            let (mx, my) = (requested[2 * i] - px, requested[2 * i + 1] - py);
            let om2 = ox * ox + oy * oy;
            let (c, s) = if rotate {
                let theta = my.atan2(mx) - oy.atan2(ox);
                let stretch = if dilate {
                    if om2 == 0.0 {
                        1.0
                    } else {
                        ((mx * mx + my * my) / om2).sqrt()
                    }
                } else {
                    1.0
                };
                (stretch * theta.cos(), stretch * theta.sin())
            } else {
                // Dilation only: project the drag onto the vertex's ray and
                // refuse to shrink below `min_shrink`.
                let om = om2.sqrt();
                let dot = mx * ox + my * oy;
                let factor = if om == 0.0 {
                    1.0
                } else if !(dot >= min_shrink * om) {
                    min_shrink / om
                } else {
                    dot / om2
                };
                (factor, 0.0)
            };
            (0..n)
                .flat_map(|j| {
                    let (rx, ry) = (inp[2 * j] - px, inp[2 * j + 1] - py);
                    [c * rx - s * ry + px, s * rx + c * ry + py]
                })
                .collect()
        } else {
            // Translate by the smallest requested shift in each axis.
            let mut min = [f64::INFINITY, f64::INFINITY];
            for k in 0..2 * n {
                if let Some(v) = desired[k] {
                    let d = v - inp[k];
                    if d.abs() < min[k % 2].abs() {
                        min[k % 2] = d;
                    }
                }
            }
            for m in &mut min {
                if !m.is_finite() {
                    *m = 0.0;
                }
            }
            (0..2 * n).map(|k| inp[k] + min[k % 2]).collect()
        };
        for k in 0..2 * n {
            out.write(inputs[k], target[k]);
        }
    }
    true
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

fn close_rel(a: f64, b: f64) -> bool {
    let scale = a.abs().max(b.abs()).max(1.0);
    (a - b).abs() <= 1e-12 * scale
}

fn unit(x: f64, y: f64) -> (f64, f64) {
    let m = x.hypot(y);
    if m == 0.0 {
        (f64::NAN, f64::NAN)
    } else {
        (x / m, y / m)
    }
}

/// Unit direction, or straight up when the two points coincide (the current
/// core's through-point default puts the point above the center).
fn direction_or_up(x: f64, y: f64) -> (f64, f64) {
    let m = x.hypot(y);
    if m == 0.0 || !m.is_finite() {
        (0.0, 1.0)
    } else {
        (x / m, y / m)
    }
}

/// (cos θ, sin θ) for θ = atan(m), exact for the axis cases.
fn slope_direction(m: f64) -> (f64, f64) {
    if m == 0.0 {
        (1.0, 0.0)
    } else if m == f64::INFINITY {
        (0.0, 1.0)
    } else if m == f64::NEG_INFINITY {
        (0.0, -1.0)
    } else {
        let t = m.atan();
        (t.cos(), t.sin())
    }
}

fn centroid(p: &[f64], n: usize) -> (f64, f64) {
    let (mut sx, mut sy) = (0.0, 0.0);
    for i in 0..n {
        sx += p[2 * i];
        sy += p[2 * i + 1];
    }
    (sx / n as f64, sy / n as f64)
}

/// Midpoint of two points, or circumcenter of three (NaN when collinear;
/// coincident points fall back to the center of the distinct ones).
fn center_of_points(p: &[f64], n: usize) -> (f64, f64) {
    if n == 2 {
        return ((p[0] + p[2]) / 2.0, (p[1] + p[3]) / 2.0);
    }
    let (ax, ay, bx, by, cx, cy) = (p[0], p[1], p[2], p[3], p[4], p[5]);
    let same = |x1: f64, y1: f64, x2: f64, y2: f64| x1 == x2 && y1 == y2;
    if same(ax, ay, bx, by) && same(ax, ay, cx, cy) {
        return (ax, ay);
    }
    if same(ax, ay, bx, by) {
        return ((ax + cx) / 2.0, (ay + cy) / 2.0);
    }
    if same(ax, ay, cx, cy) || same(bx, by, cx, cy) {
        return ((ax + bx) / 2.0, (ay + by) / 2.0);
    }
    let d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    if d == 0.0 {
        return (f64::NAN, f64::NAN);
    }
    let (a2, b2, c2) = (ax * ax + ay * ay, bx * bx + by * by, cx * cx + cy * cy);
    let ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
    let uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
    (ux, uy)
}

/// The current core's closed form for a circle of radius `r` through two
/// points: NaN when the points are too far apart, the point-on-top rule
/// when they coincide.
fn circle_two_points_radius(x1: f64, y1: f64, x2: f64, y2: f64, r: f64) -> (f64, f64) {
    let dist2 = (x1 - x2).powi(2) + (y1 - y2).powi(2);
    let r2 = r * r;
    if r < 0.0 || 4.0 * r2 < dist2 {
        return (f64::NAN, f64::NAN);
    }
    if dist2 == 0.0 {
        return (x1, y1 - r);
    }
    let root = ((4.0 * r2 - dist2) * dist2).sqrt();
    let cx = 0.5 * (dist2 * (x1 + x2) + (y1 - y2) * root) / dist2;
    let cy = 0.5 * (dist2 * (y1 + y2) + (x2 - x1) * root) / dist2;
    (cx, cy)
}

/// Two points on ax + by + c = 0, oriented as the current core orients them
/// (toward +x, or +y for a vertical line).
fn line_points_from_coeffs(a: f64, b: f64, c: f64) -> [f64; 4] {
    let denom = a * a + b * b;
    if denom == 0.0 || !denom.is_finite() || !c.is_finite() {
        return [f64::NAN; 4];
    }
    let sign = if b > 0.0 {
        -1.0
    } else if b < 0.0 {
        1.0
    } else if a < 0.0 {
        -1.0
    } else {
        1.0
    };
    let (ax, bx, cx) = (a * sign, b * sign, c * sign);
    [
        (2.0 * bx - ax * cx) / denom,
        (-2.0 * ax - bx * cx) / denom,
        (bx - ax * cx) / denom,
        -(ax + bx * cx) / denom,
    ]
}

impl VecOp {
    /// The point of a projection's curve nearest (x, y); `onto` is the
    /// circle (cx, cy, r) or the line's two points.
    #[inline]
    fn project(&self, x: f64, y: f64, onto: &[f64]) -> (f64, f64) {
        match self {
            VecOp::ProjectCircle => project_circle(x, y, onto[0], onto[1], onto[2]),
            _ => project_line(x, y, onto[0], onto[1], onto[2], onto[3]),
        }
    }
}

fn project_circle(x: f64, y: f64, cx: f64, cy: f64, r: f64) -> (f64, f64) {
    let (dx, dy) = (x - cx, y - cy);
    let m = dx.hypot(dy);
    if m == 0.0 {
        return (cx, cy + r);
    }
    (cx + dx / m * r, cy + dy / m * r)
}

fn project_line(x: f64, y: f64, x1: f64, y1: f64, x2: f64, y2: f64) -> (f64, f64) {
    let (dx, dy) = (x2 - x1, y2 - y1);
    let len2 = dx * dx + dy * dy;
    if len2 == 0.0 {
        return (x1, y1);
    }
    let t = ((x - x1) * dx + (y - y1) * dy) / len2;
    (x1 + t * dx, y1 + t * dy)
}

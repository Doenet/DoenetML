//! Sticky groups (ADR 0007): the snapping rule. A member a request moves is
//! pulled onto the vertices and edges of the group's other members when it
//! comes within the threshold. This file is the rule only: a pure function
//! of the dragged member's requested vertices and the other members'
//! current ones. Which cells it reads and where its result goes is the
//! request pre-pass's business (`document/sticky.rs`, ADR 0007).
//!
//! The rule is the current core's (`StickyGroup.js`, `constraints.js`,
//! `constraintUtils.js`), ported line for line, including its quirks, so the
//! oracle's numbers come out the same. What is left out is Tier 3 of
//! `docs/history/plan-4.md`: a rigid or similarity shape dragged by one vertex
//! (rotation snapping, which the current core does through a pre-snap
//! reference cache). Such a drag is not snapped.

pub type Pt = [f64; 2];

const EPS: f64 = 1e-6;
const EPS2: f64 = EPS * EPS;

/// How a member's points attract: a point is one vertex; a polygon is a
/// closed chain of edges; a line segment (or polyline) is an open one.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Shape {
    Point,
    Closed,
    Open,
}

/// Threshold and axis scales. Distances are measured after dividing each
/// axis by its scale (1 unless the group is relative to graph scales).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Params {
    pub threshold: f64,
    pub scales: Pt,
}

impl Params {
    /// The group's threshold cell (NaN: the default), its
    /// `relativeToGraphScales` flag and the enclosing graph's bounds (NaN
    /// without a graph), as the current core combines them.
    pub fn new(threshold: f64, relative: bool, bounds: [f64; 4]) -> Params {
        let [xmin, xmax, ymin, ymax] = bounds;
        let have_graph = !xmin.is_nan();
        let threshold = if threshold.is_nan() {
            if relative && have_graph { 0.02 } else { 0.5 }
        } else {
            threshold
        };
        let (sx, sy) = (xmax - xmin, ymax - ymin);
        let scales = if relative && sx.is_finite() && sx > 0.0 && sy.is_finite() && sy > 0.0 {
            [sx, sy]
        } else {
            [1.0, 1.0]
        };
        Params { threshold, scales }
    }
}

/// The other members' vertices and edges, gathered once per drag.
#[derive(Debug, Default)]
pub struct Attractors {
    pub points: Vec<Pt>,
    pub segments: Vec<[Pt; 2]>,
}

impl Attractors {
    pub fn add(&mut self, shape: Shape, pts: &[Pt]) {
        self.points.extend_from_slice(pts);
        if shape != Shape::Point {
            for w in pts.windows(2) {
                self.segments.push([w[0], w[1]]);
            }
            if shape == Shape::Closed && pts.len() > 1 {
                self.segments.push([pts[pts.len() - 1], pts[0]]);
            }
        }
    }
}

/// Snap a dragged member. `verts` holds its vertices as requested (the
/// unrequested ones at their current values) and receives the result.
/// `moved` is the one vertex requested, when only one was: that vertex may
/// distort the shape; otherwise the whole shape shifts. `rigid` marks a
/// rigid or similarity shape, whose one-vertex drags are Tier 3 and pass
/// through unsnapped.
pub fn snap(
    shape: Shape,
    rigid: bool,
    verts: &mut [Pt],
    moved: Option<usize>,
    att: &Attractors,
    p: &Params,
) {
    if verts.is_empty() {
        return;
    }
    match shape {
        Shape::Point => verts[0] = snap_point(verts[0], att, p),
        Shape::Closed | Shape::Open => {
            if rigid && moved.is_some() {
                return;
            }
            let closed = shape == Shape::Closed;
            let (enforce_rigid, allow_rotation) = if moved.is_some() {
                (false, true)
            } else {
                (true, false)
            };
            let after_edges = constrain_edges(verts, closed, enforce_rigid, allow_rotation, att, p);
            let out = constrain_vertices(&after_edges, closed, enforce_rigid, moved, att, p);
            verts.copy_from_slice(&out);
        }
    }
}

/// One member of a group, as the wirings describe it: its shape, whether
/// it is rigid, and its points as indices into the group's point list. Two
/// members that share a point (a polygon whose vertex is a member point)
/// share the index.
#[derive(Debug, Clone, PartialEq)]
pub struct Member {
    pub shape: Shape,
    pub rigid: bool,
    pub points: Vec<u32>,
}

/// Snap every dragged member of a group. `current` holds each point's
/// value; `requested` the value asked of it this tick (None: not asked).
/// A member is dragged when any of its points is requested. Dragged
/// members, and every member sharing a point with one, do not attract.
/// Each dragged member snaps against the rest on its own, the one with
/// the most requested points first; a point an earlier member already
/// placed is not placed again. Returns the points to write, per dragged
/// member, in that order: the requested ones and any the snap moved.
pub fn snap_group(
    members: &[Member],
    current: &[Pt],
    requested: &[Option<Pt>],
    p: &Params,
) -> Vec<Vec<(u32, Pt)>> {
    let n_req = |m: &Member| {
        m.points
            .iter()
            .filter(|&&i| requested[i as usize].is_some())
            .count()
    };
    let mut dragged: Vec<usize> = (0..members.len())
        .filter(|&m| n_req(&members[m]) > 0)
        .collect();
    if dragged.is_empty() {
        return Vec::new();
    }
    dragged.sort_by_key(|&m| std::cmp::Reverse(n_req(&members[m])));
    let mut busy = vec![false; current.len()];
    for &m in &dragged {
        for &i in &members[m].points {
            busy[i as usize] = true;
        }
    }
    let mut att = Attractors::default();
    let mut pts: Vec<Pt> = Vec::new();
    for m in members {
        if m.points.iter().any(|&i| busy[i as usize]) {
            continue;
        }
        pts.clear();
        pts.extend(m.points.iter().map(|&i| current[i as usize]));
        att.add(m.shape, &pts);
    }
    let mut placed = vec![false; current.len()];
    let mut out = Vec::with_capacity(dragged.len());
    for m in dragged {
        let mem = &members[m];
        if mem
            .points
            .iter()
            .all(|&i| placed[i as usize] || requested[i as usize].is_none())
        {
            continue;
        }
        pts.clear();
        pts.extend(
            mem.points
                .iter()
                .map(|&i| requested[i as usize].unwrap_or(current[i as usize])),
        );
        let asked: Vec<usize> = (0..mem.points.len())
            .filter(|&k| requested[mem.points[k] as usize].is_some())
            .collect();
        let moved = if asked.len() == 1 {
            Some(asked[0])
        } else {
            None
        };
        snap(mem.shape, mem.rigid, &mut pts, moved, &att, p);
        let mut writes = Vec::new();
        for (k, &i) in mem.points.iter().enumerate() {
            let changed =
                pts[k] != current[i as usize] && !(pts[k][0].is_nan() && pts[k][1].is_nan());
            if !placed[i as usize] && (requested[i as usize].is_some() || changed) {
                placed[i as usize] = true;
                writes.push((i, pts[k]));
            }
        }
        out.push(writes);
    }
    out
}

// ---------------------------------------------------------------------------
// Points (`pointConstraintFunction`)
// ---------------------------------------------------------------------------

fn snap_point(v: Pt, att: &Attractors, p: &Params) -> Pt {
    let t2 = p.threshold * p.threshold;
    let (best, d2) = closest_point(v, &att.points, p.scales);
    if d2 < t2 {
        return best;
    }
    let (best, d2) = closest_on_segments(v, &att.segments, p.scales);
    if d2 < t2 { best } else { v }
}

fn scaled_dist2(a: Pt, b: Pt, s: Pt) -> f64 {
    ((a[0] - b[0]) / s[0]).powi(2) + ((a[1] - b[1]) / s[1]).powi(2)
}

fn dist2(a: Pt, b: Pt) -> f64 {
    (a[0] - b[0]).powi(2) + (a[1] - b[1]).powi(2)
}

/// The candidate nearest `v` in scaled distance, and that distance; `v`
/// and infinity when there is none.
fn closest(v: Pt, candidates: impl Iterator<Item = Pt>, s: Pt) -> (Pt, f64) {
    let (mut best, mut d2) = (v, f64::INFINITY);
    for q in candidates {
        let d = scaled_dist2(v, q, s);
        if d < d2 {
            best = q;
            d2 = d;
        }
    }
    (best, d2)
}

fn closest_point(v: Pt, points: &[Pt], s: Pt) -> (Pt, f64) {
    closest(v, points.iter().copied(), s)
}

fn closest_on_segments(v: Pt, segments: &[[Pt; 2]], s: Pt) -> (Pt, f64) {
    closest(
        v,
        segments
            .iter()
            .filter_map(|seg| nearest_on_segment(v, seg, s)),
        s,
    )
}

/// Nearest point of a segment (`nearestPointForSegment`); None for a
/// degenerate or non-numeric segment.
fn nearest_on_segment(v: Pt, seg: &[Pt; 2], s: Pt) -> Option<Pt> {
    let t = segment_param(v, seg, s)?;
    let [a, b] = *seg;
    Some(if t <= 0.0 {
        a
    } else if t >= 1.0 {
        b
    } else {
        [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
    })
}

/// Nearest point of the segment's line (`nearestPointForSegmentAsLine`).
fn nearest_on_line(v: Pt, seg: &[Pt; 2], s: Pt) -> Option<Pt> {
    let t = segment_param(v, seg, s)?;
    let [a, b] = *seg;
    Some([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])
}

fn segment_param(v: Pt, seg: &[Pt; 2], s: Pt) -> Option<f64> {
    let [a, b] = *seg;
    if !(a[0].is_finite() && a[1].is_finite() && b[0].is_finite() && b[1].is_finite())
        || (a[0] == b[0] && a[1] == b[1])
    {
        return None;
    }
    let (bx, by) = ((b[0] - a[0]) / s[0], (b[1] - a[1]) / s[1]);
    let denom = bx * bx + by * by;
    Some((((v[0] - a[0]) / s[0]) * bx + ((v[1] - a[1]) / s[1]) * by) / denom)
}

// ---------------------------------------------------------------------------
// Vertices (`vertexConstraintSub` and `returnVertexConstraintFunction`)
// ---------------------------------------------------------------------------

/// Snap vertices to points or edges, then unconstrained edges onto points.
/// Rigid: find the one translation that leaves the most vertices on a
/// target, ties to the smallest.
fn constrain_vertices(
    verts: &[Pt],
    closed: bool,
    enforce_rigid: bool,
    moved: Option<usize>,
    att: &Attractors,
    p: &Params,
) -> Vec<Pt> {
    let only = if enforce_rigid { None } else { moved };
    let (constrained, used) = vertex_sub(verts, closed, only, att, p);
    if !used.iter().any(|&u| u) {
        return verts.to_vec();
    }
    if !enforce_rigid {
        return constrained;
    }
    let mut best: Vec<Pt> = Vec::new();
    let mut max_unmoved = 0;
    for i in 0..verts.len() {
        if !used[i] {
            continue;
        }
        let tr = [
            constrained[i][0] - verts[i][0],
            constrained[i][1] - verts[i][1],
        ];
        let shifted: Vec<Pt> = verts.iter().map(|v| [v[0] + tr[0], v[1] + tr[1]]).collect();
        let (again, used_again) = vertex_sub(&shifted, closed, None, att, p);
        let unmoved = (0..shifted.len())
            .filter(|&j| {
                used_again[j]
                    && (again[j][0] - shifted[j][0]).abs() <= EPS
                    && (again[j][1] - shifted[j][1]).abs() <= EPS
            })
            .count();
        if unmoved > max_unmoved {
            best.clear();
            best.push(tr);
            max_unmoved = unmoved;
        } else if unmoved == max_unmoved {
            best.push(tr);
        }
    }
    let tr = if best.len() == 1 {
        best[0]
    } else {
        let mut min = [0.0, 0.0];
        let mut min2 = f64::INFINITY;
        for t in &best {
            let m = t[0] * t[0] + t[1] * t[1];
            if m < min2 {
                min2 = m;
                min = *t;
            }
        }
        if !(min2 > 0.0) {
            return verts.to_vec();
        }
        min
    };
    verts.iter().map(|v| [v[0] + tr[0], v[1] + tr[1]]).collect()
}

fn vertex_sub(
    verts: &[Pt],
    closed: bool,
    only: Option<usize>,
    att: &Attractors,
    p: &Params,
) -> (Vec<Pt>, Vec<bool>) {
    let t2 = p.threshold * p.threshold;
    let s = p.scales;
    let n = verts.len();
    let mut out = verts.to_vec();
    let mut used = vec![false; n];
    for (i, &v) in verts.iter().enumerate() {
        if only.is_some_and(|o| o != i) {
            continue;
        }
        let (q, d2) = closest_point(v, &att.points, s);
        if d2 < t2 {
            out[i] = q;
            used[i] = true;
            continue;
        }
        let (q, d2) = closest_on_segments(v, &att.segments, s);
        if d2 < t2 {
            out[i] = q;
            used[i] = true;
        }
    }

    // An edge whose two vertices are both free may move onto a point.
    struct EdgeSnap {
        v1: usize,
        v2: usize,
        d2: f64,
        seg: [Pt; 2],
    }
    let mut found: Vec<EdgeSnap> = Vec::new();
    let stop = if closed { n } else { n.saturating_sub(1) };
    for v1 in 0..stop {
        let v2 = (v1 + 1) % n;
        if only.is_some_and(|o| o != v1 && o != v2) {
            continue;
        }
        if used[v1] || used[v2] {
            continue;
        }
        let (p1, p2) = (verts[v1], verts[v2]);
        let mut closest = f64::INFINITY;
        let mut seg = [p1, p2];
        for &a in &att.points {
            let Some(cp) = nearest_on_segment(a, &[p1, p2], s) else {
                continue;
            };
            let d2 = dist2(cp, a);
            if !(d2 < closest) {
                continue;
            }
            match only {
                None => {
                    // Translate the edge so it passes through the point.
                    let (dx, dy) = (a[0] - cp[0], a[1] - cp[1]);
                    seg = [[p1[0] + dx, p1[1] + dy], [p2[0] + dx, p2[1] + dy]];
                    closest = d2;
                }
                Some(o) => {
                    // Pivot the moved vertex about the fixed one, keeping the
                    // edge's length, so the edge passes through the point.
                    let fixed = if o == v1 { p2 } else { p1 };
                    let disp = [a[0] - fixed[0], a[1] - fixed[1]];
                    let ratio = dist2(p1, p2).sqrt() / disp[0].hypot(disp[1]);
                    if ratio < 1.0 {
                        continue; // the point is beyond the edge's end
                    }
                    let m = [fixed[0] + disp[0] * ratio, fixed[1] + disp[1] * ratio];
                    let (cand, d2) = if o == v1 {
                        ([m, p2], dist2(p1, m))
                    } else {
                        ([p1, m], dist2(p2, m))
                    };
                    if d2 < closest {
                        closest = d2;
                        seg = cand;
                    }
                }
            }
        }
        if closest < t2 {
            found.push(EdgeSnap {
                v1,
                v2,
                d2: closest,
                seg,
            });
        }
    }
    found.sort_by(|a, b| a.d2.total_cmp(&b.d2));
    for f in found {
        if !(used[f.v1] || used[f.v2]) {
            used[f.v1] = true;
            used[f.v2] = true;
            out[f.v1] = f.seg[0];
            out[f.v2] = f.seg[1];
        }
    }
    (out, used)
}

// ---------------------------------------------------------------------------
// Edges (`edgeConstraintSub` and `returnVertexConstraintFunctionFromEdges`)
// ---------------------------------------------------------------------------

/// Snap edges onto other members' edges. Rigid: move the whole shape by the
/// least-moved edge's motion; otherwise move edges one at a time, least
/// moved first, skipping any that disagree with an earlier one.
fn constrain_edges(
    verts: &[Pt],
    closed: bool,
    enforce_rigid: bool,
    allow_rotation: bool,
    att: &Attractors,
    p: &Params,
) -> Vec<Pt> {
    let n = verts.len();
    let mut edges: Vec<[Pt; 2]> = (1..n).map(|i| [verts[i - 1], verts[i]]).collect();
    if closed {
        edges.push([verts[n - 1], verts[0]]);
    }
    let t2 = p.threshold * p.threshold;
    // (edge, squared deviation, constrained edge)
    let mut moved: Vec<(usize, f64, [Pt; 2])> = Vec::new();
    for (k, e) in edges.iter().enumerate() {
        if let Some(c) = attract_segment(*e, allow_rotation, t2, att, p.scales) {
            moved.push((k, dist2(e[0], c[0]) + dist2(e[1], c[1]), c));
        }
    }
    if moved.is_empty() {
        return verts.to_vec();
    }
    if !enforce_rigid {
        moved.sort_by(|a, b| a.1.total_cmp(&b.1));
        let mut out = verts.to_vec();
        let mut done = vec![false; n];
        for (k, _, c) in moved {
            let (v1, v2) = (k, (k + 1) % n);
            if (done[v1] && dist2(out[v1], c[0]) > EPS2)
                || (done[v2] && dist2(out[v2], c[1]) > EPS2)
            {
                continue;
            }
            out[v1] = c[0];
            out[v2] = c[1];
            done[v1] = true;
            done[v2] = true;
        }
        return out;
    }
    let (mut k_min, mut d_min) = (0, f64::INFINITY);
    for &(k, d, _) in &moved {
        if d < d_min {
            d_min = d;
            k_min = k;
        }
    }
    let c = moved.iter().find(|m| m.0 == k_min).unwrap().2;
    let u = edges[k_min];
    let tr = [c[0][0] - u[0][0], c[0][1] - u[0][1]];
    let theta =
        (c[1][1] - c[0][1]).atan2(c[1][0] - c[0][0]) - (u[1][1] - u[0][1]).atan2(u[1][0] - u[0][0]);
    let (sin, cos) = theta.sin_cos();
    verts
        .iter()
        .map(|v| {
            let (dx, dy) = (v[0] + tr[0] - c[0][0], v[1] + tr[1] - c[0][1]);
            [c[0][0] + dx * cos - dy * sin, c[0][1] + dx * sin + dy * cos]
        })
        .collect()
}

/// `attractSegment`: the closest other edge the segment can lie along, with
/// its length kept, if within the threshold. The current core screens
/// candidates against a threshold widened a thousandfold when rotation is
/// allowed (for its rotation fallbacks, which are Tier 3), then keeps only a
/// result within the real threshold; the screen is kept since it decides
/// which candidates are seen.
fn attract_segment(
    seg: [Pt; 2],
    allow_rotation: bool,
    t2: f64,
    att: &Attractors,
    s: Pt,
) -> Option<[Pt; 2]> {
    let screen = if allow_rotation { t2 * 1000.0 } else { t2 };
    let mut best = None;
    let mut min = f64::INFINITY;
    for target in &att.segments {
        if let Some((d2, c)) = attracted_points(seg[0], seg[1], allow_rotation, screen, target, s)
            && d2 < min
        {
            min = d2;
            best = Some(c);
        }
    }
    if min < t2 { best } else { None }
}

/// `findAttractedSegmentPoints`.
fn attracted_points(
    p1: Pt,
    p2: Pt,
    allow_rotation: bool,
    t2: f64,
    target: &[Pt; 2],
    s: Pt,
) -> Option<(f64, [Pt; 2])> {
    let (n1, n2) = onto_line(p1, p2, t2, target, s, true)?;
    if !allow_rotation {
        let d = (n2[1] - n1[1]).atan2(n2[0] - n1[0]) - (p2[1] - p1[1]).atan2(p2[0] - p1[0]);
        let d = (d + std::f64::consts::PI).rem_euclid(2.0 * std::f64::consts::PI)
            - std::f64::consts::PI;
        if d.abs() > EPS {
            return None;
        }
    }
    let (orig, new) = (dist2(p1, p2), dist2(n1, n2));
    if (orig - new).abs() < EPS2 {
        let d2 = dist2(n1, p1) + dist2(n2, p2);
        return (d2 < t2).then_some((d2, [n1, n2]));
    }
    if new > orig {
        return None;
    }
    // Projection pulled the points together: push them back apart along the
    // line, each in proportion to how far it moved.
    let expand = (orig / new).sqrt();
    let (dev1, dev2) = (dist2(p1, n1).sqrt(), dist2(p2, n2).sqrt());
    let f1 = dev1 / (dev1 + dev2);
    let (e1, e2) = ((expand - 1.0) * f1 + 1.0, (expand - 1.0) * (1.0 - f1) + 1.0);
    let x1 = [n2[0] + (n1[0] - n2[0]) * e1, n2[1] + (n1[1] - n2[1]) * e1];
    let x2 = [n1[0] + (n2[0] - n1[0]) * e2, n1[1] + (n2[1] - n1[1]) * e2];
    onto_line(x1, x2, EPS2, target, s, false)?;
    let d2 = dist2(x1, p1) + dist2(x2, p2);
    (d2 < t2).then_some((d2, [x1, x2]))
}

/// `findAttractedSegmentPointsSub`: both points' projections onto the
/// target's line, if each is within the threshold; optionally rejecting two
/// points past the same end of the target.
fn onto_line(
    p1: Pt,
    p2: Pt,
    t2: f64,
    target: &[Pt; 2],
    s: Pt,
    not_one_sided: bool,
) -> Option<(Pt, Pt)> {
    let n1 = nearest_on_line(p1, target, s)?;
    if !(dist2(n1, p1) < t2) {
        return None;
    }
    let n2 = nearest_on_line(p2, target, s)?;
    if !(dist2(n2, p2) < t2) {
        return None;
    }
    if not_one_sided {
        let close = |a: Pt, b: Pt| (a[0] - b[0]).abs() < EPS && (a[1] - b[1]).abs() < EPS;
        let s1 = nearest_on_segment(p1, target, s);
        let s2 = nearest_on_segment(p2, target, s);
        let u1 = s1.is_some_and(|q| close(q, n1));
        let u2 = s2.is_some_and(|q| close(q, n2));
        if !(u1 || u2)
            && let (Some(a), Some(b)) = (s1, s2)
            && dist2(a, b) < EPS2
        {
            return None;
        }
    }
    Some((n1, n2))
}

#[cfg(test)]
mod tests {
    use super::*;

    const P: Params = Params {
        threshold: 0.5,
        scales: [1.0, 1.0],
    };

    fn group(members: &[(Shape, &[Pt])]) -> Attractors {
        let mut a = Attractors::default();
        for (s, pts) in members {
            a.add(*s, pts);
        }
        a
    }

    fn close(a: &[Pt], b: &[Pt]) {
        assert_eq!(a.len(), b.len());
        for (x, y) in a.iter().zip(b) {
            assert!(
                (x[0] - y[0]).abs() < 1e-12 && (x[1] - y[1]).abs() < 1e-12,
                "{a:?} != {b:?}"
            );
        }
    }

    fn translate(v: &[Pt], d: Pt) -> Vec<Pt> {
        v.iter().map(|p| [p[0] + d[0], p[1] + d[1]]).collect()
    }

    // The first scene of the current core's stickygroup.test.ts.
    const TRI: [Pt; 3] = [[1.0, 2.0], [4.0, 5.0], [-2.0, 5.0]];
    const QUAD: [Pt; 4] = [[7.0, 8.0], [5.0, 4.0], [9.0, 1.0], [7.0, 3.0]];

    #[test]
    fn translation_snaps_vertex_to_vertex() {
        let att = group(&[(Shape::Closed, &QUAD), (Shape::Point, &[[-6.0, 2.0]])]);
        let mut v = translate(&TRI, [0.8, -1.2]);
        snap(Shape::Closed, true, &mut v, None, &att, &P);
        close(&v, &translate(&TRI, [1.0, -1.0]));
    }

    #[test]
    fn far_translation_does_not_snap() {
        let att = group(&[(Shape::Closed, &QUAD)]);
        let mut v = translate(&TRI, [-3.0, 0.0]);
        let want = v.clone();
        snap(Shape::Closed, false, &mut v, None, &att, &P);
        close(&v, &want);
    }

    #[test]
    fn point_snaps_to_vertex_then_edge() {
        let att = group(&[(Shape::Closed, &QUAD)]);
        let mut v = [[5.2, 4.3]];
        snap(Shape::Point, false, &mut v, None, &att, &P);
        close(&v, &[[5.0, 4.0]]);
        // Midway along the edge (9,1)–(7,3): onto the edge.
        let mut v = [[8.2, 2.2]];
        snap(Shape::Point, false, &mut v, None, &att, &P);
        close(&v, &[[8.0, 2.0]]);
    }

    #[test]
    fn one_vertex_of_a_free_shape_snaps_alone() {
        let att = group(&[(Shape::Point, &[[10.0, 10.0]])]);
        let mut v = QUAD.to_vec();
        v[0] = [9.8, 10.1];
        snap(Shape::Closed, false, &mut v, Some(0), &att, &P);
        let mut want = QUAD.to_vec();
        want[0] = [10.0, 10.0];
        close(&v, &want);
    }

    #[test]
    fn one_vertex_of_a_rigid_shape_is_not_snapped() {
        let att = group(&[(Shape::Point, &[[10.0, 10.0]])]);
        let mut v = QUAD.to_vec();
        v[0] = [9.8, 10.1];
        let want = v.clone();
        snap(Shape::Closed, true, &mut v, Some(0), &att, &P);
        close(&v, &want);
    }

    #[test]
    fn a_member_sharing_a_point_with_the_dragged_one_does_not_attract() {
        // Point 0 is a member on its own and the first vertex of a triangle.
        let members = vec![
            Member {
                shape: Shape::Point,
                rigid: false,
                points: vec![0],
            },
            Member {
                shape: Shape::Closed,
                rigid: false,
                points: vec![0, 1, 2],
            },
            Member {
                shape: Shape::Point,
                rigid: false,
                points: vec![3],
            },
        ];
        let current = [[0.0, 0.0], [4.0, 0.0], [0.0, 4.0], [10.0, 10.0]];
        let mut requested = vec![None; 4];
        for (i, r) in requested.iter_mut().enumerate().take(3) {
            *r = Some([current[i][0] + 0.2, current[i][1] + 0.1]);
        }
        let w = snap_group(&members, &current, &requested, &P);
        // The triangle moves as asked; its own vertex 0 does not pull it back.
        assert_eq!(w.len(), 1);
        assert_eq!(
            w[0],
            vec![(0, [0.2, 0.1]), (1, [4.2, 0.1]), (2, [0.2, 4.1])]
        );
        // Point 3 does attract.
        requested[0] = Some([9.8, 9.9]);
        requested[1] = None;
        requested[2] = None;
        let w = snap_group(&members, &current, &requested, &P);
        assert_eq!(w[0], vec![(0, [10.0, 10.0])]);
    }

    #[test]
    fn relative_threshold_uses_graph_scales() {
        let p = Params::new(f64::NAN, true, [-10.0, 10.0, -10.0, 10.0]);
        assert_eq!(
            p,
            Params {
                threshold: 0.02,
                scales: [20.0, 20.0]
            }
        );
        assert_eq!(Params::new(f64::NAN, false, [f64::NAN; 4]).threshold, 0.5);
        assert_eq!(
            Params::new(0.3, true, [f64::NAN; 4]),
            Params {
                threshold: 0.3,
                scales: [1.0, 1.0]
            }
        );
    }
}

//! Vector operators: instructions with several inputs and possibly several
//! outputs, used by the geometric components, by choices and by scoring. Each
//! is a pure function of its inputs with a hand-written inverse rule. Inputs
//! are consecutive entries of [`Program::operands`](crate::program::Program::operands), outputs are consecutive
//! cells.
//!
//! Inverse rules; the last column is the inputs each inverse may write
//! ([`VecOp::writes`]):
//!
//! | operator                 | forward                               | inverse (requested outputs → inputs)                                 | writes            |
//! |--------------------------|---------------------------------------|----------------------------------------------------------------------|-------------------|
//! | `Shape` (rigid)          | identity on n points                  | one point requested: rotate (and dilate if allowed) all about the    | the n points,     |
//! |                          |                                       | pivot; several: translate all by the smallest requested shift        | never the pivot   |
//! | `CircleCenterPoint`      | (C, P) → (C, |P−C|)                   | center: translate P with C; radius: move P along its ray from C      | C, P              |
//! | `CirclePoints{n}`        | n points → (circumcenter or midpoint, | center: translate every point; radius: scale every point about the   | every point       |
//! |                          | radius)                               | center                                                               |                   |
//! | `CircleTwoPointsRadius`  | (P1, P2, r) → center                  | center: translate both points                                        | P1, P2, never r   |
//! | `PolarSlope`             | (P1, m, d) → P1 + d·(cos θ, sin θ)    | P2: write m = dy/dx and the signed distance d                        | m, d              |
//! | `PolarDirection`         | (P1, u, d) → P1 + d·unit(u) (or ⊥)    | P2: write u = unit(P2 − P1) (rotated back if ⊥) and d = |P2 − P1|   | u, d              |
//! | `LinePointsFromCoeffs`   | (a, b, c) → two points on ax+by+c=0   | points: translation keeps a, b and rescales c; otherwise all three   | a, b, c           |
//! | `ProjectCircle`          | (P, C, r) → nearest point on circle   | projection: the requested point is projected and written to P        | P                 |
//! | `ProjectLine`            | (P, A, B) → nearest point on line AB  | projection: the requested point is projected and written to P        | P                 |
//! | `First{n}`               | n conditions → position of the first  | none: a request cannot flip a branch                                 | none              |
//! |                          | that holds, or 0                      |                                                                      |                   |
//! | `Choose{n}`              | (choice, n branch cells) → the active | the active branch's cell only                                        | every branch cell,|
//! |                          | branch's cell                         |                                                                      | never the choice  |
//! | `WeightedMean{n}`        | (n weights, n credits) → (mean,       | none: credit is not set by a request                                 | none              |
//! |                          | total weight)                         |                                                                      |                   |
//! | `Centroid{n}`            | n points → their mean                 | translate every point by the requested center's shift                | every point       |
//! | `SequencePick{m}`        | (draw, from, step, to, m excludes) →  | none: what the seed chose does not move (ADR 0037)                   | none              |
//! |                          | a value of the sequence, less the     |                                                                      |                   |
//! |                          | excludes, the draw indexes            |                                                                      |                   |
//! | `Reduce{op, n}`          | n inputs → one value: a sum, a        | none: an operator component's result is not set by a request, as in  | none              |
//! |                          | statistic or a connective             | the current core                                                     |                   |
//! | `Wrap`                   | (x, lo, hi) → x wrapped into [lo, hi) | projection: the requested value wrapped, written to x                | x                 |
//! | `Pair{by}`               | (P, Q) → (A, B), by [`PairBy`]        | each coordinate apart: a point and an offset keep the offset unless  | P, Q              |
//! |                          |                                       | the far point is asked; a midpoint and an offset move both ends      |                   |
//! | `Extent`                 | (a, b) → the distance from a to b     | both ends about their midpoint, the order kept, a negative size 0    | a, b              |
//! | `AngleAt{reflex}`        | (P1, V, P3) → the angle at V          | none: an angle through points is not set by a request                | none              |
//! | `RegularPolygon{n, by}`  | (P, Q) → the n vertices about a       | one vertex: turn and scale about the center; several: the center     | P, Q              |
//! |                          | center, by [`RegularBy`]              | moves to their mean, the first sets the turn and size                |                   |
//! | `Scan{op, n}`            | n inputs → running sums, products,    | none: an operator component's result is not set by a request         | none              |
//! |                          | minima, maxima, or differences        |                                                                      |                   |
//! | `Sort{n}`                | n inputs → them in order              | none                                                                 | none              |
//! | `Shuffle{n}`             | (draw, n inputs) → them in the order  | none: what the seed chose does not move (ADR 0037)                   | none              |
//! |                          | the draw permutes them to             |                                                                      |                   |
//! | `Draws{dist, n, m}`      | (draw, parameters, m excludes) → n    | none: what the seed chose does not move (ADR 0037)                   | none              |
//! |                          | values of a distribution              |                                                                      |                   |
//! | `Moments{dist, m}`       | (parameters, m excludes) → the mean,  | none: a distribution's moments are not set by a request              | none              |
//! |                          | variance and standard deviation       |                                                                      |                   |
//! | `BestFitLine{n}`         | n points → (a, b, c) of the           | none: a fit is not set by a request                                  | none              |
//! |                          | least-squares line ax + by + c = 0    |                                                                      |                   |
//! | `IntersectLines{..}`     | (P1, P2, P3, P4) → where line P1P2    | none: an intersection is not set by a request                        | none              |
//! |                          | crosses P3P4, and whether none does   |                                                                      |                   |
//! | `Parabola{n, vertex}`    | (a, vertex, n points) → (a, b, c) and | a vertex asked for keeps a; the vertex to the vertex asked for, each | a, the vertex,    |
//! |                          | the vertex of the parabola through    | point vertically onto the parabola asked for (sideways with the      | the points (or a, |
//! |                          | them (or (a, b, c) → the same)        | vertex), a when asked (or a, b, c themselves)                        | b, c)             |
//! | `IntoDomain`             | (x, domain) → x held in the domain,   | projection: the requested value held in the domain, written to x     | x                 |
//! |                          | a step inside an open end             |                                                                      |                   |
//! | `DomainRange`            | (xmin, xmax, lo, hi) → the range cut  | none: a curve's range is not set by a request                        | none              |
//! |                          | to the domain                         |                                                                      |                   |
//! | `DomainHull{n}`          | n domains → the least interval        | none: a piecewise function's domain is not set by a request          | none              |
//! |                          | holding them                          |                                                                      |                   |
//! | `SequenceParams{given}`  | the given of (from, to, step, length) | none: a structural sequence's shape is not set by a request          | none              |
//! |                          | → (from, step, length)                |                                                                      |                   |
//! | `SequenceCount{m}`       | (from, step, length, m excludes) →    | none                                                                 | none              |
//! |                          | how many values are not excluded      |                                                                      |                   |
//! | `SequenceEntry{m}`       | (k, from, step, length, m excludes) → | none                                                                 | none              |
//! |                          | the k-th value not excluded           |                                                                      |                   |
//!
//! Inverses that move several points at once hand them to the request
//! engine as one *point group* ([`Produced::group`]).

use crate::index::CellIdx;
use crate::program::Range;
use crate::program::scalar::{nan_max, nan_min};
use crate::tick::invert::PointRequest;
use std::f64::consts::{PI, TAU};

/// The point a rigid shape rotates or dilates about.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Pivot {
    /// The mean of its vertices.
    Centroid,
    /// A vertex, 0-based.
    Vertex(u8),
    /// The point held by the instruction's last two inputs.
    Point,
}

/// How a rigid shape may move. One dragged vertex rotates and, if `dilate`,
/// scales the shape about the pivot; several dragged vertices translate it.
/// `rotate` and `translate` switch those off. How far a pure dilation may
/// shrink the shape is an input.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct RigidOpts {
    /// Whether one dragged vertex also scales the shape.
    pub dilate: bool,
    /// Whether one dragged vertex rotates the shape.
    pub rotate: bool,
    /// Whether several dragged vertices translate the shape.
    pub translate: bool,
    /// The point it rotates and scales about.
    pub pivot: Pivot,
}

impl RigidOpts {
    /// A rigid shape: it rotates about its centroid and translates, never scales.
    pub const RIGID: RigidOpts = RigidOpts {
        dilate: false,
        rotate: true,
        translate: true,
        pivot: Pivot::Centroid,
    };
}

/// How a [`VecOp::Pair`] makes its two points `A`, `B` from its two input
/// points `P`, `Q`, coordinate by coordinate.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PairBy {
    /// `A = P`, `B = P + Q`: a point and an offset (a ray's endpoint and
    /// direction, a rectangle's corner and size). A request on `A` alone
    /// keeps the offset.
    Offset,
    /// `A = P - Q`, `B = P`: the far point and the offset back from it. A
    /// request on `B` alone keeps the offset.
    Back,
    /// `A = P`, `B = 2Q - P`: a point and the midpoint. A request on `A`
    /// alone keeps the midpoint.
    Mirror,
    /// `A = P - Q/2`, `B = P + Q/2`: the midpoint and the offset. A
    /// request on one end keeps the other.
    Center,
}

/// Which of the two angles at a vertex a [`VecOp::AngleAt`] gives, as
/// `chooseReflexAngle` says.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Reflex {
    /// The one of at most π.
    Never,
    /// The one counterclockwise from the first ray to the second.
    Allowed,
    /// The one of at least π.
    Always,
}

/// How a [`VecOp::RegularPolygon`] finds its center `C` and first vertex
/// `V` from its two input points `P`, `Q`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum RegularBy {
    /// `C = P`, `V = Q`.
    CenterVertex,
    /// `C = P`, `V = P + Q`.
    CenterOffset,
    /// `V = P`, `C = P + Q`.
    VertexOffset,
    /// `V = P`, and `Q` the next vertex counterclockwise.
    Adjacent,
}

/// What an inverse produces: scalar input requests, and point groups that the
/// engine moves together.
#[derive(Debug, Default)]
pub struct Produced {
    /// Requests on scalar input cells: each cell with its new value.
    pub writes: Vec<(CellIdx, f64)>,
    /// Point groups: the points in each one move together.
    pub groups: Vec<Vec<PointRequest>>,
}

impl Produced {
    /// Drop every request, keeping the allocations.
    pub fn clear(&mut self) {
        self.writes.clear();
        self.groups.clear();
    }
    /// Request `value` for input `cell`.
    pub fn write(&mut self, cell: CellIdx, value: f64) {
        self.writes.push((cell, value));
    }
    /// Request that `points` move together, as one point group.
    pub fn group(&mut self, points: Vec<PointRequest>) {
        self.groups.push(points);
    }
}

/// A vector operator: one instruction with several outputs, such as a rigid
/// shape's points or a circle through three points.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum VecOp {
    /// Identity on `n` points (2n outputs) that move rigidly. Inputs are the
    /// 2n coordinates, a pivot point (NaN unless [`Pivot::Point`]), and the
    /// least a pure dilation may shrink the shape to (`minShrink`).
    Shape {
        /// How many points.
        n: u8,
        /// How the shape may move.
        opts: RigidOpts,
    },
    /// Inputs (cx, cy, px, py); outputs (cx, cy, r).
    CircleCenterPoint,
    /// Inputs 2n point coordinates (n = 2 or 3); outputs (cx, cy, r).
    CirclePoints {
        /// How many points: 2 or 3.
        n: u8,
    },
    /// Inputs (x1, y1, x2, y2, r); outputs (cx, cy).
    CircleTwoPointsRadius,
    /// Inputs (x1, y1, m, d); outputs (x2, y2).
    PolarSlope,
    /// Inputs (x1, y1, ux, uy, d); outputs (x2, y2).
    PolarDirection {
        /// Whether to go along `u` turned a quarter turn clockwise instead.
        perpendicular: bool,
    },
    /// Inputs (a, b, c) of ax + by + c = 0; outputs (x1, y1, x2, y2).
    LinePointsFromCoeffs,
    /// Inputs (x, y, cx, cy, r); outputs (x', y').
    ProjectCircle,
    /// Inputs (x, y, x1, y1, x2, y2); outputs (x', y').
    ProjectLine,
    /// A reactive choice's choice cell: inputs are its `n` condition cells; the
    /// output is the 1-based position of the first that holds (nonzero, not
    /// NaN), or 0. No inverse: a request cannot flip a branch.
    First {
        /// How many conditions.
        n: u8,
    },
    /// An interface name of a choice whose branches are all built, or an
    /// entry by a cell index (`$r[$k]`, `$P[$k]`): inputs are the choice
    /// cell and the name's cell in each of the `n` branches; the output is
    /// the active branch's cell, missing when none is active: a choice that is
    /// not an integer from 1 to `n` (ADR 0041). The inverse writes the
    /// active branch only.
    Choose {
        /// How many branches.
        n: u8,
    },
    /// Credit over scored items: inputs are `n` weights then `n` credits;
    /// outputs are the weighted mean and the total weight. The mean is 1 when
    /// the total weight is 0 (nothing scored). No inverse: credit is not set by
    /// a request.
    WeightedMean {
        /// How many scored items.
        n: u8,
    },
    /// Input 0 held between inputs 1 and 2; NaN if any is NaN. A request
    /// projects onto the bounds and writes input 0.
    Clamp,
    /// Inputs 2n point coordinates (n ≥ 1); outputs (cx, cy), their mean:
    /// a polygon's center. A request on it translates every point by the
    /// shift, as one point group.
    Centroid {
        /// How many points.
        n: u8,
    },
    /// A `<selectFromSequence>`'s pick (ADR 0037): inputs are a draw in
    /// `[0, 1)`, `from`, `step`, `to` and `n_exclude` excluded values; the
    /// output is the value of `from, from + step, ..., to` that the draw
    /// indexes among those not excluded, as the JavaScript core's
    /// `getSingleIndex` does. NaN when there is none, which the check
    /// makes sure no build meets. No inverse.
    SequencePick {
        /// How many excluded values follow `to`.
        n_exclude: u8,
    },
    /// One value of `n` inputs ([`Reduction`]): an operator component's
    /// sum, statistic or connective. No inverse.
    Reduce {
        /// What it computes.
        op: Reduction,
        /// How many inputs.
        n: u8,
    },
    /// Input 0 wrapped periodically into the interval between inputs 1
    /// and 2 ([`wrap_periodic`]). A request writes input 0 wrapped.
    Wrap,
    /// Inputs (px, py, qx, qy); outputs (ax, ay, bx, by): two points made
    /// from a point and an offset or a midpoint, as `by` says. A ray's or
    /// a vector's two points, a rectangle's opposite corners.
    Pair {
        /// How the outputs follow from the inputs.
        by: PairBy,
    },
    /// Inputs (a, b); output the distance from `a` to `b`: a rectangle's
    /// width or height. A request moves both ends about their midpoint.
    Extent,
    /// Inputs (x1, y1, x, y, x3, y3); output the angle at (x, y) from the
    /// ray through the first point to the ray through the third, in
    /// radians, NaN when a coordinate is not finite. No inverse.
    AngleAt {
        /// Which of the two angles.
        reflex: Reflex,
    },
    /// Inputs (px, py, qx, qy); outputs the `n` vertices of a regular
    /// polygon, counterclockwise from its first vertex `V` about its
    /// center `C`, which follow from the inputs as `by` says.
    RegularPolygon {
        /// How many vertices.
        n: u8,
        /// How the center and first vertex follow from the inputs.
        by: RegularBy,
    },
    /// `n` inputs to a list of values over their prefixes ([`Scan`]): an
    /// operator component's running sum, product, minimum or maximum (`n`
    /// outputs), or its successive differences (`n - 1`). No inverse.
    Scan {
        /// What it computes.
        op: Scan,
        /// How many inputs.
        n: u8,
    },
    /// `n` inputs in order, increasing, or decreasing when `decreasing`;
    /// a NaN last. No inverse.
    Sort {
        /// How many inputs.
        n: u8,
        /// Whether the greatest comes first.
        decreasing: bool,
    },
    /// Inputs a draw in `[0, 1)` and `n` values; the outputs are the values
    /// in an order the draw picks ([`draw_stream`]). No inverse: what the
    /// seed chose does not move (ADR 0037).
    Shuffle {
        /// How many values.
        n: u8,
    },
    /// `n` values of a distribution ([`Dist`]), drawn at load (ADR 0037):
    /// inputs a draw in `[0, 1)`, the distribution's parameters
    /// ([`Dist::n_params`]) and `n_exclude` excluded values. The draw seeds
    /// a stream of uniform numbers ([`draw_stream`]), the first of which is
    /// the draw itself. NaN where the distribution has too few values to
    /// draw from, which the check makes sure no build meets. No inverse.
    Draws {
        /// The distribution.
        dist: Dist,
        /// How many values.
        n: u8,
        /// How many excluded values follow the parameters.
        n_exclude: u8,
    },
    /// The mean, variance and standard deviation of a distribution
    /// ([`Dist`]), a whole distribution's as the current core's samplers
    /// report them: inputs its parameters ([`Dist::n_params`]) and
    /// `n_exclude` excluded values. NaN where the parameters describe no
    /// distribution, and for primes. No inverse.
    Moments {
        /// The distribution.
        dist: Dist,
        /// How many excluded values follow the parameters.
        n_exclude: u8,
    },
    /// Inputs 2n point coordinates; outputs (a, b, c) of the least-squares
    /// line `a x + b y + c = 0` through the points whose coordinates are
    /// finite, as `y = m x + k`: (m, -1, k). Points all at one x give the
    /// horizontal line through their mean; no finite point, NaN. No
    /// inverse: a fit is not set by a request.
    BestFitLine {
        /// How many points.
        n: u8,
    },
    /// Inputs (x1, y1, x2, y2, x3, y3, x4, y4): the line through the first
    /// two points and the one through the last two. Outputs (x, y, none):
    /// where they cross and 0, or NaN, NaN and 1 when they are parallel,
    /// the same, not finite, or a segment among them misses the crossing.
    /// No inverse: an intersection is not set by a request.
    IntersectLines {
        /// Whether the first line is the segment between its points.
        segment1: bool,
        /// Whether the second is.
        segment2: bool,
    },
    /// The coefficients (a, b, c) of the parabola `y = a x² + b x + c` and
    /// its vertex (x, y), through `through` points (0 to 3), with its
    /// vertex at a point when `vertex`, as the current core finds them.
    /// Inputs: the leading coefficient used where the points leave it
    /// free, the vertex when `vertex`, then the points; with neither, the
    /// three coefficients. A request on the vertex asks for the parabola
    /// of the same `a` with that vertex; one on the coefficients moves the
    /// vertex and the points onto the parabola asked for, and writes the
    /// leading coefficient.
    Parabola {
        /// How many points it passes through.
        through: u8,
        /// Whether a vertex is given (with at most one point).
        vertex: bool,
    },
    /// Input 0 held in the domain of inputs 1 to 4 (lower and upper
    /// endpoints, whether each is closed; [`in_domain`](crate::program::in_domain)):
    /// at a closed end it stops there, at an open one [`open_step`] inside
    /// it; NaN only when input 0 is. A point constrained to a function
    /// with a domain (ADR 0049). A request writes input 0 held.
    IntoDomain,
    /// Inputs (xmin, xmax, lo, hi); outputs (xmin, xmax) cut to the
    /// interval from `lo` to `hi`, an endpoint that is no number no bound:
    /// the range a function's curve is sampled over (ADR 0049). No inverse.
    DomainRange,
    /// Inputs `n` domains of four cells each (lower, upper, lower closed,
    /// upper closed); outputs the least interval holding them, as four
    /// cells, a domain with an endpoint that is no number left out, the
    /// whole line when every one is: a `<piecewiseFunction>`'s domain from
    /// its pieces' (ADR 0049). No inverse.
    DomainHull {
        /// How many domains.
        n: u8,
    },
    /// A structural `<sequence>`'s parameters (ADR 0041): inputs the ones
    /// `given` has a bit for of `from`, `to`, `step` and `length` (bits 0
    /// to 3), in that order; outputs `from`, `step` and `length` as the
    /// current core's `calculateSequenceParameters` gives them from
    /// whichever are given ([`sequence_parameters`]), a length of 0 when
    /// one is no number. No inverse.
    SequenceParams {
        /// Which of the four are given, a bit each.
        given: u8,
    },
    /// Inputs `from`, `step`, `length` and `n_exclude` values to leave out;
    /// output how many of `from, from + step, ...` (`length` of them) are
    /// left ([`sequence_values`]), at most [`MAX_SEQUENCE`]: a structural
    /// sequence's count. A missing exclude leaves nothing out. No inverse.
    SequenceCount {
        /// How many excluded values follow `length`.
        n_exclude: u8,
    },
    /// Inputs `k`, `from`, `step`, `length` and `n_exclude` values to leave
    /// out; output the `k`-th (from 1) value left, the missing value past
    /// the count: entry `k` of a structural sequence. No inverse.
    SequenceEntry {
        /// How many excluded values follow `length`.
        n_exclude: u8,
    },
}

/// The most numbers a structural sequence counts (ADR 0041): its count is
/// a repeat's, one scope per number.
pub const MAX_SEQUENCE: usize = 1000;

/// From, step and length of a sequence of numbers, as the current core's
/// `calculateSequenceParameters` gives them from whichever of `from`,
/// `to`, `step` and `length` are given (`from` 1, `step` 1 and `length` 10
/// by default; `to` and `length` give the step); None when all four are.
pub fn sequence_parameters(
    from: Option<f64>,
    to: Option<f64>,
    step: Option<f64>,
    length: Option<f64>,
) -> Option<(f64, f64, f64)> {
    // The count of a run from `a` to `b` by `s`, rounded as the current
    // core rounds it.
    let count = |a: f64, b: f64, s: f64| (((b - a) / s + 1.0) * (1.0 + 1e-14)).floor();
    Some(match (from, to) {
        (None, None) => (1.0, step.unwrap_or(1.0), length.unwrap_or(10.0)),
        (None, Some(to)) => {
            let step = step.unwrap_or(1.0);
            let length = length.unwrap_or_else(|| count(1.0, to, step));
            (to - step * (length - 1.0), step, length)
        }
        (Some(from), None) => (from, step.unwrap_or(1.0), length.unwrap_or(10.0)),
        (Some(from), Some(to)) => match (step, length) {
            (None, None) => (from, 1.0, count(from, to, 1.0)),
            (None, Some(length)) => (from, (to - from) / (length - 1.0), length),
            (Some(step), None) => (from, step, count(from, to, step)),
            (Some(_), Some(_)) => return None,
        },
    })
}

/// The numbers `from, from + step, ...`, `length` of them, less those
/// `exclude` holds (within a relative 1e-10), in order: a length that is
/// no whole number, or below 0, is none, as the current core warns and
/// takes.
pub fn sequence_values(
    from: f64,
    step: f64,
    length: f64,
    exclude: &[f64],
) -> impl Iterator<Item = f64> + '_ {
    let length = if length.is_finite() && length >= 0.0 && length.fract() == 0.0 {
        length as usize
    } else {
        0
    };
    (0..length)
        .map(move |k| if k == 0 { from } else { from + step * k as f64 })
        .filter(move |v| {
            !exclude
                .iter()
                .any(|x| (x - v).abs() <= 1e-10 * v.abs().max(1.0))
        })
}

/// What a [`VecOp::Scan`] computes over the prefixes of its inputs, as the
/// current core's list operators (`<cumulativeSum>` and its kin) do.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Scan {
    /// The running sum.
    Sum,
    /// The running product.
    Product,
    /// The running minimum.
    Min,
    /// The running maximum.
    Max,
    /// Each input less the one before it: one fewer output.
    Differences,
}

/// The order a [`Dist`] of several values leaves them in.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Order {
    /// As drawn.
    Unsorted,
    /// Least first.
    Increasing,
    /// Greatest first.
    Decreasing,
}

/// What a [`VecOp::Draws`] draws from, and the parameters it reads after
/// the draw.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Dist {
    /// (from, to): uniform between them.
    Uniform,
    /// (mean, standard deviation): normal.
    Gaussian,
    /// (from, step, to): a value of `from, from + step, ..., to` less the
    /// excludes, as [`VecOp::SequencePick`] draws one; without
    /// replacement, no value twice.
    Sequence {
        /// Whether a value may be drawn again.
        replace: bool,
        /// The order of the values drawn.
        order: Order,
    },
    /// (from, to): a prime from `from` to `to` less the excludes; without
    /// replacement, no prime twice.
    Primes {
        /// Whether a value may be drawn again.
        replace: bool,
        /// The order of the values drawn.
        order: Order,
    },
}

impl Dist {
    /// How many parameters it reads after the draw.
    pub const fn n_params(self) -> usize {
        match self {
            Dist::Uniform | Dist::Gaussian | Dist::Primes { .. } => 2,
            Dist::Sequence { .. } => 3,
        }
    }
}

/// What a [`VecOp::Reduce`] computes of its inputs, as the current core's
/// operator components do over their operands. A NaN operand makes a
/// numeric result NaN; a connective passes over it, as a missing operand
/// (ADR 0041).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Reduction {
    /// The sum.
    Sum,
    /// The product.
    Product,
    /// The mean.
    Mean,
    /// The median: the middle value, or the mean of the two middle ones.
    Median,
    /// The variance of inputs 1 on: a population's when input 0 holds,
    /// else a sample's.
    Variance,
    /// The square root of [`Reduction::Variance`].
    StandardDeviation,
    /// The least.
    Min,
    /// The greatest.
    Max,
    /// The first mod the second ([`modulo`](crate::program::scalar::modulo));
    /// NaN unless there are two.
    Mod,
    /// The greatest common divisor; NaN unless every input is an integer.
    Gcd,
    /// The least common multiple; NaN unless every input is an integer.
    Lcm,
    /// 1 when every input holds (nonzero).
    All,
    /// 1 when some input holds.
    Any,
    /// 1 when exactly one input holds.
    Xor,
    /// 1 when every input holds as the first does.
    Iff,
    /// None: 1; one: its negation; two: the first implies the second;
    /// more: 0.
    Implies,
    /// Inputs (x, lim1, lim2, strict): 1 when x lies between the limits,
    /// strictly when `strict` holds.
    Between,
    /// The position (from 1) of the least input, the first of equal ones;
    /// 0 with none.
    ArgMin,
    /// The position (from 1) of the greatest input, the first of equal
    /// ones; 0 with none.
    ArgMax,
    /// The position (from 1) among inputs 1 on of the first equal to input
    /// 0; 0 when none is.
    IndexOf,
    /// The position (from 1) at which input 0 would go among inputs 1 on,
    /// which must be in increasing order (a NaN passed over), else 0:
    /// before any equal ones, or after them when `right`. With `unsorted`
    /// the order is not required, and the position is where input 0 goes
    /// among them sorted. 0 with no inputs after the first.
    SearchSorted {
        /// Whether to go after equal ones.
        right: bool,
        /// Whether the inputs may be in any order.
        unsorted: bool,
    },
}

impl Reduction {
    /// Its value over `inp`, as the current core computes it.
    pub fn eval(self, inp: &[f64]) -> f64 {
        let n = inp.len() as f64;
        let bit = |b: bool| if b { 1.0 } else { 0.0 };
        // A connective's operands: a NaN is a missing one, passed over.
        let truths = || inp.iter().filter(|v| !v.is_nan()).map(|&v| v != 0.0);
        match self {
            Reduction::Sum => inp.iter().sum(),
            Reduction::Product => inp.iter().product(),
            Reduction::Mean => inp.iter().sum::<f64>() / n,
            Reduction::Median => {
                if inp.is_empty() || inp.iter().any(|v| v.is_nan()) {
                    return f64::NAN;
                }
                let mut v = inp.to_vec();
                v.sort_by(f64::total_cmp);
                let m = v.len() / 2;
                if v.len() % 2 == 1 {
                    v[m]
                } else {
                    (v[m - 1] + v[m]) / 2.0
                }
            }
            Reduction::Variance => variance(inp),
            Reduction::StandardDeviation => variance(inp).sqrt(),
            Reduction::Min => inp.iter().fold(f64::INFINITY, |a, &c| {
                if a.is_nan() || c.is_nan() {
                    f64::NAN
                } else {
                    a.min(c)
                }
            }),
            Reduction::Max => inp.iter().fold(f64::NEG_INFINITY, |a, &c| {
                if a.is_nan() || c.is_nan() {
                    f64::NAN
                } else {
                    a.max(c)
                }
            }),
            Reduction::Mod => match *inp {
                [a, b] => crate::program::scalar::modulo(a, b),
                _ => f64::NAN,
            },
            Reduction::Gcd | Reduction::Lcm
                if !inp.iter().all(|v| v.is_finite() && v.fract() == 0.0) =>
            {
                f64::NAN
            }
            Reduction::Gcd => gcd(inp),
            Reduction::Lcm => {
                // As the current core: the product over the gcd of the
                // products of the others.
                let prod: f64 = inp.iter().product();
                let others: Vec<f64> = inp.iter().map(|v| prod / v).collect();
                (prod / gcd(&others)).abs()
            }
            Reduction::All => bit(truths().all(|t| t)),
            Reduction::Any => bit(truths().any(|t| t)),
            Reduction::Xor => bit(truths().filter(|&t| t).count() == 1),
            Reduction::Iff => {
                let mut it = truths();
                let first = it.next();
                bit(it.all(|t| Some(t) == first))
            }
            Reduction::Implies => {
                let v: Vec<bool> = truths().collect();
                bit(match v[..] {
                    [] => true,
                    [a] => !a,
                    [a, b] => !a || b,
                    _ => false,
                })
            }
            Reduction::ArgMin | Reduction::ArgMax => {
                if inp.is_empty() {
                    return 0.0;
                }
                // A NaN compares as neither, as the current core's
                // comparison does.
                let mut best = 0;
                for k in 1..inp.len() {
                    let better = match self {
                        Reduction::ArgMin => inp[k] < inp[best],
                        _ => inp[k] > inp[best],
                    };
                    if better {
                        best = k;
                    }
                }
                (best + 1) as f64
            }
            Reduction::IndexOf => match inp.split_first() {
                Some((&target, xs)) => xs
                    .iter()
                    .position(|&x| x == target)
                    .map_or(0.0, |k| (k + 1) as f64),
                None => f64::NAN,
            },
            Reduction::SearchSorted { right, unsorted } => {
                let Some((&target, xs)) = inp.split_first() else {
                    return f64::NAN;
                };
                if xs.is_empty() {
                    return 0.0;
                }
                let before = |x: f64| x < target || (right && x == target);
                if unsorted {
                    return (xs.iter().filter(|&&x| before(x)).count() + 1) as f64;
                }
                let ordered = xs
                    .iter()
                    .filter(|x| !x.is_nan())
                    .collect::<Vec<_>>()
                    .windows(2)
                    .all(|w| w[0] <= w[1]);
                if !ordered {
                    return 0.0;
                }
                let mut index = 1;
                for (k, &x) in xs.iter().enumerate() {
                    if before(x) {
                        index = k + 2;
                    }
                }
                index as f64
            }
            Reduction::Between => match *inp {
                [x, l1, l2, strict] => {
                    let strict = strict != 0.0 && !strict.is_nan();
                    let (lo, hi) = if l1 < l2 || (!strict && l1 == l2) {
                        (l1, l2)
                    } else if l2 < l1 {
                        (l2, l1)
                    } else {
                        return 0.0;
                    };
                    bit(if strict {
                        x > lo && x < hi
                    } else {
                        x >= lo && x <= hi
                    })
                }
                _ => f64::NAN,
            },
        }
    }
}

/// The variance of `inp[1..]` as the current core computes it: the sum of
/// squares less the squared sum over the count, over the count when
/// `inp[0]` holds (a population's), else over one less.
fn variance(inp: &[f64]) -> f64 {
    let Some((&population, xs)) = inp.split_first() else {
        return f64::NAN;
    };
    let n = xs.len() as f64;
    let (sum, squares) = xs.iter().fold((0.0, 0.0), |(s, q), &x| (s + x, q + x * x));
    let spread = squares - sum * sum / n;
    if population != 0.0 && !population.is_nan() {
        spread / n
    } else {
        spread / (n - 1.0)
    }
}

/// The greatest common divisor of integers, by Euclid's algorithm as the
/// current core runs it: never negative, 0 when every input is 0.
fn gcd(inp: &[f64]) -> f64 {
    inp.iter().fold(0.0, |mut x: f64, &v| {
        let mut y = v;
        while y != 0.0 {
            (x, y) = (y, x % y);
        }
        x.abs()
    })
}

/// `x` wrapped periodically into the interval between `lo` and `hi`
/// (either order), as the current core's `<wrapNumberPeriodic>`: `lo` when
/// they are equal, NaN when `x` is not finite.
pub(super) fn wrap_periodic(x: f64, lo: f64, hi: f64) -> f64 {
    if !x.is_finite() || lo.is_nan() || hi.is_nan() {
        return f64::NAN;
    }
    if lo == hi {
        return lo;
    }
    let (lo, hi) = if lo > hi { (hi, lo) } else { (lo, hi) };
    lo + crate::program::scalar::modulo(x - lo, hi - lo)
}

/// How many values `from, from + step, ..., to` holds, as a pick counts
/// them: a whole number, below 1 when the sequence is empty.
pub fn sequence_count(from: f64, step: f64, to: f64) -> f64 {
    ((to - from) / step + 1e-10).floor() + 1.0
}

/// The fewest values `from, from + step, ..., to` holds for parameters in
/// the ranges: at a corner of their box, where it is least; NaN-free, and
/// below 1 when a step may be 0 or a range is ⊤.
pub fn fewest_in_sequence(from: Range, step: Range, to: Range) -> f64 {
    let (Range::Span(f0, f1), Range::Span(s0, s1), Range::Span(t0, t1)) = (from, step, to) else {
        return f64::NEG_INFINITY;
    };
    if s0 <= 0.0 && s1 >= 0.0 {
        return f64::NEG_INFINITY;
    }
    let mut fewest = f64::INFINITY;
    for f in [f0, f1] {
        for s in [s0, s1] {
            for t in [t0, t1] {
                let n = sequence_count(f, s, t);
                fewest = fewest.min(if n.is_nan() { f64::NEG_INFINITY } else { n });
            }
        }
    }
    fewest
}

/// The position (0-based) of `x` in `from, from + step, ...` of `count`
/// values, when it is one of them.
pub fn sequence_index(from: f64, step: f64, count: f64, x: f64) -> Option<u64> {
    let k = (x - from) / step;
    let r = k.round();
    ((k - r).abs() <= 1e-10 * r.abs().max(1.0) && r >= 0.0 && r < count).then_some(r as u64)
}

/// The value a draw in `[0, 1)` picks from `from, from + step, ..., to`
/// less `excludes`; NaN when there is none.
fn sequence_pick(draw: f64, from: f64, step: f64, to: f64, excludes: &[f64]) -> f64 {
    if step == 0.0 || [draw, from, step, to].iter().any(|v| !v.is_finite()) {
        return f64::NAN;
    }
    let count = sequence_count(from, step, to);
    if count < 1.0 {
        return f64::NAN;
    }
    let mut out: Vec<u64> = excludes
        .iter()
        .filter_map(|&x| sequence_index(from, step, count, x))
        .collect();
    out.sort_unstable();
    out.dedup();
    let left = count - out.len() as f64;
    if left < 1.0 {
        return f64::NAN;
    }
    // The draw's position among the values left, then past the excluded
    // ones at or before it.
    let mut k = ((draw * left) as u64).min(left as u64 - 1);
    for &x in &out {
        if x <= k {
            k += 1;
        }
    }
    from + step * k as f64
}

/// The `i`-th number in `[0, 1)` of the stream a draw seeds: the draw
/// itself, then splitmix64 over its bits, so one draw (a scope constant,
/// ADR 0037) gives as many independent numbers as an instruction needs.
pub(crate) fn draw_stream(draw: f64, i: usize) -> f64 {
    if i == 0 {
        return draw;
    }
    let seed = (draw * (1u64 << 53) as f64) as u64;
    let mut z = seed
        .wrapping_add((i as u64).wrapping_mul(0x9e37_79b9_7f4a_7c15))
        .wrapping_add(0x9e37_79b9_7f4a_7c15);
    z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    z ^= z >> 31;
    (z >> 11) as f64 / (1u64 << 53) as f64
}

/// `n` positions among `count` (0-based), less the `excluded` ones (sorted,
/// no repeats, each below `count`), drawn from the stream `draw` seeds:
/// with `replace`, any position left each time; without, no position
/// twice. None when too few positions are left; with nothing excluded, the
/// first is the draw scaled by the count, as [`VecOp::SequencePick`]'s.
fn pick_positions(
    draw: f64,
    count: u64,
    excluded: &[u64],
    n: usize,
    replace: bool,
) -> Option<Vec<u64>> {
    let left = count.checked_sub(excluded.len() as u64)?;
    let mut blocked = excluded.to_vec();
    let mut picks = Vec::with_capacity(n);
    for i in 0..n {
        let avail = if replace {
            left
        } else {
            left.checked_sub(i as u64)?
        };
        if avail == 0 {
            return None;
        }
        let mut k = ((draw_stream(draw, i) * avail as f64) as u64).min(avail - 1);
        // Past the blocked positions at or before it, in order.
        for &x in &blocked {
            if x <= k {
                k += 1;
            }
        }
        picks.push(k);
        if !replace {
            let at = blocked.partition_point(|&x| x < k);
            blocked.insert(at, k);
        }
    }
    Some(picks)
}

/// The most a `<selectPrimeNumbers>` may draw below, and the widest range
/// it may draw from: what one sieve of a range holds.
pub const MAX_PRIME: f64 = 1e12;
/// The widest range of primes a draw sieves (see [`MAX_PRIME`]).
pub const MAX_PRIME_SPAN: f64 = 1e6;

/// The primes from `from` to `to`, in order; None when the range is not
/// finite, reaches past [`MAX_PRIME`] or is wider than [`MAX_PRIME_SPAN`].
pub fn primes_between(from: f64, to: f64) -> Option<Vec<u64>> {
    if !from.is_finite() || !to.is_finite() {
        return None;
    }
    let (lo, hi) = (from.ceil().max(2.0), to.floor());
    if hi < lo {
        return Some(Vec::new());
    }
    if hi > MAX_PRIME || hi - lo > MAX_PRIME_SPAN {
        return None;
    }
    let (lo, hi) = (lo as u64, hi as u64);
    // The primes up to the root, then those marking off the range.
    let root = (hi as f64).sqrt() as u64 + 1;
    let mut small = vec![true; root as usize + 1];
    let mut seg = vec![true; (hi - lo + 1) as usize];
    for p in 2..=root {
        if !small[p as usize] {
            continue;
        }
        let mut m = p * p;
        while m <= root {
            small[m as usize] = false;
            m += p;
        }
        let mut m = (p * p).max(lo.div_ceil(p) * p);
        while m <= hi {
            seg[(m - lo) as usize] = false;
            m += p;
        }
    }
    Some(
        seg.iter()
            .enumerate()
            .filter(|&(_, &prime)| prime)
            .map(|(k, _)| lo + k as u64)
            .collect(),
    )
}

/// The standard normal quantile of `p` in `(0, 1)` (Acklam's rational
/// approximation, with one step of Halley's method).
fn normal_quantile(p: f64) -> f64 {
    const A: [f64; 6] = [
        -3.969_683_028_665_376e1,
        2.209_460_984_245_205e2,
        -2.759_285_104_469_687e2,
        1.383_577_518_672_69e2,
        -3.066_479_806_614_716e1,
        2.506_628_277_459_239,
    ];
    const B: [f64; 5] = [
        -5.447_609_879_822_406e1,
        1.615_858_368_580_409e2,
        -1.556_989_798_598_866e2,
        6.680_131_188_771_972e1,
        -1.328_068_155_288_572e1,
    ];
    const C: [f64; 6] = [
        -7.784_894_002_430_293e-3,
        -3.223_964_580_411_365e-1,
        -2.400_758_277_161_838,
        -2.549_732_539_343_734,
        4.374_664_141_464_968,
        2.938_163_982_698_783,
    ];
    const D: [f64; 4] = [
        7.784_695_709_041_462e-3,
        3.224_671_290_700_398e-1,
        2.445_134_137_142_996,
        3.754_408_661_907_416,
    ];
    let tail = |q: f64| {
        (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5])
            / ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1.0)
    };
    let x = if p < 0.02425 {
        tail((-2.0 * p.ln()).sqrt())
    } else if p > 1.0 - 0.02425 {
        -tail((-2.0 * (1.0 - p).ln()).sqrt())
    } else {
        let q = p - 0.5;
        let r = q * q;
        (((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q
            / (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1.0)
    };
    // One Halley step against the normal distribution function.
    let e = 0.5 * erfc(-x / std::f64::consts::SQRT_2) - p;
    let u = e * (2.0 * std::f64::consts::PI).sqrt() * (x * x / 2.0).exp();
    x - u / (1.0 + x * u / 2.0)
}

/// The complementary error function (Numerical Recipes' `erfcc`, to about
/// 1e-7, which the Halley step in [`normal_quantile`] refines past).
fn erfc(x: f64) -> f64 {
    let z = x.abs();
    let t = 1.0 / (1.0 + 0.5 * z);
    let r = t
        * (-z * z - 1.265_512_23
            + t * (1.000_023_68
                + t * (0.374_091_96
                    + t * (0.096_784_18
                        + t * (-0.186_288_06
                            + t * (0.278_868_07
                                + t * (-1.135_203_98
                                    + t * (1.488_515_87
                                        + t * (-0.822_152_23 + t * 0.170_872_77)))))))))
            .exp();
    if x >= 0.0 { r } else { 2.0 - r }
}

/// `values` in `order`, a NaN last whichever way.
fn sort_values(values: &mut [f64], order: Order) {
    match order {
        Order::Unsorted => {}
        Order::Increasing => {
            values.sort_by(|a, b| a.is_nan().cmp(&b.is_nan()).then(a.total_cmp(b)))
        }
        Order::Decreasing => {
            values.sort_by(|a, b| a.is_nan().cmp(&b.is_nan()).then(b.total_cmp(a)))
        }
    }
}

/// What a [`VecOp::Scan`] gives of `inp`, into `out`. A NaN makes a
/// running minimum or maximum NaN from there on, as `Math.min` does.
fn scan(op: Scan, inp: &[f64], out: &mut [f64]) {
    if op == Scan::Differences {
        for (k, w) in inp.windows(2).enumerate() {
            out[k] = w[1] - w[0];
        }
        return;
    }
    let mut running = f64::NAN;
    for (k, &x) in inp.iter().enumerate() {
        running = if k == 0 {
            x
        } else {
            match op {
                Scan::Sum => running + x,
                Scan::Product => running * x,
                Scan::Min if running.is_nan() || x.is_nan() => f64::NAN,
                Scan::Max if running.is_nan() || x.is_nan() => f64::NAN,
                Scan::Min => running.min(x),
                Scan::Max => running.max(x),
                Scan::Differences => unreachable!("taken above"),
            }
        };
        out[k] = running;
    }
}

/// `values` permuted by the stream `draw` seeds (Fisher and Yates), into
/// `out`.
fn shuffle(draw: f64, values: &[f64], out: &mut [f64]) {
    out.copy_from_slice(values);
    if !draw.is_finite() {
        out.fill(f64::NAN);
        return;
    }
    for i in (1..out.len()).rev() {
        let j = ((draw_stream(draw, out.len() - 1 - i) * (i + 1) as f64) as usize).min(i);
        out.swap(i, j);
    }
}

/// What a [`VecOp::Draws`] gives, into `out`: one value per output, every
/// one NaN when the distribution cannot give them.
fn draws(dist: Dist, draw: f64, params: &[f64], excludes: &[f64], out: &mut [f64]) {
    let n = out.len();
    if !draw.is_finite() || params.iter().any(|v| !v.is_finite()) {
        out.fill(f64::NAN);
        return;
    }
    match dist {
        Dist::Uniform => {
            let (from, to) = (params[0], params[1]);
            for (i, o) in out.iter_mut().enumerate() {
                *o = from + draw_stream(draw, i) * (to - from);
            }
        }
        Dist::Gaussian => {
            let (mean, sd) = (params[0], params[1]);
            let scale = (1u64 << 53) as f64;
            for (i, o) in out.iter_mut().enumerate() {
                // Off 0, which has no quantile.
                let u = (draw_stream(draw, i) * scale + 0.5) / scale;
                *o = mean + sd * normal_quantile(u);
            }
        }
        Dist::Sequence { replace, order } => {
            let (from, step, to) = (params[0], params[1], params[2]);
            let count = sequence_count(from, step, to);
            let picks = (step != 0.0 && count >= 1.0 && count < u64::MAX as f64)
                .then(|| {
                    let mut excluded: Vec<u64> = excludes
                        .iter()
                        .filter_map(|&x| sequence_index(from, step, count, x))
                        .collect();
                    excluded.sort_unstable();
                    excluded.dedup();
                    pick_positions(draw, count as u64, &excluded, n, replace)
                })
                .flatten();
            match picks {
                Some(picks) => {
                    for (o, k) in out.iter_mut().zip(picks) {
                        *o = from + step * k as f64;
                    }
                    sort_values(out, order);
                }
                None => out.fill(f64::NAN),
            }
        }
        Dist::Primes { replace, order } => {
            let picks = primes_between(params[0], params[1]).and_then(|primes| {
                let mut excluded: Vec<u64> = excludes
                    .iter()
                    .filter(|x| x.fract() == 0.0 && **x >= 0.0)
                    .filter_map(|&x| primes.binary_search(&(x as u64)).ok())
                    .map(|k| k as u64)
                    .collect();
                excluded.sort_unstable();
                excluded.dedup();
                let picks = pick_positions(draw, primes.len() as u64, &excluded, n, replace)?;
                Some(
                    picks
                        .into_iter()
                        .map(|k| primes[k as usize])
                        .collect::<Vec<_>>(),
                )
            });
            match picks {
                Some(picks) => {
                    for (o, p) in out.iter_mut().zip(picks) {
                        *o = p as f64;
                    }
                    sort_values(out, order);
                }
                None => out.fill(f64::NAN),
            }
        }
    }
}

/// What a [`VecOp::Moments`] gives, into `out`: the mean, the variance
/// and the standard deviation of the distribution `dist` with
/// parameters `params`, less `excludes` for a sequence, as the current
/// core's samplers report them (a whole distribution's, not a sample's);
/// NaN where the parameters describe none, and for primes.
fn moments(dist: Dist, params: &[f64], excludes: &[f64], out: &mut [f64]) {
    let (mean, variance) = if params.iter().any(|v| !v.is_finite()) {
        (f64::NAN, f64::NAN)
    } else {
        match dist {
            Dist::Uniform => {
                let (from, to) = (params[0], params[1]);
                ((from + to) / 2.0, (to - from) * (to - from) / 12.0)
            }
            Dist::Gaussian => {
                let (mean, sd) = (params[0], params[1]);
                if sd >= 0.0 {
                    (mean, sd * sd)
                } else {
                    (f64::NAN, f64::NAN)
                }
            }
            Dist::Sequence { .. } => sequence_moments(params[0], params[1], params[2], excludes),
            Dist::Primes { .. } => (f64::NAN, f64::NAN),
        }
    };
    out[0] = mean;
    out[1] = variance;
    out[2] = variance.sqrt();
}

/// The mean and variance of `from, from + step, ..., to` less `excludes`,
/// every value equally likely: in closed form over the whole sequence,
/// less each value it excludes (once, however often it is excluded).
fn sequence_moments(from: f64, step: f64, to: f64, excludes: &[f64]) -> (f64, f64) {
    let count = sequence_count(from, step, to);
    if step == 0.0 || count.is_nan() || count < 1.0 || count >= u64::MAX as f64 {
        return (f64::NAN, f64::NAN);
    }
    let mut excluded: Vec<u64> = excludes
        .iter()
        .filter_map(|&x| sequence_index(from, step, count, x))
        .collect();
    excluded.sort_unstable();
    excluded.dedup();
    let left = count - excluded.len() as f64;
    if left < 1.0 {
        return (f64::NAN, f64::NAN);
    }
    if excluded.is_empty() {
        let mean = from + step * (count - 1.0) / 2.0;
        return (mean, (count * count - 1.0) * step * step / 12.0);
    }
    // About the sequence's own middle, so a sequence far from 0 keeps its
    // precision: the values are `mid + step * d`, `d` from `-(count - 1) /
    // 2` to `(count - 1) / 2`.
    let mid = from + step * (count - 1.0) / 2.0;
    let (mut s1, mut s2) = (0.0, (count * count - 1.0) * count / 12.0);
    for &k in &excluded {
        let d = k as f64 - (count - 1.0) / 2.0;
        s1 -= d;
        s2 -= d * d;
    }
    let mean_d = s1 / left;
    (
        mid + step * mean_d,
        step * step * (s2 / left - mean_d * mean_d),
    )
}

/// Most inputs a vector operator reads.
pub use crate::limits::MAX_VEC_IN;

/// `x` held between `lo` and `hi`; NaN if any is NaN (unlike `f64::clamp`,
/// which panics on bounds out of order).
/// The least interval holding the domains `ds` (four cells each), leaving
/// out a domain with an endpoint that is no number; the whole line, open at
/// both ends, when none is left. An end shared by several is closed when
/// any of them closes it, as the current core's `<piecewiseFunction>`
/// finds its domain.
fn domain_hull(ds: &[f64]) -> [f64; 4] {
    let mut hull: Option<[f64; 4]> = None;
    for d in ds.chunks_exact(4) {
        if d[0].is_nan() || d[1].is_nan() {
            continue;
        }
        let h = hull.get_or_insert([d[0], d[1], d[2], d[3]]);
        if d[0] < h[0] {
            (h[0], h[2]) = (d[0], d[2]);
        } else if d[0] == h[0] && d[2] != 0.0 {
            h[2] = 1.0;
        }
        if d[1] > h[1] {
            (h[1], h[3]) = (d[1], d[3]);
        } else if d[1] == h[1] && d[3] != 0.0 {
            h[3] = 1.0;
        }
    }
    hull.unwrap_or([f64::NEG_INFINITY, f64::INFINITY, 0.0, 0.0])
}

/// How far inside an open end of a domain [`VecOp::IntoDomain`] holds a
/// value: a millionth of the end's size, at least a millionth, and no more
/// than half the domain's width.
fn open_step(end: f64, width: f64) -> f64 {
    let step = 1e-6 * end.abs().max(1.0);
    if width.is_finite() {
        step.min(width / 2.0)
    } else {
        step
    }
}

/// `x` held in the domain `d` (lower, upper, lower closed, upper closed):
/// past an end it stops there when the end is closed, an [`open_step`]
/// inside it when open. An endpoint that is no number is no bound.
fn into_domain(x: f64, d: &[f64]) -> f64 {
    let (lo, hi, lo_closed, hi_closed) = (d[0], d[1], d[2], d[3]);
    if x.is_nan() {
        return x;
    }
    let width = hi - lo;
    if !lo.is_nan() && lo.is_finite() && (x < lo || (x == lo && lo_closed == 0.0)) {
        return if lo_closed != 0.0 {
            lo
        } else {
            lo + open_step(lo, width)
        };
    }
    if !hi.is_nan() && hi.is_finite() && (x > hi || (x == hi && hi_closed == 0.0)) {
        return if hi_closed != 0.0 {
            hi
        } else {
            hi - open_step(hi, width)
        };
    }
    x
}

fn clamp(x: f64, lo: f64, hi: f64) -> f64 {
    if x.is_nan() || lo.is_nan() || hi.is_nan() {
        f64::NAN
    } else {
        x.max(lo).min(hi)
    }
}

/// The input position of the active branch of a `Choose` over `n`
/// branches, from its choice cell's value: an integer from 1 to `n`. Any
/// other value chooses none; an index is never rounded (ADR 0041).
fn active_branch(choice: f64, n: u8) -> Option<usize> {
    (choice >= 1.0 && choice <= n as f64 && choice.fract() == 0.0).then_some(choice as usize)
}

impl VecOp {
    /// How many input cells it reads.
    pub const fn n_in(&self) -> usize {
        match *self {
            VecOp::Shape { n, .. } => 2 * n as usize + 3,
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
            VecOp::Clamp => 3,
            VecOp::Centroid { n } => 2 * n as usize,
            VecOp::SequencePick { n_exclude } => 4 + n_exclude as usize,
            VecOp::Reduce { n, .. } => n as usize,
            VecOp::Wrap => 3,
            VecOp::Pair { .. } | VecOp::RegularPolygon { .. } => 4,
            VecOp::Extent => 2,
            VecOp::AngleAt { .. } => 6,
            VecOp::Scan { n, .. } | VecOp::Sort { n, .. } => n as usize,
            VecOp::Shuffle { n } => n as usize + 1,
            VecOp::Draws {
                dist, n_exclude, ..
            } => 1 + dist.n_params() + n_exclude as usize,
            VecOp::Moments { dist, n_exclude } => dist.n_params() + n_exclude as usize,
            VecOp::BestFitLine { n } => 2 * n as usize,
            VecOp::IntersectLines { .. } => 8,
            VecOp::Parabola {
                through: 0,
                vertex: false,
            } => 3,
            VecOp::Parabola { through, vertex } => 1 + 2 * vertex as usize + 2 * through as usize,
            VecOp::IntoDomain => 5,
            VecOp::DomainRange => 4,
            VecOp::DomainHull { n } => 4 * n as usize,
            VecOp::SequenceParams { given } => given.count_ones() as usize,
            VecOp::SequenceCount { n_exclude } => 3 + n_exclude as usize,
            VecOp::SequenceEntry { n_exclude } => 4 + n_exclude as usize,
        }
    }

    /// The input positions its inverse may write, as a mask (the table's
    /// last column).
    pub fn writes(&self) -> u64 {
        let first = |k: usize| if k >= 64 { u64::MAX } else { (1u64 << k) - 1 };
        match *self {
            VecOp::Shape { n, .. } => first(2 * n as usize),
            VecOp::CircleCenterPoint | VecOp::CircleTwoPointsRadius => first(4),
            VecOp::CirclePoints { n } => first(2 * n as usize),
            VecOp::PolarSlope => 0b1100,
            VecOp::PolarDirection { .. } => 0b11100,
            VecOp::LinePointsFromCoeffs => 0b111,
            VecOp::ProjectCircle | VecOp::ProjectLine => 0b11,
            VecOp::First { .. }
            | VecOp::WeightedMean { .. }
            | VecOp::SequencePick { .. }
            | VecOp::Reduce { .. }
            | VecOp::Scan { .. }
            | VecOp::Sort { .. }
            | VecOp::Shuffle { .. }
            | VecOp::Draws { .. }
            | VecOp::Moments { .. } => 0,
            VecOp::Choose { n } => first(n as usize + 1) & !1,
            VecOp::Clamp | VecOp::Wrap => 1,
            VecOp::Centroid { n } => first(2 * n as usize),
            VecOp::Pair { .. } | VecOp::RegularPolygon { .. } => first(4),
            VecOp::Extent => first(2),
            VecOp::AngleAt { .. } | VecOp::BestFitLine { .. } | VecOp::IntersectLines { .. } => 0,
            VecOp::Parabola { .. } => first(self.n_in()),
            VecOp::IntoDomain => 1,
            VecOp::DomainRange | VecOp::DomainHull { .. } => 0,
            VecOp::SequenceParams { .. }
            | VecOp::SequenceCount { .. }
            | VecOp::SequenceEntry { .. } => 0,
        }
    }

    /// A range holding every value its first output can take from inputs
    /// in `inputs` (ADR 0037, `program/range.rs`): ⊤ for an operator with
    /// no rule. `First` is a position or 0; `Choose` the branch its one
    /// known choice chooses, ⊤ when it may choose none (NaN); `Clamp`
    /// its input held between its bounds.
    pub fn range(&self, inputs: &[Range]) -> Range {
        match *self {
            VecOp::First { n } => Range::Span(0.0, n as f64),
            // A choice that is no integer chooses none (NaN), so only one
            // known branch has a range.
            VecOp::Choose { n } => match inputs.first().and_then(|r| r.as_point()) {
                Some(k) if active_branch(k, n).is_some() => inputs[k as usize],
                _ => Range::Top,
            },
            VecOp::Clamp => match inputs {
                [x, lo, hi] => x.corners(*lo, f64::max).corners(*hi, f64::min),
                _ => Range::Top,
            },
            // A value from `from` toward `to`: between them, given a step
            // of one sign, past `to` by no more than the tolerance its
            // count allows; with a step that may be 0, NaN.
            VecOp::SequencePick { n_exclude } => match inputs {
                // NaN unless every sequence holds a value its excludes
                // leave.
                [_, from, step, to, ..]
                    if fewest_in_sequence(*from, *step, *to) < 1.0 + n_exclude as f64 =>
                {
                    Range::Top
                }
                [_, from, step, to, ..] => match (*from, *step, *to) {
                    (Range::Span(f, _), Range::Span(lo, hi), Range::Span(_, t)) if lo > 0.0 => {
                        Range::span(f, t + hi * 1e-9)
                    }
                    (Range::Span(_, f), Range::Span(lo, hi), Range::Span(t, _)) if hi < 0.0 => {
                        Range::span(t + lo * 1e-9, f)
                    }
                    _ => Range::Top,
                },
                _ => Range::Top,
            },
            // A uniform value lies between its bounds; a sequence's, as
            // one pick's, when every sequence holds as many values as it
            // draws.
            VecOp::Draws { dist, n, n_exclude } => match (dist, inputs) {
                (Dist::Uniform, [Range::Span(lo, hi), from, to, ..])
                    if *lo >= 0.0 && *hi <= 1.0 =>
                {
                    from.hull(*to)
                }
                (Dist::Sequence { replace, .. }, [_, from, step, to, ..]) => {
                    let need = if replace { 1.0 } else { n as f64 };
                    if fewest_in_sequence(*from, *step, *to) < need + n_exclude as f64 {
                        Range::Top
                    } else {
                        VecOp::SequencePick { n_exclude: 0 }.range(&inputs[..4])
                    }
                }
                _ => Range::Top,
            },
            _ => Range::Top,
        }
    }

    /// How many cells it writes.
    pub fn n_out(&self) -> usize {
        match *self {
            VecOp::Shape { n, .. } => 2 * n as usize,
            VecOp::CircleCenterPoint | VecOp::CirclePoints { .. } => 3,
            VecOp::CircleTwoPointsRadius => 2,
            VecOp::PolarSlope | VecOp::PolarDirection { .. } => 2,
            VecOp::LinePointsFromCoeffs => 4,
            VecOp::ProjectCircle | VecOp::ProjectLine => 2,
            VecOp::First { .. }
            | VecOp::Choose { .. }
            | VecOp::Clamp
            | VecOp::SequencePick { .. }
            | VecOp::Reduce { .. }
            | VecOp::Wrap
            | VecOp::Extent
            | VecOp::AngleAt { .. } => 1,
            VecOp::WeightedMean { .. } | VecOp::Centroid { .. } => 2,
            VecOp::Pair { .. } => 4,
            VecOp::RegularPolygon { n, .. } => 2 * n as usize,
            VecOp::Scan {
                op: Scan::Differences,
                n,
            } => (n as usize).saturating_sub(1),
            VecOp::Scan { n, .. } | VecOp::Sort { n, .. } | VecOp::Shuffle { n } => n as usize,
            VecOp::Draws { n, .. } => n as usize,
            VecOp::Moments { .. } => 3,
            VecOp::BestFitLine { .. } | VecOp::IntersectLines { .. } => 3,
            VecOp::Parabola { .. } => 5,
            VecOp::IntoDomain => 1,
            VecOp::DomainRange => 2,
            VecOp::DomainHull { .. } => 4,
            VecOp::SequenceParams { .. } => 3,
            VecOp::SequenceCount { .. } | VecOp::SequenceEntry { .. } => 1,
        }
    }

    /// Whether a missing input makes every output missing (ADR 0046): a
    /// shape, a projection, a fit or a numeric or boolean reduction made
    /// from a missing value is missing. A choice, a selection, a reorder
    /// and a comparison read a missing input as the NaN it is, so it
    /// passes through as a value (a sort puts it last) or compares false.
    pub fn strict_in_missing(&self) -> bool {
        match *self {
            VecOp::Shape { .. }
            | VecOp::First { .. }
            | VecOp::Choose { .. }
            | VecOp::WeightedMean { .. }
            | VecOp::SequencePick { .. }
            | VecOp::Sort { .. }
            | VecOp::Shuffle { .. }
            | VecOp::Draws { .. }
            | VecOp::SequenceParams { .. }
            | VecOp::SequenceCount { .. }
            | VecOp::SequenceEntry { .. } => false,
            VecOp::Reduce { op, .. } => !matches!(
                op,
                Reduction::Between
                    | Reduction::ArgMin
                    | Reduction::ArgMax
                    | Reduction::IndexOf
                    | Reduction::SearchSorted { .. }
            ),
            _ => true,
        }
    }

    /// Forward evaluation. `inp` holds the input values, `out` receives
    /// `n_out()` values; every output is missing when an input is and the
    /// operator is strict in it ([`VecOp::strict_in_missing`]).
    pub fn eval(&self, inp: &[f64], out: &mut [f64]) {
        if self.strict_in_missing() && inp.iter().any(|&x| crate::program::is_missing(x)) {
            out.fill(crate::program::MISSING);
            return;
        }
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
                out[0] = active_branch(inp[0], n).map_or(crate::program::MISSING, |k| inp[k]);
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
            VecOp::Clamp => out[0] = clamp(inp[0], inp[1], inp[2]),
            VecOp::Centroid { n } => {
                let (cx, cy) = centroid(inp, n as usize);
                out[0] = cx;
                out[1] = cy;
            }
            VecOp::SequencePick { n_exclude } => {
                out[0] = sequence_pick(
                    inp[0],
                    inp[1],
                    inp[2],
                    inp[3],
                    &inp[4..4 + n_exclude as usize],
                );
            }
            VecOp::Reduce { op, n } => out[0] = op.eval(&inp[..n as usize]),
            VecOp::Wrap => out[0] = wrap_periodic(inp[0], inp[1], inp[2]),
            VecOp::Pair { by } => {
                for j in 0..2 {
                    let (a, b) = pair(by, inp[j], inp[2 + j]);
                    out[j] = a;
                    out[2 + j] = b;
                }
            }
            VecOp::Extent => out[0] = (inp[1] - inp[0]).abs(),
            VecOp::AngleAt { reflex } => out[0] = angle_at(inp, reflex),
            VecOp::RegularPolygon { n, by } => {
                let ([cx, cy], [vx, vy]) = regular_center_vertex(n as usize, by, inp);
                regular_vertices(n as usize, [cx, cy], [vx - cx, vy - cy], out);
            }
            VecOp::Scan { op, n } => scan(op, &inp[..n as usize], out),
            VecOp::Sort { n, decreasing } => {
                out.copy_from_slice(&inp[..n as usize]);
                let order = if decreasing {
                    Order::Decreasing
                } else {
                    Order::Increasing
                };
                sort_values(out, order);
            }
            VecOp::Shuffle { n } => shuffle(inp[0], &inp[1..=n as usize], out),
            VecOp::Draws {
                dist, n_exclude, ..
            } => {
                let k = dist.n_params();
                let excludes = &inp[1 + k..1 + k + n_exclude as usize];
                draws(dist, inp[0], &inp[1..=k], excludes, out);
            }
            VecOp::Moments { dist, n_exclude } => {
                let k = dist.n_params();
                moments(dist, &inp[..k], &inp[k..k + n_exclude as usize], out);
            }
            VecOp::BestFitLine { n } => {
                let [m, k] = best_fit_line(&inp[..2 * n as usize]);
                out[0] = m;
                out[1] = if m.is_nan() { f64::NAN } else { -1.0 };
                out[2] = k;
            }
            VecOp::IntersectLines { segment1, segment2 } => {
                match intersect_lines(inp, segment1, segment2) {
                    Some((x, y)) => {
                        out[0] = x;
                        out[1] = y;
                        out[2] = 0.0;
                    }
                    None => {
                        out[0] = f64::NAN;
                        out[1] = f64::NAN;
                        out[2] = 1.0;
                    }
                }
            }
            VecOp::Parabola { through, vertex } => {
                let [a, b, c] = parabola(inp, through as usize, vertex);
                let [vx, vy] = parabola_vertex(a, b, c);
                out.copy_from_slice(&[a, b, c, vx, vy]);
            }
            VecOp::IntoDomain => out[0] = into_domain(inp[0], &inp[1..5]),
            VecOp::DomainRange => {
                let (lo, hi) = (inp[2], inp[3]);
                out[0] = if lo.is_nan() {
                    inp[0]
                } else {
                    nan_max(inp[0], lo)
                };
                out[1] = if hi.is_nan() {
                    inp[1]
                } else {
                    nan_min(inp[1], hi)
                };
            }
            VecOp::DomainHull { n } => out.copy_from_slice(&domain_hull(&inp[..4 * n as usize])),
            VecOp::SequenceParams { given } => {
                let mut it = inp.iter().copied();
                let mut take =
                    |bit: u8| (given & (1 << bit) != 0).then(|| it.next().unwrap_or(f64::NAN));
                let (from, to, step, length) = (take(0), take(1), take(2), take(3));
                let [f, s, l] = sequence_parameters(from, to, step, length)
                    .map_or([f64::NAN; 3], |(f, s, l)| [f, s, l]);
                // A value that is no number makes no sequence.
                out.copy_from_slice(&if [f, s, l].iter().all(|v| v.is_finite()) {
                    [f, s, l]
                } else {
                    [f, s, 0.0]
                });
            }
            VecOp::SequenceCount { n_exclude } => {
                let ex = &inp[3..3 + n_exclude as usize];
                out[0] = sequence_values(inp[0], inp[1], inp[2], ex)
                    .take(MAX_SEQUENCE)
                    .count() as f64;
            }
            VecOp::SequenceEntry { n_exclude } => {
                let k = inp[0];
                let ex = &inp[4..4 + n_exclude as usize];
                out[0] = if k >= 1.0 && k.fract() == 0.0 && k <= MAX_SEQUENCE as f64 {
                    sequence_values(inp[1], inp[2], inp[3], ex)
                        .nth(k as usize - 1)
                        .unwrap_or(crate::program::MISSING)
                } else {
                    crate::program::MISSING
                };
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
            VecOp::First { .. }
            | VecOp::WeightedMean { .. }
            | VecOp::SequencePick { .. }
            | VecOp::Reduce { .. }
            | VecOp::Scan { .. }
            | VecOp::Sort { .. }
            | VecOp::Shuffle { .. }
            | VecOp::Draws { .. }
            | VecOp::Moments { .. }
            | VecOp::BestFitLine { .. }
            | VecOp::IntersectLines { .. }
            | VecOp::DomainRange
            | VecOp::DomainHull { .. }
            | VecOp::SequenceParams { .. }
            | VecOp::SequenceCount { .. }
            | VecOp::SequenceEntry { .. } => false,
            VecOp::Parabola { through, vertex } => {
                // A vertex asked for keeps `a`.
                let abc = if desired[3].is_some() || desired[4].is_some() {
                    parabola_at_vertex(want(0), want(3), want(4))
                } else {
                    [want(0), want(1), want(2)]
                };
                let asked_a = desired[0].is_some();
                invert_parabola(through as usize, vertex, inputs, inp, abc, asked_a, out)
            }
            VecOp::Choose { n } => match (active_branch(inp[0], n), desired[0]) {
                (Some(k), Some(d)) => {
                    out.write(inputs[k], d);
                    true
                }
                _ => false,
            },
            VecOp::Clamp => match desired[0] {
                Some(d) => {
                    out.write(inputs[0], clamp(d, inp[1], inp[2]));
                    true
                }
                None => false,
            },
            VecOp::IntoDomain => match desired[0] {
                Some(d) if !d.is_nan() => {
                    out.write(inputs[0], into_domain(d, &inp[1..5]));
                    true
                }
                _ => false,
            },
            VecOp::Wrap => match desired[0].map(|d| wrap_periodic(d, inp[1], inp[2])) {
                Some(x) if !x.is_nan() => {
                    out.write(inputs[0], x);
                    true
                }
                _ => false,
            },
            VecOp::Centroid { n } => {
                let (dx, dy) = (want(0) - cur[0], want(1) - cur[1]);
                if !dx.is_finite() || !dy.is_finite() {
                    return false;
                }
                out.group(
                    (0..n as usize)
                        .map(|i| point(i, inp[2 * i] + dx, inp[2 * i + 1] + dy))
                        .collect(),
                );
                true
            }
            VecOp::Pair { by } => {
                let mut next = [inp[0], inp[1], inp[2], inp[3]];
                for j in 0..2 {
                    let (asked_a, asked_b) = (desired[j].is_some(), desired[2 + j].is_some());
                    let (a, b) = (want(j), want(2 + j));
                    let q = inp[2 + j];
                    let (np, nq) = match by {
                        PairBy::Offset => (a, if asked_b { b - a } else { q }),
                        PairBy::Back => (b, if asked_a { b - a } else { q }),
                        PairBy::Mirror => (a, if asked_b { (a + b) / 2.0 } else { q }),
                        PairBy::Center => ((a + b) / 2.0, b - a),
                    };
                    next[j] = np;
                    next[2 + j] = nq;
                }
                write_points(inputs, inp, &next, out)
            }
            VecOp::Extent => {
                let Some(w) = desired[0].filter(|w| !w.is_nan()) else {
                    return false;
                };
                let (a, b) = (inp[0], inp[1]);
                let mid = (a + b) / 2.0;
                let half = w.max(0.0) / 2.0 * if b < a { -1.0 } else { 1.0 };
                if !mid.is_finite() || !half.is_finite() {
                    return false;
                }
                out.write(inputs[0], mid - half);
                out.write(inputs[1], mid + half);
                true
            }
            VecOp::AngleAt { .. } => false,
            VecOp::RegularPolygon { n, by } => {
                let n = n as usize;
                let Some(first) = (0..2 * n).find(|&k| desired[k].is_some()) else {
                    return false;
                };
                let k = first / 2;
                let one = (0..2 * n).all(|i| desired[i].is_none() || i / 2 == k);
                // One vertex turns and scales the polygon about its center;
                // several move the center to their mean, as the current
                // core does, and the first sets the turn and size.
                let (center, _) = regular_center_vertex(n, by, inp);
                let center = if one {
                    center
                } else {
                    let (sx, sy) = (0..n).fold((0.0, 0.0), |(sx, sy), i| {
                        (sx + want(2 * i), sy + want(2 * i + 1))
                    });
                    [sx / n as f64, sy / n as f64]
                };
                let (dx, dy) = (want(2 * k) - center[0], want(2 * k + 1) - center[1]);
                let (s, c) = (-(k as f64) * TAU / n as f64).sin_cos();
                let u = [dx * c - dy * s, dx * s + dy * c];
                let v = [center[0] + u[0], center[1] + u[1]];
                let next = match by {
                    RegularBy::CenterVertex => [center[0], center[1], v[0], v[1]],
                    RegularBy::CenterOffset => [center[0], center[1], u[0], u[1]],
                    RegularBy::VertexOffset => [v[0], v[1], -u[0], -u[1]],
                    RegularBy::Adjacent => {
                        let (s, c) = (TAU / n as f64).sin_cos();
                        let next = [
                            center[0] + u[0] * c - u[1] * s,
                            center[1] + u[0] * s + u[1] * c,
                        ];
                        [v[0], v[1], next[0], next[1]]
                    }
                };
                write_points(inputs, inp, &next, out)
            }
        }
    }
}

/// Writes the two input points (inputs 0, 1 and 2, 3) an inverse moved to
/// `next`, each as a point group of its own when it changed; false when
/// one is not finite.
fn write_points(inputs: &[CellIdx], inp: &[f64], next: &[f64; 4], out: &mut Produced) -> bool {
    if next.iter().any(|v| !v.is_finite()) {
        return false;
    }
    for i in 0..2 {
        let (x, y) = (next[2 * i], next[2 * i + 1]);
        if x != inp[2 * i] || y != inp[2 * i + 1] {
            out.group(vec![PointRequest {
                cells: [inputs[2 * i], inputs[2 * i + 1]],
                values: [x, y],
            }]);
        }
    }
    true
}

/// One coordinate of a [`VecOp::Pair`]'s two outputs from its inputs'.
fn pair(by: PairBy, p: f64, q: f64) -> (f64, f64) {
    match by {
        PairBy::Offset => (p, p + q),
        PairBy::Back => (p - q, p),
        PairBy::Mirror => (p, 2.0 * q - p),
        PairBy::Center => (p - q / 2.0, p + q / 2.0),
    }
}

/// The angle at `(inp[2], inp[3])` from the ray through `(inp[0], inp[1])`
/// counterclockwise to the ray through `(inp[4], inp[5])`, in `[0, 2π)`,
/// then the one `reflex` chooses; NaN when a coordinate is not finite.
fn angle_at(inp: &[f64], reflex: Reflex) -> f64 {
    if inp[..6].iter().any(|v| !v.is_finite()) {
        return f64::NAN;
    }
    let (vx, vy) = (inp[2], inp[3]);
    let mut r = (inp[5] - vy).atan2(inp[4] - vx) - (inp[1] - vy).atan2(inp[0] - vx);
    if r < 0.0 {
        r += TAU;
    }
    match reflex {
        Reflex::Never if r > PI => TAU - r,
        Reflex::Always if r <= PI => TAU - r,
        _ => r,
    }
}

/// A regular polygon's center and first vertex from its inputs.
fn regular_center_vertex(n: usize, by: RegularBy, inp: &[f64]) -> ([f64; 2], [f64; 2]) {
    let (p, q) = ([inp[0], inp[1]], [inp[2], inp[3]]);
    match by {
        RegularBy::CenterVertex => (p, q),
        RegularBy::CenterOffset => (p, [p[0] + q[0], p[1] + q[1]]),
        RegularBy::VertexOffset => ([p[0] + q[0], p[1] + q[1]], p),
        // The center is an inradius from the side's midpoint, to its left.
        RegularBy::Adjacent => {
            let (sx, sy) = (q[0] - p[0], q[1] - p[1]);
            let inradius = 0.5 / (PI / n as f64).tan();
            (
                [
                    (p[0] + q[0]) / 2.0 - sy * inradius,
                    (p[1] + q[1]) / 2.0 + sx * inradius,
                ],
                p,
            )
        }
    }
}

/// The `n` vertices about `center`, the first at `center + u`, turning
/// counterclockwise, into `out`.
fn regular_vertices(n: usize, center: [f64; 2], u: [f64; 2], out: &mut [f64]) {
    for k in 0..n {
        let (s, c) = (k as f64 * TAU / n as f64).sin_cos();
        out[2 * k] = center[0] + u[0] * c - u[1] * s;
        out[2 * k + 1] = center[1] + u[0] * s + u[1] * c;
    }
}

/// The least-squares line `y = m x + k` through the points of `p` (`x1, y1,
/// x2, y2, ...`) whose coordinates are finite, as `[m, k]`: the current
/// core's normal equations, which give slope 0 through the mean when the
/// points share one x. NaN with no such point.
fn best_fit_line(p: &[f64]) -> [f64; 2] {
    let points = || {
        p.chunks_exact(2)
            .filter(|xy| xy[0].is_finite() && xy[1].is_finite())
    };
    let n = points().count() as f64;
    if n == 0.0 {
        return [f64::NAN, f64::NAN];
    }
    let (mx, my) = points().fold((0.0, 0.0), |(sx, sy), xy| (sx + xy[0], sy + xy[1]));
    let (mx, my) = (mx / n, my / n);
    let (sxx, sxy) = points().fold((0.0, 0.0), |(sxx, sxy), xy| {
        let dx = xy[0] - mx;
        (sxx + dx * dx, sxy + dx * (xy[1] - my))
    });
    let m = if sxx == 0.0 { 0.0 } else { sxy / sxx };
    [m, my - m * mx]
}

/// Where the line through `inp[0..4]` crosses the one through `inp[4..8]`,
/// as the current core finds it; None when they are parallel or the same
/// (to within 1e-14), a coordinate is not finite, or a segment among them
/// misses the crossing.
fn intersect_lines(inp: &[f64], segment1: bool, segment2: bool) -> Option<(f64, f64)> {
    let [x1, y1, x2, y2, x3, y3, x4, y4] = <[f64; 8]>::try_from(&inp[..8]).ok()?;
    if !inp[..8].iter().all(|v| v.is_finite()) {
        return None;
    }
    let (dx12, dx34, dy12, dy34) = (x1 - x2, x3 - x4, y1 - y2, y3 - y4);
    let d = dx12 * dy34 - dx34 * dy12;
    if d.abs() < 1e-14 {
        return None;
    }
    let (dx13, dy13) = (x1 - x3, y1 - y3);
    let misses = |num: f64| {
        let num = num * d.signum();
        num < 0.0 || num > d.abs()
    };
    if segment1 && misses(dx13 * dy34 - dy13 * dx34) {
        return None;
    }
    if segment2 && misses(dx13 * dy12 - dy13 * dx12) {
        return None;
    }
    let det12 = x1 * y2 - x2 * y1;
    let det34 = x3 * y4 - x4 * y3;
    Some((
        (det12 * dx34 - det34 * dx12) / d,
        (det12 * dy34 - det34 * dy12) / d,
    ))
}

/// The parabola with vertex (x, y) and leading coefficient `a`.
fn parabola_at_vertex(a: f64, x: f64, y: f64) -> [f64; 3] {
    [a, -2.0 * a * x, a * x * x + y]
}

/// The parabola through (x1, y1) and (x2, y2) with leading coefficient
/// `a`; at the vertex when they are the same point; NaN when they differ
/// only in y.
fn parabola_through_two(a: f64, [x1, y1]: [f64; 2], [x2, y2]: [f64; 2]) -> [f64; 3] {
    if x1 == x2 {
        if y1 == y2 {
            parabola_at_vertex(a, x1, y1)
        } else {
            [f64::NAN; 3]
        }
    } else {
        let b = (y1 - y2 - a * (x1 * x1 - x2 * x2)) / (x1 - x2);
        [a, b, y1 - a * x1 * x1 - b * x1]
    }
}

/// The vertex of `y = a x² + b x + c`; not finite when `a` is 0.
fn parabola_vertex(a: f64, b: f64, c: f64) -> [f64; 2] {
    let x = -b / (2.0 * a);
    [x, c - b * b / (4.0 * a)]
}

/// A [`VecOp::Parabola`]'s (a, b, c) from its inputs, as the current core
/// computes them: NaN when a coordinate is not finite or the points allow
/// no parabola.
fn parabola(inp: &[f64], through: usize, vertex: bool) -> [f64; 3] {
    if inp.iter().any(|v| !v.is_finite()) {
        return [f64::NAN; 3];
    }
    if through == 0 && !vertex {
        return [inp[0], inp[1], inp[2]];
    }
    let a = inp[0];
    let points = if vertex { &inp[3..] } else { &inp[1..] };
    let pt = |i: usize| [points[2 * i], points[2 * i + 1]];
    if vertex {
        let (vx, vy) = (inp[1], inp[2]);
        return match through {
            0 => parabola_at_vertex(a, vx, vy),
            1 => {
                let [px, py] = pt(0);
                if px == vx {
                    // A point on the vertex says nothing of `a`; one above
                    // or below it allows no parabola.
                    if py == vy {
                        parabola_at_vertex(a, vx, vy)
                    } else {
                        [f64::NAN; 3]
                    }
                } else {
                    parabola_at_vertex((py - vy) / ((px - vx) * (px - vx)), vx, vy)
                }
            }
            _ => [f64::NAN; 3],
        };
    }
    match through {
        1 => {
            let [x, y] = pt(0);
            parabola_at_vertex(a, x, y)
        }
        2 => parabola_through_two(a, pt(0), pt(1)),
        3 => {
            let ([x1, y1], [x2, y2], [x3, y3]) = (pt(0), pt(1), pt(2));
            let (u1, u2) = (x1 * x1 - x3 * x3, x2 * x2 - x3 * x3);
            let (v1, v2) = (x1 - x3, x2 - x3);
            let (z1, z2) = (y1 - y3, y2 - y3);
            let det = u1 * v2 - u2 * v1;
            if det != 0.0 {
                let a = (z1 * v2 - z2 * v1) / det;
                let b = (z2 * u1 - z1 * u2) / det;
                return [a, b, y1 - b * x1 - a * x1 * x1];
            }
            // Points that coincide count once; two at one x but different
            // y allow no parabola.
            let same = |p: [f64; 2], q: [f64; 2]| p == q;
            let (p1, p2, p3) = (pt(0), pt(1), pt(2));
            if same(p1, p2) && same(p1, p3) {
                parabola_at_vertex(a, x1, y1)
            } else if same(p1, p2) {
                parabola_through_two(a, p1, p3)
            } else if same(p1, p3) || same(p2, p3) {
                parabola_through_two(a, p1, p2)
            } else {
                [f64::NAN; 3]
            }
        }
        _ => [f64::NAN; 3],
    }
}

/// A [`VecOp::Parabola`]'s inverse, as the current core's: the vertex
/// moves to the vertex of the parabola `abc` asks for and each point
/// moves vertically onto it (with a vertex, the point moves sideways with
/// the vertex first; points that coincide move together to the vertex);
/// the leading coefficient is written when `a` was asked. False when the
/// parabola asked for has no finite vertex where one is needed.
fn invert_parabola(
    through: usize,
    vertex: bool,
    inputs: &[CellIdx],
    inp: &[f64],
    [a, b, c]: [f64; 3],
    asked_a: bool,
    out: &mut Produced,
) -> bool {
    if ![a, b, c].iter().all(|v| v.is_finite()) || inp.iter().any(|v| !v.is_finite()) {
        return false;
    }
    if through == 0 && !vertex {
        // The coefficients themselves.
        if asked_a {
            out.write(inputs[0], a);
        }
        for (k, v) in [(1, b), (2, c)] {
            if v != inp[k] {
                out.write(inputs[k], v);
            }
        }
        return true;
    }
    let first = if vertex { 3 } else { 1 };
    let pt = |i: usize| [inp[first + 2 * i], inp[first + 2 * i + 1]];
    let on = |x: f64| [x, (a * x + b) * x + c];
    let top = || parabola_vertex(a, b, c);
    let mut moves: Vec<(usize, [f64; 2])> = Vec::new();
    if vertex {
        let v = top();
        moves.push((1, v));
        if through == 1 {
            let dx = v[0] - inp[1];
            moves.push((first, on(pt(0)[0] + dx)));
        }
    } else {
        let xs: Vec<f64> = (0..through).map(|i| pt(i)[0]).collect();
        let distinct = |i: usize| !xs[..i].contains(&xs[i]);
        let n_distinct = (0..through).filter(|&i| distinct(i)).count();
        // One point, or points all at one x: they go to the vertex.
        let all_at_vertex = n_distinct == 1;
        for (i, &x) in xs.iter().enumerate() {
            moves.push((first + 2 * i, if all_at_vertex { top() } else { on(x) }));
        }
    }
    if moves.iter().flat_map(|(_, p)| p).any(|v| !v.is_finite()) {
        return false;
    }
    for (k, [x, y]) in moves {
        out.group(vec![PointRequest {
            cells: [inputs[k], inputs[k + 1]],
            values: [x, y],
        }]);
    }
    if asked_a {
        out.write(inputs[0], a);
    }
    true
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
            pivot,
        } = opts;
        let min_shrink = inp[2 * n + 2];
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
                } else if matches!(
                    dot.partial_cmp(&(min_shrink * om)),
                    None | Some(std::cmp::Ordering::Less)
                ) {
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

/// Unit direction, or straight up when the two points coincide.
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

/// Every input a vector inverse writes, as a scalar write or a point of a
/// group, is one [`VecOp::writes`] declares; and every inverse round-trips:
/// what it writes, evaluated again, gives the requested outputs, or a
/// projection that asking again leaves where it is.
#[cfg(test)]
mod writes {
    use super::*;

    fn ops() -> Vec<VecOp> {
        let dilating = RigidOpts {
            dilate: true,
            pivot: Pivot::Point,
            ..RigidOpts::RIGID
        };
        let fixed_pivot = RigidOpts {
            rotate: false,
            dilate: true,
            pivot: Pivot::Vertex(1),
            ..RigidOpts::RIGID
        };
        vec![
            VecOp::Shape {
                n: 3,
                opts: RigidOpts::RIGID,
            },
            VecOp::Shape {
                n: 3,
                opts: dilating,
            },
            VecOp::Shape {
                n: 2,
                opts: fixed_pivot,
            },
            VecOp::CircleCenterPoint,
            VecOp::CirclePoints { n: 2 },
            VecOp::CirclePoints { n: 3 },
            VecOp::CircleTwoPointsRadius,
            VecOp::PolarSlope,
            VecOp::PolarDirection {
                perpendicular: false,
            },
            VecOp::PolarDirection {
                perpendicular: true,
            },
            VecOp::LinePointsFromCoeffs,
            VecOp::ProjectCircle,
            VecOp::ProjectLine,
            VecOp::First { n: 2 },
            VecOp::Choose { n: 3 },
            VecOp::WeightedMean { n: 2 },
            VecOp::Clamp,
            VecOp::Centroid { n: 3 },
            VecOp::SequencePick { n_exclude: 0 },
            VecOp::SequencePick { n_exclude: 2 },
            VecOp::Reduce {
                op: Reduction::Sum,
                n: 3,
            },
            VecOp::Reduce {
                op: Reduction::Variance,
                n: 4,
            },
            VecOp::Reduce {
                op: Reduction::Between,
                n: 4,
            },
            VecOp::Wrap,
            VecOp::Pair { by: PairBy::Offset },
            VecOp::Pair { by: PairBy::Back },
            VecOp::Pair { by: PairBy::Mirror },
            VecOp::Pair { by: PairBy::Center },
            VecOp::Extent,
            VecOp::AngleAt {
                reflex: Reflex::Never,
            },
            VecOp::AngleAt {
                reflex: Reflex::Always,
            },
            VecOp::RegularPolygon {
                n: 3,
                by: RegularBy::CenterVertex,
            },
            VecOp::RegularPolygon {
                n: 4,
                by: RegularBy::CenterOffset,
            },
            VecOp::RegularPolygon {
                n: 5,
                by: RegularBy::VertexOffset,
            },
            VecOp::RegularPolygon {
                n: 6,
                by: RegularBy::Adjacent,
            },
            VecOp::Scan {
                op: Scan::Sum,
                n: 3,
            },
            VecOp::Scan {
                op: Scan::Max,
                n: 3,
            },
            VecOp::Scan {
                op: Scan::Differences,
                n: 3,
            },
            VecOp::Sort {
                n: 3,
                decreasing: false,
            },
            VecOp::Shuffle { n: 3 },
            VecOp::Draws {
                dist: Dist::Uniform,
                n: 2,
                n_exclude: 0,
            },
            VecOp::Draws {
                dist: Dist::Gaussian,
                n: 2,
                n_exclude: 0,
            },
            VecOp::Draws {
                dist: Dist::Sequence {
                    replace: false,
                    order: Order::Increasing,
                },
                n: 2,
                n_exclude: 1,
            },
            VecOp::Draws {
                dist: Dist::Primes {
                    replace: true,
                    order: Order::Unsorted,
                },
                n: 2,
                n_exclude: 1,
            },
            VecOp::Moments {
                dist: Dist::Sequence {
                    replace: true,
                    order: Order::Unsorted,
                },
                n_exclude: 1,
            },
            VecOp::BestFitLine { n: 3 },
            VecOp::IntersectLines {
                segment1: false,
                segment2: true,
            },
            VecOp::Parabola {
                through: 0,
                vertex: false,
            },
            VecOp::Parabola {
                through: 1,
                vertex: false,
            },
            VecOp::Parabola {
                through: 2,
                vertex: false,
            },
            VecOp::Parabola {
                through: 3,
                vertex: false,
            },
            VecOp::Parabola {
                through: 0,
                vertex: true,
            },
            VecOp::Parabola {
                through: 1,
                vertex: true,
            },
            VecOp::IntoDomain,
            VecOp::DomainRange,
            VecOp::DomainHull { n: 2 },
            VecOp::SequenceParams { given: 0b0110 },
            VecOp::SequenceCount { n_exclude: 1 },
            VecOp::SequenceEntry { n_exclude: 1 },
        ]
    }

    /// Input values: generic, with zeros, with a NaN, and a choice of
    /// each branch for [`Choose`].
    fn inputs(n: usize) -> Vec<Vec<f64>> {
        let generic: Vec<f64> = (0..n).map(|k| 0.5 + k as f64 * 1.25).collect();
        let zeros = vec![0.0; n];
        let mut nan = generic.clone();
        nan[n - 1] = f64::NAN;
        let mut out = vec![generic, zeros, nan];
        for choice in 1..=3 {
            let mut v: Vec<f64> = (0..n).map(|k| k as f64 + 2.0).collect();
            v[0] = choice as f64;
            out.push(v);
        }
        out
    }

    #[test]
    fn every_vector_inverse_writes_a_declared_input() {
        for op in ops() {
            let (n_in, n_out) = (op.n_in(), op.n_out());
            let cells: Vec<CellIdx> = CellIdx::below(n_in).collect();
            for inp in inputs(n_in) {
                let mut cur = vec![0.0; n_out];
                op.eval(&inp, &mut cur);
                // Each output alone, then all together, asked to move.
                let mut asks: Vec<Vec<Option<f64>>> = (0..n_out)
                    .map(|k| {
                        let mut d = vec![None; n_out];
                        d[k] = Some(cur[k] + 1.5);
                        d
                    })
                    .collect();
                asks.push(cur.iter().map(|v| Some(v - 0.75)).collect());
                for desired in asks {
                    let mut out = Produced::default();
                    op.invert(&cells, &inp, &cur, &desired, &mut out);
                    let written = out
                        .writes
                        .iter()
                        .map(|w| w.0)
                        .chain(out.groups.iter().flatten().flat_map(|p| p.cells));
                    for c in written {
                        assert!(
                            op.writes() & (1 << c.index()) != 0,
                            "{op:?} at {inp:?}, asked {desired:?}, wrote input {c}, which it does not declare"
                        );
                    }
                }
            }
        }
    }

    fn close(a: f64, b: f64) -> bool {
        a == b
            || (a - b).abs() <= 1e-9 * a.abs().max(b.abs()).max(1.0)
            || (a.is_nan() && b.is_nan())
    }

    /// `inp` with everything `out` writes, as the request engine writes it
    /// when nothing holds an input back.
    fn written(inp: &[f64], out: &Produced) -> Vec<f64> {
        let mut next = inp.to_vec();
        for &(c, v) in &out.writes {
            next[c.index()] = v;
        }
        for p in out.groups.iter().flatten() {
            next[p.cells[0].index()] = p.values[0];
            next[p.cells[1].index()] = p.values[1];
        }
        next
    }

    /// The outputs after asking `desired` of `op` at `inp`, or None when the
    /// inverse drops it.
    fn after(op: VecOp, inp: &[f64], desired: &[Option<f64>]) -> Option<(Vec<f64>, Vec<f64>)> {
        let cells: Vec<CellIdx> = CellIdx::below(op.n_in()).collect();
        let mut cur = vec![0.0; op.n_out()];
        op.eval(inp, &mut cur);
        let mut out = Produced::default();
        if !op.invert(&cells, inp, &cur, desired, &mut out) {
            return None;
        }
        let next = written(inp, &out);
        let mut got = vec![0.0; op.n_out()];
        op.eval(&next, &mut got);
        Some((next, got))
    }

    /// The outputs a request asks together: a point's two coordinates, as
    /// a renderer drags a point, and each other output alone.
    fn requested_together(op: VecOp) -> Vec<Vec<usize>> {
        let points = |n: usize| (0..n).map(|i| vec![2 * i, 2 * i + 1]);
        match op {
            VecOp::Shape { n, .. } => points(n as usize).collect(),
            VecOp::CircleCenterPoint | VecOp::CirclePoints { .. } => vec![vec![0, 1], vec![2]],
            VecOp::CircleTwoPointsRadius
            | VecOp::PolarSlope
            | VecOp::PolarDirection { .. }
            | VecOp::ProjectCircle
            | VecOp::ProjectLine => points(1).collect(),
            VecOp::LinePointsFromCoeffs | VecOp::Pair { .. } => points(2).collect(),
            VecOp::Centroid { .. } => points(1).collect(),
            VecOp::RegularPolygon { n, .. } => points(n as usize).collect(),
            VecOp::First { .. }
            | VecOp::Choose { .. }
            | VecOp::WeightedMean { .. }
            | VecOp::Clamp
            | VecOp::SequencePick { .. }
            | VecOp::Reduce { .. }
            | VecOp::Wrap
            | VecOp::Extent
            | VecOp::AngleAt { .. }
            | VecOp::Scan { .. }
            | VecOp::Sort { .. }
            | VecOp::Shuffle { .. }
            | VecOp::Draws { .. }
            | VecOp::Moments { .. }
            | VecOp::BestFitLine { .. }
            | VecOp::IntersectLines { .. } => (0..op.n_out()).map(|k| vec![k]).collect(),
            VecOp::Parabola { .. } => vec![vec![0], vec![1], vec![2], vec![3, 4]],
            VecOp::IntoDomain => vec![vec![0]],
            VecOp::DomainRange
            | VecOp::DomainHull { .. }
            | VecOp::SequenceParams { .. }
            | VecOp::SequenceCount { .. }
            | VecOp::SequenceEntry { .. } => (0..op.n_out()).map(|k| vec![k]).collect(),
        }
    }

    /// A pick with nothing excluded is the draw a pick made before it was
    /// an instruction (ADR 0037): `from + step * k`, `k` the draw scaled by
    /// the count, so every pick a seed gave is the one it gives.
    #[test]
    fn a_sequence_pick_is_the_draw_scaled_by_the_count() {
        let params = [
            (1.0, 1.0, 5.0),
            (2.0, 1.0, 5.0),
            (0.0, 0.1, 0.3),
            (-3.0, 0.5, 4.25),
            (10.0, -2.0, 1.0),
            (3.0, 1.0, 3.0),
        ];
        for (from, step, to) in params {
            let count = ((to - from) / step + 1e-10_f64).floor() + 1.0;
            for i in 0..1000u64 {
                let h = {
                    let mut z = i.wrapping_add(0x9e37_79b9_7f4a_7c15);
                    z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
                    z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
                    z ^ (z >> 31)
                };
                let draw = (h >> 11) as f64 / (1u64 << 53) as f64;
                let k = ((h >> 11) as f64 / (1u64 << 53) as f64 * count as u32 as f64) as u32;
                let before = from + step * k.min(count as u32 - 1) as f64;
                let mut out = [0.0];
                VecOp::SequencePick { n_exclude: 0 }.eval(&[draw, from, step, to], &mut out);
                assert_eq!(
                    out[0].to_bits(),
                    before.to_bits(),
                    "{from} {step} {to} at {draw}"
                );
            }
        }
        // Excluded values are skipped, and every value left is drawn.
        let mut seen = std::collections::BTreeSet::new();
        for i in 0..200 {
            let mut out = [0.0];
            VecOp::SequencePick { n_exclude: 2 }
                .eval(&[i as f64 / 200.0, 1.0, 1.0, 5.0, 2.0, 4.0], &mut out);
            seen.insert(out[0] as i64);
        }
        assert_eq!(seen.into_iter().collect::<Vec<_>>(), [1, 3, 5]);
    }

    /// Every vector operator's range rule holds what it gives from
    /// inputs sampled in the ranges, as `program::scalar::ranges` checks
    /// the scalar ones.
    #[test]
    fn every_vector_range_holds_what_it_gives() {
        let spans = [
            Range::Span(1.0, 1.0),
            Range::Span(1.0, 2.5),
            Range::Span(-2.0, 3.0),
            Range::Span(0.5, 4.0),
            Range::Span(-1e3, 1e3),
        ];
        for op in ops() {
            let n = op.n_in();
            // Each input in a span chosen by its position and a shift.
            for shift in 0..spans.len() {
                let ranges: Vec<Range> = (0..n).map(|k| spans[(k + shift) % spans.len()]).collect();
                let rule = op.range(&ranges);
                for sample in 0..=8 {
                    let inp: Vec<f64> = ranges
                        .iter()
                        .enumerate()
                        .map(|(k, r)| match *r {
                            Range::Span(lo, hi) => {
                                let t = ((sample + k) % 9) as f64 / 8.0;
                                lo + (hi - lo) * t
                            }
                            Range::Top => 0.0,
                        })
                        .collect();
                    let mut out = vec![0.0; op.n_out()];
                    op.eval(&inp, &mut out);
                    let v = out[0];
                    let ok = match rule {
                        Range::Top => true,
                        Range::Span(lo, hi) => !v.is_nan() && lo <= v && v <= hi,
                    };
                    assert!(
                        ok,
                        "{op:?} over {ranges:?} at {inp:?} gave {v}, outside {rule:?}"
                    );
                }
            }
        }
    }

    #[test]
    fn every_vector_inverse_round_trips() {
        let mut failures = Vec::new();
        for op in ops() {
            let n_out = op.n_out();
            for inp in inputs(op.n_in()) {
                let mut cur = vec![0.0; n_out];
                op.eval(&inp, &mut cur);
                // Each point or other output alone, asked to move, then all
                // together.
                let mut asks: Vec<Vec<Option<f64>>> = requested_together(op)
                    .into_iter()
                    .map(|ks| {
                        let mut d = vec![None; n_out];
                        for (j, k) in ks.into_iter().enumerate() {
                            d[k] = Some(cur[k] + 1.5 - j as f64);
                        }
                        d
                    })
                    .collect();
                asks.push(cur.iter().map(|v| Some(v - 0.75)).collect());
                for desired in asks {
                    let Some((next, got)) = after(op, &inp, &desired) else {
                        continue;
                    };
                    let asked: Vec<usize> = (0..n_out).filter(|&k| desired[k].is_some()).collect();
                    let exact = asked.iter().all(|&k| close(got[k], desired[k].unwrap()));
                    if !exact {
                        // A projection: asking again, for what it gave or for
                        // the first values, leaves it where it is.
                        let again: Vec<Option<f64>> =
                            (0..n_out).map(|k| desired[k].map(|_| got[k])).collect();
                        let lands = |d: &[Option<f64>]| match after(op, &next, d) {
                            None => true,
                            Some((_, g)) => asked.iter().all(|&k| close(g[k], got[k])),
                        };
                        if !lands(&again) || !lands(&desired) {
                            failures.push(format!(
                                "{op:?} at {inp:?}: asked {desired:?}, got {got:?}, and asking again moves it"
                            ));
                        }
                    }
                    // The rules the operators state (the module documentation).
                    if let VecOp::Shape { n, opts } = op
                        && !opts.dilate
                        && inp.iter().all(|v| v.is_finite())
                    {
                        let d = |p: &[f64], i: usize, j: usize| {
                            (p[2 * i] - p[2 * j]).hypot(p[2 * i + 1] - p[2 * j + 1])
                        };
                        for i in 0..n as usize {
                            for j in i + 1..n as usize {
                                if !close(d(&inp, i, j), d(&next, i, j)) {
                                    failures.push(format!(
                                        "{op:?} at {inp:?}: asked {desired:?}, and points {i} and {j} moved apart"
                                    ));
                                }
                            }
                        }
                    }
                    let circle =
                        matches!(op, VecOp::CircleCenterPoint | VecOp::CirclePoints { .. });
                    if circle && desired[2].is_none() && !close(got[2], cur[2]) {
                        failures.push(format!(
                            "{op:?} at {inp:?}: asked {desired:?}, and the radius changed from {} to {}",
                            cur[2], got[2]
                        ));
                    }
                }
            }
        }
        assert!(failures.is_empty(), "{}", failures.join("\n"));
    }

    fn eval(op: VecOp, inp: &[f64]) -> Vec<f64> {
        let mut out = vec![0.0; op.n_out()];
        op.eval(inp, &mut out);
        out
    }

    /// The fits the current core's tests check: four points, one point,
    /// points at one x, and a point that is not finite passed over.
    #[test]
    fn a_best_fit_line_is_the_least_squares_line() {
        let fit = |p: &[f64]| {
            eval(
                VecOp::BestFitLine {
                    n: (p.len() / 2) as u8,
                },
                p,
            )
        };
        assert_eq!(
            fit(&[1.0, 2.0, 1.0, 6.0, 7.0, 3.0, 7.0, -1.0]),
            [-0.5, -1.0, 4.5]
        );
        assert_eq!(
            fit(&[-5.0, -8.0, 3.0, 5.0, -5.0, -10.0, 3.0, 9.0]),
            [2.0, -1.0, 1.0]
        );
        assert_eq!(fit(&[3.0, 4.0]), [0.0, -1.0, 4.0]);
        assert_eq!(fit(&[-5.0, -8.0, -5.0, 0.0]), [0.0, -1.0, -4.0]);
        assert_eq!(fit(&[3.0, 4.0, f64::NAN, 1.0, -5.0, 0.0]), [0.5, -1.0, 2.5]);
        assert!(fit(&[f64::NAN, 1.0]).iter().all(|v| v.is_nan()));
    }

    #[test]
    fn lines_cross_where_both_pass() {
        let cross =
            |segment1, segment2, p: &[f64]| eval(VecOp::IntersectLines { segment1, segment2 }, p);
        let lines = [-8.0, -7.0, 8.0, 9.0, 4.0, 6.0, -4.0, -6.0];
        assert_eq!(cross(false, false, &lines), [2.0, 3.0, 0.0]);
        // Parallel or the same: none.
        let none = cross(false, false, &[1.0, 2.0, 2.0, 2.0, 3.0, 2.0, 4.0, 2.0]);
        assert!(none[0].is_nan() && none[1].is_nan() && none[2] == 1.0);
        // A segment that stops short of the crossing misses it.
        let short = [-8.0, -7.0, 0.0, 1.0, 4.0, 6.0, -4.0, -6.0];
        assert_eq!(cross(false, false, &short), [2.0, 3.0, 0.0]);
        assert_eq!(cross(true, false, &short)[2], 1.0);
        assert_eq!(cross(false, true, &short), [2.0, 3.0, 0.0]);
    }

    /// The coefficients the current core finds, and an inverse that moves
    /// the points onto the parabola asked for.
    #[test]
    fn a_parabola_passes_through_its_points() {
        let p = |through, vertex, inp: &[f64]| {
            eval(VecOp::Parabola { through, vertex }, inp)[..3].to_vec()
        };
        // One point is the vertex; two take `a`; three fix all.
        assert_eq!(p(1, false, &[1.0, 1.0, 2.0]), [1.0, -2.0, 3.0]);
        assert_eq!(p(2, false, &[1.0, 1.0, 2.0, 3.0, 4.0]), [1.0, -3.0, 4.0]);
        assert_eq!(
            p(3, false, &[1.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0]),
            [0.0, 1.0, 1.0]
        );
        let abc = p(3, false, &[1.0, -1.0, 1.0, 0.0, 0.0, 2.0, 4.0]);
        assert_eq!(abc, [1.0, 0.0, 0.0]);
        // A vertex, and a vertex with a point that sets `a`.
        assert_eq!(p(0, true, &[2.0, 1.0, 2.0]), [2.0, -4.0, 4.0]);
        assert_eq!(p(1, true, &[1.0, 1.0, 2.0, 3.0, 4.0]), [0.5, -1.0, 2.5]);
        // Two points at one x, or a point above the vertex: none.
        assert!(p(2, false, &[1.0, 1.0, 2.0, 1.0, 3.0])[0].is_nan());
        assert!(p(1, true, &[1.0, 1.0, 2.0, 1.0, 4.0])[0].is_nan());

        // Asking for y = 2x² - x + 1 of three points moves each vertically.
        let op = VecOp::Parabola {
            through: 3,
            vertex: false,
        };
        let inp = [1.0, -1.0, 1.0, 0.0, 0.0, 2.0, 4.0];
        let desired = [Some(2.0), Some(-1.0), Some(1.0), None, None];
        let (next, got) = after(op, &inp, &desired).unwrap();
        assert_eq!(got[..3], [2.0, -1.0, 1.0]);
        assert_eq!(next, [2.0, -1.0, 4.0, 0.0, 1.0, 2.0, 7.0]);
        // With a vertex and a point, the point moves sideways with it.
        let op = VecOp::Parabola {
            through: 1,
            vertex: true,
        };
        let desired = [None, Some(-3.0), None, None, None];
        let (next, got) = after(op, &[1.0, 1.0, 2.0, 3.0, 4.0], &desired).unwrap();
        assert!(close(got[1], -3.0) && close(got[0], 0.5) && close(got[2], 2.5));
        assert!(close(next[1], 3.0) && close(next[3], 5.0));
        // The vertex of y = x² - 2x + 3 is (1, 2); asking for (2, 0)
        // keeps `a` and moves the one point, the vertex, there.
        let op = VecOp::Parabola {
            through: 1,
            vertex: false,
        };
        let inp = [1.0, 1.0, 2.0];
        assert_eq!(eval(op, &inp)[3..], [1.0, 2.0]);
        let desired = [None, None, None, Some(2.0), Some(0.0)];
        let (next, got) = after(op, &inp, &desired).unwrap();
        assert_eq!(next, [1.0, 2.0, 0.0]);
        assert_eq!(got, [1.0, -4.0, 4.0, 2.0, 0.0]);
    }
}

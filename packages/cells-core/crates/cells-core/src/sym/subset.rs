//! Subsets of the real numbers (`<subsetOfReals>`): unions of intervals
//! and points, read from an expression and written back as one, as the
//! JavaScript core's `subset-of-reals` utilities read and write them
//! (`buildSubsetFromMathExpression`, `mathExpressionFromSubsetValue`).
//!
//! A subset is held normalized: its pieces sorted, disjoint and as long as
//! they go, each an interval or a point, so a union, an intersection and a
//! complement are operations on sorted pieces, and the expression written
//! back is the JavaScript core's after its `Union` merges and its
//! `mergeIntervals` closes intervals at their points.

use math_expressions as me;
use me::expr::SeqKind;
use me::{Expr, MathConst, Number, RelOp};

/// A piece of a subset: the numbers from `lo` to `hi`, each end in or not.
/// A point is a piece with equal ends, both in.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) struct Piece {
    lo: f64,
    hi: f64,
    lo_in: bool,
    hi_in: bool,
}

impl Piece {
    fn point(x: f64) -> Piece {
        Piece {
            lo: x,
            hi: x,
            lo_in: true,
            hi_in: true,
        }
    }

    fn is_point(&self) -> bool {
        self.lo == self.hi
    }
}

/// A subset of the reals, or no subset: what an expression that names
/// none reads as (`(a, b)`, `x = a`), shown as the blank.
#[derive(Debug, Clone, PartialEq)]
pub(crate) enum Subset {
    Invalid,
    /// Sorted, disjoint pieces no two of which join; none for the empty
    /// set.
    Pieces(Vec<Piece>),
}

/// Which part of a subset a `<subsetOfReals>` prop is.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SubsetPart {
    /// The subset, as intervals and points or as inequalities.
    Value,
    /// The ends of its intervals and its points, ascending.
    Points,
    /// Whether each of those is in the subset.
    PointsClosed,
    /// Its intervals.
    Intervals,
    /// Its points that are no end of an interval.
    IsolatedPoints,
}

impl Subset {
    fn empty() -> Subset {
        Subset::Pieces(Vec::new())
    }

    fn real_line() -> Subset {
        Subset::Pieces(vec![Piece {
            lo: f64::NEG_INFINITY,
            hi: f64::INFINITY,
            lo_in: false,
            hi_in: false,
        }])
    }

    /// The subset of `pieces`, normalized: empty ones dropped, infinite
    /// ends left out, overlapping and touching ones joined.
    fn of(pieces: Vec<Piece>) -> Subset {
        let mut ps: Vec<Piece> = pieces
            .into_iter()
            .map(|mut p| {
                p.lo_in &= p.lo.is_finite();
                p.hi_in &= p.hi.is_finite();
                p
            })
            .filter(|p| p.lo < p.hi || (p.lo == p.hi && p.lo_in && p.hi_in))
            .collect();
        ps.sort_by(|a, b| a.lo.total_cmp(&b.lo).then(b.lo_in.cmp(&a.lo_in)));
        let mut out: Vec<Piece> = Vec::with_capacity(ps.len());
        for p in ps {
            if let Some(c) = out.last_mut()
                && (p.lo < c.hi || (p.lo == c.hi && (c.hi_in || p.lo_in)))
            {
                if p.hi > c.hi {
                    c.hi = p.hi;
                    c.hi_in = p.hi_in;
                } else if p.hi == c.hi {
                    c.hi_in |= p.hi_in;
                }
                continue;
            }
            out.push(p);
        }
        Subset::Pieces(out)
    }

    fn union(self, other: Subset) -> Subset {
        match (self, other) {
            (Subset::Pieces(mut a), Subset::Pieces(b)) => {
                a.extend(b);
                Subset::of(a)
            }
            _ => Subset::Invalid,
        }
    }

    fn complement(self) -> Subset {
        let Subset::Pieces(ps) = self else {
            return Subset::Invalid;
        };
        let mut out = Vec::with_capacity(ps.len() + 1);
        let (mut lo, mut lo_in) = (f64::NEG_INFINITY, false);
        for p in ps {
            out.push(Piece {
                lo,
                hi: p.lo,
                lo_in,
                hi_in: !p.lo_in,
            });
            (lo, lo_in) = (p.hi, !p.hi_in);
        }
        out.push(Piece {
            lo,
            hi: f64::INFINITY,
            lo_in,
            hi_in: false,
        });
        Subset::of(out)
    }

    /// As the JavaScript core intersects: the empty set with anything is
    /// empty, and otherwise no subset with anything is none.
    fn intersect(self, other: Subset) -> Subset {
        match (self, other) {
            (Subset::Pieces(a), _) if a.is_empty() => Subset::empty(),
            (a @ Subset::Pieces(_), b @ Subset::Pieces(_)) => {
                a.complement().union(b.complement()).complement()
            }
            _ => Subset::Invalid,
        }
    }

    /// The subset `e` names, its inequalities and memberships in `var`: an
    /// interval (`(a, b]`, its ends numbers or infinite), a point, `R`,
    /// `emptyset`, unions and intersections (`union`, `or`, a set or a
    /// list; `intersect`, `and`), a complement (`A^c`), an inequality or
    /// equation in `var` (`x > 1`, `1 < x <= 3`, `x != 2`), a membership
    /// (`x in A`, `A ni x`, `x notin A`) and set-builder notation (`{t |
    /// t > 0}`, in its own variable). `e` has had its pairs made intervals
    /// (`to_intervals`).
    pub(crate) fn read(e: &Expr, var: &Expr) -> Subset {
        match e {
            Expr::Sym(s) => match s.name().as_str() {
                "R" => Subset::real_line(),
                "emptyset" => Subset::empty(),
                _ => Subset::Invalid,
            },
            Expr::Interval { endpoints, closed } => {
                match (end_value(&endpoints.0), end_value(&endpoints.1)) {
                    (Some(lo), Some(hi)) => Subset::of(vec![Piece {
                        lo,
                        hi,
                        lo_in: closed.0,
                        hi_in: closed.1,
                    }]),
                    _ => Subset::Invalid,
                }
            }
            Expr::Union(xs)
            | Expr::Or(xs)
            | Expr::Seq(SeqKind::Set, xs)
            | Expr::Seq(SeqKind::List, xs) => xs
                .iter()
                .map(|x| Subset::read(x, var))
                .fold(Subset::empty(), Subset::union),
            Expr::Intersect(xs) | Expr::And(xs) => {
                let mut pieces = xs.iter().map(|x| Subset::read(x, var));
                match pieces.next() {
                    None => Subset::real_line(),
                    Some(first) => pieces.fold(first, Subset::intersect),
                }
            }
            Expr::Relation { operands, ops } => read_relation(operands, ops, var),
            Expr::OtherOp(op, args) if op.name() == "|" && args.len() == 2 => {
                Subset::read(&args[1], &args[0])
            }
            Expr::Pow(base, exp) if matches!(&**exp, Expr::Sym(s) if matches!(s.name().as_str(), "c" | "C")) => {
                Subset::read(base, var).complement()
            }
            _ => match number_value(e) {
                Some(x) if x.is_finite() => Subset::of(vec![Piece::point(x)]),
                _ => Subset::Invalid,
            },
        }
    }

    /// The subset as an expression: intervals and points, or inequalities
    /// in `var`, as the JavaScript core writes one.
    pub(crate) fn expr(&self, var: &Expr, inequalities: bool) -> Expr {
        let Subset::Pieces(ps) = self else {
            return Expr::Blank;
        };
        let whole = |name: &str| {
            if inequalities {
                relation(vec![var.clone(), Expr::sym(name)], vec![RelOp::In])
            } else {
                Expr::sym(name)
            }
        };
        if ps.is_empty() {
            return whole("emptyset");
        }
        if *self == Subset::real_line() {
            return whole("R");
        }
        let mut xs: Vec<Expr> = ps
            .iter()
            .map(|p| {
                if inequalities {
                    inequality(p, var)
                } else {
                    interval(p)
                }
            })
            .collect();
        if xs.len() == 1 {
            xs.pop().expect("one piece")
        } else if inequalities {
            Expr::Or(xs)
        } else {
            Expr::Union(xs)
        }
    }

    /// One of its parts (`points`, `intervals`, ..) as a list: its one
    /// entry alone, nothing for none.
    pub(crate) fn part(&self, part: SubsetPart, var: &Expr, inequalities: bool) -> Expr {
        let Subset::Pieces(ps) = self else {
            return if part == SubsetPart::Value {
                Expr::Blank
            } else {
                Expr::Seq(SeqKind::List, Vec::new())
            };
        };
        let mut xs: Vec<Expr> = match part {
            SubsetPart::Value => return self.expr(var, inequalities),
            SubsetPart::Points | SubsetPart::PointsClosed => {
                let mut points: Vec<(f64, bool)> = Vec::new();
                let mut add = |x: f64, inside: bool| {
                    if !x.is_finite() {
                        return;
                    }
                    match points.iter_mut().find(|(y, _)| *y == x) {
                        Some((_, i)) => *i |= inside,
                        None => points.push((x, inside)),
                    }
                };
                for p in ps {
                    if p.is_point() {
                        add(p.lo, true);
                    } else {
                        add(p.lo, p.lo_in);
                        add(p.hi, p.hi_in);
                    }
                }
                points.sort_by(|a, b| a.0.total_cmp(&b.0));
                points
                    .into_iter()
                    .map(|(x, inside)| {
                        if part == SubsetPart::Points {
                            number(x)
                        } else {
                            Expr::Bool(inside)
                        }
                    })
                    .collect()
            }
            SubsetPart::Intervals => ps
                .iter()
                .filter(|p| !p.is_point())
                .map(|p| {
                    let (lo, hi) = (number(p.lo), number(p.hi));
                    Expr::Interval {
                        endpoints: Box::new((lo, hi)),
                        closed: (p.lo_in, p.hi_in),
                    }
                })
                .collect(),
            SubsetPart::IsolatedPoints => ps
                .iter()
                .filter(|p| p.is_point())
                .map(|p| number(p.lo))
                .collect(),
        };
        if xs.len() == 1 {
            xs.pop().expect("one entry")
        } else {
            Expr::Seq(SeqKind::List, xs)
        }
    }
}

/// An interval's end: a number, possibly infinite; none for anything else.
fn end_value(e: &Expr) -> Option<f64> {
    number_value(e).filter(|x| !x.is_nan())
}

/// What `e` evaluates to, if a real number (or an infinity).
fn number_value(e: &Expr) -> Option<f64> {
    match e {
        Expr::Num(n) => Some(n.to_f64()),
        Expr::Const(MathConst::Inf) => Some(f64::INFINITY),
        Expr::Const(MathConst::NegInf) => Some(f64::NEG_INFINITY),
        _ => {
            let z = me::evaluate_to_constant(e)?;
            (z.im.abs() <= 1e-12 * z.re.abs().max(1.0) && !z.re.is_nan()).then_some(z.re)
        }
    }
}

/// An inequality, equation or membership in `var`, as the JavaScript core
/// reads one: `var` on one side and a number (possibly infinite) on the
/// other, or `var` between two numbers.
fn read_relation(operands: &[Expr], ops: &[RelOp], var: &Expr) -> Subset {
    use RelOp::{Eq, Ge, Gt, In, Le, Lt, Ne, Ni, NotIn, NotNi};
    match (operands, ops) {
        ([a, b], [op @ (Lt | Le | Gt | Ge | Eq | Ne)]) => {
            let side = |e: &Expr| {
                if e == var {
                    Some(None)
                } else {
                    end_value(e).map(Some)
                }
            };
            let (Some(a), Some(b)) = (side(a), side(b)) else {
                return Subset::Invalid;
            };
            // `var op x`, the operator turned when `var` is on the right.
            let (op, x) = match (a, b) {
                (None, Some(x)) => (*op, x),
                (Some(x), None) => (
                    match op {
                        Lt => Gt,
                        Le => Ge,
                        Gt => Lt,
                        Ge => Le,
                        other => *other,
                    },
                    x,
                ),
                _ => return Subset::Invalid,
            };
            let (neg, pos) = (f64::NEG_INFINITY, f64::INFINITY);
            let piece = |lo, hi, lo_in, hi_in| {
                Subset::of(vec![Piece {
                    lo,
                    hi,
                    lo_in,
                    hi_in,
                }])
            };
            match op {
                Lt => piece(neg, x, false, false),
                Le => piece(neg, x, false, true),
                Gt => piece(x, pos, false, false),
                Ge => piece(x, pos, true, false),
                Eq if x.is_finite() => Subset::of(vec![Piece::point(x)]),
                Eq => Subset::empty(),
                _ if x.is_finite() => Subset::of(vec![Piece::point(x)]).complement(),
                _ => Subset::real_line(),
            }
        }
        ([a, b], [op @ (In | NotIn)]) if a == var => {
            let s = Subset::read(b, var);
            if *op == NotIn { s.complement() } else { s }
        }
        ([a, b], [op @ (Ni | NotNi)]) if b == var => {
            let s = Subset::read(a, var);
            if *op == NotNi { s.complement() } else { s }
        }
        ([lo, mid, hi], [o1, o2]) if mid == var => {
            let up = matches!((o1, o2), (Lt | Le, Lt | Le));
            let down = matches!((o1, o2), (Gt | Ge, Gt | Ge));
            let (Some(a), Some(b)) = (end_value(lo), end_value(hi)) else {
                return Subset::Invalid;
            };
            if up {
                Subset::of(vec![Piece {
                    lo: a,
                    hi: b,
                    lo_in: *o1 == Le,
                    hi_in: *o2 == Le,
                }])
            } else if down {
                Subset::of(vec![Piece {
                    lo: b,
                    hi: a,
                    lo_in: *o2 == Ge,
                    hi_in: *o1 == Ge,
                }])
            } else {
                Subset::Invalid
            }
        }
        _ => Subset::Invalid,
    }
}

fn relation(operands: Vec<Expr>, ops: Vec<RelOp>) -> Expr {
    Expr::Relation { operands, ops }
}

/// A piece as an interval, or a point as the set of it.
fn interval(p: &Piece) -> Expr {
    if p.is_point() {
        return Expr::Seq(SeqKind::Set, vec![number(p.lo)]);
    }
    Expr::Interval {
        endpoints: Box::new((number(p.lo), number(p.hi))),
        closed: (p.lo_in, p.hi_in),
    }
}

/// A piece as an inequality in `var`, or a point as an equation.
fn inequality(p: &Piece, var: &Expr) -> Expr {
    let v = var.clone();
    if p.is_point() {
        return relation(vec![v, number(p.lo)], vec![RelOp::Eq]);
    }
    let op = |inside: bool| if inside { RelOp::Le } else { RelOp::Lt };
    match (p.lo.is_finite(), p.hi.is_finite()) {
        (false, _) => relation(vec![v, number(p.hi)], vec![op(p.hi_in)]),
        (_, false) => relation(
            vec![v, number(p.lo)],
            vec![if p.lo_in { RelOp::Ge } else { RelOp::Gt }],
        ),
        _ => relation(
            vec![number(p.lo), v, number(p.hi)],
            vec![op(p.lo_in), op(p.hi_in)],
        ),
    }
}

/// A number as the engine spells it, the infinities as constants.
fn number(v: f64) -> Expr {
    if v == f64::INFINITY {
        Expr::Const(MathConst::Inf)
    } else if v == f64::NEG_INFINITY {
        Expr::Const(MathConst::NegInf)
    } else {
        Expr::Num(Number::from_f64(v))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::sym::Engine;

    fn read(engine: &mut Engine, text: &str, var: &str, ineq: bool) -> String {
        let h = engine.parse(text).unwrap();
        let v = engine.parse(var).unwrap();
        let out = engine.subset(h, Some(v), SubsetPart::Value, ineq);
        engine.text(out)
    }

    #[test]
    fn subsets_read_and_write_as_the_javascript_core_does() {
        let mut e = Engine::new();
        let cases = [
            ("(4,5)", "(4, 5)"),
            ("(5,4)", "emptyset"),
            ("[5,5]", "{5}"),
            ("(5,5]", "emptyset"),
            ("[4,infinity]", "[4, ∞)"),
            ("(-infinity,infinity]", "R"),
            ("(a,b)", "\u{ff3f}"),
            ("(4,5) union (5,6) union {5}", "(4, 6)"),
            ("(4,5] union [5,6]", "(4, 6]"),
            ("(4,6) union {4}", "[4, 6)"),
            ("(4,6) union {7}", "(4, 6) ∪ {7}"),
            ("(-infinity,5) union (9,infinity) union (4,10)", "R"),
            ("(4,5] intersect [5,6]", "{5}"),
            ("(-infinity,5) intersect [2,infinity)", "[2, 5)"),
            ("[-4,-2) intersect {-4}", "{-4}"),
            ("((4,5) union (5,6))^c", "(-∞, 4] ∪ {5} ∪ [6, ∞)"),
            ("x != 5", "(-∞, 5) ∪ (5, ∞)"),
            ("(x != 5) and (4 < x < 10)", "(4, 5) ∪ (5, 10)"),
            ("4 < x <= 5", "(4, 5]"),
            ("infinity > x > 4", "(4, ∞)"),
            ("x = a", "\u{ff3f}"),
            ("x = infinity", "emptyset"),
            ("{q | q = 5}", "{5}"),
            ("x notelementof [9, infinity)", "(-∞, 9)"),
        ];
        for (text, want) in cases {
            let got = read(&mut e, text, "x", false);
            assert_eq!(
                got.replace("emptyset", "∅"),
                want.replace("emptyset", "∅"),
                "{text}"
            );
        }
    }

    #[test]
    fn inequalities_in_the_variable() {
        let mut e = Engine::new();
        assert_eq!(read(&mut e, "(1,3)", "y", true), "1 < y < 3");
        assert_eq!(read(&mut e, "(-infinity,3]", "y", true), "y ≤ 3");
        assert_eq!(read(&mut e, "y > 1", "y", true), "y > 1");
    }
}

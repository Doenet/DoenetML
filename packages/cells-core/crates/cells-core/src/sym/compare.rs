//! Equality over values with entries (ADR 0041, decision 8): the
//! JavaScript core's lattice (`checkEquality`), over the engine's own
//! equality of what is not a value with entries.
//!
//! A list compares entry by entry, and one value is a list of one; a
//! vector equals a tuple or another vector of the same entries, and no
//! array, interval, set or matrix; an interval compares by exact
//! positions and closedness, and equals the tuple (open) or array (closed)
//! of its ends; a set is its distinct entries, unordered; a matrix compares
//! row by row; a tuple equals no array. One value is a tuple, an array, a
//! vector or a set of one. Anything else is the engine's equality.

use math_expressions as me;
use me::expr::SeqKind;
use me::{EqOptions, Expr};

/// How two values compare, past the lattice.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Hash)]
pub struct CompareOpts {
    /// Entries match in any order (`unorderedCompare`).
    pub unordered: bool,
    /// Some entries matching gives a fraction (`matchPartial`).
    pub partial: bool,
    /// Entries match only where they stand (`matchByExactPositions`).
    pub exact_positions: bool,
    /// As written (`symbolicEquality`), not by value.
    pub syntactic: bool,
}

/// What a value is, for the lattice.
#[derive(Debug, Clone, Copy, PartialEq)]
enum Kind {
    List,
    /// A vector or an alt-vector.
    Vector,
    Tuple,
    Array,
    Set,
    /// An interval, its ends' closedness.
    Interval(bool, bool),
    Matrix,
    Other,
}

fn kind(e: &Expr) -> Kind {
    match e {
        Expr::Seq(SeqKind::List, _) => Kind::List,
        Expr::Seq(SeqKind::Vector | SeqKind::AltVector, _) => Kind::Vector,
        Expr::Seq(SeqKind::Tuple, _) => Kind::Tuple,
        Expr::Seq(SeqKind::Array, _) => Kind::Array,
        Expr::Seq(SeqKind::Set, _) => Kind::Set,
        Expr::Interval { closed, .. } => Kind::Interval(closed.0, closed.1),
        Expr::Matrix(_) => Kind::Matrix,
        _ => Kind::Other,
    }
}

/// The entries of a value with entries: a sequence's, an interval's two
/// ends, a matrix's rows as tuples; none for any other value.
fn entries(e: &Expr) -> Vec<Expr> {
    match e {
        Expr::Seq(_, xs) => xs.clone(),
        Expr::Interval { endpoints, .. } => vec![endpoints.0.clone(), endpoints.1.clone()],
        Expr::Matrix(m) if m.cols() > 0 => m
            .entries()
            .chunks(m.cols() as usize)
            .map(|row| Expr::Seq(SeqKind::Tuple, row.to_vec()))
            .collect(),
        _ => Vec::new(),
    }
}

/// How equal `a` and `b` are, from 0 to 1: 1 when equal, a fraction only
/// when `opts.partial`.
pub(crate) fn check_equality(a: &Expr, b: &Expr, opts: CompareOpts, eq: &EqOptions) -> f64 {
    let base = |x: &Expr, y: &Expr| -> f64 {
        let equal = if opts.syntactic {
            me::equals_syntactic(x, y, eq)
        } else {
            me::equals(x, y, eq)
        };
        if equal { 1.0 } else { 0.0 }
    };
    let (a, b) = if opts.syntactic {
        (a.clone(), b.clone())
    } else {
        // Sums of vectors and multiples of them, as their entries.
        (
            me::perform_vector_matrix_additions_scalar_multiplications(a),
            me::perform_vector_matrix_additions_scalar_multiplications(b),
        )
    };
    let (ka, kb) = (kind(&a), kind(&b));
    let mut unordered = opts.unordered;
    let mut exact = opts.exact_positions;
    let mut on_recursion = CompareOpts {
        unordered: false,
        partial: false,
        exact_positions: false,
        syntactic: opts.syntactic,
    };
    let one = |e: &Expr| vec![e.clone()];
    let distinct = |xs: Vec<Expr>| {
        let mut out: Vec<Expr> = Vec::with_capacity(xs.len());
        for x in xs {
            if !out.iter().any(|y| base(y, &x) == 1.0) {
                out.push(x);
            }
        }
        out
    };
    use Kind::*;
    let (xs, ys) = match (ka, kb) {
        (List, List) => (entries(&a), entries(&b)),
        (List, _) => (entries(&a), one(&b)),
        (_, List) => (one(&a), entries(&b)),
        (Vector, Interval(..) | Matrix | Array | Set)
        | (Interval(..) | Matrix | Array | Set, Vector) => {
            return 0.0;
        }
        (Vector, Vector | Tuple) | (Tuple, Vector) => (entries(&a), entries(&b)),
        (Vector, _) => (entries(&a), one(&b)),
        (_, Vector) => (one(&a), entries(&b)),
        (Interval(l, r), _) | (_, Interval(l, r)) => {
            exact = true;
            let (interval, other, ko) = if matches!(ka, Interval(..)) {
                (&a, &b, kb)
            } else {
                (&b, &a, ka)
            };
            let ends = entries(interval);
            let others = match ko {
                Tuple if !l && !r => entries(other),
                Array if l && r => entries(other),
                Interval(l2, r2) if (l2, r2) == (l, r) => entries(other),
                _ => return 0.0,
            };
            if others.len() != 2 {
                return 0.0;
            }
            if matches!(ka, Interval(..)) {
                (ends, others)
            } else {
                (others, ends)
            }
        }
        (Matrix, Matrix) => {
            exact = true;
            on_recursion.exact_positions = true;
            on_recursion.partial = true;
            (entries(&a), entries(&b))
        }
        (Matrix, _) | (_, Matrix) => return 0.0,
        (Set, Tuple | Array) | (Tuple | Array, Set) => return 0.0,
        (Set, Set) => {
            unordered = true;
            (distinct(entries(&a)), distinct(entries(&b)))
        }
        (Set, _) => {
            unordered = true;
            (distinct(entries(&a)), one(&b))
        }
        (_, Set) => {
            unordered = true;
            (one(&a), distinct(entries(&b)))
        }
        (Tuple, Array) | (Array, Tuple) => return 0.0,
        (Tuple, Tuple) | (Array, Array) => (entries(&a), entries(&b)),
        (Tuple | Array, _) => (entries(&a), one(&b)),
        (_, Tuple | Array) => (one(&a), entries(&b)),
        (Other, Other) => return base(&a, &b),
    };
    if exact {
        unordered = false;
    }
    let sub = |x: &Expr, y: &Expr| check_equality(x, y, on_recursion, eq);
    let (n1, n2) = (xs.len(), ys.len());
    let longest = n1.max(n2) as f64;
    if !unordered {
        let matched: f64 = xs.iter().zip(&ys).map(|(x, y)| sub(x, y)).sum();
        if n1 == n2 && matched == n1 as f64 {
            return 1.0;
        }
        if !opts.partial {
            return 0.0;
        }
        if exact {
            return matched / longest;
        }
        // The best common subsequence.
        let mut c = vec![vec![0.0f64; n2 + 1]; n1 + 1];
        for i in 0..n1 {
            for j in 0..n2 {
                c[i + 1][j + 1] = (c[i][j] + sub(&xs[i], &ys[j]))
                    .max(c[i + 1][j])
                    .max(c[i][j + 1]);
            }
        }
        return c[n1][n2] / longest;
    }
    // Any order: each entry of the first takes the best unused match.
    let mut used = vec![false; n2];
    let mut matched = 0.0;
    for x in &xs {
        let mut best = (0.0, None);
        for (j, y) in ys.iter().enumerate() {
            if used[j] {
                continue;
            }
            let s = sub(x, y);
            if s > best.0 {
                best = (s, Some(j));
            }
        }
        if let (s, Some(j)) = best {
            matched += s;
            used[j] = true;
        }
    }
    if n1 == n2 && matched == n1 as f64 {
        return 1.0;
    }
    if !opts.partial {
        return 0.0;
    }
    matched / longest
}

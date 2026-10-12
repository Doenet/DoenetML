//! Simplify and expand for engine A.
//!
//! Simplify flattens, folds numbers (exactly, as fractions, while they fit),
//! collects like terms and like bases, and sorts: polynomial terms by
//! descending degree, factors with the coefficient first. It does not reduce
//! rational functions. Every constructor here takes simplified children and
//! returns a simplified node, so expand and the derivative can build with
//! them directly.

use std::cmp::Ordering;

use super::{Flat, Tag};
use crate::Handle;

/// A numeric coefficient: an exact fraction while it fits, else a float.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Coef {
    R(i64, i64),
    F(f64),
}

fn gcd(mut a: i64, mut b: i64) -> i64 {
    a = a.abs();
    b = b.abs();
    while b != 0 {
        (a, b) = (b, a % b);
    }
    a
}

impl Coef {
    pub fn of(f: &Flat, h: Handle) -> Option<Coef> {
        let n = f.node(h);
        match n.tag {
            Tag::Rat => Some(Coef::R(n.a as i32 as i64, n.b as i64)),
            Tag::Num => {
                let v = f.number(h).unwrap();
                Some(if v.fract() == 0.0 && v.abs() < 9.0e15 {
                    Coef::R(v as i64, 1)
                } else {
                    Coef::F(v)
                })
            }
            _ => None,
        }
    }

    pub fn normalized(self) -> Coef {
        match self {
            Coef::R(_, 0) => Coef::F(f64::NAN),
            Coef::R(p, q) => {
                let g = gcd(p, q).max(1);
                let s = if q < 0 { -1 } else { 1 };
                Coef::R(s * p / g, s * q / g)
            }
            f => f,
        }
    }

    pub fn value(self) -> f64 {
        match self {
            Coef::R(p, q) => p as f64 / q as f64,
            Coef::F(v) => v,
        }
    }

    fn from_i128(p: i128, q: i128) -> Coef {
        const LIM: i128 = 1 << 52;
        let g = {
            let (mut a, mut b) = (p.abs(), q.abs());
            while b != 0 {
                (a, b) = (b, a % b);
            }
            a.max(1)
        };
        let (p, q) = (p / g, q / g);
        if p.abs() < LIM && q.abs() < LIM {
            Coef::R(p as i64, q as i64).normalized()
        } else {
            Coef::F(p as f64 / q as f64)
        }
    }

    pub fn add(self, o: Coef) -> Coef {
        match (self, o) {
            (Coef::R(a, b), Coef::R(c, d)) => Coef::from_i128(
                a as i128 * d as i128 + c as i128 * b as i128,
                b as i128 * d as i128,
            ),
            _ => Coef::F(self.value() + o.value()),
        }
    }

    pub fn mul(self, o: Coef) -> Coef {
        match (self, o) {
            (Coef::R(a, b), Coef::R(c, d)) => {
                Coef::from_i128(a as i128 * c as i128, b as i128 * d as i128)
            }
            _ => Coef::F(self.value() * o.value()),
        }
    }

    /// An integer power, exact while it fits; `None` for 0 to a negative power.
    pub fn powi(self, n: i64) -> Option<Coef> {
        if self.is_zero() && n < 0 {
            return None;
        }
        match self {
            Coef::R(p, q) if n.abs() <= 64 => {
                let (b, e) = if n >= 0 {
                    (Coef::R(p, q), n)
                } else {
                    (Coef::R(q, p).normalized(), -n)
                };
                let mut r = Coef::R(1, 1);
                for _ in 0..e {
                    r = r.mul(b);
                }
                Some(r)
            }
            _ => Some(Coef::F(self.value().powf(n as f64))),
        }
    }

    pub fn is_zero(self) -> bool {
        self.value() == 0.0
    }

    pub fn is_one(self) -> bool {
        self == Coef::R(1, 1) || self == Coef::F(1.0)
    }

    pub fn integer(self) -> Option<i64> {
        match self {
            Coef::R(p, 1) => Some(p),
            _ => None,
        }
    }

    pub fn to_node(self, f: &mut Flat) -> Handle {
        match self.normalized() {
            Coef::R(p, 1) => f.num(p as f64),
            Coef::R(p, q) if p.abs() <= i32::MAX as i64 && q <= u32::MAX as i64 => {
                f.intern(Tag::Rat, p as i32 as u32, q as u32)
            }
            c => f.num(c.value()),
        }
    }
}

pub fn simplify(f: &mut Flat, h: Handle) -> Handle {
    if let Some(&s) = f.memo_simplify.get(&h) {
        return s;
    }
    let n = f.node(h);
    let s = match n.tag {
        Tag::Num | Tag::Rat | Tag::Sym | Tag::Cell => h,
        Tag::Add => {
            let ks: Vec<Handle> = f.kids(h).to_vec();
            let ks: Vec<Handle> = ks.into_iter().map(|k| simplify(f, k)).collect();
            add(f, &ks)
        }
        Tag::Mul => {
            let ks: Vec<Handle> = f.kids(h).to_vec();
            let ks: Vec<Handle> = ks.into_iter().map(|k| simplify(f, k)).collect();
            mul(f, &ks)
        }
        Tag::Pow => {
            let (b, e) = (simplify(f, n.a), simplify(f, n.b));
            pow(f, b, e)
        }
        Tag::Apply => {
            let arg = simplify(f, n.b);
            apply(f, n.a, arg)
        }
    };
    if f.memo {
        f.memo_simplify.insert(h, s);
        f.memo_simplify.insert(s, s);
    }
    s
}

/// Polynomial degree, for ordering terms.
fn degree(f: &Flat, h: Handle) -> f64 {
    let n = f.node(h);
    match n.tag {
        Tag::Num | Tag::Rat => 0.0,
        Tag::Sym | Tag::Cell | Tag::Apply => 1.0,
        Tag::Pow => degree(f, n.a) * Coef::of(f, n.b).map_or(1.0, Coef::value),
        Tag::Mul => f.kids(h).iter().map(|&k| degree(f, k)).sum(),
        Tag::Add => f.kids(h).iter().map(|&k| degree(f, k)).fold(0.0, f64::max),
    }
}

fn term_order(f: &Flat, a: Handle, b: Handle) -> Ordering {
    let (ra, rb) = (strip_coef(f, a), strip_coef(f, b));
    degree(f, rb)
        .total_cmp(&degree(f, ra))
        .then_with(|| factor_order(f, ra, rb))
        .then_with(|| f.cmp(a, b))
}

/// Factors by base, then exponent: `x^2 y` keeps `x` first.
fn factor_order(f: &Flat, a: Handle, b: Handle) -> Ordering {
    let base = |h: Handle| if f.tag(h) == Tag::Pow { f.node(h).a } else { h };
    f.cmp(base(a), base(b)).then_with(|| f.cmp(a, b))
}

/// A product's non-numeric part as a handle (the term itself otherwise).
fn strip_coef(f: &Flat, h: Handle) -> Handle {
    if f.tag(h) == Tag::Mul {
        let ks = f.kids(h);
        if Coef::of(f, ks[0]).is_some() && ks.len() == 2 {
            return ks[1];
        }
    }
    h
}

/// Split a simplified term into coefficient and rest (`None`: a number).
fn split_term(f: &mut Flat, h: Handle) -> (Coef, Option<Handle>) {
    if let Some(c) = Coef::of(f, h) {
        return (c, None);
    }
    if f.tag(h) == Tag::Mul {
        let ks: Vec<Handle> = f.kids(h).to_vec();
        if let Some(c) = Coef::of(f, ks[0]) {
            let rest = f.mul_raw(&ks[1..]);
            return (c, Some(rest));
        }
    }
    (Coef::R(1, 1), Some(h))
}

/// Sum of simplified terms.
pub fn add(f: &mut Flat, terms: &[Handle]) -> Handle {
    let mut flat = Vec::with_capacity(terms.len());
    for &t in terms {
        if f.tag(t) == Tag::Add {
            flat.extend_from_slice(f.kids(t));
        } else {
            flat.push(t);
        }
    }
    let mut constant = Coef::R(0, 1);
    let mut groups: Vec<(Handle, Coef)> = Vec::new();
    for t in flat {
        match split_term(f, t) {
            (c, None) => constant = constant.add(c),
            (c, Some(rest)) => match groups.iter_mut().find(|(r, _)| *r == rest) {
                Some(g) => g.1 = g.1.add(c),
                None => groups.push((rest, c)),
            },
        }
    }
    let mut out = Vec::with_capacity(groups.len() + 1);
    for (rest, c) in groups {
        if c.is_zero() {
            continue;
        }
        out.push(if c.is_one() { rest } else { scale(f, c, rest) });
    }
    out.sort_by(|&a, &b| term_order(f, a, b));
    if !constant.is_zero() || constant.value().is_nan() {
        out.push(constant.to_node(f));
    }
    match out.len() {
        0 => f.num(0.0),
        1 => out[0],
        _ => f.intern_nary(Tag::Add, &out),
    }
}

/// `c * rest` for a simplified, coefficient-free `rest`.
fn scale(f: &mut Flat, c: Coef, rest: Handle) -> Handle {
    let cn = c.to_node(f);
    f.mul_raw(&[cn, rest])
}

/// Product of simplified factors.
pub fn mul(f: &mut Flat, factors: &[Handle]) -> Handle {
    let mut flat = Vec::with_capacity(factors.len());
    for &x in factors {
        if f.tag(x) == Tag::Mul {
            flat.extend_from_slice(f.kids(x));
        } else {
            flat.push(x);
        }
    }
    let mut coef = Coef::R(1, 1);
    let mut bases: Vec<(Handle, Vec<Handle>)> = Vec::new();
    for x in flat {
        if let Some(c) = Coef::of(f, x) {
            coef = coef.mul(c);
            continue;
        }
        let (b, e) = if f.tag(x) == Tag::Pow {
            let n = f.node(x);
            (n.a, n.b)
        } else {
            (x, f.num(1.0))
        };
        match bases.iter_mut().find(|(bb, _)| *bb == b) {
            Some(g) => g.1.push(e),
            None => bases.push((b, vec![e])),
        }
    }
    if coef.is_zero() && !coef.value().is_nan() {
        return f.num(0.0);
    }
    let mut out = Vec::with_capacity(bases.len() + 1);
    for (b, es) in bases {
        let e = if es.len() == 1 { es[0] } else { add(f, &es) };
        let p = pow(f, b, e);
        if let Some(c) = Coef::of(f, p) {
            coef = coef.mul(c);
        } else if f.tag(p) == Tag::Mul {
            for &k in f.kids(p).to_vec().iter() {
                match Coef::of(f, k) {
                    Some(c) => coef = coef.mul(c),
                    None => out.push(k),
                }
            }
        } else {
            out.push(p);
        }
    }
    out.sort_by(|&a, &b| factor_order(f, a, b));
    if !coef.is_one() || out.is_empty() {
        out.insert(0, coef.to_node(f));
    }
    match out.len() {
        1 => out[0],
        _ => f.intern_nary(Tag::Mul, &out),
    }
}

/// A simplified power.
pub fn pow(f: &mut Flat, b: Handle, e: Handle) -> Handle {
    let (cb, ce) = (Coef::of(f, b), Coef::of(f, e));
    if let Some(ce) = ce {
        if ce.is_zero() {
            return f.num(1.0);
        }
        if ce.is_one() {
            return b;
        }
    }
    if cb.is_some_and(Coef::is_one) {
        return b;
    }
    match (cb, ce) {
        (Some(cb), Some(ce)) => match ce.integer() {
            Some(n) => {
                if let Some(r) = cb.powi(n) {
                    return r.to_node(f);
                }
            }
            None => {
                if matches!(cb, Coef::F(_)) || matches!(ce, Coef::F(_)) {
                    return f.num(cb.value().powf(ce.value()));
                }
            }
        },
        (None, Some(ce)) if ce.integer().is_some() => match f.tag(b) {
            Tag::Pow => {
                let n = f.node(b);
                let e2 = mul(f, &[n.b, e]);
                return pow(f, n.a, e2);
            }
            Tag::Mul => {
                let ks: Vec<Handle> = f.kids(b).to_vec();
                let ps: Vec<Handle> = ks.into_iter().map(|k| pow(f, k, e)).collect();
                return mul(f, &ps);
            }
            _ => {}
        },
        _ => {}
    }
    f.pow_raw(b, e)
}

/// A simplified function application: exact special values only.
pub fn apply(f: &mut Flat, func: u32, arg: Handle) -> Handle {
    let name = f.sym_name(func).to_string();
    if let Some(c) = Coef::of(f, arg) {
        let v = c.value();
        match (name.as_str(), v) {
            ("sin" | "tan", 0.0) => return f.num(0.0),
            ("cos" | "exp", 0.0) => return f.num(1.0),
            ("ln" | "log", 1.0) => return f.num(0.0),
            ("abs", _) => {
                return match c {
                    Coef::R(p, q) => Coef::R(p.abs(), q).to_node(f),
                    Coef::F(v) => f.num(v.abs()),
                };
            }
            _ => {}
        }
    }
    let an = f.node(arg);
    if (name == "ln" || name == "log") && an.tag == Tag::Sym && an.a == f.e {
        return f.num(1.0);
    }
    if an.tag == Tag::Apply {
        let inner = f.sym_name(an.a);
        if (name == "exp" && (inner == "ln" || inner == "log"))
            || ((name == "ln" || name == "log") && inner == "exp")
        {
            return an.b;
        }
    }
    f.intern(Tag::Apply, func, arg)
}

/// Expand products and integer powers of sums, then simplify.
pub fn expand(f: &mut Flat, h: Handle) -> Handle {
    let s = simplify(f, h);
    expand_rec(f, s)
}

const MAX_TERMS: usize = 5000;

fn expand_rec(f: &mut Flat, h: Handle) -> Handle {
    if let Some(&x) = f.memo_expand.get(&h) {
        return x;
    }
    let n = f.node(h);
    let out = match n.tag {
        Tag::Num | Tag::Rat | Tag::Sym | Tag::Cell => h,
        Tag::Add => {
            let ks: Vec<Handle> = f.kids(h).to_vec();
            let ks: Vec<Handle> = ks.into_iter().map(|k| expand_rec(f, k)).collect();
            add(f, &ks)
        }
        Tag::Mul => {
            let ks: Vec<Handle> = f.kids(h).to_vec();
            let ks: Vec<Handle> = ks.into_iter().map(|k| expand_rec(f, k)).collect();
            distribute(f, &ks)
        }
        Tag::Pow => {
            let (b, e) = (expand_rec(f, n.a), expand_rec(f, n.b));
            match Coef::of(f, e).and_then(Coef::integer) {
                Some(k) if (2..=16).contains(&k) && f.tag(b) == Tag::Add => {
                    let mut r = b;
                    for _ in 1..k {
                        r = distribute(f, &[r, b]);
                    }
                    r
                }
                _ => pow(f, b, e),
            }
        }
        Tag::Apply => {
            let arg = expand_rec(f, n.b);
            apply(f, n.a, arg)
        }
    };
    if f.memo {
        f.memo_expand.insert(h, out);
    }
    out
}

/// Multiply out simplified, expanded factors.
fn distribute(f: &mut Flat, factors: &[Handle]) -> Handle {
    let mut products: Vec<Vec<Handle>> = vec![Vec::new()];
    for &x in factors {
        if f.tag(x) == Tag::Add {
            let terms: Vec<Handle> = f.kids(x).to_vec();
            if products.len() * terms.len() > MAX_TERMS {
                return mul(f, factors);
            }
            let mut next = Vec::with_capacity(products.len() * terms.len());
            for p in &products {
                for &t in &terms {
                    let mut q = p.clone();
                    q.push(t);
                    next.push(q);
                }
            }
            products = next;
        } else {
            for p in products.iter_mut() {
                p.push(x);
            }
        }
    }
    let terms: Vec<Handle> = products.iter().map(|p| mul(f, p)).collect();
    add(f, &terms)
}

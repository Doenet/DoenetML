//! Engine A: one flat, hash-consed node arena per document.
//!
//! Every node is 12 bytes (`Node`): a tag and two `u32` payloads. N-ary sums
//! and products keep their children in a shared `kids` list. Nodes are
//! hash-consed, so structurally equal expressions have equal handles: an
//! instruction that recomputes the same expression writes the same handle,
//! and gating downstream stops without comparing trees. Simplify and expand
//! are pure functions of a handle, so they are memoized across ticks; an
//! unchanged subexpression is never simplified twice.
//!
//! Canonical spelling inside the arena: subtraction is `a + (-1) b`,
//! division `a b^(-1)`, negation `(-1) x`, `sqrt(x)` is `x^(1/2)`. The
//! printer turns these back into `a - b`, fractions and roots.

mod diff;
mod print;
mod simplify;

use std::cmp::Ordering;
use std::collections::HashMap;

use crate::{Handle, SymEngine, Tree};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum Tag {
    /// `a`, `b`: the low and high halves of the `f64` bits.
    Num,
    /// An exact fraction: `a` is the numerator (`i32` bits), `b` the
    /// denominator (> 1).
    Rat,
    /// `a`: symbol id.
    Sym,
    /// `a`: cell index, `b`: 1 for a math leaf, 0 for a numeric one.
    Cell,
    /// `a`: start in `kids`, `b`: count.
    Add,
    Mul,
    /// `a`: base, `b`: exponent.
    Pow,
    /// `a`: function name (symbol id), `b`: argument.
    Apply,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Node {
    pub tag: Tag,
    pub a: u32,
    pub b: u32,
}

const NONE: u32 = u32::MAX;
const HAS_CELLS: u8 = 1;
const HAS_SYMS: u8 = 2;

#[derive(Clone)]
pub struct Flat {
    nodes: Vec<Node>,
    kids: Vec<u32>,
    flags: Vec<u8>,
    hashes: Vec<u64>,
    /// Hash table head per bucket, chained through `next`.
    buckets: Vec<u32>,
    next: Vec<u32>,
    syms: Vec<String>,
    sym_ids: HashMap<String, u32>,
    memo_simplify: HashMap<Handle, Handle>,
    memo_expand: HashMap<Handle, Handle>,
    /// Memoize simplify and expand (on by default; off to measure).
    pub memo: bool,
    pi: u32,
    e: u32,
}

impl Default for Flat {
    fn default() -> Self {
        Self::new()
    }
}

#[inline]
fn mix(h: u64, x: u64) -> u64 {
    (h.rotate_left(5) ^ x).wrapping_mul(0x517c_c1b7_2722_0a95)
}

impl Flat {
    pub fn new() -> Self {
        let mut f = Flat {
            nodes: Vec::new(),
            kids: Vec::new(),
            flags: Vec::new(),
            hashes: Vec::new(),
            buckets: vec![NONE; 1024],
            next: Vec::new(),
            syms: Vec::new(),
            sym_ids: HashMap::new(),
            memo_simplify: HashMap::new(),
            memo_expand: HashMap::new(),
            memo: true,
            pi: 0,
            e: 0,
        };
        f.pi = f.sym_id("pi");
        f.e = f.sym_id("e");
        f
    }

    // ---- storage ----

    pub fn node(&self, h: Handle) -> Node {
        self.nodes[h as usize]
    }

    pub fn tag(&self, h: Handle) -> Tag {
        self.nodes[h as usize].tag
    }

    pub fn kids(&self, h: Handle) -> &[u32] {
        let n = self.nodes[h as usize];
        &self.kids[n.a as usize..(n.a + n.b) as usize]
    }

    pub fn sym_id(&mut self, name: &str) -> u32 {
        if let Some(&id) = self.sym_ids.get(name) {
            return id;
        }
        let id = self.syms.len() as u32;
        self.syms.push(name.to_string());
        self.sym_ids.insert(name.to_string(), id);
        id
    }

    pub fn sym_name(&self, id: u32) -> &str {
        &self.syms[id as usize]
    }

    fn lookup_sym(&self, name: &str) -> Option<u32> {
        self.sym_ids.get(name).copied()
    }

    fn grow(&mut self) {
        let n = self.buckets.len() * 2;
        self.buckets = vec![NONE; n];
        for i in 0..self.nodes.len() {
            let b = (self.hashes[i] as usize) & (n - 1);
            self.next[i] = self.buckets[b];
            self.buckets[b] = i as u32;
        }
    }

    fn insert(&mut self, node: Node, hash: u64, flags: u8) -> Handle {
        if self.nodes.len() * 2 > self.buckets.len() * 3 {
            self.grow();
        }
        let id = self.nodes.len() as u32;
        let b = (hash as usize) & (self.buckets.len() - 1);
        self.nodes.push(node);
        self.flags.push(flags);
        self.hashes.push(hash);
        self.next.push(self.buckets[b]);
        self.buckets[b] = id;
        id
    }

    /// Intern a leaf, power or application.
    fn intern(&mut self, tag: Tag, a: u32, b: u32) -> Handle {
        let hash = mix(mix(mix(0, tag as u64), a as u64), b as u64);
        let mut i = self.buckets[(hash as usize) & (self.buckets.len() - 1)];
        let node = Node { tag, a, b };
        while i != NONE {
            if self.hashes[i as usize] == hash && self.nodes[i as usize] == node {
                return i;
            }
            i = self.next[i as usize];
        }
        let flags = match tag {
            Tag::Cell => HAS_CELLS,
            Tag::Sym if a != self.pi && a != self.e => HAS_SYMS,
            Tag::Pow => self.flags[a as usize] | self.flags[b as usize],
            Tag::Apply => self.flags[b as usize],
            _ => 0,
        };
        self.insert(node, hash, flags)
    }

    /// Intern a sum or product with exactly these children (no flattening).
    fn intern_nary(&mut self, tag: Tag, ks: &[u32]) -> Handle {
        let mut hash = mix(0, tag as u64);
        for &k in ks {
            hash = mix(hash, k as u64);
        }
        let mut i = self.buckets[(hash as usize) & (self.buckets.len() - 1)];
        while i != NONE {
            let n = self.nodes[i as usize];
            if self.hashes[i as usize] == hash
                && n.tag == tag
                && n.b as usize == ks.len()
                && &self.kids[n.a as usize..(n.a + n.b) as usize] == ks
            {
                return i;
            }
            i = self.next[i as usize];
        }
        let start = self.kids.len() as u32;
        self.kids.extend_from_slice(ks);
        let flags = ks.iter().fold(0, |f, &k| f | self.flags[k as usize]);
        self.insert(
            Node {
                tag,
                a: start,
                b: ks.len() as u32,
            },
            hash,
            flags,
        )
    }

    // ---- raw constructors (flatten only) ----

    pub fn num(&mut self, v: f64) -> Handle {
        let v = if v == 0.0 {
            0.0
        } else if v.is_nan() {
            f64::NAN
        } else {
            v
        };
        let bits = v.to_bits();
        self.intern(Tag::Num, bits as u32, (bits >> 32) as u32)
    }

    /// `p/q` in lowest terms, `q > 0`; an integer when `q` divides `p`.
    pub fn rat(&mut self, p: i64, q: i64) -> Handle {
        simplify::Coef::R(p, q).normalized().to_node(self)
    }

    pub fn sym(&mut self, name: &str) -> Handle {
        let id = self.sym_id(name);
        self.intern(Tag::Sym, id, 0)
    }

    pub fn cell(&mut self, cell: u32, math: bool) -> Handle {
        self.intern(Tag::Cell, cell, math as u32)
    }

    fn nary_raw(&mut self, tag: Tag, items: &[Handle], unit: f64) -> Handle {
        let mut flat = Vec::with_capacity(items.len());
        for &x in items {
            if self.tag(x) == tag {
                flat.extend_from_slice(self.kids(x));
            } else {
                flat.push(x);
            }
        }
        match flat.len() {
            0 => self.num(unit),
            1 => flat[0],
            _ => self.intern_nary(tag, &flat),
        }
    }

    pub fn add_raw(&mut self, terms: &[Handle]) -> Handle {
        self.nary_raw(Tag::Add, terms, 0.0)
    }

    pub fn mul_raw(&mut self, factors: &[Handle]) -> Handle {
        self.nary_raw(Tag::Mul, factors, 1.0)
    }

    pub fn pow_raw(&mut self, base: Handle, exp: Handle) -> Handle {
        self.intern(Tag::Pow, base, exp)
    }

    pub fn apply_raw(&mut self, f: &str, arg: Handle) -> Handle {
        let id = self.sym_id(f);
        self.intern(Tag::Apply, id, arg)
    }

    pub fn neg_raw(&mut self, x: Handle) -> Handle {
        let m1 = self.num(-1.0);
        self.mul_raw(&[m1, x])
    }

    /// The exact or floating value of a numeric leaf.
    pub fn number(&self, h: Handle) -> Option<f64> {
        let n = self.node(h);
        match n.tag {
            Tag::Num => Some(f64::from_bits(n.a as u64 | ((n.b as u64) << 32))),
            Tag::Rat => Some(n.a as i32 as f64 / n.b as f64),
            _ => None,
        }
    }

    pub fn has_cells(&self, h: Handle) -> bool {
        self.flags[h as usize] & HAS_CELLS != 0
    }

    // ---- evaluation ----

    fn eval(&self, h: Handle, bind: &[(u32, f64)]) -> f64 {
        let n = self.node(h);
        match n.tag {
            Tag::Num | Tag::Rat => self.number(h).unwrap(),
            Tag::Sym => {
                if let Some(&(_, v)) = bind.iter().find(|(s, _)| *s == n.a) {
                    v
                } else if n.a == self.pi {
                    std::f64::consts::PI
                } else if n.a == self.e {
                    std::f64::consts::E
                } else {
                    f64::NAN
                }
            }
            Tag::Cell => f64::NAN,
            Tag::Add => self.kids(h).iter().map(|&k| self.eval(k, bind)).sum(),
            Tag::Mul => self.kids(h).iter().map(|&k| self.eval(k, bind)).product(),
            Tag::Pow => {
                let (b, e) = (self.eval(n.a, bind), self.eval(n.b, bind));
                // A real odd root of a negative number, as `x^(1/3)` means.
                if b < 0.0
                    && let Some(r) = self.odd_root(n.b)
                {
                    return -(-b).powf(r);
                }
                b.powf(e)
            }
            Tag::Apply => {
                let x = self.eval(n.b, bind);
                match self.sym_name(n.a) {
                    "sin" => x.sin(),
                    "cos" => x.cos(),
                    "tan" => x.tan(),
                    "exp" => x.exp(),
                    "ln" | "log" => x.ln(),
                    "abs" => x.abs(),
                    _ => f64::NAN,
                }
            }
        }
    }

    /// `1/q` for an exponent that is the fraction `p/q` with `q` odd.
    fn odd_root(&self, e: Handle) -> Option<f64> {
        let n = self.node(e);
        (n.tag == Tag::Rat && n.b % 2 == 1).then(|| n.a as i32 as f64 / n.b as f64)
    }

    /// Free symbols other than `pi` and `e`, by id, in first-seen order.
    pub fn free_syms(&self, h: Handle, out: &mut Vec<u32>) {
        if self.flags[h as usize] & HAS_SYMS == 0 {
            return;
        }
        let n = self.node(h);
        match n.tag {
            Tag::Sym => {
                if !out.contains(&n.a) {
                    out.push(n.a);
                }
            }
            Tag::Add | Tag::Mul => {
                for i in n.a..n.a + n.b {
                    self.free_syms(self.kids[i as usize], out);
                }
            }
            Tag::Pow => {
                self.free_syms(n.a, out);
                self.free_syms(n.b, out);
            }
            Tag::Apply => self.free_syms(n.b, out),
            _ => {}
        }
    }

    // ---- order ----

    /// A total structural order, independent of handle numbering, so
    /// canonical forms do not depend on the history of the arena.
    pub fn cmp(&self, a: Handle, b: Handle) -> Ordering {
        if a == b {
            return Ordering::Equal;
        }
        let rank = |t: Tag| match t {
            Tag::Num | Tag::Rat => 0,
            Tag::Sym => 1,
            Tag::Cell => 2,
            Tag::Pow => 3,
            Tag::Mul => 4,
            Tag::Apply => 5,
            Tag::Add => 6,
        };
        let (na, nb) = (self.node(a), self.node(b));
        rank(na.tag).cmp(&rank(nb.tag)).then_with(|| match na.tag {
            Tag::Num | Tag::Rat => self.number(a).unwrap().total_cmp(&self.number(b).unwrap()),
            Tag::Sym => self.sym_name(na.a).cmp(self.sym_name(nb.a)),
            Tag::Cell => (na.a, na.b).cmp(&(nb.a, nb.b)),
            Tag::Pow => self.cmp(na.a, nb.a).then_with(|| self.cmp(na.b, nb.b)),
            Tag::Apply => self
                .sym_name(na.a)
                .cmp(self.sym_name(nb.a))
                .then_with(|| self.cmp(na.b, nb.b)),
            Tag::Add | Tag::Mul => {
                let (ka, kb) = (self.kids(a), self.kids(b));
                for (x, y) in ka.iter().zip(kb) {
                    let c = self.cmp(*x, *y);
                    if c != Ordering::Equal {
                        return c;
                    }
                }
                ka.len().cmp(&kb.len())
            }
        })
    }

    fn instantiate_rec(&mut self, h: Handle, cells: &[f64]) -> Handle {
        if !self.has_cells(h) {
            return h;
        }
        let n = self.node(h);
        match n.tag {
            Tag::Cell => {
                let v = cells[n.a as usize];
                if n.b == 1 {
                    if v.is_nan() {
                        self.num(f64::NAN)
                    } else {
                        v as Handle
                    }
                } else {
                    self.num(v)
                }
            }
            Tag::Add | Tag::Mul => {
                let ks: Vec<Handle> = self.kids(h).to_vec();
                let ks: Vec<Handle> = ks
                    .into_iter()
                    .map(|k| self.instantiate_rec(k, cells))
                    .collect();
                if n.tag == Tag::Add {
                    self.add_raw(&ks)
                } else {
                    self.mul_raw(&ks)
                }
            }
            Tag::Pow => {
                let (b, e) = (
                    self.instantiate_rec(n.a, cells),
                    self.instantiate_rec(n.b, cells),
                );
                self.pow_raw(b, e)
            }
            Tag::Apply => {
                let arg = self.instantiate_rec(n.b, cells);
                self.intern(Tag::Apply, n.a, arg)
            }
            _ => h,
        }
    }
}

/// A small deterministic generator for equality sampling.
struct XorShift(u64);

impl XorShift {
    fn next_f64(&mut self) -> f64 {
        self.0 ^= self.0 << 13;
        self.0 ^= self.0 >> 7;
        self.0 ^= self.0 << 17;
        (self.0 >> 11) as f64 / (1u64 << 53) as f64
    }
}

impl SymEngine for Flat {
    fn name(&self) -> &'static str {
        "A"
    }

    fn import(&mut self, tree: &Tree) -> Handle {
        match tree {
            Tree::Num(v) => self.num(*v),
            Tree::Sym(s) => self.sym(s),
            Tree::Cell { cell, math } => self.cell(*cell, *math),
            Tree::Add(ts) => {
                let ks: Vec<Handle> = ts.iter().map(|t| self.import(t)).collect();
                self.add_raw(&ks)
            }
            Tree::Mul(ts) => {
                let ks: Vec<Handle> = ts.iter().map(|t| self.import(t)).collect();
                self.mul_raw(&ks)
            }
            Tree::Sub(a, b) => {
                let a = self.import(a);
                let b = self.import(&Tree::Neg(b.clone()));
                self.add_raw(&[a, b])
            }
            Tree::Div(a, b) => {
                let a = self.import(a);
                let b = self.import(b);
                let m1 = self.num(-1.0);
                let inv = self.pow_raw(b, m1);
                self.mul_raw(&[a, inv])
            }
            Tree::Neg(x) => match **x {
                Tree::Num(v) => self.num(-v),
                _ => {
                    let x = self.import(x);
                    self.neg_raw(x)
                }
            },
            Tree::Pow(b, e) => {
                let (b, e) = (self.import(b), self.import(e));
                self.pow_raw(b, e)
            }
            Tree::Apply(f, x) => {
                let x = self.import(x);
                if f == "sqrt" {
                    let half = self.rat(1, 2);
                    self.pow_raw(x, half)
                } else {
                    self.apply_raw(f, x)
                }
            }
        }
    }

    fn num(&mut self, v: f64) -> Handle {
        Flat::num(self, v)
    }

    fn instantiate(&mut self, template: Handle, cells: &[f64]) -> Handle {
        self.instantiate_rec(template, cells)
    }

    fn simplify(&mut self, h: Handle) -> Handle {
        simplify::simplify(self, h)
    }

    fn expand(&mut self, h: Handle) -> Handle {
        simplify::expand(self, h)
    }

    fn derivative(&mut self, h: Handle, var: &str) -> Handle {
        let v = self.sym_id(var);
        let s = simplify::simplify(self, h);
        let d = diff::derivative(self, s, v);
        simplify::simplify(self, d)
    }

    fn evaluate(&mut self, h: Handle, var: Option<(&str, f64)>) -> f64 {
        match var {
            Some((name, x)) => match self.lookup_sym(name) {
                Some(id) => self.eval(h, &[(id, x)]),
                None => self.eval(h, &[]),
            },
            None => self.eval(h, &[]),
        }
    }

    fn evaluate_many(&mut self, h: Handle, var: &str, xs: &[f64], out: &mut [f64]) {
        let id = self.sym_id(var);
        for (x, o) in xs.iter().zip(out.iter_mut()) {
            *o = self.eval(h, &[(id, *x)]);
        }
    }

    fn equals(&mut self, a: Handle, b: Handle) -> bool {
        if a == b {
            return true;
        }
        let mut vars = Vec::new();
        self.free_syms(a, &mut vars);
        self.free_syms(b, &mut vars);
        let mut rng = XorShift(0x9e37_79b9_7f4a_7c15);
        let mut bind: Vec<(u32, f64)> = vars.iter().map(|&v| (v, 0.0)).collect();
        let (mut agree, mut tries) = (0, 0);
        while agree < 8 && tries < 40 {
            tries += 1;
            for slot in bind.iter_mut() {
                slot.1 = rng.next_f64() * 6.0 - 3.0;
            }
            let (x, y) = (self.eval(a, &bind), self.eval(b, &bind));
            // A point outside either side's real domain says nothing.
            if !x.is_finite() || !y.is_finite() {
                continue;
            }
            if (x - y).abs() > 1e-10 * x.abs().max(y.abs()).max(1.0) {
                return false;
            }
            agree += 1;
            if vars.is_empty() {
                break;
            }
        }
        if agree == 0 {
            self.equals_syntax(a, b)
        } else {
            true
        }
    }

    /// The same tree as written (flattened), as math-expressions'
    /// `equals_syntactic`: `2x+3` is not `3+2x`. Hash-consing makes it a
    /// handle comparison.
    fn equals_syntax(&mut self, a: Handle, b: Handle) -> bool {
        a == b
    }

    fn export(&self, h: Handle) -> Option<Tree> {
        let n = self.node(h);
        Some(match n.tag {
            Tag::Num | Tag::Rat => Tree::Num(self.number(h).unwrap()),
            Tag::Sym => Tree::Sym(self.sym_name(n.a).to_string()),
            Tag::Cell => Tree::Cell {
                cell: n.a,
                math: n.b == 1,
            },
            Tag::Add => Tree::Add(
                self.kids(h)
                    .iter()
                    .map(|&k| self.export(k))
                    .collect::<Option<_>>()?,
            ),
            Tag::Mul => Tree::Mul(
                self.kids(h)
                    .iter()
                    .map(|&k| self.export(k))
                    .collect::<Option<_>>()?,
            ),
            Tag::Pow => Tree::Pow(Box::new(self.export(n.a)?), Box::new(self.export(n.b)?)),
            Tag::Apply => Tree::Apply(self.sym_name(n.a).to_string(), Box::new(self.export(n.b)?)),
        })
    }

    fn has_symbols(&mut self, h: Handle) -> bool {
        self.flags[h as usize] & HAS_SYMS != 0
    }

    fn text(&self, h: Handle) -> String {
        print::text(self, h)
    }

    fn latex(&self, h: Handle) -> String {
        print::latex(self, h)
    }

    fn len(&self) -> usize {
        self.nodes.len()
    }

    fn heap_bytes(&self) -> usize {
        self.nodes.capacity() * std::mem::size_of::<Node>()
            + self.kids.capacity() * 4
            + self.flags.capacity()
            + self.hashes.capacity() * 8
            + self.buckets.capacity() * 4
            + self.next.capacity() * 4
            + (self.memo_simplify.capacity() + self.memo_expand.capacity()) * 8
    }

    fn box_clone(&self) -> Box<dyn SymEngine> {
        Box::new(self.clone())
    }
}

#[cfg(test)]
mod tests;

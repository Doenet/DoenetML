//! The symbolic engine: math-expressions-rs, linked natively. Each handle is
//! one boxed [`Expr`] tree. An expression equal to one the engine holds gets
//! that one's handle, so an expression made again neither reads as a change
//! nor grows the engine. Handles stay valid for the life of the engine. Cell
//! leaves are symbols named `cellN<i>` (numeric) or `cellM<i>` (math).

use std::collections::HashMap;
use std::hash::{BuildHasher, RandomState};

use math_expressions as me;
use me::{EqOptions, Expr, LatexOpts, Number, TextOpts, TextToAst, TextToAstOptions};

use super::compare::CompareOpts;
use super::{Handle, Leaf, Shape, Tree};
use crate::program::Reduction;

/// The symbolic engine: every math expression a document holds, by handle, and
/// the operations on them.
pub struct Engine {
    exprs: Vec<Expr>,
    /// Cell leaves of each expression used as a template, (cell, is math),
    /// found on first use.
    leaves: HashMap<Handle, Vec<(u32, bool)>>,
    /// The handle of each stored expression by its hash, the first stored
    /// when two collide.
    index: HashMap<u64, Handle>,
    hasher: RandomState,
    parser: TextToAst,
    eq: EqOptions,
}

impl Default for Engine {
    fn default() -> Self {
        Self::new()
    }
}

impl Clone for Engine {
    /// The parser is rebuilt rather than copied.
    fn clone(&self) -> Self {
        Engine {
            exprs: self.exprs.clone(),
            leaves: self.leaves.clone(),
            index: self.index.clone(),
            hasher: self.hasher.clone(),
            parser: parser(),
            eq: self.eq.clone(),
        }
    }
}

impl std::fmt::Debug for Engine {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Engine({} expressions)", self.exprs.len())
    }
}

impl Engine {
    /// An engine holding no expression.
    pub fn new() -> Self {
        Engine {
            exprs: Vec::new(),
            leaves: HashMap::new(),
            index: HashMap::new(),
            hasher: RandomState::new(),
            parser: parser(),
            eq: EqOptions::default(),
        }
    }

    /// Store `e`, or find it: the handle of an equal expression already
    /// stored.
    fn push(&mut self, e: Expr) -> Handle {
        let key = self.hasher.hash_one(&e);
        if let Some(&h) = self.index.get(&key) {
            if self.exprs[h.index()] == e {
                return h;
            }
            self.exprs.push(e);
            return Handle::from_index(self.exprs.len() - 1);
        }
        self.exprs.push(e);
        let h = Handle::from_index(self.exprs.len() - 1);
        self.index.insert(key, h);
        h
    }

    /// The expression `h` names, for an operation of the engine kept in a
    /// module of its own (`sym::extrema`).
    pub(crate) fn expr(&self, h: Handle) -> &Expr {
        &self.exprs[h.index()]
    }

    /// Store `e` (`push`), for such an operation.
    pub(crate) fn store(&mut self, e: Expr) -> Handle {
        self.push(e)
    }

    /// Bring a builder tree in. Cell leaves are kept as leaves, by number:
    /// only a tree whose leaves are cells makes a template `instantiate`
    /// can fill.
    pub fn import<L: Leaf>(&mut self, tree: &Tree<L>) -> Handle {
        let mut leaves = Vec::new();
        let e = convert(tree, &mut leaves, &mut self.parser);
        let h = self.push(e);
        if !leaves.is_empty() {
            self.leaves.insert(h, leaves);
        }
        h
    }

    /// Parse math text (a `mathInput`'s value). No cell references. Empty
    /// text is the blank expression, as `<math/>` is in DoenetML.
    pub fn parse(&mut self, text: &str) -> Result<Handle, String> {
        let e = self.convert_text(text)?;
        Ok(self.push(e))
    }

    fn convert_text(&mut self, text: &str) -> Result<Expr, String> {
        if text.trim().is_empty() {
            return Ok(Expr::Blank);
        }
        self.parser.convert(text).map_err(|e| e.to_string())
    }

    /// Parse math text into a builder tree without storing it; `cellN<i>`
    /// symbols become leaves. Fails on what a tree cannot say (a relation,
    /// a function of several arguments).
    pub fn parse_tree<L: Leaf>(&mut self, text: &str) -> Result<Tree<L>, String> {
        // Sums and products flat: a math of many terms parses as a deep
        // chain, which every walk of the tree would recurse through.
        let e = me::expr::flatten(self.convert_text(text)?);
        to_tree(&e).ok_or_else(|| {
            format!(
                "'{text}' is not supported in a math cell (a relation or multi-argument function)"
            )
        })
    }

    /// Parse constant math text into a builder tree, as
    /// [`Engine::parse_tree`] does, or, for constant text a tree cannot say
    /// (a relation, `x > 1`), the text as written ([`Tree::Written`]).
    pub fn parse_given<L: Leaf>(&mut self, text: &str) -> Result<Tree<L>, String> {
        let tree = self.parse_tree(text);
        if tree.is_err() && self.is_written(text) {
            return Ok(Tree::Written(text.to_string()));
        }
        tree
    }

    /// Whether `text` is constant math only the engine reads, as written:
    /// it parses whole (no blank filled in for a missing operand), with no
    /// cell leaf, to what no builder tree says (a relation, `x > 1`).
    pub fn is_written(&mut self, text: &str) -> bool {
        match self.convert_text(text) {
            Ok(e) => !has_blank(&e) && cell_leaves(&e).is_empty() && to_tree::<u32>(&e).is_none(),
            Err(_) => false,
        }
    }

    /// Store the number `v`.
    pub fn num(&mut self, v: f64) -> Handle {
        self.push(number(v))
    }

    /// Replace every cell leaf with the cell's current value: a number, or
    /// the expression a math cell holds. A template without cell leaves
    /// returns itself. Any expression can be a template.
    pub fn instantiate(&mut self, template: Handle, cells: &[f64]) -> Handle {
        let leaves = self
            .leaves
            .entry(template)
            .or_insert_with(|| cell_leaves(&self.exprs[template.index()]));
        if leaves.is_empty() {
            return template;
        }
        let mut subs = HashMap::with_capacity(leaves.len());
        for &(cell, math) in leaves.iter() {
            let v = cells[cell as usize];
            // A missing value, and a math leaf with no expression (a blank
            // input), take part as the blank (D40, ADR 0046).
            let e = if crate::program::is_missing(v) || (math && v.is_nan()) {
                Expr::Blank
            } else if math {
                self.exprs[Handle::from_value(v).index()].clone()
            } else {
                number(v)
            };
            subs.insert(leaf_name(cell, math), e);
        }
        let e = me::substitute(&self.exprs[template.index()], &subs);
        self.push(e)
    }

    /// Parse math text with no cell leaves to a stored expression.
    pub fn parse_constant(&mut self, text: &str) -> Result<Handle, String> {
        let e = self.convert_text(text)?;
        if !cell_leaves(&e).is_empty() {
            return Err(format!(
                "'{text}' is not supported in a math cell with references (a relation, tuple or multi-argument function)"
            ));
        }
        Ok(self.push(e))
    }

    /// `h` with its tuples made vectors (`createVectors`), then its tuples
    /// and arrays of two made intervals (`createIntervals`), as asked
    /// (ADR 0041, decision 8).
    pub fn normalize_shapes(&mut self, mut h: Handle, vectors: bool, intervals: bool) -> Handle {
        if vectors {
            let e = me::tuples_to_vectors(&self.exprs[h.index()]);
            h = self.push(e);
        }
        if intervals {
            let e = me::to_intervals(&self.exprs[h.index()]);
            h = self.push(e);
        }
        h
    }

    /// Part `part` of the subset of the reals `h` names, in variable `var`
    /// (`x` for none), its pairs read as intervals; written as intervals
    /// and points, or as inequalities (`<subsetOfReals>`, `sym::subset`).
    pub fn subset(
        &mut self,
        h: Handle,
        var: Option<Handle>,
        part: super::SubsetPart,
        inequalities: bool,
    ) -> Handle {
        let var = match var {
            Some(v) if !matches!(self.exprs[v.index()], Expr::Blank) => {
                self.exprs[v.index()].clone()
            }
            _ => Expr::sym("x"),
        };
        let e = me::to_intervals(&self.exprs[h.index()]);
        let s = super::subset::Subset::read(&e, &var);
        let out = s.part(part, &var, inequalities);
        self.push(out)
    }

    /// The matrix of `rows` by `cols` whose entries, by row, are `h`'s:
    /// the entries of a list, or `h` alone for one entry; none for no
    /// entry. The blank expression when they do not fill it.
    pub fn matrix(&mut self, h: Handle, rows: u32, cols: u32) -> Handle {
        let entries = match &self.exprs[h.index()] {
            _ if rows == 0 || cols == 0 => Vec::new(),
            Expr::Seq(me::expr::SeqKind::List, xs) if xs.len() > 1 => xs.clone(),
            e => vec![e.clone()],
        };
        let (rows, cols) = if entries.is_empty() {
            (0, 0)
        } else {
            (rows, cols)
        };
        let e = me::Mat::new(rows, cols, entries)
            .map(Expr::Matrix)
            .unwrap_or(Expr::Blank);
        self.push(e)
    }

    /// Parse LaTeX (`format="latex"`) into a builder tree without storing
    /// it, as [`Engine::parse_tree`] parses text. Empty LaTeX is the blank
    /// expression.
    pub fn parse_latex_tree<L: Leaf>(&mut self, latex: &str) -> Result<Tree<L>, String> {
        let e = if latex.trim().is_empty() {
            Expr::Blank
        } else {
            let mut p = me::LatexToAst::new(me::LatexToAstOptions::default());
            me::expr::flatten(p.convert(latex).map_err(|e| e.to_string())?)
        };
        to_tree(&e).ok_or_else(|| format!("'{latex}' is not supported in a math cell"))
    }

    /// The size `h` has read as a matrix input reads a value (ADR 0041,
    /// decision 8): a matrix's own, a tuple's or vector's `n` by 1, the
    /// transpose of one (`(a, b)^T`, `(a, b)'`) 1 by `n`, anything else 1
    /// by 1.
    pub fn matrix_size(&self, h: Handle) -> (u32, u32) {
        match grid_of(&self.exprs[h.index()]) {
            Grid::Matrix(m) => (m.rows(), m.cols()),
            Grid::Column(xs) => (xs.len() as u32, 1),
            Grid::Row(xs) => (1, xs.len() as u32),
            Grid::One(_) => (1, 1),
        }
    }

    /// Entry (`row`, `col`), from 1, of `h` read as [`Engine::matrix_size`]
    /// reads it; none past its size.
    pub fn matrix_entry(&mut self, h: Handle, row: u32, col: u32) -> Option<Handle> {
        let e = match grid_of(&self.exprs[h.index()]) {
            Grid::Matrix(m) => m.get(row.wrapping_sub(1), col.wrapping_sub(1)).cloned(),
            Grid::Column(xs) if col == 1 => xs.get(row.wrapping_sub(1) as usize).cloned(),
            Grid::Row(xs) if row == 1 => xs.get(col.wrapping_sub(1) as usize).cloned(),
            Grid::One(e) if row == 1 && col == 1 => Some(e.clone()),
            _ => None,
        }?;
        Some(self.push(e))
    }

    /// `h` made `rows` by `cols`: its entries kept where both fit, the
    /// rest blank. A tuple or vector stays one while one column is asked
    /// for, a transposed one while one row is; anything else becomes a
    /// matrix, as the current core's matrix input resizes a bound value.
    pub fn resize_matrix(&mut self, h: Handle, rows: u32, cols: u32) -> Handle {
        let e = self.exprs[h.index()].clone();
        let resized = |xs: Vec<Expr>, n: u32| -> Vec<Expr> {
            let mut xs = xs;
            xs.resize(n as usize, Expr::Blank);
            xs
        };
        let out = match e {
            Expr::Seq(kind, xs) if is_vector(kind) && cols == 1 => {
                Expr::Seq(kind, resized(xs, rows))
            }
            Expr::Pow(base, t) if is_transpose(&base, &t) && rows == 1 => match *base {
                Expr::Seq(kind, xs) => Expr::Pow(Box::new(Expr::Seq(kind, resized(xs, cols))), t),
                _ => unreachable!("a transpose of a vector"),
            },
            Expr::Prime(base)
                if rows == 1 && matches!(&*base, Expr::Seq(k, _) if is_vector(*k)) =>
            {
                match *base {
                    Expr::Seq(kind, xs) => {
                        Expr::Prime(Box::new(Expr::Seq(kind, resized(xs, cols))))
                    }
                    _ => unreachable!("a transpose of a vector"),
                }
            }
            e => {
                let old = e.clone();
                let m = me::Mat::generate(rows, cols, |r, c| {
                    match grid_of(&old) {
                        Grid::Matrix(m) => m.get(r, c).cloned(),
                        Grid::Column(xs) if c == 0 => xs.get(r as usize).cloned(),
                        Grid::Row(xs) if r == 0 => xs.get(c as usize).cloned(),
                        Grid::One(x) if r == 0 && c == 0 => Some(x.clone()),
                        _ => None,
                    }
                    .unwrap_or(Expr::Blank)
                });
                Expr::Matrix(m)
            }
        };
        self.push(out)
    }

    /// The cell each entry of a matrix's template is, by row, when the
    /// entry is one cell leaf alone, as (cell, is math): the entries a
    /// `<matrix>` instantiates ([`Post::Matrix`](crate::program::Post::Matrix)).
    pub fn template_entry_cells(&self, template: Handle) -> Vec<Option<(u32, bool)>> {
        let one = |e: &Expr| match e {
            Expr::Sym(s) => leaf_of(&s.name()),
            _ => None,
        };
        match &self.exprs[template.index()] {
            Expr::Seq(me::expr::SeqKind::List, xs) if xs.len() > 1 => xs.iter().map(one).collect(),
            e => vec![one(e)],
        }
    }

    /// The entries of `h`, by row, when it is a `rows` by `cols` matrix.
    pub fn matrix_entries(&mut self, h: Handle, rows: u32, cols: u32) -> Option<Vec<Handle>> {
        let Expr::Matrix(m) = &self.exprs[h.index()] else {
            return None;
        };
        if (m.rows(), m.cols()) != (rows, cols) {
            return None;
        }
        let xs = m.entries().to_vec();
        Some(xs.into_iter().map(|e| self.push(e)).collect())
    }

    /// The `rows` by `cols` matrix whose entries, by row, are the
    /// expressions `entries` hold (a math cell's handle each; NaN the
    /// blank): a matrix input's value (ADR 0045). The blank expression when
    /// they do not fill it.
    pub fn grid(&mut self, rows: u32, cols: u32, entries: &[f64]) -> Handle {
        let xs: Vec<Expr> = entries
            .iter()
            .map(|&v| {
                if v.is_nan() {
                    Expr::Blank
                } else {
                    self.exprs[Handle::from_value(v).index()].clone()
                }
            })
            .collect();
        let e = me::Mat::new(rows, cols, xs)
            .map(Expr::Matrix)
            .unwrap_or(Expr::Blank);
        self.push(e)
    }

    /// The entries of the value `e` (ADR 0041, decision 8): a list's,
    /// tuple's, vector's or array's; a scalar is its one entry, the blank
    /// expression none.
    fn entries_of(e: &Expr) -> Option<&[Expr]> {
        use me::expr::SeqKind;
        match e {
            Expr::Seq(
                SeqKind::List
                | SeqKind::Tuple
                | SeqKind::Vector
                | SeqKind::AltVector
                | SeqKind::Array,
                xs,
            ) => Some(xs),
            _ => None,
        }
    }

    /// How many entries `h` holds: a list's, tuple's, vector's or
    /// array's; 1 for a scalar or the blank expression, as the current
    /// core counts a math's dimensions.
    pub fn count(&self, h: Handle) -> usize {
        Self::entries_of(&self.exprs[h.index()]).map_or(1, <[_]>::len)
    }

    /// The position (0-based) entry `k` (1-based) of `n` names: none for
    /// an index that is no integer from 1 to `n` (ADR 0041, decision 3).
    fn entry_at(k: f64, n: usize) -> Option<usize> {
        (k.fract() == 0.0 && k >= 1.0 && k <= n as f64).then(|| k as usize - 1)
    }

    /// Entry `k` (1-based) of the value `h` holds, a projection inside
    /// the handle (ADR 0041, decision 2): a scalar's first entry is
    /// itself; none past the count or for an index that is no integer. A
    /// matrix is read by rows, row `k` a tuple of its entries, and a
    /// vector transposed (`(a, b)^T`, `(a, b)'`) as its one row, so `[i][j]`
    /// is entry (i, j) of a matrix, as a matrix input reads a value (ADR
    /// 0060).
    pub fn entry(&mut self, h: Handle, k: f64) -> Option<Handle> {
        let e = &self.exprs[h.index()];
        if matches!(e, Expr::Blank) {
            return None;
        }
        if let Some(rows) = rows_of(e) {
            let x = rows.get(Self::entry_at(k, rows.len())?)?.clone();
            return Some(self.push(x));
        }
        match Self::entries_of(e) {
            Some(xs) => {
                let x = xs[Self::entry_at(k, xs.len())?].clone();
                Some(self.push(x))
            }
            None => Self::entry_at(k, 1).map(|_| h),
        }
    }

    /// `h` with entry `k` (1-based) replaced by `d`, its head kept; a
    /// scalar's first entry is `d` itself. None for an index that names
    /// no entry. A matrix's row `k` takes `d`'s entries, as many as its
    /// columns (one alone for one column); a transposed vector's one row
    /// takes them all, still transposed (ADR 0060).
    pub fn with_entry(&mut self, h: Handle, k: f64, d: Handle) -> Option<Handle> {
        let e = &self.exprs[h.index()];
        if matches!(e, Expr::Blank) {
            return None;
        }
        let dx = &self.exprs[d.index()];
        let d_entries = || match Self::entries_of(dx) {
            Some(xs) => xs.to_vec(),
            None => vec![dx.clone()],
        };
        let out = match e {
            Expr::Matrix(m) => {
                let i = Self::entry_at(k, m.rows() as usize)?;
                let row = d_entries();
                if row.len() != m.cols() as usize {
                    return None;
                }
                let cols = m.cols() as usize;
                let mut xs = m.entries().to_vec();
                xs[i * cols..(i + 1) * cols].clone_from_slice(&row);
                Expr::Matrix(me::Mat::new(m.rows(), m.cols(), xs)?)
            }
            Expr::Pow(base, t) if is_transpose(base, t) => {
                Self::entry_at(k, 1)?;
                let Expr::Seq(kind, _) = &**base else {
                    return None;
                };
                Expr::Pow(Box::new(Expr::Seq(*kind, d_entries())), t.clone())
            }
            Expr::Prime(base) if matches!(&**base, Expr::Seq(kind, _) if is_vector(*kind)) => {
                Self::entry_at(k, 1)?;
                let Expr::Seq(kind, _) = &**base else {
                    return None;
                };
                Expr::Prime(Box::new(Expr::Seq(*kind, d_entries())))
            }
            Expr::Seq(kind, xs) => {
                Self::entries_of(e)?;
                let i = Self::entry_at(k, xs.len())?;
                let mut xs = xs.clone();
                xs[i] = dx.clone();
                Expr::Seq(*kind, xs)
            }
            _ => return Self::entry_at(k, 1).map(|_| d),
        };
        Some(self.push(out))
    }

    /// The items of `e` read as a list's entries (ADR 0063, ADR 0041
    /// decision 5's `mergeMathLists`): a list's items; none for anything
    /// else, which is one entry, itself.
    fn list_items(e: &Expr) -> Option<&[Expr]> {
        match e {
            Expr::Seq(me::expr::SeqKind::List, xs) => Some(xs),
            _ => None,
        }
    }

    /// How many entries `h` holds read as a list's (ADR 0063): a list's
    /// items, else 1 (a tuple, a point, a scalar, the blank expression).
    pub fn list_count(&self, h: Handle) -> usize {
        Self::list_items(&self.exprs[h.index()]).map_or(1, <[_]>::len)
    }

    /// Entry `k` (1-based) of `h` read as a list's (ADR 0063): a list's
    /// item, else `h` itself as entry 1; none past the count or for an
    /// index that is no integer.
    pub fn list_item(&mut self, h: Handle, k: f64) -> Option<Handle> {
        match Self::list_items(&self.exprs[h.index()]) {
            Some(xs) => {
                let x = xs[Self::entry_at(k, xs.len())?].clone();
                Some(self.push(x))
            }
            None => Self::entry_at(k, 1).map(|_| h),
        }
    }

    /// `h` with entry `k` (1-based), read as a list's, replaced by `d`:
    /// the list with that item replaced, or `d` itself for entry 1 of
    /// what is no list. None for an index that names no entry.
    pub fn with_list_item(&mut self, h: Handle, k: f64, d: Handle) -> Option<Handle> {
        let dx = self.exprs[d.index()].clone();
        match &self.exprs[h.index()] {
            Expr::Seq(me::expr::SeqKind::List, xs) => {
                let i = Self::entry_at(k, xs.len())?;
                let mut xs = xs.clone();
                xs[i] = dx;
                Some(self.push(Expr::Seq(me::expr::SeqKind::List, xs)))
            }
            _ => Self::entry_at(k, 1).map(|_| d),
        }
    }

    /// The reduction `op` of the entries of `h`, read as a list's (ADR
    /// 0063), as an operator over those entries spells it (ADR 0043): a
    /// sum, a product, the mean as the sum over the count, a call of the
    /// function (`min`, `max`, `gcd`, `lcm`, `median`), `mod` of exactly
    /// two, and the variance (a `population`'s, else a sample's) or its
    /// square root. The blank expression for none, or for `mod` of any
    /// other number.
    pub fn reduce_entries(&mut self, h: Handle, op: Reduction, population: bool) -> Handle {
        let xs: Vec<Expr> = match Self::list_items(&self.exprs[h.index()]) {
            Some(xs) => xs.to_vec(),
            None => vec![self.exprs[h.index()].clone()],
        };
        let n = xs.len();
        if n == 0 {
            return self.push(Expr::Blank);
        }
        let call = |f: &str, xs: Vec<Expr>| Expr::Apply(Box::new(Expr::sym(f)), xs);
        let sum = |xs: Vec<Expr>| match <[Expr; 1]>::try_from(xs) {
            Ok([x]) => x,
            Err(xs) => Expr::Add(xs),
        };
        let e = match op {
            Reduction::Sum => sum(xs),
            Reduction::Product if n == 1 => xs.into_iter().next().expect("one entry"),
            Reduction::Product => Expr::Mul(xs),
            Reduction::Mean => Expr::Div(Box::new(sum(xs)), Box::new(number(n as f64))),
            Reduction::Min => call("min", xs),
            Reduction::Max => call("max", xs),
            Reduction::Gcd => call("gcd", xs),
            Reduction::Lcm => call("lcm", xs),
            Reduction::Median => call("median", xs),
            Reduction::Mod if n == 2 => call("mod", xs),
            Reduction::Variance | Reduction::StandardDeviation => {
                let squares = sum(xs
                    .iter()
                    .map(|x| Expr::Pow(Box::new(x.clone()), Box::new(number(2.0))))
                    .collect());
                let total = Expr::Pow(Box::new(sum(xs)), Box::new(number(2.0)));
                let spread = Expr::Div(
                    Box::new(minus(
                        squares,
                        Expr::Div(Box::new(total), Box::new(number(n as f64))),
                    )),
                    Box::new(number(if population { n } else { n - 1 } as f64)),
                );
                if op == Reduction::StandardDeviation {
                    apply("sqrt", spread)
                } else {
                    spread
                }
            }
            _ => Expr::Blank,
        };
        self.push(e)
    }

    /// `h` simplified.
    pub fn simplify(&mut self, h: Handle) -> Handle {
        let e = me::simplify(&self.exprs[h.index()]);
        self.push(e)
    }

    /// `h` expanded; it does not simplify first.
    pub fn expand(&mut self, h: Handle) -> Handle {
        let e = me::expand(&self.exprs[h.index()]);
        self.push(e)
    }

    /// The derivative of `h` with respect to `var`.
    pub fn derivative(&mut self, h: Handle, var: &str) -> Handle {
        let e = me::derivative(&self.exprs[h.index()], var);
        self.push(e)
    }

    /// `h` with its values held between `lo` and `hi`, as `max(lo, min(hi,
    /// h))`, spelled with `abs` so it stays a tree (a template, a curve's
    /// tape): `(|h - lo| - |h - hi| + lo + hi) / 2`. Bounds out of order
    /// hold every value at `lo`, as the max of the min does.
    pub fn clamp(&mut self, h: Handle, lo: f64, hi: f64) -> Handle {
        if lo > hi {
            return self.num(lo);
        }
        let e = &self.exprs[h.index()];
        let abs_minus = |b: f64| apply("abs", minus(e.clone(), number(b)));
        let sum = Expr::Add(vec![
            abs_minus(lo),
            Expr::Neg(Box::new(abs_minus(hi))),
            number(lo),
            number(hi),
        ]);
        self.push(Expr::Div(Box::new(sum), Box::new(number(2.0))))
    }

    /// `h` with its values wrapped into the range from `lo` to `hi`, as
    /// `lo + mod(h - lo, hi - lo)`: `h - p floor((h - lo) / p)` with period
    /// `p`. Bounds in either order are the same range; equal bounds hold
    /// every value there.
    pub fn wrap_periodic(&mut self, h: Handle, lo: f64, hi: f64) -> Handle {
        if lo == hi {
            return self.num(lo);
        }
        let (lo, hi) = if lo > hi { (hi, lo) } else { (lo, hi) };
        let p = hi - lo;
        let e = &self.exprs[h.index()];
        let turns = apply(
            "floor",
            Expr::Div(Box::new(minus(e.clone(), number(lo))), Box::new(number(p))),
        );
        let wrapped = minus(e.clone(), Expr::Mul(vec![number(p), turns]));
        self.push(wrapped)
    }

    /// `f` of `h`'s value when it evaluates to a real number, else the
    /// function `name` applied to `h`: a one-input operator over math
    /// (`<abs>`, `<sign>`, `<floor>`, `<ceil>`), as the current core's
    /// computes one.
    pub fn apply_numeric(&mut self, h: Handle, name: &str, f: fn(f64) -> f64) -> Handle {
        match real(me::evaluate_to_constant(&self.exprs[h.index()])) {
            v if v.is_finite() => self.num(f(v)),
            _ => {
                let e = apply(name, self.exprs[h.index()].clone());
                self.push(e)
            }
        }
    }

    /// `h` with every number in it rounded to `decimals` decimal places,
    /// after its numbers, constants and functions of numbers are made
    /// floats (`<round>`): `1/3` rounds, and `sin(2.1 x)` keeps its `x`.
    pub fn round_decimals(&mut self, h: Handle, decimals: i32) -> Handle {
        let e = self.floated(h);
        self.push(me::round_numbers_to_decimals(&e, decimals))
    }

    /// `h` with every number in it rounded to `digits` significant digits,
    /// after floating them as [`Engine::round_decimals`] does.
    pub fn round_digits(&mut self, h: Handle, digits: i32) -> Handle {
        let e = self.floated(h);
        self.push(me::round_numbers_to_precision(&e, digits))
    }

    /// `h`'s numbers, constants and functions of numbers as floats.
    fn floated(&self, h: Handle) -> Expr {
        me::evaluate_numbers_evaluate_functions_with_digits(
            &self.exprs[h.index()],
            me::MaxDigits::Unlimited,
        )
    }

    /// `h` with its numbers folded, in the order written, and each one of
    /// magnitude below `threshold` made 0 (`<setSmallToZero>`).
    pub fn small_to_zero(&mut self, h: Handle, threshold: f64) -> Handle {
        let e = me::evaluate_numbers_preserve_order(&self.exprs[h.index()]);
        self.push(me::set_small_zero(&e, threshold))
    }

    /// Evaluate to a real number with `var` bound; any other free symbol
    /// gives NaN.
    pub fn evaluate(&mut self, h: Handle, var: Option<(&str, f64)>) -> f64 {
        let e = &self.exprs[h.index()];
        // A number cannot hold a blank: one computed from it is missing
        // (D40, ADR 0046).
        if has_blank(e) || var.is_some_and(|(_, x)| crate::program::is_missing(x)) {
            return crate::program::MISSING;
        }
        match var {
            Some((name, x)) => {
                let mut b = HashMap::with_capacity(1);
                b.insert(name.to_string(), x);
                real(me::evaluate_fast_f64(e, &b))
            }
            None => real(me::evaluate_to_constant(e)),
        }
    }

    /// Evaluate at many values of one variable (a curve's samples).
    pub fn evaluate_many(&mut self, h: Handle, var: &str, xs: &[f64], out: &mut [f64]) {
        let ys = me::evaluate_many(&self.exprs[h.index()], var, xs);
        out.copy_from_slice(&ys[..out.len()]);
    }

    /// Mathematical equality, by numeric sampling, over the lattice of
    /// values with entries (`sym::compare`).
    pub fn equals(&mut self, a: Handle, b: Handle) -> bool {
        self.compare(a, b, CompareOpts::default()) == 1.0
    }

    /// Structural equality after reordering (`symbolicEquality`), over the
    /// same lattice.
    pub fn equals_syntax(&mut self, a: Handle, b: Handle) -> bool {
        let opts = CompareOpts {
            syntactic: true,
            ..CompareOpts::default()
        };
        self.compare(a, b, opts) == 1.0
    }

    /// How equal `a` and `b` are, from 0 to 1, as `opts` compares them
    /// (ADR 0041, decision 8).
    pub fn compare(&mut self, a: Handle, b: Handle, opts: CompareOpts) -> f64 {
        super::compare::check_equality(
            &self.exprs[a.index()],
            &self.exprs[b.index()],
            opts,
            &self.eq,
        )
    }

    /// How equal the two entries of the pair `h` is are (`Post::ComparePair`),
    /// as a stored number from 0 to 1; 0 for anything but a pair.
    pub fn compare_pair(&mut self, h: Handle, opts: CompareOpts) -> Handle {
        let v = match &self.exprs[h.index()] {
            Expr::Seq(me::expr::SeqKind::Tuple, xs) if xs.len() == 2 => {
                super::compare::check_equality(&xs[0], &xs[1], opts, &self.eq)
            }
            _ => 0.0,
        };
        self.num(v)
    }

    /// The expression as a builder tree, cell leaves included as the `L`
    /// the caller knows them to be. `None` when it uses something a tree
    /// cannot say (sets, relations, a function of several arguments).
    pub fn export<L: Leaf>(&self, h: Handle) -> Option<Tree<L>> {
        to_tree(&self.exprs[h.index()])
    }

    /// The name of the symbol `h` is, if it is one (a function's
    /// variable).
    pub fn symbol(&self, h: Handle) -> Option<String> {
        match &self.exprs[h.index()] {
            Expr::Sym(s) => Some(s.name()),
            _ => None,
        }
    }

    /// `h` as math text.
    pub fn text(&self, h: Handle) -> String {
        me::to_text(&self.exprs[h.index()], &TextOpts::default())
    }

    /// `h` as the JavaScript math tree, in JSON.
    pub fn ast_json(&self, h: Handle) -> String {
        me::expr::serde::to_js(&self.exprs[h.index()]).to_string()
    }

    /// `h` as LaTeX.
    pub fn latex(&self, h: Handle) -> String {
        me::to_latex(&self.exprs[h.index()], &LatexOpts::default())
    }

    /// `h` as LaTeX, rounded and written as `display` asks.
    pub fn display_latex(&self, h: Handle, display: &super::Display) -> String {
        display.latex(&self.exprs[h.index()])
    }

    /// Number of stored expressions.
    pub fn len(&self) -> usize {
        self.exprs.len()
    }

    /// Whether it stores no expression.
    pub fn is_empty(&self) -> bool {
        self.exprs.is_empty()
    }

    /// Approximate: every node counted at the size of one [`Expr`].
    pub fn heap_bytes(&self) -> usize {
        self.exprs.iter().map(count_nodes).sum::<usize>() * std::mem::size_of::<Expr>()
            + self.index.capacity() * 16
    }
}

/// Functions DoenetML applies in math text beyond the engine's own
/// (`appliedFunctionSymbolsDefault` in the current core's `utils/math.ts`),
/// and `gcd` and `lcm`, which an operator over math spells (ADR 0043):
/// `min(x, 3)` is the function, not `m i n (x, 3)`.
const DOENET_APPLIED: &[&str] = &[
    "min", "max", "mean", "median", "sum", "prod", "variance", "std", "count", "gcd", "lcm",
];

/// The math text parser: the engine's, with DoenetML's applied functions.
fn parser() -> TextToAst {
    let mut opts = TextToAstOptions::default();
    for f in DOENET_APPLIED {
        if !opts.applied_function_symbols.iter().any(|g| g == f) {
            opts.applied_function_symbols.push(f.to_string());
        }
    }
    TextToAst::new(opts)
}

/// A number as math text the engine parses back to it: `-3`, `0.5`,
/// `0.00000000000001`; the infinities as `infinity`, and NaN as the blank.
pub(crate) fn number_text(v: f64) -> String {
    if v.is_nan() {
        BLANK.to_string()
    } else if v.is_infinite() {
        if v > 0.0 { "infinity" } else { "-infinity" }.to_string()
    } else {
        format!("{v}")
    }
}

/// The symbol a cell leaf becomes: `cellN<i>` for a numeric cell, `cellM<i>`
/// for a math cell.
pub(crate) fn leaf_name(cell: u32, math: bool) -> String {
    format!("cell{}{cell}", if math { 'M' } else { 'N' })
}

/// A builder tree as an expression, its cell leaves (cell, is math)
/// appended to `leaves` in first-seen order.
fn convert<L: Leaf>(t: &Tree<L>, leaves: &mut Vec<(u32, bool)>, parser: &mut TextToAst) -> Expr {
    match t {
        Tree::Num(v) => number(*v),
        Tree::Sym(s) if s == BLANK => Expr::Blank,
        Tree::Sym(s) => Expr::sym(s),
        // Checked to parse when it was written (`parse_tree`).
        Tree::Written(text) => parser.convert(text).unwrap_or(Expr::Blank),
        Tree::Cell { cell, math } => {
            let cell = cell.raw();
            if !leaves.contains(&(cell, *math)) {
                leaves.push((cell, *math));
            }
            Expr::sym(&leaf_name(cell, *math))
        }
        Tree::Add(ts) => Expr::Add(ts.iter().map(|t| convert(t, leaves, parser)).collect()),
        Tree::Mul(ts) => Expr::Mul(ts.iter().map(|t| convert(t, leaves, parser)).collect()),
        Tree::Sub(a, b) => Expr::Add(vec![
            convert(a, leaves, parser),
            Expr::Neg(Box::new(convert(b, leaves, parser))),
        ]),
        Tree::Div(a, b) => Expr::Div(
            Box::new(convert(a, leaves, parser)),
            Box::new(convert(b, leaves, parser)),
        ),
        Tree::Neg(x) => Expr::Neg(Box::new(convert(x, leaves, parser))),
        Tree::Pow(a, b) => Expr::Pow(
            Box::new(convert(a, leaves, parser)),
            Box::new(convert(b, leaves, parser)),
        ),
        Tree::Apply(f, x) => Expr::Apply(Box::new(Expr::sym(f)), vec![convert(x, leaves, parser)]),
        Tree::Call(f, xs) => Expr::Apply(
            Box::new(Expr::sym(f)),
            xs.iter().map(|x| convert(x, leaves, parser)).collect(),
        ),
        Tree::Shape(head, ts) => shape_expr(
            *head,
            ts.iter().map(|t| convert(t, leaves, parser)).collect(),
        ),
    }
}

/// The expression a shape's head makes of its entries (ADR 0041, decision
/// 8). An interval of other than two entries, or a matrix whose entries do
/// not fill it, is the blank expression: no tree the core makes is one.
pub(crate) fn shape_expr(head: Shape, xs: Vec<Expr>) -> Expr {
    use me::expr::SeqKind;
    match head {
        Shape::List => Expr::Seq(SeqKind::List, xs),
        Shape::Tuple => Expr::Seq(SeqKind::Tuple, xs),
        Shape::Vector => Expr::Seq(SeqKind::Vector, xs),
        Shape::AltVector => Expr::Seq(SeqKind::AltVector, xs),
        Shape::Array => Expr::Seq(SeqKind::Array, xs),
        Shape::Set => Expr::Seq(SeqKind::Set, xs),
        Shape::Union => Expr::Union(xs),
        Shape::Intersect => Expr::Intersect(xs),
        Shape::Interval(closed) => match <[Expr; 2]>::try_from(xs) {
            Ok([lo, hi]) => Expr::Interval {
                endpoints: Box::new((lo, hi)),
                closed: (closed[0], closed[1]),
            },
            Err(_) => Expr::Blank,
        },
        Shape::Matrix { rows, cols } => me::Mat::new(rows, cols, xs)
            .map(Expr::Matrix)
            .unwrap_or(Expr::Blank),
    }
}

/// A builder tree as text, as [`Engine::text`] prints it once imported: a
/// function of the tree alone, held by no engine. A cell leaf prints by
/// its number (`cellN3`).
pub(crate) fn template_text<L: Leaf>(tree: &Tree<L>) -> String {
    me::to_text(
        &convert(tree, &mut Vec::new(), &mut parser()),
        &TextOpts::default(),
    )
}

/// The cell leaf a symbol names, if it is one.
fn leaf_of(name: &str) -> Option<(u32, bool)> {
    match (name.strip_prefix("cellN"), name.strip_prefix("cellM")) {
        (Some(c), _) => Some((c.parse().ok()?, false)),
        (_, Some(c)) => Some((c.parse().ok()?, true)),
        _ => None,
    }
}

/// The cell leaves of an expression, in first-seen order.
fn cell_leaves(e: &Expr) -> Vec<(u32, bool)> {
    let mut out = Vec::new();
    for v in me::variables(e) {
        if let Some(leaf) = leaf_of(&v)
            && !out.contains(&leaf)
        {
            out.push(leaf);
        }
    }
    out
}

/// `f(x)` for a named function of one argument.
fn apply(f: &str, x: Expr) -> Expr {
    Expr::Apply(Box::new(Expr::sym(f)), vec![x])
}

/// `a - b`, as the engine spells a difference.
fn minus(a: Expr, b: Expr) -> Expr {
    Expr::Add(vec![a, Expr::Neg(Box::new(b))])
}

/// A number as the engine spells it: the infinities are constants, since a
/// float infinity does not evaluate.
/// The rows of a value read by rows ([`Engine::entry`]): a matrix's,
/// each a tuple, or a transposed vector's one, the vector; none for any
/// other value.
fn rows_of(e: &Expr) -> Option<Vec<Expr>> {
    use me::expr::SeqKind;
    match grid_of(e) {
        Grid::Matrix(m) => Some(
            (0..m.rows())
                .map(|r| {
                    let c = m.cols() as usize;
                    let row = m.entries()[r as usize * c..(r as usize + 1) * c].to_vec();
                    Expr::Seq(SeqKind::Tuple, row)
                })
                .collect(),
        ),
        Grid::Row(_) => match e {
            Expr::Pow(base, _) | Expr::Prime(base) => Some(vec![(**base).clone()]),
            _ => None,
        },
        Grid::Column(_) | Grid::One(_) => None,
    }
}

/// A value as a matrix input reads it ([`Engine::matrix_size`]).
enum Grid<'e> {
    Matrix(&'e me::Mat),
    Column(&'e [Expr]),
    Row(&'e [Expr]),
    One(&'e Expr),
}

fn grid_of(e: &Expr) -> Grid<'_> {
    match e {
        Expr::Matrix(m) => Grid::Matrix(m),
        Expr::Seq(kind, xs) if is_vector(*kind) => Grid::Column(xs),
        Expr::Pow(base, t) if is_transpose(base, t) => match &**base {
            Expr::Seq(_, xs) => Grid::Row(xs),
            _ => Grid::One(e),
        },
        Expr::Prime(base) => match &**base {
            Expr::Seq(kind, xs) if is_vector(*kind) => Grid::Row(xs),
            _ => Grid::One(e),
        },
        _ => Grid::One(e),
    }
}

/// A tuple, vector or angle-bracket vector: what a matrix input reads as a
/// column (the current core's `vectorOperators`).
fn is_vector(kind: me::expr::SeqKind) -> bool {
    use me::expr::SeqKind;
    matches!(kind, SeqKind::Tuple | SeqKind::Vector | SeqKind::AltVector)
}

/// Whether `base^t` is a vector transposed (`(a, b)^T`).
fn is_transpose(base: &Expr, t: &Expr) -> bool {
    matches!(base, Expr::Seq(kind, _) if is_vector(*kind))
        && matches!(t, Expr::Sym(s) if s.name() == "T")
}

pub(crate) fn number(v: f64) -> Expr {
    if v == f64::INFINITY {
        Expr::Const(me::MathConst::Inf)
    } else if v == f64::NEG_INFINITY {
        Expr::Const(me::MathConst::NegInf)
    } else {
        Expr::Num(Number::from_f64(v))
    }
}

fn real(c: Option<num_complex::Complex64>) -> f64 {
    match c {
        Some(z) if z.im.abs() <= 1e-12 * z.re.abs().max(1.0) => z.re,
        _ => f64::NAN,
    }
}

/// Whether `e` holds the blank expression anywhere.
pub(crate) fn has_blank(e: &Expr) -> bool {
    matches!(e, Expr::Blank) || e.children().into_iter().any(has_blank)
}

fn count_nodes(e: &Expr) -> usize {
    1 + e.children().into_iter().map(count_nodes).sum::<usize>()
}

/// The blank expression's spelling as a tree symbol (`＿`, as DoenetML
/// prints a missing operand).
const BLANK: &str = "\u{ff3f}";

/// An engine expression as a builder tree; cell leaves come back from their
/// `cellN<i>`/`cellM<i>` symbol names.
fn to_tree<L: Leaf>(e: &Expr) -> Option<Tree<L>> {
    let all = |es: &[Expr]| es.iter().map(to_tree).collect::<Option<Vec<_>>>();
    let one = |e: &Expr| to_tree(e).map(Box::new);
    Some(match e {
        Expr::Num(n) => Tree::Num(n.to_f64()),
        Expr::Sym(s) => {
            let name = s.name();
            match leaf_of(&name) {
                Some((cell, math)) => Tree::Cell {
                    cell: L::from_raw(cell),
                    math,
                },
                None => Tree::Sym(name),
            }
        }
        Expr::Blank => Tree::Sym(BLANK.into()),
        Expr::Const(me::MathConst::Pi) => Tree::Sym("pi".into()),
        Expr::Const(me::MathConst::E) => Tree::Sym("e".into()),
        Expr::Const(me::MathConst::Inf) => Tree::Num(f64::INFINITY),
        Expr::Const(me::MathConst::NegInf) => Tree::Num(f64::NEG_INFINITY),
        Expr::Add(es) => Tree::Add(all(es)?),
        Expr::Mul(es) => Tree::Mul(all(es)?),
        Expr::Div(a, b) => Tree::Div(one(a)?, one(b)?),
        Expr::Pow(a, b) => Tree::Pow(one(a)?, one(b)?),
        Expr::Neg(a) => Tree::Neg(one(a)?),
        Expr::Apply(head, args) if args.len() == 1 => match &**head {
            Expr::Sym(f) => Tree::Apply(f.name(), one(&args[0])?),
            _ => return None,
        },
        Expr::Seq(kind, xs) => Tree::Shape(
            match kind {
                me::expr::SeqKind::List => Shape::List,
                me::expr::SeqKind::Tuple => Shape::Tuple,
                me::expr::SeqKind::Vector => Shape::Vector,
                me::expr::SeqKind::AltVector => Shape::AltVector,
                me::expr::SeqKind::Array => Shape::Array,
                me::expr::SeqKind::Set => Shape::Set,
            },
            all(xs)?,
        ),
        Expr::Union(xs) => Tree::Shape(Shape::Union, all(xs)?),
        Expr::Intersect(xs) => Tree::Shape(Shape::Intersect, all(xs)?),
        Expr::Interval { endpoints, closed } => Tree::Shape(
            Shape::Interval([closed.0, closed.1]),
            vec![to_tree(&endpoints.0)?, to_tree(&endpoints.1)?],
        ),
        Expr::Matrix(m) => Tree::Shape(
            Shape::Matrix {
                rows: m.rows(),
                cols: m.cols(),
            },
            all(m.entries())?,
        ),
        Expr::Apply(head, args) => match &**head {
            Expr::Sym(f) => Tree::Call(f.name(), all(args)?),
            _ => return None,
        },
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn placeholders_are_cell_leaves() {
        let t = Engine::new()
            .parse_tree::<u32>("cellN3 x + sin(cellN12)")
            .unwrap();
        let Tree::Add(terms) = t else { panic!("{t:?}") };
        assert_eq!(
            terms[0],
            Tree::Mul(vec![
                Tree::Cell {
                    cell: 3,
                    math: false
                },
                Tree::Sym("x".into())
            ])
        );
        assert_eq!(
            terms[1],
            Tree::Apply(
                "sin".into(),
                Box::new(Tree::Cell {
                    cell: 12,
                    math: false
                })
            )
        );
    }

    #[test]
    fn empty_text_is_the_blank_expression() {
        let mut e = Engine::new();
        let h = e.parse("  ").unwrap();
        assert_eq!(e.text(h), "\u{ff3f}");
        assert_eq!(e.parse_tree::<u32>("").unwrap(), Tree::Sym(BLANK.into()));
        let back = e.import(&Tree::<u32>::Sym(BLANK.into()));
        assert_eq!(e.text(back), "\u{ff3f}");
    }

    #[test]
    fn infinity_is_a_value() {
        let mut e = Engine::new();
        let h = e.num(f64::INFINITY);
        assert_eq!(e.evaluate(h, None), f64::INFINITY);
        let h = e.num(f64::NEG_INFINITY);
        assert_eq!(e.evaluate(h, None), f64::NEG_INFINITY);
    }

    #[test]
    fn an_empty_math_leaf_is_the_blank_expression() {
        let mut e = Engine::new();
        let t = e.import(&Tree::Div(
            Box::new(Tree::Num(2.0)),
            Box::new(Tree::Cell {
                cell: 0u32,
                math: true,
            }),
        ));
        let h = e.instantiate(t, &[f64::NAN]);
        assert_eq!(e.text(h), "2/\u{ff3f}");
        // A numeric leaf's NaN stays a number.
        let t = e.import(&Tree::Cell {
            cell: 0u32,
            math: false,
        });
        let h = e.instantiate(t, &[f64::NAN]);
        assert!(e.evaluate(h, None).is_nan());
    }

    #[test]
    fn a_derivative_is_a_template_too() {
        let mut e = Engine::new();
        let t = e.import(&Tree::Mul(vec![
            Tree::Cell {
                cell: 0,
                math: false,
            },
            Tree::Pow(Box::new(Tree::Sym("x".into())), Box::new(Tree::Num(2.0))),
        ]));
        let d = e.derivative(t, "x");
        let h = e.instantiate(d, &[3.0]);
        assert_ne!(h, d);
        assert_eq!(e.evaluate(h, Some(("x", 1.0))), 6.0);
    }

    #[test]
    fn clamp_and_wrap_hold_the_values() {
        let mut e = Engine::new();
        let cube = e.parse("x^3").unwrap();
        let c = e.clamp(cube, -3.0, 5.0);
        for (x, want) in [(-2.0, -3.0), (1.0, 1.0), (1.5, 3.375), (2.0, 5.0)] {
            assert!(
                (e.evaluate(c, Some(("x", x))) - want).abs() < 1e-12,
                "clamp at {x}"
            );
        }
        assert!(e.export::<u32>(c).is_some(), "a clamp is a tree");
        let w = e.wrap_periodic(cube, 3.0, -2.0);
        for x in [-2.0, -1.2, 0.4, 1.6, 2.0] {
            let want = -2.0 + (x * x * x + 2.0f64).rem_euclid(5.0);
            assert!(
                (e.evaluate(w, Some(("x", x))) - want).abs() < 1e-9,
                "wrap at {x}"
            );
        }
        assert!(e.export::<u32>(w).is_some(), "a wrap is a tree");
        let flat = e.clamp(cube, 2.0, 1.0);
        assert_eq!(e.evaluate(flat, Some(("x", 7.0))), 2.0);
    }

    #[test]
    fn unsupported_shapes_are_errors() {
        let mut e = Engine::new();
        assert!(e.parse_tree::<u32>("x = 2").is_err());
    }
}

//! The symbolic engine: math-expressions-rs, the library the current
//! DoenetML core calls through wasm, linked natively. Each handle is one
//! boxed `Expr` tree; nothing is shared or deduplicated, so a recomputed
//! expression always gets a new handle. Handles stay valid for the life of
//! the engine; nothing is reclaimed. Cell leaves are symbols named
//! `cellN<i>` (numeric) or `cellM<i>` (math), replaced by `substitute`.

use std::collections::HashMap;

use math_expressions as me;
use me::{EqOptions, Expr, LatexOpts, Number, TextOpts, TextToAst, TextToAstOptions};

use super::{Handle, Tree};

pub struct Engine {
    exprs: Vec<Expr>,
    /// Cell leaves of each expression used as a template, (cell, is math),
    /// found on first use.
    leaves: HashMap<Handle, Vec<(u32, bool)>>,
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
            parser: TextToAst::new(TextToAstOptions::default()),
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
    pub fn new() -> Self {
        Engine {
            exprs: Vec::new(),
            leaves: HashMap::new(),
            parser: TextToAst::new(TextToAstOptions::default()),
            eq: EqOptions::default(),
        }
    }

    pub fn expr(&self, h: Handle) -> &Expr {
        &self.exprs[h as usize]
    }

    fn push(&mut self, e: Expr) -> Handle {
        self.exprs.push(e);
        (self.exprs.len() - 1) as Handle
    }

    fn convert(&self, t: &Tree, leaves: &mut Vec<(u32, bool)>) -> Expr {
        match t {
            Tree::Num(v) => number(*v),
            Tree::Sym(s) if s == BLANK => Expr::Blank,
            Tree::Sym(s) => Expr::sym(s),
            Tree::Cell { cell, math } => {
                if !leaves.contains(&(*cell, *math)) {
                    leaves.push((*cell, *math));
                }
                Expr::sym(&leaf_name(*cell, *math))
            }
            Tree::Add(ts) => Expr::Add(ts.iter().map(|t| self.convert(t, leaves)).collect()),
            Tree::Mul(ts) => Expr::Mul(ts.iter().map(|t| self.convert(t, leaves)).collect()),
            Tree::Sub(a, b) => Expr::Add(vec![
                self.convert(a, leaves),
                Expr::Neg(Box::new(self.convert(b, leaves))),
            ]),
            Tree::Div(a, b) => Expr::Div(
                Box::new(self.convert(a, leaves)),
                Box::new(self.convert(b, leaves)),
            ),
            Tree::Neg(x) => Expr::Neg(Box::new(self.convert(x, leaves))),
            Tree::Pow(a, b) => Expr::Pow(
                Box::new(self.convert(a, leaves)),
                Box::new(self.convert(b, leaves)),
            ),
            Tree::Apply(f, x) => Expr::Apply(Box::new(Expr::sym(f)), vec![self.convert(x, leaves)]),
        }
    }

    /// Bring a builder tree in. Cell leaves are kept as leaves.
    pub fn import(&mut self, tree: &Tree) -> Handle {
        let mut leaves = Vec::new();
        let e = self.convert(tree, &mut leaves);
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

    /// Parse math text into a builder tree without storing it: what the
    /// build does with a template's math text, whose `$ref`s it has written
    /// as `cellN<plan>` leaves. Fails on what a tree cannot say (a relation,
    /// a tuple, a function of several arguments).
    pub fn parse_tree(&mut self, text: &str) -> Result<Tree, String> {
        let e = self.convert_text(text)?;
        to_tree(&e).ok_or_else(|| {
            format!("'{text}' is not supported in a math cell (a relation, tuple or multi-argument function)")
        })
    }

    pub fn num(&mut self, v: f64) -> Handle {
        self.push(number(v))
    }

    /// Replace every cell leaf with the cell's current value: a number, or
    /// the expression a math cell holds. A template without cell leaves
    /// returns itself. Any expression can be a template: a derivative taken
    /// at build time keeps its leaves, found here on first use.
    pub fn instantiate(&mut self, template: Handle, cells: &[f64]) -> Handle {
        let leaves = self
            .leaves
            .entry(template)
            .or_insert_with(|| cell_leaves(&self.exprs[template as usize]));
        if leaves.is_empty() {
            return template;
        }
        let mut subs = HashMap::with_capacity(leaves.len());
        for &(cell, math) in leaves.iter() {
            let v = cells[cell as usize];
            let e = if math && !v.is_nan() {
                self.exprs[v as usize].clone()
            } else {
                number(v)
            };
            subs.insert(leaf_name(cell, math), e);
        }
        let e = me::substitute(&self.exprs[template as usize], &subs);
        self.push(e)
    }

    pub fn simplify(&mut self, h: Handle) -> Handle {
        let e = me::simplify(&self.exprs[h as usize]);
        self.push(e)
    }

    pub fn expand(&mut self, h: Handle) -> Handle {
        let e = me::expand(&self.exprs[h as usize]);
        self.push(e)
    }

    pub fn derivative(&mut self, h: Handle, var: &str) -> Handle {
        let e = me::derivative(&self.exprs[h as usize], var);
        self.push(e)
    }

    /// Evaluate to a real number with `var` bound; any other free symbol
    /// gives NaN.
    pub fn evaluate(&mut self, h: Handle, var: Option<(&str, f64)>) -> f64 {
        let e = &self.exprs[h as usize];
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
        let ys = me::evaluate_many(&self.exprs[h as usize], var, xs);
        out.copy_from_slice(&ys[..out.len()]);
    }

    /// Mathematical equality, by numeric sampling.
    pub fn equals(&mut self, a: Handle, b: Handle) -> bool {
        me::equals(&self.exprs[a as usize], &self.exprs[b as usize], &self.eq)
    }

    /// Structural equality after reordering (`symbolicEquality`).
    pub fn equals_syntax(&mut self, a: Handle, b: Handle) -> bool {
        me::equals_syntactic(&self.exprs[a as usize], &self.exprs[b as usize], &self.eq)
    }

    pub fn has_symbols(&mut self, h: Handle) -> bool {
        !me::variables(&self.exprs[h as usize]).is_empty()
    }

    /// The expression as a builder tree, cell leaves included, for
    /// compiling (`tape::Tape`). `None` when it uses something a tree cannot
    /// say (sets, relations, a function of several arguments).
    pub fn export(&self, h: Handle) -> Option<Tree> {
        to_tree(&self.exprs[h as usize])
    }

    pub fn text(&self, h: Handle) -> String {
        me::to_text(&self.exprs[h as usize], &TextOpts::default())
    }

    pub fn latex(&self, h: Handle) -> String {
        me::to_latex(&self.exprs[h as usize], &LatexOpts::default())
    }

    /// Number of stored expressions.
    pub fn len(&self) -> usize {
        self.exprs.len()
    }

    pub fn is_empty(&self) -> bool {
        self.exprs.is_empty()
    }

    /// Approximate: every node counted at the size of one `Expr`.
    pub fn heap_bytes(&self) -> usize {
        self.exprs.iter().map(count_nodes).sum::<usize>() * std::mem::size_of::<Expr>()
    }
}

/// The symbol a cell leaf becomes: `cellN<i>` for a numeric cell, `cellM<i>`
/// for a math cell. The build writes the numeric form into math text for a
/// `$ref`; the parser keeps it as one symbol.
pub fn leaf_name(cell: u32, math: bool) -> String {
    format!("cell{}{cell}", if math { 'M' } else { 'N' })
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

/// A number as the engine spells it: the infinities are constants, since a
/// float infinity does not evaluate.
fn number(v: f64) -> Expr {
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

fn count_nodes(e: &Expr) -> usize {
    1 + e.children().into_iter().map(count_nodes).sum::<usize>()
}

/// An engine expression as a builder tree; cell leaves come back from their
/// `cellN<i>`/`cellM<i>` symbol names.
/// The blank expression's spelling as a tree symbol (`＿`, as DoenetML
/// prints a missing operand).
const BLANK: &str = "\u{ff3f}";

fn to_tree(e: &Expr) -> Option<Tree> {
    let all = |es: &[Expr]| es.iter().map(to_tree).collect::<Option<Vec<_>>>();
    let one = |e: &Expr| to_tree(e).map(Box::new);
    Some(match e {
        Expr::Num(n) => Tree::Num(n.to_f64()),
        Expr::Sym(s) => {
            let name = s.name();
            match leaf_of(&name) {
                Some((cell, math)) => Tree::Cell { cell, math },
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
        _ => return None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn placeholders_are_cell_leaves() {
        let t = Engine::new().parse_tree("cellN3 x + sin(cellN12)").unwrap();
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
        assert_eq!(e.parse_tree("").unwrap(), Tree::Sym(BLANK.into()));
        let back = e.import(&Tree::Sym(BLANK.into()));
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
    fn unsupported_shapes_are_errors() {
        let mut e = Engine::new();
        assert!(e.parse_tree("x = 2").is_err());
        assert!(e.parse_tree("(1, 2)").is_err());
    }
}

//! Engine R: math-expressions-rs, the engine the current DoenetML core uses
//! through wasm, linked natively behind [`SymEngine`]. Each handle is one
//! boxed `Expr` tree; nothing is shared or deduplicated, so a recomputed
//! expression always gets a new handle. Cell leaves are symbols named
//! `cellN<i>` (numeric) or `cellM<i>` (math), replaced by `substitute`.

use std::collections::HashMap;

use cells_sym::{Handle, SymEngine, Tree};
use math_expressions as me;
use me::{EqOptions, Expr, LatexOpts, Number, TextOpts, TextToAst, TextToAstOptions};

pub struct Mer {
    exprs: Vec<Expr>,
    /// Cell leaves of each imported template: (cell, is math).
    leaves: HashMap<Handle, Vec<(u32, bool)>>,
    parser: TextToAst,
    eq: EqOptions,
}

impl Default for Mer {
    fn default() -> Self {
        Self::new()
    }
}

impl Mer {
    pub fn new() -> Self {
        Mer {
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
            Tree::Num(v) => Expr::Num(Number::from_f64(*v)),
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
}

fn leaf_name(cell: u32, math: bool) -> String {
    format!("cell{}{cell}", if math { 'M' } else { 'N' })
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

impl SymEngine for Mer {
    fn name(&self) -> &'static str {
        "R"
    }

    fn import(&mut self, tree: &Tree) -> Handle {
        let mut leaves = Vec::new();
        let e = self.convert(tree, &mut leaves);
        let h = self.push(e);
        if !leaves.is_empty() {
            self.leaves.insert(h, leaves);
        }
        h
    }

    fn parse(&mut self, text: &str) -> Result<Handle, String> {
        let e = self.parser.convert(text).map_err(|e| e.to_string())?;
        Ok(self.push(e))
    }

    fn num(&mut self, v: f64) -> Handle {
        self.push(Expr::Num(Number::from_f64(v)))
    }

    fn instantiate(&mut self, template: Handle, cells: &[f64]) -> Handle {
        let Some(leaves) = self.leaves.get(&template) else {
            return template;
        };
        let mut subs = HashMap::with_capacity(leaves.len());
        for &(cell, math) in leaves {
            let v = cells[cell as usize];
            let e = if math && !v.is_nan() {
                self.exprs[v as usize].clone()
            } else {
                Expr::Num(Number::from_f64(v))
            };
            subs.insert(leaf_name(cell, math), e);
        }
        let e = me::substitute(&self.exprs[template as usize], &subs);
        self.push(e)
    }

    fn simplify(&mut self, h: Handle) -> Handle {
        let e = me::simplify(&self.exprs[h as usize]);
        self.push(e)
    }

    fn expand(&mut self, h: Handle) -> Handle {
        let e = me::expand(&self.exprs[h as usize]);
        self.push(e)
    }

    fn derivative(&mut self, h: Handle, var: &str) -> Handle {
        let e = me::derivative(&self.exprs[h as usize], var);
        self.push(e)
    }

    fn evaluate(&mut self, h: Handle, var: Option<(&str, f64)>) -> f64 {
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

    fn evaluate_many(&mut self, h: Handle, var: &str, xs: &[f64], out: &mut [f64]) {
        let ys = me::evaluate_many(&self.exprs[h as usize], var, xs);
        out.copy_from_slice(&ys[..out.len()]);
    }

    fn equals(&mut self, a: Handle, b: Handle) -> bool {
        me::equals(&self.exprs[a as usize], &self.exprs[b as usize], &self.eq)
    }

    fn equals_syntax(&mut self, a: Handle, b: Handle) -> bool {
        me::equals_syntactic(&self.exprs[a as usize], &self.exprs[b as usize], &self.eq)
    }

    fn has_symbols(&mut self, h: Handle) -> bool {
        !me::variables(&self.exprs[h as usize]).is_empty()
    }

    fn export(&self, h: Handle) -> Option<Tree> {
        to_tree(&self.exprs[h as usize])
    }

    fn text(&self, h: Handle) -> String {
        me::to_text(&self.exprs[h as usize], &TextOpts::default())
    }

    fn latex(&self, h: Handle) -> String {
        me::to_latex(&self.exprs[h as usize], &LatexOpts::default())
    }

    fn len(&self) -> usize {
        self.exprs.len()
    }

    /// Approximate: every node counted at the size of one `Expr`.
    fn heap_bytes(&self) -> usize {
        self.exprs.iter().map(count_nodes).sum::<usize>() * std::mem::size_of::<Expr>()
    }

    fn box_clone(&self) -> Box<dyn SymEngine> {
        Box::new(Mer {
            exprs: self.exprs.clone(),
            leaves: self.leaves.clone(),
            parser: TextToAst::new(TextToAstOptions::default()),
            eq: self.eq.clone(),
        })
    }
}

/// An R expression as a builder tree; cell leaves come back from their
/// `cellN<i>`/`cellM<i>` symbol names.
fn to_tree(e: &Expr) -> Option<Tree> {
    let all = |es: &[Expr]| es.iter().map(to_tree).collect::<Option<Vec<_>>>();
    let one = |e: &Expr| to_tree(e).map(Box::new);
    Some(match e {
        Expr::Num(n) => Tree::Num(n.to_f64()),
        Expr::Sym(s) => {
            let name = s.name();
            match (name.strip_prefix("cellN"), name.strip_prefix("cellM")) {
                (Some(c), _) => Tree::Cell {
                    cell: c.parse().ok()?,
                    math: false,
                },
                (_, Some(c)) => Tree::Cell {
                    cell: c.parse().ok()?,
                    math: true,
                },
                _ => Tree::Sym(name),
            }
        }
        Expr::Const(me::MathConst::Pi) => Tree::Sym("pi".into()),
        Expr::Const(me::MathConst::E) => Tree::Sym("e".into()),
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

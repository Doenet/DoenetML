//! Symbolic engines for the cells core, behind one interface.
//!
//! A math cell is an `f64` cell holding a [`Handle`]; the core never looks
//! inside an expression, it only calls the operations of [`SymEngine`]. Two
//! engines implement it: [`flat::Flat`] (engine A, a flat hash-consed arena
//! written for this prototype) and, in `cells-sym-mer`, math-expressions-rs
//! (engine R), which is also the behavior oracle. See `docs/history/plan-5.md`.

pub mod flat;
pub mod parse;
pub mod tape;

pub type Handle = u32;

/// An expression as the builder or the parser produces it, before it enters
/// an engine. `Cell` leaves name a cell: a numeric leaf (`math: false`) is
/// replaced by the cell's number on [`SymEngine::instantiate`], a math leaf by
/// the expression whose handle the cell holds.
#[derive(Debug, Clone, PartialEq)]
pub enum Tree {
    Num(f64),
    Sym(String),
    Cell {
        cell: u32,
        math: bool,
    },
    Add(Vec<Tree>),
    Mul(Vec<Tree>),
    Sub(Box<Tree>, Box<Tree>),
    Div(Box<Tree>, Box<Tree>),
    Neg(Box<Tree>),
    Pow(Box<Tree>, Box<Tree>),
    /// A named function applied to one argument: `sin(x)`.
    Apply(String, Box<Tree>),
}

/// Functions both engines know.
pub const FUNCTIONS: &[&str] = &["sin", "cos", "tan", "exp", "ln", "log", "sqrt", "abs"];

/// What the core needs from a symbolic engine. Handles stay valid for the
/// life of the engine; nothing is reclaimed.
pub trait SymEngine {
    fn name(&self) -> &'static str;
    /// Bring a builder tree in. Cell leaves are kept as leaves.
    fn import(&mut self, tree: &Tree) -> Handle;
    /// Parse math text (a `mathInput`'s value). No cell references.
    fn parse(&mut self, text: &str) -> Result<Handle, String> {
        let tree = parse::parse(text)?;
        Ok(self.import(&tree))
    }
    fn num(&mut self, v: f64) -> Handle;
    /// Replace every cell leaf with the cell's current value: a number, or
    /// the expression a math cell holds. A template without cell leaves
    /// returns itself.
    fn instantiate(&mut self, template: Handle, cells: &[f64]) -> Handle;
    fn simplify(&mut self, h: Handle) -> Handle;
    fn expand(&mut self, h: Handle) -> Handle;
    fn derivative(&mut self, h: Handle, var: &str) -> Handle;
    /// Evaluate to a real number with `var` bound; any other free symbol
    /// gives NaN.
    fn evaluate(&mut self, h: Handle, var: Option<(&str, f64)>) -> f64;
    /// Evaluate at many values of one variable (a curve's samples).
    fn evaluate_many(&mut self, h: Handle, var: &str, xs: &[f64], out: &mut [f64]) {
        for (x, o) in xs.iter().zip(out.iter_mut()) {
            *o = self.evaluate(h, Some((var, *x)));
        }
    }
    /// Mathematical equality, by numeric sampling.
    fn equals(&mut self, a: Handle, b: Handle) -> bool;
    /// Structural equality after reordering (`symbolicEquality`).
    fn equals_syntax(&mut self, a: Handle, b: Handle) -> bool;
    fn has_symbols(&mut self, h: Handle) -> bool;
    /// The expression as a builder tree, cell leaves included, for
    /// compiling (`tape::Tape`). `None` when it uses something a tree cannot
    /// say (sets, relations, a function of several arguments).
    fn export(&self, h: Handle) -> Option<Tree>;
    fn text(&self, h: Handle) -> String;
    fn latex(&self, h: Handle) -> String;
    /// Number of stored expression nodes (A) or expressions (R).
    fn len(&self) -> usize;
    fn is_empty(&self) -> bool {
        self.len() == 0
    }
    fn heap_bytes(&self) -> usize;
    fn box_clone(&self) -> Box<dyn SymEngine>;
}

impl Clone for Box<dyn SymEngine> {
    fn clone(&self) -> Self {
        self.box_clone()
    }
}

impl std::fmt::Debug for dyn SymEngine {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "SymEngine({}, {} nodes)", self.name(), self.len())
    }
}

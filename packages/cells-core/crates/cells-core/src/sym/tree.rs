//! An expression as the builder produces it, before it enters the engine.

/// An expression as the builder or the engine's `export` produces it. `Cell`
/// leaves name a cell: a numeric leaf (`math: false`) is replaced by the
/// cell's number on [`super::Engine::instantiate`], a math leaf by the
/// expression whose handle the cell holds.
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

/// Functions the tape knows (`tape.rs`), by the names the engine uses.
pub const FUNCTIONS: &[&str] = &["sin", "cos", "tan", "exp", "ln", "log", "sqrt", "abs"];

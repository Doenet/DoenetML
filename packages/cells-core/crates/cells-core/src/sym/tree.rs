//! An expression as the builder produces it, before it enters the engine.

/// What a tree's `Cell` leaves name, by stage: a reference plan id in the
/// compile's trees, a slot in a build's templates, a cell once rebound
/// (`CellIdx`), which is what [`super::Engine::instantiate`] reads. The
/// engine itself keeps a leaf as a symbol named by its number.
pub trait Leaf: Copy + PartialEq + std::fmt::Debug {
    fn raw(self) -> u32;
    fn from_raw(raw: u32) -> Self;
}

/// A leaf of no particular kind: the engine's own tests.
impl Leaf for u32 {
    fn raw(self) -> u32 {
        self
    }
    fn from_raw(raw: u32) -> u32 {
        raw
    }
}

impl Leaf for crate::document::CellIdx {
    fn raw(self) -> u32 {
        self.get()
    }
    fn from_raw(raw: u32) -> Self {
        Self::new(raw)
    }
}

/// An expression as the builder or the engine's `export` produces it. `Cell`
/// leaves name an `L`: a numeric leaf (`math: false`) is replaced by the
/// cell's number on [`super::Engine::instantiate`], a math leaf by the
/// expression whose handle the cell holds.
#[derive(Debug, Clone, PartialEq)]
pub enum Tree<L> {
    Num(f64),
    Sym(String),
    Cell {
        cell: L,
        math: bool,
    },
    Add(Vec<Tree<L>>),
    Mul(Vec<Tree<L>>),
    Sub(Box<Tree<L>>, Box<Tree<L>>),
    Div(Box<Tree<L>>, Box<Tree<L>>),
    Neg(Box<Tree<L>>),
    Pow(Box<Tree<L>>, Box<Tree<L>>),
    /// A named function applied to one argument: `sin(x)`.
    Apply(String, Box<Tree<L>>),
}

impl<L: Copy> Tree<L> {
    /// The same tree over other leaves: `f` maps each leaf, given whether
    /// it is a math leaf, to its new leaf and kind.
    pub fn try_map_leaves<M, E>(
        &self,
        f: &mut impl FnMut(L, bool) -> Result<(M, bool), E>,
    ) -> Result<Tree<M>, E> {
        let one = |t: &Tree<L>, f: &mut _| t.try_map_leaves(f).map(Box::new);
        Ok(match self {
            Tree::Num(v) => Tree::Num(*v),
            Tree::Sym(s) => Tree::Sym(s.clone()),
            Tree::Cell { cell, math } => {
                let (cell, math) = f(*cell, *math)?;
                Tree::Cell { cell, math }
            }
            Tree::Add(ts) => Tree::Add(
                ts.iter()
                    .map(|t| t.try_map_leaves(f))
                    .collect::<Result<_, _>>()?,
            ),
            Tree::Mul(ts) => Tree::Mul(
                ts.iter()
                    .map(|t| t.try_map_leaves(f))
                    .collect::<Result<_, _>>()?,
            ),
            Tree::Sub(a, b) => Tree::Sub(one(a, f)?, one(b, f)?),
            Tree::Div(a, b) => Tree::Div(one(a, f)?, one(b, f)?),
            Tree::Pow(a, b) => Tree::Pow(one(a, f)?, one(b, f)?),
            Tree::Neg(a) => Tree::Neg(one(a, f)?),
            Tree::Apply(name, a) => Tree::Apply(name.clone(), one(a, f)?),
        })
    }

    /// The same tree with each leaf mapped by `f`, keeping its kind.
    pub fn map_leaves<M>(&self, mut f: impl FnMut(L) -> M) -> Tree<M> {
        let r: Result<_, std::convert::Infallible> =
            self.try_map_leaves(&mut |l, math| Ok((f(l), math)));
        match r {
            Ok(t) => t,
        }
    }

    /// Each leaf with whether it is a math leaf, left to right.
    pub fn for_each_leaf(&self, f: &mut impl FnMut(L, bool)) {
        match self {
            Tree::Num(_) | Tree::Sym(_) => {}
            Tree::Cell { cell, math } => f(*cell, *math),
            Tree::Add(ts) | Tree::Mul(ts) => ts.iter().for_each(|t| t.for_each_leaf(f)),
            Tree::Sub(a, b) | Tree::Div(a, b) | Tree::Pow(a, b) => {
                a.for_each_leaf(f);
                b.for_each_leaf(f);
            }
            Tree::Neg(a) | Tree::Apply(_, a) => a.for_each_leaf(f),
        }
    }
}

/// Functions the tape knows (`tape.rs`), by the names the engine uses.
pub const FUNCTIONS: &[&str] = &["sin", "cos", "tan", "exp", "ln", "log", "sqrt", "abs"];

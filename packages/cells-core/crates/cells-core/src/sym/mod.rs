//! The symbolic side of math cells. A math cell is an `f64` cell holding a
//! [`Handle`] into the document's one [`Engine`], math-expressions-rs
//! (Doenet's own library, ADR 0011); the core never looks inside an
//! expression, it only calls the engine's operations. A builder [`Tree`]
//! enters the engine through [`Engine::import`]; its cell leaves become the
//! symbols `cellN<i>` (a numeric cell) and `cellM<i>` (a math cell), which
//! [`Engine::instantiate`] substitutes and [`Engine::export`] reads back.
//! The compiled curve tape (`tape.rs`) samples a constant-shape expression
//! without the engine.

pub mod engine;
pub mod tape;
pub mod tree;

pub use engine::Engine;
pub use tree::{Leaf, Tree};

crate::index::index_type! {
    /// An expression in the [`Engine`]: a position in its store. A math
    /// cell holds one as its `f64` value.
    pub struct Handle;
}

impl Handle {
    /// As a math cell's value.
    pub fn to_value(self) -> f64 {
        self.get() as f64
    }

    /// A math cell's value as the handle it holds. The caller has checked
    /// that it is one (not NaN, in the engine).
    pub fn from_value(v: f64) -> Handle {
        Handle::new(v as u32)
    }
}

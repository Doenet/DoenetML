//! The symbolic side of math cells. A math cell is an `f64` cell holding a
//! [`Handle`] into the document's one [`Engine`], math-expressions-rs
//! (Doenet's own library, ADR 0011); the core never looks inside an
//! expression, it only calls the engine's operations. A builder [`Tree`]
//! enters the engine through [`Engine::import`]; its cell leaves become the
//! symbols `cellN<i>` (a numeric cell) and `cellM<i>` (a math cell), which
//! [`Engine::instantiate`] substitutes and [`Engine::export`] reads back.
//! The compiled curve tape (`tape.rs`) samples a fixed-shape expression
//! without the engine.

pub mod engine;
pub mod tape;
pub mod tree;

pub use engine::Engine;
pub use tree::{FUNCTIONS, Tree};

pub type Handle = u32;

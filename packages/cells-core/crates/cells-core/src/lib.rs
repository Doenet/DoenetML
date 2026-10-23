//! A DoenetML core organized around a flat list of `f64` cells.
//!
//! Cells are the nodes of the dependency graph. Components and props are a
//! naming layer over cell indices. See `CONTEXT.md` at the repository root for
//! the vocabulary used throughout this crate.
//!
//! The modules, in pipeline order (`ARCHITECTURE.md` at the repository root
//! has the full map):
//!
//! - [`dast`]: the input, the parser's DAST in flat, columnar form.
//! - [`components`]: the tag vocabulary, meaning each type's props and where
//!   their values come from. The compile plans from it, and the component
//!   table names cells with it.
//! - `compile`: the source made, once per load, into the templates every
//!   build stamps, checked and with every failing element boxed (ADR 0015).
//! - [`session`]: what a session accumulates and every build reads.
//! - [`build`]: the compile stamped into cells and instructions at given
//!   iteration counts: expand (once per scope), emit.
//! - [`program`]: the instruction set the build emits and a tick runs
//!   (operators, their inverses, the scheduled instruction list).
//! - [`sym`]: the symbolic engine behind math cells (math-expressions-rs,
//!   ADR 0011), the builder's expression tree, and compiled curve tapes.
//! - `document`: the loaded [`Document`], with load and rebuild, the
//!   request entry points, and the read API a renderer or test uses.
//! - [`tick`]: run time. A request is snapped, inverted to essential cells,
//!   and recomputed.
//! - [`testing`]: the reference oracle and test helpers.
//! - [`trace`]: named spans over a load, for the benchmark's trace layer.

pub mod build;
mod compile;
pub mod components;
pub mod dast;
pub mod diagnostics;
mod document;
mod error;
pub mod limits;
mod profile;
pub mod program;
pub mod session;
pub mod sym;
pub mod testing;
pub mod tick;
pub mod trace;

// The API of a loaded document: load it, read it, send it requests.
pub use compile::lint::lint;
pub use compile::{Compiled, diagnose, lint};
pub use diagnostics::{Diagnostic, Kind as DiagnosticKind};
pub use document::{
    CellIdx, Child, CompIdx, ComponentTable, Document, LoadOptions, LoadTimings, NONE, TEXT_BIT,
};
pub use error::{Error, Result};
pub use program::ValueType;
pub use tick::eval::{DirtyClosure, Evaluator, FullRecompute, Recompute};
pub use tick::invert::PointRequest;
pub use tick::{Request, TickOutcome};

/// This build's release id (ADR 0017, step 6): the crate version and the
/// source revision. Saved state records it, and only a core with the same
/// id restores it.
pub const RELEASE: &str = env!("CELLS_CORE_RELEASE");

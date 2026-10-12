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
//!   their values come from. The build plans from it, and the component
//!   table names cells with it.
//! - [`build`]: DAST to cells and instructions, in three stages: `compile`
//!   (once per document), `expand` (once per scope), `emit`.
//! - [`program`]: the instruction set the build emits and a tick runs
//!   (operators, their inverses, the scheduled instruction list).
//! - `document`: the loaded [`Document`], with load and rebuild, the
//!   request entry points, and the read API a renderer or test uses.
//! - [`tick`]: run time. A request is snapped, inverted to essential cells,
//!   and recomputed.
//! - [`testing`]: the reference oracle and test helpers.

pub mod build;
pub mod components;
pub mod dast;
mod document;
mod error;
pub mod program;
pub mod testing;
pub mod tick;

// The API of a loaded document: load it, read it, send it requests.
pub use document::{
    CellIdx, Child, CompIdx, ComponentTable, Document, LoadOptions, LoadTimings, NONE, TEXT_BIT,
};
pub use error::{Error, Result};
pub use tick::eval::{DirtyClosure, Evaluator, FullRecompute};
pub use tick::invert::PointRequest;
pub use tick::{Request, TickOutcome};

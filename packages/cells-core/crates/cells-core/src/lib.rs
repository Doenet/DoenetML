//! A DoenetML core organized around a flat list of `f64` cells.
//!
//! Cells are the nodes of the dependency graph; components and props are a
//! naming layer over cell indices. The modules, in pipeline order:
//!
//! - [`dast`]: the input, the parser's DAST in flat, columnar form.
//! - [`components`]: the tag vocabulary: each type's props and where their
//!   values come from.
//! - `compile`: the source made, once per load, into the templates every
//!   build stamps.
//! - [`session`]: what a session accumulates and every build reads.
//! - [`build`]: the compile stamped into cells and instructions.
//! - [`program`]: the instruction set the build emits and a tick runs.
//! - [`sym`]: the symbolic engine behind math cells.
//! - `document`: the loaded [`Document`] and its request and read API.
//! - [`tick`]: run time: a request is inverted to essential cells and
//!   recomputed.
//! - `testing`: the reference oracle and test helpers (`testing` feature).
//! - [`trace`]: named spans over a load.

mod index;

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
#[cfg(feature = "testing")]
pub mod testing;
pub mod tick;
pub mod trace;

// The API of a loaded document: load it, read it, send it requests.
pub use compile::compare::{
    EditFailure, EditReport, compare_signatures, compare_versions, input_signature,
};
pub use compile::lint::lint;
pub use compile::{Compiled, diagnose, lint};
pub use diagnostics::{Diagnostic, Kind as DiagnosticKind};
pub use document::{
    CellIdx, Child, CompIdx, ComponentTable, Document, LoadOptions, LoadTimings, NONE, TEXT_BIT,
};
pub use error::{Error, Result};
pub use program::ValueType;
pub use tick::eval::{DirtyClosure, Recompute};
pub use tick::invert::PointRequest;
pub use tick::{Request, TickOutcome};

/// This build's release id: the crate version and the source revision.
/// Saved state records it, and only a core with the same id restores it.
pub const RELEASE: &str = env!("CELLS_CORE_RELEASE");

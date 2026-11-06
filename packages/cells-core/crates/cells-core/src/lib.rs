//! A DoenetML core organized around a flat list of `f64` cells.
//!
//! Cells are the nodes of the dependency graph; components and props are a
//! naming layer over cell indices.
//!
//! # The pipeline, by type
//!
//! Each stage is one function from the type above it to the type below it.
//! [`Document::load`] runs the build-time stages; [`Document::request`]
//! runs a tick.
//!
//! ```text
//!  bytes: the parser's DAST as JSON or binary
//!    │ dast::load
//!    ▼
//!  Dast           flat, columnar nodes and one string table
//!    │ compile::compile                                        once per load
//!    │   lint → outline → parse → plan → link → seal → share
//!    │   → check (stamps a TemplateGraph, reads it, drops it)
//!    ▼
//!  Compiled       { dast, plans: Plans { templates, .. },
//!    │              diagnostics }
//!    │ build::build(&Compiled, &Session,                       per structure
//!    │              &mut MathStore, &Counts)                         ▲
//!    │   expand → resolve → define → emit                            │
//!    ▼                                                               │
//!  BuildOutput    cells, Vec<Instr>, ComponentTable,                 │
//!    │            and the Session after the build                    │
//!    │ BuildOutput::schedule_built → Program::schedule               │
//!    ▼                                                               │
//!  Document       { built: Built { cells, program, components,       │
//!    │              .. }, session, math, loaded }                    │
//!    │ Document::request(&[Request]),                                │
//!    │ Document::request_points(&[PointRequest])                     │
//!    │   snap → invert → recompute                          per tick │
//!    │   a repeat's count changed: Document::rebuild ────────────────┘
//!    ▼
//!  TickOutcome    the cells that changed, the requests dropped,
//!                 whether it rebuilt
//! ```
//!
//! | Stage | Entry point | Takes | Makes |
//! |---|---|---|---|
//! | Parse | [`dast::load`] | wire-format bytes | [`Dast`](dast::Dast) |
//! | Compile | [`compile::compile`] | [`Dast`](dast::Dast) | [`Compiled`], holding [`Plans`](compile::plan::Plans) and a [`Template`](compile::plan::Template) per document, repeat body and choice branch |
//! | Check (in compile) | [`compile::graph::template_graph_checked`] | the plans | a [`TemplateGraph`](compile::graph::TemplateGraph), read for errors and port attributes |
//! | Build | [`build::build`] | [`Compiled`], [`Session`](session::Session), [`MathStore`](session::MathStore), [`Counts`](session::Counts) | [`BuildOutput`](build::BuildOutput) |
//! | Schedule | [`BuildOutput::schedule_built`](build::BuildOutput::schedule_built) | [`BuildOutput`](build::BuildOutput) | [`Built`] with its [`Program`](program::Program), and the next [`Session`](session::Session) |
//! | Load (all of the above) | [`Document::load`], [`Document::load_dast`] | bytes or a [`Dast`](dast::Dast) | [`Document`] |
//! | Tick | [`Document::request`], [`Document::request_points`] | [`Request`]s, [`PointRequest`]s | [`TickOutcome`] |
//! | Rebuild | [`Document::rebuild`] | the counts the count cells hold | a new [`Built`] |
//!
//! A renderer reads a document through its [`ComponentTable`]: each
//! component's type, name, children and the cell of each prop.
//! `ARCHITECTURE.md` has the full map and `CONTEXT.md` the vocabulary.
//!
//! # Modules, in pipeline order
//!
//! - [`dast`]: the input, the parser's DAST in flat, columnar form.
//! - [`components`]: the tag vocabulary: each type's props and where their
//!   values come from.
//! - [`compile`]: the source made, once per load, into the templates every
//!   build stamps.
//! - [`session`]: what a session accumulates and every build reads.
//! - [`build`]: the compile stamped into cells and instructions.
//! - [`program`]: the instruction set the build emits and a tick runs.
//! - [`sym`]: the symbolic engine behind math cells.
//! - [`document`]: the loaded [`Document`] and its request and read API.
//! - [`tick`]: run time: a request is inverted to essential cells and
//!   recomputed.
//! - [`testing`]: the reference oracle and test helpers (`testing` feature).
//! - [`trace`]: named spans over a load.

// These docs are read with private items (`npm run doc`), so public docs may
// link to private ones.
#![allow(rustdoc::private_intra_doc_links)]
// `pub` means the API: what `cells-wasm`, `cells-bench` and `tests/` may
// import. `pub(crate)` is the interface between stages and modules,
// `pub(in ..)` between a parent and its submodules. Inside a private module
// `pub` would compile as `pub(crate)` and read as API, so it is refused.
#![warn(unreachable_pub)]

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
    Built, CellIdx, Child, CompIdx, ComponentTable, Document, LoadOptions, LoadTimings, NONE,
    TEXT_BIT,
};
pub use error::{Error, Result};
pub use program::ValueType;
pub use tick::eval::{DirtyClosure, Recompute};
pub use tick::invert::PointRequest;
pub use tick::{Request, TickOutcome};

/// This build's release id: the crate version and the source revision.
/// Saved state records it, and only a core with the same id restores it.
pub const RELEASE: &str = env!("CELLS_CORE_RELEASE");

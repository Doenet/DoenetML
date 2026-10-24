//! The build stage (ADR 0015): the compile stamped into a document at given
//! iteration counts, reading the session. A load builds until the structure
//! settles, and so does a rebuild in a tick. A build finds no error the
//! compile did not (ADR 0014).
//!
//! **Expand** stamps templates into components. Each instance of a template
//! is a *scope*: scope 0 is the document, every iteration of a repeat is a
//! scope whose parent is the scope the repeat sits in. Scopes carry dense
//! tables (element -> component) so a reference plan resolves with array
//! reads: walk `hops` parents, index the element table, follow indices into
//! iteration scopes. Scope ids are stable for the session (the table only
//! grows), which is how essential values carry over: they are stored per
//! (scope, template slot).
//!
//! **Emit**: union-find over aliases makes cells; cells are numbered
//! (essential, then fixed, then derived); operators are bound; and
//! structural depth is measured. [`BuildOutput::schedule`] then orders the
//! instructions, with a fast path when creation order is already a valid
//! evaluation order.
//!
//! Files: **`expand/`**: `mod.rs` holds the builder's state and stamps
//! templates; `resolve.rs` follows reference plans, `math.rs` gives math
//! its source per instance, `choice.rs` picks and wires branches, and
//! `scoring.rs` wires credit and section numbers. **`emit.rs`** makes cells
//! and instructions. **`view.rs`** is the structure view, the one interface
//! through which expand and emit learn iteration counts, indexed referents,
//! a collect's count and a select's options. **`probe.rs`** is the probe,
//! the build through a view that folds every iteration into one, which the
//! compile's check runs (ADR 0012, ADR 0014). This file holds [`build`] and
//! what a build returns ([`BuildOutput`]); `structure.rs` what a build
//! records about the document's shape ([`Structure`], [`ScopeTable`],
//! [`Repeat`]); `coverage.rs`, for tests, checks that the probe's graph
//! covers a real build's.

use std::collections::{HashMap, HashSet};
use std::sync::Arc;

use crate::sym::{Engine, Handle, Tree};

use crate::compile::Failure;
use crate::compile::expr::{Arena, Expr, ExprId, Func};
use crate::compile::keys::pick_position;
use crate::compile::plan::*;
use crate::components::{ComponentType, prop};
use crate::dast::{NodeId, StrId, StringTable};
use crate::diagnostics::Diagnostic;
use crate::document::{CellIdx, CompIdx, ComponentTable, Document, NONE, TEXT_BIT};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;
use crate::program::{Instr, OpSpec, Post, SymKind};
use crate::program::{Program, Sym, ValueType};
use crate::session::{Counts, Session};

#[cfg(feature = "testing")]
pub mod coverage;
mod emit;
mod expand;
mod probe;
pub mod signature;
mod structure;
mod view;

pub(crate) use probe::probe;
pub use structure::{Repeat, ScopeId, ScopeTable, Structure};

type SlotId = u32;

use expand::*;
use probe::Coord;
use view::{CollectCount, Options, Plans, Stamped, View};

/// Expand, resolve, optionally run the probe's count and loop checks, and
/// emit, through `view`. The failure names the element to box.
pub(in crate::build) fn build_with(
    compiled: &Compiled,
    session: &Session,
    reseed: bool,
    engine: &mut Engine,
    view: &dyn View,
    probe_checks: bool,
) -> std::result::Result<BuildOutput, Failure> {
    let profile = crate::profile::enabled();
    let clock = web_time::Instant::now();
    let lap = |what: &str| {
        if profile {
            eprintln!("  build/{what}: {:.2?}", clock.elapsed());
        }
    };
    let mut b = Builder::new(compiled, session, reseed, engine, view);
    let staged = (|| {
        crate::trace::span("expand").run(|| b.expand_all())?;
        lap("expand");
        crate::trace::span("resolve").run(|| b.resolve_all())?;
        lap("resolve");
        if probe_checks {
            let _s = crate::trace::span("loop check");
            b.check_counts()?;
            b.check_loops()?;
        }
        Ok(())
    })();
    if let Err(error) = staged {
        return Err(Failure {
            error,
            node: b.failed_node,
        });
    }
    let u = {
        let _s = crate::trace::span("emit");
        let u = b.finish()?;
        crate::trace::count("cells", u.cells.len());
        crate::trace::count("instructions", u.instrs.len());
        crate::trace::count("components", u.components.len());
        u
    };
    lap("cells, program");
    Ok(u)
}

/// What can go wrong in a build (ADR 0014, ADR 0015): only that the
/// compile missed something, a core bug, which `tests/every_count.rs`
/// exists to catch. Never an author's error: the compile has boxed or
/// reported every one, a cycle included, and this type has no way to say
/// one. The machinery the build shares with the compile's check fails with
/// a `Failure`, a fact about the source; only the compile turns one into a
/// diagnostic.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum BuildError {
    /// Something the compile's check passed failed: an element, or the
    /// schedule, which found a cycle.
    #[error(
        "a build after the load found an error the load did not report, which the core must never let happen (ADR 0014): {0}"
    )]
    Unchecked(String),
}

impl From<BuildError> for Error {
    fn from(e: BuildError) -> Error {
        match e {
            BuildError::Unchecked(s) => Error::Unchecked(s),
        }
    }
}

/// A build (ADR 0015): the compile stamped with each repeat at its count
/// in `counts`, reading the session. It compiles nothing and finds no error
/// the compile did not (ADR 0014). With `reseed`, seeded cells take their
/// seeds again whatever the session carries: a later pass of a load.
pub fn build(
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
    reseed: bool,
) -> std::result::Result<BuildOutput, BuildError> {
    let view = Stamped { session, counts };
    let mut engine = session.engine.borrow_mut();
    let mut u = build_with(compiled, session, reseed, &mut engine, &view, false)
        .map_err(|f| BuildError::Unchecked(f.error.to_string()))?;
    drop(engine);
    u.add_compile_diagnostics(compiled);
    Ok(u)
}

/// The stamped build at no iteration that checks a document the probe
/// does not (one without repeats or selects, whose one build this is): its
/// failures name the element for the compile to box, and it runs the
/// probe's loop check, so a cycle is the compile's finding here too,
/// unless `check_loops` is off (a test load without the check).
pub(crate) fn first_build(
    compiled: &Compiled,
    session: &Session,
    check_loops: bool,
) -> std::result::Result<BuildOutput, Failure> {
    let counts = Counts::default();
    let view = Stamped {
        session,
        counts: &counts,
    };
    build_with(
        compiled,
        session,
        false,
        &mut session.engine.borrow_mut(),
        &view,
        check_loops,
    )
}

/// A built document whose program has not yet been scheduled.
pub struct BuildOutput {
    cells: Vec<f64>,
    n_essential: usize,
    n_fixed: usize,
    instrs: Vec<Instr>,
    components: ComponentTable,
    strings: StringTable,
    root: CompIdx,
    structure: Structure,
    /// The session after this build: its scopes, what is still parked.
    session: Session,
    operands: Vec<CellIdx>,
    value_types: Vec<ValueType>,
    tapes: Vec<crate::sym::tape::Tape>,
    /// Each component's element's stable key, `NONE` for one no element
    /// makes (a case): what the input signature names components by.
    comp_keys: Vec<ElemKey>,
    /// Human-readable owner of a cell, e.g. "p1.x". Computed lazily because
    /// a cycle error is the only consumer.
    cell_label: Box<dyn Fn(CellIdx) -> String>,
}

impl BuildOutput {
    /// Put the compile's diagnostics with the build's warnings, in node
    /// order: the build's list.
    pub(crate) fn add_compile_diagnostics(&mut self, compiled: &Compiled) {
        let mut list = compiled.diagnostics.clone();
        list.append(&mut self.structure.diagnostics);
        crate::diagnostics::sort(&mut list);
        self.structure.diagnostics = list;
    }

    /// The structural depth this build found (`Structure`).
    pub(crate) fn structural_depth(&self) -> u32 {
        self.structure.structural_depth
    }

    /// The build's own warnings.
    pub(crate) fn warnings(self) -> Vec<Diagnostic> {
        self.structure.diagnostics
    }

    /// Schedule the program, which computes with the session's engine.
    pub fn schedule(self, compiled: Arc<Compiled>) -> std::result::Result<Document, BuildError> {
        let n = self.cells.len();
        let sym = Sym::new(self.session.engine.clone());
        let program = match Program::schedule(self.instrs, n, sym, self.operands, self.value_types)
        {
            Ok(mut p) => {
                p.tapes = self.tapes;
                p
            }
            Err(cell) => {
                let cycle = Error::Cycle((self.cell_label)(cell));
                return Err(BuildError::Unchecked(cycle.to_string()));
            }
        };
        Ok(Document::new(
            self.cells,
            self.n_essential,
            self.n_fixed,
            program,
            self.components,
            self.strings,
            self.root,
            self.structure,
            self.session,
            compiled,
        ))
    }
}

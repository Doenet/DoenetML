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
//! (essential, then fixed, then derived); operators are bound; and the
//! instruction list is scheduled, with a fast path when creation order is
//! already a valid evaluation order.
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
//! [`Repeat`]).

use std::collections::{HashMap, HashSet};
use std::sync::Arc;

use crate::sym::{Engine, Handle, Tree};

use crate::compile::Failure;
use crate::compile::expr::{Arena, Expr, ExprId, Func};
use crate::compile::plan::*;
use crate::components::{ComponentType, prop};
use crate::dast::{NodeId, StrId, StringTable};
use crate::diagnostics::Diagnostic;
use crate::document::{CellIdx, CompIdx, ComponentTable, Document, NONE, TEXT_BIT};
use crate::error::{Error, Result};
use crate::program::VecOp;
use crate::program::{Instr, OpSpec, Post, SymKind};
use crate::program::{Program, Sym, ValueType};
use crate::session::{Counts, Session};

mod emit;
mod expand;
mod probe;
mod structure;
mod view;

pub(crate) use probe::probe;
pub use structure::{ElemKey, Repeat, ScopeId, ScopeTable, Structure};

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
    let profile = profile_enabled();
    let clock = web_time::Instant::now();
    let lap = |what: &str| {
        if profile {
            eprintln!("  build/{what}: {:.2?}", clock.elapsed());
        }
    };
    let mut b = Builder::new(compiled, session, reseed, engine, view);
    let staged = (|| {
        b.expand_all()?;
        lap("expand");
        b.resolve_all()?;
        lap("resolve");
        if probe_checks {
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
    let u = b.finish()?;
    lap("cells, program");
    Ok(u)
}

/// A build (ADR 0015): the compile stamped with each repeat at its count
/// in `counts`, reading the session. It compiles nothing and finds no error
/// the compile did not (ADR 0014); an element that fails is
/// `Error::Unchecked`. With `reseed`, seeded cells take their seeds again
/// whatever the session carries: a later pass of a load.
pub fn build(
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
    reseed: bool,
    engine: &mut Engine,
) -> Result<BuildOutput> {
    let view = Stamped { session, counts };
    let mut u =
        build_with(compiled, session, reseed, engine, &view, false).map_err(|f| match f.node {
            Some(_) => Error::Unchecked(f.error.to_string()),
            None => f.error,
        })?;
    u.add_compile_diagnostics(compiled);
    Ok(u)
}

/// The stamped build at no iteration that checks a document the probe
/// does not (one without repeats, or loaded without the cycle check): its
/// failures name the element for the compile to box.
pub(crate) fn first_build(
    compiled: &Compiled,
    session: &Session,
    engine: &mut Engine,
) -> std::result::Result<BuildOutput, Failure> {
    let counts = Counts::default();
    let view = Stamped {
        session,
        counts: &counts,
    };
    build_with(compiled, session, false, engine, &view, false)
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

    /// The build's own warnings.
    pub(crate) fn warnings(self) -> Vec<Diagnostic> {
        self.structure.diagnostics
    }

    /// Schedule the program, moving the symbolic engine the build used into
    /// it. On error the engine stays with the caller.
    pub fn schedule(self, compiled: Arc<Compiled>, engine: &mut Engine) -> Result<Document> {
        let n = self.cells.len();
        let sym = Sym::new(std::mem::take(engine));
        let program = match Program::schedule(self.instrs, n, sym, self.operands, self.value_types)
        {
            Ok(mut p) => {
                p.tapes = self.tapes;
                p
            }
            Err(e) => {
                let (cell, sym) = *e;
                *engine = sym.into_engine();
                return Err(Error::Cycle((self.cell_label)(cell)));
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

/// Whether `CELLS_BUILD_PROFILE` is set: per-phase build timings go to
/// stderr. Read once, on first use.
pub(crate) fn profile_enabled() -> bool {
    static PROFILE: std::sync::OnceLock<bool> = std::sync::OnceLock::new();
    *PROFILE.get_or_init(|| std::env::var_os("CELLS_BUILD_PROFILE").is_some())
}

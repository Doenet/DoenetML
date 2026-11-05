//! The build stage: the compile stamped into a document at given iteration
//! counts, reading the session. A build finds no error the compile did not.
//!
//! **Expand** stamps templates into components. Each instance of a template
//! is a *scope*: scope 0 is the document, every iteration of a repeat is a
//! scope whose parent is the scope the repeat sits in. Scopes carry dense
//! tables (element -> component) so a reference plan resolves with array
//! reads. Scope ids are stable for the session, so essential values carry
//! over per (scope, template slot).
//!
//! **Define**: union-find over aliases makes cells, and the author's
//! operators are oriented. **Emit**: cells are numbered (constants, then
//! essential, then derived) and operators are bound.
//! [`BuildOutput::schedule`] then orders the instructions.
//!
//! The *abstract build* is the build through a view that folds every
//! iteration into one, which the compile's check runs.

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
use crate::document::{CellIdx, ChildEntry, CompIdx, ComponentTable, Document, NONE};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;
use crate::program::{Instr, OpSpec, Post, SymKind};
use crate::program::{Operands, Program, ValueType};
use crate::session::{Counts, Session};

mod abstract_build;
#[cfg(feature = "testing")]
pub mod coverage;
mod emit;
mod expand;
mod live;
mod orient;
pub mod signature;
mod slot_cells;
mod structure;
mod view;
mod writable;

pub(crate) use abstract_build::{abstract_build, abstract_signature};
use slot_cells::SlotCells;
#[cfg(feature = "testing")]
pub use structure::SlotClass;
pub use structure::{Repeat, ScopeId, ScopeTable, Structure, TemplateSlot};

crate::index::index_type! {
    /// A build's slot: one prop of one stamped element, before emit gives it
    /// a cell (slots that alias share one). A position in the build's
    /// `sources`.
    pub(crate) struct SlotId;
}

impl crate::sym::Leaf for SlotId {
    fn raw(self) -> u32 {
        self.get()
    }
    fn from_raw(raw: u32) -> Self {
        Self::new(raw)
    }
}

use abstract_build::Coord;
use expand::*;
use view::{CollectCount, Options, Plans, View};

/// Expand, resolve, optionally run the abstract build's count and loop
/// checks, define, and emit, through `view`. Between define and emit,
/// `defined` reads the definitions: what the input signature is read off
/// (ADR 0035), since emit keeps nothing of them. The failure names the
/// element to box.
pub(in crate::build) fn build_with<T>(
    compiled: CompiledRef,
    session: &Session,
    reseed: bool,
    engine: &mut Engine,
    view: &View,
    abstract_checks: bool,
    defined: impl FnOnce(&Builder<'_>, &SlotCells) -> T,
) -> std::result::Result<(BuildOutput, T), Failure> {
    let mut b = Builder::new(compiled, session, reseed, engine, view);
    let staged = (|| {
        crate::trace::span("expand").run(|| b.expand_all())?;
        crate::trace::span("resolve").run(|| b.resolve_all())?;
        if abstract_checks {
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
    let slot_cells = crate::trace::span("define").run(|| b.define())?;
    let read = defined(&b, &slot_cells);
    let u = {
        let _s = crate::trace::span("emit");
        let u = b.emit(slot_cells)?;
        crate::trace::count("cells", u.cells.len());
        crate::trace::count("instructions", u.instrs.len());
        crate::trace::count("components", u.components.len());
        u
    };
    Ok((u, read))
}

impl<'c> Builder<'c> {
    /// Walk backward over the cells the slots will make: from the cells on
    /// `stack`, each cell `enter` admits is given to `edge` as its
    /// definition, then as each other source its slots have (its later
    /// sources and `extra`), and `edge` pushes the cells to go on to. A cell
    /// `enter` refuses is neither followed nor seen.
    pub(in crate::build) fn walk_cells(
        &self,
        slot_cells: &SlotCells,
        mut stack: Vec<SlotId>,
        extra: &[(SlotId, BuiltSource)],
        mut enter: impl FnMut(SlotId) -> bool,
        mut edge: impl FnMut(slot_cells::Def<'_>, &mut Vec<SlotId>),
    ) {
        let mut seen = vec![false; self.sources.len()];
        // The other sources of each cell.
        let mut besides: HashMap<SlotId, Vec<&(SlotId, BuiltSource)>> = HashMap::new();
        for entry in self.later_sources.iter().chain(extra) {
            besides
                .entry(slot_cells.cell_of(entry.0))
                .or_default()
                .push(entry);
        }
        while let Some(cell) = stack.pop() {
            if std::mem::replace(&mut seen[cell.index()], true) || !enter(cell) {
                continue;
            }
            let def = slot_cells.def(cell);
            edge(
                slot_cells.def_of(self, def, &self.sources[def.index()]),
                &mut stack,
            );
            if let Some(entries) = besides.get(&cell) {
                for (slot, src) in entries {
                    edge(slot_cells.def_of(self, *slot, src), &mut stack);
                }
            }
        }
    }
}

/// What can go wrong in a build: only that the compile missed something,
/// a core bug. Never an author's error.
#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum BuildError {
    /// Something the compile's check passed failed: an element, or the
    /// schedule, which found a cycle.
    #[error(
        "a build after the load found an error the load did not report, which the core must never let happen: {0}"
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

/// A build: the compile stamped with each repeat at its count in `counts`,
/// reading the session. It finds no error the compile did not. With
/// `reseed`, seeded cells take their seeds again whatever the session
/// carries: a later pass of a load.
pub fn build(
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
    reseed: bool,
) -> std::result::Result<BuildOutput, BuildError> {
    let view = View::Stamped { counts };
    let mut engine = session.engine.borrow_mut();
    build_with(
        compiled.view(),
        session,
        reseed,
        &mut engine,
        &view,
        false,
        |_, _| (),
    )
    .map(|(u, ())| u)
    .map_err(|f| BuildError::Unchecked(f.error.to_string()))
}

/// A cell's human-readable owner, read from the compile's source, which
/// the closure is handed rather than keeping.
type CellLabel = Box<dyn Fn(CellIdx, &crate::dast::Dast) -> String>;

/// A built document whose program has not yet been scheduled.
pub struct BuildOutput {
    cells: Vec<f64>,
    n_essential: usize,
    n_const: usize,
    instrs: Vec<Instr>,
    components: ComponentTable,
    strings: StringTable,
    root: CompIdx,
    structure: Structure,
    /// The session after this build: its scopes, what is still parked.
    session: Session,
    operands: Operands,
    value_types: Vec<ValueType>,
    tapes: Vec<crate::sym::tape::Tape>,
    /// The cells a `fixed` holds.
    holds: crate::program::Holds,
    /// Each component's element's stable key, `NONE` for one no element
    /// makes (a case).
    comp_keys: Vec<ElemKey>,
    /// Human-readable owner of a cell, e.g. "p1.x".
    cell_label: CellLabel,
    /// Which cells the document computes.
    live: Live,
    /// What the abstract build found for the compile to keep: empty in any
    /// other build.
    findings: AbstractFindings,
}

/// What the abstract build found for the compile to keep: what every
/// later build reads, and the warnings.
#[derive(Debug, Default)]
pub(crate) struct AbstractFindings {
    /// The structural depth.
    pub(crate) structural_depth: u32,
    /// The template slots a student's action can write.
    pub(crate) writable: Record,
    /// The live template slots.
    pub(crate) live: Record,
    /// The counted values' template slots.
    pub(crate) counted: Record,
    /// The document constants' template slots.
    pub(crate) document_constants: Record,
    /// The warnings.
    pub(crate) warnings: Vec<Diagnostic>,
}

/// Which cells a build computes: a bit per cell, set for one some output
/// or the core itself reads.
#[derive(Debug, Clone, Default)]
pub(crate) struct Live {
    pub(crate) cells: Vec<u64>,
    /// The same by this build's own walk, whatever the record says.
    #[cfg(feature = "testing")]
    pub(crate) walked: Vec<u64>,
}

impl BuildOutput {
    /// Whether cell `i` is essential: the essential cells follow the
    /// constants.
    pub(crate) fn is_essential(&self, i: usize) -> bool {
        (self.n_const..self.n_const + self.n_essential).contains(&i)
    }

    /// Whether cell `i` is a constant: the constants come first.
    pub(crate) fn is_const(&self, i: usize) -> bool {
        i < self.n_const
    }

    /// What the abstract build found, which the compile keeps.
    pub(crate) fn abstract_findings(self) -> AbstractFindings {
        self.findings
    }

    /// Schedule the program into a document.
    pub fn schedule(self, compiled: Arc<Compiled>) -> std::result::Result<Document, BuildError> {
        let n = self.cells.len();
        let program = match Program::schedule(self.instrs, n, self.operands) {
            Ok(mut p) => {
                p.tapes = self.tapes;
                p.holds = self.holds;
                p
            }
            Err(cell) => {
                let cycle = Error::Cycle((self.cell_label)(cell, &compiled.dast));
                return Err(BuildError::Unchecked(cycle.to_string()));
            }
        };
        Ok(Document::new(
            self.cells,
            self.n_essential,
            self.n_const,
            self.value_types,
            program,
            self.components,
            self.strings,
            self.root,
            self.structure,
            self.session,
            compiled,
            self.live,
        ))
    }
}

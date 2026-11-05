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
//! **Define**: union-find over aliases makes cells, the author's operators
//! are oriented, and every cell is classed. **Emit**: cells are numbered
//! (constants, then essential, then derived) and operators are bound.
//! [`BuildOutput::schedule`] then orders the instructions.
//!
//! The *abstract build* is expand, resolve and define through a view that
//! folds every iteration into one, which the compile's check runs; it
//! makes no program (ADR 0035).

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
use crate::session::{Counts, MathStore, Session};

mod abstract_build;
#[cfg(feature = "testing")]
pub mod coverage;
mod define;
mod emit;
mod expand;
mod live;
mod orient;
mod refuse;
pub mod signature;
mod slot_cells;
mod structure;
mod view;
mod writable;

pub(crate) use abstract_build::{abstract_build, abstract_signature};
use define::Defined;
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

impl<'c> Builder<'c> {
    /// Expand and resolve, and with `abstract_checks` run the abstract
    /// build's count and loop checks. The failure names the element to
    /// box.
    pub(in crate::build) fn stage(
        &mut self,
        abstract_checks: bool,
    ) -> std::result::Result<(), Failure> {
        let staged = (|| {
            crate::trace::span("expand").run(|| self.expand_all())?;
            crate::trace::span("resolve").run(|| self.resolve_all())?;
            if abstract_checks {
                let _s = crate::trace::span("loop check");
                self.check_counts()?;
                self.check_loops()?;
            }
            Ok(())
        })();
        staged.map_err(|error| Failure {
            error,
            node: self.failed_node,
        })
    }
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
    math: &mut MathStore,
    counts: &Counts,
    reseed: bool,
) -> std::result::Result<BuildOutput, BuildError> {
    let view = View::Stamped { counts };
    let mut b = Builder::new(compiled.view(), session, reseed, math, &view);
    let built = (|| {
        b.stage(false)?;
        let slot_cells = crate::trace::span("define").run(|| b.define())?;
        let defined = Defined::by_attributes(&b, slot_cells);
        let _s = crate::trace::span("emit");
        let u = b.emit(defined)?;
        crate::trace::count("cells", u.cells.len());
        crate::trace::count("instructions", u.instrs.len());
        crate::trace::count("components", u.components.len());
        Ok(u)
    })();
    built.map_err(|f: Failure| BuildError::Unchecked(f.error.to_string()))
}

/// Which slot defines each cell and which component owns each slot: what
/// a cell's human-readable owner is read from, with the build's own
/// components and strings.
struct CellOwners {
    /// The slot defining each cell; `NONE` for a pooled constant.
    cell_def_slot: Vec<SlotId>,
    /// The component owning each slot; `NONE` for an anonymous one.
    slot_comp: Vec<CompIdx>,
    /// Each component's first slot.
    slot_base: Vec<SlotId>,
}

impl CellOwners {
    /// The owner of `cell`, e.g. "p1.x".
    fn label(&self, cell: CellIdx, components: &ComponentTable, strings: &StringTable) -> String {
        let slot = self.cell_def_slot[cell.index()];
        if slot == SlotId::NONE {
            return "(a pooled constant)".to_string();
        }
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return "(anonymous cell)".to_string();
        }
        let pi = slot.index() - self.slot_base[comp.index()].index();
        let component_type = components.component_type[comp.index()];
        let owner = match components.name[comp.index()] {
            StrId::NONE => format!("<{}>#{}", component_type.tag(), comp),
            s => strings.get(s).trim().to_string(),
        };
        let n_public = components.comp_cells(comp).len();
        match component_type.prop_name(n_public, pi) {
            Some(name) => format!("{owner}.{name}"),
            None => format!("{owner}.(hidden slot {pi})"),
        }
    }
}

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
    /// What a cell's owner is read from, for a cycle's error.
    owners: CellOwners,
    /// Which cells the document computes.
    live: Live,
}

/// What the abstract build found for the compile to keep: what every
/// later build reads, and the warnings.
#[derive(Debug)]
pub(crate) struct AbstractFindings {
    /// The structural depth.
    pub(crate) structural_depth: u32,
    /// What it found of each port, per template by template slot: which a
    /// student's action can write, which are live, counted values and
    /// document constants.
    pub(crate) attrs: Vec<Vec<PortAttrs>>,
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
    /// Schedule the program into a document of `compiled` that owns
    /// `math`, the math this build was lent.
    pub fn schedule(
        self,
        compiled: Arc<Compiled>,
        math: MathStore,
    ) -> std::result::Result<Document, BuildError> {
        let (built, session) = self.schedule_built()?;
        Ok(Document::new(
            built,
            session,
            math,
            crate::document::Loaded::of(compiled),
        ))
    }

    /// Schedule the program: what the build made, as a document holds it,
    /// and the session the build returned. For a caller that keeps the
    /// math it lent the build itself, rather than in a document.
    pub fn schedule_built(
        self,
    ) -> std::result::Result<(crate::document::Built, Session), BuildError> {
        let n = self.cells.len();
        let program = match Program::schedule(self.instrs, n, self.operands) {
            Ok(mut p) => {
                p.tapes = self.tapes;
                p.holds = self.holds;
                p
            }
            Err(cell) => {
                let owner = self.owners.label(cell, &self.components, &self.strings);
                let cycle = Error::Cycle(owner);
                return Err(BuildError::Unchecked(cycle.to_string()));
            }
        };
        let built = crate::document::Built::new(
            self.cells,
            self.n_essential,
            self.n_const,
            self.value_types,
            program,
            self.components,
            self.strings,
            self.root,
            self.structure,
            &self.session,
            self.live,
        );
        Ok((built, self.session))
    }
}

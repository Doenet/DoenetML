//! Build a [`Document`] from a flat DAST: compile the document's templates,
//! expand them into components, resolve references, merge aliased props into
//! shared cells, and emit the instruction list.
//!
//! The build has three stages, one module each.
//!
//! **Compile** walks the DAST once and produces one [`Template`] per repeat
//! (plus one for the document itself). A template holds, per element, the
//! type, the name, and a *plan* for every prop: a parsed literal, a default,
//! an operator over reference plans, or a reference plan. A reference plan
//! is a path resolved against the template nesting: how many template levels
//! up the name was found, which element it is, which `[index]` expressions
//! select iterations, which prop. Nothing in a plan depends on which
//! iteration it will be instantiated in, so all string work (tag and
//! attribute matching, literal parsing, name lookup) happens once per
//! template element rather than once per iteration.
//!
//! **Expand** stamps templates into components. Each instance of a template
//! is a *scope*: scope 0 is the document, every iteration of a repeat is a
//! scope whose parent is the scope the repeat sits in. Scopes carry dense
//! tables (element -> component) so a reference plan resolves with array
//! reads: walk `hops` parents, index the element table, follow indices into
//! iteration scopes. Scope ids are stable across rebuilds of one document
//! (the table only grows), which is how iteration counts and essential
//! values carry over: both are stored per (scope, template slot).
//!
//! **Emit**: union-find over aliases makes cells; cells are numbered
//! (essential, then fixed, then derived); operators are bound; and the
//! instruction list is scheduled, with a fast path when creation order is
//! already a valid evaluation order.
//!
//! **`compile/`**: `mod.rs` walks the DAST and decides each element's
//! shape; `attrs.rs` plans attribute and math sources, `refs.rs` names and
//! reference paths, `expr.rs` the parse arena for math text, `geometry/` the
//! planned types, `choice.rs` with `condition.rs` the choices, `copies.rs`
//! `extend`, and `fix.rs` `fixed`. What compile produces is in `plan.rs`.
//! **`expand/`**: `mod.rs` holds the builder's state and stamps templates;
//! `resolve.rs` follows reference plans, `math.rs` gives math its source per
//! instance, `choice.rs` picks and wires branches, and `scoring.rs` wires
//! credit and section numbers. **`emit.rs`** makes cells and instructions.
//!
//! This file holds the entry point, [`build`], what it returns
//! ([`BuildOutput`]) and what one build hands the next ([`Carryover`]);
//! `structure.rs` holds what a build records about the document's shape
//! ([`Structure`], [`ScopeTable`], [`Repeat`]).

use std::collections::HashMap;

use cells_sym::{SymEngine, Tree};

use crate::components::{ComponentType, PropFrom, prop};
use crate::dast::{Dast, NodeId, NodeKind, StrId, StringTable};
use crate::document::{CellIdx, CompIdx, ComponentTable, Document, NONE, TEXT_BIT};
use crate::error::{Error, Result};
use crate::program::{Instr, OpSpec, Post, SymKind};
use crate::program::{Pivot, RigidOpts, VecOp};
use crate::program::{Program, Sym};
use compile::expr::{Arena, Expr, ExprId, Func, Parser, Token};

mod compile;
mod emit;
mod expand;
mod structure;

pub use structure::{Repeat, ScopeId, ScopeTable, Structure};

type SlotId = u32;
type TemplateId = usize;
type ElemId = usize;
type RefId = usize;
type ChoiceId = usize;

use compile::Compiler;
use compile::plan::*;
use expand::*;

/// Build with `engine` holding the document's expressions (the same engine
/// across rebuilds, so essential math cells keep valid handles).
pub fn build(
    dast: &Dast,
    carryover: &Carryover,
    engine: &mut dyn SymEngine,
) -> Result<BuildOutput> {
    let profile = std::env::var_os("CELLS_BUILD_PROFILE").is_some();
    let clock = web_time::Instant::now();
    let lap = |what: &str| {
        if profile {
            eprintln!("  build/{what}: {:.2?}", clock.elapsed());
        }
    };
    let compiled = Compiler::compile(dast)?;
    lap("compile");
    let mut b = Builder::new(&compiled, carryover, engine);
    b.expand_all()?;
    lap("expand");
    b.resolve_all()?;
    lap("resolve");
    let u = b.finish()?;
    lap("cells, program");
    Ok(u)
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
    operands: Vec<CellIdx>,
    is_math: Vec<bool>,
    tapes: Vec<cells_sym::tape::Tape>,
    /// Human-readable owner of a cell, e.g. "p1.x". Computed lazily because
    /// a cycle error is the only consumer.
    cell_label: Box<dyn Fn(CellIdx) -> String>,
}

impl BuildOutput {
    /// Schedule the program, moving the symbolic engine the build used into
    /// it. On error the engine stays with the caller.
    pub fn schedule(
        self,
        dast: std::sync::Arc<Dast>,
        engine: &mut Box<dyn SymEngine>,
    ) -> Result<Document> {
        let n = self.cells.len();
        let sym = Sym::new(std::mem::replace(
            engine,
            Box::new(cells_sym::flat::Flat::new()),
        ));
        let program = match Program::schedule(self.instrs, n, sym, self.operands, self.is_math) {
            Ok(mut p) => {
                p.tapes = self.tapes;
                p
            }
            Err((cell, sym)) => {
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
            dast,
        ))
    }
}

// ---------------------------------------------------------------------------
// Carryover: what earlier builds of the same document contribute
// ---------------------------------------------------------------------------

/// Carried from one build of a document to the next: the stable scope table,
/// each repeat instance's iteration count, and every essential value ever
/// held, stored per (scope, template slot) so an iteration that disappears
/// and reappears comes back as it was left.
#[derive(Debug, Clone, Default)]
pub struct Carryover {
    /// The last build's structure: its scope table, seed and options, and in
    /// `essential_values` every essential value it held.
    structure: Structure,
    counts: HashMap<(ScopeId, NodeId), u32>,
}

impl Carryover {
    /// The carryover of a first build.
    pub fn new(seed: u64, sample_with_engine: bool) -> Carryover {
        Carryover {
            structure: Structure {
                seed,
                sample_with_engine,
                ..Structure::default()
            },
            counts: HashMap::new(),
        }
    }

    /// Build a carryover from a document, moving its structure out (the
    /// document is about to be replaced). `restore` puts it back on error.
    pub fn take_from(doc: &mut Document) -> Carryover {
        let counts = doc
            .structure
            .repeats
            .iter()
            .map(|r| ((r.scope, r.node), doc.repeat_count(r)))
            .collect();
        let mut structure = std::mem::take(&mut doc.structure);
        structure
            .essential_values
            .resize(structure.scopes.len(), Vec::new());
        for (&(scope, slot), &v) in structure
            .essential_slots
            .iter()
            .zip(&doc.cells[..doc.n_essential])
        {
            let row = &mut structure.essential_values[scope as usize];
            if row.len() <= slot as usize {
                row.resize(slot as usize + 1, None);
            }
            row[slot as usize] = Some(v);
        }
        Carryover { structure, counts }
    }

    pub fn restore(self, doc: &mut Document) {
        doc.structure = self.structure;
    }
}

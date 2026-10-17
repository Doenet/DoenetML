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
//! **`view.rs`** is the structure view, the one interface through which
//! expand and emit learn iteration counts, indexed referents, a collect's
//! count and a select's options. **`cycles.rs`** is the count-independent
//! cycle check (ADR 0012): a build through the probe view, run once per load
//! before the real one.
//!
//! This file holds the entry point, [`build`], what it returns
//! ([`BuildOutput`]) and what one build hands the next ([`Carryover`]);
//! `structure.rs` holds what a build records about the document's shape
//! ([`Structure`], [`ScopeTable`], [`Repeat`]).

use std::collections::{HashMap, HashSet};

use crate::sym::{Engine, Handle, Tree};

use crate::components::{ComponentType, PropFrom, prop};
use crate::dast::{Dast, NodeId, NodeKind, StrId, StringTable};
use crate::diagnostics::Diagnostic;
use crate::document::{CellIdx, CompIdx, ComponentTable, Document, NONE, TEXT_BIT};
use crate::error::{Error, Result};
use crate::program::{Instr, OpSpec, Post, SymKind};
use crate::program::{Pivot, RigidOpts, VecOp};
use crate::program::{Program, Sym, ValueType};
use compile::expr::{Arena, Expr, ExprId, Func, Parser, Token};

mod compile;
mod cycles;
mod emit;
mod expand;
mod structure;
mod view;

pub use structure::{Repeat, ScopeId, ScopeTable, Structure};

type SlotId = u32;
type TemplateId = usize;
type ElemId = usize;
type RefId = usize;
type ChoiceId = usize;

use compile::Compiler;
use compile::plan::*;
use cycles::Coord;
use expand::*;
use view::{CollectCount, Options, Plans, Stamped, View};

/// A failed compile, expand or resolve: the error, and the node of the
/// element it is about when there is one. `build` boxes that element (it
/// becomes an `_error` component, the error its diagnostic) and builds
/// again; an error with no element fails the build (ADR 0013).
pub(in crate::build) struct Failure {
    pub(in crate::build) error: Error,
    pub(in crate::build) node: Option<NodeId>,
}

impl From<Failure> for Error {
    fn from(f: Failure) -> Error {
        f.error
    }
}

/// Expand, resolve, optionally run the probe's count and loop checks, and
/// emit, through `view`. The failure names the element to box.
pub(in crate::build) fn build_with(
    compiled: &Compiled,
    carryover: &Carryover,
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
    let mut b = Builder::new(compiled, carryover, engine, view);
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
    let u = b.finish().map_err(|error| Failure { error, node: None })?;
    lap("cells, program");
    Ok(u)
}

/// Compile and build through `view`, boxing every element that fails
/// until every element builds (ADR 0013). `list` holds the boxes an
/// earlier build found (their error diagnostics, each with a node) and
/// receives the whole list on return: the lint findings, the boxed
/// errors and the builder's warnings, sorted by node. With
/// `cycle_check`, a document with repeats is first checked through the
/// probe (ADR 0012), which can box too. A failure with no element to box
/// (a cycle) ends the build: it is pushed to `list` without a node and
/// returned.
fn build_boxing(
    dast: &Dast,
    carryover: &Carryover,
    engine: &mut Engine,
    view: &dyn View,
    probe_checks: bool,
    cycle_check: bool,
    list: &mut Vec<Diagnostic>,
) -> Result<BuildOutput> {
    let profile = profile_enabled();
    list.retain(|d| d.kind == crate::diagnostics::Kind::Error && d.node.is_some());
    let mut boxed: HashSet<NodeId> = list.iter().filter_map(|d| d.node).collect();
    let mut found = crate::lint::lint(dast);
    let outcome = loop {
        let clock = web_time::Instant::now();
        let attempt = Compiler::compile(dast, &boxed).and_then(|compiled| {
            if profile {
                eprintln!("  build/compile: {:.2?}", clock.elapsed());
            }
            let mut checked = std::time::Duration::ZERO;
            if cycle_check && compiled.has_repeats() {
                let clock = web_time::Instant::now();
                cycles::check(&compiled, carryover)?;
                checked = clock.elapsed();
                if profile {
                    eprintln!("  build/cycle check: {checked:.2?}");
                }
            }
            let mut u = build_with(&compiled, carryover, engine, view, probe_checks)?;
            u.cycle_check = checked;
            Ok(u)
        });
        match attempt {
            Ok(u) => break Ok(u),
            Err(f) => {
                let node = f.node.filter(|n| boxed.insert(*n));
                list.push(Diagnostic::error(node, &f.error));
                if node.is_none() {
                    break Err(f.error);
                }
            }
        }
    };
    if let Ok(u) = &outcome {
        found.extend(u.structure.diagnostics.iter().cloned());
    }
    list.append(&mut found);
    crate::diagnostics::sort(list);
    outcome
}

/// Build with `engine` holding the document's expressions (the same engine
/// across rebuilds, so essential math cells keep valid handles). With
/// `check_cycles`, a document with repeats is first checked for loops that
/// close at some iteration count (ADR 0012); the templates never change,
/// so a load does this once, on its first pass.
///
/// An element that cannot be built does not fail the build: it is boxed
/// (an `_error` component) and the build runs again, until every element
/// builds or one fails without an element to box, such as a cycle
/// (ADR 0013). The output's diagnostics are the lint findings, the boxed
/// errors and the warnings of the elements that built, in node order,
/// and they seed the boxes of the next build of the document.
pub fn build(
    dast: &Dast,
    carryover: &Carryover,
    engine: &mut Engine,
    check_cycles: bool,
) -> Result<BuildOutput> {
    let mut list = carryover.structure.diagnostics.clone();
    let view = Stamped(carryover);
    let mut u = build_boxing(
        dast,
        carryover,
        engine,
        &view,
        false,
        check_cycles,
        &mut list,
    )?;
    u.structure.diagnostics = list;
    Ok(u)
}

/// Every diagnostic of the document, from one build through the
/// exhaustive view (ADR 0013): one iteration per repeat, every option of
/// every select, every branch of every choice. The list is a function of
/// the DAST alone: the same at every seed, every iteration count, with
/// any state. A load never calls this; the language server does.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let carryover = Carryover::new(0, false);
    let mut engine = Engine::new();
    let view = cycles::Probe::exhaustive();
    let mut list = Vec::new();
    // A failure is in the list; the build itself is not wanted.
    let _ = build_boxing(dast, &carryover, &mut engine, &view, true, false, &mut list);
    list
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
    value_types: Vec<ValueType>,
    tapes: Vec<crate::sym::tape::Tape>,
    /// Human-readable owner of a cell, e.g. "p1.x". Computed lazily because
    /// a cycle error is the only consumer.
    cell_label: Box<dyn Fn(CellIdx) -> String>,
    /// Time the count-independent cycle check took; zero when it did not run.
    pub cycle_check: std::time::Duration,
}

impl BuildOutput {
    /// Schedule the program, moving the symbolic engine the build used into
    /// it. On error the engine stays with the caller.
    pub fn schedule(self, dast: std::sync::Arc<Dast>, engine: &mut Engine) -> Result<Document> {
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
    /// Strings interned since load (`Document::intern`), appended again
    /// after the new build's static table so the ids text cells hold stay
    /// valid; see `Document::n_static_strings`.
    runtime_strings: Vec<String>,
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
            runtime_strings: Vec::new(),
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
        // Never shrink: `restore_state` may have parked values for scopes
        // the table has not made yet.
        if structure.essential_values.len() < structure.scopes.len() {
            structure
                .essential_values
                .resize(structure.scopes.len(), Vec::new());
        }
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
        let runtime_strings = (doc.n_static_strings..doc.strings.len())
            .map(|i| doc.strings.get(i as StrId).to_string())
            .collect();
        Carryover {
            structure,
            counts,
            runtime_strings,
        }
    }

    /// Stamp repeat element `node` in `scope` with `n` iterations on the
    /// next build, whatever its `count` cell says: building a document at a
    /// chosen count (`tests/every_count.rs`).
    pub fn set_count(&mut self, scope: ScopeId, node: NodeId, n: u32) {
        self.counts.insert((scope, node), n);
    }

    pub fn restore(self, doc: &mut Document) {
        doc.structure = self.structure;
    }

    /// Append the runtime strings to a freshly built document's table, so
    /// an interned id means the same text it did before the rebuild.
    pub fn restore_strings(&self, doc: &mut Document) {
        for s in &self.runtime_strings {
            doc.strings.push(s);
        }
    }
}

/// Whether `CELLS_BUILD_PROFILE` is set: per-phase build timings go to
/// stderr. Read once, on first use.
pub(crate) fn profile_enabled() -> bool {
    static PROFILE: std::sync::OnceLock<bool> = std::sync::OnceLock::new();
    *PROFILE.get_or_init(|| std::env::var_os("CELLS_BUILD_PROFILE").is_some())
}

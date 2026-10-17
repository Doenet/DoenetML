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
//! This file holds the entry points (ADR 0015): [`compile`], once per
//! load, and [`build`], at load and on every structural change, and what a
//! build returns ([`BuildOutput`]). `session.rs` holds what survives every
//! build ([`Session`]) and the counts a build stamps ([`Counts`]);
//! `structure.rs` what a build records about the document's shape
//! ([`Structure`], [`ScopeTable`], [`Repeat`]).

use std::collections::{HashMap, HashSet};
use std::sync::Arc;

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
mod session;
mod structure;
mod view;

pub use compile::plan::Compiled;
pub use session::{Counts, Session};
pub use structure::{ElemKey, Repeat, ScopeId, ScopeTable, Structure};

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

/// Compile and build through `view`, boxing every element that fails
/// until every element builds (ADR 0013). With `cycle_check`, a document
/// with repeats is first checked through the probe (ADR 0012), which can
/// box too, and the stamped build after it may not (ADR 0014). Returns the
/// compile, the build, and the source's diagnostics (the lint findings and
/// the boxed errors); a failure with no element to box (a cycle) ends it.
fn build_boxing(
    dast: &Arc<Dast>,
    session: &Session,
    engine: &mut Engine,
    view: &dyn View,
    probe_checks: bool,
    cycle_check: bool,
    list: &mut Vec<Diagnostic>,
) -> Result<(Compiled, BuildOutput)> {
    let profile = profile_enabled();
    let mut boxed: HashSet<NodeId> = HashSet::new();
    let outcome = loop {
        let clock = web_time::Instant::now();
        // Whether a failure came from the stamped build after the probe
        // passed: the probe stands for every count and pick, so that build
        // has nothing left to find (ADR 0014).
        let mut probed = false;
        let attempt = Compiler::compile(dast, &boxed).and_then(|compiled| {
            if profile {
                eprintln!("  build/compile: {:.2?}", clock.elapsed());
            }
            let mut checked = std::time::Duration::ZERO;
            if cycle_check && compiled.has_repeats() {
                let clock = web_time::Instant::now();
                cycles::check(&compiled, session)?;
                checked = clock.elapsed();
                probed = true;
                if profile {
                    eprintln!("  build/cycle check: {checked:.2?}");
                }
            }
            let mut u = build_with(&compiled, session, false, engine, view, probe_checks)?;
            u.cycle_check = checked;
            Ok((compiled, u))
        });
        match attempt {
            Ok(built) => break Ok(built),
            Err(f) if probed && f.node.is_some() => {
                break Err(Error::Unchecked(f.error.to_string()));
            }
            Err(f) => {
                let node = f.node.filter(|n| boxed.insert(*n));
                list.push(Diagnostic::error(node, &f.error));
                if node.is_none() {
                    break Err(f.error);
                }
            }
        }
    };
    list.extend(crate::lint::lint(dast));
    crate::diagnostics::sort(list);
    outcome
}

/// The compile stage (ADR 0015): plan the document, check it (through the
/// probe, with `check_cycles`, for a document with repeats; ADR 0012, ADR
/// 0014) and box every element that fails until every element builds (ADR
/// 0013). Returns the compile, which every later build of the document
/// stamps, and its first build, at no iteration: for a document without
/// repeats that build is the check, and the only one there will be. The
/// compile holds the source's diagnostics, the lint findings and the boxed
/// errors. Only a cycle, which has no element to box, fails it.
pub fn compile(
    dast: &Arc<Dast>,
    session: &Session,
    engine: &mut Engine,
    check_cycles: bool,
) -> Result<(Arc<Compiled>, BuildOutput)> {
    let counts = Counts::default();
    let view = Stamped {
        session,
        counts: &counts,
    };
    let mut source = Vec::new();
    let (mut compiled, mut u) = build_boxing(
        dast,
        session,
        engine,
        &view,
        false,
        check_cycles,
        &mut source,
    )?;
    compiled.diagnostics = source;
    compiled.rebuilds = compiled.has_repeats();
    if compiled.rebuilds {
        compiled.release_compile_tables();
    }
    u.structure.diagnostics = with_warnings(&compiled, &mut u);
    Ok((Arc::new(compiled), u))
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
    u.structure.diagnostics = with_warnings(compiled, &mut u);
    Ok(u)
}

/// The compile's diagnostics and the build's warnings, in node order.
fn with_warnings(compiled: &Compiled, u: &mut BuildOutput) -> Vec<Diagnostic> {
    let mut list = compiled.diagnostics.clone();
    list.append(&mut u.structure.diagnostics);
    crate::diagnostics::sort(&mut list);
    list
}

/// Every diagnostic of the document, from one build through the
/// exhaustive view (ADR 0013): one iteration per repeat, every option of
/// every select, every branch of every choice. The list is a function of
/// the DAST alone: the same at every seed, every iteration count, with
/// any state. A load never calls this; the language server does.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let dast = Arc::new(dast.clone());
    let session = Session::new(0, false);
    let mut engine = Engine::new();
    let view = cycles::Probe::exhaustive();
    let mut list = Vec::new();
    // A failure is in the list; the build itself is not wanted, but its
    // warnings are.
    if let Ok((_, u)) = build_boxing(&dast, &session, &mut engine, &view, true, false, &mut list) {
        list.extend(u.structure.diagnostics);
        crate::diagnostics::sort(&mut list);
    }
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
    /// The session after this build: its scopes, what is still parked.
    session: Session,
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

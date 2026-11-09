//! The compile: the source made, once per load, into what every build
//! stamps: one [`Template`] per repeat body, choice branch
//! and the document, with a *plan* for every prop and a path through the
//! template nesting for every reference. Nothing in a plan depends on which
//! iteration it will be stamped in.
//!
//! The compile runs in stages, each reading only what earlier stages made,
//! each a module of [`stages`] with one entry function:
//!
//! | Stage | Module | Makes |
//! |---|---|---|
//! | lint | [`stages::lint`] | findings from the DAST alone |
//! | outline | [`stages::outline`] | every element and template, the name table, what a reference reads of each; no plans |
//! | parse | [`stages::parse`] | every `<math>`'s text parsed, its `$ref`s planned |
//! | plan | [`stages::plan`] | every element's plans and hold, every `$ref` child's plan |
//! | link | [`stages::link`] | readers of boxed referents boxed, shared state tied |
//! | seal | [`stages::seal`] | choice interfaces, arity, keys, slot offsets, port types |
//! | share | [`stages::share`] | equal derived ports made aliases, the expression classes |
//! | check | [`stages::check`] | over the template graph: the elements that cannot be built, the cycle check, structural depth, define, port attributes and warnings |
//!
//! An element that fails is boxed (compiled as an `_error` element) where
//! it fails, and linking boxes the readers of every box to a fixpoint. A
//! failure no element can carry ends the compile at the next stage
//! boundary, and the compile is run again with that failure's node boxed.
//! This module is the driver that does so: [`compile`], the retry
//! ([`plan_and_check`]) and one attempt ([`Compiler::compile`]).
//!
//! Its submodules, in reading order:
//!
//! - [`stages`]: one module per stage, in the order they run;
//! - [`ir`]: what the stages write and the stages after them and the build
//!   read, the compile's output among it;
//! - [`read`]: reading the source, which several stages run;
//! - [`graph`]: the template graph, which the check stamps;
//! - [`api`]: what a component's planner may use, and nothing else;
//! - [`compare`]: whether an edited document may keep its saved state.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, OnceLock};

use crate::components::{
    ChildrenKind, Collection, ComponentType, Machinery, PropAt, PropFrom, PropSel, ResponseKind,
    Role, StructureKind, prop,
};
use crate::dast::{AttrId, Dast, NodeId, NodeKind, StrId};
use crate::diagnostics::Diagnostic;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, Post, SymKind, VecOp};
use crate::sym::Tree;
use ir::boxes::{Boxes, Visible};
use ir::expr::{Arena, Expr, ExprId, Parser, Token};
use ir::names::*;
use ir::record::{ChildValue, ValueChildren};
use ir::*;
use read::*;
use stages::parse::Parsed;

/// The compile chapter of the guide ([`crate::_guide`]), written here so
/// its links reach the stages' private modules.
#[doc = include_str!("../../../../docs/guide/compile.md")]
#[doc(hidden)]
pub mod guide {}

pub(crate) mod api;
pub(crate) mod compare;
pub(crate) mod graph;
pub(crate) mod ir;
mod read;
mod stages;

pub use ir::Compiled;
pub(crate) use ir::CompiledRef;
pub use stages::lint;
pub(crate) use stages::seal::keys;

/// A failed compile, check or first build: the error, and the node of the
/// element it is about when there is one. `compile` boxes that element and
/// compiles again; an error with no element fails the compile.
pub(crate) struct Failure {
    pub(crate) error: Error,
    pub(crate) node: Option<NodeId>,
}

impl From<Failure> for Error {
    fn from(f: Failure) -> Error {
        f.error
    }
}

/// A compile that planned: what it planned, the errors of the elements it
/// boxed where they failed, and the planners' warnings.
pub(in crate::compile) struct Attempt {
    pub(in crate::compile) plans: Plans,
    pub(in crate::compile) errors: Vec<Diagnostic>,
    pub(in crate::compile) warnings: Vec<Diagnostic>,
}

/// The driver: it runs the stages in order, each a function of the tables
/// the stages before it made, and puts the plans together from them. It
/// holds nothing itself: what a stage may read and write is its own
/// business, behind its entry function in [`stages`]. What boxing records
/// is a [`Boxes`], given only to the stages that box.
pub(in crate::compile) struct Compiler;

/// What a compile returns.
pub(crate) struct CompileOutput {
    /// The compile, which every build of the document stamps.
    pub(crate) compiled: Arc<Compiled>,
}

/// Compile `dast`: plan it, check it (`check`), and box
/// every element that fails until every element builds. The compile holds
/// the source's diagnostics. Only a cycle, which has no element to box,
/// fails it.
///
/// For tests, `check_cycles` off skips the cycle and count checks, and
/// with them the structural depth, and `classify` off makes every port
/// writable, so every value slot is essential.
pub(crate) fn compile(
    dast: Dast,
    check_cycles: bool,
    classify: bool,
    prune: bool,
    fold: bool,
    share: bool,
) -> Result<CompileOutput> {
    let mut list = {
        let _s = crate::trace::span("lint");
        stages::lint::lint(&dast)
    };
    let (plans, warnings) = plan_and_check(&dast, &mut list, share, |dast, plans| {
        plans.prune = prune;
        plans.fold = fold;
        let _s = crate::trace::span("check");
        let found = stages::check::check(CompiledRef { dast, plans }, check_cycles)?;
        plans.structural_depth = found.structural_depth;
        let mut picks: Vec<Vec<(ElemId, u32)>> = vec![Vec::new(); plans.templates.len()];
        for &(cid, n) in &found.picks {
            let (t, e) = plans.choices[cid.index()].at;
            picks[t.index()].push((e, n));
        }
        for ((tpl, mut attrs), picks) in plans.templates.iter_mut().zip(found.attrs).zip(picks) {
            if !classify {
                for a in &mut attrs {
                    *a |= PortAttrs::WRITABLE;
                }
            }
            tpl.checked = Checked { attrs, picks };
        }
        Ok(found.warnings)
    })?;
    // The check's warnings are the document's: no build finds one the
    // check did not (ADR 0014). With them, the lint findings,
    // the boxes' errors and the planners' warnings, which the loop added.
    let _s = crate::trace::span("diagnostics");
    list.extend(warnings);
    crate::diagnostics::sort(&mut list);
    Ok(CompileOutput {
        compiled: Arc::new(Compiled {
            dast,
            plans,
            diagnostics: Arc::new(list),
        }),
    })
}

/// Every diagnostic of the document, from the DAST alone: the same list a
/// load reports, at any seed, count or state.
pub fn diagnose(dast: &Dast) -> Vec<Diagnostic> {
    let mut list = stages::lint::lint(dast);
    // The build is not wanted, but its warnings are, with the planners'.
    // A failure with no element to box is in the list already.
    if let Ok((_, warnings)) = plan_and_check(dast, &mut list, true, |dast, plans| {
        stages::check::check(CompiledRef { dast, plans }, true).map(|found| found.warnings)
    }) {
        list.extend(warnings);
    }
    crate::diagnostics::sort(&mut list);
    list
}

/// The input signature of `dast`, read off the template graph's
/// definitions (ADR 0032 step 8, ADR 0035), after the check's resolve,
/// cycle check and define. Every key goes through `rename`.
pub(crate) fn signature_renamed(
    dast: &Dast,
    rename: &dyn Fn(&str) -> String,
) -> Result<crate::compile::compare::signature::Signature> {
    let (_, signature) = plan_and_check(dast, &mut Vec::new(), true, |dast, plans| {
        let compiled = CompiledRef { dast, plans };
        let mut g = graph::template_graph_with_parents(compiled)?;
        graph::check_cycles(&g, compiled).map_err(|error| Failure { error, node: None })?;
        let defined = graph::define(&mut g, compiled)?;
        let mut constants = graph::Constants::new(&g, &defined, compiled);
        let picks = graph::check_choices(&g, &mut constants, compiled)?;
        Ok(graph::sign(&g, &defined, compiled, &picks, rename))
    })?;
    Ok(signature)
}

/// Each constant port's range as the check's evaluator finds it (ADR
/// 0037), by template and template slot, for a compile that checked.
#[cfg(feature = "testing")]
pub(crate) fn constant_ranges(
    compiled: CompiledRef<'_>,
) -> Vec<(TemplateId, TemplateSlot, crate::program::Range)> {
    let checked = |f: Failure| -> ! { panic!("a compile that checked failed: {}", f.error) };
    let mut g = graph::template_graph_checked(compiled).unwrap_or_else(|f| checked(f));
    let defined = graph::define(&mut g, compiled).unwrap_or_else(|f| checked(f));
    graph::Constants::new(&g, &defined, compiled).port_ranges()
}

/// The compile's loop: plan `dast`, boxing every element that fails where
/// it fails; then run `check` on the plan. An element `check` fails on, or
/// a failure no element could carry, is boxed and the plan made again.
/// Each box is an error in `errors`, and the planners' warnings of the
/// plan that checked join them. Only a failure with no element to box, a
/// cycle, fails it, after its error joins `errors` too. `share` runs the
/// sharing stage. Every stage and `check` borrow `dast`; the
/// loop returns the plans that checked, made from it.
fn plan_and_check<T>(
    dast: &Dast,
    errors: &mut Vec<Diagnostic>,
    share: bool,
    mut check: impl FnMut(&Dast, &mut Plans) -> std::result::Result<T, Failure>,
) -> Result<(Plans, T)> {
    let mut boxed: HashSet<NodeId> = HashSet::new();
    // Box what `f` names, or fail with it when it names nothing.
    let restart = |boxed: &mut HashSet<NodeId>, errors: &mut Vec<Diagnostic>, f: Failure| {
        crate::trace::count("boxed", 1);
        let node = f.node.filter(|n| boxed.insert(*n));
        errors.push(Diagnostic::error(node, &f.error));
        match node {
            Some(_) => Ok(()),
            None => Err(f.error),
        }
    };
    loop {
        let planned = {
            let _s = crate::trace::span("plan");
            let planned = Compiler::compile(dast, &boxed, share);
            if let Ok(p) = &planned {
                crate::trace::count("templates", p.plans.templates.len());
                crate::trace::count(
                    "elements",
                    p.plans.templates.iter().map(|t| t.elems.len()).sum(),
                );
            }
            planned
        };
        let planned = match planned {
            Ok(p) => p,
            Err(f) => {
                restart(&mut boxed, errors, f)?;
                continue;
            }
        };
        let Attempt {
            mut plans,
            errors: boxed_here,
            warnings,
        } = planned;
        match check(dast, &mut plans) {
            Ok(checked) => {
                crate::trace::count("boxed", boxed_here.len());
                errors.extend(boxed_here);
                errors.extend(warnings);
                return Ok((plans, checked));
            }
            Err(f) => restart(&mut boxed, errors, f)?,
        }
    }
}

/// A word-at-a-time hasher for the compile's small keys (the rotate and
/// multiply of rustc's `FxHasher`): sharing's and the template graph's.
#[derive(Default)]
pub(crate) struct Fx(u64);

impl std::hash::Hasher for Fx {
    fn write(&mut self, bytes: &[u8]) {
        for chunk in bytes.chunks(8) {
            let mut w = [0u8; 8];
            w[..chunk.len()].copy_from_slice(chunk);
            self.write_u64(u64::from_le_bytes(w));
        }
    }
    fn write_u8(&mut self, n: u8) {
        self.write_u64(n as u64);
    }
    fn write_u32(&mut self, n: u32) {
        self.write_u64(n as u64);
    }
    fn write_usize(&mut self, n: usize) {
        self.write_u64(n as u64);
    }
    fn write_u64(&mut self, n: u64) {
        self.0 = (self.0.rotate_left(5) ^ n).wrapping_mul(0x51_7c_c1_b7_27_22_0a_95);
    }
    fn finish(&self) -> u64 {
        self.0
    }
}

pub(crate) type FxMap<K, V> = HashMap<K, V, std::hash::BuildHasherDefault<Fx>>;

impl Compiler {
    /// Compile `dast`, with the nodes in `boxed` as `_error` elements, and
    /// every element that fails to plan boxed where it fails. A failure
    /// names the node to box before compiling again, when there is one.
    pub(in crate::compile) fn compile<'a>(
        dast: &'a Dast,
        boxed: &'a HashSet<NodeId>,
        share: bool,
    ) -> std::result::Result<Attempt, Failure> {
        // What boxing records, handed to each stage that boxes.
        let (settled, tables, mut ar, mut boxes, mut work) =
            stages::outline::outline(dast, Boxes::new(boxed));
        boxes.restart_if_needed()?;
        // From here on, every stage reads what outlining settled and none
        // changes it: the element set is outlining's (ADR 0030, ADR 0031),
        // and planning and linking make none.
        boxes.enter(Stage::Parse);
        let parsed = stages::parse::parse(
            Reader::new(dast, &settled),
            &tables,
            &mut ar,
            std::mem::take(&mut work.math_texts),
            &work.to_plan,
        );
        boxes.enter(Stage::Plan);
        let (mut tables, mut ar, mut boxes, mut planned) = stages::plan::plan(
            Reader::new(dast, &settled),
            &parsed,
            tables,
            ar,
            boxes,
            work,
        );
        boxes.restart_if_needed()?;
        boxes.enter(Stage::Link);
        stages::link::link(
            Reader::new(dast, &settled),
            &ar,
            &mut tables,
            &mut boxes,
            &mut planned,
        )?;
        boxes.restart_if_needed()?;
        boxes.enter(Stage::Seal);
        let (sealed, choice_seals, keys) =
            stages::seal::seal(dast, &settled, &ar, &tables, &planned.given)?;
        let _s = crate::trace::span("finish");
        boxes.drop_reports_of_boxes(&settled.templates, &tables, &mut ar.warnings);
        let errors = boxes.into_errors();
        // Each stage's tables put together, as the build reads them (ADR
        // 0031).
        let Arenas {
            refs,
            arena,
            sym_text,
            extra_strings,
            warnings,
            ..
        } = ar;
        let Settled {
            templates, choices, ..
        } = settled;
        let mut plans = Plans {
            templates: (templates.into_iter().zip(tables).zip(sealed))
                .map(|((outlined, tables), sealed)| Template {
                    outlined,
                    tables,
                    sealed,
                    checked: Checked::default(),
                })
                .collect(),
            refs,
            arena,
            sym_text,
            sym_trees: HashMap::new(),
            choices: (choices.into_iter().zip(choice_seals))
                .map(|(def, seal)| seal.into_def(def))
                .collect(),
            keys: Arc::new(keys),
            version: dast.version_hash(),
            extra_strings,
            structural_depth: 0,
            prune: false,
            fold: false,
            expr_class: Vec::new(),
        };
        // Equal computations share one cell (ADR 0033), once every port's
        // type is known.
        if share {
            let shared = stages::share::share(&mut plans, dast, &planned.paths);
            crate::trace::count("shared ports", shared);
        }
        plans.shrink_to_fit();
        if plans.has_repeats() {
            plans.sym_trees = plans
                .sym_text
                .keys()
                .map(|&k| (k, OnceLock::new()))
                .collect();
        }
        Ok(Attempt {
            plans,
            errors,
            warnings,
        })
    }
}

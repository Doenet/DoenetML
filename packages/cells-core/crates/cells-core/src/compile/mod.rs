//! The compile: the source made, once per load, into what every build
//! stamps: one [`Template`] per repeat body, choice branch
//! and the document, with a *plan* for every prop and a path through the
//! template nesting for every reference. Nothing in a plan depends on which
//! iteration it will be stamped in.
//!
//! The compile runs in stages, each reading only what earlier stages made:
//!
//! | Stage | Makes |
//! |---|---|
//! | lint | findings from the DAST alone |
//! | outline | every element and template, the name table, what a reference reads of each; no plans |
//! | parse | every `<math>`'s text parsed, its `$ref`s planned |
//! | plan | every element's plans and hold, every `$ref` child's plan |
//! | link | readers of boxed referents boxed, shared state tied |
//! | seal | choice interfaces, arity, keys, slot offsets, port types |
//! | share | equal derived ports made aliases, the expression classes |
//! | check | over the template graph: the elements that cannot be built, the cycle check, structural depth, define, port attributes and warnings |
//!
//! An element that fails is boxed (compiled as an `_error` element) where
//! it fails, and linking boxes the readers of every box to a fixpoint. A
//! failure no element can carry ends the compile at the next stage
//! boundary, and the compile is run again with that failure's node boxed.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, OnceLock};

use crate::components::{
    ChildrenKind, Collection, ComponentType, Machinery, PropAt, PropFrom, PropSel, prop,
};
use crate::dast::{AttrId, Dast, NodeId, NodeKind, StrId};
use crate::diagnostics::Diagnostic;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, Post, SymKind, VecOp};
use crate::sym::Tree;
use ir::expr::{Arena, Expr, ExprId, Parser, Token};
use ir::*;

/// The compile chapter of the guide ([`crate::_guide`]), written here so
/// its links reach the stages' private modules.
#[doc = include_str!("../../../../docs/guide/compile.md")]
pub mod guide {}

pub(crate) mod api;
mod check;
pub(crate) mod compare;
pub(crate) mod graph;
pub(crate) mod ir;
mod link;
pub mod lint;
mod outline;
mod parse;
mod planning;
mod read;
mod seal;
mod share;

#[cfg(feature = "testing")]
pub(crate) use check::constant_ranges;
pub use check::diagnose;
pub(crate) use check::{CompileOutput, compile};
pub use ir::Compiled;
pub(crate) use ir::CompiledRef;

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

use ir::boxes::{Boxes, Visible};
use ir::names::*;
use ir::record::{ChildValue, ValueChildren};
use link::Linking;
use outline::Outlining;
use parse::Parsed;
use parse::Parsing;
use planning::Planning;
use planning::ctx::PlanCtx;
use planning::planner::Planner;
use read::*;
use seal::Seal;
pub(crate) use seal::keys;

/// A compile that planned: what it planned, the errors of the elements it
/// boxed where they failed, and the planners' warnings.
pub(in crate::compile) struct Attempt {
    pub(in crate::compile) plans: Plans,
    pub(in crate::compile) errors: Vec<Diagnostic>,
    pub(in crate::compile) warnings: Vec<Diagnostic>,
}

/// The driver: it runs the stages in order, each over a view made from
/// the tables the stages before it made, and puts the plans together from
/// them. It holds nothing itself: what a stage may read and write is its
/// view's ([`Outlining`], [`Parsing`], [`Planning`], [`Linking`], [`Seal`]).
/// What boxing records is a [`Boxes`], given only to the stages that box.
pub(in crate::compile) struct Compiler;

/// The driver: the stages in order (outline, parse, plan, link, seal, share),
/// each handed the tables the stages before it made, and the plans put together
/// from them.
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
        let mut outlining = Outlining::new(dast, Boxes::new(boxed));
        crate::trace::span("outline").run(|| outlining.outline());
        let Outlining {
            settled,
            tables,
            mut ar,
            mut boxes,
            work:
                Outline {
                    to_plan,
                    macros,
                    math_texts,
                    reads,
                },
            ..
        } = outlining;
        boxes.restart_if_needed()?;
        // From here on, every stage reads what outlining settled and none
        // changes it: the element set is outlining's (ADR 0030, ADR 0031),
        // and planning and linking make none.
        boxes.enter(Stage::Parse);
        let mut parsing = Parsing {
            rd: Reader::new(dast, &settled),
            tables: &tables,
            ar: &mut ar,
        };
        let mut parsed: Parsed =
            crate::trace::span("parse maths").run(|| parsing.parse_maths(math_texts));
        crate::trace::span("parse records").run(|| parsing.parse_records(&to_plan, &mut parsed));
        boxes.enter(Stage::Plan);
        let mut planning = Planning::new(
            Reader::new(dast, &settled),
            &parsed,
            tables,
            ar,
            boxes,
            reads,
        );
        crate::trace::span("plan all").run(|| planning.plan_all(to_plan, macros));
        let Planning {
            mut tables,
            mut ar,
            mut boxes,
            mut planned,
            ..
        } = planning;
        boxes.restart_if_needed()?;
        boxes.enter(Stage::Link);
        crate::trace::span("link").run(|| {
            Linking {
                rd: Reader::new(dast, &settled),
                ar: &ar,
                tables: &mut tables,
                boxes: &mut boxes,
                planned: &mut planned,
            }
            .link()
        })?;
        boxes.restart_if_needed()?;
        boxes.enter(Stage::Seal);
        let (sealed, choice_seals, keys) = crate::trace::span("seal")
            .run(|| Seal::new(dast, &settled, &ar, &tables, &planned.given).run())?;
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
            let shared = crate::trace::span("share").run(|| plans.share(dast, &planned.paths));
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

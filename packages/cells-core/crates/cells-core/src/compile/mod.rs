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
//! | abstract build | cycles, writable and live records, structural depth |
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
use expr::{Arena, Expr, ExprId, Parser, Token};
use plan::*;

mod answer;
pub(crate) mod api;
mod boxes;
mod check;
pub(crate) mod compare;
pub(crate) mod expr;
pub(crate) mod graph;
mod link;
pub mod lint;
mod maths;
mod names;
mod outline;
mod parse;
pub(crate) mod plan;
mod planning;
mod points;
pub(crate) mod rebase;
pub(crate) mod record;
mod refs;
mod seal;
mod share;
mod source;
mod values;

pub use check::diagnose;
pub(crate) use check::{CompileOutput, compile};
pub use plan::Compiled;
pub(crate) use plan::CompiledRef;

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

use boxes::Boxes;
use names::*;
use parse::Parsed;
use planning::ctx::PlanCtx;
use planning::planner::Planner;
use record::{ChildValue, ValueChildren};
use refs::Refs;
pub(crate) use seal::keys;

/// A compile that planned: what it planned, the errors of the elements it
/// boxed where they failed, and the planners' warnings.
pub(in crate::compile) struct Attempt {
    pub(in crate::compile) plans: Plans,
    pub(in crate::compile) errors: Vec<Diagnostic>,
    pub(in crate::compile) warnings: Vec<Diagnostic>,
}

/// What every stage of one compile works on, outline to seal: the source,
/// read-only, the plans being made in their parts, the planners' warnings,
/// which stage runs, and a cache.
/// What boxing records is a [`Boxes`], given only to the stages that box.
pub(in crate::compile) struct Compiler<'a> {
    /// The source being compiled. Only the finished `Compiled` owns it.
    pub(in crate::compile) dast: &'a Dast,
    /// What the compile makes from it.
    pub(in crate::compile) plans: Plans,
    /// The planners' warnings about the source, which the compile reports
    /// with the boxes' errors.
    warnings: Vec<Diagnostic>,
    /// What outlining settles, which every stage after it reads and none
    /// changes.
    settled: Settled,
    /// Boxing's and planning's tables, by `TemplateId`.
    tables: Vec<Tables>,
    /// The stage running now.
    stage: Stage,
    /// Every string's canonical id, over the DAST table and then
    /// `extra_strings`; built when first needed. A cache.
    pub(in crate::compile) string_ids: Option<HashMap<String, StrId>>,
}

/// What outlining hands to the stages after it: the work it found for
/// them, in the order the walk made it.
#[derive(Default)]
pub(in crate::compile) struct Outline {
    /// Every element to plan.
    to_plan: Vec<(TemplateId, ElemId)>,
    /// Every `$ref` child to plan.
    macros: Vec<(TemplateId, RefChildId)>,
    /// Each `<math>`'s text, tokenized where its type was settled.
    math_texts: Vec<((TemplateId, ElemId), Result<MathText>)>,
    /// Every read outlining recorded: a container copy's of its referent's
    /// type, and each clone's of its original.
    reads: Vec<Read>,
}

/// What outlining settles that the stages after it read and never change,
/// beside what it settles of each element in the templates.
#[derive(Default)]
pub(in crate::compile) struct Settled {
    /// Outlining's part of every template: its elements' rows, its children
    /// and its `$ref` children, by `TemplateId`.
    templates: Vec<Outlined>,
    /// Every choice as outlining made it, by `ChoiceId`.
    choices: Vec<ChoiceDef>,
    /// The name table.
    names: NameTable,
    /// The references in an answer's whens, by macro node.
    when_refs: HashMap<NodeId, RefId>,
    /// Each `$mi` in an answer's `<when>` that names an input, with the
    /// answer's `response` for that input, which it stands for.
    submitted: HashMap<NodeId, ElemId>,
    /// By (template, answer), the `response` outlining made for each input
    /// its whens read.
    answer_responses: HashMap<(TemplateId, ElemId), Vec<(InputKey, ElemId)>>,
}

/// A recorded cross-element read: the reader, and the reference to what it
/// read.
pub(in crate::compile) type Read = (TemplateId, ElemId, RefId);

/// What planning makes for linking and sealing, beside the plans
/// themselves in the templates.
#[derive(Default)]
pub(in crate::compile) struct Planned {
    /// What copies share of their referents' given leaves.
    shares: Vec<Share>,
    /// By (template, element), which port holds each given leaf of an
    /// element planned by a `Plan` type's planner, by what gave it.
    given: HashMap<(TemplateId, ElemId), HashMap<GivenId, Port>>,
    /// Every read recorded, outlining's and planning's: an element whose
    /// plan read the type of what a reference names.
    reads: Vec<Read>,
    /// The extends whose referent is in another template.
    paths: Vec<share::PathExtend>,
}

/// A given leaf copy `e` shares with its referent: port `port` of the copy
/// is to alias the referent's port holding the leaf `id` gave. The referent
/// is an element of the same template, or reached by a path from `e`'s.
pub(in crate::compile) struct Share {
    t: TemplateId,
    e: ElemId,
    port: Port,
    referent: Referent,
    id: GivenId,
}

/// What an extend names: an element of the copy's template, or a path to
/// one in another.
#[derive(Clone, Copy)]
pub(in crate::compile) enum Referent {
    Here(ElemId),
    Path(RefId, TemplateId, ElemId),
}

/// An input an answer's when reads, as `input_named` keys it: how many
/// templates up, and which element.
pub(in crate::compile) type InputKey = (u32, ElemId);

/// How an element is named in a diagnostic: its name, else its tag.
pub(in crate::compile) fn elem_label(dast: &Dast, el: &Elem) -> String {
    if el.name != StrId::NONE {
        dast.strings.get(el.name).trim().to_string()
    } else {
        format!("<{}>", el.component_type.tag())
    }
}

impl Compiler<'_> {
    /// Compile `dast`, with the nodes in `boxed` as `_error` elements, and
    /// every element that fails to plan boxed where it fails. A failure
    /// names the node to box before compiling again, when there is one.
    pub(in crate::compile) fn compile<'a>(
        dast: &'a Dast,
        boxed: &'a HashSet<NodeId>,
        share: bool,
    ) -> std::result::Result<Attempt, Failure> {
        let mut cp = Compiler {
            dast,
            plans: Plans {
                // Put together once the compile is done (ADR 0031).
                templates: Vec::new(),
                refs: Vec::new(),
                arena: Arena::default(),
                sym_text: HashMap::new(),
                sym_trees: HashMap::new(),
                choices: Vec::new(),
                keys: Arc::default(),
                version: dast.version_hash(),
                extra_strings: Vec::new(),
                structural_depth: 0,
                prune: false,
                fold: false,
                expr_class: Vec::new(),
            },
            warnings: Vec::new(),
            settled: Settled::default(),
            tables: Vec::new(),
            stage: Stage::Outline,
            string_ids: None,
        };
        // What boxing records, handed to each stage that boxes, and
        // reference planning's state, handed to each stage that plans one.
        let boxes = Boxes::new(boxed);
        let refs = Refs::default();
        let (outline, mut boxes, mut refs) =
            crate::trace::span("outline").run(|| cp.outline(boxes, refs));
        let Outline {
            to_plan,
            macros,
            math_texts,
            reads,
        } = outline;
        boxes.restart_if_needed()?;
        // From here on, every stage reads what outlining settled and none
        // changes it. The element set is outlining's (ADR 0030, ADR 0031):
        // planning and linking make none.
        let outlined = cp.elem_count();
        cp.stage = Stage::Parse;
        let mut parsed: Parsed =
            crate::trace::span("parse maths").run(|| cp.parse_maths(&mut refs, math_texts));
        crate::trace::span("parse records")
            .run(|| cp.parse_records(&mut refs, &to_plan, &mut parsed));
        cp.stage = Stage::Plan;
        let (mut planned, mut boxes, _) = crate::trace::span("plan all")
            .run(|| cp.plan_all(boxes, refs, parsed, to_plan, macros, reads));
        boxes.restart_if_needed()?;
        cp.stage = Stage::Link;
        crate::trace::span("link").run(|| cp.link(&mut boxes, &mut planned))?;
        debug_assert_eq!(cp.elem_count(), outlined, "only outlining makes elements");
        boxes.restart_if_needed()?;
        cp.stage = Stage::Seal;
        let (sealed, choice_seals) = crate::trace::span("seal").run(|| cp.seal(&planned))?;
        let _s = crate::trace::span("finish");
        cp.drop_reports_of_boxes(&mut boxes);
        let errors = boxes.into_errors();
        // Each stage's tables put together, as the build reads them (ADR
        // 0031).
        let Compiler {
            dast,
            mut plans,
            warnings,
            tables,
            settled,
            ..
        } = cp;
        let Settled {
            templates, choices, ..
        } = settled;
        plans.templates = (templates.into_iter().zip(tables).zip(sealed))
            .map(|((outlined, tables), sealed)| Template {
                outlined,
                tables,
                sealed,
                checked: Checked::default(),
            })
            .collect();
        plans.choices = (choices.into_iter().zip(choice_seals))
            .map(|(def, seal)| seal.into_def(def))
            .collect();
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

impl Compiler<'_> {
    /// What outlining settled.
    pub(in crate::compile) fn settled(&self) -> &Settled {
        &self.settled
    }

    /// What outlining settled, to make; only outlining reaches it.
    pub(in crate::compile) fn settled_mut(&mut self) -> &mut Settled {
        debug_assert_eq!(
            self.stage,
            Stage::Outline,
            "only outlining makes what it settled"
        );
        &mut self.settled
    }

    /// The name table.
    pub(in crate::compile) fn names(&self) -> &NameTable {
        &self.settled.names
    }

    /// The answer's `response` a `$mi` in a `<when>` stands for.
    pub(in crate::compile) fn submitted(&self, m: NodeId) -> Option<ElemId> {
        self.settled.submitted.get(&m).copied()
    }

    /// Outlining's part of template `t`, read-only.
    pub(in crate::compile) fn outlined(&self, t: TemplateId) -> &Outlined {
        &self.settled.templates[t.index()]
    }

    /// Outlining's part of template `t`, to make; only outlining reaches it.
    pub(in crate::compile) fn outlined_mut(&mut self, t: TemplateId) -> &mut Outlined {
        &mut self.settled_mut().templates[t.index()]
    }

    /// Element `e` of template `t` as outlining made it.
    pub(in crate::compile) fn elem(&self, t: TemplateId, e: ElemId) -> &Elem {
        &self.outlined(t).elems[e.index()]
    }

    /// How many templates there are.
    pub(in crate::compile) fn n_templates(&self) -> usize {
        self.tables.len()
    }

    /// Template `t`'s outlined part and its tables, read together.
    pub(in crate::compile) fn view(&self, t: TemplateId) -> TemplateRef<'_> {
        TemplateRef {
            outlined: self.outlined(t),
            tables: &self.tables[t.index()],
        }
    }

    /// Choice `cid` as outlining made it.
    pub(in crate::compile) fn choice(&self, cid: ChoiceId) -> &ChoiceDef {
        &self.settled.choices[cid.index()]
    }

    /// Adds a template to outlining's part and to the tables; only
    /// outlining makes one.
    pub(in crate::compile) fn push_template(
        &mut self,
        parent: Option<(TemplateId, ElemId)>,
    ) -> TemplateId {
        let t = TemplateId::from_index(self.tables.len());
        self.settled_mut().templates.push(Outlined {
            parent,
            ..Default::default()
        });
        self.tables.push(Tables::default());
        t
    }

    /// A warning about the element at `node`, which the compile reports.
    pub(in crate::compile) fn warn(
        &mut self,
        node: NodeId,
        code: &'static str,
        message: &str,
    ) -> Warned {
        self.warnings
            .push(Diagnostic::warning(code, Some(node), message.into()));
        Warned::raised()
    }

    /// How many elements the templates hold.
    fn elem_count(&self) -> usize {
        (0..self.n_templates())
            .map(|t| self.outlined(TemplateId::from_index(t)).elems.len())
            .sum()
    }

    pub(in crate::compile) fn elem_label(&self, t: TemplateId, e: ElemId) -> String {
        elem_label(self.dast, self.elem(t, e))
    }
}

//! The compile (ADR 0015): the source made, once per load, into what
//! every build stamps: one [`Template`](plan::Template) per repeat body,
//! choice branch and the document, with a *plan* for every prop (a
//! literal, a default, an operator over references, a math, a reference)
//! and every reference (a path through the template nesting: how many
//! levels up the name was found, which element, which `[index]` steps,
//! which prop). Nothing in a plan depends on which iteration it will be
//! stamped in, so all string work happens once per template element.
//!
//! The compile runs in stages (ADR 0027, ADR 0029, ADR 0030), each
//! reading only what earlier stages made (`Compiler::compile`):
//!
//! | Stage | Code | Makes |
//! |---|---|---|
//! | lint | `lint.rs` | findings from the DAST alone, first |
//! | **outline** | `Compiler::outline` → `Outline` | every element and template, the name table, what a reference reads of each (`settle_outline`), container copies' clones (`copies.rs`), answers' synthetic children (`answer.rs`); no plans |
//! | **parse** | `Compiler::parse_maths` → `Parsed` | every `<math>`'s text parsed, its `$ref`s planned |
//! | **plan** | `Compiler::plan_all` → `Planned` | every element's plans and hold, every `$ref` child's plan |
//! | **link** | `Compiler::link(&mut Planned)` | readers of boxed referents boxed, elements with an attribute nothing read boxed (`unread.rs`, ADR 0021), shared state tied |
//! | **seal** | `seal.rs`, given `&Planned` | choice interfaces, arity, keys, slot offsets, port types |
//! | **share** | `share.rs`, given `Planned::paths` | equal derived ports made aliases, the expression classes (ADR 0033) |
//! | **abstract build** | `check.rs`, `build/abstract_build.rs` | cycles, writable and live records, structural depth |
//!
//! `check.rs` drives them (`plan_and_check`): it runs outline to seal
//! (`Compiler::compile`), then the abstract build, which stands for every
//! count and pick (ADR 0012, ADR 0014), and compiles again when a failure
//! could not be boxed where it arose (ADR 0013). Each stage returns what
//! it makes for later ones, and `Compiler::compile` hands it on as
//! arguments: outlining's work lists and the reads it recorded
//! ([`Outline`]), what parsing made ([`Parsed`]), what planning made
//! ([`Planned`]). What outlining settles ([`Settled`]) is the one result
//! every later stage reads, so it is on `Compiler`, written by outlining
//! alone. What a stage needs only while it runs is a local of the stage's
//! function, handed down to what it calls (`outline/mod.rs`'s
//! `Outlining`, `planning/mod.rs`'s `Planning`, which the planners reach
//! through their context). All of them write the compile itself
//! (`Compiled`), each in its own way (see the field's doc).
//!
//! Files follow the stages (ADR 0030). This one has the driver
//! (`Compiler::compile`), `Compiler` and the stages' results. Each stage
//! has its own module: `outline/`, `parse.rs`, `planning/`, `link/`,
//! `seal/`; `check.rs` drives the compile and runs the abstract build,
//! and `lint.rs` holds the rules that need only the DAST. What more than
//! one stage uses has a module of its own: `names.rs` the name table,
//! `refs.rs` reference paths, `maths.rs` math text, `source.rs` reading
//! an element's attributes and children, `boxes.rs` boxing, and
//! `expr.rs` the parse arena for math text. Planners are in their types'
//! files under `components/` (ADR 0016) and use only what `api.rs`
//! exports. What the compile produces is in `plan.rs`.
//!
//! An element that fails is boxed (ADR 0013, ADR 0027, ADR 0030): by
//! `box_in_place`, while outlining, planning or linking, or by
//! `push_error_elem` where no element was made for it yet (a node boxed by
//! an earlier compile, an element that fails before it is pushed, a `$ref`
//! child that cannot be planned). Every read of another element's facts
//! is recorded (`record_read`, ADR 0032), and linking boxes the readers
//! of every box to a fixpoint, so what a box's readers planned from it
//! never stands: a container copy's clones of what is under a box die
//! with the copy. A failure no element can carry (a synthetic element's)
//! is recorded as `restart`, and ends the compile at the next stage
//! boundary; so do sealing's failures. `plan_and_check` boxes the node of
//! such a failure, and of an abstract build failure, from the start of a
//! new compile. No failure's handling depends on what failed before it.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, OnceLock};

use crate::components::{
    ChildrenKind, Collection, ComponentType, Machinery, PropAt, PropFrom, PropSel, prop,
};
use crate::dast::{Dast, NodeId, NodeKind, StrId};
use crate::diagnostics::Diagnostic;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, Post, SymKind, VecOp};
use crate::sym::Tree;
use expr::{Arena, Expr, ExprId, Parser, Token};
use plan::*;

pub(crate) mod api;
mod boxes;
mod check;
pub(crate) mod compare;
pub(crate) mod expr;
mod link;
pub mod lint;
mod maths;
mod names;
mod outline;
mod parse;
pub(crate) mod plan;
mod planning;
pub(crate) mod rebase;
pub(crate) mod record;
mod refs;
mod seal;
mod share;
mod source;

pub use check::diagnose;
pub(crate) use check::{CompileOutput, compile};
pub use plan::Compiled;

/// A failed compile, check or first build: the error, and the node of the
/// element it is about when there is one. `compile` boxes that element (it
/// becomes an `_error` component, the error its diagnostic) and compiles
/// again; an error with no element fails it (ADR 0013). Planning fails
/// this way only where boxing in place cannot (`Compiler::box_in_place`).
pub(crate) struct Failure {
    pub(crate) error: Error,
    pub(crate) node: Option<NodeId>,
}

impl From<Failure> for Error {
    fn from(f: Failure) -> Error {
        f.error
    }
}

use names::*;
use parse::Parsed;
use planning::ctx::PlanCtx;
use planning::planner::Planner;
use record::{ChildValue, ValueChildren};
pub(crate) use seal::keys;

/// A compile that planned: what it planned, and the errors of the
/// elements it boxed where they failed (ADR 0027).
pub(in crate::compile) struct Attempt {
    pub(in crate::compile) compiled: Compiled,
    pub(in crate::compile) errors: Vec<Diagnostic>,
}

/// What every stage of one compile works on, outline to seal (ADR 0030):
/// the source, the compile being made in its parts (`compiled`, what
/// outlining `settled`, the later stages' `tables`), which stage runs,
/// the boxes, and two caches. Nothing here is one stage's own: a stage's
/// working state is a local of its function, and what a stage makes for
/// a later one is its return value and the other's argument (`Outline`,
/// `Parsed`, `Planned`). Each field says which stage writes it (*W*) and
/// which read it (*R*).
pub(in crate::compile) struct Compiler<'a> {
    /// The source being compiled. `compiled.dast` is the same source; this
    /// reference is copied out (`let d = self.dast;`) so a method can read
    /// it while it writes the rest of `self`. R: every stage.
    pub(in crate::compile) dast: &'a Dast,
    /// What the compile makes. W: every stage. Outlining pushes every
    /// element (an answer's synthetic ones too, `add_answer_children`),
    /// template and `$ref` child (`ref_children`), and the references it
    /// reads (every element's `extend`, an answer's whens), and settles
    /// a `<math>`'s type; it plans no prop. Parsing pushes references and
    /// expressions; planning makes `plans` (props, holds, a body's `from`,
    /// what a copy copies) and the `$ref` children's plans
    /// (`ref_child_plans`), and pushes no element; boxing writes `boxes`;
    /// linking
    /// aliases shared ports in `plans`; sealing makes `sealed` and choice
    /// interfaces (ADR 0031).
    pub(in crate::compile) compiled: Compiled,
    /// What outlining settles, which every stage after it reads and none
    /// changes (ADR 0030). W: outline, through `outlined_mut` and the
    /// walk (`push_elem_visible_to`, `push_template`), which `stage`
    /// guards. R: every stage after outlining, through `settled`,
    /// `outlined`, `names`, `choice` and `submitted`.
    settled: Settled,
    /// Boxing's and planning's tables, by `TemplateId` (ADR 0031): what
    /// the stages after outlining write, beside outlining's part
    /// (`Settled::templates`), which they only read. W: boxing (outline,
    /// plan, link), plan; link aliases shared slots in `plans`.
    tables: Vec<Tables>,
    /// The stage running now. W: `compile`, at each stage boundary. R:
    /// boxing, which records it on each box (`make_box`) and reads it to
    /// decide which boxes a reader sees (`is_visible_box`), and the checks
    /// that only outlining makes elements and plans extends.
    stage: Stage,
    /// Every string's canonical id, over the DAST table (built when first
    /// needed) and then `extra_strings`: see `intern_literal`. A cache.
    /// W, R: plan (`intern_literal`).
    pub(in crate::compile) string_ids: Option<HashMap<String, StrId>>,
    /// Nodes an earlier compile could not build: compiled as `_error`
    /// elements with their names but no children and no props (ADR 0013,
    /// ADR 0027). The compile's input, from `plan_and_check`. R: outline
    /// (`add_elem`, `add_children`).
    pub(in crate::compile) boxed: &'a HashSet<NodeId>,
    /// The first failure no element could carry (`box_in_place` of an
    /// element with no node, an unread attribute of a node with no
    /// element): the stage goes on, and the compile ends with it once the
    /// stage is done, its node to be boxed before compiling again, or the
    /// load to fail. W: outline, plan, link (`box_in_place`). R:
    /// `compile`, between stages.
    restart: Option<Failure>,
    /// Elements boxed where they failed, with their errors (ADR 0027).
    /// W: outline, plan, link (`box_in_place`, `push_error_elem`; the
    /// unread-attribute check drops what was under what it boxes).
    /// R: link (the unread-attribute check skips what is boxed), and
    /// `compile`, which returns the errors.
    errors: Vec<Diagnostic>,
    boxed_here: HashSet<NodeId>,
    /// By DAST string, the prop a reference spelled with it last named,
    /// with the type it named it on: a spelling is nearly always used on
    /// one type, so this is an array read. A cache. W, R: every stage that
    /// plans a reference (`prop_sel`).
    pub(in crate::compile) prop_sels: Vec<Option<(ComponentType, Option<PropSel>)>>,
}

/// What outlining hands to the stages after it (ADR 0030): the work it
/// found for them, in the order the walk made it. What it settles of each
/// element is in the templates themselves.
#[derive(Default)]
pub(in crate::compile) struct Outline {
    /// Every element to plan, as outlining made them (`plan_all`).
    to_plan: Vec<(TemplateId, ElemId)>,
    /// Every `$ref` child to plan (`plan_all`).
    macros: Vec<(TemplateId, RefChildId)>,
    /// Each `<math>`'s text, tokenized where its type was settled
    /// (`parse_maths`).
    math_texts: Vec<((TemplateId, ElemId), Result<MathText>)>,
    /// Every read outlining recorded (`record_read`): a container copy's
    /// of its referent's type, and each clone's of its original. Planning
    /// adds its own (`Planned::reads`); linking boxes the readers of
    /// boxes among them (`box_readers_of_boxes`).
    reads: Vec<Read>,
}

/// What outlining settles that the stages after it read and never change
/// (ADR 0030), beside what it settles of each element in the templates.
#[derive(Default)]
pub(in crate::compile) struct Settled {
    /// Outlining's part of every template (ADR 0031): its elements' rows,
    /// its children and its `$ref` children, by `TemplateId`. R: every
    /// stage after outlining; the build, once put together with the other
    /// stages' tables.
    templates: Vec<Outlined>,
    /// Every choice as outlining made it, by `ChoiceId`; sealing finds its
    /// interface (`ChoiceSeal`).
    choices: Vec<ChoiceDef>,
    /// The name table. R: parse and plan (`plan_ref`), link
    /// (`drop_unregistered_name`), seal (choices, keys).
    names: NameTable,
    /// The references in an answer's whens, planned when outlining made
    /// the answer's responses (`add_answer_children`), by macro node.
    /// R: plan (`plan_award`).
    when_refs: HashMap<NodeId, RefId>,
    /// Each `$mi` in an answer's `<when>` that names an input, with the
    /// answer's `response` for that input, which it stands for: credit
    /// reads the submitted copy (`compile/planning/answer.rs`). A fact
    /// about the source, so `plan_ref` plans such a `$mi` as the response
    /// in every stage after outlining. R: `plan_ref`.
    submitted: HashMap<NodeId, ElemId>,
    /// By (template, answer), the `response` outlining made for each input
    /// its whens read, keyed as `input_named` keys them. R: plan
    /// (`plan_award`).
    answer_responses: HashMap<(u32, u32), Vec<(InputKey, ElemId)>>,
}

/// A recorded cross-element read (`Compiler::record_read`): the reader,
/// and the reference to what it read.
pub(in crate::compile) type Read = (TemplateId, ElemId, RefId);

/// What planning makes for linking and sealing (ADR 0030), beside the
/// plans themselves in the templates.
#[derive(Default)]
pub(in crate::compile) struct Planned {
    /// What copies share of their referents' given leaves
    /// (`plan_with_extend`). R: link (`link_given_leaves`).
    shares: Vec<Share>,
    /// By (template, element), which port holds each given leaf of an
    /// element planned by a `Plan` type's planner, by what gave it (ADR
    /// 0032): what a copy shares with its original. R: link
    /// (`link_given_leaves`), seal (`assign_keys`).
    given: HashMap<(u32, u32), HashMap<GivenId, Port>>,
    /// Every read recorded (`record_read`): outlining's (`Outline::reads`,
    /// which planning starts from) and planning's, an element whose plan
    /// read the type of what a reference names. R: link
    /// (`box_readers_of_boxes`), which boxes one whose referent is a box.
    reads: Vec<Read>,
    /// The extends whose referent is in another template, as linking tied
    /// them (`link_given_leaves`). R: share (`compile/share.rs`).
    paths: Vec<share::PathExtend>,
}

/// A given leaf copy `e` shares with its referent (ADR 0023, ADR 0032):
/// port `port` of the copy is to alias the referent's port holding the
/// leaf `id` gave, which only the referent's planning knows. The referent
/// is an element of the same template, or reached by a path from `e`'s.
pub(in crate::compile) struct Share {
    t: TemplateId,
    e: ElemId,
    port: Port,
    referent: Referent,
    id: GivenId,
}

/// What an extend names, as linking ties a share to it: an element of the
/// copy's template, or a path to one in another (`ElemPlan::extend`).
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
    ///
    /// The compile's stages, in order (ADR 0027, ADR 0029, ADR 0030), each
    /// given the results of those before it. A stage boxes every failure
    /// where it arises and goes on; one that could not be boxed there
    /// (`box_in_place`) ends the compile once its stage is done, for
    /// `plan_and_check` to box its node and compile again.
    pub(in crate::compile) fn compile(
        dast: &Arc<Dast>,
        boxed: &HashSet<NodeId>,
        share: bool,
    ) -> std::result::Result<Attempt, Failure> {
        let mut cp = Compiler {
            dast,
            compiled: Compiled {
                dast: dast.clone(),
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
                diagnostics: Arc::default(),
                structural_depth: 0,
                classes: None,
                live: Arc::default(),
                counted: Arc::default(),
                document_constants: Arc::default(),
                prune: false,
                fold: false,
                expr_class: Vec::new(),
            },
            settled: Settled::default(),
            tables: Vec::new(),
            stage: Stage::Outline,
            string_ids: None,
            boxed,
            restart: None,
            errors: Vec::new(),
            boxed_here: HashSet::new(),
            prop_sels: Vec::new(),
        };
        let Outline {
            to_plan,
            macros,
            math_texts,
            reads,
        } = crate::trace::span("outline").run(|| cp.outline());
        cp.restart_if_needed()?;
        // From here on, every stage reads what outlining settled and none
        // changes it. The element set is outlining's (ADR 0030, ADR 0031):
        // planning and linking make none.
        let outlined = cp.elem_count();
        cp.stage = Stage::Parse;
        let mut parsed: Parsed =
            crate::trace::span("parse maths").run(|| cp.parse_maths(math_texts));
        crate::trace::span("parse records").run(|| cp.parse_records(&to_plan, &mut parsed));
        cp.stage = Stage::Plan;
        let mut planned =
            crate::trace::span("plan all").run(|| cp.plan_all(parsed, to_plan, macros, reads));
        cp.restart_if_needed()?;
        cp.stage = Stage::Link;
        crate::trace::span("link").run(|| cp.link(&mut planned))?;
        debug_assert_eq!(
            cp.elem_count(),
            outlined,
            "only outlining makes elements (ADR 0030, ADR 0031)"
        );
        cp.restart_if_needed()?;
        cp.stage = Stage::Seal;
        let (sealed, choice_seals) = crate::trace::span("seal").run(|| cp.seal(&planned))?;
        let _s = crate::trace::span("finish");
        cp.drop_reports_of_boxes();
        // Each stage's tables put together, as the build reads them (ADR
        // 0031).
        let Compiler {
            mut compiled,
            errors,
            tables,
            settled,
            ..
        } = cp;
        let Settled {
            templates, choices, ..
        } = settled;
        compiled.templates = (templates.into_iter().zip(tables).zip(sealed))
            .map(|((outlined, tables), sealed)| Template {
                outlined,
                tables,
                sealed,
            })
            .collect();
        compiled.choices = (choices.into_iter().zip(choice_seals))
            .map(|(def, seal)| seal.into_def(def))
            .collect();
        // Equal computations share one cell (ADR 0033), once every port's
        // type is known.
        if share {
            let shared = crate::trace::span("share").run(|| compiled.share(&planned.paths));
            crate::trace::count("shared ports", shared);
        }
        let c = &mut compiled;
        c.shrink_to_fit();
        if c.has_repeats() {
            c.sym_trees = c.sym_text.keys().map(|&k| (k, OnceLock::new())).collect();
        }
        Ok(Attempt { compiled, errors })
    }
}

impl Compiler<'_> {
    /// What outlining settled, which it alone makes (ADR 0030).
    pub(in crate::compile) fn settled(&self) -> &Settled {
        &self.settled
    }

    /// What outlining settled, to make; only outlining reaches it.
    pub(in crate::compile) fn settled_mut(&mut self) -> &mut Settled {
        debug_assert_eq!(
            self.stage,
            Stage::Outline,
            "only outlining makes what it settled (ADR 0030)"
        );
        &mut self.settled
    }

    /// The name table.
    pub(in crate::compile) fn names(&self) -> &NameTable {
        &self.settled.names
    }

    /// The answer's `response` a `$mi` in a `<when>` stands for
    /// (`Settled::submitted`).
    pub(in crate::compile) fn submitted(&self, m: NodeId) -> Option<ElemId> {
        self.settled.submitted.get(&m).copied()
    }

    /// Outlining's part of template `t`, read-only (ADR 0031).
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

    /// A warning about the element at `node`: a fact about the source
    /// (ADR 0014), kept with the compile's diagnostics. A planner that
    /// cannot honor what the author wrote says so here rather than leaving
    /// a NaN to explain itself (ADR 0016).
    pub(in crate::compile) fn warn(
        &mut self,
        node: NodeId,
        code: &'static str,
        message: &str,
    ) -> Warned {
        Arc::make_mut(&mut self.compiled.diagnostics).push(
            crate::diagnostics::Diagnostic::warning(code, Some(node), message.into()),
        );
        Warned::raised()
    }

    /// How many elements the templates hold.
    fn elem_count(&self) -> usize {
        (0..self.n_templates())
            .map(|t| self.outlined(TemplateId::from_index(t)).elems.len())
            .sum()
    }

    /// The failure to compile again from, when a stage recorded one.
    fn restart_if_needed(&mut self) -> std::result::Result<(), Failure> {
        self.restart.take().map_or(Ok(()), Err)
    }

    pub(in crate::compile) fn elem_label(&self, t: TemplateId, e: ElemId) -> String {
        elem_label(self.dast, self.elem(t, e))
    }
}

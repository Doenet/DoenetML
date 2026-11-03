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
//! | **seal** | `seal.rs`, given `&Planned` | choice interfaces, arity, keys, slot offsets |
//! | **abstract build** | `check.rs`, `build/abstract_build.rs` | cycles, writable and live records, structural depth |
//!
//! `check.rs` drives them (`plan_and_check`): it runs outline to seal
//! (`Compiler::compile`), then the abstract build, which stands for every
//! count and pick (ADR 0012, ADR 0014), and compiles again when a failure
//! could not be boxed where it arose (ADR 0013). Each stage returns what
//! it makes for later ones, and `Compiler::compile` hands it on: work
//! lists as arguments, and what outlining settled ([`Settled`]) and
//! parsing made ([`Parsed`]) as shared references the `Compiler` holds,
//! which the planners read through their context and cannot change. What
//! a stage is still making lives on `Compiler` only while it runs
//! (`outlining`, `planning`). All of them write the compile itself
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
//! child that cannot be planned). A failure `box_in_place` cannot keep in
//! this compile (a container copy cloned what is under the element) is
//! recorded as `restart`, and ends the compile at the next stage
//! boundary; so do sealing's failures. `plan_and_check` boxes the node of
//! such a failure, and of an abstract build failure, from the start of a
//! new compile. No failure's handling depends on what failed before it.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, OnceLock};

use crate::components::{ComponentType, PropAt, PropFrom, PropSel, prop};
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
mod refs;
mod seal;
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
pub(crate) use seal::keys;

/// A compile that planned: what it planned, and the errors of the
/// elements it boxed where they failed (ADR 0027).
pub(in crate::compile) struct Attempt {
    pub(in crate::compile) compiled: Compiled,
    pub(in crate::compile) errors: Vec<Diagnostic>,
}

/// The state of one compile, outline to seal (ADR 0030). Each stage's
/// result is a value: outlining's `Outline` (its work lists, passed to
/// parsing and planning, and its `Settled`), parsing's `Parsed` and
/// planning's `Planned`, passed to linking and sealing. What a stage reads
/// of an earlier one's result it reads through a shared reference
/// (`settled`, `parsed`), so it cannot change it; what a stage is making
/// lives in an `Option` that is `Some` only while that stage runs
/// (`outlining`, `planning`). The rest is the compile itself, its boxes
/// and planning's caches. Each field says which stage writes it (*W*) and
/// which read it (*R*).
pub(in crate::compile) struct Compiler<'a> {
    /// The source being compiled; `compiled` keeps it too. R: every stage.
    pub(in crate::compile) dast: &'a Dast,
    /// What the compile makes. W: every stage. Outlining pushes every
    /// element (an answer's synthetic ones too, `add_answer_children`),
    /// template and `$ref` child (`ref_children`), and the references it
    /// reads (a container copy's `extend`, an answer's whens), and settles
    /// a `<math>`'s type; it plans no prop. Parsing pushes references and
    /// expressions; planning sets props, bodies, holds and `extend`s, and
    /// makes the `$ref` children's plans (`ref_child_plans`), pushing no
    /// element; boxing writes `boxes`; linking aliases shared slots;
    /// sealing makes `sealed` and choice interfaces (ADR 0031).
    pub(in crate::compile) compiled: Compiled,
    /// Outlining's own state, and the `Outline` it is filling: `Some`
    /// only while outlining runs (`outline`), so nothing after it can add
    /// an element or work for a later stage (ADR 0030).
    outlining: Option<Outlining>,
    /// What outlining settled, from parsing on. R: parse, plan, link.
    settled: Option<&'a Settled>,
    /// What parsing made, from planning on. R: plan (the math's planner;
    /// a line's equation, which inlines a parse).
    parsed: Option<&'a Parsed>,
    /// What planning is making: `Some` only while it runs (`plan_all`).
    planning: Option<Planned>,
    /// Macro nodes whose reference is already planned: `$mi` inside an
    /// answer's `<when>` is its submitted response (`plan_answer`).
    /// W: plan (`plan_answer`, set and cleared around one `<when>`).
    /// R: `plan_ref`, while that `<when>` is planned.
    pub(in crate::compile) ref_subst: HashMap<NodeId, RefId>,
    /// Every string's canonical id, over the DAST table (built when first
    /// needed) and then `extra_strings`: see `intern_literal`. A cache.
    /// W, R: plan (`intern_literal`).
    pub(in crate::compile) string_ids: Option<HashMap<String, StrId>>,
    /// Nodes an earlier compile could not build: compiled as `_error`
    /// elements with their names but no children and no props (ADR 0013,
    /// ADR 0027). The compile's input, from `plan_and_check`. R: outline
    /// (`add_elem`, `add_children`).
    pub(in crate::compile) boxed: &'a HashSet<NodeId>,
    /// The first failure that could not be boxed where it arose
    /// (`box_in_place`): its element is boxed all the same and the stage
    /// goes on, and the compile ends with it once the stage is done, its
    /// node to be boxed before compiling again. W: outline, plan, link
    /// (`box_in_place`). R: `compile`, between stages.
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
    /// By (template, element), the reference in the element's `extend`,
    /// planned once (`plan_extend`). A cache. W, R: outline (container
    /// copies), plan.
    extend_refs: HashMap<(u32, u32), RefId>,
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
    /// What it settled for every later stage to read.
    settled: Settled,
}

/// What outlining settles that the stages after it read and never change
/// (ADR 0030), beside what it settles of each element in the templates.
#[derive(Default)]
pub(in crate::compile) struct Settled {
    /// The name table. R: parse and plan (`plan_ref`), link
    /// (`drop_unregistered_name`), seal (choices, keys).
    names: NameTable,
    /// By (template, element), the elements a container copy has cloned:
    /// a clone took its type, so one boxed later cannot be boxed in place
    /// (`box_in_place`).
    cloned: HashSet<(u32, u32)>,
    /// The references in an answer's whens, planned when outlining made
    /// the answer's responses (`add_answer_children`), by macro node.
    /// R: plan (`plan_award`).
    when_refs: HashMap<NodeId, RefId>,
    /// By (template, answer), the `response` outlining made for each input
    /// its whens read, keyed as `input_named` keys them. R: plan
    /// (`plan_award`).
    answer_responses: HashMap<(u32, u32), Vec<(InputKey, ElemId)>>,
    /// Every container copy whose expansion read the type of its referent
    /// (`referent_type`), with the reference. R: link
    /// (`box_readers_of_boxes`).
    referent_readers: Vec<(TemplateId, ElemId, RefId)>,
}

/// What planning makes for linking and sealing (ADR 0030), beside the
/// plans themselves in the templates.
#[derive(Default)]
pub(in crate::compile) struct Planned {
    /// What copies share of their referents' state (`plan_with_extend`).
    /// R: link (`link_shared_state`).
    shares: Vec<Share>,
    /// By (template, element), a geometry element's shared state: which
    /// slot holds each piece of essential state, which a copy shares with
    /// its original. R: link (`link_shared_state`), seal (`assign_keys`).
    shared_state: HashMap<(u32, u32), HashMap<SharedState, u8>>,
    /// Every element whose plan read the type of what a reference names
    /// (`referent_type`), with the reference. R: link
    /// (`box_readers_of_boxes`), which boxes one whose referent is a box.
    referent_readers: Vec<(TemplateId, ElemId, RefId)>,
}

/// Outlining's state while it runs (`Compiler::outlining`).
#[derive(Default)]
pub(in crate::compile) struct Outlining {
    /// What outlining hands on, as it fills it.
    work: Outline,
    /// The container copies (`<graph extend="$g"/>`) the walk found, which
    /// get their clones once every name is in the table
    /// (`expand_container_copies`).
    container_copies: Vec<(TemplateId, ElemId)>,
    /// By (template, element), the container copies expanding now and
    /// those done: one reached again while it expands is a cycle.
    expanding: HashSet<(u32, u32)>,
    expanded: HashSet<(u32, u32)>,
}

/// A piece of essential state copy `e` shares with its referent (ADR
/// 0023): slot `slot` of the copy is to alias the referent's slot for
/// `state`, which only the referent's planning knows.
pub(in crate::compile) struct Share {
    t: TemplateId,
    e: ElemId,
    slot: u8,
    referent: ElemId,
    state: SharedState,
}

/// An input an answer's when reads, as `input_named` keys it: how many
/// templates up, and which element.
pub(in crate::compile) type InputKey = (u32, ElemId);

/// How an element is named in a diagnostic: its name, else its tag.
pub(in crate::compile) fn elem_label(
    dast: &Dast,
    compiled: &Compiled,
    t: TemplateId,
    e: ElemId,
) -> String {
    let el = &compiled.templates[t.index()].elems[e.index()];
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
    ) -> std::result::Result<Attempt, Failure> {
        let mut cp = Compiler {
            dast,
            compiled: Compiled {
                dast: dast.clone(),
                templates: vec![Template::default()],
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
            },
            outlining: None,
            settled: None,
            parsed: None,
            planning: None,
            ref_subst: HashMap::new(),
            string_ids: None,
            boxed,
            restart: None,
            errors: Vec::new(),
            boxed_here: HashSet::new(),
            extend_refs: HashMap::new(),
            prop_sels: Vec::new(),
        };
        let outline = crate::trace::span("outline").run(|| cp.outline());
        cp.restart_if_needed()?;
        let Outline {
            to_plan,
            macros,
            math_texts,
            settled,
        } = outline;
        // From here on, every stage reads what outlining settled and none
        // can change it.
        cp.settled = Some(&settled);
        // The element set is outlining's (ADR 0030, ADR 0031): planning and
        // linking make none.
        let outlined = cp.elem_count();
        let parsed: Parsed = crate::trace::span("parse maths").run(|| cp.parse_maths(math_texts));
        cp.parsed = Some(&parsed);
        let mut planned = crate::trace::span("plan all").run(|| cp.plan_all(to_plan, macros));
        cp.restart_if_needed()?;
        crate::trace::span("link").run(|| cp.link(&mut planned))?;
        debug_assert_eq!(
            cp.elem_count(),
            outlined,
            "only outlining makes elements (ADR 0030, ADR 0031)"
        );
        cp.restart_if_needed()?;
        crate::trace::span("seal").run(|| cp.seal(&planned))?;
        let _s = crate::trace::span("finish");
        cp.drop_reports_of_boxes();
        let c = &mut cp.compiled;
        c.shrink_to_fit();
        if c.has_repeats() {
            c.sym_trees = c.sym_text.keys().map(|&k| (k, OnceLock::new())).collect();
        }
        Ok(Attempt {
            compiled: cp.compiled,
            errors: cp.errors,
        })
    }
}

impl<'a> Compiler<'a> {
    /// What outlining settled; after outlining only.
    pub(in crate::compile) fn settled(&self) -> &'a Settled {
        self.settled
            .expect("what outlining settled is read after it (ADR 0030)")
    }

    /// What parsing made; from planning on.
    pub(in crate::compile) fn parsed(&self) -> &'a Parsed {
        self.parsed
            .expect("what parsing made is read after it (ADR 0030)")
    }

    /// What planning is making; only planning reaches it.
    pub(in crate::compile) fn planning(&mut self) -> &mut Planned {
        self.planning
            .as_mut()
            .expect("only planning makes what linking reads (ADR 0030)")
    }

    /// The name table: outlining's while it is made, then what it settled.
    pub(in crate::compile) fn names(&self) -> &NameTable {
        match &self.outlining {
            Some(o) => &o.work.settled.names,
            None => &self.settled().names,
        }
    }

    /// The elements a container copy cloned, as `names` does.
    fn cloned(&self) -> &HashSet<(u32, u32)> {
        match &self.outlining {
            Some(o) => &o.work.settled.cloned,
            None => &self.settled().cloned,
        }
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
        self.compiled.templates.iter().map(|t| t.elems.len()).sum()
    }

    /// The failure to compile again from, when a stage recorded one.
    fn restart_if_needed(&mut self) -> std::result::Result<(), Failure> {
        self.restart.take().map_or(Ok(()), Err)
    }

    pub(in crate::compile) fn elem_label(&self, t: TemplateId, e: ElemId) -> String {
        elem_label(self.dast, &self.compiled, t, e)
    }
}

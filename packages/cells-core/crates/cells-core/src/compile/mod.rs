//! The compile stage (ADR 0015): the source made, once per load, into
//! what every build stamps. **Plan** walks the DAST once and produces one
//! [`Template`](plan::Template) per repeat body, choice branch and the
//! document, with a *plan* for every prop (a literal, a default, an
//! operator over references, a math, a reference) and every reference (a
//! path through the template nesting: how many levels up the name was
//! found, which element, which `[index]` steps, which prop). Nothing in a
//! plan depends on which iteration it will be stamped in, so all string
//! work happens once per template element. **Check** (`check.rs`) builds
//! the plans once through the probe (`build::probe`, ADR 0012, ADR 0014),
//! which stands for every count and pick, and boxes every element that
//! fails (ADR 0013); `lint.rs` holds the rules that need only the DAST.
//!
//! Files: this one walks the DAST and decides each element's shape;
//! `planner.rs` names each type's planner, which is in the type's file
//! under `components/` (ADR 0016), and `ctx.rs` the [`PlanCtx`] it is
//! given; `api.rs` is all of `compile/` a planner may use. The rest is
//! machinery planners build on: `attrs.rs` plans attribute and math
//! sources, `refs.rs` names and reference paths, `expr.rs` the parse
//! arena for math text, `geometry/` what shapes share (`plan_geo`),
//! `choice.rs` with `condition.rs` the choices, `copies.rs` `extend`,
//! `fix.rs` `fixed`, `answer.rs` answers and `iterates.rs` repeats over
//! lists. What compile produces is in `plan.rs`.

use std::collections::{HashMap, HashSet};
use std::sync::{Arc, OnceLock};

use crate::components::{ComponentType, PropAt, PropFrom, prop};
use crate::dast::{Dast, NodeId, NodeKind, StrId};
use crate::document::{CellIdx, NONE};
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::{OpSpec, Post, SymKind, VecOp};
use crate::sym::Tree;
use expr::{Arena, Expr, ExprId, Parser, Token};
use plan::*;

mod answer;
pub(crate) mod api;
mod attrs;
mod check;
mod choice;
mod condition;
mod copies;
mod ctx;
pub(crate) mod expr;
mod fix;
mod geometry;
mod iterates;
pub mod lint;
pub(crate) mod plan;
mod planner;
mod refs;

pub use check::diagnose;
pub(crate) use check::{CompileOutput, compile};
pub use plan::Compiled;

/// A failed compile, check or first build: the error, and the node of the
/// element it is about when there is one. `compile` boxes that element (it
/// becomes an `_error` component, the error its diagnostic) and compiles
/// again; an error with no element fails it (ADR 0013).
pub(crate) struct Failure {
    pub(crate) error: Error,
    pub(crate) node: Option<NodeId>,
}

impl From<Failure> for Error {
    fn from(f: Failure) -> Error {
        f.error
    }
}

use ctx::PlanCtx;
use planner::Planner;

pub(in crate::compile) struct Compiler<'a> {
    /// The source being compiled; `compiled` keeps it too.
    pub(in crate::compile) dast: &'a Dast,
    pub(in crate::compile) compiled: Compiled,
    /// Elements whose attribute plans are computed once every name exists.
    pub(in crate::compile) pending_elems: Vec<(TemplateId, ElemId)>,
    /// Macro children awaiting plans: (template, owning element or None for
    /// the template's own children, index in that child list, node).
    pub(in crate::compile) pending_macros: Vec<(TemplateId, Option<ElemId>, usize, NodeId)>,
    /// Macro nodes whose reference is already planned: `$mi` inside an
    /// answer's `<when>` is its submitted response (`plan_answer`).
    pub(in crate::compile) ref_subst: HashMap<NodeId, RefId>,
    /// Every string's canonical id, over the DAST table (built when first
    /// needed) and then `extra_strings`: see `intern_literal`.
    pub(in crate::compile) string_ids: Option<HashMap<String, StrId>>,
    /// Nodes an earlier attempt could not build: compiled as `_error`
    /// elements with no name, no children and no props (ADR 0013).
    pub(in crate::compile) boxed: &'a HashSet<NodeId>,
    /// The node of the innermost element whose planning failed, set on
    /// the way out of a failed compile; `build` boxes it and tries again.
    pub(in crate::compile) failed_node: Option<NodeId>,
    /// Per node, how many elements the compile has made for it (an
    /// element's key, `ElemKey`).
    made: HashMap<NodeId, u32>,
    /// The name table: by (template, scope, name), the one descendant of
    /// the scope (or `ROOT_SCOPE`) carrying the name, or `AMBIGUOUS` when
    /// several do. A name is registered at every ancestor of its element.
    names: HashMap<(u32, u32, u32), u32>,
    /// Each element name, trimmed, by its id in `names`.
    name_ids: HashMap<Box<str>, u32>,
    /// (template, name scope, name) of every named element: two siblings
    /// with one name can never be told apart.
    sibling_names: HashSet<(u32, u32, u32)>,
    /// By (template, element), a geometry element's shared state: which slot holds
    /// each piece of essential state, which a copy shares with its original.
    pub(in crate::compile) shared_state: HashMap<(u32, u32), HashMap<SharedState, u8>>,
}

/// A name-table entry naming more than one element.
const AMBIGUOUS: u32 = u32::MAX;

/// What a name names from a scope.
pub(in crate::compile) enum NameHit {
    None,
    One(ElemId),
    Ambiguous,
}

/// The ways an element is planned; see `Compiler::elem_shape`.
enum ElemShape {
    Cloned,
    Synthetic,
    ExtendProp(RefId),
    ContainerCopy(RefId),
    /// Planned as its type's entry in `planner` says.
    ByType(Option<RefId>),
}

impl<'a> Compiler<'a> {
    /// Compile `dast`, with the nodes in `boxed` as `_error` elements. A
    /// failure names the node to box next, when the failing element has one.
    pub(in crate::compile) fn compile(
        dast: &'a Arc<Dast>,
        boxed: &'a HashSet<NodeId>,
    ) -> std::result::Result<Compiled, Failure> {
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
                extra_strings: Vec::new(),
                diagnostics: Vec::new(),
                rebuilds: false,
                structural_depth: None,
            },
            pending_elems: Vec::new(),
            pending_macros: Vec::new(),
            ref_subst: HashMap::new(),
            string_ids: None,
            boxed,
            failed_node: None,
            made: HashMap::new(),
            names: HashMap::new(),
            name_ids: HashMap::new(),
            sibling_names: HashSet::new(),
            shared_state: HashMap::new(),
        };
        match cp.compile_all() {
            Ok(()) => {
                let c = &mut cp.compiled;
                c.shrink_to_fit();
                c.rebuilds = c.has_repeats();
                if c.rebuilds {
                    c.sym_trees = c.sym_text.keys().map(|&k| (k, OnceLock::new())).collect();
                }
                Ok(cp.compiled)
            }
            Err(error) => Err(Failure {
                error,
                node: cp.failed_node,
            }),
        }
    }

    /// A warning about the element at `node`: a fact about the source
    /// (ADR 0014), kept with the compile's diagnostics. A planner that
    /// cannot honor what the author wrote says so here rather than leaving
    /// a NaN to explain itself (ADR 0016).
    pub(in crate::compile) fn warn(&mut self, node: NodeId, code: &'static str, message: &str) {
        self.compiled
            .diagnostics
            .push(crate::diagnostics::Diagnostic::warning(
                code,
                Some(node),
                message.into(),
            ));
    }

    /// Every operator a plan names reads as many inputs as it takes. One
    /// that does not is a core bug, reported on its element here rather
    /// than when a build binds it (`OpSpec::bind`).
    fn check_arity(&mut self) -> Result<()> {
        fn misbound(p: &SourcePlan) -> Option<(OpSpec, usize)> {
            match p {
                SourcePlan::Op(op, args) if !op.accepts(args.len()) => Some((*op, args.len())),
                SourcePlan::FirstIteration(a, b) => misbound(a).or_else(|| misbound(b)),
                _ => None,
            }
        }
        for tpl in &self.compiled.templates {
            for el in &tpl.elems {
                if let Some((op, n)) = el.props.iter().find_map(misbound) {
                    let tag = el.component_type.tag();
                    let error = Error::Internal(format!(
                        "<{tag}> plans {op:?} over {n} inputs, which takes {}",
                        op.arity()
                    ));
                    let node = el.node;
                    self.fail_at(node);
                    return Err(error);
                }
            }
        }
        Ok(())
    }

    fn compile_all(&mut self) -> Result<()> {
        let cp = self;
        let dast = cp.dast;
        // Template 0 is the document: its one child is the root component.
        let doc_el = dast
            .children(Dast::ROOT)
            .iter()
            .copied()
            .find(|&n| dast.kind(n) == NodeKind::Element && dast.str(n) == "document");
        let children = match doc_el {
            Some(el) => vec![Child::Elem(cp.add_elem(0, el, ROOT_SCOPE)?)],
            None => {
                // Synthesize a root when the DAST was not normalized.
                let e = cp.add_synthetic(0, ComponentType::Document, NONE);
                cp.compiled.templates[0].elems[e].props = prop::document::Props {
                    creditAchieved: SourcePlan::Deferred(Deferred::Credit),
                    percentCreditAchieved: SourcePlan::Deferred(Deferred::PercentCredit),
                }
                .into_vec();
                let kids = cp.add_children(0, Some(e), ROOT_SCOPE, dast.children(Dast::ROOT))?;
                cp.compiled.templates[0].elems[e].children = kids;
                vec![Child::Elem(e)]
            }
        };
        cp.compiled.templates[0].children = children;
        // Every name exists now: plan attributes and macro children. Planning
        // a container copy adds elements, so loop until nothing is pending.
        while !cp.pending_elems.is_empty() || !cp.pending_macros.is_empty() {
            for (t, e) in std::mem::take(&mut cp.pending_elems) {
                cp.plan_elem(t, e)?;
            }
            for (t, owner, i, m) in std::mem::take(&mut cp.pending_macros) {
                let scope = match owner {
                    Some(e) => cp.child_scope(t, e),
                    None => ROOT_SCOPE,
                };
                let plan = match cp.plan_ref(t, scope, m) {
                    Ok(p) => p,
                    Err(e) => {
                        cp.fail_at(m);
                        return Err(e);
                    }
                };
                let has_index = dast.macro_has_index(m);
                match owner {
                    Some(e) => {
                        cp.compiled.templates[t].elems[e].children[i] =
                            Child::Macro(plan, has_index)
                    }
                    None => cp.compiled.templates[t].children[i] = Child::Macro(plan, has_index),
                }
            }
        }
        cp.finish_choices()?;
        cp.check_arity()?;
        // Slot offsets, now that planned types know their hidden slot count.
        for tpl in &mut cp.compiled.templates {
            let mut off = 0;
            for el in &mut tpl.elems {
                el.slot_off = off;
                off += el.props.len().max(el.component_type.prop_defs().len()) as u32;
            }
            tpl.n_slots = off;
        }
        Ok(())
    }

    /// Record `node` as the element to box if the compile fails: the
    /// innermost one wins, so a failure inside a child boxes the child.
    pub(in crate::compile) fn fail_at(&mut self, node: NodeId) {
        if node != NONE {
            self.failed_node.get_or_insert(node);
        }
    }

    /// The `_error` element standing for boxed node `node`: no name, no
    /// children, no props.
    fn push_error_elem(&mut self, t: TemplateId, node: NodeId) -> ElemId {
        self.push_elem(t, node, ComponentType::Error, NONE, ROOT_SCOPE)
            .expect("an unnamed element never collides")
    }

    /// Children of element `e` have `e` as their parent.
    pub(in crate::compile) fn child_scope(&self, _t: TemplateId, e: ElemId) -> ElemId {
        e
    }

    pub(in crate::compile) fn push_elem(
        &mut self,
        t: TemplateId,
        node: NodeId,
        component_type: ComponentType,
        name: StrId,
        name_scope: ElemId,
    ) -> Result<ElemId> {
        self.push_elem_visible_to(t, node, component_type, name, name_scope, ROOT_SCOPE)
    }

    /// `push_elem` whose name is registered only up to ancestor `stop`
    /// (inclusive): a container copy's children are reached through the
    /// copy's name, never bare, so they do not make the original ambiguous.
    pub(in crate::compile) fn push_elem_visible_to(
        &mut self,
        t: TemplateId,
        node: NodeId,
        component_type: ComponentType,
        name: StrId,
        name_scope: ElemId,
        stop: ElemId,
    ) -> Result<ElemId> {
        let name_id = (name != NONE).then(|| {
            let s = self.dast.strings.get(name).trim();
            match self.name_ids.get(s) {
                Some(&id) => id,
                None => {
                    let id = self.name_ids.len() as u32;
                    self.name_ids.insert(s.into(), id);
                    id
                }
            }
        });
        let tpl = &mut self.compiled.templates[t];
        let e = tpl.elems.len();
        // A made element is known by the nearest element it belongs to (the
        // template's owner at the top) and its position among those made
        // for that one.
        let key = if node != NONE {
            (node, 0)
        } else {
            let mut a = name_scope;
            let anchor = loop {
                if a == ROOT_SCOPE {
                    break tpl.owner;
                }
                if tpl.elems[a].node != NONE {
                    break tpl.elems[a].node;
                }
                a = tpl.elems[a].name_scope;
            };
            let k = self.made.entry(anchor).or_insert(0);
            *k += 1;
            (anchor, *k)
        };
        tpl.elems.push(Elem {
            node,
            key,
            component_type,
            name,
            name_scope,
            slot_off: 0,
            props: Vec::new(),
            n_public: NPublic::Table,
            children: Vec::new(),
            extend: None,
            cloned: false,
            body: Body::Plain,
        });
        if let Some(id) = name_id {
            // Two siblings with one name can never be told apart.
            if !self.sibling_names.insert((t as u32, name_scope as u32, id)) {
                let s = self.dast.strings.get(name).trim().to_string();
                return Err(Error::DuplicateName(s));
            }
            // Visible from every ancestor up to the template root (or `stop`).
            let mut a = name_scope;
            loop {
                self.names
                    .entry((t as u32, a as u32, id))
                    .and_modify(|o| *o = AMBIGUOUS)
                    .or_insert(e as u32);
                if a == ROOT_SCOPE || a == stop {
                    break;
                }
                a = tpl.elems[a].name_scope;
            }
        }
        Ok(e)
    }

    /// What `name` names from `scope` of template `t`: the one descendant
    /// carrying it, or that several do.
    pub(in crate::compile) fn name_at(&self, t: TemplateId, scope: ElemId, name: &str) -> NameHit {
        let Some(&id) = self.name_ids.get(name.trim()) else {
            return NameHit::None;
        };
        match self.names.get(&(t as u32, scope as u32, id)) {
            None => NameHit::None,
            Some(&AMBIGUOUS) => NameHit::Ambiguous,
            Some(&e) => NameHit::One(e as ElemId),
        }
    }

    pub(in crate::compile) fn add_synthetic(
        &mut self,
        t: TemplateId,
        component_type: ComponentType,
        name: StrId,
    ) -> ElemId {
        self.push_elem(t, NONE, component_type, name, ROOT_SCOPE)
            .expect("synthetic names are unique")
    }

    pub(in crate::compile) fn attr_name_str(&self, el: NodeId, attr: &str) -> Option<StrId> {
        let d = self.dast;
        let a = d.attr(el, attr)?;
        match d.attr_children(a) {
            [t] if d.kind(*t) == NodeKind::Text => Some(d.str_id(*t)),
            _ => None,
        }
    }

    /// Create an element (and, for a repeat, its template) from a DAST
    /// element. A boxed node becomes an `_error` element; a failure
    /// anywhere under `el` marks the innermost failing element.
    pub(in crate::compile) fn add_elem(
        &mut self,
        t: TemplateId,
        el: NodeId,
        name_scope: ElemId,
    ) -> Result<ElemId> {
        if self.boxed.contains(&el) {
            return Ok(self.push_error_elem(t, el));
        }
        let r = self.add_elem_inner(t, el, name_scope);
        if r.is_err() {
            self.fail_at(el);
        }
        r
    }

    fn add_elem_inner(&mut self, t: TemplateId, el: NodeId, name_scope: ElemId) -> Result<ElemId> {
        let d = self.dast;
        let tag = d.str(el);
        let component_type =
            ComponentType::from_tag(tag).ok_or_else(|| Error::UnsupportedTag(tag.to_string()))?;
        // `<group rendered="c">` is a conditional content with one case.
        let component_type =
            if component_type == ComponentType::Group && d.attr(el, "rendered").is_some() {
                ComponentType::ConditionalContent
            } else {
                component_type
            };
        if component_type == ComponentType::Case {
            return Err(Error::Unsupported(
                "<case> outside a <conditionalContent>".into(),
            ));
        }
        let name = self.attr_name_str(el, "name").unwrap_or(NONE);
        let e = self.push_elem(t, el, component_type, name, name_scope)?;
        self.pending_elems.push((t, e));
        let child_scope = e;
        let _ = name_scope;
        match component_type {
            ComponentType::FunctionIterates => {
                // One hidden tuple per iteration, planned with the element
                // (`plan_function_iterates`); it is element 0 of the body.
                let sub = self.compiled.templates.len();
                self.compiled.templates.push(Template {
                    parent: Some((t, e)),
                    owner: el,
                    ..Default::default()
                });
                let it = self.add_synthetic(sub, ComponentType::Tuple, NONE);
                self.compiled.templates[sub].children = vec![Child::Elem(it)];
                self.compiled.templates[t].elems[e].body = Body::Repeat { template: sub };
            }
            ComponentType::RepeatForSequence | ComponentType::RepeatFor => {
                let sub = self.compiled.templates.len();
                self.compiled.templates.push(Template {
                    parent: Some((t, e)),
                    owner: el,
                    ..Default::default()
                });
                // Hidden iteration components first, so `$v` and `$i` resolve
                // anywhere inside the template. A `<repeat>`'s item is a
                // tuple, element 0 of the body, planned with the repeat
                // (`plan_repeat_for`).
                if component_type == ComponentType::RepeatFor {
                    if let Some(vn) = self.attr_name_str(el, "valueName") {
                        self.add_synthetic(sub, ComponentType::Tuple, vn);
                    }
                } else if let Some(vn) = self.attr_name_str(el, "valueName") {
                    let v = self.add_synthetic(sub, ComponentType::SequenceValue, vn);
                    // from and step alias the repeat's own props (one hop up);
                    // k is the iteration position; the rest is the type's chain.
                    let from = self.own_prop_plan(e, "from");
                    let step = self.own_prop_plan(e, "step");
                    use prop::sequence_value as sv;
                    let at = sv::Props::AT;
                    let table = |i| Planned::from_table(ComponentType::SequenceValue, i);
                    let mut wiring = ElemWiring::of(ComponentType::SequenceValue);
                    wiring.set_public(sv::Props {
                        from: SourcePlan::reference(from).into(),
                        step: SourcePlan::reference(step).into(),
                        k: SourcePlan::IterIndex.into(),
                        km1: table(at.km1),
                        scaled: table(at.scaled),
                        value: table(at.value),
                    });
                    self.compiled.templates[sub].elems[v].props = wiring.finish();
                }
                if let Some(iname) = self.attr_name_str(el, "indexName") {
                    let i = self.add_synthetic(sub, ComponentType::Number, iname);
                    self.compiled.templates[sub].elems[i].props = prop::number::Props {
                        value: SourcePlan::IterIndex,
                    }
                    .into_vec();
                }
                let kids = self.add_children(sub, None, ROOT_SCOPE, d.children(el))?;
                self.compiled.templates[sub].children = kids;
                self.compiled.templates[t].elems[e].body = Body::Repeat { template: sub };
            }
            ComponentType::Collect | ComponentType::PointList => {}
            ComponentType::ConditionalContent | ComponentType::Select => {
                self.add_choice(t, e, el)?
            }
            // An answer's and an award's element children are components
            // (inputs, awards, whens); their text and `$ref`s are math the
            // answer's planner reads. A when's content is a condition.
            ComponentType::Answer | ComponentType::Award => {
                let mut kids = Vec::new();
                for &n in d.children(el) {
                    if d.kind(n) == NodeKind::Element {
                        kids.push(Child::Elem(self.add_elem(t, n, child_scope)?));
                    }
                }
                self.compiled.templates[t].elems[e].children = kids;
            }
            ComponentType::When => {}
            // A number's children are its value, not rendered children; the
            // geometric types read their children themselves (a line's
            // equation, a point's constraints).
            _ if matches!(Self::planner(component_type), Planner::Geometric(_))
                || component_type
                    .prop_defs()
                    .iter()
                    .any(|p| p.from == PropFrom::Children) => {}
            _ => {
                let kids = self.add_children(t, Some(e), child_scope, d.children(el))?;
                self.compiled.templates[t].elems[e].children = kids;
            }
        }
        Ok(e)
    }

    /// A plan naming prop `prop` of element `e` in the parent template, as
    /// seen from the repeat's own template (one hop up).
    pub(in crate::compile) fn own_prop_plan(&mut self, e: ElemId, prop: &str) -> RefId {
        self.compiled.refs.push(RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: Some(prop.to_string()),
            display: format!("(repeat).{prop}"),
            node: NONE,
        });
        self.compiled.refs.len() - 1
    }

    pub(in crate::compile) fn add_children(
        &mut self,
        t: TemplateId,
        owner: Option<ElemId>,
        name_scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<Vec<Child>> {
        let d = self.dast;
        let mut kids = Vec::with_capacity(nodes.len());
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Element => {
                    let tag = d.str(n);
                    // Normalizer-synthesized elements: `_repeatSetup` holds
                    // placeholders the expansion creates itself.
                    if tag == "_dynamicChildren" || tag == "_repeatSetup" {
                        continue;
                    }
                    kids.push(Child::Elem(self.add_elem(t, n, name_scope)?));
                }
                // Whitespace-only text between lines is layout and would only
                // become a DOM node; a space between inline items is content
                // (`The $animal $verb.`).
                NodeKind::Text
                    if d.str(n).trim().is_empty()
                        && (d.str(n).contains('\n') || kids.is_empty()) => {}
                NodeKind::Text => kids.push(Child::Text(d.str_id(n))),
                NodeKind::Macro => {
                    if self.boxed.contains(&n) {
                        kids.push(Child::Elem(self.push_error_elem(t, n)));
                        continue;
                    }
                    self.pending_macros.push((t, owner, kids.len(), n));
                    kids.push(Child::Macro(usize::MAX, false));
                }
                NodeKind::Other => {}
            }
        }
        Ok(kids)
    }

    pub(in crate::compile) fn plan_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let r = self.plan_elem_inner(t, e);
        if r.is_err() {
            self.fail_at(self.compiled.templates[t].elems[e].node);
        }
        r
    }

    fn plan_elem_inner(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let component_type = self.compiled.templates[t].elems[e].component_type;
        match self.elem_shape(t, e)? {
            // Every public prop aliases the original's; nothing else to plan.
            ElemShape::Cloned => {
                let n = component_type.prop_defs().len();
                let mut props = vec![SourcePlan::Inherit; n];
                Deferred::mark(component_type, &mut props);
                let el = &mut self.compiled.templates[t].elems[e];
                el.props = props;
                // A list is as long as the original's.
                if component_type.given_coords().is_some() {
                    el.n_public = NPublic::AsReferent;
                }
                Ok(())
            }
            // Synthesized elements (iteration values) come planned.
            ElemShape::Synthetic => Ok(()),
            ElemShape::ExtendProp(p) => self.plan_extend_prop(t, e, p),
            ElemShape::ContainerCopy(p) => self.plan_container_copy(t, e, p),
            ElemShape::ByType(extend) => match Self::planner(component_type) {
                Planner::Props | Planner::PropsThen(_) => self.plan_attrs(t, e, extend),
                Planner::Geometric(plan) => self.plan_geo(t, e, extend, plan),
                Planner::Whole(plan) => plan(&mut PlanCtx::new(self, t, e, None)),
            },
        }
    }

    /// Which way an element is planned, decided from its `extend` attribute
    /// (and whether its type is a container) before any prop is looked at.
    /// Records the extend plan on the element.
    fn elem_shape(&mut self, t: TemplateId, e: ElemId) -> Result<ElemShape> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            cloned,
            ..
        } = self.compiled.templates[t].elems[e];
        if cloned {
            return Ok(ElemShape::Cloned);
        }
        if el == NONE {
            return Ok(ElemShape::Synthetic);
        }
        let extend = match d.attr(el, "extend") {
            Some(a) => {
                let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                    attr: "extend".into(),
                    text: self.attr_text(a).unwrap_or_default(),
                })?;
                let p = self.plan_ref(t, scope, m)?;
                // `<point extend="$c.center"/>`, `<math extend="$c.radius"/>`,
                // `<pointList extend="$l.points"/>`: the element's value
                // props alias the named prop.
                if self.compiled.refs[p].prop.is_some() {
                    return Ok(ElemShape::ExtendProp(p));
                }
                Some(p)
            }
            None => None,
        };
        self.compiled.templates[t].elems[e].extend = extend;
        Ok(match extend {
            Some(p) if component_type.container() => ElemShape::ContainerCopy(p),
            _ => ElemShape::ByType(extend),
        })
    }

    pub(in crate::compile) fn elem_label(&self, t: TemplateId, e: ElemId) -> String {
        let el = &self.compiled.templates[t].elems[e];
        if el.name != NONE {
            self.dast.strings.get(el.name).trim().to_string()
        } else {
            format!("<{}>", el.component_type.tag())
        }
    }
}

//! Expand: stamp templates into components per scope, give `$ref` children
//! their type, expand collects and point lists, and turn every prop's
//! `Source` into a `BuiltSource` (an essential value, an alias, or an
//! operator over slots).

use super::*;
use crate::components::{Collection, PropAt, PropSel};

mod aggregate;
mod choice;
mod math;
mod resolve;

// ---------------------------------------------------------------------------
// Expansion state
// ---------------------------------------------------------------------------

crate::index::index_type! {
    /// A symbolic template a build has planned: a position in the
    /// builder's `sym_templates`, whose leaves are slots.
    pub(in crate::build) struct SymTemplateId;
}

/// An operator as a build plans it: one the program runs, or a symbolic
/// template still over slots.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(in crate::build) enum PlannedOp {
    Spec(OpSpec),
    Template { template: SymTemplateId, post: Post },
}

impl PlannedOp {
    pub(in crate::build) fn n_out(&self) -> usize {
        match self {
            PlannedOp::Spec(spec) => spec.n_out(),
            PlannedOp::Template { .. } => 1,
        }
    }

    /// The inputs a request's inverse may write.
    pub(in crate::build) fn writes(&self) -> u64 {
        match self {
            PlannedOp::Spec(spec) => spec.writes(),
            PlannedOp::Template { .. } => 0,
        }
    }
}

#[derive(Debug, Clone)]
pub(in crate::build) enum BuiltSource {
    Unset,
    /// A given value: essential when a student's action can write it, a
    /// constant otherwise.
    Given(f64),
    /// A constant, never essential: an iteration index, a math handle, the
    /// shared missing-referent cell.
    Const(f64),
    Alias(SlotId),
    /// Operator over `op_inputs[start..start + n]`; for a vector operator,
    /// the head (output 0).
    Op(PlannedOp, u32, u8),
    /// Output `k` of the vector instruction headed at `head`.
    VecOut(SlotId, u8),
}

/// Where a reference path has arrived after walking its steps.
#[derive(Debug, Clone)]
pub(in crate::build) enum Resolved {
    Comp(CompIdx),
    /// An iteration of a repeat, named by `$r[k]`.
    Iter(CompIdx, ScopeId),
    /// An index with no referent (`$r[32]` with ten iterations).
    Missing,
    /// `$r[$n]`: any of `items`, the one the cell `index` names when the
    /// document runs; it names no one component. `label` is the edge to
    /// the index cell's.
    Chosen {
        index: SlotId,
        label: Vec<Coord>,
        items: Vec<Resolved>,
    },
}

/// One expanded choice.
#[derive(Debug, Clone)]
pub(in crate::build) struct ChoiceInst {
    pub(in crate::build) comp: CompIdx,
    /// The scope of each built branch (a select's picks in order; every
    /// case of a reactive choice).
    pub(in crate::build) scopes: Vec<ScopeId>,
    /// The branch each of `scopes` instantiates.
    pub(in crate::build) branch_of: Vec<usize>,
    /// Reactive choice, or a select built with every option: one component
    /// per `ChoiceDef::used` standing for that name in every branch.
    pub(in crate::build) iface_comps: Vec<CompIdx>,
    /// A select whose every option was built.
    pub(in crate::build) every_option: bool,
}

/// One instantiated template element.
#[derive(Debug, Clone, Copy)]
pub(in crate::build) struct Instance {
    pub(in crate::build) scope: ScopeId,
    pub(in crate::build) template: TemplateId,
    pub(in crate::build) elem: ElemId,
    pub(in crate::build) comp: CompIdx,
}

pub(in crate::build) struct Builder<'c> {
    pub(in crate::build) compiled: &'c Compiled,
    /// The session the build reads: carried values, scopes.
    pub(in crate::build) session: &'c Session,
    /// Seed seeded cells again whatever the session carries: a later pass
    /// of a load, before any student has changed a value.
    pub(in crate::build) reseed: bool,
    pub(in crate::build) engine: &'c mut Engine,
    /// Templates of `Instantiate` instructions, cell leaves holding slots
    /// until emit rebinds them to cells and imports them.
    pub(in crate::build) sym_templates: Vec<Tree<SlotId>>,
    /// Slots defining a cell that is not a number, with its type. A cell's
    /// type is its defining slot's, so an alias never changes it.
    pub(in crate::build) typed_slots: Vec<(SlotId, ValueType)>,
    pub(in crate::build) components: ComponentTable,
    pub(in crate::build) slot_base: Vec<SlotId>,
    /// Per component, how many of its slots are public props when that is
    /// not its type table's count (an element whose list holds points).
    /// NONE: the table's.
    pub(in crate::build) n_public: Vec<u32>,
    pub(in crate::build) sources: Vec<BuiltSource>,
    /// Owning component of each slot (prop index = `slot - slot_base[comp]`).
    pub(in crate::build) slot_comp: Vec<CompIdx>,
    pub(in crate::build) op_inputs: Vec<SlotId>,
    /// Carried over from the previous build and extended.
    pub(in crate::build) scopes: ScopeTable,
    /// Per scope: element -> component, for the scope's template.
    pub(in crate::build) scope_comps: Vec<Vec<CompIdx>>,
    /// Per component: index into `instances`, or NONE for synthesized ones.
    pub(in crate::build) comp_instance: Vec<u32>,
    pub(in crate::build) instances: Vec<Instance>,
    /// Per component: index into `repeats` for a repeat component.
    pub(in crate::build) comp_repeat: Vec<u32>,
    pub(in crate::build) repeats: Vec<Repeat>,
    /// `$ref` children awaiting a type: (component, plan, scope, has index).
    pub(in crate::build) pending: Vec<(CompIdx, RefId, ScopeId, bool)>,
    /// Collect components awaiting expansion.
    pub(in crate::build) collects: Vec<CompIdx>,
    /// Point lists awaiting their synthesized children.
    pub(in crate::build) pointlists: Vec<CompIdx>,
    pub(in crate::build) collected: HashMap<CompIdx, Vec<CompIdx>>,
    /// Expanded choices, and the instance each choice component owns.
    pub(in crate::build) choice_insts: Vec<ChoiceInst>,
    pub(in crate::build) comp_choice: HashMap<CompIdx, usize>,
    /// A component standing for whichever branch a choice takes (an
    /// interface name, or in the abstract build a select's whole pick) ->
    /// the branches' components it stands for.
    pub(in crate::build) stand_ins: HashMap<CompIdx, Vec<CompIdx>>,
    /// Per select (in the abstract build): the stand-in for its whole pick.
    pub(in crate::build) pick_stand_ins: HashMap<CompIdx, CompIdx>,
    pub(in crate::build) missing: Option<SlotId>,
    /// One slot per constant an operator or a hold reads, by the value's
    /// bits.
    pub(in crate::build) consts: HashMap<u64, SlotId>,
    /// The slots a `fixed` holds, each with a flag slot; a slot held by
    /// several flags is listed once per flag.
    pub(in crate::build) holds: Vec<(SlotId, SlotId)>,
    /// Essential math slots seeded from another slot's value when first
    /// built: (slot, source slot).
    pub(in crate::build) seeds: Vec<(SlotId, SlotId)>,
    pub(in crate::build) arena: Arena<SlotId>,
    pub(in crate::build) root: CompIdx,
    /// Where the build learns counts, indexed referents, a collect's count
    /// and a select's options.
    pub(in crate::build) view: &'c View<'c>,
    /// The scope each slot was made in.
    pub(in crate::build) slot_scope: Vec<ScopeId>,
    /// Per scope, the repeat component whose iteration it is, or NONE.
    pub(in crate::build) scope_repeat: Vec<CompIdx>,
    /// Collects (a polyline is one) whose count reads the counts of the
    /// repeats they gather from.
    pub(in crate::build) follows_counts: HashSet<CompIdx>,
    /// When the view folds iterations: the slots of the counted values it
    /// found.
    pub(in crate::build) counted_slots: Vec<SlotId>,
    /// When the view folds iterations: the slots whose plan gives a
    /// document constant if they are constants.
    pub(in crate::build) document_slots: Vec<SlotId>,
    /// Sources a slot has in iterations after the first, when the view
    /// folds iterations.
    pub(in crate::build) later_sources: Vec<(SlotId, BuiltSource)>,
    /// The binary operators lowered from the author's math, in the order
    /// lowered.
    pub(in crate::build) author_ops: Vec<SlotId>,
    /// Whether the element whose ports are being made shares its math.
    pub(in crate::build) share_math: bool,
    /// Each expression class instantiated, by scope.
    pub(in crate::build) instantiated: HashMap<(ExprId, ScopeId), ExprId>,
    /// Each node of the build's arena lowered, to its slot.
    pub(in crate::build) lowered: HashMap<ExprId, SlotId>,
    /// When the view folds iterations: the label of the last reference
    /// resolved, and those of reference edges (from slot, to slot) that are
    /// not the identity.
    pub(in crate::build) label: Vec<Coord>,
    pub(in crate::build) labels: HashMap<(SlotId, SlotId), Vec<Coord>>,
    /// The node of the element whose expansion or resolution failed; none
    /// when the failure has no element.
    pub(in crate::build) failed_node: Option<NodeId>,
    /// The abstract build's warnings and structural depth: empty and zero
    /// in any other build.
    pub(in crate::build) diagnostics: Vec<Diagnostic>,
    pub(in crate::build) structural_depth: u32,
}

impl<'c> Builder<'c> {
    pub(in crate::build) fn new(
        c: &'c Compiled,
        session: &'c Session,
        reseed: bool,
        engine: &'c mut Engine,
        view: &'c View<'c>,
    ) -> Self {
        // Size the columns by what every template stamped once makes (all
        // of a document without repeats), or by the previous build with an
        // eighth to spare when there was one. In wasm, capacity reserved and
        // never used still raises the high-water mark.
        let (last_comps, last_slots) = session.last_build;
        let elems: usize = c.templates.iter().map(|t| t.elems.len()).sum();
        let n_slots: usize = c.templates.iter().map(|t| t.sealed.n_slots as usize).sum();
        let guess = elems.max(last_comps);
        let guess = guess + guess / 8;
        let slots = n_slots.max(last_slots);
        let slots = slots + slots / 8;
        Builder {
            compiled: c,
            session,
            reseed,
            engine,
            sym_templates: Vec::new(),
            typed_slots: Vec::new(),
            components: ComponentTable {
                component_type: Vec::with_capacity(guess),
                name: Vec::with_capacity(guess),
                parent: Vec::with_capacity(guess),
                prop_base: Vec::new(),
                prop_cells: Vec::new(),
                child_start: Vec::with_capacity(guess),
                child_count: Vec::with_capacity(guess),
                child_list: Vec::with_capacity(guess),
                dast_node: Vec::with_capacity(guess),
                scope: Vec::with_capacity(guess),
                referent: Vec::with_capacity(guess),
            },
            slot_base: Vec::with_capacity(guess),
            n_public: Vec::with_capacity(guess),
            sources: Vec::with_capacity(slots),
            slot_comp: Vec::with_capacity(slots),
            op_inputs: Vec::new(),
            scopes: session.scopes.clone(),
            scope_comps: Vec::new(),
            comp_instance: Vec::with_capacity(guess),
            instances: Vec::with_capacity(guess),
            comp_repeat: Vec::with_capacity(guess),
            repeats: Vec::new(),
            pending: Vec::new(),
            collects: Vec::new(),
            pointlists: Vec::new(),
            collected: HashMap::new(),
            choice_insts: Vec::new(),
            comp_choice: HashMap::new(),
            stand_ins: HashMap::new(),
            pick_stand_ins: HashMap::new(),
            missing: None,
            consts: HashMap::new(),
            holds: Vec::new(),
            seeds: Vec::new(),
            arena: Arena::default(),
            root: CompIdx::new(0),
            view,
            slot_scope: Vec::with_capacity(slots),
            scope_repeat: Vec::new(),
            follows_counts: HashSet::new(),
            counted_slots: Vec::new(),
            document_slots: Vec::new(),
            later_sources: Vec::new(),
            author_ops: Vec::new(),
            share_math: false,
            instantiated: HashMap::new(),
            lowered: HashMap::new(),
            label: Vec::new(),
            labels: HashMap::new(),
            failed_node: None,
            diagnostics: Vec::new(),
            structural_depth: 0,
        }
    }

    // ---- components and slots ------------------------------------------------

    /// `n_slots` is the public prop count plus any hidden slots the
    /// element's plan added.
    pub(in crate::build) fn new_component(
        &mut self,
        component_type: ComponentType,
        name: StrId,
        parent: CompIdx,
        node: NodeId,
        scope: ScopeId,
        n_slots: usize,
    ) -> CompIdx {
        let idx = CompIdx::from_index(self.components.len());
        self.components.component_type.push(component_type);
        self.components.name.push(name);
        self.components.parent.push(parent);
        self.components.child_start.push(0);
        self.components.child_count.push(0);
        self.components.dast_node.push(node);
        self.components.scope.push(scope);
        self.components.referent.push(CompIdx::NONE);
        self.comp_instance.push(NONE);
        self.comp_repeat.push(NONE);
        self.slot_base.push(SlotId::NONE);
        self.n_public.push(NONE);
        self.allocate_slots(idx, n_slots);
        idx
    }

    /// How many public props component `comp` has: its type table's, then
    /// two per point of its list.
    #[inline]
    pub(in crate::build) fn n_public(&self, comp: CompIdx) -> usize {
        match self.n_public[comp.index()] {
            NONE => self.components.component_type[comp.index()]
                .prop_defs()
                .len(),
            n => n as usize,
        }
    }

    /// The slots of prop `sel` of `comp` (resolved on its type), or None
    /// when they are not slots (a table list as a whole). A point of the
    /// list past the element's length is the missing value, as an index
    /// past a repeat's count is.
    pub(in crate::build) fn sel_slots(
        &mut self,
        comp: CompIdx,
        sel: PropSel,
    ) -> Option<Vec<SlotId>> {
        let component_type = self.components.component_type[comp.index()];
        let at = match sel {
            PropSel::Parts { .. } => {
                return Some(
                    sel.parts()
                        .iter()
                        .map(|&i| self.slot(comp, i as usize))
                        .collect(),
                );
            }
            PropSel::TableList => return None,
            PropSel::At(at) => at,
        };
        let n = self.n_public(comp);
        let coord = |b: &mut Self, k: usize, j: usize| match component_type.list_slot(n, k, j) {
            Some(i) => b.slot(comp, i),
            None => b.missing_slot(),
        };
        Some(match at {
            PropAt::Position(i) => vec![self.slot(comp, i)],
            PropAt::Item(k) => vec![coord(self, k, 0), coord(self, k, 1)],
            PropAt::Coord(k, j) => vec![coord(self, k, j)],
            PropAt::List => (1..=component_type.list_len(n))
                .flat_map(|k| [k, k])
                .zip([0, 1].into_iter().cycle())
                .map(|(k, j)| coord(self, k, j))
                .collect(),
        })
    }

    pub(in crate::build) fn allocate_slots(&mut self, comp: CompIdx, n: usize) {
        self.slot_base[comp.index()] = SlotId::from_index(self.sources.len());
        self.sources
            .extend(std::iter::repeat_n(BuiltSource::Unset, n));
        self.slot_comp.extend(std::iter::repeat_n(comp, n));
        self.slot_scope
            .extend(std::iter::repeat_n(self.components.scope[comp.index()], n));
    }

    #[inline]
    pub(in crate::build) fn slot(&self, comp: CompIdx, prop_index: usize) -> SlotId {
        self.slot_base[comp.index()].offset(prop_index)
    }

    pub(in crate::build) fn set_children(&mut self, comp: CompIdx, kids: &[ChildEntry]) {
        self.components.child_start[comp.index()] = self.components.child_list.len() as u32;
        self.components.child_count[comp.index()] = kids.len() as u32;
        self.components.child_list.extend_from_slice(kids);
    }

    /// A slot that belongs to no component, made for an element in `scope`:
    /// a lowered math subexpression, a shared constant, the missing-referent
    /// cell.
    pub(in crate::build) fn anon_slot(&mut self, source: BuiltSource, scope: ScopeId) -> SlotId {
        let s = SlotId::from_index(self.sources.len());
        self.sources.push(source);
        self.slot_comp.push(CompIdx::NONE);
        self.slot_scope.push(scope);
        s
    }

    /// The one slot holding the constant `v` that operators and holds
    /// read. Never alias a prop to it: every slot aliased to it would be
    /// one cell.
    pub(in crate::build) fn const_slot(&mut self, v: f64) -> SlotId {
        if let Some(&s) = self.consts.get(&v.to_bits()) {
            return s;
        }
        let s = self.anon_slot(BuiltSource::Const(v), ScopeId::DOCUMENT);
        self.consts.insert(v.to_bits(), s);
        s
    }

    /// Whether slot `s` holds a counted value: one the build counts from the
    /// structure it stamped, so it follows the counts. In the abstract build
    /// `found` says whether it is, and is recorded; every other build reads
    /// the record.
    pub(in crate::build) fn is_counted(&mut self, s: SlotId, found: bool) -> bool {
        if self.view.folds_iterations() {
            if found {
                self.counted_slots.push(s);
            }
            return found;
        }
        self.template_slot(s)
            .is_some_and(|(t, ts)| self.compiled.counted.marks(t, ts))
    }

    /// Slot `s`'s source when this build counted `v` for it: a constant,
    /// or for a counted value a derived cell holding `v`.
    pub(in crate::build) fn counted(&mut self, s: SlotId, v: f64, found: bool) -> BuiltSource {
        if self.is_counted(s, found) {
            let k = self.const_slot(v);
            self.op_source(OpSpec::Copy, &[k])
        } else {
            BuiltSource::Const(v)
        }
    }

    pub(in crate::build) fn missing_slot(&mut self) -> SlotId {
        if let Some(s) = self.missing {
            return s;
        }
        let s = self.anon_slot(BuiltSource::Const(f64::NAN), ScopeId::DOCUMENT);
        self.missing = Some(s);
        s
    }

    pub(in crate::build) fn comp_label(&self, comp: CompIdx) -> String {
        let name = self.components.name[comp.index()];
        if name != StrId::NONE {
            self.compiled.dast.strings.get(name).trim().to_string()
        } else {
            format!(
                "<{}>#{}",
                self.components.component_type[comp.index()].tag(),
                comp
            )
        }
    }

    pub(in crate::build) fn slot_label(&self, slot: SlotId) -> String {
        let comp = self.slot_comp[slot.index()];
        if comp == CompIdx::NONE {
            return format!("(anonymous slot {slot})");
        }
        let pi = slot.index() - self.slot_base[comp.index()].index();
        let component_type = self.components.component_type[comp.index()];
        match component_type.prop_name(self.n_public(comp), pi) {
            Some(name) => format!("{}.{name}", self.comp_label(comp)),
            None => format!("{}.(hidden slot {pi})", self.comp_label(comp)),
        }
    }

    // ---- scopes --------------------------------------------------------------

    /// The stable id of iteration `k` of repeat element `node` under
    /// `parent`, created on first use.
    pub(in crate::build) fn scope_for(&mut self, parent: ScopeId, node: NodeId, k: u32) -> ScopeId {
        self.scopes.get_or_insert(parent, node, k)
    }

    /// Nesting depth of a scope: 0 for the document.
    pub(in crate::build) fn scope_depth(&self, mut s: ScopeId) -> u32 {
        let mut d = 0;
        while s != ScopeId::DOCUMENT {
            s = self.scopes[s].0;
            d += 1;
        }
        d
    }

    /// The repeats whose iterations enclose `scope`, innermost first.
    pub(in crate::build) fn enclosing_repeats(&self, mut scope: ScopeId) -> Vec<CompIdx> {
        let mut out = Vec::new();
        while scope != ScopeId::DOCUMENT {
            match self.scope_repeat.get(scope.index()) {
                Some(&r) if r != CompIdx::NONE => out.push(r),
                _ => {}
            }
            scope = self.scopes[scope].0;
        }
        out
    }

    /// Record `node` as the element to box if the build fails; the first
    /// recorded wins, which is the innermost since a failure unwinds.
    pub(in crate::build) fn fail_at(&mut self, node: NodeId) {
        if node != NodeId::NONE {
            self.failed_node.get_or_insert(node);
        }
    }

    /// `fail_at` the element component `comp` came from.
    fn fail_at_comp(&mut self, comp: CompIdx) {
        let node = self.components.dast_node[comp.index()];
        self.fail_at(node);
    }

    pub(in crate::build) fn enter_scope(&mut self, scope: ScopeId, template: TemplateId) {
        let s = scope.index();
        if self.scope_comps.len() <= s {
            self.scope_comps.resize(s + 1, Vec::new());
        }
        self.scope_comps[s] =
            vec![CompIdx::NONE; self.compiled.templates[template.index()].elems.len()];
    }

    // ---- expansion -----------------------------------------------------------

    pub(in crate::build) fn expand_all(&mut self) -> Result<()> {
        self.enter_scope(ScopeId::DOCUMENT, TemplateId::new(0));
        let kids = self.expand(TemplateId::new(0), ScopeId::DOCUMENT, CompIdx::NONE)?;
        self.root = kids
            .iter()
            .find_map(|k| k.as_comp())
            .expect("document root");
        Ok(())
    }

    /// Instantiate template `t` in `scope`; returns the child entries of the
    /// template's own children (the repeat body, or the document).
    pub(in crate::build) fn expand(
        &mut self,
        t: TemplateId,
        scope: ScopeId,
        parent: CompIdx,
    ) -> Result<Vec<ChildEntry>> {
        let n_elems = self.compiled.templates[t.index()].elems.len();
        // Create every element's component first so children can refer to them.
        for e in 0..n_elems {
            // What is under a box is not built (ADR 0027).
            if self.compiled.templates[t.index()].is_dead(ElemId::from_index(e)) {
                continue;
            }
            let tpl = &self.compiled.templates[t.index()];
            let (el, plan) = (
                tpl.row(ElemId::from_index(e)),
                tpl.plan(ElemId::from_index(e)),
            );
            // A copy of a type with a list takes its slots, as many as its
            // referent has, when its referent is known (`place_list_copies`).
            let n_slots = match plan.list {
                ListLen::AsReferent => 0,
                _ => plan.props.len().max(el.component_type.prop_defs().len()),
            };
            // One slot per port, in the wiring's order (ADR 0032); the
            // public ones end with the list's points.
            let n_public = match plan.list {
                ListLen::Points(_) => plan.n_public(el.component_type),
                ListLen::None | ListLen::AsReferent => None,
            };
            let comp =
                self.new_component(el.component_type, el.name, parent, el.node, scope, n_slots);
            if let Some(n) = n_public {
                self.n_public[comp.index()] = n as u32;
            }
            self.scope_comps[scope.index()][e] = comp;
            self.comp_instance[comp.index()] = self.instances.len() as u32;
            self.instances.push(Instance {
                scope,
                template: t,
                elem: ElemId::from_index(e),
                comp,
            });
        }
        // Then child lists, expanding repeats as they come.
        for e in 0..n_elems {
            let comp = self.scope_comps[scope.index()][e];
            if comp == CompIdx::NONE {
                continue;
            }
            let kids = match self.compiled.templates[t.index()]
                .row(ElemId::from_index(e))
                .body
            {
                Body::Repeat { template } => {
                    let node = self.compiled.templates[t.index()]
                        .row(ElemId::from_index(e))
                        .node;
                    let n = self.view.iterations(scope, node);
                    let mut kids = Vec::new();
                    let mut iter_scopes = Vec::with_capacity(n as usize);
                    for k in 1..=n {
                        let s = self.scope_for(scope, node, k);
                        iter_scopes.push(s);
                        if self.scope_repeat.len() <= s.index() {
                            self.scope_repeat.resize(s.index() + 1, CompIdx::NONE);
                        }
                        self.scope_repeat[s.index()] = comp;
                        self.enter_scope(s, template);
                        let mut these = self.expand(template, s, comp)?;
                        kids.append(&mut these);
                    }
                    self.comp_repeat[comp.index()] = self.repeats.len() as u32;
                    self.repeats.push(Repeat {
                        comp,
                        node,
                        scope,
                        iter_scopes,
                        iterations: n,
                    });
                    kids
                }
                Body::Collect { .. } => {
                    self.collects.push(comp);
                    Vec::new()
                }
                Body::Choice(cid) => {
                    let node = self.compiled.templates[t.index()]
                        .row(ElemId::from_index(e))
                        .node;
                    match self.expand_choice(cid, node, scope, comp) {
                        Ok(kids) => kids,
                        Err(err) => {
                            self.fail_at(node);
                            return Err(err);
                        }
                    }
                }
                _ if self.compiled.templates[t.index()]
                    .row(ElemId::from_index(e))
                    .component_type
                    == ComponentType::PointList =>
                {
                    // A point list that extends a list prop, whose points
                    // are synthesized, or a copy of a point list, whose
                    // children are copied once the original's exist
                    // (`expand_pointlist`).
                    self.pointlists.push(comp);
                    Vec::new()
                }
                _ => self.child_entries(t, ElemId::from_index(e), scope, comp),
            };
            self.set_children(comp, &kids);
            for k in kids.iter().filter_map(|k| k.as_comp()) {
                self.components.parent[k.index()] = comp;
            }
        }
        // The template's own children (the repeat body); their parent is the repeat.
        let mut out = Vec::with_capacity(self.compiled.templates[t.index()].children.len());
        for i in 0..self.compiled.templates[t.index()].children.len() {
            let ch = &self.compiled.templates[t.index()].children[i];
            out.push(self.child_entry(t, ch, scope, parent));
        }
        Ok(out)
    }

    pub(in crate::build) fn child_entries(
        &mut self,
        t: TemplateId,
        e: ElemId,
        scope: ScopeId,
        parent: CompIdx,
    ) -> Vec<ChildEntry> {
        let n = self.compiled.templates[t.index()].row(e).children.len();
        let mut kids = Vec::with_capacity(n);
        for i in 0..n {
            let ch = &self.compiled.templates[t.index()].row(e).children[i];
            kids.push(self.child_entry(t, ch, scope, parent));
        }
        kids
    }

    pub(in crate::build) fn child_entry(
        &mut self,
        t: TemplateId,
        ch: &Child,
        scope: ScopeId,
        parent: CompIdx,
    ) -> ChildEntry {
        match *ch {
            Child::Elem(e) => ChildEntry::comp(self.scope_comps[scope.index()][e.index()]),
            Child::Text(s) => ChildEntry::text(s),
            Child::Macro(id) => {
                let tpl = &self.compiled.templates[t.index()];
                let rc = tpl.ref_children[id.index()];
                match tpl.tables.ref_child_plans[id.index()] {
                    RefChildPlan::Ref(plan) => {
                        // Type is unknown until the reference resolves;
                        // Document stands in.
                        let idx = self.new_component(
                            ComponentType::Document,
                            StrId::NONE,
                            parent,
                            NodeId::NONE,
                            scope,
                            0,
                        );
                        self.pending.push((idx, plan, scope, rc.has_index));
                        ChildEntry::comp(idx)
                    }
                    // A `$ref` child that could not be planned is its box
                    // (ADR 0027, ADR 0031); one under a box is never
                    // reached, since a box has no children.
                    RefChildPlan::Boxed | RefChildPlan::Unplanned => {
                        ChildEntry::comp(self.new_component(
                            ComponentType::Error,
                            StrId::NONE,
                            parent,
                            rc.node,
                            scope,
                            0,
                        ))
                    }
                }
            }
        }
    }

    // ---- resolution ----------------------------------------------------------

    /// Copies of a type with a list first, then placeholders without an
    /// index (a collect may gather copies), then collects in document order
    /// and point lists, then indexed placeholders (which may name a
    /// collect's items), then choices' and every prop's sources, then
    /// credit and section numbers.
    pub(in crate::build) fn resolve_all(&mut self) -> Result<()> {
        for i in 0..self.instances.len() {
            let inst = self.instances[i];
            if let Err(e) = self.place_list_copy(inst, &mut Vec::new()) {
                self.fail_at_comp(inst.comp);
                return Err(e);
            }
        }
        let pending = std::mem::take(&mut self.pending);
        for &(idx, plan, scope, _) in pending.iter().filter(|p| !p.3) {
            if let Err(e) = self.place(idx, plan, scope) {
                self.fail_at(self.compiled.refs[plan.index()].node);
                return Err(e);
            }
        }
        let collects = std::mem::take(&mut self.collects);
        for comp in collects {
            if let Err(e) = self.expand_collect(comp) {
                self.fail_at_comp(comp);
                return Err(e);
            }
        }
        let pointlists = std::mem::take(&mut self.pointlists);
        for comp in pointlists {
            if let Err(e) = self.expand_pointlist(comp) {
                self.fail_at_comp(comp);
                return Err(e);
            }
        }
        for &(idx, plan, scope, _) in pending.iter().filter(|p| p.3) {
            if let Err(e) = self.place(idx, plan, scope) {
                self.fail_at(self.compiled.refs[plan.index()].node);
                return Err(e);
            }
        }
        self.choice_sources()?;
        for i in 0..self.instances.len() {
            let inst = self.instances[i];
            if let Err(e) = self.instance_sources(inst) {
                self.fail_at_comp(inst.comp);
                return Err(e);
            }
        }
        self.aggregate_sources();
        self.hold_all()
    }

    /// Hold every slot of every element the compile says is held, each by
    /// its flags, once each has its source. A slot that aliases another
    /// element's gets a cell of its own first, so the hold is on this
    /// element, unless the other is held by the same flags. Elements held by
    /// the same flags that copy one cell share the copy.
    fn hold_all(&mut self) -> Result<()> {
        let mut flags_of: HashMap<CompIdx, Vec<SlotId>> = HashMap::new();
        for i in 0..self.instances.len() {
            let inst = self.instances[i];
            let c: &'c Compiled = self.compiled;
            let flags = match &c.templates[inst.template.index()].plan(inst.elem).hold {
                Hold::Off => continue,
                Hold::Always => vec![self.const_slot(1.0)],
                Hold::While(refs) => {
                    let mut flags = Vec::with_capacity(refs.len());
                    for &p in refs {
                        match self.resolve_one(p, inst.scope) {
                            Ok(s) => flags.push(s),
                            Err(e) => {
                                self.fail_at_comp(inst.comp);
                                return Err(e);
                            }
                        }
                    }
                    flags
                }
            };
            flags_of.insert(inst.comp, flags);
        }
        if flags_of.is_empty() {
            return Ok(());
        }
        let own = |b: &Self, comp: CompIdx, t: SlotId| {
            let owner = b.slot_comp[t.index()];
            owner == comp
                || owner == CompIdx::NONE
                || (flags_of.contains_key(&owner) && flags_of.get(&owner) == flags_of.get(&comp))
        };
        // One copy per copied slot and set of flags.
        let mut copies: HashMap<(SlotId, Vec<SlotId>), SlotId> = HashMap::new();
        for s in SlotId::below(self.sources.len()) {
            let comp = self.slot_comp[s.index()];
            let Some(flags) = flags_of.get(&comp) else {
                continue;
            };
            if let BuiltSource::Alias(t) = self.sources[s.index()]
                && !own(self, comp, t)
            {
                let key = (t, flags.clone());
                self.sources[s.index()] = match copies.get(&key) {
                    // The slot another element held alike copies it to.
                    Some(&first) => BuiltSource::Alias(first),
                    None => {
                        copies.insert(key, s);
                        self.op_source(OpSpec::Copy, &[t])
                    }
                };
            }
            for &f in flags {
                self.holds.push((s, f));
            }
        }
        for i in 0..self.later_sources.len() {
            let (s, BuiltSource::Alias(t)) = self.later_sources[i] else {
                continue;
            };
            let comp = self.slot_comp[s.index()];
            if flags_of.contains_key(&comp) && !own(self, comp, t) {
                self.later_sources[i].1 = self.op_source(OpSpec::Copy, &[t]);
            }
        }
        Ok(())
    }

    /// Give a `$ref` child its type: a copy of a component, a number aliasing
    /// one prop, or a number holding the missing-referent cell.
    pub(in crate::build) fn place(
        &mut self,
        idx: CompIdx,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<()> {
        let (target, prop) = self.resolve(plan, scope)?;
        let through_iteration = matches!(target, Resolved::Iter(..));
        match (target, prop) {
            (Resolved::Missing, _) => {
                self.components.component_type[idx.index()] = ComponentType::Number;
                self.allocate_slots(idx, 1);
                let s = self.slot(idx, prop::number::VALUE);
                self.sources[s.index()] = BuiltSource::Alias(self.missing_slot());
            }
            (target, Some(prop)) => {
                let targets = self.targets_of(target, Some(prop), plan, Some(1), scope)?;
                // A string id shows as a text.
                let is_text = self.value_type(targets[0]) == ValueType::Text;
                let (component_type, value) = if is_text {
                    (ComponentType::Text, prop::text::VALUE)
                } else {
                    (ComponentType::Number, prop::number::VALUE)
                };
                self.components.component_type[idx.index()] = component_type;
                self.allocate_slots(idx, 1);
                let s = self.slot(idx, value);
                self.sources[s.index()] = BuiltSource::Alias(targets[0]);
                self.record_label(s, targets[0]);
            }
            (target, None) => {
                let referent = self.single_component(target, plan)?;
                let component_type = self.components.component_type[referent.index()];
                if matches!(
                    component_type,
                    ComponentType::ConditionalContent | ComponentType::Select | ComponentType::Case
                ) {
                    return Err(Error::Banned(format!(
                        "copying a whole <{}>: reference its interface names instead",
                        component_type.tag()
                    )));
                }
                if !component_type.copyable() {
                    return Err(Error::UncopyableType(component_type.tag().into()));
                }
                // A bare reference to an input is its value (ADR 0025):
                // `$mi` is a math, not a second input. Through an
                // iteration (`$r[1]`) it is the input, as the current
                // core has it (REF-1a).
                if let (false, Some(as_type)) = (through_iteration, component_type.reads_as()) {
                    self.value_copy_into(idx, referent, as_type);
                    return Ok(());
                }
                self.copy_into(idx, referent);
                for pi in 0..self.n_public(referent) {
                    self.record_label(self.slot(idx, pi), self.slot(referent, pi));
                }
            }
        }
        Ok(())
    }

    /// Make `idx` an `as_type` holding `referent`'s value: each
    /// of its props aliases the referent's prop of the same name (a math's
    /// `value` and `expr` from a mathInput's), and one the referent lacks
    /// is the missing value.
    fn value_copy_into(&mut self, idx: CompIdx, referent: CompIdx, as_type: ComponentType) {
        self.components.component_type[idx.index()] = as_type;
        self.components.referent[idx.index()] = referent;
        let defs = as_type.prop_defs();
        let rt = self.components.component_type[referent.index()];
        self.n_public[idx.index()] = defs.len() as u32;
        self.allocate_slots(idx, defs.len());
        for (pi, def) in defs.iter().enumerate() {
            let s = self.slot(idx, pi);
            self.sources[s.index()] = match rt.prop_index(def.name) {
                Some(rp) if rp < self.n_public(referent) => {
                    let target = self.slot(referent, rp);
                    self.record_label(s, target);
                    BuiltSource::Alias(target)
                }
                _ => BuiltSource::Alias(self.missing_slot()),
            };
        }
    }

    /// Make `idx` a copy of `referent`: same type, every slot aliased.
    pub(in crate::build) fn copy_into(&mut self, idx: CompIdx, referent: CompIdx) {
        let component_type = self.components.component_type[referent.index()];
        self.components.component_type[idx.index()] = component_type;
        self.components.referent[idx.index()] = referent;
        let n = self.n_public(referent);
        self.n_public[idx.index()] = self.n_public[referent.index()];
        self.allocate_slots(idx, n);
        for pi in 0..n {
            let s = self.slot(idx, pi);
            self.sources[s.index()] = BuiltSource::Alias(self.slot(referent, pi));
        }
    }

    /// The coordinate slots of each item of a list prop a plan names
    /// (`$l.points`, `$pg.vertices`), trimmed to the live item count.
    pub(in crate::build) fn resolve_items(
        &mut self,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<Vec<[SlotId; 2]>> {
        let (target, prop) = self.resolve(plan, scope)?;
        // An index past the count names no items.
        if matches!(target, Resolved::Missing) {
            return Ok(Vec::new());
        }
        let comp = self.single_component(target, plan)?;
        let component_type = self.components.component_type[comp.index()];
        let prop = prop.ok_or_else(|| Error::PathTooDeep(self.compiled.ref_display(plan)))?;
        // A list: the points the element holds.
        let sel = prop.sel_on(component_type);
        if sel == Some(PropSel::At(PropAt::List)) {
            let n = self.n_public(comp);
            return Ok((1..=component_type.list_len(n))
                .map(|k| {
                    let at = |j| self.slot(comp, component_type.list_slot(n, k, j).unwrap());
                    [at(0), at(1)]
                })
                .collect());
        }
        if sel != Some(PropSel::TableList) {
            return Err(Error::UnknownProp {
                name: self.comp_label(comp),
                prop: prop.name().into_owned(),
            });
        }
        Ok(component_type
            .table_point_positions()
            .iter()
            .map(|&[x, y]| [self.slot(comp, x as usize), self.slot(comp, y as usize)])
            .collect())
    }

    /// Give a point list its children: one synthesized point per item of
    /// the list prop it extends, or copies of the children of the point
    /// list it is a copy of.
    pub(in crate::build) fn expand_pointlist(&mut self, comp: CompIdx) -> Result<()> {
        let inst = self.instances[self.comp_instance[comp.index()] as usize];
        let tpl = &self.compiled.templates[inst.template.index()];
        let plan = tpl.plan(inst.elem);
        let mut kids = Vec::new();
        match (plan.from, plan.extend) {
            (Some(from), _) => {
                let items = self.resolve_items(from, inst.scope)?;
                for [x, y] in items {
                    let n = ComponentType::Point.prop_defs().len();
                    let pt = self.new_component(
                        ComponentType::Point,
                        StrId::NONE,
                        comp,
                        NodeId::NONE,
                        inst.scope,
                        n,
                    );
                    let (sx, sy, sh) = (
                        self.slot(pt, prop::point::X),
                        self.slot(pt, prop::point::Y),
                        self.slot(pt, prop::point::HIDE),
                    );
                    self.sources[sx.index()] = BuiltSource::Alias(x);
                    self.sources[sy.index()] = BuiltSource::Alias(y);
                    self.record_label(sx, x);
                    self.record_label(sy, y);
                    // Not state: a synthesized point has no essential key.
                    self.sources[sh.index()] = BuiltSource::Const(0.0);
                    kids.push(ChildEntry::comp(pt));
                }
            }
            (_, Some(p)) => {
                let (target, _) = self.resolve(p, inst.scope)?;
                // An index past the count copies nothing.
                let referent = match target {
                    Resolved::Missing => CompIdx::NONE,
                    target => self.single_component(target, p)?,
                };
                let (s, n) = if referent == CompIdx::NONE {
                    (0, 0)
                } else {
                    (
                        self.components.child_start[referent.index()] as usize,
                        self.components.child_count[referent.index()] as usize,
                    )
                };
                let originals: Vec<CompIdx> = self.components.child_list[s..s + n]
                    .iter()
                    .filter_map(|e| e.as_comp())
                    .collect();
                for orig in originals {
                    let copy = self.new_component(
                        ComponentType::Document,
                        StrId::NONE,
                        comp,
                        NodeId::NONE,
                        inst.scope,
                        0,
                    );
                    self.copy_into(copy, orig);
                    kids.push(ChildEntry::comp(copy));
                }
            }
            _ => {}
        }
        self.set_children(comp, &kids);
        Ok(())
    }

    /// A source in `scope` over `inputs` whose value nothing reads: it
    /// stands for a value that depends on them in a way the view leaves
    /// open (a collect's count over its repeats' counts, an option a later
    /// iteration may draw), so only its edges matter.
    pub(in crate::build) fn reads(&mut self, inputs: &[SlotId], scope: ScopeId) -> BuiltSource {
        match inputs {
            [] => unreachable!("a stand-in reads something"),
            [x] => self.op_source(OpSpec::Truthy, &[*x]),
            [rest @ .., last] => {
                let acc = rest[1..].iter().fold(rest[0], |acc, &x| {
                    self.op_slot(OpSpec::Max, &[acc, x], scope)
                });
                self.op_source(OpSpec::Max, &[acc, *last])
            }
        }
    }

    /// Descendants of `c` of `component_type`, in document order, not
    /// recursing into a match.
    pub(in crate::build) fn collect_descendants(
        &self,
        c: CompIdx,
        component_type: ComponentType,
        out: &mut Vec<CompIdx>,
    ) {
        let (s, n) = (
            self.components.child_start[c.index()] as usize,
            self.components.child_count[c.index()] as usize,
        );
        for i in s..s + n {
            let Some(e) = self.components.child_list[i].as_comp() else {
                continue;
            };
            if self.components.component_type[e.index()] == component_type {
                out.push(e);
            } else {
                self.collect_descendants(e, component_type, out);
            }
        }
    }

    /// The template components of one iteration: children of the repeat
    /// created in that scope.
    pub(in crate::build) fn iteration_components(
        &self,
        repeat: CompIdx,
        scope: ScopeId,
    ) -> Vec<CompIdx> {
        let (s, n) = (
            self.components.child_start[repeat.index()] as usize,
            self.components.child_count[repeat.index()] as usize,
        );
        self.components.child_list[s..s + n]
            .iter()
            .filter_map(|e| e.as_comp())
            .filter(|&e| self.components.scope[e.index()] == scope)
            .collect()
    }

    /// Give a bare or cloned copy of a type with a list its slots, as many
    /// as its referent has, each an alias of the referent's; a referent that
    /// is such a copy itself is placed first. A copy whose referent is
    /// missing holds the missing value. `visiting` holds the copies being
    /// placed, so a loop of them is a cycle.
    fn place_list_copy(&mut self, inst: Instance, visiting: &mut Vec<CompIdx>) -> Result<()> {
        let tpl = &self.compiled.templates[inst.template.index()];
        let (el, plan) = (tpl.row(inst.elem), tpl.plan(inst.elem));
        let (component_type, extend_plan, n_props) =
            (el.component_type, plan.extend, plan.props.len());
        // Not such a copy, or placed already.
        if plan.list != ListLen::AsReferent || self.n_public[inst.comp.index()] != NONE {
            return Ok(());
        }
        if visiting.contains(&inst.comp) {
            return Err(Error::Cycle(self.comp_label(inst.comp)));
        }
        let referent = match extend_plan {
            Some(p) => self.extend_referent(p, inst.scope, component_type)?,
            None => None,
        };
        let label = self.label.clone();
        let Some(referent) = referent else {
            self.n_public[inst.comp.index()] = component_type.prop_defs().len() as u32;
            self.allocate_slots(inst.comp, n_props);
            return Ok(());
        };
        let ri = self.comp_instance[referent.index()];
        if ri != NONE {
            visiting.push(inst.comp);
            let r = self.instances[ri as usize];
            self.place_list_copy(r, visiting)?;
            visiting.pop();
        }
        self.copy_into(inst.comp, referent);
        let n = self.n_public(referent);
        self.n_public[inst.comp.index()] = n as u32;
        for pi in 0..n {
            let (s, t) = (self.slot(inst.comp, pi), self.slot(referent, pi));
            self.record_label_as(s, t, &label);
        }
        Ok(())
    }

    /// The component an `extend` plan names from `scope`, of the copy's
    /// own type: None for an index past the count, when the copy holds the
    /// missing value wherever it would inherit.
    fn extend_referent(
        &mut self,
        p: RefId,
        scope: ScopeId,
        component_type: ComponentType,
    ) -> Result<Option<CompIdx>> {
        let referent = match self.resolve(p, scope)?.0 {
            Resolved::Missing => return Ok(None),
            target => self.single_component(target, p)?,
        };
        let rk = self.components.component_type[referent.index()];
        if rk != component_type {
            return Err(Error::ExtendTypeMismatch {
                referent: self.compiled.ref_display(p),
                referent_type: rk.tag().into(),
                component_type: component_type.tag().into(),
            });
        }
        Ok(Some(referent))
    }

    /// Sources for every prop of one instantiated element.
    pub(in crate::build) fn instance_sources(&mut self, inst: Instance) -> Result<()> {
        let comp = inst.comp;
        let (component_type, extend_plan) = {
            let tpl = &self.compiled.templates[inst.template.index()];
            (
                tpl.row(inst.elem).component_type,
                tpl.plan(inst.elem).extend,
            )
        };
        let extend = match extend_plan {
            Some(p) => self.extend_referent(p, inst.scope, component_type)?,
            None => None,
        };
        // What a renderer reads through the reference (ADR 0024).
        if let Some(referent) = extend {
            self.components.referent[comp.index()] = referent;
        }
        // A copy of a type with a list was made whole by `place_list_copy`.
        if extend.is_some()
            && self.compiled.templates[inst.template.index()]
                .plan(inst.elem)
                .list
                == ListLen::AsReferent
        {
            return Ok(());
        }
        let n_props = self.compiled.templates[inst.template.index()]
            .plan(inst.elem)
            .props
            .len();
        let slot_off =
            self.compiled.templates[inst.template.index()].sealed.elems[inst.elem.index()].slot_off;
        self.share_math = !self.compiled.expr_class.is_empty()
            && matches!(
                self.compiled.templates[inst.template.index()]
                    .plan(inst.elem)
                    .hold,
                Hold::Off
            );
        for pi in 0..n_props {
            let s = self.slot(comp, pi);
            // What the cell holds is the port's type (ADR 0032).
            let port_type = self
                .compiled
                .port_type(inst.template.index(), slot_off.offset(pi));
            if port_type != PortType::Num {
                self.typed_slots.push((s, port_type.value_type()));
            }
            // `self.compiled` is a shared borrow independent of `self`'s own fields,
            // so plans are read in place while sources are written.
            let c: &'c Compiled = self.compiled;
            let plan = &c.templates[inst.template.index()].plan(inst.elem).props[pi];
            if matches!(plan, Source::Flow(Flow::Aggregate(_))) {
                continue; // materialized from the tree (`fill_aggregate`)
            }
            // Nothing but an aggregate is given its source elsewhere: a
            // slot's source is what its plan says.
            assert!(
                matches!(self.sources[s.index()], BuiltSource::Unset),
                "{} was given a source before its plan",
                self.slot_label(s)
            );
            let source = match plan {
                // The one predicate today: the enclosing repeat's first
                // iteration.
                Source::Specialize(ScopePred::FirstIteration, first, rest) => {
                    match self.view.plans(self.scopes[inst.scope].2) {
                        Plans::First => self.plan_source(first, inst, pi)?,
                        Plans::Rest => self.plan_source(rest, inst, pi)?,
                        Plans::Both => {
                            let rest = self.plan_source(rest, inst, pi)?;
                            self.later_sources.push((s, rest));
                            self.plan_source(first, inst, pi)?
                        }
                    }
                }
                plan => self.plan_source(plan, inst, pi)?,
            };
            if self.view.folds_iterations()
                && matches!(source, BuiltSource::Const(_) | BuiltSource::Given(_))
                && plan.gives_document_constant()
            {
                self.document_slots.push(s);
            }
            self.sources[s.index()] = source;
        }
        Ok(())
    }

    /// The source one plan gives prop `pi` of instance `inst`.
    fn plan_source(&mut self, plan: &'c Source, inst: Instance, pi: usize) -> Result<BuiltSource> {
        let comp = inst.comp;
        let s = self.slot(comp, pi);
        let component_type = self.components.component_type[comp.index()];
        let c: &'c Compiled = self.compiled;
        Ok(match plan {
            Source::Specialize(..) => unreachable!("a nested specialization"),
            Source::Leaf(leaf) => match leaf {
                Leaf::Given(v) => BuiltSource::Given(*v),
                Leaf::GivenText(id) => BuiltSource::Given(id.map_or(f64::NAN, StrId::to_value)),
                Leaf::GivenMath(tree) => match tree {
                    Some(tree) => BuiltSource::Given(self.engine.import(tree).to_value()),
                    None => BuiltSource::Given(f64::NAN),
                },
                Leaf::Const(v) => BuiltSource::Const(*v),
                Leaf::Scope(ScopeConst::IterIndex) => {
                    BuiltSource::Const(self.scopes[inst.scope].2 as f64)
                }
                Leaf::Scope(ScopeConst::SequencePick { from, step, count }) => {
                    let key =
                        c.templates[inst.template.index()].sealed.elems[inst.elem.index()].key;
                    let h = choice::splitmix(self.seeded_stream(inst.scope, key));
                    let k = ((h >> 11) as f64 / (1u64 << 53) as f64 * *count as f64) as u32;
                    BuiltSource::Const(from + step * k.min(count - 1) as f64)
                }
                Leaf::Scope(ScopeConst::Seed(p)) => {
                    let from = self
                        .resolve_one(*p, inst.scope)
                        .map_err(|e| resolve::arity_error_for(e, component_type, pi))?;
                    self.seeds.push((s, from));
                    BuiltSource::Given(f64::NAN)
                }
            },
            Source::Flow(flow) => match flow {
                Flow::Alias(arg) => {
                    BuiltSource::Alias(self.arg_slot(*arg, comp, inst.scope, component_type, pi)?)
                }
                Flow::Op(spec, args) => {
                    let start = self.op_inputs.len() as u32;
                    for &a in args {
                        let slot = self.arg_slot(a, comp, inst.scope, component_type, pi)?;
                        // A reference read by an operator is a number: text
                        // compares only through the planned `Eq` of own slots.
                        if let Arg::Ref(p, _) = a
                            && self.value_type(slot) == ValueType::Text
                        {
                            return Err(Error::Unsupported(format!(
                                "a text value (${}) used as a number",
                                c.ref_display(p)
                            )));
                        }
                        self.op_inputs.push(slot);
                    }
                    BuiltSource::Op(PlannedOp::Spec(*spec), start, byte(args.len()))
                }
                Flow::VecOut(head, k) => BuiltSource::VecOut(self.slot(comp, head.index()), *k),
                Flow::Math(expr) => {
                    let id = self.instantiate_expr(*expr, inst.scope)?;
                    if let Expr::Num(v) = *self.arena.get(id) {
                        // Its own cell: `lower` gives a shared constant.
                        BuiltSource::Const(v)
                    } else if self.arena.is_numeric(id) {
                        BuiltSource::Alias(self.lower(id, inst.scope))
                    } else {
                        BuiltSource::Const(f64::NAN)
                    }
                }
                Flow::MathHandle(expr, post) => {
                    // Symbolic when the compile typed the port math (ADR 0032).
                    if self
                        .compiled
                        .port_type(inst.template.index(), slot_off_of(self, inst).offset(pi))
                        == PortType::Math
                    {
                        self.sym_source(*expr, *post, inst.scope)?
                    } else {
                        // A numeric math is not a math cell (ADR 0005).
                        BuiltSource::Const(f64::NAN)
                    }
                }
                Flow::MathValue(expr) => {
                    if self.is_symbolic(comp) {
                        // Planned only as a `<math>`'s value (`math::props_of`).
                        let expr = self.slot(comp, prop::math::EXPR);
                        self.op_source(OpSpec::Sym(SymKind::Evaluate), &[expr])
                    } else {
                        let id = self.instantiate_expr(*expr, inst.scope)?;
                        if let Expr::Num(v) = *self.arena.get(id) {
                            // `<math>5</math>` is state, as a number literal is: a
                            // drag that reaches it changes it, as in the current core.
                            BuiltSource::Given(v)
                        } else {
                            BuiltSource::Alias(self.lower(id, inst.scope))
                        }
                    }
                }
                Flow::SymExpr(expr, post) => self.sym_source(*expr, *post, inst.scope)?,
                // Left unset: materialized from the tree (`fill_aggregate`).
                Flow::Aggregate(_) => BuiltSource::Unset,
            },
        })
    }

    /// An operator source over `inputs` (at most 255).
    pub(in crate::build) fn op_source(&mut self, spec: OpSpec, inputs: &[SlotId]) -> BuiltSource {
        self.planned_source(PlannedOp::Spec(spec), inputs)
    }

    pub(in crate::build) fn planned_source(
        &mut self,
        op: PlannedOp,
        inputs: &[SlotId],
    ) -> BuiltSource {
        let start = self.op_inputs.len() as u32;
        self.op_inputs.extend_from_slice(inputs);
        BuiltSource::Op(op, start, byte(inputs.len()))
    }

    pub(in crate::build) fn op_slot(
        &mut self,
        spec: OpSpec,
        inputs: &[SlotId],
        scope: ScopeId,
    ) -> SlotId {
        let source = self.op_source(spec, inputs);
        self.anon_slot(source, scope)
    }

    /// `x`, times `gate` when there is one (the product of the enclosing
    /// cases' `active` cells), made in `scope`.
    pub(in crate::build) fn gated(
        &mut self,
        gate: Option<SlotId>,
        x: SlotId,
        scope: ScopeId,
    ) -> SlotId {
        match gate {
            None => x,
            Some(g) => self.op_slot(OpSpec::Mul, &[g, x], scope),
        }
    }
}

/// The slot offset of instance `inst`'s element in its template.
fn slot_off_of(b: &Builder<'_>, inst: Instance) -> TemplateSlot {
    b.compiled.templates[inst.template.index()].sealed.elems[inst.elem.index()].slot_off
}

/// Inheritance as the build makes it, against
/// the test-only components: a bare copy's prop aliases its referent's port
/// in every instance, a copy of a list holds as many points as its
/// referent, and a held copy reads its referent through a cell of its own.
#[cfg(test)]
mod tests {
    use crate::Document;
    use crate::testing::dast::{document, el, load, mac};
    use crate::testing::{prop_value as value, request_prop as request};

    /// The cells of `name.prop`, which may be several.
    fn cells(doc: &Document, path: &str) -> Vec<f64> {
        let (name, prop) = path.rsplit_once('.').unwrap();
        let comp = doc
            .resolve_path(name)
            .unwrap_or_else(|| panic!("no {name}"));
        doc.prop_cells(comp, prop)
            .unwrap_or_else(|| panic!("{name} has no {prop}"))
            .iter()
            .map(|&c| doc.cells[c.index()])
            .collect()
    }

    #[test]
    fn a_bare_copy_of_a_list_holds_its_referents_points() {
        let mut doc = load(document([
            el("testList").name("l").attr("points", "(1,2) (3,4) (5,6)"),
            el("testList").name("m").attr("extend", mac("l")),
        ]))
        .unwrap();
        assert_eq!(cells(&doc, "m.points"), [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]);
        assert_eq!(value(&doc, "m.numPoints"), 3.0);
        request(&mut doc, "m.px3", 7.0);
        assert_eq!(cells(&doc, "l.point3"), [7.0, 6.0]);
    }

    #[test]
    fn a_copy_giving_its_own_list_holds_its_own() {
        let doc = load(document([
            el("testList").name("l").attr("points", "(1,2) (3,4) (5,6)"),
            el("testList")
                .name("m")
                .attr("extend", mac("l"))
                .attr("points", "(7,8)"),
        ]))
        .unwrap();
        assert_eq!(cells(&doc, "m.points"), [7.0, 8.0]);
        assert_eq!(value(&doc, "m.numPoints"), 1.0);
        assert_eq!(cells(&doc, "l.points").len(), 6);
    }

    #[test]
    fn copies_in_a_repeat_alias_the_referent_outside() {
        let mut doc = load(document([
            el("testShape").name("s").attr("a", "1"),
            el("repeatForSequence")
                .name("r")
                .attr("length", "2")
                .child(el("testShape").name("d").attr("extend", mac("s"))),
        ]))
        .unwrap();
        assert_eq!(
            (value(&doc, "r[1].d.a"), value(&doc, "r[2].d.a")),
            (1.0, 1.0)
        );
        request(&mut doc, "r[2].d.a", 5.0);
        assert_eq!((value(&doc, "s.a"), value(&doc, "r[1].d.a")), (5.0, 5.0));
    }

    #[test]
    fn copies_in_a_repeat_alias_their_own_iterations_referent() {
        let mut doc = load(document([el("repeatForSequence")
            .name("r")
            .attr("length", "2")
            .child(el("testShape").name("s").attr("a", "1"))
            .child(el("testShape").name("d").attr("extend", mac("s")))]))
        .unwrap();
        request(&mut doc, "r[1].d.a", 5.0);
        assert_eq!(
            (value(&doc, "r[1].s.a"), value(&doc, "r[2].s.a")),
            (5.0, 1.0)
        );
        assert_eq!(value(&doc, "r[2].d.a"), 1.0);
    }

    #[test]
    fn a_gated_copy_reads_its_referent_through_the_hold() {
        // `fixed="$f"` holds the copy: its inherited `value` is a cell of its
        // own (`OpSpec::Copy`), held, and its referent's is not.
        let mut doc = load(document([
            el("testValue").name("f").attr("value", "1"),
            el("testValue").name("v").attr("value", "3"),
            el("testValue")
                .name("w")
                .attr("extend", mac("v"))
                .attr("fixed", mac("f")),
        ]))
        .unwrap();
        assert_eq!(value(&doc, "w.value"), 3.0);
        request(&mut doc, "v.value", 4.0);
        assert_eq!(value(&doc, "w.value"), 4.0);
        assert_eq!(request(&mut doc, "w.value", 9.0).dropped.len(), 1);
        assert_eq!(value(&doc, "v.value"), 4.0);
        request(&mut doc, "f.value", 0.0);
        assert!(request(&mut doc, "w.value", 9.0).dropped.is_empty());
        assert_eq!(value(&doc, "v.value"), 9.0);
    }
}

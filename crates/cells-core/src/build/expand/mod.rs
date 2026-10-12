//! Expand: stamp templates into components per scope, give `$ref` children
//! their type, expand collects and point lists, and turn every plan into a
//! source (an essential value, an alias, or an operator over slots).

use super::*;

mod choice;
mod math;
mod resolve;
mod scoring;

// ---------------------------------------------------------------------------
// Expansion state
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
pub(in crate::build) enum Source {
    Unset,
    Literal(f64),
    Default(f64),
    /// A constant that is not essential: an iteration index, a collect's
    /// count, a math handle, the shared missing-referent cell.
    Fixed(f64),
    Alias(SlotId),
    /// Operator over `op_inputs[start..start + n]`; for a vector operator,
    /// the head (output 0).
    Op(OpSpec, u32, u8),
    /// Output `k` of the vector instruction headed at `head`.
    VecOut(SlotId, u8),
}

/// `Builder::is_symbolic`'s memo for one component.
#[derive(Debug, Clone, Copy, Default, PartialEq)]
pub(in crate::build) enum MathMode {
    #[default]
    Unknown,
    Numeric,
    Symbolic,
    /// Being decided: a reference cycle back to it counts as numeric.
    Deciding,
}

/// Where a reference path has arrived after walking its steps.
#[derive(Debug, Clone, Copy)]
pub(in crate::build) enum Resolved {
    Comp(CompIdx),
    /// An iteration of a repeat, named by `$r[k]`.
    Iter(CompIdx, ScopeId),
    /// An index with no referent (`$r[32]` with ten iterations).
    Missing,
}

/// One expanded choice.
#[derive(Debug, Clone)]
pub(in crate::build) struct ChoiceInst {
    pub(in crate::build) def: ChoiceId,
    pub(in crate::build) comp: CompIdx,
    /// The scope of each built branch (a select's picks in order; every
    /// case of a reactive choice).
    pub(in crate::build) scopes: Vec<ScopeId>,
    /// The branch each of `scopes` instantiates.
    pub(in crate::build) branch_of: Vec<usize>,
    /// Reactive choice: one `Choose` component per `ChoiceDef::used`.
    pub(in crate::build) iface_comps: Vec<CompIdx>,
}

/// One instantiated template element.
#[derive(Debug, Clone, Copy)]
pub(in crate::build) struct Instance {
    pub(in crate::build) scope: ScopeId,
    pub(in crate::build) template: TemplateId,
    pub(in crate::build) elem: ElemId,
    pub(in crate::build) comp: CompIdx,
}

pub(in crate::build) struct Builder<'c, 'a> {
    pub(in crate::build) compiled: &'c Compiled<'a>,
    pub(in crate::build) carryover: &'c Carryover,
    pub(in crate::build) engine: &'c mut dyn SymEngine,
    /// Templates of `Instantiate` instructions, cell leaves holding slots
    /// until emit rebinds them to cells and imports them.
    pub(in crate::build) sym_templates: Vec<Tree>,
    /// Slots that hold expression handles without being an instruction's
    /// output (essential and fixed math cells).
    pub(in crate::build) math_slots: Vec<SlotId>,
    /// Per component, whether its `expr` is a math cell (`is_symbolic`).
    pub(in crate::build) math_mode: Vec<MathMode>,
    pub(in crate::build) components: ComponentTable,
    pub(in crate::build) slot_base: Vec<u32>,
    pub(in crate::build) sources: Vec<Source>,
    /// Owning component of each slot (prop index = slot - slot_base[comp]).
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
    pub(in crate::build) missing: Option<SlotId>,
    /// Essential math slots seeded from another slot's value when first
    /// built (`SourcePlan::MathEssentialFrom`): (slot, source slot).
    pub(in crate::build) seeds: Vec<(SlotId, SlotId)>,
    pub(in crate::build) arena: Arena,
    pub(in crate::build) root: CompIdx,
}

impl<'c, 'a> Builder<'c, 'a> {
    pub(in crate::build) fn new(
        c: &'c Compiled<'a>,
        carryover: &'c Carryover,
        engine: &'c mut dyn SymEngine,
    ) -> Self {
        // Size the columns from the previous build when there was one.
        let guess = carryover
            .structure
            .essential_values
            .iter()
            .map(|v| v.len())
            .sum::<usize>()
            .max(c.templates.iter().map(|t| t.elems.len()).sum::<usize>() * 2);
        Builder {
            compiled: c,
            carryover,
            engine,
            sym_templates: Vec::new(),
            math_slots: Vec::new(),
            math_mode: Vec::new(),
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
            },
            slot_base: Vec::with_capacity(guess),
            sources: Vec::with_capacity(guess * 2),
            slot_comp: Vec::with_capacity(guess * 2),
            op_inputs: Vec::with_capacity(guess),
            scopes: carryover.structure.scopes.clone(),
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
            missing: None,
            seeds: Vec::new(),
            arena: Arena::default(),
            root: 0,
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
        let idx = self.components.len() as CompIdx;
        self.components.component_type.push(component_type);
        self.components.name.push(name);
        self.components.parent.push(parent);
        self.components.child_start.push(0);
        self.components.child_count.push(0);
        self.components.dast_node.push(node);
        self.components.scope.push(scope);
        self.comp_instance.push(NONE);
        self.comp_repeat.push(NONE);
        self.slot_base.push(NONE);
        self.allocate_slots(idx, n_slots);
        idx
    }

    pub(in crate::build) fn allocate_slots(&mut self, comp: CompIdx, n: usize) {
        self.slot_base[comp as usize] = self.sources.len() as u32;
        self.sources.extend(std::iter::repeat_n(Source::Unset, n));
        self.slot_comp.extend(std::iter::repeat_n(comp, n));
    }

    #[inline]
    pub(in crate::build) fn slot(&self, comp: CompIdx, prop_index: usize) -> SlotId {
        self.slot_base[comp as usize] + prop_index as u32
    }

    pub(in crate::build) fn set_children(&mut self, comp: CompIdx, kids: &[u32]) {
        self.components.child_start[comp as usize] = self.components.child_list.len() as u32;
        self.components.child_count[comp as usize] = kids.len() as u32;
        self.components.child_list.extend_from_slice(kids);
    }

    /// A slot that belongs to no component: a lowered math subexpression, a
    /// literal inside one, the missing-referent cell.
    pub(in crate::build) fn anon_slot(&mut self, source: Source) -> SlotId {
        let s = self.sources.len() as SlotId;
        self.sources.push(source);
        self.slot_comp.push(NONE);
        s
    }

    pub(in crate::build) fn missing_slot(&mut self) -> SlotId {
        if let Some(s) = self.missing {
            return s;
        }
        let s = self.anon_slot(Source::Fixed(f64::NAN));
        self.missing = Some(s);
        s
    }

    pub(in crate::build) fn comp_label(&self, comp: CompIdx) -> String {
        let name = self.components.name[comp as usize];
        if name != NONE {
            self.compiled.dast.strings.get(name).trim().to_string()
        } else {
            format!(
                "<{}>#{}",
                self.components.component_type[comp as usize].tag(),
                comp
            )
        }
    }

    pub(in crate::build) fn slot_label(&self, slot: SlotId) -> String {
        let comp = self.slot_comp[slot as usize];
        if comp == NONE {
            return format!("(anonymous slot {slot})");
        }
        let pi = (slot - self.slot_base[comp as usize]) as usize;
        match self.components.component_type[comp as usize]
            .prop_defs()
            .get(pi)
        {
            Some(def) => format!("{}.{}", self.comp_label(comp), def.name),
            None => format!("{}.(hidden slot {pi})", self.comp_label(comp)),
        }
    }

    // ---- scopes --------------------------------------------------------------

    /// The stable id of iteration `k` of repeat element `node` under
    /// `parent`, created on first use.
    pub(in crate::build) fn scope_for(&mut self, parent: ScopeId, node: NodeId, k: u32) -> ScopeId {
        self.scopes.get_or_insert(parent, node, k)
    }

    pub(in crate::build) fn enter_scope(&mut self, scope: ScopeId, template: TemplateId) {
        let s = scope as usize;
        if self.scope_comps.len() <= s {
            self.scope_comps.resize(s + 1, Vec::new());
        }
        self.scope_comps[s] = vec![NONE; self.compiled.templates[template].elems.len()];
    }

    // ---- expansion -----------------------------------------------------------

    pub(in crate::build) fn expand_all(&mut self) -> Result<()> {
        self.enter_scope(0, 0);
        let kids = self.expand(0, 0, NONE)?;
        self.root = kids
            .iter()
            .copied()
            .find(|&k| k & TEXT_BIT == 0)
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
    ) -> Result<Vec<u32>> {
        let n_elems = self.compiled.templates[t].elems.len();
        // Create every element's component first so children can refer to them.
        for e in 0..n_elems {
            let el = &self.compiled.templates[t].elems[e];
            let n_slots = el.props.len().max(el.component_type.prop_defs().len());
            let comp =
                self.new_component(el.component_type, el.name, parent, el.node, scope, n_slots);
            self.scope_comps[scope as usize][e] = comp;
            self.comp_instance[comp as usize] = self.instances.len() as u32;
            self.instances.push(Instance {
                scope,
                template: t,
                elem: e,
                comp,
            });
        }
        // Then child lists, expanding repeats as they come.
        for e in 0..n_elems {
            let comp = self.scope_comps[scope as usize][e];
            let kids = match self.compiled.templates[t].elems[e].body {
                Body::Repeat { template } => {
                    let node = self.compiled.templates[t].elems[e].node;
                    let n = self
                        .carryover
                        .counts
                        .get(&(scope, node))
                        .copied()
                        .unwrap_or(0);
                    let mut kids = Vec::new();
                    let mut iter_scopes = Vec::with_capacity(n as usize);
                    for k in 1..=n {
                        let s = self.scope_for(scope, node, k);
                        iter_scopes.push(s);
                        self.enter_scope(s, template);
                        let mut these = self.expand(template, s, comp)?;
                        kids.append(&mut these);
                    }
                    self.comp_repeat[comp as usize] = self.repeats.len() as u32;
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
                    let node = self.compiled.templates[t].elems[e].node;
                    self.expand_choice(cid, node, scope, comp)?
                }
                Body::PointList { .. } => {
                    self.pointlists.push(comp);
                    Vec::new()
                }
                _ if self.compiled.templates[t].elems[e].component_type
                    == ComponentType::PointList =>
                {
                    // A copy of a point list: children copied once the
                    // original's exist.
                    self.pointlists.push(comp);
                    Vec::new()
                }
                _ => self.child_entries(t, e, scope, comp),
            };
            self.set_children(comp, &kids);
            for &k in &kids {
                if k & TEXT_BIT == 0 {
                    self.components.parent[k as usize] = comp;
                }
            }
        }
        // The template's own children (the repeat body); their parent is the repeat.
        let mut out = Vec::with_capacity(self.compiled.templates[t].children.len());
        for i in 0..self.compiled.templates[t].children.len() {
            let ch = &self.compiled.templates[t].children[i];
            out.push(self.child_entry(ch, scope, parent));
        }
        Ok(out)
    }

    pub(in crate::build) fn child_entries(
        &mut self,
        t: TemplateId,
        e: ElemId,
        scope: ScopeId,
        parent: CompIdx,
    ) -> Vec<u32> {
        let n = self.compiled.templates[t].elems[e].children.len();
        let mut kids = Vec::with_capacity(n);
        for i in 0..n {
            let ch = &self.compiled.templates[t].elems[e].children[i];
            kids.push(self.child_entry(ch, scope, parent));
        }
        kids
    }

    pub(in crate::build) fn child_entry(
        &mut self,
        ch: &Child,
        scope: ScopeId,
        parent: CompIdx,
    ) -> u32 {
        match *ch {
            Child::Elem(e) => self.scope_comps[scope as usize][e],
            Child::Text(s) => TEXT_BIT | s,
            Child::Macro(plan, has_index) => {
                // Type is unknown until the reference resolves; Document stands in.
                let idx = self.new_component(ComponentType::Document, NONE, parent, NONE, scope, 0);
                self.pending.push((idx, plan, scope, has_index));
                idx
            }
        }
    }

    // ---- resolution ----------------------------------------------------------

    /// Placeholders without an index first (a collect may gather copies),
    /// then collects in document order, then indexed placeholders (which may
    /// name a collect's items), then every prop source.
    pub(in crate::build) fn resolve_all(&mut self) -> Result<()> {
        let pending = std::mem::take(&mut self.pending);
        for &(idx, plan, scope, _) in pending.iter().filter(|p| !p.3) {
            self.place(idx, plan, scope)?;
        }
        let collects = std::mem::take(&mut self.collects);
        for comp in collects {
            self.expand_collect(comp)?;
        }
        let pointlists = std::mem::take(&mut self.pointlists);
        for comp in pointlists {
            self.expand_pointlist(comp)?;
        }
        for &(idx, plan, scope, _) in pending.iter().filter(|p| p.3) {
            self.place(idx, plan, scope)?;
        }
        self.choice_sources();
        for i in 0..self.instances.len() {
            let inst = self.instances[i];
            self.instance_sources(inst)?;
        }
        self.scoring_sources();
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
        match (target, prop) {
            (Resolved::Missing, _) => {
                self.components.component_type[idx as usize] = ComponentType::Number;
                self.allocate_slots(idx, 1);
                let s = self.slot(idx, 0);
                self.sources[s as usize] = Source::Alias(self.missing_slot());
            }
            (_, Some(prop)) => {
                let targets = self.targets_of(target, Some(prop), plan, Some(1))?;
                // A text's value is a string id: it shows as a text.
                let is_text = self.single_component(target, plan).is_ok_and(|c| {
                    self.components.component_type[c as usize] == ComponentType::Text
                }) && prop == "value";
                self.components.component_type[idx as usize] = if is_text {
                    ComponentType::Text
                } else {
                    ComponentType::Number
                };
                self.allocate_slots(idx, 1);
                let s = self.slot(idx, 0);
                self.sources[s as usize] = Source::Alias(targets[0]);
            }
            (target, None) => {
                let referent = self.single_component(target, plan)?;
                let component_type = self.components.component_type[referent as usize];
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
                self.copy_into(idx, referent);
            }
        }
        Ok(())
    }

    /// Make `idx` a copy of `referent`: same type, every slot aliased.
    pub(in crate::build) fn copy_into(&mut self, idx: CompIdx, referent: CompIdx) {
        let component_type = self.components.component_type[referent as usize];
        self.components.component_type[idx as usize] = component_type;
        self.allocate_slots(idx, component_type.prop_defs().len());
        for pi in 0..component_type.prop_defs().len() {
            let s = self.slot(idx, pi);
            self.sources[s as usize] = Source::Alias(self.slot(referent, pi));
        }
    }

    /// The coordinate slots of each item of an array prop a plan names
    /// (`$l.points`, `$pg.vertices`), trimmed to the live item count.
    pub(in crate::build) fn resolve_items(
        &mut self,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<Vec<[SlotId; 2]>> {
        let (target, prop) = self.resolve(plan, scope)?;
        let comp = self.single_component(target, plan)?;
        let component_type = self.components.component_type[comp as usize];
        let prop =
            prop.ok_or_else(|| Error::PathTooDeep(self.compiled.refs[plan].display.clone()))?;
        let items = component_type
            .array_prop(prop)
            .ok_or_else(|| Error::UnknownProp {
                name: self.comp_label(comp),
                prop: prop.into(),
            })?;
        let count_slot = match component_type {
            ComponentType::Polygon => Some(self.slot(comp, prop::polygon::NUM_VERTICES)),
            ComponentType::Circle => Some(self.slot(comp, prop::circle::NUM_THROUGH_POINTS)),
            _ => None,
        };
        let live = match count_slot.map(|s| self.sources[s as usize].clone()) {
            Some(Source::Fixed(n)) => n as usize,
            _ => items.len(),
        };
        Ok(items
            .iter()
            .take(live)
            .map(|[x, y]| {
                [
                    self.slot(comp, component_type.prop_index(x).unwrap()),
                    self.slot(comp, component_type.prop_index(y).unwrap()),
                ]
            })
            .collect())
    }

    /// Give a point list its children: one synthesized point per item of
    /// the array prop it extends, or copies of the children of the point
    /// list it is a copy of.
    pub(in crate::build) fn expand_pointlist(&mut self, comp: CompIdx) -> Result<()> {
        let inst = self.instances[self.comp_instance[comp as usize] as usize];
        let el = &self.compiled.templates[inst.template].elems[inst.elem];
        let mut kids = Vec::new();
        match (el.body.clone(), el.extend) {
            (Body::PointList { from }, _) => {
                let items = self.resolve_items(from, inst.scope)?;
                for [x, y] in items {
                    let pt =
                        self.new_component(ComponentType::Point, NONE, comp, NONE, inst.scope, 3);
                    let (sx, sy, sh) = (
                        self.slot(pt, prop::point::X),
                        self.slot(pt, prop::point::Y),
                        self.slot(pt, prop::point::HIDE),
                    );
                    self.sources[sx as usize] = Source::Alias(x);
                    self.sources[sy as usize] = Source::Alias(y);
                    // Not state: a synthesized point has no essential key.
                    self.sources[sh as usize] = Source::Fixed(0.0);
                    kids.push(pt);
                }
            }
            (_, Some(p)) => {
                let (target, _) = self.resolve(p, inst.scope)?;
                let referent = self.single_component(target, p)?;
                let (s, n) = (
                    self.components.child_start[referent as usize] as usize,
                    self.components.child_count[referent as usize] as usize,
                );
                let originals: Vec<CompIdx> = self.components.child_list[s..s + n].to_vec();
                for orig in originals {
                    let copy = self.new_component(
                        ComponentType::Document,
                        NONE,
                        comp,
                        NONE,
                        inst.scope,
                        0,
                    );
                    self.copy_into(copy, orig);
                    kids.push(copy);
                }
            }
            _ => {}
        }
        self.set_children(comp, &kids);
        Ok(())
    }

    pub(in crate::build) fn expand_collect(&mut self, comp: CompIdx) -> Result<()> {
        let inst = self.instances[self.comp_instance[comp as usize] as usize];
        let Body::Collect {
            from,
            component_type,
        } = self.compiled.templates[inst.template].elems[inst.elem].body
        else {
            unreachable!()
        };
        let (target, _) = self.resolve(from, inst.scope)?;
        let mut found = Vec::new();
        match target {
            Resolved::Comp(c) => self.collect_descendants(c, component_type, &mut found),
            Resolved::Iter(repeat, s) => {
                for c in self.iteration_components(repeat, s) {
                    if self.components.component_type[c as usize] == component_type {
                        found.push(c);
                    } else {
                        self.collect_descendants(c, component_type, &mut found);
                    }
                }
            }
            Resolved::Missing => {}
        }
        let mut copies = Vec::with_capacity(found.len());
        for &c in &found {
            // Created without a type so `copy_into` allocates the slots once.
            let copy = self.new_component(ComponentType::Document, NONE, comp, NONE, inst.scope, 0);
            self.copy_into(copy, c);
            copies.push(copy);
        }
        self.set_children(comp, &copies);
        let s0 = self.slot(comp, 0);
        self.sources[s0 as usize] = Source::Fixed(copies.len() as f64);
        self.collected.insert(comp, copies);
        Ok(())
    }

    /// Descendants of `c` of `component_type`, in document order, not recursing into
    /// a match (as the current core's `recurseToMatchedChildren: false`).
    pub(in crate::build) fn collect_descendants(
        &self,
        c: CompIdx,
        component_type: ComponentType,
        out: &mut Vec<CompIdx>,
    ) {
        let (s, n) = (
            self.components.child_start[c as usize] as usize,
            self.components.child_count[c as usize] as usize,
        );
        for i in s..s + n {
            let e = self.components.child_list[i];
            if e & TEXT_BIT != 0 {
                continue;
            }
            if self.components.component_type[e as usize] == component_type {
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
            self.components.child_start[repeat as usize] as usize,
            self.components.child_count[repeat as usize] as usize,
        );
        self.components.child_list[s..s + n]
            .iter()
            .copied()
            .filter(|&e| e & TEXT_BIT == 0 && self.components.scope[e as usize] == scope)
            .collect()
    }

    /// Sources for every prop of one instantiated element.
    pub(in crate::build) fn instance_sources(&mut self, inst: Instance) -> Result<()> {
        let comp = inst.comp;
        let (component_type, extend_plan) = {
            let el = &self.compiled.templates[inst.template].elems[inst.elem];
            (el.component_type, el.extend)
        };
        let extend = match extend_plan {
            Some(p) => {
                let (target, _) = self.resolve(p, inst.scope)?;
                let referent = self.single_component(target, p)?;
                let rk = self.components.component_type[referent as usize];
                if rk != component_type {
                    return Err(Error::ExtendTypeMismatch {
                        referent: self.compiled.refs[p].display.clone(),
                        referent_type: rk.tag().into(),
                        component_type: component_type.tag().into(),
                    });
                }
                Some(referent)
            }
            None => None,
        };
        let n_props = self.compiled.templates[inst.template].elems[inst.elem]
            .props
            .len();
        for pi in 0..n_props {
            let s = self.slot(comp, pi);
            if !matches!(self.sources[s as usize], Source::Unset) {
                continue; // set during expansion (a collect's count)
            }
            // `self.compiled` is a shared borrow independent of `self`'s own fields,
            // so plans are read in place while sources are written.
            let c: &'c Compiled<'a> = self.compiled;
            let plan = match &c.templates[inst.template].elems[inst.elem].props[pi] {
                SourcePlan::FirstIteration(first, rest) => {
                    if self.scopes[inst.scope].2 == 1 {
                        &**first
                    } else {
                        &**rest
                    }
                }
                plan => plan,
            };
            let source = match plan {
                SourcePlan::FirstIteration(..) => unreachable!("nested FirstIteration"),
                SourcePlan::Literal(v) => Source::Literal(*v),
                SourcePlan::Default(v) => Source::Default(*v),
                SourcePlan::Inherit => {
                    Source::Alias(self.slot(extend.expect("Inherit needs an extend referent"), pi))
                }
                SourcePlan::InheritFrom(k) => Source::Alias(self.slot(
                    extend.expect("Inherit needs an extend referent"),
                    *k as usize,
                )),
                SourcePlan::Fixed(v) => Source::Fixed(*v),
                SourcePlan::Alias(arg) => {
                    Source::Alias(self.arg_slot(*arg, comp, inst.scope, component_type, pi)?)
                }
                SourcePlan::Op(spec, args) => {
                    let start = self.op_inputs.len() as u32;
                    for &a in args {
                        let slot = self.arg_slot(a, comp, inst.scope, component_type, pi)?;
                        self.op_inputs.push(slot);
                    }
                    Source::Op(*spec, start, args.len() as u8)
                }
                SourcePlan::IterIndex => Source::Fixed(self.scopes[inst.scope].2 as f64),
                SourcePlan::Math(expr) => {
                    let id = self.instantiate_expr(*expr, inst.scope)?;
                    if self.arena.is_numeric(id) {
                        Source::Alias(self.lower(id))
                    } else {
                        Source::Fixed(f64::NAN)
                    }
                }
                SourcePlan::MathHandle(expr, post) => {
                    if self.is_symbolic(comp) {
                        self.sym_source(*expr, *post, inst.scope)?
                    } else {
                        // A numeric math is not a math cell (ADR 0005).
                        Source::Fixed(f64::NAN)
                    }
                }
                SourcePlan::MathValue(expr) => {
                    if self.is_symbolic(comp) {
                        let expr = self.slot(comp, 0);
                        self.op_source(OpSpec::Sym(SymKind::Evaluate), &[expr])
                    } else {
                        let id = self.instantiate_expr(*expr, inst.scope)?;
                        if let Expr::Num(v) = *self.arena.get(id) {
                            // `<math>5</math>` is state, as a number literal is: a
                            // drag that reaches it changes it, as in the current core.
                            Source::Literal(v)
                        } else {
                            Source::Alias(self.lower(id))
                        }
                    }
                }
                SourcePlan::SymExpr(expr, post) => self.sym_source(*expr, *post, inst.scope)?,
                SourcePlan::MathEssential(tree) => {
                    self.math_slots.push(s);
                    match tree {
                        Some(tree) => Source::Literal(self.engine.import(tree) as f64),
                        None => Source::Literal(f64::NAN),
                    }
                }
                SourcePlan::MathEssentialFrom(p) => {
                    self.math_slots.push(s);
                    let from = self
                        .resolve_one(*p, inst.scope)
                        .map_err(|e| resolve::arity_error_for(e, component_type, pi))?;
                    self.seeds.push((s, from));
                    Source::Literal(f64::NAN)
                }
                SourcePlan::VecOut(head, k) => Source::VecOut(self.slot(comp, *head as usize), *k),
            };
            if let (Source::Fixed(h), SourcePlan::MathHandle(..) | SourcePlan::SymExpr(..)) =
                (&source, plan)
                && !h.is_nan()
            {
                self.math_slots.push(s);
            }
            self.sources[s as usize] = source;
        }
        Ok(())
    }

    /// An operator source over `inputs` (at most 255).
    pub(in crate::build) fn op_source(&mut self, spec: OpSpec, inputs: &[SlotId]) -> Source {
        let start = self.op_inputs.len() as u32;
        self.op_inputs.extend_from_slice(inputs);
        Source::Op(spec, start, inputs.len() as u8)
    }

    pub(in crate::build) fn op_slot(&mut self, spec: OpSpec, inputs: &[SlotId]) -> SlotId {
        let source = self.op_source(spec, inputs);
        self.anon_slot(source)
    }

    /// `x`, times `gate` when there is one (the product of the enclosing
    /// cases' `active` cells).
    pub(in crate::build) fn gated(&mut self, gate: Option<SlotId>, x: SlotId) -> SlotId {
        match gate {
            None => x,
            Some(g) => self.op_slot(OpSpec::Mul, &[g, x]),
        }
    }
}

//! Choices at expansion: a select's picks from the document seed, a
//! conditional content's cases, and references through a branch interface.
//! The design is in `compile/choice.rs`.

use super::*;

impl<'c> Builder<'c> {
    /// Expand choice `cid` at component `comp`; returns its children.
    pub(in crate::build) fn expand_choice(
        &mut self,
        cid: ChoiceId,
        node: NodeId,
        scope: ScopeId,
        comp: CompIdx,
    ) -> Result<Vec<u32>> {
        let c: &'c Compiled = self.compiled;
        let def = &c.choices[cid];
        let every_option =
            !def.reactive && self.view.options(self.in_iteration(scope)) == Options::Every;
        let mut inst = ChoiceInst {
            def: cid,
            comp,
            scopes: Vec::new(),
            branch_of: Vec::new(),
            iface_comps: Vec::new(),
            every_option,
        };
        let mut kids = Vec::new();
        if !def.reactive {
            let picks = if every_option {
                (0..def.branches.len()).collect()
            } else {
                self.pick(def, scope, node)
            };
            for (j, b) in picks.into_iter().enumerate() {
                let s = self.scope_for(scope, node, j as u32 + 1);
                self.enter_scope(s, def.branches[b]);
                kids.extend(self.expand(def.branches[b], s, comp)?);
                inst.scopes.push(s);
                inst.branch_of.push(b);
            }
            if every_option {
                for name in &def.used {
                    let component_type = def.iface[name].0;
                    let members = self.members(def, name, &inst);
                    let ic = self.stand_in(component_type, &members, comp, scope);
                    self.stand_ins.insert(ic, members);
                    inst.iface_comps.push(ic);
                }
            }
        } else {
            let choice = self.slot(comp, crate::components::prop::conditional_content::CHOICE);
            for k in 1..=def.branches.len() {
                let s = self.scope_for(scope, node, k as u32);
                let n = ComponentType::Case.prop_defs().len();
                let case = self.new_component(ComponentType::Case, NONE, comp, NONE, scope, n);
                let pos = self.anon_slot(BuiltSource::Fixed(k as f64), scope);
                let active_slot = self.slot(case, crate::components::prop::case::ACTIVE);
                self.sources[active_slot as usize] = self.op_source(OpSpec::Eq, &[choice, pos]);
                self.enter_scope(s, def.branches[k - 1]);
                let these = self.expand(def.branches[k - 1], s, case)?;
                self.set_children(case, &these);
                for &x in &these {
                    if x & TEXT_BIT == 0 {
                        self.components.parent[x as usize] = case;
                    }
                }
                kids.push(case);
                inst.scopes.push(s);
                inst.branch_of.push(k - 1);
            }
            for name in &def.used {
                let component_type = def.iface[name].0;
                // Unnamed: a test path `cc.x` finds the active case's `x`.
                let members = self.members(def, name, &inst);
                let ic = self.stand_in(component_type, &members, comp, scope);
                self.stand_ins.insert(ic, members);
                inst.iface_comps.push(ic);
            }
        }
        self.comp_choice.insert(comp, self.choice_insts.len());
        self.choice_insts.push(inst);
        Ok(kids)
    }

    /// The components carrying interface name `name` in every built
    /// branch: the ones its interface component stands for.
    fn members(&self, def: &ChoiceDef, name: &str, inst: &ChoiceInst) -> Vec<CompIdx> {
        let elems = &def.iface[name].1;
        inst.scopes
            .iter()
            .zip(&inst.branch_of)
            .map(|(&s, &b)| self.scope_comps[s as usize][elems[b]])
            .filter(|&m| m != NONE)
            .collect()
    }

    /// A component standing for `members`, of their type, with as many
    /// props as the most any of them has: a list as long as the longest
    /// (ADR 0016), the shorter ones missing past their end.
    fn stand_in(
        &mut self,
        component_type: ComponentType,
        members: &[CompIdx],
        parent: CompIdx,
        scope: ScopeId,
    ) -> CompIdx {
        let n = members
            .iter()
            .map(|&m| self.n_public(m))
            .max()
            .unwrap_or(component_type.prop_defs().len());
        let w = self.new_component(component_type, NONE, parent, NONE, scope, n);
        if n != component_type.prop_defs().len() {
            self.n_public[w as usize] = n as u32;
        }
        w
    }

    /// The probe's stand-in for a whole pick of select `c` built with every
    /// option, whose options each hold one component of one type: it reads
    /// each option's component, so a rule about the referent sees every
    /// option a later iteration may draw (ADR 0014).
    pub(in crate::build) fn whole_pick(&mut self, c: CompIdx) -> Result<CompIdx> {
        if let Some(&w) = self.pick_stand_ins.get(&c) {
            return Ok(w);
        }
        let scopes = self.choice_insts[self.comp_choice[&c]].scopes.clone();
        let members: Vec<CompIdx> = scopes
            .iter()
            .map(|&s| self.iteration_components(c, s)[0])
            .collect();
        let component_type = self.components.component_type[members[0] as usize];
        let scope = self.components.scope[c as usize];
        let w = self.stand_in(component_type, &members, c, scope);
        self.stand_ins.insert(w, members.clone());
        let what = format!("<{}>", component_type.tag());
        self.stand_in_sources(w, &members, None, &what)?;
        self.pick_stand_ins.insert(c, w);
        Ok(w)
    }

    /// Sources and kinds of stand-in `w` for `members`: each prop chooses
    /// among theirs by `choice` when it is given (a reactive choice), else
    /// only reads them (the probe's stand-in for a pick). The members must
    /// hold one kind of value per prop, which the stand-in holds too.
    fn stand_in_sources(
        &mut self,
        w: CompIdx,
        members: &[CompIdx],
        choice: Option<SlotId>,
        what: &str,
    ) -> Result<()> {
        let component_type = self.components.component_type[w as usize];
        let symbolic = members.iter().any(|&m| self.is_symbolic(m));
        self.math_mode
            .resize(self.components.len(), MathMode::Unknown);
        self.math_mode[w as usize] = if symbolic {
            MathMode::Symbolic
        } else {
            MathMode::Numeric
        };
        let n = byte(members.len());
        for pi in 0..self.n_public(w) {
            let branch_slots: Vec<SlotId> = members
                .iter()
                .map(|&m| {
                    if pi < self.n_public(m) {
                        self.slot(m, pi)
                    } else {
                        self.missing_slot()
                    }
                })
                .collect();
            let kinds: Vec<ValueType> = branch_slots.iter().map(|&s| self.value_type(s)).collect();
            if kinds.iter().any(|&k| k != kinds[0]) {
                return Err(Error::Unsupported(format!(
                    "{what} holds a different kind of value (number, text or math) in different branches: its '{}' must be the same kind in each",
                    component_type
                        .prop_name(self.n_public(w), pi)
                        .unwrap_or_default()
                )));
            }
            let s = self.slot(w, pi);
            self.sources[s as usize] = match choice {
                None => {
                    // An edge to the prop in every option.
                    let scope = self.components.scope[w as usize];
                    self.reads(&branch_slots, scope)
                }
                Some(choice) => {
                    let inputs: Vec<SlotId> = std::iter::once(choice).chain(branch_slots).collect();
                    self.op_source(OpSpec::Vec(VecOp::Choose { n }), &inputs)
                }
            };
            if kinds.first() == Some(&ValueType::Text) {
                self.typed_slots.push((s, ValueType::Text));
            }
        }
        if symbolic && let Some(pi) = component_type.prop_index("expr") {
            let s = self.slot(w, pi);
            self.typed_slots.push((s, ValueType::Math));
        }
        Ok(())
    }

    /// A select's picks: option indices drawn from a stream that depends on
    /// the document seed and the select's position (its element and the
    /// iteration chain it sits in), so it draws the same way in every build.
    /// Compile has checked that the picks can be drawn (`plan_choice`).
    fn pick(&self, def: &ChoiceDef, scope: ScopeId, node: NodeId) -> Vec<usize> {
        let n = def.branches.len();
        // A select with no options picks nothing.
        if n == 0 {
            return Vec::new();
        }
        let mut h = self.seeded_stream(scope, node);
        let mut weights = def.weights.clone();
        let mut picks = Vec::with_capacity(def.num_to_select as usize);
        for _ in 0..def.num_to_select {
            h = splitmix(h);
            let total: f64 = weights.iter().sum();
            let mut r = (h >> 11) as f64 / (1u64 << 53) as f64 * total;
            let mut b = n - 1;
            for (i, &w) in weights.iter().enumerate() {
                if r < w {
                    b = i;
                    break;
                }
                r -= w;
            }
            picks.push(b);
            if !def.with_replacement {
                weights[b] = 0.0;
            }
        }
        picks
    }

    /// Sources of the `Choose` components of built reactive choices: each
    /// public prop chooses among the branches' cells by the choice cell.
    /// Runs before instance sources, so a symbolic interface math is known
    /// to be one when its copies are planned.
    pub(in crate::build) fn choice_sources(&mut self) -> Result<()> {
        for i in 0..self.choice_insts.len() {
            let inst = self.choice_insts[i].clone();
            let choice = (!inst.every_option)
                .then(|| self.slot(inst.comp, prop::conditional_content::CHOICE));
            let def = &self.compiled.choices[inst.def];
            for (u, &ic) in inst.iface_comps.iter().enumerate() {
                let members = self.stand_ins[&ic].clone();
                let what = format!("'{}'", def.used[u]);
                if let Err(e) = self.stand_in_sources(ic, &members, choice, &what) {
                    self.fail_at_comp(inst.comp);
                    return Err(e);
                }
            }
        }
        Ok(())
    }

    /// Where interface name `used[u]` of choice `cid` lands from `cur`.
    pub(in crate::build) fn resolve_iface(
        &self,
        cid: ChoiceId,
        u: u32,
        cur: Resolved,
    ) -> (Resolved, ScopeId) {
        let def = &self.compiled.choices[cid];
        let elems = &def.iface[&def.used[u as usize]].1;
        let in_branch = |inst: &ChoiceInst, j: usize| {
            let s = inst.scopes[j];
            (
                Resolved::Comp(self.scope_comps[s as usize][elems[inst.branch_of[j]]]),
                s,
            )
        };
        match cur {
            Resolved::Iter(c, s) => {
                let inst = &self.choice_insts[self.comp_choice[&c]];
                let j = inst
                    .scopes
                    .iter()
                    .position(|&x| x == s)
                    .expect("a pick of this select");
                in_branch(inst, j)
            }
            Resolved::Comp(c) => {
                let inst = &self.choice_insts[self.comp_choice[&c]];
                (
                    Resolved::Comp(inst.iface_comps[u as usize]),
                    self.components.scope[c as usize],
                )
            }
            Resolved::Missing => (Resolved::Missing, 0),
        }
    }
}

impl<'c> Builder<'c> {
    /// The start of a load-time choice's stream: the document seed mixed
    /// with the element and the iteration chain it sits in, so it draws the
    /// same way in every build.
    pub(super) fn seeded_stream(&self, scope: ScopeId, node: NodeId) -> u64 {
        let mut h = splitmix(self.view.seed() ^ 0x5eed_5e1e_c7ed_0001);
        h = splitmix(h ^ node as u64);
        let mut s = scope;
        while s != 0 {
            let (parent, n, k) = self.scopes[s];
            h = splitmix(h ^ ((n as u64) << 32 | k as u64));
            s = parent;
        }
        h
    }
}

pub(super) fn splitmix(x: u64) -> u64 {
    let mut z = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    z ^ (z >> 31)
}

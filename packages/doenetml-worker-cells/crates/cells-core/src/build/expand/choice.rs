//! Choices at expansion: a select's picks from the document seed, a
//! conditional content's cases, and references through a branch interface.
//! The design is in `compile/choice.rs`.

use super::*;

impl<'c, 'a> Builder<'c, 'a> {
    /// Expand choice `cid` at component `comp`; returns its children.
    pub(in crate::build) fn expand_choice(
        &mut self,
        cid: ChoiceId,
        node: NodeId,
        scope: ScopeId,
        comp: CompIdx,
    ) -> Result<Vec<u32>> {
        let c: &'c Compiled<'a> = self.compiled;
        let def = &c.choices[cid];
        let mut inst = ChoiceInst {
            def: cid,
            comp,
            scopes: Vec::new(),
            branch_of: Vec::new(),
            iface_comps: Vec::new(),
        };
        let mut kids = Vec::new();
        if !def.reactive {
            for (j, b) in self.pick(def, scope, node)?.into_iter().enumerate() {
                let s = self.scope_for(scope, node, j as u32 + 1);
                self.enter_scope(s, def.branches[b]);
                kids.extend(self.expand(def.branches[b], s, comp)?);
                inst.scopes.push(s);
                inst.branch_of.push(b);
            }
        } else {
            let choice = self.slot(comp, crate::components::prop::conditional_content::CHOICE);
            for k in 1..=def.branches.len() {
                let s = self.scope_for(scope, node, k as u32);
                let case = self.new_component(ComponentType::Case, NONE, comp, NONE, scope, 1);
                let pos = self.anon_slot(Source::Fixed(k as f64));
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
                let ic = self.new_component(
                    component_type,
                    NONE,
                    comp,
                    NONE,
                    scope,
                    component_type.prop_defs().len(),
                );
                inst.iface_comps.push(ic);
            }
        }
        self.comp_choice.insert(comp, self.choice_insts.len());
        self.choice_insts.push(inst);
        Ok(kids)
    }

    /// A select's picks: option indices drawn from a stream that depends on
    /// the document seed and the select's position (its element and the
    /// iteration chain it sits in), so it draws the same way in every build.
    fn pick(&self, def: &ChoiceDef, scope: ScopeId, node: NodeId) -> Result<Vec<usize>> {
        let n = def.branches.len();
        // A select with no options picks nothing.
        if n == 0 {
            return Ok(Vec::new());
        }
        if !def.with_replacement && def.num_to_select as usize > n {
            return Err(Error::Unsupported(format!(
                "numToSelect={} is more than the {n} options of a <select> without replacement",
                def.num_to_select
            )));
        }
        let mut h = splitmix(self.carryover.structure.seed ^ 0x5eed_5e1e_c7ed_0001);
        h = splitmix(h ^ node as u64);
        let mut s = scope;
        while s != 0 {
            let (parent, n, k) = self.scopes[s];
            h = splitmix(h ^ ((n as u64) << 32 | k as u64));
            s = parent;
        }
        let mut weights = def.weights.clone();
        let mut picks = Vec::with_capacity(def.num_to_select as usize);
        for _ in 0..def.num_to_select {
            h = splitmix(h);
            let total: f64 = weights.iter().sum();
            if total <= 0.0 {
                return Err(Error::Unsupported(
                    "a <select> whose remaining options all have weight 0".into(),
                ));
            }
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
        Ok(picks)
    }

    /// Sources of the `Choose` components of built reactive choices: each
    /// public prop chooses among the branches' cells by the choice cell.
    /// Runs before instance sources, so a symbolic interface math is known
    /// to be one when its copies are planned.
    pub(in crate::build) fn choice_sources(&mut self) {
        let c: &'c Compiled<'a> = self.compiled;
        for i in 0..self.choice_insts.len() {
            if self.choice_insts[i].iface_comps.is_empty() {
                continue;
            }
            let inst = self.choice_insts[i].clone();
            let def = &c.choices[inst.def];
            let choice = self.slot(inst.comp, 0);
            for (u, &ic) in inst.iface_comps.iter().enumerate() {
                let (component_type, elems) = &def.iface[&def.used[u]];
                let members: Vec<CompIdx> = inst
                    .scopes
                    .iter()
                    .zip(&inst.branch_of)
                    .map(|(&s, &b)| self.scope_comps[s as usize][elems[b]])
                    .collect();
                let symbolic = members.iter().any(|&m| self.is_symbolic(m));
                self.math_mode
                    .resize(self.components.len(), MathMode::Unknown);
                self.math_mode[ic as usize] = if symbolic {
                    MathMode::Symbolic
                } else {
                    MathMode::Numeric
                };
                let n = members.len() as u8;
                for pi in 0..component_type.prop_defs().len() {
                    let inputs: Vec<SlotId> = std::iter::once(choice)
                        .chain(members.iter().map(|&m| self.slot(m, pi)))
                        .collect();
                    let s = self.slot(ic, pi);
                    self.sources[s as usize] =
                        self.op_source(OpSpec::Vec(VecOp::Choose { n }), &inputs);
                }
                if symbolic && let Some(pi) = component_type.prop_index("expr") {
                    let s = self.slot(ic, pi);
                    self.math_slots.push(s);
                }
            }
        }
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

fn splitmix(x: u64) -> u64 {
    let mut z = x.wrapping_add(0x9e37_79b9_7f4a_7c15);
    z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
    z ^ (z >> 31)
}

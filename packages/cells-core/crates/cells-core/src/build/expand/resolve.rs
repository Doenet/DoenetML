//! Reference resolution at expansion: a [`RefPlan`] followed through scopes,
//! iterations, collects and choice picks to the slots it names.

use super::*;

impl<'c> Builder<'c> {
    /// The slot an [`Arg`] names for component `comp` in `scope`.
    pub(in crate::build) fn arg_slot(
        &mut self,
        arg: Arg,
        comp: CompIdx,
        scope: ScopeId,
        component_type: ComponentType,
        pi: usize,
    ) -> Result<SlotId> {
        Ok(match arg {
            Arg::Own(a) => self.slot(comp, a.index()),
            Arg::Const(k) => self.const_slot(k),
            Arg::Elem(el, port) => {
                let other = self.scope_comps[scope.index()][el.index()];
                self.slot(other, port.index())
            }
            Arg::Ref(p, Sel::Whole) => self
                .resolve_one(p, scope)
                .map_err(|e| arity_error_for(e, component_type, pi))?,
            Arg::Ref(p, Sel::Coord(j)) => {
                // A point's coordinates, or a tuple's entries.
                let targets = self.resolve_ref(p, scope, Some(2))?;
                if targets.len() < 2 || targets.len() <= j as usize {
                    return Err(Error::ArityMismatch {
                        component_type: component_type.tag().into(),
                        prop: "coords".into(),
                        expected: 2,
                        got: targets.len(),
                    });
                }
                targets[j as usize]
            }
            Arg::Ref(p, Sel::Item(i, j)) => {
                let items = self.resolve_items(p, scope)?;
                match items.get(i as usize) {
                    Some(item) => item[j as usize],
                    None => self.missing_slot(),
                }
            }
            // A port of the element the path names, whatever prop it is:
            // a copy's port aliasing its referent's (ADR 0032).
            Arg::Ref(p, Sel::Port(k)) => {
                let (target, _) = self.resolve(p, scope)?;
                match target {
                    Resolved::Missing => self.missing_slot(),
                    target => {
                        let c = self.single_component(target, p)?;
                        self.slot(c, k as usize)
                    }
                }
            }
        })
    }

    /// Walk a plan from `scope`. Returns where it arrived and the port it
    /// named, if any. An index reads the stamped entries, and one that
    /// reads a cell keeps every entry (`Chosen`).
    pub(in crate::build) fn resolve(
        &mut self,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<(Resolved, Option<RefProp>)> {
        let c = self.compiled.plans;
        let p = &c.refs[plan.index()];
        let mut sc = scope;
        for _ in 0..p.hops {
            sc = self.scopes[sc].0;
        }
        let mut cur = Resolved::Iter(CompIdx::NONE, sc);
        let walk = Walk { plan: p, scope };
        for step in &p.steps {
            cur = self.resolve_step(cur, step, &walk)?;
        }
        Ok((cur, p.prop))
    }

    /// One step of a walk from `cur`. Over a `Chosen`, the step applies to
    /// every item.
    fn resolve_step(&mut self, cur: Resolved, step: &Step, w: &Walk<'c>) -> Result<Resolved> {
        if let Resolved::Chosen { index, items } = cur {
            let mut out = Vec::with_capacity(items.len());
            for item in items {
                out.push(self.resolve_step(item, step, w)?);
            }
            return Ok(Resolved::Chosen { index, items: out });
        }
        let display = |b: &Self| b.compiled.display_of(w.plan);
        Ok(match step {
            Step::Elem(e) => {
                let next = match cur {
                    Resolved::Iter(_, s) => Resolved::Comp(self.scope_comps[s.index()][e.index()]),
                    Resolved::Missing => Resolved::Missing,
                    // A name inside a named component: the component's scope.
                    Resolved::Comp(c) => {
                        let s = self.components.scope[c.index()];
                        Resolved::Comp(self.scope_comps[s.index()][e.index()])
                    }
                    Resolved::Chosen { .. } => unreachable!("walked above"),
                };
                // A box, and what is under one and never built, read as
                // undefined: the box's error is the explanation (ADR 0027).
                match next {
                    Resolved::Comp(c)
                        if c == CompIdx::NONE
                            || self.components.component_type[c.index()]
                                == ComponentType::Error =>
                    {
                        Resolved::Missing
                    }
                    other => other,
                }
            }
            Step::Iface(cid, u) => self.resolve_iface(*cid, *u, cur).0,
            Step::Iter(ip) | Step::Item(_, ip) => {
                let c = match cur {
                    Resolved::Missing => return Ok(Resolved::Missing),
                    Resolved::Comp(c) => c,
                    Resolved::Iter(..) => return Err(Error::NotIndexable(display(self))),
                    Resolved::Chosen { .. } => unreachable!("walked above"),
                };
                // The entries the index reads.
                let entries: Vec<Resolved> = match step {
                    Step::Iter(_) => {
                        let ri = self.comp_repeat[c.index()];
                        assert!(!ri.is_none(), "planning made an iteration step of a repeat");
                        let r = &self.repeats[ri.index()];
                        r.iter_scopes
                            .iter()
                            .map(|&s| Resolved::Iter(c, s))
                            .collect()
                    }
                    Step::Item(Collection::Gathered, _) => {
                        let Some(items) = self.collected.get(&c) else {
                            return Err(Error::NotIndexable(display(self)));
                        };
                        items.iter().map(|&i| Resolved::Comp(i)).collect()
                    }
                    Step::Item(Collection::ListPoints, _) => {
                        let (s, n) = (
                            self.components.child_start[c.index()] as usize,
                            self.components.child_count[c.index()] as usize,
                        );
                        self.components.child_list[s..s + n]
                            .iter()
                            .map(|e| e.as_comp().map_or(Resolved::Missing, Resolved::Comp))
                            .collect()
                    }
                    Step::Item(Collection::Picks, _) => return Ok(self.resolve_pick(c, ip, w)),
                    Step::Item(..) => unreachable!("planning indexes no other collection"),
                    _ => unreachable!(),
                };
                if ip.is_dynamic() {
                    let [IndexTerm::Cell(cell)] = ip.terms[..] else {
                        unreachable!("a dynamic index is one cell")
                    };
                    let index = self.resolve_one(cell, w.scope)?;
                    return Ok(Resolved::Chosen {
                        index,
                        items: entries,
                    });
                }
                let k = self.index_value(ip, w.scope);
                match in_range(entries.len(), k) {
                    Some(j) => entries[j].clone(),
                    None => Resolved::Missing,
                }
            }
        })
    }

    /// `$s[k]` on select `c`: the pick.
    fn resolve_pick(&self, c: CompIdx, ip: &IndexPlan, w: &Walk<'c>) -> Resolved {
        let inst = &self.choice_insts[self.comp_choice[&c]];
        let k = self.index_value(ip, w.scope);
        match in_range(inst.scopes.len(), k) {
            Some(j) => Resolved::Iter(c, inst.scopes[j]),
            None => Resolved::Missing,
        }
    }

    pub(in crate::build) fn index_value(&self, ip: &IndexPlan, scope: ScopeId) -> i64 {
        let mut total = 0i64;
        for t in &ip.terms {
            total += match t {
                IndexTerm::Const(c) => *c,
                IndexTerm::Iter(hops) => {
                    let mut s = scope;
                    for _ in 0..*hops {
                        s = self.scopes[s].0;
                    }
                    self.scopes[s].2 as i64
                }
                IndexTerm::Cell(_) => unreachable!("a cell index is resolved as `Chosen`"),
            };
        }
        total
    }

    /// The one component an unindexed path or `$r[k]` denotes.
    pub(in crate::build) fn single_component(
        &self,
        target: Resolved,
        plan: RefId,
    ) -> Result<CompIdx> {
        match target {
            Resolved::Comp(c) => Ok(c),
            Resolved::Iter(repeat, s) => {
                let comps = self.iteration_components(repeat, s);
                if comps.len() == 1 {
                    Ok(comps[0])
                } else {
                    Err(Error::AmbiguousIteration(
                        self.compiled.ref_display(plan),
                        comps.len(),
                    ))
                }
            }
            Resolved::Missing => Err(Error::UnknownName(self.compiled.ref_display(plan))),
            Resolved::Chosen { .. } => Err(Error::Unsupported(format!(
                "'${}' names a component by a cell, which only a value can be read through: name a prop of it",
                self.compiled.ref_display(plan)
            ))),
        }
    }

    /// Slots named by a resolved path, using the default prop when none
    /// was given; through a cell index, a choose over each item's slots,
    /// made in `scope`.
    pub(in crate::build) fn targets_of(
        &mut self,
        target: Resolved,
        prop: Option<RefProp>,
        plan: RefId,
        expected: Option<usize>,
        scope: ScopeId,
    ) -> Result<Vec<SlotId>> {
        let comp = match target {
            Resolved::Missing => {
                let s = self.missing_slot();
                return Ok(vec![s; expected.unwrap_or(1)]);
            }
            Resolved::Chosen { index, items } => {
                return self.chosen_targets(index, items, prop, plan, expected, scope);
            }
            other => self.single_component(other, plan)?,
        };
        let component_type = self.components.component_type[comp.index()];
        // The port as the plan resolved it (ADR 0032, decision 5), or the
        // type's default when the plan names none.
        let sel = match prop {
            Some(p) => {
                debug_assert_eq!(
                    p.of, component_type,
                    "a path reaches the type it was planned to"
                );
                Some(p.sel)
            }
            None => {
                if component_type.default_prop().is_none() {
                    return Err(Error::NoDefaultProp(self.comp_label(comp)));
                }
                component_type.default_sel()
            }
        };
        let slots = sel
            .and_then(|sel| self.sel_slots(comp, sel))
            .ok_or_else(|| Error::UnknownProp {
                name: self.comp_label(comp),
                prop: match prop {
                    Some(p) => p.name().into_owned(),
                    None => component_type.default_prop().unwrap_or_default().into(),
                },
            })?;
        Ok(slots)
    }

    /// The slots a path through a cell index names: one choose per slot
    /// the port has, over the items' slots, reading the index.
    fn chosen_targets(
        &mut self,
        index: SlotId,
        items: Vec<Resolved>,
        prop: Option<RefProp>,
        plan: RefId,
        expected: Option<usize>,
        scope: ScopeId,
    ) -> Result<Vec<SlotId>> {
        let mut columns = Vec::with_capacity(items.len());
        for item in items {
            columns.push(self.targets_of(item, prop, plan, expected, scope)?);
        }
        let n = columns.iter().map(Vec::len).max().unwrap_or(1);
        let missing = self.missing_slot();
        for col in &mut columns {
            if col.len() != n {
                // A missing item named `expected` slots: as many as the rest.
                if col.iter().all(|&s| s == missing) {
                    col.resize(n, missing);
                } else {
                    return Err(Error::Unsupported(format!(
                        "'${}' names values of different sizes in different items",
                        self.compiled.ref_display(plan)
                    )));
                }
            }
        }
        let mut out = Vec::with_capacity(n);
        for j in 0..n {
            let slots: Vec<SlotId> = columns.iter().map(|col| col[j]).collect();
            out.push(self.choose_over(index, &slots, scope));
        }
        Ok(out)
    }

    /// A slot choosing among `items` by the 1-based value of `index`, in
    /// `scope`: NaN past them. More items than one choose reads are read
    /// in chunks, a choose over the chunks by the index's chunk number.
    fn choose_over(&mut self, index: SlotId, items: &[SlotId], scope: ScopeId) -> SlotId {
        const CAP: usize = crate::limits::MAX_VEC_IN - 1;
        if items.len() <= CAP {
            let mut inputs = Vec::with_capacity(items.len() + 1);
            inputs.push(index);
            inputs.extend_from_slice(items);
            return self.op_slot(
                OpSpec::Vec(VecOp::Choose {
                    n: byte(items.len()),
                }),
                &inputs,
                scope,
            );
        }
        let mut chunks = Vec::with_capacity(items.len().div_ceil(CAP));
        for (ci, chunk) in items.chunks(CAP).enumerate() {
            let local = if ci == 0 {
                index
            } else {
                let offset = self.const_slot((ci * CAP) as f64);
                self.op_slot(OpSpec::Sub, &[index, offset], scope)
            };
            chunks.push(self.choose_over(local, chunk, scope));
        }
        // The chunk the index falls in: floor((index - 1) / CAP) + 1.
        let one = self.const_slot(1.0);
        let cap = self.const_slot(CAP as f64);
        let less = self.op_slot(OpSpec::Sub, &[index, one], scope);
        let q = self.op_slot(OpSpec::Div, &[less, cap], scope);
        let f = self.op_slot(OpSpec::Floor, &[q], scope);
        let which = self.op_slot(OpSpec::Add, &[f, one], scope);
        self.choose_over(which, &chunks, scope)
    }

    /// The slots reference `plan` names from `scope` (`targets_of`).
    pub(in crate::build) fn resolve_ref(
        &mut self,
        plan: RefId,
        scope: ScopeId,
        expected: Option<usize>,
    ) -> Result<Vec<SlotId>> {
        let (target, prop) = self.resolve(plan, scope)?;
        self.targets_of(target, prop, plan, expected, scope)
    }

    /// The one slot a reference names, and the label of a reader's edge to
    /// it. Errors with a placeholder `ArityMismatch` (callers fill in type
    /// and prop) when the reference names several cells.
    pub(in crate::build) fn resolve_one(&mut self, plan: RefId, scope: ScopeId) -> Result<SlotId> {
        let slots = self.resolve_ref(plan, scope, Some(1))?;
        match slots[..] {
            [s] => Ok(s),
            _ => Err(Error::ArityMismatch {
                component_type: String::new(),
                prop: String::new(),
                expected: 1,
                got: slots.len(),
            }),
        }
    }
}

/// `arity_error` for prop `pi` of a component type.
pub(in crate::build) fn arity_error_for(
    e: Error,
    component_type: ComponentType,
    pi: usize,
) -> Error {
    let prop = component_type
        .prop_defs()
        .get(pi)
        .map(|d| d.name)
        .unwrap_or("args");
    arity_error(e, component_type, prop)
}

/// Fill in the type and prop of an arity error raised by `resolve_one`.
fn arity_error(e: Error, component_type: ComponentType, prop: &str) -> Error {
    match e {
        Error::ArityMismatch { expected, got, .. } => Error::ArityMismatch {
            component_type: component_type.tag().into(),
            prop: prop.into(),
            expected,
            got,
        },
        other => other,
    }
}

/// What a walk carries from step to step.
struct Walk<'c> {
    plan: &'c RefPlan,
    /// The scope the reference is read from.
    scope: ScopeId,
}

/// Index `k` (1-based) into `len` entries, when it is in range.
pub(in crate::build) fn in_range(len: usize, k: i64) -> Option<usize> {
    (k >= 1 && k as u64 <= len as u64).then(|| (k - 1) as usize)
}

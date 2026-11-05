//! Reference resolution at expansion: a `RefPlan` followed through scopes,
//! iterations, collects and choice picks to the slots it names.

use super::*;

impl<'c> Builder<'c> {
    /// The slot an `Arg` names for component `comp` in `scope`.
    pub(in crate::build) fn arg_slot(
        &mut self,
        arg: Arg,
        comp: CompIdx,
        scope: ScopeId,
        component_type: ComponentType,
        pi: usize,
    ) -> Result<SlotId> {
        let from = self.slot(comp, pi);
        Ok(match arg {
            Arg::Own(a) => self.slot(comp, a.index()),
            Arg::Const(k) => self.const_slot(k),
            Arg::Elem(el, port) => {
                let other = self.scope_comps[scope.index()][el.index()];
                self.slot(other, port.index())
            }
            Arg::Ref(p, Sel::Whole) => {
                let t = self
                    .resolve_one(p, scope)
                    .map_err(|e| arity_error_for(e, component_type, pi))?;
                self.record_label(from, t);
                t
            }
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
                self.record_label(from, targets[j as usize]);
                targets[j as usize]
            }
            Arg::Ref(p, Sel::Item(i, j)) => {
                let items = self.resolve_items(p, scope)?;
                match items.get(i as usize) {
                    Some(item) => {
                        self.record_label(from, item[j as usize]);
                        item[j as usize]
                    }
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
                        let t = self.slot(c, k as usize);
                        self.record_label(from, t);
                        t
                    }
                }
            }
        })
    }

    /// Walk a plan from `scope`. Returns where it arrived and the port it
    /// named, if any. An index reads the stamped entries through the view,
    /// and one that reads a cell keeps every entry (`Chosen`). When the view
    /// folds iterations, the walk is also labelled into `self.label`: one
    /// coordinate per level of nesting of the target, kept with a shift or
    /// reset.
    pub(in crate::build) fn resolve(
        &mut self,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<(Resolved, Option<RefProp>)> {
        let c = self.compiled.plans;
        let p = &c.refs[plan.index()];
        let labelling = self.view.folds_iterations();
        let src_depth = if labelling {
            self.scope_depth(scope)
        } else {
            0
        };
        let mut label = std::mem::take(&mut self.label);
        label.clear();
        let mut sc = scope;
        for _ in 0..p.hops {
            sc = self.scopes[sc].0;
        }
        if labelling {
            label.resize(self.scope_depth(sc) as usize, Coord::Keep(0));
        }
        let mut cur = Resolved::Iter(CompIdx::NONE, sc);
        for (si, step) in p.steps.iter().enumerate() {
            let mut walk = Walk {
                plan: p,
                scope,
                src_depth,
                labelling,
                label: &mut label,
                to_iface: matches!(p.steps.get(si + 1), Some(Step::Iface(..))),
            };
            cur = self.resolve_step(cur, step, &mut walk, true)?;
        }
        self.label = label;
        Ok((cur, p.prop))
    }

    /// One step of a walk from `cur`. Over a `Chosen`, the step applies to
    /// every item; the label is pushed once.
    fn resolve_step(
        &mut self,
        cur: Resolved,
        step: &Step,
        w: &mut Walk<'_, 'c>,
        push: bool,
    ) -> Result<Resolved> {
        if let Resolved::Chosen {
            index,
            label,
            items,
        } = cur
        {
            let mut out = Vec::with_capacity(items.len());
            for (i, item) in items.into_iter().enumerate() {
                out.push(self.resolve_step(item, step, w, push && i == 0)?);
            }
            return Ok(Resolved::Chosen {
                index,
                label,
                items: out,
            });
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
                // The entries the index reads, and whether the view folds
                // their count (one entry stands for every index).
                let (entries, varies): (Vec<Resolved>, bool) = match step {
                    Step::Iter(_) => {
                        let ri = self.comp_repeat[c.index()];
                        assert!(!ri.is_none(), "planning made an iteration step of a repeat");
                        let r = &self.repeats[ri.index()];
                        if w.labelling && push {
                            // A folded iteration stands for every index;
                            // the label says which.
                            let entered = self.scope_depth(r.scope) + 1;
                            w.label
                                .push(abstract_build::index_coord(ip, w.src_depth, entered));
                        }
                        (
                            r.iter_scopes
                                .iter()
                                .map(|&s| Resolved::Iter(c, s))
                                .collect(),
                            true,
                        )
                    }
                    Step::Item(Collection::Gathered, _) => {
                        let Some(items) = self.collected.get(&c) else {
                            return Err(Error::NotIndexable(display(self)));
                        };
                        (
                            items.iter().map(|&i| Resolved::Comp(i)).collect(),
                            self.follows_counts.contains(&c),
                        )
                    }
                    Step::Item(Collection::ListPoints, _) => {
                        let (s, n) = (
                            self.components.child_start[c.index()] as usize,
                            self.components.child_count[c.index()] as usize,
                        );
                        let points = self.components.child_list[s..s + n]
                            .iter()
                            .map(|e| e.as_comp().map_or(Resolved::Missing, Resolved::Comp))
                            .collect();
                        (points, false)
                    }
                    Step::Item(Collection::Picks, _) => {
                        return self.resolve_pick(c, ip, w, push);
                    }
                    Step::Item(..) => unreachable!("planning indexes no other collection"),
                    _ => unreachable!(),
                };
                if ip.is_dynamic() {
                    let [IndexTerm::Cell(cell)] = ip.terms[..] else {
                        unreachable!("a dynamic index is one cell")
                    };
                    let index = self.resolve_one(cell, w.scope)?;
                    let label = std::mem::take(&mut self.label);
                    return Ok(Resolved::Chosen {
                        index,
                        label,
                        items: entries,
                    });
                }
                let k = self.index_value(ip, w.scope);
                match self.view.index(entries.len(), k, varies) {
                    Some(j) => entries[j].clone(),
                    None => Resolved::Missing,
                }
            }
        })
    }

    /// `$s[k]` on select `c`: the pick, or in the abstract build, which
    /// builds every option, what stands for any pick.
    fn resolve_pick(
        &mut self,
        c: CompIdx,
        ip: &IndexPlan,
        w: &mut Walk<'_, 'c>,
        push: bool,
    ) -> Result<Resolved> {
        let inst = &self.choice_insts[self.comp_choice[&c]];
        if inst.every_option && w.to_iface {
            // Any option may be this pick: the interface name resolves
            // to the stand-in over every option, whose edges into them
            // reset the pick.
            return Ok(Resolved::Comp(c));
        }
        if w.labelling && push {
            w.label.push(Coord::Reset);
        }
        // Any option may be this pick, so what a whole pick names must not
        // depend on which (ADR 0014).
        if inst.every_option {
            if !self.picks_alike(c) {
                return Err(Error::Unsupported(format!(
                    "'${}' names a whole pick, so every option must hold one component, all of one type: name the content and use $s[k].name",
                    self.compiled.display_of(w.plan)
                )));
            }
            return Ok(Resolved::Comp(self.whole_pick(c)?));
        }
        let k = self.index_value(ip, w.scope);
        Ok(match self.view.index(inst.scopes.len(), k, false) {
            Some(j) => Resolved::Iter(c, inst.scopes[j]),
            None => Resolved::Missing,
        })
    }

    /// Whether every built option of select `c` holds one component, all of
    /// one type.
    fn picks_alike(&self, c: CompIdx) -> bool {
        let inst = &self.choice_insts[self.comp_choice[&c]];
        let mut types =
            inst.scopes
                .iter()
                .map(|&s| match self.iteration_components(c, s).as_slice() {
                    [one] => Some(self.components.component_type[one.index()]),
                    _ => None,
                });
        let first = types.next().flatten();
        first.is_some() && types.all(|t| t == first)
    }

    /// Record the last resolved reference's label for the edge from `from`
    /// to `to`, when it is not the identity.
    pub(in crate::build) fn record_label(&mut self, from: SlotId, to: SlotId) {
        if self.label.iter().any(|&c| c != Coord::Keep(0)) {
            self.labels.insert((from, to), self.label.clone());
        }
    }

    /// Record `label` for the edge from `from` to `to`.
    pub(in crate::build) fn record_label_as(&mut self, from: SlotId, to: SlotId, label: &[Coord]) {
        if label.iter().any(|&c| c != Coord::Keep(0)) {
            self.labels.insert((from, to), label.to_vec());
        }
    }

    /// The slot standing for a reference leaf inside math, made in `scope`:
    /// when the view folds iterations, a slot of its own aliasing `target`,
    /// so the edge to the leaf can carry the reference's label.
    pub(in crate::build) fn leaf(&mut self, target: SlotId, scope: ScopeId) -> SlotId {
        if !self.view.folds_iterations() {
            return target;
        }
        let a = self.anon_slot(BuiltSource::Alias(target), scope);
        self.record_label(a, target);
        a
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
            Resolved::Chosen {
                index,
                label,
                items,
            } => return self.chosen_targets(index, label, items, prop, plan, expected, scope),
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
        sel.and_then(|sel| self.sel_slots(comp, sel))
            .ok_or_else(|| Error::UnknownProp {
                name: self.comp_label(comp),
                prop: match prop {
                    Some(p) => p.name().into_owned(),
                    None => component_type.default_prop().unwrap_or_default().into(),
                },
            })
    }

    /// The slots a path through a cell index names: one choose per slot
    /// the port has, over the items' slots, reading the index. The edge
    /// to each item carries the walk's label, the edge to the index its
    /// own; the reader's edge to the choose is then plain.
    #[allow(clippy::too_many_arguments)]
    fn chosen_targets(
        &mut self,
        index: SlotId,
        index_label: Vec<Coord>,
        items: Vec<Resolved>,
        prop: Option<RefProp>,
        plan: RefId,
        expected: Option<usize>,
        scope: ScopeId,
    ) -> Result<Vec<SlotId>> {
        let walk_label = std::mem::take(&mut self.label);
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
            out.push(self.choose_over(index, &index_label, &slots, &walk_label, scope));
        }
        Ok(out)
    }

    /// A slot choosing among `items` by the 1-based value of `index`, in
    /// `scope`: NaN past them. More items than one choose reads are read
    /// in chunks, a choose over the chunks by the index's chunk number.
    fn choose_over(
        &mut self,
        index: SlotId,
        index_label: &[Coord],
        items: &[SlotId],
        item_label: &[Coord],
        scope: ScopeId,
    ) -> SlotId {
        const CAP: usize = crate::limits::MAX_VEC_IN - 1;
        if items.len() <= CAP {
            let mut inputs = Vec::with_capacity(items.len() + 1);
            inputs.push(index);
            inputs.extend_from_slice(items);
            let s = self.op_slot(
                OpSpec::Vec(VecOp::Choose {
                    n: byte(items.len()),
                }),
                &inputs,
                scope,
            );
            self.record_label_as(s, index, index_label);
            for &item in items {
                self.record_label_as(s, item, item_label);
            }
            return s;
        }
        let mut chunks = Vec::with_capacity(items.len().div_ceil(CAP));
        for (ci, chunk) in items.chunks(CAP).enumerate() {
            let local = if ci == 0 {
                index
            } else {
                let offset = self.const_slot((ci * CAP) as f64);
                let s = self.op_slot(OpSpec::Sub, &[index, offset], scope);
                self.record_label_as(s, index, index_label);
                s
            };
            chunks.push(self.choose_over(local, index_label, chunk, item_label, scope));
        }
        // The chunk the index falls in: floor((index - 1) / CAP) + 1.
        let one = self.const_slot(1.0);
        let cap = self.const_slot(CAP as f64);
        let less = self.op_slot(OpSpec::Sub, &[index, one], scope);
        self.record_label_as(less, index, index_label);
        let q = self.op_slot(OpSpec::Div, &[less, cap], scope);
        let f = self.op_slot(OpSpec::Floor, &[q], scope);
        let which = self.op_slot(OpSpec::Add, &[f, one], scope);
        self.choose_over(which, &[], &chunks, &[], scope)
    }

    pub(in crate::build) fn resolve_ref(
        &mut self,
        plan: RefId,
        scope: ScopeId,
        expected: Option<usize>,
    ) -> Result<Vec<SlotId>> {
        let (target, prop) = self.resolve(plan, scope)?;
        self.targets_of(target, prop, plan, expected, scope)
    }

    /// The one slot a reference names. Errors with a placeholder
    /// `ArityMismatch` (callers fill in type and prop) when the reference
    /// names several cells.
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
struct Walk<'a, 'c> {
    plan: &'c RefPlan,
    /// The scope the reference is read from.
    scope: ScopeId,
    src_depth: u32,
    labelling: bool,
    label: &'a mut Vec<Coord>,
    /// Whether the next step is an interface name.
    to_iface: bool,
}

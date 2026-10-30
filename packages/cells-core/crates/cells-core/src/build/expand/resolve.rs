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
            Arg::Own(a) => self.slot(comp, a as usize),
            Arg::Const(k) => self.const_slot(k),
            Arg::Elem(el, slot) => {
                let other = self.scope_comps[scope.index()][el.index()];
                self.slot(other, slot as usize)
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
        })
    }

    /// Walk a plan from `scope`. Returns where it arrived and the prop it
    /// named, if any. Every step is an array read; an index reads the
    /// stamped entries through the view. When the view folds iterations,
    /// the walk is also labelled into `self.label` (`build/probe.rs`): one
    /// coordinate per level of nesting of the target, kept with a shift or
    /// reset.
    pub(in crate::build) fn resolve(
        &mut self,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<(Resolved, Option<&'c str>)> {
        let c: &'c Compiled = self.compiled;
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
            match step {
                Step::Elem(e) => {
                    cur = match cur {
                        Resolved::Iter(_, s) => {
                            sc = s;
                            Resolved::Comp(self.scope_comps[s.index()][e.index()])
                        }
                        Resolved::Missing => Resolved::Missing,
                        // A name inside a named component: same scope.
                        Resolved::Comp(_) => {
                            Resolved::Comp(self.scope_comps[sc.index()][e.index()])
                        }
                    };
                    // A box reads as undefined: its error is the
                    // explanation (ADR 0027).
                    if let Resolved::Comp(c) = cur
                        && c != CompIdx::NONE
                        && self.components.component_type[c.index()] == ComponentType::Error
                    {
                        cur = Resolved::Missing;
                    }
                }
                Step::Iface(cid, u) => {
                    let (next, s) = self.resolve_iface(*cid, *u, cur);
                    cur = next;
                    sc = s;
                }
                Step::Index(ip) => {
                    let k = self.index_value(ip, scope);
                    cur = match cur {
                        Resolved::Missing => Resolved::Missing,
                        Resolved::Iter(..) => return Err(Error::NotIndexable(p.display.clone())),
                        Resolved::Comp(c) => match self.components.component_type[c.index()] {
                            _ if self.comp_repeat[c.index()] != NONE => {
                                let r = &self.repeats[self.comp_repeat[c.index()] as usize];
                                if labelling {
                                    // A folded iteration stands for every
                                    // index; the label says which.
                                    let entered = self.scope_depth(r.scope) + 1;
                                    label.push(probe::index_coord(ip, src_depth, entered));
                                }
                                match self.view.index(r.iter_scopes.len(), k, true) {
                                    Some(j) => Resolved::Iter(c, r.iter_scopes[j]),
                                    None => Resolved::Missing,
                                }
                            }
                            ComponentType::Collect | ComponentType::Polyline => {
                                let Some(items) = self.collected.get(&c) else {
                                    return Err(Error::NotIndexable(p.display.clone()));
                                };
                                let varies = self.follows_counts.contains(&c);
                                match self.view.index(items.len(), k, varies) {
                                    Some(j) => Resolved::Comp(items[j]),
                                    None => Resolved::Missing,
                                }
                            }
                            ComponentType::PointList => {
                                let (s, n) = (
                                    self.components.child_start[c.index()] as usize,
                                    self.components.child_count[c.index()] as usize,
                                );
                                if k >= 1 && (k as usize) <= n {
                                    match self.components.child_list[s + k as usize - 1].as_comp() {
                                        Some(c) => Resolved::Comp(c),
                                        None => Resolved::Missing,
                                    }
                                } else {
                                    Resolved::Missing
                                }
                            }
                            ComponentType::Select => {
                                let inst = &self.choice_insts[self.comp_choice[&c]];
                                let to_iface = matches!(p.steps.get(si + 1), Some(Step::Iface(..)));
                                if inst.every_option && to_iface {
                                    // Any option may be this pick: the
                                    // interface name resolves to the
                                    // stand-in over every option, whose
                                    // edges into them reset the pick.
                                    Resolved::Comp(c)
                                } else {
                                    if labelling {
                                        label.push(Coord::Reset);
                                    }
                                    // Any option may be this pick, so what a
                                    // whole pick names must not depend on
                                    // which (ADR 0014).
                                    if inst.every_option {
                                        if !self.picks_alike(c) {
                                            return Err(Error::Unsupported(format!(
                                                "'${}' names a whole pick, so every option must hold one component, all of one type: name the content and use $s[k].name",
                                                p.display
                                            )));
                                        }
                                        Resolved::Comp(self.whole_pick(c)?)
                                    } else {
                                        match self.view.index(inst.scopes.len(), k, false) {
                                            Some(j) => Resolved::Iter(c, inst.scopes[j]),
                                            None => Resolved::Missing,
                                        }
                                    }
                                }
                            }
                            _ => return Err(Error::NotIndexable(p.display.clone())),
                        },
                    };
                }
            }
        }
        self.label = label;
        Ok((cur, p.prop.as_deref()))
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
                        self.compiled.refs[plan.index()].display.clone(),
                        comps.len(),
                    ))
                }
            }
            Resolved::Missing => Err(Error::UnknownName(
                self.compiled.refs[plan.index()].display.clone(),
            )),
        }
    }

    /// Slots named by a resolved path, using the default prop when none was given.
    pub(in crate::build) fn targets_of(
        &mut self,
        target: Resolved,
        prop: Option<&str>,
        plan: RefId,
        expected: Option<usize>,
    ) -> Result<Vec<SlotId>> {
        let comp = match target {
            Resolved::Missing => {
                let s = self.missing_slot();
                return Ok(vec![s; expected.unwrap_or(1)]);
            }
            other => self.single_component(other, plan)?,
        };
        let component_type = self.components.component_type[comp.index()];
        let prop = match prop {
            Some(p) => p,
            None => component_type
                .default_prop()
                .ok_or_else(|| Error::NoDefaultProp(self.comp_label(comp)))?,
        };
        self.prop_slots(comp, prop)
            .ok_or_else(|| Error::UnknownProp {
                name: self.comp_label(comp),
                prop: prop.into(),
            })
    }

    pub(in crate::build) fn resolve_ref(
        &mut self,
        plan: RefId,
        scope: ScopeId,
        expected: Option<usize>,
    ) -> Result<Vec<SlotId>> {
        let (target, prop) = self.resolve(plan, scope)?;
        self.targets_of(target, prop, plan, expected)
    }

    /// The one slot a reference names. Errors with a
    /// placeholder `ArityMismatch` (callers fill in type and prop) when the
    /// reference names several cells.
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

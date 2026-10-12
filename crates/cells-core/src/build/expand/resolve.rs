//! Reference resolution at expansion: a `RefPlan` followed through scopes,
//! iterations, collects and choice picks to the slots it names.

use super::*;

impl<'c, 'a> Builder<'c, 'a> {
    /// The slot an `Arg` names for component `comp` in `scope`.
    pub(in crate::build) fn arg_slot(
        &mut self,
        arg: Arg,
        comp: CompIdx,
        scope: ScopeId,
        component_type: ComponentType,
        pi: usize,
    ) -> Result<SlotId> {
        Ok(match arg {
            Arg::Own(a) => self.slot(comp, a as usize),
            Arg::Elem(el, slot) => {
                let other = self.scope_comps[scope as usize][el];
                self.slot(other, slot as usize)
            }
            Arg::Ref(p, Sel::Whole) => self.resolve_one(p, scope).map_err(|e| {
                arity_error(
                    e,
                    component_type,
                    component_type
                        .prop_defs()
                        .get(pi)
                        .map(|d| d.name)
                        .unwrap_or("args"),
                )
            })?,
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
        })
    }

    /// Walk a plan from `scope`. Returns where it arrived and the prop it
    /// named, if any. Every step is an array read.
    pub(in crate::build) fn resolve(
        &self,
        plan: RefId,
        scope: ScopeId,
    ) -> Result<(Resolved, Option<&'c str>)> {
        let p = &self.compiled.refs[plan];
        let mut sc = scope;
        for _ in 0..p.hops {
            sc = self.scopes[sc].0;
        }
        let mut cur = Resolved::Iter(NONE, sc);
        for step in &p.steps {
            match step {
                Step::Elem(e) => {
                    cur = match cur {
                        Resolved::Iter(_, s) => {
                            sc = s;
                            Resolved::Comp(self.scope_comps[s as usize][*e])
                        }
                        Resolved::Missing => Resolved::Missing,
                        // A name inside a named component: same scope.
                        Resolved::Comp(_) => Resolved::Comp(self.scope_comps[sc as usize][*e]),
                    };
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
                        Resolved::Comp(c) => match self.components.component_type[c as usize] {
                            _ if self.comp_repeat[c as usize] != NONE => {
                                let r = &self.repeats[self.comp_repeat[c as usize] as usize];
                                if k < 1 || k > r.iterations as i64 {
                                    Resolved::Missing
                                } else {
                                    Resolved::Iter(c, r.iter_scopes[(k - 1) as usize])
                                }
                            }
                            ComponentType::Collect | ComponentType::Polyline => {
                                match self.collected.get(&c) {
                                    Some(items) if k >= 1 && (k as usize) <= items.len() => {
                                        Resolved::Comp(items[(k - 1) as usize])
                                    }
                                    Some(_) => Resolved::Missing,
                                    None => return Err(Error::NotIndexable(p.display.clone())),
                                }
                            }
                            ComponentType::PointList => {
                                let (s, n) = (
                                    self.components.child_start[c as usize] as usize,
                                    self.components.child_count[c as usize] as usize,
                                );
                                if k >= 1 && (k as usize) <= n {
                                    Resolved::Comp(self.components.child_list[s + k as usize - 1])
                                } else {
                                    Resolved::Missing
                                }
                            }
                            ComponentType::Select => {
                                let inst = &self.choice_insts[self.comp_choice[&c]];
                                if k < 1 || k as usize > inst.scopes.len() {
                                    Resolved::Missing
                                } else {
                                    Resolved::Iter(c, inst.scopes[(k - 1) as usize])
                                }
                            }
                            _ => return Err(Error::NotIndexable(p.display.clone())),
                        },
                    };
                }
            }
        }
        Ok((cur, p.prop.as_deref()))
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
                        self.compiled.refs[plan].display.clone(),
                        comps.len(),
                    ))
                }
            }
            Resolved::Missing => Err(Error::UnknownName(self.compiled.refs[plan].display.clone())),
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
        let component_type = self.components.component_type[comp as usize];
        let prop = match prop {
            Some(p) => p,
            None => component_type
                .default_prop()
                .ok_or_else(|| Error::NoDefaultProp(self.comp_label(comp)))?,
        };
        if let Some(parts) = component_type.virtual_prop(prop) {
            return Ok(parts
                .iter()
                .map(|p| self.slot(comp, component_type.prop_index(p).unwrap()))
                .collect());
        }
        let pi = component_type
            .prop_index(prop)
            .ok_or_else(|| Error::UnknownProp {
                name: self.comp_label(comp),
                prop: prop.into(),
            })?;
        Ok(vec![self.slot(comp, pi)])
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

    /// The one slot a reference names, without allocating. Errors with a
    /// placeholder `ArityMismatch` (callers fill in type and prop) when the
    /// reference names several cells.
    pub(in crate::build) fn resolve_one(&mut self, plan: RefId, scope: ScopeId) -> Result<SlotId> {
        let (target, prop) = self.resolve(plan, scope)?;
        let comp = match target {
            Resolved::Missing => return Ok(self.missing_slot()),
            other => self.single_component(other, plan)?,
        };
        let component_type = self.components.component_type[comp as usize];
        let prop = match prop {
            Some(p) => p,
            None => component_type
                .default_prop()
                .ok_or_else(|| Error::NoDefaultProp(self.comp_label(comp)))?,
        };
        if let Some(parts) = component_type.virtual_prop(prop) {
            return Err(Error::ArityMismatch {
                component_type: String::new(),
                prop: String::new(),
                expected: 1,
                got: parts.len(),
            });
        }
        let pi = component_type
            .prop_index(prop)
            .ok_or_else(|| Error::UnknownProp {
                name: self.comp_label(comp),
                prop: prop.into(),
            })?;
        Ok(self.slot(comp, pi))
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

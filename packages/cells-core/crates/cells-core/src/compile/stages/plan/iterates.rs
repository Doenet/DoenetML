//! `<functionIterates>` and the `<repeat for>` over its iterates: the
//! planners of types whose contents follow a list.

use super::Planning;
use super::lists::Splice;
use crate::compile::*;
use crate::components::MAX_TUPLE;
use crate::components::prop::function_iterates;

/// The name of an iteration's item's prop at position `i`, from its
/// table.
fn item_prop(i: usize) -> &'static str {
    Role::Item.ty().prop_defs()[i].name
}

/// Item prop `i` as a reference names it.
fn item_ref_prop(i: usize) -> RefProp {
    RefProp::of(Role::Item.ty(), PropSel::At(PropAt::Position(i)))
}

/// Planning, `<functionIterates>` and `<repeat for>` over its iterates. Reads
/// the record and what outlining settled, never another element's plan (ADR
/// 0029).
impl<'a> Planning<'a> {
    fn attr_macro(&self, el: NodeId, tag: &str, attr: &str) -> Result<NodeId> {
        self.rd
            .dast
            .attr(el, attr)
            .and_then(|a| self.rd.single_macro(a))
            .ok_or_else(|| Error::Unsupported(format!("<{tag}> needs {attr}=\"$name\"")))
    }

    /// `<functionIterates>`: the count chain from the prop table, then the
    /// hidden tuple of its body (element 0). Entry `j` of iteration `k` is
    /// the initial value's entry when `k` is 1, else `f`'s entry `j` with
    /// each variable replaced by the matching entry of iteration `k - 1`,
    /// lowered to numeric operators. The function's text is re-planned from
    /// the body, so its references resolve from the `<functionIterates>`.
    pub(super) fn plan_function_iterates(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        self.plan_table(t, e, None, true)?;
        let ports = function_iterates::Props::PORTS;
        self.tables[t.index()].plans[e.index()].props[ports.allIteratesWithInitial.index()] =
            Source::own(ports.count);
        let d = self.rd.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = *self.rd.own_row(t, e);
        let Body::Repeat { template: sub } = self.rd.own_row(t, e).body else {
            unreachable!("a functionIterates has a body template")
        };
        let fm = self.attr_macro(el, "functionIterates", "function")?;
        let fp = self.rd.plan_ref(&mut self.ar, t, scope, fm)?;
        self.rd.referent_type(
            &self.ar,
            self.boxes.visible(&self.tables),
            &mut self.planned.reads,
            t,
            e,
            fp,
        )?;
        let (ft, fe) = self
            .rd
            .static_target(&self.ar, t, fp)
            .filter(|&(ft, fe)| {
                self.rd
                    .referent_row(ft, fe)
                    .component_type
                    .plays(Role::Function)
            })
            .ok_or_else(|| {
                Error::Unsupported("<functionIterates function> must name a <function>".into())
            })?;
        let fnode = self.rd.referent_row(ft, fe).node;
        let vars = self.function_variables(fnode);
        let nodes: Vec<NodeId> = d.children(fnode).to_vec();
        let (mut toks, src) = self.rd.math_tokens(&mut self.ar, sub, ROOT_SCOPE, &nodes)?;
        // Variable j is entry j of the previous iterate: `$fi[k-1]`'s item,
        // whose entries are `x1`, `x2`, ... in its table.
        let first_entry = Role::Item
            .ty()
            .prop_index("x1")
            .expect("an item's first entry");
        let prev: Vec<RefId> = (0..vars.len())
            .map(|j| {
                let plan = RefPlan {
                    hops: 1,
                    steps: vec![
                        Step::Elem(e),
                        Step::Iter(IndexPlan {
                            terms: vec![IndexTerm::Iter(0), IndexTerm::Const(-1)],
                        }),
                        Step::Elem(ElemId::new(0)),
                    ],
                    prop: Some(item_ref_prop(first_entry + j)),
                    entries: Vec::new(),
                    display: RefDisplay::Spelled(format!("(previous iterate).{}", vars[j]).into()),
                    node: NodeId::NONE,
                };
                self.ar.push_ref(plan)
            })
            .collect();
        for tok in &mut toks {
            if let Token::Ident(s) = tok
                && let Some(j) = vars.iter().position(|v| v == s)
            {
                *tok = Token::Cell(prev[j]);
            }
        }
        let parts = match expr::tuple_entries(&toks) {
            Some(entries) if entries.len() > 1 => entries,
            _ => vec![toks.clone()],
        };
        let n = parts.len();
        if n != vars.len() || n > MAX_TUPLE {
            return Err(Error::Unsupported(format!(
                "iterating a function of {} variables with {} values (they must match, at most {MAX_TUPLE})",
                vars.len(),
                n
            )));
        }
        let mut exprs = Vec::with_capacity(n);
        for part in &parts {
            let id = self.rd.parse_tokens(&mut self.ar, part, src)?;
            let mut syms = Vec::new();
            self.ar.arena.symbols(id, &mut syms);
            if !syms.is_empty() {
                return Err(Error::BadMath {
                    text: src.text(self.rd.dast),
                    reason: format!(
                        "an iterated function must be numeric; '{}' is not a variable",
                        syms[0]
                    ),
                });
            }
            exprs.push(id);
        }
        let firsts = self.plan_initial_value(sub, el, n)?;
        let entries = firsts
            .into_iter()
            .enumerate()
            .map(|(j, first)| {
                Source::Specialize(
                    ScopePred::FirstIteration,
                    Box::new(first),
                    Box::new(Source::math(exprs[j])),
                )
            })
            .collect();
        self.tables[sub.index()].plans[0].props = prop::tuple::props_of(entries);
        Ok(())
    }

    /// The `n` entries of a `<functionIterates>`' `initialValue`, planned
    /// from its body: a reference (`$x0`, a number, point or tuple) or math
    /// text (`0.5`, `(1, $a, 0)`). Written numbers are constants, not state.
    fn plan_initial_value(&mut self, sub: TemplateId, el: NodeId, n: usize) -> Result<Vec<Source>> {
        let d = self.rd.dast;
        let a = d
            .attr(el, "initialValue")
            .ok_or_else(|| Error::Unsupported("<functionIterates> needs initialValue".into()))?;
        if let Some(m) = self.rd.single_macro(a) {
            let init = self.rd.plan_ref(&mut self.ar, sub, ROOT_SCOPE, m)?;
            return Ok(if n == 1 {
                vec![Source::reference(init)]
            } else {
                (0..n).map(|j| Source::coord(init, j)).collect()
            });
        }
        let nodes: Vec<NodeId> = d.attr_children(a).to_vec();
        let (toks, src) = self.rd.math_tokens(&mut self.ar, sub, ROOT_SCOPE, &nodes)?;
        let parts = match expr::tuple_entries(&toks) {
            Some(entries) if n > 1 => entries,
            _ => vec![toks.clone()],
        };
        if parts.len() != n {
            return Err(Error::BadMath {
                text: src.text(self.rd.dast),
                reason: format!("expected an initial value of {n} entries"),
            });
        }
        parts
            .iter()
            .map(|part| {
                let id = self.rd.parse_tokens(&mut self.ar, part, src)?;
                Ok(match self.rd.plan_from_expr(&self.ar, id) {
                    Source::Leaf(Leaf::Given(v)) => Source::constant(v),
                    other => other,
                })
            })
            .collect()
    }

    /// A `<function>`'s `variables`, split at spaces and commas; `x` when
    /// absent.
    pub(super) fn function_variables(&self, fnode: NodeId) -> Vec<String> {
        crate::compile::ir::expr::function_variables(
            self.rd
                .dast
                .attr(fnode, "variables")
                .and_then(|a| self.rd.attr_text(a)),
        )
    }

    /// `<repeat for="$fi.allIteratesWithInitial">`: `count` aliases the
    /// list's length, and the item `$x` of iteration `k` aliases every
    /// prop of the tuple of iteration `k` of the `<functionIterates>`
    /// (`k + 1` for `iterates`, which leaves out the initial value).
    pub(super) fn plan_repeat_for(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = *self.rd.own_row(t, e);
        let Some((sub, body)) = self.rd.body_rows(t, e) else {
            unreachable!("a repeat has a body template")
        };
        let m = self.attr_macro(el, "repeat", "for")?;
        let fp = self.rd.plan_ref(&mut self.ar, t, scope, m)?;
        let unsupported = || {
            Error::Unsupported(
                "<repeat for> takes a list, a sequence, a sampler or a <functionIterates>' \
                 allIteratesWithInitial or iterates"
                    .into(),
            )
        };
        let offset = match self.ar.refs[fp.index()].prop {
            Some(p) if p.is("allIteratesWithInitial") => 0,
            Some(p) if p.is("iterates") => 1,
            _ => {
                return self
                    .plan_repeat_for_sequence(t, e, sub, fp)
                    .ok_or_else(unsupported);
            }
        };
        let mut base = self.ar.refs[fp.index()].clone();
        base.prop = None;
        let base_id = self.ar.push_ref(base.clone()).index();
        match self
            .rd
            .static_target(&self.ar, t, RefId::from_index(base_id))
        {
            Some((ft, fe))
                if self.rd.referent_row(ft, fe).component_type.def().machinery
                    == Some(Machinery::FunctionIterates) => {}
            _ => return Err(unsupported()),
        }
        self.tables[t.index()].plans[e.index()].props = prop::repeat_for::Props {
            count: Source::reference(fp),
        }
        .into_vec();
        let has_item = body
            .first()
            .is_some_and(|x| x.node == NodeId::NONE && x.component_type.plays(Role::Item));
        if has_item {
            let mut steps = base.steps.clone();
            steps.push(Step::Iter(IndexPlan {
                terms: vec![IndexTerm::Iter(0), IndexTerm::Const(offset)],
            }));
            steps.push(Step::Elem(ElemId::new(0)));
            let props = (0..Role::Item.ty().prop_defs().len())
                .map(|i| {
                    let prop = item_prop(i);
                    let plan = RefPlan {
                        hops: base.hops + 1,
                        steps: steps.clone(),
                        prop: Some(item_ref_prop(i)),
                        entries: Vec::new(),
                        display: RefDisplay::Spelled(
                            format!("({}[i]).{prop}", display_of(self.rd.dast, &base)).into(),
                        ),
                        node: NodeId::NONE,
                    };
                    Source::reference(self.ar.push_ref(plan))
                })
                .collect();
            self.tables[sub.index()].plans[0].props = props;
        }
        Ok(())
    }

    /// A reference to the cell of the index outlining made beside a
    /// repeat's item (`body`, its body's rows), read from the iteration.
    fn iteration_index(&mut self, body: &[Elem]) -> Option<RefId> {
        let index = (1..body.len()).find(|&i| {
            let x = &body[i];
            x.node == NodeId::NONE && x.component_type.plays(Role::Index)
        })?;
        let index_ty = body[index].component_type;
        Some(self.ar.push_ref(RefPlan {
            hops: 0,
            steps: vec![Step::Elem(ElemId::from_index(index))],
            prop: Some(RefProp::of(
                index_ty,
                PropSel::At(PropAt::Position(index_ty.scalar_prop()?)),
            )),
            entries: Vec::new(),
            display: RefDisplay::Spelled("(iteration index)".into()),
            node: NodeId::NONE,
        }))
    }

    /// `<repeat for="$l">` over a sequence (ADR 0041, decision 2): one
    /// iteration per entry. Over a static sequence (a value list, a list
    /// operator, a `<sequence>` or sampler of literal count) the count is
    /// a constant and the item's value `$l[i]`, an entry step by the
    /// iteration's index; over a structural sequence (a `<sequence>` whose
    /// count follows a value) the count is its count's cell and the item
    /// aliases each prop of iteration `i`'s item. The item is of the type
    /// outlining settled from the sequence (`settle_repeat_items`). None
    /// for anything else.
    fn plan_repeat_for_sequence(
        &mut self,
        t: TemplateId,
        e: ElemId,
        sub: TemplateId,
        fp: RefId,
    ) -> Option<()> {
        let (rt, re) = self.rd.static_target(&self.ar, t, fp)?;
        let ty = self.rd.referent_row(rt, re).component_type;
        let base = self.ar.refs[fp.index()].clone();
        let (_, body) = self.rd.body_rows(t, e)?;
        let item = self.has_item(t, e).then(|| body[0].component_type);
        let spelled = display_of(self.rd.dast, &base);
        // The value a math or a math input holds (ADR 0041, decision 2):
        // as many iterations as it has entries, a count that follows the
        // value, and the item's value entry `i` inside its handle.
        if let Some(sel) = ty
            .handle_sel()
            .filter(|&sel| base.entries.is_empty() && base.prop.is_none_or(|p| p.sel == sel))
        {
            let count = ty.prop_index("numDimensions")?;
            let mut counted = base.clone();
            counted.prop = Some(RefProp::of(ty, PropSel::At(PropAt::Position(count))));
            let count = Source::reference(self.ar.push_ref(counted));
            let props = item.and_then(|it| {
                let [port] = it.entry_ports()[..] else {
                    return None;
                };
                let index = self.iteration_index(body)?;
                let mut plan = base.clone();
                plan.hops += 1;
                plan.prop = Some(RefProp::of(ty, sel));
                plan.entries.push(EntryIndex {
                    index: IndexPlan {
                        terms: vec![IndexTerm::Cell(index)],
                    },
                    width: EntryIndex::IN_HANDLE,
                });
                plan.display = RefDisplay::Spelled(format!("{spelled}[i]").into());
                plan.node = NodeId::NONE;
                let entry = Source::reference(self.ar.push_ref(plan));
                Some(
                    (0..it.prop_defs().len())
                        .map(|i| {
                            if i == port {
                                entry.clone()
                            } else {
                                Source::absent()
                            }
                        })
                        .collect::<Vec<_>>(),
                )
            });
            self.tables[t.index()].plans[e.index()].props =
                prop::repeat_for::Props { count }.into_vec();
            if let Some(props) = props {
                self.tables[sub.index()].plans[0].props = props;
            }
            return Some(());
        }
        let (count, props) = if let (Some(declared), Some(count)) = (ty.def().item, ty.count_prop())
        {
            // A structural sequence: its count's cell, and iteration `i`'s
            // item, element 0 of its body.
            if base.prop.is_some() || !base.entries.is_empty() {
                return None;
            }
            let mut counted = base.clone();
            counted.prop = Some(RefProp::of(ty, PropSel::At(PropAt::Position(count))));
            let count = Source::reference(self.ar.push_ref(counted));
            let mut steps = base.steps.clone();
            steps.push(Step::Iter(IndexPlan {
                terms: vec![IndexTerm::Iter(0)],
            }));
            steps.push(Step::Elem(ElemId::new(0)));
            let props = item.filter(|&it| it == declared.ty).map(|it| {
                (0..it.prop_defs().len())
                    .map(|i| {
                        let plan = RefPlan {
                            hops: base.hops + 1,
                            steps: steps.clone(),
                            prop: Some(RefProp::of(it, PropSel::At(PropAt::Position(i)))),
                            entries: Vec::new(),
                            display: RefDisplay::Spelled(
                                format!("({spelled}[i]).{}", it.prop_defs()[i].name).into(),
                            ),
                            node: NodeId::NONE,
                        };
                        Source::reference(self.ar.push_ref(plan))
                    })
                    .collect::<Vec<_>>()
            });
            (count, props)
        } else {
            // A static sequence: as many iterations as it has entries,
            // the item's value its entry `i`.
            let Splice::Entries(n) = self.splice(t, e, fp) else {
                return None;
            };
            let props = item.and_then(|it| {
                let [port] = it.entry_ports()[..] else {
                    return None;
                };
                let mut plan = base.clone();
                plan.hops += 1;
                if plan.prop.is_none() {
                    plan.prop = Some(RefProp::of(ty, PropSel::At(PropAt::List)));
                }
                // By the iteration's index, a cell (as `$l[$i]` is): the
                // index outlining made beside the item.
                let index = (1..body.len()).find(|&i| {
                    let x = &body[i];
                    x.node == NodeId::NONE && x.component_type.plays(Role::Index)
                })?;
                let index_ty = body[index].component_type;
                let index = self.ar.push_ref(RefPlan {
                    hops: 0,
                    steps: vec![Step::Elem(ElemId::from_index(index))],
                    prop: Some(RefProp::of(
                        index_ty,
                        PropSel::At(PropAt::Position(index_ty.scalar_prop()?)),
                    )),
                    entries: Vec::new(),
                    display: RefDisplay::Spelled("(iteration index)".into()),
                    node: NodeId::NONE,
                });
                plan.entries.push(EntryIndex {
                    index: IndexPlan {
                        terms: vec![IndexTerm::Cell(index)],
                    },
                    width: 1,
                });
                plan.display = RefDisplay::Spelled(format!("{spelled}[i]").into());
                plan.node = NodeId::NONE;
                let entry = Source::reference(self.ar.push_ref(plan));
                Some(
                    (0..it.prop_defs().len())
                        .map(|i| {
                            if i == port {
                                entry.clone()
                            } else {
                                Source::absent()
                            }
                        })
                        .collect::<Vec<_>>(),
                )
            });
            (Source::constant(n as f64), props)
        };
        self.tables[t.index()].plans[e.index()].props =
            prop::repeat_for::Props { count }.into_vec();
        if let Some(props) = props {
            self.tables[sub.index()].plans[0].props = props;
        }
        Some(())
    }
}

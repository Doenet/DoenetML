//! `<functionIterates>` and the `<repeat for>` over its iterates: the
//! planners of types whose contents follow a list.

use crate::compile::*;
use crate::components::MAX_TUPLE;
use crate::components::prop::function_iterates;

/// The name of a tuple's prop at position `i`, from its table.
fn tuple_prop(i: usize) -> &'static str {
    ComponentType::Tuple.prop_defs()[i].name
}

/// Tuple prop `i` as a reference names it.
fn tuple_ref_prop(i: usize) -> RefProp {
    RefProp::of(ComponentType::Tuple, PropSel::At(PropAt::Position(i)))
}

impl<'a> Compiler<'a> {
    fn attr_macro(&self, el: NodeId, tag: &str, attr: &str) -> Result<NodeId> {
        self.compiled
            .dast
            .attr(el, attr)
            .and_then(|a| self.single_macro(a))
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
        let d = self.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        let Body::Repeat { template: sub } = self.outlined(t).elems[e.index()].body else {
            unreachable!("a functionIterates has a body template")
        };
        let fm = self.attr_macro(el, "functionIterates", "function")?;
        let fp = self.plan_ref(t, scope, fm)?;
        self.referent_type(t, e, fp)?;
        let (ft, fe) = self
            .static_target(t, fp)
            .filter(|&(ft, fe)| {
                self.outlined(ft).elems[fe.index()].component_type == ComponentType::Function
            })
            .ok_or_else(|| {
                Error::Unsupported("<functionIterates function> must name a <function>".into())
            })?;
        let fnode = self.outlined(ft).elems[fe.index()].node;
        let vars = self.function_variables(fnode);
        let nodes: Vec<NodeId> = d.children(fnode).to_vec();
        let (mut toks, src) = self.math_tokens(sub, ROOT_SCOPE, &nodes)?;
        // Variable j is entry j of the previous iterate: `$fi[k-1]`'s tuple.
        let prev: Vec<RefId> = (0..vars.len())
            .map(|j| {
                self.compiled.refs.push(RefPlan {
                    hops: 1,
                    steps: vec![
                        Step::Elem(e),
                        Step::Iter(IndexPlan {
                            terms: vec![IndexTerm::Iter(0), IndexTerm::Const(-1)],
                        }),
                        Step::Elem(ElemId::new(0)),
                    ],
                    prop: Some(tuple_ref_prop(crate::components::prop::tuple::X1 + j)),
                    display: RefDisplay::Spelled(format!("(previous iterate).{}", vars[j]).into()),
                    node: NodeId::NONE,
                });
                RefId::from_index(self.compiled.refs.len() - 1)
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
            let id = self.parse_tokens(part, src)?;
            let mut syms = Vec::new();
            self.compiled.arena.symbols(id, &mut syms);
            if !syms.is_empty() {
                return Err(Error::BadMath {
                    text: src.text(self.dast),
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
        let d = self.dast;
        let a = d
            .attr(el, "initialValue")
            .ok_or_else(|| Error::Unsupported("<functionIterates> needs initialValue".into()))?;
        if let Some(m) = self.single_macro(a) {
            let init = self.plan_ref(sub, ROOT_SCOPE, m)?;
            return Ok(if n == 1 {
                vec![Source::reference(init)]
            } else {
                (0..n).map(|j| Source::coord(init, j)).collect()
            });
        }
        let nodes: Vec<NodeId> = d.attr_children(a).to_vec();
        let (toks, src) = self.math_tokens(sub, ROOT_SCOPE, &nodes)?;
        let parts = match expr::tuple_entries(&toks) {
            Some(entries) if n > 1 => entries,
            _ => vec![toks.clone()],
        };
        if parts.len() != n {
            return Err(Error::BadMath {
                text: src.text(self.dast),
                reason: format!("expected an initial value of {n} entries"),
            });
        }
        parts
            .iter()
            .map(|part| {
                let id = self.parse_tokens(part, src)?;
                Ok(match self.plan_from_expr(id) {
                    Source::Leaf(Leaf::Given(v)) => Source::constant(v),
                    other => other,
                })
            })
            .collect()
    }

    /// A `<function>`'s `variables`, split at spaces and commas; `x` when
    /// absent.
    pub(super) fn function_variables(&self, fnode: NodeId) -> Vec<String> {
        crate::components::values::curve::variables(
            self.compiled
                .dast
                .attr(fnode, "variables")
                .and_then(|a| self.attr_text(a)),
        )
    }

    /// The hidden iteration elements outlining made in repeat `e`'s body
    /// for its `valueName` and `indexName`: a `<repeatForSequence>`'s value
    /// is `from + (k - 1) * step`, its `from` and `step` aliasing the
    /// repeat's own (one hop up) and `k` the iteration's position; either
    /// repeat's index is the iteration's position. A `<repeat>`'s value, a
    /// tuple, is `plan_repeat_for`'s.
    pub(in crate::compile) fn plan_iteration_names(&mut self, t: TemplateId, e: ElemId) {
        let Body::Repeat { template: sub } = self.outlined(t).elems[e.index()].body else {
            return;
        };
        for i in 0..self.outlined(sub).elems.len() {
            let el = &self.outlined(sub).elems[i];
            if el.node != NodeId::NONE {
                continue;
            }
            let props = match el.component_type {
                ComponentType::SequenceValue => {
                    let from = self.own_prop_plan(t, e, "from");
                    let step = self.own_prop_plan(t, e, "step");
                    use prop::sequence_value as sv;
                    let ports = sv::Props::PORTS;
                    let table = |port| Wire::from_table(ComponentType::SequenceValue, port);
                    let mut wiring = ElemWiring::of(ComponentType::SequenceValue);
                    wiring.set_public(sv::Props {
                        from: Source::reference(from).into(),
                        step: Source::reference(step).into(),
                        k: Source::Leaf(Leaf::Scope(ScopeConst::IterIndex)).into(),
                        km1: table(ports.km1),
                        scaled: table(ports.scaled),
                        value: table(ports.value),
                    });
                    wiring.finish().0
                }
                ComponentType::Number => prop::number::Props {
                    value: Source::Leaf(Leaf::Scope(ScopeConst::IterIndex)),
                }
                .into_vec(),
                _ => continue,
            };
            self.tables[sub.index()].plans[i].props = props;
        }
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
        } = self.outlined(t).elems[e.index()];
        let Body::Repeat { template: sub } = self.outlined(t).elems[e.index()].body else {
            unreachable!("a repeat has a body template")
        };
        let m = self.attr_macro(el, "repeat", "for")?;
        let fp = self.plan_ref(t, scope, m)?;
        let unsupported = || {
            Error::Unsupported(
                "<repeat for> takes a <functionIterates>' allIteratesWithInitial or iterates"
                    .into(),
            )
        };
        let offset = match self.compiled.refs[fp.index()].prop {
            Some(p) if p.is("allIteratesWithInitial") => 0,
            Some(p) if p.is("iterates") => 1,
            _ => return Err(unsupported()),
        };
        let mut base = self.compiled.refs[fp.index()].clone();
        base.prop = None;
        self.compiled.refs.push(base.clone());
        let base_id = self.compiled.refs.len() - 1;
        match self.static_target(t, RefId::from_index(base_id)) {
            Some((ft, fe))
                if self.outlined(ft).elems[fe.index()].component_type
                    == ComponentType::FunctionIterates => {}
            _ => return Err(unsupported()),
        }
        self.tables[t.index()].plans[e.index()].props = prop::repeat_for::Props {
            count: Source::reference(fp),
        }
        .into_vec();
        let has_item =
            self.outlined(sub).elems.first().is_some_and(|x| {
                x.node == NodeId::NONE && x.component_type == ComponentType::Tuple
            });
        if has_item {
            let mut steps = base.steps.clone();
            steps.push(Step::Iter(IndexPlan {
                terms: vec![IndexTerm::Iter(0), IndexTerm::Const(offset)],
            }));
            steps.push(Step::Elem(ElemId::new(0)));
            let props = (0..ComponentType::Tuple.prop_defs().len())
                .map(|i| {
                    let prop = tuple_prop(i);
                    self.compiled.refs.push(RefPlan {
                        hops: base.hops + 1,
                        steps: steps.clone(),
                        prop: Some(tuple_ref_prop(i)),
                        display: RefDisplay::Spelled(
                            format!("({}[i]).{prop}", self.compiled.display_of(&base)).into(),
                        ),
                        node: NodeId::NONE,
                    });
                    Source::reference(RefId::from_index(self.compiled.refs.len() - 1))
                })
                .collect();
            self.tables[sub.index()].plans[0].props = props;
        }
        Ok(())
    }
}

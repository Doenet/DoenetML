//! `<functionIterates>`, the `<repeat for>` over its iterates, and
//! `<polyline>`: the planners of types whose contents follow a list.

use super::*;
use crate::components::MAX_TUPLE;
use crate::components::prop::function_iterates;

/// The props of a tuple, in table order.
const TUPLE_PROPS: [&str; 1 + MAX_TUPLE] = ["n", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8"];

impl<'a> Compiler<'a> {
    /// The element a plan names, wherever it is up the template nesting,
    /// when the path is names only (no index, no interface).
    pub(in crate::build) fn static_target(
        &self,
        t: TemplateId,
        p: RefId,
    ) -> Option<(TemplateId, ElemId)> {
        let plan = &self.compiled.refs[p];
        let mut tt = t;
        for _ in 0..plan.hops {
            tt = self.compiled.templates[tt].parent?.0;
        }
        let mut last = None;
        for step in &plan.steps {
            match step {
                Step::Elem(e) => last = Some(*e),
                Step::Index(_) | Step::Iface(..) => return None,
            }
        }
        last.map(|e| (tt, e))
    }

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
        self.plan_attrs(t, e, None)?;
        self.compiled.templates[t].elems[e].props[function_iterates::ALL] =
            SourcePlan::own(function_iterates::COUNT);
        let d = self.compiled.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let Body::Repeat { template: sub } = self.compiled.templates[t].elems[e].body else {
            unreachable!("a functionIterates has a body template")
        };
        let fm = self.attr_macro(el, "functionIterates", "function")?;
        let fp = self.plan_ref(t, scope, fm)?;
        let (ft, fe) = self
            .static_target(t, fp)
            .filter(|&(ft, fe)| {
                self.compiled.templates[ft].elems[fe].component_type == ComponentType::Function
            })
            .ok_or_else(|| {
                Error::Unsupported("<functionIterates function> must name a <function>".into())
            })?;
        let fnode = self.compiled.templates[ft].elems[fe].node;
        let vars = self.function_variables(fnode);
        let nodes: Vec<NodeId> = d.children(fnode).to_vec();
        let (mut toks, text) = self.math_tokens(sub, ROOT_SCOPE, &nodes)?;
        // Variable j is entry j of the previous iterate: `$fi[k-1]`'s tuple.
        let prev: Vec<RefId> = (0..vars.len())
            .map(|j| {
                self.compiled.refs.push(RefPlan {
                    hops: 1,
                    steps: vec![
                        Step::Elem(e),
                        Step::Index(IndexPlan {
                            terms: vec![IndexTerm::Iter(0), IndexTerm::Const(-1)],
                        }),
                        Step::Elem(0),
                    ],
                    prop: Some(TUPLE_PROPS[j + 1].to_string()),
                    display: format!("(previous iterate).{}", vars[j]),
                });
                self.compiled.refs.len() - 1
            })
            .collect();
        for tok in &mut toks {
            if let Token::Ident(s) = tok
                && let Some(j) = vars.iter().position(|v| v == s)
            {
                *tok = Token::Cell(prev[j] as CellIdx);
            }
        }
        let parts = match expr::unwrap_parens(&toks) {
            Some(inner) if expr::split_top(inner, &Token::Comma).len() > 1 => {
                expr::split_top(inner, &Token::Comma)
            }
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
            let id = self.parse_tokens(part, &text)?;
            let mut syms = Vec::new();
            self.compiled.arena.symbols(id, &mut syms);
            if !syms.is_empty() {
                return Err(Error::BadMath {
                    text: text.clone(),
                    reason: format!(
                        "an iterated function must be numeric; '{}' is not a variable",
                        syms[0]
                    ),
                });
            }
            exprs.push(id);
        }
        let firsts = self.plan_initial_value(sub, el, n)?;
        let mut props = vec![SourcePlan::Fixed(n as f64)];
        for (j, first) in firsts.into_iter().enumerate() {
            props.push(SourcePlan::FirstIteration(
                Box::new(first),
                Box::new(SourcePlan::Math(exprs[j])),
            ));
        }
        props.resize(1 + MAX_TUPLE, SourcePlan::Fixed(f64::NAN));
        self.compiled.templates[sub].elems[0].props = props;
        Ok(())
    }

    /// The `n` entries of a `<functionIterates>`' `initialValue`, planned
    /// from its body: a reference (`$x0`, a number, point or tuple) or math
    /// text (`0.5`, `(1, $a, 0)`). Written numbers are constants, not state.
    fn plan_initial_value(
        &mut self,
        sub: TemplateId,
        el: NodeId,
        n: usize,
    ) -> Result<Vec<SourcePlan>> {
        let d = self.compiled.dast;
        let a = d
            .attr(el, "initialValue")
            .ok_or_else(|| Error::Unsupported("<functionIterates> needs initialValue".into()))?;
        if let Some(m) = self.single_macro(a) {
            let init = self.plan_ref(sub, ROOT_SCOPE, m)?;
            return Ok(if n == 1 {
                vec![SourcePlan::reference(init)]
            } else {
                (0..n).map(|j| SourcePlan::coord(init, j)).collect()
            });
        }
        let nodes: Vec<NodeId> = d.attr_children(a).to_vec();
        let (toks, text) = self.math_tokens(sub, ROOT_SCOPE, &nodes)?;
        let parts = match expr::unwrap_parens(&toks) {
            Some(inner) if n > 1 => expr::split_top(inner, &Token::Comma),
            _ => vec![toks.clone()],
        };
        if parts.len() != n {
            return Err(Error::BadMath {
                text,
                reason: format!("expected an initial value of {n} entries"),
            });
        }
        parts
            .iter()
            .map(|part| {
                let id = self.parse_tokens(part, &text)?;
                Ok(match self.plan_from_expr(id) {
                    SourcePlan::Literal(v) => SourcePlan::Fixed(v),
                    plan => plan,
                })
            })
            .collect()
    }

    /// A `<function>`'s `variables`, split at spaces and commas; `x` when
    /// absent.
    pub(super) fn function_variables(&self, fnode: NodeId) -> Vec<String> {
        let vars: Vec<String> = self
            .compiled
            .dast
            .attr(fnode, "variables")
            .and_then(|a| self.attr_text(a))
            .map(|s| {
                s.split(|c: char| c.is_whitespace() || c == ',')
                    .filter(|v| !v.is_empty())
                    .map(str::to_string)
                    .collect()
            })
            .unwrap_or_default();
        if vars.is_empty() {
            vec!["x".to_string()]
        } else {
            vars
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
        } = self.compiled.templates[t].elems[e];
        let Body::Repeat { template: sub } = self.compiled.templates[t].elems[e].body else {
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
        let offset = match self.compiled.refs[fp].prop.as_deref() {
            Some("allIteratesWithInitial") => 0,
            Some("iterates") => 1,
            _ => return Err(unsupported()),
        };
        let mut base = self.compiled.refs[fp].clone();
        base.prop = None;
        self.compiled.refs.push(base.clone());
        let base_id = self.compiled.refs.len() - 1;
        match self.static_target(t, base_id) {
            Some((ft, fe))
                if self.compiled.templates[ft].elems[fe].component_type
                    == ComponentType::FunctionIterates => {}
            _ => return Err(unsupported()),
        }
        self.compiled.templates[t].elems[e].props = vec![SourcePlan::reference(fp)];
        let has_item = self.compiled.templates[sub]
            .elems
            .first()
            .is_some_and(|x| x.node == NONE && x.component_type == ComponentType::Tuple);
        if has_item {
            let mut steps = base.steps.clone();
            steps.push(Step::Index(IndexPlan {
                terms: vec![IndexTerm::Iter(0), IndexTerm::Const(offset)],
            }));
            steps.push(Step::Elem(0));
            let props = TUPLE_PROPS
                .iter()
                .map(|prop| {
                    self.compiled.refs.push(RefPlan {
                        hops: base.hops + 1,
                        steps: steps.clone(),
                        prop: Some(prop.to_string()),
                        display: format!("({}[i]).{prop}", base.display),
                    });
                    SourcePlan::reference(self.compiled.refs.len() - 1)
                })
                .collect();
            self.compiled.templates[sub].elems[0].props = props;
        }
        Ok(())
    }

    /// `<polyline vertices="$r">`: gathers the points under what `vertices`
    /// names, as `<collect componentType="point">` would; `numVertices` is
    /// set when it expands.
    pub(super) fn plan_polyline(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let m = self.attr_macro(el, "polyline", "vertices")?;
        let p = self.plan_ref(t, scope, m)?;
        if self.compiled.refs[p].prop.is_some() {
            return Err(Error::Unsupported(
                "<polyline vertices> must name a component holding points".into(),
            ));
        }
        let el = &mut self.compiled.templates[t].elems[e];
        el.body = Body::Collect {
            from: p,
            component_type: ComponentType::Point,
        };
        el.props = vec![SourcePlan::Fixed(f64::NAN)];
        Ok(())
    }
}

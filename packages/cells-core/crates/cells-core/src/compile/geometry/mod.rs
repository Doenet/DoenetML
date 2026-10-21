//! What the geometric types share: `plan_geo`, which runs each type's
//! planner (in its file under `components/geometry/`, ADR 0016) and
//! handles `extend` around it, point lists, and inherited attributes. A
//! planner reads the element's attributes and children and chooses the
//! operator chain that produces the type's public props (ADR 0006); the
//! inverse rules of the operators it uses are in `program/vector.rs`.

use super::*;

/// What a planner is given (ADR 0016): its element's attributes, planned
/// the ways every component shares, and a way to warn. An attribute is the
/// element's own or, when the element omits it, its `extend` referent's.
/// One context serves every kind of planner; the kind decides what is done
/// around the call. For a shape, `plan_geo` makes it and does the rest: a
/// bare copy, sharing state with the referent, and `fixed`. Only
/// shapes are given one so far.
impl<'a> Compiler<'a> {
    /// Runs a geometric type's planner (`plan`, from `planner`) with what
    /// the types share around it: a bare copy aliases every prop, and a copy
    /// with its own attributes merges them over the referent's.
    pub(in crate::compile) fn plan_geo(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
        plan: planner::GeoFn,
    ) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            ..
        } = self.compiled.templates[t].elems[e];
        // Own attributes other than name and extend, or children, override
        // the referent's; with none, the copy aliases every public prop.
        let own_attrs: Vec<String> = d
            .attrs(el)
            .map(|a| d.attr_name(a).to_string())
            .filter(|n| n != "name" && n != "extend")
            .collect();
        let has_children = !d.children(el).iter().all(|&n| self.is_blank(n));
        if extend.is_some() && own_attrs.is_empty() && !has_children {
            let n = component_type.prop_defs().len();
            let el = &mut self.compiled.templates[t].elems[e];
            el.props = vec![SourcePlan::Inherit; n];
            // A list is as long as the referent's, which the build knows.
            if component_type.given_coords().is_some() {
                el.n_public = NPublic::AsReferent;
            }
            return Ok(());
        }
        // Merged attributes: the referent's node supplies what the copy omits.
        let base_elem = extend
            .and_then(|p| self.plan_elem_target(t, p))
            .filter(|&r| self.compiled.templates[t].elems[r].node != NONE);
        let base = base_elem.map(|r| self.compiled.templates[t].elems[r].node);
        let mut wiring = plan(&mut PlanCtx::new(self, t, e, base))?;
        // Essential state the copy did not override is the original's: the
        // current core's copies share their essential state variables.
        if let Some(r) = base_elem {
            let base_shared_state = self
                .shared_state
                .get(&(t as u32, r as u32))
                .cloned()
                .unwrap_or_default();
            for (state, &slot) in &wiring.shared_state {
                // Shared state the copy's own attribute supplied is its own.
                if wiring
                    .shared_state_attr
                    .get(state)
                    .is_some_and(|a| own_attrs.iter().any(|o| o == a))
                {
                    continue;
                }
                if let Some(&bs) = base_shared_state.get(state)
                    && matches!(wiring.props[slot as usize], Some(SourcePlan::Literal(_)))
                {
                    wiring.props[slot as usize] = Some(SourcePlan::Alias(Arg::Elem(r, bs)));
                }
            }
        }
        let scope = self.compiled.templates[t].elems[e].name_scope;
        self.plan_fix(t, scope, el, &["fixed"])?
            .apply(&mut wiring.props);
        if !wiring.shared_state.is_empty() {
            self.shared_state
                .insert((t as u32, e as u32), wiring.shared_state.clone());
        }
        if component_type.given_coords().is_some() {
            self.compiled.templates[t].elems[e].n_public = NPublic::Planned(wiring.n_public as u32);
        }
        self.compiled.templates[t].elems[e].props = wiring.finish();
        Ok(())
    }

    /// The children that make up math text: text and `$ref`s, not blanks
    /// or elements (constraints).
    pub(in crate::compile) fn math_children(&self, node: NodeId) -> Vec<NodeId> {
        let d = self.dast;
        d.children(node)
            .iter()
            .copied()
            .filter(|&n| !self.is_blank(n) && d.kind(n) != NodeKind::Element)
            .collect()
    }

    /// Attribute of the element, or of the `extend` referent when the
    /// element does not give it (a copy with overrides).
    pub(in crate::compile) fn attr_or_inherited(
        &self,
        el: NodeId,
        base: Option<NodeId>,
        name: &str,
    ) -> Option<u32> {
        let d = self.dast;
        d.attr(el, name)
            .or_else(|| base.and_then(|b| d.attr(b, name)))
    }

    /// The points of a point-list attribute: bare references, parenthesized
    /// tuples (which may contain references), and references to list props
    /// (`$l.points`), which contribute one point per item.
    pub(in crate::compile) fn plan_point_list(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        a: u32,
    ) -> Result<Vec<PointPlan>> {
        let d = self.dast;
        let (toks, text) = self.math_tokens(t, scope, d.attr_children(a))?;
        let mut out = Vec::new();
        let mut i = 0;
        while i < toks.len() {
            match &toks[i] {
                Token::Cell(p) => {
                    let p = *p as RefId;
                    // An list prop expands to its items.
                    let items = self.array_items_of_plan(t, p)?;
                    match items {
                        Some(n) => out.extend((0..n).map(|k| PointPlan::Item(p, k))),
                        None => out.push(PointPlan::Ref(p)),
                    }
                    i += 1;
                }
                Token::LParen => {
                    let start = i;
                    let mut depth = 0i32;
                    loop {
                        match toks.get(i) {
                            Some(Token::LParen) => depth += 1,
                            Some(Token::RParen) => depth -= 1,
                            None => {
                                return Err(Error::BadMath {
                                    text,
                                    reason: "missing ')'".into(),
                                });
                            }
                            _ => {}
                        }
                        i += 1;
                        if depth == 0 {
                            break;
                        }
                    }
                    let inner = super::expr::unwrap_parens(&toks[start..i]).unwrap();
                    out.push(PointPlan::Tuple(self.tuple_from_tokens(inner, &text)?));
                }
                Token::Comma => i += 1,
                // A symbol (`through="A"`) is not a point here: NaN, as the
                // current core's warning case.
                Token::Ident(_) => {
                    out.push(PointPlan::Tuple([
                        SourcePlan::Fixed(f64::NAN),
                        SourcePlan::Fixed(f64::NAN),
                    ]));
                    i += 1;
                }
                other => {
                    return Err(Error::BadMath {
                        text,
                        reason: format!("unexpected {other:?} in a point list"),
                    });
                }
            }
        }
        Ok(out)
    }

    /// If plan `p` names a list prop, how many items it has (known at
    /// compile time from the referent element).
    pub(in crate::compile) fn array_items_of_plan(
        &self,
        t: TemplateId,
        p: RefId,
    ) -> Result<Option<usize>> {
        let plan = &self.compiled.refs[p];
        let Some(prop) = &plan.prop else {
            return Ok(None);
        };
        // Find the element the path ends at, if it is in this template chain.
        let mut cur_t = t;
        for _ in 0..plan.hops {
            cur_t = self.compiled.templates[cur_t].parent.unwrap().0;
        }
        let mut e = None;
        for step in &plan.steps {
            match step {
                Step::Elem(x) => e = Some(*x),
                Step::Index(_) | Step::Iface(..) => return Ok(None),
            }
        }
        let Some(e) = e else { return Ok(None) };
        let el = &self.compiled.templates[cur_t].elems[e];
        // A list holds the points given: a circle's up to three.
        if el.component_type.prop_at(prop) == Some(PropAt::List) {
            return Ok(Some(match el.component_type {
                ComponentType::Circle => self.count_points_in_attr(el.node, "through")?.min(3),
                _ => self.count_points_in_attr(el.node, "vertices")?,
            }));
        }
        let Some(items) = el.component_type.table_list(prop) else {
            return Ok(None);
        };
        Ok(Some(items.len()))
    }

    /// Points in a point-list attribute, counted from its text alone.
    pub(in crate::compile) fn count_points_in_attr(&self, el: NodeId, name: &str) -> Result<usize> {
        let d = self.dast;
        let Some(a) = (el != NONE).then(|| d.attr(el, name)).flatten() else {
            return Ok(0);
        };
        let mut n = 0;
        let mut depth = 0i32;
        for &node in d.attr_children(a) {
            match d.kind(node) {
                NodeKind::Macro if depth == 0 => n += 1,
                NodeKind::Text => {
                    for c in d.str(node).chars() {
                        match c {
                            '(' => {
                                if depth == 0 {
                                    n += 1;
                                }
                                depth += 1;
                            }
                            ')' => depth -= 1,
                            _ => {}
                        }
                    }
                }
                _ => {}
            }
        }
        Ok(n)
    }

    /// Replace cell leaves that name a `<math>` element of this template
    /// with that math's own expression when it has free symbols.
    pub(in crate::compile) fn inline_symbolic_maths(
        &mut self,
        t: TemplateId,
        id: ExprId,
    ) -> ExprId {
        let e = self.compiled.arena.get(id).clone();
        match e {
            Expr::Cell(p) => {
                let plan = &self.compiled.refs[p as usize];
                let is_value = plan.prop.as_deref().is_none_or(|pr| pr == "value");
                let Some(target) = (is_value)
                    .then(|| self.plan_elem_target(t, p as RefId))
                    .flatten()
                else {
                    return id;
                };
                // The math may come later in the document and not be planned yet.
                if self.compiled.templates[t].elems[target].component_type == ComponentType::Math
                    && self.compiled.templates[t].elems[target].props.is_empty()
                    && self.plan_elem(t, target).is_err()
                {
                    return id;
                }
                match self.compiled.templates[t].elems[target]
                    .props
                    .get(prop::math::EXPR)
                {
                    Some(SourcePlan::MathHandle(inner, _)) => {
                        let inner = *inner;
                        let mut syms = Vec::new();
                        self.compiled.arena.symbols(inner, &mut syms);
                        if syms.is_empty() {
                            return id;
                        }
                        self.inline_symbolic_maths(t, inner)
                    }
                    _ => id,
                }
            }
            Expr::Num(_) | Expr::Sym(_) => id,
            Expr::Neg(a) => {
                let a = self.inline_symbolic_maths(t, a);
                self.compiled.arena.push(Expr::Neg(a))
            }
            Expr::Call(f, args) => {
                let args = args
                    .into_iter()
                    .map(|a| self.inline_symbolic_maths(t, a))
                    .collect();
                self.compiled.arena.push(Expr::Call(f, args))
            }
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                let (na, nb) = (
                    self.inline_symbolic_maths(t, a),
                    self.inline_symbolic_maths(t, b),
                );
                self.compiled.arena.push(e.with_operands(na, nb))
            }
        }
    }
}

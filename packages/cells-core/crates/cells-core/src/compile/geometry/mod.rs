//! What the geometric types share: `plan_geo`, which runs each type's
//! planner (in its file under `components/geometry/`, ADR 0016) and
//! handles `extend` around it, point lists, and inherited attributes. A
//! planner reads the element's attributes and children and chooses the
//! operator chain that produces the type's public props (ADR 0006); the
//! inverse rules of the operators it uses are in `program/vector.rs`.

use super::*;

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
            el.props = vec![Source::Inherit; n];
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
                    && matches!(wiring.props[slot as usize], Some(Source::Literal(_)))
                {
                    wiring.props[slot as usize] = Some(Source::Alias(Arg::Elem(r, bs)));
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
    ) -> Result<Vec<GivenPoint>> {
        let d = self.dast;
        let (toks, text) = self.math_tokens(t, scope, d.attr_children(a))?;
        let mut out = Vec::new();
        let mut i = 0;
        while i < toks.len() {
            match &toks[i] {
                Token::Cell(p) => {
                    let p = *p as RefId;
                    // A list prop expands to its items.
                    let items = self.array_items_of_plan(t, p)?;
                    match items {
                        Some(n) => out.extend((0..n).map(|k| GivenPoint::Item(p, k))),
                        None => out.push(GivenPoint::Ref(p)),
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
                    out.push(GivenPoint::Tuple(self.tuple_from_tokens(inner, &text)?));
                }
                Token::Comma => i += 1,
                // A symbol (`through="A"`) is not a point here: NaN, as the
                // current core's warning case.
                Token::Ident(_) => {
                    out.push(GivenPoint::Tuple([
                        Source::Fixed(f64::NAN),
                        Source::Fixed(f64::NAN),
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
                    Some(Source::MathHandle(inner, _)) => {
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

/// The copy rules of `plan_geo` (ADR 0016, Migration step 8), against the
/// test-only components: a bare copy aliases its referent; a copy with
/// its own attributes keeps the shared state those attributes supply, and
/// shares the rest with its referent, in both directions.
#[cfg(test)]
mod tests {
    use crate::testing::dast::{document, el, load, mac};
    use crate::testing::{prop_value as value, request_prop as request};

    /// `<testShape name="s" a="1" b="2"/>` and `copy`, extending it.
    fn with_copy(copy: crate::testing::dast::Element) -> crate::Document {
        let doc = load(document([
            el("testValue").name("v").attr("value", "5"),
            el("testShape").name("s").attr("a", "1").attr("b", "2"),
            copy.attr("extend", mac("s")),
        ]))
        .unwrap();
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        doc
    }

    #[test]
    fn a_bare_copy_is_its_referent() {
        let mut doc = with_copy(el("testShape").name("d"));
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (1.0, 2.0));
        assert_eq!(value(&doc, "d.sum"), 3.0);
        assert!(request(&mut doc, "d.a", 5.0).dropped.is_empty());
        assert_eq!((value(&doc, "s.a"), value(&doc, "d.sum")), (5.0, 7.0));
        assert!(request(&mut doc, "s.b", 4.0).dropped.is_empty());
        assert_eq!((value(&doc, "d.b"), value(&doc, "d.sum")), (4.0, 9.0));
    }

    #[test]
    fn an_own_attribute_keeps_its_state_and_shares_the_rest() {
        let mut doc = with_copy(el("testShape").name("d").attr("a", "7"));
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (7.0, 1.0));
        assert_eq!((value(&doc, "d.b"), value(&doc, "d.sum")), (2.0, 9.0));
        // `a` is the copy's own: a change of either leaves the other.
        request(&mut doc, "d.a", 8.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 1.0));
        request(&mut doc, "s.a", 0.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 0.0));
        // `b` is shared, from either side.
        request(&mut doc, "d.b", 9.0);
        assert_eq!(value(&doc, "s.b"), 9.0);
        request(&mut doc, "s.b", 3.0);
        assert_eq!((value(&doc, "d.b"), value(&doc, "d.sum")), (3.0, 11.0));
    }

    #[test]
    fn state_the_referent_defaulted_is_shared() {
        let mut doc = load(document([
            el("testShape").name("s"),
            el("testShape")
                .name("d")
                .attr("extend", mac("s"))
                .attr("b", "4"),
        ]))
        .unwrap();
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (0.0, 4.0));
        assert_eq!(value(&doc, "s.b"), 0.0);
        request(&mut doc, "s.a", 6.0);
        assert_eq!(value(&doc, "d.a"), 6.0);
        request(&mut doc, "d.a", 2.0);
        assert_eq!(value(&doc, "s.a"), 2.0);
    }

    #[test]
    fn an_own_reference_follows_what_it_names() {
        let mut doc = with_copy(el("testShape").name("d").attr("a", mac("v")));
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (5.0, 1.0));
        request(&mut doc, "v.value", 6.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (6.0, 1.0));
        // A request on the copy reaches what its attribute names, not the
        // referent.
        request(&mut doc, "d.a", 4.0);
        assert_eq!((value(&doc, "v.value"), value(&doc, "s.a")), (4.0, 1.0));
    }

    #[test]
    fn an_attribute_supplying_no_state_shares_it_all() {
        // `fixed` makes the copy not bare, but supplies neither `a` nor `b`.
        // (What a request on the fixed copy does is `fixed`'s rule, not
        // the copy's.)
        let mut doc = with_copy(el("testShape").name("d").attr("fixed", "true"));
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (1.0, 2.0));
        request(&mut doc, "s.a", 3.0);
        assert_eq!(value(&doc, "d.a"), 3.0);
    }

    #[test]
    fn a_copy_of_a_copy_shows_the_copy() {
        let mut doc = load(document([
            el("testShape").name("s").attr("a", "1").attr("b", "2"),
            el("testShape")
                .name("d")
                .attr("extend", mac("s"))
                .attr("a", "7"),
            el("testShape").name("e").attr("extend", mac("d")),
        ]))
        .unwrap();
        assert_eq!((value(&doc, "e.a"), value(&doc, "e.b")), (7.0, 2.0));
        request(&mut doc, "e.a", 8.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 1.0));
        request(&mut doc, "e.b", 5.0);
        assert_eq!(value(&doc, "s.b"), 5.0);
    }

    /// The hole binding shared state by identifier closes: the planner
    /// names `aa` as supplying `A`, the copy's `a` does not match it, and
    /// the copy's own value is silently replaced by its referent's. When
    /// the binding is an identifier, `<testMisspelled>` does not compile
    /// and this test goes with it.
    #[test]
    fn a_misspelled_binding_silently_shares_the_referents_state() {
        let doc = load(document([
            el("testMisspelled").name("s").attr("a", "1").attr("b", "2"),
            el("testMisspelled")
                .name("d")
                .attr("extend", mac("s"))
                .attr("a", "7"),
        ]))
        .unwrap();
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        assert_eq!(value(&doc, "d.a"), 1.0, "the override of `a` is lost");
    }
}

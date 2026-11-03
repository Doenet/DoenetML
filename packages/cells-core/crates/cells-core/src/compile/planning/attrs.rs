//! Attributes and math, as planned: each prop's source from a literal, a
//! reference, or math text. Reading attribute text is `source.rs`'s, and
//! math text `maths.rs`'s.

use crate::compile::*;

impl<'a> Compiler<'a> {
    /// The prop sources of a type described by `PropFrom`: attributes,
    /// bindings, computed chains, children.
    pub(in crate::compile) fn plan_attrs(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
    ) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        // Without an attribute a prop is the type's default, or under
        // `extend` the referent's prop.
        let default = |v: f64| {
            if extend.is_some() {
                Source::Inherit
            } else {
                Source::Given(v)
            }
        };
        let mut props: Vec<Option<Source>> = vec![None; component_type.prop_defs().len()];
        for (pi, def) in component_type.prop_defs().iter().enumerate() {
            let _p = crate::trace::tally(match def.from {
                PropFrom::Attribute => "attribute",
                PropFrom::AttributeOr { .. } => "attribute or",
                PropFrom::Computed { .. } => "computed",
                PropFrom::Children => "children",
                PropFrom::ByPlanner => "by planner",
            });
            let bound = match def.bind.and_then(|b| d.attr(el, b)) {
                Some(a) => {
                    let bind = def.bind.unwrap();
                    let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                        attr: bind.into(),
                        text: self.attr_text(a).unwrap_or_default(),
                    })?;
                    Some(Source::reference(self.plan_ref(t, scope, m)?))
                }
                None => None,
            };
            let source = match (bound, def.from) {
                (Some(p), _) => p,
                (None, PropFrom::Attribute) => match d.attr(el, def.attr_name()) {
                    Some(a) => self.plan_value(
                        t,
                        scope,
                        def.attr_name(),
                        d.attr_children(a),
                        def.ref_prop,
                    )?,
                    None => default(def.default),
                },
                (None, PropFrom::AttributeOr { alias }) => match d.attr(el, def.attr_name()) {
                    Some(a) => {
                        self.plan_value(t, scope, def.attr_name(), d.attr_children(a), None)?
                    }
                    None => Source::own(alias as usize),
                },
                (None, PropFrom::Computed { op, args }) => Source::from_def(op, &args),
                (None, PropFrom::Children) => {
                    // A `<label>` child is presentation, not the value.
                    let content: Vec<NodeId> = d
                        .children(el)
                        .iter()
                        .copied()
                        .filter(|&n| !self.is_presentation_child(n))
                        .collect();
                    let blank = content.iter().all(|&n| self.is_blank(n));
                    // A mathInput's `prefill` stands in for blank children.
                    let from_attr = def.attr.and_then(|a| d.attr(el, a));
                    if blank {
                        match from_attr {
                            Some(a) => match self.try_value(t, scope, d.attr_children(a), None)? {
                                Some(p) => p,
                                None => {
                                    Source::Math(self.plan_math(t, scope, d.attr_children(a))?)
                                }
                            },
                            None => default(def.default),
                        }
                    } else {
                        match self.try_value(t, scope, &content, None)? {
                            // A literal child (`<number>3</number>`, an input's
                            // initial state) is a value slot: the classing
                            // (ADR 0018) makes it essential when an input or an
                            // action can reach it, a constant otherwise.
                            Some(p) => p,
                            // Not a single literal or reference: math text.
                            None => Source::Math(self.plan_math(t, scope, &content)?),
                        }
                    }
                }
                // Set below, by the type's `PropsThen` planner or
                // `Deferred::mark`.
                (None, PropFrom::ByPlanner)
                    if matches!(
                        component_type,
                        ComponentType::Document
                            | ComponentType::Section
                            | ComponentType::MathInput
                            | ComponentType::ChoiceInput
                            | ComponentType::FunctionIterates
                            | ComponentType::SelectFromSequence
                    ) =>
                {
                    Source::absent()
                }
                (None, PropFrom::ByPlanner) => unreachable!("`Plan` types take plan_with_extend"),
            };
            props[pi] = Some(source);
        }
        if let Planner::PropsThen(then) = Self::planner(component_type) {
            let _s = crate::trace::tally("props then");
            then(&mut PlanCtx::new(self, t, e, None), &mut props)?;
        }
        let _s = crate::trace::tally("mark");
        let mut props: Vec<Source> = props.into_iter().map(|p| p.unwrap()).collect();
        Deferred::mark(component_type, &mut props);
        self.tables[t.index()].plans[e.index()].props = props;
        Ok(())
    }

    /// The canonical string id of `text`: the DAST's if it has one (its
    /// table is deduplicated), else from `extra_strings`, appended after
    /// the DAST's in every build. Two text cells holding equal text hold
    /// equal ids, so text equality is `Eq` on ids (`plan_text_condition`).
    pub(in crate::compile) fn intern_literal(&mut self, text: &str) -> StrId {
        let d = self.dast;
        let ids = self.string_ids.get_or_insert_with(|| {
            let mut ids = HashMap::new();
            for i in StrId::below(d.strings.len()).rev() {
                ids.insert(d.strings.get(i).to_string(), i);
            }
            ids
        });
        if let Some(&id) = ids.get(text) {
            return id;
        }
        let id = StrId::from_index(d.strings.len() + self.compiled.extra_strings.len());
        self.compiled.extra_strings.push(text.to_string());
        ids.insert(text.to_string(), id);
        id
    }

    /// Whether `m` is a reference to a text value: `$t`, `$ti`, `$t.value`
    /// on a `<text>` or `<textInput>`. Decided from the referent's type at
    /// plan time, so a text cell never reaches a numeric comparison. The
    /// type is read first: only a text referent's path is spelled out.
    pub(in crate::compile) fn macro_is_text(
        &self,
        t: TemplateId,
        scope: ElemId,
        m: NodeId,
    ) -> bool {
        let d = self.dast;
        let names = d.macro_path(m);
        if names.len() > 2 {
            return false;
        }
        let Ok(Some((hops, e))) = self.lookup(t, scope, names[0]) else {
            return false;
        };
        let cur_t = self.template_up(t, hops);
        is_text_type(self.outlined(cur_t).elems[e.index()].component_type)
            && names
                .get(1)
                .is_none_or(|&p| d.strings.get(p).trim() == "value")
    }

    /// Whether planned ref `p`, planned from template `t`, reads a text
    /// value: `macro_is_text` from the plan, with no second lookup.
    pub(in crate::compile) fn ref_is_text(&self, t: TemplateId, p: RefId) -> bool {
        let r = &self.compiled.refs[p.index()];
        let [Step::Elem(e)] = r.steps.as_slice() else {
            return false;
        };
        let cur_t = self.template_up(t, r.hops);
        is_text_type(self.outlined(cur_t).elems[e.index()].component_type)
            && r.prop.is_none_or(|p| p.is("value"))
    }

    /// A literal number or a single reference; else `BadValue`.
    pub(in crate::compile) fn plan_value(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        attr: &str,
        nodes: &[NodeId],
        ref_prop: Option<&'static str>,
    ) -> Result<Source> {
        match self.try_value(t, scope, nodes, ref_prop)? {
            Some(source) => Ok(source),
            None => Err(Error::BadValue {
                attr: attr.into(),
                text: self.value_text(nodes).trim().into(),
            }),
        }
    }

    /// `plan_value`, with `None` for what is not a single literal or
    /// reference (math text, most often): reading the nodes builds no
    /// string, so a caller that goes on to plan math pays for none.
    pub(in crate::compile) fn try_value(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
        ref_prop: Option<&'static str>,
    ) -> Result<Option<Source>> {
        let _s = crate::trace::tally("plan value");
        let d = self.dast;
        let (mut macros, mut macro_node) = (0, NodeId::NONE);
        let (mut texts, mut text) = (0, "");
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Macro => {
                    macros += 1;
                    macro_node = n;
                }
                NodeKind::Text => {
                    let s = d.str(n).trim();
                    if !s.is_empty() {
                        texts += 1;
                        text = s;
                    }
                }
                _ => {}
            }
        }
        match (macros, texts) {
            (1, 0) => {
                let p = self.plan_ref(t, scope, macro_node)?;
                if let (None, Some(rp)) = (&self.compiled.refs[p.index()].prop, ref_prop) {
                    self.compiled.refs[p.index()].prop = Some(self.prop_named(t, p, rp));
                }
                Ok(Some(Source::reference(p)))
            }
            (0, 1) => Ok(literal_value(text)),
            // Text in several nodes reads as one (the parser seldom splits it).
            (0, _) if texts > 1 => Ok(literal_value(self.value_text(nodes).trim())),
            _ => Ok(None),
        }
    }

    /// The text among `nodes`, as one string: for an error, or the rare
    /// value split across text nodes.
    fn value_text(&self, nodes: &[NodeId]) -> String {
        let d = self.dast;
        nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect()
    }

    /// Math text and `$ref` children to an expression template whose cell
    /// leaves are plan ids.
    pub(in crate::compile) fn plan_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let _s = crate::trace::tally("plan math");
        let (toks, src) = self.math_tokens(t, scope, nodes)?;
        self.parse_tokens(&toks, src)
    }

    /// Math text and `$ref` children to an expression template, recording
    /// the text for the symbolic engine in case the math turns out symbolic.
    pub(in crate::compile) fn plan_sym_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let mt = self.math_text(nodes)?;
        self.parse_math_text(t, scope, &mt)
    }

    /// The source for one scalar attribute value: literal, reference, or math.
    pub(in crate::compile) fn plan_scalar(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<Source> {
        match self.try_value(t, scope, nodes, None)? {
            Some(p) => Ok(p),
            None => {
                let id = self.plan_math(t, scope, nodes)?;
                Ok(self.plan_from_expr(id))
            }
        }
    }

    /// A source from an expression template: a constant is an essential
    /// literal, a lone reference an alias, anything else a lowered math.
    pub(in crate::compile) fn plan_from_expr(&mut self, id: ExprId) -> Source {
        match self.compiled.arena.get(id) {
            Expr::Num(v) => Source::Given(*v),
            Expr::Cell(p) => Source::reference(*p),
            _ => Source::Math(id),
        }
    }

    /// `(a, b)`: two scalar sources from tuple text, with `$ref` leaves.
    pub(in crate::compile) fn plan_tuple(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<[Source; 2]> {
        let d = self.dast;
        let macros: Vec<NodeId> = nodes
            .iter()
            .copied()
            .filter(|&n| d.kind(n) == NodeKind::Macro)
            .collect();
        let text_blank = nodes
            .iter()
            .all(|&n| d.kind(n) != NodeKind::Text || d.str(n).trim().is_empty());
        if macros.len() == 1 && text_blank {
            // `<point>$q</point>`: alias the referent's coordinates.
            let p = self.plan_ref(t, scope, macros[0])?;
            return Ok([Source::coord(p, 0), Source::coord(p, 1)]);
        }
        let (toks, src) = self.math_tokens(t, scope, nodes)?;
        let entries = super::expr::tuple_entries(&toks).ok_or_else(|| Error::BadMath {
            text: src.text(self.dast),
            reason: "expected a tuple like (x, y)".into(),
        })?;
        self.point_from_entries(&entries, src)
    }

    /// The entries of `(a, b)` (`tuple_entries`), as two scalar sources.
    pub(in crate::compile) fn point_from_entries(
        &mut self,
        parts: &[Vec<Token>],
        src: MathSrc<'_>,
    ) -> Result<[Source; 2]> {
        let [x, y] = parts else {
            return Err(Error::BadMath {
                text: src.text(self.dast),
                reason: format!("expected 2 coordinates, got {}", parts.len()),
            });
        };
        let (x, y) = (self.parse_tokens(x, src)?, self.parse_tokens(y, src)?);
        Ok([self.plan_from_expr(x), self.plan_from_expr(y)])
    }

    /// A point-valued attribute: a reference (`center="$p"`) or a tuple.
    pub(in crate::compile) fn plan_point_attr(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        a: u32,
    ) -> Result<GivenPoint> {
        match self.single_macro(a) {
            Some(m) => Ok(GivenPoint::Ref(self.plan_ref(t, scope, m)?)),
            None => Ok(GivenPoint::Tuple(self.plan_tuple(
                t,
                scope,
                self.dast.attr_children(a),
            )?)),
        }
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

    /// Replace cell leaves that name a `<math>` element of this template
    /// with that math's own expression when it has free symbols: the
    /// expression parsed when parsing, which its planner plans from too, not its
    /// plan (ADR 0029).
    pub(in crate::compile) fn inline_symbolic_maths(
        &mut self,
        t: TemplateId,
        id: ExprId,
    ) -> ExprId {
        self.inline_maths(t, id, &mut Vec::new())
    }

    /// `inline_symbolic_maths`, with the maths being inlined around `id`:
    /// one reached again (two maths naming each other) is left a cell.
    fn inline_maths(&mut self, t: TemplateId, id: ExprId, inlining: &mut Vec<ElemId>) -> ExprId {
        let e = self.compiled.arena.get(id).clone();
        match e {
            Expr::Cell(p) => {
                let plan = &self.compiled.refs[p.index()];
                let is_value = plan.prop.is_none_or(|pr| pr.is("value"));
                let Some(target) = (is_value).then(|| self.plan_elem_target(t, p)).flatten() else {
                    return id;
                };
                // Every `<math>` is parsed before planning; one that did not parse is
                // left a cell, its error its own.
                let Some(Ok(ParsedMath::Expr(inner))) = self.parsed().math(t, target) else {
                    return id;
                };
                let inner = *inner;
                if inlining.contains(&target) {
                    return id;
                }
                let mut syms = Vec::new();
                self.compiled.arena.symbols(inner, &mut syms);
                if syms.is_empty() {
                    return id;
                }
                inlining.push(target);
                let inlined = self.inline_maths(t, inner, inlining);
                inlining.pop();
                inlined
            }
            Expr::Num(_) | Expr::Sym(_) => id,
            Expr::Neg(a) => {
                let a = self.inline_maths(t, a, inlining);
                self.compiled.arena.push(Expr::Neg(a))
            }
            Expr::Call(f, args) => {
                let args = args
                    .into_iter()
                    .map(|a| self.inline_maths(t, a, inlining))
                    .collect();
                self.compiled.arena.push(Expr::Call(f, args))
            }
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                let (na, nb) = (
                    self.inline_maths(t, a, inlining),
                    self.inline_maths(t, b, inlining),
                );
                self.compiled.arena.push(e.with_operands(na, nb))
            }
        }
    }
}

/// The copy rules of `plan_attrs` (ADR 0016, Migration step 8), against
/// `<testValue>`: under `extend`, a prop without its attribute is its
/// referent's, and one with it is the copy's own.
/// A literal value: `true`, `false` or a number.
fn literal_value(text: &str) -> Option<Source> {
    match text {
        "true" => Some(Source::Given(1.0)),
        "false" => Some(Source::Given(0.0)),
        _ => text.parse::<f64>().ok().map(Source::Given),
    }
}

/// The types whose value is text (a string id), not a number.
fn is_text_type(component_type: ComponentType) -> bool {
    matches!(
        component_type,
        ComponentType::Text | ComponentType::TextInput
    )
}

#[cfg(test)]
mod tests {
    use crate::testing::dast::{document, el, load, mac};
    use crate::testing::{prop_value as value, request_prop as request};

    #[test]
    fn a_bare_copy_is_its_referent() {
        let mut doc = load(document([
            el("testValue").name("v").attr("value", "3"),
            el("testValue").name("w").attr("extend", mac("v")),
        ]))
        .unwrap();
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        assert_eq!(
            (value(&doc, "w.value"), value(&doc, "w.double")),
            (3.0, 6.0)
        );
        assert!(request(&mut doc, "w.value", 4.0).dropped.is_empty());
        assert_eq!(value(&doc, "v.value"), 4.0);
        request(&mut doc, "v.value", 1.0);
        assert_eq!(
            (value(&doc, "w.value"), value(&doc, "w.double")),
            (1.0, 2.0)
        );
    }

    #[test]
    fn an_own_attribute_is_the_copys() {
        let mut doc = load(document([
            el("testValue").name("v").attr("value", "3"),
            el("testValue")
                .name("w")
                .attr("extend", mac("v"))
                .attr("value", "5"),
        ]))
        .unwrap();
        assert_eq!(
            (value(&doc, "w.value"), value(&doc, "w.double")),
            (5.0, 10.0)
        );
        request(&mut doc, "w.value", 6.0);
        assert_eq!((value(&doc, "w.value"), value(&doc, "v.value")), (6.0, 3.0));
        request(&mut doc, "v.value", 2.0);
        assert_eq!((value(&doc, "w.value"), value(&doc, "v.value")), (6.0, 2.0));
    }

    #[test]
    fn a_defaulted_referent_is_shared() {
        let mut doc = load(document([
            el("testValue").name("v"),
            el("testValue").name("w").attr("extend", mac("v")),
        ]))
        .unwrap();
        assert_eq!(value(&doc, "w.value"), 0.0);
        request(&mut doc, "w.value", 7.0);
        assert_eq!(value(&doc, "v.value"), 7.0);
    }
}

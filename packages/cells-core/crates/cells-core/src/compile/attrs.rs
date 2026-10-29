//! Attributes and math: each prop's source from a literal, a reference,
//! or math text, and the helpers that read attribute text.

use super::*;

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
        } = self.compiled.templates[t.index()].elems[e.index()];
        // Without an attribute a prop is the type's default, or under
        // `extend` the referent's prop.
        let default = |v: f64| {
            if extend.is_some() {
                Source::Inherit
            } else {
                Source::Literal(v)
            }
        };
        let mut props: Vec<Option<Source>> = vec![None; component_type.prop_defs().len()];
        for (pi, def) in component_type.prop_defs().iter().enumerate() {
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
                            Some(a) => {
                                match self.plan_value(
                                    t,
                                    scope,
                                    def.attr_name(),
                                    d.attr_children(a),
                                    None,
                                ) {
                                    Ok(p) => p,
                                    Err(Error::BadValue { .. }) => Source::Math(self.plan_math(
                                        t,
                                        scope,
                                        d.attr_children(a),
                                    )?),
                                    Err(e) => return Err(e),
                                }
                            }
                            None => default(def.default),
                        }
                    } else {
                        match self.plan_value(t, scope, def.name, &content, None) {
                            // A literal child (`<number>3</number>`, an input's
                            // initial state) is a value slot: the classing
                            // (ADR 0018) makes it essential when an input or an
                            // action can reach it, a fixed cell otherwise.
                            Ok(p) => p,
                            // Not a single literal or reference: math text.
                            Err(Error::BadValue { .. }) => {
                                Source::Math(self.plan_math(t, scope, &content)?)
                            }
                            Err(e) => return Err(e),
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
            then(&mut PlanCtx::new(self, t, e, None), &mut props)?;
        }
        let mut props: Vec<Source> = props.into_iter().map(|p| p.unwrap()).collect();
        Deferred::mark(component_type, &mut props);
        self.compiled.templates[t.index()].elems[e.index()].props = props;
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
    /// plan time, so a text cell never reaches a numeric comparison.
    pub(in crate::compile) fn macro_is_text(
        &self,
        t: TemplateId,
        scope: ElemId,
        m: NodeId,
    ) -> bool {
        let d = self.dast;
        let names = d.macro_path(m);
        let parts = names.len();
        if parts > 2 || parts == 2 && d.strings.get(names[1]).trim() != "value" {
            return false;
        }
        let Ok(Some((hops, e))) = self.lookup(t, scope, d.strings.get(names[0])) else {
            return false;
        };
        let cur_t = self.template_up(t, hops);
        matches!(
            self.compiled.templates[cur_t.index()].elems[e.index()].component_type,
            ComponentType::Text | ComponentType::TextInput
        )
    }

    /// An on/off attribute that may also take a value: present and not
    /// `false` or `none` (`simplify`, `simplify="full"`).
    pub(in crate::compile) fn attr_on(&self, el: NodeId, name: &str) -> bool {
        match self.dast.attr(el, name) {
            None => false,
            Some(a) => {
                let text = self.attr_text(a).unwrap_or_default();
                !matches!(text.trim().to_ascii_lowercase().as_str(), "false" | "none")
            }
        }
    }

    /// A literal number or a single reference.
    pub(in crate::compile) fn plan_value(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        attr: &str,
        nodes: &[NodeId],
        ref_prop: Option<&str>,
    ) -> Result<Source> {
        let d = self.dast;
        let macros: Vec<NodeId> = nodes
            .iter()
            .copied()
            .filter(|&n| d.kind(n) == NodeKind::Macro)
            .collect();
        let text: String = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect();
        let text = text.trim();
        match (macros.len(), text.is_empty()) {
            (1, true) => {
                let p = self.plan_ref(t, scope, macros[0])?;
                if let (None, Some(rp)) = (&self.compiled.refs[p.index()].prop, ref_prop) {
                    self.compiled.refs[p.index()].prop = Some(rp.to_string());
                }
                Ok(Source::reference(p))
            }
            (0, false) => match text {
                "true" => Ok(Source::Literal(1.0)),
                "false" => Ok(Source::Literal(0.0)),
                _ => text
                    .parse::<f64>()
                    .map(Source::Literal)
                    .map_err(|_| Error::BadValue {
                        attr: attr.into(),
                        text: text.into(),
                    }),
            },
            _ => Err(Error::BadValue {
                attr: attr.into(),
                text: text.into(),
            }),
        }
    }

    /// Math text and `$ref` children to an expression template whose cell
    /// leaves are plan ids.
    pub(in crate::compile) fn plan_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let (toks, text) = self.math_tokens(t, scope, nodes)?;
        self.parse_tokens(&toks, &text)
    }

    /// Parse math tokens into the arena; `text` is for the error.
    pub(in crate::compile) fn parse_tokens(
        &mut self,
        toks: &[Token],
        text: &str,
    ) -> Result<ExprId> {
        Parser::parse(toks, &mut self.compiled.arena).map_err(|reason| Error::BadMath {
            text: text.to_string(),
            reason,
        })
    }

    /// Math text and `$ref` children to an expression template, recording
    /// the text for the symbolic engine in case the math turns out symbolic.
    pub(in crate::compile) fn plan_sym_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let (toks, text, sym) = self.math_tokens_sym(t, scope, nodes)?;
        let id = self.parse_tokens(&toks, &text)?;
        self.compiled.sym_text.insert(id, sym);
        Ok(id)
    }

    /// Tokenize math text with `$ref` children as cell leaves holding plan ids.
    pub(in crate::compile) fn math_tokens(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<(Vec<Token>, String)> {
        let (toks, text, _) = self.math_tokens_sym(t, scope, nodes)?;
        Ok((toks, text))
    }

    /// `math_tokens`, plus the text with each `$ref` written `cellN<plan>`,
    /// the engine's own spelling of a numeric cell leaf.
    fn math_tokens_sym(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<(Vec<Token>, String, String)> {
        let d = self.dast;
        let mut toks: Vec<Token> = Vec::new();
        let mut text = String::new();
        let mut sym = String::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => {
                    text.push_str(d.str(n));
                    sym.push_str(d.str(n));
                    super::expr::tokenize(d.str(n), &mut toks).map_err(|reason| {
                        Error::BadMath {
                            text: text.clone(),
                            reason,
                        }
                    })?;
                }
                NodeKind::Element if matches!(d.str(n), "conditionalContent" | "select") => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside math: each branch would have to yield the same type",
                        d.str(n)
                    )));
                }
                NodeKind::Macro => {
                    text.push('$');
                    text.push_str(&d.macro_display(n));
                    // A text cell holds a string id, which is not a number.
                    if self.macro_is_text(t, scope, n) {
                        return Err(Error::Unsupported(format!(
                            "a text value (${}) inside math",
                            d.macro_display(n)
                        )));
                    }
                    let p = self.plan_ref(t, scope, n)?;
                    // Spaces keep `2$a` from reading as one token.
                    sym.push_str(&format!(
                        " {} ",
                        crate::sym::engine::leaf_name(p.get(), false)
                    ));
                    toks.push(Token::Cell(p));
                }
                _ => {}
            }
        }
        Ok((toks, text.trim().to_string(), sym))
    }

    /// A boolean attribute: present and empty, or `true`.
    pub(in crate::compile) fn attr_flag(&self, el: NodeId, name: &str) -> bool {
        match self.dast.attr(el, name) {
            None => false,
            Some(a) => {
                let text = self.attr_text(a).unwrap_or_default();
                let text = text.trim();
                text.is_empty() || text.eq_ignore_ascii_case("true")
            }
        }
    }

    /// The source for one scalar attribute value: literal, reference, or math.
    pub(in crate::compile) fn plan_scalar(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        attr: &str,
        nodes: &[NodeId],
    ) -> Result<Source> {
        match self.plan_value(t, scope, attr, nodes, None) {
            Ok(p) => Ok(p),
            Err(Error::BadValue { .. }) => {
                let id = self.plan_math(t, scope, nodes)?;
                Ok(self.plan_from_expr(id))
            }
            Err(e) => Err(e),
        }
    }

    /// A source from an expression template: a constant is an essential
    /// literal, a lone reference an alias, anything else a lowered math.
    pub(in crate::compile) fn plan_from_expr(&mut self, id: ExprId) -> Source {
        match self.compiled.arena.get(id) {
            Expr::Num(v) => Source::Literal(*v),
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
        let (toks, text) = self.math_tokens(t, scope, nodes)?;
        let inner = super::expr::unwrap_parens(&toks).ok_or_else(|| Error::BadMath {
            text: text.clone(),
            reason: "expected a tuple like (x, y)".into(),
        })?;
        self.tuple_from_tokens(inner, &text)
    }

    /// The inside of `(a, b)`, as two scalar sources.
    pub(in crate::compile) fn tuple_from_tokens(
        &mut self,
        inner: &[Token],
        text: &str,
    ) -> Result<[Source; 2]> {
        let parts = super::expr::split_top(inner, &Token::Comma);
        let [x, y] = parts.as_slice() else {
            return Err(Error::BadMath {
                text: text.to_string(),
                reason: format!("expected 2 coordinates, got {}", parts.len()),
            });
        };
        let (x, y) = (self.parse_tokens(x, text)?, self.parse_tokens(y, text)?);
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

    pub(in crate::compile) fn attr_text(&self, a: u32) -> Option<String> {
        let d = self.dast;
        let mut s = String::new();
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Text => s.push_str(d.str(n)),
                NodeKind::Macro => return None,
                _ => {}
            }
        }
        Some(s)
    }

    pub(in crate::compile) fn single_macro(&self, a: u32) -> Option<NodeId> {
        let d = self.dast;
        let mut found = None;
        for &n in d.attr_children(a) {
            match d.kind(n) {
                NodeKind::Macro if found.is_none() => found = Some(n),
                NodeKind::Macro => return None,
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                NodeKind::Text => return None,
                _ => {}
            }
        }
        found
    }

    pub(in crate::compile) fn is_blank(&self, n: NodeId) -> bool {
        match self.dast.kind(n) {
            NodeKind::Text => self.dast.str(n).trim().is_empty(),
            NodeKind::Other => true,
            _ => false,
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
    /// with that math's own expression when it has free symbols.
    pub(in crate::compile) fn inline_symbolic_maths(
        &mut self,
        t: TemplateId,
        id: ExprId,
    ) -> ExprId {
        let e = self.compiled.arena.get(id).clone();
        match e {
            Expr::Cell(p) => {
                let plan = &self.compiled.refs[p.index()];
                let is_value = plan.prop.as_deref().is_none_or(|pr| pr == "value");
                let Some(target) = (is_value).then(|| self.plan_elem_target(t, p)).flatten() else {
                    return id;
                };
                // The math may come later in the document and not be planned yet.
                if self.compiled.templates[t.index()].elems[target.index()].component_type
                    == ComponentType::Math
                    && self.compiled.templates[t.index()].elems[target.index()]
                        .props
                        .is_empty()
                    && self.plan_elem(t, target).is_err()
                {
                    return id;
                }
                match self.compiled.templates[t.index()].elems[target.index()]
                    .planned(prop::math::EXPR)
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

/// The copy rules of `plan_attrs` (ADR 0016, Migration step 8), against
/// `<testValue>`: under `extend`, a prop without its attribute is its
/// referent's, and one with it is the copy's own.
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

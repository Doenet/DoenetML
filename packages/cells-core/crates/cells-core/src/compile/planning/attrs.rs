//! Attributes, as planned: each prop's source from the element's record,
//! and the `<math>`s a plan inlines.

use crate::compile::*;

impl<'a> Compiler<'a> {
    /// The prop sources of a type described by `PropFrom`: attributes,
    /// bindings, computed chains, children. A `by_planner` prop is refused:
    /// a type with one is planned by a function.
    pub(in crate::compile) fn plan_attrs(
        &mut self,
        parsed: &Parsed,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
    ) -> Result<()> {
        self.plan_table(parsed, t, e, extend, false)
    }

    /// `plan_attrs` for machinery that plans the `by_planner` props itself
    /// after the table: they are left absent.
    pub(in crate::compile) fn plan_table(
        &mut self,
        parsed: &Parsed,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
        by_machinery: bool,
    ) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            ..
        } = self.outlined(t).elems[e.index()];
        // Without an attribute a prop is the type's default, or under
        // `extend` the referent's port of the same position (ADR 0032).
        let default = |v: f64, pi: usize| match extend {
            Some(p) => Source::port_of(p, pi),
            None => Source::given(v),
        };
        let mut props = TableProps::of(component_type);
        // The element's own children, as its type reads them (ADR 0034):
        // what a `PropFrom::Children` prop is planned from.
        let children = if component_type.def().children.kind == ChildrenKind::Value {
            parsed.record(t, e)?.child_value()
        } else {
            ValueChildren::blank()
        };
        for (pi, def) in component_type.prop_defs().iter().enumerate() {
            let _p = crate::trace::tally(match def.from {
                PropFrom::Attribute => "attribute",
                PropFrom::AttributeOr { .. } => "attribute or",
                PropFrom::Computed { .. } => "computed",
                PropFrom::Children => "children",
                PropFrom::ByPlanner => "by planner",
                PropFrom::Aggregate(_) => "aggregate",
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
                    None => default(def.default, pi),
                },
                (None, PropFrom::AttributeOr { alias }) => match d.attr(el, def.attr_name()) {
                    Some(a) => {
                        self.plan_value(t, scope, def.attr_name(), d.attr_children(a), None)?
                    }
                    None => Source::own(Port::table(alias as usize)),
                },
                (None, PropFrom::Computed { op, args }) => Source::from_def(op, &args),
                (None, PropFrom::Children) => match &children.value {
                    // A mathInput's `prefill` stands in for blank children.
                    ChildValue::Blank => match def.attr.and_then(|a| d.attr(el, a)) {
                        Some(a) => match self.try_value(t, scope, d.attr_children(a), None)? {
                            Some(p) => p,
                            None => Source::math(self.plan_math(t, scope, d.attr_children(a))?),
                        },
                        None => default(def.default, pi),
                    },
                    _ => self.plan_value_children(t, scope, &children)?,
                },
                // Wired by the build from the tree (ADR 0032, decision 4).
                (None, PropFrom::Aggregate(a)) => Source::aggregate(a),
                // A table says what every prop is; only a function
                // plans a `by_planner` prop, or machinery (`by_machinery`).
                (None, PropFrom::ByPlanner) if by_machinery => Source::absent(),
                (None, PropFrom::ByPlanner) => {
                    return Err(Error::Internal(format!(
                        "<{}>'s `{}` is by_planner, and its type is planned from its table",
                        component_type.tag(),
                        def.name
                    )));
                }
            };
            props[Port::table(pi)] = Some(source);
        }
        self.tables[t.index()].plans[e.index()].props = props.finish();
        Ok(())
    }

    /// Children or an attribute read as a value (`ValueChildren`), not
    /// blank: a reference, a literal, or math text. A literal is a value
    /// slot.
    pub(in crate::compile) fn plan_value_children(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        v: &ValueChildren,
    ) -> Result<Source> {
        Ok(match &v.value {
            ChildValue::Reference(p) => Source::reference(*p),
            ChildValue::Text { text, .. } if values::literal_value(text.trim()).is_some() => {
                values::literal_value(text.trim()).expect("a literal")
            }
            // Not a single literal or reference: math text.
            _ => Source::math(self.plan_math(t, scope, &v.nodes)?),
        })
    }

    /// The canonical string id of `text`: the DAST's if it has one, else
    /// from `extra_strings`. Equal text has equal ids.
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

    /// Replace cell leaves that name a `<math>` element of this template
    /// with that math's own expression, as parsed, when it has free
    /// symbols.
    pub(in crate::compile) fn inline_symbolic_maths(
        &mut self,
        parsed: &Parsed,
        t: TemplateId,
        id: ExprId,
    ) -> ExprId {
        self.inline_maths(parsed, t, id, &mut Vec::new())
    }

    /// `inline_symbolic_maths`, with the maths being inlined around `id`:
    /// one reached again (two maths naming each other) is left a cell.
    fn inline_maths(
        &mut self,
        parsed: &Parsed,
        t: TemplateId,
        id: ExprId,
        inlining: &mut Vec<ElemId>,
    ) -> ExprId {
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
                let Some(Ok(ParsedMath::Expr(inner))) = parsed.math(t, target) else {
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
                let inlined = self.inline_maths(parsed, t, inner, inlining);
                inlining.pop();
                inlined
            }
            Expr::Num(_) | Expr::Sym(_) => id,
            Expr::Neg(a) => {
                let a = self.inline_maths(parsed, t, a, inlining);
                self.compiled.arena.push(Expr::Neg(a))
            }
            Expr::Call(f, args) => {
                let args = args
                    .into_iter()
                    .map(|a| self.inline_maths(parsed, t, a, inlining))
                    .collect();
                self.compiled.arena.push(Expr::Call(f, args))
            }
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                let (na, nb) = (
                    self.inline_maths(parsed, t, a, inlining),
                    self.inline_maths(parsed, t, b, inlining),
                );
                self.compiled.arena.push(e.with_operands(na, nb))
            }
        }
    }
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

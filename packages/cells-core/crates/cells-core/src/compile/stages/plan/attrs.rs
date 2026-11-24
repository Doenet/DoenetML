//! Attributes, as planned: each prop's source from the element's record,
//! and the `<math>`s a plan inlines.

use super::Planning;
use crate::compile::*;
use crate::components::ListPoints;

/// Planning, attributes: each prop's source from the element's record, and the
/// `<math>`s a plan inlines. Run by every planner; reads the record, never
/// another element's plan (ADR 0029).
impl<'a> Planning<'a> {
    /// The prop sources of a type described by [`PropFrom`]: attributes,
    /// bindings, computed chains, children. A `by_planner` prop is refused:
    /// a type with one is planned by a function.
    pub(super) fn plan_attrs(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
    ) -> Result<()> {
        self.plan_table(t, e, extend, false)
    }

    /// `plan_attrs` for machinery that plans the `by_planner` props itself
    /// after the table: they are left absent.
    pub(super) fn plan_table(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
        by_machinery: bool,
    ) -> Result<()> {
        let d = self.rd.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            ..
        } = *self.rd.own_row(t, e);
        // Without an attribute a prop is the type's default, or under
        // `extend` the referent's port of the same position (ADR 0032).
        let default = |v: f64, pi: usize| match extend {
            Some(p) => Source::port_of(p, pi),
            None => Source::given(v),
        };
        let mut props = TableProps::of(component_type);
        // Hidden ports after the table (`read_as_number`).
        let mut hidden = Vec::new();
        // The element's own children, as its type reads them (ADR 0034):
        // what a `PropFrom::Children` prop is planned from.
        let children = if component_type.def().children.kind == ChildrenKind::Value {
            self.parsed.record(t, e)?.child_value()
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
                PropFrom::Anchor { .. } => "anchor",
                PropFrom::ListLen => "list length",
                PropFrom::Display => "display",
            });
            let bound = match def.bind.and_then(|b| d.attr(el, b)) {
                Some(a) => {
                    // A bound prop ignores the attribute that would have
                    // given it a first value (`prefill`), as the current
                    // core does: read, so not refused (ADR 0021).
                    if let Some(first) = def.attr {
                        d.attr(el, first);
                    }
                    let bind = def.bind.unwrap();
                    let m = self.rd.single_macro(a).ok_or_else(|| Error::BadValue {
                        attr: bind.into(),
                        text: self.rd.attr_text(a).unwrap_or_default(),
                    })?;
                    Some(Source::reference(self.rd.plan_ref(
                        &mut self.ar,
                        t,
                        scope,
                        m,
                    )?))
                }
                None => None,
            };
            let source = match (bound, def.from) {
                (Some(p), _) => p,
                (None, PropFrom::Attribute) => match d.attr(el, def.attr_name()) {
                    Some(a) => self.rd.plan_value(
                        &mut self.ar,
                        t,
                        scope,
                        def.attr_name(),
                        d.attr_children(a),
                        def.ref_prop,
                    )?,
                    None => default(def.default, pi),
                },
                (None, PropFrom::AttributeOr { alias }) => match d.attr(el, def.attr_name()) {
                    Some(a) => self.rd.plan_value(
                        &mut self.ar,
                        t,
                        scope,
                        def.attr_name(),
                        d.attr_children(a),
                        None,
                    )?,
                    None => Source::own(Port::table(alias as usize)),
                },
                (None, PropFrom::Computed { op, args }) => Source::from_def(op, &args),
                (None, PropFrom::Children) => match &children.value {
                    // A mathInput's `prefill` stands in for blank children.
                    ChildValue::Blank => match def.attr.and_then(|a| d.attr(el, a)) {
                        Some(a) => match self.rd.try_value(
                            &mut self.ar,
                            t,
                            scope,
                            d.attr_children(a),
                            None,
                        )? {
                            Some(p) => p,
                            None => Source::math(self.rd.plan_math(
                                &mut self.ar,
                                t,
                                scope,
                                d.attr_children(a),
                            )?),
                        },
                        None => default(def.default, pi),
                    },
                    _ => {
                        let source = self.plan_value_children(t, e, scope, &children)?;
                        self.read_as_number(t, component_type, pi, source, &mut hidden)
                    }
                },
                // Wired by the build from the tree (ADR 0032, decision 4).
                (None, PropFrom::Aggregate(a)) => Source::aggregate(a),
                // Planned after the table, for every type (`plan_anchor`,
                // `plan_display`).
                (None, PropFrom::Anchor { .. } | PropFrom::Display) => Source::absent(),
                // A table's list is its own props' points.
                (None, PropFrom::ListLen) => match component_type.list().map(|l| &l.points) {
                    Some(ListPoints::Table(points)) => Source::constant(points.len() as f64),
                    _ => {
                        return Err(Error::Internal(format!(
                            "<{}>'s `{}` is the length of a list only a planner gives",
                            component_type.tag(),
                            def.name
                        )));
                    }
                },
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
        let mut props = props.finish();
        props.extend(hidden);
        self.tables[t.index()].plans[e.index()].props = props;
        Ok(())
    }

    /// `source`, planned for prop `pi` of an element of `component_type`,
    /// as that prop reads it: where the prop is the number the type shows
    /// (a `<number>`'s value) and `source` a reference to what may be a
    /// math cell (an entry inside a handle, `$mi[2]`, `$f.maxima[1][2]`; a
    /// math list's entry, `$ml[3]`), the number that cell holds, its
    /// expression evaluated ([`Flow::ValueOf`], picked by the type pass as
    /// an operator's value is, ADR 0043), through a hidden port pushed on
    /// `hidden` after the table; otherwise `source` itself. A reference the
    /// records show is a number, text, a boolean, a point or a list is
    /// read as it is.
    pub(super) fn read_as_number(
        &self,
        t: TemplateId,
        component_type: ComponentType,
        pi: usize,
        source: Source,
        hidden: &mut Vec<Source>,
    ) -> Source {
        use crate::components::TextKind;
        let shows_number = matches!(
            component_type.text_kind(),
            Some(TextKind::Number(v) | TextKind::Grouped(v)) if v == pi
        );
        let Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Whole))) = source else {
            return source;
        };
        let may_be_math = matches!(
            self.rd.ref_value_kind(&self.ar, t, p),
            None | Some(ValueKind::Math)
        );
        if !shows_number || !may_be_math {
            return source;
        }
        let held = Port::table(component_type.prop_defs().len() + hidden.len());
        hidden.push(source);
        Source::value_of(held, held)
    }

    /// Children or an attribute read as a value ([`ValueChildren`]), not
    /// blank: a reference, a literal, or math text. A literal is a value
    /// slot.
    pub(super) fn plan_value_children(
        &mut self,
        t: TemplateId,
        e: ElemId,
        scope: ElemId,
        v: &ValueChildren,
    ) -> Result<Source> {
        Ok(match &v.value {
            // A list of no entries is the missing value where one value is
            // read (ADR 0041, decision 5; ADR 0046); an entry past a list's
            // end reads it through the reference.
            ChildValue::Reference(p) => match self.splice(t, e, *p) {
                super::lists::Splice::Entries(0) => Source::constant(crate::program::MISSING),
                _ => Source::reference(*p),
            },
            ChildValue::Text { text, .. } if literal_value(text.trim()).is_some() => {
                literal_value(text.trim()).expect("a literal")
            }
            // Not a single literal or reference: math text.
            _ => Source::math(self.rd.plan_math(&mut self.ar, t, scope, &v.nodes)?),
        })
    }

    /// Replace cell leaves that name a `<math>` element of this template
    /// with that math's own expression, as parsed, when it has free
    /// symbols, for element `e`'s plan. The reference is then in no source
    /// of the plan, so each math inlined is a recorded read of `e`'s (ADR
    /// 0050, decision 2's third row): a math that is a box boxes `e`, the
    /// math its cause.
    pub(super) fn inline_symbolic_maths(
        &mut self,
        t: TemplateId,
        e: ElemId,
        id: ExprId,
    ) -> Result<ExprId> {
        self.inline_maths(t, e, id, &mut Vec::new())
    }

    /// `inline_symbolic_maths`, with the maths being inlined around `id`:
    /// one reached again (two maths naming each other) is left a cell.
    fn inline_maths(
        &mut self,
        t: TemplateId,
        e: ElemId,
        id: ExprId,
        inlining: &mut Vec<ElemId>,
    ) -> Result<ExprId> {
        let expr = self.ar.arena.get(id).clone();
        Ok(match expr {
            Expr::Cell(p) => {
                let plan = &self.ar.refs[p.index()];
                let is_value = plan.prop.is_none_or(|pr| pr.is("value"));
                let Some(target) = (is_value)
                    .then(|| self.rd.plan_elem_target(&self.ar, t, p))
                    .flatten()
                else {
                    return Ok(id);
                };
                // Every `<math>` is parsed before planning; one that did not parse is
                // left a cell, its error its own.
                let Some(Ok(ParsedMath::Expr(inner))) = self.parsed.math(t, target) else {
                    return Ok(id);
                };
                let inner = *inner;
                if inlining.contains(&target) {
                    return Ok(id);
                }
                let mut syms = Vec::new();
                self.ar.arena.symbols(inner, &mut syms);
                if syms.is_empty() {
                    return Ok(id);
                }
                // Its expression stands where the reference stood: the
                // read the plan no longer shows.
                self.rd.referent_type(
                    &self.ar,
                    self.boxes.visible(&self.tables),
                    &mut self.planned.reads,
                    t,
                    e,
                    p,
                )?;
                inlining.push(target);
                let inlined = self.inline_maths(t, e, inner, inlining);
                inlining.pop();
                inlined?
            }
            // An operator's text is its own: nothing inlines into it.
            Expr::Num(_) | Expr::Sym(_) | Expr::Operator(_) | Expr::Shape(_) => id,
            Expr::Neg(a) => {
                let a = self.inline_maths(t, e, a, inlining)?;
                self.ar.arena.push(Expr::Neg(a))
            }
            Expr::Call(f, args) => {
                let args = args
                    .into_iter()
                    .map(|a| self.inline_maths(t, e, a, inlining))
                    .collect::<Result<_>>()?;
                self.ar.arena.push(Expr::Call(f, args))
            }
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                let (na, nb) = (
                    self.inline_maths(t, e, a, inlining)?,
                    self.inline_maths(t, e, b, inlining)?,
                );
                self.ar.arena.push(expr.with_operands(na, nb))
            }
        })
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

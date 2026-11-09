//! [`PlanCtx`]: what every component planner is given.

use super::Planning;
use crate::compile::*;
use crate::components::ConstrainTarget;

/// What a planner is given: the element's record (its own attributes and
/// children merged over its `extend` referent's), the planning of what the
/// record holds, the port makers' facts, and `warn`; never the DAST, a
/// node, or `extend`. What comes from the referent is planned where the
/// referent sits; what the element writes itself, where the element sits.
/// No planner applies `fixed`.
pub(crate) struct PlanCtx<'c, 'a> {
    /// Planning's view: what the planner reaches, through the methods below.
    p: &'c mut Planning<'a>,
    t: TemplateId,
    e: ElemId,
    /// The element's record: its own, merged under its `extend` referent's
    /// for a copy with overrides.
    record: record::Record,
    /// The `extend` referent of a copy with overrides, in this template,
    /// whose math text in the record is planned where it sits.
    referent: Option<Base>,
}

/// The `extend` referent of a `Plan` type planned with overrides: an
/// element of the same template.
struct Base {
    /// Where its children are planned.
    scope: ElemId,
    /// Every node under it: what a planner reads from it rather than from
    /// the element.
    subtree: HashSet<NodeId>,
}

impl<'c, 'a> PlanCtx<'c, 'a> {
    pub(super) fn new(
        p: &'c mut Planning<'a>,
        t: TemplateId,
        e: ElemId,
        record: record::Record,
        referent: Option<ElemId>,
    ) -> Self {
        let referent = referent.map(|b| {
            let Elem {
                node, name_scope, ..
            } = *p.rd.elem(t, b);
            let d = p.rd.dast;
            let mut subtree = HashSet::new();
            let mut stack = vec![node];
            while let Some(n) = stack.pop() {
                if !subtree.insert(n) {
                    continue;
                }
                stack.extend(d.children(n).iter().copied());
                if d.kind(n) == NodeKind::Element {
                    for a in d.attrs(n) {
                        stack.extend(d.attr_children(a).iter().copied());
                    }
                }
            }
            Base {
                scope: name_scope,
                subtree,
            }
        });
        PlanCtx {
            p,
            t,
            e,
            record,
            referent,
        }
    }
}

impl<'a> PlanCtx<'_, 'a> {
    fn elem(&self) -> &Elem {
        self.p.rd.elem(self.t, self.e)
    }

    fn scope(&self) -> ElemId {
        self.elem().name_scope
    }

    /// Where nodes are planned: the referent's scope for nodes under the
    /// referent (its children), else the element's.
    fn scope_for(&self, nodes: &[NodeId]) -> ElemId {
        match (&self.referent, nodes.first()) {
            (Some(b), Some(n)) if b.subtree.contains(n) => b.scope,
            _ => self.scope(),
        }
    }

    /// The element's record: every attribute its type declares and its
    /// children as the type reads them, parsed, the element's own or its
    /// referent's.
    pub(crate) fn record(&self) -> &record::Record {
        &self.record
    }

    // The element.

    /// The element's node, for a diagnostic: no planner reads it.
    fn node(&self) -> NodeId {
        self.elem().node
    }

    /// The element's component type.
    pub(crate) fn component_type(&self) -> ComponentType {
        self.elem().component_type
    }

    /// The prop at `port` (`graph::Props::PORTS`) of the graph the
    /// element sits in directly, if it sits in one.
    pub(crate) fn enclosing_graph_prop(&self, port: Port) -> Option<Source> {
        let scope = self.scope();
        (scope != ROOT_SCOPE
            && self
                .p
                .rd
                .elem(self.t, scope)
                .component_type
                .graph_bounds()
                .is_some())
        .then_some(Source::alias(Arg::Elem(scope, port)))
    }

    // Planning.

    /// Math text in the record as a scalar: a literal, a reference or
    /// math (a test component's children).
    #[cfg_attr(not(test), allow(dead_code))]
    pub(crate) fn scalar_of(&mut self, nodes: &[NodeId]) -> Result<Source> {
        let scope = self.scope_for(nodes);
        self.p.rd.plan_scalar(&mut self.p.ar, self.t, scope, nodes)
    }

    /// Math text that is a pair, `(a, b)`, as its two coordinates.
    pub(crate) fn tuple(&mut self, nodes: &[NodeId]) -> Result<[Source; 2]> {
        let scope = self.scope_for(nodes);
        self.p.rd.plan_tuple(&mut self.p.ar, self.t, scope, nodes)
    }

    /// Children or an attribute read as a value, not blank: a reference,
    /// a literal, or math text, as a table prop of `children` is planned.
    pub(crate) fn value_of(&mut self, v: &ValueChildren) -> Result<Source> {
        let scope = self.scope_for(&v.nodes);
        self.p.plan_value_children(self.t, scope, v)
    }

    /// A reference to a prop of the element `p` names (`$l` -> `$l.x2`);
    /// an error when what it names has no such prop.
    pub(crate) fn with_prop(&mut self, p: RefId, prop: &'static str) -> Result<RefId> {
        self.p.rd.plan_with_prop(&mut self.p.ar, self.t, p, prop)
    }

    /// A prop of the element a reference names, as an operator's argument.
    pub(crate) fn reference_prop(&mut self, p: RefId, prop: &'static str) -> Result<Arg> {
        Ok(Arg::Ref(self.with_prop(p, prop)?, Sel::Whole))
    }

    /// The component type of the element a reference names, when it
    /// names one in this template (`$l`, not `$l.x` or `$r[2]`), as
    /// outlining settled it (a `<math>` may be a point).
    pub(crate) fn reference_type(&mut self, p: RefId) -> Result<Option<ComponentType>> {
        match self.p.rd.plan_elem_target(&self.p.ar, self.t, p) {
            Some(_) => self.p.rd.referent_type(
                &self.p.ar,
                self.p.boxes.visible(&self.p.tables),
                &mut self.p.planned.reads,
                self.t,
                self.e,
                p,
            ),
            None => Ok(None),
        }
    }

    /// How a point is constrained to what `p` names: its type's
    /// `constrain_target` declaration; an error when it names
    /// no component in this template or one of a type that is no target.
    pub(crate) fn constrain_target(&mut self, p: RefId) -> Result<ConstrainTarget> {
        let target = self.reference_type(p)?.ok_or_else(|| {
            Error::Unsupported("<constrainTo> must name a component in the same scope".into())
        })?;
        target
            .def()
            .constrain_target
            .ok_or_else(|| Error::Unsupported(format!("constrainTo a <{}>", target.tag())))
    }

    /// Math text as tokens, `$ref`s as cell leaves, and where its text came
    /// from, for an error.
    pub(crate) fn math_tokens<'n>(
        &mut self,
        nodes: &'n [NodeId],
    ) -> Result<(Vec<Token>, MathSrc<'n>)> {
        let scope = self.scope_for(nodes);
        self.p.rd.math_tokens(&mut self.p.ar, self.t, scope, nodes)
    }

    /// An expression as a source: lowered to numeric operators when it is
    /// numeric, else symbolic.
    pub(crate) fn plan_expr(&mut self, id: ExprId) -> Source {
        self.p.rd.plan_from_expr(&self.p.ar, id)
    }

    /// Math text tokenized, its `$ref`s not yet planned: to read its
    /// shape before parsing it once (`sym_math`).
    pub(crate) fn math_text(&self, nodes: &[NodeId]) -> Result<MathText> {
        self.p.rd.math_text(nodes)
    }

    /// Math text `mt` of `nodes` as an expression that may be symbolic,
    /// its text kept for the symbolic engine.
    pub(crate) fn sym_math(&mut self, nodes: &[NodeId], mt: &MathText) -> Result<ExprId> {
        let scope = self.scope_for(nodes);
        self.p.rd.parse_math_text(&mut self.p.ar, self.t, scope, mt)
    }

    /// An equation linear in `vx` and `vy`, `a vx + b vy + c = 0`, as sources
    /// of `[a, b, c]`; `None` when it is not linear in them (or symbolic).
    /// A referenced `<math>` carrying the variables is inlined first, so
    /// `$m = y` with `$m` standing for `2x` is linear. Math that is not
    /// one equation is an error.
    pub(crate) fn linear_equation(
        &mut self,
        nodes: &[NodeId],
        vx: &str,
        vy: &str,
    ) -> Result<Option<[Source; 3]>> {
        let t = self.t;
        let (toks, src) = self.math_tokens(nodes)?;
        let c = &mut *self.p;
        let sides = super::expr::split_top(&toks, &Token::Eq);
        if sides.len() != 2 {
            return Err(Error::BadMath {
                text: src.text(c.rd.dast),
                reason: "a line equation needs one '='".into(),
            });
        }
        let (lhs, rhs) = (
            c.rd.parse_tokens(&mut c.ar, &sides[0], src)?,
            c.rd.parse_tokens(&mut c.ar, &sides[1], src)?,
        );
        let diff = c.ar.arena.push(Expr::Sub(lhs, rhs));
        let diff = c.inline_symbolic_maths(t, diff);
        Ok(
            super::expr::linear_coeffs(&mut c.ar.arena, diff, vx, vy).map(|[a, b, k]| {
                [
                    c.rd.plan_from_expr(&c.ar, a),
                    c.rd.plan_from_expr(&c.ar, b),
                    c.rd.plan_from_expr(&c.ar, k),
                ]
            }),
        )
    }

    /// The canonical string id of `text`.
    pub(crate) fn intern(&mut self, text: &str) -> StrId {
        self.p.ar.intern_literal(self.p.rd.dast, text)
    }

    /// A condition over the element's content (comparisons and
    /// connectives, `=` compared under the element's compare attributes),
    /// in a hidden port of `wiring` holding 1 while it holds.
    pub(crate) fn condition(&mut self, nodes: &[NodeId], wiring: &mut ElemWiring) -> Result<Port> {
        let scope = self.scope_for(nodes);
        let compare = self.p.compare_attrs(&[self.node()]);
        self.p
            .plan_condition_content(self.t, scope, nodes, compare, wiring)
    }

    /// Warns that the element cannot be what its attributes ask, with a
    /// diagnostic code and message. What the planner cannot define is
    /// [`Wire::undefined`] of what this returns.
    pub(crate) fn warn(&mut self, code: &'static str, message: &str) -> Warned {
        let node = self.node();
        self.p.ar.warn(node, code, message)
    }

    // The element's wiring.

    /// The element's `<math>` text as it was parsed, or the
    /// error parsing it met.
    pub(crate) fn parsed_math(&self) -> Result<ParsedMath> {
        match self.p.parsed.math(self.t, self.e) {
            Some(parsed) => parsed.clone(),
            None => Err(Error::Internal("a <math> that was never parsed".into())),
        }
    }

    // Machinery several components build on.
}

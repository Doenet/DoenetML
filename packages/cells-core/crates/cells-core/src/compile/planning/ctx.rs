//! [`PlanCtx`]: what every planner in `components/` is given (ADR 0016).

use super::Planning;
use crate::compile::*;
use crate::components::ConstrainTarget;

/// What a planner is given (ADR 0016, ADR 0034): the element's record, the
/// attributes and children the compile parsed before planning (the
/// element's own merged over its `extend` referent's), the planning of
/// what the record holds (math text, a reference), the port makers'
/// facts, and `warn`; never the DAST, a node, or `extend`. What comes from
/// the referent is planned where the referent sits, so a `$n` in it keeps
/// the meaning it has there (ADR 0023); what the element writes itself is
/// planned where the element sits. `plan_with_extend` makes it and does
/// the rest: a bare copy and sharing state with the referent. No planner
/// applies `fixed`: `plan_elem` holds every element after its planner
/// (`compile/planning/fix.rs`). A test (`components/mod.rs`) counts its
/// methods, so that it grows deliberately.
pub(crate) struct PlanCtx<'c, 'a> {
    c: &'c mut Compiler<'a>,
    /// Planning's working set: what parsing made, what it records for
    /// linking.
    p: &'c mut Planning,
    t: TemplateId,
    e: ElemId,
    /// The element's record (ADR 0032, ADR 0034): its own, merged under
    /// its `extend` referent's for a copy with overrides.
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
    pub(in crate::compile) fn new(
        c: &'c mut Compiler<'a>,
        p: &'c mut Planning,
        t: TemplateId,
        e: ElemId,
        record: record::Record,
        referent: Option<ElemId>,
    ) -> Self {
        let referent = referent.map(|b| {
            let Elem {
                node, name_scope, ..
            } = *c.elem(t, b);
            let d = c.dast;
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
            c,
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
        self.c.elem(self.t, self.e)
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

    /// The element's record (ADR 0032, ADR 0034): every attribute its
    /// type declares and its children as the type reads them, parsed, the
    /// element's own or its referent's. A planner reads it as its type's
    /// `Attrs` (`Attrs::of(ctx.record())`).
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
        (scope != ROOT_SCOPE && self.c.elem(self.t, scope).component_type == ComponentType::Graph)
            .then_some(Source::alias(Arg::Elem(scope, port)))
    }

    // Planning.

    /// Math text in the record as a scalar: a literal, a reference or
    /// math (a test component's children).
    #[cfg_attr(not(test), allow(dead_code))]
    pub(crate) fn scalar_of(&mut self, nodes: &[NodeId]) -> Result<Source> {
        let scope = self.scope_for(nodes);
        self.c.plan_scalar(self.t, scope, nodes)
    }

    /// Math text that is a pair, `(a, b)`, as its two coordinates.
    pub(crate) fn tuple(&mut self, nodes: &[NodeId]) -> Result<[Source; 2]> {
        let scope = self.scope_for(nodes);
        self.c.plan_tuple(self.t, scope, nodes)
    }

    /// Children or an attribute read as a value, not blank: a reference,
    /// a literal, or math text, as a table prop of `children` is planned.
    pub(crate) fn value_of(&mut self, v: &ValueChildren) -> Result<Source> {
        let scope = self.scope_for(&v.nodes);
        self.c.plan_value_children(self.t, scope, v)
    }

    /// A reference to a prop of the element `p` names (`$l` -> `$l.x2`);
    /// an error when what it names has no such prop.
    pub(crate) fn with_prop(&mut self, p: RefId, prop: &'static str) -> Result<RefId> {
        self.c.plan_with_prop(self.t, p, prop)
    }

    /// A prop of the element a reference names, as an operator's argument.
    pub(crate) fn reference_prop(&mut self, p: RefId, prop: &'static str) -> Result<Arg> {
        Ok(Arg::Ref(self.with_prop(p, prop)?, Sel::Whole))
    }

    /// The component type of the element a reference names, when it
    /// names one in this template (`$l`, not `$l.x` or `$r[2]`), as
    /// outlining settled it (a `<math>` may be a point).
    pub(crate) fn reference_type(&mut self, p: RefId) -> Result<Option<ComponentType>> {
        match self.c.plan_elem_target(self.t, p) {
            Some(_) => self
                .c
                .referent_type(&mut self.p.planned.reads, self.t, self.e, p),
            None => Ok(None),
        }
    }

    /// How a point is constrained to what `p` names: its type's
    /// declaration (`constrain_target`, ADR 0034); an error when it names
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
        self.c.math_tokens(self.t, scope, nodes)
    }

    /// An expression as a source: lowered to numeric operators when it is
    /// numeric, else symbolic.
    pub(crate) fn plan_expr(&mut self, id: ExprId) -> Source {
        self.c.plan_from_expr(id)
    }

    /// Math text tokenized, its `$ref`s not yet planned: to read its
    /// shape before parsing it once (`sym_math`).
    pub(crate) fn math_text(&self, nodes: &[NodeId]) -> Result<MathText> {
        self.c.math_text(nodes)
    }

    /// Math text `mt` of `nodes` as an expression that may be symbolic,
    /// its text kept for the symbolic engine.
    pub(crate) fn sym_math(&mut self, nodes: &[NodeId], mt: &MathText) -> Result<ExprId> {
        let scope = self.scope_for(nodes);
        self.c.parse_math_text(self.t, scope, mt)
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
        let c = &mut *self.c;
        let sides = super::expr::split_top(&toks, &Token::Eq);
        if sides.len() != 2 {
            return Err(Error::BadMath {
                text: src.text(c.dast),
                reason: "a line equation needs one '='".into(),
            });
        }
        let (lhs, rhs) = (
            c.parse_tokens(&sides[0], src)?,
            c.parse_tokens(&sides[1], src)?,
        );
        let diff = c.compiled.arena.push(Expr::Sub(lhs, rhs));
        let diff = c.inline_symbolic_maths(&self.p.parsed, t, diff);
        Ok(
            super::expr::linear_coeffs(&mut c.compiled.arena, diff, vx, vy).map(|[a, b, k]| {
                [
                    c.plan_from_expr(a),
                    c.plan_from_expr(b),
                    c.plan_from_expr(k),
                ]
            }),
        )
    }

    /// The canonical string id of `text` (`Compiler::intern_literal`).
    pub(crate) fn intern(&mut self, text: &str) -> StrId {
        self.c.intern_literal(text)
    }

    /// A condition over the element's content (comparisons and
    /// connectives, `=` compared under the element's compare attributes),
    /// in a hidden port of `wiring` holding 1 while it holds.
    pub(crate) fn condition(&mut self, nodes: &[NodeId], wiring: &mut ElemWiring) -> Result<Port> {
        let scope = self.scope_for(nodes);
        let compare = self.c.compare_attrs(&[self.node()]);
        self.c
            .plan_condition_content(self.t, scope, nodes, compare, wiring)
    }

    /// Warns that the element cannot be what its attributes ask, with a
    /// code and message of `packages/i18n/src/diagnostics.ts` (ADR 0013).
    /// A planner warns rather than leave a NaN to explain itself: what it
    /// cannot define is `Wire::undefined` of what this returns.
    pub(crate) fn warn(&mut self, code: &'static str, message: &str) -> Warned {
        let node = self.node();
        self.c.warn(node, code, message)
    }

    // The element's wiring.

    /// The element's `<math>` text as it was parsed (ADR 0029), or the
    /// error parsing it met.
    pub(crate) fn parsed_math(&self) -> Result<ParsedMath> {
        match self.p.parsed.math(self.t, self.e) {
            Some(parsed) => parsed.clone(),
            None => Err(Error::Internal("a <math> that was never parsed".into())),
        }
    }

    // Machinery several components build on.
}

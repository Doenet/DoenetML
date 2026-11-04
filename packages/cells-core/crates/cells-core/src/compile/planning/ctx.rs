//! [`PlanCtx`]: what every planner in `components/` is given (ADR 0016).

use crate::compile::*;

/// What a planner is given (ADR 0016): its element and the source it reads
/// (the DAST, read-only), its attributes planned the ways every component
/// shares, the machinery several components build on, and the writes that
/// make the element's wiring. An attribute by name is the element's own or,
/// when the element omits it and is a `Plan` type extending another, its
/// `extend` referent's. What comes from the referent, an attribute or its
/// children, is planned where the referent sits, so a `$n` in it keeps the
/// meaning it has there (ADR 0023); what the element writes itself is
/// planned where the element sits. One context serves every kind of
/// planner; the kind decides what is done around the call. For a `Plan`
/// type, `plan_with_extend` makes it and does the rest: a bare copy and
/// sharing state with the referent. No planner applies `fixed`:
/// `plan_elem` holds every element after its planner (`compile/planning/fix.rs`).
pub(crate) struct PlanCtx<'c, 'a> {
    c: &'c mut Compiler<'a>,
    t: TemplateId,
    e: ElemId,
    /// The element's attribute record (ADR 0032): its own, merged under
    /// its `extend` referent's for a `Plan` type with overrides.
    record: record::Record,
    /// The `extend` referent of a `Plan` type planned with overrides, in
    /// this template, which supplies the children the element omits until
    /// children are declared (ADR 0032, decision 3).
    referent: Option<Base>,
}

/// The `extend` referent of a `Plan` type planned with overrides: an
/// element of the same template.
struct Base {
    node: NodeId,
    /// Where its children are planned.
    scope: ElemId,
    /// Every node under it: what a planner reads from it rather than from
    /// the element.
    subtree: HashSet<NodeId>,
}

impl<'c, 'a> PlanCtx<'c, 'a> {
    pub(in crate::compile) fn new(
        c: &'c mut Compiler<'a>,
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
                node,
                scope: name_scope,
                subtree,
            }
        });
        PlanCtx {
            c,
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

    fn base_node(&self) -> Option<NodeId> {
        self.referent.as_ref().map(|b| b.node)
    }

    /// The element's attribute record (ADR 0032): every attribute its
    /// type declares, parsed, the element's own or its referent's. A
    /// planner reads it as its type's `Attrs` (`Attrs::of(ctx.record())`).
    pub(crate) fn record(&self) -> &record::Record {
        &self.record
    }

    // The element and its source.

    /// The source, read-only.
    pub(crate) fn dast(&self) -> &'a Dast {
        self.c.dast
    }

    /// The element's node.
    pub(crate) fn node(&self) -> NodeId {
        self.elem().node
    }

    /// The element's component type.
    pub(crate) fn component_type(&self) -> ComponentType {
        self.elem().component_type
    }

    /// The node of the element a `Plan` type extends, which supplies the
    /// children the element omits (its attributes are in the record).
    pub(crate) fn base(&self) -> Option<NodeId> {
        self.base_node()
    }

    /// The reference in the element's `extend`, if any.
    pub(crate) fn extend(&self) -> Option<RefId> {
        self.c.tables[self.t.index()].plans[self.e.index()].extend
    }

    /// Whether the element has been planned already (an award by its
    /// answer).
    pub(crate) fn is_planned(&self) -> bool {
        !self.c.tables[self.t.index()].plans[self.e.index()]
            .props
            .is_empty()
    }

    /// The prop at `port` (`graph::Props::PORTS`) of the graph the
    /// element sits in directly, if it sits in one.
    pub(crate) fn enclosing_graph_prop(&self, port: Port) -> Option<Source> {
        let scope = self.scope();
        (scope != ROOT_SCOPE && self.c.elem(self.t, scope).component_type == ComponentType::Graph)
            .then_some(Source::alias(Arg::Elem(scope, port)))
    }

    /// The text of attribute `a`, if it holds no reference.
    pub(crate) fn attr_text(&self, a: u32) -> Option<String> {
        self.c.attr_text(a)
    }

    /// A flag attribute of `node`: present and empty or `true`.
    pub(crate) fn attr_flag(&self, node: NodeId, name: &str) -> bool {
        self.c.attr_flag(node, name)
    }

    /// An on/off attribute of `node` that may also take a value: present
    /// and not `false` or `none`.
    pub(crate) fn attr_on(&self, node: NodeId, name: &str) -> bool {
        self.c.attr_on(node, name)
    }

    /// The one reference attribute `a` holds and nothing else, if so.
    pub(crate) fn single_macro(&self, a: u32) -> Option<NodeId> {
        self.c.single_macro(a)
    }

    /// Whether a child node is layout: whitespace or a comment.
    pub(crate) fn is_blank(&self, n: NodeId) -> bool {
        self.c.is_blank(n)
    }

    /// Whether a child node is presentation a renderer reads (a `<label>`),
    /// which a planner reading element children passes over (ADR 0024).
    pub(crate) fn is_presentation_child(&self, n: NodeId) -> bool {
        self.c.is_presentation_child(n)
    }

    /// Whether a child node is no content of the element: layout or
    /// presentation (`is_blank`, `is_presentation_child`).
    pub(crate) fn is_not_content(&self, n: NodeId) -> bool {
        self.c.is_not_content(n)
    }

    /// A node's children that make up math text: text and `$ref`s, not
    /// blanks or elements.
    pub(crate) fn math_children(&self, node: NodeId) -> Vec<NodeId> {
        self.c.math_children(node)
    }

    /// The element's own children as math text, if it has any.
    pub(crate) fn child_math(&self) -> Option<Vec<NodeId>> {
        Some(self.math_children(self.node())).filter(|n| !n.is_empty())
    }

    /// The `extend` referent's children as math text, if it has any. A
    /// planner decides when they stand for the element's own.
    pub(crate) fn referent_child_math(&self) -> Option<Vec<NodeId>> {
        Some(self.math_children(self.base_node()?)).filter(|n| !n.is_empty())
    }

    /// A `<function>`'s `variables`, split at spaces and commas; `x` when
    /// absent.
    pub(crate) fn function_variables(&self, node: NodeId) -> Vec<String> {
        self.c.function_variables(node)
    }

    // Planning.

    /// Nodes as a scalar: a literal, a reference or math (a test
    /// component's children; a real type's children are declared later).
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

    /// A `$ref` node as a reference.
    pub(crate) fn reference(&mut self, node: NodeId) -> Result<RefId> {
        let scope = self.scope_for(&[node]);
        self.c.plan_ref(self.t, scope, node)
    }

    /// Whether a reference names a prop (`$p.x`) rather than an element.
    pub(crate) fn names_prop(&self, p: RefId) -> bool {
        self.c.compiled.refs[p.index()].prop.is_some()
    }

    /// Makes a reference that names no prop name `prop` (`$b` reads as
    /// `$b.value`); an error when what it names has no such prop.
    pub(crate) fn name_prop_if_none(&mut self, p: RefId, prop: &'static str) -> Result<()> {
        if self.c.compiled.refs[p.index()].prop.is_none() {
            let named = self.c.prop_named(self.t, p, prop)?;
            self.c.compiled.refs[p.index()].prop = named;
        }
        Ok(())
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
            Some(_) => self.c.referent_type(self.t, self.e, p),
            None => Ok(None),
        }
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
        let diff = c.inline_symbolic_maths(t, diff);
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

    /// Attribute `a` as a literal number; a reference is refused, since a
    /// load-time choice depends only on the seed and literals (ADR 0009).
    pub(crate) fn literal_number(&self, a: u32, name: &str) -> Result<f64> {
        self.c.literal_attr(a, name)
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

    /// Plans the element from its type's table alone, as a copy of what
    /// it extends where it extends one.
    pub(crate) fn plan_from_table(&mut self) -> Result<()> {
        let extend = self.extend();
        self.c.plan_attrs(self.t, self.e, extend)
    }

    /// Sets the element's props from its wiring.
    pub(crate) fn set_wiring(&mut self, wiring: ElemWiring) {
        let (props, list) = wiring.finish();
        let plan = &mut self.c.tables[self.t.index()].plans[self.e.index()];
        plan.props = props;
        plan.list = list;
    }

    /// Sets the element's props.
    pub(crate) fn set_props(&mut self, props: Vec<Source>) {
        self.c.tables[self.t.index()].plans[self.e.index()].props = props;
    }

    /// The element's `<math>` text as it was parsed (ADR 0029), or the
    /// error parsing it met.
    pub(crate) fn parsed_math(&self) -> Result<ParsedMath> {
        match self.c.parsed().math(self.t, self.e) {
            Some(parsed) => parsed.clone(),
            None => Err(Error::Internal("a <math> that was never parsed".into())),
        }
    }

    /// Makes the element an alias of the value its `extend` names, which
    /// it no longer extends (`<boolean extend="$bi"/>`).
    pub(crate) fn alias_extended(&mut self, prop: &'static str) -> Result<()> {
        let p = self.extend().expect("the element extends another");
        self.name_prop_if_none(p, prop)?;
        let plan = &mut self.c.tables[self.t.index()].plans[self.e.index()];
        plan.extend = None;
        plan.props = vec![Source::reference(p)];
        Ok(())
    }

    /// Makes the element's children copies of the components under what
    /// `from` names of the type outlining recorded it collects (ADR 0029),
    /// gathered when it expands (`Collection::Gathered`); its count is an
    /// aggregate over them.
    pub(crate) fn collect(&mut self, from: RefId) {
        let own_type = self.elem().component_type;
        debug_assert!(
            matches!(self.elem().body, Body::Collect { .. }),
            "outlining made a collecting element a collect"
        );
        let mut props = vec![Source::absent(); own_type.prop_defs().len()];
        mark_aggregates(own_type, &mut props);
        let plan = &mut self.c.tables[self.t.index()].plans[self.e.index()];
        plan.from = Some(from);
        plan.props = props;
    }

    // Machinery several components build on.

    /// Plans an answer, its inputs, awards and whens, and the responses
    /// they compare (`compile/planning/answer.rs`).
    pub(crate) fn plan_answer(&mut self) -> Result<()> {
        self.c.plan_answer(self.t, self.e)
    }

    /// Plans a choice, reactive or at load: its cases' conditions, or a
    /// select's `hide` (`compile/planning/choice.rs`).
    pub(crate) fn plan_choice(&mut self) -> Result<()> {
        self.c.plan_choice(self.t, self.e)
    }

    /// Plans a repeat over a list (`compile/planning/iterates.rs`).
    pub(crate) fn plan_repeat_for(&mut self) -> Result<()> {
        self.c.plan_iteration_names(self.t, self.e);
        self.c.plan_repeat_for(self.t, self.e)
    }

    /// Plans the hidden elements a repeat's `valueName` and `indexName`
    /// make (`compile/planning/iterates.rs`).
    pub(crate) fn plan_iteration_names(&mut self) {
        self.c.plan_iteration_names(self.t, self.e)
    }

    /// Plans a function's iterates as a repeat (`compile/planning/iterates.rs`).
    pub(crate) fn plan_function_iterates(&mut self) -> Result<()> {
        self.c.plan_function_iterates(self.t, self.e)
    }
}

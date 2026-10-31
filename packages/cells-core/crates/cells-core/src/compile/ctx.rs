//! [`PlanCtx`]: what every planner in `components/` is given (ADR 0016).

use super::*;

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
/// `plan_elem` holds every element after its planner (`compile/fix.rs`).
pub(crate) struct PlanCtx<'c, 'a> {
    c: &'c mut Compiler<'a>,
    t: TemplateId,
    e: ElemId,
    /// The `extend` referent, which supplies what the element omits.
    base: Option<Base>,
}

/// The `extend` referent of a `Plan` type planned with overrides: an
/// element of the same template.
struct Base {
    node: NodeId,
    /// Where its attributes and children are planned.
    scope: ElemId,
    /// Every node under it, attributes' values included: what a planner
    /// reads from it rather than from the element.
    subtree: HashSet<NodeId>,
}

impl<'c, 'a> PlanCtx<'c, 'a> {
    pub(in crate::compile) fn new(
        c: &'c mut Compiler<'a>,
        t: TemplateId,
        e: ElemId,
        base: Option<ElemId>,
    ) -> Self {
        let base = base.map(|b| {
            let Elem {
                node, name_scope, ..
            } = c.compiled.templates[t.index()].elems[b.index()];
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
        PlanCtx { c, t, e, base }
    }
}

impl<'a> PlanCtx<'_, 'a> {
    fn elem(&self) -> &Elem {
        &self.c.compiled.templates[self.t.index()].elems[self.e.index()]
    }

    fn scope(&self) -> ElemId {
        self.elem().name_scope
    }

    /// Where nodes are planned: the referent's scope for nodes under the
    /// referent, else the element's.
    fn scope_for(&self, nodes: &[NodeId]) -> ElemId {
        match (&self.base, nodes.first()) {
            (Some(b), Some(n)) if b.subtree.contains(n) => b.scope,
            _ => self.scope(),
        }
    }

    /// Where attribute `a` is planned: the referent's scope when it is the
    /// referent's attribute.
    fn scope_for_attr(&self, a: u32) -> ElemId {
        match &self.base {
            Some(b) if self.c.dast.attrs(b.node).contains(&a) => b.scope,
            _ => self.scope(),
        }
    }

    fn base_node(&self) -> Option<NodeId> {
        self.base.as_ref().map(|b| b.node)
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
    /// attributes and children the element omits.
    pub(crate) fn base(&self) -> Option<NodeId> {
        self.base_node()
    }

    /// The reference in the element's `extend`, if any.
    pub(crate) fn extend(&self) -> Option<RefId> {
        self.elem().extend
    }

    /// Whether the element has been planned already (an award by its
    /// answer).
    pub(crate) fn is_planned(&self) -> bool {
        !self.elem().props.is_empty()
    }

    /// The prop at position `pos` of the graph the element sits in
    /// directly, if it sits in one.
    pub(crate) fn enclosing_graph_prop(&self, pos: usize) -> Option<Source> {
        let scope = self.scope();
        (scope != ROOT_SCOPE
            && self.c.compiled.templates[self.t.index()].elems[scope.index()].component_type
                == ComponentType::Graph)
            .then(|| Source::Alias(Arg::Elem(scope, own_slot(pos))))
    }

    // Attributes.

    /// An attribute the type declares (`attributes { .. }`): the
    /// element's own, else its `extend` referent's for a `Plan` type.
    pub(crate) fn attr(&self, name: Attr) -> Option<u32> {
        self.c
            .attr_or_inherited(self.node(), self.base_node(), name.name())
    }

    /// Whether the attribute is given.
    pub(crate) fn has(&self, name: Attr) -> bool {
        self.attr(name).is_some()
    }

    /// An attribute's text, if it is given and holds no reference.
    pub(crate) fn text(&self, name: Attr) -> Option<String> {
        self.attr(name).and_then(|a| self.c.attr_text(a))
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

    /// Whether the attribute is one reference and nothing else
    /// (`center="$p"`).
    pub(crate) fn is_reference(&self, name: Attr) -> bool {
        self.attr(name)
            .is_some_and(|a| self.c.single_macro(a).is_some())
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

    /// An attribute's math text, if given.
    pub(crate) fn math(&self, name: Attr) -> Option<Vec<NodeId>> {
        self.attr(name)
            .map(|a| self.c.dast.attr_children(a).to_vec())
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

    /// A point-valued attribute, a reference (`center="$p"`) or a tuple
    /// (`center="(1, 2)"`), if given.
    pub(crate) fn point(&mut self, name: Attr) -> Result<Option<GivenPoint>> {
        let Some(a) = self.attr(name) else {
            return Ok(None);
        };
        self.point_at(a).map(Some)
    }

    /// Attribute `a` as a point.
    pub(crate) fn point_at(&mut self, a: u32) -> Result<GivenPoint> {
        let scope = self.scope_for_attr(a);
        self.c.plan_point_attr(self.t, scope, a)
    }

    /// A scalar attribute, a literal, a reference or math, if given.
    pub(crate) fn scalar(&mut self, name: Attr) -> Result<Option<Source>> {
        let Some(a) = self.attr(name) else {
            return Ok(None);
        };
        let nodes = self.c.dast.attr_children(a);
        self.scalar_of(name, nodes).map(Some)
    }

    /// Nodes as a scalar, a literal, a reference or math; `name` is the
    /// attribute they come from, for errors.
    pub(crate) fn scalar_of(&mut self, name: Attr, nodes: &[NodeId]) -> Result<Source> {
        let scope = self.scope_for(nodes);
        self.c.plan_scalar(self.t, scope, name.name(), nodes)
    }

    /// A 0/1 flag attribute (`hide`), as a copy inherits it
    /// (`Compiler::plan_flag`): the element's own, else its referent's, else
    /// `default`.
    pub(crate) fn flag(&mut self, name: Attr, default: bool) -> Result<Source> {
        let scope = self.scope();
        let node = self.node();
        let base = self.base.as_ref().map(|b| (b.node, b.scope));
        self.c
            .plan_flag(self.t, scope, node, base, name.name(), default)
    }

    /// The points of a point-list attribute (`through="$a (1, 2)"`), none
    /// if it is not given.
    pub(crate) fn points(&mut self, name: Attr) -> Result<Vec<GivenPoint>> {
        let Some(a) = self.attr(name) else {
            return Ok(Vec::new());
        };
        let scope = self.scope_for_attr(a);
        let node = self.node();
        self.c.plan_point_list(self.t, scope, node, a)
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
    /// `$b.value`).
    pub(crate) fn name_prop_if_none(&mut self, p: RefId, prop: &str) {
        let reference = &mut self.c.compiled.refs[p.index()];
        if reference.prop.is_none() {
            reference.prop = Some(prop.into());
        }
    }

    /// A reference to a prop of the element `p` names (`$l` -> `$l.x2`).
    pub(crate) fn with_prop(&mut self, p: RefId, prop: &str) -> RefId {
        self.c.plan_with_prop(p, prop)
    }

    /// A prop of the element a reference names, as an operator's argument.
    pub(crate) fn reference_prop(&mut self, p: RefId, prop: &str) -> Arg {
        Arg::Ref(self.with_prop(p, prop), Sel::Whole)
    }

    /// The component type of the element a reference names, when it
    /// names one in this template (`$l`, not `$l.x` or `$r[2]`), as pass
    /// 1 settled it (a `<math>` may be a point).
    pub(crate) fn reference_type(&mut self, p: RefId) -> Result<Option<ComponentType>> {
        match self.c.plan_elem_target(self.t, p) {
            // What needs the referent's type cannot be planned from a box.
            Some(e) => match self.c.shaped_elem(self.t, e)?.component_type {
                ComponentType::Error => Err(Error::BoxedReferent(
                    self.c.compiled.refs[p.index()].display.clone(),
                )),
                k => Ok(Some(k)),
            },
            None => Ok(None),
        }
    }

    /// Math text as tokens, `$ref`s as cell leaves, and its text.
    pub(crate) fn math_tokens(&mut self, nodes: &[NodeId]) -> Result<(Vec<Token>, String)> {
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
        let (toks, text) = self.math_tokens(nodes)?;
        let c = &mut *self.c;
        let sides = super::expr::split_top(&toks, &Token::Eq);
        if sides.len() != 2 {
            return Err(Error::BadMath {
                text,
                reason: "a line equation needs one '='".into(),
            });
        }
        let (lhs, rhs) = (
            c.parse_tokens(&sides[0], &text)?,
            c.parse_tokens(&sides[1], &text)?,
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
    /// in a hidden slot of `wiring` holding 1 while it holds.
    pub(crate) fn condition(&mut self, nodes: &[NodeId], wiring: &mut ElemWiring) -> Result<usize> {
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
        self.set_props(wiring.finish());
    }

    /// Sets the element's props.
    pub(crate) fn set_props(&mut self, props: Vec<Source>) {
        self.c.compiled.templates[self.t.index()].elems[self.e.index()].props = props;
    }

    /// The element's `<math>` text as pass 2 parsed it (ADR 0029), or the
    /// error parsing it met.
    pub(crate) fn parsed_math(&mut self) -> Result<ParsedMath> {
        let key = (self.t.get(), self.e.get());
        match self.c.parsed_maths.get(&key) {
            Some(Ok(parsed)) => Ok(parsed.clone()),
            Some(Err(_)) => Err(self.c.parsed_maths.remove(&key).unwrap().unwrap_err()),
            None => Err(Error::Internal("a <math> pass 2 did not parse".into())),
        }
    }

    /// Makes the element an alias of the value its `extend` names, which
    /// it no longer extends (`<boolean extend="$bi"/>`).
    pub(crate) fn alias_extended(&mut self, prop: &str) -> Result<()> {
        let p = self.extend().expect("the element extends another");
        self.name_prop_if_none(p, prop);
        let el = &mut self.c.compiled.templates[self.t.index()].elems[self.e.index()];
        el.extend = None;
        el.props = vec![Source::reference(p)];
        Ok(())
    }

    /// Makes the element's children copies of the components of type
    /// `component_type` under what `from` names, found when it expands;
    /// its props are set then too.
    pub(crate) fn collect(&mut self, from: RefId, component_type: ComponentType) {
        let own_type = self.elem().component_type;
        let el = &mut self.c.compiled.templates[self.t.index()].elems[self.e.index()];
        el.body = Body::Collect {
            from,
            component_type,
        };
        let mut props = vec![Source::absent(); own_type.prop_defs().len()];
        Deferred::mark(own_type, &mut props);
        el.props = props;
    }

    // Machinery several components build on.

    /// Plans an answer, its inputs, awards and whens, and the responses
    /// they compare (`compile/answer.rs`).
    pub(crate) fn plan_answer(&mut self) -> Result<()> {
        self.c.plan_answer(self.t, self.e)
    }

    /// Plans a choice, reactive or at load: its cases' conditions, or a
    /// select's `hide` (`compile/choice.rs`).
    pub(crate) fn plan_choice(&mut self) -> Result<()> {
        self.c.plan_choice(self.t, self.e)
    }

    /// Plans a repeat over a list (`compile/iterates.rs`).
    pub(crate) fn plan_repeat_for(&mut self) -> Result<()> {
        self.c.plan_repeat_for(self.t, self.e)
    }

    /// Plans a function's iterates as a repeat (`compile/iterates.rs`).
    pub(crate) fn plan_function_iterates(&mut self) -> Result<()> {
        self.c.plan_function_iterates(self.t, self.e)
    }
}

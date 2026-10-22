//! [`PlanCtx`]: what every planner in `components/` is given (ADR 0016).

use super::*;

/// What a planner is given (ADR 0016): its element and the source it reads
/// (the DAST, read-only), its attributes planned the ways every component
/// shares, the machinery several components build on, and the writes that
/// make the element's wiring. An attribute by name is the element's own or,
/// when the element omits it and is a `Plan` type extending another, its
/// `extend` referent's. One context serves every kind of planner; the kind
/// decides what is done around the call. For a `Plan` type,
/// `plan_with_extend` makes it and does the rest: a bare copy, sharing
/// state with the referent, and `fixed`.
pub(crate) struct PlanCtx<'c, 'a> {
    c: &'c mut Compiler<'a>,
    t: TemplateId,
    e: ElemId,
    /// The `extend` referent's node, which supplies what the element omits.
    base: Option<NodeId>,
}

impl<'c, 'a> PlanCtx<'c, 'a> {
    pub(in crate::compile) fn new(
        c: &'c mut Compiler<'a>,
        t: TemplateId,
        e: ElemId,
        base: Option<NodeId>,
    ) -> Self {
        PlanCtx { c, t, e, base }
    }
}

impl<'a> PlanCtx<'_, 'a> {
    fn elem(&self) -> &Elem {
        &self.c.compiled.templates[self.t].elems[self.e]
    }

    fn scope(&self) -> ElemId {
        self.elem().name_scope
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
        self.base
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
            && self.c.compiled.templates[self.t].elems[scope].component_type
                == ComponentType::Graph)
            .then(|| Source::Alias(Arg::Elem(scope, own_slot(pos))))
    }

    // Attributes.

    /// An attribute the type declares (`attributes { .. }`): the
    /// element's own, else its `extend` referent's for a `Plan` type.
    pub(crate) fn attr(&self, name: Attr) -> Option<u32> {
        self.c
            .attr_or_inherited(self.node(), self.base, name.name())
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
        Some(self.math_children(self.base?)).filter(|n| !n.is_empty())
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
        let scope = self.scope();
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
        let scope = self.scope();
        self.c.plan_scalar(self.t, scope, name.name(), nodes)
    }

    /// A 0/1 flag attribute (`hide`), as a copy inherits it
    /// (`Compiler::plan_flag`): the element's own, else its referent's, else
    /// `default`.
    pub(crate) fn flag(&mut self, name: Attr, default: bool) -> Result<Source> {
        let scope = self.scope();
        let (node, base) = (self.node(), self.base);
        self.c
            .plan_flag(self.t, scope, node, base, name.name(), default)
    }

    /// The points of a point-list attribute (`through="$a (1, 2)"`), none
    /// if it is not given.
    pub(crate) fn points(&mut self, name: Attr) -> Result<Vec<GivenPoint>> {
        let Some(a) = self.attr(name) else {
            return Ok(Vec::new());
        };
        let scope = self.scope();
        self.c.plan_point_list(self.t, scope, a)
    }

    /// Math text that is a pair, `(a, b)`, as its two coordinates.
    pub(crate) fn tuple(&mut self, nodes: &[NodeId]) -> Result<[Source; 2]> {
        let scope = self.scope();
        self.c.plan_tuple(self.t, scope, nodes)
    }

    /// A `$ref` node as a reference.
    pub(crate) fn reference(&mut self, node: NodeId) -> Result<RefId> {
        let scope = self.scope();
        self.c.plan_ref(self.t, scope, node)
    }

    /// Whether a reference names a prop (`$p.x`) rather than an element.
    pub(crate) fn names_prop(&self, p: RefId) -> bool {
        self.c.compiled.refs[p].prop.is_some()
    }

    /// Makes a reference that names no prop name `prop` (`$b` reads as
    /// `$b.value`).
    pub(crate) fn name_prop_if_none(&mut self, p: RefId, prop: &str) {
        let reference = &mut self.c.compiled.refs[p];
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
    /// names one in this template (`$l`, not `$l.x` or `$r[2]`).
    pub(crate) fn reference_type(&self, p: RefId) -> Option<ComponentType> {
        self.c
            .plan_elem_target(self.t, p)
            .map(|e| self.c.compiled.templates[self.t].elems[e].component_type)
    }

    /// Math text as tokens, `$ref`s as cell leaves, and its text.
    pub(crate) fn math_tokens(&mut self, nodes: &[NodeId]) -> Result<(Vec<Token>, String)> {
        let scope = self.scope();
        self.c.math_tokens(self.t, scope, nodes)
    }

    /// Tokens as an expression; `text` is their source, for errors.
    pub(crate) fn parse(&mut self, toks: &[Token], text: &str) -> Result<ExprId> {
        self.c.parse_tokens(toks, text)
    }

    /// An expression as a source: lowered to numeric operators when it is
    /// numeric, else symbolic.
    pub(crate) fn plan_expr(&mut self, id: ExprId) -> Source {
        self.c.plan_from_expr(id)
    }

    /// Math text as an expression that may be symbolic, its text kept for
    /// the symbolic engine.
    pub(crate) fn sym_math(&mut self, nodes: &[NodeId]) -> Result<ExprId> {
        let scope = self.scope();
        self.c.plan_sym_math(self.t, scope, nodes)
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
        let scope = self.scope();
        let compare = self.c.compare_attrs(&[self.node()]);
        self.c
            .plan_condition_content(self.t, scope, nodes, compare, wiring)
    }

    /// Warns that the element cannot be what its attributes ask, with a
    /// code and message of `packages/i18n/src/diagnostics.ts` (ADR 0013).
    /// A planner warns rather than leave a NaN to explain itself.
    pub(crate) fn warn(&mut self, code: &'static str, message: &str) {
        let node = self.node();
        self.c.warn(node, code, message);
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
        self.c.compiled.templates[self.t].elems[self.e].props = props;
    }

    /// Makes the element another type (a `<math>` that is a point).
    pub(crate) fn set_type(&mut self, component_type: ComponentType) {
        self.c.compiled.templates[self.t].elems[self.e].component_type = component_type;
    }

    /// Makes the element an alias of the value its `extend` names, which
    /// it no longer extends (`<boolean extend="$bi"/>`).
    pub(crate) fn alias_extended(&mut self, prop: &str) -> Result<()> {
        let p = self.extend().expect("the element extends another");
        self.name_prop_if_none(p, prop);
        let el = &mut self.c.compiled.templates[self.t].elems[self.e];
        el.extend = None;
        el.props = vec![Source::reference(p)];
        Ok(())
    }

    /// Makes the element's children copies of the components of type
    /// `component_type` under what `from` names, found when it expands;
    /// its props are set then too.
    pub(crate) fn collect(&mut self, from: RefId, component_type: ComponentType) {
        let own_type = self.elem().component_type;
        let el = &mut self.c.compiled.templates[self.t].elems[self.e];
        el.body = Body::Collect {
            from,
            component_type,
        };
        let mut props = vec![Source::Fixed(f64::NAN); own_type.prop_defs().len()];
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

//! [`PlanCtx`]: what every component planner is given.

use super::{ListEntry, Planning, Splice};
use crate::compile::ir::record::ListPiece;
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
    /// The `extend` referents of a copy with overrides in this template,
    /// the chain it stands on, nearest first: what the record holds from
    /// each is planned where it sits.
    referents: Vec<Base>,
    /// For a `<math>` that writes no text, its referents' nearest text
    /// (`Planning::inherit`).
    inherited_math: Option<ParsedMath>,
}

/// An `extend` referent of a `Plan` type planned with overrides: an
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
        referents: Vec<ElemId>,
        inherited_math: Option<ParsedMath>,
    ) -> Self {
        let referents = referents.into_iter().map(|b| {
            let Elem {
                node, name_scope, ..
            } = *p.rd.referent_row(t, b);
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
        let referents = referents.collect();
        PlanCtx {
            p,
            t,
            e,
            record,
            referents,
            inherited_math,
        }
    }
}

impl<'a> PlanCtx<'_, 'a> {
    fn elem(&self) -> &Elem {
        self.p.rd.own_row(self.t, self.e)
    }

    fn scope(&self) -> ElemId {
        self.elem().name_scope
    }

    /// Where nodes are planned: a referent's scope for nodes under that
    /// referent (its children), else the element's.
    fn scope_for(&self, nodes: &[NodeId]) -> ElemId {
        nodes
            .first()
            .and_then(|n| self.referents.iter().find(|b| b.subtree.contains(n)))
            .map_or_else(|| self.scope(), |b| b.scope)
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
        let graph = self.p.rd.in_graph(self.t, self.e)?;
        Some(Source::alias(Arg::Elem(graph, port)))
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
        self.p.plan_value_children(self.t, self.e, scope, v)
    }

    /// Math text written as one interval, `[a, b)`: its endpoints and
    /// closedness (ADR 0049); `None` when it is not one interval.
    pub(crate) fn interval(&mut self, nodes: &[NodeId]) -> Result<Option<IntervalAttr>> {
        let scope = self.scope_for(nodes);
        self.p
            .rd
            .plan_interval(&mut self.p.ar, self.t, scope, nodes)
    }

    /// The math cell of the symbol `name`, a constant: a function's
    /// variable (ADR 0049).
    pub(crate) fn symbol(&mut self, name: &str) -> Source {
        let id = self.p.ar.arena.push(Expr::Sym(name.into()));
        self.p
            .ar
            .sym_text
            .insert(id, SymText::Spelled(name.to_string()));
        Source::sym_expr(id, crate::program::Post::None)
    }

    /// Math tokens (an entry of a tuple, `math_tokens`) as an expression
    /// that may be symbolic, a math cell: a curve's coordinate in its
    /// parameter (ADR 0049). Its text for the engine is spelled from the
    /// tokens.
    pub(crate) fn sym_tokens(&mut self, toks: &[Token]) -> Result<Source> {
        let src = MathSrc(&[]);
        let id = self.p.rd.parse_tokens(&mut self.p.ar, toks, src)?;
        let mut text = String::new();
        for (k, tok) in toks.iter().enumerate() {
            let glued = matches!(tok, Token::LParen)
                && matches!(k.checked_sub(1).map(|j| &toks[j]), Some(Token::Ident(_)));
            if k > 0 && !glued {
                text.push(' ');
            }
            match tok {
                Token::Num(v) if *v == std::f64::consts::PI => text.push_str("pi"),
                Token::Num(v) => text.push_str(&format!("{v}")),
                Token::Ident(name) => text.push_str(name),
                Token::Cell(r) => text.push_str(&crate::sym::engine::leaf_name(r.get(), false)),
                Token::Op(c) => text.push(*c),
                Token::LParen => text.push('('),
                Token::RParen => text.push(')'),
                Token::Comma => text.push(','),
                Token::Eq => text.push('='),
                Token::Open(c) | Token::Close(c) => text.push(*c),
            }
        }
        self.p.ar.sym_text.insert(id, SymText::Spelled(text));
        Ok(Source::sym_expr(id, crate::program::Post::None))
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
        let (t, e) = (self.t, self.e);
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
        let diff = c.inline_symbolic_maths(t, e, diff)?;
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

    /// The entries the children `pieces` of a list (or an operator)
    /// contribute, in order, at most `max` (ADR 0041, decision 9): each
    /// reference or element child naming a static sequence spliced into
    /// its entries, one naming an entry past such a list's end dropped,
    /// and math text with references inside its brackets parsed.
    pub(crate) fn list_entries(
        &mut self,
        pieces: Vec<ListPiece>,
        max: f64,
    ) -> Result<Vec<ListEntry>> {
        self.p.list_entries(self.t, self.e, pieces, max)
    }

    /// The points a point list's children contribute: a pair per piece of
    /// text, the point each reference or element child names, a point
    /// list's points spliced (ADR 0041), at most `max` of them.
    pub(crate) fn point_entries(
        &mut self,
        pieces: Vec<ListPiece>,
        max: f64,
    ) -> Result<Vec<GivenPoint>> {
        self.p.point_entries(self.t, self.e, pieces, max)
    }

    /// Record which of the element's `n` entries, from its children
    /// `pieces`, are its element children as they stand, each its own
    /// row (ADR 0041, decision 4): a value list's, whose entries are its
    /// children in order.
    pub(crate) fn element_rows(&mut self, pieces: &[ListPiece], n: usize) {
        self.p.element_rows(self.t, self.e, pieces, n);
    }

    /// An entry of a list read as math: a piece of text as written
    /// (`1+1`, `pi`, `x`), none when it is no math; a reference alone, its
    /// one cell or the expression that cell stands for.
    pub(crate) fn entry_math(&mut self, entry: &ListEntry) -> Option<ExprId> {
        match entry {
            ListEntry::Text(_, text) => self.p.text_math(text),
            ListEntry::Math(id) => Some(*id),
            ListEntry::Ref(p) => {
                let id = self.p.ar.arena.push(Expr::Cell(*p));
                self.p.ar.sym_text.insert(id, SymText::Leaf(*p));
                Some(id)
            }
        }
    }

    /// What an entry of a list reads, as far as the records tell (a
    /// reference's referent's type, ADR 0053): math text is math, a piece
    /// of text none (its reader decides).
    pub(crate) fn entry_kind(&self, entry: &ListEntry) -> Option<ValueKind> {
        match entry {
            ListEntry::Text(..) => None,
            ListEntry::Math(_) => Some(ValueKind::Math),
            ListEntry::Ref(p) => self.p.rd.ref_value_kind(&self.p.ar, self.t, *p),
        }
    }

    /// The type of the element reference `p` names by a path of names
    /// alone (no prop, no entry), as the records tell: None for any
    /// other reference.
    fn ref_elem_type(&self, p: RefId) -> Option<ComponentType> {
        let r = &self.p.ar.refs[p.index()];
        if r.prop.is_some() || !r.entries.is_empty() {
            return None;
        }
        let mut last = None;
        for step in &r.steps {
            match step {
                Step::Elem(e) => last = Some(*e),
                _ => return None,
            }
        }
        let t = self.p.rd.template_up(self.t, r.hops);
        // Unrecorded (ADR 0050): every caller puts the reference in a
        // source of the plan (`ref_prop`, `ref_of_elem`).
        Some(self.p.rd.referent_row(t, last?).component_type)
    }

    /// Reference `p`, which names an element by a path of names alone
    /// ([`PlanCtx::ref_elem_type`]), reading that element's prop `name`
    /// instead, its spelling in any case (`sortByProp`): None when it
    /// names no element so, or its type has no such prop.
    pub(crate) fn ref_prop(&mut self, p: RefId, name: &str) -> Option<RefId> {
        let ty = self.ref_elem_type(p)?;
        let sel = ty.resolve_prop(name).or_else(|| {
            let spelled = ty
                .prop_defs()
                .iter()
                .map(|d| d.name)
                .chain(ty.def().combined_props.iter().map(|(n, _)| *n))
                .chain(ty.def().alternate_names.iter().map(|(n, _)| *n))
                .find(|n| n.eq_ignore_ascii_case(name))?;
            ty.resolve_prop(spelled)
        })?;
        let mut plan = self.p.ar.refs[p.index()].clone();
        plan.prop = Some(RefProp::of(ty, sel));
        Some(self.p.ar.push_ref(plan))
    }

    /// Reference `p` naming the element itself, without the prop it
    /// reads: `p` when it reads none; None when it names no element by a
    /// path of names alone, or takes an entry.
    pub(crate) fn ref_of_elem(&mut self, p: RefId) -> Option<RefId> {
        let r = &self.p.ar.refs[p.index()];
        if !r.entries.is_empty() || !r.steps.iter().all(|s| matches!(s, Step::Elem(_))) {
            return None;
        }
        if r.prop.is_none() {
            return Some(p);
        }
        let mut plan = r.clone();
        plan.prop = None;
        Some(self.p.ar.push_ref(plan))
    }

    /// How many cells reference `p` reads, when its prop alone says: one
    /// for a table prop, a combined prop's parts; None for any other.
    pub(crate) fn ref_cells(&self, p: RefId) -> Option<usize> {
        let r = &self.p.ar.refs[p.index()];
        if !r.entries.is_empty() {
            return None;
        }
        match r.prop?.sel {
            PropSel::At(PropAt::Position(_)) => Some(1),
            sel @ PropSel::Parts { .. } => Some(sel.parts().len()),
            _ => None,
        }
    }

    /// The entries reference `p` contributes when it names a static
    /// sequence (ADR 0041, decision 5): one reference per entry (`$p[k]`);
    /// None when it names one value.
    pub(crate) fn reference_entries(&mut self, p: RefId) -> Option<Vec<ListEntry>> {
        match self.p.splice(self.t, self.e, p) {
            Splice::Entries(n) => Some(
                (1..=n)
                    .map(|k| ListEntry::Ref(self.p.entry_ref(self.t, p, k)))
                    .collect(),
            ),
            Splice::Value | Splice::Nothing => None,
        }
    }

    /// Warns that the element cannot be what its attributes ask, with a
    /// diagnostic code and message. What the planner cannot define is
    /// [`Wire::undefined`] of what this returns.
    pub(crate) fn warn(&mut self, code: &'static str, message: &str) -> Warned {
        let node = self.node();
        self.p.ar.warn(node, code, message)
    }

    // Operators over math (ADR 0043).

    /// An operand planned from the record (a literal, a reference, math
    /// text, as [`PlanCtx::value_of`] plans one) as an expression the
    /// symbolic engine reads: the number, the reference's leaf, or the math
    /// text. `None` for a source that is none of these.
    pub(crate) fn operand_expr(&mut self, source: &Source) -> Option<ExprId> {
        let ar = &mut self.p.ar;
        Some(match source {
            Source::Leaf(Leaf::Given(v) | Leaf::Const(v)) => ar.arena.push(Expr::Num(*v)),
            Source::Flow(Flow::Math(id)) => *id,
            Source::Flow(Flow::Alias(Arg::Ref(p, Sel::Whole))) => {
                let id = ar.arena.push(Expr::Cell(*p));
                ar.sym_text.insert(id, SymText::Leaf(*p));
                id
            }
            _ => return None,
        })
    }

    /// An operator over math `args` that only the symbolic engine computes
    /// (`Expr::Operator`): its text is `spell` of the operands' texts, each
    /// in parentheses, as the engine reads them (a number as written, a
    /// reference as its leaf).
    pub(crate) fn operator_expr(
        &mut self,
        args: &[ExprId],
        spell: impl FnOnce(&[String]) -> String,
    ) -> ExprId {
        let dast = self.p.rd.dast;
        let ar = &mut self.p.ar;
        let texts: Vec<String> = args
            .iter()
            .map(|id| {
                let text = match (ar.sym_text.get(id), ar.arena.get(*id)) {
                    (Some(sym), _) => sym.spell(dast),
                    (None, Expr::Num(v)) => crate::sym::engine::number_text(*v),
                    (None, other) => unreachable!("an operand with no text: {other:?}"),
                };
                format!("({text})")
            })
            .collect();
        let text = spell(&texts);
        let id = ar.arena.push(Expr::Operator(args.to_vec()));
        ar.sym_text.insert(id, SymText::Spelled(text));
        id
    }

    // The element's wiring.

    /// The element's `<math>` text as it was parsed, or the
    /// error parsing it met. An extend that writes no text of its own reads
    /// the nearest text along the chain of referents it stands on, whose
    /// references were planned where that referent sits (REF-3, REF-6):
    /// math text is no attribute, so it is not in the merged record.
    pub(crate) fn parsed_math(&self) -> Result<ParsedMath> {
        if let Some(math) = &self.inherited_math {
            return Ok(math.clone());
        }
        match self.p.parsed.math(self.t, self.e) {
            Some(parsed) => parsed.clone(),
            None => Err(Error::Internal("a <math> that was never parsed".into())),
        }
    }

    /// The element's children whose type plays `role`, in order: the
    /// pieces of a piecewise function (ADR 0049), whose ports it reads.
    pub(crate) fn children_playing(&self, role: crate::components::Role) -> Vec<Inner> {
        self.p
            .rd
            .elem_children(self.t, self.e)
            .into_iter()
            .filter(|&x| {
                self.p
                    .rd
                    .owned_row(self.t, self.e, x)
                    .component_type
                    .plays(role)
            })
            .map(Inner)
            .collect()
    }

    // The inputs the element owns (ADR 0045).

    /// The `k`-th input the element owns, as its type declares them
    /// (`inner { .. }`): among the element's children of its type, the one
    /// in its place, the normalizer's or one outlining made.
    pub(crate) fn inner(&self, k: usize) -> Result<Inner> {
        let missing = || Error::Internal("an owned input outlining did not make".into());
        let decls = self.elem().component_type.inner();
        let decl = decls.get(k).ok_or_else(missing)?;
        let nth = decls[..k].iter().filter(|i| i.ty == decl.ty).count();
        self.p
            .rd
            .elem_children(self.t, self.e)
            .into_iter()
            .filter(|&x| self.p.rd.owned_row(self.t, self.e, x).component_type == decl.ty)
            .nth(nth)
            .map(Inner)
            .ok_or_else(missing)
    }

    /// Plans owned input `inner` with `wiring`: the one plan a planner
    /// writes besides its element's, since nothing else plans it.
    pub(crate) fn plan_inner(&mut self, inner: Inner, wiring: ElemWiring) {
        let (props, list) = wiring.finish();
        let plan = &mut self.p.tables[self.t.index()].plans[inner.0.index()];
        plan.props = props;
        plan.list = list;
    }

    /// The expression `num / den` over two expressions the owned inputs
    /// hold (a port each, a math cell): a math cell, never lowered.
    pub(crate) fn inner_quotient(&mut self, num: (Inner, Port), den: (Inner, Port)) -> Source {
        let mut leaf = |(inner, port): (Inner, Port)| {
            let ty = self.p.rd.owned_row(self.t, self.e, inner.0).component_type;
            let plan = RefPlan {
                hops: 0,
                steps: vec![Step::Elem(inner.0)],
                prop: Some(RefProp::of(
                    ty,
                    crate::components::PropSel::At(crate::components::PropAt::Position(
                        port.index(),
                    )),
                )),
                entries: Vec::new(),
                display: RefDisplay::Spelled(format!("(owned <{}>)", ty.tag()).into()),
                node: NodeId::NONE,
            };
            let r = self.p.ar.push_ref(plan);
            (r, self.p.ar.arena.push(Expr::Cell(r)))
        };
        let ((ra, a), (rb, b)) = (leaf(num), leaf(den));
        let id = self.p.ar.arena.push(Expr::Div(a, b));
        // The engine's text, each leaf written `cellN<plan>`, which it
        // parses when the element expands.
        let name = |r: RefId| crate::sym::engine::leaf_name(r.get(), false);
        let text = format!("( {} ) / ( {} )", name(ra), name(rb));
        self.p.ar.sym_text.insert(id, SymText::Spelled(text));
        Source::sym_expr(id, crate::program::Post::None)
    }

    // Machinery several components build on.
}

/// A child element whose ports its parent's planner reads: an input it
/// owns (ADR 0045), as [`PlanCtx::inner`] finds it, or a piece of a
/// piecewise function (ADR 0049, [`PlanCtx::children_playing`]).
#[derive(Debug, Clone, Copy)]
pub(crate) struct Inner(ElemId);

impl Inner {
    /// Its port `port`, read by the owner.
    pub(crate) fn port(self, port: Port) -> Source {
        Source::alias(Arg::Elem(self.0, port))
    }
}

/// What a section reads of the tree around it (ADR 0058): an ancestor's
/// prop, and its `<title>` child's text.
impl PlanCtx<'_, '_> {
    /// Prop `name` of the nearest ancestor of the element whose type
    /// `which` accepts, as a reference up the tree read where the element
    /// sits (ADR 0050: a dependency in the tree), through the repeats and
    /// choices around its template. None when no ancestor is one; `Some(None)`
    /// when the nearest one's type has no prop so named.
    pub(crate) fn ancestor_prop(
        &mut self,
        which: impl Fn(ComponentType) -> bool,
        name: &str,
    ) -> Option<Option<Source>> {
        let (mut t, mut e, mut hops) = (self.t, self.e, 0u32);
        loop {
            let (at, ae, row) = self.p.rd.enclosing_row(t, e)?;
            hops += u32::from(at != t);
            (t, e) = (at, ae);
            let ty = row.component_type;
            if !which(ty) {
                continue;
            }
            let Some(prop) = RefProp::named(ty, name) else {
                return Some(None);
            };
            let plan = RefPlan {
                hops,
                steps: vec![Step::Elem(ae)],
                prop: Some(prop),
                entries: Vec::new(),
                display: RefDisplay::Spelled(
                    format!("(the {name} of the enclosing <{}>)", ty.tag()).into(),
                ),
                node: NodeId::NONE,
            };
            return Some(Some(Source::reference(self.p.ar.push_ref(plan))));
        }
    }

    /// The text of the element's last child of type `ty` (a section's
    /// `<title>`, the one the current core reads): `Some(Some(text))` when
    /// it holds literal text alone, `Some(None)` when it holds anything
    /// else, None when the element has no such child. A clone (a child of
    /// a container copy) holds its original's.
    pub(crate) fn last_child_text(&self, ty: ComponentType) -> Option<Option<String>> {
        let d = self.p.rd.dast;
        let x = self
            .p
            .rd
            .elem_children(self.t, self.e)
            .into_iter()
            .rfind(|&x| self.p.rd.owned_row(self.t, self.e, x).component_type == ty)?;
        let mut row = self.p.rd.owned_row(self.t, self.e, x);
        while row.node == NodeId::NONE {
            let original = row.extend.and_then(|p| match &self.p.ar.refs[p.index()] {
                RefPlan { hops: 0, steps, .. } => match steps[..] {
                    [Step::Elem(o)] => Some(o),
                    _ => None,
                },
                _ => None,
            });
            let Some(o) = original else {
                return Some(None);
            };
            row = self.p.rd.referent_row(self.t, o);
        }
        let mut text = String::new();
        for &n in d.children(row.node) {
            match d.kind(n) {
                NodeKind::Text => text.push_str(d.str(n)),
                NodeKind::Other => {}
                _ => return Some(None),
            }
        }
        Some(Some(text))
    }
}

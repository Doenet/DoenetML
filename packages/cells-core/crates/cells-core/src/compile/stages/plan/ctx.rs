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
    /// The `extend` referent of a copy with overrides, in this template,
    /// whose math text in the record is planned where it sits.
    referent: Option<Base>,
}

/// The `extend` referent of a `Plan` type planned with overrides: an
/// element of the same template.
struct Base {
    /// The referent.
    elem: ElemId,
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
                elem: b,
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
    /// its referent's, whose references were planned where the referent
    /// sits (REF-3, REF-6): math text is no attribute, so it is not in the
    /// merged record.
    pub(crate) fn parsed_math(&self) -> Result<ParsedMath> {
        let d = self.p.rd.dast;
        let own_text = d
            .children(self.node())
            .iter()
            .any(|&n| !self.p.rd.is_not_content(n));
        let at = match &self.referent {
            Some(b) if !own_text => b.elem,
            _ => self.e,
        };
        match self.p.parsed.math(self.t, at) {
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
            .filter(|&x| self.p.rd.elem(self.t, x).component_type.plays(role))
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
            .filter(|&x| self.p.rd.elem(self.t, x).component_type == decl.ty)
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
            let ty = self.p.rd.elem(self.t, inner.0).component_type;
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

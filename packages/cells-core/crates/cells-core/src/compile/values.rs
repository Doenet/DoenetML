//! A value planned from its source text, which parsing does for every
//! record and a planner does for what it reads itself: a literal or a
//! reference, a math, a tuple, a point, and whether a reference reads
//! text.

use crate::compile::*;

/// Reading the source, a value from its text: a literal or a reference, a math,
/// a tuple, a point. Run by parsing for every record, and by a planner for what
/// it reads itself.
impl<'a> Reader<'a> {
    /// Whether `m`, a `$t` or `$t.prop` not yet planned, reads a text
    /// value: a prop its referent's type declares as text (a `<text>`'s or
    /// `<textInput>`'s `value`).
    pub(in crate::compile) fn macro_reads_text(
        &self,
        t: TemplateId,
        scope: ElemId,
        m: NodeId,
    ) -> bool {
        let d = self.dast;
        let names = d.macro_path(m);
        if names.len() > 2 {
            return false;
        }
        let Ok(Some((hops, e))) = self.lookup(t, scope, names[0]) else {
            return false;
        };
        let cur_t = self.template_up(t, hops);
        let component_type = self.outlined(cur_t).elems[e.index()].component_type;
        let prop = names.get(1).map(|&p| d.strings.get(p).trim());
        prop_is_text(component_type, prop)
    }

    /// Whether planned ref `p`, planned from template `t`, reads a text
    /// value.
    pub(in crate::compile) fn ref_is_text(&self, ar: &Arenas, t: TemplateId, p: RefId) -> bool {
        let r = &ar.refs[p.index()];
        let Some((cur_t, e)) = self.static_target(ar, t, p) else {
            return false;
        };
        let component_type = self.outlined(cur_t).elems[e.index()].component_type;
        match r.prop {
            None => prop_is_text(component_type, None),
            Some(rp) => matches!(
                rp.sel_on(component_type),
                Some(PropSel::At(PropAt::Position(i))) if component_type.prop_defs()[i].text
            ),
        }
    }

    /// A literal number or a single reference; else `BadValue`.
    pub(in crate::compile) fn plan_value(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        attr: &str,
        nodes: &[NodeId],
        ref_prop: Option<&'static str>,
    ) -> Result<Source> {
        match self.try_value(ar, t, scope, nodes, ref_prop)? {
            Some(source) => Ok(source),
            None => Err(Error::BadValue {
                attr: attr.into(),
                text: self.value_text(nodes).trim().into(),
            }),
        }
    }

    /// `plan_value`, with `None` for what is not a single literal or
    /// reference (math text, most often).
    pub(in crate::compile) fn try_value(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
        ref_prop: Option<&'static str>,
    ) -> Result<Option<Source>> {
        let _s = crate::trace::tally("plan value");
        let d = self.dast;
        let (mut macros, mut macro_node) = (0, NodeId::NONE);
        let (mut texts, mut text) = (0, "");
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Macro => {
                    macros += 1;
                    macro_node = n;
                }
                NodeKind::Text => {
                    let s = d.str(n).trim();
                    if !s.is_empty() {
                        texts += 1;
                        text = s;
                    }
                }
                _ => {}
            }
        }
        match (macros, texts) {
            (1, 0) => {
                let p = self.plan_ref(ar, t, scope, macro_node)?;
                if let (None, Some(rp)) = (&ar.refs[p.index()].prop, ref_prop) {
                    let named = self.prop_named(ar, t, p, rp)?;
                    ar.ref_mut(p).prop = named;
                }
                Ok(Some(Source::reference(p)))
            }
            (0, 1) => Ok(literal_value(text)),
            // Text in several nodes reads as one (the parser seldom splits it).
            (0, _) if texts > 1 => Ok(literal_value(self.value_text(nodes).trim())),
            _ => Ok(None),
        }
    }

    /// The text among `nodes`, as one string: for an error, or the rare
    /// value split across text nodes.
    fn value_text(&self, nodes: &[NodeId]) -> String {
        let d = self.dast;
        nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect()
    }

    /// Math text and `$ref` children to an expression template whose cell
    /// leaves are plan ids.
    pub(in crate::compile) fn plan_math(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let _s = crate::trace::tally("plan math");
        let (toks, src) = self.math_tokens(ar, t, scope, nodes)?;
        self.parse_tokens(ar, &toks, src)
    }

    /// Math text and `$ref` children to an expression template, recording
    /// the text for the symbolic engine in case the math turns out symbolic.
    pub(in crate::compile) fn plan_sym_math(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<ExprId> {
        let mt = self.math_text(nodes)?;
        self.parse_math_text(ar, t, scope, &mt)
    }

    /// The source for one scalar attribute value: literal, reference, or math.
    pub(in crate::compile) fn plan_scalar(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<Source> {
        match self.try_value(ar, t, scope, nodes, None)? {
            Some(p) => Ok(p),
            None => {
                let id = self.plan_math(ar, t, scope, nodes)?;
                Ok(self.plan_from_expr(ar, id))
            }
        }
    }

    /// A list of scalars ([`AttrKind::Scalars`](crate::components::AttrKind::Scalars)): each item a literal number
    /// or one reference, items separated by spaces, as DoenetML writes a
    /// list. Anything else (math, a reference with text against it, a
    /// comma) is refused.
    pub(in crate::compile) fn plan_scalar_list(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        a: AttrId,
    ) -> Result<Vec<Source>> {
        let d = self.dast;
        let nodes = d.attr_children(a);
        let bad = |s: &Self| Error::BadValue {
            attr: d.attr_name(a).into(),
            text: s.value_text(nodes).trim().into(),
        };
        let mut out = Vec::new();
        // Whether the text before the next node ended an item.
        let mut apart = true;
        for (k, &n) in nodes.iter().enumerate() {
            match d.kind(n) {
                NodeKind::Macro => {
                    // A reference stands alone: text right against it would
                    // make it math.
                    let next_apart = nodes.get(k + 1).is_none_or(|&m| {
                        d.kind(m) != NodeKind::Text || d.str(m).starts_with(char::is_whitespace)
                    });
                    if !apart || !next_apart {
                        return Err(bad(self));
                    }
                    out.push(Source::reference(self.plan_ref(ar, t, scope, n)?));
                    apart = false;
                }
                NodeKind::Text => {
                    let text = d.str(n);
                    if !apart && !text.starts_with(char::is_whitespace) {
                        return Err(bad(self));
                    }
                    for item in text.split_whitespace() {
                        let v = item.parse::<f64>().map_err(|_| bad(self))?;
                        out.push(Source::given(v));
                    }
                    apart = text.ends_with(char::is_whitespace) || text.trim().is_empty();
                }
                _ => {}
            }
        }
        Ok(out)
    }

    /// A source from an expression template: a constant is an essential
    /// literal, a lone reference an alias, anything else a lowered math.
    pub(in crate::compile) fn plan_from_expr(&self, ar: &Arenas, id: ExprId) -> Source {
        match ar.arena.get(id) {
            Expr::Num(v) => Source::given(*v),
            Expr::Cell(p) => Source::reference(*p),
            _ => Source::math(id),
        }
    }

    /// `(a, b)`: two scalar sources from tuple text, with `$ref` leaves.
    pub(in crate::compile) fn plan_tuple(
        &self,
        ar: &mut Arenas,
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
            let p = self.plan_ref(ar, t, scope, macros[0])?;
            return Ok([Source::coord(p, 0), Source::coord(p, 1)]);
        }
        let (toks, src) = self.math_tokens(ar, t, scope, nodes)?;
        let entries = expr::tuple_entries(&toks).ok_or_else(|| Error::BadMath {
            text: src.text(self.dast),
            reason: "expected a tuple like (x, y)".into(),
        })?;
        self.point_from_entries(ar, &entries, src)
    }

    /// The entries of `(a, b)` (`tuple_entries`), as two scalar sources.
    pub(in crate::compile) fn point_from_entries(
        &self,
        ar: &mut Arenas,
        parts: &[Vec<Token>],
        src: MathSrc<'_>,
    ) -> Result<[Source; 2]> {
        let [x, y] = parts else {
            return Err(Error::BadMath {
                text: src.text(self.dast),
                reason: format!("expected 2 coordinates, got {}", parts.len()),
            });
        };
        let (x, y) = (
            self.parse_tokens(ar, x, src)?,
            self.parse_tokens(ar, y, src)?,
        );
        Ok([self.plan_from_expr(ar, x), self.plan_from_expr(ar, y)])
    }

    /// A point-valued attribute: a reference (`center="$p"`) or a tuple.
    pub(in crate::compile) fn plan_point_attr(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        a: AttrId,
    ) -> Result<GivenPoint> {
        match self.single_macro(a) {
            Some(m) => Ok(GivenPoint::Ref(self.plan_ref(ar, t, scope, m)?)),
            None => Ok(GivenPoint::Tuple(self.plan_tuple(
                ar,
                t,
                scope,
                self.dast.attr_children(a),
            )?)),
        }
    }
}

/// A literal value: `true`, `false` or a number.
pub(in crate::compile) fn literal_value(text: &str) -> Option<Source> {
    match text {
        "true" => Some(Source::given(1.0)),
        "false" => Some(Source::given(0.0)),
        _ => text.parse::<f64>().ok().map(Source::given),
    }
}

/// Whether prop `prop` (the default prop when `None`) of `component_type`
/// holds text, as its table declares.
fn prop_is_text(component_type: ComponentType, prop: Option<&str>) -> bool {
    let sel = match prop {
        Some(name) => component_type.resolve_prop(component_type.canonical_prop(name)),
        None => component_type.default_sel(),
    };
    matches!(
        sel,
        Some(PropSel::At(PropAt::Position(i))) if component_type.prop_defs()[i].text
    )
}

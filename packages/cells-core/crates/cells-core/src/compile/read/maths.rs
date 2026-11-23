//! Math text: tokenizing it, planning its `$ref`s and parsing it.

use crate::compile::*;

/// Reading the source, math text: tokenized, its `$ref`s planned, parsed. Run
/// by outlining (tokenizing), parsing, and the planners that read math
/// themselves; writes only the reference and expression arenas.
impl Reader<'_> {
    /// Tokenize math text with `$ref` children as cell leaves holding plan
    /// ids; with where the text came from, for an error.
    pub(in crate::compile) fn math_tokens<'n>(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &'n [NodeId],
    ) -> Result<(Vec<Token>, MathSrc<'n>)> {
        let (toks, macros) = self.tokenize_math(nodes)?;
        let (toks, _) = self.resolve_tokens(ar, t, scope, &toks, &macros)?;
        Ok((toks, MathSrc(nodes)))
    }

    /// Math text tokenized, its `$ref`s placeholders; reads no other
    /// element, so it may run while outlining.
    pub(in crate::compile) fn math_text(&self, nodes: &[NodeId]) -> Result<MathText> {
        let (toks, macros) = self.tokenize_math(nodes)?;
        Ok(MathText {
            toks,
            macros,
            nodes: nodes.into(),
        })
    }

    /// The tokens of `nodes`, each `$ref` a placeholder, and the `$ref`
    /// nodes in order.
    fn tokenize_math(&self, nodes: &[NodeId]) -> Result<(Vec<Token>, Vec<NodeId>)> {
        let _s = crate::trace::tally("math text");
        let d = self.dast;
        let mut toks = Vec::new();
        let mut macros = Vec::new();
        for (i, &n) in nodes.iter().enumerate() {
            match d.kind(n) {
                NodeKind::Text => {
                    expr::tokenize(d.str(n), &mut toks).map_err(|reason| {
                        Error::BadMath {
                            // The text up to where tokenizing failed.
                            text: spell_math(d, &nodes[..=i]),
                            reason,
                        }
                    })?;
                }
                NodeKind::Element if matches!(d.str(n), "conditionalContent" | "select") => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside math: each branch would have to yield the same type",
                        d.str(n)
                    )));
                }
                NodeKind::Macro => {
                    macros.push(n);
                    toks.push(Token::Cell(RefId::NONE));
                }
                // A label or description is presentation, not content.
                NodeKind::Element if self.is_presentation_child(n) => {}
                // Any other element would be content this text cannot hold:
                // dropping it would give a wrong value with no diagnostic
                // (COMP-1). Its value can be written as a reference.
                NodeKind::Element => {
                    return Err(Error::Unsupported(format!(
                        "a <{}> inside math: name it and write its value as a reference",
                        d.str(n)
                    )));
                }
                NodeKind::Other => {}
            }
        }
        Ok((toks, macros))
    }

    /// The tokens of `mt` with its `$ref`s planned from `scope`, and the
    /// plan of each `$ref`, in order (what its symbolic text spells).
    pub(in crate::compile) fn resolve_math(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        mt: &MathText,
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        self.resolve_tokens(ar, t, scope, &mt.toks, &mt.macros)
    }

    /// `toks` with each placeholder the plan of its `$ref` in `macros`,
    /// planned from `scope`; and the plans.
    fn resolve_tokens(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        toks: &[Token],
        macros: &[NodeId],
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        let _s = crate::trace::tally("resolve math");
        let mut plans = Vec::with_capacity(macros.len());
        for &m in macros {
            let p = self.plan_ref(ar, t, scope, m)?;
            // A text cell holds a string id, which is not a number: refused
            // here where the plan reaches an element; a path past an
            // interface name is refused by the type pass (ADR 0032).
            let is_text = crate::trace::tally("is text").run(|| self.ref_is_text(ar, t, p));
            if is_text {
                return Err(Error::Unsupported(format!(
                    "a text value (${}) inside math",
                    self.dast.macro_display(m)
                )));
            }
            plans.push(p);
        }
        let mut next = plans.iter();
        let toks = toks
            .iter()
            .map(|tok| match tok {
                Token::Cell(p) if *p == RefId::NONE => {
                    Token::Cell(*next.next().expect("a plan per placeholder"))
                }
                other => other.clone(),
            })
            .collect();
        Ok((toks, plans))
    }

    /// `mt` parsed as one expression, its `$ref`s planned from `scope`,
    /// its text kept for the symbolic engine in case it is symbolic.
    pub(in crate::compile) fn parse_math_text(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        mt: &MathText,
    ) -> Result<ExprId> {
        let (toks, plans) = self.resolve_math(ar, t, scope, mt)?;
        let text = SymText::Nodes {
            nodes: mt.nodes.clone(),
            plans: plans.into(),
        };
        let id = match self.parse_tokens(ar, &toks, mt.src()) {
            Ok(id) => id,
            // Text this parser does not read but the symbolic engine does,
            // with no reference in it (a relation: `4 < x <= 5`, `x = 2`,
            // `x in (0, 1)`): a value with no entries of its own, the
            // engine's text alone, a constant (ADR 0041, decision 8).
            Err(e) => {
                let constant = !toks.iter().any(|tok| matches!(tok, Token::Cell(_)))
                    && crate::sym::Engine::new().is_written(&text.spell(self.dast));
                if !constant {
                    return Err(e);
                }
                ar.arena.push(expr::Expr::Shape(Vec::new()))
            }
        };
        ar.sym_text.insert(id, text);
        Ok(id)
    }

    /// A `<math>`'s text parsed as the type outlining settled for it: one
    /// expression, or a tuple's entries.
    pub(in crate::compile) fn parse_math(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        component_type: ComponentType,
        mt: &MathText,
    ) -> Result<ParsedMath> {
        // The type that settles from its math text, not what it settled
        // as (a point, a tuple), is one expression.
        if matches!(component_type.def().settle, Some(Settle::FromMathText(_))) {
            return Ok(ParsedMath::Expr(self.parse_math_text(ar, t, scope, mt)?));
        }
        let (toks, _) = self.resolve_math(ar, t, scope, mt)?;
        let parts = expr::tuple_entries(&toks).expect("outlining settled a tuple");
        let entries = parts
            .iter()
            .map(|part| self.parse_tokens(ar, part, mt.src()))
            .collect::<Result<_>>()?;
        Ok(ParsedMath::Entries(entries))
    }

    /// Math text written as one interval, `[a, b)` (ADR 0049): its
    /// endpoints planned from `scope` and whether each end is closed.
    /// `None` when the text is not one interval of two endpoints (several
    /// intervals, a reference to one, anything else), which the planner
    /// warns about.
    pub(in crate::compile) fn plan_interval(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<Option<IntervalAttr>> {
        let d = self.dast;
        let (Some(&first), Some(&last)) = (nodes.first(), nodes.last()) else {
            return Ok(None);
        };
        if d.kind(first) != NodeKind::Text || d.kind(last) != NodeKind::Text {
            return Ok(None);
        }
        let opening = d.str(first).trim_start().chars().next();
        let closing = d.str(last).trim_end().chars().last();
        let (lo_closed, hi_closed) = match (opening, closing) {
            (Some(o @ ('[' | '(')), Some(c @ (']' | ')'))) => (o == '[', c == ']'),
            _ => return Ok(None),
        };
        // The text with the brackets taken off, `∞` spelled as a word.
        let mut toks = Vec::new();
        let mut macros = Vec::new();
        for (k, &n) in nodes.iter().enumerate() {
            match d.kind(n) {
                NodeKind::Text => {
                    let mut text = d.str(n);
                    if k == 0 {
                        text = &text.trim_start()[1..];
                    }
                    if k + 1 == nodes.len() {
                        let end = text.trim_end();
                        text = &end[..end.len() - 1];
                    }
                    let text = text.replace('\u{221e}', " infinity ");
                    if expr::tokenize(&text, &mut toks).is_err() {
                        return Ok(None);
                    }
                }
                NodeKind::Macro => {
                    macros.push(n);
                    toks.push(Token::Cell(RefId::NONE));
                }
                NodeKind::Element if self.is_presentation_child(n) => {}
                _ => return Ok(None),
            }
        }
        let (toks, _) = self.resolve_tokens(ar, t, scope, &toks, &macros)?;
        let [lo, hi] = &expr::split_top(&toks, &Token::Comma)[..] else {
            return Ok(None);
        };
        let src = MathSrc(nodes);
        let mut endpoint = |toks: &[Token]| -> Result<Source> {
            let infinite = |name: &str| {
                matches!(
                    name.to_ascii_lowercase().as_str(),
                    "infinity" | "inf" | "oo"
                )
            };
            Ok(match toks {
                [Token::Ident(name)] if infinite(name) => Source::constant(f64::INFINITY),
                [Token::Op('+'), Token::Ident(name)] if infinite(name) => {
                    Source::constant(f64::INFINITY)
                }
                [Token::Op('-'), Token::Ident(name)] if infinite(name) => {
                    Source::constant(f64::NEG_INFINITY)
                }
                _ => {
                    let id = self.parse_tokens(ar, toks, src)?;
                    self.plan_from_expr(ar, id)
                }
            })
        };
        Ok(Some(IntervalAttr {
            lo: endpoint(lo)?,
            hi: endpoint(hi)?,
            lo_closed,
            hi_closed,
        }))
    }

    /// Parse math tokens into the arena; `src` is for the error.
    pub(in crate::compile) fn parse_tokens(
        &self,
        ar: &mut Arenas,
        toks: &[Token],
        src: MathSrc<'_>,
    ) -> Result<ExprId> {
        let _s = crate::trace::tally("parse");
        Parser::parse(toks, &mut ar.arena).map_err(|reason| Error::BadMath {
            text: src.text(self.dast),
            reason,
        })
    }
}

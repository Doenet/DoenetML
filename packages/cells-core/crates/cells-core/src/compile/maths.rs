//! Math text, which three stages read: outlining tokenizes it (`math_text`)
//! to settle a `<math>`'s type, parsing parses it (`parse_math`), and
//! planners plan other elements' math from it.

use crate::compile::*;

impl Compiler<'_> {
    /// Tokenize math text with `$ref` children as cell leaves holding plan
    /// ids; with where the text came from, for an error.
    pub(in crate::compile) fn math_tokens<'n>(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &'n [NodeId],
    ) -> Result<(Vec<Token>, MathSrc<'n>)> {
        let (toks, macros) = self.tokenize_math(nodes)?;
        let (toks, _) = self.resolve_tokens(t, scope, &toks, &macros)?;
        Ok((toks, MathSrc(nodes)))
    }

    /// Math text tokenized: the one tokenizer of math text. Its `$ref`s
    /// are placeholders, planned by `resolve_math`, so tokenizing reads no
    /// other element and may run while outlining (a `<math>`'s, ADR 0029).
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
                    super::expr::tokenize(d.str(n), &mut toks).map_err(|reason| {
                        Error::BadMath {
                            // The text up to where tokenizing failed.
                            text: super::plan::spell_math(d, &nodes[..=i]),
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
                _ => {}
            }
        }
        Ok((toks, macros))
    }

    /// The tokens of `mt` with its `$ref`s planned from `scope`, and the
    /// plan of each `$ref`, in order (what its symbolic text spells).
    pub(in crate::compile) fn resolve_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        mt: &MathText,
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        self.resolve_tokens(t, scope, &mt.toks, &mt.macros)
    }

    /// `toks` with each placeholder the plan of its `$ref` in `macros`,
    /// planned from `scope`; and the plans.
    fn resolve_tokens(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        toks: &[Token],
        macros: &[NodeId],
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        let _s = crate::trace::tally("resolve math");
        let mut plans = Vec::with_capacity(macros.len());
        for &m in macros {
            // A substituted ref was planned elsewhere: its path is the DAST's.
            let substituted = self.ref_subst.contains_key(&m);
            let p = self.plan_ref(t, scope, m)?;
            // A text cell holds a string id, which is not a number.
            let is_text = crate::trace::tally("is text").run(|| {
                if substituted {
                    self.macro_is_text(t, scope, m)
                } else {
                    self.ref_is_text(t, p)
                }
            });
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
        &mut self,
        t: TemplateId,
        scope: ElemId,
        mt: &MathText,
    ) -> Result<ExprId> {
        let (toks, plans) = self.resolve_math(t, scope, mt)?;
        let id = self.parse_tokens(&toks, mt.src())?;
        self.compiled.sym_text.insert(
            id,
            SymText::Nodes {
                nodes: mt.nodes.clone(),
                plans: plans.into(),
            },
        );
        Ok(id)
    }

    /// A `<math>`'s text parsed (when parsing, ADR 0029) as the type outlining
    /// settled for it: one expression, or a tuple's entries.
    pub(in crate::compile) fn parse_math(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        component_type: ComponentType,
        mt: &MathText,
    ) -> Result<ParsedMath> {
        if component_type == ComponentType::Math {
            return Ok(ParsedMath::Expr(self.parse_math_text(t, scope, mt)?));
        }
        let (toks, _) = self.resolve_math(t, scope, mt)?;
        let parts = super::expr::tuple_entries(&toks).expect("outlining settled a tuple");
        let entries = parts
            .iter()
            .map(|part| self.parse_tokens(part, mt.src()))
            .collect::<Result<_>>()?;
        Ok(ParsedMath::Entries(entries))
    }

    /// Parse math tokens into the arena; `src` is for the error.
    pub(in crate::compile) fn parse_tokens(
        &mut self,
        toks: &[Token],
        src: MathSrc<'_>,
    ) -> Result<ExprId> {
        let _s = crate::trace::tally("parse");
        Parser::parse(toks, &mut self.compiled.arena).map_err(|reason| Error::BadMath {
            text: src.text(self.dast),
            reason,
        })
    }
}

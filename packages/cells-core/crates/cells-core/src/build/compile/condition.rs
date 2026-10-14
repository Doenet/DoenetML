//! Conditions: comparisons and boolean operators over math, planned as
//! hidden slots of an element. A `<case condition>` and a
//! `<conditionalContent condition>` plan theirs on the choice element; a
//! `<boolean>` plans its content on itself (`boolean.rs`).
//!
//! An operand that lowers to numeric operators (ADR 0005) is compared
//! numerically. One that does not (a free symbol, a function the lowering
//! does not know) is a symbolic math source: `=` and `!=` then compare the
//! two expressions in the engine, the way an `<answer>` does, and `<`, `>`
//! and a lone operand evaluate the expression to a number first.

use super::*;

/// How `=` compares two expressions that are not both numeric: as written
/// (`symbolicEquality`) or by value, after `post` on both sides.
#[derive(Debug, Clone, Copy)]
pub(in crate::build) struct Compare {
    pub(in crate::build) syntactic: bool,
    pub(in crate::build) post: Post,
}

impl Default for Compare {
    fn default() -> Self {
        Compare {
            syntactic: false,
            post: Post::None,
        }
    }
}

impl<'a> Compiler<'a> {
    /// A condition as hidden slots of element `e`; returns the slot holding
    /// 1 or 0. Comparisons (`< <= > >= = !=`), `and`/`&&`, `or`/`||`,
    /// `not`/`!`, parentheses, `true`, `false`, and math operands; a bare
    /// operand holds when it is nonzero.
    pub(in crate::build) fn plan_condition(
        &mut self,
        t: TemplateId,
        e: ElemId,
        plan: &mut ElemPlan,
        nodes: &[NodeId],
    ) -> Result<usize> {
        let (toks, text) = self.math_tokens(t, e, nodes)?;
        self.plan_condition_tokens(plan, &toks, &text, Compare::default())
    }

    /// A condition from tokens already made (`math_tokens`), with a say in
    /// how expressions compare.
    pub(in crate::build) fn plan_condition_tokens(
        &mut self,
        plan: &mut ElemPlan,
        toks: &[Token],
        text: &str,
        compare: Compare,
    ) -> Result<usize> {
        let mut p = CondParser {
            toks,
            pos: 0,
            text,
            compare,
        };
        let slot = p.or(self, plan)?;
        if p.pos != toks.len() {
            return Err(p.err(format!("unexpected {:?}", toks[p.pos])));
        }
        Ok(slot)
    }

    /// A symbolic math source from the engine's spelling of an operand
    /// (each `$ref` written `cellN<plan>`), as a hidden slot of `plan`.
    pub(in crate::build) fn sym_operand(
        &mut self,
        plan: &mut ElemPlan,
        sym: String,
        post: Post,
    ) -> usize {
        // The arena only needs an id to key the text by; the engine parses
        // the text itself when the element expands (`sym_source`).
        let id = self.compiled.arena.push(Expr::Sym(sym.clone()));
        self.compiled.sym_text.insert(id, sym);
        plan.hidden(SourcePlan::SymExpr(id, post))
    }
}

/// Recursive descent over a condition's tokens. Operands are math, planned
/// as hidden slots of the element.
struct CondParser<'t> {
    toks: &'t [Token],
    pos: usize,
    text: &'t str,
    compare: Compare,
}

/// One side of a comparison: the tokens it spans, and its plan when it
/// lowers to numeric operators (a constant is not state).
struct Operand {
    span: std::ops::Range<usize>,
    numeric: Option<SourcePlan>,
}

impl CondParser<'_> {
    fn err(&self, reason: String) -> Error {
        Error::BadMath {
            text: self.text.to_string(),
            reason,
        }
    }

    fn peek(&self, k: usize) -> Option<&Token> {
        self.toks.get(self.pos + k)
    }

    fn is_word(&self, w: &str) -> bool {
        matches!(self.peek(0), Some(Token::Ident(s)) if s == w)
    }

    fn is_op(&self, k: usize, c: char) -> bool {
        matches!(self.peek(k), Some(Token::Op(x)) if *x == c)
    }

    fn or(&mut self, cp: &mut Compiler, plan: &mut ElemPlan) -> Result<usize> {
        self.chain(cp, plan, "or", '|', OpSpec::Max, Self::and)
    }

    fn and(&mut self, cp: &mut Compiler, plan: &mut ElemPlan) -> Result<usize> {
        self.chain(cp, plan, "and", '&', OpSpec::Min, Self::not)
    }

    /// `next`s joined by `word`, `c` or `cc`, folded left with `op`.
    fn chain(
        &mut self,
        cp: &mut Compiler,
        plan: &mut ElemPlan,
        word: &str,
        c: char,
        op: OpSpec,
        next: fn(&mut Self, &mut Compiler, &mut ElemPlan) -> Result<usize>,
    ) -> Result<usize> {
        let mut lhs = next(self, cp, plan)?;
        loop {
            if self.is_word(word) {
                self.pos += 1;
            } else if self.is_op(0, c) {
                self.pos += if self.is_op(1, c) { 2 } else { 1 };
            } else {
                return Ok(lhs);
            }
            let rhs = next(self, cp, plan)?;
            lhs = plan.hidden(SourcePlan::computed(op, vec![lhs, rhs]));
        }
    }

    fn not(&mut self, cp: &mut Compiler, plan: &mut ElemPlan) -> Result<usize> {
        if self.is_word("not") || (self.is_op(0, '!') && !matches!(self.peek(1), Some(Token::Eq))) {
            self.pos += 1;
            let a = self.not(cp, plan)?;
            return Ok(plan.hidden(SourcePlan::computed(OpSpec::Not, vec![a])));
        }
        self.cmp(cp, plan)
    }

    /// A parenthesized condition, or a comparison of two operands, or a
    /// lone operand.
    fn cmp(&mut self, cp: &mut Compiler, plan: &mut ElemPlan) -> Result<usize> {
        if let Some(Token::LParen) = self.peek(0) {
            let close = self.matching(self.pos)?;
            if self.toks[self.pos + 1..close]
                .iter()
                .any(is_condition_token)
            {
                self.pos += 1;
                let inner = self.or(cp, plan)?;
                if self.pos != close {
                    return Err(self.err("missing ')'".into()));
                }
                self.pos += 1;
                return Ok(inner);
            }
        }
        let a = self.operand(cp)?;
        let rel = match (self.peek(0), self.peek(1)) {
            (Some(Token::Op('<')), Some(Token::Eq)) => Some(("<=", 2)),
            (Some(Token::Op('>')), Some(Token::Eq)) => Some((">=", 2)),
            (Some(Token::Op('!')), Some(Token::Eq)) => Some(("!=", 2)),
            (Some(Token::Eq), Some(Token::Eq)) => Some(("=", 2)),
            (Some(Token::Op('<')), _) => Some(("<", 1)),
            (Some(Token::Op('>')), _) => Some((">", 1)),
            (Some(Token::Eq), _) => Some(("=", 1)),
            _ => None,
        };
        let Some((rel, width)) = rel else {
            let a = self.number(cp, plan, &a);
            return Ok(plan.hidden(SourcePlan::computed(OpSpec::Truthy, vec![a])));
        };
        self.pos += width;
        let b = self.operand(cp)?;
        let equality = matches!(rel, "=" | "!=");
        // `=` between expressions compares them in the engine; every other
        // comparison is numeric, with an expression evaluated first.
        let in_engine = equality && (a.numeric.is_none() || b.numeric.is_none());
        let (a, b) = if in_engine {
            let post = self.compare.post;
            (
                self.symbolic(cp, plan, &a, post),
                self.symbolic(cp, plan, &b, post),
            )
        } else {
            (self.number(cp, plan, &a), self.number(cp, plan, &b))
        };
        let eq = if !in_engine {
            OpSpec::Eq
        } else if self.compare.syntactic {
            OpSpec::Sym(SymKind::EqualsSyntax)
        } else {
            OpSpec::Sym(SymKind::Equals)
        };
        Ok(match rel {
            "<" => plan.hidden(SourcePlan::computed(OpSpec::Lt, vec![a, b])),
            "<=" => plan.hidden(SourcePlan::computed(OpSpec::Le, vec![a, b])),
            ">" => plan.hidden(SourcePlan::computed(OpSpec::Lt, vec![b, a])),
            ">=" => plan.hidden(SourcePlan::computed(OpSpec::Le, vec![b, a])),
            "=" => plan.hidden(SourcePlan::computed(eq, vec![a, b])),
            _ => {
                let eq = plan.hidden(SourcePlan::computed(eq, vec![a, b]));
                plan.hidden(SourcePlan::computed(OpSpec::Not, vec![eq]))
            }
        })
    }

    /// Math up to the next comparison or connective outside parentheses.
    fn operand(&mut self, cp: &mut Compiler) -> Result<Operand> {
        let start = self.pos;
        let mut depth = 0i32;
        while let Some(t) = self.peek(0) {
            match t {
                Token::LParen => depth += 1,
                Token::RParen if depth == 0 => break,
                Token::RParen => depth -= 1,
                _ if depth == 0 && is_condition_token(t) => break,
                _ => {}
            }
            self.pos += 1;
        }
        let toks = &self.toks[start..self.pos];
        let numeric = match toks {
            [] => return Err(self.err("expected a value".into())),
            [Token::Ident(w)] if w.eq_ignore_ascii_case("true") => Some(SourcePlan::Fixed(1.0)),
            [Token::Ident(w)] if w.eq_ignore_ascii_case("false") => Some(SourcePlan::Fixed(0.0)),
            _ => match Parser::parse(toks, &mut cp.compiled.arena) {
                Ok(id) if cp.compiled.arena.is_numeric(id) => {
                    Some(match cp.compiled.arena.get(id) {
                        // A constant in a condition is not state.
                        Expr::Num(v) => SourcePlan::Fixed(*v),
                        Expr::Cell(p) => SourcePlan::reference(*p as RefId),
                        _ => SourcePlan::Math(id),
                    })
                }
                // A free symbol, or a function the lowering does not know
                // (`abs`, `cos`, `mod`): the engine's.
                _ => None,
            },
        };
        Ok(Operand {
            span: start..self.pos,
            numeric,
        })
    }

    /// The operand as a numeric slot: its lowered plan, else its
    /// expression evaluated (NaN with free symbols).
    fn number(&mut self, cp: &mut Compiler, plan: &mut ElemPlan, a: &Operand) -> usize {
        match &a.numeric {
            Some(p) => plan.hidden(p.clone()),
            None => {
                let h = self.symbolic(cp, plan, a, Post::None);
                plan.hidden(SourcePlan::computed(
                    OpSpec::Sym(SymKind::Evaluate),
                    vec![h],
                ))
            }
        }
    }

    /// The operand as a math cell.
    fn symbolic(
        &mut self,
        cp: &mut Compiler,
        plan: &mut ElemPlan,
        a: &Operand,
        post: Post,
    ) -> usize {
        cp.sym_operand(plan, render_tokens(&self.toks[a.span.clone()]), post)
    }

    fn matching(&self, open: usize) -> Result<usize> {
        let mut depth = 0i32;
        for (i, t) in self.toks.iter().enumerate().skip(open) {
            match t {
                Token::LParen => depth += 1,
                Token::RParen => {
                    depth -= 1;
                    if depth == 0 {
                        return Ok(i);
                    }
                }
                _ => {}
            }
        }
        Err(self.err("missing ')'".into()))
    }
}

/// Tokens that only appear in conditions, never in their math operands.
fn is_condition_token(t: &Token) -> bool {
    match t {
        Token::Eq => true,
        Token::Op(c) => matches!(c, '<' | '>' | '!' | '&' | '|'),
        Token::Ident(w) => matches!(w.as_str(), "and" | "or" | "not"),
        _ => false,
    }
}

/// Tokens back as math text for the engine, each `$ref` as its
/// `cellN<plan>` leaf. Tokens are separated by spaces, which the engine
/// reads as juxtaposition; `pi` goes back to its name so it stays exact.
fn render_tokens(toks: &[Token]) -> String {
    toks.iter()
        .map(|t| match t {
            Token::Num(v) if *v == std::f64::consts::PI => "pi".to_string(),
            Token::Num(v) => format!("{v}"),
            Token::Ident(s) => s.clone(),
            Token::Cell(p) => crate::sym::engine::leaf_name(*p, false),
            Token::Op(c) => c.to_string(),
            Token::LParen => "(".into(),
            Token::RParen => ")".into(),
            Token::Comma => ",".into(),
            Token::Eq => "=".into(),
        })
        .collect::<Vec<_>>()
        .join(" ")
}

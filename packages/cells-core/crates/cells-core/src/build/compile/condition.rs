//! Conditions of `<case>` and `<conditionalContent condition>`: comparisons
//! and boolean operators over numeric math, planned as hidden slots of the
//! choice element.

use super::*;

impl<'a> Compiler<'a> {
    /// A condition as hidden slots of element `e`; returns the slot holding
    /// 1 or 0. Comparisons (`< <= > >= = !=`), `and`/`&&`, `or`/`||`,
    /// `not`/`!`, parentheses, `true`, `false`, and numeric math operands;
    /// a bare operand holds when it is nonzero.
    pub(in crate::build) fn plan_condition(
        &mut self,
        t: TemplateId,
        e: ElemId,
        plan: &mut ElemPlan,
        nodes: &[NodeId],
    ) -> Result<usize> {
        let (toks, text) = self.math_tokens(t, e, nodes)?;
        let mut p = CondParser {
            toks: &toks,
            pos: 0,
            text: &text,
        };
        let slot = p.or(self, plan)?;
        if p.pos != toks.len() {
            return Err(p.err(format!("unexpected {:?}", toks[p.pos])));
        }
        Ok(slot)
    }
}

/// Recursive descent over a condition's tokens. Operands are numeric math,
/// planned as hidden slots of the choice element.
struct CondParser<'t> {
    toks: &'t [Token],
    pos: usize,
    text: &'t str,
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
        let a = self.operand(cp, plan)?;
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
            return Ok(plan.hidden(SourcePlan::computed(OpSpec::Truthy, vec![a])));
        };
        self.pos += width;
        let b = self.operand(cp, plan)?;
        Ok(match rel {
            "<" => plan.hidden(SourcePlan::computed(OpSpec::Lt, vec![a, b])),
            "<=" => plan.hidden(SourcePlan::computed(OpSpec::Le, vec![a, b])),
            ">" => plan.hidden(SourcePlan::computed(OpSpec::Lt, vec![b, a])),
            ">=" => plan.hidden(SourcePlan::computed(OpSpec::Le, vec![b, a])),
            "=" => plan.hidden(SourcePlan::computed(OpSpec::Eq, vec![a, b])),
            _ => {
                let eq = plan.hidden(SourcePlan::computed(OpSpec::Eq, vec![a, b]));
                plan.hidden(SourcePlan::computed(OpSpec::Not, vec![eq]))
            }
        })
    }

    /// Math up to the next comparison or connective outside parentheses.
    fn operand(&mut self, cp: &mut Compiler, plan: &mut ElemPlan) -> Result<usize> {
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
        let source = match toks {
            [] => return Err(self.err("expected a value".into())),
            [Token::Ident(w)] if w == "true" => SourcePlan::Fixed(1.0),
            [Token::Ident(w)] if w == "false" => SourcePlan::Fixed(0.0),
            _ => {
                let id = Parser::parse(toks, &mut cp.compiled.arena)
                    .map_err(|reason| self.err(reason))?;
                match cp.compiled.arena.get(id) {
                    // A constant in a condition is not state.
                    Expr::Num(v) => SourcePlan::Fixed(*v),
                    Expr::Cell(p) => SourcePlan::reference(*p as RefId),
                    _ => SourcePlan::Math(id),
                }
            }
        };
        Ok(plan.hidden(source))
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

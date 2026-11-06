//! Conditions: comparisons and boolean operators over math, planned as
//! hidden ports of an element.
//!
//! An operand that lowers to numeric operators is compared numerically.
//! One that does not is a symbolic math source: `=` and `!=` then compare
//! the two expressions in the engine, and `<`, `>` and a lone operand
//! evaluate the expression to a number first.

use crate::compile::*;

/// How `=` compares two expressions that are not both numeric: as written
/// (`symbolicEquality`) or by value, after `post` on both sides.
#[derive(Debug, Clone, Copy)]
pub(in crate::compile) struct Compare {
    pub(in crate::compile) syntactic: bool,
    pub(in crate::compile) post: Post,
}

impl Default for Compare {
    fn default() -> Self {
        Compare {
            syntactic: false,
            post: Post::None,
        }
    }
}

impl Compare {
    /// The equality in the engine: as written, or by value.
    pub(in crate::compile) fn equals(&self) -> SymKind {
        if self.syntactic {
            SymKind::EqualsSyntax
        } else {
            SymKind::Equals
        }
    }
}

/// Planning, conditions: comparisons and boolean operators over math, as hidden
/// ports of the element. Never reads another element's plan (ADR 0029).
impl<'a> Compiler<'a> {
    /// A condition as hidden ports of element `e`; returns the port holding
    /// 1 or 0. Comparisons (`< <= > >= = !=`), `and`/`&&`, `or`/`||`,
    /// `not`/`!`, parentheses, `true`, `false`, and math operands; a bare
    /// operand holds when it is nonzero.
    pub(in crate::compile) fn plan_condition(
        &mut self,
        t: TemplateId,
        e: ElemId,
        wiring: &mut ElemWiring,
        nodes: &[NodeId],
    ) -> Result<Port> {
        if let Some(port) = self.plan_text_condition(t, e, nodes, wiring)? {
            return Ok(port);
        }
        let (toks, src) =
            Reader::new(self.dast, &self.settled).math_tokens(&mut self.ar, t, e, nodes)?;
        self.plan_condition_tokens(wiring, &toks, src, Compare::default())
    }

    /// A condition over a text value: `$t = rain`, `rain != $t`, `$t = $ti`,
    /// one `=` or `!=` with a lone text reference or literal text on each
    /// side, planned as `Eq` on string ids. `None` when no text value is
    /// involved; any other use of one is refused.
    fn plan_text_condition(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
        wiring: &mut ElemWiring,
    ) -> Result<Option<Port>> {
        let d = self.dast;
        // Each reference spelled as a placeholder, so the sides can be split
        // on the text as written.
        let mut spelled = String::new();
        let mut refs = Vec::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => spelled.push_str(d.str(n)),
                NodeKind::Macro => {
                    spelled.push_str(&format!("\u{0}{}\u{0}", refs.len()));
                    refs.push(n);
                }
                _ => {}
            }
        }
        if !refs
            .iter()
            .any(|&m| self.rd().macro_reads_text(t, scope, m))
        {
            return Ok(None);
        }
        let refuse = |what: &str| {
            Error::Unsupported(format!(
                "{what}: a text value compares only as `$t = text`, `$t != text` or `$t = $u`"
            ))
        };
        let Some((lhs, rhs, negate)) = split_equality(&spelled) else {
            return Err(refuse(
                "a text value in a condition that is not one `=` or `!=`",
            ));
        };
        let mut side = |cp: &mut Self, s: &str| -> Result<Port> {
            let lone = s
                .strip_prefix('\u{0}')
                .and_then(|r| r.strip_suffix('\u{0}'))
                .and_then(|k| k.parse::<usize>().ok());
            match lone {
                Some(k) if cp.rd().macro_reads_text(t, scope, refs[k]) => {
                    let p = Reader::new(cp.dast, &cp.settled)
                        .plan_ref(&mut cp.ar, t, scope, refs[k])?;
                    Ok(wiring.hidden(Source::reference(p)))
                }
                Some(_) => Err(refuse("a text value compared with a number")),
                None if s.contains('\u{0}') => {
                    Err(refuse("a text value inside a larger expression"))
                }
                None => {
                    let id = cp.ar.intern_literal(cp.dast, s);
                    Ok(wiring.hidden(Source::constant(id.to_value())))
                }
            }
        };
        let a = side(self, &lhs)?;
        let b = side(self, &rhs)?;
        let eq = wiring.hidden(Source::computed(OpSpec::Eq, vec![a, b]));
        Ok(Some(if negate {
            wiring.hidden(Source::computed(OpSpec::Not, vec![eq]))
        } else {
            eq
        }))
    }

    /// A condition from tokens already made, with a say in
    /// how expressions compare.
    pub(in crate::compile) fn plan_condition_tokens(
        &mut self,
        wiring: &mut ElemWiring,
        toks: &[Token],
        src: MathSrc<'_>,
        compare: Compare,
    ) -> Result<Port> {
        let mut p = CondParser {
            toks,
            pos: 0,
            dast: self.dast,
            src,
            compare,
        };
        let port = p.or(self, wiring)?;
        if p.pos != toks.len() {
            return Err(p.err(format!("unexpected {:?}", toks[p.pos])));
        }
        Ok(port)
    }

    /// A condition from an element's content nodes (a `<boolean>`'s, a
    /// `<when>`'s) as hidden ports of `wiring`; returns the port holding 1 or
    /// 0. Text the numeric tokenizer cannot read (`%`, `'`, `_`) can still
    /// be one `=` between two expressions for the engine.
    pub(in crate::compile) fn plan_condition_content(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
        compare: Compare,
        wiring: &mut ElemWiring,
    ) -> Result<Port> {
        if let Some(port) = self.plan_text_condition(t, scope, nodes, wiring)? {
            return Ok(port);
        }
        match Reader::new(self.dast, &self.settled).math_tokens(&mut self.ar, t, scope, nodes) {
            Ok((toks, src)) => self.plan_condition_tokens(wiring, &toks, src, compare),
            Err(Error::BadMath { text, reason }) => {
                let sym = self.sym_spelling(t, scope, nodes)?;
                let Some((lhs, rhs, negate)) = split_equality(&sym) else {
                    return Err(Error::BadMath { text, reason });
                };
                let a = self.sym_operand(wiring, lhs, compare.post);
                let b = self.sym_operand(wiring, rhs, compare.post);
                let eq = wiring.hidden(Source::computed(OpSpec::Sym(compare.equals()), vec![a, b]));
                Ok(if negate {
                    wiring.hidden(Source::computed(OpSpec::Not, vec![eq]))
                } else {
                    eq
                })
            }
            Err(e) => Err(e),
        }
    }

    /// How `=` compares, from the first of `els` that gives each attribute
    /// (`symbolicEquality`, `simplifyOnCompare`, `expandOnCompare`): an
    /// award's say, then its answer's.
    pub(in crate::compile) fn compare_attrs(&self, els: &[NodeId]) -> Compare {
        let on = |name: &str| {
            els.iter()
                .find(|&&el| self.dast.attr(el, name).is_some())
                .is_some_and(|&el| self.rd().attr_on(el, name))
        };
        let syntactic = on("symbolicEquality");
        Compare {
            syntactic,
            post: match (syntactic, on("simplifyOnCompare"), on("expandOnCompare")) {
                (false, ..) | (true, false, false) => Post::None,
                (true, true, false) => Post::Simplify,
                (true, false, true) => Post::Expand,
                (true, true, true) => Post::SimplifyExpand,
            },
        }
    }

    /// The content as the engine spells it: text as written, each `$ref`
    /// as its `cellN<plan>` leaf.
    fn sym_spelling(&mut self, t: TemplateId, scope: ElemId, nodes: &[NodeId]) -> Result<String> {
        let d = self.dast;
        let mut sym = String::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => sym.push_str(d.str(n)),
                NodeKind::Macro => {
                    let p = Reader::new(self.dast, &self.settled).plan_ref(
                        &mut self.ar,
                        t,
                        scope,
                        n,
                    )?;
                    sym.push_str(&format!(
                        " {} ",
                        crate::sym::engine::leaf_name(p.get(), false)
                    ));
                }
                _ => {}
            }
        }
        Ok(sym)
    }

    /// A symbolic math source from the engine's spelling of an operand
    /// (each `$ref` written `cellN<plan>`), as a hidden port of `wiring`.
    pub(in crate::compile) fn sym_operand(
        &mut self,
        wiring: &mut ElemWiring,
        sym: String,
        post: Post,
    ) -> Port {
        // The arena only needs an id to key the text by; the engine parses
        // the text itself when the element expands (`sym_source`).
        let id = self.ar.arena.push(Expr::Sym(sym.clone()));
        self.ar.sym_text.insert(id, SymText::Spelled(sym));
        wiring.hidden(Source::sym_expr(id, post))
    }
}

/// Recursive descent over a condition's tokens. Operands are math, planned
/// as hidden ports of the element.
struct CondParser<'t> {
    toks: &'t [Token],
    pos: usize,
    dast: &'t Dast,
    src: MathSrc<'t>,
    compare: Compare,
}

/// One side of a comparison: the tokens it spans, and its source when it
/// lowers to numeric operators (a constant is not state).
struct Operand {
    span: std::ops::Range<usize>,
    numeric: Option<Source>,
}

impl CondParser<'_> {
    fn err(&self, reason: String) -> Error {
        Error::BadMath {
            text: self.src.text(self.dast),
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

    fn or(&mut self, cp: &mut Compiler, wiring: &mut ElemWiring) -> Result<Port> {
        self.chain(cp, wiring, "or", '|', OpSpec::Max, Self::and)
    }

    fn and(&mut self, cp: &mut Compiler, wiring: &mut ElemWiring) -> Result<Port> {
        self.chain(cp, wiring, "and", '&', OpSpec::Min, Self::not)
    }

    /// `next`s joined by `word`, `c` or `cc`, folded left with `op`.
    fn chain(
        &mut self,
        cp: &mut Compiler,
        wiring: &mut ElemWiring,
        word: &str,
        c: char,
        op: OpSpec,
        next: fn(&mut Self, &mut Compiler, &mut ElemWiring) -> Result<Port>,
    ) -> Result<Port> {
        let mut lhs = next(self, cp, wiring)?;
        loop {
            if self.is_word(word) {
                self.pos += 1;
            } else if self.is_op(0, c) {
                self.pos += if self.is_op(1, c) { 2 } else { 1 };
            } else {
                return Ok(lhs);
            }
            let rhs = next(self, cp, wiring)?;
            lhs = wiring.hidden(Source::computed(op, vec![lhs, rhs]));
        }
    }

    fn not(&mut self, cp: &mut Compiler, wiring: &mut ElemWiring) -> Result<Port> {
        if self.is_word("not") || (self.is_op(0, '!') && !matches!(self.peek(1), Some(Token::Eq))) {
            self.pos += 1;
            let a = self.not(cp, wiring)?;
            return Ok(wiring.hidden(Source::computed(OpSpec::Not, vec![a])));
        }
        self.cmp(cp, wiring)
    }

    /// A parenthesized condition, or a comparison of two operands, or a
    /// lone operand.
    fn cmp(&mut self, cp: &mut Compiler, wiring: &mut ElemWiring) -> Result<Port> {
        if let Some(Token::LParen) = self.peek(0) {
            let close = self.matching(self.pos)?;
            if self.toks[self.pos + 1..close]
                .iter()
                .any(is_condition_token)
            {
                self.pos += 1;
                let inner = self.or(cp, wiring)?;
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
            let a = self.number(cp, wiring, &a);
            return Ok(wiring.hidden(Source::computed(OpSpec::Truthy, vec![a])));
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
                self.symbolic(cp, wiring, &a, post),
                self.symbolic(cp, wiring, &b, post),
            )
        } else {
            (self.number(cp, wiring, &a), self.number(cp, wiring, &b))
        };
        let eq = if in_engine {
            OpSpec::Sym(self.compare.equals())
        } else {
            OpSpec::Eq
        };
        Ok(match rel {
            "<" => wiring.hidden(Source::computed(OpSpec::Lt, vec![a, b])),
            "<=" => wiring.hidden(Source::computed(OpSpec::Le, vec![a, b])),
            ">" => wiring.hidden(Source::computed(OpSpec::Lt, vec![b, a])),
            ">=" => wiring.hidden(Source::computed(OpSpec::Le, vec![b, a])),
            "=" => wiring.hidden(Source::computed(eq, vec![a, b])),
            _ => {
                let eq = wiring.hidden(Source::computed(eq, vec![a, b]));
                wiring.hidden(Source::computed(OpSpec::Not, vec![eq]))
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
            [Token::Ident(w)] if w.eq_ignore_ascii_case("true") => Some(Source::constant(1.0)),
            [Token::Ident(w)] if w.eq_ignore_ascii_case("false") => Some(Source::constant(0.0)),
            _ => match Parser::parse(toks, &mut cp.ar.arena) {
                Ok(id) if cp.ar.arena.is_numeric(id) => {
                    Some(match cp.ar.arena.get(id) {
                        // A constant in a condition is not state.
                        Expr::Num(v) => Source::constant(*v),
                        // A lone reference too, so expand checks it is a
                        // number; it lowers to an alias of the referent.
                        _ => Source::math(id),
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

    /// The operand as a numeric port: its lowered source, else its
    /// expression evaluated (NaN with free symbols).
    fn number(&mut self, cp: &mut Compiler, wiring: &mut ElemWiring, a: &Operand) -> Port {
        match &a.numeric {
            Some(p) => wiring.hidden(p.clone()),
            None => {
                let h = self.symbolic(cp, wiring, a, Post::None);
                wiring.hidden(Source::computed(OpSpec::Sym(SymKind::Evaluate), vec![h]))
            }
        }
    }

    /// The operand as a math cell.
    fn symbolic(
        &mut self,
        cp: &mut Compiler,
        wiring: &mut ElemWiring,
        a: &Operand,
        post: Post,
    ) -> Port {
        cp.sym_operand(wiring, render_tokens(&self.toks[a.span.clone()]), post)
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

/// `lhs = rhs` or `lhs != rhs` with exactly one equality outside brackets:
/// the two sides and whether it is negated.
fn split_equality(s: &str) -> Option<(String, String, bool)> {
    let chars: Vec<char> = s.chars().collect();
    let mut depth = 0i32;
    let mut found: Option<(usize, usize, bool)> = None;
    let mut i = 0;
    while i < chars.len() {
        match chars[i] {
            '(' | '[' | '{' => depth += 1,
            ')' | ']' | '}' => depth -= 1,
            '!' if depth == 0 && chars.get(i + 1) == Some(&'=') => {
                if found.is_some() {
                    return None;
                }
                found = Some((i, i + 2, true));
                i += 1;
            }
            '=' if depth == 0 => {
                if found.is_some() {
                    return None;
                }
                let width = if chars.get(i + 1) == Some(&'=') { 2 } else { 1 };
                found = Some((i, i + width, false));
                i += width - 1;
            }
            '<' | '>' if depth == 0 => return None,
            _ => {}
        }
        i += 1;
    }
    let (at, after, negate) = found?;
    let lhs: String = chars[..at].iter().collect();
    let rhs: String = chars[after..].iter().collect();
    (!lhs.trim().is_empty() && !rhs.trim().is_empty())
        .then(|| (lhs.trim().to_string(), rhs.trim().to_string(), negate))
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
            Token::Cell(p) => crate::sym::engine::leaf_name(p.get(), false),
            Token::Op(c) => c.to_string(),
            Token::LParen => "(".into(),
            Token::RParen => ")".into(),
            Token::Comma => ",".into(),
            Token::Eq => "=".into(),
        })
        .collect::<Vec<_>>()
        .join(" ")
}

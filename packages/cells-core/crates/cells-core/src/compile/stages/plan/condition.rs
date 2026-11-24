//! Conditions: comparisons and boolean operators over math, planned as
//! hidden ports of an element.
//!
//! An operand that lowers to numeric operators is compared numerically.
//! One that does not is a symbolic math source: `=` and `!=` then compare
//! the two expressions in the engine, and `<`, `>` and a lone operand
//! evaluate the expression to a number first.

use super::Planning;
use crate::compile::*;

/// How `=` compares two expressions that are not both numeric: as written
/// (`symbolicEquality`) or by value, after `post` on both sides, and how
/// values with entries match (`matchPartial`, `unorderedCompare`,
/// `matchByExactPositions`; ADR 0041, decision 7).
#[derive(Debug, Clone, Copy)]
pub(super) struct Compare {
    pub(super) syntactic: bool,
    pub(super) post: Post,
    /// Some entries matching gives a fraction (`matchPartial`).
    pub(super) partial: bool,
    /// Entries match in any order (`unorderedCompare`).
    pub(super) unordered: bool,
    /// Entries match only where they stand (`matchByExactPositions`).
    pub(super) exact_positions: bool,
}

impl Default for Compare {
    fn default() -> Self {
        Compare {
            syntactic: false,
            post: Post::None,
            partial: false,
            unordered: false,
            exact_positions: false,
        }
    }
}

impl Compare {
    /// As the engine's options.
    pub(super) fn opts(&self) -> crate::sym::CompareOpts {
        crate::sym::CompareOpts {
            unordered: self.unordered,
            partial: self.partial,
            exact_positions: self.exact_positions,
            syntactic: self.syntactic,
        }
    }

    /// The equality in the engine: as written, or by value, and how
    /// entries match when that is asked.
    pub(super) fn equals(&self) -> SymKind {
        if self.partial || self.unordered || self.exact_positions {
            SymKind::Compare {
                opts: crate::sym::CompareOpts {
                    unordered: self.unordered,
                    partial: self.partial,
                    exact_positions: self.exact_positions,
                    syntactic: self.syntactic,
                },
            }
        } else if self.syntactic {
            SymKind::EqualsSyntax
        } else {
            SymKind::Equals
        }
    }
}

/// Planning, conditions: comparisons and boolean operators over math, as hidden
/// ports of the element. Never reads another element's plan (ADR 0029).
impl<'a> Planning<'a> {
    /// A condition as hidden ports of element `e`; returns the port holding
    /// 1 or 0. Comparisons (`< <= > >= = !=`), `and`/`&&`, `or`/`||`,
    /// `not`/`!`, parentheses, `true`, `false`, and math operands; a bare
    /// operand holds when it is nonzero.
    pub(super) fn plan_condition(
        &mut self,
        t: TemplateId,
        e: ElemId,
        wiring: &mut ElemWiring,
        nodes: &[NodeId],
    ) -> Result<Port> {
        if let Some(port) = self.plan_text_condition(t, e, nodes, wiring)? {
            return Ok(port);
        }
        let (toks, src) = self.condition_tokens(t, e, nodes)?;
        let kinds = self.ref_kinds(t, &toks);
        self.plan_condition_tokens(wiring, &toks, src, Compare::default(), kinds)
    }

    /// `math_tokens` for a condition, where a boolean may be read.
    fn condition_tokens<'n>(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        nodes: &'n [NodeId],
    ) -> Result<(Vec<Token>, MathSrc<'n>)> {
        let was = std::mem::replace(&mut self.ar.booleans_in_math, true);
        let r = self.rd.math_tokens(&mut self.ar, t, scope, nodes);
        self.ar.booleans_in_math = was;
        r
    }

    /// What each reference among `toks` reads, where the templates tell.
    fn ref_kinds(&self, t: TemplateId, toks: &[Token]) -> Vec<RefKind> {
        toks.iter()
            .filter_map(|tok| match tok {
                Token::Cell(p) => Some(*p),
                _ => None,
            })
            .filter_map(|p| {
                Some(RefKind {
                    p,
                    kind: self.rd.ref_value_kind(&self.ar, t, p)?,
                    node: self.ar.refs[p.index()].node,
                })
            })
            .collect()
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
        let d = self.rd.dast;
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
        if !refs.iter().any(|&m| self.rd.macro_reads_text(t, scope, m)) {
            return Ok(None);
        }
        let refuse = |what: &str| {
            Error::Unsupported(format!(
                "{what}: a text value compares only as `$t = text`, `$t != text` or `$t = $u`"
            ))
        };
        let Some((lhs, rhs, negate)) = split_equality(&spelled) else {
            let lone = spelled
                .trim()
                .strip_prefix('\u{0}')
                .and_then(|r| r.strip_suffix('\u{0}'))
                .and_then(|k| k.parse::<usize>().ok());
            // A text alone is not true or false (D68): a type mix.
            if let Some(k) = lone {
                let display = d.macro_display(refs[k]);
                let message = not_a_boolean(&display, ValueKind::Text);
                return Ok(Some(wiring.hidden(self.ar.type_mix(refs[k], &message))));
            }
            // A text ordered against a value can never hold (D58): a type
            // mix, warned as one.
            if spelled.contains(['<', '>']) {
                let m = refs
                    .iter()
                    .copied()
                    .find(|&m| self.rd.macro_reads_text(t, scope, m))
                    .expect("a text reference among them");
                let message = format!(
                    "`${}` is a text: ordering it with `<` or `>` can never hold. Compare it with `=`, or order a number",
                    d.macro_display(m)
                );
                self.ar.warn(m, "cells-type-mix-order", &message);
                let missing = Source::constant(crate::program::MISSING);
                return Ok(Some(wiring.hidden(missing)));
            }
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
                Some(k) if cp.rd.macro_reads_text(t, scope, refs[k]) => {
                    let p = cp.rd.plan_ref(&mut cp.ar, t, scope, refs[k])?;
                    Ok(wiring.hidden(Source::reference(p)))
                }
                Some(_) => Err(refuse("a text value compared with a number")),
                None if s.contains('\u{0}') => {
                    Err(refuse("a text value inside a larger expression"))
                }
                None => {
                    let id = cp.ar.intern_literal(cp.rd.dast, s);
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
    pub(super) fn plan_condition_tokens(
        &mut self,
        wiring: &mut ElemWiring,
        toks: &[Token],
        src: MathSrc<'_>,
        compare: Compare,
        kinds: Vec<RefKind>,
    ) -> Result<Port> {
        let mut p = CondParser {
            toks,
            pos: 0,
            dast: self.rd.dast,
            src,
            compare,
            unordered: Vec::new(),
            kinds,
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
    pub(super) fn plan_condition_content(
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
        match self.condition_tokens(t, scope, nodes) {
            Ok((toks, src)) => {
                let unordered = self.unordered_refs(t, &toks);
                let kinds = self.ref_kinds(t, &toks);
                let mut p = CondParser {
                    toks: &toks,
                    pos: 0,
                    dast: self.rd.dast,
                    src,
                    compare,
                    unordered,
                    kinds,
                };
                let port = p.or(self, wiring)?;
                if p.pos != toks.len() {
                    return Err(p.err(format!("unexpected {:?}", toks[p.pos])));
                }
                Ok(port)
            }
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
    pub(super) fn compare_attrs(&self, els: &[NodeId]) -> Compare {
        let on = |name: &str| {
            els.iter()
                .find(|&&el| self.rd.dast.attr(el, name).is_some())
                .is_some_and(|&el| self.rd.attr_on(el, name))
        };
        let syntactic = on("symbolicEquality");
        Compare {
            syntactic,
            partial: on("matchPartial"),
            unordered: on("unorderedCompare"),
            exact_positions: on("matchByExactPositions"),
            post: match (syntactic, on("simplifyOnCompare"), on("expandOnCompare")) {
                (false, ..) | (true, false, false) => Post::None,
                (true, true, false) => Post::Simplify,
                (true, false, true) => Post::Expand,
                (true, true, true) => Post::SimplifyExpand,
            },
        }
    }

    /// The references among `toks` that name a math written `unordered`:
    /// a comparison with one of them alone on a side matches entries in
    /// any order (ADR 0041, decision 7: the flag is the comparison's, read
    /// from the source, never the value's).
    fn unordered_refs(&self, t: TemplateId, toks: &[Token]) -> Vec<RefId> {
        toks.iter()
            .filter_map(|tok| match tok {
                Token::Cell(p) => Some(*p),
                _ => None,
            })
            .filter(|&p| {
                self.rd
                    .static_target(&self.ar, t, p)
                    .is_some_and(|(tt, e)| {
                        let node = self.rd.referent_row(tt, e).node;
                        node != NodeId::NONE && self.rd.attr_on(node, "unordered")
                    })
            })
            .collect()
    }

    /// The content as the engine spells it: text as written, each `$ref`
    /// as its `cellN<plan>` leaf.
    fn sym_spelling(&mut self, t: TemplateId, scope: ElemId, nodes: &[NodeId]) -> Result<String> {
        let d = self.rd.dast;
        let mut sym = String::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => sym.push_str(d.str(n)),
                NodeKind::Macro => {
                    let p = self.rd.plan_ref(&mut self.ar, t, scope, n)?;
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
    pub(super) fn sym_operand(&mut self, wiring: &mut ElemWiring, sym: String, post: Post) -> Port {
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
    /// References to a math written `unordered` (`Planning::unordered_refs`).
    unordered: Vec<RefId>,
    /// What each reference reads, where the templates tell
    /// (`Planning::ref_kinds`): a boolean, or a value that is not one.
    kinds: Vec<RefKind>,
}

/// What a reference in a condition reads, and where it is written.
#[derive(Debug, Clone, Copy)]
pub(super) struct RefKind {
    p: RefId,
    kind: ValueKind,
    node: NodeId,
}

/// One side of a comparison: the tokens it spans, and its source when it
/// lowers to numeric operators (a constant is not state).
struct Operand {
    span: std::ops::Range<usize>,
    numeric: Option<Source>,
}

impl CondParser<'_> {
    /// What reference `p` reads, where the templates tell, and its node.
    fn kind_of(&self, p: RefId) -> Option<RefKind> {
        self.kinds.iter().find(|k| k.p == p).copied()
    }

    /// The node of the boolean reference operand `a` is alone, if it is one.
    fn boolean_ref(&self, a: &Operand) -> Option<NodeId> {
        match &self.toks[a.span.clone()] {
            [Token::Cell(p)] => self
                .kind_of(*p)
                .filter(|k| k.kind == ValueKind::Boolean)
                .map(|k| k.node),
            _ => None,
        }
    }

    /// Where and why operand `a` is not true or false, when it is surely
    /// a value of another type: a reference to a number, a math or a text
    /// alone, or a literal number (D47 decision 4, D68).
    fn not_boolean(&self, a: &Operand) -> Option<(NodeId, String)> {
        match &self.toks[a.span.clone()] {
            [Token::Cell(p)] => {
                let k = self.kind_of(*p)?;
                match k.kind {
                    ValueKind::Number | ValueKind::Math | ValueKind::Text | ValueKind::Point => {
                        let display = self.dast.macro_display(k.node);
                        Some((k.node, not_a_boolean(&display, k.kind)))
                    }
                    ValueKind::Boolean | ValueKind::List => None,
                }
            }
            [Token::Num(v)] => self.src.0.first().map(|&n| {
                (
                    n,
                    format!("`{v}` is a number, not true or false: write `true` or `false`"),
                )
            }),
            _ => None,
        }
    }

    /// The node of a boolean reference read as a number inside a larger
    /// operand (`$b + 1`), a type mix (D47).
    fn boolean_in_arithmetic(&self, a: &Operand) -> Option<NodeId> {
        let toks = &self.toks[a.span.clone()];
        if toks.len() < 2 {
            return None;
        }
        toks.iter().find_map(|tok| match tok {
            Token::Cell(p) => self
                .kind_of(*p)
                .filter(|k| k.kind == ValueKind::Boolean)
                .map(|k| k.node),
            _ => None,
        })
    }

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

    fn or(&mut self, cp: &mut Planning, wiring: &mut ElemWiring) -> Result<Port> {
        self.chain(cp, wiring, "or", '|', OpSpec::Max, Self::and)
    }

    fn and(&mut self, cp: &mut Planning, wiring: &mut ElemWiring) -> Result<Port> {
        self.chain(cp, wiring, "and", '&', OpSpec::Min, Self::not)
    }

    /// `next`s joined by `word`, `c` or `cc`, folded left with `op`.
    fn chain(
        &mut self,
        cp: &mut Planning,
        wiring: &mut ElemWiring,
        word: &str,
        c: char,
        op: OpSpec,
        next: fn(&mut Self, &mut Planning, &mut ElemWiring) -> Result<Port>,
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

    fn not(&mut self, cp: &mut Planning, wiring: &mut ElemWiring) -> Result<Port> {
        if self.is_word("not") || (self.is_op(0, '!') && !matches!(self.peek(1), Some(Token::Eq))) {
            self.pos += 1;
            let a = self.not(cp, wiring)?;
            return Ok(wiring.hidden(Source::computed(OpSpec::Not, vec![a])));
        }
        self.cmp(cp, wiring)
    }

    /// A parenthesized condition, or a comparison of two operands, or a
    /// lone operand.
    fn cmp(&mut self, cp: &mut Planning, wiring: &mut ElemWiring) -> Result<Port> {
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
            // A lone operand holds only when it is a boolean: a number, a
            // math or a text is a type mix (D47 decision 4, D68).
            if let Some(mix) = self.not_boolean(&a) {
                return Ok(wiring.hidden(cp.ar.type_mix(mix.0, &mix.1)));
            }
            if let Some(m) = self.boolean_in_arithmetic(&a) {
                let message = boolean_as_number(&self.dast.macro_display(m));
                return Ok(wiring.hidden(cp.ar.type_mix(m, &message)));
            }
            let a = self.number(cp, wiring, &a);
            return Ok(wiring.hidden(Source::computed(OpSpec::Truthy, vec![a])));
        };
        self.pos += width;
        let b = self.operand(cp)?;
        // A boolean compared with a number, `$b = 1`, is a type mix (D47).
        if let Some(m) = self
            .boolean_in_arithmetic(&a)
            .or_else(|| self.boolean_in_arithmetic(&b))
        {
            let message = boolean_as_number(&self.dast.macro_display(m));
            return Ok(wiring.hidden(cp.ar.type_mix(m, &message)));
        }
        let mix = match (self.boolean_ref(&a), self.boolean_ref(&b)) {
            (Some(m), None) if self.not_boolean(&b).is_some() => Some(m),
            (None, Some(m)) if self.not_boolean(&a).is_some() => Some(m),
            _ => None,
        };
        if let Some(m) = mix {
            let display = self.dast.macro_display(m);
            let message = boolean_as_number(&display);
            return Ok(wiring.hidden(cp.ar.type_mix(m, &message)));
        }
        // A side that is one reference to a math written `unordered` makes
        // the comparison unordered.
        let alone_unordered = |o: &Operand| matches!(&self.toks[o.span.clone()], [Token::Cell(p)] if self.unordered.contains(p));
        let unordered = alone_unordered(&a) || alone_unordered(&b);
        let (a_op, b_op) = (
            Operand {
                span: a.span.clone(),
                numeric: a.numeric.clone(),
            },
            Operand {
                span: b.span.clone(),
                numeric: b.numeric.clone(),
            },
        );
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
        let mut compare = self.compare;
        compare.unordered |= unordered;
        // Two numeric operands with a reference among them, `$a = $b`, may
        // stand for expressions, which the type pass tells: compared in
        // the engine if one does, else as numbers (`Flow::ValueOf`).
        if equality
            && !in_engine
            && let Some(pair) = self.pair_expr(cp, &a_op, &b_op)
        {
            let by_engine =
                wiring.hidden(Source::math_handle(pair, Post::ComparePair(compare.opts())));
            let by_number = wiring.hidden(Source::computed(OpSpec::Eq, vec![a, b]));
            let eq = wiring.hidden(Source::value_of(by_engine, by_number));
            return Ok(match rel {
                "=" => eq,
                _ => wiring.hidden(Source::computed(OpSpec::Not, vec![eq])),
            });
        }
        let eq = if in_engine {
            OpSpec::Sym(compare.equals())
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

    /// Two numeric operands as one pair of math text for the engine, `((a),
    /// (b))`, over their expressions: `None` unless a reference is among
    /// them.
    fn pair_expr(&self, cp: &mut Planning, a: &Operand, b: &Operand) -> Option<ExprId> {
        let ar = &mut cp.ar;
        let mut id = |s: &Option<Source>| match s {
            Some(Source::Flow(Flow::Math(id))) => Some(*id),
            Some(Source::Leaf(Leaf::Const(v))) => Some(ar.arena.push(Expr::Num(*v))),
            _ => None,
        };
        let (ia, ib) = (id(&a.numeric)?, id(&b.numeric)?);
        let mut leaves = Vec::new();
        ar.arena.cell_leaves(ia, &mut leaves);
        ar.arena.cell_leaves(ib, &mut leaves);
        if leaves.is_empty() {
            return None;
        }
        let spell = |o: &Operand| render_tokens(&self.toks[o.span.clone()]);
        let text = format!("(({}), ({}))", spell(a), spell(b));
        let pair = ar.arena.push(Expr::Operator(vec![ia, ib]));
        ar.sym_text.insert(pair, SymText::Spelled(text));
        Some(pair)
    }

    /// Math up to the next comparison or connective outside parentheses.
    fn operand(&mut self, cp: &mut Planning) -> Result<Operand> {
        let start = self.pos;
        let mut depth = 0i32;
        while let Some(t) = self.peek(0) {
            match t {
                t if t.opens() => depth += 1,
                t if t.closes() && depth == 0 => break,
                t if t.closes() => depth -= 1,
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
    fn number(&mut self, cp: &mut Planning, wiring: &mut ElemWiring, a: &Operand) -> Port {
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
        cp: &mut Planning,
        wiring: &mut ElemWiring,
        a: &Operand,
        post: Post,
    ) -> Port {
        cp.sym_operand(wiring, render_tokens(&self.toks[a.span.clone()]), post)
    }

    fn matching(&self, open: usize) -> Result<usize> {
        let mut depth = 0i32;
        for (i, t) in self.toks.iter().enumerate().skip(open) {
            if t.opens() {
                depth += 1;
            } else if t.closes() {
                depth -= 1;
                if depth == 0 {
                    return Ok(i);
                }
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
            Token::Open(c) | Token::Close(c) => c.to_string(),
        })
        .collect::<Vec<_>>()
        .join(" ")
}

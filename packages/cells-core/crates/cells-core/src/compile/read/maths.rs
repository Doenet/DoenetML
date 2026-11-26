//! Math text: tokenizing it, planning its `$ref`s and parsing it.

use crate::compile::*;

/// Reading the source, math text: tokenized, its `$ref`s planned, parsed. Run
/// by outlining (tokenizing), parsing, and the planners that read math
/// themselves; writes only the reference and expression arenas.
impl SourceReader<'_> {
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
            read: None,
        })
    }

    /// A `<math>`'s own text, as [`Self::math_text`], read as `read` says
    /// (ADR 0083): a run of text the tokenizer does not read is one
    /// [`Token::Opaque`], for the engine to read when the math is parsed.
    pub(in crate::compile) fn own_math_text(
        &self,
        nodes: &[NodeId],
        read: MathRead,
    ) -> Result<MathText> {
        let (toks, macros) = self.tokenize_math_as(nodes, true)?;
        Ok(MathText {
            toks,
            macros,
            nodes: nodes.into(),
            read: Some(read),
        })
    }

    /// The tokens of `nodes`, each `$ref` a placeholder, and the `$ref`
    /// nodes in order.
    fn tokenize_math(&self, nodes: &[NodeId]) -> Result<(Vec<Token>, Vec<NodeId>)> {
        self.tokenize_math_as(nodes, false)
    }

    /// [`Self::tokenize_math`]; a run of text the tokenizer does not read
    /// is one [`Token::Opaque`] when `lenient`, else an error.
    fn tokenize_math_as(
        &self,
        nodes: &[NodeId],
        lenient: bool,
    ) -> Result<(Vec<Token>, Vec<NodeId>)> {
        let _s = crate::trace::tally("math text");
        let d = self.dast;
        let mut toks = Vec::new();
        let mut macros = Vec::new();
        for (i, &n) in nodes.iter().enumerate() {
            match d.kind(n) {
                NodeKind::Text => {
                    let mut run = Vec::new();
                    match expr::tokenize(d.str(n), &mut run) {
                        Ok(()) => toks.append(&mut run),
                        Err(reason) if lenient => toks.push(Token::Opaque(reason)),
                        Err(reason) => {
                            return Err(Error::BadMath {
                                // The text up to where tokenizing failed.
                                text: spell_math(d, &nodes[..=i]),
                                reason,
                            });
                        }
                    }
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
                // An evaluation, as a function macro `$$f(x)` is read: a
                // placeholder, its function's formula at its inputs once
                // planned (`inline_evaluation`, ADR 0088).
                NodeKind::Element if d.str(n) == "evaluate" => {
                    macros.push(n);
                    toks.push(Token::Cell(RefId::NONE));
                }
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
    /// planned from `scope`, or the formula an evaluation there inlines
    /// (ADR 0088); and the plans, in the order the tokens read them.
    fn resolve_tokens(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        toks: &[Token],
        macros: &[NodeId],
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        self.resolve_tokens_at(ar, t, scope, toks, macros, 0)
    }

    /// [`Self::resolve_tokens`], `depth` evaluations deep.
    fn resolve_tokens_at(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        toks: &[Token],
        macros: &[NodeId],
        depth: u32,
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        let _s = crate::trace::tally("resolve math");
        let mut plans = Vec::with_capacity(macros.len());
        let mut pieces: Vec<Vec<Token>> = Vec::with_capacity(macros.len());
        for &m in macros {
            if self.dast.kind(m) == NodeKind::Element {
                let (inlined, read) = self.inline_evaluation(ar, t, scope, m, depth)?;
                plans.extend(read);
                pieces.push(inlined);
                continue;
            }
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
            // A boolean read as a number is a type mix, unless a
            // condition or `convertBoolean` reads it (D47).
            let p = if !ar.booleans_in_math
                && self.ref_value_kind(ar, t, p) == Some(ValueKind::Boolean)
            {
                let display = self.dast.macro_display(m);
                ar.mix_ref(p, &boolean_as_number(&display))
            } else {
                p
            };
            plans.push(p);
            pieces.push(vec![Token::Cell(p)]);
        }
        let mut next = pieces.into_iter();
        let mut out = Vec::with_capacity(toks.len());
        for tok in toks {
            match tok {
                Token::Cell(p) if *p == RefId::NONE => {
                    out.extend(next.next().expect("a plan per placeholder"));
                }
                other => out.push(other.clone()),
            }
        }
        Ok((out, plans))
    }

    /// Evaluation `ev` (an `<evaluate>`, as a function macro `$$f(a, b)`
    /// is read) in math text planned from `scope`, inlined (ADR 0088): the
    /// formula of the `<function>` it names, read where the function
    /// sits, its references rebased to here, each of its variables
    /// replaced by the input in its place, all in parentheses; and the
    /// plans the tokens read. Only a plain formula is inlined: a
    /// `<function>` of literal variables with no domain, not interpolated,
    /// symbolic, whose formula reads numbers alone (a math it read could
    /// hold its variable). Anything else is refused, as the evaluation
    /// would have to be a leaf of the expression.
    fn inline_evaluation(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        ev: NodeId,
        depth: u32,
    ) -> Result<(Vec<Token>, Vec<RefId>)> {
        let d = self.dast;
        let refuse = |why: String| {
            Error::Unsupported(format!(
                "an evaluation inside math (`$$f(x)`, an <evaluate>) {why}: name an \
                 <evaluate> and write its value as a reference"
            ))
        };
        // A condition reads no element (COMP-1).
        if ar.booleans_in_math {
            return Err(refuse("inside a condition".into()));
        }
        if depth >= MAX_INLINED_DEPTH {
            return Err(refuse(format!(
                "nested more than {MAX_INLINED_DEPTH} deep, or of a function that evaluates itself"
            )));
        }
        if let Some(a) = d
            .attrs(ev)
            .find(|&a| !matches!(d.attr_name(a), "function" | "input"))
        {
            return Err(refuse(format!("with '{}'", d.attr_name(a))));
        }
        let m = d
            .attr(ev, "function")
            .and_then(|a| self.single_macro(a))
            .ok_or_else(|| refuse("naming no function".into()))?;
        let path = self.plan_ref(ar, t, scope, m)?;
        let named = format!("${}", d.macro_display(m));
        let not_plain = |what: &str| refuse(format!("of {named}, {what}"));
        let (ft, fe) = match self.static_target(ar, t, path) {
            Some(target) if ar.refs[path.index()].prop.is_none() => target,
            _ => return Err(not_plain("which names no <function> by name")),
        };
        let row = &self.outlined(ft).elems[fe.index()];
        let fnode = row.node;
        if !row.component_type.plays(Role::Function)
            || !row.planned_as.plays(Role::Function)
            || row.cloned
            || fnode == NodeId::NONE
        {
            return Err(not_plain("which is no <function> written with a formula"));
        }
        for name in NOT_PLAIN_ATTRS {
            if d.attr_peek(fnode, name).is_some() {
                return Err(not_plain(&format!("a function with '{name}'")));
            }
        }
        if let Some(a) = d.attr_peek(fnode, "symbolic") {
            let text = self.attr_text(a);
            if !text.is_some_and(|s| matches!(s.trim().to_ascii_lowercase().as_str(), "" | "true"))
            {
                return Err(not_plain("a function not symbolic"));
            }
        }
        // Its variables as written, else `x`.
        let vars: Vec<String> = match d
            .attr_peek(fnode, "variables")
            .or_else(|| d.attr_peek(fnode, "variable"))
        {
            Some(a) => self
                .attr_text(a)
                .ok_or_else(|| not_plain("whose variables are a reference"))?
                .split(|c: char| c.is_whitespace() || c == ',')
                .filter(|v| !v.is_empty())
                .map(str::to_string)
                .collect(),
            None => vec!["x".into()],
        };
        if vars.is_empty() {
            return Err(not_plain("with no variable"));
        }
        // Its formula, read where it sits.
        let nodes: Vec<NodeId> = d
            .children(fnode)
            .iter()
            .copied()
            .filter(|&n| !self.is_not_content(n))
            .collect();
        if nodes.is_empty() {
            return Err(not_plain("which has no formula"));
        }
        let (ftoks, fmacros) = self.tokenize_math(&nodes)?;
        let (ftoks, fplans) = self.resolve_tokens_at(ar, ft, fe, &ftoks, &fmacros, depth + 1)?;
        for &p in &fplans {
            if self.ref_value_kind(ar, ft, p) != Some(ValueKind::Number) {
                return Err(not_plain(&format!(
                    "whose formula reads {}, which is no number",
                    ar.ref_display(d, p)
                )));
            }
        }
        // A name the engine would split into letters, one a variable.
        if let Some(name) = ftoks.iter().find_map(|tok| match tok {
            Token::Ident(name)
                if !vars.contains(name)
                    && expr::Func::named(name).is_none()
                    && vars.iter().any(|v| name.contains(v.as_str())) =>
            {
                Some(name.clone())
            }
            _ => None,
        }) {
            return Err(not_plain(&format!(
                "whose formula writes '{name}', which holds a variable's letters"
            )));
        }
        // Its references as read from here.
        let rebased = ar.refs[path.index()].hops > 0;
        let ftoks: Vec<Token> = ftoks
            .into_iter()
            .map(|tok| match tok {
                Token::Cell(p) if rebased => Token::Cell(self.rebase_ref(ar, path, 0, p)),
                other => other,
            })
            .collect();
        // Its inputs, each one expression.
        let a = d
            .attr(ev, "input")
            .ok_or_else(|| refuse(format!("of {named} at no input")))?;
        let entries =
            self.evaluation_inputs(ar, t, scope, d.attr_children(a), vars.len(), depth)?;
        if entries.len() != vars.len() {
            return Err(refuse(format!(
                "of {named} at {} inputs, where it takes {}",
                entries.len(),
                vars.len()
            )));
        }
        let mut out = vec![Token::LParen];
        for tok in ftoks {
            match &tok {
                Token::Ident(name) if vars.contains(name) => {
                    let k = vars.iter().position(|v| v == name).expect("a variable");
                    out.push(Token::LParen);
                    out.extend(entries[k].iter().cloned());
                    out.push(Token::RParen);
                }
                _ => out.push(tok),
            }
        }
        out.push(Token::RParen);
        let plans = out
            .iter()
            .filter_map(|tok| match tok {
                Token::Cell(p) => Some(*p),
                _ => None,
            })
            .collect();
        Ok((out, plans))
    }

    /// The inputs an evaluation inlined in math writes (`nodes`, its
    /// `input`), planned from `scope`: split at its top-level commas (a
    /// function macro writes `input="a, b"`), else, for a function of
    /// several variables, at its top-level spaces (`input="x 0 1"`), as
    /// an `<evaluate>` reads its entries (ADR 0081); one tuple spread over
    /// the variables. Each entry is its tokens, planned.
    fn evaluation_inputs(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
        n_vars: usize,
        depth: u32,
    ) -> Result<Vec<Vec<Token>>> {
        let d = self.dast;
        let mut entries = split_input(d, nodes, false);
        if entries.len() == 1 && n_vars > 1 {
            let spaced = split_input(d, nodes, true);
            if spaced.len() == n_vars {
                entries = spaced;
            }
        }
        let mut out = Vec::with_capacity(entries.len());
        for entry in entries {
            let mut toks = Vec::new();
            let mut macros = Vec::new();
            for item in entry {
                match item {
                    InputItem::Text(text) => {
                        expr::tokenize(&text, &mut toks).map_err(|reason| Error::BadMath {
                            text: text.clone(),
                            reason,
                        })?;
                    }
                    InputItem::Node(n) => {
                        macros.push(n);
                        toks.push(Token::Cell(RefId::NONE));
                    }
                }
            }
            let (toks, _) = self.resolve_tokens_at(ar, t, scope, &toks, &macros, depth + 1)?;
            out.push(toks);
        }
        // One tuple over several variables is spread over them.
        if let [one] = &out[..]
            && n_vars > 1
            && let Some(parts) = expr::tuple_entries(one)
            && parts.len() == n_vars
        {
            return Ok(parts);
        }
        Ok(out)
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
        let opts = mt.read.as_ref().and_then(|r| r.opts.clone());
        // Text holding an evaluation is its inlined tokens (ADR 0088),
        // spelled for the engine as the compile reads them.
        if mt
            .macros
            .iter()
            .any(|&m| self.dast.kind(m) == NodeKind::Element)
        {
            if opts.is_some() {
                return Err(Error::Unsupported(
                    "an evaluation inside math read with `format`, `splitSymbols` or \
                     `functionSymbols`"
                        .into(),
                ));
            }
            let id = self.parse_tokens(ar, &toks, mt.src())?;
            ar.sym_text.insert(id, SymText::Spelled(spelled(&toks)));
            return Ok(id);
        }
        let latex = opts.as_ref().is_some_and(|o| o.latex);
        let constant = plans.is_empty();
        let text = SymText::Nodes {
            nodes: mt.nodes.clone(),
            plans: plans.clone().into(),
            opts: opts.clone().map(Box::new),
        };
        let parsed = self.parse_tokens(ar, &toks, mt.src());
        let id = match parsed {
            // Text read with options other than the default is the
            // engine's to read, but for a number as written (ADR 0083).
            Ok(id) if opts.is_none() || matches!(ar.arena.get(id), expr::Expr::Num(_)) => id,
            // Text this parser does not read but the symbolic engine does
            // (ADR 0041 decision 8, ADR 0083): a relation, `4 < x <= 5`; a
            // `<math>`'s own text, `\frac{x}{z}` as LaTeX, `x^()` with the
            // blank for its missing operand, with references in it but
            // for LaTeX, which spells none. Its leaves are its references.
            parsed => {
                let mut engine = crate::sym::Engine::new();
                let spelled = text.spell(self.dast);
                // A call to a function the engine does not read (`clamp`)
                // that does not parse is the author's error, not the
                // engine's text.
                let numeric_call = toks.windows(2).any(|w| {
                    matches!(&w[0], Token::Ident(f)
                        if expr::Func::named(f).is_some_and(|f| !f.engine_reads()))
                        && w[1] == Token::LParen
                });
                let reads = match mt.read {
                    Some(_) => {
                        !(latex && !constant)
                            && !numeric_call
                            && engine.reads(&spelled, text.opts(), constant)
                    }
                    None => constant && engine.is_written(&spelled),
                };
                if !reads {
                    return Err(match parsed {
                        Err(e) if !latex => e,
                        _ => Error::BadMath {
                            text: mt.src().text(self.dast),
                            reason: if constant {
                                "the LaTeX does not parse".into()
                            } else {
                                "LaTeX math holding a reference".into()
                            },
                        },
                    });
                }
                let leaves = plans
                    .iter()
                    .map(|&p| ar.arena.push(expr::Expr::Cell(p)))
                    .collect();
                ar.arena.push(expr::Expr::Written(leaves))
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

    /// Math text written as intervals, `[a, b)` (ADR 0049), one after
    /// another (`(-4, 2] [1, 3)`, a domain per variable, ADR 0081): each
    /// one's endpoints planned from `scope` and whether each end is
    /// closed. `None` when the text is not such intervals of two endpoints
    /// each (a reference to one, anything else), which the planner warns
    /// about.
    pub(in crate::compile) fn plan_intervals(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<Option<Vec<IntervalAttr>>> {
        let d = self.dast;
        // The text as tokens, `∞` spelled as a word, its brackets kept.
        let mut toks = Vec::new();
        let mut macros = Vec::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => {
                    let text = d.str(n).replace('\u{221e}', " infinity ");
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
        // Each interval: an opening bracket, its text, and the bracket that
        // closes it, which need not match (`[1, 2)`).
        let mut groups: Vec<(bool, &[Token], bool)> = Vec::new();
        let mut i = 0;
        while i < toks.len() {
            let lo_closed = match &toks[i] {
                Token::LParen => false,
                Token::Open('[') => true,
                _ => return Ok(None),
            };
            let start = i + 1;
            let mut depth = 0usize;
            let mut end = None;
            for (j, tok) in toks.iter().enumerate().skip(i) {
                if tok.opens() {
                    depth += 1;
                } else if tok.closes() {
                    depth -= 1;
                    if depth == 0 {
                        end = Some(j);
                        break;
                    }
                }
            }
            let Some(end) = end else {
                return Ok(None);
            };
            let hi_closed = match &toks[end] {
                Token::RParen => false,
                Token::Close(']') => true,
                _ => return Ok(None),
            };
            groups.push((lo_closed, &toks[start..end], hi_closed));
            i = end + 1;
        }
        if groups.is_empty() {
            return Ok(None);
        }
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
                    // Its text for the engine, for a reader that keeps it
                    // as written (ADR 0043) and evaluates it.
                    ar.sym_text.insert(id, SymText::Spelled(spelled(toks)));
                    self.plan_from_expr(ar, id)
                }
            })
        };
        let mut out = Vec::with_capacity(groups.len());
        for (lo_closed, inner, hi_closed) in groups {
            let [lo, hi] = &expr::split_top(inner, &Token::Comma)[..] else {
                return Ok(None);
            };
            out.push(IntervalAttr {
                lo: endpoint(lo)?,
                hi: endpoint(hi)?,
                lo_closed,
                hi_closed,
            });
        }
        Ok(Some(out))
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

/// The warning for boolean `$display` read as a number (D47).
pub(in crate::compile) fn boolean_as_number(display: &str) -> String {
    format!(
        "`${display}` is true or false, not a number. To count it as 1 or 0, write `<number convertBoolean>${display}</number>`"
    )
}

/// The warning for `$display`, a value of another type, read as true or
/// false (D47, D68), suggesting the comparison meant.
pub(in crate::compile) fn not_a_boolean(display: &str, kind: ValueKind) -> String {
    let (what, test) = match kind {
        ValueKind::Text => ("a text", format!("${display} = true")),
        _ => ("a number", format!("${display} != 0")),
    };
    format!(
        "`${display}` is {what}, not true or false. To test it, write a comparison such as `{test}`"
    )
}

/// Math tokens spelled as text the engine parses: a cell leaf by its leaf
/// name, `pi` by name, a call's parenthesis glued to its name.
pub(in crate::compile) fn spelled(toks: &[Token]) -> String {
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
            // Only a `<math>`'s own text holds one (ADR 0083), which is
            // never spelled from its tokens.
            Token::Opaque(_) => text.push('\u{ff3f}'),
        }
    }
    text
}

/// How deep evaluations inlined in math may nest (ADR 0088): a function
/// that evaluates itself is refused at this depth.
const MAX_INLINED_DEPTH: u32 = 8;

/// The attributes that make a `<function>` other than a plain formula an
/// evaluation in math inlines (ADR 0088): a domain, interpolation, a
/// count of inputs or outputs, an extend.
const NOT_PLAIN_ATTRS: [&str; 10] = [
    "domain",
    "through",
    "minima",
    "maxima",
    "extrema",
    "throughSlopes",
    "numInputs",
    "numOutputs",
    "extend",
    "copy",
];

/// One piece of an evaluation's input: text, or a reference or element.
enum InputItem {
    Text(String),
    Node(NodeId),
}

/// An evaluation's input `nodes` split at its top-level commas, or, with
/// `spaces`, at its top-level white space too: each entry its pieces.
fn split_input(d: &Dast, nodes: &[NodeId], spaces: bool) -> Vec<Vec<InputItem>> {
    let mut entries: Vec<Vec<InputItem>> = vec![Vec::new()];
    let mut text = String::new();
    let mut depth = 0i32;
    let flush = |text: &mut String, entries: &mut Vec<Vec<InputItem>>| {
        if !text.trim().is_empty() {
            entries
                .last_mut()
                .expect("an entry")
                .push(InputItem::Text(std::mem::take(text)));
        }
        text.clear();
    };
    for &n in nodes {
        match d.kind(n) {
            NodeKind::Text => {
                for c in d.str(n).chars() {
                    match c {
                        '(' | '[' | '{' => depth += 1,
                        ')' | ']' | '}' => depth -= 1,
                        _ => {}
                    }
                    if depth <= 0 && (c == ',' || (spaces && c.is_whitespace())) {
                        flush(&mut text, &mut entries);
                        if !entries.last().expect("an entry").is_empty() {
                            entries.push(Vec::new());
                        }
                    } else {
                        text.push(c);
                    }
                }
            }
            NodeKind::Macro | NodeKind::Element => {
                flush(&mut text, &mut entries);
                entries
                    .last_mut()
                    .expect("an entry")
                    .push(InputItem::Node(n));
            }
            NodeKind::Other => {}
        }
    }
    flush(&mut text, &mut entries);
    entries.retain(|e| !e.is_empty());
    entries
}

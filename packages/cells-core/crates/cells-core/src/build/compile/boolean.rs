//! `<boolean>`: its `value` from its content. Literal content (`true`,
//! `false`, a number, nothing) is an essential 0/1 cell, since DoenetML's
//! boolean value is state (`<updateValue>` writes it). A lone `$ref`
//! aliases the referent. Anything else is a condition (`condition.rs`):
//! comparisons and connectives over numeric math, with `=` between
//! expressions compared in the engine under the compare attributes.

use super::condition::Compare;
use super::*;

impl<'a> Compiler<'a> {
    /// A `<boolean>` that extends another component aliases its value;
    /// otherwise its content is planned (`plan_boolean`).
    pub(super) fn plan_boolean_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        match self.compiled.templates[t].elems[e].extend {
            Some(p) => {
                // `<boolean extend="$bi"/>` shares the referent's value
                // whatever its type, so it is an alias, not an `Inherit`
                // (which expand would type-check).
                if self.compiled.refs[p].prop.is_none() {
                    self.compiled.refs[p].prop = Some("value".into());
                }
                let el = &mut self.compiled.templates[t].elems[e];
                el.extend = None;
                el.props = vec![SourcePlan::reference(p)];
                Ok(())
            }
            None => self.plan_boolean(t, e),
        }
    }

    fn plan_boolean(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.compiled.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let nodes: Vec<NodeId> = d
            .children(el)
            .iter()
            .copied()
            .filter(|&n| !self.is_blank(n))
            .collect();
        if let Some(&n) = nodes.iter().find(|&&n| d.kind(n) == NodeKind::Element) {
            return Err(Error::Unsupported(format!(
                "a <{}> inside a <boolean>",
                d.str(n)
            )));
        }
        let macros = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Macro)
            .count();
        let text: String = nodes
            .iter()
            .filter(|&&n| d.kind(n) == NodeKind::Text)
            .map(|&n| d.str(n))
            .collect();
        let text = text.trim();
        let mut plan = ElemPlan::new(1);
        // Literal content is state: `<boolean>false</boolean>` can be set.
        let literal = match (macros, text.to_ascii_lowercase().as_str()) {
            (0, "") => Some(0.0),
            (0, "true") => Some(1.0),
            (0, "false") => Some(0.0),
            // A number is true only when it is 1, as in the current core.
            (0, s) => s.parse::<f64>().ok().map(|v| f64::from(v == 1.0)),
            _ => None,
        };
        if let Some(v) = literal {
            plan.set_essential(0, "value", v);
            self.compiled.templates[t].elems[e].props = plan.finish();
            return Ok(());
        }
        if macros == 1 && text.is_empty() {
            let p = self.plan_ref(t, scope, nodes[0])?;
            self.compiled.templates[t].elems[e].props = vec![SourcePlan::reference(p)];
            return Ok(());
        }
        let compare = Compare {
            syntactic: self.attr_on(el, "symbolicEquality"),
            post: match (
                self.attr_on(el, "symbolicEquality"),
                self.attr_on(el, "simplifyOnCompare"),
                self.attr_on(el, "expandOnCompare"),
            ) {
                (false, ..) | (true, false, false) => Post::None,
                (true, true, false) => Post::Simplify,
                (true, false, true) => Post::Expand,
                (true, true, true) => Post::SimplifyExpand,
            },
        };
        let slot = match self.math_tokens(t, scope, &nodes) {
            Ok((toks, text)) => self.plan_condition_tokens(&mut plan, &toks, &text, compare)?,
            // Text the numeric tokenizer cannot read (`%`, `'`, `_`) can
            // still be one `=` between two expressions for the engine.
            Err(Error::BadMath { text, reason }) => {
                let sym = self.sym_spelling(t, scope, &nodes)?;
                let Some((lhs, rhs, negate)) = split_equality(&sym) else {
                    return Err(Error::BadMath { text, reason });
                };
                let a = self.sym_operand(&mut plan, lhs, compare.post);
                let b = self.sym_operand(&mut plan, rhs, compare.post);
                let eq = OpSpec::Sym(if compare.syntactic {
                    SymKind::EqualsSyntax
                } else {
                    SymKind::Equals
                });
                let eq = plan.hidden(SourcePlan::computed(eq, vec![a, b]));
                if negate {
                    plan.hidden(SourcePlan::computed(OpSpec::Not, vec![eq]))
                } else {
                    eq
                }
            }
            Err(e) => return Err(e),
        };
        plan.set(0, SourcePlan::own(slot));
        self.compiled.templates[t].elems[e].props = plan.finish();
        Ok(())
    }

    /// The content as the engine spells it: text as written, each `$ref`
    /// as its `cellN<plan>` leaf.
    fn sym_spelling(&mut self, t: TemplateId, scope: ElemId, nodes: &[NodeId]) -> Result<String> {
        let d = self.compiled.dast;
        let mut sym = String::new();
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => sym.push_str(d.str(n)),
                NodeKind::Macro => {
                    let p = self.plan_ref(t, scope, n)?;
                    sym.push_str(&format!(
                        " {} ",
                        crate::sym::engine::leaf_name(p as u32, false)
                    ));
                }
                _ => {}
            }
        }
        Ok(sym)
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

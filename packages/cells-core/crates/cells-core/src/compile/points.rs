//! Point lists: the points of an attribute such as a circle's `through`
//! or a polygon's `vertices` (bare references, tuples, and list props, one
//! point per item), and how many a list holds, known at compile time.

use super::*;

impl<'a> Compiler<'a> {
    /// The points of a point-list attribute: bare references, parenthesized
    /// tuples (which may contain references), and references to list props
    /// (`$l.points`), which contribute one point per item.
    pub(in crate::compile) fn plan_point_list(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        a: u32,
    ) -> Result<Vec<GivenPoint>> {
        let d = self.dast;
        let (toks, text) = self.math_tokens(t, scope, d.attr_children(a))?;
        let mut out = Vec::new();
        let mut i = 0;
        while i < toks.len() {
            match &toks[i] {
                Token::Cell(p) => {
                    let p = *p as RefId;
                    // A list prop expands to its items.
                    let items = self.array_items_of_plan(t, p)?;
                    match items {
                        Some(n) => out.extend((0..n).map(|k| GivenPoint::Item(p, k))),
                        None => out.push(GivenPoint::Ref(p)),
                    }
                    i += 1;
                }
                Token::LParen => {
                    let start = i;
                    let mut depth = 0i32;
                    loop {
                        match toks.get(i) {
                            Some(Token::LParen) => depth += 1,
                            Some(Token::RParen) => depth -= 1,
                            None => {
                                return Err(Error::BadMath {
                                    text,
                                    reason: "missing ')'".into(),
                                });
                            }
                            _ => {}
                        }
                        i += 1;
                        if depth == 0 {
                            break;
                        }
                    }
                    let inner = super::expr::unwrap_parens(&toks[start..i]).unwrap();
                    out.push(GivenPoint::Tuple(self.tuple_from_tokens(inner, &text)?));
                }
                Token::Comma => i += 1,
                // A symbol (`through="A"`) is not a point here: NaN, as the
                // current core's warning case.
                Token::Ident(_) => {
                    out.push(GivenPoint::Tuple([
                        Source::Fixed(f64::NAN),
                        Source::Fixed(f64::NAN),
                    ]));
                    i += 1;
                }
                other => {
                    return Err(Error::BadMath {
                        text,
                        reason: format!("unexpected {other:?} in a point list"),
                    });
                }
            }
        }
        Ok(out)
    }

    /// If plan `p` names a list prop, how many items it has (known at
    /// compile time from the referent element).
    pub(in crate::compile) fn array_items_of_plan(
        &self,
        t: TemplateId,
        p: RefId,
    ) -> Result<Option<usize>> {
        let plan = &self.compiled.refs[p];
        let Some(prop) = &plan.prop else {
            return Ok(None);
        };
        // Find the element the path ends at, if it is in this template chain.
        let mut cur_t = t;
        for _ in 0..plan.hops {
            cur_t = self.compiled.templates[cur_t].parent.unwrap().0;
        }
        let mut e = None;
        for step in &plan.steps {
            match step {
                Step::Elem(x) => e = Some(*x),
                Step::Index(_) | Step::Iface(..) => return Ok(None),
            }
        }
        let Some(e) = e else { return Ok(None) };
        let el = &self.compiled.templates[cur_t].elems[e];
        // A list holds the points given: a circle's up to three.
        if el.component_type.prop_at(prop) == Some(PropAt::List) {
            return Ok(Some(match el.component_type {
                ComponentType::Circle => self.count_points_in_attr(el.node, "through")?.min(3),
                _ => self.count_points_in_attr(el.node, "vertices")?,
            }));
        }
        let Some(items) = el.component_type.table_list(prop) else {
            return Ok(None);
        };
        Ok(Some(items.len()))
    }

    /// Points in a point-list attribute, counted from its text alone.
    pub(in crate::compile) fn count_points_in_attr(&self, el: NodeId, name: &str) -> Result<usize> {
        let d = self.dast;
        let Some(a) = (el != NONE).then(|| d.attr(el, name)).flatten() else {
            return Ok(0);
        };
        let mut n = 0;
        let mut depth = 0i32;
        for &node in d.attr_children(a) {
            match d.kind(node) {
                NodeKind::Macro if depth == 0 => n += 1,
                NodeKind::Text => {
                    for c in d.str(node).chars() {
                        match c {
                            '(' => {
                                if depth == 0 {
                                    n += 1;
                                }
                                depth += 1;
                            }
                            ')' => depth -= 1,
                            _ => {}
                        }
                    }
                }
                _ => {}
            }
        }
        Ok(n)
    }
}

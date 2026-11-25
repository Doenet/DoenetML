//! A point written as arithmetic over tuples and points (ADR 0083):
//! `(3,4) + 2(1,-1)`, `2$m - 3$P`, `($P + $Q)/2`. The current core
//! evaluates such math as a vector; here each coordinate is the same
//! arithmetic over the coordinates, scalars shared, lowered as any math.

use crate::compile::*;

/// What part of a point's text is: a scalar, or a pair of coordinates.
enum Part {
    Scalar(ExprId),
    Pair([ExprId; 2]),
}

/// Reading the source, a point as vector arithmetic.
impl SourceReader<'_> {
    /// The coordinates of math text `toks` that is arithmetic over pairs
    /// (`(a, b)`) and points (a reference to one): sums and differences of
    /// pairs, a pair times or over a scalar, a pair negated. `None` for text
    /// that is no such pair (a scalar, a product of pairs, a tuple of other
    /// than two entries).
    pub(in crate::compile) fn vector_point(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        toks: &[Token],
    ) -> Result<Option<[ExprId; 2]>> {
        let Ok(id) = Parser::parse(toks, &mut ar.arena) else {
            return Ok(None);
        };
        Ok(match self.part(ar, t, id)? {
            Some(Part::Pair(xy)) => Some(xy),
            _ => None,
        })
    }

    /// The points of a point list written as vector arithmetic
    /// (`vertices="2(2,-3)+(3,4) 3$P $P+2$m"`), its items the pieces
    /// between spaces outside any bracket pair, as the current core splits
    /// one; `None` when an item is no point of [`Self::vector_point`] or
    /// one reference.
    pub(in crate::compile) fn vector_point_list(
        &self,
        ar: &mut Arenas,
        t: TemplateId,
        nodes: &[NodeId],
        toks: &[Token],
    ) -> Result<Option<Vec<GivenPoint>>> {
        let Some(items) = self.items_between_spaces(nodes, toks) else {
            return Ok(None);
        };
        let mut out = Vec::with_capacity(items.len());
        for item in items {
            match item {
                [Token::Cell(p)] => out.push(GivenPoint::Ref(*p)),
                _ => match self.vector_point(ar, t, item)? {
                    Some([x, y]) => out.push(GivenPoint::Tuple([
                        self.plan_from_expr(ar, x),
                        self.plan_from_expr(ar, y),
                    ])),
                    None => return Ok(None),
                },
            }
        }
        Ok(Some(out))
    }

    /// `toks`, the tokens of `nodes`, split where the text has a space
    /// outside any bracket pair; `None` when the text does not tokenize
    /// to them.
    fn items_between_spaces<'t>(
        &self,
        nodes: &[NodeId],
        toks: &'t [Token],
    ) -> Option<Vec<&'t [Token]>> {
        let d = self.dast;
        let mut cuts = Vec::new();
        let (mut at, mut depth) = (0usize, 0i32);
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Text => {
                    let text = d.str(n);
                    let mut word = String::new();
                    let flush = |word: &mut String, at: &mut usize, depth: &mut i32| {
                        let mut run = Vec::new();
                        expr::tokenize(word, &mut run).ok()?;
                        for tok in &run {
                            if tok.opens() {
                                *depth += 1;
                            } else if tok.closes() {
                                *depth -= 1;
                            }
                        }
                        *at += run.len();
                        word.clear();
                        Some(())
                    };
                    for c in text.chars() {
                        if c.is_whitespace() {
                            flush(&mut word, &mut at, &mut depth)?;
                            if depth == 0 && at > 0 && cuts.last() != Some(&at) {
                                cuts.push(at);
                            }
                        } else {
                            word.push(c);
                        }
                    }
                    flush(&mut word, &mut at, &mut depth)?;
                }
                NodeKind::Macro => at += 1,
                _ => {}
            }
        }
        if at != toks.len() {
            return None;
        }
        let mut items = Vec::new();
        let mut start = 0;
        for cut in cuts.into_iter().chain([toks.len()]) {
            if cut > start {
                items.push(&toks[start..cut]);
            }
            start = cut;
        }
        Some(items)
    }

    /// Expression `id` as a scalar or a pair; `None` where it is neither
    /// (a pair where a scalar must be).
    fn part(&self, ar: &mut Arenas, t: TemplateId, id: ExprId) -> Result<Option<Part>> {
        use Part::{Pair, Scalar};
        let e = ar.arena.get(id).clone();
        let pair = |ar: &mut Arenas, x: Expr<RefId>, y: Expr<RefId>| {
            Pair([ar.arena.push(x), ar.arena.push(y)])
        };
        Ok(Some(match e {
            Expr::Num(_) | Expr::Sym(_) => Scalar(id),
            Expr::Cell(p) => {
                if self.ref_value_kind(ar, t, p) == Some(ValueKind::Point) {
                    let x = self.plan_with_prop(ar, t, p, "x")?;
                    let y = self.plan_with_prop(ar, t, p, "y")?;
                    pair(ar, Expr::Cell(x), Expr::Cell(y))
                } else {
                    Scalar(id)
                }
            }
            Expr::Shape(xs) => match xs[..] {
                [x, y] => match (self.part(ar, t, x)?, self.part(ar, t, y)?) {
                    (Some(Scalar(x)), Some(Scalar(y))) => Pair([x, y]),
                    _ => return Ok(None),
                },
                _ => return Ok(None),
            },
            Expr::Add(a, b) | Expr::Sub(a, b) => {
                match (self.part(ar, t, a)?, self.part(ar, t, b)?) {
                    (Some(Scalar(_)), Some(Scalar(_))) => Scalar(id),
                    (Some(Pair([ax, ay])), Some(Pair([bx, by]))) => {
                        pair(ar, e.with_operands(ax, bx), e.with_operands(ay, by))
                    }
                    _ => return Ok(None),
                }
            }
            Expr::Mul(a, b) => match (self.part(ar, t, a)?, self.part(ar, t, b)?) {
                (Some(Scalar(_)), Some(Scalar(_))) => Scalar(id),
                (Some(Scalar(s)), Some(Pair([x, y]))) | (Some(Pair([x, y])), Some(Scalar(s))) => {
                    pair(ar, Expr::Mul(s, x), Expr::Mul(s, y))
                }
                _ => return Ok(None),
            },
            Expr::Div(a, b) => match (self.part(ar, t, a)?, self.part(ar, t, b)?) {
                (Some(Scalar(_)), Some(Scalar(_))) => Scalar(id),
                (Some(Pair([x, y])), Some(Scalar(s))) => pair(ar, Expr::Div(x, s), Expr::Div(y, s)),
                _ => return Ok(None),
            },
            Expr::Neg(a) => match self.part(ar, t, a)? {
                Some(Scalar(_)) => Scalar(id),
                Some(Pair([x, y])) => pair(ar, Expr::Neg(x), Expr::Neg(y)),
                None => return Ok(None),
            },
            Expr::Pow(a, b) => match (self.part(ar, t, a)?, self.part(ar, t, b)?) {
                (Some(Scalar(_)), Some(Scalar(_))) => Scalar(id),
                _ => return Ok(None),
            },
            Expr::Call(_, args) => {
                for a in args {
                    if !matches!(self.part(ar, t, a)?, Some(Scalar(_))) {
                        return Ok(None);
                    }
                }
                Scalar(id)
            }
            Expr::Operator(_) | Expr::Written(_) => return Ok(None),
        }))
    }
}

//! Math text to [`Tree`]: `+ - * / ^`, unary minus, parentheses,
//! juxtaposition, and the functions in [`FUNCTIONS`]. A letter run that is
//! not a function name or `pi` is split into single-letter symbols, as
//! math-expressions does (`xy` is `x y`). `#12` is a placeholder the core's
//! builder writes for a `$ref` inside math text: a numeric cell leaf with
//! cell 12, which the builder rebinds once it knows what the reference names.

use crate::{FUNCTIONS, Tree};

#[derive(Debug, Clone, PartialEq)]
enum Tok {
    Num(f64),
    Ident(String),
    Func(String),
    Cell(u32),
    Op(char),
    LParen,
    RParen,
}

fn tokenize(text: &str) -> Result<Vec<Tok>, String> {
    let chars: Vec<char> = text.chars().collect();
    let mut out = Vec::new();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        if c.is_whitespace() {
            i += 1;
        } else if c.is_ascii_digit()
            || (c == '.' && chars.get(i + 1).is_some_and(|d| d.is_ascii_digit()))
        {
            let start = i;
            while i < chars.len() && (chars[i].is_ascii_digit() || chars[i] == '.') {
                i += 1;
            }
            let s: String = chars[start..i].iter().collect();
            out.push(Tok::Num(
                s.parse().map_err(|_| format!("bad number '{s}'"))?,
            ));
        } else if c.is_alphabetic() {
            let start = i;
            while i < chars.len() && chars[i].is_alphabetic() {
                i += 1;
            }
            let run: String = chars[start..i].iter().collect();
            split_letters(&run, &mut out);
        } else if c == '#' {
            let start = i + 1;
            i = start;
            while i < chars.len() && chars[i].is_ascii_digit() {
                i += 1;
            }
            let s: String = chars[start..i].iter().collect();
            out.push(Tok::Cell(
                s.parse().map_err(|_| format!("bad placeholder '#{s}'"))?,
            ));
        } else {
            out.push(match c {
                '+' | '-' | '*' | '/' | '^' => Tok::Op(c),
                '(' => Tok::LParen,
                ')' => Tok::RParen,
                other => return Err(format!("unexpected '{other}'")),
            });
            i += 1;
        }
    }
    Ok(out)
}

/// Split a letter run into function names, `pi`, and single letters,
/// taking the longest function name at each position.
fn split_letters(run: &str, out: &mut Vec<Tok>) {
    let mut rest = run;
    while !rest.is_empty() {
        if let Some(f) = FUNCTIONS
            .iter()
            .filter(|f| rest.starts_with(**f))
            .max_by_key(|f| f.len())
        {
            out.push(Tok::Func(f.to_string()));
            rest = &rest[f.len()..];
        } else if rest.starts_with("pi") {
            out.push(Tok::Ident("pi".into()));
            rest = &rest[2..];
        } else {
            let c = rest.chars().next().unwrap();
            out.push(Tok::Ident(c.to_string()));
            rest = &rest[c.len_utf8()..];
        }
    }
}

pub fn parse(text: &str) -> Result<Tree, String> {
    let toks = tokenize(text)?;
    if toks.is_empty() {
        return Err("empty expression".into());
    }
    let mut p = Parser {
        toks: &toks,
        pos: 0,
    };
    let t = p.expr()?;
    if p.pos != toks.len() {
        return Err(format!("unexpected {:?}", toks[p.pos]));
    }
    Ok(t)
}

struct Parser<'a> {
    toks: &'a [Tok],
    pos: usize,
}

impl Parser<'_> {
    fn peek(&self) -> Option<&Tok> {
        self.toks.get(self.pos)
    }

    fn expr(&mut self) -> Result<Tree, String> {
        let mut terms = vec![self.term()?];
        while let Some(Tok::Op(c @ ('+' | '-'))) = self.peek() {
            let c = *c;
            self.pos += 1;
            let t = self.term()?;
            terms.push(if c == '+' { t } else { Tree::Neg(Box::new(t)) });
        }
        Ok(if terms.len() == 1 {
            terms.pop().unwrap()
        } else {
            Tree::Add(terms)
        })
    }

    fn term(&mut self) -> Result<Tree, String> {
        let mut lhs = self.unary()?;
        loop {
            match self.peek() {
                Some(Tok::Op('*')) => {
                    self.pos += 1;
                    let rhs = self.unary()?;
                    lhs = mul(lhs, rhs);
                }
                Some(Tok::Op('/')) => {
                    self.pos += 1;
                    let rhs = self.unary()?;
                    lhs = Tree::Div(Box::new(lhs), Box::new(rhs));
                }
                Some(Tok::Num(_) | Tok::Ident(_) | Tok::Func(_) | Tok::Cell(_) | Tok::LParen) => {
                    let rhs = self.power()?;
                    lhs = mul(lhs, rhs);
                }
                _ => return Ok(lhs),
            }
        }
    }

    fn unary(&mut self) -> Result<Tree, String> {
        match self.peek() {
            Some(Tok::Op('-')) => {
                self.pos += 1;
                Ok(Tree::Neg(Box::new(self.unary()?)))
            }
            Some(Tok::Op('+')) => {
                self.pos += 1;
                self.unary()
            }
            _ => self.power(),
        }
    }

    fn power(&mut self) -> Result<Tree, String> {
        let base = self.atom()?;
        if let Some(Tok::Op('^')) = self.peek() {
            self.pos += 1;
            let exp = self.unary()?;
            return Ok(Tree::Pow(Box::new(base), Box::new(exp)));
        }
        Ok(base)
    }

    fn atom(&mut self) -> Result<Tree, String> {
        let t = self.peek().cloned().ok_or("unexpected end of expression")?;
        self.pos += 1;
        Ok(match t {
            Tok::Num(v) => Tree::Num(v),
            Tok::Ident(s) => Tree::Sym(s),
            Tok::Cell(c) => Tree::Cell {
                cell: c,
                math: false,
            },
            Tok::Func(f) => {
                // `sin(x)`, `sin x`, and `sin^2(x)`.
                let mut power = None;
                if let Some(Tok::Op('^')) = self.peek() {
                    self.pos += 1;
                    power = Some(self.atom()?);
                }
                // `sin(x)^2` squares the application, `sin x^2` the argument.
                let arg = if let Some(Tok::LParen) = self.peek() {
                    self.atom()?
                } else {
                    self.power()?
                };
                let app = Tree::Apply(f, Box::new(arg));
                match power {
                    Some(p) => Tree::Pow(Box::new(app), Box::new(p)),
                    None => app,
                }
            }
            Tok::LParen => {
                let e = self.expr()?;
                match self.peek() {
                    Some(Tok::RParen) => self.pos += 1,
                    _ => return Err("missing ')'".into()),
                }
                e
            }
            other => return Err(format!("unexpected {other:?}")),
        })
    }
}

fn mul(a: Tree, b: Tree) -> Tree {
    match a {
        Tree::Mul(mut v) => {
            v.push(b);
            Tree::Mul(v)
        }
        a => Tree::Mul(vec![a, b]),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn splits_letters_and_reads_functions() {
        let t = parse("2xy + sin(x)").unwrap();
        let Tree::Add(terms) = t else { panic!() };
        assert_eq!(
            terms[0],
            Tree::Mul(vec![
                Tree::Num(2.0),
                Tree::Sym("x".into()),
                Tree::Sym("y".into())
            ])
        );
        assert_eq!(
            terms[1],
            Tree::Apply("sin".into(), Box::new(Tree::Sym("x".into())))
        );
        assert!(parse("3 +").is_err());
        assert!(parse("(1").is_err());
    }

    #[test]
    fn placeholders_are_cell_leaves() {
        let t = parse("#3 x + sin(#12)").unwrap();
        let Tree::Add(terms) = t else { panic!() };
        assert_eq!(
            terms[0],
            Tree::Mul(vec![
                Tree::Cell {
                    cell: 3,
                    math: false
                },
                Tree::Sym("x".into())
            ])
        );
        assert_eq!(
            terms[1],
            Tree::Apply(
                "sin".into(),
                Box::new(Tree::Cell {
                    cell: 12,
                    math: false
                })
            )
        );
    }
}

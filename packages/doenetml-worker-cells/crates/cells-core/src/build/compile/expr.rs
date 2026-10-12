//! The parse arena: math text parsed at build time, cell
//! leaves holding plan ids or slots. It decides whether a math is numeric and
//! lowers it to operators (ADR 0005), and gives geometry its linear
//! coefficients. It is not used at tick time: a symbolic math becomes a math
//! cell in the document's symbolic engine (`cells-sym`, ADR 0008).

use crate::document::CellIdx;

pub type ExprId = u32;

#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    Num(f64),
    /// A free symbol such as `x`.
    Sym(String),
    /// A numeric leaf bound to a cell: `$a` inside a math.
    Cell(CellIdx),
    Add(ExprId, ExprId),
    Sub(ExprId, ExprId),
    Mul(ExprId, ExprId),
    Div(ExprId, ExprId),
    Pow(ExprId, ExprId),
    Neg(ExprId),
    /// `round(x)`, `min(a, b)`: a function the lowering knows. A clamp's
    /// bounds are always numbers (the parser checks).
    Call(Func, Vec<ExprId>),
}

/// The functions numeric math text can call, each lowered to its operator.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Func {
    Round,
    Floor,
    Min,
    Max,
    /// `clamp(x, lo, hi)`, with number bounds.
    Clamp,
}

impl Func {
    pub fn named(name: &str) -> Option<Func> {
        Some(match name {
            "round" => Func::Round,
            "floor" => Func::Floor,
            "min" => Func::Min,
            "max" => Func::Max,
            "clamp" => Func::Clamp,
            _ => return None,
        })
    }

    /// Whether `n` arguments are allowed: `min` and `max` take two or more.
    fn takes(self, n: usize) -> bool {
        match self {
            Func::Round | Func::Floor => n == 1,
            Func::Min | Func::Max => n >= 2,
            Func::Clamp => n == 3,
        }
    }

    /// The value over number arguments, as the operators compute it.
    fn eval(self, args: &[f64]) -> f64 {
        match self {
            Func::Round => args[0].round(),
            Func::Floor => args[0].floor(),
            Func::Min => args.iter().copied().reduce(f64::min).unwrap(),
            Func::Max => args.iter().copied().reduce(f64::max).unwrap(),
            Func::Clamp => args[0].clamp(args[1], args[2]),
        }
    }
}

impl Expr {
    /// The same binary operator over new operands.
    pub fn with_operands(&self, a: ExprId, b: ExprId) -> Expr {
        match self {
            Expr::Add(..) => Expr::Add(a, b),
            Expr::Sub(..) => Expr::Sub(a, b),
            Expr::Mul(..) => Expr::Mul(a, b),
            Expr::Div(..) => Expr::Div(a, b),
            Expr::Pow(..) => Expr::Pow(a, b),
            _ => unreachable!("not a binary operator: {self:?}"),
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct Arena {
    pub nodes: Vec<Expr>,
}

impl Arena {
    pub fn push(&mut self, e: Expr) -> ExprId {
        // Fold constants as they are built.
        let folded = match &e {
            Expr::Add(a, b) => self.fold2(*a, *b, |x, y| x + y),
            Expr::Sub(a, b) => self.fold2(*a, *b, |x, y| x - y),
            Expr::Mul(a, b) => self.fold2(*a, *b, |x, y| x * y),
            Expr::Div(a, b) => self.fold2(*a, *b, |x, y| x / y),
            Expr::Pow(a, b) => self.fold2(*a, *b, f64::powf),
            Expr::Neg(a) => match self.nodes[*a as usize] {
                Expr::Num(x) => Some(Expr::Num(-x)),
                _ => None,
            },
            Expr::Call(f, args) => args
                .iter()
                .map(|&a| match self.nodes[a as usize] {
                    Expr::Num(x) => Some(x),
                    _ => None,
                })
                .collect::<Option<Vec<f64>>>()
                .map(|xs| Expr::Num(f.eval(&xs))),
            _ => None,
        };
        self.nodes.push(folded.unwrap_or(e));
        (self.nodes.len() - 1) as ExprId
    }

    fn fold2(&self, a: ExprId, b: ExprId, f: impl Fn(f64, f64) -> f64) -> Option<Expr> {
        match (&self.nodes[a as usize], &self.nodes[b as usize]) {
            (Expr::Num(x), Expr::Num(y)) => Some(Expr::Num(f(*x, *y))),
            _ => None,
        }
    }

    pub fn get(&self, id: ExprId) -> &Expr {
        &self.nodes[id as usize]
    }

    /// Whether the expression has no free symbols, so it can be lowered to
    /// numeric operators at build time.
    pub fn is_numeric(&self, id: ExprId) -> bool {
        match self.get(id) {
            Expr::Num(_) | Expr::Cell(_) => true,
            Expr::Sym(_) => false,
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => self.is_numeric(*a) && self.is_numeric(*b),
            Expr::Neg(a) => self.is_numeric(*a),
            Expr::Call(_, args) => args.iter().all(|&a| self.is_numeric(a)),
        }
    }

    /// The free symbols, in first-appearance order.
    pub fn symbols(&self, id: ExprId, out: &mut Vec<String>) {
        match self.get(id) {
            Expr::Sym(s) => {
                if !out.contains(s) {
                    out.push(s.clone());
                }
            }
            Expr::Num(_) | Expr::Cell(_) => {}
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                self.symbols(*a, out);
                self.symbols(*b, out);
            }
            Expr::Neg(a) => self.symbols(*a, out),
            Expr::Call(_, args) => args.iter().for_each(|&a| self.symbols(a, out)),
        }
    }

    /// Distinct cell leaves, in first-appearance order.
    pub fn cell_leaves(&self, id: ExprId, out: &mut Vec<CellIdx>) {
        match self.get(id) {
            Expr::Cell(c) => {
                if !out.contains(c) {
                    out.push(*c);
                }
            }
            Expr::Num(_) | Expr::Sym(_) => {}
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => {
                self.cell_leaves(*a, out);
                self.cell_leaves(*b, out);
            }
            Expr::Neg(a) => self.cell_leaves(*a, out),
            Expr::Call(_, args) => args.iter().for_each(|&a| self.cell_leaves(a, out)),
        }
    }

    /// Whether the expression calls a function anywhere.
    pub fn has_call(&self, id: ExprId) -> bool {
        match self.get(id) {
            Expr::Num(_) | Expr::Sym(_) | Expr::Cell(_) => false,
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => self.has_call(*a) || self.has_call(*b),
            Expr::Neg(a) => self.has_call(*a),
            Expr::Call(..) => true,
        }
    }
}

/// A token of math text. References (`$a`) arrive already resolved to a
/// cell (or build slot) by the caller.
#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    Num(f64),
    Ident(String),
    Cell(CellIdx),
    Op(char),
    LParen,
    RParen,
    Comma,
    Eq,
}

/// Tokenize one run of text. Identifiers are maximal letter runs (`pi` is a
/// constant, `x`, `ab` are symbols); numbers are decimal literals.
pub fn tokenize(text: &str, out: &mut Vec<Token>) -> Result<(), String> {
    let chars: Vec<char> = text.chars().collect();
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
            if i < chars.len()
                && (chars[i] == 'e' || chars[i] == 'E')
                && chars
                    .get(i + 1)
                    .is_some_and(|d| d.is_ascii_digit() || *d == '-' || *d == '+')
            {
                i += 2;
                while i < chars.len() && chars[i].is_ascii_digit() {
                    i += 1;
                }
            }
            let s: String = chars[start..i].iter().collect();
            out.push(Token::Num(
                s.parse().map_err(|_| format!("bad number '{s}'"))?,
            ));
        } else if c.is_alphabetic() {
            let start = i;
            while i < chars.len() && chars[i].is_alphanumeric() {
                i += 1;
            }
            let s: String = chars[start..i].iter().collect();
            out.push(match s.as_str() {
                "pi" => Token::Num(std::f64::consts::PI),
                _ => Token::Ident(s),
            });
        } else {
            out.push(match c {
                '+' | '-' | '*' | '/' | '^' => Token::Op(c),
                // Only conditions use these; the math parser rejects them.
                '<' | '>' | '!' | '&' | '|' => Token::Op(c),
                '(' => Token::LParen,
                ')' => Token::RParen,
                ',' => Token::Comma,
                '=' => Token::Eq,
                other => return Err(format!("unexpected '{other}'")),
            });
            i += 1;
        }
    }
    Ok(())
}

/// Recursive-descent parser over tokens: `+ - * / ^`, unary minus,
/// parentheses, juxtaposition as multiplication (`3x`, `2(x+1)`), and calls
/// to the functions in [`Func`] (a function name not followed by `(` is a
/// symbol).
pub struct Parser<'a> {
    toks: &'a [Token],
    pos: usize,
    arena: &'a mut Arena,
}

impl<'a> Parser<'a> {
    pub fn parse(toks: &'a [Token], arena: &'a mut Arena) -> Result<ExprId, String> {
        let mut p = Parser {
            toks,
            pos: 0,
            arena,
        };
        let id = p.expr()?;
        if p.pos != p.toks.len() {
            return Err(format!("unexpected token {:?}", p.toks[p.pos]));
        }
        Ok(id)
    }

    fn peek(&self) -> Option<&Token> {
        self.toks.get(self.pos)
    }

    fn expr(&mut self) -> Result<ExprId, String> {
        let mut lhs = self.term()?;
        while let Some(Token::Op(c @ ('+' | '-'))) = self.peek() {
            let c = *c;
            self.pos += 1;
            let rhs = self.term()?;
            lhs = self.arena.push(if c == '+' {
                Expr::Add(lhs, rhs)
            } else {
                Expr::Sub(lhs, rhs)
            });
        }
        Ok(lhs)
    }

    fn term(&mut self) -> Result<ExprId, String> {
        let mut lhs = self.unary()?;
        loop {
            match self.peek() {
                Some(Token::Op(c @ ('*' | '/'))) => {
                    let c = *c;
                    self.pos += 1;
                    let rhs = self.unary()?;
                    lhs = self.arena.push(if c == '*' {
                        Expr::Mul(lhs, rhs)
                    } else {
                        Expr::Div(lhs, rhs)
                    });
                }
                // Juxtaposition: a factor directly followed by another.
                Some(Token::Num(_) | Token::Ident(_) | Token::Cell(_) | Token::LParen) => {
                    let rhs = self.power()?;
                    lhs = self.arena.push(Expr::Mul(lhs, rhs));
                }
                _ => return Ok(lhs),
            }
        }
    }

    fn unary(&mut self) -> Result<ExprId, String> {
        if let Some(Token::Op('-')) = self.peek() {
            self.pos += 1;
            let e = self.unary()?;
            return Ok(self.arena.push(Expr::Neg(e)));
        }
        if let Some(Token::Op('+')) = self.peek() {
            self.pos += 1;
            return self.unary();
        }
        self.power()
    }

    fn power(&mut self) -> Result<ExprId, String> {
        let base = self.atom()?;
        if let Some(Token::Op('^')) = self.peek() {
            self.pos += 1;
            let exp = self.unary()?;
            return Ok(self.arena.push(Expr::Pow(base, exp)));
        }
        Ok(base)
    }

    fn atom(&mut self) -> Result<ExprId, String> {
        let t = self
            .peek()
            .cloned()
            .ok_or_else(|| "unexpected end of expression".to_string())?;
        self.pos += 1;
        Ok(match t {
            Token::Num(v) => self.arena.push(Expr::Num(v)),
            Token::Ident(s) => match Func::named(&s) {
                Some(f) if self.peek() == Some(&Token::LParen) => {
                    self.pos += 1;
                    self.call(f, &s)?
                }
                _ => self.arena.push(Expr::Sym(s)),
            },
            Token::Cell(c) => self.arena.push(Expr::Cell(c)),
            Token::LParen => {
                let e = self.expr()?;
                match self.peek() {
                    Some(Token::RParen) => self.pos += 1,
                    _ => return Err("missing ')'".into()),
                }
                e
            }
            other => return Err(format!("unexpected token {other:?}")),
        })
    }

    /// A call's arguments, after its `(`.
    fn call(&mut self, f: Func, name: &str) -> Result<ExprId, String> {
        let mut args = vec![self.expr()?];
        loop {
            match self.peek() {
                Some(Token::Comma) => {
                    self.pos += 1;
                    args.push(self.expr()?);
                }
                Some(Token::RParen) => {
                    self.pos += 1;
                    break;
                }
                _ => return Err(format!("missing ')' after {name}(")),
            }
        }
        if !f.takes(args.len()) {
            return Err(format!("{name} does not take {} arguments", args.len()));
        }
        if f == Func::Clamp {
            let bound = |e: ExprId| match self.arena.get(e) {
                Expr::Num(v) if !v.is_nan() => Some(*v),
                _ => None,
            };
            match (bound(args[1]), bound(args[2])) {
                (Some(lo), Some(hi)) if lo <= hi => {}
                (Some(_), Some(_)) => return Err("clamp's lower bound is above its upper".into()),
                _ => return Err("clamp's bounds must be numbers".into()),
            }
        }
        Ok(self.arena.push(Expr::Call(f, args)))
    }
}

/// Split tokens at every `sep` that sits outside parentheses.
pub fn split_top(toks: &[Token], sep: &Token) -> Vec<Vec<Token>> {
    let mut out = vec![Vec::new()];
    let mut depth = 0i32;
    for t in toks {
        match t {
            Token::LParen => depth += 1,
            Token::RParen => depth -= 1,
            _ => {}
        }
        if depth == 0 && t == sep {
            out.push(Vec::new());
        } else {
            out.last_mut().unwrap().push(t.clone());
        }
    }
    out
}

/// Strip one pair of enclosing parentheses, if the whole token run is
/// wrapped in them.
pub fn unwrap_parens(toks: &[Token]) -> Option<&[Token]> {
    if toks.len() < 2 || toks[0] != Token::LParen || *toks.last().unwrap() != Token::RParen {
        return None;
    }
    let mut depth = 0i32;
    for (i, t) in toks.iter().enumerate() {
        match t {
            Token::LParen => depth += 1,
            Token::RParen => depth -= 1,
            _ => {}
        }
        if depth == 0 && i + 1 != toks.len() {
            return None;
        }
    }
    Some(&toks[1..toks.len() - 1])
}

/// Coefficients (of `vx`, of `vy`, constant) of an expression that is
/// linear in the two symbols, each as an expression over the remaining
/// leaves; `None` when it is not linear (a product of two variable terms,
/// a variable in a denominator or exponent, another free symbol).
pub fn linear_coeffs(arena: &mut Arena, id: ExprId, vx: &str, vy: &str) -> Option<[ExprId; 3]> {
    fn is_zero(a: &Arena, e: ExprId) -> bool {
        matches!(a.get(e), Expr::Num(v) if *v == 0.0)
    }
    fn is_one(a: &Arena, e: ExprId) -> bool {
        matches!(a.get(e), Expr::Num(v) if *v == 1.0)
    }
    fn add(a: &mut Arena, x: ExprId, y: ExprId) -> ExprId {
        if is_zero(a, x) {
            y
        } else if is_zero(a, y) {
            x
        } else {
            a.push(Expr::Add(x, y))
        }
    }
    fn sub(a: &mut Arena, x: ExprId, y: ExprId) -> ExprId {
        if is_zero(a, y) {
            x
        } else if is_zero(a, x) {
            a.push(Expr::Neg(y))
        } else {
            a.push(Expr::Sub(x, y))
        }
    }
    fn mul(a: &mut Arena, x: ExprId, y: ExprId) -> ExprId {
        if is_zero(a, x) || is_zero(a, y) {
            a.push(Expr::Num(0.0))
        } else if is_one(a, x) {
            y
        } else if is_one(a, y) {
            x
        } else {
            a.push(Expr::Mul(x, y))
        }
    }
    fn go(a: &mut Arena, id: ExprId, vx: &str, vy: &str) -> Option<[ExprId; 3]> {
        let zero = a.push(Expr::Num(0.0));
        let e = a.get(id).clone();
        Some(match e {
            Expr::Num(_) | Expr::Cell(_) => [zero, zero, id],
            Expr::Sym(s) if s == vx => [a.push(Expr::Num(1.0)), zero, zero],
            Expr::Sym(s) if s == vy => [zero, a.push(Expr::Num(1.0)), zero],
            Expr::Sym(_) => return None,
            Expr::Neg(x) => {
                let [p, q, r] = go(a, x, vx, vy)?;
                [sub(a, zero, p), sub(a, zero, q), sub(a, zero, r)]
            }
            Expr::Add(x, y) => {
                let [p1, q1, r1] = go(a, x, vx, vy)?;
                let [p2, q2, r2] = go(a, y, vx, vy)?;
                [add(a, p1, p2), add(a, q1, q2), add(a, r1, r2)]
            }
            Expr::Sub(x, y) => {
                let [p1, q1, r1] = go(a, x, vx, vy)?;
                let [p2, q2, r2] = go(a, y, vx, vy)?;
                [sub(a, p1, p2), sub(a, q1, q2), sub(a, r1, r2)]
            }
            Expr::Mul(x, y) => {
                let l = go(a, x, vx, vy)?;
                let r = go(a, y, vx, vy)?;
                let l_const = is_zero(a, l[0]) && is_zero(a, l[1]);
                let r_const = is_zero(a, r[0]) && is_zero(a, r[1]);
                if l_const {
                    [mul(a, l[2], r[0]), mul(a, l[2], r[1]), mul(a, l[2], r[2])]
                } else if r_const {
                    [mul(a, r[2], l[0]), mul(a, r[2], l[1]), mul(a, r[2], l[2])]
                } else {
                    return None;
                }
            }
            Expr::Div(x, y) => {
                let l = go(a, x, vx, vy)?;
                let r = go(a, y, vx, vy)?;
                if !(is_zero(a, r[0]) && is_zero(a, r[1])) {
                    return None;
                }
                let d = r[2];
                let div = |a: &mut Arena, n: ExprId| {
                    if is_zero(a, n) {
                        n
                    } else {
                        a.push(Expr::Div(n, d))
                    }
                };
                [div(a, l[0]), div(a, l[1]), div(a, l[2])]
            }
            // A call is linear only when it is constant in both symbols.
            Expr::Call(_, args) => {
                for arg in args {
                    let [p, q, _] = go(a, arg, vx, vy)?;
                    if !(is_zero(a, p) && is_zero(a, q)) {
                        return None;
                    }
                }
                [zero, zero, id]
            }
            Expr::Pow(x, y) => {
                let l = go(a, x, vx, vy)?;
                let r = go(a, y, vx, vy)?;
                if is_zero(a, l[0]) && is_zero(a, l[1]) && is_zero(a, r[0]) && is_zero(a, r[1]) {
                    [zero, zero, id]
                } else {
                    return None;
                }
            }
        })
    }
    go(arena, id, vx, vy)
}

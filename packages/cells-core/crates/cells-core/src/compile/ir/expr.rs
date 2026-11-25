//! The parse arena: math text parsed at compile time, cell leaves holding
//! plan ids (slots, once a build stamps it). It decides whether a math is
//! numeric and lowers it to operators, and gives geometry its linear
//! coefficients. It is not used at tick time.

use super::RefId;

crate::index::index_type! {
    /// An expression: a position in an [`Arena`].
    pub(crate) struct ExprId;
}

/// A math expression, a node of an [`Arena`]: over reference plans in the
/// compile, over slots in a build.
#[derive(Debug, Clone, PartialEq)]
pub(crate) enum Expr<L> {
    Num(f64),
    /// A free symbol such as `x`.
    Sym(String),
    /// A numeric leaf, `$a` inside a math: a reference plan id in the
    /// compile's arena, a slot (`SlotId`) in a build's.
    Cell(L),
    Add(ExprId, ExprId),
    Sub(ExprId, ExprId),
    Mul(ExprId, ExprId),
    Div(ExprId, ExprId),
    Pow(ExprId, ExprId),
    Neg(ExprId),
    /// `round(x)`, `min(a, b)`: a function the lowering knows. A clamp's
    /// bounds are always numbers.
    Call(Func, Vec<ExprId>),
    /// An operator over math that only the symbolic engine computes (ADR
    /// 0043), over these operands: a `<sum>`'s or an `<abs>`'s. Its text
    /// (`SymText`) says what it does with them; here it stands for their
    /// symbols and leaves, which decide whether it is symbolic, and is
    /// never numeric.
    Operator(Vec<ExprId>),
    /// A value with entries (ADR 0041, decision 8): `a, b`, `(a, b)`,
    /// `[a, b)`, `{a, b}`, `⟨a, b⟩`, its entries in order. Always
    /// symbolic: the symbolic engine reads its head from the text. With no
    /// entries, constant math text only the engine reads (a relation, `4 <
    /// x <= 5`; `Reader::parse_math_text`).
    Shape(Vec<ExprId>),
}

/// The functions numeric math text can call, each lowered to its operator
/// (ADR 0083): DoenetML's `round`, `floor`, `min`, `max` and `clamp`, and
/// the functions the current core evaluates numerically
/// (`evaluate_to_constant`), by the names the symbolic engine reads.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Func {
    Round,
    Floor,
    Min,
    Max,
    /// `clamp(x, lo, hi)`, with number bounds.
    Clamp,
    Sqrt,
    Cbrt,
    Abs,
    Sign,
    Ceil,
    Exp,
    /// `log` and `ln`: the natural logarithm, as in the current core.
    Ln,
    Log10,
    Sin,
    Cos,
    Tan,
    Sec,
    Csc,
    Cot,
    Asin,
    Acos,
    Atan,
    Asec,
    Acsc,
    Acot,
    Sinh,
    Cosh,
    Tanh,
    Sech,
    Csch,
    Coth,
    Asinh,
    Acosh,
    Atanh,
}

/// How a [`Func`] lowers: to one operator over its argument, the
/// reciprocal of one (`sec` is `1 / cos`), or one over the argument's
/// reciprocal (`asec(x)` is `acos(1 / x)`).
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) enum Lowered {
    Op(crate::program::OpSpec),
    Recip(crate::program::OpSpec),
    OfRecip(crate::program::OpSpec),
}

impl Func {
    pub(crate) fn named(name: &str) -> Option<Func> {
        Some(match name {
            "round" => Func::Round,
            "floor" => Func::Floor,
            "min" => Func::Min,
            "max" => Func::Max,
            "clamp" => Func::Clamp,
            "sqrt" => Func::Sqrt,
            "cbrt" => Func::Cbrt,
            "abs" => Func::Abs,
            "sign" => Func::Sign,
            "ceil" => Func::Ceil,
            "exp" => Func::Exp,
            "log" | "ln" => Func::Ln,
            "log10" => Func::Log10,
            "sin" => Func::Sin,
            "cos" => Func::Cos,
            "tan" => Func::Tan,
            "sec" => Func::Sec,
            "csc" => Func::Csc,
            "cot" => Func::Cot,
            "asin" | "arcsin" => Func::Asin,
            "acos" | "arccos" => Func::Acos,
            "atan" | "arctan" => Func::Atan,
            "asec" | "arcsec" => Func::Asec,
            "acsc" | "arccsc" => Func::Acsc,
            "acot" | "arccot" => Func::Acot,
            "sinh" => Func::Sinh,
            "cosh" => Func::Cosh,
            "tanh" => Func::Tanh,
            "sech" => Func::Sech,
            "csch" => Func::Csch,
            "coth" => Func::Coth,
            "asinh" | "arcsinh" => Func::Asinh,
            "acosh" | "arccosh" => Func::Acosh,
            "atanh" | "arctanh" => Func::Atanh,
            _ => return None,
        })
    }

    /// Whether the symbolic engine reads and prints a call to it, so a
    /// lowered math calling it can show its expression (ADR 0046):
    /// `round(＿) + 1`, `min(＿, 1)`. The engine has no `clamp`.
    pub(crate) fn engine_reads(self) -> bool {
        !matches!(self, Func::Clamp)
    }

    /// Whether only numeric math may call it: DoenetML's own `round`,
    /// `floor`, `min`, `max` and `clamp`, which a symbolic math refuses.
    /// The others are the engine's functions too (ADR 0083), which a
    /// `<math>` keeps as written (`sin(1)`), as the current core does.
    pub(crate) fn numeric_only(self) -> bool {
        matches!(
            self,
            Func::Round | Func::Floor | Func::Min | Func::Max | Func::Clamp
        )
    }

    /// Whether `n` arguments are allowed: `min` and `max` take two or more.
    fn takes(self, n: usize) -> bool {
        match self {
            Func::Min | Func::Max => n >= 2,
            Func::Clamp => n == 3,
            _ => n == 1,
        }
    }

    /// How a one-argument function lowers; `None` for `round`, `floor`,
    /// `min`, `max` and `clamp`, which the lowering spells out itself.
    pub(crate) fn lowered(self) -> Option<Lowered> {
        use crate::program::OpSpec as S;
        Some(match self {
            Func::Round | Func::Floor | Func::Min | Func::Max | Func::Clamp => return None,
            Func::Sqrt => Lowered::Op(S::Sqrt),
            Func::Cbrt => Lowered::Op(S::Cbrt),
            Func::Abs => Lowered::Op(S::Abs),
            Func::Sign => Lowered::Op(S::Sign),
            Func::Ceil => Lowered::Op(S::Ceil),
            Func::Exp => Lowered::Op(S::Exp),
            Func::Ln => Lowered::Op(S::Ln),
            Func::Log10 => Lowered::Op(S::Log10),
            Func::Sin => Lowered::Op(S::Sin),
            Func::Cos => Lowered::Op(S::Cos),
            Func::Tan => Lowered::Op(S::Tan),
            Func::Sec => Lowered::Recip(S::Cos),
            Func::Csc => Lowered::Recip(S::Sin),
            Func::Cot => Lowered::Recip(S::Tan),
            Func::Asin => Lowered::Op(S::Asin),
            Func::Acos => Lowered::Op(S::Acos),
            Func::Atan => Lowered::Op(S::Atan),
            Func::Asec => Lowered::OfRecip(S::Acos),
            Func::Acsc => Lowered::OfRecip(S::Asin),
            Func::Acot => Lowered::OfRecip(S::Atan),
            Func::Sinh => Lowered::Op(S::Sinh),
            Func::Cosh => Lowered::Op(S::Cosh),
            Func::Tanh => Lowered::Op(S::Tanh),
            Func::Sech => Lowered::Recip(S::Cosh),
            Func::Csch => Lowered::Recip(S::Sinh),
            Func::Coth => Lowered::Recip(S::Tanh),
            Func::Asinh => Lowered::Op(S::Asinh),
            Func::Acosh => Lowered::Op(S::Acosh),
            Func::Atanh => Lowered::Op(S::Atanh),
        })
    }

    /// The value over number arguments, as the operators compute it.
    fn eval(self, args: &[f64]) -> f64 {
        let x = args[0];
        match self {
            Func::Round => args[0].round(),
            Func::Floor => args[0].floor(),
            Func::Min => args.iter().copied().reduce(f64::min).unwrap(),
            Func::Max => args.iter().copied().reduce(f64::max).unwrap(),
            Func::Clamp => args[0].clamp(args[1], args[2]),
            Func::Sqrt => x.sqrt(),
            Func::Cbrt => x.cbrt(),
            Func::Abs => x.abs(),
            Func::Sign => {
                if x > 0.0 {
                    1.0
                } else if x < 0.0 {
                    -1.0
                } else {
                    x
                }
            }
            Func::Ceil => x.ceil(),
            Func::Exp => x.exp(),
            Func::Ln => x.ln(),
            Func::Log10 => x.log10(),
            Func::Sin => x.sin(),
            Func::Cos => x.cos(),
            Func::Tan => x.tan(),
            Func::Sec => 1.0 / x.cos(),
            Func::Csc => 1.0 / x.sin(),
            Func::Cot => 1.0 / x.tan(),
            Func::Asin => x.asin(),
            Func::Acos => x.acos(),
            Func::Atan => x.atan(),
            Func::Asec => (1.0 / x).acos(),
            Func::Acsc => (1.0 / x).asin(),
            Func::Acot => (1.0 / x).atan(),
            Func::Sinh => x.sinh(),
            Func::Cosh => x.cosh(),
            Func::Tanh => x.tanh(),
            Func::Sech => 1.0 / x.cosh(),
            Func::Csch => 1.0 / x.sinh(),
            Func::Coth => 1.0 / x.tanh(),
            Func::Asinh => x.asinh(),
            Func::Acosh => x.acosh(),
            Func::Atanh => x.atanh(),
        }
    }
}

impl<L: Copy + PartialEq + std::fmt::Debug> Expr<L> {
    /// The same binary operator over new operands, in an arena of any
    /// leaves.
    pub(crate) fn with_operands<M>(&self, a: ExprId, b: ExprId) -> Expr<M> {
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

/// Parsed expressions whose leaves are `L`s.
#[derive(Debug, Clone)]
pub(crate) struct Arena<L> {
    pub nodes: Vec<Expr<L>>,
}

impl<L> Default for Arena<L> {
    fn default() -> Self {
        Arena { nodes: Vec::new() }
    }
}

impl<L: Copy + PartialEq + std::fmt::Debug> Arena<L> {
    pub(crate) fn push(&mut self, e: Expr<L>) -> ExprId {
        // Fold constants as they are built.
        let folded = match &e {
            Expr::Add(a, b) => self.fold2(*a, *b, |x, y| x + y),
            Expr::Sub(a, b) => self.fold2(*a, *b, |x, y| x - y),
            Expr::Mul(a, b) => self.fold2(*a, *b, |x, y| x * y),
            Expr::Div(a, b) => self.fold2(*a, *b, |x, y| x / y),
            Expr::Pow(a, b) => self.fold2(*a, *b, f64::powf),
            Expr::Neg(a) => match self.nodes[a.index()] {
                Expr::Num(x) => Some(Expr::Num(-x)),
                _ => None,
            },
            Expr::Call(f, args) => args
                .iter()
                .map(|&a| match self.nodes[a.index()] {
                    Expr::Num(x) => Some(x),
                    _ => None,
                })
                .collect::<Option<Vec<f64>>>()
                .map(|xs| Expr::Num(f.eval(&xs))),
            _ => None,
        };
        self.nodes.push(folded.unwrap_or(e));
        ExprId::from_index(self.nodes.len() - 1)
    }

    fn fold2(&self, a: ExprId, b: ExprId, f: impl Fn(f64, f64) -> f64) -> Option<Expr<L>> {
        match (&self.nodes[a.index()], &self.nodes[b.index()]) {
            (Expr::Num(x), Expr::Num(y)) => Some(Expr::Num(f(*x, *y))),
            _ => None,
        }
    }

    pub(crate) fn get(&self, id: ExprId) -> &Expr<L> {
        &self.nodes[id.index()]
    }

    /// Whether the expression has no free symbols, so it can be lowered to
    /// numeric operators at build time.
    pub(crate) fn is_numeric(&self, id: ExprId) -> bool {
        match self.get(id) {
            Expr::Num(_) | Expr::Cell(_) => true,
            // `e` is Euler's number where math is numeric, as the current
            // core's `evaluate_to_constant` reads it (ADR 0083).
            Expr::Sym(s) => named_constant(s).is_some(),
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => self.is_numeric(*a) && self.is_numeric(*b),
            Expr::Neg(a) => self.is_numeric(*a),
            Expr::Call(_, args) => args.iter().all(|&a| self.is_numeric(a)),
            Expr::Operator(_) | Expr::Shape(_) => false,
        }
    }

    /// Whether the expression is numeric with no call to one of the
    /// engine's functions and no named constant (`e`): numeric as the
    /// lowering read it before ADR 0083, which a condition keeps, so that
    /// `log(e^3) = 3` compares as the engine does.
    pub(crate) fn is_plain_numeric(&self, id: ExprId) -> bool {
        let mut syms = Vec::new();
        self.symbols(id, &mut syms);
        syms.is_empty() && !self.calls_written(id) && self.is_numeric(id)
    }

    /// The free symbols, in first-appearance order.
    pub(crate) fn symbols(&self, id: ExprId, out: &mut Vec<String>) {
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
            Expr::Call(_, args) | Expr::Operator(args) | Expr::Shape(args) => {
                args.iter().for_each(|&a| self.symbols(a, out))
            }
        }
    }

    /// Distinct cell leaves, in first-appearance order.
    pub(crate) fn cell_leaves(&self, id: ExprId, out: &mut Vec<L>) {
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
            Expr::Call(_, args) | Expr::Operator(args) | Expr::Shape(args) => {
                args.iter().for_each(|&a| self.cell_leaves(a, out))
            }
        }
    }

    /// Whether the expression holds a value with entries anywhere (ADR
    /// 0041, decision 8), which makes it symbolic.
    pub(crate) fn has_shape(&self, id: ExprId) -> bool {
        // A loop, not a recursion: a math of many terms is a deep tree.
        let mut todo = vec![id];
        while let Some(id) = todo.pop() {
            match self.get(id) {
                Expr::Num(_) | Expr::Sym(_) | Expr::Cell(_) => {}
                Expr::Add(a, b)
                | Expr::Sub(a, b)
                | Expr::Mul(a, b)
                | Expr::Div(a, b)
                | Expr::Pow(a, b) => todo.extend([*a, *b]),
                Expr::Neg(a) => todo.push(*a),
                Expr::Shape(_) => return true,
                Expr::Call(_, args) | Expr::Operator(args) => todo.extend(args),
            }
        }
        false
    }

    /// Whether the expression calls a function only numeric math may call
    /// ([`Func::numeric_only`]) anywhere.
    pub(crate) fn has_call(&self, id: ExprId) -> bool {
        self.calls(id, &|f| f.numeric_only())
    }

    /// Whether the expression calls one of the engine's functions
    /// (`sin`, `sqrt`; not [`Func::numeric_only`]) anywhere: a `<math>`
    /// keeps such a call as written (ADR 0083).
    pub(crate) fn calls_written(&self, id: ExprId) -> bool {
        self.calls(id, &|f| !f.numeric_only())
    }

    /// Whether the expression calls a function the symbolic engine does
    /// not read ([`Func::engine_reads`]) anywhere.
    pub(crate) fn calls_outside_engine(&self, id: ExprId) -> bool {
        self.calls(id, &|f| !f.engine_reads())
    }

    /// Whether the expression calls a function `which` holds of anywhere.
    fn calls(&self, id: ExprId, which: &dyn Fn(Func) -> bool) -> bool {
        match self.get(id) {
            Expr::Num(_) | Expr::Sym(_) | Expr::Cell(_) => false,
            Expr::Add(a, b)
            | Expr::Sub(a, b)
            | Expr::Mul(a, b)
            | Expr::Div(a, b)
            | Expr::Pow(a, b) => self.calls(*a, which) || self.calls(*b, which),
            Expr::Neg(a) => self.calls(*a, which),
            Expr::Call(f, args) => which(*f) || args.iter().any(|&a| self.calls(a, which)),
            Expr::Operator(args) | Expr::Shape(args) => args.iter().any(|&a| self.calls(a, which)),
        }
    }
}

/// The value of a symbol numeric math reads as a constant (ADR 0083), as
/// the current core's `evaluate_to_constant` does: `e`, and infinity. A
/// symbolic math keeps it as the symbol it is (`pi` is a number token
/// already).
pub(crate) fn named_constant(name: &str) -> Option<f64> {
    match name {
        "e" => Some(std::f64::consts::E),
        "\u{3c0}" => Some(std::f64::consts::PI),
        "infinity" | "Infinity" => Some(f64::INFINITY),
        _ => None,
    }
}

/// A token of math text. References (`$a`) arrive already resolved to a
/// reference plan id.
#[derive(Debug, Clone, PartialEq)]
pub(crate) enum Token {
    Num(f64),
    Ident(String),
    Cell(RefId),
    Op(char),
    LParen,
    RParen,
    Comma,
    Eq,
    /// `[`, `{` or `⟨`: opens a value with entries.
    Open(char),
    /// `]`, `}` or `⟩`: closes one.
    Close(char),
}

impl Token {
    /// Whether it opens a bracket pair: `(`, `[`, `{`, `⟨`.
    pub(crate) fn opens(&self) -> bool {
        matches!(self, Token::LParen | Token::Open(_))
    }

    /// Whether it closes one: `)`, `]`, `}`, `⟩`. An interval's brackets
    /// need not match (`[1, 2)`).
    pub(crate) fn closes(&self) -> bool {
        matches!(self, Token::RParen | Token::Close(_))
    }
}

/// Tokenize one run of text. Identifiers are maximal letter runs (`pi` is a
/// constant, `x`, `ab` are symbols); numbers are decimal literals.
pub(crate) fn tokenize(text: &str, out: &mut Vec<Token>) -> Result<(), String> {
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
            // A subscript of letters and digits is part of the name
            // (`x_1`, a function's default variable, ADR 0081), which the
            // engine reads as the subscripted symbol.
            if chars.get(i) == Some(&'_') && chars.get(i + 1).is_some_and(|c| c.is_alphanumeric()) {
                i += 1;
                while i < chars.len() && chars[i].is_alphanumeric() {
                    i += 1;
                }
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
                '[' | '{' | '⟨' => Token::Open(c),
                '\u{221e}' => Token::Ident("infinity".into()),
                ']' | '}' | '⟩' => Token::Close(c),
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
pub(crate) struct Parser<'a> {
    toks: &'a [Token],
    pos: usize,
    arena: &'a mut Arena<RefId>,
}

impl<'a> Parser<'a> {
    pub(crate) fn parse(toks: &'a [Token], arena: &'a mut Arena<RefId>) -> Result<ExprId, String> {
        // No text at all (`<math/>`, an `<answer>` with only an input): the
        // blank expression, a symbol the engine spells `＿`.
        if toks.is_empty() {
            return Ok(arena.push(Expr::Sym("\u{ff3f}".into())));
        }
        let mut p = Parser {
            toks,
            pos: 0,
            arena,
        };
        let id = p.entries()?;
        if p.pos != p.toks.len() {
            return Err(format!("unexpected token {:?}", p.toks[p.pos]));
        }
        Ok(id)
    }

    fn peek(&self) -> Option<&Token> {
        self.toks.get(self.pos)
    }

    /// Expressions separated by commas: one alone, or a value with
    /// entries.
    fn entries(&mut self) -> Result<ExprId, String> {
        let first = self.expr()?;
        if self.peek() != Some(&Token::Comma) {
            return Ok(first);
        }
        let mut xs = vec![first];
        while self.peek() == Some(&Token::Comma) {
            self.pos += 1;
            xs.push(self.expr()?);
        }
        Ok(self.arena.push(Expr::Shape(xs)))
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
                Some(
                    Token::Num(_)
                    | Token::Ident(_)
                    | Token::Cell(_)
                    | Token::LParen
                    | Token::Open(_),
                ) => {
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
            // `(e)` is `e`; any other bracket pair, or entries separated by
            // commas, is a value with entries, which the engine reads.
            open @ (Token::LParen | Token::Open(_)) => {
                let e = self.entries()?;
                let close = match self.peek() {
                    Some(t) if t.closes() => t.clone(),
                    _ => return Err("missing ')'".into()),
                };
                self.pos += 1;
                let shaped = matches!(self.arena.get(e), Expr::Shape(_));
                if (open == Token::LParen && close == Token::RParen) || shaped {
                    e
                } else {
                    self.arena.push(Expr::Shape(vec![e]))
                }
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

/// Split tokens at every `sep` that sits outside brackets.
pub(crate) fn split_top(toks: &[Token], sep: &Token) -> Vec<Vec<Token>> {
    let mut out = vec![Vec::new()];
    let mut depth = 0i32;
    for t in toks {
        if t.opens() {
            depth += 1;
        } else if t.closes() {
            depth -= 1;
        }
        if depth == 0 && t == sep {
            out.push(Vec::new());
        } else {
            out.last_mut().unwrap().push(t.clone());
        }
    }
    out
}

/// The entries of a parenthesized tuple, `(a, b, ...)`, when the whole
/// token run is one: the one reading of math text as a tuple.
pub(crate) fn tuple_entries(toks: &[Token]) -> Option<Vec<Vec<Token>>> {
    unwrap_parens(toks).map(|inner| split_top(inner, &Token::Comma))
}

/// Strip one pair of enclosing parentheses, if the whole token run is
/// wrapped in them.
pub(crate) fn unwrap_parens(toks: &[Token]) -> Option<&[Token]> {
    if toks.len() < 2 || toks[0] != Token::LParen || *toks.last().unwrap() != Token::RParen {
        return None;
    }
    let mut depth = 0i32;
    for (i, t) in toks.iter().enumerate() {
        if t.opens() {
            depth += 1;
        } else if t.closes() {
            depth -= 1;
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
pub(crate) fn linear_coeffs<L: Copy + PartialEq + std::fmt::Debug>(
    arena: &mut Arena<L>,
    id: ExprId,
    vx: &str,
    vy: &str,
) -> Option<[ExprId; 3]> {
    fn is_zero<L: Copy + PartialEq + std::fmt::Debug>(a: &Arena<L>, e: ExprId) -> bool {
        matches!(a.get(e), Expr::Num(v) if *v == 0.0)
    }
    fn is_one<L: Copy + PartialEq + std::fmt::Debug>(a: &Arena<L>, e: ExprId) -> bool {
        matches!(a.get(e), Expr::Num(v) if *v == 1.0)
    }
    fn add<L: Copy + PartialEq + std::fmt::Debug>(
        a: &mut Arena<L>,
        x: ExprId,
        y: ExprId,
    ) -> ExprId {
        if is_zero(a, x) {
            y
        } else if is_zero(a, y) {
            x
        } else {
            a.push(Expr::Add(x, y))
        }
    }
    fn sub<L: Copy + PartialEq + std::fmt::Debug>(
        a: &mut Arena<L>,
        x: ExprId,
        y: ExprId,
    ) -> ExprId {
        if is_zero(a, y) {
            x
        } else if is_zero(a, x) {
            a.push(Expr::Neg(y))
        } else {
            a.push(Expr::Sub(x, y))
        }
    }
    fn mul<L: Copy + PartialEq + std::fmt::Debug>(
        a: &mut Arena<L>,
        x: ExprId,
        y: ExprId,
    ) -> ExprId {
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
    fn go<L: Copy + PartialEq + std::fmt::Debug>(
        a: &mut Arena<L>,
        id: ExprId,
        vx: &str,
        vy: &str,
    ) -> Option<[ExprId; 3]> {
        let zero = a.push(Expr::Num(0.0));
        let e = a.get(id).clone();
        Some(match e {
            Expr::Num(_) | Expr::Cell(_) => [zero, zero, id],
            Expr::Sym(s) if s == vx => [a.push(Expr::Num(1.0)), zero, zero],
            Expr::Sym(s) if s == vy => [zero, a.push(Expr::Num(1.0)), zero],
            // Euler's number, a constant (ADR 0083).
            Expr::Sym(s) if named_constant(&s).is_some() => [zero, zero, id],
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
                let div = |a: &mut Arena<L>, n: ExprId| {
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
            // Never numeric, so no coefficient.
            Expr::Operator(_) | Expr::Shape(_) => return None,
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

/// A `<function>`'s `variables`, split at spaces and commas; `x` when
/// absent.
pub(crate) fn function_variables(text: Option<String>) -> Vec<String> {
    let vars: Vec<String> = text
        .map(|s| {
            s.split(|c: char| c.is_whitespace() || c == ',')
                .filter(|v| !v.is_empty())
                .map(str::to_string)
                .collect()
        })
        .unwrap_or_default();
    if vars.is_empty() {
        vec!["x".to_string()]
    } else {
        vars
    }
}

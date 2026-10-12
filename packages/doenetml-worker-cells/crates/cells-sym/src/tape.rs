//! A compiled numeric program for sampling one expression at many values of
//! its variable. Built once, when the document is built, from an expression
//! whose cell leaves are all numbers: those leaves become parameters, read
//! from the cells on each run, so a coefficient drag reruns the tape without
//! building or simplifying any expression.
//!
//! The tape is a stack program evaluated a column at a time: each op works on
//! whole columns of `n` samples, so the inner loops are plain slice loops the
//! compiler vectorizes.

use crate::Tree;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Func {
    Sin,
    Cos,
    Tan,
    Exp,
    Ln,
    Sqrt,
    Abs,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TapeOp {
    Const(f64),
    /// Parameter `i`: the value of cell `params[i]`.
    Param(u32),
    /// The variable.
    X,
    /// Pop `n` columns, push their sum (or product).
    Add(u32),
    Mul(u32),
    Sub,
    Div,
    Neg,
    Pow,
    Apply(Func),
}

#[derive(Debug, Clone, Default, PartialEq)]
pub struct Tape {
    pub ops: Vec<TapeOp>,
    /// Cells read as parameters, in `Param` order.
    pub params: Vec<u32>,
    /// Columns the stack needs at its deepest.
    pub depth: usize,
}

impl Tape {
    /// Compile `t` with `var` as the variable. `None` when the expression
    /// cannot be sampled numerically on its own: a math leaf (its shape
    /// changes at tick time) or a function the tape does not know.
    pub fn compile(t: &Tree, var: &str) -> Option<Tape> {
        let mut tape = Tape::default();
        let mut depth = 0usize;
        tape.emit(t, var, &mut depth)?;
        Some(tape)
    }

    fn push(&mut self, op: TapeOp, depth: &mut usize, pops: usize) {
        self.ops.push(op);
        *depth = *depth - pops + 1;
        self.depth = self.depth.max(*depth);
    }

    fn emit(&mut self, t: &Tree, var: &str, depth: &mut usize) -> Option<()> {
        match t {
            Tree::Num(v) => self.push(TapeOp::Const(*v), depth, 0),
            Tree::Sym(s) if s == var => self.push(TapeOp::X, depth, 0),
            Tree::Sym(s) => {
                // Any other free symbol makes the value undefined, as in the engines.
                let v = match s.as_str() {
                    "pi" => std::f64::consts::PI,
                    "e" => std::f64::consts::E,
                    _ => f64::NAN,
                };
                self.push(TapeOp::Const(v), depth, 0)
            }
            Tree::Cell { math: true, .. } => return None,
            Tree::Cell { cell, math: false } => {
                let i = match self.params.iter().position(|c| c == cell) {
                    Some(i) => i,
                    None => {
                        self.params.push(*cell);
                        self.params.len() - 1
                    }
                };
                self.push(TapeOp::Param(i as u32), depth, 0)
            }
            Tree::Add(ts) | Tree::Mul(ts) => {
                for k in ts {
                    self.emit(k, var, depth)?;
                }
                let n = ts.len();
                let op = if matches!(t, Tree::Add(_)) {
                    TapeOp::Add(n as u32)
                } else {
                    TapeOp::Mul(n as u32)
                };
                self.push(op, depth, n)
            }
            Tree::Sub(a, b) | Tree::Div(a, b) | Tree::Pow(a, b) => {
                self.emit(a, var, depth)?;
                self.emit(b, var, depth)?;
                let op = match t {
                    Tree::Sub(..) => TapeOp::Sub,
                    Tree::Div(..) => TapeOp::Div,
                    _ => TapeOp::Pow,
                };
                self.push(op, depth, 2)
            }
            Tree::Neg(a) => {
                self.emit(a, var, depth)?;
                self.push(TapeOp::Neg, depth, 1)
            }
            Tree::Apply(f, a) => {
                let func = match f.as_str() {
                    "sin" => Func::Sin,
                    "cos" => Func::Cos,
                    "tan" => Func::Tan,
                    "exp" => Func::Exp,
                    "ln" | "log" => Func::Ln,
                    "sqrt" => Func::Sqrt,
                    "abs" => Func::Abs,
                    _ => return None,
                };
                self.emit(a, var, depth)?;
                self.push(TapeOp::Apply(func), depth, 1)
            }
        }
        Some(())
    }

    /// Evaluate at every `xs[i]` into `out[i]`, with parameter `i` equal to
    /// `params[i]`. `stack` is scratch, resized as needed.
    pub fn eval_many(&self, params: &[f64], xs: &[f64], out: &mut [f64], stack: &mut Vec<f64>) {
        let n = xs.len();
        stack.resize(self.depth.max(1) * n, 0.0);
        let mut top = 0usize; // columns in use
        for op in &self.ops {
            match *op {
                TapeOp::Const(v) => {
                    stack[top * n..(top + 1) * n].fill(v);
                    top += 1;
                }
                TapeOp::Param(i) => {
                    stack[top * n..(top + 1) * n].fill(params[i as usize]);
                    top += 1;
                }
                TapeOp::X => {
                    stack[top * n..(top + 1) * n].copy_from_slice(xs);
                    top += 1;
                }
                TapeOp::Add(k) | TapeOp::Mul(k) => {
                    let k = k as usize;
                    let base = top - k;
                    let (dst, rest) = stack[base * n..top * n].split_at_mut(n);
                    for j in 1..k {
                        let src = &rest[(j - 1) * n..j * n];
                        if matches!(op, TapeOp::Add(_)) {
                            dst.iter_mut().zip(src).for_each(|(d, s)| *d += s);
                        } else {
                            dst.iter_mut().zip(src).for_each(|(d, s)| *d *= s);
                        }
                    }
                    top = base + 1;
                }
                TapeOp::Sub | TapeOp::Div | TapeOp::Pow => {
                    let (dst, src) = stack[(top - 2) * n..top * n].split_at_mut(n);
                    match op {
                        TapeOp::Sub => dst.iter_mut().zip(&*src).for_each(|(d, s)| *d -= s),
                        TapeOp::Div => dst.iter_mut().zip(&*src).for_each(|(d, s)| *d /= s),
                        _ => dst
                            .iter_mut()
                            .zip(&*src)
                            .for_each(|(d, s)| *d = pow(*d, *s)),
                    }
                    top -= 1;
                }
                TapeOp::Neg => stack[(top - 1) * n..top * n]
                    .iter_mut()
                    .for_each(|d| *d = -*d),
                TapeOp::Apply(f) => {
                    let col = &mut stack[(top - 1) * n..top * n];
                    let g: fn(f64) -> f64 = match f {
                        Func::Sin => f64::sin,
                        Func::Cos => f64::cos,
                        Func::Tan => f64::tan,
                        Func::Exp => f64::exp,
                        Func::Ln => f64::ln,
                        Func::Sqrt => f64::sqrt,
                        Func::Abs => f64::abs,
                    };
                    col.iter_mut().for_each(|d| *d = g(*d));
                }
            }
        }
        out.copy_from_slice(&stack[..n]);
    }
}

/// `b^e`, with integer exponents by repeated multiplication (as fast as a
/// multiply for squares and cubes) and the real odd root of a negative base,
/// as engine A evaluates `x^(1/3)`.
#[inline]
fn pow(b: f64, e: f64) -> f64 {
    if e == 2.0 {
        b * b
    } else if e.fract() == 0.0 && e.abs() <= 16.0 {
        b.powi(e as i32)
    } else if b < 0.0 && odd_denominator(e) {
        -(-b).powf(e)
    } else {
        b.powf(e)
    }
}

/// Whether `e` is `p/q` with `q` odd and small (1/3, 2/5, ...).
fn odd_denominator(e: f64) -> bool {
    (1..=15).step_by(2).skip(1).any(|q: i32| {
        let p = e * q as f64;
        (p - p.round()).abs() < 1e-12 && (p.round() as i64) % 2 != 0
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::parse::parse;

    fn sample(text: &str, params: &[f64], xs: &[f64]) -> Vec<f64> {
        let tape = Tape::compile(&parse(text).unwrap(), "x").unwrap();
        let mut out = vec![0.0; xs.len()];
        tape.eval_many(params, xs, &mut out, &mut Vec::new());
        out
    }

    #[test]
    fn evaluates_columns() {
        assert_eq!(
            sample("3x^2 - 2x + 1", &[], &[0.0, 1.0, 2.0]),
            vec![1.0, 2.0, 9.0]
        );
        assert_eq!(
            sample("#7 x + #9", &[2.0, 5.0], &[0.0, 1.0, 3.0]),
            vec![5.0, 7.0, 11.0]
        );
        let s = sample("sin(x)^2 + cos(x)^2", &[], &[0.3, 1.7]);
        assert!(s.iter().all(|v| (v - 1.0).abs() < 1e-12));
        assert!(sample("x + y", &[], &[1.0])[0].is_nan());
    }

    #[test]
    fn a_math_leaf_does_not_compile() {
        assert!(
            Tape::compile(
                &Tree::Cell {
                    cell: 3,
                    math: true
                },
                "x"
            )
            .is_none()
        );
    }
}

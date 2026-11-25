//! A line's equation read in the tick (ADR 0083): the coefficients of
//! `a x + b y + c = 0` an equation holds, as a `<line>` whose equation is
//! a math value (`<line>$mathInput</line>`) reads them.

use std::collections::HashMap;

use math_expressions as me;
use me::Expr;

use super::Handle;
use super::engine::Engine;

impl Engine {
    /// The coefficients `[a, b, c]` of `a vx + b vy + c = 0` that the
    /// equation `h` holds: one `=` between two sides whose difference is
    /// linear in `vx` and `vy`, with no other free symbol. `None` for
    /// anything else, which a line reads as no equation.
    pub fn line_coeffs(&mut self, h: Handle, vx: &str, vy: &str) -> Option<[f64; 3]> {
        let Expr::Relation { operands, ops } = self.expr(h) else {
            return None;
        };
        let ([lhs, rhs], [me::expr::RelOp::Eq]) = (&operands[..], &ops[..]) else {
            return None;
        };
        let diff = Expr::Add(vec![lhs.clone(), Expr::Neg(Box::new(rhs.clone()))]);
        let at = |x: f64, y: f64| -> Option<f64> {
            let bindings = HashMap::from([(vx.to_string(), x), (vy.to_string(), y)]);
            let z = me::evaluate_fast_f64(&diff, &bindings)?;
            (z.im.abs() <= 1e-12 * z.re.abs().max(1.0) && z.re.is_finite()).then_some(z.re)
        };
        let c = at(0.0, 0.0)?;
        let a = at(1.0, 0.0)? - c;
        let b = at(0.0, 1.0)? - c;
        // Linear: the plane through those three values holds elsewhere too.
        for (x, y) in [(2.5, -1.25), (-3.0, 7.0), (0.375, 4.5)] {
            let want = a * x + b * y + c;
            let got = at(x, y)?;
            let scale = want.abs().max(got.abs()).max(1.0);
            if (got - want).abs() > 1e-9 * scale {
                return None;
            }
        }
        Some([a, b, c])
    }
}

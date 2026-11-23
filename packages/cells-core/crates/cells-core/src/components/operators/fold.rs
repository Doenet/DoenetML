//! `<sum>`, `<product>`, `<mean>`, `<median>`, `<min>`, `<max>`, `<mod>`,
//! `<gcd>`, `<lcm>` and `<count>`, which share their table: a number over
//! their children read as a list (ADR 0041), one operand per text piece and
//! per reference, or, over math, the engine's operator over the operands
//! (ADR 0043).

use super::over_math::{self, Kind};
use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<sum>1 2 $a</sum>`: the sum of its operands, each a number, math
    /// text or a reference; with none, no value. Over math (an operand that
    /// can be an expression, or `forceSymbolic`) it is the expression
    /// `x + 2 x`, simplified or expanded as `simplify` and `expand` say,
    /// unless `forceNumeric`. A request cannot change it, as in the current
    /// core, except a numeric `<min>` or `<max>` of one operand, which
    /// writes it.
    tags: ["sum"],
    variant: Fold::Reduce(Reduction::Sum, Spelled::Joined(" + ")),
    flags: [copyable],
    value: Math(expr),
    props {
        expr: by_planner { rendered, expr_of: expr },
        value: by_planner { rendered, expr_of: expr },
        ..anchor
    }
    attributes {
        forceSymbolic: On,
        forceNumeric: On,
        simplify: On,
        expand: On,
    }
    children: List,
    planner: Plan(plan),
}

/// `<product>`: the product of its operands.
pub(crate) const PRODUCT: ComponentDef = DEFINITION.variant(
    &["product"],
    &Fold::Reduce(Reduction::Product, Spelled::Joined(" * ")),
);
/// `<mean>`: the mean of its operands.
pub(crate) const MEAN: ComponentDef =
    DEFINITION.variant(&["mean"], &Fold::Reduce(Reduction::Mean, Spelled::Mean));
/// `<median>`: the median of its operands, numeric only.
pub(crate) const MEDIAN: ComponentDef = DEFINITION.variant(
    &["median"],
    &Fold::Reduce(Reduction::Median, Spelled::Never),
);
/// `<min>`: the least of its operands.
pub(crate) const MIN: ComponentDef = DEFINITION.variant(
    &["min"],
    &Fold::Reduce(Reduction::Min, Spelled::Call("min")),
);
/// `<max>`: the greatest of its operands.
pub(crate) const MAX: ComponentDef = DEFINITION.variant(
    &["max"],
    &Fold::Reduce(Reduction::Max, Spelled::Call("max")),
);
/// `<mod>`: the first of its two operands mod the second.
pub(crate) const MOD: ComponentDef = DEFINITION.variant(
    &["mod"],
    &Fold::Reduce(Reduction::Mod, Spelled::CallOfTwo("mod")),
);
/// `<gcd>`: the greatest common divisor of its integer operands.
pub(crate) const GCD: ComponentDef = DEFINITION.variant(
    &["gcd"],
    &Fold::Reduce(Reduction::Gcd, Spelled::Call("gcd")),
);
/// `<lcm>`: the least common multiple of its integer operands.
pub(crate) const LCM: ComponentDef = DEFINITION.variant(
    &["lcm"],
    &Fold::Reduce(Reduction::Lcm, Spelled::Call("lcm")),
);
/// `<count>`: how many operands it has, a number.
pub(crate) const COUNT: ComponentDef = DEFINITION.variant(&["count"], &Fold::Count);

/// What a type of this table computes of its operands.
#[derive(Clone, Copy)]
pub(crate) enum Fold {
    /// Over numbers, a reduction of them; over math, as spelled.
    Reduce(Reduction, Spelled),
    /// How many there are: a `<count>`'s, a number.
    Count,
}

/// What a type of this table is over math, as the engine reads it, as
/// the current core builds it.
#[derive(Clone, Copy)]
pub(crate) enum Spelled {
    /// Its operands joined by an operator: `a + b`.
    Joined(&'static str),
    /// Their sum over their number.
    Mean,
    /// A function of them: `min(a, b)`.
    Call(&'static str),
    /// A function of exactly two: a `<mod>` of any other number has no
    /// value either way (the current core's is the blank expression).
    CallOfTwo(&'static str),
    /// Nothing: the current core computes it over numbers only.
    Never,
}

impl Spelled {
    /// The expression over operands spelled `texts` (each in
    /// parentheses), if there is one.
    fn of(self, texts: &[String]) -> Option<String> {
        let n = texts.len();
        let call = |f: &str| format!("{f}({})", texts.join(", "));
        Some(match self {
            Spelled::Joined(op) => texts.join(op),
            Spelled::Mean => format!("({}) / {n}", texts.join(" + ")),
            Spelled::Call(f) => call(f),
            Spelled::CallOfTwo(f) if n == 2 => call(f),
            Spelled::CallOfTwo(_) | Spelled::Never => return None,
        })
    }
}

/// Its `value`: over numbers, an instruction over a hidden port per operand
/// ([`operands`]). With no operand it has no value, as in the current
/// core; a `<count>` counts its pieces; a `<min>` or `<max>` of one operand
/// is that operand, so a request on it writes there, as the current core's
/// does when one operand can change (of several, this core writes none).
/// Over math, `expr` is the engine's operator over the operands
/// ([`over_math`]), and `value` evaluates it.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let fold = *ty.variant::<Fold>();
    let spelled = match fold {
        Fold::Reduce(_, spelled) => spelled,
        Fold::Count => Spelled::Never,
    };
    let attrs = Attrs::of(ctx.record());
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ty);
    let kind = Kind::forced(attrs.forceSymbolic, attrs.forceNumeric);
    // Only the shape of the text matters here: whether there is one.
    let over_math = spelled.of(&vec![String::new(); pieces.len()]).is_some();
    let expr = if pieces.is_empty() || kind == Kind::Numeric || !over_math {
        Wire::absent()
    } else {
        let args = over_math::operand_exprs(ctx, &pieces)?;
        let id = ctx.operator_expr(&args, |texts| spelled.of(texts).expect("a type over math"));
        let post = over_math::simplify_post(attrs.simplify, attrs.expand);
        kind.expr(Some(id), post)
    };
    let numeric = match fold {
        _ if pieces.is_empty() => Wire::absent(),
        Fold::Count => Wire::constant(pieces.len() as f64),
        Fold::Reduce(op, _) => {
            let single = pieces.len() == 1 && matches!(op, Reduction::Min | Reduction::Max);
            let args = operands(ctx, &mut wiring, pieces, PieceKind::Math, single)?;
            if single {
                Wire::own(args[0])
            } else {
                let n = byte(args.len());
                Source::vector(VecOp::Reduce { op, n }, args).into()
            }
        }
    };
    let value = over_math::value(&mut wiring, at.expr, numeric);
    wiring.set_planned(Planned { expr, value });
    Ok(wiring)
}

#[cfg(test)]
#[path = "fold.spec.rs"]
mod spec;

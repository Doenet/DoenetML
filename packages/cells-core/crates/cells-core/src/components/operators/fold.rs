//! `<sum>`, `<product>`, `<mean>`, `<median>`, `<min>`, `<max>`, `<mod>`,
//! `<gcd>`, `<lcm>` and `<count>`, which share their table: a number over
//! their children read as a list (ADR 0041), one operand per text piece and
//! per reference, or, over math, the engine's operator over the operands
//! (ADR 0043).

use super::over_math::{self, Kind};
use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentDef, ComponentType};
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
    flags: [copyable],
    text: Math(expr, value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        expr: by_planner { rendered, expr_of: expr },
        value: by_planner { rendered, expr_of: expr },
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
pub(crate) const PRODUCT: ComponentDef = DEFINITION.with_tags(&["product"]);
/// `<mean>`: the mean of its operands.
pub(crate) const MEAN: ComponentDef = DEFINITION.with_tags(&["mean"]);
/// `<median>`: the median of its operands, numeric only.
pub(crate) const MEDIAN: ComponentDef = DEFINITION.with_tags(&["median"]);
/// `<min>`: the least of its operands.
pub(crate) const MIN: ComponentDef = DEFINITION.with_tags(&["min"]);
/// `<max>`: the greatest of its operands.
pub(crate) const MAX: ComponentDef = DEFINITION.with_tags(&["max"]);
/// `<mod>`: the first of its two operands mod the second.
pub(crate) const MOD: ComponentDef = DEFINITION.with_tags(&["mod"]);
/// `<gcd>`: the greatest common divisor of its integer operands.
pub(crate) const GCD: ComponentDef = DEFINITION.with_tags(&["gcd"]);
/// `<lcm>`: the least common multiple of its integer operands.
pub(crate) const LCM: ComponentDef = DEFINITION.with_tags(&["lcm"]);
/// `<count>`: how many operands it has, a number.
pub(crate) const COUNT: ComponentDef = DEFINITION.with_tags(&["count"]);

/// What a type of this table computes of its operands.
fn reduction(ty: ComponentType) -> Reduction {
    match ty {
        ComponentType::Sum => Reduction::Sum,
        ComponentType::Product => Reduction::Product,
        ComponentType::Mean => Reduction::Mean,
        ComponentType::Median => Reduction::Median,
        ComponentType::Min => Reduction::Min,
        ComponentType::Max => Reduction::Max,
        ComponentType::Mod => Reduction::Mod,
        ComponentType::Gcd => Reduction::Gcd,
        ComponentType::Lcm => Reduction::Lcm,
        _ => unreachable!("<{}> is not planned by this table", ty.tag()),
    }
}

/// What a type of this table is over math, as the engine reads it, from
/// its operands' texts (each in parentheses), as the current core builds
/// it. `None` for one the current core computes over numbers only, and
/// for a `<mod>` of other than two operands, which has no value either
/// way (the current core's is the blank expression).
fn spelled(ty: ComponentType, texts: &[String]) -> Option<String> {
    let n = texts.len();
    let call = |f: &str| format!("{f}({})", texts.join(", "));
    Some(match ty {
        ComponentType::Sum => texts.join(" + "),
        ComponentType::Product => texts.join(" * "),
        ComponentType::Mean => format!("({}) / {n}", texts.join(" + ")),
        ComponentType::Min => call("min"),
        ComponentType::Max => call("max"),
        ComponentType::Gcd => call("gcd"),
        ComponentType::Lcm => call("lcm"),
        ComponentType::Mod if n == 2 => call("mod"),
        _ => return None,
    })
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
    let attrs = Attrs::of(ctx.record());
    let pieces = attrs.children;
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ty);
    let kind = Kind::forced(attrs.forceSymbolic, attrs.forceNumeric);
    // Only the shape of the text matters here: whether there is one.
    let over_math = spelled(ty, &vec![String::new(); pieces.len()]).is_some();
    let expr = if pieces.is_empty() || kind == Kind::Numeric || !over_math {
        Wire::absent()
    } else {
        let args = over_math::operand_exprs(ctx, &pieces)?;
        let id = ctx.operator_expr(&args, |texts| spelled(ty, texts).expect("a type over math"));
        let post = over_math::simplify_post(attrs.simplify, attrs.expand);
        kind.expr(Some(id), post)
    };
    let numeric = if pieces.is_empty() {
        Wire::absent()
    } else if ty == ComponentType::Count {
        Wire::constant(pieces.len() as f64)
    } else {
        let single = pieces.len() == 1 && matches!(ty, ComponentType::Min | ComponentType::Max);
        let args = operands(ctx, &mut wiring, pieces, PieceKind::Math, single)?;
        if single {
            Wire::own(args[0])
        } else {
            let op = VecOp::Reduce {
                op: reduction(ty),
                n: byte(args.len()),
            };
            Source::vector(op, args).into()
        }
    };
    let value = over_math::value(&mut wiring, at.expr, numeric);
    wiring.set_public(Props { expr, value });
    Ok(wiring)
}

#[cfg(test)]
#[path = "fold.spec.rs"]
mod spec;

//! `<variance>` and `<standardDeviation>`, which share their table: a
//! sample's or a population's spread of their children read as a list
//! (ADR 0041), or, over math, its expression (ADR 0043).

use super::over_math::{self, Kind};
use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Reduction, VecOp};

component! {
    /// `<variance population>1 2 $a</variance>`: the variance of its
    /// operands, a sample's unless `population` holds; with none, no value.
    /// Over math it is the expression, the sum of the squares less the
    /// square of the sum over their number, over that number (less one for
    /// a sample's), when `population` is written as a literal. A request
    /// cannot change it, as in the current core.
    tags: ["variance"],
    variant: Reduction::Variance,
    flags: [copyable],
    text: Math(expr, value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        expr: by_planner { rendered, expr_of: expr },
        population: by_planner,
        value: by_planner { rendered, expr_of: expr },
        anchorX: anchor(0),
        anchorY: anchor(1),
    }
    attributes {
        population: Flag(false),
        forceSymbolic: On,
        forceNumeric: On,
        simplify: On,
        expand: On,
    }
    children: List,
    planner: Plan(plan),
}

/// `<standardDeviation>`: the square root of the variance.
pub(crate) const STANDARD_DEVIATION: ComponentDef =
    DEFINITION.variant(&["standardDeviation"], &Reduction::StandardDeviation);

/// The variance of operands spelled `texts` (each in parentheses), as the
/// current core builds it: a population's when `population`, and its
/// square root for a standard deviation. `texts` are the operands twice
/// over, once for the squares and once for the sum, in the order the text
/// spells them, so the operator expression's leaves are the text's.
fn spelled(op: Reduction, population: bool, texts: &[String]) -> String {
    let (squared, summed) = texts.split_at(texts.len() / 2);
    let n = squared.len();
    let squares: Vec<String> = squared.iter().map(|t| format!("{t}^2")).collect();
    let spread = format!(
        "(({}) - ({})^2 / {n}) / {}",
        squares.join(" + "),
        summed.join(" + "),
        if population { n } else { n - 1 }
    );
    if op == Reduction::StandardDeviation {
        format!("sqrt({spread})")
    } else {
        spread
    }
}

/// Its `value`: over numbers, an instruction over `population` and a
/// hidden port per operand ([`operands`]); over math, an `Evaluate` of
/// `expr` ([`over_math`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let reduction = *ty.variant::<Reduction>();
    let attrs = Attrs::of(ctx.record());
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ty);
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    // Over math, a population written as a literal: the expression's
    // shape depends on it.
    let population = over_math::literal(&attrs.population).map(|v| v != 0.0);
    let kind = Kind::forced(attrs.forceSymbolic, attrs.forceNumeric);
    let expr = match population {
        Some(population) if !pieces.is_empty() && kind != Kind::Numeric => {
            let args = over_math::operand_exprs(ctx, &pieces)?;
            let twice = [args.as_slice(), args.as_slice()].concat();
            let id = ctx.operator_expr(&twice, |texts| spelled(reduction, population, texts));
            let post = over_math::simplify_post(attrs.simplify, attrs.expand);
            kind.expr(Some(id), post)
        }
        _ => Wire::absent(),
    };
    let args = operands(ctx, &mut wiring, pieces, PieceKind::Math, false)?;
    let numeric = if args.is_empty() {
        Wire::absent()
    } else {
        let op = VecOp::Reduce {
            op: reduction,
            n: byte(args.len() + 1),
        };
        let inputs = std::iter::once(at.population).chain(args).collect();
        Source::vector(op, inputs).into()
    };
    let value = over_math::value(&mut wiring, at.expr, numeric);
    wiring.set_planned(Planned {
        expr,
        population: Wire::scalar(attrs.population, GivenId::Attr(attr::population, 0)),
        value,
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "variance.spec.rs"]
mod spec;

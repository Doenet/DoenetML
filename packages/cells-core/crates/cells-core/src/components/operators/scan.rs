//! `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`,
//! `<cumulativeMax>` and `<differences>`, which share their table: a list
//! over the prefixes of their children read as a list (ADR 0041), one
//! operand per text piece and per reference, as the current core's scan
//! operators (`MathListOperators.js`) compute them: numbers, or, when an
//! operand can be a non-number, expressions (ADR 0043, per element).

use super::over_math::{self, Kind};
use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::define::*;
use crate::error::Result;
use crate::limits::byte;
use crate::program::{Post, Scan, VecOp};

component! {
    /// `<cumulativeSum>30 45 12</cumulativeSum>`: the running sums of its
    /// operands, each a number, math text or a reference, as a list
    /// (`numbers`, `number1`, ...) as long as its operands: numbers, or,
    /// over math (an operand that can be an expression, or
    /// `forceSymbolic`), the expressions `x`, `x + y`, ..., unless
    /// `forceNumeric`. A request cannot change an entry, as in the current
    /// core.
    tags: ["cumulativeSum"],
    variant: Scan::Sum,
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Math, entries: children,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        forceSymbolic: On,
        forceNumeric: On,
    }
    children: List,
    planner: Plan(plan),
}

/// `<cumulativeProduct>`: the running products of its operands.
pub(crate) const CUMULATIVE_PRODUCT: ComponentDef =
    DEFINITION.variant(&["cumulativeProduct"], &Scan::Product);
/// `<cumulativeMin>`: the running minima of its operands.
pub(crate) const CUMULATIVE_MIN: ComponentDef = DEFINITION.variant(&["cumulativeMin"], &Scan::Min);
/// `<cumulativeMax>`: the running maxima of its operands.
pub(crate) const CUMULATIVE_MAX: ComponentDef = DEFINITION.variant(&["cumulativeMax"], &Scan::Max);
/// `<differences>`: each operand less the one before it, one fewer than
/// its operands.
pub(crate) const DIFFERENCES: ComponentDef = DEFINITION
    .variant(&["differences"], &Scan::Differences)
    .with_entries_less(1);

/// Its entries, each the expression over its prefix when the element is
/// symbolic, else the number ([`Flow::HeldOf`], picked by the type pass,
/// ADR 0043): the numbers are the outputs of one instruction, the type's
/// variant's scan, over a hidden port per operand ([`operands`]); the
/// expressions are operator expressions over every operand, so the type
/// pass types them alike, each spelled over its prefix ([`spelled`]).
/// With no operand (or, for `<differences>`, one) it has no entries.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let scan = *ty.variant::<Scan>();
    let attrs = Attrs::of(ctx.record());
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let op = VecOp::Scan {
        op: scan,
        n: byte(pieces.len().min(u8::MAX as usize)),
    };
    let n = if pieces.is_empty() { 0 } else { op.n_out() };
    let mut wiring = ElemWiring::with_list(ty, n);
    if n > 0 {
        let kind = Kind::forced(attrs.forceSymbolic, attrs.forceNumeric);
        let exprs = match kind {
            Kind::Numeric => None,
            _ => Some(over_math::operand_exprs(ctx, &pieces)?),
        };
        let args = operands(ctx, &mut wiring, pieces, PieceKind::Math, false)?;
        // The numbers, in consecutive hidden ports: the scan's head, then
        // each output after it.
        let scan_head = Source::vector(op, args);
        let head = wiring.hidden(scan_head);
        let mut numbers = vec![head];
        for k in 1..n {
            numbers.push(wiring.hidden(Source::Flow(Flow::VecOut(head, byte(k)))));
        }
        let entries = (0..n)
            .map(|k| match &exprs {
                None => Wire::own(numbers[k]),
                Some(exprs) => {
                    let id = ctx.operator_expr(exprs, |texts| spelled(scan, texts, k));
                    let expr = wiring.hidden_wire(kind.expr(Some(id), Post::None));
                    Source::held_of(expr, numbers[k]).into()
                }
            })
            .collect();
        wiring.set_entries(entries);
    }
    wiring.set_planned(Planned {});
    Ok(wiring)
}

/// Entry `k` of `scan` over operands spelled `texts`, as the current core
/// builds it: a sum or product of the first `k + 1`, the first alone; a
/// `min` or `max` of them, the first alone; operand `k + 1` less operand
/// `k`.
fn spelled(scan: Scan, texts: &[String], k: usize) -> String {
    let prefix = &texts[..=k.min(texts.len() - 1)];
    match scan {
        Scan::Sum => prefix.join(" + "),
        Scan::Product => prefix.join(" * "),
        Scan::Min | Scan::Max if k == 0 => prefix[0].clone(),
        Scan::Min => format!("min({})", prefix.join(", ")),
        Scan::Max => format!("max({})", prefix.join(", ")),
        Scan::Differences => format!("{} - {}", texts[k + 1], texts[k]),
    }
}

#[cfg(test)]
#[path = "scan.spec.rs"]
mod spec;

//! `<sort>` and `<shuffle>` of numbers: a list of numbers over their
//! children read as a list (ADR 0041), one per text piece and per
//! reference, in increasing order or in an order drawn at load. The
//! current core sorts and shuffles components of any type (maths, texts,
//! points); here only numbers are, and `type` other than `number` is
//! refused, as is a piece that is no number.

use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::ComponentDef;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;

component! {
    /// `<sort>5 3 1 $a</sort>`: its operands in increasing order, a list
    /// of numbers (`numbers`, `number1`, ...). A request cannot change an
    /// entry.
    tags: ["sort"],
    variant: Order::Increasing,
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number, entries: children,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        r#type: Text,
    }
    children: List,
    planner: Plan(plan),
}

/// `<shuffle>`: its operands in an order drawn at load from the document
/// seed (a seeded permutation, ADR 0041 decision 7), which no student
/// can change; the values themselves follow their operands.
pub(crate) const SHUFFLE: ComponentDef = DEFINITION.variant(&["shuffle"], &Order::Drawn);

/// The order a type of this table puts its operands in.
#[derive(PartialEq)]
pub(crate) enum Order {
    /// Increasing: a `<sort>`'s.
    Increasing,
    /// Drawn at load: a `<shuffle>`'s.
    Drawn,
}

/// Its entries: one instruction over a hidden port per operand
/// ([`operands`]), and for a `<shuffle>` a draw (a scope constant) before
/// them.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    if let Some(t) = &attrs.r#type
        && !t.trim().eq_ignore_ascii_case("number")
    {
        return Err(Error::Unsupported(format!(
            "<{} type=\"{}\">: only numbers are sorted and shuffled",
            ty.tag(),
            t.trim()
        )));
    }
    let pieces = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let n = pieces.len();
    let mut wiring = ElemWiring::with_list(ty, n);
    if n > 0 {
        let shuffle = *ty.variant::<Order>() == Order::Drawn;
        let draw = shuffle.then(|| wiring.hidden(Source::Leaf(Leaf::Scope(ScopeConst::Draw))));
        let mut args: Vec<Port> = draw.into_iter().collect();
        args.extend(operands(
            ctx,
            &mut wiring,
            pieces,
            PieceKind::Number,
            false,
        )?);
        let op = if shuffle {
            VecOp::Shuffle { n: byte(n) }
        } else {
            VecOp::Sort {
                n: byte(n),
                decreasing: false,
            }
        };
        let head = wiring.entry(0);
        wiring.set_entries(ElemWiring::vector_from(head, op, args, &[]));
    }
    wiring.set_planned(Planned {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "sort.spec.rs"]
mod spec;

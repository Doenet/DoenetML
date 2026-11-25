//! `<binCounts>`: how many of its operands fall in each bin between the
//! cut points `bins` names (ADR 0078), as the current core's
//! `CountOperators.js` counts them (`countValuesInBins`): a list of
//! numbers, one per bin, its children read as a list (ADR 0041), bare
//! text as numbers or math, the way `<sum>` reads its operands.
//!
//! Its count is the number of bins, `n - 1` for `n` cut points, a static
//! sequence. Where `bins` describes no bins the current core gives no
//! counts with a warning; here that is decided when the document is
//! compiled, from what the cut points are written as: none, fewer than
//! two, or written literals that do not ascend (or are no number) give
//! no entries and the current core's warning. Cut points that follow a
//! value and come not to ascend make every count the missing value
//! ([`VecOp::BinCounts`]), the count unchanged (ADR 0078). Operands that
//! are texts are no numbers to count: every count is 0, with the
//! current core's warning.

use super::sort::real_number;
use super::{PieceKind, operands};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::limits::byte;
use crate::program::VecOp;

component! {
    /// `<binCounts bins="0 1 2">0 0.5 1 1.5 2</binCounts>`: how many of
    /// its operands fall in each bin between consecutive cut points
    /// (`2, 3`), as a list of numbers (`numbers`, `number1`, ...): a bin
    /// `[a, b)`, the last also holding its upper cut point, or with
    /// `closed="right"` `(a, b]`, the first also holding its lower one.
    /// A request cannot change a count.
    tags: ["binCounts"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        bins: Entries,
        closed: Text,
    }
    counted_entries { pieces: bins, count: one_less }
    children: List,
    planner: Plan(plan),
}

/// Its cut points, which it counts one bin between each two of (ADR
/// 0078).
fn bins(record: &Record) -> Vec<ListPiece> {
    Attrs::of(record).bins
}

/// One bin between each two cut points; none where written cut points
/// do not ascend ([`written_ascend`]).
fn one_less(record: &Record, n: usize) -> usize {
    if written_ascend(&Attrs::of(record).bins) == Some(false) {
        0
    } else {
        n.saturating_sub(1)
    }
}

/// Whether cut points all written as text ascend, each a number; None
/// when one follows a value.
fn written_ascend(pieces: &[ListPiece]) -> Option<bool> {
    let written: Option<Vec<Option<f64>>> = pieces
        .iter()
        .map(|p| match p {
            ListPiece::Text(text) => Some(real_number(text)),
            _ => None,
        })
        .collect();
    let written = written?;
    Some(written.iter().all(Option::is_some) && written.windows(2).all(|w| w[1] >= w[0]))
}

/// `bins` is not given (`doenet-w0138`).
const MISSING_BINS: &str = "doenet-w0138";
/// `bins` has fewer than two cut points (`doenet-w0139`).
const TOO_FEW: &str = "doenet-w0139";
/// An operand is no number (`doenet-w0140`).
const NOT_NUMERIC: &str = "doenet-w0140";
/// The cut points do not ascend (`doenet-w0141`).
const DECREASING: &str = "doenet-w0141";
/// `closed` names neither end.
const INVALID_CLOSED: &str = "cells-invalid-closed";

/// One count per bin, the outputs of [`VecOp::BinCounts`] over the cut
/// points and the operands; none, with a warning, where `bins` describes
/// no bins.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let ty = ctx.component_type();
    let attrs = Attrs::of(ctx.record());
    let right = match attrs
        .closed
        .as_deref()
        .map(|s| s.trim().to_ascii_lowercase())
    {
        None => false,
        Some(s) if s == "left" => false,
        Some(s) if s == "right" => true,
        Some(s) => {
            ctx.warn(
                INVALID_CLOSED,
                &format!("Invalid closed {s} for binCounts component: counting as closed=\"left\""),
            );
            false
        }
    };
    let none = |ctx: &mut PlanCtx<'_, '_>, code: &'static str, message: &str| {
        ctx.warn(code, message);
        let mut wiring = ElemWiring::with_list(ty, 0);
        wiring.set_planned(Planned {});
        Ok(wiring)
    };
    if attrs.bins.is_empty() {
        return none(
            ctx,
            MISSING_BINS,
            "`binCounts` has no `bins` cut points, so there are no intervals to count into and it gives no counts.",
        );
    }
    // Cut points written as literals are known now: ones that do not
    // ascend, or are no number, describe no bins.
    let ascend = written_ascend(&attrs.bins);
    let edges = ctx.list_entries(attrs.bins, f64::INFINITY)?;
    if edges.len() < 2 {
        return none(
            ctx,
            TOO_FEW,
            &format!(
                "`bins` needs at least 2 cut points to define an interval, but received {}.",
                edges.len()
            ),
        );
    }
    if ascend == Some(false) {
        return none(
            ctx,
            DECREASING,
            "Each `bins` cut point must be a number at least as large as the one before it, but one is not a number or is smaller than its predecessor, so no counts were produced.",
        );
    }
    let n = edges.len() - 1;
    let values = ctx.list_entries(attrs.children, f64::INFINITY)?;
    let mut wiring = ElemWiring::with_list(ty, n);
    if values
        .iter()
        .any(|e| ctx.entry_kind(e) == Some(ValueKind::Text))
    {
        ctx.warn(
            NOT_NUMERIC,
            "`binCounts` can only count numeric values into bins, but not every value it was given is numeric. All counts are 0.",
        );
        wiring.set_entries((0..n).map(|_| Wire::constant(0.0)).collect());
        wiring.set_planned(Planned {});
        return Ok(wiring);
    }
    if edges.len() + values.len() > crate::limits::MAX_VEC_IN {
        return Err(Error::Unsupported(format!(
            "<{}> of more than {} cut points and operands together",
            ty.tag(),
            crate::limits::MAX_VEC_IN
        )));
    }
    let op = VecOp::BinCounts {
        edges: byte(edges.len()),
        values: byte(values.len()),
        right,
    };
    let mut args = operands(ctx, &mut wiring, edges, PieceKind::Math, false)?;
    args.extend(operands(ctx, &mut wiring, values, PieceKind::Math, false)?);
    let counts = wiring.hidden_vector(op, args);
    wiring.set_entries(counts.into_iter().map(Wire::own).collect());
    wiring.set_planned(Planned {});
    Ok(wiring)
}

#[cfg(test)]
#[path = "bin_counts.spec.rs"]
mod spec;

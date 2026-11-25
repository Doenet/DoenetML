//! `<sortIndices>`: the positions of its operands in the order `<sort>`
//! puts them (NumPy's `argsort`), as the current core's `SortIndices.js`
//! reports the permutation `<sort>` applies. It shares `<sort>`'s reading
//! of the operands and its order port ([`super::sort::wire_order`]), so
//! the two never disagree; its entries are that order, numbers, which no
//! request changes.

use super::sort::{How, Out, wire_order};
use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<sortIndices>30 10 20</sortIndices>`: the position (from 1) of
    /// the operand that comes first in increasing order, then second, ...
    /// (`2, 3, 1`), as a list of numbers (`numbers`, `number1`, ...),
    /// ordered as `<sort>` orders them (`type`, `sortByComponent`,
    /// `sortVectorsBy`, `sortByProp`).
    tags: ["sortIndices"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: list_len { rendered },
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
        sortByComponent: Literal(1.0),
        sortVectorsBy: Text,
        sortByProp: Text,
    }
    children: List,
    planner: Plan(plan),
}

/// The order port of [`wire_order`], as the entries.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let how = How {
        r#type: attrs.r#type,
        sortByComponent: attrs.sortByComponent?,
        sortVectorsBy: attrs.sortVectorsBy,
        sortByProp: attrs.sortByProp,
        children: attrs.children,
    };
    let mut wiring = wire_order(ctx, how, Out::Indices)?;
    wiring.set_planned(Planned {});
    Ok(wiring)
}

#[cfg(test)]
#[path = "sort_indices.spec.rs"]
mod spec;

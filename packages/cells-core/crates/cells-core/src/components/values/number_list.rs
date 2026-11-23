//! `<numberList>`: a static sequence of numbers (ADR 0041), its definition and
//! its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<numberList>`: one entry per piece of its text (split at the spaces
    /// outside any bracket pair) and per reference among its children, in
    /// order; its entries are its list, `numbers` (`number1`, ...), and
    /// `numComponents` how many there are.
    tags: ["numberList"],
    flags: [copyable],
    default_prop: numbers,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [numbers, values],
        item: number,
        values: number of Number, max_by: maxNumber, entries: children,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    attributes {
        maxNumber: Literal(f64::INFINITY),
        // Read as the children are parsed: whether a `<math>` child that
        // is a list gives its items as entries (`mergeMathLists`).
        mergeMathLists: LiteralFlag,
    }
    children: List,
    planner: Plan(plan),
}

/// Plans the list from its children ([`super::plan_list`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let (mut wiring, n) = super::plan_list(ctx, attrs.children, attrs.maxNumber?)?;
    wiring.set_public(Props {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "number_list.spec.rs"]
mod spec;

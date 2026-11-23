//! `<booleanList>`: a static sequence of booleans (ADR 0041), its definition and
//! its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<booleanList>`: one entry per piece of its text (split at the spaces
    /// outside any bracket pair) and per reference among its children, in
    /// order; its entries are its list, `booleans` (`boolean1`, ...), and
    /// `numComponents` how many there are.
    tags: ["booleanList"],
    flags: [copyable],
    default_prop: booleans,
    props {
        numComponents: by_planner { rendered },
        text: by_planner { text },
    }
    list {
        names: [booleans, values],
        item: boolean,
        values: boolean of Boolean, max_by: maxNumber, entries: children,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
    attributes {
        maxNumber: Literal(f64::INFINITY),
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
        text: super::joined_entries(&wiring, n, true).into(),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "boolean_list.spec.rs"]
mod spec;

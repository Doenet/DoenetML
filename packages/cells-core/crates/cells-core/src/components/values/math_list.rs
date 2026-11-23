//! `<mathList>`: a static sequence of expressions (ADR 0041), its definition
//! and its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<mathList>`: one entry per piece of its text (split at the spaces
    /// outside any bracket pair), each an expression a write may change,
    /// and per entry each reference and element child among its children
    /// names, in order; its entries are its list, `maths` (`math1`, ...),
    /// and `numComponents` how many there are, at most `maxNumber`.
    tags: ["mathList"],
    flags: [copyable],
    default_prop: maths,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [maths, values],
        item: math,
        values: math of Math, max_by: maxNumber, entries: children,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    // Whether a renderer shows the entries separated by commas.
    presentation { asList }
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
#[path = "math_list.spec.rs"]
mod spec;

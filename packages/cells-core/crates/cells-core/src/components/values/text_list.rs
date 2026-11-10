//! `<textList>`: a static sequence of texts (ADR 0041), its definition and
//! its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<textList>`: one entry per piece of its text (split at the spaces
    /// outside any bracket pair) and per reference among its children, in
    /// order; its entries are its list, `texts` (`text1`, ...), and
    /// `numComponents` how many there are.
    tags: ["textList"],
    flags: [copyable],
    default_prop: texts,
    props {
        numComponents: by_planner { rendered },
    }
    list {
        names: [texts, values],
        item: text,
        values: text of Text,
        rendered: true,
    }
    alternate_names {
        numValues: numComponents,
    }
    children: List,
    planner: Plan(plan),
}

/// Plans the list from its children ([`super::plan_list`]).
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let pieces = Attrs::of(ctx.record()).children;
    let (mut wiring, n) = super::plan_list(ctx, pieces)?;
    wiring.set_public(Props {
        numComponents: Wire::constant(n as f64),
    });
    Ok(wiring)
}

#[cfg(test)]
#[path = "text_list.spec.rs"]
mod spec;

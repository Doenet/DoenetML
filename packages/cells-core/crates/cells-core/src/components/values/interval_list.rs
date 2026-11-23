//! `<intervalList>`: a static sequence of intervals (ADR 0041, step 2),
//! its definition and its planner.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<intervalList>`: a `<mathList>` whose pairs are intervals (ADR
    /// 0041, decision 8): one entry per piece of its text (`(1, 2)` the
    /// open interval, `[1, 2]` the closed one, `(1, 2]` as written), and
    /// per entry each reference and element child among its children
    /// names; its entries are `intervals` (`interval1`, ...), and
    /// `numComponents` how many there are, at most `maxNumber`.
    tags: ["intervalList"],
    flags: [copyable],
    default_prop: intervals,
    props {
        numComponents: list_len { rendered },
    }
    list {
        names: [intervals, values],
        item: interval,
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
    }
    children: List,
    planner: Plan(plan),
}

/// Plans the list from its children ([`super::plan_list_as`]), its pairs
/// made intervals.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let attrs = Attrs::of(ctx.record());
    let (mut wiring, _) = super::plan_list_as(ctx, attrs.children, attrs.maxNumber?, true)?;
    wiring.set_planned(Planned {});
    Ok(wiring)
}

#[cfg(test)]
#[path = "interval_list.spec.rs"]
mod spec;

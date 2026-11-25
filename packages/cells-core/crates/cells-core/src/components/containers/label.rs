//! `<label>`: a component's label (ADR 0024), a container that stands as
//! its children, as a `<group>` does, with its text as a value a
//! reference reads (ADR 0075): `$P.label` names a component's `<label>`
//! child, and a bare reference to a label reads as a `<text>` of it.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<label>Q is $n</label>`: its children, drawn as a group's, and
    /// `value`, their text joined in the tick (ADR 0053): a text piece as
    /// written, a reference's or an element child's value as a join writes
    /// it. With an element child that has no value (an `<m>`), `value` is
    /// missing.
    tags: ["label"],
    flags: [container, copyable],
    reads_as: Text,
    structure: Transparent,
    list_item: Naming,
    default_prop: value,
    props {
        value: by_planner { text },
    }
    presentation { asList }
    planner: Plan(plan),
}

/// Its value: its children's text joined ([`PlanCtx::children_joined`]).
fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let mut wiring = ElemWiring::of(ctx.component_type());
    let value = match ctx.children_joined(&mut wiring)? {
        Some(source) => Wire::from(source),
        None => Wire::absent(),
    };
    wiring.set_planned(Planned { value });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "label.spec.rs"]
mod spec;

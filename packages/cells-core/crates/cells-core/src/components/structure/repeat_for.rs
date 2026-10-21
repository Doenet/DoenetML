//! `<repeat for>`: its definition and its planner (ADR 0016). How a
//! repeat over a list is planned is the machinery in
//! `compile/iterates.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::Result;

/// `<repeat for="$fi.allIteratesWithInitial" valueName="x" indexName="i">`:
/// a repeat over a list, one iteration per item; `$x` is the item, a
/// tuple. Its `count` (the structural cell) aliases the list's length.
/// The lists it takes are a `<functionIterates>`' `allIteratesWithInitial`
/// and `iterates`.
pub(in crate::components) const REPEAT_FOR: ComponentTypeInfo = info(&["repeat"], REPEAT_FOR_PROPS);

const REPEAT_FOR_PROPS: &[PropDef] = &props([planned("count")]);

typed_props!(REPEAT_FOR_PROPS { count });

/// `count` aliases the list's length, and the item of each iteration
/// aliases the matching iterate.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    ctx.plan_repeat_for()
}

//! `<functionIterates>`: its definition and its planner (ADR 0016). How
//! its iterates are built as a repeat is the machinery in
//! `compile/iterates.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::Result;

/// `<functionIterates function="$f" initialValue="$x0" numIterates="n">`:
/// the initial value and `n` applications of `f`. Built like a repeat:
/// iteration k holds one hidden tuple, the initial value when k is 1 and
/// `f` of iteration k-1's tuple otherwise, lowered to numeric operators.
/// `count` (the structural cell) is `n + 1`; `allIteratesWithInitial` and
/// `iterates`, as numbers, are the lengths of those lists.
pub(in crate::components) const FUNCTION_ITERATES: ComponentTypeInfo =
    info(&["functionIterates"], FUNCTION_ITERATES_PROPS);

const FUNCTION_ITERATES_PROPS: &[PropDef] = &props([
    attr("numIterates", 0.0),
    computed("numIteratesFloor", OpSpec::Floor, &["numIterates"]),
    computed(
        "numIteratesClamped",
        OpSpec::Clamp {
            lo: 0.0,
            hi: 10_000.0,
        },
        &["numIteratesFloor"],
    ),
    computed(
        "iterates",
        OpSpec::NanTo { k: 0.0 },
        &["numIteratesClamped"],
    ),
    computed("count", OpSpec::Offset { k: 1.0 }, &["iterates"]),
    planned("allIteratesWithInitial"),
]);

typed_props!(FUNCTION_ITERATES_PROPS {
    numIterates,
    numIteratesFloor,
    numIteratesClamped,
    iterates,
    count,
    allIteratesWithInitial
});

pub const ITERATES: usize = Props::AT.iterates;
pub const COUNT: usize = Props::AT.count;
pub const ALL: usize = Props::AT.allIteratesWithInitial;

/// The count chain from the prop table, then each iteration's tuple.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    ctx.plan_function_iterates()
}

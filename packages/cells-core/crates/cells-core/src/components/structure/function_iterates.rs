//! `<functionIterates>`: its definition and its planner (ADR 0016). How
//! its iterates are built as a repeat is the machinery in
//! `compile/iterates.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;
use crate::program::VecOp;

component! {
    /// `<functionIterates function="$f" initialValue="$x0" numIterates="n">`:
    /// the initial value and `n` applications of `f`. Built like a repeat:
    /// iteration k holds one hidden tuple, the initial value when k is 1 and
    /// `f` of iteration k-1's tuple otherwise, lowered to numeric operators.
    /// `count` (the structural cell) is `n + 1`; `allIteratesWithInitial` and
    /// `iterates`, as numbers, are the lengths of those lists.
    tags: ["functionIterates"],
    renders: Never,
    props {
        numIterates: attr(0.0),
        numIteratesFloor: computed(OpSpec::Floor, [numIterates]),
        numIteratesClamped: computed(OpSpec::Vec(VecOp::Clamp), [numIteratesFloor, (0.0), (10_000.0)]),
        iterates: computed(OpSpec::NanTo, [numIteratesClamped, (0.0)]),
        count: computed(OpSpec::Add, [iterates, (1.0)]),
        allIteratesWithInitial: by_planner,
    }
    planner: Whole(plan),
}

pub const ITERATES: usize = Props::AT.iterates;
pub const COUNT: usize = Props::AT.count;
pub const ALL: usize = Props::AT.allIteratesWithInitial;

/// The count chain from the prop table, then each iteration's tuple.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    ctx.plan_function_iterates()
}

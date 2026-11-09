//! `<functionIterates>`: its definition and its planner.

use crate::components::define::*;
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
    structure: Repeat { count: count },
    props {
        numIterates: attr(0.0),
        numIteratesFloor: computed(OpSpec::Floor, [numIterates]),
        numIteratesClamped: computed(OpSpec::Vec(VecOp::Clamp), [numIteratesFloor, (0.0), (10_000.0)]),
        iterates: computed(OpSpec::NanTo, [numIteratesClamped, (0.0)]),
        count: computed(OpSpec::Add, [iterates, (1.0)]),
        allIteratesWithInitial: by_planner,
    }
    machinery: FunctionIterates,
}

/// The position of `iterates`: `n`, the number of applications of `f`, clamped.
pub const ITERATES: usize = Props::AT.iterates;
/// The position of `count`: `n + 1`, the structural cell.
pub const COUNT: usize = Props::AT.count;
/// The position of `allIteratesWithInitial`: as a number, how many values that list
/// holds.
pub const ALL: usize = Props::AT.allIteratesWithInitial;

//! `<answer>`: its definition and its planner (ADR 0016). How an answer
//! compares its responses, with its inputs, awards and whens, is the
//! machinery in `compile/answer.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::error::Result;

component! {
    /// `<answer>`: `submitted` is an essential math cell that a submit request
    /// sets to the response; `credit` compares it with `correct`
    /// (`symbolicEquality`: as written), or, with `<award>` children, is the
    /// most any award gives. `numSubmissions` counts submits. See
    /// `compile/answer.rs` for the forms an answer takes.
    tags: ["answer"],
    flags: [copyable, symbolic],
    default_prop: credit,
    props {
        response: attr(NO_VALUE) { ref_prop: expr, read_by_action },
        correct: children,
        // A submit writes these (`Document::submit`).
        submitted: attr(NO_VALUE) { written_by_action },
        credit: by_planner { rendered, score },
        weight: attr(1.0),
        numSubmissions: attr(0.0) { written_by_action, rendered },
    }
    alternate_names {
        // The current core's name for `credit`, so `$ans.creditAchieved`
        // resolves.
        creditAchieved: credit,
    }
    planner: Whole(plan),
}

pub const RESPONSE: usize = Props::AT.response;
pub const CORRECT: usize = Props::AT.correct;
pub const SUBMITTED: usize = Props::AT.submitted;
pub const CREDIT: usize = Props::AT.credit;
pub const WEIGHT: usize = Props::AT.weight;
pub const NUM_SUBMISSIONS: usize = Props::AT.numSubmissions;

/// Plans the answer with its inputs, awards and whens.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    ctx.plan_answer()
}

//! `<answer>`: its definition and its planner.

use crate::compile::api::*;
use crate::components::define::*;

component! {
    /// `<answer>`: `submitted` is an essential math cell that a submit request
    /// sets to the response; `credit` compares it with `correct`
    /// (`symbolicEquality`: as written), or, with `<award>` children, is the
    /// most any award gives. `numSubmissions` counts submits.
    tags: ["answer"],
    flags: [copyable, symbolic],
    scored: Item(credit, weight),
    submit: Counted(response, submitted, numSubmissions),
    default_prop: credit,
    props {
        response: attr(NO_VALUE) { ref_prop: expr, read_by_action, expr_when: submitted },
        correct: children { expr_when: submitted },
        // A submit writes these (`Document::submit`).
        submitted: attr(NO_VALUE) { written_by_action, expr_when: submitted },
        credit: by_planner { rendered, score },
        weight: attr(1.0),
        numSubmissions: attr(0.0) { written_by_action, rendered },
    }
    alternate_names {
        // The current core's name for `credit`, so `$ans.creditAchieved`
        // resolves.
        creditAchieved: credit,
    }
    machinery: Answer,
}

/// The position of `response`: the live response a submit takes.
pub const RESPONSE: usize = Props::AT.response;
/// The position of `correct`: what the response is compared with.
pub const CORRECT: usize = Props::AT.correct;
/// The position of `submitted`: the response as last submitted.
pub const SUBMITTED: usize = Props::AT.submitted;
/// The position of `credit`: the credit the submitted response earns.
pub const CREDIT: usize = Props::AT.credit;
/// The position of `weight`: how much its credit counts in an aggregate.
pub const WEIGHT: usize = Props::AT.weight;
/// The position of `numSubmissions`: how many submits there have been.
pub const NUM_SUBMISSIONS: usize = Props::AT.numSubmissions;

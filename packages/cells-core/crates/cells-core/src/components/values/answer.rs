//! `<answer>`: its definition and its planner (ADR 0016). How an answer
//! compares its responses, with its inputs, awards and whens, is the
//! machinery in `compile/answer.rs`.

use crate::compile::api::*;
use crate::components::define::*;
use crate::components::{ComponentTypeInfo, PropDef};
use crate::error::Result;

/// `<answer>`: `submitted` is an essential math cell that a submit request
/// sets to the response; `credit` compares it with `correct`
/// (`symbolicEquality`: as written), or, with `<award>` children, is the
/// most any award gives. `numSubmissions` counts submits. See
/// `compile/answer.rs` for the forms an answer takes.
pub(in crate::components) const ANSWER: ComponentTypeInfo = info(&["answer"], ANSWER_PROPS)
    .copyable()
    .symbolic()
    .default_prop("credit")
    // The current core's name for `credit`, so `$ans.creditAchieved` resolves.
    .aliases(&[("creditAchieved", "credit")]);

const ANSWER_PROPS: &[PropDef] = &props([
    attr("response", f64::NAN).ref_prop("expr"),
    children("correct"),
    attr("submitted", f64::NAN),
    planned("credit"),
    attr("weight", 1.0),
    attr("numSubmissions", 0.0),
]);

pub const RESPONSE: usize = at(ANSWER_PROPS, "response");
pub const CORRECT: usize = at(ANSWER_PROPS, "correct");
pub const SUBMITTED: usize = at(ANSWER_PROPS, "submitted");
pub const CREDIT: usize = at(ANSWER_PROPS, "credit");
pub const WEIGHT: usize = at(ANSWER_PROPS, "weight");
pub const NUM_SUBMISSIONS: usize = at(ANSWER_PROPS, "numSubmissions");

/// Plans the answer with its inputs, awards and whens.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    ctx.plan_answer()
}

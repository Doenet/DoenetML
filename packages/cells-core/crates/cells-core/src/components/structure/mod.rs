//! Repeat, sequence value, function iterates, collect, conditional
//! content, case, select and select from sequence: types whose children the builder makes, so they shape the document
//! rather than hold a value.

use super::define::*;
use crate::compile::api::PlanCtx;
use crate::error::{Error, Result};

pub mod collect;
pub mod conditional_content;
pub mod function_iterates;
pub mod repeat_for;
pub mod select;
pub mod select_from_sequence;

/// Plans a choice, `<conditionalContent>` or `<select>`. A choice cannot
/// be extended: its interface names are referenced instead.
fn plan_choice(ctx: &mut PlanCtx<'_, '_>) -> Result<()> {
    if ctx.extend().is_some() {
        return Err(Error::Banned(format!(
            "extend on a <{}>: reference its interface names instead",
            ctx.component_type().tag()
        )));
    }
    ctx.plan_choice()
}

pub mod repeat_for_sequence {
    use super::*;

    component! {
        /// `<repeatForSequence>`: its children are every iteration's expanded
        /// template, flattened; its `count` prop is the structural cell. The
        /// iteration count is derived like any other cell and read by the
        /// builder (see `CONTEXT.md`, structural cell):
        ///
        /// ```text
        /// lengthFromTo = floor((to - from) / step + 1 + 1e-10)
        /// count        = min(max(floor(length or lengthFromTo), 0), maxNumber)
        /// ```
        ///
        /// A NaN count means zero iterations.
        tags: ["repeatForSequence"],
        props {
            from: attr(1.0),
            to: attr(NO_VALUE),
            step: attr(1.0),
            maxNumber: attr(10_000.0),
            span: computed(OpSpec::Sub, [to, from]),
            spanSteps: computed(OpSpec::Div, [span, step]),
            spanStepsEps: computed(OpSpec::Add, [spanSteps, (1.0 + 1e-10)]),
            lengthFromTo: computed(OpSpec::Floor, [spanStepsEps]),
            length: attr_or(lengthFromTo),
            lengthFloor: computed(OpSpec::Floor, [length]),
            lengthNonNeg: computed(OpSpec::Max, [lengthFloor, (0.0)]),
            count: computed(OpSpec::Min, [lengthNonNeg, maxNumber]),
        }
        presentation { asList }
        planner: Props,
    }
}

pub mod sequence_value {
    use super::*;

    component! {
        /// The hidden component behind a repeat's `valueName`: `from + (k-1) *
        /// step`. `from` and `step` alias the repeat's; `k` is the
        /// iteration's 1-based position, a scope constant.
        tags: ["sequenceValue"],
        flags: [copyable, internal],
        default_prop: value,
        props {
            from: attr(1.0),
            step: attr(1.0),
            k: attr(1.0),
            km1: computed(OpSpec::Add, [k, (-1.0)]),
            scaled: computed(OpSpec::Mul, [km1, step]),
            value: computed(OpSpec::Add, [scaled, from]) { rendered },
        }
        planner: Props,
    }

    pub const FROM: usize = Props::AT.from;
    pub const STEP: usize = Props::AT.step;
    pub const K: usize = Props::AT.k;
}

pub mod case {
    use super::*;

    component! {
        /// One built branch of a reactive choice: `active` is 1 while it is the
        /// chosen one. Its children are the branch's content. A renderer shows
        /// the children of an active case only.
        tags: ["case"],
        props {
            active: by_planner { rendered },
        }
        planner: Props,
    }

    pub const ACTIVE: usize = Props::AT.active;
}

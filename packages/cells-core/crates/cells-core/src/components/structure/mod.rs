//! Repeat, sequence value, collect, conditional content, case and select:
//! types whose children the builder makes, so they shape the document
//! rather than hold a value.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};
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

/// `<repeatForSequence>`: its children are every iteration's expanded
/// template, flattened; its `count` prop is the structural cell. The
/// iteration count is derived like any other cell and read by the builder
/// (see `CONTEXT.md`, structural cell):
///
/// ```text
/// lengthFromTo = floor((to - from) / step + 1 + 1e-10)
/// count        = min(max(floor(length or lengthFromTo), 0), maxNumber)
/// ```
///
/// A NaN count means zero iterations.
pub(super) const REPEAT_FOR_SEQUENCE: ComponentTypeInfo =
    info(&["repeatForSequence"], REPEAT_PROPS);

const REPEAT_PROPS: &[PropDef] = &props([
    attr("from", 1.0),
    attr("to", f64::NAN),
    attr("step", 1.0),
    attr("maxNumber", 10_000.0),
    computed("span", OpSpec::Sub, &["to", "from"]),
    computed("spanSteps", OpSpec::Div, &["span", "step"]),
    computed(
        "spanStepsEps",
        OpSpec::Offset { k: 1.0 + 1e-10 },
        &["spanSteps"],
    ),
    computed("lengthFromTo", OpSpec::Floor, &["spanStepsEps"]),
    attr_or("length", "lengthFromTo"),
    computed("lengthFloor", OpSpec::Floor, &["length"]),
    computed(
        "lengthNonNeg",
        OpSpec::Clamp {
            lo: 0.0,
            hi: f64::INFINITY,
        },
        &["lengthFloor"],
    ),
    computed("count", OpSpec::Min, &["lengthNonNeg", "maxNumber"]),
]);

/// The hidden component behind a repeat's `valueName`:
/// `from + (k-1) * step`. `from` and `step` alias the repeat's; `k` is the
/// fixed 1-based position.
pub(super) const SEQUENCE_VALUE: ComponentTypeInfo = info(&["sequenceValue"], SEQUENCE_VALUE_PROPS)
    .copyable()
    .internal()
    .default_prop("value");

const SEQUENCE_VALUE_PROPS: &[PropDef] = &props([
    attr("from", 1.0),
    attr("step", 1.0),
    attr("k", 1.0),
    computed("km1", OpSpec::Offset { k: -1.0 }, &["k"]),
    computed("scaled", OpSpec::Mul, &["km1", "step"]),
    computed("value", OpSpec::Add, &["scaled", "from"]),
]);

pub mod sequence_value {
    use super::*;

    typed_props!(SEQUENCE_VALUE_PROPS {
        from,
        step,
        k,
        km1,
        scaled,
        value
    });

    pub const FROM: usize = Props::AT.from;
    pub const STEP: usize = Props::AT.step;
    pub const K: usize = Props::AT.k;
}

/// One built branch of a reactive choice: `active` is 1 while it is the
/// chosen one. Its children are the branch's content. A renderer shows
/// the children of an active case only.
pub(super) const CASE: ComponentTypeInfo = info(&["case"], CASE_PROPS);

const CASE_PROPS: &[PropDef] = &props([by_planner("active")]);

pub mod case {
    use super::*;
    pub const ACTIVE: usize = at(CASE_PROPS, "active");
}

//! Number, boolean, text, op, math, evaluate, function, derivative and
//! answer (with its award, when and response): types that hold a value,
//! numeric or symbolic. Function and derivative are `symbolic`, planned as
//! math cells (`curve.rs`); so is answer (`answer.rs`). Each type with a
//! planner is in its own file, its definition and its planner together
//! (ADR 0016); tuple and response, which no tag makes, refuse here.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};
use crate::compile::api::PlanCtx;
use crate::error::{Error, Result};
use crate::program::SymKind;

pub mod answer;
pub mod award;
pub mod boolean;
pub mod curve;
pub mod math;
pub mod text;
pub mod when;

/// `<number>`.
pub(super) const NUMBER: ComponentTypeInfo = info(&["number"], NUMBER_PROPS)
    .copyable()
    .default_prop("value");

const NUMBER_PROPS: &[PropDef] = &props([children("value")]);

pub mod number {
    use super::*;

    typed_props!(NUMBER_PROPS { value });

    pub const VALUE: usize = Props::AT.value;
}

/// Prototype-only tag that applies a numeric operator to referenced cells;
/// its tag is registered only with the `testing` feature (tests and the
/// golden documents use it to exercise single operators).
pub(super) const OP: ComponentTypeInfo = info(&["op"], OP_PROPS)
    .copyable()
    .test_only()
    .default_prop("value");

const OP_PROPS: &[PropDef] = &props([derived("value")]);

/// `<evaluate function="$m" input="$a"/>`: the math's expression with
/// its free symbol set to the input.
pub(super) const EVALUATE: ComponentTypeInfo = info(&["evaluate"], EVALUATE_PROPS)
    .copyable()
    .default_prop("value");

const EVALUATE_PROPS: &[PropDef] = &props([
    attr("function", f64::NAN).ref_prop("expr"),
    attr("input", f64::NAN),
    computed(
        "value",
        OpSpec::Sym(SymKind::EvalAt),
        &["function", "input"],
    ),
]);

/// One response of an answer whose awards reference an input: `response`
/// aliases the input's live expression, `submitted` is the essential copy a
/// submit takes, and `value` evaluates it. A `$mi` inside a `<when>`
/// resolves here, so credit changes only on submit. Made by the builder.
pub(super) const RESPONSE: ComponentTypeInfo = info(&["response"], RESPONSE_PROPS)
    .internal()
    .default_prop("value");

const RESPONSE_PROPS: &[PropDef] =
    &props([planned("response"), planned("submitted"), planned("value")]);

pub mod response {
    use super::*;

    typed_props!(RESPONSE_PROPS {
        response,
        submitted,
        value
    });

    pub const RESPONSE: usize = Props::AT.response;
    pub const SUBMITTED: usize = Props::AT.submitted;
    pub const VALUE: usize = Props::AT.value;
}

/// A response is made by an answer's planner, never by a tag.
pub(crate) fn plan_response(_: &mut PlanCtx<'_, '_>) -> Result<()> {
    Err(Error::Unsupported("extending a response".into()))
}

/// `<clampNumber lowerValue="0" upperValue="1">x</clampNumber>`: its
/// children held between the bounds. A request on `value` inverts through
/// the bounds' projections to the unclamped number.
pub(super) const CLAMP_NUMBER: ComponentTypeInfo = info(&["clampNumber"], CLAMP_NUMBER_PROPS)
    .copyable()
    .default_prop("value");

const CLAMP_NUMBER_PROPS: &[PropDef] = &props([
    children("unclamped"),
    attr("lowerValue", 0.0),
    attr("upperValue", 1.0),
    computed("atLeastLower", OpSpec::Max, &["unclamped", "lowerValue"]),
    computed("value", OpSpec::Min, &["atLeastLower", "upperValue"]),
]);

/// Most entries a tuple holds.
pub use crate::limits::MAX_TUPLE;

/// A tuple of numbers: a `<math>` that is `(a, b, c)` with three or more
/// entries (two make a point), and the iterates of a `<functionIterates>`.
/// `n` is how many entries it has; `x1`, ... the entries, unused ones NaN.
/// `coords` is the view over the entries, so `$t[2]` is `x2`.
pub(super) const TUPLE: ComponentTypeInfo = info(&["tuple"], TUPLE_PROPS)
    .copyable()
    .internal()
    .default_prop("coords")
    .views(&[("coords", &TUPLE_ENTRIES)]);

const TUPLE_ENTRIES: [&str; MAX_TUPLE] = ["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8"];

const TUPLE_PROPS: &[PropDef] = &props({
    let mut out = [planned(""); 1 + MAX_TUPLE];
    out[0] = planned("n");
    let mut i = 0;
    while i < MAX_TUPLE {
        out[1 + i] = planned(TUPLE_ENTRIES[i]);
        i += 1;
    }
    out
});

pub mod tuple {
    use super::*;
    use crate::compile::api::{ElemPlan, Planned, SourcePlan};
    use crate::components::ComponentType;

    typed_props!(TUPLE_PROPS {
        n,
        x1,
        x2,
        x3,
        x4,
        x5,
        x6,
        x7,
        x8
    });

    pub const N: usize = Props::AT.n;
    /// The first entry; entry k (0-based) is at `X1 + k`.
    pub const X1: usize = Props::AT.x1;

    /// A tuple's props: its entry count, its entries, and NaN in the
    /// entries past them.
    pub(crate) fn props_of(entries: Vec<SourcePlan>) -> Vec<SourcePlan> {
        debug_assert!(entries.len() <= MAX_TUPLE, "checked against MAX_TUPLE");
        let n = Planned::fixed(entries.len() as f64);
        let mut entries = entries
            .into_iter()
            .map(Planned::from)
            .chain(std::iter::repeat_with(|| Planned::fixed(f64::NAN)));
        let mut next = || entries.next().expect("an endless supply");
        let mut plan = ElemPlan::of(ComponentType::Tuple);
        plan.set_public(
            Props {
                n,
                x1: next(),
                x2: next(),
                x3: next(),
                x4: next(),
                x5: next(),
                x6: next(),
                x7: next(),
                x8: next(),
            }
            .into_vec(),
        );
        plan.finish()
    }
}

/// A tuple is made from a `<math>` or by the builder, never by a tag.
pub(crate) fn plan_tuple(_: &mut PlanCtx<'_, '_>) -> Result<()> {
    Err(Error::Unsupported("extending a tuple".into()))
}

/// `<updateValue target="$a" newValue="$b"/>`: `target` aliases the
/// target's value cell, so performing it (`Document::trigger`) is a request
/// on that cell for `newValue`'s current value.
pub(super) const UPDATE_VALUE: ComponentTypeInfo = info(&["updateValue"], UPDATE_VALUE_PROPS);

const UPDATE_VALUE_PROPS: &[PropDef] =
    &props([attr("target", f64::NAN), attr("newValue", f64::NAN)]);

pub mod update_value {
    use super::*;
    pub const TARGET: usize = at(UPDATE_VALUE_PROPS, "target");
    pub const NEW_VALUE: usize = at(UPDATE_VALUE_PROPS, "newValue");
}

//! Number, text, op, math, evaluate, function, derivative and answer:
//! types that hold a value, numeric or symbolic. Function, derivative and
//! answer are `symbolic`: the builder plans them as math cells
//! (`plan_symbolic`).

use super::define::*;
use super::{ComponentTypeInfo, PropDef};
use crate::program::SymKind;

/// `<number>`.
pub(super) const NUMBER: ComponentTypeInfo = info(&["number"], NUMBER_PROPS)
    .copyable()
    .default_prop("value");

const NUMBER_PROPS: &[PropDef] = &props([children("value")]);

/// `<text>` with literal content: `value` is a fixed cell holding the
/// string id of its text (ADR 0009). A cell's meaning is a property of
/// the operators around it, so a text value never reaches a numeric one.
pub(super) const TEXT: ComponentTypeInfo =
    info(&["text"], TEXT_PROPS).copyable().default_prop("value");

const TEXT_PROPS: &[PropDef] = &props([children("value")]);

pub mod text {
    use super::*;
    pub const VALUE: usize = at(TEXT_PROPS, "value");
}

/// Prototype-only tag that applies a numeric operator to referenced cells;
/// its tag is registered only with the `testing` feature (tests and the
/// golden documents use it to exercise single operators).
pub(super) const OP: ComponentTypeInfo = info(&["op"], OP_PROPS)
    .copyable()
    .test_only()
    .default_prop("value");

const OP_PROPS: &[PropDef] = &props([derived("value")]);

/// `<math>`: lowered to a numeric chain in `value` when its expression
/// is all numbers and numeric cells (`expr` is then NaN). Otherwise a
/// math cell: `expr` holds an engine handle, instantiated from the
/// template whenever a leaf changes (then simplified or expanded if the
/// attribute says so), and `value` evaluates it (NaN with free symbols).
pub(super) const MATH: ComponentTypeInfo =
    info(&["math"], MATH_PROPS).copyable().default_prop("value");

// Both of a math's props are set by the builder from its children.
const MATH_PROPS: &[PropDef] = &props([children("expr"), children("value")]);

pub mod math {
    use super::*;
    pub const EXPR: usize = at(MATH_PROPS, "expr");
    pub const VALUE: usize = at(MATH_PROPS, "value");
}

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

/// `<function>`: a math cell `expr` (variable `x`) and, as a curve, the
/// `SAMPLES` cells from `samples` on, filled by a `Sample` instruction
/// over the enclosing graph's x-range.
pub(super) const FUNCTION: ComponentTypeInfo = info(&["function"], CURVE_PROPS)
    .copyable()
    .symbolic()
    .default_prop("expr");

/// `<derivative>$f</derivative>`: d/dx of a function or math, sampled
/// like a function.
pub(super) const DERIVATIVE: ComponentTypeInfo = info(&["derivative"], CURVE_PROPS)
    .copyable()
    .symbolic()
    .default_prop("expr");

// Planned by the builder (`plan_symbolic`); `samples` is the first of
// `SAMPLES` consecutive cells.
const CURVE_PROPS: &[PropDef] = &props([
    children("expr"),
    planned("xmin"),
    planned("xmax"),
    planned("samples"),
]);

/// `<answer response="$mi">correct</answer>`: `submitted` is an
/// essential math cell that a submit request sets to the response;
/// `credit` compares it with `correct` (`symbolicEquality`: as written).
pub(super) const ANSWER: ComponentTypeInfo = info(&["answer"], ANSWER_PROPS)
    .copyable()
    .symbolic()
    .default_prop("credit");

const ANSWER_PROPS: &[PropDef] = &props([
    attr("response", f64::NAN).ref_prop("expr"),
    children("correct"),
    attr("submitted", f64::NAN),
    planned("credit"),
    attr("weight", 1.0),
]);

pub mod answer {
    use super::*;
    pub const RESPONSE: usize = at(ANSWER_PROPS, "response");
    pub const SUBMITTED: usize = at(ANSWER_PROPS, "submitted");
    pub const CREDIT: usize = at(ANSWER_PROPS, "credit");
    pub const WEIGHT: usize = at(ANSWER_PROPS, "weight");
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
pub const MAX_TUPLE: usize = 8;

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
    pub const N: usize = at(TUPLE_PROPS, "n");
    /// The first entry; entry k (0-based) is at `X1 + k`.
    pub const X1: usize = at(TUPLE_PROPS, "x1");
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

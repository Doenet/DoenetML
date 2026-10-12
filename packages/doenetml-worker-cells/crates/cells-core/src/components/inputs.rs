//! Number input, boolean input, math input and slider: types whose value a
//! user sets. Each value is an essential cell unless bound to another.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};

/// `<numberInput>`.
pub(super) const NUMBER_INPUT: ComponentTypeInfo = info(&["numberInput"], NUMBER_INPUT_PROPS)
    .copyable()
    .default_prop("value");

const NUMBER_INPUT_PROPS: &[PropDef] = &props([attr("value", f64::NAN)]);

/// A checkbox: its value cell holds 0 or 1 like any other `f64` cell.
pub(super) const BOOLEAN_INPUT: ComponentTypeInfo = info(&["booleanInput"], BOOLEAN_INPUT_PROPS)
    .copyable()
    .default_prop("value");

const BOOLEAN_INPUT_PROPS: &[PropDef] = &props([attr("value", 0.0)]);

/// `<mathInput>`: bound to another cell by a child reference or
/// `bindValueTo`, it is a numeric input (`expr` NaN). Unbound, its `expr`
/// is an essential math cell (typing writes a parsed handle) and `value`
/// evaluates it; a request on `value` writes a constant expression.
pub(super) const MATH_INPUT: ComponentTypeInfo = info(&["mathInput"], MATH_INPUT_PROPS)
    .copyable()
    .default_prop("value");

// A mathInput's value is bound by a child reference or `bindValueTo`,
// else it is the `prefill` (the builder reads it). The builder plans
// `expr` from what `value` turned out to be (`plan_math_input`).
const MATH_INPUT_PROPS: &[PropDef] = &props([
    children("value").attribute("prefill").bind("bindValueTo"),
    planned("expr"),
]);

pub mod math_input {
    use super::*;
    pub const VALUE: usize = at(MATH_INPUT_PROPS, "value");
    pub const EXPR: usize = at(MATH_INPUT_PROPS, "expr");
}

/// `<slider>` in numeric mode. Its whole value chain is computed props, so
/// it needs no code of its own; the chain reproduces the current core's
/// `numItems`, `index` and `value` definitions:
///
/// ```text
/// maxIndex = floor((to - from) / step + 1e-10)
/// index    = min(max(round((pre - from) / step), 0), maxIndex), or 0 if NaN
/// value    = from + index * step
/// ```
///
/// `preliminaryValue` is the slider's own essential cell unless `bindValueTo`
/// names another component, in which case it aliases that component's value.
pub(super) const SLIDER: ComponentTypeInfo = info(&["slider"], SLIDER_PROPS)
    .copyable()
    .default_prop("value");

const SLIDER_PROPS: &[PropDef] = &props([
    attr("from", 0.0),
    attr("to", 10.0),
    attr("step", 1.0),
    attr("preliminaryValue", 0.0)
        .attribute("initialValue")
        .bind("bindValueTo"),
    computed("span", OpSpec::Sub, &["to", "from"]),
    computed("spanSteps", OpSpec::Div, &["span", "step"]),
    computed("spanStepsEps", OpSpec::Offset { k: 1e-10 }, &["spanSteps"]),
    computed("maxIndex", OpSpec::Floor, &["spanStepsEps"]),
    computed("offset", OpSpec::Sub, &["preliminaryValue", "from"]),
    computed("rawIndex", OpSpec::Div, &["offset", "step"]),
    computed("roundedIndex", OpSpec::Round, &["rawIndex"]),
    computed(
        "nonNegIndex",
        OpSpec::Clamp {
            lo: 0.0,
            hi: f64::INFINITY,
        },
        &["roundedIndex"],
    ),
    computed("clampedIndex", OpSpec::Min, &["nonNegIndex", "maxIndex"]),
    // A non-finite stored value is index 0, so the slider shows `from`,
    // as in the current core.
    computed("index", OpSpec::NanTo { k: 0.0 }, &["clampedIndex"]),
    computed("scaled", OpSpec::Mul, &["index", "step"]),
    computed("value", OpSpec::Add, &["scaled", "from"]),
]);

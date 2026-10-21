//! Number input, boolean input, math input, text input and slider: types
//! whose value a user sets. Each value is an essential cell unless bound to another.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};

pub mod choice_input;
pub mod math_input;
pub mod text_input;

/// `<numberInput>`.
pub(super) const NUMBER_INPUT: ComponentTypeInfo = info(&["numberInput"], NUMBER_INPUT_PROPS)
    .copyable()
    .default_prop("value");

const NUMBER_INPUT_PROPS: &[PropDef] = &props([attr("value", f64::NAN)]);

/// A checkbox: its value cell holds 0 or 1 like any other `f64` cell,
/// essential unless `bindValueTo` names another (a `<boolean>`'s).
pub(super) const BOOLEAN_INPUT: ComponentTypeInfo = info(&["booleanInput"], BOOLEAN_INPUT_PROPS)
    .copyable()
    .default_prop("value");

const BOOLEAN_INPUT_PROPS: &[PropDef] = &props([attr("value", 0.0).bind("bindValueTo")]);

pub mod boolean_input {
    use super::*;
    pub const VALUE: usize = at(BOOLEAN_INPUT_PROPS, "value");
}

/// `<choice credit="1">text</choice>` inside a `<choiceInput>`: a rendered
/// container whose `credit` is what choosing it earns.
pub(super) const CHOICE: ComponentTypeInfo = info(&["choice"], CHOICE_PROPS).container();

const CHOICE_PROPS: &[PropDef] = &props([attr("credit", 0.0)]);

pub mod choice {
    use super::*;
    pub const CREDIT: usize = at(CHOICE_PROPS, "credit");
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
    // Without an initialValue nothing is stored, and the slider shows
    // `from` (index 0), as in the current core.
    attr("preliminaryValue", f64::NAN)
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

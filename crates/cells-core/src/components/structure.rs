//! Repeat, sequence value, collect, conditional content, case and select:
//! types whose children the builder makes, so they shape the document
//! rather than hold a value.

use super::define::*;
use super::{ComponentTypeInfo, PropDef};

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

/// `<collect>`: its children are copies of the collected components.
pub(super) const COLLECT: ComponentTypeInfo = info(&["collect"], COLLECT_PROPS);

const COLLECT_PROPS: &[PropDef] = &props([attr("count", 0.0)]);

/// `<conditionalContent>`, a reactive choice (ADR 0009). Its `choice` cell
/// is the 1-based position of the first case whose condition holds, or 0.
/// Its children are `Case` components.
pub(super) const CONDITIONAL_CONTENT: ComponentTypeInfo =
    info(&["conditionalContent"], CONDITIONAL_CONTENT_PROPS);

// `hide` hides what the choice shows, not copies of its names.
const CONDITIONAL_CONTENT_PROPS: &[PropDef] = &props([planned("choice"), planned("hide")]);

pub mod conditional_content {
    use super::*;
    pub const CHOICE: usize = at(CONDITIONAL_CONTENT_PROPS, "choice");
}

/// One built branch of a reactive choice: `active` is 1 while it is the
/// chosen one. Its children are the branch's content. A renderer shows
/// the children of an active case only.
pub(super) const CASE: ComponentTypeInfo = info(&["case"], CASE_PROPS);

const CASE_PROPS: &[PropDef] = &props([planned("active")]);

pub mod case {
    use super::*;
    pub const ACTIVE: usize = at(CASE_PROPS, "active");
}

/// `<select>`, a load-time choice: its children are the content of the
/// options it picked, flattened like a repeat's iterations.
pub(super) const SELECT: ComponentTypeInfo = info(&["select"], SELECT_PROPS);

const SELECT_PROPS: &[PropDef] = &props([planned("hide")]);

/// `<repeat for="$fi.allIteratesWithInitial" valueName="x" indexName="i">`:
/// a repeat over a list, one iteration per item; `$x` is the item, a
/// tuple. Its `count` (the structural cell) aliases the list's length.
/// The lists it takes are a `<functionIterates>`' `allIteratesWithInitial`
/// and `iterates`.
pub(super) const REPEAT_FOR: ComponentTypeInfo = info(&["repeat"], REPEAT_FOR_PROPS);

const REPEAT_FOR_PROPS: &[PropDef] = &props([planned("count")]);

/// `<functionIterates function="$f" initialValue="$x0" numIterates="n">`:
/// the initial value and `n` applications of `f`. Built like a repeat:
/// iteration k holds one hidden tuple, the initial value when k is 1 and
/// `f` of iteration k-1's tuple otherwise, lowered to numeric operators.
/// `count` (the structural cell) is `n + 1`; `allIteratesWithInitial` and
/// `iterates`, as numbers, are the lengths of those lists.
pub(super) const FUNCTION_ITERATES: ComponentTypeInfo =
    info(&["functionIterates"], FUNCTION_ITERATES_PROPS);

const FUNCTION_ITERATES_PROPS: &[PropDef] = &props([
    attr("numIterates", 0.0),
    computed("numIteratesFloor", OpSpec::Floor, &["numIterates"]),
    computed(
        "numIteratesClamped",
        OpSpec::Clamp {
            lo: 0.0,
            hi: 10_000.0,
        },
        &["numIteratesFloor"],
    ),
    computed(
        "iterates",
        OpSpec::NanTo { k: 0.0 },
        &["numIteratesClamped"],
    ),
    computed("count", OpSpec::Offset { k: 1.0 }, &["iterates"]),
    planned("allIteratesWithInitial"),
]);

pub mod function_iterates {
    use super::*;
    pub const ITERATES: usize = at(FUNCTION_ITERATES_PROPS, "iterates");
    pub const COUNT: usize = at(FUNCTION_ITERATES_PROPS, "count");
    pub const ALL: usize = at(FUNCTION_ITERATES_PROPS, "allIteratesWithInitial");
}

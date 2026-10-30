//! Number input, boolean input, choice input (and its choices), math
//! input, text input and slider: types whose value a user sets. Each value is an essential cell unless bound to another.

use super::define::*;

pub mod choice_input;
pub mod math_input;
pub mod text_input;

pub mod number_input {
    use super::*;

    component! {
        /// `<numberInput>`.
        tags: ["numberInput"],
        flags: [copyable],
        reads_as: Number,
        default_prop: value,
        props {
            value: attr(NO_VALUE) { interactive, rendered },
        }
        planner: Props,
    }
}

pub mod boolean_input {
    use super::*;

    component! {
        /// A checkbox: its value cell holds 0 or 1 like any other `f64` cell,
        /// essential unless `bindValueTo` names another (a `<boolean>`'s).
        tags: ["booleanInput"],
        flags: [copyable],
        reads_as: Boolean,
        default_prop: value,
        props {
            value: attr(0.0) { bind: bindValueTo, interactive, rendered },
        }
        planner: Props,
    }

    pub const VALUE: usize = Props::AT.value;
}

pub mod choice {
    use super::*;

    component! {
        /// `<choice credit="1">text</choice>` inside a `<choiceInput>`: a
        /// rendered container whose `credit` is what choosing it earns.
        tags: ["choice"],
        flags: [container],
        props {
            credit: attr(0.0),
        }
        planner: Props,
    }

    pub const CREDIT: usize = Props::AT.credit;
}

pub mod slider {
    use super::*;

    component! {
        /// `<slider>` in numeric mode. Its whole value chain is computed props,
        /// so it needs no code of its own; the chain reproduces the current
        /// core's `numItems`, `index` and `value` definitions:
        ///
        /// ```text
        /// maxIndex = floor((to - from) / step + 1e-10)
        /// index    = min(max(round((pre - from) / step), 0), maxIndex), or 0 if NaN
        /// value    = from + index * step
        /// ```
        ///
        /// `preliminaryValue` is the slider's own essential cell unless
        /// `bindValueTo` names another component, in which case it aliases that
        /// component's value.
        tags: ["slider"],
        flags: [copyable],
        reads_as: Number,
        default_prop: value,
        props {
            from: attr(0.0) { rendered },
            to: attr(10.0) { rendered },
            step: attr(1.0) { rendered },
            // Without an initialValue nothing is stored, and the slider shows
            // `from` (index 0), as in the current core.
            preliminaryValue: attr(NO_VALUE) { attribute: initialValue, bind: bindValueTo },
            span: computed(OpSpec::Sub, [to, from]),
            spanSteps: computed(OpSpec::Div, [span, step]),
            spanStepsEps: computed(OpSpec::Add, [spanSteps, (1e-10)]),
            maxIndex: computed(OpSpec::Floor, [spanStepsEps]),
            offset: computed(OpSpec::Sub, [preliminaryValue, from]),
            rawIndex: computed(OpSpec::Div, [offset, step]),
            roundedIndex: computed(OpSpec::Round, [rawIndex]),
            nonNegIndex: computed(OpSpec::Max, [roundedIndex, (0.0)]),
            clampedIndex: computed(OpSpec::Min, [nonNegIndex, maxIndex]),
            // A non-finite stored value is index 0, so the slider shows `from`,
            // as in the current core.
            index: computed(OpSpec::NanTo, [clampedIndex, (0.0)]),
            scaled: computed(OpSpec::Mul, [index, step]),
            // A request on the value inverts onto `preliminaryValue`.
            value: computed(OpSpec::Add, [scaled, from]) { interactive, rendered },
        }
        planner: Props,
    }
}

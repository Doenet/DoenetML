//! Repeat, function iterates, collect, conditional
//! content, case, select and select from sequence: types whose children the builder makes, so they shape the document
//! rather than hold a value.

use super::define::*;

pub mod collect;
pub mod conditional_content;
pub mod function_iterates;
pub mod repeat_for;
pub mod select;
pub mod select_from_sequence;
pub(crate) mod variant_control;

pub(crate) mod sample_prime_numbers;
pub(crate) mod sample_random_numbers;
pub(crate) mod select_prime_numbers;
pub(crate) mod select_random_numbers;

pub(crate) mod sample_multivariate_random_number;

pub(crate) mod repeat_for_sequence {
    use super::*;
    use crate::compile::api::{ItemCtx, Wire};
    use crate::components::prop;

    component! {
        /// `<repeatForSequence>`: its children are every iteration's expanded
        /// template, flattened; its `count` prop is the structural cell. The
        /// iteration count is derived like any other cell and read by the
        /// builder:
        ///
        /// ```text
        /// lengthFromTo = floor((to - from) / step + 1 + 1e-10)
        /// count        = min(max(floor(length or lengthFromTo), 0), maxNumber)
        /// ```
        ///
        /// A NaN count means zero iterations.
        tags: ["repeatForSequence"],
        structure: Repeat { count: count },
        item: Number(item),
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
        // Its props are its table's; the hidden elements its `valueName`
        // and `indexName` make in its body are planned with it: the value
        // by `item` (ADR 0040), the index as every repeat's.
        planner: Props,
    }

    /// The value of iteration `k`, the item `valueName` names: a `<number>`
    /// holding `from + (k - 1) * step`, `from` and `step` the repeat's.
    fn item(ctx: &mut ItemCtx<'_>) -> prop::number::Planned {
        let at = Props::PORTS;
        let k = ctx.index_from_zero();
        let step = ctx.owner(at.step);
        let scaled = ctx.computed(OpSpec::Mul, vec![k, step]);
        let from = ctx.owner(at.from);
        prop::number::Planned {
            value: Wire::computed(OpSpec::Add, vec![scaled, from]),
        }
    }
}

/// `case`: one branch of a `<conditionalContent>`.
pub mod case {
    use super::*;

    component! {
        /// One built branch of a reactive choice: `active` is 1 while it is the
        /// chosen one. Its children are the branch's content. A renderer shows
        /// the children of an active case only.
        tags: ["case"],
        flags: [owned, not_extendable],
        roles: [Case],
        structure: Gate { active: active },
        props {
            active: by_planner { rendered },
        }
        owner: ConditionalContent,
    }

    /// The position of `active`: 1 while the branch is the chosen one.
    pub const ACTIVE: usize = Props::AT.active;
}

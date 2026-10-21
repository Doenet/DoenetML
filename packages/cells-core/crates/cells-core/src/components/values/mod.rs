//! Number, boolean, text, op, math, evaluate, function, derivative and
//! answer (with its award, when and response): types that hold a value,
//! numeric or symbolic. Function and derivative are `symbolic`, planned as
//! math cells (`curve.rs`); so is answer (`answer.rs`). Each type with a
//! planner is in its own file, its definition and its planner together
//! (ADR 0016); tuple and response, which no tag makes, refuse here.

use super::define::*;
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

pub mod number {
    use super::*;

    component! {
        /// `<number>`.
        tags: ["number"],
        flags: [copyable],
        default_prop: value,
        props {
            value: children,
        }
        planner: Props,
    }

    pub const VALUE: usize = Props::AT.value;
}

pub mod evaluate {
    use super::*;

    component! {
        /// `<evaluate function="$m" input="$a"/>`: the math's expression with
        /// its free symbol set to the input.
        tags: ["evaluate"],
        flags: [copyable],
        default_prop: value,
        props {
            function: attr(f64::NAN) { ref_prop: expr },
            input: attr(f64::NAN),
            value: computed(OpSpec::Sym(SymKind::EvalAt), [function, input]),
        }
        planner: Props,
    }
}

pub mod response {
    use super::*;

    component! {
        /// One response of an answer whose awards reference an input:
        /// `response` aliases the input's live expression, `submitted` is the
        /// essential copy a submit takes, and `value` evaluates it. A `$mi`
        /// inside a `<when>` resolves here, so credit changes only on submit.
        /// Made by the builder.
        tags: ["response"],
        flags: [internal],
        default_prop: value,
        props {
            response: by_planner,
            submitted: by_planner,
            value: by_planner,
        }
        planner: Whole(plan),
    }

    pub const RESPONSE: usize = Props::AT.response;
    pub const SUBMITTED: usize = Props::AT.submitted;
    pub const VALUE: usize = Props::AT.value;

    /// A response is made by an answer's planner, never by a tag.
    pub(crate) fn plan(_: &mut PlanCtx<'_, '_>) -> Result<()> {
        Err(Error::Unsupported("extending a response".into()))
    }
}

pub mod clamp_number {
    use super::*;

    component! {
        /// `<clampNumber lowerValue="0" upperValue="1">x</clampNumber>`: its
        /// children held between the bounds. A request on `value` inverts
        /// through the bounds' projections to the unclamped number.
        tags: ["clampNumber"],
        flags: [copyable],
        default_prop: value,
        props {
            unclamped: children,
            lowerValue: attr(0.0),
            upperValue: attr(1.0),
            atLeastLower: computed(OpSpec::Max, [unclamped, lowerValue]),
            value: computed(OpSpec::Min, [atLeastLower, upperValue]),
        }
        planner: Props,
    }
}

/// Most entries a tuple holds.
pub use crate::limits::MAX_TUPLE;

pub mod tuple {
    use super::*;
    use crate::compile::api::{ElemWiring, Source, Wire};
    use crate::components::ComponentType;

    component! {
        /// A tuple of numbers: a `<math>` that is `(a, b, c)` with three or
        /// more entries (two make a point), and the iterates of a
        /// `<functionIterates>`. `n` is how many entries it has; `x1`, ... the
        /// entries, unused ones NaN. `coords` combines the entries, so `$t[2]`
        /// is `x2`.
        tags: ["tuple"],
        flags: [copyable, internal],
        default_prop: coords,
        props {
            n: by_planner,
            x1: by_planner,
            x2: by_planner,
            x3: by_planner,
            x4: by_planner,
            x5: by_planner,
            x6: by_planner,
            x7: by_planner,
            x8: by_planner,
        }
        combined_props {
            coords: [x1, x2, x3, x4, x5, x6, x7, x8],
        }
        planner: Whole(plan),
    }

    // One entry for each of the `MAX_TUPLE` a tuple holds.
    const _: () = assert!(
        PROPS.len() == 1 + MAX_TUPLE,
        "a tuple holds MAX_TUPLE entries"
    );

    pub const N: usize = Props::AT.n;
    /// The first entry; entry k (0-based) is at `X1 + k`.
    pub const X1: usize = Props::AT.x1;

    /// A tuple's props: its entry count, its entries, and NaN in the
    /// entries past them.
    pub(crate) fn props_of(entries: Vec<Source>) -> Vec<Source> {
        debug_assert!(entries.len() <= MAX_TUPLE, "checked against MAX_TUPLE");
        let n = Wire::fixed(entries.len() as f64);
        let mut entries = entries
            .into_iter()
            .map(Wire::from)
            .chain(std::iter::repeat_with(|| Wire::fixed(f64::NAN)));
        let mut next = || entries.next().expect("an endless supply");
        let mut wiring = ElemWiring::of(ComponentType::Tuple);
        wiring.set_public(Props {
            n,
            x1: next(),
            x2: next(),
            x3: next(),
            x4: next(),
            x5: next(),
            x6: next(),
            x7: next(),
            x8: next(),
        });
        wiring.finish()
    }

    /// A tuple is made from a `<math>` or by the builder, never by a tag.
    pub(crate) fn plan(_: &mut PlanCtx<'_, '_>) -> Result<()> {
        Err(Error::Unsupported("extending a tuple".into()))
    }
}

pub mod update_value {
    use super::*;

    component! {
        /// `<updateValue target="$a" newValue="$b"/>`: `target` aliases the
        /// target's value cell, so performing it (`Document::trigger`) is a
        /// request on that cell for `newValue`'s current value.
        tags: ["updateValue"],
        props {
            target: attr(f64::NAN),
            newValue: attr(f64::NAN),
        }
        planner: Props,
    }

    pub const TARGET: usize = Props::AT.target;
    pub const NEW_VALUE: usize = Props::AT.newValue;
}

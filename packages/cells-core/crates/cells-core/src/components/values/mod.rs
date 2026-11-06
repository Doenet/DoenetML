//! Number, boolean, text, math, evaluate, clamp number, tuple, update
//! value, function, derivative and answer (with its award, when and
//! response): types that hold a value, numeric or symbolic. Function,
//! derivative and answer are `symbolic`, planned as math cells.

use super::define::*;
use crate::program::SymKind;

pub mod answer;
pub mod award;
pub mod boolean;
pub mod curve;
pub mod math;
pub mod text;
pub mod when;

/// `<number>`: a numeric value.
pub mod number {
    use super::*;

    component! {
        /// `<number>`.
        tags: ["number"],
        flags: [copyable],
        default_prop: value,
        props {
            value: children { rendered },
        }
        children: Value,
        planner: Props,
    }

    /// The position of `value`: the number.
    pub const VALUE: usize = Props::AT.value;
}

pub(crate) mod evaluate {
    use super::*;

    component! {
        /// `<evaluate function="$m" input="$a"/>`: the math's expression with
        /// its free symbol set to the input.
        tags: ["evaluate"],
        flags: [copyable],
        default_prop: value,
        props {
            function: attr(NO_VALUE) { ref_prop: expr },
            input: attr(NO_VALUE),
            value: computed(OpSpec::Sym(SymKind::EvalAt), [function, input]) { rendered },
        }
        planner: Props,
    }
}

/// `response`: one response an answer submits.
pub mod response {
    use super::*;

    component! {
        /// One response of an answer whose awards reference an input:
        /// `response` aliases the input's live expression, `submitted` is the
        /// essential copy a submit takes, and `value` evaluates it. A `$mi`
        /// inside a `<when>` resolves here, so credit changes only on submit.
        /// Made by the builder.
        tags: ["response"],
        flags: [internal, owned],
        renders: Never,
        default_prop: value,
        props {
            response: by_planner { read_by_action },
            // A submit writes it (`Document::submit`).
            submitted: by_planner { written_by_action },
            value: by_planner,
        }
        owner: Answer,
    }

    /// The position of `response`: the input's live expression.
    pub const RESPONSE: usize = Props::AT.response;
    /// The position of `submitted`: the response as last submitted.
    pub const SUBMITTED: usize = Props::AT.submitted;
    /// The position of `value`: the submitted response, evaluated.
    pub const VALUE: usize = Props::AT.value;
}

pub(crate) mod clamp_number {
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
            value: computed(OpSpec::Min, [atLeastLower, upperValue]) { rendered },
        }
        children: Value,
        planner: Props,
    }
}

/// Most entries a tuple holds.
pub use crate::limits::MAX_TUPLE;

/// `tuple`: a tuple of numbers, up to [`MAX_TUPLE`] entries.
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
        flags: [copyable, internal, owned],
        default_prop: coords,
        props {
            n: by_planner { rendered },
            x1: by_planner { rendered },
            x2: by_planner { rendered },
            x3: by_planner { rendered },
            x4: by_planner { rendered },
            x5: by_planner { rendered },
            x6: by_planner { rendered },
            x7: by_planner { rendered },
            x8: by_planner { rendered },
        }
        combined_props {
            coords: [x1, x2, x3, x4, x5, x6, x7, x8],
        }
    }

    // One entry for each of the `MAX_TUPLE` a tuple holds.
    const _: () = assert!(
        PROPS.len() == 1 + MAX_TUPLE,
        "a tuple holds MAX_TUPLE entries"
    );

    /// The position of `n`: how many entries the tuple has.
    pub const N: usize = Props::AT.n;
    /// The first entry; entry k (0-based) is at `X1 + k`.
    pub const X1: usize = Props::AT.x1;

    /// A tuple's props: its entry count, its entries, and NaN in the
    /// entries past them.
    pub(crate) fn props_of(entries: Vec<Source>) -> Vec<Source> {
        wiring_of(entries).finish().0
    }

    /// A tuple's wiring (`props_of`).
    pub(crate) fn wiring_of(entries: Vec<Source>) -> ElemWiring {
        debug_assert!(entries.len() <= MAX_TUPLE, "checked against MAX_TUPLE");
        let n = Wire::constant(entries.len() as f64);
        let mut entries = entries
            .into_iter()
            .map(Wire::from)
            .chain(std::iter::repeat_with(Wire::absent));
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
        wiring
    }
}

/// `<updateValue>`: a request on another cell, performed by a trigger.
pub mod update_value {
    use super::*;

    component! {
        /// `<updateValue target="$a" newValue="$b"/>`: `target` aliases the
        /// target's value cell, so performing it is a request on that cell
        /// for `newValue`'s current value.
        tags: ["updateValue"],
        renders: Never,
        props {
            // Pressing its `<triggerSet>` requests it (`Document::trigger`).
            target: attr(NO_VALUE) { written_by_action },
            newValue: attr(NO_VALUE) { read_by_action },
        }
        planner: Props,
    }

    /// The position of `target`: an alias of the target's value cell.
    pub const TARGET: usize = Props::AT.target;
    /// The position of `newValue`: the value it requests.
    pub const NEW_VALUE: usize = Props::AT.newValue;
}

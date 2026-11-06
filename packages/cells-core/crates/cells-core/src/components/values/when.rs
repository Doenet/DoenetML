//! `<when>`: its definition and its planner.

use crate::components::define::*;

component! {
    /// `<when>` inside an `<award>`: `value` is 1 while its condition holds,
    /// read against the answer's submitted responses. Planned with its answer.
    tags: ["when"],
    flags: [owned],
    renders: Never,
    default_prop: value,
    props {
        value: by_planner,
    }
    owner: Award,
}

/// The position of `value`: 1 while its condition holds.
pub const VALUE: usize = Props::AT.value;

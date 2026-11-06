//! `<award>`: its definition and its planner.

use crate::components::define::*;

component! {
    /// `<award credit="0.5">` inside an `<answer>`: `awarded` is `credit` when
    /// its `<when>` holds (or its content equals the submitted response), else
    /// 0. Planned with its answer.
    tags: ["award"],
    flags: [owned],
    renders: Never,
    default_prop: awarded,
    props {
        credit: attr(1.0),
        awarded: by_planner,
    }
    owner: Answer,
}

/// The position of `credit`: what the award gives when it holds.
pub const CREDIT: usize = Props::AT.credit;
/// The position of `awarded`: `credit` when the award holds, else 0.
pub const AWARDED: usize = Props::AT.awarded;

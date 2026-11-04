//! `<award>`: its definition and its planner (ADR 0016).

use crate::components::define::*;

component! {
    /// `<award credit="0.5">` inside an `<answer>`: `awarded` is `credit` when
    /// its `<when>` holds (or its content equals the submitted response), else
    /// 0. Planned with its answer (`plan_answer`).
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

pub const CREDIT: usize = Props::AT.credit;
pub const AWARDED: usize = Props::AT.awarded;

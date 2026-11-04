//! `<conditionalContent>` and `<feedback>`: their definition and their
//! planner (ADR 0016). How a choice is planned is the machinery in
//! `compile/planning/choice.rs`.

use crate::components::define::*;

component! {
    /// `<conditionalContent>`, a reactive choice (ADR 0009). Its `choice` cell
    /// is the 1-based position of the first case whose condition holds, or 0.
    /// Its children are `Case` components. `<feedback condition>` is the same
    /// thing with one case: content shown while its condition holds.
    tags: ["conditionalContent", "feedback"],
    flags: [not_extendable],
    props {
        // `hide` hides what the choice shows, not copies of its names.
        choice: by_planner,
        hide: by_planner { rendered },
    }
    machinery: Choice,
}

pub const CHOICE: usize = Props::AT.choice;
pub const HIDE: usize = Props::AT.hide;

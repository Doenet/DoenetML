//! `<conditionalContent>` and `<feedback>`: their definition and their
//! planner.

use crate::components::define::*;

component! {
    /// `<conditionalContent>`, a reactive choice. Its `choice` cell
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

/// The position of `choice`: the 1-based position of the first case whose condition
/// holds, or 0.
pub const CHOICE: usize = Props::AT.choice;
/// The position of `hide`: 1 when what the choice shows is hidden.
pub const HIDE: usize = Props::AT.hide;

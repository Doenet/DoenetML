//! `<select>`: its definition and its planner (ADR 0016). How a choice
//! is planned is the machinery in `compile/planning/choice.rs`.

use crate::components::define::*;

component! {
    /// `<select>`, a load-time choice: its children are the content of the
    /// options it picked, flattened like a repeat's iterations.
    tags: ["select"],
    flags: [not_extendable],
    props {
        hide: by_planner { rendered },
    }
    presentation { asList }
    machinery: Choice,
}

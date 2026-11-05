//! `<select>`: its definition and its planner.

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

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

/// The hidden port after `hide` holding the select's `numToSelect`, a
/// document constant the check evaluates (ADR 0037) and a build reads as
/// the number it recorded ([`Plans::num_to_select`](crate::compile::plan::Plans::num_to_select)).
pub(crate) const NUM_TO_SELECT: usize = 1;

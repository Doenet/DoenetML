//! `<repeat for>`: its definition and its planner.

use crate::components::define::*;

component! {
    /// `<repeat for="$fi.allIteratesWithInitial" valueName="x" indexName="i">`:
    /// a repeat over a list, one iteration per item; `$x` is the item, a tuple.
    /// Its `count` (the structural cell) aliases the list's length. The lists
    /// it takes are a `<functionIterates>`' `allIteratesWithInitial` and
    /// `iterates`.
    tags: ["repeat"],
    structure: Repeat { count: count },
    props {
        count: by_planner,
    }
    presentation { asList }
    machinery: RepeatFor,
}

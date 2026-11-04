//! `<repeat for>`: its definition and its planner (ADR 0016). How a
//! repeat over a list is planned is the machinery in
//! `compile/planning/iterates.rs`.

use crate::components::define::*;

component! {
    /// `<repeat for="$fi.allIteratesWithInitial" valueName="x" indexName="i">`:
    /// a repeat over a list, one iteration per item; `$x` is the item, a tuple.
    /// Its `count` (the structural cell) aliases the list's length. The lists
    /// it takes are a `<functionIterates>`' `allIteratesWithInitial` and
    /// `iterates`.
    tags: ["repeat"],
    props {
        count: by_planner,
    }
    presentation { asList }
    machinery: RepeatFor,
}

//! `<collect>`: its definition and its planner.

use crate::components::define::*;

component! {
    /// `<collect>`: its children are copies of the collected components,
    /// and `count` how many (an aggregate).
    tags: ["collect"],
    structure: Transparent,
    settle: CollectsByAttr(componentType),
    props {
        count: aggregate(Count, Gathered),
    }
    presentation { asList }
    machinery: Collect,
}

/// The position of `count`: how many components it collects.
pub const COUNT: usize = Props::AT.count;

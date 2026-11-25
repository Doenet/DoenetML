//! `<variantControl>`: how many variants the document or the section it
//! sits in has, their names and seeds, which of them it may be, and whether
//! each names its own combination of picks (ADR 0076).

use crate::components::define::*;

component! {
    /// `<variantControl numVariants variantNames seeds variantsToInclude
    /// variantsToExclude uniqueVariants>`: read when the document is
    /// compiled (`compile/variants.rs`), never built into a value: what
    /// variant the document is, and what its load-time choices pick, are
    /// a load's (ADR 0076). Not rendered.
    tags: ["variantControl"],
    renders: Never,
    children: None,
    planner: Props,
}

#[cfg(all(test, feature = "testing"))]
#[path = "variant_control.spec.rs"]
mod spec;

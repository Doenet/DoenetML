//! The kinds of planner a component type's definition names
//! (`component!`'s `planner:`), and how the compile finds a type's.

use super::ctx::PlanCtx;
use crate::compile::*;

/// Returns the element's plan, its attributes merged over those of the
/// element it extends; `plan_with_extend` applies the copy rules around
/// it.
pub(crate) type PlanFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>) -> Result<ElemWiring>;

/// How an element is planned once the cases that do not depend on its type
/// (clones, synthesized elements, `extend` of a prop or of a container), an
/// owned type and machinery (`machinery:`) are ruled out (ADR 0034): from
/// the table, or by a function of the element's record in the type's file
/// under `components/` (ADR 0016).
#[derive(Debug, Clone, Copy)]
pub(crate) enum Planner {
    /// From the type's prop table (`plan_attrs`).
    Props,
    /// By the function, which returns the plan from the element's record;
    /// `plan_with_extend` applies the copy rules and the list's length
    /// around it. (`fixed`, for every kind, is `plan_elem`'s:
    /// `compile/planning/fix.rs`.)
    Plan(PlanFn),
}

impl Compiler<'_> {
    /// How an element of `component_type` is planned: what its definition
    /// (`component!`) says.
    pub(in crate::compile) fn planner(component_type: ComponentType) -> Planner {
        component_type.def().planner
    }
}

//! The kinds of planner a component type's definition names
//! (`component!`'s `planner:`), and how the compile finds a type's.

use super::Planning;
use super::ctx::PlanCtx;
use crate::compile::*;

/// Returns the element's plan, its attributes merged over those of the
/// element it extends.
pub(crate) type PlanFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>) -> Result<ElemWiring>;

/// How an element is planned once the cases that do not depend on its type
/// (clones, synthesized elements, `extend` of a prop or of a container), an
/// owned type and machinery are ruled out: from the type's prop table, or
/// by a function of the element's record.
#[derive(Debug, Clone, Copy)]
pub(crate) enum Planner {
    /// From the type's prop table.
    Props,
    /// By the function, which returns the plan from the element's record;
    /// the copy rules and the list's length are applied around it.
    Plan(PlanFn),
}

/// Planning, the planner of a type: which kind its definition names.
impl Planning<'_> {
    /// How an element of `component_type` is planned: what its definition
    /// (`component!`) says.
    pub(super) fn planner(component_type: ComponentType) -> Planner {
        component_type.def().planner
    }
}

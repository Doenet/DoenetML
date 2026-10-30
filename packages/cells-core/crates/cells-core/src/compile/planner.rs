//! The kinds of planner a component type's definition names
//! (`component!`'s `planner:`), and how the compile finds a type's.

use super::*;
use ctx::PlanCtx;

/// Adjusts the props `plan_attrs` planned from the table.
pub(crate) type PropsFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>, &mut [Option<Source>]) -> Result<()>;
/// Returns the element's plan, its attributes merged over those of the
/// element it extends; `plan_with_extend` applies the copy rules around
/// it.
pub(crate) type PlanFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>) -> Result<ElemWiring>;
/// Plans the whole element.
pub(crate) type WholeFn = for<'c, 'a> fn(&mut PlanCtx<'c, 'a>) -> Result<()>;

/// How an element is planned once the cases that do not depend on its type
/// (clones, synthesized elements, `extend` of a prop or of a container) are
/// ruled out. Every planner but `Props` is a function in the type's file
/// under `components/` (ADR 0016).
#[derive(Debug, Clone, Copy)]
pub(crate) enum Planner {
    /// From the type's prop table (`plan_attrs`).
    Props,
    /// From the prop table, then adjusted by the function.
    PropsThen(PropsFn),
    /// By the function, which returns the plan; `plan_with_extend` applies
    /// the copy rules and the list's length around it, and the function
    /// reads the element's children itself. (`fixed`, for every kind, is
    /// `plan_elem`'s: `compile/fix.rs`.)
    Plan(PlanFn),
    /// By the function alone, which writes the plan itself.
    Whole(WholeFn),
}

impl Compiler<'_> {
    /// How an element of `component_type` is planned: what its definition
    /// (`component!`) says.
    pub(super) fn planner(component_type: ComponentType) -> Planner {
        component_type.def().planner
    }
}

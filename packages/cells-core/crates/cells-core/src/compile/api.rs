//! What a component's planner may use (ADR 0016). A planner in
//! `components/` imports from here and nothing else of `compile/`: this
//! is the line between a component and the core's machinery. A need a
//! planner cannot meet from here is met by adding to it, once, for every
//! component, never by reaching past it.

pub(crate) use super::geometry::PlanCtx;
pub(crate) use super::plan::{
    DefaultPoint, ElemPlan, Planned, PointPlan, SourcePlan, point_roles, roles,
};

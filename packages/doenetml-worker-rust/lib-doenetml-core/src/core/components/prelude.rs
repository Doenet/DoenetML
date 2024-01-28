//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_derive::{
    add_dependency_data, ComponentActions, ComponentAttributes, ComponentNode, ComponentState,
    RenderedChildren, StateVariableDependencies, StateVariableDependencyInstructions,
};
pub use std::collections::HashMap;

pub use crate::dast::Position as DastPosition;
pub use crate::dependency::{DependenciesCreatedForInstruction, TryIntoStateVar};
pub use crate::state::{ComponentState, QueryUpdateRequests};

pub use crate::utils::KeyValueIgnoreCase;
pub use crate::{ComponentIdx, ComponentPointerTextOrMacro, ExtendSource};

pub use crate::components::{
    ComponentActions, ComponentAttributes, ComponentCommonData, ComponentNode,
    ComponentProfileStateVariable, RenderedChildren,
};

// These imports are commonly used in components

pub use crate::attribute::AttributeName;
pub use crate::components::actions::{Action, ActionBody, UpdateFromAction};
pub use crate::components::{ActionsEnum, ComponentEnum, ComponentProfile, RenderedState};
pub use crate::dast::{
    DastAttribute, ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
};
pub use crate::dependency::{Dependency, DependencyInstruction, DependencyValueUpdateRequest};
pub use crate::state::{
    RequestDependencyUpdateError, StateVar, StateVarCalcResult, StateVarEnumRef,
    StateVarEnumRefMut, StateVarIdx, StateVarInterface, StateVarMutableView, StateVarReadOnlyView,
    StateVarReadOnlyViewEnum, StateVarValue,
};

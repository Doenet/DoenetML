//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_derive::{
    ComponentNode, ComponentStateVariables, RenderedComponentNode, StateVariableDependencies,
    StateVariableDependencyInstructions,
};
pub use std::collections::HashMap;

pub use crate::dast::Position as DastPosition;
pub use crate::dependency::{DependenciesCreatedForInstruction, TryIntoStateVar};
pub use crate::state::{ComponentStateVariables, QueryUpdateRequests};

pub use crate::utils::KeyValueIgnoreCase;
pub use crate::{ComponentIdx, ComponentPointerTextOrMacro, ExtendSource};

pub use crate::components::{
    ComponentCommonData, ComponentNode, ComponentProfileStateVariable, RenderedComponentNode,
};

// These imports are commonly used in components

pub use crate::attribute::AttributeName;
pub use crate::components::{ComponentEnum, ComponentProfile, RenderedState};
pub use crate::dast::{
    DastAttribute, ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
};
pub use crate::dependency::{Dependency, DependencyInstruction, DependencyValueUpdateRequest};
pub use crate::state::{
    RequestDependencyUpdateError, StateVar, StateVarEnumRef, StateVarEnumRefMut, StateVarIdx,
    StateVarInterface, StateVarMutableView, StateVarReadOnlyView, StateVarReadOnlyViewEnum,
    StateVarValueEnum,
};

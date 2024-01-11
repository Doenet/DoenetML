//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_derive::{ComponentNode, ComponentNodeStateVariables, RenderedComponentNode};
pub use std::collections::HashMap;

pub use crate::dast::Position as DastPosition;
pub use crate::state::StateVar;

pub use crate::utils::KeyValueIgnoreCase;
pub use crate::{ComponentChild, ComponentIdx, ExtendSource};

pub use crate::components::{
    ComponentCommonData, ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};

// These imports are commonly used in components

pub use crate::components::ComponentEnum;
pub use crate::components::ComponentProfile;
pub use crate::dast::{ElementData, FlatDastElement, FlatDastElementUpdate, FlatDastElementContent};
pub use crate::dependency::{Dependency, DependencyInstruction, DependencyValueUpdateRequest};
pub use crate::state::{
    StateVarInterface, StateVarMutableViewTyped, StateVarParameters, StateVarReadOnlyView,
    StateVarReadOnlyViewTyped, StateVarTyped, StateVarValue,
};

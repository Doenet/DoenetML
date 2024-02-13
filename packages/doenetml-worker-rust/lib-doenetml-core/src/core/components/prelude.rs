//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_derive::{
    add_dependency_data, AttributeStateVar, ComponentActions, ComponentAttributes, ComponentNode,
    ComponentState, RenderedChildren, StateVariableDataQueries, StateVariableDependencies,
};
pub use std::collections::HashMap;

pub use crate::dast::flat_dast::FlatAttribute;
pub use crate::dast::flat_dast::UntaggedContent;
pub use crate::dast::Position as DastPosition;
pub use crate::dependency::DependenciesCreatedForDataQuery;
pub use crate::state::{
    ComponentState, FromDependencies, QueryUpdateRequests, TryFromState, TryToState,
};

pub use crate::utils::KeyValueIgnoreCase;
pub use crate::{ComponentIdx, Extending};

pub use crate::components::{
    AttributeStateVar, ComponentActions, ComponentAttributes, ComponentCommonData, ComponentNode,
    RenderedChildren,
};

// These imports are commonly used in components

pub use crate::attribute::AttributeName;
pub use crate::components::actions::{Action, ActionBody, UpdateFromAction};
pub use crate::components::{ActionsEnum, ComponentEnum, ComponentProfile, RenderedState};
pub use crate::dast::{
    DastAttribute, ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
};
pub use crate::dependency::{DataQuery, Dependency, DependencyValueUpdateRequest};
pub use crate::state::{
    IntoStateVar, InvertError, StateVar, StateVarCalcResult, StateVarEnumRef, StateVarEnumRefMut,
    StateVarIdx, StateVarMutableView, StateVarUpdater, StateVarValue, StateVarView,
    StateVarViewEnum,
};

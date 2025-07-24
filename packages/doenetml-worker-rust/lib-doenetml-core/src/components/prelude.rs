//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_macros::{IntoDataQueryResults, TryFromDataQueryResults, component};
pub use std::collections::HashMap;

pub use super::traits::*;
pub use super::types::*;
pub use crate::core::props::{
    DataQuery, PickPropSource, PropCalcResult, PropDefinition, PropProfile, PropUpdater,
    PropUpdaterUntyped, PropValueType,
};
pub use crate::dast::Position as DastPosition;
pub use crate::dast::flat_dast::FlatAttribute;
pub use crate::dast::flat_dast::UntaggedContent;
pub use crate::props::InvertError;
pub use crate::props::PropView;
pub use crate::props::as_updater_object;
pub use crate::props::prop_type;
pub use crate::props::traits::*;
pub use crate::props::{DataQueryResult, DataQueryResults};
pub use crate::props::{PropSource, PropSpecifier};
pub use crate::utils::KeyValueIgnoreCase;
pub use doenetml_macros::TestDataQueryTypes;

// This trait is only used when running tests involving `TestDataQueryTypes`
#[cfg(test)]
pub use crate::props::TypeDiscriminant;

pub use crate::components::{
    AttributeProp, ComponentActions, ComponentAttributes, ComponentCommonData, ComponentNode,
};

// These imports are commonly used in components

pub use crate::components::{ActionsEnum, ComponentEnum};
pub use crate::dast::{
    DastAttribute, ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
};

pub use crate::core::{graph_node::GraphNode, props::PropValue};

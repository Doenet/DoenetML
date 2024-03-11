//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_macros::component;
pub use std::collections::HashMap;

pub use super::traits::*;
pub use super::types::*;
pub use crate::core::props::DataQuery;
pub use crate::core::props::Prop;
pub use crate::core::props::PropCalcResult;
pub use crate::core::props::PropUpdater;
pub use crate::core::props::PropValueType;
pub use crate::dast::flat_dast::FlatAttribute;
pub use crate::dast::flat_dast::UntaggedContent;
pub use crate::dast::Position as DastPosition;
pub use crate::props::traits::*;
pub use crate::utils::KeyValueIgnoreCase;

pub use crate::components::{
    AttributeProp, ComponentActions, ComponentAttributes, ComponentCommonData, ComponentNode,
};

// These imports are commonly used in components

pub use crate::components::{ActionsEnum, ComponentEnum, ComponentProfile};
pub use crate::dast::{
    DastAttribute, ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
};

pub use crate::core::{
    graph_node::GraphNode,
    props::PropValue,
    render::{ChildQueryObject, ComponentChildren},
};

//! These are imports that are used for all components. They are required to use the derive
//! macros properly. Rather than repeat them each time, collect them and re-export them here.

// These imports are required for the derive macros to work correctly
pub use doenetml_derive::{
    add_dependency_data, AttributeProp, ComponentActions, ComponentAttributes,
    ComponentChildrenOld, ComponentNode, ComponentProps, PropDataQueries, PropDependencies,
};
pub use std::collections::HashMap;

pub use crate::dast::flat_dast::FlatAttribute;
pub use crate::dast::flat_dast::UntaggedContent;
pub use crate::dast::Position as DastPosition;
pub use crate::new_core::props::DataQuery;
pub use crate::new_core::props::Prop;
pub use crate::new_core::props::PropCalcResult;
pub use crate::state::ComponentProps;

use crate::state::PropPointer;
pub use crate::utils::KeyValueIgnoreCase;

pub use crate::components::{
    AttributeProp, ComponentActions, ComponentAttributes, ComponentCommonData, ComponentNode,
};

// These imports are commonly used in components

pub use crate::attribute::AttributeName;
pub use crate::components::actions::{Action, ActionBody, UpdateFromAction};
pub use crate::components::{ActionsEnum, ComponentEnum, ComponentProfile};
pub use crate::dast::{
    DastAttribute, ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
};
pub use crate::state::PropIdx;

pub use crate::new_core::{
    graph_node::GraphNode,
    props::PropValue,
    render::{ChildQueryObject, ComponentChildren},
};

// XXX: This should be moved to another file. `prelude` should only re-export things.

#[cfg_attr(feature = "web", tsify::declare)]
pub type ComponentIdx = usize;

/// Information of the source that a component is extending, which is currently
/// either another component or a prop.
#[derive(Debug, Clone)]
pub enum Extending {
    /// The component is extending another entire component, given by the component index
    Component(ComponentIdx),
    // TODO: what about array props?
    /// The component is extending the prop of another component
    Prop(PropSource),
}

#[derive(Debug, Clone, Copy)]
pub struct PropSource {
    /// The prop being extended
    pub prop_pointer: PropPointer,

    /// If true, the source of the extending was due to a direct reference,
    /// as opposed to being in an extend attribute.
    ///
    /// For example, given `<textInput name="i"/>`, a direct ref would be `$i.value` by itself,
    /// unlike `<text extend="$i.value"/>`.
    ///
    /// If we are extending from a direct ref,
    /// we need to add the referenced prop as a child in the `DataQuery::ChildPropProfile`,
    /// because the prop was not already added to the children.
    pub from_direct_ref: bool,
}

use std::collections::HashMap;

use serde::Serialize;

use crate::{
    attribute::AttributeName,
    state::{PropValue, PropViewMutEnum},
    ComponentIdx,
};

use super::PropIdx;

pub type StateProp = PropViewMutEnum;

/// Description of state data
/// - component_idx: which component generated it
/// - origin: what aspect of the component generated it
#[derive(Debug, Clone)]
pub struct StatePropDescription {
    pub component_idx: ComponentIdx,
    pub origin: StatePropDataOrigin,
}

/// State data can be generated by
/// - a prop requesting it
/// - a string child, converted into state data
///   so that it can change when requested
/// - a string in an attribute
#[derive(Serialize, Debug, Clone, Eq, Hash, PartialEq)]
pub enum StatePropDataOrigin {
    /// State data was generated because a prop make a state data query
    State(PropIdx),

    /// State data was generated by a string child.
    ///
    /// Unnamed `usize` field is the index of the string child
    StringChild(usize),

    /// State data was generated for a prop because a component did not have children.
    ///
    /// Unnamed `usize` field is the index of the prop requesting the children.
    ChildSubstitute(usize),

    /// State data was generated by a string in an attribute.
    ///
    /// Unnamed `usize` field is the index of the string child for that attribute
    Attribute(AttributeName, usize),

    /// State data was generated for a prop because an attribute did not have children.
    ///
    /// Unnamed `usize` field is the index of the prop requesting the children.
    AttributeSubstitute(AttributeName, usize),
}

// TODO: presumably there are other variants given that we have an enum here
// If not, remove enum.
pub enum InitialStateData {
    Single {
        value: PropValue,
        came_from_default: bool,
    },
}

/// Create a piece of state data that will be indexed by component_idx and origin
/// and it initialized to the value from initial_values
#[allow(clippy::ptr_arg)]
pub fn create_state_data_for(
    component_idx: ComponentIdx,
    origin: StatePropDataOrigin,
    initial_values: InitialStateData,
    state_data: &mut Vec<HashMap<StatePropDataOrigin, StateProp>>,
) -> &StateProp {
    let comp_state_data = &mut state_data[component_idx];

    assert!(!comp_state_data.contains_key(&origin));

    // TODO: if we don't add additional variants, then remove the enum and this match.
    let state = match initial_values {
        InitialStateData::Single {
            value,
            came_from_default,
        } => StateProp::new_with_value(value, came_from_default),
    };

    comp_state_data.insert(origin.clone(), state);

    // since we moved `state` into the hash map, get a new reference to it here
    comp_state_data.get(&origin).unwrap()
}

use crate::{
    component::ComponentProfile,
    state::{StateVarName, StateVarReadOnlyView},
    StateVarIdx,
};

/// A DependencyInstruction is used to make a Dependency based on the input document structure
#[derive(Debug)]
pub enum DependencyInstruction {
    Child {
        /// The dependency will match child components that has at least one of these profiles
        /// unless the child component has one of the profiles in *exclude_if_prefer_profiles*
        /// ranked higher
        match_profiles: Vec<ComponentProfile>,

        /// If a child component has one of these profiles ranked higher
        /// than any in *match_profiles*, then the child is not matched.
        exclude_if_prefer_profiles: Vec<ComponentProfile>,
    },
    StateVar {
        // TODO: will we need specify a particular component here?
        // For now, a StateVar dependency instruction will just get a state variable
        // from the given component
        // component_name: Option<ComponentName>,

        // Must match the name of a state variable
        state_var_name: StateVarName,
    },
    Parent {
        state_var_name: StateVarName,
    },
    // Attribute {
    //     attribute_name: AttributeName,
    //     default_value: StateVarValue,
    // },
    // Essential {
    //     /// Use the string of this attribute
    //     prefill: Option<AttributeName>,
    // },
}

// TODO: determine what the structure of DependencySource should be
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DependencySource {
    StateVar {
        // component_type: ComponentType,
        state_var_idx: StateVarIdx,
    },
    Essential {
        value_type: &'static str,
    },
}

/// Gives both the source of the dependency and the current value of the dependency
///
/// Passed into *calculate_state_var_from_dependencies*
#[derive(Debug)]
pub struct Dependency {
    pub source: DependencySource,
    pub value: StateVarReadOnlyView,
}

/// Information which update were requested so that we can recurse
/// and call *request_dependencies_to_update_value*
/// on the state variables of those dependencies.
///
/// The actual requested values for those dependencies were stored
/// in the *requested_value* field of their state variables.
pub struct UpdatesRequested {
    pub instruction_idx: usize,
    pub dependency_idx: usize,
}

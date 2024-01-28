use enum_dispatch::enum_dispatch;

use crate::{
    components::{ComponentEnum, ComponentProfileStateVariable, RenderedState},
    ComponentIdx,
};

use super::{StateVarEnumRef, StateVarEnumRefMut};

pub type StateVarIdx = usize;

/// Pointer to a component's state variable
#[derive(Debug, Clone, Copy)]
pub struct StateVarPointer {
    pub component_idx: ComponentIdx,
    pub state_var_idx: StateVarIdx,
}

#[enum_dispatch]
pub trait ComponentState {
    /// Get the number of state variables for this component
    fn get_num_state_variables(&self) -> StateVarIdx;

    /// Get the state variable for this component with the index `state_var_idx`
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef>;

    /// Get a mutable view of the state variable for this component with the index `state_var_idx`
    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut>;

    // TODO: do we need get_state_variable_index_from_name?
    // Right now, we use it in the parent DependencyInstruction, but maybe we can find a way
    // to specify via index directly from a function created via macro
    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx>;

    // TODO: do we need get_state_variable_index_from_name_case_insensitive?
    // It isn't used by anything right now.
    // fn get_state_variable_index_from_name_case_insensitive(
    //     &self,
    //     name: &str,
    // ) -> Option<StateVarIdx>;

    /// Get the state variable index from this component of the state variable with name
    /// that has a case-insensitive match to `name`.
    fn get_public_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx>;

    /// Return a vector of all component profile state variables of this component.
    fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable>;

    /// Get the vector of the indices of all this component's state variables
    /// that have been marked `for_renderer`.
    fn get_for_renderer_state_variable_indices(&self) -> Vec<StateVarIdx>;

    /// Return `true` is this component's state variable with index `state_var_idx`
    /// has been marked `for_renderer`.
    fn check_if_state_variable_is_for_renderer(&self, state_var_idx: StateVarIdx) -> bool;

    /// Return object with the values of all the rendered state variables
    fn return_rendered_state(&mut self) -> Option<RenderedState>;

    /// Return object with the values of all the rendered state variables
    /// that have changed since the previous call of
    /// `return_rendered_state` or `return_rendered_state_update`.
    fn return_rendered_state_update(&mut self) -> Option<RenderedState>;
}

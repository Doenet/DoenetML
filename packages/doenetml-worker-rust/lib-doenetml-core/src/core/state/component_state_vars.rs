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
pub trait ComponentStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx;

    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef>;

    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut>;

    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx>;

    fn get_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx>;

    /// Return a vector of all component profile state variables of this component.
    fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable>;

    fn get_public_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx>;

    fn get_rendered_state_variable_indices(&self) -> Vec<StateVarIdx>;

    /// Return object will the values of all the rendered state variables
    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        None
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        None
    }
}

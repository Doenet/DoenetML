use std::collections::HashMap;

use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentStateVariables)]
pub struct P {
    pub common: ComponentCommonData,

    pub state: PStateVariables,
}

#[derive(Debug, Default)]
pub struct PStateVariables {}

// TODO: derive via macros
impl ComponentStateVariables for PStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx {
        0
    }
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
        None
    }

    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
        None
    }

    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
        None
    }

    fn get_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        None
    }

    fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
        vec![]
    }

    fn get_public_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        None
    }

    fn get_for_renderer_state_variable_indices(&self) -> Vec<StateVarIdx> {
        vec![]
    }

    fn check_if_state_variable_is_for_renderer(&self, state_var_idx: StateVarIdx) -> bool {
        false
    }

    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        None
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        None
    }
}

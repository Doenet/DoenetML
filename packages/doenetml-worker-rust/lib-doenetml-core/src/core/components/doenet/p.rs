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
}

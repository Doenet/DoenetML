use std::collections::HashMap;

use crate::components::prelude::*;

#[derive(Debug, Default, ComponentNode, RenderedComponentNode, ComponentStateVariables)]
pub struct Document {
    pub common: ComponentCommonData,
    pub state: DocumentStateVariables,
}

#[derive(Debug, Default)]
pub struct DocumentStateVariables {}

// TODO: derive via macros
impl ComponentStateVariables for DocumentStateVariables {
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

    fn get_rendered_state_variable_indices(&self) -> Vec<StateVarIdx> {
        vec![]
    }

    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        None
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        None
    }
}

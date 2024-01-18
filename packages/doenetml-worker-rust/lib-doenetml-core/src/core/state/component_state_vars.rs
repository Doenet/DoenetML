use crate::ComponentIdx;

use super::StateVarEnum;

pub type StateVarIdx = u16;

/// Pointer to a component's state variable
#[derive(Debug, Clone, Copy)]
pub struct StateVarPointer {
    pub component_idx: ComponentIdx,
    pub state_var_idx: StateVarIdx,
}

pub trait ComponentStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx;

    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> &StateVarEnum;

    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> &mut StateVarEnum;

    fn get_state_variable_index_from_name(&self, name: &str) -> StateVarIdx;

    fn get_state_variable_index_from_name_case_insensitive(&self, name: &str) -> StateVarIdx;
}

use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::components::{prelude::*, RenderedState};
use crate::state::{ComponentStateVariables, StateVarEnumRef, StateVarEnumRefMut, StateVarIdx};
use crate::state_var_interfaces::boolean_state_var_interfaces::{
    GeneralBooleanStateVarInterface, SingleDependencyBooleanStateVarInterface,
};

#[derive(Debug, Default, ComponentNode, ComponentStateVariables, RenderedComponentNode)]
pub struct Boolean {
    pub common: ComponentCommonData,

    pub state: BooleanStateVariables,

    pub value_state_var_view: StateVarReadOnlyView<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BooleanRenderedState {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<bool>,
}

#[derive(Debug)]
pub struct BooleanStateVariables {
    value: StateVar<bool>,
    boolean: StateVar<bool>,
}

impl BooleanStateVariables {
    fn new() -> Self {
        BooleanStateVariables {
            value: StateVar::new(
                Box::<GeneralBooleanStateVarInterface>::default(),
                StateVarParameters {
                    for_renderer: true,
                    name: "value",
                    dependency_instruction_hint: Some(DependencyInstruction::Child {
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                        exclude_if_prefer_profiles: vec![],
                    }),
                    create_dependency_from_extend_source: true,
                    is_primary_state_variable_for_shadowing_extend_source: true,
                    is_public: true,
                },
                Default::default(),
            ),
            boolean: StateVar::new(
                Box::<SingleDependencyBooleanStateVarInterface>::default(),
                StateVarParameters {
                    name: "boolean",
                    dependency_instruction_hint: Some(
                        BooleanStateVariables::get_value_dependency_instructions(),
                    ),
                    is_public: true,
                    ..Default::default()
                },
                Default::default(),
            ),
        }
    }
}

impl Default for BooleanStateVariables {
    fn default() -> Self {
        BooleanStateVariables::new()
    }
}

// TODO: derive via macros
impl ComponentStateVariables for BooleanStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx {
        2
    }
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
        match state_var_idx {
            0 => Some((&self.value).into()),
            1 => Some((&self.boolean).into()),
            _ => None,
        }
    }

    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
        match state_var_idx {
            0 => Some((&mut self.value).into()),
            1 => Some((&mut self.boolean).into()),
            _ => None,
        }
    }

    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
        match name {
            "value" => Some(0),
            "boolean" => Some(1),
            _ => None,
        }
    }

    fn get_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        match name {
            x if x.eq_ignore_ascii_case("value") => Some(0),
            x if x.eq_ignore_ascii_case("boolean") => Some(1),
            _ => None,
        }
    }

    fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
        vec![ComponentProfileStateVariable::Boolean(
            self.value.create_new_read_only_view(),
            0,
        )]
    }

    fn get_public_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        match name {
            x if x.eq_ignore_ascii_case("value") => Some(0),
            x if x.eq_ignore_ascii_case("boolean") => Some(1),
            _ => None,
        }
    }

    fn get_rendered_state_variable_indices(&self) -> Vec<StateVarIdx> {
        vec![0]
    }

    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        Some(RenderedState::Boolean(BooleanRenderedState {
            value: Some(self.value.get_fresh_value_record_viewed().clone()),
        }))
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        if self.value.check_if_changed_since_last_viewed() {
            let mut updated_variables = BooleanRenderedState::default();
            updated_variables.value = Some(self.value.get_fresh_value_record_viewed().clone());
            Some(RenderedState::Boolean(updated_variables))
        } else {
            None
        }
    }
}

// TODO via macro
impl BooleanStateVariables {
    fn get_value_state_variable_index() -> usize {
        0
    }
    fn get_boolean_state_variable_index() -> usize {
        1
    }
    fn get_value_dependency_instructions() -> DependencyInstruction {
        DependencyInstruction::StateVar {
            component_idx: None,
            state_var_idx: 0,
        }
    }
    fn get_boolean_dependency_instructions() -> DependencyInstruction {
        DependencyInstruction::StateVar {
            component_idx: None,
            state_var_idx: 1,
        }
    }
}

use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::components::prelude::*;
use crate::state_var_interfaces::text_state_var_interfaces::{
    GeneralStringStateVarInterface, SingleDependencyStringStateVarInterface,
};

#[derive(Debug, Default, ComponentNode, ComponentStateVariables)]
pub struct Text {
    pub common: ComponentCommonData,

    pub renderer_data: TextRenderedState,

    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,

    pub state: TextStateVariables,
}

// TODO: derive via macro from state variables and annotations
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TextRenderedState {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<String>,
}

#[derive(Debug)]
pub struct TextStateVariables {
    value: StateVar<String>,
    text: StateVar<String>,
}

impl TextStateVariables {
    fn new() -> Self {
        TextStateVariables {
            value: StateVar::new(
                Box::<GeneralStringStateVarInterface>::default(),
                StateVarParameters {
                    for_renderer: true,
                    name: "value",
                    dependency_instruction_hint: Some(DependencyInstruction::Child {
                        match_profiles: vec![ComponentProfile::Text],
                        exclude_if_prefer_profiles: vec![],
                    }),
                    create_dependency_from_extend_source: true,
                    is_primary_state_variable_for_shadowing_extend_source: true,
                    is_public: true,
                },
                Default::default(),
            ),
            text: StateVar::new(
                Box::<SingleDependencyStringStateVarInterface>::default(),
                StateVarParameters {
                    name: "text",
                    dependency_instruction_hint: Some(
                        TextStateVariables::get_value_dependency_instructions(),
                    ),
                    is_public: true,
                    ..Default::default()
                },
                Default::default(),
            ),
        }
    }
}

impl Default for TextStateVariables {
    fn default() -> Self {
        TextStateVariables::new()
    }
}

// TODO: derive via macros
impl ComponentStateVariables for TextStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx {
        2
    }
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
        match state_var_idx {
            0 => Some((&self.value).into()),
            1 => Some((&self.text).into()),
            _ => None,
        }
    }

    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
        match state_var_idx {
            0 => Some((&mut self.value).into()),
            1 => Some((&mut self.text).into()),
            _ => None,
        }
    }

    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
        match name {
            "value" => Some(0),
            "text" => Some(1),
            _ => None,
        }
    }

    fn get_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        match name {
            x if x.eq_ignore_ascii_case("value") => Some(0),
            x if x.eq_ignore_ascii_case("text") => Some(1),
            _ => None,
        }
    }

    fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
        vec![ComponentProfileStateVariable::Text(
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
            x if x.eq_ignore_ascii_case("text") => Some(1),
            _ => None,
        }
    }

    fn get_rendered_state_variable_indices(&self) -> Vec<StateVarIdx> {
        vec![0]
    }

    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        Some(RenderedState::Text(TextRenderedState {
            value: Some(self.value.get_fresh_value_record_viewed().clone()),
        }))
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        if self.value.check_if_changed_since_last_viewed() {
            let mut updated_variables = TextRenderedState::default();
            updated_variables.value = Some(self.value.get_fresh_value_record_viewed().clone());
            Some(RenderedState::Text(updated_variables))
        } else {
            None
        }
    }
}

// TODO via macro
impl TextStateVariables {
    fn get_value_state_variable_index() -> usize {
        0
    }
    fn get_text_state_variable_index() -> usize {
        1
    }
    fn get_value_dependency_instructions() -> DependencyInstruction {
        DependencyInstruction::StateVar {
            component_idx: None,
            state_var_idx: 0,
        }
    }
    fn get_text_dependency_instructions() -> DependencyInstruction {
        DependencyInstruction::StateVar {
            component_idx: None,
            state_var_idx: 1,
        }
    }
}

impl RenderedComponentNode for Text {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.no_rendered_children
    }
}

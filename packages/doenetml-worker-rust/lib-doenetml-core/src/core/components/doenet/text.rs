use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::components::{prelude::*, RenderedState};
use crate::state_var_interfaces::text_state_var_interfaces::{
    GeneralStringStateVarInterface, SingleDependencyStringStateVarInterface,
};

#[derive(Debug, Default, ComponentNode)]
pub struct Text {
    pub common: ComponentCommonData,

    pub value_state_var_view: StateVarReadOnlyView<String>,

    pub renderer_data: TextRenderedState,

    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,
}

pub struct TextState {
    value: StateVar<String>,
    text: StateVar<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TextRenderedState {
    pub value: Option<String>,
}

impl RenderedComponentNode for Text {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.no_rendered_children
    }

    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        Some(RenderedState::Text(TextRenderedState {
            value: Some(
                self.value_state_var_view
                    .get_fresh_value_record_viewed()
                    .clone(),
            ),
        }))
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        let mut updated_variables = TextRenderedState::default();

        if self
            .value_state_var_view
            .check_if_changed_since_last_viewed()
        {
            updated_variables.value = Some(
                self.value_state_var_view
                    .get_fresh_value_record_viewed()
                    .clone(),
            )
        }
        Some(RenderedState::Text(updated_variables))
    }
}

impl ComponentNodeStateVariables for Text {
    fn initialize_state_variables(&mut self) {
        self.common.state_variables = Vec::new();

        ///////////////////////
        // Value state variable
        ///////////////////////

        let value_state_variable = StateVar::new(
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
        );

        // save a view to field for easy access when create flat dast
        self.value_state_var_view = value_state_variable.create_new_read_only_view();

        // Use the value state variable for fulfilling the text component profile
        self.common.component_profile_state_variables = vec![ComponentProfileStateVariable::Text(
            value_state_variable.create_new_read_only_view(),
            "value",
        )];
        self.common
            .state_variables
            .push(StateVarEnum::String(value_state_variable));

        //////////////////////
        // Text state variable
        //////////////////////
        let text_state_variable = StateVar::new(
            Box::<SingleDependencyStringStateVarInterface>::default(),
            StateVarParameters {
                name: "text",
                dependency_instruction_hint: Some(DependencyInstruction::StateVar {
                    component_idx: None,
                    state_var_name: "value",
                }),
                is_public: true,
                ..Default::default()
            },
            Default::default(),
        );
        self.common
            .state_variables
            .push(StateVarEnum::String(text_state_variable));
    }
}

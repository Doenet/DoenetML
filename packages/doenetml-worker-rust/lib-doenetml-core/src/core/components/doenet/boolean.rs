use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::components::{prelude::*, RenderedState};
use crate::state_var_interfaces::boolean_state_var_interfaces::{
    GeneralBooleanStateVarInterface, SingleDependencyBooleanStateVarInterface,
};

#[derive(Debug, Default, ComponentNode)]
pub struct Boolean {
    pub common: ComponentCommonData,

    pub value_state_var_view: StateVarReadOnlyViewTyped<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BooleanRenderedState {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value: Option<bool>,
}

impl RenderedComponentNode for Boolean {
    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        Some(RenderedState::Boolean(BooleanRenderedState {
            value: Some(*self.value_state_var_view.get_fresh_value_record_viewed()),
        }))
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        let value_changed = self
            .value_state_var_view
            .check_if_changed_since_last_viewed();

        if value_changed {
            let updated_variables = BooleanRenderedState {
                value: Some(*self.value_state_var_view.get_fresh_value_record_viewed()),
            };

            Some(RenderedState::Boolean(updated_variables))
        } else {
            None
        }
    }
}

impl ComponentNodeStateVariables for Boolean {
    fn initialize_state_variables(&mut self) {
        self.common.state_variables = Vec::new();

        ///////////////////////
        // Value state variable
        ///////////////////////

        let value_state_variable = StateVarTyped::new(
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
        );

        // save a view to field for easy access when create flat dast
        self.value_state_var_view = value_state_variable.create_new_read_only_view();

        // Use the value state variable for fulfilling the boolean component profile
        self.common.component_profile_state_variables =
            vec![ComponentProfileStateVariable::Boolean(
                value_state_variable.create_new_read_only_view(),
                "value",
            )];
        self.common
            .state_variables
            .push(StateVar::Boolean(value_state_variable));

        //////////////////////
        // Boolean state variable
        //////////////////////
        let boolean_state_variable = StateVarTyped::new(
            Box::<SingleDependencyBooleanStateVarInterface>::default(),
            StateVarParameters {
                name: "boolean",
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
            .push(StateVar::Boolean(boolean_state_variable));
    }
}

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use strum::VariantNames;
use strum_macros::EnumVariantNames;

use crate::{
    components::{actions::ActionBody, prelude::*, ActionsEnum, RenderedState},
    state::{ComponentStateVariables, StateVarIdx},
    state_var_interfaces::{
        boolean_state_var_interfaces::GeneralBooleanStateVarInterface,
        text_state_var_interfaces::GeneralStringStateVarInterface,
    },
};

#[derive(Debug, Deserialize, Serialize)]
#[cfg_attr(feature = "web", derive(tsify::Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
#[serde(expecting = "`text` must be a string")]
pub struct TextInputActionArgs {
    pub text: String,
}

#[derive(Debug, Deserialize, Serialize, EnumVariantNames)]
#[serde(tag = "actionName", rename_all = "camelCase")]
#[strum(serialize_all = "camelCase")]
#[cfg_attr(feature = "web", derive(tsify::Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum TextInputAction {
    UpdateImmediateValue(ActionBody<TextInputActionArgs>),
    UpdateValue,
}

#[derive(Debug, Default, ComponentNode)]
pub struct TextInput {
    pub common: ComponentCommonData,

    pub immediate_value_state_var_view: StateVarReadOnlyView<String>,

    pub disabled_state_var_view: StateVarReadOnlyView<bool>,

    pub state: TextInputStateVariables,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct TextInputRenderedState {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub immediate_value: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub disabled: Option<bool>,
}

#[derive(Debug)]
pub struct TextInputStateVariables {
    value: StateVar<String>,
    immediate_value: StateVar<String>,
    sync_immediate_value: StateVar<bool>,
    bind_value_to: StateVar<String>,
    prefill: StateVar<String>,
    hidden: StateVar<bool>,
    disabled: StateVar<bool>,
}

impl TextInputStateVariables {
    fn new() -> Self {
        TextInputStateVariables {
            value: StateVar::new(
                Box::<ValueStateVarInterface>::default(),
                StateVarParameters {
                    name: "value",
                    is_public: true,
                    ..Default::default()
                },
                Default::default(),
            ),
            immediate_value: StateVar::new(
                Box::<ImmediateValueStateVarInterface>::default(),
                StateVarParameters {
                    name: "immediateValue",
                    is_public: true,
                    for_renderer: true,
                    ..Default::default()
                },
                Default::default(),
            ),
            sync_immediate_value: StateVar::new(
                Box::<SyncImmediateValueStateVarInterface>::default(),
                StateVarParameters {
                    name: "syncImmediateValue",
                    ..Default::default()
                },
                true,
            ),
            bind_value_to: StateVar::new(
                Box::<GeneralStringStateVarInterface>::default(),
                StateVarParameters {
                    name: "bindValueTo",
                    dependency_instruction_hint: Some(DependencyInstruction::AttributeChild {
                        attribute_name: "bindValueTo",
                        match_profiles: vec![ComponentProfile::Text],
                    }),
                    ..Default::default()
                },
                Default::default(),
            ),
            prefill: StateVar::new(
                Box::<GeneralStringStateVarInterface>::default(),
                StateVarParameters {
                    name: "prefill",
                    dependency_instruction_hint: Some(DependencyInstruction::AttributeChild {
                        attribute_name: "prefill",
                        match_profiles: vec![ComponentProfile::Text],
                    }),
                    ..Default::default()
                },
                Default::default(),
            ),
            hidden: StateVar::new(
                Box::<GeneralBooleanStateVarInterface>::default(),
                StateVarParameters {
                    name: "hidden",
                    dependency_instruction_hint: Some(DependencyInstruction::AttributeChild {
                        attribute_name: "hide",
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                    }),
                    is_public: true,
                    ..Default::default()
                },
                false,
            ),
            disabled: StateVar::new(
                Box::<GeneralBooleanStateVarInterface>::default(),
                StateVarParameters {
                    name: "disabled",
                    dependency_instruction_hint: Some(DependencyInstruction::AttributeChild {
                        attribute_name: "disabled",
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                    }),
                    is_public: true,
                    for_renderer: true,
                    ..Default::default()
                },
                false,
            ),
        }
    }
}

impl Default for TextInputStateVariables {
    fn default() -> Self {
        TextInputStateVariables::new()
    }
}

impl ComponentStateVariables for TextInputStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx {
        7
    }
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> &StateVarEnum {
        match state_var_idx {
            0 => self.value.try_into().unwrap(),
        }
    }
}

impl TextInputStateVariables {
    fn value_dependency_instructions(&self) -> DependencyInstruction {
        todo!("macro");
    }
    fn immediate_value_dependency_instructions(&self) -> DependencyInstruction {
        todo!("macro");
    }
    fn sync_immediate_value_dependency_instructions(&self) -> DependencyInstruction {
        todo!("macro");
    }
}

impl RenderedComponentNode for TextInput {
    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        Some(RenderedState::TextInput(TextInputRenderedState {
            immediate_value: Some(
                self.immediate_value_state_var_view
                    .get_fresh_value_record_viewed()
                    .clone(),
            ),
            disabled: Some(*self.disabled_state_var_view.get_fresh_value_record_viewed()),
        }))
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        let value_changed = self
            .immediate_value_state_var_view
            .check_if_changed_since_last_viewed();

        let disabled_changed = self
            .disabled_state_var_view
            .check_if_changed_since_last_viewed();

        if value_changed || disabled_changed {
            let mut updated_variables = TextInputRenderedState::default();

            if value_changed {
                updated_variables.immediate_value = Some(
                    self.immediate_value_state_var_view
                        .get_fresh_value_record_viewed()
                        .clone(),
                );
            }

            if disabled_changed {
                updated_variables.disabled =
                    Some(*self.disabled_state_var_view.get_fresh_value_record_viewed());
            }

            Some(RenderedState::TextInput(updated_variables))
        } else {
            None
        }
    }

    fn get_attribute_names(&self) -> Vec<AttributeName> {
        vec!["bindValueTo", "hide", "disabled", "prefill"]
    }

    fn get_action_names(&self) -> Vec<String> {
        TextInputAction::VARIANTS
            .iter()
            .map(|s| s.to_string())
            .collect()
    }

    fn on_action(
        &self,
        action: ActionsEnum,
        resolve_and_retrieve_state_var: &mut dyn FnMut(usize) -> StateVarValueEnum,
    ) -> Result<Vec<(usize, StateVarValueEnum)>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: TextInputAction = action.try_into()?;

        match action {
            TextInputAction::UpdateImmediateValue(ActionBody { args }) => Ok(vec![
                (
                    self.common.state_variable_name_to_index["immediateValue"],
                    StateVarValueEnum::String(args.text),
                ),
                (
                    self.common.state_variable_name_to_index["syncImmediateValue"],
                    StateVarValueEnum::Boolean(false),
                ),
            ]),

            TextInputAction::UpdateValue => {
                let new_val = resolve_and_retrieve_state_var(
                    self.common.state_variable_name_to_index["immediateValue"],
                );

                Ok(vec![(
                    self.common.state_variable_name_to_index["value"],
                    new_val,
                )])
            }
        }
    }
}

impl ComponentNodeStateVariables for TextInput {
    fn initialize_state_variables(&mut self) {
        // Use the value state variable for fulfilling the text component profile
        self.common.component_profile_state_variables = vec![ComponentProfileStateVariable::Text(
            self.state.value.create_new_read_only_view(),
            "value",
        )];
    }
}

#[derive(Debug, Default)]
struct ValueStateVarInterface {
    essential_value: StateVarReadOnlyView<String>,
    immediate_value: StateVarReadOnlyView<String>,
    sync_immediate_value: StateVarReadOnlyView<bool>,
    bind_value_to: StateVarReadOnlyView<String>,
    prefill: StateVarReadOnlyView<String>,
}

impl StateVarInterface<String> for ValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
        _parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        vec![
            DependencyInstruction::Essential,
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "immediateValue",
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "syncImmediateValue",
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "bindValueTo",
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "prefill",
            },
        ]
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        if let StateVarReadOnlyViewEnum::String(essential_value) = &dependencies[0][0].value {
            self.essential_value = essential_value.create_new_read_only_view();
        } else {
            panic!("Got a non-string essential value for value of text input.");
        }

        if let StateVarReadOnlyViewEnum::String(immediate_value) = &dependencies[1][0].value {
            self.immediate_value = immediate_value.create_new_read_only_view();
        } else {
            panic!("Got a non-string immediate value for value of text input.");
        }

        if let StateVarReadOnlyViewEnum::Boolean(sync_immediate_value) = &dependencies[2][0].value {
            self.sync_immediate_value = sync_immediate_value.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean sync immediate value for value of text input.");
        }

        if let StateVarReadOnlyViewEnum::String(bind_value_to) = &dependencies[3][0].value {
            self.bind_value_to = bind_value_to.create_new_read_only_view();
        } else {
            panic!("Got a non-string bind_value_to for value of text input.");
        }

        if let StateVarReadOnlyViewEnum::String(prefill) = &dependencies[4][0].value {
            self.prefill = prefill.create_new_read_only_view();
        } else {
            panic!("Got a non-string prefill for value of text input.");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableView<String>,
    ) {
        let bind_value_to_used_default = self.bind_value_to.get_used_default();

        let value = if *self.sync_immediate_value.get_fresh_value() {
            self.immediate_value.get_fresh_value().clone()
        } else if bind_value_to_used_default {
            if self.essential_value.get_used_default() {
                self.prefill.get_fresh_value().clone()
            } else {
                self.essential_value.get_fresh_value().clone()
            }
        } else {
            self.bind_value_to.get_fresh_value().clone()
        };

        let value_changed = if let Some(old_value) = state_var.try_get_last_value() {
            value != *old_value
        } else {
            true
        };

        if value_changed {
            state_var.set_value(value);
        } else {
            state_var.restore_previous_value();
        }
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let desired_value = state_var.get_requested_value();
        let bind_value_to_used_default = self.bind_value_to.get_used_default();

        if bind_value_to_used_default {
            self.essential_value
                .request_change_value_to(desired_value.clone());
            self.immediate_value
                .request_change_value_to(desired_value.clone());
            self.sync_immediate_value.request_change_value_to(true);

            Ok(vec![
                DependencyValueUpdateRequest {
                    instruction_idx: 0,
                    dependency_idx: 0,
                },
                DependencyValueUpdateRequest {
                    instruction_idx: 1,
                    dependency_idx: 0,
                },
                DependencyValueUpdateRequest {
                    instruction_idx: 2,
                    dependency_idx: 0,
                },
            ])
        } else {
            self.bind_value_to
                .request_change_value_to(desired_value.clone());
            self.sync_immediate_value.request_change_value_to(true);

            Ok(vec![
                DependencyValueUpdateRequest {
                    instruction_idx: 3,
                    dependency_idx: 0,
                },
                DependencyValueUpdateRequest {
                    instruction_idx: 2,
                    dependency_idx: 0,
                },
            ])
        }
    }
}

#[derive(Debug, Default)]
struct ImmediateValueStateVarInterface {
    essential_value: StateVarReadOnlyView<String>,
    sync_immediate_value: StateVarReadOnlyView<bool>,
    bind_value_to: StateVarReadOnlyView<String>,
    prefill: StateVarReadOnlyView<String>,
}

impl StateVarInterface<String> for ImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
        _parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        vec![
            DependencyInstruction::Essential,
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "syncImmediateValue",
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "bindValueTo",
            },
            DependencyInstruction::StateVar {
                component_idx: None,
                state_var_name: "prefill",
            },
        ]
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        if let StateVarReadOnlyViewEnum::String(essential_value) = &dependencies[0][0].value {
            self.essential_value = essential_value.create_new_read_only_view();
        } else {
            panic!("Got a non-string essential value for immediate value of text input.");
        }

        if let StateVarReadOnlyViewEnum::Boolean(sync_immediate_value) = &dependencies[1][0].value {
            self.sync_immediate_value = sync_immediate_value.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean sync immediate value for immediate value of text input.");
        }

        if let StateVarReadOnlyViewEnum::String(bind_value_to) = &dependencies[2][0].value {
            self.bind_value_to = bind_value_to.create_new_read_only_view();
        } else {
            panic!("Got a non-string bind_value_to for immediate value of text input.");
        }

        if let StateVarReadOnlyViewEnum::String(prefill) = &dependencies[3][0].value {
            self.prefill = prefill.create_new_read_only_view();
        } else {
            panic!("Got a non-string prefill for immediate value of text input.");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableView<String>,
    ) {
        let bind_value_to_used_default = self.bind_value_to.get_used_default();

        let immediate_value =
            if !bind_value_to_used_default && *self.sync_immediate_value.get_fresh_value() {
                self.bind_value_to.get_fresh_value().clone()
            } else if self.essential_value.get_used_default() {
                self.prefill.get_fresh_value().clone()
            } else {
                self.essential_value.get_fresh_value().clone()
            };

        let value_changed = if let Some(old_value) = state_var.try_get_last_value() {
            immediate_value != *old_value
        } else {
            true
        };

        if value_changed {
            state_var.set_value(immediate_value);
        } else {
            state_var.restore_previous_value();
        }
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let desired_value = state_var.get_requested_value();

        let mut updates = Vec::with_capacity(2);
        let bind_value_to_used_default = self.bind_value_to.get_used_default();

        self.essential_value
            .request_change_value_to(desired_value.clone());

        updates.push(DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        });

        if !is_direct_change_from_renderer && !bind_value_to_used_default {
            self.bind_value_to
                .request_change_value_to(desired_value.clone());

            updates.push(DependencyValueUpdateRequest {
                instruction_idx: 2,
                dependency_idx: 0,
            });
        }

        Ok(updates)
    }
}

#[derive(Debug, Default)]
struct SyncImmediateValueStateVarInterface {
    essential_value: StateVarReadOnlyView<bool>,
}

impl StateVarInterface<bool> for SyncImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &self,
        _extend_source: Option<&ExtendSource>,
        _parameters: &StateVarParameters,
    ) -> Vec<DependencyInstruction> {
        vec![DependencyInstruction::Essential]
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        if let StateVarReadOnlyViewEnum::Boolean(essential_value) = &dependencies[0][0].value {
            self.essential_value = essential_value.create_new_read_only_view();
        } else {
            panic!("Got a non-boolean essential value for syncImmediate of text input.");
        }
    }

    fn calculate_state_var_from_dependencies_and_mark_fresh(
        &self,
        state_var: &StateVarMutableView<bool>,
    ) {
        state_var.set_value(*self.essential_value.get_fresh_value());
    }

    fn request_dependencies_to_update_value(
        &self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let desired_value = state_var.get_requested_value();

        self.essential_value.request_change_value_to(*desired_value);

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

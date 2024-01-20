use serde::{Deserialize, Serialize};
use strum::VariantNames;
use strum_macros::EnumVariantNames;

use crate::{
    components::{actions::ActionBody, prelude::*, ActionsEnum},
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

#[derive(Debug, Default, ComponentNode, ComponentStateVariables)]
pub struct TextInput {
    pub common: ComponentCommonData,

    pub state: TextInputStateVariables,
}

#[derive(Debug, ComponentStateVariables)]
pub struct TextInputStateVariables {
    #[is_public]
    #[component_profile_state_variables(Text)]
    value: StateVar<String>,

    #[for_renderer]
    #[is_public]
    immediate_value: StateVar<String>,

    sync_immediate_value: StateVar<bool>,

    bind_value_to: StateVar<String>,

    #[is_public]
    prefill: StateVar<String>,

    #[is_public]
    hidden: StateVar<bool>,

    #[for_renderer]
    #[is_public]
    disabled: StateVar<bool>,
}

impl TextInputStateVariables {
    fn new() -> Self {
        TextInputStateVariables {
            value: StateVar::new(
                Box::<ValueStateVarInterface>::default(),
                StateVarParameters {
                    ..Default::default()
                },
                Default::default(),
            ),
            immediate_value: StateVar::new(
                Box::<ImmediateValueStateVarInterface>::default(),
                StateVarParameters {
                    ..Default::default()
                },
                Default::default(),
            ),
            sync_immediate_value: StateVar::new(
                Box::<SyncImmediateValueStateVarInterface>::default(),
                StateVarParameters {
                    ..Default::default()
                },
                true,
            ),
            bind_value_to: StateVar::new(
                Box::<GeneralStringStateVarInterface>::default(),
                StateVarParameters {
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
                    dependency_instruction_hint: Some(DependencyInstruction::AttributeChild {
                        attribute_name: "hide",
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                    }),
                    ..Default::default()
                },
                false,
            ),
            disabled: StateVar::new(
                Box::<GeneralBooleanStateVarInterface>::default(),
                StateVarParameters {
                    dependency_instruction_hint: Some(DependencyInstruction::AttributeChild {
                        attribute_name: "disabled",
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                    }),
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

impl RenderedComponentNode for TextInput {
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
        resolve_and_retrieve_state_var: &mut dyn FnMut(StateVarIdx) -> StateVarValueEnum,
    ) -> Result<Vec<(StateVarIdx, StateVarValueEnum)>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: TextInputAction = action.try_into()?;

        match action {
            TextInputAction::UpdateImmediateValue(ActionBody { args }) => Ok(vec![
                (
                    TextInputStateVariables::get_immediate_value_state_variable_index(),
                    StateVarValueEnum::String(args.text),
                ),
                (
                    TextInputStateVariables::get_sync_immediate_value_state_variable_index(),
                    StateVarValueEnum::Boolean(false),
                ),
            ]),

            TextInputAction::UpdateValue => {
                let new_val = resolve_and_retrieve_state_var(
                    TextInputStateVariables::get_immediate_value_state_variable_index(),
                );

                Ok(vec![(
                    TextInputStateVariables::get_value_state_variable_index(),
                    new_val,
                )])
            }
        }
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
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        vec![
            DependencyInstruction::Essential,
            TextInputStateVariables::get_immediate_value_dependency_instructions(),
            TextInputStateVariables::get_sync_immediate_value_dependency_instructions(),
            TextInputStateVariables::get_bind_value_to_dependency_instructions(),
            TextInputStateVariables::get_prefill_dependency_instructions(),
        ]
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        self.essential_value = (&dependencies[0][0].value).try_into().unwrap();
        self.immediate_value = (&dependencies[1][0].value).try_into().unwrap();
        self.sync_immediate_value = (&dependencies[2][0].value).try_into().unwrap();
        self.bind_value_to = (&dependencies[3][0].value).try_into().unwrap();
        self.prefill = (&dependencies[4][0].value).try_into().unwrap();
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
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        vec![
            DependencyInstruction::Essential,
            TextInputStateVariables::get_sync_immediate_value_dependency_instructions(),
            TextInputStateVariables::get_bind_value_to_dependency_instructions(),
            TextInputStateVariables::get_prefill_dependency_instructions(),
        ]
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        self.essential_value = (&dependencies[0][0].value).try_into().unwrap();
        self.sync_immediate_value = (&dependencies[1][0].value).try_into().unwrap();
        self.bind_value_to = (&dependencies[2][0].value).try_into().unwrap();
        self.prefill = (&dependencies[3][0].value).try_into().unwrap();
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
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        vec![DependencyInstruction::Essential]
    }

    fn save_dependencies_for_value_calculation(&mut self, dependencies: &Vec<Vec<Dependency>>) {
        self.essential_value = (&dependencies[0][0].value).try_into().unwrap();
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

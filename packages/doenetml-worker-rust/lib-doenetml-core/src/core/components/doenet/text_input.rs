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

/// Definition of the `<textInput>` DoenetML component
#[derive(Debug, Default, ComponentNode, ComponentStateVariables)]
pub struct TextInput {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<textInput>` component.
    pub state: TextInputStateVariables,

    /// An empty vector that will be returned with `get_rendered_children`
    /// indicating this component has no children that are rendered.
    ///
    /// (Created because `get_rendered_children` must return a reference to a vector,)
    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,
}

/// The state variables that underlie the `<textInput>` component.
#[derive(Debug, ComponentStateVariables)]
pub struct TextInputStateVariables {
    /// The value of the `<textInput>` component.
    ///
    /// It is updated when a user presses Enter or blurs away from the input box.
    /// (See the `immediate_value` state variable for the current value of the input box.)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked with the `Text` component profile state variable, indicating that the `<textInput>` component
    /// can represent a text value by returning the value of this state variable.
    #[is_public]
    #[component_profile_state_variable(Text)]
    value: StateVar<String>,

    /// The current value of the text inside the input box of the `<textInput>` component.
    ///
    /// It is updated every time a user presses a key so that should represent that actual text shown
    /// in the input box.
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<textInput>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.immediateValue`.
    #[for_renderer]
    #[is_public]
    immediate_value: StateVar<String>,

    // TODO: there are subtleties for why needed `sync_immediate_value` to get the proper behavior of `<textInput>`.
    // Will figure these out again as write a test for making sure it works correctly.
    // Also, it's behavior may change if we replace `bind_value_to` with children.
    sync_immediate_value: StateVar<bool>,

    // TODO: remove the `bind_value_to` attribute, and instead have the text input bind to the value of children, if present?
    bind_value_to: StateVar<String>,

    /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
    ///
    /// It is ignored if `bind_value_to` is specified.
    /// (Assuming we remove `bind_value_to`, the presence of children will instead cause `prefill` to be ignored.)
    #[is_public]
    prefill: StateVar<String>,

    /// A variable that determines whether or not a text input should be sent to the renderer (i.e., appear in the render tree).
    ///
    /// If `hidden` is true, then don't send the text input to the renderer. (TODO: implement this)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.hidden`.
    #[is_public]
    hidden: StateVar<bool>,

    /// A variable that determines whether or not a text input can be interacted with.
    ///
    /// If `disabled`, then a user cannot interact with the text input,
    /// and the input box should display as disabled (e.g., grayed out)
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<textInput>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.disabled`.
    #[for_renderer]
    #[is_public]
    disabled: StateVar<bool>,
}

impl TextInputStateVariables {
    fn new() -> Self {
        TextInputStateVariables {
            value: StateVar::new(Box::new(ValueStateVarInterface::new()), Default::default()),
            immediate_value: StateVar::new(
                Box::new(ImmediateValueStateVarInterface::new()),
                Default::default(),
            ),
            sync_immediate_value: StateVar::new(
                Box::new(SyncImmediateValueStateVarInterface::new()),
                true,
            ),
            bind_value_to: StateVar::new(
                Box::new(GeneralStringStateVarInterface::new(
                    DependencyInstruction::AttributeChild {
                        attribute_name: "bindValueTo",
                        match_profiles: vec![ComponentProfile::Text],
                    },
                )),
                Default::default(),
            ),
            prefill: StateVar::new(
                Box::new(GeneralStringStateVarInterface::new(
                    DependencyInstruction::AttributeChild {
                        attribute_name: "prefill",
                        match_profiles: vec![ComponentProfile::Text],
                    },
                )),
                Default::default(),
            ),
            hidden: StateVar::new(
                Box::new(GeneralBooleanStateVarInterface::new(
                    DependencyInstruction::AttributeChild {
                        attribute_name: "hide",
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                    },
                )),
                Default::default(),
            ),
            disabled: StateVar::new(
                Box::new(GeneralBooleanStateVarInterface::new(
                    DependencyInstruction::AttributeChild {
                        attribute_name: "disabled",
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                    },
                )),
                Default::default(),
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
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.no_rendered_children
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

/// The interface for the value state variable of a text input
#[derive(Debug, Default)]
struct ValueStateVarInterface {
    /// The dependency instructions that indicate how the dependencies of this state variable will be created.
    dependency_instructions: ValueDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: ValueDependencies,
}

impl ValueStateVarInterface {
    fn new() -> Self {
        ValueStateVarInterface {
            ..Default::default()
        }
    }
}

/// The dependencies of the value state variable of the text input component
#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct ValueDependencies {
    essential: StateVarReadOnlyView<String>,
    immediate_value: StateVarReadOnlyView<String>,
    sync_immediate_value: StateVarReadOnlyView<bool>,
    bind_value_to: StateVarReadOnlyView<String>,
    prefill: StateVarReadOnlyView<String>,
}

impl StateVarInterface<String> for ValueStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = ValueDependencyInstructions {
            essential: Some(DependencyInstruction::Essential),
            immediate_value: Some(
                TextInputStateVariables::get_immediate_value_dependency_instructions(),
            ),
            sync_immediate_value: Some(
                TextInputStateVariables::get_sync_immediate_value_dependency_instructions(),
            ),
            bind_value_to: Some(
                TextInputStateVariables::get_bind_value_to_dependency_instructions(),
            ),
            prefill: Some(TextInputStateVariables::get_prefill_dependency_instructions()),
        };

        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<String>) {
        let value = if *self.dependency_values.sync_immediate_value.get() {
            self.dependency_values.immediate_value.get().clone()
        } else if self.dependency_values.bind_value_to.get_used_default() {
            if self.dependency_values.essential.get_used_default() {
                self.dependency_values.prefill.get().clone()
            } else {
                self.dependency_values.essential.get().clone()
            }
        } else {
            self.dependency_values.bind_value_to.get().clone()
        };

        state_var.set_value(value);
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();
        let bind_value_to_used_default = self.dependency_values.bind_value_to.get_used_default();

        if bind_value_to_used_default {
            self.dependency_values
                .essential
                .request_change_value_to(requested_value.clone());
            self.dependency_values
                .immediate_value
                .request_change_value_to(requested_value.clone());
            self.dependency_values
                .sync_immediate_value
                .request_change_value_to(true);

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
            self.dependency_values
                .bind_value_to
                .request_change_value_to(requested_value.clone());
            self.dependency_values
                .sync_immediate_value
                .request_change_value_to(true);

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

/// The interface for the immediate_value state variable of a text input
#[derive(Debug, Default)]
struct ImmediateValueStateVarInterface {
    /// The dependency instructions that indicate how the dependencies of this state variable will be created.
    dependency_instructions: ImmediateValueDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: ImmediateValueDependencies,
}

impl ImmediateValueStateVarInterface {
    fn new() -> Self {
        ImmediateValueStateVarInterface {
            ..Default::default()
        }
    }
}

/// The dependencies of the immediate_value state variable of the text input component
#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct ImmediateValueDependencies {
    essential: StateVarReadOnlyView<String>,
    sync_immediate_value: StateVarReadOnlyView<bool>,
    bind_value_to: StateVarReadOnlyView<String>,
    prefill: StateVarReadOnlyView<String>,
}

impl StateVarInterface<String> for ImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = ImmediateValueDependencyInstructions {
            essential: Some(DependencyInstruction::Essential),
            sync_immediate_value: Some(
                TextInputStateVariables::get_sync_immediate_value_dependency_instructions(),
            ),
            bind_value_to: Some(
                TextInputStateVariables::get_bind_value_to_dependency_instructions(),
            ),
            prefill: Some(TextInputStateVariables::get_prefill_dependency_instructions()),
        };

        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<String>) {
        let immediate_value = if !self.dependency_values.bind_value_to.get_used_default()
            && *self.dependency_values.sync_immediate_value.get()
        {
            self.dependency_values.bind_value_to.get().clone()
        } else if self.dependency_values.essential.get_used_default() {
            self.dependency_values.prefill.get().clone()
        } else {
            self.dependency_values.essential.get().clone()
        };

        state_var.set_value(immediate_value);
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<String>,
        is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        let mut updates = Vec::with_capacity(2);
        let bind_value_to_used_default = self.dependency_values.bind_value_to.get_used_default();

        self.dependency_values
            .essential
            .request_change_value_to(requested_value.clone());

        updates.push(DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        });

        if !is_direct_change_from_renderer && !bind_value_to_used_default {
            self.dependency_values
                .bind_value_to
                .request_change_value_to(requested_value.clone());

            updates.push(DependencyValueUpdateRequest {
                instruction_idx: 2,
                dependency_idx: 0,
            });
        }

        Ok(updates)
    }
}

/// The interface for the sync_immediate_value state variable of a text input
#[derive(Debug, Default)]
struct SyncImmediateValueStateVarInterface {
    /// The dependency instructions that indicate how the dependencies of this state variable will be created.
    dependency_instructions: SyncImmediateValueDependencyInstructions,

    /// The values of the dependencies created from the dependency instructions
    dependency_values: SyncImmediateValueDependencies,
}

impl SyncImmediateValueStateVarInterface {
    fn new() -> Self {
        SyncImmediateValueStateVarInterface {
            ..Default::default()
        }
    }
}

/// The dependencies of the sync_immediate_value state variable of the text input component
#[derive(Debug, Default, StateVariableDependencies, StateVariableDependencyInstructions)]
struct SyncImmediateValueDependencies {
    essential: StateVarReadOnlyView<bool>,
}

impl StateVarInterface<bool> for SyncImmediateValueStateVarInterface {
    fn return_dependency_instructions(
        &mut self,
        _extending: Option<ExtendSource>,
        _state_var_idx: StateVarIdx,
    ) -> Vec<DependencyInstruction> {
        self.dependency_instructions = SyncImmediateValueDependencyInstructions {
            essential: Some(DependencyInstruction::Essential),
        };

        self.dependency_instructions.instructions_as_vec()
    }

    fn save_dependencies(&mut self, dependencies: &Vec<DependenciesCreatedForInstruction>) {
        self.dependency_values = dependencies.try_into().unwrap();
    }

    fn calculate_state_var_from_dependencies(&self, state_var: &StateVarMutableView<bool>) {
        state_var.set_value(*self.dependency_values.essential.get());
    }

    fn request_updated_dependency_values(
        &self,
        state_var: &StateVarReadOnlyView<bool>,
        _is_direct_change_from_renderer: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, RequestDependencyUpdateError> {
        let requested_value = state_var.get_requested_value();

        self.dependency_values
            .essential
            .request_change_value_to(*requested_value);

        Ok(vec![DependencyValueUpdateRequest {
            instruction_idx: 0,
            dependency_idx: 0,
        }])
    }
}

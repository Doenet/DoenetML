use serde::{Deserialize, Serialize};
use strum::VariantNames;
use strum_macros::EnumVariantNames;

use crate::{
    components::prelude::*,
    state_var_interfaces::{
        boolean_state_var_interfaces::GeneralBooleanStateVarInterface,
        text_state_var_interfaces::GeneralStringStateVarInterface,
    },
};

use super::{
    immediate_value_interface::ImmediateValueStateVarInterface,
    sync_immediate_value_interface::SyncImmediateValueStateVarInterface,
    value_interface::ValueStateVarInterface,
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
#[derive(Debug, Default, ComponentNode, ComponentState)]
pub struct TextInput {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<textInput>` component.
    pub state: TextInputState,
}

/// The state variables that underlie the `<textInput>` component.
#[derive(Debug, ComponentState)]
pub struct TextInputState {
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

impl TextInputState {
    fn new() -> Self {
        TextInputState {
            value: ValueStateVarInterface::new().into(),
            immediate_value: ImmediateValueStateVarInterface::new().into(),
            sync_immediate_value: SyncImmediateValueStateVarInterface::new().into(),
            bind_value_to: GeneralStringStateVarInterface::new_from_attribute("bindValueTo").into(),
            prefill: GeneralStringStateVarInterface::new_from_attribute("prefill").into(),
            hidden: GeneralBooleanStateVarInterface::new_from_attribute("hidden").into(),
            disabled: GeneralBooleanStateVarInterface::new_from_attribute("disabled").into(),
        }
    }
}

impl Default for TextInputState {
    fn default() -> Self {
        TextInputState::new()
    }
}

impl RenderedChildren for TextInput {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        static EMPTY_VECTOR: Vec<ComponentPointerTextOrMacro> = vec![];
        &EMPTY_VECTOR
    }
}

impl ComponentAttributes for TextInput {
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        vec!["bindValueTo", "hide", "disabled", "prefill"]
    }
}

impl ComponentActions for TextInput {
    fn get_action_names(&self) -> Vec<String> {
        TextInputAction::VARIANTS
            .iter()
            .map(|s| s.to_string())
            .collect()
    }

    fn on_action(
        &self,
        action: ActionsEnum,
        resolve_and_retrieve_state_var: &mut dyn FnMut(StateVarIdx) -> StateVarValue,
    ) -> Result<Vec<UpdateFromAction>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: TextInputAction = action.try_into()?;

        match action {
            TextInputAction::UpdateImmediateValue(ActionBody { args }) => Ok(vec![
                TextInputState::update_immediate_value_from_action(args.text),
                TextInputState::update_sync_immediate_value_from_action(false),
            ]),

            TextInputAction::UpdateValue => {
                let new_val = resolve_and_retrieve_state_var(
                    TextInputState::get_immediate_value_state_variable_index(),
                );

                Ok(vec![TextInputState::update_value_from_action(
                    new_val.try_into().unwrap(),
                )])
            }
        }
    }
}

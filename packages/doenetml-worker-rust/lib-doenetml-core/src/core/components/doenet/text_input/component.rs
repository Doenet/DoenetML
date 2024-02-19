use serde::{Deserialize, Serialize};
use strum::VariantNames;
use strum_macros::EnumVariantNames;

use crate::{
    components::prelude::*,
    general_prop::{BooleanProp, StringProp},
};

use super::TextInputState;

#[derive(Debug, AttributeProp)]
pub enum TextInputAttribute {
    /// Whether the `<textInput>` should be hidden.
    #[attribute(prop = BooleanProp, default = false)]
    Hide,
    /// Whether the `<textInput>` should be editable.
    #[attribute(prop = BooleanProp, default = false)]
    Disabled,
    /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
    #[attribute(prop = StringProp, default = String::new())]
    Prefill,
}

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
#[derive(Debug, Default, ComponentNode, ComponentState, RenderedChildren)]
#[no_rendered_children]
#[component(ref_transmutes_to = "Text")]
pub struct TextInput {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The props that underlie the `<textInput>` component.
    pub state: TextInputState,
}

impl ComponentAttributes for TextInput {
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        TextInputAttribute::VARIANTS.into()
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
        resolve_and_retrieve_prop: &mut dyn FnMut(PropIdx) -> PropValue,
    ) -> Result<Vec<UpdateFromAction>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: TextInputAction = action.try_into()?;

        match action {
            TextInputAction::UpdateImmediateValue(ActionBody { args }) => {
                Ok(vec![TextInputState::update_immediate_value_from_action(
                    args.text,
                )])
            }

            TextInputAction::UpdateValue => {
                let new_val =
                    resolve_and_retrieve_prop(TextInputState::get_immediate_value_prop_index());

                Ok(vec![TextInputState::update_value_from_action(
                    new_val.try_into().unwrap(),
                )])
            }
        }
    }
}

use crate::components::prelude::*;
use crate::general_prop::{BooleanProp, IndependentProp, StringProp};
use crate::props::UpdaterObject;

#[component(name = TextInput, extend_via_default_prop, ref_transmutes_to="text")]
pub(super) mod component {

    use super::*;

    enum Props {
        /// The value of the `<text>`. This is the content that will be displayed inside
        /// the `<text>` component.
        ///
        /// The value of the `<textInput>` component.
        ///
        /// It is updated when a user presses Enter or blurs away from the input box.
        /// (See the `immediate_value` prop for the current value of the input box.)
        #[prop(
            value_type = PropValueType::String,
            is_public,
            profile = PropProfile::String,
            default,
        )]
        Value,

        /// The current value of the text inside the input box of the `<textInput>` component.
        ///
        /// It is updated every time a user presses a key so that should represent that actual text shown
        /// in the input box.
        #[prop(
            value_type = PropValueType::String,
            is_public,
            profile = PropProfile::String,
            for_render,
        )]
        ImmediateValue,

        /// If `true`, then `value` is synchronized to `immediate_value`.
        ///
        /// When a user is typing into a text input, it will be `false`,
        /// allowing `immediate_value` and `value` to diverge.
        ///
        /// When a user presses enter or the text input loses focus, it will be `true`,
        /// so that `immediate_value` and `value` will be synchronized.
        #[prop(value_type = PropValueType::Boolean)]
        SyncValueToImmediateValue,

        /// The string value computed from any children to the textInput.
        /// If the textInput has children, then this prop will not be marked `came_from_default`,
        /// and the `value` and `immediate_value` prop will use these children,
        /// rather than their preliminary value variable when calculating.
        #[prop(value_type = PropValueType::String)]
        ValueFromChildren,

        /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
        ///
        /// It is ignored if `value_from_children` is specified.
        #[prop(value_type = PropValueType::String)]
        Prefill,

        /// A variable that determines whether or not a text input should be sent to the renderer (i.e., appear in the render tree).
        ///
        /// If `hidden` is true, then don't send the text input to the renderer. (TODO: implement this)
        #[prop(value_type = PropValueType::Boolean, profile = PropProfile::Hidden)]
        Hidden,

        /// A variable that determines whether or not a text input can be interacted with.
        ///
        /// If `disabled`, then a user cannot interact with the text input,
        /// and the input box should display as disabled (e.g., grayed out)
        #[prop(value_type = PropValueType::Boolean)]
        Disabled,
    }

    enum Attributes {
        /// Whether the `<textInput>` should be hidden.
        #[attribute(prop = BooleanProp, default = false)]
        Hide,
        /// Whether the `<textInput>` should be disabled.
        #[attribute(prop = BooleanProp, default = false)]
        Disabled,
        /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
        #[attribute(prop = StringProp, default = String::new())]
        Prefill,
    }

    #[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
    #[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
    #[cfg_attr(feature = "web", tsify(from_wasm_abi))]
    #[serde(expecting = "`text` must be a string")]
    pub struct TextInputActionArgs {
        pub text: String,
    }

    enum Actions {
        UpdateImmediateValue(ActionBody<TextInputActionArgs>),
        UpdateValue,
    }
}

pub use component::TextInput;
pub use component::TextInputActionArgs;
pub use component::TextInputActions;
pub use component::TextInputAttributes;
pub use component::TextInputProps;
use component::attrs;
pub(super) use component::props;

use super::custom_props::{ImmediateValueProp, ValueProp};

impl PropGetUpdater for TextInputProps {
    fn get_updater(&self) -> UpdaterObject {
        match self {
            TextInputProps::Value => as_updater_object::<_, props::types::Value>(ValueProp::new()),
            TextInputProps::ImmediateValue => {
                as_updater_object::<_, props::types::ImmediateValue>(ImmediateValueProp::new())
            }
            TextInputProps::SyncValueToImmediateValue => as_updater_object::<
                _,
                props::types::SyncValueToImmediateValue,
            >(IndependentProp::new(true)),

            TextInputProps::ValueFromChildren => {
                as_updater_object::<_, props::types::ValueFromChildren>(
                    StringProp::new_from_children("").dont_propagate_came_from_default(),
                )
            }
            TextInputProps::Prefill => {
                as_updater_object::<_, props::types::Prefill>(attrs::Prefill::get_prop_updater())
            }
            TextInputProps::Hidden => {
                as_updater_object::<_, props::types::Hidden>(attrs::Hide::get_prop_updater())
            }
            TextInputProps::Disabled => {
                as_updater_object::<_, props::types::Disabled>(attrs::Disabled::get_prop_updater())
            }
        }
    }
}

impl ComponentOnAction for TextInput {
    fn on_action(
        &self,
        action: ActionsEnum,
        query_prop: ActionQueryProp,
    ) -> Result<Vec<UpdateFromAction>, String> {
        // The type of `action` should have already been verified, so an
        // error here is a programming logic error, not an API error.
        let action: TextInputActions = action.try_into()?;

        match action {
            TextInputActions::UpdateImmediateValue(ActionBody { args }) => {
                Ok(vec![UpdateFromAction {
                    local_prop_idx: TextInputProps::ImmediateValue.local_idx(),
                    requested_value: args.text.into(),
                }])
            }

            TextInputActions::UpdateValue => {
                let new_val = query_prop.get_local_prop(TextInputProps::ImmediateValue.local_idx());

                Ok(vec![UpdateFromAction {
                    local_prop_idx: TextInputProps::Value.local_idx(),
                    requested_value: new_val.value,
                }])
            }
        }
    }
}

mod immediate_value;
mod value;

pub use immediate_value::ImmediateValueProp;
pub use value::ValueProp;

use crate::{
    components::prelude::*,
    general_prop::{IndependentProp, StringProp},
};

use super::TextInputAttribute;

/// The props that underlie the `<textInput>` component.
#[derive(Debug, ComponentProps)]
pub struct TextInputProps {
    /// The value of the `<textInput>` component.
    ///
    /// It is updated when a user presses Enter or blurs away from the input box.
    /// (See the `immediate_value` prop for the current value of the input box.)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked as a component profile prop,
    /// which means this prop will be used if a parent of a `<textInput>` component
    /// queries for children with the `Text` component profile.
    ///
    /// It is marked `default_prop`, which in combination with the component being marked `extend_via_default_prop`,
    /// means the `value` prop will be used if a `<textInput>` is extended to another component type.
    #[is_public]
    #[component_profile_prop]
    #[default_prop]
    value: Prop<String>,

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
    immediate_value: Prop<String>,

    /// If `true`, then `value` is synchronized to `immediate_value`.
    ///
    /// When a user is typing into a text input, it will be `false`,
    /// allowing `immediate_value` and `value` to diverge.
    ///
    /// When a user presses enter or the text input loses focus, it will be `true`,
    /// so that `immediate_value` and `value` will be synchronized.
    sync_value_to_immediate_value: Prop<bool>,

    /// The string value computed from any children to the textInput.
    /// If the textInput has children, then this prop will not be marked `came_from_default`,
    /// and the `value` and `immediate_value` prop will use these children,
    /// rather than their preliminary value variable when calculating.
    value_from_children: Prop<String>,

    /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
    ///
    /// It is ignored if `value_from_children` is specified.
    #[is_public]
    prefill: Prop<String>,

    /// A variable that determines whether or not a text input should be sent to the renderer (i.e., appear in the render tree).
    ///
    /// If `hidden` is true, then don't send the text input to the renderer. (TODO: implement this)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.hidden`.
    #[is_public]
    hidden: Prop<bool>,

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
    disabled: Prop<bool>,
}

impl TextInputProps {
    fn new() -> Self {
        TextInputProps {
            value: ValueProp::new().into_prop(),
            immediate_value: ImmediateValueProp::new().into_prop(),
            sync_value_to_immediate_value: IndependentProp::new(true).into_prop(),

            // Note: need to pass false for propagate_change_from_default (second argument)
            // so that came_from_default will be false if the text input has any children
            // (even if it just has one child whose came_from_default is true)
            value_from_children: StringProp::new_from_children("".to_string())
                .dont_propagate_came_from_default()
                .into_prop(),

            prefill: TextInputAttribute::Prefill.prop(),
            hidden: TextInputAttribute::Hide.prop(),
            disabled: TextInputAttribute::Disabled.prop(),
        }
    }
}

impl Default for TextInputProps {
    fn default() -> Self {
        TextInputProps::new()
    }
}

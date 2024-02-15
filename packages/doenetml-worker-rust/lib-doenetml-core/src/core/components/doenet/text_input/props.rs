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
#[derive(Debug, ComponentState)]
pub struct TextInputState {
    /// The value of the `<textInput>` component.
    ///
    /// It is updated when a user presses Enter or blurs away from the input box.
    /// (See the `immediate_value` prop for the current value of the input box.)
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    ///
    /// It is marked as a component profile prop,
    /// which means this prop will be used if a parent of a `<textInput>` component
    /// queries for children with the `Text` component profile.
    #[is_public]
    #[component_profile_prop]
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

    // TODO: there are subtleties for why needed `sync_immediate_value` to get the proper behavior of `<textInput>`.
    // Will figure these out again as write a test for making sure it works correctly.
    // Also, it's behavior may change if we replace `value_from_children` with children.
    sync_immediate_value: Prop<bool>,

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

impl TextInputState {
    fn new() -> Self {
        TextInputState {
            value: ValueProp::new().into_prop(),
            immediate_value: ImmediateValueProp::new().into_prop(),
            sync_immediate_value: IndependentProp::new(true).into_prop(),
            value_from_children: StringProp::new_from_children("".to_string()).into_prop(),
            prefill: TextInputAttribute::Prefill.prop(),
            hidden: TextInputAttribute::Hide.prop(),
            disabled: TextInputAttribute::Disabled.prop(),
        }
    }
}

impl Default for TextInputState {
    fn default() -> Self {
        TextInputState::new()
    }
}

mod immediate_value;
mod value;

pub use immediate_value::ImmediateValueStateVar;
pub use value::ValueStateVar;

use crate::{
    components::prelude::*,
    general_state_var::{BooleanStateVar, IndependentStateVar, StringStateVar},
};

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
    ///
    /// It is marked as a component profile state variable,
    /// which means this state variable will be used if a parent of a `<textInput>` component
    /// queries for children with the `Text` component profile.
    #[is_public]
    #[component_profile_state_variable]
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
    // Also, it's behavior may change if we replace `value_from_children` with children.
    sync_immediate_value: StateVar<bool>,

    /// The string value computed from any children to the textInput.
    /// If the textInput has children, then this state variable will not be marked `came_from_default`,
    /// and the `value` and `immediate_value` state variable will use these children,
    /// rather than their preliminary value variable when calculating.
    value_from_children: StateVar<String>,

    /// The content that should prefill the `<textInput>`, giving it a default value before a user has interacted with the input.
    ///
    /// It is ignored if `value_from_children` is specified.
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
            value: ValueStateVar::new().into_state_var(),
            immediate_value: ImmediateValueStateVar::new().into_state_var(),
            sync_immediate_value: IndependentStateVar::new(true).into_state_var(),
            value_from_children: StringStateVar::new_from_children("".to_string()).into_state_var(),
            prefill: StringStateVar::new_from_attribute("prefill", "".to_string()).into_state_var(),
            hidden: BooleanStateVar::new_from_attribute("hidden", false).into_state_var(),
            disabled: BooleanStateVar::new_from_attribute("disabled", false).into_state_var(),
        }
    }
}

impl Default for TextInputState {
    fn default() -> Self {
        TextInputState::new()
    }
}

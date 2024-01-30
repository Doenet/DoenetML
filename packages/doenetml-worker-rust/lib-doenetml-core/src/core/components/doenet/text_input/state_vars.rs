mod immediate_value;
mod sync_immediate_value;
mod value;

pub use immediate_value::*;
pub use sync_immediate_value::*;
pub use value::*;

use crate::{
    components::prelude::*,
    general_state_var::{BooleanStateVar, StringStateVar},
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
            value: ValueStateVar::new().into(),
            immediate_value: ImmediateValueStateVar::new().into(),
            sync_immediate_value: SyncImmediateValueStateVar::new().into(),
            bind_value_to: StringStateVar::new_from_attribute("bindValueTo").into(),
            prefill: StringStateVar::new_from_attribute("prefill").into(),
            hidden: BooleanStateVar::new_from_attribute("hidden").into(),
            disabled: BooleanStateVar::new_from_attribute("disabled").into(),
        }
    }
}

impl Default for TextInputState {
    fn default() -> Self {
        TextInputState::new()
    }
}

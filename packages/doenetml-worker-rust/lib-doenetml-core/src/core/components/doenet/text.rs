use std::collections::HashMap;

use crate::components::prelude::*;
use crate::general_state_var::StringStateVar;

/// Definition of the `<text>` DoenetML component
#[derive(Debug, Default, ComponentNode, ComponentState, ComponentActions, ComponentAttributes)]
pub struct Text {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<text>` component.
    pub state: TextState,
}

impl Text {
    /// If a Text component extends a state variable of type text,
    /// then its value state variable should shadow that variable.
    ///
    /// Returns: a tuple of (component type, state variable index)
    pub fn get_state_variable_that_shadows_when_extending() -> (&'static str, StateVarIdx) {
        (
            Text::get_component_type(),
            TextState::get_value_state_variable_index(),
        )
    }
}

/// The state variables that underlie the `<text>` component.
#[derive(Debug, ComponentState)]
pub struct TextState {
    /// The value of the `<text>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<text>` component.
    ///
    /// It is marked with the `Text` component profile state variable, indicating that the `<text>` component
    /// can represent a text value by returning the value of this state variable.
    #[is_public]
    #[for_renderer]
    #[component_profile_state_variable(Text)]
    value: StateVar<String>,

    /// An alias to the `value` state variable.
    ///
    /// It is marked public so that it can be referenced in DoenetML via `.text`.
    #[is_public]
    text: StateVar<String>,
}

impl TextState {
    fn new() -> Self {
        TextState {
            value: StringStateVar::new_from_children().into(),
            text: StringStateVar::new(TextState::get_value_data_queries()).into(),
        }
    }
}

impl Default for TextState {
    fn default() -> Self {
        TextState::new()
    }
}

impl RenderedChildren for Text {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        static EMPTY_VECTOR: Vec<ComponentPointerTextOrMacro> = vec![];
        &EMPTY_VECTOR
    }
}

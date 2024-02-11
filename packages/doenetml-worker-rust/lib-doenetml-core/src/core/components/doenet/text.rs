use std::collections::HashMap;

use crate::components::prelude::*;
use crate::general_state_var::{StateVarAlias, StringStateVar};

/// Definition of the `<text>` DoenetML component
#[derive(
    Debug,
    Default,
    ComponentNode,
    ComponentState,
    ComponentActions,
    ComponentAttributes,
    RenderedChildren,
)]
#[no_rendered_children]
#[component(when_extending(match_profile = "String", store_in = "value"))]
pub struct Text {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<text>` component.
    pub state: TextState,
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
    /// It is marked as a component profile state variable,
    /// which means this state variable will be used if a parent of a `<text>` component
    /// queries for children with the `Text` component profile.
    #[is_public]
    #[for_renderer]
    #[component_profile_state_variable]
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
            value: StringStateVar::new_from_children("".to_string()).into_state_var(),
            text: StateVarAlias::new(TextState::get_value_state_variable_index()).into_state_var(),
        }
    }
}

impl Default for TextState {
    fn default() -> Self {
        TextState::new()
    }
}

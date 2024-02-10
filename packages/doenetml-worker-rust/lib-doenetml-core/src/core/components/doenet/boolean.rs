use crate::components::prelude::*;
use crate::general_state_var::{BooleanStateVar, BooleanToStringStateVar, StateVarAlias};

/// Definition of the `<boolean>` DoenetML component
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
pub struct Boolean {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<boolean>` component.
    pub state: BooleanState,
}

impl Boolean {
    /// If a Boolean component extends a state variable of type boolean,
    /// then its value state variable should shadow that variable.
    ///
    /// Returns: a tuple of (component type, state variable index)
    pub fn get_state_variable_that_shadows_when_extending() -> (&'static str, StateVarIdx) {
        (
            Boolean::get_component_type(),
            BooleanState::get_value_state_variable_index(),
        )
    }
}

/// The state variables that underlie the `<boolean>` component.
#[derive(Debug, ComponentState)]
pub struct BooleanState {
    /// The value of the `<boolean>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<boolean>` component.
    ///
    /// It is marked as a component profile state variable,
    /// which means this state variable will be used if a parent of a `<boolean>` component
    /// queries for children with the `Boolean` component profile.
    #[is_public]
    #[for_renderer]
    #[component_profile_state_variable]
    value: StateVar<bool>,

    /// An alias to the `value` state variable.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.boolean`.
    #[is_public]
    boolean: StateVar<bool>,

    /// A conversion of the boolean value into a string.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.text`.
    ///
    /// It is marked as a component profile state variable,
    /// which means this state variable will be used if a parent of a `<boolean>` component
    /// queries for children with the `Text` component profile.
    #[is_public]
    #[component_profile_state_variable]
    text: StateVar<String>,
}

impl BooleanState {
    fn new() -> Self {
        BooleanState {
            value: BooleanStateVar::new_from_children(false).into_state_var(),
            boolean: StateVarAlias::new(BooleanState::get_value_state_variable_index())
                .into_state_var(),
            text: BooleanToStringStateVar::new(BooleanState::get_value_state_variable_index())
                .into_state_var(),
        }
    }
}

impl Default for BooleanState {
    fn default() -> Self {
        BooleanState::new()
    }
}

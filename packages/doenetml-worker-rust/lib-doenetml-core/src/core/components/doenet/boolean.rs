use crate::components::prelude::*;
use crate::state_var_interfaces::boolean_state_var_interfaces::{
    GeneralBooleanStateVarInterface, SingleDependencyBooleanStateVarInterface,
};

/// Definition of the `<boolean>` DoenetML component
#[derive(Debug, Default, ComponentNode, ComponentState, ComponentActions, ComponentAttributes)]
pub struct Boolean {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<boolean>` component.
    pub state: BooleanState,

    /// An empty vector that will be returned with `get_rendered_children`
    /// indicating this component has no children that are rendered.
    ///
    /// (Created because `get_rendered_children` must return a reference to a vector,)
    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,
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
    /// It is marked with the `Boolean` component profile state variable, indicating that the `<boolean>` component
    /// can represent a boolean value by returning the value of this state variable.
    #[is_public]
    #[for_renderer]
    #[component_profile_state_variable(Boolean)]
    value: StateVar<bool>,

    /// An alias to the `value` state variable.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.boolean`.
    #[is_public]
    boolean: StateVar<bool>,
}

impl BooleanState {
    fn new() -> Self {
        BooleanState {
            value: GeneralBooleanStateVarInterface::new_from_children().into(),
            boolean: SingleDependencyBooleanStateVarInterface::new(
                BooleanState::get_value_dependency_instructions(),
            )
            .into(),
        }
    }
}

impl Default for BooleanState {
    fn default() -> Self {
        BooleanState::new()
    }
}

impl RenderedChildren for Boolean {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.no_rendered_children
    }
}

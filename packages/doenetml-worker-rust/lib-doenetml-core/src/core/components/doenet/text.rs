use std::collections::HashMap;

use crate::components::prelude::*;
use crate::state_var_interfaces::text_state_var_interfaces::{
    GeneralStringStateVarInterface, SingleDependencyStringStateVarInterface,
};

/// Definition of the `<text>` DoenetML component
#[derive(Debug, Default, ComponentNode, ComponentStateVariables)]
pub struct Text {
    /// The common component data needed to derive the `ComponentNode` trait
    pub common: ComponentCommonData,

    /// The state variables that underlie the `<text>` component.
    pub state: TextStateVariables,

    /// An empty vector that will be returned with `get_rendered_children`
    /// indicating this component has no children that are rendered.
    ///
    /// (Created because `get_rendered_children` must return a reference to a vector,)
    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,
}

impl Text {
    /// If a Text component extends a state variable of type text,
    /// then its value state variable should shadow that variable.
    ///
    /// Returns: a tuple of (component type, state variable index)
    pub fn get_state_variable_that_shadows_when_extending() -> (&'static str, StateVarIdx) {
        (
            Text::get_component_type(),
            TextStateVariables::get_value_state_variable_index(),
        )
    }
}

/// The state variables that underlie the `<text>` component.
#[derive(Debug, ComponentStateVariables)]
pub struct TextStateVariables {
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

impl TextStateVariables {
    fn new() -> Self {
        TextStateVariables {
            value: StateVar::new(
                Box::new(GeneralStringStateVarInterface::new(
                    DependencyInstruction::Child {
                        match_profiles: vec![ComponentProfile::Text],
                        exclude_if_prefer_profiles: vec![],
                    },
                )),
                Default::default(),
            ),
            text: StateVar::new(
                Box::new(SingleDependencyStringStateVarInterface::new(
                    TextStateVariables::get_value_dependency_instructions(),
                )),
                Default::default(),
            ),
        }
    }
}

impl Default for TextStateVariables {
    fn default() -> Self {
        TextStateVariables::new()
    }
}

impl RenderedComponentNode for Text {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.no_rendered_children
    }
}

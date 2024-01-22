use std::collections::HashMap;

use crate::components::prelude::*;
use crate::state_var_interfaces::text_state_var_interfaces::{
    GeneralStringStateVarInterface, SingleDependencyStringStateVarInterface,
};

#[derive(Debug, Default, ComponentNode, ComponentStateVariables)]
pub struct Text {
    pub common: ComponentCommonData,

    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,

    pub state: TextStateVariables,
}

#[derive(Debug, ComponentStateVariables)]
pub struct TextStateVariables {
    #[is_public]
    #[for_renderer]
    #[component_profile_state_variables(Text)]
    value: StateVar<String>,

    #[is_public]
    #[for_renderer]
    text: StateVar<String>,
}

impl TextStateVariables {
    fn new() -> Self {
        TextStateVariables {
            value: StateVar::new(
                Box::<GeneralStringStateVarInterface>::default(),
                StateVarParameters {
                    dependency_instruction_hint: Some(DependencyInstruction::Child {
                        match_profiles: vec![ComponentProfile::Text],
                        exclude_if_prefer_profiles: vec![],
                    }),
                    should_create_dependency_from_extend_source: true,
                    is_primary_state_variable_for_shadowing_extend_source: true,
                },
                Default::default(),
            ),
            text: StateVar::new(
                Box::<SingleDependencyStringStateVarInterface>::default(),
                StateVarParameters {
                    dependency_instruction_hint: Some(
                        TextStateVariables::get_value_dependency_instructions(),
                    ),
                    ..Default::default()
                },
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

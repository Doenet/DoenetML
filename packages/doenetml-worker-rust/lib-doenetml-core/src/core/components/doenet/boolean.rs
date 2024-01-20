use crate::components::prelude::*;
use crate::state_var_interfaces::boolean_state_var_interfaces::{
    GeneralBooleanStateVarInterface, SingleDependencyBooleanStateVarInterface,
};

#[derive(Debug, Default, ComponentNode, ComponentStateVariables)]
pub struct Boolean {
    pub common: ComponentCommonData,

    pub state: BooleanStateVariables,

    pub no_rendered_children: Vec<ComponentPointerTextOrMacro>,
}

#[derive(Debug, ComponentStateVariables)]
pub struct BooleanStateVariables {
    value: StateVar<bool>,
    boolean: StateVar<bool>,
}

impl BooleanStateVariables {
    fn new() -> Self {
        BooleanStateVariables {
            value: StateVar::new(
                Box::<GeneralBooleanStateVarInterface>::default(),
                StateVarParameters {
                    dependency_instruction_hint: Some(DependencyInstruction::Child {
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                        exclude_if_prefer_profiles: vec![],
                    }),
                    create_dependency_from_extend_source: true,
                    is_primary_state_variable_for_shadowing_extend_source: true,
                },
                Default::default(),
            ),
            boolean: StateVar::new(
                Box::<SingleDependencyBooleanStateVarInterface>::default(),
                StateVarParameters {
                    dependency_instruction_hint: Some(
                        BooleanStateVariables::get_value_dependency_instructions(),
                    ),
                    ..Default::default()
                },
                Default::default(),
            ),
        }
    }
}

impl Default for BooleanStateVariables {
    fn default() -> Self {
        BooleanStateVariables::new()
    }
}

impl RenderedComponentNode for Boolean {
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.no_rendered_children
    }
}

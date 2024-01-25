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
    #[is_public]
    #[for_renderer]
    #[component_profile_state_variables(Boolean)]
    value: StateVar<bool>,

    #[is_public]
    boolean: StateVar<bool>,
}

impl BooleanStateVariables {
    fn new() -> Self {
        BooleanStateVariables {
            value: StateVar::new(
                Box::new(
                    GeneralBooleanStateVarInterface::new(DependencyInstruction::Child {
                        match_profiles: vec![ComponentProfile::Text, ComponentProfile::Boolean],
                        exclude_if_prefer_profiles: vec![],
                    })
                    .is_primary_state_variable(),
                ),
                Default::default(),
            ),
            boolean: StateVar::new(
                Box::new(SingleDependencyBooleanStateVarInterface::new(
                    BooleanStateVariables::get_value_dependency_instructions(),
                )),
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

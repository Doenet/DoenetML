use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ComponentProfile;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Boolean(StateVarDefinition {

            return_dependency_instructions: |_| {
                let child_instruct = DependencyInstruction::Child {
                    desired_profiles: vec![ComponentProfile::Boolean, ComponentProfile::Text],
                };

                HashMap::from([("all_my_children", child_instruct)])
            },

            determine_state_var_from_dependencies: |dependency_values| {
                let children = dependency_values.get("all_my_children").unwrap();
                DETERMINE_BOOLEAN(children.clone()).map(|x| SetValue(x))
            },
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("text", TEXT_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hide",
        ],

        primary_input_state_var: Some("value"),

        component_profiles: vec![
            (ComponentProfile::Boolean, "value"),
            // (ComponentProfile::Text, "value"),
        ],
                
        ..Default::default()
    };
}

use std::collections::HashMap;

use super::*;
use crate::state_variables::*;
use crate::base_definitions::*;


use crate::ComponentProfile;

use lazy_static::lazy_static;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value",StateVarVariant::String(StateVarDefinition {

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::Child {
                    desired_profiles: vec![ComponentProfile::Text],
                    parse_into_expression: false,
                };
            
                HashMap::from([("children_value_svs", instruction)])
            },

            determine_state_var_from_dependencies: |dependency_values| {
                let textlike_children = dependency_values.get("children_value_svs").unwrap();
                DETERMINE_STRING(textlike_children.clone()).map(|x| SetValue(x))
            },

            ..Default::default()
        }));


        state_var_definitions.insert("text", TEXT_DEFAULT_DEFINITION());

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        state_var_definitions.insert("fixed", FIXED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hide",
            "disabled",
            "fixed",
        ],

        primary_input_state_var: Some("value"),

        component_profiles: vec![
            (ComponentProfile::Text, "value")
        ],
        
        ..Default::default()
    };
}

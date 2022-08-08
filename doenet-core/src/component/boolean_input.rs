use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value", StateVarVariant::Boolean(StateVarDefinition {
        
            return_dependency_instructions: USE_ESSENTIAL_DEPENDENCY_INSTRUCTION,
            determine_state_var_from_dependencies: DETERMINE_FROM_ESSENTIAL,
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,

            for_renderer: true,

            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

        attribute_definitions
    };
}


lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        attribute_definitions: &MY_ATTRIBUTE_DEFINITIONS,

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        primary_input_state_var: Some("value"),

        get_trait_names: || vec![ObjectTraitName::TextLike],

        action_names: || vec!["updateBoolean"],

        on_action: |action_name, args, _| {
            match action_name {
                "updateBoolean" => {

                    let new_val = args.get("boolean").expect("No boolean argument");

                    HashMap::from([(
                        StateVarReference::Basic("value"),
                        new_val.clone()
                    )])
                }

                _ => panic!("Unknown action '{}' called on booleanInput", action_name)
            }
        },

        ..Default::default()
    };
}

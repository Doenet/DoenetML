use std::collections::HashMap;

use super::*;
use crate::base_definitions::*;


use lazy_static::lazy_static;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "p",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hide",
            "disabled",
        ],

        should_render_children: true,
        
        action_names: || vec!["recordVisibilityChange"],

        valid_children_profiles: ValidChildTypes::AllComponents,
        
        ..Default::default()
    };
}

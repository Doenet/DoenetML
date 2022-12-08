use std::collections::HashMap;

use super::*;
use crate::base_definitions::*;


use lazy_static::lazy_static;


lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        let mut state_var_definitions = HashMap::new();
        state_var_definitions.insert("condition", boolean_definition_from_attribute!("condition", true));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        return state_var_definitions
    };
}


lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "case",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "condition",
            "hide",
            "disabled",
        ],

        renderer_type: RendererType::Special { component_type: "containerInline", state_var_aliases: HashMap::new() },

        should_render_children: true,

        replacement_components: Some(ReplacementComponents::Children),

        valid_children_profiles: ValidChildTypes::AllComponents,
        
        ..Default::default()
    };
}

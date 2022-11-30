use std::collections::HashMap;

use super::*;
use crate::state_variables::*;
use crate::base_definitions::*;


use lazy_static::lazy_static;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        let mut state_var_definitions = HashMap::new();
        state_var_definitions.insert("submitLabel", StateVarVariant::String(Default::default()));
        state_var_definitions.insert("submitLabelNoCorrectness", StateVarVariant::String(Default::default()));
        state_var_definitions.insert("boxed", StateVarVariant::Boolean(Default::default()));
        state_var_definitions.insert("titleChildName", StateVarVariant::String(Default::default()));
        state_var_definitions.insert("titlePrefix", StateVarVariant::String(Default::default()));
        state_var_definitions.insert("title", StateVarVariant::String(Default::default()));
        state_var_definitions.insert("containerTag", StateVarVariant::String(StateVarDefinition{
            determine_state_var_from_dependencies:
                |_| Ok(StateVarUpdateInstruction::SetValue("section".to_string())),
            ..Default::default()
        }));
        state_var_definitions.insert("level", StateVarVariant::Integer(Default::default()));
        state_var_definitions.insert("justSubmitted", StateVarVariant::Boolean(Default::default()));
        state_var_definitions.insert("showCorrectness", StateVarVariant::Boolean(Default::default()));
        state_var_definitions.insert("creditAchieved", StateVarVariant::Integer(Default::default()));
        state_var_definitions.insert("collapsible", StateVarVariant::Boolean(Default::default()));
        state_var_definitions.insert("open", StateVarVariant::Boolean(StateVarDefinition{
            determine_state_var_from_dependencies:
                |_| Ok(StateVarUpdateInstruction::SetValue(true)),
            ..Default::default()
        }));
        state_var_definitions.insert("suppressAnswerSubmitButtons", StateVarVariant::Boolean(Default::default()));
        state_var_definitions.insert("createSubmitAllButton", StateVarVariant::Boolean(Default::default()));
        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "template",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hide",
            "disabled",
        ],

        renderer_type: RendererType::Special { component_type: "section", state_var_aliases: HashMap::new() },

        should_render_children: true,

        action_names: || vec!["recordVisibilityChange"],

        valid_children_profiles: ValidChildTypes::AllComponents,
        
        ..Default::default()
    };
}

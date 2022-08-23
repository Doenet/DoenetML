use std::collections::HashMap;

use super::*;
use crate::state_variables::*;
use crate::base_definitions::*;


use lazy_static::lazy_static;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("submitLabel", string_definition_from_attribute!("submitLabel", ""));
        state_var_definitions.insert("submitLabelNoCorrectness", string_definition_from_attribute!("submitLabelNoCorrectness", ""));
        state_var_definitions.insert("boxed", boolean_definition_from_attribute!("boxed", false));

        state_var_definitions.insert("titleChildName", StateVarVariant::String(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("titlePrefix", StateVarVariant::String(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("title", StateVarVariant::String(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("containerTag", StateVarVariant::String(StateVarDefinition{
            determine_state_var_from_dependencies: |_| Ok(SetValue("section".to_string())),
            ..Default::default()
        }));

        state_var_definitions.insert("level", StateVarVariant::Integer(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("justSubmitted", StateVarVariant::Boolean(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("showCorrectness", StateVarVariant::Boolean(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("creditAchieved", StateVarVariant::Integer(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("collapsible", StateVarVariant::Boolean(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("open", StateVarVariant::Boolean(StateVarDefinition{
            return_dependency_instructions: USE_ESSENTIAL_DEPENDENCY_INSTRUCTION,
            determine_state_var_from_dependencies: DETERMINE_FROM_ESSENTIAL,
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            initial_essential_value: true,
            ..Default::default()
        }));

        state_var_definitions.insert("suppressAnswerSubmitButtons", StateVarVariant::Boolean(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("createSubmitAllButton", StateVarVariant::Boolean(StateVarDefinition{
            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "submitLabel",
            "submitLabelNoCorrectness",
            "boxed",

            "hide",
            "disabled",
        ],

        should_render_children: true,
        
        action_names: || vec!["recordVisibilityChange"],
        
        ..Default::default()
    };
}

use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::state_variables::*;
use crate::base_definitions::*;

use super::*;



lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("submitLabel", StateVarVariant::String(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue("Check Work".to_string())),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("submitLabelNoCorrectness", StateVarVariant::String(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue("Submit Response".to_string())),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("hidden", StateVarVariant::Boolean(Default::default()));

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        state_var_definitions.insert("fixed", FIXED_DEFAULT_DEFINITION());

        // state_var_definitions.insert("titleChildName", StateVarVariant::String(StateVarDefinition {
        //     determine_state_var_from_dependencies: |_| Ok(SetValue("Submit Response")),
        //     for_renderer: true,
        //     ..Default::default()
        // })); 

        
        state_var_definitions.insert("title", StateVarVariant::String(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue("".to_string())),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("level", StateVarVariant::Number(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue(0.0)),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("justSubmitted", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue(true)),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("showCorrectness", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue(true)),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("creditAchieved", StateVarVariant::Number(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue(1.0)),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("createSubmitAllButton", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue(false)),
            for_renderer: true,
            ..Default::default()
        }));


        state_var_definitions.insert("suppressAnswerSubmitButtons", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| Ok(SetValue(false)),
            for_renderer: true,
            ..Default::default()
        }));        

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![],

        should_render_children: true,

        ..Default::default()
    };
}

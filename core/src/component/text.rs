use std::collections::HashMap;



use crate::prelude::*;
use super::*;
use crate::state_variables::*;

use crate::ObjectTraitName;

use lazy_static::lazy_static;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;
        use DependencyInstruction::*;

        let mut state_var_definitions = HashMap::new();


        state_var_definitions.insert("value",StateVarVariant::String(StateVarDefinition {

            return_dependency_instructions: |_| {
                let instruction = Child(ChildDependencyInstruction {                    
                    desired_children: vec![ObjectTraitName::TextLike],
                    desired_state_vars: vec!["value"],
                });
            
                HashMap::from([("children_value_svs", instruction)])
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let textlike_children_values = dependency_values.get("children_value_svs").unwrap();
            
                let mut val = String::new();
                for textlike_value_sv in textlike_children_values {
                    
                    val.push_str(& match &textlike_value_sv.value {
                        StateVarValue::String(v) => v.to_string(),
                        StateVarValue::Boolean(v) => v.to_string(),
                        StateVarValue::Integer(v) => v.to_string(),
                        StateVarValue::Number(v) => v.to_string(),
                    });
                }
            
                Ok(SetValue(val))
            },

            ..Default::default()
        }));


        state_var_definitions.insert("text", TEXT_DEFAULT_DEFINITION());

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        // state_var_definitions.insert("hide", StateVarVariant::Boolean(StateVarDefinition {
        //     ..Default::default()
        // }));



        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        state_var_definitions.insert("fixed", FIXED_DEFAULT_DEFINITION());



        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("disabled", AttributeDefinition::Component("boolean"));


        attribute_definitions
    };
}



#[derive(Clone)]
pub struct MyComponentDefinition;

impl ComponentDefinition for MyComponentDefinition {
    fn attribute_definitions(&self) -> &'static HashMap<AttributeName, AttributeDefinition> {
        &MY_ATTRIBUTE_DEFINITIONS
    }

    fn state_var_definitions(&self) -> &'static HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS
    }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

    fn should_render_children(&self) -> bool {
        false
    }

    fn primary_input_state_var(&self) -> Option<StateVarName> {
        Some("value")
    }

}


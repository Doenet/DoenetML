use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
                    desired_children: vec![ObjectTraitName::NumberLike],
                    desired_state_vars: vec!["value"],
                });
            
                HashMap::from([("children", instruction)]) 
            },


            determine_state_var_from_dependencies: |dependency_values| {

                let number_child_value: Option<f64> = dependency_values.dep_value("children")?
                    .filter_include_component_type("number")
                    .has_zero_or_one_elements()?
                    .into_if_exists()?;

                if let Some(number_val) = number_child_value {

                    Ok(SetValue(number_val))


                } else {

                    let value = dependency_values.dep_value("children")?
                        .has_exactly_one_element()?
                        .into_string()?;

                    let num_val = value.parse::<f64>().unwrap_or(0.0);

                    Ok(SetValue(num_val))
                }
            },

            ..Default::default()
        }));

        state_var_definitions.insert("text", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
                    component_name: None,
                    state_var: StateVarReference::Basic("value"),
                });
            
                HashMap::from([("value_sv", instruction)]) 
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let value = dependency_values.dep_value("value_sv")?
                    .has_exactly_one_element()?
                    .into_number()?;

                Ok(SetValue(value.to_string()))

            },

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
        vec![ObjectTraitName::TextLike, ObjectTraitName::NumberLike]
    }

    fn should_render_children(&self) -> bool {
        false
    }

    fn primary_input_state_var(&self) -> Option<StateVarName> {
        Some("value")
    }

}

use std::collections::HashMap;

use lazy_static::lazy_static;
use evalexpr;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ComponentProfile;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::Child {
                    desired_profiles: vec![ComponentProfile::Number, ComponentProfile::Text],
                    // desired_children: vec![PrimaryOutputTrait::NumberLike],
                    // desired_state_vars: vec!["value"],
                };
            
                HashMap::from([("children", instruction)]) 
            },


            determine_state_var_from_dependencies: |dependency_values| {

                let (children, _) = dependency_values.dep_value("children")?;

                let mut concatted_children = String::new();
                for child in children {
                    let str_child_val = match &child.value {
                        StateVarValue::Number(num) => num.to_string(),
                        StateVarValue::String(str) => str.to_string(),
                        _ => return Err("Invalid children value for number".to_string())
                    };

                    concatted_children.push_str(&str_child_val);
                }

                // log!("concatted children {}", concatted_children);

                let num = if let Ok(num_result) = evalexpr::eval(&concatted_children) {
                    num_result.as_number().unwrap_or(f64::NAN)
                } else {
                    return Err("Can't parse number children as math".to_string())
                };


                Ok(SetValue(num))
            },

            ..Default::default()
        }));

        state_var_definitions.insert("text", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::StateVar {
                    component_name: None,
                    state_var: StateVarGroup::Single(StateVarReference::Basic("value")),
                };
            
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

lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        attribute_definitions: &MY_ATTRIBUTE_DEFINITIONS,

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        primary_input_state_var: Some("value"),

        component_profiles: vec![
            (ComponentProfile::Number, "value"),
            (ComponentProfile::Text, "value"),
        ],
                
        ..Default::default()
    };
}

use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::{ObjectTraitName};

use crate::state_var::{StateVar, EssentialStateVar};

use crate::log;


#[derive(Debug, Default, Clone)]
struct MyAttributeData {

    // These types could be more specific
    hide: Option<Attribute>,
    disabled: Option<Attribute>,
}


impl AttributeData for MyAttributeData {
    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String> {
        match name {
            "hide" => {
                self.hide = Some(attribute);
            },
            "disabled" => {
                self.disabled = Some(attribute);
            },

            _ => {
                return Err("Invalid attribute name".to_string())
            }
        }
        Ok(())
    }

    fn get(&self, name: AttributeName) -> &Option<Attribute> {
        match name {
            "hide" => &self.hide,
            "disabled" => &self.disabled,
            _ => panic!("Invalid attribute name {} for text", name)
        }
    }
}




#[derive(Debug)]
struct MyStateVars {
    value: StateVar,
    hidden: StateVar,
    disabled: StateVar,
    text: StateVar,

    essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

}


impl ComponentStateVars for MyStateVars {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String> {
        match state_var_name {
            "value" => Ok(&self.value),
            "hidden" => Ok(&self.hidden),
            "disabled" => Ok(&self.disabled),
            "text" => Ok(&self.text),

            _ => Err(format!("Number does not have state var {}", state_var_name))
        }
    }


    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
        &self.essential_state_vars
    }
}



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
                log!("number dependency value {:#?}", dependency_values);

                let value = dependency_values.dep_value("children")
                    .has_exactly_one_element()
                    .is_string();
            
                let num_val = value.parse::<f64>().unwrap_or(0.0);

                SetValue(num_val)
            },

            ..Default::default()
        }));

        state_var_definitions.insert("text", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
                    component_name: None,
                    state_var: "value",
                });
            
                HashMap::from([("value_sv", instruction)]) 
            },

            determine_state_var_from_dependencies: |dependency_values| {
                let value = dependency_values.dep_value("value_sv")
                    .has_exactly_one_element()
                    .is_number();

                SetValue(value.to_string())

            },

            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());


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

    fn empty_attribute_data(&self) -> Box<dyn AttributeData> {
        Box::new(MyAttributeData { ..Default::default() })
    }

    fn new_stale_component_state_vars(&self, use_essential_data: bool) -> Box<dyn ComponentStateVars> {

        let essential_state_vars = if use_essential_data {
            HashMap::new()
        } else {
            HashMap::new()
        };

        Box::new(MyStateVars {
            value: StateVar::new(StateVarValueType::Number),
            hidden: StateVar::new(StateVarValueType::Boolean),
            disabled: StateVar::new(StateVarValueType::Boolean),
            text: StateVar::new(StateVarValueType::String),

            essential_state_vars,

        })
    }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike, ObjectTraitName::NumberLike]
    }

    fn should_render_children(&self) -> bool {
        false
    }
}
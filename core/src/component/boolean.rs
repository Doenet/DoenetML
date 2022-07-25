use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::{ObjectTraitName};

use crate::state_var::{StateVar, EssentialStateVar};



#[derive(Debug)]
struct MyStateVars {
    value: StateVar,
    hidden: StateVar,
    text: StateVar,
    // hide: StateVar,

    essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

}

impl ComponentStateVars for MyStateVars {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String> {
        match state_var_name {
            "value" => Ok(&self.value),
            "hidden" => Ok(&self.hidden),
            "text" => Ok(&self.text),

            _ => Err(format!("Boolean does not have state var {}", state_var_name))
        }
    }

    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
        &self.essential_state_vars
    }
}


#[derive(Debug, Default, Clone)]
struct MyAttributeData {

    // These types could be more specific
    hide: Option<Attribute>,
}

impl AttributeData for MyAttributeData {
    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String> {
        match name {
            "hide" => {
                self.hide = Some(attribute);
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
            _ => panic!("Invalid attribute name {} for text", name)
        }
    }
}



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Boolean(StateVarDefinition {
        

            return_dependency_instructions: |_| {
                let child_instruct = DependencyInstruction::Child(ChildDependencyInstruction {
                    desired_children: vec![ObjectTraitName::TextLike],
                    desired_state_vars: vec!["value"],
                });

                HashMap::from([("textlike_children", child_instruct)])
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let textlike_children = dependency_values.dep_value("textlike_children")
                    .are_strings_if_non_empty();

                let mut concatted_text = String::from("");
                for textlike_child in textlike_children {
                    concatted_text.push_str(&textlike_child);
                }

                let trimmed_text = concatted_text.trim().to_lowercase();
                
                if trimmed_text == "true" {
                    SetValue(true)
                } else {
                    SetValue(false)
                }


            },
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("text", TEXT_DEFAULT_DEFINITION());


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




// impl TextLikeComponent for Number {
//     fn text_value(&self) -> String {
//         let val = *self.value.borrow();
//         val.to_string()
//     }
// }
// impl NumberLikeComponent for Number {
//     fn add_one(&self) -> f64 {
//         *self.value.borrow() + 1.0
//     }

// }


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



    fn empty_attribute_data(&self) -> Box<dyn AttributeData> {
        Box::new(MyAttributeData { ..Default::default() })
    }

    fn new_stale_component_state_vars(&self) -> Box<dyn ComponentStateVars> {
        Box::new(MyStateVars {
            value: StateVar::new(StateVarValueType::Boolean),
            text: StateVar::new(StateVarValueType::String),
            hidden: StateVar::new(StateVarValueType::Boolean),

            essential_state_vars: HashMap::new()
        })
    }

    fn should_render_children(&self) -> bool {
        false
    }

}

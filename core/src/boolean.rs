use std::collections::HashMap;

use core_derive::ComponentLike;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};



#[derive(Debug, ComponentLike)]
pub struct Boolean {
    name: String,
    parent: Option<String>,
    children: Vec<ComponentChild>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created
    essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    attributes: HashMap<AttributeName, Attribute>,

    // State variables
    // value: StateVar,
    hidden: StateVar,
}



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        let mut state_var_definitions = HashMap::new();
        
        // state_var_definitions.insert("value", StateVarVariant::Number(Default::default()));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}


lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("bool"));

        attribute_definitions
    };
}


impl ComponentSpecificBehavior for Boolean {

    fn state_variable_instructions(&self) -> &'static HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS
    }

    fn attribute_instructions(&self) -> &'static HashMap<AttributeName, AttributeDefinition> {
        &MY_ATTRIBUTE_DEFINITIONS
    }

    fn attributes(&self) -> &HashMap<AttributeName, Attribute> {
        &self.attributes
    }


    fn should_render_children(&self) -> bool { false }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::NumberLike, ObjectTraitName::TextLike]
    }

    fn action_names(&self) -> Vec<&'static str> { vec![] }


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



impl Boolean {

    pub fn create(name: String, parent: Option<String>, children: Vec<ComponentChild>, essential_state_vars: HashMap<StateVarName, EssentialStateVar>, attributes: HashMap<AttributeName, Attribute>) -> Box<dyn ComponentLike> {
        Box::new(Boolean {
            name,
            parent,
            children,

            essential_state_vars,
            attributes,
            
            // value: StateVar::new(StateVarValueType::Number),
            hidden: StateVar::new(StateVarValueType::Boolean),
        })
    }
}

use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;

use crate::state_var::StateVar;



#[derive(Debug)]
struct MyStateVars {
    hidden: StateVar,
    disabled: StateVar,
    from: StateVar,
    to: StateVar,
}

impl ComponentStateVars for MyStateVars {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String> {
        match state_var_name {
            "hidden" => Ok(&self.hidden),
            "disabled" => Ok(&self.disabled),
            "from" => Ok(&self.from),
            "to" => Ok(&self.to),

            _ => Err(format!("Number does not have state var {}", state_var_name))
        }
    }


}


lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("from", definition_from_attribute!("from", Integer, 1));

        state_var_definitions.insert("to", definition_from_attribute!("to", Integer, 1));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}


#[derive(Debug, Default, Clone)]
struct MyAttributeData {

    // These types could be more specific
    hide: Option<Attribute>,
    disabled: Option<Attribute>,
    from: Option<Attribute>,
    to: Option<Attribute>,
}


impl AttributeData for MyAttributeData {
    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String> {
        match name {
            "hide" => { self.hide = Some(attribute); },
            "disabled" => { self.disabled = Some(attribute); },
            "from" => { self.from = Some(attribute); },
            "to" => { self.to = Some(attribute); },

            _ => { return Err("Invalid attribute name".to_string()) }
        }
        Ok(())
    }

    fn get(&self, name: AttributeName) -> &Option<Attribute> {
        match name {
            "hide" => &self.hide,
            "disabled" => &self.disabled,
            "from" => &self.from,
            "to" => &self.to,
            _ => panic!("Invalid attribute name {} for sequence", name)
        }
    }
}


lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("disabled", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("to", AttributeDefinition::Component("number"));

        attribute_definitions.insert("from", AttributeDefinition::Component("number"));

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

    fn new_stale_component_state_vars(&self) -> Box<dyn ComponentStateVars> {

        Box::new(MyStateVars {
            hidden: StateVar::new(StateVarValueType::Boolean),
            disabled: StateVar::new(StateVarValueType::Boolean),

            from: StateVar::new(StateVarValueType::Number),
            to: StateVar::new(StateVarValueType::Number),
        })
    }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike, ObjectTraitName::NumberLike]
    }

    fn should_render_children(&self) -> bool {
        false
    }

}

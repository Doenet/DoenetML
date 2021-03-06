use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;

use crate::state_var::StateVar;



#[derive(Debug)]
struct MyStateVars {
    value: StateVar,
    hidden: StateVar,
    disabled: StateVar,
    // hide: StateVar,

}

impl ComponentStateVars for MyStateVars {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String> {
        match state_var_name {
            "value" => Ok(&self.value),
            "hidden" => Ok(&self.hidden),
            "disabled" => Ok(&self.disabled),

            _ => Err(format!("BooleanInput does not have state var {}", state_var_name))
        }
    }

}


lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value", StateVarVariant::Boolean(StateVarDefinition {
        
            return_dependency_instructions: USE_ESSENTIAL_DEPENDENCY_INSTRUCTION,
            determine_state_var_from_dependencies: DETERMINE_FROM_ESSENTIAL,
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,

            for_renderer: true,

            ..Default::default()
        }));

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
}

impl AttributeData for MyAttributeData {
    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String> {
        match name {
            "hide" => { self.hide = Some(attribute); },
            "disabled" => { self.disabled = Some(attribute); },

            _ => { return Err("Invalid attribute name".to_string()) }
        }
        Ok(())
    }

    fn get(&self, name: AttributeName) -> &Option<Attribute> {
        match name {
            "hide" => &self.hide,
            "disabled" => &self.disabled,
            _ => panic!("Invalid attribute name {} for booleanInput", name)
        }
    }
}


lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

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



    fn empty_attribute_data(&self) -> Box<dyn AttributeData> {
        Box::new(MyAttributeData { ..Default::default() })
    }

    fn new_stale_component_state_vars(&self) -> Box<dyn ComponentStateVars> {

        Box::new(MyStateVars {
            value: StateVar::new(StateVarValueType::Boolean),
            hidden: StateVar::new(StateVarValueType::Boolean),
            disabled: StateVar::new(StateVarValueType::Boolean),
        })
    }

    fn should_render_children(&self) -> bool {
        false
    }

    fn action_names(&self) -> Vec<&'static str> {
        vec!["updateBoolean"]
    }

    fn on_action(
        &self,
        action_name: &str,
        args: HashMap<String, StateVarValue>,
        _: &dyn Fn(StateVarName) -> StateVarValue
    ) -> HashMap<StateVarName, StateVarValue> {

            match action_name {
                "updateBoolean" => {

                    let new_val = args.get("boolean").expect("No boolean argument");

                    HashMap::from([("value", new_val.clone())])
                }

                _ => panic!("Unknown action '{}' called on booleanInput", action_name)
            }
        }

}


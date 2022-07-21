use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::state_variables::*;

use crate::{ComponentLike, ComponentChild, ComponentSpecificBehavior, ObjectTraitName};

use lazy_static::lazy_static;

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};





#[derive(Debug, ComponentLike)]
pub struct Text {
    name: String,
    parent: Option<String>,
    children: Vec<ComponentChild>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created    
    essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    attributes: HashMap<AttributeName, Attribute>,

    copy_target: Option<String>,

    // State variables
    value: StateVar,
    hidden: StateVar,
    disabled: StateVar,
    fixed: StateVar,
    // text is same as value state var, but this one gets sent to rendere
    text: StateVar,
    // hide: StateVar,
}


pub struct TextInstanceData {
    value: EssentialStateVar,
    
}



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;
        use DependencyInstruction::*;

        let mut state_var_definitions = HashMap::new();



        state_var_definitions.insert("value",StateVarVariant::String(StateVarDefinition {

            shadow_variable: true,

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
            
                SetValue(val)
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


impl ComponentSpecificBehavior for Text {

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
        vec![ObjectTraitName::TextLike]
    }

    fn action_names(&self) -> Vec<&'static str> { vec![] }



    fn get_copy_target_if_exists(&self) -> &Option<String> {
        &self.copy_target
    }


}



// impl TextLikeComponent for Text {
//     fn text_value(&self) -> String {
//         // self.value.borrow().clone()
//     }
// }


impl Text {
    pub fn create(name: String, parent: Option<String>, children: Vec<ComponentChild>, essential_state_vars: HashMap<StateVarName, EssentialStateVar>, attributes: HashMap<AttributeName, Attribute>, copy_target: Option<String>,
        // attributes: HashMap<String, StateVarValue>
    ) -> Box<dyn ComponentLike> {

        let component = Box::new(Text {
            name,
            parent,
            children,

            essential_state_vars,
            attributes,

            copy_target,

            value: StateVar::new(StateVarValueType::String),
            text: StateVar::new(StateVarValueType::String),

            hidden: StateVar::new(StateVarValueType::Boolean),
            // hide: StateVar::new(StateVarValueType::Boolean),
            disabled: StateVar::new(StateVarValueType::Boolean),
            fixed: StateVar::new(StateVarValueType::Boolean),

        });

        // for (attribute_name, attribute_value) in attributes {

        // }

        component
    }
}



// impl ComponentLike for Text {

//     fn name(&self) -> &str {
//         &self.name
//     }
//     fn children(&self) -> &Vec<ComponentChild> {
//         // Is this really the best way to do this?
//         &self.children
//     }

//     fn parent(&self) -> &Option<String> {
//         &self.parent
//     }
// }



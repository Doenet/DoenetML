use std::collections::HashMap;

use core_derive::ComponentLike;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};



#[derive(Debug, ComponentLike)]
pub struct Number {
    name: String,
    parent: Option<String>,
    children: Vec<ComponentChild>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created
    essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    attributes: HashMap<AttributeName, Attribute>,

    // State variables
    value: StateVar,
    hidden: StateVar,
}


fn value_return_dependency_instructions(
    _prerequisite_state_values: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {

    let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
        desired_children: vec![ObjectTraitName::NumberLike],
        desired_state_vars: vec!["value"],
    });

    HashMap::from([("value", instruction)])

}

fn value_determine_state_var_from_dependencies(
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> StateVarUpdateInstruction<f64> {


    // log!("number dependency values: {:#?}", dependency_values);

    let first_obj = &dependency_values.get("value").unwrap()[0];
    let value = &first_obj.value;
    
    if let StateVarValue::String(string_val) = value {
        let num_val = string_val.parse::<f64>().unwrap_or(0.0);
        StateVarUpdateInstruction::SetValue(num_val)
    } else {
        panic!();
    }

}


lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: value_return_dependency_instructions,
            determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,
            for_renderer: true,
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

        attribute_definitions
    };
}


impl ComponentSpecificBehavior for Number {

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



impl Number {
    pub fn create(name: String, parent: Option<String>, children: Vec<ComponentChild>, essential_state_vars: HashMap<StateVarName, EssentialStateVar>, attributes: HashMap<AttributeName, Attribute>) -> Box<dyn ComponentLike> {
        Box::new(Number {
            name,
            parent,
            children,

            essential_state_vars,
            attributes,
            
            value: StateVar::new(StateVarValueType::Number),
            hidden: StateVar::new(StateVarValueType::Boolean),
        })
    }
}

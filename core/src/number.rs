use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core_derive::ComponentLike;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};

use crate::state_var::{StateVar, StateVarValueType};



#[derive(Debug, ComponentLike)]
pub struct Number {
    pub name: String,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,

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
    dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
) -> StateVarUpdateInstruction<f64> {


    // log!("number dependency values: {:#?}", dependency_values);

    let first_obj = &dependency_values.get("value").unwrap()[0];
    let value = &first_obj.2;
    
    if let StateVarValue::String(string_val) = value {
        let num_val = string_val.parse::<f64>().unwrap_or(0.0);
        StateVarUpdateInstruction::SetValue(num_val)
    } else {
        panic!();
    }

}


lazy_static! {
    static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
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


impl ComponentSpecificBehavior for Number {

    fn state_variable_instructions(&self) -> &HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS
    }

    
    // fn get_state_var_access(&self, name: StateVarName) -> Option<crate::StateVarAccess> {
    //     match name {
    //         "value" => Option::Some(StateVarAccess::Number(&self.value)),
    //         "hidden" => Option::Some(StateVarAccess::Bool(&self.hidden)),
    //         _ => Option::None,
    //     }
    // }

    fn get_state_var(&self, name: StateVarName) -> Option<&StateVar> {
        match name {
            "value" =>  Some(&self.value),
            "hidden" => Some(&self.hidden),
 
            _ => None,
        }        
    }        

    fn get_component_type(&self) -> &'static str { "number" }

    fn should_render_children(&self) -> bool { false }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::NumberLike, ObjectTraitName::TextLike]
    }

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
    pub fn create(name: String, parent: String) -> Rc<dyn ComponentLike> {
        Rc::new(Number {
            name,
            parent: RefCell::new(parent),
            children: RefCell::new(vec![]),
            
            value: StateVar::new(StateVarValueType::Number),
            hidden: StateVar::new(StateVarValueType::Boolean),
        })
    }
}

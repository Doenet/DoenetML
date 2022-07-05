
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core_derive::ComponentLike;
use phf::phf_map;

use crate::state_variable_setup::*;

use crate::{ObjectTraitName, TextLikeComponent, NumberLikeComponent,ComponentLike, ComponentSpecificBehavior, ComponentChild};


#[derive(Debug, ComponentLike)]
pub struct Number {
    name: String,
    parent: RefCell<String>,
    children: RefCell<Vec<ComponentChild>>,

    value: StateVar<i64>,
    hide: StateVar<bool>,
}


fn value_return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {

    let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
        desired_children: vec![ObjectTraitName::TextLike],
        desired_state_vars: vec!["value"],
    });

    HashMap::from([("value", instruction)])
}

fn value_determine_state_var_from_dependencies(dependency_values: HashMap<StateVarAddress, StateVarValue>) -> StateVarUpdateInstruction<i64> {
    StateVarUpdateInstruction::NoChange
}

fn hide_return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {
    DependencyInstructionMap::new()
}

fn hide_determine_state_var_from_dependencies(dependency_values: HashMap<StateVarAddress, StateVarValue>) -> StateVarUpdateInstruction<bool> {
    StateVarUpdateInstruction::NoChange
}



impl ComponentSpecificBehavior for Number {

    // fn define_state_variables() -> std::collections::HashMap<&'static str, crate::StateVarVariant> {
    //     HashMap::new()
    // }

    fn state_variable_instructions(&self) -> &phf::Map<&'static str, StateVarVariant> {

        
        &phf_map! {
            "value" => StateVarVariant::Integer(StateVarDefinition {
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions: value_return_dependency_instructions,
                determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,

                // access: state_var_access!(Number, value, i64),

            }),

            "hide" => StateVarVariant::Bool(StateVarDefinition { 
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions: hide_return_dependency_instructions,
                determine_state_var_from_dependencies: hide_determine_state_var_from_dependencies,
                // access: state_var_access!(Number, hide, bool),
            }),

        }
        
    }


    fn state_var(&self, name: &'static str) -> Option<crate::StateVarAccess> {
        use crate::StateVarAccess;

        match name {
            "value" => Option::Some(StateVarAccess::Integer(&self.value)),
            "hide" => Option::Some(StateVarAccess::Bool(&self.hide)),
            _ => Option::None,
        }
    }


    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

    fn get_component_type(&self) -> &'static str {
        "Number"
    }


}



impl TextLikeComponent for Number {
    fn text_value(&self) -> String {
        let val = *self.value.borrow();
        val.to_string()
    }
}
impl NumberLikeComponent for Number {
    fn add_one(&self) -> i64 {
        *self.value.borrow() + 1
    }
}

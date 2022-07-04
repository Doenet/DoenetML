
use std::rc::Rc;
use std::cell::{RefCell};
use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::state_variable_setup::*;

use crate::{ComponentLike, ComponentChild, ComponentSpecificBehavior, ComponentTraitName, TextLikeComponent};

use phf::phf_map;




#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub value: RefCell<String>,
    pub hide: RefCell<bool>,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,
}


fn value_return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {

    let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
        desired_children: vec![ComponentTraitName::TextLikeComponent],
        desired_state_vars: vec!["value".to_owned()],
    });

    HashMap::from([("value".to_owned(), instruction)])
}

fn value_determine_state_var_from_dependencies(dependency_values: StateVarValuesMap) -> StateVarUpdateInstruction<String> {

    let mut val = String::new();

    for (_, child_text_value) in dependency_values {
        if let StateVarValue::Text(text) = child_text_value {
            val.push_str(&text);
        }
    }

    StateVarUpdateInstruction::SetValue(val)
}

fn hide_return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {
    DependencyInstructionMap::new()
}

fn hide_determine_state_var_from_dependencies(dependency_values: StateVarValuesMap) -> StateVarUpdateInstruction<bool> {
    StateVarUpdateInstruction::NoChange
}




impl ComponentSpecificBehavior for Text {

    fn state_variable_instructions(&self) -> phf::Map<&'static str, StateVar> {


        phf_map! {
            "value" => StateVar::String(StateVarDef {
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions: value_return_dependency_instructions,
                determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,

                // access: state_var_access!(Text, value, String),

            }),

            "hide" => StateVar::Bool(StateVarDef { 
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions: hide_return_dependency_instructions,
                determine_state_var_from_dependencies: hide_determine_state_var_from_dependencies,
                // access: state_var_access!(Text, hide, bool),
            }),

        }
        
    }

    fn state_var(&self, name: &'static str) -> Option<crate::StateVarAccess> {
        use crate::StateVarAccess;

        match name {
            "value" => Option::Some(StateVarAccess::String(&self.value)),
            "hide" => Option::Some(StateVarAccess::Bool(&self.hide)),
            _ => Option::None,
        }
    }

    fn get_trait_names(&self) -> Vec<ComponentTraitName> {
        vec![ComponentTraitName::TextLikeComponent]
    }

    fn get_component_type(&self) -> &'static str {
        "Text"
    }


}










// impl ComponentLike for Text {
//     fn name(&self) -> String {
//         self.name.clone()
//     }
//     fn children(&self) -> RefCell<Vec<Rc<dyn ComponentLike>>> {
//         // Is this really the best way to do this?
//         self.children.clone()
//     }
//     fn parent(&self) -> RefCell<String> {
//         // Is this really the best way to do this?
//         self.parent.clone()
//     }
//     fn parent_name(&self) -> Option<String> {
//         let parent_name = self.parent.borrow().to_string();
//         if parent_name.is_empty() {
//             Option::None
//         } else {
//             Option::Some(parent_name)
//         }
//     }
//     fn add_as_child(&self, child: Rc<dyn ComponentLike>) {
//         let child_parent = Rc::clone(&child).parent();
//         let mut child_parent_cell = child_parent.borrow_mut();
//         *child_parent_cell = self.name.clone();
//         self.children.borrow_mut().push(child); 
//     }
// }




impl TextLikeComponent for Text {
    fn text_value(&self) -> String {
        self.value.borrow().clone()
    }
}


impl Text {
    pub fn to_component_like(text: Rc<Text>) -> Rc<dyn ComponentLike> {
        Rc::clone(&text) as Rc<dyn ComponentLike>
    }
}


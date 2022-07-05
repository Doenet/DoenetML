
use std::rc::Rc;
use std::cell::{RefCell};
use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::state_variable_setup::*;

use crate::{ComponentLike, ComponentChild, ComponentSpecificBehavior, ObjectTraitName, TextLikeComponent};

use phf::phf_map;




#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,

    pub value: StateVar<String>,
    pub hide: StateVar<bool>,
}


fn value_return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {

    let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
        desired_children: vec![ObjectTraitName::TextLike],
        desired_state_vars: vec!["value"],
    });

    HashMap::from([("value", instruction)])
}

fn value_determine_state_var_from_dependencies(dependency_values: HashMap<StateVarAddress, StateVarValue>) -> StateVarUpdateInstruction<String> {

    let mut val = String::new();

    for (_, child_text_value) in dependency_values {
        if let StateVarValue::String(text) = child_text_value {
            val.push_str(&text);
        }
    }

    StateVarUpdateInstruction::SetValue(val)
}

fn hide_return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {
    DependencyInstructionMap::new()
}

fn hide_determine_state_var_from_dependencies(dependency_values: HashMap<StateVarAddress, StateVarValue>) -> StateVarUpdateInstruction<bool> {
    StateVarUpdateInstruction::NoChange
}





impl ComponentSpecificBehavior for Text {

    fn state_variable_instructions(&self) -> &phf::Map<&'static str, StateVarVariant> {


        &phf_map! {
            "value" => StateVarVariant::String(StateVarDefinition {
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions: value_return_dependency_instructions,
                determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,

                // access: state_var_access!(Text, value, String),

            }),

            "hide" => StateVarVariant::Bool(StateVarDefinition { 
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
  
    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

    fn get_component_type(&self) -> &'static str {
        "Text"
    }


}



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






// impl ComponentLike for Text {

//     fn name(&self) -> &str {
//         &self.name
//     }
//     fn children(&self) -> &RefCell<Vec<ComponentChild>> {
//         // Is this really the best way to do this?
//         &self.children
//     }
//     fn parent(&self) -> &RefCell<String> {
//         // Is this really the best way to do this?
//         &self.parent
//     }


//     fn parent_name(&self) -> Option<String> {
//         let parent_name = self.parent.borrow().to_string();
//         if parent_name.is_empty() {
//             Option::None
//         } else {
//             Option::Some(parent_name)
//         }
//     }

//     fn add_as_child(&self, child: ComponentChild) {
//         if let ComponentChild::Component(ref child_component) = child {
//             let child_parent = child_component.parent();
//             let mut child_parent_cell = child_parent.borrow_mut();
//             *child_parent_cell = self.name.clone();
//         }

//         self.children.borrow_mut().push(child); 
//     }

// }



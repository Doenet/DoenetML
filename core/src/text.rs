use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::state_variable_setup::*;

use crate::{ComponentLike, ComponentChild, ComponentSpecificBehavior, ObjectTraitName,
TextLikeComponent};

use phf::phf_map;


#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,

    // State variables
    value: StateVar<String>,
    hide: StateVar<bool>,
}


fn value_return_dependency_instructions(
    _prerequisite_state_values: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {

    let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
        desired_children: vec![ObjectTraitName::TextLike],
        desired_state_vars: vec!["value"],
    });

    HashMap::from([("value", instruction)])
}

fn value_determine_state_var_from_dependencies(
    dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
) -> StateVarUpdateInstruction<String> {

    // log!("text dep vals: {:#?}", dependency_values);

    let mut val = String::new();

    let textlike_children_values = dependency_values.get("value").unwrap();

    for (_, _, child_text_value) in textlike_children_values {
        match child_text_value {
            StateVarValue::String(text) => {
                val.push_str(&text);
            },
            StateVarValue::Number(num) => {
                val.push_str(&num.to_string());
            },
            StateVarValue::Integer(integer) => {
                val.push_str(&integer.to_string());
            },
            StateVarValue::Boolean(bool_val) => {
                val.push_str(&bool_val.to_string());
            },


        }
    }

    StateVarUpdateInstruction::SetValue(val)
}



impl ComponentSpecificBehavior for Text {

    fn state_variable_instructions(&self) -> &phf::Map<StateVarName, StateVarVariant> {

        &phf_map! {
            "value" => StateVarVariant::String(StateVarDefinition {
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions: value_return_dependency_instructions,
                determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,
                for_renderer: true,
                default_value: || "".to_owned(),
            }),

            "hide" => HIDE_DEFAULT_DEFINITION,
        }
        
    }

    fn state_var(&self, name: StateVarName) -> Option<crate::StateVarAccess> {
        match name {
            "value" => Option::Some(StateVarAccess::String(&self.value)),
            "hide" => Option::Some(StateVarAccess::Bool(&self.hide)),
            _ => Option::None,
        }
    }

    fn get_component_type(&self) -> &'static str { "text" }

    fn should_render_children(&self) -> bool { true }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

}



// impl TextLikeComponent for Text {
//     fn text_value(&self) -> String {
//         // self.value.borrow().clone()
//     }
// }


impl Text {
    pub fn create(name: String, parent: String) -> Rc<Text> {
        Rc::new(Text {
            name,
            parent: RefCell::new(parent),
            children: RefCell::new(vec![]),

            value: StateVar::new(),
            hide: StateVar::new(),
        })
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



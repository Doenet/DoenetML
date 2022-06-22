
use std::rc::Rc;
use std::cell::{RefCell};
use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::{HasStateVariables, default_state_vars_for_dependencies,  state_var_access};

use crate::{StateVarValue, DependencyInstruction, ChildDependencyInstruction, StateVarUpdateInstruction, ComponentTraitName, TextLikeComponent, ComponentLike, HasComponentTraits, ComponentChild, StateVarDef, StateVarValuesMap, DependencyInstructionMap, StateVar};




#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub value: RefCell<String>,
    pub hide: RefCell<bool>,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,
}


impl HasStateVariables for Text {
    fn define_state_variables() -> HashMap<&'static str, StateVar> {

        let value: StateVarDef<String>;
        {
            fn return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {

                let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
                    desired_children: vec![ComponentTraitName::TextLikeComponent],
                    desired_state_vars: vec!["value".to_owned()],
                });
    
                HashMap::from([("value".to_owned(), instruction)])
            }
            fn determine_state_var_from_dependencies(dependency_values: StateVarValuesMap) -> StateVarUpdateInstruction<String> {
    
                let mut val = String::new();
            
                for (_, child_text_value) in dependency_values {
                    if let StateVarValue::Text(text) = child_text_value {
                        val.push_str(&text);
                    }
                }
            
                StateVarUpdateInstruction::SetValue(val)
            }


            value = StateVarDef {
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions,
                determine_state_var_from_dependencies,

                access: state_var_access!(Text, value, String),
            };
        }


        let hide: StateVarDef<bool>;
        {
            fn return_dependency_instructions(prerequisite_state_values: StateVarValuesMap) -> DependencyInstructionMap {
                DependencyInstructionMap::new()
            }
            fn determine_state_var_from_dependencies(dependency_values: StateVarValuesMap) -> StateVarUpdateInstruction<bool> {
                StateVarUpdateInstruction::NoChange
        }

            hide = StateVarDef {
                state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
                return_dependency_instructions,
                determine_state_var_from_dependencies,
                access: state_var_access!(Text, hide, bool),
            };
        }

        HashMap::from([
            ("value", StateVar::String(value)),
            ("hide", StateVar::Bool(hide)),
        ])

    }
}





impl HasComponentTraits for Text {
    fn get_trait_names(&self) -> Vec<ComponentTraitName> {
        vec![ComponentTraitName::TextLikeComponent]
    }

    // fn state_vars(&self) -> Vec<Rc<dyn StateVariable>> {
    //     vec![
    //         Rc::new(self.value) as Rc<dyn StateVariable>
    //     ]
    // }

}







pub struct MyTextValue {
    value: String,
}
/** #[derive(Debug, Clone)]
pub struct TextValue(pub String);
impl StateVariable for TextValue {

    fn return_dependency_instructions(
        prerequisite_state_values: HashMap<String, StateVarValue>
    ) -> HashMap<String, DependencyInstruction> {

        let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
            desired_children: vec![ComponentTraitName::TextLikeComponent],
            desired_state_vars: vec!["value".to_owned()],
        });

        HashMap::from([("text_value".to_owned(), instruction)])

    }

    fn determine_state_var_from_dependencies(
        dependency_values: HashMap<String, StateVarValue>
    ) -> StateVarUpdateInstruction {

        let mut val = String::new();

        for (_, child_text_value) in dependency_values {
            if let StateVarValue::Text(text) = child_text_value {
                val.push_str(&text);
            }
        }

        StateVarUpdateInstruction::SetValue(StateVarValue::Text(val))
    }
}


**/


// #[derive(Debug, Clone)]
// enum TextChildRef {
//     String(String),
//     TextLikeComponent(Rc<dyn TextLikeComponent>),
// }


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


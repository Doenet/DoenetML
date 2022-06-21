
use std::rc::Rc;
use std::cell::{RefCell};
use std::collections::HashMap;


use core_derive::ComponentLike;

use super::{StateVariable, StateVarValue, DependencyInstruction, ChildDependencyInstruction, StateVarUpdateInstruction, ComponentTraitName, TextLikeComponent, ComponentLike, HasComponentTraits};



impl HasComponentTraits for Text {
    fn get_trait_names(&self) -> Vec<ComponentTraitName> {
        vec![ComponentTraitName::TextLikeComponent]
    }
}


#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub value: TextValue,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<Rc<dyn ComponentLike>>>,
}

#[derive(Debug)]
pub struct TextValue(pub String);
impl StateVariable for TextValue {
    type Type = String;

    fn return_dependency_instructions(
        prerequisite_state_values: HashMap<String, StateVarValue>
    ) -> HashMap<String, DependencyInstruction> {

        let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
            desired_children: vec![ComponentTraitName::TextLikeComponent],
            desired_state_vars: vec!["value".to_string()],
        });

        HashMap::from([("text_value".to_string(), instruction)])

    }

    fn determine_state_var_from_dependencies(
        dependency_values: HashMap<String, StateVarValue>
    ) -> StateVarUpdateInstruction<Self::Type> {

        let mut val = String::new();

        for (_, child_text_value) in dependency_values {
            if let StateVarValue::Text(text) = child_text_value {
                val.push_str(&text);
            }
        }

        StateVarUpdateInstruction::SetValue(val)
    }
}




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
        self.value.0.clone()
    }
}


impl Text {
    pub fn to_component_like(text: Rc<Text>) -> Rc<dyn ComponentLike> {
        Rc::clone(&text) as Rc<dyn ComponentLike>
    }
}

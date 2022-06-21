
use std::rc::Rc;
use std::cell::{RefCell};

use super::{StateVariable, StateVarValue, DependencyInstruction, ChildDependencyInstruction, StateVarUpdateInstruction, ComponentTraitName, TextLikeComponent, NumberLikeComponent,ComponentLike, HasComponentTraits};


#[derive(Debug)]
pub struct Number {
    name: String,
    value: i32,
    hide: bool,
    parent: RefCell<String>,
    children: RefCell<Vec<Rc<dyn ComponentLike>>>,
}



// #[derive(Debug)]
// enum NumberChildRef {
//     String(String),
//     Number(Rc<dyn NumberLikeComponent>),
// }


impl HasComponentTraits for Number {
    fn get_trait_names(&self) -> Vec<ComponentTraitName> {
        vec![ComponentTraitName::TextLikeComponent]
    }
}

impl TextLikeComponent for Number {
    fn text_value(&self) -> String {
        self.value.to_string()
    }
}
impl NumberLikeComponent for Number {
    fn add_one(&self) -> i32 {
        self.value + 1
    }
}


impl ComponentLike for Number {
    fn name(&self) -> String {
        self.name.clone()
    }

    fn children(&self) -> RefCell<Vec<Rc<dyn ComponentLike>>> {
        // Is this really the best way to do this?
        self.children.clone()
    }

    fn parent(&self) -> RefCell<String> {
        // Is this really the best way to do this?
        self.parent.clone()
    }


    fn parent_name(&self) -> Option<String> {
        let parent_name = self.parent.borrow().to_string();
        if parent_name.is_empty() {
            Option::None
        } else {
            Option::Some(parent_name)
        }
    }

    fn add_as_child(&self, child: Rc<dyn ComponentLike>) {
        let child_parent = Rc::clone(&child).parent();
        let mut child_parent_cell = child_parent.borrow_mut();
        *child_parent_cell = self.name.clone();

        self.children.borrow_mut().push(child); 
    }

}
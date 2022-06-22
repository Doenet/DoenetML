
use std::rc::Rc;
use std::cell::{RefCell};

use core_derive::ComponentLike;

use super::{StateVarValue, DependencyInstruction, ChildDependencyInstruction, StateVarUpdateInstruction, ComponentTraitName, TextLikeComponent, NumberLikeComponent,ComponentLike, HasComponentTraits, ComponentChild};


#[derive(Debug, ComponentLike)]
pub struct Number {
    name: String,
    value: i32,
    hide: bool,
    parent: RefCell<String>,
    children: RefCell<Vec<ComponentChild>>,
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


    // fn state_vars(&self) -> Vec<Rc<dyn StateVariable>> {
    //     vec![]
    // }
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

use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core_derive::ComponentLike;
use phf::phf_map;

use crate::state_variable_setup::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};


#[derive(Debug, ComponentLike)]
pub struct TextInput {
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

    HashMap::new()

}

fn value_determine_state_var_from_dependencies(
    _dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
) -> StateVarUpdateInstruction<String> {

    StateVarUpdateInstruction::NoChange

}



fn update_value_action(args: HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>> {

    let new_val = args.get("value").expect("No value argument");
    HashMap::from([
        ("value", StateVarUpdateInstruction::SetValue(new_val.clone()))
    ])
}




impl ComponentSpecificBehavior for TextInput {

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



    fn actions(&self) -> &phf::Map<&'static str, fn(HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>> {
        &phf_map! {
            "updateValue" => update_value_action,
        }
    }





    fn get_component_type(&self) -> &'static str { "textInput" }

    fn should_render_children(&self) -> bool { false }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

}



// impl TextLikeComponent for TextInput {
//     fn text_value(&self) -> String {
//         let val = *self.value.borrow();
//         val.to_string()
//     }
// }



impl TextInput {
    pub fn create(name: String, parent: String) -> Rc<dyn ComponentLike> {
        Rc::new(TextInput {
            name,
            parent: RefCell::new(parent),
            children: RefCell::new(vec![]),
            
            value: StateVar::new(),
            hide: StateVar::new(),
        })
    }
}

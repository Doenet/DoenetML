use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::state_variables::*;

use crate::{ComponentLike, ComponentChild, ComponentSpecificBehavior, ObjectTraitName};

use lazy_static::lazy_static;


#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,

    // State variables
    value: StateVar<String>,
    hidden: StateVar<bool>,
    disabled: StateVar<bool>,
    fixed: StateVar<bool>,
    // text is same as value state var, but this one gets sent to rendere
    text: StateVar<String>, 

}


fn text_return_dependency_instructions(
    _prerequisite_state_values: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {

    let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
        component_name: None, //myself
        state_var: "value",
    });

    HashMap::from([("text_value_of_value", instruction)])
}

fn text_determine_state_var_from_dependencies(
    dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
) -> StateVarUpdateInstruction<String> {

    let value_state_var = dependency_values.get("text_value_of_value").expect("no value given").get(0).expect("no first element");
    StateVarUpdateInstruction::SetValue(match &value_state_var.2 {
        StateVarValue::String(str_val_of_value_sv) => str_val_of_value_sv.to_string(),
        _ => panic!()
    })
}


fn value_return_dependency_instructions(
    _prerequisite_state_values: HashMap<StateVarName, StateVarValue>
) -> HashMap<InstructionName, DependencyInstruction> {

    let instruction = DependencyInstruction::Child(ChildDependencyInstruction {
        desired_children: vec![ObjectTraitName::TextLike],
        desired_state_vars: vec!["value"],
    });

    HashMap::from([("value_state_vars_of_my_children", instruction)])
}

fn value_determine_state_var_from_dependencies(
    dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
) -> StateVarUpdateInstruction<String> {

    // log!("text dep vals: {:#?}", dependency_values);

    let mut val = String::new();

    let textlike_children_values = dependency_values.get("value_state_vars_of_my_children").unwrap();

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


lazy_static! {
    static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value",StateVarVariant::String(StateVarDefinition {
            return_dependency_instructions: value_return_dependency_instructions,
            determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,
            ..Default::default()
        }));


        state_var_definitions.insert("text", StateVarVariant::String(StateVarDefinition {
            return_dependency_instructions: text_return_dependency_instructions,
            determine_state_var_from_dependencies: text_determine_state_var_from_dependencies,
            for_renderer: true,
            ..Default::default()
        }));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        state_var_definitions.insert("fixed", FIXED_DEFAULT_DEFINITION());



        return state_var_definitions
    };
}


impl ComponentSpecificBehavior for Text {

    fn state_variable_instructions(&self) -> &HashMap<StateVarName, StateVarVariant> {

        &MY_STATE_VAR_DEFINITIONS


        // &phf_map! {
        //     "value" => StateVarVariant::String(StateVarDefinition {
        //         state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
        //         return_dependency_instructions: value_return_dependency_instructions,
        //         determine_state_var_from_dependencies: value_determine_state_var_from_dependencies,
        //         for_renderer: false,
        //         default_value: || "".to_owned(),
        //     }),

        //     "text" => StateVarVariant::String(StateVarDefinition {
        //         state_vars_to_determine_dependencies: default_state_vars_for_dependencies,
        //         return_dependency_instructions: text_return_dependency_instructions,
        //         determine_state_var_from_dependencies: text_determine_state_var_from_dependencies,
        //         for_renderer: true,
        //         default_value: || "".to_owned(),
        //     }),

        //     "hidden" => HIDDEN_DEFAULT_DEFINITION,
        //     "disabled" => DISABLED_DEFAULT_DEFINITION,
        //     "fixed" => FIXED_DEFAULT_DEFINITION,

        // }
    }


    fn get_state_var_access(&self, name: StateVarName) -> Option<crate::StateVarAccess> {
        match name {
            "value" => Option::Some(StateVarAccess::String(&self.value)),
            "hidden" => Option::Some(StateVarAccess::Bool(&self.hidden)),
            "disabled" => Option::Some(StateVarAccess::Bool(&self.disabled)),
            "fixed" => Option::Some(StateVarAccess::Bool(&self.fixed)),
            "text" => Option::Some(StateVarAccess::String(&self.text)),

            _ => Option::None,
        }
    }

    fn get_state_var(&self, name: StateVarName) -> Option<StateVar<StateVarValue>> {
        match name {
            "value" => Some(self.value.as_general_state_var()),
            "hidden" => Some(self.hidden.as_general_state_var()),
            "disabled" => Some(self.disabled.as_general_state_var()),
            "fixed" => Some(self.fixed.as_general_state_var()),
            "text" => Some(self.text.as_general_state_var()),
 
            _ => Option::None,
        }        
    }    

    fn get_component_type(&self) -> &'static str { "text" }

    fn should_render_children(&self) -> bool { false }

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
    pub fn create(name: String, parent: String) -> Rc<dyn ComponentLike> {
        Rc::new(Text {
            name,
            parent: RefCell::new(parent),
            children: RefCell::new(vec![]),

            value: StateVar::new(),
            hidden: StateVar::new(),
            disabled: StateVar::new(),
            fixed: StateVar::new(),
            text: StateVar::new(),

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



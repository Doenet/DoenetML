use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core_derive::ComponentLike;
use phf::phf_map;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};


#[derive(Debug, ComponentLike)]
pub struct TextInput {
    pub name: String,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,

    // State variables
    value: StateVar<String>,
    hidden: StateVar<bool>,
    expanded: StateVar<bool>,
    size: StateVar<f64>,
    immediate_value: StateVar<String>,
    width: StateVar<f64>,
}


// fn value_return_dependency_instructions(
//     _prerequisite_state_values: HashMap<StateVarName, StateVarValue>
// ) -> HashMap<InstructionName, DependencyInstruction> {

//     HashMap::new()

// }

// fn value_determine_state_var_from_dependencies(
//     _dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>>
// ) -> StateVarUpdateInstruction<String> {

//     StateVarUpdateInstruction::UseDefault

// }



// fn update_value_action(args: HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>> {

//     HashMap::from([
//         ("value", StateVarUpdateInstruction::SetValue(new_val.clone()))
//     ])
// }


fn update_immediate_value_action(args: HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>> {

    let new_val = args.get("immediateValue").expect("No immediateValue argument");
    HashMap::from([
        ("immediateValue", StateVarUpdateInstruction::SetValue(new_val.clone()))
    ])
}



lazy_static! {

    static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value", StateVarVariant::String(StateVarDefinition {

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
                    component_name: None, //myself
                    state_var: "immediateValue",
                });
            
                HashMap::from([("my_immediateValue_sv", instruction)])
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let immediate_value_state_var = dependency_values.get("my_immediateValue_sv")
                    .expect("no immediateValue var given")
                    .get(0).expect("no first element");

                StateVarUpdateInstruction::SetValue(match &immediate_value_state_var.2 {
                    StateVarValue::String(val) => val.to_string(),
                    _ => panic!()
                })
            },

            ..Default::default()
        }));




        state_var_definitions.insert("expanded", StateVarVariant::Bool(StateVarDefinition {
            for_renderer: true,
            ..Default::default()
            
        }));


        state_var_definitions.insert("size", StateVarVariant::Number(StateVarDefinition {

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
                    component_name: None, //myself
                    state_var: "width",
                });
            
                HashMap::from([("my_width_sv", instruction)])
            },

            determine_state_var_from_dependencies: |dependency_values| {
                let width_state_var = dependency_values.get("my_width_sv")
                    .expect("no width state var given")
                    .get(0).expect("no first element");

                StateVarUpdateInstruction::SetValue(match width_state_var.2 {
                    StateVarValue::Number(val_of_width_sv) => val_of_width_sv,
                    _ => panic!()
                })

            },
            for_renderer: true,
            default_value: 10.0,
            ..Default::default()
        }));




        state_var_definitions.insert("width", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,
            default_value: 600.0,
            ..Default::default()
        }));


        state_var_definitions.insert("immediateValue", StateVarVariant::String(StateVarDefinition {
            //hasEssential: true,
            for_renderer: true,
            ..Default::default()
        }));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());


        return state_var_definitions
    };


}


impl ComponentSpecificBehavior for TextInput {

    fn state_variable_instructions(&self) -> &HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS        
    }
    

    fn get_state_var_access(&self, name: StateVarName) -> Option<crate::StateVarAccess> {
        match name {
            "value" => Option::Some(StateVarAccess::String(&self.value)),
            "hidden" => Option::Some(StateVarAccess::Bool(&self.hidden)),
            "immediateValue" => Option::Some(StateVarAccess::String(&self.immediate_value)),
            "expanded" => Option::Some(StateVarAccess::Bool(&self.expanded)),
            "width" => Option::Some(StateVarAccess::Number(&self.width)),
            "size" => Option::Some(StateVarAccess::Number(&self.size)),
 
            _ => Option::None,
        }
    }

    fn get_state_var(&self, name: StateVarName) -> Option<StateVar<StateVarValue>> {
        match name {
            "value" => Option::Some(self.value.as_general_state_var()),
            "hidden" => Option::Some(self.hidden.as_general_state_var()),
            "immediateValue" => Option::Some(self.immediate_value.as_general_state_var()),
            "expanded" => Option::Some(self.expanded.as_general_state_var()),
            "width" => Option::Some(self.width.as_general_state_var()),
            "size" => Option::Some(self.size.as_general_state_var()),
 
            _ => Option::None,
        }        
    }



    fn actions(&self) -> &phf::Map<&'static str, fn(HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>> {
        &phf_map! {
            "updateImmediateValue" => update_immediate_value_action,
        }
    }


    // fn on_action(&self, action_name: &str, args: HashMap<String, StateVarValue>) -> 
    // HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>
    // {

    //     match action_name {
    //         "updateImmediateValue" => {
    //             // Note: the key here is whatever the renderers call the new value
    //             let new_val = args.get("text").expect("No text argument");

    //             HashMap::from([
    //                 // the key here is my state var name
    //                 ("immediateValue", StateVarUpdateInstruction::SetValue(new_val.clone()))
    //             ])
    //         },

    //         "updateValue" => {

    //             let new_value = self.immediate_value
    //                 .expect_resolved("Action updateValue called when immediateValue was unresolved");
                
    //             // Assuming immediateValue sv is resolved already

    //             HashMap::from([
    //                 ("value", StateVarUpdateInstruction::SetValue(StateVarValue::String(new_value)))
    //             ])
    //         }
    //     }

    // }




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
            hidden: StateVar::new(),
            immediate_value: StateVar::new(),
            size: StateVar::new(),
            width: StateVar::new(),
            expanded: StateVar::new(),

        })
    }
}

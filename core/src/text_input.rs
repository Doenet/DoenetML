use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core_derive::ComponentLike;
use phf::phf_map;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};



#[derive(Debug, ComponentLike)]
pub struct TextInput {
    pub name: String,
    pub parent: RefCell<String>,
    pub children: RefCell<Vec<ComponentChild>>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created
    pub essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    // State variables
    value: StateVar,
    hidden: StateVar,
    expanded: StateVar,
    size: StateVar,
    immediate_value: StateVar,
    width: StateVar,
}



fn update_immediate_value_action(args: HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>> {

    let new_val = args.get("immediateValue").expect("No immediateValue argument").clone();
    HashMap::from([
        ("immediateValue", StateVarUpdateInstruction::SetValue(new_val))
    ])
}



lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

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




        state_var_definitions.insert("expanded", StateVarVariant::Boolean(StateVarDefinition {
            for_renderer: true,
            determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(false),
            ..Default::default()
            
        }));


        state_var_definitions.insert("size", StateVarVariant::Number(StateVarDefinition {


            determine_state_var_from_dependencies: |_| {
                StateVarUpdateInstruction::SetValue(10.0)
            },
            for_renderer: true,
            default_value: 10.0,
            ..Default::default()
        }));




        state_var_definitions.insert("width", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,
            default_value: 600.0,
            determine_state_var_from_dependencies: |_| StateVarUpdateInstruction::SetValue(600.0),
            ..Default::default()
        }));


        state_var_definitions.insert("immediateValue", StateVarVariant::String(StateVarDefinition {
            has_essential: true,
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
    

    fn get_state_var(&self, name: StateVarName) -> Option<&StateVar> {
        match name {
            "value" =>          Some(&self.value),
            "hidden" =>         Some(&self.hidden),
            "immediateValue" => Some(&self.immediate_value),
            "expanded" =>       Some(&self.expanded),
            "width" =>          Some(&self.width),
            "size" =>           Some(&self.size),
 
            _ => None,
        }        
    }

    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
        &self.essential_state_vars
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
    pub fn create(name: String, parent: String, essential_state_vars: HashMap<StateVarName, EssentialStateVar>) -> Rc<dyn ComponentLike> {
        Rc::new(TextInput {
            name,
            parent: RefCell::new(parent),
            children: RefCell::new(vec![]),

            essential_state_vars,
            
            value: StateVar::new(StateVarValueType::String),
            hidden: StateVar::new(StateVarValueType::Boolean),
            immediate_value: StateVar::new(StateVarValueType::String),
            size: StateVar::new(StateVarValueType::Number),
            width: StateVar::new(StateVarValueType::Number),
            expanded: StateVar::new(StateVarValueType::Boolean),

        })
    }
}

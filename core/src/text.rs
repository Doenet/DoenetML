use std::collections::HashMap;


use core_derive::ComponentLike;

use crate::state_variables::*;

use crate::{ComponentLike, ComponentChild, ComponentSpecificBehavior, ObjectTraitName};

use lazy_static::lazy_static;

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};



#[derive(Debug, ComponentLike)]
pub struct Text {
    pub name: String,
    pub parent: Option<String>,
    pub children: Vec<ComponentChild>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created    
    pub essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    // State variables
    value: StateVar,
    hidden: StateVar,
    disabled: StateVar,
    fixed: StateVar,
    // text is same as value state var, but this one gets sent to rendere
    text: StateVar,
    hide: StateVar,

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
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> StateVarUpdateInstruction<String> {

    let value_state_var = dependency_values.get("text_value_of_value").expect("no value given").get(0).expect("no first element");
    StateVarUpdateInstruction::SetValue(match &value_state_var.value {
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
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
) -> StateVarUpdateInstruction<String> {

    // log!("text dep vals: {:#?}", dependency_values);

    let mut val = String::new();

    let textlike_children_values = dependency_values.get("value_state_vars_of_my_children").unwrap();

    for dependency_value in textlike_children_values {
        match &dependency_value.value {
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
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
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

        state_var_definitions.insert("hide", StateVarVariant::Boolean(StateVarDefinition {
            ..Default::default()
        }));



        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        state_var_definitions.insert("fixed", FIXED_DEFAULT_DEFINITION());



        return state_var_definitions
    };
}


impl ComponentSpecificBehavior for Text {

    fn state_variable_instructions(&self) -> &'static HashMap<StateVarName, StateVarVariant> {

        &MY_STATE_VAR_DEFINITIONS

    }

    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
        &self.essential_state_vars
    }

    fn get_component_type(&self) -> &'static str { "text" }

    fn should_render_children(&self) -> bool { false }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

    fn action_names(&self) -> Vec<&'static str> { vec![] }


}



// impl TextLikeComponent for Text {
//     fn text_value(&self) -> String {
//         // self.value.borrow().clone()
//     }
// }


impl Text {
    pub fn create(name: String, parent: Option<String>, children: Vec<ComponentChild>, essential_state_vars: HashMap<StateVarName, EssentialStateVar>, 
        // attributes: HashMap<String, StateVarValue>
    ) -> Box<dyn ComponentLike> {

        let component = Box::new(Text {
            name,
            parent,
            children,

            essential_state_vars,

            value: StateVar::new(StateVarValueType::String),
            text: StateVar::new(StateVarValueType::String),

            hidden: StateVar::new(StateVarValueType::Boolean),
            hide: StateVar::new(StateVarValueType::Boolean),
            disabled: StateVar::new(StateVarValueType::Boolean),
            fixed: StateVar::new(StateVarValueType::Boolean),

        });


        component
    }
}





// impl ComponentLike for Text {

//     fn name(&self) -> &str {
//         &self.name
//     }
//     fn children(&self) -> &Vec<ComponentChild> {
//         // Is this really the best way to do this?
//         &self.children
//     }

//     fn parent(&self) -> &Option<String> {
//         &self.parent
//     }
// }



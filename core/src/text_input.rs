use std::collections::HashMap;

use core_derive::ComponentLike;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};


#[derive(Debug, ComponentLike)]
pub struct TextInput {
    name: String,
    parent: Option<String>,
    children: Vec<ComponentChild>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created
    essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    attributes: HashMap<AttributeName, Attribute>,

    copy_target: Option<String>,


    // State variables
    value: StateVar,
    hidden: StateVar,
    hide: StateVar,
    expanded: StateVar,
    size: StateVar,
    immediate_value: StateVar,
    width: StateVar,
}



// fn update_immediate_value_action(args: HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>> {

//     let new_val = args.get("immediateValue").expect("No immediateValue argument").clone();
//     HashMap::from([
//         ("immediateValue", StateVarUpdateInstruction::SetValue(new_val))
//     ])
// }



lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value", StateVarVariant::String(StateVarDefinition {

            // return_dependency_instructions: |_| {
            //     let instruction = DependencyInstruction::StateVar(StateVarDependencyInstruction {
            //         component_name: None, //myself
            //         state_var: "immediateValue",
            //     });
            
            //     HashMap::from([("my_immediateValue_sv", instruction)])
            // },

            // determine_state_var_from_dependencies: |dependency_values| {

            //     let immediate_value_state_var = dependency_values.get("my_immediateValue_sv")
            //         .expect("no immediateValue var given")
            //         .get(0).expect("no first element");

            //     SetValue(match &immediate_value_state_var.2 {
            //         StateVarValue::String(val) => val.to_string(),
            //         _ => panic!()
            //     })
            // },
            has_essential: true,
            request_dependencies_to_update_value: |desired_value| {
                vec![UpdateRequest::SetEssentialValue(
                    "value", StateVarValue::String(desired_value)
                )]
            },

            determine_state_var_from_dependencies: |_| UseEssentialOrDefault,

            ..Default::default()
        }));




        state_var_definitions.insert("expanded", StateVarVariant::Boolean(StateVarDefinition {
            for_renderer: true,
            determine_state_var_from_dependencies: |_| SetValue(false),
            ..Default::default()
            
        }));


        state_var_definitions.insert("size", StateVarVariant::Number(StateVarDefinition {


            determine_state_var_from_dependencies: |_| {
                SetValue(10.0)
            },
            for_renderer: true,
            default_value: 10.0,
            ..Default::default()
        }));




        state_var_definitions.insert("width", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,
            default_value: 600.0,
            determine_state_var_from_dependencies: |_| SetValue(600.0),
            ..Default::default()
        }));


        state_var_definitions.insert("immediateValue", StateVarVariant::String(StateVarDefinition {
            has_essential: true,
            for_renderer: true,
            determine_state_var_from_dependencies: |_| UseEssentialOrDefault,

            request_dependencies_to_update_value: |my_desired_value| {
                vec![
                    UpdateRequest::SetEssentialValue(

                        // Should the update request really use a StateVarValue?
                        "immediateValue", StateVarValue::String(my_desired_value)
                    )
                ]
            },

            ..Default::default()
        }));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("hide", StateVarVariant::Boolean(Default::default()));


        return state_var_definitions
    };


}


lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

        attribute_definitions
    };
}


impl ComponentSpecificBehavior for TextInput {

    fn state_variable_instructions(&self) -> &'static HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS        
    }

    fn attribute_instructions(&self) -> &'static HashMap<AttributeName, AttributeDefinition> {
        &MY_ATTRIBUTE_DEFINITIONS
    }

    fn attributes(&self) -> &HashMap<AttributeName, Attribute> {
        &self.attributes
    }
    
    fn action_names(&self) -> Vec<&'static str> {
        vec!["updateImmediateValue", "updateValue"]
    }

    fn on_action(
        &self,
        action_name: &str,
        args: HashMap<String, StateVarValue>,
        resolve_and_retrieve_state_var: &dyn Fn(StateVarName) -> StateVarValue) -> HashMap<StateVarName, StateVarValue>
    {

        match action_name {
            "updateImmediateValue" => {
                // Note: the key here is whatever the renderers call the new value
                let new_val = args.get("text").expect("No text argument");

                HashMap::from([("immediateValue", new_val.clone())])
            },


            "updateValue" => {

                let new_val = resolve_and_retrieve_state_var("immediateValue").unwrap_string();
                
                let new_val = StateVarValue::String(new_val);


                HashMap::from([("value", new_val)])

            }



            _ => panic!("Unknown action '{}' called on {}", action_name, self.name())

        }

    }




    fn should_render_children(&self) -> bool { false }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![ObjectTraitName::TextLike]
    }

    fn get_copy_target_if_exists(&self) -> &Option<String> {
        &self.copy_target
    }

}



// impl TextLikeComponent for TextInput {
//     fn text_value(&self) -> String {
//         let val = *self.value.borrow();
//         val.to_string()
//     }
// }



impl TextInput {
    pub fn create(name: String, parent: Option<String>, children: Vec<ComponentChild>, essential_state_vars: HashMap<StateVarName, EssentialStateVar>, attributes: HashMap<AttributeName, Attribute>, copy_target: Option<String>,) -> Box<dyn ComponentLike> {
        Box::new(TextInput {
            name,
            parent,
            children,

            essential_state_vars,
            attributes,

            copy_target,
            
            value: StateVar::new(StateVarValueType::String),
            hidden: StateVar::new(StateVarValueType::Boolean),
            hide: StateVar::new(StateVarValueType::Boolean),
            immediate_value: StateVar::new(StateVarValueType::String),
            size: StateVar::new(StateVarValueType::Number),
            width: StateVar::new(StateVarValueType::Number),
            expanded: StateVar::new(StateVarValueType::Boolean),

        })
    }
}

use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;

use crate::state_var::StateVar;




#[derive(Debug)]
struct MyStateVars {
    submit_label: StateVar,
    submit_label_no_correctness: StateVar,
    hidden: StateVar,
    disabled: StateVar,
    fixed: StateVar,
    // title_child_name: StateVar,
    title: StateVar,
    level: StateVar,
    just_submitted: StateVar,
    show_correctness: StateVar,
    credit_achieved: StateVar,
    create_submit_all_button: StateVar,
    suppress_answer_submit_buttons: StateVar,

}

impl ComponentStateVars for MyStateVars {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String> {
        match state_var_name {
            "submitLabel" => Ok(&self.submit_label),
            "submitLabelNoCorrectness" => Ok(&self.submit_label_no_correctness),
            "hidden" => Ok(&self.hidden),
            "disabled" => Ok(&self.disabled),
            "fixed" => Ok(&self.fixed),
            "title" => Ok(&self.title),
            "level" => Ok(&self.level),
            "justSubmitted" => Ok(&self.just_submitted),
            "showCorrectness" => Ok(&self.show_correctness),
            "creditAchieved" => Ok(&self.credit_achieved),
            "createSubmitAllButton" => Ok(&self.create_submit_all_button),
            "suppressAnswerSubmitButtons" => Ok(&self.suppress_answer_submit_buttons),

            _ => Err(format!("Document does not have state var {}", state_var_name))
        }
    }

}




#[derive(Debug, Default, Clone)]
struct MyAttributeData {

    // These types could be more specific
    hide: Option<Attribute>,
    disabled: Option<Attribute>,
}

impl AttributeData for MyAttributeData {
    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String> {
        match name {
            "hide" => {
                self.hide = Some(attribute);
            },
            "disabled" => {
                self.disabled = Some(attribute);
            },

            _ => {
                return Err("Invalid attribute name".to_string())
            }
        }
        Ok(())
    }

    fn get(&self, name: AttributeName) -> &Option<Attribute> {
        match name {
            "hide" => &self.hide,
            "disabled" => &self.disabled,
            _ => panic!("Invalid attribute name {} for text", name)
        }
    }
}



lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("submitLabel", StateVarVariant::String(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue("Check Work".to_string()),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("submitLabelNoCorrectness", StateVarVariant::String(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue("Submit Response".to_string()),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("hidden", StateVarVariant::Boolean(Default::default()));

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        state_var_definitions.insert("fixed", FIXED_DEFAULT_DEFINITION());

        // state_var_definitions.insert("titleChildName", StateVarVariant::String(StateVarDefinition {
        //     determine_state_var_from_dependencies: |_| SetValue("Submit Response"),
        //     for_renderer: true,
        //     ..Default::default()
        // })); 

        
        state_var_definitions.insert("title", StateVarVariant::String(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue("".to_string()),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("level", StateVarVariant::Number(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue(0.0),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("justSubmitted", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue(true),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("showCorrectness", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue(true),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("creditAchieved", StateVarVariant::Number(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue(1.0),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("createSubmitAllButton", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue(false),
            for_renderer: true,
            ..Default::default()
        }));


        state_var_definitions.insert("suppressAnswerSubmitButtons", StateVarVariant::Boolean(StateVarDefinition {
            determine_state_var_from_dependencies: |_| SetValue(false),
            for_renderer: true,
            ..Default::default()
        }));        

        




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


#[derive(Clone)]
pub struct MyComponentDefinition;

impl ComponentDefinition for MyComponentDefinition {
    fn attribute_definitions(&self) -> &'static HashMap<AttributeName, AttributeDefinition> {
        &MY_ATTRIBUTE_DEFINITIONS
    }

    fn state_var_definitions(&self) -> &'static HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS
    }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![]
    }

    fn should_render_children(&self) -> bool {
        true
    }



    fn empty_attribute_data(&self) -> Box<dyn AttributeData> {
        Box::new(MyAttributeData { ..Default::default() })
    }

    fn new_stale_component_state_vars(&self) -> Box<dyn ComponentStateVars> {

        Box::new(MyStateVars {
            submit_label: StateVar::new(StateVarValueType::String),
            submit_label_no_correctness: StateVar::new(StateVarValueType::String),
            hidden: StateVar::new(StateVarValueType::Boolean),
            disabled: StateVar::new(StateVarValueType::Boolean),
            fixed: StateVar::new(StateVarValueType::Boolean),
            // title_child_name: StateVar::new(StateVarValueType::),
            title: StateVar::new(StateVarValueType::String),
            level: StateVar::new(StateVarValueType::Number),
            just_submitted: StateVar::new(StateVarValueType::Boolean),
            show_correctness: StateVar::new(StateVarValueType::Boolean),
            credit_achieved: StateVar::new(StateVarValueType::Number),
            create_submit_all_button: StateVar::new(StateVarValueType::Boolean),
            suppress_answer_submit_buttons: StateVar::new(StateVarValueType::Boolean), 

        })
    }

}

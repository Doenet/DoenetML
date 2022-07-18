use std::collections::HashMap;

use core_derive::ComponentLike;

use lazy_static::lazy_static;

use crate::state_variables::*;

use crate::{ObjectTraitName, ComponentLike,
ComponentSpecificBehavior, ComponentChild};

use crate::state_var::{StateVar, StateVarValueType, EssentialStateVar};



#[derive(Debug, ComponentLike)]
pub struct Document {
    pub name: String,
    pub parent: Option<String>,
    pub children: Vec<ComponentChild>,

    // Note that this is not behind a RefCell, so we can't change the hashmap
    // once the component is created
    pub essential_state_vars: HashMap<StateVarName, EssentialStateVar>,

    // State variables
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


impl ComponentSpecificBehavior for Document {

    fn state_variable_instructions(&self) -> &'static HashMap<StateVarName, StateVarVariant> {
        &MY_STATE_VAR_DEFINITIONS
    }

    fn get_state_var(&self, name: StateVarName) -> Option<&StateVar> {
        match name {
            "submitLabel" => Some(&self.submit_label),
            "submitLabelNoCorrectness" => Some(&self.submit_label_no_correctness),
            "hidden" => Some(&self.hidden),
            "disabled" => Some(&self.disabled),
            "fixed" => Some(&self.fixed),
            // "titleChildName" => Some(&self.title_child_name),
            "title" => Some(&self.title),
            "level" => Some(&self.level),
            "justSubmitted" => Some(&self.just_submitted),
            "showCorrectness" => Some(&self.show_correctness),
            "creditAchieved" => Some(&self.credit_achieved),
            "createSubmitAllButton" => Some(&self.create_submit_all_button),
            "suppressAnswerSubmitButtons" => Some(&self.suppress_answer_submit_buttons),
 
            _ => None,
        }        
    }
    
    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar> {
        &self.essential_state_vars
    }    

    fn get_component_type(&self) -> &'static str { "document" }

    fn should_render_children(&self) -> bool { true }

    fn get_trait_names(&self) -> Vec<ObjectTraitName> {
        vec![]
    }

    fn action_names(&self) -> Vec<&'static str> { vec![] }


}



impl Document {
    pub fn create(name: String, parent: Option<String>, children: Vec<ComponentChild>, essential_state_vars: HashMap<StateVarName, EssentialStateVar>) -> Box<dyn ComponentLike> {
        Box::new(Document {
            name,
            parent,
            children,

            essential_state_vars,
            
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

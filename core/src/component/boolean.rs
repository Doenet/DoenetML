use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Boolean(StateVarDefinition {
        

            return_dependency_instructions: |_| {
                let child_instruct = DependencyInstruction::Child(ChildDependencyInstruction {
                    desired_children: vec![ObjectTraitName::TextLike],
                    desired_state_vars: vec!["value"],
                });

                HashMap::from([("all_my_children", child_instruct)])
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let bool_child_value = dependency_values.dep_value("all_my_children")?
                    .filter_include_component_type("boolean")
                    .has_zero_or_one_elements()?
                    .is_bool_if_exists()?;

                if let Some(bool_val) = bool_child_value {

                    Ok(SetValue(bool_val))


                } else {

                    // This will break if there are more than one bool children
                    let textlike_children = dependency_values.dep_value("all_my_children")?
                    .are_strings_if_non_empty()?;

                    let mut concatted_text = String::from("");
                    for textlike_child in textlike_children {
                        concatted_text.push_str(&textlike_child);
                    }

                    let trimmed_text = concatted_text.trim().to_lowercase();
                    
                    if trimmed_text == "true" {
                        Ok(SetValue(true))
                    } else {
                        Ok(SetValue(false))
                    }

                }



            },
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("text", TEXT_DEFAULT_DEFINITION());


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
        vec![ObjectTraitName::TextLike]
    }

    fn should_render_children(&self) -> bool {
        false
    }

    fn primary_input_state_var(&self) -> Option<StateVarName> {
        Some("value")
    }

}

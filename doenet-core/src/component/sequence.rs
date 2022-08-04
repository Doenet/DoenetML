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

        state_var_definitions.insert("value", StateVarVariant::NumberArray(StateVarArrayDefinition {
            return_array_dependency_instructions: |_| {
                HashMap::from([(
                    "sv_from", DependencyInstruction::StateVar(StateVarDependencyInstruction {
                        component_name: None,
                        state_var: StateVarReference::Basic("from"),
                    })
                )])
            },

            determine_element_from_dependencies: |index, dependency_values| {
                let from: f64 = dependency_values.dep_value("sv_from")?
                    .has_exactly_one_element()?
                    .into_number()?;

                Ok(SetValue(from + index as f64))
            },


            return_size_dependency_instructions: |_| {
                HashMap::from([
                    ("sv_from", DependencyInstruction::StateVar(StateVarDependencyInstruction {
                        component_name: None,
                        state_var: StateVarReference::Basic("from"),
                    })),
                    ("sv_to", DependencyInstruction::StateVar(StateVarDependencyInstruction {
                        component_name: None,
                        state_var: StateVarReference::Basic("to"),
                    })
                )])
            },

            determine_size_from_dependencies: |dependency_values| {
                // TODO: from and to should be integers

                let from = dependency_values.dep_value("sv_from")?
                    .has_exactly_one_element()?
                    .into_number()?;
                let to = dependency_values.dep_value("sv_to")?
                    .has_exactly_one_element()?
                    .into_number()?;

                Ok(SetValue((to - from + 1.0) as usize))
            },

            ..Default::default()
        }));


        state_var_definitions.insert("from", definition_from_attribute!("from", Number, 1.0));

        state_var_definitions.insert("to", definition_from_attribute!("to", Number, 1.0));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("disabled", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("to", AttributeDefinition::Component("number"));

        attribute_definitions.insert("from", AttributeDefinition::Component("number"));

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
        vec![ObjectTraitName::TextLike, ObjectTraitName::NumberLike]
    }

    fn should_render_children(&self) -> bool {
        false
    }

}

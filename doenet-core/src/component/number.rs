use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::state_variables::*;
use crate::base_definitions::*;

use super::*;

use crate::ComponentProfile;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("value", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {

                HashMap::from([
                    ("children", DependencyInstruction::Child {
                        desired_profiles: vec![ComponentProfile::Number, ComponentProfile::Text],
                    }),
                ])
            },


            determine_state_var_from_dependencies: |dependency_values| {
                let (children, _) = dependency_values.dep_value("children")?;

                DETERMINE_NUMBER(children.clone()).map(|x| SetValue(x))
            },

            request_dependencies_to_update_value: |desired_value, dependency_sources| {
                let children_sources: Vec<DependencySource> = dependency_sources.get("children").unwrap().to_vec();
                HashMap::from([
                    ("children", DETERMINE_NUMBER_DEPENDENCIES(desired_value, children_sources))
                ])
            },

            ..Default::default()
        }));

        state_var_definitions.insert("text", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                let instruction = DependencyInstruction::StateVar {
                    component_name: None,
                    state_var: StateVarSlice::Single(StateRef::Basic("value")),
                };
            
                HashMap::from([("value_sv", instruction)]) 
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let value: Option<f64> = dependency_values.dep_value("value_sv")?
                    .has_zero_or_one_elements()?
                    .into_if_exists()?;

                Ok(SetValue(
                    value.map_or("".to_string(), |val| val.to_string())
                ))

            },

            ..Default::default()
        }));

        state_var_definitions.insert("propIndex", StateVarVariant::Integer(StateVarDefinition {
            
            return_dependency_instructions: |_| {
                panic!("propIndex dependencyInstructions should never be called");
            },

            determine_state_var_from_dependencies: |dependency_values| {
                let (values, _) = dependency_values.dep_value("values")?;

                DETERMINE_INTEGER(values.clone()).map(|x| SetValue(x))
            },

            ..Default::default()
        }));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hide",
            "disabled",
        ],

        primary_input_state_var: Some("value"),

        component_profiles: vec![
            (ComponentProfile::Number, "value"),
            (ComponentProfile::Text, "value"),
        ],
                
        ..Default::default()
    };
}

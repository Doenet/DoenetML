use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::state_variables::*;
use crate::base_definitions::*;

use super::*;


lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value", StateVarVariant::NumberArray(StateVarArrayDefinition {


            return_array_dependency_instructions: |_| {
                HashMap::from([(
                    "sv_from", DependencyInstruction::StateVar {
                        component_name: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("from")),
                    }
                )])
            },

            determine_element_from_dependencies: |index, dependency_values| {
                let from = dependency_values.dep_value("sv_from")?
                    .has_exactly_one_element()?
                    .into_number()?;

                Ok(SetValue(from + index as f64))
            },


            return_size_dependency_instructions: |_| {
                HashMap::from([
                    ("sv_from", DependencyInstruction::StateVar {
                        component_name: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("from")),
                    }),
                    ("sv_to", DependencyInstruction::StateVar {
                        component_name: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("to")),
                    })
                ])
            },

            determine_size_from_dependencies: |dependency_values| {
                // TODO: from and to should be integers

                let from = dependency_values.dep_value("sv_from")?
                    .has_exactly_one_element()?
                    .into_number()?;
                let to = dependency_values.dep_value("sv_to")?
                    .has_exactly_one_element()?
                    .into_number()?;

                let size = std::cmp::max((to - from + 1.0) as i64, 0);
                Ok(SetValue(size as usize))
            },

            ..Default::default()
        }));


        state_var_definitions.insert("text", StateVarVariant::String(StateVarDefinition {
            // Text sv is just to be used by the renderer
            for_renderer: true,

            return_dependency_instructions: |_| {
                HashMap::from([
                    ("sv_value", DependencyInstruction::StateVar {
                        component_name: None,
                        state_var: StateVarSlice::Array("value"),
                    })
                ])
            },

            determine_state_var_from_dependencies: |dependency_values| {
                let value = dependency_values.dep_value("sv_value")?
                    .into_number_list()?;

                let mut text = String::new();
                for element_val in value {
                    text.push_str(&format!("{}, ", element_val));
                }
                // Remove the last ", "
                text.pop();
                text.pop();

                Ok(SetValue(text))
            },

            ..Default::default()
        }));


        state_var_definitions.insert("from", number_definition_from_attribute!("from", 1.0));

        state_var_definitions.insert("to", number_definition_from_attribute!("to", 5.0));

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
            "to",
            "from",
        ],

        renderer_type: RendererType::Special("text"),

        // primary_output_traits: || vec![PrimaryOutputTrait::TextLike, PrimaryOutputTrait::NumberLike],
        
        ..Default::default()
    };
}

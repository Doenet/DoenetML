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
                        component_ref: None,
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
                        component_ref: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("from")),
                    }),
                    ("sv_to", DependencyInstruction::StateVar {
                        component_ref: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("to")),
                    })
                ])
            },

            determine_size_from_dependencies: |dependency_values| {

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

        state_var_definitions.insert("text", StateVarVariant::StringArray(StateVarArrayDefinition {


            return_array_dependency_instructions: |_| {
                HashMap::from([(
                    "corresponding_value", DependencyInstruction::CorrespondingElements {
                        component_ref: None,
                        array_state_var_name: "value",
                    }
                )])
            },

            determine_element_from_dependencies: |_, dependency_values| {
                let my_value: f64 = dependency_values.dep_value("corresponding_value")?
                    .has_exactly_one_element()?
                    .into_number()?;
                let my_text = my_value.to_string();

                Ok(SetValue(my_text))
            },


            return_size_dependency_instructions: |_| {
                HashMap::from([
                    ("sv_value_size", DependencyInstruction::StateVar {
                        component_ref: None,
                        state_var: StateVarSlice::Single(StateRef::SizeOf("value")),
                    }),
                ])
            },

            determine_size_from_dependencies: |dependency_values| {
                let size = dependency_values.dep_value("sv_value_size")?
                    .has_exactly_one_element()?
                    .into_integer()?;

                Ok(SetValue(size as usize))
            },

            ..Default::default()
        }));

        state_var_definitions.insert("propIndex", StateVarVariant::Integer(StateVarDefinition {
            ..Default::default()
        }));

        state_var_definitions.insert("from", number_definition_from_attribute!("from", 1.0));

        state_var_definitions.insert("to", number_definition_from_attribute!("to", 0.0));

        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}

fn member_state_var<'a>(
    index: usize,
    state_var_slice: &'a StateVarSlice,
    resolver: &'a dyn Fn(&'a StateRef) -> Option<StateVarValue>,
) -> Option<StateVarSlice> {

    let slice = match state_var_slice {
        StateVarSlice::Single(StateRef::Basic("value")) => {
            // resolve size before giving value
            let _ = resolver(&StateRef::SizeOf("value"));
            StateVarSlice::Single(StateRef::ArrayElement("value", index))
        }
        StateVarSlice::Single(StateRef::Basic("text")) => {
            let _ = resolver(&StateRef::SizeOf("text"));
            StateVarSlice::Single(StateRef::ArrayElement("text", index))
        },
        _ => state_var_slice.clone(),
    };

    Some(slice)
}

lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "sequence",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        replacement_components: Some(ReplacementComponents::Batch(BatchDefinition {
            member_definition: &super::number::MY_COMPONENT_DEFINITION,
            size: StateRef::SizeOf("value"),
            member_state_var,
        })),

        attribute_names: vec![
            "hide",
            "disabled",
            "to",
            "from",
        ],

        component_profiles: vec![
            (ComponentProfile::Number, "value"),
            (ComponentProfile::Text, "value"),
        ],

        // primary_output_traits: || vec![PrimaryOutputTrait::TextLike, PrimaryOutputTrait::NumberLike],
        
        ..Default::default()
    };
}

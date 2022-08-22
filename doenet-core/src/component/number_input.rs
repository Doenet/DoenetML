use std::collections::HashMap;

use lazy_static::lazy_static;


use super::*;
use crate::state_variables::*;
use crate::base_definitions::*;


use crate::ComponentProfile;



lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("value", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_|
                HashMap::from([
                    ("essential", DependencyInstruction::Essential),
                    ("immediate", DependencyInstruction::StateVar {
                        component_ref: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("immediateValue")),
                    }),
                    ("sync", DependencyInstruction::StateVar {
                        component_ref: None,
                        state_var: StateVarSlice::Single(StateRef::Basic("syncImmediateValue")),
                    }),
                ]),
            determine_state_var_from_dependencies: |dependency_values| {
                let essential_value = dependency_values.dep_value("essential")?
                    .has_exactly_one_element()?
                    .into_number()?;
                let immediate_value = dependency_values.dep_value("immediate")?
                    .has_exactly_one_element()?
                    .into_string()?;
                let sync_values = dependency_values.dep_value("sync")?
                    .has_exactly_one_element()?
                    .into_bool()?;

                let value: f64 =
                    if sync_values {
                        immediate_value.parse().unwrap_or(0.0)
                    } else {
                        essential_value
                    };
                Ok(SetValue(value))
            } ,
            request_dependencies_to_update_value: |desired_value, sources| {
                HashMap::from([
                    ("essential", Ok(vec![
                        DependencyValue {
                            source: sources.get("essential").unwrap().first().unwrap().0.clone(),
                            value: desired_value.clone().into(),
                        }
                    ])),
                    ("sync", Ok(vec![
                        DependencyValue {
                            source: sources.get("sync").unwrap().first().unwrap().0.clone(),
                            value: StateVarValue::Boolean(true),
                        }
                    ])),
                    ("immediate", Ok(vec![
                        DependencyValue {
                            source: sources.get("immediate").unwrap().first().unwrap().0.clone(),
                            value: desired_value.to_string().into(),
                        }
                    ])),
                ])
            },
            ..Default::default()
        }));

        state_var_definitions.insert("immediateValue", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,
            return_dependency_instructions: USE_ESSENTIAL_DEPENDENCY_INSTRUCTION,
            determine_state_var_from_dependencies: DETERMINE_FROM_ESSENTIAL,
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            ..Default::default()
        }));

        state_var_definitions.insert("syncImmediateValue", StateVarVariant::Boolean(StateVarDefinition {
            return_dependency_instructions: USE_ESSENTIAL_DEPENDENCY_INSTRUCTION,
            determine_state_var_from_dependencies: DETERMINE_FROM_ESSENTIAL,
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            ..Default::default()
        }));

        // TODO: use raw string value so that immediate value is a number
        //
        // state_var_definitions.insert("rawStringValue", StateVarVariant::String(StateVarDefinition {
        //     for_renderer: true,
        //     return_dependency_instructions: USE_ESSENTIAL_DEPENDENCY_INSTRUCTION,
        //     determine_state_var_from_dependencies: DETERMINE_FROM_ESSENTIAL,
        //     request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
        //     ..Default::default()
        // }));




        state_var_definitions.insert("expanded", StateVarVariant::Boolean(StateVarDefinition {
            for_renderer: true,
            determine_state_var_from_dependencies: |_| Ok(SetValue(false)),
            ..Default::default()
            
        }));

        state_var_definitions.insert("size", StateVarVariant::Number(StateVarDefinition {


            determine_state_var_from_dependencies: |_| {
                Ok(SetValue(10.0))
            },
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("width", StateVarVariant::Number(StateVarDefinition {
            for_renderer: true,
            determine_state_var_from_dependencies: |_| Ok(SetValue(600.0)),
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

        renderer_type: RendererType::Special("textInput"),

        component_profiles: vec![
            (ComponentProfile::Number, "value"),
            // (ComponentProfile::Text, "value"),
        ],
        
        action_names: || vec!["updateImmediateValue", "updateValue"],

        on_action: |action_name, args, resolve_and_retrieve_state_var| {
            match action_name {
                "updateImmediateValue" => {
                    // Note: the key here is whatever the renderers call the new value
                    let new_val = args.get("text").expect("No text argument");

                    vec![
                        (StateRef::Basic("immediateValue"), new_val.clone()),
                        (StateRef::Basic("syncImmediateValue"), StateVarValue::Boolean(false)),
                    ]
                },

                "updateValue" => {

                    let immediate_value: String =
                        resolve_and_retrieve_state_var(&StateRef::Basic("immediateValue")).unwrap().try_into()
                        .expect("Immediate value should have been a string");

                    let value = immediate_value.parse().unwrap_or(0.0);

                    let new_val = StateVarValue::Number(value);

                    vec![
                        (StateRef::Basic("value"), new_val),
                        (StateRef::Basic("syncImmediateValue"), StateVarValue::Boolean(true)),
                    ]
                }

                _ => panic!("Unknown action '{}' called on numberInput", action_name)
            }
        },

        ..Default::default()
    };
}

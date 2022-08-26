use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::state_variables::*;
use crate::base_definitions::*;

use super::*;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("p1", number_array_definition_from_attribute!("p1", 0.0, 2));
        state_var_definitions.insert("p2", number_array_definition_from_attribute!("p2", 1.0, 2));

        // TODO: combine into multi-dim array?
        state_var_definitions.insert("numericalPoints", StateVarVariant::NumberArray(StateVarArrayDefinition {

            for_renderer: true,

            return_array_dependency_instructions: |_| {
                HashMap::from([
                    ("p1", DependencyInstruction::StateVar {
                        component_ref: None,
                        state_var: StateVarSlice::Array("p1"),
                    }),
                    ("p2", DependencyInstruction::StateVar {
                        component_ref: None,
                        state_var: StateVarSlice::Array("p2"),
                    }),
                ])
            },

            determine_element_from_dependencies: |index, dependency_values| {
                let p1 = dependency_values.dep_value("p1")?
                    .into_number_list()?;
                let p2 = dependency_values.dep_value("p2")?
                    .into_number_list()?;
                let my_value = match index {
                    0 => p1[0],
                    1 => p1[1],
                    2 => p2[0],
                    3 => p2[1],
                    i => return Err(format!("wrong line index {i}"))
                };

                Ok( SetValue( my_value ) )
            },

            determine_size_from_dependencies: |_| {
                Ok( SetValue( 4 ) )
            },

            ..Default::default()
        }));

        state_var_definitions.insert("latex", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                HashMap::from([
                    ("p1", DependencyInstruction::StateVar{
                        component_ref: None,
                        state_var: StateVarSlice::Array("p1"),
                    }),
                    ("p2", DependencyInstruction::StateVar{
                        component_ref: None,
                        state_var: StateVarSlice::Array("p2"),
                    }),
                ])
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let p1 = dependency_values.dep_value("p1")?
                    .into_number_list()?;
                let p2 = dependency_values.dep_value("p2")?
                    .into_number_list()?;
                let x1 = p1.get(0).unwrap();
                let y1 = p1.get(1).unwrap();
                let x2 = p2.get(0).unwrap();
                let y2 = p2.get(1).unwrap();
                let set_value = format!("({}, {})({}, {})", x1, y1, x2, y2);

                Ok( SetValue( set_value ) )
            },
            ..Default::default()
        }));

        state_var_definitions.insert("selectedStyle", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            determine_state_var_from_dependencies: |_| {

                let default_style = r##"{
                        "lineColor": "#648FFF",
                        "lineColorWord": "blue",
                        "lineOpacity": 0.7,
                        "lineWidth": 4,
                        "lineWidthWord": "thick",
                        "lineStyle": "solid",
                        "lineStyleWord": "",
                        "markerColor": "#648FFF",
                        "markerColorWord": "blue",
                        "markerStyle": "circle",
                        "markerStyleWord": "point",
                        "markerSize": 3,
                        "fillColor": "none",
                        "fillColorWord": "none",
                        "fillOpacity": 0.3
                    }"##;

                Ok( SetValue( default_style.to_string() ) )
            },
            ..Default::default()
        }));

        state_var_definitions.insert("draggable", boolean_definition_from_attribute!("draggable", true));

        // Label
        state_var_definitions.insert("label", string_definition_from_attribute!("label", ""));

        // Graphical
        state_var_definitions.insert("showLabel", boolean_definition_from_attribute!("showLabel", true));
        state_var_definitions.insert("applyStyleToLabel", boolean_definition_from_attribute!("applyStyleToLabel", true));
        state_var_definitions.insert("layer", integer_definition_from_attribute!("layer", 0));

        // Base
        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "line",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "p1",
            "p2",

            "draggable",

            "showLabel",
            "applyStyleToLabel",
            "layer",

            "hide",
            "disabled",
        ],

        component_profiles: vec![
            (ComponentProfile::Text, "latex")
        ],

        action_names: || vec!["moveLine", "switchLine", "lineClicked"],

        on_action: |action_name, args, _| {
            match action_name {
                "moveLine" => {
                    let p1 = args.get("point1coords").expect("No p1 argument");
                    let p2 = args.get("point2coords").expect("No p2 argument");
                    // let _transient = args.get("transient").expect("No transient argument").first().unwrap();

                    crate::utils::log!("points: {:?} {:?}", p1, p2);

                    vec![
                        (StateRef::ArrayElement("p1", 2), p1[1].clone()),
                        (StateRef::ArrayElement("p1", 1), p1[0].clone()),
                        (StateRef::ArrayElement("p2", 2), p2[1].clone()),
                        (StateRef::ArrayElement("p2", 1), p2[0].clone()),
                    ]
                },
                "switchLine" => {
                    vec![]
                }
                "lineClicked" => {
                    vec![]
                }

                _ => panic!("Unknown action '{}' called on point", action_name)
            }
        },

        ..Default::default()
    };
}

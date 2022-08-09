use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;



lazy_static! {
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {

        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();

        state_var_definitions.insert("coords", StateVarVariant::NumberArray(StateVarArrayDefinition {

            return_array_dependency_instructions: |_| {
                HashMap::from([
                    ("essential", DependencyInstruction::Essential),
                ])
            },

            determine_element_from_dependencies: |_, dependency_values| {
                let essential = dependency_values.dep_value("essential")?;
                let essential = essential.has_zero_or_one_elements()?;
                let set_value = match essential.0 {
                    Some(dep_value) => {
                        f64::try_from(dep_value.value.clone()).map_err(|e| format!("{:#?}", e))?
                    },
                    None => f64::default(),
                };

                Ok( SetValue( set_value ) )
            },

            determine_size_from_dependencies: |_| Ok(SetValue(2)),

            request_element_dependencies_to_update_value: |_, desired_value| {
                HashMap::from([
                    ("essential", vec![
                        DependencyValue {
                            component_type: "essential_data",
                            state_var_name: "",
                            value: desired_value.into(),
                        }
                    ])
                ])
            },

            initial_essential_element_value: Some(0.0),

            ..Default::default()
        }));

        state_var_definitions.insert("numericalXs", StateVarVariant::NumberArray(StateVarArrayDefinition {

            for_renderer: true,

            return_array_dependency_instructions: |_| {
                HashMap::from([
                    ("coords", DependencyInstruction::StateVar {
                        component_name: None,
                        state_var: StateVarGroup::Array("coords"),
                    }),
                ])
            },

            determine_element_from_dependencies: |index, dependency_values| {
                let coords = dependency_values.dep_value("coords")?
                    .into_number_list()?;
                let my_coord = *coords.get(index).unwrap();

                Ok( SetValue( my_coord ) )
            },

            return_size_dependency_instructions: |_| {
                HashMap::from([
                    ("dimensions", DependencyInstruction::StateVar {
                        component_name: None,
                        state_var: StateVarGroup::Single(StateVarReference::SizeOf("coords")),
                    }),
                ])
            },

            determine_size_from_dependencies: |dependency_values| {
                let dim = dependency_values.dep_value("dimensions")?
                    .has_exactly_one_element()?
                    .into_integer()?;
                Ok( SetValue( dim as usize ) )
            },

            ..Default::default()
        }));

        state_var_definitions.insert("latex", StateVarVariant::String(StateVarDefinition {
            for_renderer: true,

            return_dependency_instructions: |_| {
                HashMap::from([
                    ("coords", DependencyInstruction::StateVar{
                        component_name: None,
                        state_var: StateVarGroup::Array("coords"),
                    }),
                ])
            },

            determine_state_var_from_dependencies: |dependency_values| {

                let coords = dependency_values.dep_value("coords")?
                    .into_number_list()?;
                let x = coords.get(0).unwrap();
                let y = coords.get(0).unwrap();
                let set_value = format!("({}, {})", x, y);

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


        state_var_definitions.insert("draggable", boolean_definition_from_attribute!("draggable", true, false));

        state_var_definitions.insert("labelPosition", string_definition_from_attribute!("labelPosition", "upperright", false));

        state_var_definitions.insert("showCoordsWhenDragging", boolean_definition_from_attribute!("showCoordsWhenDragging", true, false));


        state_var_definitions.insert("showLabel", boolean_definition_from_attribute!("showLabel", true, false));

        state_var_definitions.insert("applyStyleToLabel", boolean_definition_from_attribute!("applyStyleToLabel", true, false));

        state_var_definitions.insert("layer", integer_definition_from_attribute!("layer", 0, false));

        state_var_definitions.insert("label", string_definition_from_attribute!("label", "", false));

        state_var_definitions.insert("labelHasLatex", boolean_definition_from_attribute!("layer", false, false));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "draggable",
            "labelPosition",
            "showCoordsWhenDragging",
            "showLabel",
            "applyStyleToLabel",
            "layer",
            "label",
            "labelHasLatex",

            "hide",
            "disabled",
        ],

        action_names: || vec!["movePoint", "switchPoint", "pointClicked"],

        on_action: |action_name, args, _| {
            match action_name {
                "movePoint" => {
                    let x = args.get("x").expect("No x argument");
                    let y = args.get("y").expect("No y argument");
                    // let z = args.get("z").expect("No z argument");

                    HashMap::from([
                        (StateVarReference::ArrayElement("coords", 0), x.clone()),
                        (StateVarReference::ArrayElement("coords", 1), y.clone()),
                    ])
                },
                "switchPoint" => {

                    HashMap::from([
                    ])
                }
                "pointClicked" => {

                    HashMap::from([
                    ])
                }

                _ => panic!("Unknown action '{}' called on point", action_name)
            }
        },

        ..Default::default()
    };
}

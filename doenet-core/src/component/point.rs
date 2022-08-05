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


        state_var_definitions.insert("draggable", definition_from_attribute!("draggable", Boolean, true));

        state_var_definitions.insert("labelPosition", definition_from_attribute!("labelPosition", String, "upperright"));

        state_var_definitions.insert("showCoordsWhenDragging", definition_from_attribute!("showCoordsWhenDragging", Boolean, true));


        state_var_definitions.insert("showLabel", definition_from_attribute!("showLabel", Boolean, true));

        state_var_definitions.insert("applyStyleToLabel", definition_from_attribute!("applyStyleToLabel", Boolean, false));

        state_var_definitions.insert("layer", definition_from_attribute!("layer", Integer, 0));

        state_var_definitions.insert("label", definition_from_attribute!("label", String, ""));

        state_var_definitions.insert("labelHasLatex", definition_from_attribute!("layer", Boolean, false));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("draggable", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("labelPosition", AttributeDefinition::Component("text"));

        attribute_definitions.insert("showCoordsWhenDragging", AttributeDefinition::Component("boolean"));


        attribute_definitions.insert("showLabel", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("applyStyleToLabel", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("layer", AttributeDefinition::Component("number"));

        attribute_definitions.insert("label", AttributeDefinition::Component("text"));

        attribute_definitions.insert("labelHasLatex", AttributeDefinition::Component("boolean"));


        attribute_definitions.insert("hide", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("disabled", AttributeDefinition::Component("boolean"));

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
        vec![ObjectTraitName::Graphical]
    }

    fn should_render_children(&self) -> bool {
        false
    }

    fn action_names(&self) -> Vec<&'static str> {
        vec!["movePoint", "switchPoint", "pointClicked"]
    }

    fn on_action<'a>(
        &self,
        action_name: &str,
        args: HashMap<String, StateVarValue>,
        _: &dyn Fn(&'a StateVarReference) -> StateVarValue
    ) -> HashMap<StateVarReference, StateVarValue> {

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
    }
}

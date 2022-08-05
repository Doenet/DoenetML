use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::prelude::*;
use crate::state_variables::*;
use super::*;

use crate::ObjectTraitName;


#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct Descendant {
    component_name: String,
    component_type: ComponentType,
}

lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        state_var_definitions.insert("graphicalDescendants", StateVarVariant::String(StateVarDefinition {
            return_dependency_instructions: |_| {
                    HashMap::from([
                    ("descendants", DependencyInstruction::Child {
                        desired_children: vec![ObjectTraitName::Graphical],
                        desired_state_vars: vec![],
                    })
                ])
            },
            determine_state_var_from_dependencies: |dependency_values| {
                let descendants = dependency_values.dep_value("descendants")?;
                let descendants: Vec<Descendant> = descendants.0
                    .iter()
                    .map(|dv| Descendant {
                        component_name: String::new(),
                        component_type: dv.component_type,
                    })
                    .collect();
                Ok(SetValue(serde_json::to_string(&descendants).unwrap()))
            },
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("width", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([
                // ("size", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("size")),
                // })
            ]),
            determine_state_var_from_dependencies: |_| Ok(SetValue(10.0)),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("aspectRatio", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([
                // ("xscale", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("xscale")),
                // }),
                // ("yscale", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("yscale")),
                // }),
            ]),
            determine_state_var_from_dependencies: |_| Ok(SetValue(1.0)),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("xmin", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([
                ("essential", DependencyInstruction::Essential),
                ("attribute", DependencyInstruction::Attribute{ attribute_name: "xmin" }),
                // ("aspectRatio", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("aspectRatio")),
                // }),
            ]),
            determine_state_var_from_dependencies: determine_from_essential_or_attribute!(-10),
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            for_renderer: true,
            ..Default::default()
        }));
        state_var_definitions.insert("ymin", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([
                ("essential", DependencyInstruction::Essential),
                ("attribute", DependencyInstruction::Attribute{ attribute_name: "ymin" }),
                // ("aspectRatio", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("aspectRatio")),
                // }),
            ]),
            determine_state_var_from_dependencies: determine_from_essential_or_attribute!(-10),
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            initial_essential_value: -10.0,
            for_renderer: true,
            ..Default::default()
        }));
        state_var_definitions.insert("xmax", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([
                ("essential", DependencyInstruction::Essential),
                ("attribute", DependencyInstruction::Attribute{ attribute_name: "xmax" }),
                // ("aspectRatio", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("aspectRatio")),
                // }),
            ]),
            determine_state_var_from_dependencies: determine_from_essential_or_attribute!(10),
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            initial_essential_value: 10.0,
            for_renderer: true,
            ..Default::default()
        }));
        state_var_definitions.insert("ymax", StateVarVariant::Number(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([
                ("essential", DependencyInstruction::Essential),
                ("attribute", DependencyInstruction::Attribute{ attribute_name: "ymax" }),
                // ("aspectRatio", DependencyInstruction::StateVar {
                //     component_name: None,
                //     state_var: StateVarGroup::Single(StateVarReference::Basic("aspectRatio")),
                // }),
            ]),
            determine_state_var_from_dependencies: determine_from_essential_or_attribute!(10),
            request_dependencies_to_update_value: REQUEST_ESSENTIAL_TO_UPDATE,
            initial_essential_value: 10.0,
            for_renderer: true,
            ..Default::default()
        }));
        
        state_var_definitions.insert("grid", StateVarVariant::String(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([

            ]),
            determine_state_var_from_dependencies: |_| Ok(SetValue("none".to_string())),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("displayMode", definition_from_attribute!("displayMode", String, "block"));

        state_var_definitions.insert("horizontalAlign", definition_from_attribute!("horizontalAlign", String, "center"));

        state_var_definitions.insert("displayXAxis", definition_from_attribute!("displayXAxis", Boolean, true));

        state_var_definitions.insert("displayYAxis", definition_from_attribute!("displayYAxis", Boolean, true));

        state_var_definitions.insert("displayXAxisTickLabels", definition_from_attribute!("displayXAxisTickLabels", Boolean, true));

        state_var_definitions.insert("displayYAxisTickLabels", definition_from_attribute!("displayYAxisTickLabels", Boolean, true));

        state_var_definitions.insert("xlabel", definition_from_attribute!("xlabel", String, "x"));

        state_var_definitions.insert("xlabelPosition", definition_from_attribute!("xlabelPosition", String, "right"));

        state_var_definitions.insert("xTickScaleFactor", definition_from_attribute!("xTickScaleFactor", Number, 1.0));

        state_var_definitions.insert("ylabel", definition_from_attribute!("ylabel", String, "y"));

        state_var_definitions.insert("ylabelPosition", definition_from_attribute!("ylabelPosition", String, "top"));

        state_var_definitions.insert("ylabelAlignment", definition_from_attribute!("ylabelAlignment", String, "left"));

        state_var_definitions.insert("yTickScaleFactor", definition_from_attribute!("yTickScaleFactor", Number, 1.0));

        state_var_definitions.insert("showNavigation", definition_from_attribute!("showNavigation", Boolean, true));

        state_var_definitions.insert("fixAxes", definition_from_attribute!("fixAxes", Boolean, false));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_ATTRIBUTE_DEFINITIONS: HashMap<AttributeName, AttributeDefinition> = {
        let mut attribute_definitions = HashMap::new();

        attribute_definitions.insert("displayMode", AttributeDefinition::Component("string"));

        attribute_definitions.insert("horizontalAlign", AttributeDefinition::Component("text"));

        attribute_definitions.insert("displayXAxis", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("displayYAxis", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("displayXAxisTickLabels", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("displayYAxisTickLabels", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("xlabel", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("xlabelPosition", AttributeDefinition::Component("text"));

        attribute_definitions.insert("xTickScaleFactor", AttributeDefinition::Component("number"));

        attribute_definitions.insert("ylabel", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("ylabelPosition", AttributeDefinition::Component("text"));

        attribute_definitions.insert("ylabelAlignment", AttributeDefinition::Component("text"));

        attribute_definitions.insert("yTickScaleFactor", AttributeDefinition::Component("number"));

        attribute_definitions.insert("showNavigation", AttributeDefinition::Component("boolean"));

        attribute_definitions.insert("fixAxes", AttributeDefinition::Component("boolean"));


        attribute_definitions.insert("xmin", AttributeDefinition::Component("number"));

        attribute_definitions.insert("ymin", AttributeDefinition::Component("number"));

        attribute_definitions.insert("xmax", AttributeDefinition::Component("number"));

        attribute_definitions.insert("ymax", AttributeDefinition::Component("number"));


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
        vec![]
    }

    fn should_render_children(&self) -> bool {
        true
    }

    fn action_names(&self) -> Vec<&'static str> {
        vec!["changeAxisLimits"]
    }

    fn on_action<'a>(
        &self,
        action_name: &str,
        args: HashMap<String, StateVarValue>,
        _: &dyn Fn(&'a StateVarReference) -> StateVarValue
    ) -> HashMap<StateVarReference, StateVarValue> {

        match action_name {
            "changeAxisLimits" => {
                // Note: the key here is whatever the renderers call the new value
                let xmin = args.get("xmin").expect("missing bound argument").clone().into_number().unwrap();
                let xmax = args.get("xmax").expect("missing bound argument").clone().into_number().unwrap();
                let ymin = args.get("ymin").expect("missing bound argument").clone().into_number().unwrap();
                let ymax = args.get("ymax").expect("missing bound argument").clone().into_number().unwrap();

                HashMap::from([
                    (StateVarReference::Basic("xmin"), xmin),
                    (StateVarReference::Basic("xmax"), xmax),
                    (StateVarReference::Basic("ymin"), ymin),
                    (StateVarReference::Basic("ymax"), ymax),
                ])
            },

            _ => panic!("Unknown action '{}' called on graph", action_name)
        }
    }
}

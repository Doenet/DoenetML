use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::state_variables::*;
use crate::base_definitions::*;

use super::*;


lazy_static! {

    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        use StateVarUpdateInstruction::*;

        let mut state_var_definitions = HashMap::new();
        
        // state_var_definitions.insert("graphicalDescendants", StateVarVariant::String(StateVarDefinition {
        //     return_dependency_instructions: |_| {
        //             HashMap::from([
        //             ("descendants", DependencyInstruction::Child {
        //                 // desired_children: vec![PrimaryOutputTrait::Graphical],
        //                 // desired_state_vars: vec!["disabled"],
        //             })
        //         ])
        //     },
        //     determine_state_var_from_dependencies: |dependency_values| {
        //         let descendants = dependency_values.dep_value("descendants")?;
        //         let descendants: Vec<serde_json::Value> = descendants.0
        //             .iter()
        //             .map(|dv|
        //                 serde_json::json!({
        //                     "component_type": dv.component_type,
        //                 })
        //             )
        //             .collect();
        //         Ok(SetValue(serde_json::to_string(&descendants).unwrap()))
        //     },
        //     for_renderer: true,
        //     ..Default::default()
        // }));

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

        state_var_definitions.insert("xmin", number_definition_from_attribute!("xmin", -10.0));
        state_var_definitions.insert("ymin", number_definition_from_attribute!("ymin", -10.0));
        state_var_definitions.insert("xmax", number_definition_from_attribute!("xmax", 10.0));
        state_var_definitions.insert("ymax", number_definition_from_attribute!("ymax", 10.0));
        
        state_var_definitions.insert("grid", StateVarVariant::String(StateVarDefinition {
            return_dependency_instructions: |_| HashMap::from([

            ]),
            determine_state_var_from_dependencies: |_| Ok(SetValue("none".to_string())),
            for_renderer: true,
            ..Default::default()
        }));

        state_var_definitions.insert("displayMode", string_definition_from_attribute!("displayMode", "block"));

        state_var_definitions.insert("horizontalAlign", string_definition_from_attribute!("horizontalAlign", "center"));

        state_var_definitions.insert("displayXAxis", boolean_definition_from_attribute!("displayXAxis", true));

        state_var_definitions.insert("displayYAxis", boolean_definition_from_attribute!("displayYAxis", true));

        state_var_definitions.insert("displayXAxisTickLabels", boolean_definition_from_attribute!("displayXAxisTickLabels", true));

        state_var_definitions.insert("displayYAxisTickLabels", boolean_definition_from_attribute!("displayYAxisTickLabels", true));

        state_var_definitions.insert("xlabel", string_definition_from_attribute!("xlabel", "x"));

        state_var_definitions.insert("xlabelPosition", string_definition_from_attribute!("xlabelPosition", "right"));

        state_var_definitions.insert("xTickScaleFactor", number_definition_from_attribute!("xTickScaleFactor", 1.0));

        state_var_definitions.insert("ylabel", string_definition_from_attribute!("ylabel", "y"));

        state_var_definitions.insert("ylabelPosition", string_definition_from_attribute!("ylabelPosition", "top"));

        state_var_definitions.insert("ylabelAlignment", string_definition_from_attribute!("ylabelAlignment", "left"));

        state_var_definitions.insert("yTickScaleFactor", number_definition_from_attribute!("yTickScaleFactor", 1.0));

        state_var_definitions.insert("showNavigation", boolean_definition_from_attribute!("showNavigation", true));

        state_var_definitions.insert("fixAxes", boolean_definition_from_attribute!("fixAxes", false));


        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());

        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());

        return state_var_definitions
    };
}



lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "graph",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "displayMode",
            "horizontalAlign",
            "displayXAxis",
            "displayYAxis",
            "displayXAxisTickLabels",
            "displayYAxisTickLabels",
            "xlabel",
            "xlabelPosition",
            "xTickScaleFactor",
            "ylabel",
            "ylabelPosition",
            "ylabelAlignment",
            "yTickScaleFactor",
            "showNavigation",
            "fixAxes",
            "xmin",
            "ymin",
            "xmax",
            "ymax",

            "hide",
            "disabled",
        ],

        should_render_children: true,

        action_names: || vec!["changeAxisLimits"],

        on_action: |action_name, args, _| {

            match action_name {
                "changeAxisLimits" => {
                    // Note: the key here is whatever the renderers call the new value
                    let xmin = args.get("xmin").expect("missing bound argument").first().unwrap().clone().into_number().unwrap();
                    let xmax = args.get("xmax").expect("missing bound argument").first().unwrap().clone().into_number().unwrap();
                    let ymin = args.get("ymin").expect("missing bound argument").first().unwrap().clone().into_number().unwrap();
                    let ymax = args.get("ymax").expect("missing bound argument").first().unwrap().clone().into_number().unwrap();

                    vec![
                        (StateRef::Basic("xmin"), xmin),
                        (StateRef::Basic("xmax"), xmax),
                        (StateRef::Basic("ymin"), ymin),
                        (StateRef::Basic("ymax"), ymax),
                    ]
                },

                _ => panic!("Unknown action '{}' called on graph", action_name)
            }
        },

        valid_children_profiles: ValidChildTypes::AllComponents,

        ..Default::default()
    };
}

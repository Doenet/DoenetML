use std::collections::HashMap;

use lazy_static::lazy_static;
use crate::base_definitions::*;
use super::*;


lazy_static!{
    pub static ref MY_STATE_VAR_DEFINITIONS: HashMap<StateVarName, StateVarVariant> = {
        let mut state_var_definitions = HashMap::new();
        state_var_definitions.insert("hidden", HIDDEN_DEFAULT_DEFINITION());
        state_var_definitions.insert("disabled", DISABLED_DEFAULT_DEFINITION());
        return state_var_definitions
    };
}

fn member_definition(
    _values: &HashMap<AttributeName, String>,
) -> &'static ComponentDefinition {
    COMPONENT_DEFINITIONS.get_key_value_ignore_case("case").unwrap().1
}

fn group_dependencies(
    node: &ComponentNode,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<ComponentName> {
    get_children_of_type(component_nodes, node, "case", false)
}

lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "conditionalContent",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hidden",
            "disabled",
        ],

        replacement_components: Some(ReplacementComponents::Collection(CollectionDefinition {
            member_definition,
            group_dependencies,
        })),

        valid_children_profiles: ValidChildTypes::AllComponents,

        ..Default::default()
    };
}

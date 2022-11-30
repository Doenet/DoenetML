use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::{base_definitions::*, utils::log_debug};

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
    values: &HashMap<AttributeName, String>,
) -> &'static ComponentDefinition {
    log_debug!("{:?}", values);
    let component_type = values.get("componentType").unwrap();
    COMPONENT_DEFINITIONS.get_key_value_ignore_case(component_type.as_str()).unwrap().1
}

fn group_dependencies(
    node: &ComponentNode,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<ComponentName> {

    let my_attributes = &node.static_attributes;
    let desired_type: String = my_attributes.get("componentType").unwrap().clone();
    depend_on_children_of_type(node, desired_type, component_nodes)
}

fn depend_on_children_of_type(
    node: &ComponentNode,
    component_type: String,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<ComponentName> {

    node
    .children
    .iter()
    .filter_map(|n|
        match n {
            ObjectName::Component(c) => {
                let comp = component_nodes.get(c).unwrap();
                let child_type = match &comp.definition.replacement_children {
                    Some(GroupOrCollection::Group(def)) => (def.member_definition)(&node.static_attributes).component_type,
                    Some(GroupOrCollection::Collection(def)) => def.member_definition.component_type,
                    None => comp.definition.component_type,
                };
                if child_type.to_lowercase() == component_type.to_lowercase() {
                    Some(match comp.definition.replacement_children {
                        Some(_) => c.clone(),
                        None => c.clone(),
                    })
                } else {
                    None
                }
            }
            _ => None
        }
    ).collect()
}

lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {
        component_type: "sources",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hidden",
            "disabled",
        ],

        static_attribute_names: vec![
            "alias",
            "componentType",
        ],

        replacement_children: Some(GroupOrCollection::Group(GroupDefinition {
            member_definition,
            group_dependencies,
        })),

        valid_children_profiles: ValidChildTypes::AllComponents,

        ..Default::default()
    };
}

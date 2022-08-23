use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::GroupDependency;
use crate::state_variables::*;
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

fn component_type(
    values: &HashMap<AttributeName, String>,
) -> ComponentType {
    let component_type = values.get("componentType").unwrap();
    to_component_type(component_type).unwrap()
}

fn group_dependencies(
    node: &ComponentNode,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<GroupDependency> {

    let my_attributes = &node.static_attributes;
    let source: &String = my_attributes.get("source").unwrap();
    let desired_type: String = my_attributes.get("componentType").unwrap().clone();
    let source_node = component_nodes.get(source).unwrap();
    depend_on_children_of_type(source_node, desired_type, component_nodes)
}

fn depend_on_children_of_type(
    node: &ComponentNode,
    component_type: String,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<GroupDependency> {

    node
    .children
    .iter()
    .filter_map(|n|
        match n {
            ObjectName::Component(c) => {
                let comp = component_nodes.get(c).unwrap();
                let child_type = match comp.definition.group {
                    Some(def) => (def.component_type)(&node.static_attributes),
                    None => comp.component_type,
                };
                if child_type.to_lowercase() == component_type.to_lowercase() {
                    Some(match comp.definition.group {
                        Some(_) => GroupDependency::Group(c.clone()),
                        None => GroupDependency::Component(c.clone()),
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
    pub static ref MY_GROUP_DEFINITION: GroupComponent = GroupComponent {
        component_type,
        group_dependencies,
        ..Default::default()
    };
}

lazy_static! {
    pub static ref MY_COMPONENT_DEFINITION: ComponentDefinition = ComponentDefinition {

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hidden",
            "disabled",
        ],

        static_attribute_names: vec![
            "source",
            "componentType",
        ],

        group: Some(&MY_GROUP_DEFINITION),

        ..Default::default()
    };
}

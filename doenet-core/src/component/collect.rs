use std::collections::HashMap;

use lazy_static::lazy_static;

use crate::ComponentGroup;
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

fn group_dependency_attributes() -> Vec<AttributeName> {
    vec!["source", "componentType"]
}

fn group_dependencies(
    static_attributes: &HashMap<ComponentName, HashMap<AttributeName, String>>,
    node: &ComponentNode,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<GroupDependency> {

    let my_attributes = static_attributes.get(&node.name).unwrap();
    let source: &String = my_attributes.get("source").unwrap();
    let desired_type: String = my_attributes.get("componentType").unwrap().clone();
    let source_node = component_nodes.get(source).unwrap();
    depend_on_children_of_type(source_node, desired_type, component_nodes, static_attributes)
}

fn depend_on_children_of_type(
    node: &ComponentNode,
    component_type: String,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
    static_attributes: &HashMap<ComponentName, HashMap<AttributeName, String>>,
) -> Vec<GroupDependency> {

    node
    .children
    .iter()
    .filter_map(|n|
        match n {
            ObjectName::Component(c) => {
                let comp = component_nodes.get(c).unwrap();
                let child_type = match comp.definition.group {
                    Some(def) => (def.component_type)(static_attributes.get(c).unwrap()),
                    None => comp.component_type,
                };
                if child_type == component_type {
                    let group = match comp.definition.group {
                        Some(_) => ComponentGroup::Group(c.clone()),
                        None => ComponentGroup::Single(ComponentRef::Basic(c.clone())),
                    };
                    Some(GroupDependency::Group(group))
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
        group_dependency_attributes,
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

            // static attributes
            "source",
            "componentType",
        ],

        group: Some(&MY_GROUP_DEFINITION),

        ..Default::default()
    };
}

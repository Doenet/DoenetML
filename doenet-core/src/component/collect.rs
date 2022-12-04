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
    values: &HashMap<AttributeName, String>,
) -> &'static ComponentDefinition {
    let component_type = values.get("componentType").unwrap();
    COMPONENT_DEFINITIONS.get_key_value_ignore_case(component_type.as_str()).unwrap().1
}

fn group_dependencies(
    node: &ComponentNode,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
) -> Vec<ComponentName> {

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
) -> Vec<ComponentName> {

    node
    .children
    .iter()
    .filter_map(|n|
        match n {
            ObjectName::Component(c) => {
                let comp = component_nodes.get(c).unwrap();
                let child_type = match &comp.definition.replacement_components {
                    Some(CollectionOrBatch::Collection(def)) => (def.member_definition)(&node.static_attributes).component_type,
                    Some(CollectionOrBatch::Batch(def)) => def.member_definition.component_type,
                    None => comp.definition.component_type,
                };
                if child_type.to_lowercase() == component_type.to_lowercase() {
                    Some(match comp.definition.replacement_components {
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
        component_type: "collect",

        state_var_definitions: &MY_STATE_VAR_DEFINITIONS,

        attribute_names: vec![
            "hidden",
            "disabled",
        ],

        static_attribute_names: vec![
            "source",
            "componentType",
        ],

        should_render_children: true,

        replacement_components: Some(CollectionOrBatch::Collection(CollectionDefinition {
            member_definition,
            group_dependencies,
        })),

        ..Default::default()
    };
}

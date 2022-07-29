use serde::Deserialize;

use crate::Action;
use crate::component::{Attribute, AttributeDefinition, CopyTarget, generate_component_definitions};
use crate::prelude::*;

use crate::AttributeData;
use crate::ComponentDefinition;
use crate::ComponentChild;
use crate::ComponentNode;

use std::collections::HashMap;

use crate::state_variables::*;

use crate::log;

// Structures for create_components_tree_from_json
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ComponentTree {
    component_type: String,
    props: Props,
    children: Vec<ComponentOrString>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Props {
    name: Option<String>,
    copy_target: Option<String>,
    prop: Option<String>,
    #[serde(flatten)]
    attributes: HashMap<String, AttributeValue>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum AttributeValue {
    String(String),
    Bool(bool),
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum ComponentOrString {
    Component(ComponentTree),
    String(String),
}


// Structures for parse_action_from_json
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ActionStructure {
    component_name: String,
    action_name: String,
    args: HashMap<String, ArgValue>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum ArgValue {
    Bool(bool),
    Number(serde_json::Number),
    String(String),
}



pub fn parse_action_from_json(action: &str) -> Result<Action, String> {

    let action_structure: ActionStructure = serde_json::from_str(action).map_err(|e| e.to_string())?;

    let component_name = action_structure.component_name.clone();
    let action_name = action_structure.action_name.clone();
    let args = action_structure.args.iter()
        .map(|(k, v)| 
             match v {
                 ArgValue::Bool(v) => (k.clone(), StateVarValue::Boolean(*v)),
                 ArgValue::String(v) => (k.clone(), StateVarValue::String(v.clone())),
                 ArgValue::Number(v) => (k.clone(), if v.is_i64() {
                     StateVarValue::Integer(v.as_i64().unwrap())
                 } else {
                     StateVarValue::Number(v.as_f64().unwrap())
                 }),
             })
        .collect();

    Ok(Action { component_name, action_name, args})
}


pub fn create_components_tree_from_json(program: &str)
    -> Result<(HashMap<String, ComponentNode>, String), String> {


    let component_definitions = generate_component_definitions();

    let mut all_state_var_names = HashMap::new();
    for (_, def) in component_definitions.iter() {

        for &name in def.state_var_definitions().keys() {
            all_state_var_names.insert(name.to_string(), name);
        }

    }

    // log!("All state var names {:#?}", all_state_var_names);

    let component_tree: Vec<ComponentOrString> = serde_json::from_str(program).map_err(|e| e.to_string())?;
    let component_tree = component_tree.iter()
        .find_map(|v| match v {
            ComponentOrString::Component(tree) => Some(tree),
            _ => None,
        }).ok_or("No component trees")?;

    // log!("Root json object {:#?}", component_tree);

    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut component_nodes: HashMap<String, ComponentNode> = HashMap::new();

    let root_component_name = add_component_from_json(
        &mut component_nodes,
        &component_tree,
        None,
        &mut component_type_counter,
        &component_definitions,
        &all_state_var_names,
    )?;

    Ok((component_nodes, root_component_name))
}


/// Recursive function
fn add_component_from_json(
    component_nodes: &mut HashMap<String, ComponentNode>,
    component_tree: &ComponentTree,
    parent_name: Option<String>,
    component_type_counter: &mut HashMap<String, u32>,
    component_definitions: &HashMap<ComponentType, Box<dyn ComponentDefinition>>,
    all_state_var_names: &HashMap<String, StateVarName>,

) -> Result<String, String> {

    let component_type: &str = &component_tree.component_type;

    let (&component_type, component_definition) = component_definitions.get_key_value(component_type).ok_or(
        format!("{} is not a valid component type", component_type)
    )?;

    let count = *component_type_counter.get(component_type).unwrap_or(&0);
    component_type_counter.insert(component_type.to_string(), count + 1);

    let component_name = match &component_tree.props.name {
        Some(name) => name.clone(),
        None => format!("/_{}{}", component_type, count + 1),
    };


    let copy_target: Option<CopyTarget> =
        if let Some(ref target_name) = component_tree.props.copy_target {
            if let Some(ref target_state_var) = component_tree.props.prop {

                let state_var_name = all_state_var_names.get(target_state_var).ok_or(
                    format!("{} is not a valid state var name", target_state_var))?;

                Some(CopyTarget::StateVar(target_name.clone(), state_var_name))
            } else {
                Some(CopyTarget::Component(target_name.clone()))
            }
        } else {
            None
        };

    let attribute_definitions = component_definition.attribute_definitions();

    let mut attributes: Box<dyn AttributeData> = component_definition.empty_attribute_data();

    // Create a hashmap from lowercase valid names to normalized valid names
    let attr_lowercase_to_normalized: HashMap<String, AttributeName> =
        attribute_definitions.keys()
        .into_iter()
        .map(|k| (k.to_lowercase(), *k))
        .collect();

    for (attr_name, attr_value) in component_tree.props.attributes.iter() {
        if let Some(attribute_name) = attr_lowercase_to_normalized.get(&attr_name.to_lowercase()) {

            let attribute_def = attribute_definitions.get(attribute_name).ok_or("no item")?;
    
            match attribute_def {
                AttributeDefinition::Component(attr_comp_type) => {

                    //String child
                    let string_child = ComponentChild::String(match attr_value {
                        AttributeValue::Bool(v) => v.to_string(),
                        AttributeValue::String(v) => v.to_string(),
                    });

                    // Make sure this is unique
                    let attr_comp_name = format!("__attr:{}:{}", component_name, attribute_name);

                    let attr_component_definition = component_definitions.get(attr_comp_type).ok_or(
                        format!("{} is not a valid component type", attr_comp_type)
                    )?;

                    let attribute_component_node = ComponentNode {
                        name: attr_comp_name.clone(),
                        parent: Some(component_name.clone()),
                        children: vec![string_child],
                
                        component_type: attr_comp_type,
                        attributes: attr_component_definition.empty_attribute_data(),
                
                        copy_target: None,

                        definition: attr_component_definition.clone(),
                    };

                    attributes.add_attribute(attribute_name, Attribute::Component(attr_comp_name.clone()))?;

                    component_nodes.insert(attr_comp_name, attribute_component_node);
                },
    
                AttributeDefinition::Primitive(attr_primitive_type) => {

                    match attr_primitive_type {
                        StateVarValueType::Boolean => {

                            match attr_value {
                                AttributeValue::Bool(bool_value) => {
                                    attributes.add_attribute(
                                        attribute_name,
                                        Attribute::Primitive(StateVarValue::Boolean(*bool_value)))?;
                                }
                                _ => {
                                    return Err(format!("Attribute {} has the wrong type", attribute_name));
                                },
                            }

                        },

                        _ => {
                            log!("Primitive non-bool attribute definition does nothing right now");
                        }
                    }
    
                }
            }

        } else {
            return Err(format!("{} does not have the attribute {}", component_name, attr_name));
        }
    }


    // Recurse the children

    let mut children: Vec<ComponentChild> = Vec::new();

    for child in &component_tree.children {

        match child {
            ComponentOrString::String(child_string) => {
                children.push(ComponentChild::String(child_string.to_string()));
            },

            ComponentOrString::Component(child_tree) => {
                let child_name = add_component_from_json(
                    component_nodes,
                    &child_tree,
                    Some(component_name.clone()),
                    component_type_counter,
                    component_definitions,
                    all_state_var_names,

                )?;

                children.push(ComponentChild::Component(child_name));
            },
        }
    }


    let component_node = ComponentNode {
        name: component_name.clone(),
        parent: parent_name,
        children,

        component_type,
        attributes,

        copy_target,

        definition: component_definition.clone(),
    };

    component_nodes.insert(component_name.clone(), component_node);

    Ok(component_name)
}

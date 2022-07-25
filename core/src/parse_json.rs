use serde::Deserialize;

use crate::Action;
use crate::component::{Attribute, AttributeDefinition};
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


fn get_component_definition_for_type(component_type: &str) -> Result<(Box<dyn ComponentDefinition>, ComponentType),String> {
    let component_def_and_type = match component_type {
        "text" =>       (Box::new(crate::text::MyComponentDefinition) as Box<dyn ComponentDefinition>, "text"),
        "number" =>     (Box::new(crate::number::MyComponentDefinition) as Box<dyn ComponentDefinition>, "number"),
        "textInput" =>  (Box::new(crate::text_input::MyComponentDefinition) as Box<dyn ComponentDefinition>, "textInput"),
        "document" =>   (Box::new(crate::document::MyComponentDefinition) as Box<dyn ComponentDefinition>, "document"),
        "boolean" =>    (Box::new(crate::boolean::MyComponentDefinition) as Box<dyn ComponentDefinition>, "boolean"),
        "p" =>    (Box::new(crate::p::MyComponentDefinition) as Box<dyn ComponentDefinition>, "p"),


        _ => {
            return Err(format!("Invalid component type {}", component_type));
        } 
    };

    Ok(component_def_and_type)
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

    let component_tree: Vec<ComponentTree> = serde_json::from_str(program).map_err(|e| e.to_string())?;
    let component_tree = component_tree.first().ok_or("Empty JSON")?;

    log!("Root json object {:#?}", component_tree);

    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut component_nodes: HashMap<String, ComponentNode> = HashMap::new();

    let root_component_name = add_component_from_json(
        &mut component_nodes,
        &component_tree,
        None,
        &mut component_type_counter)?;

    Ok((component_nodes, root_component_name))
}


fn add_component_from_json(
    component_nodes: &mut HashMap<String, ComponentNode>,
    component_tree: &ComponentTree,
    parent_name: Option<String>,
    component_type_counter: &mut HashMap<String, u32>,
) -> Result<String, String> {

    let component_type: &str = &component_tree.component_type;
    let (component_definition, component_type) = get_component_definition_for_type(component_type)?;

    let count = *component_type_counter.get(component_type).unwrap_or(&0);
    component_type_counter.insert(component_type.to_string(), count + 1);

    let component_name = match &component_tree.props.name {
        Some(name) => name.clone(),
        None => format!("/_{}{}", component_type, count + 1),
    };

    let copy_target: Option<String> = component_tree.props.copy_target.clone();

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

                    let (attr_component_definition, _) = get_component_definition_for_type(attr_comp_type)?;

                    let attribute_component_node = ComponentNode {
                        name: attr_comp_name.clone(),
                        parent: Some(component_name.clone()),
                        children: vec![string_child],
                
                        component_type: attr_comp_type,
                        attributes: attr_component_definition.empty_attribute_data(),
                
                        copy_target: None,
                        is_shadow_for: None,

                        definition: attr_component_definition,
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
                    component_type_counter)?;

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
        is_shadow_for: None,

        definition: component_definition,
    };

    component_nodes.insert(component_name.clone(), component_node);

    Ok(component_name)
}

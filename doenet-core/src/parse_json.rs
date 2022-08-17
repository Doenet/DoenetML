use serde::{Serialize, Deserialize};

use crate::utils::{log_json};
use crate::Action;
use crate::component::{CopySource, AttributeName, ComponentName, COMPONENT_DEFINITIONS, ComponentType};

use crate::ComponentChild;
use crate::ComponentNode;

use std::collections::HashMap;
use std::fmt::Display;

use crate::state_variables::*;


// Structures for create_components_tree_from_json
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ComponentTree {
    component_type: String,
    props: Props,
    children: Vec<ComponentOrString>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Props {
    name: Option<String>,
    copy_source: Option<String>, //this will become copy_source
    prop: Option<String>,
    prop_index: Option<String>,
    #[serde(flatten)]
    attributes: HashMap<String, AttributeValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
enum AttributeValue {
    String(String),
    Bool(bool),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
enum ComponentOrString {
    Component(ComponentTree),
    String(String),
}


// Structures for parse_action_from_json
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ActionStructure {
    component_name: String,
    action_name: String,
    args: HashMap<String, ArgValue>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
enum ArgValue {
    Bool(bool),
    Number(serde_json::Number),
    String(String),
}








/// This error is caused by invalid DoenetML.
/// It is thrown only on core creation.
#[derive(Debug, PartialEq)]
pub enum DoenetMLError {

    ComponentDoesNotExist {
        comp_name: String,
    },
    StateVarDoesNotExist {
        comp_name: ComponentName,
        sv_name: String,
    },
    AttributeDoesNotExist {
        comp_name: ComponentName,
        attr_name: String,
    },
    InvalidComponentType {
        comp_type: String,
    },
    NonNumericalPropIndex {
        comp_name: ComponentName,
        invalid_index: String,
    },

    PropIndexIsNotPositiveInteger {
        // Note that if there is a macro in the propIndex,
        // we can't know if it is an integer or not, so we don't throw this error
        comp_name: ComponentName,
        invalid_index: String,
    },

    CannotCopyArrayStateVar {
        // copier_comp_name: ComponentName, 
        source_comp_name: ComponentName,
        source_sv_name: StateVarName,
    },
    CannotCopyIndexForStateVar {
        source_comp_name: ComponentName,
        source_sv_name: StateVarName,
    },

    DuplicateName {
        name: String,
    },
    CyclicalDependency {
        component_chain: Vec<ComponentName>,
    },
    ComponentCannotCopyOtherType {
        component_name: ComponentName,
        component_type: ComponentType,
        source_type: ComponentType,
    },
}

impl std::error::Error for DoenetMLError {}
impl Display for DoenetMLError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use DoenetMLError::*;

        match self {
            ComponentDoesNotExist { comp_name } => 
                write!(f, "Component '{}' does not exist", comp_name),
            StateVarDoesNotExist { comp_name, sv_name } =>
                write!(f, "State variable '{}' does not exist on {}", sv_name, comp_name),
            AttributeDoesNotExist { comp_name, attr_name } =>
                write!(f, "Attribute '{}' does not exist on {}", attr_name, comp_name),
            InvalidComponentType { comp_type } => 
                write!(f, "Component type {} does not exist", comp_type),
            NonNumericalPropIndex { comp_name, invalid_index } =>
                write!(f, "Component {} has non-numerical propIndex '{}'", comp_name, invalid_index),
            PropIndexIsNotPositiveInteger { comp_name, invalid_index } =>
                write!(f, "Component {} has propIndex '{}' which is not a positive integer", comp_name, invalid_index),
            CannotCopyArrayStateVar { source_comp_name, source_sv_name } =>
                write!(f, "Cannot copy array state variable '{}' from component {}", source_sv_name, source_comp_name),
            CannotCopyIndexForStateVar { source_comp_name, source_sv_name } =>
                write!(f, "Cannot use propIndex for state variable '{}' from component {} because this state variable is not an array", source_sv_name, source_comp_name),
            DuplicateName { name} =>
                write!(f, "The component name {} is used multiple times", name),
            CyclicalDependency { component_chain } => {
                let mut msg = String::from("Cyclical dependency through components: ");
                for comp in component_chain {
                    msg.push_str(&format!("{}, ", comp));
                }
                msg.pop();
                msg.pop();

                write!(f, "{}", msg)
            }
            ComponentCannotCopyOtherType { component_name, component_type, source_type } => {
                write!(f, "The {} component '{}' cannot copy a {} component.", component_type, component_name, source_type)
            }
        }
    }
}






fn get_key_value_ignore_case<'a, K, V>(map: &'a HashMap<K, V>, key: &str) -> Option<(&'a K, &'a V)>
where
    K: ToString + std::cmp::Eq + std::hash::Hash,
{
    let lowercase_to_normalized: HashMap<String, &K> = map
        .keys()
        .into_iter()
        .map(|k| (k.to_string().to_lowercase(), k))
        .collect();

    lowercase_to_normalized
        .get(&key.to_string().to_lowercase())
        .and_then(|k| map.get_key_value(k))
}

/// Returns the Action as well as the action id which the renderer sent
pub fn parse_action_from_json(action: &str) -> Result<(Action, String), String> {

    // log_debug!("Parsing string for action: {}", action);

    let action_structure: ActionStructure = serde_json::from_str(action).map_err(|e| e.to_string())?;

    let component_name = action_structure.component_name.clone();
    let action_name = action_structure.action_name.clone();

    let mut args: HashMap<String, StateVarValue> = action_structure.args.iter()
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

    let action_id: String = args.get("actionId").unwrap().clone().try_into().unwrap();
    args.remove("actionId");

    Ok((Action { component_name, action_name, args}, action_id))
}


pub fn create_components_tree_from_json(program: &str)
    -> Result<(
            HashMap<ComponentName, ComponentNode>,
            HashMap<ComponentName, HashMap<AttributeName, String>>,
            HashMap<ComponentName, (ComponentName, StateVarName, String)>, //propIndexes
            String
        ), DoenetMLError> {

    // log!("Parsing string for component tree: {}", program);

    // let component_definitions = generate_component_definitions();

    let all_state_var_names: HashMap<String, StateVarName> = COMPONENT_DEFINITIONS
        .iter()
        .flat_map(|(_, &def)|
            def.state_var_definitions
            .iter()
            .map(|(name, _)| (name.to_string(), *name))
            .collect::<HashMap<String, StateVarName>>())
        .collect();

    let component_tree: Vec<ComponentOrString> = serde_json::from_str(program)
        // This fails if there is a problem with the parser, not the input doenetML,
        // so we don't throw a doenetML error here
        .expect("Error extracting json");

    let first_component = component_tree.iter()
        .find_map(|v| match v {
            ComponentOrString::Component(tree) => Some(tree),
            _ => None,
        });
    
    let tree_wrapped_in_document = |orig_comp_tree | ComponentTree {
        component_type: String::from("document"),
        props: Props { name: None, copy_source: None, prop: None, prop_index: None, attributes: HashMap::new() },
        children: orig_comp_tree,
    };

    let component_tree = if let Some(first_comp) = first_component {
        if first_comp.component_type == "document" {
            first_comp.clone()

        } else {
            tree_wrapped_in_document(component_tree)
        }
    } else {
        tree_wrapped_in_document(component_tree)
    };

    log_json!(format!("Parsed JSON into tree"), component_tree);

    let mut component_type_counter: HashMap<String, u32> = HashMap::new();
    let mut component_nodes: HashMap<ComponentName, ComponentNode> = HashMap::new();
    let mut component_attributes = HashMap::new();
    let mut copy_prop_index_instances = HashMap::new();

    let root_component_name = add_component_from_json(
        &mut component_nodes,
        &mut component_attributes,
        &mut copy_prop_index_instances,
        &component_tree,
        None,
        &mut component_type_counter,
        &all_state_var_names,
    )?;

    let root_component_name = root_component_name.unwrap();

    Ok((component_nodes, component_attributes, copy_prop_index_instances, root_component_name))
}


/// Recursive function
/// The return is the name of the child, if it exists
/// (it might not because of invalid doenet ml)
fn add_component_from_json(
    component_nodes: &mut HashMap<String, ComponentNode>,
    component_attributes: &mut HashMap<ComponentName, HashMap<AttributeName, String>>,
    copy_prop_index_instances: &mut HashMap<ComponentName, (ComponentName, StateVarName, String)>,
    component_tree: &ComponentTree,
    parent_name: Option<String>,
    component_type_counter: &mut HashMap<String, u32>,
    all_state_var_names: &HashMap<String, StateVarName>,

) -> Result<Option<ComponentName>, DoenetMLError> {

    let component_type: &str = &component_tree.component_type;

    let (&component_type, &component_definition) =
        get_key_value_ignore_case(&COMPONENT_DEFINITIONS, component_type)
        .ok_or(DoenetMLError::InvalidComponentType {
            comp_type: component_type.to_string() }
        )?;

    let count = *component_type_counter.get(component_type).unwrap_or(&0);
    component_type_counter.insert(component_type.to_string(), count + 1);

    let component_name = match &component_tree.props.name {
        Some(name) => name.clone(),
        None => format!("/_{}{}", component_type, count + 1),
    };


    let copy_source: Option<CopySource> = {
        if let Some(ref source_comp_name) = component_tree.props.copy_source {
            if let Some(ref source_state_var) = component_tree.props.prop {

                let source_sv_name =  all_state_var_names.get(source_state_var)
                    .ok_or(DoenetMLError::StateVarDoesNotExist {
                        comp_name: component_name.clone(),
                        sv_name: source_state_var.to_string() 
                    })?;

                if let Some(ref source_sv_index_str) = component_tree.props.prop_index {

                    copy_prop_index_instances.insert(component_name.clone(), 
                        (
                            source_comp_name.to_string(),
                            source_sv_name,
                            source_sv_index_str.to_owned(),
                        )
                    );
                    None

                    // Some(CopySource::StateVar(source_name.clone(), StateRef::ArrayElement(state_var_name, index)))

                } else {
                    Some(CopySource::StateVar(source_comp_name.clone(), StateRef::Basic(source_sv_name)))

                }

            } else {
                Some(CopySource::Component(source_comp_name.clone()))
            }
        } else {
            None
        }
    };

    let mut attributes = HashMap::new();
    let lower_case_attributes: HashMap<String, AttributeName> = component_definition.attribute_names
        .iter()
        .map(|n| (n.to_lowercase(), *n))
        .collect();

    for (attr_name, attr_value) in component_tree.props.attributes.iter() {
        
        if let Some(&attribute_name) = lower_case_attributes.get(&attr_name.to_lowercase()) {
            let attribute_string = match attr_value {
                AttributeValue::String(v) => v.clone(),
                AttributeValue::Bool(v) => v.to_string(),
            };
            attributes.insert(attribute_name, attribute_string);
        } else {
            return Err(DoenetMLError::AttributeDoesNotExist {
                comp_name: component_name.clone(),
                attr_name: attr_name.clone()
            });
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
                let child_name_if_not_error = add_component_from_json(
                    component_nodes,
                    component_attributes,
                    copy_prop_index_instances,
                    &child_tree,
                    Some(component_name.clone()),
                    component_type_counter,
                    all_state_var_names,
                )?;

                if let Some(child_name) = child_name_if_not_error {
                    children.push(ComponentChild::Component(child_name));
                }

            },
        }
    }


    let component_node = ComponentNode {
        name: component_name.clone(),
        parent: parent_name,
        children,

        component_type,

        copy_source,

        definition: component_definition.clone(),
    };

    if component_nodes.contains_key(&component_name) {
        return Err(DoenetMLError::DuplicateName { name: component_name.clone() });
    } else {
        component_nodes.insert(component_name.clone(), component_node);
        component_attributes.insert(component_name.clone(), attributes);
    }

    return Ok(Some(component_name));
}

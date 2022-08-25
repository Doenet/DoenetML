use serde::{Serialize, Deserialize};

use crate::utils::{log_json, log_debug, log};
use crate::Action;
use crate::component::{ComponentName, COMPONENT_DEFINITIONS, ComponentType, ComponentDefinition,
KeyValueIgnoreCase, AttributeName, ObjectName};

use crate::ComponentChild;
use lazy_static::lazy_static;
use regex::Regex;

use std::collections::HashMap;
use std::fmt::Display;

use crate::state_variables::*;



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
    NonNumericalIndex {
        comp_name: ComponentName,
        invalid_index: String,
    },
    InvalidStaticAttribute {
        comp_name: ComponentName,
        attr_name: String,
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
            NonNumericalIndex { comp_name, invalid_index } =>
                write!(f, "Component {} has non-numerical index '{}'", comp_name, invalid_index),
            InvalidStaticAttribute { comp_name, attr_name } =>
                write!(f, "Component {} attribute '{}' must be static", comp_name, attr_name),
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



/// This warning is caused by invalid DoenetML.
/// It is thrown only on core creation, but does not stop core from being created.
#[derive(Debug, PartialEq)]
pub enum DoenetMLWarning {
    PropIndexIsNotPositiveInteger {
        // Note that if there is a macro in the propIndex,
        // we can't know if it is an integer or not, so we don't throw this warning
        comp_name: ComponentName,
        invalid_index: String,
    },

    InvalidChildType {
        parent_comp_name: ComponentName,
        child_comp_name: ComponentName,
        child_comp_type: ComponentType,
    },
}

impl std::error::Error for DoenetMLWarning {}
impl Display for DoenetMLWarning {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use DoenetMLWarning::*;
        match self {
            PropIndexIsNotPositiveInteger { comp_name, invalid_index } => {
                write!(f, "Component {} has propIndex '{}' which is not a positive integer", comp_name, invalid_index)
            },
            InvalidChildType { parent_comp_name, child_comp_name: _, child_comp_type } => {
                write!(f, "Component {} cannot have a child component of type {}", parent_comp_name, child_comp_type)
            },
        }

    }
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

impl From<ArgValue> for StateVarValue {
    fn from(value: ArgValue) -> Self {
         match value {
             ArgValue::Bool(v) => StateVarValue::Boolean(v),
             ArgValue::String(v) => StateVarValue::String(v),
             ArgValue::Number(v) => if v.is_i64() {
                 StateVarValue::Integer(v.as_i64().unwrap())
             } else {
                 StateVarValue::Number(v.as_f64().unwrap())
             },
         }
    }
}

/// Returns the Action as well as the action id which the renderer sent
pub fn parse_action_from_json(action: &str) -> Result<(Action, String), String> {

    // log_debug!("Parsing string for action: {}", action);

    let action_structure: ActionStructure = serde_json::from_str(action).map_err(|e| e.to_string())?;

    let component_name = action_structure.component_name.clone();
    let action_name = action_structure.action_name.clone();
    let mut args: HashMap<String, StateVarValue> = action_structure.args
        .into_iter()
        .map(|(k, v)| (k, v.into()))
        .collect();

    let action_id: String = args.get("actionId").unwrap().clone().try_into().unwrap();
    args.remove("actionId");

    Ok((Action { component_name, action_name, args}, action_id))
}



// Structures for create_components_tree_from_json
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ComponentTree {
    component_type: String,
    props: Props,
    children: Vec<ComponentOrString>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Props {
    name: Option<String>,
    copy_source: Option<String>,
    copy_prop: Option<String>,
    prop_index: Option<String>,
    component_index: Option<String>,
    #[serde(flatten)]
    attributes: HashMap<String, AttributeValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
enum AttributeValue {
    String(String),
    Bool(bool),
}

impl ToString for AttributeValue {
    fn to_string(&self) -> String {
        match self {
            Self::Bool(v) => v.to_string(),
            Self::String(v) => v.to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
enum ComponentOrString {
    Component(ComponentTree),
    String(String),
}

/// This structure will get converted into `ComponentNode`;
/// that can only happen once all are created.
#[derive(Debug, Clone)]
pub struct MLComponent {
    pub name: ComponentName,
    pub parent: Option<ComponentName>,
    pub children: Vec<ComponentChild>,

    pub copy_source: Option<String>,
    pub copy_prop: Option<String>,
    pub static_attributes: HashMap<AttributeName, String>,

    // not filled in at first
    pub component_index: Vec<ObjectName>,
    pub prop_index: Vec<ObjectName>,

    pub definition: &'static ComponentDefinition,
}


pub fn create_components_tree_from_json(program: &str)
    -> Result<(
            HashMap<ComponentName, MLComponent>,
            HashMap<ComponentName, HashMap<AttributeName, HashMap<usize, Vec<ObjectName>>>>,
            ComponentName
        ), DoenetMLError> {

    // log!("Parsing string for component tree: {}", program);

    // This fails if there is a problem with the parser, not the input doenetML.
    // Panic - it's not a DoenetML error.
    let component_tree: Vec<ComponentOrString> = serde_json::from_str(program)
        .expect("Error extracting json");

    let component_tree = component_tree
        .iter()
        .find_map(|v| match v {
            ComponentOrString::Component(tree) => Some(tree),
            _ => None,
        })
        .and_then(|c| if c.component_type == "document" { Some(c.clone()) } else { None })
        .unwrap_or(ComponentTree {
            component_type: "document".to_string(),
            props: Props::default(),
            children: component_tree,
        });

    log_json!(format!("Parsed JSON into tree"), component_tree);

    let mut components: HashMap<ComponentName, MLComponent> = HashMap::new();
    let mut attributes: HashMap<ComponentName, HashMap<AttributeName, String>> = HashMap::new();
    let mut component_indices: HashMap<ComponentName, Option<String>> = HashMap::new();
    let mut prop_indices: HashMap<ComponentName, Option<String>> = HashMap::new();

    let mut component_type_counter: HashMap<String, u32> = HashMap::new();

    let root_component_name = add_component_from_json(
        &mut components,
        &mut attributes,
        &mut component_indices,
        &mut prop_indices,
        &component_tree,
        None,
        &mut component_type_counter,
    )?
    .unwrap();

    let (replacement_children, macro_components, attributes_parsed, prop_indices_parsed, component_indices_parsed) =
        parse_attributes_and_macros(&components, attributes, prop_indices, component_indices);

    // log_debug!("Components to add from macros: {:#?}", components_to_add);
    // log_debug!("Replacement children {:#?}", replacement_children);
    // log_debug!("Replacement attributes {:#?}", attributes_parsed);

    let components = components.into_iter().map(|(name, c)| {
        let mut new_children_vec: Vec<(usize, Vec<ObjectName>)> = replacement_children
            .get(&name)
            .unwrap_or(&HashMap::new())
            .clone()
            .into_iter()
            .collect();

        // sort by decending order so that splicing does not affect next iteration
        new_children_vec.sort_by(|(a,_),(b,_)| b.cmp(a));

        let mut children = c.children.clone();
        for (original_child_id, new_children) in new_children_vec.into_iter() {

            // Remove the original element, and add the new children (in order) in its place
            children.splice(
                original_child_id..=original_child_id,
                new_children
            );
        }

        (name.clone(), MLComponent {
            component_index: component_indices_parsed.get(&name).unwrap().clone(),
            prop_index: prop_indices_parsed.get(&name).unwrap().clone(),
            children,
            ..c
        })
    })
    .chain(
        macro_components.into_iter().map(|c| (c.name.clone(), c))
    ).collect();

    Ok((components, attributes_parsed, root_component_name))
}


/// Recursive function
/// The return is the name of the child, if it exists
/// (it might not because of invalid doenet ml)
fn add_component_from_json(
    components: &mut HashMap<String, MLComponent>,
    attributes: &mut HashMap<ComponentName, HashMap<AttributeName, String>>,
    component_indices: &mut HashMap<ComponentName, Option<String>>,
    prop_indices: &mut HashMap<ComponentName, Option<String>>,
    component_tree: &ComponentTree,
    parent: Option<String>,
    component_type_counter: &mut HashMap<String, u32>,
) -> Result<Option<ComponentName>, DoenetMLError> {

    let component_type: &str = &component_tree.component_type;

    let definition = &COMPONENT_DEFINITIONS
        .get_key_value_ignore_case(component_type)
        .ok_or(DoenetMLError::InvalidComponentType {
            comp_type: component_type.to_string() }
        )?
        .1;

    let count = component_type_counter.entry(component_type.to_string()).or_insert(0);
    *count += 1;

    let name = match &component_tree.props.name {
        Some(name) => name.clone(),
        None => format!("/_{}{}", component_type, count),
    };

    if components.contains_key(&name) {
        return Err(DoenetMLError::DuplicateName { name: name.clone() });
    }

    let mut static_attributes = HashMap::new();
    let mut component_attributes = HashMap::new();

    let lower_case_attributes: HashMap<String, AttributeName> = definition
        .attribute_names
        .iter()
        .map(|n| (n.to_lowercase(), *n))
        .collect();
    let lower_case_static_attributes: HashMap<String, AttributeName> = definition
        .static_attribute_names
        .iter()
        .map(|n| (n.to_lowercase(), *n))
        .collect();

    for (attr_name, attr_value) in component_tree.props.attributes.clone().into_iter() {
        let attr_name = attr_name.to_lowercase();
        if let Some(&attribute_name) = lower_case_attributes.get(&attr_name) {
            component_attributes.insert(attribute_name, attr_value.to_string());
        } else if let Some(&attribute_name) = lower_case_static_attributes.get(&attr_name) {
            static_attributes.insert(attribute_name, attr_value.to_string());
        } else {
            return Err(DoenetMLError::AttributeDoesNotExist {
                comp_name: name.clone(),
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
                    components,
                    attributes,
                    component_indices,
                    prop_indices,
                    &child_tree,
                    Some(name.clone()),
                    component_type_counter,
                )?;

                if let Some(child_name) = child_name_if_not_error {
                    children.push(ComponentChild::Component(child_name));
                }
            },
        }
    }


    let component_node = MLComponent {
        name: name.clone(),
        parent,
        children,

        copy_source: component_tree.props.copy_source.clone(),
        copy_prop: component_tree.props.copy_prop.clone(),
        prop_index: vec![],
        component_index: vec![],

        static_attributes,

        definition,
    };

    components.insert(name.clone(), component_node);
    attributes.insert(name.clone(), component_attributes);

    // The empty component and prop index will be filled when macros are parsed.
    // Store them in separate HashMaps until they are ready.
    component_indices.insert(name.clone(), component_tree.props.component_index.clone());
    prop_indices.insert(name.clone(), component_tree.props.prop_index.clone());

    return Ok(Some(name));
}



fn parse_attributes_and_macros(
    components: &HashMap<ComponentName, MLComponent>,
    attributes: HashMap<ComponentName, HashMap<AttributeName, String>>,
    prop_indices: HashMap<ComponentName, Option<String>>,
    component_indices: HashMap<ComponentName, Option<String>>,
) -> (
    HashMap<ComponentName, HashMap<usize, Vec<ObjectName>>>,
    Vec<MLComponent>,
    HashMap<ComponentName, HashMap<AttributeName, HashMap<usize, Vec<ObjectName>>>>,
    HashMap<ComponentName, Vec<ObjectName>>,
    HashMap<ComponentName, Vec<ObjectName>>,
    )
{
    use std::iter::repeat;

    let mut attributes_parsed = HashMap::new();
    let mut prop_indices_parsed = HashMap::new();
    let mut component_indices_parsed = HashMap::new();

    // Keyed by the component name and by the original position of the child we are replacing
    let mut replacement_children: HashMap<ComponentName, HashMap<usize, Vec<ObjectName>>> = HashMap::new();
    let mut components_to_add: Vec<MLComponent> = vec![];

    let mut macro_copy_counter: HashMap<ComponentName, usize> = HashMap::new();
    

    // This iterator gives info for every string child:
    // (original index of child, string value, component)
    let all_string_children = components.iter()
        .flat_map(|(_, comp)|
            comp.children
            .iter()
            .enumerate()
            .filter_map(|(id, child)| {
                match child {
                    ObjectName::String(string_val) => Some((id, string_val)),
                    _ => None,
                }
            })
            .zip(repeat(comp))
            .map(|((id, val), comp)| (id, val, comp))
        );

    let all_attributes = attributes.iter()
        .flat_map(|(name, attrs)|
            attrs
            .iter()
            .map(|(attr_name, val)| (*attr_name, val, components.get(name).unwrap()))
            .collect::<Vec<(AttributeName, &String, &MLComponent)>>()
        );

    // Component string children
    for (child_id, string_val, component) in all_string_children {

        let objects = apply_macro_to_string(
            string_val,
            &component.name,
            components,
            &mut macro_copy_counter,
            &mut components_to_add
        );

        // For now, replace everything in the children field
        replacement_children
            .entry(component.name.clone()).or_insert(HashMap::new())
            .entry(child_id).or_insert(objects);
    }

    // Attributes
    for (attribute_name, string_val, component) in all_attributes {

        // The reason this uses a HashMap of usizes instead of another Vec is because
        // later we might want to specify arrays of arrays in the attribute, so the key
        // might be more complicated than an integer.
        let objects: HashMap<usize, Vec<ObjectName>> = string_val.split(' ')
            .enumerate()
            .map(|(index, string_element)|

                // DoenetML is 1-indexed
                (index + 1,
                    apply_macro_to_string(
                        string_element.trim(),
                        &component.name,
                        components,
                        &mut macro_copy_counter,
                        &mut components_to_add,
                    )
                )
            ).collect();

        attributes_parsed
            .entry(component.name.clone()).or_insert(HashMap::new())
            .entry(attribute_name.clone()).or_insert(objects);
    }

    // Prop indices
    for (target_name, source_index_str) in prop_indices {
        
        let index_objects = match source_index_str {
            Some(string) => apply_macro_to_string(
                &string,
                &target_name,
                components,
                &mut macro_copy_counter,
                &mut components_to_add
            ),
            None => vec![],
        };

        prop_indices_parsed.insert(target_name, index_objects);
    }

    // Component indices
    for (target_name, source_index_str) in component_indices {
        
        let index_objects = match source_index_str {
            Some(string) => apply_macro_to_string(
                &string,
                &target_name,
                components,
                &mut macro_copy_counter,
                &mut components_to_add
            ),
            None => vec![],
        };

        component_indices_parsed.insert(target_name,index_objects);
    }

    (
        replacement_children,
        components_to_add,
        attributes_parsed,
        prop_indices_parsed,
        component_indices_parsed,
    )
}

lazy_static! {
    static ref COMPONENT: Regex = Regex::new(r"[a-zA-Z_]\w*").unwrap();
}
lazy_static! {
    static ref PROP: Regex = Regex::new(r"[a-zA-Z]\w*").unwrap();
}
lazy_static! {
    static ref INDEX: Regex = Regex::new(r" *(\d+|\$)").unwrap();
}
lazy_static! {
    static ref INDEX_END: Regex = Regex::new(r" *]").unwrap();
}
lazy_static! {
    static ref MACRO_BEGIN: Regex = Regex::new(r"\$").unwrap();
}

fn apply_macro_to_string(
    string: &str,
    component_name: &ComponentName,
    components: &HashMap<ComponentName, MLComponent>,
    macro_copy_counter: &mut HashMap<ComponentName, usize>,
    components_to_add: &mut Vec<MLComponent>,
) -> Vec<ObjectName> {

    let mut objects = Vec::new();
    let mut previous_end = 0;

    loop {
        if previous_end >= string.len() {
            break;
        }
        let some_next_macro = MACRO_BEGIN.find_at(string, previous_end);
        if some_next_macro.is_none() {
            break;
        }
        let next_macro = some_next_macro.unwrap();

        // Append the regular string until start of macro
        let before = &string[previous_end..next_macro.start()];
        if !before.trim().is_empty() {
            objects.push(ObjectName::String(before.to_string()));
        }

        match macro_comp_ref(string,
            next_macro.end(),
            component_name,
            components,
            macro_copy_counter,
            components_to_add
        ) {
            Ok((macro_name, macro_end)) => {
                previous_end = macro_end;
                objects.push(ObjectName::Component(macro_name));
            },
            Err(msg) => {
                log!("macro failed: {}", msg);
                break;
            }
        }
    }

    // Append until the end
    let last = &string[previous_end..];
    if !last.is_empty() {
        objects.push(ComponentChild::String(last.to_string()));
    }

    objects
}

fn regex_at<'a>(regex: &Regex, string: &'a str, at: usize) -> Result<regex::Match<'a>, String> {
    regex.find_at(string, at)
        .and_then(|m| {
            if m.start() == at {Some(m)} else {None}
        })
        .ok_or(format!("regex {:?} not found at index {} of {}", regex, at, string))
}

fn macro_comp_ref(
    string: &str,
    start: usize,
    macro_parent: &ComponentName,
    components: &HashMap<ComponentName, MLComponent>,
    macro_copy_counter: &mut HashMap<ComponentName, usize>,
    components_to_add: &mut Vec<MLComponent>,
) -> Result<(ComponentName, usize), String> {

    log_debug!("macro at {} of {}", start, string);

    let comp_match = regex_at(&COMPONENT, string, start)?;

    let name: String;
    let definition: &ComponentDefinition;
    let copy_source = comp_match.as_str().to_string();
    let component_index: Vec<ObjectName>;
    let copy_prop: Option<String>;
    let prop_index: Vec<ObjectName>;

    let source_component = components.get(&copy_source).ok_or(format!("The component {} does not exist", copy_source))?;

    let char_at = |c: usize| string.as_bytes().get(c).map(|c| *c as char);

    // Handle possible component index: brackets after the component name
    let comp_end;
    let source_def;
    if char_at(comp_match.end()) == Some('[') {
        // group member
        let index_match = regex_at(&INDEX, string, comp_match.end() + 1)?;
        let index_str = index_match.as_str();
        let index_end: usize;
        if index_str == "$" {
            // dynamic component index
            panic!("dynamic component index not implemented");
        } else {
            // static component index
            component_index = vec![ObjectName::String(index_str.trim().to_string())];
            index_end = index_match.end();
        }
        let close_bracket_match = regex_at(&INDEX_END, string, index_end)?;
        comp_end = close_bracket_match.end();

        let group_definition = source_component.definition.group.ok_or(
            format!("Component {} cannot be indexed", copy_source)
        )?;

        let source_type = (group_definition.component_type)(
            &source_component.static_attributes
        );
        source_def = *COMPONENT_DEFINITIONS.get(source_type).unwrap();
    } else {
        // no component index
        comp_end = comp_match.end();
        component_index = vec![];
        source_def = source_component.definition;
    };

    // Handle possible copy prop: dot then state variable
    let macro_end;
    if char_at(comp_end) == Some('.') {
        let prop_match = regex_at(&PROP, string, comp_end + 1)?;
        let prop = prop_match.as_str();

        let variant = match source_def.state_var_definitions.get(prop) {
            Some(v) => v,
            None => source_def.state_var_definitions.get(
                source_def.array_aliases.get(prop)
                .ok_or(format!("prop doesn't exist on {:?}", source_def))?
                .name()
            ).unwrap(),
        };

        // Handle possible prop index: brackets after the prop name
        if string.as_bytes().get(prop_match.end()) == Some(&b'[') {

            if !variant.is_array() {
                return Err(format!("{}.{} cannot be indexed", copy_source, prop));
            }

            let index_match = regex_at(&INDEX, string, prop_match.end() + 1)?;
            let index_str = index_match.as_str().trim();
            let index_end: usize;
            if index_str == "$" {
                // dynamic index
                // TODO: multiple components in []
                let (index_name, index_macro_end) = macro_comp_ref(string,
                    index_match.end(),
                    &copy_source,
                    components,
                    macro_copy_counter,
                    components_to_add,
                )?;

                index_end = index_macro_end;
                prop_index = vec![ObjectName::Component(index_name.clone())];
            } else {
                // static index
                index_end = index_match.end();
                prop_index = vec![ObjectName::String(index_str.to_string())];
            }
            let close_bracket_match = regex_at(&INDEX_END, string, index_end)?;
            macro_end = close_bracket_match.end();
        } else {
            // no index
            macro_end = prop_match.end();
            prop_index = vec![];
        }

        let source_comp_sv_name = format!("{}:{}", copy_source, prop);

        definition = &COMPONENT_DEFINITIONS
            .get(default_component_type_for_state_var(variant))
            .unwrap();

        name = name_macro_component(
            &source_comp_sv_name,
            macro_parent,
            macro_copy_counter,
        );
        copy_prop = Some(prop.to_string());

    } else {
        // no prop
        copy_prop = None;
        prop_index = vec![];

        name = name_macro_component(
            &copy_source,
            macro_parent,
            macro_copy_counter,
        );
        definition = source_def;

        macro_end = comp_end;
    };

    let macro_copy = MLComponent {
        name,
        parent: Some(macro_parent.clone()),
        children: vec![],

        copy_source: Some(copy_source),
        copy_prop,
        component_index,
        prop_index,

        static_attributes: HashMap::new(),

        definition,
    };
    let macro_name = macro_copy.name.clone();
    components_to_add.push(macro_copy);

    Ok((macro_name, macro_end))
}



fn default_component_type_for_state_var(component: &StateVarVariant)
    -> ComponentType {

    match component {
        StateVarVariant::Boolean(_) => "boolean",
        StateVarVariant::Integer(_) => "number",
        StateVarVariant::NumberArray(_) |
        StateVarVariant::Number(_) => "number",
        StateVarVariant::StringArray(_) |
        StateVarVariant::String(_) => "text",
    }
}

fn name_macro_component(
    source_name: &str,
    component_name: &String,
    copy_counter: &mut HashMap<ComponentName, usize>,
) -> String {
    let copy_num = copy_counter.entry(source_name.to_string()).or_insert(0);
    *copy_num += 1;

    format!("__mcr:{}({})_{}", source_name, component_name, copy_num)
}


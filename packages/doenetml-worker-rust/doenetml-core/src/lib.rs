use std::collections::HashMap;

use dast::{
    DastElement, DastElementContent, DastFunctionMacro, DastMacro, DastRoot, DastTextMacroContent,
    PathPart,
};
use dast::{DastError, Position as DastPosition};
use regex::Regex;

pub mod dast;
pub mod utils;

use crate::utils::{log, log_debug, log_json};

#[derive(Debug, Clone)]
pub struct ComponentState {
    pub component_ind: ComponentInd,
    pub state_var_ind: StateVarInd,
}

pub type ComponentInd = usize;
pub type StateVarInd = usize;

#[derive(Debug)]
pub struct DoenetMLCore {
    pub dast_root: DastRoot,

    pub components: Vec<ComponentNode>,
    // for the ancestor with the ComponentInd given by the vector index,
    // map a string to the component ind of its unique descendant with the name given by the string
    // pub unique_component_names_in_ancestor: Vec<HashMap<&str, ComponentInd>>,
}

#[derive(Debug)]
pub enum ComponentChild {
    Component(ComponentInd),
    Text(String),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
    Error(DastError),
}

#[derive(Debug)]
pub enum ExtendSource {
    Component(ComponentInd),
    // TODO: what about array state variables?
    StateVar((ComponentInd, StateVarInd)),
}

#[derive(Debug)]
pub struct ComponentNode {
    pub ind: ComponentInd,
    pub parent: Option<ComponentInd>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // TODO: do we connect directly to static definition of component type?
    pub component_type: String,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentInd>>,

    pub position: Option<DastPosition>,
}

pub fn create_doenetml_core(
    dast_string: &str,
    doenetml: &str,
    flags_string: &str,
) -> Result<DoenetMLCore, String> {
    log!("create doenetml_core");

    let dast_root: DastRoot = serde_json::from_str(dast_string).expect("Error extracting dast");

    log!("dast: {:#?}", dast_root);
    log!("dast: {:#?}", serde_json::to_string(&dast_root).unwrap());

    let mut components: Vec<ComponentNode> = Vec::new();

    // add root not
    components.push(ComponentNode {
        ind: 0,
        parent: None,
        children: Vec::new(),
        extend: None,
        component_type: "_root".to_string(),
        descendant_names: HashMap::new(),
        position: dast_root.position.clone(),
    });

    let (children, descendant_names) =
        create_component_children(&mut components, &dast_root.children, 0);

    components[0].children = children;
    components[0].descendant_names = descendant_names;

    log!("before replace macros {:#?}", components);

    replace_macro_referants(&mut components, 0);

    log!("after replace macros {:#?}", components);

    Ok(DoenetMLCore {
        dast_root,
        components,
    })
}

fn create_component_children(
    components: &mut Vec<ComponentNode>,
    dast_children: &Vec<DastElementContent>,
    parent_ind: ComponentInd,
) -> (Vec<ComponentChild>, HashMap<String, Vec<ComponentInd>>) {
    let mut descendant_names: HashMap<String, Vec<ComponentInd>> = HashMap::new();

    let mut component_children: Vec<ComponentChild> = Vec::new();

    for child in dast_children {
        match child {
            DastElementContent::Element(element) => {
                let component_ind = components.len();

                // TODO: check if valid component type and attach definition
                let component_type = element.name.clone();

                if let Some(name_attr) = element.attributes.get("name") {
                    let mut valid_name = false;
                    let mut msg_option: Option<String> = None;

                    if let Ok(name_string) = name_attr.get_string_value() {
                        let re = Regex::new(r"^[a-zA-Z][a-zA-Z0-9_-]*$").unwrap();

                        if re.is_match(&name_string) {
                            valid_name = true;

                            descendant_names
                                .entry(name_string.to_string())
                                .and_modify(|name_indices| name_indices.push(component_ind))
                                .or_insert(vec![component_ind]);
                        } else {
                            msg_option =
                                    Some("Invalid component name: ".to_owned() + &name_string + ". Must begin with a letter and contain only letters, numbers, hyphens, and underscores.")
                        }
                    }

                    if !valid_name {
                        component_children.push(ComponentChild::Error(DastError {
                            message: msg_option.unwrap_or("Invalid component name".to_owned()),
                            position: None,
                        }))
                    }
                }

                let child_ind = components.len();

                components.push(ComponentNode {
                    ind: component_ind,
                    parent: Some(parent_ind),
                    children: Vec::new(),
                    extend: None,
                    component_type,
                    descendant_names: HashMap::new(),
                    position: element.position.clone(),
                });

                let (child_children, child_descendent_names) =
                    create_component_children(components, &element.children, component_ind);

                let child_node = &mut components[child_ind];

                child_node.children = child_children;
                child_node.descendant_names = child_descendent_names.clone();

                for (comp_name, mut name_inds) in child_descendent_names {
                    descendant_names
                        .entry(comp_name)
                        .and_modify(|name_indices| name_indices.append(&mut name_inds))
                        .or_insert(name_inds);
                }
                component_children.push(ComponentChild::Component(component_ind));
            }
            DastElementContent::Text(text) => {
                component_children.push(ComponentChild::Text(text.value.clone()));
            }
            DastElementContent::Macro(dast_macro) => {
                // for now, just stick in the dast macro
                component_children.push(ComponentChild::Macro(dast_macro.clone()));
            }
            DastElementContent::FunctionMacro(function_macro) => {
                // for now, just stick in the dast function macro,
                // which clearly is wrong as it will include elements as children
                component_children.push(ComponentChild::FunctionMacro(function_macro.clone()));
            }
            DastElementContent::Error(error) => {
                // for now, just stick in the dast error
                component_children.push(ComponentChild::Error(error.clone()));
            }
        }
    }

    (component_children, descendant_names)
}

fn replace_macro_referants(components: &mut Vec<ComponentNode>, component_ind: ComponentInd) {
    log!("find macro references with parent {}", component_ind);

    // We need to temporarily put in an empty vector into the children field
    // and move the children into a separate vector.
    // Otherwise, we cannot take ownership of the vectors components using .into_iter()
    let old_children = std::mem::replace(&mut components[component_ind].children, vec![]);

    components[component_ind].children = old_children
        .into_iter()
        .map(|child| {
            match child {
                ComponentChild::Component(child_ind) => {
                    // recurse on component children
                    replace_macro_referants(components, child_ind);
                    child
                }
                ComponentChild::Macro(ref dast_macro) => {
                    log!(
                        "found macro with parent {}: {:?}",
                        component_ind,
                        dast_macro.path
                    );
                    if let Some((matched_ind, path_remainder)) =
                        match_name_reference(&components, &dast_macro.path, component_ind)
                    {
                        log!(
                            "found matched ind {} with path {:?}",
                            matched_ind,
                            path_remainder
                        );

                        let new_ind = components.len();

                        // TODO: if have leftover path, determine state variable it refers to
                        let extend_source = ExtendSource::Component(matched_ind);
                        components.push(ComponentNode {
                            ind: new_ind,
                            parent: Some(component_ind),
                            children: vec![],
                            extend: Some(extend_source),
                            component_type: components[matched_ind].component_type.clone(),
                            descendant_names: HashMap::new(),
                            position: None,
                        });
                        ComponentChild::Component(new_ind)
                    } else {
                        log!("Did not not match to path {:?}", dast_macro.path);
                        child
                    }
                }
                // TODO: need to recurse to arguments of function macros
                _ => child,
            }
        })
        .collect();
}

fn match_name_reference<'a>(
    components: &Vec<ComponentNode>,
    path: &'a Vec<PathPart>,
    comp_ind: ComponentInd,
) -> Option<(ComponentInd, &'a [PathPart])> {
    let comp = &components[comp_ind];

    // TODO: handle index of path

    if let Some(matched_inds) = comp.descendant_names.get(&path[0].name) {
        if matched_inds.len() == 1 {
            // matched initial part of the macro path
            // check if can match any additional parts of the path
            return match_descendant_names(components, &path[1..], matched_inds[0]);
        } else {
            return None;
        }
    } else if let Some(parent_ind) = comp.parent {
        return match_name_reference(components, path, parent_ind);
    } else {
        return None;
    }
}

fn match_descendant_names<'a>(
    components: &Vec<ComponentNode>,
    path: &'a [PathPart],
    comp_ind: ComponentInd,
) -> Option<(ComponentInd, &'a [PathPart])> {
    if path.len() > 0 {
        let comp = &components[comp_ind];

        // TODO: handle index of path

        if let Some(matched_inds) = comp.descendant_names.get(&path[0].name) {
            if matched_inds.len() == 1 {
                // matched initial part of the macro path
                // check if can match any additional parts of the path
                return match_descendant_names(components, &path[1..], matched_inds[0]);
            }
        }
    }

    Some((comp_ind, path))
}

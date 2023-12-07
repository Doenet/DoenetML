use std::collections::HashMap;

use dast::{
    DastElement, DastElementContent, DastError, DastFunctionMacro, DastMacro, DastRoot, DastText,
    ElementData, PathPart, Position as DastPosition,
};

use dast_flattened::{FlatDastElement, FlatDastElementContent};
use regex::Regex;

pub mod dast;
pub mod dast_flattened;
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
    // TODO: is there a reason to keep the original dast around?
    // This dast is currently not modified when macros are replaced or other interactions
    pub dast_root: DastRoot,

    pub components: Vec<ComponentNode>,

    // The original DoenetML string
    // Main use is for components and properties that extract portions of the DoenetML
    pub doenetml: String,
}

impl DoenetMLCore {
    pub fn to_flat_dast(&self) -> Vec<FlatDastElement> {
        self.components
            .iter()
            .map(|comp| comp.to_flat_dast(&self.components))
            .collect()
    }
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

impl ComponentNode {
    pub fn to_flat_dast(&self, components: &Vec<ComponentNode>) -> FlatDastElement {
        // if extending a source that is a component,
        // add children from that source first
        let mut children = if let Some(extend_source) = &self.extend {
            match extend_source {
                ExtendSource::Component(source_ind) => {
                    let source_dast = components[*source_ind].to_flat_dast(components);

                    source_dast.children
                }
                ExtendSource::StateVar((_source_ind, _source_var_ind)) => {
                    // TODO: state variable extend source
                    Vec::new()
                }
            }
        } else {
            Vec::new()
        };

        // children from the component itself come after children the extend source
        let mut children2: Vec<FlatDastElementContent> = self
            .children
            .iter()
            .filter_map(|child| match child {
                ComponentChild::Component(comp_ind) => {
                    Some(FlatDastElementContent::Element(*comp_ind))
                }
                ComponentChild::Text(s) => Some(FlatDastElementContent::Text(s.to_string())),
                ComponentChild::Macro(the_macro) => None,
                ComponentChild::FunctionMacro(function_macro) => None,
                ComponentChild::Error(error) => Some(FlatDastElementContent::Error(error.clone())),
            })
            .collect();

        children.append(&mut children2);

        // TODO: attributes

        FlatDastElement {
            name: self.component_type.clone(),
            attributes: HashMap::new(),
            children,
            data: Some(ElementData { id: self.ind }),
            position: self.position.clone(),
        }
    }
}

pub fn create_doenetml_core(
    dast_string: &str,
    doenetml: &str,
    flags_string: &str,
) -> Result<DoenetMLCore, String> {
    let dast_root: DastRoot = serde_json::from_str(dast_string).expect("Error extracting dast");

    let mut components: Vec<ComponentNode> = Vec::new();

    // add root node
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

    replace_macro_referants(&mut components, 0);

    // log!("after replace macros {:#?}", components);

    let core = DoenetMLCore {
        dast_root,
        components,
        doenetml: doenetml.to_string(),
    };

    Ok(core)
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
            DastElementContent::Element(child_element) => {
                // For element children, both create component and add to descendant names:
                // 1. Look for a name attribute with valid value and add to descendant names.
                // 2. Create component for the child
                // 3. Recurse to child's children, and add in any descendant names found

                // TODO: need to add attributes and determine approach for component types

                let child_ind = components.len();

                // TODO: check if valid component type and attach definition
                let component_type = child_element.name.clone();

                if let Some(name_attr) = child_element.attributes.get("name") {
                    let mut valid_name = false;
                    let mut msg_option: Option<String> = None;

                    if let Ok(name_string) = name_attr.get_string_value() {
                        let re = Regex::new(r"^[a-zA-Z][a-zA-Z0-9_-]*$").unwrap();

                        if re.is_match(&name_string) {
                            // We found a valid name.
                            // Add the child's index to the descendant_names vector for that name
                            // (or create an entry with a vector consisting of just this index).
                            descendant_names
                                .entry(name_string.to_string())
                                .and_modify(|name_indices| name_indices.push(child_ind))
                                .or_insert(vec![child_ind]);

                            valid_name = true;
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

                // even though don't yet have all information for child (i.e., from its children),
                // create its component before recursing to its children,
                // so that its index will be child_ind
                components.push(ComponentNode {
                    ind: child_ind,
                    parent: Some(parent_ind),
                    children: Vec::new(),
                    extend: None,
                    component_type,
                    descendant_names: HashMap::new(),
                    position: child_element.position.clone(),
                });

                let (child_children, child_descendent_names) =
                    create_component_children(components, &child_element.children, child_ind);

                let child_node = &mut components[child_ind];

                child_node.children = child_children;
                child_node.descendant_names = child_descendent_names.clone();

                // merge in the descendant names found from the child
                // into the overall descedant names for the parent
                for (comp_name, mut name_inds) in child_descendent_names {
                    descendant_names
                        .entry(comp_name)
                        .and_modify(|name_indices| name_indices.append(&mut name_inds))
                        .or_insert(name_inds);
                }
                component_children.push(ComponentChild::Component(child_ind));
            }
            DastElementContent::Text(child_text) => {
                component_children.push(ComponentChild::Text(child_text.value.clone()));
            }
            DastElementContent::Macro(child_macro) => {
                // for now, just stick in the dast macro
                component_children.push(ComponentChild::Macro(child_macro.clone()));
            }
            DastElementContent::FunctionMacro(child_function_macro) => {
                // for now, just stick in the dast function macro,
                // which clearly is wrong as it will include elements as children
                component_children
                    .push(ComponentChild::FunctionMacro(child_function_macro.clone()));
            }
            DastElementContent::Error(child_error) => {
                // for now, just stick in the dast error
                component_children.push(ComponentChild::Error(child_error.clone()));
            }
        }
    }

    (component_children, descendant_names)
}

fn replace_macro_referants(components: &mut Vec<ComponentNode>, component_ind: ComponentInd) {
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
                    if let Some((matched_ind, path_remainder)) =
                        match_name_reference(&components, &dast_macro.path, component_ind)
                    {
                        let new_ind = components.len();

                        // TODO: if have leftover path (stored in path_remainder),
                        // determine state variable it refers to
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
                        // did not match macro so just keep it as a macro for now
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
            // If there is more than one component that matches the name,
            // then we have no match (do not recurse to parent).
            // We are assuming there are no zero length vectors,
            // as they are treated in the same way as if there is more than one match.
            return None;
        }
    } else if let Some(parent_ind) = comp.parent {
        // since the initial path piece was not found in this component's descendants,
        // recurse to parent
        return match_name_reference(components, path, parent_ind);
    } else {
        // we reached the root with no match found
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

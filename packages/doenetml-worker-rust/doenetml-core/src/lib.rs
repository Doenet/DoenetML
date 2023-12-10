use std::{cell::RefCell, collections::HashMap, rc::Rc, str::FromStr};

use component::{ComponentEnum, _root::_Root};
use dast::{
    DastElementContent, DastError, DastFunctionMacro, DastMacro, DastRoot, FlatDastElement,
    PathPart,
};

use regex::Regex;

pub mod component;
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
    // TODO: is there a reason to keep the original dast around?
    // This dast is currently not modified when macros are replaced or other interactions
    pub dast_root: DastRoot,

    pub components: Vec<Rc<RefCell<ComponentEnum>>>,

    // pub components_as_traits: Vec<Rc<RefCell<dyn ComponentNode>>>,

    // The original DoenetML string
    // Main use is for components and properties that extract portions of the DoenetML
    pub doenetml: String,
}

impl DoenetMLCore {
    pub fn to_flat_dast(&self) -> Vec<FlatDastElement> {
        self.components
            .iter()
            .map(|comp| comp.borrow().to_flat_dast(&self.components))
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

pub fn create_doenetml_core(
    dast_string: &str,
    doenetml: &str,
    flags_string: &str,
) -> Result<DoenetMLCore, String> {
    let dast_root: DastRoot = serde_json::from_str(dast_string).expect("Error extracting dast");

    let mut components: Vec<Rc<RefCell<ComponentEnum>>> = Vec::new();

    // add root node
    components.push(Rc::new(RefCell::new(ComponentEnum::_Root(_Root::new(
        0,
        None,
        None,
        dast_root.position.clone(),
    )))));

    let (children, descendant_names) =
        create_component_children(&mut components, &dast_root.children, 0);

    // Note: place the following in braces to make sure destructor on refcell is run
    // so that components can be accessed again
    {
        let root_node = &mut components[0].borrow_mut();
        root_node.set_children(children);
        root_node.set_descendant_names(descendant_names);
    }

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
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
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

                match ComponentEnum::from_str(&child_element.name) {
                    Ok(mut component_enum) => {
                        component_enum.initialize(
                            child_ind,
                            Some(parent_ind),
                            child_element.position.clone(),
                        );

                        components.push(Rc::new(RefCell::new(component_enum)));

                        let (child_children, child_descendent_names) = create_component_children(
                            components,
                            &child_element.children,
                            child_ind,
                        );

                        let child_node = &mut components[child_ind].borrow_mut();

                        child_node.set_children(child_children);
                        child_node.set_descendant_names(child_descendent_names.clone());

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
                    Err(_err) => {
                        let err_msg = format!("Invalid component type <{}>", child_element.name);

                        component_children.push(ComponentChild::Error(DastError {
                            message: err_msg,
                            position: child_element.position.clone(),
                        }));
                    }
                }
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

fn replace_macro_referants(
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    component_ind: ComponentInd,
) {
    // We need to temporarily put in an empty vector into the children field
    // and move the children into a separate vector.
    // Otherwise, we cannot take ownership of the vectors components using .into_iter()
    let old_children = components[component_ind]
        .borrow_mut()
        .replace_children(vec![]);

    let new_children = old_children
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

                        let mut new_comp_enum = ComponentEnum::from_str(
                            &components[matched_ind].borrow().get_component_type(),
                        )
                        .unwrap();

                        new_comp_enum.initialize(new_ind, Some(component_ind), None);

                        // TODO: if have leftover path (stored in path_remainder),
                        // determine state variable it refers to
                        new_comp_enum.set_extend(Some(ExtendSource::Component(matched_ind)));

                        components.push(Rc::new(RefCell::new(new_comp_enum)));

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

    components[component_ind]
        .borrow_mut()
        .set_children(new_children);
}

fn match_name_reference<'a>(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a Vec<PathPart>,
    comp_ind: ComponentInd,
) -> Option<(ComponentInd, &'a [PathPart])> {
    let comp = &components[comp_ind].borrow();

    // TODO: handle index of path

    if let Some(matched_inds) = comp.get_descendant_matches(&path[0].name) {
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
    } else if let Some(parent_ind) = comp.get_parent() {
        // since the initial path piece was not found in this component's descendants,
        // recurse to parent
        return match_name_reference(components, path, parent_ind);
    } else {
        // we reached the root with no match found
        return None;
    }
}

fn match_descendant_names<'a>(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a [PathPart],
    comp_ind: ComponentInd,
) -> Option<(ComponentInd, &'a [PathPart])> {
    if path.len() > 0 {
        let comp = &components[comp_ind].borrow();

        // TODO: handle index of path

        if let Some(matched_inds) = comp.get_descendant_matches(&path[0].name) {
            if matched_inds.len() == 1 {
                // matched initial part of the macro path
                // check if can match any additional parts of the path
                return match_descendant_names(components, &path[1..], matched_inds[0]);
            }
        }
    }

    Some((comp_ind, path))
}

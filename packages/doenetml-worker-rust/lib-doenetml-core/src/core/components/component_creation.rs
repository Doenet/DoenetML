use std::{cell::RefCell, collections::HashMap, rc::Rc, str::FromStr};

use crate::{
    components::{ComponentEnum, ComponentNode, _error::_Error, _external::_External},
    dast::{DastElementContent, DastWarning, PathPart},
    ComponentChild, ComponentIdx, ExtendSource, ExtendStateVariableDescription,
    StateVariableShadowingMatch,
};

/// Transform `dast_children` that are elements into components, recursing to their children.
/// Gather names of the descendants for later use in replacing macros.
///
/// Components created are saved to the `components` vector and only their index is returned
/// (as part of `ComponentChild::Component`)
///
/// Strings are turned into `ComponentChild::Text`.
///
/// Macros and FunctionMacros are also left unexpanded and simply turned into their `ComponentChild` variants.
///
/// Errors are turned into components of type "_error" and treated like other components.
///
/// Returns a tuple containing
/// - A vector of the `ComponentChild` variants created from the `dast_children`
/// - A hash map with keys being the component names encountered,
///   and the values being vectors of the component indices where that name was encountered.
pub fn create_component_children(
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    warnings: &mut Vec<DastWarning>,
    dast_children: &Vec<DastElementContent>,
    parent_idx_option: Option<ComponentIdx>,
) -> (Vec<ComponentChild>, HashMap<String, Vec<ComponentIdx>>) {
    let mut descendant_names: HashMap<String, Vec<ComponentIdx>> = HashMap::new();

    let mut component_children: Vec<ComponentChild> = Vec::new();

    for child in dast_children {
        match child {
            DastElementContent::Element(child_element) => {
                // For element children, both create component and add to descendant names:
                // 1. Look for a name attribute with valid value and add to descendant names.
                // 2. Create component for the child
                // 3. Recurse to child's children, and add in any descendant names found

                // TODO: need to add attributes

                let child_idx = components.len();

                if let Some(name_attr) = child_element.attributes.get("name") {
                    if let Ok(name_string) = name_attr.get_string_value() {
                        // Add the child's index to the descendant_names vector for that name
                        // (or create an entry with a vector consisting of just this index).
                        descendant_names
                            .entry(name_string.to_string())
                            .and_modify(|name_indices| name_indices.push(child_idx))
                            .or_insert(vec![child_idx]);
                    }
                }

                // To create a component for child_element,
                // we match the name attribute (which is the component type)
                // to the name of one of the variants of ComponentEnum
                // (a case-insensitive match due to ComponentEnum tagging).

                let mut component_enum = ComponentEnum::from_str(&child_element.name)
                    .unwrap_or_else(|_| {
                        // if we didn't find a match, then create a component of type external
                        ComponentEnum::_External(_External {
                            name: child_element.name.clone(),
                            ..Default::default()
                        })
                    });

                // We have a variant of ComponentEnum
                // corresponding to the name of the DastElement (or _external if no match)
                // where all attributes of the structure were given their default values.
                // Initialize some of the attributes.
                component_enum.initialize(
                    child_idx,
                    parent_idx_option,
                    None,
                    child_element.position.clone(),
                );

                components.push(Rc::new(RefCell::new(component_enum)));

                // recurse to children after adding to components
                // so that will get the correct indices for the children
                let (child_children, child_descendent_names) = create_component_children(
                    components,
                    warnings,
                    &child_element.children,
                    Some(child_idx),
                );

                let child_node = &mut components[child_idx].borrow_mut();

                child_node.set_children(child_children);
                child_node.set_descendant_names(child_descendent_names.clone());

                // merge in the descendant names found from the child
                // into the overall descendant names for the parent
                for (comp_name, mut name_inds) in child_descendent_names {
                    descendant_names
                        .entry(comp_name)
                        .and_modify(|name_indices| name_indices.append(&mut name_inds))
                        .or_insert(name_inds);
                }
                component_children.push(ComponentChild::Component(child_idx));
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
                let child_idx = components.len();

                let mut error = _Error {
                    ..Default::default()
                };
                error.initialize(
                    child_idx,
                    parent_idx_option,
                    None,
                    child_error.position.clone(),
                );

                error.message = child_error.message.clone();

                components.push(Rc::new(RefCell::new(ComponentEnum::_Error(error))));

                component_children.push(ComponentChild::Component(child_idx));
            }
        }
    }

    (component_children, descendant_names)
}

/// Attempt to replace macro children with components that extend the macro referent,
/// recursing to component children.
///
/// Match as much of the macro path as possible to nested component names.
/// If the beginning of the path matches a component, but part of the path remains,
/// match the remainder of the path to the matched component's public state variables.
///
/// If cannot match the beginning of the path to component names or cannot match
/// the first part of the remainder to a state variable, then the macro is left as the child.
///
/// TODO: this features is only partially implemented
/// - Function macros are ignored
/// - The index of a path is ignored
/// - Only the first part of the remainder of a path is used; additional parts are ignored.
pub fn replace_macro_referents(
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) {
    // We need to temporarily put in an empty vector into the children field
    // and move the children into a separate vector.
    // Otherwise, we cannot take ownership of the vectors components using .into_iter()
    let old_children = components[component_idx]
        .borrow_mut()
        .replace_children(vec![]);

    let new_children = old_children
        .into_iter()
        .map(|child| {
            match child {
                ComponentChild::Component(child_idx) => {
                    // recurse on component children
                    replace_macro_referents(components, child_idx);
                    child
                }
                ComponentChild::Macro(ref dast_macro) => {
                    if let Some((matched_component_idx, path_remainder)) =
                        match_name_reference(&components, &dast_macro.path, component_idx)
                    {
                        if path_remainder.len() > 0 {
                            // Have a remaining part of the path that wasn't matched by component names.
                            // Attempt to match it to a public state variable of the component,
                            // returning the macro for now if no match
                            match_public_state_variable(
                                components,
                                path_remainder,
                                matched_component_idx,
                                component_idx,
                            )
                            .unwrap_or(child)
                        } else {
                            let new_idx = components.len();

                            let mut new_comp_enum = ComponentEnum::from_str(
                                components[matched_component_idx]
                                    .borrow()
                                    .get_component_type(),
                            )
                            .unwrap();

                            new_comp_enum.initialize(
                                new_idx,
                                Some(component_idx),
                                Some(ExtendSource::Component(matched_component_idx)),
                                None,
                            );

                            components.push(Rc::new(RefCell::new(new_comp_enum)));

                            ComponentChild::Component(new_idx)
                        }
                    } else {
                        // did not match macro to a component so just keep it as a macro for now
                        child
                    }
                }
                // TODO: need to recurse to arguments of function macros
                _ => child,
            }
        })
        .collect();

    components[component_idx]
        .borrow_mut()
        .set_children(new_children);
}

/// Match the first path part of a macro to a unique descendant name of the component with `comp_idx`.
/// If that is successful, then match as many the remaining path parts to successive descendants.
///
/// If at any stage, we have find multiple matches to a path part, then the whole match is ignored.
///
/// If we match some parts (without later finding a multiple match), then we have a successful match.
///
/// If we do not find any matches (or multiple matches), then recurse to the parent.
///
/// Returns:
/// - the component index and any remaining unmatched paths if we found a successful match
/// - None if we never found any matches or we found a multiple match.
///
/// TODO: this function is incomplete as a path index is ignored
fn match_name_reference<'a>(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a Vec<PathPart>,
    comp_idx: ComponentIdx,
) -> Option<(ComponentIdx, &'a [PathPart])> {
    let comp = &components[comp_idx].borrow();

    // TODO: handle index of path

    if let Some(matched_indices) = comp.get_descendant_matches(&path[0].name) {
        if matched_indices.len() == 1 {
            // matched initial part of the macro path
            // check if can match any additional parts of the path
            return match_descendant_names(components, &path[1..], matched_indices[0]);
        } else {
            // If there is more than one component that matches the name,
            // then we have no match (do not recurse to parent).
            // (We are assuming there are no zero length vectors of descendent matches.)
            return None;
        }
    } else if let Some(parent_idx) = comp.get_parent() {
        // since the initial path piece was not found in this component's descendants,
        // recurse to parent
        return match_name_reference(components, path, parent_idx);
    } else {
        // we reached the root with no match found
        return None;
    }
}

/// Given that we matched an initial part of the macro path, attempt to match
/// as much of the remainder of the path (the `path` argument) to successive descendants.
///
/// If a unique match is found, recurse to the descendants of that match to look for
/// a match with the next part of the path.
///
/// If a multiple match is found, then cancel all the matches.
///
/// Once no match is found or the whole path is used, the match is complete.
///
/// Returns:
/// - The index of the last component matched by the path
/// - any remaining part parts that haven't yet been matched
///
/// TODO: this function is incomplete as a path index is ignored.
fn match_descendant_names<'a>(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a [PathPart],
    comp_idx: ComponentIdx,
) -> Option<(ComponentIdx, &'a [PathPart])> {
    if path.len() > 0 {
        let comp = &components[comp_idx].borrow();

        // TODO: handle index of path

        if let Some(matched_indices) = comp.get_descendant_matches(&path[0].name) {
            if matched_indices.len() == 1 {
                // matched initial part of the macro path
                // check if can match any additional parts of the path
                return match_descendant_names(components, &path[1..], matched_indices[0]);
            } else {
                // If there is more than one component that matches the name,
                // then we have no match (it cancels the match we've found already).
                // (We are assuming there are no zero length vectors of descendent matches.)
                return None;
            }
        }
    }

    Some((comp_idx, path))
}

/// This function is called if a remainder of a macro path is left
/// after matching as many components as possible.
/// It attempts to match the path remainder to a public state variable of the matched component.
///
/// If a (case-insensitive) match of a public state variable to the path name is found,
/// then create a component that will extend the value of that state variable.
/// The component will receive an ExtendSource specifying that it should shadow the matched state variable.
/// The component is added to the components vector and a `ComponentChild::Component`` referencing
/// that new component is returned.
///
/// If a public state variable is not found, then the match is canceled.
///
/// Returns:
/// - a `ComponentChild::Component`` referencing the newly created component if a match is found
/// - None if no match is found
///
/// TODO: this function is incomplete as path index and multiple path parts are ignored.
fn match_public_state_variable<'a>(
    components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    path: &'a [PathPart],
    matched_component_idx: ComponentIdx,
    parent_idx: ComponentIdx,
) -> Option<ComponentChild> {
    // attempt to match the next part of the path to a public state variable
    // of matched_component

    // TODO: handle index of path

    // TODO: handle multiple parts of path. Currently ignoring all parts after the first.

    let new_idx = components.len();
    let matched_state_var_name: &str;
    let component_type;

    {
        let matched_component = components[matched_component_idx].borrow();

        let matched_state_var_idx =
            matched_component.get_state_variable_index_from_name_case_insensitive(&path[0].name)?;

        if !matched_component
            .get_public_state_variable_indices()
            .contains(&matched_state_var_idx)
        {
            // don't match if not a public state variable
            return None;
        }

        // We found a public state variable that matched the first part of the path.
        // Since we are ignoring the rest of the path and the index for now, this is the match.
        let state_var = &matched_component.get_state_variables()[matched_state_var_idx];

        matched_state_var_name = state_var.get_name();

        component_type = state_var.get_default_component_type();
    }

    let mut new_comp_enum = ComponentEnum::from_str(component_type).unwrap();

    // Create extend source assuming that the shadowing index of the component
    // is its first state variable.
    // The component's initialize function can change the shadowing_idx if needed.
    let extend_source = ExtendSource::StateVar(ExtendStateVariableDescription {
        component_idx: matched_component_idx,
        state_variable_matching: vec![StateVariableShadowingMatch {
            shadowing_name: None, // use the primary state variable (as determined by component type)
            shadowed_name: matched_state_var_name,
        }],
    });

    new_comp_enum.initialize(new_idx, Some(parent_idx), Some(extend_source), None);

    components.push(Rc::new(RefCell::new(new_comp_enum)));

    Some(ComponentChild::Component(new_idx))
}

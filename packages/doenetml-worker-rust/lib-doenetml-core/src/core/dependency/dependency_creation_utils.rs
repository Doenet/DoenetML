use std::{cell::RefCell, rc::Rc};

use crate::{
    attribute::AttributeName,
    components::{prelude::ComponentState, ComponentEnum, ComponentNode, ComponentProfile},
    ComponentIdx, ComponentPointerTextOrMacro, ExtendSource,
};

use super::{Dependency, DependencySource};

/// Create a Dependency on a state variable if we can find a StateVariableShadowingMatch
/// from `extending` where `state_var_idx` is the shadowing state variable
/// and the shadowed stat variable matches a profile from `match_profiles`.
pub fn create_dependency_from_extend_source_if_matches_profile(
    extending: Option<&ExtendSource>,
    state_var_idx: usize,
    match_profiles: &[ComponentProfile],
    components: &[Rc<RefCell<ComponentEnum>>],
) -> Option<Dependency> {
    // If extending from a `state_var`,
    // then check to see if it has a shadowing match where `state_var_idx` is the shadowing state var.
    // If so then check if the state variable matches a `ComponentProfile`,
    // creating a `Dependency` if found.

    extending.and_then(|extend_source| match extend_source {
        ExtendSource::StateVar(description) => description
            .state_variable_matching
            .iter()
            .find(|state_var_match| {
                // We look for a state variable match where shadowing_idx is state_var_idx.
                state_var_match.shadowing_state_var_idx == state_var_idx
            })
            .and_then(|var_match| {
                // We found a match to state_var_idx.
                // Next, check if this match is of the correct type
                // by determining the `ComponentProfile` of the state variable
                // and checking if it matches `match_profiles`.

                // Note: we are ignoring `exclude_if_prefer_profiles` because
                // the main purpose of this check is to verify that we have an appropriate type,
                // rather than filter out possible matches.
                // We assume if an `ExtendSource` was created, it should be used if it matches.

                let source_component = components[description.component_idx].borrow();
                let source_state_var = source_component
                    .get_state_variable(var_match.shadowed_state_var_idx)
                    .unwrap();

                let sv_profile = source_state_var.get_matching_component_profile();

                match_profiles.contains(&sv_profile).then(|| Dependency {
                    source: DependencySource::StateVar {
                        component_idx: description.component_idx,
                        state_var_idx: var_match.shadowed_state_var_idx,
                    },
                    value: source_state_var.create_new_read_only_view(),
                })
            }),
        _ => None,
    })
}

/// Return a vector of (child, parent_idx) tuples from the children of a component
/// and children of any extend sources.
///
/// Since children from extend sources will have a different parent,
/// we include the parent index in the output.
pub fn get_children_with_parent_including_from_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> Vec<(ComponentPointerTextOrMacro, ComponentIdx)> {
    let component = components[component_idx].borrow();

    let mut children_vec =
        if let Some(&ExtendSource::Component(source_idx)) = component.get_extending() {
            get_children_with_parent_including_from_extend_source(components, source_idx)
        } else {
            Vec::new()
        };

    children_vec.extend(
        component
            .get_children()
            .iter()
            .map(|c| (c.clone(), component_idx)),
    );

    children_vec
}

/// If the component has an extend source of `Component` type,
/// return the component index of that extend source,
/// except recurse until the component index of the original source is found.
///
/// When we store essential data, we store it with this original source index,
/// allowing copies to share the same essential data as the source.
pub fn get_component_extend_source_origin(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> ComponentIdx {
    match &components[component_idx].borrow().get_extending() {
        Some(&ExtendSource::Component(source_idx)) => {
            get_component_extend_source_origin(components, source_idx)
        }
        _ => component_idx,
    }
}

/// Return the attribute children for `attribute`,
/// falling back to the attribute children of any extend source if none found for the component.
///
/// Returns an option of a tuple with components
/// - a vector of the attribute children found
/// - the index of the parent where those attribute children were found.
pub fn get_attribute_children_with_parent_falling_back_to_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
    attribute: AttributeName,
) -> Option<(Vec<ComponentPointerTextOrMacro>, ComponentIdx)> {
    let component = components[component_idx].borrow();

    component
        .get_attribute_children_for_attribute(attribute)
        .and_then(|attribute_children| {
            if attribute_children.is_empty() {
                if let Some(&ExtendSource::Component(source_idx)) = component.get_extending() {
                    return get_attribute_children_with_parent_falling_back_to_extend_source(
                        components, source_idx, attribute,
                    );
                }
            }
            Some((attribute_children.clone(), component_idx))
        })
}

//! A `ComponentBuilder` turns DAST components into fully hydrated components that are ready for use in Core.
//! Unlike DAST, which is schema agnostic, components represent element types that are actually implemented in DoenetML.

use std::{collections::HashMap, str::FromStr};

use anyhow::anyhow;

use crate::{
    components::{prelude::ComponentState, ComponentAttributes, ComponentNode},
    dast::{
        flat_dast::{FlatElement, NormalizedNode, NormalizedRoot, Source},
        macro_resolve::RefResolution,
    },
    state::StateVarIdx,
    ComponentIdx, ExtendSource, ExtendStateVariableDescription, StateVariableShadowingMatch,
};

use super::{ComponentEnum, ComponentProfile, _error::_Error, _external::_External};

pub struct ComponentBuilder {
    /// Hydrated components that are ready for use in Core.
    pub components: Vec<ComponentEnum>,
}

impl Default for ComponentBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl ComponentBuilder {
    pub fn new() -> Self {
        Self {
            components: Vec::new(),
        }
    }

    pub fn from_normalized_root(normalized_root: &NormalizedRoot) -> Self {
        let components = normalized_root
            .nodes
            .iter()
            .enumerate()
            .map(|(idx, node)| match node {
                NormalizedNode::Element(elm) => {
                    let mut component = ComponentEnum::from_str(&elm.name).unwrap_or_else(|_| {
                        // If we didn't find a match, then create a component of type external
                        ComponentEnum::_External(_External {
                            name: elm.name.clone(),
                            ..Default::default()
                        })
                    });

                    if let Some(Source::Macro(ref_resolution)) = &elm.extending {
                        // Some components specify that when they are referenced with the `$foo` syntax,
                        // a different component should be created in their place. E.g., `<textInput name="i" />$i`
                        // should become `<textInput name="i" /><text extend="$i` />`.
                        // This information is stored in `ref_transmutes_to()`.
                        if ref_resolution.unresolved_path.is_none() {
                            if let Some(name) = component.ref_transmutes_to() {
                                // It is forbidden to expand to an invalid component type, so we do not
                                // have a fallback to `_External` here.
                                component = ComponentEnum::from_str(name).unwrap();
                            }
                        }
                    }

                    let extending_from_state_variable_profile =
                        determine_extending_state_var_profile(
                            elm.extending.as_ref(),
                            &normalized_root.nodes,
                        )
                        .map(|(component_type, sv_idx, sv_profile)| {
                            // At this point, we just need to create the correct type of component.
                            // Details for extending from this state variable will be calculated below.
                            component = ComponentEnum::from_str(component_type).unwrap();
                            (sv_idx, sv_profile)
                        });

                    // XXX: we temporarily fill each required attribute with an empty vector.
                    // This will be removed when typed attributes are integrated.
                    let attributes: HashMap<&'static str, _> = HashMap::from_iter(
                        component
                            .get_attribute_names()
                            .iter()
                            .map(|&name| (name, Vec::new())),
                    );

                    let extending = determine_extending(
                        elm.extending.as_ref(),
                        &component,
                        &normalized_root.nodes,
                        extending_from_state_variable_profile,
                    );

                    let extending = match extending {
                        Err(error) => {
                            component = ComponentEnum::_Error(_Error {
                                message: error.to_string(),
                                ..Default::default()
                            });
                            None
                        }
                        Ok(extending) => extending,
                    };

                    component.initialize(
                        elm.idx,
                        elm.parent,
                        extending,
                        HashMap::new(),
                        elm.position.clone(),
                    );
                    // The referenced children may not yet be created as components, but by the end of the loop
                    // they should all be created with the exact same indices as the `normalized_flat_dast` indices.
                    component.set_children(elm.children.clone());
                    component.set_attribute_children(attributes);
                    // Small sanity check. We are assuming the component indices and the `normalized_flat_dast` indices are the same.
                    assert_eq!(idx, elm.idx, "Index misalignment while creating components");
                    component
                }
                NormalizedNode::Error(e) => {
                    let mut error = _Error::new();
                    error.initialize(e.idx, e.parent, None, HashMap::new(), e.position.clone());
                    // Small sanity check. We are assuming the component indices and the `normalized_flat_dast` indices are the same.
                    assert_eq!(idx, e.idx, "Index misalignment while creating components");
                    ComponentEnum::_Error(error)
                }
            })
            .collect();

        Self { components }
    }
}

fn determine_extending_state_var_profile(
    original_extending: Option<&Source<RefResolution>>,
    nodes: &[NormalizedNode],
) -> Option<(&'static str, StateVarIdx, ComponentProfile)> {
    if let Some(ref_resolution) = original_extending {
        let ref_resolution = ref_resolution.get_resolution();
        // If there is no remaining path, we are extending a component directly. Otherwise,
        // we look up the state variable on that component and extend it.
        if let Some(unresolved_path) = &ref_resolution.unresolved_path {
            if unresolved_path.len() == 1 {
                match &nodes[ref_resolution.node_idx] {
                    NormalizedNode::Element(extend_from_elm) => {
                        match ComponentEnum::from_str(&extend_from_elm.name) {
                            Ok(temp_component) => {
                                // TODO: handle case with nested state variables.
                                // (No need to create an error here, as it will get caught below)
                                if let Some(state_var_idx) = temp_component
                                    .get_public_state_variable_index_from_name_case_insensitive(
                                        &unresolved_path[0].name,
                                    )
                                {
                                    // We found a public state variable that matched the remaining path.
                                    let state_var =
                                        &temp_component.get_state_variable(state_var_idx).unwrap();

                                    let sv_profile = temp_component
                                        .get_state_variable(state_var_idx)
                                        .unwrap()
                                        .get_matching_component_profile();

                                    return Some((
                                        state_var.get_default_shadowing_component_type(),
                                        state_var_idx,
                                        sv_profile,
                                    ));
                                } else {
                                    return None;
                                }
                            }
                            Err(_) => return None,
                        }
                    }
                    NormalizedNode::Error(_) => return None,
                }
            }
        }
    }
    None
}

fn determine_extending(
    original_extending: Option<&Source<RefResolution>>,
    component: &ComponentEnum,
    nodes: &[NormalizedNode],
    extending_from_state_variable_profile: Option<(StateVarIdx, ComponentProfile)>,
) -> Result<Option<ExtendSource>, anyhow::Error> {
    match original_extending {
        Some(ref_resolution) => {
            let ref_resolution = ref_resolution.get_resolution();
            // If there is no remaining path, we are extending a component directly. Otherwise,
            // we look up the state variable on that component and extend it.
            if let Some(unresolved_path) = &ref_resolution.unresolved_path {
                if unresolved_path.len() != 1 {
                    return Err(anyhow!("Handle nested state variables"));
                }

                if let Some(profile_tuple) = extending_from_state_variable_profile {
                    extend_from_profiles(component, vec![profile_tuple], ref_resolution.node_idx)
                } else {
                    match &unresolved_path[0].name {
                        x if x.is_empty() => Err(anyhow!("Path indices not yet supported")),
                        _ => Err(anyhow!(
                            "State variable {} not found on component {}",
                            unresolved_path[0].name,
                            component.get_component_type()
                        )),
                    }
                }
            } else {
                match &nodes[ref_resolution.node_idx] {
                    NormalizedNode::Element(elm) => {
                        if elm
                            .name
                            .eq_ignore_ascii_case(component.get_component_type())
                        {
                            Ok(Some(ExtendSource::Component(ref_resolution.node_idx)))
                        } else {
                            extend_from_different_type(elm, component, ref_resolution.node_idx)
                                .map_err(|_| {
                                    anyhow!(
                                        "Cannot extend from {} to {}",
                                        elm.name,
                                        component.get_component_type()
                                    )
                                })
                        }
                    }
                    NormalizedNode::Error(_) => Err(anyhow!("Cannot extend from an error")),
                }
            }
        }
        _ => Ok(None),
    }
}

/// Attempt to extend `component` with `element`, where `element` is a different type than `component`.
///
/// Check if `element` has a component profile state variable that matches one of the profiles
/// that `component` can extend from. If so, return the `ExtendSource` matching the state variables.
/// Otherwise, return an error.
fn extend_from_different_type(
    element: &FlatElement,
    component: &ComponentEnum,
    source_idx: ComponentIdx,
) -> Result<Option<ExtendSource>, anyhow::Error> {
    // create a temporary component based on element
    // so that we can access the state variable information of the component type
    // that would be created from element.
    let temp_component = ComponentEnum::from_str(&element.name)?;
    let state_var_profiles = Vec::from_iter(
        temp_component
            .get_component_profile_state_variable_indices()
            .iter()
            .map(|sv_idx| {
                let temp_sv = temp_component.get_state_variable(*sv_idx).unwrap();
                let temp_profile = temp_sv.get_matching_component_profile();
                (*sv_idx, temp_profile)
            }),
    );

    extend_from_profiles(component, state_var_profiles, source_idx)
}

fn extend_from_profiles(
    component: &ComponentEnum,
    state_var_profiles: Vec<(StateVarIdx, ComponentProfile)>,
    source_idx: ComponentIdx,
) -> Result<Option<ExtendSource>, anyhow::Error> {
    component
        .extends_component_profiles()
        .into_iter()
        .find_map(|(profile, state_var_idx)| {
            // for each profile that `component` can extend from,
            // look to see if `temp_component` has a matching component profile state variable.
            state_var_profiles
                .iter()
                .find_map(|(sv_idx, sv_profile)| {
                    if profile == *sv_profile {
                        // we found a matching profile from temp_component
                        Some(*sv_idx)
                    } else {
                        None
                    }
                })
                .map(|sv_idx| {
                    // Note: this creates a Some of a Some
                    // but we'll turn the outer Some into Ok at the end.
                    Some(ExtendSource::StateVar(ExtendStateVariableDescription {
                        component_idx: source_idx,
                        state_variable_matching: vec![StateVariableShadowingMatch {
                            shadowing_state_var_idx: state_var_idx,
                            shadowed_state_var_idx: sv_idx,
                        }],
                    }))
                })
        })
        .ok_or(anyhow!(""))
}

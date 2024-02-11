//! A `ComponentBuilder` turns DAST components into fully hydrated components that are ready for use in Core.
//! Unlike DAST, which is schema agnostic, components represent element types that are actually implemented in DoenetML.

use std::{collections::HashMap, str::FromStr};

use anyhow::anyhow;
use itertools::Itertools;

use crate::{
    components::{prelude::ComponentState, ComponentAttributes, ComponentNode},
    dast::{
        flat_dast::{NormalizedNode, NormalizedRoot, Source},
        macro_resolve::RefResolution,
    },
    ExtendStateVar, Extending, StateVarShadowingPair,
};

use super::{ComponentEnum, _error::_Error, _external::_External};

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

    /// Creates all `components` but sets all their `extending` fields to `None`.
    /// This is an intermediate step that needs to be done before resolving references in `extending`.
    fn from_normalized_root_without_extending(normalized_root: &NormalizedRoot) -> Self {
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

                    // XXX: we temporarily fill each required attribute with an empty vector.
                    // This will be removed when typed attributes are integrated.
                    let attributes: HashMap<&'static str, _> = HashMap::from_iter(
                        component
                            .get_attribute_names()
                            .iter()
                            .map(|&name| (name, Vec::new())),
                    );

                    component.initialize(
                        elm.idx,
                        elm.parent,
                        None,
                        HashMap::new(),
                        elm.position.clone(),
                    );
                    component.get_extending();
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

    pub fn from_normalized_root(normalized_root: &NormalizedRoot) -> Self {
        let mut builder = Self::from_normalized_root_without_extending(normalized_root);
        for idx in 0..builder.components.len() {
            if !(matches!(&normalized_root.nodes[idx], NormalizedNode::Element(_))) {
                continue;
            };
            let elm = match &normalized_root.nodes[idx] {
                NormalizedNode::Element(elm) => elm,
                _ => unreachable!(),
            };
            let extending = elm.extending.clone().map(|e| e.take_resolution());
            if extending.is_none() {
                continue;
            }
            let ref_resolution = extending.unwrap();
            let component = &builder.components[idx];
            let referent = &builder.components[ref_resolution.node_idx];

            match Self::determine_extending(&ref_resolution, component, referent) {
                Ok(extending) => {
                    builder.components[idx].set_extending(extending);
                }
                Err(err) => {
                    builder.components[idx] = ComponentEnum::_Error(_Error {
                        message: format!("Error while extending: {}", err),
                        ..Default::default()
                    });
                }
            }
        }
        builder
    }

    /// DoenetML coerces the type of `extending` to allow users to be sloppy with types.
    /// For example
    /// ```xml
    /// <textInput name="i" /><text extend="$i" />
    /// ```
    /// would be coerced to
    /// ```xml
    /// <textInput name="i" /><text extend="$i.value" />
    /// ```
    /// since `$i.value` is of `Text` type, where `$i` is a `TextInput` type.
    ///
    /// This coercion is based on _component profiles_ based on the following algorithm:
    ///  1. If the component tag name matches the referent's tag name, no coercion is done.
    ///  2. If the tag names differ, a search is done for a state variable on the referent that matches the preferred profile
    ///     of the component.
    fn determine_extending(
        ref_resolution: &RefResolution,
        component: &ComponentEnum,
        referent: &ComponentEnum,
    ) -> Result<Option<Extending>, anyhow::Error> {
        // If the referent is an error or external, we're immediately done.
        match referent {
            ComponentEnum::_Error(_) => {
                return Err(anyhow!(
                    "Attempted to extend component from an error component"
                ))
            }
            ComponentEnum::_External(_) => {
                return Err(anyhow!(
                    "Attempted to extend component from an external component"
                ))
            }
            _ => {}
        }

        // Handle the case where there is a remaining path
        if let Some(unresolved_path) = &ref_resolution.unresolved_path {
            if unresolved_path.len() != 1 {
                return Err(anyhow!("Nested state variables not implemented yet"));
            }
            if !unresolved_path[0].index.is_empty() {
                return Err(anyhow!("Path indices not yet supported"));
            }
            let referenced_sv_name = &unresolved_path[0].name;
            // Look to see if there is a state variable with a matching name on `referent`
            let referent_sv_idx = referent
                .get_public_state_variable_index_from_name_case_insensitive(referenced_sv_name);
            if referent_sv_idx.is_none() {
                return Err(anyhow!(
                    "State variable {} not found on component {}",
                    referenced_sv_name,
                    referent.get_component_type()
                ));
            }
            let referent_sv_idx = referent_sv_idx.unwrap();
            // We found a public state variable that matched the remaining path.
            let referent_sv = &referent.get_state_variable(referent_sv_idx).unwrap();

            // This is the profile that the referent says it can provide.
            let referent_sv_profile = referent_sv.get_matching_component_profile();

            let extending = component.accepted_profiles().into_iter().find_map(
                |(profile, component_sv_idx)| {
                    if profile == referent_sv_profile {
                        Some(Extending::StateVar(ExtendStateVar {
                            component_idx: referent.get_idx(),
                            state_variable_matching: vec![StateVarShadowingPair {
                                dest_idx: component_sv_idx,
                                source_idx: referent_sv_idx,
                            }],
                        }))
                    } else {
                        None
                    }
                },
            );
            if extending.is_some() {
                return Ok(extending);
            } else {
                return Err(anyhow!("No matching state variable profile found"));
            }
        }
        // If we're here, there is no remaining path.

        // If we are extending a component of the same name, then this is a "component extension",
        // which is treated differently than extending by a state variable.
        if component.get_component_type() == referent.get_component_type() {
            return Ok(Some(Extending::Component(referent.get_idx())));
        }

        // In this case, we know the referent, but we do not know what the _source_ state variable
        // is on `referent` and what the _dest_ state variable is `component`. We do this by searching
        // through the profiles `referent` provides and the profiles `component` accepts and look for a match.

        let extending = component
            .accepted_profiles()
            .into_iter()
            .cartesian_product(referent.accepted_profiles())
            .find_map(
                |((component_profile, component_sv_idx), (referent_profile, referent_sv_idx))| {
                    if component_profile == referent_profile {
                        Some(Extending::StateVar(ExtendStateVar {
                            component_idx: referent.get_idx(),
                            state_variable_matching: vec![StateVarShadowingPair {
                                dest_idx: component_sv_idx,
                                source_idx: referent_sv_idx,
                            }],
                        }))
                    } else {
                        None
                    }
                },
            );
        if extending.is_some() {
            Ok(extending)
        } else {
            Err(anyhow!(
                "Cannot extend from {} to {}",
                component.get_component_type(),
                referent.get_component_type()
            ))
        }
    }
}

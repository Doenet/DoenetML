//! A `ComponentBuilder` turns DAST components into fully hydrated components that are ready for use in Core.
//! Unlike DAST, which is schema agnostic, components represent element types that are actually implemented in DoenetML.

use std::{collections::HashMap, str::FromStr};

use anyhow::anyhow;

use crate::{
    components::{prelude::ComponentState, ComponentAttributes, ComponentNode},
    dast::flat_dast::{NormalizedNode, NormalizedRoot, Source, UntaggedContent},
    ComponentPointerTextOrMacro, ExtendSource, ExtendStateVariableDescription,
    StateVariableShadowingMatch,
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
                    if let Some(Source::Macro(_)) = &elm.extending {
                        // Some components specify that when they are referenced with the `$foo` syntax,
                        // a different component should be created in their place. E.g., `<textInput name="i" />$i`
                        // should become `<textInput name="i" /><text extend="$i` />`.
                        // This information is stored in `ref_transmutes_to()`.
                        if let Some(name) = component.ref_transmutes_to() {
                            // It is forbidden to expand to an invalid component type, so we do not
                            // have a fallback to `_External` here.
                            component = ComponentEnum::from_str(name).unwrap();
                        }
                    }
                    // Some references
                    component.ref_transmutes_to();
                    // XXX: we temporarily fill each required attribute with an empty vector.
                    // This will be removed when typed attributes are integrated.
                    let attributes: HashMap<&'static str, _> = HashMap::from_iter(
                        component
                            .get_attribute_names()
                            .iter()
                            .map(|&name| (name, Vec::new())),
                    );

                    let extending: Result<Option<ExtendSource>, anyhow::Error> =
                        match &elm.extending {
                            Some(ref_resolution) => {
                                let ref_resolution = ref_resolution.get_resolution();
                                // If there is no remaining path, we are extending a component directly. Otherwise,
                                // we look up the state variable on that component and extend it.
                                if let Some(unresolved_path) = &ref_resolution.unresolved_path {
                                    if unresolved_path.len() != 1 {
                                        Err(anyhow!("Handle nested state variables"))
                                    } else {
                                        // We only know how to handle single state variable access at the moment.
                                        if let Some(state_var) = component
                                            .get_state_variable_index_from_name(
                                                &unresolved_path[0].name,
                                            )
                                        {
                                            Ok(Some(ExtendSource::StateVar(
                                                ExtendStateVariableDescription {
                                                    component_idx: ref_resolution.node_idx,
                                                    state_variable_matching: vec![
                                                        StateVariableShadowingMatch {
                                                            // XXX: THIS 0 IS MADE UP AND IS A PLACEHOLDER UNTIL WE HAVE AN ACTUAL METHOD
                                                            shadowed_state_var_idx: 0,
                                                            shadowing_state_var_idx: state_var,
                                                        },
                                                    ],
                                                },
                                            )))
                                        } else {
                                            Err(anyhow!(
                                                "State variable {} not found on component {}",
                                                unresolved_path[0].name,
                                                elm.name
                                            ))
                                        }
                                    }
                                } else {
                                    Ok(Some(ExtendSource::Component(ref_resolution.node_idx)))
                                }
                            }
                            _ => Ok(None),
                        };

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
                    component.set_children(
                        elm.children
                            .iter()
                            .map(|c| match c {
                                UntaggedContent::Text(t) => {
                                    ComponentPointerTextOrMacro::Text(t.clone())
                                }
                                UntaggedContent::Ref(idx) => {
                                    ComponentPointerTextOrMacro::Component(*idx)
                                }
                            })
                            .collect(),
                    );
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

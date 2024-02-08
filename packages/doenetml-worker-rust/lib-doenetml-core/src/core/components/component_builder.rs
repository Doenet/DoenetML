//! A `ComponentBuilder` turns DAST components into fully hydrated components that are ready for use in Core.
//! Unlike DAST, which is schema agnostic, components represent element types that are actually implemented in DoenetML.

use std::{collections::HashMap, str::FromStr};

use crate::{
    components::{ComponentAttributes, ComponentNode},
    dast::flat_dast::{NormalizedNode, NormalizedRoot, UntaggedContent},
    ComponentPointerTextOrMacro, ExtendSource,
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
                        elm.extending
                            .clone()
                            .map(|ref_resolution| ExtendSource::Component(ref_resolution.idx())),
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

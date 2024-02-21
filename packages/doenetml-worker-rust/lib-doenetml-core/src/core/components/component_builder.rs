//! A `ComponentBuilder` turns DAST components into fully hydrated components that are ready for use in Core.
//! Unlike DAST, which is schema agnostic, components represent element types that are actually implemented in DoenetML.

use std::{collections::HashMap, iter, str::FromStr};

use anyhow::anyhow;

use crate::{
    components::{prelude::ComponentState, ComponentAttributes, ComponentNode},
    dast::{
        flat_dast::{Index, NormalizedNode, NormalizedRoot, Source},
        ref_resolve::RefResolution,
    },
    state::PropPointer,
    utils::KeyValueIgnoreCase,
    Extending,
};

use super::{ComponentEnum, _error::_Error, _external::_External};

#[derive(Debug)]
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

    /// Given a `NormalizedRoot`, create a `ComponentBuilder` that contains reified components.
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
                    builder.components[idx].set_extending(Some(extending));
                }
                Err(err) => {
                    builder.components[idx] = ComponentEnum::_Error(_Error {
                        message: format!("Error while extending: {}", err),
                        ..Default::default()
                    });
                    builder.components[idx].initialize(
                        elm.idx,
                        elm.parent,
                        None,
                        HashMap::new(),
                        elm.position.clone(),
                    );
                }
            }
        }
        builder
    }

    /// Creates all `components` but sets all their `extending` fields to `None`.
    /// This is an intermediate step that needs to be done before resolving references in `extending`.
    fn from_normalized_root_without_extending(normalized_root: &NormalizedRoot) -> Self {
        // We are going to create components possibly out of order. We will track which components are created
        // and which are in the process of being created.
        let mut components: Vec<Option<ComponentEnum>> = iter::repeat_with(|| None)
            .take(normalized_root.nodes.len())
            .collect();

        // Creating the nodes lowest-index first should lead to less queueing than the other way around.
        let mut queue: Vec<usize> = Vec::from_iter((0..components.len()).rev());

        while let Some(idx) = queue.pop() {
            // In the worst case scenario, every node gets queued twice. If we do more than that, there
            // must be a circular dependency.
            if queue.len() > 2 * components.len() {
                panic!("Circular dependency while expanding nodes");
            }

            if components[idx].is_some() {
                // No need to remake a component.
                continue;
            }

            let node = &normalized_root.nodes[idx];
            match Self::create_component(node, &components) {
                Ok(component) => {
                    components[idx] = Some(component);
                }
                Err(dependency_idx) => {
                    // If we have a dependency that needs to be created first, then we need to queue this node again.
                    queue.push(idx);
                    queue.push(dependency_idx);
                }
            }
        }

        // Every component should now be created, so this unwrap should be safe.
        let components = components.into_iter().map(|c| c.unwrap()).collect();
        Self { components }
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
    ///  2. If the tag names differ, a search is done for a prop on the referent that matches the preferred profile
    ///     of the component.
    fn determine_extending(
        ref_resolution: &RefResolution,
        component: &ComponentEnum,
        referent: &ComponentEnum,
    ) -> Result<Extending, anyhow::Error> {
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
                return Err(anyhow!("Nested props not implemented yet"));
            }
            if !unresolved_path[0].index.is_empty() {
                return Err(anyhow!("Path indices not yet supported"));
            }
            let referenced_prop_name = &unresolved_path[0].name;

            // Look to see if there is a public prop with a matching name on `referent`
            return match referent
                .get_public_prop_index_from_name_case_insensitive(referenced_prop_name)
            {
                Some(referent_prop_idx) => Ok(Extending::Prop(PropPointer {
                    component_idx: referent.get_idx(),
                    prop_idx: referent_prop_idx,
                })),
                None => Err(anyhow!(
                    "prop {} not found on component {}",
                    referenced_prop_name,
                    referent.get_component_type()
                )),
            };
        }
        // If we're here, there is no remaining path.

        // If we are extending a component of the same type,
        // the component did not specify that it should extend via default prop,
        // then this is a "component extension",
        // which is treated differently than extending by a prop.
        if component.get_component_type() == referent.get_component_type()
            || !referent.extend_via_default_prop()
        {
            Ok(Extending::Component(referent.get_idx()))
        } else {
            // Since we are extending a component to a different type via default prop,
            // the component should have specified a default prop
            match referent.get_default_prop() {
                Some(default_prop) => Ok(Extending::Prop(PropPointer {
                    component_idx: referent.get_idx(),
                    prop_idx: default_prop,
                })),
                None => Err(anyhow!(
                    "Cannot extend {} via default prop because a default prop was not defined.",
                    referent.get_component_type()
                )),
            }
        }
    }

    /// Create a component from `node`.
    ///  - `node` - The node to create a component from.
    ///  - `components` - An array of already created components. When there is an `extending` field, the algorithm for deciding
    ///    what component to create is complicated and depends on other existing components.
    ///
    /// Returns:
    ///  - `Ok(component)` - The component created from `node`.
    ///  - `Err(idx)` - The index of a component that must be created before the component for `node` is created.
    fn create_component(
        node: &NormalizedNode,
        components: &[Option<ComponentEnum>],
    ) -> Result<ComponentEnum, Index> {
        let ret = match node {
            NormalizedNode::Element(elm) => {
                let mut component = ComponentEnum::from_str(&elm.name).unwrap_or_else(|_| {
                    // If we didn't find a match, then create a component of type external
                    ComponentEnum::_External(_External {
                        name: elm.name.clone(),
                        ..Default::default()
                    })
                });

                if let Some(Source::Ref(ref_resolution)) = &elm.extending {
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
                    } else {
                        // If there is a remaining path, we may need to further mutate the component.
                        // For example,  `<textInput name="i" />$i.value`
                        // should become `<textInput name="i" /><text extend="$i.value" />`
                        // rather than   `<textInput name="i" /><textInput extend="$i.value" />`
                        let path = ref_resolution.unresolved_path.as_ref().unwrap();
                        if path.len() == 1 && path[0].index.is_empty() {
                            let path_part = &path[0];
                            let referent = components[ref_resolution.node_idx].as_ref();
                            if referent.is_none() {
                                // We need information from this component, so it must be created first.
                                return Err(ref_resolution.node_idx);
                            }
                            let referent = referent.unwrap();
                            let referent_prop_idx = referent
                                .get_public_prop_index_from_name_case_insensitive(&path_part.name);
                            if let Some(referent_prop_idx) = referent_prop_idx {
                                let new_component_type = referent
                                    .get_prop(referent_prop_idx)
                                    .unwrap()
                                    .preferred_component_type();
                                if new_component_type != component.get_component_type() {
                                    component =
                                        ComponentEnum::from_str(new_component_type).unwrap();
                                }
                            }
                        }
                    }
                }

                // These are the unused attributes that are not recognized by the component
                let mut unused_attributes = HashMap::<String, _>::from_iter(
                    elm.attributes
                        .iter()
                        .map(|attr| (attr.name.clone(), attr.clone())),
                );

                let attributes: HashMap<&'static str, _> =
                    HashMap::from_iter(component.get_attribute_names().iter().map(|&name| {
                        unused_attributes
                            .remove_ignore_case(name)
                            .map_or_else(|| (name, Vec::new()), |v| (name, v.children))
                    }));

                component.initialize(
                    elm.idx,
                    elm.parent,
                    None,
                    unused_attributes,
                    elm.position.clone(),
                );
                component.get_extending();
                // The referenced children may not yet be created as components, but by the end of the loop
                // they should all be created with the exact same indices as the `normalized_flat_dast` indices.
                component.set_children(elm.children.clone());
                component.set_attributes(attributes);
                component
            }
            NormalizedNode::Error(e) => {
                let mut error = _Error::new();
                error.message = e.message.clone();
                error.initialize(e.idx, e.parent, None, HashMap::new(), e.position.clone());
                ComponentEnum::_Error(error)
            }
        };
        Ok(ret)
    }
}

#[cfg(test)]
#[path = "component_builder.test.rs"]
mod test;

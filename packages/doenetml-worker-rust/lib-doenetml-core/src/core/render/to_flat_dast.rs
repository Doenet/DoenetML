use std::collections::HashMap;

use crate::{
    components::{
        prelude::{
            ComponentIdx, ComponentProps, ElementData, FlatDastElement, FlatDastElementContent,
        },
        types::PropPointer,
        Component, ComponentActions, ComponentCommon, ComponentEnum, ComponentNode,
        ComponentVariantProps,
    },
    dast::{
        flat_dast::UntaggedContent, DastAttribute, DastText, DastTextRefContent,
        FlatDastElementUpdate, FlatDastRoot, ForRenderPropValue, ForRenderProps,
    },
    props::{PropProfile, PropValue},
};

use super::super::{core::Core, graph_node::GraphNode};

impl Core {
    /// Output all components as a flat dast,
    /// where we create a vector of each component's dast element,
    /// and dast elements refer to their children via its *ComponentIdx* in that vector.
    ///
    /// Include warnings as a separate vector (errors are embedded in the tree as elements).
    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        let n_components = self.components.len();
        let elements: Vec<FlatDastElement> = (0..n_components)
            .map(|comp_idx| self.component_to_flat_dast(comp_idx))
            .collect();

        FlatDastRoot {
            children: vec![FlatDastElementContent::Element(0)],
            elements,
            warnings: vec![],
            position: None,
        }
    }

    pub fn component_to_flat_dast2(&self, component: &Component) -> FlatDastElement {
        let component_node = GraphNode::Component(component.get_idx());

        // Children don't need any additional processing. They are directly converted into FlatDast.

        //       let children = component.get_rendered_children(child_query_object);

        let children = self
            .structure_graph
            .get_component_children(component_node)
            .map(|node| match node {
                GraphNode::Component(idx) => FlatDastElementContent::Element(idx),
                GraphNode::String(_) => {
                    FlatDastElementContent::Text(self.strings.get_string_value(node))
                }
                _ => panic!("Unexpected node type in component children {:?}", node),
            })
            .collect::<Vec<_>>();

        // Only the unrecognized attributes remain ont he actual element. Convert them to a flat dast.
        let attributes = component.get_unrecognized_attributes();
        let attributes = attributes
            .iter()
            .map(|(key, flat_attr)| {
                (
                    key.to_string(),
                    DastAttribute {
                        name: flat_attr.name.clone(),
                        children: flat_attr
                            .children
                            .iter()
                            .filter_map(|c| match c {
                                UntaggedContent::Text(s) => {
                                    Some(DastTextRefContent::Text(DastText {
                                        value: s.clone(),
                                        data: None,
                                        position: None,
                                    }))
                                }
                                // Refs have been expanded during processing to actual components. Since XML is not allowed
                                // in a FlatDast attribute, we ignore them.
                                // TODO: should we put in the value of the ref here?
                                UntaggedContent::Ref(_) => None,
                            })
                            .collect(),
                        position: flat_attr.position.clone(),
                    },
                )
            })
            .collect::<HashMap<_, _>>();

        FlatDastElement {
            name: component.get_component_type().to_string(),
            attributes,
            children,
            data: ElementData {
                id: component.get_idx(),
                action_names: Some(
                    component
                        .get_action_names()
                        .iter()
                        .map(|x| x.to_string())
                        .collect(),
                ),
                props: None,
                message: None,
            },
            position: None,
        }
    }

    /// Convert a component to a `FlatDastElement`.
    pub fn component_to_flat_dast(&mut self, component_idx: ComponentIdx) -> FlatDastElement {
        let child_nodes = self.components[component_idx]
            .provided_profiles()
            .into_iter()
            .find_map(|(profile, local_prop_idx)| {
                if profile == PropProfile::RenderedChildren {
                    let prop_node = self.prop_pointer_to_prop_node(PropPointer {
                        component_idx,
                        local_prop_idx,
                    });
                    let rendered_children_value = &*self.get_prop_for_render(prop_node).value;
                    match rendered_children_value {
                        PropValue::GraphNodes(graph_nodes) => Some(graph_nodes.clone()),
                        _ => unreachable!(
                            "RenderedChildren prop must return GraphNodes, found {:?}",
                            rendered_children_value
                        ),
                    }
                } else {
                    None
                }
            })
            .unwrap_or_default();

        let children = child_nodes
            .into_iter()
            .flat_map(|child| match child {
                GraphNode::Component(idx) => Some(FlatDastElementContent::Element(idx)),
                GraphNode::String(_) => Some(FlatDastElementContent::Text(
                    self.strings.get_string_value(child),
                )),
                _ => None,
            })
            .collect::<Vec<_>>();

        FlatDastElement {
            children,
            ..self.component_to_flat_dast_no_children(component_idx)
        }
    }

    /// Convert a component to a `FlatDastElement` without its children. This is can be used
    /// as an intermediate step when producing flat dast elements.
    fn component_to_flat_dast_no_children(
        &mut self,
        component_idx: ComponentIdx,
    ) -> FlatDastElement {
        // TODO: many components in the flat dast are not rendered
        // For efficiency, we should not calculate the rendered props for these components.
        let rendered_props = Some(self.get_rendered_props(component_idx));

        let component = &self.components[component_idx];
        let message = if let ComponentEnum::_Error(error) = &component.variant {
            Some(error.message.clone())
        } else {
            None
        };

        FlatDastElement {
            name: component.get_component_type().to_string(),
            // TODO: We should return some version of component.get_unrecognized_attributes()
            // However, those attributes might not be expandable if they contain an expanded refs.
            attributes: HashMap::new(),
            children: Vec::new(),
            data: ElementData {
                id: component.get_idx(),
                action_names: Some(
                    component
                        .get_action_names()
                        .iter()
                        .map(|x| x.to_string())
                        .collect(),
                ),
                props: rendered_props,
                message,
            },
            position: component.get_position().cloned(),
        }
    }

    /// Calculate the values of the for_render props of `component_idx` that have changed
    /// since the last time they were calculated for rendering.
    ///
    /// Return: a `ForRenderProps` containing a `ForRenderPropValue` for each for_render prop that changed.
    fn get_rendered_props(&mut self, component_idx: ComponentIdx) -> ForRenderProps {
        // Note: collect into a vector so that stop borrowing from self.components
        // (needed since self.get_prop_for_render() currently needs a mutable borrow of self)
        let rendered_prop_pointers = self.components[component_idx]
            .get_for_renderer_local_prop_indices()
            .into_iter()
            .map(|local_prop_idx| PropPointer {
                component_idx,
                local_prop_idx,
            })
            .collect::<Vec<_>>();

        let rendered_prop_value_vec = rendered_prop_pointers
            .into_iter()
            .filter_map(|prop_pointer| {
                let prop_node = self.prop_pointer_to_prop_node(prop_pointer);
                let prop = self.get_prop_for_render(prop_node);
                if prop.changed {
                    let prop_value = (*prop.value).clone();
                    let prop_name = self.components[prop_pointer.component_idx]
                        .variant
                        .get_prop_names()[*prop_pointer.local_prop_idx];
                    Some(ForRenderPropValue {
                        name: prop_name.to_string(),
                        value: prop_value,
                    })
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();

        ForRenderProps(rendered_prop_value_vec)
    }

    /// XXX: need to implement this and determine what rendered state variables have changed
    /// Output updates for any elements with changed rendered props
    pub fn get_flat_dast_updates(&mut self) -> HashMap<ComponentIdx, FlatDastElementUpdate> {
        // let components_changed = self.freshen_renderer_state();

        // let mut flat_dast_updates: HashMap<ComponentIdx, FlatDastElementUpdate> = HashMap::new();
        // for component_idx in components_changed {
        //     if let Some(element_update) = get_flat_dast_update(component_idx, &self.components) {
        //         flat_dast_updates.insert(component_idx, element_update);
        //     }
        // }
        // flat_dast_updates
        HashMap::new()
    }
}

#[cfg(test)]
#[path = "to_flat_dast.test.rs"]
mod test;

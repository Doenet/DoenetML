use std::collections::HashMap;

use crate::{
    components::{
        prelude::{
            ComponentIdx, ComponentProps, ElementData, FlatDastElement, FlatDastElementContent,
        },
        Component, ComponentActions, ComponentCommon, ComponentEnum, ComponentNode,
    },
    dast::{
        flat_dast::UntaggedContent, DastAttribute, DastText, DastTextRefContent,
        FlatDastElementUpdate, FlatDastRoot,
    },
    state::PropPointer,
};

use super::{
    super::{graph_based_core::Core, graph_node::GraphNode},
    ChildQueryObject, ComponentChildren,
};

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
        let children = self
            .structure_graph
            .get_component_children(component_node)
            .into_iter()
            .map(|node| match node {
                GraphNode::Component(idx) => FlatDastElementContent::Element(idx),
                GraphNode::String(idx) => FlatDastElementContent::Text(self.strings[idx].clone()),
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
                action_names: Some(component.get_action_names()),
                props: None,
                message: None,
            },
            position: None,
        }
    }

    /// Convert a component to a `FlatDastElement`.
    pub fn component_to_flat_dast(&mut self, component_idx: ComponentIdx) -> FlatDastElement {
        let component = &self.components[component_idx];
        let children = component
            .get_rendered_children(ChildQueryObject::new_from_core(component_idx, self))
            .into_iter()
            .flat_map(|child| match child {
                GraphNode::Component(idx) => Some(FlatDastElementContent::Element(idx)),
                GraphNode::String(idx) => {
                    Some(FlatDastElementContent::Text(self.strings[idx].clone()))
                }
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
        let rendered_prop_pointers = self.components[component_idx]
            .get_for_renderer_local_prop_indices()
            .into_iter()
            .map(|local_prop_idx| PropPointer {
                component_idx,
                local_prop_idx,
            })
            .collect::<Vec<_>>();

        // TODO: many components in the flat dast are not rendered
        // For efficiency, we should not calculate the rendered props for these components.
        //self.freshen_props(&rendered_prop_pointers);

        let component = &self.components[component_idx];
        let message = if let ComponentEnum::_Error(error) = &component.variant {
            Some(error.message.clone())
        } else {
            None
        };

        // XXX: implement getting rendered props
        // let rendered_props = component.get_rendered_props();
        let rendered_props = None;

        FlatDastElement {
            name: component.get_component_type().to_string(),
            // TODO: We should return some version of component.get_unrecognized_attributes()
            // However, those attributes might not be expandable if they contain an expanded refs.
            attributes: HashMap::new(),
            children: Vec::new(),
            data: ElementData {
                id: component.get_idx(),
                action_names: Some(component.get_action_names()),
                props: rendered_props,
                message,
            },
            position: component.get_position().cloned(),
        }
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

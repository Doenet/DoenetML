use std::collections::HashMap;

use crate::components::{
    prelude::{ElementData, FlatDastElement, FlatDastElementContent},
    ComponentActions, ComponentChildren, ComponentEnum, ComponentNode,
};

use super::{graph_based_core::Core, graph_node::GraphNode};

impl Core {
    /// Get the vector of component's children that should be sent to the renderer.
    pub fn component_rendered_children(
        &self,
        component: &ComponentEnum,
    ) -> Vec<FlatDastElementContent> {
        let component_node = GraphNode::Component(component.get_idx());
        component.filter_rendered_children(
            self.structure_graph
                .content_children(component_node)
                .flat_map(|child| match child {
                    GraphNode::Component(idx) => Some(FlatDastElementContent::Element(idx)),
                    GraphNode::String(idx) => {
                        Some(FlatDastElementContent::Text(self.strings[idx].clone()))
                    }
                    _ => None,
                })
                .collect::<Vec<_>>(),
        )
    }

    /// Convert a `ComponentEnum` to a `FlatDastElement`.
    pub fn component_to_flat_dast(&self, component: &ComponentEnum) -> FlatDastElement {
        let children = self.component_rendered_children(component);

        let message = if let ComponentEnum::_Error(error) = component {
            Some(error.message.clone())
        } else {
            None
        };

        FlatDastElement {
            name: component.get_component_type().to_string(),
            // TODO: We should return some version of component.get_unrecognized_attributes()
            // However, those attributes might not be expandable if they contain an expanded refs.
            attributes: HashMap::new(),
            children,
            data: ElementData {
                id: component.get_idx(),
                action_names: Some(component.get_action_names()),
                // XXX: What should this be?
                state: None,
                message,
            },
            position: component.get_position().cloned(),
        }
    }
}

use std::collections::HashMap;

use crate::components::{
    prelude::{ElementData, FlatDastElement, FlatDastElementContent},
    ComponentActions, ComponentChildren, ComponentEnum, ComponentNode,
};

use super::{
    super::{graph_based_core::Core, graph_node::GraphNode},
    ChildQueryObject, ComponentChildren,
};

impl Core {
    /// Convert a component to a `FlatDastElement`.
    pub fn component_to_flat_dast(&self, component: &ComponentEnum) -> FlatDastElement {
        let children = component
            .get_children(ChildQueryObject::new_from_core(component.get_idx(), self))
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
            ..self.component_to_flat_dast_no_children(component)
        }
    }

    /// Convert a component to a `FlatDastElement` without its children. This is can be used
    /// as an intermediate step when producing flat dast elements.
    fn component_to_flat_dast_no_children(&self, component: &ComponentEnum) -> FlatDastElement {
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
                props: None,
                message,
            },
            position: component.get_position().cloned(),
        }
    }
}

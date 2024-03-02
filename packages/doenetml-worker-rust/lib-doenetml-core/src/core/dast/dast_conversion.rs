use std::{cell::RefCell, collections::HashMap, ops::Deref, rc::Rc};

use crate::{
    components::{
        prelude::ComponentState, ComponentActions, ComponentChildrenOld, ComponentEnum,
        ComponentNode,
    },
    ComponentIdx, Extending,
};

use super::{
    flat_dast::UntaggedContent, ElementData, FlatDastElement, FlatDastElementContent,
    FlatDastElementUpdate,
};

/// Return the flat dast element sent to the renderer.
pub fn to_flat_dast(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
) -> FlatDastElement {
    let mut children;
    {
        let component = components[component_idx].borrow();

        // if extending a source that is a component,
        // add children from that source first
        children = if let Some(Extending::Component(source_idx)) = component.get_extending() {
            let source_dast = to_flat_dast(*source_idx, components);

            source_dast.children
        } else {
            Vec::new()
        };

        // children from the component itself come after children the extend source
        children.extend(
            component
                .render_children_old()
                .iter()
                .map(|child| match child {
                    UntaggedContent::Ref(comp_idx) => FlatDastElementContent::Element(*comp_idx),
                    UntaggedContent::Text(s) => FlatDastElementContent::Text(s.to_string()),
                }),
        );
    }

    let mut component = components[component_idx].borrow_mut();

    let rendered_state = if component.get_is_in_render_tree() {
        component.return_rendered_state()
    } else {
        None
    };

    let message = if let ComponentEnum::_Error(error) = component.deref() {
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
            props: rendered_state,
            message,
        },
        position: component.get_position().cloned(),
    }
}

#[allow(clippy::ptr_arg)]
pub fn get_flat_dast_update(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
) -> Option<FlatDastElementUpdate> {
    let mut component = components[component_idx].borrow_mut();

    component
        .return_rendered_state_update()
        .map(|changed_variables| FlatDastElementUpdate {
            new_children: None,
            changed_state: Some(changed_variables),
        })
}

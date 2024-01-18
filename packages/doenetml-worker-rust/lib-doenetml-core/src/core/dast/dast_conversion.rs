use std::{cell::RefCell, rc::Rc};

use crate::{
    components::{ComponentEnum, ComponentNode, RenderedComponentNode},
    ComponentIdx, ComponentPointerTextOrMacro, ExtendSource,
};

use super::{ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate};

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
        children = if let Some(ExtendSource::Component(source_idx)) = component.get_extend() {
            let source_dast = to_flat_dast(*source_idx, components);

            source_dast.children
        } else {
            Vec::new()
        };

        // children from the component itself come after children the extend source
        children.extend(
            component
                .get_rendered_children()
                .iter()
                .filter_map(|child| match child {
                    ComponentPointerTextOrMacro::Component(comp_idx) => {
                        Some(FlatDastElementContent::Element(*comp_idx))
                    }
                    ComponentPointerTextOrMacro::Text(s) => {
                        Some(FlatDastElementContent::Text(s.to_string()))
                    }
                    ComponentPointerTextOrMacro::Macro(_the_macro) => None,
                    ComponentPointerTextOrMacro::FunctionMacro(_function_macro) => None,
                }),
        );
    }

    let mut component = components[component_idx].borrow_mut();

    let attributes = component.get_unevaluated_attributes().clone();

    let rendered_state = if component.get_is_rendered() {
        component.return_rendered_state()
    } else {
        None
    };

    FlatDastElement {
        name: component.get_component_type().to_string(),
        attributes,
        children,
        data: ElementData {
            id: component.get_idx(),
            action_names: Some(component.get_action_names()),
            state: rendered_state,
            ..Default::default()
        },
        position: component.get_position().cloned(),
    }
}

pub fn get_flat_dast_update(
    component_idx: ComponentIdx,
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
) -> Option<FlatDastElementUpdate> {
    let mut component = components[component_idx].borrow_mut();

    component
        .return_rendered_state_update()
        .and_then(|changed_variables| {
            Some(FlatDastElementUpdate {
                new_children: None,
                changed_state: Some(changed_variables),
            })
        })
}
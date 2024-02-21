use std::{cell::RefCell, rc::Rc};

use crate::{
    attribute::AttributeName,
    components::{prelude::UntaggedContent, ComponentEnum, ComponentNode},
    ComponentIdx, Extending,
};

/// Return a vector of (child, parent_idx) tuples from the children of a component
/// and children of any extend sources.
///
/// Since children from extend sources will have a different parent,
/// we include the parent index in the output.
pub fn get_children_with_parent_including_from_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> Vec<(UntaggedContent, ComponentIdx)> {
    let component = components[component_idx].borrow();

    let mut children_vec =
        if let Some(&Extending::Component(source_idx)) = component.get_extending() {
            get_children_with_parent_including_from_extend_source(components, source_idx)
        } else {
            Vec::new()
        };

    children_vec.extend(
        component
            .get_children()
            .iter()
            .map(|c| (c.clone(), component_idx)),
    );

    children_vec
}

/// If the component has an extend source of `Component` type,
/// return the component index of that extend source,
/// except recurse until the component index of the original source is found.
///
/// When we store state data, we store it with this original source index,
/// allowing copies to share the same state data as the source.
pub fn get_component_extend_source_origin(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
) -> ComponentIdx {
    match &components[component_idx].borrow().get_extending() {
        Some(&Extending::Component(source_idx)) => {
            get_component_extend_source_origin(components, source_idx)
        }
        _ => component_idx,
    }
}

/// Return the attribute children for `attribute`,
/// falling back to the attribute children of any extend source if none found for the component.
///
/// Returns an option of a tuple with components
/// - a vector of the attribute children found
/// - the index of the parent where those attribute children were found.
pub fn get_attributes_with_parent_falling_back_to_extend_source(
    components: &Vec<Rc<RefCell<ComponentEnum>>>,
    component_idx: ComponentIdx,
    attribute: AttributeName,
) -> Option<(Vec<UntaggedContent>, ComponentIdx)> {
    let component = components[component_idx].borrow();

    component.get_attribute(attribute).and_then(|attributes| {
        if attributes.is_empty() {
            if let Some(&Extending::Component(source_idx)) = component.get_extending() {
                return get_attributes_with_parent_falling_back_to_extend_source(
                    components, source_idx, attribute,
                );
            }
        }
        Some((attributes.clone(), component_idx))
    })
}

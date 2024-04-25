use std::collections::HashMap;

use super::{super::graph_node::GraphNode, DocumentRenderer};
use crate::{
    components::{
        prelude::{ComponentIdx, ElementData, FlatDastElement, FlatDastElementContent},
        types::PropPointer,
        ComponentActions, ComponentCommon, ComponentEnum, ComponentNode,
    },
    core::document_model::DocumentModel,
    dast::{
        flat_dast::UntaggedContent, DastAttribute, DastText, DastTextRefContent,
        FlatDastElementUpdate, FlatDastRoot, ForRenderPropValue, ForRenderPropValueOrContent,
        ForRenderProps,
    },
    graph::directed_graph::Taggable,
    props::{cache::PropWithMeta, PropProfile, PropValue},
    state::types::content_refs::ContentRef,
};

/// When to include a prop in the serialized rendered props.
pub enum SerializeCondition {
    /// Always include the prop in the serialized rendered props.
    Always,
    /// Only include the prop if it has changed since the last time it was serialized.
    IfChanged,
}

impl DocumentRenderer {
    /// Output all components as a flat dast,
    /// where we create a vector of each component's dast element,
    /// and dast elements refer to their children via its *ComponentIdx* in that vector.
    ///
    /// Include warnings as a separate vector (errors are embedded in the tree as elements).
    pub fn render_flat_dast(&mut self, document_model: &DocumentModel) -> FlatDastRoot {
        self.mark_component_in_render_tree(ComponentIdx::new(0), document_model);
        let elements = document_model
            .get_component_indices()
            .map(|comp_idx| self.component_to_flat_dast(comp_idx, document_model))
            .collect();

        FlatDastRoot {
            children: vec![FlatDastElementContent::Element(0)],
            elements,
            warnings: vec![],
            position: None,
        }
    }

    fn mark_component_in_render_tree(
        &mut self,
        component_idx: ComponentIdx,
        document_model: &DocumentModel,
    ) {
        let component_node = component_idx.as_graph_node();
        if let Some(true) = self.in_render_tree.get_tag(&component_node) {
            return;
        }
        self.in_render_tree.set_tag(component_node, true);

        for child_node in self.get_rendered_child_nodes(component_idx, document_model) {
            if let GraphNode::Component(_) = child_node {
                self.mark_component_in_render_tree(child_node.into(), document_model);
            }
        }
    }

    /// Convert a component to a `FlatDastElement`.
    pub fn component_to_flat_dast(
        &mut self,
        component_idx: ComponentIdx,
        document_model: &DocumentModel,
    ) -> FlatDastElement {
        let child_nodes = self.get_rendered_child_nodes(component_idx, document_model);

        let children = child_nodes
            .into_iter()
            .filter_map(|child| match child {
                GraphNode::Component(idx) => Some(FlatDastElementContent::Element(idx)),
                GraphNode::String(_) => Some(FlatDastElementContent::Text(
                    document_model.get_string_value(child),
                )),
                _ => None,
            })
            .collect::<Vec<_>>();

        FlatDastElement {
            children,
            ..self.component_to_flat_dast_no_children(component_idx, document_model)
        }
    }

    /// Get the vector of graph nodes corresponding to the rendered children of `component_idx`.
    /// Rendered children are the nodes from the prop with the `RenderedChildren` profile, if it exists
    fn get_rendered_child_nodes(
        &mut self,
        component_idx: ComponentIdx,
        document_model: &DocumentModel,
    ) -> Vec<GraphNode> {
        let profs = document_model.get_provided_profiles(component_idx);
        profs
            .into_iter()
            .find_map(|(profile, local_prop_idx)| {
                if profile == PropProfile::RenderedChildren {
                    let prop_pointer = PropPointer {
                        component_idx,
                        local_prop_idx,
                    };
                    let rendered_children_value =
                        &self.get_prop_for_render(prop_pointer, document_model).value;
                    match rendered_children_value {
                        PropValue::ContentRefs(content_refs) => Some((**content_refs).clone()),
                        _ => unreachable!(
                            "RenderedChildren prop must return GraphNodes, found {:?}",
                            rendered_children_value
                        ),
                    }
                } else {
                    None
                }
            })
            .unwrap_or_default()
            .into_vec()
            .into_iter()
            .map(|content_ref| content_ref.into())
            .collect()
    }

    /// Convert a component to a `FlatDastElement` without its children. This is can be used
    /// as an intermediate step when producing flat dast elements.
    fn component_to_flat_dast_no_children(
        &mut self,
        component_idx: ComponentIdx,
        document_model: &DocumentModel,
    ) -> FlatDastElement {
        // For efficiency, calculate rendered props only if component_idx is in the render tree
        let rendered_props = self
            .in_render_tree
            .get_tag(&component_idx.as_graph_node())
            .copied()
            .and_then(|in_tree| {
                in_tree.then(|| {
                    self.get_rendered_props(
                        component_idx,
                        SerializeCondition::Always,
                        document_model,
                    )
                })
            });

        let component = document_model.get_component(component_idx);
        let message = if let ComponentEnum::_Error(error) = &component.variant {
            Some(error.message.clone())
        } else {
            None
        };

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
            // TODO: We should return some version of component.get_unrecognized_attributes()
            // However, those attributes might not be expandable if they contain an expanded refs.
            attributes,
            children: Vec::new(),
            data: ElementData {
                id: component.get_idx().as_usize(),
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
            position: component.common.position,
        }
    }

    /// Calculate the values of the `for_render` props of `component_idx`.
    /// If `only_changed_props` is `true`, then calculate only the props that have changed
    /// since the last time they were calculated for rendering.
    ///
    /// Return: a `ForRenderProps` containing a `ForRenderPropValue` for each `for_render` prop that changed.
    fn get_rendered_props(
        &mut self,
        component_idx: ComponentIdx,
        serialize_condition: SerializeCondition,
        document_model: &DocumentModel,
    ) -> ForRenderProps {
        let rendered_prop_pointers = document_model.get_for_render_prop_pointers(component_idx);

        let rendered_prop_value_vec = rendered_prop_pointers
            .filter_map(|prop_pointer| {
                let prop = self.get_prop_for_render(prop_pointer, document_model);
                let should_serialize =
                    prop.changed || matches!(serialize_condition, SerializeCondition::Always);
                if should_serialize {
                    let prop_value = prop.value;
                    let prop_name = document_model.get_prop_name(prop_pointer);
                    Some(self.prepare_prop_value_for_render(prop_name, prop_value, document_model))
                } else {
                    None
                }
            })
            .collect::<Vec<_>>();

        ForRenderProps(rendered_prop_value_vec)
    }

    /// Turns a `PropValue` into a `ForRenderPropValueOrContent` that is ready for serialization.
    /// In particular, this will substitute in any `PropValue::ContentRefs` that are strings with an
    /// appropriate `FlatDastElementContent::Text`.
    #[inline(always)]
    fn prepare_prop_value_for_render(
        &self,
        name: &'static str,
        value: PropValue,
        document_model: &DocumentModel,
    ) -> ForRenderPropValue {
        let ref_to_element_content = |r: &ContentRef| match r {
            ContentRef::String(s) => {
                let node = GraphNode::String(s.as_usize());
                FlatDastElementContent::Text(document_model.get_string_value(node))
            }
            ContentRef::Component(c) => FlatDastElementContent::Element(c.as_usize()),
        };

        let value: ForRenderPropValueOrContent = match value {
            PropValue::ContentRef(r) => {
                // A content ref gets converted into FlatDastElementContent
                ref_to_element_content(&r).into()
            }
            PropValue::ContentRefs(r) => {
                // Content refs gets converted into FlatDastElementContent
                r.as_slice()
                    .iter()
                    .map(ref_to_element_content)
                    .collect::<Vec<_>>()
                    .into()
            }
            _ => ForRenderPropValueOrContent::PropValue(value),
        };
        ForRenderPropValue { name, value }
    }

    /// Output updates for any elements with changed for_render props
    pub fn get_flat_dast_updates(
        &mut self,
        changed_components: Vec<ComponentIdx>,
        document_model: &DocumentModel,
    ) -> HashMap<ComponentIdx, FlatDastElementUpdate> {
        let mut flat_dast_updates: HashMap<ComponentIdx, FlatDastElementUpdate> = HashMap::new();

        for component_idx in changed_components {
            let component_node = component_idx.as_graph_node();
            if let Some(true) = self.in_render_tree.get_tag(&component_node) {
                let rendered_props = self.get_rendered_props(
                    component_idx,
                    SerializeCondition::IfChanged,
                    document_model,
                );

                if !rendered_props.is_empty() {
                    flat_dast_updates.insert(
                        component_idx,
                        FlatDastElementUpdate {
                            new_children: None,
                            changed_state: Some(rendered_props),
                        },
                    );
                }
            }
        }

        flat_dast_updates
    }

    /// Get the value of a prop for rendering. If the prop is stale or not resolved,
    /// this function will resolve the prop, calculate all its dependencies, and then
    /// return the result of `PropUpdaterUntyped::untyped_calculate` applied to those dependencies.
    /// Track that the prop has been viewed for rendering so that a second call will report it being unchanged.
    pub fn get_prop_for_render(
        &mut self,
        prop_pointer: PropPointer,
        document_model: &DocumentModel,
    ) -> PropWithMeta {
        document_model.get_prop(
            document_model.prop_pointer_to_prop_node(prop_pointer),
            self.for_render_query_node,
        )
    }

    /// Get the value of a prop for rendering. If the prop is stale or not resolved,
    /// this function will resolve the prop, calculate all its dependencies, and then
    /// return the result of `PropUpdaterUntyped::untyped_calculate` applied to those dependencies.
    /// Do not track that the prop has been viewed for rendering so that its change state is unaltered.
    pub fn get_prop_for_render_untracked(
        &mut self,
        prop_node: GraphNode,
        document_model: &DocumentModel,
    ) -> PropWithMeta {
        document_model.get_prop_untracked(prop_node, self.for_render_query_node)
    }
}

#[cfg(test)]
#[path = "to_flat_dast.test.rs"]
mod test;

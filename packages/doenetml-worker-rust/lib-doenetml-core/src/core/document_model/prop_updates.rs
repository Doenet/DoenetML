use itertools::Itertools;

use crate::{
    components::{
        prelude::ComponentIdx,
        types::{PropPointer, UpdateFromAction},
    },
    graph::directed_graph::Taggable,
    graph_node::{GraphNode, GraphNodeLookup},
    props::{cache::PropStatus, PropValue},
    DocumentModel,
};

impl DocumentModel {
    pub fn calculate_changes_from_action_updates(
        &mut self,
        updates_from_action: Vec<UpdateFromAction>,
        component_idx: ComponentIdx,
    ) -> GraphNodeLookup<PropValue> {
        let mut requested_value_lookup = GraphNodeLookup::new();

        let props_to_update = updates_from_action
            .into_iter()
            .map(
                |UpdateFromAction {
                     local_prop_idx,
                     requested_value,
                 }| {
                    let prop_node = self.prop_pointer_to_prop_node(PropPointer {
                        component_idx,
                        local_prop_idx,
                    });

                    requested_value_lookup.set_tag(prop_node, requested_value);

                    prop_node
                },
            )
            .collect::<Vec<_>>();

        // Call get_data_query_results on each original prop that is not fresh
        // to make sure all descendants are fresh
        for prop_node in &props_to_update {
            let status = self.get_prop_status(*prop_node);
            if status != PropStatus::Fresh {
                self.get_data_query_results(*prop_node);
            }
        }

        let dep_graph = self.get_dependency_graph();

        let mut changes_to_make = GraphNodeLookup::new();

        for node in dep_graph.descendants_topological_multiroot(&props_to_update) {
            let requested_value = requested_value_lookup.get_tag(node).cloned();
            if requested_value.is_none() {
                continue;
            }
            let requested_value = requested_value.unwrap();

            match node {
                GraphNode::Prop(_) => (),
                GraphNode::State(_) => {
                    changes_to_make.set_tag(*node, requested_value);
                    continue;
                }
                GraphNode::String(_) => {
                    changes_to_make.set_tag(*node, requested_value);
                    continue;
                }
                _ => panic!(
                    "Should request value only of a prop, state or string node. Received {:?}",
                    node
                ),
            }

            let prop_node = node;

            let prop_updater = self.get_prop_updater(prop_node);

            let required_data = self._get_data_query_results_assuming_fresh_deps(*prop_node);

            // if node is one of the original nodes specified by the action,
            // then we have a direct change from action
            let is_direct_change_from_action = props_to_update.contains(prop_node);

            let invert_result = prop_updater.invert_untyped(
                required_data,
                requested_value,
                is_direct_change_from_action,
            );

            // if we were unable to invert prop, then simply stop trying to update that part of the graph
            // and carry on if there are other paths to update
            if invert_result.is_err() {
                continue;
            }

            let invert_result = invert_result.unwrap();

            for data_query_result in invert_result.vec {
                for prop in data_query_result.values {
                    if prop.changed {
                        requested_value_lookup.set_tag(prop.node.unwrap(), prop.value);
                    }
                }
            }
        }

        changes_to_make
    }

    pub fn execute_changes(
        &self,
        changes_to_make: GraphNodeLookup<PropValue>,
    ) -> Vec<ComponentIdx> {
        for (node, val) in changes_to_make.iter() {
            match node {
                GraphNode::State(_) => self.states.set_state(node, val.clone()),
                GraphNode::String(_) => self
                    .document_structure
                    .borrow_mut()
                    .set_string(node, val.clone().try_into().unwrap()),
                _ => panic!(
                    "Can set the value of only State and String nodes, found {:?}",
                    node
                ),
            }
        }

        let skip_fn = |node: &GraphNode| {
            if matches!(node, GraphNode::Prop(_)) {
                self.prop_cache.get_prop_status(node) != PropStatus::Fresh
            } else {
                false
            }
        };

        let nodes_changed = changes_to_make.keys().collect_vec();
        let mut components_with_changed_for_render_prop = Vec::new();

        // mark all prop nodes that depend on nodes_changed as stale
        for node in self
            .dependency_graph
            .borrow()
            .ancestors_reverse_topological_multiroot_with_skip(&nodes_changed, skip_fn)
        {
            if matches!(node, GraphNode::Prop(_)) {
                self.prop_cache.set_prop_status(node, PropStatus::Stale);

                // if prop is marked for render, add to components_with_changed_for_render_prop
                let prop_meta = &self.get_prop_definition(node).meta;
                if prop_meta.for_render {
                    let component_idx = prop_meta.prop_pointer.component_idx;
                    if !components_with_changed_for_render_prop.contains(&component_idx) {
                        components_with_changed_for_render_prop.push(component_idx);
                    }
                }
            }
        }

        components_with_changed_for_render_prop
    }
}

use itertools::Itertools;

use crate::{
    DocumentModel,
    components::{
        prelude::ComponentIdx,
        types::{PropPointer, UpdateFromAction},
    },
    graph::directed_graph::Taggable,
    graph_node::{GraphNode, GraphNodeLookup},
    props::{PropProfile, PropValue, cache::PropStatus},
};

impl DocumentModel {
    /// Calculate new values of `State` or `String` nodes that are intended to achieve the values
    /// of the props specified in `updates_from_action`.
    ///
    /// The values are calculated using the `invert()` functions supplied by prop dependencies,
    /// recursing until a `State` or a `String` node is reached.
    ///
    /// The update may fail completely, in which case no changes are returned.
    /// The update may partially fail, in which some dependencies are updated by others remain unchanged.
    /// Even when all updates succeed, the final values of the props may not match their requested values
    /// due to constraints of the system.
    ///
    /// Return a `GraphNodeLookup` that will records the requested values of the `State` and `String` nodes.
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
                if status == PropStatus::Unresolved {
                    self.resolve_prop(*prop_node);
                }
                self.get_data_query_results(*prop_node);
            }
        }

        let mut changes_to_make = GraphNodeLookup::new();

        // We collect all the nodes to visit into a vector and then let the dependency graph drop
        // so that we can look up values of arbitrary props in the invert loop
        // (which might add to the dependency graph if the prop was unresolved)
        let nodes_to_visit = self
            .get_dependency_graph()
            .descendants_topological_multiroot(&props_to_update)
            .cloned()
            .collect_vec();

        for node in nodes_to_visit {
            // If there is no requested value for the node, then there is nothing to do that node so skip it.
            let requested_value = requested_value_lookup.get_tag(&node).cloned();
            if requested_value.is_none() {
                continue;
            }
            let requested_value = requested_value.unwrap();

            match node {
                GraphNode::Prop(_) => (),
                GraphNode::State(_) => {
                    // We've recursed all the way down to a `State` node, so record its requested value
                    changes_to_make.set_tag(node, requested_value);
                    continue;
                }
                GraphNode::String(_) => {
                    // We've recursed all the way down to a `String` node, so record its requested value
                    changes_to_make.set_tag(node, requested_value);
                    continue;
                }
                _ => panic!(
                    "Should request value only of a prop, state or string node. Received {node:?}"
                ),
            }

            let prop_node = node;
            let prop_pointer = self.get_prop_pointer(prop_node);

            // Check if the component has a `PropProfile::Fixed` with a value of true.
            // If so, then make the invert fail without even needing to call it
            let fixed_option = self
                .document_structure
                .borrow()
                .get_component_prop_by_profile(prop_pointer.component_idx, &[PropProfile::Fixed]);
            if let Some(fixed_prop_pointer) = fixed_option {
                let fixed_prop_node = self.prop_pointer_to_prop_node(fixed_prop_pointer);
                let fixed_value = self.get_prop_untracked(fixed_prop_node, prop_node).value;
                let fixed: bool = fixed_value
                    .try_into()
                    .expect("fixed prop profile should be boolean");
                if fixed {
                    // component was fixed, so skip invert (i.e., make it fail)
                    continue;
                }
            }

            let prop_updater = self.get_prop_updater(prop_node);

            let required_data = self._get_data_query_results_assuming_fresh_deps(prop_node);

            // if node is one of the original nodes specified by the action,
            // then we have a direct change from action
            let is_direct_change_from_action = props_to_update.contains(&prop_node);

            let invert_result = prop_updater.invert_untyped(
                required_data,
                requested_value,
                is_direct_change_from_action,
            );

            // If we were unable to invert prop, then simply stop trying to update that part of the graph
            // and carry on if there are other paths to update.
            if invert_result.is_err() {
                continue;
            }

            let invert_result = invert_result.unwrap();

            // If the `invert()` function requested a change in one of its dependencies,
            // record the desired value so that it will be used when we recurse to that dependency
            for data_query_result in invert_result.vec {
                for prop in data_query_result.values {
                    if prop.changed {
                        requested_value_lookup.set_tag(prop.origin.unwrap(), prop.value);
                    }
                }
            }
        }

        changes_to_make
    }

    /// Change all the `State` and `String` nodes in `changes_to_make` to their requested values.
    /// Mark all dependencies of those nodes as stale.
    ///
    /// Return the components that have had one of their `for_render` props newly marked as stale.
    pub fn execute_changes(
        &self,
        changes_to_make: GraphNodeLookup<PropValue>,
    ) -> Vec<ComponentIdx> {
        for (node, val) in changes_to_make.iter() {
            match node {
                GraphNode::State(_) => self.states.set_state(node, val.clone()),
                GraphNode::String(_) => self
                    .document_structure
                    .borrow()
                    .set_string(node, val.clone().try_into().unwrap()),
                _ => panic!("Can set the value of only State and String nodes, found {node:?}"),
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
        let mut changed_components =
            vec![false; self.document_structure.borrow()._get_num_components()];

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
                if prop_meta.for_render.in_graph || prop_meta.for_render.in_text {
                    let component_idx = prop_meta.prop_pointer.component_idx;
                    changed_components[component_idx.as_usize()] = true;
                }
            }
        }

        changed_components
            .into_iter()
            .enumerate()
            .filter_map(|(idx, changed)| {
                if changed {
                    Some(ComponentIdx::new(idx))
                } else {
                    None
                }
            })
            .collect()
    }
}

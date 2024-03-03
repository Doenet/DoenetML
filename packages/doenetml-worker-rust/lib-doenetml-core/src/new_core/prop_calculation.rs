use crate::{
    components::prelude::ComponentProps,
    graph::directed_graph::Taggable,
    state::{PropPointer, PropStatus},
    ComponentIdx,
};

use super::{graph_based_core::Core, graph_node::GraphNode};

impl Core {
    pub fn freshen_renderer_state(&mut self) -> Vec<ComponentIdx> {
        let mut stale_renderers = Vec::new();

        // recursively get a list of all rendered descendants of the components in stale_renderers
        let mut stale_renderer_idx = 0;
        while stale_renderer_idx < stale_renderers.len() {
            stale_renderer_idx += 1;

            // stale_renderers.extend(
            //     self.component_rendered_children(&self.components[component_idx])
            //         .into_iter()
            //         .filter_map(|child| match child {
            //             FlatDastElementContent::Text(_) => None,
            //             FlatDastElementContent::Element(child_idx) => Some(child_idx),
            //         }),
            // );
        }

        // deduplicate the list of stale renderers,
        // sorting first since .dedup removes only consecutive duplicates.
        stale_renderers.sort_unstable();
        stale_renderers.dedup();

        // for component_idx in stale_renderers.iter() {
        //     self.components[*component_idx].set_is_in_render_tree(true);

        //     let rendered_prop_indices =
        //         self.components[*component_idx].get_for_renderer_prop_indices();

        //     for prop_idx in rendered_prop_indices {
        //         let prop_ptr = PropPointer {
        //             component_idx: *component_idx,
        //             local_prop_idx: prop_idx,
        //         };
        //         self.freshen_prop(prop_ptr);
        //     }
        // }

        let components_freshened = stale_renderers.clone();

        stale_renderers.clear();
        components_freshened
    }

    /// Ensure that every prop in `prop_pointers` in fresh.
    /// This function:
    /// - adds needed dependencies to `dependency_graph`
    /// - resolves and freshens all dependencies of the props
    pub fn freshen_prop(&mut self, prop_pointers: &[PropPointer]) {
        let nodes_to_freshen = prop_pointers
            .iter()
            .filter_map(|prop_pointer| {
                let prop_node = self.prop_pointer_to_prop_node(*prop_pointer);
                let status = self.status.get_tag(&prop_node).unwrap();

                // If the current prop is fresh, there's nothing to do.
                // If it is unresolved, resolve it
                match status {
                    PropStatus::Fresh => None,
                    PropStatus::Unresolved => {
                        self.resolve_prop(*prop_pointer);
                        Some(prop_node)
                    }
                    PropStatus::Stale | PropStatus::Resolved => Some(prop_node),
                }
            })
            .collect::<Vec<_>>();

        for node in self
            .dependency_graph
            .descendants_reverse_topological_multiroot(&nodes_to_freshen)
        {
            // At this point, all dependencies of `node` must be fresh
            match *node {
                GraphNode::Prop(prop_idx) => {
                    let status = *self
                        .status
                        .get_tag(node)
                        .expect("No status set on prop");

                    match status {
                        PropStatus::Fresh => continue,
                        PropStatus::Unresolved => unreachable!("Prop should not be Unresolved!"),
                        PropStatus::Resolved | PropStatus::Stale => (),
                    };

                    // TODO: currently the calculated valued is stored on prop,
                    // so we are getting a mut view of it.
                    // In the future, we will store the value in a cache on core.
                    let prop_pointer = self.props[prop_idx].prop_pointer;
                    let mut prop = self.components[prop_pointer.component_idx]
                        .get_prop_mut(prop_pointer.local_prop_idx)
                        .unwrap();

                    // TODO: for efficiency, we should check if any dependencies have changed
                    // since the last time were here, and skip a call to calculate in that case.

                    // XXX: add new implementation of calculate that doesn't require mut
                    prop.calculate_and_mark_fresh();
                }
                _ => (),
            }
        }
    }

    /// Props are created lazily so they start as `Unresolved`.
    /// They need to be resolved to be used.
    ///
    /// We resolve the prop by adding its data query to the dependency graph.
    pub fn resolve_prop(&mut self, original_prop_ptr: PropPointer) {
        // Since resolving props won't recurse with repeated actions,
        // will go ahead and allocate the stack locally, for simplicity.
        let mut resolve_stack = Vec::new();

        resolve_stack.push(original_prop_ptr);

        while let Some(prop_ptr) = resolve_stack.pop() {
            let prop_node = self.prop_pointer_to_prop_node(prop_ptr);

            let status = self
                .status
                .get_tag(&prop_node)
                .unwrap_or(&PropStatus::Unresolved);

            if *status != PropStatus::Unresolved {
                // nothing to do if the prop is already resolved
                continue;
            }

            // TODO: the structure of the interface to props will be changed,
            // so this line will presumably be modified.
            // It might not need to be mutable any more.
            let data_queries = self.get_prop_mut(prop_ptr).unwrap().return_data_queries();

            for data_query in data_queries {
                // The data query we created may have referenced unresolved props,
                // so loop through all the props it references
                resolve_stack.extend(
                    self.add_data_query(prop_ptr, data_query)
                        .into_iter()
                        .filter_map(|node| match node {
                            GraphNode::Prop(prod_idx) => Some(self.props[prod_idx].prop_pointer),
                            _ => None,
                        }),
                );
            }

            self.status.set_tag(prop_node, PropStatus::Resolved);
        }
    }
}

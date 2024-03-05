use crate::state::PropPointer;

use super::{graph_based_core::Core, graph_node::GraphNode, props::cache::PropStatus};

impl Core {
    /// Ensure that every prop in `prop_pointers` in fresh.
    /// This function:
    /// - adds needed dependencies to `dependency_graph`
    /// - resolves and freshens all dependencies of the props
    pub fn freshen_props(&mut self, prop_pointers: &[PropPointer]) {
        let nodes_to_freshen = prop_pointers
            .iter()
            .filter_map(|prop_pointer| {
                let prop_node = self.prop_pointer_to_prop_node(*prop_pointer);
                let status = self.prop_cache.get_prop_status(prop_node);

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
                    let status = self.prop_cache.get_prop_status(node);

                    match status {
                        PropStatus::Fresh => continue,
                        PropStatus::Unresolved => unreachable!("Prop should not be Unresolved!"),
                        PropStatus::Resolved | PropStatus::Stale => (),
                    };

                    // TODO: currently the calculated valued is stored on prop,
                    // so we are getting a mut view of it.
                    // In the future, we will store the value in a cache on core.
                    let prop_pointer = self.props[prop_idx].meta.prop_pointer;
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
        let mut resolve_stack = vec![self.prop_pointer_to_prop_node(original_prop_ptr)];

        while let Some(prop_node) = resolve_stack.pop() {
            let status = self.prop_cache.get_prop_status(prop_node);

            if status != PropStatus::Unresolved {
                // nothing to do if the prop is already resolved
                continue;
            }

            let prop = &self.props[prop_node.idx()];
            let data_queries = prop.updater.data_queries();

            for data_query in data_queries {
                // The data query we created may have referenced unresolved props,
                // so loop through all the props it references
                resolve_stack.extend(
                    self.add_data_query(prop_node, data_query)
                        .into_iter()
                        .filter_map(|node| match node {
                            GraphNode::Prop(_) => Some(node),
                            _ => None,
                        }),
                );
            }

            self.prop_cache
                .set_prop_status(prop_node, PropStatus::Resolved);
        }
    }

    //    ///
    //    pub fn execute_data_query(&mut self, prop_pointer: PropPointer, data_query: DataQuery) {
    //        match data_query {
    //            DataQuery::State => {
    //                let prop = self.get_prop_mut(prop_pointer).unwrap();
    //                prop.calculate_and_mark_fresh();
    //            }
    //            DataQuery::Prop(prop_pointer) => {
    //                self.resolve_prop(prop_pointer);
    //            }
    //            DataQuery::Query(query_pointer) => {
    //                self.resolve_query(query_pointer);
    //            }
    //        }
    //    }
}

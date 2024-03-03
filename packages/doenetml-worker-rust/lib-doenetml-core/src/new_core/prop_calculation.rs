use crate::{
    components::prelude::ComponentProps,
    graph::directed_graph::Taggable,
    state::{Freshness, PropPointer},
};

use super::{graph_based_core::Core, graph_node::GraphNode};

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
                let freshness = self
                    .freshness
                    .get_tag(&prop_node)
                    .unwrap_or(&Freshness::Unresolved);

                // If the current prop is fresh, there's nothing to do.
                // If it is unresolved, resolve it
                match freshness {
                    Freshness::Fresh => None,
                    Freshness::Unresolved => {
                        self.resolve_prop(*prop_pointer);
                        Some(prop_node)
                    }
                    Freshness::Stale | Freshness::Resolved => Some(prop_node),
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
                    let freshness = *self
                        .freshness
                        .get_tag(node)
                        .expect("No freshness set on prop");

                    match freshness {
                        Freshness::Fresh => continue,
                        Freshness::Unresolved => unreachable!("Prop should not be Unresolved!"),
                        Freshness::Resolved | Freshness::Stale => (),
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

            let freshness = self
                .freshness
                .get_tag(&prop_node)
                .unwrap_or(&Freshness::Unresolved);

            if *freshness != Freshness::Unresolved {
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

            self.freshness.set_tag(prop_node, Freshness::Resolved);
        }
    }
}

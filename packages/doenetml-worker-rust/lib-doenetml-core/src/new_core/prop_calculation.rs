use super::{
    graph_based_core::Core,
    graph_node::GraphNode,
    props::{
        cache::{PropStatus, PropWithMeta},
        DataQueryResult,
    },
};

impl Core {
    /// Props are created lazily so they start as `Unresolved`.
    /// They need to be resolved to be used.
    ///
    /// We resolve the prop by adding its data query to the dependency graph.
    pub fn resolve_prop(&mut self, prop_node: GraphNode) {
        // Short-circuit if the prop is already resolved
        if self.prop_cache.get_prop_status(prop_node) != PropStatus::Unresolved {
            return;
        }

        // Since resolving props won't recurse with repeated actions,
        // will go ahead and allocate the stack locally, for simplicity.
        let mut resolve_stack = vec![prop_node];

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
                        .filter(|node| matches!(node, GraphNode::Prop(_))),
                );
            }

            self.prop_cache
                .set_prop_status(prop_node, PropStatus::Resolved);
        }
    }

    /// Gets the `DataQueryResult` associated with the given data query node.
    pub fn execute_data_query(&mut self, query_node: GraphNode) -> DataQueryResult {
        for prop_node in self
            .dependency_graph
            .get_children(query_node)
            .into_iter()
            .filter(|node| matches!(node, GraphNode::Prop(_)))
        {
            self.resolve_prop(prop_node);
        }
        self._execute_data_query_with_resolved_deps(query_node)
    }

    /// Executes a data query for a **resolved** prop. This function will recursively
    /// compute any dependencies required to call the prop's `calculate` function.
    ///
    /// If `prop_node` is not resolved, this function will panic.
    fn _execute_data_query_with_resolved_deps(&self, query_node: GraphNode) -> DataQueryResult {
        let skip_fn = |prop_node: &GraphNode| {
            if matches!(prop_node, GraphNode::Prop(_)) {
                self.prop_cache.get_prop_status(prop_node) == PropStatus::Fresh
            } else {
                false
            }
        };

        // Compute all the prop values in topological order
        for node in self
            .dependency_graph
            .descendants_reverse_topological_multiroot_with_skip(&[query_node], skip_fn)
        {
            match *node {
                GraphNode::Prop(prop_idx) => {
                    // This refers to a dependency of the current prop we're trying to calculate
                    let dependency_prop_node = *node;

                    // Sanity check before we continue
                    match self.prop_cache.get_prop_status(dependency_prop_node) {
                        PropStatus::Fresh => {
                            unreachable!("Prop should already be skipped due to topological sort!")
                        }
                        PropStatus::Unresolved => unreachable!("Prop should not be Unresolved!"),
                        PropStatus::Resolved | PropStatus::Stale => {}
                    };

                    let required_data = self
                        .get_data_query_nodes_for_prop(dependency_prop_node)
                        .into_iter()
                        .map(|dependency_query_node| {
                            self._execute_data_query_with_fresh_deps(dependency_query_node)
                        })
                        .collect::<Vec<_>>();
                    let prop = &self.props[prop_idx];
                    self.prop_cache
                        .set_prop(node, prop.updater.calculate(required_data));
                }
                _ => {
                    // Only Prop nodes need to be recursively calculated.
                }
            }
        }

        // By now the prop and all of its dependencies have been calculated.
        // The prop _must_ be fresh, so we can just retrieve its value.
        self._execute_data_query_with_fresh_deps(query_node)
    }

    /// Executes a data query assuming all props for the data query are already fresh.
    ///
    /// Will panic if any required prop is not fresh.
    fn _execute_data_query_with_fresh_deps(&self, query_node: GraphNode) -> DataQueryResult {
        // The props for the data query should be the immediate children of the query node
        let values = self
            .dependency_graph
            .get_children(query_node)
            .into_iter()
            .filter_map(|node| {
                match node {
                    GraphNode::Prop(_) => {
                        let prop_to_calculate = node;
                        // The prop should be fresh, so `unreachable_calculate` should never be called
                        Some(
                            self.prop_cache
                                .get_prop_unchecked(prop_to_calculate, query_node),
                        )
                    }
                    GraphNode::State(_) => Some(self.states.get_state(node, query_node)),
                    // XXX: Can we have other children
                    _ => None,
                }
            })
            .collect::<Vec<_>>();

        DataQueryResult {
            graph_node: query_node,
            values,
        }
    }

    /// Get the value of a prop for rendering. If the prop is stale or not resolved,
    /// this function will resolve the prop, calculate all its dependencies, and then
    /// return the result of `PropUpdater::calculate` applied to those dependencies.
    pub fn get_prop_for_render(&mut self, prop_node: GraphNode) -> PropWithMeta {
        self.resolve_prop(prop_node);

        self.prop_cache
            .get_prop(prop_node, self.for_render_query_node, || {
                let required_data = self
                    .get_data_query_nodes_for_prop(prop_node)
                    .into_iter()
                    .map(|query_node| self._execute_data_query_with_resolved_deps(query_node))
                    .collect::<Vec<_>>();

                let prop = &self.props[prop_node.prop_idx()];
                prop.updater.calculate(required_data)
            })
    }

    fn get_data_query_nodes_for_prop(&self, prop_node: GraphNode) -> Vec<GraphNode> {
        self.dependency_graph.get_children(prop_node).into_iter().inspect(|n| {
            if !matches!(n, GraphNode::Query(_)) {
                panic!("Dependency graph should only have DataQuery nodes as children of Prop nodes!");
            }
        }).collect()
    }
}

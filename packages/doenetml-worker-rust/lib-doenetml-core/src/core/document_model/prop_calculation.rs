use std::rc::Rc;

use crate::{
    props::{DataQuery, DataQueryFilter, DataQueryFilterComparison, DataQueryResults, PropValue},
    state::types::element_refs::ElementRefs,
};

use super::{
    super::{
        graph_node::GraphNode,
        props::{
            cache::{PropStatus, PropWithMeta},
            DataQueryResult,
        },
    },
    DocumentModel,
};

impl DocumentModel {
    /// Props are created lazily so they start as `Unresolved`.
    /// They need to be resolved to be used.
    ///
    /// We resolve the prop by adding its data query to the dependency graph.
    pub fn resolve_prop(&self, prop_node: GraphNode) {
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

            let prop = self.get_prop_definition(prop_node);
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
            .borrow()
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
    pub fn _execute_data_query_with_resolved_deps(&self, query_node: GraphNode) -> DataQueryResult {
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
            .borrow()
            .descendants_reverse_topological_multiroot_with_skip(&[query_node], skip_fn)
        {
            match *node {
                GraphNode::Prop(_) => {
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

                    let required_data = DataQueryResults::from_vec(
                        self.get_data_query_nodes_for_prop(dependency_prop_node)
                            .into_iter()
                            .map(|dependency_query_node| {
                                self._execute_data_query_with_fresh_deps(dependency_query_node)
                            })
                            .collect(),
                    );

                    let prop_definition = self.get_prop_definition(node);
                    self.prop_cache.set_prop(
                        node,
                        prop_definition.updater.calculate_untyped(required_data),
                    );
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
        let query = &self.queries.borrow()[query_node.idx()];

        match query {
            DataQuery::FilteredChildren {
                filters,
                include_if_missing_profile: _,
            } => {
                let values = self
                    .dependency_graph
                    .borrow()
                    .get_children(query_node)
                    .into_iter()
                    .filter_map(|node| {
                        match node {
                            GraphNode::Virtual(_) => {
                                let virtual_node = node;
                                let virtual_children =
                                    self.dependency_graph.borrow().get_children(virtual_node);

                                let component_node = virtual_children[0];

                                let prop_filters =
                                    filters.iter().filter_map(|filter| match filter {
                                        DataQueryFilter::PropProfile(prop_filter) => {
                                            Some(prop_filter)
                                        }
                                        DataQueryFilter::ComponentType(_) => None,
                                    });

                                let include_node = virtual_children[1..]
                                    .iter()
                                    .zip(prop_filters)
                                    .all(|(prop_node, prop_filter)| {
                                        let prop_value = self
                                            .prop_cache
                                            .get_prop_unchecked(prop_node, query_node)
                                            .value;

                                        match prop_filter.comparison {
                                            DataQueryFilterComparison::Equal => {
                                                prop_value == prop_filter.value
                                            }
                                            DataQueryFilterComparison::NotEqual => {
                                                prop_value != prop_filter.value
                                            }
                                        }
                                    });

                                if include_node {
                                    Some(PropWithMeta {
                                        // TODO: once we have a singular `GraphNode` we can remove the vector
                                        value: PropValue::GraphNodes(Rc::new(vec![component_node])),
                                        came_from_default: false,
                                        // Note: a component reference can't change like a prop can change,
                                        // but we mark `changed` as `true` as we don't know if this is the first time it is queried
                                        changed: true,
                                        origin: Some(node),
                                    })
                                } else {
                                    None
                                }
                            }
                            GraphNode::String(_) => Some(PropWithMeta {
                                // TODO: once we have a singular `GraphNode` we can remove the vector
                                value: PropValue::GraphNodes(Rc::new(vec![node])),
                                came_from_default: false,
                                // Note: a component reference can't change like a prop can change,
                                // but we mark `changed` as `true` as we don't know if this is the first time it is queried
                                changed: true,
                                origin: Some(node),
                            }),

                            // XXX: Can we have other children
                            _ => None,
                        }
                    })
                    .collect::<Vec<_>>();

                DataQueryResult { values }
            }
            _ => {
                // default behavior

                // The props for the data query should be the immediate children of the query node
                let values = self
                    .dependency_graph
                    .borrow()
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
                            GraphNode::String(_) => Some(
                                self.document_structure
                                    .borrow()
                                    .get_string(node, query_node),
                            ),
                            // TODO: do we want to references to elements somewhere so we don't have to recreate each time?
                            GraphNode::Component(component_idx) => Some(PropWithMeta {
                                // TODO: once we have a singular `ElementRef` we can remove the vector
                                value: PropValue::ElementRefs(Rc::new(ElementRefs(vec![
                                    component_idx.into(),
                                ]))),
                                came_from_default: false,
                                // Note: a component reference can't change like a prop can change,
                                // but we mark `changed` as `true` as we don't know if this is the first time it is queried
                                changed: true,
                                origin: Some(node),
                            }),
                            // XXX: Can we have other children
                            _ => None,
                        }
                    })
                    .collect::<Vec<_>>();

                DataQueryResult { values }
            }
        }
    }

    /// Get all `GraphNodes` that correspond to the data queries that determine the value of `prop_node`
    pub fn get_data_query_nodes_for_prop(&self, prop_node: GraphNode) -> Vec<GraphNode> {
        self.dependency_graph.borrow().get_children(prop_node).into_iter().inspect(|n| {
            if !matches!(n, GraphNode::Query(_)) {
                panic!("Dependency graph should only have DataQuery nodes as children of Prop nodes!");
            }
        }).collect()
    }

    /// Get the data needed to calculate the value of `prop_node` assuming that all the dependencies are fresh.
    ///
    /// **Note**: will panic if any of the data are not fresh.
    pub fn _get_data_query_results_assuming_fresh_deps(
        &self,
        prop_node: GraphNode,
    ) -> DataQueryResults {
        DataQueryResults::from_vec(
            self.get_data_query_nodes_for_prop(prop_node)
                .into_iter()
                .map(|dependency_query_node| {
                    self._execute_data_query_with_fresh_deps(dependency_query_node)
                })
                .collect(),
        )
    }

    /// Get the data needed to calculate the value of `prop_node.`
    pub fn get_data_query_results(&mut self, prop_node: GraphNode) -> DataQueryResults {
        DataQueryResults::from_vec(
            self.get_data_query_nodes_for_prop(prop_node)
                .into_iter()
                .map(|dependency_query_node| self.execute_data_query(dependency_query_node))
                .collect(),
        )
    }
}

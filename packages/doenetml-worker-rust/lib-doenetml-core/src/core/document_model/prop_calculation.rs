use std::rc::Rc;

use crate::{
    props::{DataQuery, DataQueryResults, FilterData, PropSource, PropValue},
    state::types::content_refs::{ContentRef, ContentRefs},
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

/// Structure for representing prop nodes on the resolve_stack
/// along with any of their queries that have been successfully added
struct NodeAndQueries {
    prop_node: GraphNode,
    completed_queries: Option<Vec<usize>>,
}

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
        let mut resolve_stack = vec![NodeAndQueries {
            prop_node,
            completed_queries: None,
        }];

        while let Some(NodeAndQueries {
            prop_node,
            completed_queries,
        }) = resolve_stack.pop()
        {
            let status = self.prop_cache.get_prop_status(prop_node);

            if status == PropStatus::Resolving {
                // If prop is in resolving state, that means we've gotten back to this prop
                // after all its dependencies have been resolved.
                // So the prop is now fully resolved
                self.prop_cache
                    .set_prop_status(prop_node, PropStatus::Resolved);
                continue;
            }
            if status != PropStatus::Unresolved {
                // nothing to do if the prop is already resolved
                continue;
            }

            let prop = self.get_prop_definition(prop_node);
            let data_queries = prop.updater.data_queries();
            let mut found_query_to_redo = false;
            let mut new_completed_queries = completed_queries.unwrap_or_default();

            let mut new_props_to_resolve = Vec::new();

            for (query_idx, data_query) in data_queries.into_iter().enumerate() {
                // The data query we created may have referenced unresolved props,
                // so loop through all the props it references

                if !new_completed_queries.contains(&query_idx) {
                    match self.add_data_query(prop_node, data_query) {
                        Ok(linked_nodes) => {
                            new_props_to_resolve.extend(
                                linked_nodes
                                    .into_iter()
                                    .filter(|node| matches!(node, GraphNode::Prop(_))),
                            );
                            new_completed_queries.push(query_idx);
                        }
                        Err(node) => {
                            new_props_to_resolve.push(node);
                            found_query_to_redo = true
                        }
                    }
                }
            }

            // Put the prop back on the stack.
            // We will get it again either to try again to add more queries
            // or to mark it as resolved once we've already gotten through all its dependencies
            resolve_stack.push(NodeAndQueries {
                prop_node,
                completed_queries: Some(new_completed_queries),
            });
            // Add any new props that need to be resolved before we look at prop_node again
            resolve_stack.extend(new_props_to_resolve.into_iter().map(|node| NodeAndQueries {
                prop_node: node,
                completed_queries: None,
            }));

            if !found_query_to_redo {
                // We succeeded in adding all the prop's queries.
                // When we get back to the prop in the stack again, it will be fully resolved
                self.prop_cache
                    .set_prop_status(prop_node, PropStatus::Resolving);
            }
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
                        PropStatus::Resolving => unreachable!("Prop should not be Resolving!"),
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

        // Get the prop pointer to the prop that owns the current query.
        let get_prop_pointer = || {
            let prop_node = self.get_nearest_prop_ancestor_of_query(query_node);
            let prop_node = prop_node.expect("Query node was not owned by a unique prop.");
            self.get_prop_pointer(prop_node)
        };

        match query {
            DataQuery::ComponentRefs { container, filter } => {
                // Resolve a `PropSource` to a component index.
                let resolve_prop_source = |prop_source: &PropSource| match prop_source {
                    PropSource::Me => get_prop_pointer().component_idx,
                    PropSource::Parent => self
                        .document_structure
                        .borrow()
                        .get_true_component_parent(get_prop_pointer().component_idx)
                        .unwrap(),
                    PropSource::ByIdx(component_idx) => *component_idx,
                    PropSource::StaticComponentRef(_) => {
                        panic!("Cannot combine `StaticComponentRef` with `ComponentRefs` query")
                    }
                };

                // Get the correct "root" for the query.
                let component_idx = resolve_prop_source(container);
                let content_children = self.get_component_content_children(component_idx);

                let mut content_refs: Vec<ContentRef> = Vec::new();
                for node in content_children {
                    if filter.apply_test(&FilterData {
                        node,
                        origin: query_node,
                        document_model: self,
                    }) {
                        match node {
                            GraphNode::Component(_) => {
                                content_refs.push(ContentRef::Component(node.component_idx().into()));
                            }
                            GraphNode::String(_) => {
                                content_refs.push(ContentRef::String(node.idx().into()));
                            }
                            GraphNode::Prop(_) => {
                                // The referent of a PropValue::ContentRef child should be forwarded.
                                // Note: the filter is *not* applied to the forward referent.
                                let c_refs: ContentRefs = self._get_prop_unchecked(node, query_node).value.try_into().unwrap();
                                content_refs.extend(c_refs.into_vec());
                            }
                            _ => panic!(
                                "Unexpected child of `GraphNode::Query` coming from `DataQuery::ComponentRefs`. Got node `{:?}`",
                                node
                            ),
                        }
                    }
                }

                DataQueryResult {
                    values: vec![PropWithMeta {
                        value: PropValue::ContentRefs(Rc::new(content_refs.into())),
                        came_from_default: false,
                        changed: true,
                        origin: Some(query_node),
                    }],
                }
            }
            DataQuery::SelfRef => {
                // This query is computed on the fly. We need to figure out who asked for this query.
                let prop_pointer = get_prop_pointer();

                DataQueryResult {
                    values: vec![PropWithMeta {
                        value: PropValue::ComponentRef(Some(prop_pointer.component_idx.into())),
                        came_from_default: false,
                        changed: true,
                        origin: None,
                    }],
                }
            }
            _ => {
                //
                // default behavior
                //

                // The props for the data query should be the immediate children of the query node
                let values = self
                    .dependency_graph
                    .borrow()
                    .get_children(query_node)
                    .into_iter()
                    .map(|node| {
                        match node {
                            GraphNode::Prop(_) => {
                                let prop_to_calculate = node;
                                // The prop should be fresh, so `unreachable_calculate` should never be called
                                    self.prop_cache
                                        .get_prop_unchecked(prop_to_calculate, query_node)
                            }
                            GraphNode::State(_) => self.states.get_state(node, query_node),
                            GraphNode::String(_) => self.document_structure
                                    .borrow()
                                    .get_string(node, query_node),
                            GraphNode::Component(component_idx) => PropWithMeta {
                                value: PropValue::ComponentRef(Some(component_idx.into())),
                                came_from_default: false,
                                // Note: a component reference can't change like a prop can change,
                                // but we mark `changed` as `true` as we don't know if this is the first time it is queried
                                changed: true,
                                origin: Some(node),
                            },

                            _ => panic!("Unexpected child of `GraphNode::Query` coming from `DataQuery`. Got node `{:?}`", node),
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

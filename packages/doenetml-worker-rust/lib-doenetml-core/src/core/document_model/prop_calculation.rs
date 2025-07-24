use std::rc::Rc;

use crate::{
    dast::ElementRefAnnotation,
    props::{DataQuery, DataQueryResults, FilterData, PropSource, PropValue},
    state::types::content_refs::{ContentRef, ContentRefs},
};

use super::{
    super::{
        graph_node::GraphNode,
        props::{
            DataQueryResult,
            cache::{PropStatus, PropWithMeta},
        },
    },
    DocumentModel,
};

#[derive(Debug, Copy, Clone)]
enum ResolvedStatus {
    Resolved,
    Unresolved,
}

/// The status of all the queries associated with a prop.
#[derive(Debug)]
enum QueriesStatus {
    /// Not all queries have been fully computed. Query number n is fully processed if `vec[n] == true`.
    PartialResolution(Vec<ResolvedStatus>),
    /// No data queries have been computed.
    Unprocessed,
    /// All data queries have been computed (but their dependencies may not be processed yet).
    Processed,
    /// Used as a placeholder. If a node in this state is encountered, it is an error in _this_ function.
    InvalidState,
}
impl QueriesStatus {
    fn with_unresolved_queries(num_queries: usize, unresolved_query_indices: &[usize]) -> Self {
        let mut completed_queries = vec![ResolvedStatus::Resolved; num_queries];
        for idx in unresolved_query_indices {
            completed_queries[*idx] = ResolvedStatus::Unresolved;
        }
        Self::PartialResolution(completed_queries)
    }
}

/// Structure for representing prop nodes on the resolve_stack
/// along with any of their queries that have been successfully added
#[derive(Debug)]
struct NodeProcessingState {
    prop_node: GraphNode,
    status: QueriesStatus,
}

impl NodeProcessingState {
    fn new(prop_node: GraphNode) -> Self {
        Self {
            prop_node,
            status: QueriesStatus::Unprocessed,
        }
    }
}

impl Default for NodeProcessingState {
    fn default() -> Self {
        Self {
            prop_node: GraphNode::Virtual(usize::MAX),
            status: QueriesStatus::InvalidState,
        }
    }
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

        // Stack to keep track of props that need to be resolved
        let mut resolve_stack = vec![NodeProcessingState::new(prop_node)];
        let mut tmp_unresolved_queries = Vec::new();
        let mut tmp_unresolved_query_nodes = Vec::new();

        while !resolve_stack.is_empty() {
            let processing_state_idx = resolve_stack.len() - 1;
            let mut processing_state = std::mem::take(&mut resolve_stack[processing_state_idx]);
            if matches!(processing_state.status, QueriesStatus::InvalidState) {
                panic!("Invalid state in resolve_stack");
            }

            let prop_node = processing_state.prop_node;
            match self.prop_cache.get_prop_status(prop_node) {
                PropStatus::Resolved | PropStatus::Fresh | PropStatus::Stale => {
                    resolve_stack.pop();
                    continue;
                }
                PropStatus::Resolving => {
                    if matches!(processing_state.status, QueriesStatus::Processed) {
                        // If prop is in resolving state, that means we've gotten back to this prop
                        // after all its dependencies have been resolved; it's now resolved.
                        self.prop_cache
                            .set_prop_status(prop_node, PropStatus::Resolved);
                        resolve_stack.pop();
                        continue;
                    }
                }
                PropStatus::Unresolved => {
                    // Continue processing the prop. It needs to be resolved.
                }
            }

            // We are starting the process of resolving `prop_node`
            self.prop_cache
                .set_prop_status(prop_node, PropStatus::Resolving);

            let prop = self.get_prop_definition(prop_node);
            let data_queries = prop.updater.data_queries();
            let num_data_queries = data_queries.len();
            match processing_state.status {
                QueriesStatus::InvalidState | QueriesStatus::Processed => unreachable!(),
                QueriesStatus::Unprocessed => {
                    // If we're here, no previous processing of this prop has been done.

                    // Most of the time we won't need to do any further processing of queries.
                    // This is the common (optimized) case.
                    tmp_unresolved_queries.clear();
                    tmp_unresolved_query_nodes.clear();
                    for (i, data_query) in data_queries.into_iter().enumerate() {
                        match self.add_data_query(prop_node, data_query) {
                            Ok(linked_nodes) => resolve_stack.extend(
                                linked_nodes
                                    .into_iter()
                                    .filter(is_prop_node)
                                    .map(NodeProcessingState::new),
                            ),
                            Err(node) => {
                                // `node` is a node that needs to be resolved before we can finish resolving `prop_node`
                                tmp_unresolved_queries.push(i);
                                tmp_unresolved_query_nodes.push(node);
                            }
                        }
                    }
                    if tmp_unresolved_queries.is_empty() {
                        // We succeeded in adding all the prop's queries.
                        processing_state.status = QueriesStatus::Processed;
                    } else {
                        // If we have any unresolved dependencies, the prop is not fully resolved.
                        // We save information about which of its queries have already been resolved
                        // and push the remaining ones to the stack.
                        processing_state.status = QueriesStatus::with_unresolved_queries(
                            num_data_queries,
                            &tmp_unresolved_queries,
                        );
                        resolve_stack.extend(
                            tmp_unresolved_query_nodes
                                .iter()
                                .cloned()
                                .filter(is_prop_node)
                                .map(NodeProcessingState::new),
                        );
                    }
                }
                QueriesStatus::PartialResolution(ref mut resolved_status) => {
                    // If we're here, we have tried to resolve this prop before but some of its queries
                    // had dependencies that needed to be resolved first. `resolved_status` stores
                    // whether each query has been resolved or not. It is rare that we end up in this loop,
                    // so efficiency is not as much of a concern.
                    tmp_unresolved_queries.clear();
                    tmp_unresolved_query_nodes.clear();
                    for (i, data_query) in data_queries.into_iter().enumerate() {
                        if matches!(resolved_status[i], ResolvedStatus::Resolved) {
                            // This data query has already been resolved
                            continue;
                        }
                        match self.add_data_query(prop_node, data_query) {
                            Ok(linked_nodes) => {
                                resolved_status[i] = ResolvedStatus::Resolved;
                                resolve_stack.extend(
                                    linked_nodes
                                        .into_iter()
                                        .filter(is_prop_node)
                                        .map(NodeProcessingState::new),
                                )
                            }
                            Err(node) => {
                                // `node` is a node that needs to be resolved before we can finish resolving `prop_node`
                                tmp_unresolved_queries.push(i);
                                tmp_unresolved_query_nodes.push(node);
                            }
                        }
                    }
                    if tmp_unresolved_queries.is_empty() {
                        // We succeeded in adding all the prop's queries.
                        processing_state.status = QueriesStatus::Processed;
                    } else {
                        // If we have any unresolved dependencies, the prop is not fully resolved.
                        // We save information about which of its queries have already been resolved
                        // and push the remaining ones to the stack.
                        resolve_stack.extend(
                            tmp_unresolved_query_nodes
                                .iter()
                                .cloned()
                                .filter(is_prop_node)
                                .map(NodeProcessingState::new),
                        );
                    }
                }
            }
            resolve_stack[processing_state_idx] = processing_state;
        }
    }

    /// Gets the `DataQueryResult` associated with the given data query node.
    pub fn execute_data_query(&mut self, query_node: GraphNode) -> DataQueryResult {
        for node in self
            .dependency_graph
            .borrow()
            .get_children(query_node)
            .into_iter()
        {
            match node {
                GraphNode::Prop(_) => self.resolve_prop(node),
                GraphNode::Virtual(_) => {
                    // if we have a virtual node, we resolve its prop node children
                    // TODO: will we need to go yet another level of virtual nodes?
                    for child_node in self
                        .dependency_graph
                        .borrow()
                        .get_children(node)
                        .into_iter()
                    {
                        match child_node {
                            GraphNode::Prop(_) => self.resolve_prop(child_node),
                            _ => {}
                        }
                    }
                }
                _ => {}
            };
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
            DataQuery::ContentRefs { container, filter }
            | DataQuery::AnnotatedContentRefs { container, filter } => {
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

                match query {
                    DataQuery::ContentRefs { .. } => {
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
                                        content_refs.push(ContentRef::Component(
                                            node.component_idx().into(),
                                        ));
                                    }
                                    GraphNode::String(_) => {
                                        content_refs.push(ContentRef::String(node.idx().into()));
                                    }
                                    GraphNode::Prop(_) => {
                                        // The referent of a PropValue::ContentRef child should be forwarded.
                                        // Note: the filter is *not* applied to the forward referent.
                                        let c_refs: ContentRefs = self
                                            ._get_prop_unchecked(node, query_node)
                                            .value
                                            .try_into()
                                            .unwrap();
                                        content_refs.extend(c_refs.into_vec());
                                    }
                                    _ => panic!(
                                        "Unexpected child of `GraphNode::Query` coming from `DataQuery::ComponentRefs`. Got node `{node:?}`"
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
                    // `AnnotatedComponentRefs` are very similar to `ComponentRefs`, but they also include
                    // information about whether the content is original or comes from extending some other element.
                    DataQuery::AnnotatedContentRefs { .. } => {
                        let content_children =
                            self.get_component_content_children_annotated(component_idx);

                        let mut content_refs_and_annotations: Vec<(
                            ContentRef,
                            ElementRefAnnotation,
                        )> = Vec::new();
                        for (node, annotation) in content_children {
                            if filter.apply_test(&FilterData {
                                node,
                                origin: query_node,
                                document_model: self,
                            }) {
                                match node {
                                    GraphNode::Component(_) => {
                                        content_refs_and_annotations.push((
                                            ContentRef::Component(node.component_idx().into()),
                                            annotation,
                                        ));
                                    }
                                    GraphNode::String(_) => {
                                        content_refs_and_annotations.push((
                                            ContentRef::String(node.idx().into()),
                                            annotation,
                                        ));
                                    }
                                    GraphNode::Prop(_) => {
                                        // The referent of a PropValue::ContentRef child should be forwarded.
                                        // Note: the filter is *not* applied to the forward referent.
                                        let c_refs: ContentRefs = self
                                            ._get_prop_unchecked(node, query_node)
                                            .value
                                            .try_into()
                                            .unwrap();
                                        content_refs_and_annotations.extend(
                                            c_refs
                                                .into_vec()
                                                .into_iter()
                                                .map(|c_ref| (c_ref, annotation)),
                                        );
                                    }
                                    _ => panic!(
                                        "Unexpected child of `GraphNode::Query` coming from `DataQuery::ComponentRefs`. Got node `{node:?}`"
                                    ),
                                }
                            }
                        }

                        DataQueryResult {
                            values: vec![PropWithMeta {
                                value: PropValue::AnnotatedContentRefs(Rc::new(
                                    content_refs_and_annotations.into(),
                                )),
                                came_from_default: false,
                                changed: true,
                                origin: Some(query_node),
                            }],
                        }
                    }
                    _ => unreachable!(),
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
                let dependency_graph = self.dependency_graph.borrow();
                let values =
                    dependency_graph
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
                            GraphNode::Virtual(_) => {
                                // If we have a virtual node, it means we have a multiple props returned
                                // which will be the children of the virtual node.
                                let mut found_change = false;
                                let values = dependency_graph.get_children(node).into_iter().map(|child_node| {
                                    match child_node {
                                        GraphNode::Prop(_) => {
                                            // The prop should be fresh, so `unreachable_calculate` should never be called
                                            let with_meta = self.prop_cache
                                                .get_prop_unchecked(child_node, query_node);
                                            if with_meta.changed {
                                                found_change = true;
                                            }
                                            with_meta.value
                                        }
                                        GraphNode::State(_) => {
                                            let with_meta = self.states.get_state(child_node, query_node);
                                            if with_meta.changed {
                                                found_change = true;
                                            }
                                            with_meta.value
                                        }

                                        GraphNode::String(_) => {
                                            let with_meta= self.document_structure
                                                .borrow()
                                                .get_string(child_node, query_node);
                                            if with_meta.changed {
                                                found_change = true;
                                            }
                                            with_meta.value
                                        }
                                        GraphNode::Component(component_idx) => PropValue::ComponentRef(Some(component_idx.into())),
                                        GraphNode::Virtual(_) => {
                                            PropValue::None(())
                                        }
                                        _ => panic!("Unexpected child of `GraphNode::Virtual` coming from `DataQuery`. Got node `{child_node:?}`"),
                                    }
                                }).collect();
                                PropWithMeta {
                                    value: PropValue::PropVec(values),
                                    came_from_default: false,
                                    changed: found_change,
                                    origin: Some(node)
                                }

                            }

                            _ => panic!("Unexpected child of `GraphNode::Query` coming from `DataQuery`. Got node `{node:?}`"),
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

fn is_prop_node(node: &GraphNode) -> bool {
    matches!(node, GraphNode::Prop(_))
}

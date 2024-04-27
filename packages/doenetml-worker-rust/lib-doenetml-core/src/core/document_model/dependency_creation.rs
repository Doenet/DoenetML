use crate::{
    components::{
        prelude::DataQuery,
        types::{ComponentIdx, PropPointer},
    },
    props::{cache::PropStatus, FilterData, PickPropSource, PropSource, PropSpecifier},
};

use crate::{graph_node::GraphNode, props::PropValue};

use super::dependency_creation_helpers::*;
use super::DocumentModel;

impl DocumentModel {
    /// Create any state nodes that are required for the given `DataQuery`.
    fn _create_state_for_query(&self, prop_node: GraphNode, query: &DataQuery) {
        match query {
            DataQuery::State => {
                // Every prop can have exactly one piece of state. In the case of a prop extending another prop,
                // the state is stored on the "bottom  most" prop.
                let leaf_node = self.document_structure.borrow().get_prop_leaf(prop_node);

                // If `leaf_node` is `State`, then we already created a state node for this prop.
                // Otherwise, we have the "bottom most" prop. Create a new state node.
                match leaf_node {
                    GraphNode::State(_) => {}
                    GraphNode::Prop(_) => {
                        let prop_updater = self.get_prop_updater(leaf_node);

                        // TODO: when we load saved data from a data base, then set value and came_from_default
                        // from the data.
                        let default_value = prop_updater.default();
                        let came_from_default = true;

                        let state_node: GraphNode =
                            self.add_state_node(prop_node, default_value, came_from_default);
                        self.document_structure
                            .borrow_mut()
                            .add_edge(leaf_node, state_node);
                    }
                    _ => {
                        unreachable!(
                            "Found a non-prop/non-state node as a leaf node of a prop. Found {:?}.",
                            leaf_node
                        )
                    }
                }
            }
            _ => {
                // No new state to create
            }
        }
    }

    /// Creates all necessary dependencies for a `DataQuery`.
    /// Returns:
    ///  - `Ok(vec)` where `vec` is a vector of all graph nodes directly linked to the data query.
    ///  - `Err(node)` where `node` is the prop node that that needs to be resolved before this query can be added.
    pub(super) fn add_data_query(
        &self,
        prop_node: GraphNode,
        query: DataQuery,
    ) -> Result<Vec<GraphNode>, GraphNode> {
        let prop_pointer = self.get_prop_pointer(prop_node);

        // We may not always need `resolved_component_idx`, but if we do, it may
        // require additional dependencies to be resolved first. Thus, we resolve it here
        // _before_ modifying the dependency graph in any way.
        let resolved_component_idx = match &query {
            DataQuery::Prop { source, .. }
            | DataQuery::ComponentRefs {
                container: source, ..
            }
            | DataQuery::AnnotatedComponentRefs {
                container: source, ..
            } => {
                // If resolving the prop source requires resolving additional dependencies first,
                // we get an `Err` object here, which is passed to the caller so that they can resolve the dependency for us.
                self.resolve_prop_source(source, prop_node)?
            }
            DataQuery::PickProp { .. }
            | DataQuery::Attribute { .. }
            | DataQuery::State
            | DataQuery::SelfRef
            | DataQuery::Null => None,
        };

        self._create_state_for_query(prop_node, &query);

        //
        // Create appropriate dependencies on the dependency graph.
        //
        let query_node = self.add_query_node(prop_node, query.clone());
        self.dependency_graph
            .borrow_mut()
            .add_edge(prop_node, query_node);

        // Accumulate the props linked to the data query
        // to pass on to the caller
        let mut linked_nodes = Vec::new();

        let mut fn_add_edges = |edges_to_add: Vec<(GraphNode, GraphNode)>| {
            let mut dependency_graph = self.dependency_graph.borrow_mut();
            for (from, to) in edges_to_add {
                // Small sanity check to make sure we don't produce  self loop.
                // `prop_node` should not ask for a query that results in itself.
                assert_ne!(
                    prop_node, to,
                    "Self-loop detected; DataQuery requested a prop that is the same as the origin prop."
                );
                dependency_graph.add_edge(from, to);
                linked_nodes.push(to);
            }
        };

        match query {
            DataQuery::Null => {
                unreachable!("Cannot execute Null data query.")
            }

            // Depend on a piece of state
            DataQuery::State => {
                // State is stored as the leaf node on a chain of props. (A chain may exist because of `extending`)
                let state_node = self.document_structure.borrow().get_prop_leaf(prop_node);
                if !matches!(state_node, GraphNode::State(_)) {
                    unreachable!(
                        "Tried to create a state query for a prop that doesn't have a state node."
                    )
                }
                fn_add_edges(vec![(query_node, state_node)]);
            }

            DataQuery::SelfRef => {
                // SelfRef queries are computed on-the-fly, so there is no need to link them
                // to anything.
            }

            // Depend on a prop (of yourself or another component)
            DataQuery::Prop {
                source,
                prop_specifier,
            } => {
                // Check we have a valid configuration
                if matches!(prop_specifier, PropSpecifier::LocalIdx(_)) {
                    match source {
                        PropSource::Me | PropSource::ByIdx(_) => {}
                        _ => {
                            panic!("`LocalIdx` in a `DataQuery::Prop` is only valid when used with `Me` or `ByIdx`.")
                        }
                    }
                }
                let component_idx = match resolved_component_idx {
                    Some(idx) => idx,
                    None => {
                        // If we can't resolve the component, then we can't resolve the prop.
                        // Avoid a hard panic here.
                        return Ok(linked_nodes);
                    }
                };

                let edges_to_add = process_data_query_prop(
                    component_idx,
                    prop_specifier,
                    prop_pointer,
                    query_node,
                    &self.document_structure.borrow(),
                );
                fn_add_edges(edges_to_add);
            }

            // Find the requested attribute and filter its children
            // based on `match_profiles`. Create dependencies on the
            // resulting children.
            DataQuery::Attribute {
                attribute_name,
                match_profiles,
            } => {
                let edges_to_add = process_data_query_attribute(
                    attribute_name,
                    match_profiles,
                    prop_pointer,
                    query_node,
                    &self.document_structure.borrow(),
                );
                fn_add_edges(edges_to_add);
            }

            DataQuery::PickProp {
                source,
                prop_specifier,
            } => {
                if matches!(prop_specifier, PropSpecifier::LocalIdx(_)) {
                    panic!(
                        "`LocalIdx` as a prop specifier is forbidden in a `DataQuery::PickProp`."
                    )
                }

                let match_profiles = match prop_specifier {
                    PropSpecifier::Matching(profiles) => profiles,
                    PropSpecifier::LocalIdx(_) => unreachable!(),
                };

                let mut edges_to_add = Vec::new();

                match source {
                    PickPropSource::Children => {
                        let document_structure = self.document_structure.borrow();
                        let nodes_to_match = document_structure
                            .get_component_content_children(prop_pointer.component_idx)
                            .into_iter()
                            .flat_map(|node| pick_prop(node, &match_profiles, &document_structure))
                            .map(|node| (query_node, node));
                        for edge in nodes_to_match {
                            edges_to_add.push(edge);
                        }
                    }
                    PickPropSource::NearestMatchingAncestor => {
                        let document_structure = self.document_structure.borrow();
                        let mut nodes_to_match = document_structure
                            .get_true_component_ancestors(prop_pointer.component_idx)
                            .map(|idx| GraphNode::Component(idx.as_usize()))
                            .flat_map(|node| pick_prop(node, &match_profiles, &document_structure))
                            .map(|node| (query_node, node));
                        // Only link to the first match (if it exists)
                        if let Some(edge) = nodes_to_match.next() {
                            edges_to_add.push(edge);
                        }
                    }
                };

                fn_add_edges(edges_to_add);
            }

            DataQuery::AnnotatedComponentRefs {
                container: _container,
                filter,
            }
            | DataQuery::ComponentRefs {
                container: _container,
                filter,
            } => {
                let component_idx = match resolved_component_idx {
                    Some(idx) => idx,
                    None => {
                        // If we can't resolve the component, then we can't resolve the prop.
                        // This may happen if an invalid component ref is given. E.g. from `<xref ref=""/>` where the ref is not actually specified.
                        // Avoid a hard panic here.
                        return Ok(linked_nodes);
                    }
                };

                let mut edges_to_add = Vec::new();

                let content_children = self
                    .document_structure
                    .borrow()
                    .get_component_content_children(component_idx);

                for node in content_children {
                    // If the component was generated from syntax like `$sec.title`,
                    // then it will have a prop as a content child
                    if matches!(node, GraphNode::Prop(_)) {
                        edges_to_add.push((query_node, node));
                    } else {
                        let deps = filter.accumulate_deps(&FilterData {
                            node,
                            origin: query_node,
                            document_model: self,
                        });
                        // deps consists of everything that the filter could possibly depend on.
                        // We need to link each dep to the query node.
                        for dep in deps {
                            edges_to_add.push((query_node, dep));
                        }
                    }
                }

                fn_add_edges(edges_to_add);
            }
        }
        Ok(linked_nodes)
    }

    /// Given a `PropSource`, resolve it to a component index.
    /// Returns:
    ///  - `Ok(Some(component_idx))` if the `PropSource` was successfully resolved.
    ///  - `Ok(None)` if the `PropSource` could not be resolved, and could never be resolved. I.e. it failed for an unrecoverable reason like a malformed reference.
    ///  - `Err(node)` if the `PropSource` could not be resolved due to a dependency that needs to be resolved first.
    fn resolve_prop_source(
        &self,
        prop_source: &PropSource,
        prop_node: GraphNode,
    ) -> Result<Option<ComponentIdx>, GraphNode> {
        let prop_pointer = self.get_prop_pointer(prop_node);

        Ok(match prop_source {
            PropSource::Me => Some(prop_pointer.component_idx),
            PropSource::Parent => Some(
                self.document_structure
                    .borrow()
                    .get_true_component_parent(prop_pointer.component_idx)
                    .unwrap(),
            ),
            PropSource::ByIdx(component_idx) => Some(*component_idx),
            PropSource::StaticComponentRef(local_prop_idx) => {
                // This is the prop that contains the ref.
                let prop_node = self.prop_pointer_to_prop_node(PropPointer {
                    component_idx: prop_pointer.component_idx,
                    local_prop_idx: *local_prop_idx,
                });

                // If the prop is not resolved, then we abort this attempt to add the data query
                // in order to first resolve this prop.
                let status = self.prop_cache.get_prop_status(prop_node);
                if matches!(status, PropStatus::Unresolved | PropStatus::Resolving) {
                    return Err(prop_node);
                }

                // Since the prop is resolved, getting its value should not encounter any problems.
                // Use `GraphNode::Query(0)` for origin since it doesn't matter with untracked
                let prop = self.get_prop_untracked(prop_node, GraphNode::Query(0));
                let component_ref = match prop.value {
                        PropValue::ComponentRef(Some(component_ref)) => component_ref,
                        PropValue::ComponentRef(None) => {
                            // We have the correct prop type, but there wasn't a valid reference inside.
                            // This could result from a user's input (e.g., `<xref ref="" />`, with an invalid `ref` field),
                            // so we don't cause a hard panic here.
                            return Ok(None)
                        }
                        _ => panic!(
                            "Tried to resolve a `StaticComponentRef` but the prop had the wrong type. Expected `ComponentRef`. Found {:?}.", prop.value
                        ),
                    };
                Some(component_ref.0)
            }
        })
    }

    /// Create a new `GraphNode::State` and add it to the `structure_graph`.
    fn add_state_node(
        &self,
        _origin_node: GraphNode,
        value: PropValue,
        came_from_default: bool,
    ) -> GraphNode {
        let idx = self.states.add_state(value, came_from_default);

        GraphNode::State(idx)
    }

    /// Creates a `GraphNode::Query` node and saves information about the query to `self.queries`.
    /// The `GraphNode::Query` node is added to the `dependency_graph`.
    fn add_query_node(&self, _origin_node: GraphNode, query: DataQuery) -> GraphNode {
        let idx = self.queries.borrow().len();
        self.queries.borrow_mut().push(query);
        let new_node = GraphNode::Query(idx);
        self.dependency_graph.borrow_mut().add_node(new_node);
        new_node
    }

    /// Creates a `GraphNode::Virtual` node adds it to the `dependency_graph`.
    // XXX: Revisit if we still need this.
    #[allow(unused)]
    pub(super) fn add_virtual_node(&self, _origin_node: GraphNode) -> GraphNode {
        let idx = self.virtual_node_count.get();
        self.virtual_node_count.set(idx + 1);
        let new_node = GraphNode::Virtual(idx);
        self.dependency_graph.borrow_mut().add_node(new_node);
        new_node
    }
}

#[cfg(test)]
#[path = "dependency_creation.test.rs"]
mod test;

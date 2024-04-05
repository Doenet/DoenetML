use crate::{
    components::prelude::DataQuery,
    props::{PropComponent, PropSpecifier},
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
            DataQuery::SelfRef => {
                //  // SelfRef queries store state containing the prop's value. They are not affected
                //  // by `extend`.

                //  let state_node = self.add_state_node(prop_node, PropValue::ElementRef(None), true);
                //  self.document_structure
                //      .borrow_mut()
                //      .add_edge(prop_node, state_node);
            }
            _ => {
                // No new state to create
            }
        }
    }

    /// Creates all necessary dependencies for a `DataQuery`.
    /// Returns a vector of all graph nodes directly linked to the data query.
    pub(super) fn add_data_query(&self, prop_node: GraphNode, query: DataQuery) -> Vec<GraphNode> {
        self._create_state_for_query(prop_node, &query);

        //
        // Create appropriate dependencies on the dependency graph.
        //
        let query_node = self.add_query_node(prop_node, query.clone());
        self.dependency_graph
            .borrow_mut()
            .add_edge(prop_node, query_node);

        let prop_pointer = self
            .document_structure
            .borrow()
            .get_prop_definition(prop_node)
            .meta
            .prop_pointer;

        // Accumulate the props linked to the data query
        // to pass on to the caller
        let mut linked_nodes = Vec::new();

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
                self.dependency_graph
                    .borrow_mut()
                    .add_edge(query_node, state_node);
                linked_nodes.push(state_node);
            }

            DataQuery::SelfRef => {
                // SelfRef queries are computed on-the-fly, so there is no need to link them
                // to anything.
            }

            // Depend on a prop (of yourself or another component)
            DataQuery::Prop {
                component,
                prop_specifier,
            } => {
                // Check we have a valid configuration
                if matches!(prop_specifier, PropSpecifier::LocalIdx(_)) {
                    match component {
                        PropComponent::Me | PropComponent::ByIdx(_) => {}
                        _ => {
                            panic!("`LocalIdx` in a `DataQuery::Prop` is only valid when used with `Me` or `ByIdx`.")
                        }
                    }
                }

                let edges_to_add = process_data_query_prop(
                    component,
                    prop_specifier,
                    prop_pointer,
                    prop_node,
                    query_node,
                    &self.document_structure.borrow(),
                );
                let mut dependency_graph = self.dependency_graph.borrow_mut();
                for (from, to) in edges_to_add {
                    dependency_graph.add_edge(from, to);
                    linked_nodes.push(to);
                }
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
                    prop_node,
                    query_node,
                    &self.document_structure.borrow(),
                );
                let mut dependency_graph = self.dependency_graph.borrow_mut();
                for (from, to) in edges_to_add {
                    dependency_graph.add_edge(from, to);
                    linked_nodes.push(to);
                }
            }

            // Create a dependency from all children that match a profile from match_profiles.
            DataQuery::ChildPropProfile { match_profiles } => {
                let edges_to_add = process_data_query_child_prop_profile(
                    match_profiles,
                    prop_pointer,
                    prop_node,
                    query_node,
                    &self.document_structure.borrow(),
                );
                let mut dependency_graph = self.dependency_graph.borrow_mut();
                for (from, to) in edges_to_add {
                    dependency_graph.add_edge(from, to);
                    linked_nodes.push(to);
                }
            }

            DataQuery::ComponentRefs { container, filters } => {
                let edges_to_add = process_data_query_component_refs(
                    container,
                    filters,
                    prop_pointer,
                    prop_node,
                    query_node,
                    &self.document_structure,
                    self,
                );
                let mut dependency_graph = self.dependency_graph.borrow_mut();
                for (from, to) in edges_to_add {
                    dependency_graph.add_edge(from, to);
                    linked_nodes.push(to);
                }
            }
        }
        linked_nodes
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

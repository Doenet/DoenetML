use crate::{
    components::{
        prelude::DataQuery, ComponentAttributes, ComponentCommon, ComponentNode, ComponentProfile,
    },
    state::{ComponentProps, PropPointer},
};

use super::{graph_based_core::Core, graph_node::GraphNode};

impl Core {
    /// Creates all necessary dependencies for a `DataQuery`.
    /// Returns vector of all graph nodes directly linked to the data query    
    pub fn add_data_query(&mut self, prop_node: GraphNode, query: DataQuery) -> Vec<GraphNode> {
        //
        // Create any necessary state nodes
        //
        match query {
            DataQuery::State => {
                // Every prop can have exactly one piece of state. In the case of a prop extending another prop,
                // the state is stored on the "bottom  most" prop.
                let leaf_node = self.structure_graph.get_leaf(prop_node);

                if leaf_node.is_none() {
                    unreachable!("Every prop should have a leaf node")
                }
                let leaf_node = leaf_node.unwrap();

                // If `leaf_node` is `State`, then we already created a state node for this prop.
                // Otherwise, we have the "bottom most" prop. Create a new state node.
                match leaf_node {
                    GraphNode::State(_) => {}
                    GraphNode::Prop(_) => {
                        let state_node = self.add_state_node(prop_node);
                        self.structure_graph.add_edge(leaf_node, state_node);
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

        //
        // Create appropriate dependencies on the dependency graph.
        //
        let query_node = self.add_query_node(prop_node, query.clone());
        self.dependency_graph.add_edge(prop_node, query_node);

        let prop_pointer = self.props[prop_node.idx()].meta.prop_pointer;

        // Accumulate the props linked to the data query
        // to pass on to the caller
        let mut linked_nodes = Vec::new();

        match query {
            // Depend on a piece of state
            DataQuery::State => {
                // State is stored as the leaf node on a chain of props. (A chain may exist because of `extending`)
                let state_node = self.structure_graph.get_leaf(prop_node);
                if !matches!(state_node, Some(GraphNode::State(_))) {
                    unreachable!(
                        "Tried to create a state query for a prop that doesn't have a state node."
                    )
                }
                let state_node = state_node.unwrap();
                self.dependency_graph.add_edge(query_node, state_node);
                linked_nodes.push(state_node);
            }
            // Depend on a prop (of yourself or another component)
            DataQuery::Prop {
                component_idx,
                prop_idx: local_prop_idx,
            } => {
                let component_idx = component_idx.unwrap_or(prop_pointer.component_idx);
                let target_prop_node = self.prop_pointer_to_prop_node(PropPointer {
                    component_idx,
                    local_prop_idx,
                });
                assert_ne!(prop_node, target_prop_node, "Self-loop detected; DataQuery requested a prop that is the same as the origin prop.");
                self.dependency_graph.add_edge(query_node, target_prop_node);
                linked_nodes.push(target_prop_node);
            }
            // Create a dependency that references the value of prop_name
            // from the parent of this component
            DataQuery::ParentProp { prop_name } => {
                // If we're `extending`, we may not have a unique parent in the structure graph.
                // So we query the component to find the (unique) original parent.
                let parent_idx = self.components[prop_pointer.component_idx]
                    .get_parent()
                    .expect("Component asks for parent but there is none.");
                let prop_idx = self.components[parent_idx]
                    .get_local_prop_index_from_name(prop_name)
                    .unwrap_or_else(|| {
                        panic!(
                            "Cannot find prop `{}` on component `{}`",
                            prop_name,
                            self.components[parent_idx].get_component_type()
                        )
                    });

                // Now that we have the component and prop index, this is the same as a `DataQuery::Prop`.
                // XXX: this is wrong. We have added an extra query node onto origin in the dependency graph.
                // We should remove the first one.
                let nodes_from_parent = self.add_data_query(
                    prop_node,
                    DataQuery::Prop {
                        component_idx: Some(parent_idx),
                        prop_idx,
                    },
                );

                linked_nodes.extend(nodes_from_parent);
            }
            // Find the requested attribute and filter its children
            // based on `match_profiles`. Create dependencies on the
            // resulting children.
            DataQuery::Attribute {
                attribute_name,
                match_profiles,
            } => {
                // Find the requested attribute.
                let local_attr_idx = self.components[prop_pointer.component_idx]
                    .get_attribute_names()
                    .iter()
                    // This is an internal function call. Case-sensitive comparison.
                    .position(|&n| n == attribute_name)
                    .unwrap_or_else(|| {
                        panic!(
                            "Cannot find attribute `{}` on component `{}`",
                            attribute_name,
                            self.components[prop_pointer.component_idx].get_component_type()
                        )
                    });
                let attr_node = self
                    .structure_graph
                    .get_component_attributes(GraphNode::Component(prop_pointer.component_idx))
                    [local_attr_idx];
                // We may be extending another attribute. If so, find the "origin" node (i.e., the one with relevant children).
                let attr_node = self.attribute_node_origin(attr_node);

                for node in self.structure_graph.content_children(attr_node) {
                    match node {
                        GraphNode::Component(component_idx) => {
                            // Check the component. We want to link to the first prop that matches one of the profiles.
                            let component = &self.components[component_idx];
                            let matching_prop = component
                                .get_component_profile_local_prop_indices()
                                .into_iter()
                                .find_map(|prop_idx| {
                                    let prop_node =
                                        self.structure_graph.get_component_props(node)[prop_idx];
                                    let prop = self.props[prop_node.idx()];
                                    let profile = prop.meta.profile;

                                    if profile.is_some()
                                        && match_profiles.contains(&profile.unwrap())
                                    {
                                        Some(prop_node)
                                    } else {
                                        None
                                    }
                                });
                            if let Some(matching_prop) = matching_prop {
                                self.dependency_graph.add_edge(query_node, matching_prop);
                                linked_nodes.push(matching_prop);
                            }
                        }
                        GraphNode::String(_) => {
                            if match_profiles.contains(&ComponentProfile::String)
                                || match_profiles.contains(&ComponentProfile::LiteralString)
                            {
                                self.dependency_graph.add_edge(query_node, node);
                                linked_nodes.push(node);
                            }
                        }
                        GraphNode::State(_)
                        | GraphNode::Query(_)
                        | GraphNode::Prop(_)
                        | GraphNode::Virtual(_) => {
                            unreachable!("Cannot have GraphNode of type {:?} as a direct child of an attribute.", node);
                        }
                    }
                }
            }
            // Create a dependency from all children that match a profile from match_profiles.
            DataQuery::ChildPropProfile { match_profiles } => {
                let children_virtual_node = self
                    .structure_graph
                    .get_component_children_virtual_node(GraphNode::Component(
                        prop_pointer.component_idx,
                    ));

                for node in self.structure_graph.content_children(children_virtual_node) {
                    match node {
                        GraphNode::Component(component_idx) => {
                            // Check the component. We want to link to the first prop that matches one of the profiles.
                            let component = &self.components[component_idx];
                            let matching_prop = component
                                .get_component_profile_local_prop_indices()
                                .into_iter()
                                .find_map(|prop_idx| {
                                    let prop_node =
                                        self.structure_graph.get_component_props(node)[prop_idx];
                                    let prop = self.props[prop_node.idx()];
                                    let profile = prop.meta.profile;

                                    if profile.is_some()
                                        && match_profiles.contains(&profile.unwrap())
                                    {
                                        Some(prop_node)
                                    } else {
                                        None
                                    }
                                });

                            if let Some(matching_prop) = matching_prop {
                                self.dependency_graph.add_edge(query_node, matching_prop);
                                linked_nodes.push(matching_prop);
                            }
                        }
                        GraphNode::String(_) => {
                            if match_profiles.contains(&ComponentProfile::String)
                                || match_profiles.contains(&ComponentProfile::LiteralString)
                            {
                                self.dependency_graph.add_edge(query_node, node);
                                linked_nodes.push(node);
                            }
                        }
                        GraphNode::Prop(prop_idx) => {
                            let prop = &self.props[prop_idx];
                            let profile = prop.meta.profile;
                            if profile.is_some() && match_profiles.contains(&profile.unwrap()) {
                                self.dependency_graph.add_edge(query_node, node);
                                linked_nodes.push(node);
                            }
                        }
                        GraphNode::State(_) | GraphNode::Virtual(_) | GraphNode::Query(_) => {
                            unreachable!("Cannot have GraphNode of type {:?} as a content child of a component's children.", node);
                        }
                    }
                }
            }
        }
        linked_nodes
    }

    /// Create a new `GraphNode::State` and add it to the `structure_graph`.
    fn add_state_node(&mut self, origin_node: GraphNode) -> GraphNode {
        let idx = self.states.len();

        // XXX: What do we store here?
        self.states.push(());
        let new_node = GraphNode::State(idx);
        self.structure_graph.add_node(new_node);
        new_node
    }

    /// Creates a `GraphNode::Query` node and saves information about the query to `self.queries`.
    /// The `GraphNode::Query` node is added to the `dependency_graph`.
    fn add_query_node(&mut self, _origin_node: GraphNode, _query: DataQuery) -> GraphNode {
        let idx = self.queries.len();
        self.queries.push(());
        let new_node = GraphNode::Query(idx);
        self.dependency_graph.add_node(new_node);
        new_node
    }

    /// Convert a `PropPointer` to a `GraphNode::Prop`.
    pub fn prop_pointer_to_prop_node(&self, prop_pointer: PropPointer) -> GraphNode {
        self.structure_graph
            .get_component_props(GraphNode::Component(prop_pointer.component_idx))
            [prop_pointer.local_prop_idx]
    }

    /// Find the "origin" of a `GraphNode::Virtual` corresponding to an attribute. That is, if an attribute
    /// is extending another, walk down the tree until the attribute with content children
    /// is found.
    fn attribute_node_origin(&self, attribute_node: GraphNode) -> GraphNode {
        assert!(
            matches!(attribute_node, GraphNode::Virtual(_)),
            "Expected a virtual node, not {:?}",
            attribute_node
        );
        let children = self.structure_graph.get_children(attribute_node);
        // A unique virtual child means we are "extending" another attribute.
        if children.len() == 1 && matches!(children[0], GraphNode::Virtual(_)) {
            self.attribute_node_origin(children[0])
        } else {
            attribute_node
        }
    }
}

// XXX: re-enable
//#[cfg(test)]
//#[path = "dependency_creation.test.rs"]
//mod test;

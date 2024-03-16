use crate::{
    components::{
        prelude::DataQuery,
        types::{ComponentIdx, PropPointer},
        ComponentAttributes, ComponentCommon, ComponentNode,
    },
    props::{DataQueryFilter, DataQueryFilterComparison, PropProfile},
};

use super::{core::Core, graph_node::GraphNode, props::PropValue};

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
                    GraphNode::Prop(prop_idx) => {
                        let prop = &self.props[prop_idx];

                        // TODO: when we load saved data from a data base, then set value and came_from_default
                        // from the data.
                        let default_value = prop.updater.default();
                        let came_from_default = true;

                        let state_node: GraphNode =
                            self.add_state_node(prop_node, default_value, came_from_default);
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
            DataQuery::Null => {
                unreachable!("Cannot execute Null data query.")
            }
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
                local_prop_idx,
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
            // Create a dependency that references the value of the prop with `prop_profile`
            // from the parent of this component
            DataQuery::ParentProp { prop_profile } => {
                // If we're `extending`, we may not have a unique parent in the structure graph.
                // So we query the component to find the (unique) original parent.
                let parent_idx = self.components[prop_pointer.component_idx]
                    .get_parent()
                    .expect("Component asks for parent but there is none.");
                let local_prop_idx = self.components[parent_idx]
                    .provided_profiles()
                    .into_iter()
                    .find_map(|(profile, idx)| {
                        if profile == prop_profile {
                            Some(idx)
                        } else {
                            None
                        }
                    })
                    .unwrap_or_else(|| {
                        panic!(
                            "Cannot find prop with profile `{:?}` on component `{}`",
                            prop_profile,
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
                        local_prop_idx,
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
                    .get_component_attributes(prop_pointer.component_idx)[local_attr_idx];
                // We may be extending another attribute. If so, find the "origin" node (i.e., the one with relevant children).
                let attr_node = self.attribute_node_origin(attr_node);

                for node in self.structure_graph.get_content_children(attr_node) {
                    match node {
                        GraphNode::Component(_) => {
                            // Check the component. We want to link to the first prop that matches one of the profiles.
                            let component = &self.components[ComponentIdx::from(node)];
                            let matching_prop = component.provided_profiles().into_iter().find_map(
                                |(prop_profile, local_prop_idx)| {
                                    if match_profiles.contains(&prop_profile) {
                                        let prop_node = self
                                            .structure_graph
                                            .get_component_props(node)[local_prop_idx];
                                        Some(prop_node)
                                    } else {
                                        None
                                    }
                                },
                            );

                            if let Some(matching_prop) = matching_prop {
                                self.dependency_graph.add_edge(query_node, matching_prop);
                                linked_nodes.push(matching_prop);
                            }
                        }
                        GraphNode::String(_) => {
                            if match_profiles.contains(&PropProfile::String)
                                || match_profiles.contains(&PropProfile::LiteralString)
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
                    .get_component_children_virtual_node(prop_pointer.component_idx);

                for node in self
                    .structure_graph
                    .get_content_children(children_virtual_node)
                {
                    match node {
                        GraphNode::Component(_) => {
                            // Check the component. We want to link to the first prop that matches one of the profiles.
                            let component = &self.components[ComponentIdx::from(node)];
                            let matching_prop = component.provided_profiles().into_iter().find_map(
                                |(prop_profile, local_prop_idx)| {
                                    if match_profiles.contains(&prop_profile) {
                                        let prop_node = self
                                            .structure_graph
                                            .get_component_props(node)[local_prop_idx];
                                        Some(prop_node)
                                    } else {
                                        None
                                    }
                                },
                            );

                            if let Some(matching_prop) = matching_prop {
                                self.dependency_graph.add_edge(query_node, matching_prop);
                                linked_nodes.push(matching_prop);
                            }
                        }
                        GraphNode::String(_) => {
                            if match_profiles.contains(&PropProfile::String)
                                || match_profiles.contains(&PropProfile::LiteralString)
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
            DataQuery::FilteredChildren {
                filters,
                include_if_missing_profile,
            } => {
                let children_virtual_node = self
                    .structure_graph
                    .get_component_children_virtual_node(prop_pointer.component_idx);

                // create vector of content children so that we don't borrow core in loop
                // and can make a mutable borrow of core to create a virtual node
                let content_children = self
                    .structure_graph
                    .get_content_children(children_virtual_node)
                    .collect::<Vec<_>>();

                // We will exclude children that are not components if there is a component type filter
                // that restricts to a particular component type
                let exclude_non_components = filters.iter().any(|filter| {
                    if let DataQueryFilter::ComponentType(component_type_filter) = filter {
                        component_type_filter.comparison == DataQueryFilterComparison::Equal
                    } else {
                        false
                    }
                });

                for node in content_children {
                    match node {
                        GraphNode::Component(_) => {
                            let component = &self.components[ComponentIdx::from(node)];

                            let mut exclude_via_component_type = false;

                            let matching_props = filters
                                .iter()
                                .filter_map(|filter| match filter {
                                    DataQueryFilter::PropProfile(profile_filter) => component
                                        .provided_profiles()
                                        .into_iter()
                                        .find_map(|(prop_profile, local_prop_idx)| {
                                            if prop_profile == profile_filter.profile {
                                                let prop_node = self
                                                    .structure_graph
                                                    .get_component_props(node)[local_prop_idx];
                                                Some(prop_node)
                                            } else {
                                                None
                                            }
                                        }),
                                    DataQueryFilter::ComponentType(component_type_filter) => {
                                        let component_type = component.get_component_type();
                                        if match component_type_filter.comparison {
                                            DataQueryFilterComparison::Equal => {
                                                component_type
                                                    != component_type_filter.component_type
                                            }
                                            DataQueryFilterComparison::NotEqual => {
                                                component_type
                                                    == component_type_filter.component_type
                                            }
                                        } {
                                            exclude_via_component_type = true;
                                        }
                                        // no matching profiles from component type filter
                                        None
                                    }
                                })
                                .collect::<Vec<_>>();

                            if !exclude_via_component_type {
                                let n_prop_filters = filters
                                    .iter()
                                    .filter(|filter| {
                                        matches!(filter, DataQueryFilter::PropProfile(_))
                                    })
                                    .count();

                                // Include the component if found all matching profiles or
                                // if `include_if_missing_profile` is true.
                                // In these cases, it's possible the data query will return the component.
                                if matching_props.len() == n_prop_filters
                                    || include_if_missing_profile
                                {
                                    // add a virtual node for all the information for the component
                                    let virtual_node = self.add_virtual_node(query_node);
                                    self.dependency_graph.add_edge(query_node, virtual_node);
                                    linked_nodes.push(virtual_node);

                                    // first child of virtual node is always the component itself
                                    self.dependency_graph.add_edge(virtual_node, node);
                                    linked_nodes.push(node);

                                    if matching_props.len() == n_prop_filters {
                                        // we matched all filters, so add links to the props
                                        for prop_node in matching_props {
                                            self.dependency_graph.add_edge(virtual_node, prop_node);
                                            linked_nodes.push(prop_node);
                                        }
                                    }
                                }
                            }
                        }
                        _ => {
                            if !exclude_non_components {
                                self.dependency_graph.add_edge(query_node, node);
                                linked_nodes.push(node);
                            }
                        }
                    }
                }
            }
        }
        linked_nodes
    }

    /// Create a new `GraphNode::State` and add it to the `structure_graph`.
    fn add_state_node(
        &mut self,
        _origin_node: GraphNode,
        value: PropValue,
        came_from_default: bool,
    ) -> GraphNode {
        let idx = self.states.add_state(value, came_from_default);

        let new_node = GraphNode::State(idx);
        self.structure_graph.add_node(new_node);
        new_node
    }

    /// Creates a `GraphNode::Query` node and saves information about the query to `self.queries`.
    /// The `GraphNode::Query` node is added to the `dependency_graph`.
    fn add_query_node(&mut self, _origin_node: GraphNode, query: DataQuery) -> GraphNode {
        let idx = self.queries.len();
        self.queries.push(query);
        let new_node = GraphNode::Query(idx);
        self.dependency_graph.add_node(new_node);
        new_node
    }

    /// Creates a `GraphNode::Virtual` node adds it to the `dependency_graph`.
    fn add_virtual_node(&mut self, _origin_node: GraphNode) -> GraphNode {
        let new_node = GraphNode::Virtual(self.virtual_node_count);
        self.virtual_node_count += 1;
        self.dependency_graph.add_node(new_node);
        new_node
    }

    /// Convert a `PropPointer` to a `GraphNode::Prop`.
    pub fn prop_pointer_to_prop_node(&self, prop_pointer: PropPointer) -> GraphNode {
        self.structure_graph
            .get_component_props(prop_pointer.component_idx)[prop_pointer.local_prop_idx]
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

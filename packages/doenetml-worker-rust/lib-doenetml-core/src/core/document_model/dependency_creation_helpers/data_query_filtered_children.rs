use crate::{
    components::{
        types::{ComponentIdx, PropPointer},
        ComponentNode,
    },
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::{DataQueryFilter, DataQueryFilterComparison},
    DocumentModel,
};

/// Process a `DataQuery::FilteredChildren`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
pub fn process_data_query_filtered_children(
    filters: Vec<DataQueryFilter>,
    include_if_missing_profile: bool,
    prop_pointer: PropPointer,
    _prop_node: GraphNode,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
    document_model: &DocumentModel,
) -> Vec<(GraphNode, GraphNode)> {
    let mut ret = Vec::new();

    // create vector of content children so that we don't borrow core in loop
    // and can make a mutable borrow of core to create a virtual node
    let content_children =
        document_structure.get_component_content_children(prop_pointer.component_idx);

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
                let mut exclude_via_component_type = false;

                let matching_props = filters
                    .iter()
                    .filter_map(|filter| match filter {
                        DataQueryFilter::PropProfile(profile_filter) => document_structure
                            .get_component_prop_by_profile(
                                ComponentIdx::from(node),
                                &[profile_filter.profile],
                            )
                            .map(|prop_pointer| prop_pointer.into_prop_node(document_structure)),
                        DataQueryFilter::ComponentType(component_type_filter) => {
                            let component_type =
                                document_structure.get_component(node).get_component_type();
                            if match component_type_filter.comparison {
                                DataQueryFilterComparison::Equal => {
                                    component_type != component_type_filter.component_type
                                }
                                DataQueryFilterComparison::NotEqual => {
                                    component_type == component_type_filter.component_type
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
                        .filter(|filter| matches!(filter, DataQueryFilter::PropProfile(_)))
                        .count();

                    // Include the component if found all matching profiles or
                    // if `include_if_missing_profile` is true.
                    // In these cases, it's possible the data query will return the component.
                    if matching_props.len() == n_prop_filters || include_if_missing_profile {
                        // add a virtual node for all the information for the component
                        let virtual_node = document_model.add_virtual_node(query_node);
                        ret.push((query_node, virtual_node));

                        // first child of virtual node is always the component itself
                        ret.push((virtual_node, node));

                        if matching_props.len() == n_prop_filters {
                            // we matched all filters, so add links to the props
                            for prop_node in matching_props {
                                ret.push((virtual_node, prop_node));
                            }
                        }
                    }
                }
            }
            _ => {
                if !exclude_non_components {
                    ret.push((query_node, node));
                }
            }
        }
    }

    ret
}

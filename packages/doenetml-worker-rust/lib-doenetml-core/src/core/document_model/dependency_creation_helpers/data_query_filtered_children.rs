use std::{cell::RefCell, rc::Rc};

use crate::{
    components::types::PropPointer,
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::{BindableAsGraphNodeFilter, PropComponent},
    DocumentModel,
};

/// Process a `DataQuery::FilteredChildren`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
#[allow(clippy::too_many_arguments)]
pub fn process_data_query_filtered_children<'a>(
    container: PropComponent,
    filters: Rc<dyn BindableAsGraphNodeFilter<'a>>,
    prop_pointer: PropPointer,
    _prop_node: GraphNode,
    _query_node: GraphNode,
    document_structure: &'a RefCell<DocumentStructure>,
    document_model: &'a DocumentModel,
) -> Vec<(GraphNode, GraphNode)> {
    let ret = Vec::new();

    let component_idx = match container {
        PropComponent::Me => prop_pointer.component_idx,
        PropComponent::Parent => document_structure
            .borrow()
            .get_true_component_parent(prop_pointer.component_idx)
            .unwrap(),
        PropComponent::ByIdx(component_idx) => component_idx,
    };

    let content_children = document_structure
        .borrow()
        .get_component_content_children(component_idx);

    let bound_filter = filters.bind(document_model);

    //// We will exclude children that are not components if there is a component type filter
    //// that restricts to a particular component type
    //let exclude_non_components = filters.iter().any(|filter| {
    //    if let DataQueryFilter::ComponentType(component_type_filter) = filter {
    //        component_type_filter.comparison == DataQueryFilterComparison::Equal
    //    } else {
    //        false
    //    }
    //});

    //for node in content_children {
    //    match node {
    //        GraphNode::Component(_) => {
    //            let mut exclude_via_component_type = false;

    //            let matching_props = filters
    //                .iter()
    //                .filter_map(|filter| match filter {
    //                    DataQueryFilter::PropProfile(profile_filter) => document_structure
    //                        .get_component_prop_by_profile(
    //                            ComponentIdx::from(node),
    //                            &[profile_filter.profile],
    //                        )
    //                        .map(|prop_pointer| prop_pointer.into_prop_node(document_structure)),
    //                    DataQueryFilter::ComponentType(component_type_filter) => {
    //                        let component_type =
    //                            document_structure.get_component(node).get_component_type();
    //                        if match component_type_filter.comparison {
    //                            DataQueryFilterComparison::Equal => {
    //                                component_type != component_type_filter.component_type
    //                            }
    //                            DataQueryFilterComparison::NotEqual => {
    //                                component_type == component_type_filter.component_type
    //                            }
    //                            DataQueryFilterComparison::ProfilePresent => {
    //                                // We ignore the value because we always want to include this element
    //                                true
    //                            }
    //                        } {
    //                            exclude_via_component_type = true;
    //                        }
    //                        // no matching profiles from component type filter
    //                        None
    //                    }
    //                })
    //                .collect::<Vec<_>>();

    //            if !exclude_via_component_type {
    //                let n_prop_filters = filters
    //                    .iter()
    //                    .filter(|filter| matches!(filter, DataQueryFilter::PropProfile(_)))
    //                    .count();

    //                // Include the component if found all matching profiles or
    //                // if `include_if_missing_profile` is true.
    //                // In these cases, it's possible the data query will return the component.
    //                if matching_props.len() == n_prop_filters || include_if_missing_profile {
    //                    // add a virtual node for all the information for the component
    //                    let virtual_node = document_model.add_virtual_node(query_node);
    //                    ret.push((query_node, virtual_node));

    //                    // first child of virtual node is always the component itself
    //                    ret.push((virtual_node, node));

    //                    if matching_props.len() == n_prop_filters {
    //                        // we matched all filters, so add links to the props
    //                        for prop_node in matching_props {
    //                            ret.push((virtual_node, prop_node));
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        _ => {
    //            if !exclude_non_components {
    //                ret.push((query_node, node));
    //            }
    //        }
    //    }
    //}

    // Query is computed on the fly...so no need to link to anything?

    for node in content_children {
        if bound_filter.apply_test(&node) {
            // XXX: We also want to depend on the props we matched so that we know to re-trigger this query if any of them change?
            //   ret.push((query_node, node));
        }
    }

    ret
}

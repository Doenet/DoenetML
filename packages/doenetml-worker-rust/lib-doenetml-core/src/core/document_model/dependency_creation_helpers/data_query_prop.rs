use crate::{
    components::types::{ComponentIdx, PropPointer},
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::PropSpecifier,
    DocumentModel,
};

/// Process a `DataQuery::Prop`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
pub fn process_data_query_prop(
    component_idx: ComponentIdx,
    prop_specifier: PropSpecifier,
    _prop_pointer: PropPointer,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
    document_model: &DocumentModel,
) -> Vec<(GraphNode, GraphNode)> {
    match prop_specifier {
        PropSpecifier::LocalIdx(local_prop_idx) => {
            let target_prop_node = PropPointer {
                component_idx,
                local_prop_idx,
            }
            .into_prop_node(document_structure);
            vec![(query_node, target_prop_node)]
        }
        PropSpecifier::Matching(match_profiles) => {
            match document_structure.get_component_prop_by_profile(component_idx, &match_profiles) {
                Some(prop_matched) => {
                    let target_prop_node = prop_matched.into_prop_node(document_structure);
                    vec![(query_node, target_prop_node)]
                }
                None => vec![],
            }
        }
        PropSpecifier::MatchingPair(profiles1, profiles2) => {
            let prop_matches = [profiles1, profiles2].into_iter().map(|match_profiles| {
                document_structure.get_component_prop_by_profile(component_idx, &match_profiles)
            });

            if prop_matches.clone().any(|v| v.is_some()) {
                // Since we matched at least one prop,
                // we create a virtual node to organize all the props found.
                // This virtual node will be connected to each of the props matched
                // (or to a placeholder virtual node if a particular prop was not found)
                let virtual_node = document_model.add_virtual_node(query_node);
                let mut edges = vec![(query_node, virtual_node)];

                let target_nodes = prop_matches.map(|v| match v {
                    // the prop was found, so we'll connect to its node
                    Some(pp) => pp.into_prop_node(document_structure),
                    // the prop was not found, so we create a virtual node as a placeholder
                    None => document_model.add_virtual_node(query_node),
                });

                edges.extend(target_nodes.map(|node| (virtual_node, node)));

                edges
            } else {
                vec![]
            }
        }
    }
}

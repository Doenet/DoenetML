use crate::{
    components::types::{ComponentIdx, PropPointer},
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::PropSpecifier,
};

/// Process a `DataQuery::Prop`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
/// The resulting vec will be length 0 or 1.
pub fn process_data_query_prop(
    component_idx: ComponentIdx,
    prop_specifier: PropSpecifier,
    _prop_pointer: PropPointer,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
) -> Vec<(GraphNode, GraphNode)> {
    let local_prop_idx = match prop_specifier {
        PropSpecifier::LocalIdx(local_prop_idx) => Some(local_prop_idx),
        PropSpecifier::Matching(match_profiles) => document_structure
            .get_component_prop_by_profile(component_idx, &match_profiles)
            .map(|prop_pointer| prop_pointer.local_prop_idx),
    };

    if let Some(local_prop_idx) = local_prop_idx {
        let target_prop_node = PropPointer {
            component_idx,
            local_prop_idx,
        }
        .into_prop_node(document_structure);
        vec![(query_node, target_prop_node)]
    } else {
        vec![]
    }
}

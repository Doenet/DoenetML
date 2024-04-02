use crate::{
    components::types::PropPointer,
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::{PropComponent, PropSpecifier},
};

/// Process a `DataQuery::Prop`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
pub fn process_data_query_prop(
    component: PropComponent,
    prop_specifier: PropSpecifier,
    prop_pointer: PropPointer,
    prop_node: GraphNode,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
) -> Vec<(GraphNode, GraphNode)> {
    let mut ret = Vec::new();

    let component_idx = match component {
        PropComponent::Me => prop_pointer.component_idx,
        PropComponent::Parent => document_structure
            .get_true_component_parent(prop_pointer.component_idx)
            .expect("Component asks for parent but there is none."),
        PropComponent::ByIdx(component_idx) => component_idx,
    };

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
        assert_ne!(
            prop_node, target_prop_node,
            "Self-loop detected; DataQuery requested a prop that is the same as the origin prop."
        );
        ret.push((query_node, target_prop_node));
    }

    ret
}

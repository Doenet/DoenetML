use crate::{
    components::types::{ComponentIdx, PropPointer},
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::PropProfile,
};

/// Process a `DataQuery::ChildPropProfile`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
pub fn process_data_query_child_prop_profile(
    match_profiles: Vec<PropProfile>,
    prop_pointer: PropPointer,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
) -> Vec<(GraphNode, GraphNode)> {
    let mut ret = Vec::new();

    for node in document_structure.get_component_content_children(prop_pointer.component_idx) {
        match node {
            GraphNode::Component(_) => {
                // Check the component. We want to link to the first prop that matches one of the profiles.
                let matching_prop = document_structure
                    .get_component_prop_by_profile(ComponentIdx::from(node), &match_profiles)
                    .map(|prop_pointer| prop_pointer.into_prop_node(document_structure));

                if let Some(matching_prop) = matching_prop {
                    ret.push((query_node, matching_prop));
                }
            }
            GraphNode::String(_) => {
                if match_profiles.contains(&PropProfile::String)
                    || match_profiles.contains(&PropProfile::LiteralString)
                {
                    ret.push((query_node, node));
                }
            }
            GraphNode::Prop(_) => {
                let prop = document_structure.get_prop_definition(node);

                let profile = prop.meta.profile;
                if profile.is_some() && match_profiles.contains(&profile.unwrap()) {
                    ret.push((query_node, node));
                }
            }
            GraphNode::State(_) | GraphNode::Virtual(_) | GraphNode::Query(_) => {
                unreachable!("Cannot have GraphNode of type {:?} as a content child of a component's children.", node);
            }
        }
    }

    ret
}

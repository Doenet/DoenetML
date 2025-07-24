use crate::{
    components::{
        ComponentNode,
        types::{AttributeName, ComponentIdx, PropPointer},
    },
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::PropProfile,
};

/// Process a `DataQuery::Attribute`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
pub fn process_data_query_attribute(
    attribute_name: AttributeName,
    match_profiles: Vec<PropProfile>,
    prop_pointer: PropPointer,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
) -> Vec<(GraphNode, GraphNode)> {
    let mut ret = Vec::new();

    // Find the requested attribute.
    let attr_node = document_structure
        .get_attr_node(prop_pointer.component_idx, attribute_name)
        .unwrap_or_else(|| {
            panic!(
                "Cannot find attribute `{}` on component `{}`",
                attribute_name,
                document_structure
                    .get_component(prop_pointer.component_idx)
                    .get_component_type()
            )
        });

    for node in document_structure.get_attribute_content_children(attr_node) {
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
            GraphNode::State(_)
            | GraphNode::Query(_)
            | GraphNode::Prop(_)
            | GraphNode::Virtual(_) => {
                unreachable!(
                    "Cannot have GraphNode of type {:?} as a direct child of an attribute.",
                    node
                );
            }
        }
    }

    ret
}

use crate::{
    components::types::ComponentIdx, core::document_structure::DocumentStructure,
    graph_node::GraphNode, props::PropProfile,
};

/// Picks a prop from the content node `node` that matches one of the passed in profiles.
pub fn pick_prop(
    node: GraphNode,
    match_profiles: &[PropProfile],
    document_structure: &DocumentStructure,
) -> Option<GraphNode> {
    match node {
        GraphNode::Component(_) => {
            // Check the component. We want to link to the first prop that matches one of the profiles.
            let matching_prop = document_structure
                .get_component_prop_by_profile(ComponentIdx::from(node), match_profiles)
                .map(|prop_pointer| prop_pointer.into_prop_node(document_structure));

            if let Some(matching_prop) = matching_prop {
                return Some(matching_prop);
            }
        }
        GraphNode::String(_) => {
            if match_profiles.contains(&PropProfile::String)
                || match_profiles.contains(&PropProfile::LiteralString)
            {
                return Some(node);
            }
        }
        GraphNode::Prop(_) => {
            let prop = document_structure.get_prop_definition(node);

            let profile = prop.meta.profile;
            if profile.is_some() && match_profiles.contains(&profile.unwrap()) {
                return Some(node);
            }

            let profile = prop.profile_from_prop_value_type();
            if profile.is_some() && match_profiles.contains(&profile.unwrap()) {
                return Some(node);
            }
        }
        GraphNode::State(_) | GraphNode::Virtual(_) | GraphNode::Query(_) => {
            unreachable!(
                "Cannot process a GraphNode of type {:?} when picking a prop.",
                node
            );
        }
    }

    None
}

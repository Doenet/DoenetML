use std::iter;

use crate::{
    components::types::ComponentIdx, core::document_structure::DocumentStructure,
    graph_node::GraphNode, props::PropProfile, DocumentModel,
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

/// For each node in `nodes`, picks props that match the profiles of `match_profiles_list`,
/// where the number of props picked per node is determined by the length of `match_profiles_list`.
/// If `limit_to_first_match` is true, props are picked only from the first node with a match;
/// otherwise props are picked from all nodes that match.
/// Returns a vector of the edges needed to go from `query_node` to the props.
///
/// If more then one prop is being picked per node, then virtual nodes will be created and added to dependency graph.
/// One virtual node will be added to represent each node from `nodes` with matching props.
/// If a subset of the props are matched for a given node, virtual nodes will be added as placeholders for missing props.
pub fn process_pick_prop<N>(
    nodes: N,
    match_profiles_list: Vec<Vec<PropProfile>>,
    limit_to_first_match: bool,
    query_node: GraphNode,
    document_structure: &DocumentStructure,
    document_model: &DocumentModel,
) -> Vec<(GraphNode, GraphNode)>
where
    N: Iterator<Item = GraphNode>,
{
    if match_profiles_list.len() == 1 {
        // We have the simpler case where we are looking for just one prop per node.
        // The prop will be picked if it matches any of the `PropProfile`s in `match_profiles_list[0]`.
        let mut potential_edges = nodes
            .flat_map(|node| pick_prop(node, &match_profiles_list[0], document_structure))
            .map(|node| (query_node, node));

        if limit_to_first_match {
            match potential_edges.next() {
                Some(edge) => vec![edge],
                None => vec![],
            }
        } else {
            potential_edges.collect()
        }
    } else {
        // We are looking for more than one prop per node.
        // Each subvector of `match_profiles_list` will pick a prop if it matches any of its `PropProfile`s.

        // Note: is important to leave `potential_edge_combinations` as a lazy iterator and not to collect it,
        // as we don't want to create the virtual nodes unless we are actually using those edges.
        let mut potential_edge_combinations = nodes.filter_map(|node| {
            let prop_matches = match_profiles_list
                .iter()
                .map(move |match_profiles| pick_prop(node, match_profiles, document_structure));

            if prop_matches.clone().any(|v| v.is_some()) {
                // Since at least one of the profiles found a match for `node`,
                // we create a virtual node to organize all the props that were found for `node`.
                // This virtual node will be connected to each of the props picked for `node`
                // (or to a placeholder virtual node if a particular prop was not found)
                let virtual_node = document_model.add_virtual_node(query_node);
                let edges = iter::once((query_node, virtual_node));

                let edges = edges.chain(
                    prop_matches
                        .map(|v| match v {
                            // the prop was found, so we'll connect to its node
                            Some(g) => g,
                            // the prop was not found, so we create a virtual node as a placeholder
                            None => document_model.add_virtual_node(query_node),
                        })
                        .map(move |g| (virtual_node, g)),
                );
                Some(edges)
            } else {
                None
            }
        });

        if limit_to_first_match {
            match potential_edge_combinations.next() {
                Some(edges) => edges.collect(),
                None => vec![],
            }
        } else {
            potential_edge_combinations.flatten().collect()
        }
    }
}

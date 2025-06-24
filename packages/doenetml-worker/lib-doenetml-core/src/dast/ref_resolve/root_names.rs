//! For each node, calculate the shortest name by which the node can be referenced
//! with the root as the origin.
//!

use std::{collections::HashMap, iter};

use serde::{Deserialize, Serialize};

use crate::dast::flat_dast::Index;

use super::{ResolutionAlgorithm, Resolver};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum SingleResolveHop {
    Name(String),
    Index(usize),
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum NodeOrRoot {
    Root,
    Node(Index),
}

type ReachableSingleHop = HashMap<SingleResolveHop, Vec<NodeOrRoot>>;
type ReachableNames = Vec<Option<Vec<String>>>;

/// Given the data from `resolver`, calculate the root name for each node,
/// i.e., the shortest name by which the node can be references from the origin of the root.
///
/// Returns a vector indexed by the node index with entries
/// - `None`: if the node does not have a uniquely accessible name from the root
/// - `Some(name)`: where `name` is the shortest unique name for accessing the node from the root.
///   `name` is a string where `.` separates subnames and `|` separates indices.
///   For example, if a node that is references via the second index from `a.b`, then
///   `name` would be `a.b|3`.
pub fn calculate_root_names(resolver: Resolver) -> Vec<Option<String>> {
    // resolver's data has one more entry than number of nodes as it also contains the root
    let n_nodes = resolver.node_resolver_data.len() - 1;

    let mut reachable_via_single_hop: Vec<ReachableSingleHop> = iter::repeat_with(HashMap::new)
        .take(n_nodes)
        .collect::<Vec<_>>();

    for (node_idx_plus_1, node_data) in resolver.node_resolver_data.iter().enumerate() {
        let node_reached = if node_idx_plus_1 == 0 {
            NodeOrRoot::Root
        } else {
            NodeOrRoot::Node(node_idx_plus_1 - 1)
        };
        match node_data.resolution_algorithm {
            ResolutionAlgorithm::SearchChildren => {
                for (name, ref_) in node_data.name_map.iter() {
                    match ref_ {
                        super::Ref::Unique(idx) => {
                            let hop_map = reachable_via_single_hop.get_mut(*idx).unwrap();
                            hop_map
                                .entry(SingleResolveHop::Name(name.to_string()))
                                .and_modify(|nodes| nodes.push(node_reached))
                                .or_insert(vec![node_reached]);
                        }
                        super::Ref::Ambiguous(_) => {}
                    }
                }
            }
            ResolutionAlgorithm::DontSearchChildren | ResolutionAlgorithm::Unsearchable => {}
        }

        for (index, resolution) in node_data.index_resolutions.iter().enumerate() {
            if let Some(res_idx) = resolution {
                let hop_map = reachable_via_single_hop.get_mut(*res_idx).unwrap();
                hop_map
                    .entry(SingleResolveHop::Index(index))
                    .and_modify(|nodes| nodes.push(node_reached))
                    .or_insert(vec![node_reached]);
            }
        }
    }

    let mut reachable_names: ReachableNames = iter::repeat_n(None, n_nodes).collect::<Vec<_>>();

    for idx in 0..n_nodes {
        reachable_names =
            concatenate_reachable_names(idx, reachable_names, &reachable_via_single_hop);
    }

    let root_names = reachable_names
        .into_iter()
        .map(|possible_names| {
            possible_names.unwrap().into_iter().reduce(|acc, name| {
                if name.len() < acc.len() {
                    name
                } else {
                    acc
                }
            })
        })
        .collect::<Vec<_>>();

    root_names
}

// Given that `reachable_single_hop`
fn concatenate_reachable_names(
    node_idx: usize,
    mut reachable_names: ReachableNames,
    reachable_single_hop: &[ReachableSingleHop],
) -> ReachableNames {
    if reachable_names[node_idx].is_some() {
        return reachable_names;
    }

    let mut names = Vec::new();

    for (hop, destinations) in reachable_single_hop[node_idx].iter() {
        let new_suffix = match hop {
            SingleResolveHop::Name(name) => format!(".{}", name),
            SingleResolveHop::Index(idx) => format!("|{}", idx + 1),
        };

        for dest in destinations.iter() {
            match dest {
                NodeOrRoot::Root => match hop {
                    SingleResolveHop::Index(_) => unreachable!("The root cannot have an index"),
                    SingleResolveHop::Name(name) => names.push(name.to_string()),
                },
                NodeOrRoot::Node(dest_idx) => {
                    reachable_names = concatenate_reachable_names(
                        *dest_idx,
                        reachable_names,
                        reachable_single_hop,
                    );

                    // Since we called `concatenate_reachable_names` on `dest_idx`, we can safely unwrap the option
                    for reachable_name in reachable_names[*dest_idx].as_deref().unwrap().iter() {
                        names.push(format!("{}{}", reachable_name, new_suffix));
                    }
                }
            }
        }
    }

    reachable_names[node_idx] = Some(names);

    reachable_names
}

#[cfg(test)]
#[path = "root_names.test.rs"]
mod test;

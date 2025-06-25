//! For each node, calculate the shortest name by which the node can be referenced
//! with the root as the origin. Since the names are designed to be HTML ids,
//! use `:` (rather than `[]`) to join index resolutions to create the names.

use std::iter;

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;

use crate::dast::flat_dast::Index;

use super::{Ref, ResolutionAlgorithm, Resolver};

/// A description of the name or index resolved leading to a given node being the referent.
///
/// See [`ReachableSingleHop`] for context and an example.
// #[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
// pub enum SingleResolveHop {
//     /// Resolving the name given by the `String` will reach the node in question
//     Name(String),
//     /// Resolving the index given by the `usize` will reach the node in question
//     Index(usize),
// }

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub enum NodeOrRoot {
    Root,
    Node(Index),
}

#[derive(Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct ResolutionViaName {
    name: String,
    origins: Vec<NodeOrRoot>,
}

#[derive(Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct ResolutionViaIndex {
    index: usize,
    origin: NodeOrRoot,
}

/// A description of how the resolution of a single name or a single index starting an origin
/// could result in a given node being the referent.
///
/// For example, consider the DoenetML.
/// ```xml
/// <a name="y"><group><b /><c name="x" /></group></a>
/// <d name="x" />
/// ```
/// Since `<c>` can reached by either a name or an index resolution, `ResolutionsToNode` for node `<c>` would have the fields
/// - `by_name`: `ResolutionViaName { name: "x", origins }`,
///   where `origins` is the vector of the indices of the nodes `<b>` and `<group>`.
///   For both of those origins, resolving the name `"x"` would result in the unique referent of `<c>`.
/// - `by_index`: `ResolutionViaIndex { index: 2, origin }`,
///   where `origin` is the index of the node `<group>`.
///   This value arises from the fact that  `<group>` takes index resolutions and `<c>` is the referent of the second index.
///
/// For node `<a>`, only the field `by_name` exists, with `name` being `"y"` and `origins` containing the root (`NodeOrRoot::Root`).
///
/// For node `<d>`, `ResolutionsToNode` would contain no entries, as `<d>` cannot be uniquely resolved from anywhere.
#[derive(Default, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct ResolutionsToNode {
    by_name: Option<ResolutionViaName>,
    by_index: Option<ResolutionViaIndex>,
}

/// A list of the names that given node is reachable when the origin is the root.
///
/// Since the names are designed to be valid HTML ids, they use non-standard notation for indices,
/// where `[3]` is replaced with `:3`.
///
/// A name of the form `x.y:3.c` indicates that the reference `$x.y[3].c` with the origin of root would uniquely resolve to the node.
type NamesReachableFromRoot = Vec<String>;

/// Given the data from `resolver`, calculate the root name for each node,
/// i.e., the shortest (fewest number of characters) name by which the node can be referenced when origin is the root.
///
/// Since the names are designed to be valid HTML ids, they use non-standard notation for indices,
/// where `[3]` is replaced with `:3`.
///
/// Returns a vector indexed by the node index. The vector entries entries are:
/// - `None`: if the node does not have a uniquely accessible name from the root
/// - `Some(name)`: where `name` is the shortest unique name for accessing the node from the root.
///   For example, if a node's shortest reference is`$a.b[3][4].c`, then `name` would be `a.b:3:4.c`.
///
/// For example, consider the DoenetML.
/// ```xml
/// <a name="y"><group name="grp"><b /><c name="x" /></group></a>
/// <d name="x" />
/// ```
/// The results for different nodes would be
/// - `<a>`: `Some("x")`, as `<a>` is directly resolvable from the root as `$x`
/// - `<b>`: `Some("grp:1")`, as `$grp[1]` is the only reference from root that resolves to `<b/>`
/// - `<c>`: `Some("x.y")`, as `"x.y"` is shorter (has fewer characters) than `grp:2`
/// - `<d>`: `None`, as `<d>` does not have a unique reference from the root
pub fn calculate_root_names(resolver: Resolver) -> Vec<Option<String>> {
    // Note: resolver's data has one more entry than number of nodes as it also contains the root
    let n_nodes = resolver.node_resolver_data.len() - 1;

    // First, calculate for each node, origins from which it can be resolve a a single names or index
    let mut resolutions_to_node: Vec<ResolutionsToNode> =
        iter::repeat_with(ResolutionsToNode::default)
            .take(n_nodes)
            .collect::<Vec<_>>();

    for (node_idx_plus_1, node_data) in resolver.node_resolver_data.iter().enumerate() {
        let origin = if node_idx_plus_1 == 0 {
            NodeOrRoot::Root
        } else {
            NodeOrRoot::Node(node_idx_plus_1 - 1)
        };
        match node_data.resolution_algorithm {
            ResolutionAlgorithm::SearchChildren => {
                for (name, ref_) in node_data.name_map.iter() {
                    match ref_ {
                        Ref::Unique(res_idx) => {
                            // record the fact that `res_idx` is the resolution for a reference to `name` starting at `origin`.
                            let resolutions = resolutions_to_node.get_mut(*res_idx).unwrap();
                            let name_resolution =
                                resolutions.by_name.get_or_insert(ResolutionViaName {
                                    name: name.to_string(),
                                    origins: Vec::new(),
                                });

                            if name_resolution.name != *name {
                                panic!("Inconsistent resolver data as node can be reached by two different names");
                            }

                            name_resolution.origins.push(origin);
                        }
                        Ref::Ambiguous(_) => {}
                    }
                }
            }
            ResolutionAlgorithm::DontSearchChildren | ResolutionAlgorithm::Unsearchable => {}
        }

        for (index, resolution) in node_data.index_resolutions.iter().enumerate() {
            if let Some(res_idx) = resolution {
                // record the fact that `res_idx` is the resolution for a reference to `index` starting at `origin`.
                let resolutions = resolutions_to_node.get_mut(*res_idx).unwrap();

                if resolutions.by_index.is_some() {
                    panic!("Inconsistent resolver data as node can be reached by two different indices");
                }

                resolutions.by_index = Some(ResolutionViaIndex { index, origin });
            }
        }
    }

    // By concatenating all the series of resolutions from which one can get to each node starting a the root,
    // compile a list of all names by which a node can be referenced from the root.
    // When complete all entries will contain a list `NamesReachableFromRoot`
    let mut reachable_names: Vec<Option<NamesReachableFromRoot>> =
        iter::repeat_n(None, n_nodes).collect::<Vec<_>>();
    for idx in 0..n_nodes {
        reachable_names = concatenate_reachable_names(idx, reachable_names, &resolutions_to_node);
    }

    reachable_names
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
        .collect::<Vec<_>>()
}

// Given that `resolutions_to_node` gives all the resolutions of single names and indices,
// concatenate all the combinations of name and index resolutions that form a path from the root to `node_idx`.
// If `reachable_names` has any entries where the reachable names have already been computed,
// use those to shortcut the algorithm
fn concatenate_reachable_names(
    node_idx: usize,
    mut reachable_names: Vec<Option<NamesReachableFromRoot>>,
    resolutions_to_node: &[ResolutionsToNode],
) -> Vec<Option<NamesReachableFromRoot>> {
    // if `reachable_names` for `node_idx` has already been computed in the course of a previous calculation,
    // there is nothing to do.
    if reachable_names[node_idx].is_some() {
        return reachable_names;
    }

    let mut names = Vec::new();

    let resolutions = &resolutions_to_node[node_idx];

    if let Some(ResolutionViaName { name, origins }) = &resolutions.by_name {
        // Since `node_idx` can be reached via `name` from `origins`,
        // determine how one can reach each origin from root and concatenate `name` with the result
        for origin in origins.iter() {
            match origin {
                // node can be directly reached from root via `name`
                NodeOrRoot::Root => names.push(name.to_string()),
                // since `origin` is not the root, we need to recurse
                NodeOrRoot::Node(dest_idx) => {
                    reachable_names = concatenate_reachable_names(
                        *dest_idx,
                        reachable_names,
                        resolutions_to_node,
                    );

                    // Since we called `concatenate_reachable_names` on `dest_idx`, we can safely unwrap the option
                    // and concatenate the result with `name`, joining with a `.`.
                    for reachable_name in reachable_names[*dest_idx].as_deref().unwrap().iter() {
                        names.push(format!("{}.{}", reachable_name, name));
                    }
                }
            }
        }
    }

    if let Some(ResolutionViaIndex { index, origin }) = resolutions.by_index {
        // Since `node_idx` can be reach via `index` from `origin`,
        // determine how one can each `origin` from root and concatenate `index` with the result
        match origin {
            NodeOrRoot::Root => unreachable!("The root cannot have an index resolution"),
            NodeOrRoot::Node(dest_idx) => {
                // since `origin` is not the root, we need to recurse
                reachable_names =
                    concatenate_reachable_names(dest_idx, reachable_names, resolutions_to_node);

                // Since we called `concatenate_reachable_names` on `dest_idx`, we can safely unwrap the option
                // and concatenate the result with `index`, joining with a `:`.
                for reachable_name in reachable_names[dest_idx].as_deref().unwrap().iter() {
                    names.push(format!("{}:{}", reachable_name, index + 1));
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

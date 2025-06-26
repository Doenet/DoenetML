use std::{collections::HashMap, iter};

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;

use crate::dast::flat_dast::{FlatNode, FlatPathPart, Index, UntaggedContent};

use super::ResolutionError;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct RefResolution {
    /// The final index of the node reached when resolving
    pub node_idx: Index,
    /// The indices of all nodes involved in resolving
    pub nodes_in_resolved_path: Vec<Index>,
    /// The path after `node_idx` that remains unresolved
    pub unresolved_path: Option<Vec<FlatPathPart>>,
    /// The original path that was resolved with origin `nodes_in_resolved_path[0]`
    pub original_path: Vec<FlatPathPart>,
}

/// Status of a pointer referring to children of an element.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub(super) enum Ref {
    Unique(Index),
    Ambiguous(Vec<Index>),
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub(super) enum ResolutionAlgorithm {
    SearchChildren,
    DontSearchChildren,
    Unsearchable,
}

const DONT_SEARCH_CHILDREN: [&str; 3] = ["option", "case", "repeat"];

impl ResolutionAlgorithm {
    fn lookup_by_name(name: &str) -> Self {
        if DONT_SEARCH_CHILDREN.contains(&name) {
            ResolutionAlgorithm::DontSearchChildren
        } else {
            ResolutionAlgorithm::SearchChildren
        }
    }

    pub(super) fn lookup_by_flat_node(node: &FlatNode) -> Self {
        if let FlatNode::Element(element) = node {
            Self::lookup_by_name(element.name.as_str())
        } else {
            ResolutionAlgorithm::Unsearchable
        }
    }
}

/// The possibilities for the parent of a node in the resolver
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub enum NodeParent {
    None,
    FlatRoot,
    Node(Index),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct NodeResolverData {
    /// The parent of the node. Options are:
    /// - `NodeParent:None` corresponds to no parent
    /// - `NodeParent:FlatRoot` corresponds to the parent being the flat root (which isn't a node)
    /// - `NodeParent:Node(i)` corresponds to the parent being node `i`.
    pub(super) node_parent: NodeParent,
    pub(super) resolution_algorithm: ResolutionAlgorithm,
    /// Map of all the names that are accessible (as descendants) from the node
    pub(super) name_map: HashMap<String, Ref>,
    /// Map of resolutions of indices that follow a match to the node.
    /// If `index_resolutions[i] = Some(j)` and the reference `$node_reference` matches the node,
    /// then the reference `$node_reference[i+1]` resolves to node `k`
    /// (as references are indexed starting from `1`).
    /// Note: `index_resolutions[i] = None` indicates that `$node_reference[i+1]` would resolve to a text node,
    /// which is not a valid ref resolution.
    pub(super) index_resolutions: Vec<Option<Index>>,
}

/// A `Resolver` is used to lookup elements by path/name. It constructs a search index
/// upon construction. If the underlying `FlatRoot` changes, a new `Resolver` should be
/// recreated.
#[derive(Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct Resolver {
    /// List of the node resolver data for a node at a given index shifted by `1`
    /// so that `node_resolver_data[i+1]` gives the data for node `i`
    /// and `node_resolver_data[0]` gives that data for the flat root (which isn't a node)
    pub(super) node_resolver_data: Vec<NodeResolverData>,
}

impl Resolver {
    /// Search for a node specified by `path` starting from `origin`. This algorithm searches first
    /// for the nearest parent that has a descendent with `path[0].name` as its name. Then it tries
    /// to match as much of `path[1..]` as possible. A match is returned along with any unmatched
    /// path parts.
    ///
    /// For example, consider
    /// ```xml
    /// <a name="x">
    ///     <b name="y">
    ///         <c name="z" />
    ///     </b>
    /// </a>
    /// <d name="y" />
    /// ```
    /// - Matching `x` from anywhere returns the index of `<a />`.
    /// - Matching `y` from `<c />` returns the index of `<b />`.
    /// - Matching `y` from `<d />` returns an error because there are multiple `y`s accessible from that position.
    /// - Matching `y.z.w` from `<b />` returns the index of `<c />` along with `.w` as the unresolved path.
    ///
    /// If an index appears in the path (e.g. `a[2].b`), the search stops and the remaining path is returned.
    /// If there was a partial match of the indexed item, the unresolved path will list `name` as an empty string.
    /// E.g., matching `y.w[2]` from `<b />` returns the index of `<d />` along with `.w[2]` as the unresolved path
    /// and matching `y[2]` from `<b />` returns the index of `<d />` along with `.[2]` as the unresolved path.
    ///
    /// If `skip_parent_search` is `true`, then modify the algorithm to only match children of `origin`.
    /// The result is equivalent to the full algorithm where the first part of the path matched `origin`,
    /// and the remaining path is `path`.
    pub fn resolve<T: AsRef<[FlatPathPart]>>(
        &self,
        path: T,
        origin: Index,
        skip_parent_search: bool,
    ) -> Result<RefResolution, ResolutionError> {
        // If `origin` passed in is not a node in the resolver, then return no referent
        if origin + 1 >= self.node_resolver_data.len() {
            return Err(ResolutionError::NoReferent);
        }

        let path = path.as_ref();
        let mut current_idx = origin;
        let original_path = path.to_vec();

        let mut path = path.iter();

        // A list of all the nodes involved in resolving
        let mut nodes_in_resolved_path = vec![origin];

        // Note: `remaining_path` is declared outside the following `if` statement
        // as it needs to live as long as the `path` iterator does.
        let remaining_path: Vec<FlatPathPart>;

        if !skip_parent_search {
            let first_path_part = path.next().ok_or(ResolutionError::NoReferent)?;
            current_idx = self.search_parents(&first_path_part.name, current_idx)?;
            if current_idx != origin {
                nodes_in_resolved_path.push(current_idx);
            }
            // If we made it here, the first entry in `path` has a valid referent.
            // If this entry also has an index, we add the index back to the beginning of the path
            // so that it will be address first, below. This would
            // happen if the reference was something like `$a[2].b`.
            if !first_path_part.index.is_empty() {
                // In order to create a new iterator that is the same type as the original `path` iterator,
                // we first create a new vector, then create a path iterator from it.
                remaining_path = iter::once(FlatPathPart {
                    name: "".into(),
                    index: first_path_part.index.clone(),
                    position: first_path_part.position.clone(),
                })
                .chain(path.cloned())
                .collect();

                path = remaining_path.iter();
            }
        }

        let mut node_data = &self.node_resolver_data[current_idx + 1];

        while let Some(part) = path.next() {
            if !part.name.is_empty() {
                let mut matched_part_name = false;

                if node_data.resolution_algorithm == ResolutionAlgorithm::SearchChildren {
                    // current_idx specifies the "root" of the search. We try to resolve
                    // children based on the path part, returning an error if there is an ambiguity.
                    if let Some(referent) = node_data.name_map.get(&part.name) {
                        matched_part_name = true;
                        match referent {
                            Ref::Unique(idx) => {
                                current_idx = *idx;
                                if !nodes_in_resolved_path.contains(&current_idx) {
                                    nodes_in_resolved_path.push(current_idx);
                                }
                                node_data = &self.node_resolver_data[current_idx + 1];
                            }
                            Ref::Ambiguous(_) => {
                                return Err(ResolutionError::NonUniqueReferent);
                            }
                        }
                    }
                }

                if !matched_part_name {
                    // If we cannot find an appropriate child, the remaining path parts might be
                    // prop references. Return them and consider `current_idx` the match.
                    // This also handles the case where we don't search children.
                    let remaining_path: Vec<FlatPathPart> =
                        iter::once(part.clone()).chain(path.cloned()).collect();
                    return Ok(RefResolution {
                        node_idx: current_idx,
                        unresolved_path: Some(remaining_path),
                        original_path,
                        nodes_in_resolved_path,
                    });
                }
            }

            for (index_idx, index) in part.index.iter().enumerate() {
                if index.value.len() == 1 {
                    match &index.value[0] {
                        UntaggedContent::Text(index_str) => match index_str.parse::<usize>() {
                            Ok(index_num) => {
                                if index_num == 0 {
                                    // path indices begin at `1``, so we cannot match a `0`
                                    return Err(ResolutionError::NoReferent);
                                }

                                if let Some(node_match) =
                                    node_data.index_resolutions.get(index_num - 1)
                                {
                                    match node_match {
                                        Some(new_node_idx) => {
                                            current_idx = *new_node_idx;
                                            if !nodes_in_resolved_path.contains(&current_idx) {
                                                nodes_in_resolved_path.push(current_idx);
                                            }
                                            node_data = &self.node_resolver_data[current_idx + 1];

                                            // since we found a match, we continue to the next index, if it exists
                                            continue;
                                        }
                                        None => {
                                            // A value of `None` corresponds to an index matching a text node, which we cannot reference
                                            // We add the remaining path as an unresolved path
                                            // with name `"__invalid_index"` to make sure it won't resolve to anything.
                                            // Note: we don't return `NoReferent`, as it is possible the index resolutions
                                            // will later change so that this reference will begin to have a referent

                                            let remaining_path: Vec<FlatPathPart> =
                                                iter::once(FlatPathPart {
                                                    name: "__invalid_index".into(),
                                                    index: part
                                                        .index
                                                        .iter()
                                                        .skip(index_idx)
                                                        .cloned()
                                                        .collect(),
                                                    position: part.position.clone(),
                                                })
                                                .chain(path.cloned())
                                                .collect();

                                            return Ok(RefResolution {
                                                node_idx: current_idx,
                                                unresolved_path: Some(remaining_path),
                                                original_path,
                                                nodes_in_resolved_path,
                                            });
                                        }
                                    }
                                }
                            }
                            Err(_) => {
                                // the string index did not correspond to non-negative integer
                                return Err(ResolutionError::NoReferent);
                            }
                        },
                        UntaggedContent::Ref(_) => {
                            // if the index is a reference to another component,
                            // then we need information that is not in the resolver to continue,
                        }
                    }
                }

                // If we make it here, then either
                // - `index.value` was not a single text node, or
                // - `index.value` did correspond to a valid index, but it wasn't in `self.index_resolutions` for the current node
                // We need information that is not in the resolver to continue, so we return the remaining path as unresolved.
                let remaining_path: Vec<FlatPathPart> = iter::once(FlatPathPart {
                    name: "".into(),
                    index: part.index.iter().skip(index_idx).cloned().collect(),
                    position: part.position.clone(),
                })
                .chain(path.cloned())
                .collect();

                return Ok(RefResolution {
                    node_idx: current_idx,
                    unresolved_path: Some(remaining_path),
                    original_path,
                    nodes_in_resolved_path,
                });
            }
        }

        // We've fully resolved and there are no remaining path parts.
        Ok(RefResolution {
            node_idx: current_idx,
            unresolved_path: None,
            original_path,
            nodes_in_resolved_path,
        })
    }

    /// Search up the chain of parents to find the first node that has `name` accessible.
    /// Return the referent of `name`.
    pub(super) fn search_parents(
        &self,
        name: &str,
        origin: usize,
    ) -> Result<Index, ResolutionError> {
        let mut node_data = &self.node_resolver_data[origin + 1];

        // if passed in a node without a parent, then search from that node itself
        // TODO: don't duplicate code with case where have parent, below
        if matches!(node_data.node_parent, NodeParent::None) {
            if let Some(resolved) = node_data.name_map.get(name) {
                match resolved {
                    Ref::Unique(idx) => {
                        return Ok(*idx);
                    }
                    Ref::Ambiguous(_) => {
                        return Err(ResolutionError::NonUniqueReferent);
                    }
                }
            }

            return Err(ResolutionError::NoReferent);
        }

        loop {
            let parent_plus_1 = match node_data.node_parent {
                NodeParent::None => break,
                NodeParent::FlatRoot => 0,
                NodeParent::Node(idx) => idx + 1,
            };

            if let Some(resolved) = self.node_resolver_data[parent_plus_1].name_map.get(name) {
                match resolved {
                    Ref::Unique(idx) => {
                        return Ok(*idx);
                    }
                    Ref::Ambiguous(_) => {
                        return Err(ResolutionError::NonUniqueReferent);
                    }
                }
            }
            node_data = &self.node_resolver_data[parent_plus_1];
        }
        Err(ResolutionError::NoReferent)
    }
}

#[cfg(test)]
#[path = "resolve.test.rs"]
mod test;

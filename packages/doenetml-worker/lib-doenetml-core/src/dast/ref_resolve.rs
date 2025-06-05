//! Refs use a `path`, which consists of _names_ separated by dots (e.g. `a.b.c`), possibly followed by
//! prop names separated by dots (e.g. `a.b.c.x.y.z`). A `Resolver` searches for a matching node
//! from a given starting position. Because a `Resolver` does not know whether part of a path corresponds to a
//! name or prop name, the longest valid partial match is used and unmatched portions of a `path` are
//! preserved for future use.

use std::{collections::HashMap, iter, mem};

use crate::dast::flat_dast::{FlatNode, UntaggedContent};

use super::flat_dast::{
    FlatElement, FlatFragment, FlatPathPart, FlatRoot, FlatRootOrFragment, Index,
};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use tsify_next::Tsify;

#[derive(Clone, Debug, Serialize, Error, PartialEq, Copy)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
pub enum ResolutionError {
    #[error("No node identified by path")]
    NoReferent,
    #[error("Path referred to more than one node")]
    NonUniqueReferent,
}

/// Format an error message given that `err` was produced when trying to resolve `path`.
/// Since the resolve algorithm stops when any index is found,
/// this message includes the path up to any index.
///
/// For example, given this DoenetML
/// ```xml
/// <text name="t" /><text name="t" />
/// $a.b.c[1].d
/// $t.a[1].b
/// ```
/// the error messages for the two references will be
/// - `"No referent found for reference: $a.b.c"`, and
/// - `"Multiple references found for reference: $t.a`.
pub fn format_error_message(err: ResolutionError, path: &[FlatPathPart]) -> String {
    // Note: this message could potentially be improved by recording
    // the start and end location of the reference node
    // and using the entire DoenetML string that created the reference
    let mut paths_until_first_index = vec![];
    for path_part in path.iter() {
        if !path_part.name.is_empty() {
            paths_until_first_index.push(path_part.name.clone())
        }
        if !path_part.index.is_empty() {
            break;
        }
    }
    let paths_string = paths_until_first_index.join(".");

    match err {
        ResolutionError::NoReferent => {
            format!("No referent found for reference: ${}", paths_string)
        }
        ResolutionError::NonUniqueReferent => {
            format!("Multiple referents found for reference: ${}", paths_string)
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct RefResolution {
    pub node_idx: Index,
    pub unresolved_path: Option<Vec<FlatPathPart>>,
    pub original_path: Vec<FlatPathPart>,
}

/// Status of a pointer referring to children of an element.
#[derive(Debug, Serialize, Deserialize)]
enum Ref {
    Unique(Index),
    Ambiguous(Vec<Index>),
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
enum ResolutionAlgorithm {
    SearchChildren,
    DontSearchChildren,
    Unsearchable,
}

impl ResolutionAlgorithm {
    fn lookup_by_name(name: &str) -> Self {
        if DONT_SEARCH_CHILDREN.contains(&name) {
            ResolutionAlgorithm::DontSearchChildren
        } else {
            ResolutionAlgorithm::SearchChildren
        }
    }

    fn lookup_by_flat_node(node: &FlatNode) -> Self {
        if let FlatNode::Element(element) = node {
            Self::lookup_by_name(element.name.as_str())
        } else {
            ResolutionAlgorithm::Unsearchable
        }
    }
}

/// A `Resolver` is used to lookup elements by path/name. It constructs a search index
/// upon construction. If the underlying `FlatRoot` changes, a new `Resolver` should be
/// recreated.
#[derive(Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct Resolver {
    /// List of the parent of a node at a given index, except that all indices are shifted by `1`
    /// so that index `0` corresponds to the flat root (which isn't a node).
    /// I.e., the first entry corresponds to the flat root (which has no parent)
    /// and if the parent of node `i` is `j`, then `node_parent[i+1] = Some(j+1)`.
    node_parent: Vec<Option<Index>>,
    /// List of the resolution algorithm of a node at a given index shifted by `1`
    /// so that `resolution_algorithm[i+1]` gives the resolution algorithm of node `i`.
    resolution_algorithm: Vec<ResolutionAlgorithm>,
    /// Map of all the names that are accessible (as descendants) from a given node,
    /// where indices ae shifted by `1`.
    /// `name_map[0]` is a map of all names accessible from the `flat_root`
    /// and `name_map[i+1]` is a map of all names accessible from node `i`.
    name_map: Vec<HashMap<String, Ref>>,
}

const DONT_SEARCH_CHILDREN: [&str; 3] = ["option", "case", "repeat"];

impl Resolver {
    pub fn from_flat_root(flat_root: &FlatRoot) -> Self {
        Resolver {
            node_parent: iter::once(None)
                .chain(
                    flat_root
                        .nodes
                        .iter()
                        .map(|node| node.parent().map(|idx| idx + 1).or(Some(0))),
                )
                .collect(),
            resolution_algorithm: iter::once(ResolutionAlgorithm::SearchChildren)
                .chain(
                    flat_root
                        .nodes
                        .iter()
                        .map(ResolutionAlgorithm::lookup_by_flat_node),
                )
                .collect(),
            name_map: Self::build_name_map(&FlatRootOrFragment::Root(flat_root)),
        }
    }

    /// Add nodes of `flat_fragment` to the resolver.
    ///
    /// This is used when new descendants of `flat_fragment.parent_idx` are added
    /// due to expanding a composite component.
    ///
    /// For example, for this DoenetML, on the first pass of processing, `"p2"` does not have any children named `"t"`.
    /// This function allows you to manipulate the resolution tree so that added in children can be resolved by name,
    /// for example `"$p2.t"`.
    /// ```html
    /// <p name="p1"><text name="t">hi</text></p>
    /// <p name="p2" extend="$p1" />
    /// $p2.t
    /// ```
    ///
    /// Arguments:
    /// - `flat_fragment`: a `FlatFragment` containing the new descendants added to `flat_fragment.parent_idx`.
    pub fn add_nodes(&mut self, flat_fragment: &FlatFragment) {
        let prev_num_nodes = self.node_parent.len();
        let new_num_nodes = flat_fragment.len() + 1;

        let parent_idx = flat_fragment
            .parent_idx
            .expect("add_nodes should be called with a flat fragment that has a parent.");

        // add placeholders for missing nodes as well as new nodes to be added
        if new_num_nodes > prev_num_nodes {
            let padding = new_num_nodes - prev_num_nodes;
            self.node_parent.extend(iter::repeat_n(None, padding));
            self.resolution_algorithm
                .extend(iter::repeat_n(ResolutionAlgorithm::SearchChildren, padding));
            self.name_map
                .extend(iter::repeat_with(HashMap::new).take(padding));
        }

        // Add parents and stop_propagation for new nodes
        for node in flat_fragment.nodes.iter() {
            self.node_parent[node.idx() + 1] = node.parent().map(|idx| idx + 1);
            self.resolution_algorithm[node.idx() + 1] =
                ResolutionAlgorithm::lookup_by_flat_node(node);
        }

        // placeholder for missing nodes

        let mut subtree_name_map =
            Self::build_name_map(&FlatRootOrFragment::Fragment(flat_fragment));

        // We will add items to the resolver for parent only if the parent does not already have items with that name,
        // i.e., the resolver will continue to resolve to descendants of parent as before,
        // and now will fall back to new items if there wasn't already a ref resolution.
        let parent_map = &mut self.name_map[parent_idx + 1];
        let new_parent_map = mem::take(&mut subtree_name_map[parent_idx + 1]);

        for (key, ref_) in new_parent_map.into_iter() {
            parent_map.entry(key).or_insert(ref_);
        }

        // Add new items to `name_map`.
        // If a node was already in the `name_map`, its value is replaced.
        for node in flat_fragment.nodes.iter() {
            let names = mem::take(&mut subtree_name_map[node.idx() + 1]);
            for (key, ref_) in names.into_iter() {
                self.name_map[node.idx() + 1].insert(key, ref_);
            }
        }
    }

    /// Delete `nodes` from the resolver
    pub fn delete_nodes(&mut self, nodes: &[FlatNode]) {
        for (name, node_idx) in nodes.iter().filter_map(|node| {
            if let FlatNode::Element(element) = node {
                if let Some(name) = get_element_name(element) {
                    return Some((name, node.idx()));
                }
            }
            None
        }) {
            let mut prev_parent_idx_plus_1 = node_idx + 1;

            while let Some(parent_idx_plus_1) = self.node_parent[prev_parent_idx_plus_1] {
                prev_parent_idx_plus_1 = parent_idx_plus_1;

                let name_map = &mut self.name_map[parent_idx_plus_1];

                let references = name_map.remove(&name);

                match references {
                    Some(Ref::Unique(idx)) => {
                        // Note is is possible that `parent_idx` does not have an entry in the name map
                        // its descendant `node_idx`. This could happen if either
                        // 1. one of its descendants had a `DontSearchChildren` `ResolutionAlgorithm`, or
                        // 2. one of its descendants was added later by `add_nodes`.
                        // In this case, the unique index found might not match the deleted node `node_idx`,
                        // add we add the name back to the name map
                        if idx != node_idx {
                            name_map.insert(name.clone(), Ref::Unique(idx));
                        }
                    }
                    Some(Ref::Ambiguous(indices)) => {
                        // remove the deleted node `node_idx` from the ambiguous list, setting the result to unique if there is only one reference left
                        let new_indices = indices
                            .into_iter()
                            .filter(|idx| *idx != node_idx)
                            .collect::<Vec<_>>();
                        if new_indices.len() == 1 {
                            name_map.insert(name.clone(), Ref::Unique(new_indices[0]));
                        } else {
                            name_map.insert(name.clone(), Ref::Ambiguous(new_indices));
                        }
                    }
                    None => {}
                }
            }
        }

        // Now that we have finished recursing through parents of all nodes,
        // remove nodes from node_parent structure
        for node in nodes.iter() {
            if node.idx() + 1 < self.node_parent.len() {
                self.node_parent[node.idx() + 1] = None;
            }
        }
    }

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
        let path = path.as_ref();
        let mut current_idx = origin;
        let original_path = path.to_vec();

        let mut path = path.iter();

        if !skip_parent_search {
            let first_path_part = path.next().ok_or(ResolutionError::NoReferent)?;
            current_idx = self.search_parents(&first_path_part.name, current_idx)?;
            // If we made it here, the first entry in `path` has a valid referent.
            // If this entry also has an index, we need to stop searching. This would
            // happen if the reference was something like `$a[2].b`.
            if !first_path_part.index.is_empty() {
                let remaining_path: Vec<FlatPathPart> = iter::once(FlatPathPart {
                    name: "".into(),
                    index: first_path_part.index.clone(),
                    position: first_path_part.position.clone(),
                })
                .chain(path.cloned())
                .collect();
                return Ok(RefResolution {
                    node_idx: current_idx,
                    unresolved_path: Some(remaining_path),
                    original_path,
                });
            }
        }

        while let Some(part) = path.next() {
            let mut matched_part_name = false;

            if self.resolution_algorithm[current_idx + 1] == ResolutionAlgorithm::SearchChildren {
                // current_idx specifies the "root" of the search. We try to resolve
                // children based on the path part, returning an error if there is an ambiguity.
                if let Some(referent) = self.name_map[current_idx + 1].get(&part.name) {
                    matched_part_name = true;
                    match referent {
                        Ref::Unique(idx) => {
                            current_idx = *idx;
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
                });
            }

            // If there index specified, we immediately stop since component information is needed
            // to resolve all remaining path parts.
            if !part.index.is_empty() {
                let remaining_path: Vec<FlatPathPart> = iter::once(FlatPathPart {
                    name: "".into(),
                    index: part.index.clone(),
                    position: part.position.clone(),
                })
                .chain(path.cloned())
                .collect();
                return Ok(RefResolution {
                    node_idx: current_idx,
                    unresolved_path: Some(remaining_path),
                    original_path,
                });
            }
        }

        // We've fully resolved and there are no remaining path parts.
        Ok(RefResolution {
            node_idx: current_idx,
            unresolved_path: None,
            original_path,
        })
    }

    /// Search up the chain of parents to find the first node that has `name` accessible.
    /// Return the referent of `name`.
    fn search_parents(&self, name: &str, origin: usize) -> Result<Index, ResolutionError> {
        let mut current_idx_plus_1 = origin + 1;

        // if passed in a node without a parent, then search from that node itself
        // TODO: don't duplicate code with case where have parent, below
        if self.node_parent[current_idx_plus_1].is_none() {
            if let Some(resolved) = self.name_map[current_idx_plus_1].get(name) {
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

        while let Some(parent_plus_1) = self.node_parent[current_idx_plus_1] {
            if let Some(resolved) = self.name_map[parent_plus_1].get(name) {
                match resolved {
                    Ref::Unique(idx) => {
                        return Ok(*idx);
                    }
                    Ref::Ambiguous(_) => {
                        return Err(ResolutionError::NonUniqueReferent);
                    }
                }
            }
            current_idx_plus_1 = parent_plus_1;
        }
        Err(ResolutionError::NoReferent)
    }

    /// Build a map of all the names that are accessible from a given node
    /// and the indices of the referents.
    fn build_name_map(flat_root_or_fragment: &FlatRootOrFragment) -> Vec<HashMap<String, Ref>> {
        // Pre-populate with empty hashmaps for each element
        let mut descendant_names = iter::repeat_with(HashMap::new)
            .take(flat_root_or_fragment.len() + 1)
            .collect::<Vec<_>>();

        // If we were given a flat root, then include root itself (with index 0),
        // else, for a flat fragment, include the fragment parent, where add one to the index
        let base_parent_idx_plus_1 = match flat_root_or_fragment {
            FlatRootOrFragment::Root(_) => 0,
            FlatRootOrFragment::Fragment(flat_fragment) => {
                flat_fragment.parent_idx.expect(
                    "build_name_map should be called with a flat fragment that has a parent.",
                ) + 1
            }
        };

        for element in flat_root_or_fragment
            .nodes_iter()
            .filter_map(|node| match node {
                // Only elements can have names
                FlatNode::Element(element) => Some(element),
                _ => None,
            })
        {
            let name = get_element_name(element);
            if name.is_none() {
                continue;
            }
            let name = name.unwrap();

            // Iterate through all ancestors of element,
            // including the fragment parent, if it exists
            for parent_idx_plus_1 in flat_root_or_fragment
                .parent_iter(element.idx)
                .map(|parent| parent.idx + 1)
                .chain(iter::once(base_parent_idx_plus_1))
            {
                descendant_names[parent_idx_plus_1]
                    .get_mut(&name)
                    .map(|x| {
                        *x = match x {
                            // There is already something sharing the name `name` with the current element
                            // so we mark it as ambiguous
                            Ref::Unique(idx) => Ref::Ambiguous(vec![*idx, element.idx]),
                            Ref::Ambiguous(vec) => {
                                vec.push(element.idx);
                                Ref::Ambiguous(mem::take(vec))
                            }
                        };
                    })
                    .unwrap_or_else(|| {
                        // There is no current match for the name `name`, so we have a unique reference
                        descendant_names[parent_idx_plus_1]
                            .insert(name.clone(), Ref::Unique(element.idx));
                    });

                // Stop if we've reached a parent that isn't the base parent
                // and is a type where we don't search children
                if parent_idx_plus_1 != base_parent_idx_plus_1 && parent_idx_plus_1 > 0 {
                    match ResolutionAlgorithm::lookup_by_flat_node(
                        flat_root_or_fragment.get_node(parent_idx_plus_1 - 1),
                    ) {
                        ResolutionAlgorithm::SearchChildren => {}
                        ResolutionAlgorithm::DontSearchChildren => break,
                        ResolutionAlgorithm::Unsearchable => break,
                    }
                }
            }
        }

        descendant_names
    }

    /// Compactify the resolver so that it corresponds to the new indices
    /// of the compactified dast.
    pub fn compactify(&mut self, node_is_referenced: &[bool], old_to_new_indices: &[usize]) {
        // Note: the first entry, which corresponds to the flat_root, is always `None`
        let new_node_parent: Vec<Option<usize>> = iter::once(None)
            .chain(
                self.node_parent
                    .iter()
                    // Skip the flat_root: the enumerated indices will be actual node indices
                    .skip(1)
                    .enumerate()
                    .filter(|(idx, _parent)| node_is_referenced[*idx])
                    .map(|(_idx, parent)| {
                        parent.map(|par_idx_plus_1| {
                            if par_idx_plus_1 == 0 {
                                par_idx_plus_1
                            } else {
                                old_to_new_indices[par_idx_plus_1 - 1] + 1
                            }
                        })
                    }),
            )
            .collect();
        self.node_parent = new_node_parent;

        // Note: the first entry, which corresponds to the flat_root, is always `SearchChildren`
        let new_resolution_algorithm: Vec<ResolutionAlgorithm> =
            iter::once(ResolutionAlgorithm::SearchChildren)
                .chain(
                    self.resolution_algorithm
                        .iter()
                        // Skip the flat_root: the enumerated indices will be actual node indices
                        .skip(1)
                        .enumerate()
                        .filter(|(idx, _val)| node_is_referenced[*idx])
                        .map(|(_idx, val)| *val),
                )
                .collect();
        self.resolution_algorithm = new_resolution_algorithm;

        // For the name map, we do need to adjust the map from flat_root, which is the first entry.
        // In this case, we cannot skip it, so the enumerated indices will be node indices plus 1
        let new_name_map: Vec<HashMap<String, Ref>> = self
            .name_map
            .iter()
            .enumerate()
            .filter(|(idx_plus_1, _names)| *idx_plus_1 == 0 || node_is_referenced[idx_plus_1 - 1])
            .map(|(_idx_plus_1, names)| {
                names
                    .iter()
                    .map(|(key, ref_)| match ref_ {
                        Ref::Unique(idx) => (key.clone(), Ref::Unique(old_to_new_indices[*idx])),
                        Ref::Ambiguous(vec_idx) => (
                            key.clone(),
                            Ref::Ambiguous(
                                vec_idx.iter().map(|idx| old_to_new_indices[*idx]).collect(),
                            ),
                        ),
                    })
                    .collect()
            })
            .collect();
        self.name_map = new_name_map;
    }
}

/// Get the name of `element` from its `name` attribute,
/// where the `name` attribute must have exactly one text child to be considered valid.
fn get_element_name(element: &FlatElement) -> Option<String> {
    let name = element
        .attributes
        .iter()
        .find(|attr| attr.name == "name")
        .and_then(|attr| {
            match (attr.children.len(), attr.children.first()) {
                // A name attribute should have exactly one text child. Otherwise it is considered invalid.
                (1, Some(UntaggedContent::Text(name))) => Some(name.clone()),
                _ => None,
            }
        });
    name
}

#[cfg(test)]
#[path = "ref_resolve.test.rs"]
mod test;

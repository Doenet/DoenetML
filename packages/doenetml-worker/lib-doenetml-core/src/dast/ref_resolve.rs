//! Refs use a `path`, which consists of _names_ separated by dots (e.g. `a.b.c`), possibly followed by
//! prop names separated by dots (e.g. `a.b.c.x.y.z`). A `Resolver` searches for a matching node
//! from a given starting position. Because a `Resolver` does not know whether part of a path corresponds to a
//! name or prop name, the longest valid partial match is used and unmatched portions of a `path` are
//! preserved for future use.

use std::{collections::HashMap, iter, mem, ops::Range};

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
    pub parents_with_changeable_children: Vec<Index>,
}

/// Status of a pointer referring to children of an element.
#[derive(Debug, Serialize, Deserialize, Clone)]
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

/// An enum specifying whether or not nodes that are being added to the resolver should also be added as index resolutions
/// of the flat fragment parent, and if so, which existing indices they should replace.
#[derive(Debug, Serialize, Deserialize, Clone)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub enum IndexResolution {
    /// Do not modify the `index_resolutions` field of the flat fragment parent
    None,
    /// Replace the `index_resolutions` field of the flat fragment parent with references to its children
    ReplaceAll,
    /// Splice references to the fragment parent's children into its `index_resolutions` field, replacing the specified range of indices
    ReplaceRange(Range<Index>),
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

const CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS: [&str; 1] = ["group"];
const DONT_SEARCH_CHILDREN: [&str; 3] = ["option", "case", "repeat"];

#[derive(Debug, Serialize, Deserialize, Clone)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct NodeResolverData {
    /// The parent of the node. Options are:
    /// - `NodeParent:None` corresponds to no parent
    /// - `NodeParent:FlatRoot` corresponds to the parent being the flat root (which isn't a node)
    /// - `NodeParent:Node(i)` corresponds to the parent being node `i`.
    node_parent: NodeParent,
    resolution_algorithm: ResolutionAlgorithm,
    /// Map of all the names that are accessible (as descendants) from the node
    name_map: HashMap<String, Ref>,
    /// Map of resolutions of indices that follow a match to the node.
    /// If `index_resolutions[i] = Some(j)` and the reference `$node_reference` matches the node,
    /// then the reference `$node_reference[i+1]` resolves to node `k`
    /// (as references are indexed starting from `1`).
    /// Note: `index_resolutions[i] = None` indicates that `$node_reference[i+1]` would resolve to a text node,
    /// which is not a valid ref resolution.
    index_resolutions: Vec<Option<Index>>,
    has_changeable_children: bool,
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
    node_resolver_data: Vec<NodeResolverData>,
}

impl Resolver {
    pub fn from_flat_root(flat_root: &FlatRoot) -> Self {
        let mut name_map = Self::build_name_map(&FlatRootOrFragment::Root(flat_root));

        let mut resolver = Resolver {
            node_resolver_data: Range {
                start: 0,
                end: flat_root.nodes.len() + 1,
            }
            .map(|idx_plus_1| {
                if idx_plus_1 == 0 {
                    NodeResolverData {
                        node_parent: NodeParent::None,
                        resolution_algorithm: ResolutionAlgorithm::SearchChildren,
                        name_map: mem::take(&mut name_map[0]),
                        index_resolutions: Vec::new(),
                        has_changeable_children: false,
                    }
                } else {
                    let node = &flat_root.nodes[idx_plus_1 - 1];
                    NodeResolverData {
                        node_parent: node
                            .parent()
                            .map(|idx| NodeParent::Node(idx))
                            .unwrap_or(NodeParent::FlatRoot),
                        resolution_algorithm: ResolutionAlgorithm::lookup_by_flat_node(node),
                        name_map: mem::take(&mut name_map[idx_plus_1]),
                        index_resolutions: Vec::new(),
                        has_changeable_children: false,
                    }
                }
            })
            .collect(),
        };

        resolver.add_implicit_index_resolutions(
            &FlatRootOrFragment::Root(flat_root),
            &CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS,
        );

        resolver
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
    /// - `flat_fragment`: a `FlatFragment` containing the new descendants added to `flat_fragment.parent_idx`
    /// - `index_resolution`: used to optionally specify that the children of the `flat_fragment` should also
    ///   be added as indices of the `flat_fragment` parent.
    pub fn add_nodes(&mut self, flat_fragment: &FlatFragment, index_resolution: IndexResolution) {
        let prev_num_nodes = self.node_resolver_data.len();
        let new_num_nodes = flat_fragment.len() + 1;

        let parent_node = match flat_fragment.parent_idx {
            Some(idx) => NodeParent::Node(idx),
            None => NodeParent::None,
        };

        // add placeholders for missing nodes as well as new nodes to be added
        if new_num_nodes > prev_num_nodes {
            let padding = new_num_nodes - prev_num_nodes;
            self.node_resolver_data.extend(iter::repeat_n(
                NodeResolverData {
                    node_parent: NodeParent::None,
                    resolution_algorithm: ResolutionAlgorithm::SearchChildren,
                    name_map: HashMap::new(),
                    index_resolutions: Vec::new(),
                    has_changeable_children: false,
                },
                padding,
            ));
        }

        // Add parents and stop_propagation for new nodes
        for node in flat_fragment.nodes.iter() {
            self.node_resolver_data[node.idx() + 1].node_parent = node
                .parent()
                .map(|idx| NodeParent::Node(idx))
                .unwrap_or(parent_node);
            self.node_resolver_data[node.idx() + 1].resolution_algorithm =
                ResolutionAlgorithm::lookup_by_flat_node(node);
        }

        let mut subtree_name_map =
            Self::build_name_map(&FlatRootOrFragment::Fragment(flat_fragment));

        // Add new items to `name_map`.
        // If a node was already in the `name_map`, its value is replaced.
        for node in flat_fragment.nodes.iter() {
            let names = mem::take(&mut subtree_name_map[node.idx() + 1]);
            for (key, ref_) in names.into_iter() {
                self.node_resolver_data[node.idx() + 1]
                    .name_map
                    .insert(key, ref_);
            }
        }

        if let Some(parent_idx) = flat_fragment.parent_idx {
            // We will add items to the resolver for parent only if the parent does not already have items with that name,
            // i.e., the resolver will continue to resolve to descendants of parent as before,
            // and now will fall back to new items if there wasn't already a ref resolution.
            let parent_map = &mut self.node_resolver_data[parent_idx + 1].name_map;
            let new_parent_map = mem::take(&mut subtree_name_map[parent_idx + 1]);

            for (key, ref_) in new_parent_map.into_iter() {
                parent_map.entry(key).or_insert(ref_);
            }

            // mark the fragment parent as potentially having children that change
            self.node_resolver_data[parent_idx + 1].has_changeable_children = true;

            // If the new nodes are also index resolutions for the parent,
            // add them to `index_resolutions`
            match index_resolution {
                IndexResolution::None => {}
                IndexResolution::ReplaceAll | IndexResolution::ReplaceRange(_) => {
                    self.replace_index_resolutions(
                        parent_idx,
                        &flat_fragment.children,
                        index_resolution,
                    );
                }
            }
        }

        self.add_implicit_index_resolutions(
            &FlatRootOrFragment::Fragment(flat_fragment),
            &CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS,
        );
    }

    /// Find any elements in `flat_root_or_fragment` that are marked `CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS`
    /// and add index resolutions so that their children will resolve as their indices
    fn add_implicit_index_resolutions(
        &mut self,
        flat_root_or_fragment: &FlatRootOrFragment,
        children_are_index_resolutions: &[&str],
    ) {
        for element in flat_root_or_fragment
            .nodes_iter()
            .filter_map(|node| match node {
                FlatNode::Element(element) => {
                    if children_are_index_resolutions.contains(&element.name.as_str()) {
                        Some(element)
                    } else {
                        None
                    }
                }
                _ => None,
            })
        {
            self.replace_index_resolutions(
                element.idx,
                &element.children,
                IndexResolution::ReplaceAll,
            );
        }
    }

    /// Replace the `index_resolutions` corresponding to `parent_idx` with `components`,
    /// using the replace mode given by `mode`.
    fn replace_index_resolutions(
        &mut self,
        parent_idx: Index,
        components: &[UntaggedContent],
        index_resolution: IndexResolution,
    ) {
        let new_resolutions: Vec<Option<usize>> = components
            .iter()
            .filter_map(|child| match child {
                UntaggedContent::Text(s) => {
                    if s.trim().is_empty() {
                        // a blank text node is ignored
                        None
                    } else {
                        // any other text node takes up an index but that index will have not a ref resolution
                        Some(None)
                    }
                }
                UntaggedContent::Ref(idx) => Some(Some(*idx)),
            })
            .collect();

        match index_resolution {
            IndexResolution::ReplaceAll => {
                self.node_resolver_data[parent_idx + 1].index_resolutions = new_resolutions;
            }
            IndexResolution::ReplaceRange(range) => {
                self.node_resolver_data[parent_idx + 1]
                    .index_resolutions
                    .splice(range, new_resolutions);
            }
            IndexResolution::None => {}
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

            loop {
                let parent_idx_plus_1 =
                    match self.node_resolver_data[prev_parent_idx_plus_1].node_parent {
                        NodeParent::None => break,
                        NodeParent::FlatRoot => 0,
                        NodeParent::Node(idx) => idx + 1,
                    };

                prev_parent_idx_plus_1 = parent_idx_plus_1;

                let name_map = &mut self.node_resolver_data[parent_idx_plus_1].name_map;

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
        // remove nodes from `node_parent` structure
        // and clear their `index_resolutions`
        for node in nodes.iter() {
            if node.idx() + 1 < self.node_resolver_data.len() {
                self.node_resolver_data[node.idx() + 1].node_parent = NodeParent::None;
                self.node_resolver_data[node.idx() + 1]
                    .index_resolutions
                    .clear();
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

        let mut parents_with_changeable_children = Vec::new();

        // Note: `remaining_path` is declared outside the following `if` statement
        // as it needs to live as long as the `path` iterator does.
        let remaining_path: Vec<FlatPathPart>;

        if !skip_parent_search {
            let first_path_part = path.next().ok_or(ResolutionError::NoReferent)?;
            current_idx = self.search_parents(&first_path_part.name, current_idx)?;
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
                                if node_data.has_changeable_children {
                                    parents_with_changeable_children.push(current_idx)
                                }
                                current_idx = *idx;
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
                        parents_with_changeable_children,
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
                                            if node_data.has_changeable_children {
                                                parents_with_changeable_children.push(current_idx)
                                            }
                                            current_idx = *new_node_idx;
                                            node_data = &self.node_resolver_data[current_idx + 1];

                                            // since we found a match, we continue to the next index, if it exists
                                            continue;
                                        }
                                        None => {
                                            // a value of `None` corresponds to an index matching a text node, which we cannot reference
                                            return Err(ResolutionError::NoReferent);
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
                    parents_with_changeable_children,
                });
            }
        }

        // We've fully resolved and there are no remaining path parts.
        Ok(RefResolution {
            node_idx: current_idx,
            unresolved_path: None,
            original_path,
            parents_with_changeable_children,
        })
    }

    /// Search up the chain of parents to find the first node that has `name` accessible.
    /// Return the referent of `name`.
    fn search_parents(&self, name: &str, origin: usize) -> Result<Index, ResolutionError> {
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
            FlatRootOrFragment::Root(_) => Some(0),
            FlatRootOrFragment::Fragment(flat_fragment) => {
                flat_fragment.parent_idx.map(|idx| idx + 1)
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
            // including the base parent, if it exists

            let mut parents = flat_root_or_fragment
                .parent_iter(element.idx)
                .map(|parent| parent.idx + 1)
                .collect::<Vec<_>>();
            if let Some(idx) = base_parent_idx_plus_1 {
                parents.push(idx);
            }

            for parent_idx_plus_1 in parents {
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
                if Some(parent_idx_plus_1) != base_parent_idx_plus_1 && parent_idx_plus_1 > 0 {
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
        // Note: the first entry, which corresponds to the flat_root, is always present
        let new_node_resolver_data: Vec<NodeResolverData> = self
            .node_resolver_data
            .iter()
            .enumerate()
            .filter(|(idx_plus_1, _node_data)| {
                *idx_plus_1 == 0 || node_is_referenced[idx_plus_1 - 1]
            })
            .map(|(idx_plus_1, node_data)| {
                let name_map = node_data
                    .name_map
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
                    .collect();

                let index_resolutions = node_data
                    .index_resolutions
                    .iter()
                    .map(|v| v.map(|idx| old_to_new_indices[idx]))
                    .collect();

                if idx_plus_1 == 0 {
                    NodeResolverData {
                        node_parent: NodeParent::None,
                        resolution_algorithm: ResolutionAlgorithm::SearchChildren,
                        name_map,
                        index_resolutions,
                        has_changeable_children: false,
                    }
                } else {
                    NodeResolverData {
                        node_parent: match node_data.node_parent {
                            NodeParent::None | NodeParent::FlatRoot => node_data.node_parent,
                            NodeParent::Node(idx) => NodeParent::Node(old_to_new_indices[idx]),
                        },
                        resolution_algorithm: node_data.resolution_algorithm,
                        name_map,
                        index_resolutions,
                        has_changeable_children: node_data.has_changeable_children,
                    }
                }
            })
            .collect();
        self.node_resolver_data = new_node_resolver_data;
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

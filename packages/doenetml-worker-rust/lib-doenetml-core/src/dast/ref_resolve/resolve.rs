use serde::{Deserialize, Serialize};
use std::iter;
use tsify_next::Tsify;

use super::{NameMap, ResolutionError};
use crate::dast::{
    flat_dast::{FlatElement, FlatNode, FlatPathPart, Index, SourceDoc, UntaggedContent},
    ref_resolve::NameWithSource,
};

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
pub enum Ref {
    Unique(Index),
    Ambiguous(Vec<Index>),
}

/// The `Visibility` of a node determines how the `name_map` is constructed.
/// The behavior of each variant is:
/// - `Visible`: the default behavior where the visibility of the node and its children are not restricted.
///   If all nodes were `Visible`, then the name of each node could be resolved from any of its ancestors.
/// - `Invisible`: the node and its descendants cannot be resolved by name from any of the node's ancestors.
/// - `ChildrenInvisibleToTheirGrandparents`: all the children of the node (and their descendants) can be resolved by name
///   from the node itself but cannot be resolved by name from any of the node's ancestors.
///   To resolve a reference to a child (or a descendant),
///   one must preface the name with the name of the node.
///   For example, since `<option>` is tagged with `ChildrenInvisibleToTheirGrandparents`,
///   consider the DoenetML
///   ```xml
///   <d>
///       <option name="x">
///           <a name="y">
///               <b name="z" />
///           </a>
///       </option>
///       <c/>
///   </d>
///   ```
///   - References `$y` and `$z` from `<c>` would fail because the `name_map` of `<d>` would not contain the nodes.
///   - References `$x.y` and `$x.z` from `<c>` would resolve because the `name_map` of `<option>` would contain the nodes.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(super) enum Visibility {
    Visible,
    Invisible,
    ChildrenInvisibleToTheirGrandparents,
}

const CHILDREN_INVISIBLE_TO_THEIR_GRANDPARENTS: [&str; 3] = ["repeat", "option", "case"];

impl Visibility {
    fn lookup_by_name(name: &str) -> Self {
        if CHILDREN_INVISIBLE_TO_THEIR_GRANDPARENTS.contains(&name) {
            Visibility::ChildrenInvisibleToTheirGrandparents
        } else {
            Visibility::Visible
        }
    }

    pub(super) fn lookup_by_flat_node(node: &FlatNode) -> Self {
        if let FlatNode::Element(element) = node {
            Self::lookup_by_name(element.name.as_str())
        } else {
            Visibility::Invisible
        }
    }

    pub(super) fn lookup_by_flat_element(element: &FlatElement) -> Self {
        Self::lookup_by_name(element.name.as_str())
    }
}

/// The possibilities for the parent of a node in the resolver
#[derive(Debug, Serialize, Clone, Copy)]
pub enum NodeParent {
    None,
    FlatRoot,
    Node(Index),
}

#[derive(Debug, Serialize, Clone)]
pub struct NodeResolverData {
    /// The parent of the node. Options are:
    /// - `NodeParent:None` corresponds to no parent
    /// - `NodeParent:FlatRoot` corresponds to the parent being the flat root (which isn't a node)
    /// - `NodeParent:Node(i)` corresponds to the parent being node `i`.
    pub(super) node_parent: NodeParent,
    /// Map of all the names that are accessible (as descendants) from the node.
    /// The data structure uses a `FxHashMap` so that iterating over the `name_map` is done in a consistent order.
    pub(super) name_map: NameMap,
    /// Map of resolutions of indices that follow a match to the node.
    /// If `index_resolutions[i] = Some(j)` and the reference `$node_reference` matches the node,
    /// then the reference `$node_reference[i+1]` resolves to node `k`
    /// (as references are indexed starting from `1`).
    /// Note: `index_resolutions[i] = None` indicates that `$node_reference[i+1]` would resolve to a text node,
    /// which is not a valid ref resolution.
    pub(super) index_resolutions: Vec<Option<Index>>,
    /// If a node extends an external document, then `source_sequence` is a list of the node's original source doc
    /// and the source doc from which it extended.
    ///
    /// For example, imagine that for this DoenetML `<section extend="doenet:abc" />` that `doenet:abc`
    /// resolved to the document with source number 3 containing `<section/>`. Then `source_sequence`
    /// for the `<section>` would be `[0, 3]`.
    ///
    /// If, on the other hand, `doenet:abc` resolved to source number 3 containing `<section extend="doenet:def" />` and
    /// `doenet:def` resolved to source number 1 containing `<section>`, then `source_sequence` for the `<section>`
    /// would be `[0, 3, 1]`.
    pub(super) source_sequence: Option<Vec<SourceDoc>>,
}

/// A `Resolver` is used to lookup elements by path/name. It constructs a search index
/// upon construction. If the underlying `FlatRoot` changes, a new `Resolver` should be
/// recreated.
#[derive(Debug, Serialize)]
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

        // the initial `source_doc` is determined from the initial path segment,
        // defaulting to `0` if there is no path
        let mut source_doc: SourceDoc = original_path
            .first()
            .and_then(|path_part| path_part.source_doc)
            .into();

        // A list of all the nodes involved in resolving
        let mut nodes_in_resolved_path = vec![origin];

        // Note: `remaining_path` is declared outside the following `if` statement
        // as it needs to live as long as the `path` iterator does.
        let remaining_path: Vec<FlatPathPart>;

        if !skip_parent_search {
            let first_path_part = path.next().ok_or(ResolutionError::NoReferent)?;
            current_idx = self.search_parents(
                &NameWithSource {
                    name: first_path_part.name.clone(),
                    source_doc,
                },
                current_idx,
            )?;
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
                    source_doc: first_path_part.source_doc,
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

                // current_idx specifies the "root" of the search. We try to resolve
                // children based on the path part, returning an error if there is an ambiguity.
                if let Some(referent) = node_data.name_map.get(&NameWithSource {
                    name: part.name.clone(),
                    source_doc,
                }) {
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

                if !matched_part_name {
                    // If we cannot match a descendant to the next part name,
                    // we check if the current node was extended from an external document.
                    // If so, then we look up the next document in its `source_sequence`
                    // and attempt to match the name using that source.
                    //
                    // For example, given the DoenetML `<section name="s" extend="doenet:abc" />$s.t`,
                    // the reference `$s` will match the `<section name="s">` but `.t` will not match a descendant.
                    // Imagine that `doenet:abc` resolves to the DoenetML `<section name="s2"><text name="t" /></section>`.
                    // This source will be the next in `source_sequence`, so we search for a `<section>` descendant
                    // named `t` from that second source. In this case,
                    // the reference `$s.t` will resolve to the `<text>` node.
                    if let Some(source_sequence) = &node_data.source_sequence {
                        // Since we have a `source_sequence`, the node must have extended an external document
                        let mut sources = source_sequence.iter();

                        // In the list of sources, find the source that matches the current `source_doc`
                        if sources.any(|source| *source == source_doc) {
                            // If there is a subsequent source, search that one for the same name matched with the new source.
                            if let Some(next_source) = sources.next() {
                                if let Some(referent) = node_data.name_map.get(&NameWithSource {
                                    name: part.name.clone(),
                                    source_doc: *next_source,
                                }) {
                                    matched_part_name = true;
                                    match referent {
                                        Ref::Unique(idx) => {
                                            current_idx = *idx;

                                            // search from this source doc from now on
                                            source_doc = *next_source;

                                            if !nodes_in_resolved_path.contains(&current_idx) {
                                                nodes_in_resolved_path.push(current_idx);
                                            }
                                            node_data = &self.node_resolver_data[current_idx + 1];
                                        }
                                        Ref::Ambiguous(_) => {
                                            return Err(ResolutionError::NonUniqueReferent);
                                        }
                                    }
                                } else {
                                    // In order to allow a reference to the node itself (or a node it is extending)
                                    // using the name from the second source,
                                    // we fall back to check the name in the parent's map.
                                    //
                                    // In the above example, this allows a reference to `$s.s2` to resolve back to the section,
                                    // given that its name was `s2` in the second source document.
                                    let parent_plus_1 = match node_data.node_parent {
                                        NodeParent::None => unreachable!(),
                                        NodeParent::FlatRoot => 0,
                                        NodeParent::Node(idx) => idx + 1,
                                    };

                                    if let Some(referent) = self.node_resolver_data[parent_plus_1]
                                        .name_map
                                        .get(&NameWithSource {
                                            name: part.name.clone(),
                                            source_doc: *next_source,
                                        })
                                    {
                                        matched_part_name = true;
                                        match referent {
                                            Ref::Unique(idx) => {
                                                current_idx = *idx;

                                                // search from this source doc from now on
                                                source_doc = *next_source;

                                                if !nodes_in_resolved_path.contains(&current_idx) {
                                                    nodes_in_resolved_path.push(current_idx);
                                                }
                                                node_data =
                                                    &self.node_resolver_data[current_idx + 1];
                                            }
                                            Ref::Ambiguous(_) => {
                                                return Err(ResolutionError::NonUniqueReferent);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if !matched_part_name {
                    // If we cannot find an appropriate descendant, the remaining path parts might be
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
                                                    source_doc: part.source_doc,
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
                    source_doc: part.source_doc,
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
        name_with_source_doc: &NameWithSource,
        origin: usize,
    ) -> Result<Index, ResolutionError> {
        let mut node_data = &self.node_resolver_data[origin + 1];

        // if passed in a node without a parent, then search from that node itself
        // TODO: don't duplicate code with case where have parent, below
        if matches!(node_data.node_parent, NodeParent::None) {
            if let Some(resolved) = node_data.name_map.get(name_with_source_doc) {
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

        let mut child_idx = origin;

        loop {
            let parent_plus_1 = match node_data.node_parent {
                NodeParent::None => break,
                NodeParent::FlatRoot => 0,
                NodeParent::Node(idx) => idx + 1,
            };

            if let Some(resolved) = self.node_resolver_data[parent_plus_1]
                .name_map
                .get(name_with_source_doc)
            {
                match resolved {
                    Ref::Unique(idx) => {
                        return Ok(*idx);
                    }
                    Ref::Ambiguous(indices) => {
                        if indices.contains(&child_idx) {
                            // If one possibility is that we could resolve back to the child, we disambiguate the reference to be that child.
                            //
                            // For example, for this DoenetML, the reference `$p` from within the first problem
                            // resolves uniquely to the problem even though the name `p` is not unique among the parent section's descendants.
                            // ```
                            // <section>
                            //     <problem name="p">
                            //         <p>Credit achieved: $p.creditAchieved</p>
                            //     </problem>
                            //     <problem name="p" />
                            // <section>
                            // ```
                            return Ok(child_idx);
                        } else {
                            return Err(ResolutionError::NonUniqueReferent);
                        }
                    }
                }
            }
            node_data = &self.node_resolver_data[parent_plus_1];

            // Note: if parent_plus_1 == 0, the loop will end as the root has no parent
            if parent_plus_1 > 0 {
                child_idx = parent_plus_1 - 1;
            }
        }
        Err(ResolutionError::NoReferent)
    }
}

#[cfg(test)]
#[path = "resolve.test.rs"]
mod test;

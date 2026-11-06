use rustc_hash::FxHashSet;
use serde::{Deserialize, Serialize};
use std::iter;
use tsify_next::Tsify;

use super::{IndexKind, NameMap, ResolutionError, root_names::RootNameCache};
use crate::dast::{
    Position,
    flat_dast::{
        FlatAttribute, FlatElement, FlatNode, FlatPathPart, Index, SourceDoc, UntaggedContent,
    },
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
    /// Each index in the path that selected a child of a `<group>` (see [`IndexKind::Children`]),
    /// a deprecated form that still resolves, so that it can be reported.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub child_indexes: Vec<ChildIndex>,
}

/// An index of a path that selected a child of a `<group>`,
/// rather than one of the instances a component produces (D27).
#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct ChildIndex {
    /// The `<group>` whose child was selected
    pub container_idx: Index,
    /// The child that was selected
    pub child_idx: Index,
    /// Where the index was written
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// Status of a pointer referring to children of an element.
#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum Ref {
    Unique(Index),
    /// The name reaches each of these, each a `Unique` or a `Branches`,
    /// so that, when all but one are deleted (`Resolver::delete_nodes`),
    /// the one left is what it was.
    Ambiguous(Vec<Ref>),
    /// The name is declared in the branches of the `<conditionalContent>` or the one-pick
    /// `<select>` at this index (see [`branch_container_kind`]).
    /// Only one branch is active at a time, so declaring the name in several branches
    /// is not ambiguous: the name is resolved as though it were written as a path
    /// through the container, `$x` as `$cc.x`, which finds the `x` of the active branch.
    Branches(Index),
}

impl Ref {
    /// The index a `Unique` or a `Branches` refers to, `None` for `Ambiguous`.
    pub(super) fn single_idx(&self) -> Option<Index> {
        match self {
            Ref::Unique(idx) | Ref::Branches(idx) => Some(*idx),
            Ref::Ambiguous(_) => None,
        }
    }
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
///
///   An `<option>` of a `<select>` that picks one is `Visible` instead,
///   as are a `<case>` and an `<else>`: see [`branch_container_kind`].
#[derive(Debug, Clone, Copy, PartialEq)]
pub(super) enum Visibility {
    Visible,
    Invisible,
    ChildrenInvisibleToTheirGrandparents,
}

/// The components whose children are private, reached only through the component's name
/// (`$r[2].x`). An `<option>` is among them unless its `<select>` picks one
/// (see [`branch_container_kind`]).
const CHILDREN_INVISIBLE_TO_THEIR_GRANDPARENTS: [&str; 3] =
    ["repeat", "repeatForSequence", "option"];

/// What kind of branch container an element is, if any.
///
/// A `<conditionalContent>` shows one of its `<case>`s or its `<else>`,
/// and a `<select>` with one pick (`numToSelect` written as `1`, or left out) shows one of its `<option>`s.
/// The names declared in those branches are visible outside the container, as a `<group>`'s are,
/// and the same name declared in several branches is not ambiguous, since only one branch is active
/// (D13, D22). See [`Ref::Branches`].
#[derive(Debug, Clone, Copy, PartialEq, Serialize)]
pub(super) enum BranchContainerKind {
    ConditionalContent,
    OnePickSelect,
}

impl BranchContainerKind {
    /// Whether a child with this tag is one of the container's branches.
    pub(super) fn is_branch(&self, child_name: &str) -> bool {
        match self {
            BranchContainerKind::ConditionalContent => child_name == "case" || child_name == "else",
            BranchContainerKind::OnePickSelect => child_name == "option",
        }
    }
}

/// The kind of branch container `element` is, if any (see [`BranchContainerKind`]).
///
/// `literal_text` gives the text an attribute is written as, if it is only text,
/// which decides whether a `<select>` picks one.
pub(super) fn branch_container_kind(
    element: &FlatElement,
    literal_text: impl Fn(&FlatAttribute) -> Option<String>,
) -> Option<BranchContainerKind> {
    // A tag written with `extend` or `copy` that the core adds as content (in an iteration
    // of a repeat) is a `_copy` making a component of the type it was written as.
    let tag = if element.name == "_copy" {
        element
            .attributes
            .iter()
            .find(|attr| attr.name == "_createComponentOfType")
            .and_then(&literal_text)
            .unwrap_or_default()
    } else {
        element.name.clone()
    };
    match tag.as_str() {
        "conditionalContent" | "conditionalcontent" => {
            Some(BranchContainerKind::ConditionalContent)
        }
        "select" => {
            let num_to_select = element
                .attributes
                .iter()
                .find(|attr| attr.name.eq_ignore_ascii_case("numToSelect"));
            // A copy of a `<select>` picks as many as the one it copies,
            // unless its own `numToSelect` says otherwise.
            let is_copy = element.name == "_copy"
                || element.extending.is_some()
                || element.attributes.iter().any(|attr| {
                    // matched without regard to case, as `ref_expand` matches them
                    crate::dast::ref_expand::is_extend_or_copy_attribute(&attr.name)
                });
            match num_to_select {
                None if is_copy => None,
                None => Some(BranchContainerKind::OnePickSelect),
                Some(attr) => match literal_text(attr) {
                    Some(text) if text.trim() == "1" => Some(BranchContainerKind::OnePickSelect),
                    _ => None,
                },
            }
        }
        _ => None,
    }
}

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
    /// The names in `name_map` that reach content a copy or an extend made inside the node
    /// (added by [`Resolver::add_nodes`] from a fragment with `copied_content`).
    /// A path step through the node reaches them, as `$s2.t` does in
    /// `<section name="s2" copy="$s" />`, but a search for a bare name skips them,
    /// so that `$t` never finds the copied `t`, not even from a child written inside the copy.
    /// A reference resolves where it is written, among what is written.
    #[serde(skip_serializing_if = "FxHashSet::is_empty")]
    pub(super) copied_names: FxHashSet<NameWithSource>,
    /// Map of resolutions of indices that follow a match to the node.
    /// If `index_resolutions[i] = Some(j)` and the reference `$node_reference` matches the node,
    /// then the reference `$node_reference[i+1]` resolves to node `k`
    /// (as references are indexed starting from `1`).
    /// Note: `index_resolutions[i] = None` indicates that `$node_reference[i+1]` would resolve to a text node,
    /// which is not a valid ref resolution.
    pub(super) index_resolutions: Vec<Option<Index>>,
    /// What an index after the node selects among. See [`IndexKind`].
    #[serde(skip_serializing_if = "IndexKind::is_instances")]
    pub(super) index_kind: IndexKind,
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
    /// The kind of branch container the node is, if any (see [`branch_container_kind`]),
    /// so that the names of a fragment added to it (`Resolver::add_nodes`) are its branches' names.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub(super) branch_kind: Option<BranchContainerKind>,
    /// Whether the node is the `<setup>` a repeat adds to an iteration for its `valueName`
    /// and `indexName` (see [`super::ITERATION_ALIASES_ATTRIBUTE`]). It keeps its place among
    /// the index resolutions of the iteration, but an index never reaches it: an index
    /// selecting it is resolved as one past the iteration's content, and no root name is
    /// made through it.
    #[serde(skip_serializing_if = "std::ops::Not::not")]
    pub(super) iteration_aliases: bool,
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
    /// The root names last returned by [`Resolver::update_root_names`],
    /// against which the next call reports its changes.
    #[serde(skip)]
    pub(super) root_name_cache: RootNameCache,
}

impl Resolver {
    /// Search for a node specified by `path` starting from `origin`. This algorithm searches first
    /// for the nearest parent that has a descendant with `path[0].name` as its name. Then it tries
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

        // The indices that selected a child of a `<group>`
        let mut child_indexes: Vec<ChildIndex> = Vec::new();

        // Note: `remaining_path` is declared outside the following `if` statement
        // as it needs to live as long as the `path` iterator does.
        let remaining_path: Vec<FlatPathPart>;

        if !skip_parent_search {
            let first_path_part = path.next().ok_or(ResolutionError::NoReferent)?;
            let in_branches;
            (current_idx, in_branches) = self.search_parents(
                &NameWithSource {
                    name: first_path_part.name.clone(),
                    source_doc,
                },
                current_idx,
            )?;
            if current_idx != origin {
                nodes_in_resolved_path.push(current_idx);
            }
            if in_branches {
                // The name is declared in the branches of the container `current_idx`,
                // so it is resolved through the container, `$x` as `$cc.x`:
                // the whole path is still to be resolved from there.
                remaining_path = iter::once(first_path_part.clone())
                    .chain(path.cloned())
                    .collect();

                path = remaining_path.iter();
            } else if !first_path_part.index.is_empty() {
                // If we made it here, the first entry in `path` has a valid referent.
                // If this entry also has an index, we add the index back to the beginning of the path
                // so that it will be address first, below. This would
                // happen if the reference was something like `$a[2].b`.
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
                let mut name_with_source = NameWithSource {
                    name: part.name.clone(),
                    source_doc,
                };
                // If the name is not a descendant's, and the current node extended an external
                // document, we look up the next document in its `source_sequence`
                // and attempt to match the name using that source, from which we then search.
                //
                // For example, given the DoenetML `<section name="s" extend="doenet:abc" />$s.t`,
                // the reference `$s` will match the `<section name="s">` but `.t` will not match a descendant.
                // Imagine that `doenet:abc` resolves to the DoenetML `<section name="s2"><text name="t" /></section>`.
                // This source will be the next in `source_sequence`, so we search for a `<section>` descendant
                // named `t` from that second source. In this case,
                // the reference `$s.t` will resolve to the `<text>` node.
                let next_source = node_data.source_sequence.as_ref().and_then(|sequence| {
                    let mut sources = sequence.iter();
                    sources
                        .any(|source| *source == source_doc)
                        .then(|| sources.next().copied())
                        .flatten()
                });
                if !node_data.name_map.contains_key(&name_with_source)
                    && let Some(next_source) = next_source
                {
                    let next_name = NameWithSource {
                        name: part.name.clone(),
                        source_doc: next_source,
                    };
                    if node_data.name_map.contains_key(&next_name) {
                        name_with_source = next_name;
                        // search from this source doc from now on
                        source_doc = next_source;
                    }
                }
                // A name declared in the branches of a container is resolved through it:
                // in the container, it is the active branch's, once the container has added
                // what that branch holds (`add_nodes`), else it is left for the container
                // to resolve when it has.
                let mut referent = node_data.name_map.get(&name_with_source);
                let mut left_for_container = false;
                while let Some(Ref::Branches(container_idx)) = referent {
                    if *container_idx == current_idx {
                        left_for_container = true;
                        break;
                    }
                    current_idx = *container_idx;
                    if !nodes_in_resolved_path.contains(&current_idx) {
                        nodes_in_resolved_path.push(current_idx);
                    }
                    node_data = &self.node_resolver_data[current_idx + 1];
                    referent = node_data.name_map.get(&name_with_source);
                    // No branch is active, so the container holds nothing by that name now
                    left_for_container = referent.is_none();
                }
                if left_for_container {
                    let remaining_path: Vec<FlatPathPart> =
                        iter::once(part.clone()).chain(path.cloned()).collect();
                    return Ok(RefResolution {
                        node_idx: current_idx,
                        unresolved_path: Some(remaining_path),
                        original_path,
                        nodes_in_resolved_path,
                        child_indexes,
                    });
                }
                if let Some(referent) = referent {
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
                        Ref::Branches(_) => unreachable!(),
                    }
                }

                if !matched_part_name && let Some(next_source) = next_source {
                    // In order to allow a reference to the node itself (or a node it is extending)
                    // using the name from the next source, we fall back to check the name in the parent's map.
                    //
                    // In the above example, this allows a reference to `$s.s2` to resolve back to the section,
                    // given that its name was `s2` in the second source document.
                    let parent_plus_1 = match node_data.node_parent {
                        NodeParent::None => unreachable!(),
                        NodeParent::FlatRoot => 0,
                        NodeParent::Node(idx) => idx + 1,
                    };

                    if let Some(referent) =
                        self.node_resolver_data[parent_plus_1]
                            .name_map
                            .get(&NameWithSource {
                                name: part.name.clone(),
                                source_doc: next_source,
                            })
                    {
                        matched_part_name = true;
                        match referent {
                            Ref::Unique(idx) => {
                                current_idx = *idx;

                                // search from this source doc from now on
                                source_doc = next_source;

                                if !nodes_in_resolved_path.contains(&current_idx) {
                                    nodes_in_resolved_path.push(current_idx);
                                }
                                node_data = &self.node_resolver_data[current_idx + 1];
                            }
                            Ref::Ambiguous(_) | Ref::Branches(_) => {
                                return Err(ResolutionError::NonUniqueReferent);
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
                        child_indexes,
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

                                // An index after an iteration or a pick whose whole content
                                // is one indexable component passes to that component.
                                while let Some(child_idx) = self.pass_through_child(current_idx) {
                                    current_idx = child_idx;
                                    if !nodes_in_resolved_path.contains(&current_idx) {
                                        nodes_in_resolved_path.push(current_idx);
                                    }
                                    node_data = &self.node_resolver_data[current_idx + 1];
                                }

                                if let Some(node_match) =
                                    node_data.index_resolutions.get(index_num - 1)
                                {
                                    match node_match {
                                        // The setup a repeat adds is not reached by an index:
                                        // the index is past the iteration's content (below).
                                        Some(new_node_idx)
                                            if self.node_resolver_data[*new_node_idx + 1]
                                                .iteration_aliases => {}
                                        Some(new_node_idx) => {
                                            if !node_data.index_kind.is_instances() {
                                                child_indexes.push(ChildIndex {
                                                    container_idx: current_idx,
                                                    child_idx: *new_node_idx,
                                                    position: index.position.clone(),
                                                });
                                            }
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
                                                child_indexes,
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
                    child_indexes,
                });
            }
        }

        // We've fully resolved and there are no remaining path parts.
        Ok(RefResolution {
            node_idx: current_idx,
            unresolved_path: None,
            original_path,
            nodes_in_resolved_path,
            child_indexes,
        })
    }

    /// Search up the chain of parents to find the first node that has `name` accessible.
    /// Return the referent of `name`, and whether it is the branches of a container
    /// (`Ref::Branches`), in which case the index returned is the container's,
    /// through which `name` is still to be resolved.
    ///
    /// A name is accessible from a node when it is in the node's `name_map`
    /// and does not reach content a copy or an extend made there (`copied_names`):
    /// the first name in a path resolves only to a component written in the DoenetML.
    pub(super) fn search_parents(
        &self,
        name_with_source_doc: &NameWithSource,
        origin: usize,
    ) -> Result<(Index, bool), ResolutionError> {
        let mut node_data = &self.node_resolver_data[origin + 1];

        // if passed in a node without a parent, then search from that node itself
        if matches!(node_data.node_parent, NodeParent::None) {
            return match node_data.written_name(name_with_source_doc) {
                Some(Ref::Unique(idx)) => Ok((*idx, false)),
                Some(Ref::Branches(idx)) => Ok((*idx, true)),
                Some(Ref::Ambiguous(_)) => Err(ResolutionError::NonUniqueReferent),
                None => Err(ResolutionError::NoReferent),
            };
        }

        let mut child_idx = origin;

        loop {
            let parent_plus_1 = match node_data.node_parent {
                NodeParent::None => break,
                NodeParent::FlatRoot => 0,
                NodeParent::Node(idx) => idx + 1,
            };

            if let Some(resolved) =
                self.node_resolver_data[parent_plus_1].written_name(name_with_source_doc)
            {
                match resolved {
                    Ref::Unique(idx) => {
                        return Ok((*idx, false));
                    }
                    Ref::Branches(idx) => {
                        return Ok((*idx, true));
                    }
                    Ref::Ambiguous(refs) => {
                        if let Some(child_ref) = refs
                            .iter()
                            .find(|ref_| ref_.single_idx() == Some(child_idx))
                        {
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
                            return Ok((child_idx, matches!(child_ref, Ref::Branches(_))));
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

impl NodeResolverData {
    /// The referent of `name_with_source_doc` among the descendants written in the node,
    /// i.e., in its `name_map` but not reaching content a copy or an extend made there.
    fn written_name(&self, name_with_source_doc: &NameWithSource) -> Option<&Ref> {
        if self.copied_names.contains(name_with_source_doc) {
            None
        } else {
            self.name_map.get(name_with_source_doc)
        }
    }
}

#[cfg(test)]
#[path = "resolve.test.rs"]
mod test;

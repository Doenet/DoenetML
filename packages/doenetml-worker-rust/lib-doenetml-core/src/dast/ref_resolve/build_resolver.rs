use regex::Regex;
use rustc_hash::FxHashMap;
use std::{iter, mem, ops::Range};

use crate::dast::flat_dast::{
    FlatAttribute, FlatElement, FlatFragment, FlatNode, FlatRoot, FlatRootOrFragment, SourceDoc,
    UntaggedContent,
};

use super::*;

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
                        name_map: NameMap(mem::take(&mut name_map[0])),
                        index_resolutions: Vec::new(),
                        source_sequence: None,
                    }
                } else {
                    let node = &flat_root.nodes[idx_plus_1 - 1];
                    NodeResolverData {
                        node_parent: node
                            .parent()
                            .map(NodeParent::Node)
                            .unwrap_or(NodeParent::FlatRoot),
                        name_map: NameMap(mem::take(&mut name_map[idx_plus_1])),
                        index_resolutions: Vec::new(),
                        source_sequence: extract_source_sequence(node),
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
            Some(idx) => {
                if let Some(source_sequence) = &flat_fragment.parent_source_sequence {
                    self.node_resolver_data[idx + 1].source_sequence =
                        Some(extract_source_sequence_from_attribute(source_sequence));
                }
                NodeParent::Node(idx)
            }
            None => NodeParent::None,
        };

        // add placeholders for missing nodes as well as new nodes to be added
        if new_num_nodes > prev_num_nodes {
            let padding = new_num_nodes - prev_num_nodes;
            self.node_resolver_data.extend(iter::repeat_n(
                NodeResolverData {
                    node_parent: NodeParent::None,
                    name_map: NameMap::default(),
                    index_resolutions: Vec::new(),
                    source_sequence: None,
                },
                padding,
            ));
        }

        // Add parents and source sequence for new nodes
        for node in flat_fragment.nodes.iter() {
            self.node_resolver_data[node.idx() + 1].node_parent =
                node.parent().map(NodeParent::Node).unwrap_or(parent_node);
            self.node_resolver_data[node.idx() + 1].source_sequence = extract_source_sequence(node);
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
        }

        // If the new nodes are also index resolutions for a parent,
        // add them to `index_resolutions`
        self.replace_index_resolutions(&flat_fragment.children, index_resolution);

        self.add_implicit_index_resolutions(
            &FlatRootOrFragment::Fragment(flat_fragment),
            &CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS,
        );
    }

    /// Delete `nodes` from the resolver
    pub fn delete_nodes(&mut self, nodes: &[FlatNode]) {
        for (name_with_source_doc, node_idx) in nodes.iter().flat_map(|node| {
            // TODO: can this be done in a better way than collecting into a vector?
            if let FlatNode::Element(element) = node {
                get_element_names_with_source(element)
                    .into_iter()
                    .map(|name_with_source| (name_with_source, node.idx()))
                    .collect::<Vec<_>>()
            } else {
                vec![]
            }
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

                let references = name_map.remove(&name_with_source_doc);

                match references {
                    Some(Ref::Unique(idx)) => {
                        // Note is is possible that `parent_idx` does not have an entry in the name map
                        // its descendant `node_idx`. This could happen if either
                        // 1. one of its descendants had a `DontSearchChildren` `ResolutionAlgorithm`, or
                        // 2. one of its descendants was added later by `add_nodes`.
                        // In this case, the unique index found might not match the deleted node `node_idx`,
                        // add we add the name back to the name map
                        if idx != node_idx {
                            name_map.insert(name_with_source_doc.clone(), Ref::Unique(idx));
                        }
                    }
                    Some(Ref::Ambiguous(indices)) => {
                        // remove the deleted node `node_idx` from the ambiguous list, setting the result to unique if there is only one reference left
                        let new_indices = indices
                            .into_iter()
                            .filter(|idx| *idx != node_idx)
                            .collect::<Vec<_>>();
                        if new_indices.len() == 1 {
                            name_map
                                .insert(name_with_source_doc.clone(), Ref::Unique(new_indices[0]));
                        } else {
                            name_map
                                .insert(name_with_source_doc.clone(), Ref::Ambiguous(new_indices));
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

    /// Build a map of all the names that are accessible from a given node
    /// and the indices of the referents.
    fn build_name_map(
        flat_root_or_fragment: &FlatRootOrFragment,
    ) -> Vec<FxHashMap<NameWithSource, Ref>> {
        // Pre-populate with empty hashmaps for each element
        let mut descendant_names = iter::repeat_with(FxHashMap::default)
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
            let names_with_source = get_element_names_with_source(element);

            for name_with_source in names_with_source {
                // Iterate through all ancestors of element,
                // including the base parent, if it exists

                let mut parents = flat_root_or_fragment
                    .parent_iter(element.idx)
                    .map(|parent| parent.idx + 1)
                    .collect::<Vec<_>>();
                if let Some(idx) = base_parent_idx_plus_1 {
                    parents.push(idx);
                }

                // Check to see if element's name map has a reference to its own `name_with_source`.
                // If so, it's reference supersedes these descendants and should replace them in its ancestors' name maps.
                let descendant_ref_of_own_name = descendant_names[element.idx + 1]
                    .get(&name_with_source)
                    .cloned();

                // We recurse (via a loop) outward through the ancestors of `element`, building the name map of each parent.
                // We check the `Visibility` of the parent and child to stop recursing to more distant ancestors
                // if the original `element` becomes invisible to those ancestors.
                // We stop recursing based on visibility under these conditions:
                // - if the child is marked `Invisible`, then it and its descendants (including `element`) are not visible to the parent,
                //   and we stop recursing
                // - if the child is marked `InvisibleToGrandparents`, then it and its descendants (including `element`)
                //   are not visible to the parent's parent. We stop recursing after updating the parent's name map.
                // - the parent: if the parent is marked `ChildrenInvisibleToTheirGrandparents`, then its descendants (including `element`)
                //   are not visible to the parent's parent. We stop recursing after updating the parent's name map.

                let mut child_visibility = Visibility::lookup_by_flat_element(element);

                // In any iteration of the loop, `previous_parent` will be the child from the previous loop.
                // If `previous_parent` has the same `name_with_source` as `element`,
                // then `previous_parent` supersedes `element` in the name map and we do not add `element`
                // to the name map of any of `previous_parent`'s ancestors.
                let mut previous_parent = element.idx;

                for parent_idx_plus_1 in parents {
                    // if child is invisible, then do not add `element` (which is the child or its descendant)
                    // to the name map of parent or more distant ancestors
                    if matches!(child_visibility, Visibility::Invisible) {
                        break;
                    }

                    // Add `element` to the name map of `parent`, creating an ambiguous reference
                    // if its `name_with_source` is already in the name map
                    match descendant_names[parent_idx_plus_1].get_mut(&name_with_source) {
                        Some(x) => {
                            match x {
                                // There is already something sharing the `name_with_source` with the current element
                                Ref::Unique(idx) => {
                                    if *idx == previous_parent {
                                        // if `name_with_source` resolves to the `previous_parent`,
                                        // then the parent supersedes the name of the descendant.
                                        // We don't change the name map, and we stop looping to additional parents
                                        break;
                                    } else {
                                        if let Some(Ref::Unique(descendent_idx)) =
                                            descendant_ref_of_own_name
                                        {
                                            if *idx == descendent_idx {
                                                // If the `name_with_source` resolves to the descendant that `element` is superseding,
                                                // then replace it with `element`
                                                *x = Ref::Unique(element.idx);
                                            } else {
                                                // Since is already something sharing the `name_with_source` with the current element,
                                                // the reference becomes ambiguous
                                                *x = Ref::Ambiguous(vec![*idx, element.idx]);
                                            }
                                        } else {
                                            // Since is already something sharing the `name_with_source` with the current element,
                                            // the reference becomes ambiguous
                                            // TODO: collapse this and the previous equivalent case when upgrade rust to edition 2024
                                            *x = Ref::Ambiguous(vec![*idx, element.idx]);
                                        }
                                    }
                                }
                                Ref::Ambiguous(vec) => {
                                    if vec.contains(&previous_parent) {
                                        // if `name_with_source` contains an element that resolves to the `previous_parent`,
                                        // then the parent supersedes the name of the descendant.
                                        // We don't change the name map, and we stop looping to additional parents
                                        break;
                                    } else {
                                        match &descendant_ref_of_own_name {
                                            Some(Ref::Unique(descendant_idx)) => {
                                                // Remove the descendant that `element` is superseding,
                                                // then add `element` to the list of ambiguous references.
                                                vec.retain(|idx| *idx != *descendant_idx);
                                                vec.push(element.idx);
                                                *x = Ref::Ambiguous(mem::take(vec));
                                            }
                                            Some(Ref::Ambiguous(descendant_indices)) => {
                                                // Remove the descendants that `element` is superseding
                                                vec.retain(|idx| !descendant_indices.contains(idx));
                                                if vec.is_empty() {
                                                    // If we removed all the previous resolutions of `name_with_source`,
                                                    // then `element` becomes the unique resolution
                                                    *x = Ref::Unique(element.idx)
                                                } else {
                                                    // Add `element` to the list of ambiguous sources
                                                    vec.push(element.idx);
                                                    *x = Ref::Ambiguous(mem::take(vec));
                                                }
                                            }
                                            None => {
                                                // Add `element` to the list of ambiguous sources
                                                vec.push(element.idx);
                                                *x = Ref::Ambiguous(mem::take(vec));
                                            }
                                        }
                                    }
                                }
                            };
                        }
                        None => {
                            // There is no current match for the`name_with_source`, so we have a unique reference
                            descendant_names[parent_idx_plus_1]
                                .insert(name_with_source.clone(), Ref::Unique(element.idx));
                        }
                    }

                    let parent_visibility = if Some(parent_idx_plus_1) == base_parent_idx_plus_1
                        || parent_idx_plus_1 == 0
                    {
                        // Always treat the flat fragment root or the flat root as visible
                        Visibility::Visible
                    } else {
                        Visibility::lookup_by_flat_node(
                            flat_root_or_fragment.get_node(parent_idx_plus_1 - 1),
                        )
                    };

                    // if parent's children are invisible to grandparents, do not add `element` (which is the child or its descendant)
                    // to the name map of the parent's parent or more distant ancestors.
                    if matches!(
                        parent_visibility,
                        Visibility::ChildrenInvisibleToTheirGrandparents
                    ) {
                        break;
                    }

                    // The previous parent becomes the child for the next iteration
                    child_visibility = parent_visibility;

                    // Note: if `parent_idx_plus_1` is `0`, we're at the end of the loop
                    if parent_idx_plus_1 > 0 {
                        previous_parent = parent_idx_plus_1 - 1;
                    }
                }
            }
        }

        descendant_names
    }
}

/// Get a vector of the possible `NameWithSource` representations of the element.
/// The `source_doc` for a `NameWithSource` is determined in two possible ways:
/// - from the element's `name` attribute, in which case the `source_doc` is retrieved from the element itself, or
/// - from the element's attribute with a name of the form `source-n:name`, where `n` is a number,
///   in which case `n` is the `source_doc`.
///
/// For each such attribute, the value of the name is determined from the attribute's children.
/// The attribute must have exactly one text child to be considered valid.
fn get_element_names_with_source(element: &FlatElement) -> Vec<NameWithSource> {
    let name_re = Regex::new(r"^(source-(?<source_doc>\d+):)?name$").unwrap();
    let names_with_source = element
        .attributes
        .iter()
        .filter_map(|attr| match name_re.captures(&attr.name) {
            None => None,
            Some(caps) => {
                let source_doc: SourceDoc = match caps.name("source_doc") {
                    // if the attribute is `name`, then get `source_doc` from the element itself
                    None => element.source_doc.into(),
                    // if the attribute is `source-n:name`, where `n` is number, then `n` is the `source_doc`
                    Some(source_match) => source_match.as_str().try_into().unwrap(),
                };
                match (attr.children.len(), attr.children.first()) {
                    // A name attribute should have exactly one text child. Otherwise it is considered invalid.
                    (1, Some(UntaggedContent::Text(name))) => Some(NameWithSource {
                        name: name.to_string(),
                        source_doc,
                    }),
                    _ => None,
                }
            }
        })
        .collect::<Vec<_>>();
    names_with_source
}

/// If `node` has an attribute named `source:sequence`,
/// then parse its text children into `SourceDoc`s
/// and return the resulting vector.
///
/// Panics if `node` has an attribute named `source:sequence`
/// with text children that don't parse to integers.
fn extract_source_sequence(node: &FlatNode) -> Option<Vec<SourceDoc>> {
    match node {
        FlatNode::Error(_) => None,
        FlatNode::FunctionRef(_) => None,
        FlatNode::Ref(_) => None,
        FlatNode::Element(flat_element) => flat_element
            .attributes
            .iter()
            .find(|attr| attr.name == "source:sequence")
            .map(extract_source_sequence_from_attribute),
    }
}

fn extract_source_sequence_from_attribute(attr: &FlatAttribute) -> Vec<SourceDoc> {
    attr.children
        .iter()
        .filter_map(|child| match child {
            UntaggedContent::Ref(_) => None,
            UntaggedContent::Text(source_string) => {
                Some(source_string.as_str().try_into().unwrap())
            }
        })
        .collect()
}

#[cfg(test)]
#[path = "build_resolver.test.rs"]
mod test;

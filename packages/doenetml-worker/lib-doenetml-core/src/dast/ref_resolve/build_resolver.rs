use rustc_hash::FxHashMap;
use std::{iter, mem, ops::Range};

use crate::dast::flat_dast::{
    FlatElement, FlatFragment, FlatNode, FlatRoot, FlatRootOrFragment, UntaggedContent,
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
                        parent_search_algorithm: ParentSearchAlgorithm::DontSearchParent,
                        name_map: NameMap(mem::take(&mut name_map[0])),
                        index_resolutions: Vec::new(),
                    }
                } else {
                    let node = &flat_root.nodes[idx_plus_1 - 1];
                    NodeResolverData {
                        node_parent: node
                            .parent()
                            .map(NodeParent::Node)
                            .unwrap_or(NodeParent::FlatRoot),
                        parent_search_algorithm: ParentSearchAlgorithm::lookup_by_flat_node(node),
                        name_map: NameMap(mem::take(&mut name_map[idx_plus_1])),
                        index_resolutions: Vec::new(),
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
                    parent_search_algorithm: ParentSearchAlgorithm::SearchParent,
                    name_map: NameMap::default(),
                    index_resolutions: Vec::new(),
                },
                padding,
            ));
        }

        // Add parents and parent_search_algorithm for new nodes
        for node in flat_fragment.nodes.iter() {
            self.node_resolver_data[node.idx() + 1].node_parent =
                node.parent().map(NodeParent::Node).unwrap_or(parent_node);
            self.node_resolver_data[node.idx() + 1].parent_search_algorithm =
                ParentSearchAlgorithm::lookup_by_flat_node(node);
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
        for (name, node_idx, source_doc) in nodes.iter().filter_map(|node| {
            if let FlatNode::Element(element) = node {
                if let Some(name) = get_element_name(element) {
                    return Some((name, node.idx(), element.source_doc));
                }
            }
            None
        }) {
            let mut prev_parent_idx_plus_1 = node_idx + 1;
            let name_with_doenetml_id = NameWithDoenetMLId {
                name,
                source_doc: source_doc.into(),
            };

            loop {
                let parent_idx_plus_1 =
                    match self.node_resolver_data[prev_parent_idx_plus_1].node_parent {
                        NodeParent::None => break,
                        NodeParent::FlatRoot => 0,
                        NodeParent::Node(idx) => idx + 1,
                    };

                prev_parent_idx_plus_1 = parent_idx_plus_1;

                let name_map = &mut self.node_resolver_data[parent_idx_plus_1].name_map;

                let references = name_map.remove(&name_with_doenetml_id);

                match references {
                    Some(Ref::Unique(idx)) => {
                        // Note is is possible that `parent_idx` does not have an entry in the name map
                        // its descendant `node_idx`. This could happen if either
                        // 1. one of its descendants had a `DontSearchChildren` `ResolutionAlgorithm`, or
                        // 2. one of its descendants was added later by `add_nodes`.
                        // In this case, the unique index found might not match the deleted node `node_idx`,
                        // add we add the name back to the name map
                        if idx != node_idx {
                            name_map.insert(name_with_doenetml_id.clone(), Ref::Unique(idx));
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
                                .insert(name_with_doenetml_id.clone(), Ref::Unique(new_indices[0]));
                        } else {
                            name_map
                                .insert(name_with_doenetml_id.clone(), Ref::Ambiguous(new_indices));
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
    ) -> Vec<FxHashMap<NameWithDoenetMLId, Ref>> {
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
            let name = get_element_name(element);
            if name.is_none() {
                continue;
            }
            let name_with_origin = NameWithDoenetMLId {
                name: name.unwrap(),
                source_doc: element.source_doc.into(),
            };

            // Iterate through all ancestors of element,
            // including the base parent, if it exists

            let mut parents = flat_root_or_fragment
                .parent_iter(element.idx)
                .map(|parent| parent.idx + 1)
                .collect::<Vec<_>>();
            if let Some(idx) = base_parent_idx_plus_1 {
                parents.push(idx);
            }

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

            for parent_idx_plus_1 in parents {
                // if child is invisible, then do not add `element` (which is the child or its descendant)
                // to the name map of parent or more distant ancestors
                if matches!(child_visibility, Visibility::Invisible) {
                    break;
                }

                // Add `element` to the name map of `parent`, creating an ambiguous reference
                // if its name is already in the name map
                descendant_names[parent_idx_plus_1]
                    .get_mut(&name_with_origin)
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
                            .insert(name_with_origin.clone(), Ref::Unique(element.idx));
                    });

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

                // If the child is `InvisibleToGrandparents` do not add `element` (which is the child or its descendant)
                // to the name map of the parent's parent or more distant ancestors.
                if matches!(child_visibility, Visibility::InvisibleToGrandparents) {
                    break;
                }

                // The previous parent becomes the child for the next iteration
                child_visibility = parent_visibility;
            }
        }

        descendant_names
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
#[path = "build_resolver.test.rs"]
mod test;

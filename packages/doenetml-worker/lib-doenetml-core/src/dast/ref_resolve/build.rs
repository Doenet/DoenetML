use std::{collections::HashMap, iter, mem, ops::Range};

use crate::dast::flat_dast::{FlatFragment, FlatNode, FlatRoot, FlatRootOrFragment};

use super::{
    get_element_name, IndexResolution, NodeParent, NodeResolverData, Ref, ResolutionAlgorithm,
    Resolver, CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS,
};

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
                    }
                } else {
                    let node = &flat_root.nodes[idx_plus_1 - 1];
                    NodeResolverData {
                        node_parent: node
                            .parent()
                            .map(NodeParent::Node)
                            .unwrap_or(NodeParent::FlatRoot),
                        resolution_algorithm: ResolutionAlgorithm::lookup_by_flat_node(node),
                        name_map: mem::take(&mut name_map[idx_plus_1]),
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
                    resolution_algorithm: ResolutionAlgorithm::SearchChildren,
                    name_map: HashMap::new(),
                    index_resolutions: Vec::new(),
                },
                padding,
            ));
        }

        // Add parents and stop_propagation for new nodes
        for node in flat_fragment.nodes.iter() {
            self.node_resolver_data[node.idx() + 1].node_parent =
                node.parent().map(NodeParent::Node).unwrap_or(parent_node);
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
}

#[cfg(test)]
#[path = "build.test.rs"]
mod test;

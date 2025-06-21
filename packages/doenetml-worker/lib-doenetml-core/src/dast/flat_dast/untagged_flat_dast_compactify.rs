use crate::dast::ref_resolve::Resolver;

use super::{FlatNode, FlatRoot, Index, UntaggedContent};

impl FlatNode {
    /// Return every index that is referenced by this node.
    fn all_references(&self) -> Vec<Index> {
        match self {
            FlatNode::Element(elm) => Vec::from_iter(
                elm.children
                    .iter()
                    .filter_map(|node| match node {
                        UntaggedContent::Ref(idx) => Some(*idx),
                        _ => None,
                    })
                    .chain(elm.attributes.iter().flat_map(|attr| {
                        attr.children.iter().filter_map(|node| match node {
                            UntaggedContent::Ref(idx) => Some(*idx),
                            _ => None,
                        })
                    }))
                    .chain(elm.extending.iter().flat_map(|extending| {
                        extending
                            .get_resolution()
                            .unresolved_path
                            .iter()
                            .flat_map(|path| {
                                path.iter().flat_map(|path_part| {
                                    path_part.index.iter().flat_map(|index| {
                                        index.value.iter().flat_map(|node| match node {
                                            UntaggedContent::Ref(idx) => Some(*idx),
                                            _ => None,
                                        })
                                    })
                                })
                            })
                    })),
            ),
            FlatNode::FunctionRef(function_ref) => {
                if let Some(inputs) = &function_ref.input {
                    inputs
                        .iter()
                        .flat_map(|inputs| {
                            inputs.iter().filter_map(|node| match node {
                                UntaggedContent::Ref(idx) => Some(*idx),
                                _ => None,
                            })
                        })
                        .collect()
                } else {
                    vec![]
                }
            }
            _ => vec![],
        }
    }

    /// Given `ref_index_map`, which is a vector of old indices to new indices,
    /// rewrite all `Ref` nodes to point to the new indices.
    fn shift_references(&mut self, ref_index_map: &[Index]) {
        match self {
            FlatNode::Element(elm) => {
                for child in elm.children.iter_mut() {
                    if let UntaggedContent::Ref(idx) = child {
                        *idx = ref_index_map[*idx];
                    }
                }
                for attr in elm.attributes.iter_mut() {
                    for child in attr.children.iter_mut() {
                        if let UntaggedContent::Ref(idx) = child {
                            *idx = ref_index_map[*idx];
                        }
                    }
                    // Fix the attribute parent ref
                    attr.parent = attr.parent.map(|idx| ref_index_map[idx]);
                }
                // Fix the element parent ref
                elm.parent = elm.parent.map(|idx| ref_index_map[idx]);
                // Fix the element's internal idx
                elm.idx = ref_index_map[elm.idx];

                // An element may have a special `extending` property that also needs fixing.
                if let Some(extending) = &mut elm.extending {
                    let new_idx = ref_index_map[extending.idx()];
                    extending.set_idx(new_idx);

                    // extending might also have indices that are references that also need fixing.
                    let resolution = extending.get_resolution_mut();
                    resolution
                        .unresolved_path
                        .iter_mut()
                        .flatten()
                        .for_each(|path_part| {
                            path_part.index.iter_mut().for_each(|index| {
                                index.value.iter_mut().for_each(|node| {
                                    if let UntaggedContent::Ref(idx) = node {
                                        *idx = ref_index_map[*idx];
                                    }
                                })
                            });
                        });
                    resolution.original_path.iter_mut().for_each(|path_part| {
                        path_part.index.iter_mut().for_each(|index| {
                            index.value.iter_mut().for_each(|node| {
                                if let UntaggedContent::Ref(idx) = node {
                                    *idx = ref_index_map[*idx];
                                }
                            })
                        });
                    });
                    resolution
                        .nodes_in_resolved_path
                        .iter_mut()
                        .for_each(|idx| *idx = ref_index_map[*idx]);
                }
            }
            FlatNode::FunctionRef(function_ref) => {
                if let Some(inputs) = &mut function_ref.input {
                    for inputs in inputs.iter_mut() {
                        for child in inputs.iter_mut() {
                            if let UntaggedContent::Ref(idx) = child {
                                *idx = ref_index_map[*idx];
                            }
                        }
                    }
                }
                if let Some(parent) = &mut function_ref.parent {
                    *parent = ref_index_map[*parent];
                }
                function_ref.idx = ref_index_map[function_ref.idx];
            }
            FlatNode::Ref(ref_) => {
                if let Some(parent) = &mut ref_.parent {
                    *parent = ref_index_map[*parent];
                }
                ref_.idx = ref_index_map[ref_.idx];
            }
            FlatNode::Error(err) => {
                if let Some(parent) = &mut err.parent {
                    *parent = ref_index_map[*parent];
                }
                err.idx = ref_index_map[err.idx];
            }
        }
    }
}

impl FlatRoot {
    /// Remove any unreferenced nodes and shrink the `nodes` array to fit.
    /// Indices are adjusted to reflect the new positions of the nodes.
    pub fn compactify(&mut self, resolver: Option<&mut Resolver>) {
        let mut is_referenced: Vec<bool> = std::iter::repeat_n(false, self.nodes.len()).collect();
        let mut to_visit = self
            .children
            .iter()
            .filter_map(|node| match node {
                UntaggedContent::Ref(idx) => Some(*idx),
                _ => None,
            })
            .collect::<Vec<_>>();
        while let Some(idx) = to_visit.pop() {
            // Don't visit a node's children more than once.
            // This shouldn't ever happen if the children form a _tree_, but this
            // allows the algorithm to work on an arbitrary graph.
            if is_referenced[idx] {
                continue;
            }
            is_referenced[idx] = true;
            let node = &self.nodes[idx];
            to_visit.extend(node.all_references());
        }

        // If every node is referenced, we don't need to do anything.
        if is_referenced.iter().all(|b| *b) {
            return;
        }

        // We are going to trim all the nodes that are not referenced.
        // We make a map of old indices to new indices.
        let mut current_shift = 0;
        let old_to_new_indices_prelim = is_referenced
            .iter()
            .enumerate()
            .map(|(old_idx, is_referenced)| {
                let ret = old_idx - current_shift;
                if !*is_referenced {
                    current_shift += 1;
                }
                ret
            })
            .collect::<Vec<_>>();

        // We need to handle the special case of a reference inside the index of an extend attribute,
        // for example the `$n` in: `<math extend="$m[$n]" />`.
        // In this case, the outer reference `$m` will be removed but the inner reference `$n` stays.
        // The parent of `$n` was originally the index of `$m`; it needs to be shifted to the index of the parent `$m`.
        // To accomplish this, we map references of removed nodes to their parents,
        // recursing if parent is also removed
        let old_to_new_indices = old_to_new_indices_prelim
            .iter()
            .enumerate()
            .map(|(old_idx, new_idx)| {
                if is_referenced[old_idx] {
                    *new_idx
                } else {
                    let mut parent = self.nodes[old_idx].parent();
                    while parent.is_some_and(|idx| !is_referenced[idx]) {
                        parent = self.nodes[parent.unwrap()].parent();
                    }
                    // if a removed element doesn't have a parent, set it to the document root
                    old_to_new_indices_prelim[parent.unwrap_or_default()]
                }
            })
            .collect::<Vec<_>>();

        self.nodes.retain(|node| is_referenced[node.idx()]);

        // Shift the indices of all nodes and the references of the root node
        self.nodes
            .iter_mut()
            .for_each(|node| node.shift_references(&old_to_new_indices));
        self.children.iter_mut().for_each(|node| {
            if let UntaggedContent::Ref(idx) = node {
                *idx = old_to_new_indices[*idx];
            }
        });

        if let Some(resolve) = resolver {
            resolve.compactify(&is_referenced, &old_to_new_indices);
        }
    }
}

#[cfg(test)]
#[path = "untagged_flat_dast_compactify.test.rs"]
mod test;

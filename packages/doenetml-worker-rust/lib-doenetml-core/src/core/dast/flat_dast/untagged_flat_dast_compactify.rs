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
                    })),
            ),
            FlatNode::FunctionMacro(function_macro) => {
                if let Some(inputs) = &function_macro.input {
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
                }
                if let Some(parent) = &mut elm.parent {
                    *parent = ref_index_map[*parent];
                }
            }
            FlatNode::FunctionMacro(function_macro) => {
                if let Some(inputs) = &mut function_macro.input {
                    for inputs in inputs.iter_mut() {
                        for child in inputs.iter_mut() {
                            if let UntaggedContent::Ref(idx) = child {
                                *idx = ref_index_map[*idx];
                            }
                        }
                    }
                }
                if let Some(parent) = &mut function_macro.parent {
                    *parent = ref_index_map[*parent];
                }
            }
            FlatNode::Macro(macro_) => {
                if let Some(parent) = &mut macro_.parent {
                    *parent = ref_index_map[*parent];
                }
            }
            FlatNode::Error(err) => {
                if let Some(parent) = &mut err.parent {
                    *parent = ref_index_map[*parent];
                }
            }
        }
    }
}

impl FlatRoot {
    /// Remove any unreferenced nodes and shrink the `nodes` array to fit.
    /// Indices are adjusted to reflect the new positions of the nodes.
    pub fn compactify(&mut self) {
        let mut is_referenced: Vec<bool> =
            std::iter::repeat(false).take(self.nodes.len()).collect();
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
        let old_to_new_indices = is_referenced
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

        // Shift the indices of all nodes and the references of the root node
        self.nodes
            .iter_mut()
            .for_each(|node| node.shift_references(&old_to_new_indices));
        self.children.iter_mut().for_each(|node| {
            if let UntaggedContent::Ref(idx) = node {
                *idx = old_to_new_indices[*idx];
            }
        });

        // Make sure that the locally stored index on each node is correct.
        // A node may have an inconsistent index if it was manually inserted.
        self.recompute_indices();
        self.nodes.retain(|node| is_referenced[node.idx()]);

        // Clean up the indices of the nodes
        self.recompute_indices();
        self.recompute_parents();
    }

    /// Make sure that every node has an index equal to its position in the `nodes`
    /// array. This is used for ensuring a consistent state after manual manipulation.
    fn recompute_indices(&mut self) {
        self.nodes.iter_mut().enumerate().for_each(|(idx, node)| {
            node.set_idx(idx);
        });
    }

    /// Recompute the parent of each node. Only nodes that are reachable from `self.children`
    /// are considered. This is used to ensure consistency after manual manipulation.
    fn recompute_parents(&mut self) {
        struct Pair {
            ref_idx: Index,
            parent: Option<Index>,
        }
        let mut stack = Vec::from_iter(self.children.iter().filter_map(|child| match child {
            UntaggedContent::Ref(idx) => Some(Pair {
                ref_idx: *idx,
                parent: None,
            }),
            _ => None,
        }));
        while let Some(pair) = stack.pop() {
            let node = &mut self.nodes[pair.ref_idx];
            node.set_parent(pair.parent);
            stack.extend(node.all_references().iter().map(|idx| Pair {
                ref_idx: *idx,
                parent: Some(pair.ref_idx),
            }));
        }
    }
}

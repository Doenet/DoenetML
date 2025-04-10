use super::untagged_flat_dast::{FlatElement, FlatNode, FlatRoot, Index};

/// An iterator that iterates over the parent elements of a node.
/// If a non-element parent is encountered, the iterator will panic.
pub struct ParentIterator<'a> {
    start_node: Option<&'a FlatNode>,
    current_element: Option<&'a FlatElement>,
    flat_root: &'a FlatRoot,
}

impl<'a> ParentIterator<'a> {
    pub fn new(start: &'a FlatNode, flat_root: &'a FlatRoot) -> Self {
        ParentIterator {
            start_node: Some(start),
            current_element: None,
            flat_root,
        }
    }
}

impl<'a> Iterator for ParentIterator<'a> {
    type Item = &'a FlatElement;

    fn next(&mut self) -> Option<Self::Item> {
        let unwrap_parent_index = |idx: Index| {
            let parent = &self.flat_root.nodes[idx];
            if let FlatNode::Element(parent) = parent {
                parent
            } else {
                panic!("Parent of node is not an element")
            }
        };

        // If we have a start node, we look for its parent.
        if let Some(start) = self.start_node.take() {
            let parent_idx: Option<Index> = start.parent();
            let parent = parent_idx.map(unwrap_parent_index);
            self.current_element = parent;
            parent
        } else {
            let parent = self
                .current_element
                .and_then(|e| e.parent)
                .map(unwrap_parent_index);
            self.current_element = parent;
            parent
        }
    }
}

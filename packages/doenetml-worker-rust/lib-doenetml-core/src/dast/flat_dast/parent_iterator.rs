use super::{
    FlatRootOrFragment,
    untagged_flat_dast::{FlatElement, FlatNode, Index},
};

/// An iterator that iterates over the parent elements of a node.
///
/// A node's parent is not always an element. Content that a reference owns is
/// parented to the reference itself rather than to any element: what is written
/// between its index brackets, as in `$myList[<indexOf …/>]` (see
/// `dast_path_to_flat_path`), and what is written as a function reference's
/// argument, as in `$$f(<math>3</math>)` (see `set_function_ref_input`). Such a
/// node is stepped over: the ancestors of something written inside a reference are
/// the ancestors of that reference, which is what lets a name written in an index
/// resolve from the surrounding document.
pub struct ParentIterator<'a> {
    start_node: Option<&'a FlatNode>,
    current_element: Option<&'a FlatElement>,
    flat_root_or_fragment: &'a FlatRootOrFragment<'a>,
    stop_idx: Option<Index>,
}

impl<'a> ParentIterator<'a> {
    pub fn new(
        start: &'a FlatNode,
        flat_root_or_fragment: &'a FlatRootOrFragment,
        stop_idx: Option<Index>,
    ) -> Self {
        ParentIterator {
            start_node: Some(start),
            current_element: None,
            flat_root_or_fragment,
            stop_idx,
        }
    }
}

impl<'a> Iterator for ParentIterator<'a> {
    type Item = &'a FlatElement;

    fn next(&mut self) -> Option<Self::Item> {
        // If we have a start node, we look for its parent; otherwise we carry on
        // from the element we last returned.
        let mut next_idx: Option<Index> = match self.start_node.take() {
            Some(start) => start.parent(),
            None => self.current_element.and_then(|e| e.parent),
        };

        loop {
            let Some(idx) = next_idx else {
                self.current_element = None;
                return None;
            };
            if let Some(stop_idx) = self.stop_idx
                && idx == stop_idx
            {
                self.current_element = None;
                return None;
            }
            match self.flat_root_or_fragment.get_node(idx) {
                FlatNode::Element(parent) => {
                    self.current_element = Some(parent);
                    return Some(parent);
                }
                // A reference, function reference or error that owns this node as
                // its content. It is not an ancestor element itself, so keep
                // climbing from where it sits.
                non_element => {
                    next_idx = non_element.parent();
                }
            }
        }
    }
}

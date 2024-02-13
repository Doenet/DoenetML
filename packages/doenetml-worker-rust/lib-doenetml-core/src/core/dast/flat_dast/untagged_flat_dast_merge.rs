use crate::dast::{
    DastElement, DastElementContent, DastError, DastFunctionRef, DastRef, DastRoot,
    DastTextRefContent,
};

use super::{
    FlatAttribute, FlatElement, FlatError, FlatFunctionRef, FlatRef, FlatNode, FlatRoot, Index,
    ParentIterator, UntaggedContent,
};

impl FlatRoot {
    /// Create a new `FlatRoot` from a `DastRoot`.
    pub fn from_dast(dast: &DastRoot) -> Self {
        let mut flat = Self::new();
        flat.merge_dast_root(dast);
        flat
    }

    /// Iterate over the parent elements of a node.
    /// If for some reason the node has a non-element parent, the iterator will panic.
    pub fn parent_iter(&self, start_idx: Index) -> ParentIterator {
        let start = &self.nodes[start_idx];
        ParentIterator::new(start, self)
    }

    /// Merge the content of a `DastRoot` into `FlatRoot`.
    /// This function recursively adds all children etc. of the `DastRoot`.
    pub fn merge_dast_root(&mut self, dast: &DastRoot) {
        for child in dast.children.iter() {
            self.merge_content(child, None);
        }
    }

    /// Update the the node at `idx` to be `node`. Any children of `node` are added to the `FlatRoot` as well,
    /// but children of the old node are not removed. This function does no consistency checking, so it is
    /// the _caller should be extra careful to_
    ///  - Ensure `idx` on the node is set correctly.
    ///  - Ensure `parent` on the node is set correctly.
    pub fn update_content(
        &mut self,
        node: &DastElementContent,
        idx: Index,
        parent: Option<Index>,
    ) -> UntaggedContent {
        match node {
            DastElementContent::Element(elm) => {
                self.set_element(elm, idx, parent);
                let ret = UntaggedContent::Ref(idx);
                // Newly set elements have empty children and attributes. It is our
                // job to fill them in.
                let children = elm
                    .children
                    .iter()
                    .map(|child| self.merge_content(child, Some(idx)))
                    .collect();
                let attributes: Vec<FlatAttribute> = elm
                    .attributes
                    .values()
                    .map(|attr| {
                        let children = attr
                            .children
                            .iter()
                            .map(|child| match child {
                                DastTextRefContent::Text(txt) => {
                                    DastElementContent::Text(txt.clone())
                                }
                                DastTextRefContent::Ref(ref_) => {
                                    DastElementContent::Ref(ref_.clone())
                                }
                                DastTextRefContent::FunctionRef(function_ref) => {
                                    DastElementContent::FunctionRef(function_ref.clone())
                                }
                            })
                            .map(|child| self.merge_content(&child, Some(idx)))
                            .collect();
                        FlatAttribute {
                            name: attr.name.clone(),
                            parent: Some(idx),
                            children,
                            position: attr.position.clone(),
                        }
                    })
                    .collect();
                self.set_children(idx, children);
                self.set_attributes(idx, attributes);
                ret
            }
            DastElementContent::Error(err) => {
                UntaggedContent::Ref(self.set_error(err, idx, parent))
            }
            DastElementContent::Text(txt) => UntaggedContent::Text(txt.value.clone()),
            DastElementContent::Ref(ref_) => {
                UntaggedContent::Ref(self.set_ref(ref_, idx, parent))
            }
            DastElementContent::FunctionRef(function_ref) => {
                self.set_function_ref(function_ref, idx, parent);
                let ret = UntaggedContent::Ref(idx);
                if let Some(input) = function_ref.input.as_ref() {
                    let input: Vec<Vec<UntaggedContent>> = input
                        .iter()
                        .map(|arg| {
                            arg.iter()
                                .map(|arg| self.merge_content(arg, Some(idx)))
                                .collect()
                        })
                        .collect();

                    self.set_function_ref_input(idx, input);
                }
                ret
            }
        }
    }

    /// Merge DAST content into `FlatRoot`.
    pub fn merge_content(
        &mut self,
        node: &DastElementContent,
        parent: Option<Index>,
    ) -> UntaggedContent {
        let ret = match node {
            DastElementContent::Text(_) => {
                // A text node doesn't get pushed to `nodes`, so the value of `idx` doesn't matter.
                // We pass in `Index::MAX` so that an error will be thrown if this value is used.
                self.update_content(node, Index::MAX, parent)
            }
            _ => {
                // We push an error onto the nodes stack and then we do an in-place update of
                // that error to the correct node. This avoids code duplication.
                let idx = self.nodes.len();
                self.nodes.push(FlatNode::Error(FlatError::with_message(
                    "TEMPORARY NODE CREATED DURING `merge_content()`".to_string(),
                    idx,
                )));
                self.update_content(node, idx, parent)
            }
        };

        if parent.is_none() {
            self.children.push(ret.clone());
        }
        ret
    }

    /// Set the children of an element node.
    pub fn set_children(&mut self, idx: usize, children: Vec<UntaggedContent>) {
        match &mut self.nodes[idx] {
            FlatNode::Element(elm) => {
                elm.children = children;
            }
            _ => panic!("set_children called on non-element node"),
        }
    }

    /// Set the attributes of an element node.
    fn set_attributes(&mut self, idx: usize, attributes: Vec<FlatAttribute>) {
        match &mut self.nodes[idx] {
            FlatNode::Element(elm) => {
                elm.attributes = attributes;
            }
            _ => panic!("set_attributes called on non-element node"),
        }
    }

    /// Set the input of a function ref node.
    fn set_function_ref_input(&mut self, idx: usize, args: Vec<Vec<UntaggedContent>>) {
        match &mut self.nodes[idx] {
            FlatNode::FunctionRef(func_ref) => {
                func_ref.input = Some(args);
            }
            _ => panic!("set_function_ref_args called on non-function-ref node"),
        }
    }

    /// Set the node at `idx` to be an element with the same name and position as `node`.
    /// The element will be initialized with empty children and attributes.
    fn set_element(&mut self, node: &DastElement, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Element(FlatElement {
            name: node.name.clone(),
            children: Vec::new(),
            attributes: Vec::new(),
            position: node.position.clone(),
            parent,
            idx,
            // It is impossible to directly set `extending` in DAST; it is computed later.
            extending: None,
        });
        idx
    }

    /// Set the node at `idx` to be the specified error.
    fn set_error(&mut self, node: &DastError, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Error(FlatError {
            message: node.message.clone(),
            position: node.position.clone(),
            parent,
            idx,
        });
        idx
    }

    /// Set the node at `idx` to be the specified ref.
    fn set_ref(&mut self, node: &DastRef, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Ref(FlatRef {
            path: node.path.clone(),
            position: node.position.clone(),
            parent,
            idx,
        });
        idx
    }

    /// Set the node at `idx` to be the specified function ref.
    fn set_function_ref(
        &mut self,
        node: &DastFunctionRef,
        idx: Index,
        parent: Option<Index>,
    ) -> usize {
        self.nodes[idx] = FlatNode::FunctionRef(FlatFunctionRef {
            path: node.path.clone(),
            input: None,
            position: node.position.clone(),
            parent,
            idx,
        });
        idx
    }
}

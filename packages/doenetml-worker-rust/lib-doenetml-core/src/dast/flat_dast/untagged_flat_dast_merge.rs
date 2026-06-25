use crate::dast::{
    DastElement, DastElementContent, DastError, DastFunctionRef, DastRef, DastRoot,
    DastTextRefElementContent, PathPart, Position,
};

use super::{
    FlatAttribute, FlatElement, FlatError, FlatFunctionRef, FlatIndex, FlatNode, FlatPathPart,
    FlatRef, FlatRoot, Index, UntaggedContent,
};

impl FlatRoot {
    /// Create a new `FlatRoot` from a `DastRoot`.
    pub fn from_dast(dast: &DastRoot) -> Self {
        let mut flat = Self::new();
        flat.sources = dast.sources.clone();
        flat.merge_dast_root(dast);
        flat
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
                                DastTextRefElementContent::Text(txt) => {
                                    DastElementContent::Text(txt.clone())
                                }
                                DastTextRefElementContent::Ref(ref_) => {
                                    DastElementContent::Ref(ref_.clone())
                                }
                                DastTextRefElementContent::FunctionRef(function_ref) => {
                                    DastElementContent::FunctionRef(function_ref.clone())
                                }
                                DastTextRefElementContent::Element(element) => {
                                    DastElementContent::Element(element.clone())
                                }
                            })
                            .map(|child| self.merge_content(&child, Some(idx)))
                            .collect();
                        FlatAttribute {
                            name: attr.name.clone(),
                            parent: Some(idx),
                            children,
                            position: attr.position.clone(),
                            source_doc: attr.source_doc,
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
            DastElementContent::Ref(ref_) => UntaggedContent::Ref(self.set_ref(ref_, idx, parent)),
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

    /// Set the node at `idx` to be an element with the same name, position and source_doc as `node`.
    /// The element will be initialized with empty children and attributes.
    fn set_element(&mut self, node: &DastElement, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Element(FlatElement {
            name: node.name.clone(),
            children: Vec::new(),
            attributes: Vec::new(),
            position: node.position.clone(),
            source_doc: node.source_doc,
            // Calculate the position of the vector of children before the position of text nodes is discarded
            children_position: node.children.iter().fold(None::<Position>, |acc, x| {
                if let Some(pos) = acc {
                    let mut new_pos = pos.clone();
                    if let Some(child_pos) = x.position() {
                        new_pos.end = child_pos.end.clone()
                    }
                    Some(new_pos)
                } else {
                    x.position().cloned()
                }
            }),
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
            unresolved_path: None,
            error_type: node.error_type.unwrap_or_default(),
            position: node.position.clone(),
            source_doc: node.source_doc,
            parent,
            idx,
        });
        idx
    }

    /// Convert PathParts from dast to FlatPathParts, adding nodes to the flat root
    fn dast_path_to_flat_path(
        &mut self,
        dast_path: &[PathPart],
        parent_idx: Index,
    ) -> Vec<FlatPathPart> {
        dast_path
            .iter()
            .map(|path_part| {
                let index: Vec<FlatIndex> = path_part
                    .index
                    .iter()
                    .map(|dast_index| {
                        let value: Vec<UntaggedContent> = dast_index
                            .value
                            .iter()
                            .map(|val| match val {
                                DastTextRefElementContent::Text(txt) => {
                                    DastElementContent::Text(txt.clone())
                                }
                                DastTextRefElementContent::Ref(ref_) => {
                                    DastElementContent::Ref(ref_.clone())
                                }
                                DastTextRefElementContent::FunctionRef(function_ref) => {
                                    DastElementContent::FunctionRef(function_ref.clone())
                                }
                                DastTextRefElementContent::Element(element) => {
                                    DastElementContent::Element(element.clone())
                                }
                            })
                            .map(|val| self.merge_content(&val, Some(parent_idx)))
                            .collect();
                        FlatIndex {
                            value,
                            position: dast_index.position.clone(),
                            source_doc: dast_index.source_doc,
                        }
                    })
                    .collect();
                FlatPathPart {
                    name: path_part.name.clone(),
                    index,
                    position: path_part.position.clone(),
                    source_doc: path_part.source_doc,
                }
            })
            .collect()
    }

    /// Set the node at `idx` to be the specified ref.
    fn set_ref(&mut self, node: &DastRef, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Ref(FlatRef {
            path: self.dast_path_to_flat_path(&node.path, idx),
            position: node.position.clone(),
            source_doc: node.source_doc,
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
            path: self.dast_path_to_flat_path(&node.path, idx),
            input: None,
            position: node.position.clone(),
            source_doc: node.source_doc,
            parent,
            idx,
        });
        idx
    }
}

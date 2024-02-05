//! UntaggedFlatDast is part of the DAST normalization process where the DAST is flattened and all
//! element/macro/etc. nodes are replaced with untagged references to their location in the nodes list.
//! UntaggedFlatDast allows elements to change type without having to find all places where they are referenced.

use serde::Serialize;

use crate::dast::{DastElementContent, DastTextMacroContent};

use super::{
    macro_resolve::RefResolution, DastElement, DastError, DastFunctionMacro, DastMacro, DastRoot,
    PathPart, Position,
};

pub type Index = usize;

#[derive(Clone, Debug, Serialize)]
#[serde(untagged)]
pub enum UntaggedContent {
    Text(String),
    Ref(Index),
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatElement {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub children: Vec<UntaggedContent>,
    pub attributes: Vec<FlatAttribute>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    pub idx: Index,
    /// Information about the referent that this element extends (e.g., as specified by the `extend` attribute).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extending: Option<RefResolution>,
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatAttribute {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub children: Vec<UntaggedContent>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatError {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    pub idx: Index,
}

impl FlatError {
    pub fn with_message(message: String, idx: Index) -> Self {
        Self {
            parent: None,
            message,
            position: None,
            idx,
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatMacro {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub path: Vec<PathPart>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    pub idx: Index,
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatFunctionMacro {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub path: Vec<PathPart>,
    pub input: Option<Vec<Vec<UntaggedContent>>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    pub idx: Index,
}

/// Objects that can be store in the main `nodes` array of a `FlatRoot`.
#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
pub enum FlatNode {
    Element(FlatElement),
    Error(FlatError),
    FunctionMacro(FlatFunctionMacro),
    Macro(FlatMacro),
}

impl Default for FlatNode {
    fn default() -> Self {
        FlatNode::Error(FlatError {
            parent: None,
            message: "DEFAULT NODE".to_string(),
            position: None,
            idx: 0,
        })
    }
}

impl FlatNode {
    /// Get the index of the node.
    pub fn idx(&self) -> Index {
        match self {
            FlatNode::Element(e) => e.idx,
            FlatNode::Error(e) => e.idx,
            FlatNode::FunctionMacro(e) => e.idx,
            FlatNode::Macro(e) => e.idx,
        }
    }
    /// Get the index of the parent of the node.
    pub fn parent(&self) -> Option<Index> {
        match self {
            FlatNode::Element(e) => e.parent,
            FlatNode::Error(e) => e.parent,
            FlatNode::FunctionMacro(e) => e.parent,
            FlatNode::Macro(e) => e.parent,
        }
    }
}

/// Untagged version of a Flattened DAST. All elements/errors/macros/function macros are stored in
/// the `nodes` vec. All children of all elements/attributes are vectors of text or references to
/// positions in the `nodes` vec.
///
/// These references are untagged, so the type of each node may be mutated and the reference remains valid.
#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
pub struct FlatRoot {
    pub children: Vec<UntaggedContent>,
    pub nodes: Vec<FlatNode>,
}

impl FlatRoot {
    pub fn new() -> Self {
        Self {
            children: Vec::new(),
            nodes: Vec::new(),
        }
    }

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
    /// the _caller should be extra careful_.
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
                                DastTextMacroContent::Text(txt) => {
                                    DastElementContent::Text(txt.clone())
                                }
                                DastTextMacroContent::Macro(macro_) => {
                                    DastElementContent::Macro(macro_.clone())
                                }
                                DastTextMacroContent::FunctionMacro(function_macro) => {
                                    DastElementContent::FunctionMacro(function_macro.clone())
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
                let ret = UntaggedContent::Ref(self.set_error(err, idx, parent));
                if parent.is_none() {
                    self.children.push(ret.clone());
                }
                ret
            }
            DastElementContent::Text(txt) => UntaggedContent::Text(txt.value.clone()),
            DastElementContent::Macro(macro_) => {
                UntaggedContent::Ref(self.set_macro(macro_, idx, parent))
            }
            DastElementContent::FunctionMacro(function_macro) => {
                self.set_function_macro(function_macro, idx, parent);
                let ret = UntaggedContent::Ref(idx);
                if let Some(input) = function_macro.input.as_ref() {
                    let input: Vec<Vec<UntaggedContent>> = input
                        .iter()
                        .map(|arg| {
                            arg.iter()
                                .map(|arg| self.merge_content(arg, Some(idx)))
                                .collect()
                        })
                        .collect();

                    self.set_function_macro_input(idx, input);
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

    /// Set the input of a function macro node.
    fn set_function_macro_input(&mut self, idx: usize, args: Vec<Vec<UntaggedContent>>) {
        match &mut self.nodes[idx] {
            FlatNode::FunctionMacro(func_macro) => {
                func_macro.input = Some(args);
            }
            _ => panic!("set_function_macro_args called on non-function-macro node"),
        }
    }

    /// Set the node at position `idx` to be the specified element.
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

    /// Set the node at position `idx` to be the specified error.
    fn set_error(&mut self, node: &DastError, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Error(FlatError {
            message: node.message.clone(),
            position: node.position.clone(),
            parent,
            idx,
        });
        idx
    }

    /// Set the node at position `idx` to be the specified macro.
    fn set_macro(&mut self, node: &DastMacro, idx: Index, parent: Option<Index>) -> usize {
        self.nodes[idx] = FlatNode::Macro(FlatMacro {
            path: node.path.clone(),
            position: node.position.clone(),
            parent,
            idx,
        });
        idx
    }

    /// Set the node at position `idx` to be the specified function macro.
    fn set_function_macro(
        &mut self,
        node: &DastFunctionMacro,
        idx: Index,
        parent: Option<Index>,
    ) -> usize {
        self.nodes[idx] = FlatNode::FunctionMacro(FlatFunctionMacro {
            path: node.path.clone(),
            input: None,
            position: node.position.clone(),
            parent,
            idx,
        });
        idx
    }

    /// Convert the `FlatRoot` to an XML string. This function should not be relied upon to create
    /// valid XML. It is intended for debugging and testing.
    pub fn to_xml(&self) -> String {
        let nodes = &self.nodes;
        fn node_to_xml(nodes: &[FlatNode], node: &UntaggedContent) -> String {
            match node {
                UntaggedContent::Text(txt) => txt.into(),
                UntaggedContent::Ref(idx) => {
                    let node = &nodes[*idx];
                    match node {
                        FlatNode::Element(elm) => {
                            let children = String::from_iter(
                                elm.children.iter().map(|c| node_to_xml(nodes, c)),
                            );
                            // attributes are printed with a space in front, so we can join them with a space
                            let mut attrs: Vec<String> = elm
                                .attributes
                                .iter()
                                .map(|a| attribute_to_xml(nodes, a))
                                .collect();
                            // Attributes are sorted to ensure stable printing
                            attrs.sort();
                            let attributes = attrs.join("");
                            if children.is_empty() {
                                format!("<{}{} />", elm.name, attributes)
                            } else {
                                format!("<{}{}>{}</{}>", elm.name, attributes, children, elm.name)
                            }
                        }
                        FlatNode::Error(err) => format!("<_error message=\"{}\"/>", err.message),
                        FlatNode::Macro(_macro_) => "[MACRO PRINTING NOT IMPLEMENTED]".to_string(),
                        FlatNode::FunctionMacro(_function_macro) => {
                            "[FUNCTION MACRO PRINTING NOT IMPLEMENTED]".to_string()
                        }
                    }
                }
            }
        }
        fn attribute_to_xml(nodes: &[FlatNode], attr: &FlatAttribute) -> String {
            let children = attr
                .children
                .iter()
                .map(|c| node_to_xml(nodes, c))
                .collect::<Vec<_>>()
                .join("");
            format!(" {}=\"{}\"", attr.name, children)
        }
        String::from_iter(self.children.iter().map(|c| node_to_xml(nodes, c)))
    }
}

impl Default for FlatRoot {
    fn default() -> Self {
        Self::new()
    }
}

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

#[cfg(test)]
#[path = "untagged_flat_dast.test.rs"]
mod test;

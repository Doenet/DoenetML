//! UntaggedFlatDast is part of the DAST normalization process where the DAST is flattened and all
//! element/macro/etc. nodes are replaced with untagged references to their location in the nodes list.
//! UntaggedFlatDast allows elements to change type without having to find all places where they are referenced.

use serde::Serialize;

use super::super::{macro_resolve::RefResolution, PathPart, Position};

pub use super::parent_iterator::ParentIterator;

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

/// Objects that can be stored in the main `nodes` array of a `FlatRoot`.
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

    /// Set the index of `self` to `idx`
    pub fn set_idx(&mut self, idx: Index) {
        match self {
            FlatNode::Element(e) => e.idx = idx,
            FlatNode::Error(e) => e.idx = idx,
            FlatNode::FunctionMacro(e) => e.idx = idx,
            FlatNode::Macro(e) => e.idx = idx,
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
}

impl Default for FlatRoot {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[path = "untagged_flat_dast.test.rs"]
mod test;

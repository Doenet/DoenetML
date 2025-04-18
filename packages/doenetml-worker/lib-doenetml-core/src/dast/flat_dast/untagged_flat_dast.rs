//! `UntaggedFlatDast` is part of the DAST normalization process where the DAST is flattened and all
//! element/ref/etc. nodes are replaced with untagged references to their location in the nodes list.
//! `UntaggedFlatDast` allows elements to change type without having to find all places where they are referenced.

use serde::Serialize;
use tsify_next::{declare, Tsify};

use super::{
    super::{ref_resolve::RefResolution, Position},
    normalized_flat_dast::{NormalizedNode, NormalizedRoot},
};

pub use super::parent_iterator::ParentIterator;

#[declare]
pub type Index = usize;

#[derive(Clone, Debug, Serialize)]
#[serde(untagged)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum UntaggedContent {
    Text(String),
    Ref(Index),
}

/// A designation of whether the source of `T`
/// was from inside the `extend` attribute
/// or was from a direct reference that was not inside the `extend` attribute.
#[derive(Clone, Debug, Serialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum Source<T> {
    Attribute(T),
    Ref(T),
}

impl<T> Source<T> {
    /// Recast `self` as `Self::Attribute`, indicating that it came from inside the `extend` attribute.
    pub fn as_attribute(self) -> Self {
        match self {
            Source::Attribute(_) => self,
            Source::Ref(m) => Source::Attribute(m),
        }
    }
    /// Returns whether `self` is an `Attribute` variant.
    pub fn is_attribute(&self) -> bool {
        matches!(self, Source::Attribute(_))
    }
    /// Returns whether `self` is a `Ref` variant.
    pub fn is_ref(&self) -> bool {
        matches!(self, Source::Ref(_))
    }
}

impl Source<RefResolution> {
    pub fn idx(&self) -> Index {
        match self {
            Source::Attribute(a) => a.node_idx,
            Source::Ref(m) => m.node_idx,
        }
    }

    /// Set the `node_idx` of the wrapped `RefResolution`.
    pub fn set_idx(&mut self, idx: Index) {
        match self {
            Source::Attribute(a) => a.node_idx = idx,
            Source::Ref(m) => m.node_idx = idx,
        }
    }

    /// Unwraps the `RefResolution` from `self`.
    pub fn get_resolution(&self) -> &RefResolution {
        match self {
            Source::Attribute(a) => a,
            Source::Ref(m) => m,
        }
    }

    /// Similar to `get_resolution`, but consumes `self` and returns the `RefResolution`.
    pub fn take_resolution(self) -> RefResolution {
        match self {
            Source::Attribute(a) => a,
            Source::Ref(m) => m,
        }
    }
}

#[derive(Clone, Debug, Serialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
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
    pub extending: Option<Source<RefResolution>>,
}

#[derive(Clone, Debug, Serialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatAttribute {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub children: Vec<UntaggedContent>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Clone, Debug, Serialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
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

/// A part of a ref path
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatPathPart {
    pub name: String,
    pub index: Vec<FlatIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// An index into a ref path
#[derive(Debug, Clone, Serialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatIndex {
    pub value: Vec<UntaggedContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatRef {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub path: Vec<FlatPathPart>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    pub idx: Index,
}

#[derive(Clone, Debug, Serialize)]
pub struct FlatFunctionRef {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub path: Vec<FlatPathPart>,
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
    FunctionRef(FlatFunctionRef),
    Ref(FlatRef),
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
            FlatNode::FunctionRef(e) => e.idx,
            FlatNode::Ref(e) => e.idx,
        }
    }

    /// Set the index of `self` to `idx`
    pub fn set_idx(&mut self, idx: Index) {
        match self {
            FlatNode::Element(e) => e.idx = idx,
            FlatNode::Error(e) => e.idx = idx,
            FlatNode::FunctionRef(e) => e.idx = idx,
            FlatNode::Ref(e) => e.idx = idx,
        }
    }

    /// Get the index of the parent of the node.
    pub fn parent(&self) -> Option<Index> {
        match self {
            FlatNode::Element(e) => e.parent,
            FlatNode::Error(e) => e.parent,
            FlatNode::FunctionRef(e) => e.parent,
            FlatNode::Ref(e) => e.parent,
        }
    }

    /// Set the parent of the node to `parent`
    pub fn set_parent(&mut self, parent: Option<Index>) {
        match self {
            FlatNode::Element(e) => e.parent = parent,
            FlatNode::Error(e) => e.parent = parent,
            FlatNode::FunctionRef(e) => e.parent = parent,
            FlatNode::Ref(e) => e.parent = parent,
        }
    }
}

/// Untagged version of a Flattened DAST. All elements/errors/refs/function refs are stored in
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

    /// Convert `Self` into a `NormalizedRoot`. If `self.nodes` contains a non `Element`/`Error` node,
    /// this function will panic.
    pub fn into_normalized_root(self) -> NormalizedRoot {
        NormalizedRoot {
            children: self.children,
            nodes: self
                .nodes
                .into_iter()
                .map(|n| NormalizedNode::from_flat_node(&n))
                .collect(),
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

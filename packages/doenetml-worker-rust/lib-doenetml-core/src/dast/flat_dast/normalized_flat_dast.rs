//! `NormalizedFlatDast` is a variant of a flat DAST where only `Text`, `Element`, and `Error` children are allowed.
//! To get to normalized form, all refs and function refs must be expanded.

use serde::Serialize;
#[cfg(feature = "web")]
use tsify_next::Tsify;

use super::{ErrorType, FlatElement, FlatError, FlatNode, FlatRoot, Index, UntaggedContent};

/// Objects that can be stored in the main `nodes` array of a `NormalizedRoot`.
#[derive(Clone, Debug, Serialize)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum NormalizedNode {
    Element(FlatElement),
    Error(FlatError),
}

impl Default for NormalizedNode {
    fn default() -> Self {
        NormalizedNode::Error(FlatError {
            parent: None,
            message: "DEFAULT NODE".to_string(),
            error_type: ErrorType::Error,
            unresolved_path: None,
            position: None,
            source_doc: None,
            idx: 0,
        })
    }
}

impl NormalizedNode {
    pub fn from_flat_node(node: &FlatNode) -> Self {
        Self::try_from_flat_node(node).unwrap()
    }

    pub fn try_from_flat_node(node: &FlatNode) -> Result<Self, anyhow::Error> {
        match node {
            FlatNode::Element(e) => Ok(NormalizedNode::Element(e.clone())),
            FlatNode::Error(e) => Ok(NormalizedNode::Error(e.clone())),
            _ => anyhow::bail!("Cannot convert {:?} to NormalizedNode", node),
        }
    }

    /// Get the index of the node.
    pub fn idx(&self) -> Index {
        match self {
            NormalizedNode::Element(e) => e.idx,
            NormalizedNode::Error(e) => e.idx,
        }
    }

    /// Set the index of `self` to `idx`
    pub fn set_idx(&mut self, idx: Index) {
        match self {
            NormalizedNode::Element(e) => e.idx = idx,
            NormalizedNode::Error(e) => e.idx = idx,
        }
    }

    /// Get the index of the parent of the node.
    pub fn parent(&self) -> Option<Index> {
        match self {
            NormalizedNode::Element(e) => e.parent,
            NormalizedNode::Error(e) => e.parent,
        }
    }

    /// Set the parent of the node to `parent`
    pub fn set_parent(&mut self, parent: Option<Index>) {
        match self {
            NormalizedNode::Element(e) => e.parent = parent,
            NormalizedNode::Error(e) => e.parent = parent,
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
#[serde(rename = "normalizedRoot")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
pub struct NormalizedRoot {
    pub children: Vec<UntaggedContent>,
    pub nodes: Vec<NormalizedNode>,
    pub sources: Vec<String>,
}

impl NormalizedRoot {
    pub fn new() -> Self {
        Self {
            children: Vec::new(),
            nodes: Vec::new(),
            sources: Vec::new(),
        }
    }
    pub fn from_flat_root(flat_root: &FlatRoot) -> Self {
        Self {
            children: flat_root.children.clone(),
            nodes: flat_root
                .nodes
                .iter()
                .map(NormalizedNode::from_flat_node)
                .collect(),
            sources: flat_root.sources.clone(),
        }
    }
}

impl Default for NormalizedRoot {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
#[path = "normalized_flat_dast.test.rs"]
mod test;

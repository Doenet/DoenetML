//! `UntaggedFlatDast` is part of the DAST normalization process where the DAST is flattened and all
//! element/ref/etc. nodes are replaced with untagged references to their location in the nodes list.
//! `UntaggedFlatDast` allows elements to change type without having to find all places where they are referenced.

use std::{collections::HashMap, fmt::Display, num::ParseIntError};

use serde::{Deserialize, Serialize};
use tsify_next::{Tsify, declare};

use crate::dast::DastRoot;

use super::{
    super::{Position, ref_resolve::RefResolution},
    normalized_flat_dast::{NormalizedNode, NormalizedRoot},
};

pub use super::parent_iterator::ParentIterator;

#[cfg_attr(feature = "web", declare)]
pub type Index = usize;

#[derive(Debug, Serialize, Deserialize, Clone, Copy, Hash, PartialEq, Eq)]
pub struct SourceDoc(u16);

impl From<Option<SourceDoc>> for SourceDoc {
    fn from(value: Option<SourceDoc>) -> Self {
        value.unwrap_or(SourceDoc(0))
    }
}

impl From<u16> for SourceDoc {
    fn from(value: u16) -> Self {
        SourceDoc(value)
    }
}

impl TryFrom<&str> for SourceDoc {
    type Error = ParseIntError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Ok(value.parse::<u16>()?.into())
    }
}

impl Display for SourceDoc {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
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
#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum Source<T> {
    ExtendAttribute(T),
    CopyAttribute(T),
    Ref(T),
}

impl<T> Source<T> {
    /// Recast `self` as `Self::ExtendAttribute`, indicating that it came from inside the `extend` attribute.
    pub fn as_extend_attribute(self) -> Self {
        match self {
            Source::ExtendAttribute(_) => self,
            Source::Ref(m) => Source::ExtendAttribute(m),
            Source::CopyAttribute(m) => Source::ExtendAttribute(m),
        }
    }
    /// Recast `self` as `Self::CopyAttribute`, indicating that it came from inside the `copy` attribute.
    pub fn as_copy_attribute(self) -> Self {
        match self {
            Source::CopyAttribute(_) => self,
            Source::Ref(m) => Source::CopyAttribute(m),
            Source::ExtendAttribute(m) => Source::CopyAttribute(m),
        }
    }
    /// Returns whether `self` is an `ExtendAttribute` variant.
    pub fn is_extend_attribute(&self) -> bool {
        matches!(self, Source::ExtendAttribute(_))
    }
    /// Returns whether `self` is an `CopyAttribute` variant.
    pub fn is_copy_attribute(&self) -> bool {
        matches!(self, Source::CopyAttribute(_))
    }
    /// Returns whether `self` is a `Ref` variant.
    pub fn is_ref(&self) -> bool {
        matches!(self, Source::Ref(_))
    }
}

impl Source<RefResolution> {
    pub fn idx(&self) -> Index {
        match self {
            Source::ExtendAttribute(a) => a.node_idx,
            Source::CopyAttribute(a) => a.node_idx,
            Source::Ref(m) => m.node_idx,
        }
    }

    /// Set the `node_idx` of the wrapped `RefResolution`.
    pub fn set_idx(&mut self, idx: Index) {
        match self {
            Source::ExtendAttribute(a) => a.node_idx = idx,
            Source::CopyAttribute(a) => a.node_idx = idx,
            Source::Ref(m) => m.node_idx = idx,
        }
    }

    /// Unwraps the `RefResolution` from `self`.
    pub fn get_resolution(&self) -> &RefResolution {
        match self {
            Source::ExtendAttribute(a) => a,
            Source::CopyAttribute(a) => a,
            Source::Ref(m) => m,
        }
    }

    /// Unwraps the `RefResolution` from `self` and returns a mutable reference.
    pub fn get_resolution_mut(&mut self) -> &mut RefResolution {
        match self {
            Source::ExtendAttribute(a) => a,
            Source::CopyAttribute(a) => a,
            Source::Ref(m) => m,
        }
    }

    /// Similar to `get_resolution`, but consumes `self` and returns the `RefResolution`.
    pub fn take_resolution(self) -> RefResolution {
        match self {
            Source::ExtendAttribute(a) => a,
            Source::CopyAttribute(a) => a,
            Source::Ref(m) => m,
        }
    }

    pub fn set_initial_node_index(&mut self, idx: Index) {
        match self {
            Source::ExtendAttribute(a) => a.nodes_in_resolved_path[0] = idx,
            Source::CopyAttribute(a) => a.nodes_in_resolved_path[0] = idx,
            Source::Ref(m) => m.nodes_in_resolved_path[0] = idx,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[serde(tag = "type")]
#[serde(rename = "element")]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatElement {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub children: Vec<UntaggedContent>,
    pub attributes: Vec<FlatAttribute>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    /// The position of the vector of child nodes
    pub children_position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
    pub idx: Index,
    /// Information about the referent that this element extends (e.g., as specified by the `extend` attribute).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extending: Option<Source<RefResolution>>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[serde(tag = "type")]
#[serde(rename = "attribute")]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatAttribute {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub children: Vec<UntaggedContent>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Copy, Default)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub enum ErrorType {
    #[default]
    Error,
    Warning,
    Info,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[serde(tag = "type")]
#[serde(rename = "error")]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatError {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub message: String,
    pub error_type: ErrorType,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unresolved_path: Option<Vec<FlatPathPart>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
    pub idx: Index,
}

impl FlatError {
    pub fn with_message(message: String, idx: Index) -> Self {
        Self {
            parent: None,
            message,
            error_type: ErrorType::Error,
            unresolved_path: None,
            position: None,
            source_doc: None,
            idx,
        }
    }
}

/// A part of a ref path
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "flatPathPart")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatPathPart {
    pub name: String,
    pub index: Vec<FlatIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

/// An index into a ref path
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatIndex {
    pub value: Vec<UntaggedContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[serde(tag = "type")]
#[serde(rename = "ref")]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatRef {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub path: Vec<FlatPathPart>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
    pub idx: Index,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[serde(tag = "type")]
#[serde(rename = "functionRef")]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatFunctionRef {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent: Option<Index>,
    pub path: Vec<FlatPathPart>,
    pub input: Option<Vec<Vec<UntaggedContent>>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
    pub idx: Index,
}

/// Objects that can be stored in the main `nodes` array of a `FlatRoot`.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[serde(untagged)]
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
            error_type: ErrorType::Error,
            unresolved_path: None,
            position: None,
            source_doc: None,
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
///
/// Note: this data structure is used for processing parsed dast from the client.
/// The client gets returned `FlatDastRoot`.
#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
#[serde(rename = "flatRoot")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
pub struct FlatRoot {
    pub children: Vec<UntaggedContent>,
    pub nodes: Vec<FlatNode>,
    pub sources: Vec<String>,
}

impl FlatRoot {
    pub fn new() -> Self {
        Self {
            children: Vec::new(),
            nodes: Vec::new(),
            sources: Vec::new(),
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
            sources: self.sources.clone(),
        }
    }
}

impl Default for FlatRoot {
    fn default() -> Self {
        Self::new()
    }
}

/// A subtree of nodes from a `FlatRoot`.
///
/// The `parent_idx`, if it exists, is a node outside the `FlatFragment`.
#[derive(Clone, Debug, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "flatFragment")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct FlatFragment {
    pub children: Vec<UntaggedContent>,
    pub nodes: Vec<FlatNode>,
    /// The index of the fragment's parent (e.g., from a `FlatRoot`)
    pub parent_idx: Option<Index>,
    /// If `source:sequence` attribute of the fragment parent, if it exist.
    /// Used to create the `NodeResolverData::source_sequence` of the parent.
    pub parent_source_sequence: Option<FlatAttribute>,
    /// A map of the a node's index into its index in the array `nodes`
    idx_map: HashMap<usize, usize>,
}

impl FlatFragment {
    /// Create a `FlatFragment` from a `DastRoot`
    /// where all indices will be shifted by `idx_to_id_shift`
    /// and the parent of the base children will be `parent_idx` (e.g., from a `FlatRoot`)
    pub fn from_dast_with_id_shift(
        dast: &DastRoot,
        idx_to_id_shift: usize,
        parent_idx: Option<Index>,
    ) -> Self {
        // TODO: this function is unused. If we use it, it needs tests.

        let mut flat_root = FlatRoot::from_dast(dast);

        // shift the indices of the children
        for child in flat_root.children.iter_mut() {
            if let UntaggedContent::Ref(idx) = child {
                *idx += idx_to_id_shift
            }
        }

        let mut idx_map = HashMap::new();

        // Shift the indices, parent indices, child indices, attribute child indices,
        // extend indices, and input indices.
        // If a parent is `None`, set it to `parent_idx`.
        for node in flat_root.nodes.iter_mut() {
            idx_map.insert(node.idx() + idx_to_id_shift, node.idx());
            node.set_idx(node.idx() + idx_to_id_shift);
            node.set_parent(
                node.parent()
                    .map(|idx| idx + idx_to_id_shift)
                    .or(parent_idx),
            );

            match node {
                FlatNode::Element(flat_element) => {
                    for child in flat_element.children.iter_mut() {
                        if let UntaggedContent::Ref(idx) = child {
                            *idx += idx_to_id_shift
                        }
                    }
                    for attribute in flat_element.attributes.iter_mut() {
                        attribute.parent = attribute
                            .parent
                            .map(|idx| idx + idx_to_id_shift)
                            .or(parent_idx);
                        for child in attribute.children.iter_mut() {
                            if let UntaggedContent::Ref(idx) = child {
                                *idx += idx_to_id_shift
                            }
                        }
                    }
                    if let Some(extend) = flat_element.extending.as_mut() {
                        extend.set_idx(extend.idx() + idx_to_id_shift);
                    }
                }
                FlatNode::FunctionRef(flat_function_ref) => {
                    for input in flat_function_ref.input.iter_mut().flatten().flatten() {
                        if let UntaggedContent::Ref(idx) = input {
                            *idx += idx_to_id_shift
                        }
                    }
                }
                _ => {}
            }
        }

        FlatFragment {
            children: flat_root.children,
            nodes: flat_root.nodes,
            parent_idx,
            parent_source_sequence: None,
            idx_map,
        }
    }

    /// Return the total length needed for an array where each node occupies
    /// a position equal to its index.
    /// (This would be a sparse array for `FlatFragment`)
    pub fn len(&self) -> usize {
        let n = self
            .idx_map
            .keys()
            .max_by_key(|x| *x)
            .map(|x| x + 1)
            .unwrap_or_default();
        if let Some(idx) = self.parent_idx
            && idx + 1 > n
        {
            return idx + 1;
        }
        n
    }

    pub fn is_empty(&self) -> bool {
        self.parent_idx.is_none() && self.idx_map.is_empty()
    }

    pub fn get_node(&self, idx: Index) -> &FlatNode {
        &self.nodes[self.idx_map[&idx]]
    }

    pub fn min_idx(&self) -> usize {
        self.idx_map
            .keys()
            .min_by_key(|x| *x)
            .copied()
            .unwrap_or_default()
    }
}

pub enum FlatRootOrFragment<'a> {
    Root(&'a FlatRoot),
    Fragment(&'a FlatFragment),
}

impl FlatRootOrFragment<'_> {
    pub fn len(&self) -> usize {
        match self {
            FlatRootOrFragment::Root(flat_root) => flat_root.nodes.len(),
            FlatRootOrFragment::Fragment(flat_fragment) => flat_fragment.len(),
        }
    }

    pub fn is_empty(&self) -> bool {
        match self {
            FlatRootOrFragment::Root(flat_root) => flat_root.nodes.is_empty(),
            FlatRootOrFragment::Fragment(flat_fragment) => flat_fragment.is_empty(),
        }
    }

    pub fn nodes_iter(&self) -> impl Iterator<Item = &FlatNode> {
        match self {
            FlatRootOrFragment::Root(flat_root) => flat_root.nodes.iter(),
            FlatRootOrFragment::Fragment(flat_fragment) => flat_fragment.nodes.iter(),
        }
    }

    pub fn get_node(&self, idx: Index) -> &FlatNode {
        match self {
            FlatRootOrFragment::Root(flat_root) => &flat_root.nodes[idx],
            FlatRootOrFragment::Fragment(flat_fragment) => flat_fragment.get_node(idx),
        }
    }

    /// Iterate over the parent elements of a node.
    /// If for some reason the node has a non-element parent, the iterator will panic.
    pub fn parent_iter(&'_ self, start_idx: Index) -> ParentIterator<'_> {
        let start = self.get_node(start_idx);
        let stop_idx = match self {
            FlatRootOrFragment::Root(_) => None,
            FlatRootOrFragment::Fragment(flat_fragment) => flat_fragment.parent_idx,
        };
        ParentIterator::new(start, self, stop_idx)
    }
}

#[cfg(test)]
#[path = "untagged_flat_dast.test.rs"]
mod test;

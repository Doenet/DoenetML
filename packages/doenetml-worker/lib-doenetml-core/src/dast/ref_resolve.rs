//! Refs use a `path`, which consists of _names_ separated by dots (e.g. `a.b.c`), possibly followed by
//! prop names separated by dots (e.g. `a.b.c.x.y.z`). A `Resolver` searches for a matching node
//! from a given starting position. Because a `Resolver` does not know whether part of a path corresponds to a
//! name or prop name, the longest valid partial match is used and unmatched portions of a `path` are
//! preserved for future use.

mod build;
mod compactify;
mod index_resolutions;
mod resolve;

pub use index_resolutions::*;

use std::collections::HashMap;

use crate::dast::flat_dast::{FlatNode, UntaggedContent};

use super::flat_dast::{FlatElement, FlatPathPart, Index};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use tsify_next::Tsify;

#[derive(Clone, Debug, Serialize, Error, PartialEq, Copy)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
pub enum ResolutionError {
    #[error("No node identified by path")]
    NoReferent,
    #[error("Path referred to more than one node")]
    NonUniqueReferent,
}

/// Format an error message given that `err` was produced when trying to resolve `path`.
/// Since the resolve algorithm stops when any index is found,
/// this message includes the path up to any index.
///
/// For example, given this DoenetML
/// ```xml
/// <text name="t" /><text name="t" />
/// $a.b.c[1].d
/// $t.a[1].b
/// ```
/// the error messages for the two references will be
/// - `"No referent found for reference: $a.b.c"`, and
/// - `"Multiple references found for reference: $t.a`.
pub fn format_error_message(err: ResolutionError, path: &[FlatPathPart]) -> String {
    // Note: this message could potentially be improved by recording
    // the start and end location of the reference node
    // and using the entire DoenetML string that created the reference
    let mut paths_until_first_index = vec![];
    for path_part in path.iter() {
        if !path_part.name.is_empty() {
            paths_until_first_index.push(path_part.name.clone())
        }
        if !path_part.index.is_empty() {
            break;
        }
    }
    let paths_string = paths_until_first_index.join(".");

    match err {
        ResolutionError::NoReferent => {
            format!("No referent found for reference: ${}", paths_string)
        }
        ResolutionError::NonUniqueReferent => {
            format!("Multiple referents found for reference: ${}", paths_string)
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
pub struct RefResolution {
    /// The final index of the node reached when resolving
    pub node_idx: Index,
    /// The indices of all nodes involved in resolving
    pub nodes_in_resolved_path: Vec<Index>,
    /// The path after `node_idx` that remains unresolved
    pub unresolved_path: Option<Vec<FlatPathPart>>,
    /// The original path that was resolved with origin `nodes_in_resolved_path[0]`
    pub original_path: Vec<FlatPathPart>,
}

/// Status of a pointer referring to children of an element.
#[derive(Debug, Serialize, Deserialize, Clone)]
enum Ref {
    Unique(Index),
    Ambiguous(Vec<Index>),
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
enum ResolutionAlgorithm {
    SearchChildren,
    DontSearchChildren,
    Unsearchable,
}

const DONT_SEARCH_CHILDREN: [&str; 3] = ["option", "case", "repeat"];

impl ResolutionAlgorithm {
    fn lookup_by_name(name: &str) -> Self {
        if DONT_SEARCH_CHILDREN.contains(&name) {
            ResolutionAlgorithm::DontSearchChildren
        } else {
            ResolutionAlgorithm::SearchChildren
        }
    }

    fn lookup_by_flat_node(node: &FlatNode) -> Self {
        if let FlatNode::Element(element) = node {
            Self::lookup_by_name(element.name.as_str())
        } else {
            ResolutionAlgorithm::Unsearchable
        }
    }
}

/// The possibilities for the parent of a node in the resolver
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub enum NodeParent {
    None,
    FlatRoot,
    Node(Index),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct NodeResolverData {
    /// The parent of the node. Options are:
    /// - `NodeParent:None` corresponds to no parent
    /// - `NodeParent:FlatRoot` corresponds to the parent being the flat root (which isn't a node)
    /// - `NodeParent:Node(i)` corresponds to the parent being node `i`.
    node_parent: NodeParent,
    resolution_algorithm: ResolutionAlgorithm,
    /// Map of all the names that are accessible (as descendants) from the node
    name_map: HashMap<String, Ref>,
    /// Map of resolutions of indices that follow a match to the node.
    /// If `index_resolutions[i] = Some(j)` and the reference `$node_reference` matches the node,
    /// then the reference `$node_reference[i+1]` resolves to node `k`
    /// (as references are indexed starting from `1`).
    /// Note: `index_resolutions[i] = None` indicates that `$node_reference[i+1]` would resolve to a text node,
    /// which is not a valid ref resolution.
    index_resolutions: Vec<Option<Index>>,
}

/// A `Resolver` is used to lookup elements by path/name. It constructs a search index
/// upon construction. If the underlying `FlatRoot` changes, a new `Resolver` should be
/// recreated.
#[derive(Debug, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct Resolver {
    /// List of the node resolver data for a node at a given index shifted by `1`
    /// so that `node_resolver_data[i+1]` gives the data for node `i`
    /// and `node_resolver_data[0]` gives that data for the flat root (which isn't a node)
    node_resolver_data: Vec<NodeResolverData>,
}

/// Get the name of `element` from its `name` attribute,
/// where the `name` attribute must have exactly one text child to be considered valid.
fn get_element_name(element: &FlatElement) -> Option<String> {
    let name = element
        .attributes
        .iter()
        .find(|attr| attr.name == "name")
        .and_then(|attr| {
            match (attr.children.len(), attr.children.first()) {
                // A name attribute should have exactly one text child. Otherwise it is considered invalid.
                (1, Some(UntaggedContent::Text(name))) => Some(name.clone()),
                _ => None,
            }
        });
    name
}

#[cfg(test)]
mod test_helpers;

use std::ops::Range;

use serde::Deserialize;
use tsify_next::Tsify;

use crate::dast::flat_dast::{FlatNode, FlatRootOrFragment, Index, UntaggedContent};

use super::Resolver;

/// An enum specifying whether or not nodes that are being added to the resolver should also be added as index resolutions
/// of the flat fragment parent, and if so, which existing indices they should replace.
#[derive(Debug, Deserialize, Clone)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum IndexResolution {
    /// Do not modify any `index_resolutions`
    None,
    /// Replace the `index_resolutions` field of component `Index` with references to the added children
    ReplaceAll { parent: Index },
    /// Splice references to the added children into the`index_resolutions` field of component `Index`, replacing the specified range of indices
    ReplaceRange { parent: Index, range: Range<usize> },
}

pub const CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS: [&str; 2] =
    ["group", "_postponeRenderContainer"];

impl Resolver {
    /// Find any elements in `flat_root_or_fragment` that are marked `CHILDREN_ARE_IMPLICIT_INDEX_RESOLUTIONS`
    /// and add index resolutions so that their children will resolve as their indices
    pub(super) fn add_implicit_index_resolutions(
        &mut self,
        flat_root_or_fragment: &FlatRootOrFragment,
        children_are_index_resolutions: &[&str],
    ) {
        for element in flat_root_or_fragment
            .nodes_iter()
            .filter_map(|node| match node {
                FlatNode::Element(element) => {
                    if children_are_index_resolutions.contains(&element.name.as_str()) {
                        Some(element)
                    } else {
                        None
                    }
                }
                _ => None,
            })
        {
            self.replace_index_resolutions(
                &element.children,
                IndexResolution::ReplaceAll {
                    parent: element.idx,
                },
            );
        }
    }

    /// Replace the index resolutions of the parent of `index_resolution` with `components`,
    /// replacing the indices given by `index_resolution`.
    pub fn replace_index_resolutions(
        &mut self,
        components: &[UntaggedContent],
        index_resolution: IndexResolution,
    ) {
        if matches!(index_resolution, IndexResolution::None) {
            return;
        }

        let new_resolutions: Vec<Option<usize>> = components
            .iter()
            .filter_map(|child| match child {
                UntaggedContent::Text(s) => {
                    if s.trim().is_empty() {
                        // a blank text node is ignored
                        None
                    } else {
                        // any other text node takes up an index but that index will have not a ref resolution
                        Some(None)
                    }
                }
                UntaggedContent::Ref(idx) => Some(Some(*idx)),
            })
            .collect();

        match index_resolution {
            IndexResolution::ReplaceAll { parent } => {
                self.node_resolver_data[parent + 1].index_resolutions = new_resolutions;
            }
            IndexResolution::ReplaceRange { parent, range } => {
                let parent_index_resolutions =
                    &mut self.node_resolver_data[parent + 1].index_resolutions;
                if range.start <= range.end && range.end <= parent_index_resolutions.len() {
                    parent_index_resolutions.splice(range, new_resolutions);
                }
            }
            IndexResolution::None => unreachable!(),
        }
    }
}

#[cfg(test)]
#[path = "index_resolutions.test.rs"]
mod test;

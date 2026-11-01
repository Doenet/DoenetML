use std::ops::Range;

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;

use crate::dast::flat_dast::{FlatNode, FlatRootOrFragment, Index, UntaggedContent};

use super::{NodeParent, Resolver};

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

/// The attribute the worker puts on a `<group>` it makes for an iteration of a repeat
/// or a pick of a select when the whole content of that iteration or pick is one
/// indexable component, such as a repeat or a list. Its value is the position of that
/// component among the group's `index_resolutions` (from 1), as the group can also hold
/// a `<setup>` the worker adds. An index after such a group passes to that component
/// (see [`IndexKind::PassThrough`]).
pub const INDEX_PASS_THROUGH_ATTRIBUTE: &str = "_indexPassThrough";

/// What an index after a node selects among (D27).
///
/// An index selects among the instances a component produces: the entries of a list,
/// the iterations of a repeat, the picks of a select. It does not select among the
/// children of a container. A `<group>` is the one container whose children an index
/// still reaches, as a deprecated form, and the resolver records each such step
/// in [`super::RefResolution::child_indexes`] so that it can be reported.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize)]
pub enum IndexKind {
    /// The node's `index_resolutions`, if any, are the instances it produces.
    #[default]
    Instances,
    /// The node is a `<group>`, whose `index_resolutions` are its children.
    /// Selecting one of them is deprecated child indexing.
    Children,
    /// The node is an iteration or a pick whose whole content is one indexable component,
    /// the one at `position` (from 1) of its `index_resolutions`
    /// (it carries [`INDEX_PASS_THROUGH_ATTRIBUTE`]). An index after the node passes to that component:
    /// `$r[1][2]` is iteration 2 of the repeat that makes up iteration 1 of `r`.
    PassThrough { position: usize },
}

impl IndexKind {
    pub(super) fn of_node(node: &FlatNode) -> Self {
        let FlatNode::Element(element) = node else {
            return IndexKind::Instances;
        };
        if element.name != "group" {
            return IndexKind::Instances;
        }
        let position = element
            .attributes
            .iter()
            .find(|attr| attr.name == INDEX_PASS_THROUGH_ATTRIBUTE)
            .and_then(|attr| match &attr.children[..] {
                [UntaggedContent::Text(position)] => position.trim().parse::<usize>().ok(),
                _ => None,
            })
            .filter(|position| *position > 0);
        match position {
            Some(position) => IndexKind::PassThrough { position },
            None => IndexKind::Children,
        }
    }

    pub(super) fn is_instances(&self) -> bool {
        *self == IndexKind::Instances
    }
}

impl Resolver {
    /// If an index after node `idx` passes through it (see [`IndexKind::PassThrough`]),
    /// the component the index passes to.
    pub(super) fn pass_through_child(&self, idx: Index) -> Option<Index> {
        let node_data = self.node_resolver_data.get(idx + 1)?;
        match node_data.index_kind {
            IndexKind::PassThrough { position } => node_data
                .index_resolutions
                .get(position - 1)
                .copied()
                .flatten(),
            _ => None,
        }
    }

    /// Whether an index passes through the parent of node `idx` to `idx` itself,
    /// in which case the index resolutions of `idx` are reached from its parent.
    pub(super) fn receives_pass_through(&self, idx: Index) -> bool {
        match self
            .node_resolver_data
            .get(idx + 1)
            .map(|data| data.node_parent)
        {
            Some(NodeParent::Node(parent)) => self.pass_through_child(parent) == Some(idx),
            _ => false,
        }
    }

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
            self.splice_index_resolutions(
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
        // The new index resolutions can point at existing nodes, giving them new root names
        if !matches!(index_resolution, IndexResolution::None) {
            self.root_name_cache.invalidate();
        }
        self.splice_index_resolutions(components, index_resolution);
    }

    /// Replace the index resolutions of the parent of `index_resolution` with `components`,
    /// replacing the indices given by `index_resolution`,
    /// where `components` are nodes that were just added to the resolver.
    pub(super) fn splice_index_resolutions(
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

        let (parent, first_replaced) = match &index_resolution {
            IndexResolution::ReplaceAll { parent } => (*parent, 0),
            IndexResolution::ReplaceRange { parent, range } => (*parent, range.start),
            IndexResolution::None => unreachable!(),
        };
        // The nodes reached through the index resolutions of a component that an index passes to
        // are reached from the iteration or pick holding it (`IndexKind::PassThrough`),
        // and so are neither found by continuing the search from the component
        // nor recorded as reached through it
        if self.receives_pass_through(parent) {
            self.root_name_cache.invalidate();
        }
        self.root_name_cache.note_replaced_index_resolutions(
            parent,
            first_replaced,
            &self.node_resolver_data[parent + 1].index_resolutions,
        );

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

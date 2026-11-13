use std::ops::Range;

use serde::{Deserialize, Serialize};
use tsify_next::Tsify;

use crate::dast::{
    flat_dast::{FlatNode, FlatRootOrFragment, Index, Source, UntaggedContent},
    ref_expand::is_extend_or_copy_attribute,
};

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

/// The attribute the worker puts on the `<setup>` a repeat adds to each iteration for its
/// `valueName` and `indexName`, after the iteration's content. That setup is not the author's
/// content (NAME-3), so an index never reaches it (see [`NodeResolverData::iteration_aliases`]):
/// an index past the iteration's content (or a copy's) names nothing, as an index past the end
/// of a list does, rather than reaching the setup and, through it, the aliases (`$r[1][4].v`).
///
/// [`NodeResolverData::iteration_aliases`]: super::NodeResolverData
pub const ITERATION_ALIASES_ATTRIBUTE: &str = "_iterationAliases";

/// The element the worker makes for a reference (`$x`), in the fragments it adds. A reference
/// written as a tag (`<math extend="$x"/>`) is one too, but carries
/// [`CREATE_COMPONENT_OF_TYPE_ATTRIBUTE`], and is a component of that type.
pub const REFERENCE_ELEMENT: &str = "_copy";

/// The attribute of a [`REFERENCE_ELEMENT`] written as a tag, giving the tag.
pub const CREATE_COMPONENT_OF_TYPE_ATTRIBUTE: &str = "_createComponentOfType";

/// What an index after a node selects among (D27, NAME-2).
///
/// An index selects among the instances a component produces: the entries of a list,
/// the iterations of a repeat, the picks of a select. It never selects among the
/// children of a container. A `<group>` -- one the author wrote, an iteration, a pick, a
/// shown case, or an extend or copy of any of these -- stands for its content when that
/// content is one component, and passes the index to it ([`IndexKind::PassThrough`],
/// [`IndexKind::Reference`]); that component decides what the index means. When the group
/// holds several components or none, an index after it names nothing
/// ([`IndexKind::Children`], see [`super::RefResolution::child_index`]). The group keeps its
/// children as its `index_resolutions` all the same, as the root names of the components in
/// it are made from them.
///
/// "One component" ignores blank text and a `<setup>`; any other text counts. It is decided
/// from the group's children when the group is added to the resolver
/// ([`IndexKind::of_node`]): at load for a group the author wrote, and when the worker adds it
/// for any other ([`FlatFragment::parent_content`] for the group a copy or an extend makes).
///
/// [`FlatFragment::parent_content`]: crate::dast::flat_dast::FlatFragment::parent_content
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize)]
pub enum IndexKind {
    /// The node's `index_resolutions`, if any, are the instances it produces.
    #[default]
    Instances,
    /// The node is a `<group>` that extends or copies something, whose content is not known
    /// until the worker has made it. An index waits, as one after a component whose instances
    /// are not made yet does.
    Pending,
    /// The node is a `<group>` that does not hold one component: it holds `count` components,
    /// other than one, or only text (`count` 1). An index does not select among them, and an
    /// index after it names nothing.
    Children { count: usize },
    /// The node is a `<group>` whose whole content is one component, at `position` (from 1)
    /// among its `index_resolutions`, which is not a reference. An index after the node passes
    /// to that component: `$r[1][2]` is iteration 2 of the repeat that makes up iteration 1 of
    /// `r`, and `$g[2]` of `<group name="g"><math>(1,2,3)</math></group>` is the math's `2`.
    PassThrough { position: usize },
    /// The node is a `<group>` whose whole content is one reference, at `position` (from 1)
    /// among its `index_resolutions`, followed by `after` more (the `<setup>`s that may follow
    /// it). What the reference makes takes its place among the `index_resolutions`, and
    /// `content` says what an index after the node then does with it.
    Reference {
        position: usize,
        after: usize,
        content: ReferenceContent,
    },
}

/// For a `<group>` whose whole content is one reference ([`IndexKind::Reference`]), what an
/// index after the group does with what the reference made. The worker says which once the
/// reference has expanded (`FlatFragment::index_parent_reference`).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum ReferenceContent {
    /// Not known yet: the reference has not expanded. An index passes to the reference itself,
    /// so that it waits for the reference to expand.
    #[default]
    Pending,
    /// The reference names a list or a composite that produces instances (a repeat, a select,
    /// a `<conditionalContent>`, …), whose instances (or entries) it made: an index selects
    /// among them, as it would after what the reference names (`<group>$nl</group>`).
    Instances,
    /// The reference made one component, at `offset` (from 1) among what it made, as a
    /// reference to a `<math>` or to a `<group>` holding one component does: an index passes
    /// to it.
    One { offset: usize },
    /// The reference made `count` components, other than one: an index names nothing,
    /// as it does after [`IndexKind::Children`].
    Several { count: usize },
}

impl IndexKind {
    /// The index kind of `node`, with `node_of` giving the nodes its children refer to.
    pub(super) fn of_node<'a>(
        node: &FlatNode,
        node_of: impl Fn(Index) -> Option<&'a FlatNode>,
    ) -> Self {
        let FlatNode::Element(element) = node else {
            return IndexKind::Instances;
        };
        if element.name == "group" {
            if element.extending.is_some()
                || element
                    .attributes
                    .iter()
                    .any(|attr| is_extend_or_copy_attribute(&attr.name))
            {
                // its content is what it extends or copies, with its children after it
                return IndexKind::Pending;
            }
            return IndexKind::of_content(&element.children, node_of);
        }
        if element.name == REFERENCE_ELEMENT
            && element.attributes.iter().any(|attr| {
                attr.name == CREATE_COMPONENT_OF_TYPE_ATTRIBUTE
                    && matches!(&attr.children[..], [UntaggedContent::Text(t)] if t == "group")
            })
        {
            // a `<group extend="…"/>` the worker made, whose content is not made yet
            return IndexKind::Pending;
        }
        IndexKind::Instances
    }

    /// The index kind of a `<group>` whose children are `children`, with `node_of` giving the
    /// nodes they refer to: whether its whole content is one component, ignoring blank text
    /// and `<setup>`s (any other text counts), and whether that component is a reference.
    pub(super) fn of_content<'a>(
        children: &[UntaggedContent],
        node_of: impl Fn(Index) -> Option<&'a FlatNode>,
    ) -> Self {
        // positions are among the children an index counts, all but blank text, from 1
        let mut position = 0;
        let mut count = 0;
        let mut content: Option<(usize, bool)> = None;
        for child in children {
            match child {
                UntaggedContent::Text(text) => {
                    if text.trim().is_empty() {
                        continue;
                    }
                    position += 1;
                    count += 1;
                    // text takes no index
                    content = None;
                }
                UntaggedContent::Ref(idx) => {
                    position += 1;
                    let node = node_of(*idx);
                    if node.is_some_and(is_setup) {
                        continue;
                    }
                    count += 1;
                    content = Some((position, node.is_some_and(is_reference)));
                }
            }
        }
        match (count, content) {
            (1, Some((position, false))) => IndexKind::PassThrough { position },
            (1, Some((position, true))) => IndexKind::Reference {
                position,
                after: (children
                    .iter()
                    .filter(|child| match child {
                        UntaggedContent::Text(text) => !text.trim().is_empty(),
                        UntaggedContent::Ref(_) => true,
                    })
                    .count())
                    - position,
                content: ReferenceContent::Pending,
            },
            _ => IndexKind::Children { count },
        }
    }

    pub(super) fn is_instances(&self) -> bool {
        *self == IndexKind::Instances
    }
}

/// Whether `node` is a `<setup>`, which is not content.
pub(super) fn is_setup(node: &FlatNode) -> bool {
    matches!(node, FlatNode::Element(element) if element.name == "setup")
}

/// Whether `node` is a reference (`$x`) and not a component written as a tag: a ref not
/// yet expanded, a ref expanded at load, or the [`REFERENCE_ELEMENT`] the worker makes for one.
fn is_reference(node: &FlatNode) -> bool {
    match node {
        FlatNode::Ref(_) => true,
        FlatNode::Element(element) => {
            matches!(element.extending, Some(Source::Ref(_)))
                || (element.name == REFERENCE_ELEMENT
                    && !element
                        .attributes
                        .iter()
                        .any(|attr| attr.name == CREATE_COMPONENT_OF_TYPE_ATTRIBUTE))
        }
        _ => false,
    }
}

impl Resolver {
    /// If an index after node `idx` passes through it to one component
    /// (see [`IndexKind::PassThrough`] and [`ReferenceContent::One`]), that component.
    /// With `pending`, also the reference that is the whole content of a group,
    /// while what it makes is not known ([`ReferenceContent::Pending`]),
    /// so that an index waits for it.
    pub(super) fn pass_through_child(&self, idx: Index, pending: bool) -> Option<Index> {
        let node_data = self.node_resolver_data.get(idx + 1)?;
        let position = match node_data.index_kind {
            IndexKind::PassThrough { position } => position,
            IndexKind::Reference {
                position,
                content: ReferenceContent::One { offset },
                ..
            } => position + offset - 1,
            IndexKind::Reference {
                position,
                content: ReferenceContent::Pending,
                ..
            } if pending => position,
            _ => return None,
        };
        node_data
            .index_resolutions
            .get(position - 1)
            .copied()
            .flatten()
    }

    /// Decide again the index kind of the `<group>` `idx`, from `children`, its whole content,
    /// which a copy or an extend made (see [`FlatFragment::parent_content`]).
    ///
    /// [`FlatFragment::parent_content`]: crate::dast::flat_dast::FlatFragment::parent_content
    pub(super) fn set_index_kind_from_content<'a>(
        &mut self,
        idx: Index,
        children: &[UntaggedContent],
        node_of: impl Fn(Index) -> Option<&'a FlatNode>,
    ) {
        if self.node_resolver_data.get(idx + 1).is_none() {
            return;
        }
        let index_kind = IndexKind::of_content(children, node_of);
        self.set_index_kind(idx, index_kind);
    }

    /// What an index after the `<group>` `idx`, whose whole content is one reference,
    /// does with what that reference made (see [`IndexKind::Reference`]).
    /// Any other node is left as it is.
    pub(super) fn set_index_reference_content(&mut self, idx: Index, content: ReferenceContent) {
        let Some(node_data) = self.node_resolver_data.get(idx + 1) else {
            return;
        };
        if let IndexKind::Reference {
            position, after, ..
        } = node_data.index_kind
        {
            self.set_index_kind(
                idx,
                IndexKind::Reference {
                    position,
                    after,
                    content,
                },
            );
        }
    }

    fn set_index_kind(&mut self, idx: Index, index_kind: IndexKind) {
        let node_data = &mut self.node_resolver_data[idx + 1];
        if node_data.index_kind != index_kind {
            node_data.index_kind = index_kind;
            // What the names of the group and of the component an index passes to reach changes
            self.root_name_cache.invalidate();
        }
    }

    /// Whether an index passes through the parent of node `idx` to `idx` itself, and `idx`
    /// produces instances, in which case the root names of the index resolutions of `idx` may
    /// be reached from its parent (see `Resolver::breadth_first_traversal_from`).
    pub(super) fn receives_pass_through(&self, idx: Index) -> bool {
        match self.node_resolver_data.get(idx + 1) {
            Some(data) if data.index_kind.is_instances() => match data.node_parent {
                NodeParent::Node(parent) => self.pass_through_child(parent, false) == Some(idx),
                _ => false,
            },
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
                // A range past the end means the caller counted something other than the
                // parent's index resolutions (as #2478's row 4 did, counting a copy's
                // replacements), and skipping it silently keeps stale resolutions (#2520
                // item 7). It fails in Rust tests. The worker ships a `--dev` WASM build, so
                // a `debug_assert!` would also stop a reader's document; there it is
                // reported on the console instead, and the splice is skipped, as there is
                // nothing sound to replace.
                let in_bounds =
                    range.start <= range.end && range.end <= parent_index_resolutions.len();
                if !in_bounds {
                    let report = format!(
                        "ReplaceRange {:?} past the end of the {} index resolutions of node {}",
                        range,
                        parent_index_resolutions.len(),
                        parent
                    );
                    #[cfg(any(test, feature = "testing"))]
                    panic!("{report}");
                    #[cfg(not(any(test, feature = "testing")))]
                    crate::utils::log!("{report}");
                }
                if in_bounds {
                    parent_index_resolutions.splice(range, new_resolutions);
                }
            }
            IndexResolution::None => unreachable!(),
        }
    }
}

/// Whether `node` is the `<setup>` a repeat adds to an iteration
/// (it carries [`ITERATION_ALIASES_ATTRIBUTE`]), which an index never reaches.
pub(super) fn holds_iteration_aliases(node: &FlatNode) -> bool {
    match node {
        FlatNode::Element(element) => {
            element.name == "setup"
                && element
                    .attributes
                    .iter()
                    .any(|attr| attr.name == ITERATION_ALIASES_ATTRIBUTE)
        }
        _ => false,
    }
}

#[cfg(test)]
#[path = "index_resolutions.test.rs"]
mod test;

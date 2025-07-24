//! An iterator that iterates over the ancestors of a component.

use typed_index_collections::TiVec;

use crate::components::{Component, ComponentCommon, types::ComponentIdx};

/// An iterator that iterates of the true ancestors of a component.
pub(super) struct AncestorIterator<'a> {
    pub components: &'a TiVec<ComponentIdx, Component>,
    pub current_idx: ComponentIdx,
}

impl Iterator for AncestorIterator<'_> {
    type Item = ComponentIdx;

    fn next(&mut self) -> Option<Self::Item> {
        let parent_idx = self.components[self.current_idx].get_parent()?;
        self.current_idx = parent_idx;
        Some(parent_idx)
    }
}

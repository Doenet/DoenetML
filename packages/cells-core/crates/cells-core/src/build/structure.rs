//! What a build made of the document's shape: the repeats it expanded and
//! the keys of its essential cells ([`Structure`]), stored on the
//! [`Document`](crate::Document), and the scope table, which the
//! [`Session`](super::Session) keeps across builds.

use std::collections::HashMap;

use crate::compile::plan::ElemKey;
use crate::dast::NodeId;
use crate::document::CompIdx;

crate::index::index_type! {
    /// A name scope: 0 is the document, every other scope is one iteration
    /// of a repeat (see `build/mod.rs`); a position in the session's
    /// `ScopeTable`.
    pub struct ScopeId;
}

impl ScopeId {
    /// The document's own scope.
    pub const DOCUMENT: ScopeId = ScopeId::new(0);
}

/// One expanded `<repeatForSequence>`.
#[derive(Debug, Clone)]
pub struct Repeat {
    pub comp: CompIdx,
    pub node: NodeId,
    /// Scope the repeat element sits in.
    pub scope: ScopeId,
    /// One scope per iteration, in order.
    pub iter_scopes: Vec<ScopeId>,
    /// Iterations the build used; a differing `count` cell triggers a rebuild.
    pub iterations: u32,
}

/// Every scope a build has made: (parent scope, repeat or choice element,
/// 1-based position) per scope, indexed by `ScopeId`; entry 0 is the
/// document. Ids are stable across rebuilds: the table only grows.
#[derive(Debug, Clone)]
pub struct ScopeTable {
    entries: Vec<(ScopeId, NodeId, u32)>,
    index: HashMap<(ScopeId, NodeId, u32), ScopeId>,
}

impl Default for ScopeTable {
    fn default() -> Self {
        ScopeTable {
            entries: vec![(ScopeId::NONE, NodeId::NONE, 0)],
            index: HashMap::new(),
        }
    }
}

impl ScopeTable {
    /// The id of position `k` of element `node` under `parent`, created on
    /// first use.
    pub fn get_or_insert(&mut self, parent: ScopeId, node: NodeId, k: u32) -> ScopeId {
        if let Some(&s) = self.index.get(&(parent, node, k)) {
            return s;
        }
        self.entries.push((parent, node, k));
        let s = ScopeId::from_index(self.entries.len() - 1);
        self.index.insert((parent, node, k), s);
        s
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    pub fn heap_bytes(&self) -> usize {
        self.entries.capacity() * 12 + self.index.capacity() * 16
    }
}

impl std::ops::Index<ScopeId> for ScopeTable {
    type Output = (ScopeId, NodeId, u32);
    fn index(&self, s: ScopeId) -> &Self::Output {
        &self.entries[s.index()]
    }
}

/// What one build made of the document's shape (ADR 0015): its repeats,
/// its essential cells' keys and defaults, and its diagnostics. What
/// outlives the build is in the `Session`.
#[derive(Debug, Clone, Default)]
pub struct Structure {
    /// Per essential cell, in cell order: its essential key as (scope,
    /// template slot). The template slot identifies the element and prop
    /// within the scope's template. See `CONTEXT.md`, essential key.
    pub essential_slots: Vec<(ScopeId, u32)>,
    /// Per essential cell, in cell order: its element's key and the slot's
    /// position among the element's, what saved state names it by.
    pub essential_keys: Vec<(ElemKey, u32)>,
    /// Per essential cell, in cell order: the value the build gives it when
    /// nothing was carried over; saved state holds only the cells that differ.
    pub essential_defaults: Vec<f64>,
    pub repeats: Vec<Repeat>,
    /// Per repeat (same order as `repeats`): how many repeats must be
    /// expanded in sequence before this one's count is known, plus one.
    /// Nesting adds one; a count that reads a cell inside another repeat's
    /// iterations adds one. Load takes `structural_depth + 1` passes.
    pub repeat_depths: Vec<u32>,
    /// Per repeat: whether its count reads a cell inside another repeat's
    /// iterations (the avoidable kind of depth, reported by `warnings`).
    pub repeat_cross_reads: Vec<bool>,
    /// The largest `repeat_depths` entry; 0 without repeats.
    pub structural_depth: u32,
    /// What the build reported (ADR 0013): the compile's diagnostics, the
    /// lint findings and the errors of the elements it boxed, which are
    /// fixed at load (ADR 0014, ADR 0015), and the build's warnings, sorted
    /// by node.
    pub diagnostics: Vec<crate::diagnostics::Diagnostic>,
}

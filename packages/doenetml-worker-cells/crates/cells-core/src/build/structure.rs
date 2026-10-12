//! What a build knows about the document's shape: the scopes it made, the
//! repeats it expanded, and the essential values it held. It is stored on the
//! [`Document`](crate::Document) and handed to the next build (see
//! [`Carryover`](super::Carryover)) so iteration counts and essential values carry
//! over a rebuild.

use std::collections::HashMap;

use crate::dast::NodeId;
use crate::document::{CompIdx, NONE};

/// A name scope: 0 is the document, every other scope is one iteration of a
/// repeat (see `build/mod.rs`).
pub type ScopeId = u32;

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
            entries: vec![(NONE, NONE, 0)],
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
        let s = (self.entries.len() - 1) as ScopeId;
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
        &self.entries[s as usize]
    }
}

/// What a build knew about the document's shape, carried into the next
/// build so iteration counts and essential values survive.
#[derive(Debug, Clone, Default)]
pub struct Structure {
    pub scopes: ScopeTable,
    /// Per essential cell, in cell order: its essential key as (scope,
    /// template slot). The template slot identifies the element and prop
    /// within the scope's template. See `CONTEXT.md`, essential key.
    pub essential_slots: Vec<(ScopeId, u32)>,
    /// `essential_values[scope][template slot]`: the last value of every essential
    /// cell that has ever existed, so an iteration that disappears and
    /// reappears returns as it was left. Rows fill lazily.
    pub essential_values: Vec<Vec<Option<f64>>>,
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
    /// The document seed load-time choices draw from (ADR 0009).
    pub seed: u64,
    /// Curves sample through the engine, not compiled tapes (see
    /// `LoadOptions`).
    pub sample_with_engine: bool,
}

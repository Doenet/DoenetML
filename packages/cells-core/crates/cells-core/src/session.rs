//! The session (ADR 0015): what a student's session accumulates and every
//! build of the document reads, so state survives a rebuild. A build reads
//! the session and returns the next one; it never moves it out of the
//! document, so a failed rebuild leaves the document as it was.

use std::collections::HashMap;
use std::sync::Arc;

use crate::build::{ElemKey, ScopeId, ScopeTable};
use crate::dast::NodeId;
use crate::document::Document;

/// What survives every build of a document.
#[derive(Debug, Clone, Default)]
pub struct Session {
    /// The document seed load-time choices draw from (ADR 0009).
    pub seed: u64,
    /// Curves sample through the engine, not compiled tapes (see
    /// `LoadOptions`).
    pub sample_with_engine: bool,
    /// Every scope any build has made; ids are stable for the session.
    pub scopes: ScopeTable,
    /// `values[scope][template slot]`: the last value of every essential
    /// cell that has existed, so an iteration that disappears and
    /// reappears returns as it was left. Rows fill lazily. Shared with the
    /// builds that read it, which leave it as it was.
    pub values: Arc<Vec<Vec<Option<f64>>>>,
    /// Restored values whose scope no build has stamped yet, by (scope,
    /// element key, position): the build that stamps it takes them.
    pub parked: HashMap<(ScopeId, ElemKey, u32), f64>,
    /// Strings interned since load (`Document::intern`), appended after
    /// every build's own table so an interned id keeps its text.
    pub runtime_strings: Vec<String>,
}

impl Session {
    /// The session of a document about to load.
    pub fn new(seed: u64, sample_with_engine: bool) -> Session {
        Session {
            seed,
            sample_with_engine,
            ..Session::default()
        }
    }

    /// Record a document's essential values (its essential cells and
    /// their keys) in `values`, so the next build carries them.
    pub fn record(&mut self, slots: &[(ScopeId, u32)], cells: &[f64]) {
        let values = Arc::make_mut(&mut self.values);
        // Never shrink: `restore_state` may have parked values for scopes
        // the table has not made yet.
        if values.len() < self.scopes.len() {
            values.resize(self.scopes.len(), Vec::new());
        }
        for (&(scope, slot), &v) in slots.iter().zip(cells) {
            let row = &mut values[scope as usize];
            if row.len() <= slot as usize {
                row.resize(slot as usize + 1, None);
            }
            row[slot as usize] = Some(v);
        }
    }

    /// The value carried for `(scope, slot)`, if any.
    pub(crate) fn carried(&self, scope: ScopeId, slot: u32) -> Option<f64> {
        self.values
            .get(scope as usize)
            .and_then(|row| row.get(slot as usize).copied().flatten())
    }

    pub fn heap_bytes(&self) -> usize {
        self.scopes.heap_bytes()
            + self
                .values
                .iter()
                .map(|r| r.capacity() * 16 + 24)
                .sum::<usize>()
    }
}

/// How many iterations each repeat is stamped with, by (scope, node):
/// what the count cells hold, read from the document a build follows.
#[derive(Debug, Clone, Default)]
pub struct Counts(HashMap<(ScopeId, NodeId), u32>);

impl Counts {
    /// What `doc`'s count cells ask for.
    pub fn of(doc: &Document) -> Counts {
        Counts(
            doc.structure
                .repeats
                .iter()
                .map(|r| ((r.scope, r.node), doc.repeat_count(r)))
                .collect(),
        )
    }

    /// Stamp repeat element `node` in `scope` with `n` iterations, whatever
    /// its count cell says: building a document at a chosen count
    /// (`tests/every_count.rs`).
    pub fn set(&mut self, scope: ScopeId, node: NodeId, n: u32) {
        self.0.insert((scope, node), n);
    }

    pub(crate) fn get(&self, scope: ScopeId, node: NodeId) -> u32 {
        self.0.get(&(scope, node)).copied().unwrap_or(0)
    }
}

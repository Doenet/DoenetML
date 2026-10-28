//! The session (ADR 0015): what a student's session accumulates and every
//! build of the document reads, so state survives a rebuild. A build reads
//! the session and returns the next one; it never moves it out of the
//! document, so a failed rebuild leaves the document as it was.

use std::cell::RefCell;
use std::collections::{HashMap, HashSet};
use std::rc::Rc;
use std::sync::Arc;

use crate::build::{ScopeId, ScopeTable};
use crate::compile::plan::ElemKey;
use crate::dast::NodeId;
use crate::document::Document;
use crate::sym::Engine;

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
    /// The count every repeat that has existed last asked for, so a
    /// repeat in an iteration that disappears and reappears is stamped
    /// with it, not with none, and the rebuild that brings it back settles
    /// in one pass. Recorded by each rebuild (`Document::rebuild`); a
    /// count that changed meanwhile costs the pass it would have anyway.
    /// Shared with the builds that read it.
    pub counts: Arc<Counts>,
    /// Restored values whose scope no build has stamped yet, by (scope,
    /// element key, position): the build that stamps it takes them.
    pub parked: HashMap<(ScopeId, ElemKey, u32), Parked>,
    /// Every essential value a request has written, by (scope, template
    /// slot), and every value restored from one (ADR 0017): what saved
    /// state holds, whether or not it equals its default. Shared with the
    /// builds that read it.
    pub touched: Arc<HashSet<(ScopeId, u32)>>,
    /// Strings interned since load (`Document::intern`), appended after
    /// every build's own table so an interned id keeps its text.
    pub runtime_strings: Vec<String>,
    /// The symbolic engine every math value of the session is a handle
    /// into: what a build imports, what the tick computes with (borrowed
    /// for each tick, `SymRun`), what a student's typed math is parsed into. It
    /// only grows, so a handle stays valid for the session, across builds
    /// and through a failed rebuild, which needs nothing back.
    pub engine: Rc<RefCell<Engine>>,
    /// How many components and slots the last build made: what the next
    /// sizes its tables by, so a rebuild neither over-reserves nor regrows.
    pub(crate) last_build: (usize, usize),
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
            let row = &mut values[scope.index()];
            if row.len() <= slot as usize {
                row.resize(slot as usize + 1, None);
            }
            row[slot as usize] = Some(v);
        }
    }

    /// The value carried for `(scope, slot)`, if any.
    pub(crate) fn carried(&self, scope: ScopeId, slot: u32) -> Option<f64> {
        self.values
            .get(scope.index())
            .and_then(|row| row.get(slot as usize).copied().flatten())
    }

    pub fn heap_bytes(&self) -> usize {
        self.scopes.heap_bytes()
            + self
                .values
                .iter()
                .map(|r| r.capacity() * 16 + 24)
                .sum::<usize>()
            + self.counts.0.capacity() * 24
            + self.touched.capacity() * 8
    }
}

/// A restored value waiting for the build that stamps its scope.
#[derive(Debug, Clone, Copy)]
pub struct Parked {
    pub value: f64,
    /// The type it was saved as: it goes only into a cell of that type.
    pub ty: crate::ValueType,
    /// For view state, the default it had when saved: a cell whose default
    /// is now another keeps its own (ADR 0017, step 2).
    pub view_default: Option<f64>,
}

impl Parked {
    /// Whether it goes into a cell of type `ty` whose default is `default`.
    pub fn fits(&self, ty: crate::ValueType, default: f64) -> bool {
        self.ty == ty && self.view_default.is_none_or(|d| same(d, default))
    }
}

/// Equal, or both NaN.
pub(crate) fn same(a: f64, b: f64) -> bool {
    a == b || (a.is_nan() && b.is_nan())
}

/// How many iterations each repeat is stamped with, by (scope, node):
/// what the count cells hold, read from the document a build follows.
#[derive(Debug, Clone, Default)]
pub struct Counts(HashMap<(ScopeId, NodeId), u32>);

impl Counts {
    /// What `doc`'s count cells ask for, over the counts its session
    /// keeps for repeats it no longer has.
    pub fn of(doc: &Document) -> Counts {
        let mut counts = (*doc.session.counts).clone();
        for r in &doc.structure.repeats {
            counts.0.insert((r.scope, r.node), doc.repeat_count(r));
        }
        counts
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

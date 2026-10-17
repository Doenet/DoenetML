//! The structure view: the one interface through which a build learns the
//! document's structure beyond its templates. Templates never change
//! between builds; what does is how many iterations each repeat has, which
//! options a select drew, and therefore which referents exist. Expand and
//! emit read those only through a [`View`], so a build is a function of the
//! templates and the view.
//!
//! Two views exist. [`Stamped`] answers from the counts a build is asked
//! for and the session's seed, so the build stamps
//! every iteration it has and a reference past the count is missing. The
//! cycle check's `Probe` (`cycles.rs`, ADR 0012) folds every iteration into
//! one, so the graph it builds holds every edge some count would create.
//! A structural read that bypasses the view is one the probe cannot model;
//! `tests/every_count.rs` builds every document at several counts and
//! seeds to catch one.

use super::*;

pub(in crate::build) trait View {
    /// The seed a load-time choice draws from (ADR 0009).
    fn seed(&self) -> u64;

    /// How many iterations repeat element `node` in `scope` is stamped with.
    fn iterations(&self, scope: ScopeId, node: NodeId) -> u32;

    /// Which of `len` stamped entries index `k` (1-based) names, or `None`
    /// for the missing referent. The entries are a repeat's iterations, a
    /// collect's items or a select's picks; `varies` says they stand for
    /// entries that differ at other counts or in other iterations (always
    /// for a repeat, for a collect that gathers from one, for a select whose
    /// every option was built).
    fn index(&self, len: usize, k: i64, varies: bool) -> Option<usize>;

    /// What a collect's count (a polyline's `numVertices`) is.
    fn collect_count(&self) -> CollectCount;

    /// The options a load-time select instantiates; `in_iteration` when it
    /// sits inside a repeat's iteration.
    fn options(&self, in_iteration: bool) -> Options;

    /// Which plans a prop with a first-iteration form gets in iteration `k`.
    fn plans(&self, k: u32) -> Plans;

    /// Whether one stamped iteration stands for every iteration. Then
    /// reference edges are labelled with how they move through the
    /// iterations (`Builder::resolve`), and a loop of aliases may be a
    /// recurrence folded onto itself rather than a cycle: the cycle check
    /// decides, not emit.
    fn folds_iterations(&self) -> bool;
}

/// A collect's count: the number it gathered, a constant, or a value that
/// reads the counts of the repeats whose iterations hold what it gathers.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::build) enum CollectCount {
    Gathered,
    RepeatCounts,
}

/// A load-time select's options: drawn from the seed, or every one.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::build) enum Options {
    Drawn,
    Every,
}

/// The plans of a `SourcePlan::FirstIteration` prop.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::build) enum Plans {
    First,
    Rest,
    /// The first as the source, the rest as a later source
    /// (`Builder::later_sources`) whose edges the graph carries too.
    Both,
}

/// The view of an ordinary build: the counts it was asked for and the
/// session's seed.
pub(in crate::build) struct Stamped<'c> {
    pub(in crate::build) session: &'c Session,
    pub(in crate::build) counts: &'c Counts,
}

impl View for Stamped<'_> {
    fn seed(&self) -> u64 {
        self.session.seed
    }

    fn iterations(&self, scope: ScopeId, node: NodeId) -> u32 {
        self.counts.get(scope, node)
    }

    fn index(&self, len: usize, k: i64, _varies: bool) -> Option<usize> {
        in_range(len, k)
    }

    fn collect_count(&self) -> CollectCount {
        CollectCount::Gathered
    }

    fn options(&self, _in_iteration: bool) -> Options {
        Options::Drawn
    }

    fn plans(&self, k: u32) -> Plans {
        if k == 1 { Plans::First } else { Plans::Rest }
    }

    fn folds_iterations(&self) -> bool {
        false
    }
}

/// Index `k` (1-based) into `len` entries, when it is in range.
pub(in crate::build) fn in_range(len: usize, k: i64) -> Option<usize> {
    (k >= 1 && k as u64 <= len as u64).then(|| (k - 1) as usize)
}

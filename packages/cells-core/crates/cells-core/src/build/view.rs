//! The structure view: the one interface through which a build learns the
//! document's structure beyond its templates. Templates never change
//! between builds; what does is how many iterations each repeat has, which
//! options a select drew, and therefore which referents exist. Expand and
//! emit read those only through a [`View`], so a build is a function of the
//! templates and the view.
//!
//! Two views exist. `View::Stamped` answers from the counts a build is
//! asked for, so the build stamps every iteration it has and a reference
//! past the count is missing. The cycle check's `View::Probe` (`probe.rs`,
//! ADR 0012) folds every iteration into one, so the graph it builds holds
//! every edge some count would create.
//! A structural read that bypasses the view is one the probe cannot model;
//! `tests/every_count.rs` builds every document at several counts and
//! seeds to catch one.

use super::*;

/// The structure view (`view.rs`): what a build is told about the
/// document's structure.
pub(in crate::build) enum View<'c> {
    /// An ordinary build: the counts it was asked for, so it stamps every
    /// iteration it has, a reference past the count is missing, and a
    /// select draws its options from the session's seed.
    Stamped { counts: &'c Counts },
    /// The probe (`probe.rs`, ADR 0012, ADR 0014): one iteration per
    /// repeat, standing for every iteration, and every option of every
    /// select, standing for every draw, so what it finds depends on the
    /// source alone.
    Probe,
}

impl View<'_> {
    /// How many iterations repeat element `node` in `scope` is stamped with.
    pub(in crate::build) fn iterations(&self, scope: ScopeId, node: NodeId) -> u32 {
        match self {
            View::Stamped { counts } => counts.get(scope, node),
            View::Probe => 1,
        }
    }

    /// Which of `len` stamped entries index `k` (1-based) names, or `None`
    /// for the missing referent. The entries are a repeat's iterations, a
    /// collect's items or a select's picks; `varies` says they stand for
    /// entries that differ at other counts or in other iterations (always
    /// for a repeat, for a collect that gathers from one, for a select whose
    /// every option was built). In the probe an index past such entries
    /// lands in them; the edge's label says which it named.
    pub(in crate::build) fn index(&self, len: usize, k: i64, varies: bool) -> Option<usize> {
        match self {
            View::Probe if varies && len > 0 => Some((k.max(1) as usize - 1).min(len - 1)),
            _ => in_range(len, k),
        }
    }

    /// What a collect's count (a polyline's `numVertices`) is: in the
    /// probe, a count reading it reaches the gathered repeats.
    pub(in crate::build) fn collect_count(&self) -> CollectCount {
        match self {
            View::Stamped { .. } => CollectCount::Gathered,
            View::Probe => CollectCount::RepeatCounts,
        }
    }

    /// The options a load-time select instantiates.
    pub(in crate::build) fn options(&self) -> Options {
        match self {
            View::Stamped { .. } => Options::Drawn,
            View::Probe => Options::Every,
        }
    }

    /// Which plans a prop with a first-iteration form gets in iteration
    /// `k`: in the probe, the one iteration carries both plans' edges.
    pub(in crate::build) fn plans(&self, k: u32) -> Plans {
        match self {
            View::Stamped { .. } if k == 1 => Plans::First,
            View::Stamped { .. } => Plans::Rest,
            View::Probe => Plans::Both,
        }
    }

    /// Whether one stamped iteration stands for every iteration. Then
    /// reference edges are labelled with how they move through the
    /// iterations (`Builder::resolve`), and a loop of aliases may be a
    /// recurrence folded onto itself rather than a cycle: the cycle check
    /// decides, not emit.
    pub(in crate::build) fn folds_iterations(&self) -> bool {
        matches!(self, View::Probe)
    }
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

/// The plans of a `Source::FirstIteration` prop.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::build) enum Plans {
    First,
    Rest,
    /// The first as the source, the rest as a later source
    /// (`Builder::later_sources`) whose edges the graph carries too.
    Both,
}

/// Index `k` (1-based) into `len` entries, when it is in range.
pub(in crate::build) fn in_range(len: usize, k: i64) -> Option<usize> {
    (k >= 1 && k as u64 <= len as u64).then(|| (k - 1) as usize)
}

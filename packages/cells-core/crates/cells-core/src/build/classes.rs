//! What a class of slots depends on, defined once. Emit merges a build's
//! aliases into classes ([`Classes`]); every walk over them reads a class
//! through its definition ([`Def`]), which offers the two relations a walk
//! may follow and no other:
//!
//! - [`Def::needs`]: what the class needs to be right. What its source
//!   reads, and the flags that hold it (ADR 0022, `Program::holds`), which a
//!   request on it reads. The live walk (ADR 0019) follows it, and emit
//!   checks that a live class needs no dead one.
//! - [`Def::request_targets`]: where a request on the class goes. The
//!   inputs its inverse may write (`OpSpec::writes`), and nowhere when a
//!   constant flag holds it. The writable walk (ADR 0018) follows it. A
//!   flag is never a target: it decides whether a request passes, and no
//!   request writes it.
//!
//! Evaluation order is neither: a flag is read only when a request
//! arrives, so it orders nothing. The cycle check reads a source's
//! [`BuiltSource::eval_inputs`], as `Program::schedule` reads an
//! instruction's inputs; `Program::needs` is the first relation over cells.
//!
//! What a source reads is private to this module, so a walk cannot follow
//! a class without choosing a relation by name, and both account for holds.

use super::*;

impl BuiltSource {
    /// The slots this source reads: an alias its target, an operator its
    /// inputs (in `op_inputs`), a vector output its head, which reads every
    /// input; a value or a constant none.
    fn reads<'a>(&self, op_inputs: &'a [SlotId]) -> impl Iterator<Item = SlotId> + 'a {
        let (one, many): (Option<SlotId>, &[SlotId]) = match self {
            BuiltSource::Alias(t) => (Some(*t), &[]),
            BuiltSource::Op(_, start, n) => (
                None,
                &op_inputs[*start as usize..*start as usize + *n as usize],
            ),
            BuiltSource::VecOut(head, _) => (Some(*head), &[]),
            BuiltSource::Unset | BuiltSource::Literal(_) | BuiltSource::Fixed(_) => (None, &[]),
        };
        one.into_iter().chain(many.iter().copied())
    }

    /// What evaluating this source reads, which decides the order slots
    /// are computed in and nothing else: the cycle check's graph. A flag
    /// that holds the slot is not among them (`Def::needs` has it).
    pub(in crate::build) fn eval_inputs<'a>(
        &self,
        op_inputs: &'a [SlotId],
    ) -> impl Iterator<Item = SlotId> + 'a {
        self.reads(op_inputs)
    }

    /// Of what this source reads, what a request on it could write through:
    /// an operator's inputs its inverse may write (`OpSpec::writes`); all of
    /// an alias's or a vector output's.
    fn writes_through<'a>(&self, op_inputs: &'a [SlotId]) -> impl Iterator<Item = SlotId> + 'a {
        let mask = match self {
            BuiltSource::Op(spec, ..) => spec.writes(),
            _ => u64::MAX,
        };
        self.reads(op_inputs)
            .enumerate()
            .filter(move |&(k, _)| k < 64 && mask & (1 << k) != 0)
            .map(|(_, s)| s)
    }
}

/// A build's alias classes: each slot's class and each class's defining
/// slot, by root, and the flags that hold each class.
pub(in crate::build) struct Classes<'r> {
    /// Each slot's class, by root.
    pub(in crate::build) roots: &'r [SlotId],
    /// Each class's defining slot, by root.
    pub(in crate::build) def: &'r [SlotId],
    /// The flags that hold each class, by root (`Builder::hold_all`).
    flags: HashMap<SlotId, Vec<SlotId>>,
    /// The classes a constant flag holds, by root: no request passes them.
    held_always: HashSet<SlotId>,
}

impl<'r> Classes<'r> {
    pub(in crate::build) fn new(b: &Builder<'_>, roots: &'r [SlotId], def: &'r [SlotId]) -> Self {
        let mut flags: HashMap<SlotId, Vec<SlotId>> = HashMap::new();
        for &(s, f) in &b.holds {
            let held = flags.entry(roots[s.index()]).or_default();
            if !held.contains(&f) {
                held.push(f);
            }
        }
        let held_always = flags
            .iter()
            .filter(|(_, fs)| {
                fs.iter().any(|f| {
                    matches!(b.sources[def[roots[f.index()].index()].index()],
                        BuiltSource::Fixed(v) if v != 0.0)
                })
            })
            .map(|(&root, _)| root)
            .collect();
        Classes {
            roots,
            def,
            flags,
            held_always,
        }
    }

    /// The class of slot `s`.
    pub(in crate::build) fn root(&self, s: SlotId) -> SlotId {
        self.roots[s.index()]
    }

    /// The definition of `slot`'s class with `source` as what defines it:
    /// its defining slot's source, or another source a slot of it has (a
    /// later iteration's, a seed).
    pub(in crate::build) fn def_of<'a>(
        &'a self,
        b: &'a Builder<'_>,
        slot: SlotId,
        source: &'a BuiltSource,
    ) -> Def<'a> {
        let root = self.root(slot);
        Def {
            slot,
            source,
            flags: self.flags.get(&root).map_or(&[], Vec::as_slice),
            held_always: self.held_always.contains(&root),
            op_inputs: &b.op_inputs,
        }
    }
}

/// A class as one of its sources defines it, and what holds it: what a
/// walk is given for each class it reaches.
pub(in crate::build) struct Def<'a> {
    pub(in crate::build) slot: SlotId,
    pub(in crate::build) source: &'a BuiltSource,
    flags: &'a [SlotId],
    held_always: bool,
    op_inputs: &'a [SlotId],
}

impl<'a> Def<'a> {
    /// What the class needs to be right: what its source reads, and the
    /// flags that hold it, which a request on it reads.
    pub(in crate::build) fn needs(&self) -> impl Iterator<Item = SlotId> + 'a {
        self.source
            .reads(self.op_inputs)
            .chain(self.flags.iter().copied())
    }

    /// Where a request on the class goes: the inputs its inverse may write,
    /// and nowhere when a constant flag holds it.
    pub(in crate::build) fn request_targets(&self) -> impl Iterator<Item = SlotId> + 'a {
        (!self.held_always)
            .then(|| self.source.writes_through(self.op_inputs))
            .into_iter()
            .flatten()
    }

    /// Whether a constant flag holds the class, so no request reaches it.
    pub(in crate::build) fn held_always(&self) -> bool {
        self.held_always
    }
}

//! The cells a build's slots will make, and what each depends on. Emit
//! merges aliased slots into the cells they will share ([`SlotCells`]);
//! every walk over them reads a cell through its definition ([`Def`]),
//! which offers the two relations a walk may follow:
//!
//! - [`Def::needs`]: what the cell needs to be right: what its defining
//!   source reads, and the flags that hold it. The live walk follows it.
//! - [`Def::request_targets`]: where a request on the cell goes: the inputs
//!   its inverse may write, and nowhere when a constant flag holds it. The
//!   writable walk follows it. A flag is never a target.
//!
//! Evaluation order is neither: the cycle check reads a source's
//! [`BuiltSource::eval_inputs`].

use super::*;

impl BuiltSource {
    /// The slots this source reads: an alias its target, an operator its
    /// inputs (in `op_inputs`), a vector output its head, which reads every
    /// input; a value or a constant none.
    fn reads<'a>(&self, op_inputs: &'a [SlotId]) -> impl Iterator<Item = SlotId> + 'a {
        let (one, many): (Option<SlotId>, &[SlotId]) = match self {
            BuiltSource::Alias(t) => (Some(*t), &[]),
            BuiltSource::Op(_, start, n) => {
                (None, &op_inputs[start.index()..start.index() + *n as usize])
            }
            BuiltSource::VecOut(head, _) => (Some(*head), &[]),
            BuiltSource::Unset | BuiltSource::Given(_) | BuiltSource::Const(_) => (None, &[]),
        };
        one.into_iter().chain(many.iter().copied())
    }

    /// What evaluating this source reads, which decides the order slots
    /// are computed in: the build's graph, which the coverage test holds
    /// to the template graph. A flag that holds the slot is not among
    /// them.
    #[cfg(feature = "testing")]
    pub(in crate::build) fn eval_inputs<'a>(
        &self,
        op_inputs: &'a [SlotId],
    ) -> impl Iterator<Item = SlotId> + 'a {
        self.reads(op_inputs)
    }

    /// Of what this source reads, what a request on it could write through:
    /// an operator's inputs its inverse may write; all of an alias's or a
    /// vector output's.
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

/// The cells a build's slots will make: each slot's cell, each cell's
/// defining slot, and the flags that hold each cell. A cell is named by one
/// of its slots, the root the union-find merged them under, until emit
/// numbers it.
pub(in crate::build) struct SlotCells {
    /// Each slot's cell.
    cell_of: Vec<SlotId>,
    /// Each cell's defining slot, by the cell.
    def: Vec<SlotId>,
    /// The flags that hold each cell.
    flags: HashMap<SlotId, Vec<SlotId>>,
    /// The cells a constant flag holds: no request passes them.
    held_always: HashSet<SlotId>,
}

/// The cells, read: each slot's cell, each cell's defining slot, and a cell's
/// definition as a walk sees it. Made by define.
impl SlotCells {
    /// The cells of `x`'s slots, given each slot's cell and each cell's
    /// defining slot.
    pub(in crate::build) fn new(x: &Expanded<'_>, cell_of: Vec<SlotId>, def: Vec<SlotId>) -> Self {
        let mut flags: HashMap<SlotId, Vec<SlotId>> = HashMap::new();
        for &(s, f) in &x.holds {
            let held = flags.entry(cell_of[s.index()]).or_default();
            if !held.contains(&f) {
                held.push(f);
            }
        }
        let held_always = flags
            .iter()
            .filter(|(_, fs)| {
                fs.iter().any(|f| {
                    matches!(x.sources[def[cell_of[f.index()].index()].index()],
                        BuiltSource::Const(v) if v != 0.0)
                })
            })
            .map(|(&cell, _)| cell)
            .collect();
        SlotCells {
            cell_of,
            def,
            flags,
            held_always,
        }
    }

    /// The cell slot `s` will share.
    pub(in crate::build) fn cell_of(&self, s: SlotId) -> SlotId {
        self.cell_of[s.index()]
    }

    /// The slot that defines `cell`.
    pub(in crate::build) fn def(&self, cell: SlotId) -> SlotId {
        self.def[cell.index()]
    }

    /// Whether slot `s` defines its cell.
    pub(in crate::build) fn defines(&self, s: SlotId) -> bool {
        self.def(self.cell_of(s)) == s
    }

    /// The definition of `slot`'s cell with `source` as what defines it:
    /// its defining slot's source, or another source a slot of it has (a
    /// later iteration's, a seed).
    pub(in crate::build) fn def_of<'a>(
        &'a self,
        x: &'a Expanded<'_>,
        slot: SlotId,
        source: &'a BuiltSource,
    ) -> Def<'a> {
        let cell = self.cell_of(slot);
        Def {
            slot,
            source,
            flags: self.flags.get(&cell).map_or(&[], Vec::as_slice),
            held_always: self.held_always.contains(&cell),
            op_inputs: &x.op_inputs,
        }
    }
}

/// The walks' shared step: backward over the cells the slots will make, as the
/// live and writable walks and orientation go.
impl SlotCells {
    /// Walk backward over the cells the slots will make: from the cells on
    /// `stack`, each cell `enter` admits is given to `edge` as its
    /// definition, then as each other source in `extra` its slots have,
    /// and `edge` pushes the cells to go on to. A cell
    /// `enter` refuses is neither followed nor seen.
    pub(in crate::build) fn walk_cells(
        &self,
        x: &Expanded<'_>,
        mut stack: Vec<SlotId>,
        extra: &[(SlotId, BuiltSource)],
        mut enter: impl FnMut(SlotId) -> bool,
        mut edge: impl FnMut(slot_cells::Def<'_>, &mut Vec<SlotId>),
    ) {
        let mut seen = vec![false; x.sources.len()];
        // The other sources of each cell.
        let mut besides: HashMap<SlotId, Vec<&(SlotId, BuiltSource)>> = HashMap::new();
        for entry in extra {
            besides
                .entry(self.cell_of(entry.0))
                .or_default()
                .push(entry);
        }
        while let Some(cell) = stack.pop() {
            if std::mem::replace(&mut seen[cell.index()], true) || !enter(cell) {
                continue;
            }
            let def = self.def(cell);
            edge(self.def_of(x, def, &x.sources[def.index()]), &mut stack);
            if let Some(entries) = besides.get(&cell) {
                for (slot, src) in entries {
                    edge(self.def_of(x, *slot, src), &mut stack);
                }
            }
        }
    }
}

/// One cell as one of its sources defines it, and what holds it: what a
/// walk is given for each cell it reaches.
pub(in crate::build) struct Def<'a> {
    #[cfg_attr(not(feature = "testing"), allow(dead_code))]
    pub(in crate::build) slot: SlotId,
    pub(in crate::build) source: &'a BuiltSource,
    flags: &'a [SlotId],
    held_always: bool,
    op_inputs: &'a [SlotId],
}

impl<'a> Def<'a> {
    /// What the cell needs to be right: what its source reads, and the
    /// flags that hold it, which a request on it reads.
    pub(in crate::build) fn needs(&self) -> impl Iterator<Item = SlotId> + 'a {
        self.source
            .reads(self.op_inputs)
            .chain(self.flags.iter().copied())
    }

    /// Where a request on the cell goes: the inputs its inverse may write,
    /// and nowhere when a constant flag holds it.
    pub(in crate::build) fn request_targets(&self) -> impl Iterator<Item = SlotId> + 'a {
        (!self.held_always)
            .then(|| self.source.writes_through(self.op_inputs))
            .into_iter()
            .flatten()
    }

    /// Whether a constant flag holds the cell, so no request reaches it.
    pub(in crate::build) fn held_always(&self) -> bool {
        self.held_always
    }
}

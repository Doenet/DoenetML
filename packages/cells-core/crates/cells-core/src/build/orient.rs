//! Orientation: a binary scalar operator's inverse writes its first input,
//! so the input whose sources include state should be first. Before the
//! writable walk, every binary operator lowered from the author's math
//! whose second input leads to state and whose first does not is turned
//! round: `Add`, `Mul`, `Min` and `Max` swap their inputs, `Sub` becomes
//! `RSub` and `Div` becomes `RDiv` with theirs swapped, so the operator
//! computes the same value and a request writes the input that leads
//! somewhere. An input *leads to state* when the writable walk from it
//! reaches a value slot no constant flag holds.
//!
//! A component's own table keeps its operators as written. Operators are
//! oriented from their inputs up, by a depth-first walk from the author's
//! operators; a loop (a recurrence the view folds) counts as not leading
//! where it closes.

use super::*;

/// The operator computing the same value with its two inputs swapped, for
/// the binary operators whose inverse writes their first input.
fn swapped(spec: OpSpec) -> Option<OpSpec> {
    Some(match spec {
        OpSpec::Add | OpSpec::Mul | OpSpec::Min | OpSpec::Max => spec,
        OpSpec::Sub => OpSpec::RSub,
        OpSpec::RSub => OpSpec::Sub,
        OpSpec::Div => OpSpec::RDiv,
        OpSpec::RDiv => OpSpec::Div,
        _ => return None,
    })
}

/// Where a class's sources are: its defining slot's, then its later ones.
#[derive(Clone, Copy)]
enum At {
    Slot(usize),
    Later(usize),
}

impl<'c> Builder<'c> {
    fn source_at(&self, at: At) -> &BuiltSource {
        match at {
            At::Slot(s) => &self.sources[s],
            At::Later(i) => &self.later_sources[i].1,
        }
    }

    fn source_at_mut(&mut self, at: At) -> &mut BuiltSource {
        match at {
            At::Slot(s) => &mut self.sources[s],
            At::Later(i) => &mut self.later_sources[i].1,
        }
    }

    fn slot_at(&self, at: At) -> SlotId {
        match at {
            At::Slot(s) => SlotId::from_index(s),
            At::Later(i) => self.later_sources[i].0,
        }
    }

    /// Orient every binary operator lowered from the author's math. Runs
    /// before the walks, which read the orientation.
    pub(in crate::build) fn orient(&mut self, slot_cells: &SlotCells) {
        if self.author_ops.is_empty() {
            return;
        }
        let n = self.sources.len();
        let mut author = vec![false; n];
        for &s in &self.author_ops {
            author[s.index()] = true;
        }
        let mut later: HashMap<SlotId, Vec<usize>> = HashMap::new();
        for (i, &(s, _)) in self.later_sources.iter().enumerate() {
            later.entry(slot_cells.cell_of(s)).or_default().push(i);
        }
        let sources_of = |cell: SlotId| {
            std::iter::once(At::Slot(slot_cells.def(cell).index())).chain(
                later
                    .get(&cell)
                    .into_iter()
                    .flatten()
                    .map(|&i| At::Later(i)),
            )
        };
        const NEW: u8 = 0;
        const OPEN: u8 = 1;
        const DONE: u8 = 2;
        let mut state = vec![NEW; n];
        let mut leads = vec![false; n];
        // (cell, whether what it needs was pushed)
        let mut stack: Vec<(SlotId, bool)> = Vec::new();
        for k in 0..self.author_ops.len() {
            let first = slot_cells.cell_of(self.author_ops[k]);
            if state[first.index()] != NEW {
                continue;
            }
            stack.push((first, false));
            while let Some((cell, expanded)) = stack.pop() {
                let i = cell.index();
                if expanded {
                    let mut any = false;
                    for at in sources_of(cell) {
                        any |= self.orient_source(at, slot_cells, &leads, &author);
                    }
                    leads[i] = any;
                    state[i] = DONE;
                    continue;
                }
                if state[i] != NEW {
                    continue;
                }
                state[i] = OPEN;
                stack.push((cell, true));
                for at in sources_of(cell) {
                    let def = slot_cells.def_of(self, self.slot_at(at), self.source_at(at));
                    for s in def.needs() {
                        let below = slot_cells.cell_of(s);
                        if state[below.index()] == NEW {
                            stack.push((below, false));
                        }
                    }
                }
            }
        }
    }

    /// Turn the operator at `at` round if it should be, and say whether
    /// the source leads to state; every cell below it is decided.
    fn orient_source(
        &mut self,
        at: At,
        slot_cells: &SlotCells,
        leads: &[bool],
        author: &[bool],
    ) -> bool {
        let leads_from = |s: SlotId| leads[slot_cells.cell_of(s).index()];
        if let BuiltSource::Op(PlannedOp::Spec(spec), start, 2) = *self.source_at(at)
            && author[self.slot_at(at).index()]
            && let Some(turned) = swapped(spec)
            && !leads_from(self.op_inputs[start as usize])
            && leads_from(self.op_inputs[start as usize + 1])
        {
            self.op_inputs.swap(start as usize, start as usize + 1);
            if let BuiltSource::Op(op, ..) = self.source_at_mut(at) {
                *op = PlannedOp::Spec(turned);
            }
        }
        let def = slot_cells.def_of(self, self.slot_at(at), self.source_at(at));
        match def.source {
            BuiltSource::Given(_) => !def.held_always(),
            _ => def.request_targets().any(leads_from),
        }
    }
}

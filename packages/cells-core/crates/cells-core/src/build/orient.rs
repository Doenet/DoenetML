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
//! operators.

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

/// Orientation: a binary operator lowered from the author's math turned round
/// so its inverse writes the input that leads to state. Run by define, before
/// the writable walk.
impl SlotCells {
    /// Orient every binary operator lowered from the author's math. Runs
    /// before the walks, which read the orientation.
    pub(in crate::build) fn orient(&self, x: &mut Expanded<'_>) {
        if x.author_ops.is_empty() {
            return;
        }
        let n = x.sources.len();
        let mut author = vec![false; n];
        for &s in &x.author_ops {
            author[s.index()] = true;
        }
        const NEW: u8 = 0;
        const OPEN: u8 = 1;
        const DONE: u8 = 2;
        let mut state = vec![NEW; n];
        let mut leads = vec![false; n];
        // (cell, whether what it needs was pushed)
        let mut stack: Vec<(SlotId, bool)> = Vec::new();
        for k in 0..x.author_ops.len() {
            let first = self.cell_of(x.author_ops[k]);
            if state[first.index()] != NEW {
                continue;
            }
            stack.push((first, false));
            while let Some((cell, expanded)) = stack.pop() {
                let i = cell.index();
                if expanded {
                    leads[i] = self.orient_source(x, self.def(cell), &leads, &author);
                    state[i] = DONE;
                    continue;
                }
                if state[i] != NEW {
                    continue;
                }
                state[i] = OPEN;
                stack.push((cell, true));
                let at = self.def(cell);
                let def = self.def_of(x, at, &x.sources[at.index()]);
                for s in def.needs() {
                    let below = self.cell_of(s);
                    if state[below.index()] == NEW {
                        stack.push((below, false));
                    }
                }
            }
        }
    }

    /// Turn the operator defining a cell at slot `at` round if it should
    /// be, and say whether the source leads to state; every cell below it
    /// is decided.
    fn orient_source(
        &self,
        x: &mut Expanded<'_>,
        at: SlotId,
        leads: &[bool],
        author: &[bool],
    ) -> bool {
        let leads_from = |s: SlotId| leads[self.cell_of(s).index()];
        if let BuiltSource::Op(PlannedOp::Spec(spec), start, 2) = x.sources[at.index()]
            && author[at.index()]
            && let Some(turned) = swapped(spec)
            && !leads_from(x.op_inputs[start.index()])
            && leads_from(x.op_inputs[start.index() + 1])
        {
            x.op_inputs.swap(start.index(), start.index() + 1);
            if let BuiltSource::Op(op, ..) = &mut x.sources[at.index()] {
                *op = PlannedOp::Spec(turned);
            }
        }
        let def = self.def_of(x, at, &x.sources[at.index()]);
        match def.source {
            BuiltSource::Given(_) => !def.held_always(),
            _ => def.request_targets().any(leads_from),
        }
    }
}

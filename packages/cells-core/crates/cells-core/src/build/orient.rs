//! Orientation (ADR 0024): a binary scalar operator's inverse writes its
//! first input, so the input whose sources include state should be first.
//! After planning and before the writable walk, every binary operator
//! lowered from the author's math (`Builder::author_ops`) whose second input
//! leads to state and whose first does not is turned round:
//! `Add`, `Mul`, `Min` and `Max` swap their inputs, `Sub` becomes `RSub` and
//! `Div` becomes `RDiv` with theirs swapped, so the operator computes the
//! same value and a request writes the input that leads somewhere.
//!
//! An input *leads to state* when the walk the writable walk takes from it
//! (`writable.rs`: to an alias's class, through an operator to the inputs
//! its inverse writes, from a vector output to its head) reaches a value
//! slot, a literal or a default. Where both inputs lead to state the first
//! is written, as before (ADR 0018: `<point x="$k $n"/>` writes `k`); where
//! neither does, a request drops, as before. Turning an operator round only
//! gives a request somewhere to land where it had none.
//!
//! A component's own table keeps its operators as written: its author
//! orders their inputs, and the order can be what keeps a request from a
//! parameter. A sequence's value is `from + (k − 1)·step`; turned round,
//! dragging a point at a sequence value would write the sequence's `from`
//! and move every point, where the current core drops the drag.
//!
//! Whether an input leads to state depends on how the operators below it
//! are oriented, so operators are oriented from their inputs up, by a
//! depth-first walk over alias classes. A loop of classes (a recurrence the
//! view folds) counts as not leading where it closes. The walk follows a
//! slot's later sources too (`Builder::later_sources`), as the writable walk
//! does, so the probe orients what later iterations plan.

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

    /// Orient every binary scalar operator; see the module documentation.
    /// `roots` is each slot's alias class and `class_def` each class's
    /// defining slot, by root.
    pub(in crate::build) fn orient(&mut self, roots: &[SlotId], class_def: &[SlotId]) {
        let n = self.sources.len();
        let mut later: HashMap<SlotId, Vec<usize>> = HashMap::new();
        for (i, &(s, _)) in self.later_sources.iter().enumerate() {
            later.entry(roots[s.index()]).or_default().push(i);
        }
        let sources_of = |root: SlotId| -> Vec<At> {
            let mut at = vec![At::Slot(class_def[root.index()].index())];
            if let Some(entries) = later.get(&root) {
                at.extend(entries.iter().map(|&i| At::Later(i)));
            }
            at
        };
        const NEW: u8 = 0;
        const OPEN: u8 = 1;
        const DONE: u8 = 2;
        let mut state = vec![NEW; n];
        let mut leads = vec![false; n];
        // (class root, whether its inputs were pushed)
        let mut stack: Vec<(SlotId, bool)> = Vec::new();
        for start in 0..n {
            let r = roots[start];
            if state[r.index()] != NEW {
                continue;
            }
            stack.push((r, false));
            while let Some((root, expanded)) = stack.pop() {
                let i = root.index();
                if expanded {
                    let mut any = false;
                    for at in sources_of(root) {
                        any |= self.orient_source(at, roots, &leads);
                    }
                    leads[i] = any;
                    state[i] = DONE;
                    continue;
                }
                if state[i] != NEW {
                    continue;
                }
                state[i] = OPEN;
                stack.push((root, true));
                for at in sources_of(root) {
                    let below: Vec<SlotId> = match self.source_at(at) {
                        BuiltSource::Alias(t) => vec![*t],
                        BuiltSource::Op(_, start, count) => {
                            let start = *start as usize;
                            self.op_inputs[start..start + *count as usize].to_vec()
                        }
                        BuiltSource::VecOut(head, _) => vec![*head],
                        _ => vec![],
                    };
                    for s in below {
                        let r = roots[s.index()];
                        if state[r.index()] == NEW {
                            stack.push((r, false));
                        }
                    }
                }
            }
        }
    }

    /// Turn the operator at `at` round if it should be, and say whether
    /// the source leads to state; every class below it is decided.
    fn orient_source(&mut self, at: At, roots: &[SlotId], leads: &[bool]) -> bool {
        let leads_from = |s: SlotId| leads[roots[s.index()].index()];
        match *self.source_at(at) {
            BuiltSource::Literal(_) | BuiltSource::Default(_) => true,
            BuiltSource::Alias(t) | BuiltSource::VecOut(t, _) => leads_from(t),
            BuiltSource::Fixed(_) | BuiltSource::Unset => false,
            BuiltSource::Op(op, start, count) => {
                let start = start as usize;
                let slot = match at {
                    At::Slot(s) => SlotId::from_index(s),
                    At::Later(i) => self.later_sources[i].0,
                };
                if let (PlannedOp::Spec(spec), 2) = (op, count)
                    && self.author_ops.contains(&slot)
                    && let Some(turned) = swapped(spec)
                    && !leads_from(self.op_inputs[start])
                    && leads_from(self.op_inputs[start + 1])
                {
                    self.op_inputs.swap(start, start + 1);
                    if let BuiltSource::Op(op, ..) = self.source_at_mut(at) {
                        *op = PlannedOp::Spec(turned);
                    }
                }
                let BuiltSource::Op(op, ..) = *self.source_at(at) else {
                    unreachable!()
                };
                let mask = op.writes();
                (0..count as usize)
                    .filter(|&k| k < 64 && mask & (1 << k) != 0)
                    .any(|k| leads_from(self.op_inputs[start + k]))
            }
        }
    }
}

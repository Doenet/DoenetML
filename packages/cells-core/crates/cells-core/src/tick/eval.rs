//! Recompute strategies. All take the changed essential cells as seeds and
//! append the derived cells whose value changed. They must agree on results;
//! they differ only in how much work they do.

use crate::document::CellIdx;
use crate::program::Program;

pub trait Evaluator {
    fn name(&self) -> &'static str;
    /// `changed` holds the essential cells written this tick on entry.
    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>);
}

/// Run every instruction in schedule order, ignoring the seeds.
#[derive(Default)]
pub struct FullRecompute;

impl Evaluator for FullRecompute {
    fn name(&self) -> &'static str {
        "full"
    }
    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        program.run_all_tracking(cells, changed);
    }
}

/// Walk only the downstream closure of the seeds, in schedule order. The
/// schedule is topological, so every instruction a step queues lies after
/// it: a bitset over schedule positions, scanned forward a word at a time,
/// replaces a priority queue. Work is proportional to the closure plus its
/// span over 64.
pub struct DirtyClosure {
    /// dependents[dep_start[cell]..dep_start[cell + 1]] = schedule
    /// positions of instructions reading `cell`, ascending, in
    /// compressed-sparse-row form.
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    /// One bit per schedule position; all clear between ticks.
    dirty: Vec<u64>,
}

impl DirtyClosure {
    pub fn new(program: &Program, n_cells: usize) -> Self {
        let mut dep_start = vec![0u32; n_cells + 1];
        for ins in &program.instrs {
            for input in ins.op.inputs(&program.operands) {
                dep_start[input as usize + 1] += 1;
            }
        }
        for c in 0..n_cells {
            dep_start[c + 1] += dep_start[c];
        }
        let mut fill = dep_start.clone();
        let mut dependents = vec![0u32; dep_start[n_cells] as usize];
        for (i, ins) in program.instrs.iter().enumerate() {
            for input in ins.op.inputs(&program.operands) {
                dependents[fill[input as usize] as usize] = i as u32;
                fill[input as usize] += 1;
            }
        }
        DirtyClosure {
            dep_start,
            dependents,
            dirty: vec![0; program.len().div_ceil(64)],
        }
    }

    /// Mark the readers of `cell`. Readers in word `w` go into `bits`, the
    /// word being scanned, which the caller holds in a register; `hi` is
    /// raised to the highest word marked in `dirty`.
    #[inline(always)]
    fn mark_dependents(&mut self, cell: CellIdx, w: usize, bits: &mut u64, hi: &mut usize) {
        let (s, e) = (
            self.dep_start[cell as usize] as usize,
            self.dep_start[cell as usize + 1] as usize,
        );
        for &i in &self.dependents[s..e] {
            let dw = i as usize / 64;
            let bit = 1u64 << (i % 64);
            if dw == w {
                *bits |= bit;
            } else {
                self.dirty[dw] |= bit;
                *hi = (*hi).max(dw);
            }
        }
    }
}

impl Evaluator for DirtyClosure {
    fn name(&self) -> &'static str {
        "dirty-closure"
    }
    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        let mut lo = usize::MAX;
        let mut hi = 0;
        for &c in changed.iter() {
            if let Some(&first) = self
                .dependents
                .get(self.dep_start[c as usize] as usize..self.dep_start[c as usize + 1] as usize)
                .and_then(|d| d.first())
            {
                lo = lo.min(first as usize / 64);
            }
            // No word is being scanned yet: every mark lands in `dirty`.
            self.mark_dependents(c, usize::MAX, &mut 0, &mut hi);
        }
        if lo == usize::MAX {
            return;
        }
        let mut w = lo;
        while w <= hi {
            let mut bits = std::mem::take(&mut self.dirty[w]);
            while bits != 0 {
                let b = bits.trailing_zeros() as usize;
                bits &= bits - 1;
                let ins = &program.instrs[w * 64 + b];
                let before = changed.len();
                program.step(ins, cells, Some(changed));
                for &c in &changed[before..] {
                    // Readers come later in the schedule: above bit `b`, or in a later word.
                    self.mark_dependents(c, w, &mut bits, &mut hi);
                }
            }
            w += 1;
        }
    }
}

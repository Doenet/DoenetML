//! A push evaluator that computes only what is read: step 2b of
//! `docs/tick-design-decisions.md`. Lazy pull (`pull::Lazy`) wins when a
//! renderer reads a small part of a change; [`PrunedClosure`] asks whether
//! a push core wins the same by not computing what no read needs, keeping
//! the fixed schedule (decision 9).
//!
//! It is the core's `DirtyClosure` (`tick/eval.rs`), copied because its
//! fields are private, with one change: its table of each cell's readers
//! lists only the instructions some wanted cell depends on, worked out
//! once when it is made, as a push core would when the viewport changes.
//! The tick loop is the core's, line for line, so pruning costs nothing
//! per tick. An instruction no wanted cell needs never runs, so its
//! outputs go stale, and the document holds correct values only in what
//! is wanted and what that depends on.

use cells_core::program::Program;
use cells_core::{CellIdx, Evaluator};

const NONE: u32 = u32::MAX;

pub struct PrunedClosure {
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    dirty: Vec<u64>,
}

impl PrunedClosure {
    /// The closure over the instructions that `wanted` depends on.
    pub fn new(program: &Program, n_cells: usize, wanted: &[CellIdx]) -> Self {
        // Every instruction some wanted cell depends on.
        let mut needed = vec![false; program.len()];
        let mut stack: Vec<u32> = wanted
            .iter()
            .map(|&c| program.producer[c as usize])
            .filter(|&p| p != NONE)
            .collect();
        while let Some(i) = stack.pop() {
            if needed[i as usize] {
                continue;
            }
            needed[i as usize] = true;
            for input in program.instrs[i as usize].op.inputs(&program.operands) {
                let p = program.producer[input as usize];
                if p != NONE && !needed[p as usize] {
                    stack.push(p);
                }
            }
        }
        // The core's readers table, of the needed instructions only.
        let mut dep_start = vec![0u32; n_cells + 1];
        for (i, ins) in program.instrs.iter().enumerate() {
            if needed[i] {
                for input in ins.op.inputs(&program.operands) {
                    dep_start[input as usize + 1] += 1;
                }
            }
        }
        for c in 0..n_cells {
            dep_start[c + 1] += dep_start[c];
        }
        let mut fill = dep_start.clone();
        let mut dependents = vec![0u32; dep_start[n_cells] as usize];
        for (i, ins) in program.instrs.iter().enumerate() {
            if needed[i] {
                for input in ins.op.inputs(&program.operands) {
                    dependents[fill[input as usize] as usize] = i as u32;
                    fill[input as usize] += 1;
                }
            }
        }
        PrunedClosure {
            dep_start,
            dependents,
            dirty: vec![0; program.len().div_ceil(64)],
        }
    }

    /// As `DirtyClosure::mark_dependents`.
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

impl Evaluator for PrunedClosure {
    fn name(&self) -> &'static str {
        "pruned"
    }

    /// As `DirtyClosure::recompute`.
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
                    self.mark_dependents(c, w, &mut bits, &mut hi);
                }
            }
            w += 1;
        }
    }
}

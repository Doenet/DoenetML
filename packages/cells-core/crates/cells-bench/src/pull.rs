//! Pull-based evaluators: the alternative to decision 9 of
//! `docs/tick-design-decisions.md`, a schedule fixed at build time. Both
//! find the order of work at run time, by demand: to give a cell its value,
//! first give its inputs theirs. They run the same instructions with the
//! same `Program::step` as the core's evaluators, so what differs is only
//! how the next instruction is found.
//!
//! - [`Pull`] has no incrementality: every tick it reads every derived
//!   cell, in cell order (the document's order), and evaluates what each
//!   needs. Its counterpart is `FullRecompute`.
//! - [`PullInvalidated`] is lazy with push invalidation, as most reactive
//!   systems are: a write marks everything downstream stale, then the stale
//!   instructions are pulled. An instruction whose inputs all came out
//!   unchanged is not run (early cutoff, decision 11, kept). Its
//!   counterpart is `DirtyClosure`.
//!
//! Demand uses an explicit stack, not recursion, so a chain of 100,000 does
//! not overflow; state is in arrays stamped with the tick's epoch, so
//! nothing is cleared between ticks. A real lazy core would compute only
//! the cells a renderer reads; both read every cell here, since a tick's
//! outcome lists every changed cell and the shapes show every value.

use cells_core::program::Program;
use cells_core::{CellIdx, Evaluator};

const NONE: u32 = u32::MAX;

/// State both pull evaluators keep across ticks, sized on the first.
#[derive(Default)]
struct Demand {
    epoch: u32,
    /// The epoch in which each instruction was last brought up to date.
    done: Vec<u32>,
    /// Stack of instructions being demanded.
    stack: Vec<u32>,
}

impl Demand {
    fn size(&mut self, program: &Program) {
        if self.done.len() != program.len() {
            self.done = vec![0; program.len()];
        }
        self.epoch += 1;
    }

    /// Bring instruction `i` up to date, first every input's producer that
    /// `needs` says is not. `run` evaluates an instruction once its inputs
    /// are up to date.
    #[inline(always)]
    fn demand(
        &mut self,
        program: &Program,
        i: u32,
        needs: impl Fn(u32) -> bool,
        mut run: impl FnMut(u32),
    ) {
        let epoch = self.epoch;
        if self.done[i as usize] == epoch {
            return;
        }
        self.stack.push(i);
        while let Some(&j) = self.stack.last() {
            if self.done[j as usize] == epoch {
                self.stack.pop();
                continue;
            }
            let mut ready = true;
            for input in program.instrs[j as usize].op.inputs(&program.operands) {
                let p = program.producer[input as usize];
                if p != NONE && self.done[p as usize] != epoch && needs(p) {
                    self.stack.push(p);
                    ready = false;
                }
            }
            if ready {
                run(j);
                self.done[j as usize] = epoch;
                self.stack.pop();
            }
        }
    }
}

/// Every derived cell read in cell order, each evaluated on demand.
#[derive(Default)]
pub struct Pull {
    d: Demand,
}

impl Evaluator for Pull {
    fn name(&self) -> &'static str {
        "pull"
    }

    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        self.d.size(program);
        for c in 0..cells.len() {
            let p = program.producer[c];
            if p == NONE {
                continue;
            }
            self.d.demand(
                program,
                p,
                |_| true,
                |j| program.step(&program.instrs[j as usize], cells, Some(changed)),
            );
        }
    }
}

/// Invalidate downstream of the writes, then pull what is stale.
#[derive(Default)]
pub struct PullInvalidated {
    d: Demand,
    /// The readers of each cell, in compressed-sparse-row form.
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    /// The epoch in which each instruction was made stale.
    stale: Vec<u32>,
    /// The epoch in which each cell's value changed.
    cell_changed: Vec<u32>,
    /// The stale instructions of this tick, in the order invalidation met them.
    order: Vec<u32>,
    walk: Vec<CellIdx>,
}

impl PullInvalidated {
    fn tables(&mut self, program: &Program, n_cells: usize) {
        if self.stale.len() == program.len() && self.cell_changed.len() == n_cells {
            return;
        }
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
        self.dep_start = dep_start;
        self.dependents = dependents;
        self.stale = vec![0; program.len()];
        self.cell_changed = vec![0; n_cells];
    }
}

impl Evaluator for PullInvalidated {
    fn name(&self) -> &'static str {
        "pull-invalidated"
    }

    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        self.tables(program, cells.len());
        self.d.size(program);
        let epoch = self.d.epoch;

        // Push: mark every instruction downstream of a write stale.
        self.order.clear();
        self.walk.clear();
        for &c in changed.iter() {
            self.cell_changed[c as usize] = epoch;
            self.walk.push(c);
        }
        while let Some(c) = self.walk.pop() {
            let (s, e) = (
                self.dep_start[c as usize] as usize,
                self.dep_start[c as usize + 1] as usize,
            );
            for &i in &self.dependents[s..e] {
                if self.stale[i as usize] != epoch {
                    self.stale[i as usize] = epoch;
                    self.order.push(i);
                    let ins = &program.instrs[i as usize];
                    for k in 0..ins.op.n_out() {
                        self.walk.push(ins.out + k as CellIdx);
                    }
                }
            }
        }

        // Pull: bring every stale instruction up to date, running one only
        // if an input changed this tick.
        let stale = &self.stale;
        let cell_changed = &mut self.cell_changed;
        for &i in &self.order {
            self.d.demand(
                program,
                i,
                |p| stale[p as usize] == epoch,
                |j| {
                    let ins = &program.instrs[j as usize];
                    if ins
                        .op
                        .inputs(&program.operands)
                        .any(|c| cell_changed[c as usize] == epoch)
                    {
                        let before = changed.len();
                        program.step(ins, cells, Some(changed));
                        for &c in &changed[before..] {
                            cell_changed[c as usize] = epoch;
                        }
                    }
                },
            );
        }
    }
}

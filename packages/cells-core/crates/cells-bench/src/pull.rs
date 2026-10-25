//! Evaluators that are the alternatives to decision 9 of
//! `docs/tick-design-decisions.md`, a push schedule fixed at build time.
//! All run the same instructions with the same `Program::step` as the
//! core's evaluators, on the core's cells.
//!
//! Two find the order of work at run time by checking readiness: an
//! instruction runs once its inputs' producers have, found by demand (to
//! give a cell its value, first give its inputs theirs). They compute
//! everything the core's evaluators do, so they measure only the cost of
//! finding the order at run time:
//!
//! - [`ReadyAll`]: every tick, every derived cell, read in cell order (the
//!   document's). Its counterpart is `FullRecompute`.
//! - [`ReadyClosure`]: a write marks everything downstream stale, then each
//!   stale instruction is brought up to date by demand, running only if an
//!   input changed this tick (early cutoff, decision 11, kept). Its
//!   counterpart is `DirtyClosure`.
//!
//! The third is pull evaluation proper, which computes only what is read:
//!
//! - [`Lazy`]: a write marks everything downstream stale, and stale stays
//!   stale until a read needs it. The `wanted` cells (what a renderer
//!   shows) are observed: invalidation that reaches one queues it, and the
//!   tick reads the queued ones, bringing up to date what they need, as
//!   the effects of a reactive UI library do. Version
//!   counters decide whether a stale instruction must run: one runs only if
//!   an input changed since it last ran. The cells it does not read are
//!   left stale, so its document holds correct values only in what it
//!   read, and a tick's changed list names only what it computed.
//!
//! Demand uses an explicit stack, not recursion, so a chain of 100,000 does
//! not overflow.

use cells_core::program::Program;
use cells_core::{CellIdx, Evaluator};

const NONE: u32 = u32::MAX;

/// State the readiness evaluators keep across ticks, sized on the first:
/// stamped with the tick's epoch, so nothing is cleared between ticks.
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
pub struct ReadyAll {
    d: Demand,
}

impl Evaluator for ReadyAll {
    fn name(&self) -> &'static str {
        "ready_all"
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

/// Invalidate downstream of the writes, then bring what is stale up to
/// date by demand.
#[derive(Default)]
pub struct ReadyClosure {
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

impl ReadyClosure {
    fn tables(&mut self, program: &Program, n_cells: usize) {
        if self.stale.len() == program.len() && self.cell_changed.len() == n_cells {
            return;
        }
        (self.dep_start, self.dependents) = readers(program, n_cells);
        self.stale = vec![0; program.len()];
        self.cell_changed = vec![0; n_cells];
    }
}

/// The readers of each cell in compressed-sparse-row form:
/// `dependents[dep_start[c]..dep_start[c + 1]]` are the instructions reading `c`.
fn readers(program: &Program, n_cells: usize) -> (Vec<u32>, Vec<u32>) {
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
    (dep_start, dependents)
}

impl Evaluator for ReadyClosure {
    fn name(&self) -> &'static str {
        "ready_closure"
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

/// Pull evaluation proper: invalidate downstream of the writes, then read
/// only the wanted cells.
pub struct Lazy {
    wanted: Vec<CellIdx>,
    /// Whether each instruction produces a wanted cell.
    observed: Vec<bool>,
    /// The observed instructions this tick's invalidation reached.
    to_read: Vec<u32>,
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    /// Whether each instruction's outputs may be out of date. Kept across
    /// ticks: what no read needs stays stale.
    stale: Vec<bool>,
    /// The version at which each instruction last ran, and at which each
    /// cell's value last changed.
    ran_at: Vec<u64>,
    changed_at: Vec<u64>,
    version: u64,
    stack: Vec<u32>,
    walk: Vec<CellIdx>,
}

impl Lazy {
    /// An evaluator whose ticks read `wanted`. The document must be fully
    /// computed when it first ticks, as a load leaves it.
    pub fn new(wanted: Vec<CellIdx>) -> Self {
        Lazy {
            wanted,
            observed: Vec::new(),
            to_read: Vec::new(),
            dep_start: Vec::new(),
            dependents: Vec::new(),
            stale: Vec::new(),
            ran_at: Vec::new(),
            changed_at: Vec::new(),
            version: 0,
            stack: Vec::new(),
            walk: Vec::new(),
        }
    }
}

impl Evaluator for Lazy {
    fn name(&self) -> &'static str {
        "lazy"
    }

    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        if self.stale.len() != program.len() || self.changed_at.len() != cells.len() {
            (self.dep_start, self.dependents) = readers(program, cells.len());
            self.stale = vec![false; program.len()];
            self.ran_at = vec![0; program.len()];
            self.changed_at = vec![0; cells.len()];
            self.observed = vec![false; program.len()];
            for &w in &self.wanted {
                let p = program.producer[w as usize];
                if p != NONE {
                    self.observed[p as usize] = true;
                }
            }
        }
        self.version += 1;
        let version = self.version;

        // Invalidate: everything downstream of a write is stale. What is
        // already stale has its downstream stale too, so the walk stops there.
        self.walk.clear();
        self.to_read.clear();
        for &c in changed.iter() {
            self.changed_at[c as usize] = version;
            self.walk.push(c);
        }
        while let Some(c) = self.walk.pop() {
            let (s, e) = (
                self.dep_start[c as usize] as usize,
                self.dep_start[c as usize + 1] as usize,
            );
            for &i in &self.dependents[s..e] {
                if !self.stale[i as usize] {
                    self.stale[i as usize] = true;
                    if self.observed[i as usize] {
                        self.to_read.push(i);
                    }
                    let ins = &program.instrs[i as usize];
                    for k in 0..ins.op.n_out() {
                        self.walk.push(ins.out + k as CellIdx);
                    }
                }
            }
        }

        // Read the observed cells invalidation reached, bringing up to date
        // what they need.
        for &p in &self.to_read {
            if !self.stale[p as usize] {
                continue;
            }
            self.stack.push(p);
            while let Some(&j) = self.stack.last() {
                if !self.stale[j as usize] {
                    self.stack.pop();
                    continue;
                }
                let ins = &program.instrs[j as usize];
                let mut ready = true;
                for input in ins.op.inputs(&program.operands) {
                    let q = program.producer[input as usize];
                    if q != NONE && self.stale[q as usize] {
                        self.stack.push(q);
                        ready = false;
                    }
                }
                if !ready {
                    continue;
                }
                let ran_at = self.ran_at[j as usize];
                if ins
                    .op
                    .inputs(&program.operands)
                    .any(|c| self.changed_at[c as usize] > ran_at)
                {
                    let before = changed.len();
                    program.step(ins, cells, Some(changed));
                    for &c in &changed[before..] {
                        self.changed_at[c as usize] = version;
                    }
                }
                self.ran_at[j as usize] = version;
                self.stale[j as usize] = false;
                self.stack.pop();
            }
        }
    }
}

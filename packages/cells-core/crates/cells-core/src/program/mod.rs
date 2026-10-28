//! The instruction set: what the build emits and a tick runs. An
//! instruction and its unbound spec are in `instr.rs`; the operator, with
//! the scalar operators' evaluation and inverse rules, in `scalar.rs`; the
//! vector operators and theirs in `vector.rs`. This file holds the
//! instruction list and its topological schedule. The inversion engine that drives the inverses is
//! `tick/invert.rs`.

use crate::sym::{Engine, Handle};

use crate::document::CellIdx;
mod instr;
mod ops;
mod scalar;
mod vector;

pub use instr::{Instr, MemoIdx, OperandIdx, Operands, Post, SAMPLES, SymKind};
pub use scalar::{EQ_TOL, Inverse, Op, OpSpec, js_round};
pub use vector::{MAX_VEC_IN, Pivot, Produced, RigidOpts, VecOp};

/// What a cell's `f64` means: a number, a string id into the document's
/// string table, or an expression handle in the symbolic engine. Recorded
/// by the build for every cell, from the source that defines the cell; the
/// tick only reads it when a request arrives, never while recomputing.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
#[repr(u8)]
pub enum ValueType {
    #[default]
    Number,
    Text,
    Math,
}

/// What a program's symbolic instructions keep between runs: for each,
/// from its `MemoIdx`, the input values it last ran on and its outputs
/// from that run; with scratch for `SampleTape` and counters. Owned by the
/// document beside its program, which stays read-only while a tick runs.
#[derive(Debug, Clone, Default)]
pub struct SymState {
    memo: Vec<f64>,
    pub stats: SymStats,
    /// Scratch columns for `SampleTape`.
    tape_stack: Vec<f64>,
}

impl SymState {
    /// The state of `program`'s symbolic instructions before any has run.
    pub fn new(program: &Program) -> Self {
        SymState {
            memo: vec![NEVER; program.memo_len],
            stats: SymStats::default(),
            tape_stack: Vec::new(),
        }
    }
}

/// What running a program writes besides its cells: its symbolic
/// instructions' state and the session's engine they call.
pub struct SymRun<'a> {
    pub state: &'a mut SymState,
    pub engine: &'a mut Engine,
}

impl SymRun<'_> {
    /// The same run, reborrowed for a call.
    pub fn reborrow(&mut self) -> SymRun<'_> {
        SymRun {
            state: self.state,
            engine: self.engine,
        }
    }
}

/// Counters for the cutoff measurement.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub struct SymStats {
    /// Symbolic instructions stepped.
    pub steps: u64,
    /// Of those, how many called the engine (an input had changed).
    pub runs: u64,
}

/// Bits no computation produces: a memo that has never run matches no input.
const NEVER: f64 = f64::from_bits(0x7ff8_dead_beef_0001);

/// Instructions in a valid evaluation order: every instruction's inputs are
/// either essential cells or outputs of earlier instructions.
#[derive(Debug, Clone, Default)]
pub struct Program {
    pub instrs: Vec<Instr>,
    /// producer[cell] = index into `instrs` of the instruction writing that
    /// cell, or `u32::MAX` for essential and fixed cells. A vector
    /// instruction produces several consecutive cells.
    pub producer: Vec<u32>,
    /// Every input of a vector or symbolic instruction, indexed by
    /// `OperandIdx`.
    pub operands: Vec<CellIdx>,
    /// How many memo entries its symbolic instructions take (`SymState`).
    pub memo_len: usize,
    /// Compiled curves that `SampleTape` instructions run.
    pub tapes: Vec<crate::sym::tape::Tape>,
    /// Whether creation order was already a valid evaluation order, so no
    /// sort ran. Diagnostic.
    pub in_creation_order: bool,
}

#[inline(always)]
fn differs(new: f64, old: f64) -> bool {
    new != old && !(new.is_nan() && old.is_nan())
}

impl Program {
    /// Orders `instrs` topologically. Returns the cell index of an output
    /// involved in a cycle on failure.
    ///
    /// Fast path: the builder emits instructions in creation order, which
    /// for a template stamped per iteration is almost always already a valid
    /// evaluation order (within an iteration the template is in document
    /// order; a lag of `k - d` reads an earlier iteration). One linear pass
    /// checks that every input is essential, fixed, or produced earlier; only
    /// when that fails does the general sort run.
    pub fn schedule(
        instrs: Vec<Instr>,
        n_cells: usize,
        operands: Operands,
    ) -> std::result::Result<Program, CellIdx> {
        let Operands {
            cells: operands,
            memo_len,
        } = operands;
        let mut producer = vec![u32::MAX; n_cells];
        for (i, ins) in instrs.iter().enumerate() {
            for k in 0..ins.op.n_out() {
                let out = ins.out as usize + k;
                debug_assert_eq!(producer[out], u32::MAX, "two instructions write one cell");
                producer[out] = i as u32;
            }
        }
        let in_order = instrs.iter().enumerate().all(|(i, ins)| {
            ins.op.inputs(&operands).all(|input| {
                let p = producer[input as usize];
                p == u32::MAX || (p as usize) < i
            })
        });
        if in_order {
            return Ok(Program {
                instrs,
                producer,
                operands,
                memo_len,
                tapes: Vec::new(),
                in_creation_order: true,
            });
        }

        // Kahn's algorithm over instructions, with the dependents lists in
        // compressed-sparse-row form (two counting passes, no per-instruction
        // allocation).
        let n = instrs.len();
        let mut indegree = vec![0u32; n];
        let mut dep_count = vec![0u32; n + 1];
        for ins in instrs.iter() {
            for input in ins.op.inputs(&operands) {
                let p = producer[input as usize];
                if p != u32::MAX {
                    dep_count[p as usize + 1] += 1;
                }
            }
        }
        for i in 0..n {
            dep_count[i + 1] += dep_count[i];
        }
        let mut fill = dep_count.clone();
        let mut dependents = vec![0u32; dep_count[n] as usize];
        for (i, ins) in instrs.iter().enumerate() {
            for input in ins.op.inputs(&operands) {
                let p = producer[input as usize];
                if p != u32::MAX {
                    indegree[i] += 1;
                    dependents[fill[p as usize] as usize] = i as u32;
                    fill[p as usize] += 1;
                }
            }
        }
        let mut ready: Vec<u32> = (0..n as u32)
            .filter(|&i| indegree[i as usize] == 0)
            .collect();
        ready.reverse();
        let mut order = Vec::with_capacity(n);
        while let Some(i) = ready.pop() {
            order.push(instrs[i as usize]);
            for &d in
                &dependents[dep_count[i as usize] as usize..dep_count[i as usize + 1] as usize]
            {
                indegree[d as usize] -= 1;
                if indegree[d as usize] == 0 {
                    ready.push(d);
                }
            }
        }
        if order.len() != n {
            let stuck = (0..n).find(|&i| indegree[i] > 0).unwrap();
            return Err(instrs[stuck].out);
        }
        let mut producer = vec![u32::MAX; n_cells];
        for (i, ins) in order.iter().enumerate() {
            for k in 0..ins.op.n_out() {
                producer[ins.out as usize + k] = i as u32;
            }
        }
        Ok(Program {
            instrs: order,
            producer,
            operands,
            memo_len,
            tapes: Vec::new(),
            in_creation_order: false,
        })
    }

    /// Evaluate one instruction into `cells`. With `changed`, outputs whose
    /// value changed are appended (NaN to NaN counts as unchanged).
    #[inline(always)]
    pub fn step(
        &self,
        ins: &Instr,
        sym: &mut SymRun,
        cells: &mut [f64],
        changed: Option<&mut Vec<CellIdx>>,
    ) {
        let out = ins.out as usize;
        if let Op::Sym(kind, start, n, memo) = ins.op {
            self.step_sym(kind, start, n as usize, memo, sym, out, cells, changed);
        } else if let Op::Vec(..) = ins.op {
            let mut buf = [0.0f64; 16];
            let n = ins.op.n_out();
            ins.op.eval_vec(cells, &self.operands, &mut buf[..n]);
            match changed {
                Some(changed) => {
                    for k in 0..n {
                        if differs(buf[k], cells[out + k]) {
                            cells[out + k] = buf[k];
                            changed.push((out + k) as CellIdx);
                        }
                    }
                }
                None => cells[out..out + n].copy_from_slice(&buf[..n]),
            }
        } else {
            let new = ins.op.eval(cells);
            match changed {
                Some(changed) => {
                    if differs(new, cells[out]) {
                        cells[out] = new;
                        changed.push(ins.out);
                    }
                }
                None => cells[out] = new,
            }
        }
    }

    /// Run `f`, which steps on a copy of the cells (`step_lookahead`), and
    /// forget every expression it stored: what a request would do
    /// (`tick::invert::realize`) is evaluated without leaving anything in
    /// the session's engine or in a memo. `f` must keep no handle.
    pub fn lookahead<R>(sym: &mut SymRun, f: impl FnOnce(&mut SymRun) -> R) -> R {
        sym.engine.begin_scratch();
        let r = f(sym);
        sym.engine.end_scratch();
        r
    }

    /// Evaluate one instruction into a copy of the cells, within
    /// `lookahead`: a symbolic instruction runs without its memo, which
    /// keeps the inputs it last ran on in the document's cells.
    pub fn step_lookahead(&self, ins: &Instr, sym: &mut SymRun, cells: &mut [f64]) {
        let Op::Sym(kind, start, n, _) = ins.op else {
            return self.step(ins, sym, cells, None);
        };
        let out = ins.out as usize;
        let inputs = self.operands_at(start, n as usize);
        let mut outs = vec![0.0; kind.n_out()];
        if let SymKind::SampleTape { tape } = kind {
            let stack = &mut sym.state.tape_stack;
            run_tape(&self.tapes[tape as usize], cells, inputs, &mut outs, stack);
        } else {
            run_sym(sym.engine, kind, cells, inputs, &mut outs);
        }
        cells[out..out + outs.len()].copy_from_slice(&outs);
    }

    /// A symbolic instruction: rerun only if an input changed since its last
    /// run, then write the outputs of that run. Keyed on input values rather
    /// than on a dirty flag, so stepping on a scratch copy (the reference
    /// evaluator) gives the same answer as stepping on the cells.
    #[inline(never)]
    #[allow(clippy::too_many_arguments)]
    fn step_sym(
        &self,
        kind: SymKind,
        start: OperandIdx,
        n: usize,
        memo: MemoIdx,
        sym: &mut SymRun,
        out: usize,
        cells: &mut [f64],
        changed: Option<&mut Vec<CellIdx>>,
    ) {
        let n_out = kind.n_out();
        let inputs = self.operands_at(start, n);
        let state = &mut *sym.state;
        let (last, outs) = state.memo[memo.index()..memo.index() + n + n_out].split_at_mut(n);
        state.stats.steps += 1;
        if !inputs
            .iter()
            .zip(last.iter())
            .all(|(&c, m)| cells[c as usize].to_bits() == m.to_bits())
        {
            state.stats.runs += 1;
            for (m, &c) in last.iter_mut().zip(inputs) {
                *m = cells[c as usize];
            }
            if let SymKind::SampleTape { tape } = kind {
                let stack = &mut state.tape_stack;
                run_tape(&self.tapes[tape as usize], cells, inputs, outs, stack);
            } else {
                run_sym(sym.engine, kind, cells, inputs, outs);
            }
        }
        match changed {
            Some(changed) => {
                for (k, &v) in outs.iter().enumerate() {
                    if differs(v, cells[out + k]) {
                        cells[out + k] = v;
                        changed.push((out + k) as CellIdx);
                    }
                }
            }
            None => cells[out..out + n_out].copy_from_slice(outs),
        }
    }

    /// The `n` input cells parked from `start`.
    #[inline(always)]
    pub fn operands_at(&self, start: OperandIdx, n: usize) -> &[CellIdx] {
        &self.operands[start.index()..start.index() + n]
    }

    /// Evaluate one instruction's outputs into `out` without writing cells.
    pub fn eval_into(&self, ins: &Instr, sym: &mut SymRun, cells: &[f64], out: &mut [f64]) {
        let mut scratch = cells.to_vec();
        self.step(ins, sym, &mut scratch, None);
        out.copy_from_slice(&scratch[ins.out as usize..ins.out as usize + ins.op.n_out()]);
    }

    /// Recompute every derived cell, appending the indices whose value
    /// changed to `changed`. NaN to NaN counts as unchanged. Never inlined:
    /// the tick's hot loop then compiles the same whatever its caller does.
    #[inline(never)]
    pub fn run_all_tracking(
        &self,
        sym: &mut SymRun,
        cells: &mut [f64],
        changed: &mut Vec<CellIdx>,
    ) {
        for ins in &self.instrs {
            self.step(ins, sym, cells, Some(changed));
        }
    }

    /// Recompute every derived cell in schedule order.
    #[inline]
    pub fn run_all(&self, sym: &mut SymRun, cells: &mut [f64]) {
        for ins in &self.instrs {
            self.step(ins, sym, cells, None);
        }
    }

    /// Whether any input of `ins` differs between two cell arrays.
    #[inline]
    pub fn any_input_differs(&self, ins: &Instr, a: &[f64], b: &[f64]) -> bool {
        ins.op
            .inputs(&self.operands)
            .any(|c| differs(a[c as usize], b[c as usize]))
    }

    pub fn len(&self) -> usize {
        self.instrs.len()
    }

    pub fn is_empty(&self) -> bool {
        self.instrs.is_empty()
    }
}

/// A compiled curve: inputs are `xmin`, `xmax`, then the parameters.
fn run_tape(
    tape: &crate::sym::tape::Tape,
    cells: &[f64],
    inputs: &[CellIdx],
    out: &mut [f64],
    stack: &mut Vec<f64>,
) {
    let (lo, hi) = (cells[inputs[0] as usize], cells[inputs[1] as usize]);
    if !lo.is_finite() || !hi.is_finite() {
        out.fill(f64::NAN);
        return;
    }
    let step = (hi - lo) / (SAMPLES - 1) as f64;
    let mut xs = [0.0f64; SAMPLES];
    for (i, x) in xs.iter_mut().enumerate() {
        *x = lo + step * i as f64;
    }
    let params: Vec<f64> = inputs[2..].iter().map(|&c| cells[c as usize]).collect();
    tape.eval_many(&params, &xs, out, stack);
}

fn handle(v: f64) -> Option<Handle> {
    (!v.is_nan()).then_some(v as Handle)
}

/// One symbolic operation. A NaN handle is a blank expression: evaluating it
/// gives NaN, comparing it gives 0.
fn run_sym(engine: &mut Engine, kind: SymKind, cells: &[f64], inputs: &[CellIdx], out: &mut [f64]) {
    let v = |k: usize| cells[inputs[k] as usize];
    match kind {
        SymKind::Instantiate { template, post } => {
            let h = engine.instantiate(template, cells);
            let h = match post {
                crate::program::Post::None => h,
                crate::program::Post::Simplify => engine.simplify(h),
                crate::program::Post::Expand => engine.expand(h),
                crate::program::Post::SimplifyExpand => {
                    let h = engine.simplify(h);
                    engine.expand(h)
                }
            };
            out[0] = h as f64;
        }
        SymKind::Evaluate => out[0] = handle(v(0)).map_or(f64::NAN, |h| engine.evaluate(h, None)),
        SymKind::EvalAt => {
            out[0] = handle(v(0)).map_or(f64::NAN, |h| engine.evaluate(h, Some(("x", v(1)))))
        }
        SymKind::Derivative => {
            out[0] = handle(v(0)).map_or(f64::NAN, |h| engine.derivative(h, "x") as f64)
        }
        SymKind::Equals | SymKind::EqualsSyntax => {
            out[0] = match (handle(v(0)), handle(v(1))) {
                (Some(a), Some(b)) => {
                    let eq = if kind == SymKind::Equals {
                        engine.equals(a, b)
                    } else {
                        engine.equals_syntax(a, b)
                    };
                    if eq { 1.0 } else { 0.0 }
                }
                _ => 0.0,
            }
        }
        SymKind::SampleTape { .. } => unreachable!("tapes run in step_sym"),
        SymKind::Sample => {
            let (lo, hi) = (v(1), v(2));
            match handle(v(0)) {
                Some(h) if lo.is_finite() && hi.is_finite() => {
                    let step = (hi - lo) / (SAMPLES - 1) as f64;
                    let xs: Vec<f64> = (0..SAMPLES).map(|i| lo + step * i as f64).collect();
                    engine.evaluate_many(h, "x", &xs, out);
                }
                _ => out.fill(f64::NAN),
            }
        }
    }
}

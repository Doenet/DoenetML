//! The instruction set: what the build emits and a tick runs. An
//! instruction and its unbound spec are in `instr.rs`; the operator, with
//! the scalar operators' evaluation and inverse rules, in `scalar.rs`; the
//! vector operators and theirs in `vector.rs`. This file holds the
//! instruction list and its topological schedule. The inversion engine that drives the inverses is
//! `tick/invert.rs`.

use std::cell::{Cell, RefCell};

use cells_sym::{Handle, SymEngine};

use crate::document::CellIdx;
mod instr;
mod scalar;
mod vector;

pub use instr::{Instr, OpSpec, Post, SAMPLES, SymKind};
pub use scalar::{EQ_TOL, Op, js_round};
pub use vector::{MAX_VEC_IN, Pivot, Produced, RigidOpts, VecOp};

/// The document's symbolic engine and the memo of every symbolic
/// instruction. Interior mutability because instructions run through
/// `&Program`; the engine only grows (see `SymEngine`).
#[derive(Debug, Clone)]
pub struct Sym {
    pub engine: RefCell<Box<dyn SymEngine>>,
    /// Parallel to `Program::operands`: for a symbolic instruction, the input
    /// values it last ran on, then its outputs from that run.
    memo: RefCell<Vec<f64>>,
    pub stats: Cell<SymStats>,
    /// Scratch columns for `SampleTape`.
    tape_stack: RefCell<Vec<f64>>,
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

impl Default for Sym {
    fn default() -> Self {
        Sym::new(Box::new(cells_sym::flat::Flat::new()))
    }
}

impl Sym {
    pub fn new(engine: Box<dyn SymEngine>) -> Self {
        Sym {
            engine: RefCell::new(engine),
            memo: RefCell::new(Vec::new()),
            stats: Cell::new(SymStats::default()),
            tape_stack: RefCell::new(Vec::new()),
        }
    }

    pub fn into_engine(self) -> Box<dyn SymEngine> {
        self.engine.into_inner()
    }
}

/// Instructions in a valid evaluation order: every instruction's inputs are
/// either essential cells or outputs of earlier instructions.
#[derive(Debug, Clone, Default)]
pub struct Program {
    pub instrs: Vec<Instr>,
    /// producer[cell] = index into `instrs` of the instruction writing that
    /// cell, or `u32::MAX` for essential and fixed cells. A vector
    /// instruction produces several consecutive cells.
    pub producer: Vec<u32>,
    /// The symbolic engine that math cells' handles index.
    pub sym: Sym,
    /// Every input of a vector or symbolic instruction (and, after a
    /// symbolic instruction's inputs, placeholders for its memo).
    pub operands: Vec<CellIdx>,
    /// Whether each cell holds an expression handle (a math cell).
    pub is_math: Vec<bool>,
    /// Compiled curves that `SampleTape` instructions run.
    pub tapes: Vec<cells_sym::tape::Tape>,
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
    /// involved in a cycle on failure, with the engine handed back.
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
        sym: Sym,
        operands: Vec<CellIdx>,
        is_math: Vec<bool>,
    ) -> std::result::Result<Program, (CellIdx, Sym)> {
        sym.memo.replace(vec![NEVER; operands.len()]);
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
                sym,
                operands,
                is_math,
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
            return Err((instrs[stuck].out, sym));
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
            sym,
            operands,
            is_math,
            tapes: Vec::new(),
            in_creation_order: false,
        })
    }

    /// Evaluate one instruction into `cells`. With `changed`, outputs whose
    /// value changed are appended (NaN to NaN counts as unchanged).
    #[inline(always)]
    pub fn step(&self, ins: &Instr, cells: &mut [f64], changed: Option<&mut Vec<CellIdx>>) {
        let out = ins.out as usize;
        if let Op::Sym(kind, start, n) = ins.op {
            self.step_sym(kind, start as usize, n as usize, out, cells, changed);
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

    /// A symbolic instruction: rerun only if an input changed since its last
    /// run, then write the outputs of that run. Keyed on input values rather
    /// than on a dirty flag, so stepping on a scratch copy (`realize`, the
    /// reference evaluator) gives the same answer as stepping on the cells.
    #[inline(never)]
    fn step_sym(
        &self,
        kind: SymKind,
        start: usize,
        n: usize,
        out: usize,
        cells: &mut [f64],
        changed: Option<&mut Vec<CellIdx>>,
    ) {
        let n_out = kind.n_out();
        let inputs = &self.operands[start..start + n];
        let mut memo = self.sym.memo.borrow_mut();
        let (last, outs) = memo[start..start + n + n_out].split_at_mut(n);
        let mut stats = self.sym.stats.get();
        stats.steps += 1;
        if !inputs
            .iter()
            .zip(last.iter())
            .all(|(&c, m)| cells[c as usize].to_bits() == m.to_bits())
        {
            stats.runs += 1;
            for (m, &c) in last.iter_mut().zip(inputs) {
                *m = cells[c as usize];
            }
            if let SymKind::SampleTape { tape } = kind {
                self.run_tape(&self.tapes[tape as usize], cells, inputs, outs);
            } else {
                let mut engine = self.sym.engine.borrow_mut();
                run_sym(&mut **engine, kind, cells, inputs, outs);
            }
        }
        self.sym.stats.set(stats);
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

    /// A compiled curve: inputs are `xmin`, `xmax`, then the parameters.
    fn run_tape(
        &self,
        tape: &cells_sym::tape::Tape,
        cells: &[f64],
        inputs: &[CellIdx],
        out: &mut [f64],
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
        let mut stack = self.sym.tape_stack.borrow_mut();
        tape.eval_many(&params, &xs, out, &mut stack);
    }

    /// Evaluate one instruction's outputs into `out` without writing cells.
    pub fn eval_into(&self, ins: &Instr, cells: &[f64], out: &mut [f64]) {
        let mut scratch = cells.to_vec();
        self.step(ins, &mut scratch, None);
        out.copy_from_slice(&scratch[ins.out as usize..ins.out as usize + ins.op.n_out()]);
    }

    /// Recompute every derived cell, appending the indices whose value
    /// changed to `changed`. NaN to NaN counts as unchanged. Never inlined:
    /// the tick's hot loop then compiles the same whatever its caller does.
    #[inline(never)]
    pub fn run_all_tracking(&self, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        for ins in &self.instrs {
            self.step(ins, cells, Some(changed));
        }
    }

    /// Recompute every derived cell in schedule order.
    #[inline]
    pub fn run_all(&self, cells: &mut [f64]) {
        for ins in &self.instrs {
            self.step(ins, cells, None);
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

fn handle(v: f64) -> Option<Handle> {
    (!v.is_nan()).then_some(v as Handle)
}

/// One symbolic operation. A NaN handle is a blank expression: evaluating it
/// gives NaN, comparing it gives 0.
fn run_sym(
    engine: &mut dyn SymEngine,
    kind: SymKind,
    cells: &[f64],
    inputs: &[CellIdx],
    out: &mut [f64],
) {
    let v = |k: usize| cells[inputs[k] as usize];
    match kind {
        SymKind::Instantiate { template, post } => {
            let h = engine.instantiate(template, cells);
            let h = match post {
                crate::program::Post::None => h,
                crate::program::Post::Simplify => engine.simplify(h),
                crate::program::Post::Expand => engine.expand(h),
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

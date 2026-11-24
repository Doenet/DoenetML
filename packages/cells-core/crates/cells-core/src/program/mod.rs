//! The instruction set: what the build emits and a tick runs. This module
//! holds the instruction list and its topological schedule.

use crate::sym::{Engine, Handle};

use crate::index::CellIdx;
mod instr;
mod ops;
mod range;
pub(crate) mod refuse;
mod scalar;
pub mod texts;
mod vector;

pub use instr::{
    BEZIER_POINT_CELLS, DOMAIN_CELLS, INTERPOLATE_POINT_CELLS, Instr, InstrIdx, MemoIdx,
    OperandIdx, Operands, PIECE_CELLS, Post, SAMPLES, SymEntry, SymIdx, SymKind, TapeIdx, VecIdx,
    in_domain,
};
pub use range::Range;
pub use scalar::{EQ_TOL, Inverse, MISSING, Op, OpSpec, is_missing, js_round};
pub use texts::Texts;
pub use vector::Statistic;
pub use vector::{
    Dist, Figure, MAX_PRIME, MAX_PRIME_SPAN, MAX_VEC_IN, Order, PairBy, Pivot, Produced, Reduction,
    Reflex, RegularBy, RigidOpts, Scan, VecOp, fewest_in_sequence, primes_between, sequence_count,
    sequence_index,
};
pub use vector::{MAX_SEQUENCE, sequence_parameters, sequence_values};

/// What a cell's `f64` means: a number, a string id into the document's string
/// table, or an expression handle in the symbolic engine.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
#[repr(u8)]
pub enum ValueType {
    /// A number.
    #[default]
    Number,
    /// A string id into the document's string table.
    Text,
    /// An expression handle in the symbolic engine.
    Math,
}

/// What a program's symbolic instructions keep between runs: for each, from its
/// [`MemoIdx`], the input values it last ran on and its outputs from that run;
/// with scratch for `SampleTape`.
#[derive(Debug, Clone, Default)]
pub struct SymState {
    memo: Vec<f64>,
    /// How many symbolic steps called the engine (an input had changed).
    #[cfg(feature = "testing")]
    pub runs: u64,
    /// Scratch columns for `SampleTape`.
    tape_stack: Vec<f64>,
}

impl SymState {
    /// The state of `program`'s symbolic instructions before any has run.
    pub fn new(program: &Program) -> Self {
        SymState {
            memo: vec![NEVER; program.memo_len],
            ..Default::default()
        }
    }
}

/// What running a program writes besides its cells: its symbolic
/// instructions' state and the document's engine they call.
pub struct SymRun<'a> {
    /// The symbolic instructions' memo.
    pub state: &'a mut SymState,
    /// The document's symbolic engine.
    pub engine: &'a mut Engine,
    /// The document's strings, which a text-reading instruction reads
    /// and a join adds to (ADR 0053); None where nothing runs one.
    pub texts: Option<Texts<'a>>,
}

impl SymRun<'_> {
    /// The same run, reborrowed for a call.
    pub fn reborrow(&mut self) -> SymRun<'_> {
        SymRun {
            state: self.state,
            engine: self.engine,
            texts: self.texts.as_mut().map(Texts::reborrow),
        }
    }
}

/// Bits no computation produces: a memo that has never run matches no input.
const NEVER: f64 = f64::from_bits(0x7ff8_dead_beef_0001);

/// Instructions in a valid evaluation order: every instruction's inputs are
/// either essential cells or outputs of earlier instructions.
#[derive(Debug, Clone, Default)]
pub struct Program {
    /// The instructions, in schedule order.
    pub instrs: Vec<Instr>,
    /// `producer[cell]` = the instruction writing that cell, or
    /// [`InstrIdx::NONE`] for essential cells and constants. A vector
    /// instruction produces several consecutive cells.
    pub producer: Vec<InstrIdx>,
    /// Every input of a vector or symbolic instruction, indexed by
    /// [`OperandIdx`].
    pub operands: Vec<CellIdx>,
    /// Each symbolic instruction's kind and memo, by [`SymIdx`].
    pub syms: Vec<SymEntry>,
    /// The distinct vector operators, by [`VecIdx`].
    pub vecs: Vec<VecOp>,
    /// How many memo entries its symbolic instructions take ([`SymState`]).
    pub memo_len: usize,
    /// Compiled curves that `SampleTape` instructions run.
    pub tapes: Vec<crate::sym::tape::Tape>,
    /// The cells a `fixed` holds, each with its flag cells: a request on
    /// one is dropped while any of its flags is anything but exactly 0 (a
    /// NaN flag, a missing referent, holds). Forward evaluation is
    /// untouched: a held cell still follows what it is computed from.
    pub holds: Holds,
}

/// What a cell needs to be right: what its instruction reads, and the flags
/// that hold it. The one place a cell's dependencies are defined. Evaluation
/// order is not it: a flag is read only when a request arrives.
pub struct Needs<'a> {
    instr: Option<&'a Instr>,
    operands: &'a [CellIdx],
    flags: &'a [CellIdx],
}

impl<'a> Needs<'a> {
    /// What `cell` needs, written by `instr` (none for an essential cell or a
    /// constant) over `operands`, held as `holds` says.
    pub fn new(
        instr: Option<&'a Instr>,
        operands: &'a [CellIdx],
        holds: &'a Holds,
        cell: CellIdx,
    ) -> Self {
        Needs {
            instr,
            operands,
            flags: holds.flags(cell),
        }
    }

    /// The instruction writing the cell, if one does.
    pub fn instr(&self) -> Option<&'a Instr> {
        self.instr
    }

    /// What its instruction reads, in its operator's order.
    pub fn inputs(&self) -> impl Iterator<Item = CellIdx> + 'a {
        let operands = self.operands;
        self.instr
            .into_iter()
            .flat_map(move |instr| instr.op.inputs(operands))
    }

    /// The flags that hold it.
    pub fn flags(&self) -> &'a [CellIdx] {
        self.flags
    }

    /// Everything it needs: its inputs, then its flags.
    pub fn all(&self) -> impl Iterator<Item = CellIdx> + 'a {
        self.inputs().chain(self.flags.iter().copied())
    }
}

impl Program {
    /// What `cell` needs to be right ([`Needs`]).
    pub fn needs(&self, cell: CellIdx) -> Needs<'_> {
        let instr = self.producer_of(cell).map(|p| &self.instrs[p.index()]);
        Needs::new(instr, &self.operands, &self.holds, cell)
    }

    /// The instruction writing `cell`, if one does.
    #[inline]
    pub fn producer_of(&self, cell: CellIdx) -> Option<InstrIdx> {
        let p = self.producer[cell.index()];
        (!p.is_none()).then_some(p)
    }

    /// Each cell's producer ([`Program::producer`]) for `instrs` in their
    /// order: [`InstrIdx::NONE`] for a cell none writes.
    pub fn producers(instrs: &[Instr], n_cells: usize) -> Vec<InstrIdx> {
        let mut producer = vec![InstrIdx::NONE; n_cells];
        for (i, ins) in instrs.iter().enumerate() {
            for k in 0..ins.op.n_out() {
                let out = ins.out.index() + k;
                debug_assert!(producer[out].is_none(), "two instructions write one cell");
                producer[out] = InstrIdx::from_index(i);
            }
        }
        producer
    }
}

/// The cells a `fixed` holds, and the flag cells that hold each.
#[derive(Debug, Clone, Default)]
pub struct Holds(std::collections::HashMap<CellIdx, Vec<CellIdx>>);

impl Holds {
    /// Hold `cell` while `flag` is set.
    pub fn insert(&mut self, cell: CellIdx, flag: CellIdx) {
        let flags = self.0.entry(cell).or_default();
        if !flags.contains(&flag) {
            flags.push(flag);
        }
    }

    /// Whether a request on `cell` is refused, with `cells` as they are.
    #[inline]
    pub fn holds(&self, cell: CellIdx, cells: &[f64]) -> bool {
        !self.0.is_empty()
            && self
                .0
                .get(&cell)
                .is_some_and(|flags| flags.iter().any(|f| cells[f.index()] != 0.0))
    }

    /// The flag cells that hold `cell`.
    pub fn flags(&self, cell: CellIdx) -> &[CellIdx] {
        self.0.get(&cell).map_or(&[], Vec::as_slice)
    }

    /// Every held cell, with its flags.
    pub fn iter(&self) -> impl Iterator<Item = (CellIdx, &[CellIdx])> {
        self.0.iter().map(|(&c, fs)| (c, fs.as_slice()))
    }

    /// Per cell of `cells`, whether a constant flag holds it: one of the
    /// constants `constants` that is set, which no request passes while the
    /// program stands.
    pub fn held_always(&self, cells: &[f64], constants: std::ops::Range<usize>) -> Vec<bool> {
        let mut held = vec![false; cells.len()];
        for (&c, flags) in &self.0 {
            held[c.index()] = flags
                .iter()
                .any(|f| constants.contains(&f.index()) && cells[f.index()] != 0.0);
        }
        held
    }
}

#[inline(always)]
fn differs(new: f64, old: f64) -> bool {
    new != old && !(new.is_nan() && old.is_nan() && is_missing(new) == is_missing(old))
}

impl Program {
    /// Orders `instrs` topologically. Returns the cell index of an output
    /// involved in a cycle on failure.
    pub fn schedule(
        instrs: Vec<Instr>,
        n_cells: usize,
        operands: Operands,
    ) -> std::result::Result<Program, CellIdx> {
        let Operands {
            cells: operands,
            syms,
            vecs,
            memo_len,
            ..
        } = operands;
        let producer = Program::producers(&instrs, n_cells);
        let in_order = instrs.iter().enumerate().all(|(i, ins)| {
            ins.op.inputs(&operands).all(|input| {
                let p = producer[input.index()];
                p.is_none() || p.index() < i
            })
        });
        if in_order {
            return Ok(Program {
                instrs,
                producer,
                operands,
                syms,
                vecs,
                memo_len,
                tapes: Vec::new(),
                holds: Holds::default(),
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
                let p = producer[input.index()];
                if !p.is_none() {
                    dep_count[p.index() + 1] += 1;
                }
            }
        }
        for i in 0..n {
            dep_count[i + 1] += dep_count[i];
        }
        let mut fill = dep_count.clone();
        let mut dependents = vec![InstrIdx::NONE; dep_count[n] as usize];
        for (i, ins) in instrs.iter().enumerate() {
            for input in ins.op.inputs(&operands) {
                let p = producer[input.index()];
                if !p.is_none() {
                    indegree[i] += 1;
                    dependents[fill[p.index()] as usize] = InstrIdx::from_index(i);
                    fill[p.index()] += 1;
                }
            }
        }
        let mut ready: Vec<InstrIdx> = InstrIdx::below(n)
            .filter(|i| indegree[i.index()] == 0)
            .collect();
        ready.reverse();
        let mut order = Vec::with_capacity(n);
        while let Some(i) = ready.pop() {
            order.push(instrs[i.index()]);
            for &d in &dependents[dep_count[i.index()] as usize..dep_count[i.index() + 1] as usize]
            {
                indegree[d.index()] -= 1;
                if indegree[d.index()] == 0 {
                    ready.push(d);
                }
            }
        }
        if order.len() != n {
            let stuck = (0..n).find(|&i| indegree[i] > 0).unwrap();
            return Err(instrs[stuck].out);
        }
        let producer = Program::producers(&order, n_cells);
        Ok(Program {
            instrs: order,
            producer,
            operands,
            syms,
            vecs,
            memo_len,
            tapes: Vec::new(),
            holds: Holds::default(),
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
        let out = ins.out.index();
        if let Op::Sym(n, _, s, start) = ins.op {
            let SymEntry { kind, memo } = self.syms[s.index()];
            self.step_sym(kind, start, n as usize, memo, sym, ins.out, cells, changed);
        } else if let Op::Vec(..) = ins.op {
            let mut small = [0.0f64; 16];
            let n = ins.op.n_out();
            // A capped list of many points (an intersection's), a draw of
            // many values and a shuffle of many operands write more; they
            // take the heap.
            let mut large = Vec::new();
            let buf: &mut [f64] = if n <= small.len() {
                &mut small
            } else {
                large.resize(n, 0.0);
                &mut large
            };
            ins.op
                .eval_vec(cells, &self.operands, &self.vecs, &mut buf[..n]);
            match changed {
                Some(changed) => {
                    for k in 0..n {
                        if differs(buf[k], cells[out + k]) {
                            cells[out + k] = buf[k];
                            changed.push(ins.out.offset(k));
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

    /// A symbolic instruction: rerun only if an input value changed since its
    /// last run, then write the outputs of that run.
    #[inline(never)]
    #[allow(clippy::too_many_arguments)]
    fn step_sym(
        &self,
        kind: SymKind,
        start: OperandIdx,
        n: usize,
        memo: MemoIdx,
        sym: &mut SymRun,
        out_cell: CellIdx,
        cells: &mut [f64],
        changed: Option<&mut Vec<CellIdx>>,
    ) {
        let out = out_cell.index();
        let n_out = kind.n_out();
        let inputs = self.operands_at(start, n);
        let state = &mut *sym.state;
        let (last, outs) = state.memo[memo.index()..memo.index() + n + n_out].split_at_mut(n);
        // One with no inputs (a derivative of a constant expression, taken
        // at build time) runs once: no input can tell it has not.
        let never_ran = n == 0 && outs.first().is_some_and(|o| o.to_bits() == NEVER.to_bits());
        if never_ran
            || !inputs
                .iter()
                .zip(last.iter())
                .all(|(&c, m)| cells[c.index()].to_bits() == m.to_bits())
        {
            #[cfg(feature = "testing")]
            {
                state.runs += 1;
            }
            for (m, &c) in last.iter_mut().zip(inputs) {
                *m = cells[c.index()];
            }
            if let SymKind::SampleTape { tape } = kind {
                let stack = &mut state.tape_stack;
                run_tape(&self.tapes[tape.index()], cells, inputs, outs, stack);
            } else if kind.reads_text() {
                run_text(sym.engine, sym.texts.as_mut(), kind, cells, inputs, outs);
            } else {
                run_sym(sym.engine, kind, cells, inputs, outs);
            }
        }
        match changed {
            Some(changed) => {
                for (k, &v) in outs.iter().enumerate() {
                    if differs(v, cells[out + k]) {
                        cells[out + k] = v;
                        changed.push(out_cell.offset(k));
                    }
                }
            }
            None => cells[out..out + n_out].copy_from_slice(outs),
        }
    }

    /// The vector operator `op` runs, if it is one.
    pub fn vec_op(&self, op: &Op) -> Option<VecOp> {
        match *op {
            Op::Vec(_, _, v, _) => Some(self.vecs[v.index()]),
            _ => None,
        }
    }

    /// The symbolic kind `op` runs, if it is one.
    pub fn sym_kind(&self, op: &Op) -> Option<SymKind> {
        match *op {
            Op::Sym(_, _, s, _) => Some(self.syms[s.index()].kind),
            _ => None,
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
        out.copy_from_slice(&scratch[ins.out.index()..ins.out.index() + ins.op.n_out()]);
    }

    /// Recompute every derived cell, appending the indices whose value
    /// changed to `changed`. NaN to NaN counts as unchanged.
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
            .any(|c| differs(a[c.index()], b[c.index()]))
    }

    /// How many instructions it has.
    pub fn len(&self) -> usize {
        self.instrs.len()
    }

    /// Whether it has no instruction.
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
    let (lo, hi) = (cells[inputs[0].index()], cells[inputs[1].index()]);
    if !lo.is_finite() || !hi.is_finite() {
        out.fill(f64::NAN);
        return;
    }
    let step = (hi - lo) / (SAMPLES - 1) as f64;
    let mut xs = [0.0f64; SAMPLES];
    for (i, x) in xs.iter_mut().enumerate() {
        *x = lo + step * i as f64;
    }
    let params: Vec<f64> = inputs[2..].iter().map(|&c| cells[c.index()]).collect();
    tape.eval_many(&params, &xs, out, stack);
}

fn handle(v: f64) -> Option<Handle> {
    (!v.is_nan()).then_some(Handle::from_value(v))
}

/// One symbolic operation. A NaN handle, missing or a blank input's, is a
/// blank expression: evaluating it gives the missing value, comparing it
/// gives 0 (ADR 0046).
fn run_sym(engine: &mut Engine, kind: SymKind, cells: &[f64], inputs: &[CellIdx], out: &mut [f64]) {
    let v = |k: usize| cells[inputs[k].index()];
    match kind {
        // Only while the value is missing; NaN, the numeric math's
        // expression, otherwise (ADR 0046).
        SymKind::InstantiateBlank { .. } if !is_missing(v(0)) => out[0] = f64::NAN,
        SymKind::Instantiate { template, post } | SymKind::InstantiateBlank { template, post } => {
            let h = engine.instantiate(template, cells);
            out[0] = post.apply(engine, h).to_value();
        }
        // A missing or blank expression evaluates to the missing value: a
        // number cannot hold a blank (D40, ADR 0046).
        SymKind::Evaluate => out[0] = handle(v(0)).map_or(MISSING, |h| engine.evaluate(h, None)),
        SymKind::Subset { part, inequalities } => {
            out[0] = handle(v(0)).map_or(f64::NAN, |h| {
                engine
                    .subset(h, handle(v(1)), part, inequalities)
                    .to_value()
            })
        }
        SymKind::EvalAt => {
            out[0] = handle(v(0)).map_or(MISSING, |h| engine.evaluate(h, Some(("x", v(1)))))
        }
        SymKind::Derivative => {
            out[0] = handle(v(0)).map_or(f64::NAN, |h| engine.derivative(h, "x").to_value())
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
        SymKind::Entry => {
            out[0] = handle(v(0))
                .and_then(|h| engine.entry(h, v(1)))
                .map_or(MISSING, Handle::to_value)
        }
        SymKind::Count => out[0] = handle(v(0)).map_or(1.0, |h| engine.count(h) as f64),
        SymKind::ListItem => {
            out[0] = handle(v(0))
                .and_then(|h| engine.list_item(h, v(1)))
                .map_or(MISSING, Handle::to_value)
        }
        // The missing value has no entries; a NaN that is no handle is
        // one, as a number is (ADR 0063).
        SymKind::ListCount => {
            out[0] = match handle(v(0)) {
                Some(h) => engine.list_count(h) as f64,
                None if is_missing(v(0)) => 0.0,
                None => 1.0,
            }
        }
        SymKind::Extrema { max, of } => {
            let vals: Vec<f64> = inputs.iter().map(|c| cells[c.index()]).collect();
            let found = crate::sym::extrema::search(engine, &vals[1..], vals[0], max, of);
            out[0] = engine.extrema_value(&found).to_value();
        }
        SymKind::Interpolate { n } => {
            use crate::sym::interpolate::{Given, given_by};
            let vals: Vec<f64> = inputs.iter().map(|c| cells[c.index()]).collect();
            let given: Vec<Given> = vals[3..]
                .chunks_exact(INTERPOLATE_POINT_CELLS)
                .take(n as usize)
                .map(|p| {
                    let (kind, has_x, has_y, has_slope) = given_by(p[0]);
                    let at = |v: f64, has: bool| has.then_some(v);
                    Given {
                        kind,
                        x: at(p[1], has_x),
                        y: at(p[2], has_y),
                        slope: at(p[3], has_slope),
                    }
                })
                .collect();
            match handle(vals[2]).and_then(|v| engine.symbol(v)) {
                Some(var) => engine.interpolate(&given, vals[0], vals[1], &var, out),
                None => out.fill(f64::NAN),
            }
        }
        SymKind::MergeExtrema => {
            out[0] = match (handle(v(0)), handle(v(1))) {
                (Some(a), Some(b)) => engine.merge_extrema(a, b).to_value(),
                _ => f64::NAN,
            }
        }
        SymKind::Compare { opts } => {
            out[0] = match (handle(v(0)), handle(v(1))) {
                (Some(a), Some(b)) => engine.compare(a, b, opts),
                _ => 0.0,
            }
        }
        SymKind::ClampFunction | SymKind::WrapFunctionPeriodic => {
            out[0] = match handle(v(0)) {
                Some(h) if v(1).is_finite() && v(2).is_finite() => {
                    let h = if kind == SymKind::ClampFunction {
                        engine.clamp(h, v(1), v(2))
                    } else {
                        engine.wrap_periodic(h, v(1), v(2))
                    };
                    h.to_value()
                }
                _ => f64::NAN,
            }
        }
        SymKind::Grid => {
            let size = |x: f64| {
                if x.is_finite() && x >= 0.0 {
                    x as u32
                } else {
                    0
                }
            };
            let entries: Vec<f64> = inputs[2..].iter().map(|c| cells[c.index()]).collect();
            out[0] = engine.grid(size(v(0)), size(v(1)), &entries).to_value();
        }
        SymKind::MatrixSize { cols } => {
            let (r, c) = handle(v(0)).map_or((1, 1), |h| engine.matrix_size(h));
            out[0] = f64::from(if cols { c } else { r });
        }
        SymKind::SampleTape { .. } => unreachable!("tapes run in step_sym"),
        SymKind::Join { .. }
        | SymKind::JoinWith { .. }
        | SymKind::Order { .. }
        | SymKind::TextEquals { .. }
        | SymKind::TextNumber => {
            unreachable!("text runs in step_sym")
        }
        SymKind::SampleQuadratic => {
            let (a, b, c, lo, hi) = (v(0), v(1), v(2), v(3), v(4));
            if lo.is_finite() && hi.is_finite() {
                let step = (hi - lo) / (SAMPLES - 1) as f64;
                for (i, o) in out.iter_mut().enumerate() {
                    let x = lo + step * i as f64;
                    *o = (a * x + b) * x + c;
                }
            } else {
                out.fill(f64::NAN);
            }
        }
        SymKind::EvalFunction => {
            let vals: Vec<f64> = inputs.iter().map(|c| cells[c.index()]).collect();
            eval_function(engine, &vals[1..], &[vals[0]], out);
        }
        SymKind::SampleFunction => {
            let vals: Vec<f64> = inputs.iter().map(|c| cells[c.index()]).collect();
            let (lo, hi) = (vals[0], vals[1]);
            if lo.is_finite() && hi.is_finite() {
                let step = (hi - lo) / (SAMPLES - 1) as f64;
                let xs: Vec<f64> = (0..SAMPLES).map(|i| lo + step * i as f64).collect();
                eval_function(engine, &vals[2..], &xs, out);
            } else {
                out.fill(f64::NAN);
            }
        }
        SymKind::SampleBezier { coord, uniform } => {
            let vals: Vec<f64> = inputs.iter().map(|c| cells[c.index()]).collect();
            sample_bezier(&vals, coord as usize, uniform, out);
        }
        SymKind::DerivativeBy => {
            out[0] = match (handle(v(0)), handle(v(1)).and_then(|h| engine.symbol(h))) {
                (Some(h), Some(var)) => engine.derivative(h, &var).to_value(),
                _ => f64::NAN,
            }
        }
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

/// One text-reading operation (ADR 0053): a join, which interns the text
/// it makes, or an order, which only reads. Without the document's strings
/// a join makes no string (NaN) and an order reads every string as empty.
fn run_text(
    engine: &mut Engine,
    mut texts: Option<&mut Texts>,
    kind: SymKind,
    cells: &[f64],
    inputs: &[CellIdx],
    out: &mut [f64],
) {
    use crate::document::table::{BLANK, format_number};
    use texts::{KIND_MATH, KIND_TEXT, kind_at};
    let v = |k: usize| cells[inputs[k].index()];
    match kind {
        SymKind::Join { .. } | SymKind::JoinWith { .. } => {
            let (n, kinds, booleans, sep) = match kind {
                SymKind::Join { n, kinds, booleans } => (n, kinds, booleans, ", "),
                SymKind::JoinWith { n, kinds, sep } => (n, kinds, false, sep.as_str()),
                _ => unreachable!(),
            };
            if n == 0 {
                out[0] = MISSING;
                return;
            }
            let mut joined = String::new();
            for i in 0..n as usize {
                if i > 0 {
                    joined.push_str(sep);
                }
                let x = v(i);
                if is_missing(x) {
                    joined.push_str(BLANK);
                    continue;
                }
                match kind_at(kinds, i) {
                    KIND_TEXT => {
                        joined.push_str(texts.as_deref().and_then(|t| t.get(x)).unwrap_or(""))
                    }
                    KIND_MATH if x.is_nan() => joined.push_str(BLANK),
                    KIND_MATH => joined.push_str(&engine.text(Handle::from_value(x))),
                    _ if booleans => joined.push_str(if x != 0.0 && !x.is_nan() {
                        "true"
                    } else {
                        "false"
                    }),
                    _ => joined.push_str(&format_number(x)),
                }
            }
            out[0] = match texts.as_deref_mut() {
                Some(t) => t.intern(&joined),
                None => f64::NAN,
            };
        }
        SymKind::Order { n, kinds } => {
            let n = n as usize;
            // Every input's number, when each is one: a number by kind, an
            // expression by what it evaluates to.
            let numbers: Option<Vec<f64>> = (0..n)
                .map(|i| match kind_at(kinds, i) {
                    KIND_TEXT => None,
                    KIND_MATH => {
                        let x = handle(v(i)).map_or(f64::NAN, |h| engine.evaluate(h, None));
                        (!x.is_nan()).then_some(x)
                    }
                    _ => Some(v(i)),
                })
                .collect();
            let mut order: Vec<usize> = (0..n).collect();
            match numbers {
                Some(x) => order.sort_by(|&a, &b| {
                    let (a, b) = (x[a], x[b]);
                    a.is_nan()
                        .cmp(&b.is_nan())
                        .then(a.partial_cmp(&b).unwrap_or(std::cmp::Ordering::Equal))
                }),
                None => {
                    let t = texts.as_deref();
                    let words: Vec<String> = (0..n)
                        .map(|i| texts::compare_text(engine, t, kind_at(kinds, i), v(i)))
                        .collect();
                    order.sort_by(|&a, &b| words[a].cmp(&words[b]));
                }
            }
            for (o, k) in out.iter_mut().zip(order) {
                *o = (k + 1) as f64;
            }
        }
        SymKind::TextEquals { case_insensitive } => {
            let t = texts.as_deref();
            let [a, b] = [0, 1].map(|i| {
                let x = v(i);
                let text = if is_missing(x) {
                    ""
                } else {
                    t.and_then(|t| t.get(x)).unwrap_or("")
                };
                texts::answer_text(text, case_insensitive)
            });
            out[0] = if a == b { 1.0 } else { 0.0 };
        }
        SymKind::TextNumber => {
            let text = texts.as_deref().and_then(|t| t.get(v(0))).unwrap_or("");
            out[0] = text.trim().parse::<f64>().unwrap_or(f64::NAN);
        }
        _ => unreachable!("not a text operation"),
    }
}

/// A function given as its domain and pieces (`f`: [`DOMAIN_CELLS`] cells,
/// then [`PIECE_CELLS`] per piece; [`SymKind::EvalFunction`]) at each of
/// `xs`, into `out`: NaN outside its domain, else the first piece whose
/// own domain holds `x`, else NaN. Each piece is evaluated once at every
/// `x` it takes.
pub fn eval_function(engine: &mut Engine, f: &[f64], xs: &[f64], out: &mut [f64]) {
    out.fill(f64::NAN);
    let (domain, pieces) = f.split_at(DOMAIN_CELLS);
    let mut todo: Vec<usize> = (0..xs.len())
        .filter(|&i| in_domain(xs[i], domain, false))
        .collect();
    for piece in pieces.chunks_exact(PIECE_CELLS) {
        if todo.is_empty() {
            break;
        }
        let (taken, rest): (Vec<usize>, Vec<usize>) = todo
            .into_iter()
            .partition(|&i| in_domain(xs[i], &piece[2..], true));
        todo = rest;
        let (Some(h), Some(var)) = (
            handle(piece[0]),
            handle(piece[1]).and_then(|v| engine.symbol(v)),
        ) else {
            continue;
        };
        let at: Vec<f64> = taken.iter().map(|&i| xs[i]).collect();
        let mut ys = vec![f64::NAN; at.len()];
        if at.len() == 1 {
            ys[0] = engine.evaluate(h, Some((&var, at[0])));
        } else if !at.is_empty() {
            engine.evaluate_many(h, &var, &at, &mut ys);
        }
        for (&i, y) in taken.iter().zip(ys) {
            out[i] = y;
        }
    }
}

/// How a point of a [`SymKind::SampleBezier`] has its control vectors
/// given (its last cell): both found from the spline, both given, or one
/// given and the other found from the spline on that side alone, as the
/// current core's `controlVectors` directions `none`, `symmetric` or
/// `both`, `previous` and `next`.
pub mod bezier_controls {
    /// Both found from the spline, toward its neighbors.
    pub const NONE: f64 = 0.0;
    /// Both given.
    pub const BOTH: f64 = 1.0;
    /// The one toward the previous point given.
    pub const PREVIOUS: f64 = 2.0;
    /// The one toward the next point given.
    pub const NEXT: f64 = 3.0;
}

/// The control vector toward the previous point of a spline through `p1`,
/// `p2`, `p3` at `p2` (either neighbor may be missing, reflected from the
/// other), as the current core's `calculateControlVectorFromSpline`; NaN
/// when `p2` or both neighbors are missing.
fn spline_vector(
    tension: f64,
    uniform: bool,
    p1: Option<[f64; 2]>,
    p2: [f64; 2],
    p3: Option<[f64; 2]>,
) -> [f64; 2] {
    let reflect = |p: [f64; 2]| [2.0 * p2[0] - p[0], 2.0 * p2[1] - p[1]];
    let (p1, p3) = match (p1, p3) {
        (Some(p1), Some(p3)) => (p1, p3),
        (None, Some(p3)) => (reflect(p3), p3),
        (Some(p1), None) => (p1, reflect(p1)),
        (None, None) => return [f64::NAN; 2],
    };
    if uniform {
        return [0, 1].map(|d| -tension * (p3[d] - p1[d]) / 3.0);
    }
    let dist = |a: [f64; 2], b: [f64; 2]| ((a[0] - b[0]).powi(2) + (a[1] - b[1]).powi(2)).sqrt();
    let eps = 2.0 * f64::EPSILON;
    let mut dt0 = dist(p1, p2).sqrt();
    let mut dt1 = dist(p2, p3).sqrt();
    if dt1 < eps {
        dt1 = 1.0;
    }
    if dt0 < eps {
        dt0 = dt1;
    }
    [0, 1].map(|d| {
        let t1 = (p2[d] - p1[d]) / dt0 - (p3[d] - p1[d]) / (dt1 + dt0) + (p3[d] - p2[d]) / dt1;
        -(t1 * tension * (dt0 * dt1).sqrt()) / 3.0
    })
}

/// The control vectors of each point of a Bézier spline
/// ([`SymKind::SampleBezier`]'s inputs after the tension), toward the
/// previous point and toward the next, as the current core's `<curve>`
/// finds them.
pub fn bezier_control_vectors(tension: f64, uniform: bool, pts: &[f64]) -> Vec<[[f64; 2]; 2]> {
    let n = pts.len() / BEZIER_POINT_CELLS;
    let at = |i: usize| -> [f64; 2] {
        let p = &pts[i * BEZIER_POINT_CELLS..];
        [p[0], p[1]]
    };
    (0..n)
        .map(|i| {
            let p = &pts[i * BEZIER_POINT_CELLS..(i + 1) * BEZIER_POINT_CELLS];
            let prev = (i > 0).then(|| at(i - 1));
            let next = (i + 1 < n).then(|| at(i + 1));
            let given = [[p[2], p[3]], [p[4], p[5]]];
            // One side alone, from the neighbor on either side.
            let one_sided = || spline_vector(tension, uniform, prev.or(next), at(i), None);
            match p[6] {
                bezier_controls::BOTH => given,
                bezier_controls::PREVIOUS => [given[0], one_sided()],
                bezier_controls::NEXT => [one_sided(), given[1]],
                _ => {
                    let v = spline_vector(tension, uniform, prev, at(i), next);
                    [v, [-v[0], -v[1]]]
                }
            }
        })
        .collect()
}

/// Coordinate `coord` of a Bézier spline ([`SymKind::SampleBezier`]'s
/// inputs `f`) at `out.len()` evenly spaced parameters from 0 to `n - 1`:
/// on segment `i`, the cubic from point `i` to point `i + 1` whose
/// control points are each point plus its control vector toward the other.
fn sample_bezier(f: &[f64], coord: usize, uniform: bool, out: &mut [f64]) {
    let pts = &f[1..];
    let n = pts.len() / BEZIER_POINT_CELLS;
    if n == 0 {
        out.fill(f64::NAN);
        return;
    }
    let cv = bezier_control_vectors(f[0], uniform, pts);
    let x = |i: usize| pts[i * BEZIER_POINT_CELLS + coord];
    let len = (n - 1) as f64;
    let last = out.len() - 1;
    for (k, o) in out.iter_mut().enumerate() {
        let t = if last == 0 {
            0.0
        } else {
            len * k as f64 / last as f64
        };
        if t >= len {
            *o = x(n - 1);
            continue;
        }
        let i = t.floor() as usize;
        let s = t - i as f64;
        let (x1, x2) = (x(i), x(i + 1));
        let (t1, t2) = (3.0 * cv[i][1][coord], -3.0 * cv[i + 1][0][coord]);
        let c = [
            x1,
            t1,
            -3.0 * x1 + 3.0 * x2 - 2.0 * t1 - t2,
            2.0 * x1 - 2.0 * x2 + t1 + t2,
        ];
        *o = ((c[3] * s + c[2]) * s + c[1]) * s + c[0];
    }
}

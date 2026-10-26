//! Values of varying size stored inline: the alternative to decision 5 of
//! `docs/tick-design-decisions.md` (every cell the same size, a math cell a
//! handle), built as the plan's step 13 settled, as an evaluator rather than
//! a rewritten core and engine.
//!
//! [`InlineClosure`] is the core's `DirtyClosure`, copied as in
//! `pruned.rs`, that also keeps each math cell's expression as bytes of its
//! own length, as a cell holding its expression inline would: a symbolic
//! instruction decodes its math inputs from their bytes before it runs,
//! and every math output it changes is exported from the engine and
//! encoded back. The engine still does the symbolic work through handles,
//! so this measures what storing expressions inline would add to it
//! (encoding on every write, decoding on every read), a lower bound.

use cells_core::program::{Op, Program, ValueType};
use cells_core::sym::Tree;
use cells_core::{CellIdx, Document, Evaluator};

pub struct InlineClosure {
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    dirty: Vec<u64>,
    /// Each math cell's expression, encoded; empty for any other cell.
    bytes: Vec<Vec<u8>>,
}

impl InlineClosure {
    pub fn new(doc: &Document) -> Self {
        let program = &doc.program;
        let n_cells = doc.cells.len();
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
        let mut bytes = vec![Vec::new(); n_cells];
        for (c, b) in bytes.iter_mut().enumerate() {
            store(program, &doc.cells, c as CellIdx, b);
        }
        InlineClosure {
            dep_start,
            dependents,
            dirty: vec![0; program.len().div_ceil(64)],
            bytes,
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

/// Encode the expression math cell `c` holds into `out`; leave `out` empty
/// for any other cell, or a blank expression.
fn store(program: &Program, cells: &[f64], c: CellIdx, out: &mut Vec<u8>) {
    out.clear();
    if program.value_types.get(c as usize) != Some(&ValueType::Math) {
        return;
    }
    let h = cells[c as usize];
    if h.is_nan() {
        return;
    }
    if let Some(tree) = program.sym.engine.borrow().export(h as u32) {
        encode(&tree, out);
    }
}

fn encode(t: &Tree, out: &mut Vec<u8>) {
    let name = |s: &str, out: &mut Vec<u8>| {
        out.extend((s.len() as u32).to_le_bytes());
        out.extend(s.as_bytes());
    };
    match t {
        Tree::Num(x) => {
            out.push(0);
            out.extend(x.to_le_bytes());
        }
        Tree::Sym(s) => {
            out.push(1);
            name(s, out);
        }
        Tree::Cell { cell, math } => {
            out.push(2);
            out.extend(cell.to_le_bytes());
            out.push(*math as u8);
        }
        Tree::Add(ts) | Tree::Mul(ts) => {
            out.push(if matches!(t, Tree::Add(_)) { 3 } else { 4 });
            out.extend((ts.len() as u32).to_le_bytes());
            for t in ts {
                encode(t, out);
            }
        }
        Tree::Sub(a, b) | Tree::Div(a, b) | Tree::Pow(a, b) => {
            out.push(match t {
                Tree::Sub(..) => 5,
                Tree::Div(..) => 6,
                _ => 7,
            });
            encode(a, out);
            encode(b, out);
        }
        Tree::Neg(a) => {
            out.push(8);
            encode(a, out);
        }
        Tree::Apply(f, a) => {
            out.push(9);
            name(f, out);
            encode(a, out);
        }
    }
}

fn decode(b: &[u8], at: &mut usize) -> Tree {
    let u32_at = |b: &[u8], at: &mut usize| {
        let v = u32::from_le_bytes(b[*at..*at + 4].try_into().unwrap());
        *at += 4;
        v
    };
    let name = |b: &[u8], at: &mut usize| {
        let n = u32_at(b, at) as usize;
        let s = String::from_utf8_lossy(&b[*at..*at + n]).into_owned();
        *at += n;
        s
    };
    let tag = b[*at];
    *at += 1;
    match tag {
        0 => {
            let x = f64::from_le_bytes(b[*at..*at + 8].try_into().unwrap());
            *at += 8;
            Tree::Num(x)
        }
        1 => Tree::Sym(name(b, at)),
        2 => {
            let cell = u32_at(b, at);
            let math = b[*at] != 0;
            *at += 1;
            Tree::Cell { cell, math }
        }
        3 | 4 => {
            let n = u32_at(b, at);
            let ts = (0..n).map(|_| decode(b, at)).collect();
            if tag == 3 {
                Tree::Add(ts)
            } else {
                Tree::Mul(ts)
            }
        }
        5..=7 => {
            let (a, c) = (Box::new(decode(b, at)), Box::new(decode(b, at)));
            match tag {
                5 => Tree::Sub(a, c),
                6 => Tree::Div(a, c),
                _ => Tree::Pow(a, c),
            }
        }
        8 => Tree::Neg(Box::new(decode(b, at))),
        _ => {
            let f = name(b, at);
            Tree::Apply(f, Box::new(decode(b, at)))
        }
    }
}

impl Evaluator for InlineClosure {
    fn name(&self) -> &'static str {
        "inline"
    }

    /// As `DirtyClosure::recompute`, with a symbolic instruction's math
    /// inputs decoded before it runs and its changed math outputs encoded
    /// after.
    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        for &c in changed.iter() {
            let mut b = std::mem::take(&mut self.bytes[c as usize]);
            store(program, cells, c, &mut b);
            self.bytes[c as usize] = b;
        }
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
                let symbolic = matches!(ins.op, Op::Sym(..));
                if symbolic {
                    for c in ins.op.inputs(&program.operands) {
                        let bytes = &self.bytes[c as usize];
                        if !bytes.is_empty() {
                            std::hint::black_box(decode(bytes, &mut 0));
                        }
                    }
                }
                let before = changed.len();
                program.step(ins, cells, Some(changed));
                for &c in &changed[before..] {
                    if symbolic {
                        let mut b = std::mem::take(&mut self.bytes[c as usize]);
                        store(program, cells, c, &mut b);
                        self.bytes[c as usize] = b;
                    }
                    self.mark_dependents(c, w, &mut bits, &mut hi);
                }
            }
            w += 1;
        }
    }
}

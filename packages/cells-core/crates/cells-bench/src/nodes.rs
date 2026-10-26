//! A value per node: the alternative to decision 1 of
//! `docs/tick-design-decisions.md` (state in one store, apart from the
//! graph), built as the plan's step 15 settled, as an evaluator over the
//! core's own instructions rather than a rewritten core.
//!
//! [`NodeClosure`] holds a node per cell, each its own heap allocation, made
//! in a fixed shuffled order so the heap scatters them as objects made over
//! a session would be: its value, the instruction that computes it, and its
//! readers, a vector of its own. A tick reads every input from its node and
//! marks readers from the node's own list. What it keeps from the core is
//! the order: instructions still run by schedule position, through a
//! bitset, as `DirtyClosure` runs them, so what differs is where values and
//! edges live.
//!
//! The operators read cells by index (`Op::eval`), so the document's cells
//! stay as a mirror: before an instruction runs, each input is copied from
//! its node into the mirror, and a changed output is written to both. That
//! adds a write per input the core does not pay.

use cells_core::program::{Op, Program};
use cells_core::{CellIdx, Document, Evaluator};

struct Node {
    value: f64,
    /// The schedule position of the instruction computing it, or `NONE`.
    producer: u32,
    /// The schedule positions of the instructions reading it, ascending.
    readers: Vec<u32>,
}

pub struct NodeClosure {
    // A box per node is the point: each node its own allocation.
    #[allow(clippy::vec_box)]
    nodes: Vec<Box<Node>>,
    dirty: Vec<u64>,
}

impl NodeClosure {
    pub fn new(doc: &Document) -> Self {
        let program = &doc.program;
        let n = doc.cells.len();
        let mut readers: Vec<Vec<u32>> = vec![Vec::new(); n];
        for (i, ins) in program.instrs.iter().enumerate() {
            for c in ins.op.inputs(&program.operands) {
                readers[c as usize].push(i as u32);
            }
        }
        // A fixed shuffled order of allocation, as in decision 4's
        // shuffled form.
        let mut order: Vec<usize> = (0..n).collect();
        let mut x: u64 = 0x9e37_79b9_7f4a_7c15;
        for i in (1..n).rev() {
            x ^= x << 13;
            x ^= x >> 7;
            x ^= x << 17;
            order.swap(i, (x % (i as u64 + 1)) as usize);
        }
        let mut nodes: Vec<Option<Box<Node>>> = (0..n).map(|_| None).collect();
        for c in order {
            nodes[c] = Some(Box::new(Node {
                value: doc.cells[c],
                producer: program.producer[c],
                readers: std::mem::take(&mut readers[c]),
            }));
        }
        NodeClosure {
            nodes: nodes.into_iter().map(Option::unwrap).collect(),
            dirty: vec![0; program.len().div_ceil(64)],
        }
    }

    /// As `DirtyClosure::mark_dependents`, from the node's own list.
    #[inline(always)]
    fn mark(&mut self, cell: CellIdx, w: usize, bits: &mut u64, hi: &mut usize) {
        let node = &self.nodes[cell as usize];
        for &i in &node.readers {
            let (dw, bit) = (i as usize / 64, 1u64 << (i % 64));
            if dw == w {
                *bits |= bit;
            } else {
                self.dirty[dw] |= bit;
                *hi = (*hi).max(dw);
            }
        }
    }
}

impl Evaluator for NodeClosure {
    fn name(&self) -> &'static str {
        "nodes"
    }

    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        let mut hi = 0;
        let mut lo = usize::MAX;
        for &c in changed.iter() {
            // The request wrote the cell; the node takes its value.
            self.nodes[c as usize].value = cells[c as usize];
            if let Some(&first) = self.nodes[c as usize].readers.first() {
                lo = lo.min(first as usize / 64);
            }
            self.mark(c, usize::MAX, &mut 0, &mut hi);
        }
        if lo == usize::MAX {
            return;
        }
        let mut w = lo;
        while w <= hi {
            let mut bits = std::mem::take(&mut self.dirty[w]);
            while bits != 0 {
                let i = w * 64 + bits.trailing_zeros() as usize;
                bits &= bits - 1;
                let ins = &program.instrs[i];
                for c in ins.op.inputs(&program.operands) {
                    cells[c as usize] = self.nodes[c as usize].value;
                }
                let before = changed.len();
                if let Op::Vec(..) | Op::Sym(..) = ins.op {
                    program.step(ins, cells, Some(changed));
                    for &c in &changed[before..] {
                        self.nodes[c as usize].value = cells[c as usize];
                    }
                } else {
                    let new = ins.op.eval(cells);
                    let node = &mut self.nodes[ins.out as usize];
                    debug_assert_eq!(node.producer, i as u32);
                    if new != node.value && !(new.is_nan() && node.value.is_nan()) {
                        node.value = new;
                        cells[ins.out as usize] = new;
                        changed.push(ins.out);
                    }
                }
                for &c in &changed[before..] {
                    self.mark(c, w, &mut bits, &mut hi);
                }
            }
            w += 1;
        }
    }
}

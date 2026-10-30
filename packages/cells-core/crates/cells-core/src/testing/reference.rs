//! A naive recursive evaluator used as a correctness oracle for the scheduled
//! program. It reads only essential cells and recomputes everything else by
//! recursion, independent of the schedule.

use std::collections::HashMap;

use crate::document::{CellIdx, Document};
use crate::program::{SymRun, SymState};

pub struct ReferenceEvaluator<'a> {
    doc: &'a Document,
    producer: HashMap<CellIdx, usize>,
    /// Each derived cell's value once computed: without it a chain whose
    /// cells each read the previous ones several times (function iterates)
    /// is exponential.
    memo: std::cell::RefCell<HashMap<CellIdx, f64>>,
    /// A copy of the document's symbolic state: a symbolic instruction's
    /// memo is keyed on its input values, so stepping on scratch cells
    /// with it gives what stepping on the cells did.
    sym: std::cell::RefCell<SymState>,
}

impl<'a> ReferenceEvaluator<'a> {
    pub fn new(doc: &'a Document) -> Self {
        let producer = doc
            .program
            .instrs
            .iter()
            .enumerate()
            .flat_map(|(i, ins)| (0..ins.op.n_out()).map(move |k| (ins.out.offset(k), i)))
            .collect();
        ReferenceEvaluator {
            doc,
            producer,
            memo: Default::default(),
            sym: std::cell::RefCell::new(doc.sym.clone()),
        }
    }

    pub fn value(&self, cell: CellIdx) -> f64 {
        // Essential cells and constants have no producer.
        let Some(&p) = self.producer.get(&cell) else {
            return self.doc.cells[cell.index()];
        };
        if let Some(&v) = self.memo.borrow().get(&cell) {
            return v;
        }
        let ins = &self.doc.program.instrs[p];
        // Build a scratch view where only this instruction's inputs are filled.
        let mut scratch = vec![f64::NAN; self.doc.cells.len()];
        for input in ins.op.inputs(&self.doc.program.operands) {
            scratch[input.index()] = self.value(input);
        }
        let mut out = vec![0.0; ins.op.n_out()];
        let mut engine = self.doc.session.engine.borrow_mut();
        let mut state = self.sym.borrow_mut();
        let mut sym = SymRun {
            state: &mut state,
            engine: &mut engine,
        };
        self.doc
            .program
            .eval_into(ins, &mut sym, &scratch, &mut out);
        let v = out[cell.index() - ins.out.index()];
        self.memo.borrow_mut().insert(cell, v);
        v
    }
}

/// Compare the document's current cells with the reference evaluator.
/// Returns the first mismatching cell index, if any. NaN equals NaN here.
pub fn check(doc: &Document) -> Option<(CellIdx, f64, f64)> {
    let r = ReferenceEvaluator::new(doc);
    for (i, &actual) in doc.cells.iter().enumerate() {
        let expected = r.value(CellIdx::from_index(i));
        if !(actual == expected || (actual.is_nan() && expected.is_nan())) {
            return Some((CellIdx::from_index(i), actual, expected));
        }
    }
    None
}

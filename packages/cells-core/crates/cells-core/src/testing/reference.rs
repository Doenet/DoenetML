//! A naive recursive evaluator used as a correctness oracle for the scheduled
//! program. It reads only essential cells and recomputes everything else by
//! recursion, independent of the schedule.

use std::collections::HashMap;

use crate::document::{CellIdx, Document};

pub struct ReferenceEvaluator<'a> {
    doc: &'a Document,
    producer: HashMap<CellIdx, usize>,
    /// Each derived cell's value once computed: without it a chain whose
    /// cells each read the previous ones several times (function iterates)
    /// is exponential.
    memo: std::cell::RefCell<HashMap<CellIdx, f64>>,
}

impl<'a> ReferenceEvaluator<'a> {
    pub fn new(doc: &'a Document) -> Self {
        let producer = doc
            .program
            .instrs
            .iter()
            .enumerate()
            .flat_map(|(i, ins)| (0..ins.op.n_out() as CellIdx).map(move |k| (ins.out + k, i)))
            .collect();
        ReferenceEvaluator {
            doc,
            producer,
            memo: Default::default(),
        }
    }

    pub fn value(&self, cell: CellIdx) -> f64 {
        // Essential and fixed cells have no producer.
        let Some(&p) = self.producer.get(&cell) else {
            return self.doc.cells[cell as usize];
        };
        if let Some(&v) = self.memo.borrow().get(&cell) {
            return v;
        }
        let ins = &self.doc.program.instrs[p];
        // Build a scratch view where only this instruction's inputs are filled.
        let mut scratch = vec![f64::NAN; self.doc.cells.len()];
        for input in ins.op.inputs(&self.doc.program.operands) {
            scratch[input as usize] = self.value(input);
        }
        let mut out = vec![0.0; ins.op.n_out()];
        self.doc.program.eval_into(ins, &scratch, &mut out);
        let v = out[(cell - ins.out) as usize];
        self.memo.borrow_mut().insert(cell, v);
        v
    }
}

/// Compare the document's current cells with the reference evaluator.
/// Returns the first mismatching cell index, if any. NaN equals NaN here.
pub fn check(doc: &Document) -> Option<(CellIdx, f64, f64)> {
    let r = ReferenceEvaluator::new(doc);
    for (i, &actual) in doc.cells.iter().enumerate() {
        let expected = r.value(i as CellIdx);
        if !(actual == expected || (actual.is_nan() && expected.is_nan())) {
            return Some((i as CellIdx, actual, expected));
        }
    }
    None
}

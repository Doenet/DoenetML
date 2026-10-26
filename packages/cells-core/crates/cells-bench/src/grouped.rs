//! A dirty closure over groups of instructions rather than single ones:
//! the alternatives to decision 3 (fine-grained operators) and decision 7
//! (one cell per scalar) of `docs/tick-design-decisions.md`, built as the
//! plan's step 11 and step 12 settled, as an evaluator over the core's own
//! instructions rather than a rewritten core.
//!
//! A group runs as a unit: when anything it reads changes, every one of
//! its instructions runs, in schedule order, with `Program::step`, and only
//! then are the readers of its changed outputs marked. Groups run in the
//! order of their last instruction, through a bitset over that order, as
//! the core's `DirtyClosure` runs instructions through one over schedule
//! positions.
//!
//! - [`Grouping::Single`]: every instruction a group of its own; the
//!   control, which should cost what the core's dirty closure does.
//! - [`Grouping::Expression`]: an expression, as a coarse operator per
//!   value would compute it. An instruction joins its reader's group when
//!   its one output is read by that one instruction and by no component
//!   (an intermediate of a lowered math), so each value's expression tree
//!   is a group.
//! - [`Grouping::Compound`]: a point's coordinates are one value. The
//!   instructions writing a point's `x` and `y` are one group, and when
//!   either changes, the readers of both are marked, as readers of the
//!   point would be.
//! - [`Grouping::Functions`]: the groups of `Expression`, each run as a
//!   state variable's function is in the JavaScript core (decision 2's
//!   alternative in full, step 14): before each evaluation its
//!   dependencies are looked up by key, from a hash map of keys to cells,
//!   into a fresh map of values; a boxed function reads them by key and
//!   returns its outputs in a fresh vector; the core compares them with
//!   the old values and writes them. The arithmetic is still the core's
//!   instructions, so this is a lower bound on such a core's cost.

use std::collections::{HashMap, HashSet};

use cells_core::components::ComponentType;
use cells_core::program::Program;
use cells_core::{CellIdx, Document, Evaluator};

const NONE: u32 = u32::MAX;

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Grouping {
    Single,
    Expression,
    Compound,
    Functions,
}

/// A state variable's function: from its dependencies' values by key, and
/// the cells its instructions read, its outputs.
type StateFn = Box<dyn Fn(&HashMap<u64, f64>, &Program, &mut [f64]) -> Vec<f64>>;

/// A dependency's key: what a function names it by.
fn key(cell: CellIdx) -> u64 {
    (cell as u64).wrapping_mul(0x9e37_79b9_7f4a_7c15)
}

struct Functions {
    /// Each group's function and the keys of its dependencies.
    fns: Vec<(StateFn, Vec<u64>)>,
    /// Every dependency's cell, by key.
    cells: HashMap<u64, CellIdx>,
}

pub struct GroupedClosure {
    /// Each group's instructions, by schedule position, ascending; groups in
    /// the order they run.
    members: Vec<Vec<u32>>,
    /// Each group's outputs, for `Compound`.
    outputs: Vec<Vec<CellIdx>>,
    /// The groups reading each cell, in compressed-sparse-row form.
    dep_start: Vec<u32>,
    dependents: Vec<u32>,
    /// Per group, whether it is a compound value of several outputs
    /// (`Compound` only).
    compound: Vec<bool>,
    functions: Option<Functions>,
    dirty: Vec<u64>,
}

impl GroupedClosure {
    pub fn new(doc: &Document, grouping: Grouping) -> Self {
        let program = &doc.program;
        let n = program.len();
        let n_cells = doc.cells.len();
        // The readers of each cell, by instruction.
        let mut readers: Vec<Vec<u32>> = vec![Vec::new(); n_cells];
        for (i, ins) in program.instrs.iter().enumerate() {
            for c in ins.op.inputs(&program.operands) {
                readers[c as usize].push(i as u32);
            }
        }
        // Which instruction joins which: `root[i]` is the instruction whose
        // group `i` is in.
        let mut root: Vec<u32> = (0..n as u32).collect();
        match grouping {
            Grouping::Single => {}
            Grouping::Expression | Grouping::Functions => {
                let mut exposed = vec![false; n_cells];
                for c in 0..doc.n_components() as u32 {
                    for &x in doc.comp_cells(c) {
                        exposed[x as usize] = true;
                    }
                }
                // Readers come later, so a reader's root is settled first.
                for i in (0..n).rev() {
                    let ins = &program.instrs[i];
                    if ins.op.n_out() != 1 || exposed[ins.out as usize] {
                        continue;
                    }
                    if let [r] = readers[ins.out as usize][..] {
                        root[i] = root[r as usize];
                    }
                }
            }
            Grouping::Compound => {
                for c in 0..doc.n_components() as u32 {
                    if doc.component_type(c) != ComponentType::Point {
                        continue;
                    }
                    let producers: Vec<u32> = ["x", "y"]
                        .iter()
                        .filter_map(|p| doc.prop_cells(c, p))
                        .filter_map(|cells| cells.first().copied())
                        .map(|cell| program.producer[cell as usize])
                        .filter(|&p| p != NONE)
                        .collect();
                    if let [a, b] = producers[..]
                        && root[a as usize] == a
                        && root[b as usize] == b
                    {
                        root[a.min(b) as usize] = a.max(b);
                    }
                }
            }
        }
        // Groups, ordered by their last instruction.
        let mut by_root: Vec<Vec<u32>> = vec![Vec::new(); n];
        for i in 0..n {
            by_root[root[i] as usize].push(i as u32);
        }
        let mut members: Vec<Vec<u32>> = by_root.into_iter().filter(|m| !m.is_empty()).collect();
        members.sort_by_key(|m| *m.last().unwrap());
        let mut group_of = vec![0u32; n];
        for (g, m) in members.iter().enumerate() {
            for &i in m {
                group_of[i as usize] = g as u32;
            }
        }
        // A group runs after every group it reads from.
        for (g, m) in members.iter().enumerate() {
            for &i in m {
                for c in program.instrs[i as usize].op.inputs(&program.operands) {
                    let p = program.producer[c as usize];
                    if p != NONE {
                        let from = group_of[p as usize] as usize;
                        assert!(
                            from <= g,
                            "group {g} reads group {from}, which runs after it"
                        );
                    }
                }
            }
        }
        let outputs: Vec<Vec<CellIdx>> = members
            .iter()
            .map(|m| {
                m.iter()
                    .flat_map(|&i| {
                        let ins = &program.instrs[i as usize];
                        (0..ins.op.n_out() as CellIdx).map(move |k| ins.out + k)
                    })
                    .collect()
            })
            .collect();
        // The groups reading each cell, each once.
        let mut dep_start = vec![0u32; n_cells + 1];
        let mut dependents = Vec::new();
        for c in 0..n_cells {
            let mut seen = HashSet::new();
            for &r in &readers[c] {
                let g = group_of[r as usize];
                if seen.insert(g) {
                    dependents.push(g);
                }
            }
            dependents[dep_start[c] as usize..].sort_unstable();
            dep_start[c + 1] = dependents.len() as u32;
        }
        let functions = (grouping == Grouping::Functions).then(|| {
            let mut names = HashMap::new();
            let fns = members
                .iter()
                .zip(&outputs)
                .map(|(m, outs)| {
                    let own: HashSet<u32> = m.iter().copied().collect();
                    let mut deps: Vec<CellIdx> = m
                        .iter()
                        .flat_map(|&i| program.instrs[i as usize].op.inputs(&program.operands))
                        .filter(|&c| !own.contains(&program.producer[c as usize]))
                        .collect();
                    deps.sort_unstable();
                    deps.dedup();
                    let keys: Vec<u64> = deps.iter().map(|&c| key(c)).collect();
                    for &c in &deps {
                        names.insert(key(c), c);
                    }
                    let (m, outs, read) = (m.clone(), outs.clone(), keys.clone());
                    let f: StateFn = Box::new(move |deps, program, cells| {
                        let mut seen = 0.0;
                        for k in &read {
                            seen += deps[k];
                        }
                        std::hint::black_box(seen);
                        for &i in &m {
                            program.step(&program.instrs[i as usize], cells, None);
                        }
                        outs.iter().map(|&c| cells[c as usize]).collect()
                    });
                    (f, keys)
                })
                .collect();
            Functions { fns, cells: names }
        });
        let compound = outputs
            .iter()
            .map(|o| grouping == Grouping::Compound && o.len() > 1)
            .collect();
        GroupedClosure {
            functions,
            dirty: vec![0; members.len().div_ceil(64)],
            members,
            outputs,
            dep_start,
            dependents,
            compound,
        }
    }

    /// Mark the groups reading `cell`, but `own`. Groups in word `w`, the
    /// one being scanned, go into `bits`, so they run in order with the
    /// ones pending there; `hi` is raised to the highest word marked.
    #[inline(always)]
    fn mark(&mut self, cell: CellIdx, own: u32, w: usize, bits: &mut u64, hi: &mut usize) {
        let (s, e) = (
            self.dep_start[cell as usize] as usize,
            self.dep_start[cell as usize + 1] as usize,
        );
        for &g in &self.dependents[s..e] {
            if g == own {
                continue;
            }
            let (dw, bit) = (g as usize / 64, 1u64 << (g % 64));
            if dw == w {
                *bits |= bit;
            } else {
                self.dirty[dw] |= bit;
                *hi = (*hi).max(dw);
            }
        }
    }

    /// How many groups there are: how many units a tick may run.
    pub fn len(&self) -> usize {
        self.members.len()
    }

    pub fn is_empty(&self) -> bool {
        self.members.is_empty()
    }
}

impl Evaluator for GroupedClosure {
    fn name(&self) -> &'static str {
        "grouped"
    }

    fn recompute(&mut self, program: &Program, cells: &mut [f64], changed: &mut Vec<CellIdx>) {
        let mut hi = 0;
        let mut lo = usize::MAX;
        for &c in changed.iter() {
            let (s, e) = (
                self.dep_start[c as usize] as usize,
                self.dep_start[c as usize + 1] as usize,
            );
            if let Some(&g) = self.dependents[s..e].first() {
                lo = lo.min(g as usize / 64);
            }
            // No word is being scanned yet: every mark lands in `dirty`.
            self.mark(c, NONE, usize::MAX, &mut 0, &mut hi);
        }
        if lo == usize::MAX {
            return;
        }
        let mut w = lo;
        while w <= hi {
            let mut bits = std::mem::take(&mut self.dirty[w]);
            while bits != 0 {
                let g = (w * 64) as u32 + bits.trailing_zeros();
                bits &= bits - 1;
                let before = changed.len();
                if let Some(f) = &self.functions {
                    let (run, keys) = &f.fns[g as usize];
                    let outs = &self.outputs[g as usize];
                    let old: Vec<f64> = outs.iter().map(|&c| cells[c as usize]).collect();
                    let mut deps = HashMap::with_capacity(keys.len());
                    for k in keys {
                        deps.insert(*k, cells[f.cells[k] as usize]);
                    }
                    let new = run(&deps, program, cells);
                    for ((&c, &o), &v) in outs.iter().zip(&old).zip(&new) {
                        if v != o && !(v.is_nan() && o.is_nan()) {
                            changed.push(c);
                        }
                    }
                } else {
                    for k in 0..self.members[g as usize].len() {
                        let i = self.members[g as usize][k];
                        program.step(&program.instrs[i as usize], cells, Some(changed));
                    }
                }
                // Readers come in later groups: above bit `g`, or a later word.
                for &c in &changed[before..] {
                    self.mark(c, g, w, &mut bits, &mut hi);
                }
                // A compound value that changed: the readers of its parts
                // that did not change too, as readers of the whole.
                if self.compound[g as usize] && changed.len() > before {
                    for k in 0..self.outputs[g as usize].len() {
                        let c = self.outputs[g as usize][k];
                        if !changed[before..].contains(&c) {
                            self.mark(c, g, w, &mut bits, &mut hi);
                        }
                    }
                }
            }
            w += 1;
        }
    }
}

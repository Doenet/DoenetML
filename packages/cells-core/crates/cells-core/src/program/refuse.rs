//! Requests whose inverse cannot land. A binary operator writes one input and
//! holds the others at their current values. When an essential cell the
//! request would write also reaches the requested cell along another path
//! (`S − b·S·I`), the held inputs move with the write and the request misses.
//! Such a request is refused.
//!
//! A cell's *written* cells are the essential cells its inverse can reach,
//! through each operator to the inputs it may write (`Op::writes`). Paths are
//! counted from each written cell forward through every input of every
//! instruction, saturating at 2. A vector operator counts as one node: its
//! outputs take the largest count of its inputs, not their sum. The analysis
//! reads only the program.

use std::rc::Rc;

use super::{Instr, InstrIdx, Op, Program, SymEntry, VecOp};
use crate::document::CellIdx;

/// What `analyze` found for one asked cell.
#[derive(Debug, Clone, PartialEq)]
pub enum Finding {
    /// The inverse would write `source`, which reaches the cell along more
    /// than one path: the request is refused.
    Twice { source: CellIdx },
    /// The inverse reaches an operator that drops every request (`Pow`, a
    /// comparison) on its way down from the cell.
    Drops,
}

/// For each cell of `asked`, what its inverse runs into, if anything; in
/// the order of `asked`, at most one finding each (`Twice` first).
/// `held_always` has one entry per cell of the program: a cell it marks, which
/// a constant flag holds, takes no request, so its inverse writes nothing. An
/// instruction in a loop is never counted.
pub fn analyze(
    instrs: &[Instr],
    operands: &[CellIdx],
    vecs: &[VecOp],
    syms: &[SymEntry],
    essentials: std::ops::Range<usize>,
    asked: &[CellIdx],
    held_always: &[bool],
) -> Vec<(CellIdx, Finding)> {
    let n_cells = held_always.len();
    let producer = Program::producers(instrs, n_cells);
    let mut graph = Graph {
        instrs,
        operands,
        vecs,
        syms,
        producer: &producer,
        start: Vec::new(),
        readers: Vec::new(),
        essentials,
        held_always,
    };

    // What each asked cell's inverse writes, and the asked cells by what
    // they write.
    let mut memo = Memo {
        at: vec![u32::MAX; n_cells],
        walked: Vec::new(),
    };
    let mut buffers = (Vec::new(), Vec::new());
    // Per written cell, its group in `by_source`; u32::MAX for none.
    let mut group = vec![u32::MAX; n_cells];
    let mut by_source: Vec<(CellIdx, Vec<usize>)> = Vec::new();
    let mut drops = vec![false; asked.len()];
    for (a, &cell) in asked.iter().enumerate() {
        let walked = graph.walk(cell, &mut memo, &mut buffers);
        drops[a] = walked.drops;
        for &e in walked.written.as_slice() {
            if group[e.index()] == u32::MAX {
                group[e.index()] = by_source.len() as u32;
                by_source.push((e, Vec::new()));
            }
            by_source[group[e.index()] as usize].1.push(a);
        }
    }
    // A group asking only the written cell itself reaches it once.
    by_source.retain(|(e, group)| group.iter().any(|&a| asked[a] != *e));
    let mut twice: Vec<Option<CellIdx>> = vec![None; asked.len()];
    if !by_source.is_empty() {
        count_groups(&mut graph, n_cells, asked, &mut by_source, &mut twice);
    }
    asked
        .iter()
        .enumerate()
        .filter_map(|(a, &cell)| match (twice[a], drops[a]) {
            (Some(e), _) => Some((cell, Finding::Twice { source: e })),
            (None, true) => Some((cell, Finding::Drops)),
            (None, false) => None,
        })
        .collect()
}

/// For each group of asked cells by the cell they write, count the paths
/// from that cell, and record in `twice` the asked cells it reaches more
/// than once. A group whose region has no instruction where paths join is
/// reached once everywhere, and is not counted.
fn count_groups(
    graph: &mut Graph,
    n_cells: usize,
    asked: &[CellIdx],
    by_source: &mut [(CellIdx, Vec<usize>)],
    twice: &mut [Option<CellIdx>],
) {
    let instrs = graph.instrs;
    // Paths from each written cell, into one scratch array.
    let mut scratch = Scratch {
        count: vec![0; n_cells],
        touched: Vec::new(),
        seen: vec![false; instrs.len()],
        seen_list: Vec::new(),
        waiting: vec![0; instrs.len()],
        relevant: vec![false; n_cells],
        relevant_list: Vec::new(),
    };
    by_source.sort_unstable_by_key(|&(e, _)| e);
    for (e, group) in by_source.iter() {
        if graph.mark_relevant(group.iter().map(|&a| asked[a]), &mut scratch) {
            if graph.readers.is_empty() {
                graph.index_readers(n_cells);
            }
            graph.count_from(*e, &mut scratch);
            for &a in group {
                if twice[a].is_none() && scratch.count[asked[a].index()] > 1 {
                    twice[a] = Some(*e);
                }
            }
        }
        scratch.reset();
    }
}

/// The essential cells an inverse can write from a cell, and whether it
/// meets an operator that drops every request on the way. Shared between
/// a cell and the one its inverse passes a request to.
#[derive(Debug, Clone, Default)]
struct Walked {
    written: Written,
    drops: bool,
}

/// The essential cells a walk writes: none or one inline, several shared.
#[derive(Debug, Clone, Default)]
enum Written {
    #[default]
    None,
    One(CellIdx),
    Many(Rc<[CellIdx]>),
}

impl Written {
    fn as_slice(&self) -> &[CellIdx] {
        match self {
            Written::None => &[],
            Written::One(e) => std::slice::from_ref(e),
            Written::Many(es) => es,
        }
    }
}

/// Each cell's walk, once walked: `at` indexes `walked`, `u32::MAX` for a
/// cell not reached yet.
struct Memo {
    at: Vec<u32>,
    walked: Vec<Walked>,
}

impl Memo {
    fn get(&self, c: usize) -> Option<&Walked> {
        self.walked.get(self.at[c] as usize)
    }

    fn set(&mut self, c: usize, w: Walked) {
        match self.walked.get_mut(self.at[c] as usize) {
            Some(slot) => *slot = w,
            None => {
                self.at[c] = self.walked.len() as u32;
                self.walked.push(w);
            }
        }
    }
}

/// Path counts from one written cell, and what to clear after it.
struct Scratch {
    count: Vec<u8>,
    touched: Vec<CellIdx>,
    seen: Vec<bool>,
    seen_list: Vec<InstrIdx>,
    /// Per downstream instruction, its inputs from downstream not yet
    /// counted.
    waiting: Vec<u32>,
    /// Cells from which an asked cell of the group can be reached: the
    /// only cells whose counts matter.
    relevant: Vec<bool>,
    relevant_list: Vec<CellIdx>,
}

impl Scratch {
    fn reset(&mut self) {
        for &c in &self.touched {
            self.count[c.index()] = 0;
        }
        for &i in &self.seen_list {
            self.seen[i.index()] = false;
        }
        for &c in &self.relevant_list {
            self.relevant[c.index()] = false;
        }
        self.touched.clear();
        self.seen_list.clear();
        self.relevant_list.clear();
    }
}

struct Graph<'a> {
    instrs: &'a [Instr],
    operands: &'a [CellIdx],
    vecs: &'a [VecOp],
    syms: &'a [SymEntry],
    producer: &'a [InstrIdx],
    /// The instructions reading each cell, compressed: those of cell `c`
    /// are `readers[start[c]..start[c + 1]]`. Made only for a count.
    start: Vec<u32>,
    readers: Vec<InstrIdx>,
    essentials: std::ops::Range<usize>,
    held_always: &'a [bool],
}

impl Graph<'_> {
    /// Make `start` and `readers`.
    fn index_readers(&mut self, n_cells: usize) {
        let mut start = vec![0u32; n_cells + 1];
        for ins in self.instrs {
            for c in ins.op.inputs(self.operands) {
                start[c.index() + 1] += 1;
            }
        }
        for c in 0..n_cells {
            start[c + 1] += start[c];
        }
        let mut fill = start.clone();
        let mut readers = vec![InstrIdx::NONE; start[n_cells] as usize];
        for (i, ins) in self.instrs.iter().enumerate() {
            for c in ins.op.inputs(self.operands) {
                readers[fill[c.index()] as usize] = InstrIdx::from_index(i);
                fill[c.index()] += 1;
            }
        }
        self.start = start;
        self.readers = readers;
    }

    /// The inputs of `ins` its inverse may write, into `out`.
    fn written_inputs(&self, ins: &Instr, out: &mut Vec<CellIdx>) {
        out.clear();
        let mask = ins.op.writes(self.vecs, self.syms);
        out.extend(
            ins.op
                .inputs(self.operands)
                .enumerate()
                .filter(|&(k, _)| k < 64 && mask & (1 << k) != 0)
                .map(|(_, c)| c),
        );
    }

    /// What an inverse from `cell` can write, memoized by cell.
    fn walk(
        &self,
        cell: CellIdx,
        memo: &mut Memo,
        (stack, below): &mut (Vec<(CellIdx, bool)>, Vec<CellIdx>),
    ) -> Walked {
        if let Some(w) = memo.get(cell.index()) {
            return w.clone();
        }
        stack.clear();
        stack.push((cell, false));
        while let Some((c, expanded)) = stack.pop() {
            let i = c.index();
            if memo.get(i).is_some() && !expanded {
                continue;
            }
            if self.held_always[i] {
                memo.set(i, Walked::default());
                continue;
            }
            if self.essentials.contains(&i) {
                memo.set(
                    i,
                    Walked {
                        written: Written::One(c),
                        drops: false,
                    },
                );
                continue;
            }
            let p = self.producer[i];
            if p.is_none() {
                memo.set(i, Walked::default());
                continue;
            }
            let ins = &self.instrs[p.index()];
            self.written_inputs(ins, below);
            if !expanded {
                // Mark it open: a loop back to it writes nothing.
                memo.set(i, Walked::default());
                stack.push((c, true));
                for &b in below.iter() {
                    if memo.get(b.index()).is_none() {
                        stack.push((b, false));
                    }
                }
                continue;
            }
            let own_drops = below.is_empty()
                && !matches!(ins.op, Op::Vec(..) | Op::Sym(..))
                && ins.op.inputs(self.operands).next().is_some();
            let walked = match below.as_slice() {
                // One written input, as every scalar operator: share it.
                [b] => {
                    let sub = memo.get(b.index()).cloned().unwrap_or_default();
                    Walked {
                        written: sub.written,
                        drops: sub.drops || own_drops,
                    }
                }
                _ => {
                    let mut written: Vec<CellIdx> = Vec::new();
                    let mut drops = own_drops;
                    for b in below.iter() {
                        if let Some(sub) = memo.get(b.index()) {
                            drops |= sub.drops;
                            for &e in sub.written.as_slice() {
                                if !written.contains(&e) {
                                    written.push(e);
                                }
                            }
                        }
                    }
                    Walked {
                        written: match written[..] {
                            [] => Written::None,
                            [e] => Written::One(e),
                            _ => Written::Many(written.into()),
                        },
                        drops,
                    }
                }
            };
            memo.set(i, walked);
        }
        memo.get(cell.index()).cloned().unwrap_or_default()
    }

    /// Mark the cells from which one of `targets` can be reached, through
    /// every input of every instruction: the region a count needs. Whether
    /// paths can join in it: whether it has an instruction that sums the
    /// counts of two inputs or more (not a vector operator, which takes
    /// their largest).
    fn mark_relevant(&self, targets: impl Iterator<Item = CellIdx>, scratch: &mut Scratch) -> bool {
        let mut joins = false;
        let mut todo: Vec<CellIdx> = Vec::new();
        for c in targets {
            if !scratch.relevant[c.index()] {
                scratch.relevant[c.index()] = true;
                scratch.relevant_list.push(c);
                todo.push(c);
            }
        }
        while let Some(c) = todo.pop() {
            let p = self.producer[c.index()];
            if p.is_none() {
                continue;
            }
            let op = &self.instrs[p.index()].op;
            let mut n = 0;
            for input in op.inputs(self.operands) {
                n += 1;
                if !scratch.relevant[input.index()] {
                    scratch.relevant[input.index()] = true;
                    scratch.relevant_list.push(input);
                    todo.push(input);
                }
            }
            joins |= n > 1 && !matches!(op, Op::Vec(..));
        }
        joins
    }

    /// How many paths lead from cell `e` to each cell downstream of it,
    /// saturating at 2, into `scratch`: a scalar or symbolic instruction
    /// sums its inputs' counts, a vector one takes their largest.
    fn count_from(&self, e: CellIdx, scratch: &mut Scratch) {
        scratch.count[e.index()] = 1;
        scratch.touched.push(e);
        // The instructions downstream of `e`, then in schedule order.
        let mut todo = vec![e];
        while let Some(c) = todo.pop() {
            let (s, t) = (self.start[c.index()], self.start[c.index() + 1]);
            for &i in &self.readers[s as usize..t as usize] {
                let ins = &self.instrs[i.index()];
                let out = ins.out.index();
                let n_out = ins.op.n_out();
                let matters = (out..out + n_out).any(|o| scratch.relevant[o]);
                if matters && !scratch.seen[i.index()] {
                    scratch.seen[i.index()] = true;
                    scratch.seen_list.push(i);
                    for k in 0..n_out {
                        todo.push(ins.out.offset(k));
                    }
                }
            }
        }
        // Count in an order where each instruction follows those of its
        // inputs downstream of `e`: Kahn's, over the downstream alone.
        let downstream = std::mem::take(&mut scratch.seen_list);
        let mut ready = Vec::new();
        for &i in &downstream {
            let ins = &self.instrs[i.index()];
            let waiting = ins
                .op
                .inputs(self.operands)
                .filter(|c| {
                    let p = self.producer[c.index()];
                    !p.is_none() && p != i && scratch.seen[p.index()]
                })
                .count() as u32;
            scratch.waiting[i.index()] = waiting;
            if waiting == 0 {
                ready.push(i);
            }
        }
        while let Some(i) = ready.pop() {
            let ins = &self.instrs[i.index()];
            let counts = ins
                .op
                .inputs(self.operands)
                .map(|c| scratch.count[c.index()] as u32);
            let k = match ins.op {
                Op::Vec(..) => counts.max().unwrap_or(0),
                _ => counts.sum(),
            };
            for o in 0..ins.op.n_out() {
                let out = ins.out.index() + o;
                if scratch.count[out] == 0 {
                    scratch.touched.push(CellIdx::from_index(out));
                }
                scratch.count[out] = scratch.count[out].max(k.min(2) as u8);
                let (s, t) = (self.start[out], self.start[out + 1]);
                for &j in &self.readers[s as usize..t as usize] {
                    if j != i && scratch.seen[j.index()] {
                        scratch.waiting[j.index()] -= 1;
                        if scratch.waiting[j.index()] == 0 {
                            ready.push(j);
                        }
                    }
                }
            }
        }
        scratch.seen_list = downstream;
    }
}

//! Requests whose inverse cannot land (ADR 0026, fix 2). A binary operator
//! writes one input and holds the others at their current values. When an
//! essential cell the request would write also reaches the requested cell
//! along another path, the held inputs move with the write and the request
//! misses: `i = max(f / b, n) + a` with `a`, `b` and `f` computed from `n`,
//! or `S − b·S·I`. Asking again moves the cell elsewhere. Such a request is
//! refused, as the current core's `<math>` inverse refuses an expression
//! whose operands share a variable.
//!
//! A cell's *written* cells are the essential cells its inverse can reach:
//! through each operator to the inputs it may write (`Op::writes`), as the
//! writable walk goes (ADR 0018). Paths are counted from each written cell
//! forward through every input of every instruction, saturating at 2. A
//! vector operator counts as one node: its handwritten inverse is trusted
//! with its own inputs together, so its outputs take the largest count of
//! its inputs, not their sum.
//!
//! The analysis reads only the program, so the build can warn of a refused
//! prop (`build/emit.rs`) and a document can refuse its requests
//! (`document/request.rs`) from the same rule.

use std::rc::Rc;

use super::{Instr, Op};
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
/// the order of `asked`, at most one finding each (`Twice` first). A cell
/// `held_always` says a constant flag holds (`Program::holds`, ADR 0022)
/// takes no request, so its inverse writes nothing.
///
/// Each cell's written cells come from one walk down the program, shared
/// between cells. Paths are counted once per written cell, over the
/// instructions downstream of it in an order of their own, into a scratch
/// array kept between them, so the cost is the program plus each written
/// cell's downstream, restricted to the cells from which an asked cell can
/// be reached. An instruction in a loop is never counted.
pub fn analyze(
    instrs: &[Instr],
    operands: &[CellIdx],
    n_cells: usize,
    n_essential: usize,
    asked: &[CellIdx],
    held_always: &dyn Fn(CellIdx) -> bool,
) -> Vec<(CellIdx, Finding)> {
    let mut producer = vec![u32::MAX; n_cells];
    for (i, ins) in instrs.iter().enumerate() {
        for k in 0..ins.op.n_out() {
            producer[ins.out.index() + k] = i as u32;
        }
    }
    // The instructions reading each cell, compressed.
    let mut start = vec![0u32; n_cells + 1];
    for ins in instrs {
        for c in ins.op.inputs(operands) {
            start[c.index() + 1] += 1;
        }
    }
    for c in 0..n_cells {
        start[c + 1] += start[c];
    }
    let mut fill = start.clone();
    let mut readers = vec![0u32; start[n_cells] as usize];
    for (i, ins) in instrs.iter().enumerate() {
        for c in ins.op.inputs(operands) {
            readers[fill[c.index()] as usize] = i as u32;
            fill[c.index()] += 1;
        }
    }
    let graph = Graph {
        instrs,
        operands,
        producer: &producer,
        start: &start,
        readers: &readers,
        n_essential,
        held_always,
    };

    // What each asked cell's inverse writes, and the asked cells by what
    // they write.
    let mut memo: Vec<Option<Walked>> = vec![None; n_cells];
    let mut buffers = (Vec::new(), Vec::new());
    // Per written cell, its group in `by_source`; u32::MAX for none.
    let mut group = vec![u32::MAX; n_cells];
    let mut by_source: Vec<(u32, Vec<usize>)> = Vec::new();
    let mut drops = vec![false; asked.len()];
    for (a, &cell) in asked.iter().enumerate() {
        let walked = graph.walk(cell, &mut memo, &mut buffers);
        drops[a] = walked.drops;
        for &e in walked.written.iter() {
            if group[e as usize] == u32::MAX {
                group[e as usize] = by_source.len() as u32;
                by_source.push((e, Vec::new()));
            }
            by_source[group[e as usize] as usize].1.push(a);
        }
    }
    // Paths from each written cell, into one scratch array.
    let mut twice: Vec<Option<u32>> = vec![None; asked.len()];
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
    for (e, group) in &by_source {
        // A group asking only the written cell itself reaches it once.
        if group.iter().all(|&a| asked[a].index() == *e as usize) {
            continue;
        }
        graph.mark_relevant(group.iter().map(|&a| asked[a]), &mut scratch);
        graph.count_from(*e, &mut scratch);
        for &a in group {
            if twice[a].is_none() && scratch.count[asked[a].index()] > 1 {
                twice[a] = Some(*e);
            }
        }
        scratch.reset();
    }
    asked
        .iter()
        .enumerate()
        .filter_map(|(a, &cell)| match (twice[a], drops[a]) {
            (Some(e), _) => Some((
                cell,
                Finding::Twice {
                    source: CellIdx::from_index(e as usize),
                },
            )),
            (None, true) => Some((cell, Finding::Drops)),
            (None, false) => None,
        })
        .collect()
}

/// The essential cells an inverse can write from a cell, and whether it
/// meets an operator that drops every request on the way. Shared between
/// a cell and the one its inverse passes a request to.
#[derive(Debug, Clone, Default)]
struct Walked {
    written: Rc<[u32]>,
    drops: bool,
}

/// Path counts from one written cell, and what to clear after it.
struct Scratch {
    count: Vec<u8>,
    touched: Vec<u32>,
    seen: Vec<bool>,
    seen_list: Vec<u32>,
    /// Per downstream instruction, its inputs from downstream not yet
    /// counted.
    waiting: Vec<u32>,
    /// Cells from which an asked cell of the group can be reached: the
    /// only cells whose counts matter.
    relevant: Vec<bool>,
    relevant_list: Vec<u32>,
}

impl Scratch {
    fn reset(&mut self) {
        for &c in &self.touched {
            self.count[c as usize] = 0;
        }
        for &i in &self.seen_list {
            self.seen[i as usize] = false;
        }
        for &c in &self.relevant_list {
            self.relevant[c as usize] = false;
        }
        self.touched.clear();
        self.seen_list.clear();
        self.relevant_list.clear();
    }
}

struct Graph<'a> {
    instrs: &'a [Instr],
    operands: &'a [CellIdx],
    producer: &'a [u32],
    start: &'a [u32],
    readers: &'a [u32],
    n_essential: usize,
    held_always: &'a dyn Fn(CellIdx) -> bool,
}

impl Graph<'_> {
    /// The inputs of `ins` its inverse may write, into `out`.
    fn written_inputs(&self, ins: &Instr, out: &mut Vec<CellIdx>) {
        out.clear();
        let mask = ins.op.writes();
        out.extend(
            ins.op
                .inputs(self.operands)
                .enumerate()
                .filter(|&(k, _)| k < 64 && mask & (1 << k) != 0)
                .map(|(_, c)| c),
        );
    }

    /// What an inverse from `cell` can write, memoized by cell; walked
    /// without recursion, since a chain can be as long as the document.
    fn walk(
        &self,
        cell: CellIdx,
        memo: &mut [Option<Walked>],
        (stack, below): &mut (Vec<(CellIdx, bool)>, Vec<CellIdx>),
    ) -> Walked {
        if let Some(w) = &memo[cell.index()] {
            return w.clone();
        }
        stack.clear();
        stack.push((cell, false));
        while let Some((c, expanded)) = stack.pop() {
            let i = c.index();
            if memo[i].is_some() && !expanded {
                continue;
            }
            if (self.held_always)(c) {
                memo[i] = Some(Walked::default());
                continue;
            }
            if i < self.n_essential {
                memo[i] = Some(Walked {
                    written: Rc::from([i as u32]),
                    drops: false,
                });
                continue;
            }
            let p = self.producer[i];
            if p == u32::MAX {
                memo[i] = Some(Walked::default());
                continue;
            }
            let ins = &self.instrs[p as usize];
            self.written_inputs(ins, below);
            if !expanded {
                // Mark it open: a loop back to it writes nothing.
                memo[i] = Some(Walked::default());
                stack.push((c, true));
                for &b in below.iter() {
                    if memo[b.index()].is_none() {
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
                    let sub = memo[b.index()].clone().unwrap_or_default();
                    Walked {
                        written: sub.written,
                        drops: sub.drops || own_drops,
                    }
                }
                _ => {
                    let mut written: Vec<u32> = Vec::new();
                    let mut drops = own_drops;
                    for b in below.iter() {
                        if let Some(sub) = &memo[b.index()] {
                            drops |= sub.drops;
                            for &e in sub.written.iter() {
                                if !written.contains(&e) {
                                    written.push(e);
                                }
                            }
                        }
                    }
                    Walked {
                        written: written.into(),
                        drops,
                    }
                }
            };
            memo[i] = Some(walked);
        }
        memo[cell.index()].clone().unwrap_or_default()
    }

    /// Mark the cells from which one of `targets` can be reached, through
    /// every input of every instruction: the region a count needs.
    fn mark_relevant(&self, targets: impl Iterator<Item = CellIdx>, scratch: &mut Scratch) {
        let mut todo: Vec<u32> = Vec::new();
        for c in targets {
            if !scratch.relevant[c.index()] {
                scratch.relevant[c.index()] = true;
                scratch.relevant_list.push(c.index() as u32);
                todo.push(c.index() as u32);
            }
        }
        while let Some(c) = todo.pop() {
            let p = self.producer[c as usize];
            if p == u32::MAX {
                continue;
            }
            for input in self.instrs[p as usize].op.inputs(self.operands) {
                if !scratch.relevant[input.index()] {
                    scratch.relevant[input.index()] = true;
                    scratch.relevant_list.push(input.index() as u32);
                    todo.push(input.index() as u32);
                }
            }
        }
    }

    /// How many paths lead from cell `e` to each cell downstream of it,
    /// saturating at 2, into `scratch`: a scalar or symbolic instruction
    /// sums its inputs' counts, a vector one takes their largest.
    fn count_from(&self, e: u32, scratch: &mut Scratch) {
        scratch.count[e as usize] = 1;
        scratch.touched.push(e);
        // The instructions downstream of `e`, then in schedule order.
        let mut todo = vec![e];
        while let Some(c) = todo.pop() {
            let (s, t) = (self.start[c as usize], self.start[c as usize + 1]);
            for &i in &self.readers[s as usize..t as usize] {
                let out = self.instrs[i as usize].out.index();
                let n_out = self.instrs[i as usize].op.n_out();
                let matters = (out..out + n_out).any(|o| scratch.relevant[o]);
                if matters && !scratch.seen[i as usize] {
                    scratch.seen[i as usize] = true;
                    scratch.seen_list.push(i);
                    let ins = &self.instrs[i as usize];
                    for k in 0..ins.op.n_out() {
                        todo.push((ins.out.index() + k) as u32);
                    }
                }
            }
        }
        // Count in an order where each instruction follows those of its
        // inputs downstream of `e`: Kahn's, over the downstream alone.
        let downstream = std::mem::take(&mut scratch.seen_list);
        let mut ready = Vec::new();
        for &i in &downstream {
            let ins = &self.instrs[i as usize];
            let waiting = ins
                .op
                .inputs(self.operands)
                .filter(|c| {
                    let p = self.producer[c.index()];
                    p != u32::MAX && p != i && scratch.seen[p as usize]
                })
                .count() as u32;
            scratch.waiting[i as usize] = waiting;
            if waiting == 0 {
                ready.push(i);
            }
        }
        while let Some(i) = ready.pop() {
            let ins = &self.instrs[i as usize];
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
                    scratch.touched.push(out as u32);
                }
                scratch.count[out] = scratch.count[out].max(k.min(2) as u8);
                let (s, t) = (self.start[out], self.start[out + 1]);
                for &j in &self.readers[s as usize..t as usize] {
                    if j != i && scratch.seen[j as usize] {
                        scratch.waiting[j as usize] -= 1;
                        if scratch.waiting[j as usize] == 0 {
                            ready.push(j);
                        }
                    }
                }
            }
        }
        scratch.seen_list = downstream;
    }
}

//! Requests whose inverse cannot land. A binary operator writes one input and
//! holds the others at their current values. When an essential cell the
//! request would write also reaches the requested cell along another path
//! (`S − b·S·I`), the held inputs move with the write and the request misses.
//! Such a request is refused.
//!
//! A cell's *written* cells are the essential cells its inverse can reach,
//! through each operator to the inputs it may write ([`Graph::writes`]). Paths
//! are counted from each written cell forward through every input of every
//! node, saturating at 2. A vector operator counts as one node: its outputs
//! take the largest count of its inputs, not their sum.
//!
//! The analysis reads a graph through [`Graph`], which asks three things: what
//! computes a cell and reads which inputs, which inputs an operator's inverse
//! may write, and whether a constant flag holds a cell. The program answers
//! them for the tick ([`ProgramGraph`]), and the template graph's
//! definitions for the compile's warnings (`compile/graph/refuse.rs`), so a
//! document refuses the
//! requests the load warned of, from one rule (ADR 0015, ADR 0035).

use std::rc::Rc;

use super::{Instr, InstrIdx, Op, Program, SymEntry, VecOp};
use crate::document::CellIdx;
use crate::index::Idx;

/// What `analyze` found for one asked cell.
#[derive(Debug, Clone, PartialEq)]
pub(crate) enum Finding<C> {
    /// The inverse would write `source`, which reaches the cell along more
    /// than one path: the request is refused.
    Twice { source: C },
    /// The inverse reaches an operator that drops every request (`Pow`, a
    /// comparison) on its way down from the cell.
    Drops,
}

/// What a node computes with: one input written by its inverse, as a
/// scalar operator; several outputs moved together, as a vector one; or a
/// symbolic operator, which has no scalar inverse.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum NodeKind {
    Scalar,
    Vector,
    Symbolic,
}

/// A graph of cells and the nodes that compute them, as the analysis reads
/// one. Cells and nodes are positions: below `n_cells` and `n_nodes`.
pub(crate) trait Graph {
    type Cell: Idx;
    type Node: Idx;
    fn n_cells(&self) -> usize;
    fn n_nodes(&self) -> usize;
    /// The node computing `cell`; none for an essential cell or a constant.
    fn producer(&self, cell: Self::Cell) -> Option<Self::Node>;
    /// What `node` reads, in its operator's order.
    fn inputs(&self, node: Self::Node) -> impl Iterator<Item = Self::Cell> + '_;
    /// The cells `node` computes.
    fn outputs(&self, node: Self::Node) -> impl Iterator<Item = Self::Cell> + '_;
    /// The input positions `node`'s inverse may write: bit `k` for input
    /// `k`.
    fn writes(&self, node: Self::Node) -> u64;
    fn kind(&self, node: Self::Node) -> NodeKind;
    fn is_essential(&self, cell: Self::Cell) -> bool;
    /// Whether a constant flag holds `cell`, so no request reaches it and
    /// its inverse writes nothing.
    fn held_always(&self, cell: Self::Cell) -> bool;
}

/// A program as a graph: its instructions over its cells.
pub(crate) struct ProgramGraph<'a> {
    instrs: &'a [Instr],
    operands: &'a [CellIdx],
    vecs: &'a [VecOp],
    syms: &'a [SymEntry],
    producer: &'a [InstrIdx],
    essentials: std::ops::Range<usize>,
    /// Per cell, whether a constant flag holds it.
    held_always: &'a [bool],
}

impl<'a> ProgramGraph<'a> {
    /// A scheduled program's graph, with `held_always` one entry per cell.
    pub(crate) fn of(
        program: &'a Program,
        essentials: std::ops::Range<usize>,
        held_always: &'a [bool],
    ) -> Self {
        ProgramGraph {
            instrs: &program.instrs,
            operands: &program.operands,
            vecs: &program.vecs,
            syms: &program.syms,
            producer: &program.producer,
            essentials,
            held_always,
        }
    }
}

impl Graph for ProgramGraph<'_> {
    type Cell = CellIdx;
    type Node = InstrIdx;

    fn n_cells(&self) -> usize {
        self.held_always.len()
    }

    fn n_nodes(&self) -> usize {
        self.instrs.len()
    }

    fn producer(&self, cell: CellIdx) -> Option<InstrIdx> {
        let p = self.producer[cell.index()];
        (!p.is_none()).then_some(p)
    }

    fn inputs(&self, node: InstrIdx) -> impl Iterator<Item = CellIdx> + '_ {
        self.instrs[node.index()].op.inputs(self.operands)
    }

    fn outputs(&self, node: InstrIdx) -> impl Iterator<Item = CellIdx> + '_ {
        let ins = &self.instrs[node.index()];
        (0..ins.op.n_out()).map(move |k| ins.out.offset(k))
    }

    fn writes(&self, node: InstrIdx) -> u64 {
        self.instrs[node.index()].op.writes(self.vecs, self.syms)
    }

    fn kind(&self, node: InstrIdx) -> NodeKind {
        match self.instrs[node.index()].op {
            Op::Vec(..) => NodeKind::Vector,
            Op::Sym(..) => NodeKind::Symbolic,
            _ => NodeKind::Scalar,
        }
    }

    fn is_essential(&self, cell: CellIdx) -> bool {
        self.essentials.contains(&cell.index())
    }

    fn held_always(&self, cell: CellIdx) -> bool {
        self.held_always[cell.index()]
    }
}

/// For each cell of `asked`, what its inverse runs into, if anything; in
/// the order of `asked`, at most one finding each (`Twice` first). A node
/// in a loop is never counted.
pub(crate) fn analyze<G: Graph>(graph: &G, asked: &[G::Cell]) -> Vec<(G::Cell, Finding<G::Cell>)> {
    let n_cells = graph.n_cells();
    let mut walker = Walker {
        graph,
        start: Vec::new(),
        readers: Vec::new(),
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
    let mut by_source: Vec<(G::Cell, Vec<usize>)> = Vec::new();
    let mut drops = vec![false; asked.len()];
    for (a, &cell) in asked.iter().enumerate() {
        let walked = walker.walk(cell, &mut memo, &mut buffers);
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
    let mut twice: Vec<Option<G::Cell>> = vec![None; asked.len()];
    if !by_source.is_empty() {
        count_groups(&mut walker, asked, &mut by_source, &mut twice);
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
/// than once. A group whose region has no node where paths join is
/// reached once everywhere, and is not counted.
fn count_groups<G: Graph>(
    walker: &mut Walker<'_, G>,
    asked: &[G::Cell],
    by_source: &mut [(G::Cell, Vec<usize>)],
    twice: &mut [Option<G::Cell>],
) {
    let (n_cells, n_nodes) = (walker.graph.n_cells(), walker.graph.n_nodes());
    // Paths from each written cell, into one scratch array.
    let mut scratch = Scratch {
        count: vec![0; n_cells],
        touched: Vec::new(),
        seen: vec![false; n_nodes],
        seen_list: Vec::new(),
        waiting: vec![0; n_nodes],
        relevant: vec![false; n_cells],
        relevant_list: Vec::new(),
    };
    by_source.sort_unstable_by_key(|&(e, _)| e.index());
    for (e, group) in by_source.iter() {
        if walker.mark_relevant(group.iter().map(|&a| asked[a]), &mut scratch) {
            if walker.readers.is_empty() {
                walker.index_readers();
            }
            walker.count_from(*e, &mut scratch);
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
#[derive(Debug, Clone)]
struct Walked<C> {
    written: Written<C>,
    drops: bool,
}

impl<C> Default for Walked<C> {
    fn default() -> Self {
        Walked {
            written: Written::None,
            drops: false,
        }
    }
}

/// The essential cells a walk writes: none or one inline, several shared.
#[derive(Debug, Clone)]
enum Written<C> {
    None,
    One(C),
    Many(Rc<[C]>),
}

impl<C> Written<C> {
    fn as_slice(&self) -> &[C] {
        match self {
            Written::None => &[],
            Written::One(e) => std::slice::from_ref(e),
            Written::Many(es) => es,
        }
    }
}

/// A walk's scratch: the cells to visit, each with whether its written
/// inputs are on the stack already, and the written inputs of one node.
type Buffers<C> = (Vec<(C, bool)>, Vec<C>);

/// Each cell's walk, once walked: `at` indexes `walked`, `u32::MAX` for a
/// cell not reached yet.
struct Memo<C> {
    at: Vec<u32>,
    walked: Vec<Walked<C>>,
}

impl<C> Memo<C> {
    fn get(&self, c: usize) -> Option<&Walked<C>> {
        self.walked.get(self.at[c] as usize)
    }

    fn set(&mut self, c: usize, w: Walked<C>) {
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
struct Scratch<C, N> {
    count: Vec<u8>,
    touched: Vec<C>,
    seen: Vec<bool>,
    seen_list: Vec<N>,
    /// Per downstream node, its inputs from downstream not yet counted.
    waiting: Vec<u32>,
    /// Cells from which an asked cell of the group can be reached: the
    /// only cells whose counts matter.
    relevant: Vec<bool>,
    relevant_list: Vec<C>,
}

impl<C: Idx, N: Idx> Scratch<C, N> {
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

/// The graph with the nodes reading each cell, compressed: those of cell
/// `c` are `readers[start[c]..start[c + 1]]`, made only for a count.
struct Walker<'a, G: Graph> {
    graph: &'a G,
    start: Vec<u32>,
    readers: Vec<G::Node>,
}

impl<G: Graph> Walker<'_, G> {
    /// Make `start` and `readers`.
    fn index_readers(&mut self) {
        let (n_cells, n_nodes) = (self.graph.n_cells(), self.graph.n_nodes());
        let nodes = || (0..n_nodes).map(G::Node::from_index);
        let mut start = vec![0u32; n_cells + 1];
        for node in nodes() {
            for c in self.graph.inputs(node) {
                start[c.index() + 1] += 1;
            }
        }
        for c in 0..n_cells {
            start[c + 1] += start[c];
        }
        let mut fill = start.clone();
        let mut readers = vec![G::Node::from_index(0); start[n_cells] as usize];
        for node in nodes() {
            for c in self.graph.inputs(node) {
                readers[fill[c.index()] as usize] = node;
                fill[c.index()] += 1;
            }
        }
        self.start = start;
        self.readers = readers;
    }

    /// The nodes reading `cell`.
    fn readers(&self, cell: G::Cell) -> &[G::Node] {
        let (s, t) = (self.start[cell.index()], self.start[cell.index() + 1]);
        &self.readers[s as usize..t as usize]
    }

    /// The inputs of `node` its inverse may write, into `out`.
    fn written_inputs(&self, node: G::Node, out: &mut Vec<G::Cell>) {
        out.clear();
        let mask = self.graph.writes(node);
        out.extend(
            self.graph
                .inputs(node)
                .enumerate()
                .filter(|&(k, _)| k < 64 && mask & (1 << k) != 0)
                .map(|(_, c)| c),
        );
    }

    /// What an inverse from `cell` can write, memoized by cell.
    fn walk(
        &self,
        cell: G::Cell,
        memo: &mut Memo<G::Cell>,
        (stack, below): &mut Buffers<G::Cell>,
    ) -> Walked<G::Cell> {
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
            if self.graph.held_always(c) {
                memo.set(i, Walked::default());
                continue;
            }
            if self.graph.is_essential(c) {
                memo.set(
                    i,
                    Walked {
                        written: Written::One(c),
                        drops: false,
                    },
                );
                continue;
            }
            let Some(node) = self.graph.producer(c) else {
                memo.set(i, Walked::default());
                continue;
            };
            self.written_inputs(node, below);
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
                && self.graph.kind(node) == NodeKind::Scalar
                && self.graph.inputs(node).next().is_some();
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
                    let mut written: Vec<G::Cell> = Vec::new();
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
    /// every input of every node: the region a count needs. Whether paths
    /// can join in it: whether it has a node that sums the counts of two
    /// inputs or more (not a vector operator, which takes their largest).
    fn mark_relevant(
        &self,
        targets: impl Iterator<Item = G::Cell>,
        scratch: &mut Scratch<G::Cell, G::Node>,
    ) -> bool {
        let mut joins = false;
        let mut todo: Vec<G::Cell> = Vec::new();
        for c in targets {
            if !scratch.relevant[c.index()] {
                scratch.relevant[c.index()] = true;
                scratch.relevant_list.push(c);
                todo.push(c);
            }
        }
        while let Some(c) = todo.pop() {
            let Some(node) = self.graph.producer(c) else {
                continue;
            };
            let mut n = 0;
            for input in self.graph.inputs(node) {
                n += 1;
                if !scratch.relevant[input.index()] {
                    scratch.relevant[input.index()] = true;
                    scratch.relevant_list.push(input);
                    todo.push(input);
                }
            }
            joins |= n > 1 && self.graph.kind(node) != NodeKind::Vector;
        }
        joins
    }

    /// How many paths lead from cell `e` to each cell downstream of it,
    /// saturating at 2, into `scratch`: a scalar or symbolic node sums its
    /// inputs' counts, a vector one takes their largest.
    fn count_from(&self, e: G::Cell, scratch: &mut Scratch<G::Cell, G::Node>) {
        let graph = self.graph;
        scratch.count[e.index()] = 1;
        scratch.touched.push(e);
        // The nodes downstream of `e`, then in schedule order.
        let mut todo = vec![e];
        while let Some(c) = todo.pop() {
            for &node in self.readers(c) {
                let matters = graph.outputs(node).any(|o| scratch.relevant[o.index()]);
                if matters && !scratch.seen[node.index()] {
                    scratch.seen[node.index()] = true;
                    scratch.seen_list.push(node);
                    todo.extend(graph.outputs(node));
                }
            }
        }
        // Count in an order where each node follows those of its inputs
        // downstream of `e`: Kahn's, over the downstream alone.
        let downstream = std::mem::take(&mut scratch.seen_list);
        let mut ready = Vec::new();
        for &node in &downstream {
            let waiting = graph
                .inputs(node)
                .filter(|&c| {
                    graph
                        .producer(c)
                        .is_some_and(|p| p != node && scratch.seen[p.index()])
                })
                .count() as u32;
            scratch.waiting[node.index()] = waiting;
            if waiting == 0 {
                ready.push(node);
            }
        }
        while let Some(node) = ready.pop() {
            let counts = graph.inputs(node).map(|c| scratch.count[c.index()] as u32);
            let k = match graph.kind(node) {
                NodeKind::Vector => counts.max().unwrap_or(0),
                _ => counts.sum(),
            };
            for out in graph.outputs(node) {
                let o = out.index();
                if scratch.count[o] == 0 {
                    scratch.touched.push(out);
                }
                scratch.count[o] = scratch.count[o].max(k.min(2) as u8);
                for &j in self.readers(out) {
                    if j != node && scratch.seen[j.index()] {
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

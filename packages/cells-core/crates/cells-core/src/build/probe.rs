//! The probe (ADR 0012, ADR 0014), the build the compile's check runs
//! through, and the count-independent cycle check: a document is rejected at
//! load when a dependency loop would close at an iteration count a repeat
//! can reach, not only at the count it loads with.
//!
//! The stamped graph has no edge for an indexed reference past the current
//! count, since it resolves to the missing referent, so a loop that closes
//! only at a count a student reaches is invisible to the schedule's check.
//! This check builds the document once more through the *probe*, a
//! structure view (`view.rs`) whose answers fold every iteration into one,
//! and discards the result: every repeat gets exactly one iteration, an
//! index past it lands in it, and every reference edge is labelled with how
//! it moves through the iterations, one entry per level of nesting of its
//! target. `$r[$i-2].x` written inside `r` keeps the position and shifts it
//! by minus two; `$r[2].x` resets it; a bare `$x` keeps it. A loop is a
//! cycle when its shifts sum to zero in every coordinate it keeps; a loop
//! that only marches through the iterations, a lagged recurrence, is not. A
//! coordinate some edge of the loop resets is taken as free, which can only
//! report a cycle, never miss one.
//!
//! A count whose inputs reach a cell inside a repeat's iterations is a
//! cycle of structure rather than of values: the repeats form a graph with
//! an edge from the reading count's repeat to the one read (nesting adds no
//! edge, since an inner count may read its outer iteration), and a loop on
//! it, a self-loop included, is rejected here too. So the probe can see
//! them, it answers that a collect's count reads the counts of the repeats
//! it gathers from, and that a select builds every option, since an
//! iteration or a seed may draw any of them.
//!
//! The probe build runs emit too, so a rule emit applies to resolved
//! sources (the prefill rule in `seed_cells`) is checked against the
//! referents of every count, with no copy of it here.

use super::*;

/// How a reference moves one coordinate of the iteration position: the
/// referencing element's own position in that coordinate plus a shift, or
/// a position chosen independently of it (a literal index, a branch).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(in crate::build) enum Coord {
    Keep(i64),
    Reset,
}

/// The probe's structure view: one iteration per repeat, standing for
/// every iteration, and every option of every select, standing for every
/// draw.
pub(super) struct Probe;

impl View for Probe {
    /// Nothing is drawn (`options`), so no seed is read.
    fn seed(&self) -> u64 {
        0
    }

    /// Every template is stamped once.
    fn iterations(&self, _scope: ScopeId, _node: NodeId) -> u32 {
        1
    }

    /// An index past the stamped entries lands in them when they stand for
    /// entries at other counts; the edge's label says which it named.
    fn index(&self, len: usize, k: i64, varies: bool) -> Option<usize> {
        if varies && len > 0 {
            Some((k.max(1) as usize - 1).min(len - 1))
        } else {
            view::in_range(len, k)
        }
    }

    /// A count reading the collect's count reaches the gathered repeats.
    fn collect_count(&self) -> CollectCount {
        CollectCount::RepeatCounts
    }

    /// Every option, whatever a seed or an iteration would draw, so what
    /// the probe finds depends on the source alone (ADR 0014).
    fn options(&self, _in_iteration: bool) -> Options {
        Options::Every
    }

    /// The one iteration carries both plans' edges.
    fn plans(&self, _k: u32) -> Plans {
        Plans::Both
    }

    fn folds_iterations(&self) -> bool {
        true
    }
}

/// The probe build (ADR 0012, ADR 0014): the compile built once through
/// the probe view, its graph tested for loops at any count, and emitted so
/// emit's rules run on the referents of every count and every option. It
/// reads a session of its own, so nothing a student's session holds (the
/// seed above all) reaches what it finds. The compile's check and
/// `compile::diagnose` keep only its failures and warnings.
pub(crate) fn probe(compiled: &Compiled) -> std::result::Result<BuildOutput, Failure> {
    let session = Session::new(0, false);
    // The session's own engine, which the output keeps, so what the build
    // made can be read (the input signature reads expressions).
    let mut engine = session.engine.borrow_mut();
    build_with(compiled, &session, false, &mut engine, &Probe, true)
}

/// The coordinate an index step contributes: a shift of the referencing
/// element's position at the entered level when the index is that level's
/// own iteration index plus a literal, else a reset.
pub(in crate::build) fn index_coord(ip: &IndexPlan, src_depth: u32, entered: u32) -> Coord {
    let mut shift = 0i64;
    let mut iters = 0;
    let mut same_level = true;
    for t in &ip.terms {
        match t {
            IndexTerm::Const(c) => shift += c,
            IndexTerm::Iter(h) => {
                iters += 1;
                if src_depth.checked_sub(*h) != Some(entered) {
                    same_level = false;
                }
            }
        }
    }
    if iters == 1 && same_level {
        Coord::Keep(shift)
    } else {
        Coord::Reset
    }
}

impl<'c> Builder<'c> {
    /// The slots a slot's source reads, plus its later sources.
    pub(in crate::build) fn push_inputs(&self, s: SlotId, out: &mut Vec<SlotId>) {
        self.source_inputs(&self.sources[s as usize], out);
        for (slot, src) in &self.later_sources {
            if *slot == s {
                self.source_inputs(src, out);
            }
        }
    }

    /// The slots a source reads.
    fn source_inputs(&self, src: &BuiltSource, out: &mut Vec<SlotId>) {
        match src {
            BuiltSource::Alias(t) => out.push(*t),
            BuiltSource::Op(_, start, n) => out
                .extend_from_slice(&self.op_inputs[*start as usize..*start as usize + *n as usize]),
            BuiltSource::VecOut(head, _) => out.push(*head),
            _ => {}
        }
    }

    /// Whether every slot reads only slots made before it, which no loop
    /// can do: the common case, decided in one pass before any component
    /// is searched.
    fn reads_only_earlier_slots(&self) -> bool {
        let mut inputs = Vec::new();
        let earlier = |s: usize, src: &BuiltSource, inputs: &mut Vec<SlotId>| {
            inputs.clear();
            self.source_inputs(src, inputs);
            inputs.iter().all(|&w| (w as usize) < s)
        };
        self.sources
            .iter()
            .enumerate()
            .all(|(s, src)| earlier(s, src, &mut inputs))
            && self
                .later_sources
                .iter()
                .all(|(s, src)| earlier(*s as usize, src, &mut inputs))
    }

    fn scope_within(&self, mut s: ScopeId, of: ScopeId) -> bool {
        loop {
            if s == of {
                return true;
            }
            if s == ScopeId::DOCUMENT {
                return false;
            }
            s = self.scopes[s].0;
        }
    }

    /// A loop on the repeat graph: an edge from repeat `r` to repeat `s`
    /// when `r`'s count reads a cell inside `s`'s iterations, unless `r`
    /// itself sits inside them (an inner count reading its outer iteration
    /// is legal). A self-loop is a count reading its own iterations.
    pub(in crate::build) fn check_counts(&self) -> Result<()> {
        let n = self.repeats.len();
        let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
        let mut seen = vec![false; self.sources.len()];
        let mut stack = Vec::new();
        let mut touched = Vec::new();
        for (ri, r) in self.repeats.iter().enumerate() {
            if r.iter_scopes.is_empty() {
                continue;
            }
            let count_pi = self.components.component_type[r.comp.index()]
                .count_prop()
                .expect("a repeat has a count");
            let count = self.slot(r.comp, count_pi);
            stack.clear();
            self.push_inputs(count, &mut stack);
            touched.clear();
            while let Some(sl) = stack.pop() {
                if sl == count {
                    // A loop of values through the count (a collect's count
                    // over its own iterations); the repeat names it best.
                    return Err(Error::Cycle(self.comp_label(r.comp)));
                }
                if seen[sl as usize] {
                    continue;
                }
                seen[sl as usize] = true;
                touched.push(sl);
                for rc in self.enclosing_repeats(self.slot_scope[sl as usize]) {
                    let si = self.comp_repeat[rc.index()] as usize;
                    let nested =
                        si != ri && self.scope_within(r.scope, self.repeats[si].iter_scopes[0]);
                    if !nested && !adj[ri].contains(&si) {
                        adj[ri].push(si);
                    }
                }
                self.push_inputs(sl, &mut stack);
            }
            for &sl in &touched {
                seen[sl as usize] = false;
            }
        }
        // A back edge in a depth-first walk closes a loop at its target.
        let mut color = vec![0u8; n]; // 0 unseen, 1 open, 2 done
        let mut walk: Vec<(usize, usize)> = Vec::new();
        for root in 0..n {
            if color[root] != 0 {
                continue;
            }
            color[root] = 1;
            walk.push((root, 0));
            while let Some(&mut (v, ref mut pos)) = walk.last_mut() {
                if *pos < adj[v].len() {
                    let w = adj[v][*pos];
                    *pos += 1;
                    match color[w] {
                        0 => {
                            color[w] = 1;
                            walk.push((w, 0));
                        }
                        1 => return Err(Error::Cycle(self.comp_label(self.repeats[w].comp))),
                        _ => {}
                    }
                    continue;
                }
                color[v] = 2;
                walk.pop();
            }
        }
        Ok(())
    }

    /// The label of edge `u -> v`: as recorded for a reference, else the
    /// position shared with the target kept and the rest reset.
    pub(in crate::build) fn edge_label(&self, u: SlotId, v: SlotId, depth: &[u32]) -> Vec<Coord> {
        if let Some(l) = self.labels.get(&(u, v)) {
            return l.clone();
        }
        let (mut a, mut b) = (self.slot_scope[u as usize], self.slot_scope[v as usize]);
        let dv = depth[b.index()];
        while depth[a.index()] > depth[b.index()] {
            a = self.scopes[a].0;
        }
        while depth[b.index()] > depth[a.index()] {
            b = self.scopes[b].0;
        }
        while a != b {
            a = self.scopes[a].0;
            b = self.scopes[b].0;
        }
        let shared = depth[a.index()] as usize;
        let mut label = vec![Coord::Keep(0); shared];
        label.resize(dv as usize, Coord::Reset);
        label
    }

    /// Strongly connected components of the probe graph, each tested for
    /// a loop that closes at some count.
    pub(in crate::build) fn check_loops(&self) -> Result<()> {
        if self.reads_only_earlier_slots() {
            return Ok(());
        }
        let n = self.sources.len();
        // Adjacency, compact.
        let mut adj_start = Vec::with_capacity(n + 1);
        let mut adj: Vec<SlotId> = Vec::new();
        for s in 0..n as SlotId {
            adj_start.push(adj.len() as u32);
            self.push_inputs(s, &mut adj);
        }
        adj_start.push(adj.len() as u32);
        let mut depth = vec![0u32; self.scopes.len()];
        for s in 1..self.scopes.len() {
            depth[s] = depth[self.scopes[ScopeId::from_index(s)].0.index()] + 1;
        }

        // Tarjan, iterative.
        let mut index = vec![NONE; n];
        let mut low = vec![0u32; n];
        let mut on_stack = vec![false; n];
        let mut scc_of = vec![NONE; n];
        let mut stack: Vec<u32> = Vec::new();
        let mut call: Vec<(u32, u32)> = Vec::new();
        let mut next = 0u32;
        let mut n_sccs = 0u32;
        let mut local = vec![NONE; n];
        // One buffer for every component's members: most are single slots.
        let mut members: Vec<u32> = Vec::new();
        for root in 0..n as u32 {
            if index[root as usize] != NONE {
                continue;
            }
            index[root as usize] = next;
            low[root as usize] = next;
            next += 1;
            stack.push(root);
            on_stack[root as usize] = true;
            call.push((root, adj_start[root as usize]));
            while let Some(&mut (v, ref mut pos)) = call.last_mut() {
                if *pos < adj_start[v as usize + 1] {
                    let w = adj[*pos as usize];
                    *pos += 1;
                    if index[w as usize] == NONE {
                        index[w as usize] = next;
                        low[w as usize] = next;
                        next += 1;
                        stack.push(w);
                        on_stack[w as usize] = true;
                        call.push((w, adj_start[w as usize]));
                    } else if on_stack[w as usize] {
                        low[v as usize] = low[v as usize].min(index[w as usize]);
                    }
                    continue;
                }
                call.pop();
                if let Some(&(u, _)) = call.last() {
                    low[u as usize] = low[u as usize].min(low[v as usize]);
                }
                if low[v as usize] == index[v as usize] {
                    members.clear();
                    loop {
                        let w = stack.pop().expect("tarjan stack");
                        on_stack[w as usize] = false;
                        scc_of[w as usize] = n_sccs;
                        members.push(w);
                        if w == v {
                            break;
                        }
                    }
                    let self_loop = members.len() == 1
                        && adj[adj_start[v as usize] as usize..adj_start[v as usize + 1] as usize]
                            .contains(&v);
                    if members.len() > 1 || self_loop {
                        self.check_scc(&members, &adj_start, &adj, &scc_of, &depth, &mut local)?;
                    }
                    n_sccs += 1;
                }
            }
        }
        Ok(())
    }

    /// Whether a strongly connected component holds a loop that closes at
    /// some iteration count. Every coordinate shared by all its nodes that
    /// no edge resets must admit a closed walk of zero total shift; a
    /// coordinate of one dimension does so exactly when the component has
    /// a loop of non-positive and a loop of non-negative total shift.
    fn check_scc(
        &self,
        members: &[SlotId],
        adj_start: &[u32],
        adj: &[SlotId],
        scc_of: &[u32],
        depth: &[u32],
        local: &mut [u32],
    ) -> Result<()> {
        let this = scc_of[members[0] as usize];
        for (i, &m) in members.iter().enumerate() {
            local[m as usize] = i as u32;
        }
        let min_depth = members
            .iter()
            .map(|&m| depth[self.slot_scope[m as usize].index()] as usize)
            .min()
            .unwrap_or(0);
        let mut edges: Vec<(u32, u32)> = Vec::new();
        let mut shifts: Vec<Vec<i64>> = vec![Vec::new(); min_depth];
        let mut free = vec![false; min_depth];
        for &u in members {
            for &v in &adj[adj_start[u as usize] as usize..adj_start[u as usize + 1] as usize] {
                if scc_of[v as usize] != this {
                    continue;
                }
                let label = self.edge_label(u, v, depth);
                edges.push((local[u as usize], local[v as usize]));
                for j in 0..min_depth {
                    match label.get(j) {
                        Some(Coord::Keep(s)) => shifts[j].push(*s),
                        _ => {
                            free[j] = true;
                            shifts[j].push(0);
                        }
                    }
                }
            }
        }
        let cycle = (0..min_depth).filter(|&j| !free[j]).all(|j| {
            shifts[j].iter().all(|&s| s == 0)
                || (has_nonpositive_cycle(members.len(), &edges, &shifts[j], 1)
                    && has_nonpositive_cycle(members.len(), &edges, &shifts[j], -1))
        });
        for &m in members {
            local[m as usize] = NONE;
        }
        if !cycle {
            return Ok(());
        }
        let named = |s: SlotId| {
            let c = self.slot_comp[s as usize];
            c != CompIdx::NONE && self.components.name[c.index()] != StrId::NONE
        };
        let owned = |s: SlotId| self.slot_comp[s as usize] != CompIdx::NONE;
        let at = members
            .iter()
            .find(|&&s| named(s))
            .or_else(|| members.iter().find(|&&s| owned(s)))
            .unwrap_or(&members[0]);
        Err(Error::Cycle(self.slot_label(*at)))
    }
}

/// Whether the graph has a cycle whose total of `sign * shift` is at most
/// zero: with weights `(n + 1) * sign * shift - 1`, such a cycle is
/// negative and every other is positive, so Bellman-Ford decides it.
fn has_nonpositive_cycle(n: usize, edges: &[(u32, u32)], shifts: &[i64], sign: i64) -> bool {
    let scale = (n as i128 + 1) * sign as i128;
    let w: Vec<i128> = shifts.iter().map(|&s| scale * s as i128 - 1).collect();
    let mut dist = vec![0i128; n];
    for _ in 0..n {
        let mut changed = false;
        for (e, &(u, v)) in edges.iter().enumerate() {
            let d = dist[u as usize] + w[e];
            if d < dist[v as usize] {
                dist[v as usize] = d;
                changed = true;
            }
        }
        if !changed {
            return false;
        }
    }
    edges
        .iter()
        .enumerate()
        .any(|(e, &(u, v))| dist[u as usize] + w[e] < dist[v as usize])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn signed_cycles() {
        // A self-loop of shift -1: non-positive yes, non-negative no.
        let e = [(0, 0)];
        assert!(has_nonpositive_cycle(1, &e, &[-1], 1));
        assert!(!has_nonpositive_cycle(1, &e, &[-1], -1));
        // Shifts -1 and +1 around a two-node loop: both.
        let e = [(0, 1), (1, 0)];
        assert!(has_nonpositive_cycle(2, &e, &[-1, 1], 1));
        assert!(has_nonpositive_cycle(2, &e, &[-1, 1], -1));
        // Loops of -2 and -1 only: never non-negative.
        let e = [(0, 1), (1, 0), (0, 0)];
        assert!(!has_nonpositive_cycle(2, &e, &[-1, -1, -1], -1));
    }

    #[test]
    fn index_coords() {
        let ip = |terms: Vec<IndexTerm>| IndexPlan { terms };
        // `$r[$i-2]` inside r: depth 1 referencing, entering depth 1.
        assert_eq!(
            index_coord(&ip(vec![IndexTerm::Iter(0), IndexTerm::Const(-2)]), 1, 1),
            Coord::Keep(-2)
        );
        // `$r[2]` from the document.
        assert_eq!(
            index_coord(&ip(vec![IndexTerm::Const(2)]), 0, 1),
            Coord::Reset
        );
        // An outer index used on an inner repeat.
        assert_eq!(
            index_coord(&ip(vec![IndexTerm::Iter(1)]), 2, 2),
            Coord::Reset
        );
    }
}

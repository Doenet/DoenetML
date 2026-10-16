//! The count-independent cycle check (ADR 0012): a document is rejected at
//! load when a dependency loop would close at an iteration count a repeat
//! can reach, not only at the count it loads with.
//!
//! The stamped graph has no edge for an indexed reference past the current
//! count, since it resolves to the missing referent, so a loop that closes
//! only at a count a student reaches is invisible to the schedule's check.
//! This check expands every template once more, as a *probe* that is
//! discarded: every repeat gets exactly one iteration, an index past it
//! lands in it, and every reference edge is labelled with how it moves
//! through the iterations, one entry per level of nesting of its target.
//! `$r[$i-2].x` written inside `r` keeps the position and shifts it by
//! minus two; `$r[2].x` resets it; a bare `$x` keeps it. A loop is a cycle
//! when its shifts sum to zero in every coordinate it keeps; a loop that
//! only marches through the iterations, a lagged recurrence, is not. A
//! coordinate some edge of the loop resets is taken as free, which can only
//! report a cycle, never miss one.
//!
//! A count whose inputs reach a cell inside its own iterations is a cycle
//! of structure rather than of values and is rejected here too.

use super::*;

/// How a reference moves one coordinate of the iteration position: the
/// referencing element's own position in that coordinate plus a shift, or
/// a position chosen independently of it (a literal index, a branch).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::build) enum Coord {
    Keep(i64),
    Reset,
}

/// What the probe builder records beyond an ordinary build.
#[derive(Debug, Default)]
pub(in crate::build) struct Probe {
    /// The scope each slot was made in; anonymous slots take `cur_scope`.
    pub(in crate::build) slot_scope: Vec<ScopeId>,
    pub(in crate::build) cur_scope: ScopeId,
    /// Labels of reference edges (from slot, to slot) that are not the
    /// identity; an unlabelled edge keeps the position it shares with its
    /// target and resets the rest.
    pub(in crate::build) labels: HashMap<(SlotId, SlotId), Vec<Coord>>,
    /// The label of the last reference resolved.
    pub(in crate::build) last: Vec<Coord>,
    /// Sources a slot would have in iterations other than the first (the
    /// `rest` of a `FirstIteration`): edges the graph must carry as well.
    pub(in crate::build) extra: Vec<(SlotId, Source)>,
}

/// Run the check over the compiled templates.
pub(super) fn check(compiled: &Compiled, carryover: &Carryover) -> Result<()> {
    let mut engine = Engine::new();
    let mut b = Builder::new(compiled, carryover, &mut engine);
    b.probe = Some(Probe::default());
    b.expand_all()?;
    b.resolve_all()?;
    b.check_counts()?;
    b.check_loops()
}

impl Compiled<'_> {
    /// Whether any template is a repeat body: without one the structure
    /// never changes and the schedule's own check is complete.
    pub(in crate::build) fn has_repeats(&self) -> bool {
        self.templates.iter().any(|t| {
            t.elems
                .iter()
                .any(|e| matches!(e.body, Body::Repeat { .. }))
        })
    }
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

impl<'c, 'a> Builder<'c, 'a> {
    /// Nesting depth of a scope: 0 for the document.
    pub(in crate::build) fn scope_depth(&self, mut s: ScopeId) -> u32 {
        let mut d = 0;
        while s != 0 {
            s = self.scopes[s].0;
            d += 1;
        }
        d
    }

    /// Set the scope anonymous slots are made in while probing.
    pub(in crate::build) fn probe_scope(&mut self, scope: ScopeId) {
        if let Some(p) = &mut self.probe {
            p.cur_scope = scope;
        }
    }

    /// Record the last resolved reference's label for the edge from `from`
    /// to `to`, when it is not the identity.
    pub(in crate::build) fn record_label(&mut self, from: SlotId, to: SlotId) {
        if let Some(p) = &mut self.probe
            && p.last.iter().any(|&c| c != Coord::Keep(0))
        {
            p.labels.insert((from, to), p.last.clone());
        }
    }

    /// Record `label` for the edge from `from` to `to`.
    pub(in crate::build) fn record_label_as(&mut self, from: SlotId, to: SlotId, label: &[Coord]) {
        if let Some(p) = &mut self.probe
            && label.iter().any(|&c| c != Coord::Keep(0))
        {
            p.labels.insert((from, to), label.to_vec());
        }
    }

    /// While probing, a slot standing in for a reference leaf inside math,
    /// so the edge to the leaf can carry the reference's label.
    pub(in crate::build) fn probe_leaf(&mut self, target: SlotId) -> SlotId {
        if self.probe.is_none() {
            return target;
        }
        let a = self.anon_slot(Source::Alias(target));
        self.record_label(a, target);
        a
    }

    /// The slots a slot's source reads, plus its probe-only extra sources.
    fn push_inputs(&self, s: SlotId, out: &mut Vec<SlotId>) {
        let source_inputs = |src: &Source, out: &mut Vec<SlotId>| match src {
            Source::Alias(t) => out.push(*t),
            Source::Op(_, start, n) => out
                .extend_from_slice(&self.op_inputs[*start as usize..*start as usize + *n as usize]),
            Source::VecOut(head, _) => out.push(*head),
            _ => {}
        };
        source_inputs(&self.sources[s as usize], out);
        if let Some(p) = &self.probe {
            for (slot, src) in &p.extra {
                if *slot == s {
                    source_inputs(src, out);
                }
            }
        }
    }

    fn scope_within(&self, mut s: ScopeId, of: ScopeId) -> bool {
        loop {
            if s == of {
                return true;
            }
            if s == 0 {
                return false;
            }
            s = self.scopes[s].0;
        }
    }

    /// A repeat whose count reads a cell inside its own iterations.
    fn check_counts(&self) -> Result<()> {
        let p = self.probe.as_ref().expect("probing");
        let mut seen = vec![false; self.sources.len()];
        let mut stack = Vec::new();
        let mut touched = Vec::new();
        for r in &self.repeats {
            let Some(&it) = r.iter_scopes.first() else {
                continue;
            };
            let count_pi = self.components.component_type[r.comp as usize]
                .count_prop()
                .expect("a repeat has a count");
            stack.clear();
            stack.push(self.slot(r.comp, count_pi));
            touched.clear();
            while let Some(sl) = stack.pop() {
                if seen[sl as usize] {
                    continue;
                }
                seen[sl as usize] = true;
                touched.push(sl);
                if self.scope_within(p.slot_scope[sl as usize], it) {
                    return Err(Error::Cycle(self.comp_label(r.comp)));
                }
                self.push_inputs(sl, &mut stack);
            }
            for &sl in &touched {
                seen[sl as usize] = false;
            }
        }
        Ok(())
    }

    /// The label of edge `u -> v`: as recorded for a reference, else the
    /// position shared with the target kept and the rest reset.
    fn edge_label(&self, u: SlotId, v: SlotId, depth: &[u32]) -> Vec<Coord> {
        let p = self.probe.as_ref().expect("probing");
        if let Some(l) = p.labels.get(&(u, v)) {
            return l.clone();
        }
        let (mut a, mut b) = (p.slot_scope[u as usize], p.slot_scope[v as usize]);
        let dv = depth[b as usize];
        while depth[a as usize] > depth[b as usize] {
            a = self.scopes[a].0;
        }
        while depth[b as usize] > depth[a as usize] {
            b = self.scopes[b].0;
        }
        while a != b {
            a = self.scopes[a].0;
            b = self.scopes[b].0;
        }
        let shared = depth[a as usize] as usize;
        let mut label = vec![Coord::Keep(0); shared];
        label.resize(dv as usize, Coord::Reset);
        label
    }

    /// Strongly connected components of the probe graph, each tested for
    /// a loop that closes at some count.
    fn check_loops(&self) -> Result<()> {
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
            depth[s] = depth[self.scopes[s as ScopeId].0 as usize] + 1;
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
                    let mut members = Vec::new();
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
        let p = self.probe.as_ref().expect("probing");
        let this = scc_of[members[0] as usize];
        for (i, &m) in members.iter().enumerate() {
            local[m as usize] = i as u32;
        }
        let min_depth = members
            .iter()
            .map(|&m| depth[p.slot_scope[m as usize] as usize] as usize)
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
            c != NONE && self.components.name[c as usize] != NONE
        };
        let owned = |s: SlotId| self.slot_comp[s as usize] != NONE;
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

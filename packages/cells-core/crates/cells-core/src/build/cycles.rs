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
//! A count whose inputs reach a cell inside a repeat's iterations is a
//! cycle of structure rather than of values: the repeats form a graph with
//! an edge from the reading count's repeat to the one read (nesting adds no
//! edge, since an inner count may read its outer iteration), and a loop on
//! it, a self-loop included, is rejected here too. So the probe can see
//! them, a collect's count reads the counts of the repeats it gathers from,
//! and a select inside a repeat body expands every option, since each
//! iteration draws its own.
//!
//! The prefill rule (`emit.rs`, `seed_cells`) runs at emit, which the probe
//! never reaches, so the probe checks it from the resolved sources.

use std::collections::HashSet;

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
    /// Per scope, the repeat component whose iteration it is, or NONE.
    pub(in crate::build) iter_repeat: Vec<CompIdx>,
    /// Collects (a polyline is one) with a gathered original inside an
    /// iteration: the only ones whose index past the probe's items is
    /// clamped, since any other is missing at every count.
    pub(in crate::build) follows_repeat: HashSet<CompIdx>,
}

/// Run the check over the compiled templates.
pub(super) fn check(compiled: &Compiled, carryover: &Carryover) -> Result<()> {
    let mut engine = Engine::new();
    let mut b = Builder::new(compiled, carryover, &mut engine);
    b.probe = Some(Probe::default());
    b.expand_all()?;
    b.resolve_all()?;
    b.check_seeds()?;
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

    /// Record, while probing, that `scope` is an iteration of `repeat`.
    pub(in crate::build) fn probe_iteration(&mut self, scope: ScopeId, repeat: CompIdx) {
        if let Some(p) = &mut self.probe {
            if p.iter_repeat.len() <= scope as usize {
                p.iter_repeat.resize(scope as usize + 1, NONE);
            }
            p.iter_repeat[scope as usize] = repeat;
        }
    }

    /// The repeats whose iterations enclose `scope`, innermost first.
    pub(in crate::build) fn enclosing_repeats(&self, mut scope: ScopeId) -> Vec<CompIdx> {
        let p = self.probe.as_ref().expect("probing");
        let mut out = Vec::new();
        while scope != 0 {
            match p.iter_repeat.get(scope as usize) {
                Some(&r) if r != NONE => out.push(r),
                _ => {}
            }
            scope = self.scopes[scope].0;
        }
        out
    }

    /// Whether `scope` lies inside some repeat's iteration.
    pub(in crate::build) fn inside_repeat(&self, scope: ScopeId) -> bool {
        !self.enclosing_repeats(scope).is_empty()
    }

    /// While probing, a source for a collect's count: it reads the count of
    /// every repeat whose iterations hold a gathered original, so a count
    /// reading it reaches those repeats. `None` when no original is in an
    /// iteration, where the gathered number is a constant at every count.
    pub(in crate::build) fn probe_collect_count(&mut self, found: &[CompIdx]) -> Option<Source> {
        self.probe.as_ref()?;
        let mut counts: Vec<SlotId> = Vec::new();
        for &c in found {
            for r in self.enclosing_repeats(self.components.scope[c as usize]) {
                let pi = self.components.component_type[r as usize]
                    .count_prop()
                    .expect("a repeat has a count");
                let s = self.slot(r, pi);
                if !counts.contains(&s) {
                    counts.push(s);
                }
            }
        }
        if counts.is_empty() {
            return None;
        }
        Some(self.probe_any_of(&counts))
    }

    /// While probing, a source over `inputs` whose operator never runs: the
    /// probe is discarded, so only the edges matter.
    pub(in crate::build) fn probe_any_of(&mut self, inputs: &[SlotId]) -> Source {
        let mut inputs = inputs.to_vec();
        while inputs.len() > u8::MAX as usize {
            let rest = inputs.split_off(u8::MAX as usize);
            let head = self.op_slot(OpSpec::Add, &inputs);
            inputs = std::iter::once(head).chain(rest).collect();
        }
        self.op_source(OpSpec::Add, &inputs)
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

    /// A seed (`prefill`) whose source is computed: the rule `seed_cells`
    /// applies at emit, from the resolved sources, so a referent past the
    /// count at load is checked as the iteration it would name.
    fn check_seeds(&self) -> Result<()> {
        for &(_, from) in &self.seeds {
            let mut t = from;
            let mut steps = 0;
            while let Source::Alias(u) = self.sources[t as usize] {
                t = u;
                steps += 1;
                if steps > self.sources.len() {
                    break; // an alias loop; the schedule reports it
                }
            }
            if matches!(
                self.sources[t as usize],
                Source::Op(..) | Source::VecOut(..)
            ) {
                return Err(Error::Unsupported(format!(
                    "prefill=\"${}\": a prefill reference must name a value that is not computed",
                    self.slot_label(from)
                )));
            }
        }
        Ok(())
    }

    /// A loop on the repeat graph: an edge from repeat `r` to repeat `s`
    /// when `r`'s count reads a cell inside `s`'s iterations, unless `r`
    /// itself sits inside them (an inner count reading its outer iteration
    /// is legal). A self-loop is a count reading its own iterations.
    fn check_counts(&self) -> Result<()> {
        let p = self.probe.as_ref().expect("probing");
        let n = self.repeats.len();
        let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
        let mut seen = vec![false; self.sources.len()];
        let mut stack = Vec::new();
        let mut touched = Vec::new();
        for (ri, r) in self.repeats.iter().enumerate() {
            if r.iter_scopes.is_empty() {
                continue;
            }
            let count_pi = self.components.component_type[r.comp as usize]
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
                for rc in self.enclosing_repeats(p.slot_scope[sl as usize]) {
                    let si = self.comp_repeat[rc as usize] as usize;
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

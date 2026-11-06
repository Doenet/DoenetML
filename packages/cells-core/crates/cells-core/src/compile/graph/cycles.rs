//! The count-independent cycle check over the template graph (ADR 0012,
//! ADR 0032 step 8): a document is rejected at load when a dependency loop
//! would close at any iteration count a repeat can reach.
//!
//! Every repeat is stamped once and every read labelled with how it moves
//! through the iterations, one entry per level of nesting of its target:
//! `$r[$i-2].x` inside `r` keeps the position and shifts it by minus two,
//! `$r[2].x` resets it, a bare `$x` keeps it. A loop is a cycle when its
//! shifts sum to zero in every coordinate it keeps; a lagged recurrence is
//! not. A coordinate some read of the loop resets is taken as free, which
//! can only over-report.
//!
//! A count whose inputs reach a value inside a repeat's iterations is a
//! cycle of structure: a loop on the graph of repeats, a self-loop
//! included, is rejected too. Without one, the same graph gives the
//! document's structural depth.
//!
//! A cycle has no element to box (ADR 0013). It is named by the first of
//! its nodes, in the order the stamping made them, that is a port of a
//! named component, else of any component: a choice that depends on the
//! source alone (ADR 0014).

use super::*;
use crate::diagnostics::Diagnostic;
use crate::error::Error;

/// What the checks find of a document that passes them.
#[derive(Debug, Default)]
pub(crate) struct CycleFindings {
    /// How many repeats must be expanded in sequence before a count can be
    /// computed, plus one; 0 without a repeat.
    pub(crate) structural_depth: u32,
    /// A warning for each repeat whose count reads another repeat's
    /// iterations.
    pub(crate) warnings: Vec<Diagnostic>,
}

/// The cycle and count checks over `g`, the template graph of `c`.
pub(crate) fn check_cycles(
    g: &TemplateGraph,
    c: CompiledRef<'_>,
) -> std::result::Result<CycleFindings, Error> {
    let findings = check_counts(g, c)?;
    check_loops(g, c)?;
    Ok(findings)
}

/// A loop on the repeat graph: an edge from repeat `r` to repeat `s` when
/// `r`'s count reads a value inside `s`'s iterations, unless `r` itself
/// sits inside them (an inner count reading its outer iteration is legal).
/// A self-loop is a count reading its own iterations.
///
/// Without a loop, the same edges give the document's structural depth:
/// nesting adds one, and so does an edge of the graph, which is warned
/// about.
fn check_counts(
    g: &TemplateGraph,
    c: CompiledRef<'_>,
) -> std::result::Result<CycleFindings, Error> {
    let tpls = &c.plans.templates;
    let n = g.repeats.len();
    let index_of: FxMap<(TemplateId, ElemId), usize> =
        g.repeats.iter().enumerate().map(|(i, &r)| (r, i)).collect();
    let body = |(t, e): (TemplateId, ElemId)| match tpls[t.index()].row(e).body {
        Body::Repeat { template } => template,
        _ => unreachable!("a repeat"),
    };
    // The repeats whose iterations enclose template `t`, innermost first.
    let enclosing = |mut t: TemplateId| {
        let mut out = Vec::new();
        while let Some((pt, pe)) = tpls[t.index()].parent {
            if let Some(&i) = index_of.get(&(pt, pe)) {
                out.push(i);
            }
            t = pt;
        }
        out
    };
    // Whether template `t` is `of` or inside it.
    let within = |mut t: TemplateId, of: TemplateId| loop {
        if t == of {
            return true;
        }
        match g.parent[t.index()] {
            Some(p) => t = p,
            None => return false,
        }
    };
    let label = |i: usize| comp_label(c, g, Comp::Elem(g.repeats[i].0, g.repeats[i].1));

    let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
    let mut seen = vec![false; g.nodes.len()];
    let mut touched = Vec::new();
    for (ri, &(rt, re)) in g.repeats.iter().enumerate() {
        let ty = tpls[rt.index()].row(re).component_type;
        let count = g.port(rt, re, ty.count_prop().expect("a repeat has a count"));
        let mut stack = g.reads(count).to_vec();
        touched.clear();
        while let Some(v) = stack.pop() {
            if v == count {
                // A loop of values through the count (a collect's count
                // over its own iterations); the repeat names it best.
                return Err(Error::Cycle(label(ri)));
            }
            if std::mem::replace(&mut seen[v.index()], true) {
                continue;
            }
            touched.push(v);
            for si in enclosing(g.nodes[v.index()].template) {
                let nested = si != ri && within(rt, body(g.repeats[si]));
                if !nested && !adj[ri].contains(&si) {
                    adj[ri].push(si);
                }
            }
            stack.extend_from_slice(g.reads(v));
        }
        for &v in &touched {
            seen[v.index()] = false;
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
                    1 => return Err(Error::Cycle(label(w))),
                    _ => {}
                }
                continue;
            }
            color[v] = 2;
            walk.pop();
        }
    }
    // No loop: depth is the longest path, nesting edges included.
    let nests: Vec<Option<usize>> = g
        .repeats
        .iter()
        .map(|&(rt, _)| enclosing(rt).first().copied())
        .collect();
    fn depth(ri: usize, adj: &[Vec<usize>], nests: &[Option<usize>], memo: &mut [u32]) -> u32 {
        if memo[ri] != 0 {
            return memo[ri];
        }
        let d = 1 + adj[ri]
            .iter()
            .copied()
            .chain(nests[ri])
            .map(|o| depth(o, adj, nests, memo))
            .max()
            .unwrap_or(0);
        memo[ri] = d;
        d
    }
    let mut memo = vec![0u32; n];
    let mut findings = CycleFindings::default();
    for (ri, &(rt, re)) in g.repeats.iter().enumerate() {
        let d = depth(ri, &adj, &nests, &mut memo);
        findings.structural_depth = findings.structural_depth.max(d);
        if !adj[ri].is_empty() {
            let name = comp_label(c, g, Comp::Elem(rt, re));
            findings.warnings.push(Diagnostic::warning(
                "cells-repeat-count-reads-iterations",
                Some(tpls[rt.index()].row(re).node),
                format!("repeat '{name}' has structural depth {d}: its count reads a cell inside another repeat's iterations, so a change there costs {d} build passes instead of one"),
            ));
        }
    }
    Ok(findings)
}

/// Strongly connected components of the template graph, each tested for
/// a loop that closes at some count.
fn check_loops(g: &TemplateGraph, c: CompiledRef<'_>) -> std::result::Result<(), Error> {
    let n = g.nodes.len();
    let depth: Vec<u32> = g
        .nodes
        .iter()
        .map(|node| g.depth[node.template.index()])
        .collect();
    // Tarjan, iterative.
    let none = u32::MAX;
    let mut index = vec![none; n];
    let mut low = vec![0u32; n];
    let mut on_stack = vec![false; n];
    let mut scc_of = vec![none; n];
    let mut stack: Vec<GraphNode> = Vec::new();
    let mut call: Vec<(GraphNode, usize)> = Vec::new();
    let mut next = 0u32;
    let mut n_sccs = 0u32;
    let mut local = vec![none; n];
    // One buffer for every component's members: most are single nodes.
    let mut members: Vec<GraphNode> = Vec::new();
    for root in GraphNode::below(n) {
        if index[root.index()] != none {
            continue;
        }
        index[root.index()] = next;
        low[root.index()] = next;
        next += 1;
        stack.push(root);
        on_stack[root.index()] = true;
        call.push((root, 0));
        while let Some(&mut (v, ref mut pos)) = call.last_mut() {
            if let Some(&w) = g.reads(v).get(*pos) {
                *pos += 1;
                if index[w.index()] == none {
                    index[w.index()] = next;
                    low[w.index()] = next;
                    next += 1;
                    stack.push(w);
                    on_stack[w.index()] = true;
                    call.push((w, 0));
                } else if on_stack[w.index()] {
                    low[v.index()] = low[v.index()].min(index[w.index()]);
                }
                continue;
            }
            call.pop();
            if let Some(&(u, _)) = call.last() {
                low[u.index()] = low[u.index()].min(low[v.index()]);
            }
            if low[v.index()] == index[v.index()] {
                members.clear();
                loop {
                    let w = stack.pop().expect("tarjan stack");
                    on_stack[w.index()] = false;
                    scc_of[w.index()] = n_sccs;
                    members.push(w);
                    if w == v {
                        break;
                    }
                }
                let self_loop = members.len() == 1 && g.reads(v).contains(&v);
                if members.len() > 1 || self_loop {
                    check_scc(g, c, &members, &scc_of, &depth, &mut local)?;
                }
                n_sccs += 1;
            }
        }
    }
    Ok(())
}

/// Whether a strongly connected component holds a loop that closes at
/// some iteration count. Every coordinate shared by all its nodes that no
/// read resets must admit a closed walk of zero total shift; a coordinate
/// of one dimension does so exactly when the component has a loop of
/// non-positive and a loop of non-negative total shift.
fn check_scc(
    g: &TemplateGraph,
    c: CompiledRef<'_>,
    members: &[GraphNode],
    scc_of: &[u32],
    depth: &[u32],
    local: &mut [u32],
) -> std::result::Result<(), Error> {
    let this = scc_of[members[0].index()];
    for (i, &m) in members.iter().enumerate() {
        local[m.index()] = i as u32;
    }
    let min_depth = members
        .iter()
        .map(|&m| depth[m.index()] as usize)
        .min()
        .unwrap_or(0);
    let mut edges: Vec<(u32, u32)> = Vec::new();
    let mut shifts: Vec<Vec<i64>> = vec![Vec::new(); min_depth];
    let mut free = vec![false; min_depth];
    for &u in members {
        for &v in g.reads(u) {
            if scc_of[v.index()] != this {
                continue;
            }
            let label = g.label(u, v);
            edges.push((local[u.index()], local[v.index()]));
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
        local[m.index()] = u32::MAX;
    }
    if !cycle {
        return Ok(());
    }
    // The first member made that is a named component's port, else any
    // component's.
    let mut by_order = members.to_vec();
    by_order.sort();
    let comp = |n: GraphNode| comp_of_node(g, n);
    let named = |n: &&GraphNode| comp(**n).is_some_and(|(k, _)| comp_name(c, k).is_some());
    let at = by_order
        .iter()
        .find(named)
        .or_else(|| by_order.iter().find(|n| comp(**n).is_some()))
        .unwrap_or(&by_order[0]);
    Err(Error::Cycle(node_label(c, g, *at)))
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

/// The component and port of node `n`, when it is a component's.
fn comp_of_node(g: &TemplateGraph, n: GraphNode) -> Option<(Comp, usize)> {
    let node = g.nodes[n.index()];
    match node.kind {
        NodeKind::Port { elem, port } => Some((Comp::Elem(node.template, elem), port as usize)),
        NodeKind::Made { made, port } => Some((Comp::Made(made), port as usize)),
        NodeKind::Read => None,
    }
}

/// The author's name of component `k`, if it has one: a made component
/// has none.
fn comp_name(c: CompiledRef<'_>, k: Comp) -> Option<String> {
    match k {
        Comp::Elem(t, e) => match c.plans.templates[t.index()].row(e).name {
            StrId::NONE => None,
            s => Some(c.dast.strings.get(s).trim().to_string()),
        },
        Comp::Made(_) => None,
    }
}

/// How component `k` is shown in an error: its name, else its tag.
fn comp_label(c: CompiledRef<'_>, g: &TemplateGraph, k: Comp) -> String {
    comp_name(c, k).unwrap_or_else(|| format!("<{}>", comp_type(c, g, k).tag()))
}

/// The type of component `k`.
fn comp_type(c: CompiledRef<'_>, g: &TemplateGraph, k: Comp) -> ComponentType {
    match k {
        Comp::Elem(t, e) => c.plans.templates[t.index()].row(e).component_type,
        Comp::Made(m) => g.made[m as usize].component_type,
    }
}

/// How node `n` is shown in an error: its component and prop (`p1.x`),
/// a hidden port by its position.
fn node_label(c: CompiledRef<'_>, g: &TemplateGraph, n: GraphNode) -> String {
    let Some((k, pi)) = comp_of_node(g, n) else {
        return "(a value no component holds)".to_string();
    };
    let n_public = match k {
        Comp::Elem(t, e) => g.list_copies.get(&(t, e)).copied().unwrap_or_else(|| {
            let tpl = &c.plans.templates[t.index()];
            let ty = tpl.row(e).component_type;
            tpl.plan(e)
                .n_public(ty)
                .unwrap_or_else(|| ty.prop_defs().len())
        }),
        Comp::Made(m) => g.made[m as usize].n_public,
    };
    let owner = comp_label(c, g, k);
    match comp_type(c, g, k).prop_name(n_public, pi) {
        Some(name) => format!("{owner}.{name}"),
        None => format!("{owner}.(hidden slot {pi})"),
    }
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
}

//! Whether the compile's template graph covers a real build's graph, for
//! tests: the compile finds every cycle only if every dependency a build
//! at any count and pick can have is one the template graph has
//! (ADR 0032, step 8), with a label that admits it. This checks that on a
//! given build.
//!
//! An element's port is known in both graphs by its template, element and
//! position among the element's ports. Other nodes and slots are passed
//! through: a dependency is from an element's slot to the element slots it
//! reaches through them, in the template graph with its label composed
//! along the way. A real dependency is covered when the template graph has
//! one between the same ports whose label the real iterations satisfy.

use super::*;
use crate::compile::graph::{Coord, GraphNode, NodeKind, TemplateGraph, template_graph};

/// A port of an element: (template, element, position among its ports).
type Key = (TemplateId, ElemId, u32);

/// Every dependency of the template graph, between element ports, with
/// the labels of the paths that make it.
pub struct GraphEdges {
    deps: HashMap<Key, Vec<(Key, Vec<Coord>)>>,
}

/// The template graph's dependencies for `compiled`.
pub fn graph_edges(compiled: &Compiled) -> GraphEdges {
    let g = template_graph(compiled.view());
    let mut deps: HashMap<Key, Vec<(Key, Vec<Coord>)>> = HashMap::new();
    for u in GraphNode::below(g.nodes.len()) {
        let Some(ku) = graph_key(&g, u) else { continue };
        let found = deps.entry(ku).or_default();
        for dep in graph_element_deps(&g, u) {
            if !found.contains(&dep) {
                found.push(dep);
            }
        }
    }
    GraphEdges { deps }
}

/// The dependencies of the build of `compiled` at `counts`, reading
/// `session`, that the template graph does not cover, described; empty
/// when it covers them all.
pub fn uncovered(
    edges: &GraphEdges,
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
) -> std::result::Result<Vec<String>, String> {
    let mut math = MathStore::default();
    let mut b = Builder::new(compiled.view(), session, false, &mut math, counts);
    b.expand_all().map_err(|e| e.to_string())?;
    b.resolve_all().map_err(|e| e.to_string())?;
    let mut out = Vec::new();
    for u in SlotId::below(b.sources.len()) {
        let Some(ku) = b.slot_key(u) else { continue };
        let at_u = b.positions(b.slot_scope[u.index()]);
        for v in b.element_deps(u) {
            let kv = b.slot_key(v).expect("an element slot");
            let at_v = b.positions(b.slot_scope[v.index()]);
            let covered = edges.deps.get(&ku).is_some_and(|ds| {
                ds.iter()
                    .any(|(k, label)| *k == kv && admits(label, &at_u, &at_v))
            });
            if !covered {
                out.push(format!(
                    "{} (at {at_u:?}) reads {} (at {at_v:?}), which the template graph does not",
                    b.slot_label(u),
                    b.slot_label(v)
                ));
            }
        }
    }
    Ok(out)
}

/// Whether a real dependency, from a slot at scope positions `at_u` to one
/// at `at_v` (per level from the document down: the repeat or choice
/// element and the 1-based position), satisfies a template graph label. A
/// kept coordinate relates positions, whatever repeat each is in.
fn admits(label: &[Coord], at_u: &[(NodeId, u32)], at_v: &[(NodeId, u32)]) -> bool {
    label.iter().enumerate().all(|(j, c)| match c {
        Coord::Reset => true,
        Coord::Keep(s) => match (at_u.get(j), at_v.get(j)) {
            (Some(&(_, ku)), Some(&(_, kv))) => kv as i64 - ku as i64 == *s,
            _ => false,
        },
    })
}

/// Coverage (tests only): a real build's slots and dependencies, keyed as the
/// template graph keys its ports (ADR 0032, step 8).
impl Builder<'_> {
    /// The key of an element's slot; None for any other slot.
    fn slot_key(&self, s: SlotId) -> Option<Key> {
        let comp = self.slot_comp[s.index()];
        if comp == CompIdx::NONE {
            return None;
        }
        let i = self.comp_instance[comp.index()];
        if i.is_none() {
            return None;
        }
        let inst = self.instances[i.index()];
        Some((
            inst.template,
            inst.elem,
            s.get() - self.slot_base[comp.index()].get(),
        ))
    }

    /// A scope's (element, position) per level, from the document down.
    fn positions(&self, mut s: ScopeId) -> Vec<(NodeId, u32)> {
        let mut out = Vec::new();
        while s != ScopeId::DOCUMENT {
            let (parent, node, k) = self.scopes[s];
            out.push((node, k));
            s = parent;
        }
        out.reverse();
        out
    }

    /// The element slots `u` reads, directly or through other slots.
    fn element_deps(&self, u: SlotId) -> Vec<SlotId> {
        let mut out = Vec::new();
        let mut seen = HashSet::new();
        let mut stack = vec![u];
        while let Some(a) = stack.pop() {
            for w in self.sources[a.index()].eval_inputs(&self.op_inputs) {
                if self.slot_key(w).is_some() {
                    out.push(w);
                } else if seen.insert(w) {
                    stack.push(w);
                }
            }
        }
        out
    }
}

/// The label of a path `u -> a -> v` from those of its two edges: a level
/// both keep is kept, shifted by both; any other is reset.
fn compose(to_a: &[Coord], a_to_v: &[Coord]) -> Vec<Coord> {
    a_to_v
        .iter()
        .enumerate()
        .map(|(j, c)| match (to_a.get(j), c) {
            (Some(Coord::Keep(s)), Coord::Keep(t)) => Coord::Keep(s + t),
            _ => Coord::Reset,
        })
        .collect()
}

/// The key of an element's port node; None for any other node.
fn graph_key(g: &TemplateGraph, n: GraphNode) -> Option<Key> {
    let node = g.nodes[n.index()];
    match node.kind {
        NodeKind::Port { elem, port } => Some((node.template, elem, port)),
        _ => None,
    }
}

/// The element ports `u` reads, directly or through other nodes, each
/// with the label of a path to it, composed along the way.
fn graph_element_deps(g: &TemplateGraph, u: GraphNode) -> Vec<(Key, Vec<Coord>)> {
    let mut out = Vec::new();
    let mut seen = HashSet::new();
    let mut stack = vec![(u, Vec::new(), true)];
    while let Some((a, so_far, first)) = stack.pop() {
        for &w in g.reads(a) {
            let label = if first {
                g.label(a, w)
            } else {
                compose(&so_far, &g.label(a, w))
            };
            match graph_key(g, w) {
                Some(kw) => out.push((kw, label)),
                None => {
                    if seen.insert((w, label.clone())) {
                        stack.push((w, label, false));
                    }
                }
            }
        }
    }
    out
}

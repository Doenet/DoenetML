//! Whether the abstract build's graph covers a real build's, for tests:
//! the compile finds every cycle only if every dependency a build at any
//! count and pick can have is one the abstract build has, with a label
//! that admits it. This checks that on a given build.
//!
//! An element's slot is known in both graphs by its template, element and
//! position among the element's slots. Other slots are passed through: a
//! dependency is from an element's slot to the element slots it reaches
//! through them, its label composed along the way. A real dependency is
//! covered when the abstract build has one between the same slots whose
//! label the real iterations satisfy.

use super::*;
use crate::compile::graph::{GraphNode, NodeKind, TemplateGraph, template_graph};

/// A slot of an element: (template, element, position among its slots).
type Key = (TemplateId, ElemId, u32);

/// Every dependency of the abstract build's graph, between element slots,
/// with the labels of the paths that make it.
pub struct AbstractEdges {
    deps: HashMap<Key, Vec<(Key, Vec<Coord>)>>,
}

/// The abstract build's dependencies for `compiled`.
pub fn abstract_edges(compiled: &Compiled) -> std::result::Result<AbstractEdges, String> {
    let session = Session::new(0);
    let mut math = MathStore::default();
    let b = staged(compiled.view(), &session, &mut math, &View::Abstract)?;
    let depth = b.scope_depths();
    let mut deps: HashMap<Key, Vec<(Key, Vec<Coord>)>> = HashMap::new();
    for u in SlotId::below(b.sources.len()) {
        let Some(ku) = b.slot_key(u) else { continue };
        let found = deps.entry(ku).or_default();
        for (v, label) in b.element_deps(u, &depth, true) {
            let kv = b.slot_key(v).expect("an element slot");
            if !found.contains(&(kv, label.clone())) {
                found.push((kv, label));
            }
        }
    }
    Ok(AbstractEdges { deps })
}

/// The dependencies of the build of `compiled` at `counts`, reading
/// `session`, that the abstract build's graph does not cover, described;
/// empty when it covers them all.
pub fn uncovered(
    edges: &AbstractEdges,
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
) -> std::result::Result<Vec<String>, String> {
    let mut math = MathStore::default();
    let view = View::Stamped { counts };
    let b = staged(compiled.view(), session, &mut math, &view)?;
    let depth = b.scope_depths();
    let mut out = Vec::new();
    for u in SlotId::below(b.sources.len()) {
        let Some(ku) = b.slot_key(u) else { continue };
        let at_u = b.positions(b.slot_scope[u.index()]);
        for (v, _) in b.element_deps(u, &depth, false) {
            let kv = b.slot_key(v).expect("an element slot");
            let at_v = b.positions(b.slot_scope[v.index()]);
            let covered = edges.deps.get(&ku).is_some_and(|ds| {
                ds.iter()
                    .any(|(k, label)| *k == kv && admits(label, &at_u, &at_v))
            });
            if !covered {
                out.push(format!(
                    "{} (at {at_u:?}) reads {} (at {at_v:?}), which the abstract build does not",
                    b.slot_label(u),
                    b.slot_label(v)
                ));
            }
        }
    }
    Ok(out)
}

/// A builder through `view` with every template expanded and every
/// reference resolved: the whole graph, before cells are made.
fn staged<'c>(
    compiled: CompiledRef<'c>,
    session: &'c Session,
    math: &'c mut MathStore,
    view: &'c View<'c>,
) -> std::result::Result<Builder<'c>, String> {
    let mut b = Builder::new(compiled, session, false, math, view);
    b.expand_all().map_err(|e| e.to_string())?;
    b.resolve_all().map_err(|e| e.to_string())?;
    Ok(b)
}

/// Whether a real dependency, from a slot at scope positions `at_u` to one
/// at `at_v` (per level from the document down: the repeat or choice
/// element and the 1-based position), satisfies an abstract-build label. A
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

    /// The depth of every scope: 0 for the document.
    fn scope_depths(&self) -> Vec<u32> {
        let mut depth = vec![0u32; self.scopes.len()];
        for s in 1..self.scopes.len() {
            depth[s] = depth[self.scopes[ScopeId::from_index(s)].0.index()] + 1;
        }
        depth
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

    /// The element slots `u` reads, directly or through other slots, each
    /// with the label of a path to it (composed when `labelled`).
    fn element_deps(&self, u: SlotId, depth: &[u32], labelled: bool) -> Vec<(SlotId, Vec<Coord>)> {
        let mut out = Vec::new();
        let mut seen = HashSet::new();
        let mut stack = vec![(u, Vec::new(), true)];
        let mut inputs = Vec::new();
        while let Some((a, so_far, first)) = stack.pop() {
            inputs.clear();
            self.push_inputs(a, &mut inputs);
            for &w in &inputs {
                let label = if !labelled {
                    Vec::new()
                } else if first {
                    self.edge_label(a, w, depth)
                } else {
                    compose(&so_far, &self.edge_label(a, w, depth))
                };
                if self.slot_key(w).is_some() {
                    out.push((w, label));
                } else if seen.insert((w, label.clone())) {
                    stack.push((w, label, false));
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

/// How the compile's template graph (ADR 0032, step 8) agrees with the
/// abstract build's graph on a document, between element slots, labels
/// composed through every other node.
#[derive(Debug)]
pub struct GraphAgreement {
    /// Dependencies the template graph has and the abstract build does
    /// not, described: never any.
    pub extra: Vec<String>,
    /// Dependencies the abstract build has and the template graph does
    /// not, described: never any.
    pub missing: Vec<String>,
    /// How many dependencies the abstract build has between element
    /// slots: how many were compared.
    pub compared: usize,
}

/// The template graph of `compiled` against its abstract build.
pub fn template_graph_agreement(
    compiled: &Compiled,
) -> std::result::Result<GraphAgreement, String> {
    let abstract_deps = abstract_edges(compiled)?.deps;
    let g = template_graph(compiled.view());
    let mut graph_deps: HashMap<Key, Vec<(Key, Vec<Coord>)>> = HashMap::new();
    for u in GraphNode::below(g.nodes.len()) {
        let Some(ku) = graph_key(&g, u) else { continue };
        let found = graph_deps.entry(ku).or_default();
        for dep in graph_element_deps(&g, u) {
            if !found.contains(&dep) {
                found.push(dep);
            }
        }
    }
    let describe = |k: &Key| {
        let (t, e, pi) = *k;
        let row = compiled.plans.templates[t.index()].row(e);
        let name = match row.name {
            StrId::NONE => format!("<{}>", row.component_type.tag()),
            s => compiled.dast.strings.get(s).trim().to_string(),
        };
        let prop = row
            .component_type
            .prop_name(usize::MAX, pi as usize)
            .unwrap_or_else(|| format!("port {pi}").into());
        format!("{name}.{prop} (template {t}, element {e}, port {pi})")
    };
    // What `a` has that `b` lacks, described.
    let lacks = |a: &HashMap<Key, Vec<(Key, Vec<Coord>)>>,
                 b: &HashMap<Key, Vec<(Key, Vec<Coord>)>>| {
        let mut out = Vec::new();
        for (ku, deps) in a {
            for (kv, label) in deps {
                if !b
                    .get(ku)
                    .is_some_and(|ds| ds.contains(&(*kv, label.clone())))
                {
                    out.push(format!(
                        "{} reads {} labelled {label:?}",
                        describe(ku),
                        describe(kv)
                    ));
                }
            }
        }
        out.sort();
        out
    };
    let compared = abstract_deps.values().map(Vec::len).sum();
    Ok(GraphAgreement {
        compared,
        extra: lacks(&graph_deps, &abstract_deps),
        missing: lacks(&abstract_deps, &graph_deps),
    })
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
/// with the label of a path to it, composed as `Builder::element_deps`
/// composes it.
fn graph_element_deps(g: &TemplateGraph, u: GraphNode) -> Vec<(Key, Vec<Coord>)> {
    let mut out = Vec::new();
    let mut seen = HashSet::new();
    let mut stack = vec![(u, Vec::new(), true)];
    while let Some((a, so_far, first)) = stack.pop() {
        for &w in &g.reads[a.index()] {
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

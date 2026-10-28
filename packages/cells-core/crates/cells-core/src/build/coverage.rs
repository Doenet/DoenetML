//! Whether the probe's graph covers a real build's (ADR 0012, ADR 0014),
//! for tests: the compile finds every cycle only if every dependency a
//! build at any count and pick can have is one the probe has, with a label
//! that admits it. That rests on conventions (every structural read goes
//! through the view, every indexed edge is labelled right); this checks
//! them on a given build instead of trusting them.
//!
//! A slot of an element is known in both graphs by its template, element
//! and position among the element's slots: the probe stamps each template
//! once, so that names one probe slot. Other slots (an operator's
//! intermediates, the probe's stand-ins for a pick, the missing referent)
//! are passed through: a dependency is from an element's slot to the
//! element slots it reaches through them, its probe label composed along
//! the way. A real dependency is covered when the probe has one between
//! the same slots whose label the real iterations satisfy: a kept
//! coordinate at a level says the position there is shifted by its
//! amount, a reset one says nothing.

use super::*;

/// A slot of an element: (template, element, position among its slots).
type Key = (TemplateId, ElemId, u32);

/// Every dependency of the probe's graph, between element slots, with the
/// labels of the paths that make it. Built once per compile.
pub struct ProbeEdges {
    deps: HashMap<Key, Vec<(Key, Vec<Coord>)>>,
}

/// The probe's dependencies for `compiled`.
pub fn probe_edges(compiled: &Compiled) -> std::result::Result<ProbeEdges, String> {
    let session = Session::new(0, false);
    let mut engine = Engine::new();
    let b = staged(compiled, &session, &mut engine, &probe::Probe)?;
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
    Ok(ProbeEdges { deps })
}

/// The dependencies of the build of `compiled` at `counts`, reading
/// `session`, that the probe's graph does not cover, described; empty
/// when it covers them all.
pub fn uncovered(
    probe: &ProbeEdges,
    compiled: &Compiled,
    session: &Session,
    counts: &Counts,
) -> std::result::Result<Vec<String>, String> {
    let mut engine = Engine::new();
    let view = Stamped { session, counts };
    let b = staged(compiled, session, &mut engine, &view)?;
    let depth = b.scope_depths();
    let mut out = Vec::new();
    for u in SlotId::below(b.sources.len()) {
        let Some(ku) = b.slot_key(u) else { continue };
        let at_u = b.positions(b.slot_scope[u.index()]);
        for (v, _) in b.element_deps(u, &depth, false) {
            let kv = b.slot_key(v).expect("an element slot");
            let at_v = b.positions(b.slot_scope[v.index()]);
            let covered = probe.deps.get(&ku).is_some_and(|ds| {
                ds.iter()
                    .any(|(k, label)| *k == kv && admits(label, &at_u, &at_v))
            });
            if !covered {
                out.push(format!(
                    "{} (at {at_u:?}) reads {} (at {at_v:?}), which the probe does not",
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
    compiled: &'c Compiled,
    session: &'c Session,
    engine: &'c mut Engine,
    view: &'c dyn View,
) -> std::result::Result<Builder<'c>, String> {
    let mut b = Builder::new(compiled, session, false, engine, view);
    b.expand_all().map_err(|e| e.to_string())?;
    b.resolve_all().map_err(|e| e.to_string())?;
    Ok(b)
}

/// Whether a real dependency, from a slot at scope positions `at_u` to one
/// at `at_v` (per level from the document down: the repeat or choice
/// element and the 1-based position), satisfies a probe label. A kept
/// coordinate relates positions, whatever repeat each is in (`$r[$k+1]`
/// inside `q` keeps `q`'s position plus one): a loop comes back to the same
/// slot, so the same repeat, and only the positions add up.
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
        if i == NONE {
            return None;
        }
        let inst = self.instances[i as usize];
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

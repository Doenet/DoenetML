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
use crate::compile::graph::{Def, GraphNode, GraphOp, NodeKind, TemplateGraph, template_graph};

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
    /// The slots a slot's source reads, plus its later sources.
    fn push_inputs(&self, s: SlotId, out: &mut Vec<SlotId>) {
        out.extend(self.sources[s.index()].eval_inputs(&self.op_inputs));
        for (slot, src) in &self.later_sources {
            if *slot == s {
                out.extend(src.eval_inputs(&self.op_inputs));
            }
        }
    }

    /// The label of edge `u -> v`: as recorded for a reference, else the
    /// position shared with the target kept and the rest reset.
    fn edge_label(&self, u: SlotId, v: SlotId, depth: &[u32]) -> Vec<Coord> {
        if let Some(l) = self.labels.get(&(u, v)) {
            return l.clone();
        }
        let (mut a, mut b) = (self.slot_scope[u.index()], self.slot_scope[v.index()]);
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
    let describe = |k: &Key| key_name(compiled, *k);
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

/// How element port `k` is shown in a disagreement.
fn key_name(compiled: &Compiled, (t, e, pi): Key) -> String {
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
}

/// The definitions of the template graph of `compiled` against the
/// abstract build's resolved slots (ADR 0032, step 8, part 4): for each
/// element port, its definition unfolded through every node or slot no
/// element owns down to element ports, its later sources, the flags that
/// hold it, what seeds it, and whether it is a counted value or may be a
/// document constant. Values are left out: a math handle's is the
/// engine's. Returns the disagreements, described, and how many ports
/// were compared.
pub fn definitions_disagreement(
    compiled: &Compiled,
) -> std::result::Result<(Vec<String>, usize), String> {
    let session = Session::new(0);
    let mut math = MathStore::default();
    let b = staged(compiled.view(), &session, &mut math, &View::Abstract)?;
    let g = template_graph(compiled.view());

    let mut built: HashMap<Key, String> = HashMap::new();
    let mut memo: HashMap<SlotId, String> = HashMap::new();
    for s in SlotId::below(b.sources.len()) {
        let Some(k) = b.slot_key(s) else { continue };
        let mut entry = b.describe_source(&b.sources[s.index()], &mut memo, &mut Vec::new());
        for (slot, src) in &b.later_sources {
            if *slot == s {
                entry += &format!(
                    " later {}",
                    b.describe_source(src, &mut memo, &mut Vec::new())
                );
            }
        }
        for &(slot, f) in &b.holds {
            if slot == s {
                entry += &format!(
                    " held by {}",
                    b.describe_slot(f, &mut memo, &mut Vec::new())
                );
            }
        }
        for &(slot, from) in &b.seeds {
            if slot == s {
                entry += &format!(
                    " seeded by {}",
                    b.describe_slot(from, &mut memo, &mut Vec::new())
                );
            }
        }
        if b.counted_slots.contains(&s) {
            entry += " counted";
        }
        if b.document_slots.contains(&s) {
            entry += " document";
        }
        built.insert(k, entry);
    }

    let mut stamped: HashMap<Key, String> = HashMap::new();
    let mut memo: HashMap<GraphNode, String> = HashMap::new();
    for n in GraphNode::below(g.nodes.len()) {
        let Some(k) = graph_key(&g, n) else { continue };
        let mut entry = describe_def(&g, &g.defs[n.index()], &mut memo, &mut Vec::new());
        for (m, def) in &g.later {
            if *m == n {
                entry += &format!(
                    " later {}",
                    describe_def(&g, def, &mut memo, &mut Vec::new())
                );
            }
        }
        for &(m, f) in &g.holds {
            if m == n {
                entry += &format!(
                    " held by {}",
                    describe_node(&g, f, &mut memo, &mut Vec::new())
                );
            }
        }
        for &(m, from) in &g.seeds {
            if m == n {
                entry += &format!(
                    " seeded by {}",
                    describe_node(&g, from, &mut memo, &mut Vec::new())
                );
            }
        }
        if g.counted.contains(&n) {
            entry += " counted";
        }
        if g.document.contains(&n) {
            entry += " document";
        }
        stamped.insert(k, entry);
    }

    let mut out = Vec::new();
    let mut keys: Vec<&Key> = built.keys().chain(stamped.keys()).collect();
    keys.sort();
    keys.dedup();
    for k in keys {
        let (a, t) = (built.get(k), stamped.get(k));
        if a != t {
            out.push(format!(
                "{}: the abstract build has {}, the template graph {}",
                key_name(compiled, *k),
                a.map_or("nothing", String::as_str),
                t.map_or("nothing", String::as_str)
            ));
        }
    }
    Ok((out, built.len()))
}

impl Builder<'_> {
    /// Slot `s` as a definition names it: an element's slot by its key,
    /// any other by its source, unfolded.
    fn describe_slot(
        &self,
        s: SlotId,
        memo: &mut HashMap<SlotId, String>,
        visiting: &mut Vec<SlotId>,
    ) -> String {
        if let Some(k) = self.slot_key(s) {
            return format!("{k:?}");
        }
        if let Some(d) = memo.get(&s) {
            return d.clone();
        }
        if visiting.contains(&s) {
            return "(loop)".into();
        }
        visiting.push(s);
        let d = self.describe_source(&self.sources[s.index()], memo, visiting);
        visiting.pop();
        memo.insert(s, d.clone());
        d
    }

    /// `src` unfolded through every slot no element owns.
    fn describe_source(
        &self,
        src: &BuiltSource,
        memo: &mut HashMap<SlotId, String>,
        visiting: &mut Vec<SlotId>,
    ) -> String {
        let mut each = |slots: &[SlotId]| {
            slots
                .iter()
                .map(|&x| self.describe_slot(x, memo, visiting))
                .collect::<Vec<_>>()
                .join(", ")
        };
        match src {
            BuiltSource::Unset => "unset".into(),
            BuiltSource::Given(_) => "given".into(),
            BuiltSource::Const(_) => "const".into(),
            BuiltSource::Alias(t) => format!("alias({})", each(&[*t])),
            BuiltSource::Op(op, start, n) => {
                let inputs = &self.op_inputs[start.index()..start.index() + *n as usize];
                match op {
                    PlannedOp::Spec(spec) => format!("{spec:?}({})", each(inputs)),
                    PlannedOp::Template { .. } => format!("template({})", each(inputs)),
                }
            }
            BuiltSource::VecOut(head, k) => format!("out{k}({})", each(&[*head])),
        }
    }
}

/// Node `n` as a definition names it: an element's port by its key, any
/// other by its definition, unfolded.
fn describe_node(
    g: &TemplateGraph,
    n: GraphNode,
    memo: &mut HashMap<GraphNode, String>,
    visiting: &mut Vec<GraphNode>,
) -> String {
    if let Some(k) = graph_key(g, n) {
        return format!("{k:?}");
    }
    if let Some(d) = memo.get(&n) {
        return d.clone();
    }
    if visiting.contains(&n) {
        return "(loop)".into();
    }
    visiting.push(n);
    let d = describe_def(g, &g.defs[n.index()], memo, visiting);
    visiting.pop();
    memo.insert(n, d.clone());
    d
}

/// `def` unfolded through every node no element owns.
fn describe_def(
    g: &TemplateGraph,
    def: &Def,
    memo: &mut HashMap<GraphNode, String>,
    visiting: &mut Vec<GraphNode>,
) -> String {
    let mut each = |nodes: &[GraphNode]| {
        nodes
            .iter()
            .map(|&x| describe_node(g, x, memo, visiting))
            .collect::<Vec<_>>()
            .join(", ")
    };
    match def {
        Def::Unset => "unset".into(),
        Def::Given(_) => "given".into(),
        Def::Const(_) => "const".into(),
        Def::Alias(t) => format!("alias({})", each(&[*t])),
        Def::Op(GraphOp::Spec(spec), inputs) => format!("{spec:?}({})", each(inputs)),
        Def::Op(GraphOp::Template, inputs) => format!("template({})", each(inputs)),
        Def::VecOut(head, k) => format!("out{k}({})", each(&[*head])),
    }
}

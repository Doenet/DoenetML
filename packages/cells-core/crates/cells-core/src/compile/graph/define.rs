//! Define over the template graph (ADR 0032, step 8; ADR 0035), as a
//! build defines its slots (`build/define.rs`): aliased nodes
//! merged into the cells they will share, each cell's defining node, the
//! flags that hold each cell, the author's binary operators oriented (ADR
//! 0026), the prefill rule, and the two walks, writable (ADR 0018) and
//! live (ADR 0019), from which each port's attributes follow.
//!
//! A walk reads a cell through its definition ([`CellDef`]), which offers
//! what the cell needs (what its definition reads, and the flags that hold
//! it) and where a request on it goes (the inputs its inverse may write,
//! nowhere when a constant flag holds it).

use super::*;
use crate::compile::FxMap;
use crate::error::Error;

/// What define made of the graph: the cells, and each node's class.
pub(crate) struct Defined {
    /// Each node's cell, named by the node the union-find merged it under.
    cell_of: Vec<GraphNode>,
    /// Each cell's defining node, by the cell.
    def: Vec<GraphNode>,
    /// The flags that hold each cell.
    flags: FxMap<GraphNode, Vec<GraphNode>>,
    /// The cells a constant flag holds: no request passes them.
    held_always: Vec<bool>,
    /// Per node, whether it is a given value a student's action can write.
    pub(crate) essential: Vec<bool>,
    /// Per node, whether the document computes its cell.
    pub(crate) live: Vec<bool>,
    /// Each writable node's first input to reach it, by its position in
    /// the graph's components: what a refused load-time choice names
    /// (ADR 0037).
    pub(crate) written_by: FxMap<GraphNode, u32>,
}

/// One cell as one of its definitions defines it, and what holds it.
struct CellDef<'a> {
    node: GraphNode,
    def: &'a Def,
    flags: &'a [GraphNode],
    held_always: bool,
}

impl<'a> CellDef<'a> {
    /// What the cell needs: what its definition reads, and its flags.
    fn needs(&self) -> impl Iterator<Item = GraphNode> + 'a {
        self.def.reads().iter().chain(self.flags).copied()
    }

    /// Where a request on the cell goes: the inputs its inverse may write
    /// (every one of an alias's or a vector output's), and nowhere when a
    /// constant flag holds it.
    fn request_targets(&self) -> impl Iterator<Item = GraphNode> + 'a {
        let mask = match self.def {
            Def::Op(GraphOp::Spec(spec), _) => spec.writes(),
            Def::Op(GraphOp::Template(_), _) => 0,
            _ => u64::MAX,
        };
        let reads = if self.held_always {
            &[][..]
        } else {
            self.def.reads()
        };
        reads
            .iter()
            .enumerate()
            .filter(move |&(k, _)| k < 64 && mask & (1 << k) != 0)
            .map(|(_, &n)| n)
    }
}

/// Define `g`, the template graph of `c`: merge, orient (which turns
/// operators of `g` round), check the prefill rule, and walk. A prefill
/// the rule refuses names its element to box.
pub(crate) fn define(
    g: &mut TemplateGraph,
    c: CompiledRef<'_>,
) -> std::result::Result<Defined, Failure> {
    let n = g.nodes.len();
    let mut uf: Vec<u32> = (0..n as u32).collect();
    fn find(uf: &mut [u32], mut x: u32) -> u32 {
        while uf[x as usize] != x {
            let p = uf[x as usize];
            uf[x as usize] = uf[p as usize];
            x = p;
        }
        x
    }
    for (s, def) in g.defs.iter().enumerate() {
        if let Def::Alias(t) = def {
            let (ra, rb) = (find(&mut uf, s as u32), find(&mut uf, t.get()));
            if ra != rb {
                uf[ra as usize] = rb;
            }
        }
    }
    let cell_of: Vec<GraphNode> = (0..n as u32)
        .map(|s| GraphNode::new(find(&mut uf, s)))
        .collect();
    // The one node of each cell that is not an alias defines it.
    let mut def = vec![GraphNode::NONE; n];
    for (s, d) in g.defs.iter().enumerate() {
        match d {
            Def::Alias(_) => {}
            Def::Unset => unreachable!("node {s} was never defined"),
            _ => def[cell_of[s].index()] = GraphNode::from_index(s),
        }
    }
    // A cell of aliases with no definer is a recurrence folded onto
    // itself, which the cycle check has judged: a constant.
    for (s, root) in cell_of.iter().enumerate() {
        let root = root.index();
        if def[root].is_none() {
            g.defs[s] = Def::Const(Some(f64::NAN));
            def[root] = GraphNode::from_index(s);
        }
    }
    let mut flags: FxMap<GraphNode, Vec<GraphNode>> = FxMap::default();
    for &(s, f) in &g.holds {
        let held = flags.entry(cell_of[s.index()]).or_default();
        if !held.contains(&f) {
            held.push(f);
        }
    }
    let mut held_always = vec![false; n];
    for (&cell, fs) in &flags {
        held_always[cell.index()] = fs.iter().any(|f| {
            // A math handle's value is the engine's, and not zero.
            matches!(g.defs[def[cell_of[f.index()].index()].index()],
                Def::Const(v) if v.is_none_or(|v| v != 0.0))
        });
    }
    let mut d = Defined {
        cell_of,
        def,
        flags,
        held_always,
        essential: Vec::new(),
        live: Vec::new(),
        written_by: FxMap::default(),
    };
    d.orient(g);
    d.prefill_rule(g, c)?;
    (d.essential, d.written_by) = d.writable(g);
    d.live = d.live_nodes(g);
    Ok(d)
}

impl Defined {
    /// The cell node `n` will share.
    pub(super) fn cell_of(&self, n: GraphNode) -> GraphNode {
        self.cell_of[n.index()]
    }

    /// The node that defines `cell`.
    pub(super) fn def(&self, cell: GraphNode) -> GraphNode {
        self.def[cell.index()]
    }

    /// Whether node `n` defines its cell.
    pub(super) fn defines(&self, n: GraphNode) -> bool {
        self.def(self.cell_of(n)) == n
    }

    /// The flags that hold `cell`, in the order the holds listed them.
    pub(super) fn flags(&self, cell: GraphNode) -> &[GraphNode] {
        self.flags.get(&cell).map_or(&[], Vec::as_slice)
    }

    fn def_of<'a>(&'a self, node: GraphNode, def: &'a Def) -> CellDef<'a> {
        let cell = self.cell_of(node);
        CellDef {
            node,
            def,
            flags: self.flags.get(&cell).map_or(&[], Vec::as_slice),
            held_always: self.held_always[cell.index()],
        }
    }

    /// Whether `cell` holds a counted value (ADR 0028).
    fn counted_cell(&self, g: &TemplateGraph, cell: GraphNode) -> bool {
        g.counted.iter().any(|&s| self.cell_of(s) == cell)
    }

    /// Walk backward over the cells: from the cells on `stack`, each cell
    /// `enter` admits is given to `edge` as its definition, then as each
    /// other definition its nodes have (later ones and `extra`), and
    /// `edge` pushes the cells to go on to.
    fn walk(
        &self,
        g: &TemplateGraph,
        mut stack: Vec<GraphNode>,
        extra: &[(GraphNode, Def)],
        mut enter: impl FnMut(GraphNode) -> bool,
        mut edge: impl FnMut(CellDef<'_>, &mut Vec<GraphNode>),
    ) {
        let mut seen = vec![false; g.nodes.len()];
        let mut besides: FxMap<GraphNode, Vec<&(GraphNode, Def)>> = FxMap::default();
        for entry in g.later.iter().chain(extra) {
            besides
                .entry(self.cell_of(entry.0))
                .or_default()
                .push(entry);
        }
        while let Some(cell) = stack.pop() {
            if std::mem::replace(&mut seen[cell.index()], true) || !enter(cell) {
                continue;
            }
            let def = self.def[cell.index()];
            edge(self.def_of(def, &g.defs[def.index()]), &mut stack);
            if let Some(entries) = besides.get(&cell) {
                for (node, d) in entries {
                    edge(self.def_of(*node, d), &mut stack);
                }
            }
        }
    }

    /// Per node, whether it is a given value a student's action can write:
    /// one a request reaches from an input that no constant flag holds;
    /// and each such node's first input to reach it.
    fn writable(&self, g: &TemplateGraph) -> (Vec<bool>, FxMap<GraphNode, u32>) {
        let mut writable = vec![false; g.nodes.len()];
        let mut stack = Vec::new();
        // The input each cell on the walk was first reached from.
        let mut from: FxMap<GraphNode, u32> = FxMap::default();
        for (ci, comp) in g.comps.iter().enumerate() {
            let np = comp.n_public as usize;
            for pi in 0..np {
                if comp.component_type.is_input_prop(np, pi) {
                    let cell = self.cell_of(comp.base.offset(pi));
                    from.entry(cell).or_insert(ci as u32);
                    stack.push(cell);
                }
            }
        }
        // The walk takes cells from the end of its stack.
        stack.reverse();
        let mut written_by = FxMap::default();
        self.walk(
            g,
            stack,
            &[],
            |_| true,
            |def, stack| {
                let origin = from[&self.cell_of(def.node)];
                if let Def::Given(_) = def.def
                    && !def.held_always
                {
                    writable[def.node.index()] = true;
                    written_by.entry(def.node).or_insert(origin);
                }
                for n in def.request_targets() {
                    let cell = self.cell_of(n);
                    from.entry(cell).or_insert(origin);
                    stack.push(cell);
                }
            },
        );
        (writable, written_by)
    }

    /// Per node, whether its cell is live: reached from a root (a prop
    /// that is an output or that the core reads itself) through what each
    /// cell needs, a seed's source included.
    fn live_nodes(&self, g: &TemplateGraph) -> Vec<bool> {
        let mut stack = Vec::new();
        for comp in &g.comps {
            let (ty, np) = (comp.component_type, comp.n_public as usize);
            // Snapping reads a sticky group's settings and every point of
            // its members.
            let sticky = ty == ComponentType::StickyGroup
                || (comp.in_sticky && ty.sticky_layout().is_some());
            for pi in 0..np {
                if sticky
                    || ty.is_root_prop(np, pi)
                    || (comp.rendered && ty.is_rendered_prop(np, pi))
                {
                    stack.push(self.cell_of(comp.base.offset(pi)));
                }
            }
        }
        let seeds: Vec<(GraphNode, Def)> = g
            .seeds
            .iter()
            .map(|&(s, from)| (s, Def::Alias(from)))
            .collect();
        let mut live = vec![false; g.nodes.len()];
        self.walk(
            g,
            stack,
            &seeds,
            |cell| {
                live[cell.index()] = true;
                true
            },
            |def, stack| stack.extend(def.needs().map(|n| self.cell_of(n))),
        );
        (0..g.nodes.len())
            .map(|s| live[self.cell_of[s].index()])
            .collect()
    }

    /// The prefill rule (ADR 0012): a prefill reference must name a cell
    /// whose definition is not an operator, unless it holds a counted
    /// value. The seeded element is boxed.
    fn prefill_rule(
        &self,
        g: &TemplateGraph,
        c: CompiledRef<'_>,
    ) -> std::result::Result<(), Failure> {
        for &(s, from) in &g.seeds {
            let cell = self.cell_of(from);
            let computed = matches!(
                g.defs[self.def[cell.index()].index()],
                Def::Op(..) | Def::VecOut(..)
            );
            if computed && !self.counted_cell(g, cell) {
                let node = match g.nodes[s.index()].kind {
                    NodeKind::Port { elem, .. } => {
                        let t = g.nodes[s.index()].template;
                        Some(c.plans.templates[t.index()].row(elem).node).filter(|n| !n.is_none())
                    }
                    _ => None,
                };
                return Err(Failure {
                    error: Error::Unsupported(format!(
                        "prefill=\"${}\": a prefill reference must name a value that is not computed",
                        refuse::slot_label(g, c, from)
                    )),
                    node,
                });
            }
        }
        Ok(())
    }

    /// Orient every binary operator lowered from the author's math: one
    /// whose second input leads to state and whose first does not is
    /// turned round (`Sub` to `RSub`, `Div` to `RDiv`, the rest swap), so
    /// a request writes the input that leads somewhere. Operators are
    /// oriented from their inputs up; a loop counts as not leading where
    /// it closes.
    fn orient(&self, g: &mut TemplateGraph) {
        if g.author_ops.is_empty() {
            return;
        }
        let n = g.nodes.len();
        let mut author = vec![false; n];
        for &s in &g.author_ops {
            author[s.index()] = true;
        }
        let mut later: FxMap<GraphNode, Vec<usize>> = FxMap::default();
        for (i, &(s, _)) in g.later.iter().enumerate() {
            later.entry(self.cell_of(s)).or_default().push(i);
        }
        // A cell's definitions: its defining node's, then its later ones.
        let sources_of = |cell: GraphNode| {
            std::iter::once(At::Node(self.def[cell.index()])).chain(
                later
                    .get(&cell)
                    .into_iter()
                    .flatten()
                    .map(|&i| At::Later(i)),
            )
        };
        const NEW: u8 = 0;
        const OPEN: u8 = 1;
        const DONE: u8 = 2;
        let mut state = vec![NEW; n];
        let mut leads = vec![false; n];
        let mut stack: Vec<(GraphNode, bool)> = Vec::new();
        for k in 0..g.author_ops.len() {
            let first = self.cell_of(g.author_ops[k]);
            if state[first.index()] != NEW {
                continue;
            }
            stack.push((first, false));
            while let Some((cell, expanded)) = stack.pop() {
                let i = cell.index();
                if expanded {
                    let mut any = false;
                    for at in sources_of(cell).collect::<Vec<_>>() {
                        any |= self.orient_source(g, at, &leads, &author);
                    }
                    leads[i] = any;
                    state[i] = DONE;
                    continue;
                }
                if state[i] != NEW {
                    continue;
                }
                state[i] = OPEN;
                stack.push((cell, true));
                for at in sources_of(cell) {
                    let (node, def) = at.get(g);
                    for s in self.def_of(node, def).needs() {
                        let below = self.cell_of(s);
                        if state[below.index()] == NEW {
                            stack.push((below, false));
                        }
                    }
                }
            }
        }
    }

    /// Turn the operator at `at` round if it should be, and say whether
    /// its definition leads to state; every cell below it is decided.
    fn orient_source(
        &self,
        g: &mut TemplateGraph,
        at: At,
        leads: &[bool],
        author: &[bool],
    ) -> bool {
        let leads_from = |s: GraphNode| leads[self.cell_of(s).index()];
        let turn = match at.get(g) {
            (node, Def::Op(GraphOp::Spec(spec), inputs))
                if inputs.len() == 2
                    && author[node.index()]
                    && !leads_from(inputs[0])
                    && leads_from(inputs[1]) =>
            {
                swapped(*spec).map(|turned| (turned, inputs[0], inputs[1]))
            }
            _ => None,
        };
        if let Some((turned, a, b)) = turn {
            *at.get_mut(g) = Def::Op(GraphOp::Spec(turned), vec![b, a]);
        }
        let (node, def) = at.get(g);
        let def = self.def_of(node, def);
        match def.def {
            Def::Given(_) => !def.held_always,
            _ => def.request_targets().any(leads_from),
        }
    }

    /// Each port's attributes, per template by template slot: writable,
    /// live, a counted value, a document constant (a constant, or a given
    /// value no student's action can write, where its plan gives one), and
    /// a constant by `constant` (`eval::Constants`, ADR 0037).
    pub(crate) fn attrs(
        &self,
        g: &TemplateGraph,
        c: CompiledRef<'_>,
        constant: &[bool],
    ) -> Vec<Vec<PortAttrs>> {
        let constant = constant.to_vec();
        let n = g.nodes.len();
        let mut counted = vec![false; n];
        for &s in &g.counted {
            counted[s.index()] = true;
        }
        let mut document = vec![false; n];
        for &s in &g.document {
            document[s.index()] = match g.defs[s.index()] {
                Def::Const(_) => true,
                Def::Given(_) => !self.essential[s.index()],
                _ => false,
            };
        }
        let mut attrs: Vec<Vec<PortAttrs>> = c
            .plans
            .templates
            .iter()
            .map(|t| vec![PortAttrs::default(); t.sealed.n_slots as usize])
            .collect();
        for (s, node) in g.nodes.iter().enumerate() {
            let NodeKind::Port { elem, port } = node.kind else {
                continue;
            };
            let tpl = &c.plans.templates[node.template.index()];
            let reserved = tpl
                .plan(elem)
                .props
                .len()
                .max(tpl.row(elem).component_type.prop_defs().len());
            if port as usize >= reserved {
                continue;
            }
            let slot = tpl.sealed.elems[elem.index()]
                .slot_off
                .offset(port as usize);
            let a = &mut attrs[node.template.index()][slot.index()];
            for (marked, attr) in [
                (&self.essential, PortAttrs::WRITABLE),
                (&self.live, PortAttrs::LIVE),
                (&counted, PortAttrs::COUNTED),
                (&document, PortAttrs::DOCUMENT_CONSTANT),
                (&constant, PortAttrs::CONSTANT),
            ] {
                if marked[s] {
                    *a |= attr;
                }
            }
        }
        attrs
    }
}

/// Where one of a cell's definitions is: a node's own, or a later one.
#[derive(Clone, Copy)]
enum At {
    Node(GraphNode),
    Later(usize),
}

impl At {
    /// The node it defines, and the definition.
    fn get(self, g: &TemplateGraph) -> (GraphNode, &Def) {
        match self {
            At::Node(n) => (n, &g.defs[n.index()]),
            At::Later(i) => (g.later[i].0, &g.later[i].1),
        }
    }

    fn get_mut(self, g: &mut TemplateGraph) -> &mut Def {
        match self {
            At::Node(n) => &mut g.defs[n.index()],
            At::Later(i) => &mut g.later[i].1,
        }
    }
}

/// The operator computing the same value with its two inputs swapped, for
/// the binary operators whose inverse writes their first input.
fn swapped(spec: OpSpec) -> Option<OpSpec> {
    Some(match spec {
        OpSpec::Add | OpSpec::Mul | OpSpec::Min | OpSpec::Max => spec,
        OpSpec::Sub => OpSpec::RSub,
        OpSpec::RSub => OpSpec::Sub,
        OpSpec::Div => OpSpec::RDiv,
        OpSpec::RDiv => OpSpec::Div,
        _ => return None,
    })
}

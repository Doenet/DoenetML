//! The template graph (ADR 0032, step 8): every live template stamped once
//! in the abstract, from the closed IR alone, as the abstract build stamps
//! it. A node per port of every live element, and per value the stamping
//! makes beside them (an interface's stand-in, a whole pick's, a reference
//! leaf inside math, a choose over a dynamic index); an edge per read, with
//! the label of the reference that made it, one coordinate per level of
//! nesting of its target. An edge with no label of its own keeps the
//! levels its two ends share and resets the rest.
//!
//! One iteration of each repeat stands for every iteration, every option
//! of a select and every case of a conditional content is stamped, and an
//! index lands in the one iteration it reads, as in the abstract view
//! (`build/view.rs`). A construct the stamping cannot make yet is a
//! [`Gap`]: the graph leaves out the reads it would make, and says so.
//!
//! Nothing reads the graph yet; `build/coverage.rs` tests it against the
//! abstract build's.

// Read only by the tests until the check reads it (ADR 0032, step 8, part 3).
#![cfg_attr(not(feature = "testing"), allow(dead_code))]

use std::collections::{BTreeSet, HashMap};

use super::*;
use crate::components::{Collection, PropAt, PropSel};

mod aggregate;
mod walk;

crate::index::index_type! {
    /// A node of the template graph: a position in its `nodes`.
    pub(crate) struct GraphNode;
}

/// How a reference moves one coordinate of the iteration position: the
/// referencing element's own position in that coordinate plus a shift, or
/// a position chosen independently of it (a literal index, a branch).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) enum Coord {
    Keep(i64),
    Reset,
}

/// A reference's label: one `Coord` per level of nesting of its target,
/// what the read from its reader carries. The identity when every
/// coordinate is `Keep(0)`; in a build whose view does not fold
/// iterations, empty.
pub(crate) type Label = Vec<Coord>;

/// The coordinate an index step contributes: a shift of the referencing
/// element's position at the entered level when the index is that level's
/// own iteration index plus a literal, else a reset (a cell may name any
/// item).
pub(crate) fn index_coord(ip: &IndexPlan, src_depth: u32, entered: u32) -> Coord {
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
            IndexTerm::Cell(_) => same_level = false,
        }
    }
    if iters == 1 && same_level {
        Coord::Keep(shift)
    } else {
        Coord::Reset
    }
}

/// A construct the template graph cannot stamp yet: the reads it would
/// make are left out.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Gap {
    /// An aggregate over what a collect or polyline gathers: its count.
    Aggregate,
    /// An index into what a collect or polyline gathers.
    Gathered,
    /// An index into a point list's points.
    ListPoints,
    /// A copy of a type with a list, whose ports are as many as its
    /// referent has.
    ListCopy,
    /// An element `fixed` holds, whose aliases of another element become
    /// cells of its own.
    Hold,
    /// A `$ref` child among the components of an iteration or an option,
    /// which a whole reference to it would count.
    RefChild,
}

/// What a node of the template graph is.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum NodeKind {
    /// Port `port` of element `elem` of the node's template.
    Port { elem: ElemId, port: u32 },
    /// Port `port` of a stand-in (`TemplateGraph::stand_ins`).
    StandIn { stand_in: u32, port: u32 },
    /// A value the stamping makes for a read: a leaf inside math, a choose.
    Read,
}

/// A node: what it is, and the template it is stamped in, whose depth is
/// its depth.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Node {
    pub(crate) template: TemplateId,
    pub(crate) kind: NodeKind,
}

/// A component the stamping makes that no template element is: what reads
/// an interface name of a choice in every branch, or a whole pick of a
/// select in every option.
#[derive(Debug, Clone)]
pub(crate) struct StandIn {
    pub(crate) component_type: ComponentType,
    pub(crate) template: TemplateId,
    pub(crate) base: GraphNode,
    pub(crate) n_public: usize,
    pub(crate) members: Vec<Comp>,
}

/// A component as the stamping knows it: an element of a template, or a
/// stand-in.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Comp {
    Elem(TemplateId, ElemId),
    StandIn(u32),
}

/// The template graph.
#[derive(Debug, Default)]
pub(crate) struct TemplateGraph {
    pub(crate) nodes: Vec<Node>,
    /// What each node reads.
    pub(crate) reads: Vec<Vec<GraphNode>>,
    /// The labels of reads that are not the identity, by (reader, read).
    pub(crate) labels: HashMap<(GraphNode, GraphNode), Vec<Coord>>,
    /// Each element's first port, per template; NONE for an element not
    /// stamped.
    pub(crate) ports: Vec<Vec<GraphNode>>,
    /// How many ports each element has, per template.
    pub(crate) n_ports: Vec<Vec<u32>>,
    pub(crate) stand_ins: Vec<StandIn>,
    /// Each template's parent template; None for the document's.
    pub(crate) parent: Vec<Option<TemplateId>>,
    /// Each template's depth: how many iterations and branches enclose it.
    pub(crate) depth: Vec<u32>,
    /// Whether each template is stamped.
    pub(crate) stamped: Vec<bool>,
    /// What the stamping left out.
    pub(crate) gaps: BTreeSet<Gap>,
}

impl TemplateGraph {
    /// The node of port `port` of element `e` of template `t`.
    pub(crate) fn port(&self, t: TemplateId, e: ElemId, port: usize) -> GraphNode {
        debug_assert!(port < self.n_ports[t.index()][e.index()] as usize);
        self.ports[t.index()][e.index()].offset(port)
    }

    /// The label of the read `u -> v`: its own, else the levels the two
    /// ends' templates share kept and the rest of `v`'s reset.
    pub(crate) fn label(&self, u: GraphNode, v: GraphNode) -> Vec<Coord> {
        if let Some(l) = self.labels.get(&(u, v)) {
            return l.clone();
        }
        let (mut a, mut b) = (
            self.nodes[u.index()].template,
            self.nodes[v.index()].template,
        );
        let dv = self.depth[b.index()];
        while self.depth[a.index()] > self.depth[b.index()] {
            a = self.parent[a.index()].expect("a deeper template has a parent");
        }
        while self.depth[b.index()] > self.depth[a.index()] {
            b = self.parent[b.index()].expect("a deeper template has a parent");
        }
        while a != b {
            a = self.parent[a.index()].expect("templates share the document");
            b = self.parent[b.index()].expect("templates share the document");
        }
        let shared = self.depth[a.index()] as usize;
        let mut label = vec![Coord::Keep(0); shared];
        label.resize(dv as usize, Coord::Reset);
        label
    }
}

/// The template graph of `c`.
pub(crate) fn template_graph(c: CompiledRef<'_>) -> TemplateGraph {
    let n = c.plans.templates.len();
    let mut parent = vec![None; n];
    let mut depth = vec![0u32; n];
    // A template's parent is made before it, so one pass in order settles
    // every depth; a second makes sure whatever the order.
    for _ in 0..2 {
        for (t, tpl) in c.plans.templates.iter().enumerate() {
            if let Some((pt, _)) = tpl.parent {
                parent[t] = Some(pt);
                depth[t] = depth[pt.index()] + 1;
            }
        }
    }
    let mut s = Stamp {
        c,
        g: TemplateGraph {
            ports: c
                .plans
                .templates
                .iter()
                .map(|t| vec![GraphNode::NONE; t.elems.len()])
                .collect(),
            n_ports: c
                .plans
                .templates
                .iter()
                .map(|t| vec![0; t.elems.len()])
                .collect(),
            parent,
            depth,
            stamped: vec![false; n],
            ..Default::default()
        },
        iface: HashMap::new(),
        picks: HashMap::new(),
        cases: HashMap::new(),
    };
    s.stamp(TemplateId::new(0));
    for t in TemplateId::below(n) {
        if s.g.stamped[t.index()] {
            s.sources(t);
        }
    }
    s.aggregates();
    s.g
}

/// The stamping's state.
pub(super) struct Stamp<'c> {
    pub(super) c: CompiledRef<'c>,
    pub(super) g: TemplateGraph,
    /// Each interface stand-in, by (choice, position among the names used).
    pub(super) iface: HashMap<(ChoiceId, usize), u32>,
    /// Each whole pick's stand-in, by select.
    pub(super) picks: HashMap<ChoiceId, u32>,
    /// Each case's `active`, by (template, conditional content, position).
    pub(super) cases: HashMap<(TemplateId, ElemId, usize), GraphNode>,
}

impl<'c> Stamp<'c> {
    /// A new node.
    pub(super) fn node(&mut self, template: TemplateId, kind: NodeKind) -> GraphNode {
        let n = GraphNode::from_index(self.g.nodes.len());
        self.g.nodes.push(Node { template, kind });
        self.g.reads.push(Vec::new());
        n
    }

    /// `u` reads `v`.
    pub(super) fn read(&mut self, u: GraphNode, v: GraphNode) {
        self.g.reads[u.index()].push(v);
    }

    /// `u` reads `v` with `label`, kept when it is not the identity.
    pub(super) fn read_as(&mut self, u: GraphNode, v: GraphNode, label: &[Coord]) {
        self.read(u, v);
        if label.iter().any(|&c| c != Coord::Keep(0)) {
            self.g.labels.insert((u, v), label.to_vec());
        }
    }

    /// Stamp template `t`'s live elements' ports, then the templates their
    /// bodies stamp, and each choice's interface stand-ins.
    fn stamp(&mut self, t: TemplateId) {
        self.g.stamped[t.index()] = true;
        let tpl = self.c.plans.templates[t.index()].view();
        for e in ElemId::below(tpl.elems.len()) {
            if tpl.is_dead(e) {
                continue;
            }
            let (row, plan) = (tpl.row(e), tpl.plan(e));
            let n = match plan.list {
                ListLen::AsReferent => {
                    self.g.gaps.insert(Gap::ListCopy);
                    0
                }
                _ => plan.props.len().max(row.component_type.prop_defs().len()),
            };
            let base = GraphNode::from_index(self.g.nodes.len());
            for port in 0..n {
                self.node(
                    t,
                    NodeKind::Port {
                        elem: e,
                        port: port as u32,
                    },
                );
            }
            self.g.ports[t.index()][e.index()] = base;
            self.g.n_ports[t.index()][e.index()] = n as u32;
        }
        for e in ElemId::below(tpl.elems.len()) {
            if tpl.is_dead(e) {
                continue;
            }
            match tpl.row(e).body {
                Body::Repeat { template } => self.stamp(template),
                Body::Choice(cid) => {
                    let def = &self.c.plans.choices[cid.index()];
                    for &b in &def.branches {
                        self.stamp(b);
                    }
                    self.interface(t, e, cid);
                }
                _ => {}
            }
        }
    }

    /// The stand-ins of choice `cid`, element `e` of template `t`: one per
    /// interface name a reference uses, reading that name's element in
    /// every branch, and for a conditional content its choice.
    fn interface(&mut self, t: TemplateId, e: ElemId, cid: ChoiceId) {
        let def = &self.c.plans.choices[cid.index()];
        for (u, name) in def.used.iter().enumerate() {
            let (component_type, elems) = &def.iface[name];
            let members: Vec<Comp> = def
                .branches
                .iter()
                .zip(elems)
                .filter(|&(&b, &m)| !self.c.plans.templates[b.index()].is_dead(m))
                .map(|(&b, &m)| Comp::Elem(b, m))
                .collect();
            let choice = def
                .reactive
                .then(|| self.g.port(t, e, prop::conditional_content::CHOICE));
            let w = self.stand_in(*component_type, t, members, choice);
            self.iface.insert((cid, u), w);
        }
    }

    /// A stand-in of `component_type` in template `t` for `members`, with
    /// as many ports as the most any of them has public; each port reads
    /// the members' port at its position (and `choice`).
    pub(super) fn stand_in(
        &mut self,
        component_type: ComponentType,
        t: TemplateId,
        members: Vec<Comp>,
        choice: Option<GraphNode>,
    ) -> u32 {
        let n = members
            .iter()
            .map(|&m| self.n_public(m))
            .max()
            .unwrap_or(component_type.prop_defs().len());
        let w = self.g.stand_ins.len() as u32;
        let base = GraphNode::from_index(self.g.nodes.len());
        for port in 0..n {
            let s = self.node(
                t,
                NodeKind::StandIn {
                    stand_in: w,
                    port: port as u32,
                },
            );
            if let Some(choice) = choice {
                self.read(s, choice);
            }
            for &m in &members {
                if port < self.n_public(m) {
                    let ms = self.slot(m, port);
                    self.read(s, ms);
                }
            }
        }
        self.g.stand_ins.push(StandIn {
            component_type,
            template: t,
            base,
            n_public: n,
            members,
        });
        w
    }

    /// The reads of every port of template `t`'s live elements.
    fn sources(&mut self, t: TemplateId) {
        let c = self.c;
        let tpl = c.plans.templates[t.index()].view();
        for e in ElemId::below(tpl.elems.len()) {
            if tpl.is_dead(e) || self.g.n_ports[t.index()][e.index()] == 0 {
                continue;
            }
            let plan = tpl.plan(e);
            if !matches!(plan.hold, Hold::Off) {
                self.g.gaps.insert(Gap::Hold);
                continue;
            }
            for (pi, src) in plan.props.iter().enumerate() {
                let from = self.g.port(t, e, pi);
                match src {
                    // A later source's reads are the port's too, made first.
                    Source::Specialize(_, first, rest) => {
                        self.source(t, e, pi, from, rest);
                        self.source(t, e, pi, from, first);
                    }
                    src => self.source(t, e, pi, from, src),
                }
            }
        }
    }

    /// The reads of `src`, port `pi` of element `e` of template `t`, as
    /// node `from`.
    fn source(&mut self, t: TemplateId, e: ElemId, pi: usize, from: GraphNode, src: &'c Source) {
        let c = self.c;
        let arena = &c.plans.arena;
        match src {
            Source::Leaf(_) => {}
            Source::Specialize(..) => unreachable!("a nested specialization"),
            Source::Flow(flow) => match flow {
                Flow::Alias(arg) => self.arg(t, e, from, *arg),
                Flow::Op(_, args) => {
                    for &a in args {
                        self.arg(t, e, from, a);
                    }
                }
                Flow::VecOut(head, _) => {
                    let h = self.g.port(t, e, head.index());
                    self.read(from, h);
                }
                Flow::Math(id) => {
                    if !matches!(arena.get(*id), Expr::Num(_)) && arena.is_numeric(*id) {
                        self.leaves(t, from, *id, false);
                    }
                }
                Flow::MathHandle(id, _) => {
                    if self.port_type(t, e, pi) == PortType::Math {
                        self.leaves(t, from, *id, true);
                    }
                }
                Flow::MathValue(id) => {
                    if self.is_symbolic(Comp::Elem(t, e)) {
                        let expr = self.g.port(t, e, prop::math::EXPR);
                        self.read(from, expr);
                    } else if !matches!(arena.get(*id), Expr::Num(_)) {
                        self.leaves(t, from, *id, false);
                    }
                }
                Flow::SymExpr(id, _) => self.leaves(t, from, *id, true),
                // Credit and numbers read the stamped tree, once every
                // port has its reads (`aggregates`).
                Flow::Aggregate(a) => match a.over {
                    Collection::ScoredItems | Collection::SectionsThrough => {}
                    _ => {
                        self.g.gaps.insert(Gap::Aggregate);
                    }
                },
            },
        }
    }

    /// The reads of the cell leaves of math text `id` read from template
    /// `t`: a leaf node per leaf, reading what the leaf names, or with
    /// `symbolic` the expression it stands for.
    fn leaves(&mut self, t: TemplateId, from: GraphNode, id: ExprId, symbolic: bool) {
        let mut leaves = Vec::new();
        self.c.plans.arena.cell_leaves(id, &mut leaves);
        for p in leaves {
            let (Some(target), label) = self.resolve_one(p, t) else {
                continue;
            };
            let target = if symbolic {
                self.math_target(target).unwrap_or(target)
            } else {
                target
            };
            let leaf = self.node(t, NodeKind::Read);
            self.read(from, leaf);
            self.read_as(leaf, target, &label);
        }
    }

    /// The reads of argument `arg` of element `e` of template `t`, as node
    /// `from`.
    fn arg(&mut self, t: TemplateId, e: ElemId, from: GraphNode, arg: Arg) {
        let (target, label) = match arg {
            Arg::Own(port) => (Some(self.g.port(t, e, port.index())), Label::new()),
            Arg::Elem(x, port) => (Some(self.g.port(t, x, port.index())), Label::new()),
            Arg::Const(_) => (None, Label::new()),
            Arg::Ref(p, Sel::Whole) => self.resolve_one(p, t),
            Arg::Ref(p, Sel::Coord(j)) => {
                let (nodes, label) = self.resolve_ref(p, t, Some(2));
                (nodes.get(j as usize).copied().flatten(), label)
            }
            Arg::Ref(p, Sel::Item(i, j)) => {
                let (items, label) = self.resolve_items(p, t);
                let node = items.get(i as usize).and_then(|item| item[j as usize]);
                (node, label)
            }
            Arg::Ref(p, Sel::Port(k)) => {
                let (at, _, label) = self.resolve(p, t);
                let node = self.single_component(at).map(|c| self.slot(c, k as usize));
                (node, label)
            }
        };
        if let Some(target) = target {
            self.read_as(from, target, &label);
        }
    }

    // ---- components ---------------------------------------------------------

    /// The type of component `c`.
    pub(super) fn component_type(&self, c: Comp) -> ComponentType {
        match c {
            Comp::Elem(t, e) => self.c.plans.templates[t.index()].row(e).component_type,
            Comp::StandIn(w) => self.g.stand_ins[w as usize].component_type,
        }
    }

    /// How many public ports component `c` has.
    pub(super) fn n_public(&self, c: Comp) -> usize {
        match c {
            Comp::Elem(t, e) => {
                let tpl = &self.c.plans.templates[t.index()];
                let ty = tpl.row(e).component_type;
                tpl.plan(e)
                    .n_public(ty)
                    .unwrap_or_else(|| ty.prop_defs().len())
            }
            Comp::StandIn(w) => self.g.stand_ins[w as usize].n_public,
        }
    }

    /// The node of port `port` of component `c`.
    pub(super) fn slot(&self, c: Comp, port: usize) -> GraphNode {
        match c {
            Comp::Elem(t, e) => self.g.port(t, e, port),
            Comp::StandIn(w) => self.g.stand_ins[w as usize].base.offset(port),
        }
    }

    /// The template component `c` is stamped in.
    pub(super) fn template_of(&self, c: Comp) -> TemplateId {
        match c {
            Comp::Elem(t, _) => t,
            Comp::StandIn(w) => self.g.stand_ins[w as usize].template,
        }
    }

    /// The component and port of node `n`, when it is a component's.
    fn comp_of(&self, n: GraphNode) -> Option<(Comp, usize)> {
        let node = self.g.nodes[n.index()];
        match node.kind {
            NodeKind::Port { elem, port } => Some((Comp::Elem(node.template, elem), port as usize)),
            NodeKind::StandIn { stand_in, port } => Some((Comp::StandIn(stand_in), port as usize)),
            NodeKind::Read => None,
        }
    }

    /// The type of port `pi` of element `e` of template `t`, as the type
    /// pass settled it.
    fn port_type(&self, t: TemplateId, e: ElemId, pi: usize) -> PortType {
        let off = self.c.plans.templates[t.index()].sealed.elems[e.index()].slot_off;
        self.c.plans.port_type(t.index(), off.offset(pi))
    }

    /// What node `n` holds: its port's type; a stand-in's what its members
    /// hold at its position, a text or a math when one does.
    fn value_type(&self, n: GraphNode) -> PortType {
        match self.comp_of(n) {
            Some((Comp::Elem(t, e), pi)) => self.port_type(t, e, pi),
            Some((Comp::StandIn(w), pi)) => {
                let mut kind = PortType::Num;
                for &m in &self.g.stand_ins[w as usize].members {
                    if pi < self.n_public(m) {
                        match self.value_type(self.slot(m, pi)) {
                            PortType::Num => {}
                            k => kind = k,
                        }
                    }
                }
                kind
            }
            None => PortType::Num,
        }
    }

    /// Whether component `c`'s `expr` is a math cell.
    fn is_symbolic(&self, c: Comp) -> bool {
        match self.component_type(c).prop_index("expr") {
            Some(pi) if pi < self.n_public(c) => {
                self.value_type(self.slot(c, pi)) == PortType::Math
            }
            _ => false,
        }
    }

    /// When node `n` is a prop that stands for an expression (a symbolic
    /// math's `expr` or `value`, a function, a math answer's props), the
    /// node of that expression.
    fn math_target(&self, n: GraphNode) -> Option<GraphNode> {
        let (c, pi) = self.comp_of(n)?;
        let component_type = self.component_type(c);
        let name = component_type.prop_defs().get(pi)?.name;
        match (component_type, name) {
            (ComponentType::Answer, "response" | "correct" | "submitted") => {
                let submitted = self.slot(c, prop::answer::SUBMITTED);
                (self.value_type(submitted) == PortType::Math).then_some(n)
            }
            (ComponentType::Response, "submitted" | "value") => {
                let submitted = self.slot(c, prop::response::SUBMITTED);
                (self.value_type(submitted) == PortType::Math).then_some(submitted)
            }
            (
                ComponentType::Math
                | ComponentType::MathInput
                | ComponentType::Function
                | ComponentType::Derivative,
                "expr" | "value",
            ) => self
                .is_symbolic(c)
                .then(|| self.slot(c, component_type.prop_index("expr").unwrap())),
            _ => None,
        }
    }

    /// The slots of prop `sel` of component `c`, None for one that is
    /// missing (a point past the list's end); None as a whole for a table
    /// list, which names no slots.
    pub(super) fn sel_slots(&self, c: Comp, sel: PropSel) -> Option<Vec<Option<GraphNode>>> {
        let component_type = self.component_type(c);
        let at = match sel {
            PropSel::Parts { .. } => {
                return Some(
                    sel.parts()
                        .iter()
                        .map(|&i| Some(self.slot(c, i as usize)))
                        .collect(),
                );
            }
            PropSel::TableList => return None,
            PropSel::At(at) => at,
        };
        let n = self.n_public(c);
        let coord = |k: usize, j: usize| component_type.list_slot(n, k, j).map(|i| self.slot(c, i));
        Some(match at {
            PropAt::Position(i) => vec![Some(self.slot(c, i))],
            PropAt::Item(k) => vec![coord(k, 0), coord(k, 1)],
            PropAt::Coord(k, j) => vec![coord(k, j)],
            PropAt::List => (1..=component_type.list_len(n))
                .flat_map(|k| [coord(k, 0), coord(k, 1)])
                .collect(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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

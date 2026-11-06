//! The template graph (ADR 0032, step 8): every live template stamped once
//! in the abstract, from the closed IR alone, as the abstract build stamps
//! it. A node per port of every live element and of every component the
//! stamping makes beside them (an interface's stand-in, a whole pick's, a
//! case, a `$ref` child, a collect's copy, a point list's point), and per
//! value a read goes through (a leaf inside math, a choose over a dynamic
//! index, a gate); an edge per read, with the label of the reference that
//! made it, one coordinate per level of nesting of its target. An edge
//! with no label of its own keeps the levels its two ends share and resets
//! the rest.
//!
//! One iteration of each repeat stands for every iteration, every option
//! of a select and every case of a conditional content is stamped, and an
//! index lands in the one iteration it reads, as in the abstract view
//! (`build/view.rs`). The stamping runs in resolve's order
//! (`Builder::resolve_all`), since what a later step sees depends on what
//! an earlier one made: copies of a list type, `$ref` children with no
//! index, collects, point lists, indexed `$ref` children, the choices'
//! stand-ins, every port's reads, the aggregates, and last the holds.
//!
//! The compile runs the cycle and count checks over it (`cycles.rs`);
//! `build/coverage.rs` tests it against the abstract build's graph.

use std::collections::HashMap;

use super::*;
use crate::components::{Collection, PropAt, PropSel};

mod aggregate;
mod cycles;
mod expand;
mod walk;

pub(crate) use cycles::{CycleFindings, check_cycles};

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

/// What a node of the template graph is.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum NodeKind {
    /// Port `port` of element `elem` of the node's template.
    Port { elem: ElemId, port: u32 },
    /// Port `port` of a made component (`TemplateGraph::made`).
    Made { made: u32, port: u32 },
    /// A value a read goes through: a leaf inside math, a choose, a gate.
    Read,
}

/// A node: what it is, and the template it is stamped in, whose depth is
/// its depth.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Node {
    pub(crate) template: TemplateId,
    pub(crate) kind: NodeKind,
}

/// What a made component is, which says what its ports hold.
#[derive(Debug, Clone)]
pub(crate) enum MadeKind {
    /// What reads an interface name of a choice in every branch, or a
    /// whole pick of a select in every option: each port holds what any
    /// member holds at its position.
    StandIn { members: Vec<Comp> },
    /// A `$ref` child, a collect's copy of what it gathered, or a point
    /// list's point: each port holds what it aliases, if anything.
    Alias,
    /// One case of a conditional content: `active` while it is chosen.
    Case,
}

/// A component the stamping makes that no template element is.
#[derive(Debug, Clone)]
pub(crate) struct Made {
    pub(crate) component_type: ComponentType,
    pub(crate) template: TemplateId,
    pub(crate) base: GraphNode,
    pub(crate) n_public: usize,
    pub(crate) kind: MadeKind,
    /// Its children: a case's branch.
    pub(crate) children: Vec<Comp>,
}

/// A component as the stamping knows it: an element of a template, or a
/// made one.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) enum Comp {
    Elem(TemplateId, ElemId),
    Made(u32),
}

/// The template graph.
#[derive(Debug, Default)]
pub(crate) struct TemplateGraph {
    pub(crate) nodes: Vec<Node>,
    /// What each node reads.
    pub(crate) reads: Vec<Vec<GraphNode>>,
    /// The labels of reads that are not the identity, by (reader, read).
    pub(crate) labels: HashMap<(GraphNode, GraphNode), Label>,
    /// Each element's first port, per template; NONE for an element with
    /// no ports yet.
    pub(crate) ports: Vec<Vec<GraphNode>>,
    /// How many ports each element has, per template.
    pub(crate) n_ports: Vec<Vec<u32>>,
    pub(crate) made: Vec<Made>,
    /// Each template's parent template; None for the document's.
    pub(crate) parent: Vec<Option<TemplateId>>,
    /// Each template's depth: how many iterations and branches enclose it.
    pub(crate) depth: Vec<u32>,
    /// Whether each template is stamped.
    pub(crate) stamped: Vec<bool>,
    /// Every live repeat, each after the repeats its iterations stamp, as
    /// the abstract build lists them.
    pub(crate) repeats: Vec<(TemplateId, ElemId)>,
    /// Each copy of a list type that took its referent's ports, with how
    /// many are public.
    pub(crate) list_copies: HashMap<(TemplateId, ElemId), usize>,
}

impl TemplateGraph {
    /// The node of port `port` of element `e` of template `t`.
    pub(crate) fn port(&self, t: TemplateId, e: ElemId, port: usize) -> GraphNode {
        debug_assert!(port < self.n_ports[t.index()][e.index()] as usize);
        self.ports[t.index()][e.index()].offset(port)
    }

    /// The label of the read `u -> v`: its own, else the levels the two
    /// ends' templates share kept and the rest of `v`'s reset.
    pub(crate) fn label(&self, u: GraphNode, v: GraphNode) -> Label {
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
        ref_children: HashMap::new(),
        instances: Vec::new(),
        pending: Vec::new(),
        collects: Vec::new(),
        point_lists: Vec::new(),
        elem_children: HashMap::new(),
        collected: HashMap::new(),
        aliases: HashMap::new(),
    };
    s.stamp(TemplateId::new(0));
    s.resolve_all();
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
    /// Each conditional content's cases, by (template, element).
    pub(super) cases: HashMap<(TemplateId, ElemId), Vec<u32>>,
    /// Each `$ref` child's component, by (template, child).
    pub(super) ref_children: HashMap<(TemplateId, RefChildId), u32>,
    /// Every live element, in the order the abstract build stamps it.
    pub(super) instances: Vec<(TemplateId, ElemId)>,
    /// The `$ref` children to place, in the order made, each with whether
    /// its path carries an index.
    pub(super) pending: Vec<(TemplateId, RefChildId, bool)>,
    /// The collects and point lists to expand, in the order stamped.
    pub(super) collects: Vec<(TemplateId, ElemId)>,
    pub(super) point_lists: Vec<(TemplateId, ElemId)>,
    /// A collect's or point list's children, once expanded.
    pub(super) elem_children: HashMap<(TemplateId, ElemId), Vec<Comp>>,
    /// What each expanded collect gathered (its copies) and whether its
    /// count follows the counts of repeats.
    pub(super) collected: HashMap<(TemplateId, ElemId), (Vec<Comp>, bool)>,
    /// What each port whose source is an alias aliases, for the holds.
    pub(super) aliases: HashMap<GraphNode, GraphNode>,
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

    /// Ports for element `e` of template `t`: `n` new nodes.
    pub(super) fn element_ports(&mut self, t: TemplateId, e: ElemId, n: usize) {
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

    /// A made component of `component_type` in template `t` with `n`
    /// ports, each reading nothing yet.
    pub(super) fn make(
        &mut self,
        component_type: ComponentType,
        t: TemplateId,
        n: usize,
        kind: MadeKind,
    ) -> u32 {
        let m = self.g.made.len() as u32;
        let base = GraphNode::from_index(self.g.nodes.len());
        for port in 0..n {
            self.node(
                t,
                NodeKind::Made {
                    made: m,
                    port: port as u32,
                },
            );
        }
        self.g.made.push(Made {
            component_type,
            template: t,
            base,
            n_public: n,
            kind,
            children: Vec::new(),
        });
        m
    }

    /// Stamp template `t`: its live elements' ports, then per element the
    /// templates its body stamps, a choice's cases and stand-ins, and its
    /// `$ref` children; then the template's own `$ref` children.
    fn stamp(&mut self, t: TemplateId) {
        self.g.stamped[t.index()] = true;
        let c = self.c;
        let tpl = c.plans.templates[t.index()].view();
        for e in ElemId::below(tpl.elems.len()) {
            if tpl.is_dead(e) {
                continue;
            }
            let (row, plan) = (tpl.row(e), tpl.plan(e));
            // A copy of a type with a list takes its ports, as many as its
            // referent has, when its referent is known (`place_list_copies`).
            let n = match plan.list {
                ListLen::AsReferent => 0,
                _ => plan.props.len().max(row.component_type.prop_defs().len()),
            };
            self.element_ports(t, e, n);
            self.instances.push((t, e));
        }
        for e in ElemId::below(tpl.elems.len()) {
            if tpl.is_dead(e) {
                continue;
            }
            let row = tpl.row(e);
            match row.body {
                Body::Repeat { template } => {
                    self.stamp(template);
                    self.g.repeats.push((t, e));
                }
                Body::Choice(cid) => self.choice(t, e, cid),
                Body::Collect { .. } => self.collects.push((t, e)),
                _ if row.component_type == ComponentType::PointList => {
                    self.point_lists.push((t, e))
                }
                Body::Plain => self.ref_children_of(t, &row.children),
            }
        }
        self.ref_children_of(t, &tpl.children);
    }

    /// The `$ref` children among `children` of template `t`: each a
    /// component placed once its reference resolves, or a box.
    fn ref_children_of(&mut self, t: TemplateId, children: &[Child]) {
        for child in children {
            let Child::Macro(id) = child else { continue };
            let tpl = &self.c.plans.templates[t.index()];
            let has_index = tpl.ref_children[id.index()].has_index;
            let (component_type, placed) = match tpl.tables.ref_child_plans[id.index()] {
                // Of no type until it resolves; a document stands in.
                RefChildPlan::Ref(_) => (ComponentType::Document, false),
                RefChildPlan::Boxed | RefChildPlan::Unplanned => (ComponentType::Error, true),
            };
            let m = self.make(component_type, t, 0, MadeKind::Alias);
            self.ref_children.insert((t, *id), m);
            if !placed {
                self.pending.push((t, *id, has_index));
            }
        }
    }

    /// Choice `cid`, element `e` of template `t`: every branch stamped, a
    /// conditional content's cases, and a stand-in per interface name a
    /// reference uses, which reads that name's element in every branch
    /// once every port exists (`choice_sources`).
    fn choice(&mut self, t: TemplateId, e: ElemId, cid: ChoiceId) {
        let def = &self.c.plans.choices[cid.index()];
        let (reactive, branches) = (def.reactive, def.branches.clone());
        let mut cases = Vec::new();
        for b in branches {
            if reactive {
                let n = ComponentType::Case.prop_defs().len();
                let case = self.make(ComponentType::Case, t, n, MadeKind::Case);
                let active = self.slot(Comp::Made(case), prop::case::ACTIVE);
                let choice = self.g.port(t, e, prop::conditional_content::CHOICE);
                self.read(active, choice);
                cases.push(case);
                self.stamp(b);
                self.g.made[case as usize].children = self.root_children(b);
            } else {
                self.stamp(b);
            }
        }
        if reactive {
            self.cases.insert((t, e), cases);
        }
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
            let w = self.stand_in(*component_type, t, members);
            self.iface.insert((cid, u), w);
        }
    }

    /// A stand-in of `component_type` in template `t` for `members`, with
    /// as many ports as the most any of them has public, reading nothing
    /// yet.
    pub(super) fn stand_in(
        &mut self,
        component_type: ComponentType,
        t: TemplateId,
        members: Vec<Comp>,
    ) -> u32 {
        let n = members
            .iter()
            .map(|&m| self.n_public(m))
            .max()
            .unwrap_or(component_type.prop_defs().len());
        self.make(component_type, t, n, MadeKind::StandIn { members })
    }

    /// Stand-in `w` reads its members' port at each position, and
    /// `choice` when one is given.
    pub(super) fn stand_in_reads(&mut self, w: u32, choice: Option<GraphNode>) {
        let MadeKind::StandIn { members } = self.g.made[w as usize].kind.clone() else {
            unreachable!("a stand-in")
        };
        for port in 0..self.g.made[w as usize].n_public {
            let s = self.slot(Comp::Made(w), port);
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
    }

    /// Everything after stamping, in resolve's order.
    fn resolve_all(&mut self) {
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            self.place_list_copy(t, e, &mut Vec::new());
        }
        let pending = std::mem::take(&mut self.pending);
        for &(t, id, _) in pending.iter().filter(|p| !p.2) {
            self.place(t, id);
        }
        for i in 0..self.collects.len() {
            let (t, e) = self.collects[i];
            self.expand_collect(t, e);
        }
        for i in 0..self.point_lists.len() {
            let (t, e) = self.point_lists[i];
            self.expand_point_list(t, e);
        }
        for &(t, id, _) in pending.iter().filter(|p| p.2) {
            self.place(t, id);
        }
        self.choice_sources();
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            self.sources(t, e);
        }
        self.aggregates();
        self.holds();
    }

    /// The reads of the stand-ins of every choice: a conditional content's
    /// read its choice too.
    fn choice_sources(&mut self) {
        let mut stand_ins: Vec<_> = self.iface.iter().map(|(&k, &w)| (k, w)).collect();
        stand_ins.sort();
        for ((cid, _), w) in stand_ins {
            let def = &self.c.plans.choices[cid.index()];
            let (t, e) = def.at;
            let choice = def
                .reactive
                .then(|| self.g.port(t, e, prop::conditional_content::CHOICE));
            self.stand_in_reads(w, choice);
        }
    }

    /// The reads of every port of element `e` of template `t`; none for a
    /// copy of a list type that took its referent's.
    fn sources(&mut self, t: TemplateId, e: ElemId) {
        if self.g.list_copies.contains_key(&(t, e)) {
            return;
        }
        let c = self.c;
        let plan = c.plans.templates[t.index()].plan(e);
        for (pi, src) in plan.props.iter().enumerate() {
            let from = self.g.port(t, e, pi);
            match src {
                // A later source's reads are the port's too, made first;
                // its alias is not the port's.
                Source::Specialize(_, first, rest) => {
                    self.source(t, e, pi, from, rest);
                    self.aliases.remove(&from);
                    self.source(t, e, pi, from, first);
                }
                src => self.source(t, e, pi, from, src),
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
                Flow::Alias(arg) => {
                    if let Some(target) = self.arg(t, e, from, *arg) {
                        self.aliases.insert(from, target);
                    }
                }
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
                // A collect's count is its expansion's (`expand_collect`);
                // credit and numbers read the stamped tree once every port
                // has its reads (`aggregates`).
                Flow::Aggregate(_) => {}
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
    /// `from`; what it reads, if anything.
    fn arg(&mut self, t: TemplateId, e: ElemId, from: GraphNode, arg: Arg) -> Option<GraphNode> {
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
        target
    }

    // ---- components ---------------------------------------------------------

    /// The type of component `c`.
    pub(super) fn component_type(&self, c: Comp) -> ComponentType {
        match c {
            Comp::Elem(t, e) => self.c.plans.templates[t.index()].row(e).component_type,
            Comp::Made(m) => self.g.made[m as usize].component_type,
        }
    }

    /// How many public ports component `c` has.
    pub(super) fn n_public(&self, c: Comp) -> usize {
        match c {
            Comp::Elem(t, e) => {
                if let Some(&n) = self.g.list_copies.get(&(t, e)) {
                    return n;
                }
                let tpl = &self.c.plans.templates[t.index()];
                let ty = tpl.row(e).component_type;
                tpl.plan(e)
                    .n_public(ty)
                    .unwrap_or_else(|| ty.prop_defs().len())
            }
            Comp::Made(m) => self.g.made[m as usize].n_public,
        }
    }

    /// The node of port `port` of component `c`.
    pub(super) fn slot(&self, c: Comp, port: usize) -> GraphNode {
        match c {
            Comp::Elem(t, e) => self.g.port(t, e, port),
            Comp::Made(m) => {
                debug_assert!(port < self.g.made[m as usize].n_public);
                self.g.made[m as usize].base.offset(port)
            }
        }
    }

    /// The template component `c` is stamped in.
    pub(super) fn template_of(&self, c: Comp) -> TemplateId {
        match c {
            Comp::Elem(t, _) => t,
            Comp::Made(m) => self.g.made[m as usize].template,
        }
    }

    /// The component and port of node `n`, when it is a component's.
    pub(super) fn comp_of(&self, n: GraphNode) -> Option<(Comp, usize)> {
        let node = self.g.nodes[n.index()];
        match node.kind {
            NodeKind::Port { elem, port } => Some((Comp::Elem(node.template, elem), port as usize)),
            NodeKind::Made { made, port } => Some((Comp::Made(made), port as usize)),
            NodeKind::Read => None,
        }
    }

    /// The children of component `c` as the abstract build stamped them,
    /// at this point of the stamping: an iteration's, every option's, a
    /// conditional content's cases, a case's branch, a collect's copies or
    /// a point list's points once expanded, or an element's own.
    pub(super) fn children(&self, c: Comp) -> Vec<Comp> {
        let Comp::Elem(t, e) = c else {
            let Comp::Made(m) = c else { unreachable!() };
            return self.g.made[m as usize].children.clone();
        };
        let row = self.c.plans.templates[t.index()].row(e);
        match &row.body {
            Body::Repeat { template } => self.root_children(*template),
            Body::Choice(cid) => {
                let def = &self.c.plans.choices[cid.index()];
                if def.reactive {
                    self.cases[&(t, e)].iter().map(|&m| Comp::Made(m)).collect()
                } else {
                    def.branches
                        .iter()
                        .flat_map(|&b| self.root_children(b))
                        .collect()
                }
            }
            Body::Collect { .. } => self.elem_children.get(&(t, e)).cloned().unwrap_or_default(),
            _ if row.component_type == ComponentType::PointList => {
                self.elem_children.get(&(t, e)).cloned().unwrap_or_default()
            }
            Body::Plain => self.child_comps(t, &row.children),
        }
    }

    /// Template `t`'s own children: an iteration's, an option's, a case's.
    pub(super) fn root_children(&self, t: TemplateId) -> Vec<Comp> {
        self.child_comps(t, &self.c.plans.templates[t.index()].children)
    }

    /// The components among `children` of template `t`.
    fn child_comps(&self, t: TemplateId, children: &[Child]) -> Vec<Comp> {
        children
            .iter()
            .filter_map(|ch| match ch {
                Child::Elem(x) => Some(Comp::Elem(t, *x)),
                Child::Macro(id) => Some(Comp::Made(self.ref_children[&(t, *id)])),
                Child::Text(_) => None,
            })
            .collect()
    }

    /// The type of port `pi` of element `e` of template `t`, as the type
    /// pass settled it.
    pub(super) fn port_type(&self, t: TemplateId, e: ElemId, pi: usize) -> PortType {
        let off = self.c.plans.templates[t.index()].sealed.elems[e.index()].slot_off;
        self.c.plans.port_type(t.index(), off.offset(pi))
    }

    /// What node `n` holds: an element port's type, or past the ports its
    /// element reserves what it aliases; a stand-in's what its members
    /// hold at its position, a text or a math when one does; a made
    /// alias's what it aliases.
    pub(super) fn value_type(&self, n: GraphNode) -> PortType {
        self.value_type_within(n, 32)
    }

    fn value_type_within(&self, n: GraphNode, depth: u32) -> PortType {
        if depth == 0 {
            return PortType::Num;
        }
        let alias = |s: &Self| match s.g.reads[n.index()][..] {
            [one] => s.value_type_within(one, depth - 1),
            _ => PortType::Num,
        };
        match self.comp_of(n) {
            Some((Comp::Elem(t, e), pi)) => {
                let tpl = &self.c.plans.templates[t.index()];
                let reserved = tpl
                    .plan(e)
                    .props
                    .len()
                    .max(tpl.row(e).component_type.prop_defs().len());
                if pi < reserved {
                    self.port_type(t, e, pi)
                } else {
                    // A copy of a list type's point past the ports its
                    // element reserves: what it aliases.
                    alias(self)
                }
            }
            Some((Comp::Made(m), pi)) => match &self.g.made[m as usize].kind {
                MadeKind::StandIn { members } => {
                    let mut kind = PortType::Num;
                    for &member in members {
                        if pi < self.n_public(member) {
                            match self.value_type_within(self.slot(member, pi), depth - 1) {
                                PortType::Num => {}
                                k => kind = k,
                            }
                        }
                    }
                    kind
                }
                MadeKind::Alias => alias(self),
                MadeKind::Case => PortType::Num,
            },
            None => PortType::Num,
        }
    }

    /// Whether component `c`'s `expr` is a math cell.
    pub(super) fn is_symbolic(&self, c: Comp) -> bool {
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

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
//! The compile's check runs over it: the cycle and count checks
//! (`cycles.rs`), define and its walks (`define.rs`), and the refuse
//! warnings (`refuse.rs`); `build/coverage.rs` tests it against the
//! abstract build's graph, definitions, walks and warnings.

use super::share::FxMap;
use super::*;
use crate::components::{Collection, PropAt, PropSel};
use crate::program::{OpSpec, SymKind, VecOp};

mod aggregate;
mod cycles;
mod define;
mod expand;
mod math;
mod refuse;
mod signature;
mod walk;

pub(crate) use cycles::{CycleFindings, check_cycles};
pub(crate) use define::define;
pub(crate) use refuse::refuse_warnings;
pub(crate) use signature::sign;

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

/// An operator as the abstract build plans one: one the program runs, or
/// a symbolic template over its leaves.
#[derive(Debug, Clone, Copy, PartialEq)]
pub(crate) enum GraphOp {
    Spec(OpSpec),
    /// A symbolic template (`TemplateGraph::templates`).
    Template(u32),
}

/// A symbolic template as the abstract build plans one: math text `expr`
/// with `post` applied, its leaves its operator's inputs, in the text's
/// order, each a math leaf or a numeric one.
#[derive(Debug, Clone)]
pub(crate) struct TemplateOp {
    pub(crate) expr: ExprId,
    pub(crate) post: Post,
    pub(crate) math: Vec<bool>,
}

/// Where a math value a node holds comes from, which the compile has no
/// engine to make: a given tree, or a constant math text with its post.
#[derive(Debug, Clone)]
pub(crate) enum MathOrigin {
    Tree(Tree<RefId>),
    Constant(ExprId, Post),
}

/// What defines a node, as the abstract build's source defines its slot.
/// A value is kept where the compile knows it: a math handle's is the
/// engine's, which the compile has none of.
#[derive(Debug, Clone, PartialEq)]
pub(crate) enum Def {
    /// Not defined yet: only while stamping.
    Unset,
    /// A given value: essential when a student's action can write it, a
    /// constant otherwise.
    Given(Option<f64>),
    /// A constant.
    Const(Option<f64>),
    Alias(GraphNode),
    /// An operator over its inputs, in order; for a vector operator, its
    /// first output.
    Op(GraphOp, Vec<GraphNode>),
    /// Output `k` of the vector operator at the node.
    VecOut(GraphNode, u8),
}

impl Def {
    /// What the definition reads: an alias its target, an operator its
    /// inputs, a vector output its head.
    pub(crate) fn reads(&self) -> &[GraphNode] {
        match self {
            Def::Alias(t) | Def::VecOut(t, _) => std::slice::from_ref(t),
            Def::Op(_, inputs) => inputs,
            Def::Unset | Def::Given(_) | Def::Const(_) => &[],
        }
    }
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
    /// The component it belongs to without being its child: a stand-in's
    /// choice.
    pub(crate) owner: Option<Comp>,
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
    /// What defines each node.
    pub(crate) defs: Vec<Def>,
    /// What else defines a node in iterations after the first (a
    /// specialization's other source), which its reads include.
    pub(crate) later: Vec<(GraphNode, Def)>,
    /// What each node reads, its definition's reads and its later ones',
    /// one after another: node `n`'s from `read_start[n]` to
    /// `read_start[n + 1]`.
    read_start: Vec<u32>,
    read_list: Vec<GraphNode>,
    /// Each held node with a flag that holds it, once per flag.
    pub(crate) holds: Vec<(GraphNode, GraphNode)>,
    /// Each given math node seeded from another's value when first built
    /// (a prefill), with that node.
    pub(crate) seeds: Vec<(GraphNode, GraphNode)>,
    /// The binary operators lowered from the author's math, in the order
    /// lowered, which define orients.
    pub(crate) author_ops: Vec<GraphNode>,
    /// The counted values' nodes (ADR 0028), as the abstract build finds
    /// them; a node may be listed more than once.
    pub(crate) counted: Vec<GraphNode>,
    /// The nodes whose plan gives a document constant if they are one.
    pub(crate) document: Vec<GraphNode>,
    /// The symbolic templates, by `GraphOp::Template`.
    pub(crate) templates: Vec<TemplateOp>,
    /// The nodes whose cell is not a number, with what it holds, as the
    /// abstract build types its slots (`Builder::typed_slots`).
    pub(crate) typed: Vec<(GraphNode, crate::program::ValueType)>,
    /// Where each math value a definition holds comes from, by node.
    pub(crate) math: FxMap<GraphNode, MathOrigin>,
    /// The labels of reads that are not the identity, by (reader, read).
    pub(crate) labels: FxMap<(GraphNode, GraphNode), Label>,
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
    pub(crate) list_copies: FxMap<(TemplateId, ElemId), usize>,
    /// Every component the abstract build makes, in the order it makes
    /// them, so a component's position is its index in the abstract
    /// build's table: what define's walks and the refuse warnings read of
    /// it.
    pub(crate) comps: Vec<GraphComp>,
}

/// A component as define's walks read it: its type, its public ports, and
/// where it is placed.
#[derive(Debug, Clone, Copy)]
pub(crate) struct GraphComp {
    pub(crate) component_type: ComponentType,
    /// Its first port; its public ports follow.
    pub(crate) base: GraphNode,
    pub(crate) n_public: u32,
    /// All its ports, the hidden ones after the public.
    pub(crate) n_ports: u32,
    /// Whether a renderer shows it.
    pub(crate) rendered: bool,
    /// Whether it is under a sticky group, where snapping reads it.
    pub(crate) in_sticky: bool,
    /// Its parent's position in `comps`, when the stamping was asked for
    /// parents (`template_graph_with_parents`); `u32::MAX` for none.
    pub(crate) parent: u32,
    /// The element it is, if it is one.
    pub(crate) elem: Option<(TemplateId, ElemId)>,
}

impl TemplateGraph {
    /// What node `n` reads: its definition's reads and its later ones'.
    pub(crate) fn reads(&self, n: GraphNode) -> &[GraphNode] {
        let (a, b) = (self.read_start[n.index()], self.read_start[n.index() + 1]);
        &self.read_list[a as usize..b as usize]
    }

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
    stamp_graph(c, false)
}

/// The template graph of `c`, each component with its parent: what the
/// input signature reads.
pub(crate) fn template_graph_with_parents(c: CompiledRef<'_>) -> TemplateGraph {
    stamp_graph(c, true)
}

fn stamp_graph(c: CompiledRef<'_>, parents: bool) -> TemplateGraph {
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
        iface: FxMap::default(),
        picks: FxMap::default(),
        cases: FxMap::default(),
        ref_children: FxMap::default(),
        instances: Vec::new(),
        order: Vec::new(),
        pending: Vec::new(),
        collects: Vec::new(),
        point_lists: Vec::new(),
        elem_children: FxMap::default(),
        collected: FxMap::default(),
        consts: std::collections::HashMap::new(),
        missing: None,
        x: Arena::default(),
        instantiated: FxMap::default(),
        lowered: Vec::new(),
        share_math: false,
        origin: None,
        parents,
    };
    s.stamp(TemplateId::new(0));
    s.resolve_all();
    s.finish();
    s.g
}

/// The stamping's state.
pub(super) struct Stamp<'c> {
    pub(super) c: CompiledRef<'c>,
    pub(super) g: TemplateGraph,
    /// Each interface stand-in, by (choice, position among the names used).
    pub(super) iface: FxMap<(ChoiceId, usize), u32>,
    /// Each whole pick's stand-in, by select.
    pub(super) picks: FxMap<ChoiceId, u32>,
    /// Each conditional content's cases, by (template, element).
    pub(super) cases: FxMap<(TemplateId, ElemId), Vec<u32>>,
    /// Each `$ref` child's component, by (template, child).
    pub(super) ref_children: FxMap<(TemplateId, RefChildId), u32>,
    /// Every component, in the order the abstract build makes it.
    pub(super) order: Vec<Comp>,
    /// Every live element, in the order the abstract build stamps it.
    pub(super) instances: Vec<(TemplateId, ElemId)>,
    /// The `$ref` children to place, in the order made, each with whether
    /// its path carries an index.
    pub(super) pending: Vec<(TemplateId, RefChildId, bool)>,
    /// The collects and point lists to expand, in the order stamped.
    pub(super) collects: Vec<(TemplateId, ElemId)>,
    pub(super) point_lists: Vec<(TemplateId, ElemId)>,
    /// A collect's or point list's children, once expanded.
    pub(super) elem_children: FxMap<(TemplateId, ElemId), Vec<Comp>>,
    /// What each expanded collect gathered (its copies) and whether its
    /// count follows the counts of repeats.
    pub(super) collected: FxMap<(TemplateId, ElemId), (Vec<Comp>, bool)>,
    /// One node per constant an operator or a hold reads, by its bits:
    /// hashed in full, since a whole number's bits end in zeros, which a
    /// multiplying hash keeps.
    pub(super) consts: std::collections::HashMap<u64, GraphNode>,
    /// The one node holding the missing value.
    pub(super) missing: Option<GraphNode>,
    /// The math stamped, its leaves nodes (the build's arena).
    pub(super) x: Arena<GraphNode>,
    /// Each expression class instantiated, by template.
    pub(super) instantiated: FxMap<(ExprId, TemplateId), ExprId>,
    /// Each node of `x` lowered, to its node; NONE before it is.
    pub(super) lowered: Vec<GraphNode>,
    /// Whether the element whose ports are being stamped shares its math.
    pub(super) share_math: bool,
    /// Where the math value of the definition just made comes from, until
    /// the node it defines takes it.
    pub(super) origin: Option<MathOrigin>,
    /// Whether to record each component's parent.
    pub(super) parents: bool,
}

impl<'c> Stamp<'c> {
    /// A new node.
    pub(super) fn node(&mut self, template: TemplateId, kind: NodeKind) -> GraphNode {
        let n = GraphNode::from_index(self.g.nodes.len());
        self.g.nodes.push(Node { template, kind });
        self.g.defs.push(Def::Unset);
        n
    }

    /// Define node `n` as `def`.
    pub(super) fn set(&mut self, n: GraphNode, def: Def) {
        self.g.defs[n.index()] = def;
    }

    /// A node in template `t` defined as `def`, which no component holds.
    pub(super) fn value(&mut self, t: TemplateId, def: Def) -> GraphNode {
        let n = self.node(t, NodeKind::Read);
        self.set(n, def);
        n
    }

    /// A node in template `t` holding operator `spec` over `inputs`.
    pub(super) fn op(&mut self, t: TemplateId, spec: OpSpec, inputs: Vec<GraphNode>) -> GraphNode {
        self.value(t, Def::Op(GraphOp::Spec(spec), inputs))
    }

    /// The read `u -> v` carries `label` when that is not the identity.
    pub(super) fn label(&mut self, u: GraphNode, v: GraphNode, label: &[Coord]) {
        if label.iter().any(|&c| c != Coord::Keep(0)) {
            self.g.labels.insert((u, v), label.to_vec());
        }
    }

    /// The one node holding constant `v`, which operators and holds read.
    pub(super) fn constant(&mut self, v: f64) -> GraphNode {
        if let Some(&n) = self.consts.get(&v.to_bits()) {
            return n;
        }
        let n = self.value(TemplateId::new(0), Def::Const(Some(v)));
        self.consts.insert(v.to_bits(), n);
        n
    }

    /// The one node holding the missing value: what a reference with no
    /// referent names.
    pub(super) fn missing(&mut self) -> GraphNode {
        if let Some(n) = self.missing {
            return n;
        }
        let n = self.value(TemplateId::new(0), Def::Const(Some(f64::NAN)));
        self.missing = Some(n);
        n
    }

    /// `node`, or the missing value for none.
    pub(super) fn or_missing(&mut self, node: Option<GraphNode>) -> GraphNode {
        match node {
            Some(n) => n,
            None => self.missing(),
        }
    }

    /// What reads `inputs` in template `t` without its value mattering (a
    /// stand-in for every option, a count over its repeats' counts), as the
    /// abstract build reads them: one input through `Truthy`, more through
    /// a chain of `Max`.
    pub(super) fn reading(&mut self, inputs: &[GraphNode], t: TemplateId) -> Def {
        match inputs {
            [] => unreachable!("a stand-in reads something"),
            [x] => Def::Op(GraphOp::Spec(OpSpec::Truthy), vec![*x]),
            [rest @ .., last] => {
                let acc = rest[1..]
                    .iter()
                    .fold(rest[0], |acc, &x| self.op(t, OpSpec::Max, vec![acc, x]));
                Def::Op(GraphOp::Spec(OpSpec::Max), vec![acc, *last])
            }
        }
    }

    /// Every node's reads, from its definitions, once every node has them.
    fn finish(&mut self) {
        let g = &mut self.g;
        let mut later: FxMap<GraphNode, Vec<usize>> = FxMap::default();
        for (i, (n, _)) in g.later.iter().enumerate() {
            later.entry(*n).or_default().push(i);
        }
        let mut start = Vec::with_capacity(g.defs.len() + 1);
        let mut list = Vec::with_capacity(g.defs.len() * 2);
        for (n, def) in g.defs.iter().enumerate() {
            start.push(list.len() as u32);
            list.extend_from_slice(def.reads());
            for &i in later.get(&GraphNode::from_index(n)).into_iter().flatten() {
                list.extend_from_slice(g.later[i].1.reads());
            }
        }
        start.push(list.len() as u32);
        g.read_start = start;
        g.read_list = list;
        self.place_comps();
    }

    /// Every component, with where it is placed: rendered when the walk
    /// from the document root reaches it through what renders (a graph's
    /// parts only inside a graph), and under a sticky group or not, as
    /// `ComponentTable::placement` finds them.
    fn place_comps(&mut self) {
        use crate::components::Renders;
        let mut placed: FxMap<Comp, (bool, bool)> = FxMap::default();
        let root = self.root_children(TemplateId::new(0))[0];
        let mut stack = vec![(root, false, false)];
        while let Some((c, in_graph, sticky)) = stack.pop() {
            let ty = self.component_type(c);
            match ty.renders() {
                Renders::Never => continue,
                Renders::InGraph if !in_graph => continue,
                _ => {}
            }
            placed.insert(c, (true, sticky));
            let in_graph = in_graph || ty == ComponentType::Graph;
            let sticky = sticky || ty == ComponentType::StickyGroup;
            for k in self.children(c) {
                stack.push((k, in_graph, sticky));
            }
        }
        let order = std::mem::take(&mut self.order);
        let mut parent: FxMap<Comp, u32> = FxMap::default();
        if self.parents {
            let at: FxMap<Comp, u32> = order
                .iter()
                .enumerate()
                .map(|(i, &c)| (c, i as u32))
                .collect();
            for &c in &order {
                for k in self.children(c) {
                    parent.insert(k, at[&c]);
                }
                if let Comp::Made(m) = c
                    && let Some(owner) = self.g.made[m as usize].owner
                {
                    parent.insert(c, at[&owner]);
                }
            }
        }
        let comps = order
            .into_iter()
            .map(|c| {
                let (rendered, in_sticky) = placed.get(&c).copied().unwrap_or_default();
                let n_public = self.n_public(c);
                GraphComp {
                    component_type: self.component_type(c),
                    base: if n_public == 0 {
                        GraphNode::NONE
                    } else {
                        self.slot(c, 0)
                    },
                    n_public: n_public as u32,
                    n_ports: match c {
                        Comp::Elem(t, e) => self.g.n_ports[t.index()][e.index()],
                        Comp::Made(_) => n_public as u32,
                    },
                    rendered,
                    in_sticky,
                    parent: parent.get(&c).copied().unwrap_or(u32::MAX),
                    elem: match c {
                        Comp::Elem(t, e) => Some((t, e)),
                        Comp::Made(_) => None,
                    },
                }
            })
            .collect();
        self.g.comps = comps;
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
        self.order.push(Comp::Made(m));
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
            owner: None,
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
            self.order.push(Comp::Elem(t, e));
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
                // `active`: whether the choice is this case's position.
                let active = self.slot(Comp::Made(case), prop::case::ACTIVE);
                let choice = self.g.port(t, e, prop::conditional_content::CHOICE);
                let pos = self.constant((cases.len() + 1) as f64);
                self.set(
                    active,
                    Def::Op(GraphOp::Spec(OpSpec::Eq), vec![choice, pos]),
                );
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
            let w = self.stand_in(*component_type, t, members, Comp::Elem(t, e));
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
        owner: Comp,
    ) -> u32 {
        let n = members
            .iter()
            .map(|&m| self.n_public(m))
            .max()
            .unwrap_or(component_type.prop_defs().len());
        let w = self.make(component_type, t, n, MadeKind::StandIn { members });
        self.g.made[w as usize].owner = Some(owner);
        w
    }

    /// The sources of stand-in `w`: each port chooses among its members'
    /// port at its position (the missing value past a member's end) by
    /// `choice`, a conditional content's, or with none only reads them
    /// (a select built with every option).
    pub(super) fn stand_in_sources(&mut self, w: u32, choice: Option<GraphNode>) {
        let MadeKind::StandIn { members } = self.g.made[w as usize].kind.clone() else {
            unreachable!("a stand-in")
        };
        let t = self.g.made[w as usize].template;
        for port in 0..self.g.made[w as usize].n_public {
            let branch: Vec<GraphNode> = members
                .iter()
                .map(|&m| {
                    if port < self.n_public(m) {
                        self.slot(m, port)
                    } else {
                        self.missing()
                    }
                })
                .collect();
            let first = branch[0];
            let def = match choice {
                None => self.reading(&branch, t),
                Some(choice) => {
                    let n = byte(members.len());
                    let inputs = std::iter::once(choice).chain(branch).collect();
                    Def::Op(GraphOp::Spec(OpSpec::Vec(VecOp::Choose { n })), inputs)
                }
            };
            // One kind of value in every branch, which the stand-in holds.
            if self.value_type(first) == PortType::Text {
                self.g
                    .typed
                    .push((self.slot(Comp::Made(w), port), PortType::Text.value_type()));
            }
            let s = self.slot(Comp::Made(w), port);
            self.set(s, def);
        }
        let ty = self.g.made[w as usize].component_type;
        if members.iter().any(|&m| self.is_symbolic(m))
            && let Some(pi) = ty.prop_index("expr")
        {
            let s = self.slot(Comp::Made(w), pi);
            self.g.typed.push((s, PortType::Math.value_type()));
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

    /// The sources of the stand-ins of every choice: a conditional
    /// content's choose by its choice.
    fn choice_sources(&mut self) {
        let mut stand_ins: Vec<_> = self.iface.iter().map(|(&k, &w)| (k, w)).collect();
        stand_ins.sort();
        for ((cid, _), w) in stand_ins {
            let def = &self.c.plans.choices[cid.index()];
            let (t, e) = def.at;
            let choice = def
                .reactive
                .then(|| self.g.port(t, e, prop::conditional_content::CHOICE));
            self.stand_in_sources(w, choice);
        }
    }

    /// The sources of every port of element `e` of template `t`; none for
    /// a copy of a list type that took its referent's, and none yet for an
    /// aggregate, which is wired once the tree is (`aggregates`).
    fn sources(&mut self, t: TemplateId, e: ElemId) {
        if self.g.list_copies.contains_key(&(t, e)) {
            return;
        }
        let c = self.c;
        let plan = c.plans.templates[t.index()].plan(e);
        self.share_math = !c.plans.expr_class.is_empty() && matches!(plan.hold, Hold::Off);
        for (pi, src) in plan.props.iter().enumerate() {
            let from = self.g.port(t, e, pi);
            // What the cell holds is the port's type (ADR 0032).
            let port_type = self.port_type(t, e, pi);
            if port_type != PortType::Num {
                self.g.typed.push((from, port_type.value_type()));
            }
            let def = match src {
                Source::Flow(Flow::Aggregate(_)) => continue,
                // The first iteration's source, and the rest's as a later
                // one, made first.
                Source::Specialize(_, first, rest) => {
                    let rest = self.source(t, e, pi, from, rest);
                    self.origin = None;
                    self.g.later.push((from, rest));
                    self.source(t, e, pi, from, first)
                }
                src => self.source(t, e, pi, from, src),
            };
            if let Some(origin) = self.origin.take() {
                self.g.math.insert(from, origin);
            }
            if matches!(def, Def::Const(_) | Def::Given(_)) && src.gives_document_constant() {
                self.g.document.push(from);
            }
            self.set(from, def);
        }
    }

    /// The definition `src` gives port `pi` of element `e` of template `t`,
    /// node `from`.
    fn source(
        &mut self,
        t: TemplateId,
        e: ElemId,
        pi: usize,
        from: GraphNode,
        src: &'c Source,
    ) -> Def {
        match src {
            Source::Specialize(..) => unreachable!("a nested specialization"),
            Source::Leaf(leaf) => match leaf {
                Leaf::Given(v) => Def::Given(Some(*v)),
                Leaf::GivenText(id) => Def::Given(Some(id.map_or(f64::NAN, StrId::to_value))),
                // A handle, the engine's.
                Leaf::GivenMath(tree) => {
                    self.origin = tree.clone().map(MathOrigin::Tree);
                    Def::Given(tree.is_none().then_some(f64::NAN))
                }
                Leaf::Const(v) => Def::Const(Some(*v)),
                Leaf::Scope(ScopeConst::IterIndex) => Def::Const(Some(self.position(t) as f64)),
                Leaf::Scope(ScopeConst::SequencePick { from, step, count }) => {
                    let k = self.drawn(t, e, *count);
                    Def::Const(Some(from + step * k as f64))
                }
                Leaf::Scope(ScopeConst::Seed(p)) => {
                    let (target, _) = self.resolve_one(*p, t);
                    let target = self.or_missing(target);
                    self.g.seeds.push((from, target));
                    Def::Given(Some(f64::NAN))
                }
            },
            Source::Flow(flow) => match flow {
                Flow::Alias(arg) => Def::Alias(self.arg(t, e, from, *arg)),
                Flow::Op(spec, args) => {
                    let inputs = args.iter().map(|&a| self.arg(t, e, from, a)).collect();
                    Def::Op(GraphOp::Spec(*spec), inputs)
                }
                Flow::VecOut(head, k) => Def::VecOut(self.g.port(t, e, head.index()), *k),
                Flow::Math(id) => {
                    let id = self.instantiate(*id, t);
                    if let Expr::Num(v) = *self.x.get(id) {
                        // Its own cell: lowering gives a shared constant.
                        Def::Const(Some(v))
                    } else if self.x.is_numeric(id) {
                        Def::Alias(self.lower(id, t))
                    } else {
                        Def::Const(Some(f64::NAN))
                    }
                }
                Flow::MathHandle(id, post) => {
                    if self.port_type(t, e, pi) == PortType::Math {
                        self.sym_source(*id, *post, t)
                    } else {
                        // A numeric math is not a math cell (ADR 0005).
                        Def::Const(Some(f64::NAN))
                    }
                }
                Flow::MathValue(id) => {
                    if self.is_symbolic(Comp::Elem(t, e)) {
                        let expr = self.g.port(t, e, prop::math::EXPR);
                        Def::Op(GraphOp::Spec(OpSpec::Sym(SymKind::Evaluate)), vec![expr])
                    } else {
                        let id = self.instantiate(*id, t);
                        if let Expr::Num(v) = *self.x.get(id) {
                            Def::Given(Some(v))
                        } else {
                            Def::Alias(self.lower(id, t))
                        }
                    }
                }
                Flow::SymExpr(id, post) => self.sym_source(*id, *post, t),
                Flow::Aggregate(_) => unreachable!("an aggregate is wired from the tree"),
            },
        }
    }

    /// The node argument `arg` of element `e` of template `t` names, read
    /// as node `from`: a reference's read keeps its label; the missing
    /// value for a reference with no referent.
    fn arg(&mut self, t: TemplateId, e: ElemId, from: GraphNode, arg: Arg) -> GraphNode {
        let (target, label) = match arg {
            Arg::Own(port) => return self.g.port(t, e, port.index()),
            Arg::Elem(x, port) => return self.g.port(t, x, port.index()),
            Arg::Const(k) => return self.constant(k),
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
        let target = self.or_missing(target);
        self.label(from, target, &label);
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
        let alias = |s: &Self| match s.g.defs[n.index()] {
            Def::Alias(one) => s.value_type_within(one, depth - 1),
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

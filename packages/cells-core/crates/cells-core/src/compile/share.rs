//! Sharing, the compile's last stage before its check: two ports
//! that compute the same thing from the same cells become one, by an alias
//! in the plans.
//!
//! Per template, a union-find over the cells its ports will make: an
//! element's port, what a reference names, and a constant. Two derived
//! ports are equal when they apply the same operator to the same input
//! cells, are the same output of two equal vector heads, or are the same
//! math text made the same way; they are merged to a fixpoint. Two ports
//! merge only when their cells would carry the same request marks, port
//! types and hold. The kept port is the referent's where an extend's
//! matches one, else the lowest. A leaf, a scope specialization, an
//! aggregate and a copy are never merged.

use crate::compile::*;

/// A cell of a template, before any build makes it.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Node {
    /// Port `.1` of element `.0`.
    Local(u32, u8),
    /// What a reference names, by its plan's class.
    Ext(u32, SelKey),
    /// A literal an operator reads.
    Const(u64),
    /// An input this stage cannot name: equal to nothing else.
    Opaque(u32),
}

/// [`Sel`], hashable.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum SelKey {
    Whole,
    Coord(u8),
    Item(u8, u8),
    Port(u8),
}

impl From<Sel> for SelKey {
    fn from(sel: Sel) -> Self {
        match sel {
            Sel::Whole => SelKey::Whole,
            Sel::Coord(j) => SelKey::Coord(j),
            Sel::Item(i, j) => SelKey::Item(i, j),
            Sel::Port(k) => SelKey::Port(k),
        }
    }
}

/// What a derived port computes, up to what a bucket can hash.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum What {
    /// An operator of this kind ([`OpSpec`] has no hash; two in one bucket
    /// are compared whole).
    Op(std::mem::Discriminant<OpSpec>),
    VecOut(u8),
    Math(u32),
    MathHandle(u32, Post),
    MathValue(u32),
    SymExpr(u32, Post),
}

/// A derived port this stage may merge.
struct Candidate {
    node: Node,
    what: What,
    /// The operator, for [`What::Op`].
    spec: Option<OpSpec>,
    inputs: Vec<Node>,
    /// The element whose port it is (a local candidate), to rewrite.
    at: Option<(ElemId, Port)>,
    /// The hold of its element: two ports merge only under one hold.
    hold: HoldKey,
}

/// An element's hold, comparable: off, always, or while the flags of
/// these reference classes are set.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
enum HoldKey {
    Off,
    Always,
    While(Vec<u32>),
}

/// What a class of cells carries that a merge must not change, as bits:
/// request marks and port types.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Hash)]
struct Carried(u8);

impl Carried {
    const INTERACTIVE: u8 = 1;
    const ACTION: u8 = 2;
    const NUM: u8 = 4;
    const TEXT: u8 = 8;
    const MATH: u8 = 16;

    fn of_type(ty: PortType) -> u8 {
        match ty {
            PortType::Num => Self::NUM,
            PortType::Text => Self::TEXT,
            PortType::Math => Self::MATH,
        }
    }
}

/// Reference plans by class: two plans are one class when they walk the
/// same steps to the same port, so from one template they name the same
/// cell in every instance.
#[derive(Default)]
struct RefClasses<'c> {
    by_plan: FxMap<(u32, &'c [Step], Option<RefProp>), u32>,
    of: FxMap<RefId, u32>,
}

impl<'c> RefClasses<'c> {
    fn class(&mut self, refs: &'c [RefPlan], r: RefId) -> u32 {
        if let Some(&k) = self.of.get(&r) {
            return k;
        }
        let p = &refs[r.index()];
        let n = self.by_plan.len() as u32;
        let k = *self
            .by_plan
            .entry((p.hops, &p.steps[..], p.prop))
            .or_insert(n);
        self.of.insert(r, k);
        k
    }
}

/// The union-find over a template's nodes, by their numbers.
struct UnionFind(Vec<u32>);

impl UnionFind {
    fn find(&mut self, mut x: u32) -> u32 {
        while self.0[x as usize] != x {
            let p = self.0[x as usize];
            self.0[x as usize] = self.0[p as usize];
            x = p;
        }
        x
    }
    fn union(&mut self, a: u32, b: u32) -> u32 {
        let (ra, rb) = (self.find(a), self.find(b));
        if ra != rb {
            self.0[ra as usize] = rb;
        }
        rb
    }
}

/// A word-at-a-time hasher for the compile's small keys (the rotate and
/// multiply of rustc's `FxHasher`): this stage's and the template
/// graph's.
#[derive(Default)]
pub(crate) struct Fx(u64);

impl std::hash::Hasher for Fx {
    fn write(&mut self, bytes: &[u8]) {
        for chunk in bytes.chunks(8) {
            let mut w = [0u8; 8];
            w[..chunk.len()].copy_from_slice(chunk);
            self.write_u64(u64::from_le_bytes(w));
        }
    }
    fn write_u8(&mut self, n: u8) {
        self.write_u64(n as u64);
    }
    fn write_u32(&mut self, n: u32) {
        self.write_u64(n as u64);
    }
    fn write_usize(&mut self, n: usize) {
        self.write_u64(n as u64);
    }
    fn write_u64(&mut self, n: u64) {
        self.0 = (self.0.rotate_left(5) ^ n).wrapping_mul(0x51_7c_c1_b7_27_22_0a_95);
    }
    fn finish(&self) -> u64 {
        self.0
    }
}

pub(crate) type FxMap<K, V> = HashMap<K, V, std::hash::BuildHasherDefault<Fx>>;

/// One template's nodes, by number: an element's ports first, numbered
/// from its base, then every other node as it is met.
struct Nodes {
    /// Each element's first port's number, or `u32::MAX` for one that
    /// takes no part.
    base: Vec<u32>,
    ids: FxMap<Node, u32>,
    nodes: Vec<Node>,
    uf: UnionFind,
    opaque: u32,
}

impl Nodes {
    fn new(base: Vec<u32>, n_local: u32, locals: Vec<Node>) -> Self {
        Nodes {
            base,
            ids: FxMap::default(),
            nodes: locals,
            uf: UnionFind((0..n_local).collect()),
            opaque: 0,
        }
    }
    fn id(&mut self, n: Node) -> u32 {
        if let Node::Local(e, p) = n
            && let Some(&b) = self.base.get(e as usize)
            && b != u32::MAX
        {
            return b + p as u32;
        }
        if let Some(&i) = self.ids.get(&n) {
            return i;
        }
        let i = self.nodes.len() as u32;
        self.ids.insert(n, i);
        self.nodes.push(n);
        self.uf.0.push(i);
        i
    }
    fn opaque(&mut self) -> Node {
        self.opaque += 1;
        Node::Opaque(self.opaque)
    }
}

/// The compile's plans and its source, read while this stage decides, and
/// its classes of references and maths.
struct Share<'c> {
    c: &'c Plans,
    dast: &'c Dast,
    refs: RefClasses<'c>,
    /// Math classes: (expression class, symbolic text) per math text.
    math: HashMap<(u32, String), u32>,
}

impl Plans {
    /// Sharing: the expression classes, then every equal pair of derived
    /// ports made one, each but the kept one an alias, reading the maths'
    /// text from `dast`. Returns how many ports it made aliases.
    pub(in crate::compile) fn share(&mut self, dast: &Dast, paths: &[PathExtend]) -> usize {
        self.expr_class = crate::trace::span("expressions")
            .run(|| expr_classes(&self.arena, &self.refs, &mut RefClasses::default()));
        let mut s = Share {
            c: self,
            dast,
            refs: RefClasses::default(),
            math: HashMap::new(),
        };
        let mut rewrites: Vec<(TemplateId, ElemId, Port, Arg)> = Vec::new();
        let _s = crate::trace::span("ports");
        for t in TemplateId::below(s.c.templates.len()) {
            let here: Vec<PathExtend> = paths.iter().copied().filter(|p| p.t == t).collect();
            s.template(t, &here, &mut rewrites);
        }
        let n = rewrites.len();
        for (t, e, port, arg) in rewrites {
            self.templates[t.index()].tables.plans[e.index()].props[port.index()] =
                Source::alias(arg);
        }
        n
    }
}

impl Share<'_> {
    /// Whether element `e` of template `t` takes part: planned, not a box,
    /// and with a known number of public ports.
    fn takes_part(&self, t: TemplateId, e: ElemId) -> bool {
        let tpl = &self.c.templates[t.index()];
        !matches!(tpl.tables.boxes[e.index()], BoxState::Boxed { .. })
            && !tpl.tables.plans[e.index()].props.is_empty()
            && tpl.tables.plans[e.index()].list != ListLen::AsReferent
    }

    /// How many of element `e`'s ports are public props.
    fn n_public(&self, t: TemplateId, e: ElemId) -> usize {
        let tpl = &self.c.templates[t.index()];
        let ty = tpl.elems[e.index()].component_type;
        match tpl.tables.plans[e.index()].list {
            ListLen::Points(n) => ty.prop_defs().len() + 2 * n as usize,
            _ => ty.prop_defs().len(),
        }
    }

    /// What each port of element `e` carries by its declaration and its
    /// type, into `out` from position `at`.
    fn carried(&self, t: TemplateId, e: ElemId, out: &mut [Carried]) {
        let tpl = &self.c.templates[t.index()];
        let ty = tpl.elems[e.index()].component_type;
        let np = self.n_public(t, e);
        let off = tpl.sealed.elems[e.index()].slot_off.index();
        for (port, c) in out.iter_mut().enumerate() {
            let mut bits = 0;
            if port < np && ty.is_interactive_prop(np, port) {
                bits |= Carried::INTERACTIVE;
            }
            if port < np && ty.is_action_prop(port) {
                bits |= Carried::ACTION;
            }
            if let Some(&pt) = tpl.sealed.types.get(off + port) {
                bits |= Carried::of_type(pt);
            }
            *c = Carried(bits);
        }
    }

    fn hold(&mut self, t: TemplateId, e: ElemId) -> HoldKey {
        match &self.c.templates[t.index()].tables.plans[e.index()].hold {
            Hold::Off => HoldKey::Off,
            Hold::Always => HoldKey::Always,
            Hold::While(rs) => HoldKey::While(
                rs.iter()
                    .map(|&r| self.refs.class(&self.c.refs, r))
                    .collect(),
            ),
        }
    }

    /// The node an argument of element `e` of template `t` names.
    fn arg_node(&mut self, t: TemplateId, e: ElemId, arg: Arg) -> Node {
        match arg {
            Arg::Own(p) => Node::Local(e.get(), p.index() as u8),
            Arg::Elem(e2, p) => Node::Local(e2.get(), p.index() as u8),
            Arg::Const(v) => Node::Const(v.to_bits()),
            Arg::Ref(r, sel) => self
                .port_of_ref(t, r, sel)
                .unwrap_or_else(|| Node::Ext(self.refs.class(&self.c.refs, r), sel.into())),
        }
    }

    /// The port of an element of template `t` that reference `r` names
    /// with `sel`, when that is fixed: a path of one step to an element of
    /// the template, naming one of its ports, as the build resolves it.
    fn port_of_ref(&self, t: TemplateId, r: RefId, sel: Sel) -> Option<Node> {
        let plan = &self.c.refs[r.index()];
        let [Step::Elem(e)] = plan.steps[..] else {
            return None;
        };
        if plan.hops != 0 || !self.takes_part(t, e) {
            return None;
        }
        let tpl = &self.c.templates[t.index()];
        let n_ports = tpl.tables.plans[e.index()].props.len();
        let ty = tpl.elems[e.index()].component_type;
        let port = match (sel, plan.prop) {
            (Sel::Port(k), _) => k as usize,
            (Sel::Whole, Some(p)) if p.of == ty => match p.sel {
                PropSel::At(PropAt::Position(i)) => i,
                PropSel::Parts { len: 1, idx } => idx[0] as usize,
                _ => return None,
            },
            (Sel::Coord(j), Some(p)) if p.of == ty => match p.sel {
                PropSel::Parts { .. } => *p.sel.parts().get(j as usize)? as usize,
                _ => return None,
            },
            // Coordinate `j` of item `i` of a list: of the points the
            // element's list holds, or of its table's points.
            (Sel::Item(i, j), Some(p)) if p.of == ty => match p.sel {
                PropSel::At(PropAt::List) => match tpl.tables.plans[e.index()].list {
                    ListLen::Points(n) if (i as u32) < n => {
                        ty.list_slot(self.n_public(t, e), i as usize + 1, j as usize)?
                    }
                    _ => return None,
                },
                PropSel::TableList => {
                    ty.table_point_positions().get(i as usize)?[j as usize] as usize
                }
                _ => return None,
            },
            _ => return None,
        };
        (port < n_ports).then_some(Node::Local(e.get(), port as u8))
    }

    /// The class of symbolic math text `expr`: its expression's class and
    /// its symbolic text, each reference by its plan's class.
    fn math_class(&mut self, expr: ExprId) -> u32 {
        let class = self.c.expr_class[expr.index()].get();
        let sym = match self.c.sym_text.get(&expr) {
            None => String::new(),
            Some(SymText::Leaf(p)) => format!("\u{1}{}", self.refs.class(&self.c.refs, *p)),
            Some(SymText::Spelled(s)) => format!("\u{2}{s}"),
            Some(SymText::Nodes { nodes, plans }) => {
                let mut text = String::new();
                let mut plans = plans.iter();
                for &n in nodes.iter() {
                    match self.dast.kind(n) {
                        NodeKind::Text => text.push_str(self.dast.str(n)),
                        NodeKind::Macro => {
                            let p = *plans.next().expect("a plan per reference");
                            text.push('\u{0}');
                            text.push_str(&self.refs.class(&self.c.refs, p).to_string());
                            text.push('\u{0}');
                        }
                        _ => {}
                    }
                }
                text
            }
        };
        let n = self.math.len() as u32;
        *self.math.entry((class, sym)).or_insert(n)
    }

    /// A derived source as a candidate's operator and inputs, `own` naming
    /// the element's own port `p`; None for a source that never merges.
    /// Math is read only from the element's own template (`own_math`):
    /// its references resolve from there.
    fn derived(
        &mut self,
        source: &Source,
        own_math: bool,
        own: &mut dyn FnMut(&mut Self, Arg) -> Node,
    ) -> Option<(What, Option<OpSpec>, Vec<Node>)> {
        let Source::Flow(flow) = source else {
            return None;
        };
        Some(match flow {
            Flow::Op(OpSpec::Copy, _) => return None,
            Flow::Op(spec, args) => {
                let inputs = args.iter().map(|&a| own(self, a)).collect();
                (What::Op(std::mem::discriminant(spec)), Some(*spec), inputs)
            }
            Flow::VecOut(head, k) => (What::VecOut(*k), None, vec![own(self, Arg::Own(*head))]),
            // Lowered from its expression alone.
            Flow::Math(x) if own_math => {
                (What::Math(self.c.expr_class[x.index()].get()), None, vec![])
            }
            Flow::MathHandle(x, post) if own_math => {
                (What::MathHandle(self.math_class(*x), *post), None, vec![])
            }
            Flow::SymExpr(x, post) if own_math => {
                (What::SymExpr(self.math_class(*x), *post), None, vec![])
            }
            // A `<math>`'s value reads its own `expr`.
            Flow::MathValue(x) if own_math => {
                let expr = Port::table(prop::math::EXPR);
                (
                    What::MathValue(self.math_class(*x)),
                    None,
                    vec![own(self, Arg::Own(expr))],
                )
            }
            _ => return None,
        })
    }

    /// Decide template `t`: what of its ports become aliases, into
    /// `rewrites`.
    fn template(
        &mut self,
        t: TemplateId,
        paths: &[PathExtend],
        rewrites: &mut Vec<(TemplateId, ElemId, Port, Arg)>,
    ) {
        let n_elems = self.c.templates[t.index()].elems.len();
        let mut base = vec![u32::MAX; n_elems];
        let mut locals: Vec<Node> = Vec::new();
        for e in ElemId::below(n_elems) {
            if self.takes_part(t, e) {
                base[e.index()] = locals.len() as u32;
                let n_ports = self.c.templates[t.index()].tables.plans[e.index()]
                    .props
                    .len();
                locals.extend((0..n_ports).map(|k| Node::Local(e.get(), k as u8)));
            }
        }
        let n_local = locals.len() as u32;
        let mut nodes = Nodes::new(base, n_local, locals);
        // What each node carries by its declaration and type, by number.
        let mut carried: Vec<Carried> = vec![Carried::default(); n_local as usize];
        let mut cands: Vec<Candidate> = Vec::new();
        // The referents seen through a path: each of their ports is what
        // `Ref(path, Port(k))` names, and the reference that names it.
        let mut via: FxMap<Node, RefId> = FxMap::default();
        let mut seen_paths: HashSet<(RefId, TemplateId, ElemId)> = HashSet::new();
        for p in paths {
            if !self.takes_part(p.rt, p.re) || !seen_paths.insert((p.path, p.rt, p.re)) {
                continue;
            }
            let hold = self.hold(p.rt, p.re);
            // A hold by flags names them from the referent's template.
            if matches!(hold, HoldKey::While(_)) {
                continue;
            }
            let rc = self.refs.class(&self.c.refs, p.path);
            let at = |k: usize| Node::Ext(rc, SelKey::Port(k as u8));
            let props = &self.c.templates[p.rt.index()].tables.plans[p.re.index()].props;
            let mut bits = vec![Carried::default(); props.len()];
            self.carried(p.rt, p.re, &mut bits);
            for (k, source) in props.iter().enumerate() {
                let node = at(k);
                via.insert(node, p.path);
                let i = nodes.id(node) as usize;
                carried.resize(carried.len().max(i + 1), Carried::default());
                carried[i] = bits[k];
                let i = i as u32;
                match source {
                    Source::Flow(Flow::Alias(Arg::Own(z))) => {
                        let j = nodes.id(at(z.index()));
                        nodes.uf.union(i, j);
                    }
                    source => {
                        let mut opaque = |s: &mut Self, a: Arg| match a {
                            Arg::Own(z) => at(z.index()),
                            Arg::Const(v) => Node::Const(v.to_bits()),
                            _ => {
                                let _ = s;
                                Node::Opaque(u32::MAX - k as u32)
                            }
                        };
                        if let Some((what, spec, mut inputs)) =
                            self.derived(source, false, &mut opaque)
                        {
                            for x in &mut inputs {
                                if let Node::Opaque(_) = x {
                                    *x = nodes.opaque();
                                }
                            }
                            cands.push(Candidate {
                                node,
                                what,
                                spec,
                                inputs,
                                at: None,
                                hold: hold.clone(),
                            });
                        }
                    }
                }
            }
        }
        let n_virtual = cands.len();
        for e in ElemId::below(n_elems) {
            if !self.takes_part(t, e) {
                continue;
            }
            let hold = self.hold(t, e);
            let n_ports = self.c.templates[t.index()].tables.plans[e.index()]
                .props
                .len();
            let b = nodes.id(Node::Local(e.get(), 0)) as usize;
            self.carried(t, e, &mut carried[b..b + n_ports]);
            for k in 0..n_ports {
                let node = Node::Local(e.get(), k as u8);
                let i = nodes.id(node);
                let source = &self.c.templates[t.index()].tables.plans[e.index()].props[k];
                if let Source::Flow(Flow::Alias(arg)) = *source {
                    let target = self.arg_node(t, e, arg);
                    let j = nodes.id(target);
                    nodes.uf.union(i, j);
                    continue;
                }
                let mut own = |s: &mut Self, a: Arg| s.arg_node(t, e, a);
                if let Some((what, spec, inputs)) = self.derived(source, true, &mut own) {
                    cands.push(Candidate {
                        node,
                        what,
                        spec,
                        inputs,
                        at: Some((e, Port::table(k))),
                        hold: hold.clone(),
                    });
                }
            }
        }
        if cands.len() < 2 {
            return;
        }
        // Every node has its number now: the candidates' inputs are numbers.
        let inputs: Vec<Vec<u32>> = (cands.iter())
            .map(|c| c.inputs.iter().map(|&n| nodes.id(n)).collect())
            .collect();
        let cand_id: Vec<u32> = cands.iter().map(|c| nodes.id(c.node)).collect();
        carried.resize(nodes.nodes.len(), Carried::default());
        // Each class's carried bits, by its root after the aliases.
        let mut class: Vec<Carried> = vec![Carried::default(); carried.len()];
        for (i, &bits) in carried.iter().enumerate() {
            let r = nodes.uf.find(i as u32) as usize;
            class[r].0 |= bits.0;
        }
        // Each vector head's outputs: two heads merge only when their
        // outputs would.
        let mut outs: FxMap<u32, Vec<(u8, u32)>> = FxMap::default();
        for (ci, c) in cands.iter().enumerate() {
            if let What::VecOut(k) = c.what {
                outs.entry(inputs[ci][0])
                    .or_default()
                    .push((k, cand_id[ci]));
            }
        }
        // Each hold, by number.
        let mut holds: FxMap<HoldKey, u32> = FxMap::default();
        let hold_id: Vec<u32> = (cands.iter())
            .map(|c| {
                let n = holds.len() as u32;
                *holds.entry(c.hold.clone()).or_insert(n)
            })
            .collect();
        // Each class's defining candidate, by root.
        const NO: u32 = u32::MAX;
        let mut def: Vec<u32> = vec![NO; class.len()];
        for (ci, &id) in cand_id.iter().enumerate() {
            let r = nodes.uf.find(id) as usize;
            if def[r] == NO {
                def[r] = ci as u32;
            }
        }
        type Bucket = (What, Vec<u32>, Carried, u32, Vec<(u8, Carried)>);
        let mut buckets: FxMap<Bucket, Vec<u32>> = FxMap::default();
        loop {
            buckets.clear();
            let mut merged = false;
            for ci in 0..cands.len() {
                let r = nodes.uf.find(cand_id[ci]);
                if def[r as usize] != ci as u32 {
                    continue;
                }
                let ins: Vec<u32> = inputs[ci].iter().map(|&n| nodes.uf.find(n)).collect();
                let mut out_sig: Vec<(u8, Carried)> = (outs.get(&cand_id[ci]))
                    .into_iter()
                    .flatten()
                    .map(|&(k, o)| (k, class[nodes.uf.find(o) as usize]))
                    .collect();
                out_sig.sort_unstable_by_key(|o| o.0);
                let key = (cands[ci].what, ins, class[r as usize], hold_id[ci], out_sig);
                let members = buckets.entry(key).or_default();
                let found = members
                    .iter()
                    .copied()
                    .find(|&m| cands[m as usize].spec == cands[ci].spec);
                let Some(m) = found else {
                    members.push(ci as u32);
                    continue;
                };
                let rm = nodes.uf.find(cand_id[m as usize]);
                let bits = class[rm as usize];
                let nr = nodes.uf.union(r, rm) as usize;
                def[r as usize] = NO;
                def[rm as usize] = NO;
                def[nr] = m;
                class[nr] = bits;
                merged = true;
            }
            if !merged {
                break;
            }
        }
        // Every local candidate merged into another becomes an alias of
        // the one kept: a referent's port through its path, else another
        // port of the template.
        for (ci, c) in cands.iter().enumerate().skip(n_virtual) {
            let r = nodes.uf.find(cand_id[ci]) as usize;
            let kept = def[r] as usize;
            if kept == ci {
                continue;
            }
            let (e, port) = c.at.expect("a local candidate");
            let arg = match cands[kept].node {
                Node::Local(e2, q) if e2 == e.get() => Arg::Own(Port::table(q as usize)),
                Node::Local(e2, q) => Arg::Elem(ElemId::new(e2), Port::table(q as usize)),
                node @ Node::Ext(_, SelKey::Port(q)) => Arg::Ref(via[&node], Sel::Port(q)),
                _ => unreachable!("a kept candidate is a port"),
            };
            rewrites.push((t, e, port, arg));
        }
    }
}

/// Each node of the expression arena by its class of structurally equal
/// nodes: the first node of the class. A reference leaf is classed by its
/// plan's class, so two texts that read the same cells the same way are
/// one class wherever they are written.
fn expr_classes<'c>(
    arena: &Arena<RefId>,
    refs: &'c [RefPlan],
    classes: &mut RefClasses<'c>,
) -> Vec<ExprId> {
    #[derive(PartialEq, Eq, Hash)]
    enum K {
        Num(u64),
        Sym(String),
        Cell(u32),
        Bin(u8, u32, u32),
        Neg(u32),
        Call(u8, Vec<u32>),
    }
    let mut out: Vec<ExprId> = Vec::with_capacity(arena.nodes.len());
    let mut seen: HashMap<K, ExprId> = HashMap::new();
    for (i, e) in arena.nodes.iter().enumerate() {
        let id = ExprId::from_index(i);
        // Operands come before what reads them; one that does not is its
        // own class.
        let c = |x: &ExprId| -> Option<u32> { (x.index() < i).then(|| out[x.index()].get()) };
        let key = match e {
            Expr::Num(v) => Some(K::Num(v.to_bits())),
            Expr::Sym(s) => Some(K::Sym(s.clone())),
            Expr::Cell(r) => Some(K::Cell(classes.class(refs, *r))),
            Expr::Add(a, b) => c(a).zip(c(b)).map(|(a, b)| K::Bin(0, a, b)),
            Expr::Sub(a, b) => c(a).zip(c(b)).map(|(a, b)| K::Bin(1, a, b)),
            Expr::Mul(a, b) => c(a).zip(c(b)).map(|(a, b)| K::Bin(2, a, b)),
            Expr::Div(a, b) => c(a).zip(c(b)).map(|(a, b)| K::Bin(3, a, b)),
            Expr::Pow(a, b) => c(a).zip(c(b)).map(|(a, b)| K::Bin(4, a, b)),
            Expr::Neg(a) => c(a).map(K::Neg),
            Expr::Call(f, args) => args
                .iter()
                .map(c)
                .collect::<Option<Vec<u32>>>()
                .map(|xs| K::Call(*f as u8, xs)),
        };
        let class = match key {
            Some(k) => *seen.entry(k).or_insert(id),
            None => id,
        };
        out.push(class);
    }
    out
}

/// Equal computations share one cell, over the test-only components:
/// `<testShape>`'s `sum` adds its `a` and `b`, and `<testValue>`'s
/// `double` doubles its `value`.
#[cfg(test)]
mod tests {
    use crate::Document;
    use crate::compile::ir::{Arg, Flow, Source};
    use crate::testing::dast::{Element, document, el, mac};
    use crate::testing::request_prop;

    /// `testing::dast::load`, with sharing on or off.
    fn load<const N: usize>(nodes: [Element; N], share: bool) -> Document {
        let options = crate::LoadOptions {
            classify: false,
            prune: false,
            share,
            ..Default::default()
        };
        let dast = document(nodes);
        let doc = Document::load_dast(dast, options).unwrap().0;
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        doc
    }

    fn cell(doc: &Document, name: &str, prop: &str) -> crate::CellIdx {
        doc.cell(name, prop)
            .unwrap_or_else(|| panic!("no {name}.{prop}"))
    }

    /// A shape, and an extend of it giving `hide`, which its `sum` does
    /// not read: the extend's `sum` is the referent's cell, and one
    /// instruction computes it.
    fn shape_and_copy() -> [Element; 2] {
        [
            el("testShape").name("t").attr("a", "1").attr("b", "2"),
            el("testShape")
                .name("u")
                .attr("extend", mac("t"))
                .attr("hide", "true"),
        ]
    }

    /// The sharing is in the plans: the extend's `sum` is an alias of the
    /// referent's, which every build, and the template graph, reads.
    #[test]
    fn the_plans_alias_the_shared_port() {
        let compiled = crate::testing::compile(&document(shape_and_copy())).unwrap();
        let tpl = &compiled.plans.templates[0];
        let named = |name: &str| {
            (0..tpl.elems.len())
                .find(|&e| {
                    let n = tpl.elems[e].name;
                    n != crate::dast::StrId::NONE && compiled.dast.strings.get(n).trim() == name
                })
                .unwrap_or_else(|| panic!("no {name}"))
        };
        let (t, u) = (named("t"), named("u"));
        let sum = crate::components::test_only::test_shape::Props::PORTS.sum;
        assert!(
            matches!(
                tpl.tables.plans[t].props[sum.index()],
                Source::Flow(Flow::Op(..))
            ),
            "{:?}",
            tpl.tables.plans[t].props[sum.index()]
        );
        match &tpl.tables.plans[u].props[sum.index()] {
            Source::Flow(Flow::Alias(Arg::Elem(e, p))) => {
                assert_eq!((e.index(), *p), (t, sum));
            }
            other => panic!("u.sum is {other:?}"),
        }
    }

    #[test]
    fn an_extend_shares_what_it_does_not_change() {
        let doc = load(shape_and_copy(), true);
        // The leaves are shared by the compile (ADR 0032), the sum by emit.
        assert_eq!(cell(&doc, "u", "a"), cell(&doc, "t", "a"));
        assert_eq!(cell(&doc, "u", "sum"), cell(&doc, "t", "sum"));
        assert_ne!(cell(&doc, "u", "hide"), cell(&doc, "t", "hide"));
        assert_eq!(doc.value("u", "sum"), Some(3.0));
        let unshared = load(shape_and_copy(), false);
        assert_ne!(cell(&unshared, "u", "sum"), cell(&unshared, "t", "sum"));
        assert_eq!(doc.program.instrs.len() + 1, unshared.program.instrs.len());
        assert_eq!(doc.cells.len() + 1, unshared.cells.len());
    }

    /// Three merges, each over the cells the one before it merged, in one
    /// load: the fixpoint.
    #[test]
    fn a_chain_merges_in_one_load() {
        let nodes = || {
            [
                el("testShape").name("t").attr("a", "1").attr("b", "2"),
                el("testShape")
                    .name("u")
                    .attr("extend", mac("t"))
                    .attr("hide", "true"),
                el("testValue").name("x").attr("value", mac("t.sum")),
                el("testValue").name("y").attr("value", mac("u.sum")),
                el("testValue").name("x2").attr("value", mac("x.double")),
                el("testValue").name("y2").attr("value", mac("y.double")),
            ]
        };
        let doc = load(nodes(), true);
        for (a, b, prop) in [
            ("t", "u", "sum"),
            ("x", "y", "double"),
            ("x2", "y2", "double"),
        ] {
            assert_eq!(cell(&doc, a, prop), cell(&doc, b, prop), "{a}.{prop}");
        }
        assert_eq!(doc.value("y2", "double"), Some(12.0));
        let unshared = load(nodes(), false);
        assert_eq!(doc.program.instrs.len() + 3, unshared.program.instrs.len());
    }

    /// A `fixed` copy holds every cell of its own: its leaves are copies of
    /// the referent's, so its sum reads its own cells and stays its own.
    #[test]
    fn a_fixed_copy_does_not_merge() {
        let doc = load(
            [
                el("testShape").name("t").attr("a", "1").attr("b", "2"),
                el("testShape")
                    .name("u")
                    .attr("extend", mac("t"))
                    .attr("fixed", "true"),
            ],
            true,
        );
        assert_ne!(cell(&doc, "u", "sum"), cell(&doc, "t", "sum"));
        assert_eq!(doc.value("u", "sum"), Some(3.0));
    }

    /// Two equal copies merge only when the same flags hold them: two
    /// elements held alike that copy one cell share the copy and what they
    /// compute from it, and one held by another flag keeps its own.
    #[test]
    fn copies_merge_only_under_the_same_holds() {
        let doc = load(
            [
                el("testValue").name("t").attr("value", "3"),
                el("testValue").name("f").attr("value", "1"),
                el("testValue")
                    .name("x")
                    .attr("value", mac("t"))
                    .attr("fixed", "true"),
                el("testValue")
                    .name("y")
                    .attr("value", mac("t"))
                    .attr("fixed", "true"),
                el("testValue")
                    .name("z")
                    .attr("value", mac("t"))
                    .attr("fixed", mac("f")),
            ],
            true,
        );
        assert_ne!(cell(&doc, "x", "value"), cell(&doc, "t", "value"));
        assert_eq!(cell(&doc, "x", "value"), cell(&doc, "y", "value"));
        assert_eq!(cell(&doc, "x", "double"), cell(&doc, "y", "double"));
        assert_ne!(cell(&doc, "z", "value"), cell(&doc, "x", "value"));
        assert_ne!(cell(&doc, "z", "double"), cell(&doc, "x", "double"));
        assert_eq!(doc.value("z", "double"), Some(6.0));
    }

    /// A request on the extend's sum is a request on the shared cell, and
    /// writes the shared leaf, as one through the referent's would.
    #[test]
    fn a_request_through_a_shared_cell_writes_the_shared_leaf() {
        let mut shared = load(shape_and_copy(), true);
        let mut unshared = load(shape_and_copy(), false);
        for doc in [&mut shared, &mut unshared] {
            assert!(request_prop(doc, "u.sum", 10.0).dropped.is_empty());
        }
        for (name, prop) in [("t", "a"), ("t", "b"), ("t", "sum"), ("u", "sum")] {
            assert_eq!(
                shared.value(name, prop),
                unshared.value(name, prop),
                "{name}.{prop}"
            );
        }
        assert_eq!(shared.value("t", "sum"), Some(10.0));
    }
}

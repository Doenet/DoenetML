//! What the abstract build makes after it stamps the templates, before
//! any port has its reads (`Builder::resolve_all`): copies of a list type
//! take their referent's ports, `$ref` children are placed, collects
//! gather their copies and count them, and point lists get their points.
//! And last, the holds: a held element's alias of another element's port
//! becomes a cell of its own, shared by the elements held alike.

use super::walk::At;
use super::*;

/// A flag a hold reads, as the holds compare them: a literal `fixed`'s
/// constant, the missing value, or a node.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Flag {
    One,
    Missing,
    Node(GraphNode),
}

impl<'c> Stamp<'c> {
    /// Give a copy of a list type, element `e` of template `t`, its ports:
    /// as many as its referent has public, each reading the referent's
    /// with the extend's label, its referent placed first when it is such
    /// a copy too. With no referent (an index past the count), the plan's
    /// ports, read as the plan says.
    pub(super) fn place_list_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
        visiting: &mut Vec<(TemplateId, ElemId)>,
    ) {
        let plan = self.c.plans.templates[t.index()].plan(e);
        if plan.list != ListLen::AsReferent
            || self.g.n_ports[t.index()][e.index()] != 0
            || self.g.list_copies.contains_key(&(t, e))
            || visiting.contains(&(t, e))
        {
            return;
        }
        let referent = plan.extend.and_then(|p| {
            let (at, _, label) = self.resolve(p, t);
            match at {
                At::Missing => None,
                at => self.single_component(at).map(|c| (c, label)),
            }
        });
        let Some((referent, label)) = referent else {
            self.element_ports(t, e, plan.props.len());
            return;
        };
        if let Comp::Elem(rt, re) = referent {
            visiting.push((t, e));
            self.place_list_copy(rt, re, visiting);
            visiting.pop();
        }
        let n = self.n_public(referent);
        self.element_ports(t, e, n);
        self.g.list_copies.insert((t, e), n);
        for pi in 0..n {
            let (s, target) = (self.g.port(t, e, pi), self.slot(referent, pi));
            self.read_as(s, target, &label);
            self.aliases.insert(s, target);
        }
    }

    /// Place `$ref` child `id` of template `t`: the missing value is a
    /// number holding it; a prop is a number or a text aliasing it; a
    /// whole component is a copy aliasing its public ports, or for an
    /// input not read through an iteration the value type it reads as,
    /// each port aliasing the input's of that name.
    pub(super) fn place(&mut self, t: TemplateId, id: RefChildId) {
        let RefChildPlan::Ref(p) =
            self.c.plans.templates[t.index()].tables.ref_child_plans[id.index()]
        else {
            return;
        };
        let m = self.ref_children[&(t, id)];
        let (at, prop, label) = self.resolve(p, t);
        let through_iteration = matches!(at, At::Iter(_));
        match (at, prop) {
            (At::Missing, _) => self.place_as(m, ComponentType::Number, 1),
            (at, Some(prop)) => {
                let (targets, label) = self.targets_of(at, Some(prop), label, t, Some(1));
                let target = targets.first().copied().flatten();
                let is_text = target.is_some_and(|n| self.value_type(n) == PortType::Text);
                let component_type = if is_text {
                    ComponentType::Text
                } else {
                    ComponentType::Number
                };
                self.place_as(m, component_type, 1);
                if let Some(target) = target {
                    let s = self.slot(Comp::Made(m), 0);
                    self.read_as(s, target, &label);
                }
            }
            (at, None) => {
                let Some(referent) = self.single_component(at) else {
                    return;
                };
                let rt = self.component_type(referent);
                match (through_iteration, rt.reads_as()) {
                    (false, Some(as_type)) => {
                        let defs = as_type.prop_defs();
                        self.place_as(m, as_type, defs.len());
                        for (pi, def) in defs.iter().enumerate() {
                            if let Some(rp) = rt.prop_index(def.name)
                                && rp < self.n_public(referent)
                            {
                                let (s, target) =
                                    (self.slot(Comp::Made(m), pi), self.slot(referent, rp));
                                self.read_as(s, target, &label);
                            }
                        }
                    }
                    _ => {
                        let n = self.n_public(referent);
                        self.place_as(m, rt, n);
                        for pi in 0..n {
                            let (s, target) =
                                (self.slot(Comp::Made(m), pi), self.slot(referent, pi));
                            self.read_as(s, target, &label);
                        }
                    }
                }
            }
        }
    }

    /// Made component `m`, placed: of `component_type`, with `n` new
    /// ports.
    fn place_as(&mut self, m: u32, component_type: ComponentType, n: usize) {
        let t = self.g.made[m as usize].template;
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
        let made = &mut self.g.made[m as usize];
        made.component_type = component_type;
        made.base = base;
        made.n_public = n;
    }

    /// A copy of component `c` in template `t`: of its type, each public
    /// port aliasing `c`'s, unlabelled.
    fn copy_of(&mut self, c: Comp, t: TemplateId) -> Comp {
        let n = self.n_public(c);
        let m = self.make(self.component_type(c), t, n, MadeKind::Alias);
        for pi in 0..n {
            let (s, target) = (self.slot(Comp::Made(m), pi), self.slot(c, pi));
            self.read(s, target);
        }
        Comp::Made(m)
    }

    /// Expand collect (or polyline) `e` of template `t`: its children are
    /// copies of the components of its type under what it gathers from,
    /// and its count reads the counts of the repeats whose iterations
    /// hold one, when any does; then it follows their counts.
    pub(super) fn expand_collect(&mut self, t: TemplateId, e: ElemId) {
        let c = self.c;
        let tpl = c.plans.templates[t.index()].view();
        let Body::Collect { component_type } = tpl.row(e).body else {
            unreachable!("a collect")
        };
        let Some(from) = tpl.plan(e).from else {
            return;
        };
        let (at, _, _) = self.resolve(from, t);
        let mut found = Vec::new();
        match at {
            At::Comp(root) => self.descendants(root, component_type, &mut found),
            At::Iter(s) => {
                for root in self.root_children(s) {
                    if self.component_type(root) == component_type {
                        found.push(root);
                    } else {
                        self.descendants(root, component_type, &mut found);
                    }
                }
            }
            At::Missing | At::Chosen { .. } => {}
        }
        let copies: Vec<Comp> = found.iter().map(|&f| self.copy_of(f, t)).collect();
        self.elem_children.insert((t, e), copies.clone());
        // The count slots of the repeats whose iterations hold what it
        // gathered, innermost first, each once.
        let mut counts: Vec<GraphNode> = Vec::new();
        for &f in &found {
            for (rt, re) in self.enclosing_repeats(self.template_of(f)) {
                let ty = self.c.plans.templates[rt.index()].row(re).component_type;
                let pi = ty.count_prop().expect("a repeat has a count");
                let count = self.g.port(rt, re, pi);
                if !counts.contains(&count) {
                    counts.push(count);
                }
            }
        }
        let follows = !counts.is_empty();
        let count = self.g.port(t, e, prop::collect::COUNT);
        for n in counts {
            self.read(count, n);
        }
        self.collected.insert((t, e), (copies, follows));
    }

    /// The descendants of `c` of `component_type`, in document order, not
    /// entering a match.
    fn descendants(&self, c: Comp, component_type: ComponentType, out: &mut Vec<Comp>) {
        for k in self.children(c) {
            if self.component_type(k) == component_type {
                out.push(k);
            } else {
                self.descendants(k, component_type, out);
            }
        }
    }

    /// The repeats whose iterations enclose template `t`, innermost first.
    fn enclosing_repeats(&self, mut t: TemplateId) -> Vec<(TemplateId, ElemId)> {
        let mut out = Vec::new();
        while let Some((pt, pe)) = self.c.plans.templates[t.index()].parent {
            if matches!(
                self.c.plans.templates[pt.index()].row(pe).body,
                Body::Repeat { .. }
            ) {
                out.push((pt, pe));
            }
            t = pt;
        }
        out
    }

    /// Give point list `e` of template `t` its points: one made point per
    /// item of the list it extends, its coordinates reading the item's
    /// with the walk's label; or copies of the points of the point list
    /// it copies.
    pub(super) fn expand_point_list(&mut self, t: TemplateId, e: ElemId) {
        let plan = self.c.plans.templates[t.index()].plan(e);
        let mut kids = Vec::new();
        match (plan.from, plan.extend) {
            (Some(from), _) => {
                let (items, label) = self.resolve_items(from, t);
                for [x, y] in items {
                    let n = ComponentType::Point.prop_defs().len();
                    let pt = self.make(ComponentType::Point, t, n, MadeKind::Alias);
                    for (pi, coord) in [(prop::point::X, x), (prop::point::Y, y)] {
                        if let Some(coord) = coord {
                            let s = self.slot(Comp::Made(pt), pi);
                            self.read_as(s, coord, &label);
                        }
                    }
                    kids.push(Comp::Made(pt));
                }
            }
            (_, Some(p)) => {
                let (at, _, _) = self.resolve(p, t);
                let referent = match at {
                    At::Missing => None,
                    at => self.single_component(at),
                };
                if let Some(referent) = referent {
                    for orig in self.children(referent) {
                        kids.push(self.copy_of(orig, t));
                    }
                }
            }
            _ => {}
        }
        self.elem_children.insert((t, e), kids);
    }

    /// The holds: each held element reads its flags, and a port of one
    /// whose source aliases another element's port reads a cell of its
    /// own instead, the first such of its target and flags, which the
    /// others held alike read in turn. A port aliasing its own element, a
    /// value no component owns, or an element held by the same flags
    /// keeps its alias.
    pub(super) fn holds(&mut self) {
        let mut flags_of: HashMap<(TemplateId, ElemId), Vec<Flag>> = HashMap::new();
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            let flags = match &self.c.plans.templates[t.index()].plan(e).hold {
                Hold::Off => continue,
                Hold::Always => vec![Flag::One],
                Hold::While(refs) => refs
                    .iter()
                    .map(|&p| match self.resolve_one(p, t).0 {
                        Some(n) => Flag::Node(n),
                        None => Flag::Missing,
                    })
                    .collect(),
            };
            flags_of.insert((t, e), flags);
        }
        if flags_of.is_empty() {
            return;
        }
        // Every held port, in the order the abstract build numbers its
        // slots.
        let mut held: Vec<(GraphNode, (TemplateId, ElemId))> = Vec::new();
        for &(t, e) in flags_of.keys() {
            for pi in 0..self.g.n_ports[t.index()][e.index()] as usize {
                held.push((self.g.port(t, e, pi), (t, e)));
            }
        }
        held.sort();
        let own = |s: &Self, comp: (TemplateId, ElemId), target: GraphNode| match s.comp_of(target)
        {
            None => true,
            Some((Comp::Made(_), _)) => false,
            Some((Comp::Elem(ot, oe), _)) => {
                (ot, oe) == comp
                    || flags_of
                        .get(&(ot, oe))
                        .is_some_and(|f| Some(f) == flags_of.get(&comp))
            }
        };
        let mut copies: HashMap<(GraphNode, Vec<Flag>), GraphNode> = HashMap::new();
        for (s, comp) in held {
            let Some(&target) = self.aliases.get(&s) else {
                continue;
            };
            if own(self, comp, target) {
                continue;
            }
            let key = (target, flags_of[&comp].clone());
            match copies.get(&key) {
                // The cell another element held alike copies it to.
                Some(&first) => self.g.reads[s.index()] = vec![first],
                None => {
                    copies.insert(key, s);
                }
            }
        }
    }

    /// The position of the scope template `t` is stamped as, as the
    /// abstract build numbers it: 1 for its one iteration of a repeat, a
    /// case's position, an option's pick.
    pub(super) fn position(&self, t: TemplateId) -> i64 {
        let Some((pt, pe)) = self.c.plans.templates[t.index()].parent else {
            return 0;
        };
        match self.c.plans.templates[pt.index()].row(pe).body {
            Body::Choice(cid) => {
                let def = &self.c.plans.choices[cid.index()];
                let b = def
                    .branches
                    .iter()
                    .position(|&x| x == t)
                    .expect("a branch of its choice");
                if def.reactive {
                    b as i64 + 1
                } else {
                    crate::compile::keys::pick_position(b, 1) as i64
                }
            }
            _ => 1,
        }
    }
}

//! What the stamping makes after it stamps the templates, before
//! any port has its reads (`Builder::resolve_all`): copies of a list type
//! take their referent's ports, `$ref` children are placed, collects
//! gather their copies and count them, and point lists get their points.
//! And last, the holds: a held element's alias of another element's port
//! becomes a cell of its own, shared by the elements held alike.
//! Each makes the definitions of the nodes it makes.

use super::walk::At;
use super::*;
use crate::error::Error;

/// Stamping, after the templates: list copies, `$ref` children, collects and
/// point lists placed, and the holds, as a build does before resolving.
impl<'c> Stamp<'c> {
    /// Give a copy of a list type, element `e` of template `t`, its ports:
    /// as many as its referent has public, each reading the referent's
    /// with the extend's label, its referent placed first when it is such
    /// a copy too. With no referent (an index past the count), the plan's
    /// ports, read as the plan says; and so for the copy that closes a
    /// loop of copies, whose referent is still being placed and has no
    /// ports to read, after failing.
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
        {
            return;
        }
        let referent = plan.extend.and_then(|p| self.extend_referent(p, t, e));
        let Some((referent, label)) = referent else {
            self.element_ports(t, e, plan.props.len());
            return;
        };
        // The referent's own walk is not this one's.
        let need = self.need;
        if let Comp::Elem(rt, re) = referent {
            visiting.push((t, e));
            // A loop of copies, each placed before the one it copies: the
            // referent is one this walk is still placing, with no ports
            // yet.
            let on_loop = visiting.contains(&(rt, re));
            if !on_loop {
                self.place_list_copy(rt, re, visiting);
            }
            visiting.pop();
            if on_loop {
                self.fail(Error::Cycle(self.comp_label(referent)));
                self.element_ports(t, e, plan.props.len());
                return;
            }
        }
        self.need = need;
        let n = self.n_public(referent);
        self.element_ports(t, e, n);
        self.g.list_copies.insert((t, e), n);
        for pi in 0..n {
            let (s, target) = (self.g.port(t, e, pi), self.slot(referent, pi));
            self.set(s, Def::Alias(target));
            self.label(s, target, &label);
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
        self.context = self.c.plans.refs[p.index()].node;
        let (at, prop, label) = self.resolve(p, t);
        let through_iteration = matches!(at, At::Iter(_));
        match (at, prop) {
            (At::Missing, _) => {
                let ty = Role::Value.ty();
                self.place_as(m, ty, 1);
                let s = self.slot(Comp::Made(m), ty.scalar_prop().expect("a value"));
                let missing = self.missing();
                self.set(s, Def::Alias(missing));
            }
            (at, Some(prop)) => {
                let (targets, label) = self.port_targets(p, at, Some(prop), label, t, Some(1));
                let target = targets.first().copied().flatten();
                let is_text = target.is_some_and(|n| self.value_type(n) == PortType::Text);
                let component_type = if is_text {
                    Role::TextValue.ty()
                } else {
                    Role::Value.ty()
                };
                self.place_as(m, component_type, 1);
                let s = self.slot(
                    Comp::Made(m),
                    component_type.scalar_prop().expect("a value"),
                );
                let target = self.or_missing(target);
                self.set(s, Def::Alias(target));
                self.label(s, target, &label);
            }
            (at, None) => {
                let Some(referent) = self.single_component(at) else {
                    return;
                };
                let rt = self.component_type(referent);
                if rt.def().flags.not_extendable {
                    self.fail(Error::Banned(format!(
                        "copying a whole <{}>: reference its interface names instead",
                        rt.tag()
                    )));
                    return;
                }
                if !rt.copyable() {
                    self.fail(Error::UncopyableType(rt.tag().into()));
                    return;
                }
                match (through_iteration, rt.reads_as()) {
                    (false, Some(as_type)) => {
                        let defs = as_type.prop_defs();
                        self.place_as(m, as_type, defs.len());
                        for (pi, def) in defs.iter().enumerate() {
                            let s = self.slot(Comp::Made(m), pi);
                            match rt.prop_index(def.name) {
                                Some(rp) if rp < self.n_public(referent) => {
                                    let target = self.slot(referent, rp);
                                    self.set(s, Def::Alias(target));
                                    self.label(s, target, &label);
                                }
                                _ => {
                                    let missing = self.missing();
                                    self.set(s, Def::Alias(missing));
                                }
                            }
                        }
                    }
                    _ => {
                        let n = self.n_public(referent);
                        self.place_as(m, rt, n);
                        for pi in 0..n {
                            let (s, target) =
                                (self.slot(Comp::Made(m), pi), self.slot(referent, pi));
                            self.set(s, Def::Alias(target));
                            self.label(s, target, &label);
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
            self.set(s, Def::Alias(target));
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
            At::Missing => {}
            At::Chosen { .. } => self.fail(Error::Unsupported(
                "<collect from> cannot be indexed by a cell".into(),
            )),
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
        // With none, the number gathered is a constant at every count;
        // otherwise a counted value, which reads its repeats' counts.
        let follows = !counts.is_empty();
        let count = self
            .component_type(Comp::Elem(t, e))
            .aggregate_prop(AggOp::Count, Collection::Gathered)
            .expect("a collect counts what it gathers");
        let count = self.g.port(t, e, count);
        let def = if follows {
            self.g.counted.push(count);
            self.reading(&counts, t)
        } else {
            Def::Const(Some(copies.len() as f64))
        };
        self.set(count, def);
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
                    let n = Role::ListPoint.ty().prop_defs().len();
                    let pt = self.make(Role::ListPoint.ty(), t, n, MadeKind::Alias);
                    // Its coordinates, its default prop, alias the list's.
                    let ty = Role::ListPoint.ty();
                    let coords = ty.default_sel().expect("a list point's coordinates");
                    for (&pi, coord) in coords.parts().iter().zip([x, y]) {
                        let s = self.slot(Comp::Made(pt), usize::from(pi));
                        let coord = self.or_missing(coord);
                        self.set(s, Def::Alias(coord));
                        self.label(s, coord, &label);
                    }
                    // Not state: a made point has no essential key.
                    if let Some(hide) = ty.prop_index("hide") {
                        let hide = self.slot(Comp::Made(pt), hide);
                        self.set(hide, Def::Const(Some(0.0)));
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

    /// The holds: every port of a held element is held by its flags, and
    /// one whose source aliases another element's port is a copy of it
    /// instead, a cell of its own, the first such of its target and flags,
    /// which the others held alike alias in turn. A port aliasing its own
    /// element, a value no component holds, or an element held by the
    /// same flags keeps its alias; a later source's alias that would not
    /// is a copy.
    pub(super) fn holds(&mut self) {
        let mut flags_of: FxMap<(TemplateId, ElemId), Vec<GraphNode>> = FxMap::default();
        // The need of each flag's walk, by element, in its flags' order.
        let mut flag_needs: FxMap<(TemplateId, ElemId), Vec<Option<u32>>> = FxMap::default();
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            self.context = self.c.plans.templates[t.index()].row(e).node;
            let flags = match &self.c.plans.templates[t.index()].plan(e).hold {
                Hold::Off => continue,
                Hold::Always => vec![(self.constant(1.0), None)],
                Hold::While(refs) => refs
                    .iter()
                    .map(|&p| {
                        let (flags, _) = self.resolve_ref(p, t, Some(1));
                        let need = self.need;
                        if flags.len() != 1 {
                            self.fail(Error::ArityMismatch {
                                component_type: String::new(),
                                prop: String::new(),
                                expected: 1,
                                got: flags.len(),
                            });
                        }
                        let flag = flags.first().copied().flatten();
                        (self.or_missing(flag), need)
                    })
                    .collect(),
            };
            flag_needs.insert((t, e), flags.iter().map(|f| f.1).collect());
            flags_of.insert((t, e), flags.into_iter().map(|f| f.0).collect());
        }
        if flags_of.is_empty() {
            return;
        }
        // Every held port, in the order a build numbers their
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
        let copy = |target| Def::Op(GraphOp::Spec(OpSpec::Copy), vec![target]);
        let mut copies: FxMap<(GraphNode, Vec<GraphNode>), GraphNode> = FxMap::default();
        for (s, comp) in held {
            if let Def::Alias(target) = self.g.defs[s.index()]
                && !own(self, comp, target)
            {
                let key = (target, flags_of[&comp].clone());
                let def = match copies.get(&key) {
                    // The cell another element held alike copies it to.
                    Some(&first) => Def::Alias(first),
                    None => {
                        copies.insert(key, s);
                        copy(target)
                    }
                };
                self.set(s, def);
            }
            for (&f, &need) in flags_of[&comp].iter().zip(&flag_needs[&comp]) {
                self.g.holds.push((s, f));
                if let Some(k) = need {
                    self.g.read_needs.insert((s, f), k);
                }
            }
        }
        for i in 0..self.g.later.len() {
            let (s, Def::Alias(target)) = self.g.later[i] else {
                continue;
            };
            let Some((Comp::Elem(t, e), _)) = self.comp_of(s) else {
                continue;
            };
            if flags_of.contains_key(&(t, e)) && !own(self, (t, e), target) {
                self.g.later[i].1 = copy(target);
            }
        }
    }

    /// The position of the scope template `t` is stamped as, as the
    /// graph numbers it: 1 for its one iteration of a repeat, a
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

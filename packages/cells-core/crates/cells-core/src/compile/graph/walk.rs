//! A reference walked through the stamped templates, as a build resolves
//! it (`build/expand/resolve.rs`), but in the abstract: one iteration stands for
//! every index into a repeat, a select's every option is built, and the
//! walk is labelled, one coordinate per level of nesting of its target.

use super::*;

/// Where a walk stands.
#[derive(Debug, Clone)]
pub(super) enum At {
    Comp(Comp),
    /// A stamped template: an iteration of a repeat, an option of a
    /// select, or the template a walk starts in.
    Iter(TemplateId),
    /// Nothing: a box, what is under one, or what the stamping left out.
    Missing,
    /// `$r[$n]`: any of `items`, the one the cell `index` names, read
    /// with `label`.
    Chosen {
        index: Option<GraphNode>,
        label: Label,
        items: Vec<At>,
    },
}

impl<'c> Stamp<'c> {
    /// Walk plan `p` from template `t`: where it arrives, the port it
    /// names, and the walk's label.
    pub(super) fn resolve(&mut self, p: RefId, t: TemplateId) -> (At, Option<RefProp>, Label) {
        self.walking = p;
        let plan = &self.c.plans.refs[p.index()];
        let src_depth = self.g.depth[t.index()];
        let mut sc = t;
        for _ in 0..plan.hops {
            sc = self.g.parent[sc.index()].expect("a reference's hops stay in the document");
        }
        let mut label = vec![Coord::Keep(0); self.g.depth[sc.index()] as usize];
        let mut cur = At::Iter(sc);
        // This walk's need, apart from that of a walk of an index cell
        // inside it.
        let outer = std::mem::take(&mut self.walk_need);
        for (si, step) in plan.steps.iter().enumerate() {
            let to_iface = matches!(plan.steps.get(si + 1), Some(Step::Iface(..)));
            cur = self.step(cur, step, t, src_depth, to_iface, &mut label, true);
            // A walk of an index cell walked another plan.
            self.walking = p;
        }
        let (conds, unstable) = std::mem::replace(&mut self.walk_need, outer);
        self.need = if unstable {
            self.g.needs.push(Need::Unstable);
            Some(self.g.needs.len() as u32 - 1)
        } else if conds.is_empty() {
            None
        } else {
            self.g.needs.push(Need::All(conds));
            Some(self.g.needs.len() as u32 - 1)
        };
        (cur, plan.prop, label)
    }

    /// The walk being resolved enters `count` entries at index `ip`, read
    /// from template `t`: a condition of its need, or for a cell index, no
    /// proof it is stable.
    fn needs_index(&mut self, count: Count, ip: &IndexPlan, t: TemplateId) {
        if ip.is_dynamic() {
            self.walk_need.1 = true;
        } else {
            self.walk_need.0.push(Cond {
                count,
                terms: ip.terms.clone(),
                from: t,
            });
        }
    }

    /// One step of a walk from `cur`, read from template `t`. Over a
    /// `Chosen`, the step applies to every item; the label is pushed once.
    #[allow(clippy::too_many_arguments)]
    fn step(
        &mut self,
        cur: At,
        step: &Step,
        t: TemplateId,
        src_depth: u32,
        to_iface: bool,
        label: &mut Label,
        push: bool,
    ) -> At {
        if let At::Chosen {
            index,
            label: index_label,
            items,
        } = cur
        {
            let items = items
                .into_iter()
                .enumerate()
                .map(|(i, item)| {
                    self.step(item, step, t, src_depth, to_iface, label, push && i == 0)
                })
                .collect();
            return At::Chosen {
                index,
                label: index_label,
                items,
            };
        }
        match step {
            Step::Elem(e) => {
                let in_template = match cur {
                    At::Iter(s) => s,
                    At::Comp(c) => self.template_of(c),
                    At::Missing => return At::Missing,
                    At::Chosen { .. } => unreachable!("walked above"),
                };
                let tpl = &self.c.plans.templates[in_template.index()];
                // A box, and what is under one, read as undefined.
                if tpl.is_dead(*e) || tpl.row(*e).component_type == ComponentType::Error {
                    At::Missing
                } else {
                    At::Comp(Comp::Elem(in_template, *e))
                }
            }
            Step::Iface(cid, id) => match cur {
                At::Comp(_) => {
                    let def = &self.c.plans.choices[cid.index()];
                    let u = def.used_at[id].index();
                    At::Comp(Comp::Made(self.iface[&(*cid, u)]))
                }
                _ => At::Missing,
            },
            Step::Iter(ip) | Step::Item(_, ip) => {
                let c = match cur {
                    At::Comp(c) => c,
                    At::Iter(_) => {
                        self.fail(Error::NotIndexable(self.display()));
                        return At::Missing;
                    }
                    _ => return At::Missing,
                };
                // The entries the index reads, and whether one entry
                // stands for entries that differ at other counts.
                let (entries, varies): (Vec<At>, bool) = match step {
                    Step::Iter(_) => {
                        let Comp::Elem(rt, re) = c else {
                            return At::Missing;
                        };
                        let Body::Repeat { template } =
                            self.c.plans.templates[rt.index()].row(re).body
                        else {
                            return At::Missing;
                        };
                        let entered = self.g.depth[rt.index()] + 1;
                        let coord = index_coord(ip, src_depth, entered);
                        if push {
                            label.push(coord);
                        }
                        // Its own iteration exists wherever it is read.
                        if coord != Coord::Keep(0) {
                            let ty = self.c.plans.templates[rt.index()].row(re).component_type;
                            let pi = ty.count_prop().expect("a repeat has a count");
                            let count = Count::Node(self.g.port(rt, re, pi));
                            self.needs_index(count, ip, t);
                        }
                        (vec![At::Iter(template)], true)
                    }
                    Step::Item(Collection::Picks, ip) => {
                        if let Comp::Elem(ct, ce) = c
                            && let Body::Choice(cid) =
                                self.c.plans.templates[ct.index()].row(ce).body
                        {
                            self.needs_index(Count::Picks(cid), ip, t);
                        }
                        return self.pick(c, to_iface, label, push);
                    }
                    Step::Item(Collection::Gathered, ip) => {
                        // An item of a collect, a copy, is not one.
                        let gathered = match c {
                            Comp::Elem(ct, ce) => self.collected.get(&(ct, ce)).cloned(),
                            Comp::Made(_) => None,
                        };
                        let Some((items, follows)) = gathered else {
                            self.fail(Error::NotIndexable(self.display()));
                            return At::Missing;
                        };
                        let count = match c {
                            Comp::Elem(ct, ce) if follows => {
                                Count::Node(self.g.port(ct, ce, prop::collect::COUNT))
                            }
                            _ => Count::Fixed(items.len() as u32),
                        };
                        self.needs_index(count, ip, t);
                        (items.into_iter().map(At::Comp).collect(), follows)
                    }
                    Step::Item(Collection::ListPoints, ip) => {
                        let points: Vec<At> = self.children(c).into_iter().map(At::Comp).collect();
                        self.needs_index(Count::Fixed(points.len() as u32), ip, t);
                        (points, false)
                    }
                    Step::Item(..) => unreachable!("planning indexes no other collection"),
                    _ => unreachable!(),
                };
                if ip.is_dynamic() {
                    let [IndexTerm::Cell(cell)] = ip.terms[..] else {
                        unreachable!("a dynamic index is one cell")
                    };
                    // The index cell's own walk, with its own label.
                    let (index, label) = self.resolve_one(cell, t);
                    return At::Chosen {
                        index,
                        label,
                        items: entries,
                    };
                }
                let k = self.index_value(ip, t);
                match abstract_index(entries.len(), k, varies) {
                    Some(j) => entries[j].clone(),
                    None => At::Missing,
                }
            }
        }
    }

    /// The value of a literal index read from template `t`: its literals
    /// and the positions of the iterations it names.
    fn index_value(&self, ip: &IndexPlan, t: TemplateId) -> i64 {
        let mut total = 0;
        for term in &ip.terms {
            total += match term {
                IndexTerm::Const(c) => *c,
                IndexTerm::Iter(hops) => {
                    let mut s = t;
                    for _ in 0..*hops {
                        s = self.g.parent[s.index()].expect("an index's hops stay in the document");
                    }
                    self.position(s)
                }
                IndexTerm::Cell(_) => unreachable!("a cell index is a choose"),
            };
        }
        total
    }

    /// `$s[k]` on select `c`, every option built: the select itself before
    /// an interface name, else the stand-in for a whole pick, reset.
    fn pick(&mut self, c: Comp, to_iface: bool, label: &mut Label, push: bool) -> At {
        if to_iface {
            return At::Comp(c);
        }
        if push {
            label.push(Coord::Reset);
        }
        let Comp::Elem(t, e) = c else {
            return At::Missing;
        };
        let Body::Choice(cid) = self.c.plans.templates[t.index()].row(e).body else {
            return At::Missing;
        };
        if let Some(&w) = self.picks.get(&cid) {
            return At::Comp(Comp::Made(w));
        }
        // Any option may be this pick, so what a whole pick names must not
        // depend on which (ADR 0014).
        let branches = self.c.plans.choices[cid.index()].branches.clone();
        let members: Vec<Option<Comp>> = branches
            .iter()
            .map(|&b| match self.root_children(b)[..] {
                [one] => Some(one),
                _ => None,
            })
            .collect();
        let first = members.first().copied().flatten();
        let alike = first.is_some_and(|f| {
            let ty = self.component_type(f);
            members
                .iter()
                .all(|m| m.is_some_and(|m| self.component_type(m) == ty))
        });
        let Some(first) = first.filter(|_| alike) else {
            self.fail(Error::Unsupported(format!(
                "'${}' names a whole pick, so every option must hold one component, all of one type: name the content and use $s[k].name",
                self.display()
            )));
            return At::Missing;
        };
        let members: Vec<Comp> = members.into_iter().flatten().collect();
        let w = self.stand_in(self.component_type(first), t, members, c);
        self.stand_in_sources(w, None);
        self.picks.insert(cid, w);
        At::Comp(Comp::Made(w))
    }

    /// The one component a walk names as a whole: an iteration's or an
    /// option's only component. None when it names none.
    pub(super) fn single_component(&mut self, at: At) -> Option<Comp> {
        match at {
            At::Comp(c) => Some(c),
            At::Iter(s) => match self.root_children(s)[..] {
                [one] => Some(one),
                ref comps => {
                    let n = comps.len();
                    self.fail(Error::AmbiguousIteration(self.display(), n));
                    None
                }
            },
            At::Missing => {
                self.fail(Error::UnknownName(self.display()));
                None
            }
            At::Chosen { .. } => {
                self.fail(Error::Unsupported(format!(
                    "'${}' names a component by a cell, which only a value can be read through: name a prop of it",
                    self.display()
                )));
                None
            }
        }
    }

    /// The one node plan `p` names from template `t`, None for the missing
    /// value, and the label of a read of it.
    pub(super) fn resolve_one(&mut self, p: RefId, t: TemplateId) -> (Option<GraphNode>, Label) {
        let (nodes, label) = self.resolve_ref(p, t, Some(1));
        match nodes[..] {
            [one] => (one, label),
            _ => (None, label),
        }
    }

    /// The nodes plan `p` names from template `t`, None for a missing one,
    /// and the label of a read of them.
    pub(super) fn resolve_ref(
        &mut self,
        p: RefId,
        t: TemplateId,
        expected: Option<usize>,
    ) -> (Vec<Option<GraphNode>>, Label) {
        let (at, prop, label) = self.resolve(p, t);
        self.targets_of(at, prop, label, t, expected)
    }

    /// The nodes a walk labelled `label` names, by its port or the type's
    /// default, read from template `t`, and the label of a read of them:
    /// the walk's, or none through a cell index, a choose over each item's
    /// whose reads of the items carry it.
    pub(super) fn targets_of(
        &mut self,
        at: At,
        prop: Option<RefProp>,
        label: Label,
        t: TemplateId,
        expected: Option<usize>,
    ) -> (Vec<Option<GraphNode>>, Label) {
        let none = |label| (vec![None; expected.unwrap_or(1)], label);
        let c = match at {
            At::Missing => return none(label),
            At::Chosen {
                index,
                label: index_label,
                items,
            } => {
                let nodes =
                    self.chosen_targets(index, index_label, items, prop, label, t, expected);
                return (nodes, Label::new());
            }
            other => match self.single_component(other) {
                Some(c) => c,
                None => return none(label),
            },
        };
        let ty = self.component_type(c);
        let sel = match prop {
            Some(p) => Some(p.sel),
            None => {
                if ty.default_prop().is_none() {
                    self.fail(Error::NoDefaultProp(self.comp_label(c)));
                    return none(label);
                }
                ty.default_sel()
            }
        };
        match sel.and_then(|sel| self.sel_slots(c, sel)) {
            Some(nodes) => (nodes, label),
            None => {
                self.fail(Error::UnknownProp {
                    name: self.comp_label(c),
                    prop: match prop {
                        Some(p) => p.name().into_owned(),
                        None => ty.default_prop().unwrap_or_default().into(),
                    },
                });
                none(label)
            }
        }
    }

    /// The nodes a walk through a cell index names: one choose per node
    /// the port has, over the items' nodes, reading the index. The read of
    /// each item carries the walk's label, the read of the index its own;
    /// the reader's read of the choose is then plain.
    #[allow(clippy::too_many_arguments)]
    fn chosen_targets(
        &mut self,
        index: Option<GraphNode>,
        index_label: Label,
        items: Vec<At>,
        prop: Option<RefProp>,
        walk_label: Label,
        t: TemplateId,
        expected: Option<usize>,
    ) -> Vec<Option<GraphNode>> {
        let columns: Vec<Vec<Option<GraphNode>>> = items
            .into_iter()
            .map(|item| {
                self.targets_of(item, prop, walk_label.clone(), t, expected)
                    .0
            })
            .collect();
        let n = columns.iter().map(Vec::len).max().unwrap_or(1);
        // A missing item named `expected` nodes: as many as the rest.
        if columns
            .iter()
            .any(|col| col.len() != n && col.iter().any(Option::is_some))
        {
            self.fail(Error::Unsupported(format!(
                "'${}' names values of different sizes in different items",
                self.display()
            )));
        }
        let index = self.or_missing(index);
        (0..n)
            .map(|j| {
                // A missing item names as many missing values as the rest.
                let nodes: Vec<GraphNode> = columns
                    .iter()
                    .map(|col| col.get(j).copied().flatten())
                    .collect::<Vec<_>>()
                    .into_iter()
                    .map(|n| self.or_missing(n))
                    .collect();
                Some(self.choose_over(index, &index_label, &nodes, &walk_label, t))
            })
            .collect()
    }

    /// A choose in template `t` among `items` by `index`, read with
    /// `index_label`, each item with `item_label`. More items than one
    /// choose reads are read in chunks, a choose over the chunks by the
    /// index's chunk number.
    fn choose_over(
        &mut self,
        index: GraphNode,
        index_label: &[Coord],
        items: &[GraphNode],
        item_label: &[Coord],
        t: TemplateId,
    ) -> GraphNode {
        const CAP: usize = crate::limits::MAX_VEC_IN - 1;
        if items.len() <= CAP {
            let n = byte(items.len());
            let inputs = std::iter::once(index)
                .chain(items.iter().copied())
                .collect();
            let s = self.op(t, OpSpec::Vec(VecOp::Choose { n }), inputs);
            self.label(s, index, index_label);
            for &item in items {
                self.label(s, item, item_label);
            }
            return s;
        }
        let mut chunks = Vec::with_capacity(items.len().div_ceil(CAP));
        for (ci, chunk) in items.chunks(CAP).enumerate() {
            let local = if ci == 0 {
                index
            } else {
                let offset = self.constant((ci * CAP) as f64);
                let s = self.op(t, OpSpec::Sub, vec![index, offset]);
                self.label(s, index, index_label);
                s
            };
            chunks.push(self.choose_over(local, index_label, chunk, item_label, t));
        }
        // The chunk the index falls in: floor((index - 1) / CAP) + 1.
        let (one, cap) = (self.constant(1.0), self.constant(CAP as f64));
        let less = self.op(t, OpSpec::Sub, vec![index, one]);
        self.label(less, index, index_label);
        let q = self.op(t, OpSpec::Div, vec![less, cap]);
        let f = self.op(t, OpSpec::Floor, vec![q]);
        let which = self.op(t, OpSpec::Add, vec![f, one]);
        self.choose_over(which, &[], &chunks, &[], t)
    }

    /// The coordinate nodes of each item of a list prop plan `p` names
    /// (`$l.points`, `$pg.vertices`), and the label of a read of them.
    pub(super) fn resolve_items(
        &mut self,
        p: RefId,
        t: TemplateId,
    ) -> (Vec<[Option<GraphNode>; 2]>, Label) {
        let (at, prop, label) = self.resolve(p, t);
        (self.items_of(at, prop), label)
    }

    /// The coordinate nodes of each item of the list prop `prop` of what a
    /// walk names.
    fn items_of(&mut self, at: At, prop: Option<RefProp>) -> Vec<[Option<GraphNode>; 2]> {
        if matches!(at, At::Missing) {
            return Vec::new();
        }
        let Some(c) = self.single_component(at) else {
            return Vec::new();
        };
        let component_type = self.component_type(c);
        let Some(prop) = prop else {
            self.fail(Error::PathTooDeep(self.display()));
            return Vec::new();
        };
        let sel = prop.sel_on(component_type);
        if sel == Some(PropSel::At(PropAt::List)) {
            let n = self.n_public(c);
            return (1..=component_type.list_len(n))
                .map(|k| {
                    let at = |j| Some(self.slot(c, component_type.list_slot(n, k, j).unwrap()));
                    [at(0), at(1)]
                })
                .collect();
        }
        if sel != Some(PropSel::TableList) {
            self.fail(Error::UnknownProp {
                name: self.comp_label(c),
                prop: prop.name().into_owned(),
            });
            return Vec::new();
        }
        component_type
            .table_point_positions()
            .iter()
            .map(|&[x, y]| {
                [
                    Some(self.slot(c, x as usize)),
                    Some(self.slot(c, y as usize)),
                ]
            })
            .collect()
    }
}

/// Which of `len` stamped entries index `k` (1-based) names, one
/// iteration standing for every iteration, or None for the missing referent: an index past entries
/// that stand for others lands in them.
fn abstract_index(len: usize, k: i64, varies: bool) -> Option<usize> {
    if varies && len > 0 {
        Some((k.max(1) as usize - 1).min(len - 1))
    } else {
        (k >= 1 && k as u64 <= len as u64).then(|| (k - 1) as usize)
    }
}

//! A reference walked through the stamped templates, as the abstract
//! build resolves it (`build/expand/resolve.rs`): one iteration stands for
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
        let plan = &self.c.plans.refs[p.index()];
        let src_depth = self.g.depth[t.index()];
        let mut sc = t;
        for _ in 0..plan.hops {
            sc = self.g.parent[sc.index()].expect("a reference's hops stay in the document");
        }
        let mut label = vec![Coord::Keep(0); self.g.depth[sc.index()] as usize];
        let mut cur = At::Iter(sc);
        for (si, step) in plan.steps.iter().enumerate() {
            let to_iface = matches!(plan.steps.get(si + 1), Some(Step::Iface(..)));
            cur = self.step(cur, step, t, src_depth, to_iface, &mut label, true);
        }
        (cur, plan.prop, label)
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
                        if push {
                            let entered = self.g.depth[rt.index()] + 1;
                            label.push(index_coord(ip, src_depth, entered));
                        }
                        (vec![At::Iter(template)], true)
                    }
                    Step::Item(Collection::Picks, _) => return self.pick(c, to_iface, label, push),
                    Step::Item(Collection::Gathered, _) => {
                        let Comp::Elem(ct, ce) = c else {
                            return At::Missing;
                        };
                        let Some((items, follows)) = self.collected.get(&(ct, ce)).cloned() else {
                            return At::Missing;
                        };
                        (items.into_iter().map(At::Comp).collect(), follows)
                    }
                    Step::Item(Collection::ListPoints, _) => {
                        let points = self.children(c).into_iter().map(At::Comp).collect();
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
        let branches = self.c.plans.choices[cid.index()].branches.clone();
        let mut members = Vec::with_capacity(branches.len());
        for b in branches {
            match self.single_component(At::Iter(b)) {
                Some(m) => members.push(m),
                None => return At::Missing,
            }
        }
        let Some(&first) = members.first() else {
            return At::Missing;
        };
        let w = self.stand_in(self.component_type(first), t, members);
        self.stand_in_reads(w, None);
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
                _ => None,
            },
            At::Missing | At::Chosen { .. } => None,
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
        let sel = match prop {
            Some(p) => Some(p.sel),
            None => self.component_type(c).default_sel(),
        };
        match sel.and_then(|sel| self.sel_slots(c, sel)) {
            Some(nodes) => (nodes, label),
            None => none(label),
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
        (0..n)
            .map(|j| {
                let nodes: Vec<Option<GraphNode>> = columns
                    .iter()
                    .map(|col| col.get(j).copied().flatten())
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
        index: Option<GraphNode>,
        index_label: &[Coord],
        items: &[Option<GraphNode>],
        item_label: &[Coord],
        t: TemplateId,
    ) -> GraphNode {
        const CAP: usize = crate::limits::MAX_VEC_IN - 1;
        // A node reading `inputs`, each with its label.
        let reading = |s: &mut Self, inputs: &[(Option<GraphNode>, &[Coord])]| {
            let n = s.node(t, NodeKind::Read);
            for &(input, label) in inputs {
                if let Some(input) = input {
                    s.read_as(n, input, label);
                }
            }
            n
        };
        if items.len() <= CAP {
            let mut inputs = vec![(index, index_label)];
            inputs.extend(items.iter().map(|&item| (item, item_label)));
            return reading(self, &inputs);
        }
        let mut chunks = Vec::with_capacity(items.len().div_ceil(CAP));
        for (ci, chunk) in items.chunks(CAP).enumerate() {
            let local = if ci == 0 {
                index
            } else {
                Some(reading(self, &[(index, index_label)]))
            };
            chunks.push(Some(self.choose_over(
                local,
                index_label,
                chunk,
                item_label,
                t,
            )));
        }
        // The chunk the index falls in: floor((index - 1) / CAP) + 1.
        let less = reading(self, &[(index, index_label)]);
        let q = reading(self, &[(Some(less), &[])]);
        let f = reading(self, &[(Some(q), &[])]);
        let which = reading(self, &[(Some(f), &[])]);
        self.choose_over(Some(which), &[], &chunks, &[], t)
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

/// Which of `len` stamped entries index `k` (1-based) names in the
/// abstract view, or None for the missing referent: an index past entries
/// that stand for others lands in them.
fn abstract_index(len: usize, k: i64, varies: bool) -> Option<usize> {
    if varies && len > 0 {
        Some((k.max(1) as usize - 1).min(len - 1))
    } else {
        (k >= 1 && k as u64 <= len as u64).then(|| (k - 1) as usize)
    }
}

//! Aggregates in the template graph, as a build materializes
//! them (`build/expand/aggregate.rs`) from the tree it stamped: the
//! document's and each aggregating section's credit, the weighted mean of
//! its scored items' credit, each weight gated by the cases around it;
//! every other section's credit, a constant; and each section's number, 1
//! plus the sections before it, the gated ones through a sum of their
//! gates.
//!
//! The tree is the stamping's ([`Stamp::children`]): an element's children,
//! an iteration's or an option's root, a conditional content's cases, a
//! collect's copies, and the `$ref` children as placed. A scored item may
//! be a copy: a `$ref` child or a collect's copy of an answer reads
//! through its own ports.
//!
//! A collection that crosses a repeat makes the aggregate a counted value
//! (ADR 0028), listed as such.

use super::*;
use crate::components::{AggOp, Collection, Numbering, Scored, StepGate};

/// A step of a gated type, with the product of the cases between it and
/// that type (ADR 0062).
type GatedStep = (Comp, Option<GraphNode>);

/// One scored item, as a scoring walk finds it, as a build has it: its
/// gated weight, its credit and its progress credit (ADR 0062).
#[derive(Clone, Copy)]
struct ScoredItem {
    weight: GraphNode,
    credit: GraphNode,
    progress: GraphNode,
}
use crate::limits::SCORE_CHUNK as CHUNK;

/// Sections counted so far among one component's flattened children: a
/// constant count of those outside any case, plus a node summing the gates
/// of the rest.
#[derive(Default)]
struct Counter {
    known: f64,
    before: Option<GraphNode>,
    /// A section was counted in a repeat (or a collect from one) before
    /// the next one, so its number follows the counts.
    follows: bool,
    /// The number nodes counted so far.
    numbered: Vec<GraphNode>,
    /// The sections counted from here on are numbered as one iteration
    /// stands for every iteration, or every option of a select is built,
    /// where a build numbers them by its iteration or its picks: a scope
    /// constant whose value the graph does not hold (ADR 0037).
    varies: bool,
}

/// Where a [`Counter`] stood before a repeat.
#[derive(Clone, Copy)]
struct Mark {
    known: f64,
    before: Option<GraphNode>,
    follows: bool,
    start: usize,
}

impl Mark {
    fn of(c: &Counter) -> Mark {
        Mark {
            known: c.known,
            before: c.before,
            follows: c.follows,
            start: c.numbered.len(),
        }
    }
}

/// The list items counted so far among one component's children, and the
/// product of the cases between it and the child being counted (ADR
/// 0054), as a build has them (`build/expand/aggregate.rs`).
#[derive(Default)]
struct Items {
    counter: Counter,
    gate: Option<GraphNode>,
}

/// The two sequences one component numbers its children in (ADR 0054):
/// the divisions', and its list items' when it has any.
struct Seq {
    div: Counter,
    items: Option<Items>,
    /// Its sectioning children are its list's items.
    as_list: bool,
}

/// Stamping, aggregates: credit and section numbers in the template graph, as a
/// build materializes them (`build/expand/aggregate.rs`).
impl<'c> Stamp<'c> {
    /// The sources of the document's and every section's credit and of
    /// every section's number.
    pub(super) fn aggregates(&mut self) {
        let root = self.root_children(TemplateId::new(0))[0];
        // The steps' gates first: the credits read them.
        let stepped = self.gate_steps();
        // A root boxed for an error of its own (`<document lang="es">`,
        // an attribute nothing reads) holds no credit.
        if self
            .component_type(root)
            .aggregate_prop(AggOp::Credit, Collection::ScoredItems)
            .is_some()
        {
            self.credit(root);
        }
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            let c = Comp::Elem(t, e);
            if let Some(Scored::Aggregates { .. }) = self.component_type(c).scored() {
                if self.aggregates_scores(c) {
                    self.credit(c);
                } else {
                    self.constant_credit(c, 0.0);
                }
            }
        }
        for (c, steps) in stepped {
            self.credit(c);
            self.completed(c, &steps);
        }
        let mut seq = self.fresh_seq(root);
        self.numbers(root, None, &mut seq);
    }

    /// Whether section `c` aggregates scores: its `aggregateScores` is a
    /// constant, not zero. A copy's is an alias, so it does not.
    fn aggregates_scores(&self, c: Comp) -> bool {
        let Comp::Elem(t, e) = c else { return false };
        let Some(Scored::Aggregates { when, .. }) = self.component_type(c).scored() else {
            return false;
        };
        matches!(
            self.c.plans.templates[t.index()].plan(e).props.get(when),
            Some(Source::Leaf(Leaf::Const(v))) if *v != 0.0
        )
    }

    /// The nodes of `c`'s credit and its percentage: the props its type
    /// declares as those aggregates over its scored items.
    fn credit_slots(&self, c: Comp) -> (GraphNode, GraphNode) {
        let ty = self.component_type(c);
        let at = |op| {
            ty.aggregate_prop(op, Collection::ScoredItems)
                .expect("credit aggregated over scored items")
        };
        (
            self.slot(c, at(AggOp::Credit)),
            self.slot(c, at(AggOp::PercentCredit)),
        )
    }

    /// `creditAchieved` of the document or an aggregating section `c`: the
    /// weighted mean of its scored items, and its percentage that times
    /// 100; with nothing to score, full credit. With a scored item in a
    /// repeat below `c`, both are counted values. Its progress credit too,
    /// when its type declares one (a `<cascade>` declares only that).
    fn credit(&mut self, c: Comp) {
        let mut items = Vec::new();
        self.scored_items(c, None, c, &mut items);
        let at = self.repeats_around(self.template_of(c));
        let deeper = items
            .iter()
            .any(|i| self.repeats_around(self.g.nodes[i.credit.index()].template) > at);
        let ty = self.component_type(c);
        let t = self.template_of(c);
        let credit = ty.aggregate_prop(AggOp::Credit, Collection::ScoredItems);
        if credit.is_some() {
            let (s, p) = self.credit_slots(c);
            if deeper {
                self.g.counted.extend([s, p]);
            }
            let pairs = items.iter().map(|i| (i.weight, i.credit)).collect();
            match self.mean_credit(t, pairs) {
                Some(mean) => {
                    self.set(s, Def::Alias(mean));
                    let hundred = self.constant(100.0);
                    self.set(p, Def::Op(GraphOp::Spec(OpSpec::Mul), vec![s, hundred]));
                }
                None => {
                    self.set(s, Def::Const(Some(1.0)));
                    self.set(p, Def::Const(Some(100.0)));
                }
            }
        }
        let Some(s) = self.progress_slot(c) else {
            return;
        };
        if let Some(ci) = credit
            && items.iter().all(|i| i.progress == i.credit)
        {
            let credit = self.slot(c, ci);
            self.set(s, Def::Alias(credit));
            return;
        }
        if deeper {
            self.g.counted.push(s);
        }
        let pairs = items.iter().map(|i| (i.weight, i.progress)).collect();
        match self.mean_credit(t, pairs) {
            Some(mean) => self.set(s, Def::Alias(mean)),
            None => self.set(s, Def::Const(Some(1.0))),
        }
    }

    /// A credit that cannot change, and its percentage (and progress
    /// credit, when its type has one), as constants.
    fn constant_credit(&mut self, c: Comp, credit: f64) {
        let (s, p) = self.credit_slots(c);
        self.set(s, Def::Const(Some(credit)));
        self.set(p, Def::Const(Some(100.0 * credit)));
        if let Some(s) = self.progress_slot(c) {
            self.set(s, Def::Const(Some(credit)));
        }
    }

    /// The node of `c`'s progress credit, when its type declares one.
    fn progress_slot(&self, c: Comp) -> Option<GraphNode> {
        self.component_type(c)
            .aggregate_prop(AggOp::ProgressCredit, Collection::ScoredItems)
            .map(|p| self.slot(c, p))
    }

    /// Gate the steps of every element of a type with a [`StepGate`] (ADR
    /// 0062), as a build does: each step's gate is 1 while its place among
    /// the steps is at most the type's `completed`, or its `all` is 1. A
    /// place past a repeat or a load-time choice is one the graph does not
    /// hold, as a section's number there is not. Returns each such element
    /// with its steps, each with the cases around it.
    fn gate_steps(&mut self) -> Vec<(Comp, Vec<GatedStep>)> {
        let mut out = Vec::new();
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            let c = Comp::Elem(t, e);
            let Some(gate) = self.component_type(c).step_gate() else {
                continue;
            };
            let mut steps = Vec::new();
            self.steps_of(c, &gate, None, false, &mut steps);
            let completed = self.slot(c, gate.completed);
            let all = self.slot(c, gate.all);
            let mut place = Counter::default();
            for &(k, case, varies) in &steps {
                let kt = self.template_of(k);
                place.varies |= varies;
                let at = if place.varies {
                    let n = self.value(kt, Def::Const(Some(place.known)));
                    self.g.scope_leaves.insert(n, ScopeLeaf::Varies);
                    n
                } else {
                    self.constant(place.known)
                };
                let at = match place.before {
                    None => at,
                    Some(b) => self.op(kt, OpSpec::Add, vec![b, at]),
                };
                let reached = self.op(kt, OpSpec::Le, vec![at, completed]);
                let there = self.op(kt, OpSpec::Max, vec![reached, all]);
                self.step_gates.insert(k, (c, there));
                self.advance(&mut place, case, k);
            }
            out.push((c, steps.into_iter().map(|(k, g, _)| (k, g)).collect()));
        }
        out
    }

    /// The steps under `c` of a type gated by `gate`, in document order, as
    /// a build finds them: each with the product of the cases between it
    /// and that type, and whether a repeat or a load-time choice is passed
    /// on the way to it.
    fn steps_of(
        &mut self,
        c: Comp,
        gate: &StepGate,
        case: Option<GraphNode>,
        varies: bool,
        out: &mut Vec<(Comp, Option<GraphNode>, bool)>,
    ) {
        for k in self.children(c) {
            let ty = self.component_type(k);
            if gate.skip.contains(&ty) || ty == gate.message {
                continue;
            }
            match ty.structure_kind() {
                Some(StructureKind::Gate { .. }) => {
                    let g = self.gate_through(case, k);
                    self.steps_of(k, gate, g, varies, out);
                }
                Some(StructureKind::Repeat { .. }) => self.steps_of(k, gate, case, true, out),
                Some(StructureKind::Transparent { .. }) => {
                    let varies = varies || self.picks_at_load(k) || self.follows_counts(k);
                    self.steps_of(k, gate, case, varies, out);
                }
                None => out.push((k, case, varies)),
            }
        }
    }

    /// `c`'s `completed`, as a build makes it: how many of its leading
    /// steps are complete, a step in an inactive case skipped. A counted
    /// value when a step sits in a repeat below `c`.
    fn completed(&mut self, c: Comp, steps: &[GatedStep]) {
        let gate = self.component_type(c).step_gate().expect("a gated type");
        let t = self.template_of(c);
        let one = self.constant(1.0);
        let mut leading: Option<GraphNode> = None;
        let mut known = 0.0;
        let mut terms = Vec::new();
        let at = self.repeats_around(t);
        let mut deeper = false;
        for &(k, case) in steps {
            deeper |= self.repeats_around(self.template_of(k)) > at;
            let complete = self
                .step_progress(k)
                .map(|p| self.op(t, OpSpec::Eq, vec![p, one]));
            let complete = match (complete, case) {
                (Some(x), Some(g)) => {
                    let out = self.op(t, OpSpec::Not, vec![g]);
                    Some(self.op(t, OpSpec::Max, vec![x, out]))
                }
                (x, _) => x,
            };
            leading = match (leading, complete) {
                (l, None) => l,
                (None, Some(x)) => Some(x),
                (Some(l), Some(x)) => Some(self.op(t, OpSpec::Mul, vec![l, x])),
            };
            match (leading, case) {
                (None, None) => known += 1.0,
                (Some(x), None) | (None, Some(x)) => terms.push(x),
                (Some(l), Some(g)) => terms.push(self.op(t, OpSpec::Mul, vec![l, g])),
            }
        }
        let s = self.slot(c, gate.completed);
        if deeper {
            self.g.counted.push(s);
        }
        let Some((&first, rest)) = terms.split_first() else {
            self.set(s, Def::Const(Some(known)));
            return;
        };
        let mut sum = first;
        for &x in rest {
            sum = self.op(t, OpSpec::Add, vec![sum, x]);
        }
        if known == 0.0 {
            self.set(s, Def::Alias(sum));
        } else {
            let k = self.constant(known);
            self.set(s, Def::Op(GraphOp::Spec(OpSpec::Add), vec![sum, k]));
        }
    }

    /// The progress credit of step `k`, as a build reads it: an answer's,
    /// an aggregating section's or a gated type's own, else the mean over
    /// the scored items it holds; None when it holds none.
    fn step_progress(&mut self, k: Comp) -> Option<GraphNode> {
        let ty = self.component_type(k);
        match ty.scored() {
            Some(Scored::Skip) => return None,
            Some(Scored::Item { credit, .. }) => return Some(self.item_credit(k, credit)),
            Some(Scored::Aggregates { .. }) if self.aggregates_scores(k) => {
                return self.progress_slot(k);
            }
            _ => {}
        }
        if ty.step_gate().is_some() {
            return self.progress_slot(k);
        }
        let mut items = Vec::new();
        self.scored_items(k, None, k, &mut items);
        let pairs = items.iter().map(|i| (i.weight, i.progress)).collect();
        let t = self.template_of(k);
        self.mean_credit(t, pairs)
    }

    /// How many repeats' iterations enclose template `t`.
    fn repeats_around(&self, mut t: TemplateId) -> usize {
        let mut n = 0;
        while let Some((pt, pe)) = self.c.plans.templates[t.index()].parent {
            if matches!(
                self.c.plans.templates[pt.index()].row(pe).body,
                Body::Repeat { .. }
            ) {
                n += 1;
            }
            t = pt;
        }
        n
    }

    /// The weighted mean of `items`, (weight, credit) each, made in
    /// template `t`: chunks of at most `CHUNK`, each level's means and
    /// totals the next level's credits and weights. None with no items.
    fn mean_credit(
        &mut self,
        t: TemplateId,
        mut items: Vec<(GraphNode, GraphNode)>,
    ) -> Option<GraphNode> {
        if items.is_empty() {
            return None;
        }
        loop {
            let mut next = Vec::with_capacity(items.len().div_ceil(CHUNK));
            for chunk in items.chunks(CHUNK) {
                let inputs: Vec<GraphNode> = chunk
                    .iter()
                    .map(|&(w, _)| w)
                    .chain(chunk.iter().map(|&(_, c)| c))
                    .collect();
                let n = byte(chunk.len());
                let mean = self.op(t, OpSpec::Vec(VecOp::WeightedMean { n }), inputs);
                let total = self.value(t, Def::VecOut(mean, 1));
                next.push((total, mean));
            }
            if next.len() == 1 {
                return Some(next[0].1);
            }
            items = next;
        }
    }

    /// Each scored item under `c`, in document order, its weight gated:
    /// answers, and sections that aggregate; other sections and containers
    /// are looked through, `<setup>` is not. A step of a type with a
    /// [`StepGate`] is gated by its step's gate unless that type is `root`,
    /// the component whose credit is being made (ADR 0062).
    fn scored_items(
        &mut self,
        c: Comp,
        gate: Option<GraphNode>,
        root: Comp,
        out: &mut Vec<ScoredItem>,
    ) {
        for k in self.children(c) {
            let t = self.template_of(k);
            let gate = match self.step_gates.get(&k) {
                Some(&(of, g)) if of != root => Some(self.gated(gate, g, t)),
                _ => gate,
            };
            let (weight, credit, progress) = match self.component_type(k).scored() {
                Some(Scored::Skip) => continue,
                Some(Scored::Item { credit, weight }) => {
                    let credit = self.item_credit(k, credit);
                    (self.slot(k, weight), credit, credit)
                }
                Some(Scored::Aggregates { weight, .. }) if self.aggregates_scores(k) => {
                    let credit = self.credit_slots(k).0;
                    let progress = self.progress_slot(k).unwrap_or(credit);
                    (self.slot(k, weight), credit, progress)
                }
                _ => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, root, out);
                    continue;
                }
            };
            let weight = self.gated(gate, weight, t);
            out.push(ScoredItem {
                weight,
                credit,
                progress,
            });
        }
    }

    /// A scored item's credit, as a build reads it: no credit while NaN.
    fn item_credit(&mut self, k: Comp, credit: usize) -> GraphNode {
        let t = self.template_of(k);
        // A blank response checks as NaN; it is no credit.
        let checked = self.slot(k, credit);
        let zero = self.constant(0.0);
        self.op(t, OpSpec::NanTo, vec![checked, zero])
    }

    /// Number the sections inside repeat (or collect from repeats) `r`,
    /// among the children counted by `seq`. A section counted inside
    /// makes the numbers after `r` follow its count; one whose number
    /// follows a count inside `r` makes every number inside `r` follow.
    fn number_through_repeat(&mut self, r: Comp, gate: Option<GraphNode>, seq: &mut Seq) {
        let div = Mark::of(&seq.div);
        let items = seq.items.as_ref().map(|i| Mark::of(&i.counter));
        let varies = std::mem::replace(&mut seq.div.varies, true);
        let items_varies = seq
            .items
            .as_mut()
            .map(|i| std::mem::replace(&mut i.counter.varies, true));
        self.numbers(r, gate, seq);
        seq.div.varies = varies;
        if let (Some(i), Some(v)) = (seq.items.as_mut(), items_varies) {
            i.counter.varies = v;
        }
        self.settle(&mut seq.div, div);
        if let (Some(i), Some(mark)) = (seq.items.as_mut(), items) {
            self.settle(&mut i.counter, mark);
        }
    }

    /// After a repeat counted from `mark`: the numbers inside it follow
    /// the counts when one of them does, and the numbers after it when it
    /// counted anything.
    fn settle(&mut self, counter: &mut Counter, mark: Mark) {
        if counter.follows && !mark.follows {
            let inside = counter.numbered[mark.start..].to_vec();
            self.g.counted.extend(inside);
        }
        if counter.known != mark.known || counter.before != mark.before {
            counter.follows = true;
        }
    }

    /// The sequences `c` numbers its children in, from 1: the divisions',
    /// and its list items' when one of its children is one (ADR 0054).
    fn fresh_seq(&self, c: Comp) -> Seq {
        let as_list = self.numbered_flag(c, |n| n.as_list);
        Seq {
            div: Counter::default(),
            items: (as_list || self.has_list_item(c)).then(Items::default),
            as_list,
        }
    }

    /// Whether `c`'s type declares the constant 0/1 prop `prop` of its
    /// [`Numbered`](crate::components::Numbered), and it is on. A copy's
    /// is an alias, so it is not.
    fn numbered_flag(
        &self,
        c: Comp,
        prop: fn(&crate::components::Numbered) -> Option<usize>,
    ) -> bool {
        let Comp::Elem(t, e) = c else { return false };
        let Some(n) = self.component_type(c).def().numbered else {
            return false;
        };
        prop(&n).is_some_and(|p| {
            matches!(
                self.c.plans.templates[t.index()].plan(e).props.get(p),
                Some(Source::Leaf(Leaf::Const(v))) if *v != 0.0
            )
        })
    }

    /// Whether a child of `c`, looked through the structure, is always a
    /// list item (a `<part>`).
    fn has_list_item(&self, c: Comp) -> bool {
        self.children(c).into_iter().any(|k| {
            if self.component_type(k).passes_list_items() {
                self.has_list_item(k)
            } else {
                self.numbered_flag(k, |n| n.list_item)
            }
        })
    }

    /// Number the sections among the children of `c`, counting through the
    /// containers expanded in place and, for the divisions, through those
    /// that pass their sequence through (ADR 0054); `gate` is the product
    /// of the cases between `c` and the component whose children the
    /// divisions are counted among.
    fn numbers(&mut self, c: Comp, gate: Option<GraphNode>, seq: &mut Seq) {
        for k in self.children(c) {
            let ty = self.component_type(k);
            match ty.structure_kind() {
                Some(StructureKind::Gate { .. }) => {
                    let g = self.gate_through(gate, k);
                    let items_gate = seq.items.as_ref().map(|i| i.gate);
                    if let Some(i) = seq.items.as_mut() {
                        i.gate = if i.gate == gate {
                            g
                        } else {
                            self.gate_through(i.gate, k)
                        };
                    }
                    self.numbers(k, g, seq);
                    if let (Some(i), Some(ig)) = (seq.items.as_mut(), items_gate) {
                        i.gate = ig;
                    }
                }
                Some(StructureKind::Repeat { .. }) => self.number_through_repeat(k, gate, seq),
                // A collect that follows the counts of the repeats it
                // gathers from.
                Some(StructureKind::Transparent { .. }) if self.follows_counts(k) => {
                    self.number_through_repeat(k, gate, seq)
                }
                Some(StructureKind::Transparent { .. }) => {
                    // A build numbers what a load-time choice's picks
                    // hold, and what follows them by how many they hold.
                    if self.picks_at_load(k) {
                        seq.div.varies = true;
                        if let Some(i) = seq.items.as_mut() {
                            i.counter.varies = true;
                        }
                    }
                    self.numbers(k, gate, seq)
                }
                // A page: both sequences continue through it (ADR 0058).
                None if ty.numbering() == Some(Numbering::PassesBoth) => self.numbers(k, gate, seq),
                None if ty.numbering() == Some(Numbering::PassesDivisions) => {
                    // The divisions inside continue the sequence; the list
                    // items inside are counted among themselves.
                    let inner = self.fresh_seq(k);
                    let items = std::mem::replace(&mut seq.items, inner.items);
                    let as_list = std::mem::replace(&mut seq.as_list, false);
                    self.numbers(k, gate, seq);
                    seq.items = items;
                    seq.as_list = as_list;
                }
                None if ty.numbering() == Some(Numbering::Unnumbered) => {
                    // A proof: a list item with no number, which bounds both.
                    if let Some(i) = seq.items.as_mut() {
                        let gate = i.gate;
                        self.advance(&mut i.counter, gate, k);
                    }
                    let mut inner = self.fresh_seq(k);
                    self.numbers(k, None, &mut inner);
                }
                None if ty
                    .aggregate_prop(AggOp::Count, Collection::SectionsThrough)
                    .is_some() =>
                {
                    let number = ty.aggregate_prop(AggOp::Count, Collection::SectionsThrough);
                    let s = self.slot(k, number.expect("a numbered section"));
                    let list_item = seq.as_list || self.numbered_flag(k, |n| n.list_item);
                    // A list item is numbered among the list items, and
                    // takes its place among the divisions all the same, as
                    // in the current core.
                    match seq.items.as_mut() {
                        Some(i) if list_item => {
                            let item_gate = i.gate;
                            self.take_number(&mut i.counter, s, item_gate, k);
                            self.advance(&mut seq.div, gate, k);
                        }
                        _ => {
                            self.take_number(&mut seq.div, s, gate, k);
                            if let Some(i) = seq.items.as_mut() {
                                let item_gate = i.gate;
                                self.advance(&mut i.counter, item_gate, k);
                            }
                        }
                    }
                    let mut inner = self.fresh_seq(k);
                    self.numbers(k, None, &mut inner);
                }
                _ => {
                    let mut inner = self.fresh_seq(k);
                    self.numbers(k, None, &mut inner);
                }
            }
        }
    }

    /// Set `s`, section `k`'s `number`, as the next number `counter`
    /// gives, and count it, behind `gate`.
    fn take_number(
        &mut self,
        counter: &mut Counter,
        s: GraphNode,
        gate: Option<GraphNode>,
        k: Comp,
    ) {
        if counter.follows {
            self.g.counted.push(s);
        } else if counter.varies {
            self.g.scope_leaves.insert(s, ScopeLeaf::Varies);
        }
        let k1 = self.constant(counter.known + 1.0);
        let number = match counter.before {
            None if counter.follows => Def::Op(GraphOp::Spec(OpSpec::Copy), vec![k1]),
            None => Def::Const(Some(counter.known + 1.0)),
            Some(b) => Def::Op(GraphOp::Spec(OpSpec::Add), vec![b, k1]),
        };
        self.set(s, number);
        counter.numbered.push(s);
        self.advance(counter, gate, k);
    }

    /// Count one more item in `counter`, behind `gate`, made in `k`'s
    /// template.
    fn advance(&mut self, counter: &mut Counter, gate: Option<GraphNode>, k: Comp) {
        match gate {
            None => counter.known += 1.0,
            Some(g) => {
                counter.before = Some(match counter.before {
                    None => g,
                    Some(b) => {
                        let t = self.template_of(k);
                        self.op(t, OpSpec::Add, vec![b, g])
                    }
                })
            }
        }
    }

    /// Whether collect `c` follows the counts of the repeats it gathers
    /// from.
    fn follows_counts(&self, c: Comp) -> bool {
        let Comp::Elem(t, e) = c else { return false };
        self.collected.get(&(t, e)).is_some_and(|(_, f)| *f)
    }

    /// Whether `c` is a load-time choice (a `<select>`), whose picks a
    /// build makes.
    fn picks_at_load(&self, c: Comp) -> bool {
        let Comp::Elem(t, e) = c else { return false };
        match self.c.plans.templates[t.index()].row(e).body {
            Body::Choice(cid) => !self.c.plans.choices[cid.index()].reactive,
            _ => false,
        }
    }

    /// `gate`, times `k`'s `active` when `k` is a gate
    /// ([`StructureKind::Gate`]), made in `k`'s template.
    fn gate_through(&mut self, gate: Option<GraphNode>, k: Comp) -> Option<GraphNode> {
        let Some(active) = self.component_type(k).gate_prop() else {
            return gate;
        };
        let active = self.slot(k, active);
        Some(self.gated(gate, active, self.template_of(k)))
    }

    /// `x`, times `gate` when there is one, made in template `t`.
    fn gated(&mut self, gate: Option<GraphNode>, x: GraphNode, t: TemplateId) -> GraphNode {
        match gate {
            None => x,
            Some(g) => self.op(t, OpSpec::Mul, vec![g, x]),
        }
    }
}

//! Aggregates in the template graph, as a build materializes
//! them (`build/expand/aggregate.rs`) from the tree it stamped: the
//! document's and each aggregating section's credit, the weighted mean of
//! its scored items' credit, each weight gated by the cases around it;
//! every other section's credit, a constant; and each section's number, 1
//! plus the sections before it, the gated ones through a sum of their
//! gates.
//!
//! The tree is the stamping's (`Stamp::children`): an element's children,
//! an iteration's or an option's root, a conditional content's cases, a
//! collect's copies, and the `$ref` children as placed. A scored item may
//! be a copy: a `$ref` child or a collect's copy of an answer reads
//! through its own ports.
//!
//! A collection that crosses a repeat makes the aggregate a counted value
//! (ADR 0028), listed as such.

use super::*;
use crate::components::prop::{answer, section};
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
}

impl<'c> Stamp<'c> {
    /// The sources of the document's and every section's credit and of
    /// every section's number.
    pub(super) fn aggregates(&mut self) {
        let root = self.root_children(TemplateId::new(0))[0];
        self.credit(root);
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            let c = Comp::Elem(t, e);
            if self.component_type(c) == ComponentType::Section {
                if self.aggregates_scores(c) {
                    self.credit(c);
                } else {
                    self.constant_credit(c, 0.0);
                }
            }
        }
        self.numbers(root, None, &mut Counter::default());
    }

    /// Whether section `c` aggregates scores: its `aggregateScores` is a
    /// constant, not zero. A copy's is an alias, so it does not.
    fn aggregates_scores(&self, c: Comp) -> bool {
        let Comp::Elem(t, e) = c else { return false };
        matches!(
            self.c.plans.templates[t.index()].plan(e).props.get(section::AGGREGATE),
            Some(Source::Leaf(Leaf::Const(v))) if *v != 0.0
        )
    }

    /// `creditAchieved` of the document or an aggregating section `c`: the
    /// weighted mean of its scored items, and its percentage that times
    /// 100; with nothing to score, full credit. With a scored item in a
    /// repeat below `c`, both are counted values.
    fn credit(&mut self, c: Comp) {
        let (s, p) = (
            self.slot(c, section::CREDIT),
            self.slot(c, section::PERCENT_CREDIT),
        );
        let mut items = Vec::new();
        self.scored_items(c, None, &mut items);
        let at = self.repeats_around(self.template_of(c));
        if items
            .iter()
            .any(|&(_, credit)| self.repeats_around(self.g.nodes[credit.index()].template) > at)
        {
            self.g.counted.extend([s, p]);
        }
        let t = self.template_of(c);
        match self.mean_credit(t, items) {
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

    /// A credit that cannot change, and its percentage, as constants.
    fn constant_credit(&mut self, c: Comp, credit: f64) {
        let (s, p) = (
            self.slot(c, section::CREDIT),
            self.slot(c, section::PERCENT_CREDIT),
        );
        self.set(s, Def::Const(Some(credit)));
        self.set(p, Def::Const(Some(100.0 * credit)));
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

    /// (gated weight, credit) of each scored item under `c`, in document
    /// order: answers, and sections that aggregate; other sections and
    /// containers are looked through, `<setup>` is not.
    fn scored_items(
        &mut self,
        c: Comp,
        gate: Option<GraphNode>,
        out: &mut Vec<(GraphNode, GraphNode)>,
    ) {
        for k in self.children(c) {
            let t = self.template_of(k);
            let (weight, credit) = match self.component_type(k) {
                ComponentType::Setup => continue,
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, out);
                    continue;
                }
                ComponentType::Answer => {
                    // A blank response checks as NaN; it is no credit.
                    let checked = self.slot(k, answer::CREDIT);
                    let zero = self.constant(0.0);
                    let credit = self.op(t, OpSpec::NanTo, vec![checked, zero]);
                    (self.slot(k, answer::WEIGHT), credit)
                }
                ComponentType::Section if self.aggregates_scores(k) => {
                    (self.slot(k, section::WEIGHT), self.slot(k, section::CREDIT))
                }
                _ => {
                    self.scored_items(k, gate, out);
                    continue;
                }
            };
            let weight = self.gated(gate, weight, t);
            out.push((weight, credit));
        }
    }

    /// Number the sections inside repeat (or collect from repeats) `r`,
    /// among the children counted by `counter`. A section counted inside
    /// makes the numbers after `r` follow its count; one whose number
    /// follows a count inside `r` makes every number inside `r` follow.
    fn number_through_repeat(&mut self, r: Comp, gate: Option<GraphNode>, counter: &mut Counter) {
        let (known, before, follows) = (counter.known, counter.before, counter.follows);
        let start = counter.numbered.len();
        self.numbers(r, gate, counter);
        if counter.follows && !follows {
            let inside = counter.numbered[start..].to_vec();
            self.g.counted.extend(inside);
        }
        if counter.known != known || counter.before != before {
            counter.follows = true;
        }
    }

    /// Number the sections among the children of `c`, counting through the
    /// containers expanded in place; `gate` is the product of the cases
    /// between `c` and the component whose children are being counted.
    fn numbers(&mut self, c: Comp, gate: Option<GraphNode>, counter: &mut Counter) {
        for k in self.children(c) {
            match self.component_type(k) {
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.numbers(k, g, counter);
                }
                ComponentType::RepeatForSequence | ComponentType::RepeatFor => {
                    self.number_through_repeat(k, gate, counter)
                }
                ComponentType::Collect if self.follows_counts(k) => {
                    self.number_through_repeat(k, gate, counter)
                }
                ComponentType::ConditionalContent
                | ComponentType::Select
                | ComponentType::Group
                | ComponentType::Collect => self.numbers(k, gate, counter),
                ComponentType::Section => {
                    let s = self.slot(k, section::NUMBER);
                    if counter.follows {
                        self.g.counted.push(s);
                    }
                    let k1 = self.constant(counter.known + 1.0);
                    let number = match counter.before {
                        None if counter.follows => Def::Op(GraphOp::Spec(OpSpec::Copy), vec![k1]),
                        None => Def::Const(Some(counter.known + 1.0)),
                        Some(b) => Def::Op(GraphOp::Spec(OpSpec::Add), vec![b, k1]),
                    };
                    self.set(s, number);
                    counter.numbered.push(s);
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
                    self.numbers(k, None, &mut Counter::default());
                }
                _ => self.numbers(k, None, &mut Counter::default()),
            }
        }
    }

    /// Whether collect `c` follows the counts of the repeats it gathers
    /// from.
    fn follows_counts(&self, c: Comp) -> bool {
        let Comp::Elem(t, e) = c else { return false };
        self.collected.get(&(t, e)).is_some_and(|(_, f)| *f)
    }

    /// `gate` times case `k`'s `active`, made in the case's template.
    fn gate_through(&mut self, gate: Option<GraphNode>, k: Comp) -> Option<GraphNode> {
        let active = self.slot(k, prop::case::ACTIVE);
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

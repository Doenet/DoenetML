//! Aggregates in the template graph, as the abstract build materializes
//! them (`build/expand/aggregate.rs`) from the tree it stamped: the
//! document's and each aggregating section's credit over its scored items,
//! each weight gated by the cases around it, and each section's number
//! after the gates of the sections before it.
//!
//! The tree is the stamping's (`Stamp::children`): an element's children,
//! an iteration's or an option's root, a conditional content's cases, a
//! collect's copies, and the `$ref` children as placed. A scored item may
//! be a copy: a `$ref` child or a collect's copy of an answer reads
//! through its own ports.

use super::*;
use crate::components::prop::{answer, section};
use crate::limits::SCORE_CHUNK as CHUNK;

impl<'c> Stamp<'c> {
    /// The reads of the document's and every aggregating section's credit
    /// and of every section's number.
    pub(super) fn aggregates(&mut self) {
        let doc = TemplateId::new(0);
        let root = self.root_children(doc)[0];
        self.credit(root);
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            let c = Comp::Elem(t, e);
            if self.component_type(c) == ComponentType::Section && self.aggregates_scores(c) {
                self.credit(c);
            }
        }
        self.numbers(root, None, &mut None);
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

    /// `creditAchieved` of the document or an aggregating section `c`
    /// reads the weighted mean of its scored items; its percentage reads
    /// it.
    fn credit(&mut self, c: Comp) {
        let mut items = Vec::new();
        self.scored_items(c, None, &mut items);
        let Some(mean) = self.mean_credit(self.template_of(c), items) else {
            return; // Nothing to score: full credit, a constant.
        };
        let credit = self.slot(c, section::CREDIT);
        self.read(credit, mean);
        let percent = self.slot(c, section::PERCENT_CREDIT);
        self.read(percent, credit);
    }

    /// The weighted mean of `items`, read in chunks, made in template `t`;
    /// None when there are none.
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
                let mean = self.node(t, NodeKind::Read);
                for &(w, _) in chunk {
                    self.read(mean, w);
                }
                for &(_, c) in chunk {
                    self.read(mean, c);
                }
                let total = self.node(t, NodeKind::Read);
                self.read(total, mean);
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
            let (weight, credit) = match self.component_type(k) {
                ComponentType::Setup => continue,
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, out);
                    continue;
                }
                ComponentType::Answer => {
                    // A blank response checks as no credit.
                    let checked = self.slot(k, answer::CREDIT);
                    let credit = self.node(self.template_of(k), NodeKind::Read);
                    self.read(credit, checked);
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
            let weight = self.gated(gate, weight, self.template_of(k));
            out.push((weight, credit));
        }
    }

    /// Number the sections among the children of `c`, counting through the
    /// containers expanded in place; `before` is what the sections counted
    /// so far add under cases.
    fn numbers(&mut self, c: Comp, gate: Option<GraphNode>, before: &mut Option<GraphNode>) {
        for k in self.children(c) {
            match self.component_type(k) {
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.numbers(k, g, before);
                }
                ComponentType::RepeatForSequence
                | ComponentType::RepeatFor
                | ComponentType::Collect
                | ComponentType::ConditionalContent
                | ComponentType::Select
                | ComponentType::Group => self.numbers(k, gate, before),
                ComponentType::Section => {
                    if let Some(b) = *before {
                        let number = self.slot(k, section::NUMBER);
                        self.read(number, b);
                    }
                    if let Some(g) = gate {
                        *before = Some(match *before {
                            None => g,
                            Some(b) => {
                                let sum = self.node(self.template_of(k), NodeKind::Read);
                                self.read(sum, b);
                                self.read(sum, g);
                                sum
                            }
                        });
                    }
                    self.numbers(k, None, &mut None);
                }
                _ => self.numbers(k, None, &mut None),
            }
        }
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
            Some(g) => {
                let product = self.node(t, NodeKind::Read);
                self.read(product, g);
                self.read(product, x);
                product
            }
        }
    }
}

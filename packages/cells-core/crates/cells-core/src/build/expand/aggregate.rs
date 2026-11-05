//! Aggregates: the ports whose plan is an operator over a collection of
//! components around the element, materialized from the tree the build
//! stamped: a collect's gathered children and their count, the document's
//! and each section's credit, and each section's number.
//!
//! Every case of a reactive choice is built, so each inactive case
//! contributes through a *gate*, the product of the `active` cells of the
//! cases around it. `hide` gates nothing.
//!
//! **Credit**: the document and each section that aggregates scores hold
//! the weighted mean of their scored items' credit (answers and
//! aggregating sections, looking through sections that do not aggregate),
//! each weight multiplied by its gate. With no weight the credit is 1.
//!
//! **Numbers**: a section's `number` is 1 plus the gates of the sections
//! before it among its siblings, counted through the containers expanded
//! in place (choices, cases, groups, repeats, collects).
//!
//! **Gathered**: a collect's children are copies of the components of its
//! type under what it gathers from, and its count is how many.
//!
//! A collection that crosses a repeat makes the aggregate a *counted
//! value*.

use super::*;

/// Most items one `WeightedMean` reads: weights and credits share
/// `MAX_VEC_IN` inputs.
use crate::limits::SCORE_CHUNK as CHUNK;

use crate::components::AggOp;
use crate::components::prop::{answer, document, section};
use section::{AGGREGATE, CREDIT, NUMBER, PERCENT_CREDIT, WEIGHT};

// The document's credit props sit where a section's do.
const _: () = assert!(document::CREDIT == CREDIT && document::PERCENT_CREDIT == PERCENT_CREDIT);

impl<'c> Builder<'c> {
    /// Materialize the document's and every section's `creditAchieved`
    /// and `percentCreditAchieved`, and every section's `number`: the
    /// aggregates over the scored items and the sibling sections. Runs
    /// after every other prop has its source.
    pub(in crate::build) fn aggregate_sources(&mut self) {
        let root = self.root;
        self.set_credit(root);
        for c in CompIdx::below(self.components.len()) {
            if self.components.component_type[c.index()] == ComponentType::Section {
                if self.aggregates(c) {
                    self.set_credit(c);
                } else {
                    self.set_constant_credit(c, 0.0);
                }
            }
        }
        let mut counter = Counter::default();
        self.number_sections(root, None, &mut counter);
    }

    /// `creditAchieved` of the document or an aggregating section.
    fn set_credit(&mut self, c: CompIdx) {
        let (s, p) = (self.slot(c, CREDIT), self.slot(c, PERCENT_CREDIT));
        let mut items = Vec::new();
        self.scored_items(c, None, &mut items);
        // With a scored item in a repeat below `c`, there is none at some
        // count: the credit is then a counted value (ADR 0028), which the
        // abstract build, whose one iteration stands for every count,
        // records.
        if self.view.folds_iterations() {
            let depth = |b: &Self, scope| b.enclosing_repeats(scope).len();
            let at = depth(self, self.components.scope[c.index()]);
            let found = items
                .iter()
                .any(|&(_, credit)| depth(self, self.slot_scope[credit.index()]) > at);
            self.is_counted(s, found);
            self.is_counted(p, found);
        }
        match self.mean_credit(c, items) {
            Some(mean) => {
                self.fill_aggregate(s, AggOp::Credit, BuiltSource::Alias(mean));
                let hundred = self.const_slot(100.0);
                let percent = self.op_source(OpSpec::Mul, &[s, hundred]);
                self.fill_aggregate(p, AggOp::PercentCredit, percent);
            }
            None => {
                // Nothing to score: full credit.
                let credit = self.counted(s, 1.0, false);
                self.fill_aggregate(s, AggOp::Credit, credit);
                let percent = self.counted(p, 100.0, false);
                self.fill_aggregate(p, AggOp::PercentCredit, percent);
            }
        }
    }

    /// Set a credit that cannot change, and its percentage, as constants.
    fn set_constant_credit(&mut self, c: CompIdx, credit: f64) {
        let (s, p) = (self.slot(c, CREDIT), self.slot(c, PERCENT_CREDIT));
        self.fill_aggregate(s, AggOp::Credit, BuiltSource::Const(credit));
        self.fill_aggregate(p, AggOp::PercentCredit, BuiltSource::Const(100.0 * credit));
    }

    fn aggregates(&self, section: CompIdx) -> bool {
        matches!(self.sources[self.slot(section, AGGREGATE).index()], BuiltSource::Const(v) if v != 0.0)
    }

    fn component_children(&self, c: CompIdx) -> Vec<CompIdx> {
        let (s, n) = (
            self.components.child_start[c.index()] as usize,
            self.components.child_count[c.index()] as usize,
        );
        self.components.child_list[s..s + n]
            .iter()
            .filter_map(|e| e.as_comp())
            .collect()
    }

    /// `gate` times a case's `active` cell.
    fn gate_through(&mut self, gate: Option<SlotId>, case: CompIdx) -> Option<SlotId> {
        let active = self.slot(case, crate::components::prop::case::ACTIVE);
        Some(self.gated(gate, active, self.components.scope[case.index()]))
    }

    /// The weighted mean of `items`, the scored items inside `c`; None
    /// when there are none.
    fn mean_credit(&mut self, c: CompIdx, mut items: Vec<(SlotId, SlotId)>) -> Option<SlotId> {
        if items.is_empty() {
            return None;
        }
        let scope = self.components.scope[c.index()];
        // Chunks of at most `CHUNK`; each level's means and totals are the
        // next level's credits and weights.
        loop {
            let mut next = Vec::with_capacity(items.len().div_ceil(CHUNK));
            for chunk in items.chunks(CHUNK) {
                let inputs: Vec<SlotId> = chunk
                    .iter()
                    .map(|&(w, _)| w)
                    .chain(chunk.iter().map(|&(_, c)| c))
                    .collect();
                let source = self.op_source(
                    OpSpec::Vec(VecOp::WeightedMean {
                        n: byte(chunk.len()),
                    }),
                    &inputs,
                );
                let mean = self.anon_slot(source, scope);
                let total = self.anon_slot(BuiltSource::VecOut(mean, 1), scope);
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
    fn scored_items(&mut self, c: CompIdx, gate: Option<SlotId>, out: &mut Vec<(SlotId, SlotId)>) {
        for k in self.component_children(c) {
            let scope = self.components.scope[k.index()];
            let (weight, credit) = match self.components.component_type[k.index()] {
                ComponentType::Setup => continue,
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, out);
                    continue;
                }
                ComponentType::Answer => {
                    // A blank response checks as NaN; it is no credit.
                    let checked = self.slot(k, answer::CREDIT);
                    let zero = self.const_slot(0.0);
                    let credit = self.op_slot(OpSpec::NanTo, &[checked, zero], scope);
                    (self.slot(k, answer::WEIGHT), credit)
                }
                ComponentType::Section if self.aggregates(k) => {
                    (self.slot(k, WEIGHT), self.slot(k, CREDIT))
                }
                _ => {
                    self.scored_items(k, gate, out);
                    continue;
                }
            };
            let weight = self.gated(gate, weight, scope);
            out.push((weight, credit));
        }
    }

    /// Number the sections inside repeat (or collect from repeats) `r`,
    /// among the children counted by `counter`. A section counted inside
    /// makes the numbers after `r` follow its count; one whose number
    /// follows a count inside `r` makes every number inside `r` follow.
    fn number_through_repeat(&mut self, r: CompIdx, gate: Option<SlotId>, counter: &mut Counter) {
        let (known, before, follows) = (counter.known, counter.before, counter.follows);
        let start = counter.numbered.len();
        self.number_sections(r, gate, counter);
        if counter.follows && !follows {
            for i in start..counter.numbered.len() {
                let s = counter.numbered[i];
                self.is_counted(s, true);
            }
        }
        if counter.known != known || counter.before != before {
            counter.follows = true;
        }
    }

    /// Number the sections among the children of `c`, counting through the
    /// containers expanded in place; `gate` is the product
    /// of the cases between `c` and the component whose children are being
    /// counted.
    fn number_sections(&mut self, c: CompIdx, gate: Option<SlotId>, counter: &mut Counter) {
        for k in self.component_children(c) {
            match self.components.component_type[k.index()] {
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.number_sections(k, g, counter);
                }
                ComponentType::RepeatForSequence | ComponentType::RepeatFor => {
                    self.number_through_repeat(k, gate, counter)
                }
                ComponentType::Collect if self.follows_counts.contains(&k) => {
                    self.number_through_repeat(k, gate, counter)
                }
                ComponentType::ConditionalContent
                | ComponentType::Select
                | ComponentType::Group
                | ComponentType::Collect => self.number_sections(k, gate, counter),
                ComponentType::Section => {
                    let s = self.slot(k, NUMBER);
                    let number = match counter.before {
                        None => self.counted(s, counter.known + 1.0, counter.follows),
                        Some(b) => {
                            self.is_counted(s, counter.follows);
                            let k = self.const_slot(counter.known + 1.0);
                            self.op_source(OpSpec::Add, &[b, k])
                        }
                    };
                    counter.numbered.push(s);
                    self.fill_aggregate(s, AggOp::Count, number);
                    match gate {
                        None => counter.known += 1.0,
                        Some(g) => {
                            counter.before = Some(match counter.before {
                                None => g,
                                Some(b) => self.op_slot(
                                    OpSpec::Add,
                                    &[b, g],
                                    self.components.scope[k.index()],
                                ),
                            })
                        }
                    }
                    self.number_sections(k, None, &mut Counter::default());
                }
                _ => self.number_sections(k, None, &mut Counter::default()),
            }
        }
    }

    /// Expand a collect (a polyline): its children are copies of what it
    /// gathers, and its count is how many.
    pub(in crate::build) fn expand_collect(&mut self, comp: CompIdx) -> Result<()> {
        let inst = self.instances[self.comp_instance[comp.index()].index()];
        let tpl = &self.compiled.templates[inst.template.index()];
        let Body::Collect { component_type } = tpl.row(inst.elem).body else {
            unreachable!()
        };
        let from = tpl
            .plan(inst.elem)
            .from
            .expect("planning gave a collect its `from`");
        let (target, _) = self.resolve(from, inst.scope)?;
        let mut found = Vec::new();
        match target {
            Resolved::Comp(c) => self.collect_descendants(c, component_type, &mut found),
            Resolved::Iter(repeat, s) => {
                for c in self.iteration_components(repeat, s) {
                    if self.components.component_type[c.index()] == component_type {
                        found.push(c);
                    } else {
                        self.collect_descendants(c, component_type, &mut found);
                    }
                }
            }
            Resolved::Missing => {}
            Resolved::Chosen { .. } => {
                return Err(Error::Unsupported(
                    "<collect from> cannot be indexed by a cell".into(),
                ));
            }
        }
        let mut copies = Vec::with_capacity(found.len());
        for &c in &found {
            // Created without a type so `copy_into` allocates the slots once.
            let copy = self.new_component(
                ComponentType::Document,
                StrId::NONE,
                comp,
                NodeId::NONE,
                inst.scope,
                0,
            );
            self.copy_into(copy, c);
            copies.push(copy);
        }
        let entries: Vec<ChildEntry> = copies.iter().map(|&c| ChildEntry::comp(c)).collect();
        self.set_children(comp, &entries);
        let s0 = self.slot(comp, prop::collect::COUNT);
        let counts = match self.view.collect_count() {
            CollectCount::Gathered => Vec::new(),
            CollectCount::RepeatCounts => self.gathered_counts(&found),
        };
        // With no gathered original in an iteration, the number gathered is
        // a constant at every count. Otherwise it is a counted value: the
        // abstract build stands it in by its repeats' counts, and every
        // other build holds the number it gathered (ADR 0028).
        let count = if counts.is_empty() {
            let count = self.counted(s0, copies.len() as f64, false);
            if matches!(count, BuiltSource::Op(..)) {
                self.follows_counts.insert(comp);
            }
            count
        } else {
            self.is_counted(s0, true);
            self.follows_counts.insert(comp);
            self.reads(&counts, inst.scope)
        };
        self.fill_aggregate(s0, AggOp::Count, count);
        self.collected.insert(comp, copies);
        Ok(())
    }

    /// The count slots of the repeats whose iterations hold one of `found`.
    fn gathered_counts(&self, found: &[CompIdx]) -> Vec<SlotId> {
        let mut counts: Vec<SlotId> = Vec::new();
        for &c in found {
            for r in self.enclosing_repeats(self.components.scope[c.index()]) {
                let pi = self.components.component_type[r.index()]
                    .count_prop()
                    .expect("a repeat has a count");
                let s = self.slot(r, pi);
                if !counts.contains(&s) {
                    counts.push(s);
                }
            }
        }
        counts
    }

    /// Wire `s`, a slot its plan aggregates by `op`, once the tree is built.
    /// Only such a slot, and only once.
    fn fill_aggregate(&mut self, s: SlotId, op: AggOp, source: BuiltSource) {
        let comp = self.slot_comp[s.index()];
        let aggregate = comp != CompIdx::NONE && {
            let i = self.comp_instance[comp.index()];
            !i.is_none() && {
                let inst = self.instances[i.index()];
                let pi = s.index() - self.slot_base[comp.index()].index();
                matches!(
                    self.compiled.templates[inst.template.index()].plan(inst.elem)
                        .props
                        .get(pi),
                    Some(Source::Flow(Flow::Aggregate(a))) if a.op == op
                )
            }
        };
        assert!(
            aggregate && matches!(self.sources[s.index()], BuiltSource::Unset),
            "{} is not a slot left to wire as {op:?}",
            self.slot_label(s)
        );
        self.sources[s.index()] = source;
    }
}

/// Sections counted so far among one component's flattened children: a
/// constant count of those outside any case, plus a cell summing the gates
/// of the rest.
#[derive(Default)]
struct Counter {
    known: f64,
    before: Option<SlotId>,
    /// A section was counted in a repeat (or a collect from one) before
    /// the next one, so its number follows the counts.
    follows: bool,
    /// The number slots counted so far.
    numbered: Vec<SlotId>,
}

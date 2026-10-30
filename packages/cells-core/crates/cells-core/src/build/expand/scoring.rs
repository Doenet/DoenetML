//! Credit and section numbers: cells wired from the expanded tree.
//!
//! Both follow the current core, where a reactive choice's inactive cases
//! are not components at all: an answer in an inactive case is not scored
//! and a section in one takes no number. Here every case is built, so each
//! inactive case contributes through a *gate*, the product of the `active`
//! cells of the cases around it. A flip changes gates, then credits and
//! numbers, on an ordinary tick. `hide` gates nothing, as in the current
//! core.
//!
//! **Credit.** The document and each section that aggregates scores hold
//! the weighted mean of their scored items' credit: the answers and
//! aggregating sections inside them, looking through sections that do not
//! aggregate (whose own credit is 0). An item's weight is multiplied by its
//! gate. With no weight (nothing scored, or nothing active) the credit is 1.
//!
//! **Numbers.** A section's `number` is 1 plus the gates of the sections
//! before it among its siblings, where siblings are counted through the
//! containers the current core expands in place (choices, cases, groups,
//! repeats, collects). A full number such as 2.1 is read from the `number`
//! cells of the section and its section ancestors (`Document::section_number`).

use super::*;

/// Most items one `WeightedMean` reads: weights and credits share
/// `MAX_VEC_IN` inputs.
use crate::limits::SCORE_CHUNK as CHUNK;

use crate::components::prop::{answer, document, section};
use section::{AGGREGATE, CREDIT, NUMBER, PERCENT_CREDIT, WEIGHT};

// The document's credit props sit where a section's do.
const _: () = assert!(document::CREDIT == CREDIT && document::PERCENT_CREDIT == PERCENT_CREDIT);

impl<'c> Builder<'c> {
    /// Wire the document's and every section's `creditAchieved` and
    /// `percentCreditAchieved`, and every section's `number`: the slots
    /// their plans defer (`Source::Deferred`). Runs after every other
    /// prop has its source.
    pub(in crate::build) fn scoring_sources(&mut self) {
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
        // count: the credit is then a counted value (ADR 0027), which the
        // probe, whose one iteration stands for every count, records.
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
                self.fill_deferred(s, Deferred::Credit, BuiltSource::Alias(mean));
                let hundred = self.const_slot(100.0);
                let percent = self.op_source(OpSpec::Mul, &[s, hundred]);
                self.fill_deferred(p, Deferred::PercentCredit, percent);
            }
            None => {
                // Nothing to score: full credit.
                let credit = self.counted(s, 1.0, false);
                self.fill_deferred(s, Deferred::Credit, credit);
                let percent = self.counted(p, 100.0, false);
                self.fill_deferred(p, Deferred::PercentCredit, percent);
            }
        }
    }

    /// A credit that cannot change, and its percentage, as constants: a
    /// document with nothing to score costs no instruction.
    fn set_constant_credit(&mut self, c: CompIdx, credit: f64) {
        let (s, p) = (self.slot(c, CREDIT), self.slot(c, PERCENT_CREDIT));
        self.fill_deferred(s, Deferred::Credit, BuiltSource::Const(credit));
        self.fill_deferred(
            p,
            Deferred::PercentCredit,
            BuiltSource::Const(100.0 * credit),
        );
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
    /// follows a count inside `r` makes every number inside `r` follow, since
    /// a later iteration counts it before them.
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
    /// containers the current core expands in place; `gate` is the product
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
                    self.fill_deferred(s, Deferred::SectionNumber, number);
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
}

/// Sections counted so far among one component's flattened children: a
/// constant count of those outside any case, plus a cell summing the gates
/// of the rest.
#[derive(Default)]
struct Counter {
    known: f64,
    before: Option<SlotId>,
    /// A section was counted in a repeat (or a collect from one) before
    /// the next one: its number follows the counts, a counted value (ADR
    /// 0026). Found in the probe, whose one iteration stands for every
    /// count; another build reads the probe's record.
    follows: bool,
    /// The number slots counted so far.
    numbered: Vec<SlotId>,
}

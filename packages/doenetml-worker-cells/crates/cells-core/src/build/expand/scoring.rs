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
const CHUNK: usize = crate::program::MAX_VEC_IN / 2;

use crate::components::prop::{answer, document, section};
use section::{AGGREGATE, CREDIT, NUMBER, PERCENT_CREDIT, WEIGHT};

// The document's credit props sit where a section's do.
const _: () = assert!(document::CREDIT == CREDIT && document::PERCENT_CREDIT == PERCENT_CREDIT);

impl<'c, 'a> Builder<'c, 'a> {
    /// Wire the document's and every section's `creditAchieved`, and every
    /// section's `number`. Runs after every prop has its source, replacing
    /// the placeholders the planner left.
    pub(in crate::build) fn scoring_sources(&mut self) {
        let root = self.root;
        self.set_credit(root);
        for c in 0..self.components.len() as CompIdx {
            if self.components.component_type[c as usize] == ComponentType::Section {
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
        match self.mean_credit(c) {
            Some(mean) => {
                let s = self.slot(c, CREDIT);
                self.sources[s as usize] = Source::Alias(mean);
            }
            None => self.set_constant_credit(c, 1.0),
        }
    }

    /// A credit that cannot change, and its percentage, as constants: a
    /// document with nothing to score costs no instruction.
    fn set_constant_credit(&mut self, c: CompIdx, credit: f64) {
        let (s, p) = (self.slot(c, CREDIT), self.slot(c, PERCENT_CREDIT));
        self.sources[s as usize] = Source::Fixed(credit);
        self.sources[p as usize] = Source::Fixed(100.0 * credit);
    }

    fn aggregates(&self, section: CompIdx) -> bool {
        matches!(self.sources[self.slot(section, AGGREGATE) as usize], Source::Fixed(v) if v != 0.0)
    }

    fn component_children(&self, c: CompIdx) -> Vec<CompIdx> {
        let (s, n) = (
            self.components.child_start[c as usize] as usize,
            self.components.child_count[c as usize] as usize,
        );
        self.components.child_list[s..s + n]
            .iter()
            .copied()
            .filter(|&e| e & TEXT_BIT == 0)
            .collect()
    }

    /// `gate` times a case's `active` cell.
    fn gate_through(&mut self, gate: Option<SlotId>, case: CompIdx) -> Option<SlotId> {
        let active = self.slot(case, crate::components::prop::case::ACTIVE);
        Some(self.gated(gate, active))
    }

    /// The weighted mean of the scored items inside `c`; None when there
    /// are none.
    fn mean_credit(&mut self, c: CompIdx) -> Option<SlotId> {
        let mut items = Vec::new();
        self.scored_items(c, None, &mut items);
        if items.is_empty() {
            return None;
        }
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
                        n: chunk.len() as u8,
                    }),
                    &inputs,
                );
                let mean = self.anon_slot(source);
                let total = self.anon_slot(Source::VecOut(mean, 1));
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
            let (weight, credit) = match self.components.component_type[k as usize] {
                ComponentType::Setup => continue,
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, out);
                    continue;
                }
                ComponentType::Answer => {
                    // A blank response checks as NaN; it is no credit.
                    let checked = self.slot(k, answer::CREDIT);
                    let credit = self.op_slot(OpSpec::NanTo { k: 0.0 }, &[checked]);
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
            let weight = self.gated(gate, weight);
            out.push((weight, credit));
        }
    }

    /// Number the sections among the children of `c`, counting through the
    /// containers the current core expands in place; `gate` is the product
    /// of the cases between `c` and the component whose children are being
    /// counted.
    fn number_sections(&mut self, c: CompIdx, gate: Option<SlotId>, counter: &mut Counter) {
        for k in self.component_children(c) {
            match self.components.component_type[k as usize] {
                ComponentType::Case => {
                    let g = self.gate_through(gate, k);
                    self.number_sections(k, g, counter);
                }
                ComponentType::ConditionalContent
                | ComponentType::Select
                | ComponentType::Group
                | ComponentType::RepeatForSequence
                | ComponentType::RepeatFor
                | ComponentType::Collect => self.number_sections(k, gate, counter),
                ComponentType::Section => {
                    let number = match counter.before {
                        None => Source::Fixed(counter.fixed + 1.0),
                        Some(b) => self.op_source(
                            OpSpec::Offset {
                                k: counter.fixed + 1.0,
                            },
                            &[b],
                        ),
                    };
                    let s = self.slot(k, NUMBER);
                    self.sources[s as usize] = number;
                    match gate {
                        None => counter.fixed += 1.0,
                        Some(g) => {
                            counter.before = Some(match counter.before {
                                None => g,
                                Some(b) => self.op_slot(OpSpec::Add, &[b, g]),
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
    fixed: f64,
    before: Option<SlotId>,
}

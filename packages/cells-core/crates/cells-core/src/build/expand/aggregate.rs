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
//! in place, whatever its type says is structure ([`StructureKind`]:
//! choices, cases, groups, repeats, collects), and through the containers
//! the divisions' sequence passes through (a `<div>`). A list item (a
//! `<part>`, a `<problems>`'s problem) is numbered among its parent's
//! sectioning children instead, through the structure only (ADR 0054).
//!
//! **Gathered**: a collect's children are copies of the components of its
//! type under what it gathers from, and its count is how many.
//!
//! A collection that crosses a repeat makes the aggregate a *counted
//! value*.

use super::*;

/// Most items one [`WeightedMean`] reads: weights and credits share
/// `MAX_VEC_IN` inputs.
use crate::limits::SCORE_CHUNK as CHUNK;

use crate::components::{AggOp, Collection, Numbering, Scored};

/// Expand, aggregates: a collect's gathered children and count, credit and
/// section numbers, materialized from the tree the build stamped.
impl<'c> Builder<'c> {
    /// Materialize the document's and every section's `creditAchieved`
    /// and `percentCreditAchieved`, and every section's `number`: the
    /// aggregates over the scored items and the sibling sections. Runs
    /// after every other prop has its source.
    pub(in crate::build) fn aggregate_sources(&mut self) {
        let root = self.root;
        // A root boxed for an error of its own holds no credit.
        if self.components.component_type[root.index()]
            .aggregate_prop(AggOp::Credit, Collection::ScoredItems)
            .is_some()
        {
            self.set_credit(root);
        }
        for c in CompIdx::below(self.components.len()) {
            if let Some(Scored::Aggregates { .. }) =
                self.components.component_type[c.index()].scored()
            {
                if self.aggregates(c) {
                    self.set_credit(c);
                } else {
                    self.set_constant_credit(c, 0.0);
                }
            }
        }
        let mut seq = self.fresh_seq(root);
        self.number_sections(root, None, &mut seq);
    }

    /// The slots of `c`'s credit and its percentage: the props its type
    /// declares as those aggregates over its scored items.
    fn credit_slots(&self, c: CompIdx) -> (SlotId, SlotId) {
        let ty = self.components.component_type[c.index()];
        let at = |op| {
            ty.aggregate_prop(op, Collection::ScoredItems)
                .expect("credit aggregated over scored items")
        };
        (
            self.slot(c, at(AggOp::Credit)),
            self.slot(c, at(AggOp::PercentCredit)),
        )
    }

    /// `creditAchieved` of the document or an aggregating section.
    fn set_credit(&mut self, c: CompIdx) {
        let (s, p) = self.credit_slots(c);
        let mut items = Vec::new();
        self.scored_items(c, None, &mut items);
        match self.mean_credit(c, items) {
            Some(mean) => {
                self.fill_aggregate(s, AggOp::Credit, BuiltSource::Alias(mean));
                let hundred = self.const_slot(100.0);
                let percent = self.op_source(OpSpec::Mul, &[s, hundred]);
                self.fill_aggregate(p, AggOp::PercentCredit, percent);
            }
            None => {
                // Nothing to score: full credit, a counted value (ADR 0028)
                // when a repeat below `c` holds a scored item at some count.
                let credit = self.counted(s, 1.0);
                self.fill_aggregate(s, AggOp::Credit, credit);
                let percent = self.counted(p, 100.0);
                self.fill_aggregate(p, AggOp::PercentCredit, percent);
            }
        }
    }

    /// Set a credit that cannot change, and its percentage, as constants.
    fn set_constant_credit(&mut self, c: CompIdx, credit: f64) {
        let (s, p) = self.credit_slots(c);
        self.fill_aggregate(s, AggOp::Credit, BuiltSource::Const(credit));
        self.fill_aggregate(p, AggOp::PercentCredit, BuiltSource::Const(100.0 * credit));
    }

    /// Whether `section` aggregates the credit of what it holds: its flag
    /// ([`Scored::Aggregates`]) is a constant, not zero.
    fn aggregates(&self, section: CompIdx) -> bool {
        let Some(Scored::Aggregates { when, .. }) =
            self.components.component_type[section.index()].scored()
        else {
            return false;
        };
        matches!(self.sources[self.slot(section, when).index()], BuiltSource::Const(v) if v != 0.0)
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

    /// `gate`, times `k`'s `active` cell when `k` is a gate
    /// ([`StructureKind::Gate`]).
    fn gate_through(&mut self, gate: Option<SlotId>, k: CompIdx) -> Option<SlotId> {
        let Some(active) = self.components.component_type[k.index()].gate_prop() else {
            return gate;
        };
        let active = self.slot(k, active);
        Some(self.gated(gate, active, self.components.scope[k.index()]))
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
            let (weight, credit) = match self.components.component_type[k.index()].scored() {
                Some(Scored::Skip) => continue,
                Some(Scored::Item { credit, weight }) => {
                    // A blank response checks as NaN; it is no credit.
                    let checked = self.slot(k, credit);
                    let zero = self.const_slot(0.0);
                    let credit = self.op_slot(OpSpec::NanTo, &[checked, zero], scope);
                    (self.slot(k, weight), credit)
                }
                Some(Scored::Aggregates { weight, .. }) if self.aggregates(k) => {
                    (self.slot(k, weight), self.credit_slots(k).0)
                }
                _ => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, out);
                    continue;
                }
            };
            let weight = self.gated(gate, weight, scope);
            out.push((weight, credit));
        }
    }

    /// Number the sections inside repeat (or collect from repeats) `r`,
    /// among the children counted by `seq`. A section counted inside
    /// makes the numbers after `r` follow its count; one whose number
    /// follows a count inside `r` makes every number inside `r` follow.
    fn number_through_repeat(&mut self, r: CompIdx, gate: Option<SlotId>, seq: &mut Seq) {
        let div = Mark::of(&seq.div);
        let items = seq.items.as_ref().map(|i| Mark::of(&i.counter));
        self.number_sections(r, gate, seq);
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
            for i in mark.start..counter.numbered.len() {
                let s = counter.numbered[i];
                self.is_counted(s);
            }
        }
        if counter.known != mark.known || counter.before != mark.before {
            counter.follows = true;
        }
    }

    /// The sequences `c` numbers its children in, from 1: the divisions',
    /// and its list items' when one of its children is one (ADR 0054).
    fn fresh_seq(&self, c: CompIdx) -> Seq {
        let as_list = self.numbered_flag(c, |n| n.as_list);
        Seq {
            div: Counter::default(),
            items: (as_list || self.has_list_item(c)).then(Items::default),
            as_list,
        }
    }

    /// Whether `c`'s type declares the constant 0/1 prop `prop` of its
    /// [`Numbered`](crate::components::Numbered), and it is on.
    fn numbered_flag(
        &self,
        c: CompIdx,
        prop: fn(&crate::components::Numbered) -> Option<usize>,
    ) -> bool {
        let Some(n) = self.components.component_type[c.index()].def().numbered else {
            return false;
        };
        prop(&n).is_some_and(
            |p| matches!(self.sources[self.slot(c, p).index()], BuiltSource::Const(v) if v != 0.0),
        )
    }

    /// Whether a child of `c`, looked through the structure, is always a
    /// list item (a `<part>`).
    fn has_list_item(&self, c: CompIdx) -> bool {
        self.component_children(c).into_iter().any(|k| {
            if self.components.component_type[k.index()].passes_list_items() {
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
    fn number_sections(&mut self, c: CompIdx, gate: Option<SlotId>, seq: &mut Seq) {
        for k in self.component_children(c) {
            let ty = self.components.component_type[k.index()];
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
                    self.number_sections(k, g, seq);
                    if let (Some(i), Some(ig)) = (seq.items.as_mut(), items_gate) {
                        i.gate = ig;
                    }
                }
                Some(StructureKind::Repeat { .. }) => self.number_through_repeat(k, gate, seq),
                // A collect that follows the counts of the repeats it
                // gathers from.
                Some(StructureKind::Transparent { .. }) if self.follows_counts.contains(&k) => {
                    self.number_through_repeat(k, gate, seq)
                }
                Some(StructureKind::Transparent { .. }) => self.number_sections(k, gate, seq),
                // A page: both sequences continue through it (ADR 0058).
                None if ty.numbering() == Some(Numbering::PassesBoth) => {
                    self.number_sections(k, gate, seq)
                }
                None if ty.numbering() == Some(Numbering::PassesDivisions) => {
                    // The divisions inside continue the sequence; the list
                    // items inside are counted among themselves.
                    let inner = self.fresh_seq(k);
                    let items = std::mem::replace(&mut seq.items, inner.items);
                    let as_list = std::mem::replace(&mut seq.as_list, false);
                    self.number_sections(k, gate, seq);
                    seq.items = items;
                    seq.as_list = as_list;
                }
                None if ty.numbering() == Some(Numbering::Unnumbered) => {
                    // A proof: a list item with no number, which bounds both.
                    let scope = self.components.scope[k.index()];
                    if let Some(i) = seq.items.as_mut() {
                        let gate = i.gate;
                        self.advance(&mut i.counter, gate, scope);
                    }
                    let mut inner = self.fresh_seq(k);
                    self.number_sections(k, None, &mut inner);
                }
                None if ty
                    .aggregate_prop(AggOp::Count, Collection::SectionsThrough)
                    .is_some() =>
                {
                    let number = ty.aggregate_prop(AggOp::Count, Collection::SectionsThrough);
                    let s = self.slot(k, number.expect("a numbered section"));
                    let scope = self.components.scope[k.index()];
                    let list_item = seq.as_list || self.numbered_flag(k, |n| n.list_item);
                    // A list item is numbered among the list items, and
                    // takes its place among the divisions all the same, as
                    // in the current core.
                    match seq.items.as_mut() {
                        Some(i) if list_item => {
                            let item_gate = i.gate;
                            self.take_number(&mut i.counter, s, item_gate, scope);
                            self.advance(&mut seq.div, gate, scope);
                        }
                        _ => {
                            self.take_number(&mut seq.div, s, gate, scope);
                            if let Some(i) = seq.items.as_mut() {
                                let item_gate = i.gate;
                                self.advance(&mut i.counter, item_gate, scope);
                            }
                        }
                    }
                    let mut inner = self.fresh_seq(k);
                    self.number_sections(k, None, &mut inner);
                }
                _ => {
                    let mut inner = self.fresh_seq(k);
                    self.number_sections(k, None, &mut inner);
                }
            }
        }
    }

    /// Wire `s`, a section's `number`, as the next number `counter` gives,
    /// and count it, behind `gate`.
    fn take_number(
        &mut self,
        counter: &mut Counter,
        s: SlotId,
        gate: Option<SlotId>,
        scope: ScopeId,
    ) {
        let number = match counter.before {
            None => self.counted(s, counter.known + 1.0),
            Some(b) => {
                self.is_counted(s);
                let k = self.const_slot(counter.known + 1.0);
                self.op_source(OpSpec::Add, &[b, k])
            }
        };
        counter.numbered.push(s);
        self.fill_aggregate(s, AggOp::Count, number);
        self.advance(counter, gate, scope);
    }

    /// Count one more item in `counter`, behind `gate`.
    fn advance(&mut self, counter: &mut Counter, gate: Option<SlotId>, scope: ScopeId) {
        match gate {
            None => counter.known += 1.0,
            Some(g) => {
                counter.before = Some(match counter.before {
                    None => g,
                    Some(b) => self.op_slot(OpSpec::Add, &[b, g], scope),
                })
            }
        }
    }

    /// Expand a collect (a polyline): its children are copies of what it
    /// gathers, and its count is how many.
    pub(in crate::build) fn expand_collect(&mut self, comp: CompIdx) -> Result<()> {
        let inst = self.instances[self.comp_instance[comp.index()].index()];
        let tpl = &self.compiled.plans.templates[inst.template.index()];
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
            // Created without a type, the root standing in, so `copy_into`
            // allocates the slots once.
            let copy = self.new_component(
                Role::Root.ty(),
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
        let ty = self.components.component_type[comp.index()];
        let count = ty
            .aggregate_prop(AggOp::Count, Collection::Gathered)
            .expect("a collect counts what it gathers");
        let s0 = self.slot(comp, count);
        // With no gathered original in an iteration, the number gathered is
        // a constant at every count. Otherwise it is a counted value, which
        // holds the number gathered (ADR 0028).
        let count = self.counted(s0, copies.len() as f64);
        if matches!(count, BuiltSource::Op(..)) {
            self.follows_counts.insert(comp);
        }
        self.fill_aggregate(s0, AggOp::Count, count);
        self.collected.insert(comp, copies);
        Ok(())
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
                    self.compiled.plans.templates[inst.template.index()].plan(inst.elem)
                        .props
                        .get(pi),
                    Some(Source::Flow(Flow::Aggregate(a))) if a.op == op
                )
            }
        };
        assert!(
            aggregate && matches!(self.sources[s.index()], BuiltSource::Unset),
            "{} is not a slot left to wire as {op:?}",
            self.slots().slot_label(s)
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

/// Where a [`Counter`] stood before a repeat.
#[derive(Clone, Copy)]
struct Mark {
    known: f64,
    before: Option<SlotId>,
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
/// product of the cases between it and the child being counted: a
/// container the divisions pass through bounds the list items, so the two
/// sequences can sit behind different cases.
#[derive(Default)]
struct Items {
    counter: Counter,
    gate: Option<SlotId>,
}

/// The two sequences one component numbers its children in (ADR 0054):
/// the divisions', and its list items' when it has any.
struct Seq {
    div: Counter,
    items: Option<Items>,
    /// Its sectioning children are its list's items.
    as_list: bool,
}

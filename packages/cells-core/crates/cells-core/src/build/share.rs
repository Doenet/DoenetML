//! Equal computations share one cell (ADR 0033). Two defining slots are
//! equal when they apply the same operator to the same input cells, or
//! are the same output of two equal vector heads; emit merges them as it
//! merges aliases, to a fixpoint, before it numbers the cells, so the
//! walks, the folding and the numbering all see the merged cells. The
//! kept definition of a merged cell is its lowest slot, so the choice is
//! the same in every build that stamps the same elements in the same
//! order.
//!
//! Two equal slots merge only when the cells they make would carry the
//! same request marks (`interactive`, written by an action), the same hold
//! flags (ADR 0022), the same value types, and the same orientation
//! (an operator of the author's math, ADR 0026, or not): a merge then
//! changes no cell's marks, holds or type, and a request on a merged cell
//! inverts through the kept instruction to the same inputs either one
//! read. A leaf (a given value, a constant) is never merged, and neither
//! is a counted value (ADR 0028), nor a slot with another source in later
//! iterations, which the abstract build folds into one.
//!
//! Merging never makes a cycle: two equal slots read the same cells, so
//! any path through the merged cell was a path through one of them.

use super::*;

/// What a defining slot computes, up to what a bucket can hash: the
/// operator's kind, or the vector head and position of an output.
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
enum What {
    Spec(std::mem::Discriminant<OpSpec>),
    VecOut(SlotId, u8),
}

/// The hashable part of a defining slot's computation and of what its
/// cell carries; two slots in one bucket are equal when their operators
/// are (`Builder::same_op`).
#[derive(Clone, PartialEq, Eq, Hash)]
struct Bucket {
    what: What,
    /// The input cells, by their roots, in order.
    inputs: Vec<SlotId>,
    /// The class's request marks, types and orientation (`Carried`).
    carried: Carried,
    /// The class's hold flags, by their roots, sorted and deduplicated.
    flags: Vec<SlotId>,
    /// A vector head's outputs: each position with what its class
    /// carries and its flags. Two heads merge only when their outputs
    /// would too, since a merged head's outputs share cells.
    outs: Vec<(u8, Carried, Vec<SlotId>)>,
}

/// What a class of slots carries that a merge must not change, as bits:
/// whether a slot of it is a prop a renderer may request, one an action
/// writes, an operator of the author's math, and the value types its slots
/// were given.
#[derive(Clone, Copy, Default, PartialEq, Eq, Hash)]
struct Carried(u8);

impl Carried {
    const INTERACTIVE: u8 = 1;
    const ACTION: u8 = 2;
    const AUTHOR: u8 = 4;
    const NUMBER: u8 = 8;
    const TEXT: u8 = 16;
    const MATH: u8 = 32;

    fn of_type(ty: ValueType) -> u8 {
        match ty {
            ValueType::Number => Self::NUMBER,
            ValueType::Text => Self::TEXT,
            ValueType::Math => Self::MATH,
        }
    }
}

impl<'c> Builder<'c> {
    /// Merge equal defining slots into one cell (ADR 0033): `uf` holds the
    /// alias union-find and gains the merges; `def` names each cell's
    /// defining slot by its root, and is kept so after each merge, with
    /// the lower of the two. Repeats until a round merges nothing.
    pub(in crate::build) fn share(&self, uf: &mut UnionFind, def: &mut [SlotId]) {
        let n = self.sources.len();
        // What each class carries, by its root. Only equal classes merge,
        // so a merged class carries what each did, and these are moved to
        // the new root as they are.
        let mut carried = vec![Carried::default(); n];
        let mut excluded = vec![false; n];
        let mut flags: HashMap<SlotId, Vec<SlotId>> = HashMap::new();
        for c in CompIdx::below(self.components.component_type.len()) {
            let ty = self.components.component_type[c.index()];
            let np = self.n_public(c);
            let base = self.slot_base[c.index()].index();
            for pi in 0..np {
                let mut bits = 0;
                if ty.is_interactive_prop(np, pi) {
                    bits |= Carried::INTERACTIVE;
                }
                if ty.is_action_prop(pi) {
                    bits |= Carried::ACTION;
                }
                if bits != 0 {
                    carried[uf.find(SlotId::from_index(base + pi)).index()].0 |= bits;
                }
            }
        }
        for &s in &self.author_ops {
            carried[uf.find(s).index()].0 |= Carried::AUTHOR;
        }
        for &(s, ty) in &self.typed_slots {
            carried[uf.find(s).index()].0 |= Carried::of_type(ty);
        }
        for &(s, f) in &self.holds {
            flags.entry(uf.find(s)).or_default().push(f);
        }
        for (s, _) in &self.later_sources {
            excluded[uf.find(*s).index()] = true;
        }
        for &s in &self.counted_slots {
            excluded[uf.find(s).index()] = true;
        }
        if !self.compiled.counted.0.is_empty() {
            for s in SlotId::below(n) {
                if self
                    .template_slot(s)
                    .is_some_and(|(t, ts)| self.compiled.counted.marks(t, ts))
                {
                    excluded[uf.find(s).index()] = true;
                }
            }
        }

        // Each vector head's outputs; a head whose output may not merge
        // may not either.
        let mut outs_of: HashMap<SlotId, Vec<(u8, SlotId)>> = HashMap::new();
        for s in SlotId::below(n) {
            if let BuiltSource::VecOut(head, k) = self.sources[s.index()] {
                outs_of.entry(head).or_default().push((k, s));
            }
        }
        for (&head, outs) in &outs_of {
            if outs.iter().any(|&(_, v)| excluded[uf.find(v).index()]) {
                excluded[uf.find(head).index()] = true;
            }
        }

        // The defining slots that may merge, ascending.
        let candidates: Vec<SlotId> = SlotId::below(n)
            .filter(|&s| {
                let root = uf.find(s);
                def[root.index()] == s
                    && !excluded[root.index()]
                    && matches!(
                        self.sources[s.index()],
                        BuiltSource::Op(..) | BuiltSource::VecOut(..)
                    )
            })
            .collect();
        if candidates.len() < 2 {
            return;
        }
        let mut buckets: HashMap<Bucket, Vec<SlotId>> = HashMap::new();
        loop {
            buckets.clear();
            let mut merged = false;
            for &s in &candidates {
                let root = uf.find(s);
                if def[root.index()] != s {
                    continue; // merged into a lower slot
                }
                let Some(bucket) = self.bucket(s, root, uf, &carried, &flags, &outs_of) else {
                    continue;
                };
                let members = buckets.entry(bucket).or_default();
                let found = members.iter().copied().find(|&m| self.same_op(m, s, uf));
                let Some(m) = found else {
                    members.push(s);
                    continue;
                };
                // `m` is lower than `s`: candidates ascend.
                let (rm, rs) = (uf.find(m), root);
                uf.union(s, m);
                let r = uf.find(s);
                let other = if r == rm { rs } else { rm };
                def[r.index()] = m;
                def[other.index()] = SlotId::NONE;
                carried[r.index()] = carried[other.index()];
                if let Some(f) = flags.remove(&other) {
                    flags.insert(r, f);
                }
                merged = true;
            }
            if !merged {
                return;
            }
        }
    }

    /// The bucket of defining slot `s`, whose class has root `root`; None
    /// for a source that never merges.
    fn bucket(
        &self,
        s: SlotId,
        root: SlotId,
        uf: &mut UnionFind,
        carried: &[Carried],
        flags: &HashMap<SlotId, Vec<SlotId>>,
        outs_of: &HashMap<SlotId, Vec<(u8, SlotId)>>,
    ) -> Option<Bucket> {
        let held = |root: SlotId, uf: &mut UnionFind| {
            let mut held: Vec<SlotId> = flags
                .get(&root)
                .map(|fs| fs.iter().map(|&f| uf.find(f)).collect())
                .unwrap_or_default();
            held.sort_unstable();
            held.dedup();
            held
        };
        let (what, inputs) = match self.sources[s.index()] {
            BuiltSource::Op(op, start, count) => {
                let what = match op {
                    PlannedOp::Spec(spec) => What::Spec(std::mem::discriminant(&spec)),
                    // Symbolic templates are not merged yet (ADR 0033, step 2).
                    PlannedOp::Template { .. } => return None,
                };
                let inputs = self.op_inputs[start as usize..start as usize + count as usize]
                    .iter()
                    .map(|&i| uf.find(i))
                    .collect();
                (what, inputs)
            }
            BuiltSource::VecOut(head, k) => (What::VecOut(uf.find(head), k), Vec::new()),
            _ => return None,
        };
        let mut outs: Vec<(u8, Carried, Vec<SlotId>)> = outs_of
            .get(&s)
            .into_iter()
            .flatten()
            .map(|&(k, v)| {
                let r = uf.find(v);
                (k, carried[r.index()], held(r, uf))
            })
            .collect();
        outs.sort_unstable_by_key(|o| o.0);
        Some(Bucket {
            what,
            inputs,
            carried: carried[root.index()],
            flags: held(root, uf),
            outs,
        })
    }

    /// Whether defining slots `a` and `b`, in one bucket, compute the
    /// same: the same operator (a template the same tree over the same
    /// cells); a vector output's bucket already says all of it.
    fn same_op(&self, a: SlotId, b: SlotId, uf: &mut UnionFind) -> bool {
        match (&self.sources[a.index()], &self.sources[b.index()]) {
            (BuiltSource::Op(PlannedOp::Spec(x), ..), BuiltSource::Op(PlannedOp::Spec(y), ..)) => {
                x == y
            }
            (
                &BuiltSource::Op(PlannedOp::Template { template: x, .. }, ..),
                &BuiltSource::Op(PlannedOp::Template { template: y, .. }, ..),
            ) => {
                x == y || {
                    let tx = self.sym_templates[x.index()].map_leaves(|l| uf.find(l));
                    let ty = self.sym_templates[y.index()].map_leaves(|l| uf.find(l));
                    tx == ty
                }
            }
            (BuiltSource::VecOut(..), BuiltSource::VecOut(..)) => true,
            _ => false,
        }
    }
}

//! Define: merge aliased slots into the cells they will share, orient the
//! author's operators, check the prefill rule, and class every cell
//! (ADR 0035). What define makes, [`Defined`], is what the walks, the
//! input signature, the abstract build's findings and emit read; a rule
//! about what a cell *is* belongs here or earlier, never in emit.

use super::*;

/// What define made of the resolved slots: the cells they will make, and
/// each slot's class (ADR 0018, ADR 0019). The abstract build classes by
/// its own walks and records what it found; every stamped build classes
/// by the records, so a slot's class is the same in every build. The
/// caller chooses, so define has no branch for it.
pub(in crate::build) struct Defined {
    pub(in crate::build) slot_cells: SlotCells,
    /// Per slot, whether it is a given value a student's action can
    /// write: essential, where any other given value is a constant.
    pub(in crate::build) essential: Vec<bool>,
    /// Per slot, whether the document computes its cell.
    pub(in crate::build) live: Vec<bool>,
}

impl Defined {
    /// The definitions classed by `b`'s own walks: the abstract build's.
    pub(in crate::build) fn by_walk(b: &Builder<'_>, slot_cells: SlotCells) -> Defined {
        let essential = b.writable_slots(&slot_cells);
        let live = b.live_slots(&slot_cells);
        Defined {
            slot_cells,
            essential,
            live,
        }
    }

    /// The definitions classed by the compile's records: every stamped
    /// build's. With the classing off (no record), every given value is
    /// essential.
    pub(in crate::build) fn by_record(b: &Builder<'_>, slot_cells: SlotCells) -> Defined {
        let n = b.sources.len();
        let essential = match &b.compiled.plans.classes {
            None => vec![true; n],
            Some(r) => SlotId::below(n)
                .map(|s| b.template_slot(s).is_none_or(|(t, ts)| r.marks(t, ts)))
                .collect(),
        };
        let live = b.live_by_record(&b.compiled.plans.live, &slot_cells);
        Defined {
            slot_cells,
            essential,
            live,
        }
    }
}

impl<'c> Builder<'c> {
    /// Define: merge aliased slots into the cells they will share, find
    /// each cell's defining slot, orient the author's operators (ADR 0026)
    /// and check the prefill rule. What every walk, the input signature
    /// and emit read.
    pub(in crate::build) fn define(&mut self) -> std::result::Result<SlotCells, Failure> {
        let n = self.sources.len();
        let mut uf = UnionFind::new(n);
        for (s, src) in self.sources.iter().enumerate() {
            if let BuiltSource::Alias(t) = src {
                uf.union(SlotId::from_index(s), *t);
            }
        }
        // The one non-alias slot of each cell's slots defines it; a cell
        // is named here by its slots' root.
        let mut def: Vec<SlotId> = vec![SlotId::NONE; n];
        for (s, src) in self.sources.iter().enumerate() {
            match src {
                BuiltSource::Alias(_) => {}
                BuiltSource::Unset => unreachable!(
                    "slot {} never received a source",
                    self.slot_label(SlotId::from_index(s))
                ),
                _ => {
                    let root = uf.find(SlotId::from_index(s)).index();
                    debug_assert!(def[root].is_none(), "two sources in one cell");
                    def[root] = SlotId::from_index(s);
                }
            }
        }

        let cell_of: Vec<SlotId> = SlotId::below(n).map(|s| uf.find(s)).collect();
        // A cell of aliases with no definer is a loop of aliases. When the
        // view folds iterations it may be a recurrence folded onto itself,
        // which the cycle check has judged; it becomes a constant here. In a
        // stamped build it is a gap in the check (ADR 0014): define's one
        // read of the view, the defensive kind.
        for (s, &root) in cell_of.iter().enumerate() {
            let root = root.index();
            if def[root] == SlotId::NONE {
                if !self.view.folds_iterations() {
                    return Err(Failure {
                        error: Error::Cycle(self.slot_label(SlotId::from_index(s))),
                        node: None,
                    });
                }
                self.sources[s] = BuiltSource::Const(f64::NAN);
                def[root] = SlotId::from_index(s);
            }
        }
        let slot_cells = SlotCells::new(self, cell_of, def);
        // Each binary operator of the author's math writes the input that
        // leads to state (ADR 0026), before the walks read which inputs it
        // writes.
        self.orient(&slot_cells);
        self.prefill_rule(&slot_cells)?;
        Ok(slot_cells)
    }

    /// The prefill rule (ADR 0012): a prefill reference must name a cell
    /// whose definition is not an operator, unless the cell is a counted
    /// value (ADR 0028), the number the build counted. The seeded element
    /// is boxed (ADR 0013).
    fn prefill_rule(&mut self, slot_cells: &SlotCells) -> std::result::Result<(), Failure> {
        for &(s, from) in &self.seeds {
            let cell = slot_cells.cell_of(from);
            let computed = matches!(
                self.sources[slot_cells.def(cell).index()],
                BuiltSource::Op(..) | BuiltSource::VecOut(..)
            );
            if computed && !self.counted_cell(slot_cells, cell) {
                let node = self.components.dast_node[self.slot_comp[s.index()].index()];
                self.failed_node = (node != NodeId::NONE).then_some(node);
                return Err(Failure {
                    error: Error::Unsupported(format!(
                        "prefill=\"${}\": a prefill reference must name a value that is not computed",
                        self.slot_label(from)
                    )),
                    node: self.failed_node,
                });
            }
        }
        Ok(())
    }

    /// Whether `cell` holds a counted value (ADR 0028): one the build
    /// counts from the structure it stamped.
    pub(in crate::build) fn counted_cell(&self, slot_cells: &SlotCells, cell: SlotId) -> bool {
        self.counted_slots
            .iter()
            .any(|&s| slot_cells.cell_of(s) == cell)
    }

    /// The cell a seed takes its value from: `from`'s, or for a counted
    /// value (a `Copy` of the number the build counted) the number itself.
    pub(in crate::build) fn seed_source(&self, slot_cells: &SlotCells, from: SlotId) -> SlotId {
        let cell = slot_cells.cell_of(from);
        if let BuiltSource::Op(PlannedOp::Spec(OpSpec::Copy), start, 1) =
            self.sources[slot_cells.def(cell).index()]
            && self.counted_cell(slot_cells, cell)
        {
            return slot_cells.cell_of(self.op_inputs[start.index()]);
        }
        cell
    }
}

/// The union-find that merges aliased slots into the cells they share.
struct UnionFind {
    parent: Vec<SlotId>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind {
            parent: SlotId::below(n).collect(),
        }
    }
    fn find(&mut self, mut x: SlotId) -> SlotId {
        while self.parent[x.index()] != x {
            let p = self.parent[x.index()];
            self.parent[x.index()] = self.parent[p.index()];
            x = p;
        }
        x
    }
    fn union(&mut self, a: SlotId, b: SlotId) {
        let (ra, rb) = (self.find(a), self.find(b));
        if ra != rb {
            self.parent[ra.index()] = rb;
        }
    }
}

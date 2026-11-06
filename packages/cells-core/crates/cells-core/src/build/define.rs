//! Define: merge aliased slots into the cells they will share, orient the
//! author's operators, check the prefill rule, and class every cell
//! (ADR 0035). What define makes, [`Defined`], is what the walks, the
//! live walk and emit read; a rule
//! about what a cell *is* belongs here or earlier, never in emit.

use super::*;

/// What define made of the resolved slots: the cells they will make, and
/// each slot's class (ADR 0018, ADR 0019), by the ports' attributes,
/// which the compile found over the template graph, so a slot's class is
/// the same in every build.
pub(in crate::build) struct Defined {
    pub(in crate::build) slot_cells: SlotCells,
    /// Per slot, whether it is a given value a student's action can
    /// write: essential, where any other given value is a constant.
    pub(in crate::build) essential: Vec<bool>,
    /// Per slot, whether the document computes its cell.
    pub(in crate::build) live: Vec<bool>,
}

/// Define, classing: each slot's class by the ports' attributes.
impl Defined {
    /// The definitions classed by the ports' attributes, which the compile
    /// keeps: every stamped build's.
    pub(in crate::build) fn by_attributes(x: &Expanded<'_>, slot_cells: SlotCells) -> Defined {
        let plans = x.compiled.plans;
        let essential = SlotId::below(x.sources.len())
            .map(|s| {
                x.slots()
                    .template_slot(s)
                    .is_none_or(|(t, ts)| plans.port_attrs(t, ts).has(PortAttrs::WRITABLE))
            })
            .collect();
        let live = slot_cells.live_by_attributes(x);
        Defined {
            slot_cells,
            essential,
            live,
        }
    }
}

/// Define: aliased slots merged into the cells they share, operators oriented
/// and the prefill rule checked (ADR 0035). Reads what expand made, and turns
/// its author's operators round; makes the cells, which [`Defined`] holds.
impl SlotCells {
    /// Define: merge aliased slots into the cells they will share, find
    /// each cell's defining slot, orient the author's operators (ADR 0026)
    /// and check the prefill rule. What every walk, the input signature
    /// and emit read.
    pub(in crate::build) fn define(
        x: &mut Expanded<'_>,
    ) -> std::result::Result<SlotCells, Failure> {
        let n = x.sources.len();
        let mut uf = UnionFind::new(n);
        for (s, src) in x.sources.iter().enumerate() {
            if let BuiltSource::Alias(t) = src {
                uf.union(SlotId::from_index(s), *t);
            }
        }
        // The one non-alias slot of each cell's slots defines it; a cell
        // is named here by its slots' root.
        let mut def: Vec<SlotId> = vec![SlotId::NONE; n];
        for (s, src) in x.sources.iter().enumerate() {
            match src {
                BuiltSource::Alias(_) => {}
                BuiltSource::Unset => unreachable!(
                    "slot {} never received a source",
                    x.slots().slot_label(SlotId::from_index(s))
                ),
                _ => {
                    let root = uf.find(SlotId::from_index(s)).index();
                    debug_assert!(def[root].is_none(), "two sources in one cell");
                    def[root] = SlotId::from_index(s);
                }
            }
        }

        let cell_of: Vec<SlotId> = SlotId::below(n).map(|s| uf.find(s)).collect();
        // A cell of aliases with no definer is a loop of aliases: a gap in
        // the compile's cycle check (ADR 0014), the defensive kind.
        for (s, &root) in cell_of.iter().enumerate() {
            if def[root.index()] == SlotId::NONE {
                return Err(Failure {
                    error: Error::Cycle(x.slots().slot_label(SlotId::from_index(s))),
                    node: None,
                });
            }
        }
        let slot_cells = SlotCells::new(x, cell_of, def);
        // Each binary operator of the author's math writes the input that
        // leads to state (ADR 0026), before the walks read which inputs it
        // writes.
        slot_cells.orient(x);
        slot_cells.prefill_rule(x)?;
        Ok(slot_cells)
    }

    /// The prefill rule (ADR 0012): a prefill reference must name a cell
    /// whose definition is not an operator, unless the cell is a counted
    /// value (ADR 0028), the number the build counted. The seeded element
    /// is boxed (ADR 0013).
    fn prefill_rule(&self, x: &Expanded<'_>) -> std::result::Result<(), Failure> {
        for &(s, from) in &x.seeds {
            let cell = self.cell_of(from);
            let computed = matches!(
                x.sources[self.def(cell).index()],
                BuiltSource::Op(..) | BuiltSource::VecOut(..)
            );
            if computed && !self.counted_cell(x, cell) {
                let node = x.components.dast_node[x.slot_comp[s.index()].index()];
                return Err(Failure {
                    error: Error::Unsupported(format!(
                        "prefill=\"${}\": a prefill reference must name a value that is not computed",
                        x.slots().slot_label(from)
                    )),
                    node: (node != NodeId::NONE).then_some(node),
                });
            }
        }
        Ok(())
    }

    /// Whether `cell` holds a counted value (ADR 0028): one the build
    /// counts from the structure it stamped.
    pub(in crate::build) fn counted_cell(&self, x: &Expanded<'_>, cell: SlotId) -> bool {
        x.counted_slots.iter().any(|&s| self.cell_of(s) == cell)
    }

    /// The cell a seed takes its value from: `from`'s, or for a counted
    /// value (a `Copy` of the number the build counted) the number itself.
    pub(in crate::build) fn seed_source(&self, x: &Expanded<'_>, from: SlotId) -> SlotId {
        let cell = self.cell_of(from);
        if let BuiltSource::Op(PlannedOp::Spec(OpSpec::Copy), start, 1) =
            x.sources[self.def(cell).index()]
            && self.counted_cell(x, cell)
        {
            return self.cell_of(x.op_inputs[start.index()]);
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

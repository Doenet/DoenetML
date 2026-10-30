//! The live walk (ADR 0019): which slots a document must compute. It
//! starts from the roots, the slots of every prop that is an output or
//! that the core reads itself: a rendered prop of a rendered component, a
//! score, an input, a prop an action reads, a repeat's count, and what
//! snapping a sticky group reads. It goes backward over the cells the slots
//! will make, from a cell to what it needs (`slot_cells::Def::needs`):
//! through an operator to every input it reads, a vector operator's output
//! to its head, which reads every input, and a held cell to its flags,
//! which a request on it reads. A seeded slot reads its seed's source when
//! it is built. A cell it reaches is live.
//!
//! When the view folds iterations (the probe), a slot may have another
//! source in the iterations after the first (`Builder::later_sources`): the
//! walk follows that one too, as the writable walk does
//! (`Builder::walk_cells` is the walk both share). The probe records
//! what it finds by template slot, and every other build reads the record
//! (`live_by_record`).

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether its cell is live by this build's own walk.
    pub(in crate::build) fn live_slots(&self, slot_cells: &SlotCells) -> Vec<bool> {
        let n = self.sources.len();
        let mut live = vec![false; n];
        self.walk_live(slot_cells, self.live_roots(slot_cells), &mut live, |_| true);
        SlotId::below(n)
            .map(|s| live[slot_cells.cell_of(s).index()])
            .collect()
    }

    /// Per slot, whether the probe's record makes its cell live: a cell
    /// with a template slot the record marks. The record names a cell by
    /// template slot, which a synthesized component's slots (a choice's
    /// interface, `expand/choice.rs`) have none of, so such a cell is live
    /// when a root or a live cell needs it, as it was in the probe's walk.
    /// A cell the record names and does not mark stays dead whatever needs
    /// it: the record is checked against the walk (`tests/live.rs`), and a
    /// live cell needing a dead one fails the build.
    pub(in crate::build) fn live_by_record(
        &self,
        record: &Record,
        slot_cells: &SlotCells,
    ) -> Vec<bool> {
        let n = self.sources.len();
        let (mut live, mut named) = (vec![false; n], vec![false; n]);
        for s in SlotId::below(n) {
            if let Some((t, ts)) = self.template_slot(s) {
                let cell = slot_cells.cell_of(s);
                named[cell.index()] = true;
                if record.marks(t, ts) {
                    live[cell.index()] = true;
                }
            }
        }
        let mut stack = self.live_roots(slot_cells);
        stack.extend(SlotId::below(n).filter(|&c| live[c.index()] && slot_cells.def(c) == c));
        self.walk_live(slot_cells, stack, &mut live, |cell| !named[cell.index()]);
        SlotId::below(n)
            .map(|s| live[slot_cells.cell_of(s).index()])
            .collect()
    }

    /// The cells the walk starts from: those of the roots' slots.
    fn live_roots(&self, slot_cells: &SlotCells) -> Vec<SlotId> {
        let mut stack: Vec<SlotId> = Vec::new();
        let (rendered, in_sticky) = self.components.placement(self.root);
        for c in CompIdx::below(self.components.component_type.len()) {
            let ty = self.components.component_type[c.index()];
            let np = self.n_public(c);
            let base = self.slot_base[c.index()].index();
            // Snapping reads a sticky group's settings and every point of
            // its members (`document/sticky.rs`); a member is rendered, so
            // in a sticky group is in a rendered one.
            let sticky = ty == ComponentType::StickyGroup
                || (in_sticky[c.index()] && ty.sticky_layout().is_some());
            for pi in 0..np {
                if sticky
                    || ty.is_root_prop(np, pi)
                    || (rendered[c.index()] && ty.is_rendered_prop(np, pi))
                {
                    stack.push(slot_cells.cell_of(SlotId::from_index(base + pi)));
                }
            }
        }
        stack
    }

    /// Mark live, in `live` by cell, every cell reached from `stack`
    /// through what it needs (`slot_cells::Def::needs`), where `may_mark`
    /// allows it; a cell it does not allow is neither marked nor followed. A seeded
    /// slot reads its seed's source when it is built.
    fn walk_live(
        &self,
        slot_cells: &SlotCells,
        stack: Vec<SlotId>,
        live: &mut [bool],
        may_mark: impl Fn(SlotId) -> bool,
    ) {
        let seeds: Vec<(SlotId, BuiltSource)> = self
            .seeds
            .iter()
            .map(|&(s, from)| (s, BuiltSource::Alias(from)))
            .collect();
        self.walk_cells(
            slot_cells,
            stack,
            &seeds,
            |root| {
                if !live[root.index()] {
                    if !may_mark(root) {
                        return false;
                    }
                    live[root.index()] = true;
                }
                true
            },
            |def, stack| stack.extend(def.needs().map(|i| slot_cells.cell_of(i))),
        );
    }
}

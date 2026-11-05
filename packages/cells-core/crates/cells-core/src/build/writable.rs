//! The writable walk: which value slots a student's action can write. It
//! starts from the slots of every prop a student acts on and goes backward
//! over the cells the slots will make, from a cell to where a request on it
//! goes. A value slot it reaches (a literal or a default) is writable; a
//! fixed one ends it, and so does a cell a `fixed` holds by a constant flag.
//! When the view folds iterations, the walk also follows a slot's later
//! sources.

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether it is a value slot a student's action can write:
    /// one a request reaches from an input that no constant flag holds.
    pub(in crate::build) fn writable_slots(&self, slot_cells: &SlotCells) -> Vec<bool> {
        let mut writable = vec![false; self.sources.len()];
        let mut stack: Vec<SlotId> = Vec::new();
        for c in CompIdx::below(self.components.component_type.len()) {
            let ty = self.components.component_type[c.index()];
            let np = self.n_public(c);
            let base = self.slot_base[c.index()].index();
            for pi in 0..np {
                if ty.is_input_prop(np, pi) {
                    stack.push(slot_cells.cell_of(SlotId::from_index(base + pi)));
                }
            }
        }
        self.walk_cells(
            slot_cells,
            stack,
            &[],
            |_| true,
            |def, stack| {
                if let BuiltSource::Given(_) = def.source
                    && !def.held_always()
                {
                    writable[def.slot.index()] = true;
                }
                stack.extend(def.request_targets().map(|i| slot_cells.cell_of(i)));
            },
        );
        writable
    }
}

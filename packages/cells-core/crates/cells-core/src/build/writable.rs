//! The writable walk (ADR 0018): which value slots a student's action can
//! write. It starts from the slots of every prop a student acts on, those
//! a definition marks interactive (a renderer's request) or written by an
//! action (a submit, a trigger), and goes backward over the cells the slots
//! will make, from a cell to where a request on it goes
//! (`slot_cells::Def::request_targets`): through an operator to the inputs
//! its inverse may write (`OpSpec::writes`), and a vector operator's output
//! to its head. A value slot it reaches (a literal or a default) is
//! writable; a fixed one ends it, and so does a cell a `fixed` holds by a
//! constant flag, which no request passes.
//!
//! When the view folds iterations (the probe), a slot may have another
//! source in the iterations after the first (`Builder::later_sources`): the
//! walk follows that one too when it reaches the slot's cell, so a
//! template slot a later iteration writes is found (`Builder::walk_cells`
//! is the walk the live walk shares).

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether it is a value slot a student's action can write:
    /// one a request reaches from an input (`slot_cells::Def::request_targets`)
    /// that no constant flag holds.
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
                if let BuiltSource::Literal(_) = def.source
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

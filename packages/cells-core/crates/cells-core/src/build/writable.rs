//! The writable walk: which value slots a student's action can write. It
//! starts from the slots of every prop a student acts on and goes backward
//! over the cells the slots will make, from a cell to where a request on it
//! goes. A value slot it reaches (a literal or a default) is writable; a
//! fixed one ends it, and so does a cell a `fixed` holds by a constant flag.

use super::*;

/// The writable walk: which value slots a student's action can write. Run by
/// define, over what expand made.
impl SlotCells {
    #[cfg(feature = "testing")]
    /// Per slot, whether it is a value slot a student's action can write:
    /// one a request reaches from an input that no constant flag holds.
    pub(in crate::build) fn writable_slots(&self, x: &Expanded<'_>) -> Vec<bool> {
        let mut writable = vec![false; x.sources.len()];
        let mut stack: Vec<SlotId> = Vec::new();
        for c in CompIdx::below(x.components.component_type.len()) {
            let ty = x.components.component_type[c.index()];
            let np = x.slots().n_public(c);
            let base = x.slot_base[c.index()].index();
            for pi in 0..np {
                if ty.is_input_prop(np, pi) {
                    stack.push(self.cell_of(SlotId::from_index(base + pi)));
                }
            }
        }
        self.walk_cells(
            x,
            stack,
            &[],
            |_| true,
            |def, stack| {
                if let BuiltSource::Given(_) = def.source
                    && !def.held_always()
                {
                    writable[def.slot.index()] = true;
                }
                stack.extend(def.request_targets().map(|i| self.cell_of(i)));
            },
        );
        writable
    }
}

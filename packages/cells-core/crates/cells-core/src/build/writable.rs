//! The writable walk (ADR 0018): which value slots a student's action can
//! write. It starts from the slots of every prop a student acts on, those
//! a definition marks interactive (a renderer's request) or written by an
//! action (a submit, a trigger), and goes backward over emit's alias
//! classes, from a class to where a request on it goes
//! (`classes::Def::request_targets`): through an operator to the inputs its
//! inverse may write (`OpSpec::writes`), and a vector operator's output to
//! its head. A value slot it reaches (a literal or a default) is writable;
//! a fixed one ends it, and so does a class a `fixed` holds by a constant
//! flag, which no request passes.
//!
//! When the view folds iterations (the probe), a slot may have another
//! source in the iterations after the first (`Builder::later_sources`): the
//! walk follows that one too when it reaches the slot's class, so a
//! template slot a later iteration writes is found (`Builder::walk_classes`
//! is the walk the live walk shares).

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether it is a value slot a student's action can write:
    /// one a request reaches from an input (`classes::Def::request_targets`)
    /// that no constant flag holds.
    pub(in crate::build) fn writable_slots(&self, classes: &Classes<'_>) -> Vec<bool> {
        let mut writable = vec![false; self.sources.len()];
        let mut stack: Vec<SlotId> = Vec::new();
        for c in CompIdx::below(self.components.component_type.len()) {
            let ty = self.components.component_type[c.index()];
            let np = self.n_public(c);
            let base = self.slot_base[c.index()].index();
            for pi in 0..np {
                if ty.is_input_prop(np, pi) {
                    stack.push(classes.root(SlotId::from_index(base + pi)));
                }
            }
        }
        self.walk_classes(
            classes,
            stack,
            &[],
            |_| true,
            |def, stack| {
                if let BuiltSource::Literal(_) = def.source
                    && !def.held_always()
                {
                    writable[def.slot.index()] = true;
                }
                stack.extend(def.request_targets().map(|i| classes.root(i)));
            },
        );
        writable
    }
}

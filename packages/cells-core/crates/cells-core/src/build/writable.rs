//! The writable walk (ADR 0018): which value slots a student's action can
//! write. It starts from the slots of every prop a student acts on, those
//! a definition marks interactive (a renderer's request) or written by an
//! action (a submit, a trigger), and goes backward over emit's alias
//! classes, from a class to its defining slot: through an operator to the
//! inputs its inverse may write (`OpSpec::writes`), and a vector
//! operator's output to its head. A value slot it reaches (a literal or a
//! default) is writable; a fixed one ends it, and so does a class a
//! `fixed` holds by a constant flag (`hold_all`), which no request passes.
//!
//! When the view folds iterations (the probe), a slot may have another
//! source in the iterations after the first (`Builder::later_sources`): the
//! walk follows that one too when it reaches the slot's class, so a
//! template slot a later iteration writes is found (`Builder::walk_classes`
//! is the walk the live walk shares).

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether it is a value slot a student's action can write.
    /// `roots` is each slot's alias class and `class_def` each class's
    /// defining slot, by root.
    pub(in crate::build) fn writable_slots(
        &self,
        roots: &[SlotId],
        class_def: &[SlotId],
    ) -> Vec<bool> {
        let mut writable = vec![false; self.sources.len()];
        let mut stack: Vec<SlotId> = Vec::new();
        let flags = self.class_flags(roots);
        let held_always = |root: SlotId| {
            flags.get(&root).is_some_and(|fs| {
                fs.iter().any(|f| {
                    matches!(self.sources[class_def[roots[f.index()].index()].index()],
                        BuiltSource::Fixed(v) if v != 0.0)
                })
            })
        };
        for c in CompIdx::below(self.components.component_type.len()) {
            let ty = self.components.component_type[c.index()];
            let np = self.n_public(c);
            let base = self.slot_base[c.index()].index();
            for pi in 0..np {
                if ty.is_input_prop(np, pi) {
                    stack.push(roots[base + pi]);
                }
            }
        }
        self.walk_classes(
            roots,
            class_def,
            stack,
            &[],
            |root| !held_always(root),
            |slot, src, stack| {
                if let BuiltSource::Literal(_) = src {
                    writable[slot.index()] = true;
                }
                stack.extend(
                    src.writable_inputs(&self.op_inputs)
                        .map(|i| roots[i.index()]),
                );
            },
        );
        writable
    }
}

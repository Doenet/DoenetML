//! The live walk (ADR 0019): which slots a document must compute. It
//! starts from the roots, the slots of every prop that is an output or
//! that the core reads itself: a rendered prop of a rendered component, a
//! score, an input, a prop an action reads, a repeat's count, and what
//! snapping a sticky group reads. It goes backward over emit's alias
//! classes, from a class to its defining slot and through an operator to
//! every input it reads, a hold's flag included; a vector operator's
//! output to its head, which reads every input. A seeded slot reads its
//! seed's source when it is built. A class it reaches is live.
//!
//! When the view folds iterations (the probe), a slot may have another
//! source in the iterations after the first (`Builder::later_sources`): the
//! walk follows that one too, as the writable walk does
//! (`Builder::walk_classes` is the walk both share).

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether its class is live. `roots` is each slot's alias
    /// class and `class_def` each class's defining slot, by root.
    pub(in crate::build) fn live_slots(&self, roots: &[SlotId], class_def: &[SlotId]) -> Vec<bool> {
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
                    stack.push(roots[base + pi]);
                }
            }
        }
        // A seeded slot reads its seed's source when it is built.
        let seeds: Vec<(SlotId, BuiltSource)> = self
            .seeds
            .iter()
            .map(|&(s, from)| (s, BuiltSource::Alias(from)))
            .collect();
        let seen = self.walk_classes(roots, class_def, stack, &seeds, |_, src, stack| {
            stack.extend(src.inputs(&self.op_inputs).map(|i| roots[i.index()]))
        });
        roots.iter().map(|&r| seen[r.index()]).collect()
    }
}

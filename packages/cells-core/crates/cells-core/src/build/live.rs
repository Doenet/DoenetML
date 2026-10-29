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
//! (`Builder::walk_classes` is the walk both share). The probe records
//! what it finds by template slot, and every other build reads the record
//! (`live_by_record`).

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether its class is live by this build's own walk.
    /// `roots` is each slot's alias class and `class_def` each class's
    /// defining slot, by root.
    pub(in crate::build) fn live_slots(&self, roots: &[SlotId], class_def: &[SlotId]) -> Vec<bool> {
        let n = self.sources.len();
        let mut live = vec![false; n];
        self.walk_live(roots, class_def, self.live_roots(roots), &mut live, |_| {
            true
        });
        roots.iter().map(|&r| live[r.index()]).collect()
    }

    /// Per slot, whether the probe's record makes its class live: a class
    /// with a template slot the record marks. The record names a class by
    /// template slot, which a synthesized component's slots (a choice's
    /// interface, `expand/choice.rs`) have none of, so such a class is live
    /// when a root or a live class reads it, as it was in the probe's walk.
    /// A class the record names and does not mark stays dead whatever
    /// reads it: the record is checked against the walk (`tests/live.rs`),
    /// and a live instruction reading a dead cell fails the build.
    pub(in crate::build) fn live_by_record(
        &self,
        record: &Record,
        roots: &[SlotId],
        class_def: &[SlotId],
    ) -> Vec<bool> {
        let n = self.sources.len();
        let (mut live, mut named) = (vec![false; n], vec![false; n]);
        for (s, &root) in roots.iter().enumerate() {
            if let Some((t, ts)) = self.template_slot(SlotId::from_index(s)) {
                named[root.index()] = true;
                if record.marks(t, ts) {
                    live[root.index()] = true;
                }
            }
        }
        let mut stack = self.live_roots(roots);
        stack.extend(SlotId::below(n).filter(|&r| live[r.index()] && class_def[r.index()] == r));
        self.walk_live(roots, class_def, stack, &mut live, |root| {
            !named[root.index()]
        });
        roots.iter().map(|&r| live[r.index()]).collect()
    }

    /// The classes the walk starts from, by root: the slots of the roots.
    fn live_roots(&self, roots: &[SlotId]) -> Vec<SlotId> {
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
        stack
    }

    /// Mark live, in `live` by root, every class reached from `stack`
    /// through what its defining slot reads, where `may_mark` allows it; a
    /// class it does not allow is neither marked nor followed. A seeded
    /// slot reads its seed's source when it is built.
    fn walk_live(
        &self,
        roots: &[SlotId],
        class_def: &[SlotId],
        stack: Vec<SlotId>,
        live: &mut [bool],
        may_mark: impl Fn(SlotId) -> bool,
    ) {
        let seeds: Vec<(SlotId, BuiltSource)> = self
            .seeds
            .iter()
            .map(|&(s, from)| (s, BuiltSource::Alias(from)))
            .collect();
        self.walk_classes(
            roots,
            class_def,
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
            |_, src, stack| stack.extend(src.inputs(&self.op_inputs).map(|i| roots[i.index()])),
        );
    }
}

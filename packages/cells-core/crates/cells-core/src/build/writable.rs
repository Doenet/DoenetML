//! The writable walk (ADR 0018): which value slots a student's action can
//! write. It starts from the slots of every prop a student acts on, those
//! a definition marks interactive (a renderer's request) or written by an
//! action (a submit, a trigger), and goes backward over emit's alias
//! classes, from a class to its defining slot: through an operator to the
//! inputs its inverse may write (`OpSpec::writes`), a hold to the value it
//! holds and never its flag, and a vector operator's output to its head. A
//! value slot it reaches (a literal or a default) is writable; a fixed one
//! ends it.
//!
//! When the view folds iterations (the probe), a slot may have another
//! source in the iterations after the first (`Builder::later_sources`): the
//! walk follows that one too when it reaches the slot's class, so a
//! template slot a later iteration writes is found.

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
        let n = self.sources.len();
        let mut writable = vec![false; n];
        let mut seen = vec![false; n];
        let mut stack: Vec<SlotId> = Vec::new();
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
        // The later sources of each class, by root (the probe only).
        let mut later: HashMap<SlotId, Vec<usize>> = HashMap::new();
        for (i, &(s, _)) in self.later_sources.iter().enumerate() {
            later.entry(roots[s.index()]).or_default().push(i);
        }
        let mut follow = |slot: SlotId, src: &BuiltSource, stack: &mut Vec<SlotId>| match src {
            BuiltSource::Literal(_) => writable[slot.index()] = true,
            BuiltSource::Alias(t) => stack.push(roots[t.index()]),
            BuiltSource::Op(spec, start, count) => {
                let mask = spec.writes();
                for k in 0..(*count as usize).min(64) {
                    if mask & (1 << k) != 0 {
                        stack.push(roots[self.op_inputs[*start as usize + k].index()]);
                    }
                }
            }
            BuiltSource::VecOut(head, _) => stack.push(roots[head.index()]),
            BuiltSource::Fixed(_) | BuiltSource::Unset => {}
        };
        while let Some(root) = stack.pop() {
            if std::mem::replace(&mut seen[root.index()], true) {
                continue;
            }
            let def = class_def[root.index()];
            follow(def, &self.sources[def.index()], &mut stack);
            if let Some(entries) = later.get(&root) {
                for &i in entries {
                    let (s, src) = &self.later_sources[i];
                    follow(*s, src, &mut stack);
                }
            }
        }
        writable
    }
}

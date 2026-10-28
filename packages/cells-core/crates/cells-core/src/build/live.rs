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
//! walk follows that one too, as the writable walk does.

use super::*;

impl<'c> Builder<'c> {
    /// Per slot, whether its class is live. `roots` is each slot's alias
    /// class and `class_def` each class's defining slot, by root.
    pub(in crate::build) fn live_slots(&self, roots: &[u32], class_def: &[u32]) -> Vec<bool> {
        let n = self.sources.len();
        let mut seen = vec![false; n];
        let mut stack: Vec<u32> = Vec::new();
        let (rendered, in_sticky) = self.components.placement(self.root);
        for c in 0..self.components.component_type.len() as CompIdx {
            let ty = self.components.component_type[c as usize];
            let np = self.n_public(c);
            let base = self.slot_base[c as usize] as usize;
            // Snapping reads a sticky group's settings and every point of
            // its members (`document/sticky.rs`); a member is rendered, so
            // in a sticky group is in a rendered one.
            let sticky = ty == ComponentType::StickyGroup
                || (in_sticky[c as usize] && ty.sticky_layout().is_some());
            for pi in 0..np {
                if sticky
                    || ty.is_root_prop(np, pi)
                    || (rendered[c as usize] && ty.is_rendered_prop(np, pi))
                {
                    stack.push(roots[base + pi]);
                }
            }
        }
        // The later sources of each class, by root (the probe only).
        let mut later: HashMap<u32, Vec<usize>> = HashMap::new();
        for (i, &(s, _)) in self.later_sources.iter().enumerate() {
            later.entry(roots[s as usize]).or_default().push(i);
        }
        // The seed sources of each class, by root.
        let mut seeded: HashMap<u32, Vec<SlotId>> = HashMap::new();
        for &(s, from) in &self.seeds {
            seeded.entry(roots[s as usize]).or_default().push(from);
        }
        let follow = |src: &BuiltSource, stack: &mut Vec<u32>| match src {
            BuiltSource::Alias(t) => stack.push(roots[*t as usize]),
            BuiltSource::Op(_, start, count) => stack.extend(
                self.op_inputs[*start as usize..*start as usize + *count as usize]
                    .iter()
                    .map(|&i| roots[i as usize]),
            ),
            BuiltSource::VecOut(head, _) => stack.push(roots[*head as usize]),
            BuiltSource::Literal(_)
            | BuiltSource::Default(_)
            | BuiltSource::Fixed(_)
            | BuiltSource::Unset => {}
        };
        while let Some(root) = stack.pop() {
            if std::mem::replace(&mut seen[root as usize], true) {
                continue;
            }
            follow(&self.sources[class_def[root as usize] as usize], &mut stack);
            if let Some(entries) = later.get(&root) {
                for &i in entries {
                    follow(&self.later_sources[i].1, &mut stack);
                }
            }
            if let Some(froms) = seeded.get(&root) {
                stack.extend(froms.iter().map(|&f| roots[f as usize]));
            }
        }
        roots.iter().map(|&r| seen[r as usize]).collect()
    }
}

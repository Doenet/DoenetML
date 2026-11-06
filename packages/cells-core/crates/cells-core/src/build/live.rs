//! The live walk: which slots a document must compute. It starts from the
//! roots, the slots of every prop that is an output or that the core reads
//! itself (a rendered prop, a score, an input, a prop an action reads, a
//! repeat's count, what snapping reads), and goes backward over the cells
//! the slots will make to what each needs. A cell it reaches is live. A
//! build reads which cells are live from the ports' attributes, which the
//! template graph's walk found; this walk is the tests' check of them.

use super::*;

/// The live walk: which slots a document must compute, backward from the
/// outputs and what the core reads. Run by define, over what expand made.
impl SlotCells {
    #[cfg(feature = "testing")]
    /// Per slot, whether its cell is live by this build's own walk.
    pub(in crate::build) fn live_slots(&self, x: &Expanded<'_>) -> Vec<bool> {
        let n = x.sources.len();
        let mut live = vec![false; n];
        self.walk_live(x, self.live_roots(x), &mut live, |_| true);
        SlotId::below(n)
            .map(|s| live[self.cell_of(s).index()])
            .collect()
    }

    /// Per slot, whether the ports' attributes make its cell live: a cell
    /// with a template slot whose port is live. A cell with no template
    /// slot is live when a root or a live cell needs it. A cell with a
    /// template slot whose port is not live stays dead whatever needs it.
    pub(in crate::build) fn live_by_attributes(&self, x: &Expanded<'_>) -> Vec<bool> {
        let n = x.sources.len();
        let (mut live, mut named) = (vec![false; n], vec![false; n]);
        for s in SlotId::below(n) {
            if let Some((t, ts)) = x.slots().template_slot(s) {
                let cell = self.cell_of(s);
                named[cell.index()] = true;
                if x.compiled.plans.port_attrs(t, ts).has(PortAttrs::LIVE) {
                    live[cell.index()] = true;
                }
            }
        }
        let mut stack = self.live_roots(x);
        stack.extend(SlotId::below(n).filter(|&c| live[c.index()] && self.def(c) == c));
        self.walk_live(x, stack, &mut live, |cell| !named[cell.index()]);
        SlotId::below(n)
            .map(|s| live[self.cell_of(s).index()])
            .collect()
    }

    /// The cells the walk starts from: those of the roots' slots.
    fn live_roots(&self, x: &Expanded<'_>) -> Vec<SlotId> {
        let mut stack: Vec<SlotId> = Vec::new();
        let (rendered, in_sticky) = x.components.placement(x.root);
        for c in CompIdx::below(x.components.component_type.len()) {
            let ty = x.components.component_type[c.index()];
            let np = x.slots().n_public(c);
            let base = x.slot_base[c.index()].index();
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
                    stack.push(self.cell_of(SlotId::from_index(base + pi)));
                }
            }
        }
        stack
    }

    /// Mark live, in `live` by cell, every cell reached from `stack`
    /// through what it needs, where `may_mark` allows it; a cell it does not
    /// allow is neither marked nor followed.
    fn walk_live(
        &self,
        x: &Expanded<'_>,
        stack: Vec<SlotId>,
        live: &mut [bool],
        may_mark: impl Fn(SlotId) -> bool,
    ) {
        let seeds: Vec<(SlotId, BuiltSource)> = x
            .seeds
            .iter()
            .map(|&(s, from)| (s, BuiltSource::Alias(from)))
            .collect();
        self.walk_cells(
            x,
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
            |def, stack| stack.extend(def.needs().map(|i| self.cell_of(i))),
        );
    }
}

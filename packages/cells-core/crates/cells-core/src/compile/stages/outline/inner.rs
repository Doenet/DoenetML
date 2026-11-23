//! The inputs a component owns (ADR 0045), made when outlining where the
//! source has none: the normalizer writes them as the owner's children
//! (`<_fractionInputComponent part="numerator">`), outlined as its
//! components; one its type declares (`inner { .. }`) and the source does
//! not write (a DAST the normalizer did not see) is a synthetic element,
//! in its place among them. The owner's planner plans each.

use super::Outlining;
use crate::compile::*;

/// Outlining, owned inputs: made for every element whose type declares
/// them. Makes elements; plans nothing (ADR 0030).
impl Outlining<'_> {
    /// Add the inputs every element of a type with `inner` owns and does
    /// not write, in the order the walk made the elements. A clone has none
    /// of its own: its props alias its original's.
    pub(super) fn add_inner_inputs(&mut self) {
        let owners: Vec<(TemplateId, ElemId)> = self
            .work
            .to_plan
            .iter()
            .copied()
            .filter(|&(t, e)| {
                let el = &self.outlined(t).elems[e.index()];
                !el.component_type.inner().is_empty()
                    && !el.cloned
                    && el.node != NodeId::NONE
                    && !self.tables[t.index()].is_box(e)
            })
            .collect();
        for (t, e) in owners {
            let ty = self.outlined(t).elems[e.index()].component_type;
            for (k, inner) in ty.inner().iter().enumerate() {
                let written = self
                    .rd()
                    .elem_children(t, e)
                    .into_iter()
                    .filter(|&x| self.outlined(t).elems[x.index()].component_type == inner.ty)
                    .count();
                let declared = ty.inner()[..=k].iter().filter(|i| i.ty == inner.ty).count();
                if written >= declared {
                    continue;
                }
                let x = self
                    .push_elem(t, NodeId::NONE, inner.ty, StrId::NONE, e)
                    .expect("unnamed");
                self.outlined_mut(t).elems[e.index()]
                    .children
                    .insert(k, Child::Elem(x));
            }
        }
    }
}

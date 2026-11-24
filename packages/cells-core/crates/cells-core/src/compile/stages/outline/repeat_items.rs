//! Outlining, the item of a `<repeat for>` over a sequence (ADR 0041,
//! decision 2; ADR 0040, decision 3): of the type of the sequence's
//! entries, settled once every name is in the table.

use super::Outlining;
use crate::compile::*;

/// Outlining, a `<repeat for>`'s item: reads the name table and the type of
/// what `for` names, and writes the type of the item outlining made in the
/// repeat's body.
impl Outlining<'_> {
    /// The item `valueName` names in each `<repeat for>` outlining found,
    /// made a tuple (`Role::Item`), of the type of the entries of the
    /// sequence `for` names when it names one whose entries are its own:
    /// a value list's, a list operator's, a static sequence's or a
    /// sampler's row type, or a structural sequence's item, with an index
    /// beside it when none is named. The read of
    /// the sequence's type is recorded, so a box it names boxes the
    /// repeat (ADR 0032).
    pub(super) fn settle_repeat_items(&mut self) {
        for (t, e) in std::mem::take(&mut self.repeat_items) {
            if self.tables[t.index()].is_box(e) {
                continue;
            }
            let el = &self.outlined(t).elems[e.index()];
            let (node, name_scope) = (el.node, el.name_scope);
            let Body::Repeat { template: sub } = el.body else {
                continue;
            };
            let has_item = self
                .outlined(sub)
                .elems
                .first()
                .is_some_and(|x| x.node == NodeId::NONE && x.component_type.plays(Role::Item));
            if !has_item {
                continue;
            }
            let Some(m) = self
                .dast
                .attr_peek(node, "for")
                .and_then(|a| self.rd().single_macro(a))
            else {
                continue;
            };
            let rd = Reader::new(self.dast, &self.settled);
            let Ok(p) = rd.plan_ref_naming(&mut self.ar, t, name_scope, m) else {
                continue;
            };
            let Some((rt, re)) = rd.static_target(&self.ar, t, p) else {
                continue;
            };
            let ty = self.outlined(rt).elems[re.index()].component_type;
            let names_list = match self.ar.refs[p.index()].prop {
                None => true,
                Some(rp) => rp.of == ty && rp.sel == PropSel::At(PropAt::List),
            };
            if !names_list {
                continue;
            }
            let item = match ty.def().item {
                Some(item) => Some(item.ty),
                None => ty.entry_row(),
            };
            if let Some(item) = item {
                crate::compile::read::record_read(&mut self.work.reads, t, e, p);
                let it = &mut self.outlined_mut(sub).elems[0];
                it.component_type = item;
                it.planned_as = item;
                // The item reads its entry by the iteration's index, a
                // cell: the index's, one made for it when no `indexName`
                // names one.
                let indexed = self.outlined(sub).elems[1..]
                    .iter()
                    .any(|x| x.node == NodeId::NONE && x.component_type.plays(Role::Index));
                if !indexed {
                    self.add_synthetic(sub, Role::Index.ty(), StrId::NONE);
                }
            }
        }
    }
}

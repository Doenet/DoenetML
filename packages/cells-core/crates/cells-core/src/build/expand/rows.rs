//! Rows: each entry of a list whose entries are its own (a value list's, a
//! list operator's, a sampler's) is a component of the entry's type, a
//! child of the list, whose ports alias the entry's cells (ADR 0041,
//! decision 4). A renderer draws it, and a reference names it, as any
//! component. An entry that is the list's element child as it stands is
//! that child.

use super::*;

/// Expand, rows: the entries of a list as components.
impl<'c> Builder<'c> {
    /// Give every stamped list whose entries are its own its rows, as its
    /// children: the element child an entry is (`ElemPlan::entry_elems`),
    /// else a row made for it.
    pub(in crate::build) fn expand_rows(&mut self) {
        for i in 0..self.instances.len() {
            let inst = self.instances[i];
            let comp = inst.comp;
            if self.components.component_type[comp.index()]
                .entry_row()
                .is_none()
                || (self.components.component_type[comp.index()].holds_list_points()
                    && self.compiled.plans.templates[inst.template.index()]
                        .plan(inst.elem)
                        .points_from_elsewhere())
            {
                continue;
            }
            let elems = self.compiled.plans.templates[inst.template.index()]
                .plan(inst.elem)
                .entry_elems
                .clone();
            let elems: Vec<(u32, CompIdx)> = elems
                .iter()
                .map(|&(k, x)| (k, self.scope_comps[inst.scope.index()][x.index()]))
                .collect();
            self.rows_of(comp, &elems);
        }
    }

    /// Make the rows of list `comp`, its children from now on: entry `k`
    /// (0-based) is the component `elems` pairs with it, else a made row
    /// of the list's entry type whose entry ports alias the entry's slots.
    pub(in crate::build) fn rows_of(&mut self, comp: CompIdx, elems: &[(u32, CompIdx)]) {
        let shape = self.components.shape(comp);
        let Some(row) = shape.entry_row() else {
            return;
        };
        let n = self.slots().n_public(comp);
        let scope = self.components.scope[comp.index()];
        let ports = row.entry_ports();
        let mut kids = Vec::with_capacity(shape.list_len(n));
        for k in 1..=shape.list_len(n) {
            if let Some(&(_, c)) = elems.iter().find(|(j, _)| *j as usize + 1 == k) {
                kids.push(ChildEntry::comp(c));
                continue;
            }
            let m = self.new_component(
                row,
                StrId::NONE,
                comp,
                NodeId::NONE,
                scope,
                row.prop_defs().len(),
            );
            for (j, &pi) in ports.iter().enumerate() {
                let entry = self.slot(comp, shape.list_slot(n, k, j).expect("an entry's slot"));

                let s = self.slot(m, pi);
                self.sources[s.index()] = BuiltSource::Alias(entry);
            }
            // Not state: a made row has no essential key; what else its
            // type has, it has not.
            for pi in 0..row.prop_defs().len() {
                let s = self.slot(m, pi);
                if matches!(self.sources[s.index()], BuiltSource::Unset) {
                    self.sources[s.index()] = if Some(pi) == row.prop_index("hide") {
                        match shape.row_hide_slot(n, k) {
                            Some(h) => BuiltSource::Alias(self.slot(comp, h)),
                            None => BuiltSource::Const(0.0),
                        }
                    } else {
                        BuiltSource::Alias(self.missing_slot())
                    };
                }
            }
            kids.push(ChildEntry::comp(m));
        }
        self.set_children(comp, &kids);
    }

    /// The row an entry step `index` on prop `prop` of component `c` names
    /// (`$l[2]`): the list's child at that place, when `c` has rows, the
    /// prop is its list and the index names an entry; None for any other,
    /// and for an index by a cell, which only a value is read through.
    pub(in crate::build) fn entry_row_of(
        &self,
        c: CompIdx,
        prop: Option<RefProp>,
        index: &IndexPlan,
        scope: ScopeId,
    ) -> Option<CompIdx> {
        let ty = self.components.component_type[c.index()];
        ty.entry_row()?;
        if prop.map(|p| p.sel) != Some(PropSel::At(PropAt::List)) || index.is_dynamic() {
            return None;
        }
        let k = self.index_value(index, scope);
        let (s, n) = (
            self.components.child_start[c.index()] as usize,
            self.components.child_count[c.index()] as usize,
        );
        let j = usize::try_from(k).ok().filter(|&k| (1..=n).contains(&k))?;
        self.components.child_list[s + j - 1].as_comp()
    }
}

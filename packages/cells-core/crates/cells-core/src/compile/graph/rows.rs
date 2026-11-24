//! Rows, stamped as a build makes them (`build/expand/rows.rs`): each entry
//! of a list whose entries are its own is a component of the entry's type,
//! a child of the list, its ports aliasing the entry's (ADR 0041,
//! decision 4); an entry that is the list's element child as it stands is
//! that child.

use super::*;

/// Stamping, rows: the entries of a list as components.
impl<'c> Stamp<'c> {
    /// Give every live list whose entries are its own its rows, as its
    /// children.
    pub(super) fn expand_rows(&mut self) {
        for i in 0..self.instances.len() {
            let (t, e) = self.instances[i];
            if self.component_type(Comp::Elem(t, e)).entry_row().is_none()
                || (self.component_type(Comp::Elem(t, e)).holds_list_points()
                    && self.c.plans.templates[t.index()]
                        .plan(e)
                        .points_from_elsewhere())
            {
                continue;
            }
            self.context = self.c.plans.templates[t.index()].row(e).node;
            let elems: Vec<(u32, Comp)> = self.c.plans.templates[t.index()]
                .plan(e)
                .entry_elems
                .iter()
                .map(|&(k, x)| (k, Comp::Elem(t, x)))
                .collect();
            let kids = self.rows_of(Comp::Elem(t, e), t, &elems);
            self.elem_children.insert((t, e), kids);
        }
    }

    /// The rows of list `c` of template `t`: entry `k` (0-based) is the
    /// component `elems` pairs with it, else a made row of the list's
    /// entry type whose entry ports alias the entry's.
    pub(super) fn rows_of(&mut self, c: Comp, t: TemplateId, elems: &[(u32, Comp)]) -> Vec<Comp> {
        let shape = self.shape(c);
        let Some(row) = shape.entry_row() else {
            return Vec::new();
        };
        let n = self.n_public(c);
        let ports = row.entry_ports();
        let mut kids = Vec::with_capacity(shape.list_len(n));
        for k in 1..=shape.list_len(n) {
            if let Some(&(_, x)) = elems.iter().find(|(j, _)| *j as usize + 1 == k) {
                kids.push(x);
                continue;
            }
            let m = self.make(row, t, row.prop_defs().len(), MadeKind::Alias);
            for (j, &pi) in ports.iter().enumerate() {
                let entry = self.slot(c, shape.list_slot(n, k, j).expect("an entry's port"));

                let s = self.slot(Comp::Made(m), pi);
                self.set(s, Def::Alias(entry));
            }
            for pi in 0..row.prop_defs().len() {
                if ports.contains(&pi) {
                    continue;
                }
                let s = self.slot(Comp::Made(m), pi);
                let def = if Some(pi) == row.prop_index("hide") {
                    match shape.row_hide_slot(n, k) {
                        Some(h) => Def::Alias(self.slot(c, h)),
                        None => Def::Const(Some(0.0)),
                    }
                } else {
                    Def::Alias(self.missing())
                };
                self.set(s, def);
            }
            kids.push(Comp::Made(m));
        }
        kids
    }
}

//! Outlining, a list over a math value (ADR 0063): a `<mathList>`,
//! `<numberList>` or `<pointList>` whose content is one reference is
//! settled once every name is in the table, by the type of what the
//! reference names: over a math value (a math's or a math input's, a
//! prop holding an expression, an entry inside one) it is a list whose
//! count follows the value, a repeat-like type of its own; over anything
//! else (another list) it stays the static list it is.

use super::Outlining;
use crate::compile::*;

/// Outlining, a list over a math value: reads the name table and the type
/// of what the one reference names, and writes the element's type and its
/// body.
impl Outlining<'_> {
    /// Whether element `e` of template `t`, of a type with an
    /// [`over_value`](ComponentType::over_value) type, reads as one
    /// reference alone: an `extend` and no children, or no `extend` and one
    /// reference among its children, and no attribute but `name` beside.
    /// Such an element is settled once names resolve.
    pub(super) fn may_be_over_value(&self, el: NodeId, component_type: ComponentType) -> bool {
        if component_type.over_value().is_none() {
            return false;
        }
        let d = self.dast;
        let mut extend = false;
        for a in d.attrs(el) {
            match d.attr_name(a) {
                "name" => {}
                "extend" => extend = true,
                _ => return false,
            }
        }
        let mut macros = 0;
        for &n in d.children(el) {
            match d.kind(n) {
                NodeKind::Macro => macros += 1,
                NodeKind::Text if d.str(n).trim().is_empty() => {}
                _ => return false,
            }
        }
        if extend { macros == 0 } else { macros == 1 }
    }

    /// Each list outlining found that reads as one reference
    /// ([`may_be_over_value`](Self::may_be_over_value)), made a list over
    /// a math value when what the reference names is one: its type the
    /// one its type declares, and a body with its item, as a repeat-like
    /// type's (ADR 0041, step 4). The read of the referent's type is
    /// recorded, so a box it names boxes the list (ADR 0032).
    pub(super) fn settle_over_values(&mut self) {
        let mut settled = HashSet::new();
        for (t, e) in std::mem::take(&mut self.over_values) {
            if self.settle_over_value(t, e) {
                settled.insert((t, e));
            }
        }
        // A container copy holding a clone of one (`<section
        // extend="$s"/>`) is refused, as one holding a repeat is: a
        // repeat-like element no clone stands for (ADR 0041, step 4), its
        // count keyed by a node a clone has none of. The clones are made
        // before the settling, so the copy is boxed here.
        for t in 0..self.settled.templates.len() {
            let t = TemplateId::from_index(t);
            for e in ElemId::below(self.outlined(t).elems.len()) {
                let el = &self.outlined(t).elems[e.index()];
                let Some(ep) = el.extend.filter(|_| el.cloned) else {
                    continue;
                };
                let plan = &self.ar.refs[ep.index()];
                let [Step::Elem(c)] = plan.steps[..] else {
                    continue;
                };
                if plan.hops != 0 || plan.prop.is_some() || !settled.contains(&(t, c)) {
                    continue;
                }
                let tag = self.outlined(t).elems[c.index()].component_type.tag();
                // The copy: the nearest element around the clone that is
                // no clone.
                let mut copy = e;
                while self.outlined(t).elems[copy.index()].cloned {
                    let up = self.outlined(t).elems[copy.index()].name_scope;
                    if up == ROOT_SCOPE || up == copy {
                        break;
                    }
                    copy = up;
                }
                if self.tables[t.index()].is_box(copy) {
                    continue;
                }
                self.boxes.box_in_place(
                    &self.settled.templates,
                    &mut self.tables,
                    t,
                    copy,
                    Error::UncopyableType(format!(
                        "{tag} over a math value inside a copied container"
                    )),
                );
            }
        }
    }

    /// Make element `e` of template `t` a list over a math value of type
    /// `over`, with a body holding its item.
    fn make_over_value(&mut self, t: TemplateId, e: ElemId, over: ComponentType) {
        let el = &mut self.outlined_mut(t).elems[e.index()];
        el.component_type = over;
        el.planned_as = over;
        let item = over.def().item.expect("a list over a value has an item").ty;
        let sub = self.push_template(Some((t, e)));
        let it = self.add_synthetic(sub, item, StrId::NONE);
        self.outlined_mut(sub).children = vec![Child::Elem(it)];
        self.outlined_mut(t).elems[e.index()].body = Body::Repeat { template: sub };
    }

    /// Settle element `e` of template `t` ([`settle_over_values`](
    /// Self::settle_over_values)): whether it is a list over a math value.
    fn settle_over_value(&mut self, t: TemplateId, e: ElemId) -> bool {
        if self.tables[t.index()].is_box(e) {
            return false;
        }
        let el = &self.outlined(t).elems[e.index()];
        let (node, name_scope, ty) = (el.node, el.name_scope, el.component_type);
        let Some(over) = ty.over_value() else {
            return false;
        };
        // Its one reference: its `extend`, else its child.
        let d = self.dast;
        let m = match d.attr_peek(node, "extend") {
            Some(a) => self.rd().single_macro(a),
            None => d
                .children(node)
                .iter()
                .copied()
                .find(|&n| d.kind(n) == NodeKind::Macro),
        };
        let Some(m) = m else {
            return false;
        };
        let rd = Reader::new(self.dast, &self.settled);
        let Ok(p) = rd.plan_ref_naming(&mut self.ar, t, name_scope, m) else {
            return false;
        };
        // One entry of a point list (`$l.points[$n]`): a list of it, or
        // of none, by the index (ADR 0074).
        if let Some(entry) = ty.over_entry()
            && d.attr_peek(node, "extend").is_some()
            && self.names_point_entry(p)
        {
            crate::compile::read::record_read(&mut self.work.reads, t, e, p);
            self.outlined_mut(t).elems[e.index()].extend = None;
            self.make_over_value(t, e, entry);
            return true;
        }
        if !self.names_math_value(t, p) {
            return false;
        }
        crate::compile::read::record_read(&mut self.work.reads, t, e, p);
        // It reads the reference itself, as its `extend` attribute or its
        // child: no copy of what it names.
        self.outlined_mut(t).elems[e.index()].extend = None;
        self.make_over_value(t, e, over);
        true
    }

    /// Whether reference `p` names one entry of a list of points by an
    /// index that is no literal (`$l.points[$n]`, `$pg.vertices[$k]`): an
    /// entry step of a point's width, the path's last, through elements
    /// alone. (A literal index names a point prop, no entry.)
    fn names_point_entry(&self, p: RefId) -> bool {
        let plan = &self.ar.refs[p.index()];
        matches!(&plan.entries[..], [entry] if entry.width == 2)
            && plan.prop.is_some()
            && plan.steps.iter().all(|s| matches!(s, Step::Elem(_)))
    }

    /// Whether reference `p`, planned from template `t`, names a math
    /// value by the type of what it names: a `<math>`'s or a `<mathInput>`'s
    /// value (`$mi`, its handle prop), a prop of an element that stands for
    /// an expression (`$f.minima`), or an entry inside one (`$f.minima[2]`).
    fn names_math_value(&self, t: TemplateId, p: RefId) -> bool {
        let plan = &self.ar.refs[p.index()];
        if !plan.entries.iter().all(EntryIndex::in_handle) {
            return false;
        }
        let mut whole = plan.clone();
        whole.entries.clear();
        let mut last = None;
        for step in &whole.steps {
            match step {
                Step::Elem(x) => last = Some(*x),
                _ => return false,
            }
        }
        let Some(x) = last else {
            return false;
        };
        let rt = self.rd().template_up(t, whole.hops);
        let ty = self.outlined(rt).elems[x.index()].component_type;
        match whole.prop {
            None => ty.handle_sel().is_some(),
            Some(rp) if rp.of != ty => false,
            Some(rp) => match rp.sel {
                PropSel::At(PropAt::Position(i)) => ty.list().is_none() && ty.expr_of(i).is_some(),
                _ => false,
            },
        }
    }
}

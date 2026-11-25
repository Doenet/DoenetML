//! Outlining, a shape over a repeat's points (ADR 0075): a `<polyline>`
//! or `<polygon>` whose `vertices` are one reference, or that extends
//! another shape (as written, or as a clone in a copied container), is
//! settled once every name is in the table, by what the reference names:
//! a repeat-like element whose iterations each hold one point (a repeat,
//! a list over a math value's points, another shape settled so) makes it
//! a repeat-like type of its own, its count the source's and its item a
//! point per iteration; anything else leaves it the static shape it is.

use super::Outlining;
use crate::compile::*;

/// Outlining, a shape over a repeat's points: reads the name table and
/// what a reference names, and writes the element's type and its body.
impl Outlining<'_> {
    /// Each shape outlining found ([`ComponentType::over_iterations`]),
    /// made a shape over a repeat's points when what its reference names
    /// holds one point per iteration, and each clone of one made so too.
    /// The read of the source is recorded, so a box it names boxes the
    /// shape (ADR 0032).
    pub(super) fn settle_over_iterations(&mut self) {
        let pending: Vec<_> = std::mem::take(&mut self.over_iterations);
        let mut done: HashMap<(TemplateId, ElemId), bool> = HashMap::new();
        for &(t, e) in &pending {
            self.settle_over_iteration(t, e, &mut done);
        }
        // A clone of one is one too, keyed by the copy it is in (the
        // build's `repeat_node`): a copy holding two of them is refused,
        // as their iterations would share that key.
        let mut copies: HashMap<(TemplateId, ElemId), usize> = HashMap::new();
        loop {
            let mut changed = false;
            for t in 0..self.settled.templates.len() {
                let t = TemplateId::from_index(t);
                for c in ElemId::below(self.outlined(t).elems.len()) {
                    let el = &self.outlined(t).elems[c.index()];
                    if !el.cloned
                        || el.component_type.over_iterations().is_none()
                        || self.tables[t.index()].is_box(c)
                    {
                        continue;
                    }
                    let Some(ep) = el.extend else { continue };
                    let plan = &self.ar.refs[ep.index()];
                    let [Step::Elem(o)] = plan.steps[..] else {
                        continue;
                    };
                    if plan.hops != 0 || !done.get(&(t, o)).copied().unwrap_or(false) {
                        continue;
                    }
                    let over = self.outlined(t).elems[c.index()]
                        .component_type
                        .over_iterations()
                        .expect("a shape");
                    crate::compile::read::record_read(&mut self.work.reads, t, c, ep);
                    self.make_over_iterations(t, c, over);
                    done.insert((t, c), true);
                    *copies.entry((t, self.copy_of(t, c))).or_default() += 1;
                    changed = true;
                }
            }
            if !changed {
                break;
            }
        }
        for ((t, copy), n) in copies {
            if n > 1 && !self.tables[t.index()].is_box(copy) {
                self.boxes.box_in_place(
                    &self.settled.templates,
                    &mut self.tables,
                    t,
                    copy,
                    Error::UncopyableType(
                        "two shapes over a repeat's points inside one copied container".into(),
                    ),
                );
            }
        }
    }

    /// The copy clone `c` of template `t` is in: the nearest element
    /// around it that is no clone.
    fn copy_of(&self, t: TemplateId, c: ElemId) -> ElemId {
        let mut copy = c;
        while self.outlined(t).elems[copy.index()].cloned {
            let up = self.outlined(t).elems[copy.index()].name_scope;
            if up == ROOT_SCOPE || up == copy {
                break;
            }
            copy = up;
        }
        copy
    }

    /// Settle shape `e` of template `t`, the shape its reference names
    /// first when that is one too; whether it is over a repeat's points.
    fn settle_over_iteration(
        &mut self,
        t: TemplateId,
        e: ElemId,
        done: &mut HashMap<(TemplateId, ElemId), bool>,
    ) -> bool {
        if let Some(&settled) = done.get(&(t, e)) {
            return settled;
        }
        // Not over iterations while it is being settled: a shape reached
        // again through its own reference is a cycle, which the check
        // reports of the static shape.
        done.insert((t, e), false);
        let over = self.over_iteration_source(t, e).and_then(|p| {
            let (st, se) = self.rd().static_target(&self.ar, t, p)?;
            if self.ar.refs[p.index()].prop.is_some() || self.tables[st.index()].is_box(se) {
                return None;
            }
            let source_ty = self.outlined(st).elems[se.index()].component_type;
            if source_ty.over_iterations().is_some() {
                self.settle_over_iteration(st, se, done);
            }
            let ty = self.outlined(t).elems[e.index()].component_type;
            let item = ty.over_iterations()?.def().item?.ty;
            self.rd().point_per_iteration(st, se, item).map(|_| p)
        });
        let Some(p) = over else {
            return false;
        };
        let ty = self.outlined(t).elems[e.index()].component_type;
        let over = ty.over_iterations().expect("a shape");
        crate::compile::read::record_read(&mut self.work.reads, t, e, p);
        self.make_over_iterations(t, e, over);
        done.insert((t, e), true);
        true
    }

    /// The one reference shape `e` of template `t` reads its vertices
    /// from: its `vertices` when they are one reference and nothing else,
    /// else what it extends when it gives no `vertices`.
    fn over_iteration_source(&mut self, t: TemplateId, e: ElemId) -> Option<RefId> {
        if self.tables[t.index()].is_box(e) {
            return None;
        }
        let el = &self.outlined(t).elems[e.index()];
        let (node, name_scope, extend) = (el.node, el.name_scope, el.extend);
        if node == NodeId::NONE {
            return None;
        }
        let d = self.dast;
        match d.attr_peek(node, "vertices") {
            Some(a) => {
                let m = self.rd().single_macro(a)?;
                let rd = Reader::new(self.dast, &self.settled);
                rd.plan_ref_naming(&mut self.ar, t, name_scope, m).ok()
            }
            None => extend,
        }
    }

    /// Make element `e` of template `t` a shape over a repeat's points of
    /// type `over`, with a body holding its item, a point.
    fn make_over_iterations(&mut self, t: TemplateId, e: ElemId, over: ComponentType) {
        let el = &mut self.outlined_mut(t).elems[e.index()];
        el.component_type = over;
        el.planned_as = over;
        let sub = self.push_template(Some((t, e)));
        let item = over
            .def()
            .item
            .expect("a shape over iterations has an item")
            .ty;
        let it = self.add_synthetic(sub, item, StrId::NONE);
        self.outlined_mut(sub).children = vec![Child::Elem(it)];
        self.outlined_mut(t).elems[e.index()].body = Body::Repeat { template: sub };
    }
}

//! Planning: every element on its own, from the source and what outlining
//! settled and parsing made, never from another element's plan. This
//! directory holds the machinery each type's planner builds on.

mod answer;
pub(in crate::compile) mod attrs;
mod choice;
mod condition;
mod copies;
pub(in crate::compile) mod ctx;
mod fix;
mod iterates;
pub(in crate::compile) mod planner;

use crate::compile::*;

/// Planning's working set: what parsing made, which planning reads and
/// never changes, and what it makes for linking and sealing.
pub(in crate::compile) struct Planning<'a> {
    /// What boxing records, planning's while it runs.
    pub(in crate::compile) boxes: Boxes<'a>,
    /// Reference planning's state, planning's while it runs.
    pub(in crate::compile) refs: Refs,
    pub(in crate::compile) parsed: Parsed,
    pub(in crate::compile) planned: Planned,
}

/// The ways an element is planned.
enum ElemShape {
    Cloned,
    Synthetic,
    ExtendProp(RefId),
    ContainerCopy(RefId),
    /// Planned as its type's entry in `planner` says.
    ByType(Option<RefId>),
}

impl<'a> Compiler<'a> {
    /// Plan every element and every `$ref` child. What fails is boxed in
    /// place; a `$ref` child that cannot be planned gets a box as its plan.
    pub(in crate::compile) fn plan_all(
        &mut self,
        boxes: Boxes<'a>,
        refs: Refs,
        parsed: Parsed,
        to_plan: Vec<(TemplateId, ElemId)>,
        ref_children: Vec<(TemplateId, RefChildId)>,
        reads: Vec<Read>,
    ) -> (Planned, Boxes<'a>, Refs) {
        let mut pl = Planning {
            boxes,
            refs,
            parsed,
            planned: Planned {
                reads,
                ..Default::default()
            },
        };
        // Planning's table, a row per element, made here (ADR 0031).
        for t in 0..self.n_templates() {
            let n = self.outlined(TemplateId::from_index(t)).elems.len();
            self.tables[t].plans = vec![ElemPlan::default(); n];
        }
        {
            let _s = crate::trace::span("elements");
            crate::trace::count("elements", to_plan.len());
            for (t, e) in to_plan {
                self.plan_elem(&mut pl, t, e);
            }
        }
        let _s = crate::trace::span("refs");
        crate::trace::count("refs", ref_children.len());
        // Planning's table of `$ref` children, made here.
        for t in 0..self.n_templates() {
            let n = self.outlined(TemplateId::from_index(t)).ref_children.len();
            self.tables[t].ref_child_plans = vec![RefChildPlan::Unplanned; n];
        }
        for (t, id) in ref_children {
            let RefChild { node: m, owner, .. } = self.outlined(t).ref_children[id.index()];
            // Content of a box is not planned.
            let dead = match owner {
                Some(e) => self.is_box(t, e),
                None => self
                    .outlined(t)
                    .parent
                    .is_some_and(|(pt, pe)| self.is_box(pt, pe)),
            };
            if dead {
                continue;
            }
            let scope = match owner {
                Some(e) => self.child_scope(t, e),
                None => ROOT_SCOPE,
            };
            let plan = match self.plan_ref(&mut pl.refs, t, scope, m) {
                Ok(p) => RefChildPlan::Ref(p),
                // A reference that cannot be planned is boxed where it
                // stands (ADR 0027).
                Err(error) => {
                    pl.boxes.record(m, &error);
                    RefChildPlan::Boxed
                }
            };
            self.tables[t.index()].ref_child_plans[id.index()] = plan;
        }
        (pl.planned, pl.boxes, pl.refs)
    }

    /// Plans element `e`, and records what holds it beside its plans.
    /// Elements are planned in any order, each once.
    pub(in crate::compile) fn plan_elem(
        &mut self,
        pl: &mut Planning<'a>,
        t: TemplateId,
        e: ElemId,
    ) {
        // A box, made when outlining or boxed in place, is planned as it is.
        if self.is_box(t, e) {
            return;
        }
        let planned_as = self.outlined(t).elems[e.index()].planned_as;
        let _s = crate::trace::tally(planned_as.tag());
        let r = self.plan_elem_inner(pl, t, e).and_then(|()| {
            let hold = crate::trace::tally("hold").run(|| self.plan_hold(&mut pl.refs, t, e))?;
            self.tables[t.index()].plans[e.index()].hold = hold;
            Ok(())
        });
        // Boxed where it fails; what reads it reads the box.
        if let Err(error) = r {
            self.box_in_place(&mut pl.boxes, t, e, error);
        }
    }

    fn plan_elem_inner(&mut self, pl: &mut Planning<'a>, t: TemplateId, e: ElemId) -> Result<()> {
        let component_type = self.outlined(t).elems[e.index()].planned_as;
        match self.elem_shape(pl, t, e)? {
            // Every public prop aliases the original's; nothing else to
            // plan.
            ElemShape::Cloned => {
                self.plan_bare_copy(t, e);
                Ok(())
            }
            // The synthesized root; the other synthesized elements are
            // planned by what owns them and never reach here.
            ElemShape::Synthetic => {
                self.plan_synthetic(t, e);
                Ok(())
            }
            ElemShape::ExtendProp(p) => self.plan_extend_prop(t, e, p),
            ElemShape::ContainerCopy(p) => self.plan_container_copy(pl, t, e, p),
            // A type that cannot be extended (a choice) is refused before
            // anything plans it (ADR 0034).
            ElemShape::ByType(Some(_)) if component_type.def().flags.not_extendable => {
                Err(Error::Banned(format!(
                    "extend on a <{}>: reference its interface names instead",
                    component_type.tag()
                )))
            }
            ElemShape::ByType(_) if component_type.def().flags.owned => self.plan_owned(t, e),
            ElemShape::ByType(_) if let Some(m) = component_type.def().machinery => {
                self.plan_machinery(pl, t, e, m)
            }
            ElemShape::ByType(extend) => match Self::planner(component_type) {
                Planner::Props => {
                    self.plan_attrs(&mut pl.refs, &pl.parsed, t, e, extend)?;
                    // A repeat's `valueName` and `indexName` make hidden
                    // elements in its body, which its table cannot say.
                    if matches!(self.outlined(t).elems[e.index()].body, Body::Repeat { .. }) {
                        self.plan_iteration_names(&mut pl.refs, t, e);
                    }
                    Ok(())
                }
                Planner::Plan(plan) => self.plan_with_extend(pl, t, e, extend, plan),
            },
        }
    }

    /// An element of an owned type (`flags: [owned]`): planned already by
    /// what owns it (an award by its answer), or refused, standing free.
    fn plan_owned(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        if !self.tables[t.index()].plans[e.index()].props.is_empty() {
            return Ok(());
        }
        let component_type = self.outlined(t).elems[e.index()].planned_as;
        let a = |tag: &str| {
            if tag.starts_with(['a', 'e', 'i', 'o', 'u']) {
                "an"
            } else {
                "a"
            }
        };
        let tag = component_type.tag();
        // A `<pointList>` only exists as `extend="$shape.points"`, which
        // `elem_shape` takes before planning by type.
        if component_type == ComponentType::PointList {
            return Err(Error::BadValue {
                attr: "extend".into(),
                text: "<pointList> needs extend=\"$shape.points\"".into(),
            });
        }
        Err(Error::Unsupported(match component_type.def().owner {
            Some(owner) => format!(
                "{} <{tag}> outside {} <{}>",
                a(tag),
                a(owner.tag()),
                owner.tag()
            ),
            None => format!("{} <{tag}>, which only what owns it makes", a(tag)),
        }))
    }

    /// An element of a type that names machinery (`machinery:`): the
    /// machinery plans it.
    fn plan_machinery(
        &mut self,
        pl: &mut Planning<'a>,
        t: TemplateId,
        e: ElemId,
        m: Machinery,
    ) -> Result<()> {
        match m {
            Machinery::Answer => self.plan_answer(&mut pl.refs, t, e),
            Machinery::Choice => self.plan_choice(&mut pl.refs, t, e),
            Machinery::RepeatFor => {
                self.plan_iteration_names(&mut pl.refs, t, e);
                self.plan_repeat_for(&mut pl.refs, t, e)
            }
            Machinery::FunctionIterates => self.plan_function_iterates(pl, t, e),
            Machinery::Collect => self.plan_collect(&mut pl.refs, t, e),
        }
    }

    /// Makes the element's children copies of the components under what
    /// its `from` (a `<polyline>`'s `vertices`) names, of the type
    /// outlining recorded it collects, gathered when it expands; its count
    /// is an aggregate over them.
    fn plan_collect(&mut self, rf: &mut Refs, t: TemplateId, e: ElemId) -> Result<()> {
        let Elem {
            node,
            name_scope: scope,
            component_type: own_type,
            ..
        } = self.outlined(t).elems[e.index()];
        let polyline = own_type == ComponentType::Polyline;
        let (attr, refused) = if polyline {
            (
                "vertices",
                Error::Unsupported("<polyline> needs vertices=\"$name\"".into()),
            )
        } else {
            ("from", Error::BadCollect)
        };
        let m = self
            .dast
            .attr(node, attr)
            .and_then(|a| self.single_macro(a))
            .ok_or(refused)?;
        let p = self.plan_ref(rf, t, scope, m)?;
        if self.plans.refs[p.index()].prop.is_some() {
            return Err(if polyline {
                Error::Unsupported(
                    "<polyline vertices> must name a component holding points".into(),
                )
            } else {
                Error::BadCollect
            });
        }
        debug_assert!(
            matches!(self.outlined(t).elems[e.index()].body, Body::Collect { .. }),
            "outlining made a collecting element a collect"
        );
        let mut props = vec![Source::absent(); own_type.prop_defs().len()];
        mark_aggregates(own_type, &mut props);
        let plan = &mut self.tables[t.index()].plans[e.index()];
        plan.from = Some(p);
        plan.props = props;
        Ok(())
    }

    /// Which way an element is planned, decided from its `extend` attribute
    /// (and whether its type is a container) before any prop is looked at.
    /// Records the extend plan on the element.
    fn elem_shape(&mut self, pl: &mut Planning<'a>, t: TemplateId, e: ElemId) -> Result<ElemShape> {
        let Elem {
            node: el,
            component_type,
            cloned,
            ..
        } = self.outlined(t).elems[e.index()];
        if cloned {
            // A clone is a copy of its original.
            let original = self.outlined(t).elems[e.index()].extend;
            self.tables[t.index()].plans[e.index()].extend = original;
            return Ok(ElemShape::Cloned);
        }
        if el == NodeId::NONE {
            return Ok(ElemShape::Synthetic);
        }
        // Every `extend` was planned when outlining (ADR 0031). A container
        // copy got its clones then too.
        let extend = self.outlined(t).elems[e.index()].extend;
        if let Some(p) = extend
            && component_type.container()
            && self.plans.refs[p.index()].prop.is_none()
        {
            self.tables[t.index()].plans[e.index()].extend = Some(p);
            return Ok(ElemShape::ContainerCopy(p));
        }
        let extend = match extend {
            Some(p) => {
                // An extend of a box is planned from nothing (ADR 0027).
                self.referent_type(&mut pl.planned.reads, t, e, p)?;
                // `<point extend="$c.center"/>`, `<math extend="$c.radius"/>`,
                // `<pointList extend="$l.points"/>`: the element's value
                // props alias the named prop. An extend across related
                // types names the referent's default prop already
                // (`plan_extend`).
                if self.plans.refs[p.index()].prop.is_some() {
                    return Ok(ElemShape::ExtendProp(p));
                }
                Some(p)
            }
            None => None,
        };
        self.tables[t.index()].plans[e.index()].extend = extend;
        Ok(ElemShape::ByType(extend))
    }

    /// Plans the synthesized root of a DAST that was not normalized: it has
    /// no source, so only its aggregates, which every root's props are.
    fn plan_synthetic(&mut self, t: TemplateId, e: ElemId) {
        let component_type = self.outlined(t).elems[e.index()].component_type;
        let mut props = vec![Source::absent(); component_type.prop_defs().len()];
        mark_aggregates(component_type, &mut props);
        self.tables[t.index()].plans[e.index()].props = props;
    }

    /// A plan naming prop `prop` of repeat `e` of template `t`, as seen
    /// from the repeat's own template (one hop up).
    pub(in crate::compile) fn own_prop_plan(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        e: ElemId,
        prop: &'static str,
    ) -> RefId {
        let ty = self.outlined(t).elems[e.index()].component_type;
        let prop_sel = RefProp::named(ty, prop).expect("a repeat has the prop its body reads");
        let plan = RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: Some(prop_sel),
            display: RefDisplay::Spelled(format!("(repeat).{prop}").into()),
            node: NodeId::NONE,
        };
        rf.push(&mut self.plans.refs, plan)
    }
}

#[cfg(test)]
mod tests {
    use crate::testing::dast::{document, el, load, mac};

    /// An owned type standing free is refused, naming what owns it: a
    /// constraint outside a point, an award outside an answer.
    #[test]
    fn a_free_owned_element_is_refused() {
        for (free, said) in [
            (
                el("constrainTo").child(mac("c")),
                "a <constrainTo> outside a <point>",
            ),
            (el("award").text("1"), "an <award> outside an <answer>"),
        ] {
            let doc = load(document([el("circle").name("c"), free])).unwrap();
            assert!(
                doc.diagnostics().iter().any(|d| d.message.contains(said)),
                "{said}: {:?}",
                doc.diagnostics()
            );
        }
    }

    /// A type that cannot be extended (`flags: [not_extendable]`) is
    /// refused before anything plans it.
    #[test]
    fn an_extend_of_a_choice_is_refused() {
        let doc = load(document([
            el("select")
                .name("s")
                .child(el("option").child(el("number").text("1"))),
            el("select").name("t").attr("extend", mac("s")),
        ]))
        .unwrap();
        assert!(
            doc.diagnostics()
                .iter()
                .any(|d| d.message.contains("extend on a <select>")),
            "{:?}",
            doc.diagnostics()
        );
    }

    /// A type that does not declare `constrain_target` is refused as a
    /// constraint target, and one that does is wired by it.
    #[test]
    fn a_type_without_a_constrain_target_is_no_target() {
        let doc = load(document([el("graph")
            .child(el("testValue").name("v").attr("value", "1"))
            .child(
                el("point")
                    .name("p")
                    .text("(3, 4)")
                    .child(el("constrainTo").child(mac("v"))),
            )]))
        .unwrap();
        assert!(
            doc.diagnostics()
                .iter()
                .any(|d| d.message.contains("constrainTo a <testValue>")),
            "{:?}",
            doc.diagnostics()
        );
        let doc = load(document([el("graph")
            .child(el("circle").name("c").attr("radius", "1"))
            .child(
                el("point")
                    .name("p")
                    .text("(3, 0)")
                    .child(el("constrainTo").child(mac("c"))),
            )]))
        .unwrap();
        assert_eq!(crate::testing::prop_value(&doc, "p.x"), 1.0);
    }
}

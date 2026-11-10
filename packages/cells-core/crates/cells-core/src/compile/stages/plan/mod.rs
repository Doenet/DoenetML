//! Planning: every element on its own, from the source and what outlining
//! settled and parsing made, never from another element's plan. This
//! directory holds the machinery each type's planner builds on.

mod answer;
mod attrs;
mod choice;
mod condition;
mod copies;
mod ctx;
mod fix;
mod iterates;
mod planner;

use crate::compile::*;
// What a planner is given and how a type names its planner: the planner-facing
// part of planning, which `api` re-exports to the components.
pub(crate) use ctx::PlanCtx;
pub(crate) use planner::Planner;

/// Planning's view (ADR 0031, "The planner context"): what outlining
/// settled and what parsing made, read-only; planning's table and the boxes
/// in the tables, the arenas, and what it makes for linking and sealing,
/// writable. A planner reaches it only through [`PlanCtx`].
struct Planning<'a> {
    /// The source and what outlining settled.
    rd: Reader<'a>,
    /// What parsing made.
    parsed: &'a Parsed,
    /// Boxing's and planning's tables, by [`TemplateId`]: planning fills its
    /// own, and boxes through `boxes`.
    tables: Vec<Tables>,
    /// What planning appends to.
    ar: Arenas,
    /// What boxing records, planning's while it runs.
    boxes: Boxes<'a>,
    /// What planning makes for linking and sealing.
    planned: Planned,
}

/// Plan every element and every `$ref` child outlining found (`work`),
/// over what outlining settled and parsing made: boxing's and planning's
/// tables, the arenas and the boxes as planning leaves them, and
/// [`Planned`] for linking and sealing.
pub(in crate::compile) fn plan<'a>(
    rd: Reader<'a>,
    parsed: &'a Parsed,
    tables: Vec<Tables>,
    ar: Arenas,
    boxes: Boxes<'a>,
    work: Outline,
) -> (Vec<Tables>, Arenas, Boxes<'a>, Planned) {
    let Outline {
        to_plan,
        macros,
        reads,
        ..
    } = work;
    let mut planning = Planning::new(rd, parsed, tables, ar, boxes, reads);
    crate::trace::span("plan all").run(|| planning.plan_all(to_plan, macros));
    let Planning {
        tables,
        ar,
        boxes,
        planned,
        ..
    } = planning;
    (tables, ar, boxes, planned)
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

/// Planning: every element and every `$ref` child, each on its own. Reads the
/// record and what outlining settled, never another element's plan (ADR 0029);
/// writes planning's table and [`Planned`].
impl<'a> Planning<'a> {
    /// Planning over what the stages before it made: the reads outlining
    /// recorded are the first in [`Planned`].
    fn new(
        rd: Reader<'a>,
        parsed: &'a Parsed,
        tables: Vec<Tables>,
        ar: Arenas,
        boxes: Boxes<'a>,
        reads: Vec<Read>,
    ) -> Self {
        Planning {
            rd,
            parsed,
            tables,
            ar,
            boxes,
            planned: Planned {
                reads,
                ..Default::default()
            },
        }
    }

    /// Plan every element and every `$ref` child. What fails is boxed in
    /// place; a `$ref` child that cannot be planned gets a box as its plan.
    fn plan_all(
        &mut self,
        to_plan: Vec<(TemplateId, ElemId)>,
        ref_children: Vec<(TemplateId, RefChildId)>,
    ) {
        // Planning's table, a row per element, made here (ADR 0031).
        for t in 0..self.tables.len() {
            let n = self.rd.outlined(TemplateId::from_index(t)).elems.len();
            self.tables[t].plans = vec![ElemPlan::default(); n];
        }
        {
            let _s = crate::trace::span("elements");
            crate::trace::count("elements", to_plan.len());
            for (t, e) in to_plan {
                self.plan_elem(t, e);
            }
        }
        let _s = crate::trace::span("refs");
        crate::trace::count("refs", ref_children.len());
        // Planning's table of `$ref` children, made here.
        for t in 0..self.tables.len() {
            let n = self
                .rd
                .outlined(TemplateId::from_index(t))
                .ref_children
                .len();
            self.tables[t].ref_child_plans = vec![RefChildPlan::Unplanned; n];
        }
        for (t, id) in ref_children {
            let RefChild { node: m, owner, .. } = self.rd.outlined(t).ref_children[id.index()];
            // Content of a box is not planned.
            let dead = match owner {
                Some(e) => self.tables[t.index()].is_box(e),
                None => self
                    .rd
                    .outlined(t)
                    .parent
                    .is_some_and(|(pt, pe)| self.tables[pt.index()].is_box(pe)),
            };
            if dead {
                continue;
            }
            let scope = match owner {
                Some(e) => self.rd.child_scope(t, e),
                None => ROOT_SCOPE,
            };
            let plan = match self.rd.plan_ref(&mut self.ar, t, scope, m) {
                Ok(p) => RefChildPlan::Ref(p),
                // A reference that cannot be planned is boxed where it
                // stands (ADR 0027).
                Err(error) => {
                    self.boxes.record(m, &error);
                    RefChildPlan::Boxed
                }
            };
            self.tables[t.index()].ref_child_plans[id.index()] = plan;
        }
    }

    /// Plans element `e`, and records what holds it beside its plans.
    /// Elements are planned in any order, each once.
    fn plan_elem(&mut self, t: TemplateId, e: ElemId) {
        // A box, made when outlining or boxed in place, is planned as it is.
        if self.tables[t.index()].is_box(e) {
            return;
        }
        let planned_as = self.rd.outlined(t).elems[e.index()].planned_as;
        let _s = crate::trace::tally(planned_as.tag());
        let r = self.plan_elem_inner(t, e).and_then(|()| {
            let hold = crate::trace::tally("hold").run(|| self.plan_hold(t, e))?;
            self.tables[t.index()].plans[e.index()].hold = hold;
            Ok(())
        });
        // Boxed where it fails; what reads it reads the box.
        if let Err(error) = r {
            self.boxes
                .box_in_place(&self.rd.settled().templates, &mut self.tables, t, e, error);
        }
    }

    fn plan_elem_inner(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let component_type = self.rd.outlined(t).elems[e.index()].planned_as;
        match self.elem_shape(t, e)? {
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
            ElemShape::ContainerCopy(p) => self.plan_container_copy(t, e, p),
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
                self.plan_machinery(t, e, m)
            }
            ElemShape::ByType(extend) => match Self::planner(component_type) {
                Planner::Props => {
                    self.plan_attrs(t, e, extend)?;
                    // A repeat's `valueName` and `indexName` make hidden
                    // elements in its body, which its table cannot say.
                    if matches!(
                        self.rd.outlined(t).elems[e.index()].body,
                        Body::Repeat { .. }
                    ) {
                        self.plan_iteration_names(t, e);
                    }
                    Ok(())
                }
                Planner::Plan(plan) => self.plan_with_extend(t, e, extend, plan),
            },
        }
    }

    /// An element of an owned type (`flags: [owned]`): planned already by
    /// what owns it (an award by its answer), or refused, standing free.
    fn plan_owned(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        if !self.tables[t.index()].plans[e.index()].props.is_empty() {
            return Ok(());
        }
        let component_type = self.rd.outlined(t).elems[e.index()].planned_as;
        // A `<pointList>` only exists as `extend="$shape.points"`, which
        // `elem_shape` takes before planning by type.
        if component_type.holds_list_points() {
            return Err(Error::BadValue {
                attr: "extend".into(),
                text: "<pointList> needs extend=\"$shape.points\"".into(),
            });
        }
        Err(Error::Unsupported(component_type.free_owned_refusal()))
    }

    /// An element of a type that names machinery (`machinery:`): the
    /// machinery plans it.
    fn plan_machinery(&mut self, t: TemplateId, e: ElemId, m: Machinery) -> Result<()> {
        match m {
            Machinery::Answer => self.plan_answer(t, e),
            Machinery::Choice => self.plan_choice(t, e),
            Machinery::RepeatFor => {
                self.plan_iteration_names(t, e);
                self.plan_repeat_for(t, e)
            }
            Machinery::FunctionIterates => self.plan_function_iterates(t, e),
            Machinery::Collect => self.plan_collect(t, e),
        }
    }

    /// Makes the element's children copies of the components under what
    /// its `from` (a `<polyline>`'s `vertices`) names, of the type
    /// outlining recorded it collects, gathered when it expands; its count
    /// is an aggregate over them.
    fn plan_collect(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Elem {
            node,
            name_scope: scope,
            component_type: own_type,
            ..
        } = self.rd.outlined(t).elems[e.index()];
        // What it gathers from, and of which type when its own type fixes
        // it (a polyline's points).
        let (attr, fixed) = match own_type.def().settle {
            Some(Settle::Collects(of, from)) => (from, Some(of)),
            Some(Settle::CollectsByAttr(_, from)) => (from, None),
            _ => unreachable!("a collecting element settles what it collects"),
        };
        let tag = own_type.tag();
        let refused = match fixed {
            Some(_) => Error::Unsupported(format!("<{tag}> needs {attr}=\"$name\"")),
            None => Error::BadCollect,
        };
        let m = self
            .rd
            .dast
            .attr(node, attr)
            .and_then(|a| self.rd.single_macro(a))
            .ok_or(refused)?;
        let p = self.rd.plan_ref(&mut self.ar, t, scope, m)?;
        if self.ar.refs[p.index()].prop.is_some() {
            return Err(match fixed {
                Some(of) => Error::Unsupported(format!(
                    "<{tag} {attr}> must name a component holding {}s",
                    of.tag()
                )),
                None => Error::BadCollect,
            });
        }
        debug_assert!(
            matches!(
                self.rd.outlined(t).elems[e.index()].body,
                Body::Collect { .. }
            ),
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
    fn elem_shape(&mut self, t: TemplateId, e: ElemId) -> Result<ElemShape> {
        let Elem {
            node: el,
            component_type,
            cloned,
            ..
        } = self.rd.outlined(t).elems[e.index()];
        if cloned {
            // A clone is a copy of its original.
            let original = self.rd.outlined(t).elems[e.index()].extend;
            self.tables[t.index()].plans[e.index()].extend = original;
            return Ok(ElemShape::Cloned);
        }
        if el == NodeId::NONE {
            return Ok(ElemShape::Synthetic);
        }
        // Every `extend` was planned when outlining (ADR 0031). A container
        // copy got its clones then too.
        let extend = self.rd.outlined(t).elems[e.index()].extend;
        if let Some(p) = extend
            && component_type.container()
            && self.ar.refs[p.index()].prop.is_none()
        {
            self.tables[t.index()].plans[e.index()].extend = Some(p);
            return Ok(ElemShape::ContainerCopy(p));
        }
        let extend = match extend {
            Some(p) => {
                // An extend of a box is planned from nothing (ADR 0027).
                self.rd.referent_type(
                    &self.ar,
                    self.boxes.visible(&self.tables),
                    &mut self.planned.reads,
                    t,
                    e,
                    p,
                )?;
                // `<point extend="$c.center"/>`, `<math extend="$c.radius"/>`,
                // `<pointList extend="$l.points"/>`: the element's value
                // props alias the named prop. An extend across related
                // types names the referent's default prop already
                // (`plan_extend`).
                if self.ar.refs[p.index()].prop.is_some() {
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
        let component_type = self.rd.outlined(t).elems[e.index()].component_type;
        let mut props = vec![Source::absent(); component_type.prop_defs().len()];
        mark_aggregates(component_type, &mut props);
        self.tables[t.index()].plans[e.index()].props = props;
    }

    /// A plan naming prop `prop` of repeat `e` of template `t`, as seen
    /// from the repeat's own template (one hop up).
    fn own_prop_plan(&mut self, t: TemplateId, e: ElemId, prop: &'static str) -> RefId {
        let ty = self.rd.outlined(t).elems[e.index()].component_type;
        let prop_sel = RefProp::named(ty, prop).expect("a repeat has the prop its body reads");
        let plan = RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: Some(prop_sel),
            entries: Vec::new(),
            display: RefDisplay::Spelled(format!("(repeat).{prop}").into()),
            node: NodeId::NONE,
        };
        self.ar.push_ref(plan)
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
            (
                el("case").child(el("number").text("1")),
                "a <case> outside a <conditionalContent>",
            ),
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

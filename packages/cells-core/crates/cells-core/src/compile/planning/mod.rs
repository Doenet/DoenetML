//! Planning (ADR 0029, ADR 0030): every element on its own, from the
//! source and what outlining settled and parsing made, never from another
//! element's plan. `plan_all` returns what it makes for linking and
//! sealing (`Planned`). Each type's planner is in its file under
//! `components/` (ADR 0016), reached through `planner.rs` and given a
//! `PlanCtx` (`ctx.rs`); `api.rs` is all of `compile/` a planner may use.
//! The rest of this directory is the machinery planners build on.

mod answer;
pub(in crate::compile) mod attrs;
mod choice;
mod condition;
mod copies;
pub(in crate::compile) mod ctx;
mod fix;
mod iterates;
pub(in crate::compile) mod planner;
mod points;

use crate::compile::*;

/// The ways an element is planned; see `Compiler::elem_shape`.
enum ElemShape {
    Cloned,
    Synthetic,
    ExtendProp(RefId),
    ContainerCopy(RefId),
    /// Planned as its type's entry in `planner` says.
    ByType(Option<RefId>),
}

impl Compiler<'_> {
    /// Planning: every element and every `$ref` child, each from the
    /// source and what outlining and parsing made alone, never from
    /// another element's plan (ADR 0029). What fails is boxed in place. A
    /// `$ref` child's plan goes in its template's `ref_child_plans`, a box
    /// among them for one that cannot be planned: planning makes no
    /// element and writes no child list (ADR 0031).
    pub(in crate::compile) fn plan_all(
        &mut self,
        to_plan: Vec<(TemplateId, ElemId)>,
        ref_children: Vec<(TemplateId, RefChildId)>,
    ) -> Planned {
        self.planning = Some(Planned::default());
        // Planning's table, a row per element, made here (ADR 0031).
        for tpl in &mut self.compiled.templates {
            tpl.plans = vec![ElemPlan::default(); tpl.elems.len()];
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
        for tpl in &mut self.compiled.templates {
            tpl.ref_child_plans = vec![RefChildPlan::Unplanned; tpl.ref_children.len()];
        }
        for (t, id) in ref_children {
            let RefChild { node: m, owner, .. } =
                self.compiled.templates[t.index()].ref_children[id.index()];
            // Content of a box is not planned.
            let dead = match owner {
                Some(e) => self.is_box(t, e),
                None => self.compiled.templates[t.index()]
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
            let plan = match self.plan_ref(t, scope, m) {
                Ok(p) => RefChildPlan::Ref(p),
                // A reference that cannot be planned is boxed where it
                // stands (ADR 0027).
                Err(error) => {
                    self.errors.push(Diagnostic::error(Some(m), &error));
                    self.boxed_here.insert(m);
                    RefChildPlan::Boxed
                }
            };
            self.compiled.templates[t.index()].ref_child_plans[id.index()] = plan;
        }
        self.planning.take().expect("planning")
    }

    /// Plans element `e`, and records what holds it (`plan_hold`,
    /// ADR 0022) beside its plans. Every element is planned here and
    /// nowhere else, so `fixed` holds whatever planned it: no planner
    /// applies it, and none can leave it out. A planner reads the source,
    /// the name table and what outlining made, never another element's plan
    /// (ADR 0029), so elements are planned in any order, each once.
    pub(in crate::compile) fn plan_elem(&mut self, t: TemplateId, e: ElemId) {
        // A box, made when outlining or boxed in place, is planned as it is.
        if self.is_box(t, e) {
            return;
        }
        let planned_as = self.compiled.templates[t.index()].elems[e.index()].planned_as;
        let _s = crate::trace::tally(planned_as.tag());
        let r = self.plan_elem_inner(t, e).and_then(|()| {
            let hold = crate::trace::tally("hold").run(|| self.plan_hold(t, e))?;
            self.compiled.templates[t.index()].plans[e.index()].hold = hold;
            Ok(())
        });
        // Boxed where it fails; what reads it reads the box.
        if let Err(error) = r {
            self.box_in_place(t, e, error);
        }
    }

    fn plan_elem_inner(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let component_type = self.compiled.templates[t.index()].elems[e.index()].planned_as;
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
            ElemShape::ByType(extend) => match Self::planner(component_type) {
                Planner::Props | Planner::PropsThen(_) => self.plan_attrs(t, e, extend),
                Planner::Plan(plan) => self.plan_with_extend(t, e, extend, plan),
                Planner::Whole(plan) => plan(&mut PlanCtx::new(self, t, e, None)),
            },
        }
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
        } = self.compiled.templates[t.index()].elems[e.index()];
        if cloned {
            // A clone is a copy of its original.
            let original = self.compiled.templates[t.index()].elems[e.index()].extend;
            self.compiled.templates[t.index()].plans[e.index()].extend = original;
            return Ok(ElemShape::Cloned);
        }
        if el == NodeId::NONE {
            return Ok(ElemShape::Synthetic);
        }
        // Every `extend` was planned when outlining (ADR 0031). A container
        // copy got its clones then too.
        let extend = self.compiled.templates[t.index()].elems[e.index()].extend;
        if let Some(p) = extend
            && component_type.container()
            && self.compiled.refs[p.index()].prop.is_none()
        {
            self.compiled.templates[t.index()].plans[e.index()].extend = Some(p);
            return Ok(ElemShape::ContainerCopy(p));
        }
        let extend = match extend {
            Some(p) => {
                // An extend of a box is planned from nothing (ADR 0027).
                self.referent_type(t, e, p)?;
                // `<point extend="$c.center"/>`, `<math extend="$c.radius"/>`,
                // `<pointList extend="$l.points"/>`: the element's value
                // props alias the named prop. An extend across related
                // types names the referent's default prop already
                // (`plan_extend`).
                if self.compiled.refs[p.index()].prop.is_some() {
                    return Ok(ElemShape::ExtendProp(p));
                }
                Some(p)
            }
            None => None,
        };
        self.compiled.templates[t.index()].plans[e.index()].extend = extend;
        Ok(ElemShape::ByType(extend))
    }

    /// Plans the synthesized root of a DAST that was not normalized: it has
    /// no source, so only its deferred props, which every root's are.
    fn plan_synthetic(&mut self, t: TemplateId, e: ElemId) {
        let component_type = self.compiled.templates[t.index()].elems[e.index()].component_type;
        let mut props = vec![Source::absent(); component_type.prop_defs().len()];
        Deferred::mark(component_type, &mut props);
        self.compiled.templates[t.index()].plans[e.index()].props = props;
    }

    /// A plan naming prop `prop` of element `e` in the parent template, as
    /// seen from the repeat's own template (one hop up).
    pub(in crate::compile) fn own_prop_plan(&mut self, e: ElemId, prop: &'static str) -> RefId {
        self.compiled.refs.push(RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: Some(RefProp::Named(prop)),
            display: RefDisplay::Spelled(format!("(repeat).{prop}").into()),
            node: NodeId::NONE,
        });
        RefId::from_index(self.compiled.refs.len() - 1)
    }
}

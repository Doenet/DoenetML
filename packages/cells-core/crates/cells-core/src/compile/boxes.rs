//! Boxing, which outlining, planning and linking all do: an element that
//! fails becomes an `_error` element where it fails, keeping its name, and
//! what is under it dies with it. Boxing writes only its own table; the
//! build reads the box's row instead of what other stages made of it.
//! What it records is a [`Boxes`], which the driver hands to each stage
//! that boxes and to no other: a stage without one cannot box.

use crate::compile::*;

/// What boxing records: the nodes an earlier compile boxed, the nodes
/// boxed here with their errors, and the first failure no element could
/// carry. Every stage reads the box table ([`Tables::boxes`]); only what
/// holds a [`Boxes`] writes it (`mark`).
pub(in crate::compile) struct Boxes<'a> {
    /// Nodes an earlier compile could not build: outlining compiles each
    /// as an `_error` element with its name but no children and no props.
    pub(in crate::compile) prior: &'a HashSet<NodeId>,
    /// Elements boxed where they failed, with their errors.
    errors: Vec<Diagnostic>,
    here: HashSet<NodeId>,
    /// The first failure no element could carry: the stage goes on, and
    /// the compile ends with it once the stage is done.
    restart: Option<Failure>,
    /// The stage running now, which boxes what it boxes (`enter`).
    stage: Stage,
}

/// What boxing records: the boxes' errors, and the failure to compile again
/// from.
impl<'a> Boxes<'a> {
    pub(in crate::compile) fn new(prior: &'a HashSet<NodeId>) -> Self {
        Boxes {
            prior,
            errors: Vec::new(),
            here: HashSet::new(),
            restart: None,
            stage: Stage::Outline,
        }
    }

    /// Records `node` as boxed here, with its error.
    pub(in crate::compile) fn record(&mut self, node: NodeId, error: &Error) {
        self.errors.push(Diagnostic::error(Some(node), error));
        self.here.insert(node);
    }

    /// A failure no element can carry: kept, the first of them, for the
    /// compile to end with once the stage is done.
    pub(in crate::compile) fn fail(&mut self, error: Error, node: Option<NodeId>) {
        self.restart.get_or_insert(Failure { error, node });
    }

    /// The failure to compile again from, when a stage recorded one.
    pub(in crate::compile) fn restart_if_needed(&mut self) -> std::result::Result<(), Failure> {
        self.restart.take().map_or(Ok(()), Err)
    }

    /// Every node boxed, by an earlier compile or this one.
    pub(in crate::compile) fn all(&self) -> HashSet<NodeId> {
        let mut all = self.prior.clone();
        all.extend(self.here.iter().copied());
        all
    }

    /// Marks element `e` a box in `boxes`, a template's box table: the
    /// one write to that table, which only a holder of a [`Boxes`] makes.
    fn mark(&self, boxes: &mut [BoxState], e: ElemId, state: BoxState) {
        boxes[e.index()] = state;
    }

    /// Drops the errors reported on `nodes`.
    fn drop_errors_on(&mut self, nodes: &HashSet<NodeId>) {
        self.errors
            .retain(|d| !d.node.is_some_and(|n| nodes.contains(&n)));
    }

    /// The errors of the elements boxed here, once every stage is done.
    pub(in crate::compile) fn into_errors(self) -> Vec<Diagnostic> {
        self.errors
    }
}

/// Boxing: an element that fails made an `_error` element where it fails, and
/// what is under it with it. Writes only the boxes table (ADR 0031), and reads
/// outlining's rows, which it is handed; run by outlining, planning and
/// linking.
impl Boxes<'_> {
    /// The stage boxing from now on: the stage each box records as its
    /// maker, and which boxes a reader of a referent's type sees.
    pub(in crate::compile) fn enter(&mut self, stage: Stage) {
        self.stage = stage;
    }

    /// Whether element `e` is a box a reader of its type may see now: while
    /// planning, only outlining's.
    pub(in crate::compile) fn is_visible(
        &self,
        tables: &[Tables],
        t: TemplateId,
        e: ElemId,
    ) -> bool {
        match &tables[t.index()].boxes[e.index()] {
            BoxState::Live => false,
            BoxState::Boxed { by, .. } => self.stage != Stage::Plan || *by == Stage::Outline,
        }
    }

    /// Box element `e` where it failed: it becomes an `_error` element
    /// keeping its name, everything under it (its children, the templates
    /// of its repeats and choices) is dead, and the compile goes on. What
    /// read its facts is boxed in turn when linking.
    ///
    /// A clone is boxed silently. Any other element with no node is boxed
    /// all the same, and the failure recorded (the first, when there are
    /// several) to fail the compile once the stage is done.
    pub(in crate::compile) fn box_in_place(
        &mut self,
        templates: &[Outlined],
        tables: &mut [Tables],
        t: TemplateId,
        e: ElemId,
        error: Error,
    ) {
        let Elem { node, cloned, .. } = templates[t.index()].elems[e.index()];
        let doomed = subtree(templates, t, e);
        if node != NodeId::NONE {
            self.record(node, &error);
        } else if !cloned {
            self.fail(error, None);
        }
        for (dt, de) in doomed {
            self.make_box(templates, tables, dt, de, (dt, de) != (t, e));
        }
    }

    /// Drop what boxes leave out of the diagnostics, once every stage that
    /// boxes is done: a box reports its error and nothing else, and what is
    /// under a box reports nothing. `warnings` are the planners'.
    pub(in crate::compile) fn drop_reports_of_boxes(
        &mut self,
        templates: &[Outlined],
        tables: &[Tables],
        warnings: &mut Vec<Diagnostic>,
    ) {
        let view = |t: TemplateId| TemplateRef {
            outlined: &templates[t.index()],
            tables: &tables[t.index()],
        };
        let mut boxes = HashSet::new();
        let mut dead = HashSet::new();
        for t in TemplateId::below(templates.len()) {
            let tpl = view(t);
            for (el, b) in tpl.outlined.elems.iter().zip(&tpl.tables.boxes) {
                if let BoxState::Boxed { dead: d, .. } = b
                    && el.node != NodeId::NONE
                {
                    if *d {
                        dead.insert(el.node);
                    }
                    boxes.insert(el.node);
                }
            }
        }
        // A `$ref` child's box is under a box when what it is a child of is.
        for t in TemplateId::below(templates.len()) {
            let tpl = view(t);
            for (rc, plan) in tpl
                .outlined
                .ref_children
                .iter()
                .zip(&tpl.tables.ref_child_plans)
            {
                let under_box = match rc.owner {
                    Some(e) => tpl.is_box(e),
                    None => tpl
                        .outlined
                        .parent
                        .is_some_and(|(pt, pe)| view(pt).is_box(pe)),
                };
                if *plan == RefChildPlan::Boxed && under_box {
                    dead.insert(rc.node);
                }
            }
        }
        if boxes.is_empty() && dead.is_empty() {
            return;
        }
        self.drop_errors_on(&dead);
        warnings.retain(|d| !d.node.is_some_and(|n| boxes.contains(&n)));
    }

    /// Makes `e` a box in boxing's table: an `_error` element with no
    /// props, children or body as the build sees it, or, `dead`, one under
    /// a box, which no build makes.
    pub(in crate::compile) fn make_box(
        &mut self,
        templates: &[Outlined],
        tables: &mut [Tables],
        t: TemplateId,
        e: ElemId,
        dead: bool,
    ) {
        let by = self.stage;
        let row = Box::new(templates[t.index()].elems[e.index()].as_box());
        self.mark(
            &mut tables[t.index()].boxes,
            e,
            BoxState::Boxed { row, by, dead },
        );
    }
}

/// Element `e` and everything under it: its children, theirs, and the
/// elements of every template a repeat or choice among them owns.
fn subtree(templates: &[Outlined], t: TemplateId, e: ElemId) -> Vec<(TemplateId, ElemId)> {
    let mut seen: HashSet<(TemplateId, ElemId)> = HashSet::from([(t, e)]);
    let mut out = vec![(t, e)];
    let mut i = 0;
    while i < out.len() {
        let (ct, ce) = out[i];
        i += 1;
        let el = &templates[ct.index()].elems[ce.index()];
        let mut under: Vec<(TemplateId, ElemId)> = el
            .children
            .iter()
            .filter_map(|c| match c {
                Child::Elem(x) => Some((ct, *x)),
                _ => None,
            })
            .collect();
        for (ti, tpl) in templates.iter().enumerate() {
            if tpl.parent == Some((ct, ce)) {
                let sub = TemplateId::from_index(ti);
                under.extend((0..tpl.elems.len()).map(|x| (sub, ElemId::from_index(x))));
            }
        }
        for k in under {
            if seen.insert(k) {
                out.push(k);
            }
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use crate::compile::*;
    use crate::testing::dast::{document, el, mac};

    /// Template and element of the element named `name`.
    fn find(compiled: &Compiled, name: &str) -> (TemplateId, ElemId) {
        for (ti, tpl) in compiled.plans.templates.iter().enumerate() {
            for (ei, e) in tpl.elems.iter().enumerate() {
                if e.name != StrId::NONE && compiled.dast.strings.get(e.name).trim() == name {
                    return (TemplateId::from_index(ti), ElemId::from_index(ei));
                }
            }
        }
        panic!("no element named {name}");
    }

    /// Boxing writes only its own table: an element boxed while
    /// planning keeps the row outlining made, and so does one under it,
    /// while the build reads the box's row and makes nothing under it.
    #[test]
    fn a_box_keeps_what_outlining_made_of_it() {
        let dast = document([el("graph")
            .name("g")
            .attr("xmin", mac("nope"))
            .child(el("point").name("a").attr("x", "1"))]);
        let compiled = crate::testing::compile(&dast).unwrap();
        let (t, g) = find(&compiled, "g");
        let (_, a) = find(&compiled, "a");
        let tpl = &compiled.plans.templates[t.index()];
        assert!(tpl.view().is_box(g) && !tpl.is_dead(g));
        assert_eq!(tpl.elems[g.index()].component_type, ComponentType::Graph);
        assert_eq!(tpl.elems[g.index()].children.len(), 1);
        assert_eq!(tpl.row(g).component_type, ComponentType::Error);
        assert!(tpl.row(g).children.is_empty());
        assert!(tpl.is_dead(a));
        assert_eq!(tpl.elems[a.index()].component_type, ComponentType::Point);
    }

    /// A `$ref` child that cannot be planned is boxed in planning's table
    /// of `$ref` children: no element is made for it, and the child list
    /// outlining made is left as it made it.
    #[test]
    fn a_ref_child_that_cannot_be_planned_is_boxed_in_planning_table() {
        let dast = document([el("p").name("p").child(mac("nope"))]);
        let compiled = crate::testing::compile(&dast).unwrap();
        let (t, p) = find(&compiled, "p");
        let tpl = &compiled.plans.templates[t.index()];
        assert!(
            tpl.elems
                .iter()
                .all(|e| e.component_type != ComponentType::Error)
        );
        let [Child::Macro(id)] = tpl.elems[p.index()].children[..] else {
            panic!("one $ref child");
        };
        assert_eq!(tpl.tables.ref_child_plans[id.index()], RefChildPlan::Boxed);
        assert!(
            compiled
                .diagnostics
                .iter()
                .any(|d| d.code == "doenet-w0104")
        );
    }
}

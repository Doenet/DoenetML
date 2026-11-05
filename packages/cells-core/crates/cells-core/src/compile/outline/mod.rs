//! Outlining, the compile's first stage (ADR 0027, ADR 0029, ADR 0030):
//! every element, template and name from the DAST, what a reference reads
//! of each that its own source settles (`settle_outline`), container
//! copies' clones (`copies.rs`), a choice's branches (`choice.rs`) and an
//! answer's synthetic children (`answer.rs`). It plans nothing; it returns
//! the work it found for parsing and planning (`Outline`) and what it
//! settled for every later stage (`Settled`).

mod answer;
mod choice;
mod copies;

use crate::compile::*;

/// Outlining's working state, a local of `Compiler::outline` handed down
/// the walk: the `Outline` it fills for the stages after it, and what it
/// needs only while it runs.
#[derive(Default)]
pub(in crate::compile) struct Outlining {
    /// What outlining hands on, as it fills it.
    pub(in crate::compile) work: Outline,
    /// The container copies (`<graph extend="$g"/>`) the walk found, which
    /// get their clones once every name is in the table
    /// (`expand_container_copies`).
    pub(in crate::compile) container_copies: Vec<(TemplateId, ElemId)>,
    /// By (template, element), the container copies expanding now and
    /// those done: one reached again while it expands is a cycle.
    pub(in crate::compile) expanding: HashSet<(u32, u32)>,
    pub(in crate::compile) expanded: HashSet<(u32, u32)>,
}

impl Compiler<'_> {
    /// Outlining: every element, template and name, and what a reference
    /// reads of each that its own source settles (`settle_outline`); once
    /// every name is in the table, container copies get their clones,
    /// which completes the element set. Nothing is planned. Returns the
    /// work it found for the stages after it; what it settled is
    /// `Compiler::settled`.
    pub(in crate::compile) fn outline(&mut self) -> Outline {
        let dast = self.dast;
        let mut o = Outlining::default();
        let o = &mut o;
        // Template 0, the document's.
        self.push_template(None);
        // Template 0 is the document: its one child is the root component.
        let doc_el = dast
            .children(Dast::ROOT)
            .iter()
            .copied()
            .find(|&n| dast.kind(n) == NodeKind::Element && dast.str(n) == "document");
        let children = match doc_el {
            Some(el) => vec![Child::Elem(self.add_elem(
                o,
                TemplateId::new(0),
                el,
                ROOT_SCOPE,
            ))],
            None => {
                // Synthesize a root when the DAST was not normalized; it is
                // planned with every element (`plan_synthetic`).
                let e =
                    self.add_synthetic(TemplateId::new(0), ComponentType::Document, StrId::NONE);
                o.work.to_plan.push((TemplateId::new(0), e));
                let kids = self.add_children(
                    o,
                    TemplateId::new(0),
                    Some(e),
                    ROOT_SCOPE,
                    dast.children(Dast::ROOT),
                );
                self.outlined_mut(TemplateId::new(0)).elems[e.index()].children = kids;
                vec![Child::Elem(e)]
            }
        };
        self.outlined_mut(TemplateId::new(0)).children = children;
        {
            let _s = crate::trace::span("container copies");
            crate::trace::count("copies", o.container_copies.len());
            self.expand_container_copies(o);
        }
        crate::trace::span("extends").run(|| self.plan_extends(o));
        crate::trace::span("answer children").run(|| self.add_answer_children(o));
        std::mem::take(&mut o.work)
    }

    pub(in crate::compile) fn push_elem(
        &mut self,
        t: TemplateId,
        node: NodeId,
        component_type: ComponentType,
        name: StrId,
        name_scope: ElemId,
    ) -> Result<ElemId> {
        self.push_elem_visible_to(t, node, component_type, name, name_scope, ROOT_SCOPE)
    }

    /// `push_elem` whose name is registered only up to ancestor `stop`
    /// (inclusive): a container copy's children are reached through the
    /// copy's name, never bare, so they do not make the original ambiguous.
    pub(in crate::compile) fn push_elem_visible_to(
        &mut self,
        t: TemplateId,
        node: NodeId,
        component_type: ComponentType,
        name: StrId,
        name_scope: ElemId,
        stop: ElemId,
    ) -> Result<ElemId> {
        // Only outlining makes and names elements (ADR 0030).
        let dast = self.dast;
        self.tables[t.index()].boxes.push(BoxState::Live);
        let Settled {
            names, templates, ..
        } = self.settled_mut();
        let tpl = &mut templates[t.index()];
        let name_id = (name != StrId::NONE).then(|| {
            let s = dast.strings.get(name).trim();
            let id = match names.ids.get(s) {
                Some(&id) => id,
                None => {
                    let id = names.ids.len() as u32;
                    names.ids.insert(s.into(), id);
                    names.texts.push(s.into());
                    id
                }
            };
            let by_str = &mut names.by_str;
            if by_str.len() <= name.index() {
                by_str.resize(dast.strings.len().max(name.index() + 1), NO_NAME);
            }
            by_str[name.index()] = id;
            id
        });
        let e = tpl.elems.len();
        tpl.elems.push(Elem {
            node,
            component_type,
            name,
            name_scope,
            children: Vec::new(),
            extend: None,
            cloned: false,
            planned_as: component_type,
            body: Body::Plain,
            clones_pending: false,
        });
        if let Some(id) = name_id {
            // Two siblings with one name can never be told apart.
            if !names.siblings.insert((t.get(), name_scope.get(), id)) {
                let s = dast.strings.get(name).trim().to_string();
                return Err(Error::DuplicateName(s));
            }
            // Visible from every ancestor up to the template root (or `stop`).
            let mut a = name_scope;
            loop {
                names
                    .by_scope
                    .entry((t.get(), a.get(), id))
                    .and_modify(|o| *o = AMBIGUOUS)
                    .or_insert(e as u32);
                if a == ROOT_SCOPE || a == stop {
                    break;
                }
                a = tpl.elems[a.index()].name_scope;
            }
        }
        Ok(ElemId::from_index(e))
    }

    pub(in crate::compile) fn add_synthetic(
        &mut self,
        t: TemplateId,
        component_type: ComponentType,
        name: StrId,
    ) -> ElemId {
        self.push_elem(t, NodeId::NONE, component_type, name, ROOT_SCOPE)
            .expect("synthetic names are unique")
    }

    /// Create an element (and, for a repeat, its template) from a DAST
    /// element. A boxed node becomes an `_error` element, and so does one
    /// that fails: each element boxes its own failure, so a failure under
    /// `el` boxes the innermost failing element and leaves `el` be.
    pub(in crate::compile) fn add_elem(
        &mut self,
        o: &mut Outlining,
        t: TemplateId,
        el: NodeId,
        name_scope: ElemId,
    ) -> ElemId {
        if self.boxed.contains(&el) {
            return self.push_error_elem(t, el, name_scope);
        }
        let n = self.outlined(t).elems.len();
        match self.add_elem_inner(o, t, el, name_scope) {
            Ok(e) => e,
            // The element is boxed where it fails (ADR 0027): the one
            // made for it, when it got that far, else a new one.
            Err(error) if self.outlined(t).elems.len() > n => {
                let e = ElemId::from_index(n);
                // A duplicate name was never registered; the box carries
                // none. Outlining's own row, before it is boxed.
                self.drop_unregistered_name(t, e);
                self.box_in_place(t, e, error);
                e
            }
            Err(error) => {
                self.errors.push(Diagnostic::error(Some(el), &error));
                self.boxed_here.insert(el);
                self.push_error_elem(t, el, name_scope)
            }
        }
    }

    fn add_elem_inner(
        &mut self,
        o: &mut Outlining,
        t: TemplateId,
        el: NodeId,
        name_scope: ElemId,
    ) -> Result<ElemId> {
        let d = self.dast;
        let tag = d.str(el);
        let component_type =
            ComponentType::from_tag(tag).ok_or_else(|| Error::UnsupportedTag(tag.to_string()))?;
        // `<group rendered="c">` is a conditional content with one case.
        let component_type =
            if component_type == ComponentType::Group && d.attr(el, "rendered").is_some() {
                ComponentType::ConditionalContent
            } else {
                component_type
            };
        if component_type == ComponentType::Case {
            return Err(Error::Unsupported(
                "<case> outside a <conditionalContent>".into(),
            ));
        }
        let name = self.attr_name_str(el, "name").unwrap_or(StrId::NONE);
        let e = self.push_elem(t, el, component_type, name, name_scope)?;
        o.work.to_plan.push((t, e));
        if self.is_container_copy(t, e) {
            o.container_copies.push((t, e));
            self.outlined_mut(t).elems[e.index()].clones_pending = true;
        }
        let child_scope = e;
        match component_type {
            ComponentType::FunctionIterates => {
                // One hidden tuple per iteration, planned with the element
                // (`plan_function_iterates`); it is element 0 of the body.
                let sub = self.push_template(Some((t, e)));
                let it = self.add_synthetic(sub, ComponentType::Tuple, StrId::NONE);
                self.outlined_mut(sub).children = vec![Child::Elem(it)];
                self.outlined_mut(t).elems[e.index()].body = Body::Repeat { template: sub };
            }
            ComponentType::RepeatForSequence | ComponentType::RepeatFor => {
                let sub = self.push_template(Some((t, e)));
                // Hidden iteration components first, so `$v` and `$i` resolve
                // anywhere inside the template; the repeat's planner plans
                // them (`plan_iteration_names`). A `<repeat>`'s item is a
                // tuple, element 0 of the body (`plan_repeat_for`).
                let value_type = if component_type == ComponentType::RepeatFor {
                    ComponentType::Tuple
                } else {
                    ComponentType::SequenceValue
                };
                if let Some(vn) = self.attr_name_str(el, "valueName") {
                    self.add_synthetic(sub, value_type, vn);
                }
                if let Some(iname) = self.attr_name_str(el, "indexName") {
                    self.add_synthetic(sub, ComponentType::Number, iname);
                }
                let kids = self.add_children(o, sub, None, ROOT_SCOPE, d.children(el));
                self.outlined_mut(sub).children = kids;
                self.outlined_mut(t).elems[e.index()].body = Body::Repeat { template: sub };
            }
            ComponentType::Collect | ComponentType::PointList => {}
            ComponentType::ConditionalContent | ComponentType::Select => {
                self.add_choice(o, t, e, el)?
            }
            // An answer's and an award's element children are components
            // (inputs, awards, whens); their text and `$ref`s are math the
            // answer's planner reads. A when's content is a condition.
            ComponentType::Answer | ComponentType::Award => {
                let mut kids = Vec::new();
                for &n in d.children(el) {
                    if d.kind(n) == NodeKind::Element {
                        kids.push(Child::Elem(self.add_elem(o, t, n, child_scope)));
                    }
                }
                self.outlined_mut(t).elems[e.index()].children = kids;
            }
            ComponentType::When => {}
            // Children the type reads (`children:`, ADR 0034) are parsed
            // into its record, not built: a number's value, a point's
            // constraints. Its presentational children (`<label>`) are
            // components all the same, for the renderer to read (ADR 0024).
            _ if !component_type.def().children.built() => {
                let presentational: Vec<NodeId> = d
                    .children(el)
                    .iter()
                    .copied()
                    .filter(|&n| self.is_presentation_child(n))
                    .collect();
                if !presentational.is_empty() {
                    let kids = self.add_children(o, t, Some(e), child_scope, &presentational);
                    self.outlined_mut(t).elems[e.index()].children = kids;
                }
            }
            _ => {
                let kids = self.add_children(o, t, Some(e), child_scope, d.children(el));
                self.outlined_mut(t).elems[e.index()].children = kids;
            }
        }
        self.settle_outline(o, t, e, el)?;
        Ok(e)
    }

    /// What a reference to `e` reads that its own source settles, read here
    /// so no planner reads another's plan (ADR 0029): a `<math>`'s type,
    /// from its text, tokenized here once (`math::settled_type`); what a
    /// `<collect>` (its `componentType`) or a `<polyline>` (points)
    /// collects. Its planner plans as this says, and adds a collect's
    /// `from`.
    fn settle_outline(
        &mut self,
        o: &mut Outlining,
        t: TemplateId,
        e: ElemId,
        el: NodeId,
    ) -> Result<()> {
        let d = self.dast;
        let elem = &self.outlined(t).elems[e.index()];
        let component_type = match elem.component_type {
            ComponentType::Math => {
                let mt = self.math_text(d.children(el));
                let k = match &mt {
                    Ok(mt) => crate::components::values::math::settled_type(mt.tokens()),
                    Err(_) => ComponentType::Math,
                };
                self.outlined_mut(t).elems[e.index()].component_type = k;
                o.work.math_texts.push(((t, e), mt));
                return Ok(());
            }
            ComponentType::Collect => crate::components::structure::collect::collected_type(
                d.attr(el, "componentType").and_then(|a| self.attr_text(a)),
            )?,
            ComponentType::Polyline => crate::components::geometry::polyline::COLLECTED,
            _ => return Ok(()),
        };
        self.outlined_mut(t).elems[e.index()].body = Body::Collect { component_type };
        Ok(())
    }

    pub(in crate::compile) fn add_children(
        &mut self,
        o: &mut Outlining,
        t: TemplateId,
        owner: Option<ElemId>,
        name_scope: ElemId,
        nodes: &[NodeId],
    ) -> Vec<Child> {
        let d = self.dast;
        let mut kids = Vec::with_capacity(nodes.len());
        for &n in nodes {
            match d.kind(n) {
                NodeKind::Element => {
                    let tag = d.str(n);
                    // Normalizer-synthesized elements: `_repeatSetup` holds
                    // placeholders the expansion creates itself.
                    if tag == "_dynamicChildren" || tag == "_repeatSetup" {
                        continue;
                    }
                    kids.push(Child::Elem(self.add_elem(o, t, n, name_scope)));
                }
                // Whitespace-only text between lines is layout and would only
                // become a DOM node; a space between inline items is content
                // (`The $animal $verb.`).
                NodeKind::Text
                    if d.str(n).trim().is_empty()
                        && (d.str(n).contains('\n') || kids.is_empty()) => {}
                NodeKind::Text => kids.push(Child::Text(d.str_id(n))),
                NodeKind::Macro => {
                    if self.boxed.contains(&n) {
                        kids.push(Child::Elem(self.push_error_elem(t, n, name_scope)));
                        continue;
                    }
                    let tpl = self.outlined_mut(t);
                    let id = RefChildId::from_index(tpl.ref_children.len());
                    tpl.ref_children.push(RefChild {
                        node: n,
                        owner,
                        has_index: d.macro_has_index(n),
                    });
                    o.work.macros.push((t, id));
                    kids.push(Child::Macro(id));
                }
                NodeKind::Other => {}
            }
        }
        kids
    }
}

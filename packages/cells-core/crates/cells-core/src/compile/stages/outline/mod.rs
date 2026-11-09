//! Outlining, the compile's first stage: every element, template and name
//! from the DAST, what a reference reads of each that its own source
//! settles, container copies' clones, a choice's branches and an answer's
//! synthetic children. It plans nothing.

mod answer;
mod choice;
mod copies;

use crate::compile::*;

/// Outlining's view: the source, what it settles as it makes it, the rows of
/// the tables it makes for each element, the [`Outline`] it fills for the
/// stages after it, and what it needs only while it runs. The driver takes
/// what it made apart once it is done; nothing writes [`Settled`] after.
struct Outlining<'a> {
    /// The source being compiled.
    dast: &'a Dast,
    /// What outlining settles, as it makes it.
    settled: Settled,
    /// Boxing's and planning's tables: a template's and an element's row
    /// for each outlining makes.
    tables: Vec<Tables>,
    /// What outlining appends to: the reference plans of extends, clones
    /// and an answer's whens.
    ar: Arenas,
    /// What boxing records, outlining's while it runs.
    boxes: Boxes<'a>,
    /// What outlining hands on, as it fills it.
    work: Outline,
    /// The container copies (`<graph extend="$g"/>`) the walk found, which
    /// get their clones once every name is in the table.
    container_copies: Vec<(TemplateId, ElemId)>,
    /// By (template, element), the container copies expanding now and
    /// those done: one reached again while it expands is a cycle.
    expanding: HashSet<(TemplateId, ElemId)>,
    expanded: HashSet<(TemplateId, ElemId)>,
}

/// Outline `dast`, with what boxing records: what it settles, its rows of
/// boxing's and planning's tables, the arenas it appended to, the boxes, and
/// the work it found for the stages after it.
pub(in crate::compile) fn outline<'a>(
    dast: &'a Dast,
    boxes: Boxes<'a>,
) -> (Settled, Vec<Tables>, Arenas, Boxes<'a>, Outline) {
    let mut outlining = Outlining::new(dast, boxes);
    crate::trace::span("outline").run(|| outlining.outline());
    let Outlining {
        settled,
        tables,
        ar,
        boxes,
        work,
        ..
    } = outlining;
    (settled, tables, ar, boxes, work)
}

/// Outlining: elements, templates and names from the DAST, and what a reference
/// reads of each; plans nothing (ADR 0030). Writes what it settles
/// ([`Settled`]) and the work for the stages after it ([`Outline`]).
impl<'a> Outlining<'a> {
    /// Outlining of `dast`, with what boxing records: nothing made yet.
    fn new(dast: &'a Dast, boxes: Boxes<'a>) -> Self {
        Outlining {
            dast,
            settled: Settled::default(),
            tables: Vec::new(),
            ar: Arenas::default(),
            boxes,
            work: Outline::default(),
            container_copies: Vec::new(),
            expanding: HashSet::new(),
            expanded: HashSet::new(),
        }
    }

    /// Outline the document: what it settles in `settled`, its rows of the
    /// tables in `tables`, and the work for the stages after it in `work`.
    fn outline(&mut self) {
        let dast = self.dast;
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
                TemplateId::new(0),
                el,
                ROOT_SCOPE,
            ))],
            None => {
                // Synthesize a root when the DAST was not normalized; it is
                // planned with every element (`plan_synthetic`).
                let e = self.add_synthetic(TemplateId::new(0), Role::Root.ty(), StrId::NONE);
                self.work.to_plan.push((TemplateId::new(0), e));
                let kids = self.add_children(
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
            crate::trace::count("copies", self.container_copies.len());
            self.expand_container_copies();
        }
        crate::trace::span("extends").run(|| self.plan_extends());
        crate::trace::span("answer children").run(|| self.add_answer_children());
    }

    /// What outlining has settled so far, read-only: what the readers read.
    fn rd(&self) -> Reader<'_> {
        Reader::new(self.dast, &self.settled)
    }

    /// Outlining's part of template `t`, as made so far.
    fn outlined(&self, t: TemplateId) -> &Outlined {
        &self.settled.templates[t.index()]
    }

    /// Outlining's part of template `t`, to make.
    fn outlined_mut(&mut self, t: TemplateId) -> &mut Outlined {
        &mut self.settled.templates[t.index()]
    }

    /// Adds a template to outlining's part and to the tables; only
    /// outlining makes one.
    fn push_template(&mut self, parent: Option<(TemplateId, ElemId)>) -> TemplateId {
        let t = TemplateId::from_index(self.tables.len());
        self.settled.templates.push(Outlined {
            parent,
            ..Default::default()
        });
        self.tables.push(Tables::default());
        t
    }

    fn push_elem(
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
    fn push_elem_visible_to(
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
        } = &mut self.settled;
        let tpl = &mut templates[t.index()];
        let name_id = (name != StrId::NONE).then(|| {
            let s = dast.strings.get(name).trim();
            let id = match names.ids.get(s) {
                Some(&id) => id,
                None => {
                    let id = NameId::from_index(names.ids.len());
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
            if !names.siblings.insert((t, name_scope, id)) {
                let s = dast.strings.get(name).trim().to_string();
                return Err(Error::DuplicateName(s));
            }
            // Visible from every ancestor up to the template root (or `stop`).
            let mut a = name_scope;
            loop {
                names
                    .by_scope
                    .entry((t, a, id))
                    .and_modify(|o| *o = AMBIGUOUS)
                    .or_insert(ElemId::from_index(e));
                if a == ROOT_SCOPE || a == stop {
                    break;
                }
                a = tpl.elems[a.index()].name_scope;
            }
        }
        Ok(ElemId::from_index(e))
    }

    /// The `_error` element standing for boxed node `node`: no children,
    /// no props, and the element's name, so a reference to it resolves and
    /// reads as undefined. A name a sibling already holds is left off.
    fn push_error_elem(&mut self, t: TemplateId, node: NodeId, name_scope: ElemId) -> ElemId {
        let name = match self.dast.kind(node) {
            NodeKind::Element => self.rd().attr_name_str(node, "name").unwrap_or(StrId::NONE),
            _ => StrId::NONE,
        };
        // A name a sibling holds fails to register, but the element is
        // pushed all the same.
        let e = ElemId::from_index(self.outlined(t).elems.len());
        let _ = self.push_elem(t, node, Role::Refused.ty(), name, name_scope);
        self.drop_unregistered_name(t, e);
        self.boxes
            .make_box(&self.settled.templates, &mut self.tables, t, e, false);
        e
    }

    /// Leaves `e` its name only when the name table holds the name for it:
    /// a box made for a duplicate name carries none.
    fn drop_unregistered_name(&mut self, t: TemplateId, e: ElemId) {
        let el = &self.outlined(t).elems[e.index()];
        if el.name == StrId::NONE {
            return;
        }
        let names = self.rd().names();
        let registered = names
            .id(self.dast.strings.get(el.name))
            .and_then(|id| names.entry(t, el.name_scope, id))
            .is_some_and(|x| x == e || x == AMBIGUOUS);
        if !registered {
            self.outlined_mut(t).elems[e.index()].name = StrId::NONE;
        }
    }

    fn add_synthetic(
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
    fn add_elem(&mut self, t: TemplateId, el: NodeId, name_scope: ElemId) -> ElemId {
        if self.boxes.prior.contains(&el) {
            return self.push_error_elem(t, el, name_scope);
        }
        let n = self.outlined(t).elems.len();
        match self.add_elem_inner(t, el, name_scope) {
            Ok(e) => e,
            // The element is boxed where it fails (ADR 0027): the one
            // made for it, when it got that far, else a new one.
            Err(error) if self.outlined(t).elems.len() > n => {
                let e = ElemId::from_index(n);
                // A duplicate name was never registered; the box carries
                // none. Outlining's own row, before it is boxed.
                self.drop_unregistered_name(t, e);
                self.boxes
                    .box_in_place(&self.settled.templates, &mut self.tables, t, e, error);
                e
            }
            Err(error) => {
                self.boxes.record(el, &error);
                self.push_error_elem(t, el, name_scope)
            }
        }
    }

    fn add_elem_inner(&mut self, t: TemplateId, el: NodeId, name_scope: ElemId) -> Result<ElemId> {
        let d = self.dast;
        let tag = d.str(el);
        let component_type =
            ComponentType::from_tag(tag).ok_or_else(|| Error::UnsupportedTag(tag.to_string()))?;
        // `<group rendered="c">` is a conditional content with one case.
        let component_type = component_type.rewritten(|attr| d.attr(el, attr).is_some());
        // A case is a branch its choice makes, never an element of its own.
        if component_type.plays(Role::Case) {
            return Err(Error::Unsupported(component_type.free_owned_refusal()));
        }
        let name = self.rd().attr_name_str(el, "name").unwrap_or(StrId::NONE);
        let e = self.push_elem(t, el, component_type, name, name_scope)?;
        self.work.to_plan.push((t, e));
        if self.is_container_copy(t, e) {
            self.container_copies.push((t, e));
            self.outlined_mut(t).elems[e.index()].clones_pending = true;
        }
        let child_scope = e;
        match component_type {
            ComponentType::FunctionIterates => {
                // One hidden tuple per iteration, planned with the element
                // (`plan_function_iterates`); it is element 0 of the body.
                let sub = self.push_template(Some((t, e)));
                let it = self.add_synthetic(sub, Role::Item.ty(), StrId::NONE);
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
                    Role::Item.ty()
                } else {
                    Role::SequenceValue.ty()
                };
                if let Some(vn) = self.rd().attr_name_str(el, "valueName") {
                    self.add_synthetic(sub, value_type, vn);
                }
                if let Some(iname) = self.rd().attr_name_str(el, "indexName") {
                    self.add_synthetic(sub, Role::Index.ty(), iname);
                }
                let kids = self.add_children(sub, None, ROOT_SCOPE, d.children(el));
                self.outlined_mut(sub).children = kids;
                self.outlined_mut(t).elems[e.index()].body = Body::Repeat { template: sub };
            }
            ComponentType::Collect | ComponentType::PointList => {}
            ComponentType::ConditionalContent | ComponentType::Select => {
                self.add_choice(t, e, el)?
            }
            // An answer's and an award's element children are components
            // (inputs, awards, whens); their text and `$ref`s are math the
            // answer's planner reads. A when's content is a condition.
            ComponentType::Answer | ComponentType::Award => {
                let mut kids = Vec::new();
                for &n in d.children(el) {
                    if d.kind(n) == NodeKind::Element {
                        kids.push(Child::Elem(self.add_elem(t, n, child_scope)));
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
                    .filter(|&n| self.rd().is_presentation_child(n))
                    .collect();
                if !presentational.is_empty() {
                    let kids = self.add_children(t, Some(e), child_scope, &presentational);
                    self.outlined_mut(t).elems[e.index()].children = kids;
                }
            }
            _ => {
                let kids = self.add_children(t, Some(e), child_scope, d.children(el));
                self.outlined_mut(t).elems[e.index()].children = kids;
            }
        }
        self.settle_outline(t, e, el)?;
        Ok(e)
    }

    /// Settle what a reference to `e` reads that its own source settles,
    /// as its type declares ([`Settle`]): a `<math>`'s type, from its
    /// tokenized text; what a `<collect>` (its `componentType`) or a
    /// `<polyline>` (points) collects.
    fn settle_outline(&mut self, t: TemplateId, e: ElemId, el: NodeId) -> Result<()> {
        let d = self.dast;
        let component_type = match self.outlined(t).elems[e.index()]
            .component_type
            .def()
            .settle
        {
            Some(Settle::FromMathText(settled)) => {
                let mt = self.rd().math_text(d.children(el));
                if let Ok(mt) = &mt {
                    self.outlined_mut(t).elems[e.index()].component_type = settled(mt.tokens());
                }
                self.work.math_texts.push(((t, e), mt));
                return Ok(());
            }
            Some(Settle::Collects(of)) => of,
            Some(Settle::CollectsByAttr(attr)) => {
                let text = d
                    .attr(el, attr)
                    .and_then(|a| self.rd().attr_text(a))
                    .ok_or(Error::BadCollect)?;
                ComponentType::from_tag(text.trim())
                    .filter(|k| k.copyable())
                    .ok_or_else(|| Error::BadCollectType(text.trim().into()))?
            }
            None => return Ok(()),
        };
        self.outlined_mut(t).elems[e.index()].body = Body::Collect { component_type };
        Ok(())
    }

    fn add_children(
        &mut self,
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
                    kids.push(Child::Elem(self.add_elem(t, n, name_scope)));
                }
                // Whitespace-only text between lines is layout and would only
                // become a DOM node; a space between inline items is content
                // (`The $animal $verb.`).
                NodeKind::Text
                    if d.str(n).trim().is_empty()
                        && (d.str(n).contains('\n') || kids.is_empty()) => {}
                NodeKind::Text => kids.push(Child::Text(d.str_id(n))),
                NodeKind::Macro => {
                    if self.boxes.prior.contains(&n) {
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
                    self.work.macros.push((t, id));
                    kids.push(Child::Macro(id));
                }
                NodeKind::Other => {}
            }
        }
        kids
    }
}

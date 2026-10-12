//! Compile: walk the DAST once per template and plan every element's
//! props (literals, references, operators, math), with name lookup and
//! reference paths. See the module docs in `build/mod.rs`.

use super::*;

mod attrs;
mod choice;
mod condition;
mod copies;
pub(in crate::build) mod expr;
mod fix;
mod geometry;
mod iterates;
pub(in crate::build) mod plan;
mod planner;
mod refs;

use planner::Planner;

pub(in crate::build) struct Compiler<'a> {
    pub(in crate::build) compiled: Compiled<'a>,
    /// Elements whose attribute plans are computed once every name exists.
    pub(in crate::build) pending_elems: Vec<(TemplateId, ElemId)>,
    /// Macro children awaiting plans: (template, owning element or None for
    /// the template's own children, index in that child list, node).
    pub(in crate::build) pending_macros: Vec<(TemplateId, Option<ElemId>, usize, NodeId)>,
}

/// The ways an element is planned; see `Compiler::elem_shape`.
enum ElemShape {
    Cloned,
    Synthetic,
    ExtendProp(RefId),
    ContainerCopy(RefId),
    /// Planned as its type's entry in `planner` says.
    ByType(Option<RefId>),
}

impl<'a> Compiler<'a> {
    pub(in crate::build) fn compile(dast: &'a Dast) -> Result<Compiled<'a>> {
        let mut cp = Compiler {
            compiled: Compiled {
                dast,
                templates: vec![Template::default()],
                refs: Vec::new(),
                arena: Arena::default(),
                sym_text: HashMap::new(),
                choices: Vec::new(),
            },
            pending_elems: Vec::new(),
            pending_macros: Vec::new(),
        };
        // Template 0 is the document: its one child is the root component.
        let doc_el = dast
            .children(Dast::ROOT)
            .iter()
            .copied()
            .find(|&n| dast.kind(n) == NodeKind::Element && dast.str(n) == "document");
        let children = match doc_el {
            Some(el) => vec![Child::Elem(cp.add_elem(0, el, ROOT_SCOPE)?)],
            None => {
                // Synthesize a root when the DAST was not normalized.
                let e = cp.add_synthetic(0, ComponentType::Document, NONE);
                cp.compiled.templates[0].elems[e].props = vec![
                    SourcePlan::Fixed(f64::NAN),
                    SourcePlan::computed(OpSpec::Scale { k: 100.0 }, vec![prop::document::CREDIT]),
                ];
                let kids = cp.add_children(0, Some(e), ROOT_SCOPE, dast.children(Dast::ROOT))?;
                cp.compiled.templates[0].elems[e].children = kids;
                vec![Child::Elem(e)]
            }
        };
        cp.compiled.templates[0].children = children;
        // Every name exists now: plan attributes and macro children. Planning
        // a container copy adds elements, so loop until nothing is pending.
        while !cp.pending_elems.is_empty() || !cp.pending_macros.is_empty() {
            for (t, e) in std::mem::take(&mut cp.pending_elems) {
                cp.plan_elem(t, e)?;
            }
            for (t, owner, i, m) in std::mem::take(&mut cp.pending_macros) {
                let scope = match owner {
                    Some(e) => cp.child_scope(t, e),
                    None => ROOT_SCOPE,
                };
                let plan = cp.plan_ref(t, scope, m)?;
                let has_index = dast.macro_has_index(m);
                match owner {
                    Some(e) => {
                        cp.compiled.templates[t].elems[e].children[i] =
                            Child::Macro(plan, has_index)
                    }
                    None => cp.compiled.templates[t].children[i] = Child::Macro(plan, has_index),
                }
            }
        }
        cp.finish_choices()?;
        // Slot offsets, now that planned types know their hidden slot count.
        for tpl in &mut cp.compiled.templates {
            let mut off = 0;
            for el in &mut tpl.elems {
                el.slot_off = off;
                off += el.props.len().max(el.component_type.prop_defs().len()) as u32;
            }
            tpl.n_slots = off;
        }
        Ok(cp.compiled)
    }

    /// Children of element `e` have `e` as their parent.
    pub(in crate::build) fn child_scope(&self, _t: TemplateId, e: ElemId) -> ElemId {
        e
    }

    pub(in crate::build) fn push_elem(
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
    pub(in crate::build) fn push_elem_visible_to(
        &mut self,
        t: TemplateId,
        node: NodeId,
        component_type: ComponentType,
        name: StrId,
        name_scope: ElemId,
        stop: ElemId,
    ) -> Result<ElemId> {
        let tpl = &mut self.compiled.templates[t];
        let e = tpl.elems.len();
        tpl.elems.push(Elem {
            node,
            component_type,
            name,
            name_scope,
            slot_off: 0,
            props: Vec::new(),
            children: Vec::new(),
            extend: None,
            cloned: false,
            roles: HashMap::new(),
            body: Body::Plain,
        });
        if name != NONE {
            let s = self.compiled.dast.strings.get(name).trim().to_string();
            // Two siblings with one name can never be told apart.
            if tpl
                .names
                .get(&(name_scope, s.clone()))
                .is_some_and(|v| v.iter().any(|&o| tpl.elems[o].name_scope == name_scope))
            {
                return Err(Error::DuplicateName(s));
            }
            // Visible from every ancestor up to the template root (or `stop`).
            let mut a = name_scope;
            loop {
                tpl.names.entry((a, s.clone())).or_default().push(e);
                if a == ROOT_SCOPE || a == stop {
                    break;
                }
                a = tpl.elems[a].name_scope;
            }
        }
        Ok(e)
    }

    pub(in crate::build) fn add_synthetic(
        &mut self,
        t: TemplateId,
        component_type: ComponentType,
        name: StrId,
    ) -> ElemId {
        self.push_elem(t, NONE, component_type, name, ROOT_SCOPE)
            .expect("synthetic names are unique")
    }

    pub(in crate::build) fn attr_name_str(&self, el: NodeId, attr: &str) -> Option<StrId> {
        let d = self.compiled.dast;
        let a = d.attr(el, attr)?;
        match d.attr_children(a) {
            [t] if d.kind(*t) == NodeKind::Text => Some(d.str_id(*t)),
            _ => None,
        }
    }

    /// Create an element (and, for a repeat, its template) from a DAST element.
    pub(in crate::build) fn add_elem(
        &mut self,
        t: TemplateId,
        el: NodeId,
        name_scope: ElemId,
    ) -> Result<ElemId> {
        let d = self.compiled.dast;
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
        let name = self.attr_name_str(el, "name").unwrap_or(NONE);
        let e = self.push_elem(t, el, component_type, name, name_scope)?;
        self.pending_elems.push((t, e));
        let child_scope = e;
        let _ = name_scope;
        match component_type {
            ComponentType::FunctionIterates => {
                // One hidden tuple per iteration, planned with the element
                // (`plan_function_iterates`); it is element 0 of the body.
                let sub = self.compiled.templates.len();
                self.compiled.templates.push(Template {
                    parent: Some((t, e)),
                    ..Default::default()
                });
                let it = self.add_synthetic(sub, ComponentType::Tuple, NONE);
                self.compiled.templates[sub].children = vec![Child::Elem(it)];
                self.compiled.templates[t].elems[e].body = Body::Repeat { template: sub };
            }
            ComponentType::RepeatForSequence | ComponentType::RepeatFor => {
                let sub = self.compiled.templates.len();
                self.compiled.templates.push(Template {
                    parent: Some((t, e)),
                    ..Default::default()
                });
                // Hidden iteration components first, so `$v` and `$i` resolve
                // anywhere inside the template. A `<repeat>`'s item is a
                // tuple, element 0 of the body, planned with the repeat
                // (`plan_repeat_for`).
                if component_type == ComponentType::RepeatFor {
                    if let Some(vn) = self.attr_name_str(el, "valueName") {
                        self.add_synthetic(sub, ComponentType::Tuple, vn);
                    }
                } else if let Some(vn) = self.attr_name_str(el, "valueName") {
                    let v = self.add_synthetic(sub, ComponentType::SequenceValue, vn);
                    // from and step alias the repeat's own props (one hop up);
                    // k is the iteration position; the rest is the type's chain.
                    let from = self.own_prop_plan(e, "from");
                    let step = self.own_prop_plan(e, "step");
                    let mut props = vec![
                        SourcePlan::reference(from),
                        SourcePlan::reference(step),
                        SourcePlan::IterIndex,
                    ];
                    for def in ComponentType::SequenceValue.prop_defs().iter().skip(3) {
                        let PropFrom::Computed { op, args } = def.from else {
                            unreachable!()
                        };
                        props.push(SourcePlan::from_def(op, &args));
                    }
                    self.compiled.templates[sub].elems[v].props = props;
                }
                if let Some(iname) = self.attr_name_str(el, "indexName") {
                    let i = self.add_synthetic(sub, ComponentType::Number, iname);
                    self.compiled.templates[sub].elems[i].props = vec![SourcePlan::IterIndex];
                }
                let kids = self.add_children(sub, None, ROOT_SCOPE, d.children(el))?;
                self.compiled.templates[sub].children = kids;
                self.compiled.templates[t].elems[e].body = Body::Repeat { template: sub };
            }
            ComponentType::Collect | ComponentType::PointList => {}
            ComponentType::ConditionalContent | ComponentType::Select => {
                self.add_choice(t, e, el)?
            }
            // A number's children are its value, not rendered children; the
            // geometric types read their children themselves (a line's
            // equation, a point's constraints).
            _ if matches!(Self::planner(component_type), Planner::Geometric(_))
                || component_type
                    .prop_defs()
                    .iter()
                    .any(|p| p.from == PropFrom::Children) => {}
            _ => {
                let kids = self.add_children(t, Some(e), child_scope, d.children(el))?;
                self.compiled.templates[t].elems[e].children = kids;
            }
        }
        Ok(e)
    }

    /// A plan naming prop `prop` of element `e` in the parent template, as
    /// seen from the repeat's own template (one hop up).
    pub(in crate::build) fn own_prop_plan(&mut self, e: ElemId, prop: &str) -> RefId {
        self.compiled.refs.push(RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: Some(prop.to_string()),
            display: format!("(repeat).{prop}"),
        });
        self.compiled.refs.len() - 1
    }

    pub(in crate::build) fn add_children(
        &mut self,
        t: TemplateId,
        owner: Option<ElemId>,
        name_scope: ElemId,
        nodes: &[NodeId],
    ) -> Result<Vec<Child>> {
        let d = self.compiled.dast;
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
                    kids.push(Child::Elem(self.add_elem(t, n, name_scope)?));
                }
                // Whitespace-only text between lines is layout and would only
                // become a DOM node; a space between inline items is content
                // (`The $animal $verb.`).
                NodeKind::Text
                    if d.str(n).trim().is_empty()
                        && (d.str(n).contains('\n') || kids.is_empty()) => {}
                NodeKind::Text => kids.push(Child::Text(d.str_id(n))),
                NodeKind::Macro => {
                    self.pending_macros.push((t, owner, kids.len(), n));
                    kids.push(Child::Macro(usize::MAX, false));
                }
                NodeKind::Other => {}
            }
        }
        Ok(kids)
    }

    pub(in crate::build) fn plan_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let component_type = self.compiled.templates[t].elems[e].component_type;
        match self.elem_shape(t, e)? {
            // Every public prop aliases the original's; nothing else to plan.
            ElemShape::Cloned => {
                let n = component_type.prop_defs().len();
                self.compiled.templates[t].elems[e].props = vec![SourcePlan::Inherit; n];
                Ok(())
            }
            // Synthesized elements (iteration values) come planned.
            ElemShape::Synthetic => Ok(()),
            ElemShape::ExtendProp(p) => self.plan_extend_prop(t, e, p),
            ElemShape::ContainerCopy(p) => self.plan_container_copy(t, e, p),
            ElemShape::ByType(extend) => match Self::planner(component_type) {
                Planner::Props | Planner::PropsThen(_) => self.plan_attrs(t, e, extend),
                Planner::Geometric(plan) => self.plan_geo(t, e, extend, plan),
                Planner::Whole(plan) => plan(self, t, e),
            },
        }
    }

    /// `<math>`. A tuple-valued math (`<math>(a, b)</math>`) is a point for
    /// the cells core: two cells, draggable as a direction source. With
    /// three or more entries it is a tuple, one cell per entry.
    fn plan_math_elem(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.compiled.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let nodes: Vec<NodeId> = d.children(el).to_vec();
        let (toks, text) = self.math_tokens(t, scope, &nodes)?;
        if let Some(inner) = expr::unwrap_parens(&toks)
            && expr::split_top(inner, &Token::Comma).len() == 2
        {
            let [x, y] = self.plan_tuple(t, scope, &nodes)?;
            let hide = ComponentType::Point.prop_defs()[prop::point::HIDE].default;
            self.compiled.templates[t].elems[e].component_type = ComponentType::Point;
            self.compiled.templates[t].elems[e].props = vec![x, y, SourcePlan::Default(hide)];
            return Ok(());
        }
        if let Some(inner) = expr::unwrap_parens(&toks)
            && expr::split_top(inner, &Token::Comma).len() > 2
        {
            let parts = expr::split_top(inner, &Token::Comma);
            if parts.len() > crate::components::MAX_TUPLE {
                return Err(Error::Unsupported(format!(
                    "a tuple of {} entries (at most {})",
                    parts.len(),
                    crate::components::MAX_TUPLE
                )));
            }
            let mut props = vec![SourcePlan::Fixed(parts.len() as f64)];
            for part in &parts {
                let id = self.parse_tokens(part, &text)?;
                props.push(self.plan_from_expr(id));
            }
            props.resize(
                1 + crate::components::MAX_TUPLE,
                SourcePlan::Fixed(f64::NAN),
            );
            self.compiled.templates[t].elems[e].component_type = ComponentType::Tuple;
            self.compiled.templates[t].elems[e].props = props;
            return Ok(());
        }
        let id = self.plan_sym_math(t, scope, &nodes)?;
        let post = if self.attr_on(el, "expand") {
            Post::Expand
        } else if self.attr_on(el, "simplify") {
            Post::Simplify
        } else {
            Post::None
        };
        self.compiled.templates[t].elems[e].props =
            vec![SourcePlan::MathHandle(id, post), SourcePlan::MathValue(id)];
        Ok(())
    }

    /// `<collect>`: what it collects is resolved when it expands.
    fn plan_collect(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let d = self.compiled.dast;
        let Elem {
            node: el,
            name_scope: scope,
            ..
        } = self.compiled.templates[t].elems[e];
        let from = d
            .attr(el, "from")
            .and_then(|a| self.single_macro(a))
            .ok_or(Error::BadCollect)?;
        let type_text = d
            .attr(el, "componentType")
            .and_then(|a| self.attr_text(a))
            .ok_or(Error::BadCollect)?;
        let ck = ComponentType::from_tag(type_text.trim())
            .filter(|k| k.copyable())
            .ok_or_else(|| Error::BadCollectType(type_text.trim().into()))?;
        let p = self.plan_ref(t, scope, from)?;
        if self.compiled.refs[p].prop.is_some() {
            return Err(Error::BadCollect);
        }
        self.compiled.templates[t].elems[e].body = Body::Collect {
            from: p,
            component_type: ck,
        };
        // `count` is set when the collect expands.
        self.compiled.templates[t].elems[e].props = vec![SourcePlan::Fixed(f64::NAN)];
        Ok(())
    }

    /// Which way an element is planned, decided from its `extend` attribute
    /// (and whether its type is a container) before any prop is looked at.
    /// Records the extend plan on the element.
    fn elem_shape(&mut self, t: TemplateId, e: ElemId) -> Result<ElemShape> {
        let d = self.compiled.dast;
        let Elem {
            node: el,
            component_type,
            name_scope: scope,
            cloned,
            ..
        } = self.compiled.templates[t].elems[e];
        if cloned {
            return Ok(ElemShape::Cloned);
        }
        if el == NONE {
            return Ok(ElemShape::Synthetic);
        }
        let extend = match d.attr(el, "extend") {
            Some(a) => {
                let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                    attr: "extend".into(),
                    text: self.attr_text(a).unwrap_or_default(),
                })?;
                let p = self.plan_ref(t, scope, m)?;
                // `<point extend="$c.center"/>`, `<math extend="$c.radius"/>`,
                // `<pointList extend="$l.points"/>`: the element's value
                // props alias the named prop.
                if self.compiled.refs[p].prop.is_some() {
                    return Ok(ElemShape::ExtendProp(p));
                }
                Some(p)
            }
            None => None,
        };
        self.compiled.templates[t].elems[e].extend = extend;
        Ok(match extend {
            Some(p) if component_type.container() => ElemShape::ContainerCopy(p),
            _ => ElemShape::ByType(extend),
        })
    }

    pub(in crate::build) fn elem_label(&self, t: TemplateId, e: ElemId) -> String {
        let el = &self.compiled.templates[t].elems[e];
        if el.name != NONE {
            self.compiled.dast.strings.get(el.name).trim().to_string()
        } else {
            format!("<{}>", el.component_type.tag())
        }
    }
}

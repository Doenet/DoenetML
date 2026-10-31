//! Copies: `extend` with a prop path, container copies whose children are
//! clones, the clone elements themselves, and `plan_with_extend`, which
//! runs a `Planner::Plan` type's planner and applies the copy rules around
//! it: a bare copy aliases every prop, and a copy with its own attributes
//! keeps the shared state they supply and shares the rest.

use super::*;

impl<'a> Compiler<'a> {
    /// `extend="$c.prop"`: the element's value props alias the named prop.
    pub(in crate::compile) fn plan_extend_prop(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        let component_type = self.compiled.templates[t.index()].elems[e.index()].component_type;
        let display = self.compiled.refs[p.index()].display.clone();
        let props = match component_type {
            ComponentType::Point => prop::point::props_of(Source::coord(p, 0), Source::coord(p, 1)),
            // A mathInput bound to a cell is a numeric input: no expression
            // of its own (`components/inputs/math_input.rs`).
            ComponentType::MathInput => prop::math_input::Props {
                value: Source::reference(p),
                expr: Source::absent(),
            }
            .into_vec(),
            ComponentType::Number
            | ComponentType::NumberInput
            | ComponentType::Text
            | ComponentType::TextInput
            | ComponentType::Boolean
            | ComponentType::BooleanInput => vec![Source::reference(p)],
            ComponentType::Math => {
                let id = self.compiled.arena.push(Expr::Cell(p));
                self.compiled
                    .sym_text
                    .insert(id, crate::sym::engine::leaf_name(p.get(), false));
                prop::math::props_of(id, Post::None)
            }
            ComponentType::PointList => {
                self.compiled.templates[t.index()].elems[e.index()].body =
                    Body::PointList { from: p };
                Vec::new()
            }
            _ => return Err(Error::PathTooDeep(display)),
        };
        self.compiled.templates[t.index()].elems[e.index()].props = props;
        Ok(())
    }

    /// `<graph extend="$g" name="g2"/>`: the copy's props alias the
    /// original's. Its children, clones, it has from pass 1
    /// (`expand_container_copy`).
    pub(in crate::compile) fn plan_container_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        self.plan_attrs(t, e, Some(p))
    }

    /// The last of pass 1 (ADR 0027): every container copy gets its
    /// clones, now that every name is in the table, so the element set is
    /// complete before anything is planned. A copy of a copy is expanded
    /// after its referent, whatever the document's order.
    pub(in crate::compile) fn expand_container_copies(&mut self) -> Result<()> {
        for (t, e) in std::mem::take(&mut self.container_copies) {
            self.expand_container_copy(t, e)?;
        }
        Ok(())
    }

    /// Give container copy `e` its children: clones of its referent's,
    /// named under the copy, followed by the children written inside the
    /// copy (REF-4 of the principles: added after the referent's). A copy
    /// that fails is boxed, and the clones it made die with it.
    pub(in crate::compile) fn expand_container_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
    ) -> Result<()> {
        let key = (t.get(), e.get());
        if self.expanded.contains(&key) || self.is_box(t, e) {
            return Ok(());
        }
        if !self.expanding.insert(key) {
            return Err(Error::Cycle(self.elem_label(t, e)));
        }
        let n = self.compiled.templates[t.index()].elems.len();
        let r = self.expand_container_copy_inner(t, e);
        self.expanding.remove(&key);
        self.expanded.insert(key);
        match r {
            Ok(()) => Ok(()),
            Err(error) if self.failed_node.is_some() => Err(error),
            Err(error) => {
                for x in n..self.compiled.templates[t.index()].elems.len() {
                    self.make_box(t, ElemId::from_index(x), true);
                }
                self.box_in_place(t, e, error)
            }
        }
    }

    fn expand_container_copy_inner(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let p = self.plan_extend(t, e)?.expect("a container copy extends");
        // `<graph extend="$x.prop"/>` is no container copy: pass 3 refuses
        // it as an extend of a prop.
        if self.compiled.refs[p.index()].prop.is_some() {
            return Ok(());
        }
        let r = self
            .plan_elem_target(t, p)
            .ok_or_else(|| Error::UncopyableType("graph from another scope".into()))?;
        // A referent that is itself a copy has its clones first; one that
        // is a box has none to clone.
        self.referent_type(t, e, p)?;
        self.compiled.templates[t.index()].elems[e.index()].extend = Some(p);
        let scope = self.child_scope(t, e);
        let mut kids = self.clone_children(t, r, scope, e)?;
        let own = std::mem::take(&mut self.compiled.templates[t.index()].elems[e.index()].children);
        kids.extend(own);
        self.compiled.templates[t.index()].elems[e.index()].children = kids;
        Ok(())
    }

    pub(in crate::compile) fn clone_children(
        &mut self,
        t: TemplateId,
        from: ElemId,
        scope: ElemId,
        root: ElemId,
    ) -> Result<Vec<Child>> {
        let kids = self.compiled.templates[t.index()].elems[from.index()]
            .children
            .clone();
        let mut out = Vec::with_capacity(kids.len());
        for ch in kids {
            match ch {
                Child::Elem(c) => {
                    // A copy among the children has its clones first; a
                    // clone takes the type pass 1 settled for its original.
                    let el = self.shaped_elem(t, c)?;
                    let (component_type, name) = (el.component_type, el.name);
                    let repeat = matches!(el.body, Body::Repeat { .. });
                    self.cloned_sources.insert((t.get(), c.get()));
                    if repeat
                        || matches!(
                            component_type,
                            ComponentType::Collect | ComponentType::Polyline
                        )
                    {
                        return Err(Error::UncopyableType(format!(
                            "{} inside a copied container",
                            component_type.tag()
                        )));
                    }
                    let ne = self.push_elem_visible_to(
                        t,
                        NodeId::NONE,
                        component_type,
                        name,
                        scope,
                        root,
                    )?;
                    let label = format!("(copy of {})", self.elem_label(t, c));
                    self.compiled.refs.push(RefPlan {
                        hops: 0,
                        steps: vec![Step::Elem(c)],
                        prop: None,
                        display: label,
                        node: NodeId::NONE,
                    });
                    let ep = self.compiled.refs.len() - 1;
                    {
                        let el = &mut self.compiled.templates[t.index()].elems[ne.index()];
                        el.extend = Some(RefId::from_index(ep));
                        el.cloned = true;
                    }
                    let child_scope = if name != StrId::NONE { ne } else { scope };
                    let sub = self.clone_children(t, c, child_scope, root)?;
                    self.compiled.templates[t.index()].elems[ne.index()].children = sub;
                    self.pending_elems.push((t, ne));
                    out.push(Child::Elem(ne));
                }
                other => out.push(other),
            }
        }
        Ok(out)
    }

    /// Plan a bare copy (an `extend` with no attribute or child of its own,
    /// or a cloned child of one): every public prop aliases the referent's,
    /// its deferred props planned as every element's are, and a list is as
    /// long as the referent's, which only the build knows.
    pub(in crate::compile) fn plan_bare_copy(&mut self, t: TemplateId, e: ElemId) {
        let component_type = self.compiled.templates[t.index()].elems[e.index()].component_type;
        let mut props = vec![Source::Inherit; component_type.prop_defs().len()];
        Deferred::mark(component_type, &mut props);
        let el = &mut self.compiled.templates[t.index()].elems[e.index()];
        el.props = props;
        if component_type.given_coords().is_some() {
            el.n_public = NPublic::AsReferent;
        }
    }

    /// Runs a `Plan` type's planner (`plan`, from `planner`) with the copy
    /// rules around it: a bare copy aliases every prop, and a copy with its
    /// own attributes merges them over the referent's.
    pub(in crate::compile) fn plan_with_extend(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
        plan: planner::PlanFn,
    ) -> Result<()> {
        let d = self.dast;
        let Elem {
            node: el,
            component_type,
            ..
        } = self.compiled.templates[t.index()].elems[e.index()];
        // Own attributes other than name and extend, or children, override
        // the referent's; with none, the copy aliases every public prop.
        let own_attrs: Vec<String> = d
            .attrs(el)
            .map(|a| d.attr_name(a).to_string())
            .filter(|n| n != "name" && n != "extend")
            .collect();
        let has_children = !d.children(el).iter().all(|&n| self.is_not_content(n));
        if extend.is_some() && own_attrs.is_empty() && !has_children {
            self.plan_bare_copy(t, e);
            return Ok(());
        }
        // Merged attributes: the referent's node supplies what the copy
        // omits, each planned where its writer sits (ADR 0023).
        let base_elem = extend
            .and_then(|p| self.plan_elem_target(t, p))
            .filter(|&r| self.compiled.templates[t.index()].elems[r.index()].node != NodeId::NONE);
        if let (Some(p), None) = (extend, base_elem) {
            // Reached by an index, through another repeat or choice, or
            // an element the compile made: nothing here to take the rest
            // from, and planning the element from its own attributes
            // alone would give it defaults in silence.
            return Err(Error::Unsupported(format!(
                "attributes or children on an extend of '${}', which is not an element of this scope; a bare extend of it works",
                self.compiled.refs[p.index()].display
            )));
        }
        let wiring = plan(&mut PlanCtx::new(self, t, e, base_elem))?;
        // Essential state the copy did not override is the original's: the
        // current core's copies share their essential state variables. The
        // copy names what it shares, and pass 4 links it to the slot the
        // referent's planning gives it (`link_shared_state`, ADR 0029).
        if let Some(r) = base_elem {
            for (state, &slot) in &wiring.shared_state {
                // Shared state the copy gave itself is its own.
                let own = match wiring.shared_state_given.get(state) {
                    Some(Given::Attr(a)) => {
                        own_attrs.iter().any(|o| o.eq_ignore_ascii_case(a.name()))
                    }
                    Some(Given::Children) => true,
                    Some(Given::Referent) | None => false,
                };
                if own || !matches!(wiring.props[slot as usize], Some(Source::Given(_))) {
                    continue;
                }
                self.shares.push(Share {
                    t,
                    e,
                    slot,
                    referent: r,
                    state: *state,
                });
            }
        }
        if !wiring.shared_state.is_empty() {
            self.shared_state
                .insert((t.get(), e.get()), wiring.shared_state.clone());
        }
        if component_type.given_coords().is_some() {
            self.compiled.templates[t.index()].elems[e.index()].n_public =
                NPublic::Planned(wiring.n_public as u32);
        }
        self.compiled.templates[t.index()].elems[e.index()].props = wiring.finish();
        Ok(())
    }

    /// Pass 4's first link (ADR 0029): each piece of state a copy shares
    /// aliases the referent's slot for it, now that every element is
    /// planned. A copy or referent that is a box shares nothing, and a
    /// copy keeps its own given value for state its referent has none of.
    pub(in crate::compile) fn link_shared_state(&mut self) {
        for s in std::mem::take(&mut self.shares) {
            if self.is_box(s.t, s.e) || self.is_box(s.t, s.referent) {
                continue;
            }
            if let Some(&bs) = self
                .shared_state
                .get(&(s.t.get(), s.referent.get()))
                .and_then(|m| m.get(&s.state))
            {
                self.compiled.templates[s.t.index()].elems[s.e.index()].props[s.slot as usize] =
                    Source::Alias(Arg::Elem(s.referent, bs));
            }
        }
    }

    /// A 0/1 flag attribute of a `Plan` type (`hide`), as a copy inherits
    /// it: a reference is bound; a literal (a bare attribute is true) is
    /// the element's own value when it gives the attribute, else its
    /// referent's; with no attribute at all, a copy's is its referent's
    /// slot and an element's is `default`.
    pub(in crate::compile) fn plan_flag(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        el: NodeId,
        base: Option<(NodeId, ElemId)>,
        name: &str,
        default: bool,
    ) -> Result<Source> {
        let d = self.dast;
        let base_node = base.map(|(b, _)| b);
        Ok(match self.attr_or_inherited(el, base_node, name) {
            Some(a) if self.single_macro(a).is_some() => {
                // The referent's reference is planned where the referent
                // sits (ADR 0023).
                let scope = match base {
                    Some((_, bs)) if d.attr(el, name).is_none() => bs,
                    _ => scope,
                };
                self.plan_scalar(t, scope, name, d.attr_children(a))?
            }
            Some(_) => {
                // The copy's own attribute wins: `hide="false"` reveals a
                // copy of a hidden point, as in the current core.
                let owner = match base_node {
                    Some(b) if d.attr(el, name).is_none() => b,
                    _ => el,
                };
                Source::Given(if self.attr_flag(owner, name) {
                    1.0
                } else {
                    0.0
                })
            }
            None if base.is_some() => Source::Inherit,
            None => Source::Given(if default { 1.0 } else { 0.0 }),
        })
    }

    /// Attribute of the element, or of the `extend` referent when the
    /// element does not give it (a copy with overrides).
    pub(in crate::compile) fn attr_or_inherited(
        &self,
        el: NodeId,
        base: Option<NodeId>,
        name: &str,
    ) -> Option<u32> {
        let d = self.dast;
        d.attr(el, name)
            .or_else(|| base.and_then(|b| d.attr(b, name)))
    }
}

/// The copy rules of `plan_with_extend` (ADR 0016, Migration step 8), against the
/// test-only components: a bare copy aliases its referent; a copy with
/// its own attributes keeps the shared state those attributes supply, and
/// shares the rest with its referent, in both directions.
#[cfg(test)]
mod tests {
    use crate::testing::dast::{document, el, load, mac};
    use crate::testing::{prop_value as value, request_prop as request};

    /// `<testShape name="s" a="1" b="2"/>` and `copy`, extending it.
    fn with_copy(copy: crate::testing::dast::Element) -> crate::Document {
        let doc = load(document([
            el("testValue").name("v").attr("value", "5"),
            el("testShape").name("s").attr("a", "1").attr("b", "2"),
            copy.attr("extend", mac("s")),
        ]))
        .unwrap();
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        doc
    }

    #[test]
    fn a_bare_copy_is_its_referent() {
        let mut doc = with_copy(el("testShape").name("d"));
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (1.0, 2.0));
        assert_eq!(value(&doc, "d.sum"), 3.0);
        assert!(request(&mut doc, "d.a", 5.0).dropped.is_empty());
        assert_eq!((value(&doc, "s.a"), value(&doc, "d.sum")), (5.0, 7.0));
        assert!(request(&mut doc, "s.b", 4.0).dropped.is_empty());
        assert_eq!((value(&doc, "d.b"), value(&doc, "d.sum")), (4.0, 9.0));
    }

    #[test]
    fn an_own_attribute_keeps_its_state_and_shares_the_rest() {
        let mut doc = with_copy(el("testShape").name("d").attr("a", "7"));
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (7.0, 1.0));
        assert_eq!((value(&doc, "d.b"), value(&doc, "d.sum")), (2.0, 9.0));
        // `a` is the copy's own: a change of either leaves the other.
        request(&mut doc, "d.a", 8.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 1.0));
        request(&mut doc, "s.a", 0.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 0.0));
        // `b` is shared, from either side.
        request(&mut doc, "d.b", 9.0);
        assert_eq!(value(&doc, "s.b"), 9.0);
        request(&mut doc, "s.b", 3.0);
        assert_eq!((value(&doc, "d.b"), value(&doc, "d.sum")), (3.0, 11.0));
    }

    #[test]
    fn state_the_referent_defaulted_is_shared() {
        let mut doc = load(document([
            el("testShape").name("s"),
            el("testShape")
                .name("d")
                .attr("extend", mac("s"))
                .attr("b", "4"),
        ]))
        .unwrap();
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (0.0, 4.0));
        assert_eq!(value(&doc, "s.b"), 0.0);
        request(&mut doc, "s.a", 6.0);
        assert_eq!(value(&doc, "d.a"), 6.0);
        request(&mut doc, "d.a", 2.0);
        assert_eq!(value(&doc, "s.a"), 2.0);
    }

    #[test]
    fn an_own_reference_follows_what_it_names() {
        let mut doc = with_copy(el("testShape").name("d").attr("a", mac("v")));
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (5.0, 1.0));
        request(&mut doc, "v.value", 6.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (6.0, 1.0));
        // A request on the copy reaches what its attribute names, not the
        // referent.
        request(&mut doc, "d.a", 4.0);
        assert_eq!((value(&doc, "v.value"), value(&doc, "s.a")), (4.0, 1.0));
    }

    #[test]
    fn an_attribute_supplying_no_state_shares_it_all() {
        // `fixed` makes the copy not bare, but supplies neither `a` nor `b`.
        // (What a request on the fixed copy does is `fixed`'s rule, not
        // the copy's.)
        let mut doc = with_copy(el("testShape").name("d").attr("fixed", "true"));
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (1.0, 2.0));
        request(&mut doc, "s.a", 3.0);
        assert_eq!(value(&doc, "d.a"), 3.0);
    }

    #[test]
    fn a_copy_of_a_copy_shows_the_copy() {
        let mut doc = load(document([
            el("testShape").name("s").attr("a", "1").attr("b", "2"),
            el("testShape")
                .name("d")
                .attr("extend", mac("s"))
                .attr("a", "7"),
            el("testShape").name("e").attr("extend", mac("d")),
        ]))
        .unwrap();
        assert_eq!((value(&doc, "e.a"), value(&doc, "e.b")), (7.0, 2.0));
        request(&mut doc, "e.a", 8.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 1.0));
        request(&mut doc, "e.b", 5.0);
        assert_eq!(value(&doc, "s.b"), 5.0);
    }

    #[test]
    fn own_children_keep_their_state() {
        let mut doc = load(document([
            el("testShape").name("s").text("1"),
            el("testShape").name("d").attr("extend", mac("s")).text("7"),
        ]))
        .unwrap();
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (7.0, 1.0));
        request(&mut doc, "d.a", 8.0);
        assert_eq!((value(&doc, "d.a"), value(&doc, "s.a")), (8.0, 1.0));
    }

    #[test]
    fn the_referents_children_are_shared() {
        // `b` makes the copy not bare; its `a` stands on the referent's
        // children.
        let mut doc = load(document([
            el("testShape").name("s").text("1"),
            el("testShape")
                .name("d")
                .attr("extend", mac("s"))
                .attr("b", "4"),
        ]))
        .unwrap();
        assert_eq!((value(&doc, "d.a"), value(&doc, "d.b")), (1.0, 4.0));
        request(&mut doc, "d.a", 5.0);
        assert_eq!(value(&doc, "s.a"), 5.0);
        request(&mut doc, "s.a", 6.0);
        assert_eq!(value(&doc, "d.a"), 6.0);
    }

    #[test]
    fn a_flag_is_the_elements_else_its_referents_else_the_default() {
        let mut doc = load(document([
            el("testValue").name("v").attr("value", "1"),
            el("testShape").name("plain"),
            el("testShape").name("s").flag("hide"),
            el("testShape").name("t").attr("hide", "false"),
            el("testShape").name("r").attr("hide", mac("v")),
            // Each copy gives `b`, so none is bare.
            el("testShape")
                .name("sCopy")
                .attr("extend", mac("s"))
                .attr("b", "1"),
            el("testShape")
                .name("shown")
                .attr("extend", mac("s"))
                .attr("b", "1")
                .attr("hide", "false"),
            el("testShape")
                .name("plainCopy")
                .attr("extend", mac("plain"))
                .attr("b", "1"),
            el("testShape")
                .name("rCopy")
                .attr("extend", mac("r"))
                .attr("b", "1"),
        ]))
        .unwrap();
        let hide = |doc: &crate::Document, n: &str| value(doc, &format!("{n}.hide"));
        assert_eq!(
            (hide(&doc, "plain"), hide(&doc, "s"), hide(&doc, "t")),
            (0.0, 1.0, 0.0)
        );
        assert_eq!(hide(&doc, "r"), 1.0);
        // The referent's literal, unless the copy gives its own.
        assert_eq!((hide(&doc, "sCopy"), hide(&doc, "shown")), (1.0, 0.0));
        // No attribute anywhere: the copy's is its referent's slot.
        request(&mut doc, "plain.hide", 1.0);
        assert_eq!(hide(&doc, "plainCopy"), 1.0);
        // A referent's reference binds the copy too.
        request(&mut doc, "v.value", 0.0);
        assert_eq!((hide(&doc, "r"), hide(&doc, "rCopy")), (0.0, 0.0));
    }
}

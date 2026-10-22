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
        let component_type = self.compiled.templates[t].elems[e].component_type;
        let display = self.compiled.refs[p].display.clone();
        let props = match component_type {
            ComponentType::Point => prop::point::props_of(Source::coord(p, 0), Source::coord(p, 1)),
            ComponentType::Number | ComponentType::NumberInput | ComponentType::MathInput => {
                vec![Source::reference(p)]
            }
            ComponentType::Math => {
                let id = self.compiled.arena.push(Expr::Cell(p as CellIdx));
                self.compiled
                    .sym_text
                    .insert(id, crate::sym::engine::leaf_name(p as u32, false));
                prop::math::props_of(id, Post::None)
            }
            ComponentType::PointList => {
                self.compiled.templates[t].elems[e].body = Body::PointList { from: p };
                Vec::new()
            }
            _ => return Err(Error::PathTooDeep(display)),
        };
        self.compiled.templates[t].elems[e].props = props;
        Ok(())
    }

    /// `<graph extend="$g" name="g2"/>`: the copy's props alias the
    /// original's and its children are clones, named under the copy.
    pub(in crate::compile) fn plan_container_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        let r = self
            .plan_elem_target(t, p)
            .ok_or_else(|| Error::UncopyableType("graph from another scope".into()))?;
        self.plan_attrs(t, e, Some(p))?;
        let scope = self.child_scope(t, e);
        let kids = self.clone_children(t, r, scope, e)?;
        self.compiled.templates[t].elems[e].children = kids;
        Ok(())
    }

    pub(in crate::compile) fn clone_children(
        &mut self,
        t: TemplateId,
        from: ElemId,
        scope: ElemId,
        root: ElemId,
    ) -> Result<Vec<Child>> {
        let kids = self.compiled.templates[t].elems[from].children.clone();
        let mut out = Vec::with_capacity(kids.len());
        for ch in kids {
            match ch {
                Child::Elem(c) => {
                    let (component_type, name) = {
                        let el = &self.compiled.templates[t].elems[c];
                        (el.component_type, el.name)
                    };
                    if matches!(
                        self.compiled.templates[t].elems[c].body,
                        Body::Repeat { .. } | Body::Collect { .. }
                    ) {
                        return Err(Error::UncopyableType(format!(
                            "{} inside a copied container",
                            component_type.tag()
                        )));
                    }
                    let ne =
                        self.push_elem_visible_to(t, NONE, component_type, name, scope, root)?;
                    let label = format!("(copy of {})", self.elem_label(t, c));
                    self.compiled.refs.push(RefPlan {
                        hops: 0,
                        steps: vec![Step::Elem(c)],
                        prop: None,
                        display: label,
                        node: NONE,
                    });
                    let ep = self.compiled.refs.len() - 1;
                    {
                        let el = &mut self.compiled.templates[t].elems[ne];
                        el.extend = Some(ep);
                        el.cloned = true;
                    }
                    let child_scope = if name != NONE { ne } else { scope };
                    let sub = self.clone_children(t, c, child_scope, root)?;
                    self.compiled.templates[t].elems[ne].children = sub;
                    self.pending_elems.push((t, ne));
                    out.push(Child::Elem(ne));
                }
                other => out.push(other),
            }
        }
        Ok(out)
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
        } = self.compiled.templates[t].elems[e];
        // Own attributes other than name and extend, or children, override
        // the referent's; with none, the copy aliases every public prop.
        let own_attrs: Vec<String> = d
            .attrs(el)
            .map(|a| d.attr_name(a).to_string())
            .filter(|n| n != "name" && n != "extend")
            .collect();
        let has_children = !d.children(el).iter().all(|&n| self.is_blank(n));
        if extend.is_some() && own_attrs.is_empty() && !has_children {
            let n = component_type.prop_defs().len();
            let el = &mut self.compiled.templates[t].elems[e];
            el.props = vec![Source::Inherit; n];
            // A list is as long as the referent's, which the build knows.
            if component_type.given_coords().is_some() {
                el.n_public = NPublic::AsReferent;
            }
            return Ok(());
        }
        // Merged attributes: the referent's node supplies what the copy omits.
        let base_elem = extend
            .and_then(|p| self.plan_elem_target(t, p))
            .filter(|&r| self.compiled.templates[t].elems[r].node != NONE);
        let base = base_elem.map(|r| self.compiled.templates[t].elems[r].node);
        let mut wiring = plan(&mut PlanCtx::new(self, t, e, base))?;
        // Essential state the copy did not override is the original's: the
        // current core's copies share their essential state variables.
        if let Some(r) = base_elem {
            let base_shared_state = self
                .shared_state
                .get(&(t as u32, r as u32))
                .cloned()
                .unwrap_or_default();
            for (state, &slot) in &wiring.shared_state {
                // Shared state the copy gave itself is its own.
                let own = match wiring.shared_state_given.get(state) {
                    Some(Given::Attr(a)) => {
                        own_attrs.iter().any(|o| o.eq_ignore_ascii_case(a.name()))
                    }
                    Some(Given::Children) => true,
                    Some(Given::Referent) | None => false,
                };
                if own {
                    continue;
                }
                if let Some(&bs) = base_shared_state.get(state)
                    && matches!(wiring.props[slot as usize], Some(Source::Literal(_)))
                {
                    wiring.props[slot as usize] = Some(Source::Alias(Arg::Elem(r, bs)));
                }
            }
        }
        let scope = self.compiled.templates[t].elems[e].name_scope;
        self.plan_fix(t, scope, el, &["fixed"])?
            .apply(&mut wiring.props);
        if !wiring.shared_state.is_empty() {
            self.shared_state
                .insert((t as u32, e as u32), wiring.shared_state.clone());
        }
        if component_type.given_coords().is_some() {
            self.compiled.templates[t].elems[e].n_public = NPublic::Planned(wiring.n_public as u32);
        }
        self.compiled.templates[t].elems[e].props = wiring.finish();
        Ok(())
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
        base: Option<NodeId>,
        name: &str,
        default: bool,
    ) -> Result<Source> {
        let d = self.dast;
        Ok(match self.attr_or_inherited(el, base, name) {
            Some(a) if self.single_macro(a).is_some() => {
                self.plan_scalar(t, scope, name, d.attr_children(a))?
            }
            Some(_) => {
                // The copy's own attribute wins: `hide="false"` reveals a
                // copy of a hidden point, as in the current core.
                let owner = match base {
                    Some(b) if d.attr(el, name).is_none() => b,
                    _ => el,
                };
                Source::Literal(if self.attr_flag(owner, name) {
                    1.0
                } else {
                    0.0
                })
            }
            None if base.is_some() => Source::Inherit,
            None => Source::Default(if default { 1.0 } else { 0.0 }),
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

//! Copies, as planned: `extend` with a prop path, container copies (whose
//! clones outlining made, `outline/copies.rs`), the clone elements
//! themselves, and `plan_with_extend`, which runs a `Planner::Plan` type's
//! planner and applies the copy rules around it: a bare copy aliases every
//! prop, and a copy with its own attributes keeps the shared state they
//! supply and shares the rest, which linking ties (`link/mod.rs`).

use crate::compile::*;

impl<'a> Compiler<'a> {
    /// `extend="$c.prop"`: the element's value props alias the named prop.
    pub(in crate::compile) fn plan_extend_prop(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        let component_type = self.outlined(t).elems[e.index()].component_type;
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
                self.compiled.sym_text.insert(id, SymText::Leaf(p));
                prop::math::props_of(id, Post::None)
            }
            // Its points are the list's, synthesized when built.
            ComponentType::PointList => {
                self.tables[t.index()].plans[e.index()].from = Some(p);
                Vec::new()
            }
            _ => return Err(Error::PathTooDeep(self.compiled.ref_display(p))),
        };
        self.tables[t.index()].plans[e.index()].props = props;
        Ok(())
    }

    /// `<graph extend="$g" name="g2"/>`: the copy's props alias the
    /// original's. Its children, clones, it has from outlining
    /// (`expand_container_copy`).
    pub(in crate::compile) fn plan_container_copy(
        &mut self,
        t: TemplateId,
        e: ElemId,
        p: RefId,
    ) -> Result<()> {
        self.plan_attrs(t, e, Some(p))
    }

    /// Plan a bare copy (an `extend` with no attribute or child of its own,
    /// or a cloned child of one): every public prop aliases the referent's
    /// port of the same position, its deferred props planned as every
    /// element's are, and a list is as long as the referent's, which only
    /// the build knows.
    pub(in crate::compile) fn plan_bare_copy(&mut self, t: TemplateId, e: ElemId) {
        let component_type = self.outlined(t).elems[e.index()].component_type;
        let extend = self.tables[t.index()].plans[e.index()]
            .extend
            .expect("a bare copy extends");
        let mut props: Vec<Source> = (0..component_type.prop_defs().len())
            .map(|i| Source::port_of(extend, i))
            .collect();
        Deferred::mark(component_type, &mut props);
        let plan = &mut self.tables[t.index()].plans[e.index()];
        plan.props = props;
        if component_type.given_coords().is_some() {
            plan.list = ListLen::AsReferent;
        }
    }

    /// The referent of `extend` `p` of an element of template `t`, when
    /// the templates name one element: in this template, or in another
    /// reached by the path, with the path to rebase its record through.
    pub(in crate::compile) fn extend_referent(
        &mut self,
        t: TemplateId,
        p: RefId,
    ) -> Option<Referent> {
        if let Some(r) = self.plan_elem_target(t, p) {
            return (self.outlined(t).elems[r.index()].node != NodeId::NONE)
                .then_some(Referent::Here(r));
        }
        let (ty, last) = self.ref_target(t, p).ok()?;
        let (rt, re) = last?;
        // The path ends at the element (not at a collect an index steps
        // into), which is one the author wrote.
        let plan = &self.compiled.refs[p.index()];
        let ends_at_elem = matches!(plan.steps.last(), Some(Step::Elem(_))) && plan.prop.is_none();
        (ends_at_elem
            && ty.is_some()
            && self.outlined(rt).elems[re.index()].node != NodeId::NONE
            && (rt != t || true))
            .then_some(Referent::Path(p, rt, re))
    }

    /// Runs a `Plan` type's planner (`plan`, from `planner`) with the copy
    /// rules around it (ADR 0032, decision 3): a bare copy aliases every
    /// prop; a copy with its own attributes or children is planned from
    /// its record merged under the referent's, each value where its
    /// writer sits (ADR 0023), the referent's rebased through the path
    /// when the referent sits in another template; and every given leaf
    /// the copy did not give itself is shared with the referent's port
    /// holding it (`link_given_leaves`).
    pub(in crate::compile) fn plan_with_extend(
        &mut self,
        t: TemplateId,
        e: ElemId,
        extend: Option<RefId>,
        plan: super::planner::PlanFn,
    ) -> Result<()> {
        let d = self.dast;
        let el = self.outlined(t).elems[e.index()].node;
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
        let mut record = self.parsed().record(t, e)?;
        let referent = match extend {
            Some(p) => {
                let r = self.extend_referent(t, p).ok_or_else(|| {
                    Error::Unsupported(format!(
                        "attributes or children on an extend of '${}', which names no element; a bare extend of it works",
                        self.compiled.ref_display(p)
                    ))
                })?;
                let (rt, re) = match r {
                    Referent::Here(re) => (t, re),
                    Referent::Path(_, rt, re) => (rt, re),
                };
                // A referent whose record did not parse is boxed by its
                // own error; the copy is boxed as its reader (ADR 0027).
                let theirs = self
                    .parsed()
                    .record(rt, re)
                    .map_err(|_| Error::BoxedReferent(self.compiled.ref_display(p)))?;
                let theirs = match r {
                    Referent::Here(_) => theirs,
                    Referent::Path(p, ..) => self.rebase_record(p, theirs),
                };
                record = record.merged_over(&theirs);
                Some(r)
            }
            None => None,
        };
        let here = match referent {
            Some(Referent::Here(r)) => Some(r),
            _ => None,
        };
        let wiring = plan(&mut PlanCtx::new(self, t, e, record, here))?;
        // A given leaf the copy did not give itself is the referent's: the
        // current core's copies share their essential state variables. The
        // copy names what it shares, and linking ties it to the port the
        // referent's planning gives it (`link_given_leaves`, ADR 0029).
        if let Some(r) = referent {
            for (&id, &port) in wiring.given() {
                let own = match id {
                    GivenId::Attr(a, _) => {
                        own_attrs.iter().any(|o| o.eq_ignore_ascii_case(a.name()))
                    }
                    GivenId::Children(_) => has_children,
                    GivenId::Param(_) => false,
                };
                if own || !wiring.is_given(port) {
                    continue;
                }
                self.planning().shares.push(Share {
                    t,
                    e,
                    port,
                    referent: r,
                    id,
                });
            }
        }
        if !wiring.given().is_empty() {
            self.planning()
                .given
                .insert((t.get(), e.get()), wiring.given().clone());
        }
        let (props, list) = wiring.finish();
        let plan = &mut self.tables[t.index()].plans[e.index()];
        plan.props = props;
        plan.list = list;
        Ok(())
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

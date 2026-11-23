//! Outlining's rows, as planning reaches them: each by the relation the
//! read is (ADR 0050, decision 3). The raw index into a template's rows
//! is written in this file and in no other of this directory: [`Rows`],
//! which planning holds in place of a [`Reader`], gives the readers
//! ([`SourceReader`]) and the accessors below, and nothing else.
//!
//! | The accessor | The row | Where the dependency is |
//! |---|---|---|
//! | [`own_row`](Rows::own_row) | the element being planned | nowhere: it is no dependency |
//! | [`enclosing_row`](Rows::enclosing_row), [`in_graph`](Rows::in_graph), [`under_graph`](Rows::under_graph), [`nearest_attr`](Rows::nearest_attr) | an ancestor | the tree: boxing an element boxes what is under it |
//! | [`owned_row`](Rows::owned_row), [`body_rows`](Rows::body_rows) | an element under the one planned, which its plan is made of | the plan: it reads a port of that element |
//! | [`referent_row`](Rows::referent_row) | an element a reference names | the plan, where the reference is in a source; else the read list, by [`referent_type`](SourceReader::referent_type) |
//!
//! None of them records a read. The one read that is recorded is
//! `referent_type`, a reader's; `referent_row` is for what a planner
//! reads of a referent beside its type (its node, its scope, its own
//! `extend`), after that read or with the reference in the plan.

use super::Planning;
use crate::compile::*;

/// What planning reads in place of a [`Reader`]: the readers, by deref,
/// and outlining's rows by the relation of the read. Its `Reader` is its
/// own, so no other file of this directory indexes a template's rows.
#[derive(Clone, Copy)]
pub(super) struct Rows<'a> {
    whole: Reader<'a>,
}

impl<'a> std::ops::Deref for Rows<'a> {
    type Target = SourceReader<'a>;

    fn deref(&self) -> &SourceReader<'a> {
        &self.whole
    }
}

/// An ancestor that gives an attribute ([`Rows::nearest_attr`]).
pub(super) struct Giver<'a> {
    /// Its template.
    pub(super) t: TemplateId,
    /// Its row.
    pub(super) row: &'a Elem,
    /// The attribute.
    pub(super) attr: AttrId,
    /// How many templates up it is from the element that asked.
    pub(super) hops: u32,
}

impl<'a> Rows<'a> {
    /// Planning's rows, over what every stage reads.
    pub(super) fn new(whole: Reader<'a>) -> Self {
        Rows { whole }
    }

    /// The row of element `e` of template `t`, the element being planned.
    pub(super) fn own_row(&self, t: TemplateId, e: ElemId) -> &'a Elem {
        self.whole.elem(t, e)
    }

    /// The element around element `e` of template `t`, with its row: its
    /// parent in the template, else the repeat or choice the template
    /// belongs to, a template up. What it returns is an ancestor of `e`,
    /// so a box of it is a box of `e` (ADR 0050, decision 2).
    pub(super) fn enclosing_row(
        &self,
        t: TemplateId,
        e: ElemId,
    ) -> Option<(TemplateId, ElemId, &'a Elem)> {
        let scope = self.whole.elem(t, e).name_scope;
        let (at, ae) = if scope != ROOT_SCOPE && scope != e {
            (t, scope)
        } else {
            self.whole.outlined(t).parent?
        };
        Some((at, ae, self.whole.elem(at, ae)))
    }

    /// The graph element `e` of template `t` sits in directly, when its
    /// parent in the template is one.
    pub(super) fn in_graph(&self, t: TemplateId, e: ElemId) -> Option<ElemId> {
        let (at, ae, row) = self.enclosing_row(t, e)?;
        (at == t && row.component_type.graph_bounds().is_some()).then_some(ae)
    }

    /// Whether a graph is above element `e` of template `t`: among its
    /// ancestors in the template, or above the repeat or choice the template
    /// belongs to.
    pub(super) fn under_graph(&self, mut t: TemplateId, mut e: ElemId) -> bool {
        while let Some((at, ae, row)) = self.enclosing_row(t, e) {
            if row.component_type.graph_bounds().is_some() {
                return true;
            }
            (t, e) = (at, ae);
        }
        false
    }

    /// The nearest element, from `e` up through its ancestors and, when
    /// `inherited`, through the repeats and choices around its template,
    /// whose node gives attribute `name`. Without `inherited`, only `e`
    /// itself.
    pub(super) fn nearest_attr(
        &self,
        mut t: TemplateId,
        mut e: ElemId,
        name: &str,
        inherited: bool,
    ) -> Option<Giver<'a>> {
        let d = self.dast;
        let mut hops = 0;
        let mut row = self.own_row(t, e);
        loop {
            if row.node != NodeId::NONE
                && let Some(attr) = d.attr(row.node, name)
            {
                return Some(Giver { t, row, attr, hops });
            }
            if !inherited {
                return None;
            }
            let (at, ae, around) = self.enclosing_row(t, e)?;
            hops += u32::from(at != t);
            (t, e, row) = (at, ae, around);
        }
    }

    /// The row of element `k`, which is under element `e` of template `t`
    /// and which `e`'s plan is made of: an answer's input or award, a
    /// choice input's choice, an input a type owns (ADR 0045), a list's
    /// entry. The plan reads a port of `k`, so a box of `k` boxes `e` when
    /// linking; a read of `k` that puts no port of it in the plan is not
    /// this accessor's (ADR 0050, open questions).
    pub(super) fn owned_row(&self, t: TemplateId, e: ElemId, k: ElemId) -> &'a Elem {
        debug_assert!(
            self.is_under(t, e, k),
            "an owned element is under its owner"
        );
        self.whole.elem(t, k)
    }

    /// Whether element `k` of template `t` is under element `e` of it.
    fn is_under(&self, t: TemplateId, e: ElemId, mut k: ElemId) -> bool {
        loop {
            let scope = self.whole.elem(t, k).name_scope;
            if scope == e {
                return true;
            }
            if scope == ROOT_SCOPE || scope == k {
                return false;
            }
            k = scope;
        }
    }

    /// The body template of repeat `e` of template `t`, and its rows:
    /// among them the hidden elements outlining made for the repeat
    /// (its item, its value, its index), which the repeat plans and
    /// nothing else does. Nothing when `e` has no body template.
    pub(super) fn body_rows(&self, t: TemplateId, e: ElemId) -> Option<(TemplateId, &'a [Elem])> {
        let Body::Repeat { template } = self.whole.elem(t, e).body else {
            return None;
        };
        Some((template, &self.whole.outlined(template).elems))
    }

    /// The row of element `x` of template `rt`, which a reference the
    /// element being planned holds names: what a planner reads of a
    /// referent beside its type. Unrecorded: the caller has read the
    /// referent's type through `referent_type`, which recorded the read,
    /// or puts the reference in a source of the plan.
    pub(super) fn referent_row(&self, rt: TemplateId, x: ElemId) -> &'a Elem {
        self.whole.elem(rt, x)
    }

    // The tables' shape, which is no element's row.

    /// How many elements template `t` has.
    pub(super) fn elem_count(&self, t: TemplateId) -> usize {
        self.whole.outlined(t).elems.len()
    }

    /// The `$ref` children of template `t`, by [`RefChildId`].
    pub(super) fn ref_children(&self, t: TemplateId) -> &'a [RefChild] {
        &self.whole.outlined(t).ref_children
    }

    /// The repeat or choice template `t` belongs to, with its template.
    pub(super) fn template_parent(&self, t: TemplateId) -> Option<(TemplateId, ElemId)> {
        self.whole.outlined(t).parent
    }
}

/// Planning, boxing: the one thing planning does with every row at once.
impl Planning<'_> {
    /// Box element `e` of template `t` where it failed, and what is under
    /// it (`Boxes::box_in_place`).
    pub(super) fn box_in_place(&mut self, t: TemplateId, e: ElemId, error: Error) {
        self.boxes.box_in_place(
            &self.rd.whole.settled().templates,
            &mut self.tables,
            t,
            e,
            error,
        );
    }
}

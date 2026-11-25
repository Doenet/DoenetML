//! The typing stage's reads (ADR 0076 §8): every element's author type and
//! every reference's, from what outlining settled and the declarations,
//! and no value.
//!
//! A reference's type is walked along its path element by element: a name,
//! an iteration of a repeat, an item of a collection, a pick, an interface
//! name, each typed by §5 (one component stands in as it; several branches
//! join at the one type each *is a*), then the prop by its declared type
//! and each `[k]` by §6. Planning's own type question
//! ([`SourceReader::ref_value_kind`]) checks its answers against these in
//! debug builds, so every document a test loads compares the two (ADR
//! 0076, Migration step 3).

use crate::compile::*;
use crate::components::{PropType, TypeDecl, types::join};

/// What a reference reads, to an author.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(in crate::compile) enum Typed {
    /// A value of the type.
    Is(PropType),
    /// It names nothing: the missing value (ADR 0046), of whatever type
    /// its place wants.
    Missing,
    /// The templates alone do not tell: a whole iteration of several
    /// components, a branch interface the branches disagree on, a group of
    /// several components.
    Unknown,
}

impl SourceReader<'_> {
    /// The type of element `e` of template `t` (ADR 0076 §5): its
    /// declared type, or for a composite the type of what is written in
    /// it. `None` where that is no one type.
    pub(in crate::compile) fn elem_author_type(
        &self,
        t: TemplateId,
        e: ElemId,
    ) -> Option<ComponentType> {
        let el = self.elem(t, e);
        let ty = el.component_type;
        if ty.type_decl() != TypeDecl::ByElement || ty.structure_kind().is_none() {
            return Some(ty);
        }
        match el.body {
            // A select's pick, a conditional's case: the one type each
            // branch is.
            Body::Choice(cid) => self.branches_type(&self.choice(cid).branches),
            // A repeat holds any number of iterations: a list, not a value.
            Body::Repeat { .. } => None,
            Body::Collect { .. } => None,
            // A group of one stands in as it.
            Body::Plain => self.one_component(&el.children, t),
        }
    }

    /// The one element a group of one (or a group of one group of one, ...)
    /// stands in as (ADR 0076 §5): `None` for any other element.
    pub(in crate::compile) fn stands_in_element(&self, t: TemplateId, e: ElemId) -> Option<ElemId> {
        let el = self.elem(t, e);
        if el.component_type.type_decl() != TypeDecl::ByElement
            || el.component_type.structure_kind().is_none()
            || !matches!(el.body, Body::Plain)
        {
            return None;
        }
        let mut comps = el.children.iter().filter(|c| !matches!(c, Child::Text(_)));
        match (comps.next(), comps.next()) {
            (Some(Child::Elem(c)), None) => Some(self.stands_in_element(t, *c).unwrap_or(*c)),
            _ => None,
        }
    }

    /// The type of the one component `children` holds, when they hold
    /// exactly one element.
    fn one_component(&self, children: &[Child], t: TemplateId) -> Option<ComponentType> {
        let mut comps = children.iter().filter(|c| !matches!(c, Child::Text(_)));
        match (comps.next(), comps.next()) {
            (Some(Child::Elem(e)), None) => self.elem_author_type(t, *e),
            _ => None,
        }
    }

    /// The type of a template that holds one component.
    fn template_type(&self, t: TemplateId) -> Option<ComponentType> {
        self.one_component(&self.outlined(t).children, t)
    }

    /// The one type every branch is, each branch holding one component.
    fn branches_type(&self, branches: &[TemplateId]) -> Option<ComponentType> {
        let types: Option<Vec<ComponentType>> =
            branches.iter().map(|&b| self.template_type(b)).collect();
        join(&types?)
    }

    /// The type of reference `p`, planned from template `t`, walked along
    /// its path (ADR 0076 §8).
    pub(in crate::compile) fn ref_type(&self, ar: &Arenas, t: TemplateId, p: RefId) -> Typed {
        let plan = &ar.refs[p.index()];
        let mut t = t;
        for _ in 0..plan.hops {
            let Some((pt, _)) = self.outlined(t).parent else {
                return Typed::Unknown;
            };
            t = pt;
        }
        let mut cur: Option<ElemId> = None;
        let mut ty: Option<ComponentType> = None;
        // The element the path is at, whose own props a named prop may be
        // (a collect's `count`), where `ty` is what is written in it.
        let mut own: Option<ComponentType> = None;
        for step in &plan.steps {
            own = None;
            match step {
                Step::Nothing => return Typed::Missing,
                Step::Elem(e) => {
                    cur = Some(*e);
                    ty = self.elem_author_type(t, *e);
                    own = Some(self.elem(t, *e).component_type);
                }
                Step::Iter(_) => {
                    let Some(Body::Repeat { template }) =
                        cur.map(|c| &self.outlined(t).elems[c.index()].body)
                    else {
                        return Typed::Unknown;
                    };
                    t = *template;
                    cur = None;
                    ty = self.template_type(t);
                }
                Step::Item(Collection::Gathered, _) => {
                    let Some(Body::Collect { component_type }) =
                        cur.map(|c| &self.outlined(t).elems[c.index()].body)
                    else {
                        return Typed::Unknown;
                    };
                    ty = Some(*component_type);
                }
                Step::Item(Collection::ListPoints, _) => ty = Some(Role::ListPoint.ty()),
                Step::Item(Collection::Picks, _) => {
                    let Some(Body::Choice(cid)) =
                        cur.map(|c| &self.outlined(t).elems[c.index()].body)
                    else {
                        return Typed::Unknown;
                    };
                    cur = None;
                    ty = self.branches_type(&self.choice(*cid).branches);
                }
                Step::Item(..) => return Typed::Unknown,
                Step::Iface(cid, id) => {
                    // Typed over every component of the name (COMP-11).
                    let name = self.names().text(*id).to_string();
                    let hits: Vec<(TemplateId, ElemId)> = self
                        .choice(*cid)
                        .branches
                        .iter()
                        .filter_map(|&b| match self.name_at(b, ROOT_SCOPE, &name) {
                            NameHit::One(x) => Some((b, x)),
                            _ => None,
                        })
                        .collect();
                    let types: Option<Vec<ComponentType>> = hits
                        .iter()
                        .map(|&(b, x)| self.elem_author_type(b, x))
                        .collect();
                    let Some(&(bt, be)) = hits.first() else {
                        return Typed::Unknown;
                    };
                    t = bt;
                    cur = Some(be);
                    ty = types.and_then(|types| join(&types));
                }
            }
        }
        // A prop the element itself has is its own; anything else is of
        // what is written in it.
        let ty = match (plan.prop, own) {
            (Some(rp), Some(o)) if rp.sel_on(o).is_some() => Some(o),
            _ => ty,
        };
        let Some(ty) = ty else {
            return Typed::Unknown;
        };
        let read = match plan.prop {
            None => match ty.default_sel() {
                Some(sel) => ty.sel_type(sel),
                // A bare reference to an object is the object.
                None => Some(PropType::Is(ty)),
            },
            Some(rp) => rp.sel_on(ty).and_then(|sel| ty.sel_type(sel)),
        };
        // A list's entries a literal `type` names (ADR 0074).
        let read = match read {
            Some(PropType::ByElement) if ty.entries_by_type() => {
                let written = cur
                    .and_then(|c| self.dast.attr_peek(self.elem(t, c).node, "type"))
                    .and_then(|a| self.attr_text(a));
                match ty
                    .entry_by_type(written.as_deref())
                    .and_then(|k| k.author_type())
                {
                    Some(PropType::Is(entry)) => Some(PropType::ListOf(entry)),
                    _ => read,
                }
            }
            other => other,
        };
        let Some(mut read) = read else {
            return Typed::Unknown;
        };
        for _ in &plan.entries {
            match read.entry() {
                Some(entry) => read = entry,
                None => return Typed::Unknown,
            }
        }
        Typed::Is(read)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::compile::ir::boxes::Boxes;
    use crate::components::{ComponentType as C, PropType::*};

    /// Each `$ref` child of `src`, as written, with its type: the compile
    /// run through planning, which plans them.
    fn typed(src: &str) -> Vec<(String, Typed)> {
        let json = crate::testing::test_utils::dast_json(src);
        let dast = crate::dast::load(json.as_bytes()).unwrap();
        let boxed = HashSet::new();
        let (settled, tables, mut ar, mut boxes, mut work) =
            stages::outline::outline(&dast, Boxes::new(&boxed));
        boxes.enter(Stage::Parse);
        let parsed = stages::parse::parse(
            Reader::new(&dast, &settled),
            &tables,
            &mut ar,
            std::mem::take(&mut work.math_texts),
            &work.to_plan,
        );
        boxes.enter(Stage::Plan);
        let (tables, ar, _, _) = stages::plan::plan(
            Reader::new(&dast, &settled),
            &parsed,
            tables,
            ar,
            boxes,
            work,
        );
        let rd = Reader::new(&dast, &settled);
        let mut out = Vec::new();
        for (t, tpl) in tables.iter().enumerate() {
            let t = TemplateId::new(t as u32);
            for plan in &tpl.ref_child_plans {
                if let RefChildPlan::Ref(p) = plan {
                    let shown = display_of(&dast, &ar.refs[p.index()]);
                    out.push((shown, rd.ref_type(&ar, t, *p)));
                }
            }
        }
        out
    }

    /// The types of `src`'s `$ref` children, in document order.
    fn types(src: &str) -> Vec<Typed> {
        typed(src).into_iter().map(|(_, ty)| ty).collect()
    }

    #[test]
    fn a_name_its_prop_and_an_entry() {
        let src = r#"<point name="P">(1,2)</point><numberList name="l">1 2</numberList>
            <math name="m">x+1</math><boolean name="b">true</boolean>
            <p>$P $P.x $l $l[2] $m $b $P[1] $nothing</p>"#;
        assert_eq!(
            types(src),
            [
                Typed::Is(Is(C::Point)),
                Typed::Is(Is(C::Number)),
                Typed::Is(ListOf(C::Number)),
                Typed::Is(Is(C::Number)),
                Typed::Is(Is(C::Math)),
                Typed::Is(Is(C::Boolean)),
                // A coordinate (§6).
                Typed::Is(Is(C::Number)),
                Typed::Missing,
            ]
        );
    }

    #[test]
    fn an_iteration_a_gathered_item_and_a_pick() {
        let src = r#"<repeatForSequence name="r" length="3"><number name="x">1</number></repeatForSequence>
            <repeatForSequence name="two" length="2"><number>1</number><text>a</text></repeatForSequence>
            <collect name="c" from="$r" componentType="number"/>
            <select name="s"><option><number>1</number></option><option><math>x</math></option></select>
            <select name="pv"><option><point>(1,2)</point></option><option><vector>(1,2)</vector></option></select>
            <p>$r[2].x $r[2] $two[1] $c[1] $c.count $s[1] $pv[1]</p>"#;
        assert_eq!(
            types(src),
            [
                Typed::Is(Is(C::Number)),
                Typed::Is(Is(C::Number)),
                // An iteration of several components is no one value.
                Typed::Unknown,
                Typed::Is(Is(C::Number)),
                // A collect's own prop.
                Typed::Is(Is(C::Integer)),
                // A number beside a math is a math (§5).
                Typed::Is(Is(C::Math)),
                // A point beside a vector is no type.
                Typed::Unknown,
            ]
        );
    }

    #[test]
    fn an_interface_name_over_every_branch() {
        let src = r#"<booleanInput name="bi"/>
            <conditionalContent name="cc">
              <case condition="$bi"><number name="v">1</number></case>
              <else><math name="v">x</math></else>
            </conditionalContent>
            <p>$cc.v</p>"#;
        assert_eq!(types(src), [Typed::Is(Is(C::Math))]);
    }

    #[test]
    fn a_group_of_one_stands_in_as_it() {
        let src = r#"<group name="g"><text>hi</text></group><p>$g</p>"#;
        assert_eq!(types(src), [Typed::Is(Is(C::Text))]);
    }
}

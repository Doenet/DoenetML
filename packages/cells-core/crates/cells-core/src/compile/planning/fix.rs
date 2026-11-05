//! `fixed`, `fixLocation` and a graph's `fixAxes`: the attributes that
//! hold an element, declared once in [`HOLD_ATTRS`]. What holds an element
//! is a fact beside its plans ([`Hold`]), never a change to them: every
//! cell of a held element refuses requests while the hold is set. `fixed`
//! and `fixLocation` are inherited: what an element does not give itself,
//! the nearest element around it that gives decides.

use crate::compile::*;

/// An attribute that holds an element: whether an element without it takes
/// the nearest container's (an element's own setting always wins), and
/// which types it holds.
pub(in crate::compile) struct HoldAttr {
    pub(in crate::compile) name: &'static str,
    /// Whether an element that does not write the attribute takes it from
    /// the nearest element around it that does, through the repeats and
    /// choices around its template. Without, only the element's own counts.
    pub(in crate::compile) inherited: bool,
    /// The types it holds. An inherited attribute is read on every type,
    /// so a container may give it to what is inside.
    pub(in crate::compile) holds: fn(ComponentType) -> bool,
}

/// Every attribute that holds an element. A new one is a row here.
pub(in crate::compile) const HOLD_ATTRS: &[HoldAttr] = &[
    // An element whose value is held: no request changes it.
    HoldAttr {
        name: "fixed",
        inherited: true,
        holds: every_type,
    },
    // A located type's location is held (ADR 0022); in this core every
    // value a located type holds is its location.
    HoldAttr {
        name: "fixLocation",
        inherited: true,
        holds: ComponentType::located,
    },
    // A graph's bounds: a pan or a zoom is refused.
    HoldAttr {
        name: "fixAxes",
        inherited: false,
        holds: is_graph,
    },
];

fn every_type(_: ComponentType) -> bool {
    true
}

fn is_graph(component_type: ComponentType) -> bool {
    component_type == ComponentType::Graph
}

impl<'a> Compiler<'a> {
    /// How the attributes of [`HOLD_ATTRS`] reach element `e`: each its
    /// own, else (an inherited one) the nearest ancestor's. A
    /// literal true on any of them holds the element always; a reference
    /// holds it while its flag is set, several while any is.
    pub(in crate::compile) fn plan_hold(
        &mut self,
        rf: &mut Refs,
        t: TemplateId,
        e: ElemId,
    ) -> Result<Hold> {
        let component_type = self.outlined(t).elems[e.index()].component_type;
        let mut flags = Vec::new();
        for row in HOLD_ATTRS {
            let holds = (row.holds)(component_type);
            // An attribute that is the element's own and does not hold it
            // is not looked up, so the unread check refuses it (ADR 0021).
            if !holds && !row.inherited {
                continue;
            }
            let Some((at, ae, a, hops)) = self.nearest_attr(t, e, row.name, row.inherited) else {
                continue;
            };
            if !holds {
                continue;
            }
            let Elem {
                node, name_scope, ..
            } = self.outlined(at).elems[ae.index()];
            if self.attr_text(a).is_some() {
                if self.attr_flag(node, row.name) {
                    return Ok(Hold::Always);
                }
                // An explicit false, the element's own or the nearest
                // around it, is the answer for this attribute.
                continue;
            }
            // A reference, planned where the element that wrote it sits
            // (its names mean what they mean there), and reached from
            // `e` that many templates up.
            let m = self.single_macro(a).ok_or_else(|| Error::BadValue {
                attr: row.name.into(),
                text: self.attr_text(a).unwrap_or_default(),
            })?;
            let p = self.plan_ref(rf, at, name_scope, m)?;
            self.compiled.refs[p.index()].hops += hops;
            flags.push(p);
        }
        Ok(if flags.is_empty() {
            Hold::Off
        } else {
            Hold::While(flags)
        })
    }

    /// The nearest element, from `e` up through its ancestors and, when
    /// `inherited`, through the repeats and choices around its template,
    /// whose node gives attribute `name`: its template and element, the
    /// attribute, and how many templates up it is from `e`. Without
    /// `inherited`, only `e` itself.
    fn nearest_attr(
        &self,
        mut t: TemplateId,
        mut e: ElemId,
        name: &str,
        inherited: bool,
    ) -> Option<(TemplateId, ElemId, AttrId, u32)> {
        let d = self.dast;
        let mut hops = 0;
        loop {
            let el = &self.outlined(t).elems[e.index()];
            if el.node != NodeId::NONE
                && let Some(a) = d.attr(el.node, name)
            {
                return Some((t, e, a, hops));
            }
            if !inherited {
                return None;
            }
            if el.name_scope != ROOT_SCOPE {
                e = el.name_scope;
            } else {
                let (pt, pe) = self.outlined(t).parent?;
                t = pt;
                e = pe;
                hops += 1;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::testing::dast::{Element, Nodes, el, mac};

    /// The plan of the element named `name` in the compile, in any
    /// template: nothing when it was boxed.
    fn plan<'c>(compiled: &'c Compiled, name: &str) -> Option<&'c ElemPlan> {
        compiled.templates.iter().find_map(|t| {
            let e = t.elems.iter().position(|e| {
                e.name != StrId::NONE && compiled.dast.strings.get(e.name).trim() == name
            })?;
            Some(t.plan(ElemId::from_index(e)))
        })
    }

    /// Whether the element named `x` in `doc` is held, and whether `doc`
    /// loads with no error (a refused `x` is not held).
    fn held_and_clean(doc: Vec<Element>) -> (bool, bool) {
        let mut all = vec![el("testValue").name("f").attr("value", "1")];
        all.extend(doc);
        let dast = crate::testing::dast::build(all.into_iter().map(Into::into));
        let compiled = crate::testing::compile(&dast).unwrap();
        // The accessibility lint is about the document (a graph without a
        // description), not the attribute.
        let clean = compiled
            .diagnostics
            .iter()
            .all(|d| d.kind == crate::DiagnosticKind::Accessibility);
        let held = plan(&compiled, "x").is_some_and(|x| !matches!(x.hold, Hold::Off));
        (held, clean)
    }

    /// Every row of `HOLD_ATTRS` holds as its row says: an own setting
    /// wins, an inherited one reaches through containers and repeats, and
    /// an own-only one on a type it does not hold is refused.
    #[test]
    fn every_hold_attribute_holds_as_its_row_says() {
        for row in HOLD_ATTRS {
            let tag = ComponentType::ALL
                .iter()
                .filter(|&&t| (row.holds)(t) && !t.def().flags.internal)
                .map(|t| t.tag())
                // One that loads on its own, as `<tag name="x"/>`.
                .find(|tag| {
                    std::panic::catch_unwind(|| held_and_clean(vec![el(tag).name("x")]))
                        .is_ok_and(|(_, clean)| clean)
                })
                .unwrap_or_else(|| panic!("{} holds no type that loads", row.name));
            let x = || el(tag).name("x");
            let at = |what: &str| format!("{} on <{tag}>: {what}", row.name);
            let held = |doc: Vec<Element>| {
                let (held, clean) = held_and_clean(doc);
                assert!(clean, "{} on <{tag}> loads with an error", row.name);
                held
            };
            assert!(held(vec![x().attr(row.name, "true")]), "{}", at("own"));
            assert!(
                !held(vec![x().attr(row.name, "false")]),
                "{}",
                at("own false")
            );
            assert!(
                held(vec![x().attr(row.name, mac("f"))]),
                "{}",
                at("own reference")
            );
            let around =
                |value: Nodes, inner: Element| vec![el("group").attr(row.name, value).child(inner)];
            let in_repeat = |inner: Element| {
                el("repeatForSequence")
                    .name("r")
                    .attr("length", "2")
                    .child(inner)
            };
            if row.inherited {
                assert!(held(around("true".into(), x())), "{}", at("a container's"));
                assert!(
                    held(around(mac("f").into(), in_repeat(x()))),
                    "{}",
                    at("a container's reference, through a repeat")
                );
                assert!(
                    !held(around("true".into(), x().attr(row.name, "false"))),
                    "{}",
                    at("own false in a container's true")
                );
            }
            // On a type it does not hold, an inherited attribute is
            // accepted, for what is inside; an own-only one is refused.
            // (`fixed` holds every type.)
            for other in [ComponentType::TestValue, ComponentType::Point] {
                if (row.holds)(other) {
                    continue;
                }
                let x = el(other.tag()).name("x").attr(row.name, "true");
                let (held, clean) = held_and_clean(vec![x]);
                assert!(!held, "{} holds <{}>", row.name, other.tag());
                assert_eq!(clean, row.inherited, "{} on <{}>", row.name, other.tag());
            }
        }
    }
}

//! `fixed`, `fixLocation` and a graph's `fixAxes`: the attributes that
//! hold an element, declared once in [`HOLD_ATTRS`]. A literal true turns
//! the element's essential values into constants and holds the rest
//! (references, a copy's referent) for good; references put a `Hold` on
//! every slot a request could write through. `fixed` and `fixLocation`
//! are inherited (ADR 0022): what an element does not give itself, the
//! nearest element around it that gives decides, a container's content
//! being fixed with the container unless it says otherwise.
//!
//! `plan_elem` calls [`Compiler::hold_fixed`] once for every element,
//! after whatever planned it, so the rules here hold for every component
//! type and every way an element is planned (a planner of its own, a copy,
//! an `extend` of a prop): none applies them, so none can leave them out.

use super::*;

/// An attribute that holds an element, as `inherited-attributes.md` §5 of
/// the principles states one: whether an element without it takes the
/// nearest container's (an element's own setting always wins over its
/// containers'), and which types it holds. What every row shares is the
/// fold (`Compiler::plan_fix`): a reference means what it means where it
/// was written, however deep the element that inherits it; a reference to
/// the element is held because the hold is upstream of every alias; and a
/// held element still follows its sources (a hold blocks only requests).
pub(in crate::compile) struct HoldAttr {
    pub(in crate::compile) name: &'static str,
    /// Whether an element that does not write the attribute takes it from
    /// the nearest element around it that does, through the repeats and
    /// choices around its template. Without, only the element's own counts.
    pub(in crate::compile) inherited: bool,
    /// The types it holds. An inherited attribute is read on every type,
    /// so a container may give it to what is inside; on a type it does not
    /// hold, it has nothing to do there.
    pub(in crate::compile) holds: fn(ComponentType) -> bool,
}

/// Every attribute that holds an element. A new one is a row here.
pub(in crate::compile) const HOLD_ATTRS: &[HoldAttr] = &[
    // An element whose value is fixed: no request changes it.
    HoldAttr {
        name: "fixed",
        inherited: true,
        holds: every_type,
    },
    // A located type's location is fixed (ADR 0022); in this core every
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
    /// Holds element `e`, planned, as the attributes of [`HOLD_ATTRS`]
    /// that reach it say: each slot a request could write through moves
    /// behind a `Hold` (`Fix::apply`). Called by `plan_elem` once for every
    /// element, whatever planned it.
    pub(in crate::compile) fn hold_fixed(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        // A copy of a type with a list takes its slots, as many as its
        // referent has, when it is built (`place_list_copies`): none is
        // here yet to hold, and no hidden slot can follow them. Its
        // referent's own hold is upstream of it.
        if self.compiled.templates[t.index()].elems[e.index()].n_public == NPublic::AsReferent {
            return Ok(());
        }
        let fix = self.plan_fix(t, e)?;
        let el = &mut self.compiled.templates[t.index()].elems[e.index()];
        let mut props: Vec<Option<Source>> = std::mem::take(&mut el.props)
            .into_iter()
            .map(Some)
            .collect();
        let held = fix.apply(&mut props);
        el.props = props
            .into_iter()
            .map(|p| p.expect("an element's slots are all planned"))
            .collect();
        self.record_held(t, e, held);
        Ok(())
    }

    /// How the attributes of [`HOLD_ATTRS`] reach element `e`: each its
    /// own, else (an inherited one) the nearest ancestor's (ADR 0022). A
    /// literal true on any of them fixes the element at build time; a
    /// reference is a flag cell, so the element is gated while the flag is
    /// nonzero. Several references gate on any of them.
    fn plan_fix(&mut self, t: TemplateId, e: ElemId) -> Result<Fix> {
        let d = self.dast;
        let component_type = self.compiled.templates[t.index()].elems[e.index()].component_type;
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
            } = self.compiled.templates[at.index()].elems[ae.index()];
            if self.attr_text(a).is_some() {
                if self.attr_flag(node, row.name) {
                    return Ok(Fix::Literal);
                }
                // An explicit false, the element's own or the nearest
                // around it, is the answer for this attribute.
                continue;
            }
            // A reference, planned where the element that wrote it sits
            // (its names mean what they mean there), and reached from
            // `e` that many templates up.
            let source = self.plan_value(at, name_scope, row.name, d.attr_children(a), None)?;
            if let (Source::Alias(Arg::Ref(p, _)), 1..) = (&source, hops) {
                self.compiled.refs[p.index()].hops += hops;
            }
            flags.push(source);
        }
        Ok(if flags.is_empty() {
            Fix::Off
        } else {
            Fix::Dynamic(flags)
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
    ) -> Option<(TemplateId, ElemId, u32, u32)> {
        let d = self.dast;
        let mut hops = 0;
        loop {
            let el = &self.compiled.templates[t.index()].elems[e.index()];
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
                let (pt, pe) = self.compiled.templates[t.index()].parent?;
                t = pt;
                e = pe;
                hops += 1;
            }
        }
    }
}

/// How a `fixed` attribute (and a graph's `fixAxes`) reaches an element.
pub(in crate::compile) enum Fix {
    Off,
    /// A literal true: the element's essential cells become fixed cells,
    /// and the slots a request could still write through (references, a
    /// copy's referent) are held by a constant flag.
    Literal,
    /// References: flag cells (any nonzero holds) that gate the element.
    Dynamic(Vec<Source>),
}

impl Fix {
    /// Fix `props`; returns each slot it held and the hidden slot its
    /// source moved to, which saved state names as the held slot (ADR 0017).
    pub(in crate::compile) fn apply(self, props: &mut Vec<Option<Source>>) -> Vec<(u8, u8)> {
        match self {
            Fix::Off => Vec::new(),
            Fix::Literal => {
                fix_literals(props);
                if props.iter().flatten().any(writable) {
                    gate_slots(props, vec![Source::Fixed(1.0)])
                } else {
                    Vec::new()
                }
            }
            Fix::Dynamic(flags) if props.iter().flatten().any(writable) => gate_slots(props, flags),
            Fix::Dynamic(_) => Vec::new(),
        }
    }
}

/// Put a `Hold` on every slot a request could write through: its essential
/// literals, its references and its operators and math over other cells.
/// Each such source moves to a new hidden slot and its old slot becomes
/// `Hold(moved, flag)`, so everything that reads the slot, inside the
/// element or out, reads through the hold. Vector heads and outputs stay in
/// place (they must be consecutive); their inputs are own slots, which are
/// gated themselves.
fn gate_slots(props: &mut Vec<Option<Source>>, flags: Vec<Source>) -> Vec<(u8, u8)> {
    let n = props.len();
    let push = |props: &mut Vec<Option<Source>>, source: Source| {
        props.push(Some(source));
        u8::try_from(props.len() - 1).expect("fewer than 256 slots per element")
    };
    let mut flags = flags.into_iter();
    let mut flag = push(props, flags.next().expect("a dynamic fix has a flag"));
    for f in flags {
        let g = push(props, f);
        flag = push(
            props,
            Source::Op(OpSpec::Max, vec![Arg::Own(flag), Arg::Own(g)]),
        );
    }
    let mut held = Vec::new();
    for i in 0..n {
        let moved = match &props[i] {
            Some(Source::Inherit) => Source::InheritFrom(byte(i)),
            Some(p) if writable(p) => props[i].take().unwrap(),
            _ => continue,
        };
        let h = push(props, moved);
        props[i] = Some(Source::Op(OpSpec::Hold, vec![Arg::Own(h), Arg::Own(flag)]));
        held.push((byte(i), h));
    }
    held
}

/// Whether a request could write through a slot with this source. Every
/// kind of source is decided here, by name: a new one is a compile error
/// until it is, so no slot escapes a hold by being of a kind this match
/// forgot.
fn writable(source: &Source) -> bool {
    match source {
        // Essential: a request writes the cell itself.
        Source::Literal(_)
        | Source::TextLiteral(_)
        | Source::MathEssential(_)
        | Source::MathEssentialFrom(_) => true,
        // Another element's cell, which a request writes through to.
        Source::Inherit | Source::InheritFrom(_) | Source::Alias(Arg::Ref(..) | Arg::Elem(..)) => {
            true
        }
        // Math over other cells, which an inverse or an alias may reach.
        Source::Math(_) | Source::MathValue(_) | Source::MathHandle(..) | Source::SymExpr(..) => {
            true
        }
        // Operators over other cells; over its own slots only, those are
        // held themselves.
        Source::Op(_, args) => args.iter().any(|a| !matches!(a, Arg::Own(_))),
        Source::FirstIteration(first, rest) => writable(first) || writable(rest),
        // Its own slots, held themselves; constants; and what no request
        // writes: an iteration's index or pick, what the build wires, a
        // vector instruction's outputs (its inputs are own slots).
        Source::Alias(Arg::Own(_))
        | Source::Fixed(_)
        | Source::IterIndex
        | Source::SequencePick { .. }
        | Source::Deferred(_)
        | Source::VecOut(..) => false,
    }
}

/// A literal `fixed`: essential cells, given or defaulted, become constants.
fn fix_literals(props: &mut [Option<Source>]) {
    for p in props.iter_mut() {
        if let Some(Source::Literal(v) | Source::TextLiteral(v)) = p {
            *p = Some(Source::Fixed(*v));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::program::Post;
    use crate::testing::dast::{Element, Nodes, el, mac};

    /// One source of every kind, and the kind's position in
    /// [`kind`]'s match: a kind of source added to the core fails to
    /// compile there until it has a sample here.
    fn every_kind() -> Vec<Source> {
        let e = ExprId::from_index(0);
        let p = RefId::from_index(0);
        vec![
            Source::Literal(1.0),
            Source::TextLiteral(1.0),
            Source::Inherit,
            Source::InheritFrom(0),
            Source::Fixed(1.0),
            Source::Alias(Arg::Ref(p, Sel::Whole)),
            Source::Op(OpSpec::Add, vec![Arg::Ref(p, Sel::Whole), Arg::Own(0)]),
            Source::IterIndex,
            Source::SequencePick {
                from: 0.0,
                step: 1.0,
                count: 2,
            },
            Source::Math(e),
            Source::MathHandle(e, Post::None),
            Source::MathValue(e),
            Source::SymExpr(e, Post::None),
            Source::MathEssential(None),
            Source::MathEssentialFrom(p),
            Source::FirstIteration(Box::new(Source::Literal(1.0)), Box::new(Source::IterIndex)),
            Source::Deferred(Deferred::Credit),
            Source::VecOut(0, 1),
        ]
    }

    fn kind(source: &Source) -> usize {
        match source {
            Source::Literal(_) => 0,
            Source::TextLiteral(_) => 1,
            Source::Inherit => 2,
            Source::InheritFrom(_) => 3,
            Source::Fixed(_) => 4,
            Source::Alias(_) => 5,
            Source::Op(..) => 6,
            Source::IterIndex => 7,
            Source::SequencePick { .. } => 8,
            Source::Math(_) => 9,
            Source::MathHandle(..) => 10,
            Source::MathValue(_) => 11,
            Source::SymExpr(..) => 12,
            Source::MathEssential(_) => 13,
            Source::MathEssentialFrom(_) => 14,
            Source::FirstIteration(..) => 15,
            Source::Deferred(_) => 16,
            Source::VecOut(..) => 17,
        }
    }

    /// Whatever kind of source a planner gives a slot, a `fixed` leaves
    /// nothing a request can write through but behind a hold: a literal
    /// one and a dynamic one alike.
    #[test]
    fn a_hold_leaves_no_slot_of_any_kind_writable() {
        let sources = every_kind();
        let kinds: HashSet<usize> = sources.iter().map(kind).collect();
        assert_eq!(kinds.len(), 18, "a sample of every kind of source");
        for fix in [
            Fix::Literal,
            Fix::Dynamic(vec![Source::Alias(Arg::Ref(
                RefId::from_index(1),
                Sel::Whole,
            ))]),
        ] {
            let mut props: Vec<Option<Source>> = sources.iter().cloned().map(Some).collect();
            let n = props.len();
            fix.apply(&mut props);
            for (i, p) in props[..n].iter().enumerate() {
                let p = p.as_ref().unwrap();
                assert!(
                    !writable(p),
                    "{:?} is writable when held: {p:?}",
                    sources[i]
                );
            }
        }
    }

    /// The element named `name` in the compile, in any template; none
    /// when it was boxed.
    fn elem<'c>(compiled: &'c Compiled, name: &str) -> Option<&'c Elem> {
        compiled
            .templates
            .iter()
            .flat_map(|t| &t.elems)
            .find(|e| e.name != StrId::NONE && compiled.dast.strings.get(e.name).trim() == name)
    }

    /// Whether a request could write through any public slot of the
    /// element named `x` in `doc`, and whether it loads with no error (an
    /// attribute nothing reads is refused, ADR 0021; a refused `x` writes
    /// nothing).
    fn writable_and_clean(doc: Vec<Element>) -> (bool, bool) {
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
        let writable = elem(&compiled, "x").is_some_and(|x| {
            let n_public = match x.n_public {
                NPublic::Planned(n) => n as usize,
                _ => x.component_type.prop_defs().len(),
            };
            x.props[..n_public].iter().any(writable)
        });
        (writable, clean)
    }

    /// Every row of `HOLD_ATTRS` behaves as its row says, on the first
    /// type it holds that has something to hold: the element's own setting
    /// holds it and wins over its containers'; an inherited one reaches
    /// through containers and the repeats around them, a literal or a
    /// reference written there; an own-only one is looked up on its
    /// element alone, and on a type it does not hold is refused. One test of the table, whatever
    /// rows it grows and whatever types they hold.
    #[test]
    fn every_hold_attribute_holds_as_its_row_says() {
        for row in HOLD_ATTRS {
            let tag = ComponentType::ALL
                .iter()
                .filter(|&&t| (row.holds)(t) && !t.def().flags.internal)
                .map(|t| t.tag())
                .find(|tag| {
                    std::panic::catch_unwind(|| writable_and_clean(vec![el(tag).name("x")]))
                        .is_ok_and(|(w, clean)| w && clean)
                })
                .unwrap_or_else(|| panic!("{}: no type with something to hold", row.name));
            let x = || el(tag).name("x");
            let at = |what: &str| format!("{} on <{tag}>: {what}", row.name);
            let held = |doc: Vec<Element>| {
                let (writable, clean) = writable_and_clean(doc);
                assert!(clean, "{} on <{tag}> loads with an error", row.name);
                !writable
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
                let (_, clean) = writable_and_clean(vec![x]);
                assert_eq!(clean, row.inherited, "{} on <{}>", row.name, other.tag());
            }
        }
    }
}

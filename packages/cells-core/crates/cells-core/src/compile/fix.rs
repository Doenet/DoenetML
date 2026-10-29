//! `fixed`, `fixLocation` and a graph's `fixAxes`: a literal true turns
//! the element's essential values into constants and holds the rest
//! (references, a copy's referent) for good; references put a `Hold` on
//! every slot a request could write through. `fixed` and `fixLocation`
//! are inherited (ADR 0022): what an element does not give itself, the
//! nearest element around it that gives decides, a container's content
//! being fixed with the container unless it says otherwise.

use super::*;

impl<'a> Compiler<'a> {
    /// The `fixed`-like attributes that reach element `e`: its own
    /// `fixed` and `fixLocation`, else the nearest ancestor's (ADR 0022),
    /// and a graph's own `fixAxes`. A literal true fixes the element at
    /// build time; a reference is a flag cell, so the element is gated
    /// while the flag is nonzero. Several references gate on any of them.
    /// `fixLocation` holds only a *located* type, one whose every value is
    /// a location (`ComponentType::located`); it is read on every type, so
    /// a container may give it to the shapes inside, and has nothing to
    /// hold on a type without location state.
    pub(in crate::compile) fn plan_fix(&mut self, t: TemplateId, e: ElemId) -> Result<Fix> {
        let d = self.dast;
        let component_type = self.compiled.templates[t.index()].elems[e.index()].component_type;
        let mut flags = Vec::new();
        for (name, inherited, applies) in [
            ("fixed", true, true),
            ("fixLocation", true, component_type.located()),
            ("fixAxes", false, component_type == ComponentType::Graph),
        ] {
            let Some((at, ae, a, hops)) = self.nearest_attr(t, e, name, inherited) else {
                continue;
            };
            if !applies {
                continue;
            }
            let Elem {
                node, name_scope, ..
            } = self.compiled.templates[at.index()].elems[ae.index()];
            if self.attr_text(a).is_some() {
                if self.attr_flag(node, name) {
                    return Ok(Fix::Literal);
                }
                // An explicit false, the element's own or the nearest
                // around it, is the answer for this attribute.
                continue;
            }
            // A reference, planned where the element that wrote it sits
            // (its names mean what they mean there), and reached from
            // `e` that many templates up.
            let source = self.plan_value(at, name_scope, name, d.attr_children(a), None)?;
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
            Fix::Dynamic(flags) => gate_slots(props, flags),
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

/// Whether a request could write through a slot with this source: an
/// essential literal, a reference or the `extend` referent's slot, or
/// operators and math over other cells.
fn writable(source: &Source) -> bool {
    match source {
        Source::Inherit
        | Source::Literal(_)
        | Source::TextLiteral(_)
        | Source::Alias(Arg::Ref(..) | Arg::Elem(..))
        | Source::Math(_) => true,
        Source::Op(_, args) => args.iter().any(|a| !matches!(a, Arg::Own(_))),
        _ => false,
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

//! `fixed` (and a graph's `fixAxes`): a literal true turns the element's
//! essential values into constants and holds the rest (references, a
//! copy's referent) for good; references put a `Hold` on every slot a request could write
//! through.

use super::*;

impl<'a> Compiler<'a> {
    /// `fixed`-like attributes of an element. A literal true fixes it at
    /// build time; a reference is a flag cell, so the element is gated
    /// while the flag is nonzero. Several references gate on any of them.
    pub(in crate::compile) fn plan_fix(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        el: NodeId,
        names: &[&str],
    ) -> Result<Fix> {
        let d = self.dast;
        let mut flags = Vec::new();
        for &name in names {
            let Some(a) = d.attr(el, name) else { continue };
            if self.attr_text(a).is_some() {
                if self.attr_flag(el, name) {
                    return Ok(Fix::Literal);
                }
                continue;
            }
            flags.push(self.plan_value(t, scope, name, d.attr_children(a), None)?);
        }
        Ok(if flags.is_empty() {
            Fix::Off
        } else {
            Fix::Dynamic(flags)
        })
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
        | Source::Default(_)
        | Source::Alias(Arg::Ref(..) | Arg::Elem(..))
        | Source::Math(_) => true,
        Source::Op(_, args) => args.iter().any(|a| !matches!(a, Arg::Own(_))),
        _ => false,
    }
}

/// A literal `fixed`: essential cells, given or defaulted, become constants.
fn fix_literals(props: &mut [Option<Source>]) {
    for p in props.iter_mut() {
        if let Some(Source::Literal(v) | Source::TextLiteral(v) | Source::Default(v)) = p {
            *p = Some(Source::Fixed(*v));
        }
    }
}

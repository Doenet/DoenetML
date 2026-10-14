//! `fixed` (and a graph's `fixAxes`): a literal true turns the element's
//! essential values into constants; references put a `Hold` on every slot
//! a request could write through.

use super::*;

impl<'a> Compiler<'a> {
    /// `fixed`-like attributes of an element. A literal true fixes it at
    /// build time; a reference is a flag cell, so the element is gated
    /// while the flag is nonzero. Several references gate on any of them.
    pub(in crate::build) fn plan_fix(
        &mut self,
        t: TemplateId,
        scope: ElemId,
        el: NodeId,
        names: &[&str],
    ) -> Result<Fix> {
        let d = self.compiled.dast;
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
pub(in crate::build) enum Fix {
    Off,
    /// A literal true: the element's essential cells become fixed cells.
    Literal,
    /// References: flag cells (any nonzero holds) that gate the element.
    Dynamic(Vec<SourcePlan>),
}

impl Fix {
    pub(in crate::build) fn apply(self, props: &mut Vec<Option<SourcePlan>>) {
        match self {
            Fix::Off => {}
            Fix::Literal => fix_literals(props),
            Fix::Dynamic(flags) => gate_slots(props, flags),
        }
    }
}

/// Put a `Hold` on every slot a request could write through: its essential
/// literals, its references and its operators and math over other cells.
/// Each such plan moves to a new hidden slot and its old slot becomes
/// `Hold(moved, flag)`, so everything that reads the slot, inside the
/// element or out, reads through the hold. Vector heads and outputs stay in
/// place (they must be consecutive); their inputs are own slots, which are
/// gated themselves.
fn gate_slots(props: &mut Vec<Option<SourcePlan>>, flags: Vec<SourcePlan>) {
    let n = props.len();
    let push = |props: &mut Vec<Option<SourcePlan>>, plan: SourcePlan| {
        props.push(Some(plan));
        u8::try_from(props.len() - 1).expect("fewer than 256 slots per element")
    };
    let mut flags = flags.into_iter();
    let mut flag = push(props, flags.next().expect("a dynamic fix has a flag"));
    for f in flags {
        let g = push(props, f);
        flag = push(
            props,
            SourcePlan::Op(OpSpec::Max, vec![Arg::Own(flag), Arg::Own(g)]),
        );
    }
    for i in 0..n {
        let moved = match &props[i] {
            Some(SourcePlan::Inherit) => SourcePlan::InheritFrom(i as u8),
            Some(
                SourcePlan::Literal(_)
                | SourcePlan::Default(_)
                | SourcePlan::Alias(Arg::Ref(..) | Arg::Elem(..))
                | SourcePlan::Math(_),
            ) => props[i].take().unwrap(),
            Some(SourcePlan::Op(_, args)) if args.iter().any(|a| !matches!(a, Arg::Own(_))) => {
                props[i].take().unwrap()
            }
            _ => continue,
        };
        let h = push(props, moved);
        props[i] = Some(SourcePlan::Op(
            OpSpec::Hold,
            vec![Arg::Own(h), Arg::Own(flag)],
        ));
    }
}

/// A literal `fixed`: essential cells, given or defaulted, become constants.
fn fix_literals(props: &mut [Option<SourcePlan>]) {
    for p in props.iter_mut() {
        if let Some(SourcePlan::Literal(v) | SourcePlan::Default(v)) = p {
            *p = Some(SourcePlan::Fixed(*v));
        }
    }
}

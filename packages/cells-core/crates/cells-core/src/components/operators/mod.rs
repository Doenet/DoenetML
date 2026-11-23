//! Operators: types whose value is a function of their operands, as the
//! current core's math and boolean operators (`MathOperators.js`,
//! `BooleanOperators.js`, `BooleanOperatorsOfMath.js`). Each is numeric:
//! an operand is a number (a literal, a reference, or math text the
//! numeric lowering knows), and an operand the current core would keep
//! symbolic (`<abs>x</abs>`) is NaN here, as in a `<number>`.
//!
//! The one-input types read their children as a value (`children: Value`)
//! and are planned from their table. A request on one inverts through its
//! operator's inverse (`program/scalar.rs`) where the current core's does,
//! except that a rounding one (`<round>`, `<floor>`, `<ceil>`,
//! `<setSmallToZero>`) writes the value it shows, a projection, where the
//! current core writes the asked value unrounded.
//! The types over several operands read their children as a list
//! (`children: List`, ADR 0041): [`fold`], [`variance`] and [`logic`].

use super::define::*;
use crate::program::VecOp;

pub(crate) mod fold;
pub(crate) mod is_between;
pub(crate) mod logic;
pub(crate) mod not;
pub(crate) mod round;
pub(crate) mod variance;

pub(crate) mod index_of;
pub(crate) mod scan;
pub(crate) mod sort;

use crate::compile::api::{
    ChildValue, ElemWiring, GivenId, ListEntry, PlanCtx, Port, Source, ValueChildren, Wire,
};
use crate::error::{Error, Result};
use crate::limits::MAX_VEC_IN;

// The specs of the types in inline modules below sit beside this file.
#[cfg(test)]
#[path = "abs.spec.rs"]
mod abs_spec;
#[cfg(test)]
#[path = "ceil.spec.rs"]
mod ceil_spec;
#[cfg(test)]
#[path = "floor.spec.rs"]
mod floor_spec;
#[cfg(test)]
#[path = "is_integer.spec.rs"]
mod is_integer_spec;
#[cfg(test)]
#[path = "is_number.spec.rs"]
mod is_number_spec;
#[cfg(test)]
#[path = "set_small_to_zero.spec.rs"]
mod set_small_to_zero_spec;
#[cfg(test)]
#[path = "sign.spec.rs"]
mod sign_spec;
#[cfg(test)]
#[path = "wrap_number_periodic.spec.rs"]
mod wrap_number_periodic_spec;

/// How an operand of an operator over a list is read from its text piece.
pub(crate) enum PieceKind {
    /// A number: `2.5`, `-3`.
    Number,
    /// A boolean, as a `<boolean>` reads its literal: `true`, `false`, or a
    /// number, true only when it is 1.
    Boolean,
}

/// The operands of an operator over its children as a list (ADR 0041): a
/// hidden port per entry they contribute ([`PlanCtx::list_entries`]: one
/// per entry of a list a reference or an element child names, decision
/// 5), a text piece a number (or a boolean) and a reference an alias of
/// what it names, in order. A literal is `given` (state a request may
/// write) when `given`, else a constant. Text that is no literal, which the
/// current core reads as math (`6/2`, `x`), is refused, as is more than an
/// instruction reads.
pub(crate) fn operands(
    ctx: &PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    pieces: Vec<ListEntry>,
    kind: PieceKind,
    given: bool,
) -> Result<Vec<Port>> {
    if pieces.len() > MAX_VEC_IN - 1 {
        return Err(Error::Unsupported(format!(
            "<{}> of more than {} operands",
            ctx.component_type().tag(),
            MAX_VEC_IN - 1
        )));
    }
    pieces
        .into_iter()
        .map(|piece| {
            let wire = match piece {
                ListEntry::Ref(p) => Source::reference(p).into(),
                ListEntry::Math(_) => {
                    return Err(Error::Unsupported(format!(
                        "a reference inside brackets among the operands of <{}>",
                        ctx.component_type().tag()
                    )));
                }
                ListEntry::Text(k, text) => {
                    let v = match kind {
                        PieceKind::Number => text.parse::<f64>().ok().filter(|v| !v.is_nan()),
                        PieceKind::Boolean => match text.to_ascii_lowercase().as_str() {
                            "true" => Some(1.0),
                            "false" => Some(0.0),
                            s => s.parse::<f64>().ok().map(|v| f64::from(u8::from(v == 1.0))),
                        },
                    };
                    let Some(v) = v else {
                        return Err(Error::Unsupported(format!(
                            "`{text}` among the operands of <{}>: an operand is a literal or a reference",
                            ctx.component_type().tag()
                        )));
                    };
                    if given {
                        Wire::given(GivenId::Children(k), v)
                    } else {
                        Wire::constant(v)
                    }
                }
            };
            Ok(wiring.hidden_wire(wire))
        })
        .collect()
}

/// The operand of a one-input operator with a planner of its own: its
/// children read as a value, as a table prop of `children` is, a literal
/// given (state a request may write); none when blank. An element among
/// them is refused.
pub(crate) fn value_operand(ctx: &mut PlanCtx<'_, '_>, children: &ValueChildren) -> Result<Wire> {
    if let Some(tag) = &children.element {
        return Err(Error::Unsupported(format!(
            "a <{tag}> inside a <{}>",
            ctx.component_type().tag()
        )));
    }
    Ok(match children.value {
        ChildValue::Blank => Wire::absent(),
        _ => Wire::scalar(ctx.value_of(children)?, GivenId::Children(0)),
    })
}

pub(crate) mod abs {
    use super::*;

    component! {
        /// `<abs>x</abs>`: the absolute value of its children. A request
        /// writes the asked value, or 0 for a negative one, to them.
        tags: ["abs"],
        flags: [copyable],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            value: computed(OpSpec::Abs, [operand]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod sign {
    use super::*;

    component! {
        /// `<sign>x</sign>`: -1, 0 or 1 by the sign of its children. A
        /// request cannot change it, as in the current core.
        tags: ["sign"],
        flags: [copyable],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            value: computed(OpSpec::Sign, [operand]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod floor {
    use super::*;

    component! {
        /// `<floor>x</floor>`: its children rounded down. A request writes
        /// the asked value rounded down to them.
        tags: ["floor"],
        flags: [copyable],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            value: computed(OpSpec::SnapFloor, [operand]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod ceil {
    use super::*;

    component! {
        /// `<ceil>x</ceil>`: its children rounded up. A request writes the
        /// asked value rounded up to them.
        tags: ["ceil"],
        flags: [copyable],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            value: computed(OpSpec::SnapCeil, [operand]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod set_small_to_zero {
    use super::*;

    component! {
        /// `<setSmallToZero threshold="1e-10">x</setSmallToZero>`: its
        /// children, or 0 when their magnitude is below `threshold`
        /// (`1e-14`). A request writes the asked value so treated to them.
        tags: ["setSmallToZero"],
        flags: [copyable],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            threshold: attr(1e-14),
            value: computed(OpSpec::SmallToZero, [operand, threshold]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod wrap_number_periodic {
    use super::*;

    component! {
        /// `<wrapNumberPeriodic lowerValue="0" upperValue="1">x</wrapNumberPeriodic>`:
        /// its children wrapped periodically into the interval between the
        /// bounds. A request writes the asked value wrapped to them.
        tags: ["wrapNumberPeriodic"],
        flags: [copyable],
        text: Number(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            lowerValue: attr(0.0),
            upperValue: attr(1.0),
            value: computed(OpSpec::Vec(VecOp::Wrap), [operand, lowerValue, upperValue]) { rendered },
            anchorX: anchor(0),
            anchorY: anchor(1),
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod is_integer {
    use super::*;

    component! {
        /// `<isInteger>x</isInteger>`: true when its children are an
        /// integer, within roundoff.
        tags: ["isInteger"],
        flags: [copyable],
        text: Boolean(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            value: computed(OpSpec::IsInteger, [operand]) { rendered },
        }
        children: Value,
        planner: Props,
    }
}

pub(crate) mod is_number {
    use super::*;

    component! {
        /// `<isNumber>x</isNumber>`: true when its children are a finite
        /// number.
        tags: ["isNumber"],
        flags: [copyable],
        text: Boolean(value),
        extend_value: Scalar(value),
        default_prop: value,
        props {
            operand: children,
            value: computed(OpSpec::IsFinite, [operand]) { rendered },
        }
        children: Value,
        planner: Props,
    }
}

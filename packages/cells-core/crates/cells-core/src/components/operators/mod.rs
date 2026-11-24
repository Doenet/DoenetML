//! Operators: types whose value is a function of their operands, as the
//! current core's math and boolean operators (`MathOperators.js`,
//! `BooleanOperators.js`, `BooleanOperatorsOfMath.js`).
//!
//! An operator over math (`<abs>`, `<sum>`, ...) is numeric or symbolic, as
//! the compile's type pass decides once per element from its operands (ADR
//! 0043, [`over_math`]): numeric, the operators over numbers below, when
//! every operand is a number; else a math cell in `expr`, the symbolic
//! engine's operator over the operands (`<abs>x</abs>` is `|x|`), which
//! `value` evaluates. The types over several operands take
//! `forceSymbolic` and `forceNumeric`; `<median>`, `<count>`,
//! `<wrapNumberPeriodic>`, `<isInteger>` and `<isNumber>` are numeric
//! only, as in the current core.
//!
//! The one-input types read their children as a value (`children: Value`).
//! A request on a numeric one inverts through its operator's inverse
//! (`program/scalar.rs`) where the current core's does, except that a
//! rounding one (`<round>`, `<floor>`, `<ceil>`, `<setSmallToZero>`)
//! writes the value it shows, a projection, where the current core writes
//! the asked value unrounded. A request on a symbolic one is dropped.
//! The types over several operands read their children as a list
//! (`children: List`, ADR 0041): [`fold`], [`variance`] and [`logic`].

use super::define::*;
use crate::program::{Post, VecOp};

pub(crate) mod fold;
pub(crate) mod is_between;
pub(crate) mod logic;
pub(crate) mod not;
pub(crate) mod over_math;
pub(crate) mod round;
pub(crate) mod variance;

pub(crate) mod summary_statistics;

pub(crate) mod index_of;
pub(crate) mod scan;
pub(crate) mod sort;

use crate::compile::api::{
    ChildValue, ElemWiring, GivenId, ListEntry, PlanCtx, Port, Source, ValueChildren, Wire,
};
use crate::components::ComponentDef;
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
    /// A number, or math text (`6/2`, `x`) for an operator over math (ADR
    /// 0043).
    Math,
    /// A boolean, as a `<boolean>` reads its literal: `true`, `false`, or a
    /// number, true only when it is 1.
    Boolean,
}

/// The operands of an operator over its children as a list (ADR 0041): a
/// hidden port per entry they contribute ([`PlanCtx::list_entries`]: one
/// per entry of a list a reference or an element child names, decision
/// 5), a text piece a number (or a boolean) and a reference an alias of
/// what it names (a math cell's number, [`PlanCtx::entry_number`], unless
/// booleans are read), in order. A literal is `given` (state a request may
/// write) when `given`, else a constant. Text that is no literal, and math
/// with a reference inside its brackets, is, for an operator over math
/// ([`PieceKind::Math`]), math (`6/2`, `x`): lowered when it is numeric,
/// else no value, as the element is then symbolic (ADR 0043) and reads it
/// as math ([`over_math::operand_exprs`]). Otherwise it is refused, as is
/// more than an instruction reads.
pub(crate) fn operands(
    ctx: &mut PlanCtx<'_, '_>,
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
                // A math cell is read as the number it holds.
                ListEntry::Ref(p) if !matches!(kind, PieceKind::Boolean) => {
                    ctx.entry_number(wiring, p).into()
                }
                ListEntry::Ref(p) => Source::reference(p).into(),
                ListEntry::Math(id) if matches!(kind, PieceKind::Math) => Source::math(id).into(),
                ListEntry::Math(_) => {
                    return Err(Error::Unsupported(format!(
                        "a reference inside brackets among the operands of <{}>",
                        ctx.component_type().tag()
                    )));
                }
                ListEntry::Text(k, text) => {
                    let v = match kind {
                        PieceKind::Number | PieceKind::Math => {
                            text.parse::<f64>().ok().filter(|v| !v.is_nan())
                        }
                        PieceKind::Boolean => match text.to_ascii_lowercase().as_str() {
                            "true" => Some(1.0),
                            "false" => Some(0.0),
                            s => s.parse::<f64>().ok().map(|v| f64::from(u8::from(v == 1.0))),
                        },
                    };
                    let Some(v) = v else {
                        if let PieceKind::Math = kind {
                            let id = over_math::entry_expr(ctx, &ListEntry::Text(k, text))?;
                            return Ok(wiring.hidden_wire(Source::math(id).into()));
                        }
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

/// `<abs>`, `<sign>`, `<floor>` and `<ceil>`, which share their table: an
/// operator of one input over numbers, the engine's over math
/// ([`over_math::plan_one_input`]).
pub(crate) mod abs {
    use super::*;

    component! {
        /// `<abs>x</abs>`: the absolute value of its children: a number
        /// over numbers, and over math `abs(..)` of them unless it
        /// evaluates to a number (ADR 0043). A request on a number writes
        /// the asked value, or 0 for a negative one, to them.
        tags: ["abs"],
        variant: OneInput(OpSpec::Abs, Post::Abs),
        flags: [copyable],
        value: Math(expr),
        props {
            operand: by_planner,
            expr: by_planner { rendered, expr_of: expr },
            value: by_planner { rendered, expr_of: expr },
            ..anchor
        }
        children: Value,
        planner: Plan(plan),
    }

    /// `<sign>x</sign>`: -1, 0 or 1 by the sign of its children, and
    /// over math `sign(..)` of them unless it evaluates to a number. A
    /// request cannot change it, as in the current core.
    pub(crate) const SIGN: ComponentDef =
        DEFINITION.variant(&["sign"], &OneInput(OpSpec::Sign, Post::Sign));
    /// `<floor>x</floor>`: its children rounded down, and over math
    /// `floor(..)` of them unless it evaluates to a number. A request
    /// on a number writes the asked value rounded down to them.
    pub(crate) const FLOOR: ComponentDef =
        DEFINITION.variant(&["floor"], &OneInput(OpSpec::SnapFloor, Post::Floor));
    /// `<ceil>x</ceil>`: its children rounded up, and over math
    /// `ceil(..)` of them unless it evaluates to a number. A request on
    /// a number writes the asked value rounded up to them.
    pub(crate) const CEIL: ComponentDef =
        DEFINITION.variant(&["ceil"], &OneInput(OpSpec::SnapCeil, Post::Ceil));

    /// What a type of this table applies to its input: the operator over
    /// a number, and the engine's over math.
    pub(crate) struct OneInput(OpSpec, Post);

    fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let &OneInput(op, post) = ctx.component_type().variant();
        let at = Props::PORTS;
        let children = Attrs::of(ctx.record()).children;
        over_math::plan_one_input(
            ctx,
            &children,
            [at.operand, at.expr],
            |x| Wire::computed(op, vec![x]),
            Some(post),
            |w, [operand, expr, value]| {
                w.set_planned(Planned {
                    operand,
                    expr,
                    value,
                })
            },
        )
    }
}

pub(crate) mod set_small_to_zero {
    use super::*;

    component! {
        /// `<setSmallToZero threshold="1e-10">x</setSmallToZero>`: its
        /// children, or 0 when their magnitude is below `threshold`
        /// (`1e-14`); over math, each number in them so treated, when the
        /// threshold is a number as written. A request on a number writes
        /// the asked value so treated to them.
        tags: ["setSmallToZero"],
        flags: [copyable],
        value: Math(expr),
        props {
            operand: by_planner,
            expr: by_planner { rendered, expr_of: expr },
            threshold: by_planner,
            value: by_planner { rendered, expr_of: expr },
            ..anchor
        }
        attributes {
            threshold: Scalar,
        }
        children: Value,
        planner: Plan(plan),
    }

    /// The threshold given, else 1e-14; over math, only a literal one.
    fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        const DEFAULT: f64 = 1e-14;
        let at = Props::PORTS;
        let attrs = Attrs::of(ctx.record());
        let (threshold, post) = match attrs.threshold {
            Some(s) => {
                let post = over_math::literal(&s).map(|v| Post::SmallToZero(v.to_bits()));
                (Wire::scalar(s, GivenId::Attr(attr::threshold, 0)), post)
            }
            None => (
                Wire::given_by(attr::threshold, DEFAULT),
                Some(Post::SmallToZero(DEFAULT.to_bits())),
            ),
        };
        over_math::plan_one_input(
            ctx,
            &attrs.children,
            [at.operand, at.expr],
            |x| Wire::computed(OpSpec::SmallToZero, vec![x, at.threshold]),
            post,
            |w, [operand, expr, value]| {
                w.set_planned(Planned {
                    operand,
                    expr,
                    threshold,
                    value,
                })
            },
        )
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
        value: Number,
        props {
            operand: children,
            lowerValue: attr(0.0),
            upperValue: attr(1.0),
            value: computed(OpSpec::Vec(VecOp::Wrap), [operand, lowerValue, upperValue]) { rendered },
            ..anchor
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
        value: Boolean,
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
        value: Boolean,
        props {
            operand: children,
            value: computed(OpSpec::IsFinite, [operand]) { rendered },
        }
        children: Value,
        planner: Props,
    }
}

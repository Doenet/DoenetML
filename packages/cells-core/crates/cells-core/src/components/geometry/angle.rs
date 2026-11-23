//! `<angle>`: its definition and its planner. An angle is a measure, given
//! in radians or degrees, or the angle at the second of three points.
//!
//! A measure written as math text is kept as written, an expression
//! (`radians="pi/2"`, `alpha`), as the current core keeps it; one given by
//! a reference is an expression when what it names can be one (ADR 0043).
//! The other unit is the engine's conversion of it, simplified, and each
//! unit's number evaluates its expression.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::components::operators::over_math::{self, Kind};
use crate::dast::NodeId;
use crate::error::{Error, Result};
use crate::program::{Post, Reflex, VecOp};
use std::f64::consts::PI;

component! {
    /// `<angle through="$A $B $C"/>`, `<angle radians="pi/4"/>`, `<angle
    /// degrees="45"/>` or `<angle>pi/4</angle>`: its measure in radians and
    /// in degrees, each a number, and an expression (`radiansExpr`,
    /// `degreesExpr`) when the measure is one. Shown as its measure; not
    /// drawn in a graph.
    tags: ["angle"],
    flags: [copyable],
    text: Math(radiansExpr, radians),
    default_prop: radians,
    props {
        radians: by_planner { rendered, expr_of: radiansExpr },
        degrees: by_planner { rendered, expr_of: degreesExpr },
        radiansExpr: by_planner { rendered, expr_of: radiansExpr },
        degreesExpr: by_planner { rendered, expr_of: degreesExpr },
    }
    alternate_names {
        value: radians,
        angle: radians,
    }
    // How a renderer shows and draws it.
    presentation { inDegrees, radius, emphasizeRightAngle }
    attributes {
        through: Points,
        radians: Math,
        degrees: Math,
        chooseReflexAngle: Text,
        betweenLines: Written,
    }
    children: Math,
    planner: Plan(plan),
}

/// A measure written as `nodes`: its number, as a given leaf of `given`,
/// and, unless it is a number as written, its expression and what decides
/// whether it is one: math text is kept as written, and a reference is one
/// when what it names can be.
fn measure(
    ctx: &mut PlanCtx<'_, '_>,
    nodes: &[NodeId],
    given: GivenId,
) -> Result<(Wire, Option<(ExprId, Kind)>)> {
    let source = ctx.scalar_of(nodes)?;
    let mt = ctx.math_text(nodes)?;
    // `pi` is a number to the tokenizer: a measure of it is math text.
    let literal = |v: &f64| *v != PI;
    let expr = match mt.tokens() {
        [Token::Num(v)] | [Token::Op('-'), Token::Num(v)] if literal(v) => None,
        [Token::Cell(_)] => ctx.operand_expr(&source).map(|id| (id, Kind::ByOperands)),
        _ => Some((ctx.sym_math(nodes, &mt)?, Kind::Symbolic)),
    };
    Ok((Wire::scalar(source, given), expr))
}

/// Plans an angle from its `radians`, its `degrees`, its children (a
/// measure in radians), or its three `through` points; with fewer points
/// and no measure it is a right angle, as in the current core.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    if attrs.betweenLines {
        return Err(Error::Unsupported("<angle betweenLines>".into()));
    }
    let reflex = match attrs
        .chooseReflexAngle
        .as_deref()
        .map(|t| t.trim().to_ascii_lowercase())
        .as_deref()
    {
        Some("allowed") => Reflex::Allowed,
        Some("always") => Reflex::Always,
        _ => Reflex::Never,
    };
    let mut wiring = ElemWiring::of(ComponentType::Angle);
    // The measure's unit, its number and its expression; or a number in
    // radians.
    let (in_degrees, number, expr) = if let Some(r) = &attrs.radians {
        let (n, e) = measure(ctx, r, GivenId::Attr(attr::radians, 0))?;
        (false, n, e)
    } else if let Some(d) = &attrs.degrees {
        let (n, e) = measure(ctx, d, GivenId::Attr(attr::degrees, 0))?;
        (true, n, e)
    } else if let Some(nodes) = &attrs.children {
        let (n, e) = measure(ctx, nodes, GivenId::Children(0))?;
        (false, n, e)
    } else if let [p1, v, p3, ..] = attrs.through.as_slice() {
        let mut args = Vec::with_capacity(6);
        for (k, p) in [p1, v, p3].into_iter().enumerate() {
            args.extend(wiring.hidden_point_of(p, attr::through, k));
        }
        let [radians] = ElemWiring::vector([at.radians], VecOp::AngleAt { reflex }, args);
        (false, radians, None)
    } else {
        // The current core puts the missing third point a right angle
        // from the first ray.
        let right = if reflex == Reflex::Always {
            1.5 * PI
        } else {
            PI / 2.0
        };
        (false, Wire::constant(right), None)
    };
    // The other unit's expression: the engine's conversion, simplified.
    let (own_expr, other_expr) = match expr {
        Some((id, kind)) => {
            let other = ctx.operator_expr(&[id], |t| {
                if in_degrees {
                    format!("pi {} / 180", t[0])
                } else {
                    format!("180 {} / pi", t[0])
                }
            });
            (
                kind.expr(Some(id), Post::None),
                kind.expr(Some(other), Post::Simplify),
            )
        }
        None => (Wire::absent(), Wire::absent()),
    };
    let (radians, degrees, radians_expr, degrees_expr) = if in_degrees {
        let to_radians = Source::computed_k(OpSpec::Mul, at.degrees, PI / 180.0).into();
        (
            over_math::value(&mut wiring, at.radiansExpr, to_radians),
            over_math::value(&mut wiring, at.degreesExpr, number),
            other_expr,
            own_expr,
        )
    } else {
        let to_degrees = Source::computed_k(OpSpec::Mul, at.radians, 180.0 / PI).into();
        (
            over_math::value(&mut wiring, at.radiansExpr, number),
            over_math::value(&mut wiring, at.degreesExpr, to_degrees),
            own_expr,
            other_expr,
        )
    };
    wiring.set_public(Props {
        radians,
        degrees,
        radiansExpr: radians_expr,
        degreesExpr: degrees_expr,
    });
    Ok(wiring)
}

#[cfg(all(test, feature = "testing"))]
#[path = "angle.spec.rs"]
mod spec;

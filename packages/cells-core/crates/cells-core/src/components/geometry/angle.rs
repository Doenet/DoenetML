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
use crate::program::{Figure, Post, Reflex, VecOp};
use std::f64::consts::PI;

component! {
    /// `<angle through="$A $B $C"/>`, `<angle radians="pi/4"/>`, `<angle
    /// degrees="45"/>` or `<angle>pi/4</angle>`: its measure in radians and
    /// in degrees, each a number, and an expression (`radiansExpr`,
    /// `degreesExpr`) when the measure is one. Shown in text as its
    /// measure; drawn in a graph as an arc at its vertex `(x2, y2)`, from
    /// the ray through its first point `(x1, y1)`, turning counterclockwise
    /// by its measure. Without `through` points the first point is `(1, 0)`
    /// and the vertex the origin, as in the current core.
    tags: ["angle"],
    flags: [copyable],
    text: Math(radiansExpr, radians),
    default_prop: radians,
    props {
        radians: by_planner { rendered, expr_of: radiansExpr },
        degrees: by_planner { rendered, expr_of: degreesExpr },
        radiansExpr: by_planner { rendered, expr_of: radiansExpr },
        degreesExpr: by_planner { rendered, expr_of: degreesExpr },
        x1: by_planner { rendered },
        y1: by_planner { rendered },
        x2: by_planner { rendered },
        y2: by_planner { rendered },
        // The third point: the third `through` point, else the point a
        // unit from the vertex at the measure from the first ray, as the
        // current core's `points` has it.
        x3: by_planner,
        y3: by_planner,
    }
    combined_props {
        points: [x1, y1, x2, y2, x3, y3],
    }
    alternate_names {
        value: radians,
        angle: radians,
    }
    // How a renderer shows and draws it.
    presentation { inDegrees, radius, emphasizeRightAngle, fillOpacity, fillPatternOpacity, fillStyle }
    attributes {
        through: Points,
        radians: Math,
        degrees: Math,
        chooseReflexAngle: Text,
        betweenLines: Entries,
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
    let lines = between_lines(ctx, &mut wiring, &attrs.betweenLines)?;
    // The first point and the vertex, when `through` gives them; the
    // vertex is the origin when it gives one point, as in the current core.
    let [x1, y1, x2, y2] = match attrs.through.as_slice() {
        _ if lines.is_some() => {
            let [x1, y1, x2, y2] = lines.as_ref().unwrap().points;
            [x1, y1, x2, y2].map(Wire::own)
        }
        [p1, v, ..] => {
            let [x1, y1] = Wire::point(p1, attr::through, 0);
            let [x2, y2] = Wire::point(v, attr::through, 1);
            [x1, y1, x2, y2]
        }
        [p1] => {
            let [x1, y1] = Wire::point(p1, attr::through, 0);
            [x1, y1, Wire::constant(0.0), Wire::constant(0.0)]
        }
        [] => [1.0, 0.0, 0.0, 0.0].map(Wire::constant),
    };
    // The third point, when `through` gives it, whatever gives the measure.
    let third = match attrs.through.as_slice() {
        _ if lines.is_some() => lines.as_ref().unwrap().third,
        [_, _, p3, ..] => Some(wiring.hidden_point_of(p3, attr::through, 2)),
        _ => None,
    };
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
    } else if let Some(p3) = third {
        let mut args = vec![at.x1, at.y1, at.x2, at.y2];
        args.extend(p3);
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
    let [x3, y3] = third.map(|p| p.map(Wire::own)).unwrap_or_else(|| {
        ElemWiring::vector(
            [at.x3, at.y3],
            VecOp::Turn,
            vec![at.x1, at.y1, at.x2, at.y2, at.radians],
        )
    });
    wiring.set_planned(Planned {
        x3,
        y3,
        radians,
        degrees,
        radiansExpr: radians_expr,
        degreesExpr: degrees_expr,
        x1,
        y1,
        x2,
        y2,
    });
    Ok(wiring)
}

/// What `betweenLines` makes of an angle's points, as the current core
/// makes them: the first point and the vertex, and the third point when it
/// is given.
struct BetweenLines {
    points: [Port; 4],
    third: Option<[Port; 2]>,
}

/// The points `betweenLines` gives, None without it. Between two lines
/// the vertex is where they meet, and the first and third points are a
/// step along each line from it; along one line the vertex is its point
/// nearest the origin and the first point a unit along it, the measure
/// turning the third from it. More lines define no angle (an info, as in
/// the current core): every point is missing.
fn between_lines(
    ctx: &mut PlanCtx<'_, '_>,
    wiring: &mut ElemWiring,
    pieces: &[ListPiece],
) -> Result<Option<BetweenLines>> {
    if pieces.is_empty() {
        return Ok(None);
    }
    let lines = pieces
        .iter()
        .map(|piece| match piece {
            ListPiece::Reference(p) => {
                let ports = ["x1", "y1", "x2", "y2"]
                    .into_iter()
                    .map(|prop| Ok(wiring.hidden(Source::reference(ctx.with_prop(*p, prop)?))))
                    .collect::<Result<Vec<Port>>>()?;
                Ok([ports[0], ports[1], ports[2], ports[3]])
            }
            _ => Err(Error::Unsupported(
                "an angle's `betweenLines` that is not references to lines".into(),
            )),
        })
        .collect::<Result<Vec<[Port; 4]>>>()?;
    // A line's step from its first point to its second, from `at`.
    let step = |wiring: &mut ElemWiring, at: [Port; 2], [a1, a2, b1, b2]: [Port; 4]| -> [Port; 2] {
        let dx = wiring.hidden(Source::computed(OpSpec::Sub, vec![b1, a1]));
        let dy = wiring.hidden(Source::computed(OpSpec::Sub, vec![b2, a2]));
        [
            wiring.hidden(Source::computed(OpSpec::Add, vec![at[0], dx])),
            wiring.hidden(Source::computed(OpSpec::Add, vec![at[1], dy])),
        ]
    };
    Ok(Some(match lines.as_slice() {
        [line] => {
            let mut args = vec![Arg::Const(0.0), Arg::Const(0.0)];
            args.extend(line.iter().map(|&p| Arg::Own(p)));
            let v = wiring.hidden_vector_args(VecOp::ProjectLine, args);
            let toward = step(wiring, [v[0], v[1]], *line);
            // A unit from the vertex toward that step: the turn of nothing.
            let first = wiring.hidden_vector_args(
                VecOp::Turn,
                vec![
                    Arg::Own(toward[0]),
                    Arg::Own(toward[1]),
                    Arg::Own(v[0]),
                    Arg::Own(v[1]),
                    Arg::Const(0.0),
                ],
            );
            BetweenLines {
                points: [first[0], first[1], v[0], v[1]],
                third: None,
            }
        }
        [l1, l2] => {
            let line = Figure::Line { segment: false };
            let mut args: Vec<Port> = l1.to_vec();
            args.extend(l2);
            let meet = wiring.hidden_vector(VecOp::Intersect { a: line, b: line }, args);
            let vertex = [meet[0], meet[1]];
            let first = step(wiring, vertex, *l1);
            let third = step(wiring, vertex, *l2);
            BetweenLines {
                points: [first[0], first[1], vertex[0], vertex[1]],
                third: Some(third),
            }
        }
        more => {
            let warned = ctx.warn(
                "doenet-i0017",
                &format!("Cannot define an angle between {} lines.", more.len()),
            );
            let none = wiring.hidden(Source::undefined(warned));
            BetweenLines {
                points: [none; 4],
                third: Some([none, none]),
            }
        }
    }))
}

#[cfg(all(test, feature = "testing"))]
#[path = "angle.spec.rs"]
mod spec;

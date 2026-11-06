//! `<line>`: its definition and its planner. A line is given by an
//! equation, by two points, or by a point and a slope or direction.

use super::{DEFAULT_FIRST_POINT, DEFAULT_SECOND_POINT};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::VecOp;

component! {
    /// `<line>`: its own two points are derived cells; slope,
    /// intercepts and coefficients follow from them or from the equation.
    tags: ["line"],
    flags: [copyable, located],
    renders: InGraph,
    props {
        // The first four props are the line's own points (ADR 0006).
        // `basedOnDirection` is 1 when the second point is derived from a slope or
        // direction, so a renderer drags only the first.
        x1: by_planner { rendered },
        y1: by_planner { rendered },
        x2: by_planner { rendered },
        y2: by_planner { rendered },
        slope: by_planner,
        xintercept: by_planner,
        yintercept: by_planner,
        coeffvar1: by_planner,
        coeffvar2: by_planner,
        coeff0: by_planner,
        basedOnDirection: by_planner { rendered },
    }
    list {
        names: [points, endpoints],
        item: point,
        points: [[x1, y1], [x2, y2]],
        // A whole-line drag requests both points.
        interactive: true,
    }
    // A point constrained to a line is projected onto it.
    constrain_target { ports: [x1, y1, x2, y2], op: ProjectLine }
    attributes {
        through: Points,
        slope: Scalar,
        parallelTo: Point,
        perpendicularTo: Point,
        equation: Math,
        variables: Text,
    }
    params {
        // The second point's distance along a slope or direction.
        DIST,
        // A missing point's coordinates.
        ESS1X, ESS1Y, ESS2X, ESS2Y,
    }
    children: Math,
    planner: Plan(plan),
}

/// Variable names of the equation (`variables="(s,t)"` or `"s t"`), `x`
/// and `y` unless exactly two are given.
fn variables(attrs: &Attrs) -> (String, String) {
    let names: Vec<String> = attrs
        .variables
        .as_ref()
        .map(|text| {
            text.split(|c: char| !c.is_alphanumeric())
                .filter(|s| !s.is_empty())
                .map(str::to_string)
                .collect()
        })
        .unwrap_or_default();
    match <[String; 2]>::try_from(names) {
        Ok([vx, vy]) => (vx, vy),
        Err(_) => ("x".into(), "y".into()),
    }
}

/// Plans a line from its equation, or its `through` points and a
/// `slope`, `parallelTo` or `perpendicularTo`.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let mut wiring = ElemWiring::of(ComponentType::Line);
    let attrs = Attrs::of(ctx.record());
    let through = attrs.through.clone();
    let by_direction =
        attrs.slope.is_some() || attrs.parallelTo.is_some() || attrs.perpendicularTo.is_some();
    // The equation is the attribute, or the children's math (the
    // element's own, or its referent's) when nothing else says how the
    // line is made.
    let equation = attrs.equation.clone().or_else(|| {
        (through.is_empty() && !by_direction)
            .then(|| attrs.children.clone())
            .flatten()
    });
    if through.len() > 2 {
        return Err(Error::Unsupported(
            "a line through more than two points".into(),
        ));
    }

    if let Some(equation) = equation {
        // Equation mode: coefficients are the state, points follow.
        let (vx, vy) = variables(&attrs);
        let [a, b, c] = match ctx.linear_equation(&equation, &vx, &vy)? {
            Some(coeffs) => coeffs,
            // A symbolic or nonlinear equation is not a line here.
            None => {
                let w = ctx.warn(
                    "doenet-w0004",
                    &format!("Invalid format for equation of line in variables {vx} and {vy}."),
                );
                [
                    Source::undefined(w),
                    Source::undefined(w),
                    Source::undefined(w),
                ]
            }
        };
        let [x1, y1, x2, y2] = ElemWiring::vector(
            [at.x1, at.y1, at.x2, at.y2],
            VecOp::LinePointsFromCoeffs,
            vec![at.coeffvar1, at.coeffvar2, at.coeff0],
        );
        let q = wiring.hidden(Source::computed(
            OpSpec::Div,
            vec![at.coeffvar1, at.coeffvar2],
        ));
        let xi = wiring.hidden(Source::computed(OpSpec::Div, vec![at.coeff0, at.coeffvar1]));
        let yi = wiring.hidden(Source::computed(OpSpec::Div, vec![at.coeff0, at.coeffvar2]));
        wiring.set_public(Props {
            x1,
            y1,
            x2,
            y2,
            slope: Wire::computed(OpSpec::Negate, vec![q]),
            xintercept: Wire::computed(OpSpec::Negate, vec![xi]),
            yintercept: Wire::computed(OpSpec::Negate, vec![yi]),
            coeffvar1: a.into(),
            coeffvar2: b.into(),
            coeff0: c.into(),
            basedOnDirection: Wire::constant(0.0),
        });
        return Ok(wiring);
    }

    let first_default = ([param::ESS1X, param::ESS1Y], DEFAULT_FIRST_POINT);
    let second_default = ([param::ESS2X, param::ESS2Y], DEFAULT_SECOND_POINT);
    // First point: a through point or the essential default, which the
    // current core takes as (1, 0) for a two-point line and (0, 0) when a
    // slope or direction gives the second point.
    let direction_mode = through.len() < 2 && by_direction;
    let [x1, y1, x2, y2, based_on_direction] = if direction_mode {
        let [x1, y1] = Wire::point_or_default(through.first(), attr::through, 0, second_default);
        let dist = wiring.param(param::DIST, 1.0);
        let [x2, y2] = if let Some(m) = attrs.slope.clone() {
            let m = wiring.hidden(m);
            ElemWiring::vector(
                [at.x2, at.y2],
                VecOp::PolarSlope,
                vec![at.x1, at.y1, m, dist],
            )
        } else {
            let (given, perpendicular) = match (&attrs.parallelTo, &attrs.perpendicularTo) {
                (Some(p), _) => (p.clone(), false),
                (None, Some(p)) => (p.clone(), true),
                (None, None) => unreachable!("a direction attribute is given"),
            };
            let [ux, uy] = direction(ctx, given.point()?, &mut wiring)?;
            ElemWiring::vector(
                [at.x2, at.y2],
                VecOp::PolarDirection { perpendicular },
                vec![at.x1, at.y1, ux, uy, dist],
            )
        };
        [x1, y1, x2, y2, Wire::constant(1.0)]
    } else {
        // The line's points are the through points (or essential
        // defaults) themselves; a whole-line drag is a point group.
        let [x1, y1] = Wire::point_or_default(through.first(), attr::through, 0, first_default);
        let [x2, y2] = Wire::point_or_default(through.get(1), attr::through, 1, second_default);
        [x1, y1, x2, y2, Wire::constant(0.0)]
    };
    // slope, intercepts and coefficients from the two points:
    // a = y2 - y1, b = x1 - x2, c = -(a x1 + b y1). The slope is the
    // points' ratio even for a slope-based line, as in the current core
    // (NaN when the points coincide).
    let dy = wiring.hidden(Source::computed(OpSpec::Sub, vec![at.y2, at.y1]));
    let dx = wiring.hidden(Source::computed(OpSpec::Sub, vec![at.x2, at.x1]));
    let q = wiring.hidden(Source::computed(OpSpec::Div, vec![at.y1, at.slope]));
    let mx = wiring.hidden(Source::computed(OpSpec::Mul, vec![at.slope, at.x1]));
    let ax = wiring.hidden(Source::computed(OpSpec::Mul, vec![at.coeffvar1, at.x1]));
    let by = wiring.hidden(Source::computed(OpSpec::Mul, vec![at.coeffvar2, at.y1]));
    let sum = wiring.hidden(Source::computed(OpSpec::Add, vec![ax, by]));
    wiring.set_public(Props {
        x1,
        y1,
        x2,
        y2,
        slope: Wire::computed(OpSpec::Div, vec![dy, dx]),
        xintercept: Wire::computed(OpSpec::Sub, vec![at.x1, q]),
        yintercept: Wire::computed(OpSpec::Sub, vec![at.y1, mx]),
        coeffvar1: Wire::own(dy),
        coeffvar2: Wire::computed(OpSpec::Sub, vec![at.x1, at.x2]),
        coeff0: Wire::computed(OpSpec::Negate, vec![sum]),
        basedOnDirection: based_on_direction,
    });
    Ok(wiring)
}

/// Two hidden ports holding a direction: a point or tuple's coordinates,
/// or another line's or segment's `point2 - point1`.
fn direction(
    ctx: &mut PlanCtx<'_, '_>,
    p: GivenPoint,
    wiring: &mut ElemWiring,
) -> Result<[Port; 2]> {
    if let GivenPoint::Ref(r) = p
        && matches!(
            ctx.reference_type(r)?,
            Some(ComponentType::Line | ComponentType::LineSegment)
        )
    {
        let [x1, y1, x2, y2] = [
            ctx.reference_prop(r, "x1")?,
            ctx.reference_prop(r, "y1")?,
            ctx.reference_prop(r, "x2")?,
            ctx.reference_prop(r, "y2")?,
        ];
        let ux = wiring.hidden(Source::op(OpSpec::Sub, vec![x2, x1]));
        let uy = wiring.hidden(Source::op(OpSpec::Sub, vec![y2, y1]));
        return Ok([ux, uy]);
    }
    Ok(wiring.hidden_point(&p))
}

#[cfg(all(test, feature = "testing"))]
#[path = "line.spec.rs"]
mod spec;

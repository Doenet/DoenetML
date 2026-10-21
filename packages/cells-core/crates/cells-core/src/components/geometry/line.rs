//! `<line>`: its definition and its planner (ADR 0016). A line is given by
//! an equation, by two points, or by a point and a slope or direction;
//! its own two points are derived cells (ADR 0006), and its slope,
//! intercepts and coefficients follow from them or from the equation.

use super::{DEFAULT_FIRST_POINT, DEFAULT_SECOND_POINT};
use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::VecOp;

component! {
    /// `<line>`: its own two points are derived cells (ADR 0006); slope,
    /// intercepts and coefficients follow from them or from the equation.
    tags: ["line"],
    flags: [copyable],
    props {
        // The first four props are the line's own points (ADR 0006).
        // `basedOnDirection` is 1 when the second point is derived from a slope or
        // direction, so a renderer drags only the first.
        x1: by_planner,
        y1: by_planner,
        x2: by_planner,
        y2: by_planner,
        slope: by_planner,
        xintercept: by_planner,
        yintercept: by_planner,
        coeffvar1: by_planner,
        coeffvar2: by_planner,
        coeff0: by_planner,
        basedOnDirection: by_planner,
    }
    list {
        names: [points, endpoints],
        item: point,
        points: [[x1, y1], [x2, y2]],
    }
    shared_state {
        // The second point's distance along a slope or direction.
        DIST,
        // A missing point's coordinates.
        ESS1X, ESS1Y, ESS2X, ESS2Y,
    }
    planner: Geometric(plan),
}

/// Variable names of the equation (`variables="(s,t)"` or `"s t"`), `x`
/// and `y` unless exactly two are given.
fn variables(ctx: &PlanCtx<'_, '_>) -> (String, String) {
    let names: Vec<String> = ctx
        .text("variables")
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
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemPlan> {
    let at = Props::AT;
    let mut ch = ElemPlan::of(ComponentType::Line);
    let through = ctx.points("through")?;
    let by_direction = ctx.has("slope") || ctx.has("parallelTo") || ctx.has("perpendicularTo");
    // The equation is the attribute, or the element's own math, or its
    // referent's when nothing else says how the line is made.
    let equation = ctx
        .math("equation")
        .or_else(|| ctx.child_math())
        .or_else(|| {
            (through.is_empty() && !by_direction)
                .then(|| ctx.referent_child_math())
                .flatten()
        });
    if through.len() > 2 {
        return Err(Error::Unsupported(
            "a line through more than two points".into(),
        ));
    }

    if let Some(equation) = equation {
        // Equation mode: coefficients are the state, points follow.
        let (vx, vy) = variables(ctx);
        let [a, b, c] = ctx
            .linear_equation(&equation, &vx, &vy)?
            // A symbolic or nonlinear equation is not a line here.
            .unwrap_or([
                SourcePlan::Fixed(f64::NAN),
                SourcePlan::Fixed(f64::NAN),
                SourcePlan::Fixed(f64::NAN),
            ]);
        let [x1, y1, x2, y2] = ElemPlan::vector(
            [at.x1, at.y1, at.x2, at.y2],
            VecOp::LinePointsFromCoeffs,
            vec![at.coeffvar1, at.coeffvar2, at.coeff0],
        );
        let q = ch.hidden(SourcePlan::computed(
            OpSpec::Div,
            vec![at.coeffvar1, at.coeffvar2],
        ));
        let xi = ch.hidden(SourcePlan::computed(
            OpSpec::Div,
            vec![at.coeff0, at.coeffvar1],
        ));
        let yi = ch.hidden(SourcePlan::computed(
            OpSpec::Div,
            vec![at.coeff0, at.coeffvar2],
        ));
        ch.set_public(Props {
            x1,
            y1,
            x2,
            y2,
            slope: Planned::computed(OpSpec::Negate, vec![q]),
            xintercept: Planned::computed(OpSpec::Negate, vec![xi]),
            yintercept: Planned::computed(OpSpec::Negate, vec![yi]),
            coeffvar1: a.into(),
            coeffvar2: b.into(),
            coeff0: c.into(),
            basedOnDirection: Planned::fixed(0.0),
        });
        return Ok(ch);
    }

    let first_default = (
        [shared_state::ESS1X, shared_state::ESS1Y],
        DEFAULT_FIRST_POINT,
    );
    let second_default = (
        [shared_state::ESS2X, shared_state::ESS2Y],
        DEFAULT_SECOND_POINT,
    );
    // First point: a through point or the essential default, which the
    // current core takes as (1, 0) for a two-point line and (0, 0) when a
    // slope or direction gives the second point.
    let direction_mode = through.len() < 2 && by_direction;
    let [x1, y1, x2, y2, based_on_direction] = if direction_mode {
        let [x1, y1] = Planned::point_or_default(
            through.first(),
            shared_point_state(0),
            "through",
            second_default,
        );
        let dist = ch.essential(shared_state::DIST, 1.0);
        let [x2, y2] = if let Some(m) = ctx.scalar("slope")? {
            let m = ch.hidden(m);
            ElemPlan::vector(
                [at.x2, at.y2],
                VecOp::PolarSlope,
                vec![at.x1, at.y1, m, dist],
            )
        } else {
            let (name, perpendicular) = if ctx.has("parallelTo") {
                ("parallelTo", false)
            } else {
                ("perpendicularTo", true)
            };
            let [ux, uy] = direction(ctx, name, &mut ch)?;
            ElemPlan::vector(
                [at.x2, at.y2],
                VecOp::PolarDirection { perpendicular },
                vec![at.x1, at.y1, ux, uy, dist],
            )
        };
        [x1, y1, x2, y2, Planned::fixed(1.0)]
    } else {
        // The line's points are the through points (or essential
        // defaults) themselves; a whole-line drag is a point group.
        let [x1, y1] = Planned::point_or_default(
            through.first(),
            shared_point_state(0),
            "through",
            first_default,
        );
        let [x2, y2] = Planned::point_or_default(
            through.get(1),
            shared_point_state(1),
            "through",
            second_default,
        );
        [x1, y1, x2, y2, Planned::fixed(0.0)]
    };
    // slope, intercepts and coefficients from the two points:
    // a = y2 - y1, b = x1 - x2, c = -(a x1 + b y1). The slope is the
    // points' ratio even for a slope-based line, as in the current core
    // (NaN when the points coincide).
    let dy = ch.hidden(SourcePlan::computed(OpSpec::Sub, vec![at.y2, at.y1]));
    let dx = ch.hidden(SourcePlan::computed(OpSpec::Sub, vec![at.x2, at.x1]));
    let q = ch.hidden(SourcePlan::computed(OpSpec::Div, vec![at.y1, at.slope]));
    let mx = ch.hidden(SourcePlan::computed(OpSpec::Mul, vec![at.slope, at.x1]));
    let ax = ch.hidden(SourcePlan::computed(OpSpec::Mul, vec![at.coeffvar1, at.x1]));
    let by = ch.hidden(SourcePlan::computed(OpSpec::Mul, vec![at.coeffvar2, at.y1]));
    let sum = ch.hidden(SourcePlan::computed(OpSpec::Add, vec![ax, by]));
    ch.set_public(Props {
        x1,
        y1,
        x2,
        y2,
        slope: Planned::computed(OpSpec::Div, vec![dy, dx]),
        xintercept: Planned::computed(OpSpec::Sub, vec![at.x1, q]),
        yintercept: Planned::computed(OpSpec::Sub, vec![at.y1, mx]),
        coeffvar1: Planned::own(dy),
        coeffvar2: Planned::computed(OpSpec::Sub, vec![at.x1, at.x2]),
        coeff0: Planned::computed(OpSpec::Negate, vec![sum]),
        basedOnDirection: based_on_direction,
    });
    Ok(ch)
}

/// Two hidden slots holding a direction: a point or tuple's coordinates,
/// or another line's or segment's `point2 - point1`.
fn direction(ctx: &mut PlanCtx<'_, '_>, name: &str, ch: &mut ElemPlan) -> Result<[usize; 2]> {
    let p = ctx.point(name)?.expect("the direction attribute is given");
    if let PointPlan::Ref(r) = p
        && matches!(
            ctx.reference_type(r),
            Some(ComponentType::Line | ComponentType::LineSegment)
        )
    {
        let [x1, y1, x2, y2] = ["x1", "y1", "x2", "y2"].map(|prop| ctx.reference_prop(r, prop));
        let ux = ch.hidden(SourcePlan::Op(OpSpec::Sub, vec![x2, x1]));
        let uy = ch.hidden(SourcePlan::Op(OpSpec::Sub, vec![y2, y1]));
        return Ok([ux, uy]);
    }
    Ok(ch.hidden_point(&p))
}
